# Feature: Avatar + Profile Photo Upload

**Priority:** P3 | **Type:** Functional | **Complexity:** S | **Status:** Pending

## Goal
Users can personalize their identity with a profile photo or pick a generated avatar. Personal identity increases emotional ownership of the app.

## Acceptance Criteria
- [ ] Profile screen shows current avatar (default: initials in a colored circle)
- [ ] "Change photo" option: upload image (JPEG/PNG, max 2MB) or pick from 12 preset avatars
- [ ] Uploaded photo is stored as a Base64 string in user profile (no server upload needed)
- [ ] Avatar appears in home screen header chip and any future leaderboard entries
- [ ] Image cropped to a circle (CSS `border-radius: 50%`)
- [ ] File too large shows a friendly error: "Image must be under 2MB"
- [ ] Preset avatars: 12 illustrated characters (inline SVG, no external assets)

## Technical Notes
- `<input type="file" accept="image/*">` — read with `FileReader.readAsDataURL()`
- Resize client-side before storing: draw to `<canvas>` at 200×200px, export as JPEG at 0.8 quality
- Store in `user.avatarDataUrl` — included in remote sync payload

## Dependencies
- P1-T002 (user profile must exist)

## Files to Touch
- `app/ui/index.html` — profile screen, avatar picker modal
- `app/ui/app.js` — `handleAvatarUpload()`, `selectPresetAvatar()`
- `app/ui/styles.css` — avatar styles, picker modal
