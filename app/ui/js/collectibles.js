// collectibles.js — E-010/E-011 collectible store + reward roll
// The shared source of truth for stickers: the pool, what's owned, NEW-flag tracking,
// and the weighted reward roll the mystery box (E-010) uses. The album (E-011) renders
// purely off this. Pool art reuses the Donnibo expression SVGs (design/avatars/expr-*).

const Collectibles = (() => {

  const KEY  = 'donnibo_collectibles';
  const SEEN = 'donnibo_stickers_seen';
  const BASE = 'assets/stickers/';

  const POOL = [
    { id: 'idle',     name: 'Chill Donnibo',    file: 'expr-idle.svg',     rarity: 'common', earn: 'Mystery box' },
    { id: 'thinking', name: 'Thinking Donnibo', file: 'expr-thinking.svg', rarity: 'common', earn: 'Mystery box' },
    { id: 'sleeping', name: 'Sleepy Donnibo',   file: 'expr-sleeping.svg', rarity: 'common', earn: 'Mystery box' },
    { id: 'wrong',    name: 'Oops Donnibo',     file: 'expr-wrong.svg',    rarity: 'common', earn: 'Mystery box' },
    { id: 'correct',  name: 'Victory Donnibo',  file: 'expr-correct.svg',  rarity: 'rare',   earn: 'Streak / level box' },
    { id: 'streak',   name: 'On-Fire Donnibo',  file: 'expr-streak.svg',   rarity: 'rare',   earn: 'Streak box' },
    { id: 'levelup',  name: 'Level-Up Donnibo', file: 'expr-levelup.svg',  rarity: 'epic',   earn: 'Level milestone box' },
  ];

  const RARITY_ORDER = { common: 0, rare: 1, epic: 2 };

  function _read(k) { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch (_) { return []; } }

  function owned()        { return _read(KEY); }
  function isOwned(id)    { return owned().includes(id); }
  function info(id)       { return POOL.find(p => p.id === id) || null; }
  function fileFor(id)    { const p = info(id); return p ? BASE + p.file : null; }
  function count()        { return owned().length; }

  function grant(id) {
    if (!info(id)) return null;
    const o = owned();
    if (!o.includes(id)) { o.push(id); localStorage.setItem(KEY, JSON.stringify(o)); }
    return id;
  }

  // NEW-ribbon: owned but not yet seen in the album
  function unseen()      { const s = _read(SEEN); return owned().filter(id => !s.includes(id)); }
  function markAllSeen() { localStorage.setItem(SEEN, JSON.stringify(owned())); }

  // Weighted reward roll for the mystery box (E-010). Never returns a wasted reward.
  function rollReward(ctx) {
    const unowned = POOL.filter(p => !isOwned(p.id));
    const roll = Math.random();

    if (unowned.length && roll < 0.5) {
      const pick = unowned[Math.floor(Math.random() * unowned.length)];
      return { kind: 'sticker', id: pick.id, name: pick.name, rarity: pick.rarity, file: BASE + pick.file };
    }
    const xpAmount = (ctx && ctx.type === 'level') ? 100 : 50;
    if (roll < 0.8) return { kind: 'xp', amount: xpAmount };

    // freeze only if under the cap-2; otherwise fall back to XP (no wasted reward)
    const freezes = (typeof Storage !== 'undefined') ? (Storage.loadStreak().freezes || 0) : 2;
    return freezes < 2 ? { kind: 'freeze' } : { kind: 'xp', amount: xpAmount };
  }

  return { POOL, RARITY_ORDER, owned, isOwned, info, fileFor, count, grant, unseen, markAllSeen, rollReward };
})();
