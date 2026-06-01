# ENH-004 — Board Readiness Score (Grade 11-12)

**Priority:** Medium (post-launch feature for retention of older grades)
**Effort:** Large (1-2 sessions)
**Audience:** Grade 9-12 primarily

## Why

Grade 11-12 students use Donnibo for board exam preparation. The current Journey screen shows level + XP — a gamified metric that feels juvenile to a 16-year-old studying for CBSE boards.

What a Grade 11 student actually wants to know:
- "Am I ready for the Physics board exam?"
- "Which chapters do I need to study more?"
- "How has my accuracy changed over the last 4 weeks?"

Khan Academy's "unit progress" bars per chapter/topic are the gold standard here.

## What to build

A "Board Readiness" card on the Journey screen (Grade 9-12 users only, based on `state.user.grade >= 9`):

### Per-subject readiness band

```
Physics Readiness: ████████░░ 78%
├─ Moving Charges & Magnetism     ✓ 85%
├─ Chemical Kinetics              ✓ 90%
├─ Surface Chemistry              ▷ 70%
└─ Thermodynamics                 ○ not started
```

Calculated from: all sessions for grade-subject goals, grouped by topic key (using `_topicKeyFromGoal`).

### Subject-by-subject breakdown

Expandable by subject. Each topic shows:
- Accuracy % (color coded: <60% red, 60-80% yellow, >80% green)
- Sessions done
- "Practice again →" button if accuracy < 70%

### Trend over last 4 weeks

Simple bar chart (unicode blocks) per week, per subject.

## Data model

This can be derived entirely from existing `Storage.loadSessions()` data — no new fields needed.

```js
function _buildReadinessData(subject) {
  const sessions = Storage.loadSessions().filter(s => s.goalId.startsWith('grade' + state.user.grade + '-' + subject));
  // Group by topicKey, compute accuracy per topic
  // Return sorted topics: done (≥70%), in-progress (1-2 sessions), not started
}
```

## Acceptance

1. Grade 9-12 users see a "Board Readiness" card in Journey screen.
2. Per-subject accuracy breakdown shown as progress bars.
3. Topics with < 70% accuracy show "Practice again →" CTA.
4. Grade 2-8 users do NOT see this card.
5. No new data storage required — derived from existing sessions.
