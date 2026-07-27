---
provenance: distilled-recipe
model: builtin:zai-coding-plan/GLM-5.2
modelLabel: GLM-5.2
tool: zcode-cli
date: 2026-07-27
oneshot: false
followUps: 0
verification:
  status: rubric-passed
---

# WIDGET — reproducible prompt

## Distilled recipe
A productivity-app dashboard in visionOS spatial-glass style — floating
translucent widgets over a depth gradient. Where HANJI SLATE is a single e-ink
device exploding, WIDGET is a constellation of glass dashboard widgets floating
in depth. Pure code, no images.

## Techniques
1. `pointer-parallax` — widgets float at different depths toward pointer (3D
   transform via CSS custom properties --widget-px/py).
2. `flip-layout` — mode toggle (Morning / Focus) rearranges the widget grid.
3. `clip-path-reveal` — widgets reveal with soft clip-path on scroll.

## Known deviations
Built directly by orchestrator (batch 3 agents hit usage limits). Hooks copied
from rave (standard useReveal/usePrefersReducedMotion). The FLIP-layout uses a
data-mode attribute + CSS grid rather than a measured FLIP animation — simpler,
reliable, same UX intent.
