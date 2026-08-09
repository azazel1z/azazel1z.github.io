/* ---------------------------------------------------------------------------
   The XMB itself: build the cross from CATEGORIES, then move a selection
   around it with keyboard, gamepad, pointer, wheel or touch.

   Layout maths lives in css/styles.css. This file only ever writes two custom
   properties: --sel on :root, and --slot on each row.
--------------------------------------------------------------------------- */

(() => {
  'use strict';

  /* ------------------------------------------------------------- icons --- */

  // Category / non-brand marks. Solid white silhouettes, the way the PSP drew
  // them — no outlines, no interior detail. Holes are cut with fill-rule.
  const GLYPHS = {
    user: '<circle cx="12" cy="7.6" r="4.2"/>' +
      '<path d="M12 13.6c-4.6 0-7.8 2.7-7.8 6.6 0 .7.5 1.2 1.2 1.2h13.2c.7 0 1.2-.5 1.2-1.2 0-3.9-3.2-6.6-7.8-6.6Z"/>',
    pin: '<path d="M12 2.2a7 7 0 0 0-7 7c0 5.2 6.2 12 6.4 12.3.3.3.9.3 1.2 0 .3-.3 6.4-7.1 6.4-12.3a7 7 0 0 0-7-7Zm0 9.6a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Z"/>',
    heart: '<path d="M12 21.2c-.3 0-.6-.1-.8-.3C5.6 16.3 2.6 13.2 2.6 9.4A5.4 5.4 0 0 1 12 5.8a5.4 5.4 0 0 1 9.4 3.6c0 3.8-3 6.9-8.6 11.5-.2.2-.5.3-.8.3Z"/>',
    // d-pad and buttons are cut out of the body by fill-rule, so it stays a
    // single flat silhouette — and it rhymes with the PSP's own Game icon
    gamepad: '<path d="M6.8 7h10.4c3 0 5.2 2.3 5.6 5.2l.4 3.1c.3 2.2-1.4 4.1-3.6 4.1' +
      '-1.2 0-2.3-.6-3-1.6l-1.1-1.6a1.8 1.8 0 0 0-1.5-.8h-4a1.8 1.8 0 0 0-1.5.8' +
      'l-1.1 1.6c-.7 1-1.8 1.6-3 1.6-2.2 0-3.9-1.9-3.6-4.1l.4-3.1C1.6 9.3 3.8 7 6.8 7Z' +
      'M6.8 10.2h1.4v1.4h1.4v1.4H8.2v1.4H6.8v-1.4H5.4v-1.4h1.4v-1.4Z' +
      'M15.35 12.2a1.15 1.15 0 1 0 2.3 0 1.15 1.15 0 1 0-2.3 0Z' +
      'M18.15 14.1a1.15 1.15 0 1 0 2.3 0 1.15 1.15 0 1 0-2.3 0Z"/>',
    doc: '<path d="M13.6 2.4H7.4A2.6 2.6 0 0 0 4.8 5v14a2.6 2.6 0 0 0 2.6 2.6h9.2A2.6 2.6 0 0 0 19.2 19V8l-5.6-5.6Zm-.4 2.3 4.1 4.1h-4.1V4.7ZM8.6 12.6h6.8v1.6H8.6v-1.6Zm0 3.6h6.8v1.6H8.6v-1.6Z"/>',
    briefcase: '<path d="M9 3.6h6a2.3 2.3 0 0 1 2.3 2.3v1.7H15V6H9v1.6H6.7V5.9A2.3 2.3 0 0 1 9 3.6Z"/>' +
      '<path d="M4.6 8.8h14.8a2.4 2.4 0 0 1 2.4 2.4v6.6a2.4 2.4 0 0 1-2.4 2.4H4.6a2.4 2.4 0 0 1-2.4-2.4v-6.6a2.4 2.4 0 0 1 2.4-2.4Zm6.2 4.2v1.8h2.4V13h-2.4Z"/>',
    people: '<circle cx="8.6" cy="7.8" r="3.6"/>' +
      '<path d="M8.6 13c-3.8 0-6.4 2.3-6.4 5.7 0 .7.5 1.3 1.2 1.3h10.4c.7 0 1.2-.6 1.2-1.3 0-3.4-2.6-5.7-6.4-5.7Z"/>' +
      '<circle cx="17.4" cy="8.8" r="2.9"/>' +
      '<path d="M17.4 12.8c-.7 0-1.4.1-2 .3 1.4 1.4 2.2 3.3 2.2 5.6 0 .4 0 .8-.1 1.3h3.9c.7 0 1.2-.6 1.2-1.3 0-3.4-2.1-5.9-5.2-5.9Z"/>',
    list: '<rect x="8" y="4.6" width="13.4" height="2.5" rx="1.25"/>' +
      '<rect x="8" y="10.75" width="13.4" height="2.5" rx="1.25"/>' +
      '<rect x="8" y="16.9" width="13.4" height="2.5" rx="1.25"/>' +
      '<circle cx="4" cy="5.85" r="1.9"/><circle cx="4" cy="12" r="1.9"/><circle cx="4" cy="18.15" r="1.9"/>',
    mail: '<path d="M3.4 5.2h17.2a2.1 2.1 0 0 1 2.1 2.1v.4L12 14.1 1.3 7.7v-.4a2.1 2.1 0 0 1 2.1-2.1Z"/>' +
      '<path d="M1.3 10.1 12 16.5l10.7-6.4v6.6a2.1 2.1 0 0 1-2.1 2.1H3.4a2.1 2.1 0 0 1-2.1-2.1v-6.6Z"/>',
    // Simple Icons no longer carries LinkedIn (removed on the brand's request),
    // so this is a plain lettered tile rather than their logo artwork.
    linkedin: '<mask id="li-cut"><rect width="24" height="24" fill="#fff"/>' +
      '<text x="12" y="16.4" text-anchor="middle" font-family="system-ui, sans-serif"' +
      ' font-size="11" font-weight="700" fill="#000">in</text></mask>' +
      '<path mask="url(#li-cut)" d="M4.6 2.6h14.8a2.6 2.6 0 0 1 2.6 2.6v13.6a2.6 2.6 0 0 1-2.6 2.6H4.6A2.6 2.6 0 0 1 2 18.8V5.2a2.6 2.6 0 0 1 2.6-2.6Z"/>',
  };

  // Raster files are photos, not marks — they get cropped to a circle.
  const PHOTO = /\.(jpe?g|png|webp|gif|avif)$/i;

  function iconHTML(spec) {
    if (!spec) return '';
    if (spec.startsWith('glyph:')) {
      const body = GLYPHS[spec.slice(6)];
      if (!body) return '';
      return `<svg viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd"
                   aria-hidden="true">${body}</svg>`;
    }
    // Brand marks are vendored into assets/icons/ rather than pulled from
    // cdn.simpleicons.org at runtime — 13 third-party round trips was the
    // reason icons sometimes trickled in after the page had drawn.
    // To add one: curl https://cdn.simpleicons.org/<slug>/white -o assets/icons/<slug>.svg
    const src = spec.startsWith('si:')
      ? `assets/icons/${spec.slice(3)}.svg`
      : spec;
    const cls = PHOTO.test(spec) ? ' class="photo"' : '';
    // no loading="lazy": these are ~1KB and local, deferring them only stalls paint
    return `<img src="${src}"${cls} alt="" decoding="async">`;
  }

  /* ------------------------------------------------------------- build --- */

  const catsEl = document.getElementById('cats');
  const colsEl = document.getElementById('cols');

  const cols = [];   // one element per category
  const vsel = CATEGORIES.map(() => 0);

  CATEGORIES.forEach((cat, i) => {
    const c = document.createElement('div');
    c.className = 'cat';
    c.setAttribute('role', 'tab');
    c.setAttribute('aria-selected', 'false');
    c.id = `cat-${cat.id}`;
    c.dataset.i = i;
    c.innerHTML =
      `<div class="cat-icon">${iconHTML(cat.icon)}</div>` +
      `<div class="cat-label">${cat.label}</div>`;
    catsEl.appendChild(c);

    const col = document.createElement('div');
    col.className = 'col';
    col.setAttribute('role', 'tabpanel');
    col.setAttribute('aria-labelledby', `cat-${cat.id}`);
    col.dataset.i = i;

    cat.items.forEach((item, j) => {
      const isLink = item.type === 'link';
      const el = document.createElement(isLink ? 'a' : 'div');
      el.className = 'item' + (item.type === 'info' ? ' info' : '');
      el.dataset.i = j;
      if (isLink) {
        el.href = item.url;
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
      }
      el.innerHTML =
        `<div class="item-icon"><span class="glyph">${iconHTML(item.icon)}</span></div>` +
        `<div class="item-text">` +
          `<div class="item-label">${item.label}</div>` +
          (item.sub ? `<div class="item-sub">${item.sub}</div>` : '') +
        `</div>`;
      col.appendChild(el);
    });

    colsEl.appendChild(col);
    cols.push(col);
  });

  /* --------------------------------------------------------- selection --- */

  let ci = Math.max(0, CATEGORIES.findIndex(c => c.id === DEFAULT_CATEGORY));

  function paint() {
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--sel', String(ci));

    // Parallax: where the cross sits, as -1..1 on each axis. css/styles.css
    // turns these into the background's offset.
    const rowCount = CATEGORIES[ci].items.length;
    const px = CATEGORIES.length > 1 ? (ci / (CATEGORIES.length - 1)) * 2 - 1 : 0;
    const py = rowCount > 1 ? (vsel[ci] / (rowCount - 1)) * 2 - 1 : 0;
    rootStyle.setProperty('--par-x', px.toFixed(3));
    rootStyle.setProperty('--par-y', py.toFixed(3));

    for (let i = 0; i < CATEGORIES.length; i++) {
      catsEl.children[i].setAttribute('aria-selected', i === ci ? 'true' : 'false');
      cols[i].classList.toggle('active', i === ci);
      cols[i].setAttribute('aria-hidden', i === ci ? 'false' : 'true');
      const items = cols[i].children;
      for (let j = 0; j < items.length; j++) {
        // Slot 0 is the category icon's, so rows never land on it: the
        // selected row takes slot 1 and rows above it skip straight to -1.
        const k = j - vsel[i];
        const slot = k >= 0 ? k + 1 : k;
        items[j].style.setProperty('--slot', String(slot));
        // rows below the category icon get nudged down, rows above it up
        items[j].style.setProperty('--gap-sign', slot > 0 ? '1' : '-1');
        items[j].classList.toggle('sel', k === 0);
        // only the focused row is a tab stop
        if (items[j].tagName === 'A') items[j].tabIndex = (i === ci && k === 0) ? 0 : -1;
      }
    }
  }

  function moveH(dir) {
    const next = ci + dir;
    if (next < 0 || next >= CATEGORIES.length) return false;
    ci = next;
    paint();
    XMBAudio.move();
    return true;
  }

  function moveV(dir) {
    const n = CATEGORIES[ci].items.length;
    const next = vsel[ci] + dir;
    if (next < 0 || next >= n) return false;
    vsel[ci] = next;
    paint();
    XMBAudio.move();
    return true;
  }

  function activate() {
    const item = CATEGORIES[ci].items[vsel[ci]];
    if (!item) return;
    if (item.type === 'link') {
      XMBAudio.enter();
      window.open(item.url, '_blank', 'noopener');
    } else if (item.type === 'form') {
      XMBAudio.enter();
      openSheet();
    }
    // 'info' rows are text; there is nothing to open.
  }

  /* ----------------------------------------------------------- pointer --- */

  catsEl.addEventListener('click', e => {
    const cat = e.target.closest('.cat');
    if (!cat) return;
    const i = +cat.dataset.i;
    if (i === ci) return;
    ci = i;
    paint();
    XMBAudio.move();
    usedIt();
  });

  colsEl.addEventListener('click', e => {
    const el = e.target.closest('.item');
    if (!el || !el.parentElement.classList.contains('active')) return;
    const j = +el.dataset.i;
    if (j !== vsel[ci]) {
      // first click focuses the row, second opens it — same as moving the cross
      e.preventDefault();
      vsel[ci] = j;
      paint();
      XMBAudio.move();
    } else if (CATEGORIES[ci].items[j].type === 'form') {
      openSheet();
      XMBAudio.enter();
    } else if (CATEGORIES[ci].items[j].type === 'link') {
      XMBAudio.enter(); // let the <a> navigate on its own
    }
    usedIt();
  });

  /* ---------------------------------------------------------- keyboard --- */

  document.addEventListener('keydown', e => {
    if (sheetOpen) {
      if (e.key === 'Escape') { e.preventDefault(); closeSheet(); }
      return;
    }
    const t = e.target instanceof Element ? e.target : null;
    if (t && t.matches('input, textarea')) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;

    // If a link row itself has focus, let the browser activate it. Calling
    // activate() here as well would open the profile in two tabs.
    if ((e.key === 'Enter' || e.key === ' ') && t && t.closest('a.item')) return;

    let handled = true;
    switch (e.key) {
      case 'ArrowLeft':  case 'a': case 'A': moveH(-1); break;
      case 'ArrowRight': case 'd': case 'D': moveH(1);  break;
      case 'ArrowUp':    case 'w': case 'W': moveV(-1); break;
      case 'ArrowDown':  case 's': case 'S': moveV(1);  break;
      case 'Enter': case ' ': activate(); break;
      default: handled = false;
    }
    if (handled) { e.preventDefault(); usedIt(); }
  });

  /* ------------------------------------------------------------- wheel --- */

  let wheelLock = 0;
  window.addEventListener('wheel', e => {
    if (sheetOpen) return;
    const now = performance.now();
    if (now < wheelLock) return;
    const horiz = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    const d = horiz ? Math.sign(e.deltaX) : Math.sign(e.deltaY);
    if (!d) return;
    if (horiz ? moveH(d) : moveV(d)) { wheelLock = now + 220; usedIt(); }
  }, { passive: true });

  /* ------------------------------------------------------------- touch --- */

  let tx = 0, ty = 0, tracking = false;
  const SWIPE = 34;

  window.addEventListener('touchstart', e => {
    if (sheetOpen || e.touches.length !== 1) return;
    tx = e.touches[0].clientX;
    ty = e.touches[0].clientY;
    tracking = true;
  }, { passive: true });

  window.addEventListener('touchmove', e => {
    if (!tracking) return;
    const dx = e.touches[0].clientX - tx;
    const dy = e.touches[0].clientY - ty;
    if (Math.abs(dx) < SWIPE && Math.abs(dy) < SWIPE) return;

    // a swipe drags the cross the way your thumb moves
    if (Math.abs(dx) > Math.abs(dy)) moveH(dx < 0 ? 1 : -1);
    else moveV(dy < 0 ? 1 : -1);

    tx = e.touches[0].clientX;
    ty = e.touches[0].clientY;
    usedIt();
  }, { passive: true });

  window.addEventListener('touchend', () => { tracking = false; }, { passive: true });

  /* ----------------------------------------------------------- gamepad --- */

  const AXIS = 0.55;
  const REPEAT = 190;
  let padNeutral = { x: true, y: true, a: true, b: true };
  let padNext = 0;

  function pollPads() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const now = performance.now();

    for (const p of pads) {
      if (!p) continue;

      const dpadL = p.buttons[14] && p.buttons[14].pressed;
      const dpadR = p.buttons[15] && p.buttons[15].pressed;
      const dpadU = p.buttons[12] && p.buttons[12].pressed;
      const dpadD = p.buttons[13] && p.buttons[13].pressed;

      const ax = (p.axes[0] || 0);
      const ay = (p.axes[1] || 0);
      const x = dpadL ? -1 : dpadR ? 1 : Math.abs(ax) > AXIS ? Math.sign(ax) : 0;
      const y = dpadU ? -1 : dpadD ? 1 : Math.abs(ay) > AXIS ? Math.sign(ay) : 0;

      if (!x) padNeutral.x = true;
      if (!y) padNeutral.y = true;

      if (x && !sheetOpen && (padNeutral.x || now > padNext)) {
        moveH(x); padNeutral.x = false; padNext = now + REPEAT; usedIt();
      }
      if (y && !sheetOpen && (padNeutral.y || now > padNext)) {
        moveV(y); padNeutral.y = false; padNext = now + REPEAT; usedIt();
      }

      // cross / circle (and their Xbox equivalents)
      const a = p.buttons[0] && p.buttons[0].pressed;
      const b = p.buttons[1] && p.buttons[1].pressed;
      if (!a) padNeutral.a = true;
      if (!b) padNeutral.b = true;
      if (a && padNeutral.a) {
        padNeutral.a = false;
        if (sheetOpen) closeSheet(); else { activate(); usedIt(); }
      }
      if (b && padNeutral.b) {
        padNeutral.b = false;
        if (sheetOpen) { closeSheet(); } else XMBAudio.back();
      }
    }
    requestAnimationFrame(pollPads);
  }

  if (navigator.getGamepads) requestAnimationFrame(pollPads);

  /* ------------------------------------------------------------- clock --- */

  const clockEl = document.getElementById('clock');
  // PSP format: day/month, 12-hour with a meridiem — "26/6 10:21 PM"
  function tickClock() {
    const d = new Date();
    const mm = String(d.getMinutes()).padStart(2, '0');
    const h24 = d.getHours();
    const h = h24 % 12 || 12;
    clockEl.textContent =
      `${d.getDate()}/${d.getMonth() + 1} ${h}:${mm} ${h24 < 12 ? 'AM' : 'PM'}`;
  }
  tickClock();
  setInterval(tickClock, 15000);

  /* -------------------------------------------------------------- mute --- */

  const muteBtn = document.getElementById('mute');
  muteBtn.setAttribute('aria-pressed', String(XMBAudio.muted));
  muteBtn.addEventListener('click', () => {
    muteBtn.setAttribute('aria-pressed', String(XMBAudio.toggle()));
  });

  /* -------------------------------------------------------------- hint --- */

  const hintEl = document.getElementById('hint');
  let hinted = false;
  function usedIt() {
    if (hinted) return;
    hinted = true;
    hintEl.classList.add('gone');
  }
  setTimeout(usedIt, 9000);

  /* ------------------------------------------------------------- sheet --- */

  const sheet = document.getElementById('sheet');
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  let sheetOpen = false;
  let lastFocus = null;

  function openSheet() {
    lastFocus = document.activeElement;
    sheet.hidden = false;
    sheetOpen = true;
    status.textContent = '';
    status.className = 'form-status';
    form.querySelector('input[name="name"]').focus();
  }

  function closeSheet() {
    sheet.hidden = true;
    sheetOpen = false;
    XMBAudio.back();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.getElementById('sheet-close').addEventListener('click', closeSheet);
  sheet.addEventListener('click', e => { if (e.target === sheet) closeSheet(); });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!FORM_ACCESS_KEY) {
      status.className = 'form-status err';
      status.textContent = 'The form is not connected yet — reach me on Discord for now.';
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    status.className = 'form-status';
    status.textContent = 'Sending…';

    const data = Object.fromEntries(new FormData(form));
    data.access_key = FORM_ACCESS_KEY;
    data.subject = `${PROFILE.handle}.page — message from ${data.name}`;

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Send failed');
      status.className = 'form-status ok';
      status.textContent = 'Sent — I’ll get back to you.';
      form.reset();
    } catch (err) {
      status.className = 'form-status err';
      status.textContent = 'Could not send that. Try again, or reach me on Discord.';
    } finally {
      btn.disabled = false;
    }
  });

  /* --------------------------------------------------------------- go! --- */

  paint();
  XMBWave.start();
})();
