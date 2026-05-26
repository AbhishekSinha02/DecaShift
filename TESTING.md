# DecaShift — Local Testing Guide

## Run Locally (no deployment wait)

### Option 1 — VS Code Live Server (recommended)
1. Install extension: **Live Server** by Ritwick Dey
2. Right-click `app/ui/index.html` → **Open with Live Server**
3. Opens at `http://127.0.0.1:5500/app/ui/index.html`
4. Saves auto-reload — no manual refresh needed

### Option 2 — Python
```bash
cd app/ui
python -m http.server 8080
# Open http://localhost:8080
```

### Option 3 — Node
```bash
npx serve app/ui
```

---

## Dev Quick-Fill — `Ctrl+Shift+D`
On signup or signin screen, press **Ctrl+Shift+D** to pre-fill the form with test data.
Only works on localhost — disabled on production.

- **Signup fills:** Name=Test User, Email=test@test.com, Mobile=9876543210, Password=test123, Grade=6
- **Signin fills:** Email=test@test.com, Password=test123

---

## Manual Test Checklist

Run through this before every push. Takes ~3 minutes.

### Auth
- [ ] Landing page loads — hero, two path cards, stories visible
- [ ] "For Students" → signup shows grade picker
- [ ] "For Professionals" → signup shows role + company fields
- [ ] Grade = College → course dropdown appears
- [ ] Signup with empty fields → errors shown per field
- [ ] Signup success → home screen with user's first name
- [ ] Sign out → back to landing
- [ ] Sign in → home with correct goals for grade

### Grade Filtering (critical)
- [ ] Grade 6 student sees ONLY Grade 6 goals — not Grade 8, College, or Professional
- [ ] Professional user sees ONLY professional goals
- [ ] Sign out → sign in again → same filtered goals (not all goals)

### Quiz
- [ ] Start goal → quiz screen loads
- [ ] Timer counting up
- [ ] Select answer → Submit enabled
- [ ] Submit → correct = green, wrong = red
- [ ] Explanation appears after submit
- [ ] Next → progress bar advances
- [ ] Finish all questions → result screen
- [ ] Result shows score, %, badge
- [ ] Restart → quiz resets
- [ ] Back to Goals → home

### Persistence
- [ ] Complete a quiz → goal card shows "Last: X/Y"
- [ ] Sign out → sign in → "Last: X/Y" still shows
- [ ] Reset goal → score cleared

---

## Push Checklist
- [ ] All manual tests above pass locally
- [ ] No console errors in browser DevTools
- [ ] Tested on mobile width (375px) using DevTools device toolbar
