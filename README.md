# ● Oneshot Gallery

**Full-page designs you can actually ship.** / **그대로 출시해도 되는 풀페이지 디자인.**

An open-source gallery of art-directed, award-grade full-page frontend designs.
Every entry ships the trifecta no one else offers free:

1. **Live demo** — a full-screen, production-grade page you can scroll right now
2. **Complete source** — installable with one command: `npx shadcn add @oneshot/<slug>`
3. **Reproducible prompt** — the honest, labeled AI prompt behind the design (`PROMPT.md`)

Plus a bilingual (한국어/English) technique breakdown and a design-token sheet for each entry.

## Status

🚧 Pre-launch. Platform under construction; the launch roster targets 12+ designs across
distinct aesthetic families — sumi-e, neo-brutalism, webtoon, dancheong, terminal-core,
swiss typographic, and more.

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
pnpm dev
```

## License

Code: [MIT](./LICENSE). Generated image assets: see `ASSETS-LICENSE.md` (CC BY 4.0).
