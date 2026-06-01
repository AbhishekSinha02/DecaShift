# ENH-007 — Weekly Completion Celebration (all 5 days done)

**Priority:** Medium (retention, word-of-mouth moment)
**Effort:** Small (~0.5 session)
**Audience:** All grades with weekly content

## Why

Currently when a student completes today's daily quest (Set + Drill + GK), the daily quest ritual fires: "Day Complete! 🎉". That's good.

But when a student completes ALL 5 days of a week (Monday through Friday), nothing special happens. This is a missed word-of-mouth moment — parents would share a "my kid completed a full week!" moment on WhatsApp. The weekly completion is a bigger milestone than a single day.

## What to build

### Detection in `_showResult()`

After saving a session, check if this completion finishes the current week for the active subject:

```js
function _checkWeeklyCompletion(goal) {
  if (!goal.weekNum || !goal.weekDay) return;  // only for weekday-based goals
  const currentWeek = _getISOWeek(new Date());
  if (goal.weekNum !== currentWeek) return;  // only current week matters

  // Get all weekday goals for this subject+week
  const weekGoals = state.goals.filter(g =>
    g.weekNum === currentWeek && g.subject === goal.subject && g.weekDay
  );
  if (weekGoals.length < 5) return;  // must be a full 5-day week

  // Check if all 5 are done now
  const allDone = weekGoals.every(g => !!Storage.getLastSessionForGoal(g.id));
  if (!allDone) return;

  // Guard: only show once per week per subject
  const key = `ds_week_complete_${goal.subject}_w${currentWeek}`;
  if (localStorage.getItem(key)) return;
  localStorage.setItem(key, '1');

  setTimeout(() => _showWeeklyComplete(goal.subject, currentWeek), 1000);
}
```

Call `_checkWeeklyCompletion(state.selectedGoal)` in `_showResult()` after the session is saved.

### The celebration overlay

```js
function _showWeeklyComplete(subject, weekNum) {
  const subj = SUBJECT_STYLE[subject] || {};
  const icon = subj.icon || '📚';
  const overlay = document.createElement('div');
  overlay.className = 'quest-ritual-overlay weekly-complete-overlay';
  overlay.innerHTML = `
    <div class="quest-ritual-card weekly-complete-card">
      <div class="weekly-complete-burst">${icon} ${icon} ${icon}</div>
      <div class="weekly-complete-badge">FULL WEEK</div>
      <div class="quest-ritual-title">Week ${weekNum} Complete!</div>
      <p class="quest-ritual-msg">All 5 days of ${_cap(subject.replace(/-/g,' '))} done — you showed up every single day this week.</p>
      <div class="ritual-actions">
        <button class="btn btn-ghost" id="weekly-share-btn">Share this 📲</button>
        <button class="btn btn-primary quest-ritual-dismiss">Amazing →</button>
      </div>
    </div>`;
  const close = () => overlay.remove();
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  overlay.querySelector('.quest-ritual-dismiss').addEventListener('click', close);
  overlay.querySelector('#weekly-share-btn').addEventListener('click', () => {
    const name = _getFirstName(state.user);
    const text = `🏆 ${name} just completed a full week of ${_cap(subject.replace(/-/g,' '))} practice on Donnibo!\n5 days in a row — the habit is real.\ndonnibo.app`;
    if (navigator.share) navigator.share({ text }).catch(() => {});
    else window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
  });
  document.body.appendChild(overlay);
  if (typeof Feedback !== 'undefined') {
    Feedback.confetti({ count: 100, colors: [(SUBJECT_STYLE[subject] || {}).color || '#3b82f6', '#f59e0b', '#22c55e'] });
    Feedback.hit('reward');
  }
}
```

## Acceptance

1. After completing the 5th day-set of a subject in the current week, the weekly celebration overlay fires (after the result screen is shown, not instead of it).
2. The overlay shows the subject icon, "Week N Complete!", a share button, and a dismiss button.
3. Tapping "Share this" shares a WhatsApp message celebrating the full week.
4. The overlay only fires once per subject per week (localStorage guard).
5. Grade 9-12 weekly goals (no weekDay field) do NOT trigger this (they have 1 set per week, not 5).
