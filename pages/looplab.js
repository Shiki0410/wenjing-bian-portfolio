/* LoopLab — workbench collage: material labels, tape, stickers, a specimen card with a real 3D model.
   Refs (pins.txt): 250 cobalt windows on black, 11 paper collage with dot grid and X marks, 4 pinned notes on strings.
   Everything on this page is drawn here: the 3D model is a Moebius ribbon built with three@0.160 (no shared stage). */
if (window.META?.looplab) Object.assign(window.META.looplab, { sources: [], credit: ['ROLE', '个人负责竞品研究与方案表达'] });


(() => {
  const M = window.MODULES;
  const e = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* a paper card: caption strip with figure number, tape, hard shadow */
  const card = (no, title, body, foot, cls = '') => `<section class="ll-card ${cls}" data-noeva><i class="tp" aria-hidden="true"></i><header class="ll-cap"><span class="mono">${e(no)}</span><h3>${e(title)}</h3></header>${body}${foot ? `<p class="ll-foot mono">${foot}</p>` : ''}</section>`;
  const ICON = {
    list: '<circle cx="14" cy="14" r="8"/><path d="M20 20l7 7M10 11h8M10 15h8M10 19h4"/>',
    up: '<path d="M9 23a6 6 0 0 1-1-12 8 8 0 0 1 15-1 6 6 0 0 1 1 13"/><path d="M16 27V15M11 19l5-5 5 5"/>',
    cal: '<rect x="5" y="7" width="22" height="20" rx="2"/><path d="M5 13h22M11 4v6M21 4v6M11 20l4 4 7-8"/>',
    bell: '<path d="M8 22V15a8 8 0 0 1 16 0v7l2 3H6zM13 28h6"/>',
    folder: '<path d="M4 9h8l3 3h13v14H4z"/><path d="M12 22a3 3 0 0 1 0-6 4 4 0 0 1 8-1 3 3 0 0 1 0 7z"/>',
    locker: '<rect x="6" y="4" width="20" height="24" rx="1"/><path d="M16 4v24M6 16h20M12 10h1M20 10h1M12 22h1M20 22h1"/>',
    print: '<rect x="5" y="6" width="22" height="20" rx="2"/><path d="M9 10h14M16 14l5 3v5l-5 3-5-3v-5zM16 17v8"/>',
    hand: '<path d="M3 17l5-5 5 2 4-3 6 4 3-2M8 12l4 10 4 2 5-3 4-5M13 14l3 3"/>',
    cycle: '<path d="M7 14a9 9 0 0 1 15-5l3 3M25 18a9 9 0 0 1-15 5l-3-3M25 6v6h-6M7 26v-6h6"/>',
    frame: '<rect x="4" y="5" width="24" height="20" rx="1"/><path d="M4 25v3h24v-3M9 20l5-6 4 4 3-3 4 5M21 10h2"/>',
    time: '<circle cx="16" cy="16" r="11"/><path d="M16 9v7l5 3"/>',
    wallet: '<path d="M4 9h20a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3zM4 9l16-4v4M22 17h5v4h-5z"/>',
    pin: '<path d="M16 28S7 19 7 13a9 9 0 0 1 18 0c0 6-9 15-9 15z"/><circle cx="16" cy="13" r="3"/>',
    leaf: '<path d="M6 26C6 12 14 6 27 5c0 13-6 21-19 21zM6 26L18 14"/>',
    person: '<circle cx="16" cy="11" r="6"/><path d="M5 28c1-7 5-10 11-10s10 3 11 10"/>',
    cart: '<path d="M3 6h4l3 14h14l3-10H9M12 25h1M22 25h1"/>',
    ppl: '<circle cx="11" cy="11" r="4"/><circle cx="22" cy="12" r="3.5"/><path d="M3 26c1-6 4-8 8-8s7 2 8 8M19 20c4-1 8 1 9 6"/>',
    doc: '<path d="M8 3h12l6 6v20H8zM20 3v6h6M12 15h10M12 19h10M12 23h6"/>',
    gear: '<circle cx="16" cy="16" r="4"/><path d="M16 3v5M16 24v5M3 16h5M24 16h5M7 7l3 3M22 22l3 3M25 7l-3 3M10 22l-3 3"/>',
    shield: '<path d="M16 3l11 4v8c0 7-5 11-11 14C10 26 5 22 5 15V7z"/><path d="M11 16l4 4 7-8"/>',
    card: '<rect x="3" y="7" width="26" height="18" rx="2"/><path d="M3 13h26M8 20h6"/>',
    net: '<circle cx="16" cy="7" r="3"/><circle cx="7" cy="23" r="3"/><circle cx="25" cy="23" r="3"/><path d="M14 10l-5 10M18 10l5 10M10 23h12"/>',
    globe: '<circle cx="16" cy="16" r="12"/><path d="M4 16h24M16 4c-5 6-5 18 0 24M16 4c5 6 5 18 0 24"/>',
    bank: '<path d="M4 12L16 5l12 7zM7 14v10M13 14v10M19 14v10M25 14v10M4 27h24"/>',
    target: '<circle cx="16" cy="16" r="11"/><circle cx="16" cy="16" r="6"/><circle cx="16" cy="16" r="1.5"/>',
    box: '<path d="M16 3l12 6v14l-12 6-12-6V9zM4 9l12 6 12-6M16 15v14"/>'
  };
  const ic = (k, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k] || ''}</svg>`;

  /* ============================================================
     01 · PAIN CHAIN — what students do, and what it causes
     ============================================================ */
  const CHAIN = [
    ['在淘宝、1688、拼多多上网购材料', '配送时间长，临近截止日期有风险'],
    ['小需求也要买整包', '买来的材料只用掉一部分'],
    ['不熟悉材料规格', '买错或买多，试错成本增加'],
    ['剩余材料放在宿舍或工作室', '占用空间，最后多半被丢掉']
  ];
  M['looplab-chain'] = {
    html: () => card('FIG.1 · DESK RESEARCH', '采购与余料存放中的困难', `
      <div class="lc"><p class="lc-h mono a">现在的做法 / BEHAVIOR</p><span aria-hidden="true"></span><p class="lc-h mono b">带来的问题 / PROBLEM</p>
        ${CHAIN.map(([a, b], i) => `<div class="lc-n a r${i}"><b class="mono">0${i + 1}</b>${e(a)}</div><i class="lc-x" aria-hidden="true"><svg viewBox="0 0 60 24"><path d="M2 12h46M42 5l7 7-7 7"/></svg></i><div class="lc-n b r${i}">${e(b)}</div>`).join('')}
      </div>
      <p class="lc-end"><b>LoopLab</b> 在最后一环接回第一环：用完的余料先发布到交换板，进入下一个人的制作。</p>`,
      '桌面研究 · 描述的是设计学生的采购与存放习惯，没有统计样本', 'll-chain')
  };

  /* ============================================================
     02 · FIG.3 · benchmarks — a table, drawn in code
     ============================================================ */
  const BENCH = [
    ['校园食品自提柜', '扫码自助取件', '只能放单一品类', '柜点取件', '取件'],
    ['闲鱼 / 校园群', '闲置交换', '描述不统一，缺少管理', '做成闲置交换模块', '交换'],
    ['Material Bank', '快速获取材料样本', '价格高，面向企业', '缩小规模，面向学生', '团购'],
    ['淘宝打印 / 3D 打印', '线上报价、上传文件', '配送慢', '整合校园制作资源', '预约'],
    ['校园云存储', '文件分享', '没有设计标签', '加设计标签，便于检索', '档案']
  ];
  M['looplab-benchmarks'] = {
    html: () => card('FIG.3 · DESK RESEARCH', '桌面研究：五类相邻产品', `
      <div class="lb" role="table" aria-label="相邻产品比较表">
        <div class="lb-r lb-head" role="row"><span role="columnheader">参照对象</span><span role="columnheader">长处</span><span role="columnheader">局限</span><span role="columnheader">校园方案的做法</span><span role="columnheader">对应模块</span></div>
        ${BENCH.map(([n, s, w, d, m], i) => `<div class="lb-r" role="row"><b role="rowheader" data-l="参照对象"><i class="mono">${String(i + 1).padStart(2, '0')}</i>${e(n)}</b><span role="cell" data-l="长处">${e(s)}</span><span role="cell" data-l="局限" class="w">${e(w)}</span><span role="cell" data-l="做法" class="k">${e(d)}</span><span role="cell" data-l="对应模块"><em class="mono">${e(m)}</em></span></div>`).join('')}
      </div>`,
      '五项参照的对照整理 · 没有评分，也没有验证过市场效果', 'll-bench')
  };

  /* ============================================================
     03 · FIG.4 · value proposition — value map + customer profile
     ============================================================ */
  const VP = {
    product: ['LoopLab 校园小程序：浏览、预约、发布与领取余料', '积分 / 额度：捐赠余料获得免费交换额度', '小批量余料分享与交换', '共享资源库：可检索的纹理、3D 模型与项目文件', '整合制作：校内打印店与 3D 打印社团', '校园取件柜：线下闭环'],
    gain: ['积分奖励促进再利用', '免费或低价二手材料', '快速取件，提高效率', '提升可持续表现与项目价值', '可复用资源库加快创作', '一站式平台，不必切换多个应用'],
    relief: ['校内取件，减少物流等待', '小量供应，避免过量购买', '降低材料获取成本', '核实校园身份与评分，建立信任', '清晰的产品信息，减少误购', '方便与同校设计学生沟通'],
    gains: ['快速获取材料与模板', '节省成本（低价或免费二手材料）', '便利（线上预约 + 快速取件）', '价格透明，交付可靠', '可信的校园交换，低成本创作', '数字存档，更快做作品集', '减少浪费，突出可持续'],
    jobs: ['处理剩余材料与边角料，没有丢弃与空间问题', '快速获取模型材料：泡沫、纸板、亚克力、织物、胶', '降低新手试错成本', '快速打印 / 3D 打印，不等配送', '快速找到可复用的模型、纹理、模板'],
    pains: ['整包采购、包邮门槛、规格不熟，造成材料浪费', '平台分散，没有一站式服务', '配送时间长，临近截止有风险', '规格不熟悉，买错或买多，试错成本高', '数字资源分散，难以复用', '宿舍被用不上的材料占满', '一次性作业的废弃带来负担']
  };
  const notes = (arr, cls) => arr.map((t, i) => `<li class="${cls}" style="--r:${((i * 37) % 5) - 2}deg">${e(t)}</li>`).join('');
  M['looplab-value'] = {
    html: () => card('FIG.4 · VALUE PROPOSITION', '价值主张：服务方案对应学生的任务、收益与困难', `
      <div class="lv">
        <div class="lv-map"><p class="lv-t mono">VALUE MAP · 服务侧</p>
          <div class="lv-box"><div class="lv-ps"><h4>产品与服务</h4><ul>${notes(VP.product, 'y')}</ul></div>
            <div class="lv-core" aria-hidden="true">${ic('box')}</div>
            <div class="lv-gc"><h4>收益创造</h4><ul>${notes(VP.gain, 'g')}</ul></div>
            <div class="lv-pr"><h4>困难缓解</h4><ul>${notes(VP.relief, 'o')}</ul></div></div></div>
        <div class="lv-fit" aria-hidden="true"><svg viewBox="0 0 60 120"><path d="M6 40h42M40 30l10 10-10 10M54 80H12M20 70l-10 10 10 10"/></svg><span class="mono">FIT</span></div>
        <div class="lv-cus"><p class="lv-t mono">CUSTOMER PROFILE · 学生侧</p>
          <div class="lv-circle"><div class="lv-ga"><h4>期望收益</h4><ul>${notes(VP.gains, 'g')}</ul></div>
            <div class="lv-pa"><h4>遇到的困难</h4><ul>${notes(VP.pains, 'o')}</ul></div>
            <div class="lv-core" aria-hidden="true">${ic('person')}</div>
            <div class="lv-jb"><h4>需要完成的任务</h4><ul>${notes(VP.jobs, 'y')}</ul></div></div></div>
      </div>
      <div class="lv-sum">
        <p><b>目标与困难</b>面向设计、建筑和艺术类本科生。材料获取困难、配送等待长、容易过量购买、宿舍杂物多。</p>
        <p><b>方案</b>一站式平台浏览、预约和领取二手材料；积分奖励鼓励闲置捐赠；线上预约校内打印与 3D 打印；校园取件柜形成线下闭环。</p>
        <p><b>预期益处</b>降低材料和试错成本，省去切换应用与等配送的时间，减少作业废弃。这些是设计预期，不是测试发现。</p>
      </div>`,
      '价值主张画布的重绘 · 便签文字按六个分区逐项整理', 'll-value')
  };

  /* ============================================================
     04 · MATERIAL RING — Moebius ribbon, five stations, three.js
     ============================================================ */
  const ST = [
    { k: 'exchange', n: '材料交换板', en: 'EXCHANGE', rec: '材料规格、余量、成色与交接约定', flow: ['发布材料', '匹配需求', '约定交接', '确认收取'], c: '#d9a15c' },
    { k: 'book', n: '制作预约', en: 'BOOK', rec: '工艺、文件、报价、时间与完成状态', flow: ['提交文件', '接收报价', '约定制作', '校园取件'], c: '#1f3bff' },
    { k: 'group', n: '小量团购', en: 'GROUP', rec: '规格、汇总数量与截止时间', flow: ['提出需求', '汇集数量', '确认规格', '统一取件'], c: '#2f9a6a' },
    { k: 'archive', n: '项目档案', en: 'ARCHIVE', rec: '作品照片或 3D 扫描、设计标签', flow: ['上传作品', '标注标签', '项目回顾'], c: '#ff4d8d' },
    { k: 'pickup', n: '校园取件地图', en: 'PICKUP', rec: '自提柜、打印店与交换会面位置', flow: ['查询地点', '约定时间', '到点交接', '确认完成'], c: '#0d1020' }
  ];
  const MAT = [['木板', '#d9b382'], ['泡沫板', '#f3f1ea'], ['亚克力', '#8ec5ff'], ['纸板', '#b98b5a'], ['布料', '#2f7d6d']];
  const flatSvg = () => {
    const cx = 300, cy = 205, rx = 215, ry = 125;
    const pts = ST.map((s, i) => { const a = -Math.PI / 2 + i / ST.length * Math.PI * 2; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; });
    const blocks = Array.from({ length: 14 }, (_, i) => { const a = i / 14 * Math.PI * 2, x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a); return `<rect x="${(x - 7).toFixed(1)}" y="${(y - 4).toFixed(1)}" width="14" height="8" rx="1.5" fill="${MAT[i % 5][1]}" stroke="#0d1020" stroke-width="1.2" transform="rotate(${(a * 180 / Math.PI + 90).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`; }).join('');
    const arrows = ST.map((s, i) => { const a = -Math.PI / 2 + (i + .5) / ST.length * Math.PI * 2, x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a), t = a + Math.PI / 2; const ang = Math.atan2(ry * Math.cos(a), -rx * Math.sin(a)) * 180 / Math.PI; return `<path d="M-9 -7L3 0L-9 7" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(0)})" fill="none" stroke="#1f3bff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`; }).join('');
    return `<svg viewBox="0 0 600 410" role="img" aria-label="材料环平面图：五个服务模块首尾相接，材料沿箭头方向流转"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#1f3bff" stroke-width="26" opacity=".16"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#1f3bff" stroke-width="3" stroke-dasharray="14 9"/>${blocks}${arrows}
      ${pts.map(([x, y], i) => `<g class="lf-st" data-i="${i}" tabindex="0" role="button" aria-label="${e(ST[i].n)}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="24" fill="#fff" stroke="#0d1020" stroke-width="2.5"/><text x="${x.toFixed(1)}" y="${(y + 6).toFixed(1)}" text-anchor="middle" font-size="17" font-weight="800">${String(i + 1).padStart(2, '0')}</text><text x="${x.toFixed(1)}" y="${(y + (y > cy ? 50 : -34)).toFixed(1)}" text-anchor="middle" font-size="17" font-weight="800">${e(ST[i].n)}</text></g>`).join('')}
      <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="19" font-weight="800">材料环</text><text x="${cx}" y="${cy + 20}" text-anchor="middle" font-size="12" letter-spacing="2" fill="#6b7087">LOOP · 通知贯穿全程</text></svg>`;
  };
  M['looplab-ring'] = {
    html: () => card('MODEL · MATERIAL LOOP', '材料环：一条带上的五个站', `
      <div class="lr">
        <div class="lr-stage">
          <div class="lr-view" tabindex="0" role="group" aria-label="材料环三维示意。拖动旋转，方向键微调，点站点编号选择模块。">
            <canvas class="lr-cv" aria-hidden="true"></canvas><div class="lr-tags"></div>
            <span class="lr-c tl mono">LL-09 / SPEC</span><span class="lr-c tr mono">1 RIBBON · 5 STATIONS</span><span class="lr-c bl mono">N · MATERIAL FLOW →</span><span class="lr-c br mono"><i class="lr-bc"></i></span>
            <p class="lr-load mono">三维模型加载中…</p>
          </div>
          <div class="lr-flat" hidden><p class="lr-fail mono">三维模型没有加载出来。下面是同一条材料环的平面图，五个站点可点选。</p>${flatSvg()}</div>
          <div class="lr-bar"><button type="button" data-spin aria-pressed="true">自动旋转</button><button type="button" data-flow aria-pressed="true">材料流动</button><button type="button" data-reset>恢复视角</button>
            <ul class="lr-leg" aria-label="材料色块">${MAT.map(([n, c]) => `<li><i style="background:${c}"></i>${n}</li>`).join('')}</ul></div>
        </div>
        <div class="lr-side">
          <ol class="lr-list" aria-label="五个服务模块">${ST.map((s, i) => `<li><button type="button" data-i="${i}" aria-pressed="${i === 0}"><b class="mono">0${i + 1}</b><span>${s.n}</span><small class="mono">${s.en}</small></button></li>`).join('')}</ol>
          <div class="lr-detail" aria-live="polite"></div>
        </div>
      </div>`,
      '结构示意 · 带的长度、色块数量和站点位置不代表真实规模、库存或订单', 'll-ring'),
    init(el) {
      const view = $('.lr-view', el), flat = $('.lr-flat', el), list = $$('.lr-list button', el), detail = $('.lr-detail', el);
      let cur = 0, api = null;
      const paint = () => {
        const s = ST[cur];
        list.forEach((b, i) => b.setAttribute('aria-pressed', i === cur));
        $$('.lf-st', el).forEach(g => g.classList.toggle('on', +g.dataset.i === cur));
        $$('.lr-tag', el).forEach(t => t.classList.toggle('on', +t.dataset.i === cur));
        detail.innerHTML = `<p class="mono">STATION 0${cur + 1} / 05 · ${s.en}</p><h4>${s.n}</h4><dl><dt>记录的信息</dt><dd>${s.rec}</dd><dt>概念流程</dt><dd><ol class="lr-flow">${s.flow.map(f => `<li>${f}</li>`).join('')}</ol></dd></dl><p class="lr-next mono">下一站 → ${ST[(cur + 1) % 5].n}</p>`;
      };
      const pick = (i, fromModel) => { cur = (i + 5) % 5; paint(); if (api) api.focus(cur); };
      list.forEach(b => b.addEventListener('click', () => pick(+b.dataset.i)));
      $$('.lf-st', el).forEach(g => { g.addEventListener('click', () => pick(+g.dataset.i)); g.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); pick(+g.dataset.i); } }); });
      const fail = () => { el.classList.add('nofx'); view.hidden = true; flat.hidden = false; $('.lr-bar [data-spin]', el).hidden = true; $('.lr-bar [data-flow]', el).hidden = true; $('.lr-bar [data-reset]', el).hidden = true; paint(); };
      paint();
      if (/[?&]no3d\b/.test(location.search) || window.__LR_NO3D) { fail(); return; }
      const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
      const load = () => window.__llThree || (window.__llThree = Promise.race([import(THREE_URL), new Promise((_, no) => setTimeout(() => no(new Error('three timeout')), 12000))]));
      load().then(T => {
        try { api = mountRing(T, el, view, i => { cur = i; paint(); }); api.focus(0, true); $('.lr-load', el).hidden = true; el._lr = api; }
        catch (err) { console.warn('looplab 3d', err); fail(); }
      }).catch(err => { console.warn('looplab 3d', err); fail(); });
    }
  };

  function mountRing(T, host, view, onPick) {
    const cv = $('.lr-cv', view), tagsBox = $('.lr-tags', view);
    const renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.outputColorSpace = T.SRGBColorSpace;
    const scene = new T.Scene(), cam = new T.PerspectiveCamera(30, 1, .1, 60);
    cam.position.set(0, 2.2, 9.6); cam.lookAt(0, 0, 0);
    scene.add(new T.HemisphereLight(0xffffff, 0xa8b8ff, 1.1));
    const dl = new T.DirectionalLight(0xffffff, 1.35); dl.position.set(3, 6, 5); scene.add(dl);
    const root = new T.Group(); scene.add(root);
    const R = 2.45, W = .66, TAU = Math.PI * 2;
    /* Moebius surface: u runs 0..4pi for a full return of the normal */
    const S = (u, v, out = new T.Vector3()) => { const a = R + v * Math.cos(u / 2); return out.set(a * Math.cos(u), v * Math.sin(u / 2), a * Math.sin(u)); };
    /* ribbon with chevron texture so the direction of flow can be read */
    const tc = document.createElement('canvas'); tc.width = 256; tc.height = 64; const g = tc.getContext('2d');
    g.fillStyle = '#1f3bff'; g.fillRect(0, 0, 256, 64);
    g.fillStyle = 'rgba(214,228,255,.95)'; g.fillRect(0, 3, 256, 3); g.fillRect(0, 58, 256, 3);
    g.strokeStyle = '#d6e4ff'; g.lineWidth = 7; g.lineJoin = 'miter'; g.lineCap = 'butt';
    g.beginPath(); g.moveTo(44, 14); g.lineTo(70, 32); g.lineTo(44, 50); g.stroke();
    g.lineWidth = 3; g.beginPath(); g.moveTo(104, 20); g.lineTo(122, 32); g.lineTo(104, 44); g.stroke();
    g.fillStyle = '#d6e4ff'; for (let i = 0; i < 4; i++) g.fillRect(150 + i * 14, 30, 7, 4);
    const tex = new T.CanvasTexture(tc); tex.wrapS = T.RepeatWrapping; tex.wrapT = T.ClampToEdgeWrapping; tex.repeat.set(12, 1); tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 4;
    const N = 260, pos = [], uv = [], idx = [];
    for (let i = 0; i <= N; i++) { const u = i / N * TAU; for (const j of [0, 1]) { const p = S(u, (j ? 1 : -1) * W); pos.push(p.x, p.y, p.z); uv.push(i / N, j); } }
    for (let i = 0; i < N; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
    const ribbon = new T.Mesh(geo, new T.MeshStandardMaterial({ map: tex, side: T.DoubleSide, roughness: .55, metalness: 0 })); root.add(ribbon);
    for (const sg of [-1, 1]) { const pts = []; for (let i = 0; i <= N; i++) pts.push(S(i / N * TAU, sg * W)); root.add(new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color: 0x0d1020 }))); }
    /* shadow disc */
    const sh = new T.Mesh(new T.CircleGeometry(R + 1.1, 48), new T.MeshBasicMaterial({ color: 0x1f3bff, transparent: true, opacity: .09, depthWrite: false })); sh.rotation.x = -Math.PI / 2; sh.position.y = -1.25; scene.add(sh);
    /* stations: a stem rising from the ribbon centre line, a small prop on top */
    const mat = (c, o = {}) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: .6 }, o));
    const box = (w, h, d, c, o) => new T.Mesh(new T.BoxGeometry(w, h, d), mat(c, o));
    const props = [
      () => { const gr = new T.Group(); const a = box(.58, .07, .38, 0xd9b382); const b = box(.52, .07, .34, 0xf3f1ea); b.position.y = .08; b.rotation.y = .35; const c = box(.4, .07, .3, 0x8ec5ff, { transparent: true, opacity: .8 }); c.position.y = .16; c.rotation.y = -.25; gr.add(a, b, c); return gr; },
      () => { const gr = new T.Group(); const fr = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(.5, .46, .5)), new T.LineBasicMaterial({ color: 0x0d1020 })); const gl = box(.5, .46, .5, 0xd6e4ff, { transparent: true, opacity: .35 }); const o = box(.17, .17, .17, 0x1f3bff); o.position.y = -.1; const hd = box(.34, .03, .03, 0x0d1020); hd.position.y = .1; gr.add(gl, fr, o, hd); return gr; },
      () => { const gr = new T.Group(); [[0, 0, 0, .26, 0x2f7d6d], [.28, -.03, .08, .2, 0xb98b5a], [-.12, .22, -.04, .2, 0xf3f1ea], [.16, .2, .14, .16, 0xd9b382]].forEach(([x, y, z, s, c]) => { const b = box(s, s, s, c); b.position.set(x, y, z); b.rotation.y = x * 2; gr.add(b); }); return gr; },
      () => { const gr = new T.Group(); const f = box(.54, .4, .05, 0xffffff); const i = box(.44, .3, .02, 0xff4d8d); i.position.z = .035; const ph = box(.3, .14, .02, 0xd6e4ff); ph.position.set(-.04, -.05, .05); const st = box(.05, .16, .05, 0x0d1020); st.position.set(0, -.28, -.04); gr.add(f, i, ph, st); gr.rotation.y = .3; return gr; },
      () => { const gr = new T.Group(); const body = box(.5, .52, .32, 0x0d1020); gr.add(body); [[-.12, .13], [.12, .13], [-.12, -.13], [.12, -.13]].forEach(([x, y], k) => { const d = box(.2, .2, .02, k === 0 ? 0x1f3bff : 0xd6e4ff); d.position.set(x, y, .17); gr.add(d); const h = box(.04, .02, .02, 0x0d1020); h.position.set(x + .06, y, .19); gr.add(h); }); return gr; }
    ];
    const stations = ST.map((s, i) => {
      const u = i / 5 * TAU, p = S(u, 0), gr = new T.Group(); gr.position.copy(p); root.add(gr);
      const stem = box(.028, .9, .028, 0x0d1020); stem.position.y = .45; gr.add(stem);
      const ring = new T.Mesh(new T.TorusGeometry(.2, .018, 8, 40), mat(0xff4d8d)); ring.rotation.x = Math.PI / 2; ring.position.y = .01; gr.add(ring);
      const prop = props[i](); prop.position.y = 1.22; gr.add(prop);
      const tag = document.createElement('button'); tag.type = 'button'; tag.className = 'lr-tag'; tag.dataset.i = i; tag.innerHTML = `<b class="mono">0${i + 1}</b>${s.n}`; tag.addEventListener('click', () => { onPick(i); focus(i); });
      tagsBox.appendChild(tag);
      return { u, gr, prop, ring, tag, top: new T.Vector3(0, 1.75, 0) };
    });
    /* material blocks riding the ribbon */
    const kinds = [[.24, .07, .17, 0xd9b382], [.2, .1, .2, 0xf3f1ea], [.22, .05, .22, 0x8ec5ff, 1], [.26, .06, .16, 0xb98b5a], [.2, .04, .24, 0x2f7d6d]];
    const blocks = Array.from({ length: 15 }, (_, i) => {
      const [w, h, d, c, tr] = kinds[i % 5], m = box(w, h, d, c, tr ? { transparent: true, opacity: .78 } : {}); m.userData = { u: i / 15 * TAU * 2, v: (((i * 53) % 7) - 3) / 3 * W * .45, h }; root.add(m); return m;
    });
    const A = new T.Vector3(), B = new T.Vector3(), Tg = new T.Vector3(), Bn = new T.Vector3(), Nn = new T.Vector3(), Zz = new T.Vector3(), mtx = new T.Matrix4();
    const place = m => {
      const { u, v, h } = m.userData, e = .01;
      S(u + e, v, A); S(u - e, v, B); Tg.subVectors(A, B).normalize();
      S(u, v + e, A); S(u, v - e, B); Bn.subVectors(A, B).normalize();
      Nn.crossVectors(Tg, Bn).normalize(); Zz.crossVectors(Tg, Nn).normalize();
      mtx.makeBasis(Tg, Nn, Zz); m.quaternion.setFromRotationMatrix(mtx);
      S(u, v, A); m.position.copy(A).addScaledVector(Nn, h / 2 + .012);
    };
    blocks.forEach(place);
    /* state */
    const st = { yaw: 0, pitch: .42, ty: 0, tp: .42, spin: !reduce, flow: !reduce, drag: false, sel: 0, x: 0, y: 0, vis: true, hold: 0 };
    const home = () => { st.tp = .42; };
    const yawFor = i => { const phi = stations[i].u; let t = phi - Math.PI / 2; const k = Math.round((st.yaw - t) / TAU); return t + k * TAU; };
    function focus(i, instant) { st.sel = i; st.ty = yawFor(i); st.hold = 1.6; st.spinWas = st.spin; if (instant) { st.yaw = st.ty; } stations.forEach((s, k) => { s.tag.classList.toggle('on', k === i); }); }
    const size = () => { const r = view.getBoundingClientRect(); const w = Math.max(240, r.width), h = Math.max(240, r.height); renderer.setSize(w, h, false); cam.aspect = w / h; const d = Math.max(9.6, 3.7 / (.268 * cam.aspect)); cam.position.set(0, 2.2 * d / 9.6, d); cam.lookAt(0, 0, 0); cam.updateProjectionMatrix(); };
    const V = new T.Vector3();
    const render = (dt = 0) => {
      if (st.flow) { tex.offset.x -= dt * .06; blocks.forEach(m => { m.userData.u += dt * .42; place(m); }); }
      if (st.hold > 0) st.hold -= dt;
      if (!st.drag) {
        if (st.hold > 0) st.yaw += (st.ty - st.yaw) * Math.min(1, dt * 5);
        else if (st.spin) { st.yaw += dt * .22; }
        st.pitch += (st.tp - st.pitch) * Math.min(1, dt * 6);
      }
      root.rotation.y = st.yaw; root.rotation.x = st.pitch;
      stations.forEach((s, k) => {
        const on = k === st.sel, sc = on ? 1.28 : 1; s.prop.scale.setScalar(s.prop.scale.x + (sc - s.prop.scale.x) * Math.min(1, dt * 8 + .0001)); s.prop.rotation.y += dt * (on ? 1.2 : .35);
        s.ring.visible = on; s.ring.scale.setScalar(1 + (Math.sin(performance.now() / 260) * .12));
      });
      root.updateMatrixWorld(true);
      const r = view.getBoundingClientRect();
      stations.forEach(s => { V.copy(s.top); s.gr.localToWorld(V); V.project(cam); const hw = s.tag.offsetWidth / 2 + 4; const x = Math.max(hw, Math.min(r.width - hw, (V.x * .5 + .5) * r.width)), y = Math.max(s.tag.offsetHeight + 4, (-V.y * .5 + .5) * r.height); s.tag.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(-50%,-100%)`; s.tag.style.opacity = V.z < 1 ? '1' : '0'; });
      renderer.render(scene, cam);
    };
    size();
    new ResizeObserver(() => { size(); render(0); }).observe(view);
    let last = performance.now(), raf = 0;
    const loop = t => { raf = requestAnimationFrame(loop); const dt = Math.min(.05, (t - last) / 1000); last = t; if (st.vis) render(dt); };
    new IntersectionObserver(en => { st.vis = en[0].isIntersecting; }, { threshold: 0 }).observe(view);
    raf = requestAnimationFrame(loop);
    /* input */
    view.addEventListener('pointerdown', ev => { if (ev.target.closest('.lr-tag')) return; st.drag = true; st.x = ev.clientX; st.y = ev.clientY; st.hold = 0; view.setPointerCapture?.(ev.pointerId); view.classList.add('drag'); });
    view.addEventListener('pointermove', ev => { if (!st.drag) return; st.yaw += (ev.clientX - st.x) * .008; st.pitch = Math.max(.05, Math.min(1.1, st.pitch + (ev.clientY - st.y) * .006)); st.tp = st.pitch; st.x = ev.clientX; st.y = ev.clientY; render(0); });
    const up = () => { st.drag = false; view.classList.remove('drag'); };
    view.addEventListener('pointerup', up); view.addEventListener('pointercancel', up);
    view.addEventListener('keydown', ev => { const k = ev.key; if (k === 'ArrowLeft') st.yaw -= .12; else if (k === 'ArrowRight') st.yaw += .12; else if (k === 'ArrowUp') st.tp = st.pitch = Math.max(.05, st.pitch - .08); else if (k === 'ArrowDown') st.tp = st.pitch = Math.min(1.1, st.pitch + .08); else return; st.hold = 0; ev.preventDefault(); render(0); });
    const bs = $('[data-spin]', host), bf = $('[data-flow]', host);
    bs.setAttribute('aria-pressed', st.spin); bf.setAttribute('aria-pressed', st.flow);
    bs.addEventListener('click', () => { st.spin = !st.spin; st.hold = 0; bs.setAttribute('aria-pressed', st.spin); });
    bf.addEventListener('click', () => { st.flow = !st.flow; bf.setAttribute('aria-pressed', st.flow); });
    $('[data-reset]', host).addEventListener('click', () => { st.tp = .42; st.ty = yawFor(st.sel); st.hold = 1.6; });
    render(0);
    return { focus, render, state: st, stations };
  }

  /* ============================================================
     05 · HANDOFF — a local walkthrough, nothing is submitted
     ============================================================ */
  M['looplab-handoff'] = {
    html: () => card('DEMO · HANDOFF', '交接核对演示', `
      <div class="lh"><label class="lh-sel">演示材料类别<select><option>板材 / 模型制作</option><option>纸材 / 印刷与装订</option><option>耗材 / 制作预约</option></select></label>
        <fieldset><legend>核对状态</legend>${['规格与使用条件', '数量与材料状态', '时间与取件位置'].map((t, i) => `<label class="lh-ck"><input type="checkbox" data-check="${i}"/><span>${t}</span></label>`).join('')}</fieldset>
        <div class="lh-read" aria-live="polite"></div>
        <div class="lh-btn"><button type="button" data-confirm disabled>确认核对状态</button><button type="button" data-reset>重新演示</button></div></div>`,
      '本地概念演示 · 只记录当前页面里的选择，不提交订单、库存或预约', 'll-handoff'),
    init(el) {
      const sel = $('select', el), checks = $$('input', el), next = $('[data-confirm]', el), read = $('.lh-read', el);
      let done = false;
      const draw = () => {
        const n = checks.filter(c => c.checked).length; next.disabled = n < 3 || done;
        read.innerHTML = done ? `<b class="ok mono">READY</b><h4>交接准备完成</h4><p>${e(sel.value)} · 核对状态已确认。这是界面示例，没有实际安排取件。</p>` : `<b class="mono">${n} / 3</b><h4>${n} 项已核对</h4><p>三项都核对后，才能确认交接准备。</p>`;
        $$('.lh-ck', el).forEach((l, i) => l.classList.toggle('on', checks[i].checked));
      };
      const reset = () => { done = false; checks.forEach(c => c.checked = false); draw(); };
      checks.forEach(c => c.addEventListener('change', () => { done = false; draw(); }));
      sel.addEventListener('change', reset);
      next.addEventListener('click', () => { done = true; draw(); });
      $('[data-reset]', el).addEventListener('click', reset);
      draw();
    }
  };

  /* ============================================================
     06 · FIG.5 · system map — online / offline lanes, drawn in code
     ============================================================ */
  const ONL = [['发现列表', 'Discover listings', 'list'], ['上传材料 / 文件', 'Upload material / file', 'up'], ['确认预约', 'Confirm booking', 'cal'], ['接收通知', 'Receive notification', 'bell'], ['访问数字档案', 'Access digital', 'folder']];
  const OFL = [['柜点投放', 'Drop-off at locker', 'locker'], ['打印店制作', 'Print shop production', 'print'], ['取件 / 交接', 'Pickup / handoff', 'hand'], ['回收 / 再分配', 'Recycling / redistribution', 'cycle'], ['项目存放 / 展示', 'Project storage / display', 'frame']];
  const IMP = [['减少浪费', 'leaf'], ['减少重复购买', 'cart'], ['缩短周期', 'time'], ['支持校园协作', 'ppl'], ['形成可复用记录', 'doc']];
  const NEED = [['时间', 'time'], ['预算', 'wallet'], ['便利', 'pin'], ['可持续', 'leaf']];
  const SUP = [['伙伴网络', '校园打印店、材料供应商、回收伙伴', 'net'], ['内容审核', '内容与发布审核、安全与政策合规', 'shield'], ['支付与追踪', '安全支付、订单追踪、历史与分析', 'card']];
  M['looplab-system'] = {
    html: () => card('FIG.5 · SYSTEM MAP', '服务系统图：线上平台与线下校园网络', `
      <label class="ls-sel">定位阶段<select data-lane><option value="-1">全部阶段</option>${ONL.map(([n], i) => `<option value="${i}">${i + 1} · ${n}</option>`).join('')}</select></label>
      <div class="ls" data-focus="-1">
        <aside class="ls-stu"><h4>设计学生</h4><div class="ls-av">${ic('person')}</div><p class="mono">KEY NEEDS</p><ul>${NEED.map(([n, k]) => `<li>${ic(k, 'ic sm')}${n}</li>`).join('')}</ul></aside>
        <i class="ls-in" aria-hidden="true"></i>
        <div class="ls-mid">
          <header class="ls-band on"><span>${ic('globe')}</span><b class="mono">ONLINE PLATFORM · 线上平台</b></header>
          <ol class="ls-row on">${ONL.map(([n, en, k], i) => `<li data-i="${i}"><span class="ls-no mono">${i + 1}</span>${ic(k, 'ic big')}<b>${n}</b><small>${en}</small></li>`).join('')}</ol>
          <div class="ls-link" aria-hidden="true">${ONL.map((_, i) => `<i data-i="${i}"></i>`).join('')}</div>
          <header class="ls-band off"><span>${ic('bank')}</span><b class="mono">OFFLINE CAMPUS NETWORK · 线下校园网络</b></header>
          <ol class="ls-row off">${OFL.map(([n, en, k], i) => `<li data-i="${i}"><span class="ls-no mono">${i + 1}</span>${ic(k, 'ic big')}<b>${n}</b><small>${en}</small></li>`).join('')}</ol>
        </div>
        <i class="ls-out" aria-hidden="true"></i>
        <aside class="ls-imp"><h4>${ic('target', 'ic sm')}系统影响</h4><ul>${IMP.map(([n, k]) => `<li>${ic(k, 'ic sm')}${n}</li>`).join('')}</ul></aside>
        <div class="ls-sup"><h4>${ic('gear', 'ic')}SUPPORTING SYSTEMS<small>支持系统</small></h4>${SUP.map(([n, t, k], i) => `${i ? '<i class="ls-dot" aria-hidden="true"></i>' : ''}<div class="ls-s">${ic(k, 'ic big')}<b>${n}</b><span>${t}</span></div>`).join('')}</div>
      </div>
      <p class="ls-read mono" aria-live="polite">线上、线下各五个阶段，都从左向右进行；每一列的虚线把线上阶段和对应的线下阶段连在一起，不表示先后。</p>`,
      '系统图的重绘 · 学生入口指向平台，系统影响由平台指出；系统影响属预期目标，尚未测量', 'll-system'),
    init(el) {
      const root = $('.ls', el), read = $('.ls-read', el), base = read.textContent;
      const apply = i => {
        root.dataset.focus = i;
        $$('.ls-row li, .ls-link i', el).forEach(n => n.classList.toggle('dim', i >= 0 && +n.dataset.i !== i));
        read.textContent = i < 0 ? base : `第 ${i + 1} 列：线上“${ONL[i][0]}”对应线下“${OFL[i][0]}”。虚线只表示对应关系。`;
      };
      $('select', el).addEventListener('change', ev => apply(+ev.target.value));
      $$('.ls-row li', el).forEach(li => li.addEventListener('click', () => { const i = +li.dataset.i, c = +root.dataset.focus === i ? -1 : i; $('select', el).value = c; apply(c); }));
    }
  };

  /* ============================================================
     07 · BUSINESS — five price tags
     ============================================================ */
  const BIZ = [['校园 SaaS', '学校管理方', '存储与社区年度订阅', '¥10,000–50,000', '每校每年'], ['高级功能', '高频用户（高年级 / 研究生）', '高级下载、虚拟展览空间、企业包', '¥29–99', '每用户每月'], ['企业合作', '材料品牌与供应商', '产品展示费或收益分成', '¥5,000–20,000', '每家供应商每年'], ['服务佣金', '校内打印店 / 3D 打印社团', '制作订单佣金 5–10%', '¥2–5', '每单'], ['免费基础入口', '所有用户', '基础交换免费；快速取件、检索或档案导出付费', '5–10%', '目标转化率']];
  M['looplab-business'] = {
    html: () => card('BUSINESS · PROPOSAL', '五种商业机制与定价假设', `<div class="lbz">${BIZ.map(([h, t, m, v, u], i) => `<article style="--r:${[-1.4, .9, -.6, 1.3, -1][i]}deg"><i class="tp" aria-hidden="true"></i><span class="mono">MODEL 0${i + 1}</span><h4>${h}</h4><p class="lbz-p"><b>${v}</b><small>${u}</small></p><dl><dt>服务对象</dt><dd>${t}</dd><dt>机制</dt><dd>${m}</dd></dl><em class="mono">方案区间 · 未实现收入</em></article>`).join('')}</div>`,
      '定价和转化率是方案假设，不是收入记录', 'll-business')
  };

  /* ============================================================
     08 · FINANCE — funnel and bars
     ============================================================ */
  const FIN = [['收入', 219000], ['成本', 69000], ['利润', 150000]];
  M['looplab-finance'] = {
    html: () => card('FINANCIAL PLAN · YEAR 1', '市场范围与首年经济测算', `
      <div class="lf">
        <div class="lf-fun" role="img" aria-label="漏斗：全国设计学生 3,000,000；上海设计学生 150,000；首年活跃用户目标 12,000">
          ${[['TAM', '3,000,000', '全国设计学生'], ['SAM', '150,000', '上海设计学生 · 约 TAM 的 5%'], ['SOM', '12,000', '首年活跃用户目标 · 约 SAM 的 8%']].map(([k, n, t], i) => `<div class="lf-s s${i}"><b class="mono">${k}</b><strong>${n}</strong><span>${t}</span></div>${i < 2 ? '<i class="lf-a" aria-hidden="true"></i>' : ''}`).join('')}
          <p>上海主要设计院校是计划的试点范围。数字是方案估算，条的宽度不编码规模。</p></div>
        <div class="lf-bar"><svg viewBox="0 0 600 300" role="img" aria-labelledby="llf-t llf-d"><title id="llf-t">首年收入、成本与利润测算</title><desc id="llf-d">人民币元，从零开始。收入 219,000，成本 69,000，利润 150,000。利润等于收入减成本，均为方案测算。</desc>
          <text x="10" y="22" class="lf-h">首年测算 · 人民币元</text>
          ${[0, 50000, 100000, 150000, 200000].map(v => { const x = 90 + v / 250000 * 470; return `<line x1="${x}" y1="42" x2="${x}" y2="238" class="lf-g"/><text x="${x}" y="262" text-anchor="middle" class="lf-t">${v / 1000}k</text>`; }).join('')}
          ${FIN.map(([n, v], i) => { const y = 54 + i * 62, w = v / 250000 * 470; return `<text x="80" y="${y + 24}" text-anchor="end" class="lf-l">${n}</text><rect x="90" y="${y}" width="${w}" height="38" class="lf-b b${i}"/><text x="${Math.min(98 + w, 520)}" y="${y + 25}" class="lf-v">${v.toLocaleString('en-US')}</text>`; }).join('')}
          <text x="10" y="292" class="lf-t">219,000 − 69,000 = 150,000</text></svg></div>
      </div>
      <div class="lf-note"><b class="mono">待统一的口径</b><p>结构化目标是 12,000 名活跃用户；同一份材料另写“超过 1,000 活跃用户”。两项都没有实现，这里照实并列。取件 &lt;15 分钟、MAU、再利用重量 kg 是计划指标。“95% 余料丢弃”没有来源，不用来证明需求或效果。</p></div>`,
      '收入、成本、利润和市场规模都是方案假设', 'll-finance')
  };
})();

/* ============================================================
   PAGE LAYOUT
   ============================================================ */
(() => {
  const PG = (window.PAGES = window.PAGES || {});
  const bc = n => `<i class="l-bc" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<b style="--w:${1 + ((i * 7) % 3)}"></b>`).join('')}</i>`;
  const NO = ['EXCHANGE', 'GROUP', 'BOOK', 'ARCHIVE', 'PICKUP'];
  PG.looplab = {
    title(k) {
      const { p, s, esc } = k;
      return `<section class="l-mat" aria-labelledby="tc-name">
        <span class="lm-x a" aria-hidden="true"></span><span class="lm-x b" aria-hidden="true"></span>
        <div class="lm-sheet"><i class="tp t1" aria-hidden="true"></i><i class="tp t2" aria-hidden="true"></i>
          <header><span class="mono">LL-${p.number} · MATERIAL LOOP</span><span class="mono">SPEC SHEET · A4</span></header>
          <h1 id="tc-name">Loop<br><span>Lab</span></h1>
          <p class="lm-sub">${esc(s.sub)}</p>
          <div class="lm-cols">${[['交换', 'EXCHANGE'], ['团购', 'GROUP'], ['预约', 'BOOK'], ['档案', 'ARCHIVE'], ['取件', 'PICKUP']].map(([c, e], i) => `<p><b>${c}</b><span class="mono">${e}</span><i>0${i + 1}</i></p>`).join('')}</div>
          <figure class="lm-fig"><img src="assets/${s.key}.webp" alt="${esc(s.keyCap)}" fetchpriority="high"><figcaption class="mono">${esc(s.keyCap)}</figcaption></figure>
          <dl class="lm-meta">${(s.meta || []).map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>
          ${bc(34)}
        </div>
        <a class="lm-back mono" href="index.html#scene-${p.id}" data-cut="INDEX">← INDEX</a>
      </section>`;
    },
    logline(k) {
      const { s, md, esc, p } = k, L = s.logline || {};
      return `<section class="l-rcpt" aria-label="项目摘要">
        <div class="lr-phone"><div class="lr-paper">
          <header><b>works</b><span class="mono">No.${p.number} · LOOPLAB</span></header>
          <p class="lr-row h mono"><span>ITEM</span><span>NOTE</span></p>
          ${[['01 · 問', L.q], ['02 · 做', L.a], ['03 · 果', L.r]].map(([h, t]) => `<div class="lr-item"><b>${h}</b><p>${md(t)}</p></div>`).join('')}
          <p class="lr-dash" aria-hidden="true"></p>
          ${(s.stats || []).map(([v, l]) => `<p class="lr-row"><span>${esc(l)}</span><b>${esc(v)}</b></p>`).join('')}
          <p class="lr-dash" aria-hidden="true"></p>
          <p class="lr-row t"><span>STATUS</span><b>方案 · 未上线</b></p>
          ${bc(40)}
          <p class="lr-foot mono">${esc(s.stripB)}</p>
        </div></div>
        <aside class="lr-bound"><i class="tp" aria-hidden="true"></i><span class="mono">MATERIAL LOOP / SERVICE STUDY</span><p>LoopLab 面向设计、建筑和艺术类本科生。材料信息、制作预约和取件放进同一个校园服务，作品档案另外保存照片和 3D 扫描。商业测算集中在后文，和使用过程分开呈现。</p></aside>
      </section>`;
    },
    act(a, i, k) {
      const f = this['a_' + a.id], u = k.use(a);
      return f ? f.call(this, a, i, k, u) : u.rest();
    },
    head(a, i, k) {
      const { esc, md } = k;
      return `<header class="ll-head"><span class="ll-no" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><div class="ll-ht"><p class="ll-k mono"><i class="tp" aria-hidden="true"></i>${esc(a.kicker)}</p><h2>${md(a.title)}</h2><p class="ll-lead">${md(a.lead)}</p></div><i class="ll-x" aria-hidden="true"></i></header>`;
    },
    sub(o) { return `<h3 class="ll-sub"><span>${o.sub}</span><i class="mono">${o.en || ''}</i></h3>`; },
    a_question(a, i, k, u) {
      const { md } = k;
      return `${this.head(a, i, k)}
        <div class="ll-w w-chain">${u.b(0)}</div>
        <div class="ll-w w-two"><div class="ll-tx">${this.sub(u.o(1))}${[].concat(u.o(2).text).map(t => `<p>${md(t)}</p>`).join('')}</div>
          <aside class="ll-mine"><i class="tp" aria-hidden="true"></i><p class="mono">MY PART · 我的工作</p><ol>${(u.o(3).list || []).map((t, j) => `<li><b class="mono">0${j + 1}</b>${md(t)}</li>`).join('')}</ol></aside></div>`;
    },
    a_research(a, i, k, u) {
      const { esc } = k;
      return `${this.head(a, i, k)}
        <div class="ll-w w-bench">${u.b(0)}</div>
        <div class="ll-w w-value">${u.b(1)}</div>
        <div class="ll-w w-plan">${this.sub(u.o(2))}<ol class="ll-plan">${(u.o(3).list || []).map(([h, t], j) => `<li style="--r:${[-1, .8, -.5][j]}deg"><i class="tp" aria-hidden="true"></i><b class="mono">PHASE 0${j + 1}</b><h4>${esc(h)}</h4><p>${esc(t)}</p></li>`).join('')}</ol>${u.b(4)}</div>`;
    },
    a_mvp(a, i, k, u) { return `${this.head(a, i, k)}<div class="ll-w w-ring">${u.b(0)}</div><div class="ll-w w-hand">${u.b(1)}${u.b(2)}</div>`; },
    a_fulfil(a, i, k, u) {
      return `${this.head(a, i, k)}
        <div class="ll-w w-sys">${u.b(0)}</div>
        <div class="ll-w w-biz">${u.b(1)}</div>
        <div class="ll-w w-fin">${u.b(2)}</div>
        <div class="ll-w w-vid">${this.sub(u.o(3))}${u.b(4)}</div>`;
    }
  };
})();
