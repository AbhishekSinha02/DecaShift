# P2-T047: Username Selection & Verification
**Feature Name:** Custom Username with Duplicate Detection  
**Status:** DESIGN (ready for implementation)  
**Priority:** P2 (Identity Strategy decision)  
**Effort:** ~6 hours (backend verification + UI + testing)

---

## Overview

**Goal:** Allow users (especially kids from emailless families) to choose their own username as their account identity, with real-time duplicate detection and smart alternative suggestions.

**Rationale:**  
- Target audience: 70% don't have emails, phone numbers change frequently
- Username = readable, memorable, shareable (social credit)
- Kids like self-chosen names more than auto-assigned IDs
- Provides account recovery path (username + PIN + recovery code)

---

## User Journey

### Signup Flow — Username Selection

```
User Signup Screen
  ├─ "What's your name?" → Enter full name (e.g., "Arjun Sharma")
  ├─ "Choose a username" → Text field + "Check Availability" button
  │  ├─ User types "ArjunCoder"
  │  ├─ System checks in real-time (no button, auto-check on blur)
  │  ├─ ✅ "Available! You're ArjunCoder"
  │  └─ OR ❌ "Taken. Try: ArjunCoder42 • ArjunCoder2026 • ArjunCoderPro"
  │
  ├─ User picks from suggestions OR types their own
  ├─ "Create 4-digit PIN" (optional for kids, required for recovery)
  ├─ "Create Recovery Code" (auto-generated, user saves it)
  └─ ✅ Account created with username as primary ID

Future Logins
  └─ Username + PIN (or password)
```

---

## Technical Specification

### 1. Username Rules

| Rule | Details |
|---|---|
| **Length** | 3–20 characters |
| **Characters** | Letters (a–z, A–Z), numbers (0–9), underscore (_), hyphen (-) |
| **Format** | Cannot start/end with number or special char; must start with letter |
| **Reserved** | `admin`, `root`, `donnibo`, `support`, etc. (list TBD) |
| **Case** | Stored lowercase for uniqueness; displayed as entered |
| **Duplicates** | Real-time check against `users` table in Apps Script DB |

**Valid Examples:**
- `ArjunCoder` ✅
- `Arjun_Sharma` ✅
- `ArjunTheSmartKid123` ✅
- `a_b_c` ✅

**Invalid Examples:**
- `Arjun Sharma` ❌ (space)
- `123Arjun` ❌ (starts with number)
- `Arjun!` ❌ (special char)
- `Ar` ❌ (too short)

---

### 2. Duplicate Detection

#### Real-Time Check (Client-Side)
**Trigger:** User leaves the username field (blur event)  
**Action:** Call verification endpoint

```javascript
async function _checkUsernameAvailability(username) {
  const trimmed = username.trim().toLowerCase();
  if (trimmed.length < 3) {
    return { status: 'invalid', message: 'Too short (min 3)' };
  }
  
  const response = await fetch(
    `${CONFIG.appsScriptEndpoint}/check-username?user=${encodeURIComponent(trimmed)}`
  );
  const result = await response.json();
  
  return result;
  // { status: 'available', message: 'Available!' }
  // OR
  // { status: 'taken', suggestions: ['arjuncoder42', 'arjuncoder2026', ...] }
}
```

#### Server-Side Verification (Apps Script)
```javascript
function POST_checkUsername(username) {
  const db = SpreadsheetApp.openById(USERS_SHEET_ID);
  const sheet = db.getSheetByName('users');
  const values = sheet.getDataRange().getValues();
  
  const taken = values.some(row => 
    row[USERNAME_COL].toLowerCase() === username.toLowerCase()
  );
  
  if (!taken) {
    return { status: 'available', message: 'Available!' };
  }
  
  // Generate suggestions
  const suggestions = [
    username + '2026',
    username + Math.floor(Math.random() * 100),
    username + '_pro',
  ];
  
  return { status: 'taken', suggestions };
}
```

---

### 3. Suggestion Algorithm

When username is taken, suggest alternatives:

```javascript
function generateSuggestions(baseUsername, existingUsernames) {
  const suggestions = [];
  
  // Strategy 1: Add current year
  suggestions.push(baseUsername + new Date().getFullYear());
  
  // Strategy 2: Add random 2-digit number
  for (let i = 0; i < 2; i++) {
    const num = Math.floor(Math.random() * 100);
    const candidate = baseUsername + num;
    if (!existingUsernames.includes(candidate)) {
      suggestions.push(candidate);
    }
  }
  
  // Strategy 3: Add suffix (_pro, _cool, _kid, etc.)
  const suffixes = ['_pro', '_cool', '_kid', '_max', '_star'];
  suggestions.push(baseUsername + suffixes[Math.floor(Math.random() * suffixes.length)]);
  
  // Remove duplicates, return max 5
  return [...new Set(suggestions)].slice(0, 5);
}
```

---

### 4. UI Components

#### Username Field (Signup Form)
```html
<div class="form-group">
  <label for="username">Choose a Username</label>
  <input 
    type="text" 
    id="username" 
    placeholder="e.g., ArjunCoder"
    maxlength="20"
    onblur="_checkUsernameAvailability(this.value)"
  />
  <div id="username-status" class="status-message hidden">
    <!-- Status message goes here -->
  </div>
  
  <!-- Suggestions (if taken) -->
  <div id="username-suggestions" class="suggestions hidden">
    <p>Try one of these:</p>
    <div class="suggestion-chips">
      <!-- Suggestions rendered here -->
    </div>
  </div>
</div>
```

#### Status Messages
```javascript
const USERNAME_MESSAGES = {
  available: { icon: '✅', text: 'Great! Username available.', color: 'green' },
  taken: { icon: '❌', text: 'Taken. Try one of these ↓', color: 'orange' },
  invalid: { icon: '⚠️', text: 'Must be 3–20 characters (letters, numbers, _, -)', color: 'red' },
  checking: { icon: '⏳', text: 'Checking...', color: 'blue' },
};
```

#### Suggestion Chip (Click to Auto-Fill)
```html
<button 
  class="suggestion-chip" 
  onclick="_selectUsername('arjuncoder42')"
>
  arjuncoder42
</button>
```

---

### 5. Implementation Changes

#### app-auth.js (Signup Form)
```javascript
async function _handleSignup(e) {
  e.preventDefault();
  
  const fullName = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const username = document.getElementById('username').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  const category = document.getElementById('category').value; // 'school' or 'professional'
  const grade = category === 'school' ? parseInt(document.getElementById('grade').value) : null;
  
  // Validate
  if (!fullName || !username || !password) {
    alert('All fields required');
    return;
  }
  
  // Check username (final check)
  const check = await _checkUsernameAvailability(username);
  if (check.status !== 'available') {
    alert('Username unavailable. Choose from suggestions.');
    return;
  }
  
  // Create user with username as ID
  const user = {
    userId: username, // PRIMARY KEY = username
    name: fullName,
    email: email || null,
    category: category,
    grade: grade,
    createdAt: new Date().toISOString(),
    trialStart: new Date().toISOString(),
    pin: _hashPIN(document.getElementById('pin').value),
    recoveryCode: _generateRecoveryCode(),
  };
  
  // Save to Drive via Apps Script
  const response = await fetch(`${CONFIG.appsScriptEndpoint}/create-user`, {
    method: 'POST',
    body: JSON.stringify(user),
  });
  
  if (response.ok) {
    Storage.saveUser(user);
    _showScreen('home');
  } else {
    alert('Signup failed. Try again.');
  }
}
```

---

### 6. Password Reset / Forgot Username

**Recovery Flow:**

```
User lost access:
  ├─ "Forgot username/password?"
  ├─ Enter recovery code (shown at signup)
  ├─ System verifies code
  ├─ Shows: "Your username is: ArjunCoder"
  ├─ Reset password via email (if email provided)
  └─ Login with username + new password
```

**No email/phone → Offline Recovery:**
```
User physically has device with recovery code saved:
  ├─ Open DevTools → localStorage
  ├─ Search: 'ds_user'
  ├─ Find: recoveryCode + userId
  └─ Contact support with recovery code
```

---

### 7. Database Schema (Apps Script)

**Users Sheet:**
```
| userId (PK) | name | email | category | grade | createdAt | trialStart | pin | recoveryCode |
|---|---|---|---|---|---|---|---|---|
| arjuncoder | Arjun Sharma | arjun@test.com | school | 6 | 2026-06-01T10:00:00Z | 2026-06-01T10:00:00Z | hashed_1234 | ABC-123-XYZ |
```

---

### 8. Security Considerations

- **No email needed:** Reduces signup friction for kids
- **PIN protection:** 4-digit PIN for offline authentication (not cryptographically strong, but enough for access control)
- **Recovery code:** 12-char alphanumeric, shown once at signup, must be saved by user or parent
- **No SMS/OTP:** Avoids costs, doesn't require phone number (target audience issue)
- **Username as ID:** Memorable, no auto-generated UUIDs confusing kids

---

### 9. Testing Strategy

#### Unit Tests
- [ ] Valid username formats accepted
- [ ] Invalid formats rejected
- [ ] Duplicate detection works
- [ ] Suggestions generated correctly

#### Integration Tests
- [ ] Signup with custom username
- [ ] Username persisted to Drive
- [ ] Login with username + password
- [ ] Recovery code works offline

#### UX Tests
- [ ] Real-time availability check feels responsive (<500ms)
- [ ] Suggestions appear naturally (not overwhelming)
- [ ] Error messages clear
- [ ] Mobile signup smooth (no text cutoff)

---

### 10. Rollout Plan

**Phase 1 (Week 1): Dev + QA**
- Implement username field + verification
- Test signup flow with 50+ usernames
- Test duplicate detection

**Phase 2 (Week 2): Beta**
- Deploy to beta users
- Monitor for issues
- Gather feedback on suggestions

**Phase 3 (Week 3): Launch**
- Roll out to all users
- Notify existing users: "You now have a username: arjun_sharma_g6"

---

### 11. Metrics to Track

- Username selection success rate (% completed signup)
- Average attempts before username accepted
- Most popular suggestion accepted (signal quality)
- Forgot username request rate

---

## Related Tasks

- **P2-T046:** Cross-device sync (uses username as account key)
- **P2-T048:** Password recovery (uses username for account lookup)
- **P2-T049:** Parents manage kids accounts (username = family link ID)

---

**Defined by:** Product Lead  
**Designed for:** Emailless/kids audience (India primary, global secondary)  
**Status:** Ready for implementation sprint (P2-T047 decision needed)

