# Feature: Drive-Backed Account Persistence (Cross-Device / Incognito Login)

**Priority:** P1 | **Type:** Technical | **Complexity:** S | **Status:** Done ✅

## Goal
When a user signs up, save their account (email + password hash + profile) to Google Drive so they can log in from any device, incognito window, or after clearing browser data — not just from the same localStorage.

## Problem Today
Accounts are stored only in `localStorage` under `decashift_accounts`. If user clears cache, uses incognito, or switches device — their account is gone and they must re-register.

## Solution
On sign-up → write `accounts/acc_{emailHash}.json` to Drive (via Code.gs).  
On sign-in → if account not in localStorage, fetch from Drive by email hash and restore it.

## Drive File Structure
```
Drive Root/
└── accounts/
    ├── acc_{emailHash1}.json
    └── acc_{emailHash2}.json
```

**`accounts/acc_{emailHash}.json` schema:**
```json
{
  "email": "user@example.com",
  "passwordHash": "sha256hexstring",
  "userId": "user_abc123",
  "name": "Abhishek Sinha",
  "category": "professional",
  "grade": null,
  "course": null,
  "role": "software-engineer",
  "company": "Acme",
  "registeredAt": "2025-05-25T10:00:00Z"
}
```

## Flow

### Sign-Up
1. Hash password in browser (already done)
2. Save to `localStorage.decashift_accounts` (already done)
3. **New:** POST to Code.gs `action: saveAccount` → creates `accounts/acc_{emailHash}.json`

### Sign-In
1. Look up email in `localStorage.decashift_accounts`
2. **New:** If not found → GET from Code.gs `action: getAccount&emailHash={hash}` → restore to localStorage
3. Compare password hash → allow or reject

## Acceptance Criteria
- [ ] `saveAccount(accountData)` in Code.gs creates `accounts/acc_{emailHash}.json` — overwrites on re-register (password reset flow)
- [ ] `getAccount(emailHash)` in Code.gs returns the account JSON or `{ found: false }`
- [ ] Sign-in in incognito: enters email+password → fetched from Drive → logged in
- [ ] Sign-up twice with same email → only one file in Drive (overwrite)
- [ ] Drive fetch is silent — no UI change if Drive is slow; falls back to "account not found" message

## Email Hash
Use first 16 chars of SHA-256(email) as filename — short, collision-resistant, hides PII from filename.
```js
async function emailHash(email) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email.toLowerCase().trim()));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('').slice(0, 16);
}
```

## Dependencies
- P1-T011 (Drive file structure already in place — just add `accounts/` subfolder)

## Files to Touch
- `app/google-apps-script/Code.gs` — add `saveAccount()` and `getAccount()` functions
- `app/ui/storage.js` — add `syncAccountToDrive()` and `fetchAccountFromDrive(emailHash)`
- `app/ui/app.js` — call `syncAccountToDrive` on signup, call `fetchAccountFromDrive` on signin miss
