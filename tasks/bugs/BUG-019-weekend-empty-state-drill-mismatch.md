# BUG-019 — Weekend empty-state copy says "Flash Drills ready" but drills are hidden on non-Math tabs

**Severity:** Medium
**Found by:** UX Audit 2026-06-03 (Home screen, weekend, Science tab)
**Files:** `app/ui/js/app-home.js` — `_renderNetflixRows` empty state + `_renderFlashDrills`

## What's wrong

When a user is on a non-Math subject tab (Science, English, Soc. Sci.) on a weekend with no weekly content, the empty state renders:

```js
html += `<div class="empty-state">
  ...
  <p class="empty-sub">Flash Drills and GK are ready now — keep your streak going.</p>
  <button ...>Try GK Today →</button>
</div>`;
```

But the fix in commit `180820d` hides flash drills on non-Math tabs:

```js
const showDrills = !state.user || state.subjectFilter === 'mathematics' || state.subjectFilter === 'all';
wrap.innerHTML = showDrills ? _buildDrillRow() : '';
```

So on a Saturday on the Science tab:
- Empty state says "Flash Drills and GK are ready now"
- Flash Drill wrap is empty (correctly hidden)
- The user looks for Flash Drills, doesn't see them

**Secondary issue:** The CTA button in the empty state is "Try GK Today →" which switches to the GK tab — but doesn't directly start a GK session. The user lands on GK tab and has to click again.

## Fix

### Part 1 — Update empty state copy for non-math tabs

In `_renderNetflixRows`, branch the empty state copy by subject:

```js
if (!thisWeek.length && !lastWeek.length && !topicEntries.length) {
  const isMath = subject === 'mathematics' || subject === 'all';
  html += `<div class="empty-state">
    <div class="empty-emoji">📅</div>
    <p class="empty-title">${subLabel}${_cap((subject || 'This subject').replace(/-/g,' '))} content loads Monday.</p>
    <p class="empty-sub">
      ${isMath
        ? 'Flash Drills and GK are ready now — keep your streak going.'
        : 'Switch to Math for Flash Drills, or try today\'s GK.'}
    </p>
    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:12px">
      ${isMath ? `<button class="btn btn-ghost btn-sm" onclick="_startDrill('tables')">⚡ Flash Drill</button>` : ''}
      <button class="btn btn-ghost btn-sm" onclick="_setSubjectFilter('gk');_renderHome()">🌍 GK Today</button>
    </div>
  </div>`;
}
```

### Part 2 — GK CTA should start immediately, not just switch tab

Consider: `onclick="startGoal(state.goals.find(g => g.subject === 'gk' && g.weekNum === _getISOWeek(new Date()))?.id || '')"` — start today's GK set directly.

## Acceptance

- On Science tab (weekend): empty state says "Switch to Math for Flash Drills, or try today's GK" with two action buttons.
- On Math tab (weekend): empty state says "Flash Drills and GK are ready now" with Drill and GK buttons.
- Neither copy lies about what's visible.
