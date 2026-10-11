/* Per-scene art direction: title cards & motifs. Shared palette, different composition. */
(() => {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const src = n => (/^(assets|viz|media|demos|downloads)\//.test(n) ? n : /\.\w{3,4}$/.test(n) ? `assets/${n}` : `assets/${n}.webp`);
  const glyphs = l => l.match(/[“‘（《「『]*.[，。、；：？！”’）》」』…—]*/gu) || [];
  const chars = t => `<span class="chars" aria-label="${esc(t)}">${String(t).split('\n').map(l => `<span class="ln" aria-hidden="true">${glyphs(l).map((c, i) => c === ' ' ? ' ' : `<span class="c" style="--i:${i}">${esc(c)}</span>`).join('')}</span>`).join('')}</span>`;
  const hexPath = (cx, cy, r) => Array.from({ length: 6 }, (_, k) => { const a = Math.PI / 3 * k + Math.PI / 6; return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; }).join(' ');

  /* small motif used on home scene cards (and repeated large on title cards) */
  const MOTIF = {
    rally: () => `<svg viewBox="0 0 200 100" class="mt"><circle cx="50" cy="50" r="28"/><rect x="122" y="22" width="56" height="56"/><path d="M78 50 C100 20 100 80 122 50" class="ln"/><text x="100" y="96" text-anchor="middle">A ↔ B</text></svg>`,
    privacy: () => `<div class="mt mt-dlg"><b>授权请求 01/05</b><p>允许读取联系邮箱？</p><span>拒绝</span><span class="y">接受</span></div>`,
    portrait: () => `<svg viewBox="0 0 200 100" class="mt"><path d="M40 80 L70 40 L100 55 L140 20" class="ln"/><circle cx="70" cy="40" r="4"/><circle cx="100" cy="55" r="4"/><circle cx="140" cy="20" r="4"/><text x="104" y="72">33 KEYPOINTS</text></svg>`,
    scoreboard: () => `<svg viewBox="0 0 200 100" class="mt"><path d="M100 10 L150 55 L100 95 L50 55 Z" class="ln"/><rect x="88" y="45" width="24" height="24"/><text x="100" y="40" text-anchor="middle">K-ZONE</text></svg>`,
    operator: () => `<svg viewBox="0 0 200 100" class="mt">${[[40, 30], [70, 47], [40, 64], [100, 30], [100, 64], [130, 47]].map(([x, y], i) => `<polygon points="${hexPath(x, y, 16)}" class="${i === 1 ? 'on' : ''}"/>`).join('')}<text x="160" y="90">«««</text></svg>`,
    scroll: () => `<div class="mt mt-seal">祀<br>戎</div>`,
    afterglow: () => `<svg viewBox="0 0 200 100" class="mt mt-ring">${Array.from({ length: 36 }, (_, i) => { const a = i / 36 * Math.PI * 2, r1 = 20, r2 = 30 + (i % 5) * 3; return `<line x1="${100 + r1 * Math.cos(a)}" y1="${50 + r1 * Math.sin(a)}" x2="${100 + r2 * Math.cos(a)}" y2="${50 + r2 * Math.sin(a)}"/>`; }).join('')}<circle cx="100" cy="50" r="14"/></svg>`,
    compass: () => `<svg viewBox="0 0 200 100" class="mt"><circle cx="100" cy="50" r="40" class="ln"/>${Array.from({ length: 24 }, (_, i) => { const a = i / 24 * Math.PI * 2; return `<line x1="${100 + 34 * Math.cos(a)}" y1="${50 + 34 * Math.sin(a)}" x2="${100 + 40 * Math.cos(a)}" y2="${50 + 40 * Math.sin(a)}"/>`; }).join('')}<path d="M100 18 L108 50 L100 82 L92 50 Z"/></svg>`,
    loop: () => `<svg viewBox="0 0 200 100" class="mt"><path d="M60 50 a40 30 0 1 1 80 0 a40 30 0 1 1 -80 0" class="ln"/><path d="M138 44 l6 8 l-10 0 z"/><text x="100" y="54" text-anchor="middle">MAKE · USE · REUSE</text></svg>`,
    garden: () => `<svg viewBox="0 0 200 100" class="mt"><circle cx="100" cy="50" r="38" class="ln"/><text x="70" y="40" class="v">雾</text><text x="70" y="66" class="v">风</text><text x="130" y="40" class="v">云</text><text x="130" y="66" class="v">月</text></svg>`,
    film: () => `<svg viewBox="0 0 200 100" class="mt">${Array.from({ length: 9 }, (_, i) => `<rect x="${8 + i * 22}" y="6" width="12" height="8"/><rect x="${8 + i * 22}" y="86" width="12" height="8"/>`).join('')}<text x="100" y="56" text-anchor="middle">23:17:02</text></svg>`
  };

  const meta = (s, p) => `<dl class="rv">${(s.meta || [['YEAR', p.year], ['FORMAT', p.status], ['ROLE', p.role, 1]]).map(([k, v, w]) => `<div${w ? ' class="wide"' : ''}><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
  const top = (p, total, s) => `<div class="tc-top"><a class="mono" href="index.html#scene-${p.id}" data-cut="INDEX">← INDEX / 作品目录</a><div class="swatch"><i></i><i></i><span>SCENE ${p.number} / ${total}<br>${esc(p.label)}</span></div></div>`;
  const keyImg = (s, p, cls = '') => `<img class="${cls}" src="${src(s.key || p.cover)}" alt="${esc(p.coverAlt || '')}" fetchpriority="high">`;

  /* title-card compositions */
  const TC = {
    rally: (p, s, T) => `${top(p, T, s)}
      <div class="tr-split clip">
        <figure class="a"><div class="ph">${keyImg(s, p, 'duo')}</div><figcaption class="mono">VIEW A / 训练记录</figcaption></figure>
        <div class="tr-mid"><span class="mono">全项目事件</span><b>2,204</b><span class="mono">12 DPE · 160 条可核对</span></div>
        <figure class="b"><div class="ph"><img class="duo" src="assets/frames/rally-side-frame.webp" alt="项目影片中的侧向场地画面"></div><figcaption class="mono">VIEW B / 项目影片</figcaption></figure>
        <i class="glyph o" aria-hidden="true"></i><i class="glyph s" aria-hidden="true"></i>
      </div>
      <h1 class="tc-name" id="tc-name"><span class="l">${chars('Rally')}</span><span class="r">${chars('Lens')}</span></h1>
      <div class="tc-cols"><p class="sub rv">${esc(s.sub)}</p>${meta(s, p)}</div>`,

    privacy: (p, s, T) => `${top(p, T, s)}
      <div class="tp-stage clip"><div class="ph">${keyImg(s, p, 'duo')}</div>
        ${[['01', '邮箱', '「城市通行证」想读取你的联系邮箱。'], ['02', '定位', '「街区地图」请求持续获取你的精确位置。'], ['03', '画像分析', '「个性推荐」将根据你的行为生成兴趣画像。']].map(([n, t, q], i) => `<div class="dlg d${i}" aria-hidden="true"><div class="bar"><b>PRIVACY CITY</b><span>授权请求 ${n} / 05 · ${t}</span><i>×</i></div><p>${q}</p><div class="fine">条款摘要：数据将用于提供本功能，并可能与合作方共享以改进服务。<span class="redact"></span><span class="redact s"></span></div><div class="btns"><span>拒绝</span><span class="y">接受</span></div></div>`).join('')}
      </div>
      <h1 class="tc-name" id="tc-name">${chars('Privacy City')}</h1>
      <div class="tc-cols"><p class="sub rv">${esc(s.sub)}</p>${meta(s, p)}</div>`,

    portrait: (p, s, T) => `${top(p, T, s)}
      <div class="tpo">
        <figure class="tpo-poster clip"><div class="ph"><img class="duo" src="assets/tennis-poster.webp" alt="项目主视觉海报：THE PORTRAIT OF THE BODY / 身体的肖像" fetchpriority="high"></div><figcaption class="mono">MAIN VISUAL · 2026.06.06 · FINAL PROJECT</figcaption></figure>
        <div class="tpo-id"><h1 class="tc-name" id="tc-name">${chars('Tennis\nAtom')}</h1><p class="tpo-cn">身体的肖像</p>
          <blockquote class="tpo-thesis"><span class="mono">CORE THESIS · 核心立论</span><p>让数据不只是身体的成绩单，而成为身体的一幅肖像。</p></blockquote>
          <ul class="tpo-keys mono"><li>MediaPipe · BlazePose</li><li>Ghost Trail · Freeze Frame</li><li>心流时间设计 · 数据驱动慢放</li></ul></div>
      </div>
      <div class="tc-cols"><p class="sub rv">${esc(s.sub)}</p>${meta(s, p)}</div>`,

    scoreboard: (p, s, T) => `${top(p, T, s)}
      <div class="tsb">
        <div class="board clip"><div class="row h"><span>PLAYER</span><span>ROLE</span><span>RECORDS</span><span>YEARS</span></div>
          <div class="row"><span>YAMAMOTO</span><span>PITCH</span><b data-n="4649">4,649</b><span>24 · 25 · 26</span></div>
          <div class="row"><span>OHTANI</span><span>IMPACT</span><b data-n="6139">6,139</b><span>24 · 25 · 26</span></div>
          <div class="row f"><span>STATCAST / CSV × 4</span><span></span><span>2024.03.20—2026.04.14</span><span>PITCH × IMPACT</span></div></div>
        <figure class="ticket clip"><div class="ph"><img src="assets/frames/bb-title-card.webp" alt="原网站开场：YAMAMOTO × OHTANI DATA CINEMA" fetchpriority="high"></div><figcaption><b>ADMIT ONE</b><span>SCENE ${p.number}</span></figcaption></figure>
        <svg class="diamond" viewBox="0 0 400 400" aria-hidden="true"><path d="M200 30 L370 200 L200 370 L30 200 Z"/><path d="M200 120 L280 200 L200 280 L120 200 Z"/><rect x="180" y="180" width="40" height="40"/></svg>
      </div>
      <h1 class="tc-name" id="tc-name">${chars('Pitch ×\nImpact')}</h1>
      <div class="tc-cols"><p class="sub rv">${esc(s.sub)}</p>${meta(s, p)}</div>`,

    operator: (p, s, T) => `${top(p, T, s)}
      <div class="top-field">
        <svg class="hexes" viewBox="0 0 800 520" aria-hidden="true">${Array.from({ length: 70 }, (_, k) => { const c = k % 10, r = Math.floor(k / 10), x = 40 + c * 78 + (r % 2) * 39, y = 40 + r * 68; return `<polygon points="${hexPath(x, y, 40)}" class="${[23, 34, 35, 45].includes(k) ? 'on' : ''}"/>`; }).join('')}</svg>
        <p class="vert-big" aria-hidden="true">RETURN TO THE STARS</p>
        <div class="op-card clip"><div class="op-h"><b>OPERATOR FILE</b><span>ARTEMIS / 05</span></div><img src="assets/composition/artemis-hero.webp" alt="探索者原设定（宇航员立绘）"><dl><dt>CLASS</dt><dd>STATE MACHINE · COMBAT</dd><dt>UNIT</dt><dd>6 人团队</dd><dt>MY PART</dt><dd>主角与敌人行为 · 2 类机制敌人 · 2 场 Boss</dd></dl><span class="chev">«««««</span></div>
        <figure class="op-shot clip"><div class="ph"><img src="assets/frames/artemis-hex-run.webp" alt="原游戏实录：六边形地块关卡" fetchpriority="high"></div><figcaption class="mono">六边形地块关卡 / 原游戏实录帧</figcaption></figure>
      </div>
      <h1 class="tc-name" id="tc-name">${chars('Artemis')}<small>重返星海</small></h1>
      <div class="tc-cols"><p class="sub rv">${esc(s.sub)}</p>${meta(s, p)}</div>`,

    scroll: (p, s, T) => `${top(p, T, s)}
      <div class="tsc">
        <h1 class="tsc-title" id="tc-name"><span>天命</span><small>祀与戎</small></h1>
        <div class="tsc-strip clip">${Array.from({ length: 10 }, (_, i) => `<figure><img src="assets/bronze-ep${String(i + 1).padStart(2, '0')}-${i === 5 ? 4 : 1}.webp" alt="" loading="${i < 4 ? 'eager' : 'lazy'}"><figcaption>EP.${String(i + 1).padStart(2, '0')}</figcaption></figure>`).join('')}</div>
        <div class="seal" aria-hidden="true">祀<br>戎</div>
        <p class="tsc-motto" aria-hidden="true">国之大事　在祀与戎</p>
      </div>
      <div class="tc-cols"><p class="sub rv">${esc(s.sub)}</p>${meta(s, p)}</div>`,

    afterglow: (p, s, T) => `${top(p, T, s)}
      <div class="tag-stage"><canvas class="ag-live" width="900" height="900" aria-label="实时运行的径向字环（代码重绘）"></canvas>
        <h1 class="tc-name" id="tc-name">${chars('AFTER\nGLOW')}<small>余晖环 · 上海南站</small></h1>
        <p class="ag-read mono" aria-live="off"></p></div>
      <div class="tc-cols"><p class="sub rv">${esc(s.sub)}</p>${meta(s, p)}</div>`,

    compass: (p, s, T) => `${top(p, T, s)}
      <div class="tco">
        <div class="rose clip"><div class="ph">${keyImg(s, p, 'duo')}</div>
          <svg viewBox="0 0 600 600" aria-hidden="true"><circle cx="300" cy="300" r="286" class="o"/><circle cx="300" cy="300" r="250" class="o"/>${Array.from({ length: 72 }, (_, i) => { const a = i / 72 * Math.PI * 2, r2 = i % 6 ? 274 : 262; return `<line x1="${300 + 286 * Math.cos(a)}" y1="${300 + 286 * Math.sin(a)}" x2="${300 + r2 * Math.cos(a)}" y2="${300 + r2 * Math.sin(a)}"/>`; }).join('')}<path d="M300 30 L318 300 L300 570 L282 300 Z" class="needle"/></svg>
          ${[['焦虑努力型', 'n'], ['积极探索型', 'e'], ['受挫明确型', 's'], ['被动适应型', 'w']].map(([t, d]) => `<span class="pt ${d}">${t}</span>`).join('')}</div>
        <div class="tco-id"><h1 class="tc-name" id="tc-name">${chars('Growth\nCompass')}</h1><p class="mono">成长罗盘 · 兴趣导向的设计教育服务</p></div>
      </div>
      <div class="tc-cols"><p class="sub rv">${esc(s.sub)}</p>${meta(s, p)}</div>`,

    loop: (p, s, T) => `${top(p, T, s)}
      <div class="tlo">
        <svg class="loop-ring" viewBox="0 0 600 600" aria-hidden="true"><circle cx="300" cy="300" r="270"/><circle cx="300" cy="300" r="240" class="d"/><text><textPath href="#lp" startOffset="0">MAKE · USE · REUSE · MAKE · USE · REUSE · MAKE · USE · REUSE ·</textPath></text><defs><path id="lp" d="M300 300 m-255 0 a255 255 0 1 1 510 0 a255 255 0 1 1 -510 0"/></defs></svg>
        <figure class="tl-photo clip"><div class="ph">${keyImg(s, p, 'duo')}</div></figure>
        <div class="tl-ticket"><p class="mono">LOOPLAB · RE:CREATE HUB</p><b>No. ${p.number}</b><dl><dt>MATERIAL</dt><dd>板材 / 纸材 / 耗材</dd><dt>SERVICE</dt><dd>交换 · 团购 · 预约 · 档案 · 取件</dd><dt>PICKUP</dt><dd>校园取件点</dd></dl><span class="barcode"></span></div>
      </div>
      <h1 class="tc-name" id="tc-name">${chars('LoopLab')}</h1>
      <div class="tc-cols"><p class="sub rv">${esc(s.sub)}</p>${meta(s, p)}</div>`,

    garden: (p, s, T) => `${top(p, T, s)}
      <div class="tga">
        <div class="moon clip"><div class="ph">${keyImg(s, p)}</div></div>
        <p class="poem" aria-hidden="true"><span>风来水面</span><span>月到天心</span></p>
        <div class="lattice" aria-hidden="true">${['秋', '冬', '春', '夏'].map(k => `<span>${k}</span>`).join('')}</div>
        <h1 class="tga-title" id="tc-name"><span>游园画境</span><small>网师园篇</small></h1>
      </div>
      <div class="tc-cols"><p class="sub rv">${esc(s.sub)}</p>${meta(s, p)}</div>`,

    film: (p, s, T) => `${top(p, T, s)}
      <div class="tfi">
        <div class="slate"><span>ORPHÉE / 025 号片盘</span><b class="tc-run">23:16:50</b><span>FIRST CHAPTER</span></div>
        <div class="gate clip"><div class="sprocket t"></div><div class="ph">${keyImg(s, p)}</div><div class="sprocket b"></div><span class="beam" aria-hidden="true"></span></div>
        <h1 class="tc-name cjk" id="tc-name">${chars('镜外')}</h1>
        <p class="tfi-line mono">OUTSIDE THE MIRROR<br>23:16:50 — 23:17:02 · 缺失的十二秒</p>
      </div>
      <div class="tc-cols"><p class="sub rv">${esc(s.sub)}</p>${meta(s, p)}</div>`
  };

  /* small live behaviours for some title cards */
  const AFTER = {
    afterglow: root => {
      const cv = root.querySelector('.ag-live'); if (!cv) return;
      const ctx = cv.getContext('2d'), read = root.querySelector('.ag-read');
      const D = [[24, 52, 18, 1.2], [58, 65, 22, 1.5], [145, 88, 35, 3.2], [172, 92, 42, 4.5], [98, 78, 40, 3.8], [82, 74, 38, 2.7], [105, 79, 45, 2.5], [89, 76, 48, 2.1], [81, 73, 52, 1.8], [85, 75, 55, 2], [95, 78, 50, 2.3], [130, 84, 48, 3.5], [185, 94, 52, 4.8], [160, 90, 55, 4.2], [115, 82, 58, 3], [90, 77, 62, 2.4], [68, 70, 60, 1.9], [42, 60, 58, 1.4], [15, 50, 52, 1]];
      const T = ['06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '00'];
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      let t0 = performance.now(), raf;
      const frame = now => {
        const t = Math.max(0, now - t0) / 1000, f = (t / 2.2) % D.length, i = Math.floor(f), k = f - i, j = (i + 1) % D.length;
        const v = D[i].map((x, n) => x + (D[j][n] - x) * k), [fl, no, pm, wi] = v;
        const fN = (fl - 15) / 185, nN = (no - 50) / 46, pN = (pm - 15) / 50, wN = (wi - .5) / 4.5;
        ctx.clearRect(0, 0, 900, 900); ctx.save(); ctx.translate(450, 450);
        const maxR = 360, span = maxR * (0.5 + 0.46 * fN), rings = 7, lobes = 3 + Math.round(nN * 5), lean = (wN - .45) * .55;
        ctx.fillStyle = '#f2efe8'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (let r = 0; r < rings; r++) {
          const R = 70 + span * (r + 1) / rings, n = Math.round(14 + R / 9);
          for (let q = 0; q < n; q++) {
            const a = q / n * Math.PI * 2 + t * (0.05 + wN * .12) * (r % 2 ? 1 : -1);
            const warp = Math.sin(a * lobes - t * 1.4 + q * .55) * nN * 18;
            const size = (0.8 + 0.85 * pN) * (9 + r * 1.6);
            ctx.save(); ctx.rotate(a); ctx.translate(0, -(R + warp)); ctx.transform(1, 0, lean, 1, 0, 0);
            ctx.font = `600 ${size.toFixed(1)}px "Inter Tight", sans-serif`; ctx.globalAlpha = .35 + .65 * (r / rings);
            ctx.fillText('AFTERGLOW'[q % 9], 0, 0); ctx.restore();
          }
        }
        ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(0, 0, 54, 0, 7); ctx.fill(); ctx.restore();
        if (read) read.textContent = `${T[i]}:00 · 人流 ${Math.round(fl)} · 噪声 ${Math.round(no)} dB · PM2.5 ${Math.round(pm)} · 风 ${wi.toFixed(1)} m/s`;
        if (!reduce) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    },
    film: root => {
      const el = root.querySelector('.tc-run'); if (!el) return;
      let s = 50; const tick = () => { s = s >= 62 ? 50 : s + 1; el.textContent = `23:${s >= 60 ? '17' : '16'}:${String(s % 60).padStart(2, '0')}`; };
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(tick, 1000);
    },
    scoreboard: root => root.querySelectorAll('.board b[data-n]').forEach(b => {
      const n = +b.dataset.n, t0 = performance.now();
      const st = now => { const k = Math.min(1, (now - t0) / 1400); b.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))).toLocaleString('en-US'); if (k < 1) requestAnimationFrame(st); };
      requestAnimationFrame(st);
    })
  };

  window.THEMES = { TC, MOTIF, AFTER };
})();
