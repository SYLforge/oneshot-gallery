/**
 * ComfyUI image-generation driver for Oneshot Gallery entries.
 *
 * Builds a txt2img (+ upscale) workflow against the local ComfyUI API,
 * submits it, polls for completion, and saves the result as AVIF + WebP
 * into public/media/<slug>/ — honoring the gallery's raster-budget rule
 * (authored payload must be AVIF/WebP, never PNG/JPG).
 *
 *   pnpm tsx scripts/comfy/generate.ts \
 *     --slug ppang \
 *     --out hero-bakery.avif \
 *     --prompt "korean webtoon style, cozy bakery interior..." \
 *     --checkpoint zenijiMixKWebtoon_v10.safetensors \
 *     --lora toonystarkKoreanWebtoonFlux_fluxLoraAlpha.safetensors \
 *     --width 1024 --height 1024 --steps 28 --cfg 6.0 \
 *     --upscale 2
 *
 * Requires ComfyUI running on http://127.0.0.1:8188.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const MEDIA_ROOT = path.join(ROOT, "public", "media");

const args = process.argv.slice(2);
const opt = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const COMFY = opt("comfy") ?? "http://127.0.0.1:8188";

interface ComfyPromptResponse {
  prompt_id: string;
  number: number;
  node_errors?: Record<string, unknown>;
}

interface HistoryEntry {
  status?: { status_str?: string; completed?: boolean; messages?: unknown[] };
  outputs?: Record<
    string,
    { images?: Array<{ filename: string; subfolder: string; type: string }> }
  >;
}

/** Construct the API-format workflow graph for txt2img + optional upscale. */
function buildWorkflow(opts: {
  positive: string;
  negative: string;
  checkpoint: string;
  lora?: string;
  loraStrength?: number;
  width: number;
  height: number;
  steps: number;
  cfg: number;
  seed: number;
  upscale: number;
}): Record<string, unknown> {
  const {
    positive,
    negative,
    checkpoint,
    lora,
    loraStrength = 0.8,
    width,
    height,
    steps,
    cfg,
    seed,
    upscale,
  } = opts;

  type ComfyNode = { class_type: string; inputs: Record<string, unknown> };
  const nodes: Record<string, ComfyNode> = {
    "4": {
      class_type: "CheckpointLoaderSimple",
      inputs: { ckpt_name: checkpoint },
    },
    "6": {
      class_type: "CLIPTextEncode",
      inputs: { text: positive },
    },
    "7": {
      class_type: "CLIPTextEncode",
      inputs: { text: negative },
    },
    "5": {
      class_type: "EmptyLatentImage",
      inputs: { width, height, batch_size: 1 },
    },
    "3": {
      class_type: "KSampler",
      inputs: {
        seed,
        steps,
        cfg,
        sampler_name: "dpmpp_2m",
        scheduler: "karras",
        denoise: 1.0,
      },
    },
    "8": { class_type: "VAEDecode", inputs: {} },
    "9": { class_type: "SaveImage", inputs: { filename_prefix: "oneshot" } },
  };

  // Wire core graph: KSampler <- (model, positive, negative, latent)
  nodes["3"].inputs.model = ["4", 0];
  nodes["3"].inputs.positive = ["6", 0];
  nodes["3"].inputs.negative = ["7", 0];
  nodes["3"].inputs.latent_image = ["5", 0];
  // VAEDecode <- (samples, vae)
  nodes["8"].inputs.samples = ["3", 0];
  nodes["8"].inputs.vae = ["4", 2];
  // CLIP encode <- clip
  nodes["6"].inputs.clip = ["4", 1];
  nodes["7"].inputs.clip = ["4", 1];
  // SaveImage <- images
  nodes["9"].inputs.images = ["8", 0];

  // Inject LoRA between checkpoint and the consumers of model/clip.
  if (lora) {
    nodes["10"] = {
      class_type: "LoraLoader",
      inputs: {
        lora_name: lora,
        strength_model: loraStrength,
        strength_clip: loraStrength,
      },
    };
    nodes["10"].inputs.model = ["4", 0];
    nodes["10"].inputs.clip = ["4", 1];
    // Rewire KSampler + CLIP encoders to read from the LoRA output.
    nodes["3"].inputs.model = ["10", 0];
    nodes["6"].inputs.clip = ["10", 1];
    nodes["7"].inputs.clip = ["10", 1];
  }

  // Optional two-stage upscale via latent upscaling for higher fidelity.
  if (upscale && upscale > 1) {
    // UpscaleModelLoader -> ImageUpscaleWithModel -> second KSampler refine.
    nodes["20"] = {
      class_type: "UpscaleModelLoader",
      inputs: { model_name: "RealESRGAN_x4plus.pth" },
    };
    nodes["21"] = {
      class_type: "ImageUpscaleWithModel",
      inputs: { upscale_model: ["20", 0] },
    };
    nodes["21"].inputs.image = ["8", 0];
    // Downscale back to target * upscale to keep size manageable, then VAEEncode.
    const targetW = Math.round(width * upscale);
    const targetH = Math.round(height * upscale);
    nodes["22"] = {
      class_type: "ImageScale",
      inputs: {
        upscale_method: "lanczos",
        width: targetW,
        height: targetH,
        crop: "disabled",
      },
    };
    nodes["22"].inputs.image = ["21", 0];
    nodes["23"] = { class_type: "VAEEncode", inputs: {} };
    nodes["23"].inputs.pixels = ["22", 0];
    nodes["23"].inputs.vae = ["4", 2];
    nodes["24"] = {
      class_type: "KSampler",
      inputs: {
        seed,
        steps: Math.max(10, Math.round(steps * 0.4)),
        cfg,
        sampler_name: "dpmpp_2m",
        scheduler: "karras",
        denoise: 0.28,
      },
    };
    const k24 = nodes["24"].inputs;
    k24.model = lora ? ["10", 0] : ["4", 0];
    k24.positive = ["6", 0];
    k24.negative = ["7", 0];
    k24.latent_image = ["23", 0];
    nodes["25"] = { class_type: "VAEDecode", inputs: {} };
    nodes["25"].inputs.samples = ["24", 0];
    nodes["25"].inputs.vae = ["4", 2];
    // Reroute SaveImage to the refined output.
    nodes["9"].inputs.images = ["25", 0];
  }

  return nodes;
}

async function pollHistory(
  promptId: string,
  saveNode: string,
  timeoutMs = 180_000,
): Promise<{ filename: string; subfolder: string; type: string }> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await fetch(`${COMFY}/history/${promptId}`);
    if (res.ok) {
      const hist = (await res.json()) as Record<string, HistoryEntry>;
      const entry = hist[promptId];
      if (entry?.outputs?.[saveNode]?.images?.[0]) {
        return entry.outputs[saveNode].images[0];
      }
      if (entry?.status?.status_str && entry.status.status_str !== "success") {
        throw new Error(`ComfyUI job failed: ${entry.status.status_str}`);
      }
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw new Error(`Timed out waiting for ComfyUI job ${promptId}`);
}

async function fetchImage(meta: {
  filename: string;
  subfolder: string;
  type: string;
}): Promise<Buffer> {
  const params = new URLSearchParams({
    filename: meta.filename,
    subfolder: meta.subfolder,
    type: meta.type,
  });
  const res = await fetch(`${COMFY}/view?${params}`);
  if (!res.ok) throw new Error(`view failed: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const slug = opt("slug");
  const outName = opt("out");
  const prompt = opt("prompt");
  if (!slug || !outName || !prompt) {
    console.error("Usage: --slug <s> --out <base>.avif --prompt <text> [opts]");
    process.exit(2);
  }
  const negative =
    opt("negative") ??
    "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, deformed";
  const checkpoint = opt("checkpoint") ?? "zenijiMixKWebtoon_v10.safetensors";
  const lora = opt("lora");
  const loraStrength = Number(opt("lora-strength") ?? 0.8);
  const width = Number(opt("width") ?? 1024);
  const height = Number(opt("height") ?? 1024);
  const steps = Number(opt("steps") ?? 28);
  const cfg = Number(opt("cfg") ?? 6.0);
  const seed = Number(opt("seed") ?? Math.floor(Math.random() * 1e16));
  const upscale = Number(opt("upscale") ?? 2);

  console.log(
    `[comfy] ${slug}/${outName} | ckpt=${checkpoint} lora=${lora ?? "-"} ` +
      `${width}x${height} steps=${steps} cfg=${cfg} seed=${seed} upscale=${upscale}x`,
  );

  // 1. Health check.
  const health = await fetch(`${COMFY}/system_stats`);
  if (!health.ok) throw new Error(`ComfyUI not reachable at ${COMFY}`);
  console.log("[comfy] server healthy");

  // 2. Submit workflow.
  const graph = buildWorkflow({
    positive: prompt,
    negative,
    checkpoint,
    lora,
    loraStrength,
    width,
    height,
    steps,
    cfg,
    seed,
    upscale,
  });
  const body = JSON.stringify({ prompt: graph });
  const submitRes = await fetch(`${COMFY}/prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  if (!submitRes.ok) {
    const detail = await submitRes.text();
    throw new Error(`submit failed (${submitRes.status}): ${detail.slice(0, 500)}`);
  }
  const submit = (await submitRes.json()) as ComfyPromptResponse;
  if (submit.node_errors && Object.keys(submit.node_errors).length) {
    throw new Error(`node errors: ${JSON.stringify(submit.node_errors).slice(0, 800)}`);
  }
  console.log(`[comfy] queued prompt_id=${submit.prompt_id}`);

  // 3. Poll for the saved image.
  const imgMeta = await pollHistory(submit.prompt_id, "9");
  console.log(`[comfy] produced ${imgMeta.filename}`);
  const pngBuf = await fetchImage(imgMeta);

  // 4. Convert to AVIF + WebP, write under public/media/<slug>/.
  const slugDir = path.join(MEDIA_ROOT, slug);
  fs.mkdirSync(slugDir, { recursive: true });
  const base = outName.replace(/\.(avif|webp|png|jpe?g)$/i, "");

  const avifPath = path.join(slugDir, `${base}.avif`);
  const webpPath = path.join(slugDir, `${base}.webp`);
  await sharp(pngBuf).avif({ quality: 80 }).toFile(avifPath);
  await sharp(pngBuf).webp({ quality: 82 }).toFile(webpPath);

  const avifKB = Math.round(fs.statSync(avifPath).size / 1024);
  const webpKB = Math.round(fs.statSync(webpPath).size / 1024);
  console.log(`[comfy] saved ${base}.avif (${avifKB} KB), ${base}.webp (${webpKB} KB)`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
});
