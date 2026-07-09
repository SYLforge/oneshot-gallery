# The Oneshot Gallery Rubric · 원샷 갤러리 루브릭

> This is the PR-enforceable version of the quality bar. Every entry PR is scored
> against this document, in public, using the fixed template at the bottom.
> 모든 엔트리 PR은 이 문서를 기준으로, 공개적으로, 아래의 고정 템플릿을 사용해 심사됩니다.

## Philosophy · 철학

**Curation is the product.** Anyone can generate a landing page in 2026; the entire
value of this gallery is that an entry here *means something*. We would rather ship
12 designs that each feel inevitable than 200 that feel generated. The rubric exists
so that "good enough" has a number, rejection has a reason, and the bar never quietly
drifts downward. It is enforced in two stages: four **hard gates** (G1–G4) that are
pass/fail — a single failure blocks merge regardless of scores — and **six scored
dimensions** (0–5 each, 30 points total) that decide the entry's tier.

큐레이션이 곧 제품입니다. 랜딩 페이지는 누구나 생성할 수 있는 시대이므로, 이 갤러리의
가치는 "여기에 실렸다"는 사실이 의미를 갖는 데서 나옵니다. 심사는 두 단계입니다:
합격/불합격의 **하드 게이트**(G1–G4) — 하나라도 실패하면 점수와 무관하게 머지 불가 —
그리고 티어를 결정하는 **6개 채점 항목**(각 0–5점, 총 30점).

---

## Hard gates · 하드 게이트

All four gates must pass before scoring begins. A gate failure is not a low score —
it is a blocked merge with a specific checklist item to fix.
네 게이트를 모두 통과해야 채점이 시작됩니다.

### G1 — Anti-slop · 안티슬롭

The entry must be un-mistakable for template output or default-styled AI generation.

- [ ] No stock "AI look": no purple-to-blue gradient hero, no glassmorphism-by-default,
      no emoji-bullet feature grid, no centered-hero + three-cards template skeleton.
- [ ] Committed palette: every rendered color is a named token declared in
      `tokens.json` / `styles.css` custom properties. No stray hexes, no colors
      outside the sheet.
- [ ] A real fictional brand with a coherent premise — a place, a practice, a reason
      to exist. Never "Acme", never "Lorem Ipsum Inc."
- [ ] Real, literary microcopy in **both** languages. Korean is first-class copywriting,
      never translationese (번역투 금지). No lorem ipsum anywhere, including alt text.
- [ ] A deliberate type system (display + body + Korean handling via `fonts.ts`).
      Korean text must never fall through to the default sans stack.
- [ ] The design commits to exactly one aesthetic family (see `registry/taxonomy.ts`)
      and would be recognizable from a grayscale screenshot.

### G2 — Accessibility · 접근성

- [ ] `prefers-reduced-motion: reduce` yields a complete, composed, static page —
      not a blank or broken one. Every animation has a designed static end state.
- [ ] Everything interactive is keyboard-reachable, in a sensible order, with a
      visible custom `:focus-visible` treatment that belongs to the art direction.
- [ ] Text contrast meets WCAG AA (4.5:1 body, 3:1 large text) — including text
      rendered over textures, scanlines, video, or canvas.
- [ ] Split/animated text uses `aria-label` on the container + `aria-hidden`
      animated spans. Canvas/WebGL scenes carry `role="img"` and a bilingual
      description.
- [ ] Fully usable on touch devices: nothing essential lives behind hover; pointer-
      driven scenes have an autonomous fallback.
- [ ] No text is hidden without JavaScript: the SSR state is the completed page;
      pre-reveal styles are gated behind a JS-mounted class.

### G3 — Performance · 성능

- [ ] Animations touch only `transform`, `opacity`, and `filter`. No layout
      properties in animation, no forced synchronous layout in scroll handlers.
- [ ] Every rAF loop pauses when its scene is offscreen (IntersectionObserver)
      and when the tab is hidden.
- [ ] Canvas work is DPR-aware and capped; heavy scenes degrade gracefully.
- [ ] Total media weight for the entry is within `meta.media.budgetKB`
      (default and maximum 5120 KB), enforced by `pnpm check-budget`.
- [ ] Media formats: AVIF/WebP for stills, WebM for loops. No `.png`/`.jpg`
      payloads (the social card `og.png` is the sole exception).
      No `preload="auto"` anywhere.
- [ ] Fonts load via `next/font` with subsetting; no unstyled-text flash beyond
      `display: swap`, no layout shift from font loading.
- [ ] Smooth (target 60fps) on mid-range hardware; zero console errors or warnings.

### G4 — Provenance · 출처

- [ ] `PROMPT.md` exists with honest front-matter: `provenance` class
      (`one-shot` | `distilled-recipe`), exact `model` id, `harness`, `date`,
      `attempts`, and a `verification.status`. See `CONTRIBUTING.md` for class
      definitions and the verification protocol.
- [ ] `meta.json` `prompt.oneshot` / `prompt.followUps` agree with `PROMPT.md`.
- [ ] Any generated imagery (`media.source` ≠ `"code"`) ships its full recipe:
      `image-recipe.md` + exported ComfyUI workflow JSON under `workflows/`,
      **and** the checkpoint used has a passing row in `docs/model-licenses.md`.
      See `ASSETS-LICENSE.md`.
- [ ] All fonts are licensed for this use (OFL or equivalently free for
      commercial embedding), named in `tokens.json` with their source.
- [ ] No code copied from non-MIT-compatible sources; no real trademarks,
      logos, or living brands impersonated.

---

## Scored dimensions · 채점 항목

Each dimension is scored 0–5. Anchors are given for 1, 3, and 5; use 2 and 4 for
"between anchors". Half points are not used. Total is out of 30.
각 항목은 0–5점으로 채점하며 1·3·5점의 기준 서술을 앵커로 사용합니다.

### D1 — Art direction & cohesion · 아트 디렉션·일관성

- **1** — A theme is named but not committed to: the palette, type, and motion could
  be swapped into any other entry without anyone noticing. Reads as a styled template.
- **3** — A clear aesthetic identity with a consistent palette and type system;
  a few elements (a default-looking button, an off-voice heading) break character.
- **5** — Total commitment. Every pixel, easing curve, and line of microcopy serves
  one premise; the entry would be identifiable from a corner crop. Nothing generic
  survived.

### D2 — Signature moment · 시그니처 모먼트

- **1** — Nothing you would describe to a friend. Scroll fades and hover lifts only.
- **3** — One genuinely memorable scene or interaction, competently executed but
  similar to known references, or slightly under-polished at the edges.
- **5** — At least one scene people will screen-record: an interaction or reveal
  with its own physics/logic, flawless in the details (enter, idle, exit, reduced-
  motion fallback), that could headline the gallery.

### D3 — Motion craft · 모션 크래프트

- **1** — Default durations and easings; animations fire once and are forgotten;
  stagger and rhythm are accidental.
- **3** — Tuned curves and coherent choreography; the motion vocabulary is
  documented in `tokens.json`; minor timing or interruption bugs remain.
- **5** — Motion behaves like a material: consistent physics across the page,
  interruptible and scrubbable where appropriate, velocity-aware where it matters,
  and every technique tag in `meta.json` is earned on screen.

### D4 — Typography · 타이포그래피

- **1** — System-default feel; a single weight doing every job; Korean set as an
  afterthought in a fallback face; scale is timid and unconsidered.
- **3** — A deliberate display/body pairing, correct Korean font handling, a working
  scale — but the type never takes a risk; it is correct rather than composed.
- **5** — The pairing feels inevitable; scale is dramatic and controlled; tracking,
  optical sizes, and line rhythm are tuned; hangul and CJK glyphs are treated as
  designed material, not fallback output.

### D5 — Layout & composition · 레이아웃·구성

- **1** — A centered single-column stack of sections; whitespace is whatever was
  left over; nothing about the composition belongs to this entry specifically.
- **3** — A competent grid with intentional variation between sections; asymmetry
  appears but occasionally reads as accident; density is even where it should swing.
- **5** — Whitespace and rhythm carry the page; asymmetry is deliberate and
  repeatedly resolved; every viewport width reads as its own composed poster,
  not a reflow artifact.

### D6 — Microcopy & bilinguality · 마이크로카피·이중언어

- **1** — Placeholder or filler copy; the second language is a line-by-line
  translation that reads as one; voice stops at the hero.
- **3** — Competent English with translated Korean (or vice versa); the voice is
  consistent but generic in spots; labels and alt text fall out of character.
- **5** — Both languages read as written-in-that-language; the voice extends the
  entry's premise from hero to footer to `alt` text; the Korean is literary on its
  own terms, never translationese.

---

## Thresholds · 승급 기준

| Tier · 티어 | Total · 총점 | Floor · 최저점 | Extra requirements · 추가 조건 |
| --- | --- | --- | --- |
| **Flagship** (featured) · 플래그십 | ≥ 27 / 30 | no dimension < 4 | — |
| **Core** · 코어 | ≥ 25 / 30 | no dimension < 3 | D1 Art direction ≥ 4 **and** D2 Signature moment ≥ 4 |
| **Community** · 커뮤니티 | ≥ 21 / 30 | no dimension < 3 | — |

Entries below the community threshold are declined (kindly — see the rejection
culture note in `CONTRIBUTING.md`) with their scores published, and resubmission
after rework is always welcome.

## Scoring process · 채점 절차

1. **Fixed template.** Reviewers score with the exact template below — no freeform
   verdicts. This keeps scores comparable across entries and reviewers.
2. **Public scores.** The filled template is posted as a PR comment. Scores are
   never private; the curation log is part of the product.
3. **Max two rounds.** Round 1 scores the submission and lists what must change.
   The author revises once; round 2 is final for that submission. If it still
   misses its target tier, the PR is closed with thanks and an explicit
   "resubmission welcome" — not left to rot.
4. Gate failures stop the clock: fixing a hard gate does not consume a round.

채점은 고정 템플릿으로, 결과는 PR 코멘트로 공개되며, 한 제출당 최대 2라운드입니다.
하드 게이트 수정은 라운드를 소모하지 않습니다.

### Review-comment template · 리뷰 코멘트 템플릿

```markdown
## Rubric review — <slug> · round <1|2>

### Hard gates
- [ ] G1 Anti-slop — 안티슬롭
- [ ] G2 Accessibility — 접근성
- [ ] G3 Performance — 성능
- [ ] G4 Provenance — 출처

Gate notes (required for any unchecked box):
- …

### Scores

| # | Dimension | Score (0–5) | Notes |
| --- | --- | --- | --- |
| D1 | Art direction & cohesion |  |  |
| D2 | Signature moment |  |  |
| D3 | Motion craft |  |  |
| D4 | Typography |  |  |
| D5 | Layout & composition |  |  |
| D6 | Microcopy & bilinguality |  |  |
|  | **Total** | **— / 30** |  |

### Decision
- Tier reached: flagship / core / community / below threshold
- Verdict: **accept** | **revise** (round 2 of 2) | **decline — resubmission welcome**
- One thing that must change: …
- One thing that must not change: …
```
