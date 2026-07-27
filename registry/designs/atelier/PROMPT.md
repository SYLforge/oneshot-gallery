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

# ATELIER — reproducible prompt

## Distilled recipe
A high-fashion maison / editorial lookbook — the RESERVE collection. Pure
black/off-white + one rare antique-gold accent. Oversized Bodoni serif,
expensive silence. Distinct from ONDO (the 1st luxury-fashion): ONDO is a
single perfume bottle in SVG; ATELIER is a full collection lookbook — the
magazine-cover-as-website.

## Techniques
1. `char-split-reveal` — the maison masthead reveals letter-by-letter.
2. `scroll-scrub-pinned` — a lookbook section where "looks" crossfade as you
   scroll, like turning pages.
3. `clip-path-reveal` — editorial sections wipe in with hairline cuts.

## Known deviations
Docs + page.tsx/styles.css authored by orchestrator after build agent hit
session budget (the agent produced meta/tokens/fonts/components/hooks).
