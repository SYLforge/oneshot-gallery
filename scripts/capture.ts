/**
 * Capture pipeline: per-entry OG image, poster derivatives, optional WebM loop.
 *
 *   pnpm capture                  all entries
 *   pnpm capture --slug sakura    one entry
 *   pnpm capture --loop           also record a 5s scroll loop (slower)
 *   pnpm capture --url http://localhost:3939   use an already-running server
 *
 * Requires a production build (`pnpm build`) unless --url is given.
 * Outputs to public/media/<slug>/: og.png, poster-{480,960,1440}.{avif,webp},
 * loop.webm. These are committed to git — Vercel never runs this.
 */
import { execFile, spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { chromium, type Page } from "playwright";
import sharp from "sharp";

const execFileAsync = promisify(execFile);

const ROOT = path.resolve(import.meta.dirname, "..");
const MEDIA_DIR = path.join(ROOT, "public", "media");

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const opt = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const PORT = Number(opt("port") ?? 4780);
const BASE_URL = opt("url") ?? `http://localhost:${PORT}`;
const ONLY_SLUG = opt("slug");
const WITH_LOOP = flag("loop");
const SETTLE_MS = Number(opt("settle") ?? 3500);
const READY_TIMEOUT_MS = 8000;

const POSTER = { width: 1600, height: 1000 };
const OG = { width: 1200, height: 630 };
const POSTER_WIDTHS = [480, 960, 1440];

function listSlugs(): string[] {
  const index = JSON.parse(
    fs.readFileSync(path.join(ROOT, "__generated__", "gallery-index.json"), "utf8"),
  ) as { slug: string }[];
  const slugs = index.map((e) => e.slug);
  if (!ONLY_SLUG) return slugs;
  if (!slugs.includes(ONLY_SLUG)) {
    console.error(`[capture] unknown slug: ${ONLY_SLUG}`);
    process.exit(1);
  }
  return [ONLY_SLUG];
}

/** Resolves once the demo posts oneshot:ready, or after the timeout. */
async function waitForReady(page: Page) {
  await page
    .evaluate(
      `new Promise((resolve) => {
        const done = () => resolve(true);
        const h = (e) => { if (e && e.data && e.data.type === "oneshot:ready") { done(); } };
        window.addEventListener("message", h);
        setTimeout(done, ${READY_TIMEOUT_MS});
      })`,
    )
    .catch(() => undefined);
  await page.waitForTimeout(SETTLE_MS);
}

async function captureStills(slug: string) {
  const outDir = path.join(MEDIA_DIR, slug);
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  try {
    // Poster master
    const posterPage = await browser.newPage({ viewport: POSTER });
    await posterPage.goto(`${BASE_URL}/view/${slug}`, { waitUntil: "networkidle" });
    await waitForReady(posterPage);
    const master = await posterPage.screenshot({ type: "png" });
    await posterPage.close();

    for (const width of POSTER_WIDTHS) {
      const resized = sharp(master).resize(width);
      await resized
        .clone()
        .avif({ quality: 52 })
        .toFile(path.join(outDir, `poster-${width}.avif`));
      await resized
        .clone()
        .webp({ quality: 74 })
        .toFile(path.join(outDir, `poster-${width}.webp`));
    }

    // OG (its own viewport so the composition is native, not a crop)
    const ogPage = await browser.newPage({ viewport: OG });
    await ogPage.goto(`${BASE_URL}/view/${slug}`, { waitUntil: "networkidle" });
    await waitForReady(ogPage);
    await ogPage.screenshot({ type: "png", path: path.join(outDir, "og.png") });
    await ogPage.close();
  } finally {
    await browser.close();
  }
}

async function captureLoop(slug: string) {
  const outDir = path.join(MEDIA_DIR, slug);
  const tmpDir = fs.mkdtempSync(path.join(outDir, ".rec-"));

  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      recordVideo: { dir: tmpDir, size: { width: 1280, height: 800 } },
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/view/${slug}`, { waitUntil: "networkidle" });
    await waitForReady(page);
    // Scripted scroll: ease through the first ~2.5 viewports in 6s.
    for (let i = 0; i < 24; i++) {
      await page.mouse.wheel(0, 90);
      await page.waitForTimeout(250);
    }
    await context.close(); // flushes the video file
  } finally {
    await browser.close();
  }

  const recorded = fs.readdirSync(tmpDir).find((f) => f.endsWith(".webm"));
  if (!recorded) throw new Error(`no video recorded for ${slug}`);

  const ffmpegPath = (await import("ffmpeg-static")).default as unknown as string;
  await execFileAsync(ffmpegPath, [
    "-y",
    "-i", path.join(tmpDir, recorded),
    "-t", "5",
    "-an",
    "-vf", "scale=1280:-2",
    "-c:v", "libvpx-vp9",
    "-crf", "42",
    "-b:v", "0",
    path.join(outDir, "loop.webm"),
  ]);
  fs.rmSync(tmpDir, { recursive: true, force: true });

  const size = fs.statSync(path.join(outDir, "loop.webm")).size;
  if (size > 2.5 * 1024 * 1024) {
    console.warn(
      `[capture] WARN ${slug}/loop.webm is ${(size / 1024 / 1024).toFixed(1)}MB (>2.5MB) — consider a shorter/simpler loop`,
    );
  }
}

async function main() {
  const slugs = listSlugs();
  let server: ChildProcess | undefined;

  if (!opt("url")) {
    if (!fs.existsSync(path.join(ROOT, ".next"))) {
      console.error("[capture] no .next build found — run `pnpm build` first or pass --url");
      process.exit(1);
    }
    // Spawn the next binary directly (no shell) so server.kill() reaches it.
    server = spawn(
      process.execPath,
      [
        path.join(ROOT, "node_modules", "next", "dist", "bin", "next"),
        "start",
        "-p",
        String(PORT),
      ],
      { cwd: ROOT, stdio: "ignore" },
    );
    // wait for the server to answer
    const deadline = Date.now() + 30_000;
    for (;;) {
      try {
        await fetch(`${BASE_URL}/`, { redirect: "manual" });
        break;
      } catch {
        if (Date.now() > deadline) {
          server.kill();
          console.error("[capture] server did not start within 30s");
          process.exit(1);
        }
        await new Promise((r) => setTimeout(r, 500));
      }
    }
  }

  try {
    for (const slug of slugs) {
      console.log(`[capture] ${slug} — stills`);
      await captureStills(slug);
      if (WITH_LOOP) {
        console.log(`[capture] ${slug} — loop`);
        await captureLoop(slug);
      }
      const outDir = path.join(MEDIA_DIR, slug);
      const files = fs
        .readdirSync(outDir)
        .map((f) => `${f} (${(fs.statSync(path.join(outDir, f)).size / 1024).toFixed(0)}KB)`);
      console.log(`  -> ${files.join(", ")}`);
    }
  } finally {
    server?.kill();
  }
  console.log(`[capture] done — ${slugs.length} entr${slugs.length === 1 ? "y" : "ies"}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
