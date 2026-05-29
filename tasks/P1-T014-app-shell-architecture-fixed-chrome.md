# Feature: App Shell Architecture — Fixed Header + Sticky Tabs + Fixed Bottom Nav

**Priority:** P1 | **Type:** UX Architecture | **Complexity:** M | **Status:** Pending

> This is the single highest-impact structural fix. Everything else in the UI is
> a surface treatment. This is the skeleton. Get this right first.

---

## Problem

The home screen is a flat scrollable page. When a user scrolls down to Week 3 content,
they lose the brand, the streak, the subject tabs, and the flash drill section.
The app has no persistent chrome — it behaves like a 2010 webpage, not a 2026 app.

A daily-habit app must always show:
1. Who you are (brand + grade + city)
2. How you're doing (streak)
3. What to do next (tabs + drills)

None of these persist on scroll today.

---

## Target Architecture

```
┌──────────────────────────────────────┐
│  FIXED HEADER  (position: fixed)     │  h = 52px
│  [🎯 Donnibo] [Grade 7 · Pune] [A]  │
│──────────────────────────────────────│
│  STREAK BAR    (sticky)              │  h = 44px
│  🔥 12 days streak  · 76% accuracy  │
│──────────────────────────────────────│
│  SUBJECT TABS  (sticky below streak) │  h = 44px
│  [Math] [Science] [GK] [Hindi] [All]│
│──────────────────────────────────────│
│                                      │
│  SCROLLABLE CONTENT                  │
│  (flash drills, day cards, goals)    │
│                                      │
│──────────────────────────────────────│
│  CITY PARTNER STRIP (sticky bottom)  │  h = 36px
│  📍 Pune · Vidyarthi Pustak ↗       │
│──────────────────────────────────────│
│  BOTTOM NAV    (position: fixed)     │  h = 56px
│  [⚡Drills] [📖 Practice] [🌍 GK] [👤]│
└──────────────────────────────────────┘
```

Total chrome height: ~232px. Content area: `calc(100vh - 232px)`.

---

## HTML Structure Change

Replace current `<section id="screen-home">` interior with:

```html
<section id="screen-home" class="screen">

  <!-- Fixed top header -->
  <header class="app-header">
    <div class="app-header-brand">
      <img src="assets/icon.svg" class="app-logo" alt="Donnibo">
      <span class="app-brand-name">Donnibo</span>
    </div>
    <div class="app-header-meta" id="app-header-meta">
      <!-- Grade chip + city — rendered by JS -->
    </div>
    <div class="app-header-right">
      <div class="user-chip" onclick="toggleUserMenu()">
        <div class="user-avatar" id="user-avatar">?</div>
      </div>
      <div class="user-menu hidden" id="user-menu">...</div>
    </div>
  </header>

  <!-- Sticky streak bar -->
  <div class="streak-bar" id="streak-bar">
    <div class="streak-main">
      <span class="streak-flame">🔥</span>
      <span id="streak-count">0</span>
      <span class="streak-label">days</span>
    </div>
    <div class="streak-divider"></div>
    <span id="stat-accuracy" class="streak-stat">—</span>
    <span class="streak-stat-label">accuracy</span>
    <div class="streak-divider"></div>
    <span id="stat-sessions" class="streak-stat">0</span>
    <span class="streak-stat-label">sessions</span>
  </div>

  <!-- Sticky subject tabs -->
  <div id="subject-tabs" class="subject-tabs sticky-tabs" style="display:none"></div>

  <!-- Scrollable content area -->
  <div class="home-content" id="home-content">
    <div class="flash-drill-section" id="flash-drill-section">...</div>
    <div id="goals-list" class="goals-list">...</div>
  </div>

  <!-- City partner strip -->
  <div class="city-strip" id="city-strip">
    <span class="city-strip-icon">📍</span>
    <span class="city-strip-text" id="city-strip-text">Loading…</span>
  </div>

  <!-- Fixed bottom nav -->
  <nav class="bottom-nav">
    <button class="bottom-nav-item" onclick="_startDrill('tables')">
      <span class="bnav-icon">⚡</span>
      <span class="bnav-label">Drills</span>
    </button>
    <button class="bottom-nav-item active" id="bnav-practice" onclick="_navPractice()">
      <span class="bnav-icon">📖</span>
      <span class="bnav-label">Practice</span>
    </button>
    <button class="bottom-nav-item" onclick="_setSubjectFilter('gk');_renderHome()">
      <span class="bnav-icon">🌍</span>
      <span class="bnav-label">GK</span>
    </button>
    <button class="bottom-nav-item" onclick="openSettings()">
      <span class="bnav-icon" id="user-avatar-nav">👤</span>
      <span class="bnav-label" id="user-chip-name">Me</span>
    </button>
  </nav>

</section>
```

---

## CSS Requirements

```css
/* Fixed header */
.app-header {
  position: fixed; top: 0; left: 0; right: 0;
  height: 52px; z-index: 100;
  display: flex; align-items: center; padding: 0 16px; gap: 10px;
  background: var(--bg); border-bottom: 1px solid var(--border);
}

/* Sticky streak bar */
.streak-bar {
  position: sticky; top: 52px; z-index: 90;
  background: var(--surface); border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 10px;
  padding: 10px 16px; height: 44px;
}

/* Sticky tabs */
.sticky-tabs {
  position: sticky; top: 96px; z-index: 80;
  background: var(--bg);
}

/* Scrollable content — padding for fixed chrome above and below */
.home-content {
  padding: 12px 16px;
  padding-bottom: 140px; /* space for city strip + bottom nav */
  margin-top: 96px;      /* header + streak bar height */
}

/* City partner strip */
.city-strip {
  position: fixed; bottom: 56px; left: 0; right: 0;
  height: 36px; background: rgba(0,0,0,0.6);
  display: flex; align-items: center; padding: 0 16px; gap: 8px;
  font-size: 12px; color: var(--muted); z-index: 85;
  backdrop-filter: blur(8px);
}

/* Fixed bottom nav */
.bottom-nav {
  position: fixed; bottom: 0; left: 0; right: 0;
  height: 56px; z-index: 100;
  background: var(--surface); border-top: 1px solid var(--border);
  display: flex; align-items: stretch;
}
.bottom-nav-item {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 2px;
  background: none; border: none; color: var(--muted);
  font-size: 10px; cursor: pointer; transition: color 0.15s;
}
.bottom-nav-item.active { color: var(--accent); }
.bnav-icon { font-size: 20px; }
```

---

## JS Changes

- `_renderHome()` — update to render into `home-content` div, set header-meta with grade chip
- `_renderGradeChip()` — new: renders `Grade 7 · Pune` in app-header-meta
- `_renderCityStrip()` — new: sets city-strip-text from user city or IP detection
- Remove old `home-header`, `home-dashboard` divs (merged into fixed header + streak bar)

---

## Acceptance Criteria

- [ ] Brand logo + name visible at all times on home screen
- [ ] Grade chip visible in header (e.g., "Grade 7 · Pune")
- [ ] Streak bar sticky — visible after scrolling past content
- [ ] Subject tabs sticky — stay visible when scrolling goals list
- [ ] Flash drills in scrollable content area (not above tabs)
- [ ] City partner strip visible above bottom nav
- [ ] Bottom nav: 4 items always accessible
- [ ] No layout shift on scroll
- [ ] Works on 375px (iPhone SE) through 1440px (desktop)
