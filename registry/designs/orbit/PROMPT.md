---
provenance: distilled-recipe
model: builtin:zai-coding-plan/GLM-5.2
modelLabel: GLM-5.2
tool: zcode-cli
date: 2026-07-18
oneshot: false
followUps: 0
verification:
  status: rubric-passed
---

# ORBIT — reproducible prompt

## Distilled recipe

A fictional studio that drops one sneaker silhouette at a time. The signature
sneaker sits on a turntable in a seamless studio — drag to orbit it 360°.
The gallery's first `three-d-immersive` entry, built **vanilla** (no
three.js) per the zero-dependency policy: a canvas 2.5D sprite turntable with
enough angles to feel continuous, plus an exploded-build pinned section.

### Techniques
1. `pointer-parallax` — drag-orbit the product (the turntable), pointer-driven
   rotation with inertia.
2. `scroll-scrub-pinned` — a pinned "the build" section where the product's
   layers/parts separate on scroll (exploded view).
3. `clip-path-reveal` — colorway/feature panels wipe in.

### Art direction
Studio seamless `#1a1a22` → `#2a2a36`, warm key light `#fff5e6`, cool rim
`#b8d8ff`, sneaker colorway swatches (ember, ocean, frost). Noto Sans KR +
Space Grotesk. Korean-first bilingual.

### Renderer choice
Canvas 2.5D sprite-turntable (pre-rendered angles swapped on drag with smooth
interpolation), chosen over raw WebGL for reliability and the zero-dep policy.
Documented honestly in DESIGN.md.

## Known deviations

- Docs (PROMPT/breakdowns) were authored by the orchestrator after the build
  agent hit its session budget; the code is the agent's.
