# Session: PENDING — CSS Split Phase 1 (P1-T019)

**Priority:** 1 ← TOP of queue
**Type:** Refactor
**Est. Duration:** 45 minutes
**Task:** P1-T019
**Trigger:** "start the session"
**Depends on:** — (standalone)

---

## Objective

Split `styles.css` (2,081 lines) into 3 focused files by copying exact line ranges,
update `index.html` to load all 3, delete the original. Zero visual change.

---

## Read Before Starting

```
app/ui/styles.css        — full file, know the split points below
app/ui/index.html        — line ~17: the single <link> to replace with 3
```

Confirm `git status` is clean before starting.

---

## Exact Split Points (do not re-derive — use these)

| File | Lines from styles.css | What it contains |
|---|---|---|
| `styles-base.css` | **1 – 167** | CSS vars, reset, body, screen routing, shared card, buttons, forms, typography |
| `styles-auth.css` | **168 – 485** | Landing screen, Sign Up screen, Sign In screen |
| `styles-app.css`  | **486 – 2081** | Home, Quiz, Result, Drill, GK, Settings, Toast, Responsive, all Phase 1–4 UI |

---

## Execute In This Order

### Step 1 — Read styles.css lines 1–167, write to styles-base.css

Use the Read tool with `offset: 0, limit: 167` then Write to `app/ui/styles-base.css`.
Verify: file should start with `:root {` and end just before the Landing screen section comment.

### Step 2 — Read styles.css lines 168–485, write to styles-auth.css

Use `offset: 167, limit: 318` then Write to `app/ui/styles-auth.css`.
Verify: file should start with the Landing screen `/* ═══` comment and end just before
the Home/Goal Select section comment.

### Step 3 — Read styles.css lines 486–2081, write to styles-app.css

Use `offset: 485, limit: 1596` then Write to `app/ui/styles-app.css`.
Verify: file should start with the Home/Goal Select `/* ═══` comment and end with
the last CSS rule in the file.

### Step 4 — Update index.html

Find:
```html
  <link rel="stylesheet" href="styles.css">
```

Replace with:
```html
  <link rel="stylesheet" href="styles-base.css">
  <link rel="stylesheet" href="styles-auth.css">
  <link rel="stylesheet" href="styles-app.css">
```

### Step 5 — Rename original styles.css to styles-legacy.css (rollback, not deleted yet)

```bash
git mv app/ui/styles.css app/ui/styles-legacy.css
```

Keep for 1 session as rollback. Delete in the next session once Phase 1 is confirmed stable.

### ✅ COMMIT

```bash
git add app/ui/styles-base.css app/ui/styles-auth.css app/ui/styles-app.css
git add app/ui/styles-legacy.css app/ui/index.html
git commit -m "refactor(P1-T019): split styles.css → base/auth/app — 167/318/1596 lines"
git push origin main
```

---

## Verification Checklist

- [ ] `styles.css` renamed to `styles-legacy.css` (git mv, not delete)
- [ ] `styles-base.css` starts with `:root {`
- [ ] `styles-auth.css` starts with Landing screen section comment
- [ ] `styles-app.css` starts with Home/Goal Select section comment
- [ ] `index.html` has 3 `<link>` tags in order: base → auth → app
- [ ] Line counts: base ~167, auth ~318, app ~1,596 (total ~2,081)
- [ ] No console errors in browser

## Hand-off to Phase 2

`styles-legacy.css` can be deleted in any subsequent session.
Phase 2 (P2-T035) triggers when `styles-app.css` exceeds 2,000 lines.
Rule going forward: new auth CSS → `styles-auth.css`, new app CSS → `styles-app.css`.
