// xp.js — E-005 XP + Levels engine
// The currency of growth. Every meaningful action earns XP; XP accrues into
// levels on a gentle curve (early levels fast, later levels stretch). This is
// the spine the avatar (E-006), Journey (E-007), and rewards spend against.
//
// All balancing lives here — change XP_RULES or the curve in one place.
// XP only ever increases. Persisted under a versioned key for future migration.

const XP = (() => {

  const KEY = 'donnibo_xp_v1';

  const XP_RULES = {
    correct:       10,  // per correct answer
    attempt:        2,  // per attempted-but-wrong answer (effort still counts)
    setComplete:   25,  // finishing a practice set
    gkComplete:    10,  // finishing the daily GK
    drillComplete: 15,  // finishing a flash drill
    perfectBonus:  20,  // 100% accuracy on a set
    questComplete: 50,  // completing the full daily quest
  };

  // Per-level cost grows linearly: L→L+1 costs 80 + 20·L.
  // Cumulative XP needed to *reach* level L:  (L-1)·(80 + 10·L).
  function xpToReach(level) {
    if (level <= 1) return 0;
    return (level - 1) * (80 + 10 * level);
  }

  // Pure: total XP → level breakdown
  function levelFromXP(total) {
    total = Math.max(0, total | 0);
    let level = 1;
    while (xpToReach(level + 1) <= total) level++;
    const base = xpToReach(level);
    const next = xpToReach(level + 1);
    const xpIntoLevel = total - base;
    const xpForNext   = next - base;
    return {
      level,
      xpIntoLevel,
      xpForNext,
      pct: xpForNext ? xpIntoLevel / xpForNext : 0,
      totalXP: total,
    };
  }

  function getTotalXP() {
    return parseInt(localStorage.getItem(KEY) || '0', 10) || 0;
  }

  function _setTotal(n) { localStorage.setItem(KEY, String(n)); }

  // Add XP; returns level-transition info for celebration UIs.
  function addXP(amount, reason) {
    const before = getTotalXP();
    const total  = before + Math.max(0, Math.round(amount || 0));
    _setTotal(total);
    const fromLevel = levelFromXP(before).level;
    const toLevel   = levelFromXP(total).level;
    return {
      total,
      gained: total - before,
      reason: reason || '',
      fromLevel,
      toLevel,
      leveledUp: toLevel > fromLevel,
    };
  }

  // ── Award helpers (keep all amounts in this file) ──────────────────────────

  function awardSession(session) {
    let amt = 0;
    for (const r of (session.responses || [])) {
      amt += r.isCorrect ? XP_RULES.correct : XP_RULES.attempt;
      if (r.isCorrect && r.lucky) amt += XP_RULES.correct;  // E-012: lucky question = 2× correct XP
    }
    const isGK = session.goalId === 'daily-gk';
    amt += isGK ? XP_RULES.gkComplete : XP_RULES.setComplete;
    if (session.accuracy >= 1) amt += XP_RULES.perfectBonus;
    return addXP(amt, isGK ? 'gk' : 'set');
  }

  function awardDrill(correctCount) {
    return addXP((correctCount | 0) * XP_RULES.correct + XP_RULES.drillComplete, 'drill');
  }

  function awardQuestComplete() {
    return addXP(XP_RULES.questComplete, 'quest');
  }

  return {
    XP_RULES, xpToReach, levelFromXP,
    getTotalXP, addXP,
    awardSession, awardDrill, awardQuestComplete,
  };
})();
