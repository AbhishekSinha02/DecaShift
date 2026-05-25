# UI.md — DecaShift Design System & Screen Specs

> **Purpose:** Feed this to AI when generating `index.html` and `styles.css`. Covers layout, components, CSS variables, and screen-by-screen HTML structure.

---

## Design Direction

**Aesthetic:** Dark, focused, terminal-meets-dashboard — like a Bloomberg terminal crossed with a dev tool. No purple gradients. No rounded corporate softness. This is for engineers who want to ship.

**Feel:** Precision. Density. Speed. Every pixel earns its place.

**Fonts (Google Fonts):**
```html
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
```
- `Syne` → headings, goal names, score display
- `DM Mono` → timer, stats, question counter, IDs

---

## CSS Variables (copy into `:root`)

```css
:root {
  --bg: #0a0c10;
  --surface: #13161f;
  --surface-2: #1c2030;
  --border: #2a2f40;
  --accent: #3b82f6;
  --accent-dim: rgba(59, 130, 246, 0.15);
  --success: #22c55e;
  --success-dim: rgba(34, 197, 94, 0.15);
  --error: #ef4444;
  --error-dim: rgba(239, 68, 68, 0.15);
  --warning: #f59e0b;
  --text: #e8ecf4;
  --text-muted: #64748b;
  --text-dim: #3a4158;
  --radius: 10px;
  --radius-sm: 6px;
  --font-head: 'Syne', sans-serif;
  --font-mono: 'DM Mono', monospace;
  --shadow: 0 4px 24px rgba(0,0,0,0.4);
  --transition: 0.18s ease;
}
```

---

## Global Base Styles

```css
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-head);
  min-height: 100vh;
  line-height: 1.5;
}

/* Screens — only one visible at a time */
.screen { display: none; }
.screen.active { display: flex; flex-direction: column; }

/* Container */
.container {
  max-width: 680px;
  margin: 0 auto;
  padding: 24px 16px;
}

/* Card */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
}

/* Buttons */
.btn {
  font-family: var(--font-head);
  font-weight: 600;
  font-size: 14px;
  padding: 12px 24px;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  transition: var(--transition);
  letter-spacing: 0.02em;
}
.btn-primary { background: var(--accent); color: #fff; }
.btn-primary:hover { filter: brightness(1.1); }
.btn-ghost { background: transparent; border: 1px solid var(--border); color: var(--text); }
.btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
.btn-danger { background: transparent; border: 1px solid var(--error); color: var(--error); }
.btn-danger:hover { background: var(--error-dim); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
```

---

## Screen 1: Home / Goal Select

### Layout:
```
┌─────────────────────────────────────┐
│  ⚡ DecaShift         [+ New Goal]  │  ← header
├─────────────────────────────────────┤
│  Your Goals                         │
│  ┌─────────────────────────────┐    │
│  │ Azure AKS Deep Dive         │    │  ← goal card
│  │ 15 questions · Last: 70%    │    │
│  │ [Start]              [Reset]│    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ MLOps for Banking           │    │
│  │ 10 questions · Not started  │    │
│  │ [Start]              [Reset]│    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

### HTML Structure:
```html
<section id="screen-home" class="screen">
  <div class="container">
    <header class="app-header">
      <div class="logo">
        <span class="logo-icon">⚡</span>
        <span class="logo-text">DecaShift</span>
      </div>
      <button class="btn btn-ghost btn-sm" id="btn-new-goal">+ New Goal</button>
    </header>

    <h2 class="section-title">Your Goals</h2>
    <div id="goals-list" class="goals-list">
      <!-- Rendered by JS -->
    </div>
  </div>
</section>
```

### Goal Card (rendered by JS):
```html
<div class="goal-card" data-goal-id="azure-aks">
  <div class="goal-card-body">
    <div class="goal-name">Azure AKS Deep Dive</div>
    <div class="goal-meta">15 questions · Last score: <span class="score-badge">70%</span></div>
    <div class="goal-tags">
      <span class="tag">azure</span><span class="tag">kubernetes</span>
    </div>
  </div>
  <div class="goal-card-actions">
    <button class="btn btn-primary btn-sm" onclick="startGoal('azure-aks')">Start</button>
    <button class="btn btn-danger btn-sm" onclick="resetGoal('azure-aks')">Reset</button>
  </div>
</div>
```

---

## Screen 2: Quiz

### Layout:
```
┌─────────────────────────────────────┐
│ ← Back    Azure AKS        0:42 ⏱  │  ← topbar
├─────────────────────────────────────┤
│ ████████████░░░░░░ 3 of 10         │  ← progress bar
├─────────────────────────────────────┤
│                                     │
│  What is the purpose of Workload    │
│  Identity in AKS?                   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ A  Federate pod identity... │   │  ← answer card
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ B  Store secrets in AKV...  │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ C  Enable RBAC on cluster   │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ D  Configure network policy │   │
│  └─────────────────────────────┘   │
│                                     │
│  [      Submit Answer       ]      │
└─────────────────────────────────────┘
```

### HTML Structure:
```html
<section id="screen-quiz" class="screen">
  <div class="quiz-topbar">
    <button class="btn-icon" id="btn-back-home">←</button>
    <span class="quiz-goal-name" id="quiz-goal-name"></span>
    <div class="quiz-timer" id="quiz-timer">0:00</div>
  </div>

  <div class="container">
    <div class="progress-bar-wrap">
      <div class="progress-bar-fill" id="progress-fill"></div>
    </div>
    <div class="progress-label" id="progress-label">Question 1 of 10</div>

    <div class="question-card card">
      <div class="question-text" id="question-text"></div>
    </div>

    <div class="options-list" id="options-list">
      <!-- Answer cards rendered by JS -->
    </div>

    <button class="btn btn-primary btn-full" id="btn-submit" disabled>
      Submit Answer
    </button>

    <div class="feedback-panel" id="feedback-panel" style="display:none">
      <div class="feedback-result" id="feedback-result"></div>
      <div class="feedback-explanation" id="feedback-explanation"></div>
      <button class="btn btn-ghost btn-full" id="btn-next">Next Question →</button>
    </div>
  </div>
</section>
```

### Answer Card States:
```css
.option-card {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 16px;
  cursor: pointer;
  transition: var(--transition);
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 10px;
}
.option-card:hover { border-color: var(--accent); background: var(--accent-dim); }
.option-card.selected { border-color: var(--accent); background: var(--accent-dim); }
.option-card.correct { border-color: var(--success); background: var(--success-dim); }
.option-card.incorrect { border-color: var(--error); background: var(--error-dim); }
.option-card.disabled { pointer-events: none; }

.option-label {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-muted);
  min-width: 20px;
}
```

---

## Screen 3: Result Summary

### Layout:
```
┌─────────────────────────────────────┐
│         Session Complete            │
│                                     │
│         7 / 10                      │  ← big score
│         70% Accuracy                │
│         🔥 Excellent                │
│                                     │
│  Total Time: 8m 32s                 │
│                                     │
│  Question Breakdown                 │
│  ┌───┬──────────────┬──────┬──────┐ │
│  │ # │ Time         │Result│      │ │
│  │ 1 │ 0:37         │  ✅  │      │ │
│  │ 2 │ 1:02         │  ❌  │      │ │
│  └───┴──────────────┴──────┴──────┘ │
│                                     │
│  [Export JSON]  [Export CSV]        │
│  [Try Again]    [Back to Goals]     │
└─────────────────────────────────────┘
```

### HTML Structure:
```html
<section id="screen-result" class="screen">
  <div class="container">
    <h2 class="result-title">Session Complete</h2>

    <div class="score-display card">
      <div class="score-big" id="result-score">7 / 10</div>
      <div class="score-accuracy" id="result-accuracy">70% Accuracy</div>
      <div class="score-badge-large" id="result-badge">🔥 Excellent</div>
      <div class="score-time" id="result-time">Total: 8m 32s</div>
    </div>

    <h3 class="section-title">Question Breakdown</h3>
    <div class="breakdown-table card">
      <table id="breakdown-table">
        <thead>
          <tr>
            <th>#</th><th>Question</th><th>Time</th><th>Result</th>
          </tr>
        </thead>
        <tbody id="breakdown-body"></tbody>
      </table>
    </div>

    <div class="result-actions">
      <button class="btn btn-ghost" id="btn-export-json">Export JSON</button>
      <button class="btn btn-ghost" id="btn-export-csv">Export CSV</button>
      <button class="btn btn-primary" id="btn-retry">Try Again</button>
      <button class="btn btn-ghost" id="btn-home">← Goals</button>
    </div>
  </div>
</section>
```

---

## Modal: Create Custom Goal

```html
<div id="modal-new-goal" class="modal-overlay" style="display:none">
  <div class="modal card">
    <h3>Create New Goal</h3>
    <label>Goal Name</label>
    <input type="text" id="new-goal-name" placeholder="e.g. AWS Solutions Architect" />
    <label>Description</label>
    <input type="text" id="new-goal-desc" placeholder="Brief description" />
    <label>Questions (JSON array — see DATA.md for schema)</label>
    <textarea id="new-goal-questions" rows="8" placeholder='[{"id":"q1","question":"...","options":["A","B","C","D"],"correctIndex":0}]'></textarea>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="btn-modal-cancel">Cancel</button>
      <button class="btn btn-primary" id="btn-modal-save">Save Goal</button>
    </div>
  </div>
</div>
```

---

## Mobile Breakpoints

```css
/* All layouts are single-column on mobile by default */

@media (min-width: 480px) {
  .goal-card { flex-direction: row; align-items: center; }
  .result-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
}

@media (max-width: 479px) {
  .quiz-topbar { padding: 12px; }
  .question-text { font-size: 16px; }
  .btn-full { width: 100%; }
}
```

---

## Animations

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes flash-correct {
  0%, 100% { background: var(--success-dim); }
  50% { background: rgba(34, 197, 94, 0.3); }
}

@keyframes flash-incorrect {
  0%, 100% { background: var(--error-dim); }
  50% { background: rgba(239, 68, 68, 0.3); }
}

.question-card { animation: fadeIn 0.2s ease; }
.option-card.correct { animation: flash-correct 0.4s ease; }
.option-card.incorrect { animation: flash-incorrect 0.4s ease; }
```

---

*Feed this file to AI alongside CLAUDE.md when generating `index.html` and `styles.css`.*
