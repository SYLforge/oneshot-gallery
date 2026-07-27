# NEON — design spec

## Identity
네온 — a cyberpunk street at 3 AM. Rain-slick neon signs, holographic
storefronts, retrowave grid. Where GRADIENT-PLAZA is an open vaporwave mall,
NEON is a claustrophobic vertical city in the rain.

## Distinction from GRADIENT-PLAZA
GRADIENT-PLAZA = open / sky / mall / speed-grid / draggable windows.
NEON = vertical / rain / street / neon signs / ASCII glow.

## Palette
Rain-black `#0a0612`, magenta `#ff2d95`, cyan `#00f0ff`, purple `#b026ff`.
Neon glow via text-shadow stacks. Rain overlay (diagonal lines).

## Techniques
1. crt-scanline — neon flicker + scanline + rain.
2. marquee — holographic storefront tickers.
3. ascii-render — neon signs as glowing ASCII.

## Accessibility
Reduced motion: no rain/flicker, signs steady. No-JS: fully readable. AA
contrast. Photosensitive-safe (flicker under 3Hz). Korean-first bilingual.
