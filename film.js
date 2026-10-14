/* COBALT FILE — renderer. Home = a film in five parts; case = one scene cut into PV posters. */
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
  const rng = seed => { let s = String(seed).split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7); return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
  const ascii = c => c >= ' ' && c <= '~';
  const A = window.ART || {};
  /* the WB monogram replaces the plain square in the nav */
  const navI = document.querySelector('.nav-mark i'); if (navI && A.logo) navI.outerHTML = A.logo('nav-logo');

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
  const reveal = root => $$('.rv,.clip,.chars,.part', root).forEach(el => (io ? io.observe(el) : el.classList.add('in')));
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
      // fold any saturated non-blue colour (orange, red, green, pink…) into the blue palette at the same lightness;
      // bespoke pages keep every figure in its original colours
      const raw = document.body.classList.contains('pg');
      if (!raw) t = t.replace(/#([0-9a-f]{6}|[0-9a-f]{3})\b/gi, (m, h) => {
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
      if (!raw && (t.includes('href="assets/refinement/') || t.includes('href="assets/composition/tennis-'))) el.classList.add('duo-img');
      const s = $('svg', el); if (s) { s.removeAttribute('width'); s.removeAttribute('height'); s.setAttribute('role', 'img'); }
    } catch (e) { el.textContent = '图表加载失败'; }
  };
  let svgSeq = 0;
  const lazySvg = root => $$('[data-svg]', root).forEach(el => (svgIO ? svgIO.observe(el) : loadSvg(el)));

  /* ---------- 3D stages: three.js loads only when a stage comes near ---------- */
  const stageIO = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; stageIO.unobserve(e.target);
    import('./stage.js?v=20261013').then(m => m.mount(e.target, e.target.dataset.stage, JSON.parse(e.target.dataset.opt || '{}'))).catch(err => { console.error(err); e.target.classList.add('st-fail'); const t=e.target.querySelector('.st-load');if(t)t.textContent='空间视图加载失败，本节图解和交互说明仍可阅读。'; });
  }), { rootMargin: '300px 0px' }) : null;
  const stageEl = (name, opt = {}, label = '') => `<div class="stage st-${name}" data-stage="${name}" data-opt='${esc(JSON.stringify(opt))}'><div class="st-canvas"></div><div class="st-ui"></div><p class="st-load mono">${esc(label || '3D')} · LOADING</p></div>`;
  const mountStages = root => $$('[data-stage]', root).forEach(el => stageIO && stageIO.observe(el));

  /* ---------- lightbox ---------- */
  const lightbox = () => {
    const lb = $('#lb'); if (!lb || !lb.showModal) return;
    document.addEventListener('click', e => {
      const sb = e.target.closest('[data-lb]');
      if (sb) { $('img', lb).src = sb.dataset.lb; $('img', lb).alt = sb.textContent.trim(); $('p', lb).textContent = sb.textContent.trim(); lb.showModal(); return; }
      const im = e.target.closest('.fig .ph img, .frame .fr-img img, .rl-f img'); if (!im) return;
      $('img', lb).src = im.currentSrc || im.src; $('img', lb).alt = im.alt; $('p', lb).textContent = im.alt; lb.showModal();
    });
    lb.addEventListener('click', e => { if (e.target === lb || e.target.tagName === 'BUTTON') lb.close(); });
  };

  /* =================================================================
     BLOCKS
     ================================================================= */
  let figNo = 0, cueNo = 0, actNo = 0;
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

  /* lyric chunks: 'text|size|v@x,y' — size xs/s/m/l/xl, v = vertical, @x,y = position in % of the frame */
  const LYR_AUTO = [[4, 6], [38, 26], [12, 52], [58, 60], [26, 80], [70, 14]];
  const lyricWords = words => words.map((w, i) => {
    const [body, pos] = String(w).split('@'), [t, size = 'm', v] = body.split('|');
    const [x, y] = pos ? pos.split(',').map(Number) : LYR_AUTO[i % LYR_AUTO.length];
    return `<span class="ly s-${size}${v === 'v' ? ' v' : ''}" style="left:${x}%;top:${y}%;--d:${(i * .14).toFixed(2)}s">${esc(t)}</span>`;
  }).join('');

  const block = (b, id) => {
    if (b.numeral) return `<div class="numeral rv${b.side === 'r' ? ' r' : ''}${span(b)}"><b class="nm" aria-hidden="true">${esc(b.numeral)}${b.unit ? `<small>${esc(b.unit)}</small>` : ''}</b><div class="nm-t"><p class="nm-l"><span class="sr">${esc(b.numeral)} ${esc(b.unit || '')}</span>${esc(b.label || '')}</p>${b.text ? `<p>${md(b.text)}</p>` : ''}${b.from ? `<p class="nm-src">${esc(b.from)}</p>` : ''}</div></div>`;
    if (b.text) return `<div class="b-text rv${b.side === 'r' ? ' r' : ''}${span(b)}">${b.h ? `<h3>${esc(b.h)}</h3>` : ''}${[].concat(b.text).map(t => `<p>${md(t)}</p>`).join('')}</div>`;
    if (b.sub) { cueNo++; return `<h3 class="b-sub rv${span(b)}"><i>CUE ${pad(actNo)}-${cueNo}</i><span>${esc(b.sub)}</span></h3>`; }
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
    /* ---- PV frames ---- */
    if (b.frame) {
      const f = b.frame; figNo++;
      return `<figure class="frame rv ${f.side || 'l'}${f.tone ? ' ' + f.tone : ''}${span(b)}"><div class="fr-img${f.duo ? ' duo' : ''}"><img src="${src(f.img)}" alt="${esc(b.cap || f.title || '')}" loading="lazy"${f.pos ? ` style="object-position:${f.pos}"` : ''}></div>${f.title ? `<p class="fr-t">${md(f.title)}</p>` : ''}${f.v ? `<p class="fr-v" aria-hidden="true">${esc(f.v)}</p>` : ''}${f.num ? `<b class="fr-n" aria-hidden="true">${esc(f.num)}</b>` : ''}${f.script ? `<span class="fr-s" aria-hidden="true">${esc(f.script)}</span>` : ''}${b.cap ? `<figcaption><b>FIG.${pad(figNo)}</b><span>${md(b.cap)}</span></figcaption>` : ''}</figure>`;
    }
    if (b.lyric) return `<div class="lyric rv${b.dark ? ' dark' : ''}${span(b)}" style="--h:${b.h || 520}px">${b.img ? `<img class="ly-bg" src="${src(b.img)}" alt="" loading="lazy">` : ''}<p class="sr">${esc(b.lyric.map(w => String(w).split(/[|@]/)[0]).join(''))}</p><div class="ly-w" aria-hidden="true">${lyricWords(b.lyric)}</div>${b.who ? `<p class="ly-who">${md(b.who)}</p>` : ''}</div>`;
    if (b.reel) return `<div class="reel rv${span(b)}" data-reel><div class="rl-head"><b>${esc(b.title || '')}</b><span class="mono">${b.reel.length} FRAMES · DRAG ⟷</span></div><div class="rl-track" tabindex="0">${b.reel.map(([n, tc, l]) => { figNo++; return `<figure class="rl-f"><div class="ph"><img src="${src(n)}" alt="${esc(l || tc || '')}" loading="lazy"></div><figcaption><b>${esc(tc || 'FIG.' + pad(figNo))}</b><span>${esc(l || '')}</span></figcaption></figure>`; }).join('')}</div></div>`;
    if (b.spec) {
      const s = b.spec;
      return `<div class="spec rv${span(b)}"><header class="sp-h"><span class="sp-code">${esc(s.code || '')}</span><b>${esc(s.title || '')}</b><span>${esc(s.sub || '')}</span></header><div class="sp-body"><div class="sp-obj">${s.stage ? stageEl(s.stage, s.opt || {}, s.title) : `<img src="${src(s.img)}" alt="${esc(s.title || '')}" loading="lazy">`}${(s.callouts || []).map(([x, y, t, d]) => `<span class="co ${d || 'r'}" style="left:${x}%;top:${y}%"><i></i><em>${esc(t)}</em></span>`).join('')}</div><dl class="sp-rows">${(s.rows || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${md(v)}</dd></div>`).join('')}</dl></div>${s.foot ? `<footer class="sp-foot"><i class="bars" aria-hidden="true"></i><span>${md(s.foot)}</span></footer>` : ''}</div>`;
    }
    if (b.chart && window.VZ) { figNo++; return `<div class="rv${span(b)}">${VZ.html(b.chart, b.cap ? md(b.cap) : '', pad(figNo))}</div>`; }
    if (b.charts && window.VZ) return `<div class="rv${span(b)}">${VZ.tabs(b.charts, md)}</div>`;
    if (b.stage) return `<div class="stage-wrap rv${span(b)}">${stageEl(b.stage, b.opt || {}, b.label)}${b.cap ? `<p class="st-cap">${md(b.cap)}</p>` : ''}</div>`;
    return '';
  };
  /* optional placement: at:'3-11' (grid columns), lift:6 (pull up, vw), tilt:-2 (deg) */
  const placed = (b, id) => {
    const h = block(b, id); if (!h || !(b.at || b.lift || b.tilt || b.push)) return h;
    const st = [b.at ? `grid-column:${b.at.replace('-', '/')}` : '', b.lift ? `margin-top:${-b.lift}vw` : '', b.push ? `margin-top:${b.push}vw` : '', b.tilt ? `--tilt:${b.tilt}deg` : ''].filter(Boolean).join(';');
    return `<div class="slot${b.tilt ? ' tilt' : ''}" style="${st}">${h}</div>`;
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
  /* film reels: drag to scrub */
  const bindReels = root => $$('[data-reel] .rl-track', root).forEach(t => {
    let x0 = 0, s0 = 0, down = false, moved = 0;
    t.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; x0 = e.clientX; s0 = t.scrollLeft; t.classList.add('drag'); });
    addEventListener('pointermove', e => { if (!down) return; moved = Math.abs(e.clientX - x0); t.scrollLeft = s0 - (e.clientX - x0); });
    addEventListener('pointerup', () => { down = false; t.classList.remove('drag'); });
    t.addEventListener('click', e => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
  });
  /* format chrome: windows fold, the handscroll drags sideways */
  const bindFormats = root => {
    if (document.body.classList.contains('f-baseball')) $$('.act-v span', root).forEach(s => { const w = s.textContent; s.textContent = Array(10).fill(`${w} · STATCAST · 2024-03-20 — 2026-04-14 · YAMAMOTO 18 · OHTANI 17`).join('  ▲  '); });
    $$('.win-x', root).forEach(b => b.addEventListener('click', () => { const w = b.closest('.part'); w.classList.toggle('min'); b.textContent = w.classList.contains('min') ? '+' : '—'; }));
    $$('.f-bronze .act .parts', document).forEach(t => {
      t.classList.add('hscroll'); t.setAttribute('tabindex', '0');
      let x0 = 0, s0 = 0, down = false, moved = 0;
      t.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.target.closest('video,button,input,a,[role=tab]')) return; down = true; moved = 0; x0 = e.clientX; s0 = t.scrollLeft; });
      addEventListener('pointermove', e => { if (!down) return; moved = Math.abs(e.clientX - x0); if (moved > 4) t.classList.add('drag'); t.scrollLeft = s0 - (e.clientX - x0); });
      addEventListener('pointerup', () => { down = false; t.classList.remove('drag'); });
      t.addEventListener('click', e => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
      const nav = document.createElement('div'); nav.className = 'hs-nav'; nav.innerHTML = '<button type="button" aria-label="往回看">→</button><span class="mono">长卷 · 拖动或滑动</span><button type="button" aria-label="往下看">←</button>';
      t.before(nav); const [b1, , b2] = nav.children;
      b1.addEventListener('click', () => t.scrollBy({ left: t.clientWidth * .8, behavior: 'smooth' }));
      b2.addEventListener('click', () => t.scrollBy({ left: -t.clientWidth * .8, behavior: 'smooth' }));
    });
  };
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
      <div class="open-top"><div class="swatch"><i></i><i></i><span>WB-PF26<br>PORTFOLIO 2023—2026</span></div><p class="mono" style="margin:0;text-align:right">${esc(H.place || 'SHANGHAI · TONGJI UNIV.')}<br>${projects.length} SCENES<br><a class="open-title" href="index.html?title=1" data-cut="TITLE">◂ TITLE SCREEN</a></p></div>
      <div class="open-stage">
        <div class="open-visual clip"><div class="frame bk">${feat.map((p, i) => `<img src="${src(s(p.id).key || p.cover)}" alt="" class="duo${i ? '' : ' on'}"${i ? ' loading="lazy"' : ' fetchpriority="high"'}>`).join('')}</div><p class="label"><b id="reel-no">01</b><span id="reel-name"></span></p><span class="open-script" aria-hidden="true">selected works</span></div>
        ${BRUSH}
        <h1 class="open-name" id="name">${chars('WENJING\nBIAN')}</h1>
        <div class="open-cols">
          ${H.c1h ? `<div class="c1 rv"><h2>${esc(H.c1h)}</h2><p>${esc(H.c1 || '')}</p></div>` : ''}
          <div class="c2 rv" style="--d:.1s"><h2>${esc(H.c2h || '')}</h2><p>${esc(H.c2 || '')}</p></div>
          <div class="c3 rv" style="--d:.2s"><a class="btn" href="#scenes">${I('chev')} 开始观看</a><a class="btn line" href="downloads/Wenjing-Bian-CV.pdf" target="_blank" rel="noopener">简历 · 产品 ${I('ne')}</a><a class="btn line" href="downloads/Wenjing-Bian-CV-Game.pdf" target="_blank" rel="noopener">简历 · 游戏策划 ${I('ne')}</a></div>
        </div>
      </div>
      ${strip(['设计 · 研究 · 制作', 'DESIGN THROUGH MAKING'], ['卞文璟 / WENJING BIAN', '视觉传达设计 × 人工智能'], ['WB-26', 'SELECTED WORK'])}
    </section>
    <div class="tk-wrap" aria-hidden="true">
      <div class="tk tk-a"><div class="tk-in">${[0, 1].map(() => projects.map(p => `<span><b>${p.number}</b>${esc(p.name)}</span>`).join('')).join('')}</div></div>
      <div class="tk tk-b"><div class="tk-in">${[0, 1].map(() => projects.map(p => `<span>${esc(p.cn)}</span>`).join('')).join('')}</div></div>
    </div>


    <section class="sec" id="cast" aria-labelledby="cast-h">
      <div class="sec-title"><span class="no rv">00</span><h2 id="cast-h">${chars('Cast')}<small>人物介绍</small></h2><i class="sec-script" aria-hidden="true">who</i><p class="side rv">${esc(H.castSide || '')}</p></div>
      <div class="cast">
        <figure class="cast-photo rv" style="margin:0"><div class="ph bk"><img class="duo" src="assets/applicant-portrait.webp" alt="卞文璟个人照片" loading="lazy"></div><span class="vname" aria-hidden="true">卞文璟</span><figcaption class="cv"><span>WENJING BIAN</span><span>DESIGNER / BUILDER</span></figcaption></figure>
        <div class="cast-text">
          <p class="cast-lead rv">${H.lead || ''}</p>
          <div class="cast-body rv">${(H.about || []).map(t => `<p>${md(t)}</p>`).join('')}</div>
          <dl class="facts rv">${(H.facts || []).map(([k, a, b]) => `<div><dt>${esc(k)}</dt><dd>${esc(a)}<span>${esc(b)}</span></dd></div>`).join('')}</dl>
        </div>
        ${H.way ? `<div class="way rv"><p class="way-k mono">HOW I WORK · 工作方式</p><div class="way-t">${[].concat(H.way).map(t => `<p>${md(t)}</p>`).join('')}</div></div>` : `<ol class="method">${(H.method || []).map(([k, en, t, d], i) => `<li class="rv" style="--d:${i * .08}s"><span class="k">${k}</span><span class="en">${pad(i + 1)} / ${en}</span><b>${esc(t)}</b><p>${esc(d)}</p></li>`).join('')}</ol>`}
        <div class="skills">${(H.skills || []).map((c, i) => `<article class="skill rv" style="--d:${i * .08}s"><span class="no">SKILL ${pad(i + 1)}</span><h3>${esc(c.en)}<small>${esc(c.cn)}</small></h3><p>${esc(c.text)}</p><div class="proof">${c.proof.map(byId).filter(Boolean).map(p => `<a href="${caseUrl(p.id)}" data-cut="${p.number}">${p.number} ${esc(p.name)}</a>`).join('')}</div></article>`).join('')}</div>
      </div>
    </section>

    <section class="sec" id="scenes" aria-labelledby="scenes-h" style="padding-bottom:0">
      <div class="sec-title"><span class="no rv">01</span><h2 id="scenes-h">${chars('Scenes')}<small>作品</small></h2><i class="sec-script" aria-hidden="true">eleven cuts</i><p class="side rv">${esc(H.scenesSide || '')}</p></div>
      <nav class="slate rv" aria-label="作品目录">${projects.map(p => `<a href="#scene-${p.id}" data-pv="${p.id}" style="--c:${(H.accent || {})[p.id] || p.color}"><span class="n">${p.number}</span><span class="t">${esc(p.name)}</span><span class="c">${esc(p.cn)}</span><span class="k">${esc(p.label)}</span><span class="y">${esc(p.year)}</span></a>`).join('')}</nav>
    </section>
    <div class="scenes">${projects.map(sceneCard).join('')}</div>

    <section class="sec" id="extras" aria-labelledby="ex-h">
      <div class="sec-title"><span class="no rv">02</span><h2 id="ex-h">${chars('Extras')}<small>研究协作</small></h2><i class="sec-script" aria-hidden="true">side notes</i><p class="side rv">${esc(H.extrasSide || '')}</p></div>
      <div class="extras">${P.research.map((r, i) => `<article class="extra rv" style="--d:${i * .1}s"><b class="ex-no" aria-hidden="true">${pad(i + 1)}</b><span class="mono">NOTE ${pad(i + 1)} · ${esc(r.label)}</span><h3>${esc(r.title)}</h3><p>${esc((H.research || {})[r.title] || r.text)}</p></article>`).join('')}</div>
    </section>

    <footer class="credits" id="credits" aria-labelledby="cr-h">
      <div class="roll">
        <h2 id="cr-h">${chars('Thank you\nfor watching.')}</h2>
        ${(H.credits || []).map(([k, v]) => `<dl class="role rv"><dt>${esc(k)}</dt><dd>${md(v)}</dd></dl>`).join('')}
        <div class="contact rv">
          <div><p class="mono" style="margin:0 0 8px">MAIL</p><a class="big" href="mailto:2352970@tongji.edu.cn">2352970@tongji.edu.cn</a></div>
          <div><p class="mono" style="margin:0 0 8px">INTERNSHIP</p><p style="margin:0 0 14px;font-weight:700;line-height:1.6">${esc(H.avail || '')}</p><a class="btn" href="downloads/Wenjing-Bian-CV.pdf" target="_blank" rel="noopener">产品简历 ${I('ne')}</a> <a class="btn line" href="downloads/Wenjing-Bian-CV-Game.pdf" target="_blank" rel="noopener">游戏策划简历 ${I('ne')}</a></div>
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

  /* P3R slash: a torn band that carries a title. Same seed, same cut, every visit. */
  const slashSvg = seed => {
    const r = rng(seed), W = 1600, H2 = 380, tilt = 120, n = 22;
    const c = x => H2 / 2 + tilt * (.5 - x / W);
    const band = (th, off, jag) => {
      const top = [], bot = [];
      for (let i = 0; i <= n; i++) {
        const x = i / n * W, t = th * Math.pow(Math.sin(Math.PI * (.04 + .92 * i / n)), .55);
        top.push([x + (r() - .5) * 30, c(x) - t / 2 + off + (i % 2 ? -1 : 1) * jag * r()]);
        bot.push([x + (r() - .5) * 30, c(x) + t / 2 + off + (i % 2 ? 1 : -1) * jag * r()]);
      }
      return [...top, ...bot.reverse()].map(([x, y]) => `${x.toFixed(0)},${y.toFixed(0)}`).join(' ');
    };
    const bits = Array.from({ length: 9 }, () => { const x = r() < .5 ? r() * 260 : W - r() * 260, y = c(x) + (r() - .5) * 220, s = 14 + r() * 40, a = r() * 6.28; return `<polygon class="sb" points="${[0, 2.2, 4.1].map(k => `${(x + s * Math.cos(a + k)).toFixed(0)},${(y + s * .5 * Math.sin(a + k)).toFixed(0)}`).join(' ')}"/>`; }).join('');
    return `<svg class="sl-svg" viewBox="0 0 ${W} ${H2}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><polygon class="s-blue" points="${band(250, 26, 34)}"/><polygon class="s-ink" points="${band(210, 0, 26)}"/><polygon class="s-hi" points="${band(14, -78, 6)}"/>${bits}</svg>`;
  };

  /* act openings — every act opens with a different PV composition */
  const openHtml = (a, k, p) => {
    const o = a.open || {}, t = o.t || 'slash', no = pad(k + 1), kick = esc(a.kicker || ''), lead = a.lead ? md(a.lead) : '';
    const img = (n, cls = '', alt = '') => `<img class="${cls}" src="${src(n)}" alt="${esc(alt || o.cap || '')}" loading="lazy"${o.pos ? ` style="object-position:${o.pos}"` : ''}>`;
    const foot = `<div class="op-foot"><span class="op-no">${no}</span><p class="kicker">${A.emblem ? A.emblem(p.id, 'op-em') : ''}${kick}</p>${lead ? `<p class="op-lead">${lead}</p>` : ''}</div>`;
    switch (t) {
      case 'over': return `<header class="aopen o-over${o.dark ? ' dark' : ''}"><figure class="oo-img clip">${img(o.img, o.duo ? 'duo' : '')}${o.cap ? `<figcaption class="mono">${esc(o.cap)}</figcaption>` : ''}</figure>${o.script ? `<span class="oo-script" aria-hidden="true">${esc(o.script)}</span>` : ''}<h2 class="oo-title">${chars(a.title)}</h2>${foot}</header>`;
      case 'rail': return `<header class="aopen o-rail${o.flip ? ' flip' : ''}"><figure class="or-img clip">${img(o.img, o.duo ? 'duo' : '')}${o.cap ? `<figcaption class="mono">${esc(o.cap)}</figcaption>` : ''}</figure><h2 class="or-title">${chars(a.title)}</h2>${o.v ? `<p class="or-v" aria-hidden="true">${esc(o.v)}</p>` : ''}${foot}</header>`;
      case 'num': return `<header class="aopen o-num">${A.burst ? `<span class="on-burst" aria-hidden="true">${A.burst(p.number + a.id)}</span>` : ''}<b class="on-n" aria-hidden="true">${esc(o.num)}${o.unit ? `<small>${esc(o.unit)}</small>` : ''}</b>${o.label ? `<p class="on-l mono">${esc(o.label)}</p>` : ''}<h2 class="on-title">${chars(a.title)}</h2>${foot}</header>`;
      case 'lyric': return `<header class="aopen o-lyric rv${o.img ? ' has-img' : ''}">${o.img ? img(o.img, 'ol-bg' + (o.duo ? ' duo' : '')) : ''}<h2 class="sr">${esc(a.title)}</h2><div class="ly-w" aria-hidden="true">${lyricWords(o.words || [a.title])}</div>${foot}</header>`;
      case 'split': return `<header class="aopen o-split"><figure class="osp a clip">${img(o.a, 'duo', o.capA)}<figcaption class="mono">${esc(o.capA || '')}</figcaption></figure><figure class="osp b clip">${img(o.b, 'duo', o.capB)}<figcaption class="mono">${esc(o.capB || '')}</figcaption></figure><i class="osp-g o" aria-hidden="true"></i><i class="osp-g s" aria-hidden="true"></i><h2 class="osp-title">${chars(a.title)}</h2>${foot}</header>`;
      case 'stage': return `<header class="aopen o-stage">${stageEl(o.stage, o.opt || {}, o.label)}<div class="ost-over"><span class="op-no">${no}</span><p class="kicker">${kick}</p><h2>${chars(a.title)}</h2>${lead ? `<p class="op-lead">${lead}</p>` : ''}</div>${o.cap ? `<p class="ost-cap mono">${esc(o.cap)}</p>` : ''}</header>`;
      case 'reel': return `<header class="aopen o-reel"><h2 class="ore-title">${chars(a.title)}</h2><div class="ore-strip clip">${(o.imgs || []).map(([n, tc]) => `<figure>${img(n, '', tc)}<figcaption class="mono">${esc(tc || '')}</figcaption></figure>`).join('')}</div>${foot}</header>`;
      default: return `<header class="aopen o-slash">${o.img ? `<figure class="os-img clip">${img(o.img, 'duo')}</figure>` : ''}<span class="os-no" aria-hidden="true">${no}</span><p class="kicker os-kick">${kick}</p><div class="os-band">${slashSvg(p.number + a.id)}<h2 class="os-title">${chars(a.title)}</h2></div>${lead ? `<p class="os-lead">${lead}</p>` : ''}</header>`;
    }
  };

  /* =================================================================
     POSTER PARTS — every cue line opens a poster. The blocks that
     follow it are sorted by role and set into one of eight PV
     compositions; each project cycles through its own order.
     ================================================================= */
  const ROLE = b => b.note ? 'n'
    : (b.module || b.snap || b.tabs || b.player || b.table || b.ratios || b.reel || b.stage || b.spec || b.lyric || b.numeral || b.frame || b.video) ? 'w'
    : (b.fig || b.viz !== undefined || b.gallery || b.collage) ? 'm' : 't';
  const TPL = {
    rally: ['split', 'hud', 'ruri', 'grid', 'center', 'slash', 'collage', 'rail'],
    privacy: ['grid', 'hud', 'center', 'ruri', 'slash', 'rail'],
    portrait: ['center', 'rail', 'slash', 'ruri', 'hud', 'split'],
    scoreboard: ['hud', 'grid', 'center', 'slash', 'ruri', 'split'],
    operator: ['rail', 'hud', 'slash', 'split', 'grid', 'center'],
    scroll: ['rail', 'center', 'ruri', 'slash', 'split', 'collage'],
    afterglow: ['center', 'hud', 'rail', 'slash', 'grid', 'ruri'],
    compass: ['collage', 'grid', 'ruri', 'rail', 'split', 'center'],
    loop: ['collage', 'ruri', 'grid', 'hud', 'split', 'rail'],
    garden: ['rail', 'center', 'collage', 'ruri', 'split', 'slash'],
    film: ['ruri', 'rail', 'slash', 'center', 'split', 'hud'],
    _: ['ruri', 'rail', 'hud', 'center', 'slash', 'collage', 'grid', 'split']
  };
  /* FORMATS — each project is a different kind of document: its own part template, chrome and voice */
  const FORMAT = {
    rallylens: ['dual'], 'privacy-city': ['window'], tennisatom: ['spread'], baseball: ['board'], artemis: ['panel'],
    bronze: ['scroll'], afterglow: ['ring'], 'growth-compass': ['note'], looplab: ['item'], garden: ['moon'], jingwai: ['frame35']
  };
  let partNo = 0;
  const CN = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五'];
  const fmtDeco = (tpl, o) => {
    const { en, cue, script } = o, n = partNo;
    switch (tpl) {
      case 'dual': return `<div class="du-tag" aria-hidden="true"><b>${n % 2 ? '○ P01' : '□ P02'}</b><span>${cue} · ${esc(en)}</span></div><svg class="du-arc" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true"><path d="M2 58C60-14 140-14 198 58"/></svg>`;
      case 'window': return `<div class="win-bar"><span class="win-dots" aria-hidden="true"><i></i><i></i><i></i></span><b>${esc(en)}</b><span class="win-cl" aria-hidden="true">§ ${actNo}.${cueNo} · 授权请求 ${pad(n)}</span><button type="button" class="win-x" aria-label="收起或展开这一段">—</button></div>`;
      case 'spread': return `<span class="sp-folio l" aria-hidden="true">${pad(n * 2 + 10)}</span><span class="sp-folio r" aria-hidden="true">TENNIS ATOM · ${pad(n * 2 + 11)}</span><span class="sp-run" aria-hidden="true">${esc(en)}</span>${script}`;
      case 'board': return `<div class="sb-top" aria-hidden="true"><span>INNING ${actNo} · ${n % 2 ? 'TOP' : 'BOT'}</span><b>${esc(en)}</b><span>PLAY ${pad(n)}</span></div>`;
      case 'panel': return `<div class="pn-tab" aria-hidden="true"><b>${pad(n)}</b><span>${esc(en)}</span></div><i class="pn-stripe" aria-hidden="true"></i><span class="pn-c tl" aria-hidden="true"></span><span class="pn-c br" aria-hidden="true"></span>`;
      case 'scroll': return `<span class="sc-seal" aria-hidden="true">第${CN[(n - 1) % CN.length]}段</span><span class="sc-en" aria-hidden="true">${esc(en)}</span>`;
      case 'ring': { const id = `rg${n}`, t = `${en} · ${cue} · `.repeat(4); return `<svg class="rg-ring" viewBox="0 0 400 400" aria-hidden="true"><defs><path id="${id}" d="M200 200m-178 0a178 178 0 1 1 356 0a178 178 0 1 1-356 0"/></defs><circle cx="200" cy="200" r="190"/><text><textPath href="#${id}">${esc(t)}</textPath></text></svg><span class="rg-time" aria-hidden="true">${String(5 + n).padStart(2, '0')}:00</span>`; }
      case 'note': return `<i class="nt-tape" aria-hidden="true"></i><span class="nt-no" aria-hidden="true">NOTE ${pad(n)} · ${esc(en)}</span>${script ? `<span class="nt-hand" aria-hidden="true">${esc(o.scriptText)}</span>` : ''}`;
      case 'item': return `<div class="it-head" aria-hidden="true"><b>LL-${String(n).padStart(3, '0')}</b><span>${esc(en)}</span><i class="pt-bar"></i></div>`;
      case 'moon': return `<span class="mn-tag" aria-hidden="true">第${CN[(n - 1) % CN.length]}景</span><i class="mn-lattice" aria-hidden="true"></i>`;
      case 'frame35': return `<span class="fx-no" aria-hidden="true">${String(n * 24).padStart(4, '0')}</span><span class="fx-slug" aria-hidden="true">SC.${pad(actNo)}-${cueNo} · ${esc(en)}</span><span class="fx-tc" aria-hidden="true">23:16:${String(49 + n).padStart(2, '0')}</span>`;
      default: return '';
    }
  };
  /* break a headline at its own punctuation, never mid-word */
  const posterLines = t => String(t).split('\n').flatMap(l => l.match(/[^，。？！；：、]+[，。？！；：、”」]*/g) || [l]);
  const lineLen = l => [...l].reduce((a, c) => a + (ascii(c) ? .56 : 1), 0);
  const barcode = '<i class="pt-bar" aria-hidden="true"></i>';
  const partsHtml = (a, k, p, theme) => {
    const parts = []; let cur = { head: null, items: [] };
    (a.blocks || []).forEach(b => { if (b.sub) { if (cur.head || cur.items.length) parts.push(cur); cur = { head: b, items: [] }; } else cur.items.push(b); });
    if (cur.head || cur.items.length) parts.push(cur);
    const pref = TPL[theme] || TPL._, rail = (String(a.kicker || '').split(/[·/]/)[0].trim() || a.id).toUpperCase();
    let ti = (k * 3 + Number(p.number)) % pref.length;
    return parts.map((pt, j) => {
      if (!pt.head) return `<div class="blocks p0">${pt.items.map(b => placed(b, p.id)).join('')}</div>`;
      cueNo++;
      const g = { m: [], t: [], w: [], n: [] };
      pt.items.forEach(b => g[ROLE(b)].push(b));
      const f0 = figNo + 1;
      const html = r => r.map(b => block(b, p.id)).join('');
      let tpl;
      const fmt = FORMAT[p.id];
      if (pt.head.tpl) tpl = pt.head.tpl;
      else if (fmt) tpl = fmt[(j + k) % fmt.length];
      else if (g.m.length) { tpl = pref[ti % pref.length]; ti++; } else tpl = g.t.length && !g.w.length ? 'type' : 'banner';
      const m1 = g.m.length ? html([g.m[0]]) : '', mx = html(g.m.slice(1)), tt = html(g.t), ww = html(g.w), nn = html(g.n);
      const f1 = figNo, en = (pt.head.en || `${rail} — ${pad(cueNo)}`).toUpperCase(), cue = `CUE ${pad(actNo)}-${cueNo}`;
      const lines = posterLines(pt.head.sub), n = Math.max(4, ...lines.map(lineLen));
      const head = `<h3 class="pt-h" aria-label="${esc(pt.head.sub)}" style="--n:${n.toFixed(1)}"><span class="pt-en" aria-hidden="true">${esc(en)}</span>${lines.map((l, i) => `<span class="pl" style="--i:${i}" aria-hidden="true">${esc(l)}</span>`).join('')}</h3>`;
      const no = `<b class="pt-no" aria-hidden="true">${pad(cueNo)}</b>`;
      const hud = `<p class="pt-hud" aria-hidden="true"><span>SC-${p.number}</span><i>▲</i><span>${cue}</span><i>▲</i><span>${f1 >= f0 ? `FIG ${pad(f0)}${f1 > f0 ? '—' + pad(f1) : ''}` : 'TEXT'}</span><i>▲</i><span>${esc(p.name.toUpperCase())}</span></p>`;
      const script = pt.head.script ? `<span class="pt-script" aria-hidden="true">${esc(pt.head.script)}</span>` : '';
      const seed = p.number + a.id + j;
      const em = cls => `<span class="pt-art ${cls}" aria-hidden="true">${A.emblem ? A.emblem(p.id) : ''}</span>`;
      const art = (fn, cls, ...x) => A[fn] ? `<span class="pt-art ${cls}" aria-hidden="true">${A[fn](...x)}</span>` : '';
      const deco = {
        ruri: `<div class="pt-sw" aria-hidden="true"><i></i><i></i>${A.emblem ? A.emblem(p.id) : ''}<span>${cue}<br>${esc(en)}</span></div>${barcode}${script}${art('sparkle', 'sp-a')}`,
        rail: `${no}${art('chevrons', 'chev-a')}${art('reg', 'reg-a')}`,
        hud: `${hud}${no}${em('em-hud')}`,
        center: `${art('burst', 'burst-a', seed)}${script}<span class="pt-vk" aria-hidden="true">${cue}</span>${art('sparkle', 'sp-b')}`,
        slash: `<div class="pt-band" aria-hidden="true">${slashSvg(seed)}</div>${art('sparkle', 'sp-c')}${art('sparkle', 'sp-d')}`,
        collage: `<i class="pt-tape a" aria-hidden="true"></i><i class="pt-tape b" aria-hidden="true"></i>${A.sticker ? A.sticker(p.id, cue, esc(en), 'pt-stick') : ''}`,
        grid: `<i class="pt-cross" aria-hidden="true"></i><span class="pt-co tl" aria-hidden="true">${cue}</span><span class="pt-co br" aria-hidden="true">${esc(en)}</span>${art('reg', 'reg-tr')}${art('reg', 'reg-bl')}`,
        split: `${art('speed', 'speed-a', seed)}<span class="pt-q" aria-hidden="true">“</span>${no}`,
        banner: `${no}${hud}${art('chevrons', 'chev-b')}`,
        type: `${no}${script}${art('burst', 'burst-b', seed)}`
      }[tpl] || (partNo++, fmtDeco(tpl, { en, cue, script, scriptText: pt.head.script || '', p }));
      return `<section class="part tpl-${tpl}${g.m[0] && g.m[0].viz !== undefined ? ' is-viz' : ''}${g.t.length ? '' : ' no-t'}${mx ? '' : ' no-x'}" aria-label="${esc(pt.head.sub)}">
        ${deco}${head}
        ${m1 ? `<div class="pt-m">${m1}</div>` : ''}
        ${tt ? `<div class="pt-t">${tt}</div>` : ''}
        ${mx ? `<div class="pt-x">${mx}</div>` : ''}
        ${ww ? `<div class="pt-w">${ww}</div>` : ''}
        ${nn ? `<div class="pt-n">${nn}</div>` : ''}
      </section>`;
    }).join('');
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
        ${row('资料<small>SOURCES</small>', (m.sources || []).map(([tt, a]) => `<button type="button" data-lb="${esc(src2(a))}" class="fs-src">${esc(tt)} ${I('ne')}</button>`).join(''))}
        ${row('局限<small>LIMIT</small>', esc(m.limit))}
        ${row('还没验证<small>OPEN</small>', esc(m.open))}
      </dl>
    </section>`;
  };
  const strip = (a, b, c) => `<div class="strip rv" aria-hidden="true"><span class="x"></span><span><b>${esc(a[0])}</b>${esc(a[1])}</span><span>${esc(b[0])}<br>${esc(b[1])}</span><span class="st"></span><span class="code">${esc(c[0])}<small>${esc(c[1])}</small></span><span class="gl">${I('globe')}</span></div>`;

  const sceneCard = p => {
    const s = S[p.id] || {}, h = s.home || {};
    // each scene can bring its own small poster (pages/home.js), drawn in that project's visual language
    if (window.HOMECARDS && HOMECARDS[p.id]) return `<article class="scene hp hp-${p.id}" id="scene-${p.id}" aria-labelledby="st-${p.id}">${HOMECARDS[p.id](p, s, { esc, src, url: caseUrl })}</article>`;
    const cjk = /[一-鿿]/.test(p.name);
    const thumbs = (h.thumbs || []).slice(0, 2);
    const mo = window.THEMES && s.theme && THEMES.MOTIF[s.theme] ? `<div class="motif" aria-hidden="true">${THEMES.MOTIF[s.theme]()}</div>` : '';
    return `<article class="scene t-${s.theme || ''}" id="scene-${p.id}" style="--c:${p.color}" aria-labelledby="st-${p.id}">
      <div class="scene-top"><div class="swatch"><i></i><i></i><span>SCENE ${p.number} / ${pad(projects.length)}<br>${esc(p.label)}</span></div><span class="mono">${esc(p.year)}</span></div>
      <div class="scene-body">
        <a class="scene-media" href="${caseUrl(p.id)}" data-cut="${p.number}" aria-label="打开 ${esc(p.name)}"><div class="ph bk"><img class="duo${s.contain ? ' contain' : ''}" src="${src(s.key || p.cover)}" alt="${esc(p.coverAlt || '')}" loading="lazy"></div>${mo}${thumbs.length ? `<div class="thumbs">${thumbs.map(t => `<img src="${src(t)}" alt="" loading="lazy">`).join('')}</div>` : ''}</a>
        <div class="scene-info">
          <span class="scene-no">${p.number}${A.emblem ? A.emblem(p.id, 'scene-em') : ''}</span>
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
     BESPOKE PAGES — a project listed here is laid out by pages/<id>.js
     and pages/<id>.css instead of the shared part templates.
     ================================================================= */
  const PAGE_LIST = ['rallylens', 'privacy-city', 'tennisatom', 'baseball', 'artemis', 'bronze', 'afterglow', 'growth-compass', 'looplab', 'garden', 'jingwai'], PAGE_V = 15;
  // page stylesheet, then the shared EVA type layer on top of it; the chart kit before the page script
  const loadOne = (tag, attr, url) => new Promise(r => { const el = document.createElement(tag); if (tag === 'link') el.rel = 'stylesheet'; el[attr] = url; el.onload = el.onerror = r; document.head.append(el); });
  const loadPage = async id => {
    if (!PAGE_LIST.includes(id)) return null;
    await Promise.all([loadOne('link', 'href', `pages/${id}.css?v=${PAGE_V}`).then(() => loadOne('link', 'href', `pages/_eva.css?v=${PAGE_V}`)), loadOne('script', 'src', `pages/_viz.js?v=${PAGE_V}`).then(() => loadOne('script', 'src', `pages/${id}.js?v=${PAGE_V}`))]);
    return (window.PAGES || {})[id] || null;
  };
  /* EVA headings: heavy, squeezed sideways; the lines of one heading step down in size */
  const evaize = root => $$('h1, h2, h3', root).forEach(h => {
    if (h.closest('.vz, .mod-mount, .tabs, .snap, [data-noeva]') || h.classList.contains('eva') || h.classList.contains('sr')) return;
    const kids = [...h.childNodes], plain = kids.every(n => n.nodeType === 3 || n.nodeName === 'BR');
    const al = getComputedStyle(h).textAlign;
    h.classList.add('eva'); if (al === 'center') h.classList.add('c'); else if (al === 'right' || al === 'end') h.classList.add('r');
    if (plain && h.tagName === 'H2') { const lines = h.innerHTML.split(/<br\s*\/?>/i).map(x => x.trim()).filter(Boolean); if (lines.length > 1) { h.classList.add('l' + Math.min(3, lines.length)); h.innerHTML = lines.map(l => `<span class="el">${l}</span>`).join(''); return; } }
    if (plain) h.innerHTML = `<span class="ev">${h.innerHTML}</span>`;
  });
  const kitFor = p => ({
    p, s: S[p.id] || {}, esc, md, src, pad, chars, lyricWords, stageEl, slashSvg, A, I, MOD, byId, caseUrl, rng, fileSpec,
    figure, vizFig, vizFile: v => vizFile(p.id, v), block: b => block(b, p.id),
    chart: (spec, cap) => (window.VZ ? VZ.html(spec, cap ? md(cap) : '') : ''), charts: t => (window.VZ ? VZ.tabs(t, md) : ''),
    /* blocks of one act: b(i) renders block i, o(i) hands back its data; rest() renders whatever the page didn't place */
    use(a) {
      const bs = a.blocks || [], used = new Set();
      return {
        b: i => { used.add(i); return bs[i] ? block(bs[i], p.id) : ''; },
        o: i => { used.add(i); return bs[i] || {}; },
        rest: () => bs.map((b, i) => { if (used.has(i)) return ''; console.warn('[page] unplaced block', p.id, a.id, i); return b.sub ? '' : block(b, p.id); }).join('')
      };
    }
  });

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
    const PG = await loadPage(p.id), kit = PG ? kitFor(p) : null;
    const TH = window.THEMES || {}, theme = PG ? null : s.theme;
    if (theme) document.body.classList.add(`t-${theme}`);
    document.body.classList.add(PG ? 'pg' : `f-${p.id}`, `pg-${p.id}`); partNo = 0;
    const m = (window.META || {})[p.id] || {};
    const custom = theme && TH.TC && TH.TC[theme] ? `<section class="title-card tc-${theme}" aria-labelledby="tc-name">${TH.TC[theme](p, s, pad(projects.length))}${strip([p.label, ''], [s.stripB || p.role, ''], [`SC-${p.number}`, p.year])}</section>` : '';
    const roll = [
      ['ROLE', '我的角色', p.role],
      m.credit ? [m.credit[0], { PAPER: '论文', AWARD: '获奖', TEAM: '团队', HONOR: '入选', RANGE: '数据范围' }[m.credit[0]] || '', m.credit[1]] : null,
      ['OUTPUT', '交出的东西', (s.done || p.outcomes || []).join('\n')],
      ['TOOLS', '工具', (s.home || {}).tools || ''],
      ['STATUS', '状态', p.status],
      ['YEAR', '年份', p.year]
    ].filter(r => r && r[2]);
    main.innerHTML = `
      ${PG && PG.title ? PG.title(kit) : custom || `<section class="title-card" aria-labelledby="tc-name">
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
      ${PG && PG.logline ? PG.logline(kit) : `<section class="logline" aria-label="项目摘要">
        <div class="grid">
          <div class="it rv"><div class="k"><b>問</b><span>PROBLEM</span></div><p>${md(s.logline?.q || '')}</p></div>
          <div class="it rv" style="--d:.1s"><div class="k"><b>做</b><span>MY PART</span></div><p>${md(s.logline?.a || '')}</p></div>
          <div class="it rv" style="--d:.2s"><div class="k"><b>果</b><span>RESULT</span></div><p>${md(s.logline?.r || '')}</p></div>
        </div>
        ${(s.stats || p.metrics || []).length ? `<div class="stats rv">${(s.stats || p.metrics).map(([v, l]) => `<div class="stat"><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join('')}</div>` : ''}
      </section>`}
      <nav class="act-rail" aria-label="本页段落">${acts.map((a, k) => `<a href="#${a.id || 'act-' + (k + 1)}"><b>${pad(k + 1)}</b><span>${esc(a.toc || a.title.replace(/\n/g, ''))}</span></a>`).join('')}<a href="#end"><b>END</b><span>片尾</span></a></nav>
      <div class="case">
        ${acts.map((a, k) => {
          actNo = k + 1; cueNo = 0;
          const own = PG && PG.act ? PG.act(a, k, kit) : null;
          if (own) return `<section class="act pg-act" id="${a.id || 'act-' + (k + 1)}">${own}</section>`;
          const open = openHtml(a, k, p), body = partsHtml(a, k, p, theme);
          const rail = (String(a.kicker || '').split(/[·/]/)[0].trim() || a.id).toUpperCase();
          return `<section class="act a-${k % 2 ? 'even' : 'odd'}" id="${a.id || 'act-' + (k + 1)}">${open}<div class="act-v" aria-hidden="true"><span>${esc(rail)}</span></div><div class="parts">${body}</div></section>`;
        }).join('')}
        <section class="act end" id="end">
          <header class="aopen o-end"><p class="kicker">END ROLL · SC-${p.number}</p><h2 class="oe-title">${chars(s.endTitle || p.name)}</h2></header>
          <dl class="roll2 rv">${roll.map(([en, cn, v]) => `<div><dt><b>${esc(en)}</b>${esc(cn)}</dt><dd>${md(v)}</dd></div>`).join('')}</dl>
          ${s.next ? `<div class="after rv"><span class="mono">NEXT</span><p>${md(s.next)}</p></div>` : ''}
          ${fileSpec(p, m)}
          ${s.bound ? `<p class="note bound rv">${md(s.bound)}</p>` : ''}
          <div class="links rv">${[...(s.links || []), ...(p.links || []).filter(([, u]) => !(s.links || []).some(l => l[1] === u))].map(([t, u, k]) => `<a class="btn${k ? ' ' + k : ' line'}" href="${esc(u)}"${/^https?:|\.pdf$|demos\//.test(u) ? ' target="_blank" rel="noopener"' : ''}>${esc(t)} ${I('ne')}</a>`).join('')}</div>
        </section>
      </div>
      <nav class="trailer" aria-label="上一场与下一场">
        <a href="${caseUrl(prev.id)}" data-cut="${prev.number}"><span class="mono">← PREV SCENE ${prev.number}</span><b>${esc(prev.name)}</b><small>${esc(prev.cn)}</small><img src="${src((S[prev.id] || {}).key || prev.cover)}" alt="" loading="lazy"></a>
        <a href="${caseUrl(next.id)}" data-cut="${next.number}"><span class="mono">NEXT SCENE ${next.number} →</span><b>${esc(next.name)}</b><small>${esc(next.cn)}</small><img src="${src((S[next.id] || {}).key || next.cover)}" alt="" loading="lazy"></a>
      </nav>`;
    bindTabs(main); bindPlayers(main); bindReels(main); bindFormats(main); initModules(main, p); lightbox();
    if (theme && TH.AFTER && TH.AFTER[theme]) { try { TH.AFTER[theme](main); } catch (e) { console.error(e); } }
    if (PG && PG.after) { try { PG.after(main, kit); } catch (e) { console.error(e); } }
    await mountSnaps(main, p.id);
    if (window.VZ) VZ.mount(main);
    if (PG) evaize(main);
    reveal(main); lazySvg(main); mountStages(main); onScroll();
    if (location.hash) { const t = document.getElementById(location.hash.slice(1)); t && setTimeout(() => t.scrollIntoView(), 50); }
    const tl = $$('.act-rail a');
    if ('IntersectionObserver' in window) {
      const tio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) tl.forEach(a => a.classList.toggle('on', a.getAttribute('href') === `#${e.target.id}`)); }), { rootMargin: '-40% 0px -55% 0px' });
      $$('.act').forEach(a => tio.observe(a));
      const rail = $('.act-rail'), lg = $('.logline');
      if (rail && lg) new IntersectionObserver(([e]) => rail.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top < 0)).observe(lg);
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
