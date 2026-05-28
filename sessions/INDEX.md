# Donnibo — Session Schedule

> **How it works:**
> Open Claude Code in `C:\aiPrj\DecaShift` at the scheduled time.
> Say **"start the session"** — Claude reads this INDEX, finds the current/next session, executes it.
> No briefing. No context needed. The session file contains everything.

---

## Trigger Behaviour

When user says **"start the session"**:
1. Read this INDEX
2. Match today's date + approximate current time to a session
3. Open that session file and execute it top to bottom
4. If time is ambiguous (two sessions today), ask: "1:30 PM session or 6:30 PM session?"

---

## Scheduled Sessions

| Date | Time (IST) | Session File | Type | Focus | Status |
|---|---|---|---|---|---|
| 2026-05-28 | 13:30 | [1330-questions-grade9-12.md](2026-05-28-1330-questions-grade9-12.md) | Content | Generate Grade 9–12 questions (45 files, ~675q) | 🟡 Planned |
| 2026-05-28 | 18:30 | [1830-flash-drill-implementation.md](2026-05-28-1830-flash-drill-implementation.md) | Code | Commit questions + implement P2-T031 Flash Drills | 🟡 Planned |

---

## Unscheduled — Ready to Run (No Date Yet)

| Session File | Type | Focus | Depends On | Status |
|---|---|---|---|---|
| [PENDING-app-js-restructure.md](PENDING-app-js-restructure.md) | Code | Split app.js into 6 focused modules (P2-T037) | P2-T031 Flash Drill done | 🔵 Ready after 18:30 session |

---

## Completed Sessions

| Date | Time | What Was Done | Commit |
|---|---|---|---|
| 2026-05-28 | 09:00–13:00 | Strategy, 8 tasks created, P2-T030 themes implemented, marketing folder, content velocity plan | `a57d379` |

---

## How to Add a New Session

1. Create a new file: `sessions/YYYY-MM-DD-HHMM-topic.md`
2. Add a row to the Scheduled Sessions table above
3. Write the session file following the format in any existing session below
4. Commit and push

---

## Session File Format

```markdown
# Session: YYYY-MM-DD HH:MM IST — Topic

**Scheduled:** date + time
**Type:** Content | Code | Review | Mixed | Strategy
**Est. Duration:** X hours
**Trigger:** "start the session"
**Depends on:** previous session output (if any)

## Objective (one line)

## Context (what Claude needs to know, max 5 bullets)

## Execute In This Order
### Step 1 ...
### Step 2 ...

## Success Criteria (what "done" looks like)

## Hand-off to Next Session (what the next session picks up)
```
