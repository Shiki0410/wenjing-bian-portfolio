/* TennisAtom · 身体的肖像。本页的版面、图表与交互全部在这里用代码绘制，没有贴原图。
   参考语法：D05 字压图（巨字压在人物之后）· D18 粒子人体 · D08 胶片条 · D04 断字；色板 navy / cobalt / sky / paper。
   只使用已公开的项目影片，不引用参与者原始视频。 */
(() => {
  const PG = (window.PAGES = window.PAGES || {});
  const E = t => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (r, s) => r.querySelector(s), $$ = (r, s) => [...r.querySelectorAll(s)];
  const num = n => String(n).padStart(2, '0');
  const img = s => 'assets/' + s + '.webp';
  const INIT = {};      // 交互组件：data-ta="name" → INIT[name](el)
  const CHART = {};     // 随宽度重绘的 SVG：data-chart="name" → CHART[name](W, el) => { H, g }
  const mountChart = (el, fn) => {
    let w = 0;
    const run = force => {
      const W = Math.round(el.clientWidth);
      if (!W || (!force && Math.abs(W - w) < 3)) return; w = W;
      const { H, g } = fn(W, el);
      el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="img" aria-label="' + E(el.dataset.label || '') + '">' + g + '</svg>';
      el.classList.add('ready');
      el.dispatchEvent(new CustomEvent('ta:drawn'));
    };
    el._redraw = run; run();
    if ('ResizeObserver' in window) new ResizeObserver(run).observe(el);
    return run;
  };
  const chart = (name, label, cls = '') => '<div class="ta-chart ' + cls + '" data-chart="' + name + '" data-label="' + E(label) + '"></div>';
  const plate = (code, title, body, cls = '', sub = '') =>
    '<section class="ta-plate rv ' + cls + '" data-noeva><header class="ta-ph"><span class="ta-pc mono">' + E(code) + '</span><h3>' + title + '</h3>' + (sub ? '<p>' + sub + '</p>' : '') + '</header>' + body + '</section>';
  const rng = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  // 小提示条：悬停或聚焦时显示
  const tipFor = (root, sel, render) => {
    const t = document.createElement('div'); t.className = 'ta-tip'; root.style.position = root.style.position || 'relative'; root.appendChild(t);
    const show = (n, x, y) => { t.innerHTML = render(n); t.style.left = x + 'px'; t.style.top = y + 'px'; t.classList.add('on'); };
    root.addEventListener('pointermove', e => { const n = e.target.closest(sel); if (!n) return t.classList.remove('on'); const r = root.getBoundingClientRect(); show(n, clamp(e.clientX - r.left, 100, r.width - 100), e.clientY - r.top); });
    root.addEventListener('pointerleave', () => t.classList.remove('on'));
    root.addEventListener('focusin', e => { const n = e.target.closest(sel); if (!n) return; const r = root.getBoundingClientRect(), q = n.getBoundingClientRect(); show(n, clamp(q.left - r.left + q.width / 2, 100, r.width - 100), q.top - r.top); });
    root.addEventListener('focusout', () => t.classList.remove('on'));
  };

  /* ============ 封面 · 巨字压在人物之后，人物由粒子组成，击球时粒子被甩开再收回 ============ */
  const cover = k => {
    const { p, s } = k;
    return '<section class="ta-cover" data-ta="cover" data-noeva aria-labelledby="ta-title">' +
      '<div class="ta-cv-grid" aria-hidden="true"></div>' +
      '<div class="ta-cv-band" aria-hidden="true"><i class="ta-cv-film"></i></div>' +
      '<div class="ta-cv-word" aria-hidden="true">TENNIS</div>' +
      '<div class="ta-cv-figbox" aria-hidden="true"><canvas class="ta-cv-fig"></canvas>' +
        '<svg class="ta-cv-fx" viewBox="0 0 614 1000" preserveAspectRatio="xMidYMid meet" fill="none" stroke-linecap="square">' +
          '<g class="fx-focus" stroke="#ecedef" stroke-width="3"><path d="M20 70V20H70M544 20H594V70M20 930V980H70M544 980H594V930"/></g>' +
          '<g class="fx-ring" stroke="#5aaeff" stroke-width="2"><ellipse cx="150" cy="352" rx="34" ry="26"/><ellipse cx="150" cy="352" rx="72" ry="54" opacity=".7"/><ellipse cx="150" cy="352" rx="118" ry="88" opacity=".45"/><ellipse cx="150" cy="352" rx="170" ry="124" opacity=".22"/></g>' +
          '<path class="fx-arc" d="M-230 560C-110 548 40 470 146 358" stroke="#ecedef" stroke-width="2" stroke-dasharray="3 9"/><circle cx="146" cy="358" r="6" fill="#d5f500" stroke="none"/>' +
          '<g font-family="JetBrains Mono,monospace" font-size="15" fill="#5aaeff" stroke="none" letter-spacing="2"><text x="76" y="46">FOCUSBOX</text><text x="150" y="444" text-anchor="middle">IMPACTRING</text><text x="594" y="972" text-anchor="end">33 LANDMARKS</text></g>' +
        '</svg></div></div>' +
      '<div class="ta-cv-atom" aria-hidden="true">ATOM</div><div class="ta-cv-vert mono" aria-hidden="true">THE BODY AS DATA PORTRAIT / 2026.06.03 / YANGPU</div>' +
      '<div class="ta-cv-top mono"><a href="index.html#scene-tennisatom" data-cut="INDEX">← INDEX</a><span>SC-' + E(p.number) + ' / 2026 / 阿里橙狮体育合作</span></div>' +
      '<div class="ta-cv-copy"><p class="ta-cv-kick mono">THE BODY AS DATA PORTRAIT</p><h1 id="ta-title"><span class="sr">TennisAtom · </span>身体的肖像</h1><p class="ta-cv-q">' + E(s.sub) + '</p>' +
        '<p class="ta-cv-hint mono"><i></i>移动指针，粒子会被拨开</p></div>' +
      '<div class="ta-cv-foot">' + s.stats.map(([a, b]) => '<div><b>' + E(a) + '</b><span>' + E(b) + '</span></div>').join('') + '</div></section>';
  };

  // 取真人成片截帧里的球员轮廓生成粒子（镜像后球员贴着右缘，球拍指向版心）
  INIT.cover = root => {
    const cv = $(root, '.ta-cv-fig'); if (!cv) return;
    const sec = cv.closest('.ta-cover'), ctx = cv.getContext('2d');
    const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const SW = 360, SH = 640, STEP = 3, CX = .72, CY0 = .34;
    const poly = [[0, .37], [.14, .365], [.20, .40], [.215, .49], [.30, .505], [.70, .50], [.71, .64], [.45, .65], [.36, .70], [.34, .80], [.41, 1], [0, 1]];
    const inside = (x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
    let P = null, W = 0, H = 0, dpr = 1, mx = -9999, my = -9999, burst = 0, raf = 0, on = true, last = 0;
    const im = new Image(); im.crossOrigin = 'anonymous';
    const resize = () => { const b = cv.getBoundingClientRect(); dpr = Math.min(2, devicePixelRatio || 1); W = Math.round(b.width * dpr); H = Math.round(b.height * dpr); cv.width = W; cv.height = H; };
    const COL = ['#ecedef', '#d6e4ff', '#8fc8ff'];
    const draw = () => {
      if (!P) return; ctx.clearRect(0, 0, W, H);
      for (let k = 0; k < 3; k++) {
        ctx.fillStyle = COL[k];
        for (let i = 0; i < P.n; i++) {
          if (P.kind[i] !== k) continue;
          const s = P.sz[i] * dpr * 2.2;
          ctx.fillRect(P.x[i] * W - s / 2, P.y[i] * H - s / 2, s, s);
        }
      }
    };
    const step = () => {
      const bx = mx / W, by = my / H, rr = (95 * dpr) / W;
      for (let i = 0; i < P.n; i++) {
        let ax = (P.hx[i] - P.x[i]) * .045, ay = (P.hy[i] - P.y[i]) * .045;
        if (mx > -999) {
          const dx = P.x[i] - bx, dy = (P.y[i] - by) * (H / W), d2 = dx * dx + dy * dy;
          if (d2 < rr * rr) { const d = Math.sqrt(d2) || 1e-3, f = (1 - d / rr) * .06; ax += dx / d * f; ay += dy / d * f * (W / H); }
        }
        P.vx[i] = (P.vx[i] + ax) * .88; P.vy[i] = (P.vy[i] + ay) * .88;
        P.x[i] += P.vx[i]; P.y[i] += P.vy[i];
      }
    };
    const fling = () => {   // 击球：球拍一侧的粒子向版心甩出，再被弹簧收回
      for (let i = 0; i < P.n; i++) {
        const a = clamp((.52 - P.hx[i]) / .4, 0, 1);
        if (a <= 0 && P.kind[i] !== 2) continue;
        const w = (P.kind[i] === 2 ? 1 : a * .5) * (.4 + P.ph[i]);
        P.vx[i] -= (.006 + .02 * w) * (.5 + P.ph[i]); P.vy[i] += (P.ph[i] - .6) * .012 * w;
      }
      sec.classList.add('hit'); setTimeout(() => sec.classList.remove('hit'), 700);
    };
    const loop = t => {
      raf = requestAnimationFrame(loop); if (!on) return;
      if (burst === 1) { burst = 0; fling(); }
      if (t - last > 4600) { last = t; fling(); }
      step(); draw();
    };
    im.onload = () => {
      const o = document.createElement('canvas'); o.width = SW; o.height = SH;
      const c = o.getContext('2d', { willReadFrequently: true });
      c.drawImage(im, 0, 0, SW, SH);
      let d; try { d = c.getImageData(0, 0, SW, SH).data; } catch (e) { sec.classList.add('no-fig'); return; }
      const hx = [], hy = [], kind = [], sz = [], r = rng(7);
      for (let y = 0; y < SH; y += STEP) for (let x = 0; x < SW; x += STEP) {
        const nx = x / SW, ny = y / SH; if (!inside(nx, ny)) continue;
        const i = (y * SW + x) * 4, R = d[i], G = d[i + 1], B = d[i + 2], L = (.2126 * R + .7152 * G + .0722 * B) / 255;
        const hair = R > G + 8 && G > B + 22 && L > .34, dark = L < .36;
        if (!dark && !hair) continue;
        const racket = nx > .38 && ny < .66 && ny > .49;
        const keep = hair ? .8 : racket ? .95 : clamp(1.05 - L * 1.5, .35, 1);
        if (r() > keep) continue;
        hx.push(1 - nx / CX + (r() - .5) * .004); hy.push((ny - CY0) / (1 - CY0) + (r() - .5) * .003); kind.push(hair ? 1 : racket ? 2 : 0); sz.push(r() < .12 ? 1.8 : 1);
      }
      // 甩出去的粒子：沿挥拍方向拖出一道尾迹
      for (let n = 0; n < 560; n++) { const t = r(); hx.push(clamp(.42 - t * .4 + (r() - .5) * .04, .01, .99)); hy.push(.33 + Math.sin(t * 2.4) * .09 * (1 - .4 * t) + (r() - .5) * .05); kind.push(2); sz.push(r() < .2 ? 1.6 : .8); }
      const n = hx.length;
      P = { n, hx: Float32Array.from(hx), hy: Float32Array.from(hy), x: Float32Array.from(hx), y: Float32Array.from(hy), vx: new Float32Array(n), vy: new Float32Array(n), kind: Uint8Array.from(kind), sz: Float32Array.from(sz), ph: Float32Array.from({ length: n }, () => r()) };
      resize(); draw(); sec.classList.add('has-fig');
      if (!reduce) { if (!raf) raf = requestAnimationFrame(loop); setTimeout(() => (burst = 1), 900); }
    };
    im.onerror = () => sec.classList.add('no-fig');
    im.src = img('tennis-real-9');
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { on = e.isIntersecting; }).observe(sec);
    sec.addEventListener('pointermove', e => { const b = cv.getBoundingClientRect(); mx = (e.clientX - b.left) * dpr; my = (e.clientY - b.top) * dpr; });
    sec.addEventListener('pointerleave', () => { mx = my = -9999; });
    sec.addEventListener('pointerdown', () => { if (P && !reduce) fling(); });
    if ('ResizeObserver' in window) new ResizeObserver(() => { resize(); draw(); }).observe(cv);
  };

  /* ============ 各幕的页头 ============ */
  const ahead = (a, i) => '<header class="ta-ah" data-noeva><span class="ta-ah-n" aria-hidden="true">' + num(i + 1) + '</span><div class="ta-ah-t"><p class="ta-ah-k mono">' + E(a.kicker) + '</p><h2>' + E(a.title).replace(/\n/g, '<br>') + '</h2></div><p class="ta-ah-l">' + E(a.lead) + '</p></header>';

  /* ============ 01 目标与背景 ============ */
  const gapArt = {
    cast: '<svg viewBox="0 0 320 190" role="img" aria-label="专业转播画面示意：球场透视、球轨与机位切换"><rect width="320" height="190" fill="#0a1240"/><path d="M60 40h200l50 100H10z" fill="#13235f"/><path d="M60 40 10 140M260 40l50 100M30 100h260M50 62h220M10 140h300" stroke="#ecedef" stroke-opacity=".75" stroke-width="1.2"/><path d="M60 40h200" stroke="#ecedef" stroke-width="2"/><path d="M96 126C130 40 210 24 262 86" stroke="#5aaeff" stroke-width="2.2" fill="none" stroke-dasharray="1 0"/><circle cx="262" cy="86" r="5" fill="#5aaeff"/><ellipse cx="262" cy="104" rx="20" ry="6" stroke="#5aaeff" fill="none"/><ellipse cx="262" cy="104" rx="34" ry="10" stroke="#5aaeff" stroke-opacity=".4" fill="none"/><rect x="10" y="10" width="86" height="34" fill="#ecedef" fill-opacity=".1" stroke="#ecedef" stroke-opacity=".5"/><path d="M18 20h52M18 28h36M18 36h60" stroke="#ecedef" stroke-opacity=".7"/><g transform="translate(150 160)"><rect width="50" height="24" fill="#1f3bff" stroke="#5aaeff"/><rect x="58" width="50" height="24" fill="none" stroke="#ecedef" stroke-opacity=".4"/><rect x="116" width="50" height="24" fill="none" stroke="#ecedef" stroke-opacity=".4"/></g><g fill="#ecedef" font-size="9" font-family="JetBrains Mono,monospace"><text x="152" y="154">CAM 1</text><text x="208" y="154" opacity=".5">CAM 2</text><text x="266" y="154" opacity=".5">CAM 3</text></g></svg>',
    phone: '<svg viewBox="0 0 150 230" role="img" aria-label="手机随手拍画面示意：画面倾斜、没有数据、无人观看"><rect x="6" y="4" width="138" height="222" rx="14" fill="#ecedef" stroke="#0d1020" stroke-width="2"/><g transform="rotate(-6 75 100)"><rect x="18" y="24" width="114" height="140" fill="#cfd4e6"/><path d="M18 120 132 92M18 148 132 120M40 164 62 24" stroke="#fff" stroke-width="1.4" stroke-opacity=".9"/><circle cx="84" cy="88" r="5" fill="#0d1020"/><path d="M84 93v22M84 100l-9 8M84 100l10 6M84 115l-7 16M84 115l8 16" stroke="#0d1020" stroke-width="2.2" fill="none"/></g><path d="M18 70h40M70 116h56M24 146h30" stroke="#0d1020" stroke-opacity=".55" stroke-width="3"/><rect x="26" y="34" width="52" height="22" fill="none" stroke="#0d1020" stroke-dasharray="3 3"/><text x="30" y="49" font-size="9" fill="#0d1020" font-family="JetBrains Mono,monospace">NO DATA</text><g transform="translate(20 188)"><path d="M0 8q10-12 20 0q-10 12-20 0z" fill="none" stroke="#0d1020" stroke-width="1.6"/><circle cx="10" cy="8" r="2.4" fill="#0d1020"/><text x="28" y="12" font-size="12" font-weight="700" fill="#0d1020" font-family="JetBrains Mono,monospace">0</text></g><rect x="52" y="214" width="46" height="3" rx="1.5" fill="#0d1020"/></svg>'
  };
  const gap = () => '<div class="ta-gap">' +
    '<article class="ta-gap-l"><span class="mono">BROADCAST</span><h4>专业转播的视觉语言</h4><div class="ta-gap-art">' + gapArt.cast + '</div><ul><li>多机位切换</li><li>Hawk-Eye 球轨</li><li>慢动作回放</li><li>数据面板</li></ul><em class="ta-gap-tag">昂贵 · 拿不到</em></article>' +
    '<div class="ta-gap-mid" aria-hidden="false"><svg viewBox="0 0 60 300" class="ta-gap-ar" aria-hidden="true"><path d="M2 150H24m-7-6 7 6-7 6M58 150H36m7-6-7 6 7 6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M30 0V120M30 180V300" stroke="currentColor" stroke-dasharray="3 5"/></svg><b>TA</b><p>业余球员在这里，没有一套属于自己的影像</p></div>' +
    '<article class="ta-gap-r"><span class="mono">PHONE</span><h4>手机随手拍的训练视频</h4><div class="ta-gap-art">' + gapArt.phone + '</div><ul><li>画面晃动</li><li>数据缺失</li><li>节奏拖沓</li><li>发了无人看</li></ul><em class="ta-gap-tag">廉价 · 没有质感</em></article></div>';

  const intents = [
    ['01', '训练记录', 'TRAINING LOG', '关心动作与变化，标注要能回到影像核查。', '动作 · 角度 · 前后对比', '教练、球员自己', '<svg viewBox="0 0 120 52"><path d="M2 40 22 32 42 36 62 22 82 26 102 10 118 14" stroke="currentColor" fill="none" stroke-width="2"/><g stroke="currentColor" stroke-opacity=".35"><path d="M2 48H118M2 48V6"/></g><g fill="currentColor"><circle cx="22" cy="32" r="2.5"/><circle cx="62" cy="22" r="2.5"/><circle cx="102" cy="10" r="2.5"/></g></svg>'],
    ['02', '竞技高光', 'MATCH HIGHLIGHT', '关心得分与强度，突出关键事件和运动瞬间。', '得分 · 球速 · 回合长度', '转播导演', '<svg viewBox="0 0 120 52"><path d="M2 46 36 46 48 6 60 46 118 46" stroke="currentColor" fill="none" stroke-width="2"/><path d="M48 6v40" stroke="currentColor" stroke-opacity=".3" stroke-dasharray="2 4"/><circle cx="48" cy="6" r="3.5" fill="currentColor"/></svg>'],
    ['03', '个人肖像', 'PERSONAL PORTRAIT', '关心自己的状态与经历，片段、语气和出口由球员参与决定。', '状态 · 气质 · 经历', '球员参与决定', '<svg viewBox="0 0 120 52"><g fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="60" cy="26" r="6" fill="currentColor"/><circle cx="60" cy="26" r="14"/><circle cx="60" cy="26" r="22" stroke-opacity=".6"/><circle cx="60" cy="26" r="30" stroke-opacity=".3"/></g></svg>']
  ];
  const intent = () => '<div class="ta-intent">' + intents.map(([n, h, en, p, f, w, art], i) => '<article class="' + (i === 2 ? 'on' : '') + '"><div class="ta-in-art">' + art + '</div><span class="mono">' + n + ' · ' + en + '</span><h4>' + h + '</h4><p>' + p + '</p><dl><div><dt>编辑重点</dt><dd>' + f + '</dd></div><div><dt>谁来决定</dt><dd>' + w + '</dd></div></dl></article>').join('') + '</div>';
  const facts = () => '<dl class="ta-facts"><div><dt>场景</dt><dd>乐动力杨浦体育活动中心</dd></div><div><dt>合作</dt><dd>橙狮体育</dd></div><div><dt>对象</dt><dd>业余网球爱好者</dd></div><div><dt>产出</dt><dd>真人定制成片 · 数据肖像 · 产品原型</dd></div></dl>';

  const ACT = {};
  ACT.context = (a, i) => ahead(a, i) + '<div class="ta-body">' +
    plate('TA-01 / GAP', '两套系统之间的缝', gap(), 'ta-p-gap', '专业转播有的东西，球员拿不到；手机拍得到的东西，缺少质感和数据。') +
    plate('TA-02 / INTENT', '影像为谁而剪', intent(), 'ta-p-intent', '同一段球场素材，观看目的不同，剪出来的成片也不同。这个项目面向第三种。') +
    '<div class="rv">' + facts() + '</div></div>';

  /* ============ 02 问题怎么得到 ============ */
  const register = [
    ['受访 1', '初学—中级', '记录为主，羞于公开发'],
    ['受访 2', '中级', '自己看为主，很少分享'],
    ['受访 3', '中级', '想展示「气质」，羡慕博主的呈现'],
    ['受访 4', '重度业余 · 约 2.5 级', '要进步混剪、教练报告与约球社交'],
    ['场馆方', '内部对话', '鹰眼精准但数据无法下载，特效单一']
  ];
  const tapes = () => '<ol class="ta-tapes">' + register.map(([id, lv, t], i) => '<li><span class="mono">TAPE ' + num(i + 1) + '</span><b>' + id + '</b><em>' + lv + '</em><p>' + t + '</p></li>').join('') + '</ol>';

  // 断字歌词：一句话拆成大小差九倍的几块，落在三分线上，点线牵着
  const FR = [
    ['太丑', 6, 14, 'g1', '受访 2'], ['大家实在', 7, 8, 'm'], ['很少分享', 31, 50, 'm'],
    ['不发', 53, 25, 'g2', '受访 3'], ['还没做到更满意的', 37, 9, 's'], ['视频内容就', 39, 16, 's'],
    ['删了', 8, 62, 'g3', '受访 4'], ['把小红书打球视频', 8, 87, 's'],
    ['气质', 68, 63, 'g1', '受访 3'], ['更多是一种', 68, 55, 's'], ['运动向上的', 83, 86, 's'], ['奔跑', 93, 8, 'v']
  ];
  const LN = [[16, 34, 33, 52], [55, 21, 48, 14], [14, 66, 25, 91], [75, 66, 86, 88]];
  const scatter = () => '<div class="ta-scatter" role="group" aria-label="受访者原话"><div class="ta-sc-stage"><svg class="ta-sc-ln" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + LN.map(l => '<path d="M' + l[0] + ' ' + l[1] + ' L' + l[2] + ' ' + l[3] + '" />').join('') + '</svg>' +
    FR.map(([t, x, y, c, who]) => '<span class="ta-fr ' + c + '" style="left:' + x + '%;top:' + y + '%;--x:' + x + '">' + E(t) + (who ? '<small class="mono">' + who + '</small>' : '') + '</span>').join('') +
    '</div></div>';

  const coding = () => {
    const rows = [
      [['受访 2 · 太丑，很少分享', '受访 3 · 不满意就不发'], '素材丑，没有调性', '缺乏个人视觉语言', 'LACK OF PERSONAL VISUAL LANGUAGE'],
      [['受访 4 · 要保留剪辑的乐趣', '场馆方 · 手动改了还不如手剪'], '自动化拿走叙事主权', '工具夺走主体感', 'TOOL STRIPS AGENCY'],
      [['受访 3 · 想展示气质', '受访 4 · 想被看成很坚持的人'], '身份认同诉求，与技术无关', '情感叙事 比 数据叙事 更重要', 'FEELING OVER READING · iBall, CHI 2023']
    ];
    return '<div class="ta-coding" data-ta="coding"><div class="ta-co-head mono"><span>RAW · 原话</span><span>CODE · 编码</span><span>THEME · 主题</span></div>' +
      rows.map(([raw, code, th, en], i) => '<div class="ta-co-row" data-row="' + i + '"><ul class="ta-co-raw">' + raw.map(r => '<li>' + E(r) + '</li>').join('') + '</ul><i class="ta-co-ln" aria-hidden="true"></i><button type="button" class="ta-co-code" aria-pressed="false"><b>' + E(code) + '</b></button><i class="ta-co-ln" aria-hidden="true"></i><div class="ta-co-theme"><b>' + E(th) + '</b><span class="mono">' + E(en) + '</span></div></div>').join('') +
      '<div class="ta-co-core mono" aria-hidden="true"><i></i>CORE INSIGHT</div></div>';
  };
  INIT.coding = el => {
    const rows = $$(el, '.ta-co-row');
    rows.forEach(r => { const b = $(r, '.ta-co-code'); const on = v => { rows.forEach(x => x.classList.toggle('dim', v && x !== r)); b.setAttribute('aria-pressed', v ? 'true' : 'false'); };
      r.addEventListener('mouseenter', () => on(true)); r.addEventListener('mouseleave', () => on(false)); b.addEventListener('focus', () => on(true)); b.addEventListener('blur', () => on(false)); b.addEventListener('click', () => on(!r.classList.contains('hl')) || r.classList.toggle('hl')); });
  };


  ACT.question = (a, i) => ahead(a, i) + '<div class="ta-body">' +
    plate('TA-03 / SAMPLE', '五段现场访谈', tapes(), 'ta-p-tapes', '2026 年 6 月 3 日，乐动力杨浦球馆。录音转写，主题编码。') +
    plate('TA-04 / VOICES', '原话里的第一条线索', scatter(), 'ta-p-voices', '原话断成大小不一的几块，说得最重的词放得最大。') +
    plate('TA-05 / CODING', '从原话到主题', coding(), 'ta-p-coding', '每条编码归入一个主题，三个主题指向同一个问题。') +
    plate('TA-06 / JOURNEY', '问题出在哪一步', reframe(), 'ta-p-reframe', '一位博主型受访者的旅程：情绪在剪辑处陡降，目标曲线从这里向上。') + '</div>';
  /* 用户旅程：现状（As-Is）与目标（To-Be）两条情绪曲线 */
  const JNY = {
    as: [['出发打球', '期待', 7], ['击球高光', '兴奋', 9], ['看素材', '落差', 4], ['尝试剪辑', '困惑', 3], ['放弃 / 将就', '挫败', 2], ['发出后', '失落', 3]],
    to: [['打完球', '', 7], ['发现瞬间', '', 8], ['选叙事风格', '', 8], ['特效生成', '', 9], ['发出去', '', 9], ['收到共鸣', '', 10]],
    qas: [[2, '跟上次没什么区别'], [3, '模板都是别人的审美'], [5, '跟别人内容没区别']],
    qto: [[3, '等等，这就是我！'], [5, '你打球好有氛围感']]
  };
  const smooth = (pts, move = true) => { // Catmull-Rom → cubic Bézier
    let d = move ? 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1) : 'L' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += 'C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ',' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ',' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    return d;
  };
  CHART.journey = (W, el) => {
    const mode = el.dataset.mode || 'as', narrow = W < 560, L = narrow ? 26 : 56, R = W - (narrow ? 26 : 56), T = 34, B = narrow ? 60 : 86, H = narrow ? 320 : 380, ch = H - T - B;
    const X = i => L + (R - L) * i / 5, Y = v => T + ch * (10 - v) / 10;
    const pts = k => JNY[k].map((s, i) => [X(i), Y(s[2])]);
    let g = '<g stroke="currentColor" stroke-opacity=".12">' + [0, 5, 10].map(v => '<path d="M' + L + ' ' + Y(v) + 'H' + R + '"/>').join('') + '</g>';
    g += '<g font-size="10.5" fill="currentColor" opacity=".55" font-family="JetBrains Mono,monospace"><text x="' + (L - 8) + '" y="' + (Y(10) + 4) + '" text-anchor="end">10</text><text x="' + (L - 8) + '" y="' + (Y(5) + 4) + '" text-anchor="end">5</text><text x="' + (L - 8) + '" y="' + (Y(0) + 4) + '" text-anchor="end">0</text></g>';
    g += '<g stroke="currentColor" stroke-opacity=".15" stroke-dasharray="2 5">' + JNY.as.map((s, i) => '<path d="M' + X(i) + ' ' + T + 'V' + (H - B + 16) + '"/>').join('') + '</g>';
    if (mode === 'both') g += '<path d="' + smooth(pts('to')) + smooth(pts('as').slice().reverse(), false) + 'Z" fill="#5aaeff" fill-opacity=".18"/>';
    const curve = (k, c, w) => '<path class="ta-draw" d="' + smooth(pts(k)) + '" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" style="--len:' + Math.round(W * 2.4) + '"/>';
    const dots = (k, c) => JNY[k].map((s, i) => { const x = X(i), y = Y(s[2]); return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (k === 'as' && i === 4 ? 9 : 6.5) + '" fill="' + c + '" stroke="#f8f9fb" stroke-width="2"/><text x="' + x.toFixed(1) + '" y="' + (y + (k === 'as' && mode === 'both' ? 24 : -14)).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="800" fill="' + c + '">' + (k === 'as' ? '↓' : '↑') + s[2] + '</text>'; }).join('');
    if (mode !== 'to') g += curve('as', '#0a1240', 3.6) + dots('as', '#0a1240');
    if (mode !== 'as') g += curve('to', '#1f3bff', 3.6) + dots('to', '#1f3bff');
    if (mode !== 'to') { const x = X(4), y = Y(2); g += '<circle cx="' + x + '" cy="' + y + '" r="16" fill="none" stroke="#0a1240" stroke-opacity=".5"/><circle cx="' + x + '" cy="' + y + '" r="24" fill="none" stroke="#0a1240" stroke-opacity=".22"/>'; }
    const nm = mode === 'to' ? JNY.to : JNY.as;
    g += nm.map((s, i) => {
      const x = X(i), a = i === 0 ? 'start' : i === 5 ? 'end' : 'middle', xx = i === 0 ? x - 8 : i === 5 ? x + 8 : x;
      return '<g text-anchor="' + a + '"><text x="' + xx + '" y="' + (H - B + 36) + '" font-size="' + (narrow ? 12 : 13) + '" font-weight="900" fill="#1f3bff">' + num(i + 1) + '</text>' + (narrow ? '' : '<text x="' + xx + '" y="' + (H - B + 58) + '" font-size="14" font-weight="800" fill="currentColor">' + s[0] + '</text>' + (s[1] ? '<text x="' + xx + '" y="' + (H - B + 77) + '" font-size="12" fill="currentColor" opacity=".6">' + s[1] + '</text>' : '')) + '</g>';
    }).join('');
    g += '<text x="' + L + '" y="' + (T - 14) + '" font-size="11" fill="currentColor" opacity=".55" font-family="JetBrains Mono,monospace">情绪打分 0–10 / 由访谈整理的旅程图</text>';
    return { H, g };
  };
  const journey = () => '<div class="ta-jny" data-ta="journey"><div class="ta-seg" role="group" aria-label="切换旅程曲线">' +
    [['as', '现状 AS-IS'], ['both', '叠加'], ['to', '目标 TO-BE']].map(([m, t], i) => '<button type="button" data-m="' + m + '" aria-pressed="' + (i === 0) + '">' + t + '</button>').join('') + '</div>' +
    chart('journey', '一位博主型球员的旅程：现状在剪辑处陡降，目标曲线一路向上') +
    '<ol class="ta-jny-names" aria-label="六个触点"></ol><ul class="ta-jny-q" aria-live="polite"></ul></div>';
  INIT.journey = el => {
    const ch = $(el, '.ta-chart'), q = $(el, '.ta-jny-q'), nm = $(el, '.ta-jny-names');
    const set = m => {
      ch.dataset.mode = m; ch._redraw && ch._redraw(true);
      $$(el, '.ta-seg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.m === m)));
      const src = m === 'to' ? JNY.to : JNY.as;
      nm.innerHTML = src.map((s, i) => '<li><b>' + num(i + 1) + '</b>' + E(s[0]) + (s[1] ? '<em>' + s[1] + ' ' + s[2] + '</em>' : '') + '</li>').join('');
      const as = JNY.qas.map(([i, t]) => ['AS-IS', JNY.as[i][0], t]), to = JNY.qto.map(([i, t]) => ['TO-BE', JNY.to[i][0], t]);
      const list = m === 'to' ? to : m === 'as' ? as : as.concat(to);
      q.innerHTML = list.map(([k, s, t]) => '<li class="' + (k === 'TO-BE' ? 'to' : 'as') + '"><span class="mono">' + k + ' / ' + E(s) + '</span><p>「' + E(t) + '」</p></li>').join('');
    };
    $$(el, '.ta-seg button').forEach(b => b.addEventListener('click', () => set(b.dataset.m)));
    set('as');
  };
  const reframe = () => '<div class="ta-reframe"><div class="ta-rf-txt"><article class="old"><span class="mono">起初的判断</span><h4>不分享，是不想被看见。</h4></article><article class="new"><span class="mono">访谈之后</span><h4>不分享，是成片拿不出手。</h4><p>受访的人想发，也想被看见。卡住的是素材变成成片的那一段：看素材时有落差，剪辑时找不到自己的审美，发出去的内容和别人没有区别。</p></article></div>' + journey() + '</div>';

  /* ============ 03 调研分析 ============ */
  const gens = () => '<div class="ta-gen-wrap"><div class="ta-gen-n"><b>126</b><span>篇 CHI / UIST / IEEE VIS / SportsHCI 论文</span></div><ol class="ta-gen">' + [
    ['GEN 1', '信息交付', '让数据被看见', 'iBall、VisCommentator、Sporthesia：嵌入式可视化、自然语言驱动的增强、视线调节。观众和分析师因此读得懂比赛。'],
    ['GEN 2', '个人信息学', '让运动者反思自己', 'SportsBuddy 等：运动员从边缘移到中心，多传感器数据生成个性化集锦，并在真实场景中部署。'],
    ['GEN 3', 'AI 中介的自我表征', '让数据成为审美表达', 'PicMe、Reimagining Personal Data、BeReal、Becoming My Own Audience：新手的障碍来自自我评判，技术本身反倒排在后面。'],
    ['AFTER', '生成之后', '敢不敢发出去？', '三代研究都停在生成与理解。做出来之后，业余者敢不敢把它给别人看，几乎没有人认真研究过。']
  ].map(([c, h, s, t], i) => '<li class="' + (i === 3 ? 'gap' : '') + '"><span class="mono">' + c + '</span><h4>' + h + '</h4><b>' + s + '</b><p>' + t + '</p></li>').join('') + '</ol></div>';

  const QUAD = [
    ['hawk', 'Hawk-Eye', 14, 17, '专业 · 分析', '球场鹰眼，精度很高。3D 模型无法下载，球员自己拿不到数据。'],
    ['f1', 'F1 式转播', 76, 16, '专业 · 表达', '转播级的数据叙事：球速不是角标数字，而是球后拖出的光轨。'],
    ['sv', 'SwingVision / SmartShot', 19, 68, '业余 · 分析', '业余球员用得上的分析工具：数据标注、球路和集锦，审美让位给精度。'],
    ['jy', '剪映模板', 78, 76, '业余 · 表达', '好上手，模板化。成片趋同，看不出是谁在打球。'],
    ['ta', 'TennisAtom', 63, 64, '本项目', '业余球员 × 审美表达：数据变成画面，成片由球员本人参与决定。']
  ];
  const PAPERS = [
    ['Sporthesia', 'TVCG 2022', '体育视频的增强可视化', '服务专业转播视角，球员自己的表达没有位置。'],
    ['iBall', 'CHI 2023', '球轨迹预测与分析', '偏篮球，停留在客观数据展示。'],
    ['SportsBuddy', 'arXiv 2025', '自动战术分析与回球剪辑', '面向教练复盘，大众的社交分享没有覆盖。']
  ];
  const quad = () => '<div class="ta-quadwrap"><div class="ta-quad" data-ta="quad" role="group" aria-label="学术与产业坐标"><i class="ta-q-h"></i><i class="ta-q-v"></i>' +
    '<span class="ta-q-ax t">专业级 ↑</span><span class="ta-q-ax b">↓ 业余级</span><span class="ta-q-ax l">← 分析工具</span><span class="ta-q-ax r">表达审美 →</span>' +
    QUAD.map(([id, n, x, y, z, t]) => '<button type="button" class="ta-q-pt ' + id + '" style="left:' + x + '%;top:' + y + '%" data-id="' + id + '" aria-label="' + E(n + '：' + t) + '"><i></i><b>' + E(n) + '</b></button>').join('') +
    '<div class="ta-q-note" aria-live="polite"><span class="mono">' + QUAD[4][4] + '</span><b>' + QUAD[4][1] + '</b><p>' + QUAD[4][5] + '</p></div></div>' +
    '<ol class="ta-papers">' + PAPERS.map(([n, v, c, l]) => '<li><span class="mono">' + v + '</span><b>' + n + '</b><p><em>做了</em>' + c + '</p><p><em>留下</em>' + l + '</p></li>').join('') + '</ol></div>';
  INIT.quad = el => {
    const note = $(el, '.ta-q-note');
    const show = id => { const q = QUAD.find(x => x[0] === id); $$(el, '.ta-q-pt').forEach(b => b.classList.toggle('on', b.dataset.id === id)); note.innerHTML = '<span class="mono">' + q[4] + '</span><b>' + q[1] + '</b><p>' + q[5] + '</p>'; };
    $$(el, '.ta-q-pt').forEach(b => { ['mouseenter', 'focus', 'click'].forEach(ev => b.addEventListener(ev, () => show(b.dataset.id))); });
    show('ta');
  };

  // 四类用户：四条轴上的位置
  const PERSONA = [
    ['老陈', '为自己 · 为记录', [.15, .20, .15, .10], '#8b91a5'],
    ['林夕', '为自己 · 为表达', [.30, .45, .49, .35], '#5aaeff'],
    ['小杨', '为社媒 · 为记录', [.60, .62, .71, .71], '#0a1240'],
    ['Vivian', '为社媒 · 为表达', [.85, .90, .92, .88], '#1f3bff']
  ];
  const AXES = [['为自己', '为社媒', '驱动力'], ['技术参数', '情感氛围', '侧重点'], ['记录归档', '审美表达', '数据态度'], ['内向防守', '主动连接', '社交模式']];
  CHART.persona = (W, el) => {
    const hi = el.dataset.hi || '', narrow = W < 560, L = narrow ? 8 : 84, R = W - (narrow ? 8 : 84), rowH = narrow ? 74 : 66, T = 20, H = T + 4 * rowH + 8;
    let g = '', lb = '';
    AXES.forEach(([a, b, h], r) => {
      const y = T + r * rowH + (narrow ? 34 : 24);
      g += '<path d="M' + L + ' ' + y + 'H' + R + '" stroke="currentColor" stroke-opacity=".25" stroke-width="1.5"/>';
      if (narrow) lb += '<text x="' + L + '" y="' + (y - 22) + '" font-size="11" font-weight="800" fill="#1f3bff">' + h + '</text><text x="' + L + '" y="' + (y + 22) + '" font-size="12" font-weight="700">' + a + '</text><text x="' + R + '" y="' + (y + 22) + '" font-size="12" font-weight="700" text-anchor="end">' + b + '</text>';
      else lb += '<text x="0" y="' + (y + 4) + '" font-size="13" font-weight="700">' + a + '</text><text x="' + W + '" y="' + (y + 4) + '" font-size="13" font-weight="700" text-anchor="end">' + b + '</text><text x="' + (W / 2) + '" y="' + (y - 14) + '" font-size="10.5" text-anchor="middle" opacity=".55" font-family="JetBrains Mono,monospace">' + h + '</text>';
    });
    PERSONA.forEach(([n, d, v, c]) => {
      const dim = hi && hi !== n, pts = v.map((t, r) => [lerp(L, R, t), T + r * rowH + (narrow ? 34 : 24)]);
      g += '<g class="ta-pl' + (dim ? ' dim' : '') + '" data-n="' + n + '"><path class="ta-draw" d="' + pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('') + '" fill="none" stroke="' + c + '" stroke-width="' + (hi === n ? 5 : 3.2) + '" stroke-linejoin="round" style="--len:' + (W * 3) + '"/>' + pts.map(p => '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1] + '" r="' + (hi === n ? 7 : 5.5) + '" fill="' + c + '"/>').join('') + '</g>';
    });
    return { H, g: g + lb };
  };
  const persona = () => '<div class="ta-persona" data-ta="persona">' + chart('persona', '四类用户在四条轴上的位置') + '<ul class="ta-pl-key">' + PERSONA.map(([n, d, v, c]) => '<li><button type="button" data-n="' + n + '" aria-pressed="false"><i style="background:' + c + '"></i><b>' + n + '</b><span>' + d + '</span></button></li>').join('') + '</ul><p class="ta-note">四类用户画像由访谈提炼，用于设计推演；每条线的位置是画像的定位，不是测得的分值。</p></div>';
  INIT.persona = el => {
    const ch = $(el, '.ta-chart');
    el.addEventListener('ta:drawn', () => {});
    $$(el, '.ta-pl-key button').forEach(b => b.addEventListener('click', () => {
      const on = b.getAttribute('aria-pressed') !== 'true';
      $$(el, '.ta-pl-key button').forEach(x => x.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', on ? 'true' : 'false'); ch.dataset.hi = on ? b.dataset.n : ''; ch._redraw && ch._redraw(true);
    }));
  };

  // 四段公开案例：逐镜头拆解 30 秒
  const CASES = [
    { k: 'A', name: 'SwingVision 官方高光', tag: '工具流标杆', feat: '单线叙事，数据叠加，剪辑节奏稳定。', total: 30,
      seg: [[0, 3, '全景球场，选手姓名水印浮入'], [3, 12, '一次回合（正常速度），球路追踪线与球速角标'], [12, 15, '慢动作回放（同一击球），落点标记'], [15, 25, '下一回合，同样的处理方式'], [25, 30, '数据统计卡片，App 水印']],
      ok: '信息完整、专业可信，生产线高度可重复。', no: '审美让位给精度，所有视频雷同，没有个人特色与情感共鸣。', use: '保留数据的可信度，但在审美决策上反向操作：用分镜跳跃代替线性叙事，让数据成为画面，不再只是角标。' },
    { k: 'B', name: 'Vivian 风 · 生活方式 vlog', tag: '氛围叙事', feat: '少量击球画面，大量氛围特写，文艺字幕。', total: 30,
      seg: [[0, 3, '球拍特写，阳光透过球网，标题「周末的球场」'], [3, 8, '自拍打球准备，慢动作甩头发，热门 BGM'], [8, 15, '3 到 4 个击球瞬间，每个 1 到 2 秒，按 BGM 卡点切'], [15, 22, '失误后的笑，同伴击掌，喘气'], [22, 28, '收拍走向网前，夕阳剪影'], [28, 30, '字幕「今天也是想成为更好的自己的一天」']],
      ok: '氛围压过技术，情绪压过数据，把网球当作生活方式来表达。', no: '几乎没有运动本身的数据，错过了「数据成为表达」的可能。', use: '最接近目标的样本。在这个样本上叠加情绪化的数据，已经接近这类用户要的定制成片。' },
    { k: 'C', name: '球友拼贴 · 短视频高能重剪', tag: '节奏拼贴', feat: '多角度拼接，PV 大字飞越，卡点音效高密度。', total: 25,
      seg: [[0, 2, '击地音效，大字「OPEN COURT 2026」漫画字体登场'], [2, 5, '快速多视角重组切换，抽象几何图层叠加'], [5, 12, '击球触弹瞬间画面静止 0.2 秒，粒子拖尾，BPM 心率变频'], [12, 18, '左右对比分屏，本尊击球动作对比职业球星'], [18, 25, '5 板连续超慢放，强颗粒电影滤镜']],
      ok: '视觉能量密度大、记忆深刻，带有创作先锋色彩。', no: '制作套路日渐雷同，一套固定的流水线模板正在固化。', use: '多视角、高密度的剪辑方向是对的。需要引入真实的运动数据，让特效强度随真实振荡变化，不用机械套模板。' },
    { k: 'D', name: '平行宇宙式实验', tag: '概念实验', feat: '动画电影级画质，艺术化的缩影。', total: 18,
      seg: [[0, 2, '黑屏文案「今天的我是什么样子」，极简竖排朱红字'], [2, 4, '触球瞬间冻结定格，漫画线稿切换转场'], [4, 8, '心流回合：喷涂发光球轨粒子，球场底图涟漪波动'], [8, 12, '三分屏同时同帧：脚踝、球轨抛物线、触网慢动作'], [12, 18, '黄金色调变焦，舒缓高阻尼心拍声']],
      ok: '信息密度极高，情绪起伏完美，每个章节风格鲜明且调性一致。', no: '对自动化算法的性能要求高，工程渲染管线的算力开销大。', use: '这是 Vivian 与林夕两类用户的高峰期望，兼具信息与审美，作为下一阶段的主攻方向。' }
  ];
  const cases = () => '<div class="ta-cases" data-ta="cases"><div class="ta-tabs" role="tablist" aria-label="四段公开案例">' + CASES.map((c, i) => '<button type="button" role="tab" aria-selected="' + (i === 0) + '" data-i="' + i + '"><b>' + c.k + '</b><span>' + c.name + '</span></button>').join('') + '</div><div class="ta-case-panel" role="tabpanel"></div></div>';
  INIT.cases = el => {
    const panel = $(el, '.ta-case-panel');
    const draw = i => {
      const c = CASES[i];
      panel.innerHTML = '<div class="ta-cs-head"><span class="mono">CASE ' + c.k + ' · ' + c.tag + ' · ' + c.total + ' S</span><h4>' + c.name + '</h4><p>' + c.feat + '</p></div>' +
        '<div class="ta-cs-bar" role="list" aria-label="分镜时间轴">' + c.seg.map(([a, b, t], j) => '<button type="button" role="listitem" class="s' + (j % 3) + '" data-j="' + j + '" style="flex:' + (b - a) + '" aria-label="' + a + ' 至 ' + b + ' 秒：' + E(t) + '"><span>' + num(j + 1) + '</span></button>').join('') + '</div>' +
        '<div class="ta-cs-axis mono"><span>0 s</span><span>' + c.total + ' s</span></div>' +
        '<ol class="ta-cs-list">' + c.seg.map(([a, b, t], j) => '<li data-j="' + j + '"><span class="mono">' + a + '–' + b + ' s</span><p>' + t + '</p></li>').join('') + '</ol>' +
        '<dl class="ta-cs-v"><div><dt>做对了</dt><dd>' + c.ok + '</dd></div><div><dt>天花板</dt><dd>' + c.no + '</dd></div><div class="use"><dt>给本项目的启示</dt><dd>' + c.use + '</dd></div></dl>';
      const hl = j => { $$(panel, '.ta-cs-bar button,.ta-cs-list li').forEach(n => n.classList.toggle('on', n.dataset.j === String(j))); };
      $$(panel, '.ta-cs-bar button').forEach(b => { ['mouseenter', 'focus', 'click'].forEach(ev => b.addEventListener(ev, () => hl(b.dataset.j))); });
      $$(panel, '.ta-cs-list li').forEach(l => l.addEventListener('mouseenter', () => hl(l.dataset.j)));
    };
    const tabs = $$(el, '[role=tab]');
    tabs.forEach(b => b.addEventListener('click', () => { tabs.forEach(x => x.setAttribute('aria-selected', String(x === b))); draw(+b.dataset.i); }));
    el.addEventListener('keydown', e => { const i = tabs.indexOf(document.activeElement); if (i < 0 || !/Arrow(Left|Right)/.test(e.key)) return; const j = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length; tabs[j].focus(); tabs[j].click(); e.preventDefault(); });
    draw(0);
  };

  // 四个案例共同的节奏骨架
  const RHY = [[0, 3, '开场钩子', '反常规的强冲击', 'FocusBox · 锁定'], [3, 12, '推进叙事', '客观抛物线叙事', 'SpeedTrail · 球轨'], [12, 18, '节奏加速', '感官节奏变密', 'RhythmPulse · 心流'], [18, 22, '最强瞬间', '触发高光特效', 'Glitch / Impact'], [22, 26, '回归余韵', '情绪平静回落', 'Constellation · 星图']];
  const rhythm = () => '<div class="ta-rhythm" data-ta="rhythm"><div class="ta-rh-ctl"><button type="button" class="ta-rh-play" aria-pressed="false"><i></i><span>播放节奏</span></button><span class="ta-rh-t mono">00.0 / 26 s</span></div>' +
    '<div class="ta-rh-bar" role="list">' + RHY.map(([a, b, h, d, fx], i) => '<div role="listitem" class="s' + (i % 3) + (i === 3 ? ' peak' : '') + '" data-i="' + i + '" style="flex:' + (b - a) + '" tabindex="0"><span class="mono">' + a + '–' + b + ' s</span><b>' + h + '</b><em>' + d + '</em><u class="mono">' + fx + '</u></div>').join('') + '<i class="ta-rh-head" aria-hidden="true"></i></div>' +
    '<p class="ta-note">四个案例拆开后，节奏骨架相同：开场抓人，中段推进，后段加速，在最强的一瞬间触发高光，最后回到平静。五个时间段各对应一种特效，由事件触发。</p></div>';
  INIT.rhythm = el => {
    const bar = $(el, '.ta-rh-bar'), head = $(el, '.ta-rh-head'), btn = $(el, '.ta-rh-play'), out = $(el, '.ta-rh-t'), segs = $$(el, '.ta-rh-bar [role=listitem]');
    let t = 0, timer = 0;
    const set = v => { t = clamp(v, 0, 26); head.style.left = (t / 26 * 100) + '%'; out.textContent = t.toFixed(1).padStart(4, '0') + ' / 26 s'; segs.forEach((s, i) => s.classList.toggle('on', t >= RHY[i][0] && t < RHY[i][1] + (i === 4 ? .01 : 0))); };
    const stop = () => { clearInterval(timer); timer = 0; btn.setAttribute('aria-pressed', 'false'); btn.lastElementChild.textContent = '播放节奏'; };
    btn.addEventListener('click', () => {
      if (timer) return stop();
      if (t >= 26) set(0);
      btn.setAttribute('aria-pressed', 'true'); btn.lastElementChild.textContent = '暂停';
      timer = setInterval(() => { set(t + .1); if (t >= 26) stop(); }, 100 / 3);
    });
    segs.forEach(s => { const go = () => { stop(); set(RHY[+s.dataset.i][0] + .01); }; s.addEventListener('click', go); s.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }); });
    set(0);
  };

  ACT.research = (a, i) => ahead(a, i) + '<div class="ta-body">' +
    plate('TA-07 / LITERATURE', '三代研究的边界', gens(), 'ta-p-gens') +
    plate('TA-08 / MAP', '学术与产业的坐标', quad(), 'ta-p-quad', '点击或悬停坐标上的点，右下角会显示说明。') +
    plate('TA-09 / USERS', '四类球员怎样对待数据', persona(), 'ta-p-persona', '点击下方名字，高亮对应的那条线。') +
    plate('TA-10 / CASES', '四段公开案例的逐镜头拆解', cases(), 'ta-p-cases') +
    plate('TA-11 / RHYTHM', '案例共有的节奏骨架', rhythm(), 'ta-p-rhythm') + '</div>';

  /* ============ 04 实验设计 ============ */
  const PRIN = [
    ['P1', '数据为肖像', '每个画面都要回答：这是谁的训练。',
      '<svg viewBox="0 0 120 80" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="60" cy="40" r="7" fill="currentColor"/><circle cx="60" cy="40" r="16"/><circle cx="60" cy="40" r="26" stroke-opacity=".55"/><circle cx="60" cy="40" r="36" stroke-opacity=".25"/></g></svg>'],
    ['P2', '拥抱不完美', '界外球和失误留在画面里，不只展示高光。',
      '<svg viewBox="0 0 120 80" aria-hidden="true"><path d="M6 62Q34 6 66 40T112 58" fill="none" stroke="currentColor" stroke-width="1.6"/><g fill="currentColor"><circle cx="30" cy="30" r="3.4"/><circle cx="66" cy="40" r="3.4"/></g><path d="M100 50l12 12m0-12-12 12" stroke="currentColor" stroke-width="2"/></svg>'],
    ['P5', '数据成为画面', '球速变成拖尾光轨，落点变成涟漪，不贴角标。',
      '<svg viewBox="0 0 120 80" aria-hidden="true"><g fill="none" stroke="currentColor"><path d="M8 66Q50 4 106 34" stroke-width="5" stroke-opacity=".2"/><path d="M8 66Q50 4 106 34" stroke-width="2.4"/><ellipse cx="106" cy="52" rx="10" ry="4" stroke-width="1.4"/><ellipse cx="106" cy="52" rx="18" ry="7" stroke-width="1" stroke-opacity=".5"/></g><circle cx="106" cy="34" r="4.5" fill="currentColor"/></svg>'],
    ['P10', '可复刻，不可复刻', '模板可以复用；数据不同，成片就不同。',
      '<svg viewBox="0 0 120 80" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6"><rect x="8" y="14" width="30" height="52"/><rect x="45" y="14" width="30" height="52" stroke-opacity=".6"/><rect x="82" y="14" width="30" height="52" stroke-opacity=".3"/></g><g fill="currentColor"><path d="M12 56l8-18 6 10 8-24"/></g><g fill="none" stroke="currentColor" stroke-width="2"><path d="M12 56l8-18 6 10 8-24M49 54l8-8 6 4 8-26M86 56l6-22 8 14 6-10"/></g></svg>']
  ];
  const prin = () => '<ul class="ta-prin">' + PRIN.map(([n, h, p, art]) => '<li><span class="ta-pr-n mono">' + n + '</span><div class="ta-pr-art">' + art + '</div><h4>' + h + '</h4><p>' + p + '</p></li>').join('') + '</ul>';

  const STEPS = [
    ['01', '上传素材', 'UPLOAD', '球场视频与训练记录进入同一个项目。', '球场视频与训练记录进入同一个项目。'],
    ['02', '分析', 'ANALYZE', '姿态、球路与事件候选，自动完成。', '姿态、球路与事件候选，自动完成。'],
    ['03', '风格', 'STYLE', '套用默认模板与节奏。', '选风格、关键词、色彩和节奏。'],
    ['04', '生成与精修', 'COMPOSE', '自动生成成片。', '片段、文字、声音逐项精修。'],
    ['05', '审看与出口', 'OUTPUT', '存档或一键分享。', '人工审看后按平台输出。']
  ];
  const TRACKS = [['A', '一键成片', '老陈 · 小杨', '素材交上去，几分钟内拿到成片。'], ['B', '半自定义', '林夕 · Vivian', '每一步都可以介入，成片由自己决定。']];
  const flow = () => '<div class="ta-flow" data-ta="flow" data-track="A"><div class="ta-seg ta-seg-lg" role="group" aria-label="选择制作路径">' +
    TRACKS.map(([k, h, who, d], i) => '<button type="button" data-k="' + k + '" aria-pressed="' + (i === 0) + '"><b>' + k + '</b><span>' + h + '</span><em>' + who + '</em></button>').join('') + '</div>' +
    '<p class="ta-fl-d" aria-live="polite">' + TRACKS[0][3] + '</p>' +
    '<ol class="ta-fl-steps">' + STEPS.map(([n, h, en, a, b], i) => '<li class="' + (i === 2 || i === 3 ? 'fork' : '') + '"><span class="mono">' + n + ' / ' + en + '</span><h4>' + h + '</h4><p data-a="' + E(a) + '" data-b="' + E(b) + '">' + E(a) + '</p></li>').join('') + '</ol>' +
    '<p class="ta-note">两种路径共用同一份素材和同一套分析，分岔只发生在第 03、04 步。</p></div>';
  INIT.flow = el => {
    const set = k => {
      el.dataset.track = k;
      $$(el, '.ta-seg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === k)));
      $$(el, '.ta-fl-steps p').forEach(p => { p.textContent = p.dataset[k.toLowerCase()]; });
      $(el, '.ta-fl-d').textContent = TRACKS[k === 'A' ? 0 : 1][3];
    };
    $$(el, '.ta-seg button').forEach(b => b.addEventListener('click', () => set(b.dataset.k)));
  };

  const TEST = [
    ['01', '基线与入场', '记录测试者的打球与剪辑背景，作为对照。'],
    ['02', '任务创作', '上传素材、选择风格、生成并查看产出。'],
    ['03', '过程观察', '点击热区、误点、操作时长与参数调整。'],
    ['04', '体验反馈', '访谈，加 SUS 可用性量表。']
  ];
  const test = () => '<div class="ta-test"><div class="ta-te-n"><b>12</b><span>名业余球员<br>走完上传到分发的全流程</span></div><ol class="ta-te-steps">' + TEST.map(([n, h, p]) => '<li><span class="mono">' + n + '</span><h4>' + h + '</h4><p>' + p + '</p></li>').join('') + '</ol>' +
    '<div class="ta-te-bar" aria-hidden="true"><i></i><span class="mono">TASK TIMELINE</span><i></i></div>' +
    '<p class="ta-note">这一轮的目的是找出设计错在哪里，所以任务里的卡点、误点和等待时间都被记下来。</p></div>';

  ACT.protocol = (a, i) => ahead(a, i) + '<div class="ta-body">' +
    plate('TA-12 / PRINCIPLES', '设计原则', prin(), 'ta-p-prin', '设计规范里的十条原则中，成片制作用到的四条。') +
    plate('TA-13 / FLOW', '五步创作链路与两种路径', flow(), 'ta-p-flow', '切换路径，看第 03、04 步怎样分岔。') +
    plate('TA-14 / TEST', '原型测试怎样安排', test(), 'ta-p-test') + '</div>';

  /* ============ 05 访谈与验证 ============ */
  const SIG = [
    ['S1', 'P0', '心理阻抗', '受访 2', '自己看为主，很少分享，实在太丑了。', '出口分存档、私域、公开三档，默认不公开。'],
    ['S2', 'P0', '识别信任', '场馆方', '太慢了，等半天还不准。回合识别不准，一旦手动改还不如手剪。', '每条检测结论都有修正入口，数据能跳回对应片段。'],
    ['S3', 'P1', '创作主权', '受访 4', '还是希望自己剪辑的乐趣。', '增加「我自己挑」入口，保留片段选择与剪辑参与。'],
    ['S4', 'P2', '深度负荷', '受访 4', '要一整套分析报告：有哪些缺陷、下次往哪进步，躯干、腿部、落点。', '报告需求与成片任务分开，教练式解释留待后续验证。']
  ];
  const sig = () => '<div class="ta-sig" data-ta="sig">' + SIG.map(([s, p, h, who, q, d], i) => '<article class="' + (i === 0 ? 'on' : '') + '" tabindex="0"><div class="ta-sg-id"><b>' + s + '</b><span class="mono">' + p + '</span><em>' + h + '</em></div><blockquote><p>「' + E(q) + '」</p><cite class="mono">' + E(who) + '</cite></blockquote><i class="ta-sg-ar" aria-hidden="true"></i><div class="ta-sg-re"><span class="mono">DESIGN RESPONSE</span><p>' + E(d) + '</p></div></article>').join('') + '<p class="ta-note">P0 / P1 / P2 是设计优先级，与出现频率无关。</p></div>';
  INIT.sig = el => { const rows = $$(el, 'article'); rows.forEach(r => { const on = () => rows.forEach(x => x.classList.toggle('on', x === r)); r.addEventListener('mouseenter', on); r.addEventListener('focus', on); r.addEventListener('click', on); }); };

  const FIX = [
    { h: '按钮重复', en: 'CHOICE PARALYSIS', find: '同一层级出现功能重叠的按钮，用户的决策被打断。', fix: '合并入口，每屏只留一个主操作。',
      before: '<svg viewBox="0 0 260 170" role="img" aria-label="修订前：三个功能相同的按钮并排"><rect x="40" y="8" width="180" height="154" rx="10" class="ta-fx-line"/><rect x="58" y="30" width="144" height="28" rx="4" class="ta-fx-on"/><rect x="58" y="68" width="144" height="28" rx="4" class="ta-fx-on"/><rect x="58" y="106" width="144" height="28" rx="4" class="ta-fx-on"/><g class="ta-fx-t" text-anchor="middle" font-size="12" font-weight="700"><text x="130" y="48">生成</text><text x="130" y="86">开始创作</text><text x="130" y="124">立即制作</text></g></svg>',
      after: '<svg viewBox="0 0 260 170" role="img" aria-label="修订后：一个主按钮，一个次级链接"><rect x="40" y="8" width="180" height="154" rx="10" class="ta-fx-line"/><rect x="58" y="44" width="144" height="42" rx="4" class="ta-fx-on"/><g class="ta-fx-t" text-anchor="middle" font-size="14" font-weight="800"><text x="130" y="70">开始创作</text></g><path d="M92 120h76" class="ta-fx-line"/><text x="130" y="116" text-anchor="middle" font-size="11" class="ta-fx-mute">了解更多</text></svg>' },
    { h: '风格选择没有效果', en: 'ILLUSORY AGENCY', find: '选项只是装饰，每个选择都汇到同一份输出。', fix: '重接 PromptFactory 参数通路，每个选择都改写模板变量。',
      before: '<svg viewBox="0 0 260 170" role="img" aria-label="修订前：三个风格选项汇向同一份成片"><g class="ta-fx-line" fill="none"><path d="M70 34C130 34 150 85 186 85M70 85H186M70 136C130 136 150 85 186 85"/></g><g class="ta-fx-t2"><rect x="14" y="20" width="56" height="28" rx="4"/><rect x="14" y="71" width="56" height="28" rx="4"/><rect x="14" y="122" width="56" height="28" rx="4"/></g><rect x="186" y="62" width="62" height="46" rx="4" class="ta-fx-on"/><g class="ta-fx-t" text-anchor="middle" font-size="11" font-weight="700"><text x="217" y="90">同一份</text></g><g text-anchor="middle" font-size="11" class="ta-fx-mute"><text x="42" y="38">风格 A</text><text x="42" y="89">风格 B</text><text x="42" y="140">风格 C</text></g></svg>',
      after: '<svg viewBox="0 0 260 170" role="img" aria-label="修订后：每个风格改写自己的参数，得到三份不同的成片"><g class="ta-fx-line" fill="none"><path d="M70 34H112M70 85H112M70 136H112M150 34H190M150 85H190M150 136H190"/></g><g class="ta-fx-t2"><rect x="14" y="20" width="56" height="28" rx="4"/><rect x="14" y="71" width="56" height="28" rx="4"/><rect x="14" y="122" width="56" height="28" rx="4"/></g><g class="ta-fx-on"><rect x="112" y="20" width="38" height="28" rx="4"/><rect x="112" y="71" width="38" height="28" rx="4"/><rect x="112" y="122" width="38" height="28" rx="4"/></g><g class="ta-fx-t2"><rect x="190" y="20" width="56" height="28" rx="4"/><rect x="190" y="71" width="56" height="28" rx="4"/><rect x="190" y="122" width="56" height="28" rx="4"/></g><g text-anchor="middle" font-size="10" class="ta-fx-mute"><text x="42" y="38">风格 A</text><text x="42" y="89">风格 B</text><text x="42" y="140">风格 C</text><text x="218" y="38">成片 A</text><text x="218" y="89">成片 B</text><text x="218" y="140">成片 C</text></g><g class="ta-fx-t" text-anchor="middle" font-size="9" font-weight="700"><text x="131" y="38">变量</text><text x="131" y="89">变量</text><text x="131" y="140">变量</text></g></svg>' },
    { h: '教练反馈空泛', en: 'HOLLOW COACH', find: '反馈是放之四海皆准的话，和「你这一场」无关。', fix: '本场数据与通用建议分轨显示，并加标签区分。',
      before: '<svg viewBox="0 0 260 170" role="img" aria-label="修订前：一张只有通用建议的灰色卡片"><rect x="30" y="14" width="200" height="142" rx="8" class="ta-fx-line"/><g class="ta-fx-mute2"><rect x="48" y="36" width="140" height="8" rx="2"/><rect x="48" y="56" width="164" height="8" rx="2"/><rect x="48" y="76" width="120" height="8" rx="2"/><rect x="48" y="96" width="150" height="8" rx="2"/></g><text x="48" y="136" font-size="11" class="ta-fx-mute">多练习，保持放松</text></svg>',
      after: '<svg viewBox="0 0 260 170" role="img" aria-label="修订后：本场数据卡与通用建议卡分开"><rect x="24" y="10" width="212" height="82" rx="8" class="ta-fx-line"/><rect x="36" y="20" width="58" height="18" rx="9" class="ta-fx-on"/><text x="65" y="33" text-anchor="middle" font-size="10" font-weight="800" class="ta-fx-t">你这一场</text><g class="ta-fx-on"><rect x="36" y="50" width="120" height="8" rx="2"/><rect x="36" y="66" width="98" height="8" rx="2"/></g><text x="168" y="58" font-size="10" class="ta-fx-mute">反手 83.6%</text><text x="150" y="74" font-size="10" class="ta-fx-mute">正手 84.5%</text><rect x="24" y="102" width="212" height="58" rx="8" class="ta-fx-line"/><rect x="36" y="112" width="58" height="18" rx="9" class="ta-fx-t2"/><text x="65" y="125" text-anchor="middle" font-size="10" font-weight="800" class="ta-fx-mute">通用建议</text><g class="ta-fx-mute2"><rect x="36" y="140" width="150" height="7" rx="2"/></g></svg>' }
  ];
  const fix = () => '<div class="ta-fix" data-ta="fix"><div class="ta-tabs" role="tablist" aria-label="三个走查问题">' + FIX.map((f, i) => '<button type="button" role="tab" aria-selected="' + (i === 0) + '" data-i="' + i + '"><b>' + num(i + 1) + '</b><span>' + f.h + '</span></button>').join('') + '</div><div class="ta-fix-panel" role="tabpanel" aria-live="polite"></div></div>';
  INIT.fix = el => {
    const panel = $(el, '.ta-fix-panel'), tabs = $$(el, '[role=tab]');
    const draw = i => {
      const f = FIX[i];
      panel.innerHTML = '<div class="ta-fx-head"><span class="mono">ISSUE ' + num(i + 1) + ' / ' + f.en + '</span><h4>' + f.h + '</h4></div>' +
        '<div class="ta-fx-pair"><figure class="bf"><figcaption class="mono">BEFORE · 修订前</figcaption>' + f.before + '</figure><i class="ta-fx-ar" aria-hidden="true"></i><figure class="af"><figcaption class="mono">AFTER · 修订后</figcaption>' + f.after + '</figure></div>' +
        '<dl class="ta-fx-d"><div><dt>走查发现</dt><dd>' + E(f.find) + '</dd></div><div><dt>修订动作</dt><dd>' + E(f.fix) + '</dd></div></dl>';
    };
    tabs.forEach(b => b.addEventListener('click', () => { tabs.forEach(x => x.setAttribute('aria-selected', String(x === b))); draw(+b.dataset.i); }));
    el.addEventListener('keydown', e => { const i = tabs.indexOf(document.activeElement); if (i < 0 || !/Arrow(Left|Right)/.test(e.key)) return; const j = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length; tabs[j].focus(); tabs[j].click(); e.preventDefault(); });
    draw(0);
  };

  const REC = [['−4', '步', '完成全周期所需的动作步数'], ['−28.4', '%', '交互误触的失误率'], ['+42.5', '%', '「选择有效感」评分'], ['30', '秒', '一键成片的产出时间']];
  const rec = () => '<div class="ta-rec">' + REC.map(([v, u, t], i) => '<div><b>' + v + '<small>' + u + '</small></b><span>' + t + '</span></div>').join('') + '</div><p class="ta-note">以上为 12 人原型测试的阶段记录，与修订前的版本对比；样本小，只作为这一轮迭代的参照。</p>';

  ACT.validation = (a, i) => ahead(a, i) + '<div class="ta-body">' +
    plate('TA-15 / SIGNALS', '四条访谈信号与对应的设计决定', sig(), 'ta-p-sig', '悬停或聚焦一行，右侧的设计回应会点亮。') +
    plate('TA-16 / WALKTHROUGH', '走查暴露的三个问题', fix(), 'ta-p-fix', '切换三个问题，并排看修订前后。') +
    plate('TA-17 / RECORD', '修订后的阶段记录', rec(), 'ta-p-rec') + '</div>';

  /* ============ 06 个性化影片的实施 ============ */
  // 输入：球馆小程序采集的训练记录
  const dataIn = () => {
    const ruler = '<div class="ta-ruler" role="img" aria-label="球速标尺：业余常见 60 到 100 公里每小时，职业球员约 150；这份记录平均 63.17、最高 94">' +
      '<div class="ta-ru-track"><i class="band" style="left:37.5%;width:25%"></i><i class="mk pro" style="left:93.75%"></i><i class="mk avg" style="left:39.5%"></i><i class="mk top" style="left:58.75%"></i></div>' +
      '<div class="ta-ru-ticks mono"><span style="left:0">0</span><span style="left:25%">40</span><span style="left:50%">80</span><span style="left:75%">120</span><span style="left:100%">160 km/h</span></div>' +
      '<ul class="ta-ru-key"><li><i class="band"></i>业余常见 60–100</li><li><i class="mk avg"></i>本记录平均 63.17</li><li><i class="mk top"></i>最高 94</li><li><i class="mk pro"></i>职业约 150</li></ul></div>';
    return '<div class="ta-data"><div class="ta-da-big"><b>84.09<small>%</small></b><span>击球成功率<br>148 / 176 拍</span></div>' +
      '<div class="ta-da-meters"><div><span>正手</span><i style="--v:84.47%"></i><b>84.47%</b></div><div><span>反手</span><i style="--v:83.56%"></i><b>83.56%</b></div>' +
      '<div class="ta-da-depth"><span>击球点纵深</span><div class="ta-da-stack"><i style="flex:64">底线 64%</i><i style="flex:34">中部 34%</i><i style="flex:2" title="近网 2%"></i></div></div></div>' + ruler + '</div>' +
      '<p class="ta-note">来源：乐动力小程序采集的一份训练记录，过网平均高度 1.72 m。球速标尺用来给「业余的自己」找一个参照。</p>';
  };

  const PARTS = [
    { k: 'M1', en: 'INPUT', h: '视频输入', input: '训练 / 比赛视频 .mp4', output: '视频帧 · 帧率 · 时间索引',
      nodes: [['VideoProcessor', 'OpenCV 读帧'], ['旋转与缩放', '修正 EXIF，最长边 1920 px'], ['时间基准', 'frame_id / timestamp']],
      p: '4K 或 1080p 的记录经读取、旋转修正和缩放，给姿态与球路一条共同的时间线。', note: '输入质量受机位、遮挡与画面清晰度影响。' },
    { k: 'M2', en: 'POSE', h: '骨骼与运动分析', input: '带时间索引的视频帧', output: '33 点坐标 · 关节特征 · 挥拍阶段',
      nodes: [['PoseExtractor', 'MediaPipe Pose · 33 点'], ['PoseSmoother', '5 帧移动平均'], ['MotionAnalyzer', '速度 / 角度 / 位移'], ['挥拍状态机', '启动 → 峰值 → 击球 → 结束']],
      p: '每帧提取关键点并做 5 帧移动平均，随后计算关节运动特征，把一次挥拍划分为四个阶段。', note: '像素坐标里的速度不等于真实世界的速度。' },
    { k: 'M3', en: 'BALL / EVENT', h: '球路与事件检测', input: '连续视频帧 + 骨骼事件', output: '球轨迹 · 弹跳 / 击球候选 · 事件时间',
      nodes: [['TrackNetV2', '3 帧 / 9 通道输入'], ['轨迹后处理', '异常剔除、补全、平滑'], ['球事件', '弹跳 / 击球 / 飞行'], ['EventDetector', '与挥拍时间交叉匹配']],
      p: 'TrackNetV2 给出球的热力图，后处理整理成球路；并与挥拍阶段、球路变化和击球声交叉匹配，得到 14 类事件候选。', note: '球速与旋转依赖空间标定，事件候选需要人工核对。' },
    { k: 'M4', en: 'FX', h: '特效渲染', input: '事件 + 姿态 + 球轨迹', output: '特效视频 · 结构化 JSON',
      nodes: [['EffectDirector', '按事件调度'], ['ADSR', '起音 / 衰减 / 持续 / 释放'], ['OpenCV · Remotion', '逐帧绘制 · 程序化合成']],
      p: '事件类型决定用哪一种特效，ADSR 包络决定强弱和退场。OpenCV 直接在帧上绘制，Remotion 读取导出的 JSON 做程序化合成。', note: '两条渲染路径都保留与源视频的时间对应。' },
    { k: 'M5', en: 'CONTENT', h: '内容生成', input: 'MatchBundle + 风格偏好', output: '视频 · 图文 · 脚本',
      nodes: [['MatchBundle', '元信息 / 高光 / 统计'], ['PromptFactory', 'YAML 模板与变量注入'], ['服务适配器', '影像 / 图文 / 脚本三路'], ['人工审看', '内容与人物连续性']],
      p: '风格偏好写进 YAML 模板变量，经三类服务适配器生成影像、图文和脚本。内置五套视频风格：cinematic_highlight、anime_shonen、arcade_pixel、marvel_blockbuster、post_match_report。', note: '生成内容都要人工审看，模板名不对应从动作推断的人格或情绪。' },
    { k: 'M6', en: 'COMPOSE', h: '后期与输出', input: '真人影像 + 动态文字 + 特效 + 音轨', output: '审核后的成片 · 多平台规格',
      nodes: [['后期合成', 'FFmpeg / MoviePy 多轨'], ['人工审核', '片段 / 字幕 / 声音'], ['输出授权', '存档 / 私域 / 公开']],
      p: '真人影像、动态文字、特效和音轨在多轨时间线上合成，经审核后按授权输出。5 支成片都经过人工制作与审看。', note: '自动合成与分发在结构文档中仍是骨架，成片由人工完成。' },
    { k: 'M7', en: 'INFRASTRUCTURE', h: '基础设施', input: '全链路的配置、数据与任务', output: '数据校验 · 素材管理 · 状态与错误处理',
      nodes: [['Pydantic', 'MatchBundle 校验'], ['AssetManager', '素材引用管理'], ['Orchestrator', 'asyncio 状态编排'], ['Port / Adapter', '服务可替换']],
      p: '横跨 M1 到 M6：Python、FastAPI、Click、httpx 与配置管理支持输入、分析和内容任务；任务状态分为完成、失败和部分完成。', note: '它不是流水线最后一个节点，社媒分发的真实接口仍需接入。' },
    { k: 'DATA', en: 'MATCHBUNDLE', h: '共享数据契约', input: 'M2 骨骼帧 + M3 球轨迹与事件', output: '同一份 JSON，供 M4、M5 读取',
      nodes: [['meta', '元信息'], ['highlights', '高光片段'], ['stats', '统计'], ['skeleton_frames', '骨骼帧'], ['ball_trajectory', '球轨迹']],
      p: '分析层与创作层之间只传这一份数据。特效和内容生成读取同一份 MatchBundle，所以换风格不需要重新分析。', note: 'Pydantic 校验字段与类型，错误在入口处被截住。' }
  ];
  const nd = (i, cls = '') => '<button type="button" class="ta-nd ' + cls + '" data-i="' + i + '" aria-pressed="false"><span class="mono">' + PARTS[i].k + ' / ' + PARTS[i].en + '</span><b>' + PARTS[i].h + '</b><small>' + PARTS[i].output + '</small></button>';
  const chain = () => '<div class="ta-chain" data-ta="chain"><div class="ta-ch-ctl"><button type="button" class="ta-ch-run" aria-pressed="false"><i></i><span>沿链路走一遍</span></button><span class="ta-ch-tag mono">点选任一模块，查看输入、输出与内部步骤</span></div>' +
    '<div class="ta-ch-flow"><div class="ta-ch-col c1">' + nd(0) + '</div><i class="ta-ch-ar" aria-hidden="true"></i><div class="ta-ch-col c2"><span class="ta-ch-lb mono">ANALYZE</span>' + nd(1) + nd(2) + '</div><i class="ta-ch-ar" aria-hidden="true"></i>' + '<div class="ta-ch-col c3">' + nd(7, 'bundle') + '</div><i class="ta-ch-ar" aria-hidden="true"></i><div class="ta-ch-col c4"><span class="ta-ch-lb mono">CREATE</span>' + nd(3) + nd(4) + '</div><i class="ta-ch-ar" aria-hidden="true"></i><div class="ta-ch-col c5">' + nd(5) + '</div></div>' +
    '<div class="ta-ch-base"><span class="ta-ch-lb mono">FOUNDATION</span>' + nd(6, 'base') + '</div><div class="ta-ch-detail" aria-live="polite"></div></div>';
  INIT.chain = el => {
    const det = $(el, '.ta-ch-detail'), btns = $$(el, '.ta-nd'), run = $(el, '.ta-ch-run');
    let timer = 0;
    const show = i => {
      const d = PARTS[i];
      btns.forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.i === i)));
      det.innerHTML = '<div class="ta-dh"><span class="ta-did">' + d.k + '</span><div><span class="mono">MODULE DETAIL / ' + d.en + '</span><h4>' + d.h + '</h4></div></div>' +
        '<dl class="ta-io"><div><dt>INPUT</dt><dd>' + E(d.input) + '</dd></div><div><dt>OUTPUT</dt><dd>' + E(d.output) + '</dd></div></dl>' +
        '<ol class="ta-in-steps">' + d.nodes.map(([a, b], j) => '<li><span class="mono">' + num(j + 1) + '</span><b>' + E(a) + '</b><em>' + E(b) + '</em></li>').join('') + '</ol><p>' + E(d.p) + '</p><p class="ta-small">' + E(d.note) + '</p>';
    };
    const stop = () => { clearInterval(timer); timer = 0; run.setAttribute('aria-pressed', 'false'); run.lastElementChild.textContent = '沿链路走一遍'; btns.forEach(b => b.classList.remove('run')); };
    btns.forEach(b => b.addEventListener('click', () => { stop(); show(+b.dataset.i); }));
    run.addEventListener('click', () => {
      if (timer) return stop();
      const seq = [[0], [1, 2], [7], [3, 4], [5], [6]]; let n = 0;
      run.setAttribute('aria-pressed', 'true'); run.lastElementChild.textContent = '停止';
      const go = () => {
        if (n >= seq.length) return stop();
        btns.forEach(b => b.classList.toggle('run', seq[n].includes(+b.dataset.i)));
        show(seq[n][0]); n++;
      };
      go(); timer = setInterval(go, 1300);
    });
    show(1);
  };

  // 33 点骨架：四个挥拍阶段之间可拖动
  const LMN = ['nose', 'left_eye_inner', 'left_eye', 'left_eye_outer', 'right_eye_inner', 'right_eye', 'right_eye_outer', 'left_ear', 'right_ear', 'mouth_left', 'mouth_right', 'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow', 'left_wrist', 'right_wrist', 'left_pinky', 'right_pinky', 'left_index', 'right_index', 'left_thumb', 'right_thumb', 'left_hip', 'right_hip', 'left_knee', 'right_knee', 'left_ankle', 'right_ankle', 'left_heel', 'right_heel', 'left_foot_index', 'right_foot_index'];
  const CONN = [[0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8], [9, 10], [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [17, 19], [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20], [11, 23], [12, 24], [23, 24], [23, 25], [24, 26], [25, 27], [26, 28], [27, 29], [28, 30], [29, 31], [30, 32], [27, 31], [28, 32]];
  // 关键点依次为：鼻、左肩、右肩、左肘、右肘、左腕、右腕、左髋、右髋、左膝、右膝、左踝、右踝
  const POSES = [
    { n: '启动', en: 'READY', d: '双脚站稳，球拍在身前，等球过来。', j: [[150, 62], [178, 102], [122, 102], [196, 140], [100, 142], [172, 164], [134, 168], [166, 198], [134, 198], [178, 252], [122, 252], [184, 306], [116, 306]] },
    { n: '引拍', en: 'BACKSWING', d: '肩部转开，持拍手臂向后拉到最远。', j: [[146, 64], [170, 102], [126, 102], [198, 124], [84, 112], [224, 138], [46, 92], [160, 198], [136, 198], [172, 252], [122, 252], [176, 306], [116, 306]] },
    { n: '击球', en: 'CONTACT', d: '手臂向前送出，腕部速度到达峰值，球拍触球。', j: [[158, 64], [176, 104], [132, 100], [150, 140], [184, 128], [118, 150], [236, 152], [168, 198], [140, 194], [176, 252], [132, 250], [180, 306], [128, 304]] },
    { n: '收拍', en: 'FINISH', d: '球拍越过身体，动作收尾，速度回落。', j: [[152, 66], [172, 104], [128, 98], [196, 132], [150, 80], [200, 172], [120, 52], [160, 198], [132, 196], [170, 252], [128, 250], [172, 306], [128, 306]] }
  ];
  const lm = j => {
    const [N, sL, sR, eL, eR, wL, wR, hL, hR, kL, kR, aL, aR] = j, P = new Array(33), add = (p, dx, dy) => [p[0] + dx, p[1] + dy];
    P[0] = N; P[1] = add(N, -4, -4); P[2] = add(N, -8, -4); P[3] = add(N, -12, -3); P[4] = add(N, 4, -4); P[5] = add(N, 8, -4); P[6] = add(N, 12, -3); P[7] = add(N, -17, 2); P[8] = add(N, 17, 2); P[9] = add(N, -4, 12); P[10] = add(N, 4, 12);
    P[11] = sL; P[12] = sR; P[13] = eL; P[14] = eR; P[15] = wL; P[16] = wR;
    const hand = (w, e, s) => { const dx = w[0] - e[0], dy = w[1] - e[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l, px = -uy, py = ux; return [[w[0] + ux * 9 + px * s * 5, w[1] + uy * 9 + py * s * 5], [w[0] + ux * 13 - px * s * 3, w[1] + uy * 13 - py * s * 3], [w[0] + ux * 5 + px * s * 9, w[1] + uy * 5 + py * s * 9]]; };
    const hl = hand(wL, eL, 1), hr = hand(wR, eR, -1);
    P[17] = hl[0]; P[19] = hl[1]; P[21] = hl[2]; P[18] = hr[0]; P[20] = hr[1]; P[22] = hr[2];
    P[23] = hL; P[24] = hR; P[25] = kL; P[26] = kR; P[27] = aL; P[28] = aR;
    P[29] = add(aL, -5, 8); P[30] = add(aR, -5, 8); P[31] = add(aL, 13, 9); P[32] = add(aR, 13, 9);
    return P;
  };
  const poseAt = t => { // Catmull-Rom：四个阶段之间速度连续
    t = clamp(t, 0, 3); const i = Math.min(2, Math.floor(t)), u = t - i, A = POSES[Math.max(i - 1, 0)].j, B = POSES[i].j, C = POSES[i + 1].j, D = POSES[Math.min(i + 2, 3)].j;
    const cr = (a, b, c, d) => .5 * ((2 * b) + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
    return B.map((p, k) => [cr(A[k][0], p[0], C[k][0], D[k][0]), cr(A[k][1], p[1], C[k][1], D[k][1])]);
  };
  const racket = j => { const w = j[6], e = j[4], dx = w[0] - e[0], dy = w[1] - e[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l; return { hx: w[0] + ux * 56, hy: w[1] + uy * 56, a: Math.atan2(uy, ux) * 180 / Math.PI + 90, w }; };
  const skelLines = (P, cls) => '<g class="' + cls + '" fill="none">' + CONN.map(([a, b]) => '<line x1="' + P[a][0].toFixed(1) + '" y1="' + P[a][1].toFixed(1) + '" x2="' + P[b][0].toFixed(1) + '" y2="' + P[b][1].toFixed(1) + '"/>').join('') + '</g>';
  // 手腕速度曲线：原始值带抖动，平滑值为 5 帧移动平均（示意）
  const SPD = (() => {
    const r = rng(11), N = 120, pos = Array.from({ length: N + 1 }, (_, k) => poseAt(k / N * 3)[6]);
    const raw = pos.slice(1).map((p, k) => Math.hypot(p[0] - pos[k][0], p[1] - pos[k][1]) * (1 + (r() - .5) * .38) + r() * .5);
    const sm = raw.map((_, k) => { let s = 0, c = 0; for (let d = -2; d <= 2; d++) { const v = raw[k + d]; if (v != null) { s += v; c++; } } return s / c; });
    const mx = Math.max(...raw);
    return { raw: raw.map(v => v / mx), sm: sm.map(v => v / mx) };
  })();
  const skel = () => '<div class="ta-skel" data-ta="skel"><div class="ta-sk-stage"><svg viewBox="0 0 300 340" role="img" aria-label="MediaPipe 33 点骨架的示意挥拍，可在四个阶段之间拖动">' +
    '<defs><pattern id="ta-sk-g" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#5aaeff" stroke-opacity=".12"/></pattern></defs><rect width="300" height="340" fill="url(#ta-sk-g)"/>' +
    '<path class="sk-path" fill="none"/><g class="sk-ring"></g><g class="sk-body"></g><g class="sk-racket"></g><circle class="sk-ball" r="6"/><text class="sk-lb mono" x="12" y="24"></text><text class="sk-lb2 mono" x="288" y="326" text-anchor="end">33 LANDMARKS</text></svg></div>' +
    '<div class="ta-sk-side"><div class="ta-sk-phases" role="group" aria-label="挥拍阶段">' + POSES.map((p, i) => '<button type="button" data-t="' + i + '" aria-pressed="' + (i === 0) + '"><b>' + num(i + 1) + '</b><span>' + p.n + '</span><em class="mono">' + p.en + '</em></button>').join('') + '</div>' +
    '<label class="ta-sk-rg"><span class="mono">SCRUB</span><input type="range" min="0" max="300" value="0" aria-label="拖动查看挥拍过程"><button type="button" class="ta-sk-play" aria-pressed="false">播放</button></label>' +
    '<p class="ta-sk-d" aria-live="polite"></p>' +
    '<div class="ta-sk-spd"><div class="ta-sk-sh"><span class="mono">右腕速度 · 示意</span><div class="ta-seg ta-seg-sm" role="group" aria-label="速度曲线"><button type="button" data-m="raw" aria-pressed="true">原始</button><button type="button" data-m="sm" aria-pressed="false">5 帧平滑</button></div></div><svg viewBox="0 0 300 110" preserveAspectRatio="none" role="img" aria-label="右腕速度曲线"><path class="sp-grid" d="M0 100H300M0 55H300" /><path class="sp-line" fill="none"/><path class="sp-cur"/><circle class="sp-dot" r="4"/></svg></div></div></div>' +
    '<p class="ta-note">骨架是示意动作，不对应任何一位参与者的实测姿态。关键点编号与名称沿用 MediaPipe Pose；悬停圆点可以看到名称。</p>';
  INIT.skel = el => {
    const body = $(el, '.sk-body'), rk = $(el, '.sk-racket'), ball = $(el, '.sk-ball'), ring = $(el, '.sk-ring'), pth = $(el, '.sk-path'), lb = $(el, '.sk-lb'), dd = $(el, '.ta-sk-d'), rg = $(el, 'input[type=range]'), play = $(el, '.ta-sk-play');
    const spL = $(el, '.sp-line'), spC = $(el, '.sp-cur'), spD = $(el, '.sp-dot'), phases = $$(el, '.ta-sk-phases button'), segs = $$(el, '.ta-sk-spd .ta-seg button');
    let mode = 'raw', t = 0, raf = 0, mounted = false;
    const traj = Array.from({ length: 61 }, (_, k) => poseAt(k / 60 * 3)[6]);
    pth.setAttribute('d', 'M' + traj.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L'));
    const curve = () => { const a = SPD[mode]; spL.setAttribute('d', 'M' + a.map((v, k) => (k / (a.length - 1) * 300).toFixed(1) + ' ' + (100 - v * 88).toFixed(1)).join('L')); };
    const draw = () => {
      const j = poseAt(t), P = lm(j);
      if (!mounted) { body.innerHTML = '<g class="sk-ln"></g>' + P.map((p, i) => '<circle r="' + (i === 16 ? 4.6 : 3) + '" class="' + (i === 16 ? 'hot' : '') + '"><title>' + i + ' ' + LMN[i] + '</title></circle>').join(''); mounted = true; }
      $(body, '.sk-ln').innerHTML = CONN.map(([a, b]) => '<line x1="' + P[a][0].toFixed(1) + '" y1="' + P[a][1].toFixed(1) + '" x2="' + P[b][0].toFixed(1) + '" y2="' + P[b][1].toFixed(1) + '"/>').join('');
      $$(body, 'circle').forEach((c, i) => { c.setAttribute('cx', P[i][0].toFixed(1)); c.setAttribute('cy', P[i][1].toFixed(1)); });
      const r = racket(j);
      rk.innerHTML = '<line x1="' + r.w[0].toFixed(1) + '" y1="' + r.w[1].toFixed(1) + '" x2="' + (r.w[0] + (r.hx - r.w[0]) * .62).toFixed(1) + '" y2="' + (r.w[1] + (r.hy - r.w[1]) * .62).toFixed(1) + '"/><ellipse cx="0" cy="0" rx="14" ry="21" transform="translate(' + r.hx.toFixed(1) + ' ' + r.hy.toFixed(1) + ') rotate(' + r.a.toFixed(1) + ')"/>';
      const near = clamp(1 - Math.abs(t - 2) / .35, 0, 1);
      ball.setAttribute('cx', (r.hx + 22).toFixed(1)); ball.setAttribute('cy', (r.hy - 4).toFixed(1)); ball.style.opacity = near;
      ring.innerHTML = near > 0 ? [18, 34, 52].map((q, k) => '<ellipse cx="' + (r.hx + 22).toFixed(1) + '" cy="' + (r.hy + 4).toFixed(1) + '" rx="' + (q * (.5 + near)).toFixed(1) + '" ry="' + (q * (.5 + near) * .5).toFixed(1) + '" opacity="' + (near * (1 - k * .28)).toFixed(2) + '"/>').join('') : '';
      const ph = Math.round(t); lb.textContent = num(ph + 1) + ' / ' + POSES[ph].en;
      dd.textContent = POSES[ph].n + '：' + POSES[ph].d;
      phases.forEach((b, i) => b.setAttribute('aria-pressed', String(i === ph)));
      rg.value = Math.round(t * 100);
      const a = SPD[mode], k = Math.min(a.length - 1, Math.round(t / 3 * (a.length - 1)));
      spD.setAttribute('cx', (k / (a.length - 1) * 300).toFixed(1)); spD.setAttribute('cy', (100 - a[k] * 88).toFixed(1));
      spC.setAttribute('d', 'M' + (k / (a.length - 1) * 300).toFixed(1) + ' 4V104');
    };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; play.setAttribute('aria-pressed', 'false'); play.textContent = '播放'; };
    const anim = () => {
      const t0 = performance.now(), from = t >= 2.99 ? 0 : t, dur = (3 - from) / 3 * 3400;
      play.setAttribute('aria-pressed', 'true'); play.textContent = '暂停';
      const f = now => { const k = clamp((now - t0) / dur, 0, 1); t = from + (3 - from) * k; draw(); if (k < 1) raf = requestAnimationFrame(f); else stop(); };
      raf = requestAnimationFrame(f);
    };
    play.addEventListener('click', () => { if (raf) stop(); else anim(); });
    rg.addEventListener('input', () => { stop(); t = +rg.value / 100; draw(); });
    phases.forEach(b => b.addEventListener('click', () => { stop(); t = +b.dataset.t; draw(); }));
    segs.forEach(b => b.addEventListener('click', () => { mode = b.dataset.m; segs.forEach(x => x.setAttribute('aria-pressed', String(x === b))); curve(); draw(); }));
    curve(); draw();
  };

  // 事件 → 特效 → ADSR 包络
  const EVS = [
    ['BALL_IMPACT', 'ImpactRing', '击球点的半透明涟漪', '骨骼加速度极值、球路曲率突变与击球声峰值，在时间上交叉匹配。'],
    ['BALL_FLIGHT', 'SpeedTrail', '沿球路延伸的拖尾', '球速超过 100 km/h 的配置阈值时触发，宽度随包络变化。'],
    ['ACE_SERVE', 'GlitchFrame', '画面错位', '事件标签为 ACE_SERVE 时选用，标签需核对，不能只凭球速判定。'],
    ['SWING_START', 'FocusBox', '动作开始时的身体框', '挥拍状态进入启动阶段时触发，框的范围由身体关键点确定。']
  ];
  const ENV = { a: .25, d: .35, s: .55, r: .8 }, HOLD = .5;
  const envAt = (p, t) => { const T1 = p.a, T2 = p.a + p.d, T3 = T2 + HOLD, T4 = T3 + p.r; return t < T1 ? t / T1 : t < T2 ? 1 - (1 - p.s) * (t - T1) / p.d : t < T3 ? p.s : t < T4 ? p.s * (1 - (t - T3) / p.r) : 0; };
  const fxDraw = (k, e) => {
    const cx = 190, cy = 150;
    if (k === 0) return '<g fill="none" stroke="#5aaeff" stroke-width="2">' + [20, 40, 62, 88].map((r, j) => { const s = r * (.25 + e * .95); return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + s.toFixed(1) + '" ry="' + (s * .5).toFixed(1) + '" opacity="' + (e * (1 - j * .2)).toFixed(2) + '"/>'; }).join('') + '<path d="M' + (cx - 14) + ' ' + cy + 'h28m-14-14v28" stroke="#ecedef" opacity="' + e.toFixed(2) + '"/></g>';
    if (k === 1) return '<g fill="none"><path d="M40 196Q170 28 316 130" stroke="#5aaeff" stroke-width="' + (2 + 9 * e).toFixed(1) + '" stroke-linecap="round" opacity="' + (.15 + .85 * e).toFixed(2) + '"/><path d="M40 208Q166 52 300 132" stroke="#ecedef" stroke-opacity="' + (e * .5).toFixed(2) + '" stroke-width="1.5"/></g><circle cx="316" cy="130" r="7" fill="#ecedef"/>';
    if (k === 2) { let g = '<g>'; [[40, 18], [74, 26], [108, 12], [142, 30], [176, 16]].forEach(([y, h], i) => { g += '<rect x="' + (60 + (i % 2 ? 1 : -1) * e * 34).toFixed(1) + '" y="' + y + '" width="240" height="' + h + '" fill="#5aaeff" opacity="' + (e * .42).toFixed(2) + '"/>'; }); return g + '<rect x="60" y="30" width="240" height="170" fill="none" stroke="#ecedef" stroke-width="2" opacity="' + e.toFixed(2) + '"/></g>'; }
    const s = 40 + (1 - e) * 80, x0 = 190 - s, x1 = 190 + s, y0 = 130 - s * 1.2, y1 = 130 + s * 1.2, c = 22;
    return '<g fill="none" stroke="#ecedef" stroke-width="3" opacity="' + (.2 + .8 * e).toFixed(2) + '"><path d="M' + x0 + ' ' + (y0 + c) + 'V' + y0 + 'H' + (x0 + c) + 'M' + (x1 - c) + ' ' + y0 + 'H' + x1 + 'V' + (y0 + c) + 'M' + x0 + ' ' + (y1 - c) + 'V' + y1 + 'H' + (x0 + c) + 'M' + (x1 - c) + ' ' + y1 + 'H' + x1 + 'V' + (y1 - c) + '"/></g>';
  };
  const fxPlayer = (p, k, ctx) => { // 球场背景 + 特效
    return '<rect width="360" height="250" fill="#0a1240"/><g fill="none" stroke="#ecedef" stroke-opacity=".5" stroke-width="1.2"><path d="M70 40h220l54 190H16z"/><path d="M52 112h256M36 170h288M180 40v190"/></g><g fill="#ecedef" opacity=".85"><circle cx="118" cy="168" r="7"/><path d="M118 176v28M118 184l-14 12M118 184l16 8M118 204l-8 22M118 204l10 22" stroke="#ecedef" stroke-width="3" fill="none"/></g>' + ctx;
  };
  const fx = () => '<div class="ta-fx" data-ta="fx"><div class="ta-fx-list" role="group" aria-label="选择事件">' + EVS.map((e, i) => '<button type="button" data-i="' + i + '" aria-pressed="' + (i === 0) + '"><span class="mono">' + e[0] + '</span><b>' + e[1] + '</b></button>').join('') + '</div>' +
    '<div class="ta-fx-view"><svg viewBox="0 0 360 250" role="img" aria-label="特效预览"><g class="fx-bg"></g><g class="fx-fx"></g><text x="14" y="238" fill="#d6e4ff" font-size="11" font-family="JetBrains Mono,monospace">原理示意</text></svg><button type="button" class="ta-fx-go">触发 ▶</button></div>' +
    '<div class="ta-fx-info"><span class="mono ev"></span><h4></h4><p class="a"></p><p class="b"></p>' +
    '<div class="ta-adsr"><svg viewBox="0 0 300 110" preserveAspectRatio="none" role="img" aria-label="ADSR 包络曲线"><path class="ad-grid" d="M0 100H300"/><path class="ad-line" fill="none"/><circle class="ad-dot" r="4.5"/></svg>' +
    '<div class="ta-ad-ctl">' + [['a', 'A 起音', .05, 1, .01], ['d', 'D 衰减', .05, 1, .01], ['s', 'S 持续', 0, 1, .01], ['r', 'R 释放', .1, 1.5, .01]].map(([k, l, mn, mx, st]) => '<label><span>' + l + '</span><input type="range" data-k="' + k + '" min="' + mn + '" max="' + mx + '" step="' + st + '" value="' + ENV[k] + '"><output class="mono"></output></label>').join('') + '</div></div></div></div>';
  INIT.fx = el => {
    const bgG = $(el, '.fx-bg'), fxG = $(el, '.fx-fx'), btns = $$(el, '.ta-fx-list button'), go = $(el, '.ta-fx-go'), line = $(el, '.ad-line'), dot = $(el, '.ad-dot'), ins = $$(el, '.ta-ad-ctl input');
    const p = Object.assign({}, ENV); let k = 0, raf = 0;
    const TT = 4;
    const curve = () => { let d = ''; for (let s = 0; s <= 120; s++) { const t = s / 120 * TT; d += (s ? 'L' : 'M') + (t / TT * 300).toFixed(1) + ' ' + (100 - envAt(p, t) * 88).toFixed(1); } line.setAttribute('d', d); ins.forEach(i => { i.nextElementSibling.textContent = (+p[i.dataset.k]).toFixed(2) + (i.dataset.k === 's' ? '' : ' s'); }); };
    const frame = e => { fxG.innerHTML = fxDraw(k, e); };
    const select = i => {
      k = i; btns.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
      $(el, '.ev').textContent = EVS[i][0] + ' → ' + EVS[i][1]; $(el, '.ta-fx-info h4').textContent = EVS[i][1]; $(el, '.ta-fx-info .a').textContent = EVS[i][2]; $(el, '.ta-fx-info .b').textContent = EVS[i][3];
      bgG.innerHTML = fxPlayer(p, i, ''); frame(.0); play();
    };
    const play = () => {
      cancelAnimationFrame(raf); const t0 = performance.now(), total = p.a + p.d + HOLD + p.r;
      const f = now => { const t = (now - t0) / 1000, e = envAt(p, Math.min(t, total)); frame(e); dot.setAttribute('cx', (Math.min(t, TT) / TT * 300).toFixed(1)); dot.setAttribute('cy', (100 - e * 88).toFixed(1)); if (t < total + .2) raf = requestAnimationFrame(f); else { frame(.2); dot.setAttribute('cx', 0); dot.setAttribute('cy', 100); } };
      raf = requestAnimationFrame(f);
    };
    btns.forEach((b, i) => b.addEventListener('click', () => select(i)));
    go.addEventListener('click', play);
    ins.forEach(i => i.addEventListener('input', () => { p[i.dataset.k] = +i.value; curve(); }));
    curve(); select(0);
  };

  // 四种影像语气，用代码画成小画面
  const sty = () => {
    const P0 = lm(poseAt(0)), P2 = lm(poseAt(2));
    const body = (P, c, w, o = 1, dx = 0) => '<g transform="translate(' + dx + ' 0)" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" opacity="' + o + '" fill="none">' + CONN.map(([a, b]) => '<line x1="' + P[a][0].toFixed(0) + '" y1="' + P[a][1].toFixed(0) + '" x2="' + P[b][0].toFixed(0) + '" y2="' + P[b][1].toFixed(0) + '"/>').join('') + '</g>';
    const art = [
      '<svg viewBox="0 0 300 340" aria-hidden="true"><rect width="300" height="340" fill="#ecedef"/>' + body(P0, '#0d1020', 1.2, .9, -30) + '<g fill="#0d1020" opacity=".5"><circle cx="270" cy="30" r="3"/></g><text x="22" y="316" font-size="10" fill="#0d1020" font-family="JetBrains Mono,monospace" opacity=".6">NO. 01 / ARCHIVE</text><path d="M22 296h40" stroke="#0d1020" opacity=".5"/></svg>',
      '<svg viewBox="0 0 300 340" aria-hidden="true"><rect width="300" height="340" fill="#0a1240"/>' + [0, 1, 2, 3, 4].map(i => body(P2, '#5aaeff', 1.6, .12 + .18 * i, -80 + i * 22)).join('') + body(P2, '#ecedef', 2.2, 1, 6) + '<g fill="none" stroke="#5aaeff" stroke-opacity=".5">' + [24, 52, 84].map(r => '<ellipse cx="236" cy="152" rx="' + r + '" ry="' + r * .5 + '"/>').join('') + '</g></svg>',
      '<svg viewBox="0 0 300 340" aria-hidden="true"><rect width="300" height="340" fill="#f8f9fb"/><g fill="none" stroke="#0d1020" stroke-width="1.2"><rect x="30" y="40" width="240" height="260"/><path d="M30 170H270M150 40V300M60 40V300M240 40V300M60 105H240M60 235H240" stroke-opacity=".5"/></g><path d="M52 276Q130 60 232 108" fill="none" stroke="#1f3bff" stroke-width="2.4" stroke-dasharray="4 5"/><g fill="#1f3bff"><circle cx="52" cy="276" r="4"/><circle cx="232" cy="108" r="5"/></g><path d="M52 276l60-20" stroke="#0d1020" stroke-opacity=".6"/><path d="M82 270a30 30 0 0 0-8-14" fill="none" stroke="#0d1020"/><g font-size="10" font-family="JetBrains Mono,monospace" fill="#0d1020"><text x="86" y="266">34°</text><text x="240" y="104">IN</text></g></svg>',
      '<svg viewBox="0 0 300 340" aria-hidden="true"><rect width="300" height="340" fill="#1f3bff"/><g transform="translate(150 170)">' + Array.from({ length: 22 }, (_, i) => { const a = i / 22 * Math.PI * 2, r1 = 32 + (i % 3) * 8, r2 = 150 + (i % 4) * 26, w = .05 + (i % 3) * .02; return '<path d="M' + (Math.cos(a - w) * r1).toFixed(1) + ' ' + (Math.sin(a - w) * r1).toFixed(1) + 'L' + (Math.cos(a) * r2).toFixed(1) + ' ' + (Math.sin(a) * r2).toFixed(1) + 'L' + (Math.cos(a + w) * r1).toFixed(1) + ' ' + (Math.sin(a + w) * r1).toFixed(1) + 'Z" fill="' + (i % 2 ? '#ecedef' : '#0a1240') + '"/>'; }).join('') + '</g><text x="150" y="190" text-anchor="middle" font-size="56" font-weight="900" font-family="Barlow Condensed,Inter Tight,sans-serif" fill="#fff" stroke="#0a1240" stroke-width="8" paint-order="stroke" transform="rotate(-8 150 170)">IMPACT</text></svg>'
    ];
    const T = [['静默档案', 'SILENT ARCHIVE', '克制、留白，突出身体轮廓与个人记录。'], ['律动波纹', 'KINETIC ECHO', '节奏、回声与动作的重复。'], ['几何决策', 'TACTICAL MATRIX', '路线、角度与动作关系。'], ['热烈球场', 'EMOTION SPLASH', '冲击构图与更强烈的动态文字。']];
    return '<ul class="ta-sty">' + T.map(([h, en, d], i) => '<li><div class="ta-sty-a">' + art[i] + '</div><span class="mono">' + num(i + 1) + ' / ' + en + '</span><h4>' + h + '</h4><p>' + d + '</p></li>').join('') + '</ul>' +
      '<ol class="ta-tpl"><li class="mono"><b>cinematic_highlight</b>电影级高光</li><li class="mono"><b>anime_shonen</b>日漫热血</li><li class="mono"><b>arcade_pixel</b>像素街机</li><li class="mono"><b>marvel_blockbuster</b>超级英雄大片</li><li class="mono"><b>post_match_report</b>赛后数据报告</li></ol>';
  };

  ACT.pipeline = (a, i) => ahead(a, i) + '<div class="ta-body">' +
    plate('TA-18 / INPUT', '输入：一份训练记录', dataIn(), 'ta-p-data', '成片从球馆采集的数据里长出来。') +
    plate('TA-19 / SYSTEM', '七模块技术链路', chain(), 'ta-p-chain', '分析层和创作层之间只传一份数据。') +
    plate('TA-20 / POSE', '骨架：33 个点跟着一次挥拍移动', skel(), 'ta-p-skel', '拖动滑块，或者点四个阶段。') +
    plate('TA-21 / EVENT', '事件决定特效在哪一帧出现', fx(), 'ta-p-fx', '选事件、调包络、点触发，看画面怎样变。') +
    plate('TA-22 / LOOK', '四种影像语气', sty(), 'ta-p-sty') + '</div>';

  /* ============ 07 成果产品 ============ */
  const REAL = [
    ['No.1', 'tennis-1', 'tennis-real-1', '32.5 s', '1920×1080', 16 / 9, '真人球场 · 漫画分镜'],
    ['No.2', 'tennis-2', 'tennis-real-2', '44.8 s', '1920×1080', 16 / 9, '真人击球 · 涂鸦叙事'],
    ['No.3', 'tennis-3', 'tennis-real-3', '93.1 s', '1080×1920', 9 / 16, '真人竖屏与动态文字 · 表情与人物表达'],
    ['No.4', 'tennis-4', 'tennis-real-8', '60.1 s', '1080×1920', 9 / 16, '动作轮廓特效 · 真人动作特写'],
    ['No.5', 'tennis-5', 'tennis-real-5', '47.9 s', '1920×1080', 16 / 9, '漫画运动叙事 · 真人运动']
  ];
  const DATAF = [['MAIN', 'main-v6'], ['CHEN', 'chen-v2'], ['YANG', 'yang-v2'], ['LIN', 'lin-v3'], ['VIVIAN', 'vivian-v3']];
  const films = () => {
    const H = 210;
    const strip = REAL.map(([n, f, po, dur, res, ar], i) => '<button type="button" class="ta-fr-f" data-i="' + i + '" aria-pressed="' + (i === 0) + '" style="--w:' + Math.round(H * ar) + 'px" aria-label="' + n + '，' + dur + '，' + res + '"><img src="' + img(po) + '" alt="" draggable="false"><span class="mono ta-fr-n">' + num(i + 1) + '</span><span class="mono ta-fr-t">' + n + ' · ' + dur + '<br>' + res + '</span></button>').join('');
    return '<div class="ta-films" data-ta="films">' +
      '<div class="ta-fr-head"><span class="mono">A / 真人定制成片 · 拖动或点选</span><span class="ta-fr-hint mono" aria-hidden="true">← DRAG →</span></div>' +
      '<div class="ta-reel" tabindex="0" aria-label="五支真人定制成片，可左右拖动"><div class="ta-reel-in">' + strip + '</div></div>' +
      '<div class="ta-fr-play"><figure class="ta-fp-a"><figcaption><b>真人成片 <span data-real-n>No.1</span></b><span data-real-m class="mono">32.5 s · 1920×1080</span></figcaption><video controls preload="none" playsinline poster="' + img(REAL[0][2]) + '" src="media/tennis-1.mp4" aria-label="真人定制成片"></video><p class="ta-fr-note"><span class="mono">画面语言</span><b data-real-k>' + REAL[0][6] + '</b></p></figure>' +
      '<figure class="ta-fp-b"><figcaption><b>数据肖像 <span data-data-n>MAIN</span></b><span class="mono">30 s · 9:16 · 1080×1920</span></figcaption><video controls preload="none" playsinline poster="' + img('tennis-data-main-v6') + '" src="media/tennis-data-main-v6.mp4" aria-label="数据肖像"></video>' +
      '<div class="ta-fr-chips" role="group" aria-label="选择数据肖像">' + DATAF.map(([n, f], i) => '<button type="button" data-d="' + i + '" aria-pressed="' + (i === 0) + '">' + n + '<small class="mono">' + f.split('-')[1] + '</small></button>').join('') + '</div></figure></div>' +
      '<p class="ta-note">真人成片与数据肖像是两组独立作品，没有同帧对应关系；切换时播放器暂停，由观看者决定播放。</p></div>';
  };
  INIT.films = el => {
    const reel = $(el, '.ta-reel'), fs = $$(el, '.ta-fr-f'), vs = $$(el, 'video'), chips = $$(el, '.ta-fr-chips button');
    const pick = i => {
      fs.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
      const [n, f, po, dur, res, ar, kw] = REAL[i]; vs[0].dataset.v = ar < 1 ? '1' : ''; $(el, '[data-real-k]').textContent = kw; vs[0].pause(); vs[0].poster = img(po); vs[0].src = 'media/' + f + '.mp4'; vs[0].load();
      $(el, '[data-real-n]').textContent = n; $(el, '[data-real-m]').textContent = dur + ' · ' + res;
    };
    const pickD = i => {
      chips.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
      const [n, f] = DATAF[i]; vs[1].pause(); vs[1].poster = img('tennis-data-' + f); vs[1].src = 'media/tennis-data-' + f + '.mp4'; vs[1].load(); $(el, '[data-data-n]').textContent = n;
    };
    // 横向拖动：指针按住拖动，移动距离不足 5px 时视为点击
    let down = false, sx = 0, sl = 0, moved = 0;
    reel.addEventListener('pointerdown', e => { if (e.pointerType === 'touch') return; down = true; moved = 0; sx = e.clientX; sl = reel.scrollLeft; reel.classList.add('drag'); });
    window.addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx)); reel.scrollLeft = sl - dx; });
    window.addEventListener('pointerup', () => { down = false; reel.classList.remove('drag'); });
    fs.forEach((b, i) => b.addEventListener('click', e => { if (moved > 5) { e.preventDefault(); moved = 0; return; } pick(i); }));
    chips.forEach((b, i) => b.addEventListener('click', () => pickD(i)));
    vs.forEach(v => v.addEventListener('play', () => vs.filter(x => x !== v).forEach(x => x.pause())));
    reel.addEventListener('keydown', e => { if (e.key === 'ArrowRight') reel.scrollLeft += 220; if (e.key === 'ArrowLeft') reel.scrollLeft -= 220; });
  };

  const SPEC = [
    ['真人定制成片', '5 支，32.5 / 44.8 / 93.1 / 60.1 / 47.9 秒；No.3、No.4 为 1080×1920 竖屏，其余 1920×1080'],
    ['数据肖像', '5 支，30 秒 · 9:16 · 1080×1920 · 30 fps，three.js 底层 + canvas 数据图层'],
    ['目标平台', '抖音 / 小红书 / Instagram Reels / 视频号'],
    ['产品原型', '高保真网站原型：上传 → 分析 → 风格 → 生成 → 观看；轻量与定制两条路径'],
    ['技术链路', '七模块，经 MatchBundle 共享数据契约'],
    ['视觉规范', 'DESIGN.md：十条设计原则与统一 token'],
    ['实体物料', '两张展板；实体交互卡：人格线条、技术栈、效果图'],
    ['获奖', '同济大学设计创意学院信息可视化最佳创作奖（团队，2026 年 6 月）']
  ];
  const spec = () => '<div class="ta-spec"><div class="ta-sp-id"><span class="mono">MODEL</span><b>TA-01</b><em>TENNISATOM<br>身体的肖像</em><i class="ta-sp-bar" aria-hidden="true"></i><span class="mono">2026.06 / 阿里橙狮体育合作<br>乐动力杨浦体育活动中心</span></div><dl>' + SPEC.map(([k, v]) => '<div><dt>' + k + '</dt><dd>' + E(v) + '</dd></div>').join('') + '</dl></div>';

  const intro = () => '<div class="ta-intro"><video controls preload="none" playsinline poster="' + img('tennis-real-10') + '" src="media/tennis-introduction.mp4" aria-label="TennisAtom 项目介绍片"></video><div><span class="mono">PROJECT FILM</span><h4>项目介绍片</h4><p>研究背景、制作流程与最终作品，一支片子讲完。</p><a class="ta-btn" href="https://www.bilibili.com/video/BV1Us3F6LEyz/" target="_blank" rel="noopener">在 Bilibili 观看 ↗</a></div></div>';

  ACT.product = (a, i) => ahead(a, i) + '<div class="ta-body">' +
    plate('TA-23 / FILMS', '真人成片与数据肖像', films(), 'ta-p-films', '胶片条上的画幅按成片的真实比例排列。') +
    plate('TA-24 / SPEC', '产品规格', spec(), 'ta-p-spec') +
    plate('TA-25 / FILM', '整体介绍', intro(), 'ta-p-intro') + '</div>';

  /* ============ 页面入口 ============ */
  const logline = k => {
    const { s, md } = k, tools = (s.meta.find(m => m[0] === 'TOOLS') || [])[1] || '';
    return '<section class="ta-lg" data-noeva aria-label="项目摘要"><div class="ta-lg-head"><span class="mono">TA-00 / SPEC SHEET</span><p class="ta-lg-word" aria-hidden="true">A portrait<br>in motion.</p></div><div class="ta-lg-cols">' +
      [['01', '研究目标', s.logline.q], ['02', '我负责的部分', s.logline.a], ['03', '已完成作品', s.logline.r]].map(([n, h, t]) => '<article><span class="mono">' + n + '</span><h2>' + h + '</h2><p>' + md(t) + '</p></article>').join('') +
      '</div><dl class="ta-lg-tools"><dt class="mono">TOOLS</dt><dd>' + E(tools) + '</dd></dl></section>';
  };

  PG.tennisatom = {
    title: cover,
    logline,
    act: (a, i, k) => (ACT[a.id] ? ACT[a.id](a, i, k) : null),
    after(root) {
      $$(root, '[data-chart]').forEach(el => { if (CHART[el.dataset.chart]) mountChart(el, CHART[el.dataset.chart]); });
      $$(root, '[data-ta]').forEach(el => { const f = INIT[el.dataset.ta]; if (f) { try { f(el); } catch (e) { console.error('[tennisatom]', el.dataset.ta, e); } } });
    }
  };
})();
