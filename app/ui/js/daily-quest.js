// daily-quest.js — E-003 Daily Quest + Continue hero
// Tracks today's 3-objective mission (practice set · flash drill · GK) and the
// day-complete finish line (which E-004 turns into a celebration ritual).
//
// Detection strategy: derive from existing signals where they exist
//   • set  → any completed non-GK session dated today
//   • gk   → _isDailyGKDone() (app-gk.js) or a GK-goal session today
//   • drill→ explicit per-day flag (drills don't persist a dated session)
// Only the drill objective needs an explicit mark(); the rest are derived,
// so the quest is correct even across reloads and tabs.

const DailyQuest = (() => {

  function _todayKey() { return new Date().toISOString().slice(0, 10); }
  function _flagsKey() { return 'ds_quest_' + _todayKey(); }

  function _flags() {
    try { return JSON.parse(localStorage.getItem(_flagsKey()) || '{}'); }
    catch (_) { return {}; }
  }
  function _setFlag(id) {
    const f = _flags();
    f[id] = true;
    localStorage.setItem(_flagsKey(), JSON.stringify(f));
  }

  function _gkGoalIds() {
    const goals = (typeof state !== 'undefined' && state.goals) ? state.goals : [];
    return new Set(goals.filter(g => g.subject === 'gk' || g.id === 'daily-gk').map(g => g.id));
  }

  function _sessionsToday() {
    const today = new Date().toDateString();
    const uid   = (typeof state !== 'undefined' && state.user) ? state.user.userId : null;
    return Storage.loadSessions().filter(s =>
      (!uid || s.userId === uid) &&
      s.sessionEnd && new Date(s.sessionEnd).toDateString() === today
    );
  }

  function _setDoneToday() {
    const gkIds = _gkGoalIds();
    return _sessionsToday().some(s => !gkIds.has(s.goalId));
  }

  function _gkDoneToday() {
    if (typeof _isDailyGKDone === 'function' && _isDailyGKDone()) return true;
    const gkIds = _gkGoalIds();
    return _sessionsToday().some(s => gkIds.has(s.goalId));
  }

  function _drillDoneToday() { return _flags().drill === true; }

  // Public: current quest state
  function getState() {
    const set   = _setDoneToday();
    const drill = _drillDoneToday();
    const gk    = _gkDoneToday();
    const done  = [set, drill, gk].filter(Boolean).length;
    return { set, drill, gk, done, total: 3, complete: done === 3 };
  }

  // Public: mark an objective complete (drill calls this; set/gk are derived)
  function mark(id) { _setFlag(id); }

  function isComplete() { return getState().complete; }

  // E-004 ritual: ensure the day-complete celebration only fires once per day
  function ritualShownToday() { return localStorage.getItem('ds_quest_ritual') === _todayKey(); }
  function markRitualShown()  { localStorage.setItem('ds_quest_ritual', _todayKey()); }

  return { getState, mark, isComplete, ritualShownToday, markRitualShown };
})();
