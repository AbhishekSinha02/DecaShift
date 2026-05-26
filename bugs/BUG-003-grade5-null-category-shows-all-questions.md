# BUG-003 — User With Null Category Sees All Questions (Grade 5 Bug)

**Priority:** High | **Status:** Fixed in v3.1 | **Affects:** Accounts created before category was implemented

## Symptom
A Grade 5 student sees goals and questions from all grades and categories
(school + college + professional) instead of only Grade 5 Mathematics.
Grade 8 students are unaffected and see only their grade's content.

## Root Cause
Two defensive guards in the filtering logic silently allow ALL content through
when `user.category` is null or undefined:

**Path 1 — manifest.json (localhost / API rate-limit fallback):**
```js
// app.js _filterManifest()
if (!cat) return manifest; // ← returns ALL entries when category is null
```

**Path 2 — GitHub auto-discovery (GitHub Pages):**
```js
// app.js _fileMatchesUser()
if (!cat) return true; // ← returns true (show file) when category is null
```

## Why Grade 5 and Not Grade 8?
The Grade 5 test account was likely created before the category/grade field was
added to the signup form. Its stored profile has `category: undefined`. The
Grade 8 account was created after the feature shipped and has `category: 'school'`
set correctly, so its filter path works as expected.

## Affected Code
| File | Function | Issue |
|---|---|---|
| `app.js` | `_filterManifest()` | `if (!cat) return manifest` — shows all on null |
| `app.js` | `_fileMatchesUser()` | `if (!cat) return true` — passes all on null |

## Fix
1. Change both guards to return empty/false when category is missing
2. In `_renderHome`, when `state.goals.length === 0` AND `user.category` is missing,
   show "Complete your profile" prompt instead of generic "No goals found"
3. Existing registered users with null category will see the prompt on next login
   and can update their profile via P2-T012 (Edit Profile) once implemented

## Verification
1. Create a test account, manually clear `category` from localStorage user object
2. Reload app → should see "Complete your profile" prompt, not all questions
3. After profile edit sets grade → goals filtered correctly
