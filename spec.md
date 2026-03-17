# TwoVerse

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- **Dashboard page**: Days-together counter (configurable start date), daily emotional check-in (happy, calm, stressed, tired, excited, sad), rotating daily prompt
- **Chat page**: Shared text chat with emoji reactions on messages
- **Memory Vault page**: Upload photos and write text memories; display as a gallery/list
- **Settings page**: Theme customizer with preset themes (default: soft pink + 3-4 extras), start date configuration
- **Animated background**: Soft pink heart particles floating on white background (canvas-based)
- **Navigation**: Bottom mobile-friendly nav bar (Dashboard, Chat, Memory Vault, Settings)

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: Store chat messages (text + emoji reactions), memory vault entries (text + optional blob reference), daily check-ins (emotion + timestamp), couple start date setting, daily prompts (rotating by day index)
2. Frontend: 4-page app with bottom nav, animated heart particle background, theme context with 4+ preset themes, mobile-first layout
3. Blob storage component for photo uploads in Memory Vault
4. All data stored on-chain (Internet Computer encryption)
