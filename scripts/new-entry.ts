/**
 * Scaffold a new design entry: pnpm new-entry <slug> <no>
 * Copies the file skeleton with placeholders so nothing required is forgotten.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const [slug, noArg] = process.argv.slice(2);

if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || !noArg) {
  console.error("usage: pnpm new-entry <kebab-slug> <entry-number>");
  process.exit(1);
}

const dir = path.join(ROOT, "registry", "designs", slug);
if (fs.existsSync(dir)) {
  console.error(`entry already exists: ${dir}`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const pascal = slug
  .split("-")
  .map((s) => s[0].toUpperCase() + s.slice(1))
  .join("");

const files: Record<string, string> = {
  "meta.json": JSON.stringify(
    {
      $schema: "https://oneshot.gallery/schema/entry.json",
      slug,
      no: Number(noArg),
      title: { en: "TITLE — Subtitle", ko: "제목 — 부제" },
      description: { en: "One line.", ko: "한 줄." },
      aesthetic: "editorial-serif",
      techniques: ["char-split-reveal"],
      industry: ["atelier"],
      stack: {
        animation: "vanilla-js",
        styling: "vanilla-css",
        renderer: ["dom"],
      },
      dependencies: [],
      prompt: {
        model: "claude-fable-5",
        modelLabel: "Claude Fable 5",
        tool: "claude-code",
        date: today,
        oneshot: false,
        followUps: 0,
      },
      media: { source: "code", budgetKB: 5120 },
      theme: "dark",
      accent: "#e8442e",
      credits: [],
      license: "MIT",
      published: today,
      featured: false,
    },
    null,
    2,
  ),
  "tokens.json": JSON.stringify(
    {
      colors: [
        { name: "bg", value: "#0b0b0c", role: "background" },
        { name: "text", value: "#ede9e0", role: "foreground" },
      ],
      fonts: [
        { family: "TODO", role: "display", source: "Google Fonts" },
      ],
      texture: "TODO",
      motion: [{ name: "ease-main", value: "cubic-bezier(.7,0,.2,1)" }],
    },
    null,
    2,
  ),
  "page.tsx": `"use client";

import { useEffect } from "react";
import "./styles.css";

export default function ${pascal}Page() {
  useEffect(() => {
    window.parent?.postMessage({ type: "oneshot:ready", slug: "${slug}" }, "*");
  }, []);

  return (
    <div className="${slug}-root">
      <main>
        <h1>TODO: ${slug}</h1>
      </main>
    </div>
  );
}
`,
  "styles.css": `.${slug}-root {
  --bg: #0b0b0c;
  --text: #ede9e0;

  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
}

.${slug}-root ::selection {
  background: var(--text);
  color: var(--bg);
}

@media (prefers-reduced-motion: reduce) {
  /* every animation in this entry must have a composed static state */
}
`,
  "fonts.ts": `// next/font declarations for this entry only (literal configs required).
// export const display = SomeFont({ variable: "--font-x", subsets: ["latin"] });
export {};
`,
  "PROMPT.md": `---
provenance: distilled-recipe
model: claude-fable-5
harness: Claude Code
date: ${today}
attempts: 1
verification:
  status: unverified
---

\`\`\`text
TODO: the distilled one-shot prompt.
\`\`\`

## Known deviations

- TODO
`,
  "DESIGN.md": `# ${slug} — Design tokens

## Identity

TODO (one sentence + the material/ritual metaphor)

## Palette

| token | hex | role | contrast pairing |
| --- | --- | --- | --- |

## Type system

## Texture recipe

## Motion vocabulary

## Space & shape

## Voice guide

## Do & Don't
`,
  "breakdown.en.mdx": `# TODO

`,
  "breakdown.ko.mdx": `# TODO

`,
};

fs.mkdirSync(path.join(dir, "components"), { recursive: true });
fs.mkdirSync(path.join(dir, "hooks"), { recursive: true });
for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, name), content);
}

console.log(`scaffolded registry/designs/${slug}/ — fill in the TODOs, then run pnpm registry:build`);
