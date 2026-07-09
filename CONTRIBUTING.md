# Contributing to Oneshot Gallery · 기여 가이드

## 한국어 요약

- **엔트리 추가**: `pnpm new-entry <slug> <번호>` 로 스캐폴딩 후, 아래 18개 항목의
  완료 기준(Definition of Done)을 모두 충족해야 합니다.
- **패밀리 상한**: 하나의 미학 패밀리(`registry/taxonomy.ts`)당 최대 **3개** 엔트리.
  새 패밀리는 코드보다 먼저 **이슈로 제안**합니다.
- **정직한 출처 표기**: `PROMPT.md`는 `one-shot`(한 번에 생성, 수정용 후속 메시지 ≤2)
  또는 `distilled-recipe`(사후 증류된 레시피) 중 하나로 정직하게 분류합니다.
- **검증**: 프롬프트를 고정된 모델·날짜로 3회 독립 실행, 2회 이상이 21/30점을 넘으면
  `verified` 배지를 받습니다.
- **심사**: 모든 엔트리는 `docs/RUBRIC.md` 기준으로 공개 채점되며, 최대 2라운드입니다.
  거절은 친절하게, 점수와 이유와 함께 — 재제출은 언제나 환영합니다.
- **서명**: 모든 커밋에 DCO 서명(`git commit -s`)과 독창성 확약이 필요합니다.

---

## Prerequisites · 준비물

- Node 24+, pnpm 10+.
- Read [`docs/RUBRIC.md`](./docs/RUBRIC.md) first — entries are scored against it,
  in public. Read one accepted entry end-to-end (e.g. `registry/designs/pale-signal/`)
  to calibrate.
- Fluency to write (or arrange for) **both** English and Korean copy. Machine-
  translated Korean is a G1 gate failure.

```bash
pnpm install
pnpm dev            # gallery at localhost:3000, your entry at /view/<slug>
```

## Adding an entry · 엔트리 추가

```bash
pnpm new-entry <kebab-slug> <entry-number>
```

This scaffolds `registry/designs/<slug>/` with every required file as a TODO
skeleton. Everything for an entry lives colocated in that one folder (code +
`meta.json` + `tokens.json` + `PROMPT.md` + `DESIGN.md` + bilingual breakdowns);
heavy media lives at `public/media/<slug>/`. Then:

```bash
pnpm registry:build   # regenerate registry.json, __generated__/, public/r/
pnpm validate         # structural checks (schema, provenance, imports, a11y markers)
pnpm check-budget     # media weight vs meta.media.budgetKB
```

Commit the regenerated `registry.json` and `__generated__/` — CI fails on drift.

### Family cap · 패밀리 상한

Each entry commits to exactly one aesthetic family from `registry/taxonomy.ts`,
and each family holds at most **3 entries** across all tiers. This is a curation
device, not a queue: the third slot in a family goes to the submission that is
*different enough*, not the one that arrived first. Your PR must state, in one
sentence, how your entry differs from every existing entry in its family.

**New families are proposed via issue first**, before any code: name (en/ko), a
one-line blurb, three reference works, and why no existing family covers it.
Taxonomy changes land only through maintainer-approved PRs to `registry/taxonomy.ts`.

## Definition of Done · 완료 기준 (18 items)

Your PR checklist. All 18 must hold before review begins — `pnpm validate` and
`pnpm check-budget` enforce the mechanical ones.

1. `page.tsx` — `"use client"`, default export, renders the complete page
   standalone at `/view/<slug>`, and posts
   `window.parent?.postMessage({ type: "oneshot:ready", slug }, "*")` on mount.
2. All imports inside the entry are **relative** — no `@/` aliases, no imports
   from other entries, no imports from the site chrome. The folder must survive
   `npx shadcn add @oneshot/<slug>` unchanged.
3. `meta.json` validates against `lib/schema.ts`; `slug` matches the folder name;
   `no` is unique across the gallery.
4. `tokens.json` is complete: every rendered color appears as a named token with
   a role; fonts list family, role, and source; the motion vocabulary is captured.
5. `fonts.ts` declares this entry's fonts via `next/font` with literal config
   objects; Korean glyph fallback is deliberate (family stack order + `:lang(ko)`).
6. `styles.css` is scoped under the entry's root class, defines a custom
   `::selection`, and contains a real `@media (prefers-reduced-motion: reduce)`
   block that produces a complete static page.
7. `PROMPT.md` has honest front-matter (`provenance`, `model`, `harness`, `date`,
   `attempts`, `verification.status`) plus a **Known deviations** section listing
   every place the shipped page departs from the prompt.
8. `DESIGN.md` is filled in: identity sentence, palette table with contrast
   pairings, type system, texture recipe, motion vocabulary, space & shape,
   voice guide, do & don't.
9. `breakdown.en.mdx` **and** `breakdown.ko.mdx` each explain every technique tag
   claimed in `meta.json` — a tag without a breakdown section must be dropped.
10. Microcopy is bilingual and literary in both languages; Korean is first-class,
    never translationese.
11. Reduced-motion pass: verified with OS/devtools emulation — no blank regions,
    no stuck intermediate states.
12. Keyboard pass: every interactive element reachable in order, with a visible
    art-directed `:focus-visible` state.
13. Contrast pass: AA for all text, including over textures/scanlines/media.
14. Composed at 360 px and at 1440 px+ (and honest in between) — not merely
    "doesn't break".
15. Touch pass: no hover-only affordances; pointer-driven scenes self-animate.
16. Zero console errors or warnings; every rAF loop pauses offscreen and on
    hidden tabs; listeners and observers clean up on unmount.
17. Media: total ≤ `meta.media.budgetKB` (max 5120 KB) at `public/media/<slug>/`,
    AVIF/WebP/WebM only (`og.png` excepted); `media.source ≠ "code"` requires
    `image-recipe.md` + `workflows/*.json` + an audited checkpoint
    (see `ASSETS-LICENSE.md`).
18. Green locally: `pnpm validate`, `pnpm check-budget`, `pnpm lint`,
    `pnpm exec tsc --noEmit`, and `pnpm registry:build` with no diff left
    uncommitted.

## PROMPT.md honesty classes · 프롬프트 정직성 등급

Every entry declares exactly one provenance class in `PROMPT.md` front-matter.
Misclassification is the one offense that gets an entry pulled from the gallery.

### `one-shot` (Class A)

The shipped page was produced by the model from the recorded prompt in a
**single message**, with at most **2 fix-only follow-ups**. A fix-only follow-up
may point at a defect ("the build fails", "section 3 overlaps the footer") but
may not add scope, direct new design decisions, or paste code. If a follow-up
did any of those, the entry is `distilled-recipe`. Set `meta.prompt.oneshot: true`
and record the honest `followUps` count (0–2).

### `distilled-recipe` (Class B)

The page was built iteratively (human + AI, any number of rounds). `PROMPT.md`
then contains a **distilled recipe written after the fact**: the full brief,
compressed to what a strong model needs to regenerate a *comparable* page in one
shot — including palette hexes, structure, motion specs, and the hard
requirements. Set `meta.prompt.oneshot: false`. Distilled recipes are not
second-class: they are often more valuable than lucky one-shots. They are just
labeled honestly.

Both classes pin **`model` (exact id, e.g. `claude-fable-5`) and `date`** in
front-matter. A prompt is a claim about a specific model on a specific day.

## Verification protocol · 검증 프로토콜 (summary)

Full protocol lives with the reviewers; the contract is:

- A verifier runs the `PROMPT.md` prompt **3 independent times** against the
  pinned model (fresh context each run, fix-only follow-ups allowed per class A
  rules).
- Each output is scored on the six rubric dimensions. If **≥ 2 of 3 runs score
  ≥ 21/30**, the entry's front-matter is updated to `verification.status: verified`
  and the gallery shows a **verified** badge.
- Otherwise the status stays `unverified` (the badge simply doesn't show) — or, if
  the outputs bear no resemblance to the entry, the provenance class itself is
  challenged in review.
- Verification records (run dates, scores, verifier) live under the entry's
  `verification/` folder, which never ships to consumers.
- Verification is pinned: it attests to `model` + `date` as recorded. Model
  deprecation does not revoke a badge; re-verification against a newer model is
  a new record, not an edit.

## Tiers · 티어

- **Core · 코어** — the curated roster (threshold ≥ 25/30, art direction and
  signature moment ≥ 4). Core entries carry the gallery's front page;
  `featured: true` (flagship, ≥ 27/30, no dimension < 4) is chosen among them.
- **Community · 커뮤니티** — the open shelf (threshold ≥ 21/30). Same hard gates,
  same honesty rules, listed under a community heading. Community entries can be
  promoted to core in a later review round if they grow.

## Rejection culture · 거절 문화

Most submissions will be declined. That is the point of a curated gallery, and we
commit to doing it well:

- **Public curation log.** Every decision — accept or decline — is a scored,
  public PR comment using the rubric template. The log of what was declined and
  why is part of the product.
- **Kind, specific, actionable.** A rejection names scores, the one thing that
  must change, and the one thing that must not. Never "not a good fit".
- **Resubmission is welcomed**, explicitly, in every close message. A declined
  slug is not burned; a reworked entry starts a fresh two-round review.

## Governance · 거버넌스

Maintainers own the rubric, the taxonomy, tier decisions, and the final merge.
Changes to `docs/RUBRIC.md` or `registry/taxonomy.ts` happen via PR with open
discussion — the bar itself is versioned in public. Scoring disagreements are
resolved by a second maintainer scoring independently; the entry takes the mean,
gates take the stricter reading.

## DCO & originality certification · DCO·독창성 확약

All commits must carry a Developer Certificate of Origin sign-off:

```bash
git commit -s   # adds "Signed-off-by: Your Name <you@example.com>"
```

By signing off and submitting an entry you certify that:

- the work is yours to contribute under **MIT** (code) and **CC BY 4.0**
  (generated imagery — see `ASSETS-LICENSE.md`);
- no code was copied from non-MIT-compatible sources; no design was traced from
  a paywalled template or an existing site's substantial expression;
- the provenance class, model id, date, and follow-up count in `PROMPT.md` and
  `meta.json` are truthful;
- fonts and any media are licensed for commercial redistribution, and generated
  imagery discloses its full recipe.
