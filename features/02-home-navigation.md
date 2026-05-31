# Feature: Home Screen & Navigation

## Overview
The main dashboard users see after logging in. Netflix-style content browsing with horizontal scrolling shelves, subject tabs, weekly content rows, a greeting, avatar chip, and a slide-out drawer for main navigation. Designed for one-thumb use on a ₹8,000 Android phone.

---

## User Flows

### Flow 1: First View After Login

**Entry point:** User just signed in or app auto-logged in.

1. **Home screen renders** with:
   - **Greeting**: "Hello, [First Name]" (top of content area)
   - **User chip** (top-right): avatar thumbnail + first name → taps open user menu
   - **Header meta row**: current streak flame + count, XP level badge
   - **City strip** (if city partner configured): local partner branding
   - **Daily Quest bar**: 3 objectives (Practice Set · Flash Drill · GK) with live completion dots
   - **Flash Drills shelf**: horizontal scrolling cards for each drill type (Tables, Squares, etc.)
   - **Subject tabs**: Math · Science · Hindi · French · GK (horizontal scroll, snaps to selected)
   - **"This Week" content shelf**: Mon–Fri day cards for the current ISO week
   - **"Last Week" shelf** (collapsed by default): expandable with a toggle
   - **Reward notification** (if a mystery box is pending): pops up after render

2. **Subject tab is pre-selected to Math** for school users on first render.

3. **Day cards** each show:
   - Subject icon + color
   - Day label (Mon / Tue / etc.)
   - Set number (Set 1–5)
   - Completion badge if already done today
   - Lock icon if gated (Sets 3–5 require Pro plan)

---

### Flow 2: Browsing Content by Subject

1. **User taps a subject tab** (e.g., "Science")
   - Tab slides to active state; shelf content re-renders to show only Science weekly sets
   - Horizontal scroll position resets to the start of the shelf

2. **User scrolls the shelf horizontally**
   - Cards slide left/right
   - On desktop: mouse scroll wheel moves the shelf (vertical scroll → horizontal pan)
   - Arrow buttons (◀ ▶) appear at shelf edges when content overflows; tapping scrolls ~85% of viewport

3. **User taps a day card** → calls `startGoal(goalId)` → Quiz Engine begins (see Feature 03)

---

### Flow 3: Using the Drawer Navigation (Mobile)

1. **User taps the hamburger / nav icon** (top-left of header)
   - A slide-in drawer appears from the left
   - Drawer items: Home · My Journey · Settings · Sign Out

2. **User taps "My Journey"**
   - Drawer slides closed
   - Journey screen renders (see Feature 09)

3. **User taps "Settings"**
   - Drawer closes; Settings modal opens (see Feature 15)

4. **User taps outside drawer** or swipes it away
   - Drawer closes; Home remains in view

---

### Flow 4: Using the User Menu (Desktop / Chip Tap)

1. **User taps their name chip** (top-right)
   - Dropdown appears with: "My Journey" · "Settings" · "Sign Out"

2. **User selects an item** → navigates accordingly

3. **User clicks anywhere else** → dropdown dismisses

---

### Flow 5: Seeing Last Week's Content

1. On Home, a **"Last Week"** section header is visible below "This Week"
2. **User taps the section header** to expand it
   - Last week's day cards render (same format, greyed-out style indicating past)
3. User can still start any last-week set — no expiry lock

---

### Flow 6: Reward Notification Pop-up

1. After Home renders, if a mystery box reward is pending (from completing a daily quest):
   - An animated reward card slides up from the bottom
   - Shows reward type: sticker unlock, XP bonus, or streak freeze
2. **User taps "Claim"** → reward is granted, notification dismisses

---

## Subject Tab Colors & Icons

| Subject | Color | Icon |
|---|---|---|
| Mathematics | #3b82f6 (blue) | 📐 |
| Science | #22c55e (green) | 🔬 |
| Hindi | #f472b6 (pink) | 🇮🇳 |
| French | #818cf8 (indigo) | 🥖 |
| GK | #14b8a6 (teal) | 🌍 |

---

## Weekly Set Structure

| Day | Set # | Plan Requirement |
|---|---|---|
| Monday | Set 1 | Free |
| Tuesday | Set 2 | Free |
| Wednesday | Set 3 | Pro |
| Thursday | Set 4 | Pro |
| Friday | Set 5 | Pro |

Week date range is shown in the section heading (e.g., "25 - 29 May, 2026").

---

## Screens Involved
- `screens/screen-home.html`
- `app/ui/js/app-home.js` — render logic, shelves, subject tabs, day cards
- `app/ui/js/app-core.js` — wheel scroll, shelf arrows, drawer
- `app/ui/css/styles-app.css` — shelf, tab, card styles
