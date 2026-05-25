# Feature: Leaderboard (Paid Tier)

**Priority:** P5 | **Type:** Functional + Technical | **Complexity:** M | **Status:** Pending

## Goal
Let Pro users see how they rank against others in exam mode. Creates healthy competition and gives paid users a social reason to keep upgrading.

## Leaderboard Dimensions
- Per goal (e.g., Top 10 in Azure AKS)
- Weekly (resets every Monday)
- All-time

## Acceptance Criteria
- [ ] Leaderboard tab on home screen — locked with upgrade prompt for free users
- [ ] Shows: rank, avatar, name (first name + last initial), score, accuracy, time taken
- [ ] User's own row always visible (even if not in top 10) — highlighted
- [ ] Weekly leaderboard resets automatically (Apps Script scheduled trigger)
- [ ] Only exam sessions count toward leaderboard — practice sessions excluded
- [ ] Anonymous option: user can hide their name ("Anonymous #42")
- [ ] Top 3 get gold/silver/bronze visual treatment

## Technical Notes
- Leaderboard data aggregated by Apps Script from `sessions/sessions.json`
- Frontend fetches via Apps Script GET: `?action=getLeaderboard&goalId=azure-aks&period=weekly`
- Cached in localStorage for 5 minutes to reduce Apps Script calls
- Apps Script scheduled trigger: clear weekly leaderboard every Monday 00:00 UTC

## Dependencies
- P5-T001 (plan check)
- P5-T002 (exam mode must exist — only exam sessions count)
- P4-T001 (Apps Script analytics endpoint)

## Files to Touch
- `app/google-apps-script/Code.gs` — `getLeaderboard()`, weekly reset trigger
- `app/ui/index.html` — leaderboard screen
- `app/ui/app.js` — leaderboard fetch + render
- `app/ui/styles.css` — leaderboard table + rank badges
