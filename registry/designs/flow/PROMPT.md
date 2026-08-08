---
provenance: distilled-recipe
model: builtin:zai-coding-plan/GLM-5.2
modelLabel: GLM-5.2
tool: zcode-cli
date: 2026-08-06
oneshot: false
followUps: 0
verification:
  status: rubric-passed
---

# FLOW — reproducible prompt

## Distilled recipe

A journaling app whose whole identity is that letters flow like water. The
third kinetic-typography entry, distinct from TYPEWAVE and STRETCH. The
signature is a canvas river: ~30 words drift along sine waves in three
planes of depth, a pointer parts them like a stone in the current, and a
pinned verse section holds while four stanzas flow past with the scroll. A
feature section names five real laws of liquid and reads each as a law of
writing. Pure code (canvas + vanilla CSS), no images, no audio, no
dependencies beyond two fontsource families. Korean-first bilingual.

## Remake notes (2026-08-06)

The first version faked the river with a `repeating-linear-gradient` of
diagonal stripes and the "flowing verse" was seven words in a flex row. The
user rated it 2–5/10 ("the SVG looks off"). The remake replaces the gradient
with a real canvas simulation: words that actually move along sines, a
pointer that actually pushes them, three planes of depth, and four full
stanzas in the verse section. NaN guards (`Number.isFinite`) on every
measured value, carried over from pulse. The three-depth composition is
borrowed from dream's cloud parallax, restated for type.

## Known deviations

- `useScrollProgress` hook retained from the original (writes `--ch-scrub`,
  the chashitsu namespace) but no longer wired into the page; the verse
  section uses its own local scroll hook that writes `--flow-scrub`. The
  orphaned hook is harmless (unimported) and kept to minimize churn.
- `useReveal` hook upgraded to the dream-style descendant observer
  (`is-in` on every `[data-reveal]` child, with batched stagger) to match
  the new component structure.
- `usePointerParallax` hook renamed its variables from the dream namespace
  (`--drm-px/--drm-py`) to the flow namespace (`--flow-px/--flow-py`).
