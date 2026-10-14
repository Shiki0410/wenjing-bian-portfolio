/* AFTERGLOW — bespoke page. The project's own rule: black, white, cream; no gradients, no fake 3D.
   References (number = position in _refs/pins.txt):
     title     R531  Effugio — huge split word, concentric rings replace a letter, event table below
     sheet     R541  one big ring of text on black
     question  R536  a burst of labels radiating from a black disc
     encoding  R538  white field, radial bars
     form      R526  scattered text rings on black
     space     R530  one thin ring of small type on white */
(() => {
  const PG = (window.PAGES = window.PAGES || {});
  let uid = 0;
  const ring = (text, r, cls = '', size = 400) => { const id = `agr${++uid}`; return `<svg class="g-ring ${cls}" viewBox="0 0 ${size} ${size}" aria-hidden="true"><defs><path id="${id}" d="M${size / 2} ${size / 2}m-${r} 0a${r} ${r} 0 1 1 ${2 * r} 0a${r} ${r} 0 1 1 -${2 * r} 0"/></defs><text textLength="${Math.round(2 * Math.PI * r * .992)}" lengthAdjust="spacing"><textPath href="#${id}">${text}</textPath></text></svg>`; };
  const FLOW = [24, 58, 145, 172, 98, 82, 105, 89, 81, 85, 95, 130, 185, 160, 115, 90, 68, 42, 15], NOISE = [52, 65, 88, 92, 78, 74, 79, 76, 73, 75, 78, 84, 94, 90, 82, 77, 70, 60, 50], PM = [18, 22, 35, 42, 40, 38, 45, 48, 52, 55, 50, 48, 52, 55, 58, 62, 60, 58, 52], WIND = [1.2, 1.5, 3.2, 4.5, 3.8, 2.7, 2.5, 2.1, 1.8, 2, 2.3, 3.5, 4.8, 4.2, 3, 2.4, 1.9, 1.4, 1];
  const TIMES = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'];

  /* flat four-ring version of the stage; takes over when three.js cannot load, so the stage is never an empty box */
  const fallback = host => {
    const rings = [['FLOW · 人流 · ', FLOW, 15, 200], ['NOISE · 噪声 · ', NOISE, 50, 96], ['PM2.5 · ', PM, 15, 65], ['WIND · 风 · ', WIND, .5, 5]];
    const box = document.createElement('div'); box.className = 'gf-fb';
    box.innerHTML = '<svg viewBox="0 0 600 600" role="img" aria-label="四个字环：人流、噪声、PM2.5、风，随时间滑杆变化">' + rings.map((r, i) => '<defs><path id="gfp' + i + '" d=""/></defs><text class="gfr gfr' + i + '"><textPath href="#gfp' + i + '">' + r[0] + '</textPath></text>').join('') + '<circle cx="300" cy="300" r="26" fill="#fff"/></svg><p class="mono gf-note">三维视图没有加载出来，这是同一组样本的平面版：拖动时刻，四个环的大小和字号跟着变。</p><div class="gf-ctl"><output class="mono"></output><input type="range" min="0" max="18" step="1" value="4" aria-label="时刻"><button type="button" aria-pressed="false">自动播放</button></div>';
    host.appendChild(box);
    const svg = box.querySelector('svg'), out = box.querySelector('output'), rg = box.querySelector('input'), bt = box.querySelector('button');
    const upd = () => {
      const t = Number(rg.value); out.textContent = TIMES[t] + ' · 人流 ' + FLOW[t] + ' · 噪声 ' + NOISE[t] + ' dB · PM2.5 ' + PM[t] + ' · 风 ' + WIND[t] + ' m/s';
      rings.forEach((r, i) => { const n = (r[1][t] - r[2]) / (r[3] - r[2]), R = 70 + i * 52 + n * 46, p = svg.querySelector('#gfp' + i), tx = svg.querySelector('.gfr' + i), tp = tx.querySelector('textPath'); p.setAttribute('d', 'M' + (300 - R) + ' 300a' + R + ' ' + R + ' 0 1 1 ' + (2 * R) + ' 0a' + R + ' ' + R + ' 0 1 1 ' + (-2 * R) + ' 0'); tx.style.fontSize = (11 + n * 13).toFixed(1) + 'px'; tx.setAttribute('textLength', Math.round(2 * Math.PI * R * .99)); tx.setAttribute('lengthAdjust', 'spacing'); tx.style.opacity = (.55 + n * .45).toFixed(2); const fs = 11 + n * 13, rep = Math.max(1, Math.round(2 * Math.PI * R / (fs * .78 * r[0].length))); tp.textContent = r[0].repeat(rep); });
    };
    let timer = 0; const stop = () => { clearInterval(timer); timer = 0; bt.setAttribute('aria-pressed', 'false'); };
    rg.addEventListener('input', () => { stop(); upd(); });
    bt.addEventListener('click', () => { if (timer) { stop(); return; } bt.setAttribute('aria-pressed', 'true'); timer = setInterval(() => { rg.value = (Number(rg.value) + 1) % 19; upd(); }, 700); });
    upd();
  };

  PG.afterglow = {
    /* ---------- R531 ---------- */
    title(k) {
      const { p, s, esc } = k;
      return `<section class="g-title" aria-labelledby="tc-name">
        <h1 class="gt-word" id="tc-name"><span data-t="AFTER">AFTER</span><span>GL<i class="gt-o"><img src="assets/ag-hd-key.webp" alt="AFTERGLOW 字环：V4 代码按 08:00 样本渲染" fetchpriority="high"></i>W</span></h1>
        <p class="gt-sub">${esc(s.sub)}</p>
        <table class="gt-table"><tbody>${(s.meta || []).map(([a, b]) => `<tr><th>${esc(a)}</th><td>${esc(b)}</td></tr>`).join('')}<tr><th>TEAM</th><td>${esc(s.stripB)}</td></tr></tbody></table>
        <p class="gt-side mono">LIVING GLYPH RING · SHANGHAI SOUTH · 余晖环</p>
        <a class="gt-back mono" href="index.html#scene-${p.id}" data-cut="INDEX">← INDEX</a>
      </section>`;
    },

    /* ---------- R541 ---------- */
    logline(k) {
      const { s, md, esc } = k, L = s.logline || {};
      return `<section class="g-big" aria-label="项目摘要">
        ${ring('AFTERGLOW · 人流 · 噪声 · PM2.5 · 风 · 上海南站 · ', 182, 'gb-r')}
        <div class="gb-in">${[['問', L.q], ['做', L.a], ['果', L.r]].map(([c, t]) => `<p><b>${c}</b>${md(t)}</p>`).join('')}</div>
        <ul class="gb-stats">${(s.stats || []).map(([v, l]) => `<li><b>${esc(v)}</b><span>${esc(l)}</span></li>`).join('')}</ul>
      </section>`;
    },

    after(root) {
      const host = root.querySelector('.gf-stage'); if (!host || host._fb) return; host._fb = 1;
      const chk = () => { if (host.querySelector('.st-fail') && !host.querySelector('.gf-fb')) fallback(host); };
      new MutationObserver(chk).observe(host, { subtree: true, attributes: true, attributeFilter: ['class'], childList: true }); chk();
    },

    act(a, i, k) { const f = this['a_' + a.id]; return f ? f.call(this, a, k, k.use(a)) : null; },

    /* ---------- R536 ---------- */
    a_question(a, k, u) {
      const { esc, md } = k;
      return `<header class="g-burst">
          <div class="gq-disc"><ol class="gq-ticks" aria-hidden="true">${TIMES.map((t, i) => { const a = (i / TIMES.length) * 360 - 90; return `<li class="${a > 90 ? 'flip' : ''}" style="--a:${a}deg;--l:${((NOISE[i] - 50) / 46).toFixed(3)};--f:${((FLOW[i] - 15) / 185).toFixed(3)}"><span>${t}</span></li>`; }).join('')}</ol><b class="gq-n" aria-hidden="true">${esc(a.open.num)}</b></div>
          <div class="gq-copy"><p class="mono">${esc(a.kicker)} · ${esc(a.open.unit)}</p><h2>${md(a.title)}</h2><p>${md(a.lead)}</p><small class="mono">${esc(a.open.label)}</small><small class="mono gq-key">刻度线长 = 噪声 · 字号 = 人流（都取 V4 内置样本）</small></div>
        </header>
        <section class="g-live" aria-label="${esc(u.o(0).sub)}">
          <h3 class="gl-h">${esc(u.o(0).sub)}</h3>
          ${u.b(1)}
          <div class="gl-row"><div class="gl-t">${u.b(2)}</div><ol class="gl-mine">${(u.o(3).list || []).map(t => `<li>${md(t)}</li>`).join('')}</ol></div>
          ${u.b(4)}
        </section>
        ${u.rest()}`;
    },

    /* ---------- R538 ---------- */
    a_encoding(a, k, u) {
      const { esc, md } = k;
      const words = (a.open.words || []).map(w => String(w).split(/[|@]/)[0]);
      const pairs = [[words[0], words[1]], [words[2], words[3]], [words[4], words[5]], [words[6], words[7]]];
      return `<header class="g-wheel">
          <div class="gw-bars" aria-hidden="true">${Array.from({ length: 64 }, (_, i) => `<i style="--a:${i * 360 / 64}deg;--l:${30 + ((i * 37) % 50)}%"></i>`).join('')}</div>
          <ol class="gw-pairs">${pairs.map(([s1, s2], i) => `<li class="p${i}"><b>${esc(s1)}</b><span>${esc(s2)}</span></li>`).join('')}</ol>
          <div class="gw-copy"><h2>${md(a.title)}</h2><p>${md(a.lead)}</p><small class="mono">${esc(a.kicker)}</small></div>
        </header>
        <section class="g-enc" aria-label="编码">${u.b(0)}</section>
        <section class="g-split" aria-label="${esc(u.o(1).sub)}">
          <h3 class="gl-h">${esc(u.o(1).sub)}</h3>
          ${u.b(2)}
          <ol class="gs-3">${(u.o(3).list || []).map(([h, t]) => `<li><h4>${esc(h)}</h4><p>${esc(t)}</p></li>`).join('')}</ol>
        </section>
        <section class="g-boards" aria-label="${esc(u.o(4).sub)}">
          <h3 class="gl-h">${esc(u.o(4).sub)}</h3>
          ${u.b(5)}
        </section>
        <section class="g-rules" aria-label="${esc(u.o(6).sub)}">
          <h3 class="gl-h">${esc(u.o(6).sub)}</h3>
          <ol class="gr-4">${(u.o(7).list || []).map(([h, t], j) => `<li>${ring(`${h} · ${h} · `, 60, 'gr-r', 140)}<b>${j + 1}</b><h4>${esc(h)}</h4><p>${esc(t)}</p></li>`).join('')}</ol>
        </section>
        ${u.rest()}`;
    },

    /* ---------- R526 ---------- */
    a_form(a, k, u) {
      const { esc, md, stageEl } = k;
      const vs = u.o(1).list || [];
      return `<header class="g-scatter">
          ${ring('V1 · 平而密 · 放射排版 · ', 120, 's1', 300)}${ring('V2 · 同心环 · 切片遮罩 · ', 120, 's2', 300)}${ring('V3 · 每个字自己变形 · ', 120, 's3', 300)}
          <div class="gf-stage">${stageEl(a.open.stage, a.open.opt || {}, a.open.label)}</div>
          <div class="gf-copy"><p class="mono">${esc(a.kicker)}</p><h2>${md(a.title)}</h2><p>${md(a.lead)}</p><small class="mono">${esc(a.open.cap)}</small></div>
        </header>
        <section class="g-vers" aria-label="${esc(u.o(0).sub)}">
          <h3 class="gl-h">${esc(u.o(0).sub)}</h3>
          <ol class="gv-4">${vs.map(([h, t], j) => `<li><b>${esc(h.split(' ')[0])}</b><span class="mono">${esc(h.split('·')[1] || '')}</span><p>${esc(t)}</p></li>`).join('')}</ol>
        </section>
        <section class="g-bridge" aria-label="${esc(u.o(2).sub)}">
          <h3 class="gl-h">${esc(u.o(2).sub)}</h3>
          <div class="gbr-f">${u.b(3)}</div>
          <ol class="gbr-in">${(u.o(4).list || []).map(([h, t]) => `<li><h4>${esc(h)}</h4><p>${esc(t)}</p></li>`).join('')}</ol>
          ${u.b(5)}
        </section>
        <section class="g-day" aria-label="${esc(u.o(6).sub)}">
          <h3 class="gl-h">${esc(u.o(6).sub)}</h3>
          ${u.b(7)}${u.b(8)}
          <details class="gd-t"><summary>V4 内置的 19 个样本（照抄 CSV_FALLBACK）</summary>${u.b(9)}</details>
          ${u.b(10)}
        </section>
        <section class="g-three" aria-label="${esc(u.o(11).sub)}">
          <h3 class="gl-h"><span>LOW</span><span>MID</span><span>HIGH</span></h3>
          <p class="g3-sub">${esc(u.o(11).sub)}</p>
          ${u.b(12)}${u.b(13)}
        </section>
        ${u.rest()}`;
    },

    /* ---------- R530 ---------- */
    a_space(a, k, u) {
      const { esc, md, src } = k;
      return `<header class="g-thin">
          ${ring('PAPER · SCREEN · DOME · 纸面 · 屏幕 · 穹顶 · 远看轮廓 · 近看纹理 · 还是方案 · PAPER · SCREEN · DOME · 纸面 · 屏幕 · 穹顶 · ', 186, 'gth-r')}
          <img class="gth-img" src="${src(a.open.img)}" alt="${esc(a.open.cap)}" loading="lazy">
          <p class="gth-script" aria-hidden="true">${esc(a.open.script)}</p>
          <div class="gth-copy"><h2>${md(a.title)}</h2><p>${md(a.lead)}</p><small class="mono">${esc(a.kicker)} · ${esc(a.open.cap)}</small></div>
        </header>
        <section class="g-paper" aria-label="${esc(u.o(0).sub)}">
          <h3 class="gl-h">${esc(u.o(0).sub)}</h3>
          <div class="gp-a">${u.b(1)}</div>
          <div class="gp-b">${u.b(2)}</div>
          <ol class="gp-3">${(u.o(3).list || []).map(([h, t]) => `<li><h4>${esc(h)}</h4><p>${esc(t)}</p></li>`).join('')}</ol>
        </section>
        <section class="g-out" aria-label="${esc(u.o(4).sub)}">
          <h3 class="gl-h">${esc(u.o(4).sub)}</h3>
          ${u.b(5)}${u.b(6)}${u.b(7)}
        </section>
        ${u.rest()}`;
    }
  };
})();
