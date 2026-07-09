/**
 * The generator that makes one entry folder serve three roles at once:
 *   1. an app route (/view/[slug]) via __generated__/registry-index.tsx
 *   2. a shadcn registry item (public/r/<slug>.json) via registry.json
 *   3. the gallery card + search corpus via __generated__/gallery-index.json
 *
 * Run: pnpm registry:build   (also wired as "prebuild")
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import {
  entryMetaSchema,
  tokensSchema,
  type EntryMeta,
  type GalleryIndexEntry,
} from "../lib/schema";

const ROOT = path.resolve(import.meta.dirname, "..");
const DESIGNS_DIR = path.join(ROOT, "registry", "designs");
const GENERATED_DIR = path.join(ROOT, "__generated__");
const PUBLIC_R = path.join(ROOT, "public", "r");

const HOMEPAGE = "https://oneshot.gallery";
const REGISTRY_NAME = "oneshot";
const INSTALL_ROOT = "app/oneshot"; // consumer-side target root

const REQUIRED_FILES = [
  "page.tsx",
  "meta.json",
  "tokens.json",
  "PROMPT.md",
  "DESIGN.md",
  "breakdown.en.mdx",
  "breakdown.ko.mdx",
];

/** Entry-folder files that document the entry but never install. */
const NON_SHIPPED = new Set([
  "meta.json",
  "tokens.json",
  "DESIGN.md",
  "image-recipe.md",
]);
const NON_SHIPPED_DIRS = new Set(["verification", "workflows", "media"]);

type RegistryFile = {
  path: string;
  type: string;
  target: string;
};

function fail(msg: string): never {
  console.error(`\n[build-registry] ERROR: ${msg}`);
  process.exit(1);
}

function walk(dir: string, base = dir): string[] {
  const out: string[] = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (NON_SHIPPED_DIRS.has(item.name)) continue;
      out.push(...walk(abs, base));
    } else {
      out.push(path.relative(base, abs).replaceAll("\\", "/"));
    }
  }
  return out;
}

function fileType(rel: string): string {
  if (rel === "page.tsx") return "registry:page";
  if (rel.startsWith("components/")) return "registry:component";
  if (rel.startsWith("hooks/")) return "registry:hook";
  if (rel.startsWith("lib/")) return "registry:lib";
  return "registry:file";
}

function collectEntry(slug: string): {
  meta: EntryMeta;
  files: RegistryFile[];
} {
  const dir = path.join(DESIGNS_DIR, slug);

  for (const required of REQUIRED_FILES) {
    if (!fs.existsSync(path.join(dir, required))) {
      fail(`${slug}: missing required file ${required}`);
    }
  }

  const metaRaw = JSON.parse(
    fs.readFileSync(path.join(dir, "meta.json"), "utf8"),
  );
  const parsedMeta = entryMetaSchema.safeParse(metaRaw);
  if (!parsedMeta.success) {
    fail(`${slug}: invalid meta.json\n${z.prettifyError(parsedMeta.error)}`);
  }
  const meta = parsedMeta.data;
  if (meta.slug !== slug) {
    fail(`${slug}: meta.json slug "${meta.slug}" != folder name`);
  }
  if (meta.media.source !== "code" && !meta.media.provenance) {
    fail(`${slug}: media.source=${meta.media.source} requires media.provenance`);
  }

  const tokensRaw = JSON.parse(
    fs.readFileSync(path.join(dir, "tokens.json"), "utf8"),
  );
  const parsedTokens = tokensSchema.safeParse(tokensRaw);
  if (!parsedTokens.success) {
    fail(`${slug}: invalid tokens.json\n${z.prettifyError(parsedTokens.error)}`);
  }

  const shipped = walk(dir)
    .filter((rel) => !NON_SHIPPED.has(rel))
    .filter((rel) => !rel.endsWith(".mdx"));

  const files: RegistryFile[] = shipped.map((rel) => ({
    path: `registry/designs/${slug}/${rel}`,
    type: fileType(rel),
    // Explicit target for every file so the folder structure — and with it
    // every relative import — survives installation into a consumer app.
    target: `${INSTALL_ROOT}/${slug}/${rel}`,
  }));

  return { meta, files };
}

function main() {
  if (!fs.existsSync(DESIGNS_DIR)) fs.mkdirSync(DESIGNS_DIR, { recursive: true });

  const slugs = fs
    .readdirSync(DESIGNS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
    .map((d) => d.name)
    .sort();

  const entries = slugs.map(collectEntry);

  const nos = new Set<number>();
  for (const { meta } of entries) {
    if (nos.has(meta.no)) fail(`duplicate entry number: ${meta.no}`);
    nos.add(meta.no);
  }

  // 1. registry.json (committed so `shadcn build` is reproducible)
  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: REGISTRY_NAME,
    homepage: HOMEPAGE,
    items: entries.map(({ meta, files }) => ({
      name: meta.slug,
      type: "registry:block",
      title: meta.title.en,
      description: meta.description.en,
      dependencies: meta.dependencies,
      categories: [meta.aesthetic, ...meta.techniques],
      files,
      docs: `Full-page design "${meta.title.en}" installs into ${INSTALL_ROOT}/${meta.slug}/. Route it or copy the sections you need. The reproducible prompt ships alongside the code in PROMPT.md.`,
      meta: {
        no: meta.no,
        accent: meta.accent,
        theme: meta.theme,
        prompt: meta.prompt,
        media: meta.media.source,
      },
    })),
  };
  fs.writeFileSync(
    path.join(ROOT, "registry.json"),
    JSON.stringify(registry, null, 2) + "\n",
  );

  // 2. demo route index
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
  const indexLines = [
    "// AUTO-GENERATED by scripts/build-registry.ts — do not edit.",
    'import dynamic from "next/dynamic";',
    'import type { ComponentType } from "react";',
    "",
    `export const demoSlugs = ${JSON.stringify(slugs)} as const;`,
    "",
    "export const demoIndex: Record<string, ComponentType> = {",
    ...slugs.map(
      (slug) =>
        `  "${slug}": dynamic(() => import("@/registry/designs/${slug}/page")),`,
    ),
    "};",
    "",
  ];
  fs.writeFileSync(
    path.join(GENERATED_DIR, "registry-index.tsx"),
    indexLines.join("\n"),
  );

  // 3. gallery card + search corpus
  const galleryIndex: GalleryIndexEntry[] = entries.map(({ meta }) => ({
    slug: meta.slug,
    no: meta.no,
    title: meta.title,
    description: meta.description,
    aesthetic: meta.aesthetic,
    techniques: meta.techniques,
    industry: meta.industry,
    stack: meta.stack,
    media: meta.media.source,
    accent: meta.accent,
    theme: meta.theme,
    published: meta.published,
    featured: meta.featured,
  }));
  fs.writeFileSync(
    path.join(GENERATED_DIR, "gallery-index.json"),
    JSON.stringify(galleryIndex, null, 2) + "\n",
  );

  // 4. JSON schema for meta.json editor autocompletion
  fs.mkdirSync(path.join(ROOT, "public", "schema"), { recursive: true });
  fs.writeFileSync(
    path.join(ROOT, "public", "schema", "entry.json"),
    JSON.stringify(z.toJSONSchema(entryMetaSchema), null, 2) + "\n",
  );

  // 5. shadcn build → public/r/<slug>.json
  fs.mkdirSync(PUBLIC_R, { recursive: true });
  if (entries.length > 0) {
    execSync(`pnpm exec shadcn build registry.json --output public/r`, {
      cwd: ROOT,
      stdio: "inherit",
    });
  }

  console.log(
    `[build-registry] OK — ${entries.length} entr${entries.length === 1 ? "y" : "ies"}: ${slugs.join(", ") || "(none)"}`,
  );
}

main();
