# M-T002: Rep Referral Tracking + Performance Dashboard

**Priority:** M1 | **Type:** Analytics / Operations | **Status:** Pending

> The ds_ref system from P2-T029 already captures which domain/URL brought a signup.
> This task extends it to support named rep codes and builds a simple tracking view
> so you can see every rep's performance without asking them.

---

## The Problem

You have 3 reps across 3 cities. Each brings in signups. You need to know:
- Who is performing (weekly signups per rep)
- Which city is converting better
- Whether signups are real (completed first session, not just registered)
- When to pay incentives

Without tracking, you're flying blind and paying on trust.

---

## How It Already Works (P2-T029 Foundation)

From P2-T029, the app already does:
```js
// On signup, user profile includes:
user.signupRef = localStorage.getItem('ds_ref') || 'direct';
// ds_ref is set from ?ref= URL param or hostname
```

This means every user's Drive profile already has `signupRef`.
The data is already being captured — it just needs to be surfaced.

---

## Step 1 — Named Rep Codes in URLs

Each rep gets a unique ref code: `punekids.in?ref=rahul-pune`

**Extend `_detectCity()` in app.js to also capture named ref params:**

```js
function _captureRef() {
  const params = new URLSearchParams(window.location.search);
  const ref    = params.get('ref');
  if (ref) localStorage.setItem('ds_ref', ref.toLowerCase().trim());
}
// Call _captureRef() in init(), before any screen is shown
```

This is a 3-line addition. The ref is already stored and written to Drive on signup.

**Rep code format:** `city-firstname` (e.g., `pune-rahul`, `nagpur-priya`, `indore-amit`)
Simple, readable, no collision risk.

---

## Step 2 — Google Sheet Performance Dashboard

A shared Google Sheet (one tab per city) that you update weekly:

**Columns:**
```
Rep Name | City | Ref Code | W1 Signups | W2 Signups | W3 Signups | W4 Signups | Total | Pro Conversions | Earnings ₹ | Status
```

**Data source:** Apps Script reads Drive user files, counts `signupRef` matches per rep code.

**Apps Script snippet (add to existing Code.gs):**

```js
function getRepStats() {
  const folder = DriveApp.getFolderById(USERS_FOLDER_ID);
  const files  = folder.getFiles();
  const counts = {};
  while (files.hasNext()) {
    const data = JSON.parse(files.next().getBlob().getDataAsString());
    const ref  = data.signupRef || 'direct';
    counts[ref] = (counts[ref] || 0) + 1;
  }
  Logger.log(JSON.stringify(counts));
  // Write to a "Rep Stats" sheet
}
```

Run weekly (manually or on a time trigger). Output goes to the sheet automatically.

---

## Step 3 — Verified Signup Definition

A signup counts toward rep incentive only when:
1. User has a valid email (not test@test.com etc.)
2. User has completed at least 1 quiz session (sessions array in Drive has 1+ entry)
3. `signupRef` matches rep's code

**Why this matters:** Prevents the rep from creating fake accounts to inflate their count.
Apps Script can check sessions length > 0 before counting.

---

## Step 4 — Weekly Review (10 minutes every Monday)

1. Run `getRepStats()` Apps Script → numbers flow into sheet
2. Compare vs targets (M-T001 targets)
3. WhatsApp each rep: "You hit 23 signups this week! 🔥 Paying ₹115 now."
4. UPI transfer immediately

**No rep should ever have to chase you for payment.** Pay before they ask. It's the single most important thing to keep motivated salespeople engaged.

---

## Acceptance Criteria

- [ ] `_captureRef()` added to `init()` — reads `?ref=` param on every page load
- [ ] Rep codes format documented and assigned before any rep starts
- [ ] Google Sheet created with correct columns, one tab per city
- [ ] Apps Script `getRepStats()` written and tested on real Drive data
- [ ] Verified signup logic implemented (session count check)
- [ ] First manual run of `getRepStats()` confirms data flows correctly

## Files to Touch

- `app/ui/app.js` — add `_captureRef()` call in `init()`
- `Code.gs` (Apps Script) — add `getRepStats()` function
- Google Sheet — create manually, link in project reference memory
