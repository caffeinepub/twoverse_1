# TwoVerse

## Current State
- Animated intro screen shows a '🩷 TwoVerse' text with floating hearts and glow ring
- Photo of the Day feature exists but fails with 'Couldn't save photo' error
- Love Pulse feature exists on Dashboard but fails with 'Couldn't send pulse' error
- No app logo image is used anywhere

## Requested Changes (Diff)

### Add
- Animated TwoVerse logo image (`/assets/uploads/Picsart_26-03-18_07-07-49-444-1.png`) to the IntroScreen, replacing the plain emoji/text title
- Logo should animate in with spring scale, gentle glow pulse, and subtle float
- Small logo in app header/top bar across pages for brand identity

### Modify
- Fix `useAddPhotoOfDay` in `useQueries.ts`: the `date` parameter is passed as a string (e.g. '2026-03-18') but the backend `addPhotoOfDay` expects an `Int` (nanosecond timestamp / bigint). Convert date string to `BigInt(new Date(date).getTime()) * BigInt(1_000_000)` before calling the actor.
- Fix Love Pulse: investigate and ensure `sendLovePulse` and `getLovePulses` are called correctly. If the issue is a type mismatch or actor error, correct it. Also confirm `getLovePulses` query key matches the invalidation key.

### Remove
- Plain emoji 🩷 and 'TwoVerse' text title from intro screen (replace with logo image)

## Implementation Plan
1. Fix `useAddPhotoOfDay` in `src/frontend/src/hooks/useQueries.ts` to convert string date to bigint nanoseconds
2. Verify and fix `useSendLovePulse` / `useGetLovePulses` hooks if any issues found
3. Update `IntroScreen.tsx` to use the logo image with animated entry
4. Add small logo to app header (e.g. in App.tsx or a shared header component)
