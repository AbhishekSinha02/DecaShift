// sharecard.js — E-015 shareable achievement image cards
// Turns a milestone into a branded PNG a parent forwards in a WhatsApp group:
// the evolving Donnibo avatar + a headline + one key stat + the wordmark.
// Pure canvas, no libs, same-origin assets (never taints the canvas), works offline.
//
// One renderer, three parametrised variants (level/evolution, journey, badge).
//   ShareCard.render({ type, level, headline, sub, stat, statLabel, accent }) → Promise<Blob>
//   ShareCard.share(blob, text)  → navigator.share(files) | PNG download + text fallback

const ShareCard = (() => {

  const SIZE = 1080;                       // crisp at WhatsApp thumbnail + full size
  const BRAND = '#7c3aed';                 // Donnibo violet
  const ACCENT2 = '#22d3ee';               // cyan companion

  // ── SVG → drawable image ────────────────────────────────────────────────────
  // The stage SVGs ship with a viewBox but no width/height; Firefox refuses to
  // rasterise those. Fetch the markup, inject explicit dimensions, load via a
  // blob URL (same-origin → canvas stays exportable). Any failure → null.
  async function _loadAvatar(level) {
    if (typeof Avatar === 'undefined') return null;
    const src = Avatar.fileFor(level);
    // On http(s): fetch + inject width/height so Firefox will rasterise the
    // viewBox-only SVG (it refuses sizeless SVGs). On file:// (fetch is blocked
    // by the browser): load the SVG straight into an <img>, which Chromium draws
    // fine. Either route failing → null → graceful letter fallback.
    if (location.protocol !== 'file:') {
      try {
        const res = await fetch(src);
        if (res.ok) {
          let svg = await res.text();
          if (!/<svg[^>]*\swidth=/.test(svg)) {
            svg = svg.replace(/<svg/, '<svg width="400" height="400"');
          }
          const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
          try { return await _imageFrom(url); } finally { URL.revokeObjectURL(url); }
        }
      } catch (e) { /* fall through to direct <img> load */ }
    }
    try { return await _imageFrom(src); } catch (e) { return null; }
  }

  function _imageFrom(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  // ── canvas helpers ──────────────────────────────────────────────────────────
  function _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // Word-wrap centred text; returns the y after the last line.
  function _wrapText(ctx, text, cx, y, maxW, lineH) {
    const words = String(text).split(/\s+/);
    let line = '', lines = [];
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
      else line = test;
    }
    if (line) lines.push(line);
    for (const ln of lines) { ctx.fillText(ln, cx, y); y += lineH; }
    return y;
  }

  // ── main renderer ───────────────────────────────────────────────────────────
  async function render(opts = {}) {
    const {
      level = 1,
      headline = 'See yourself grow',
      sub = '',
      stat = '',
      statLabel = '',
      accent = BRAND,
    } = opts;

    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = SIZE;
    const ctx = canvas.getContext('2d');
    const cx = SIZE / 2;

    // background — deep diagonal gradient + soft glow behind the avatar
    const bg = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    bg.addColorStop(0, '#171024');
    bg.addColorStop(1, '#0b0a14');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, SIZE, SIZE);

    const glow = ctx.createRadialGradient(cx, 430, 40, cx, 430, 420);
    glow.addColorStop(0, _hexA(accent, 0.42));
    glow.addColorStop(1, _hexA(accent, 0));
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // rounded inner frame
    ctx.strokeStyle = _hexA('#ffffff', 0.10);
    ctx.lineWidth = 2;
    _roundRect(ctx, 40, 40, SIZE - 80, SIZE - 80, 48);
    ctx.stroke();

    // wordmark (top)
    ctx.textAlign = 'center';
    ctx.fillStyle = _hexA('#ffffff', 0.62);
    ctx.font = '600 38px "Syne", system-ui, sans-serif';
    ctx.fillText('DONNIBO', cx, 130);

    // avatar inside a ringed disc
    const avatar = await _loadAvatar(level);
    const r = 220, ay = 430;
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, ay, r, 0, Math.PI * 2);
    const disc = ctx.createRadialGradient(cx, ay - 60, 30, cx, ay, r);
    disc.addColorStop(0, _hexA(accent, 0.30));
    disc.addColorStop(1, _hexA('#000000', 0.30));
    ctx.fillStyle = disc; ctx.fill();
    ctx.clip();
    if (avatar) {
      ctx.drawImage(avatar, cx - r, ay - r, r * 2, r * 2);
    } else {
      // graceful fallback — coloured circle + stage initial
      ctx.fillStyle = accent;
      ctx.fillRect(cx - r, ay - r, r * 2, r * 2);
      ctx.fillStyle = '#fff';
      ctx.font = '700 200px "Syne", system-ui, sans-serif';
      ctx.fillText((opts.fallbackChar || 'D'), cx, ay + 70);
    }
    ctx.restore();
    ctx.strokeStyle = accent; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.arc(cx, ay, r, 0, Math.PI * 2); ctx.stroke();

    // headline
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 76px "Syne", system-ui, sans-serif';
    let y = _wrapText(ctx, headline, cx, 770, SIZE - 160, 86);

    // sub-headline
    if (sub) {
      ctx.fillStyle = _hexA('#ffffff', 0.74);
      ctx.font = '400 40px "Syne", system-ui, sans-serif';
      y = _wrapText(ctx, sub, cx, y + 14, SIZE - 220, 50);
    }

    // stat chip
    if (stat) {
      const label = statLabel ? statLabel + '  ' : '';
      ctx.font = '700 46px "DM Mono", ui-monospace, monospace';
      const txt = label + stat;
      const w = ctx.measureText(txt).width + 80;
      const chipY = 880, chipH = 92;
      ctx.fillStyle = _hexA(accent, 0.18);
      _roundRect(ctx, cx - w / 2, chipY, w, chipH, 46);
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.fillText(txt, cx, chipY + 60);
    }

    // footer wordmark
    ctx.fillStyle = _hexA('#ffffff', 0.5);
    ctx.font = '500 34px "Syne", system-ui, sans-serif';
    ctx.fillText('See yourself grow · donnibo.app', cx, SIZE - 70);

    return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  }

  // ── share / download ─────────────────────────────────────────────────────────
  async function share(blob, text) {
    if (!blob) { _waText(text); return; }
    const file = new File([blob], 'donnibo.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], text }); return; }
      catch (e) { if (e && e.name === 'AbortError') return; /* else fall through */ }
    }
    // fallback: download the PNG, then offer the text via WhatsApp
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'donnibo.png';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    _waText(text);
  }

  function _waText(text) {
    if (!text) return;
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
  }

  // #rrggbb + alpha → rgba()
  function _hexA(hex, a) {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return `rgba(124,58,237,${a})`;
    const n = parseInt(m[1], 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }

  return { render, share };
})();
