/* RallyLens — bespoke page.
   Newsprint system: halftone footage, cobalt construction lines, typewriter notes, ○ / □ for the two partners.
   Each section is built from one reference on the board (_refs/pins.txt, number = position in the file):
     title    R252  Ian Curtis poster — halftone portrait, construction boxes, letters in cells, black date tape
     sheet    R203  inuko! profile sheet — ruled rows, big ratio with an asterisk, bracket tags, thin "?", heavy logo
     film     R334  The Mandalika — dark track map, edge labels, white label with a pixel-stair edge
     why      R193  manga page (two panels, two balloons) · R244 grid system · R349 Strava year-in-sport
     turn     R236  POLYMER 48 (giant numerals on white) · R349 lollipop · R203 tags again for the two partners
     design   R271  blueprint call-outs
     next     R211  P3 character poster — figure in front of giant type, script across, quote box */
(() => {
  const PG = (window.PAGES = window.PAGES || {});
  const at = (a, m) => `--a:${a}${m ? `;--m:${m}` : ''}`;
  const tag = (t, cls = '') => `<span class="r-tag ${cls}">[ ${t} ]</span>`;
  const pix = (n, seed) => { let s = seed; const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); return Array.from({ length: n }, (_, i) => `<i style="--x:${Math.floor(r() * 6)};--y:${i}"></i>`).join(''); };
  const bar = '<i class="r-bar" aria-hidden="true"></i>';
  const glyph = d => (d === 'a' ? '○' : d === 'b' ? '□' : '◇');

  /* 2026-10-13: evidence-led layouts, keyed by block.key rather than legacy indices.
     Sources: main §§3–6, Tables 1–4; supplement S1–S6, Tables S3/S7, Figs S1/S2/S4.
     All local modules are registered on the existing MODULES object. No shared files changed. */
  const E = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const source = s => s ? `<p class="r26-source">${E(s)}</p>` : '';
  const paras = s => [].concat(s || []).map(p => `<p>${E(p)}</p>`).join('');
  const section = (b, body, cls = '') => `<section class="r26-section ${cls}" data-noeva data-block-key="${E(b.key || '')}">${b.h ? `<h3>${E(b.h)}</h3>` : ''}${b.p ? `<div class="r26-copy">${paras(b.p)}</div>` : ''}${body}${b.foot ? `<p class="r26-foot">${E(b.foot)}</p>` : ''}${source(b.src)}</section>`;

  /* head motifs drawn in code after the reference board: D01 slant, D09 reticle, D19 track line, D06 numeral */
  const motif = id => {
    const W = 560, H = 300, st = 'fill="none" stroke="currentColor"';
    const hits = [0.63, 6.8, 7.86, 8.76, 9.39, 10.2, 16.06, 16.94, 17.71, 18.44, 19.07, 19.67, 20.21, 27.4, 28.19, 28.89];
    let b = '';
    if (id === 'film') {
      const X = t => 20 + t / 30 * 520, ys = { A: 90, B: 210, U: 150 }, d = [0, 1, 0, 1, 2, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0, 1].map(k => ['A', 'B', 'U'][k]);
      b = '<path ' + st + ' stroke-width="2" d="M' + hits.map((t, i) => X(t) + ' ' + ys[d[i]]).join('L') + '"/>' + hits.map((t, i) => d[i] === 'A' ? '<circle cx="' + X(t) + '" cy="90" r="9" fill="currentColor"/>' : d[i] === 'B' ? '<rect x="' + (X(t) - 8) + '" y="202" width="16" height="16" fill="currentColor"/>' : '<path d="M' + X(t) + ' 140l9 10-9 10-9-10z" ' + st + ' stroke-width="2"/>').join('') + '<text x="20" y="40" class="m">G01_02 · 525—555 s</text><text x="540" y="276" text-anchor="end" class="m">16 HITS / 4 RALLIES</text>';
    } else if (id === 'why') {
      b = '<path d="M0 300L330 0H560V300Z" fill="currentColor" opacity=".18"/><circle cx="150" cy="110" r="70" ' + st + ' stroke-width="3"/><rect x="330" y="150" width="130" height="130" ' + st + ' stroke-width="3"/><path d="M150 110L395 215" ' + st + ' stroke-width="1.5" stroke-dasharray="5 5"/><text x="20" y="276" class="m">1 HOUR · 2 FRIENDS · 1 COURT</text>';
    } else if (id === 'method') {
      b = '<g ' + st + ' stroke-width="1.6"><rect x="40" y="40" width="480" height="220"/><path d="M280 40V260M40 150H520M40 70H520M40 230H520M160 40V260M400 40V260"/></g><circle cx="150" cy="95" r="9" fill="currentColor"/><rect x="392" y="190" width="16" height="16" fill="currentColor"/><path d="M150 95Q280 -10 400 198" ' + st + ' stroke-width="2" stroke-dasharray="6 5"/><text x="40" y="288" class="m">STAGE 01—04 · 50–60 MIN</text>';
    } else if (id === 'how') {
      b = '<circle cx="330" cy="150" r="100" ' + st + ' stroke-width="1.4"/><circle cx="330" cy="150" r="44" ' + st + ' stroke-width="1.4"/><path d="M180 150H480M330 20V280" ' + st + ' stroke-width="1.4"/><circle cx="330" cy="150" r="7" fill="currentColor"/><text x="350" y="138" class="m">6.80 s</text><text x="350" y="170" class="m">P02 → P01</text><text x="20" y="276" class="m">±350 MS · 302 / 305</text>';
    } else if (id === 'findings') {
      b = '<text x="540" y="210" text-anchor="end" class="big">1/16</text><rect x="260" y="30" width="120" height="30" ' + st + ' stroke-width="1.6"/><text x="270" y="51" class="m">[ SAME PLAN ]</text><rect x="400" y="30" width="120" height="30" ' + st + ' stroke-width="1.6"/><text x="410" y="51" class="m">[ OPPOSITE ]</text><text x="540" y="260" text-anchor="end" class="m">TABLE 2 · 16 ROLE STAGES</text>';
    } else if (id === 'dpe') {
      b = [0, 1, 2, 3, 4, 5, 6].map(i => '<path d="M' + (60 + i * 24) + ' ' + (190 - i * 20) + 'l200-60 200 60-200 60z" ' + st + ' stroke-width="1.6" opacity="' + (1 - i * .09) + '"/>').join('') + '<text x="20" y="40" class="m">DYADIC PRACTICE EPISODE</text><text x="540" y="276" text-anchor="end" class="m">7 LAYERS · 12 DPE · 160 EVENTS</text>';
    } else {
      b = '<circle cx="300" cy="150" r="110" ' + st + ' stroke-width="1.6"/><circle cx="300" cy="150" r="70" ' + st + ' stroke-width="1.6" stroke-dasharray="4 5"/><path d="M190 150H410M300 40V260" ' + st + ' stroke-width="1"/><rect x="258" y="108" width="84" height="84" ' + st + ' stroke-width="2"/><text x="20" y="276" class="m">DESIGN PROBE · 3 LAYERS</text>';
    }
    return '<svg class="r27-motif" viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true">' + b + '</svg>';
  };
  const head = a => `<header class="r26-head" data-noeva data-act="${E(a.id)}"><p class="mono">${E(a.kicker)}</p><h2>${E(a.title).replace(/\n/g,'<br>')}</h2><p>${E(a.lead)}</p>${motif(a.id)}<span class="r26-partner" aria-hidden="true">○ / □</span></header>`;
  const mark = (d,x,y,r=5) => d === 'A_to_B' ? `<circle class="r26-ab" cx="${x}" cy="${y}" r="${r}"/>` : d === 'B_to_A' ? `<rect class="r26-ba" x="${x-r}" y="${y-r}" width="${r*2}" height="${r*2}"/>` : `<path class="r26-unknown" d="M${x} ${y-r-1}l${r+1} ${r+1}-${r+1} ${r+1}-${r+1}-${r+1}Z"/>`;
  const svg = (w,h,title,body,desc='') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${E(title)}"><title>${E(title)}</title><desc>${E(desc || title)}</desc>${body}</svg>`;
  const parentDims = [['response_continuity','回应连续'],['technique_transition','技术转换'],['placement_line_control','落点 / 线路'],['spatial_coverage','空间覆盖'],['movement_demand','移动需求'],['recovery_readiness','回位准备'],['rhythm_stability_variation','节奏稳定 / 变化'],['decision_pressure','决策压力']];
  const parentPlot = (event, width) => {
    const W = Math.max(280,width), narrow = W < 520, left = narrow ? 18 : 142, right = W-18, top = 46, rowH = narrow ? 65 : 45, H = top+8*rowH+34;
    const X = v => left+(right-left)*v/100;
    let g = `<text x="18" y="17" class="r26-svg-label">○ Offer　■ Actual（导出字段）</text>`;
    [0,25,50,75,100].forEach(v => { g += `<line class="r26-gridline" x1="${X(v)}" x2="${X(v)}" y1="30" y2="${H-29}"/><text class="r26-svg-label" x="${X(v)}" y="${H-10}" text-anchor="${v===0?'start':v===100?'end':'middle'}">${v}</text>`; });
    parentDims.forEach(([key,label],i) => {
      const a=event['offer_'+key], b=event['actual_'+key], y=top+i*rowH+(narrow?26:14), known=event.direction!=='unknown';
      g += `<text class="r26-svg-label" x="${narrow?18:0}" y="${narrow?y-19:y+4}">${E(label)}</text>`;
      if(known && a != null && b != null) {
        g += `<line class="r26-pairline" x1="${X(a)}" x2="${X(b)}" y1="${y}" y2="${y}"/><circle class="r26-offer" cx="${X(a)}" cy="${y}" r="4"/><rect class="r26-actual" x="${X(b)-4}" y="${y-4}" width="8" height="8"/>`;
        const xx=Math.min(right-5,Math.max(X(a),X(b))+11), anchor=xx>right-98?'end':'start';
        g += `<text class="r26-svg-number" x="${anchor==='end'?right:xx}" y="${narrow?y+20:y+4}" text-anchor="${anchor}">${a.toFixed(2)} / ${b.toFixed(2)}</text>`;
      } else g += `<text class="r26-svg-label" x="${left+12}" y="${y+4}">◇ 方向未定 · 不展示估计</text>`;
    });
    return svg(W,H,'八个父维度的 Offer 与 Actual 导出字段，统一 0—100 尺度',g,'接触已记录时保留模型候选，无回应为零，不可观察为缺失；不是训练评分，未知方向不展示估计。');
  };
  // Supplement Table S3, literal registry, not synthetic observations.
  const registry = [
    ['G01_01',3,1,9,5,4,0,'P01 / P02','—','335.5–358.3'],['G01_02',3,2,16,7,7,2,'P01 / P02','C01 · 同片段','525.6–553.9'],['G01_03',3,4,6,2,3,1,'P01 / P02','C01 · 同片段','395.7–400.6'],['G01_04',2,2,13,6,6,1,'P01 / P02','—','135.7–164.0'],
    ['G03_01',3,1,13,7,5,1,'P05 / P06','—','75.3–104.8'],['G03_02',3,2,16,8,8,0,'P05 / P06','C03 · 相关阶段 3，非同片段','271.8–295.7'],['G03_03',3,3,13,7,6,0,'P05 / P06','C03 · 同片段','225.5–254.6'],['G03_04',2,3,15,8,6,1,'仅 P06','—','199.5–222.6'],
    ['G07_01',1,1,25,13,9,3,'P09 / P10','C02 · 同片段 · 二次读片','15.3–41.6'],['G07_02',1,2,8,3,4,1,'P09 / P10','C04、C07 · 同片段','411.8–433.9'],['G07_03',1,3,14,6,7,1,'P09 / P10','C02、C07 · 同片段','270.1–299.8'],['G07_04',1,4,12,6,6,0,'P09 / P10','C02 · 同片段 · 二次读片','241.8–268.7']
  ];
  const M = window.MODULES = window.MODULES || {};
  const localModule = (name,opt={}) => `<div class="mod-mount r26-module" data-mod="${name}" data-opt='${E(JSON.stringify(opt))}'>${M[name].html(null,opt)}</div>`;
  /* ------------------------------------------------------------------
     30-second clip explorer (paper Fig.1a · Fig.S4 · event table rally-g01_02.json)
     Three views read the same 16 events at three grains:
       all  – the whole clip: four rallies on a real-seconds (or event-order) axis
       r3   – rally 3 alone: the hit-by-hit ladder and the gap between hits
       win  – the five overlapping 10 s reporting windows (Fig.S4)
     A cursor (play / scrub / click a hit) drives the schematic court and the hit card.
     The court is a schematic: sides come from the direction field, positions are not measured. */
  const gly = (d, s = 12) => `<svg class="r26-gly" width="${s}" height="${s}" viewBox="0 0 12 12" aria-hidden="true">${d === 'A_to_B' ? '<circle cx="6" cy="6" r="4.6" class="r26-ab"/>' : d === 'B_to_A' ? '<rect x="1.6" y="1.6" width="8.8" height="8.8" class="r26-ba"/>' : '<path d="M6 .9 11.1 6 6 11.1.9 6Z" class="r26-unknown"/>'}</svg>`;
  const who = d => d === 'A_to_B' ? 'P01 → P02' : d === 'B_to_A' ? 'P02 → P01' : '方向未知';
  const stateText = {
    observed_contact_model_estimate: ['接触已确认', '回应方碰到了球；回应里的内容仍是模型候选'],
    observed_no_response_zero: ['没有回应', '对方没有接到，Actual-evidence 记为 0'],
    not_observable_unknown: ['看不清', '回应无法观察，Actual-evidence 留空，不用模型填']
  };
  const stateMark = (st, x, y) => st === 'observed_no_response_zero' ? `<path class="r26-stop" d="M${x - 5} ${y - 5}l10 10m0-10-10 10"/>` : st === 'not_observable_unknown' ? `<text class="r26-svg-label" x="${x}" y="${y + 5}" text-anchor="middle">?</text>` : '';
  const trackHTML = opt => `<div class="r26-track">
    <div class="r26-controls" role="group" aria-label="选择观看尺度">${opt.modes.map((m, i) => `<button type="button" data-mode="${m.id}" aria-pressed="${!i}"><b>${E(m.label)}</b><small>${E(m.grain)}</small></button>`).join('')}</div>
    <div class="r26-xp">
      <div class="r26-xp-stage">
        <div class="r26-court-card"><div class="r26-court-top"><span class="r26-court-tag"></span><span class="r26-court-time"></span></div><div class="r26-court" role="img" aria-label="示意球场：球在 P01 与 P02 之间往返"></div><p class="r26-court-note">示意图：左右两侧来自方向字段，没有实测位置。</p></div>
        <div class="r26-play" role="group" aria-label="播放控制">
          <button type="button" data-play aria-pressed="false" aria-label="播放"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path class="p" d="M4 2.5v11l9-5.5z"/><path class="q" d="M3.5 2.5h3.2v11H3.5zM9.3 2.5h3.2v11H9.3z"/></svg></button>
          <input type="range" aria-label="片段内时间" min="0" max="30" step="0.01" value="6.8">
          <button type="button" data-speed aria-pressed="false">0.5×</button>
        </div>
      </div>
      <div class="r26-xp-read">
        <div class="r26-track-head" aria-live="polite"></div>
        <div class="r26-chips" role="group" aria-label="按回应状态突出显示"></div>
        <div class="r26-hit-card" aria-live="polite"></div>
      </div>
    </div>
    <div class="r26-locator" aria-hidden="true"></div>
    <div class="r26-track-svg"></div>
    <p class="r26-legend"><span>${gly('A_to_B')} P01 → P02</span><span>${gly('B_to_A')} P02 → P01</span><span>${gly('unknown')} 方向未知</span><span><svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path class="r26-stop" d="M1.5 1.5l9 9m0-9-9 9"/></svg> 没有回应</span><span>? 回应看不清</span></p>
    <div class="r26-hit-buttons" role="group" aria-label="选择击球事件"></div>
    <p class="r26-source">Fig.1(a) · Fig.S4 · 逐事件表 rally-g01_02.json：横轴取真实秒数和回合编号。</p></div>`;

  /* geometry shared by timeline drawing and cursor update */
  const tlGeom = (mode, axis, W) => {
    const left = W < 520 ? 40 : 56, right = W - 16, dom = mode.domain;
    const Xt = t => left + (t - dom[0]) / (dom[1] - dom[0]) * (right - left);
    const X = mode.id === 'all' && axis === 'order' ? e => left + 16 + (e.n - 1) / 15 * (right - left - 32) : e => Xt(e.t);
    return { left, right, X, Xt, dom };
  };
  const trackSVG = (events, mode, axis, W, sel, stateFilter, win) => {
    const G = tlGeom(mode, axis, W), { left, right, X, Xt, dom } = G, narrow = W < 520;
    const inMode = events.filter(e => !mode.rally || e.r === mode.rally);
    const dim = e => (stateFilter && e.st !== stateFilter) || (win != null && !(e.t >= mode.windows[win][0] && e.t <= mode.windows[win][1]));
    const hitAttrs = e => `data-hit="${e.n}" tabindex="0" role="button" aria-label="第 ${e.n} 拍，${e.t.toFixed(2)} 秒，${who(e.dir)}"`;
    let g = '', H, cursorBottom;
    if (mode.id === 'r3') {
      // hit ladder: P01 lane above, P02 lane below, flights curved between consecutive hits, gaps measured underneath
      const yA = 70, yU = 110, yB = 150; H = 338; cursorBottom = 306;
      g += `<defs><marker id="r26-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4 0 8Z" class="r26-arrowhead"/></marker></defs>`;
      g += `<text class="r26-svg-label" x="0" y="${yA + 4}">P01</text><text class="r26-svg-label" x="0" y="${yB + 4}">P02</text>`;
      g += `<line class="r26-gridline" x1="${left}" x2="${right}" y1="${yA}" y2="${yA}"/><line class="r26-gridline" x1="${left}" x2="${right}" y1="${yB}" y2="${yB}"/>`;
      const Y = e => e.dir === 'A_to_B' ? yA : e.dir === 'B_to_A' ? yB : yU;
      for (let i = 1; i < inMode.length; i++) {
        const a = inMode[i - 1], b = inMode[i], ok = a.dir !== 'unknown' && b.dir !== 'unknown' && a.dir !== b.dir;
        const x1 = X(a), x2 = X(b), y1 = Y(a), y2 = Y(b);
        if (ok) g += `<path class="r26-flight" d="M${x1} ${y1}Q${(x1 + x2) / 2 + (y1 < y2 ? 16 : -16)} ${(y1 + y2) / 2} ${x2 - (x2 - x1) * .06} ${y2 + (y1 < y2 ? -14 : 14)}" marker-end="url(#r26-arrow)"/>`;
        else g += `<path class="r26-flight dashed" d="M${x1} ${y1}L${x2} ${y2}"/>`;
      }
      inMode.forEach(e => {
        const x = X(e), y = Y(e), s = e.n === sel;
        g += `<g class="r26-hit${dim(e) ? ' dim' : ''}" ${hitAttrs(e)}>${s ? `<circle class="r26-selection" cx="${x}" cy="${y}" r="17"/>` : ''}<circle r="16" cx="${x}" cy="${y}" fill="transparent"/>${mark(e.dir, x, y, 9)}<text class="r26-svg-label" x="${x}" y="${e.dir === 'B_to_A' ? y + 33 : y - 20}" text-anchor="middle">#${String(e.n).padStart(2, '0')}</text>${e.st === 'observed_no_response_zero' ? `<path class="r26-stop" d="M${x - 6} ${y + 17}l12 12m0-12-12 12"/><text class="r26-svg-label" x="${x}" y="${y + 46}" text-anchor="middle">无回应</text>` : ''}</g>`;
      });
      [16, 17, 18, 19, 20].forEach(t => { if (t >= dom[0] && t <= dom[1]) g += `<line class="r26-gridline" x1="${Xt(t)}" x2="${Xt(t)}" y1="206" y2="212"/><text class="r26-svg-label" x="${Xt(t)}" y="226" text-anchor="middle" style="opacity:.65">${t} s</text>`; });
      const yG = 238, bh = 50;
      g += `<text class="r26-svg-label strong" x="0" y="${yG}">相邻两拍的间隔（秒）</text>`;
      const gaps = inMode.slice(1).map((e, i) => ({ g: e.t - inMode[i].t, x1: X(inMode[i]), x2: X(e) }));
      const gMax = Math.max(...gaps.map(q => q.g));
      const base = yG + 14 + bh;
      g += `<line class="r26-gridline" x1="${left}" x2="${right}" y1="${base}" y2="${base}" style="opacity:.5"/>`;
      gaps.forEach(q => { const h = q.g / gMax * bh, w = Math.max(8, Math.min(60, (q.x2 - q.x1) * .55)), cx = (q.x1 + q.x2) / 2; g += `<rect class="r26-gapbar" x="${cx - w / 2}" y="${base - h}" width="${w}" height="${h}"/><text class="r26-svg-number" x="${cx}" y="${base - h - 5}" text-anchor="middle">${q.g.toFixed(2)}</text>`; });
      const total = inMode.at(-1).t - inMode[0].t;
      g += `<text class="r26-svg-label" x="${left}" y="${H - 6}">#${String(inMode[0].n).padStart(2, '0')} → #${String(inMode.at(-1).n).padStart(2, '0')}：${inMode.length} 拍，共 ${total.toFixed(2)} s；柱高从零起算</text>`;
    } else {
      const yA = 62, yB = 118; H = mode.id === 'win' ? 414 : 236; cursorBottom = mode.id === 'win' ? 366 : 150;
      g += `<text class="r26-svg-label" x="0" y="${yA + 4}">P01</text><text class="r26-svg-label" x="0" y="${yB + 4}">P02</text>`;
      g += `<line class="r26-gridline" x1="${left}" x2="${right}" y1="${yA}" y2="${yA}"/><line class="r26-gridline" x1="${left}" x2="${right}" y1="${yB}" y2="${yB}"/>`;
      const Y = e => e.dir === 'A_to_B' ? yA : e.dir === 'B_to_A' ? yB : (yA + yB) / 2;
      const timeAxis = !(mode.id === 'all' && axis === 'order');
      if (timeAxis) [0, 5, 10, 15, 20, 25, 30].forEach(t => g += `<line class="r26-gridline" x1="${Xt(t)}" x2="${Xt(t)}" y1="30" y2="${yB + 28}"/><text class="r26-svg-label" x="${Xt(t)}" y="${yB + 44}" text-anchor="${t === 0 ? 'start' : t === 30 ? 'end' : 'middle'}">${t}s</text>`);
      [...new Set(inMode.map(e => e.r))].forEach(r => {
        const a = inMode.filter(e => e.r === r), x1 = X(a[0]), x2 = X(a.at(-1)), bx = Math.max(left - 4, x1 - 10), bw = Math.max(20, x2 - x1 + 20);
        g += `<rect class="r26-rallyband" x="${bx}" y="26" width="${bw}" height="${yB - 26 + 28}"/><text class="r26-svg-label strong" x="${bx + bw / 2}" y="16" text-anchor="middle">R${r}</text>`;
        for (let i = 1; i < a.length; i++) if (a[i - 1].dir !== 'unknown' && a[i].dir !== 'unknown') g += `<line class="r26-pairline" x1="${X(a[i - 1])}" x2="${X(a[i])}" y1="${Y(a[i - 1])}" y2="${Y(a[i])}"/>`;
        if (mode.id === 'all') g += `<text class="r26-svg-label" x="${Math.min(right - 2, Math.max(left + 14, bx + bw / 2))}" y="${yB + 66}" text-anchor="middle" style="font-size:11.5px">${a.length} 拍${r === 4 ? ' · 被截断' : ''}</text>`;
      });
      inMode.forEach(e => {
        const x = X(e), y = Y(e), s = e.n === sel;
        g += `<g class="r26-hit${dim(e) ? ' dim' : ''}" ${hitAttrs(e)}>${s ? `<circle class="r26-selection" cx="${x}" cy="${y}" r="11"/>` : ''}<circle r="12" cx="${x}" cy="${y}" fill="transparent"/>${mark(e.dir, x, y, 5)}${stateMark(e.st, x, y + 19)}${!timeAxis ? `<text class="r26-svg-label" x="${x}" y="${e.dir === 'B_to_A' ? y + 33 : y - 12}" text-anchor="middle" style="font-size:11px">#${e.n}</text>${narrow ? '' : `<text class="r26-svg-label" x="${x}" y="${e.dir === 'B_to_A' ? y + 45 : y - 23}" text-anchor="middle" style="font-size:10px;opacity:.6">${e.t.toFixed(1)}s</text>`}` : ''}</g>`;
      });
      if (mode.id === 'all') {
        g += `<text class="r26-svg-label" x="${left}" y="${H - 14}">${timeAxis ? '横轴是真实秒数。R1 一拍出界，R2 和 R3 以出界结束，R4 被片段边界截断。' : '16 拍按事件顺序等距排列（论文 Fig.1a 的排法），间距不表示时间。'}</text>`;
      } else {
        mode.windows.forEach(([lo, hi, count], i) => { const y = 176 + i * 36, on = win === i; g += `<g class="r26-win${on ? ' on' : ''}" data-win="${i}" tabindex="0" role="button" aria-pressed="${on}" aria-label="${lo} 到 ${hi} 秒，${count} 拍"><rect class="r26-window" x="${Xt(lo)}" y="${y}" width="${Xt(hi) - Xt(lo)}" height="28"/><text class="r26-svg-label" x="${Xt(lo) + 8}" y="${y + 18}">${lo}–${hi} s · ${count} 拍</text></g>`; });
        g += `<text class="r26-svg-label" x="${left}" y="${H - 8}">窗口长 10 s、步长 5 s，相邻窗口重叠；点窗口可只看窗口里的事件。</text>`;
      }
    }
    g += `<line class="r26-cursor" x1="0" x2="0" y1="${mode.id === 'r3' ? 30 : 22}" y2="${cursorBottom}" style="display:none"/>`;
    return { H, svg: svg(W, H, mode.h, g, '圆标记 P01 打给 P02，方块标记 P02 打给 P01，菱形标记方向未知；横轴为片段内秒数。') };
  };
  /* tiny locator that shows where the current view sits inside the 30 s clip */
  const locatorHTML = (mode, events) => {
    const dom = mode.domain, whole = mode.id === 'all';
    return `<span class="r26-loc-label">${whole ? '整段 0—30 s' : `当前视图在整段里的位置：${dom[0]}—${dom[1]} s`}</span><span class="r26-loc-bar">${events.map(e => `<i class="${e.dir === 'A_to_B' ? 'a' : e.dir === 'B_to_A' ? 'b' : 'u'}" style="left:${e.t / 30 * 100}%"></i>`).join('')}<b style="left:${dom[0] / 30 * 100}%;width:${(dom[1] - dom[0]) / 30 * 100}%"></b></span>`;
  };
  const courtSVG = (events, t, mode, rec) => {
    // schematic top-down singles/doubles court: net at x=200, P01 on the left half, P02 on the right half
    const L = 30, R = 370, T = 38, B = 193, cx = 200;
    let g = `<rect class="c-floor" x="14" y="22" width="372" height="187" rx="3"/><rect class="c-line" x="${L}" y="${T}" width="${R - L}" height="${B - T}"/>`;
    [[L, T + 11.7, R, T + 11.7], [L, B - 11.7, R, B - 11.7], [cx - 50, T, cx - 50, B], [cx + 50, T, cx + 50, B], [L + 19.3, T, L + 19.3, B], [R - 19.3, T, R - 19.3, B], [L, (T + B) / 2, cx - 50, (T + B) / 2], [cx + 50, (T + B) / 2, R, (T + B) / 2]].forEach(([a, b, c, d]) => g += `<line class="c-line" x1="${a}" y1="${b}" x2="${c}" y2="${d}"/>`);
    g += `<line class="c-net" x1="${cx}" y1="${T - 6}" x2="${cx}" y2="${B + 6}"/><text class="c-lab" x="${cx}" y="${T - 12}" text-anchor="middle">NET</text>`;
    const p1 = [96, 116], p2 = [304, 116];
    const idx = events.reduce((k, e, i) => e.t <= t + 1e-9 ? i : k, -1), ev = events[idx], nx = events[idx + 1];
    const age = ev ? t - ev.t : 99;
    // players
    const hitter = ev && age < .35 ? ev.dir : null;
    const ring = (x, y, k) => `<circle class="c-ring" cx="${x}" cy="${y}" r="${15 + 16 * k}" style="opacity:${(1 - k).toFixed(2)}"/>`;
    g += `<g><circle class="r26-ab" cx="${p1[0]}" cy="${p1[1]}" r="11"/><text class="c-lab" x="${p1[0]}" y="${p1[1] + 33}" text-anchor="middle">P01</text></g><g><rect class="r26-ba" x="${p2[0] - 10}" y="${p2[1] - 10}" width="20" height="20"/><text class="c-lab" x="${p2[0]}" y="${p2[1] + 33}" text-anchor="middle">P02</text></g>`;
    if (hitter === 'A_to_B') g += ring(p1[0], p1[1], age / .35); else if (hitter === 'B_to_A') g += ring(p2[0], p2[1], age / .35);
    let note = '', sh = null;
    const known = e => e && e.dir !== 'unknown';
    const atx = d => d === 'A_to_B' ? 128 : 272;
    if (ev) {
      if (nx && nx.r === ev.r) {
        const k1 = known(ev), k2 = known(nx), p = Math.min(1, Math.max(0, (t - ev.t) / (nx.t - ev.t)));
        let x1 = cx, x2 = cx, lift = 64;
        if (k1 && k2 && ev.dir !== nx.dir) { x1 = atx(ev.dir); x2 = atx(nx.dir); note = who(ev.dir) + ' · 飞行 ' + (nx.t - ev.t).toFixed(2) + ' s'; }
        else if (k1 && !k2) { x1 = atx(ev.dir); lift = 40; note = '下一拍方向没有确定：只画到球网'; }
        else if (!k1 && k2) { x2 = atx(nx.dir); lift = 40; note = '这一拍方向没有确定：从球网画起'; }
        else note = '相邻两拍方向都没有确定';
        sh = { x: x1 + (x2 - x1) * p, y: 112 - lift * 4 * p * (1 - p), gy: 130, p, unk: !(k1 && k2 && ev.dir !== nx.dir) };
      } else {
        // last hit of the rally
        const rx = known(ev) ? (ev.dir === 'A_to_B' ? 280 : 120) : cx;
        if (age < 1.2) {
          const p = Math.min(1, age / .55), x1 = known(ev) ? atx(ev.dir) : cx, y = 112 - 64 * 4 * p * (1 - p) * (1 - p * .3);
          sh = { x: x1 + (rx - x1) * p, y: 112 - 64 * 4 * Math.min(1, p) * (1 - Math.min(1, p)) + 14 * p, gy: 130, p, end: ev.st };
          note = ev.st === 'observed_no_response_zero' ? '没有回应，回合到此结束' : ev.st === 'not_observable_unknown' ? '片段到此结束，回应看不清' : '回合结束';
          if (known(ev) && p >= 1) sh = { ...sh, x: rx, y: 126, landed: true };
        } else note = '回合之间的间歇';
      }
    } else note = '第一拍之前';
    if (sh) {
      {
        g += `<ellipse class="c-shadow" cx="${sh.x}" cy="${sh.gy ?? 130}" rx="7" ry="2.4"/><circle class="c-shuttle" cx="${sh.x}" cy="${sh.y}" r="5"/>${sh.unk ? `<circle class="c-unk" cx="${sh.x}" cy="${sh.y}" r="11"/>` : ''}`;
        if (sh.landed && sh.end === 'observed_no_response_zero') g += `<path class="r26-stop" d="M${sh.x - 6} ${sh.y + 6}l12 12m0-12-12 12"/>`;
        if (sh.landed && sh.end === 'not_observable_unknown') g += `<text class="c-lab" x="${sh.x}" y="${sh.y + 22}" text-anchor="middle">?</text>`;
      }
    }
    g += `<text class="c-lab dim" x="${L}" y="${B + 34}">${E(note)}</text>`;
    return `<svg viewBox="0 0 400 238" role="img" aria-label="示意球场，当前 ${t.toFixed(2)} 秒：${E(note)}">${g}</svg>`;
  };

  M.rallylensTrack = {
    html: (_, opt) => trackHTML(opt),
    async init(el, _, opt) {
      const plot = el.querySelector('.r26-track-svg');
      try {
        const response = await fetch('assets/stage/rally-g01_02.json'); if (!response.ok) throw Error('事件表未加载');
        const { events } = await response.json();
        let mode = opt.modes[0], axis = 'time', sel = 2, t = events[1].t, stateFilter = null, win = null, playing = false, speed = 1, raf = 0, last = 0;
        const slider = el.querySelector('input[type=range]'), playBtn = el.querySelector('[data-play]'), speedBtn = el.querySelector('[data-speed]');
        let geom = null, tlW = 0;
        const visible = () => events.filter(e => !mode.rally || e.r === mode.rally);
        const evAt = tm => visible().reduce((k, e) => e.t <= tm + 1e-9 ? e : k, null);
        const cursor = () => {
          const ln = el.querySelector('.r26-cursor'); if (!ln || !geom) return;
          let x;
          if (mode.id === 'all' && axis === 'order') {
            // order axis: interpolate between neighbouring hits so the cursor still walks across
            const vs = events; const i = vs.reduce((k, e, j) => e.t <= t ? j : k, -1);
            if (i < 0) x = geom.X(vs[0]) - 14; else if (i >= vs.length - 1) x = geom.X(vs.at(-1)); else x = geom.X(vs[i]) + (geom.X(vs[i + 1]) - geom.X(vs[i])) * Math.min(1, (t - vs[i].t) / (vs[i + 1].t - vs[i].t));
          } else x = geom.Xt(t);
          ln.setAttribute('x1', x); ln.setAttribute('x2', x); ln.style.display = '';
        };
        const card = () => {
          const e = events.find(x => x.n === sel), i = events.indexOf(e), prev = events[i - 1], nx = events[i + 1];
          const sameP = prev && prev.r === e.r, sameN = nx && nx.r === e.r, st = stateText[e.st];
          const pos = events.filter(x => x.r === e.r), k = pos.indexOf(e) + 1;
          el.querySelector('.r26-hit-card').innerHTML = `<div class="r26-hit-title">${gly(e.dir, 20)}<b>#${String(e.n).padStart(2, '0')}</b><span>R${e.r} 第 ${k} / ${pos.length} 拍 · ${e.t.toFixed(3)} s</span></div>
            <dl><div><dt>方向</dt><dd>${who(e.dir)}</dd></div><div><dt>回应</dt><dd>${st[0]}<small>${st[1]}</small></dd></div><div><dt>间隔</dt><dd>${sameP ? `距上一拍 ${(e.t - prev.t).toFixed(2)} s` : '回合第一拍'}${sameN ? ` · 距下一拍 ${(nx.t - e.t).toFixed(2)} s` : ' · 回合最后一拍'}</dd></div>${e.go != null ? `<div><dt>模型候选</dt><dd>GoalOffer ${e.go.toFixed(2)}${e.ga != null ? ` · GoalActual ${e.ga.toFixed(2)}` : ' · Actual 留空'}<small>落点 / 线路目标头的候选值，不是评分</small></dd></div>` : `<div><dt>模型候选</dt><dd>方向未定，不给估计</dd></div>`}</dl>`;
        };
        const courtUpdate = () => { el.querySelector('.r26-court').innerHTML = courtSVG(events, t, mode); el.querySelector('.r26-court-time').textContent = `${t.toFixed(2)} s / 30`; const e = evAt(t) ; el.querySelector('.r26-court-tag').textContent = e ? `R${e.r} · #${String(e.n).padStart(2, '0')}` : 'R— · 第一拍之前'; };
        const syncButtons = () => { el.querySelectorAll('[data-hit]').forEach(b => b.setAttribute('aria-pressed', +b.dataset.hit === sel)); };
        const tick = () => { courtUpdate(); slider.value = t; cursor(); const e = evAt(t); if (e && e.n !== sel) { sel = e.n; card(); syncButtons(); drawPlot(); } };
        const drawPlot = () => {
          tlW = Math.max(280, plot.clientWidth);
          const r = trackSVG(events, mode, axis, tlW, sel, stateFilter, win);
          plot.innerHTML = r.svg; geom = tlGeom(mode, axis, tlW, events); cursor();
        };
        const chips = () => {
          const cnt = {}; visible().forEach(e => cnt[e.st] = (cnt[e.st] || 0) + 1);
          el.querySelector('.r26-chips').innerHTML = `<button type="button" data-st="" aria-pressed="${!stateFilter}">全部 ${visible().length}</button>` + Object.entries(stateText).map(([id, [h]]) => `<button type="button" data-st="${id}" aria-pressed="${stateFilter === id}" ${cnt[id] ? '' : 'disabled'}>${id === 'observed_no_response_zero' ? '× ' : id === 'not_observable_unknown' ? '? ' : '● '}${h} ${cnt[id] || 0}</button>`).join('');
        };
        const head = () => {
          const vs = visible();
          let big = mode.big, h = mode.h, p = mode.p;
          if (mode.id === 'win' && win != null) { const [lo, hi, c] = mode.windows[win]; const inW = events.filter(e => e.t >= lo && e.t <= hi), ab = inW.filter(e => e.dir === 'A_to_B').length, ba = inW.filter(e => e.dir === 'B_to_A').length, un = inW.length - ab - ba; big = String(c); h = `${lo}—${hi} s 窗口：${c} 个事件`; p = `其中 P01→P02 ${ab} 个，P02→P01 ${ba} 个，方向未知 ${un} 个。窗口只统计落在 ${hi - lo} 秒里的事件；窗口之间重叠，同一拍会被两个到三个窗口同时数到。`; }
          el.querySelector('.r26-track-head').innerHTML = `<b>${E(big)}</b><div><h4>${E(h)}</h4><p>${E(p)}</p><small>${E(mode.src)} · ${vs.length} 个事件在视图内</small></div>`;
        };
        const full = () => {
          el.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === mode.id));
          const ax = el.querySelector('.r26-axis-toggle'); if (ax) ax.hidden = mode.id !== 'all';
          slider.min = mode.domain[0]; slider.max = mode.domain[1];
          const loc = el.querySelector('.r26-locator'); loc.innerHTML = locatorHTML(mode, events); loc.style.display = mode.id === 'r3' ? '' : 'none';
          head(); chips(); card(); drawPlot();
          el.querySelector('.r26-hit-buttons').innerHTML = visible().map(e => `<button type="button" data-hit="${e.n}" aria-pressed="${e.n === sel}">${gly(e.dir)} #${String(e.n).padStart(2, '0')}<small>${e.t.toFixed(2)}s</small></button>`).join('');
          courtUpdate(); slider.value = t;
        };
        const setT = (tm, from) => { t = Math.min(mode.domain[1], Math.max(mode.domain[0], tm)); const e = evAt(t); if (e) sel = e.n; courtUpdate(); slider.value = t; head(); card(); syncButtons(); drawPlot(); };
        const stop = () => { playing = false; cancelAnimationFrame(raf); playBtn.setAttribute('aria-pressed', 'false'); playBtn.setAttribute('aria-label', '播放'); };
        const frame = now => {
          if (!playing) return; const dt = Math.min(.1, (now - last) / 1000) * speed; last = now; t += dt;
          if (t > mode.domain[1]) { t = mode.domain[0]; }
          tick(); raf = requestAnimationFrame(frame);
        };
        const play = () => { if (playing) return; playing = true; playBtn.setAttribute('aria-pressed', 'true'); playBtn.setAttribute('aria-label', '暂停'); if (t >= mode.domain[1] - .05) t = mode.domain[0]; last = performance.now(); raf = requestAnimationFrame(frame); };
        // axis toggle (whole clip only)
        el.querySelector('.r26-controls').insertAdjacentHTML('afterend', `<div class="r26-controls r26-axis-toggle" role="group" aria-label="横轴取法"><span class="r26-axis-label">横轴</span><button type="button" data-axis="time" aria-pressed="true">真实秒数</button><button type="button" data-axis="order" aria-pressed="false">事件顺序（Fig.1a）</button></div>`);
        el.addEventListener('click', ev => {
          const hit = ev.target.closest('[data-hit]'), b = ev.target.closest('button'), w = ev.target.closest('[data-win]');
          if (hit) { stop(); const n = +hit.dataset.hit; sel = n; setT(events.find(e => e.n === n).t); return; }
          if (w) { win = win === +w.dataset.win ? null : +w.dataset.win; stop(); head(); drawPlot(); return; }
          if (!b) return;
          if (b.dataset.mode) { stop(); mode = opt.modes.find(m => m.id === b.dataset.mode); win = null; stateFilter = null; const vs = visible(); const keep = vs.find(e => e.n === sel) || vs[0]; sel = keep.n; t = keep.t; full(); }
          else if (b.dataset.axis) { axis = b.dataset.axis; el.querySelectorAll('[data-axis]').forEach(x => x.setAttribute('aria-pressed', x === b)); drawPlot(); }
          else if (b.dataset.st !== undefined && b.closest('.r26-chips')) { stateFilter = b.dataset.st || null; chips(); drawPlot(); }
          else if (b.hasAttribute('data-play')) playing ? stop() : play();
          else if (b.hasAttribute('data-speed')) { speed = speed === 1 ? .5 : 1; b.textContent = speed === 1 ? '0.5×' : '1×'; b.setAttribute('aria-pressed', speed !== 1); }
        });
        el.addEventListener('keydown', ev => { if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.matches('[data-hit],[data-win]')) { ev.preventDefault(); ev.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
        slider.addEventListener('input', () => { stop(); setT(+slider.value); });
        const ro = new ResizeObserver(() => { if (Math.abs(plot.clientWidth - tlW) > 2) drawPlot(); }); ro.observe(plot);
        full();
      } catch (e) { plot.textContent = '逐事件表加载失败，请刷新后重试。'; console.error(e); }
    }
  };

  M.rallylensAtlas = {html:()=>`<div class="r26-atlas"><p class="r26-legend"><span>○ A→B</span><span>■ B→A</span><span>◇ 未知</span><span>所有条形共用 0—25 事件尺度</span></p><div class="r26-controls r27-af" role="group" aria-label="筛选片段"><span class="r26-axis-label">筛选</span><button type="button" data-af="all" aria-pressed="true">全部 12</button><button type="button" data-af="unk" aria-pressed="false">含方向未知</button><button type="button" data-af="coach" aria-pressed="false">有教练读同一片段</button><button type="button" data-af="long" aria-pressed="false">事件 ≥ 15</button></div><div class="r26-atlas-grid">${['G01','G03','G07'].map((id,i)=>`<section><h4>${id} <small>${[44,57,59][i]} EVENTS</small></h4>${registry.filter(r=>r[0].startsWith(id)).map(r=>`<button type="button" data-dpe="${r[0]}" aria-pressed="${r[0]==='G01_02'}"><span>${r[0]}${r[6]?' ◇':''}</span><i class="r26-countbar" aria-hidden="true"><b class="ab" style="width:${r[4]/25*100}%">${r[4]}</b><b class="ba" style="width:${r[5]/25*100}%">${r[5]}</b>${r[6]?`<b class="unknown" style="width:${r[6]/25*100}%">${r[6]}</b>`:''}</i><small>○ ${r[4]} / ■ ${r[5]} / ◇ ${r[6]} · 总 ${r[3]}</small></button>`).join('')}</section>`).join('')}</div><div class="r26-atlas-detail" aria-live="polite"></div><div class="r26-controls"><label>检查事件 <select aria-label="检查所选片段的击球事件"></select></label></div><div class="r26-parents"></div><p class="r26-actual-state"></p><details><summary>查看选中事件的原始字段</summary><pre class="r26-event-json"></pre></details><p class="r26-source">Table S3 · Fig.S1 · 160-event export。此处新增的是作品集的联动浏览，不是论文原型完成度的新增研究结论。</p></div>`,async init(el){
    try{const r=await fetch('assets/composition/rally-events.json');if(!r.ok)throw Error('DPE事件表未加载');const data=await r.json();let id='G01_02',index=2;const plot=el.querySelector('.r26-parents'),pick=el.querySelector('select');
      const drawEvent=()=>{const ev=data.find(e=>e.dpe_id==='DPE_'+id && e.physical_event_index===index);if(!ev)return;plot.innerHTML=parentPlot(ev,plot.clientWidth);el.querySelector('.r26-actual-state').textContent=ev.direction==='unknown'?'◇ 方向未知：不展示父维度和目标估计。':ev.actual_status==='observed_contact_model_estimate'?'Actual-evidence：接触已记录，保留模型候选；不代表正确或有效练习。':ev.actual_status==='observed_no_response_zero'?'Actual-evidence：无回应，记 0。模型输出与可观察证据是不同字段。':'Actual-evidence：回应不可观察，留空，不以模型输出填补。';el.querySelector('.r26-event-json').textContent=JSON.stringify(ev,null,2);};
      const draw=()=>{const reg=registry.find(r=>r[0]===id),events=data.filter(e=>e.dpe_id==='DPE_'+id).sort((a,b)=>a.physical_event_index-b.physical_event_index);if(!events.some(e=>e.physical_event_index===index))index=events[0].physical_event_index;el.querySelectorAll('[data-dpe]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.dpe===id));el.querySelector('.r26-atlas-detail').innerHTML=`<h4>${id} <span>${reg[3]} 个事件</span></h4><p>第 ${reg[1]} 次训练 · 阶段 ${reg[2]} · 源事件范围 ${reg[9]} s</p><p>参与者说法：${E(reg[7])}　/　教练：${E(reg[8])}</p>`;pick.innerHTML=events.map(e=>`<option value="${e.physical_event_index}"${e.physical_event_index===index?' selected':''}>#${String(e.physical_event_index).padStart(2,'0')} · ${e.event_time_a_s.toFixed(3)}s · ${e.direction==='A_to_B'?'○ A→B':e.direction==='B_to_A'?'■ B→A':'◇ 未知'}</option>`).join('');drawEvent();};
      el.addEventListener('click',ev=>{const f=ev.target.closest('[data-af]');if(f){const m=f.dataset.af;el.querySelectorAll('[data-af]').forEach(x=>x.setAttribute('aria-pressed',x===f));el.querySelectorAll('[data-dpe]').forEach(bt=>{const r=registry.find(q=>q[0]===bt.dataset.dpe);const ok=m==='all'||(m==='unk'&&r[6]>0)||(m==='coach'&&/同片段/.test(r[8]))||(m==='long'&&r[3]>=15);bt.classList.toggle('off',!ok);});el.querySelectorAll('.r26-atlas-grid>section').forEach(sc=>sc.classList.toggle('off',![...sc.querySelectorAll('[data-dpe]')].some(x=>!x.classList.contains('off'))));return;}const b=ev.target.closest('[data-dpe]');if(b){id=b.dataset.dpe;index=1;draw();}});pick.addEventListener('change',()=>{index=+pick.value;drawEvent();});const ro=new ResizeObserver(drawEvent);ro.observe(plot);draw();
    }catch(e){el.querySelector('.r26-atlas-detail').textContent='DPE 事件资料加载失败。';console.error(e);}
  }};

  const planCards = b => `<div class="r26-plan-pair" data-noeva>${Object.values(b.who).map((p,i)=>`<article class="r26-plan ${i?'b':'a'}"><header><b>${p.g}</b><span>${p.id}<small>${i?'喂球方的安排':'练习方的要求'} · G01 第 3 次训练 / 阶段 2</small></span></header><p class="r26-field">自己的目标</p><h4>${E(b.goals[p.goal])}</h4><p class="r26-field">${i?'打算怎样喂球':'希望搭档怎样喂球'}</p><ul>${p.sup.map(j=>`<li>${E(b.support[j])}</li>`).join('')}</ul><dl>${b.ratings.map(([name,opts],j)=>`<div><dt>${E(name)}</dt><dd>${E(opts[p.r[j]])}</dd></div>`).join('')}</dl></article>`).join('')}</div><details class="r26-options"><summary>阶段卡的完整选项与记录粒度</summary><p>目标为单选，喂球条件为多选；角色阶段还记录谁发起调整及自由备注。卡片按搭档、训练、参与者与角色匹配，不使用平板重复的记录 ID，也不对齐到单拍。</p><p><b>目标：</b>${b.goals.map(E).join(' · ')}</p><p><b>喂球条件：</b>${b.support.map(E).join(' · ')}</p></details>`;
  const cropped = (im,label) => `<figure><div class="r26-crop" style="aspect-ratio:${im.w}/${im.h}"><img src="${im.src}" alt="${E(label)}" style="width:${im.iw/im.w*100}%;left:${-im.x/im.w*100}%;top:${-im.y/im.h*100}%" loading="lazy"></div><figcaption>${E(label)}</figcaption></figure>`;
  /* Fig.2 redrawn from the participants' accounts (§4.1—4.3). Schematic: no measured trajectories. */
  const casesSVG = id => {
    const lane = (y, label) => `<line class="r26-gridline" x1="64" x2="452" y1="${y}" y2="${y}" style="opacity:.3"/>` + tx(0, y + 4, label, 's');
    const dot = (x, y) => `<circle class="r26-ab" cx="${x}" cy="${y}" r="7"/>`, sq = (x, y) => `<rect class="r26-ba" x="${x - 7}" y="${y - 7}" width="14" height="14"/>`;
    const fl = (x1, y1, x2, y2) => `<path class="r26-flight" d="M${x1} ${y1}L${x2} ${y2}"/>`;
    let body, h = 250, title;
    if (id === 'a') {
      title = 'Fig.2(a)：条件靠两边的回球一起维持';
      body = lane(52, 'P09 ○') + lane(172, 'P10 □') +
        fl(100, 52, 170, 172) + fl(170, 172, 240, 52) + fl(240, 52, 310, 172) +
        `<path class="r26-inferred" d="M310 172Q384 -30 420 50"/>` +
        dot(100, 52) + sq(170, 172) + dot(240, 52) + sq(310, 172) +
        `<path class="r26-stop" d="M413 43l14 14m0-14-14 14"/>` +
        tx(100, 30, '压低', 's', 'middle') + tx(240, 30, '压低', 's', 'middle') + tx(392, 22, '挑高', 's', 'middle') +
        `<path class="r27-ln" d="M100 204V212H310V204"/>` + tx(205, 232, '来球压低：条件成立', 's', 'middle') +
        tx(420, 232, '练习散了', 's', 'middle');
    } else if (id === 'b') {
      title = 'Fig.2(b)：两个人把“一起练成”放在不同的片段';
      h = 236;
      body = `<rect class="r26-rallyband" x="0" y="20" width="300" height="56"/>` + tx(14, 44, 'G03_02 · 前场喂球', 's') + tx(14, 64, '故意送中场球，事先商量好', 's') +
        `<rect class="r26-rallyband" x="0" y="100" width="300" height="56"/>` + tx(14, 124, 'G03_03 · 比赛式交换', 's') + tx(14, 144, '更放松，也更想跑动', 's') +
        `<path class="r27-ln" d="M300 48H352"/><path class="r27-ln" d="M300 128H352"/>` + sq(372, 48) + tx(392, 53, 'P06 选', 's') + dot(372, 128) + tx(392, 133, 'P05 选', 's') +
        `<path class="r26-inferred" d="M372 62V114"/>` + tx(0, 196, '两人选的不是同一段，', 's') + tx(0, 218, '各自的理由都说得通', 's');
    } else {
      title = 'Fig.2(c)：有用的重复，可以隔着失误';
      body = lane(60, 'P02 □') + tx(64, 22, 'G01_04 · 网前', 's') +
        sq(100, 60) + `<path class="r26-stop" d="M163 53l14 14m0-14-14 14"/><path class="r26-stop" d="M223 53l14 14m0-14-14 14"/>` + sq(320, 60) +
        `<path class="r27-ln" d="M100 76V90H320V76"/>` + tx(210, 110, '同一种球再次回到想要的位置', 's', 'middle') +
        tx(170, 44, '死球', 's', 'middle') + tx(230, 44, '死球', 's', 'middle') +
        lane(176, 'P05 ○') + tx(64, 146, 'G03_02 · 阶段后半', 's') +
        [0, 1, 2].map(i => `<circle cx="${110 + i * 110}" cy="176" r="${14 - i * 2}" fill="none" stroke="var(--rc)" stroke-width="2" opacity="${1 - i * .35}" ${i ? 'stroke-dasharray="4 3"' : ''}/>`).join('') +
        tx(110, 212, '原来的目标', 's', 'middle') + tx(330, 212, '越来越容易忘', 's', 'middle');
    }
    return svg(460, h, title, body, '依据参与者说法重绘的示意，不是测量的球路。');
  };
  const schema = () => `<div class="r26-schema" data-noeva><header><span>DYADIC PRACTICE DATA</span><b>DPE registry</b><p>双机位与暂定片段边界 · dyad / session / stage / case</p></header><div class="r26-schema-objects"><article><b>事件粒度</b><h4>Practice Opportunity Data</h4><p>provider → receiver</p><code>physical_event_index · gold_shot_id<br>event_time_a_s · direction</code><p>可观察接触与继续端点<br>E / R / U / S1 / S3 / S5 · D / C<br>Offer / Actual-model / Actual-evidence</p></article><article><b>窗口粒度</b><h4>Dyadic Relation State Data</h4><p>10 秒窗口 · 5 秒步长 · 分方向</p><code>case · time · direction<br>evidence identifiers · overlap status</code><p>O1 方向性行为描述<br>O2 搭档历史提供的预测信息<br>O3 身体共同变化</p></article></div><p class="r26-schema-link">共享片段、时间、方向、证据编号；窗口不被拆分或赋值到单拍。</p><div class="r26-schema-sources"><div><b>源视频</b><span>同步 A / B 机位</span></div><div><b>任务情境</b><span>阶段卡 · 目标 / 喂球安排</span></div><div><b>参与者说法</b><span>说话人 / 所指 / 范围 / 提示暴露</span></div><div><b>教练材料</b><span>同片段或相关阶段 · 独立出处</span></div><div><b>未知登记</b><span>未定方向 / 缺失锚点 / 未解决分歧</span></div></div></div>`;
  const coverage = () => `<div class="r26-coverage"><article class="wide"><b>8<small>对录制</small></b><p>16 名参与者 · 每对至少一次</p></article><article class="wide"><b>6<small>对视频语料</small></b><p>11 次训练 · 86 个机位录像 · 约 10.2 机位小时<br>9 / 11 次有双方阶段卡</p></article><article><b>4<small>对事件标注</small></b><p>150 片段 · 2,204 事件 · 750 窗口</p></article><article><b>3<small>对回访</small></b><p>6 位球员 · 每人回看 4 片段<br>12 个 DPE · 160 事件</p></article><article class="coach"><b>7<small>位独立教练</small></b><p>43 组问题 · 来自 4 对搭档的片段</p></article></div>`;
  /* ------------------------------------------------------------------
     2026-10-14 diagrams drawn in code: data architecture (S5.1—S5.7, Table S6), model decomposition (S5.3, Fig.S2),
     evidence coverage (Fig.S3), event agreement (S2.3). Each SVG comes in a wide and a narrow drawing; CSS swaps them.
     ------------------------------------------------------------------ */
  const tx = (x, y, s, cls = '', anchor = '') => `<text class="r27-t ${cls}" x="${x}" y="${y}"${anchor ? ` text-anchor="${anchor}"` : ''}>${E(s)}</text>`;
  const bx = (x, y, w, h, cls = '') => `<rect class="r27-box ${cls}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  const ln = (d, cls = '', mk = '') => `<path class="r27-ln ${cls}" d="${d}"${mk ? ` marker-end="url(#${mk})"` : ''}/>`;
  const defsOf = id => `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0L10 5 0 10z" class="r27-ahead"/></marker></defs>`;
  const swap = (wide, narrow) => `<div class="r27-fig" data-noeva><div class="r27-wide">${wide}</div><div class="r27-narrow">${narrow}</div></div>`;

  /* ---- data architecture ---- */
  const archSrc = [['源视频', '同步 A / B 两路机位'], ['任务情境', '阶段卡：目标与喂球安排'], ['参与者说法', '说话人 · 所指 · 范围 · 提示暴露'], ['教练材料', '同片段或相关阶段 · 独立出处'], ['未知登记', '未定方向 · 缺失锚点 · 未解决分歧']];
  const podLines = ['physical_event_index · gold_shot_id', 'event_time_a_s · direction'], drsLines = ['case · time · direction', 'evidence identifiers · overlap status'];
  const archSVG = () => {
    const a = 'ah-d', w = svg(1160, 560, '数据架构：来源材料经 DPE 登记表连到两个数据对象', defsOf(a) +
      tx(0, 18, '01 来源材料', 'cap') + tx(400, 18, '02 DPE 登记表', 'cap') + tx(740, 18, '03 两个数据对象', 'cap') +
      archSrc.map(([h, p], i) => { const y = 36 + i * 104; return bx(0, y, 300, 88, i === 4 ? 'dash' : '') + tx(18, y + 36, h, 'h') + tx(18, y + 62, p, 's') + ln(`M300 ${y + 44}H398`, '', a); }).join('') +
      bx(400, 36, 240, 504, 'ink') + tx(420, 80, 'DPE registry', 'big w') + tx(420, 108, 'dyad / session / stage / case', 'mo w') +
      ln('M420 130H620', 'w') + tx(420, 164, '一行是一个 DPE：', 's w') + tx(420, 188, '30 秒片段里首尾两个', 's w') + tx(420, 212, '纳入事件围出的边界', 's w') +
      ln('M420 240H620', 'w') + tx(420, 274, '把下面这些连起来：', 's w') + ['源视频', '任务与目标情境', '有出处的说法', '教练读法', '未解决的部分'].map((s, i) => tx(420, 304 + i * 28, '· ' + s, 's w')).join('') +
      tx(420, 486, '○ P01 → P02', 'mo w') + tx(420, 506, '□ P02 → P01　◇ 未知', 'mo w') +
      ln('M640 160H738', '', a) + ln('M640 436H738', '', a) +
      bx(740, 36, 420, 256, 'pod') + tx(762, 68, '事件粒度', 'cap') + tx(762, 102, 'Practice Opportunity Data', 'big') + tx(762, 128, 'provider → receiver', 's') +
      bx(762, 142, 376, 52, 'code') + podLines.map((s, i) => tx(776, 164 + i * 20, s, 'mo')).join('') +
      tx(762, 222, '可观察接触与继续端点', 's') + tx(762, 246, 'E / R / U / S1 / S3 / S5 · D / C', 'mo') + tx(762, 272, 'Offer / Actual-model / Actual-evidence', 'mo') +
      bx(740, 292, 420, 40, 'key') + tx(950, 317, '共用：片段 · 时间 · 方向 · 证据编号', 'mo w', 'middle') +
      bx(740, 332, 420, 208, 'drs') + tx(762, 364, '窗口粒度', 'cap') + tx(762, 398, 'Dyadic Relation State Data', 'big') + tx(762, 424, '10 秒窗口 · 5 秒步长 · 分方向', 's') +
      bx(762, 438, 376, 52, 'code') + drsLines.map((s, i) => tx(776, 460 + i * 20, s, 'mo')).join('') +
      tx(762, 516, 'O1 方向性行为描述 · O2 搭档历史提供的预测信息 · O3 身体共同变化', 's'));
    const m = 'ah-m', n = svg(360, 990, '数据架构（窄屏）：来源材料经 DPE 登记表连到两个数据对象', defsOf(m) +
      tx(0, 16, '01 来源材料', 'cap') +
      archSrc.map(([h, p], i) => { const y = 28 + i * 64; return bx(0, y, 358, 54, i === 4 ? 'dash' : '') + tx(14, y + 23, h, 'h') + tx(14, y + 43, p, 's'); }).join('') +
      ln('M179 352V392', '', m) + tx(0, 380, '02 DPE 登记表', 'cap') +
      bx(0, 398, 358, 104, 'ink') + tx(16, 432, 'DPE registry', 'big w') + tx(16, 456, 'dyad / session / stage / case', 'mo w') + tx(16, 482, '一行是一个 DPE：30 秒片段里首尾纳入事件围出的边界', 's w') +
      ln('M179 502V540', '', m) + tx(0, 534, '03 两个数据对象', 'cap') +
      bx(0, 548, 358, 214, 'pod') + tx(16, 576, '事件粒度', 'cap') + tx(16, 606, 'Practice Opportunity Data', 'big') + tx(16, 628, 'provider → receiver', 's') +
      bx(16, 640, 326, 48, 'code') + podLines.map((s, i) => tx(26, 660 + i * 18, s, 'mo')).join('') +
      tx(16, 712, '可观察接触与继续端点', 's') + tx(16, 732, 'E / R / U / S1 / S3 / S5 · D / C', 'mo') + tx(16, 752, 'Offer / Actual-model / Actual-evidence', 'mo') +
      bx(0, 762, 358, 36, 'key') + tx(179, 785, '共用：片段 · 时间 · 方向 · 证据编号', 'mo w', 'middle') +
      bx(0, 798, 358, 190, 'drs') + tx(16, 826, '窗口粒度', 'cap') + tx(16, 856, 'Dyadic Relation State Data', 'big') + tx(16, 878, '10 秒窗口 · 5 秒步长 · 分方向', 's') +
      bx(16, 890, 326, 48, 'code') + drsLines.map((s, i) => tx(26, 910 + i * 18, s, 'mo')).join('') +
      tx(16, 962, 'O1 方向性行为 · O2 搭档历史的预测信息', 's') + tx(16, 981, 'O3 身体共同变化', 's'));
    return swap(w, n);
  };

  /* ---- model decomposition ---- */
  const goalHeads = ['进攻连续', '防守转换', '网前', '落点 / 线路', '后场高远 · 吊球', '发球 · 接发', '移动 · 回位', '正反手转换'];
  const parentNames = ['回应连续', '技术转换', '落点 / 线路控制', '空间覆盖', '移动需求', '回位准备', '节奏稳定 / 变化', '决策压力'];
  const decompSVG = b => {
    const sel = 3, o = b.goal[0].toFixed(2), a = b.goal[1].toFixed(2), d = 'dh-d';
    const wide = svg(1160, 560, '模型分解：输入经两层估计，由阶段卡选目标头，得到 GoalOffer 与 GoalActual', defsOf(d) +
      tx(0, 18, '输入', 'cap') + tx(290, 18, '第一层', 'cap') + tx(710, 18, '第二层', 'cap') + tx(990, 18, '输出', 'cap') +
      bx(0, 36, 220, 84) + tx(16, 68, '动作与区域历史', 'h') + tx(16, 92, '机器推导', 's') +
      bx(0, 134, 220, 84) + tx(16, 166, '回应证据', 'h') + tx(16, 190, '源材料支持的接触与时间', 's') +
      bx(0, 232, 220, 118, 'plain') + tx(16, 260, '两条路径', 'h') + tx(16, 286, '击球证据在两个视角间成立：', 's') + tx(16, 306, '可视增强路径', 's') + tx(16, 330, '否则：portable 路径，不含球种', 's') +
      bx(0, 374, 220, 66, 'dash') + tx(16, 402, '参与者说法', 'h') + tx(16, 424, '不进入模型训练', 's') +
      ln('M220 78H288', '', d) + ln('M220 176H288', '', d) +
      bx(290, 36, 350, 454, 'pod') + tx(308, 68, '八个父维度，各估计两次', 'h') + tx(308, 90, '条件（Offer）与回应里看得到的内容', 's') + tx(308, 108, '（Actual-model），尺度 0—100', 's') +
      tx(560, 130, 'Offer', 'mo', 'middle') + tx(611, 130, 'Actual', 'mo', 'middle') +
      parentNames.map((s, i) => { const y = 142 + i * 41; return ln(`M308 ${y - 8}H622`, 'thin') + tx(308, y + 18, s, 's') + `<circle class="r27-offer" cx="560" cy="${y + 13}" r="5"/><rect class="r27-actual" x="605" y="${y + 8}" width="10" height="10"/>`; }).join('') +
      ln('M640 263H708', '', d) +
      bx(710, 36, 220, 454, 'drs') + tx(726, 68, '八个事件目标头', 'h') + tx(726, 90, '单调加性 hurdle head', 'mo') +
      goalHeads.map((s, i) => { const y = 106 + i * 40; return (i === sel ? `<rect class="r27-sel" x="722" y="${y}" width="196" height="34"/>` : `<rect class="r27-row" x="722" y="${y}" width="196" height="34"/>`) + tx(734, y + 22, s, i === sel ? 's w' : 's'); }).join('') +
      tx(726, 450, '维持回合、比赛决策属于', 's') + tx(726, 470, '回合或片段层，没有事件头', 's') +
      bx(990, 36, 170, 74, 'card') + tx(1004, 62, '阶段卡上的目标', 's') + tx(1004, 92, '落点 / 线路', 'h b') +
      ln('M990 73H954V' + (106 + sel * 40 + 12) + 'H920', 'blue', d) +
      ln('M930 ' + (106 + sel * 40 + 24) + 'H980', '', d) +
      `<path class="r27-ln" d="M990 160H982V330H990"/>` +
      bx(990, 150, 170, 58, 'plain') + tx(1004, 172, 'GoalOffer', 'mo') + tx(1004, 200, o, 'num') +
      bx(990, 216, 170, 58, 'plain') + tx(1004, 238, 'GoalActual-model', 'mo') + tx(1004, 266, a, 'num') +
      bx(990, 282, 170, 58, 'dash') + tx(1004, 304, 'GoalActual-evidence', 'mo') + tx(1004, 328, '按可观察性门控', 's') +
      bx(990, 366, 170, 124, 'plain') + tx(1004, 392, '可观察性门控', 'h') + tx(1004, 420, '已记录接触：保留模型值', 's2') + tx(1004, 444, '明确无回应：记 0', 's2') + tx(1004, 468, '不可观察：缺失', 's2') +
      tx(0, 530, 'G01_02 · 事件 #02 · 6.80 s · P02 → P01：接球方接触已记录，Actual 保留模型估计。', 'mo') + tx(0, 552, '父维度的精确值见上方“十二个 DPE”；父维度（0—100）与目标头输出是不同尺度，不能互换。', 'mo'));
    const m = 'dh-m', nar = svg(360, 1250, '模型分解（窄屏）', defsOf(m) +
      tx(0, 16, '输入', 'cap') +
      bx(0, 26, 174, 64) + tx(12, 52, '动作与区域历史', 'h2') + tx(12, 74, '机器推导', 's') +
      bx(184, 26, 174, 64) + tx(196, 52, '回应证据', 'h2') + tx(196, 74, '源材料支持', 's') +
      bx(0, 100, 358, 40, 'dash') + tx(12, 125, '参与者说法不进入模型训练', 's') +
      ln('M179 140V176', '', m) + tx(0, 170, '第一层', 'cap') +
      bx(0, 182, 358, 380, 'pod') + tx(14, 210, '八个父维度，各估计两次', 'h') + tx(14, 230, 'Offer 与 Actual-model，0—100', 's') +
      tx(250, 256, '○ Offer', 'mo', 'middle') + tx(318, 256, '■ Actual', 'mo', 'middle') +
      parentNames.map((s, i) => { const y = 266 + i * 36; return ln(`M14 ${y - 4}H344`, 'thin') + tx(14, y + 20, s, 's') + `<circle class="r27-offer" cx="250" cy="${y + 15}" r="5"/><rect class="r27-actual" x="313" y="${y + 10}" width="10" height="10"/>`; }).join('') +
      ln('M179 562V598', '', m) + tx(0, 592, '第二层', 'cap') +
      bx(0, 604, 358, 60, 'card') + tx(14, 630, '阶段卡上的目标', 's') + tx(14, 654, '落点 / 线路', 'h b') +
      ln('M179 664V690', 'blue', m) +
      bx(0, 696, 358, 384, 'drs') + tx(14, 724, '八个事件目标头', 'h') + tx(14, 744, '单调加性 hurdle head', 'mo') +
      goalHeads.map((s, i) => { const y = 758 + i * 36; return (i === sel ? `<rect class="r27-sel" x="10" y="${y}" width="338" height="31"/>` : `<rect class="r27-row" x="10" y="${y}" width="338" height="31"/>`) + tx(22, y + 21, s, i === sel ? 's w' : 's'); }).join('') +
      tx(14, 1062, '维持回合、比赛决策属于回合或片段层', 's') +
      ln('M179 1080V1104', '', m) + tx(0, 1100, '输出', 'cap') +
      bx(0, 1110, 174, 56, 'plain') + tx(12, 1132, 'GoalOffer', 'mo') + tx(12, 1158, o, 'num') +
      bx(184, 1110, 174, 56, 'plain') + tx(196, 1132, 'GoalActual-model', 'mo') + tx(196, 1158, a, 'num') +
      tx(0, 1196, 'Actual-evidence：已记录接触保留模型值；', 's') + tx(0, 1216, '明确无回应记 0；不可观察缺失。', 's') +
      tx(0, 1240, 'G01_02 #02 · 6.80 s · P02 → P01', 'mo'));
    return swap(wide, nar);
  };

  /* ---- evidence coverage (Fig.S3) ---- */
  const coverageNested = () => `<div class="r27-nest" data-noeva>
    <div class="n1"><div class="lab"><b>8</b><h4>对搭档完成录制</h4><p>16 名参与者，每对至少一次，50—60 分钟含热身</p></div>
      <div class="n2"><div class="lab"><b>6</b><h4>对组成视频语料</h4><p>G01—G04、G07、G08 · 11 次训练 · 86 个机位录像 · 约 10.2 机位小时 · 9 次训练有双方阶段卡</p></div>
        <div class="n3"><div class="lab"><b>4</b><h4>对用于计算</h4><p>事件级标注：150 个片段、2,204 个事件、750 个 10 秒窗口</p></div>
          <div class="n4"><div class="lab"><b>3</b><h4>对回访</h4><p>G01、G03、G07 · 6 位球员各回看 4 个片段</p><p class="out">12 个 DPE · 160 个事件</p></div></div>
        </div>
      </div>
    </div>
    <div class="coach"><div class="lab"><b>7</b><h4>位教练，独立来源</h4><p>43 组问题，读 4 对搭档的片段；先盲读，答完才告知阶段和角色。不属于上面的子集。</p></div></div>
  </div>`;

  /* ---- annotation agreement (S2.3): tolerance 350 ms, schematic ---- */
  const agreeSVG = () => {
    const a = [0.6, 1.9, 3.4, 5.2, 6.6], bb = [0.7, 1.85, 3.5, 6.75, 8.0], pair = [[0, 0], [1, 1], [2, 2], [4, 3]]; // seconds, schematic
    const draw = (W, sc, x0, yA, yB, narrow) => {
      const X = t => x0 + t * sc, tol = .35 * sc, H = narrow ? 214 : 190;
      return svg(W, H, '示意：两份标注里的事件，时间相差 350 毫秒以内配成一对',
        (narrow ? tx(0, yA - 22, '标注 1', 's') + tx(0, yB + 28, '标注 2', 's') + tx(W, 14, '示意，不是真实片段', 'mo', 'end') : tx(0, yA + 4, '标注 1', 's') + tx(0, yB + 4, '标注 2', 's') + tx(W - 10, 20, '示意，不是真实片段', 'mo', 'end')) +
        `<line class="r26-gridline" x1="${x0}" x2="${W - 10}" y1="${yA}" y2="${yA}"/><line class="r26-gridline" x1="${x0}" x2="${W - 10}" y1="${yB}" y2="${yB}"/>` +
        a.map(t => `<rect class="r27-tol" x="${X(t) - tol}" y="${yA - 16}" width="${tol * 2}" height="${yB - yA + 32}"/>`).join('') +
        pair.map(([p, q]) => `<line class="r27-pair" x1="${X(a[p])}" y1="${yA}" x2="${X(bb[q])}" y2="${yB}"/>`).join('') +
        a.map((t, k) => `<circle class="${pair.some(p => p[0] === k) ? 'r26-ab' : 'r27-un'}" cx="${X(t)}" cy="${yA}" r="6"/>`).join('') +
        bb.map((t, k) => `<circle class="${pair.some(p => p[1] === k) ? 'r26-ab' : 'r27-un'}" cx="${X(t)}" cy="${yB}" r="6"/>`).join('') +
        tx(X(a[3]), yA - 24, '没有配上', 's', 'middle') + tx(X(bb[4]), yB + 30, '没有配上', 's', 'middle') +
        (narrow ? tx(0, 176, '阴影宽 ±350 ms：落在里面就配成一对，', 's') + tx(0, 196, '再比较两边记的方向', 's') : tx(X(1.9), 176, '阴影宽 ±350 ms：落在里面就配成一对，再比较两边记的方向', 'mo')));
    };
    return swap(draw(1000, 104, 56, 56, 124, false), draw(360, 38, 20, 62, 118, true));
  };

  const aucPlot = (b,k) => k.chart({type:'rallylens-auc',rows:b.rows},b.cap);
  if(window.VZ) VZ.T['rallylens-auc']=(s,W)=>{
    const narrow=W<600, left=narrow?16:210,right=W-18,rh=narrow?66:49,H=42+s.rows.length*rh+38,X=v=>left+(right-left)*v;
    let g='';[0,.25,.5,.75,1].forEach(v=>g+=`<line class="r26-gridline" x1="${X(v)}" x2="${X(v)}" y1="30" y2="${H-34}"/><text class="r26-svg-label" x="${X(v)}" y="${H-10}" text-anchor="${v===0?'start':v===1?'end':'middle'}">${v===.5?'.5 随机':v}</text>`);
    s.rows.forEach((r,i)=>{const y=49+i*rh+(narrow?23:0);g+=`<text class="r26-svg-label" x="${narrow?left:0}" y="${narrow?y-17:y+4}">${E(r.label)}</text><line class="r26-ab-line" x1="${X(r.lo)}" x2="${X(r.hi)}" y1="${y}" y2="${y}"/><circle class="r26-ab" cx="${X(r.lo)}" cy="${y}" r="4"/><circle class="r26-ab" cx="${X(r.hi)}" cy="${y}" r="4"/><text class="r26-svg-number" x="${Math.min(right-68,X(r.hi)+10)}" y="${narrow?y+19:y+4}">${E(r.text)}</text>`;});return {H,g};
  };
  /* ------------------------------------------------------------------
     RallyLens design probe, redrawn as a working wireframe (§6.2 · Fig.5 · Figs S6/S7).
     Two camera views with different viewpoints (A: low, behind P01's baseline; B: high, diagonal) share one schematic court.
     Players, flight arcs and landing marks are schematic: only direction, time, rally and response state come from the
     G01_02 event table; positions are generated deterministically per event and are not measured.
     Layer 1 playback · layer 2 observation and accounts · layer 3 model candidates. Selection and cursor survive layer changes.
     ------------------------------------------------------------------ */
  const mkCam = (pos, tg, fov, w, h) => {
    const sub = (a, b) => a.map((v, i) => v - b[i]), dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], nrm = a => { const l = Math.hypot(...a); return a.map(v => v / l); },
      cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const f = nrm(sub(tg, pos)), r = nrm(cr(f, [0, 0, 1])), u = cr(r, f), fp = (w / 2) / Math.tan(fov / 2);
    return (x, y, z = 0) => { const d = sub([x, y, z], pos), zc = dot(d, f); return [w / 2 + dot(d, r) / zc * fp, h / 2 - dot(d, u) / zc * fp, zc]; };
  };
  const CAMS = {
    A: { name: 'A 机位', note: '低位 · P01 底线后侧', pos: [-1.6, -5.0, 3.0], tg: [3.05, 7.4, 0.2], fov: 0.98 },
    B: { name: 'B 机位', note: '高位 · 对角', pos: [9.0, 16.6, 6.6], tg: [3.0, 6.2, 0.1], fov: 1.0 }
  };
  const VW = 400, VH = 280;
  const courtLines = [[[0, 0], [6.1, 0], [6.1, 13.4], [0, 13.4], [0, 0]], [[0.46, 0], [0.46, 13.4]], [[5.64, 0], [5.64, 13.4]], [[0, 4.72], [6.1, 4.72]], [[0, 8.68], [6.1, 8.68]], [[3.05, 0], [3.05, 4.72]], [[3.05, 8.68], [3.05, 13.4]], [[0, 0.76], [6.1, 0.76]], [[0, 12.64], [6.1, 12.64]]];
  const pstr = pts => pts.map(p => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L');
  const frac = v => v - Math.floor(v);
  const rnd = (n, k) => frac(Math.sin(n * 127.1 + k * 311.7) * 43758.5453);
  const lerp = (a, b, s) => a + (b - a) * s, ease = s => s < .5 ? 2 * s * s : 1 - Math.pow(-2 * s + 2, 2) / 2;
  const mkGeo = events => {
    const geo = []; let prev = null;
    events.forEach((e, i) => {
      const pe = events[i - 1], same = pe && pe.r === e.r, nx = events[i + 1];
      const hitterIsA = e.dir === 'A_to_B' ? true : e.dir === 'B_to_A' ? false : (same && geo[i - 1] ? !geo[i - 1].hitA : true);
      const L = hitterIsA ? [0.8 + rnd(e.n, 1) * 4.5, 6.7 + 1.5 + rnd(e.n, 2) * 4.6] : [0.8 + rnd(e.n, 1) * 4.5, 6.7 - 1.5 - rnd(e.n, 2) * 4.6];
      let H;
      if (same && geo[i - 1] && geo[i - 1].hitA !== hitterIsA) H = geo[i - 1].R.slice();
      else H = hitterIsA ? [1.1 + rnd(e.n, 3) * 3.8, 6.7 - 2.2 - rnd(e.n, 4) * 3.2] : [1.1 + rnd(e.n, 3) * 3.8, 6.7 + 2.2 + rnd(e.n, 4) * 3.2];
      const off = e.st === 'observed_no_response_zero' ? [(rnd(e.n, 5) > .5 ? 1.5 : -1.5), (hitterIsA ? 1 : -1) * .9] : [(rnd(e.n, 6) - .5) * .5, (rnd(e.n, 7) - .5) * .4];
      const R = [Math.min(5.7, Math.max(.4, L[0] + off[0])), L[1] + off[1]];
      const dt = same && nx && nx.r === e.r ? nx.t - e.t : (nx && nx.r === e.r ? nx.t - e.t : 0.9);
      geo.push({ hitA: hitterIsA, H, L, R, dt: Math.min(dt, 1.6), apex: 1.7 + Math.min(dt, 1.4) * 2.4 });
    });
    return geo;
  };
  const arcPt = (g, s) => { const x = lerp(g.H[0], g.L[0], s), y = lerp(g.H[1], g.L[1], s), z = Math.max(0.02, lerp(1.15, 0.03, s) + 4 * g.apex * s * (1 - s) * .55); return [x, y, z]; };
  const zoneOf = (g, hitA) => { const d = Math.abs(g.L[1] - 6.7); return d < 2.3 ? '前场' : d < 4.4 ? '中场' : '后场'; };
  const staticLayer = id => {
    const c = CAMS[id], P = mkCam(c.pos, c.tg, c.fov, VW, VH);
    const floor = `<path class="r28-floor" d="M${pstr([[0, 0, 0], [6.1, 0, 0], [6.1, 13.4, 0], [0, 13.4, 0]].map(p => P(...p)))}Z"/>`;
    const lines = courtLines.map(l => `<path class="r28-line" d="M${pstr(l.map(p => P(p[0], p[1], 0)))}"/>`).join('');
    const net = `<path class="r28-net" d="M${pstr([[-.1, 6.7, 0], [-.1, 6.7, 1.55], [6.2, 6.7, 1.55], [6.2, 6.7, 0]].map(p => P(...p)))}Z"/><path class="r28-nettop" d="M${pstr([[-.1, 6.7, 1.55], [6.2, 6.7, 1.55]].map(p => P(...p)))}"/>`;
    const grid = [1, 2].map(i => `<line class="r28-gl" x1="${VW / 3 * i}" x2="${VW / 3 * i}" y1="0" y2="${VH}"/><line class="r28-gl" x1="0" x2="${VW}" y1="${VH / 3 * i}" y2="${VH / 3 * i}"/>`).join('');
    return `<rect width="${VW}" height="${VH}" class="r28-bg"/>${grid}${floor}${lines}${net}`;
  };
  const dynLayer = (id, st) => {
    const c = CAMS[id], P = mkCam(c.pos, c.tg, c.fov, VW, VH), g = st.g, s = st.s;
    const unk = st.e.dir === 'unknown';
    let o = '';
    // previous arc (faint) and this arc
    if (st.pg) { const pts = Array.from({ length: 21 }, (_, i) => P(...arcPt(st.pg, i / 20))); o += `<path class="r28-prev" d="M${pstr(pts)}"/>`; }
    const full = Array.from({ length: 25 }, (_, i) => P(...arcPt(g, i / 24)));
    o += `<path class="r28-arc dash" d="M${pstr(full)}"/>`;
    const upto = Array.from({ length: Math.max(2, Math.round(24 * s) + 1) }, (_, i) => P(...arcPt(g, Math.min(s, i / 24 * 1))));
    if (s > .02) o += `<path class="r28-arc${unk ? ' unk' : ''}" d="M${pstr(Array.from({ length: 25 }, (_, i) => i / 24 * s).map(ss => P(...arcPt(g, ss))))}"/>`;
    // landing ring
    const ring = (cx, cy, rad, n = 16) => Array.from({ length: n + 1 }, (_, i) => P(cx + Math.cos(i / n * 6.2832) * rad, cy + Math.sin(i / n * 6.2832) * rad, 0));
    const lr = .28 + (s >= 1 ? 0 : 0);
    o += `<path class="r28-land${unk ? ' unk' : ''}" d="M${pstr(ring(g.L[0], g.L[1], lr))}" style="opacity:${s > .75 ? 1 : .35}"/>`;
    if (s >= 1) o += `<path class="r28-ripple" d="M${pstr(ring(g.L[0], g.L[1], .62))}"/>`;
    // players
    const pl = (pos, who, role) => {
      const gnd = P(pos[0], pos[1], 0), head = P(pos[0], pos[1], 1.72), hr = Math.hypot(...[0, 1].map(k => P(pos[0], pos[1], 1.55)[k] - P(pos[0], pos[1], 1.9)[k])) * .75 + 2.5;
      const sh = `<ellipse class="r28-shadow" cx="${gnd[0]}" cy="${gnd[1]}" rx="${hr * 1.9}" ry="${hr * .65}"/>`;
      const body = `<line class="r28-body ${who}" x1="${gnd[0]}" y1="${gnd[1]}" x2="${head[0]}" y2="${head[1] + hr}"/>`;
      const mark = who === 'a' ? `<circle class="r28-p a" cx="${head[0]}" cy="${head[1]}" r="${hr}"/>` : `<rect class="r28-p b" x="${head[0] - hr}" y="${head[1] - hr}" width="${hr * 2}" height="${hr * 2}"/>`;
      const ringm = role ? `<circle class="r28-role ${role}" cx="${head[0]}" cy="${head[1]}" r="${hr + 5}"/>` : '';
      return sh + body + mark + ringm + `<text class="r28-name" x="${head[0] + hr + 6}" y="${head[1] + 3}">${who === 'a' ? 'P01' : 'P02'}</text>`;
    };
    const aPos = g.hitA ? st.hp : st.rp, bPos = g.hitA ? st.rp : st.hp;
    o += pl(aPos, 'a', g.hitA ? 'hit' : 'recv') + pl(bPos, 'b', g.hitA ? 'recv' : 'hit');
    // ball
    const bp = arcPt(g, s), bs = P(bp[0], bp[1], bp[2]), gs = P(bp[0], bp[1], 0);
    o += `<ellipse class="r28-shadow" cx="${gs[0]}" cy="${gs[1]}" rx="4" ry="1.6"/><circle class="r28-ball" cx="${bs[0]}" cy="${bs[1]}" r="3.6"/>`;
    // contact flash
    if (s >= 1 && st.e.st === 'observed_contact_model_estimate') { const rh = P(st.rp[0], st.rp[1], 1.1); o += `<circle class="r28-flash" cx="${rh[0]}" cy="${rh[1]}" r="9"/>`; }
    if (s >= 1 && st.e.st === 'observed_no_response_zero') { const rh = P(g.L[0], g.L[1], 0.1); o += `<path class="r28-miss" d="M${rh[0] - 6} ${rh[1] - 6}l12 12m0-12-12 12"/>`; }
    return o;
  };
  const lanesFor = lv => [['p1', '○ P01', 40], ['p2', '□ P02', 40], ['un', '◇ 方向未知', 28]].concat(lv >= 1 ? [['s1', 'P01 的说法', 30], ['s2', 'P02 的说法', 30], ['co', '教练 C01', 30]] : [], lv >= 2 ? [['es', '估计', 104]] : []);
  const probeTimeline = (events, lv, W, sel, t) => {
    const narrow = W < 560, left = narrow ? 8 : 116, right = W - 10, X = tm => left + tm / 30 * (right - left), lanes = lanesFor(lv);
    let y = 30, g = '', rows = {};
    [[1, 0.2, 1.1], [2, 6.4, 10.5], [3, 15.7, 20.5], [4, 27.0, 29.2]].forEach(([r, a, b]) => g += `<rect class="r26-rallyband" x="${X(a)}" y="14" width="${Math.max(10, X(b) - X(a))}" height="@H@"/><text class="r26-svg-label strong" x="${X(a)}" y="10">R${r}</text>`);
    lanes.forEach(([id, label, h]) => {
      const top = y + (narrow ? 15 : 0); rows[id] = { top, h, mid: top + h / 2 };
      g += `<line class="r26-gridline" x1="${left}" x2="${right}" y1="${top + h / 2}" y2="${top + h / 2}" style="opacity:${id === 'es' ? 0 : .22}"/><text class="r26-svg-label" x="${narrow ? left : 0}" y="${narrow ? top - 4 : top + h / 2 + 4}">${E(label)}</text>`;
      y = top + h + 6;
    });
    const H = y + 24;
    const Y = e => (e.dir === 'A_to_B' ? rows.p1 : e.dir === 'B_to_A' ? rows.p2 : rows.un).mid;
    // flights between consecutive hits of one rally, with the gap in seconds
    for (let i = 1; i < events.length; i++) {
      const a = events[i - 1], b = events[i]; if (a.r !== b.r) continue;
      const ok = a.dir !== 'unknown' && b.dir !== 'unknown' && a.dir !== b.dir, x1 = X(a.t), x2 = X(b.t), y1 = Y(a), y2 = Y(b);
      g += `<path class="r26-flight${ok ? '' : ' dashed'}" d="M${x1} ${y1}${ok ? `Q${(x1 + x2) / 2 + (y1 < y2 ? 10 : -10)} ${(y1 + y2) / 2} ` : 'L'}${x2} ${y2}"/>`;
      if (!narrow && x2 - x1 > 26) g += `<text class="r28-gap" x="${(x1 + x2) / 2}" y="${Math.min(y1, y2) - 8}" text-anchor="middle">${(b.t - a.t).toFixed(2)}</text>`;
    }
    events.forEach(e => {
      const r = e.dir === 'A_to_B' ? rows.p1 : e.dir === 'B_to_A' ? rows.p2 : rows.un, x = X(e.t), s = e.n === sel;
      g += `<g class="r28-hit" data-hit="${e.n}" tabindex="0" role="button" aria-label="第 ${e.n} 拍，${e.t.toFixed(2)} 秒，${who(e.dir)}">${s ? `<circle class="r26-selection" cx="${x}" cy="${r.mid}" r="14"/>` : ''}<rect x="${x - 12}" y="${r.mid - 16}" width="24" height="32" fill="transparent"/>${mark(e.dir, x, r.mid, 6)}</g>`;
      if (e.st === 'observed_no_response_zero') g += `<path class="r26-stop" d="M${x - 4} ${r.mid + 11}l8 8m0-8-8 8"/>`;
      else if (e.st === 'not_observable_unknown') g += `<text class="r26-svg-label" x="${x}" y="${r.mid + 20}" text-anchor="middle">?</text>`;
    });
    if (lv >= 1) {
      const s1 = rows.s1, s2 = rows.s2, co = rows.co;
      g += `<rect class="r28-noanchor" x="${X(0)}" y="${s1.top + 3}" width="${X(30) - X(0)}" height="${s1.h - 6}"/><text class="r26-svg-label" x="${X(0) + 8}" y="${s1.mid + 4}">跨片段回答：这一段里没有锚点</text>`;
      g += `<rect class="r28-span dash" x="${X(6.8)}" y="${s2.top + 3}" width="${X(20.2) - X(6.8)}" height="${s2.h - 6}"/><text class="r26-svg-label" x="${X(6.8) + 8}" y="${s2.mid + 4}">推定 R2—R3</text>`;
      g += `<rect class="r28-span" x="${X(0)}" y="${co.top + 3}" width="${X(30) - X(0)}" height="${co.h - 6}"/><text class="r26-svg-label" x="${X(0) + 8}" y="${co.mid + 4}">盲读：同一个 30 秒片段</text>`;
    }
    if (lv >= 2) {
      const es = rows.es, YY = v => es.top + es.h - 14 - v / 10 * (es.h - 28);
      [0, 5, 10].forEach(v => g += `<line class="r26-gridline" x1="${left}" x2="${right}" y1="${YY(v)}" y2="${YY(v)}"/><text class="r26-svg-label" x="${left - 4}" y="${YY(v) + 4}" text-anchor="end">${v}</text>`);
      [1, 2, 3, 4].forEach(r => { const es2 = events.filter(e => e.r === r && e.go != null); if (es2.length > 1) g += `<path class="r28-trace" d="M${es2.map(e => `${X(e.t)} ${YY(e.go)}`).join('L')}"/>`; });
      events.forEach(e => {
        if (e.go == null) return; const x = X(e.t);
        if (e.ga != null) g += `<line class="r26-pairline" x1="${x}" x2="${x}" y1="${YY(e.go)}" y2="${YY(e.ga)}"/>`;
        g += `<circle class="r26-offer" cx="${x}" cy="${YY(e.go)}" r="4.5"/>`;
        if (e.ga == null) { /* not observable: no marker */ } else if (e.ga === 0) g += `<path class="r26-stop" d="M${x - 4} ${YY(0) - 4}l8 8m0-8-8 8"/>`;
        else g += `<rect class="r26-actual" x="${x - 4}" y="${YY(e.ga) - 4}" width="8" height="8"/>`;
      });
      g += `<text class="r26-svg-label" x="${right}" y="${es.top + 6}" text-anchor="end">纵轴同一 0—100 尺度，这里只画 0—10 段</text>`;
    }
    g += `<line class="r28-cursor" x1="${X(t)}" x2="${X(t)}" y1="14" y2="${H - 20}"/>`;
    [0, 5, 10, 15, 20, 25, 30].forEach(s => g += `<text class="r26-svg-label" x="${X(s)}" y="${H - 4}" text-anchor="${s === 0 ? 'start' : s === 30 ? 'end' : 'middle'}">${s}s</text>`);
    return { H, X, left, right, svg: svg(W, H, '探针时间轴', g.replace(/@H@/g, H - 44)) };
  };
  const planSVG = (events, geo, sel) => {
    const e = events.find(x => x.n === sel), ids = events.filter(x => x.r === e.r), S = 50, X = y => 40 + y * S, Y = x => 14 + x * S;
    let g = '';
    g += `<rect x="${X(0)}" y="${Y(0)}" width="${13.4 * S}" height="${6.1 * S}" class="r28-floor"/>`;
    g += courtLines.map(l => `<path class="r28-line" d="M${l.map(p => `${X(p[1])} ${Y(p[0])}`).join('L')}"/>`).join('');
    g += `<line class="r28-nettop" x1="${X(6.7)}" x2="${X(6.7)}" y1="${Y(-.2)}" y2="${Y(6.3)}"/>`;
    g += `<text class="r28-name" x="${X(0.2)}" y="${Y(6.1) + 18}">P01 半场 ○</text><text class="r28-name" x="${X(13.4)}" y="${Y(6.1) + 18}" text-anchor="end">P02 半场 □</text>`;
    ids.forEach(q => {
      const i = events.indexOf(q), gg = geo[i], cur = q.n === sel, ctrl = [(gg.H[1] + gg.L[1]) / 2, Math.min(gg.H[0], gg.L[0]) - 1.6];
      g += `<path class="r28-parc${cur ? ' cur' : ''}${q.dir === 'unknown' ? ' unk' : ''}" d="M${X(gg.H[1])} ${Y(gg.H[0])}Q${X(ctrl[0])} ${Y(ctrl[1])} ${X(gg.L[1])} ${Y(gg.L[0])}"/>`;
      g += `<g class="r28-pl${cur ? ' cur' : ''}" data-hit="${q.n}" tabindex="-1">${mark(q.dir, X(gg.L[1]), Y(gg.L[0]), cur ? 8 : 6)}<text x="${X(gg.L[1]) + 10}" y="${Y(gg.L[0]) - 8}">#${String(q.n).padStart(2, '0')}</text></g>`;
    });
    return svg(780, 342, '俯视示意：这一回合每一拍的示意落点', g, '示意落点，不是实测位置');
  };
  const plans = {
    p1: { id: 'P01', g: '○', goal: '落点 / 线路', plan: ['变方向', '多给后场球'], role: '要求喂球' },
    p2: { id: 'P02', g: '□', goal: '落点 / 线路', plan: ['稳定重复同一种球', '像比赛一样打'], role: '打算喂球' }
  };
  const dimNames = [['response_continuity', '回应连续'], ['technique_transition', '技术转换'], ['placement_line_control', '落点 / 线路'], ['spatial_coverage', '空间覆盖'], ['movement_demand', '移动需求'], ['recovery_readiness', '回位准备'], ['rhythm_stability_variation', '节奏稳定 / 变化'], ['decision_pressure', '决策压力']];
  M.rallylensProbe = {
    html: () => `<div class="r28-probe">
      <div class="r28-bar"><b>RallyLens<small>设计探针 · 代码重绘的可操作示意</small></b><span>G01_02 · 阶段 2 · 目标：落点 / 线路</span>
        <div class="r26-controls" role="group" aria-label="信息层级">${['01 回放', '02 观察与说法', '03 模型候选'].map((x, i) => `<button type="button" data-level="${i}" aria-pressed="${!i}">${x}</button>`).join('')}</div></div>
      <div class="r28-body">
        <div class="r28-stage">
          <div class="r28-views">${['A', 'B'].map(id => `<figure data-cam="${id}"><svg viewBox="0 0 ${VW} ${VH}" role="img" aria-label="${CAMS[id].name}示意：球场、两名球员和球的飞行弧线"><g class="st"></g><g class="dy"></g></svg><figcaption><b>${CAMS[id].name}</b><span>${CAMS[id].note}</span><i class="tc"></i></figcaption></figure>`).join('')}</div>
          <div class="r28-flightbar"><div class="r28-steps" role="group" aria-label="切换拍次"><button type="button" data-step="-1" aria-label="上一拍">◀</button><button type="button" data-replay aria-label="重放这一拍的球路">▶ 重放</button><button type="button" data-step="1" aria-label="下一拍">▶</button></div><p class="r28-fl" aria-live="polite"></p></div>
          <div class="r28-tl"></div>
          <div class="r28-plan"></div>
          <p class="r28-hint">站位、球路和落点是示意：时间、方向、回合与回应状态取自逐事件表，位置没有实测。</p>
        </div>
        <div class="r28-side">
          <article class="r28-ev"></article>
          <article class="r28-goals"></article>
          <article class="r28-say" hidden></article>
          <article class="r28-rec"></article>
        </div>
      </div>
      <p class="r26-source">§6.2 · Fig.5 · Figs S6 / S7。点时间轴上的任意一拍，或用上一拍 / 下一拍：两个机位里的球路、右侧的事件卡和 DPE 记录一起切换；切换层级时选中的事件不变。</p></div>`,
    async init(el) {
      const tl = el.querySelector('.r28-tl');
      try {
        const [{ events }, dpe] = await Promise.all([fetch('assets/stage/rally-g01_02.json').then(r => r.json()), fetch('assets/composition/rally-events.json').then(r => r.json()).catch(() => [])]);
        const geo = mkGeo(events), rec = n => dpe.find(x => x.dpe_id === 'DPE_G01_02' && x.physical_event_index === n);
        let lv = 0, sel = 2, W = 0, anim = 0, st = null;
        const views = { A: el.querySelector('[data-cam=A] svg'), B: el.querySelector('[data-cam=B] svg') };
        Object.entries(views).forEach(([id, sv]) => sv.querySelector('.st').innerHTML = staticLayer(id));
        const idx = () => events.findIndex(x => x.n === sel);
        const state = (i, s, from) => {
          const g = geo[i], e = events[i]; const prevSame = events[i - 1] && events[i - 1].r === e.r ? geo[i - 1] : null;
          const hp = from ? from.hp.map((v, k) => lerp(v, g.H[k], Math.min(1, s * 4))) : g.H, rp = from ? from.rp.map((v, k) => lerp(v, g.R[k], ease(s))) : (s >= 1 ? g.R : g.H.map((v, k) => lerp(g.L[k], g.R[k], ease(s))));
          return { e, g, pg: prevSame, s, hp, rp };
        };
        const paint = () => { Object.entries(views).forEach(([id, sv]) => sv.querySelector('.dy').innerHTML = dynLayer(id, st)); };
        const e0 = () => events[idx()];
        let last = null;
        const play = (animate) => {
          cancelAnimationFrame(anim); const i = idx(), t0 = performance.now(), dur = 900, from = last;
          if (!animate) { st = state(i, 1, null); paint(); last = { hp: st.hp.slice(), rp: st.rp.slice() }; return; }
          const fin = () => { st = state(i, 1, from); paint(); last = { hp: st.hp.slice(), rp: st.rp.slice() }; };
          const fr = now => { const s = Math.min(1, (now - t0) / dur); st = state(i, s, from); paint(); if (s < 1) anim = requestAnimationFrame(fr); else last = { hp: st.hp.slice(), rp: st.rp.slice() }; };
          anim = requestAnimationFrame(fr); setTimeout(() => { if (st && st.s < 1) fin(); }, dur + 120);
        };
        const panels = () => {
          const i = idx(), e = events[i], g = geo[i], r = rec(e.n), pos = events.filter(x => x.r === e.r), k = pos.indexOf(e) + 1, nx = events[i + 1], pv = events[i - 1];
          const sameP = pv && pv.r === e.r, sameN = nx && nx.r === e.r, stt = stateText[e.st];
          el.querySelector('.r28-ev').innerHTML = `<header>${gly(e.dir, 22)}<b>#${String(e.n).padStart(2, '0')}</b><span>R${e.r} 第 ${k} / ${pos.length} 拍<br>${e.t.toFixed(2)} s · 片段内</span></header>
            <dl><div><dt>谁 → 谁</dt><dd>${who(e.dir)}</dd></div><div><dt>回应</dt><dd>${stt[0]}<small>${stt[1]}</small></dd></div><div><dt>间隔</dt><dd>${sameP ? `上一拍 ${(e.t - pv.t).toFixed(2)} s` : '回合第一拍'}${sameN ? ` · 下一拍 ${(nx.t - e.t).toFixed(2)} s` : ' · 回合最后一拍'}</dd></div></dl>`;
          const hitK = e.dir === 'A_to_B' ? 'p1' : e.dir === 'B_to_A' ? 'p2' : '';
          el.querySelector('.r28-goals').innerHTML = `<b class="h">两张阶段卡，同一阶段</b><div class="r28-pair">${['p1', 'p2'].map(key => { const p = plans[key], role = !hitK ? '方向未知' : key === hitK ? '本拍给出' : '本拍接球'; return `<section class="${key}${key === hitK ? ' hit' : hitK ? ' recv' : ''}"><header><i>${p.g}</i><b>${p.id}</b><em>${role}</em></header><small>目标</small><p>${p.goal}</p><small>${p.role}</small><p>${p.plan.join('　')}</p></section>`; }).join('')}</div><small class="note">四项评价两人完全一样；阶段卡没有对齐到某一拍。</small>`;
          const inP2 = e.t >= 6.4 && e.t <= 20.6;
          el.querySelector('.r28-say').innerHTML = `<b class="h">事后的说法，各自对应不同的范围</b><p><i>○</i> P01：这一段只是顺着来球打。<em>没有锚点</em></p><p class="${inP2 ? 'on' : ''}"><i>□</i> P02：这一段是刻意安排的，开头两个来回很稳。<em>${inP2 ? '这一拍在推定的 R2—R3 里' : '这一拍在推定范围之外'}</em></p><p><i>C</i> 教练 C01：落点太不稳定，练不成重复的套路。<em>读的是整个片段</em></p>`;
          const f = (v, d = 2) => v == null ? '—' : (+v).toFixed(d);
          let h = `<b class="h">DPE_G01_02 · 第 ${e.n} 个事件的记录</b>`;
          if (!r) h += '<p>记录表未加载。</p>';
          else {
            h += `<dl class="kv"><div><dt>gold_shot_id</dt><dd>${r.gold_shot_id}</dd></div><div><dt>event_time_a_s</dt><dd>${(+r.event_time_a_s).toFixed(3)}</dd></div><div><dt>direction</dt><dd>${r.direction}</dd></div><div><dt>actual_status</dt><dd>${r.actual_status}</dd></div></dl>`;
            if (lv >= 2) {
              h += `<div class="r28-bars">${['E', 'R', 'U', 'S1', 'S3', 'S5'].map(kk => `<div><span>${kk}</span><i><u style="width:${(r[kk] || 0) * 100}%"></u></i><b>${f(r[kk])}</b></div>`).join('')}</div><p class="r28-dc">D ${f(r.D, 1)}　C ${f(r.C, 1)}　<small>0—100</small></p>`;
              h += r.goal_id ? `<p class="r28-goal">GoalOffer <strong>${f(r.goal_offer_score)}</strong> GoalActual <strong>${f(r.goal_actual_score)}</strong></p>` : '<p class="r28-goal"><small>方向未知：不给目标估计</small></p>';
              h += `<details><summary>八个父维度 Offer ○ / Actual ■</summary><div class="r28-dims">${dimNames.map(([kk, nm]) => { const a = r['offer_' + kk], b = r['actual_' + kk]; return `<div><span>${nm}</span><i><s style="left:${a}%"></s><u style="left:${b}%"></u></i><b>${f(a, 1)} / ${f(b, 1)}</b></div>`; }).join('')}</div></details>`;
            } else h += '<p class="r28-more">切到“03 模型候选”可以看到这一拍的 E / R / U / S1 / S3 / S5 和目标估计。</p>';
            h += `<details><summary>全部字段</summary><pre>${E(JSON.stringify(r, null, 1))}</pre></details>`;
          }
          el.querySelector('.r28-rec').innerHTML = h;
          const gz = zoneOf(g);
          el.querySelector('.r28-fl').innerHTML = e.dir === 'unknown' ? `<b>#${String(e.n).padStart(2, '0')}</b> 方向两个机位都没能确定：球路画成虚线，不替它指派。` : `<b>#${String(e.n).padStart(2, '0')}</b> ${who(e.dir)} · 飞行约 ${g.dt.toFixed(2)} s · 示意落点：对方${gz}`;
          el.querySelectorAll('[data-cam] .tc').forEach(n => n.textContent = `${e.t.toFixed(2)} s`);
          el.querySelector('.r28-plan').innerHTML = `<p class="cap">俯视 · R${e.r} 全部 ${pos.length} 拍的示意落点<small>点编号可跳到那一拍</small></p>` + planSVG(events, geo, sel);
        };
        const draw = (animate) => {
          W = Math.max(300, tl.clientWidth); const e = e0();
          tl.innerHTML = probeTimeline(events, lv, W, sel, e.t).svg;
          el.querySelectorAll('[data-level]').forEach(b => b.setAttribute('aria-pressed', +b.dataset.level === lv));
          el.querySelector('.r28-say').hidden = lv < 1;
          panels();
        };
        const select = (n, animate = true) => { sel = n; draw(); play(animate); };
        el.addEventListener('click', ev => {
          const b = ev.target.closest('[data-level]'); if (b) { lv = +b.dataset.level; draw(); return; }
          const h = ev.target.closest('[data-hit]'); if (h) { select(+h.dataset.hit); return; }
          const sb = ev.target.closest('[data-step]'); if (sb) { const i = Math.min(events.length - 1, Math.max(0, idx() + +sb.dataset.step)); select(events[i].n); return; }
          if (ev.target.closest('[data-replay]')) { play(true); return; }
          const s = ev.target.closest('.r28-tl svg'); if (s) { const r = s.getBoundingClientRect(), narrow = W < 560, left = narrow ? 8 : 116, x = (ev.clientX - r.left) / r.width * W, tm = (x - left) / (W - 10 - left) * 30; select(events.reduce((k, e) => Math.abs(e.t - tm) < Math.abs(k.t - tm) ? e : k).n); }
        });
        el.addEventListener('keydown', ev => { if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.matches('[data-hit]')) { ev.preventDefault(); select(+ev.target.dataset.hit); el.querySelector(`[data-hit="${sel}"]`)?.focus(); } });
        new ResizeObserver(() => { if (Math.abs(tl.clientWidth - W) > 2) draw(); }).observe(tl);
        draw(); play(false);
      } catch (e) { tl.textContent = '逐事件表加载失败，请刷新后重试。'; console.error(e); }
    }
  };

  const QUOTES = { one: ['In only one of those stages did both partners write the same feeding plan. In six, the plans pointed in opposite directions.', '§4.0'], ratios: ['Partners picked the same goal option in 6 of the 16 rows, and both rated their mutual understanding as consistent in 6 of 15 comparable pairs.', '§4.0'], def: ['Direction, accounts, referent, scope, standard, and what stays unknown: this section describes a unit built to hold them.', '§5'], cost: ['…the alternative is a record that reads as agreement.', '§5.4'], agree: ['Directions the merge did not resolve are carried as unknown.', '§3.4'] };
  const withQuote = (h, b) => { const q = QUOTES[b.key]; if (!q || !/<\/section>\s*$/.test(h)) return h; return h.replace(/<\/section>\s*$/, `<div class="r27-quote"><button type="button" class="r27-qb" aria-expanded="false">对照论文原句</button><blockquote hidden><p lang="en">${E(q[0])}</p><cite>${E(q[1])} · 论文英文原文</cite></blockquote></div></section>`); };
  const renderBlock0 = (b,a,k) => withQuote(renderBlock(b,a,k), b);
  const renderBlock = (b,a,k) => {
    switch(b.key){
      case 'track':return section({h:'同一段 30 秒，从整段看到单拍。'},localModule('rallylensTrack',{modes:b.modes}),'r26-track-section');
      case 'state':return section({...b,h:'回应状态有三种，不用猜。'},`<div class="r26-states">${b.items.map(([id,h,p],i)=>`<article data-state="${id}"><b>${['●','×','◇'][i]} ${E(h)}</b><p>${E(p)}</p></article>`).join('')}</div>`);
      case 'evening':return section({...b,h:'球友的一晚，任务会改变。'},`<ol class="r26-steps">${b.steps.map(([h,p],i)=>`<li><small>${String(i+1).padStart(2,'0')}</small><b>${E(h)}</b><p>${E(p)}</p></li>`).join('')}</ol>`);
      case 'versus':return section(b,`<div class="r26-compare"><header><span>比较项目</span><b>职业比赛 / 专业训练</b><b>本研究的业余对练</b></header>${b.rows.map(([h,x,y])=>`<div><h4>${E(h)}</h4><p>${E(x)}</p><p>${E(y)}</p></div>`).join('')}<footer>专业训练的练习任务由教练或 drill 定义；本研究保留每位搭档自己理解的目标与条件。§2.2</footer></div>`);
      case 'transfer':return section(b,aucPlot(b,k)+`<p class="r26-foot">${E(b.data)}</p>`);
      case 'returns':case 'formative':case 'rq': {
        if(b.key==='rq')return section({...b,h:b.q},`<p class="r26-rq">${E(b.en)}</p>`,'r26-question');
        if(b.key==='formative')return section(b,`<div class="r26-numbers">${b.meta.map(([n,h,d])=>`<div><b>${E(n)}</b><p>${E(h)}<small>${E(d)}</small></p></div>`).join('')}</div><ol class="r27-chips">${b.ideas.map(E).map((s,i)=>`<li><small>${String(i+1).padStart(2,'0')}</small>${s}</li>`).join('')}</ol>`);
        return section(b,`<div class="r26-four">${b.items.map(([h,p])=>`<article><b>${E(h)}</b><p>${E(p)}</p></article>`).join('')}</div>`);
      }
      case 'people':return section(b,`<div class="r26-numbers">${b.nums.map(([n,p])=>`<div><b>${E(n)}</b><p>${E(p)}</p></div>`).join('')}</div>`);
      case 'stages':return section(b,`<div class="r27-roles" role="group" aria-label="按阶段切换，对比两人的角色"><div class="r27-rh"><span></span><b>○ P01</b><b>□ P02</b></div>${b.items.map((x,i)=>`<button type="button" class="r27-rs" data-stage="${i}" aria-pressed="${i===1}"><small>${x.n}</small><span>${E(x.t)}</span><em class="a ${x.a==='自由'||x.a==='计分'?'free':''}">${E(x.a)}</em><em class="b ${x.b==='自由'||x.b==='计分'?'free':''}">${E(x.b)}</em></button>`).join('')}</div><ol class="r26-stage-grid">${b.items.map((x,i)=>`<li data-stage="${i}" class="${i===1?'on':''}"><header><b>${x.n}</b><h4>${E(x.t)}</h4><small>${E(x.d)}</small></header><div class="r26-roles"><span>○ ${E(x.a)}</span><span>□ ${E(x.b)}</span></div><dl><div><dt>阶段前</dt><dd>${E(x.before)}</dd></div><div><dt>阶段后</dt><dd>${E(x.after)}</dd></div><div><dt>阶段卡</dt><dd>${E(x.card)}</dd></div></dl></li>`).join('')}</ol>`);
      case 'card':return section(b,planCards(b),'r26-card-section');
      case 'cams':return section(b,`<div class="r26-cameras">${cropped(b.a,'CAM A · #02 · 6.80 s')}${cropped(b.b,'CAM B · 同一事件')}</div><p class="r26-legend">${b.tag.map(([h,x])=>`<span>${E(h)} · ${E(x)}</span>`).join('')}</p><p class="r26-foot">${E(b.cap)}</p>`);
      case 'sources':return section(b,coverageNested()+`<p class="r26-foot">${E(b.cap)}</p>`);
      case 'chain':case 'order':return section(b,`<ol class="r26-steps ${b.key==='order'?'vertical':''}">${b.steps.map((x,i)=>`<li><small>${String(i+1).padStart(2,'0')}</small><b>${E(Array.isArray(x)?x[0]:x)}</b>${Array.isArray(x)?`<p>${E(x[1])}</p>`:''}</li>`).join('')}</ol>`);
      case 'agree':return section(b,agreeSVG()+`<div class="r26-numbers">${b.nums.map(([n,x])=>`<div><b>${E(n)}</b><p>${E(x)}</p></div>`).join('')}</div><p class="r26-foot">95.0% 是每片段较小事件数 / 较大事件数的均值，不是逐事件识别准确率。</p>`);
      case 'timeline':return section(b,`<ol class="r26-materials">${b.items.map(x=>`<li><small>${E(x.t)}</small><div><h4>${E(x.h)}</h4><p>${E(x.p)}</p><p>${E(x.who)}</p></div><span>${E(x.exp)}</span></li>`).join('')}</ol>`);
      case 'bounds':return section({...b,h:'这些材料能回答什么，不能回答什么。'},`<ol class="r27-chips wide">${b.items.map((x,i)=>`<li><small>${String(i+1).padStart(2,'0')}</small>${E(x)}</li>`).join('')}</ol>`);
      case 'one':return section(b,`<div class="r26-ratio"><b>${E(b.num)}<small> / ${E(b.of)}</small></b><p>相同的喂球计划<br>可比较的角色阶段</p></div><div class="r27-sixteen" role="img" aria-label="16 个可比较的角色阶段：1 个计划相同，6 个计划相反（其中 3 个两人都评执行了、搭档合适），其余 9 个既不相同也不相反"><ol>${Array.from({length:16},(_,i)=>`<li class="${i===0?'same':i<4?'opp ok':i<7?'opp':''}"></li>`).join('')}</ol><p><i class="same"></i>计划相同 1<i class="opp ok"></i>计划相反，两人都评“执行了、搭档合适” 3<i class="opp"></i>计划相反，其他 3<i></i>其余 9</p></div>`,'r26-highlight');
      case 'ratios':return section({...b,h:'卡片的八项比较，各有自己的分母。'},`<ol class="r26-ratios">${b.rows.map(([h,n,d,unit])=>`<li><div><b>${E(h)}</b><small>分母：${E(unit)}</small></div><span class="r26-ratio-track"><i style="width:${n/d*100}%"></i></span><strong>${n}/${d}</strong></li>`).join('')}</ol><p class="r26-foot">${E(b.note)}</p>`);
      case 'five':{const ts=[...new Set(b.rows.map(x=>x.t))];return section(b,`<div class="r27-five">${ts.map((t,i)=>`<section><header><small>${String(i+1).padStart(2,'0')}</small><b>${E(t)}</b></header>${b.rows.filter(x=>x.t===t).map(x=>`<article class="${x.k}"><h4>${E(x.who)}</h4><p>${E(x.x)}</p><span>${E(x.tag)}</span></article>`).join('')}</section>`).join('')}</div><p class="r26-foot">阶段卡的完整样子见“实验怎么设计”；后来的说法与教练读法均为转述，各自保留自己的时间范围。</p>`);}
      case 'three':return section(b,`<div class="r26-cases">${b.items.map(x=>`<article data-case="${x.id}"><header><span>FIG.2 ${x.id.toUpperCase()} · ${E(x.tab)}</span><h4>${E(x.h)}</h4></header><div class="r26-case-diagram">${casesSVG(x.id)}<small>依据说法重绘 · 非测量轨迹</small></div><div class="r26-case-voices"><p data-partner="${['P02','P06','P10'].includes(x.who[0])?'b':'a'}"><b>${['P02','P06','P10'].includes(x.who[0])?'□':'○'} ${E(x.who[0])}</b>${E(x.a)}</p><p data-partner="${['P02','P06','P10'].includes(x.who[1])?'b':'a'}"><b>${['P02','P06','P10'].includes(x.who[1])?'□':'○'} ${E(x.who[1])}</b>${E(x.b)}</p><p class="r26-case-card">${E(x.card)}</p></div><p class="r26-case-reading">${E(x.so)}</p><details><summary>相关片段与反例</summary>${x.extra.map(([h,p])=>`<p><b>${E(h)}</b> ${E(p)}</p>`).join('')}</details>${source(x.src)}</article>`).join('')}</div>`);
      case 'stand':return section(b,`<div class="r26-three-cols">${b.cols.map(([h,t,p])=>`<article><small>${E(h)}</small><h4>${E(t)}</h4><p>${E(p)}</p></article>`).join('')}</div>`);
      case 'synth':case 'commit':case 'use':case 'impl':case 'layer3':return section(b,`<ol class="r27-cards ${b.key}">${b.items.map(([h,p,s],i)=>`<li><small>${String(i+1).padStart(2,'0')}</small><b>${E(h)}</b><p>${E(p)}</p>${source(s)}</li>`).join('')}</ol>`);
      case 'def':return section(b,`<div class="r26-two">${b.props.map(([h,p])=>`<article><h4>${E(h)}</h4><p>${E(p)}</p></article>`).join('')}</div>`);
      case 'layers':{const kinds=['src','event','src','voice','voice','calc','unk'];return section(b,`<p class="r27-kinds"><span class="src">来源与情境</span><span class="event">已确认事件</span><span class="voice">人的解释</span><span class="calc">计算候选</span><span class="unk">未知</span></p><ol class="r26-layer-list">${b.rows.map(([h,x,loss],i)=>`<li data-k="${kinds[i]}"><b>0${i+1}</b><h4>${E(h)}</h4><p>${E(x)}</p><small>缺失时：${E(loss)}</small></li>`).join('')}</ol>`);}
      case 'arch':return section(b,archSVG()+'<p class="r26-foot">窗口层的值不拆分，也不赋给单拍；事件层和窗口层共用同一组片段、时间、方向和证据编号。</p>');
      case 'atlas':return section(b,localModule('rallylensAtlas'));
      case 'decomp':return section(b,decompSVG(b));
      case 'apart':return section(b,`<div class="r26-three-cols">${b.items.map(([n,h,p])=>`<article><b class="r26-large">${E(n)}</b><small>${E(h)}</small><p>${E(p)}</p></article>`).join('')}</div>`);
      case 'validation':case 'cost':return section(b,'');
      default:if(b.video)return `<section class="r26-screen">${k.block(b)}</section>`;if(b.note)return `<p class="r26-endnote">${E(b.note)}</p>`;if(b.module)return `<section class="r26-section">${k.block(b)}</section>`;throw new Error('RallyLens unrendered block: '+JSON.stringify(b));
    }
  };
  const renderAct = (a,k) => {
    // The project films lead into the paper background; data inspection follows the introduction.
    const blocks=a.id==='film'?[...a.blocks.filter(b=>b.video),...a.blocks.filter(b=>!b.video)]:a.blocks;
    return head(a)+blocks.map(b=>renderBlock0(b,a,k)).join('');
  };

  PG.rallylens = {
    /* ---------- R252 — poster ---------- */
    title(k) {
      const { p, s, esc } = k;
      const boxes = ['1/4/8/6', '1/6/8/8', '1/8/8/10', '1/10/5/12', '5/4/6/10', '6/7/8/9', '4/1/7/4', '2/11/4/13', '8/9/9/12', '7/4/9/7']
        .map(a => `<i class="rt-box" style="--a:${a}"></i>`).join('');
      const cells = [['同', '5/4'], ['一', '5/5'], ['段', '5/6', 'inv'], ['练', '5/7'], ['习', '5/8'], ['两', '6/7', 'inv'], ['份', '6/8'], ['说', '7/7'], ['法', '7/8', 'inv']]
        .map(([c, a, cls]) => `<b class="rt-cell ${cls || ''}" style="--a:${a}">${c}</b>`).join('');
      return `<section class="r-title" aria-labelledby="tc-name">
        <div class="rt-poster">
          <div class="rt-ht r-ht" data-src="assets/frames/rally-wide-a.webp" data-crop="0,96,880,504" data-cell="5" role="img" aria-label="研究跟拍的原始画面：一对搭档在羽毛球场上练习，半调网点处理。"></div>
          <i class="rt-white a"></i><i class="rt-white b"></i><i class="rt-white c"></i>
          ${boxes}
          <h1 class="rt-name" id="tc-name"><span>RALLY</span><span>LENS</span></h1>
          ${cells}
          <p class="rt-q one mono" style="${at('5/1/6/3')}">理解一致<small>○ P01 · 阶段卡评价</small></p>
          <p class="rt-q two mono" style="${at('6/1/7/3')}">理解一致<small>□ P02 · 阶段卡评价</small></p>
          <p class="rt-tape" style="${at('7/1/8/7')}"><span>/&gt; G01_02 · 525—555 s · 16 拍 · 4 回合</span></p>
          <p class="rt-tape-s mono" style="${at('8/1/9/6')}">SPORTSHCI · CSCW 在投 · ${esc(p.year)} · 共同第一作者</p>
          <div class="rt-col" style="${at('5/10/9/12')}"><p>${esc(s.sub)}</p><p>分开问两个人：这段在练什么？球该怎么喂？怎样算练成？</p><b>2,204</b></div>
          <p class="rt-side mono">RALLYLENS · DYADIC PRACTICE EPISODE · ${esc(p.year)}</p>
          <a class="rt-back mono" href="index.html#scene-${p.id}" data-cut="INDEX">← INDEX</a>
          <span class="rt-no">${p.number}</span>
        </div>
        <dl class="rt-meta">${(s.meta || []).map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>
      </section>`;
    },

    /* ---------- R203 — profile sheet ---------- */
    logline(k) {
      const { s, md, esc } = k, L = s.logline || {};
      return `<section class="r-sheet" aria-label="项目摘要">
        <div class="rs-row rs-q">
          <b class="rs-qm" aria-hidden="true">?</b>
          <div class="rs-k"><b>問</b><span>PROBLEM</span></div>
          <p class="rs-p">${md(L.q)}</p>
          <figure class="rs-phone"><img src="assets/rally-ui.webp" alt="RallyLens 原型界面截图" loading="lazy"></figure>
          <p class="rs-mini mono">G01_02<br>6.80 s<br>P02 → P01</p>
        </div>
        <div class="rs-row rs-a">
          <p class="rs-name"><em>*</em>Wenjing<br>Bian</p>
          <p class="rs-tiny mono">${esc(s.stripB)}<br>研究 · 算法 · 数据 · 可视化</p>
          <b class="rs-big">做<small>MY PART</small></b>
          <p class="rs-p">${md(L.a)}</p>
          <span class="rs-ob" aria-hidden="true">○<i>□</i></span>
        </div>
        <p class="rs-tags">${['研究设计', '招募 · 访谈', '模型算法', '数据结构', '事件标注', '可视化', '!'].map(t => tag(t)).join('')}</p>
        <div class="rs-row rs-r">
          <div class="rs-k"><b>果</b><span>RESULT</span></div>
          <p class="rs-p">${md(L.r)}</p>
          <b class="rs-ratio">2,204<em>*</em></b>
          <dl class="rs-stats">${(s.stats || []).map(([v, l]) => `<div><dt>${esc(v)}</dt><dd>${esc(l)}</dd></div>`).join('')}</dl>
        </div>
        <footer class="rs-logo">
          <b>RallyLens<em>!</em></b>
          <span class="rs-hash"><i>#</i>CSCW 在投</span>
          <span class="rs-pill mono">CO-FIRST AUTHOR</span>
          <p class="rs-paper">Practising Together, Understood Apart</p>
          <i class="rs-line" aria-hidden="true"></i>
          <span class="rs-cn">一段练习 · 两份说法</span>
        </footer>
      </section>`;
    },

    act(a, i, k) { return renderAct(a,k); },


    /* ---------- behaviour ---------- */
    after(root) {
      // halftone: each cell becomes one ink dot whose radius follows the darkness under it
      const draw = el => {
        const im = el._im; if (!im || !im.naturalWidth) return;
        const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return;
        const dpr = Math.min(devicePixelRatio || 1, 2), cell = Number(el.dataset.cell || 6);
        let cv = el.querySelector('canvas'); if (!cv) { cv = document.createElement('canvas'); el.appendChild(cv); }
        cv.width = w * dpr; cv.height = h * dpr; const g = cv.getContext('2d'); g.scale(dpr, dpr);
        const [sx, sy, sw, sh] = (el.dataset.crop || `0,0,${im.naturalWidth},${im.naturalHeight}`).split(',').map(Number);
        const fx = Number(el.dataset.fx || .5);
        // cover-fit the crop into the box
        const k = Math.max(w / sw, h / sh), vw = w / k, vh = h / k, ox = sx + (sw - vw) * fx, oy = sy + (sh - vh) / 2;
        const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
        const sm = document.createElement('canvas'); sm.width = cols; sm.height = rows; const sg = sm.getContext('2d', { willReadFrequently: true });
        sg.drawImage(im, ox, oy, vw, vh, 0, 0, cols, rows);
        const px = sg.getImageData(0, 0, cols, rows).data, lum = new Float32Array(cols * rows);
        for (let j = 0; j < lum.length; j++) lum[j] = (.3 * px[j * 4] + .59 * px[j * 4 + 1] + .11 * px[j * 4 + 2]) / 255;
        // stretch the 4th–96th percentile to full range, so the court's mid-green doesn't flood the poster with dots
        const sorted = Float32Array.from(lum).sort(), lo = sorted[Math.floor(sorted.length * .04)], hi = sorted[Math.floor(sorted.length * .96)], span = Math.max(.05, hi - lo);
        const ink = getComputedStyle(el).color;
        g.fillStyle = ink;
        for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
          const l = Math.min(1, Math.max(0, (lum[y * cols + x] - lo) / span));
          const d = Math.pow(1 - l, 1.35), r = d * cell * .64;
          if (r < .3) continue;
          g.beginPath(); g.arc(x * cell + cell / 2 + (y % 2 ? cell / 2 : 0), y * cell + cell / 2, r, 0, 6.2832); g.fill();
        }
        el.classList.add('on');
      };
      const hts = [...root.querySelectorAll('.r-ht')];
      hts.forEach(el => { const im = new Image(); im.onload = () => { el._im = im; draw(el); }; im.src = el.dataset.src; });
      let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => hts.forEach(draw), 200); });
      // the seven hits of rally 3, read from the same event table the 3D court uses
      const ticks = root.querySelector('.rsl-ticks[data-rally]');
      if (ticks) fetch('assets/stage/rally-g01_02.json').then(r => r.json()).then(d => {
        const g = { A_to_B: '○', B_to_A: '□' };
        ticks.innerHTML = d.events.filter(e => e.r === Number(ticks.dataset.rally)).map(e => `<li class="${e.st === 'observed_no_response_zero' ? 'nr' : ''}"><b>#${String(e.n).padStart(2, '0')}<br>${e.t.toFixed(2)} s</b><i>${g[e.dir] || '◇'}</i></li>`).join('');
      }).catch(() => {});
      // stage switcher and paper quotes
      root.addEventListener('click', ev => {
        const sb = ev.target.closest('[data-stage]');
        if (sb) { const i = sb.dataset.stage, sec = sb.closest('.r26-section'); sec.querySelectorAll('.r27-rs').forEach(x => x.setAttribute('aria-pressed', x.dataset.stage === i)); sec.querySelectorAll('.r26-stage-grid>li').forEach(x => x.classList.toggle('on', x.dataset.stage === i)); return; }
        const qb = ev.target.closest('.r27-qb');
        if (qb) { const bq = qb.nextElementSibling, open = bq.hidden; bq.hidden = !open; qb.setAttribute('aria-expanded', String(open)); qb.textContent = open ? '收起论文原句' : '对照论文原句'; }
      });
      // R349 lollipops grow when seen
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .25 });
      root.querySelectorAll('.rl-chart, .r-title, .r-manga, .ra-axis, .r-p3').forEach(el => io.observe(el));
    }
  };
})();
