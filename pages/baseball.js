/* Pitch / Impact — bespoke page. Ballpark print: deep blue, cream ticket stock, red stitching, condensed numerals.
   Narrative: 项目由来 (origin) -> 要做什么 (build) -> 分析方法 (data / explore / detail).
   References (number = position in _refs/pins.txt):
     title      R355  team infographic poster — header bar, two players, stats in boxes and circles
     sheet      R343  stat rows: label · pattern · huge figure
     origin     R338  STARTING GRID — dark rows P1–P4
     build      R220  vertical ticket stubs — big numbers, barcodes, punched holes
     data       R345  VICTORY banner — chunky italic display over the field
     explore    R335  four-quadrant scatter poster (FiveThirtyEight)
     detail     R357  newspaper data page — serif headline, dense heat columns
   Every number on this page is computed from assets/baseball/pitch-data.json (4 CSV snapshot) or lab.json (team tables). */
(() => {
  const PG = (window.PAGES = window.PAGES || {});
  /* scatter with room on the right, so a label next to the last dot is not cut off */
  if (window.VZ && VZ.T && VZ.T.scatter) VZ.T['bb-scatter'] = (s, W) => VZ.T.scatter(s, Math.max(240, W - 84));
  const M = (window.MODULES = window.MODULES || {});
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt = n => Number(n).toLocaleString('en-US');
  const avg = a => a.length ? a.reduce((n, v) => n + v, 0) / a.length : NaN;
  const mean = a => a.length ? avg(a).toFixed(2) : '—';
  const TYPES = [['FF','四缝线','4-Seam Fastball'],['FS','指叉','Split-Finger'],['CU','曲球','Curveball'],['FC','卡特','Cutter'],['SI','伸卡','Sinker'],['SL','滑球','Slider'],['ST','横扫','Sweeper']];
  const TC = {FF:'#5aaeff',FS:'#ffd400',CU:'#ff4f00',FC:'#8e9ab8',SI:'#a8c8ff',SL:'#c9ccd4',ST:'#3a55ff'};
  const WHIFF = new Set(['swinging_strike','swinging_strike_blocked','foul_tip']);
  const SWING = new Set([...WHIFF,'foul','hit_into_play','foul_bunt','missed_bunt']);
  const located = r => r.code && r.name && Number.isFinite(r.x) && Number.isFinite(r.z);
  let evidence, labP;
  const data = () => evidence || (evidence = fetch('assets/baseball/pitch-data.json').then(r => { if (!r.ok) throw Error('CSV snapshot unavailable'); return r.json(); }));
  const lab = () => labP || (labP = fetch('assets/baseball/lab.json').then(r => { if (!r.ok) throw Error('Lab snapshot unavailable'); return r.json(); }));
  const shell = (id, title, body) => `<section class="bb-local" data-noeva><header class="bb-local-head"><span class="mono">${id} / CODE DRAWN</span><h4>${title}</h4></header>${body}</section>`;
  const err = (el, e) => { el.querySelector('.bb-loading')?.remove(); el.insertAdjacentHTML('beforeend', `<p role="alert">本地数据未能加载：${esc(e.message)}。没有补造数据。</p>`); };
  const svg = (title, desc, body, w=800, h=520) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title><desc>${esc(desc)}</desc>${body}</svg>`;
  const table = (heads, rows) => `<div class="bb-table"><table><thead><tr>${heads.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const badge = (v,t) => `<div><b>${esc(v)}</b><span>${esc(t)}</span></div>`;

  /* ---- shared filter state: the pitch field publishes it, the diagram and readout cards subscribe ---- */
  const BBS = { year: 'all', type: 'all', index: 0, total: 0, ready: false };
  const subs = [];
  const emit = () => subs.forEach(f => f(BBS));
  const onState = f => { subs.push(f); if (BBS.ready) f(BBS); };
  const counts = (d, st) => {
    const a1 = d.pitch.filter(r => st.year === 'all' || r.year === +st.year);
    const a2 = a1.filter(r => st.type === 'all' || r.code === st.type);
    const a3 = a2.filter(located);
    return { n0: d.pitch.length, n1: a1.length, n2: a2.length, n3: a3.length, sp: a2.filter(r => Number.isFinite(r.speed)).length, sub: a2, pts: a3 };
  };

  /* ---- width-aware redraw for SVG diagrams ---- */
  const fit = (host, draw) => {
    let w = 0;
    const go = (force) => { const nw = Math.round(host.clientWidth); if (!nw || (nw === w && force !== true)) return; w = nw; draw(nw); };
    go();
    if (window.ResizeObserver) new ResizeObserver(() => go()).observe(host); else addEventListener('resize', () => go());
    return () => go(true);
  };
  /* ---- svg text helpers: CJK counts as one em, latin as .58 em ---- */
  const tw = (s, fs) => [...s].reduce((n, c) => n + (c.charCodeAt(0) > 0x2e80 ? fs : c === ' ' ? fs * .32 : fs * .62), 0);
  const wrap = (s, max, fs) => { const out = []; let line = ''; const toks = String(s).match(/\n|[\u2e80-\uffff]|[^\s\u2e80-\uffff]+|\s+/g) || []; for (const t of toks) { if (t === '\n') { out.push(line.trimEnd()); line = ''; continue; } const sp = /^\s+$/.test(t); if (sp && !line) continue; if (tw(line + t, fs) > max && line.trim()) { out.push(line.trimEnd()); line = sp ? '' : t; } else line += t; } if (line.trim()) out.push(line.trimEnd()); return out; };
  const tx = (x, y, lines, o = {}) => { const fs = o.fs || 12, lh = o.lh || fs * 1.5; return `<text class="${o.cls || ''}" x="${x}" y="${y}" ${o.anchor ? `text-anchor="${o.anchor}"` : ''} font-size="${fs}">${lines.map((l, i) => `<tspan x="${x}" dy="${i ? lh : 0}">${esc(l)}</tspan>`).join('')}</text>`; };

  /* ====================== video, cropped to the page content ====================== */
  M.baseballVideo = {
    html: (p, o) => `<figure class="bb-vid"><div class="bb-vscr"><video controls preload="metadata" playsinline src="${esc(o.src)}" poster="${esc(o.poster)}" aria-label="${esc(o.title)}"></video></div><figcaption><b>${esc(o.title)}</b><span>${esc(o.note)}</span></figcaption></figure>`
  };

  /* ====================== ORIGIN · coverage timeline ====================== */
  M.baseballTimeline = {
    html: () => shell('COVERAGE', '每场比赛的记录数，山本向上、大谷向下', `<div class="bb-tl"></div><p class="bb-tl-key"><span class="y"><i></i>山本当天投球数（向上）</span><span class="o"><i></i>大谷当天打席逐球数（向下）</span><span class="mono">每根竖线 = 一个比赛日 · 悬停看日期与数量</span></p>`),
    async init(el) {
      try {
        const d = await data(), host = el.querySelector('.bb-tl');
        const by = (rows, y) => { const m = new Map(); rows.filter(r => r.year === y).forEach(r => m.set(r.date, (m.get(r.date) || 0) + 1)); return [...m].sort(); };
        const Y = [2024, 2025, 2026].map(y => ({ y, p: by(d.pitch, y), b: by(d.bat, y) }));
        const maxP = Math.max(...Y.flatMap(r => r.p.map(x => x[1]))), maxB = Math.max(...Y.flatMap(r => r.b.map(x => x[1])));
        const t0 = Date.UTC(2025, 2, 15), t1 = Date.UTC(2025, 9, 31);
        const pos = s => { const [, m, dd] = s.split('-').map(Number); return (Date.UTC(2025, m - 1, dd) - t0) / (t1 - t0); };
        const MON = ['APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT'];
        fit(host, W => {
          const mob = W < 640, lx = mob ? 0 : 84, pw = W - lx - 6, rowH = mob ? 150 : 176, up = mob ? 56 : 66, dn = mob ? 44 : 54, top = 22, H = top + rowH * 3 + 8;
          let g = '';
          MON.forEach((m, i) => { const x = lx + pos(`2025-${String(i + 4).padStart(2, '0')}-01`) * pw; g += `<line class="tl-m" x1="${x}" y1="${top - 6}" x2="${x}" y2="${H - 8}"/>` + tx(x + 4, 14, [m], { fs: 10, cls: 'tl-t' }); });
          Y.forEach((r, i) => {
            const base = top + i * rowH + 18 + up, x0 = lx;
            g += `<line class="tl-b" x1="${x0}" y1="${base}" x2="${x0 + pw}" y2="${base}"/>`;
            r.b.forEach(([dt, n]) => { const x = lx + pos(dt) * pw, h = Math.max(2, n / maxB * dn); g += `<line class="tl-o" x1="${x.toFixed(1)}" y1="${base}" x2="${x.toFixed(1)}" y2="${(base + h).toFixed(1)}"><title>${dt} · 大谷 ${n} 条</title></line>`; });
            r.p.forEach(([dt, n]) => { const x = lx + pos(dt) * pw, h = Math.max(3, n / maxP * up); g += `<line class="tl-y" x1="${x.toFixed(1)}" y1="${base}" x2="${x.toFixed(1)}" y2="${(base - h).toFixed(1)}"><title>${dt} · 山本 ${n} 球</title></line>`; });
            const gy = top + i * rowH + 8;
            g += mob ? tx(2, gy + 16, [String(r.y)], { fs: 30, cls: 'tl-yr' }) + tx(70, gy + 8, [`山本 ${r.p.length} 场 · ${fmt(r.p.reduce((n, x) => n + x[1], 0))} 球`], { fs: 11, cls: 'tl-s' }) + tx(70, gy + 22, [`大谷 ${r.b.length} 场 · ${fmt(r.b.reduce((n, x) => n + x[1], 0))} 条`], { fs: 11, cls: 'tl-s' })
              : tx(0, base - 14, [String(r.y)], { fs: 30, cls: 'tl-yr' }) + tx(0, base + 6, [`山本 ${r.p.length} 场`], { fs: 11, cls: 'tl-s' }) + tx(0, base + 22, [`大谷 ${r.b.length} 场`], { fs: 11, cls: 'tl-s' });
            if (r.y === 2026) { const last = r.p.at(-1)[0]; g += tx(Math.min(lx + pos(last) * pw + 14, W - 4), base - up + 8, ['数据到 04-14'], { fs: 11, cls: 'tl-n', anchor: mob ? 'start' : 'start' }); }
          });
          host.innerHTML = svg('三个赛季的比赛日', '山本每场投球数向上、大谷每场打席逐球数向下，横轴为 3 月中旬至 10 月底', g, W, H);
        });
      } catch (e) { err(el, e); }
    }
  };

  /* ====================== BUILD · the three website chapters, redrawn ====================== */
  const TK = [
    ['macro', '01', '宏观视图', 'MACRO', '按赛季与场次，读山本每一球落在哪里；开场数字是大谷的最高击球初速。'],
    ['lab', '02', '图表实验室', 'LAB', '年份总览、球种占比、队内分位雷达，选项一变，整页数字同步更新。'],
    ['atlas', '03', '数据图谱', 'ATLAS', '36 个棒球数据术语，标出每个词在这批 CSV 里对应的列名。']
  ];
  const pctRank = (arr, v, low) => { const a = arr.filter(Number.isFinite); if (!a.length || !Number.isFinite(v)) return null; const raw = a.filter(n => n <= v).length / a.length * 100; return Math.max(1, Math.min(99, Math.round(low ? 100 - raw : raw))); };
  const radar = (axes, label) => {
    const c = 150, R = 98, n = axes.length, pt = (i, r) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [c + Math.cos(a) * r, c + Math.sin(a) * r]; };
    let g = '';
    [25, 50, 75, 100].forEach(p => { g += `<polygon class="rd-g" points="${axes.map((_, i) => pt(i, R * p / 100).map(v => v.toFixed(1)).join(',')).join(' ')}"/>`; });
    axes.forEach((a, i) => { const [x, y] = pt(i, R), [lx, ly] = pt(i, R + 20); g += `<line class="rd-a" x1="${c}" y1="${c}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/><text class="rd-l" x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" text-anchor="${Math.abs(lx - c) < 8 ? 'middle' : lx < c ? 'end' : 'start'}">${esc(a.label)}</text>`; });
    g += `<polygon class="rd-v" points="${axes.map((a, i) => pt(i, R * (a.pct ?? 0) / 100).map(v => v.toFixed(1)).join(',')).join(' ')}"/>`;
    g += axes.map((a, i) => { const [x, y] = pt(i, R * (a.pct ?? 0) / 100); return `<circle class="rd-d" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.8"><title>${esc(a.label)} ${esc(a.txt)} · 第 ${a.pct} 百分位</title></circle>`; }).join('');
    return `<svg viewBox="-34 -6 368 312" role="img" aria-label="${esc(label)}">${g}</svg>`;
  };
  const GL = [
    ['Batting', 'Exit Velocity (EV)', '击球初速', '球离棒瞬间的速度，单位 mph。', 'launch_speed', 1],
    ['Batting', 'Launch Angle (LA)', '击球仰角', '球离棒瞬间与水平面的夹角，单位度。', 'launch_angle', 1],
    ['Batting', 'Barrels', '桶装击球', '初速与仰角同时落在高产出区间的击球。', 'launch_speed_angle', 1],
    ['Batting', 'Hard Hit', '硬击球', '击球初速不低于 95 mph 的击球。', 'launch_speed ≥ 95', 2],
    ['Batting', 'Sweet-Spot', '仰角甜区', '仰角在 8° 到 32° 之间的击球。', 'launch_angle 8—32', 2],
    ['Batting', 'BBE', '有结果的击球', '打进场内并产生结果的击球，不含挥空和界外。', 'launch_speed 非空', 2],
    ['Batting', 'xBA', '预期打击率', '按击球质量估算这一球成为安打的概率。', 'estimated_ba_using_speedangle', 1],
    ['Batting', 'xwOBA', '预期加权上垒率', '用初速和仰角估算这一球应得的上垒产出。', 'estimated_woba_using_speedangle', 1],
    ['Batting', 'EV50', '前一半初速均值', '只取最硬的一半击球求平均，反映上限。', 'launch_speed 排序取半', 2],
    ['Batting', 'Adjusted EV', '修正初速', '低于 88 mph 的击球按 88 计，再求平均。', 'launch_speed 截断', 2],
    ['Bat Tracking', 'Bat Speed', '挥棒速度', '棒头甜区的速度。', 'bat_speed', 1],
    ['Bat Tracking', 'Fast Swing Rate', '快挥比例', '挥棒速度达到 75 mph 的挥棒占比。', 'bat_speed ≥ 75', 2],
    ['Bat Tracking', 'Swing Length', '挥棒长度', '棒头从启动到击球走过的距离，单位英尺。', 'swing_length', 1],
    ['Bat Tracking', 'Attack Angle', '攻击角', '击球瞬间棒头运动方向的垂直角度。', 'attack_angle', 1],
    ['Bat Tracking', 'Ideal Attack Angle', '理想攻击角', '攻击角落在 5° 到 20° 之间的挥棒。', 'rate_ideal_attack_angle', 1],
    ['Bat Tracking', 'Attack Direction', '攻击方向', '棒头路径的水平角度，偏向拉打或反向。', 'attack_direction', 1],
    ['Bat Tracking', 'Swing Path Tilt', '挥棒路径倾角', '击球前 40 毫秒内挥棒弧线的垂直倾角。', 'swing_path_tilt', 1],
    ['Bat Tracking', 'Squared-Up Rate', '甜点命中率', '实际初速占这个挥速理论最大初速的比例。', '', 0],
    ['Bat Tracking', 'Blasts', 'Blast', '挥速够快、又击中甜点的挥棒。', '', 0],
    ['Bat Tracking', 'Swords', 'Sword', '投手逼出难看挥空的那类挥棒。', '', 0],
    ['Pitching', 'Pitch Velocity', '球速', '投球出手时的速度，单位 mph。', 'release_speed', 1],
    ['Pitching', 'Pitch Movement', '位移', '球在飞行中偏离直线路径的距离，单位英寸。', 'pfx_x / pfx_z', 1],
    ['Pitching', 'Active Spin', '有效转速', '真正贡献位移的那一部分转速。', '', 0],
    ['Pitching', 'Spin Rate', '转速', '球每分钟的转数，单位 rpm。', 'release_spin_rate', 1],
    ['Pitching', 'Extension', '出手延伸', '投手出手点离投手板的距离，单位英尺。', 'release_extension', 1],
    ['Pitching', 'xERA', '预期自责分率', '把 xwOBA 折算到自责分率的尺度。', '', 0],
    ['Fielding', 'Pop Time', '捕手传球时间', '捕手接球到把球传到垒包所用的秒数。', '', 0],
    ['Fielding', 'Arm Strength', '传球臂力', '野手传球的出手速度，单位 mph。', '', 0],
    ['Fielding', 'Lead Distance', '离垒距离', '跑者离开垒包的距离，单位英尺。', '', 0],
    ['Fielding', 'Jump', '起步', '防守球员的反应速度与路线效率。', '', 0],
    ['Fielding', 'OAA', '守备出局数', '按守备范围衡量，比同行多救下几个出局。', '', 0],
    ['Fielding', 'Fielding Run Value', '守备得失分', '把守备表现折算成得失分。', '', 0],
    ['Fielding', 'Catch Probability', '接杀概率', '外野手接住这一球的概率。', '', 0],
    ['Fielding', 'Blocks Above Average', '阻挡球数', '捕手比同行多挡下几个暴投与捕逸。', '', 0],
    ['Running', 'Sprint Speed', '冲刺速度', '最快一秒内的跑动速度，单位英尺 / 秒。', '', 0],
    ['Running', 'Bolt', 'Bolt', '冲刺速度不低于 30 英尺 / 秒的一次跑动。', '', 0]
  ];
  const GROUPS = [['all', '全部'], ['Batting', 'Batting'], ['Bat Tracking', 'Bat Tracking'], ['Pitching', 'Pitching'], ['Fielding', 'Fielding · Catching'], ['Running', 'Running']];
  const MODE = ['', 'CSV 列', '由 CSV 算出'];

  M.baseballChapters = {
    html: () => `<div class="bb-chap" data-chapter="macro">
      <div class="bb-tk" role="tablist" aria-label="网站章节">${TK.map(([id, n, t, en, desc], i) => `<button type="button" role="tab" class="bb-ticket t${i}" data-chapter="${id}" aria-selected="${i === 0}"><span class="hole" aria-hidden="true"></span><b class="n">${n}</b><span class="mono">${en}</span><h5>${t}</h5><p>${desc}</p><span class="bar" aria-hidden="true"></span></button>`).join('')}</div>
      <div class="sk-frame"><div class="sk-bar" aria-hidden="true"><i></i><i></i><i></i><span class="sk-url">pitch-impact / macro</span></div><div class="sk-body"><p class="bb-loading">读取章节数据…</p></div></div>
      <p class="bb-source sk-cap">三个章节用代码重画，数据来自四份 CSV。选项、选择框和按钮都会改变画面。</p></div>`,
    async init(el) {
      try {
        const [d, L] = await Promise.all([data(), lab()]);
        const body = el.querySelector('.sk-body'), url = el.querySelector('.sk-url'), root = el.querySelector('.bb-chap');
        const st = { ch: 'macro', year: 2026, game: '2026-04-14', gl: 'all', usageYear: 2026, bat: 'Ohtani, Shohei', pit: 'Yamamoto, Yoshinobu' };
        const yrs = [2024, 2025, 2026];
        const gamesOf = y => { const m = new Map(); d.pitch.filter(r => r.year === y).forEach(r => m.set(r.date, (m.get(r.date) || 0) + 1)); return [...m].sort(); };
        const batYear = y => d.bat.filter(r => r.year === y && Number.isFinite(r.speed));
        const yearBtns = (cur, key) => `<div class="sk-years" role="group" aria-label="年份">${yrs.map(y => `<button type="button" data-${key}="${y}" aria-pressed="${cur === y}">${y}</button>`).join('')}</div>`;

        const macro = () => {
          const games = gamesOf(st.year); if (!games.find(g => g[0] === st.game)) st.game = games.at(-1)[0];
          const gi = games.findIndex(g => g[0] === st.game), rows = d.pitch.filter(r => r.date === st.game), pts = rows.filter(r => Number.isFinite(r.x) && Number.isFinite(r.z));
          const maxEV = Math.max(...batYear(st.year).map(r => r.speed)), fast = rows.filter(r => Number.isFinite(r.speed)).sort((a, b) => b.speed - a.speed)[0];
          const wh = rows.filter(r => WHIFF.has(r.result)).length;
          const X = x => 600 + x * 70, Y = z => 392 - z * 70;
          let g = '';
          for (let i = 1; i <= 34; i++) g += `<circle class="mc-r" cx="600" cy="${Y(2.5)}" r="${i * 11}"/>`;
          g += `<rect class="mc-z" x="${X(-17 / 24)}" y="${Y(3.5)}" width="${70 * 17 / 12}" height="${70 * 2}"/>`;
          g += pts.map(r => `<circle class="mc-d${WHIFF.has(r.result) ? ' w' : ''}" cx="${X(r.x).toFixed(1)}" cy="${Y(r.z).toFixed(1)}" r="${WHIFF.has(r.result) ? 7 : 5.5}"><title>${r.id} · ${r.code || '未标注'} · ${r.speed ?? '—'} mph · ${r.result}</title></circle>`).join('');
          if (fast && Number.isFinite(fast.x) && Number.isFinite(fast.z)) g += `<circle class="mc-f" cx="${X(fast.x).toFixed(1)}" cy="${Y(fast.z).toFixed(1)}" r="16"/>`;
          return `<div class="sk-macro"><p class="sk-mi">MACRO DATA CANVAS</p><h5 class="sk-title">FORCE. CONTROL. IMPACT.</h5>
            <div class="sk-ctl">${yearBtns(st.year, 'my')}<label>场次<select class="sk-game" aria-label="选择山本的先发场次">${games.map(([dt, n]) => `<option value="${dt}"${dt === st.game ? ' selected' : ''}>${dt} · ${n} 球</option>`).join('')}</select></label><button type="button" class="sk-prev" aria-label="上一场"${gi === 0 ? ' disabled' : ''}>←</button><button type="button" class="sk-next" aria-label="下一场"${gi === games.length - 1 ? ' disabled' : ''}>→</button><span class="sk-lg"><i class="w"></i>挥空 / 擦棒<i></i>其他</span></div>
            <div class="sk-field">${svg('山本一场比赛的投球落点', `${st.game} 共 ${pts.length} 个有坐标的点，青色为挥空或擦棒`, g, 1200, 420).replace('viewBox="0 0 1200 420"', innerWidth < 640 ? 'viewBox="250 0 700 420"' : 'viewBox="0 0 1200 420"')}</div>
            <div class="sk-num"><div><b>${Math.round(maxEV)}</b><small>MPH</small></div><p>大谷 ${st.year} · 最高击球初速 ${maxEV.toFixed(1)} mph<br><span>山本 ${st.game}：${rows.length} 球 · 挥空 ${wh} · 最快出手 ${fast ? fast.speed.toFixed(1) : '—'} mph（圈出的点）</span></p></div></div>`;
        };

        const usage = y => { const a = d.pitch.filter(r => r.year === y), m = new Map(); a.forEach(r => { if (r.name) m.set(r.name, (m.get(r.name) || 0) + 1); }); return { total: a.length, rows: [...m].sort((p, q) => q[1] - p[1]), untyped: a.filter(r => !r.name).length }; };
        const labv = () => {
          const y = st.year, p = d.pitch.filter(r => r.year === y), b = batYear(y), u = usage(y), uu = usage(st.usageYear);
          const top = u.rows[0], sp = p.map(r => r.speed).filter(Number.isFinite);
          const chips = [['投球', fmt(p.length), '条记录'], ['主球种', top ? top[0] : '—', `${top ? (top[1] / p.length * 100).toFixed(0) : 0}% 的球`], ['均速', avg(sp).toFixed(1), 'mph'], ['平均击球初速', avg(b.map(r => r.speed)).toFixed(1), 'mph'], ['硬击球', fmt(b.filter(r => r.speed >= 95).length), '≥ 95 mph'], ['最高击球初速', Math.max(...b.map(r => r.speed)).toFixed(1), 'mph']];
          const T = L.team, bats = T.batters.slice().sort((a, c) => c.woba - a.woba).slice(0, 10);
          const cmp = yrs.map(yy => { const bb = batYear(yy), la = bb.filter(r => Number.isFinite(r.angle)); return { y: yy, ev: avg(bb.map(r => r.speed)), la: avg(la.map(r => r.angle)), hh: bb.filter(r => r.speed >= 95).length / bb.length * 100 }; });
          const B = T.batters.find(r => r.player_name === st.bat) || T.batters[0], P = T.pitchers.find(r => r.player_name === st.pit) || T.pitchers[0];
          const bax = [['wOBA', 'woba', 0, v => v.toFixed(3).replace(/^0/, '')], ['xwOBA', 'xwoba', 0, v => v.toFixed(3).replace(/^0/, '')], ['击球初速', 'launch_speed', 0, v => v.toFixed(1)], ['硬击球%', 'hardhit_percent', 0, v => v.toFixed(1)], ['桶装%', 'barrels_per_bbe_percent', 0, v => v.toFixed(1)], ['BB%', 'bb_percent', 0, v => v.toFixed(1)], ['低 K%', 'k_percent', 1, v => v.toFixed(1)]].map(([label, k, low, f]) => ({ label, pct: pctRank(T.batters.map(r => r[k]), B[k], low), txt: f(B[k]) }));
          const pax = [['K%', 'k_percent', 0, v => v.toFixed(1)], ['低 BB%', 'bb_percent', 1, v => v.toFixed(1)], ['球速', 'velocity', 0, v => v.toFixed(1)], ['转速', 'spin_rate', 0, v => String(Math.round(v))], ['挥空%', 'swing_miss_percent', 0, v => v.toFixed(1)], ['低硬击%', 'hardhit_percent', 1, v => v.toFixed(1)], ['低 xwOBA', 'xwoba', 1, v => v.toFixed(3).replace(/^0/, '')]].map(([label, k, low, f]) => ({ label, pct: pctRank(T.pitchers.map(r => r[k]), P[k], low), txt: f(P[k]) }));
          const opts = (arr, cur, k) => arr.slice().sort((a, c) => c[k] - a[k]).map(r => `<option value="${esc(r.player_name)}"${r.player_name === cur ? ' selected' : ''}>${esc(r.player_name.split(', ').reverse().join(' '))}</option>`).join('');
          const rl = (axes) => `<ul class="rd-list">${axes.map(a => `<li><span>${esc(a.label)}</span><b>${esc(a.txt)}</b><i style="--p:${a.pct}%"></i><em>P${a.pct}</em></li>`).join('')}</ul>`;
          return `<div class="sk-lab"><div class="sk-head"><p class="sk-mi">RESTORED VISUALIZATION STACK</p><h5 class="sk-h2">PITCHING × BATTING PANELS</h5><div class="sk-ctl">${yearBtns(y, 'ly')}</div></div>
            <div class="sk-grid">
              <article class="sk-card span2"><h6>年份总览 · ${y}</h6><div class="sk-chips">${chips.map(([k, v, s]) => `<div><span>${k}</span><b>${esc(v)}</b><em>${s}</em></div>`).join('')}</div><p class="sk-tip">山本 ${fmt(p.length)} 条逐球记录；大谷 ${fmt(b.length)} 条带击球初速的记录。</p></article>
              <article class="sk-card"><h6>Dodgers Bat Top 10 · wOBA</h6><p class="sk-tip">球队汇总表，文件范围内累计，条长从 0 起。</p><ol class="sk-bars">${bats.map(r => `<li${r.player_name === 'Ohtani, Shohei' ? ' class="hot"' : ''}><span>${esc(r.player_name.split(',')[0])}</span><div><i style="width:${(r.woba / .5 * 100).toFixed(1)}%"></i></div><b>${r.woba.toFixed(3).replace(/^0/, '')}</b></li>`).join('')}</ol></article>
              <article class="sk-card"><h6>Pitch Usage · 山本</h6><div class="sk-years sm" role="group" aria-label="球种占比年份">${yrs.map(yy => `<button type="button" data-uy="${yy}" aria-pressed="${st.usageYear === yy}">${yy}<small>${fmt(usage(yy).total)}</small></button>`).join('')}</div><ul class="sk-usage">${uu.rows.map(([n, c], i) => `<li class="a${i % 4}"><span>${esc(n)}</span><b>${(c / uu.total * 100).toFixed(1)}%</b><div><i style="width:${(c / uu.total * 100).toFixed(1)}%"></i></div></li>`).join('')}</ul>${uu.untyped ? `<p class="sk-tip">另有 ${uu.untyped} 条未标注球种，计入分母。</p>` : ''}</article>
              <article class="sk-card"><h6>Contact Profile · 大谷</h6><p class="sk-tip">平均击球初速 / 平均仰角 / 硬击球占比，三个赛季并排。</p><div class="sk-cmp">${cmp.map(r => `<div class="${r.y === y ? 'on' : ''}"><strong>${r.y}</strong><p><span>EV</span><i style="width:${(r.ev / 110 * 100).toFixed(1)}%"></i><b>${r.ev.toFixed(1)}</b></p><p><span>LA</span><i style="width:${(Math.abs(r.la) / 40 * 100).toFixed(1)}%"></i><b>${r.la.toFixed(1)}°</b></p><p><span>HH</span><i style="width:${r.hh.toFixed(1)}%"></i><b>${r.hh.toFixed(1)}%</b></p></div>`).join('')}</div></article>
              <article class="sk-card"><h6>打者能力总览 · Savant Radar</h6><label class="sk-sel">打者<select class="sk-bat" aria-label="选择打者">${opts(T.batters, st.bat, 'pa')}</select></label><div class="sk-radar">${radar(bax, B.player_name + ' 的队内分位雷达')}</div>${rl(bax)}</article>
              <article class="sk-card"><h6>投手能力总览 · Savant Radar</h6><label class="sk-sel">投手<select class="sk-pit" aria-label="选择投手">${opts(T.pitchers, st.pit, 'total_pitches')}</select></label><div class="sk-radar">${radar(pax, P.player_name + ' 的队内分位雷达')}</div>${rl(pax)}</article>
            </div><p class="sk-tip">分位 = 队内同表中不高于该值的占比，名称带“低”的轴取反向。队内为 ${T.batters.length} 名打者、${T.pitchers.length} 名投手。</p></div>`;
        };

        const atlas = () => {
          const rows = GL.filter(r => st.gl === 'all' || r[0] === st.gl), withCol = rows.filter(r => r[5]).length;
          return `<div class="sk-atlas"><div class="sk-head"><p class="sk-mi">COLLAGE BOARD</p><h5 class="sk-h2">Atlas / Signal Notes</h5></div>
            <div class="sk-chipsrow" role="group" aria-label="术语分组">${GROUPS.map(([k, t]) => `<button type="button" data-gl="${k}" aria-pressed="${st.gl === k}">${t}<small>${GL.filter(r => k === 'all' || r[0] === k).length}</small></button>`).join('')}</div>
            <p class="sk-count"><b>${rows.length}</b> 个术语，其中 <b>${withCol}</b> 个能在这批 CSV 里找到对应的列或算出来。</p>
            <ul class="sk-terms">${rows.map(([g, en, cn, def, col, mode], i) => `<li class="${mode ? 'has' : 'no'} g${i % 4}"><span class="sk-bub" aria-hidden="true">${esc(en.replace(/[^A-Z]/g, '').slice(0, 2) || en.slice(0, 2).toUpperCase())}</span><h6>${esc(en)}</h6><p class="cn">${esc(cn)}</p><p>${esc(def)}</p><span class="sk-col">${mode ? `${MODE[mode]} · <code>${esc(col)}</code>` : '这批 CSV 没有对应的列'}</span></li>`).join('')}</ul></div>`;
        };

        const draw = () => {
          root.dataset.chapter = st.ch; url.textContent = `pitch-impact / ${st.ch}`;
          body.innerHTML = st.ch === 'macro' ? macro() : st.ch === 'lab' ? labv() : atlas();
          el.querySelectorAll('[data-chapter]').forEach(b => b.setAttribute('aria-selected', b.dataset.chapter === st.ch));
        };
        el.addEventListener('click', e => {
          const t = e.target.closest('button'); if (!t || !el.contains(t)) return;
          if (t.dataset.chapter) st.ch = t.dataset.chapter;
          else if (t.dataset.my) st.year = +t.dataset.my;
          else if (t.dataset.ly) st.year = +t.dataset.ly;
          else if (t.dataset.uy) st.usageYear = +t.dataset.uy;
          else if (t.dataset.gl) st.gl = t.dataset.gl;
          else if (t.classList.contains('sk-prev') || t.classList.contains('sk-next')) { const g = gamesOf(st.year), i = g.findIndex(x => x[0] === st.game) + (t.classList.contains('sk-next') ? 1 : -1); st.game = g[Math.max(0, Math.min(g.length - 1, i))][0]; }
          else return;
          draw();
        });
        el.addEventListener('change', e => {
          const t = e.target;
          if (t.classList.contains('sk-game')) st.game = t.value; else if (t.classList.contains('sk-bat')) st.bat = t.value; else if (t.classList.contains('sk-pit')) st.pit = t.value; else return;
          draw();
        });
        draw();
        matchMedia('(max-width:639px)').addEventListener('change', () => { if (st.ch === 'macro') draw(); });
      } catch (e) { err(el, e); }
    }
  };

  /* ====================== DATA · where the numbers come from ====================== */
  const FILES = [
    { id: 1, n: '山本投手逐球', file: '23-26山本投手数据.csv', rows: '4,649', cols: 118, unit: '一行 = 一球', key: 'game_pk : at_bat_number : pitch_number', fields: 'pitch_type · release_speed · plate_x / plate_z · pfx_x / pfx_z · description', model: 'PitchRow', mfields: 'plate_x · plate_z · speed · spin · pfx · 结果', pl: 'player_id 808967' },
    { id: 2, n: '大谷打者逐球', file: '23-26大谷打者数据.csv', rows: '6,139', cols: 118, unit: '一行 = 一球（打者一侧）', key: 'game_pk : at_bat_number : pitch_number', fields: 'launch_speed · launch_angle · hc_x / hc_y · events', model: 'BatRow', mfields: 'launch_speed · launch_angle · hc_x · hc_y · events', pl: 'player_id 660271' },
    { id: 3, n: '道奇投手汇总', file: '23-26道奇队投手数据.csv', rows: '99', cols: 76, unit: '一行 = 一名投手', key: 'player_id', fields: 'k_percent · bb_percent · velocity · spin_rate · swing_miss_percent', model: 'TeamPitchRow', mfields: 'K% · BB% · 球速 · 转速 · 挥空% · 硬击%', pl: '含山本一行' },
    { id: 4, n: '道奇打者汇总', file: '23-26道奇队打者数据.csv', rows: '59', cols: 76, unit: '一行 = 一名打者', key: 'player_id', fields: 'woba · xwoba · barrels_per_bbe_percent · hardhit_percent · launch_speed', model: 'TeamBatRow', mfields: 'wOBA · xwOBA · 桶装% · 硬击% · 初速', pl: '含大谷一行' }
  ];
  const DERIVE = [
    { t: '年份 × 球种 子集', l: ['year 与 pitch_type 同时匹配', '分母 = 子集行数'], f: [1] },
    { t: '占比 · 均速 · 累计分布', l: ['n ÷ 当年全部行', '速度排序后取累计比例'], f: [1] },
    { t: '网格 · 方向 · 位移 · 球数', l: ['初速 × 仰角 10 格计数', 'hc 坐标 · pfx×12 转英寸'], f: [1, 2] },
    { t: '队内分位', l: ['同表中不高于该值的占比', '低者为优的轴取反向'], f: [3, 4] }
  ];
  const VIEWS = [
    { t: '宏观视图', l: ['一场比赛的落点', '年内最高击球初速'], f: [1, 2] },
    { t: '图表实验室', l: ['年份总览 · 球种占比', '分位雷达 · Top 10'], f: [1, 2, 3, 4] },
    { t: '数据图谱', l: ['36 个术语', '对照四份表头的列名'], f: [1, 2, 3, 4] },
    { t: '本页分析图', l: ['落点筛选 · 分布', '接触网格 · 位移'], f: [1, 2] }
  ];

  M.baseballSources = {
    html: () => shell('DATA MODEL', '四份 CSV，怎样走到页面上', `<div class="sd-pick" role="group" aria-label="选择一份数据，高亮它经过的路径"><button type="button" data-f="0" aria-pressed="true">全部路径</button>${FILES.map(f => `<button type="button" data-f="${f.id}" aria-pressed="false">${esc(f.n)}<small>${f.rows}</small></button>`).join('')}</div><div class="sd" data-sel="0"><div class="sd-host"></div></div><dl class="sd-info" aria-live="polite"></dl>`),
    async init(el) {
      try {
        const d = await data(), A = d.audit.source, host = el.querySelector('.sd-host'), box = el.querySelector('.sd'), info = el.querySelector('.sd-info');
        const showInfo = id => {
          if (!id) { info.innerHTML = `<div><dt>读法</dt><dd>点上面的任一份数据，图里只留下它经过的解析、模型、派生和视图。逐球表（上两份）与球员汇总表（下两份）统计单位不同，不做 join；山本、大谷在汇总表里各有一行，可用 player_id 对上。</dd></div>`; return; }
          const f = FILES[id - 1], a = A[id - 1];
          info.innerHTML = [['文件', f.file], ['规模', `${f.rows} 行 · ${f.cols} 列`], ['一行是', f.unit], ['键', f.key], ['用到的列', f.fields], ['SHA-256', a.sha256.slice(0, 24) + '…'], ['进入的视图', VIEWS.filter(v => v.f.includes(id)).map(v => v.t).join(' · ')]].map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
        };
        const dim = id => { box.dataset.sel = id; el.querySelectorAll('.sd-pick button').forEach(b => b.setAttribute('aria-pressed', +b.dataset.f === id)); showInfo(id); };
        el.querySelector('.sd-pick').addEventListener('click', e => { const b = e.target.closest('button'); if (b) dim(+b.dataset.f); });
        showInfo(0);
        fit(host, W => {
          const fa = f => `data-f="${f.join(' ')}"`;
          if (W >= 760) {
            const CW = 264, X = [0, 312, 624, 936], Y0 = 70, RH = 132, BH = 112;
            let g = `<defs><marker id="sd-ar" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="currentColor"/></marker></defs>`;
            ['① CSV 文件', '② 解析与数据模型', '③ 派生', '④ 页面视图'].forEach((t, i) => { g += tx(X[i], 22, [t], { fs: 15, cls: 'sd-h' }); });
            g += tx(X[1], 42, ['csvParse 处理引号字段；空数字单元保留 null；记下 CSV 行号'], { fs: 10.5, cls: 'sd-s' });
            const by = i => Y0 + i * RH;
            const edge = (c, r1, c2, r2, f, cls = '') => { const x1 = X[c] + CW, y1 = by(r1) + BH / 2, x2 = X[c2], y2 = by(r2) + BH / 2, m = (x2 - x1) / 2; return `<path class="sd-e ${cls}" ${fa(f)} d="M${x1} ${y1}C${x1 + m} ${y1} ${x2 - m} ${y2} ${x2 - 4} ${y2}" marker-end="url(#sd-ar)"/>`; };
            [[0, 0, 1, 0, [1]], [0, 1, 1, 1, [2]], [0, 2, 1, 2, [3]], [0, 3, 1, 3, [4]], [1, 0, 2, 0, [1]], [1, 0, 2, 1, [1]], [1, 0, 2, 2, [1]], [1, 1, 2, 2, [2]], [1, 2, 2, 3, [3]], [1, 3, 2, 3, [4]], [2, 0, 3, 0, [1]], [2, 0, 3, 3, [1]], [2, 1, 3, 1, [1]], [2, 1, 3, 3, [1]], [2, 2, 3, 0, [1, 2]], [2, 2, 3, 1, [2]], [2, 2, 3, 3, [2]], [2, 3, 3, 1, [3, 4]]].forEach(([c, r, c2, r2, f]) => { g += edge(c, r, c2, r2, f); });
            const node = (c, r, tag, title, lines, f, cls) => { const x = X[c], y = by(r), t = wrap(title, CW - 28, 15), body = lines.flatMap(l => wrap(l, CW - 28, 11.5)); return `<g class="sd-n ${cls || ''}" ${fa(f)}><rect x="${x}" y="${y}" width="${CW}" height="${BH}" rx="3"/>${tx(x + 14, y + 20, [tag], { fs: 9.5, cls: 'sd-tag' })}${tx(x + 14, y + 40, t, { fs: 15, cls: 'sd-t' })}${tx(x + 14, y + 40 + t.length * 18 + 6, body.slice(0, 4), { fs: 11.5, lh: 15, cls: 'sd-l' })}</g>`; };
            FILES.forEach((f, i) => { g += node(0, i, `FILE 0${f.id} · ${f.rows} 行 · ${f.cols} 列`, f.n, [f.unit, f.key.length > 30 ? '键：' + f.key.split(' : ').join(' / ') : '键：' + f.key], [f.id], i < 2 ? 'pitch' : 'team'); });
            FILES.forEach((f, i) => { g += node(1, i, 'MODEL', f.model, [f.mfields, f.pl], [f.id], i < 2 ? 'pitch' : 'team'); });
            DERIVE.forEach((x, i) => { g += node(2, i, 'DERIVE', x.t, x.l, x.f, 'der'); });
            VIEWS.forEach((x, i) => { g += node(3, i, 'VIEW', x.t, x.l, x.f, 'view'); });
            const ny = (by(1) + BH + by(2)) / 2;
            g += `<g class="sd-nj"><line x1="${X[0]}" y1="${ny}" x2="${X[1] + CW}" y2="${ny}"/><rect x="${X[1] - 4}" y="${ny - 11}" width="${CW + 8}" height="22" rx="11"/>${tx(X[1] + CW / 2, ny + 4, ['逐球表与汇总表之间不 join'], { fs: 11, anchor: 'middle', cls: 'sd-nt' })}</g>`;
            host.innerHTML = svg('四份 CSV 的数据流', 'CSV 文件经过解析、数据模型、派生指标，进入网站章节与本页分析图', g, 1200, by(3) + BH + 14);
          } else {
            const col = (title, sub, items, cls) => `<section class="sdm-c"><h6>${title}</h6>${sub ? `<p>${sub}</p>` : ''}<ul>${items.map(it => `<li class="${cls}${it.cls ? ' ' + it.cls : ''}" ${fa(it.f)}><b>${it.t}</b><span>${it.l}</span></li>`).join('')}</ul></section>`;
            host.innerHTML = `<div class="sdm">${col('① CSV 文件', '', FILES.map((f, i) => ({ t: `${f.n} · ${f.rows}`, l: `${f.unit}，${f.cols} 列`, f: [f.id], cls: i < 2 ? 'pitch' : 'team' })), 'f')}<i class="sdm-a" aria-hidden="true">↓ csvParse · 空单元保留 null</i>${col('② 数据模型', '逐球表与汇总表之间不 join', FILES.map((f, i) => ({ t: f.model, l: f.mfields, f: [f.id], cls: i < 2 ? 'pitch' : 'team' })), 'f')}<i class="sdm-a" aria-hidden="true">↓ 派生</i>${col('③ 派生', '', DERIVE.map(x => ({ t: x.t, l: x.l.join('；'), f: x.f })), 'f')}<i class="sdm-a" aria-hidden="true">↓ 进入视图</i>${col('④ 页面视图', '', VIEWS.map(x => ({ t: x.t, l: x.l.join('；'), f: x.f })), 'f')}</div>`;
          }
        });
      } catch (e) { err(el, e); }
    }
  };

  /* ====================== EXPLORE · pitch field with real filters ====================== */
  M.baseballPlate = {
    html: () => shell('PITCH FIELD', '每个圆点都有一条源记录', `<div class="bb-controls"><label>进垒图年份<select class="bb-year" aria-label="进垒图年份"><option value="all">全部年份</option><option>2024</option><option>2025</option><option>2026</option></select></label><label>进垒图球种<select class="bb-type" aria-label="进垒图球种"><option value="all">全部球种</option>${TYPES.map(([c,t]) => `<option value="${c}">${c} · ${t}</option>`).join('')}</select></label><button type="button" class="bb-reset">重置筛选</button></div><div class="bb-legend" role="group" aria-label="球种图例，点击即筛选"></div><div class="bb-plate-layout"><div class="bb-plot"><div class="bb-points"><p class="bb-loading">读取本地逐球 CSV 快照…</p></div><p class="bb-hover" aria-live="off">鼠标移到点上读数，点击固定为当前检查的一球。</p></div><aside class="bb-ledger"><div class="bb-totals" aria-live="polite"></div><div class="bb-record-control"><button type="button" class="bb-prev" aria-label="上一球">←</button><label>单球序号<input class="bb-index" type="number" min="1" value="1" aria-label="筛选内单球序号"></label><button type="button" class="bb-next" aria-label="下一球">→</button></div><dl class="bb-single" aria-live="polite"></dl></aside></div><div class="bb-mx-wrap"><p class="bb-mx-h mono">YEAR × PITCH TYPE · 每格是有效进垒点数，点格子即筛选</p><div class="bb-mx"></div></div><p class="bb-status" aria-live="polite"></p><p class="bb-source">坐标保持 CSV 原值，单位 ft，捕手视角；方框宽 17 in、高 1.5—3.5 ft，仅作统一参照，不代表每位打者的实际好球区。2026 年测量平面和好球区定义改变，不能直接归因于球员表现。</p><details><summary>核对缺失记录与数据来源</summary><div class="bb-audit"></div></details><div class="bb-links"><button type="button" class="bb-export">下载当前真实子集 CSV</button><a href="assets/baseball/evidence-audit.json" target="_blank" rel="noopener">源文件 SHA-256 与转换记录 ↗</a><a href="https://baseballsavant.mlb.com/csv-docs" target="_blank" rel="noopener">Statcast 字段定义 ↗</a></div>`),
    async init(el) {
      try {
        const d = await data(), raw = d.pitch, year = el.querySelector('.bb-year'), type = el.querySelector('.bb-type');
        const all = raw.filter(located), xs = all.map(r => r.x), zs = all.map(r => r.z);
        /* domains come from the full source once, filtering never refits the axes */
        const xmin = Math.floor(Math.min(-3, ...xs)), xmax = Math.ceil(Math.max(3, ...xs)), zmin = Math.floor(Math.min(0, ...zs)), zmax = Math.ceil(Math.max(5, ...zs));
        const X = x => 64 + (x - xmin) / (xmax - xmin) * 672, Y = z => 550 - (z - zmin) / (zmax - zmin) * 510;
        let subset = [], points = [], index = 0;
        const sel = i => {
          index = Math.max(0, Math.min(points.length - 1, i)); const r = points[index];
          const input = el.querySelector('.bb-index'); input.max = points.length; input.value = r ? index + 1 : 0; input.disabled = !r;
          el.querySelector('.bb-prev').disabled = !r || index === 0; el.querySelector('.bb-next').disabled = !r || index === points.length - 1;
          el.querySelector('.bb-single').innerHTML = r ? [['日期 / 球种', `${r.date} · ${r.code} ${r.name}`], ['进垒 x / z', `${r.x.toFixed(3)} / ${r.z.toFixed(3)} ft`], ['出手速度', r.speed === null ? '缺失' : `${r.speed.toFixed(1)} mph`], ['转速', r.spin === null ? '缺失' : `${r.spin} rpm`], ['投球前球数', `${r.balls} 坏球 / ${r.strikes} 好球`], ['结果', r.result], ['CSV 源行', r.sourceRow], ['比赛:打席:球', r.id]].map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('') : '<p>当前组合没有有效坐标记录。</p>';
          const focus = el.querySelector('.bb-focus'); if (focus) { focus.setAttribute('cx', r ? X(r.x) : -100); focus.setAttribute('cy', r ? Y(r.z) : -100); }
          el.dataset.selectedId = r?.id || ''; BBS.index = index; BBS.total = points.length;
        };
        const mx = () => {
          const cols = [['all', '全部'], ...TYPES.map(([c, t]) => [c, `${c}`])], rows = [['all', '全部年份'], ['2024', '2024'], ['2025', '2025'], ['2026', '2026']];
          const n = (y, t) => all.filter(r => (y === 'all' || r.year === +y) && (t === 'all' || r.code === t)).length, max = Math.max(...rows.flatMap(([y]) => cols.slice(1).map(([t]) => n(y, t))));
          el.querySelector('.bb-mx').innerHTML = `<div class="mx-r mx-h"><span></span>${cols.map(([c, t]) => `<b>${t}</b>`).join('')}</div>` + rows.map(([y, yl]) => `<div class="mx-r"><span>${yl}</span>${cols.map(([c]) => { const v = n(y, c); return `<button type="button" data-y="${y}" data-t="${c}" style="--k:${c === 'all' || y === 'all' ? 0 : v / max}" aria-pressed="false" class="${v ? (c !== 'all' && y !== 'all' && v / max > .45 ? 'hi' : '') : 'z'}">${fmt(v)}</button>`; }).join('')}</div>`).join('');
        };
        const draw = () => {
          subset = raw.filter(r => (year.value === 'all' || r.year === +year.value) && (type.value === 'all' || r.code === type.value)); points = subset.filter(located);
          const speed = subset.map(r => r.speed).filter(Number.isFinite), miss = subset.length - points.length;
          let g = '';
          for (let z = zmin; z <= zmax; z++) g += `<line x1="64" y1="${Y(z)}" x2="736" y2="${Y(z)}" class="bb-gridline"/><text x="51" y="${Y(z) + 4}" text-anchor="end">${z}</text>`;
          for (let x = xmin; x <= xmax; x++) g += `<line x1="${X(x)}" y1="40" x2="${X(x)}" y2="550" class="bb-gridline"/><text x="${X(x)}" y="573" text-anchor="middle">${x}</text>`;
          g += `<rect x="${X(-17 / 24)}" y="${Y(3.5)}" width="${X(17 / 24) - X(-17 / 24)}" height="${Y(1.5) - Y(3.5)}" class="bb-zone"/>`;
          for (let i = 1; i < 3; i++) g += `<line x1="${X(-17 / 24 + i * 17 / 36)}" y1="${Y(3.5)}" x2="${X(-17 / 24 + i * 17 / 36)}" y2="${Y(1.5)}" class="bb-zone"/><line x1="${X(-17 / 24)}" y1="${Y(1.5 + i * 2 / 3)}" x2="${X(17 / 24)}" y2="${Y(1.5 + i * 2 / 3)}" class="bb-zone"/>`;
          g += points.map((r, i) => `<circle class="bb-point t-${r.code}" cx="${X(r.x).toFixed(2)}" cy="${Y(r.z).toFixed(2)}" r="2.6" data-i="${i}" data-record-id="${esc(r.id)}"/>`).join('');
          g += '<circle class="bb-focus" cx="-100" cy="-100" r="8"/><text x="400" y="609" text-anchor="middle">plate_x · ft · 捕手视角</text><text x="64" y="23">plate_z · ft</text><text x="736" y="23" text-anchor="end">ONE DOT = ONE PITCH</text>';
          el.querySelector('.bb-points').innerHTML = svg('山本由伸真实逐球进垒位置', `${points.length} 条有效记录；横轴 plate_x、纵轴 plate_z；固定全数据范围，未生成或抽样。`, g, 800, 630);
          const yearRows = raw.filter(r => year.value === 'all' || r.year === +year.value);
          el.querySelector('.bb-legend').innerHTML = TYPES.map(([c, t]) => { const k = yearRows.filter(r => r.code === c && located(r)).length; return `<button type="button" data-c="${c}" aria-pressed="${type.value === c}" style="--c:${TC[c]}"><i></i>${c}<span>${t}</span><b>${fmt(k)}</b></button>`; }).join('');
          el.querySelectorAll('.bb-mx button').forEach(b => b.setAttribute('aria-pressed', b.dataset.y === year.value && b.dataset.t === type.value));
          el.querySelector('.bb-totals').innerHTML = badge(fmt(points.length), '真实有效点') + badge(fmt(subset.length), '筛选记录分母') + badge(fmt(miss), '球种 / 坐标缺失') + badge(mean(speed), '平均出手速度 mph') + badge(fmt(speed.length), '均速有效记录');
          const dates = subset.map(r => r.date).sort();
          el.querySelector('.bb-status').textContent = `${year.value === 'all' ? '全部年份' : year.value} × ${type.value === 'all' ? '全部球种' : type.value} · ${dates.length ? dates[0] + ' — ' + dates.at(-1) : '无记录'} · 空间 ${fmt(points.length)} / ${fmt(subset.length)} · 固定 x [${xmin}, ${xmax}]、z [${zmin}, ${zmax}] ft`;
          el.dataset.count = points.length; el.dataset.denominator = subset.length; el.dataset.missing = miss;
          BBS.year = year.value; BBS.type = type.value; BBS.ready = true; sel(0); emit();
          document.dispatchEvent(new CustomEvent('baseball:filter', { detail: { year: year.value, type: type.value, raw: subset.length, located: points.length, missing: miss, speed: speed.length } }));
        };
        el.querySelector('.bb-audit').innerHTML = table(['CSV 源行', '日期', '比赛:打席:球', '球种 / 坐标'], d.audit.untyped.map(r => [r.sourceRow, r.date, r.id, '缺失；不补零'])) + `<p>原始 CSV ${fmt(d.audit.raw)} 行 → 有球种与坐标 ${fmt(d.audit.located)} 点。源文件 SHA-256：<code>${esc(d.audit.source[0].sha256)}</code></p>`;
        mx();
        year.addEventListener('change', draw); type.addEventListener('change', draw);
        el.querySelector('.bb-reset').addEventListener('click', () => { year.value = 'all'; type.value = 'all'; draw(); });
        el.querySelector('.bb-legend').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; type.value = type.value === b.dataset.c ? 'all' : b.dataset.c; draw(); });
        el.querySelector('.bb-mx').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; year.value = b.dataset.y; type.value = b.dataset.t; draw(); });
        el.querySelector('.bb-points').addEventListener('click', e => { const p = e.target.closest('[data-i]'); if (p) sel(+p.dataset.i); });
        el.querySelector('.bb-points').addEventListener('mouseover', e => { const p = e.target.closest('[data-i]'); if (!p) return; const r = points[+p.dataset.i]; el.querySelector('.bb-hover').textContent = `#${+p.dataset.i + 1} · ${r.date} · ${r.code} ${r.name} · ${r.speed === null ? '速度缺失' : r.speed.toFixed(1) + ' mph'} · x ${r.x.toFixed(2)} / z ${r.z.toFixed(2)} ft`; });
        el.querySelector('.bb-prev').addEventListener('click', () => sel(index - 1)); el.querySelector('.bb-next').addEventListener('click', () => sel(index + 1));
        el.querySelector('.bb-index').addEventListener('change', e => sel((+e.target.value || 1) - 1));
        el.querySelector('.bb-export').addEventListener('click', () => { const heads = ['id', 'sourceRow', 'date', 'year', 'code', 'x', 'z', 'speed', 'balls', 'strikes', 'result']; const csv = [heads.join(','), ...subset.map(r => heads.map(k => `"${String(r[k] ?? '').replace(/"/g, '""')}"`).join(','))].join('\r\n'); const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })), a = document.createElement('a'); a.href = url; a.download = `yamamoto-${year.value}-${type.value}.csv`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); });
        draw();
      } catch (e) { err(el, e); }
    }
  };

  /* ====================== EXPLORE · filter architecture ====================== */
  M.baseballFilterMap = {
    html: () => shell('STATE → SUBSET → VIEW', '筛选怎样一层层缩小，又影响哪些图', `<div class="fm"><div class="fm-host"></div></div><p class="bb-source">上面的年份和球种改动后，这张图的数字同步变化：实线的视图跟随筛选，虚线的视图自带控件，不受影响。</p>`),
    async init(el) {
      try {
        const d = await data(), host = el.querySelector('.fm-host');
        let st = { ...BBS }, redraw = () => {};
        const lab = s => `${s.year === 'all' ? '全部年份' : s.year} × ${s.type === 'all' ? '全部球种' : s.type}`;
        const draw = W => {
          const c = counts(d, st), N = c.n0;
          const stages = [
            { tag: '01 · SOURCE', t: '山本逐球表', n: c.n0, l: ['yamamoto.csv · 一行一球', '4,649 行，逐行保留 ID'], k: 'rows = parseCsv(file)' },
            { tag: '02 · YEAR', t: st.year === 'all' ? '不限年份' : `game_year = ${st.year}`, n: c.n1, l: ['按 game_year 匹配', `去掉 ${fmt(c.n0 - c.n1)} 行`], k: st.year === 'all' ? '不加条件' : `r.year === ${st.year}` },
            { tag: '03 · PITCH TYPE', t: st.type === 'all' ? '不限球种' : `pitch_type = ${st.type}`, n: c.n2, l: ['与上一步取 AND', `再去掉 ${fmt(c.n1 - c.n2)} 行`], k: st.type === 'all' ? '不加条件' : `r.code === '${st.type}'` },
            { tag: '04 · VALID FIELDS', t: '球种与坐标齐全', n: c.n3, l: ['plate_x、plate_z 非空', `缺失 ${fmt(c.n2 - c.n3)} 行，不补零`], k: 'isFinite(x) && isFinite(z)' }
          ];
          const views = [
            { t: '进垒落点图', n: c.n3, u: '个点', r: '读第 04 步的结果', from: 3, live: 1 },
            { t: '读数卡', n: c.sp, u: '行有效速度', r: '读第 03 步，均速 · 转速 · 挥空', from: 2, live: 1 },
            { t: '单球检查', n: c.n3, u: '个序号', r: '序号只在第 04 步的点里走', from: 3, live: 1 },
            { t: 'CSV 导出', n: c.n2, u: '行', r: '读第 03 步，缺失行也在内', from: 2, live: 1 },
            { t: '球种占比 · 累计分布', n: c.n0, u: '行', r: '用年份页签，不受球种筛选', from: 0, live: 0 },
            { t: '接触网格', n: 6139, u: '行（大谷）', r: '另一份 CSV，页签和下拉自带', from: -1, live: 0 }
          ];
          if (W >= 820) {
            const SW = 240, GAP = (W - SW * 4) / 3, sx = i => i * (SW + GAP), top = 34, SH = 178, sc = 124 / N;
            let g = `<defs><marker id="fm-ar" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="currentColor"/></marker></defs>`;
            const cy = top + SH / 2 - 8, hh = n => Math.max(5, n * sc);
            for (let i = 0; i < 3; i++) { const x1 = sx(i) + SW, x2 = sx(i + 1), h1 = hh(stages[i].n), h2 = hh(stages[i + 1].n); g += `<path class="fm-band" d="M${x1} ${cy - h1 / 2}L${x2} ${cy - h2 / 2}L${x2} ${cy + h2 / 2}L${x1} ${cy + h1 / 2}Z"/>`; g += tx((x1 + x2) / 2, cy + 3, [['FILTER', 'AND', 'NOT NULL'][i]], { fs: 10, cls: 'fm-op', anchor: 'middle' }); }
            stages.forEach((s, i) => {
              const x = sx(i);
              g += `<g class="fm-s"><rect x="${x}" y="${top}" width="${SW}" height="${SH}" rx="3"/><rect class="fm-gauge" x="${x + 14}" y="${cy - hh(s.n) / 2}" width="10" height="${hh(s.n)}"/>${tx(x + 34, top + 24, [s.tag], { fs: 10, cls: 'sd-tag' })}${tx(x + 34, top + 48, wrap(s.t, SW - 48, 15), { fs: 15, cls: 'sd-t' })}${tx(x + 34, top + 98, [fmt(s.n)], { fs: 42, cls: 'fm-n' })}${tx(x + 34, top + 122, [s.l[0]], { fs: 11, cls: 'sd-l' })}${tx(x + 34, top + 138, [s.l[1]], { fs: 11, cls: 'sd-l' })}<rect class="fm-code" x="${x + 34}" y="${top + 148}" width="${SW - 48}" height="20" rx="2"/>${tx(x + 40, top + 162, [s.k], { fs: 10.5, cls: 'fm-k' })}</g>`;
            });
            const vy = top + SH + 96, VW = (W - 5 * 14) / 6, VH = 138, vx = i => i * (VW + 14);
            const bus = { 0: vy - 62, 2: vy - 44, 3: vy - 26 };
            views.forEach((v, i) => {
              const x2 = vx(i) + VW / 2;
              if (v.from >= 0) { const x1 = sx(v.from) + SW / 2, y1 = top + SH, yb = bus[v.from]; g += `<path class="fm-e ${v.live ? 'lv' : 'ow'}" d="M${x1} ${y1}V${yb}H${x2}V${vy - 3}" marker-end="url(#fm-ar)"/><circle class="fm-dot ${v.live ? 'lv' : 'ow'}" cx="${x1}" cy="${yb}" r="3.5"/>`; }
              else g += `<path class="fm-e ow" d="M${x2} ${vy - 34}L${x2} ${vy - 3}" marker-end="url(#fm-ar)"/>` + tx(x2, vy - 40, ['大谷 CSV'], { fs: 10.5, cls: 'sd-s', anchor: 'middle' });
              g += `<g class="fm-v ${v.live ? 'lv' : 'ow'}"><rect x="${vx(i)}" y="${vy}" width="${VW}" height="${VH}" rx="3"/>${tx(vx(i) + 12, vy + 22, wrap(v.t, VW - 24, 13.5), { fs: 13.5, cls: 'sd-t' })}${tx(vx(i) + 12, vy + 66, [fmt(v.n)], { fs: 26, cls: 'fm-n2' })}${tx(vx(i) + 12, vy + 82, [v.u], { fs: 10.5, cls: 'sd-l' })}${tx(vx(i) + 12, vy + 100, wrap(v.r, VW - 24, 10.5).slice(0, 3), { fs: 10.5, lh: 13.5, cls: 'sd-s' })}<text class="fm-tag" x="${vx(i) + 12}" y="${vy + VH - 8}" font-size="9.5">${v.live ? '跟随筛选' : '自带控件'}</text></g>`;
            });
            g += tx(0, vy - 74, ['同一份子集，被这些视图读取'], { fs: 12, cls: 'sd-h' });
            const sy = vy + VH + 48, SW3 = (W - 28) / 3;
            [['滚动位置', '只改变读到哪一章，不进入任何筛选，也不改分母。'], ['筛选子集', `年份、球种。当前：${lab(st)}，分母 ${fmt(c.n2)}。`], ['单球选择', `序号 ${st.total ? st.index + 1 : 0} / ${fmt(st.total || c.n3)}。只换检查对象，不改子集。`]].forEach(([t, s], i) => {
              const x = i * (SW3 + 14); g += `<g class="fm-st"><rect x="${x}" y="${sy}" width="${SW3}" height="64" rx="3"/>${tx(x + 14, sy + 24, [t], { fs: 14, cls: 'sd-t' })}${tx(x + 14, sy + 44, wrap(s, SW3 - 28, 11.5).slice(0, 2), { fs: 11.5, lh: 15, cls: 'sd-l' })}</g>`;
            });
            g += tx(0, sy - 12, ['页面上的三类状态'], { fs: 12, cls: 'sd-h' });
            host.innerHTML = svg('筛选逻辑图', `当前 ${lab(st)}：${c.n0} → ${c.n1} → ${c.n2} → ${c.n3}`, g, W, sy + 76);
          } else {
            host.innerHTML = `<div class="fmm"><ol class="fmm-s">${stages.map(s => `<li><span class="sd-tag">${s.tag}</span><b>${esc(s.t)}</b><div class="fmm-bar"><i style="width:${Math.max(1.5, s.n / N * 100).toFixed(1)}%"></i></div><strong>${fmt(s.n)}</strong><em>${esc(s.l.join(' · '))}</em></li>`).join('')}</ol><ul class="fmm-v">${views.map(v => `<li class="${v.live ? 'lv' : 'ow'}"><b>${esc(v.t)}</b><strong>${fmt(v.n)}<small> ${esc(v.u)}</small></strong><span>${esc(v.r)}</span><em>${v.live ? '跟随筛选' : '自带控件'}</em></li>`).join('')}</ul><ul class="fmm-st"><li><b>滚动位置</b>只改变读到哪一章，不改分母。</li><li><b>筛选子集</b>${esc(lab(st))}，分母 ${fmt(c.n2)}。</li><li><b>单球选择</b>序号 ${st.total ? st.index + 1 : 0} / ${fmt(st.total || c.n3)}，不改子集。</li></ul></div>`;
          }
        };
        redraw = fit(host, draw);
        onState(s => { st = { ...s }; redraw(); });
      } catch (e) { err(el, e); }
    }
  };

  /* ====================== EXPLORE · readouts that follow the filter ====================== */
  M.baseballMetricCard = {
    html: () => shell('METRIC CONTRACT', '读数必须对应它的字段', `<div class="bb-metric-cards"></div><p class="bb-check"></p>`),
    async init(el) {
      try {
        const [d, L] = await Promise.all([data(), lab()]), box = el.querySelector('.bb-metric-cards'), chk = el.querySelector('.bb-check');
        const yam = L.team.pitchers.find(r => r.player_name === 'Yamamoto, Yoshinobu');
        onState(s => {
          const c = counts(d, s), sub = c.sub, sp = sub.map(r => r.speed).filter(Number.isFinite), spin = sub.map(r => r.spin).filter(Number.isFinite);
          const sw = sub.filter(r => SWING.has(r.result)).length, wh = sub.filter(r => WHIFF.has(r.result)).length;
          const inz = c.pts.filter(r => Math.abs(r.x) <= 17 / 24 && r.z >= 1.5 && r.z <= 3.5).length;
          const pc = (a, b) => b ? (a / b * 100).toFixed(1) + '%' : '—';
          box.innerHTML = [
            ['VELOCITY', 'release_speed', mean(sp) + ' mph', `${fmt(sp.length)} 行有效速度`, '子集内有效速度的算术均值；缺失不当 0。'],
            ['SPIN', 'release_spin_rate', spin.length ? Math.round(avg(spin)).toLocaleString('en-US') + ' rpm' : '—', `${fmt(spin.length)} 行有效转速`, '只用实际有转速的记录，不用速度去推。'],
            ['WHIFF', 'description', pc(wh, sw), `${fmt(wh)} 次挥空 / ${fmt(sw)} 次挥棒`, '挥空 = swinging_strike、swinging_strike_blocked、foul_tip；分母是所有挥棒，不是全部投球。'],
            ['LOCATION', 'plate_x / plate_z', pc(inz, c.n3), `${fmt(inz)} / ${fmt(c.n3)} 个点`, '落进统一参照方框的比例；方框不是每位打者的实际好球区。']
          ].map(([t, f, v, n, p]) => `<article><span class="mono">${t}</span><b>${esc(v)}</b><em>${esc(n)}</em><code>${f}</code><p>${esc(p)}</p></article>`).join('');
          const all = s.year === 'all' && s.type === 'all';
          chk.innerHTML = all && yam ? `<b>对账</b>：球队汇总表里山本一行的挥空率是 ${yam.swing_miss_percent}%（${fmt(yam.whiffs)} / ${fmt(yam.swings)}），逐球重算得到 ${pc(wh, sw)}（${fmt(wh)} / ${fmt(sw)}），两份表一致。` : '<b>对账</b>：把上面的年份和球种都设为“全部”，可与球队汇总表中山本一行对照。球队表没有按年份、球种拆分的字段。';
        });
      } catch (e) { err(el, e); }
    }
  };

  M.baseballAnalysis = {
    html:()=>shell('ANALYSIS ATLAS','后续分析保留真实坐标与球数',`<div class="bb-analysis-controls"><label>后续分析年份<select aria-label="后续分析年份"><option>2024</option><option>2025</option><option>2026</option></select></label><div role="group" aria-label="后续分析视图">${[['move','诱导位移'],['spray','击球方向'],['count','球数分布']].map(([id,t],i)=>`<button type="button" data-view="${id}" aria-pressed="${i===0}">${t}</button>`).join('')}</div></div><div class="bb-analysis-body"><p class="bb-loading">读取分析数据…</p></div>`),
    async init(el){try{const d=await data();let view='move';const year=el.querySelector('select'),body=el.querySelector('.bb-analysis-body');const draw=()=>{const p=d.pitch.filter(r=>r.year===+year.value);let g='',rows=[],note='';
      if(view==='move'){
        const X=x=>80+(x+30)/60*630,Y=y=>440-(y+30)/60*360;
        for(let v=-30;v<=30;v+=10)g+=`<line class="bb-gridline" x1="${X(v)}" y1="80" x2="${X(v)}" y2="440"/><line class="bb-gridline" x1="80" y1="${Y(v)}" x2="710" y2="${Y(v)}"/><text x="${X(v)}" y="463" text-anchor="middle">${v}</text><text x="65" y="${Y(v)+4}" text-anchor="end">${v}</text>`;
        rows=TYPES.map(([c,t],i)=>{const a=p.filter(r=>r.code===c&&Number.isFinite(r.pfxX)&&Number.isFinite(r.pfxZ));if(!a.length)return[c+' '+t,0,'—','—'];const x=a.reduce((n,r)=>n+r.pfxX*12,0)/a.length,z=a.reduce((n,r)=>n+r.pfxZ*12,0)/a.length;g+=`<circle class="bb-centroid" cx="${X(x)}" cy="${Y(z)}" r="7"/><text x="${X(x)+11}" y="${Y(z)+4}">${c} · ${a.length}</text>`;return[c+' '+t,a.length,x.toFixed(2),z.toFixed(2)];});
        g+='<text x="395" y="503" text-anchor="middle">水平诱导位移 · in · 捕手视角</text><text x="80" y="35">垂直诱导位移 · in</text>';
        note='每个点是当前年份一个球种的平均 pfx_x / pfx_z，ft × 12 转为 in；点大小不编码数量，数量直接标出。位移剖面不能证明两种球飞行轨迹重合或诱骗成功。';
        body.innerHTML=svg('球种诱导位移均值',note,g)+table(['球种','有效 n','水平 in','垂直 in'],rows);
      }else if(view==='spray'){
        const ids=d.bat.filter(r=>r.year===+year.value), a=ids.filter(r=>Number.isFinite(r.x)&&Number.isFinite(r.y));
        g='<g transform="translate(125 8) scale(1.1 .95)"><path class="bb-field-outline" d="M250 438L166 346Q112 286 76 240Q44 200 76 160Q162 72 250 44Q338 72 424 160Q456 200 424 240Q388 286 334 346Z"/><path class="bb-field-outline" d="M250 438L185 366L250 298L315 366Z"/>';
        g+=a.map(r=>`<circle class="bb-point bb-spray-point" cx="${19.5+r.x*1.838}" cy="${-10+r.y*2.24}" r="3" data-record-id="${esc(r.id)}"><title>${esc(r.id)} · hc_x ${r.x} / hc_y ${r.y} · CSV ${r.sourceRow}</title></circle>`).join('')+'</g>';
        body.innerHTML=svg('大谷击球方向示意',`${a.length} 条有效 hc_x / hc_y；字段是图像坐标，非三维落点。`,g)+`<div class="bb-filter-denominators">${badge(fmt(a.length),'有 hc_x / hc_y')}${badge(fmt(ids.length),'年份逐球分母')}${badge(fmt(ids.length-a.length),'坐标缺失')}</div>`;
        note='点来自 CSV 的 hc_x / hc_y，复用 src/components/charts/SprayChart.tsx 的校准 x = 19.5 + hc_x × 1.838、y = −10 + hc_y × 2.24。本页不沿用源组件的边界夹紧；球场轮廓为阅读示意，不将图像坐标标成真实英尺，也不重建三维轨迹。';
      }else{
        const counts=Array.from({length:4},()=>Array(3).fill(0));let valid=0;p.forEach(r=>{if(Number.isInteger(r.balls)&&Number.isInteger(r.strikes)&&r.balls>=0&&r.balls<4&&r.strikes>=0&&r.strikes<3){counts[r.balls][r.strikes]++;valid++;}});const max=Math.max(1,...counts.flat());
        rows=counts.map((r,i)=>[i+' 坏球',...r]);body.innerHTML=`<div class="bb-count-matrix"><span>投球前球数</span>${[0,1,2].map(s=>`<b>${s} 好球</b>`).join('')}${counts.map((r,b)=>`<b>${b} 坏球</b>${r.map(n=>`<div class="${n/max>.45?'hi':''}" style="--density:${n/max}"><strong>${fmt(n)}</strong><span>条投球</span></div>`).join('')}`).join('')}</div>${table(['球数','0 好球','1 好球','2 好球'],rows)}`;
        note=`按投球前 balls / strikes 计数，每格一组局面。有效 ${valid} / ${p.length} 行；同一个打席可贡献多球，不能将格数解释成打席数。色阶按本年最大格归一，数值常驻。`;
      }body.insertAdjacentHTML('beforeend',`<p class="bb-source">${esc(year.value)} · ${esc(note)}</p>`);el.dataset.view=view;};year.addEventListener('change',draw);el.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;el.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-pressed',x===b));draw();}));draw();}catch(e){err(el,e);}}
  };

  /* ====================== static diagrams ====================== */
  const SEAM = 'M44 26c30 42 30 106 0 148M156 26c-30 42-30 106 0 148';
  const ballSvg = `<svg class="bp-ball-svg" viewBox="0 0 200 200" aria-hidden="true" focusable="false"><circle cx="100" cy="100" r="95" style="fill:#f6f6f3;stroke:#0b0d10;stroke-width:4"/><path d="${SEAM}" style="fill:none;stroke:#ff4f00;stroke-width:3"/><path d="${SEAM}" style="fill:none;stroke:#ff4f00;stroke-width:13;stroke-dasharray:2.4 9.6;stroke-linecap:butt"/></svg>`;

  /* line-art plan of the field, in feet: pitcher's records end at the plate, batter's start there */
  const field = () => {
    const S = 1, cx = 300, py = 526, X = f => +(cx + f * S).toFixed(1), Y = f => +(py - f * S).toFixed(1);
    const P = pts => pts.map(([a, b], i) => (i ? 'L' : 'M') + X(a) + ' ' + Y(b)).join('');
    let g = '';
    for (let x = -250; x <= 250; x += 50) g += `<line class="fd-g${x === 0 ? ' c' : ''}" x1="${X(x)}" y1="${Y(0)}" x2="${X(x)}" y2="${Y(420)}"/>`;
    for (let y = 0; y <= 400; y += 50) { g += `<line class="fd-g" x1="${X(-270)}" y1="${Y(y)}" x2="${X(270)}" y2="${Y(y)}"/>`; if (y && y % 100 === 0) g += `<text class="fd-tk" x="${X(-270) - 4}" y="${Y(y) + 3}" text-anchor="end">${y}</text>`; }
    const fence = []; for (let a = 45; a <= 135; a += 3) { const r = 330 + 70 * Math.sin(Math.PI * (a - 45) / 90), t = a * Math.PI / 180; fence.push([r * Math.cos(t), r * Math.sin(t)]); }
    g += `<path class="fd-l" d="${P([[0, 0], [fence[0][0], fence[0][1]]])}${P(fence).replace('M', 'L')}L${X(0)} ${Y(0)}Z"/>`;
    g += `<path class="fd-l" d="${P([[0, 0], [63.6, 63.6], [0, 127.3], [-63.6, 63.6]])}Z"/>`;
    g += `<path class="fd-d" d="M${X(-81)} ${Y(111)}A${95 * S} ${95 * S} 0 0 1 ${X(81)} ${Y(111)}"/>`;
    [[63.6, 63.6], [0, 127.3], [-63.6, 63.6]].forEach(([a, b]) => { g += `<rect class="fd-b" x="${X(a) - 4}" y="${Y(b) - 4}" width="8" height="8" transform="rotate(45 ${X(a)} ${Y(b)})"/>`; });
    g += `<circle class="fd-m" cx="${X(0)}" cy="${Y(60.5)}" r="8"/><path class="fd-p" d="M${X(-8.5)} ${Y(0)}h17v-6l-8.5-7-8.5 7z"/>`;
    /* pitch tracks: three types leave the mound and bend before the plate */
    [['FF', 0, -3], ['FS', 12, 9], ['CU', -14, 16]].forEach(([c, d, e]) => { g += `<path class="fd-t" style="stroke:${TC[c]}" d="M${X(d * .1)} ${Y(56)}Q${X(d * .5 + e)} ${Y(28)} ${X(e * .15)} ${Y(3)}"/><circle cx="${X(e * .15)}" cy="${Y(3)}" r="2.6" style="fill:${TC[c]}"/>`; });
    /* batted balls fan out from the plate */
    [[52, 138], [64, 196], [78, 250], [90, 392], [101, 214], [116, 262], [128, 158]].forEach(([a, r], i) => { const t = a * Math.PI / 180, x = r * Math.cos(t), y = r * Math.sin(t); g += `<path class="fd-r" d="M${X(0)} ${Y(2)}L${X(x)} ${Y(y)}"/><circle class="fd-rd${r > 380 ? ' hr' : ''}" cx="${X(x)}" cy="${Y(y)}" r="${r > 380 ? 5 : 3}"/>`; });
    g += `<circle class="fd-lead" cx="${X(0)}" cy="${Y(56)}" r="2.5"/><circle class="fd-lead" cx="${X(41)}" cy="${Y(34)}" r="2.5"/>`;
    /* in-svg annotations on leader lines (hidden on narrow screens, where the key below the figure is used) */
    g += `<g class="fd-ann"><path class="fd-ld" d="M${X(0)} ${Y(56)}H${X(-92)}"/><path class="fd-ld" d="M${X(41)} ${Y(34)}H${X(120)}"/>`
      + tx(X(-98), Y(56) - 22, ['山本 · 投球'], { fs: 14, cls: 'fd-h', anchor: 'end' }) + tx(X(-98), Y(56) - 4, ['release_speed · mph', 'plate_x / plate_z · ft', 'pfx_x / pfx_z · in'], { fs: 10.5, lh: 14, cls: 'fd-s', anchor: 'end' })
      + tx(X(126), Y(34) - 22, ['大谷 · 击球'], { fs: 14, cls: 'fd-h' }) + tx(X(126), Y(34) - 4, ['launch_speed · mph', 'launch_angle · deg', 'hc_x / hc_y · px'], { fs: 10.5, lh: 14, cls: 'fd-s' }) + '</g>';
    g += `<text class="fd-tk" x="${X(0) + 12}" y="${Y(60.5) + 3}">60.5</text><text class="fd-tk" x="${X(0) + 6}" y="${Y(127.3) - 8}">2B</text>`;
    g += tx(20, 28, ['FIELD PLAN · 1 PX = 1 FT'], { fs: 10.5, cls: 'fd-s' }) + tx(580, 28, ['SAME FIELD, TWO ENDS OF THE RECORD'], { fs: 10.5, cls: 'fd-s', anchor: 'end' });
    return svg('山本与大谷的数据在球场上的位置', '线稿球场平面图。山本的记录是投手板到本垒板的一段，大谷的记录是本垒板向外场扇出的击球。', g, 600, 560);
  };
  const FIELD_KEY = `<div class="fd-key"><p><b>山本 · 投球</b><span>release_speed · mph<br>plate_x / plate_z · ft<br>pfx_x / pfx_z · in</span></p><p><b>大谷 · 击球</b><span>launch_speed · mph<br>launch_angle · deg<br>hc_x / hc_y · px</span></p></div>`;

  /* cover: every pitch as one dot, coloured by season; ink / paper / one orange */
  M.baseballCover = {
    html: () => `<div class="bc"><svg class="bc-svg" viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" role="img" aria-label="山本由伸 4,641 个进垒位置，按赛季着色"><g class="bc-grid"></g><g class="bc-dots"></g></svg><div class="bc-card"><span class="mono">PITCH / IMPACT</span><b>4,641</b><small>PITCHES · 2024—2026</small><i class="b-bc" aria-hidden="true">${Array.from({ length: 34 }, (_, i) => `<b style="--w:${1 + ((i * 7) % 3)}"></b>`).join('')}</i></div></div>`,
    async init(el) {
      const svgEl = el.querySelector('.bc-svg');
      try {
        const d = await data(), pts = d.pitch.filter(located);
        const X = x => 400 + x * 76, Y = z => 470 - z * 80;
        let gr = '';
        for (let x = -5; x <= 5; x++) gr += `<line x1="${X(x)}" y1="30" x2="${X(x)}" y2="490"/>`;
        for (let z = 0; z <= 5; z++) gr += `<line x1="40" y1="${Y(z)}" x2="760" y2="${Y(z)}"/>`;
        gr += `<rect class="z" x="${X(-17 / 24)}" y="${Y(3.5)}" width="${76 * 17 / 12}" height="${160}"/>`;
        for (let z = 0; z <= 5; z++) gr += `<text x="46" y="${Y(z) - 4}">${z} FT</text>`;
        svgEl.querySelector('.bc-grid').innerHTML = gr + `<text x="754" y="50" text-anchor="end">PLATE_X · PLATE_Z · CATCHER VIEW</text>`;
        svgEl.querySelector('.bc-dots').innerHTML = pts.map(r => `<circle class="y${r.year - 2023}" cx="${X(r.x).toFixed(1)}" cy="${Y(r.z).toFixed(1)}" r="${r.year === 2026 ? 2.6 : 2}"/>`).join('');
      } catch (e) { /* the cover keeps its grid without data */ }
    }
  };


  PG.baseball = {
    /* ---------- cover · R355 ---------- */
    title(k) {
      const { p, s, esc } = k;
      const st = s.stats || [];
      return `<section class="b-poster" aria-labelledby="tc-name">
        <header class="bp-bar"><a class="mono" href="index.html#scene-${p.id}" data-cut="INDEX">← INDEX</a><b>LOS ANGELES · STATCAST</b><span class="mono">${esc(s.meta[0][1])}</span></header>
        <div class="bp-grid">
          <div class="bp-hero">${k.block({ module: 'baseballCover' })}</div>
          <h1 class="bp-name" id="tc-name"><span>Pitch</span><i>/</i><span>Impact</span></h1>
          <span class="bp-ball">${ballSvg}</span>
          <p class="bp-sub">${esc(s.sub)}</p>
          <div class="bp-vs">
            <div class="a"><span class="mono">山本由伸 · CONTROL</span><b>${esc(st[1][0])}</b><small>${esc(st[1][1])}</small></div>
            <i aria-hidden="true">×</i>
            <div class="b"><span class="mono">大谷翔平 · IMPACT</span><b>${esc(st[2][0])}</b><small>${esc(st[2][1])}</small></div>
          </div>
          <ul class="bp-dots">${[st[0], st[3]].map(([v, l]) => `<li><b>${esc(v)}</b><span>${esc(l)}</span></li>`).join('')}</ul>
          <dl class="bp-meta">${(s.meta || []).slice(1).map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>
        </div>
      </section>`;
    },

    /* ---------- summary rows · R343 ---------- */
    logline(k) {
      const { s, md, esc } = k, L = s.logline || {};
      const pat = ['tri', 'dot', 'wave', 'arrow'];
      return `<section class="b-rows" aria-label="项目摘要">
        <ol class="br-stats">${(s.stats || []).map(([v, l], i) => `<li class="c${i}"><span>${esc(l)}</span><i class="pt ${pat[i]}" aria-hidden="true"></i><b>${esc(v)}</b></li>`).join('')}</ol>
        <div class="br-text">${[['問', L.q], ['做', L.a], ['果', L.r]].map(([c, t]) => `<p><b>${c}</b>${md(t)}</p>`).join('')}</div>
      </section>`;
    },

    act(a, i, k) { const f = this['a_' + a.id]; return f ? f.call(this, a, k, k.use(a)) : null; },

    /* ---------- 01 项目由来 · R338 starting grid ---------- */
    a_origin(a, k, u) {
      const { esc, md } = k;
      const rows = [['山本由伸', '投球逐球记录', '4,649'], ['大谷翔平', '打席逐球记录', '6,139'], ['日期范围', '2024-03-20 — 2026-04-14', 'CSV'], ['2026 赛季', '只有开季的一小段', 'PART']];
      return `<header class="b-grid">
          <p class="bg-k mono">${esc(a.kicker)}</p>
          <h2 class="bg-h"><span>STARTING</span><span>LINEUP</span></h2>
          <p class="bg-num" aria-hidden="true">${esc(a.open.num)}<small>${esc(a.open.unit)}</small></p>
          <ol class="bg-rows">${rows.map(([n, d, v], j) => `<li><b>P${j + 1}</b><span class="n">${esc(n)}</span><span class="d">${esc(d)}</span><span class="v">${esc(v)}</span></li>`).join('')}</ol>
          <div class="bg-copy"><h3>${md(a.title)}</h3><p>${md(a.lead)}</p><small class="mono">${esc(a.open.label)}</small></div>
        </header>
        <section class="b-story" aria-label="${esc(u.o(0).sub)}">
          <h3 class="bl-h">${esc(u.o(0).sub)}</h3>
          <div class="bst-text">${u.b(1)}</div>
          <figure class="bst-duel">${field()}${FIELD_KEY}</figure>
          <ol class="bst-why">${(u.o(2).list || []).map((t, j) => `<li><b>${j + 1}</b><p>${md(t)}</p></li>`).join('')}</ol>
        </section>
        <section class="b-tape" aria-label="${esc(u.o(3).sub)}">
          <h3 class="bl-h">${esc(u.o(3).sub)}</h3>
          ${u.b(4)}${u.b(5)}
        </section>
        ${u.rest()}`;
    },

    /* ---------- 02 要做什么 · R220 tickets ---------- */
    a_build(a, k, u) {
      const { esc, md } = k;
      const four = u.o(5).list || [];
      return `<header class="b-ticket-h">
          <p class="bt-k mono">${esc(a.kicker)}</p>
          <h2>${md(a.title)}</h2>
          <p class="bt-lead">${md(a.lead)}</p>
        </header>
        <section class="b-theater" aria-label="${esc(u.o(0).sub)}">
          <h3 class="bt-h">${esc(u.o(0).sub)}</h3>
          ${u.b(1)}
        </section>
        <section class="b-chap" aria-label="${esc(u.o(2).sub)}">
          <h3 class="bt-h">${esc(u.o(2).sub)}</h3>
          ${u.b(3)}
        </section>
        <section class="b-four" aria-label="${esc(u.o(4).sub)}">
          <h3 class="bt-h">${esc(u.o(4).sub)}</h3>
          <ol class="bf-list">${four.map(([h, t], j) => { const c = t.lastIndexOf('·'), body = c > 0 ? t.slice(0, c).trim() : t, tag = c > 0 ? t.slice(c + 1).trim() : ''; return `<li><b>${j + 1}</b><h4>${esc(h)}</h4><p>${esc(body)}</p>${tag ? `<span class="mono">${esc(tag)}</span>` : ''}</li>`; }).join('')}</ol>
          ${u.b(6)}
        </section>
        ${u.rest()}`;
    },

    /* ---------- 03a 数据与单位 · R345 banner ---------- */
    a_data(a, k, u) {
      const { esc, md } = k;
      return `<header class="b-victory">
          <svg class="bv-field" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><path d="M600 640L-40 0M600 640L1240 0"/><path d="M600 640L340 380L600 120L860 380Z"/><circle cx="600" cy="380" r="22"/><path d="M-40 -10A760 760 0 0 1 1240 -10"/></svg>
          <p class="bv-word" aria-hidden="true"><span>CONTROL</span><i>×</i><span>IMPACT</span></p>
          <div class="bv-copy"><p class="mono">${esc(a.kicker)}</p><h2>${md(a.title)}</h2><p>${md(a.lead)}</p></div>
          <p class="bv-cap mono">4 CSV · 2 UNITS</p>
        </header>
        <section class="b-src" aria-label="${esc(u.o(0).sub)}">
          <h3 class="bs-h2">${esc(u.o(0).sub)}</h3>
          ${u.b(1)}${u.b(2)}
        </section>
        <section class="b-split" aria-label="${esc(u.o(3).sub)}">
          <h3 class="bs-h"><span class="l">← 出手速度</span><span class="r">击球初速 →</span></h3>
          <p class="bs-sub">${esc(u.o(3).sub)}</p>
          ${u.b(4)}${u.b(5)}
        </section>
        ${u.rest()}`;
    },

    /* ---------- 03b 落点与筛选 · R335 ---------- */
    a_explore(a, k, u) {
      const { esc, md, block } = k;
      return `<header class="b-quad">
          <div class="bq-head"><h2>${md(a.title)}</h2><p class="mono">${esc(a.kicker)}</p></div>
          <p class="bq-lead">${md(a.lead)}</p>
          <p class="bq-cap mono">${esc(a.open.cap)}</p>
          <div class="bq-local">${block({ module: a.open.module })}</div>
        </header>
        <section class="b-flow" aria-label="${esc(u.o(0).sub)}">
          <h3 class="bfl-h">${esc(u.o(0).sub)}</h3>
          ${u.b(1)}${u.b(2)}${u.b(3)}
        </section>
        <section class="b-mix" aria-label="${esc(u.o(4).sub)}">
          <h3 class="bfl-h">${esc(u.o(4).sub)}</h3>
          ${u.b(5)}${u.b(6)}
          <details class="bm-t"><summary>展开逐年球种表（按 CSV 重算）</summary>${u.b(7)}</details>
          ${u.b(8)}
        </section>
        <section class="b-cdf" aria-label="${esc(u.o(9).sub)}">
          <h3 class="bfl-h">${esc(u.o(9).sub)}</h3>
          ${u.b(10)}${u.b(11)}
        </section>
        ${u.rest()}`;
    },

    /* ---------- 03c 击球与核对 · R357 ---------- */
    a_detail(a, k, u) {
      const { esc, md } = k;
      return `<header class="b-paper">
          <p class="bpp-mast"><span>THE STATCAST LEDGER</span><span class="mono">VOL. 04 · ${esc(a.kicker)}</span></p>
          <h2>${md(a.title)}</h2>
          <p class="bpp-dek">${md(a.lead)}</p>
          <ul class="bpp-tags mono">${String(a.open.v).split('·').map(t => `<li>${t.trim()}</li>`).join('')}</ul>
          <div class="bpp-fig bb-inspection-index"><span class="mono">CHECK THE RECORD</span><b>CSV → ID → POINT</b><p>每球保留源行与比赛标识。指标解释在旁，点选信息留在进垒图中。</p><a href="#explore">返回单球检查 ↑</a></div>
        </header>
        <section class="b-mods" aria-label="接触网格">
          <div class="bmd-a">${u.b(0)}</div>
        </section>
        <section class="b-report" aria-label="${esc(u.o(1).sub)}">
          <h3 class="bfl-h">${esc(u.o(1).sub)}</h3>
          ${u.b(2)}
        </section>
        ${u.rest()}`;
    }
  };
})();
