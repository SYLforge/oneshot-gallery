# WIDGET — design spec

## Identity
위젯 — a spatial glass dashboard in visionOS glass-futurism style. A
constellation of translucent widgets floating at different depths over an
aurora ground, tilting toward the pointer like held glass. Where HANJI SLATE
is a single e-ink device exploding, WIDGET is a field of glass suspended in
3D space.

## Distinction from HANJI SLATE
HANJI SLATE = single device / e-ink / explode into parts.
WIDGET = spatial glass / many widgets / float at depth / dashboard.

## Structure (benchmark pattern)
- `page.tsx` — orchestrator (~80 lines): wires hooks, renders sections.
- `components/SpatialStage.tsx` — the signature: a perspective stage holding
  the widget field; `usePointerParallax` drives the per-card 3D tilt.
- `components/WidgetCard.tsx` — one glass widget; renders per `kind`.
- `components/widgets.ts` — the eight widgets' bilingual data.
- `hooks/usePointerParallax.ts` — rAF-lerped depth-scaled pointer parallax.
- `hooks/useReveal.ts`, `hooks/usePrefersReducedMotion.ts` — standard.

## Palette
Depth gradient `#1a1830` → `#2a1f4a` → `#150f28`, glass via
`backdrop-filter: blur(12px) saturate(160%)` over `rgba(255,255,255,0.12)`,
iris accent `#6366f1`, aqua `#22d3ee`, rose `#fb7185`, emerald `#34d399`.
Multi-layer shadow (bevel + ambient + key + contact) plus contact drop-shadow.

## Techniques
1. pointer-parallax — widgets tilt toward pointer, scaled by depth (near/mid/far).
2. spatial-depth — `data-depth` drives tilt, lift, and contact shadow together.
3. glass-surface — blur+saturate, alpha surface, multi-layer shadow.
4. clip-path-reveal — widgets wipe in on scroll, staggered in depth order.

## The eight widgets
1. Weather (near) — temp, condition, hourly.
2. Schedule (mid) — next meeting, countdown, list.
3. Weekly chart (far) — total, delta, bars.
4. Now playing (mid) — track, progress, controls.
5. Activity (near) — steps, move ring.
6. Air & sun (far) — PM2.5, UV, wind.
7. Focus timer (mid) — remaining, progress.
8. Messages (far) — count, three previews.

## Accessibility
Reduced motion: parallax never starts; dashboard stands flat and complete.
No-JS: SSR markup is the finished dashboard. AA/AAA contrast on glass.
Korean-first bilingual with `:lang(ko)` metrics. focus-visible throughout.
