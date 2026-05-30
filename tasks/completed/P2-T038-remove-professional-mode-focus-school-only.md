# Feature: Remove Professional Mode — School-Only Focus (Grade 2–12)

**Priority:** P2 | **Type:** Product Simplification | **Complexity:** M | **Status:** Pending

---

## Decision

This app (Donnibo / DecaShift Students) is **school-only**. Grade 2 through Grade 12.

Professional upskilling and competitive exam prep are separate products:
- **App 2:** Professionals — DevOps, Cloud, ML, interview prep (fork after this app is stable)
- **App 3:** Exam aspirants — UPSC, JEE, NEET, CAT (fork after App 2 is stable)

Keeping professional content and signup flows in this app creates:
- Confused landing page ("is this for kids or engineers?")
- Wasted code paths that serve zero users of this app's target audience
- Harder to market — you cannot write one ad for a 9-year-old and a DevOps engineer
- Content gaps — professional question bank has 5 tracks with thin content; school has 6,000+ questions

**Remove it now. Ship a clean, focused product.**

---

## What to Remove

### Signup Flow (`app-auth.js`, `index.html`)
- [ ] Remove "I'm a Professional" path card from landing screen
- [ ] Remove `category = 'professional'` branch in `_handleSignup()`
- [ ] Remove professional fields from signup form: role, company, `reg-role`, `reg-company`
- [ ] Remove `pro-fields` div from signup HTML
- [ ] Simplify signup to school-only: name, email, mobile, password, grade
- [ ] Remove `pendingCategory` state — category is always `'school'`
- [ ] Update landing page copy to reflect school-only focus

### Settings (`app-settings.js`, `index.html`)
- [ ] Remove `settings-pro-fields` div (role, company fields)
- [ ] Remove professional branch from `_initProfileSection()`
- [ ] Remove professional branch from `saveProfileEdit()`

### Home Screen (`app-home.js`)
- [ ] Remove professional filter from `_filterManifest()` in `app-core.js`
- [ ] Remove `category === 'college'` branch (college is a grade level within school, keep it)
- [ ] Remove `category === 'professional'` branch from manifest filtering

### Question Content
- [ ] Remove or archive professional question files from `questions/professional/` folder
- [ ] Remove professional entries from `questions/manifest.json`
- [ ] Archive task files P1-T009 (migrate Drive), P2-T013 (subscription tiers professional split) — these were designed with professional users in mind

### Landing Page (`index.html`)
- [ ] Remove "I'm a Professional" path card (`path-professional` button)
- [ ] Remove `btn-for-professionals` button and handler
- [ ] Update hero copy to school-specific: "For students, Grade 2 to 12"
- [ ] Update stats (remove professional track count from stat numbers)
- [ ] Update testimonials — remove professional testimonials, keep student ones

### `app-core.js`
- [ ] Simplify `_filterManifest()` — remove `professional` and `college`-as-category branches
- [ ] Keep `college` as a grade value (user.grade = 'college') since some users may be in college prep

---

## What to Keep

| Keep | Reason |
|---|---|
| College grade option in grade select | College-bound Grade 12 users; college entrance content fits school track |
| Regional language tabs | Core to school product (Hindi, Marathi, Sanskrit, etc.) |
| All school question files (Grade 2–12) | This is the product |
| GK tab and Flash Drills | Cross-grade, works for all school users |
| Streak, avatar, theme system | Core retention mechanics |
| WhatsApp support link | Still needed |

---

## What Happens to Existing Professional Users

At the time of removal, there are **zero real paid users** (pre-launch). Any test accounts with `category: 'professional'` will fail to load questions (manifest returns empty). Safe to remove.

If any real users exist before this task runs: export their data, notify via email, point them to the future Pro app.

---

## Files to Touch

| File | Change |
|---|---|
| `app/ui/index.html` | Remove pro path card, pro signup fields, pro settings fields |
| `app/ui/app-auth.js` | Remove professional branch, simplify signup |
| `app/ui/app-core.js` | Simplify `_filterManifest()` |
| `app/ui/app-settings.js` | Remove pro fields from profile init + save |
| `app/ui/app-home.js` | Remove pro-specific home logic (if any) |
| `app/ui/styles.css` | Remove `.path-professional` styles |
| `questions/manifest.json` | Remove professional entries |
| `questions/professional/` | Archive entire folder (git mv to `archive/questions/professional/`) |

---

## Acceptance Criteria

- [ ] Landing page shows only "I'm a Student" path (no professional option)
- [ ] Signup form has no role/company fields
- [ ] Home screen loads correctly for all school grades (2–12 + college)
- [ ] `_filterManifest()` returns school content only
- [ ] Professional question files removed from manifest (no 404s on page load)
- [ ] Settings → My Profile shows only school fields (grade, course)
- [ ] No console errors for any school grade user
- [ ] Committed and pushed

---

## Priority Rationale

**P2** because every session where we demo the app, the professional path is a distraction.
Every marketing asset we create has to explain "it's for students AND professionals" which
dilutes the message. Ship the school product clean. Fork the professional product later.

Do this **before** any marketing or user acquisition. A confused landing page costs users.
