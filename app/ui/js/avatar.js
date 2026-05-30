// avatar.js — E-006 Donnibo avatar growth (6-stage evolution)
// The avatar evolves with the user's level (from xp.js). Stage = identity.
// Renders an <img> over the existing letter avatar; if the SVG fails to load,
// the letter+gradient fallback shows through (never a broken image).

const Avatar = (() => {

  // Stage boundaries by level — early stages come fast (motivation),
  // later stages are aspirational. 0-indexed internally.
  const STAGES = [
    { min: 1,  file: 'stage-1-spark.svg',    name: 'Spark'    },
    { min: 3,  file: 'stage-2-pup.svg',      name: 'Pup'      },
    { min: 6,  file: 'stage-3-rookie.svg',   name: 'Rookie'   },
    { min: 10, file: 'stage-4-fighter.svg',  name: 'Fighter'  },
    { min: 15, file: 'stage-5-champion.svg', name: 'Champion' },
    { min: 21, file: 'stage-6-donnibo.svg',  name: 'Donnibo'  },
  ];

  const BASE = 'assets/avatar/';

  function stageFromLevel(level) {
    let s = 0;
    for (let i = 0; i < STAGES.length; i++) if (level >= STAGES[i].min) s = i;
    return s;
  }

  function stageInfo(level) { return STAGES[stageFromLevel(level)]; }

  function fileFor(level) { return BASE + stageInfo(level).file; }

  // Mount the stage SVG into `el`, keeping any existing text as fallback.
  // On error the img removes itself, revealing the fallback underneath.
  function mount(el, level) {
    if (!el) return;
    el.querySelectorAll('.avatar-img').forEach(n => n.remove());
    const stage = stageInfo(level);
    const img = document.createElement('img');
    img.className = 'avatar-img';
    img.src = BASE + stage.file;
    img.alt = stage.name;
    img.onerror = () => img.remove();
    el.appendChild(img);
  }

  return { STAGES, stageFromLevel, stageInfo, fileFor, mount };
})();
