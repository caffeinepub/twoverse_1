# TwoVerse

## Current State
TwoVerse is a couples companion app (Version 9A) with: Dashboard, Chat, Memory Vault, Settings (10 themes, font/color customization, day/night mode), Bond Analytics, Couple Missions, Anniversary Tracker, Time Capsule, Couple Quiz, Love Letters, Photo of the Day, Couple Challenges, Love Streaks, and Relationship Levels. Backend uses Motoko with blob-storage. Frontend uses React + TypeScript + Tailwind with animated lofi heart backgrounds, frosted glass panels, and full theme system.

## Requested Changes (Diff)

### Add
- **AI Relationship Coach**: A daily tip/insight card on the Dashboard (or new section in More) based on recent mood check-in data and days together. Rule-based logic -- no external API. Tips rotate daily and respond to mood patterns (e.g. if stressed, suggest a date idea; if happy, affirm).
- **Smart Conversation Starters**: A new page/section (in More tab) showing AI-generated deep questions tailored to how long the couple has been together. Questions change daily. Categories: fun, deep, romantic, future.
- **Mood Prediction**: Backend tracks check-in history and flags when mood has been consistently low (e.g. stressed/sad for 3+ days). Shows a gentle alert card on Dashboard when triggered.
- **Seasonal Themes**: Auto-detect current date and apply a seasonal overlay or suggest a seasonal theme. Seasons: Valentine's Day (Feb 1-14), Spring (Mar-May), Summer (Jun-Aug), Autumn (Sep-Nov), Christmas/Winter (Dec 1-25), New Year (Dec 26 - Jan 7). Stored as an optional auto-theme toggle in Settings.

### Modify
- **Dashboard**: Add AI Coach tip card and Mood Prediction alert card.
- **MoreHub**: Add "AI Coach" and "Conversation Starters" entry tiles.
- **Settings**: Add "Seasonal Themes" toggle (auto-apply seasonal theme).
- **Backend**: Add endpoints for storing/retrieving AI coach tips seen, conversation starter index, and mood prediction state.

### Remove
- Nothing removed.

## Implementation Plan
1. Backend: Add `getCheckInHistory`, `getMoodPrediction`, `getCoachTipIndex`, `setCoachTipIndex`, `getConversationStarterIndex`, `setConversationStarterIndex` endpoints.
2. Frontend: Create `AICoach.tsx` page for the More tab with daily tips based on mood data.
3. Frontend: Create `ConversationStarters.tsx` page for the More tab with categorized daily questions.
4. Frontend: Add mood prediction alert banner on Dashboard when backend flags low mood streak.
5. Frontend: Add seasonal themes toggle in Settings; auto-apply seasonal theme colors when enabled.
6. Frontend: Wire new pages into App.tsx routing and MoreHub tiles.
