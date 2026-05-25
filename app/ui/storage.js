// storage.js — localStorage-first, Google Drive sync via Apps Script

const Storage = (() => {
  // Set APPS_SCRIPT_URL after deploying google-apps-script/Code.gs as a Web App
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxrMOKGCQ3WyZ1SkHOUSUyb8xYy6iYCYSzjLH3r2rVkoQii6UrNYRuPaA0shSukRkj0SA/exec';

  const KEYS = {
    USER:     'decashift_user',
    USER_ID:  'decashift_user_id',
    SESSIONS: 'decashift_sessions'
  };

  // ── User ──────────────────────────────────────────────────────────────────

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

  async function syncUserToRemote(user) {
    if (!APPS_SCRIPT_URL) return { success: false, reason: 'no_endpoint' };
    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        // text/plain avoids CORS preflight while still carrying JSON body
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'saveUser', payload: user })
      });
      return await res.json();
    } catch (err) {
      console.warn('[DecaShift] Remote user sync failed — localStorage only:', err.message);
      return { success: false, reason: 'fetch_failed' };
    }
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
      }).catch(err => console.warn('[DecaShift] Session sync failed:', err.message));
    }
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
    const remaining = loadSessions().filter(s => s.goalId !== goalId);
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(remaining));
  }

  // ── Export ────────────────────────────────────────────────────────────────

  function exportAsJSON(sessions) {
    _downloadBlob(
      new Blob([JSON.stringify(sessions, null, 2)], { type: 'application/json' }),
      `decashift-sessions-${Date.now()}.json`
    );
  }

  function exportAsCSV(sessions) {
    const headers = ['sessionId','userId','goalId','sessionStart','sessionEnd',
                     'totalDurationSeconds','score','total','accuracy'];
    const rows = sessions.map(s =>
      headers.map(h => `"${String(s[h] ?? '').replace(/"/g, '""')}"`).join(',')
    );
    _downloadBlob(
      new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' }),
      `decashift-sessions-${Date.now()}.csv`
    );
  }

  function _downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: filename });
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  return {
    getOrCreateUserId,
    saveUser,
    loadUser,
    syncUserToRemote,
    saveSession,
    loadSessions,
    getLastSessionForGoal,
    clearSessionsForGoal,
    exportAsJSON,
    exportAsCSV
  };
})();
