// challenge.js — E-013 friend challenge, entirely in the URL (no backend)
// A kid finishes a set, taps "Challenge a friend," and shares a link carrying
// {goalId, score, total, firstName} as a base64url payload. The friend opens it,
// plays the same set, and sees a head-to-head. Beating a friend is the oldest
// engagement hook there is — and every challenge opened is a potential new user.
//
//   Challenge.encode({goalId,score,total,name}) → "ch" payload string
//   Challenge.decode(str)  → {goalId,score,total,name} | null
//   Challenge.capture()    → parse ?ch= on load, stash in sessionStorage, strip URL
//   Challenge.pending()    → the stashed challenge | null
//   Challenge.clear()      → consume it

const Challenge = (() => {

  const SKEY = 'donnibo_pending_challenge';

  // unicode-safe base64url (no padding, URL-safe alphabet)
  function _b64urlEncode(str) {
    return btoa(unescape(encodeURIComponent(str)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function _b64urlDecode(b64) {
    b64 = b64.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    return decodeURIComponent(escape(atob(b64)));
  }

  function encode({ goalId, score, total, name } = {}) {
    const payload = { g: goalId, s: score | 0, t: total | 0, n: String(name || '').slice(0, 24) };
    return _b64urlEncode(JSON.stringify(payload));
  }

  function decode(raw) {
    try {
      const o = JSON.parse(_b64urlDecode(raw));
      if (!o || typeof o.g !== 'string') return null;
      return {
        goalId: o.g,
        score:  o.s | 0,
        total:  o.t | 0,
        name:   String(o.n || 'A friend').slice(0, 24) || 'A friend',
      };
    } catch (e) { return null; }
  }

  // Read ?ch= once, stash it, and strip the param so a refresh can't replay it.
  function capture() {
    let parsed = null;
    try {
      const params = new URLSearchParams(location.search);
      const raw = params.get('ch');
      if (raw) {
        parsed = decode(raw);
        if (parsed) sessionStorage.setItem(SKEY, JSON.stringify(parsed));
        params.delete('ch');
        const qs = params.toString();
        history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
      }
    } catch (e) { /* ignore — load normally */ }
    return parsed;
  }

  function pending() {
    try { return JSON.parse(sessionStorage.getItem(SKEY) || 'null'); }
    catch (e) { return null; }
  }

  function clear() { sessionStorage.removeItem(SKEY); }

  // Build the shareable link for a finished set.
  function link({ goalId, score, total, name }) {
    const base = location.origin + location.pathname;
    return base + '?ch=' + encode({ goalId, score, total, name });
  }

  return { encode, decode, capture, pending, clear, link };
})();
