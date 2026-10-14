/* WENJING BIAN — PORTFOLIO / PV EDITION — renderer + motion */
(() => {
  const P = window.PORTFOLIO, MOD = window.MODULES || {};
  const I = (n, c) => window.ICON ? window.ICON(n, c) : '';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const img = n => /\.\w{3,4}$/.test(n) ? `assets/${n}` : `assets/${n}.webp`;
  const media = n => `media/${n}`;
  const CONTAIN = new Set(['composition/artemis-hero', 'tennis-poster']);
  const fit = n => CONTAIN.has(n) ? ' class="contain"' : '';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const byId = id => P.projects.find(p => p.id === id);
  const caseUrl = id => `case.html?project=${encodeURIComponent(id)}`;
  const pad2 = n => String(n).padStart(2, '0');

  /* split a title into animated characters (keeps words for screen readers) */
  const split = (text, cls = '') => `<span class="split ${cls}" aria-label="${esc(text)}">${[...text].map((c, i) => c === ' ' ? '<span class="sp"> </span>' : `<span class="ch" aria-hidden="true" style="--i:${i}">${esc(c)}</span>`).join('')}</span>`;

  /* ---------- global chrome: grain, cursor, transitions ---------- */
  document.body.insertAdjacentHTML('beforeend', '<div class="grain" aria-hidden="true"></div><div class="pt" aria-hidden="true"><i></i><i></i><span>LOADING FILE</span></div>');
  const pt = $('.pt');
  if (!reduce) {
    pt.classList.add('leave');
    setTimeout(() => pt.classList.remove('leave'), 700);
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin || !/\.html$|\/$/.test(u.pathname) || (u.pathname === location.pathname && u.hash)) return;
      e.preventDefault();
      $('span', pt).textContent = a.dataset.code || 'LOADING FILE';
      pt.classList.add('enter');
      setTimeout(() => { location.href = a.href; }, 520);
    });
    addEventListener('pageshow', e => { if (e.persisted) pt.classList.remove('enter'); });
  }
  if (fine && !reduce) {
    document.body.insertAdjacentHTML('beforeend', '<div class="cur" aria-hidden="true"><i class="h"></i><i class="v"></i><b></b><span></span></div>');
    const cur = $('.cur'), lab = $('.cur b'), coord = $('.cur span');
    let x = -100, y = -100, tx = x, ty = y;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; coord.textContent = `X${String(Math.round(tx)).padStart(4, '0')} Y${String(Math.round(ty)).padStart(4, '0')}`; }, { passive: true });
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('a,button,input,label,[data-cur],.shot');
      cur.classList.toggle('hot', !!t);
      lab.textContent = t ? (t.dataset.cur || (t.matches('.shot') ? 'ZOOM' : t.matches('a') ? 'OPEN' : 'SELECT')) : '';
    });
    const loop = () => { x += (tx - x) * .32; y += (ty - y) * .32; cur.style.transform = `translate(${x}px,${y}px)`; requestAnimationFrame(loop); };
    loop();
  }

  /* ---------- HUD: timecode + progress + parallax ---------- */
  const tc = $('#tc'), bar = $('.hud-progress');
  const par = () => $$('[data-par]');
  let parEls = [];
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const f = max > 0 ? Math.min(1, scrollY / max) : 0;
    const t = f * 240;
    if (tc) tc.textContent = `00:${pad2(Math.floor(t / 60))}:${pad2(Math.floor(t % 60))}:${pad2(Math.floor((t * 24) % 24))}`;
    if (bar) bar.style.width = `${f * 100}%`;
    if (!reduce) parEls.forEach(el => { const r = el.getBoundingClientRect(); const k = parseFloat(el.dataset.par); el.style.transform = `translate3d(0,${((r.top + r.height / 2 - innerHeight / 2) * k).toFixed(1)}px,0)`; });
  };
  addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });

  /* ---------- reveal + counters ---------- */
  const count = el => {
    const raw = el.textContent, m = raw.match(/[\d,]+(\.\d+)?/);
    if (!m || reduce) return;
    const target = parseFloat(m[0].replace(/,/g, '')), dec = (m[1] || '').length - 1, comma = m[0].includes(',');
    const t0 = performance.now();
    const step = now => {
      const k = Math.min(1, (now - t0) / 1100), e = 1 - Math.pow(1 - k, 3);
      let v = (target * e).toFixed(Math.max(0, dec));
      if (comma) v = Number(v).toLocaleString('en-US');
      el.textContent = raw.replace(m[0], v);
      if (k < 1) requestAnimationFrame(step); else el.textContent = raw;
    };
    requestAnimationFrame(step);
  };
  const io = 'IntersectionObserver' in window && !reduce
    ? new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); io.unobserve(e.target);
      $$('[data-count]', e.target).forEach(count);
    }), { rootMargin: '0px 0px -6% 0px', threshold: 0.01 })
    : null;
  const reveal = () => {
    $$('.rv,.wipe,.split').forEach(el => io ? io.observe(el) : el.classList.add('in'));
    parEls = par();
    // safety net: never leave content invisible
    setTimeout(() => $$('.rv:not(.in),.wipe:not(.in),.split:not(.in)').forEach(el => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('in'); }), 1600);
  };

  /* ---------- media atoms ---------- */
  const shot = (name, cap, extra = '') => `<figure class="shot ${extra}"><div class="img-wrap"><img src="${img(name)}" alt="${esc(cap || '')}" loading="lazy"${/\.svg$/.test(name) ? ' class="svg"' : ''}></div>${cap ? `<figcaption>${esc(cap)}</figcaption>` : ''}</figure>`;
  const video = v => `<div class="vid"><video controls preload="none" playsinline poster="${img(v.poster)}"><source src="${media(v.src)}" type="${v.src.endsWith('.webm') ? 'video/webm' : 'video/mp4'}"></video><div class="cap"><b>${esc(v.title)}</b><span>${esc(v.note || '')}</span></div></div>`;
  const collage = (items, variant = 0) => {
    if (!items.length) return '';
    const cls = ['c1', 'c2', 'c3'][Math.min(items.length, 3) - 1];
    return `<div class="collage ${cls} v${variant % 2}">${items.slice(0, 3).map(([n, c], i) => `<div class="cl cl${i}" ${i ? `data-par="${i === 1 ? -0.06 : 0.05}"` : ''}>${i === 1 ? '<i class="tape" aria-hidden="true"></i>' : ''}${shot(n, c)}</div>`).join('')}<i class="band" aria-hidden="true"></i></div>`;
  };
  const lightbox = () => {
    const lb = $('#lb'); if (!lb || !lb.showModal) return;
    document.addEventListener('click', e => {
      const s = e.target.closest('.shot'); if (!s) return;
      const i = $('img', s); $('img', lb).src = i.src; $('img', lb).alt = i.alt; $('p', lb).textContent = i.alt;
      lb.showModal();
    });
    lb.addEventListener('click', e => { if (e.target === lb || e.target.tagName === 'BUTTON') lb.close(); });
  };
  const mount = (key, p, opt) => {
    const m = MOD[key]; if (!m) return '';
    return `<div class="mod-mount" data-mod="${key}">${m.html(p, opt || {})}</div>`;
  };
  const initMods = p => $$('.mod-mount').forEach(el => { const m = MOD[el.dataset.mod]; if (m && m.init) { try { m.init(el, p); } catch (err) { console.error(err); } } });

  /* =================================================================
     HOME
     ================================================================= */
  const home = () => {
    const pr = P.profile;

    let seen = false; try { seen = sessionStorage.getItem('wb-boot') === '1'; sessionStorage.setItem('wb-boot', '1'); } catch (e) {}
    if (!seen && !reduce) {
      const b = document.createElement('div');
      b.className = 'boot'; b.setAttribute('aria-hidden', 'true');
      b.innerHTML = `<div class="boot-in">${I('warn', 'boot-ic')}<pre>&gt; OPEN FILE  WB-2026.PF\n&gt; OPERATOR   卞文璟 / WENJING BIAN\n&gt; CLASS      RESEARCH · AI · GAME · MOTION\n&gt; WORKS      ${P.projects.length} FILES / 3 TRACKS</pre><div class="bar"><i></i></div><p class="boot-jp">起動中 ／ 作品集</p></div>`;
      document.body.appendChild(b);
      const out = () => { b.classList.add('out'); setTimeout(() => b.remove(), 560); };
      b.addEventListener('click', out); setTimeout(out, 1350);
      $$('.hero .ld').forEach(el => el.style.animationDelay = `${1.4 + (parseFloat(el.style.animationDelay) || 0)}s`);
      $('.hero .slash').style.animationDelay = '1.3s';
    }

    $('#statement').innerHTML = `<span>${esc(pr.statement[0])}</span><span>做成<em>能被操作</em>的体验。</span>`;
    $('#lead').textContent = pr.lead;
    $('#roles').innerHTML = pr.roles.map((r, i) => `<span class="tag${i === 0 ? ' solid' : ''}">${esc(r)}</span>`).join('');

    const words = ['SELECTED WORK 2023—2026', '用户研究', 'AI PRODUCT', '游戏系统', 'AIGC MOTION', '数据可视化', 'RESEARCH × BUILD', '警告：高密度作品'];
    const row = words.map(w => `<span>${esc(w)}</span>`).join('');
    $('#ticker').innerHTML = row + row;

    // monitor
    const feat = ['jingwai', 'rallylens', 'bronze', 'tennisatom', 'privacy-city', 'artemis'].map(byId).filter(Boolean);
    const mon = $('#monitor');
    mon.innerHTML = `<div class="monitor-frame brackets">${feat.map((p, i) => `<img src="${img(p.brief.key)}" alt=""${CONTAIN.has(p.brief.key) ? ' class="contain"' : ''}${i ? ' loading="lazy"' : ' fetchpriority="high"'}>`).join('')}<i class="flash"></i>
      <div class="monitor-hud" aria-hidden="true"><div class="row"><span>${I('cross')} REC</span><span id="mon-code"></span></div><div class="row"><span>FEATURED</span><span id="mon-idx"></span></div></div><span class="mon-jp" id="mon-jp" aria-hidden="true"></span></div>
      <a class="monitor-cap" id="mon-cap" data-cur="PLAY"><b id="mon-num"></b><span><strong id="mon-name"></strong><small id="mon-sub"></small></span><span class="arr">OPEN ${I('ne')}</span></a>
      <div class="monitor-dots" role="group" aria-label="切换精选作品">${feat.map(p => `<button type="button" aria-label="${esc(p.name)}"></button>`).join('')}</div>`;
    const imgs = $$('.monitor-frame img', mon), dots = $$('.monitor-dots button', mon), flash = $('.flash', mon);
    let cur = -1, timer;
    const show = i => {
      if (i === cur) return; cur = i;
      const p = feat[i];
      imgs.forEach((im, k) => im.classList.toggle('on', k === i));
      dots.forEach((d, k) => d.setAttribute('aria-current', k === i ? 'true' : 'false'));
      $('#mon-num').textContent = p.number; $('#mon-name').textContent = p.name; $('#mon-sub').textContent = p.cn;
      $('#mon-code').textContent = `${p.brief.en} / ${p.year}`; $('#mon-idx').textContent = `${pad2(i + 1)} / ${pad2(feat.length)}`;
      $('#mon-jp').textContent = p.brief.jp || '';
      $('#mon-cap').href = caseUrl(p.id); $('#mon-cap').dataset.code = `FILE ${p.number} · ${p.name}`;
      if (!reduce) { flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go'); }
    };
    const loop = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => show((cur + 1) % feat.length), 3400); };
    dots.forEach((d, i) => d.addEventListener('click', () => { show(i); loop(); }));
    mon.addEventListener('mouseenter', () => clearInterval(timer)); mon.addEventListener('mouseleave', loop);
    show(0); loop();

    $('#facts').innerHTML = pr.facts.map(([k, b, s]) => `<div class="fact"><span class="k">${esc(k)}</span><div><b>${esc(b)}</b><span>${esc(s)}</span></div></div>`).join('');
    $('#method').innerHTML = pr.method.map(([k, en, t, d, ic], i) => `<li class="rv" style="--d:${i * 90}ms"><span class="m-k">${k}</span><span class="m-en">${I(ic)}${pad2(i + 1)} / ${en}</span><b>${esc(t)}</b><p>${esc(d)}</p></li>`).join('');

    $('#caps').innerHTML = P.capabilities.map(c => `<article class="cap"><div class="code"><b>${c.code}</b>${I(c.icon, 'cap-ic')}</div>
      <h3>${esc(c.en)}<small>${esc(c.cn)}</small></h3><p>${esc(c.text)}</p>
      <div class="proof">${c.proof.map(byId).filter(Boolean).map(p => `<a href="${caseUrl(p.id)}" data-code="FILE ${p.number} · ${esc(p.name)}">${p.number} ${esc(p.name)}</a>`).join('')}</div></article>`).join('');

    $('#works-count').textContent = `${P.projects.length} PROJECTS / 3 TRACKS`;
    $('#filters').innerHTML = `<button type="button" data-t="all" aria-pressed="true">${I('diamonds')}全部<span>${P.projects.length}</span></button>` +
      P.tracks.map(t => `<button type="button" data-t="${t.id}" aria-pressed="false">${I(t.icon)}${esc(t.cn)}<span>${t.ids.length}</span></button>`).join('');
    $('#tracks').innerHTML = P.tracks.map(t => `<div class="track" data-track="${t.id}">
      <div class="track-band rv"><span class="code">${esc(t.code)}</span><h3>${esc(t.en)}<small>${esc(t.cn)}</small></h3><span class="track-jp" aria-hidden="true">${esc(t.jp)}</span><span class="count">${I(t.icon)}${t.ids.length} FILES</span></div>
      <p class="track-line rv">${I('chev')}${esc(t.line)}</p>
      ${t.ids.map(byId).filter(Boolean).map((p, i) => workRow(p, i)).join('')}</div>`).join('');
    $$('#filters button').forEach(b => b.addEventListener('click', () => {
      const t = b.dataset.t;
      $$('#filters button').forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      $$('.track').forEach(el => el.hidden = !(t === 'all' || el.dataset.track === t));
      const n = t === 'all' ? P.projects.length : P.tracks.find(x => x.id === t).ids.length;
      $('#filter-status').textContent = `显示 ${n} 个项目`;
      $$('.track:not([hidden]) .rv').forEach(el => el.classList.add('in'));
    }));

    $('#research').innerHTML = P.research.map((r, i) => `<article class="note rv"><span class="tag blue">${I('star')} NOTE.0${i + 1}</span><h3>${esc(r.title)}</h3><p class="mono note-l">${esc(r.label)}</p><p>${esc(r.text)}</p><i class="note-no" aria-hidden="true">0${i + 1}</i></article>`).join('');

    const secs = ['file', 'works', 'notes', 'contact'].map(id => document.getElementById(id));
    const links = $$('.hud nav a');
    if ('IntersectionObserver' in window) {
      const nio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === `#${e.target.id}` ? 'true' : 'false')); }), { rootMargin: '-45% 0px -50% 0px' });
      secs.forEach(s => s && nio.observe(s));
    }
    $$('.sec-title .en').forEach(el => { el.innerHTML = split(el.textContent); });
  };

  const workRow = (p, i) => {
    const b = p.brief;
    return `<a class="work rv${i % 2 ? ' flip' : ''}" href="${caseUrl(p.id)}" data-code="FILE ${p.number} · ${esc(p.name)}" aria-label="${esc(p.name)}：${esc(p.cn)}">
      <div class="work-num">${p.number}<small>${esc(p.year)}</small><span class="work-jp" aria-hidden="true">${esc(b.jp || '')}</span></div>
      <div class="work-media"><span class="badge tag lime">${esc(b.en)}</span><img src="${img(b.key)}" alt=""${fit(b.key)} loading="lazy"><span class="open">OPEN FILE ${I('ne')}</span><i class="scan" aria-hidden="true"></i></div>
      <div class="work-body">
        <div class="work-kicker"><span class="tag">${esc(p.label)}</span><span class="mono">${esc(b.team || '')}</span></div>
        <h4>${esc(p.name)}</h4>
        <p class="sub">${esc(p.cn)}</p>
        <dl class="qar">
          <div><dt>問<small>PROBLEM</small></dt><dd>${esc(b.q)}</dd></div>
          <div><dt>做<small>ACTION</small></dt><dd>${esc(b.a)}</dd></div>
          <div><dt>果<small>RESULT</small></dt><dd>${esc(b.r)}</dd></div>
        </dl>
      </div></a>`;
  };

  /* =================================================================
     CASE
     ================================================================= */
  const kase = () => {
    const id = new URLSearchParams(location.search).get('project');
    const p = byId(id) || P.projects[0];
    const b = p.brief, idx = P.projects.indexOf(p);
    const prev = P.projects[(idx - 1 + P.projects.length) % P.projects.length];
    const next = P.projects[(idx + 1) % P.projects.length];
    document.title = `${p.name} · ${p.cn} — 卞文璟`;
    const main = $('#main');

    /* table of contents is part of the narrative: 概览 → 影像 → 章节 → 结果 */
    const toc = [];
    const parts = [];
    let n = 0;
    const head = (code, title, text) => `<header class="ch-head"><span class="ch-idx" aria-hidden="true">${pad2(n)}</span><p class="ch-code mono">${I('cross')}${esc(code)}</p>${title ? `<h2>${split(title)}</h2>` : ''}${text ? `<p class="ch-text">${esc(text)}</p>` : ''}</header>`;
    const part = (code, title, html, cls = '') => {
      toc.push([pad2(n), (code.split('/')[1] || code).trim()]);
      parts.push(`<section class="ch ${cls}" id="ch-${pad2(n)}">${html}</section>`);
      n++;
    };

    part('OVERVIEW / 概览', '项目是什么，我负责什么', `${head('OVERVIEW / 概览', '项目是什么，我负责什么', p.intro)}
      <div class="ov">
        <ol class="resp rv">${(p.responsibilities || []).map((r, i) => `<li><span class="mono">MY PART.0${i + 1}</span>${esc(r)}</li>`).join('')}</ol>
        <div class="ov-side rv"><p class="mono">TOOLKIT / 工具</p><div class="tools">${(p.tools || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
        ${b.art ? `<figure class="ov-art shot"><div class="img-wrap"><img src="${img(b.art)}" alt="${esc(p.name)} 概念插画（原创，非实拍）" loading="lazy"></div><figcaption>概念插画 · 原创，非实拍</figcaption></figure>` : ''}</div>
      </div>`, 'ch-ov');

    if (p.videos && p.videos.length) part('FOOTAGE / 影像', '先看成品', `${head('FOOTAGE / 影像', '先看成品')}<div class="videos rv">${p.videos.map(video).join('')}</div>`, 'ch-dark');

    if (b.episodes) {
      const eps = Array.from({ length: 10 }, (_, k) => pad2(k + 1));
      part('EPISODES / 逐集', '十集成片，逐集观看', `${head('EPISODES / 逐集', '十集成片，逐集观看')}<div class="episodes rv" id="eps">
        <video controls preload="none" playsinline poster="${img('bronze-ep01-1')}"><source src="${media('bronze-episode-01.mp4')}" type="video/mp4"></video>
        <div class="ep-now"><span id="ep-label">EP.01 / 10</span><span>天命：祀与戎</span></div>
        <div class="ep-list" role="group" aria-label="选择集数">${eps.map((e, k) => `<button type="button" data-ep="${e}" aria-pressed="${k ? 'false' : 'true'}"><small>EP</small>${e}</button>`).join('')}</div></div>`, 'ch-dark');
    }

    (p.chapters || []).forEach((c, ci) => {
      const pics = [];
      if (c.image) pics.push([c.image, c.caption]);
      (c.gallery || []).forEach(g => pics.push(g));
      const cards = c.cards ? `<div class="cards rv">${c.cards.map(([t, d], i) => `<div class="card"><span class="mono">${I('star')} 0${i + 1}</span><b>${esc(t)}</b><p>${esc(d)}</p></div>`).join('')}</div>` : '';
      const mod = c.module ? `<div class="rv">${mount(c.module, p, c.opt)}</div>` : '';
      const after = c.after ? `<div class="rv">${mount(c.after, p)}</div>` : '';
      const vids = c.videos ? `<div class="videos rv">${c.videos.map(video).join('')}</div>` : '';
      const layout = c.module ? 'ch-mod' : (ci % 2 ? 'ch-r' : 'ch-l');
      const mediaHtml = c.wide ? `<div class="wide-shots rv">${pics.map(([n, cap]) => shot(n, cap)).join('')}</div>` : (pics.length ? `<div class="rv">${collage(pics, ci)}</div>` : '');
      part(c.eyebrow || `CHAPTER ${ci + 1}`, c.title, layout === 'ch-mod'
        ? `${head(c.eyebrow || '', c.title, c.text)}${cards}${mod}${after}${vids}${mediaHtml}`
        : `<div class="ch-grid">${head(c.eyebrow || '', c.title, c.text)}<div class="ch-media">${mediaHtml}</div></div>${cards}${vids}${after}`, layout);
    });

    const links = [];
    if (b.demo) links.push(`<a class="btn blue" href="${b.demo[1]}" target="_blank" rel="noopener">${I('play')} ${esc(b.demo[0])}</a>`);
    if (b.pdf) links.push(`<a class="btn ghost" href="${b.pdf[1]}" target="_blank" rel="noopener">${esc(b.pdf[0])} ${I('ne')}</a>`);
    const seen = new Set();
    (p.links || []).forEach(([t, u]) => { if (seen.has(u)) return; seen.add(u); links.push(`<a class="btn ghost" href="${esc(u)}" target="_blank" rel="noopener">${esc(t)} ${I('ne')}</a>`); });

    part('RESULT / 结果', '交付了什么，下一步是什么', `${head('RESULT / 结果', '交付了什么，下一步是什么')}<div class="wrap-up rv">
      <section class="blue"><h3>${I('star')} DELIVERED / 交付</h3><ul>${(p.outcomes || []).map(o => `<li>${esc(o)}</li>`).join('')}</ul></section>
      <section><h3>${I('chev')} NEXT / 下一步</h3><p>${esc(p.reflection || '在真实使用中继续检验设计判断。')}</p></section></div>
      ${links.length ? `<div class="links rv">${links.join('')}</div>` : ''}`, 'ch-end');

    const word = p.id === 'jingwai' ? 'ORPHEE' : b.en.split(' ')[0];
    main.innerHTML = `
      <section class="case-hero" aria-labelledby="case-title">
        <div class="slash" data-word="${esc(word)}" aria-hidden="true"><img src="${img(b.key)}" alt=""></div>
        <i class="slash-thin" aria-hidden="true"></i>
        <span class="case-jp" aria-hidden="true" data-par="-0.12">${esc(b.jp || '')}</span>
        <div class="case-id">
          <a class="back" href="index.html#works" data-code="INDEX">${I('chev', 'flip-x')} INDEX / 作品目录</a>
          <div class="case-num"><b>${p.number}</b><span class="mono">${esc(p.track.code)}<br>${esc(p.track.en)}</span></div>
          <h1 id="case-title">${split(p.name)}</h1>
          <p class="sub">${esc(p.cn)}</p>
          <dl class="meta">
            <div><dt>YEAR / 时间</dt><dd>${esc(p.year)}</dd></div>
            <div><dt>TEAM / 形式</dt><dd>${esc(b.team || '')}</dd></div>
            <div class="wide"><dt>ROLE / 我的角色</dt><dd>${esc(p.role)}</dd></div>
            <div class="wide"><dt>STATUS / 状态</dt><dd>${esc(p.status)}</dd></div>
          </dl>
        </div>
        <div class="case-visual" data-par="0.04"><figure><div class="frame brackets"><img src="${img(b.key)}" alt="${esc(p.coverAlt || p.name)}"${b.contain ? ' class="contain"' : ''} fetchpriority="high"><i class="scan" aria-hidden="true"></i></div>
          <figcaption><span>${I('cross')} ${esc(p.coverAlt || '')}</span><span>${esc(b.en)}</span></figcaption></figure></div>
        <div class="case-ticker" aria-hidden="true"><div class="ticker-track">${Array(2).fill(`<span>${esc(p.name)}</span><span>${esc(p.cn)}</span><span>${esc(b.en)}</span><span>FILE ${p.number}</span>`).join('')}</div></div>
      </section>
      <section class="brief" aria-label="项目摘要"><div class="brief-grid">
        <div class="brief-item rv"><div class="k"><b>問</b><span>PROBLEM / 问题</span></div><p>${esc(b.q)}</p></div>
        <div class="brief-item rv" style="--d:120ms"><div class="k"><b>做</b><span>ACTION / 我做了什么</span></div><p>${esc(b.a)}</p></div>
        <div class="brief-item rv" style="--d:240ms"><div class="k"><b>果</b><span>RESULT / 结果</span></div><p>${esc(b.r)}</p></div>
      </div><i class="hazard" aria-hidden="true"></i></section>
      ${(p.metrics || []).length ? `<section class="metrics rv" aria-label="关键数据">${p.metrics.map(([v, l]) => `<div class="metric"><b data-count>${esc(v)}</b><span>${esc(l)}</span></div>`).join('')}</section>` : ''}
      <div class="case-body">
        <nav class="toc" aria-label="本页章节">${toc.map(([k, t]) => `<a href="#ch-${k}"><b>${k}</b><span>${esc(t)}</span></a>`).join('')}</nav>
        <div class="chapters">${parts.join('')}</div>
      </div>
      <nav class="pager" aria-label="上一个与下一个项目">
        <a href="${caseUrl(prev.id)}" data-code="FILE ${prev.number} · ${esc(prev.name)}"><span class="mono">← PREV / ${prev.number}</span><b>${esc(prev.name)}</b><small>${esc(prev.cn)}</small><img src="${img(prev.brief.key)}" alt="" loading="lazy"></a>
        <a href="${caseUrl(next.id)}" data-code="FILE ${next.number} · ${esc(next.name)}"><span class="mono">NEXT / ${next.number} →</span><b>${esc(next.name)}</b><small>${esc(next.cn)}</small><img src="${img(next.brief.key)}" alt="" loading="lazy"></a>
      </nav>
      <div class="hazard" aria-hidden="true"></div>
      <div class="endbar"><span>${p.number} / ${pad2(P.projects.length)} · ${esc(p.name)}</span><span class="barcode" aria-hidden="true"></span><a href="index.html#contact" style="text-decoration:none">CONTACT →</a></div>`;

    // episode switcher (also driven by the dual-line module)
    const eps = $('#eps');
    if (eps) {
      const v = $('video', eps);
      const go = (e, play = true) => {
        $$('.ep-list button', eps).forEach(x => x.setAttribute('aria-pressed', x.dataset.ep === e ? 'true' : 'false'));
        v.poster = img(`bronze-ep${e}-1`); $('source', v).src = media(`bronze-episode-${e}.mp4`); v.load(); if (play) v.play().catch(() => {});
        $('#ep-label').textContent = `EP.${e} / 10`;
      };
      $$('.ep-list button', eps).forEach(btn => btn.addEventListener('click', () => go(btn.dataset.ep)));
      document.addEventListener('pv:episode', e => { eps.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); go(e.detail); });
    }

    // toc highlight
    const tl = $$('.toc a');
    if ('IntersectionObserver' in window) {
      const tio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) tl.forEach(a => a.classList.toggle('on', a.getAttribute('href') === `#${e.target.id}`)); }), { rootMargin: '-40% 0px -55% 0px' });
      $$('.ch').forEach(s => tio.observe(s));
    }
    initMods(p);
    lightbox();
  };

  if (document.body.dataset.page === 'case') kase(); else home();
  reveal();
  onScroll();
})();
