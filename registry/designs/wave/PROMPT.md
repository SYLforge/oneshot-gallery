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

# WAVE — reproducible prompt

## Distilled recipe
A podcast/music-network analytics dashboard whose signature is a live ASCII
spectrum analyzer — 48 box-character bars (▁▂▃▄▅▆▇█) driven by a simulated
beat (no real audio). Where PALE.SIGNAL is poetry/logs and GLITCH is
corruption, WAVE is data-visualization — a functional terminal dashboard.

## Techniques
1. `ascii-render` — the live spectrum analyzer as animated box-character bars.
2. `typewriter` — the tagline types itself.
3. `marquee` — scrolling now-playing ticker.

## Known deviations
Docs + page.tsx/styles.css authored by orchestrator after build agent hit
session budget (the agent produced meta/tokens/fonts/hooks).
