# Open Bugs — Priority Queue

> Completed bugs → `tasks/bugs/completed/`  
> **Do NOT scan completed/ when looking for next task — everything actionable is here.**

| ID | Severity | Title | File |
|---|---|---|---|
| _(none open)_ | — | — | — |

**Recently fixed (2026-06-02):**
- BUG-026 — sign out → sign in empty home (real RCA: profile-less account record) → [→](BUG-026-signout-signin-empty-home.md)
- BUG-027 — Settings → Security showed blank "Email" + password change broken under User-ID login → [→](BUG-027-settings-password-shows-email-not-userid.md)
- BUG-028 — sign-in stuck forever on "Checking account…" (Drive lookup had no timeout) → [→](BUG-028-signin-hangs-checking-account.md)
- BUG-029 — signup silently "succeeded" when localStorage writes were blocked → "no account found" at sign-in; now fails loudly at signup → [→](BUG-029-signup-silent-storage-failure.md)
- BUG-030 — quiz/drill result screen never rendered for User-ID accounts (leftover `state.user.email` → findAccount(undefined) threw) → [→](BUG-030-quiz-drill-result-screen-userid-crash.md)
