# FEAT-006 — Contact Us / Support form (logged-in users → their own Drive folder)

> **Priority:** 🟠 P2 (useful for the Lucknow pilot feedback loop; not launch-blocking)
> **Size:** S–M (~1 session) · **Risk:** Low — fully additive, isolated in its own module +
> a new Settings sub-screen + a new Apps Script action. Touches **no existing flow**.
> ## ✅ DONE — COMPLETED 2026-06-04 (build `20260604g`, tag `v6.1-stable`)
> Shipped, redeployed, and **verified working**: Settings → 💬 Help & Feedback submits to
> `users/{Name_loginId_userId}/contact/msg_*.json`; `?action=getContacts` triages across all
> users. Isolated `app-contact.js` + `saveContact`/`getContacts` + flag `FEATURES.contactForm`.
> Merged into `v6.0` cold backup. Original plan + locked decisions below for reference.

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
💬  Help & Feedback        ›
```
Opens `settings-sub-contact`. (Settings already has the tile + sub-screen scaffold and a pinned
Back/Close footer — we reuse it, so the look is automatically consistent.)

**Form fields (top → bottom):**
| Field | Control | Default / prefill | Validation |
|---|---|---|---|
| Name | text input | prefill `state.user.name` | required, non-empty |
| Email | email input | prefill `state.user.email` if present (legacy), else blank | **required**, basic `x@y.z` format |
| Phone | tel input | blank | **optional**; if entered, 10-digit (lenient: strip spaces/+91) |
| Type | mood chips (6, see below) | none preselected (forces a real choice) | required |
| Message | textarea (5 rows) | blank | required, min ~10 chars |
| — | **Send →** primary button | — | disabled while sending |

**Type chips — capture the user's mood, not just a category** (your call: read the user's feeling
instead of guessing; 6 options, mood-bearing first, then practical routing):
| Chip | stored `type` | reads as |
|---|---|---|
| 💛 Appreciation | `appreciation` | positive — "love it / keep going" |
| 💡 Suggestion | `suggestion` | soft — wants us to grow / an enhancement |
| 🐞 Bug / Issue | `bug` | something broke |
| 😕 Complaint | `complaint` | negative — didn't like something |
| 📚 Content / Question | `content` | about a question, topic, or how-to |
| 💳 Billing / Plan | `billing` | payment / subscription |

> The mood-bearing chips (appreciation / suggestion / complaint) let us read sentiment at a glance;
> the practical ones (bug / content / billing) route the work. Kept at 6 (your 5–7 guideline) so the
> list stays scannable on a ₹8k phone.

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

**Single source of truth — the kid's own folder (your call: everything about a child in ONE place).**
No central duplicate. A non-technical operator who knows the `userId` finds the child's profile,
journey, plan **and** their feedback/concerns all under `users/{userId}/`. **Date-stamped** so a
script can fetch by day:
```
users/{userId}/contact/msg_{YYYY-MM-DD}_{HHmmss}_{rand}.json   ← one file per submission, write-once
```
Payload:
```json
{
  "userId":  "user_abc123",
  "loginId": "rahul_g7",
  "name":    "Rahul",
  "email":   "parent@example.com",
  "phone":   "9876543210",
  "type":    "appreciation | suggestion | bug | complaint | content | billing",
  "message": "….",
  "build":   "20260604a",
  "date":    "2026-06-04",
  "submittedAt": "2026-06-04T12:34:56Z"
}
```
Write-once (one file per submission, like `sessions/`) → no read-modify-write race, no overwrites.

**Triage = one fetch script, NOT a scattered central copy** (your reasoning: a central inbox splits
the concern away from the child's journey/plan; keep it with the kid and let a script gather them).
At ≤5k users a scan is trivial. Provide an **admin read action** `getContacts` (doGet, optional
`date=YYYY-MM-DD`) that walks every `users/*/contact/` folder and returns all submissions, newest
first, optionally filtered to one day:
```
<APPS_SCRIPT_URL>?action=getContacts&date=2026-06-04   → { count, items: [ {userId, type, message, …} ] }
```
(Run it from the founder's browser/sheet. Optionally a future `key=` guard so it isn't public —
see Out of scope.)

## Apps Script (`Code.gs`) — additive

```js
// doPost: add one branch
if (action === 'saveContact') return _json(saveContact(data));
// doGet: add one branch (admin triage)
if (e.parameter.action === 'getContacts') return _json(getContacts(e.parameter.date));

function saveContact(c) {
  const folder = _subFolder(_userFolder(c.userId), 'contact');
  const d = (c.date || new Date().toISOString().slice(0, 10));
  const name = 'msg_' + d + '_' + Date.now() + '.json';
  folder.createFile(name, JSON.stringify(c, null, 2), MimeType.PLAIN_TEXT);
  return { success: true };   // NO central mirror — kept only in the kid's folder, by design
}

// Admin: gather feedback across ALL users (optionally one day). Trivial at pilot scale.
function getContacts(date) {
  const users = _subFolder(_rootFolder(), 'users').getFolders();
  const items = [];
  while (users.hasNext()) {
    const cf = users.next().getFoldersByName('contact');
    if (!cf.hasNext()) continue;
    const files = cf.next().getFiles();
    while (files.hasNext()) {
      const f = files.next();
      if (date && f.getName().indexOf('msg_' + date) !== 0) continue;
      items.push(JSON.parse(f.getBlob().getDataAsString()));
    }
  }
  items.sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || ''));
  return { count: items.length, items };
}
```
⚠️ **Manual redeploy** of the Apps Script project required for the new actions to go live (same as
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

1. **Code.gs** `saveContact` + `getContacts` (admin) + **storage.js** `submitContact` wrapper
   (no caller yet) + `FEATURES.contactForm = false`. Commit. *(App unchanged — dormant.)*
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
- Validation blocks empty name, empty/invalid email, empty message (and invalid phone *if entered*)
  with inline errors; typed message survives a failed send.
- `getContacts` (and `getContacts&date=…`) returns submissions across all users for founder triage.
- Flag off → app is byte-for-byte today's behaviour. No quiz/journey/sync path is touched.
- Apps Script unreachable → friendly retry, no crash.

## Decisions — RESOLVED (2026-06-04)

1. **Label → "Help & Feedback"** (💬). User chose this over "Contact Us".
2. **Email required, Phone optional.** Email is enough to reply; phone is a bonus, lower friction.
3. **Per-user folder is the ONLY home — no central copy.** User's reasoning: the `userId` folder is
   the single source of truth for everything about a child (profile + journey + plan + concerns), so
   a non-tech operator just needs the userId. Triage is solved by **one fetch script** (`getContacts`,
   optionally `date`-filtered), not by scattering data. Submissions are **date-stamped** for that.
4. **6 mood-bearing Type chips** (appreciation / suggestion / bug / complaint / content / billing) —
   capture the user's actual mood/feeling rather than collapsing into 3 generic buckets. (User:
   understanding the user as much as possible is core to product design.)

## Out of scope (later)

- In-app reply / ticketing / status tracking (this is one-way send for the pilot).
- Email notification to the founder on submit (could add a MailApp.sendEmail in `saveContact` later).
- **Securing `getContacts`** with a secret `key=` param (it's an admin read of all feedback; for the
  pilot it's an obscure URL, but add a key guard before it matters).
- Attachments / screenshots.
- Rate-limiting / spam protection (low risk while login-gated + pilot-scale).
