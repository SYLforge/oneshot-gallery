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

# AURORA — reproducible prompt

## Distilled recipe

A SaaS launch site whose signature is a slow morphing CSS mesh gradient
(violet `#7c3aed` → fuchsia `#d946ef` → cyan `#06b6d4` → emerald `#10b981`)
breathing behind translucent glass cards. Distinct from LUMEN NORD (the 1st
glass-futurism): lumen-nord is pointer-reactive WebGL aurora + frosty Nordic
panels; AURORA is a self-morphing mesh + floating glass cards + SaaS vertical.

### Techniques
1. `scroll-scrub-pinned` — a pinned features section where glass cards
   assemble/disassemble with scroll progress.
2. `pointer-parallax` — glass cards tilt subtly toward the pointer (3D
   transform).
3. `char-split-reveal` — hero headline glyphs reveal per-letter.

### Art direction
Deep space `#0a0e1a`, animated 4-color mesh gradient (~24s morph cycle),
glass cards via `backdrop-filter: blur()` with hairline borders. Pretendard
+ Inter. Korean-first bilingual.

## Known deviations

- The mesh gradient is pure CSS (multiple animated radial-gradients), not
  WebGL — kept the gallery's zero-dependency policy. Documented honestly.
- Docs (PROMPT/breakdowns) were authored by the orchestrator after the build
  agent hit its session budget; the code is the agent's.
