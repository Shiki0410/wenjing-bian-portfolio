/* STAGE — one three.js scene per project. Loaded on demand by film.js.
   Every scene reads the project's own data or original structure; where a
   shape is illustrative the page says so in the caption. */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const COL = { paper: '#ecedef', sheet: '#f8f9fb', ink: '#0d1020', cobalt: '#1f3bff', navy: '#0a1240', sky: '#5aaeff', pale: '#d6e4ff', white: '#ffffff' };
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const load = u => fetch(u).then(r => { if (!r.ok) throw new Error(u); return r.json(); });
const tex = (u, cb) => new THREE.TextureLoader().load(u, t => { t.colorSpace = THREE.SRGBColorSpace; cb && cb(t); });
const lerp = (a, b, k) => a + (b - a) * k;
const ease = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;

/* text drawn into a canvas, used as a texture on a plane: lets type sit in 3D (P3R) */
function textPlane(text, { size = 120, weight = 900, family = '"Noto Sans SC","Inter Tight",sans-serif', color = COL.ink, bg = null, pad = 0.18, height = 1, align = 'left', opacity = 1, spacing = 0 } = {}) {
  const lines = String(text).split('\n');
  const cv = document.createElement('canvas'), g = cv.getContext('2d');
  g.font = `${weight} ${size}px ${family}`;
  const w = Math.ceil(Math.max(...lines.map(l => g.measureText(l).width + spacing * size * l.length)) + size * pad * 2);
  const h = Math.ceil(size * (lines.length * 1.12 + pad * 2));
  cv.width = Math.min(4096, w); cv.height = Math.min(4096, h);
  g.font = `${weight} ${size}px ${family}`; g.textBaseline = 'middle';
  if (bg) { g.fillStyle = bg; g.fillRect(0, 0, cv.width, cv.height); }
  g.fillStyle = color;
  lines.forEach((l, i) => {
    const y = size * (pad + .56 + i * 1.12);
    if (spacing) { let x = size * pad; [...l].forEach(ch => { g.fillText(ch, x, y); x += g.measureText(ch).width + spacing * size; }); }
    else { g.textAlign = align; g.fillText(l, align === 'center' ? cv.width / 2 : size * pad, y); }
  });
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(height * cv.width / cv.height, height), new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity, depthWrite: false, side: THREE.DoubleSide }));
  return m;
}
const lineMat = (c, o = 1) => new THREE.LineBasicMaterial({ color: c, transparent: o < 1, opacity: o });
const segs = (pts, mat) => { const g = new THREE.BufferGeometry().setFromPoints(pts); return new THREE.LineSegments(g, mat); };

/* drag to turn, slow drift when idle */
function orbit(el, pivot, { auto = .12, pitch = [-.35, .35], yaw = null } = {}) {
  let vx = 0, vy = 0, down = false, x0 = 0, y0 = 0, idle = 0;
  const rot = { x: pivot.rotation.x, y: pivot.rotation.y }, base = { x: pivot.rotation.x, y: pivot.rotation.y };
  el.addEventListener('pointerdown', e => { down = true; x0 = e.clientX; y0 = e.clientY; idle = 0; el.setPointerCapture && el.setPointerCapture(e.pointerId); });
  el.addEventListener('pointermove', e => { if (!down) return; vx = (e.clientX - x0) * .006; vy = (e.clientY - y0) * .004; x0 = e.clientX; y0 = e.clientY; rot.y += vx; rot.x = Math.max(base.x + pitch[0], Math.min(base.x + pitch[1], rot.x + vy)); });
  addEventListener('pointerup', () => { down = false; });
  return dt => {
    idle += dt;
    if (!down) { vx *= .92; rot.y += vx; if (idle > 2.5 && !reduce) rot.y += auto * dt; }
    if (yaw) rot.y = Math.max(base.y + yaw[0], Math.min(base.y + yaw[1], rot.y));
    pivot.rotation.y += (rot.y - pivot.rotation.y) * .12; pivot.rotation.x += (rot.x - pivot.rotation.x) * .12;
  };
}
const btn = (ui, label, on, pressed = false) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.setAttribute('aria-pressed', pressed); b.addEventListener('click', on); ui.appendChild(b); return b; };
const group = (ui, labels, cb, i0 = 0) => { const bs = labels.map((l, i) => btn(ui, l, () => { bs.forEach((x, k) => x.setAttribute('aria-pressed', k === i)); cb(i); }, i === i0)); return bs; };
const readout = ui => { const p = document.createElement('p'); p.className = 'read'; ui.prepend(p); return p; };

/* =================================================================
   SCENES
   ================================================================= */
const SCENES = {
  /* 01 — G01_02: sixteen real events, laid across a wireframe court; x = which half, z = time */
  async rally(c) {
    const { scene, camera, el, ui } = c;
    const dk = !!(c.opt && c.opt.dark), INK = dk ? '#c9cdd8' : COL.ink, CB = dk ? '#4f6bff' : COL.cobalt, SKY = dk ? '#7fb6ff' : COL.sky, TAGFG = dk ? COL.ink : COL.white;
    c.light = !dk;
    const d = await load('assets/stage/rally-g01_02.json');
    const root = new THREE.Group(); scene.add(root);
    const L = 13.4, W = 6.1, hl = L / 2, hw = W / 2;
    // court lines (doubles), short / long service lines, singles sidelines, net
    const P = (x, z) => new THREE.Vector3(x, 0, z);
    const lines = [[-hl, -hw, hl, -hw], [-hl, hw, hl, hw], [-hl, -hw, -hl, hw], [hl, -hw, hl, hw], [-hl, -hw + .46, hl, -hw + .46], [-hl, hw - .46, hl, hw - .46], [-1.98, -hw, -1.98, hw], [1.98, -hw, 1.98, hw], [-hl + .76, -hw, -hl + .76, hw], [hl - .76, -hw, hl - .76, hw], [-hl, 0, -1.98, 0], [1.98, 0, hl, 0]];
    root.add(segs(lines.flatMap(([a, b, x, y]) => [P(a, b), P(x, y)]), lineMat(INK, .7)));
    const net = new THREE.Mesh(new THREE.PlaneGeometry(W, .76), new THREE.MeshBasicMaterial({ color: INK, transparent: true, opacity: .08, side: THREE.DoubleSide }));
    net.rotation.y = Math.PI / 2; net.position.set(0, 1.55 - .38, 0); root.add(net);
    root.add(segs([new THREE.Vector3(0, 1.55, -hw), new THREE.Vector3(0, 1.55, hw), new THREE.Vector3(0, 0, -hw), new THREE.Vector3(0, 1.55, -hw), new THREE.Vector3(0, 0, hw), new THREE.Vector3(0, 1.55, hw)], lineMat(INK, .9)));
    // type lying on the floor: who stands where
    const fA = textPlane('P01 ○', { size: 160, color: CB, height: 1.1 }); fA.rotation.x = -Math.PI / 2; fA.position.set(-4.3, .01, hw + .9); root.add(fA);
    const fB = textPlane('P02 □', { size: 160, color: INK, height: 1.1 }); fB.rotation.x = -Math.PI / 2; fB.position.set(4.3, .01, hw + .9); root.add(fB);
    // time runs along the court width: 0 s at one sideline, 30 s at the other
    const zt = t => -hw + .25 + (t / 30) * (W - .5);
    for (let s = 0; s <= 30; s += 5) { const tk = textPlane(`${s}s`, { size: 60, weight: 600, family: '"JetBrains Mono",monospace', color: INK, height: .32 }); tk.rotation.x = -Math.PI / 2; tk.position.set(-hl - .55, .01, zt(s)); root.add(tk); root.add(segs([P(-hl - .2, zt(s)), P(-hl, zt(s))], lineMat(INK))); }
    const ttl = textPlane('G01_02 · 0—30 s · 16 EVENTS', { size: 60, weight: 600, family: '"JetBrains Mono",monospace', color: CB, height: .3 }); ttl.rotation.x = -Math.PI / 2; ttl.rotation.z = Math.PI / 2; ttl.position.set(-hl - 1.25, .01, 0); root.add(ttl);
    // rally bands on the floor
    const rallies = [...new Set(d.events.map(e => e.r))];
    rallies.forEach(r => {
      const ev = d.events.filter(e => e.r === r), z0 = zt(ev[0].t) - .08, z1 = zt(ev[ev.length - 1].t) + .08;
      const band = new THREE.Mesh(new THREE.PlaneGeometry(L, Math.max(.16, z1 - z0)), new THREE.MeshBasicMaterial({ color: CB, transparent: true, opacity: r % 2 ? .07 : .12, depthWrite: false }));
      band.rotation.x = -Math.PI / 2; band.position.set(0, .005, (z0 + z1) / 2); root.add(band);
      const rl = textPlane(`R${r}`, { size: 70, weight: 700, family: '"JetBrains Mono",monospace', color: CB, height: .3 }); rl.rotation.x = -Math.PI / 2; rl.position.set(hl + .5, .01, (z0 + z1) / 2); root.add(rl);
    });
    // one arc per event
    const arcs = [], pick = [];
    d.events.forEach(e => {
      const z = zt(e.t), ab = e.dir === 'A_to_B', unk = e.dir === 'unknown', s0 = ab ? -1 : 1;
      const a = new THREE.Vector3(s0 * 4.2, 1.1, z), b = new THREE.Vector3(-s0 * 4.4, .05, z + (unk ? 0 : .0));
      const ctrl = new THREE.Vector3(0, 3.4 + (e.n % 3) * .35, z);
      const curve = new THREE.QuadraticBezierCurve3(a, ctrl, b);
      const sel = e.n === 2, col = unk ? SKY : ab ? CB : INK;
      let mesh;
      if (unk || e.st === 'not_observable_unknown') {
        const g = new THREE.BufferGeometry().setFromPoints(curve.getPoints(60));
        mesh = new THREE.Line(g, new THREE.LineDashedMaterial({ color: col, dashSize: .18, gapSize: .12 })); mesh.computeLineDistances();
        const hit = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, .09, 5), new THREE.MeshBasicMaterial({ visible: false })); hit.userData = e; root.add(hit); pick.push(hit);
      } else {
        mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 60, sel ? .055 : .028, 6), new THREE.MeshBasicMaterial({ color: col })); mesh.userData = e; pick.push(mesh);
      }
      root.add(mesh);
      // landing: a dot, or an open ring where nobody answered
      const end = e.st === 'observed_no_response_zero' ? new THREE.Mesh(new THREE.RingGeometry(.16, .22, 24), new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide })) : new THREE.Mesh(new THREE.CircleGeometry(.1, 16), new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide }));
      end.rotation.x = -Math.PI / 2; end.position.copy(b).setY(.02); root.add(end);
      arcs.push({ e, curve, mesh });
    });
    const tag = textPlane('#02 · 6.80 s · P02 → P01', { size: 70, weight: 700, family: '"JetBrains Mono",monospace', color: TAGFG, bg: dk ? '#ffffff' : COL.ink, height: .34 });
    const e2 = arcs.find(a => a.e.n === 2); tag.position.copy(e2.curve.getPoint(.5)).add(new THREE.Vector3(0, .55, 0)); root.add(tag); c.billboards = [tag];
    // the shuttle travels the sixteen events in order
    const shuttle = new THREE.Mesh(new THREE.ConeGeometry(.12, .3, 12), new THREE.MeshBasicMaterial({ color: CB })); root.add(shuttle);
    scene.add(new THREE.AmbientLight(0xffffff, 1));
    camera.fov = 34; c.fit = asp => { const k = asp < 1.1 ? 1.55 : asp < 1.5 ? 1.2 : 1; camera.position.set(1.5 * k, 11 * k, 15 * k); camera.lookAt(dk ? 2.6 : 1.4, (dk ? -.9 : -2.2) * k, 0); camera.updateProjectionMatrix(); };
    root.rotation.y = -.35;
    const spin = orbit(el, root, { auto: .05, pitch: [-.2, .2], yaw: [-.9, .5] });
    const rd = readout(ui);
    c.pick = pick; c.tip = o => { const e = o.userData; return `<b>#${pad2(e.n)} · ${e.t.toFixed(2)} s · R${e.r}</b>${dirCN(e.dir)}<br>${stCN(e.st)}${e.go != null ? `<br>目标头 落点 / 线路 · Offer ${e.go} / Actual ${e.ga ?? '—'}` : ''}`; };
    let clock = 0;
    return dt => {
      spin(dt);
      clock = (clock + dt * 2.2) % 31;
      const cur = [...arcs].reverse().find(a => a.e.t <= clock) || arcs[0], nx = arcs[arcs.indexOf(cur) + 1];
      const span = nx ? Math.min(nx.e.t - cur.e.t, 1.2) : 1.2, k = Math.min(1, (clock - cur.e.t) / span);
      shuttle.position.copy(cur.curve.getPoint(k)); const tg = cur.curve.getTangent(k); shuttle.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tg.normalize());
      rd.textContent = `t = ${clock.toFixed(2)} s · #${pad2(cur.e.n)} · ${dirCN(cur.e.dir)} · R${cur.e.r}`;
    };
  },

  /* 02 — 48 behaviour features as 48 buildings, six districts A—F. Building height carries no value. */
  async privacy(c) {
    const { scene, camera, el, ui } = c;
    const ln = !!(c.opt && c.opt.line);   // line drawing on cobalt (R441) instead of white clay (R447)
    c.light = !ln;
    const names = await load('assets/stage/privacy-features.json');
    const CN = ['平均决策时长', '决策时长方差', '点击频率', '连续快速点击', '滚动速度', '回滚次数', '空闲时间占比', '操作序列熵', '条款总停留时长', '阅读完成率', '滚到底部比例', '段落平均停留', '回看次数', '关键词悬停时长', '隐私政策点击次数', '粗体注视率', '试探题 1 风险分', '试探题 2 风险分', '试探题 3 风险分', '“了解更多”点击', '拒绝按钮点击', '数据授权拒绝率', '定位拒绝率', '通讯录拒绝率', '相机拒绝率', '风险自评', '设备类型', '夜间游玩占比', '单次时长', '获客渠道', '剩余游戏币比例', '时间压力感', '稀有道具数', '社交联结强度', '决策时长趋势', '风险偏好漂移', '阅读深度衰减', '疲劳指数', '行为一致性', '学习效应系数', '阅读 × 风险', '疲劳 × 稀缺', '条款长度 × 完成率', '社交压力 × 风险厌恶', '时间压力 × 决策时长', '奖励 × 风险偏好', '游戏进度 × 疲劳', '画像一致性'];
    const G = [['A', '行为节奏', 0, 8], ['B', '阅读行为', 8, 16], ['C', '风险偏好', 16, 26], ['D', '情境感知', 26, 34], ['E', '时序演变', 34, 40], ['F', '交互效应', 40, 48]];
    const root = new THREE.Group(); scene.add(root);
    if (!ln) { const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: .14 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; root.add(ground); }
    const grid = ln ? new THREE.GridHelper(26, 26, 0x8ea0ff, 0x4a63ff) : new THREE.GridHelper(26, 26, 0xc9d3ea, 0xdde3f0); grid.position.y = .001; root.add(grid);
    const BG = '#1f3bff', LINE = '#ffffff';
    const boxG = new THREE.BoxGeometry(.78, 1, .78); boxG.translate(0, .5, 0);
    const edgeG = new THREE.EdgesGeometry(boxG);
    const bld = [];
    G.forEach(([k, cn, a, b], gi) => {
      const n = b - a, cols = Math.ceil(n / 2), ox = (gi % 3 - 1) * 6.4, oz = (Math.floor(gi / 3) - .5) * 6.2;
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(cols * 1.05 + .5, .14, 2.6), ln ? new THREE.MeshBasicMaterial({ color: 0x2a46ff }) : new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 }));
      if (ln) plinth.add(new THREE.LineSegments(new THREE.EdgesGeometry(plinth.geometry), lineMat(LINE, .8)));
      plinth.position.set(ox, .07, oz); plinth.receiveShadow = true; root.add(plinth);
      const lab = textPlane(`${k} ${cn} · ${n}`, { size: 90, weight: 900, color: ln ? LINE : COL.ink, height: .42 }); lab.rotation.x = -Math.PI / 2; lab.position.set(ox, .15, oz + 1.65); root.add(lab);
      for (let i = 0; i < n; i++) {
        const m = new THREE.Mesh(boxG, ln ? new THREE.MeshBasicMaterial({ color: BG }) : new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .85 }));
        const cx = ox + (i % cols - (cols - 1) / 2) * 1.05, cz = oz + (Math.floor(i / cols) - .5) * 1.05;
        m.position.set(cx, .14, cz); m.scale.y = 1.1; m.castShadow = true; m.receiveShadow = true;
        const ed = new THREE.LineSegments(edgeG, lineMat(ln ? LINE : COL.ink, ln ? .9 : .35)); m.add(ed);
        m.userData = { i: a + i, g: gi, code: names[a + i], cn: CN[a + i], k, gcn: cn, h: 1.1 };
        root.add(m); bld.push(m);
      }
    });
    scene.add(new THREE.HemisphereLight(0xffffff, 0xdfe6f5, 1.6));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6); sun.position.set(-8, 14, 6); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14 }); scene.add(sun);
    c.renderer.shadowMap.enabled = true; c.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const cam = (c.opt && c.opt.cam) || [14, 17, 18, 0, 0, 0];
    camera.fov = 26; camera.position.set(cam[0], cam[1], cam[2]); camera.lookAt(cam[3], cam[4], cam[5]); camera.updateProjectionMatrix();
    const spin = orbit(el, root, { auto: .03, pitch: [-.1, .12], yaw: [-.7, .7] });
    let focus = -1, hover = null, selected = -1;
    const rd = readout(ui);
    const filters = group(ui, ['全部', ...G.map(g => g[0] + ' ' + g[1])], i => { focus = i - 1; selected = -1; });
    el.addEventListener('privacy-select', e => {
      selected = Number(e.detail.index); focus = Number(e.detail.group);
      filters.forEach((b,i) => b.setAttribute('aria-pressed',i===focus+1));
      rd.textContent = `${String(selected+1).padStart(2,'0')} · ${CN[selected]} · ${G[focus]?.[1]||''}`;
      el.dataset.selectedFeature = String(selected);
    });
    let tint = null;   // page-driven colours: { colors: [48 hex] } or null
    el.addEventListener('privacy-tint', e => { tint = e.detail && e.detail.colors ? e.detail.colors.map(h => new THREE.Color(h)) : null; });
    rd.textContent = '48 个特征 · 6 组 · 悬停看名字';
    c.pick = bld; c.onHover = o => { hover = o; };
    c.onClick = o => { if (o) el.dispatchEvent(new CustomEvent('privacy-pick', { detail: { index: o.userData.i } })); };
    c.tip = o => `<b>${o.userData.code.toUpperCase()}</b>${o.userData.cn}<br>${o.userData.k} 组 · ${o.userData.gcn}`;
    return dt => {
      spin(dt);
      bld.forEach(m => {
        const on = focus < 0 || m.userData.g === focus, hot = m === hover || m.userData.i === selected;
        const th = m.userData.i === selected ? 3.6 : focus >= 0 && on ? 2.4 : 1.1;
        m.scale.y += (th - m.scale.y) * .08;
        if (ln) { const base = tint ? tint[m.userData.i] : null; m.material.color.lerp(hot || m.userData.i === selected ? new THREE.Color('#ffffff') : base || new THREE.Color(focus >= 0 && on ? '#ffffff' : BG), .15); m.children[0].material.opacity = on ? .9 : .25; }
        else { m.material.color.lerp(new THREE.Color(hot ? COL.cobalt : focus >= 0 && on ? COL.cobalt : on ? '#ffffff' : '#e7ebf3'), .15); m.children[0].material.opacity = on ? .35 : .12; }
      });
    };
  },

  /* 03 — a body made of particles on MediaPipe's 33-point skeleton; at contact the particles fly and come back. Pose is illustrative. */
  async tennis(c) {
    const ink = !!(c.opt && c.opt.ink);   // ink particles on white paper (R344) instead of light on dark
    const P1 = ink ? '#161616' : COL.sky, P2 = ink ? '#ef4a24' : 0xffffff, P3 = ink ? '#161616' : COL.white, BL = ink ? THREE.NormalBlending : THREE.AdditiveBlending;
    if (ink) c.light = true;
    const { scene, camera, el, ui } = c;
    const CONN = [[11, 12], [11, 13], [13, 15], [12, 14], [14, 16], [11, 23], [12, 24], [23, 24], [23, 25], [25, 27], [24, 26], [26, 28], [27, 29], [29, 31], [27, 31], [28, 30], [30, 32], [28, 32], [15, 17], [15, 19], [15, 21], [17, 19], [16, 18], [16, 20], [16, 22], [18, 20], [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8], [9, 10]];
    const head = (nx, ny, nz) => [[nx, ny, nz], [nx - .03, ny + .03, nz - .01], [nx - .045, ny + .03, nz - .015], [nx - .06, ny + .03, nz - .02], [nx + .03, ny + .03, nz - .01], [nx + .045, ny + .03, nz - .015], [nx + .06, ny + .03, nz - .02], [nx - .085, ny + .005, nz - .09], [nx + .085, ny + .005, nz - .09], [nx - .025, ny - .045, nz - .01], [nx + .025, ny - .045, nz - .01]];
    const hand = (w, dx, dy) => [[w[0] + dx * .6, w[1] + dy * .6, w[2] + .03], [w[0] + dx, w[1] + dy, w[2] + .02], [w[0] + dx * .7, w[1] + dy * .7, w[2] + .06]];
    const pose = (o) => { const f = head(...o.nose); const lw = o.lw, rw = o.rw; return [...f, o.ls, o.rs, o.le, o.re, lw, rw, ...[hand(lw, -.05, .07), hand(rw, .05, .08)].flatMap(h => h).sort(() => 0).slice(0, 6).map((p, i, a) => a[[0, 3, 1, 4, 2, 5][i]]), o.lh, o.rh, o.lk, o.rk, o.la, o.ra, [o.la[0] - .02, o.la[1] - .06, o.la[2] - .06], [o.ra[0] + .02, o.ra[1] - .06, o.ra[2] - .06], [o.la[0] - .03, o.la[1] - .08, o.la[2] + .16], [o.ra[0] + .03, o.ra[1] - .08, o.ra[2] + .16]]; };
    const K = [
      pose({ nose: [.02, 1.72, .1], ls: [-.19, 1.5, .02], rs: [.18, 1.44, -.02], le: [-.26, 1.76, .06], re: [.42, 1.54, -.06], lw: [-.28, 2.04, .06], rw: [.36, 1.86, -.16], lh: [-.12, 1, 0], rh: [.12, .98, 0], lk: [-.19, .56, .14], rk: [.2, .55, -.06], la: [-.21, .1, 0], ra: [.26, .1, -.1] }),
      pose({ nose: [.04, 1.8, .12], ls: [-.15, 1.56, .06], rs: [.17, 1.64, 0], le: [-.2, 1.3, .16], re: [.23, 1.97, .06], lw: [-.05, 1.14, .26], rw: [.26, 2.32, .12], lh: [-.1, 1.08, .05], rh: [.12, 1.08, .02], lk: [-.14, .62, .08], rk: [.16, .63, .05], la: [-.14, .2, .1], ra: [.18, .22, 0] }),
      pose({ nose: [-.04, 1.66, .2], ls: [-.18, 1.46, -.04], rs: [.12, 1.5, .16], le: [-.32, 1.25, -.1], re: [-.04, 1.26, .32], lw: [-.22, 1.04, 0], rw: [-.32, .98, .36], lh: [-.12, .98, .05], rh: [.1, .98, .1], lk: [-.16, .54, .26], rk: [.2, .58, -.1], la: [-.16, .08, .3], ra: [.28, .2, -.28] })
    ];
    // particles: sampled along every bone, plus the joints
    const N = 2600, home = new Float32Array(N * 3), pos = new Float32Array(N * 3), vel = new Float32Array(N * 3), bone = new Uint16Array(N), tt = new Float32Array(N), jit = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { bone[i] = i % CONN.length; tt[i] = Math.random(); for (let k = 0; k < 3; k++) jit[i * 3 + k] = (Math.random() - .5) * .035; }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: P1, size: ink ? .022 : .016, transparent: true, opacity: .9, blending: BL, depthWrite: false }));
    const jGeo = new THREE.BufferGeometry(); jGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(33 * 3), 3));
    const joints = new THREE.Points(jGeo, new THREE.PointsMaterial({ color: P2, size: .045, transparent: true, depthWrite: false }));
    pts.frustumCulled = false; joints.frustumCulled = false;
    const body = new THREE.Group(); body.add(pts, joints); scene.add(body); body.position.y = -1.1;
    const racket = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), lineMat(P3, .9)); body.add(racket);
    const headRing = new THREE.Mesh(new THREE.RingGeometry(.1, .115, 40), new THREE.MeshBasicMaterial({ color: P3, side: THREE.DoubleSide, transparent: true })); body.add(headRing);
    const impact = new THREE.Mesh(new THREE.RingGeometry(.2, .23, 64), new THREE.MeshBasicMaterial({ color: ink ? '#ef4a24' : COL.sky, side: THREE.DoubleSide, transparent: true, opacity: 0, blending: BL })); body.add(impact);
    const trailN = 46, trail = new Float32Array(trailN * 3), trGeo = new THREE.BufferGeometry(); trGeo.setAttribute('position', new THREE.BufferAttribute(trail, 3));
    const trLine = new THREE.Line(trGeo, lineMat(ink ? '#ef4a24' : COL.cobalt, .9)); body.add(trLine);
    const floor = new THREE.Mesh(new THREE.RingGeometry(.6, .62, 80), new THREE.MeshBasicMaterial({ color: ink ? '#161616' : COL.sky, transparent: true, opacity: .4, side: THREE.DoubleSide })); floor.rotation.x = -Math.PI / 2; body.add(floor);
    c.fit = asp => { const z = asp < .8 ? 3.4 * .72 / Math.max(.45, asp) : 3.4; camera.position.set(0, .35, z); camera.lookAt(0, .1, 0); }; c.fit(1.6);
    const spin = orbit(el, body, { auto: .25, pitch: [-.15, .2] });
    const rd = readout(ui);
    let slow = false; btn(ui, '慢放', function () { slow = !slow; this.setAttribute('aria-pressed', slow); });
    let ids = false; const idSprites = [];
    btn(ui, '33 个关键点', function () { ids = !ids; this.setAttribute('aria-pressed', ids); idSprites.forEach(s => (s.visible = ids)); });
    for (let j = 0; j < 33; j++) { const s = textPlane(String(j), { size: 60, weight: 600, family: '"JetBrains Mono",monospace', color: ink ? '#ef4a24' : COL.white, height: .05 }); s.visible = false; body.add(s); idSprites.push(s); }
    c.billboards = idSprites;
    const cur = Array.from({ length: 33 }, () => new THREE.Vector3());
    let time = 0, lastPhase = 0;
    const PH = [['TROPHY · 蓄力', 0], ['CONTACT · 击球', 1], ['FOLLOW · 随挥', 2]];
    return dt => {
      spin(dt);
      time += dt * (slow ? .35 : 1);
      const T = 4.2, u = (time % T) / T;
      // trophy hold → contact → follow → back to trophy
      let a, b, k;
      if (u < .38) { a = 0; b = 0; k = 0; } else if (u < .5) { a = 0; b = 1; k = ease((u - .38) / .12); } else if (u < .66) { a = 1; b = 2; k = ease((u - .5) / .16); } else { a = 2; b = 0; k = ease((u - .66) / .34); }
      for (let j = 0; j < 33; j++) cur[j].set(lerp(K[a][j][0], K[b][j][0], k), lerp(K[a][j][1], K[b][j][1], k), lerp(K[a][j][2], K[b][j][2], k));
      const jp = jGeo.attributes.position.array; cur.forEach((v, j) => { jp[j * 3] = v.x; jp[j * 3 + 1] = v.y; jp[j * 3 + 2] = v.z; idSprites[j].position.set(v.x + .03, v.y + .03, v.z); }); jGeo.attributes.position.needsUpdate = true;
      // racket along the forearm
      const w = cur[16], e = cur[14], dir = w.clone().sub(e).normalize(), tip = w.clone().add(dir.clone().multiplyScalar(.62)), mid = w.clone().add(dir.clone().multiplyScalar(.5));
      racket.geometry.setFromPoints([w, tip]); headRing.position.copy(mid); headRing.lookAt(mid.clone().add(new THREE.Vector3(0, 0, 1)));
      // contact: ring + burst
      const atContact = u > .49 && u < .51, phase = u < .45 ? 0 : u < .58 ? 1 : 2;
      if (phase === 1 && lastPhase === 0) { for (let i = 0; i < N; i++) { const dx = pos[i * 3] - mid.x, dy = pos[i * 3 + 1] - mid.y, dz = pos[i * 3 + 2] - mid.z, dd = Math.max(.15, Math.hypot(dx, dy, dz)); const f = .9 / (dd * dd); vel[i * 3] += dx / dd * f; vel[i * 3 + 1] += dy / dd * f; vel[i * 3 + 2] += dz / dd * f; } impact.position.copy(mid); impact.scale.setScalar(.2); impact.material.opacity = 1; }
      lastPhase = phase;
      impact.scale.multiplyScalar(1 + dt * 4); impact.material.opacity *= Math.pow(.02, dt); impact.lookAt(camera.position);
      for (let i = 0; i < N; i++) {
        const [p, q] = CONN[bone[i]], A = cur[p], B = cur[q], s = tt[i];
        const hx = lerp(A.x, B.x, s) + jit[i * 3], hy = lerp(A.y, B.y, s) + jit[i * 3 + 1], hz = lerp(A.z, B.z, s) + jit[i * 3 + 2];
        const ix = i * 3;
        vel[ix] += (hx - pos[ix]) * 12 * dt; vel[ix + 1] += (hy - pos[ix + 1]) * 12 * dt; vel[ix + 2] += (hz - pos[ix + 2]) * 12 * dt;
        vel[ix] *= .86; vel[ix + 1] *= .86; vel[ix + 2] *= .86;
        pos[ix] += vel[ix] * dt * 6; pos[ix + 1] += vel[ix + 1] * dt * 6; pos[ix + 2] += vel[ix + 2] * dt * 6;
      }
      geo.attributes.position.needsUpdate = true;
      for (let i = trailN - 1; i > 0; i--) { trail[i * 3] = trail[(i - 1) * 3]; trail[i * 3 + 1] = trail[(i - 1) * 3 + 1]; trail[i * 3 + 2] = trail[(i - 1) * 3 + 2]; }
      trail[0] = tip.x; trail[1] = tip.y; trail[2] = tip.z; trGeo.attributes.position.needsUpdate = true;
      rd.textContent = `${PH[phase][0]} · MediaPipe 33 点 · ${N.toLocaleString()} 粒子`;
      void atContact;
    };
  },

  /* 04 — 4,641 of Yamamoto's pitches (2024—2026) where they crossed the plate. Locations are real; flight arcs are drawn from pfx and are approximate. */
  async baseball(c) {
    const { scene, camera, el, ui } = c;
    const d = await load('assets/stage/yamamoto.json');
    const TY = d.types, rows = d.rows;
    const TC = ['#5aaeff', '#ffffff', '#8fb3ff', '#1f3bff', '#d6e4ff', '#9fd3ff', '#c9d6ff'];
    const root = new THREE.Group(); scene.add(root);
    // home plate, strike zone (rulebook width, typical height — approximate), grid
    const plate = new THREE.Shape([[-.708, 0], [.708, 0], [.708, -.708], [0, -1.417], [-.708, -.708]].map(([x, y]) => new THREE.Vector2(x, y)));
    const pm = new THREE.Mesh(new THREE.ShapeGeometry(plate), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .85, side: THREE.DoubleSide })); pm.rotation.x = -Math.PI / 2; root.add(pm);
    const zx = .83, z0 = 1.5, z1 = 3.5;
    root.add(segs([[-zx, z0, zx, z0], [zx, z0, zx, z1], [zx, z1, -zx, z1], [-zx, z1, -zx, z0], [-zx / 3, z0, -zx / 3, z1], [zx / 3, z0, zx / 3, z1], [-zx, z0 + (z1 - z0) / 3, zx, z0 + (z1 - z0) / 3], [-zx, z0 + 2 * (z1 - z0) / 3, zx, z0 + 2 * (z1 - z0) / 3]].flatMap(([a, b, x, y]) => [new THREE.Vector3(a, b, 0), new THREE.Vector3(x, y, 0)]), lineMat('#ffffff', .8)));
    const gl = []; for (let x = -3; x <= 3; x += .5) gl.push(new THREE.Vector3(x, 0, 0), new THREE.Vector3(x, 5, 0)); for (let y = 0; y <= 5; y += .5) gl.push(new THREE.Vector3(-3, y, 0), new THREE.Vector3(3, y, 0));
    root.add(segs(gl, lineMat(COL.sky, .08)));
    // pitches as instanced dots
    const dot = new THREE.InstancedMesh(new THREE.CircleGeometry(.03, 10), new THREE.MeshBasicMaterial({ transparent: true, opacity: .85, depthWrite: false, side: THREE.DoubleSide }), rows.length);
    const M = new THREE.Matrix4(), col = new THREE.Color();
    rows.forEach((r, i) => { M.makeTranslation(r[0], r[1], .002 * (i % 7)); dot.setMatrixAt(i, M); dot.setColorAt(i, col.set(TC[r[3]])); });
    root.add(dot);
    // flight lines for a sample: release point → plate, bent by pfx (approximate)
    const rel = new THREE.Vector3(-1.9, 5.8, -54);
    const flights = new THREE.Group(); root.add(flights);
    const drawFlights = sel => {
      flights.clear();
      const pick = sel.filter((_, i) => i % Math.max(1, Math.floor(sel.length / 220)) === 0).slice(0, 220);
      pick.forEach(r => {
        const end = new THREE.Vector3(r[0], r[1], 0), mid = rel.clone().lerp(end, .55).add(new THREE.Vector3(-r[5] * .8, r[6] * .8 + .9, 0));
        const g = new THREE.BufferGeometry().setFromPoints(new THREE.QuadraticBezierCurve3(rel, mid, end).getPoints(28));
        flights.add(new THREE.Line(g, lineMat(TC[r[3]], .16)));
      });
    };
    const mound = textPlane('60 ft 6 in', { size: 80, weight: 600, family: '"JetBrains Mono",monospace', color: COL.sky, height: .9 }); mound.rotation.x = -Math.PI / 2; mound.position.set(0, .01, -30); root.add(mound);
    const big = textPlane('YAMAMOTO 18', { size: 200, weight: 900, family: '"Inter Tight",sans-serif', color: '#ffffff', height: 3.2, opacity: .07 }); big.position.set(0, 4.2, -14); root.add(big);
    camera.fov = 30; camera.position.set(2.2, 3.2, 9.5); camera.lookAt(0, 2.3, -6); camera.updateProjectionMatrix();
    const spin = orbit(el, root, { auto: 0, pitch: [-.08, .12], yaw: [-.55, .55] });
    const rd = readout(ui);
    let yi = 0, ti = 0;
    const apply = () => {
      const sel = []; rows.forEach((r, i) => { const on = (yi === 0 || r[4] === [0, 24, 25, 26][yi]) && (ti === 0 || r[3] === ti - 1); dot.setColorAt(i, col.set(on ? TC[r[3]] : '#24305f')); if (on) sel.push(r); });
      dot.instanceColor.needsUpdate = true; drawFlights(sel);
      const sp = sel.filter(r => r[2] != null), mean = sp.reduce((a, r) => a + r[2], 0) / (sp.length || 1);
      rd.textContent = `${sel.length.toLocaleString()} 球 · 平均出手球速 ${mean.toFixed(1)} mph`;
    };
    const yu = document.createElement('div'); yu.className = 'row'; ui.appendChild(yu);
    group(yu, ['全部年份', '2024', '2025', '2026'], i => { yi = i; apply(); });
    const tu = document.createElement('div'); tu.className = 'row'; ui.appendChild(tu);
    group(tu, ['全部球种', ...TY.map(t => t.replace('4-Seam Fastball', '四缝线').replace('Split-Finger', '指叉').replace('Curveball', '曲球').replace('Cutter', '卡特').replace('Sinker', '伸卡').replace('Slider', '滑球').replace('Sweeper', '横扫'))], i => { ti = i; apply(); });
    apply();
    return dt => spin(dt);
  },

  /* 05 — hex terrain; click a tile and a path is found over the six neighbours (as SetHexPath does). Terrain is illustrative. */
  async artemis(c) {
    const { scene, camera, el, ui } = c;
    const root = new THREE.Group(); scene.add(root);
    const R = .58, cols = 13, rowsN = 9, tiles = [], byKey = new Map();
    const hex = new THREE.CylinderGeometry(R * .96, R * .96, 1, 6); hex.translate(0, .5, 0);
    const top = new THREE.EdgesGeometry(hex);
    const noise = (q, r) => Math.sin(q * 1.7 + r * .9) * .5 + Math.cos(q * .6 - r * 1.3) * .5;
    for (let r = 0; r < rowsN; r++) for (let q = 0; q < cols; q++) {
      const x = (q + (r % 2) * .5 - cols / 2) * R * Math.sqrt(3), z = (r - rowsN / 2) * R * 1.5;
      const n = noise(q, r), wall = n > .78 || (q === 6 && r > 1 && r < 7 && r !== 4);
      const h = wall ? 1.6 : .25 + (n + 1) * .18;
      const m = new THREE.Mesh(hex, new THREE.MeshStandardMaterial({ color: wall ? '#1d2650' : '#e9edf7', roughness: .7, metalness: .05 }));
      m.position.set(x, 0, z); m.scale.y = h; m.rotation.y = Math.PI / 6;
      m.add(new THREE.LineSegments(top, lineMat(wall ? COL.sky : COL.cobalt, wall ? .5 : .35)));
      m.userData = { q, r, wall, h }; root.add(m); tiles.push(m); byKey.set(q + ',' + r, m);
    }
    const nb = (q, r) => (r % 2 ? [[1, 0], [-1, 0], [0, -1], [1, -1], [0, 1], [1, 1]] : [[1, 0], [-1, 0], [-1, -1], [0, -1], [-1, 1], [0, 1]]).map(([dq, dr]) => byKey.get((q + dq) + ',' + (r + dr))).filter(Boolean);
    const start = byKey.get('1,4'), token = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .5, 6), new THREE.MeshStandardMaterial({ color: COL.cobalt, emissive: COL.cobalt, emissiveIntensity: .4 }));
    root.add(token); token.position.set(start.position.x, start.userData.h + .25, start.position.z);
    let at = start, path = [], step = 0;
    const paint = () => tiles.forEach(t => { if (!t.userData.wall) t.material.color.set(path.includes(t) ? COL.sky : '#e9edf7'); });
    const bfs = (a, b) => { const prev = new Map([[a, null]]), Q = [a]; while (Q.length) { const t = Q.shift(); if (t === b) break; nb(t.userData.q, t.userData.r).forEach(n => { if (!n.userData.wall && !prev.has(n)) { prev.set(n, t); Q.push(n); } }); } if (!prev.has(b)) return []; const p = []; for (let t = b; t; t = prev.get(t)) p.unshift(t); return p; };
    const rd = readout(ui); rd.textContent = '点一块地，主角会沿六邻格走过去';
    c.pick = tiles.filter(t => !t.userData.wall);
    c.tip = o => `<b>HEX ${o.userData.q},${o.userData.r}</b>高度 ${o.userData.h.toFixed(2)}`;
    c.onClick = o => { if (!o || o === at) return; path = bfs(at, o); step = 0; paint(); rd.textContent = path.length ? `SetHexPath · ${path.length - 1} 步` : '走不到：被墙隔开'; };
    scene.add(new THREE.HemisphereLight(0xdfe6ff, 0x0b0d18, 1.4));
    const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(-5, 9, 4); scene.add(key);
    camera.fov = 32; camera.position.set(0, 11, 9.5); camera.lookAt(0, 0, .4); camera.updateProjectionMatrix();
    const spin = orbit(el, root, { auto: .02, pitch: [-.12, .1], yaw: [-.6, .6] });
    let acc = 0;
    return dt => {
      spin(dt);
      if (path.length > 1) { acc += dt; if (acc > .22) { acc = 0; step++; if (step >= path.length) { at = path[path.length - 1]; path = []; paint(); } else at = path[step]; } }
      const tgt = new THREE.Vector3(at.position.x, at.userData.h + .25, at.position.z); token.position.lerp(tgt, .25); token.rotation.y += dt;
    };
  },

  /* 06 — a lathe-turned bronze zun with a band of cloud-and-thunder pattern. Form is illustrative. */
  async bronze(c) {
    const { scene, camera, el, ui } = c;
    const prof = [[0, 0], [.5, 0], [.52, .04], [.47, .1], [.46, .22], [.56, .34], [.68, .5], [.72, .64], [.66, .8], [.5, .94], [.4, 1.04], [.38, 1.16], [.44, 1.3], [.58, 1.48], [.76, 1.66], [.86, 1.76], [.84, 1.78], [.72, 1.7], [.54, 1.54], [.4, 1.38], [.34, 1.2]].map(([x, y]) => new THREE.Vector2(x, y));
    const cv = document.createElement('canvas'); cv.width = 2048; cv.height = 1024; const g = cv.getContext('2d');
    const grd = g.createLinearGradient(0, 0, 0, 1024); grd.addColorStop(0, '#766243'); grd.addColorStop(.5, '#4c4030'); grd.addColorStop(1, '#29271e'); g.fillStyle = grd; g.fillRect(0, 0, 2048, 1024);
    for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(${120 + Math.random() * 90},${170 + Math.random() * 60},${200 + Math.random() * 55},${Math.random() * .12})`; g.fillRect(Math.random() * 2048, Math.random() * 1024, 2 + Math.random() * 6, 2 + Math.random() * 6); }
    // cloud-and-thunder band on the belly (v ≈ .62—.78 of the profile height)
    const band = (y0, y1) => {
      g.fillStyle = '#14223c'; g.fillRect(0, y0, 2048, y1 - y0);
      g.strokeStyle = '#9fc4e8'; g.lineWidth = 5;
      const s = (y1 - y0) / 2;
      for (let x = 0; x < 2048; x += s) for (let k = 0; k < 2; k++) {
        const ox = x + 6, oy = y0 + k * s + 6, L = s - 12; g.beginPath();
        let cx = ox, cy = oy, l = L, dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        const phase = (Math.round(x / s) + k) % 2;
        g.moveTo(cx, cy); for (let i = 0; i < 7 && l > 6; i++) { const [dx, dy] = dirs[(i + phase * 2) % 4]; cx += dx * l; cy += dy * l; g.lineTo(cx, cy); if (i % 2) l -= 12; }
        g.stroke();
      }
      // a mask: two eyes and brows every quarter turn
      for (let q = 0; q < 4; q++) { const mx = q * 512 + 256, my = (y0 + y1) / 2; g.fillStyle = '#14223c'; g.fillRect(mx - 120, y0 + 4, 240, y1 - y0 - 8); g.strokeStyle = '#cfe2f5'; g.lineWidth = 7; [-1, 1].forEach(sd => { g.beginPath(); g.ellipse(mx + sd * 58, my, 30, 20, 0, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(mx + sd * 58, my, 8, 0, Math.PI * 2); g.fillStyle = '#cfe2f5'; g.fill(); g.beginPath(); g.moveTo(mx + sd * 20, my - 36); g.quadraticCurveTo(mx + sd * 90, my - 70, mx + sd * 112, my - 18); g.stroke(); }); g.beginPath(); g.moveTo(mx, y0 + 10); g.lineTo(mx, y1 - 10); g.stroke(); }
    };
    // lathe UVs run along the profile by point index (v = i / 20): belly = points 6—8, neck = points 12—13
    band(1024 * (1 - 8 / 20), 1024 * (1 - 6 / 20)); band(1024 * (1 - 13.2 / 20), 1024 * (1 - 12 / 20));
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping;
    const ves = new THREE.Mesh(new THREE.LatheGeometry(prof, 96), new THREE.MeshStandardMaterial({ map: t, metalness: .55, roughness: .48, side: THREE.DoubleSide }));
    const root = new THREE.Group(); root.add(ves); scene.add(root); ves.position.y = -.9;
    if (ui) {
      let patterned = true;
      btn(ui, '查看素面', function () { patterned = !patterned; ves.material.map = patterned ? t : null; ves.material.color.set(patterned ? '#ffffff' : '#726044'); ves.material.needsUpdate = true; this.textContent = patterned ? '查看素面' : '查看纹饰'; this.setAttribute('aria-pressed', !patterned); });
      readout(ui).textContent = '器形 / 纹饰空间示意 · 拖动旋转';
    }
    for (let k = 0; k < 4; k++) { const f = new THREE.Mesh(new THREE.BoxGeometry(.05, .5, .12), new THREE.MeshStandardMaterial({ color: '#2b4466', metalness: .5, roughness: .5 })); const a = k * Math.PI / 2; f.position.set(Math.cos(a) * .72, .64 - .9, Math.sin(a) * .72); f.rotation.y = -a; root.add(f); }
    scene.add(new THREE.AmbientLight(0x6f8bbf, .7));
    const kL = new THREE.DirectionalLight(0xdfe9ff, 2.4); kL.position.set(-3, 4, 4); scene.add(kL);
    const rim = new THREE.DirectionalLight(0x5aaeff, 3); rim.position.set(4, 2, -3); scene.add(rim);
    const ring = new THREE.Mesh(new THREE.RingGeometry(1.15, 1.17, 120), new THREE.MeshBasicMaterial({ color: COL.sky, transparent: true, opacity: .4, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.y = -.9; scene.add(ring);
    camera.position.set(0, .35, 4.1); camera.lookAt(0, 0, 0);
    const spin = orbit(el, root, { auto: .3, pitch: [-.2, .25] });
    return dt => spin(dt);
  },

  /* 07 — four rings of type, one per input, driven by the 19 time samples hard-coded in V4 */
  async afterglow(c) {
    const { scene, camera, el, ui } = c;
    const D = await load('assets/stage/afterglow-samples.json');
    const KEYS = [['flow', '人流', 15, 200, 'FLOW'], ['noise', '噪声 dB', 50, 96, 'NOISE'], ['pm25', 'PM2.5', 15, 65, 'PM2.5'], ['wind', '风 m/s', .5, 5, 'WIND']];
    const ringTex = word => { const cv = document.createElement('canvas'); cv.width = 2048; cv.height = 128; const g = cv.getContext('2d'); g.fillStyle = '#eef0f6'; g.font = '700 84px "Inter Tight",sans-serif'; g.textBaseline = 'middle'; let x = 0; while (x < 2048) { g.fillText(word + ' · ', x, 68); x += g.measureText(word + ' · ').width; } const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; t.repeat.x = 3; return t; };
    const rings = KEYS.map(([k, cn, lo, hi, en], i) => {
      const geo = new THREE.CylinderGeometry(1, 1, .34, 160, 1, true);
      const base = geo.attributes.position.array.slice();
      const mat = new THREE.MeshBasicMaterial({ map: ringTex(en), transparent: true, side: THREE.DoubleSide, depthWrite: false, opacity: .95, color: ['#ffffff', '#dedede', '#a8a8a8', '#eeeeee'][i] });
      const m = new THREE.Mesh(geo, mat); m.position.y = 1.1 - i * .62; scene.add(m);
      return { k, cn, lo, hi, m, geo, base, r: 1 };
    });
    const core = new THREE.Mesh(new THREE.SphereGeometry(.16, 24, 16), new THREE.MeshBasicMaterial({ color: COL.white })); scene.add(core); core.position.y = .17;
    const spine = segs([new THREE.Vector3(0, -1.4, 0), new THREE.Vector3(0, 1.6, 0)], lineMat('#aaaaaa', .4)); scene.add(spine);
    camera.position.set(0, 2.4, 6.2); camera.lookAt(0, .1, 0);
    const rd = readout(ui);
    let idx = 8, auto = !reduce;
    const ctrl = document.createElement('input'); ctrl.type = 'range'; ctrl.min = 0; ctrl.max = D.length - 1; ctrl.value = idx; ctrl.setAttribute('aria-label', '时刻'); ctrl.style.cssText = 'width:min(320px,60vw);accent-color:#5aaeff';
    ctrl.addEventListener('input', () => { idx = +ctrl.value; auto = false; play.setAttribute('aria-pressed', false); });
    ui.appendChild(ctrl);
    const play = btn(ui, '自动播放', function () { auto = !auto; this.setAttribute('aria-pressed', auto); }, true);
    let f = idx, clock = 0;
    return dt => {
      clock += dt;
      if (auto && !reduce) { f = (f + dt * .35) % D.length; idx = Math.floor(f); ctrl.value = idx; } else f += (idx - f) * .08;
      const i0 = Math.floor(f) % D.length, i1 = (i0 + 1) % D.length, k = f - Math.floor(f);
      const v = key => lerp(D[i0][key], D[i1][key], k);
      const noiseN = (v('noise') - 50) / 46, windN = (v('wind') - .5) / 4.5;
      rings.forEach((R, i) => {
        const n = Math.max(0, Math.min(1, (v(R.k) - R.lo) / (R.hi - R.lo)));
        const rad = .7 + n * 1.5; R.r += (rad - R.r) * .1;
        const p = R.geo.attributes.position.array;
        for (let j = 0; j < p.length; j += 3) { const ang = Math.atan2(R.base[j + 2], R.base[j]); const w = 1 + Math.sin(ang * (3 + Math.round(noiseN * 5)) + clock * 1.4 + i) * noiseN * .09; p[j] = Math.cos(ang) * R.r * w; p[j + 2] = Math.sin(ang) * R.r * w; p[j + 1] = R.base[j + 1]; }
        R.geo.attributes.position.needsUpdate = true;
        R.m.rotation.y += dt * (.08 + windN * .5) * (i % 2 ? 1 : -1);
        R.m.rotation.z = (windN - .45) * .18;
      });
      const s = D[i0];
      rd.textContent = `${s.time} · 人流 ${s.flow} · 噪声 ${s.noise} dB · PM2.5 ${s.pm25} · 风 ${s.wind} m/s`;
    };
  },

  /* 08 — three gimbal rings: course awareness, interest, pressure. Structure only. */
  async compass(c) {
    const { scene, camera, el } = c;
    c.light = true;
    const ringTex = (txt, col) => { const cv = document.createElement('canvas'); cv.width = 2048; cv.height = 96; const g = cv.getContext('2d'); g.fillStyle = col; g.font = '900 60px "Noto Sans SC",sans-serif'; g.textBaseline = 'middle'; let x = 10; while (x < 2048) { g.fillText(txt, x, 50); x += g.measureText(txt).width + 40; } const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; t.repeat.x = 2; return t; };
    const mk = (r, txt, col) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, .22, 128, 1, true), new THREE.MeshBasicMaterial({ map: ringTex(txt, col), transparent: true, side: THREE.DoubleSide, depthWrite: false })); const edge = new THREE.Mesh(new THREE.TorusGeometry(r, .008, 6, 128), new THREE.MeshBasicMaterial({ color: col })); edge.rotation.x = Math.PI / 2; edge.position.y = .11; m.add(edge); const e2 = edge.clone(); e2.position.y = -.11; m.add(e2); return m; };
    const g1 = new THREE.Group(), g2 = new THREE.Group(), g3 = new THREE.Group();
    g1.add(mk(1.6, '课程认知 · COURSE AWARENESS · ', COL.ink)); g2.add(mk(1.25, '兴趣探索 · INTEREST · ', COL.cobalt)); g3.add(mk(.9, '学习压力 · PRESSURE · ', COL.sky));
    g1.add(g2); g2.add(g3); scene.add(g1); g2.rotation.x = Math.PI / 2; g3.rotation.z = Math.PI / 2;
    const needle = new THREE.Mesh(new THREE.OctahedronGeometry(.5, 0), new THREE.MeshBasicMaterial({ color: COL.cobalt, wireframe: false })); needle.scale.set(.18, 1, .18); g3.add(needle);
    const tick = []; for (let i = 0; i < 72; i++) { const a = i / 72 * Math.PI * 2, r1 = 1.82, r2 = i % 6 ? 1.88 : 1.96; tick.push(new THREE.Vector3(Math.cos(a) * r1, 0, Math.sin(a) * r1), new THREE.Vector3(Math.cos(a) * r2, 0, Math.sin(a) * r2)); }
    const ticks = segs(tick, lineMat(COL.ink, .6)); scene.add(ticks);
    camera.position.set(0, 1.6, 5.4); camera.lookAt(0, 0, 0);
    const spin = orbit(el, g1, { auto: .15, pitch: [-.3, .3] });
    let t = 0;
    return dt => { spin(dt); t += dt; g2.rotation.y += dt * .35; g3.rotation.y -= dt * .55; needle.rotation.y = Math.sin(t * .8) * .6; };
  },

  /* 09 — a Möbius band with material blocks travelling round it; five stops. Structure only. */
  async loop(c) {
    const { scene, camera, el } = c;
    c.light = true;
    const U = 220, V = 8, pos = [], idx = [];
    const P = (u, v) => { const a = u * Math.PI * 2, w = (v - .5) * .9; return new THREE.Vector3((2 + w * Math.cos(a / 2)) * Math.cos(a), w * Math.sin(a / 2), (2 + w * Math.cos(a / 2)) * Math.sin(a)); };
    for (let i = 0; i <= U; i++) for (let j = 0; j <= V; j++) { const p = P(i / U, j / V); pos.push(p.x, p.y, p.z); }
    for (let i = 0; i < U; i++) for (let j = 0; j < V; j++) { const a = i * (V + 1) + j, b = a + V + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    const band = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: .9, side: THREE.DoubleSide }));
    const root = new THREE.Group(); root.add(band); scene.add(root);
    const edgeA = [], edgeB = []; for (let i = 0; i <= U; i++) { edgeA.push(P(i / U, 0)); edgeB.push(P(i / U, 1)); }
    root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(edgeA), lineMat(COL.cobalt))); root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(edgeB), lineMat(COL.ink, .6)));
    const stops = ['交换', '团购', '预约', '档案', '取件'];
    const labels = stops.map((s, i) => { const l = textPlane(`0${i + 1} ${s}`, { size: 90, weight: 900, color: COL.white, bg: i % 2 ? COL.ink : COL.cobalt, height: .3 }); const p = P(i / 5 + .02, .5); l.position.copy(p).multiplyScalar(1.28).setY(p.y + .45); root.add(l); return l; });
    c.billboards = labels;
    const blocks = Array.from({ length: 18 }, (_, i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(.22, .1, .3), new THREE.MeshStandardMaterial({ color: [COL.cobalt, COL.sky, '#ffffff', COL.ink][i % 4], roughness: .7 })); root.add(m); return { m, u: i / 18 }; });
    scene.add(new THREE.HemisphereLight(0xffffff, 0xc9d3ea, 1.5)); const dl = new THREE.DirectionalLight(0xffffff, 1.4); dl.position.set(3, 6, 4); scene.add(dl);
    camera.position.set(0, 3.2, 6.4); camera.lookAt(0, 0, 0);
    const spin = orbit(el, root, { auto: .12, pitch: [-.25, .25] });
    return dt => { spin(dt); blocks.forEach(b => { b.u = (b.u + dt * .03) % 1; const p = P(b.u, .5), q = P((b.u + .002) % 1, .5); b.m.position.copy(p).add(new THREE.Vector3(0, .06, 0)); b.m.lookAt(q.x, q.y + .06, q.z); }); };
  },

  /* 10 — a folding fan that opens; its leaf shows the garden in four seasons (in-game frames) */
  async garden(c) {
    const { scene, camera, el, ui } = c;
    c.light = true;
    const seasons = [['秋', 'garden-autumn'], ['冬', 'garden-winter'], ['春', 'garden-spring'], ['夏', 'garden-summer']];
    const texs = seasons.map(([, n]) => tex(`assets/${n}.webp`));
    const span = Math.PI * .82, r0 = .55, r1 = 2.35;
    const leafGeo = () => new THREE.RingGeometry(r0, r1, 64, 1, Math.PI / 2 - span / 2, span);
    const leaf = new THREE.Mesh(leafGeo(), new THREE.MeshBasicMaterial({ map: texs[0], side: THREE.DoubleSide, transparent: true }));
    // map the image across the leaf's bounding box
    const fit = g => { const p = g.attributes.position, uv = g.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + r1) / (2 * r1), (p.getY(i) - r0 * .3) / (r1 - r0 * .3)); uv.needsUpdate = true; };
    fit(leaf.geometry);
    const root = new THREE.Group(); scene.add(root); root.add(leaf);
    const ribs = Array.from({ length: 17 }, (_, i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(.035, r1 + .25, .02), new THREE.MeshBasicMaterial({ color: i % 4 ? '#24345f' : COL.ink })); m.geometry.translate(0, (r1 + .25) / 2, 0); root.add(m); return m; });
    const pivot = new THREE.Mesh(new THREE.CircleGeometry(.07, 24), new THREE.MeshBasicMaterial({ color: COL.cobalt })); pivot.position.z = .03; root.add(pivot);
    const edge = new THREE.Line(new THREE.BufferGeometry().setFromPoints(new THREE.Path().absarc(0, 0, r1, Math.PI / 2 - span / 2, Math.PI / 2 + span / 2).getPoints(80)), lineMat(COL.ink, .8)); root.add(edge);
    root.position.y = -1.05;
    camera.position.set(0, .2, 5.6); camera.lookAt(0, .1, 0);
    const spin = orbit(el, root, { auto: 0, pitch: [-.2, .2], yaw: [-.5, .5] });
    let open = 0, target = 1, shown = -1;
    group(ui, seasons.map(s => s[0]), i => { leaf.material.map = texs[i]; leaf.material.needsUpdate = true; open = .35; });
    btn(ui, '收扇 / 开扇', () => { target = target ? 0 : 1; });
    return dt => {
      spin(dt);
      open += (target - open) * (reduce ? 1 : .04);
      if (Math.abs(open - shown) < .002) return;
      shown = open;
      const sp = span * Math.max(.04, open);
      leaf.geometry.dispose(); leaf.geometry = new THREE.RingGeometry(r0, r1, 64, 1, Math.PI / 2 - sp / 2, sp); fit(leaf.geometry);
      ribs.forEach((m, i) => { m.rotation.z = -sp / 2 + sp * i / (ribs.length - 1); });
      edge.visible = open > .97;
    };
  },

  /* 11 — a projector beam lands on a screen; the first chapter's in-game frames run through it */
  async jingwai(c) {
    const { scene, camera, el, ui } = c;
    const frames = ['jingwai/hotel-v138', 'jingwai/workbench-v138', 'jingwai/chandelier-v138', 'jingwai/ada-v138', 'jingwai/paper-map-v138', 'jingwai/editing-v138', 'jingwai/arrival-note-v138'];
    const texs = frames.map(f => tex(`assets/${f}.webp`));
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 2.7), new THREE.MeshBasicMaterial({ map: texs[0] })); screen.position.set(0, .3, -2.4); scene.add(screen);
    const frameLine = segs([[-2.45, -1.1], [2.45, -1.1], [2.45, -1.1], [2.45, 1.7], [2.45, 1.7], [-2.45, 1.7], [-2.45, 1.7], [-2.45, -1.1]].map(([x, y]) => new THREE.Vector3(x, y, -2.39)), lineMat(COL.sky, .6)); scene.add(frameLine);
    const src = new THREE.Vector3(0, .9, 5.2);
    const beamGeo = new THREE.BufferGeometry(); const corners = [[-2.4, -1.05], [2.4, -1.05], [2.4, 1.65], [-2.4, 1.65]].map(([x, y]) => new THREE.Vector3(x, y, -2.38));
    const bp = []; for (let i = 0; i < 4; i++) { const a = corners[i], b = corners[(i + 1) % 4]; bp.push(src.x, src.y, src.z, a.x, a.y, a.z, b.x, b.y, b.z); }
    beamGeo.setAttribute('position', new THREE.Float32BufferAttribute(bp, 3));
    const beam = new THREE.Mesh(beamGeo, new THREE.MeshBasicMaterial({ color: COL.sky, transparent: true, opacity: .07, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })); scene.add(beam);
    scene.add(segs(corners.flatMap(cn => [src, cn]), lineMat(COL.sky, .25)));
    const dust = new THREE.BufferGeometry(), dn = 900, dp = new Float32Array(dn * 3);
    for (let i = 0; i < dn; i++) { const k = Math.random(), a = corners[Math.floor(Math.random() * 4)]; const p = src.clone().lerp(a.clone().lerp(new THREE.Vector3(0, .3, -2.38), Math.random()), k); dp.set([p.x, p.y, p.z], i * 3); }
    dust.setAttribute('position', new THREE.BufferAttribute(dp, 3));
    scene.add(new THREE.Points(dust, new THREE.PointsMaterial({ color: COL.white, size: .015, transparent: true, opacity: .6, blending: THREE.AdditiveBlending, depthWrite: false })));
    const proj = new THREE.Mesh(new THREE.BoxGeometry(.6, .4, .7), new THREE.MeshBasicMaterial({ color: '#1a2140' })); proj.position.copy(src).add(new THREE.Vector3(0, 0, .4)); scene.add(proj);
    // film strip curling through the beam
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-4.2, -1.6, 2.4), new THREE.Vector3(-1.6, -.6, 1.4), new THREE.Vector3(0, -.2, 1.8), new THREE.Vector3(1.8, -.7, 1.2), new THREE.Vector3(4.2, -1.8, 2.2)]);
    const stripN = 9, cells = [];
    for (let i = 0; i < stripN; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(.78, .44), new THREE.MeshBasicMaterial({ map: texs[i % texs.length], side: THREE.DoubleSide })); const b = new THREE.Mesh(new THREE.PlaneGeometry(.9, .6), new THREE.MeshBasicMaterial({ color: '#05070f', side: THREE.DoubleSide })); b.position.z = -.002; m.add(b); scene.add(m); cells.push({ m, u: i / stripN }); }
    const tc = textPlane('23:16:50', { size: 120, weight: 700, family: '"JetBrains Mono",monospace', color: COL.sky, height: .3 }); tc.position.set(1.9, 1.95, -2.35); scene.add(tc);
    camera.position.set(3.6, 1.6, 7.4); camera.lookAt(0, .2, -.6);
    const root = new THREE.Group(); scene.children.slice().forEach(o => { if (o !== camera) root.add(o); }); scene.add(root);
    const spin = orbit(el, root, { auto: 0, pitch: [-.1, .1], yaw: [-.4, .4] });
    const rd = readout(ui);
    let t = 0, fi = 0, sec = 50;
    return dt => {
      spin(dt); t += dt;
      cells.forEach(cl => { cl.u = (cl.u + dt * .025) % 1; const p = curve.getPoint(cl.u), q = curve.getPoint((cl.u + .01) % 1); cl.m.position.copy(p); cl.m.lookAt(q.clone().add(new THREE.Vector3(0, 0, 3))); });
      if (t > 2.2) { t = 0; fi = (fi + 1) % texs.length; screen.material.map = texs[fi]; sec = sec >= 62 ? 50 : sec + 1; const s = `23:${sec >= 60 ? '17' : '16'}:${String(sec % 60).padStart(2, '0')}`; tc.material.map.dispose(); const n = textPlane(s, { size: 120, weight: 700, family: '"JetBrains Mono",monospace', color: COL.sky, height: .3 }); tc.material.map = n.material.map; rd.textContent = `${s} · ${frames[fi].split('/')[1].replace(/-v\d+/, '').toUpperCase()} · 实机帧`; }
    };
  }
};
const pad2 = n => String(n).padStart(2, '0');
const dirCN = d => (d === 'A_to_B' ? 'P01 → P02' : d === 'B_to_A' ? 'P02 → P01' : '方向未确认');
const stCN = s => ({ observed_no_response_zero: '对方没有回应', observed_contact_model_estimate: '接触已确认 · 有模型估计', not_observable_unknown: '画面看不清' }[s] || s);

/* =================================================================
   MOUNT
   ================================================================= */
export async function mount(el, name, opt = {}) {
  const make = SCENES[name]; if (el.dataset.mounted) return;
  if (!make) { el.classList.add('st-fail'); const t=el.querySelector('.st-load'); if(t)t.textContent='空间视图暂不可用，请阅读本节图解。'; return; }
  el.dataset.mounted = 1;
  try { await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1200))]); } catch (e) { /* fonts optional */ }
  const host = el.querySelector('.st-canvas'), ui = el.querySelector('.st-ui');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(38, 1, .05, 400);
  const c = { el, renderer, scene, camera, ui, opt };
  const tick = await make(c);
  if (c.light) { el.classList.add('st-light'); el.closest('.o-stage')?.classList.add('st-light'); }
  const resize = () => { const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); camera.aspect = w / h; c.fit && c.fit(w / h); camera.updateProjectionMatrix(); };
  resize(); new ResizeObserver(resize).observe(el);
  // hover + click picking
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(9, 9), tip = document.createElement('div'); tip.className = 'st-tip'; el.appendChild(tip);
  let hovered = null, mx = 0, my = 0, downAt = 0;
  el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; ndc.set(mx / r.width * 2 - 1, -(my / r.height) * 2 + 1); });
  el.addEventListener('pointerleave', () => { ndc.set(9, 9); });
  el.addEventListener('pointerdown', () => { downAt = performance.now(); });
  el.addEventListener('click', () => { if (performance.now() - downAt < 300 && c.onClick) c.onClick(hovered); });
  let visible = true, last = performance.now();
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { last = performance.now(); requestAnimationFrame(loop); } }).observe(el);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && visible) { last = performance.now(); requestAnimationFrame(loop); } });
  const loop = now => {
    if (!visible || document.hidden) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    tick && tick(reduce ? dt * .25 : dt);
    (c.billboards || []).forEach(b => b.quaternion.copy(camera.quaternion));
    if (c.pick && ndc.x < 2) {
      ray.setFromCamera(ndc, camera); const hit = ray.intersectObjects(c.pick, false)[0], o = hit ? hit.object : null;
      if (o !== hovered) { hovered = o; c.onHover && c.onHover(o); el.style.cursor = o ? 'pointer' : ''; }
      if (o && c.tip) { tip.innerHTML = c.tip(o); tip.style.left = mx + 'px'; tip.style.top = my + 'px'; tip.classList.add('on'); } else tip.classList.remove('on');
    } else if (hovered) { hovered = null; c.onHover && c.onHover(null); tip.classList.remove('on'); }
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  el.classList.add('ready');
  const label=el.querySelector('.st-load'); if(label)label.textContent='空间视图已就绪';
}
