/* ---------------------------------------------------------------------------
   The background, in two modes.

   PHOTO MODE — when assets/background.jpg exists. CSS does the work: the image
   is painted, graded and blurred by #photo, and slides against the cross via
   the --par-x / --par-y custom properties js/xmb.js writes. Nothing animates
   on a timer, so there is no canvas loop at all in this mode.

   GRADIENT MODE — no such file. Falls back to the month tint, the XMB ribbon
   and drifting motes.

   Exposes window.XMBWave.start().
--------------------------------------------------------------------------- */

(() => {
  'use strict';

  const IMAGE = 'assets/background.jpg';

  // The real XMB re-tinted itself every month. Index 0 = January.
  // [centre, edge, accent]
  const MONTHS = [
    ['#1d4f7a', '#04121e', '#8fc6ee'], // Jan — icy blue
    ['#7a2a55', '#1a0713', '#f0a8cd'], // Feb — plum
    ['#2f6d4a', '#07160e', '#93e3b4'], // Mar — spring green
    ['#8a3f63', '#1d0a14', '#f5b3cd'], // Apr — sakura
    ['#4c7a2a', '#101a06', '#c2e88f'], // May — leaf
    ['#2f4c8a', '#080e1d', '#a3b8f0'], // Jun — rain blue
    ['#1c6f78', '#04171a', '#8fdde6'], // Jul — aqua
    ['#23347f', '#050a1c', '#a5b0f2'], // Aug — deep blue
    ['#5d3f85', '#120b1d', '#c6a8f0'], // Sep — dusk purple
    ['#8f5518', '#1d1004', '#f2c489'], // Oct — pumpkin
    ['#7e3524', '#1a0806', '#f0ab97'], // Nov — rust
    ['#14532d', '#04150b', '#7ee2a8'], // Dec — pine
  ];

  /* ---------------------------------------------------------- photo mode --- */

  function photoMode() {
    document.body.classList.add('photo-on');
    const el = document.getElementById('photo');
    if (!el) return;
    el.style.backgroundImage = `url("${IMAGE}")`;
    el.classList.add('on');
  }

  /* ------------------------------------------------------- gradient mode --- */

  function gradientMode() {
    const canvas = document.getElementById('wave');
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, motes = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round((w * h) / 26000);
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.5 + Math.random() * 1.4,
        vx: 0.06 + Math.random() * 0.22,
        vy: (Math.random() - 0.5) * 0.14,
        a: 0.12 + Math.random() * 0.45,
      }));
    }

    // One ribbon: a horizontally travelling sine band, filled top-down.
    function ribbon(t, cfg) {
      const { amp, freq, speed, yFrac, thick, alpha } = cfg;
      const base = h * yFrac;
      const step = Math.max(6, w / 140);

      ctx.beginPath();
      ctx.moveTo(0, base + Math.sin(t * speed) * amp);
      for (let x = 0; x <= w + step; x += step) {
        const p = (x / w) * Math.PI * 2 * freq;
        const y = base
          + Math.sin(p + t * speed) * amp
          + Math.sin(p * 2.3 - t * speed * 1.4) * amp * 0.28;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();

      const g = ctx.createLinearGradient(0, base - amp, 0, base + thick);
      g.addColorStop(0, `rgba(255,255,255,${alpha})`);
      g.addColorStop(0.35, `rgba(255,255,255,${alpha * 0.30})`);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fill();
    }

    const LAYERS = [
      { amp: 26, freq: 1.05, speed: 0.24, yFrac: 0.60, thick: 260, alpha: 0.050 },
      { amp: 34, freq: 0.78, speed: 0.17, yFrac: 0.68, thick: 300, alpha: 0.075 },
      { amp: 20, freq: 1.42, speed: 0.31, yFrac: 0.74, thick: 220, alpha: 0.055 },
      { amp: 44, freq: 0.55, speed: 0.12, yFrac: 0.83, thick: 340, alpha: 0.045 },
    ];

    let last = performance.now();
    let clock = 0;

    function frame(now) {
      // seconds, clamped so a backgrounded tab doesn't jump on return
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      clock += dt;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      for (const cfg of LAYERS) ribbon(clock, cfg);

      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy;
        if (m.x - m.r > w) { m.x = -m.r; m.y = Math.random() * h; }
        if (m.y < -m.r) m.y = h + m.r;
        if (m.y - m.r > h) m.y = -m.r;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${m.a})`;
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(frame);
  }

  /* ----------------------------------------------------------------- go --- */

  function start() {
    // Set the tint up front either way — in photo mode it's what shows through
    // while the image fades in.
    const [a, b, accent] = MONTHS[new Date().getMonth()];
    const s = document.documentElement.style;
    s.setProperty('--bg-a', a);
    s.setProperty('--bg-b', b);
    s.setProperty('--accent', accent);

    const img = new Image();
    img.onload = photoMode;
    img.onerror = gradientMode;   // no photo in assets/ — behave as before
    img.src = IMAGE;
  }

  window.XMBWave = { start };
})();
