import { z } from "zod";
import { taxonomyIds } from "@/registry/taxonomy";

const localized = z.object({
  en: z.string().min(1),
  ko: z.string().min(1),
});

const hex = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "accent must be a 6-digit hex color");

export const entryMetaSchema = z.object({
  $schema: z.string().optional(),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug must be kebab-case"),
  no: z.number().int().positive(),
  title: localized,
  description: localized,
  aesthetic: z.enum(taxonomyIds.aesthetics as [string, ...string[]]),
  techniques: z
    .array(z.enum(taxonomyIds.techniques as [string, ...string[]]))
    .min(1)
    .max(6),
  industry: z
    .array(z.enum(taxonomyIds.industries as [string, ...string[]]))
    .min(1)
    .max(3),
  stack: z.object({
    animation: z.enum(["gsap-lenis", "motion", "css-only", "vanilla-js"]),
    styling: z.enum(["tailwind", "vanilla-css"]),
    renderer: z.array(z.enum(["dom", "canvas", "svg", "webgl"])).min(1),
  }),
  /** npm deps installed alongside the registry item, e.g. "gsap@^3.13" */
  dependencies: z.array(z.string()).default([]),
  prompt: z.object({
    /** exact model id, e.g. "claude-fable-5" */
    model: z.string().min(1),
    modelLabel: z.string().min(1),
    tool: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    /** true only when PROMPT.md provenance is class-A one-shot */
    oneshot: z.boolean(),
    /** honest count of corrective follow-up messages */
    followUps: z.number().int().min(0),
  }),
  media: z.object({
    /** "code" = no generated assets; provenance required otherwise */
    source: z.enum(["code", "comfyui", "hybrid"]),
    provenance: localized.optional(),
    budgetKB: z.number().int().positive().max(5120).default(5120),
  }),
  /** the demo's own color scheme, used to frame its card in the chrome */
  theme: z.enum(["light", "dark"]),
  accent: hex,
  credits: z
    .array(
      z.object({
        name: z.string().min(1),
        role: z.string().min(1),
        url: z.string().url().optional(),
      }),
    )
    .default([]),
  license: z.literal("MIT"),
  published: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  featured: z.boolean().default(false),
});

export type EntryMeta = z.infer<typeof entryMetaSchema>;

/** Rendered as the Tokens tab and shipped in the registry item docs. */
export const tokensSchema = z.object({
  colors: z
    .array(z.object({ name: z.string(), value: hex, role: z.string() }))
    .min(2),
  fonts: z
    .array(
      z.object({
        family: z.string(),
        role: z.string(),
        source: z.string(),
      }),
    )
    .min(1),
  texture: z.string().optional(),
  motion: z
    .array(z.object({ name: z.string(), value: z.string() }))
    .default([]),
});

export type EntryTokens = z.infer<typeof tokensSchema>;

/** One row of __generated__/gallery-index.json — card + search corpus. */
export type GalleryIndexEntry = Pick<
  EntryMeta,
  | "slug"
  | "no"
  | "title"
  | "description"
  | "aesthetic"
  | "techniques"
  | "industry"
  | "accent"
  | "theme"
  | "published"
  | "featured"
> & {
  stack: EntryMeta["stack"];
  media: EntryMeta["media"]["source"];
};
