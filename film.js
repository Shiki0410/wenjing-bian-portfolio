/* COBALT FILE — renderer. Home = a film in five parts; case = one scene in acts. */
(() => {
  const P = window.PORTFOLIO, S = window.SCENES || {}, H = window.HOME || {}, MOD = window.MODULES || {};
  const I = (n, c) => (window.ICON ? window.ICON(n, c) : '');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
  const src = n => (/^(assets|viz|media|demos|downloads)\//.test(n) ? n : /\.\w{3,4}$/.test(n) ? `assets/${n}` : `assets/${n}.webp`);
  const pad = n => String(n).padStart(2, '0');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const caseUrl = id => `case.html?project=${encodeURIComponent(id)}`;
  const projects = P.projects;
  const byId = id => projects.find(p => p.id === id);

  /* ---------- shared defs: duotone filter, brush shape ---------- */
  document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="duo" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0 0 0 1 0"/><feComponentTransfer><feFuncR type="table" tableValues="0.04 0.12 0.35 0.93"/><feFuncG type="table" tableValues="0.07 0.23 0.68 0.95"/><feFuncB type="table" tableValues="0.25 1 1 0.99"/></feComponentTransfer></filter></svg>`);
  const BRUSH = `<svg class="brush" viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden="true"><path d="M8 176c58-30 140-58 238-76 96-18 192-24 300-26 120-2 236 6 352 18 98 10 190 26 286 44l8 26c-110-8-208-20-306-26-126-8-246-8-362-2-98 6-198 20-292 44-80 20-150 46-206 74Z"/><path d="M60 236c140-40 300-66 470-74 152-8 300 0 446 20l-4 14c-152-12-300-16-450-8-156 8-310 28-458 60Z" opacity=".75"/></svg>`;

  /* ---------- nav ---------- */
  const nav = $('.nav'), bar = $('.nav-bar');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
    if (nav) { nav.classList.toggle('solid', y > 40); nav.classList.toggle('hide', y > 400 && y > lastY + 4); if (y < lastY - 4) nav.classList.remove('hide'); }
    lastY = y;
  };
  addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });

  /* ---------- page wipe ---------- */
  document.body.insertAdjacentHTML('beforeend', '<div class="wipe" aria-hidden="true"><i></i><i></i><span></span></div>');
  const wipe = $('.wipe');
  if (!reduce) {
    wipe.classList.add('out'); setTimeout(() => wipe.classList.remove('out'), 900);
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin || !/(index|case)\.html$|\/$/.test(u.pathname)) return;
      if (u.pathname === location.pathname && u.search === location.search) return;
      e.preventDefault();
      $('span', wipe).textContent = a.dataset.cut || '';
      wipe.classList.add('go');
      setTimeout(() => { location.href = a.href; }, 560);
    });
    addEventListener('pageshow', e => { if (e.persisted) wipe.classList.remove('go'); });
  }

  /* ---------- reveal ---------- */
  const io = 'IntersectionObserver' in window && !reduce
    ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px 6% 0px', threshold: 0 })
    : null;
  const reveal = root => $$('.rv,.clip,.chars', root).forEach(el => (io ? io.observe(el) : el.classList.add('in')));
  const glyphs = l => l.match(/[“‘（《「『]*.[，。、；：？！”’）》」』…—]*/gu) || [];
  const chars = (text, cls = '') => `<span class="chars ${cls}" aria-label="${esc(text)}">${String(text).split('\n').map(line => `<span class="ln" aria-hidden="true">${glyphs(line).map((c, i) => c === ' ' ? ' ' : `<span class="c" style="--i:${i}">${esc(c)}</span>`).join('')}</span>`).join('')}</span>`;

  /* ---------- lazy inline SVG ---------- */
  const svgIO = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { svgIO.unobserve(e.target); loadSvg(e.target); } }), { rootMargin: '600px 0px' }) : null;
  const loadSvg = async el => {
    try {
      let t = (await (await fetch(el.dataset.svg)).text()).replace(/<\?xml[^>]*>/, '');
      // every chart ships compacted classes (.v0, .v1 …) and ids; scope them so inline charts can't restyle each other
      const k = `s${++svgSeq}`;
      t = t.replace(/<style>([\s\S]*?)<\/style>/g, (m, css) => `<style>${css.replace(/\.(v\d+)\b/g, `.${k}$1`)}</style>`)
        .replace(/class="([^"]*)"/g, (m, c) => `class="${c.split(/\s+/).map(x => (/^v\d+$/.test(x) ? k + x : x)).join(' ')}"`)
        .replace(/\bid="([^"]+)"/g, `id="${k}-$1"`).replace(/url\(#([^)]+)\)/g, `url(#${k}-$1)`).replace(/href="#([^"]+)"/g, `href="#${k}-$1"`);
      // fold any saturated non-blue colour (orange, red, green, pink…) into the blue palette at the same lightness
      t = t.replace(/#([0-9a-f]{6}|[0-9a-f]{3})\b/gi, (m, h) => {
        if (h.length === 3) h = [...h].map(c => c + c).join('');
        const n = parseInt(h, 16), r = (n >> 16) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
        if (d < .12) return m;
        const s = d / (1 - Math.abs(2 * l - 1));
        let hue = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; hue = (hue * 60 + 360) % 360;
        if (hue >= 190 && hue <= 265) return m;
        return `hsl(229 ${Math.round(Math.min(1, s) * 92)}% ${Math.round(l * 100)}%)`;
      });
      el.innerHTML = t;
      // charts drawn only in light ink were made for a blue panel: give them one
      const cols = (t.match(/(?:fill|stroke):\s*(#[0-9a-f]{3,6})/gi) || []).map(c => c.split(/:\s*/)[1]);
      const lum = h => { h = h.slice(1); if (h.length === 3) h = [...h].map(c => c + c).join(''); const n = parseInt(h, 16); return (.2126 * (n >> 16) + .7152 * (n >> 8 & 255) + .0722 * (n & 255)) / 255; };
      if (cols.length && cols.every(c => lum(c) > .72)) el.classList.add('on-dark');
      if (t.includes('href="assets/refinement/') || t.includes('href="assets/composition/tennis-')) el.classList.add('duo-img');
      const s = $('svg', el); if (s) { s.removeAttribute('width'); s.removeAttribute('height'); s.setAttribute('role', 'img'); }
    } catch (e) { el.textContent = '图表加载失败'; }
  };
  let svgSeq = 0;
  const lazySvg = root => $$('[data-svg]', root).forEach(el => (svgIO ? svgIO.observe(el) : loadSvg(el)));

  /* ---------- lightbox ---------- */
  const lightbox = () => {
    const lb = $('#lb'); if (!lb || !lb.showModal) return;
    document.addEventListener('click', e => {
      const sb = e.target.closest('[data-lb]');
      if (sb) { $('img', lb).src = sb.dataset.lb; $('img', lb).alt = sb.textContent.trim(); $('p', lb).textContent = sb.textContent.trim(); lb.showModal(); return; }
      const im = e.target.closest('.fig .ph img'); if (!im) return;
      $('img', lb).src = im.currentSrc || im.src; $('img', lb).alt = im.alt; $('p', lb).textContent = im.alt; lb.showModal();
    });
    lb.addEventListener('click', e => { if (e.target === lb || e.target.tagName === 'BUTTON') lb.close(); });
  };

  /* =================================================================
     BLOCKS
     ================================================================= */
  let figNo = 0;
  const span = b => (b.span ? ` ${b.span}` : '');
  const figure = (n, cap, opt = {}) => {
    figNo++;
    const cls = opt.contain ? ' style="object-fit:contain"' : '';
    return `<figure class="fig${opt.dark ? ' dark' : ''}"><div class="ph"${opt.ar ? ` style="aspect-ratio:${opt.ar}"` : ''}><img src="${src(n)}" alt="${esc(cap || '')}" loading="lazy"${cls}></div>${cap ? `<figcaption><b>FIG.${pad(figNo)}</b><span>${md(cap)}</span></figcaption>` : ''}</figure>`;
  };
  const vizFig = (file, cap) => { figNo++; return `<figure class="fig viz"><div class="ph" data-svg="${file}"></div>${cap ? `<figcaption><b>FIG.${pad(figNo)}</b><span>${md(cap)}</span></figcaption>` : ''}</figure>`; };
  const vizFile = (id, v) => (typeof v === 'string' ? v : `viz/${id}-${pad(v)}.svg`);
  const videoEl = v => `<div class="vid"><video controls preload="none" playsinline poster="${src(v.poster)}"><source src="media/${v.src}" type="${/\.webm$/.test(v.src) ? 'video/webm' : 'video/mp4'}"></video><div class="cap"><b>${esc(v.title)}</b><span>${esc(v.note || '')}</span></div></div>`;
  let manifest = null;

  const block = (b, id) => {
    if (b.text) return `<div class="b-text rv${b.side === 'r' ? ' r' : ''}${span(b)}">${b.h ? `<h3>${esc(b.h)}</h3>` : ''}${[].concat(b.text).map(t => `<p>${md(t)}</p>`).join('')}</div>`;
    if (b.sub) return `<h3 class="b-sub rv${span(b)}">${esc(b.sub)}</h3>`;
    if (b.list) return `<ol class="b-list rv${b.cols ? ' cols' : ''}${span(b)}"${b.cols ? ` style="--n:${b.cols}"` : ''}>${b.list.map(x => Array.isArray(x) ? `<li><div><b>${esc(x[0])}</b><span>${md(x[1] || '')}</span></div></li>` : `<li><span>${md(x)}</span></li>`).join('')}</ol>`;
    if (b.stats) return `<div class="b-stats rv${span(b)}">${b.stats.map(([v, l, s]) => `<div><b${String(v).length > 7 ? ' class="long"' : ''}>${esc(v)}</b><span>${esc(l)}</span>${s ? `<small>${esc(s)}</small>` : ''}</div>`).join('')}</div>`;
    if (b.quote) return `<blockquote class="b-quote rv${span(b)}"><p>${md(b.quote)}</p>${b.cite ? `<cite>${esc(b.cite)}</cite>` : ''}</blockquote>`;
    if (b.pair) { const s = (x, k) => `<div class="side ${k}"><span class="mono">${esc(x.mono || '')}</span>${x.h ? `<h4>${esc(x.h)}</h4>` : ''}${[].concat(x.p || []).map(t => `<p>${md(t)}</p>`).join('')}</div>`; return `<div class="b-pair rv${span(b)}">${s(b.pair.a, 'a')}<span class="vs">${esc(b.pair.vs || '≠')}</span>${s(b.pair.b, 'b')}</div>`; }
    if (b.table) return `<div class="b-table rv${span(b)}"><table><thead><tr>${b.table.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${b.table.rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    if (b.fig) return `<div class="rv${span(b)}">${figure(b.fig, b.cap, b)}</div>`;
    if (b.viz !== undefined) return `<div class="rv${span(b)}">${vizFig(vizFile(id, b.viz), b.cap)}</div>`;
    if (b.gallery) return `<div class="gallery rv${b.free ? ' free' : ''}${span(b)}" style="--n:${b.n || Math.min(3, b.gallery.length)};${b.ar ? `--ar:${b.ar}` : ''}">${b.gallery.map(([n, c]) => /^viz\/|^\d+$/.test(String(n)) ? vizFig(vizFile(id, n), c) : figure(n, c)).join('')}</div>`;
    if (b.collage) return `<div class="collage rv${b.flip ? ' flip' : ''}${span(b)}">${b.collage.map(([n, c]) => figure(n, c)).join('')}<i class="tape" aria-hidden="true"></i></div>`;
    if (b.video) return `<div class="vids rv${span(b)}" style="--n:${b.n || Math.min(2, b.video.length)}">${b.video.map(videoEl).join('')}</div>`;
    if (b.player) { const it = b.player.items; return `<div class="player ${b.player.cls || ''} rv${span(b)}" data-player style="--n:${it.length}"><video controls preload="none" playsinline poster="${src(it[0].poster)}"><source src="media/${it[0].src}" type="video/mp4"></video><div class="now"><span data-now>${esc(it[0].label)}</span><span>${esc(b.player.title || '')}</span></div><div class="list" role="group" aria-label="选择影片">${it.map((x, i) => `<button type="button" data-src="${x.src}" data-poster="${src(x.poster)}" data-label="${esc(x.label)}" data-marks='${esc(JSON.stringify(x.marks || []))}' data-desc="${esc(x.desc || '')}" aria-pressed="${i ? 'false' : 'true'}"><img src="${src(x.poster)}" alt="" loading="lazy"><b>${pad(i + 1)}</b></button>`).join('')}</div><div class="marks"></div></div>`; }
    if (b.tabs) return tabsHtml(b.tabs, id, span(b));
    if (b.snap) return `<div class="snap-mount rv${span(b)}" data-snap='${esc(JSON.stringify(b.snap))}'></div>`;
    if (b.module) return `<div class="mod-mount rv${span(b)}" data-mod="${b.module}" data-opt='${esc(JSON.stringify(b.opt || {}))}'>${MOD[b.module] ? MOD[b.module].html(byId(id), b.opt || {}) : ''}</div>`;
    if (b.ratios) return `<div class="b-ratios rv${span(b)}">${b.ratios.map(([l, n, d, u]) => `<div class="ratio"><b>${n}<small> / ${d}</small></b><span>${esc(l)}</span><i role="img" aria-label="${esc(l)} ${n} / ${d}">${Array.from({ length: d }, (_, k) => `<em class="${k < n ? 'on' : ''}"></em>`).join('')}</i><small>分母：${d} ${esc(u)}</small></div>`).join('')}</div>`;
    if (b.note) return `<p class="note rv${span(b)}">${md(b.note)}</p>`;
    if (b.html) return `<div class="rv${span(b)}">${b.html}</div>`;
    return '';
  };
  const tabsHtml = (t, id, cls = '') => {
    const uid = 't' + Math.random().toString(36).slice(2, 7);
    return `<div class="tabs rv${cls}" data-tabs><div class="tabs-head">${t.title ? `<h3>${esc(t.title)}</h3>` : ''}<div class="tabs-btns" role="tablist">${t.items.map((x, i) => `<button type="button" role="tab" id="${uid}-b${i}" aria-controls="${uid}-p${i}" aria-selected="${i ? 'false' : 'true'}"><b>${pad(i + 1)}</b>${esc(x.label)}</button>`).join('')}</div></div>
      ${t.items.map((x, i) => {
        const media = [].concat(x.viz || []).map(v => vizFig(vizFile(id, v), x.vcap || '')).join('') + [].concat(x.img || []).map(n => figure(n, x.icap || '')).join('');
        const text = (x.h || x.p || x.dl) ? `<div class="tp-text">${x.h ? `<h4>${esc(x.h)}</h4>` : ''}${[].concat(x.p || []).map(p => `<p>${md(p)}</p>`).join('')}${x.dl ? `<dl>${x.dl.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${md(v)}</dd>`).join('')}</dl>` : ''}</div>` : '';
        return `<div class="tab-pane${i ? '' : ' on'}${media && text ? '' : ' solo'}" role="tabpanel" id="${uid}-p${i}" aria-labelledby="${uid}-b${i}">${media ? `<div class="tp-media">${media}</div>` : ''}${text}</div>`;
      }).join('')}</div>`;
  };
  const bindTabs = root => $$('[data-tabs]', root).forEach(t => {
    if (t.dataset.bound) return; t.dataset.bound = 1;
    const bs = $$(':scope > .tabs-head [role=tab]', t), ps = $$(':scope > .tab-pane', t);
    bs.forEach((b, i) => b.addEventListener('click', () => { bs.forEach((x, k) => x.setAttribute('aria-selected', k === i ? 'true' : 'false')); ps.forEach((p, k) => p.classList.toggle('on', k === i)); lazySvg(ps[i]); }));
  });
  const bindPlayers = root => $$('[data-player]', root).forEach(pl => {
    const v = $('video', pl), mk = $('.marks', pl);
    const marks = b => {
      const m = JSON.parse(b.dataset.marks || '[]'), d = b.dataset.desc;
      const tc = t => `${pad(Math.floor(t / 60))}:${(t % 60 < 10 ? '0' : '') + (t % 60).toFixed(Number.isInteger(t) ? 0 : 2)}`;
      mk.innerHTML = (d ? `<p>${md(d)}</p>` : '') + (m.length ? `<div class="${m[0][2] ? 'stills' : ''}">${m.map(([t, l, im]) => im ? `<button type="button" data-t="${t}" class="still"><img src="${src(im)}" alt="${esc(l)}" loading="lazy"><b>${tc(t)}</b></button>` : `<button type="button" data-t="${t}"><b>${tc(t)}</b>${esc(l)}</button>`).join('')}</div>` : '');
      $$('button', mk).forEach(x => x.addEventListener('click', () => { const go = () => { v.currentTime = +x.dataset.t; v.play().catch(() => {}); }; if (v.readyState < 1) { v.load(); v.addEventListener('loadedmetadata', go, { once: true }); } else go(); }));
    };
    $$('.list button', pl).forEach(b => b.addEventListener('click', () => {
      $$('.list button', pl).forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      v.poster = b.dataset.poster; $('source', v).src = `media/${b.dataset.src}`; v.load(); v.play().catch(() => {});
      $('[data-now]', pl).textContent = b.dataset.label; marks(b);
    }));
    const first = $('.list button', pl); if (first) marks(first);
    if (pl.classList.contains('eps')) document.addEventListener('pv:episode', e => { const b = $$('.list button', pl)[+e.detail - 1]; if (b) { pl.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); b.click(); } });
  });
  const mountSnaps = async (root, id) => {
    const ms = $$('.snap-mount', root); if (!ms.length) return;
    if (!manifest) manifest = await (await fetch('viz/manifest.json')).json();
    ms.forEach(m => {
      const cfg = JSON.parse(m.dataset.snap), g = manifest[id].groups.find(x => x.group === cfg.group); if (!g) return;
      const items = g.states.map((s, i) => {
        const a = (cfg.items || [])[i] || {};
        return { label: a.label || s.label, viz: a.viz !== undefined ? a.viz : s.svg, img: a.img !== undefined ? a.img : (cfg.imgs ? s.imgs.map(x => x.replace(/^assets\//, '')) : []), h: a.h, p: a.p, dl: a.dl, vcap: a.vcap || cfg.vcap, icap: a.icap || cfg.icap };
      }).filter((x, i) => !(cfg.skip || []).includes(i));
      m.outerHTML = tabsHtml({ title: cfg.title, items }, id, '');
    });
    bindTabs(root); reveal(root); lazySvg(root);
  };
  const initModules = (root, p) => $$('.mod-mount', root).forEach(el => { const m = MOD[el.dataset.mod]; if (m && m.init) { try { m.init(el, p, JSON.parse(el.dataset.opt || '{}')); } catch (err) { console.error(err); } } });

  /* =================================================================
     HOME
     ================================================================= */
  const home = () => {
    const main = $('#main');
    const feat = (H.reel || ['jingwai', 'rallylens', 'bronze', 'tennisatom', 'artemis', 'privacy-city']).map(byId).filter(Boolean);
    const s = id => S[id] || {};
    main.innerHTML = `
    <section class="open" id="top" aria-labelledby="name">
      <div class="open-top"><div class="swatch"><i></i><i></i><span>WB-PF26<br>PORTFOLIO 2023—2026</span></div><p class="mono" style="margin:0;text-align:right">${esc(H.place || 'SHANGHAI · TONGJI UNIV.')}<br>${projects.length} SCENES</p></div>
      <div class="open-stage">
        <div class="open-visual clip"><div class="frame bk">${feat.map((p, i) => `<img src="${src(s(p.id).key || p.cover)}" alt="" class="duo${i ? '' : ' on'}"${i ? ' loading="lazy"' : ' fetchpriority="high"'}>`).join('')}</div><p class="label"><b id="reel-no">01</b><span id="reel-name"></span></p></div>
        ${BRUSH}
        <h1 class="open-name" id="name">${chars('WENJING\nBIAN')}</h1>
        <div class="open-cols">
          <div class="c1 rv"><h2>${esc(H.c1h || '')}</h2><p>${esc(H.c1 || '')}</p></div>
          <div class="c2 rv" style="--d:.1s"><h2>${esc(H.c2h || '')}</h2><p>${esc(H.c2 || '')}</p></div>
          <div class="c3 rv" style="--d:.2s"><a class="btn" href="#scenes">${I('chev')} 开始观看</a><a class="btn line" href="downloads/Wenjing-Bian-CV.pdf" target="_blank" rel="noopener">简历 PDF ${I('ne')}</a></div>
        </div>
      </div>
      ${strip(['设计 · 研究 · 制作', 'DESIGN THROUGH MAKING'], ['卞文璟 / WENJING BIAN', '视觉传达设计 × 人工智能'], ['WB-26', 'SELECTED WORK'])}
    </section>

    <section class="sec" id="cast" aria-labelledby="cast-h">
      <div class="sec-title"><span class="no rv">00</span><h2 id="cast-h">${chars('Cast')}<small>人物介绍</small></h2><p class="side rv">${esc(H.castSide || '')}</p></div>
      <div class="cast">
        <figure class="cast-photo rv" style="margin:0"><div class="ph bk"><img class="duo" src="assets/applicant-portrait.webp" alt="卞文璟个人照片" loading="lazy"></div><span class="vname" aria-hidden="true">卞文璟</span><figcaption class="cv"><span>WENJING BIAN</span><span>DESIGNER / BUILDER</span></figcaption></figure>
        <div class="cast-text">
          <p class="cast-lead rv">${H.lead || ''}</p>
          <div class="cast-body rv">${(H.about || []).map(t => `<p>${md(t)}</p>`).join('')}</div>
          <dl class="facts rv">${(H.facts || []).map(([k, a, b]) => `<div><dt>${esc(k)}</dt><dd>${esc(a)}<span>${esc(b)}</span></dd></div>`).join('')}</dl>
        </div>
        <ol class="method">${(H.method || []).map(([k, en, t, d], i) => `<li class="rv" style="--d:${i * .08}s"><span class="k">${k}</span><span class="en">${pad(i + 1)} / ${en}</span><b>${esc(t)}</b><p>${esc(d)}</p></li>`).join('')}</ol>
        <div class="skills">${(H.skills || []).map((c, i) => `<article class="skill rv" style="--d:${i * .08}s"><span class="no">SKILL ${pad(i + 1)}</span><h3>${esc(c.en)}<small>${esc(c.cn)}</small></h3><p>${esc(c.text)}</p><div class="proof">${c.proof.map(byId).filter(Boolean).map(p => `<a href="${caseUrl(p.id)}" data-cut="${p.number}">${p.number} ${esc(p.name)}</a>`).join('')}</div></article>`).join('')}</div>
      </div>
    </section>

    <section class="sec" id="scenes" aria-labelledby="scenes-h" style="padding-bottom:0">
      <div class="sec-title"><span class="no rv">01</span><h2 id="scenes-h">${chars('Scenes')}<small>作品 · 按原顺序</small></h2><p class="side rv">${esc(H.scenesSide || '')}</p></div>
      <nav class="slate rv" aria-label="作品目录">${projects.map(p => `<a href="#scene-${p.id}"><span class="n">${p.number}</span><span class="t">${esc(p.name)}</span><span class="c">${esc(p.cn)}</span><span class="k">${esc(p.label)}</span><span class="y">${esc(p.year)}</span></a>`).join('')}</nav>
    </section>
    <div class="scenes">${projects.map(sceneCard).join('')}</div>

    <section class="sec" id="extras" aria-labelledby="ex-h">
      <div class="sec-title"><span class="no rv">02</span><h2 id="ex-h">${chars('Extras')}<small>研究协作</small></h2><p class="side rv">${esc(H.extrasSide || '')}</p></div>
      <div class="extras">${P.research.map((r, i) => `<article class="extra rv" style="--d:${i * .1}s"><span class="mono">NOTE ${pad(i + 1)} · ${esc(r.label)}</span><h3>${esc(r.title)}</h3><p>${esc((H.research || {})[r.title] || r.text)}</p></article>`).join('')}</div>
    </section>

    <footer class="credits" id="credits" aria-labelledby="cr-h">
      <div class="roll">
        <h2 id="cr-h">${chars('Thank you\nfor watching.')}</h2>
        ${(H.credits || []).map(([k, v]) => `<dl class="role rv"><dt>${esc(k)}</dt><dd>${md(v)}</dd></dl>`).join('')}
        <div class="contact rv">
          <div><p class="mono" style="margin:0 0 8px">MAIL</p><a class="big" href="mailto:2352970@tongji.edu.cn">2352970@tongji.edu.cn</a></div>
          <div><p class="mono" style="margin:0 0 8px">TEL</p><a class="big" href="tel:18912920069">189 1292 0069</a></div>
          <div><p class="mono" style="margin:0 0 8px">INTERNSHIP</p><p style="margin:0 0 14px;font-weight:700;line-height:1.6">${esc(H.avail || '')}</p><a class="btn" href="downloads/Wenjing-Bian-CV.pdf" target="_blank" rel="noopener">下载简历 ${I('ne')}</a></div>
        </div>
      </div>
      <div class="fin"><span>END · WB-PF26</span><span>© 卞文璟 2026</span><a href="#top" style="text-decoration:none">BACK TO TOP ↑</a></div>
    </footer>`;

    // reel on the opening
    const imgs = $$('.open-visual img'), no = $('#reel-no'), nm = $('#reel-name');
    let cur = 0;
    const show = i => { imgs.forEach((im, k) => im.classList.toggle('on', k === i)); no.textContent = feat[i].number; nm.textContent = `${feat[i].name} · ${feat[i].cn}`; };
    show(0); if (!reduce) setInterval(() => { cur = (cur + 1) % feat.length; show(cur); }, 3600);
    // nav highlight
    const links = $$('.nav-links a');
    if ('IntersectionObserver' in window) {
      const nio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === `#${e.target.id}`)); }), { rootMargin: '-45% 0px -50% 0px' });
      ['cast', 'scenes', 'extras', 'credits'].forEach(id => { const el = document.getElementById(id); el && nio.observe(el); });
    }
    reveal(document); onScroll();
  };

  /* glass-shard band between acts: deterministic per act, so the cut is the same on every visit */
  const shards = seed => {
    let s = String(seed).split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0;
    const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
    // a slash burst: thin slivers leaning the same way, densest around one focal point, like a PV cut
    const c = 260 + r() * 880, H = 120;
    const polys = Array.from({ length: 30 }, (_, k) => {
      const g = (r() + r() + r()) / 3 - .5, bx = c + g * 1500, w = k % 7 ? 3 + r() * 26 : 40 + r() * 70;
      const sk = 120 + r() * 160, top = r() < .35 ? r() * 50 : 0, bot = r() < .35 ? H - r() * 40 : H;
      const cls = k % 7 ? (k % 3 ? 's0' : 's1') : (k % 2 ? 's2' : 's3');
      const p = [[bx, bot], [bx + w, bot], [bx + w + sk * (1 - top / H), top], [bx + sk * (1 - top / H), top]];
      return `<polygon class="${cls}" points="${p.map(([x, y]) => `${x.toFixed(0)},${y.toFixed(0)}`).join(' ')}"/>`;
    }).join('');
    return `<div class="shards rv" aria-hidden="true"><svg viewBox="0 0 1400 ${H}" preserveAspectRatio="none"><line x1="0" y1="${(60 + r() * 30).toFixed(0)}" x2="1400" y2="${(40 + r() * 30).toFixed(0)}" class="hl"/>${polys}</svg></div>`;
  };
  const fileSpec = (p, m) => {
    if (!m) return '';
    const row = (k, v) => v ? `<div class="fs-row"><dt>${k}</dt><dd>${v}</dd></div>` : '';
    const src2 = n => (/\.\w{3,4}$/.test(n) ? `assets/${n}` : `assets/${n}.webp`);
    return `<section class="filespec rv" aria-label="项目档案">
      <header class="fs-head"><span>FILE SPEC</span><b>SC-${p.number} · ${esc(p.name.toUpperCase())}</b><span class="fs-code">${esc(p.year)} ▲ ${esc(p.label)}</span></header>
      <dl>
        ${row('分析单位<small>UNIT</small>', esc(m.unit))}
        ${row('样本<small>SAMPLE</small>', esc(m.sample))}
        ${row('测量<small>MEASURES</small>', (m.measures || []).map(x => `<span class="chip">${esc(x)}</span>`).join(''))}
        ${row('原始材料<small>SOURCES</small>', (m.sources || []).map(([tt, a]) => `<button type="button" data-lb="${esc(src2(a))}" class="fs-src">${esc(tt)} ${I('ne')}</button>`).join(''))}
        ${row('局限<small>LIMIT</small>', esc(m.limit))}
        ${row('待检验<small>OPEN</small>', esc(m.open))}
        ${m.credit ? row(`${esc(m.credit[0])}<small>CREDIT</small>`, esc(m.credit[1])) : ''}
      </dl>
      <footer class="fs-foot"><span>ROLE ▸ ${esc(p.role)}</span><span>STATUS ▸ ${esc(p.status)}</span></footer>
    </section>`;
  };
  const strip = (a, b, c) => `<div class="strip rv" aria-hidden="true"><span class="x"></span><span><b>${esc(a[0])}</b>${esc(a[1])}</span><span>${esc(b[0])}<br>${esc(b[1])}</span><span class="st"></span><span class="code">${esc(c[0])}<small>${esc(c[1])}</small></span><span class="gl">${I('globe')}</span></div>`;

  const sceneCard = p => {
    const s = S[p.id] || {}, h = s.home || {};
    const cjk = /[一-鿿]/.test(p.name);
    const thumbs = (h.thumbs || []).slice(0, 2);
    const mo = window.THEMES && s.theme && THEMES.MOTIF[s.theme] ? `<div class="motif" aria-hidden="true">${THEMES.MOTIF[s.theme]()}</div>` : '';
    return `<article class="scene t-${s.theme || ''}" id="scene-${p.id}" style="--c:${p.color}" aria-labelledby="st-${p.id}">
      <div class="scene-top"><div class="swatch"><i></i><i></i><span>SCENE ${p.number} / ${pad(projects.length)}<br>${esc(p.label)}</span></div><span class="mono">${esc(p.year)}</span></div>
      <div class="scene-body">
        <a class="scene-media" href="${caseUrl(p.id)}" data-cut="${p.number}" aria-label="打开 ${esc(p.name)}"><div class="ph bk"><img class="duo${s.contain ? ' contain' : ''}" src="${src(s.key || p.cover)}" alt="${esc(p.coverAlt || '')}" loading="lazy"></div>${mo}${thumbs.length ? `<div class="thumbs">${thumbs.map(t => `<img src="${src(t)}" alt="" loading="lazy">`).join('')}</div>` : ''}</a>
        <div class="scene-info">
          <span class="scene-no">${p.number}</span>
          <h3 class="scene-title${cjk ? ' cjk' : ''}" id="st-${p.id}">${esc(p.name)}</h3>
          <p class="scene-sub">${esc(p.cn)}</p>
          <p class="scene-tag">${esc(h.tag || '')}</p>
          <dl class="qar">
            <div><dt>問<small>PROBLEM</small></dt><dd>${esc(s.logline?.q || '')}</dd></div>
            <div><dt>做<small>MY PART</small></dt><dd>${esc(s.logline?.a || '')}</dd></div>
            <div><dt>果<small>RESULT</small></dt><dd>${esc(s.logline?.r || '')}</dd></div>
          </dl>
        </div>
      </div>
      <div class="scene-foot"><div class="scene-links">${(h.jump || []).map(([t, a], i) => `<a href="${caseUrl(p.id)}#${a}" data-cut="${p.number}"><b>${pad(i + 1)}</b>${esc(t)}</a>`).join('')}<a href="${caseUrl(p.id)}" data-cut="${p.number}"><b>→</b>进入完整项目</a></div><span class="mono">${esc(h.tools || '')}</span></div>
    </article>`;
  };

  /* =================================================================
     CASE
     ================================================================= */
  const kase = async () => {
    const id = new URLSearchParams(location.search).get('project');
    const p = byId(id) || projects[0], s = S[p.id] || {};
    const i = projects.indexOf(p), prev = projects[(i - 1 + projects.length) % projects.length], next = projects[(i + 1) % projects.length];
    document.title = `${p.number} ${p.name} — 卞文璟作品集`;
    const md0 = $('meta[name=description]'); if (md0 && p.summary) md0.setAttribute('content', `${p.name} · ${p.cn}：${p.summary}`);
    $('.nav-scene b') && ($('.nav-scene b').textContent = `SCENE ${p.number} / ${pad(projects.length)}`);
    const cjk = /[一-鿿]/.test(p.name);
    const acts = s.acts || [];
    figNo = 0;
    const main = $('#main');
    const TH = window.THEMES || {}, theme = s.theme;
    if (theme) document.body.classList.add(`t-${theme}`);
    const custom = theme && TH.TC && TH.TC[theme] ? `<section class="title-card tc-${theme}" aria-labelledby="tc-name">${TH.TC[theme](p, s, pad(projects.length))}${strip([p.label, ''], [s.stripB || p.role, ''], [`SC-${p.number}`, p.year])}</section>` : '';
    main.innerHTML = `
      ${custom || `<section class="title-card" aria-labelledby="tc-name">
        <div class="tc-top"><a class="mono" href="index.html#scene-${p.id}" data-cut="INDEX">← INDEX / 作品目录</a><div class="swatch"><i style="background:${p.color}"></i><i></i><span>SCENE ${p.number} / ${pad(projects.length)}<br>${esc(p.label)}</span></div></div>
        <div class="tc-stage">
          <span class="tc-no rv">${p.number}</span>
          <figure class="tc-visual clip" style="margin:0"><div class="ph bk"><img class="duo${s.contain ? ' contain' : ''}" src="${src(s.key || p.cover)}" alt="${esc(p.coverAlt || '')}" fetchpriority="high"></div><figcaption class="cap">${esc(s.keyCap || p.coverAlt || '')}</figcaption></figure>
          <h1 class="tc-name${cjk ? ' cjk' : ''}" id="tc-name">${chars(s.titleBreak || p.name)}</h1>
        </div>
        <div class="tc-cols">
          <p class="sub rv">${esc(s.sub || p.cn)}</p>
          <dl class="rv">${(s.meta || [['YEAR', p.year], ['FORMAT', p.status], ['ROLE', p.role, 1]]).map(([k, v, w]) => `<div${w ? ' class="wide"' : ''}><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        </div>
        ${strip([p.label, ''], [s.stripB || p.role, ''], [`SC-${p.number}`, p.year])}
      </section>`}
      <section class="logline" aria-label="项目摘要">
        <div class="grid">
          <div class="it rv"><div class="k"><b>問</b><span>PROBLEM</span></div><p>${md(s.logline?.q || '')}</p></div>
          <div class="it rv" style="--d:.1s"><div class="k"><b>做</b><span>MY PART</span></div><p>${md(s.logline?.a || '')}</p></div>
          <div class="it rv" style="--d:.2s"><div class="k"><b>果</b><span>RESULT</span></div><p>${md(s.logline?.r || '')}</p></div>
        </div>
        ${(s.stats || p.metrics || []).length ? `<div class="stats rv">${(s.stats || p.metrics).map(([v, l]) => `<div class="stat"><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join('')}</div>` : ''}
      </section>
      <div class="case">
        <nav class="toc" aria-label="本页段落"><p>SEQUENCE</p>${acts.map((a, k) => `<a href="#${a.id || 'act-' + (k + 1)}"><b>${pad(k + 1)}</b><span>${esc(a.toc || a.kicker || a.title)}</span></a>`).join('')}<a href="#end"><b>${pad(acts.length + 1)}</b><span>交付与下一步</span></a></nav>
        <div class="acts">
          ${acts.map((a, k) => {
            const f0 = figNo + 1, body = (a.blocks || []).map(b => block(b, p.id)).join(''), f1 = figNo;
            const mods = (a.blocks || []).filter(b => b.module || b.snap || b.tabs || b.player).length;
            const words = (a.title + (a.lead || '') + JSON.stringify(a.blocks || []).replace(/"[a-z]+":|[\[\]{}",]/g, '')).replace(/\s/g, '').length;
            const script = (String(a.kicker || '').split('/').map(x => x.trim()).find(x => /[A-Za-z]{3}/.test(x)) || '').toLowerCase();
            const hud = [`SC-${p.number}`, `ACT ${pad(k + 1)}/${pad(acts.length)}`, f1 >= f0 ? `FIG ${pad(f0)}${f1 > f0 ? '—' + pad(f1) : ''}` : 'TEXT', mods ? `${mods} INTERACTIVE` : 'STATIC', `READ ≈ ${Math.max(1, Math.round(words / 450))} MIN`];
            return `${k ? shards(p.number + k) : ''}<section class="act" id="${a.id || 'act-' + (k + 1)}">
            <header class="cut"><span class="no rv">${pad(k + 1)}</span><div class="head"><p class="kicker rv">${esc(a.kicker || '')}</p><h2>${chars(a.title)}</h2></div>${a.lead ? `<p class="lead rv">${md(a.lead)}</p>` : ''}${script ? `<span class="script" style="--fs:${Math.min(1, 6 / script.length).toFixed(2)}" aria-hidden="true">${esc(script)}</span>` : ''}<p class="hud rv" aria-hidden="true">${hud.map(h => `<span>${esc(h)}</span>`).join('<i>▲</i>')}</p></header>
            <div class="blocks">${body}</div>
          </section>`;
          }).join('')}
          <section class="act" id="end">
            <header class="cut"><span class="no rv">${pad(acts.length + 1)}</span><div class="head"><p class="kicker rv">CREDITS / 交付</p><h2>${chars(s.endTitle || '交付了什么，下一步做什么')}</h2></div></header>
            <div class="endcard">
              <div class="done rv"><h3>DELIVERED</h3><ul>${(s.done || p.outcomes || []).map(o => `<li>${md(o)}</li>`).join('')}</ul></div>
              <div class="next rv"><h3>NEXT</h3><p>${md(s.next || p.reflection || '')}</p></div>
              ${fileSpec(p, (window.META || {})[p.id])}
              ${s.bound ? `<p class="note bound rv">${md(s.bound)}</p>` : ''}
              <div class="links rv">${[...(s.links || []), ...(p.links || []).filter(([, u]) => !(s.links || []).some(l => l[1] === u))].map(([t, u, k]) => `<a class="btn${k ? ' ' + k : ' line'}" href="${esc(u)}"${/^https?:|\.pdf$|demos\//.test(u) ? ' target="_blank" rel="noopener"' : ''}>${esc(t)} ${I('ne')}</a>`).join('')}</div>
            </div>
          </section>
        </div>
      </div>
      <nav class="trailer" aria-label="上一场与下一场">
        <a href="${caseUrl(prev.id)}" data-cut="${prev.number}"><span class="mono">← PREV SCENE ${prev.number}</span><b>${esc(prev.name)}</b><small>${esc(prev.cn)}</small><img src="${src((S[prev.id] || {}).key || prev.cover)}" alt="" loading="lazy"></a>
        <a href="${caseUrl(next.id)}" data-cut="${next.number}"><span class="mono">NEXT SCENE ${next.number} →</span><b>${esc(next.name)}</b><small>${esc(next.cn)}</small><img src="${src((S[next.id] || {}).key || next.cover)}" alt="" loading="lazy"></a>
      </nav>`;
    bindTabs(main); bindPlayers(main); initModules(main, p); lightbox();
    if (theme && TH.AFTER && TH.AFTER[theme]) { try { TH.AFTER[theme](main); } catch (e) { console.error(e); } }
    await mountSnaps(main, p.id);
    reveal(main); lazySvg(main); onScroll();
    if (location.hash) { const t = document.getElementById(location.hash.slice(1)); t && setTimeout(() => t.scrollIntoView(), 50); }
    const tl = $$('.toc a');
    if ('IntersectionObserver' in window) {
      const tio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) tl.forEach(a => a.classList.toggle('on', a.getAttribute('href') === `#${e.target.id}`)); }), { rootMargin: '-40% 0px -55% 0px' });
      $$('.act').forEach(a => tio.observe(a));
    }
  };

  /* reserve each image's box from its recorded pixel size, so the page doesn't jump while loading */
  const SIZES = window.IMG_SIZES || {};
  const sizeImg = im => {
    if (im.hasAttribute('width')) return;
    const a = im.getAttribute('src'); if (!a) return;
    let k; try { k = decodeURI(new URL(a, location.href).pathname).replace(/^.*?(?=(assets|media|demos)\/)/, ''); } catch (e) { return; }
    const s = SIZES[k]; if (s) { im.setAttribute('width', s[0]); im.setAttribute('height', s[1]); }
  };
  const sizeAll = root => $$('img', root).forEach(sizeImg);
  sizeAll(document);
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType !== 1) return; n.tagName === 'IMG' ? sizeImg(n) : sizeAll(n); })))
    .observe(document.body, { childList: true, subtree: true });

  if (document.body.dataset.page === 'case') kase(); else home();
})();
