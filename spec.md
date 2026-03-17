# TwoVerse

## Current State
HeartParticles.tsx renders small Unicode heart/sparkle/star glyphs on a canvas that float upward. The background color is set via `bgColor` from `THEMES[].colors[2]` (a light pastel). Font readability on these backgrounds is generally fine but will need attention once the background becomes richer/darker.

## Requested Changes (Diff)

### Add
- New `LofiHeartBackground` component replacing HeartParticles, rendering large glossy 3D-style lofi hearts (SVG with radial gradient for depth/shine) that slowly drift and float across the entire screen
- Sparkle star-burst SVG elements scattered among the hearts
- Rich saturated background color per theme (use `THEMES[].colors[0]` primary color as base, darkened)
- Theme color data: add `bgDeep` (rich/dark background) and `heartGlow` (glow color) per theme in ThemeContext

### Modify
- `ThemeContext.tsx`: add `bgDeep` and `heartFill`/`heartGlow` per theme for the new background
- `App.tsx`: use `bgDeep` instead of `colors[2]` for background color; swap `<HeartParticles>` for `<LofiHeartBackground>`
- Font/text contrast: ensure all page text (headings, labels, card text) is readable against the new rich saturated backgrounds. Cards should have semi-transparent white/dark backgrounds so text is legible.
- Apply background change across all screens (it's already global via App.tsx wrapper)

### Remove
- `HeartParticles.tsx` canvas component (replaced entirely)

## Implementation Plan
1. Update `ThemeContext.tsx` to add `bgDeep`, `heartFill`, `heartGlow`, `sparkleColor` per theme
2. Create `LofiHeartBackground.tsx` -- CSS-animated component with 8-10 large SVG hearts (radial gradient, glossy), 3-4 sparkle bursts, very slow movement (20-40s animation durations), using theme colors
3. Update `App.tsx` to use `bgDeep` for background and swap heart component
4. Update `index.css` and page-level cards/text to ensure legibility -- add semi-transparent card overlays where needed
