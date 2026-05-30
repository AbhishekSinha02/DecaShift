# REFACTOR-001: Split `app-home.js` + `styles-app.css`

**Priority:** High (code-hygiene track) | **Force:** Maintainability | **Type:** JS+CSS refactor | **Complexity:** M | **Status:** Pending
**Session:** fast-follow after E-014 + visual QA | **Depends on:** nothing | **Risk:** Low

## Trigger
Standing instruction (`feedback_code_restructuring`): **JS > 400 lines → split · CSS > 2,500 lines → split.**
Current state (measured 2026-05-30):
- `app/ui/js/app-home.js` = **1,343 lines** (3.3× the threshold)
- `app/ui/css/styles-app.css` = **2,765 lines** (over the 2,500 threshold)

## Is it required *at this point*? — NO (not for launch)
This is **maintainability debt, not a user-facing or correctness issue.** The functional/perf/load
test pass (16/16 functional, 0 uncaught JS errors, 0 broken links) confirms the bundled files work
fine in production. Against the North Star (content depth F1, E-014 retention, ₹79 conversion),
refactoring moves **zero users**.

**Recommendation:** schedule as a **fast-follow after E-014 ships and the visual-QA pass is done**,
and bundle it with the **E8 "UX consistency" track** (E-016…E-019) — that track already rewrites the
CSS into card/spacing/sticky tokens, so splitting `styles-app.css` at the same time avoids touching
the file twice. Doing it earlier would delay the only two things that actually convert users
(content + the return nudge).

## Why low-risk
All functions in `app-home.js` are **global functions in classic `<script>` files** — there is no
module/import wiring. Splitting = moving function blocks into new files and adding `<script>` tags to
`index.html` in the correct order. Shared module-scope consts (`_DAY_ORDER`, `_MONTHS_SHORT`,
`SUBJECT_STYLE`, `_AVATAR_GRADIENTS`, `_REWARD_MILESTONES`, `_MILESTONES`) are global in classic
scripts, so they remain visible across files as long as their defining file loads first. Same for CSS:
order of `<link>`s preserves the cascade.

## Proposed split

### `app-home.js` (1,343 → ~4 files)
| New file | Lines (approx) | Contents |
|---|---|---|
| `app-home.js` | ~470 | constants, `_renderHome`, goal/archive, Netflix rows, shelves, week/topic/day cards, subject filter, `_navPractice` |
| `app-home-quest.js` | ~310 | streak bar, greeting, today card, daily quest + ritual |
| `app-home-rewards.js` | ~340 | level-up / evolution / mystery box, reward milestones, streak milestones, share |
| `app-home-chrome.js` | ~220 | avatar, city strip, header meta, partner footer, drawer open/close |

> Keep the file that defines a shared `const` **before** its consumers in `index.html`. Constants
> currently live at the top of `app-home.js`; either leave them there (load first) or hoist shared
> ones into `app-core.js`.

### `styles-app.css` (2,765 → by section)
Split along the existing section banners (home / quiz / result / journey / settings-modal / drill /
GK / overlays). Do this **inside the E8 token work** so tokens and section files land together.

## Steps
1. Create the new JS files; move function blocks verbatim (no logic changes).
2. Add `<script>` tags to `index.html` in dependency order; keep `app-home.js` (constants) first.
3. Run `node test/functional-test.mjs` → expect 16/16, 0 page errors.
4. Run `node test/load-test.mjs` → expect no regression in cold-load/stress.
5. Screenshot home at 375/768/1024/1440 → diff against `test/screenshots/` baseline.
6. Repeat for CSS split (one `<link>` per section, preserve order); re-screenshot.
7. Commit JS split and CSS split as **two separate atomic commits** (each independently working).

## Acceptance Criteria
- [ ] No single JS file > ~600 lines; no CSS file > 2,500 lines
- [ ] `functional-test.mjs` still 16/16, `pageErrorCount` = 0
- [ ] No visual diff at any of the 4 breakpoints (screenshot compare)
- [ ] App works at each commit (Code Stability Rules)

## Time estimate
- JS split: **~1.5–2 hrs** · CSS split (bundled into E8): **~1–1.5 hrs** → **~3–4 hrs total (one focused session)**

## Effort vs. value
Low effort, low risk, **zero direct user value** — pure future-bug-rate reduction. Worth doing, but
only **after** E-014 and the visual-QA pass. Do not let it preempt content (F1) or the return nudge.
