# BUG-020 — Mobile number marked required on signup — blocks students without phones

**Severity:** High (conversion blocker for primary target audience)
**Found by:** UX Audit 2026-06-03 (Signup screen)
**File:** `app/ui/screens/screen-signup.html` line 29

## What's wrong

```html
<label for="reg-mobile">Mobile Number <span class="required">*</span></label>
<input type="tel" id="reg-mobile" ... required>
```

The mobile field is required (`*`) with `required` attribute. This blocks:
- **Grade 2-8 students** who don't own a phone — they'd need to enter a parent's number.
- **Parents hesitant to share their number** with an unknown app.
- **Students from families with one shared phone** who don't know the number by heart.

The app's zero-friction GTM strategy (per memory: `strategy_gtm_zero_friction.md`) explicitly says: "no email verification, email optional in signup". Mobile should be treated the same — optional, not required.

There's also no explanation of **WHY** the app needs a mobile number — users assume OTP/spam.

## Fix

### Part 1 — Make mobile optional

In `screen-signup.html`:
```html
<!-- Change * to (optional) -->
<label for="reg-mobile">Mobile Number <span class="optional">(optional)</span></label>
<input type="tel" id="reg-mobile" name="mobile" placeholder="9876543210"
       autocomplete="tel-national" maxlength="10" inputmode="numeric">
       <!-- Remove: required -->
```

In `app-auth.js`, wherever mobile validation is enforced, make it conditional:
```js
// Only validate if the field has a value
if (mobile && !/^\d{10}$/.test(mobile)) { showError('err-mobile', 'Enter a valid 10-digit number'); return; }
```

### Part 2 — Add reassurance copy (optional but recommended)

Below the field:
```html
<span class="form-hint">Optional — only for account recovery</span>
```

## Acceptance

- A student can complete signup with name + email + password + grade only (no mobile).
- If mobile is entered, it's still validated as 10 digits.
- No form submission blocked for missing mobile.

## Related

- GTM strategy: zero friction = no barriers before first session
- P2-T047 identity strategy (handle+PIN model may replace email+mobile entirely)
