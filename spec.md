# TwoVerse

## Current State
TwoVerse is a couples companion app with 5 themes (Rose Petal, Midnight Blue, Golden Hour, Forest Green, Lavender Dream), glassmorphism cards, lofi heart background, animated intro, bottom nav with glass effect, and Fraunces serif for display headings. Phase 1 + Phase 2 features all live.

## Requested Changes (Diff)

### Add
- 5 new themes to ThemeContext: Cherry Blossom, Velvet Night, Ocean Breeze, Coral Bliss, Starlight Silver (bringing total to 10)
- Micro-interaction: sparkle burst + heart pop animation when sending a chat message
- Micro-interaction: heart burst animation when submitting an emotional check-in
- Micro-interaction: glow ripple on all primary button taps
- Smaller lofi hearts in LofiHeartBackground (reduce size range from 90-200px to 40-90px, increase count to 16-18, reduce opacity slightly for lofi vibe)

### Modify
- ThemeContext: add 5 new theme objects with proper heartFill, heartHighlight, heartShadow, bgDeep, sparkleColor, gradient colors, descriptions
- index.css: add CSS variable blocks for each new theme; slightly enhance btn-primary with a shimmer animation on hover
- BottomNav: make glassmorphism more refined — increase blur to 20px, add a subtle top border gradient highlight, active tab gets a colored glow dot indicator below the label
- Settings theme grid: update to handle 10 themes cleanly in 2-column grid (no layout change needed, just works)
- Chat send button: trigger sparkle animation on send
- Dashboard check-in: trigger heart pop animation on emotion tap

### Remove
- Nothing removed

## Implementation Plan
1. Update ThemeContext with 5 new theme objects
2. Update index.css with CSS variable blocks for new themes + shimmer hover animation for btn-primary
3. Update LofiHeartBackground with smaller hearts (40-90px), more of them (16), ensure they cover screen well
4. Add sparkle burst overlay component (pure CSS keyframe, positioned absolute, renders on send action)
5. Update Chat.tsx to show sparkle burst on message send
6. Update Dashboard.tsx to show heart pop animation on check-in
7. Polish BottomNav glassmorphism (stronger blur, highlight border, colored dot for active)
8. Validate build
