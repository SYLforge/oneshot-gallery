/**
 * Build-time data access for gallery entries. Everything here reads from
 * disk with node:fs — import from server components only, never from
 * client components.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  entryMetaSchema,
  tokensSchema,
  type EntryMeta,
  type EntryTokens,
  type GalleryIndexEntry,
} from "@/lib/schema";

const ROOT = process.cwd();

function assertSlug(slug: string): void {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`invalid entry slug: ${slug}`);
  }
}

function designPath(slug: string, file: string): string {
  assertSlug(slug);
  return path.join(ROOT, "registry", "designs", slug, file);
}

/** Card corpus, sorted by index number. */
export function getGalleryIndex(): GalleryIndexEntry[] {
  const raw = fs.readFileSync(
    path.join(ROOT, "__generated__", "gallery-index.json"),
    "utf8",
  );
  const entries = JSON.parse(raw) as GalleryIndexEntry[];
  return entries.slice().sort((a, b) => a.no - b.no);
}

export function getEntryMeta(slug: string): EntryMeta {
  const raw = fs.readFileSync(designPath(slug, "meta.json"), "utf8");
  return entryMetaSchema.parse(JSON.parse(raw));
}

export function getEntryTokens(slug: string): EntryTokens {
  const raw = fs.readFileSync(designPath(slug, "tokens.json"), "utf8");
  return tokensSchema.parse(JSON.parse(raw));
}

/** One file of a built shadcn registry item (public/r/<slug>.json). */
export type RegistryFile = {
  path: string;
  type: string;
  target?: string;
  content: string;
};

export type RegistryItem = {
  name: string;
  title: string;
  description?: string;
  dependencies?: string[];
  files: RegistryFile[];
};

/** The built registry item — the source of truth for displayed code. */
export function getRegistryItem(slug: string): RegistryItem {
  assertSlug(slug);
  const raw = fs.readFileSync(
    path.join(ROOT, "public", "r", `${slug}.json`),
    "utf8",
  );
  return JSON.parse(raw) as RegistryItem;
}

export type PromptDoc = {
  provenance: string;
  model: string;
  harness: string;
  date: string;
  attempts?: number;
  verification?: string;
  /** Prose between the front matter and the fenced prompt block. */
  intro: string;
  /** The reproducible prompt itself (first fenced block). */
  prompt: string;
  /** "Known deviations" list items, markdown-inline formatted. */
  deviations: string[];
};

function frontMatterString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value == null ? "" : String(value);
}

export function getPromptDoc(slug: string): PromptDoc {
  const raw = fs.readFileSync(designPath(slug, "PROMPT.md"), "utf8");
  const { data, content } = matter(raw);

  const fence = /```[^\n]*\n([\s\S]*?)\n```/.exec(content);
  const prompt = fence ? fence[1] : content.trim();
  const intro = fence ? content.slice(0, fence.index).trim() : "";

  const deviationSection = content.split(/^##\s+Known deviations\s*$/m)[1] ?? "";
  const deviations = deviationSection
    .trim()
    .split(/\n(?=-\s)/)
    .map((item) =>
      item
        .replace(/^-\s+/, "")
        .replace(/\s*\n\s*/g, " ")
        .trim(),
    )
    .filter(Boolean);

  const verification = (data.verification as { status?: string } | undefined)
    ?.status;

  return {
    provenance: frontMatterString(data.provenance) || "distilled-recipe",
    model: frontMatterString(data.model),
    harness: frontMatterString(data.harness),
    date: frontMatterString(data.date),
    attempts: typeof data.attempts === "number" ? data.attempts : undefined,
    verification,
    intro,
    prompt,
    deviations,
  };
}

/** Raw DESIGN.md markdown source. */
export function getDesignDoc(slug: string): string {
  return fs.readFileSync(designPath(slug, "DESIGN.md"), "utf8");
}
