# FEAT-006 — Contact Us / Support form (logged-in users → their own Drive folder)

> **Priority:** 🟠 P2 (useful for the Lucknow pilot feedback loop; not launch-blocking)
> **Size:** S–M (~1 session) · **Risk:** Low — fully additive, isolated in its own module +
> a new Settings sub-screen + a new Apps Script action. Touches **no existing flow**.
> **Status:** 📝 PLAN — awaiting user approval. **No code until approved.**
> **Decision needed:** see "Decisions for approval" below (label, required fields, central inbox).

---

## Goal

A logged-in user can send the team a message — **Name, Email, Phone, Type (Feedback / Issue /
Concern), and a free-text message** — from inside the app. Each submission is saved to **that
user's own Drive folder** (`users/{userId}/`), consistent with the FEAT-005 per-user model.
Clean, on-brand UI; zero impact on quiz/journey/sync.

## Why this design is safe (no impact on other features)

- **New isolated module `app-contact.js`** (~100–130 lines). Nothing in existing modules is edited
  except 3 tiny, additive hooks: one new Settings tile (HTML), one `openSettingsSection('contact')`
  branch, one `<script>` tag. (Keeps app-settings.js from growing — respects the >400-line split rule.)
- **New Apps Script action `saveContact`** — an additional `doPost` branch; existing actions untouched.
- **Flag-gated** `FEATURES.contactForm` — dormant until wired + tested, flipped on last. App behaves
  exactly as today while the flag is off.
- **Login-gated by construction** — it lives inside Settings, which only exists for a signed-in user;
  `submitContact` also early-returns if `!state.user`. Anonymous visitors can never reach it.

## UX — where it lives & what it looks like

**Placement:** a new tile in the Settings menu (same pattern as My Profile / My Plan):
```
✉️  Contact Us            ›
```
Opens `settings-sub-contact`. (Settings already has the tile + sub-screen scaffold and a pinned
Back/Close footer — we reuse it, so the look is automatically consistent.)

**Form fields (top → bottom):**
| Field | Control | Default / prefill | Validation |
|---|---|---|---|
| Name | text input | prefill `state.user.name` | required, non-empty |
| Email | email input | prefill `state.user.email` if present (legacy), else blank | required, basic `x@y.z` format |
| Phone | tel input | blank | required, 10-digit (lenient: strip spaces/+91) |
| Type | segmented control (3 chips) | **Feedback** selected | required (always has a value) |
| Message | textarea (5 rows) | blank | required, min ~10 chars |
| — | **Send →** primary button | — | disabled while sending |

**States:** inline field errors (existing `_showError` pattern) · button shows "Sending…" while in
flight · on success the form is replaced by a clean confirmation ("Thanks — we've got your message
and will get back to you." + a "Send another" link) · on failure a friendly retry message; the typed
message is **never lost** (kept in the field / a localStorage draft) so a flaky network can't waste
the user's effort.

**Identity note (keeps FEAT-002 intact):** the email/phone entered here are stored **only on the
contact record** — they are NOT promoted to the account/login identity (login key stays the User ID).
This is contact info, not credentials. (Separately, these are exactly the details the paywall will
want later — a nice side benefit, but out of scope here.)

## Data model

**Primary write — the user's own folder (per requirement):**
```
users/{userId}/contact/msg_{timestamp}.json     ← one file per submission, write-once
```
Payload:
```json
{
  "userId":  "user_abc123",
  "loginId": "rahul_g7",
  "name":    "Rahul",
  "email":   "parent@example.com",
  "phone":   "9876543210",
  "type":    "feedback | issue | concern",
  "message": "….",
  "build":   "20260604a",
  "submittedAt": "2026-06-04T12:34:56Z"
}
```
Write-once (one file per submission, like `sessions/`) → no read-modify-write race, no overwrites.

**Central trail (recommended, near-free):** `saveContact` also calls the existing `_writeLog({
event:'contact', userId, type })` so every submission leaves a line in the central `logs/` folder.
Without this, messages are scattered across hundreds of per-user folders and the founder can't triage
them. With it, the user-folder copy is the record of truth **and** there's one place to scan. (This
is a Decision below — say the word and I include it.)

## Apps Script (`Code.gs`) — additive

```js
// doPost: add one branch
if (action === 'saveContact') return _json(saveContact(data));

function saveContact(c) {
  const folder = _subFolder(_userFolder(c.userId), 'contact');
  folder.createFile('msg_' + Date.now() + '.json', JSON.stringify(c, null, 2), MimeType.PLAIN_TEXT);
  _writeLog({ event: 'contact', userId: c.userId, type: c.type });   // central trail (optional)
  return { success: true };
}
```
⚠️ **Manual redeploy** of the Apps Script project required for the new action to go live (same as
`getJourney` — edit the existing deployment → New version to keep the URL stable). The form fails
gracefully ("couldn't send, try again") until then; nothing else breaks.

## storage.js wrapper (additive, awaited)

```js
async function submitContact(payload, timeoutMs = 8000) {
  if (!APPS_SCRIPT_URL) return { success: false };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(APPS_SCRIPT_URL, {
      method: 'POST', headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'saveContact', payload })
    });
    return await r.json();
  } catch (_) { return { success: false }; }
  finally { clearTimeout(timer); }
}
```
(Awaited, with a timeout — unlike the fire-and-forget syncs — because the user is waiting on a
"sent ✓" confirmation.)

## Atomic implementation steps (each commits with the app fully working)

1. **Code.gs** `saveContact` + **storage.js** `submitContact` wrapper (no caller yet) +
   `FEATURES.contactForm = false`. Commit. *(App unchanged — dormant.)*
2. **screen-settings.html** — add the `✉️ Contact Us` tile (gated: only rendered/handled when the
   flag is on) + the `settings-sub-contact` markup (fields above). Commit.
3. **app-contact.js** — `_initContactSection()` (prefill + reset), `_submitContactForm()`
   (validate → `submitContact` → success/fail states); wire `openSettingsSection('contact')`;
   add the `<script>` tag in index.html; bump `BUILD`. Commit.
4. **CSS** — minimal scoped styles for the 3-chip Type segmented control + confirmation state
   (reuse existing settings/form styles otherwise). Commit.
5. **Flip `FEATURES.contactForm` on**, smoke-test: submit each Type → confirm
   `users/{userId}/contact/msg_*.json` lands in Drive + a `logs/` line appears. Commit.

## Acceptance

- Signed-in user opens Settings → Contact Us, sees name/email prefilled, picks a Type, writes a
  message, hits Send → sees a clean "Thanks" confirmation.
- A `users/{userId}/contact/msg_{ts}.json` file appears with all fields + timestamp + build.
- Validation blocks empty/invalid email/phone/message with inline errors; typed message survives a
  failed send.
- Flag off → app is byte-for-byte today's behaviour. No quiz/journey/sync path is touched.
- Apps Script unreachable → friendly retry, no crash.

## Decisions for approval

1. **Label:** **"Contact Us"** (recommended) vs "Feedback" vs "Help & Feedback". I lean **Contact Us**
   because there's already a `Feedback` module (sound/haptics) — reusing the word would be confusing.
2. **Required vs optional:** make **Email + Phone required** (recommended, so you can actually reply),
   or allow either to be optional?
3. **Central trail in `logs/`:** include the one-line `_writeLog` mirror (recommended — lets you
   triage all messages in one place) or store **only** in the per-user folder as you specified?
4. **Type options:** Feedback / Issue / Concern (as you listed) — add "Other"? (recommended: keep 3,
   it's cleaner; "Concern" already absorbs the long tail.)

## Out of scope (later)

- In-app reply / ticketing / status tracking (this is one-way send for the pilot).
- Email notification to the founder on submit (could add a MailApp.sendEmail in `saveContact` later).
- Attachments / screenshots.
- Rate-limiting / spam protection (low risk while login-gated + pilot-scale).
