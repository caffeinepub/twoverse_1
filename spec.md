# TwoVerse — Version 6: Premium Aesthetic Upgrade

## Current State
- 10 themes in ThemeContext (Rose Petal, Midnight Blue, Golden Hour, Forest Green, Lavender Dream, Cherry Blossom, Velvet Night, Ocean Breeze, Coral Bliss, Starlight Silver)
- Lofi animated heart background (LofiHeartBackground) with 18 hearts + 5 sparkles, theme-adaptive colors
- Fraunces serif for `.font-display` headings, Figtree for body
- Gradient pill buttons (`.btn-primary`) with shimmer hover effect
- Frosted glass panels with `backdrop-filter: blur(12px)` across all pages
- Sparkle burst animation on Chat message send
- Heart burst animation on Dashboard check-in
- Glassy bottom nav with spring-animated active pill
- All Phase 1 + Phase 2 features live

## Requested Changes (Diff)

### Add
- Richer lofi heart background: reduce heart count to ~12 (smaller, fewer to match user preference), adjust sizes to be small-to-medium (20–45px range) for a subtler lofi aesthetic
- Button glow pulse on tap: add a brief radial glow ring expand-and-fade animation when `.btn-primary` is pressed
- Enhanced sparkle burst in Chat: make sparkle particles more varied (mix of ✨ 💕 🩷 symbols, slightly larger)
- Enhanced heart burst on check-in: add more hearts with slightly staggered, wider spread pattern
- Typography refinement: ensure all page `<h1>` headings use `font-display` class (Fraunces serif), section card headings use `font-display` too
- Subtle card glow: add a soft inset glow border that pulses gently on glassmorphism cards (using theme's heartFill color at low opacity)
- Intro screen polish: add a subtle shimmer text effect on the "TwoVerse" heading

### Modify
- LofiHeartBackground: reduce heart sizes (20–42px), reduce count from 18 to 12, increase float animations to be even slower (35–55s range) for a more relaxed lofi feel
- BottomNav: increase blur to `blur(32px)`, add a soft top glow line that uses the theme's primary color (via CSS custom property) instead of plain white
- All page headers: ensure consistent use of `font-display` on main headings
- Theme cards in Settings: add a subtle animated shimmer gradient sweep on the selected theme card

### Remove
- Nothing should be removed

## Implementation Plan
1. Update `LofiHeartBackground.tsx`: reduce to 12 hearts, smaller sizes (20–42px), longer durations (35–55s)
2. Update `index.css`: add `.btn-primary:active` glow pulse keyframe; refine bottom nav glow with theme-reactive color
3. Update `BottomNav.tsx`: increase blur, add theme-reactive top glow using `themeData.heartFill`
4. Update `Dashboard.tsx`: expand heart burst (more particles, wider spread); ensure all headings use `font-display`
5. Update `Chat.tsx`: enhance sparkle burst with mixed symbols; ensure headings use `font-display`
6. Update `Settings.tsx`: add shimmer on selected theme card; ensure headings use `font-display`
7. Update `IntroScreen.tsx`: add shimmer text animation on TwoVerse title
8. Review all other pages (MemoryVault, MoreHub, BondAnalytics, Missions, AnniversaryTracker, TimeCapsule, CoupleQuiz) for heading typography consistency
