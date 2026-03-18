# TwoVerse

## Current State
TwoVerse is a couples companion app with a full backend (Motoko) and React frontend. Currently live with:
- Dashboard, Chat (with voice notes), Memory Vault, Settings
- Bond Analytics, Missions, Time Capsule, Anniversary Tracker, Couple Quiz, Love Letters, Photo of the Day, Couple Challenges
- AI Relationship Coach, Conversation Starters, Mood Prediction
- Seasonal Themes, Love Streaks, Relationship Levels/XP, Day/Night Mode, Emotion Heatmap Calendar
- Couple's Universe (animated galaxy tab)

## Requested Changes (Diff)

### Add
- **Haptic Love Pulse**: A button (accessible from Dashboard or Chat) that sends a "heartbeat" vibration to the partner. Uses the Web Vibration API for the local device. Stores a pulse log in the backend so both partners can see recent pulse timestamps. Displays a pulsing animated heart UI.
- **Relationship DNA**: A new section inside Bond Analytics showing an evolving couple profile. Derived from real app data (check-ins, messages, memories, streaks, XP, challenges). Displays: top emotions from check-ins, bond personality label (e.g. "Adventurous Duo", "Cozy Homebodies"), activity summary stats, and a visual DNA strand or card layout.

### Modify
- Backend: Add `sendLovePulse`, `getLovePulses` endpoints to store/retrieve pulse timestamps
- BondAnalytics page: Add Relationship DNA section at the bottom
- Dashboard: Add a Haptic Love Pulse button/card

### Remove
- Nothing

## Implementation Plan
1. Add `LovePulse` type and storage to backend
2. Add `sendLovePulse` (shared) and `getLovePulses` (query) functions
3. Frontend: Add HapticPulse button component with animated heart and vibration
4. Frontend: Add Relationship DNA section to BondAnalytics page
5. Frontend: Add Love Pulse button to Dashboard quick-action tiles
