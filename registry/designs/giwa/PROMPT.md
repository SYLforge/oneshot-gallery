---
provenance: distilled-recipe
model: claude-fable-5
harness: Claude Code
date: 2026-07-10
attempts: 1
verification:
  status: unverified
---

The prompt below is a distilled recipe: the full brief this entry was built
from, compressed to what a strong model needs to regenerate a comparable
page in one shot.

```text
Build a complete, art-directed landing page for a fictional brand:
GIWA — 궁궐 처마 복원공방, a palace-eave restoration guild documenting
dancheong (단청, the five-color decorative painting under Korean roof
eaves) and the obangsaek (오방색) color system. The page is the guild's
public catalog plate, no. 08. Aesthetic: korean-traditional. THEME IS
LIGHT — hanji paper. Register: museum-label dignity. Korean is the
PRIMARY language (root lang="ko"); English is the subtitle / translation
note, marked lang="en". This is heritage documentation, not decoration:
no kitsch, no orientalism, real pigment names, real pattern structure.
Stack: Next.js App Router client page ("use client"), React 19,
TypeScript strict, vanilla CSS (classes prefixed giwa-), vanilla JS
animation, zero npm dependencies, pure code — every pattern is SVG, no
raster images.

PALETTE (CSS custom properties on .giwa-root, from real obangsaek +
dancheong pigments): hanji paper #f4eee1, heuk near-black #1f1c19 (body,
14.7:1), seokganju red-brown #8a3b2a (accent — focus ring, ::selection,
links; 6.6:1), samcheong blue #2f5d9e (5.7:1, may carry text), noerok
gray-green #58796f (the dancheong ground coat — 4.2:1, decorative and
large type only; derive noerok-deep #3e5850 at 6.7:1 for secondary
text), hwang ochre #d9a441 (2.0:1 on hanji — strictly decorative there;
it may sit on heuk at 7.5:1), baek #f7f3e8 (breath lines inside the art,
never text). Derive a fired-clay tile gray (#3f3a34) from heuk for the
roof plane — the one deliberately unpainted zone. Colors snap; pigment
is never transitioned.

TYPE: Song Myung (KR display serif — the hero 단청, section titles,
hanja) + Gowun Batang (KR body serif) + Fraunces (Latin accents, applied
via [lang="en"]) through next/font/google in a fonts.ts with literal
configs. Note Song Myung exposes no `subsets` option in next/font.

VOICE (~15 lines of real copy, KO leads and must read native, EN
follows as a quieter translation note): museum-label dignity, precise
about pigments and technique. Register: "단청 — 나무를 지키고, 위계를
말하고, 아름다움을 남긴다." / "Dancheong: it protects the wood, states
the hierarchy, and leaves behind beauty." Use real terms: 석간주, 삼청,
뇌록, 석황, 호분, 먹; 가칠 → 출초·타초 → 채색 → 빛넣기·먹기화; 연화문,
머리초, 방울문, 금문; the five directions with their guardians (청룡,
주작, 황룡, 백호, 현무).

STRUCTURE (single scroll, 5 sections):
1. Hero — huge 단청 in Song Myung, "GIWA · Under Painted Eaves"
   beneath, on hanji. THE SIGNATURE: a giwa eave elevation as two
   stacked SVG layers sharing one set of computed Bézier curves
   (ridge sagging like a held rope, upturned 망와 hooks, hip lines,
   eleven tile courses, the lifted eave curve, 26 round tile-ends and
   18 rafter-end discs placed by sampling the eave cubic, a noerok
   beam band with mirrored half-lotus ends, two seokganju columns).
   Layer 1 (ink) draws itself: every path gets pathLength={1},
   stroke-dasharray 1, and a staggered stroke-dashoffset animation
   (ridge first, the eave as the long 1.5s stroke, dot rows fade in).
   Layer 2 (paint) is the same roof fully colored, revealed at ~2.05s
   by an animated clip-path inset(0 100% 0 0) → inset(0) sweep — line
   art floods with color, left to right. Roof plane stays clay gray;
   dancheong color lives only below the eave, as on a real building.
2. 오방색 — five color panels (청/적/황/백/흑) as real <button>s in a
   grid: swatch, hanja, name, direction + guardian, pigment name.
   Hover, focus, or tap activates a panel: it sets --giwa-accent-live
   on .giwa-root (section underlines and the notes rule retint —
   instantly, pigment does not ease) and reveals that color's usage
   note (aria-expanded + aria-controls; all five notes are in the DOM
   and visible without JS; baek's accent falls back to noerok-deep so
   it never vanishes on paper). Default active: 황, the center.
3. Pattern gallery — four dancheong motifs as crisp symmetric SVG,
   each built the way the guild would: 연화문 lotus medallion (one
   petal path with hwang inner layer and baek breath line, <use>
   rotated 45° × 8 around a hwang seed-pod; 녹화 leaves at 22.5°
   offsets; a samcheong band with dotted baek circle; 16 alternating
   scallops), 머리초 beam-end (half-lotus arcs + five-petal fan + 휘
   bands as stroked curves flowing inward, built once and mirrored
   with scale(-1,1) onto a noerok beam), 방울문 bell-and-tassel (knot
   diamonds, hwang bell with seokganju band, seven strands), 금문
   fret (one spiral polyline stroked three times — heuk 16.5 under
   baek 13 under samcheong 7.5 for the outlined-ribbon look — plus a
   hwang stud, translated ×6 on a seokganju ground). Each motif has a
   small ink "construction drawing" layer (compass circles, radial
   spokes) that stroke-draws at scroll-into-view, then the painted
   layer floods over it: circle() bloom for the medallion, inset
   sweep for beam/fret, top-down drop for the bell. Caption each with
   name, hanja where it exists, one dignified line, and a latin
   construction note ("one petal × rotate(45°) × 8").
4. 법식 — restoration method on layered hanji: three feTurbulence
   layers (coarse fiber, long horizontal fiber via anisotropic
   baseFrequency 0.008 0.18, sparse fleck) multiplied over a deeper
   hanji stage, drifting with the pointer at depths 4/8/−5 px —
   normalized [-1,1] vars written by a lerped (0.09/frame,
   dt-normalized) rAF hook, capped in CSS, absent on coarse pointers.
   Four steps in a 2×2 grid: 가칠, 출초·타초, 채색, 빛넣기·먹기화.
5. Footer — a norigae-style tassel SVG hangs from the closing rule
   and swings on scroll with a damped pendulum (θ″ = −16θ − 2.1ω,
   scroll impulse clamped, θ ≤ 0.24 rad, transform-only rAF, parked
   offscreen via IO and when settled). Sign-off: "오늘도 처마 밑에서
   단청은 마르고 있다.", guild data list, "© 2026 GIWA — 처마 밑의
   다섯 빛깔. Five colors under the eaves."

TEXTURE: one static page-wide feTurbulence sheet (fractalNoise 0.75,
alpha ~0.07) fixed over the viewport in multiply — plus the layered
stage in section 4. The turbulence itself never animates.

HARD REQUIREMENTS:
- prefers-reduced-motion: roofline and motifs render fully painted
  instantly (no draw, no flood), reveals visible, no parallax, tassel
  perfectly still, obangsaek accent swap stays (it is instant anyway).
  Use a usePrefersReducedMotion hook (useSyncExternalStore over
  matchMedia) plus a CSS media block.
- Touch: no hover-only meaning — obangsaek activates on tap and focus
  too; parallax simply absent on coarse pointers.
- Keyboard: panels are real <button>s; custom seokganju :focus-visible
  ring on everything.
- AA: body heuk 14.7:1; noerok never carries body text (noerok-deep
  does); hwang decorative only on hanji. Document the ratios.
- No content hidden without JS: add a .giwa-js class on mount and gate
  every pre-state (undrawn ink, unflooded paint, hidden notes,
  reveals) behind it.
- Animate only transform / opacity / clip-path / stroke-dashoffset.
- Custom ::selection (seokganju bg / hanji text) scoped to .giwa-root.
- On mount: window.parent?.postMessage({ type: "oneshot:ready",
  slug: "giwa" }, "*").
- Composed at 360px and 1440px+ (obangsaek 5 → 3 → 2 columns, gallery
  2 → 1, method steps 2 → 1).

FILES: page.tsx (default export, font variables + giwa-root +
lang="ko"), components/ (Hero, Obangsaek, PatternGallery, HanjiMethod,
Footer), hooks/ (usePrefersReducedMotion, useReveal, usePointerParallax),
styles.css (all tokens + styles), fonts.ts. Relative imports only.
```

## Known deviations

- The four motifs are **stylized recreations built from the documented
  structure of dancheong (concentric medallions, mirrored beam-ends,
  translated fret cells), not tracings of any specific heritage asset**.
  Proportions and palette assignments are the guild fiction's own; anyone
  restoring a real building should consult the real 초.
- The no-JS / SSR state is the *finished* painted page; when JS mounts,
  the hero snaps to blank paper and redraws. On slow connections the
  painted roof can flash before hydration — accepted as the price of "no
  content hidden without JS", and it reads as the plate being pulled from
  the drying rack.
- 머리초 and 방울문 and 빛넣기·먹기화 carry no hanja gloss in the UI:
  they are (part-)native Korean terms, and inventing mixed-script hanja
  for them would be false precision.
- The brief's noerok #58796f measures 4.2:1 on hanji, so it was demoted
  to surfaces and large/decorative type; a derived noerok-deep #3e5850
  (6.7:1) carries all secondary text. Hwang #d9a441 (2.0:1) never
  touches text on hanji.
- The obangsaek accent shift retints section underlines and the notes
  rule — deliberately narrow scope. Retinting text or focus rings with a
  2.0:1 ochre would have broken AA, so the focus ring stays seokganju.
- The tassel physics is not tagged as a taxonomy technique: `drag-physics`
  implies user-draggable objects, which this is not. It is documented in
  the breakdown as part of the motion system instead.
