# ● Oneshot Gallery

**Full-page designs you can actually ship.** / **그대로 출시해도 되는 풀페이지 디자인.**

An open-source gallery of art-directed, award-grade full-page frontend designs.
Every entry ships the trifecta no one else offers free:

1. **Live demo** — a full-screen, production-grade page you can scroll right now
2. **Complete source** — installable with one command: `npx shadcn add @oneshot/<slug>`
3. **Reproducible prompt** — the honest, labeled AI prompt behind the design (`PROMPT.md`)

Plus a bilingual (한국어/English) technique breakdown and a design-token sheet for each entry.

## Status

**12 designs across 12 aesthetic families** — sumi-e (flagship), neo-brutalism,
dancheong, terminal-core, swiss typographic, glass, vaporwave, editorial, cinema,
nature, bento, and luxury. All live, all installable, all bilingual.

## Principles

- **MIT code, forever free.** The complete striking page is the product, not the paywall.
- **Curation is the product.** Every entry passes a published rubric (anti-slop hard gates
  + scored dimensions). See `docs/RUBRIC.md` (coming with P5).
- **Honest provenance.** Prompts are labeled `one-shot` or `distilled-recipe`, verified
  against a written protocol, with model + date attribution. Generated imagery ships with
  its full ComfyUI recipe.

## Development

```bash
pnpm install
pnpm dev          # gallery at http://localhost:3939
```

Port `3939` is fixed (see `package.json`) to avoid collisions with other local projects.
Override per-run with `pnpm dev -- --port <n>`.

## Deploy

The project is Vercel-ready (zero config). Click the button below, or:

```bash
pnpm build        # verify a clean production build first
```

Then push to GitHub and import the repo on [vercel.com/new](https://vercel.com/new).
No environment variables are required — everything is static at build time.

## License

Code: [MIT](./LICENSE). Generated image assets: see `ASSETS-LICENSE.md` (CC BY 4.0).
