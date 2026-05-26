# BUG-001: Sign-in after Sign-out shows all questions instead of grade-filtered ones

**Status:** Fixed ✅
**Severity:** High — breaks core grade/category filtering for returning users
**Affected:** All users who sign out and sign back in

## Steps to Reproduce
1. Sign up as a Grade 6 student
2. Verify home shows only Grade 6 goals
3. Sign out
4. Sign in with same credentials
5. Home shows ALL goals (Grade 5, 8, 10, 12, College, Professional)

## Root Cause
`signOut()` calls `Storage.clearSession()` which removes `KEYS.USER` (the full user profile) from localStorage.

On the next sign-in, `Storage.loadUser()` returns `null` because the profile was cleared. This fallback in `_handleSignin` kicks in:

```js
user = { userId: account.userId, email, registeredAt: account.createdAt };
```

This minimal object has **no `category` or `grade`**. Then `_filterManifest(manifest, user)` hits:

```js
if (!cat) return manifest; // returns ALL entries
```

So all 8 question files are fetched and shown to the user.

## Fix
Store the full user profile inside the localStorage account record (`KEYS.ACCOUNTS`) at sign-up time. On sign-in, restore the full profile from there if `loadUser()` returns null.

**`storage.js`:** `saveAccount()` now accepts and stores `userProfile` fields alongside `email`, `passwordHash`, `userId`.

**`app.js`:** `_handleSignin()` fallback reconstructs user from the full account record instead of a minimal `{ userId, email }` stub.

## Files Changed
- `app/ui/storage.js` — `saveAccount(email, passwordHash, userId, userProfile)`
- `app/ui/app.js` — `_handleSignin` fallback uses full account record
