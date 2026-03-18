# TwoVerse — Build 9B-2a

## Current State
TwoVerse is a couples companion app with chat, memory vault, dashboard, bond analytics, and many features from 9A and 9B-1 (love streaks, AI coach, seasonal themes, etc.). Blob storage is already integrated. Chat supports text messages with reactions, delete, and swipe-to-reply. There is no Couple's Universe tab yet.

## Requested Changes (Diff)

### Add
- **Voice Notes in Chat**: Hold-to-record audio input button in chat. Voice notes stored permanently via blob storage. Messages have an optional voiceBlob field. Voice notes playable inline in chat (Instagram-style audio player).
- **Couple's Universe Tab**: New bottom nav tab with an animated galaxy. Each star represents a memory, completed mission, or milestone (anniversaries, love letters). Stars grow/appear as the couple adds content. Tapping a star shows what it represents.

### Modify
- **ChatMessage type**: Add optional `voiceBlob: ?Storage.ExternalBlob` field.
- **sendMessage backend**: Extend to support voice note blob.
- **App.tsx**: Add `universe` to Page type, import and route to CouplesUniverse page.
- **BottomNav**: Add universe/galaxy tab icon.

### Remove
- Nothing removed.

## Implementation Plan
1. Backend: Add `sendVoiceNote(senderName, voiceBlob)` function. Update `ChatMessage` type to include optional `voiceBlob`. Add `getAllGalaxyItems` query returning count of memories, missions completed, love letters, anniversaries for galaxy rendering.
2. Frontend: Update Chat.tsx with hold-to-record mic button using MediaRecorder API, waveform display, inline audio player for voice note messages.
3. Frontend: Create CouplesUniverse.tsx — animated canvas/SVG galaxy with stars derived from all content counts. Tapping stars shows labels.
4. Frontend: Update App.tsx and BottomNav to include the new Universe tab.
