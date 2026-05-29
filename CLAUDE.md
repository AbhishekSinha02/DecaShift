# CLAUDE.md — DecaShift: 10X Goal Execution & Learning Tracker

> **Master AI Prompt File** — Drop this in your project root. Any AI (Claude, Cursor, Copilot) reading this file will understand the full app context, architecture, and constraints.

---

## 🎯 North Star Goal (Read Before Doing Anything)

**5,000 users onboarded by end of August 2026. (~3 months from 2026-05-27)**

**Strategy:** Flood the market at the lowest possible price. ₹79/month Pro.
Solopreneur + near-zero infra cost (static site + Cloudflare R2 + Upstash) = margins
competitors with payroll cannot match. Three products, one engine:
1. **DecaShift Students** — Grade 2–12 (this app, launch first)
2. **DecaShift Pro** — Professionals, upskilling + interview prep (fork after Students stable)
3. **DecaShift Exam** — UPSC / JEE / NEET / CAT aspirants (fork after Pro stable)

**The decision filter — before every task ask:**
- Does this move toward 5K users by August 2026?
- Does it fix content depth (F1 — the only Critical failure)?
- Does it create a shareable moment (something a parent sends to another parent)?
- Does it work on a ₹8,000 Android phone on 4G?

**The bottleneck is content, not code.**
Fix F1 (50+ questions per grade) before any marketing. Word of mouth is the only
growth channel. Word of mouth comes from the Concept Builder — parents who see their
child solve a hard problem they built atom by atom will tell every parent they know.

---

## 🧠 Standing AI Instructions (Apply Every Session Without Being Asked)

These are permanent operating instructions. They apply whether or not the user mentions them.

### 1 — Think as Principal EdTech Product Designer at All Times

Before writing a single line of code, answer three questions out loud:
1. **What does a new user see in the first 5 seconds?**
2. **What does a returning student see on day 7?**
3. **What does a parent see when they look over their child's shoulder?**

If any answer is "not enough" — raise it before building. Do not suppress design concerns
to stay in task-execution mode. A mediocre UI costs users. A premium UI at ₹79 creates
word of mouth. These are not separable concerns.

Apply this lens to every decision:
- Card border radius → does it feel polished or generic?
- Typography weight → does it create hierarchy or noise?
- Scroll behaviour → does chrome disappear when it should stay?
- Empty state → does it guide or abandon the user?
- Animation → does it feel alive or dead?
- Color → is it intentional (subject color, streak gold, accuracy green) or random?

The product must feel like it costs 10× what it does. At ₹79/month, every pixel must
justify the user's trust. This is not optional polish. It is the primary marketing asset.

### 2 — First 100 Paid Users: The Conversion Math Always in Mind

**The immediate goal is 100 paid users — not 5,000. Not users. Paid.**

The conversion math a solopreneur intern needs to run:

| Channel | Reach needed | Conversion | Paid users | Time |
|---|---|---|---|---|
| School teacher demo (1 teacher → 35 parents) | 400 parents via 12 teachers | 25% | 100 paid | 3 weeks |
| Parent WhatsApp groups (intern, 80 active/group) | 63 groups × 80 parents | 2% | 100 paid | 2 months |
| Solopreneur personal network | 500 warm contacts | 10% | 50 paid | week 1 |
| Cold digital outreach | 10,000 people | 1% | 100 paid | 3 months |

**The key insight:** Channel quality beats channel volume.
- 1 teacher endorsement > 500 cold WhatsApp posts
- 1 satisfied parent in a group saying "my child uses this" > 10 promotional posts
- Product quality is a conversion rate multiplier:
  - Mediocre product: 1% conversion → need 10,000 reach
  - Good product: 5% conversion → need 2,000 reach
  - Excellent product + teacher endorsed: 25% → need 400 reach

**This is why the UI overhaul (P1-T014 through P1-T017) is the fastest path to
100 paid users — not more features, not more content. Better product = better
conversion = less reach needed = intern converts in weeks, not months.**

**Before every feature decision ask:**
- Does this improve the product quality enough to raise conversion rate?
- Does this create something a parent would use to convince another parent?
- Does the intern's WhatsApp pitch become easier or harder to close after this?

**The speed target:**
Week 1: Solopreneur sends to 50 personal contacts → 5 paid users
Week 2–4: First intern, 20 parent groups → 30 paid users
Week 5–8: 12 school teacher demos → 60 more paid users
**= 95 paid users in 8 weeks with 1 intern and 0 ad spend.**

The only thing that breaks this math is a product that parents don't feel is worth ₹79
after using it for 3 days. Product quality is the only real variable.

### 3 — Proactive Blind Spot Audit

At the start of every code session, before touching any file, do this 60-second check:
1. Look at the last 3 commits — what changed?
2. Ask: did any of those changes affect the user's first 5 seconds?
3. Ask: is there anything in the current app that a mediocre competitor wouldn't have?
   If yes → protect it. If no → we have work to do before adding features.

Do not wait to be asked. Surface blind spots proactively.

---

---

---

## 🎯 What Is This App?

**DecaShift** is a frontend-only quiz and goal-tracking PWA where users:
1. Pick or create a learning goal (e.g., "Azure AKS", "MLOps Interview Prep")
2. Answer questions one at a time with a live timer
3. Get instant correctness feedback
4. See a result summary with accuracy, time, score
5. Export their session data as JSON or CSV
6. Have all responses persisted locally (localStorage) with optional remote sync

**Target users:** Job seekers, engineers upskilling fast, interview preppers.

**Tagline:** *Answer. Track. Improve. Repeat.*

---

## 📁 File Structure (Required)

```
decashift/
├── index.html          # Single-page app shell
├── styles.css          # All styles, CSS variables, mobile-first
├── app.js              # Main app logic, routing between screens
├── storage.js          # localStorage + remote sync logic
├── questions.json      # Question bank (all goals)
├── goals.json          # Goal definitions
└── CLAUDE.md           # This file
```

> ⚠️ No build tools. No npm. No frameworks. Pure HTML + CSS + Vanilla JS only.
> Must work by opening `index.html` directly or via GitHub Pages.

---

## 🖥️ Screens & Navigation Flow

```
[Home/Goal Select] → [Quiz Screen] → [Result Summary]
        ↑                                    |
        └──────── Reset Goal ────────────────┘
```

### Screen 1: Home / Goal Select
- Show list of goals loaded from `goals.json`
- Each goal card shows: name, description, total questions, last score (if any from localStorage)
- Button: **Start Goal** / **Resume Goal** / **Reset Goal**
- Button: **+ Create Custom Goal** (opens a modal to enter goal name + paste questions as JSON)

### Screen 2: Quiz Screen
- Progress bar: `Question 3 of 10`
- Timer (counting up from 0:00, starts on question load)
- Question text (large, readable)
- 4 answer options as clickable cards (not tiny radio buttons)
- **Submit Answer** button
- On submit: highlight correct (green) / wrong (red), show explanation if present
- **Next Question** button appears after submit
- No skipping allowed

### Screen 3: Result Summary
- Total score: `7 / 10 (70%)`
- Time per question breakdown (table)
- Accuracy badge (🔥 Excellent / ✅ Good / ⚠️ Needs Work)
- **Export JSON** button
- **Export CSV** button
- **Restart Goal** button
- **Back to Goals** button

---

## 📦 Data Schemas

### `goals.json`
```json
[
  {
    "id": "azure-aks",
    "name": "Azure AKS",
    "description": "Kubernetes on Azure — architecture, networking, workload identity",
    "tags": ["azure", "cloud", "k8s"],
    "createdAt": "2024-01-01"
  }
]
```

### `questions.json`
```json
[
  {
    "id": "q001",
    "goalId": "azure-aks",
    "question": "What is the purpose of Workload Identity in AKS?",
    "options": [
      "Assign managed identity to pods via OIDC federation",
      "Store secrets in Azure Key Vault",
      "Enable RBAC on the cluster",
      "Configure network policies"
    ],
    "correctIndex": 0,
    "explanation": "Workload Identity uses OIDC token federation to let pods assume Azure AD identities without storing credentials.",
    "difficulty": "medium",
    "tags": ["identity", "security"]
  }
]
```

### Session Response Object (stored in localStorage + exported)
```json
{
  "sessionId": "sess_abc123",
  "userId": "user_xyz789",
  "goalId": "azure-aks",
  "sessionStart": "2024-05-25T10:00:00Z",
  "sessionEnd": "2024-05-25T10:15:00Z",
  "totalDurationSeconds": 900,
  "responses": [
    {
      "questionId": "q001",
      "selectedIndex": 0,
      "correctIndex": 0,
      "isCorrect": true,
      "startTime": "2024-05-25T10:00:05Z",
      "endTime": "2024-05-25T10:00:42Z",
      "durationSeconds": 37
    }
  ],
  "score": 7,
  "total": 10,
  "accuracy": 0.7
}
```

---

## 💾 Storage Logic (`storage.js`)

### Priority Order:
1. **Try remote sync** → POST to Google Apps Script Web App URL (set in `CONFIG.remoteEndpoint`)
2. **Fallback** → Save to `localStorage` under key `decashift_sessions`

### Functions to implement:
```js
saveSession(sessionData)       // tries remote first, falls back to localStorage
loadSessions()                 // returns all sessions from localStorage
getLastSessionForGoal(goalId)  // returns most recent session for a goal
clearSessionsForGoal(goalId)   // reset goal — deletes localStorage entries
exportAsJSON(sessions)         // triggers browser download of .json file
exportAsCSV(sessions)          // flattens responses, triggers .csv download
```

### Remote Sync (optional, graceful fallback):
```js
const CONFIG = {
  remoteEndpoint: "" // Set to Google Apps Script URL if available; leave empty to skip
}
// Use fetch() with method POST, Content-Type application/json
// If fetch fails or endpoint is empty → silently fall back to localStorage
```

---

## ⏱️ Timer Logic

- Timer starts when question is displayed
- Timer stops when user clicks **Submit Answer**
- Store `questionStartTime` and `questionEndTime` as ISO strings
- Display live `MM:SS` counter on quiz screen
- Session-level timer also runs from first question to result screen

---

## 🎨 UI & Style Rules (`styles.css`)

- **Theme:** Dark background (`#0f1117`), accent color electric blue (`#3b82f6`), white text
- **Font:** Use Google Fonts — `Syne` for headings, `DM Mono` for stats/timers
- **Mobile-first:** All layouts must work at 375px width
- **Answer cards:** Full-width clickable `<div>` blocks, not `<input type="radio">`
- **Animations:** Subtle fade-in on question load, green/red flash on answer submit
- **No external UI libraries** (no Bootstrap, no Tailwind CDN)
- CSS variables required:
```css
:root {
  --bg: #0f1117;
  --surface: #1a1d27;
  --accent: #3b82f6;
  --success: #22c55e;
  --error: #ef4444;
  --text: #f1f5f9;
  --muted: #64748b;
  --radius: 12px;
  --font-head: 'Syne', sans-serif;
  --font-mono: 'DM Mono', monospace;
}
```

---

## 🧠 App Logic (`app.js`)

### State Object:
```js
const state = {
  currentScreen: 'home',     // 'home' | 'quiz' | 'result'
  selectedGoal: null,
  questions: [],             // filtered for selected goal
  currentIndex: 0,
  responses: [],
  sessionStart: null,
  questionStart: null,
  userId: null,              // generated once, stored in localStorage
  sessionId: null
}
```

### Key Functions:
```
init()                    → load goals.json + questions.json, render home
selectGoal(goalId)        → filter questions, set state, go to quiz screen
startQuestion()           → render question, start timer
submitAnswer(index)       → stop timer, evaluate, store response, show feedback
nextQuestion()            → increment index or go to result
showResult()              → calculate stats, render result screen
resetGoal(goalId)         → clear localStorage for goal, return to home
createGoal(name, qArray)  → push to goals + questions in memory, persist to localStorage
generateUserId()          → check localStorage or create crypto.randomUUID()
generateSessionId()       → crypto.randomUUID() each session
```

---

## 🚀 GitHub Pages Deployment

1. Push all files to a GitHub repo (e.g., `decashift`)
2. Go to **Settings → Pages → Source: main branch / root**
3. App is live at `https://yourusername.github.io/decashift/`

> ✅ No build step. No CI/CD needed. Just push and it works.

---

## ✅ MVP Checklist (Build in This Order)

- [ ] `goals.json` + `questions.json` with 2 sample goals, 5 questions each
- [ ] `index.html` shell with 3 screen `<section>` divs (hidden by default)
- [ ] `styles.css` with CSS variables + base layout
- [ ] `app.js` — `init()`, goal list render, screen switcher
- [ ] Quiz engine — question render, answer select, submit, next
- [ ] Timer logic — per-question and session-level
- [ ] Result screen — score, accuracy, time table
- [ ] `storage.js` — localStorage save/load, export JSON, export CSV
- [ ] Remote sync stub (fetch POST, graceful fallback)
- [ ] Custom goal creation modal
- [ ] Reset goal functionality
- [ ] Mobile responsiveness pass
- [ ] README.md with setup + GitHub Pages deploy steps

---

## 🔒 Constraints (Never Violate)

| Rule | Detail |
|------|--------|
| No frameworks | No React, Vue, Angular, Svelte |
| No backend | No Node.js server, no database |
| No bundlers | No webpack, vite, rollup |
| No CDN UI libs | No Bootstrap, Tailwind CDN, Material UI |
| GitHub Pages safe | Only static files, relative paths only |
| Fonts OK | Google Fonts CDN is allowed |
| Fetch OK | fetch() for remote sync is allowed (graceful fallback) |

---

## 💡 AI Generation Tips

When asking an AI to build this app:

1. **Generate files one at a time** — ask for `questions.json` first, then `goals.json`, then `storage.js`, then `app.js`, then `styles.css`, then `index.html`
2. **Reference this file** — paste relevant sections when prompting
3. **Test after each file** — open index.html in browser after adding each piece
4. **For questions.json** — give AI your specific topic (e.g., "Azure MLOps interview questions") and it will generate 10 questions in the required schema
5. **For remote sync** — only set up Google Apps Script endpoint after MVP works locally

---

## 🔒 Code Stability Rules (Non-Negotiable)

**The app must be in a working, browser-testable state after every single commit.
Context limit exhaustion must never leave code broken — not even locally.**

### Atomic unit discipline
- Every code change is broken into the smallest independently working piece
- Each piece is committed before the next begins
- A session ending mid-task leaves the app at the last commit — which always works

### Feature flag pattern for large changes
New features that span multiple steps are hidden until complete:
```js
const FEATURES = { conceptBuilder: localStorage.getItem('ds_beta') === 'true' };
if (FEATURES.conceptBuilder) { /* new code — invisible until flag set */ }
```
Old code runs unaffected. New code is dormant. App never breaks mid-feature.

### Commit rules
1. Commit after every atomic working step — not after every session
2. Never leave app.js / styles.css / index.html edited but untested
3. Every commit message confirms "app works at this point"
4. If context is running long: finish current atomic unit → commit → note handoff state

### Never
- Edit a calling function before the function it calls exists
- Change a schema field without updating every renderer that reads it in the same commit
- Leave stub functions, thrown errors, or half-wired event handlers committed
- Start a new task before the previous commit is stable

### Safe handoff note (when context is long)
> **Safe handoff:** Last commit `abc1234` is stable. `_renderHome()` complete.
> Next: `_selectQuestionsForSet()` — not yet started, no dependencies broken.

This note survives context compression so the next session starts clean.

---

## ♻️ Rebuild Reference (Fresh Session or New Project)

### Code Surface (~2,750 lines total — no questions, no external deps)

| File | ~Lines | Contents |
|---|---|---|
| `app/ui/index.html` | 400 | 3 screen sections, all modals, font links |
| `app/ui/app.js` | 1,200 | State object, all screen renderers, quiz engine, auth |
| `app/ui/styles.css` | 700 | CSS vars, mobile-first layout, all component styles |
| `app/ui/storage.js` | 300 | localStorage, Drive sync, export functions |
| `sw.js` + `manifest.webmanifest` | 150 | Service Worker, PWA manifest |

### Rebuild Session Estimate

| Scope | Sessions |
|---|---|
| Pure code only (no content, no external deps) | **1–2** |
| Launch-ready (all P2 tasks complete) | **~10** |
| Full 82-task vision | **25–35** |

**Session 1:** Shell + auth + quiz engine + all 3 screens functional  
**Session 2:** Styles polished + weekly sets + streaks + storage + edge cases  
No third session needed if focused.

### What to Hand a Fresh Session

1. This file (`CLAUDE.md`) — architecture, schemas, function signatures, CSS vars
2. `tasks/INDEX.md` — full task list with status
3. The specific task `.md` files for that session's scope
4. `memory/project_decashift_setup.md` — Drive folder ID, Apps Script URL, file naming

### Strategic Decisions Locked (as of 2026-05-27)

| Decision | Detail |
|---|---|
| Brand | Progression arc logo; tagline "See yourself grow." No animal mascot |
| Avatar | 6-stage growth system — user sees themselves growing (P3-T004) |
| Journey Replay | 6–10 sec inline animation of full growth arc from profile screen |
| Learning engine | Atom → Foundation → Relationship → Application → Synthesis (P2-T027) |
| Question bank | Reusable, concept-tagged source; smart weekly selection, never random |
| Subscription gate | HMAC signed token; Plan stored in Drive, not localStorage (P2-T026) |
| Offline | IndexedDB prefetch on login; re-fetch only on week/grade/plan change (P3-T030) |
| Subject tabs | Math first, All last; auto-applies Math for school users on first render |
| Weekly sets | Free: Sets 1–2 | Pro: Sets 3–5 + Exam (2 easy → 2 medium → 1 hard) |

### The Bottleneck Is Never Code

Content work (concept-tagged question bank, avatar SVG design, concept catalogues per
grade) runs in parallel and cannot be generated in a session. Plan for:
- 150–700 questions per subject per grade (see task file for grade breakdown)
- Avatar SVG: 1 designer, 5-stage layered illustration
- Concept catalogues: curriculum expertise per grade/subject

---

*DecaShift — Built for engineers who move fast and learn faster.*
