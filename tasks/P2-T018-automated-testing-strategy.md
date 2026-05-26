# Feature: Fully Automated Testing Strategy

**Priority:** P2 | **Type:** Quality / DevOps | **Complexity:** M | **Status:** Pending

## Goal
End-to-end automated tests that run on every push to main, catch regressions before
they reach GitHub Pages, and cover all critical user flows — auth, question loading,
session save, streak, and trial gate.

---

## Tech Stack Choice

| Option | Verdict |
|---|---|
| Jest / Vitest | Requires npm/bundler — violates no-build-tools constraint |
| Cypress | Heavy, browser-only, slower CI |
| **Playwright** | Lightweight, runs against live URL or local server, GitHub Actions native |

**Decision: Playwright** — dev-only dependency (not shipped with the app), runs against
the GitHub Pages URL directly in CI, or against a local `http-server` for pre-push checks.

---

## Folder Structure

```
decashift/
├── tests/
│   ├── playwright.config.js
│   ├── auth.spec.js          ← signup, signin, signout flows
│   ├── questions.spec.js     ← manifest load, question render, answer submit
│   ├── session.spec.js       ← session save, result screen, streak increment
│   ├── trial.spec.js         ← trial gate, soft lock, upgrade prompt
│   └── helpers/
│       └── test-data.js      ← shared user fixtures, localStorage helpers
├── package.json              ← dev deps only: @playwright/test
└── .github/
    └── workflows/
        └── test.yml          ← runs on push to main
```

The app itself stays pure HTML/CSS/JS. `package.json` is for test tooling only.

---

## Test Cases

### auth.spec.js
```
✓ New user can sign up with email + password
✓ Duplicate email shows error message
✓ Existing user can sign in
✓ Wrong password shows error
✓ Signed-in user sees home screen (not landing)
✓ Sign out returns to landing page
✓ Page refresh keeps user signed in (session persistence)
✓ Clear localStorage → Drive fetch restores profile (cross-device simulation)
```

### questions.spec.js
```
✓ Grade 5 student sees mathematics questions only
✓ Grade 8 student sees science questions only
✓ College user sees college goals (web-dev, dsa)
✓ Professional user sees professional goals
✓ User with preferredLanguage set sees language goal card
✓ Question card renders question text + 4 options
✓ Answer selection highlights chosen option
✓ Submit reveals correct (green) / wrong (red)
✓ Next question advances progress bar
✓ Question 10 of 10 goes to result screen
```

### session.spec.js
```
✓ Result screen shows correct score after session
✓ Accuracy percentage is correct
✓ Session is saved to localStorage after completion
✓ Streak increments by 1 after first session of the day
✓ Streak does not increment on second session same day
✓ Starting new session on same goal works after completing one
```

### trial.spec.js
```
✓ New user (day 0) has full access to fresh questions
✓ User with plan:'pro' always has full access
✓ User with createdAt 16 days ago + plan:'free' gets soft lock
✓ Soft-locked user sees only previously answered questions
✓ Soft-locked user with 0 answers sees upgrade screen
✓ Upgrade screen shows ₹199/month Stripe link
```

---

## playwright.config.js

```js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: process.env.TEST_URL || 'http://localhost:8080/app/ui',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox',  use: { browserName: 'firefox'  } }
  ]
});
```

---

## GitHub Actions Workflow (.github/workflows/test.yml)

```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium firefox

      - name: Start local server
        run: npx http-server . -p 8080 &
        working-directory: ${{ github.workspace }}

      - name: Wait for server
        run: npx wait-on http://localhost:8080/app/ui

      - name: Run Playwright tests
        run: npx playwright test

      - name: Upload test report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

---

## package.json (dev only)

```json
{
  "name": "decashift-tests",
  "private": true,
  "devDependencies": {
    "@playwright/test": "^1.44.0",
    "http-server": "^14.1.1",
    "wait-on": "^7.2.0"
  },
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed"
  }
}
```

---

## Test Helpers (helpers/test-data.js)

```js
// Inject a user into localStorage for test setup
export async function injectUser(page, overrides = {}) {
  const user = {
    id: 'test-user-001',
    email: 'test@example.com',
    name: 'Test User',
    category: 'school',
    grade: '5',
    plan: 'free',
    createdAt: new Date().toISOString(),
    preferredLanguage: null,
    ...overrides
  };
  await page.evaluate(u => {
    localStorage.setItem('decashift_user', JSON.stringify(u));
    localStorage.setItem('decashift_session', JSON.stringify({ userId: u.id }));
  }, user);
  return user;
}

// Simulate an expired trial
export function expiredTrialUser(overrides = {}) {
  const d = new Date();
  d.setDate(d.getDate() - 16);
  return { plan: 'free', createdAt: d.toISOString(), ...overrides };
}
```

---

## Local Dev Usage

```bash
# Install once
npm install

# Run all tests (headless)
npm test

# Run with browser UI visible
npm run test:headed

# Interactive Playwright UI (great for debugging)
npm run test:ui
```

---

## Acceptance Criteria

- [ ] `tests/` folder with all 4 spec files
- [ ] `playwright.config.js` configured for local + CI
- [ ] `package.json` with dev dependencies only
- [ ] `.github/workflows/test.yml` — runs on push to main
- [ ] All tests pass against local server
- [ ] All tests pass against GitHub Pages URL (`TEST_URL=https://... npm test`)
- [ ] Failure screenshots uploaded as GitHub Actions artifact
- [ ] P2-T011 manual checklist converted to automated equivalents

---

## Files to Create

| File | Purpose |
|---|---|
| `tests/playwright.config.js` | Playwright configuration |
| `tests/auth.spec.js` | Auth flow tests |
| `tests/questions.spec.js` | Question engine tests |
| `tests/session.spec.js` | Session + streak tests |
| `tests/trial.spec.js` | Trial gate + upgrade prompt tests |
| `tests/helpers/test-data.js` | Shared fixtures and localStorage helpers |
| `package.json` | Dev dependencies (test tooling only) |
| `.github/workflows/test.yml` | CI workflow |

---

## Dependencies
- P2-T011 (manual test checklist — defines test cases, this automates them)
- P2-T013 (subscription strategy — trial gate logic must exist before trial.spec.js)
- P3-T013 (regional language — add to questions.spec.js when implemented)

## Priority Note
Ship after P2-T013 (trial gate) is implemented so trial.spec.js is testable.
Auth and question tests can be written independently before that.
