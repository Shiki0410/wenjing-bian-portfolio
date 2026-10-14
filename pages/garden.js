/* 游园画境 — bespoke page. Garden scroll: rice paper, ink, celadon, one autumn orange; round fans and vertical poems.
   References (number = position in _refs/pins.txt):
     title     R501  black field, one round fan carrying a landscape, calligraphy across it
     sheet     R497  紫陽花 — heavy title across the top, three info columns, one big picture
     question  R500  竹影清風 — white paper, brush characters stepping down beside the picture
     seasons   R507  消失生活 — collage of cut-out pictures and big mixed type
     puzzle    R503  white sheet, green segments, one vertical line of poetry
     modes     R498  blurred green bars behind the type
     mine      R495  green circle (moon gate) framing a scene
   Local modules (all written in this file, three@0.160 for the fan):
     gardenFan · gardenWordPuzzle · gardenPuzzleMap · gardenModesMap · gardenMineMap */
(() => {
  const PG = (window.PAGES = window.PAGES || {});
  const M = (window.MODULES = window.MODULES || {});
  const vt = t => `<span class="y-vt">${t}</span>`;

  /* ================================================================
     PAGE TEMPLATES
     ================================================================ */
  PG.garden = {
    title(k) {
      const { p, s, esc } = k;
      return `<section class="y-fan" aria-labelledby="tc-name">
        <p class="yf-ghost" aria-hidden="true">游園</p><p class="yf-verse" aria-hidden="true">${vt('雾来水面　风来水面')}${vt('云到天心　月到天心')}</p>
        <div class="yf-fan"><i class="yf-sun" aria-hidden="true"></i><i class="yf-rim" aria-hidden="true"></i><img src="assets/${s.key}.webp" alt="${esc(s.keyCap)}" fetchpriority="high"><i class="yf-handle" aria-hidden="true"></i></div>
        <h1 class="yf-name" id="tc-name">${vt('游园画境')}</h1>
        <p class="yf-sub">${vt(esc(s.sub))}</p>
        <p class="yf-en mono">WANDERING IN A PAINTED GARDEN · 网师园篇 · ${esc(p.year)}</p>
        <a class="yf-back mono" href="index.html#scene-${p.id}" data-cut="INDEX">← INDEX</a>
        <dl class="yf-meta">${(s.meta || []).map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>
        <p class="yf-cap mono">${esc(s.keyCap)}</p><p class="yf-reg mono" aria-hidden="true">壹 · 贰 · 叁 · 肆</p>
      </section>`;
    },

    logline(k) {
      const { s, md, esc } = k, L = s.logline || {};
      return `<section class="y-hyd" aria-label="项目摘要">
        <h2 class="yh-t" aria-hidden="true">游園画境</h2>
        <ul class="yh-tags mono" aria-hidden="true"><li>AUTUMN</li><li>WINTER</li><li>SPRING</li><li>SUMMER</li></ul>
        <ul class="yh-tags yh-tags2" aria-hidden="true"><li>秋 · 柿红</li><li>冬 · 黛蓝</li><li>春 · 柳绿</li><li>夏 · 荷青</li></ul>
        <div class="yh-stage">
          <div class="yh-l"><p><b>問</b>${md(L.q)}</p><p><b>做</b>${md(L.a)}</p></div>
          <figure class="yh-fig"><img src="assets/garden/frame-8.jpg" alt="网师园水墨视角 · 演示视频截帧" loading="lazy"><i class="yh-x" aria-hidden="true">× ×</i></figure>
          <div class="yh-r"><p><b>果</b>${md(L.r)}</p><ul class="yh-stats">${(s.stats || []).map(([v, l]) => `<li><b>${esc(v)}</b><span>${esc(l)}</span></li>`).join('')}</ul></div>
        </div>
      </section>`;
    },

    act(a, i, k) { const f = this['a_' + a.id]; return f ? f.call(this, a, k, k.use(a)) : null; },

    /* ---- 项目与演示 · R500 ---- */
    a_question(a, k, u) {
      const { esc, md, src } = k;
      return `<header class="y-bamboo">
          <div class="yb-copy"><p class="mono">${esc(a.kicker)} · ${esc(a.open.v)}</p><h2>${md(a.title)}</h2><p class="yb-lead">${md(a.lead)}</p></div>
          <p class="yb-poem" aria-hidden="true">${vt('雾来水面')}${vt('风来水面')}${vt('云到天心')}${vt('月到天心')}</p>
          <i class="yb-rule" aria-hidden="true"></i>
          <figure class="yb-win"><img class="yb-img" src="${src(a.open.img)}" alt="${esc(a.open.cap)}" loading="lazy"><figcaption class="mono">${esc(a.open.cap)}</figcaption></figure>
        </header>
        <section class="y-cinema" aria-label="项目演示视频">
          <p class="yc-v" aria-hidden="true">${vt('夜读入梦')}<i></i>${vt('移字换景')}</p>
          <div class="yc-screen">${u.b(0)}</div>
        </section>
        <section class="y-stills" aria-label="演示视频截帧">
          <p class="ys-k mono">STILLS · 演示视频截帧</p>
          ${[['frame-1', '00:12', '片头 · 水墨卷轴'], ['frame-2', '00:22', '对话 · 穿过“画境之门”'], ['frame-5', '00:52', '池畔 · 遇见史正志'], ['frame-7', '01:16', '月到风来亭']].map(([f, t, c], i) => `<figure class="ys s${i}"><img src="assets/garden/${f}.jpg" alt="${c}" loading="lazy"><figcaption><b class="mono">${t}</b><span>${c}</span></figcaption></figure>`).join('')}
        </section>
        <section class="y-dream" aria-label="${esc(u.o(1).sub)}">
          <h3 class="yh">${esc(u.o(1).sub)}</h3>
          <div class="yd-f">${u.b(2)}</div>
          <div class="yd-t">${u.b(3)}</div>
        </section>
        <section class="y-line" aria-label="${esc(u.o(4).sub)}">
          <h3 class="yh">${esc(u.o(4).sub)}</h3>
          <ol class="yl3">${(u.o(5).list || []).map(([h, t], j) => `<li><b aria-hidden="true">${['一', '二', '三'][j]}</b><h4>${esc(h)}</h4><p>${esc(t)}</p></li>`).join('')}</ol>
        </section>
        ${u.rest()}`;
    },

    /* ---- 四季折扇 · R507 ---- */
    a_seasons(a, k, u) {
      const { esc, md } = k;
      return `<header class="garden-season-header">
          <p class="gs-big" aria-hidden="true">${vt('秋冬春夏')}</p>
          <p class="mono">${esc(a.kicker)}</p><h2>${md(a.title)}</h2><p class="gs-lead">${md(a.lead)}</p>
        </header>
        <section class="garden-season-section">${u.b(0)}</section>
        <section class="y-ui" aria-label="${esc(u.o(1).sub)}"><h3 class="yh">${esc(u.o(1).sub)}</h3>${u.b(2)}</section>
        ${u.rest()}`;
    },

    /* ---- 改字解谜 · R503 ---- */
    a_puzzle(a, k, u) {
      const { esc, md } = k;
      return `<header class="y-poem">
          <img class="yp-seg s1" src="assets/garden/bamboo.svg" alt="" aria-hidden="true"><img class="yp-seg s2" src="assets/garden/bamboo.svg" alt="" aria-hidden="true"><img class="yp-seg s3" src="assets/garden/bamboo.svg" alt="" aria-hidden="true"><i class="yp-bar b1" aria-hidden="true"></i><i class="yp-bar b2" aria-hidden="true"></i>
          <div class="yp-lines" role="img" aria-label="改字的两个例子：雾来水面改成风来水面；云到天心改成月到天心。">
            <p class="yp-l old">${vt('<del>雾</del>来水面')}</p><p class="yp-l new">${vt('<ins>风</ins>来水面')}</p>
            <p class="yp-l old">${vt('<del>云</del>到天心')}</p><p class="yp-l new">${vt('<ins>月</ins>到天心')}</p>
          </div>
          <div class="yp-copy"><figure class="yp-win"><img src="assets/garden/frame-4.jpg" alt="游戏中的奇扇谜题界面 · 演示视频截帧" loading="lazy"></figure><p class="mono">${esc(a.kicker)}</p><h2>${md(a.title)}</h2><p>${md(a.lead)}</p></div>
        </header>
        <section class="y-fanmod" aria-label="改字演示">${u.b(0)}</section>
        <section class="y-pmap" aria-label="解谜机制结构">${u.b(1)}</section>
        <section class="y-guide" aria-label="${esc(u.o(2).sub)}">
          <h3 class="yh">${esc(u.o(2).sub)}</h3>
          ${u.b(3)}
        </section>
        ${u.rest()}`;
    },

    /* ---- 剧情与游览 · R498 ---- */
    a_modes(a, k, u) {
      const { esc, md, src } = k;
      return `<header class="y-blur">
          <i class="yz z1" aria-hidden="true"></i><i class="yz z2" aria-hidden="true"></i><i class="yz z3" aria-hidden="true"></i>
          <figure class="yz-a"><img src="${src(a.open.a)}" alt="${esc(a.open.capA)}" loading="lazy"><figcaption>${esc(a.open.capA)}</figcaption></figure>
          <figure class="yz-b"><img src="${src(a.open.b)}" alt="${esc(a.open.capB)}" loading="lazy"><figcaption>${esc(a.open.capB)}</figcaption></figure>
          <p class="yz-w" aria-hidden="true"><span>解谜</span><i>／</i><span>逛逛</span></p>
          <div class="yz-copy"><p class="mono">${esc(a.kicker)}</p><h2>${md(a.title)}</h2><p>${md(a.lead)}</p></div>
        </header>
        <section class="y-modes-structure" aria-label="剧情与游览的结构">${u.b(0)}</section>
        <section class="y-map" aria-label="游园地图示意">${u.b(1)}</section>
        <section class="y-exhibit" aria-label="${esc(u.o(2).sub)}"><h3 class="yh">${esc(u.o(2).sub)}</h3>${u.b(3)}</section>
        ${u.rest()}`;
    },

    /* ---- 我的模块 · R495 ---- */
    a_mine(a, k, u) {
      const { esc, md, src } = k;
      return `<header class="y-moon">
          <div class="ym-gate"><img src="${src(a.open.img)}" alt="${esc(a.open.cap)}" loading="lazy"></div>
          <p class="ym-script" aria-hidden="true">${esc(a.open.script)}</p>
          <ul class="ym-three" aria-hidden="true"><li>NPC</li><li>CAMERA</li><li>MINI PROGRAM</li></ul>
          <div class="ym-copy"><p class="mono">${esc(a.kicker)}</p><h2>${md(a.title)}</h2><p>${md(a.lead)}</p><small class="mono">${esc(a.open.cap)}</small></div>
        </header>
        <section class="y-pipe" aria-label="模块结构">${u.b(0)}</section>
        <section class="y-tabs" aria-label="${esc(u.o(1).sub)}"><h3 class="yh">${esc(u.o(1).sub)}</h3>${u.b(2)}</section>
        ${u.rest()}`;
    }
  };

  /* ================================================================
     SHARED DATA
     ================================================================ */
  const SEAS = [
    { c: '秋', e: 'autumn', en: 'AUTUMN', col: '#c4622d', cn: '柿红', tag: '南宋 · 史正志', h: '秋 · 南宋 · 史正志',
      d: '玩家梦回网师园初建的南宋，拿到绘梦奇扇，帮史正志实现倚栏观月的心愿。',
      dl: [['人物', '第一任园主史正志'], ['任务', '改字唤来清风与明月'], ['园景', '刚建成的网师园']] },
    { c: '冬', e: 'winter', en: 'WINTER', col: '#4a6275', cn: '黛蓝', tag: '史正志之子', h: '冬 · 萧瑟的园子',
      d: '玩家穿越到冬天，遇见史正志的儿子。园子正陷在低谷，这一章要去安慰新的园主。',
      dl: [['人物', '史正志的儿子'], ['任务', '安慰低谷中的园主'], ['园景', '萧瑟，园子冷落']] },
    { c: '春', e: 'spring', en: 'SPRING', col: '#8aa07a', cn: '柳绿', tag: '后续的园主', h: '春 · 园子慢慢恢复',
      d: '故事继续穿越年代，玩家遇见后来的园主，继续替他们解谜，园景一点点恢复。',
      dl: [['人物', '后续的园主'], ['任务', '帮园主解谜、完成心愿'], ['园景', '复兴的旅程开始']] },
    { c: '夏', e: 'summer', en: 'SUMMER', col: '#4f8577', cn: '荷青', tag: '终章', h: '夏 · 终章',
      d: '最后一个章节。历任园主的心愿都完成以后，游戏播放一段动画，为穿越四季的游园收尾。',
      dl: [['人物', '历任园主'], ['任务', '完成最后的心愿'], ['园景', '复兴；解锁终章动画']] }
  ];
  const IMG = e => `assets/garden-${e}.webp`;

  /* 2D stand-in for the fan (used when WebGL or the CDN is unavailable): same controls, same state */
  const sector = (open) => {
    const a = open ? 1.1 : .07, cx = 320, cy = 330, r0 = 70, r1 = 290;
    const pt = (ang, radius) => [cx + Math.sin(ang) * radius, cy - Math.cos(ang) * radius];
    const o1 = pt(-a, r1), o2 = pt(a, r1), i1 = pt(-a, r0), i2 = pt(a, r0);
    return `M${i1} L${o1} A${r1},${r1} 0 0 1 ${o2} L${i2} A${r0},${r0} 0 0 0 ${i1} Z`;
  };
  const flatFan = (i, open) => {
    const a = open ? 1.1 : .07, cx = 320, cy = 330, r1 = 290, pt = (ang, rad) => [cx + Math.sin(ang) * rad, cy - Math.cos(ang) * rad];
    return `<svg viewBox="0 0 640 350" role="img" aria-label="${SEAS[i].c}季扇面 · ${open ? '展开' : '收拢'} · 二维备用视图"><defs><clipPath id="gf-clip"><path d="${sector(open)}"/></clipPath></defs><image href="${IMG(SEAS[i].e)}" x="40" y="40" width="560" height="315" preserveAspectRatio="xMidYMid slice" clip-path="url(#gf-clip)"/><path d="${sector(open)}" fill="none" stroke="#c9b98d" stroke-width="3"/>${Array.from({ length: 17 }, (_, n) => { const q = pt(-a + 2 * a * n / 16, r1); const q0 = pt(-a + 2 * a * n / 16, 70); return `<path d="M${cx},${cy}L${q0}M${q0}L${q}" stroke="#c9b98d" stroke-width="1.6" opacity=".7"/>`; }).join('')}<circle cx="${cx}" cy="${cy}" r="7" fill="#1f2b4a"/></svg>`;
  };

  /* ================================================================
     gardenFan — four seasons on one fan (three@0.160, written here)
     ================================================================ */
  M.gardenFan = {
    html: () => `<section class="gf" data-noeva aria-label="四季折扇">
      <p class="gf-ink" aria-hidden="true">${SEAS.map((s, i) => `<span${i ? '' : ' class="on"'}>${s.c}</span>`).join('')}</p>
      <div class="gf-tabs" role="group" aria-label="切换章节 · 四季色谱">${SEAS.map((s, i) => `<button type="button" data-s="${i}" aria-pressed="${!i}" style="--c:${s.col}"><b>${s.c}</b><span class="mono">${s.en}</span><em>${s.tag}</em><i class="mono">${s.cn} ${s.col}</i></button>`).join('')}</div>
      <div class="gf-stage" tabindex="0" role="group" aria-label="三维折扇。拖动或按左右方向键转动，按钮切换季节。">
        <div class="gf-fb">${flatFan(0, true)}</div><div class="gf-gl"></div>
        <p class="gf-hint mono">DRAG · ← →</p><p class="gf-no mono">01 / 04</p>
      </div>
      <div class="gf-side">
        <article class="gf-copy"><p class="mono gf-eyebrow">CHAPTER 01 / 04</p><h3 class="gf-h"></h3><p class="gf-d"></p><dl class="gf-dl"></dl></article>
        <div class="gf-ctl"><button type="button" data-fold="close">收扇</button><button type="button" data-fold="open" aria-pressed="true">开扇</button>
          <label>扇面角度<input type="range" min="-50" max="50" value="0" aria-label="扇面角度"></label></div>
        <p class="gf-state" aria-live="polite"></p>
        <p class="garden-source">四季画面来自团队游戏。折扇是页面里的三维展示模型；点击季节时折扇会收起再展开，换上那一章的画面。</p>
      </div>
    </section>`,
    init(el) {
      const q = s => el.querySelector(s), qa = s => [...el.querySelectorAll(s)];
      const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
      let sel = 0, want = true, pend = null, open = 1, yawBase = 0, yawDrag = 0, pitch = 0, drag = null, gl = null, t0 = 0, visible = true, raf = 0;
      const text = () => {
        const s = SEAS[sel];
        qa('[data-s]').forEach(b => b.setAttribute('aria-pressed', Number(b.dataset.s) === sel));
        qa('.gf-ink span').forEach((n, i) => n.classList.toggle('on', i === sel));
        q('.gf-eyebrow').textContent = `CHAPTER 0${sel + 1} / 04`;
        q('.gf-h').textContent = s.h; q('.gf-d').textContent = s.d;
        q('.gf-dl').innerHTML = s.dl.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('');
        q('.gf-no').textContent = `0${sel + 1} / 04`;
        q('[data-fold="open"]').setAttribute('aria-pressed', want); q('[data-fold="close"]').setAttribute('aria-pressed', !want);
        q('.gf-state').textContent = `${s.c}季 · ${want ? '已展开' : '已收拢'}`;
        el.dataset.season = sel; el.dataset.open = want ? 1 : 0;
      };
      const flat = () => { q('.gf-fb').innerHTML = flatFan(sel, want); q('.gf-fb').style.transform = `perspective(900px) rotateY(${yawBase}deg)`; };
      const pick = i => { if (i === sel && pend === null) return; if (gl && want) { pend = i; sel = i; text(); } else { sel = i; text(); if (gl) gl.tex(sel); else flat(); } };
      qa('[data-s]').forEach(b => b.addEventListener('click', () => pick(Number(b.dataset.s))));
      qa('[data-fold]').forEach(b => b.addEventListener('click', () => { want = b.dataset.fold === 'open'; text(); if (!gl) flat(); }));
      q('input').addEventListener('input', e => { yawBase = Number(e.target.value); yawDrag = 0; if (!gl) flat(); });
      const stage = q('.gf-stage');
      stage.addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { yawBase = Math.max(-50, Math.min(50, yawBase + (e.key === 'ArrowLeft' ? -6 : 6))); q('input').value = yawBase; yawDrag = 0; if (!gl) flat(); e.preventDefault(); } });
      stage.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse' && e.button) return; drag = { x: e.clientX, y: e.clientY, yb: yawBase, pb: pitch, on: false }; });
      addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (!drag.on && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) { drag.on = true; try { stage.setPointerCapture(e.pointerId); } catch (_) {} } if (drag.on) { yawBase = Math.max(-50, Math.min(50, drag.yb + dx * .22)); pitch = Math.max(-14, Math.min(14, drag.pb + dy * .08)); q('input').value = yawBase; if (!gl) flat(); } });
      const up = () => { drag = null; }; addEventListener('pointerup', up); addEventListener('pointercancel', up);
      text(); flat();

      import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js').then(T => {
        if (!el.isConnected) return;
        const host = q('.gf-gl');
        const renderer = new T.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); host.append(renderer.domElement);
        renderer.domElement.setAttribute('aria-hidden', 'true');
        const scene = new T.Scene(), cam = new T.PerspectiveCamera(30, 1, .1, 60);
        cam.position.set(0, -.35, 9.9); cam.lookAt(0, -.5, 0);
        scene.add(new T.HemisphereLight(0xffffff, 0xcfc4a6, 1.25));
        const sun = new T.DirectionalLight(0xffffff, 1.7); sun.position.set(-3.5, 5, 7); scene.add(sun);
        const root = new T.Group(); scene.add(root);
        const fan = new T.Group(); fan.position.y = -1.7; root.add(fan);

        /* geometry constants */
        const N = 17, SEG = N - 1, SPAN = 2.2, R0 = .8, R1 = 3.05, RL = 3.35, CLOSED = .13;
        const geo = new T.BufferGeometry(), pos = new Float32Array(SEG * 6 * 3), uv = new Float32Array(SEG * 6 * 2), ix = [];
        for (let s = 0; s < SEG; s++) { const b = s * 6; ix.push(b, b + 2, b + 1, b + 2, b + 3, b + 1, b + 2, b + 4, b + 3, b + 4, b + 5, b + 3); }
        geo.setAttribute('position', new T.BufferAttribute(pos, 3)); geo.setAttribute('uv', new T.BufferAttribute(uv, 2)); geo.setIndex(ix);
        const bx0 = -R1 * Math.sin(SPAN / 2), bx1 = -bx0, by0 = R0 * Math.cos(SPAN / 2), by1 = R1;
        const fixUV = aspect => {
          const bw = bx1 - bx0, bh = by1 - by0, ba = bw / bh; let uw = 1, vh = 1; if (aspect > ba) uw = ba / aspect; else vh = aspect / ba;
          const u0 = (1 - uw) / 2, v0 = (1 - vh) / 2;
          for (let s = 0; s < SEG; s++) {
            const a0 = -SPAN / 2 + SPAN * s / SEG, a1 = -SPAN / 2 + SPAN * (s + 1) / SEG, am = (a0 + a1) / 2;
            [[a0, R0], [a0, R1], [am, R0], [am, R1], [a1, R0], [a1, R1]].forEach(([a, r], n) => { const x = r * Math.sin(a), y = r * Math.cos(a); uv[(s * 6 + n) * 2] = u0 + uw * (x - bx0) / bw; uv[(s * 6 + n) * 2 + 1] = v0 + vh * (y - by0) / bh; });
          }
          geo.attributes.uv.needsUpdate = true;
        };
        fixUV(1.78);
        const front = new T.MeshStandardMaterial({ roughness: .92, metalness: 0, emissive: 0xffffff, emissiveIntensity: .38, color: 0xf2ecdc });
        const back = new T.MeshStandardMaterial({ color: 0xe9dcbc, roughness: 1, side: T.BackSide });
        const paperF = new T.Mesh(geo, front), paperB = new T.Mesh(geo, back); front.side = T.FrontSide; fan.add(paperF, paperB);

        const bamboo = new T.MeshStandardMaterial({ color: 0xc9b98d, roughness: .55 }), guardM = new T.MeshStandardMaterial({ color: 0x6b4630, roughness: .5 });
        const ribs = Array.from({ length: N }, (_, i) => {
          const edge = i === 0 || i === N - 1, w = edge ? .16 : .062, m = new T.Mesh(new T.BoxGeometry(w, RL + (edge ? .1 : 0), edge ? .035 : .016), edge ? guardM : bamboo);
          m.geometry.translate(0, (RL + (edge ? .1 : 0)) / 2 - .35, 0); fan.add(m); return m;
        });
        const rivet = new T.Mesh(new T.CylinderGeometry(.09, .09, .22, 16), new T.MeshStandardMaterial({ color: 0xc8a24a, metalness: .6, roughness: .35 })); rivet.rotation.x = Math.PI / 2; rivet.position.z = .02; fan.add(rivet);
        const tassel = new T.Group(); tassel.position.set(0, -.38, .06); fan.add(tassel);
        tassel.add(Object.assign(new T.Mesh(new T.SphereGeometry(.09, 14, 10), new T.MeshStandardMaterial({ color: 0xd9772b, roughness: .6 })), {}));
        [0xd9772b, 0x5c8f6c, 0xd9772b, 0x5c8f6c, 0xd9772b].forEach((c, n) => { const th = new T.Mesh(new T.CylinderGeometry(.012, .012, .62, 5), new T.MeshStandardMaterial({ color: c })); th.position.set((n - 2) * .03, -.34, 0); th.rotation.z = (n - 2) * .05; tassel.add(th); });

        const ease = v => v * v * (3 - 2 * v);
        const pose = (o) => {
          const e = ease(Math.max(0, Math.min(1, o))), sp = CLOSED + (SPAN - CLOSED) * e, d = N - 1;
          const ac = i => -sp / 2 + sp * i / d, zr = i => (i - d / 2) * .021 * (1 - e);
          ribs.forEach((m, i) => { m.rotation.z = -ac(i); m.position.set(0, 0, zr(i)); m.position.z += (i === 0 || i === N - 1) ? 0 : 0; });
          for (let s = 0; s < SEG; s++) {
            const aL = ac(s), aR = ac(s + 1), zL = zr(s) - .012, zR = zr(s + 1) - .012, sign = s % 2 ? 1 : -1;
            [R0, R1].forEach((r, k) => {
              const lx = r * Math.sin(aL), ly = r * Math.cos(aL), rx = r * Math.sin(aR), ry = r * Math.cos(aR);
              const w0 = r * SPAN / SEG, ch = Math.hypot(rx - lx, ry - ly);
              const dep = Math.sqrt(Math.max(0, (w0 / 2) ** 2 - (ch / 2) ** 2)) * .92 + .014 * e;
              const set = (n, x, y, z) => { const o = (s * 6 + n * 2 + k) * 3; pos[o] = x; pos[o + 1] = y; pos[o + 2] = z; };
              set(0, lx, ly, zL); set(1, (lx + rx) / 2, (ly + ry) / 2, (zL + zR) / 2 + sign * dep); set(2, rx, ry, zR);
            });
          }
          geo.attributes.position.needsUpdate = true; geo.computeVertexNormals();
        };
        const textures = [], loader = new T.TextureLoader();
        SEAS.forEach((s, i) => loader.load(IMG(s.e), tx => { tx.colorSpace = T.SRGBColorSpace; tx.anisotropy = 4; textures[i] = tx; if (i === sel) apply(sel); }, undefined, () => {}));
        const apply = i => { const tx = textures[i]; if (!tx) return; front.map = tx; front.emissiveMap = tx; front.needsUpdate = true; fixUV(tx.image.width / tx.image.height); };
        const size = () => { const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); cam.aspect = w / h; cam.position.z = w / h < 1.25 ? 9.9 * (1.25 / (w / h)) ** .85 : 9.9; cam.updateProjectionMatrix(); draw(); };
        let yawNow = 0, pitchNow = 0;
        const draw = () => { pose(open); root.rotation.y = yawNow * Math.PI / 180; root.rotation.x = -pitchNow * Math.PI / 180; renderer.render(scene, cam); };
        const step = dt => {
          const target = pend !== null ? 0 : (want ? 1 : 0);
          if (calm) open = target; else open += (target - open) * Math.min(1, dt * (pend !== null ? 9 : 5.5));
          if (Math.abs(target - open) < .004) open = target;
          if (pend !== null && open <= .03) { apply(pend); pend = null; }
          t0 += dt; const sway = (drag && drag.on) || calm ? 0 : Math.sin(t0 * .7) * 4;
          yawNow += ((yawBase + yawDrag + sway) - yawNow) * Math.min(1, dt * 8); pitchNow += (pitch - pitchNow) * Math.min(1, dt * 8);
          tassel.rotation.z = Math.sin(t0 * 1.6) * .1 * (calm ? 0 : 1);
          draw();
        };
        let last = 0;
        const loop = ts => { if (!visible || !el.isConnected) { raf = 0; return; } const dt = Math.min(.05, (ts - last) / 1000 || .016); last = ts; step(dt); raf = requestAnimationFrame(loop); };
        new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); } }).observe(el);
        new ResizeObserver(size).observe(host);
        gl = { tex: i => { apply(i); }, step };
        el._fanStep = ms => step(ms / 1000);
        el.classList.add('gf-3d'); el.dataset.fan = '3d';
        size(); apply(sel);
        addEventListener('pagehide', () => { renderer.dispose(); geo.dispose(); }, { once: true });
      }).catch(err => { el.dataset.fan = '2d'; console.warn('garden fan: 2D fallback', err); });
    }
  };

  /* ================================================================
     gardenWordPuzzle — take a character out, put another in, watch the garden answer
     Real UI frames come from the team's public demo video; the two ink scenes are drawn in code (示意).
     ================================================================ */
  const PUZ = [
    { id: 'mist', verse: ['雾', '来', '水', '面'], src: '公开介绍里的例子：把“雾来水面”改成“风来水面”，清风吹散池面上的雾。',
      wish: '打开被雾遮住的池景', before: '水面起了雾，池景被遮住了。取下“雾”字，看看能换成什么。',
      opts: [
        { c: '风', k: 'ok', m: '空气流动', t: '清风拂过水面，雾被吹散，水面起波纹。', r: '回应：是。这是公开介绍里的改法。' },
        { c: '雨', k: 'rain', m: '落下的水', t: '雨点打在水面，涟漪一圈圈荡开，雾还在。', r: '回应：否（演示用的示意反馈）。' },
        { c: '日', k: 'sun', m: '太阳', t: '日光透出，雾变薄了一些，水面仍然不动。', r: '回应：否（演示用的示意反馈）。' }
      ] },
    { id: 'moon', verse: ['云', '到', '天', '心'], src: '公开介绍里的例子：把“云到天心”改成“月到天心”，明月高悬，成全史正志倚栏观月。',
      wish: '史正志倚栏观月', before: '天心有云，月亮被遮住了。取下“云”字，看看能换成什么。',
      opts: [
        { c: '月', k: 'ok', m: '明月', t: '云散开，月亮高悬，水面映出月影。', r: '回应：是。对应史正志倚栏观月的心愿。' },
        { c: '星', k: 'star', m: '星辰', t: '星点一颗颗亮起，云仍然盖着月亮。', r: '回应：否（演示用的示意反馈）。' },
        { c: '日', k: 'sun', m: '太阳', t: '天色转亮，云变薄了，月亮不见了。', r: '回应：否（演示用的示意反馈）。' }
      ] }
  ];
  const GW_FRAMES = [['puz-39', '00:39', '取字：句子里亮着的字可以被取下'], ['frame-4', '00:42', '改好：“重雾散去，豁然开朗”'], ['puz-57', '00:57', '另一道题：选字回应水面'], ['puz-63', '01:03', '谜题界面：四周圆点是可取的字']];
  const sceneSvg = id => id === 'mist'
    ? `<svg class="gw-svg" viewBox="0 0 640 360" role="img" aria-label="池面景象（示意）"><title>雾来水面 / 风来水面（示意）</title>
        <defs><linearGradient id="gm-sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6e0cd"/><stop offset="1" stop-color="#f3eee0"/></linearGradient><linearGradient id="gm-wt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9c8c4"/><stop offset="1" stop-color="#7f9a9a"/></linearGradient><filter id="gm-bl"><feGaussianBlur stdDeviation="9"/></filter></defs>
        <rect width="640" height="360" fill="url(#gm-sk)"/>
        <circle class="sun" cx="506" cy="86" r="30" fill="#c4622d" opacity=".0"/>
        <path d="M0 190Q80 120 170 170T330 140T500 176T640 130V240H0Z" fill="#14161c" opacity=".14"/><path d="M0 214Q110 160 220 200T420 176T640 196V250H0Z" fill="#2f4a5a" opacity=".3"/>
        <rect y="226" width="640" height="134" fill="url(#gm-wt)"/>
        <g class="ripples" fill="none" stroke="#f3eee0" stroke-width="2.4" stroke-linecap="round" opacity="0"><path d="M60 262Q100 254 140 262T220 262"/><path d="M280 288Q330 278 380 288T480 288"/><path d="M420 248Q470 240 520 248T600 248"/><path d="M110 316Q170 306 230 316T350 316"/></g>
        <g class="raincircles" fill="none" stroke="#f3eee0" stroke-width="2.2" opacity="0"><ellipse cx="150" cy="270" rx="22" ry="6"/><ellipse cx="310" cy="300" rx="30" ry="8"/><ellipse cx="470" cy="262" rx="20" ry="5"/><ellipse cx="540" cy="316" rx="28" ry="7"/></g>
        <g class="pav"><path d="M70 226V150H230V226" fill="none" stroke="#14161c" stroke-width="5"/><path d="M48 156L150 92L252 156Q150 140 48 156Z" fill="#14161c"/><path d="M104 176H196M150 156V226" stroke="#14161c" stroke-width="3"/><path d="M70 246H230M100 262H200" stroke="#14161c" stroke-width="2.4" opacity=".25"/></g>
        <g class="willow" fill="none" stroke="#2f4a5a" stroke-width="2.6" stroke-linecap="round"><path d="M330 60Q352 150 340 220M352 52Q384 130 372 214M310 76Q326 140 318 206M374 60Q408 140 398 210"/><path d="M330 60Q372 24 420 40" stroke-width="5"/></g>
        <g class="rain" stroke="#14161c" stroke-width="1.6" opacity="0">${Array.from({ length: 26 }, (_, i) => `<path d="M${30 + i * 24} ${20 + (i * 37) % 120}l-6 22"/>`).join('')}</g>
        <g class="mist" filter="url(#gm-bl)" fill="#faf7ee"><ellipse cx="170" cy="236" rx="260" ry="40" opacity=".92"/><ellipse cx="470" cy="270" rx="280" ry="36" opacity=".92"/><ellipse cx="320" cy="190" rx="220" ry="30" opacity=".75"/><ellipse cx="560" cy="210" rx="170" ry="30" opacity=".8"/></g>
        <g class="wind" fill="none" stroke="#faf7ee" stroke-width="4" stroke-linecap="round" opacity="0"><path d="M300 120H520Q570 120 566 88"/><path d="M250 168H590"/><path d="M360 214H540Q580 214 574 244"/></g>
      </svg>`
    : `<svg class="gw-svg" viewBox="0 0 640 360" role="img" aria-label="天心景象（示意）"><title>云到天心 / 月到天心（示意）</title>
        <defs><linearGradient id="gn-sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#101a30"/><stop offset="1" stop-color="#2f4a5a"/></linearGradient><radialGradient id="gn-halo"><stop offset="0" stop-color="#fff3c8" stop-opacity=".8"/><stop offset="1" stop-color="#fff3c8" stop-opacity="0"/></radialGradient><filter id="gn-bl"><feGaussianBlur stdDeviation="4"/></filter></defs>
        <rect width="640" height="360" fill="url(#gn-sk)"/><rect class="dayfill" width="640" height="360" fill="#e9dcc0" opacity="0"/>
        <g class="stars" fill="#f3ede0">${[[60, 50], [130, 110], [210, 40], [300, 90], [380, 36], [560, 60], [600, 140], [90, 170], [250, 150], [430, 130]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 ? 1.6 : 2.4}" opacity=".6"/>`).join('')}</g>
        <g class="starsup" fill="#fff3c8" opacity="0">${[[80, 80], [170, 60], [330, 60], [510, 40], [600, 90], [540, 170], [40, 150], [420, 100]].map(([x, y]) => `<path d="M${x} ${y - 7}L${x + 2} ${y - 2}L${x + 7} ${y}L${x + 2} ${y + 2}L${x} ${y + 7}L${x - 2} ${y + 2}L${x - 7} ${y}L${x - 2} ${y - 2}Z"/>`).join('')}</g>
        <g class="moon" opacity="0"><circle cx="470" cy="100" r="86" fill="url(#gn-halo)"/><circle cx="470" cy="100" r="40" fill="#f6efd4"/></g>
        <path d="M0 262Q160 232 330 258T640 244V360H0Z" fill="#0c1424"/>
        <g class="refl" opacity="0"><ellipse cx="470" cy="300" rx="60" ry="9" fill="#f6efd4" opacity=".7"/><ellipse cx="470" cy="318" rx="34" ry="5" fill="#f6efd4" opacity=".5"/></g>
        <g class="pav"><path d="M70 262V176H214V262" fill="#0c1424" stroke="#c9b98d" stroke-width="3"/><path d="M48 182L142 118L236 182Q142 166 48 182Z" fill="#0c1424" stroke="#c9b98d" stroke-width="3" stroke-linejoin="round"/><path d="M96 200H188" stroke="#c9b98d" stroke-width="3"/></g>
        <g class="cloud" fill="#6c7e96" filter="url(#gn-bl)"><path d="M380 112Q410 58 450 96Q486 52 520 94Q580 82 586 134H372Z"/><path d="M300 150Q340 112 380 146Q420 124 450 150H300Z" opacity=".8"/><path d="M500 60Q540 28 580 58Q620 54 626 82H492Z" opacity=".8"/></g>
      </svg>`;

  M.gardenWordPuzzle = {
    html: () => `<section class="gw" data-noeva aria-label="改字演示">
      <div class="gw-head"><div><p class="mono">WORD → LANDSCAPE · 改字演示</p><h3>取下一个字，换成另一个，看园子怎么回应</h3></div><div class="gw-pick" role="group" aria-label="选择谜题">${PUZ.map((p, i) => `<button type="button" data-ex="${i}" aria-pressed="${!i}"><b>${p.verse.join('')}</b><span class="mono">谜题 0${i + 1}</span></button>`).join('')}</div></div>
      <ol class="gw-steps" aria-label="三个动作"><li><button type="button" data-step="0"><b>1</b><span>取字</span><em>点亮着的字</em></button></li><li><button type="button" data-step="1"><b>2</b><span>换字</span><em>选一个候选字</em></button></li><li><button type="button" data-step="2"><b>3</b><span>看景</span><em>景物回应</em></button></li></ol>
      <div class="gw-body">
        <div class="gw-left">
          <div class="gw-stage"><div class="gw-a"></div><div class="gw-b" aria-hidden="true"></div><i class="gw-line" aria-hidden="true"></i><span class="gw-tag a mono">换字后</span><span class="gw-tag b mono">换字前</span></div>
          <label class="gw-cmp">拖动对比<input type="range" min="0" max="100" value="0" aria-label="换字前后对比"><span class="mono">← 换字后 · 换字前 →</span></label>
          <div class="gw-frames"><p class="mono">游戏里的真实界面 · 演示视频截帧</p><ul>${GW_FRAMES.map(([f, t, c]) => `<li><img src="assets/garden/${f}.jpg" alt="${c}" loading="lazy"><span><b class="mono">${t}</b>${c}</span></li>`).join('')}</ul></div>
        </div>
        <div class="gw-right">
          <p class="gw-src mono"></p>
          <div class="gw-verse" role="group" aria-label="诗句"></div>
          <p class="gw-msg" aria-live="polite"></p>
          <div class="gw-chips" role="group" aria-label="候选字"></div>
          <table class="gw-tab"><caption class="mono">每个字对应的景物变化</caption><thead><tr><th>字</th><th>字义</th><th>景物</th></tr></thead><tbody></tbody></table>
          <button type="button" class="gw-reset" data-reset>复原这道题</button>
        </div>
      </div>
      <p class="garden-source">四张真实界面截自团队公开演示视频；两幅水墨场景是代码绘制的示意。只有“风”和“月”来自公开介绍，其余候选字的反馈是演示用的示意，不代表游戏判定；谜题与判定由团队设计，页面里不运行游戏。</p>
    </section>`,
    init(el) {
      const q = s => el.querySelector(s), qa = s => [...el.querySelectorAll(s)];
      let ex = 0, st = 0, pick = -1;
      const classes = () => { const p = PUZ[ex], k = st === 2 && pick >= 0 ? p.opts[pick].k : ''; return 'gw-svg' + (k ? ' res-' + k : ''); };
      const mount = () => { const p = PUZ[ex]; if (q('.gw-stage').dataset.id !== p.id) { q('.gw-a').innerHTML = sceneSvg(p.id); q('.gw-b').innerHTML = sceneSvg(p.id).replace(/id="(gm|gn)-/g, 'id="b$1-').replace(/url\(#(gm|gn)-/g, 'url(#b$1-'); q('.gw-stage').dataset.id = p.id; } };
      const draw = () => {
        const p = PUZ[ex], o = pick >= 0 ? p.opts[pick] : null;
        mount();
        qa('[data-ex]').forEach(b => b.setAttribute('aria-pressed', Number(b.dataset.ex) === ex));
        qa('[data-step]').forEach(b => { const n = Number(b.dataset.step); b.closest('li').classList.toggle('on', n <= st); b.closest('li').classList.toggle('now', n === st); b.setAttribute('aria-current', n === st ? 'step' : 'false'); });
        q('.gw-a svg').setAttribute('class', classes());
        q('.gw-stage').dataset.s = st;
        q('.gw-src').textContent = p.src;
        const ch = st === 2 && o ? o.c : p.verse[0];
        q('.gw-verse').innerHTML = p.verse.map((c, i) => i === 0
          ? (st === 1 ? `<span class="gw-ch gap" aria-label="空位"></span>` : `<button type="button" class="gw-ch ${st === 0 ? 'hot' : (o && o.k === 'ok' ? 'ok' : 'bad')}" data-take aria-label="${st === 0 ? '取下“' + c + '”' : '再取下“' + ch + '”换一个'}">${ch}</button>`)
          : `<span class="gw-ch">${c}</span>`).join('');
        q('.gw-chips').innerHTML = p.opts.map((x, i) => `<button type="button" class="gw-chip${st === 2 && pick === i ? ' sel ' + (x.k === 'ok' ? 'ok' : 'bad') : ''}" data-put="${i}" ${st === 0 ? 'disabled' : ''}><b>${x.c}</b><span>${x.m}</span></button>`).join('');
        q('.gw-msg').innerHTML = st === 0 ? p.before : st === 1 ? '字被取下了，空位在等一个字。选一个候选字放进去。' : `<b class="${o.k === 'ok' ? 'ok' : 'bad'}">${o.k === 'ok' ? '对了 · ' : '换了个字 · '}${p.verse[0]} → ${o.c}</b>${o.t}<br><small>${o.r}</small>`;
        q('.gw-tab tbody').innerHTML = p.opts.map((x, i) => `<tr class="${st === 2 && pick === i ? 'on' : ''}"><td><b>${x.c}</b></td><td>${x.m}</td><td>${x.t}${x.k === 'ok' ? ' <i>公开介绍</i>' : ''}</td></tr>`).join('');
        q('.gw-reset').disabled = st === 0;
        const rg = q('.gw-cmp input'); rg.disabled = st !== 2; q('.gw-stage').classList.toggle('cmp', st === 2); setX(st === 2 ? Number(rg.value) : 0);
      };
      const setX = v => { q('.gw-stage').style.setProperty('--x', v + '%'); };
      q('.gw-cmp input').addEventListener('input', e => setX(Number(e.target.value)));
      el.addEventListener('click', e => {
        const t = e.target.closest('button'); if (!t || !el.contains(t)) return;
        if (t.dataset.ex !== undefined) { ex = Number(t.dataset.ex); st = 0; pick = -1; q('.gw-cmp input').value = 0; }
        else if (t.hasAttribute('data-take')) { st = 1; pick = -1; q('.gw-cmp input').value = 0; }
        else if (t.dataset.put !== undefined) { pick = Number(t.dataset.put); st = 2; }
        else if (t.dataset.step !== undefined) { const n = Number(t.dataset.step); if (n === 0) { st = 0; pick = -1; } else if (n === 1) { st = 1; pick = -1; } else if (pick >= 0) st = 2; else { st = 1; } }
        else if (t.hasAttribute('data-reset')) { st = 0; pick = -1; q('.gw-cmp input').value = 0; }
        else return;
        draw();
      });
      draw();
    }
  };



  /* ================================================================
     gardenPuzzleMap — structure of the word-change puzzle
     ================================================================ */
  const ico = {
    scene: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 34Q16 22 26 31T42 26V40H6Z" fill="currentColor" opacity=".25"/><path d="M12 30V18H28V30M9 19L20 11L31 19" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path d="M36 10V26M33 14H39M33 20H39" stroke="currentColor" stroke-width="2"/></svg>',
    fan: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 40L7 16A28 28 0 0 1 41 16Z" fill="currentColor" opacity=".2" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M24 40L13 14M24 40V10M24 40L35 14" stroke="currentColor" stroke-width="1.6"/></svg>',
    swap: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="8" width="16" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-dasharray="3 3"/><rect x="26" y="24" width="16" height="16" rx="2" fill="currentColor" opacity=".22" stroke="currentColor" stroke-width="2.2"/><path d="M24 14H38V22M30 18L38 22M24 34H10V26M18 30L10 26" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    react: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="32" cy="15" r="7" fill="currentColor" opacity=".25" stroke="currentColor" stroke-width="2"/><path d="M5 26H27Q34 26 32 31M9 34H36M5 41H22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    next: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 40V20Q10 8 24 8T38 20V40" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M17 40V22Q17 15 24 15T31 22V40" fill="currentColor" opacity=".2" stroke="currentColor" stroke-width="2"/><path d="M18 32H32M28 28L32 32L28 36" fill="none" stroke="currentColor" stroke-width="2"/></svg>'
  };
  M.gardenPuzzleMap = {
    html: () => `<section class="gm" data-noeva aria-label="解谜机制结构">
      <header class="gm-h"><p class="mono">PUZZLE STRUCTURE</p><h3>改字这件事，在游戏里怎样走通</h3></header>
      <ol class="gm-flow">${[
        ['scene', '景中有字', '题诗、匾额等文字出现在场景里，同时是谜题的入口。', '输入'],
        ['fan', '奇扇取字', '玩家用绘梦奇扇把其中一个字提取出来。', '提取'],
        ['swap', '替换', '换成另一个字，字义决定景物会变成什么样。', '改写'],
        ['react', '景物回应', '风吹散雾，月亮显现；变化对应人物的心愿。', '反馈'],
        ['next', '推进任务', '园主的心愿完成，进入后面的章节，直到终章动画。', '结果']
      ].map(([i, h, t, tag], n) => `<li><span class="gm-ic">${ico[i]}</span><span class="gm-tag mono">${String(n + 1).padStart(2, '0')} · ${tag}</span><h4>${h}</h4><p>${t}</p></li>`).join('')}</ol>
      <div class="gm-ex" role="table" aria-label="两个公开例子">
        <div role="row" class="gm-r hd"><span role="columnheader">题字</span><span role="columnheader">改字</span><span role="columnheader">景物变化</span><span role="columnheader">对应的心愿</span></div>
        <div role="row" class="gm-r"><span role="cell"><b>雾</b>来水面</span><span role="cell"><b class="to">风</b>来水面</span><span role="cell">清风拂过，池面的浓雾散去</span><span role="cell">打开被雾遮住的池景</span></div>
        <div role="row" class="gm-r"><span role="cell"><b>云</b>到天心</span><span role="cell"><b class="to">月</b>到天心</span><span role="cell">云开月现，明月高悬</span><span role="cell">史正志倚栏观月</span></div>
      </div>
      <p class="garden-source">依据团队公开介绍绘制。谜题与判定逻辑由团队设计，这里只画出结构，不代表游戏源码。</p>
    </section>`
  };

  /* ================================================================
     gardenModesMap — story mode and tour mode on one garden
     ================================================================ */
  M.gardenModesMap = {
    html: () => `<section class="gx" data-noeva aria-label="剧情与游览的结构">
      <div class="gx-base"><b>共用的园子</b><span>网师园三维场景 · 秋冬春夏四季 · 建筑与园景</span></div>
      <div class="gx-cols">
        <article class="gx-col story">
          <header><p class="mono">STORY / 剧情模式</p><h3>园主的心愿推着往前走</h3></header>
          <svg viewBox="0 0 520 150" role="img" aria-label="剧情模式：四章线性推进，每章一道改字谜题"><title>剧情模式的线性推进</title>
            <path d="M20 80H496" stroke="#1b1d1a" stroke-width="3"/>
            ${['秋', '冬', '春', '夏'].map((c, i) => `<g transform="translate(${56 + i * 118},80)"><circle r="26" fill="${['#c4622d', '#4a6275', '#8aa07a', '#4f8577'][i]}"/><text y="9" text-anchor="middle" font-size="26" fill="#fbfaf5" font-family="'Ma Shan Zheng',serif">${c}</text><rect x="48" y="-12" width="30" height="24" rx="3" fill="#fbfaf5" stroke="#1b1d1a" stroke-width="2"/><path d="M56 0H70" stroke="#1b1d1a" stroke-width="2"/></g>`).join('')}
            <path d="M512 80l-16-8v16z" fill="#1b1d1a"/><text x="30" y="30" font-size="15" fill="#5d5f58">章节</text><text x="90" y="130" font-size="15" fill="#5d5f58">每章一道改字谜题</text>
          </svg>
          <ol><li><b>夜读入梦</b>进入南宋的网师园</li><li><b>遇见园主</b>通过对话知道他的心愿</li><li><b>奇扇改字</b>改动景中的诗句，解开谜题</li><li><b>下一章</b>季节更替；四章完成后播放终章动画</li></ol>
        </article>
        <article class="gx-col tour">
          <header><p class="mono">TOUR / 游览模式</p><h3>走到哪里，就从哪里开始看</h3></header>
          <svg viewBox="0 0 520 150" role="img" aria-label="游览模式：在园景中自由走动，四季可以随时切换"><title>游览模式的自由路径</title>
            <path d="M40 100Q110 30 190 80T330 54T470 100" fill="none" stroke="#1b1d1a" stroke-width="2.5" stroke-dasharray="6 6"/>
            <path d="M190 80Q230 126 300 112" fill="none" stroke="#1b1d1a" stroke-width="2.5" stroke-dasharray="6 6"/>
            ${[[40, 100], [110, 52], [190, 80], [260, 62], [330, 54], [300, 112], [400, 76], [470, 100]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 3 === 0 ? 10 : 7}" fill="${i % 3 === 0 ? '#5c8f6c' : '#fbfaf5'}" stroke="#1b1d1a" stroke-width="2"/>`).join('')}
            ${['秋', '冬', '春', '夏'].map((c, i) => `<g transform="translate(${340 + i * 34},22)"><circle r="14" fill="${['#c4622d', '#4a6275', '#8aa07a', '#4f8577'][i]}"/><text y="6" text-anchor="middle" font-size="15" fill="#fbfaf5" font-family="'Ma Shan Zheng',serif">${c}</text></g>`).join('')}
            <text x="40" y="136" font-size="15" fill="#5d5f58">自由路线</text><text x="340" y="62" font-size="0"></text><text x="340" y="48" font-size="0"></text>
          </svg>
          <ol><li><b>自由漫步</b>不依赖任务，想去哪里去哪里</li><li><b>切换季节</b>同一个地点，看四季的样子</li><li><b>读园林</b>实景照片与文字解释建筑和造园</li></ol>
        </article>
      </div>
      <div class="gx-tab" role="table" aria-label="两种模式对照">
        ${[['', '剧情模式', '游览模式'], ['谁会用', '想玩游戏、解谜的玩家', '只想参观园子的观众'], ['怎样推进', '园主的心愿与章节', '自己走、自己选季节'], ['看到什么', '人物、任务、景物变化', '四季园景、实景照片与文字'], ['结束在哪', '四章完成后的终章动画', '没有终点，随时离开']].map((r, i) => `<div role="row" class="gx-r${i ? '' : ' hd'}">${r.map((c, j) => `<span role="${i ? (j ? 'cell' : 'rowheader') : 'columnheader'}">${c}</span>`).join('')}</div>`).join('')}
      </div>
      <p class="garden-source">依据团队公开介绍绘制：两条路径是玩法结构示意，不编码时长、完成率或测试结果。</p>
    </section>`
  };


  /* ================================================================
     gardenMap — where the known scenes sit on the ink-wash aerial view (示意)
     ================================================================ */
  const SPOTS = [
    { n: 1, x: 44, y: 27, h: '月到风来亭', mode: '剧情 · 秋', img: 'garden/frame-7.jpg', d: '改字谜题里出现过的亭。实机画面里，亭名“月到风来”挂在屏幕上方。' },
    { n: 2, x: 52, y: 60, h: '池面', mode: '剧情 · 秋', img: 'garden/frame-5.jpg', d: '“雾来水面”的所在：水面起雾，改成“风”之后雾散。史正志在池畔与玩家对话。' },
    { n: 3, x: 80, y: 24, h: '看松读画轩', mode: '游览', img: 'garden-tour.webp', d: '游览模式里的建筑说明界面：实景照片加文字，讲建筑与造园。' },
    { n: 4, x: 22, y: 68, h: '入梦的起点', mode: '剧情 · 序章', img: 'garden-prologue.webp', d: '玩家夜读入梦之后到达南宋的网师园，故事从这里开始。' }
  ];
  M.gardenMap = {
    html: () => `<section class="gmap" data-noeva aria-label="游园地图示意">
      <header><p class="mono">GARDEN MAP · 游园地图 · 示意</p><h3>几处出现过的场景，落在园子的哪里</h3></header>
      <div class="gmap-body">
        <figure class="gmap-fig"><img src="assets/garden/frame-8.jpg" alt="网师园水墨俯视画面 · 演示视频截帧" loading="lazy">${SPOTS.map(p => `<button type="button" class="gmap-pin" data-p="${p.n - 1}" style="left:${p.x}%;top:${p.y}%" aria-label="${p.h}"><b>${p.n}</b></button>`).join('')}<figcaption class="mono">底图：演示视频中的水墨俯视画面 · 点位为示意</figcaption></figure>
        <div class="gmap-info"><img class="gmap-thumb" alt=""><p class="mono gmap-mode"></p><h4 class="gmap-h"></h4><p class="gmap-d"></p>
          <ol class="gmap-list">${SPOTS.map(p => `<li><button type="button" data-p="${p.n - 1}"><b>${p.n}</b><span>${p.h}</span><em class="mono">${p.mode}</em></button></li>`).join('')}</ol></div>
      </div>
      <p class="garden-source">点位依据水墨画面里建筑的大致形态标出，是示意，不是测绘位置；场景与模式来自团队公开介绍和演示视频截帧。</p>
    </section>`,
    init(el) {
      const q = s => el.querySelector(s); let cur = 0;
      const draw = () => { const p = SPOTS[cur]; el.querySelectorAll('[data-p]').forEach(b => b.classList.toggle('on', Number(b.dataset.p) === cur)); const im = q('.gmap-thumb'); im.src = 'assets/' + p.img; im.alt = p.h; q('.gmap-mode').textContent = p.mode; q('.gmap-h').textContent = p.n + ' · ' + p.h; q('.gmap-d').textContent = p.d; };
      el.addEventListener('click', e => { const b = e.target.closest('[data-p]'); if (!b) return; cur = Number(b.dataset.p); draw(); });
      draw();
    }
  };

  /* ================================================================
     gardenMineMap — which layer is mine
     ================================================================ */
  M.gardenMineMap = {
    html: () => `<section class="gn" data-noeva aria-label="个人负责的模块">
      <div class="gn-layer team"><p class="mono">TEAM · 团队完成</p><ul><li>剧情与谜题设计</li><li>文化内容</li><li>游戏美术与场景</li><li>WebGL 游戏主体</li></ul></div>
      <div class="gn-arrow" aria-hidden="true">▼</div>
      <div class="gn-layer mine"><p class="mono">MINE · 2025.12—2026.01</p>
        <div class="gn-mods">
          <article><b>NPC</b><h4>对话与触发</h4><p>靠近人物时给出可对话的提示，进入对话，结束后回到探索。</p></article>
          <article><b>CAMERA</b><h4>摄像机</h4><p>探索时跟随角色，对话时切换取景，结束后回到跟随。</p></article>
          <article><b>MINI</b><h4>小程序适配</h4><p>触控输入与运行环境改写，让同一套游戏能在微信小程序里玩。</p></article>
        </div>
      </div>
      <div class="gn-arrow" aria-hidden="true">▼</div>
      <div class="gn-layer env"><p class="mono">INPUT / PLATFORM</p><ul><li>鼠标 · 键盘（网页）</li><li>触控（手机）</li><li>微信小程序运行环境</li></ul></div>
      <div class="gn-state">
        <p class="mono">STATE · 探索、对话与视角</p>
        <svg viewBox="0 0 600 200" role="img" aria-label="探索与对话之间的切换：靠近人物进入对话，结束后回到探索，镜头随之切换"><title>探索与对话的状态切换</title>
          <defs><marker id="gn-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#1b1d1a"/></marker></defs>
          <g font-family="'LXGW WenKai TC','Noto Serif SC',serif">
            <rect x="20" y="62" width="150" height="76" rx="38" fill="#e2efdc" stroke="#1b1d1a" stroke-width="2.5"/><text x="95" y="108" text-anchor="middle" font-size="24" fill="#1b1d1a">探索</text>
            <rect x="430" y="62" width="150" height="76" rx="38" fill="#fbf0dc" stroke="#1b1d1a" stroke-width="2.5"/><text x="505" y="108" text-anchor="middle" font-size="24" fill="#1b1d1a">对话</text>
            <path d="M172 88H428" stroke="#1b1d1a" stroke-width="2.4" marker-end="url(#gn-ar)" fill="none"/><text x="300" y="76" text-anchor="middle" font-size="16" fill="#1b1d1a">靠近并触发</text>
            <path d="M428 118H172" stroke="#1b1d1a" stroke-width="2.4" marker-end="url(#gn-ar)" fill="none"/><text x="300" y="146" text-anchor="middle" font-size="16" fill="#1b1d1a">对话结束</text>
            <path d="M95 60Q95 32 160 32H228" fill="none" stroke="#5c8f6c" stroke-width="2.2" stroke-dasharray="5 5"/><text x="300" y="38" text-anchor="middle" font-size="15" fill="#3f7a50">镜头：跟随角色</text>
            <path d="M505 140Q505 170 420 170H360" fill="none" stroke="#d9772b" stroke-width="2.2" stroke-dasharray="5 5"/><text x="300" y="176" text-anchor="middle" font-size="15" fill="#b25a1a">镜头：对话取景</text>
          </g>
        </svg>
      </div>
      <p class="garden-source">个人分工的结构示意：文化内容、谜题设计和游戏美术属于团队；这里只标出我改写的模块。</p>
    </section>`
  };
})();
