<!--
Entry submission template · 엔트리 제출 템플릿
Review happens against docs/RUBRIC.md, in public, max 2 rounds.
Fill every section — reviewers score from this document plus the live demo.
-->

# New entry: `<slug>` — <Title EN> · <제목 KO>

- **Entry no**: <no>
- **Live route**: `/view/<slug>`
- **Tier target**: core / community

## Family declaration · 패밀리 선언

- **Aesthetic family**: `<taxonomy id>` (currently <n>/3 slots used)
- **One-sentence differentiation** vs every existing entry in this family:
  <!-- e.g. "Unlike <slug-a> (ink wash) and <slug-b> (paper collage), this one …" -->

## Definition of Done · 완료 기준 (all 18 required)

- [ ] 1. `page.tsx`: `"use client"`, default export, standalone at `/view/<slug>`, posts `oneshot:ready`
- [ ] 2. Relative imports only — no `@/`, no cross-entry, no site-chrome imports
- [ ] 3. `meta.json` valid (`lib/schema.ts`), slug matches folder, `no` unique
- [ ] 4. `tokens.json` complete — every rendered color a named token; fonts + motion captured
- [ ] 5. `fonts.ts` via `next/font`, literal configs, deliberate Korean fallback
- [ ] 6. `styles.css` scoped, custom `::selection`, real `prefers-reduced-motion` block
- [ ] 7. `PROMPT.md` honest front-matter + Known deviations section
- [ ] 8. `DESIGN.md` fully filled (identity, palette+contrast, type, texture, motion, space, voice, do/don't)
- [ ] 9. `breakdown.en.mdx` + `breakdown.ko.mdx` — every claimed technique has a section
- [ ] 10. Bilingual literary microcopy — Korean first-class, no translationese
- [ ] 11. Reduced-motion pass (emulated and eyeballed)
- [ ] 12. Keyboard pass — reachable, ordered, art-directed `:focus-visible`
- [ ] 13. Contrast pass — AA everywhere, including over texture/media
- [ ] 14. Composed at 360 px and 1440 px+
- [ ] 15. Touch pass — no hover-only affordances, scenes self-animate
- [ ] 16. Zero console errors; rAF pauses offscreen/hidden; clean unmount
- [ ] 17. Media within budget, AVIF/WebP/WebM only (`og.png` excepted); recipe shipped if generated
- [ ] 18. `pnpm validate` + `pnpm check-budget` + `pnpm lint` + `tsc --noEmit` + `registry:build` green, no uncommitted drift

## Self-scored rubric · 자가 채점

<!-- Score honestly per docs/RUBRIC.md anchors. Reviewers compare against this. -->

| # | Dimension | Self score (0–5) | Your evidence / where to look |
| --- | --- | --- | --- |
| D1 | Art direction & cohesion |  |  |
| D2 | Signature moment |  |  |
| D3 | Motion craft |  |  |
| D4 | Typography |  |  |
| D5 | Layout & composition |  |  |
| D6 | Microcopy & bilinguality |  |  |
|  | **Total** | **— / 30** |  |

## Provenance · 출처

- **Prompt class**: `one-shot` / `distilled-recipe` (matches `PROMPT.md` front-matter)
- **Model + date**: `<model id>` · `<YYYY-MM-DD>` — follow-ups: <0–2 if one-shot>
- **Media source** (`meta.media.source`): `code` / `comfyui` / `hybrid`
  - If not `code`: [ ] `image-recipe.md` committed · [ ] `workflows/*.json` committed ·
    [ ] every checkpoint used has a **passing** row in `docs/model-licenses.md`
- **Fonts**: [ ] every family in `tokens.json` is OFL or equivalently licensed for
  commercial embedding (list any exceptions here)

## Certification · 확약

- [ ] This is my original work; no code from non-MIT-compatible sources; no traced
      templates or impersonated brands
- [ ] Provenance class, model, date, and follow-up count are truthful
- [ ] I license the code under MIT and any imagery per `ASSETS-LICENSE.md` (CC BY 4.0)
- [ ] All commits are DCO signed-off (`git commit -s`)
- [ ] I have read `docs/RUBRIC.md` and accept public scoring and the two-round limit
