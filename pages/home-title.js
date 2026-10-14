/* Home title screen — an underwater game menu in the site's cobalt.
   Water light (canvas), a far skyline, white wedges, bubbles, a stepped and tilted menu in which every project is a line,
   a ghost word and a cover "figure" that bleed in for the line you are on, tilted list rows, HUD, and a hard diagonal wipe.
   Everything is drawn in code. Keyboard: any key to start · ↑ ↓ (W S) select · ← → (Q E) change category · Enter open · Esc skip.
   Mouse: hover selects, click opens. Touch: first tap selects, second tap opens. prefers-reduced-motion: no motion, instant cut. */
(() => {
  if (!document.body || document.body.dataset.page !== 'home') return;
  const P = window.PORTFOLIO || {}, S = window.SCENES || {}, H = window.HOME || {};
  const projects = P.projects || [];
  if (!projects.length) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav0 = (performance.getEntriesByType && performance.getEntriesByType('navigation')[0]) || {};
  let fromSite = false; try { fromSite = new URL(document.referrer).origin === location.origin; } catch (e) { /* no referrer */ }
  const force = /[?&]title\b/.test(location.search);
  /* back from a project page, or any in-site link, goes straight to the page; a fresh visit or a reload gets the title */
  if (!force && (location.hash || nav0.type === 'back_forward' || (nav0.type === 'navigate' && fromSite))) return;

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const src = n => (/^(assets|viz|media|demos|downloads)\//.test(n) ? n : /\.\w{3,4}$/.test(n) ? `assets/${n}` : `assets/${n}.webp`);
  const cards = H.cards || {};
  const reel = H.reel || ['jingwai', 'rallylens'];
  const keyOf = id => { const p = projects.find(x => x.id === id) || projects[0]; return src((S[p.id] || {}).key || p.cover); };

  /* ---- data: four categories, every project a menu line, three system lines ---- */
  const CATS = [['all', 'ALL', '全部'], ['research', 'RESEARCH', '研究'], ['game', 'GAME', '游戏'], ['service', 'SERVICE', '服务'], ['motion', 'MOTION', '影像']];
  const CAT_OF = { rallylens: 'research', 'privacy-city': 'research', baseball: 'research', artemis: 'game', garden: 'game', jingwai: 'game', 'growth-compass': 'service', looplab: 'service', tennisatom: 'motion', bronze: 'motion', afterglow: 'motion' };
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const catEn = c => (CATS.find(x => x[0] === c) || CATS[0])[1];
  const PRJ = projects.map(p => {
    const s = S[p.id] || {}, h = s.home || {}, st = s.stats || [];
    return { kind: 'p', id: p.id, no: p.number, lab: p.name, ghost: String(p.name).split(/[：:]| \/ /)[0], cat: CAT_OF[p.id] || 'all', target: `#scene-${p.id}`, img: p.id === 'baseball' ? '' : keyOf(p.id), year: p.year, tag: (cards[p.id] || {}).tag || p.summary || '', stat: st[0] || null, tools: h.tools || '' };
  });
  const SYS = {
    catalog: { kind: 's', lab: '作品目录', ghost: 'CATALOG', target: '#scenes', img: keyOf(reel[0]), tag: H.scenesSide || '每个项目都可以点开，看完整的研究和设计过程。', cat: 'all' },
    about: { kind: 's', lab: '关于', ghost: 'ABOUT', target: '#cast', img: 'assets/applicant-portrait.webp', tag: H.castSide || '', cat: 'all' },
    contact: { kind: 's', lab: '联系', ghost: 'CONTACT', target: '#credits', img: keyOf(reel[1] || reel[0]), tag: H.avail || '', cat: 'all' }
  };
  let cat = 'all', cur = [], idx = 0;
  const visible = () => [SYS.catalog].concat(PRJ.filter(x => cat === 'all' || x.cat === cat), [SYS.about, SYS.contact]);

  const root = document.documentElement;
  try { history.scrollRestoration = 'manual'; } catch (e) { /* ignore */ }
  scrollTo(0, 0);
  root.classList.add('tt-lock');

  /* ---- static layers ---- */
  const rr = (() => { let s = 7; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
  const city = (() => {
    let x = -20, o = '';
    while (x < 1220) { const w = 30 + rr() * 70, h = 60 + rr() * 220 * (.4 + .6 * Math.sin(x / 260 + 1) ** 2), y = 400 - h; o += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}"/>`; for (let k = 0; k < 6; k++) o += `<rect class="wn" x="${(x + 6 + rr() * (w - 14)).toFixed(0)}" y="${(y + 10 + rr() * (h - 24)).toFixed(0)}" width="6" height="4"/>`; x += w + rr() * 8; }
    return `<svg class="tt-city" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${o}</svg>`;
  })();
  const bubbles = Array.from({ length: 22 }, () => { const s = 6 + rr() * 30; return `<i style="left:${(rr() * 100).toFixed(1)}%;width:${s.toFixed(0)}px;height:${s.toFixed(0)}px;--d:${(-rr() * 16).toFixed(1)}s;--t:${(9 + rr() * 9).toFixed(1)}s;--x:${((rr() - .5) * 60).toFixed(0)}px"></i>`; }).join('');
  const confetti = Array.from({ length: 12 }, () => `<b style="left:${(rr() * 100).toFixed(1)}%;top:${(rr() * 100).toFixed(1)}%;width:${(8 + rr() * 18).toFixed(0)}px;height:${(8 + rr() * 18).toFixed(0)}px;--r:${(rr() * 360).toFixed(0)}deg;--d:${(-rr() * 10).toFixed(1)}s"></b>`).join('');
  const clockTicks = Array.from({ length: 60 }, (_, i) => { const a = i * 6 * Math.PI / 180, big = i % 5 === 0, r1 = big ? 436 : 456; return `<line x1="${(500 + r1 * Math.sin(a)).toFixed(1)}" y1="${(500 - r1 * Math.cos(a)).toFixed(1)}" x2="${(500 + 480 * Math.sin(a)).toFixed(1)}" y2="${(500 - 480 * Math.cos(a)).toFixed(1)}"${big ? ' class="b"' : ''}/>`; }).join('');

  const ov = document.createElement('div');
  ov.className = 'tt'; ov.id = 'tt'; ov.dataset.s = 'press';
  ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', '开始画面，选择要看的作品');
  ov.innerHTML = `
    <canvas class="tt-water" aria-hidden="true"></canvas>
    ${city}
    <svg class="tt-clock" viewBox="0 0 1000 1000" aria-hidden="true"><g class="ring"><circle cx="500" cy="500" r="486"/><circle cx="500" cy="500" r="418" class="t"/>${clockTicks}</g><g class="hand"><line class="h" x1="500" y1="500" x2="500" y2="290"/><line class="m" x1="500" y1="500" x2="500" y2="170"/><circle cx="500" cy="500" r="14"/></g></svg>
    <div class="tt-fx" aria-hidden="true"><i class="wg w1"></i><i class="wg w2"></i><i class="wg w3"></i><i class="wg w4"></i><span class="bb">${bubbles}</span><span class="cf">${confetti}</span></div>
    <div class="tt-stage" aria-hidden="true">
      <div class="tt-ghost"><span></span></div>
      <figure class="tt-art"><div class="pic"><img alt=""><i class="tint"></i><i class="dots"></i></div></figure>
      <div class="tt-rows"></div>
      <div class="tt-catl"></div>
      <i class="tt-sweep"></i>
    </div>
    <header class="tt-hud"><div class="tt-box"><b>${projects.length} SCENES</b><span>works in the portfolio</span><time id="tt-time">--/-- --:--</time></div><div class="tt-catw" aria-hidden="true"><b id="tt-cw">ALL</b><span id="tt-cs"></span></div></header>
    <nav class="tt-pager" aria-label="作品分类">${'<button type="button" class="pg" data-c="L" aria-label="上一个分类"><i>◀</i><b>L1</b></button>'}<ul>${CATS.map(c => `<li><button type="button" data-c="${c[0]}"><span>${c[2]}</span></button></li>`).join('')}</ul>${'<button type="button" class="pg" data-c="R" aria-label="下一个分类"><b>R1</b><i>▶</i></button>'}</nav>
    <button type="button" class="tt-skip" aria-label="跳过开始画面，直接进入首页"><span>SKIP</span><i aria-hidden="true">▸</i></button>
    <div class="tt-title"><p class="tt-kick"><span>${esc(H.place || 'SHANGHAI · TONGJI UNIV.')}</span></p><h1 class="tt-name" aria-label="Wenjing Bian"><span class="a" aria-hidden="true">WENJING</span><span class="b" aria-hidden="true">BIAN</span></h1><p class="tt-cn"><b>卞文璟</b><span>视觉传达设计 × 人工智能</span></p></div>
    <p class="tt-press"><b>PRESS ANY KEY</b><span class="k">按任意键，或点击屏幕开始</span><span class="t">TAP TO START</span></p>
    <div class="tt-lw"><ul class="tt-list" role="menu" aria-label="作品"></ul></div>
    <footer class="tt-guide"><p class="q">要查看哪个作品？</p><p class="keys" aria-hidden="true"><span class="kb"><b>↑↓</b>选择</span><span class="kb"><b>←→</b>分类</span><span class="kb"><b>ENTER</b>打开</span><span class="kb"><b>ESC</b>跳过</span><span class="tp">点一下选中，再点一下打开</span></p></footer>`;
  document.body.appendChild(ov);

  const $ = s => ov.querySelector(s);
  const list = $('.tt-list'), stage = $('.tt-stage'), ghost = $('.tt-ghost span'), pimg = $('.tt-art img'), art = $('.tt-art'), rows = $('.tt-rows'), catl = $('.tt-catl'), cw = $('#tt-cw'), cs = $('#tt-cs');
  const tabs = [...ov.querySelectorAll('.tt-pager li button')];
  let btns = [];
  const inertEls = [...document.querySelectorAll('main, .nav, .skip')];
  inertEls.forEach(e => { try { e.inert = true; } catch (err) { /* old browser */ } });
  let state = 'press', dead = false, lastPT = 'mouse', lastWheel = 0;

  /* ---- clock / date ---- */
  const DAY = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'], tEl = $('#tt-time'), hH = $('.tt-clock .h'), hM = $('.tt-clock .m');
  const tick = () => {
    const d = new Date(), h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
    tEl.textContent = `${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${DAY[d.getDay()]} ${pad(h)}:${pad(m)}:${pad(s)}`;
    hH.setAttribute('transform', `rotate(${((h % 12) + m / 60) * 30} 500 500)`);
    hM.setAttribute('transform', `rotate(${(m + s / 60) * 6} 500 500)`);
  };
  tick(); const clockTimer = setInterval(tick, 1000);

  /* ---- list, categories, the line you are on ---- */
  const renderList = () => {
    cur = visible();
    list.innerHTML = cur.map((it, i) => `<li role="none" style="--i:${i}"><button type="button" role="menuitem" class="tt-it${it.kind === 's' ? ' sys' : ''}" tabindex="-1" data-i="${i}"><span class="tx">${esc(it.lab)}</span></button></li>`).join('');
    btns = [...list.querySelectorAll('.tt-it')];
    list.classList.toggle('few', cur.length <= 8);
  };
  const rowsHtml = it => {
    if (it.kind === 'p') return `<div class="rw on"><b class="lb">No.${esc(it.no)}</b><span class="nm">${esc(it.lab)}</span><span class="nn"><small>YEAR</small><u>${esc(it.year)}</u></span></div>
      <div class="rw"><b class="lb">${catEn(it.cat)}</b><span class="nm">${esc(it.stat ? it.stat[1] : '')}</span><span class="nn">${it.stat ? `<u class="y">${esc(it.stat[0])}</u>` : ''}</span></div>
      <div class="rw"><b class="lb">TOOLS</b><span class="nm">${esc(it.tools)}</span></div>
      <p class="cap">${esc(it.tag)}</p>`;
    return `<div class="rw on"><b class="lb">${esc(it.ghost)}</b><span class="nm">${esc(it.lab)}</span></div><p class="cap">${esc(it.tag)}</p>`;
  };
  const catHtml = () => `<p class="lst">LIST</p>${PRJ.map((q, i) => `<button type="button" class="cr" data-pi="${i}" tabindex="-1"><b class="rm">${ROMAN[i]}</b><span class="nm">${esc(q.lab)}</span><span class="yr">${esc(q.year)}</span><em class="rk">${esc(q.no)}</em></button>`).join('')}`;
  catl.innerHTML = catHtml();
  const show = (it, init) => {
    ghost.textContent = it.ghost;
    if (it.img) { pimg.hidden = false; pimg.src = it.img; art.classList.remove('code'); } else { pimg.hidden = true; art.classList.add('code'); }
    rows.innerHTML = rowsHtml(it);
    stage.classList.toggle('is-cat', it === SYS.catalog);
    if (!init) { stage.classList.remove('sw'); void stage.offsetWidth; stage.classList.add('sw'); }
  };
  const select = (i, o = {}) => {
    i = (i + cur.length) % cur.length; idx = i;
    btns.forEach((b, k) => { b.classList.toggle('on', k === i); b.tabIndex = k === i ? 0 : -1; b.setAttribute('aria-current', k === i ? 'true' : 'false'); });
    const b = btns[i]; if (b && !o.init) { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); }
    show(cur[i], o.init);
    if (o.focus && state === 'menu') b.focus({ preventScroll: true });
  };
  const setCat = (c, o = {}) => {
    const k = CATS.findIndex(x => x[0] === c); if (k < 0) return;
    cat = c; const n = PRJ.filter(x => c === 'all' || x.cat === c).length;
    tabs.forEach(t => { const on = t.dataset.c === c; t.classList.toggle('on', on); t.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    cw.textContent = CATS[k][1]; cs.textContent = `${CATS[k][2]} · ${n} 个作品`;
    renderList(); select(c === 'all' ? 0 : 1, { init: o.init, focus: false });
    list.classList.remove('re'); void list.offsetWidth; list.classList.add('re');
  };
  const stepCat = d => setCat(CATS[(CATS.findIndex(x => x[0] === cat) + d + CATS.length) % CATS.length][0]);
  setCat('all', { init: true });

  const toMenu = () => {
    if (state !== 'press') return;
    state = 'menu'; ov.dataset.s = 'menu';
    setTimeout(() => { if (state === 'menu' && btns[idx]) btns[idx].focus({ preventScroll: true }); }, reduce ? 0 : 560);
  };

  /* ---- enter: a hard diagonal wipe, swap the page under it, wipe off ---- */
  const enter = it => {
    if (dead) return; dead = true; state = 'out'; ov.dataset.s = 'out';
    const finish = () => {
      clearInterval(clockTimer); cancelAnimationFrame(raf); removeEventListener('keydown', onKey, true); removeEventListener('resize', fit);
      document.removeEventListener('visibilitychange', onVis);
      ov.remove(); root.classList.remove('tt-lock');
      inertEls.forEach(e => { try { e.inert = false; } catch (err) { /* ignore */ } });
      try { history.scrollRestoration = 'auto'; } catch (e) { /* ignore */ }
      const el = it && document.querySelector(it.target);
      root.style.scrollBehavior = 'auto';
      if (el) { const y = el.getBoundingClientRect().top + scrollY - (it.kind === 'p' ? 0 : 56); scrollTo(0, Math.max(0, y)); } else scrollTo(0, 0);
      root.style.scrollBehavior = '';
      if (!el) { const rep = [...document.querySelectorAll('#top .chars,#top .rv,#top .clip')]; rep.forEach(e => e.classList.remove('in')); void root.offsetWidth; requestAnimationFrame(() => requestAnimationFrame(() => rep.forEach(e => e.classList.add('in')))); }
      const tg = el && (el.querySelector('h2,h3') || el); if (tg) { tg.setAttribute('tabindex', '-1'); tg.focus({ preventScroll: true }); }
    };
    if (reduce) { finish(); return; }
    const w = document.createElement('div');
    w.className = 'tt-wipe'; w.setAttribute('aria-hidden', 'true');
    w.innerHTML = `<i></i><i></i><i></i><span>${it ? esc(it.kind === 'p' ? it.lab : it.ghost) : 'PORTFOLIO'}</span>`;
    document.body.appendChild(w);
    void w.offsetWidth; w.classList.add('in');
    setTimeout(() => { finish(); w.classList.remove('in'); w.classList.add('out'); }, 560);
    setTimeout(() => w.remove(), 1250);
  };

  /* ---- input ---- */
  const MOD = ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'NumLock', 'ScrollLock', 'AudioVolumeUp', 'AudioVolumeDown', 'AudioVolumeMute'];
  const onKey = e => {
    if (dead) return;
    if (e.ctrlKey || e.metaKey || e.altKey || MOD.includes(e.key) || /^F\d+$/.test(e.key)) return;
    if (state === 'press') { e.preventDefault(); e.stopPropagation(); if (e.key === 'Escape') enter(null); else toMenu(); return; }
    const k = e.key;
    if (k === 'ArrowDown' || k === 's' || k === 'S' || k === 'j') { e.preventDefault(); select(idx + 1, { focus: true }); }
    else if (k === 'ArrowUp' || k === 'w' || k === 'W' || k === 'k') { e.preventDefault(); select(idx - 1, { focus: true }); }
    else if (k === 'ArrowRight' || k === 'e' || k === 'E' || k === ']') { e.preventDefault(); stepCat(1); btns[idx] && btns[idx].focus({ preventScroll: true }); }
    else if (k === 'ArrowLeft' || k === 'q' || k === 'Q' || k === '[') { e.preventDefault(); stepCat(-1); btns[idx] && btns[idx].focus({ preventScroll: true }); }
    else if (k === 'Home') { e.preventDefault(); select(0, { focus: true }); }
    else if (k === 'End') { e.preventDefault(); select(cur.length - 1, { focus: true }); }
    else if (k === 'Enter' || k === ' ') { e.preventDefault(); e.stopPropagation(); enter(cur[idx]); }
    else if (k === 'Escape') { e.preventDefault(); enter(null); }
    else if (k === 'Tab') { e.preventDefault(); (document.activeElement === $('.tt-skip') ? btns[idx] : $('.tt-skip')).focus({ preventScroll: true }); }
  };
  addEventListener('keydown', onKey, true);
  ov.addEventListener('pointerdown', e => { lastPT = e.pointerType || 'mouse'; }, true);
  ov.addEventListener('click', e => {
    if (dead) return;
    if (e.target.closest('.tt-skip')) { enter(null); return; }
    if (state === 'press') { toMenu(); return; }
    const pg = e.target.closest('.tt-pager button');
    if (pg) { const c = pg.dataset.c; if (c === 'L') stepCat(-1); else if (c === 'R') stepCat(1); else setCat(c); return; }
    const cr = e.target.closest('.cr');
    if (cr) { enter(PRJ[+cr.dataset.pi]); return; }
    const b = e.target.closest('.tt-it');
    if (b) { const i = +b.dataset.i; if (lastPT === 'touch' && i !== idx) select(i); else enter(cur[i]); }
  });
  list.addEventListener('pointerover', e => { const b = e.target.closest('.tt-it'); if (b && e.pointerType === 'mouse' && state === 'menu' && +b.dataset.i !== idx) select(+b.dataset.i); });
  ov.addEventListener('wheel', e => {
    if (state !== 'menu' || e.ctrlKey) return;
    e.preventDefault();
    const n = performance.now(); if (n - lastWheel < 110 || Math.abs(e.deltaY) < 4) return;
    lastWheel = n; select(idx + (e.deltaY > 0 ? 1 : -1));
  }, { passive: false });

  /* ---- water: caustic light, bright and cyan near the surface, cobalt below; ripples where you move or press ---- */
  const cv = $('.tt-water'), cx = cv.getContext('2d');
  let W = 0, Hh = 0, im = null, SC = 6, raf = 0, last = 0;
  const ripples = [];
  const fit = () => { SC = innerWidth < 700 ? 4 : 6; W = Math.ceil(innerWidth / SC); Hh = Math.ceil(innerHeight / SC); cv.width = W; cv.height = Hh; im = cx.createImageData(W, Hh); if (reduce) draw(0); };
  const ripple = (x, y, k) => { ripples.push({ x: x / SC, y: y / SC, t: performance.now(), k }); if (ripples.length > 6) ripples.shift(); };
  let lastMove = 0;
  ov.addEventListener('pointermove', e => { const n = performance.now(); if (n - lastMove > 260 && !reduce) { lastMove = n; ripple(e.clientX, e.clientY, .55); } });
  ov.addEventListener('pointerdown', e => { if (!reduce) ripple(e.clientX, e.clientY, 1); });
  const TAU = 6.28318;
  const draw = time => {
    const d = im.data, t = time * .00042 + 23, inten = .005, now = performance.now();
    const rp = ripples.filter(r => now - r.t < 2600).map(r => { const a = (now - r.t) / 1000; return { x: r.x, y: r.y, R: a * 46, w: 3 + a * 3, f: r.k * Math.exp(-a * 1.2) }; });
    const aspect = W / Hh, sx = TAU * 1.9 * aspect / W, sy = TAU * 1.9 / Hh;
    for (let y = 0; y < Hh; y++) {
      const gy = y / Hh, py = y * sy - 250, top = Math.max(0, 1 - gy * 1.6), lit = .35 + .9 * top;
      for (let x = 0; x < W; x++) {
        const px = x * sx - 250;
        let ix = px, iy = py, c = 1;
        for (let n = 0; n < 4; n++) {
          const tt = t * (1 - 3.5 / (n + 1));
          const nx = px + Math.cos(tt - ix) + Math.sin(tt + iy), ny = py + Math.sin(tt - iy) + Math.cos(tt + ix);
          ix = nx; iy = ny;
          c += 1 / Math.hypot(px / (Math.sin(ix + tt) / inten), py / (Math.cos(iy + tt) / inten));
        }
        c = c / 5; c = 1.17 - Math.pow(c, 1.4);
        let v = Math.abs(c); v = v * v; v = v * v; v = v * v; v *= lit;
        for (let k = 0; k < rp.length; k++) { const r = rp[k], dx = x - r.x, dy = y - r.y, dd = Math.sqrt(dx * dx + dy * dy) - r.R; if (dd < r.w * 3 && dd > -r.w * 3) v += r.f * .9 * Math.exp(-(dd * dd) / (2 * r.w * r.w)); }
        const c1 = v > 1.2 ? 1.2 : v, o = (y * W + x) * 4;
        /* surface: light cyan-blue; depth: saturated cobalt */
        d[o] = 16 + 40 * top + 150 * c1 * c1;
        d[o + 1] = 52 + 120 * top + 190 * c1;
        d[o + 2] = 214 + 41 * top + 40 * c1;
        d[o + 3] = 255;
      }
    }
    cx.putImageData(im, 0, 0);
  };
  const loop = ts => { raf = requestAnimationFrame(loop); if (ts - last < 36) return; last = ts; draw(ts); };
  const onVis = () => { cancelAnimationFrame(raf); if (!document.hidden && !dead && !reduce) raf = requestAnimationFrame(loop); };
  addEventListener('resize', fit); document.addEventListener('visibilitychange', onVis);
  fit(); draw(0);
  if (!reduce) raf = requestAnimationFrame(loop);
  ov.tabIndex = -1;
  ov.focus({ preventScroll: true });
})();
