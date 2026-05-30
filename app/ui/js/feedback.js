// feedback.js — E-008 game-juice engine: sound + haptics + confetti
// The ONLY file that touches Web Audio / vibrate / canvas, so the rest of the app
// calls a clean API: Feedback.play(name) · haptic(name) · hit(name) · confetti(opts).
// One Settings toggle mutes everything. Honors prefers-reduced-motion for confetti.
// Tiny synthesized tones (no assets) to respect the 4G / low-cost-phone constraint.

const Feedback = (() => {

  const KEY = 'donnibo_feedback';
  let _enabled = localStorage.getItem(KEY) !== 'off';   // default on
  let _ctx = null;

  function isEnabled() { return _enabled; }
  function setEnabled(on) {
    _enabled = !!on;
    localStorage.setItem(KEY, _enabled ? 'on' : 'off');
  }

  function _reduced() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // ── Audio (lazy AudioContext, created on first gesture) ────────────────────
  function _audio() {
    if (_ctx === null) {
      try { _ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (_) { _ctx = false; }
    }
    return _ctx || null;
  }

  function _env(osc, gain, t, dur, peak) {
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(peak, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  function _blip(freq, dur, type) {
    const ctx = _audio(); if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = type || 'triangle'; osc.frequency.value = freq;
    osc.connect(gain); gain.connect(ctx.destination);
    _env(osc, gain, t, dur || 0.09, 0.16);
  }

  function _arp(freqs, step, type) {
    const ctx = _audio(); if (!ctx) return;
    let t = ctx.currentTime;
    step = step || 0.09;
    for (const f of freqs) {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = type || 'triangle'; osc.frequency.value = f;
      osc.connect(gain); gain.connect(ctx.destination);
      _env(osc, gain, t, step * 1.5, 0.14);
      t += step;
    }
  }

  const SOUNDS = {
    tap:     () => _blip(330, 0.05),
    correct: () => _arp([523, 659, 784]),            // C E G — rising, happy
    wrong:   () => _blip(180, 0.2, 'sine'),          // soft low, never harsh
    levelup: () => _arp([523, 659, 784, 1046], 0.1),
    streak:  () => _arp([659, 784, 988]),
    reward:  () => _arp([784, 1046, 1318], 0.1),
    complete:() => _arp([523, 659, 784, 1046], 0.12),
  };

  function play(name) {
    if (!_enabled) return;
    const ctx = _audio(); if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    (SOUNDS[name] || SOUNDS.tap)();
  }

  // ── Haptics ────────────────────────────────────────────────────────────────
  const HAPTICS = {
    tap: [8], correct: [16], wrong: [26],
    levelup: [16, 40, 16], streak: [14, 28, 14], reward: [18, 30, 40], complete: [16, 30, 16],
  };
  function haptic(name) {
    if (!_enabled || !navigator.vibrate) return;
    try { navigator.vibrate(HAPTICS[name] || HAPTICS.tap); } catch (_) {}
  }

  function hit(name) { play(name); haptic(name); }

  // ── Confetti (single reusable canvas, capped particles, rAF) ───────────────
  function confetti(opts) {
    if (!_enabled || _reduced()) return;
    opts = opts || {};
    const W = window.innerWidth, H = window.innerHeight;
    const n = Math.min(opts.count || 70, 110);
    const colors = opts.colors || ['#3b82f6', '#22d3ee', '#f59e0b', '#22c55e', '#a78bfa'];

    let canvas = document.getElementById('fx-confetti');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'fx-confetti';
      canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999';
      document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const ox = opts.x != null ? opts.x : W / 2;
    const oy = opts.y != null ? opts.y : H * 0.34;
    const parts = Array.from({ length: n }, () => ({
      x: ox, y: oy,
      vx: (Math.random() - 0.5) * 9,
      vy: Math.random() * -9 - 3,
      size: 4 + Math.random() * 5,
      rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.35,
      color: colors[(Math.random() * colors.length) | 0],
      life: 0, max: 55 + Math.random() * 45,
    }));

    if (canvas._raf) cancelAnimationFrame(canvas._raf);
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      let alive = false;
      for (const p of parts) {
        if (p.life > p.max) continue;
        alive = true;
        p.life++; p.vy += 0.28; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - p.life / p.max);
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
      if (alive) canvas._raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, W, H);
    };
    tick();
  }

  return { isEnabled, setEnabled, play, haptic, hit, confetti };
})();
