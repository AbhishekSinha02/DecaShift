# BUG-015 — WhatsApp support number is a dummy placeholder

**Severity:** Critical (P0 before any user reaches the app)
**Found by:** UX Audit 2026-06-03 (Settings → About & Help)
**File:** `app/ui/screens/screen-settings.html` line 206

## What's wrong

```html
<a class="settings-help-link"
   href="https://wa.me/919876543210?text=Hi%2C%20I%20need%20help%20with%20Donnibo"
   target="_blank" rel="noopener">WhatsApp ↗</a>
```

`+91 9876543210` is the canonical Indian dummy/test phone number (used in every example/demo). It is NOT a real number. Any user who taps "WhatsApp ↗" for support reaches a stranger's phone or a dead number.

**Risk:** A paying user with a problem gets no support. A school teacher evaluating the app finds a broken support link. Both are conversion killers.

## Fix

Replace `919876543210` with the actual owner's WhatsApp number (or a dedicated support number).

Also add a fallback email: `support@donnibo.app` or the owner's email as secondary contact.

## Acceptance

Tapping "WhatsApp ↗" opens WhatsApp to the correct support number.
