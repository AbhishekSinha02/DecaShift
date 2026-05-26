# Feature: App & Landing Page Internationalization (i18n)

**Priority:** P6 | **Type:** Platform | **Complexity:** L | **Status:** Pending

## Goal
Make every user-facing string in the app and landing page translatable so the app
can launch in any language market without code changes — just a translation file.

Target first: Hindi (India), Arabic (Middle East/North Africa), French (France/Africa),
German (Germany/Austria/Switzerland), Spanish (Latin America + Spain).

---

## Architecture: Translation JSON Files

```
app/ui/
└── i18n/
    ├── en.json       ← default (all strings defined here first)
    ├── hi.json       ← Hindi
    ├── ar.json       ← Arabic (RTL)
    ├── fr.json       ← French
    ├── de.json       ← German
    ├── es.json       ← Spanish
    ├── ta.json       ← Tamil
    ├── te.json       ← Telugu
    ├── kn.json       ← Kannada
    └── mr.json       ← Marathi
```

### String Format (en.json)
```json
{
  "landing.headline": "Practice Daily. Grow Fast.",
  "landing.sub": "10 questions per session. Instant feedback. Daily streaks.",
  "landing.cta.signup": "Get Started Free",
  "landing.cta.signin": "Sign In",
  "quiz.submit": "Submit Answer",
  "quiz.next": "Next Question",
  "quiz.progress": "Question {current} of {total}",
  "result.score": "You scored {score} / {total}",
  "result.accuracy": "{pct}% accuracy",
  "streak.label": "Day streak",
  "trial.expired.title": "Your 15-day trial has ended",
  "trial.expired.cta": "Upgrade — ₹199/month"
}
```

### Usage in app.js
```js
function t(key, vars = {}) {
  const lang = state.lang || navigator.language.split('-')[0] || 'en';
  const strings = state.i18nStrings[lang] || state.i18nStrings['en'];
  let str = strings[key] || key;
  Object.entries(vars).forEach(([k, v]) => str = str.replace(`{${k}}`, v));
  return str;
}

// Example usage:
document.getElementById('submit-btn').textContent = t('quiz.submit');
document.getElementById('progress').textContent = t('quiz.progress', { current: 3, total: 10 });
```

---

## RTL Support (Arabic)
Arabic is written right-to-left. Add `dir="rtl"` to the HTML element when Arabic is active:

```js
document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
```

CSS already uses CSS variables — most layout will work with RTL automatically.
A few flex direction overrides may be needed.

---

## Language Detection + Selection

1. **Auto-detect:** use `navigator.language` on first visit — set `state.lang`
2. **Manual override:** language selector in footer / profile settings
3. **Persist:** save `lang` in user profile (localStorage + Drive)

---

## Landing Page Localization
Separate landing page per language OR dynamic string swap on the same page.
Dynamic swap is simpler. SEO-wise, separate URLs (e.g., `/hi/`, `/ar/`) are better
for search ranking but require more infrastructure.

Phase 1: dynamic string swap on same URL.
Phase 2: separate language URLs for SEO.

---

## Acceptance Criteria

- [ ] `en.json` with all UI strings extracted (no hardcoded text in HTML/JS)
- [ ] `t()` function in app.js for string lookup with variable interpolation
- [ ] Language auto-detected from browser on first visit
- [ ] Language selector in profile/settings
- [ ] RTL layout works for Arabic (dir="rtl", flex overrides)
- [ ] `hi.json`, `ar.json`, `fr.json`, `de.json`, `es.json` translated
- [ ] Landing page headline, CTA, and stats translated in all 5 languages
- [ ] Language preference saved to user profile

## Files to Touch
- `app/ui/i18n/*.json` — all language files
- `app/ui/app.js` — `t()` function, language detection, persistence
- `app/ui/index.html` — replace all hardcoded strings with JS-driven text
- `app/ui/styles.css` — RTL overrides

## Dependencies
- P4-T003 (GTM strategy — identifies which language markets to prioritize)
- P3-T013 (regional languages — adds Indian language question content; this adds UI translation)
- Enables: P6-T005 (international language learning), P6-T006 (localized content)

## Note
Question content (JSON files) is separate from UI translation.
A French-speaking user can use the app in French UI while answering English questions.
Localized question content (P6-T006) is a separate, later task.
