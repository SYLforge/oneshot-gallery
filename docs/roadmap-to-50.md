# Roadmap to 50 · 50개 엔트리 로드맵

The gallery's path from 18 → 50 entries, designed to surpass
[oneshot-sakura](https://oneshot-sakura.vercel.app/) and motionsites.ai
while staying free and open-source.

## The capacity math

Family cap is **3 entries per family** (CONTRIBUTING.md). To hold 50:
- Need ≥ `ceil(50 / 3) = 17` families.
- We now have **20 families** (14 existing + 6 new in taxonomy.ts), giving
  headroom for 60 entries. The cap forces curation, not filler.

## New families added (taxonomy.ts)

| Family | Why (2026 trend / gap) |
| --- | --- |
| `kinetic-typography` | Type-as-hero is a top 2026 Awwwards direction; gallery has none |
| `retro-y2k` | Dopamine/Y2K revival dominates Figma/Converge 2026 reports |
| `tactile-craft` | "Tactile brutalism" is Converge's named 2026 trend |
| `three-d-immersive` | 3D/WebGL is the most-requested award-site category |
| `ink-bloom` | The direct answer to oneshot-sakura (ink → bloom) |
| `playful-pop` (existing, was empty) | Sticker/spring UI — broad appeal, currently 0 entries |

## Distribution plan (50 entries)

### Existing families — fill to cap (3 each) where the family earns it

| Family | Have | Add to 3 | New entries |
| --- | --- | --- | --- |
| washi-sumi-e | 3 (kemuri, shan-shui, chado) | — | at cap |
| korean-traditional | 3 (giwa, minhwa, hanok) | — | at cap |
| webtoon | 2 (ppang, moonlit) | +1 | **PPANG-2 / third webtoon** |
| neo-brutalist | 1 (blunt) | +2 | **2 new** |
| editorial-serif | 1 (yeobaek) | +2 | **2 new** |
| terminal-core | 1 (pale-signal) | +2 | **2 new** |
| luxury-fashion | 1 (ondo) | +2 | **2 new** |
| cinematic-dark | 1 (halflight) | +2 | **2 new** |
| glass-futurism | 1 (lumen-nord) | +2 | **2 new** |
| swiss-typographic | 1 (raster) | +2 | **2 new** |
| organic-nature | 1 (sup) | +2 | **2 new** |
| bento-product | 1 (hanji-slate) | +2 | **2 new** |
| vaporwave | 1 (gradient-plaza) | +2 | **2 new** |
| playful-pop | 0 | +3 | **3 new** |
| Subtotal existing | | | +27 |

### New families — 3 each

| Family | Entries |
| --- | --- |
| kinetic-typography | **3 new** |
| retro-y2k | **3 new** |
| tactile-craft | **3 new** |
| three-d-immersive | **3 new** (note: vanilla JS 3D via canvas/three-lite; no heavy deps) |
| ink-bloom | **3 new** |
| Subtotal new | +15 |

Wait — existing fill (27) + new families (15) = 42 new, but we only need 32.
**Trim:** cap several existing-family fills at +1 (not +2) to land at 32.
Final per-family targets are in `docs/roster-50.csv` (to be maintained).

## Production strategy — parallel batches

Each batch = 8 entries via parallel background agents (the proven pattern).
Four batches → 32 entries. Between batches: build, capture, commit, push,
verify on Vercel so progress is always live.

| Batch | Entries | Families covered |
| --- | --- | --- |
| **B1** (19–26) | 8 | playful-pop(2), kinetic-typography(2), ink-bloom(2), third-webtoon(1), neo-brutalist(1) |
| **B2** (27–34) | 8 | retro-y2k(2), tactile-craft(2), editorial-serif(1), glass-futurism(1), organic-nature(1), swiss-typographic(1) |
| **B3** (35–42) | 8 | three-d-immersive(2), cinematic-dark(1), luxury-fashion(1), terminal-core(1), bento-product(1), vaporwave(1), kinetic-typography(1) |
| **B4** (43–50) | 8 | remaining caps: ink-bloom(1), retro-y2k(1), tactile-craft(1), three-d-immersive(1), playful-pop(1), + 3 fillers to round families to 3 |

## Quality bar (non-negotiable, per entry)

Every entry must pass the existing rubric + the new i18n standard:
- `pnpm validate` clean (schema, files, provenance, reduced-motion, preload)
- `pnpm check-budget` within 5120 KB
- `pnpm lint` + `pnpm exec tsc --noEmit` clean
- **Trilingual where the concept is non-Korean**: Korean = main reading voice,
  concept's native = decorative, English = subtitle. Korean entries = ko-first.
- AA contrast, no-JS degradable, reduced-motion safe
- Award-grade art direction — each entry must feel unmistakably itself

## The competitive thesis

- **vs oneshot-sakura**: ink-bloom family answers it directly; gallery offers
  50 complete pages + source + prompt for free where sakura offers one hero.
- **vs motionsites.ai**: it sells prompt/blocks; we ship finished, curated,
  installable (`npx shadcn add`) full-page designs under MIT. Free, forever.

## Status

- 18 entries live (deployed).
- Taxonomy expanded to 20 families.
- B1 next.

## Additional families to consider for B2–B4 (from competitor research)

The competitor-research pass (Awwwards SOTD observation + 2026 trend reports
from Figma/Wix/Vistaprint/Fireart/aigoodies) surfaced these as strong
candidates for the remaining batches. Several map onto families we already
added; others are candidates for further taxonomy growth if a batch needs
them:

- **Glitch / Databend** — datamosh, pixel-sort, RGB shift (music/gaming)
- **Memphis / Postmodern 80s** — squiggles, terrazzo, Sottsass geometries
- **Dreamcore / Pastel Surreal** — floating clouds, liminal pastel (wellness)
- **Spatial / visionOS Glass** — translucent depth panels (distinct from glass-futurism)
- **Cinematic Light-Leak** — analog film, halation, Kodak warm (distinct from cinematic-dark)
- **Risograph / Print-Press** — halftone, spot-color overprint (distinct from tactile-craft)
- **Sci-Fi HUD** — mission-control dashboards (distinct from terminal-core)
- **Anti-Design / Raw HTML** — intentional unpolish (punk zine / open-source)
- **Gradient Mesh / Aurora** — flowing multi-color mesh (SaaS/AI launch)
- **Music / Album Visualizer** — audio-reactive (entirely missing vertical)
- **Architecture Minimal** — large-format architectural photography
- **Food / Beverage Craft** — macro food, hand-lettered menus
- **Sports / Athletic** — bold slabs, motion-blur (Nike energy)
- **Product Configurator** — 3D turntable, color/trim switcher
- **Events / Festival Poster** — generative poster variants
- **Publishing / Book** — multi-column print grids, drop caps

When B2–B4 briefs are written, each new entry picks one of these directions
(or deepens an existing family toward its cap). Sources:
[Awwwards](https://www.awwwards.com/websites/),
[Figma 2026 trends](https://www.figma.com/resource-library/web-design-trends/),
[Wix 2026 trends](https://www.wix.com/blog/web-design-trends),
[Vistaprint 2026](https://www.vistaprint.com/hub/web-design-trends),
[Fireart 2026](https://fireart.studio/blog/the-best-web-design-trends/),
[aigoodies 2026](https://aigoodies.beehiiv.com/p/aesthetics-2026).

*Compiled 2026-07-18. Roster details live in this file; per-entry concepts
are specified in each batch agent's brief.*
