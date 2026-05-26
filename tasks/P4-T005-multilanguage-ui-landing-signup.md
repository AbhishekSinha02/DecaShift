# P4-T005 — Multi-Language UI: Landing Page + Signup in Hindi, Tamil, Marathi

**Priority:** P4 — Power Features (elevated from P6-T004)
**Complexity:** L (3–5 days)
**Status:** Pending

---

## Goal

Make the landing page, signup form, and home screen readable in Hindi, Tamil, and Marathi
so that Indian school parents and students who are not comfortable with English can use the app.
This directly expands the reachable market for the school segment (Grade 2–10).

This is a key differentiator: Khan Academy India has Hindi support but poor regional language
coverage. No Indian EdTech quiz app offers Marathi or Tamil UI natively.

---

## Scope (Phase 1 — Indian Languages)

### Languages
- English (default, already done)
- Hindi (हिंदी) — largest reach, ~530M speakers
- Marathi (मराठी) — Maharashtra school market
- Tamil (தமிழ்) — Tamil Nadu school market

### What Gets Translated
- Landing page: headline, tagline, feature strips, CTA buttons
- Signup / Signin forms: labels, placeholders, error messages, button text
- Home screen: greeting, streak labels, section headers ("This Week", "Your Goals")
- Quiz screen: "Submit Answer", "Next Question", progress text
- Result screen: score labels, export buttons

### What Does NOT Get Translated (Phase 1)
- Question content (questions remain in their source language)
- Admin/settings labels (English only for now)
- Goal titles and descriptions

### Implementation Approach
- `i18n.js` — flat key-value translation file, one object per language
- `_t(key)` helper: `function _t(k) { return i18n[state.lang]?.[k] || i18n.en[k] || k; }`
- Language stored in `localStorage` under `decashift_lang`, defaults to `'en'`
- Language picker: globe icon in landing page header + signup footer
- No server-side rendering — pure JS string replacement at render time

### Data Shape
```js
// i18n.js
const i18n = {
  en: { 'landing.headline': 'Practice Daily. Grow Fast.', 'btn.signin': 'Sign In →', ... },
  hi: { 'landing.headline': 'रोज़ अभ्यास करें। तेज़ी से बढ़ें।', 'btn.signin': 'साइन इन करें →', ... },
  mr: { 'landing.headline': 'दररोज सराव करा. वेगाने वाढा.', ... },
  ta: { 'landing.headline': 'தினமும் பயிற்சி செய். வேகமாக வளர்.', ... }
};
```

---

## Acceptance Criteria
- [ ] Language picker visible on landing page (globe icon, 4 options)
- [ ] Selected language persists across page reloads (localStorage)
- [ ] All landing page text switches to selected language
- [ ] Signup/signin form labels and errors in selected language
- [ ] Home screen greeting and section headers in selected language
- [ ] Quiz screen buttons and progress text in selected language
- [ ] RTL layout not required for Phase 1 (all 3 languages are LTR)
- [ ] English remains fully functional — no regressions

---

## Phase 2 (future — after Phase 1 validated)
- Arabic (RTL — requires layout mirroring)
- French, German, Spanish (European markets)
- Translate question content for top 3 grades in Hindi

---

## Dependencies
- Supersedes P6-T004 in priority
- Informs P4-T003 (GTM strategy — which markets to target first)
- Enables P6-T006 (localized curriculum content — UI must be in local language first)
