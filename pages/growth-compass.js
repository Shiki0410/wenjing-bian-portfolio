/* Growth Compass — research notebook / pop-up windows / compass dial.
   References (pins.txt order): 245 ring-type poster, 526 cobalt pop-up windows with halftone, 250 ring text on black.
   Everything on this page is drawn by this file: no shared renderer, chart kit or stage is touched. */
if (window.META?.['growth-compass']) Object.assign(window.META['growth-compass'], {
  sources: [],
  credit: ['TEAM', '团队项目 · 个人负责研究分析与服务方案整理']
});


(() => {
  const M = window.MODULES;
  const e = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* a pop-up window: cobalt title bar, three buttons, hard shadow (ref 526) */
  const win = (code, title, body, cls = '') => `<section class="gw ${cls}"><header class="gw-bar"><i class="gw-ic" aria-hidden="true"></i><b>${e(title)}</b><span class="gw-code">${e(code)}</span><span class="gw-btn" aria-hidden="true"><i></i><i></i><i></i></span></header><div class="gw-body">${body}</div></section>`;

  /* ============================================================
     01 · RING DIAL  (ref 245 / 250: concentric type, a needle)
     ============================================================ */
  const RINGS = [
    { id: 'know', n: '01', name: '课程认知', en: 'COURSE AWARENESS', r: 108, ang: -32,
      unit: '课程练什么能力 · 与个人目标的关系 · COURSE AWARENESS · ',
      find: '学生判断一门课时，拿到的多是课程列表和作业要求。课程训练哪种能力、和自己的目标有什么关系，很少有人说明。',
      touch: ['课程预览', '能力指向说明', '往届案例'], where: '选课旅程 · 预见课程', go: '#journey' },
    { id: 'try', n: '02', name: '兴趣探索', en: 'INTEREST EXPLORATION', r: 166, ang: 52,
      unit: '试听入口分散 · 改选没有出口 · 想跨领域又不敢选 · INTEREST EXPLORATION · ',
      find: '想跨领域尝试的学生，面对分散的课程信息和说不准的试错成本。试听机会和改选机制，没有一个说清楚的入口。',
      touch: ['课程星图', '低成本试听', '选课调整'], where: '选课旅程 · 低成本试听', go: '#journey' },
    { id: 'press', n: '03', name: '学习压力', en: 'LEARNING PRESSURE', r: 224, ang: 148,
      unit: '作业要求不清 · 卡住了不知道问谁 · 截止日期推着走 · LEARNING PRESSURE · ',
      find: '作业做到一半卡住时，学生缺少把任务说清楚的工具，求助也没有稳定的出口，只能靠截止日期往前推。',
      touch: ['作业逻辑画布', '朋辈预审', '人工讨论'], where: '作业旅程 · 强制支架、即时预审', go: '#journey' }
  ];
  M['growth-compass-rings'] = {
    html: () => {
      const ticks = Array.from({ length: 72 }, (_, i) => { const a = i * 5 * Math.PI / 180, L = i % 6 === 0 ? 17 : 7, r1 = 290, r2 = r1 - L; return `<line x1="${(Math.sin(a) * r1).toFixed(1)}" y1="${(-Math.cos(a) * r1).toFixed(1)}" x2="${(Math.sin(a) * r2).toFixed(1)}" y2="${(-Math.cos(a) * r2).toFixed(1)}"/>`; }).join('');
      const rings = RINGS.map((g, i) => `<g class="gr-ring" data-ring="${g.id}" style="--dur:${[140, 110, 170][i]}s;--dir:${i === 1 ? 'reverse' : 'normal'}"><path id="gr-p-${g.id}" d="M${-g.r} 0 A${g.r} ${g.r} 0 1 1 ${g.r} 0 A${g.r} ${g.r} 0 1 1 ${-g.r} 0" fill="none"/><circle class="gr-band" r="${g.r - 9}"/><circle class="gr-band" r="${g.r + 25}"/><text class="gr-txt" font-size="16"><textPath href="#gr-p-${g.id}">${e(g.unit)}</textPath></text><circle class="gr-hit" r="${g.r + 8}" /></g>`).join('');
      const cards = [['N', 0], ['E', 90], ['S', 180], ['W', 270]].map(([c, a]) => `<g transform="rotate(${a})"><rect x="-11" y="-276" width="22" height="22" rx="3"/><text y="-260" text-anchor="middle" transform="rotate(${-a} 0 -260)">${c}</text></g>`).join('');
      return `<div class="gr">
        <figure class="gr-dial"><svg viewBox="-320 -320 640 640" role="img" aria-label="三层文字环：课程认知、兴趣探索、学习压力，指针指向对应的服务触点" data-sel="know">
          <circle class="gr-disc" r="310"/><g class="gr-ticks">${ticks}</g><g class="gr-cards">${cards}</g>
          <path class="gr-cross" d="M-262 0H262M0-262V262"/><path class="gr-cross dg" d="M-185-185L185 185M185-185L-185 185"/>
          ${rings}
          <g class="gr-needle" data-needle><path d="M-5 0L0 -258L5 0Z"/><circle class="tip" r="9" cy="-224"/><circle class="base" r="6"/></g>
          <circle class="gr-core" r="76"/>
          <text class="gr-c1" y="-14" text-anchor="middle">学到</text><text class="gr-c2" y="12" text-anchor="middle">自己想学的</text><text class="gr-c1" y="40" text-anchor="middle">东西</text>
        </svg><figcaption class="mono">N 选课前 · E 学习中 · S 朋辈问诊 · W 课后 &nbsp;/&nbsp; 环的大小是结构示意，不代表数据</figcaption></figure>
        <div class="gr-side">${win('RING_READOUT.exe', '研究中的三条线',
          `<div class="gr-tabs" role="tablist" aria-label="选择一条线">${RINGS.map((g, i) => `<button type="button" role="tab" data-ring="${g.id}" aria-selected="${i === 0}"><b>${g.n}</b><span>${g.name}</span><small>${g.en}</small></button>`).join('')}</div><div class="gr-read" aria-live="polite"></div>`)}
          <p class="gr-hint mono">点环，或在右侧选一条线，指针会转向它对应的服务触点。</p></div>
      </div>`;
    },
    init(el) {
      const svg = $('svg', el), needle = $('[data-needle]', el), tip = $('.tip', needle), read = $('.gr-read', el), tabs = $$('.gr-tabs button', el);
      /* fit the text of each ring to its circumference by scaling the font */
      RINGS.forEach(g => {
        const t = $(`.gr-ring[data-ring=${g.id}] .gr-txt`, svg), tp = $('textPath', t), circ = 2 * Math.PI * g.r;
        let len = 0; try { len = t.getComputedTextLength(); } catch (_) { }
        if (!len || !isFinite(len)) len = g.unit.length * 16 * .95;
        const k = Math.max(1, Math.round(circ / len)), fs = Math.max(11, Math.min(21, 16 * circ / (k * len)));
        tp.textContent = g.unit.repeat(k); t.setAttribute('font-size', fs.toFixed(2));
      });
      const draw = id => {
        const g = RINGS.find(x => x.id === id) || RINGS[0];
        svg.dataset.sel = g.id;
        needle.style.transform = `rotate(${g.ang}deg)`;
        tip.setAttribute('cy', -(g.r + 8));
        tabs.forEach(b => b.setAttribute('aria-selected', b.dataset.ring === g.id));
        read.innerHTML = `<p class="gr-n mono">RING ${g.n} / 03</p><h4>${g.name}</h4><p class="gr-f">${g.find}</p><dl><dt>对应触点</dt><dd>${g.touch.map(t => `<span class="chip">${t}</span>`).join('')}</dd><dt>落在旅程</dt><dd>${g.where}</dd></dl><a class="gr-go" href="${g.go}">看这一段旅程 →</a>`;
      };
      tabs.forEach(b => b.addEventListener('click', () => draw(b.dataset.ring)));
      $$('.gr-ring', svg).forEach(r => r.addEventListener('click', () => draw(r.dataset.ring)));
      draw('know');
    }
  };

  /* ============================================================
     02 · RESEARCH PIPELINE (a loading bar, ref 526)
     ============================================================ */
  const PIPE = [
    ['RAW', '问卷与访谈', '29 份团队问卷、4 份访谈材料。问题围绕选课判断、探索机会和学习中的压力展开。', '#question', '回到这一段'],
    ['CODING', '归纳三条线', '从问卷和访谈里归纳出课程认知、兴趣探索、学习压力三条线，作为后面所有设计的出发点。', '#question', '看三条线'],
    ['PERSONAS', '综合四类画像', '按需求差异归纳出四类学生，用来讨论方案；画像不对应具体参与者，也不表示人数占比。', '#research', '看画像和断点'],
    ['JOURNEY', '画两条旅程', '选课和完成作业各分五个阶段，记录学生行动、服务触点、后台资源和目标体验。', '#journey', '看旅程'],
    ['BLUEPRINT', '蓝图与系统图', '前台触点和后台责任分层画出；课前、课中两张系统图标出教学支持里各方的关系。', '#service', '看蓝图'],
    ['FILM', '故事板与影片', '用概念故事板和十秒影片说明服务发生的情境。', '#film', '看影片']
  ];
  M['growth-compass-method'] = {
    html: () => win('RESEARCH_PIPELINE.exe', '从材料到服务概念', `
      <div class="gp"><p class="gp-load mono"><span>DATA LOADING</span><b data-pct>17%</b></p>
        <div class="gp-bar" role="tablist" aria-label="研究路径">${PIPE.map((p, i) => `<button type="button" role="tab" data-i="${i}" aria-selected="${i === 0}"><b>${String(i + 1).padStart(2, '0')}</b><span>${p[1]}</span><small>${p[0]}</small></button>`).join('')}</div>
        <div class="gp-read" aria-live="polite"></div></div>`),
    init(el) {
      const bs = $$('.gp-bar button', el), read = $('.gp-read', el), pct = $('[data-pct]', el), bar = $('.gp-bar', el);
      const draw = i => {
        bs.forEach((b, k) => { b.setAttribute('aria-selected', k === i); b.classList.toggle('done', k <= i); });
        const p = PIPE[i]; pct.textContent = Math.round((i + 1) / PIPE.length * 100) + '%'; bar.style.setProperty('--p', (i + 1) / PIPE.length);
        read.innerHTML = `<p class="mono">STEP ${String(i + 1).padStart(2, '0')} · ${p[0]}</p><h4>${p[1]}</h4><p>${p[2]}</p><a href="${p[3]}">${p[4]} →</a>`;
      };
      bs.forEach((b, i) => b.addEventListener('click', () => draw(i)));
      draw(0);
    }
  };

  /* ============================================================
     03 · PERSONAS — four note windows with a small pictogram
     ============================================================ */
  const PERSONAS = [
    ['焦虑努力型', '愿意投入，但对任务要求缺少把握，反复确认老师的要求。', '课程能力说明、任务支架与正反案例。',
      '<circle cx="32" cy="32" r="9"/><circle cx="32" cy="32" r="17"/><circle cx="32" cy="32" r="25"/><path d="M32 3v7M32 54v7M3 32h7M54 32h7M12 12l5 5M47 47l5 5M52 12l-5 5M17 47l-5 5"/>'],
    ['积极探索型', '希望跨领域尝试，但课程入口分散，试错要自己找路。', '课程星图、体验入口与课程组合调整。',
      '<ellipse cx="32" cy="32" rx="26" ry="11" transform="rotate(-28 32 32)"/><ellipse cx="32" cy="32" rx="26" ry="11" transform="rotate(32 32 32)"/><circle class="f" cx="9" cy="42" r="4"/><circle class="f" cx="50" cy="14" r="4"/><circle class="f" cx="55" cy="46" r="4"/><circle class="f" cx="32" cy="32" r="3"/>'],
    ['受挫明确型', '目标明确，担心选到和目标不匹配的课，投入的时间帮不上忙。', '能力目标、往届案例与低成本试听。',
      '<circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="9"/><path d="M32 4v14M32 46v14M4 32h14M46 32h14"/><path class="f" d="M50 14L38 26M38 26l1-7M38 26l7 1"/>'],
    ['被动适应型', '主要回应学分和截止日期，学习目标还不清楚。', '兴趣探索、学习目标说明与成长档案。',
      '<path d="M4 38H60" stroke-dasharray="3 5"/><path d="M4 38c8 0 8-14 16-14s8 14 16 14 8-14 16-14 4 8 8 8"/><circle class="f" cx="10" cy="38" r="4"/>']
  ];
  M['growth-compass-personas'] = {
    html: () => win('PERSONA_NOTES.exe', '四类画像：需求不同，投入相近', `<div class="gn">${PERSONAS.map(([n, p, d, ic], i) => `<article class="gn-c c${i}"><i class="tape" aria-hidden="true"></i><header class="gn-h"><span class="mono">NOTE ${String(i + 1).padStart(2, '0')}</span><svg viewBox="0 0 64 64" aria-hidden="true">${ic}</svg></header><h4>${n}</h4><p>${p}</p><dl><dt>方案回应</dt><dd>${d}</dd></dl></article>`).join('')}</div><p class="gw-foot mono">研究归纳 · 图形为示意，不表示人数或占比</p>`, 'wide')
  };

  /* ============================================================
     04 · TOUCHPOINTS — three storyboard windows
     ============================================================ */
  const TOUCH = [
    ['课程预览与试听', '课程目标、能力指向、案例与体验入口。', '教师准备课程资料；教务安排试听及调整窗口。', 'growth-tasting-original'],
    ['作业逻辑画布', '目标、证据、策略与步骤需要被写清楚。', '教师维护任务书与案例；学生据此整理问题。', 'growth-canvas-original'],
    ['朋辈支持与人工讨论', '预审检查基础要求，复杂问题交给人讨论。', '预审规则与行业参考属于概念；教师和朋辈保留判断责任。', 'growth-clinic-original']
  ];
  M['growth-compass-touchpoints'] = {
    html: () => `<div class="gt">${TOUCH.map(([h, f, b, img], i) => win(`TOUCHPOINT_0${i + 1}`, h, `<figure><img src="assets/${img}.webp" alt="${e(h)}概念故事板" loading="lazy"/><figcaption class="mono">情境 ${String(i + 1).padStart(2, '0')}</figcaption></figure><p class="gt-f">${f}</p><dl><dt>后台责任</dt><dd>${b}</dd></dl>`, `gt-w w${i}`)).join('')}</div>`
  };

  /* ============================================================
     05 · SERVICE BLUEPRINT — 3 stages × (action / front / line / back)
     ============================================================ */
  const BP = [
    { k: '课前 / 选择', en: 'BEFORE', act: '看预览、去试听、翻往届案例，弄清课程目标；选错了还能改。', front: ['课程预览', '模块试听', '选择调整'], back: ['教师提供课程目标和案例', '教务开放预览和改选窗口'] },
    { k: '课中 / 支持', en: 'DURING', act: '把问题说清楚，拿到能照着做的反馈。', front: ['作业逻辑画布', '朋辈问诊', '正反案例库'], back: ['整理案例资源', '安排谁来帮'] },
    { k: '课后 / 延续', en: 'AFTER', act: '整理作品档案，回顾这门课，下次选课接着自己的兴趣往前走。', front: ['作品档案', '课程回顾', '经验交流'], back: ['共同维护课程经验', '保存作品材料'] }
  ];
  M['growth-compass-blueprint'] = {
    html: () => win('SERVICE_BLUEPRINT.exe', '服务蓝图：课前、课中、课后', `
      <div class="gb" data-sel="0"><div class="gb-tabs" role="tablist" aria-label="选择阶段">${BP.map((b, i) => `<button type="button" role="tab" data-i="${i}" aria-selected="${i === 0}"><b>${String(i + 1).padStart(2, '0')}</b>${b.k}<small>${b.en}</small></button>`).join('')}</div>
        <div class="gb-grid">
          <p class="gb-r mono r0">学生行动</p>${BP.map((b, i) => `<div class="gb-c c${i}" data-i="${i}"><p>${b.act}</p></div>`).join('')}
          <p class="gb-r mono r1">前台触点</p>${BP.map((b, i) => `<div class="gb-c c${i} f" data-i="${i}"><ul>${b.front.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}
          <p class="gb-line mono"><span>LINE OF VISIBILITY · 可见线</span></p>
          <p class="gb-r mono r2">后台支持</p>${BP.map((b, i) => `<div class="gb-c c${i} b" data-i="${i}"><ul>${b.back.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}
        </div></div>
      <p class="gw-foot mono">依据课前、课中、课后的服务设计重绘 · 点阶段名可高亮一列</p>`, 'wide'),
    init(el) {
      const g = $('.gb', el), bs = $$('.gb-tabs button', el);
      const sel = i => { g.dataset.sel = i; bs.forEach((b, k) => b.setAttribute('aria-selected', k === i)); };
      bs.forEach((b, i) => b.addEventListener('click', () => sel(i)));
      $$('.gb-c', el).forEach(c => c.addEventListener('click', () => sel(+c.dataset.i)));
    }
  };

  /* ============================================================
     06 · D-SCAFFOLD — slider takes the scaffold down as the course ends
     ============================================================ */
  M['growth-compass-scaffold'] = {
    html: () => win('D-SCAFFOLD.exe', '动态设计支架：随课程推进逐步撤掉', `
      <div class="gs"><svg viewBox="0 -30 600 360" role="img" aria-label="一栋随课程推进升高的楼和围着它的脚手架，进度越大，脚手架越淡">
        <path class="gs-ground" d="M20 296H580"/>
        <g class="gs-house">${[0, 1, 2, 3, 4].map(i => `<rect data-f="${i}" x="226" y="${246 - i * 50}" width="148" height="48"/>`).join('')}<g class="gs-win">${[0, 1, 2, 3, 4].map(i => `<path data-f="${i}" d="M246 ${266 - i * 50}h22v14h-22zM285 ${266 - i * 50}h30v14h-30zM332 ${266 - i * 50}h22v14h-22z"/>`).join('')}</g></g>
        <g class="gs-sc s1"><path d="M186 296V40M206 296V40M186 90H206M186 140H206M186 190H206M186 240H206"/><path d="M186 296L206 240M186 240L206 190M186 190L206 140M186 140L206 90M186 90L206 40"/></g>
        <g class="gs-sc s2"><path d="M394 296V40M414 296V40M394 90H414M394 140H414M394 190H414M394 240H414"/><path d="M414 296L394 240M414 240L394 190M414 190L394 140M414 140L394 90M414 90L394 40"/></g>
        <g class="gs-sc s3"><path d="M186 40H414M186 40L300 296L414 40" stroke-dasharray="5 5"/></g>
        <g class="gs-lbl s1"><path d="M186 120H96"/><text x="20" y="116">模板</text><text x="20" y="134" class="sm">作业逻辑画布</text></g>
        <g class="gs-lbl s2"><path d="M414 120H504"/><text x="510" y="116">监理</text><text x="510" y="134" class="sm">朋辈导师 Agent</text></g>
        <g class="gs-lbl s3"><path d="M300 40V14"/><text x="300" y="4" text-anchor="middle">图纸规范 · 企业标准</text></g>
      </svg>
      <div class="gs-ctl"><div class="gs-btns" role="group" aria-label="课程阶段"><button type="button" data-p="0">开课</button><button type="button" data-p="50">中段</button><button type="button" data-p="100">结课</button></div>
        <label class="gs-sl"><span class="mono">课程进度 <b data-v>0%</b></span><input type="range" min="0" max="100" value="0" aria-label="课程进度"></label>
        <p class="gs-read" aria-live="polite"></p></div></div>
      <p class="gw-foot mono">概念示意 · 位置和浓淡不编码测量数据</p>`),
    init(el) {
      const rng = $('input', el), v = $('[data-v]', el), read = $('.gs-read', el), svg = $('svg', el), fl = $$('.gs-house rect', svg), wn = $$('.gs-win path', svg);
      const set = p => {
        p = Math.max(0, Math.min(100, p)); rng.value = p; v.textContent = p + '%';
        const t = p / 100, fade = 1 - Math.max(0, Math.min(1, (t - .45) / .45));
        svg.style.setProperty('--sc', fade.toFixed(3));
        const up = t * 5; fl.forEach((r, i) => { const k = Math.max(0, Math.min(1, up - i)); r.style.opacity = k ? 1 : .12; r.style.transform = `scaleY(${(0.06 + .94 * k).toFixed(3)})`; });
        wn.forEach((w, i) => { w.style.opacity = up - i > .9 ? 1 : 0; });
        read.textContent = t < .34 ? '开课：模板、监理和图纸规范都在场。' : t < .75 ? '中段：支撑逐步撤出，更多判断由学生自己作出。' : '结课：脚手架拆除，作业由学生独立完成。';
        $$('.gs-btns button', el).forEach(b => b.setAttribute('aria-pressed', Math.abs(+b.dataset.p - p) < 8));
      };
      rng.addEventListener('input', () => set(+rng.value));
      $$('.gs-btns button', el).forEach(b => b.addEventListener('click', () => set(+b.dataset.p)));
      set(0);
    }
  };

  /* ============================================================
     07 · JOURNEYS — two tracks of five stages
     ============================================================ */
  const JOURNEYS = {
    course: [['探索兴趣', '进入选课平台，完成兴趣探索。', '手机 H5 · 设计 DNA · 探索潜力图', '学生会 / 行政教师 / 校友职业资料', '焦虑 → 好奇'], ['预见课程', '观看 60 秒预告，查看案例和评价，建立试听清单。', '课程星图 · WHY FIRST 预告 · 企业认证', '教师录制预告 / 学生评价 / 企业参考', '纠结 → 有期待'], ['低成本试听', '开放周完成小任务，体验约五分钟的练习。', '开放教室 · 微体验环节', '教务开放试听 / 教师设计微体验', '兴奋 · 审视'], ['调整并承诺', '检查冲突与时间投入，确认最终课表。', '选课调整 · 智能换留推荐', '技术团队 / 学院教务 · Plan B', '笃定 · 确认'], ['成长留存', '回顾课程能力路径，记录学习节点。', '能力星图 · 成长节点', '平台维护 / 学习档案', '充实 · 回顾']],
    learn: [['理解任务', '阅读任务目标、约束和评价尺度。', '任务书 · 行业标准 · 课程平台', '课程教师 / 企业校友', '困惑 · 找入口'], ['强制支架', '填写目标、痛点、核心策略，对照案例自查。', '正反案例 · 设计逻辑画布', '技术团队 / 教务 / 案例库', '受阻 → 有结构'], ['即时预审', '上传草稿，检查对齐与信息完整性，修改基础问题。', '线上朋辈导师 Agent（概念）', '预审规则 / 案例', '确认 · 初步安心'], ['深入诊断', '带着教师建议继续迭代，对照行业参考讨论逻辑。', '课程汇报 · Agent 深度交流（概念）', '老师 / 朋辈导师 Agent', '挑战 · 深入交流'], ['自信交付', '提交作品、参与讲评，记录技能与成果。', '结课成果 · 展示 · 作品档案', '教师 / 校友共同反馈', '完成 · 成就感']]
  };
  M['growth-compass-journeys'] = {
    html: () => win('JOURNEY_MAP.exe', '课程选择与作业学习', `
      <div class="gj"><div class="gj-sw" role="tablist" aria-label="选择旅程"><button type="button" role="tab" data-j="course" aria-selected="true"><b>A</b>课外 · 选择课程</button><button type="button" role="tab" data-j="learn" aria-selected="false"><b>B</b>课中 · 完成作业</button></div>
        <ol class="gj-track" aria-label="五个阶段"></ol><div class="gj-read" aria-live="polite"></div></div>
      <p class="gw-foot mono">阶段间距相等，不代表耗时 · 情绪是目标体验 · ← → 键切换阶段</p>`, 'wide'),
    init(el) {
      let j = 'course', cur = 0;
      const track = $('.gj-track', el), read = $('.gj-read', el), sw = $$('.gj-sw button', el);
      const emo = s => { const m = s.split(/\s*→\s*/); return m.length > 1 ? `<span class="em">${m[0]}</span><i aria-hidden="true">→</i><span class="em on">${m[1]}</span>` : s.split(/\s*·\s*/).map(x => `<span class="em">${x}</span>`).join(''); };
      const draw = () => {
        const rows = JOURNEYS[j], r = rows[cur];
        el.dataset.j = j;
        track.innerHTML = rows.map((x, i) => `<li class="${i === cur ? 'on' : i < cur ? 'past' : ''}"><button type="button" data-i="${i}" aria-pressed="${i === cur}"><b>${String(i + 1).padStart(2, '0')}</b><span>${x[0]}</span></button></li>`).join('');
        read.innerHTML = `<div class="gj-h"><p class="mono">STAGE ${String(cur + 1).padStart(2, '0')} / 05</p><h4>${r[0]}</h4><p class="gj-e">${emo(r[4])}</p></div><dl>${['学生行动', '服务触点', '后台与资源'].map((k, i) => `<div><dt>${k}</dt><dd>${r[i + 1]}</dd></div>`).join('')}</dl>`;
        $$('button', track).forEach(b => b.addEventListener('click', () => { cur = +b.dataset.i; draw(); }));
      };
      sw.forEach(b => b.addEventListener('click', () => { j = b.dataset.j; cur = 0; sw.forEach(x => x.setAttribute('aria-selected', x === b)); draw(); }));
      el.addEventListener('keydown', ev => { if (ev.key === 'ArrowRight' && cur < 4) { cur++; draw(); $$('button', track)[cur].focus(); } if (ev.key === 'ArrowLeft' && cur > 0) { cur--; draw(); $$('button', track)[cur].focus(); } });
      draw();
    }
  };

  /* ============================================================
     08 · SERVICE SYSTEM — drawn forward from the two source diagrams.
     Coordinates are in the source image's 2000-wide frame so that every
     node, arrow, dash and badge sits where it does in the original.
     One row is one arrow: opposite directions are never merged,
     unlabelled lines stay unlabelled, glyphs (i $ □ m d a) are kept.
     ============================================================ */
  const SYS = {
    pre: {
      page: 'pre', name: '课前 · 选课与课程资源', vb: '90 4 1830 990', cx: 973, cy: 877, radii: [752, 572, 272],
      levels: [['Secondary Level', 247, 862], ['Primary Level', 433, 862], ['Central Level', 709, 864]],
      axes: [['Axis 2', 973, 126, 'm'], ['Axis 1', 411, 421, 'm'], ['Axis 3', 1511, 403, 'm']],
      icons: [['org', 973, 63, '学院内部', 1031, 62], ['tech', 380, 350, '技术与平台', 428, 342], ['soc', 1567, 350, '社会与行业资源', 1621, 356]],
      axis: ['M973 108V862', 'M412 382L533 487L665 615L962 868', 'M1535 386L1440 466M1405 500L985 860'],
      nodes: {
        admin: { n: '学院行政', x: 973, y: 158, c: 'red', l: [973, 197, 'middle'] },
        office: { n: '学院教务', x: 973, y: 270, c: 'gray', l: [969, 309, 'middle'] },
        ct: { n: '学院老师', x: 971, y: 412, c: 'gray', l: [996, 417, 'start'] },
        teacher: { n: '教课老师', x: 971, y: 605, c: 'red', ll: [['教课老师', 839, 585], ['(Faculty /', 839, 611], ['Teachers)', 839, 637]] },
        student: { n: '学生', x: 970, y: 876, c: 'red', l: [970, 917, 'middle'] },
        web: { n: '网站', x: 665, y: 615, c: 'gray', l: [606, 626, 'start'] },
        union: { n: '学生会', x: 533, y: 487, c: 'red', l: [531, 531, 'middle'] },
        alumni: { n: '名企校友', x: 1427, y: 481, c: 'dark', l: [1464, 544, 'middle'] }
      },
      people: [['t', 970, 530], ['a', 1421, 410], ['g', 972, 960]],
      edges: [
        ['union', 'admin', 'direct', '学生偏好 · 数据看板', [[542, 446], [608, 343], [767, 237], [931, 171]], [[608, 343, 'i']], [['学生偏好', 549, 321], ['数据看板', 549, 338]]],
        ['admin', 'union', 'direct', '内容需求 · 系统功能需求 · 支付资金；人力资源（如有困难）', [[942, 185], [760, 263], [682, 312], [620, 372], [550, 458]], [[682, 312, 'i'], [715, 289, 'm$'], [760, 263, 'sq']], [['内容需求', 658, 342], ['系统功能需求', 658, 359], ['支付资金', 658, 376], ['支付资金', 704, 316], ['人力资源', 758, 294], ['（如有困难）', 754, 311]]],
        ['admin', 'alumni', 'direct', '感谢资金 · 储备人才', [[1003, 158], [1110, 172], [1230, 226], [1281, 253], [1398, 364]], [[1230, 228, 'm$'], [1281, 253, 'sq']], [['感谢资金', 1198, 259], ['储备人才', 1266, 297]]],
        ['office', 'admin', 'direct', '选课逻辑', [[973, 252], [973, 214]], [[970, 232, 'i']], [['选课逻辑', 990, 238]]],
        ['web', 'office', 'direct', '学生选课信息', [[669, 588], [716, 429], [850, 304], [946, 279]], [[716, 430, 'i']], [['学生选课信息', 633, 462]]],
        ['office', 'web', 'direct', '学生学分认定', [[944, 293], [850, 330], [733, 457], [690, 540], [681, 598]], [[733, 457, 'i']], [['学生学分认定', 727, 497]]],
        ['teacher', 'admin', 'direct', '课程大纲、作业节奏 · 课程介绍 · 试课模块规划', [[944, 590], [886, 432], [900, 340], [935, 208]], [[886, 432, 'i']], [['课程大纲、作业节奏', 782, 427], ['课程介绍', 782, 444], ['试课模块规划', 782, 461]]],
        ['admin', 'teacher', 'direct', '设计前沿 · 反馈建议 · 校友资源', [[1014, 208], [1058, 333], [1065, 400], [1050, 500], [1003, 600]], [[1058, 333, 'i'], [1058, 386, 'sq']], [['设计前沿', 1076, 345], ['反馈建议', 1076, 362], ['校友资源', 1078, 397]]],
        ['union', 'web', 'direct', '开发维护', [[553, 505], [642, 594]], [], [['开发维护', 608, 548]]],
        ['union', 'student', 'direct', 'mentorship', [[525, 545], [560, 640], [595, 702], [617, 726], [700, 790], [800, 845], [897, 873]], [[595, 702, 'i'], [617, 726, 'sq']], [['mentorship', 574, 764]]],
        ['ct', 'student', 'direct', 'Mentorship', [[990, 421], [1040, 480], [1070, 560], [1072, 638], [1060, 689], [1030, 790], [992, 855]], [[1072, 638, 'i'], [1060, 690, 'sq']], [['Mentorship', 1078, 671]]],
        ['teacher', 'student', 'direct', '课程意义及总体气质 · 工作坊', [[971, 626], [970, 850]], [[968, 686, 'sq'], [968, 714, 'i']], [['课程意义及总体气', 879, 668], ['质工作坊', 879, 685]]],
        ['web', 'student', 'direct', '课程要点', [[682, 632], [770, 726], [801, 755], [850, 800], [928, 868]], [[770, 726, 'sq'], [801, 755, 'i']], [['课程要点', 760, 782]]],
        ['student', 'web', 'indirect', '学生使用行为数据 · 学生偏好数据 · 课程反馈', [[952, 858], [880, 780], [800, 700], [740, 655], [692, 626]], [[830, 748, 'i']], [['学生使用行为数据', 818, 731], ['学生偏好数据', 846, 748], ['课程反馈', 862, 765]], 'dot'],
        ['alumni', 'teacher', 'direct', '行业标准 · 专业建议 · 企业资源', [[1405, 485], [1306, 532], [1247, 556], [1130, 583], [1002, 603]], [[1306, 533, 'i'], [1247, 556, 'sq']], [['行业标准', 1263, 505], ['专业建议', 1263, 522], ['企业资源', 1209, 540]]],
        ['teacher', 'alumni', 'direct', '课程内容', [[1006, 618], [1140, 600], [1287, 565], [1410, 497]], [[1287, 565, 'i']], [['课程内容', 1268, 594]]]
      ]
    },
    learn: {
      page: 'learn', name: '课中 · 作业与支持', vb: '110 68 1810 880', cx: 1005, cy: 916, radii: [750, 565, 275],
      levels: [['Secondary Level', 434, 906], ['Primary Level', 576, 906], ['Central Level', 741, 906]],
      axes: [['Axis 2', 1005, 191, 'm'], ['Axis 1', 441, 461, 'm'], ['Axis 3', 1547, 443, 'm']],
      icons: [['org', 1005, 127, '学院内部', 1066, 124], ['tech', 372, 358, '技术与平台', 415, 295], ['soc', 1608, 358, '社会与行业资源', 1660, 392]],
      axis: ['M1005 172V900', 'M385 372L416 405L690 650L990 905', 'M1595 372L1462 507L1285 675L1018 905'],
      nodes: {
        college: { n: '学院', x: 1005, y: 296, c: 'gray', l: [1006, 345, 'middle'] },
        model: { n: 'AI 预审模型', x: 416, y: 405, c: 'gray', l: [385, 424, 'end'] },
        agent: { n: '朋辈导师 Agent', x: 821, y: 555, c: 'gray', ll: [['朋辈导师 Agent', 733, 512, 'agent']] },
        cases: { n: '正反面案例', x: 691, y: 650, c: 'gray', l: [646, 677, 'middle'] },
        teacher: { n: '老师', x: 1005, y: 643, c: 'gray', ll: [['老师 (Faculty / Teachers)', 1031, 638, 'big']] },
        data: { n: '作业数据', x: 820, y: 779, c: 'gray', l: [774, 860, 'middle'] },
        industry: { n: '设计方法论和真实行业标准', x: 1285, y: 675, c: 'gray', l: [1352, 726, 'middle'] },
        alumni: { n: '企业校友', x: 1462, y: 507, c: 'gray', l: [1517, 497, 'start'] },
        student: { n: '学生', x: 1004, y: 915, c: 'gray', l: [1004, 885, 'middle'] }
      },
      people: [['g3', 933, 535], ['ai', 722, 563], ['t', 1075, 700], ['a', 1417, 482], ['g', 858, 890]],
      edges: [
        ['cases', 'model', 'direct', '提供直接数据', [[669, 650], [544, 633], [461, 583], [428, 511], [417, 432]], [[464, 536, 'd']], [['提供直接数据', 517, 578, 42, 28]]],
        ['model', 'agent', 'indirect', '作为更亲近风格的语料支持', [[432, 418], [802, 548]], [], [['作为更亲近风格的语料支持', 616, 492, 19, 15]]],
        ['college', 'agent', 'direct', '给予平台支持', [[992, 370], [842, 538]], [[874, 472, 'm']], [['给予平台支持', 924, 413, -48, 26]]],
        ['college', 'alumni', 'direct', '场地、资金、政策支持', [[1028, 314], [1442, 497]], [[1234, 393, 'm']], [['场地、资金、政策支持', 1308, 427, 24, 15]]],
        ['teacher', 'college', 'direct', '1.设计技能树（关键节点+作业相关性） 2.将职业技能对标到章节 以此明确学校课程目标', [[1018, 632], [1070, 570], [1083, 450], [1062, 350], [1032, 302]], [[1202, 329, 'd']], [['1.设计技能树（关键节点+作业相关性）', 1068, 305, 0, 14.5, 'start'], ['2.将职业技能对标到章节', 1068, 321, 0, 14.5, 'start'], ['以此明确学校课程目标', 1068, 337, 0, 14.5, 'start']]],
        ['industry', 'agent', 'direct', '企业把尺子交给 Agent', [[1262, 664], [843, 558]], [[1074, 592, 'd']], [['企业把尺子交给Agent', 988, 578, 10, 14.5]]],
        ['teacher', 'agent', 'direct', '输入作业布置逻辑', [[988, 633], [840, 565]], [[948, 632, 'd']], [['输入作业布置逻辑', 897, 602, 24, 14.5]]],
        ['agent', 'cases', 'direct', '', [[800, 572], [714, 648]], [], []],
        ['teacher', 'cases', 'direct', '共同确定案例质量', [[986, 644], [714, 651]], [[759, 666, 'a']], [['共同确定案例质量', 768, 638, 0, 14.5]]],
        ['agent', 'data', 'indirect', '读取每个个体作业', [[820, 577], [820, 757]], [[801, 706, 'i']], [['读取每个个体作业', 822, 730, 0, 14.5]]],
        ['cases', 'data', 'indirect', '作为学生作业参考模板', [[695, 680], [797, 775]], [[674, 695, 'd']], [['作为学生作业参考模板', 738, 736, 42, 14.5, 'middle', 'mute']]],
        ['student', 'data', 'indirect', '需要更明确反馈', [[988, 900], [838, 794]], [[906, 835, 'i']], [['需要更明确反馈', 950, 873, 38, 14.5, 'middle', 'mute']]],
        ['agent', 'student', 'direct', '输出作业清晰要求 · “学长姐”用尺子帮学弟量作业', [[822, 576], [995, 897]], [[890, 673, 'a']], [['输出作业清晰要求', 886, 742, 62, 14.5], ['“学长姐”用尺子帮学弟量作业', 938, 746, 62, 14.5]]],
        ['teacher', 'student', 'indirect', '学生输出的作业基于老师建议 · 不断迭代强化深度学习', [[1015, 664], [1015, 890]], [[1045, 761, 'a']], [['学生输出的作业基于老师建议', 1066, 761, 0, 14.5, 'start'], ['不断迭代强化深度学习', 1066, 778, 0, 14.5, 'start']], 'dot'],
        ['student', 'teacher', 'indirect', '学生输出的作业基于老师建议 · 不断迭代强化深度学习', [[1031, 893], [1031, 672]], [], [], 'dot'],
        ['industry', 'alumni', 'direct', '作为亲历者参与课程实践', [[1290, 652], [1440, 517]], [[1296, 632, 'a']], [['作为亲历者参与课程实践', 1347, 574, -45, 13.5]]],
        ['alumni', 'industry', 'direct', '提供行业标准', [[1476, 527], [1303, 668]], [[1341, 645, 'i']], [['提供行业标准', 1378, 612, -45, 13.5]]],
        ['industry', 'teacher', 'direct', '作为课程对标依据', [[1262, 676], [1130, 665], [1027, 648]], [[1137, 674, 'd']], [['作为课程对标依据', 1154, 676, 8, 14.5, 'start']]]
      ]
    }
  };
  const spline = P => {
    if (P.length === 2) return `M${P[0][0]},${P[0][1]}L${P[1][0]},${P[1][1]}`;
    let d = `M${P[0][0]},${P[0][1]}`;
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2;
      d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0]},${p2[1]}`;
    }
    return d;
  };
  const midPt = P => { const n = P.length; return n % 2 ? P[(n - 1) / 2] : [(P[n / 2 - 1][0] + P[n / 2][0]) / 2, (P[n / 2 - 1][1] + P[n / 2][1]) / 2]; };
  const person = (t, x, y) => {
    const g = '#6fa88e';
    const one = (px, py, s, tie, lan) => `<g transform="translate(${px} ${py}) scale(${s})"><circle cy="-30" r="24" fill="${g}"/><path d="M-26 -4a26 26 0 0 1 52 0V40H-26Z" fill="${g}"/><path d="M-10 -34v8M10 -34v8" stroke="#fff" stroke-width="5" stroke-linecap="round"/>${tie ? '<path d="M0 -2l6 8-6 28-6-28Z" fill="#fff"/><path d="M-26 -2l26 10 26-10" stroke="#fff" stroke-width="3" fill="none"/>' : ''}${lan ? '<path d="M-12 -4L-8 24M12 -4L8 24" stroke="#fff" stroke-width="2"/><rect x="-9" y="22" width="18" height="20" rx="2" fill="#fff"/>' : ''}</g>`;
    if (t === 't') return `<g class="sy-p" transform="translate(${x} ${y})">${one(0, 0, .95, 1)}</g>`;
    if (t === 'a') return `<g class="sy-p" transform="translate(${x} ${y})">${one(0, 0, .8, 0, 1)}</g>`;
    if (t === 'g' || t === 'g3') return `<g class="sy-p" transform="translate(${x} ${y})">${one(-46, 6, .72)}${one(0, -8, .72)}${one(46, 6, .72)}</g>`;
    if (t === 'ai') return `<g class="sy-p" transform="translate(${x} ${y})"><rect x="-62" y="-52" width="124" height="104" rx="7" fill="${g}"/><text x="-26" y="18" font-size="50" font-weight="500" fill="#fff" font-family="Inter Tight,Archivo,sans-serif">AI</text><path d="M24 -26L32 24" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>`;
    return '';
  };
  const icon = (t, x, y) => {
    const base = `<circle cx="${x}" cy="${y}" r="46" fill="#ffc9c1" stroke="#cf8f89" stroke-width="2"/>`;
    if (t === 'org') return `<g class="sy-i">${base}<text x="${x}" y="${y + 14}" text-anchor="middle" font-size="42" font-weight="900" fill="#111" font-family="Archivo,Inter Tight,sans-serif" letter-spacing="-3">DXI</text><path d="M${x - 5} ${y - 18}l10 36M${x + 5} ${y - 18}l-10 36" stroke="#111" stroke-width="4" stroke-linecap="round"/></g>`;
    if (t === 'tech') return `<g class="sy-i">${base}<rect x="${x - 36}" y="${y - 34}" width="72" height="68" fill="#ff6f5c"/><path d="M${x - 30} ${y + 28}V${y - 26}M${x - 30} ${y + 14}H${x + 28}M${x - 24} ${y + 12}l14-26 8 14 16-20" stroke="#fff" stroke-width="2" fill="none" opacity=".85"/></g>`;
    return `<g class="sy-i">${base}<rect x="${x - 36}" y="${y - 24}" width="72" height="52" rx="3" fill="#ff6f5c"/><path d="M${x - 36} ${y - 24}h24l5 -9h35v9" fill="#ff6f5c"/>${[0, 1, 2, 3].map(k => `<rect x="${x - 29 + k * 16}" y="${y - 14}" width="11" height="9" fill="#fff"/>`).join('')}</g>`;
  };
  const glyph = (g, x, y) => `<g class="sy-b" transform="translate(${x} ${y})"><circle r="15"/>${g === 'sq' ? '<rect x="-6" y="-8" width="12" height="16" rx="2.5" fill="none" stroke="#fff" stroke-width="2.4"/><path d="M-3 -4V6" stroke="#fff" stroke-width="1.6"/>' : g === 'm$' ? '<text y="5.5" text-anchor="middle" font-size="16" font-weight="700">$</text>' : `<text y="5.5" text-anchor="middle" font-size="${g.length ? 16 : 16}" font-weight="700">${g}</text>`}</g>`;
  const GL = { i: '信息', 'm$': '资金', sq: '资源' };
  const systemSVG = S => {
    const nodes = S.nodes, id = S.page;
    const lv = S.radii.map((r, k) => `<path d="M${S.cx - r} ${S.cy}A${r} ${r} 0 0 1 ${S.cx + r} ${S.cy}Z" class="sy-lv l${k}"/>`).join('');
    const edges = S.edges.map(([a, b, kind, label, pts, badges, texts, style], i) => {
      const m = midPt(pts);
      const t = texts.map(([s, x, y, rot = 0, fs = 17, anchor = 'middle', tone]) => `<text class="sy-t${tone ? ' ' + tone : ''}" x="${x}" y="${y}" font-size="${fs}" text-anchor="${anchor}"${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''}>${e(s)}</text>`).join('');
      const bd = badges.map(([x, y, g]) => glyph(g, x, y)).join('');
      return `<g class="sy-e ${kind === 'indirect' ? 'ind' : 'dir'}${style ? ' ' + style : ''}" data-i="${i}" data-from="${a}" data-to="${b}"><path class="sy-hit" d="${spline(pts)}"/><path class="sy-l" d="${spline(pts)}"/>${t}${bd}<g class="sy-tag" transform="translate(${m[0].toFixed(0)} ${m[1].toFixed(0)})"><rect x="-17" y="-13" width="34" height="26" rx="4"/><text y="6" text-anchor="middle">${String(i + 1).padStart(2, '0')}</text></g></g>`;
    }).join('');
    const nd = Object.entries(nodes).map(([k, n]) => {
      const lab = n.ll ? n.ll.map(([s, x, y, cls]) => `<text class="sy-nl${cls ? ' ' + cls : ''}" x="${x}" y="${y}">${e(s)}</text>`).join('') : `<text class="sy-nl" x="${n.l[0]}" y="${n.l[1]}" text-anchor="${n.l[2]}">${e(n.n)}</text>`;
      return `<g class="sy-n" data-id="${k}" tabindex="0" role="button" aria-label="${e(n.n)}，查看相关关系"><circle class="c-${n.c}" cx="${n.x}" cy="${n.y}" r="${n.c === 'dark' ? 21 : 19}"/><circle class="sy-nh" cx="${n.x}" cy="${n.y}" r="34"/>${lab}</g>`;
    }).join('');
    const ic = S.icons.map(([t, x, y, label, lx, ly]) => `${icon(t, x, y)}<text class="sy-il" x="${lx}" y="${ly}">${label}</text>`).join('');
    const ax = S.axes.map(([t, x, y]) => `<text class="sy-ax" x="${x}" y="${y}" text-anchor="middle">${t}</text>`).join('');
    const lvl = S.levels.map(([t, x, y]) => `<text class="sy-lt" x="${x}" y="${y}" text-anchor="middle">${t}</text>`).join('');
    const x0 = 118, x1 = S.page === 'pre' ? 1862 : 1902;
    return `<svg viewBox="${S.vb}" role="img" aria-labelledby="sy-t-${id}"><title id="sy-t-${id}">${e(S.name)}服务系统图：${Object.keys(nodes).length} 个角色，${S.edges.length} 条有向关系</title>
      <defs><marker id="sy-ar-${id}" viewBox="0 0 24 24" refX="20" refY="12" markerWidth="24" markerHeight="24" markerUnits="userSpaceOnUse" orient="auto"><path d="M3 4L21 12L3 20" fill="none" stroke="#757575" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></marker>
      <marker id="sy-ah-${id}" viewBox="0 0 24 24" refX="20" refY="12" markerWidth="30" markerHeight="30" markerUnits="userSpaceOnUse" orient="auto"><path d="M3 4L21 12L3 20" fill="none" stroke="#1f3bff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>
      <g class="sy-levels">${lv}</g>
      <g class="sy-axis">${S.axis.map(d => `<path d="${d}"/>`).join('')}<path d="M${x0} ${S.cy}H${x1}"/><circle cx="${x0}" cy="${S.cy}" r="9"/><circle cx="${x1}" cy="${S.cy}" r="9"/></g>
      ${lvl}${ax}${ic}${S.people.map(([t, x, y]) => person(t, x, y)).join('')}
      <g class="sy-edges" style="--ar:url(#sy-ar-${id});--ah:url(#sy-ah-${id})">${edges}</g><g class="sy-nodes">${nd}</g></svg>`;
  };
  const SYS_STYLE = ''; // kept in growth-compass.css
  M['growth-compass-system'] = {
    html: () => win('SERVICE_SYSTEM_MAP.exe', '教学支持的有向关系', `
      <div class="sy" data-phase="pre">
        <div class="sy-top"><div class="sy-sw" role="tablist" aria-label="选择系统图"><button type="button" role="tab" data-p="pre" aria-selected="true"><b>A</b>课前 · 选课与课程资源</button><button type="button" role="tab" data-p="learn" aria-selected="false"><b>B</b>课中 · 作业与支持</button></div>
          <label class="sy-role">定位角色<select data-role><option value="all">全部角色</option></select></label>
          <button type="button" class="sy-num" aria-pressed="false">显示编号</button><button type="button" class="sy-zoom">放大查看 ⤢</button></div>
        <ul class="sy-leg" aria-label="图例"><li><i class="ln"></i>直接关系</li><li><i class="ln ds"></i>间接关系</li><li class="lg" data-pre><i class="bd">i</i>信息</li><li class="lg" data-pre><i class="bd">$</i>资金</li><li class="lg" data-pre><i class="bd sq"></i>资源</li><li class="lg" data-learn><i class="bd">m</i><i class="bd">d</i><i class="bd">a</i>标记类别，图中未给图例</li></ul>
        <div class="sy-fig"><button type="button" class="sy-x" aria-label="关闭放大">关闭 ✕</button><div class="sy-svg"></div><div class="sy-tip" role="status" hidden></div></div>
        <p class="sy-hint mono">图较宽，可左右滑动，或点“放大查看”。</p><p class="sy-status mono" aria-live="polite"></p>
        <div class="sy-deg" aria-label="各角色的关系数"></div>
        <ol class="sy-list"></ol>
      </div>
      <p class="gw-foot mono">依据课前、课中两张服务系统图重绘 · 点节点可定位角色 · 指到箭头或清单可高亮</p>`, 'wide sys'),
    init(el) {
      const root = $('.sy', el), svgBox = $('.sy-svg', el), list = $('.sy-list', el), status = $('.sy-status', el), role = $('[data-role]', el), tip = $('.sy-tip', el), fig = $('.sy-fig', el);
      let phase = 'pre', focus = 'all';
      const names = S => Object.fromEntries(Object.entries(S.nodes).map(([k, n]) => [k, n.n]));
      /* in / out degree of every role, counted from the edges drawn above; click a bar to focus that role */
      const renderDeg = (S, nm) => {
        const deg = Object.keys(S.nodes).map(k => ({ k, o: S.edges.filter(x => x[0] === k).length, i: S.edges.filter(x => x[1] === k).length })).filter(d => d.o + d.i).sort((a, b) => (b.o + b.i) - (a.o + a.i));
        const mx = Math.max(...deg.map(d => d.o + d.i)), top = deg.filter(d => d.o + d.i === mx);
        $('.sy-deg', el).innerHTML = `<p class="sd-h"><b>每个角色连着几条关系</b><span class="mono">深色 = 发出 · 浅色 = 收到 · 点一行只看这个角色</span></p><ol>${deg.map(d => `<li><button type="button" data-k="${d.k}" aria-pressed="${focus === d.k}"><span class="sd-n">${nm[d.k]}</span><span class="sd-b"><i class="o" style="width:${d.o / mx * 100}%"></i><i class="n" style="width:${d.i / mx * 100}%"></i></span><span class="sd-v mono">${d.o + d.i}<small>（发 ${d.o} · 收 ${d.i}）</small></span></button></li>`).join('')}</ol><p class="sd-c">关系最多的角色是${top.map(d => nm[d.k]).join('、')}，共 ${mx} 条；图中共 ${S.edges.length} 条箭头，每条箭头计入两个角色。</p>`;
        $$('.sy-deg button', el).forEach(b => b.addEventListener('click', () => { focus = focus === b.dataset.k ? 'all' : b.dataset.k; role.value = focus; apply(); }));
      };
      const apply = () => {
        const S = SYS[phase], nm = names(S);
        $$('.sy-e', svgBox).forEach(g => { const on = focus === 'all' || g.dataset.from === focus || g.dataset.to === focus; g.classList.toggle('dim', !on); });
        $$('.sy-n', svgBox).forEach(g => { const k = g.dataset.id, rel = focus === 'all' || k === focus || S.edges.some(x => (x[0] === focus && x[1] === k) || (x[1] === focus && x[0] === k)); g.classList.toggle('dim', !rel); g.classList.toggle('sel', k === focus); });
        const rows = S.edges.map((r, i) => ({ r, i })).filter(({ r }) => focus === 'all' || r[0] === focus || r[1] === focus);
        renderDeg(S, nm);
        status.textContent = `${S.name} · ${focus === 'all' ? `${S.edges.length} 条关系` : `${nm[focus]}相关 ${rows.length} / ${S.edges.length} 条关系`}`;
        list.innerHTML = rows.map(({ r, i }) => { const gl = [...new Set(r[5].map(b => b[2]))]; return `<li data-i="${i}" tabindex="0"><b>${String(i + 1).padStart(2, '0')}</b><div><strong>${nm[r[0]]} <i aria-hidden="true">${r[2] === 'direct' ? '→' : '⇢'}</i> ${nm[r[1]]}</strong><p>${r[3] ? e(r[3]) : '<em>图上没有文字标签</em>'}</p><small>${r[2] === 'direct' ? '直接关系' : '间接关系'}${gl.length ? ' · ' + gl.map(g => GL[g] ? GL[g] + ' ' + (g === 'm$' ? '$' : g === 'sq' ? '□' : g) : g).join(' / ') : ''}</small></div></li>`; }).join('');
      };
      const load = () => {
        const S = SYS[phase];
        root.dataset.phase = phase; svgBox.innerHTML = systemSVG(S); focus = 'all';
        role.innerHTML = '<option value="all">全部角色</option>' + Object.entries(S.nodes).map(([k, n]) => `<option value="${k}">${n.n}</option>`).join('');
        role.value = 'all'; apply(); bindFig();
      };
      const hot = (i, on) => { const g = $(`.sy-e[data-i="${i}"]`, svgBox); if (g) g.classList.toggle('on', on); const li = $(`.sy-list li[data-i="${i}"]`, el); if (li) li.classList.toggle('on', on); };
      const showTip = (i, ev) => {
        const S = SYS[phase], r = S.edges[i], nm = names(S), box = fig.getBoundingClientRect();
        tip.hidden = false; tip.innerHTML = `<b>${String(i + 1).padStart(2, '0')} · ${nm[r[0]]} ${r[2] === 'direct' ? '→' : '⇢'} ${nm[r[1]]}</b>${r[3] ? e(r[3]) : '图上没有文字标签'}`;
        const x = Math.min(Math.max(ev.clientX - box.left, 130), box.width - 130); tip.style.left = x + 'px'; tip.style.top = (ev.clientY - box.top) + 'px';
      };
      function bindFig() {
        $$('.sy-e', svgBox).forEach(g => {
          const i = +g.dataset.i;
          g.addEventListener('mouseenter', () => hot(i, true)); g.addEventListener('mouseleave', () => { hot(i, false); tip.hidden = true; });
          g.addEventListener('mousemove', ev => showTip(i, ev));
          g.addEventListener('click', () => { const li = $(`.sy-list li[data-i="${i}"]`, el); if (li) { li.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); li.classList.add('flash'); setTimeout(() => li.classList.remove('flash'), 1200); } });
        });
        $$('.sy-n', svgBox).forEach(g => {
          const pick = () => { focus = focus === g.dataset.id ? 'all' : g.dataset.id; role.value = focus; apply(); };
          g.addEventListener('click', pick); g.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); pick(); } });
        });
      }
      list.addEventListener('mouseover', ev => { const li = ev.target.closest('li'); if (li) hot(+li.dataset.i, true); });
      list.addEventListener('mouseout', ev => { const li = ev.target.closest('li'); if (li) hot(+li.dataset.i, false); });
      list.addEventListener('focusin', ev => { const li = ev.target.closest('li'); if (li) hot(+li.dataset.i, true); });
      list.addEventListener('focusout', ev => { const li = ev.target.closest('li'); if (li) hot(+li.dataset.i, false); });
      role.addEventListener('change', () => { focus = role.value; apply(); });
      const sw = $$('.sy-sw button', el);
      sw.forEach(b => b.addEventListener('click', () => { phase = b.dataset.p; sw.forEach(x => x.setAttribute('aria-selected', x === b)); load(); }));
      const zoom = on => { fig.classList.toggle('zoomed', on); document.documentElement.style.overflow = on ? 'hidden' : ''; if (on) $('.sy-x', fig).focus(); };
      $('.sy-zoom', el).addEventListener('click', () => zoom(true));
      const nb = $('.sy-num', el); nb.addEventListener('click', () => { const on = root.classList.toggle('num'); nb.setAttribute('aria-pressed', on); nb.textContent = on ? '隐藏编号' : '显示编号'; }); $('.sy-x', el).addEventListener('click', () => zoom(false));
      document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && fig.classList.contains('zoomed')) zoom(false); });
      load();
    }
  };

  /* ============================================================
     09 · CONCEPT FILM — video with a chapter bar that really seeks
     ============================================================ */
  const CH = [
    [0, 2.6, '选课前', 'AWAKEN · PREDICT · TRIAL · EXPERIENCE', '画面分成四格，角标依次是 Awaken、Predict、Trial、Experience：躺着刷手机、对着课程星图、在试听里体验。对应选课旅程的前三个阶段。', '选课旅程 01—03 · 探索兴趣、预见课程、低成本试听'],
    [2.6, 4.5, '收到提醒', 'NOTIFICATION', '手机里弹出一条通知，学生停下手里的事去看。选课和调整的节点就在这样的提醒里到来。', '选课旅程 04 · 调整并承诺'],
    [4.5, 5.9, '作业受阻', 'PITFALL DATABASE', '镜头切到另一个学生：对着电脑抱着头，旁边是写着“Pitfall Database”的列表，一排打叉的失败案例。', '作业旅程 01 · 理解任务（受阻时的状态）'],
    [5.9, 8.5, '自己整理', 'LOGIC CANVAS', '学生戴上耳机，在笔记本里打开文件夹，一步步整理自己的思路。画面角标是 Logic Canvas 和 Pitfall Database。', '作业旅程 02 · 强制支架（作业逻辑画布、正反案例）'],
    [8.5, 10.2, '反馈与修改', 'CONFIDENT REVISION', '四个小画面：反馈报告、语音留言、修改前后的对比和技能树，最后停在 Confident Revision。', '作业旅程 03—05 · 即时预审、深入诊断、自信交付']
  ];
  const tc = t => { t = Math.max(0, t); return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(Math.floor(t % 60)).padStart(2, '0') + '.' + String(Math.floor((t % 1) * 10)); };
  M['growth-compass-film'] = {
    html: () => `<div class="gf">
      <div class="gf-main">${win('CONCEPT_FILM.mp4', '服务概念影片 · 10 秒', `
        <div class="gf-screen"><video controls playsinline preload="metadata" poster="assets/growth-concept-poster.webp"><source src="media/growth-concept.mp4" type="video/mp4"></video></div>
        <div class="gf-bar" role="group" aria-label="影片章节，点击跳转">${CH.map((c, i) => `<button type="button" data-i="${i}" style="flex:${(c[1] - c[0]).toFixed(2)}" aria-pressed="${i === 0}"><b>${String(i + 1).padStart(2, '0')}</b><span>${c[2]}</span></button>`).join('')}<i class="gf-head" aria-hidden="true"></i></div>
        <p class="gf-time mono"><span data-now>00:00.0</span> / 00:10.2<button type="button" class="gf-one" aria-pressed="false">只播本章：关</button><a href="media/growth-concept.mp4" target="_blank" rel="noopener">独立窗口观看 ↗</a></p>`, 'gf-w')}</div>
      <aside class="gf-side">${win('CHAPTER.txt', '章节说明', '<div class="gf-read" aria-live="polite"></div>')}</aside>
      <ol class="gf-stills" aria-label="五个章节的画面">${CH.map((c, i) => `<li><button type="button" data-i="${i}" aria-label="跳到${c[2]}"><img src="assets/growth-compass/film-${i + 1}.jpg" alt="${c[2]}的画面" loading="lazy"><b class="mono">${String(i + 1).padStart(2, '0')} · ${tc(c[0])}</b><span>${c[2]}<small class="mono">${(c[1] - c[0]).toFixed(1)} 秒</small></span></button></li>`).join('')}</ol>
    </div>`,
    init(el) {
      const v = $('video', el), bs = $$('.gf-bar button', el), st = $$('.gf-stills button', el), read = $('.gf-read', el), head = $('.gf-head', el), now = $('[data-now]', el), bar = $('.gf-bar', el);
      const total = CH[CH.length - 1][1];
      let cur = -1;
      const show = i => {
        if (i === cur) return; cur = i; const c = CH[i];
        bs.forEach((b, k) => b.setAttribute('aria-pressed', k === i)); st.forEach((b, k) => b.classList.toggle('on', k === i));
        read.innerHTML = `<p class="mono">CHAPTER ${String(i + 1).padStart(2, '0')} / 05 · ${tc(c[0])}</p><h4>${c[2]}</h4><p class="gf-en mono">${c[3]}</p><p>${c[4]}</p><p class="gf-map"><span class="mono">对应旅程</span>${c[5]}<a href="#journey">看旅程 →</a></p><p class="gf-dur mono">${tc(c[0])} — ${tc(c[1])} · ${(c[1] - c[0]).toFixed(1)} 秒</p>`;
      };
      const at = t => { const k = CH.findIndex(c => t < c[1]); return k < 0 ? CH.length - 1 : k; };
      let one = false; const ob = $('.gf-one', el); ob.addEventListener('click', () => { one = !one; ob.setAttribute('aria-pressed', one); ob.textContent = '只播本章：' + (one ? '开' : '关'); });
      const sync = () => { const t = v.currentTime || 0; if (one && cur >= 0 && t >= CH[cur][1] - .03 && !v.paused) { v.pause(); v.currentTime = CH[cur][0] + .01; return; } head.style.left = (t / total * 100) + '%'; now.textContent = tc(t); show(at(t)); };
      const go = (i, play = true) => { try { v.currentTime = CH[i][0] + .01; } catch (_) { } sync(); if (play) v.play().catch(() => { }); };
      [...bs, ...st].forEach(b => b.addEventListener('click', () => go(+b.dataset.i)));
      v.addEventListener('timeupdate', sync); v.addEventListener('seeked', sync); v.addEventListener('loadedmetadata', sync);
      /* drag the bar to scrub */
      let drag = false;
      const scrub = ev => { const r = bar.getBoundingClientRect(), x = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)); v.currentTime = x * total; sync(); };
      bar.addEventListener('pointerdown', ev => { if (ev.target.closest('button') && ev.pointerType === 'mouse' && false) return; drag = false; bar._down = ev.clientX; });
      bar.addEventListener('pointermove', ev => { if (ev.buttons === 1 && bar._down != null && Math.abs(ev.clientX - bar._down) > 6) { drag = true; bar.setPointerCapture?.(ev.pointerId); scrub(ev); } });
      bar.addEventListener('pointerup', () => { bar._down = null; setTimeout(() => { drag = false; }, 0); });
      bar.addEventListener('click', ev => { if (drag) { ev.stopPropagation(); ev.preventDefault(); } }, true);
      show(0);
    }
  };
})();

/* ============================================================
   PAGE LAYOUT
   ============================================================ */
(() => {
  const PG = (window.PAGES = window.PAGES || {});
  const NUM = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧'];
  const ringStamp = (txt, id) => {
    const r = 74, circ = 2 * Math.PI * r, unit = txt.toUpperCase() + '  ·  ', est = unit.length * 11 * .62, k = Math.max(1, Math.round(circ / est));
    return `<svg class="gh-ring" viewBox="-100 -100 200 200" aria-hidden="true"><defs><path id="gh-p-${id}" d="M${-r} 0A${r} ${r} 0 1 1 ${r} 0A${r} ${r} 0 1 1 ${-r} 0"/></defs><circle r="${r - 12}" class="b"/><circle r="${r + 20}" class="b"/><text font-size="11" textLength="${circ.toFixed(0)}" lengthAdjust="spacing"><textPath href="#gh-p-${id}">${unit.repeat(k).replace(/&/g, '&amp;')}</textPath></text><path d="M0 -40V40M-40 0H40" class="x"/><circle r="4" class="d"/></svg>`;
  };

  PG['growth-compass'] = {
    /* ---------- title: ring dial behind the film frame ---------- */
    title(k) {
      const { p, s, esc } = k;
      return `<section class="c-pop" aria-labelledby="tc-name">
        <i class="cp-sun" aria-hidden="true"></i>
        <svg class="cp-rings" viewBox="-200 -200 400 400" aria-hidden="true"><circle r="196"/><circle r="150"/><circle r="104"/><path d="M-200 0H200M0-200V200"/></svg>
        <figure class="cp-img"><img src="assets/frames/growth-question-hd.webp" alt="概念影片截帧：学生戴着耳机，作业做到一半卡住了。" fetchpriority="high"><figcaption class="mono">${esc(s.keyCap)}</figcaption></figure>
        <h1 class="cp-word" id="tc-name"><span>成长</span><span>罗盘</span></h1>
        <p class="cp-en" aria-hidden="true">GROWTH<br>COMPASS</p>
        <p class="cp-sub">${esc(s.sub)}</p>
        <ul class="cp-tags">${['试听', '选择', '作业支架', '朋辈支持'].map((t, i) => `<li style="--i:${i}">${t}</li>`).join('')}</ul>
        <a class="cp-back mono" href="index.html#scene-${p.id}" data-cut="INDEX">← INDEX</a>
        <dl class="cp-meta">${(s.meta || []).map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>
      </section>`;
    },

    logline(k) {
      const { s, md, esc } = k, L = s.logline || {};
      return `<section class="c-sale" aria-label="项目摘要">
        ${[['問', L.q, 'PROBLEM'], ['做', L.a, 'MY PART'], ['果', L.r, 'RESULT']].map(([c, t, en], i) => `<div class="cs-b b${i}"><b class="cs-n" aria-hidden="true">${NUM[i]}</b><h3>${c}</h3><span class="cs-en mono" aria-hidden="true">${en}</span><p>${md(t)}</p></div>`).join('')}
        <ol class="cs-stats">${(s.stats || []).map(([v, l], i) => `<li><b class="cs-n" aria-hidden="true">${NUM[i + 3]}</b><strong>${esc(v)}</strong><span>${esc(l)}</span></li>`).join('')}</ol>
        <p class="cs-bound">研究分析与服务方案整理 · 团队：张安东、卞文璟、林惜予。</p>
      </section>`;
    },

    act(a, i, k) {
      const f = this['a_' + a.id], u = k.use(a);
      return f ? f.call(this, a, i, k, u) : u.rest();
    },

    head(a, i, k) {
      const { esc, md } = k;
      return `<header class="gh"><span class="gh-no" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${ringStamp(a.kicker, a.id)}<div class="gh-t"><p class="mono">${esc(a.kicker)}</p><h2>${md(a.title)}</h2><p class="gh-lead">${md(a.lead)}</p></div></header>`;
    },
    sub(o) { return `<h3 class="gs-h"><span>${o.sub}</span><i class="mono" aria-hidden="true">${o.en || ''}</i></h3>`; },

    a_question(a, i, k, u) {
      const { md } = k;
      return `${this.head(a, i, k)}
        <div class="gx gx-ring">${u.b(0)}</div>
        <div class="gx gx-bg">
          <div class="gx-t">${this.sub(u.o(1))}${[].concat(u.o(2).text).map(t => `<p>${md(t)}</p>`).join('')}</div>
          <aside class="gx-mine"><i class="tape" aria-hidden="true"></i><p class="mono">MY PART · 我的工作</p><ol>${(u.o(3).list || []).map((t, j) => `<li><b>${NUM[j]}</b>${md(t)}</li>`).join('')}</ol></aside>
        </div>
        <div class="gx gx-pipe">${this.sub(u.o(4))}${u.b(5)}</div>`;
    },

    a_research(a, i, k, u) {
      const { esc } = k;
      return `${this.head(a, i, k)}
        <div class="gx gx-per">${u.b(0)}</div>
        <div class="gx gx-gap">${this.sub(u.o(1))}<div class="ge">${(u.o(2).list || []).map(([h, t], j) => `<article class="ge-w w${j}"><header><i class="x" aria-hidden="true">✕</i><b>GAP_0${j + 1}</b><span>${esc(h)}</span></header><p>${esc(t)}</p></article>`).join('')}</div></div>`;
    },

    a_service(a, i, k, u) {
      const { md } = k;
      return `${this.head(a, i, k)}
        <div class="gx gx-tp">${u.b(0)}${u.b(1)}</div>
        <div class="gx gx-bp">${u.b(2)}</div>
        <div class="gx gx-sc"><div class="gx-t">${this.sub(u.o(3))}${[].concat(u.o(4).text).map(t => `<p>${md(t)}</p>`).join('')}</div><div class="gx-m">${u.b(5)}</div></div>`;
    },

    a_journey(a, i, k, u) { return `${this.head(a, i, k)}<div class="gx gx-jo">${u.b(0)}${u.b(1)}</div>`; },
    a_system(a, i, k, u) { return `${this.head(a, i, k)}<div class="gx gx-sy">${u.b(0)}${u.b(1)}</div>`; },
    a_film(a, i, k, u) { return `${this.head(a, i, k)}<div class="gx gx-fi">${u.b(0)}${u.b(1)}</div>`; }
  };
})();
