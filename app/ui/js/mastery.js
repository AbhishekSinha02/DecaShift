// mastery.js — shared concept mastery logic (D-017 tiers + D-012 "your best")
// Single source of truth so the Journey screen and home rows agree.

const Mastery = (() => {

  // Highest → lowest. tierFor returns the first whose thresholds are met.
  const TIERS = [
    { id: 'mastered',   label: 'Mastered',    icon: '🏆', minSessions: 5, minAcc: 0.85 },
    { id: 'solid',      label: 'Solid',       icon: '⭐', minSessions: 3, minAcc: 0.70 },
    { id: 'developing', label: 'Developing',  icon: '📗', minSessions: 1, minAcc: 0.60 },
    { id: 'learning',   label: 'Learning',    icon: '📖', minSessions: 1, minAcc: 0 },
    { id: 'none',       label: 'Not started', icon: '○',  minSessions: 0, minAcc: 0 },
  ];

  function tierFor(sessions) {
    const n = sessions.length;
    if (n === 0) return TIERS.find(t => t.id === 'none');
    const avg = sessions.reduce((a, s) => a + (s.accuracy || 0), 0) / n;
    for (const t of TIERS) {
      if (t.id === 'none') continue;
      if (n >= t.minSessions && avg >= t.minAcc) return t;
    }
    return TIERS.find(t => t.id === 'learning');
  }

  function statsFor(sessions) {
    const n = sessions.length;
    if (!n) return { count: 0, best: null, avg: 0 };
    const best = sessions.reduce((b, s) =>
      (s.total && (!b || (s.score / s.total) > (b.score / b.total))) ? s : b, null);
    const avg = sessions.reduce((a, s) => a + (s.accuracy || 0), 0) / n;
    return { count: n, best, avg };
  }

  function rank(tierId) { return TIERS.findIndex(t => t.id === tierId); }

  return { TIERS, tierFor, statsFor, rank };
})();
