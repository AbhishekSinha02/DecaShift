# Feature: Parent Progress Notifications — WhatsApp & Email

**Priority:** P3 | **Type:** Engagement / Retention | **Complexity:** M | **Status:** Pending

---

## Why This Exists

The real buyer for Grade 2–10 is the parent, not the child. The child uses the app;
the parent decides whether to pay and whether to remind the child to keep going.

A parent who sees "Arjun completed 10 Math questions today, accuracy 80% 🔥" on
WhatsApp will:
1. Show it to Arjun — social reinforcement
2. Forward it to another parent — organic word-of-mouth
3. Feel the subscription is working — reduces churn

This is the single cheapest F10 fix (school segment needs parents, not just students).
No parent dashboard needed. Just one WhatsApp message per day/week.

**Decision filter:**
- Moves toward 5K users? ✅ Parent forwarding a progress card is the #1 word-of-mouth trigger
- Fixes F10 (school segment needs parents)? ✅ Direct
- Creates shareable moment? ✅ Parent forwards to WhatsApp group
- Works on ₹8,000 Android on 4G? ✅ Text-only message, no app required

---

## Two Notification Types

### 1 — Daily Progress (sent after session ends)

Triggered: when a child completes any quiz or drill session.
Sent via: WhatsApp (primary) or Email (fallback if no WhatsApp number).

**WhatsApp message template:**
```
🎓 Donnibo Daily Update

Arjun completed today's practice!

📚 Subject: Mathematics
✅ Score: 8/10 (80%)
🔥 Streak: 5 days

Keep it up! donnibo.in
```

### 2 — Weekly Summary (sent every Sunday evening)

Triggered: cron job or on-demand from backend, every Sunday 7 PM IST.
Sent via: WhatsApp + Email.

**WhatsApp message template:**
```
📊 Arjun's Week — Donnibo

Week ending 1 June 2026

Sessions this week: 5
Avg accuracy: 76%
Best subject: Science (90%)
Current streak: 🔥 12 days

Full report: donnibo.in
```

---

## Implementation Options (choose one at build time)

### Option A — WhatsApp Business API (recommended)
- Use Twilio / Gupshup / Interakt WhatsApp Business API
- Cost: ~₹0.25–0.50 per message
- Requires: approved message template + parent opt-in
- Parent mobile number already collected at signup (`user.mobile`)
- **Best for scale** — automated, trackable, works even if parent doesn't have the app

### Option B — WhatsApp Share Button (zero infra, MVP)
- After session ends, show a "Share with parent" button
- Button pre-fills a WhatsApp message with the session result
- Parent receives it as a normal WhatsApp message from the child's phone
- No API, no cost, no backend — uses `wa.me/?text=...`
- **Best for MVP** — ship in 1 session, zero cost, works immediately

### Option C — Email via Google Apps Script
- POST session result to existing Apps Script endpoint
- Apps Script sends email via Gmail API
- Parent email already available if same as user email (or add parent email field)
- Free up to Gmail limits, works immediately, no approval needed
- **Best for email-first users**

---

## MVP Recommendation: Option B first, Option A post-100 users

**Phase 1 (Option B — this session):**
- After quiz result screen: add "📲 Share with parent" button
- Pre-fills WhatsApp message: score, subject, streak
- Zero backend, zero cost, works in 1 hour

**Phase 2 (Option A — post-launch):**
- Collect parent WhatsApp number at signup (separate from child's number)
- Integrate Gupshup / Interakt API
- Daily push after session + weekly Sunday summary
- Add opt-in/opt-out control in Settings → Notifications

---

## Data Required (all already in state)

| Field | Source |
|---|---|
| Child name | `user.name` |
| Subject | `state.selectedGoal.subject` |
| Score | `session.score / session.total` |
| Accuracy | `session.accuracy` |
| Streak | `Storage.loadStreak().current` |
| Parent WhatsApp | `user.mobile` (child's number — Phase 1) or new `user.parentMobile` field (Phase 2) |

---

## Files to Touch (Phase 1 — Option B)

- `app/ui/app-quiz.js` — add "Share with parent" button to result screen
- `app/ui/index.html` — button markup in result section (or inject via JS)
- `app/ui/styles.css` — share button style (WhatsApp green)

## Files to Touch (Phase 2 — Option A)

- `app/ui/index.html` — parent mobile field in signup + settings
- `app/ui/app-auth.js` — save `parentMobile` on signup
- `app/ui/app-settings.js` — notification preferences sub-screen
- Backend: Google Apps Script or Gupshup webhook

---

## Acceptance Criteria

### Phase 1 (MVP — Option B)
- [ ] "Share with parent" button appears on quiz result screen
- [ ] Button opens WhatsApp with pre-filled message (score, subject, streak)
- [ ] Message is readable and copy/paste friendly without WhatsApp
- [ ] Works on mobile (Android + iOS)

### Phase 2 (Option A)
- [ ] Parent WhatsApp field in signup (optional)
- [ ] Daily notification sent after every session if parent number exists
- [ ] Weekly summary sent every Sunday via WhatsApp Business API
- [ ] Opt-out in Settings → Notifications
- [ ] Delivery tracked (sent / failed)

---

## Strategic Connection to 5K Goal

A parent who gets a WhatsApp message about their child's score will:
1. Reply to the child → positive reinforcement → child keeps the streak
2. Forward to a sibling's parent → "try this app" → new user
3. Feel the ₹79/month is visible and justified → lower churn

This is the lowest-cost parent layer before building a full parent dashboard.
One share button on the result screen = the parent layer ships in 1 hour.
