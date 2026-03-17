# TwoVerse

## Current State
- Phase 1 complete: Dashboard (days counter, daily prompt, check-in), Chat (messages + emoji reactions), Memory Vault (photos + text), Settings (start date, theme selection)
- 5 themes: Rose Petal, Midnight Blue, Golden Hour, Forest Green, Lavender Dream
- HeartParticles canvas background animation (subtle, minimal)
- Bottom nav: Home, Chat, Memories, Settings
- Theme cards: simple list with emoji + name, no color swatches
- Buttons: standard shadcn rounded-2xl style
- Backend: checkIns, messages, memories, startDate, dailyPrompts

## Requested Changes (Diff)

### Add
- **Phase 2 features** (new pages/sections accessible via expanded bottom nav with a "More" tab):
  - **Bond Analytics**: Mood frequency chart from check-in history, weekly energy summary
  - **Couple Missions**: Shared missions with XP rewards (backend stored), completion tracking
  - **Anniversary Tracker**: Countdown to next anniversary + custom special date storage
  - **Time Capsule**: Write messages with a future unlock date (backend stored)
  - **Couple Quiz**: Pre-written compatibility questions, both partners answer, see compatibility
- **Visual upgrades**:
  - Richer HeartParticles: more particles, larger size variation, mix of ♥ hearts and ✦ sparkles, subtle glow, faster/slower speed variety, color tied to theme
  - Theme cards redesigned as 2-column grid cards with 3 color-dot swatches, name, description subtitle, selected checkmark badge (like reference screenshot)
  - Primary buttons: pill shape (rounded-full), gradient fill (from theme primary lighter to primary), full-width for form buttons, subtle shadow, press scale animation
  - All secondary/action buttons: rounded-full pill with border, hover fill

### Modify
- `ThemeContext.tsx`: Add color swatch arrays (3 colors per theme) and description text
- `HeartParticles.tsx`: Richer animation - more particles, sparkle shapes, glow, varied speeds
- `Settings.tsx`: Theme picker redesigned as 2-column card grid with swatches + description + checkmark
- `BottomNav.tsx`: Add "More" tab (grid icon) for Phase 2 feature hub, navigation extended to 5 items
- `App.tsx`: Add new page states for phase 2 pages
- `index.css`: Add gradient button utility classes per theme

### Remove
- Nothing removed

## Implementation Plan
1. Extend backend with: missions (add/complete/list), timeCapsule (add/list with unlock date check), anniversaries (add/list custom dates), quiz (add answer, get results)
2. Update ThemeContext with color swatches and descriptions
3. Redesign HeartParticles with richer animation
4. Redesign Settings theme picker and button styles
5. Create Phase 2 pages: BondAnalytics, Missions, TimeCapsule, Quiz, AnniversaryTracker
6. Create More hub page linking to phase 2 features
7. Update BottomNav to 5 items with More tab
8. Update App.tsx routing for new pages
9. Apply pill/gradient button styling globally
