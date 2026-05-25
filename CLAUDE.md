# CLAUDE.md — DecaShift: 10X Goal Execution & Learning Tracker

> **Master AI Prompt File** — Drop this in your project root. Any AI (Claude, Cursor, Copilot) reading this file will understand the full app context, architecture, and constraints.

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

*DecaShift — Built for engineers who move fast and learn faster.*
