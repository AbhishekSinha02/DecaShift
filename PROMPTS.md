# PROMPTS.md — Ready-to-Use AI Prompts for DecaShift

> **Purpose:** Copy-paste these prompts directly into Claude, ChatGPT, or Cursor. Each generates one file. Run them in order.

---

## Build Order

```
Step 1 → questions.json    (DATA.md)
Step 2 → goals.json        (DATA.md)
Step 3 → storage.js        (STORAGE.md)
Step 4 → app.js            (APPLOGIC.md)
Step 5 → styles.css        (UI.md)
Step 6 → index.html        (UI.md + CLAUDE.md)
Step 7 → Test in browser
Step 8 → Push to GitHub Pages
```

---

## Prompt 1 — Generate `questions.json`

```
You are building a file called questions.json for an app called DecaShift.

The schema for each question is:
{
  "id": "unique string e.g. aks-001",
  "goalId": "must match a goal id from goals.json",
  "question": "question text",
  "options": ["option A", "option B", "option C", "option D"],
  "correctIndex": 0,
  "explanation": "why the answer is correct and why others are wrong",
  "difficulty": "easy|medium|hard",
  "tags": ["tag1", "tag2"]
}

Generate 10 questions for goalId "azure-aks" (Azure AKS for banking/enterprise).
Generate 10 questions for goalId "mlops-banking" (MLOps, Azure ML, OSFI E-23 compliance).
Generate 10 questions for goalId "terraform-azure" (Terraform IaC on Azure, state, modules, CI/CD).

Rules:
- 20% easy, 50% medium, 30% hard per goal
- Scenario-based questions that test real architect-level understanding
- Explanation must be 2-3 sentences, detailed and educational
- Return ONLY valid JSON array, no markdown, no backticks
```

---

## Prompt 2 — Generate `goals.json`

```
Generate goals.json for the DecaShift app.

Schema:
{
  "id": "kebab-case-id",
  "name": "display name",
  "description": "one-line description",
  "tags": ["tag1", "tag2"],
  "createdAt": "2024-01-01"
}

Create exactly 3 goals with these IDs:
- "azure-aks" — Azure Kubernetes Service deep dive for banking/enterprise
- "mlops-banking" — MLOps pipelines and compliance (OSFI E-23, Azure ML, drift detection)
- "terraform-azure" — Terraform IaC on Azure (state management, modules, CI/CD with OIDC)

Return ONLY valid JSON array, no markdown.
```

---

## Prompt 3 — Generate `storage.js`

```
You are building storage.js for a vanilla JavaScript app called DecaShift.
This file handles localStorage persistence, optional remote sync, and file exports.
No frameworks. No npm. Runs in the browser.

Requirements from STORAGE.md:

1. STORAGE_CONFIG object with keys: remoteEndpoint (default ""), localKey, userIdKey, customGoalsKey, customQuestionsKey

2. Functions to implement:
   - getOrCreateUserId() → check localStorage or create "user_" + crypto.randomUUID().split("-")[0]
   - saveSession(sessionData) → always save to localStorage first, then try fetch POST to remoteEndpoint if set (catch errors silently)
   - loadAllSessions() → parse JSON from localStorage, return [] on error
   - getLastSessionForGoal(goalId) → filter by goalId, return last entry
   - getBestScoreForGoal(goalId) → return highest accuracy (0-1) for goal
   - clearSessionsForGoal(goalId) → filter out, save back
   - saveCustomGoal(goal) → append to customGoals in localStorage
   - loadCustomGoals() → return [] if empty
   - saveCustomQuestions(questions) → merge with existing custom questions
   - loadCustomQuestions() → return [] if empty
   - exportAsJSON(sessions) → create Blob, trigger download as .json
   - exportAsCSV(sessions) → flatten responses into rows, trigger download as .csv
   - triggerDownload(blob, filename) → createObjectURL, click, revokeObjectURL

3. CSV columns: sessionId, userId, goalId, goalName, sessionStart, sessionEnd, totalDurationSeconds, score, total, accuracy, questionId, questionText, selectedIndex, selectedText, correctIndex, correctText, isCorrect, durationSeconds

4. Use window scope (no ES modules) so functions are globally accessible from app.js

Return complete working JavaScript code only, no markdown.
```

---

## Prompt 4 — Generate `app.js`

```
You are building app.js for a vanilla JavaScript app called DecaShift.
Single-page app with 3 screens: home, quiz, result.
No frameworks. No npm. Runs in the browser as a script tag.
Depends on storage.js (already loaded, functions are global).

State object:
const state = {
  currentScreen: "home",
  allGoals: [], allQuestions: [],
  selectedGoal: null, sessionQuestions: [],
  currentIndex: 0, selectedOptionIndex: null, responses: [],
  sessionStart: null, questionStart: null, timerInterval: null,
  userId: null, sessionId: null
}

Implement these functions (full working code):

init() — fetch goals.json and questions.json, merge with loadCustomGoals() and loadCustomQuestions(), call getOrCreateUserId(), renderHome(), showScreen("home")

showScreen(name) — toggle .active class on #screen-{name}

renderHome() — generate goal cards in #goals-list. Each card shows goal name, question count, last score from getLastSessionForGoal(), Start button calls startGoal(id), Reset button calls confirmResetGoal(id)

startGoal(goalId) — set selectedGoal, filter sessionQuestions, reset session state, generate sessionId, showScreen("quiz"), loadQuestion()

loadQuestion() — render question text, 4 option cards with labels A/B/C/D, update progress bar and label, reset feedback, start timer

selectOption(index) — update selected state on cards, enable submit button

submitAnswer() — stop timer, evaluate isCorrect, push to state.responses, highlight correct/incorrect cards, show feedback panel with explanation, hide submit button, show next button

nextQuestion() — increment index or call endSession()

endSession() — build sessionData object, await saveSession(), call renderResult(), showScreen("result")

renderResult(session) — populate score, accuracy, badge (🔥 Excellent ≥80%, ✅ Good ≥60%, ⚠️ Needs Work <60%), total time, breakdown table, wire export buttons

startTimer() / stopTimer() — setInterval updating #quiz-timer display as M:SS

confirmResetGoal(goalId) — confirm(), call clearSessionsForGoal(), renderHome()

saveCustomGoalFromModal() — read #new-goal-name, #new-goal-desc, #new-goal-questions, validate JSON, call saveCustomGoal() and saveCustomQuestions(), reload allGoals/allQuestions from storage, renderHome(), close modal

Wire all event listeners at bottom of file.

Return complete working JavaScript code only, no markdown.
```

---

## Prompt 5 — Generate `styles.css`

```
You are building styles.css for a vanilla JavaScript app called DecaShift.
Dark theme, engineer aesthetic — like a Bloomberg terminal crossed with a dev tool.

CSS Variables (use exactly):
--bg: #0a0c10
--surface: #13161f
--surface-2: #1c2030
--border: #2a2f40
--accent: #3b82f6
--accent-dim: rgba(59, 130, 246, 0.15)
--success: #22c55e
--success-dim: rgba(34, 197, 94, 0.15)
--error: #ef4444
--error-dim: rgba(239, 68, 68, 0.15)
--text: #e8ecf4
--text-muted: #64748b
--radius: 10px
--font-head: 'Syne', sans-serif
--font-mono: 'DM Mono', monospace

Style all these elements:
- body, .screen, .screen.active, .container
- .app-header (flex, space-between, with border-bottom)
- .logo (.logo-icon accent color, .logo-text Syne font 20px bold)
- .goals-list (flex column, gap 12px)
- .goal-card (card style, flex row on desktop, column on mobile)
- .goal-name (Syne 16px 600 weight), .goal-meta (mono 13px muted)
- .tag (small pill badge, surface-2 background, muted text)
- .card (surface background, border, radius, padding 20px)
- .btn, .btn-primary, .btn-ghost, .btn-danger, .btn-sm, .btn-full, .btn-icon
- .quiz-topbar (fixed top bar, dark background, flex space-between, padding 12px 16px)
- .quiz-timer (mono font, accent color, bold)
- .progress-bar-wrap (height 4px, surface-2 background, full width)
- .progress-bar-fill (accent background, height 100%, transition width)
- .progress-label (mono 12px muted, text-right, margin 6px 0 20px)
- .question-card (card + fadeIn animation, margin bottom 20px)
- .question-text (Syne 18px, line-height 1.6)
- .option-card (all 4 states: default, hover, selected, correct, incorrect, disabled)
- .option-label (mono 12px muted)
- .feedback-panel (surface-2 card, padding 16px, margin top 16px)
- .feedback-result (Syne 16px bold — green if correct, red if incorrect)
- .feedback-explanation (muted 14px, margin top 8px)
- .result-title (Syne 24px center)
- .score-display (card, text-center, padding 32px)
- .score-big (Syne 64px 800 weight, accent color)
- .score-accuracy (muted 16px)
- .score-badge-large (24px, margin 12px 0)
- .score-time (mono 14px muted)
- .section-title (Syne 14px 600 uppercase letter-spacing, muted, margin 20px 0 12px)
- .breakdown-table table (full width, border-collapse, mono 13px)
- .breakdown-table th (muted, border-bottom, padding 8px, text-left)
- .breakdown-table td (padding 8px, border-bottom 1px solid --border)
- .q-preview (max-width 200px, overflow hidden, text-overflow ellipsis, white-space nowrap)
- .result-actions (grid 2-col gap 10px)
- .modal-overlay (fixed fullscreen, dark overlay, flex center)
- .modal (card max-width 520px, width 90%)
- label (display block, 13px muted, margin 12px 0 4px)
- input, textarea (full width, surface-2 bg, border, radius, padding 10px, text color, font)
- .modal-actions (flex, gap 10px, justify-end, margin top 16px)
- Animations: fadeIn, flash-correct, flash-incorrect

Mobile-first. Single column always. Min touch target 44px. Works at 375px viewport.

Return complete CSS only, no markdown.
```

---

## Prompt 6 — Generate `index.html`

```
You are building index.html for a vanilla JavaScript app called DecaShift — a quiz and goal tracking app for engineers.

Requirements:
- Single HTML file, no frameworks, no build tools
- Links to: Google Fonts (Syne + DM Mono), styles.css
- Loads storage.js as a regular script, then app.js
- Three screen sections: #screen-home, #screen-quiz, #screen-result (all have class "screen")
- One modal div: #modal-new-goal
- All element IDs must match exactly what app.js and storage.js expect

Screen 1 (#screen-home):
- .app-header with .logo (⚡ DecaShift) and #btn-new-goal button
- #goals-list div (empty — JS fills it)

Screen 2 (#screen-quiz):
- .quiz-topbar with #btn-back-home (← icon button), #quiz-goal-name (span), #quiz-timer (span)
- .container with:
  - .progress-bar-wrap → .progress-bar-fill (#progress-fill)
  - #progress-label
  - .question-card.card → #question-text
  - #options-list
  - #btn-submit (Submit Answer — disabled initially)
  - #feedback-panel (hidden) → #feedback-result, #feedback-explanation, #btn-next

Screen 3 (#screen-result):
- .container with:
  - .result-title (Session Complete)
  - .score-display.card → #result-score, #result-accuracy, #result-badge, #result-time
  - .section-title (Question Breakdown)
  - .breakdown-table.card → table#breakdown-table with thead (# / Question / Time / Result) and #breakdown-body
  - .result-actions → #btn-export-json, #btn-export-csv, #btn-retry, #btn-home

Modal (#modal-new-goal, display none):
- .modal-overlay → .modal.card → h3 (Create New Goal), labels + inputs for #new-goal-name, #new-goal-desc, textarea #new-goal-questions, .modal-actions with #btn-modal-cancel and #btn-modal-save

Meta tags: charset UTF-8, viewport mobile, description, title "DecaShift — 10X Goal Tracker"

Return complete HTML file only, no markdown.
```

---

## Prompt 7 — Add More Questions (Repeat as Needed)

```
Add 10 more questions to questions.json for the DecaShift app.

goalId: "azure-aks"
Topic: AKS advanced networking — CNI, Cilium, network policies, ingress, service mesh, egress

Use this exact schema:
{
  "id": "aks-XXX",  ← continue numbering from where you left off
  "goalId": "azure-aks",
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "correctIndex": 0,
  "explanation": "2-3 sentence detailed explanation",
  "difficulty": "easy|medium|hard",
  "tags": ["tag1"]
}

Rules: scenario-based, senior architect level, 20% easy / 50% medium / 30% hard.
Return ONLY the new JSON objects as an array (to append to existing file), no markdown.
```

---

## Quick Test Checklist (After Building)

```
□ Open index.html in browser — home screen shows goals
□ Click Start on a goal — quiz screen loads with question
□ Select an answer — Submit becomes enabled
□ Click Submit — correct/incorrect highlighted, explanation shown
□ Click Next — next question loads, timer resets
□ Complete all questions — result screen shows score
□ Export JSON — file downloads
□ Export CSV — file downloads with one row per response
□ Click Reset on a goal — progress clears
□ Create new goal — modal opens, save works, appears in list
□ Resize to 375px — all elements still usable
```

---

## GitHub Pages Deployment (2 Minutes)

```bash
# 1. Create repo on GitHub named "decashift"
# 2. Push all files to main branch
git init
git add .
git commit -m "DecaShift MVP"
git remote add origin https://github.com/YOUR_USERNAME/decashift.git
git push -u origin main

# 3. Enable Pages
# GitHub → Settings → Pages → Source: Deploy from branch → main / (root) → Save

# 4. Your app is live at:
# https://YOUR_USERNAME.github.io/decashift/
```

---

*Use these prompts in sequence. Each builds on the last. Estimated total generation time: ~20 minutes.*
