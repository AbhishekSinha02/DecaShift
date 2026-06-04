// storage.js — DecaShift v3 — localStorage-first, silent remote sync

const Storage = (() => {
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxabOhx43W6kDeieTWeTWQns8RQUGpkw-KzpXOeOlomShAOtELrM0MoiNJydC0WGf7D/exec';

  const KEYS = {
    USER:     'decashift_user',
    USER_ID:  'decashift_user_id',
    SESSIONS: 'decashift_sessions',
    ACCOUNTS: 'decashift_accounts',
    STREAK:   'decashift_streak',
    THEME:    'decashift_theme',
    TIMER:    'decashift_timer'
  };

  // ── User identity ─────────────────────────────────────────────────────────

  function getOrCreateUserId() {
    let id = localStorage.getItem(KEYS.USER_ID);
    if (!id) {
      id = 'user_' + crypto.randomUUID().replace(/-/g, '').substring(0, 12);
      localStorage.setItem(KEYS.USER_ID, id);
    }
    return id;
  }

  function saveUser(user) {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  }

  function loadUser() {
    const raw = localStorage.getItem(KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  }

  function clearSession() {
    localStorage.removeItem(KEYS.USER);
  }

  // ── Auth accounts ─────────────────────────────────────────────────────────

  async function hashPassword(password) {
    const data = new TextEncoder().encode(password + ':decashift-salt');
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function _emailHash(email) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email.toLowerCase().trim()));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
  }

  function saveAccount(loginId, passwordHash, userId, userProfile = {}) {
    const accounts = loadAccounts();
    const idx = accounts.findIndex(a => a.loginId === loginId);
    const record = { loginId, passwordHash, userId, createdAt: new Date().toISOString(), ...userProfile };
    if (idx >= 0) accounts[idx] = record; else accounts.push(record);
    localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(accounts));
  }

  function loadAccounts() {
    const raw = localStorage.getItem(KEYS.ACCOUNTS);
    return raw ? JSON.parse(raw) : [];
  }

  function findAccount(loginId) {
    if (!loginId) return null;   // guard: undefined/null id must not throw (BUG-030)
    return loadAccounts().find(a => a.loginId === loginId.toLowerCase()) || null;
  }

  async function syncAccountToDrive(accountData) {
    if (!APPS_SCRIPT_URL) return;
    const lHash = await _emailHash(accountData.loginId);
    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'saveAccount', payload: { ...accountData, loginIdHash: lHash } })
    }).catch(() => {});
  }

  // Returns the account if Drive says found, null if Drive says not-found, and
  // THROWS on timeout / network error (so callers can tell "no account" apart
  // from "couldn't reach the server"). A bare fetch here used to hang sign-in
  // forever on a slow/unreachable endpoint — see BUG-028.
  async function fetchAccountFromDrive(loginId, timeoutMs = 8000) {
    if (!APPS_SCRIPT_URL) return null;
    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const lHash = await _emailHash(loginId);
      const r = await fetch(APPS_SCRIPT_URL + '?action=getAccount&loginIdHash=' + lHash, { signal: ctrl.signal });
      const data = await r.json();
      return data.found ? data.account : null;
    } finally {
      clearTimeout(timer);
    }
  }

  // ── Remote sync — silent, fire-and-forget ─────────────────────────────────

  function syncUserToRemote(user) {
    if (!APPS_SCRIPT_URL) return Promise.resolve({ success: false });
    return fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'saveUser', payload: user })
    })
    .then(r => r.json())
    .catch(() => ({ success: false }));
  }

  // ── Sessions ──────────────────────────────────────────────────────────────

  function saveSession(session) {
    const sessions = loadSessions();
    sessions.push(session);
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));

    if (APPS_SCRIPT_URL) {
      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'saveSession', payload: session })
      }).catch(() => {});
    }

    // Quiz/drill end mutates XP, streak, stickers, box, mastery, history at once —
    // the natural moment to push the full journey blob (P2-T046, debounced).
    syncStateSoon();
  }

  function loadSessions() {
    const raw = localStorage.getItem(KEYS.SESSIONS);
    return raw ? JSON.parse(raw) : [];
  }

  function getLastSessionForGoal(goalId) {
    const all = loadSessions().filter(s => s.goalId === goalId);
    return all.length ? all[all.length - 1] : null;
  }

  function clearSessionsForGoal(goalId) {
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(loadSessions().filter(s => s.goalId !== goalId)));
  }

  // ── Streak ────────────────────────────────────────────────────────────────

  function loadStreak() {
    const raw = localStorage.getItem(KEYS.STREAK);
    const stored = raw ? JSON.parse(raw) : {};
    // E-004: freezes/freezeMilestone/savedByFreeze default in for old records
    return Object.assign(
      { current: 0, best: 0, lastDate: null, freezes: 0, freezeMilestone: 0, savedByFreeze: null },
      stored
    );
  }

  function saveStreak(streak) {
    localStorage.setItem(KEYS.STREAK, JSON.stringify(streak));
  }

  // E-004: kind streak — a single missed day is auto-covered by a banked freeze
  // instead of resetting. Freezes are earned at each 7-day milestone (cap 2).
  function updateStreak() {
    const today  = new Date().toISOString().slice(0, 10);
    const streak = loadStreak();
    if (streak.lastDate === today) return streak;

    const last      = streak.lastDate ? Date.parse(streak.lastDate) : null;
    const daysSince = last !== null ? Math.round((Date.parse(today) - last) / 86400000) : null;

    if (last === null || daysSince === 1) {
      // first ever activity, or a consecutive day
      streak.current = last === null ? 1 : streak.current + 1;
      streak.savedByFreeze = null;
    } else if (daysSince === 2 && streak.freezes > 0) {
      // exactly one day missed → spend a freeze, keep the streak alive (kindly)
      streak.freezes  -= 1;
      streak.current  += 1;
      streak.savedByFreeze = today;
    } else {
      // longer gap or no freeze → reset, but never punish (D-006 comeback handles tone)
      streak.current = 1;
      streak.savedByFreeze = null;
    }

    streak.best = Math.max(streak.best, streak.current);
    streak.lastDate = today;

    // earn freezes at each new 7-day milestone, capped at 2
    const milestone = Math.floor(streak.current / 7);
    if (milestone > streak.freezeMilestone) {
      streak.freezes = Math.min(2, streak.freezes + (milestone - streak.freezeMilestone));
      streak.freezeMilestone = milestone;
    }

    saveStreak(streak);
    syncStateSoon();   // streak advanced — re-sync (P2-T046)
    return streak;
  }

  // E-010: bank a freeze from a mystery box (respects the cap-2)
  function grantFreeze() {
    const s = loadStreak();
    s.freezes = Math.min(2, (s.freezes || 0) + 1);
    saveStreak(s);
    syncStateSoon();   // freeze banked — re-sync (P2-T046)
    return s.freezes;
  }

  // ── Full-state sync (P2-T046) — journey + preferences + appearance ──────────
  // The user's progress is siloed in localStorage per device×browser. These bundle
  // every "see yourself grow" key into one blob written to Drive (users/{userId}/
  // journey.json via `saveJourney`) and restored on a fresh device at sign-in.
  //
  // Account/identity keys (decashift_user/_user_id/_accounts) are synced separately
  // by saveAccount and are NOT included here. Device-only keys (install/iOS-guide
  // prompts, ds_rows_inited, ds_city) deliberately do NOT travel. Entries ending in
  // '*' match by prefix (date-stamped / suffixed keys). Audited from live code 2026-06-04.
  const SYNC_KEYS = [
    // progress / journey
    'decashift_sessions', 'decashift_streak',
    'donnibo_xp_v1', 'ds_avatar',
    'donnibo_collectibles', 'donnibo_stickers_seen',
    'donnibo_box_state', 'donnibo_album_done',
    'ds_drill_records',
    'ds_quest_*', 'ds_gk_done_*', 'ds_reward_card*',
    // preferences / appearance
    'decashift_theme', 'decashift_timer', 'ds_last_subject',
    'decashift_onboarded', 'donnibo_feedback'
  ];

  function _isSyncKey(k) {
    return SYNC_KEYS.some(p => p.endsWith('*') ? k.startsWith(p.slice(0, -1)) : k === p);
  }

  // Pure read — bundle every syncable key. No behaviour change.
  function snapshotAll() {
    const keys = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && _isSyncKey(k)) keys[k] = localStorage.getItem(k);
    }
    const u = loadUser();
    return { version: 1, savedAt: new Date().toISOString(), userId: u && u.userId, keys };
  }

  // v1 = last-write-wins, whole-blob (per-key merge is DEFERRED — see task). Writes
  // each allow-listed key back; skips unknown keys; never throws on quota/missing.
  function restoreAll(blob) {
    if (!blob || !blob.keys) return false;
    for (const k in blob.keys) {
      if (!_isSyncKey(k)) continue;
      try { localStorage.setItem(k, blob.keys[k]); } catch (_) {}
    }
    return true;
  }

  // Push the full snapshot to Drive (journey.json). Silent, fire-and-forget.
  function syncStateToDrive() {
    if (!APPS_SCRIPT_URL) return Promise.resolve({ success: false });
    const blob = snapshotAll();
    if (!blob.userId) return Promise.resolve({ success: false });  // not signed in
    return fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'saveJourney', payload: blob })
    }).then(() => ({ success: true })).catch(() => ({ success: false }));
  }

  // Debounced push — coalesces the burst of key writes at quiz/drill end into one POST.
  let _syncTimer = null;
  function syncStateSoon(delay = 2500) {
    if (typeof window !== 'undefined' && !(window.FEATURES && window.FEATURES.fullSync)) return;
    clearTimeout(_syncTimer);
    _syncTimer = setTimeout(() => { syncStateToDrive(); }, delay);
  }

  // Read the journey blob back. Times out like fetchAccountFromDrive so a slow/
  // unreachable endpoint never hangs sign-in; returns null on any failure (local-first).
  async function fetchStateFromDrive(userId, timeoutMs = 8000) {
    if (!APPS_SCRIPT_URL || !userId) return null;
    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const r    = await fetch(APPS_SCRIPT_URL + '?action=getJourney&userId=' + encodeURIComponent(userId), { signal: ctrl.signal });
      const data = await r.json();
      return data.found ? data.journey : null;
    } catch (_) {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  // ── Contact / Help & Feedback (FEAT-006) ────────────────────────────────────
  // Awaited (unlike the fire-and-forget syncs) with a timeout, because the user is
  // waiting on a "sent ✓" confirmation. Writes to users/{userId}/contact/ server-side.
  async function submitContact(payload, timeoutMs = 8000) {
    if (!APPS_SCRIPT_URL) return { success: false };
    const ctrl  = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const r = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'saveContact', payload })
      });
      return await r.json();
    } catch (_) {
      return { success: false };
    } finally {
      clearTimeout(timer);
    }
  }

  // ── Export ────────────────────────────────────────────────────────────────

  function exportAsJSON(sessions) {
    _dl(new Blob([JSON.stringify(sessions, null, 2)], { type: 'application/json' }), `decashift-${Date.now()}.json`);
  }

  function exportAsCSV(sessions) {
    const h = ['sessionId','userId','goalId','score','total','accuracy'];
    const rows = sessions.map(s => h.map(k => `"${String(s[k]??'').replace(/"/g,'""')}"`).join(','));
    _dl(new Blob([[h.join(','),...rows].join('\n')], { type: 'text/csv' }), `decashift-${Date.now()}.csv`);
  }

  function _dl(blob, name) {
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: name });
    a.click(); URL.revokeObjectURL(a.href);
  }

  return {
    getOrCreateUserId, saveUser, loadUser, clearSession,
    hashPassword, saveAccount, findAccount,
    syncAccountToDrive, fetchAccountFromDrive,
    syncUserToRemote,
    saveSession, loadSessions, getLastSessionForGoal, clearSessionsForGoal,
    loadStreak, saveStreak, updateStreak, grantFreeze,
    snapshotAll, restoreAll, syncStateToDrive, syncStateSoon, fetchStateFromDrive,
    submitContact,
    exportAsJSON, exportAsCSV
  };
})();
