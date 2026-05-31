# Feature: Authentication & Onboarding

## Overview
The entry point for every new and returning user. Covers the landing page, account creation (Sign Up), login (Sign In), and category selection (School vs Professional). No email verification required — frictionless by design to maximise free-trial conversions.

---

## User Flows

### Flow 1: First-Time Visitor → Sign Up (School Student)

**Entry point:** User opens the app URL for the first time (or clears localStorage).

1. **Landing screen loads** — user sees:
   - Fixed top nav with logo, "Sign In" button, and smooth-scroll anchor links
   - Hero section: phone mockup with animated feature showcase (4 slides, auto-rotates every 4 seconds)
   - Headline + benefit subheadline ("See yourself grow")
   - Two CTAs: **"For Students"** and **"For Professionals"**
   - Scroll-reveal sections: features, stats counter, testimonials, FAQ

2. **User clicks "For Students"**
   - App navigates to the **Sign Up screen**
   - Category is pre-set to `school`

3. **Sign Up screen** — user fills in:
   - Full name (text input)
   - Email address (text input)
   - Password (text input, masked)
   - Grade selector (Grade 2–12, shown only for `school` category)
   - **"Create Account"** button

4. **User submits** — app:
   - Hashes password with SHA-256 (`password + ':decashift-salt'`)
   - Saves account to `localStorage` under `decashift_accounts`
   - Generates a unique `userId` (`user_` + 12-char UUID fragment) and stores it
   - Saves user profile (`name`, `email`, `category`, `grade`, `plan: 'trial'`, `trialStart`)
   - Navigates to **Home screen**

5. **Home screen renders** — user sees their first name in the greeting, avatar at Stage 1 (Spark), and subject tabs pre-filtered to Math.

---

### Flow 2: Returning User → Sign In

**Entry point:** User opens app; no active session in localStorage.

1. **Landing screen loads** (same as Flow 1 step 1)

2. **User clicks "Sign In"** (top-right nav button)
   - App navigates to **Sign In screen**

3. **Sign In screen** — user fills in:
   - Email address
   - Password
   - **"Sign In"** button

4. **User submits** — app:
   - Looks up account by email in `decashift_accounts`
   - Hashes entered password and compares to stored hash
   - If match: restores user profile, navigates to **Home screen**
   - If no match: shows inline error message ("Email or password is incorrect")

---

### Flow 3: Sign Out

**Entry point:** User is logged in, on any screen.

1. **User taps their name/avatar chip** (top-right of app header)
   - A dropdown user menu appears

2. **User selects "Sign Out"**
   - `localStorage` user key is cleared (`decashift_user` removed)
   - App navigates back to **Landing screen**
   - All session-level state is reset; locally stored question history is retained

---

### Flow 4: Professional Sign Up

**Entry point:** User clicks "For Professionals" on landing.

1. App navigates to **Sign Up screen** with category pre-set to `professional`
2. Same form as school, but **no grade selector** is shown
3. After account creation, Home screen shows professional content sets (DSA, System Design, Python, etc.)

---

## Key Behaviours & Rules

| Behaviour | Detail |
|---|---|
| No email verification | Account is active immediately — zero friction |
| 180-day free trial | New accounts get `plan: 'trial'` with `trialStart` timestamp; gates unlock after trial expires |
| Password storage | SHA-256 hash only — plain password never stored |
| Multi-account on one device | `decashift_accounts` array supports multiple accounts; each has its own `userId` |
| Grade persists | Grade selection determines which weekly content sets appear on Home |
| Auto-login | If `decashift_user` key exists in localStorage on load, landing is skipped and Home renders directly |

---

## Screens Involved
- `screens/screen-landing.html` — landing page
- `screens/screen-signup.html` — registration form
- `screens/screen-signin.html` — login form
- `app/ui/js/app-auth.js` — all auth logic
- `app/ui/js/storage.js` — account persistence, password hashing
