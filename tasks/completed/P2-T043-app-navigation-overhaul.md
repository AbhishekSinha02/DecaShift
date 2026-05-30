# P2-T043 — App Navigation Overhaul: Top Drawer, Swipe-Based Weeks + Cards

**Priority:** P2 | **Complexity:** L | **Status:** Pending

## Goal

A world-class app navigation that feels native, not web.
Remove the bottom nav bar. Move all navigation to the top.
Weeks navigate vertically (swipe up/down). Question sets navigate horizontally (swipe left/right within a week). The content frame is always fixed — only the content area scrolls/slides.

## Current Navigation

```
[ Header: Logo | streak bar | avatar ]
[ Subject tabs ]
[ Home content: Today card | Flash Drills | Goals list ]
[ Bottom nav: Drills | Practice | GK | Me ]
```

Problems:
- Bottom nav takes permanent space (64px) on a small screen
- All navigation options in a flat row — no hierarchy
- "Practice" and "GK" and "Drills" are separate concerns forced into the same bar
- No swipe navigation for week/card browsing

## New Navigation Architecture

### Fixed shell (never scrolls)
```
[ Header: Logo | avatar + menu trigger ]
[ Subject tabs (sticky under header) ]
[ Content area — scroll-snapped ]
```

### Menu trigger
A `☰` icon in the header (top right, left of avatar ring) opens a slide-in drawer from the right:
```
[ ╳ Close ]
[ ⚡ Flash Drills ]
[ 📖 Practice (current) ]
[ 🌍 Today's GK ]
[ 👤 Profile / Settings ]
```
Drawer slides in with `transform: translateX(100%)` → `translateX(0)`. Overlay background. Closes on overlay tap or ╳.

### Week navigation (vertical swipe / scroll-snap)
Content area uses `scroll-snap-type: y mandatory; overflow-y: scroll`.
Each "week frame" is a full-height snap point:
```
[ This Week ↕ scroll down ]
[ Last Week ↕ scroll down ]  
[ 2 Weeks Ago ]
```
Scroll position indicator: small pill "This Week / Last Week" appears top-center, updates as you scroll.

### Card navigation within week (horizontal swipe)
Within each week frame, subject cards slide left/right:
```
[ Math cards ↔ ] [ Science cards ↔ ] [ English ↔ ]
```
Uses `scroll-snap-type: x mandatory; overflow-x: scroll` on a horizontal track.
Each subject card is a snap point.

### Removed
- Bottom nav bar (`.bottom-nav`) removed entirely
- Bottom nav space reclaimed for content

## Implementation Steps

### 1. Header — add drawer trigger
Add `☰` button to header left of avatar ring. Wire to `_openDrawer()`.

### 2. Navigation drawer HTML + CSS
New `screens/screen-drawer.html` (or inline in screen-home.html, loaded once).
Slide-in from right: `position: fixed; right: 0; top: 0; height: 100vh; width: 280px`.

### 3. Content area — vertical scroll-snap
Wrap home content in a scroll-snap container:
```html
<div class="home-snap-container">
  <div class="home-snap-week" data-week="current"><!-- current week content --></div>
  <div class="home-snap-week" data-week="last"><!-- last week content --></div>
</div>
```
Week label pill updates on `scroll` event (IntersectionObserver on each week frame).

### 4. Subject card row — horizontal scroll-snap
```html
<div class="subject-card-track">
  <div class="subject-card" data-subject="math"><!-- math sets --></div>
  <div class="subject-card" data-subject="science"><!-- science sets --></div>
</div>
```

### 5. Remove bottom nav
Delete `.bottom-nav` from screen-home.html.
Remove all `.bottom-nav` CSS from styles-app.css.

## CSS Approach

```css
.home-snap-container {
  height: calc(100vh - 120px); /* minus header + subject tabs */
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  -ms-overflow-style: none; /* hide scrollbar */
  scrollbar-width: none;
}
.home-snap-week {
  height: 100%;
  scroll-snap-align: start;
  flex-shrink: 0;
}
.subject-card-track {
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  -ms-overflow-style: none;
  scrollbar-width: none;
  gap: 16px;
  padding: 0 20px;
}
.subject-card {
  min-width: calc(100vw - 40px);
  scroll-snap-align: start;
  flex-shrink: 0;
}
```

## Files
- `app/ui/screens/screen-home.html` — restructure content area + add drawer trigger
- `app/ui/css/styles-app.css` — bottom nav removal, snap container, drawer
- `app/ui/js/app-home.js` — drawer open/close, week scroll indicator

## Success Criteria
- [ ] Bottom nav removed, no dead space
- [ ] Drawer opens/closes from top-right ☰ button
- [ ] Swiping up on home shows last week's content
- [ ] Swiping left/right navigates between subject cards within a week
- [ ] "This Week / Last Week" label updates as user scrolls
- [ ] No horizontal overflow on any screen
- [ ] Drawer overlay closes on backdrop tap
- [ ] Works at 375px width
