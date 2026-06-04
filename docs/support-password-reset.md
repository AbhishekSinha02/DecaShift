# Support runbook — offline password reset

> Donnibo has **no email** (login key is the User ID, FEAT-002) so there is no
> automated "forgot password" email. Resets are done by support, by hand, against
> the user's account record on Drive. This is the intended process for the pilot —
> low volume, human-closed, zero extra infra.

## When a user can't sign in

1. **Confirm identity.** Ask for their **User ID** (the `loginId` they signed up with)
   and one fact only they'd know (child's name + grade, or city/rep who onboarded them).
2. **Find the account file** in the Drive folder backing the Apps Script
   (`FOLDER_ID` in `app/google-apps-script/Code.gs`):
   ```
   <FOLDER_ID>/accounts/acc_{loginIdHash}.json
   ```
   The filename uses a hash of the User ID, so search the `accounts/` folder by
   opening files / sorting by modified date around their signup time, or use the
   admin helper below to look it up by User ID directly.
3. **Set a known default password.** Edit the account JSON and replace
   `passwordHash` with the hash of a **default password** you give the user
   (e.g. `donnibo123`). Compute the hash with the snippet below — it must match the
   app's `Storage.hashPassword` exactly (SHA-256 of `password + ':decashift-salt'`).
4. **Set `mustChangePassword: true`** on the same record (see "Forced change" below).
5. Tell the user: *"Sign in with User ID `<id>` and password `donnibo123` — the app
   will ask you to set a new password."*

## Compute the default password hash

Run in any browser console (or Node with `crypto.subtle`):

```js
async function hash(pw) {
  const data = new TextEncoder().encode(pw + ':decashift-salt');
  const h = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join('');
}
hash('donnibo123').then(console.log);
```

Paste the result into `passwordHash`. Pre-compute the hash of your standard default
once and reuse it.

## Forced change on first login (`mustChangePassword`)

> ⚠️ **Not yet wired in the client** — remaining sub-item of P2-T046. Until it ships,
> instruct the user to change their password themselves after signing in:
> **Settings → Security → Change password.** The new hash syncs to Drive automatically.

When implemented, signin reads `mustChangePassword` off the account record and, if
true, routes the user to the change-password screen **before** home; on success the
flag is cleared and the new hash is written back via `syncAccountToDrive`.

## Notes

- The user's **journey is never touched** by a password reset — XP/streak/badges live
  in `users/{userId}/journey.json`, a different file. Resetting the password only
  changes `accounts/acc_*.json`.
- If Drive is unreachable, the user can still self-serve via the in-app
  **Settings → My Progress → Export backup / Restore from file** (P2-T046) to move
  their progress to a new device without signing in.
- Keep a private log of resets (User ID + date) — repeated reset requests for the same
  account can signal an account-sharing or takeover attempt.
