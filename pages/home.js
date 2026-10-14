/* Home — each scene on the index is a small poster in its own project's visual language,
   the same reference its case page opens with (R252, R447, R375, R355, R101, R456, R531, R305, R240, R501, R519).
   Every card carries the same information: a giant scene number, a subtitle-bar tag line, why / my part / output,
   the case page's chapters (read from its acts, so the anchors always exist) and the tools. */
(() => {
  const H = (window.HOMECARDS = {});
  const pad = n => String(n).padStart(2, '0');
  const info = (p, s, k, cls = '') => {
    const { esc } = k, h = s.home || {}, L = s.logline || {}, C = ((window.HOME || {}).cards || {})[p.id] || {};
    const total = ((window.PORTFOLIO || {}).projects || []).length || 11;
    const acts = (s.acts || []).filter(a => a.id && (a.toc || a.title));
    const rows = [['为什么做', C.why || L.q], ['我负责', C.mine || L.a], ['做出了什么', C.out || L.r]].filter(r => r[1]);
    return `<div class="hc-info ${cls}">
      <header class="hc-head"><b class="hc-big" aria-hidden="true">${p.number}</b><p class="hc-no"><span>SCENE ${p.number} / ${pad(total)}</span><span>${esc(p.label)}</span><span>${esc(p.year)}</span></p></header>
      <p class="hc-tag"><span>${esc(C.tag || h.tag || p.cn)}</span></p>
      <dl class="hc-qar">${rows.map(([t, d]) => `<div><dt>${t}</dt><dd>${esc(d)}</dd></div>`).join('')}</dl>
      ${acts.length ? `<nav class="hc-ch" aria-label="${esc(p.name)} 的章节"><p class="hc-ch-k">CHAPTERS · 章节</p><ol>${acts.map((a, i) => `<li><a href="${k.url(p.id)}#${encodeURIComponent(a.id)}" data-cut="${p.number}"><b>${pad(i + 1)}</b><span>${esc(String(a.toc || a.title).replace(/\n/g, ''))}</span></a></li>`).join('')}</ol></nav>` : ''}
      <div class="hc-foot"><a class="hc-go" href="${k.url(p.id)}" data-cut="${p.number}" aria-label="查看${esc(p.name)}完整项目">查看项目<i aria-hidden="true">↗</i></a><p class="hc-tools">${esc(h.tools || '')}</p></div>
    </div>`;
  };
  const img = (k, n, alt = '', cls = '') => `<img class="${cls}" src="${k.src(n)}" alt="${k.esc(alt)}" loading="lazy">`;
  const vt = t => `<span class="hc-vt">${t}</span>`;

  H.rallylens = (p, s, k) => `<div class="hc-art">
      ${img(k, 'assets/frames/rally-wide-a.webp', '研究跟拍画面', 'ht')}
      <i class="w1"></i><i class="w2"></i>${['3/5/7/7', '1/7/7/9', '1/9/6/11', '5/3/6/9', '7/9/9/12'].map(a => `<i class="bx" style="grid-area:${a}"></i>`).join('')}
      <h3 class="nm" id="st-${p.id}"><span>RALLY</span><span>LENS</span></h3>
      ${[['同', '5/4'], ['一', '5/5'], ['段', '5/6', 'inv'], ['练', '5/7'], ['习', '5/8'], ['两', '6/7', 'inv'], ['种', '6/8'], ['理', '7/7'], ['解', '7/8', 'inv']].map(([c, a, x]) => `<b class="cl ${x || ''}" style="grid-area:${a}">${c}</b>`).join('')}
      <p class="tp"><span>/&gt; G01_02 · 16 拍</span></p>
      <p class="tl"><small>逐拍标注</small>2,204</p>
    </div>${info(p, s, k)}`;

  H['privacy-city'] = (p, s, k) => `<div class="hc-art">
      <img class="bg" src="assets/home/privacy-city-iso.svg" alt="" loading="lazy">
      <h3 class="nm" id="st-${p.id}">Privacy<br>City</h3>
      <div class="dlg"><p class="t"><i></i>城市通行证 <span>REQUEST 01 / 05</span></p><p class="q">允许“城市通行证”读取你的联系邮箱？</p><p class="b"><span>拒绝</span><span class="ok">接受</span></p></div>
      <ul class="cards">${(s.stats || []).slice(0, 4).map(([v, l]) => `<li><b>${k.esc(v)}</b><span>${k.esc(l)}</span></li>`).join('')}</ul>
    </div>${info(p, s, k)}`;

  H.tennisatom = (p, s, k) => `<div class="hc-art">
      <i class="gr" aria-hidden="true"></i>
      <div class="words" aria-hidden="true"><p class="w1">TENNIS</p><p class="w2">ATOM</p></div>
      <div class="film" aria-hidden="true"><span class="hl"></span><div class="fr">${['tennis-real-1', 'tennis-real-9', 'tennis-real-5'].map(n => img(k, n, '')).join('')}</div><span class="hl"></span></div>
      <p class="vrt" aria-hidden="true">THE BODY AS DATA PORTRAIT / 2026.06.03</p>
      <div class="cp"><h3 class="nm" id="st-${p.id}">身体的肖像</h3><p class="q">${k.esc(s.sub || '')}</p></div>
      <ol class="stats">${(s.stats || []).slice(0, 4).map(([v, l]) => `<li><b>${k.esc(v)}</b><span>${k.esc(l)}</span></li>`).join('')}</ol>
    </div>${info(p, s, k)}`;

  /* 04: cover drawn in code. Catcher's view of home plate; every located Yamamoto pitch is one dot (assets/stage/yamamoto.json). */
  const ft = (n, d = 1) => (n >= 0 ? '+' : '−') + Math.abs(n).toFixed(d);
  H.baseball = (p, s, k) => {
    const st = s.stats || [], N = k.esc;
    return `<div class="hc-art">
      <p class="bar"><span>LOS ANGELES</span><i aria-hidden="true">★</i><span>STATCAST 2024—2026</span></p>
      <div class="field" data-bbhome>
        <svg class="park" viewBox="0 0 560 560" preserveAspectRatio="xMidYMid meet" role="img" aria-label="捕手视角下的本垒板与好球带，山本由伸的每个进垒位置是一个点">
          <g class="grid">${[-3, -2, -1, 0, 1, 2, 3].map(x => `<line x1="${280 + x * 84}" y1="30" x2="${280 + x * 84}" y2="530"/>`).join('')}${[1, 2, 3, 4, 5].map(z => `<line x1="24" y1="${450 - z * 70}" x2="536" y2="${450 - z * 70}"/><text x="30" y="${446 - z * 70}">${z} FT</text>`).join('')}</g>
          <g class="line"><path d="M221 458h118l12 22-71 30-71-30z"/><path d="M130 480v-220H60v220z"/><path d="M430 480v-220h70v220z"/><path d="M221 458 90 540M339 458 470 540"/><ellipse cx="280" cy="548" rx="56" ry="9"/></g>
          <rect class="zone" x="220.5" y="205" width="119" height="140"/><path class="zone2" d="M260 205v140M300 205v140M220.5 252h119M220.5 298h119"/>
        </svg>
        <canvas class="dots" aria-hidden="true"></canvas>
        <svg class="dia" viewBox="0 0 120 120" aria-hidden="true"><path d="M60 112 8 52a72 72 0 0 1 104 0z"/><path d="M60 100 24 62 60 28l36 34z"/><circle cx="60" cy="68" r="3"/><path d="M60 100v8"/></svg>
        <div class="yrs" role="group" aria-label="按赛季筛选"><button type="button" class="on" data-y="0">ALL</button><button type="button" data-y="24">2024</button><button type="button" data-y="25">2025</button><button type="button" data-y="26" class="o">2026</button></div>
        <p class="rd" aria-live="off"><span>移到点上读数</span></p>
        <div class="cnt"><span class="mono">PITCH / IMPACT</span><b data-n>4,641</b><small>PITCHES · 2024—2026</small></div>
      </div>
      <h3 class="nm" id="st-${p.id}"><span>PITCH</span><i aria-hidden="true">/</i><span>IMPACT</span></h3>
      <p class="sub">${N(s.sub || '')}</p>
      <p class="vs"><span><b>${N(st[1] ? st[1][0] : '')}</b>${N(st[1] ? st[1][1] : '')}</span><i aria-hidden="true">×</i><span class="b"><b>${N(st[2] ? st[2][0] : '')}</b>${N(st[2] ? st[2][1] : '')}</span></p>
    </div>${info(p, s, k)}`;
  };
  const initBaseball = () => document.querySelectorAll('[data-bbhome]').forEach(el => {
    const cv = el.querySelector('.dots'), cx = cv.getContext('2d'), rd = el.querySelector('.rd span'), nEl = el.querySelector('[data-n]');
    let rows = null, yr = 0, mx = null, my = null, w = 0, h = 0, sc = 1, ox = 0, oy = 0;
    const X = x => 280 + x * 84, Y = z => 450 - z * 70;
    const col = y => y === 26 ? ['#ff4f00', 1] : y === 25 ? ['#ecedef', .5] : ['#8b94a0', .75];
    const draw = () => {
      cx.clearRect(0, 0, cv.width, cv.height);
      if (!rows) return;
      const dpr = cv.width / w;
      cx.save(); cx.scale(dpr, dpr); cx.translate(ox, oy); cx.scale(sc, sc);
      [24, 25, 26].forEach(y => {
        if (yr && yr !== y) return;
        const [c, a] = col(y); cx.fillStyle = c; cx.globalAlpha = a; cx.beginPath();
        for (const r of rows) if (r[4] === y) { const px = X(r[0]), py = Y(r[1]); cx.moveTo(px + 2.2, py); cx.arc(px, py, 2.2, 0, 6.2832); }
        cx.fill();
      });
      if (mx != null) { cx.globalAlpha = 1; cx.strokeStyle = '#ff4f00'; cx.lineWidth = 1.2; cx.beginPath(); cx.arc(X(mx), Y(my), .45 * 84, 0, 6.2832); cx.stroke(); }
      cx.restore();
    };
    const fit = () => {
      const b = el.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); w = b.width; h = b.height;
      cv.width = Math.round(w * d); cv.height = Math.round(h * d);
      sc = Math.min(w / 560, h / 560); ox = (w - 560 * sc) / 2; oy = (h - 560 * sc) / 2; draw();
    };
    el.querySelectorAll('.yrs button').forEach(b => b.addEventListener('click', () => {
      yr = +b.dataset.y; el.querySelectorAll('.yrs button').forEach(x => x.classList.toggle('on', x === b)); draw();
      if (rows) nEl.textContent = rows.filter(r => !yr || r[4] === yr).length.toLocaleString('en-US');
    }));
    const near = e => {
      const b = el.getBoundingClientRect(); mx = ((e.clientX - b.left - ox) / sc - 280) / 84; my = (450 - (e.clientY - b.top - oy) / sc) / 70;
      if (!rows) return;
      const n = rows.reduce((a, r) => a + ((!yr || r[4] === yr) && (r[0] - mx) ** 2 + (r[1] - my) ** 2 < .2025 ? 1 : 0), 0);
      rd.textContent = `X ${ft(mx, 2)} FT · Z ${ft(my, 2)} FT · 半径 0.45 ft 内 ${n} 球`; draw();
    };
    el.addEventListener('pointermove', near); el.addEventListener('pointerdown', near);
    el.addEventListener('pointerleave', () => { mx = null; rd.textContent = '移到点上读数'; draw(); });
    addEventListener('resize', fit); fit();
    new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { io.disconnect(); fetch('assets/stage/yamamoto.json').then(r => r.json()).then(d => { rows = d.rows; fit(); }).catch(() => {}); } }, { rootMargin: '400px' }).observe(el);
  });
  /* scene list: a slanted preview of the project's cover follows the pointer (mouse only) */
  const initSlate = () => {
    const nav = document.querySelector('.slate'); if (!nav || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const S = window.SCENES || {}, PR = ((window.PORTFOLIO || {}).projects || []);
    const fig = document.createElement('figure'); fig.className = 'slate-pv'; fig.setAttribute('aria-hidden', 'true'); fig.innerHTML = '<img alt=""><i></i>';
    nav.appendChild(fig); const im = fig.querySelector('img');
    const src = n => (/^(assets|viz|media|demos|downloads)\//.test(n) ? n : /\.\w{3,4}$/.test(n) ? `assets/${n}` : `assets/${n}.webp`);
    let cur = '';
    nav.addEventListener('pointermove', e => {
      const a = e.target.closest('a[data-pv]');
      if (!a) { fig.classList.remove('on'); cur = ''; return; }
      const id = a.dataset.pv;
      if (id !== cur) { cur = id; const p = PR.find(x => x.id === id) || {}; const k = (S[id] || {}).key || p.cover; fig.classList.toggle('art', id === 'baseball'); if (id !== 'baseball' && k) im.src = src(k); }
      const b = nav.getBoundingClientRect();
      fig.style.transform = `translate(${Math.min(e.clientX - b.left + 24, b.width - 300)}px,${e.clientY - b.top - 90}px)`;
      fig.classList.add('on');
    });
    nav.addEventListener('pointerleave', () => { fig.classList.remove('on'); cur = ''; });
  };
  /* honours / volunteering / certificates: appended under the two research notes in #extras (data: HOME.records) */
  const initRecords = () => {
    const R = (window.HOME || {}).records; if (!R || !R.length) return;
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const put = () => {
      const sec = document.getElementById('extras'), box = sec && sec.querySelector('.extras');
      if (!box) return false;
      if (sec.querySelector('.records')) return true;
      const el = document.createElement('div'); el.className = 'records';
      el.innerHTML = R.map(g => '<section class="rec' + (g.wide ? ' lg' : '') + '"><header><span class="mono">' + esc(g.k) + '</span><h3>' + esc(g.cn) + '</h3></header><ul>' +
        g.items.map(([d, t]) => '<li>' + (d ? '<time class="mono">' + esc(d) + '</time>' : '') + '<p>' + esc(t) + '</p></li>').join('') + '</ul></section>').join('');
      box.insertAdjacentElement('afterend', el);
      const sm = sec.querySelector('#ex-h small'); if (sm) sm.textContent = '研究协作 · 荣誉';
      return true;
    };
    if (put()) return;
    const mo = new MutationObserver(() => { if (put()) mo.disconnect(); });
    mo.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => mo.disconnect(), 8000);
  };
  const initHome = () => { initBaseball(); initSlate(); initRecords(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initHome); else initHome();

  H.artemis = (p, s, k) => `<div class="hc-art">
      <i class="sl" aria-hidden="true"></i><i class="lo" aria-hidden="true"></i>
      <p class="kana" aria-hidden="true">アルテミス</p>
      <h3 class="nm" id="st-${p.id}"><span>ARTE</span><span>MIS</span></h3>
      ${img(k, 'composition/artemis-hero', '探索者角色设定', 'fig')}
      <p class="front" aria-hidden="true">RETURN<br>TO THE<br>STARS</p>
      <i class="hz" aria-hidden="true"></i>
    </div>${info(p, s, k)}`;

  H.bronze = (p, s, k) => `<div class="hc-art">
      ${img(k, s.key, '剧照', 'still')}
      <h3 class="nm" id="st-${p.id}">${vt('天命')}<small>${vt('祀与戎')}</small></h3>
      <p class="sub">${vt(k.esc(s.sub || ''))}</p>
    </div>${info(p, s, k)}`;

  H.afterglow = (p, s, k) => `<div class="hc-art">
      <h3 class="nm" id="st-${p.id}"><span>AFTER</span><span>GL<i>${img(k, 'ag-hd-key', '字环')}</i>W</span></h3>
      <p class="sub">SHANGHAI SOUTH STATION<br>上海南站 · 环境信息可视化</p>
    </div>${info(p, s, k)}`;

  H['growth-compass'] = (p, s, k) => `<div class="hc-art">
      <i class="rg r1" aria-hidden="true"></i><i class="rg r2" aria-hidden="true"></i>
      <p class="en">GROWTH<br>COMPASS</p>
      <ul class="chips">${(s.acts || []).filter(a => a.toc || a.title).slice(0, 4).map(a => `<li>${k.esc(String(a.toc || a.title).replace(/\n/g, ''))}</li>`).join('')}</ul>
      <div class="win"><p class="tb"><span>CONCEPT FILM · 概念影片</span><i></i></p>${img(k, 'assets/frames/growth-question-hd.webp', '概念影片截帧', 'pic')}</div>
      <h3 class="nm" id="st-${p.id}"><span class="o">成长</span><span class="f">罗盘</span></h3>
    </div>${info(p, s, k)}`;

  H.looplab = (p, s, k) => `<div class="hc-art">
      <div class="sheet"><i class="tp a" aria-hidden="true"></i><i class="tp b" aria-hidden="true"></i><p class="hd"><span>LL-09 · MATERIAL LOOP</span><span>A4</span></p>
        <h3 class="nm" id="st-${p.id}"><span>Loop</span><span class="b">Lab</span></h3>
        ${img(k, s.key, '概念情境插画', 'pic')}
        <p class="cols"><b>交换</b><b>团购</b><b>预约</b><b>档案</b><b>取件</b></p>
      </div>
    </div>${info(p, s, k)}`;

  H.garden = (p, s, k) => `<div class="hc-art">
      <svg width="0" height="0" style="position:absolute" aria-hidden="true"><clipPath id="hc-qf" clipPathUnits="objectBoundingBox"><circle cx=".3" cy=".3" r=".3"/><circle cx=".7" cy=".3" r=".3"/><circle cx=".3" cy=".7" r=".3"/><circle cx=".7" cy=".7" r=".3"/><rect x=".2" y=".2" width=".6" height=".6"/></clipPath></svg>
      <i class="lat" aria-hidden="true"></i><i class="sun" aria-hidden="true"></i>
      <div class="qf"><i class="ring"></i>${img(k, s.key, '秋季园景')}</div>
      <h3 class="nm" id="st-${p.id}">${vt('游园画境')}</h3>
      <p class="sub">${vt('网师园篇')}</p>
    </div>${info(p, s, k)}`;

  H.jingwai = (p, s, k) => `<div class="hc-art">
      <div class="strip"><i class="hl"></i><div class="fr">${[s.key, 'jingwai/ada-v138', 'jingwai/workbench-v138'].map(n => img(k, n, '实机帧')).join('')}</div><i class="hl"></i></div>
      <h3 class="nm" id="st-${p.id}"><span>镜外</span><small>ORPHÉE</small></h3>
      <i class="dot"></i>
    </div>${info(p, s, k)}`;
})();
