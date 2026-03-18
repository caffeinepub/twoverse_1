# TwoVerse

## Current State
All backend data stores (messages, memories, check-ins, missions, love letters, photos, challenges, pulses, etc.) are declared as plain `let`/`var` without `stable`, causing complete data loss on every deployment. Love Pulse send fails with "Couldn't send pulse" error. Logo uses old uploaded image with multiply blend mode.

## Requested Changes (Diff)

### Add
- `stable var` declarations for all scalar state
- Stable array backups for all Map/List data stores
- `system func preupgrade()` to serialize all Maps to stable arrays
- `system func postupgrade()` to restore Maps from stable arrays and free memory
- New generated logo in IntroScreen and Dashboard header

### Modify
- All `var` state variables → `stable var`
- `useSendLovePulse` hook to get fresh actor reference and improve error handling
- IntroScreen logo image source → new generated logo, remove `mixBlendMode: multiply`
- Dashboard header logo → new generated logo

### Remove
- `mixBlendMode: multiply` from logo img tag

## Implementation Plan
1. Rewrite backend/main.mo with stable storage (preupgrade/postupgrade hooks)
2. Update IntroScreen.tsx logo src and remove blend mode
3. Update Dashboard.tsx header logo
4. Fix useSendLovePulse hook to be more resilient
