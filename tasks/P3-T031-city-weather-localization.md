# Feature: Hyperlocal Context — City Name + Weather Widget

**Priority:** P3 | **Type:** Engagement / Personalization | **Complexity:** S | **Status:** Pending

> Makes the app feel alive and local. A student in Jaipur on a rainy Tuesday
> gets a different emotional experience than one in Chennai on a sunny morning.
> Small detail, meaningful habit loop signal.

---

## Goal

Show the user's city and current weather in the app header (post-login) and
as a subtle ambient detail on the landing page (pre-login). No permission
popup — use silent IP-based geolocation. Cache aggressively so there's
zero latency on return visits.

---

## Why This Matters

1. **Personalization signal** — App "knows" where you are without asking.
   Increases the sense that this is *your* app, not a generic quiz tool.

2. **Retention micro-hook** — A contextual line like "Rainy evening in Indore ☁️ —
   good time for Math 🔢" connects the app to the user's real moment. These tiny
   environment-aware nudges significantly increase session-start rate.

3. **Hyperlocal ad foundation** — City is the key input for P4-T009 (local ad
   network). This task is the prerequisite — city detection must ship before any
   city-targeted content or sponsored resources can be shown.

4. **Local legitimacy for parents** — Parents in Tier-2/3 cities who see
   "Nagpur" in the app feel it's built for them, not just urban metros.

---

## Implementation Design

### Step 1 — IP Geolocation (Silent, No Permission)

```js
async function _detectCity() {
  const cached = JSON.parse(localStorage.getItem('ds_location') || 'null');
  if (cached && Date.now() - cached.ts < 24 * 60 * 60 * 1000) return cached; // 24h TTL

  try {
    const res  = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    const loc  = { city: data.city, region: data.region, country: data.country_name,
                   lat: data.latitude, lon: data.longitude, ts: Date.now() };
    localStorage.setItem('ds_location', JSON.stringify(loc));
    return loc;
  } catch {
    return null; // graceful — nothing shown if fails
  }
}
```

- **Provider:** `ipapi.co` — 30,000 free requests/month, no API key required.
- **Fallback:** If fetch fails, weather widget is simply not shown. No error.
- **TTL:** 24 hours — city doesn't change daily; no need to re-fetch.

### Step 2 — Weather (Zero Cost, No API Key)

```js
async function _fetchWeather(city) {
  const key   = `ds_weather_${city}`;
  const cache = JSON.parse(localStorage.getItem(key) || 'null');
  if (cache && Date.now() - cache.ts < 60 * 60 * 1000) return cache; // 1h TTL

  try {
    // wttr.in: completely free, no key, returns "Partly cloudy +28°C"
    const res  = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=%C|%t`);
    const text = await res.text();
    const [condition, temp] = text.split('|');
    const weather = { condition: condition.trim(), temp: temp.trim(), ts: Date.now() };
    localStorage.setItem(key, JSON.stringify(weather));
    return weather;
  } catch {
    return null;
  }
}
```

- **Provider:** `wttr.in` — open source, no rate limits for reasonable use,
  no API key, widely used in production apps.
- **TTL:** 1 hour — weather changes; city doesn't.

### Step 3 — Weather Icon Mapping

```js
const WEATHER_ICONS = {
  'Sunny':          '☀️', 'Clear':         '🌙',
  'Partly cloudy':  '⛅', 'Cloudy':         '☁️',
  'Overcast':       '☁️', 'Mist':           '🌫️',
  'Rain':           '🌧️', 'Drizzle':        '🌦️',
  'Snow':           '❄️', 'Thunder':        '⛈️',
  'Blizzard':       '🌨️', 'Fog':            '🌫️',
};

function _weatherIcon(condition) {
  for (const [key, icon] of Object.entries(WEATHER_ICONS)) {
    if (condition.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return '🌡️';
}
```

### Step 4 — Contextual Practice Line

Map condition → subject nudge (shown on home screen, not landing page):

| Condition | Nudge |
|---|---|
| Rain / Drizzle | "Rainy day in {city} ☁️ — perfect for a quiet Math session 🔢" |
| Hot / Sunny | "Sunny day in {city} ☀️ — cool off with Science 🔬" |
| Clear (evening) | "Clear night in {city} 🌙 — great time to practice" |
| Cold / Snow | "Cold in {city} ❄️ — warm up with a streak 🔥" |
| Default | "Good {timeOfDay} from {city} — ready to practice?" |

Time of day: morning (5–11), afternoon (12–17), evening (18–21), night (22–4).

---

## UI Placement

### Landing Page (Pre-Login)
- Subtle ambient line below the hero tagline
- Example: `📍 Mumbai · ☁️ 29°C`
- Font: DM Mono, muted color (`var(--muted)`)
- Shown only if city detects successfully — hidden otherwise
- Psychological effect: "This app knows my city — feels local"

### Home Screen (Post-Login)
- Top-right of header, alongside streak flame
- Format: `{city} {icon} {temp}`
- Example: `Pune ⛅ 27°C`
- Clicking it does nothing (it's ambient, not interactive)
- On mobile: city only (no temp) to save space

### Contextual Line (Home Screen)
- One line below the "Good morning, {name}" greeting
- Changes based on weather + time of day
- Updates on each login (uses cached weather)
- Example: "Rainy evening in Pune ☁️ — good time for Science 🔬"

---

## Privacy

- No GPS, no permission prompt — ever
- IP geolocation is standard practice (used by Netflix, Spotify, every major app)
- City is stored in localStorage only — never sent to server
- Include one-line note in privacy policy: "We detect your approximate city via IP for personalization"

---

## Acceptance Criteria

- [ ] City detected silently on first load — no popup, no UI feedback during detection
- [ ] City + weather shown on landing page (pre-login) in muted ambient style
- [ ] City + weather icon + temp shown in home screen header (post-login)
- [ ] Contextual practice line shown below greeting, varies by weather + time of day
- [ ] localStorage caches city (24h TTL) and weather (1h TTL) — no repeated network calls
- [ ] If IP geolocation fails: widget hidden silently, no error shown to user
- [ ] If weather fetch fails: city name still shown, weather hidden
- [ ] Works on mobile — city-only format on small screens
- [ ] City correctly detected for Indian Tier-1, Tier-2, Tier-3 cities (manual test)

---

## Files to Touch

- `app/ui/app.js` — `_detectCity()`, `_fetchWeather()`, `_weatherIcon()`, contextual line render,
  inject weather into header and landing hero
- `app/ui/styles.css` — `.weather-chip` (header badge), `.location-ambient` (landing page line)
- `app/ui/index.html` — placeholder `<span id="weather-chip">` in header,
  `<div id="location-ambient">` below hero tagline

## Dependencies

- P4-T009 (Hyperlocal ad network) — depends on this task; city detection is the prerequisite
- P2-T015 (Landing page improvements) — weather ambient line ships alongside landing page refresh
- No backend dependencies — pure client-side, two free external APIs

## Cost

| Service | Free Tier | At 5,000 users |
|---|---|---|
| ipapi.co | 30,000 req/month | ~5,000 req/month (24h cache) — within free tier |
| wttr.in | No limit | ~5,000 req/month (1h cache) — open source |
| **Total** | **₹0** | **₹0** |
