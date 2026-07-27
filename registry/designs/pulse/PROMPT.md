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

# PULSE — reproducible prompt

## Distilled recipe
A fictional record label that drops one release into the dark at a time. The
signature is a generative particle nebula — a few hundred 3D-projected points
on canvas 2D that pulse to a simulated beat (~120bpm, no real audio). Distinct
from ORBIT (the 1st three-d-immersive): ORBIT is a product turntable
(controlled); PULSE is a generative nebula (autonomous, breathing).

## Renderer
Vanilla canvas 2D with manual 3D perspective projection (a few hundred points,
cheap, reliable). NO three.js — zero-dependency policy.

## Techniques
1. `canvas-particles` — 3D-projected particle nebula pulsing to a simulated beat.
2. `pointer-parallax` — nebula's camera tilts with pointer.
3. `scroll-scrub-pinned` — nebula shifts color/intensity per track on scroll.

## Known deviations
Docs authored by orchestrator after build agent hit session budget.
