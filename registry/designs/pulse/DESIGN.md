# PULSE — design spec

## Identity
박동 — a fictional record label's release page with an audio-reactive particle
nebula. A few hundred 3D-projected points on canvas 2D pulse to a simulated
beat (~120bpm, no real audio). The signature: a living, breathing starfield.
Distinct from ORBIT (product turntable): PULSE is generative and autonomous.

## Distinction from ORBIT
ORBIT = product / turntable / controlled / configurator.
PULSE = nebula / generative / autonomous / audio-reactive.

## Palette
Cosmic black `#05060f`, particle gradient white `#f0f4ff` → violet `#9d4edd` →
magenta `#ff006e`. The nebula breathes.

## Renderer
Vanilla canvas 2D, manual 3D perspective projection. NO three.js.

## Techniques
1. canvas-particles — 3D nebula pulsing to simulated beat.
2. pointer-parallax — camera tilts with pointer.
3. scroll-scrub-pinned — nebula shifts per track.

## Accessibility
Reduced motion: nebula static at composed frame. No-JS: static nebula hero.
AA contrast. Korean-first bilingual.
