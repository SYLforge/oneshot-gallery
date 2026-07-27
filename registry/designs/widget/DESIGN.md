# WIDGET — design spec

## Identity
위젯 — a productivity-app dashboard in visionOS spatial-glass style. Floating
translucent widgets over a depth gradient. Where HANJI SLATE is a single e-ink
device exploding, WIDGET is a constellation of glass dashboard widgets floating
in depth.

## Distinction from HANJI SLATE
HANJI SLATE = single device / e-ink / explode into parts.
WIDGET = spatial glass / multiple widgets / float in depth / dashboard.

## Palette
Depth gradient `#1a1f3a` → `#2d1f4a`, glass via `backdrop-filter: blur()`,
iris accent `#6366f1`. Soft elevation shadows.

## Techniques
1. pointer-parallax — widgets tilt toward pointer at depths.
2. flip-layout — Morning/Focus mode toggle.
3. clip-path-reveal — soft reveal on scroll.

## Accessibility
Reduced motion: widgets static, no parallax. No-JS: fully readable dashboard.
AA contrast on glass. Korean-first bilingual.
