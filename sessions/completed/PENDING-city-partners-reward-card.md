# Session: PENDING — City Partner Footer + Reward Card System (P3-T032)

**Priority:** 5
**Type:** Code
**Est. Duration:** 2 hours
**Task:** P3-T032
**Trigger:** "start the session" (Priority 5 in pending queue)
**Depends on:** P3-T031 city detection done (already shipped)

---

## Objective

Show city-specific partner listings in the app footer. Issue Reward Cards when students hit 7-day streak. Card is shown in-app and shareable via WhatsApp. Fixes F7 (no virality) and F10 (no parent layer).

---

## Context

- City detection (P3-T031) is already live — city known from hostname or IP
- Full spec in: `tasks/P3-T032-city-partner-footer-reward-card-system.md`
- Partners are stored in `config/city-partners.json` — Pune already has 3 partners
- Reward Card triggers: 7-day streak, 30-day streak, Monthly Current Affairs completion
- Share card → WhatsApp → word-of-mouth acquisition

---

## Execute In This Order

### Step 1 — Create `config/city-partners.json`
```json
{
  "pune": [
    { "name": "Perfect Stationaries", "category": "Stationery", "offer": "10% off on notebooks", "icon": "✏️" },
    { "name": "Global Coaching", "category": "Coaching", "offer": "Free trial class for streak holders", "icon": "📚" },
    { "name": "Mira Books", "category": "Books", "offer": "₹20 off on any purchase over ₹100", "icon": "📖" }
  ],
  "nagpur": [],
  "indore": []
}
```

### Step 2 — JS
- `_loadCityPartners()` — fetch config/city-partners.json, match to detected city
- `_renderPartnerFooter()` — render partner listing or hide if empty
- `_checkRewardMilestones()` — called after streak update; checks if 7/30-day threshold hit
- `_generateRewardCode(userId, milestone)` — deterministic short code
- `_showRewardCard(milestone)` — full-screen card with valid partners + code
- `_shareRewardCard()` — clipboard copy of share text

### Step 3 — HTML
- Partner footer section (below existing footer, city-conditional)
- Reward Card screen (full-screen overlay, shown on milestone)
- Reward Card notification banner on home (pulsing, dismissible)

### Step 4 — CSS
- Partner footer: subtle, card-like, city-branded
- Reward Card: gold border, "Donnibo Reward Card" feel
- Notification banner: accent-coloured, pulsing animation

### Step 5 — Wire into streak
In `Storage.updateStreak()` completion → call `_checkRewardMilestones()`

### Step 6 — Commit
```bash
git add app/ui/ config/
git commit -m "feat(P3-T032): city partner footer + Reward Card system -- fixes F7 + F10"
git push origin main
```

---

## Success Criteria
- [ ] Pune users see 3 partner listings in footer
- [ ] Non-Pune users with no partners: footer section hidden
- [ ] 7-day streak → Reward Card notification banner on home
- [ ] Tapping banner opens full Reward Card screen
- [ ] Share button copies WhatsApp-ready text to clipboard
- [ ] Committed and pushed
