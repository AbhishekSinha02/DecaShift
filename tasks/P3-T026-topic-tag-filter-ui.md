# Feature: Topic Tag Filter UI

**Priority:** P3 | **Type:** UX / Navigation | **Complexity:** M | **Status:** Pending

> **Subscription gate:** Topic filter is a **Pro feature**. Free users must not see
> disabled/greyed-out pills (cluttered). Instead show nothing + a single clean
> "Unlock topic practice → Pro" CTA below the subject tabs.

## Goal
Let subscribers drill into a subject by topic — Fractions, Decimals, Multiplication, etc. —
so they can focus their practice on a weak area instead of getting random questions
from the whole subject.

## Context (from testing notes)
Grade 5 This Week / Last Week sections look good. Grade change from profile works.
Next friction point: once a student is on the Math tab, they can't narrow further.
A Grade 5 student studying for a fractions test wants to see only fraction questions,
not a mix of everything.

## Design

### Tags Available on Questions
Questions already have a `tags` array in the schema (e.g. `["fractions", "unlike-denominators"]`).
This feature surfaces those tags as a second-level filter below the subject tabs.

### UI: Topic Pills (below subject tabs)
```
[Math]  [Science]  [Hindi]  ...  [All]       ← subject tabs (row 1)
[All Topics]  [Fractions]  [Decimals]  [Multiplication]  [Geometry]   ← topic pills (row 2)
```
- Topic pills appear only when a subject tab (not "All") is selected
- Pills are derived from the `tags` on visible questions for that subject + grade
- Only tags that appear on 3+ questions are shown (avoid noise from one-off tags)
- "All Topics" pill is always first and selected by default
- Active pill is highlighted with accent color

### Important Tags to Surface
High-value tags to prioritize for Grade 2–8 Math:
- `fractions`, `decimals`, `multiplication`, `division`, `geometry`, `algebra`, `measurement`
- `word-problems`, `mental-math`, `place-value`, `time`, `money`

For Science:
- `living-things`, `plants`, `animals`, `earth-science`, `matter`, `forces`, `light`, `water-cycle`

### Filtering Logic
- When a topic pill is active, filter `state.filteredQuestions` to questions whose
  `tags` array includes the selected topic
- Topic filter stacks on top of subject filter (not a replacement)
- Topic filter resets to 'all' when the user switches subject tabs

## State Changes
```js
state.topicFilter = 'all';  // new state field
```

## Acceptance Criteria
- [ ] Topic pills render below subject tabs when a subject is selected
- [ ] Only topics with 3+ questions shown
- [ ] Selecting a topic pill filters goal cards to only goals containing that topic
- [ ] OR: filters within a goal's question list (discuss which UX is right)
- [ ] Topic filter resets on subject tab change
- [ ] Mobile: pills scroll horizontally without wrapping
- [ ] "All Topics" is always first; selected pill is highlighted

## Open Question
Two UX approaches:
1. **Filter goals** — only show goal cards that contain questions with that tag
   (simpler, works with existing goal-card layout)
2. **Filter within a goal** — start a quiz showing only questions with that tag
   (more powerful, requires filtering `filteredQuestions` at quiz start)
Recommendation: start with approach 1 (filter goals), add approach 2 in a follow-up.

## Files to Touch
- `app/ui/app.js` — add `state.topicFilter`, compute topic pills in `_renderHome()`,
  apply topic filter to goal display
- `app/ui/styles.css` — `.topic-pills` row, pill styles, horizontal scroll on mobile
- `app/ui/index.html` — add `<div id="topic-pills">` between subject-tabs and goal list

## Free vs Pro UX
| User type | What they see |
|---|---|
| Free | No pills at all. Below subject tabs: one line — "🔒 Unlock topic practice with Pro →" |
| Pro | Full topic pills row with All Topics + subject-specific pills |

No disabled state. No cluttered greyed-out pills. The Pro CTA is a single line, not a modal or blocker.

## Dependencies
- P2-T021 (subject tabs — done, topic pills stack on top)
- P3-T023 (content strategy — defines which tags are canonical; important tags listed there)
- P3-T025 (file architecture — topic filter only works if questions have consistent tags)
- P3-T027 (tag quality — must be clean before pills are useful)
- P3-T028 (weekly set gating — implement plan-check pattern first, reuse here)
- P5-T004 (feature gate — `user.plan` check; can stub as `'free'` before Stripe ships)
