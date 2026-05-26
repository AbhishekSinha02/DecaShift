# Feature: Profile Page & Password Reset

**Priority:** P2 | **Type:** UX / Auth | **Complexity:** M | **Status:** Pending

## Goal
Give users a dedicated profile page where they can view stats, change their name,
and (later) reset their password — completing the account management journey.

## Current Gaps
1. No dedicated profile page — there is a profile edit modal but no "Account" screen
2. No password reset / change password flow
3. No way to delete account / clear all data
4. Profile stats not surfaced in one place (streak, sessions, accuracy)

## Implementation

### Screen: Profile / Account Page
Accessible from Home header (user avatar or "Profile" link).

**Sections:**
1. **Identity** — name, email (read-only), grade/role (editable → see P2-T012)
2. **Stats** — streak (current + best), total sessions, lifetime accuracy, total time
3. **Security** — Change Password button
4. **Data** — Download My Data (JSON export of all sessions), Delete Account

### Password Change Flow (no email — localStorage auth)
Since auth is localStorage-based (no email server):
1. User clicks "Change Password"
2. Modal: Enter current password → New password → Confirm new password
3. Validate: current password hash matches stored hash
4. Update: re-hash new password, save to localStorage + Drive account
5. Feedback: "Password updated successfully"

**Note:** No "forgot password" email link possible without a backend. Communicate
this clearly to the user: "If you forget your password, you'll need to create a new account."
Until a backend email service is added, this is the honest approach.

### Delete Account
1. Confirmation modal: "Are you sure? This will delete all your data on this device."
2. Clear all `decashift_*` localStorage keys
3. Sign out and redirect to landing page
4. Note: Drive data is NOT deleted (admin can clean up manually from Drive)

## Acceptance Criteria
- [ ] Profile page accessible from home header
- [ ] Shows: name, email, grade, streak (current + best), sessions, accuracy, time
- [ ] Change password flow: verify current → set new → confirm
- [ ] Delete account button with confirmation step
- [ ] Profile page looks correct on mobile (375px)

## Files to Touch
- `app/ui/index.html` — profile screen markup
- `app/ui/app.js` — profile screen render, change-password logic, delete-account logic
- `app/ui/styles.css` — profile page styles

## Dependencies
- P2-T012 (profile edit — grade change) should be folded into this page

## Confidence Score Impact
Improves Parameter 9 (User Journey Completeness): 5/10 → ~8/10
