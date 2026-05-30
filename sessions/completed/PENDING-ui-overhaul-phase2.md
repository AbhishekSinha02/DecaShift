# Session: PENDING — UI Overhaul Phase 2 — Visual Design System

**Priority:** 2  (run after PENDING-ui-overhaul-phase1.md is done)
**Type:** Code / Visual Design
**Est. Duration:** 2–3 hours
**Tasks:** P1-T015 (full), P1-T016 (remainder)
**Depends on:** PENDING-ui-overhaul-phase1.md complete

---

## Objective

Elevate the visual quality from "functional college project" to "premium product."
Every component gets intentional design treatment. No placeholder colors, weights, or spacing.

---

## Execute In This Order

### Step 1 — Typography system
Add Inter to Google Fonts import.
Add `--font-body: 'Inter', sans-serif` CSS var.
Apply to all body text (form labels, descriptions, card text, captions).
Keep Syne for headings, titles, stat numbers, nav labels only.

### Step 2 — Button elevation
`.btn-primary` → gradient + shadow + subtle shine:
```css
.btn-primary {
  background: linear-gradient(135deg, var(--accent), #1d4ed8);
  box-shadow: 0 4px 14px rgba(59,130,246,0.35);
}
.btn-primary:active { transform: scale(0.97); }
```
3 lines. Massive visual impact.

### Step 3 — Card depth system
Add shadow system:
```css
.card-sm { box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
.card-md { box-shadow: 0 4px 16px rgba(0,0,0,0.25); }
.card-lg { box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
```
Apply `.card-sm` to goal cards, `.card-md` to day cards.

### Step 4 — Subject color system
Map each subject to an accent color + icon:
```js
const SUBJECT_STYLE = {
  mathematics:    { color: '#3b82f6', icon: '📐' },
  science:        { color: '#22c55e', icon: '🔬' },
  physics:        { color: '#a78bfa', icon: '⚡' },
  chemistry:      { color: '#f97316', icon: '🧪' },
  biology:        { color: '#34d399', icon: '🌿' },
  english:        { color: '#60a5fa', icon: '📖' },
  'social-science': { color: '#fb923c', icon: '🌏' },
  hindi:          { color: '#f472b6', icon: '🇮🇳' },
  french:         { color: '#818cf8', icon: '🥖' },
  gk:             { color: '#14b8a6', icon: '🌍' },
};
```
Day cards: left border color matches subject.
Subject tab active: background tinted with subject color.

### Step 5 — Answer card animations
```css
.answer-card.correct { animation: correctPulse 0.3s ease forwards; }
.answer-card.incorrect { animation: wrongShake 0.35s ease forwards; }

@keyframes correctPulse {
  0%   { background: transparent; }
  30%  { background: rgba(34,197,94,0.3); transform: scale(1.01); }
  100% { background: rgba(34,197,94,0.12); transform: scale(1); }
}
@keyframes wrongShake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-5px); }
  40%       { transform: translateX(5px); }
  60%       { transform: translateX(-3px); }
  80%       { transform: translateX(3px); }
}
```

### Step 6 — Streak milestone celebration (P1-T016)
In `app-quiz.js` `_showResult()` and `app-drill.js` `_showDrillResult()`:
After `Storage.updateStreak()`, check if streak hit 3, 7, 14, or 30 days.
If yes: show `#streak-milestone-modal` with the milestone message + share button.

HTML (in index.html):
```html
<div id="streak-milestone-modal" class="modal-overlay hidden">
  <div class="modal-box streak-milestone-box">
    <div class="milestone-emoji" id="milestone-emoji">🔥</div>
    <h2 class="milestone-title" id="milestone-title">7-Day Streak!</h2>
    <p class="milestone-sub" id="milestone-sub">...</p>
    <div class="milestone-actions">
      <button class="btn btn-primary" onclick="_shareStreak()">Share 🚀</button>
      <button class="btn btn-ghost" onclick="dismissMilestone()">Keep Going →</button>
    </div>
  </div>
</div>
```

### Step 7 — Empty state polish
When goals-list is empty (no content for grade): show illustrated empty state
with a character emoji, a friendly message, and a CTA to try GK or Flash Drills:
```html
<div class="empty-state">
  <div class="empty-emoji">📚</div>
  <p class="empty-title">Content loading…</p>
  <p class="empty-sub">While you wait, try Today's GK or a Flash Drill!</p>
  <button class="btn btn-primary btn-sm" onclick="_startDailyGK()">Today's GK →</button>
</div>
```

### Step 8 — Commit
```
feat(P1-T015): visual design system — Inter font, button gradients, card depth,
subject colors, answer animations, streak milestone celebration, empty states
```

---

## Success Criteria

- [ ] Inter font used for all body/label/caption text
- [ ] Primary buttons have gradient + shadow — look premium
- [ ] Day cards have colored left border matching subject
- [ ] Answer cards animate on correct (green pulse) and wrong (red shake)
- [ ] Streak milestone modal shows at 3, 7, 14, 30 days
- [ ] Empty state is friendly and suggests alternative action
- [ ] All animations work smoothly on low-end Android (no jank)
- [ ] Dawnbreak theme feels warm and kid-friendly, not corporate
