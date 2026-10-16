/* Privacy City — bespoke page.
   Cold white model manual: white clay city, glass dialogs, label sheets, HUD frames, cobalt line drawings, one dark HUD act.
   References (number = position in _refs/pins.txt):
     title / persona city / feature console   R447  white clay isometric city, floating blue data screens
     label sheets / rule / gives             R258  label stickers — codes, barcodes, QR, hazard stripes
     intro HUD / demo                        R294  cyan HUD frame set
     question                                R239  hierarchical grid, X placeholder boxes
     build / architecture                    R441  PlastiFab cobalt field, white line isometric drawing
     model                                   R291  dark HUD "system reboot"
     evaluation                              R263  blue template grid, every record a tile
   Content blocks carry a key (k). This file always looks blocks up by key, never by array position. */
(() => {
  const PG = (window.PAGES = window.PAGES || {});
  const VZ = window.VZ, T = VZ.T;
  const E = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rnd = seed => { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pad2 = n => String(n).padStart(2, '0');
  const bars = (n, seed = 3) => { const r = rnd(seed); return `<i class="p-bc" aria-hidden="true">${Array.from({ length: n }, () => `<b style="--w:${1 + Math.floor(r() * 4)}"></b>`).join('')}</i>`; };
  const qr = seed => { const r = rnd(seed); return `<i class="p-qr" aria-hidden="true">${Array.from({ length: 81 }, (_, i) => { const x = i % 9, y = Math.floor(i / 9), eye = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5); return `<b class="${eye ? ((x % 6 === 1 && y % 6 === 1) || (x === 7 && y === 1) ? '' : 'on') : r() < .5 ? 'on' : ''}"></b>`; }).join('')}</i>`; };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* feature groups, in the order of feature_engine.py */
  const GROUPS = [['A', '行为节奏', 8], ['B', '阅读行为', 8], ['C', '风险偏好', 10], ['D', '情境特征', 8], ['E', '时序演变', 6], ['F', '交互效应', 8]];
  const GCOL = { A: '#27c3ff', B: '#a9b9ff', C: '#0b1530', D: '#ffd23f', E: '#00c896', F: '#ff6a3d' }, GCOL_L = GCOL;   // one palette, readable on cobalt and on white
  const groupOf = i => { let n = 0; for (const g of GROUPS) { n += g[2]; if (i < n) return g; } return GROUPS[5]; };
  const groupStart = gi => GROUPS.slice(0, gi).reduce((a, g) => a + g[2], 0);
  const SRC = { t: ['五道请求的轨迹', '#27c3ff'], p: ['带着画像的信号', '#a9b9ff'], r: ['和画像无关的随机背景', '#0b1530'], x: ['前面字段的乘积', '#ffd23f'] };

  /* find a block by key in any act of the scene */
  const findBlock = (s, key) => { for (const a of (s.acts || [])) for (const b of (a.blocks || [])) if (b.k === key) return b; return null; };
  /* per act: place blocks by key */
  const use = (a, u, kit) => {
    const m = {}; (a.blocks || []).forEach((b, i) => { if (b.k) m[b.k] = i; });
    const need = k => { if (!(k in m)) { console.warn('[privacy-city] block missing', a.id, k); return false; } return true; };
    return {
      b: k => need(k) ? u.b(m[k]) : '',
      o: k => need(k) ? u.o(m[k]) : {},
      chart: (k, tag) => { if (!need(k)) return ''; const b = u.o(m[k]); return kit.chart(b.chart, b.cap); },
      charts: k => { if (!need(k)) return ''; return kit.charts(u.o(m[k]).charts); },
      rest: u.rest
    };
  };

  /* ================================================================
     ISO — a tiny isometric drawing kit. Grid units; 30° projection.
     Faces: top, left (plane y = y+d), right (plane x = x+w).
     ================================================================ */
  const ISO = (() => {
    const U = 32, CX = Math.cos(Math.PI / 6) * U, SY = U / 2;
    const PAL = {
      clay: { top: '#ffffff', l: '#e9eef8', r: '#d2daec', ln: 'rgba(25,45,120,.12)', win: '#c3cde6', lit: '#8aa2ff' },
      cream: { top: '#fbfcff', l: '#eef2fa', r: '#dbe2f1', ln: 'rgba(25,45,120,.10)', win: '#cdd6ea', lit: '#8aa2ff' },
      blue: { top: '#5c75ff', l: '#2f49f2', r: '#1b30c4', ln: 'rgba(255,255,255,.35)', win: '#9fb2ff', lit: '#ffffff' },
      sky: { top: '#7fdcff', l: '#3ec3f5', r: '#1fa5de', ln: 'rgba(255,255,255,.4)', win: '#d8f4ff', lit: '#ffffff' },
      pale: { top: '#ffffff', l: '#cfdaff', r: '#9fb3ff', ln: 'rgba(15,35,150,.35)', win: '#7c93ff', lit: '#ffd23f' },
      ink: { top: '#2b3558', l: '#16203f', r: '#0b1530', ln: 'rgba(255,255,255,.15)', win: '#4f5e8f', lit: '#27c3ff' },
      gold: { top: '#ffe27a', l: '#ffd23f', r: '#e6b400', ln: 'rgba(0,0,0,.12)', win: '#fff0b3', lit: '#ffffff' },
      glass: { top: 'rgba(255,255,255,.78)', l: 'rgba(205,224,255,.7)', r: 'rgba(160,190,255,.7)', ln: 'rgba(31,59,255,.4)', win: '#fff', lit: '#fff' }
    };
    const hull = pts => {
      const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]); if (p.length < 3) return p;
      const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
      for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
      for (const q of p.slice().reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
      return lo.slice(0, -1).concat(up.slice(0, -1));
    };
    let uid = 0;
    const scene = (o = {}) => {
      const id = 'iso' + (++uid), items = [], under = [], over = [], shadow = [];
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      const P = (x, y, z = 0) => { const p = [(x - y) * CX, (x + y) * SY - z * U]; if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; return p; };
      const q = pts => pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
      const poly = (pts, fill, extra = '') => `<polygon points="${q(pts)}" fill="${fill}" ${extra}/>`;
      const S = {
        P, U, CX, SY,
        /* ground plate / road */
        plate(x, y, w, d, p = {}) {
          const z = p.z || 0, th = p.th ?? .22, c = p.pal || PAL.clay, fill = p.fill || c.top;
          const top = [P(x, y, z), P(x + w, y, z), P(x + w, y + d, z), P(x, y + d, z)];
          let s = '';
          if (th) s += poly([P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z - th), P(x, y + d, z - th)], p.l || c.l) + poly([P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z - th), P(x + w, y, z - th)], p.r || c.r);
          s += poly(top, fill, `stroke="${p.ln || c.ln}" stroke-width="1"`);
          if (p.dash) { const a = P(x + (p.dash === 'y' ? w / 2 : .2), y + (p.dash === 'y' ? .2 : d / 2), z), b = P(x + (p.dash === 'y' ? w / 2 : w - .2), y + (p.dash === 'y' ? d - .2 : d / 2), z); s += `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="${p.dashc || '#c4cde4'}" stroke-width="1.4" stroke-dasharray="6 6"/>`; }
          (p.over ? over : under).push(s); return S;
        },
        box(x, y, z, w, d, h, p = {}) {
          const top = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)];
          const lf = [P(x, y + d, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x, y + d, z)], rt = [P(x + w, y, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x + w, y, z)];
          const faces = c => {
            let s = poly(lf, c.l, `stroke="${c.ln}" stroke-width="1"`) + poly(rt, c.r, `stroke="${c.ln}" stroke-width="1"`) + poly(top, c.top, `stroke="${c.ln}" stroke-width="1"`);
            if (p.win && h > 1) {
              const r = rnd(Math.round(x * 31 + y * 17 + h * 7)), cols = Math.max(2, Math.round(w * 2.2)), rows = Math.max(2, Math.round(h * 1.6));
              const face = (fn, n, tone) => { let t = ''; for (let i = 0; i < n; i++) for (let j = 0; j < rows; j++) { const u0 = (i + .22) / n, u1 = (i + .78) / n, v0 = (j + .3) / (rows + .5) * .9 + .05, v1 = (j + .72) / (rows + .5) * .9 + .05; t += poly([fn(u0, v1), fn(u1, v1), fn(u1, v0), fn(u0, v0)], r() < (p.litRate ?? .12) ? c.lit : c.win, `opacity="${tone}"`); } return t; };
              s += face((u, v) => P(x + u * w, y + d, z + v * h), cols, .8) + face((u, v) => P(x + w, y + u * d, z + v * h), Math.max(2, Math.round(d * 2.2)), .65);
            }
            if (p.roof) s += poly([P(x + w * .2, y + d * .2, z + h + .001), P(x + w * .8, y + d * .2, z + h + .001), P(x + w * .8, y + d * .8, z + h + .001), P(x + w * .2, y + d * .8, z + h + .001)], p.roof, 'opacity=".9"');
            return s;
          };
          const c0 = p.pal || PAL.clay;
          const s = p.alt ? `<g class="base">${faces(c0)}</g><g class="alt">${faces(p.alt)}</g>` : faces(c0);
          const k = Math.min(h * .55, 3.2);
          if (!p.noShadow) shadow.push(`<polygon points="${q(hull([P(x, y, z), P(x + w, y, z), P(x + w, y + d, z), P(x, y + d, z), P(x + k, y + k * .2, z), P(x + w + k, y + k * .2, z), P(x + w + k, y + d + k * .2, z), P(x + k, y + d + k * .2, z)]))}"/>`);
          items.push({ d: x + y + (w + d) / 2 + z * .02, s: `<g class="${p.cls || 'bd'}"${p.attr || ''}>${s}</g>` }); return S;
        },
        cyl(cx, cy, z, r, h, p = {}) {
          const rx = r * U * 1.2247, ry = r * U * .7071, t = P(cx, cy, z + h), b = P(cx, cy, z);
          const body = c => { const g = 'g' + (++uid);
            let s = `<defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="${c.l}"/><stop offset=".55" stop-color="${c.top}"/><stop offset="1" stop-color="${c.r}"/></linearGradient></defs>`;
            s += `<path d="M${(t[0] - rx).toFixed(1)} ${t[1].toFixed(1)}V${b[1].toFixed(1)}A${rx.toFixed(1)} ${ry.toFixed(1)} 0 0 0 ${(t[0] + rx).toFixed(1)} ${b[1].toFixed(1)}V${t[1].toFixed(1)}Z" fill="url(#${g})" stroke="${c.ln}"/>`;
            s += `<ellipse cx="${t[0].toFixed(1)}" cy="${t[1].toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${p.topFill || c.top}" stroke="${c.ln}"/>`;
            if (p.band) { const m = P(cx, cy, z + h * .5); s += `<path d="M${(m[0] - rx).toFixed(1)} ${m[1].toFixed(1)}A${rx.toFixed(1)} ${ry.toFixed(1)} 0 0 0 ${(m[0] + rx).toFixed(1)} ${m[1].toFixed(1)}" fill="none" stroke="${p.band}" stroke-width="2"/>`; }
            return s; };
          const c0 = p.pal || PAL.clay, s = p.alt ? `<g class="base">${body(c0)}</g><g class="alt">${body(p.alt)}</g>` : body(c0);
          if (!p.noShadow) shadow.push(`<polygon points="${q(hull([P(cx - r, cy - r, z), P(cx + r, cy - r, z), P(cx + r, cy + r, z), P(cx - r, cy + r, z), P(cx - r + h * .5, cy - r + h * .1, z), P(cx + r + h * .5, cy + r + h * .1, z)]))}"/>`);
          items.push({ d: cx + cy + z * .02 + .2, s: `<g class="${p.cls || 'bd'}"${p.attr || ''}>${s}</g>` }); return S;
        },
        tree(x, y, p = {}) {
          const r = (p.r || .42) * U, b = P(x, y, 0), t = P(x, y, p.h || .9), g = 'g' + (++uid), col = p.col || ['#a9c4ff', '#4d73ff'];
          let s = `<defs><radialGradient id="${g}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="${col[0]}"/><stop offset="1" stop-color="${col[1]}"/></radialGradient></defs>`;
          s += `<line x1="${b[0].toFixed(1)}" y1="${b[1].toFixed(1)}" x2="${t[0].toFixed(1)}" y2="${(t[1] + r * .5).toFixed(1)}" stroke="#9aa6c4" stroke-width="2.4"/><circle cx="${t[0].toFixed(1)}" cy="${t[1].toFixed(1)}" r="${r.toFixed(1)}" fill="url(#${g})"/>`;
          shadow.push(`<ellipse cx="${(b[0] + 5).toFixed(1)}" cy="${(b[1] + 1).toFixed(1)}" rx="${(r * .9).toFixed(1)}" ry="${(r * .45).toFixed(1)}"/>`);
          items.push({ d: x + y + .3, s: `<g class="tr">${s}</g>` }); return S;
        },
        /* a vertical panel on the plane x = const (facing the right-front) or y = const */
        screen(p) {
          const { x, y, z, w, h, plane = 'x' } = p, m = (u, v) => plane === 'x' ? P(x, y + u * w, z + v * h) : P(x + u * w, y, z + v * h);
          const quad = (u0, v0, u1, v1, fill, ex = '') => poly([m(u0, v1), m(u1, v1), m(u1, v0), m(u0, v0)], fill, ex);
          let s = `<polygon points="${q([m(0, 1), m(1, 1), m(1, 0), m(0, 0)])}" fill="#2441ff" stroke="#fff" stroke-width="1.5" style="filter:drop-shadow(0 10px 18px rgba(31,59,255,.45))"/>`;
          s += quad(.05, .08, .95, .92, '#f7f9ff');
          (p.bars || []).forEach((v, i, a) => { const n = a.length, u0 = .12 + i * (.76 / n), u1 = u0 + .76 / n * .62; s += quad(u0, .14, u1, .14 + v * .56, i === (p.hot ?? -1) ? '#1f3bff' : '#8aa2ff'); });
          if (p.line) { const pts = p.line.map((v, i, a) => m(.12 + i * .76 / (a.length - 1), .16 + v * .58)); s += `<polyline points="${q(pts)}" fill="none" stroke="#1f3bff" stroke-width="2"/>` + pts.map(t => `<circle cx="${t[0].toFixed(1)}" cy="${t[1].toFixed(1)}" r="2.4" fill="#1f3bff"/>`).join(''); }
          if (p.dots) p.dots.forEach(([u, v, r]) => { const t = m(u, v); s += `<circle cx="${t[0].toFixed(1)}" cy="${t[1].toFixed(1)}" r="${r || 3}" fill="#1f3bff"/>`; });
          if (p.toggle) { const a = m(.12, .78), b = m(.34, .78); s += `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="#1f3bff" stroke-width="5" stroke-linecap="round"/>`; }
          over.push(`<g class="sc" style="animation-delay:${(p.delay || 0)}s">${s}</g>`); return S;
        },
        pin(x, y, z, p = {}) {
          const t = P(x, y, z), c = p.col || '#1f3bff';
          over.push(`<g class="pn" transform="translate(${t[0].toFixed(1)} ${t[1].toFixed(1)})"><g class="pn-b"><line x1="0" y1="0" x2="0" y2="${p.stem ?? 0}" stroke="${c}" stroke-width="1.6" stroke-dasharray="3 3"/><path d="M0 0C-9-12-12-18-12-24A12 12 0 1 1 12-24C12-18 9-12 0 0Z" transform="translate(0 -6)" fill="${c}"/><circle cx="0" cy="-30" r="4.6" fill="#fff" transform="translate(0 0)"/></g></g>`); return S;
        },
        /* a flat text label standing at a point; text stays screen-aligned */
        text(x, y, z, str, p = {}) { const t = P(x, y, z); over.push(`<text x="${t[0].toFixed(1)}" y="${t[1].toFixed(1)}" font-size="${p.size || 12}" font-family="IBM Plex Mono,monospace" font-weight="${p.weight || 600}" fill="${p.fill || '#1f3bff'}" text-anchor="${p.anchor || 'middle'}" letter-spacing=".08em">${E(str)}</text>`); return S; },
        badge(x, y, z, n, p = {}) { const t = P(x, y, z); over.push(`<g class="bg${p.cls ? ' ' + p.cls : ''}"${p.attr || ''} transform="translate(${t[0].toFixed(1)} ${t[1].toFixed(1)})"><g class="bi"><circle r="${p.r || 15}" fill="${p.fill || '#fff'}" stroke="${p.stroke || '#1f3bff'}" stroke-width="2"/><text y="${(p.size || 15) * .36}" font-size="${p.size || 15}" font-family="Archivo,Inter Tight,sans-serif" font-weight="800" text-anchor="middle" fill="${p.ink || '#1f3bff'}">${E(n)}</text></g></g>`); return S; },
        /* polyline on the ground */
        path(pts, p = {}) { const a = pts.map(([x, y, z = 0]) => P(x, y, z)); under.push(`<polyline class="${p.cls || ''}" points="${q(a)}" fill="none" stroke="${p.stroke || '#fff'}" stroke-width="${p.w || 3}" stroke-linejoin="round" stroke-linecap="round" ${p.dash ? `stroke-dasharray="${p.dash}"` : ''}/>`); return S; },
        raw(svg, layer = 'over') { (layer === 'under' ? under : layer === 'item' ? items : over).push(layer === 'item' ? { d: 0, s: svg } : svg); return S; },
        svg(p = {}) {
          const pd = p.pad ?? 24, vx = x0 - pd, vy = y0 - pd, vw = x1 - x0 + 2 * pd, vh = y1 - y0 + 2 * pd, sh = p.shadow || 'rgba(26,48,140,.20)';
          const all = items.sort((a, b) => a.d - b.d).map(i => i.s).join('');
          return `<svg class="iso ${p.cls || ''}" viewBox="${vx.toFixed(0)} ${vy.toFixed(0)} ${vw.toFixed(0)} ${vh.toFixed(0)}" role="img" aria-label="${E(p.label || '等距城市示意')}" preserveAspectRatio="${p.par || 'xMidYMid meet'}"><defs><filter id="${id}b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${p.blur ?? 6}"/></filter></defs>${under.join('')}<g filter="url(#${id}b)" fill="${sh}">${shadow.join('')}</g>${all}${over.join('')}</svg>`;
        },
        bbox: () => [x0, y0, x1, y1]
      };
      return S;
    };
    return { scene, PAL, U, CX, SY };
  })();


  /* ================================================================
     TITLE · R447 — white clay city, floating blue data screens
     ================================================================ */
  const heroCity = () => {
    const s = ISO.scene(), C = ISO.PAL, BL = C.blue;
    s.plate(-.6, -.6, 17.2, 14.2, { th: .55, pal: C.cream, fill: '#f5f8fe' });
    // streets
    s.plate(0, 5.5, 16, 1.2, { th: 0, z: .01, fill: '#e2e8f5', dash: 'x', ln: 'rgba(25,45,120,.04)' });
    s.plate(7.5, 0, 1.2, 13, { th: 0, z: .012, fill: '#e2e8f5', dash: 'y', ln: 'rgba(25,45,120,.04)' });
    s.plate(1.2, 7.4, 5.8, 4.8, { th: .12, fill: '#eef3fb' });
    s.plate(9.4, 7.6, 5.4, 4.6, { th: .12, fill: '#ffffff' });
    s.plate(4.5, 8.8, 2, 1.6, { th: .05, z: .13, fill: '#cfe0ff', ln: 'rgba(31,59,255,.2)' });
    // north-west · works
    s.box(1, 1, 0, 3.8, 2.3, 1, { win: 1, alt: BL, roof: '#dfe7f8' }).box(1.5, 1.35, 1, 1.5, 1.1, .6, { alt: BL });
    s.cyl(5.5, 1.5, 0, .55, 2.3, { band: '#bdc9e6' }).cyl(5.5, 2.9, 0, .55, 1.8, { band: '#bdc9e6' });
    s.cyl(2.3, 3.9, 0, .28, 3.4, { band: '#c3cde6' });
    s.box(1.2, 3.5, 0, 2.3, 1.2, .7, { alt: BL }).box(4, 3.7, 0, 1.4, 1, .55, { alt: BL });
    // north-east · towers
    s.box(9.4, .9, 0, 1.5, 1.5, 3.9, { win: 1, alt: BL }).box(11.4, 1.3, 0, 1.3, 1.3, 2.6, { win: 1, alt: BL }).box(13.3, .8, 0, 1.7, 1.8, 5.1, { win: 1, alt: BL, litRate: .2 });
    s.box(9.5, 3.3, 0, 1.9, 1.3, 1.5, { win: 1, alt: BL }).box(12.1, 3.2, 0, 1.2, 1.2, 1.1, { alt: BL }).box(13.8, 3.3, 0, 1.2, 1.1, 2.1, { win: 1, alt: BL });
    // south-west · homes and a pond
    [[1.5, 7.9, 1.6, 1.4, 1.2], [3.6, 7.8, 1.5, 1.3, .9], [1.4, 10, 1.4, 1.4, 1.7], [3.2, 10.5, 1.2, 1.2, .8], [5.6, 7.8, 1.1, 1.2, 1.4]].forEach(([x, y, w, d, h]) => s.box(x, y, 0, w, d, h, { win: 1, alt: BL }));
    // south-east · the civic block, one cobalt building
    s.box(10, 8.1, 0, 2.7, 2.7, 2.2, { pal: BL, win: 1, litRate: .3, cls: 'bd pre' }).box(10.6, 8.7, 2.2, 1.5, 1.5, .9, { pal: BL });
    s.box(13.1, 9.9, 0, 1.4, 1.3, 1.2, { win: 1, alt: BL }).box(13, 7.9, 0, 1.2, 1.2, 1.6, { win: 1, alt: BL });
    s.cyl(11.5, 11.4, 0, .6, 1.4, { band: '#bdc9e6' });
    // trees
    [[4.6, 4.5], [5.7, 4.6], [6.4, 6.3], [8.1, 4.8], [8.2, 11.6], [6.2, 11.6], [1.2, 12.1], [2.6, 12.2], [4.4, 11.7], [9.3, 6.3], [14.3, 6.3], [15.2, 5.1], [14.9, 11.7], [9.6, 12.2], [14.2, 5.3]].forEach(([x, y], i) => s.tree(x, y, { r: .36 + (i % 3) * .06, h: .8 + (i % 2) * .25, col: i % 4 === 0 ? ['#bfe6ff', '#3dc3ff'] : undefined }));
    // floating data screens
    s.screen({ x: 8.1, y: 1.4, z: 4.6, w: 2.7, h: 1.9, plane: 'x', bars: [.4, .7, .5, .9, .6, .8, .45], hot: 3, delay: 0 });
    s.screen({ x: 6.3, y: 7.0, z: 3.6, w: 2.5, h: 1.7, plane: 'x', line: [.2, .45, .35, .7, .6, .9], delay: -2 });
    s.screen({ x: 14.4, y: 6.4, z: 3.9, w: 2.2, h: 1.6, plane: 'x', bars: [.9, .5, .7, .3, .6], hot: 0, delay: -4 });
    s.pin(11.35, 9.45, 3.45).pin(14.15, 1.7, 5.6).pin(3, 2.2, 1.8, { col: '#27c3ff' });
    return s.svg({ cls: 'pt-city', label: '白色黏土风格的等距城市，空中悬着几块蓝色数据屏', pad: 10, blur: 7 });
  };

  const titleHtml = k => {
    const { p, s, esc } = k;
    return `<section class="p-title" aria-labelledby="tc-name">
        <div class="pt-stage" data-hero="city">${heroCity()}</div>
        <div class="pt-copy">
          <a class="pt-back mono" href="index.html#scene-${p.id}" data-cut="INDEX">← INDEX</a>
          <p class="pt-k mono">SC-${p.number} · ${esc(p.label)} · ${esc(p.year)}</p>
          <h1 id="tc-name">Privacy<br>City</h1>
          <p class="pt-sub">${esc(s.sub)}</p>
          <p class="pt-hint mono" aria-hidden="true">点一栋楼，把它点成钴蓝</p>
        </div>
        <div class="pt-dialog" role="group" aria-label="演示用授权弹窗">
          <header><i aria-hidden="true"></i><b>城市通行证</b><span class="mono">REQUEST 01 / 05</span></header>
          <p class="pd-q">允许“城市通行证”读取你的联系邮箱？</p>
          <p class="pd-f">用于寄送活动奖励。<u>了解更多 ›</u></p>
          <div class="pd-b"><button type="button" data-pick="拒绝">拒绝</button><button type="button" class="ok" data-pick="接受">接受</button></div>
          <p class="pd-t" role="status" aria-live="polite"></p>
        </div>
        <ul class="pt-cards" aria-label="项目数字">${(s.stats || []).map(([v, l], i) => `<li style="--i:${i}"><b>${esc(v)}</b><span>${esc(l)}</span><i aria-hidden="true">${[3, 5, 2, 4, 6].map(h => `<em style="--h:${(h + i) % 6 + 1}"></em>`).join('')}</i></li>`).join('')}</ul>
        <dl class="pt-meta">${(s.meta || []).map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>
      </section>`;
  };

  /* ================================================================
     LABEL SHEET · R258
     ================================================================ */
  const loglineHtml = k => {
    const { s, md, esc, p } = k, L = s.logline || {};
    return `<section class="p-labels" aria-label="项目摘要">
        <div class="pl-sheet">
          <div class="pl l-code"><b>PC.${p.number}</b><span class="mono">PRIVACY CITY · OFFLINE EXPERIMENT</span>${bars(38)}</div>
          <div class="pl l-q"><header><b>問</b><span class="mono">PROBLEM · 01</span></header><p>${md(L.q)}</p>${bars(24, 5)}</div>
          <div class="pl l-qr">${qr(11)}<span class="mono">SCAN · 5,000<br>SYNTH. SAMPLES</span></div>
          <div class="pl l-a"><header><b>做</b><span class="mono">MY PART · 02</span></header><p>${md(L.a)}</p></div>
          <div class="pl l-warn"><i aria-hidden="true"></i><p><b>仅为演示</b>数据为合成样本 · 不连接真实权限</p></div>
          ${(s.stats || []).map(([v, l], i) => `<div class="pl l-s s${i}"><span class="mono">ID ${String(i + 1).padStart(3, '0')}</span><b>${esc(v)}</b><small>${esc(l)}</small></div>`).join('')}
          <div class="pl l-r"><header><b>果</b><span class="mono">RESULT · 03</span></header><p>${md(L.r)}</p>${bars(30, 9)}</div>
          <div class="pl l-sig"><span class="mono">BUILT BY</span><b>Wenjing Bian</b><small class="mono">${esc(s.stripB)}</small></div>
          <div class="pl l-p"><b>P</b><span class="mono">ROLE<br>${esc((s.meta || [])[2] ? s.meta[2][1] : p.role)}</span></div>
          <div class="pl l-tools"><span class="mono">TOOLS</span><p>${esc((s.meta || [])[3] ? s.meta[3][1] : '')}</p></div>
        </div>
      </section>`;
  };


  /* ================================================================
     Chart types registered on VZ.T (this file loads after _viz.js)
     ================================================================ */
  const tipA = (h, b) => ` data-tip="${E(h)}" data-tipb="${E(b || '')}" tabindex="0"`;
  const wrapCJK = (t, n) => { const out = []; let s = String(t); while (s.length > n) { out.push(s.slice(0, n)); s = s.slice(n); } out.push(s); return out; };

  /* the same click, two kinds of person: three settings side by side */
  T['pc-hesit'] = (s, W) => {
    const narrow = W < 640, cols = narrow ? 1 : 3, gap = 28, pw = (W - (cols - 1) * gap) / cols;
    const M = [['决策用时', r => r.sec, 20, v => v + ' s'], ['条款读掉的比例', r => r.read, 1, v => Math.round(v * 100) + '%'], ['风险厌恶', r => r.risk, 1, v => Math.round(v * 100) + '%']];
    // the same click on one clock: two settings, two waiting times
    const L = narrow ? 88 : 150, ax = t => L + t / 22 * (W - L - 10), tl0 = 34, tlh = 2 * 44 + 34;
    let g = s.rows.map((r, i) => `<rect class="${i ? 'a3' : 'a1'}" x="${i * 150}" y="2" width="12" height="12"/><text x="${i * 150 + 18}" y="13" font-size="12" font-weight="700">${E(r.cn)}</text>`).join('');
    [0, 5, 10, 15, 20].forEach(t => { g += `<line class="gr" x1="${ax(t)}" x2="${ax(t)}" y1="${tl0 - 4}" y2="${tl0 + 2 * 44}"/><text class="t-m" x="${ax(t)}" y="${tl0 + 2 * 44 + 16}" font-size="10" text-anchor="middle" opacity=".6">${t} s</text>`; });
    s.rows.forEach((r, i) => {
      const y = tl0 + i * 44 + 8, cx = ax(r.sec);
      g += `<g class="hit"${tipA(r.cn + ' · 按下之前', '平均 ' + r.sec + ' 秒，标准差 ' + r.sd + ' 秒')}><text x="0" y="${y + 16}" font-size="${narrow ? 12 : 14}" font-weight="800">${E(r.cn)}</text><rect class="a4" x="${L}" y="${y + 6}" width="${W - L - 10}" height="14"/><rect class="${i ? 'a3' : 'a1'} grow" x="${L}" y="${y + 6}" width="${Math.max(3, cx - L)}" height="14"/><line x1="${ax(Math.max(0, r.sec - r.sd))}" x2="${ax(r.sec + r.sd)}" y1="${y + 13}" y2="${y + 13}" stroke-width="2" stroke="#ff6a3d"/><circle cx="${cx}" cy="${y + 13}" r="7" fill="#ff6a3d" stroke="#fff" stroke-width="2"/><text x="${Math.min(cx + 12, W - 40)}" y="${y + 4}" font-size="11" font-weight="700" fill="#ff6a3d">接受</text></g>`;
    });
    const top = tl0 + tlh + 14, ph = 132;
    g += `<line class="ax" x1="0" x2="${W}" y1="${top - 8}" y2="${top - 8}"/>`;
    M.forEach(([name, f, max, fmt], m) => {
      const ox = narrow ? 0 : m * (pw + gap), oy = top + (narrow ? m * ph : 0);
      g += `<text class="t-m" x="${ox}" y="${oy + 12}" font-size="11" opacity=".65">${E(name)}</text><line class="ax" x1="${ox}" x2="${ox + pw}" y1="${oy + 20}" y2="${oy + 20}"/>`;
      s.rows.forEach((r, i) => {
        const y = oy + 30 + i * 46, v = f(r), w = Math.max(3, v / max * (pw - 4));
        g += `<g class="hit"${tipA(r.cn + ' · ' + name, fmt(v) + (m === 0 ? '，标准差 ' + r.sd + ' s' : ''))}><rect class="a4" x="${ox}" y="${y + 18}" width="${pw}" height="10"/><rect class="${i ? 'a3' : 'a1'} grow" x="${ox}" y="${y + 18}" width="${w}" height="10" style="transition-delay:${(m * 2 + i) * .06}s"/><text class="t-h" x="${ox}" y="${y + 13}" font-size="24" font-weight="900">${fmt(v)}</text><text class="t-m" x="${ox + pw}" y="${y + 13}" font-size="10" text-anchor="end" opacity=".6">${E(r.k)}</text></g>`;
      });
    });
    return { H: top + (narrow ? 3 * ph : ph) + 6, g };
  };

  /* twelve personas × six settings */
  T['pc-heat'] = (s, W) => {
    const left = Math.min(158, W * .3), cw = (W - left - 4) / 6, rh = W < 520 ? 34 : 40, lines = Math.max(2, Math.floor(cw / 12.5)), top = 46;
    let g = s.cols.map((t, j) => wrapCJK(t, lines).map((ln, i) => `<text x="${left + (j + .5) * cw}" y="${12 + i * 13}" text-anchor="middle" font-size="11" font-weight="700">${E(ln)}</text>`).join('')).join('');
    s.rows.forEach((d, i) => {
      const y = top + i * rh;
      g += `<text x="2" y="${y + rh / 2 + 4}" font-size="${W < 520 ? 12 : 13}" font-weight="700">${E(d.cn)}</text>`;
      d.v.forEach((v, j) => { const txt = j === 5 ? d.s + 's' : (+v).toFixed(2).replace(/^0/, ''); g += `<g class="hit"${tipA(d.cn + ' · ' + s.cols[j], j === 5 ? '平均 ' + d.s + ' 秒' : String(+(+v).toFixed(2)))}><rect class="a1" x="${left + j * cw}" y="${y}" width="${cw - 3}" height="${rh - 4}" opacity="${.07 + .93 * v}"/><text x="${left + (j + .5) * cw - 1.5}" y="${y + rh / 2 + 3}" text-anchor="middle" font-size="${W < 520 ? 10 : 12}" class="t-m" fill="${v > .5 ? '#fff' : 'currentColor'}">${txt}</text></g>`; });
    });
    return { H: top + s.rows.length * rh + 4, g };
  };

  T['pc-params'] = (s, W) => {
    const left = 62, top = 34, pw = W - left - 34, ph = 240, x = n => left + n / 50000 * pw, y = v => top + (0.993 - v) / 0.005 * ph;
    let g = [0, 10000, 20000, 30000, 40000, 50000].map(v => `<line class="gr" x1="${x(v)}" x2="${x(v)}" y1="${top}" y2="${top + ph}"/><text class="t-m" x="${x(v)}" y="${top + ph + 22}" text-anchor="middle" font-size="11">${v / 1000}k</text>`).join('');
    g += [.988, .989, .990, .991, .992, .993].map(v => `<line class="gr" x1="${left}" x2="${W - 34}" y1="${y(v)}" y2="${y(v)}"/><text class="t-m" x="${left - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11">${v.toFixed(3)}</text>`).join('');
    g += s.pts.map((d, i) => `<g class="hit"${tipA(d.k, d.n.toLocaleString() + ' 个参数 · AUC ' + d.v)}><circle class="${d.base ? 'a1' : 'a3'} pop" cx="${x(d.n)}" cy="${y(d.v)}" r="${d.base ? 8 : 5.5}"/><text x="${Math.min(x(d.n) + 10, W - 120)}" y="${y(d.v) + (i % 2 ? 22 : -12)}" font-size="12" font-weight="${d.base ? 800 : 600}">${E(d.k)}</text></g>`).join('');
    g += `<text class="t-m" x="${left}" y="${top + ph + 50}" font-size="10" opacity=".6">参数量（线性轴） · AUC 纵轴局部放大 0.988—0.993</text>`;
    return { H: 350, g };
  };

  /* permutation importance, bars coloured by feature group; clicking a row selects that feature in the city */
  T['pc-imp'] = (s, W) => {
    const narrow = W < 560, rh = narrow ? 40 : 32, left = narrow ? 0 : Math.min(250, W * .38), top = 40, max = s.max || .06, bw = W - left - 62;
    let g = GROUPS.filter(q => s.items.some(i => i.g === q[0])).map((q, i) => `<rect x="${i * 128}" y="2" width="11" height="11" fill="${GCOL_L[q[0]]}"/><text x="${i * 128 + 17}" y="12" font-size="11" font-weight="700">${q[0]} ${q[1]}</text>`).join('');
    s.items.forEach((d, i) => {
      const y = top + i * rh, w = Math.max(3, d.v / max * (narrow ? W - 50 : bw)), by = narrow ? y + 20 : y + 6;
      g += `<g class="hit" data-f="${d.f}"${tipA(d.label, d.g + ' 组 · 置换重要性约 ' + d.t + '。点击，在城市里选中这栋楼')}>${narrow ? '' : `<text class="t-m" x="0" y="${y + 17}" font-size="10" opacity=".5">${pad2(i + 1)}</text>`}<text x="${narrow ? 0 : 24}" y="${y + (narrow ? 14 : 18)}" font-size="${narrow ? 13 : 14}" font-weight="600">${E(d.label)}</text><rect fill="${GCOL_L[d.g]}" opacity=".16" x="${narrow ? 0 : left}" y="${by}" width="${narrow ? W - 50 : bw}" height="${narrow ? 10 : 14}"/><rect class="grow" fill="${GCOL_L[d.g]}" x="${narrow ? 0 : left}" y="${by}" width="${w}" height="${narrow ? 10 : 14}" style="transition-delay:${i * .03}s"/><text class="t-m" x="${narrow ? W : W}" y="${by + (narrow ? 10 : 12)}" font-size="12" text-anchor="end" font-weight="600">${d.t}</text></g>`;
    });
    return { H: top + s.items.length * rh + 6, g };
  };

  /* two values per row, drawn as two bars under the row label; reads at any width */
  T['pc-pair'] = (s, W) => {
    const rh = 70, top = 28, fmt = v => String(+(+v).toFixed(4));
    let g = s.keys.map((k, i) => `<rect class="${i ? 'a3' : 'a1'}" x="${i * Math.min(W / 2, 190)}" y="2" width="12" height="12"/><text x="${i * Math.min(W / 2, 190) + 18}" y="13" font-size="12" font-weight="700">${E(k)}</text>`).join('');
    s.rows.forEach((r, i) => {
      const y = top + i * rh;
      g += `<text x="0" y="${y + 14}" font-size="14" font-weight="800">${E(r.label)}</text>`;
      r.v.forEach((v, j) => { const by = y + 22 + j * 20, w = Math.max(3, v * (W - 64)); g += `<g class="hit"${tipA(r.label + ' · ' + s.keys[j], fmt(v))}><rect class="a4" x="0" y="${by}" width="${W - 64}" height="12"/><rect class="${j ? 'a3' : 'a1'} grow" x="0" y="${by}" width="${w}" height="12" style="transition-delay:${(i * 2 + j) * .05}s"/><text class="t-m" x="${W}" y="${by + 11}" font-size="12" text-anchor="end" font-weight="600">${fmt(v)}</text></g>`; });
    });
    return { H: top + s.rows.length * rh + 4, g };
  };


  const INIT = {};   // data-pc name -> (el, ctx) ; run from after()
  const hudFrame = (inner, cls = '') => `<div class="hud ${cls}"><i class="hl t"></i><i class="hl b"></i><i class="hl l"></i><i class="hl r"></i>
      <svg class="hd tl" viewBox="0 0 90 40" aria-hidden="true"><path d="M1 40V22L22 1H90"/><path d="M34 1V9H62V1"/><circle cx="78" cy="9" r="2.6"/></svg>
      <svg class="hd tr" viewBox="0 0 90 40" aria-hidden="true"><path d="M1 1H70L89 20V40"/><path d="M20 1V6H44V1"/></svg>
      <svg class="hd bl" viewBox="0 0 90 40" aria-hidden="true"><path d="M1 0V40H90"/><path d="M20 40V34H44V40"/><circle cx="60" cy="31" r="2.6"/></svg>
      <svg class="hd br" viewBox="0 0 90 40" aria-hidden="true"><path d="M1 39H68L89 18V0"/><path d="M28 39V32H56V39"/></svg>
      <div class="hud-in">${inner}</div></div>`;

  const TERMS = [
    '条款摘要：数据将用于提供本功能，并可能与合作方共享，用来改进服务。你可以在设置里撤回授权，撤回前已共享的数据不受影响。',
    '继续阅读：部分数据会用于统计分析和个性化内容。我们会采取合理措施保护你的信息，但不保证任何传输都绝对安全。',
    '数据保存期限以实际业务需要为准。账号注销后，已经脱敏的数据仍可能保留，用于研究和产品改进。',
    '第三方服务可能收集和使用相关信息，适用它们各自的隐私政策。继续使用即表示你已阅读并同意这些安排。',
    '我们可能根据法律要求、司法程序或政府部门的请求披露你的信息，并且不一定另行通知。',
    '本政策可能随时更新。更新后的版本发布在本页，继续使用即视为接受更新。'
  ];
  const FIELDS = [   // feature index (1-based), name, how this one decision folds into the field
    [1, '平均决策时长', (r, t) => t / 60, '用时 ÷ 60 s'],
    [3, '点击频率', (r, t) => Math.min(1, (r.c / Math.max(t, 1) * 60) / 40), '次/分钟 ÷ 40'],
    [6, '回滚次数', r => Math.min(1, r.r / 10), '回滚次数 ÷ 10'],
    [11, '滚到底部比例', r => r.p / 100, '读到的比例'],
    [20, '“了解更多”点击', r => Math.min(1, r.l / 12), '点击次数 ÷ 12'],
    [21, '拒绝按钮点击', r => Math.min(1, r.x / 12), '点击次数 ÷ 12']
  ];

  const demoHtml = scen => `<div class="pcd" data-pc="demo">
      <div class="pcd-tabs" role="tablist" aria-label="五道授权请求">${scen.map((c, i) => `<button type="button" role="tab" aria-selected="${i ? 'false' : 'true'}" data-i="${i}"><b>${pad2(i + 1)}</b><span>${E(c.cn)}</span><small class="mono">${E(c.perm)}</small></button>`).join('')}</div>
      <div class="pcd-body">
        <div class="pcd-phone">
          <header class="mono"><span>PRIVACY CITY</span><span class="pcd-clock">0.0 s</span></header>
          <div class="pcd-card"><span class="pcd-no mono"></span><p class="pcd-q"></p></div>
          <div class="pcd-terms" tabindex="0" aria-label="条款，可滚动"></div>
          <p class="pcd-more"><button type="button" class="pcd-learn">了解更多 ›</button><span class="mono pcd-words"></span></p>
          <div class="pcd-btns"><button type="button" data-a="0">拒绝</button><button type="button" data-a="1" class="ok">接受</button></div>
          <p class="pcd-fb" aria-live="polite"></p>
        </div>
        <div class="pcd-log">
          <p class="mono pcd-lt"><span>BEHAVIOUR LOG</span><span>行为记录</span></p>
          <svg class="pcd-trace" viewBox="0 0 440 150" role="img" aria-label="这一道请求里，读到的位置随时间的变化"></svg>
          <dl class="pcd-r">${[['t', '决策用时'], ['s', '条款滚动'], ['r', '回滚'], ['c', '点击'], ['p', '读到'], ['d', '选择']].map(([k, l]) => `<div><dt>${l}</dt><dd data-k="${k}">—</dd></div>`).join('')}</dl>
          <p class="mono pcd-ft">这些动作落进 48 个字段里的哪几格</p>
          <ul class="pcd-f">${FIELDS.map(([n, name, , how]) => `<li data-n="${n}"><span class="mono">f_${pad2(n)}</span><b>${name}</b><i><u></u></i><em>0.00</em><small>${how}</small></li>`).join('')}</ul>
        </div>
      </div>
      <p class="pcd-note">页面不申请真实权限，数值只在你的浏览器里计算，不上传、不存储。右侧是把这一次操作按字段定义折算的示意，游戏里的特征由模拟器按画像生成。</p>
    </div>`;

  INIT.demo = (el, ctx) => {
    const scen = ctx.scen, $e = s => $(s, el);
    let cur = 0, rec, st, timer, trace;
    const terms = $e('.pcd-terms'), svg = $e('.pcd-trace');
    const draw = () => {
      const now = rec.done ? rec.t : (performance.now() - st) / 1000, T = Math.max(10, Math.ceil(now + 2)), W = 440, H = 150, l = 40, b = 24, x = t => l + t / T * (W - l - 8), y = p => H - b - p / 100 * (H - b - 14);
      let g = [0, 50, 100].map(p => `<line x1="${l}" x2="${W - 8}" y1="${y(p)}" y2="${y(p)}" stroke="currentColor" stroke-opacity=".12"/><text x="${l - 6}" y="${y(p) + 3}" font-size="7" text-anchor="end" class="mono" opacity=".55">${p}%</text>`).join('');
      for (let t = 0; t <= T; t += T > 20 ? 10 : 5) g += `<text x="${x(t)}" y="${H - 8}" font-size="7" text-anchor="middle" class="mono" opacity=".55">${t}s</text>`;
      const pts = [[0, 0], ...trace, [now, trace.length ? trace[trace.length - 1][1] : 0]];
      g += `<polyline points="${pts.map(([t, p]) => x(t).toFixed(1) + ',' + y(p).toFixed(1)).join(' ')}" fill="none" stroke="var(--pc)" stroke-width="2.2" stroke-linejoin="round"/>`;
      rec.cl.forEach(t => g += `<circle cx="${x(t).toFixed(1)}" cy="${(H - b + 1).toFixed(1)}" r="3.2" fill="var(--pk)"/>`);
      if (rec.done) g += `<line x1="${x(rec.t)}" x2="${x(rec.t)}" y1="8" y2="${H - b}" stroke="#ff6a3d" stroke-width="1.6" stroke-dasharray="4 3"/><text x="${Math.min(x(rec.t) + 5, W - 70)}" y="18" font-size="8" fill="#ff6a3d" class="mono">${rec.d ? '接受' : '拒绝'} · ${rec.t.toFixed(1)}s</text>`;
      svg.innerHTML = g;
    };
    const fields = () => { const t = rec.done ? rec.t : (performance.now() - st) / 1000; $$('.pcd-f li', el).forEach((li, i) => { const v = Math.max(0, Math.min(1, FIELDS[i][2](rec, t))); $e(`.pcd-f li:nth-child(${i + 1}) u`).style.width = (v * 100).toFixed(1) + '%'; $e(`.pcd-f li:nth-child(${i + 1}) em`).textContent = v.toFixed(2).replace(/^0\./, '.'); li.classList.toggle('on', v > 0); }); };
    const set = (k, v) => { $e(`dd[data-k="${k}"]`).textContent = v; };
    const reset = i => {
      cur = i; const c = scen[i], n = Math.max(1, Math.round(c.words / 110));
      rec = { s: 0, r: 0, c: 0, p: 0, l: 0, x: 0, last: 0, done: false, cl: [], t: 0, d: 0 }; trace = []; st = performance.now();
      terms.innerHTML = Array.from({ length: n + 1 }, (_, k) => `<p>${E(TERMS[(k + i) % TERMS.length])}</p>`).join(''); terms.scrollTop = 0;
      $e('.pcd-q').textContent = c.q; $e('.pcd-no').textContent = `REQUEST ${pad2(i + 1)} / 05 · ${c.perm}`; $e('.pcd-words').textContent = `条款 ${c.words} 词`;
      $e('.pcd-fb').innerHTML = ''; $e('.pcd-btns').classList.remove('done');
      ['s', 'r', 'c'].forEach(k => set(k, '0')); set('t', '—'); set('p', '0%'); set('d', '—');
      $$('.pcd-tabs button', el).forEach((b, k) => b.setAttribute('aria-selected', k === i ? 'true' : 'false'));
      el.dataset.cur = i; fields(); draw();
    };
    el._open = i => reset(i);
    terms.addEventListener('scroll', () => {
      if (rec.done) return; const y = terms.scrollTop; if (y < rec.last - 1) rec.r++; rec.s++; rec.last = y;
      rec.p = Math.max(rec.p, Math.min(100, Math.round((y + terms.clientHeight) / terms.scrollHeight * 100)));
      trace.push([(performance.now() - st) / 1000, Math.min(100, Math.round((y + terms.clientHeight) / terms.scrollHeight * 100))]); if (trace.length > 400) trace.shift();
      set('s', rec.s); set('r', rec.r); set('p', rec.p + '%'); fields(); draw();
    }, { passive: true });
    $e('.pcd-phone').addEventListener('click', e => { if (rec.done || e.target.closest('.pcd-btns')) return; rec.c++; rec.cl.push((performance.now() - st) / 1000); set('c', rec.c); fields(); draw(); });
    $e('.pcd-learn').addEventListener('click', () => { if (rec.done) return; rec.l++; const p = document.createElement('p'); p.className = 'ex'; p.textContent = '更多：本项目演示用文案。真实产品里，这一段通常写着数据会被谁使用、保存多久。'; if (!terms.querySelector('.ex')) terms.append(p); fields(); });
    $$('.pcd-btns button', el).forEach(b => b.addEventListener('click', () => {
      if (rec.done) return; rec.done = true; rec.d = +b.dataset.a; rec.t = (performance.now() - st) / 1000; if (!rec.d) rec.x++;
      set('t', rec.t.toFixed(1) + ' s'); set('d', rec.d ? '接受' : '拒绝'); fields(); draw();
      const c = scen[cur]; $e('.pcd-btns').classList.add('done');
      $e('.pcd-fb').innerHTML = `${rec.d ? '已接受' : '已拒绝'}，用时 ${rec.t.toFixed(1)} s，读到 ${rec.p}%。这一道的设定：奖励 ${c.reward} · 敏感度 ${c.sens} · 胁迫 ${c.coerce} · 条款 ${c.words} 词。<button type="button" class="pcd-again">重来一次</button>${cur < 4 ? `<button type="button" class="pcd-next">下一道 →</button>` : ''}`;
      $e('.pcd-again').addEventListener('click', () => reset(cur)); const nx = $e('.pcd-next'); nx && nx.addEventListener('click', () => reset(cur + 1));
    }));
    $$('.pcd-tabs button', el).forEach((b, i) => b.addEventListener('click', () => reset(i)));
    timer = setInterval(() => { if (!rec.done && el.isConnected) { $e('.pcd-clock').textContent = ((performance.now() - st) / 1000).toFixed(1) + ' s'; if (((performance.now() - st) / 1000) % 1 < .12) { fields(); draw(); } } }, 100);
    reset(0);
  };

  /* one request, as a label sticker (R258) */
  const reqLabel = (c, i) => {
    const row = (l, v, txt) => `<li><span>${l}</span><i><u style="width:${Math.round(v * 100)}%"></u></i><b>${txt}</b></li>`;
    return `<li class="rq${c.key ? ' key' : ''}" data-i="${i}"><button type="button" class="rq-b" aria-label="在上面的手机里打开第 ${i + 1} 道请求：${E(c.cn)}">
        <header><b>${pad2(c.no)}<small>/05</small></b><span class="mono">${E(c.perm)}</span></header>
        <h4>${E(c.cn)}<small>${E(c.name)}</small></h4><p>${E(c.q)}</p>
        <ul>${row('奖励', c.reward, c.reward.toFixed(2))}${row('胁迫', c.coerce, c.coerce.toFixed(2))}${row('时间压力', c.time, c.time.toFixed(2))}${row('数据敏感', c.sens, c.sens.toFixed(2))}${row('可读性', c.read, c.read.toFixed(2))}</ul>
        <footer><span class="mono">社交证明 ${c.social ? '有' : '无'}</span><span class="mono">${c.words} 词</span>${bars(14, c.no * 7)}</footer>
        ${c.key ? '<em class="rq-key mono">KEY REQUEST</em>' : ''}</button></li>`;
  };

  PG['privacy-city'] = PG['privacy-city'] || {};
  const P = PG['privacy-city'];
  P.a_experience = (a, k, u0) => {
    const { esc, md } = k, u = use(a, u0, k), reqs = u.o('reqs').scen || [], rt = u.o('reqText').text || [];
    u.o('demo'); u.o('demoNote'); u.o('reqH'); u.o('reqNote');
    return `<header class="p-hud">
        ${hudFrame(`<p class="mono hd-k">${esc(a.kicker)}</p><h2 data-noeva>${md(a.title)}</h2><p class="hd-lead">${md(a.lead)}</p>
          <ul class="hd-chips" aria-label="五道请求">${reqs.map((c, i) => `<li><button type="button" data-open="${i}"><b class="mono">${pad2(i + 1)}</b>${esc(c.cn)}</button></li>`).join('')}</ul>`)}
        <p class="hd-num" aria-hidden="true">05<small class="mono">REQUESTS</small></p>
        <p class="hd-side mono" aria-hidden="true">SCENE · 01<br>AUTHORISATION<br>HESITATION<br>RECORD</p>
      </header>
      <section class="p-device" aria-label="互动演示">
        <div class="pv-bar" aria-hidden="true"><i></i><i></i><i></i><span>privacy-city.local / demo</span></div>
        ${demoHtml(reqs)}
        <p class="note">${md(u.o('demoNote').note || '')}</p>
      </section>
      <section class="p-reqs" aria-label="${esc(u.o('reqH').sub)}">
        <header class="pq-h"><span class="mono">${esc(u.o('reqH').en)}</span><h3 data-noeva>${esc(u.o('reqH').sub)}</h3></header>
        <ol class="pq-labels">${reqs.map(reqLabel).join('')}</ol>
        <div class="pq-t">${rt.map(t => `<p>${md(t)}</p>`).join('')}<p class="note">${md(u.o('reqNote').note || '')}</p></div>
      </section>`;
  };
  P._ctx = {};


  /* ================================================================
     ACT · WHY — R239 hierarchical grid, X placeholder boxes
     ================================================================ */
  const win = (no, body, cls = '') => `<div class="p-win ${cls}"><header><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><b>REQUEST ${no} / 05</b><span class="x" aria-hidden="true">×</span></header>${body}</div>`;
  const catmull = pts => { let d = `M${pts[0][0]} ${pts[0][1]}`; for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2; d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0]} ${p2[1]}`; } return d; };

  /* five actions drawn as one reading curve ending in a single boolean cell */
  const traceViz = (list, bool) => {
    const pts = [[40, 232], [120, 196], [190, 168], [250, 166], [300, 118], [350, 120], [400, 176], [460, 150], [520, 98], [570, 100], [620, 108], [680, 94], [730, 104], [790, 92], [880, 90]];
    const node = [[190, 168], [300, 118], [520, 98], [680, 94], [880, 90]];
    return `<div class="ptr" data-pc="inview">
      <svg class="ptr-svg" viewBox="0 0 1000 270" role="img" aria-label="一次授权的行为：${E(list.join('，'))}，最后只存下一个布尔值">
        <g class="grid">${[0, 1, 2, 3].map(i => `<line x1="40" x2="960" y1="${54 + i * 60}" y2="${54 + i * 60}"/>`).join('')}${[0, 1, 2, 3, 4, 5].map(i => `<line y1="40" y2="250" x1="${40 + i * 184}" x2="${40 + i * 184}"/>`).join('')}</g>
        <text class="ax" x="42" y="266">0 s</text><text class="ax" x="880" y="266" text-anchor="end">按下之前</text><text class="ax" x="34" y="58" text-anchor="end">读到</text>
        <path class="curve" pathLength="1" d="${catmull(pts)}"/>
        <path class="shade" d="${catmull(pts)}L880 250L40 250Z"/>
        ${node.map(([x, y], i) => `<g class="nd" style="--i:${i}"><line x1="${x}" x2="${x}" y1="${y + 14}" y2="250"/><circle cx="${x}" cy="${y}" r="17"/><text x="${x}" y="${y + 6}" text-anchor="middle">${i + 1}</text></g>`).join('')}
        <g class="bl"><rect x="902" y="52" width="76" height="76"/><text class="v1" x="940" y="108" text-anchor="middle">1</text><text class="v0" x="940" y="108" text-anchor="middle">0</text><text class="ax" x="940" y="146" text-anchor="middle">${E(bool)}</text></g>
      </svg>
      <ol class="ptr-list">${list.map((t, i) => `<li style="--i:${i}"><b class="mono">${i + 1}</b><span>${E(t)}</span></li>`).join('')}</ol>
    </div>`;
  };

  /* the dialog, cut into four regions you can click */
  const anatHtml = d => {
    const R = d.regions, kinds = { ask: 'q', terms: 't', push: 'p', btn: 'b' };
    const demo = {
      ask: `<p class="an-ask">允许“城市通行证”访问你的通讯录，换取传说级道具？</p>`,
      terms: `<div class="an-terms"><i></i><i class="s"></i><i></i><i class="s"></i><i></i></div>`,
      push: `<div class="an-push"><span>奖励 ★★★</span><span>92% 的玩家已同意</span><span class="tm">00:09</span></div>`,
      btn: `<div class="an-btn"><span>拒绝</span><span class="ok">接受</span></div>`
    };
    return `<div class="pan" data-pc="anat">
      <div class="pan-dialog" role="group" aria-label="授权弹窗，四个区域">${R.map((r, i) => `<button type="button" class="an-r an-${kinds[r.id] || 'x'}" data-i="${i}" aria-pressed="${i ? 'false' : 'true'}"><span class="mono">${pad2(i + 1)}</span>${demo[r.id] || ''}</button>`).join('')}</div>
      <div class="pan-side" aria-live="polite">${R.map((r, i) => `<article class="pan-card" data-i="${i}"${i ? ' hidden' : ''}><p class="mono">REGION ${pad2(i + 1)} · ${E(r.id.toUpperCase())}</p><h4>${E(r.name)}</h4><ul class="pan-sig">${r.sig.map(s => `<li>${E(s)}</li>`).join('')}</ul><p class="pan-rec"><b class="mono">记下来</b>${E(r.rec)}</p></article>`).join('')}</div>
    </div>`;
  };

  INIT.anat = el => {
    const bs = $$('.an-r', el), cs = $$('.pan-card', el);
    const pick = i => { bs.forEach((b, k) => b.setAttribute('aria-pressed', k === i ? 'true' : 'false')); cs.forEach((c, k) => { c.hidden = k !== i; }); };
    bs.forEach((b, i) => { b.addEventListener('click', () => pick(i)); b.addEventListener('mouseenter', () => pick(i)); });
  };

  P.a_question = (a, k, u0) => {
    const { esc, md } = k, u = use(a, u0, k), tr = u.o('trace'), an = u.o('anat'), li = u.o('lines').list || [], tx = u.o('trText').text || [];
    ['trH', 'anatH', 'heH', 'lnH', 'hesit'].forEach(n => u.o(n));
    return `<header class="p-grid">
        <div class="pg-frame">
          <span class="pg-x a" aria-hidden="true"><i></i></span><span class="pg-x b" aria-hidden="true"><i></i></span>
          <div class="pg-t"><p class="mono">${esc(a.kicker)}</p><h2 data-noeva>${md(a.title)}</h2><p class="pg-lead">${md(a.lead)}</p></div>
          <div class="p-stack" aria-hidden="true" data-pc="inview">
            ${win('05', '<i class="sk"></i><i class="sk s"></i><i class="sk"></i>', 'w5')}${win('04', '<i class="sk"></i><i class="sk s"></i><i class="sk"></i>', 'w4')}${win('03', '<i class="sk"></i><i class="sk s"></i><i class="sk"></i>', 'w3')}${win('02', '<i class="sk"></i><i class="sk s"></i><i class="sk"></i>', 'w2')}
            ${win('01', `<p class="ps-q">允许读取你的通讯录？</p><div class="ps-b"><span>拒绝</span><span class="ok">接受</span></div><svg class="ps-cur" viewBox="0 0 24 24"><path d="M3 2l7 19 2.6-7.6L20 11z"/></svg><span class="ps-t mono">犹豫中 <b>0.0</b> s</span>`, 'w1')}
          </div>
          <p class="pg-cap mono" aria-hidden="true">1 / 0 ← DIALOG</p>
        </div>
      </header>
      <section class="p-qs p-qtrace" aria-label="${esc(u.o('trH').sub)}">
        <header class="qs-h"><span class="mono">${esc(u.o('trH').en)}</span><h3 data-noeva>${esc(u.o('trH').sub)}</h3></header>
        ${traceViz(tr.trace, tr.bool)}
        <div class="qs-cols">${tx.map(t => `<p>${md(t)}</p>`).join('')}</div>
      </section>
      <section class="p-qs p-qanat" aria-label="${esc(u.o('anatH').sub)}">
        <header class="qs-h"><span class="mono">${esc(u.o('anatH').en)}</span><h3 data-noeva>${esc(u.o('anatH').sub)}</h3></header>
        ${anatHtml(an.anat)}
      </section>
      <section class="p-qs p-qhes" aria-label="${esc(u.o('heH').sub)}">
        <header class="qs-h"><span class="mono">${esc(u.o('heH').en)}</span><h3 data-noeva>${esc(u.o('heH').sub)}</h3></header>
        <div class="qh-card">${u.chart('hesit')}</div>
      </section>
      <section class="p-qs p-qlines" aria-label="${esc(u.o('lnH').sub)}">
        <header class="qs-h"><span class="mono">${esc(u.o('lnH').en)}</span><h3 data-noeva>${esc(u.o('lnH').sub)}</h3></header>
        <ol class="ql-labels">${li.map(([h, t], j) => `<li><header><span class="mono">LINE ${pad2(j + 1)}</span><i aria-hidden="true"></i></header><h4>${esc(h)}</h4><p>${esc(t)}</p>${bars(20, 11 + j * 5)}</li>`).join('')}</ol>
      </section>`;
  };


  /* ================================================================
     ACT · BACKGROUND — R258 label sheets, R447 persona city
     ================================================================ */
  const mixHex = (a, b, t) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const x = p(a), y = p(b); return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
  const shadeBy = t => ({ top: mixHex('#f7f9ff', '#6d84ff', t), l: mixHex('#e1e8f8', '#2f49f2', t), r: mixHex('#cbd5ec', '#1a2fc2', t), ln: 'rgba(25,45,120,.14)', win: mixHex('#c3cde6', '#9fb2ff', t), lit: '#ffffff' });
  const METRICS = [['share', '人口占比', p => p.share, v => Math.round(v * 100) + '%'], ['read', '阅读深度', p => p.read, v => v.toFixed(2)], ['risk', '风险厌恶', p => p.risk, v => v.toFixed(2)], ['social', '从众敏感', p => p.social, v => v.toFixed(2)], ['fatigue', '抗疲劳', p => p.fatigue, v => v.toFixed(2)], ['sec', '决策用时', p => p.sec, v => v + ' s']];
  const HX = ['H 诚实谦逊', 'E 情绪性', 'X 外向', 'A 宜人', 'C 尽责', 'O 开放'];

  const personaScene = (list, metric, sel) => {
    const s = ISO.scene(), M = METRICS.find(m => m[0] === metric) || METRICS[0], max = Math.max(...list.map(M[2]));
    s.plate(-.5, -.5, 4 * 3.1 + .9, 3 * 3.1 + .9, { th: .4, pal: ISO.PAL.cream, fill: '#f6f8fe' });
    list.forEach((p, i) => {
      const cx = i % 4, cy = Math.floor(i / 4), x = cx * 3.1 + .2, y = cy * 3.1 + .2;
      s.plate(x - .05, y - .05, 2.7, 2.7, { th: .08, fill: '#ffffff', ln: 'rgba(25,45,120,.08)' });
      const h = .7 + M[2](p) / max * 3.9, t = p.base, on = sel === p.k;
      s.box(x + .5, y + .4, .08, 1.5, 1.5, h, { pal: shadeBy(t), win: h > 1.4, litRate: .18, cls: 'bd' + (on ? ' sel' : ''), attr: ` data-k="${p.k}" tabindex="0" role="button" aria-label="${E(p.cn)}"` });
      s.text(x + 1.5, y + 2.45, .1, p.k, { size: 10, fill: on ? '#1f3bff' : '#6b7799', weight: on ? 800 : 600 });
    });
    return s.svg({ cls: 'ppc-svg', label: '十二类画像，十二栋楼', pad: 14, blur: 5 });
  };

  const hexRadar = hx => {
    const R = 54, C = 70, pt = (i, r) => [C + Math.sin(i / 6 * Math.PI * 2) * r, C - Math.cos(i / 6 * Math.PI * 2) * r];
    const ring = k => hx.map((_, i) => pt(i, R * k).map(v => v.toFixed(1)).join(',')).join(' ');
    return `<svg class="ppc-rad" viewBox="0 0 140 140" role="img" aria-label="HEXACO 六个维度：${hx.map((v, i) => HX[i] + ' ' + v).join('，')}"><polygon points="${ring(1)}" fill="none" stroke="currentColor" stroke-opacity=".25"/><polygon points="${ring(.5)}" fill="none" stroke="currentColor" stroke-opacity=".15"/>${hx.map((_, i) => `<line x1="${C}" y1="${C}" x2="${pt(i, R)[0].toFixed(1)}" y2="${pt(i, R)[1].toFixed(1)}" stroke="currentColor" stroke-opacity=".15"/><text x="${pt(i, R + 11)[0].toFixed(1)}" y="${(pt(i, R + 11)[1] + 3).toFixed(1)}" font-size="9" text-anchor="middle" class="mono">${HX[i][0]}</text>`).join('')}<polygon points="${hx.map((v, i) => pt(i, R * (v + 1) / 2).map(q => q.toFixed(1)).join(',')).join(' ')}" fill="var(--pc)" fill-opacity=".22" stroke="var(--pc)" stroke-width="2"/></svg>`;
  };

  const personaHtml = list => `<div class="ppc" data-pc="persona">
      <div class="ppc-top"><span class="mono">楼高 =</span><div class="ppc-metric" role="group" aria-label="楼高代表的设定">${METRICS.map(([k, l], i) => `<button type="button" data-m="${k}" aria-pressed="${i ? 'false' : 'true'}">${l}</button>`).join('')}</div><span class="ppc-leg mono" aria-hidden="true">颜色 = 基础妥协率<i></i><small>0.08</small><small>0.90</small></span></div>
      <div class="ppc-body"><div class="ppc-map"><div class="ppc-tip" role="status"></div></div><aside class="ppc-card" aria-live="polite"></aside></div>
    </div>`;

  INIT.persona = (el, ctx) => {
    const list = ctx.personas.slice().sort((a, b) => a.base - b.base), map = $('.ppc-map', el), card = $('.ppc-card', el), tip = $('.ppc-tip', el);
    let metric = 'share', sel = 'PRAG';
    const bar = (l, v, t) => `<li><span>${l}</span><i><u style="width:${Math.round(v * 100)}%"></u></i><b>${t}</b></li>`;
    const draw = () => {
      const old = $('svg', map); if (old) old.remove(); map.insertAdjacentHTML('afterbegin', personaScene(list, metric, sel));
      const p = list.find(q => q.k === sel);
      card.innerHTML = `<p class="mono">${p.k} · ${(p.share * 100).toFixed(0)}% OF PLAYERS</p><h4>${E(p.cn)}<small>${E(p.en)}</small></h4><p class="pn">${E(p.note)}</p>
        <ul class="ppc-b">${bar('基础妥协率', p.base, p.base.toFixed(2))}${bar('阅读深度', p.read, p.read.toFixed(2))}${bar('风险厌恶', p.risk, p.risk.toFixed(2))}${bar('从众敏感', p.social, p.social.toFixed(2))}${bar('抗疲劳', p.fatigue, p.fatigue.toFixed(2))}</ul>
        <div class="ppc-hx">${hexRadar(p.hx)}<p class="mono">平均决策 <b>${p.sec}</b> s<br>HEXACO 六维<br>外圈 +1 · 内圈 0</p></div>`;
    };
    el.addEventListener('click', e => { const b = e.target.closest('.bd[data-k]'); if (b) { sel = b.dataset.k; draw(); } const m = e.target.closest('[data-m]'); if (m) { metric = m.dataset.m; $$('[data-m]', el).forEach(x => x.setAttribute('aria-pressed', x === m ? 'true' : 'false')); draw(); } });
    el.addEventListener('keydown', e => { const b = e.target.closest('.bd[data-k]'); if (b && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); sel = b.dataset.k; draw(); $(`.bd[data-k="${sel}"]`, el)?.focus(); } });
    map.addEventListener('pointermove', e => { const b = e.target.closest('.bd[data-k]'); if (!b) return tip.classList.remove('on'); const p = list.find(q => q.k === b.dataset.k), M = METRICS.find(m => m[0] === metric), r = map.getBoundingClientRect(); tip.innerHTML = `<b>${E(p.cn)}</b>${M[1]} ${M[3](M[2](p))} · 妥协率 ${p.base}`; tip.style.left = e.clientX - r.left + 'px'; tip.style.top = e.clientY - r.top + 'px'; tip.classList.add('on'); });
    map.addEventListener('pointerleave', () => tip.classList.remove('on'));
    draw();
  };

  /* five switches → one label, computed live */
  const ruleHtml = (r, scen) => `<div class="prl" data-pc="rule">
      <div class="prl-sheet">
        <header class="mono"><span>LABEL RULE</span><span>get_global_label()</span></header>
        <ol class="prl-t" aria-label="五道请求的选择，点击切换">${scen.map((c, i) => `<li><button type="button" data-i="${i}" aria-pressed="false"><b class="mono">${pad2(i + 1)}</b><span>${E(c.cn)}</span><em class="mono">拒绝</em></button></li>`).join('')}</ol>
        <div class="prl-out"><b class="prl-y">0</b><div><h4 class="prl-n">保护</h4><p class="prl-w"></p></div><i class="prl-hz" aria-hidden="true"></i></div>
      </div>
      <div class="prl-side"><p>${E(r.lead)}</p>
        <div class="prl-ex"><span class="mono">试试这三种</span>${r.rows.map((x, i) => `<button type="button" data-ex="${i}">${E(x.why)} → <b>${x.y}</b></button>`).join('')}</div>
        <div class="prl-bars" aria-label="标签为 1 的比例：训练集 72.8%，测试集 74.1%"><div><span class="mono">TRAIN 3,500</span><i><u style="width:72.8%"></u></i><b>72.8%</b></div><div><span class="mono">TEST 750</span><i><u style="width:74.1%"></u></i><b>74.1%</b></div></div>
      </div></div>`;

  INIT.rule = (el, ctx) => {
    const sw = $$('.prl-t button', el), st = [0, 0, 0, 0, 0];
    const calc = () => {
      const n = st.reduce((a, b) => a + b, 0), y = st[2] || n >= 3 ? 1 : 0;
      sw.forEach((b, i) => { b.setAttribute('aria-pressed', st[i] ? 'true' : 'false'); $('em', b).textContent = st[i] ? '接受' : '拒绝'; });
      $('.prl-y', el).textContent = y; $('.prl-n', el).textContent = y ? '妥协' : '保护'; el.classList.toggle('is1', !!y);
      $('.prl-w', el).textContent = st[2] ? '第三道（通讯录）点了接受，直接记为 1。' : n >= 3 ? `第三道拒绝，但五道里接受了 ${n} 道，记为 1。` : `第三道拒绝，五道里只接受了 ${n} 道，记为 0。`;
    };
    sw.forEach((b, i) => b.addEventListener('click', () => { st[i] = st[i] ? 0 : 1; calc(); }));
    $$('[data-ex]', el).forEach(b => b.addEventListener('click', () => { const r = ctx.rule.rows[+b.dataset.ex]; r.p.forEach((v, i) => st[i] = v); calc(); }));
    calc();
  };

  P.a_background = (a, k, u0) => {
    const { esc, md } = k, u = use(a, u0, k), why = u.o('why').text || [], city = u.o('city').personas || [], rule = u.o('rule').rule || {}, ht = u.o('heatText').text || [];
    ['whyH', 'cityH', 'heatH', 'ruleH'].forEach(n => u.o(n)); u.o('heat');
    const scen = (findBlock(k.s, 'reqs') || {}).scen || [];
    return `<header class="p-bg">
        <div class="pb-title"><p class="mono">${esc(a.kicker)}</p><h2 data-noeva>${md(a.title)}</h2><p class="pb-lead">${md(a.lead)}</p></div>
        <ul class="pb-tags" aria-label="合成数据的来源">
          <li class="t1"><span class="mono">SYNTHETIC</span><b>12</b><small>类玩家画像</small>${bars(16, 4)}</li>
          <li class="t2"><span class="mono">PLAYERS</span><b>5,000</b><small>比较实验<br>另有 10,000 名用于主训练</small></li>
          <li class="t3"><i aria-hidden="true"></i><b>合成</b><small>不是真实玩家数据</small></li>
          <li class="t4"><span class="mono">SEED</span><b>42</b><small>固定随机种子</small>${qr(7)}</li>
        </ul>
      </header>
      <section class="p-bs p-bwhy" aria-label="${esc(u.o('whyH').sub)}">
        <header class="qs-h"><span class="mono">${esc(u.o('whyH').en)}</span><h3 data-noeva>${esc(u.o('whyH').sub)}</h3></header>
        <div class="qs-cols">${why.map(t => `<p>${md(t)}</p>`).join('')}</div>
      </section>
      <section class="p-bs p-bcity" aria-label="${esc(u.o('cityH').sub)}">
        <header class="qs-h"><span class="mono">${esc(u.o('cityH').en)}</span><h3 data-noeva>${esc(u.o('cityH').sub)}</h3></header>
        ${personaHtml(city)}
      </section>
      <section class="p-bs p-bheat" aria-label="${esc(u.o('heatH').sub)}">
        <header class="qs-h"><span class="mono">${esc(u.o('heatH').en)}</span><h3 data-noeva>${esc(u.o('heatH').sub)}</h3></header>
        <div class="bh-grid"><div class="bh-chart">${u.chart('heat')}</div><div class="bh-text">${ht.map(t => `<p>${md(t)}</p>`).join('')}</div></div>
      </section>
      <section class="p-bs p-brule" aria-label="${esc(u.o('ruleH').sub)}">
        <header class="qs-h"><span class="mono">${esc(u.o('ruleH').en)}</span><h3 data-noeva>${esc(u.o('ruleH').sub)}</h3></header>
        ${ruleHtml(rule, scen)}
      </section>`;
  };


  /* ================================================================
     ACT · METHOD — R441 cobalt field, white line city; R263 cards
     ================================================================ */
  const STEP_NAMES = ['生成玩家', '模拟五道请求', '打标签', '抽取 48 个特征', '切分数据', '训练五个模型', '评估'];
  const archScene = (layout, shares) => {
    const s = ISO.scene(), PL = ISO.PAL, W = PL.pale, G = PL.gold, tall = layout === 'tall', K0 = 1.3;
    // station centres: wide = a snake of two rows, tall = a zig-zag down the diagonal
    const C = tall ? (() => { const t = [0, 7, 14, 23, 31, 38, 45]; return t.map((v, i) => { const q = i % 2 ? 1 : -1; return [v + 3.4 * q + 5, v - 3.4 * q + 5]; }); })() : [[4, 4], [12, 4], [20, 4], [29, 4.4], [29, 13.2], [20, 13.2], [11, 13.2]];
    const xs = C.map(c => c[0]), ys = C.map(c => c[1]), x0 = Math.min(...xs) - 5, x1 = Math.max(...xs) + 5.5, y0 = Math.min(...ys) - 4.5, y1 = Math.max(...ys) + 4.5;
    s.plate(x0, y0, x1 - x0, y1 - y0, { th: .5, fill: '#2a45ff', pal: { top: '#2a45ff', l: '#1a30d0', r: '#1328b0', ln: 'rgba(255,255,255,.28)' } });
    for (let x = Math.ceil(x0); x < x1; x += 2) s.path([[x, y0, .02], [x, y1, .02]], { stroke: 'rgba(255,255,255,.13)', w: 1 });
    for (let y = Math.ceil(y0); y < y1; y += 2) s.path([[x0, y, .02], [x1, y, .02]], { stroke: 'rgba(255,255,255,.13)', w: 1 });
    // the road runs station to station, x first, then y
    const road = []; C.forEach(([x, y], i) => { if (i) road.push([x, C[i - 1][1], .03]); road.push([x, y, .03]); });
    s.path(road, { stroke: '#ffffff', w: 9 }).path(road, { stroke: '#2a45ff', w: 2, dash: '2 11', cls: 'flow' });
    const A = n => ` data-s="${n}" tabindex="0" role="button" aria-label="第 ${n} 步：${STEP_NAMES[n - 1]}"`, K = { pal: W, alt: G };
    // a station drawn in its own little grid: B.box(dx, dy, z, w, d, h) are offsets from the centre, scaled by k
    const at = (n, k = K0) => { const [cx, cy] = C[n - 1], o = { cls: 'bd', attr: A(n) }, B = {
      box: (dx, dy, z, w, d, h, p = {}) => (s.box(cx + dx * k, cy + dy * k, z * k, w * k, d * k, h * k, { ...K, ...o, ...p }), B),
      cyl: (dx, dy, z, r, h, p = {}) => (s.cyl(cx + dx * k, cy + dy * k, z * k, r * k, h * k, { ...K, ...o, ...p }), B),
      plate: (dx, dy, w, d, p) => (s.plate(cx + dx * k, cy + dy * k, w * k, d * k, p), B),
      badge: z => (s.badge(cx, cy, z * k, n, { cls: 'ab', attr: A(n), r: 17, size: 17 }), B) }; return B; };
    const hs = (shares || []).map(p => p.share), has = hs.length === 12;
    // 1 · players: twelve slim towers, height = population share
    { const B = at(1); for (let i = 0; i < 12; i++) B.box(-1 + (i % 4) * .55, -.8 + Math.floor(i / 4) * .55, 0, .4, .4, .5 + (has ? hs[i] * 11 : 1 + (i % 5) * .35)); B.badge(3.1); }
    // 2 · five requests: five stacked slabs
    { const B = at(2); for (let i = 0; i < 5; i++) B.box(-1.1 + (i % 2 ? .25 : -.1), -.9, i * .58, 2.1 - i * .12, 1.8, .5); B.badge(3.9); }
    // 3 · label: a gate; what passes is 1 or 0
    { const B = at(3); B.box(-1.4, -.5, 0, .55, .55, 2.2).box(.9, -.5, 0, .55, .55, 2.2).box(-1.5, -.6, 2.2, 3.2, .75, .5); B.box(-.2, -.2, 0, .5, .5, .5, { pal: PL.sky }); B.badge(3.9); }
    // 4 · features: six districts, 48 cubes
    { const B = at(4, 1.4); GROUPS.forEach((g, gi) => { const cols = Math.ceil(g[2] / 2), ox = -3.4 + (gi % 3) * 2.4, oy = -1.7 + Math.floor(gi / 3) * 2.2; B.plate(ox - .15, oy - .15, cols * .38 + .2, .38 * 2 + .2, { th: .08, fill: '#ffffff', pal: { top: '#fff', l: '#cfdaff', r: '#9fb3ff', ln: 'rgba(15,35,150,.3)' } }); for (let i = 0; i < g[2]; i++) B.box(ox + (i % cols) * .38, oy + Math.floor(i / cols) * .38, .08, .3, .3, .35 + ((i * 5 + gi * 3) % 4) * .16, { noShadow: 1 }); }); B.badge(2.6); }
    // 5 · split: three slabs, 70 / 15 / 15
    { const B = at(5); B.box(-1.9, -.9, 0, 2.4, 1.8, .9).box(.7, -.9, 0, .9, 1.8, .9, { pal: PL.sky }).box(1.8, -.9, 0, .9, 1.8, .9, { pal: PL.ink }); B.badge(2.4); }
    // 6 · training: a works with five silos, one per model
    { const B = at(6); B.box(-2.4, -.6, 0, 4.9, 1.3, .55); [1.5, 2.1, 1.8, 1.3, 2.4].forEach((h, i) => B.cyl(-1.9 + i * .98, 0, .55, .38, h, { pal: i === 0 ? PL.sky : W, band: 'rgba(15,35,150,.35)' })); B.badge(4); }
    // 7 · evaluation: a gauge drum and three readout columns
    { const B = at(7); B.cyl(-.9, 0, 0, 1.15, .45); [[.9, 0], [1.6, .55], [1.15, 1.1]].forEach(([h, o]) => B.box(.6 + o * .45, -.5 + o * .3, 0, .45, .45, h + .4)); B.badge(3); }
    // trees, thin white lollipops
    [[x1 - 1.4, y0 + 1.2], [x0 + 1.2, y1 - 1.2], [x1 - 1.4, y1 - 1.2], [x0 + 1.2, (y0 + y1) / 2], [x1 - 1.4, (y0 + y1) / 2]].forEach(([x, y]) => s.tree(x, y, { r: .42, h: .75, col: ['#ffffff', '#bcd0ff'] }));
    return s.svg({ cls: 'pa-svg pa-' + layout, label: '实验的七个环节，沿一条路依次排开：生成玩家、模拟五道请求、打标签、抽取特征、切分数据、训练模型、评估', pad: 16, blur: 6, shadow: 'rgba(5,10,60,.34)' });
  };

  /* little pictures that sit at the foot of each step card; every one uses only numbers stated in the text */
  const miniViz = (kind, ctx) => {
    if (kind === 'share') { const h = ctx.personas.map(p => p.share), mx = Math.max(...h); return `<div class="mv mv-share" role="img" aria-label="十二类画像的人口占比，最高 22%">${h.map((v, i) => `<i style="--h:${(v / mx * 100).toFixed(0)}%" title="${E(ctx.personas[i].cn)} ${Math.round(v * 100)}%"></i>`).join('')}<small class="mono">12 类 · 占比 2%—22%</small></div>`; }
    if (kind === 'fatigue') return `<div class="mv mv-chain" role="img" aria-label="五道请求依次发生，疲劳和惯性向后累积">${[1, 2, 3, 4, 5].map(n => `<span><b>${n}</b></span>`).join('<i></i>')}<small class="mono">疲劳 ↗ · 惯性 ↗ · 第 3 道起可能 +0.25</small></div>`;
    if (kind === 'label') return `<div class="mv mv-label" role="img" aria-label="三种选择组合得到的标签：1、1、0">${ctx.rule.rows.map(r => `<p>${r.p.map(v => `<i class="${v ? 'on' : ''}"></i>`).join('')}<b>→ ${r.y}</b></p>`).join('')}</div>`;
    if (kind === 'groups') return `<div class="mv mv-groups" role="img" aria-label="六组字段：8、8、10、8、6、8">${GROUPS.map(g => `<i style="flex:${g[2]};background:${GCOL_L[g[0]]}"><b>${g[0]}</b><em>${g[2]}</em></i>`).join('')}</div>`;
    if (kind === 'split') return `<div class="mv mv-split" role="img" aria-label="切分：70%、15%、15%"><i style="flex:70">训练 70</i><i style="flex:15">验证</i><i style="flex:15">测试</i><small class="mono">3,500 / 750 / 750 · 7,000 / 1,500 / 1,500</small></div>`;
    if (kind === 'models') return `<div class="mv mv-models">${['NumPy MLP', 'PyTorch MLP', '逻辑回归', '决策树', '随机森林'].map((t, i) => `<span class="${i === 0 ? 'on' : ''}">${t}</span>`).join('')}</div>`;
    if (kind === 'metrics') return `<div class="mv mv-metrics">${['AUC', 'F1', 'ECE', 'Brier'].map(t => `<span>${t}</span>`).join('')}<span class="x">25 组消融</span></div>`;
    return '';
  };

  const IO = [['12 类画像 · 人口占比', '5,000 名合成玩家（主训练 10,000）'], ['玩家 × 五道请求的设定值', '5,000 × 5 = 25,000 次接受 / 拒绝'], ['每人五次选择', '每人一个 0 / 1 标签'], ['五道请求的轨迹 + 画像参数', '每人 48 个 0—1 的数'], ['5,000 × 48 的特征表 + 标签', '训练 / 验证 / 测试三份'], ['训练集 · 验证集', '五个训练好的模型'], ['测试集 750 条', '指标表 + 25 组消融']];
  const stepCard = (d, ctx) => `<li class="bs bs${d.no}" data-step="${d.no}" tabindex="0"><span class="bs-n" aria-hidden="true">${pad2(d.no)}</span><header><h4>${E(d.h)}</h4><p class="mono">${E(d.file)}</p></header><p class="bs-t">${E(d.t)}</p><p class="bs-io"><span class="mono">IN</span>${E((d.io || IO[d.no - 1])[0])}<span class="mono">OUT</span>${E((d.io || IO[d.no - 1])[1])}</p>${miniViz(d.viz, ctx)}</li>`;

  INIT.arch = el => {
    const pick = n => { $$('[data-s]', el).forEach(g => g.classList.toggle('on', +g.dataset.s === n)); $$('.pa-legend button', el).forEach(b => b.setAttribute('aria-pressed', +b.dataset.s === n ? 'true' : 'false')); $$('.bs', el).forEach(c => c.classList.toggle('cur', +c.dataset.step === n)); el.dataset.cur = n; };
    el.addEventListener('click', e => { const t = e.target.closest('[data-s]'); if (t) { pick(+t.dataset.s); return; } const c = e.target.closest('.bs'); if (c) pick(+c.dataset.step); });
    el.addEventListener('keydown', e => { if (e.key !== 'Enter' && e.key !== ' ') return; const t = e.target.closest('[data-s],.bs'); if (!t) return; e.preventDefault(); pick(+(t.dataset.s || t.dataset.step)); });
    $$('.pa-legend button', el).forEach(b => b.addEventListener('click', () => { pick(+b.dataset.s); const c = $(`.bs[data-step="${b.dataset.s}"]`, el); c && c.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' }); }));
    pick(1);
  };

  /* the simulator's nine terms, with the settings you can move */
  const simHtml = (terms, personas, scen) => `<div class="psim" data-pc="sim">
      <div class="psim-ctl hud-lite">
        <p class="mono">SIMULATOR · 9 TERMS → SIGMOID</p>
        <label><span>玩家画像</span><select class="sm-p">${personas.slice().sort((a, b) => a.base - b.base).map(p => `<option value="${p.k}"${p.k === 'PRAG' ? ' selected' : ''}>${E(p.cn)} · 底色 ${p.base}</option>`).join('')}</select></label>
        <label><span>请求</span><select class="sm-r">${scen.map((c, i) => `<option value="${i}"${i === 2 ? ' selected' : ''}>${pad2(c.no)} ${E(c.cn)}</option>`).join('')}</select></label>
        <label class="sl"><span>资源紧张 <b class="sv" data-k="res">0.40</b></span><input type="range" min="0" max="1" step=".05" value=".4" data-k="res"></label>
        <label class="sl"><span>累积疲劳 <b class="sv" data-k="fat">0.20</b></span><input type="range" min="0" max="1" step=".05" value=".2" data-k="fat"></label>
        <label class="sl"><span>之前接受的比例 <b class="sv" data-k="prev">0.40</b></span><input type="range" min="0" max="1" step=".05" value=".4" data-k="prev"></label>
        <div class="psim-out" aria-live="polite"><b class="so-p">0.00</b><span class="mono">接受概率</span><svg class="so-sig" viewBox="0 0 220 90" aria-hidden="true"></svg></div>
      </div>
      <ol class="psim-rows">${terms.filter(t => !t.noise).map((t, i) => `<li data-i="${i}"><div class="sr-l"><b>${E(t.h)}</b><span class="mono">${E(t.f)}</span></div><div class="sr-b"><i class="z"></i><u></u></div><em class="mono">0.00</em></li>`).join('')}
        <li class="sr-sum"><div class="sr-l"><b>九项之和</b><span class="mono">再加个体噪声 N(0, 0.3)，过 sigmoid</span></div><div class="sr-b"><i class="z"></i><u></u></div><em class="mono">0.00</em></li></ol>
    </div>`;

  INIT.sim = (el, ctx) => {
    const P_ = k => ctx.personas.find(p => p.k === k), v = { res: .4, fat: .2, prev: .4 }, rows = $$('.psim-rows li', el), RANGE = 5;
    const calc = (p, c) => [Math.log(p.base / (1 - p.base)), 3.5 * c.reward / c.sens * (1 - .6 * p.risk), 2.8 * v.res * (1 - .5 * p.risk), c.social ? 2.2 * p.social * c.coerce : 0, 1.5 * v.fat * (1 - p.fatigue), 1.0 * v.prev * (1 - .5 * p.fatigue), .8 * c.time * (1 - p.risk), -1.8 * p.read * c.reward, -2.0 * p.read * c.words / 200];
    const draw = () => {
      const p = P_($('.sm-p', el).value), c = ctx.scen[+$('.sm-r', el).value], t = calc(p, c), sum = t.reduce((a, b) => a + b, 0), pr = 1 / (1 + Math.exp(-sum));
      const bar = (li, x) => { const u = $('u', li), w = Math.min(50, Math.abs(x) / RANGE * 50); u.style.width = w + '%'; u.style.left = x >= 0 ? '50%' : (50 - w) + '%'; u.className = x >= 0 ? 'pos' : 'neg'; $('em', li).textContent = (x >= 0 ? '+' : '−') + Math.abs(x).toFixed(2); };
      t.forEach((x, i) => bar(rows[i], x)); bar(rows[9], sum);
      $('.so-p', el).textContent = pr.toFixed(2).replace(/^0\./, '.');
      let g = `<path d="${Array.from({ length: 45 }, (_, i) => { const x = -6 + i * .27; return (i ? 'L' : 'M') + (110 + x * 17).toFixed(1) + ' ' + (80 - 1 / (1 + Math.exp(-x)) * 70).toFixed(1); }).join('')}" fill="none" stroke="currentColor" stroke-opacity=".45" stroke-width="1.6"/><line x1="10" x2="210" y1="80" y2="80" stroke="currentColor" stroke-opacity=".2"/><line x1="110" x2="110" y1="10" y2="80" stroke="currentColor" stroke-opacity=".12"/>`;
      const sx = 110 + Math.max(-6, Math.min(6, sum)) * 17, sy = 80 - pr * 70;
      g += `<line x1="${sx}" x2="${sx}" y1="${sy}" y2="80" stroke="var(--pc)" stroke-dasharray="3 3"/><circle cx="${sx}" cy="${sy}" r="5.5" fill="var(--pc)"/>`; $('.so-sig', el).innerHTML = g;
    };
    el.addEventListener('input', e => { const k = e.target.dataset.k; if (k) { v[k] = +e.target.value; $(`.sv[data-k="${k}"]`, el).textContent = (+e.target.value).toFixed(2); } draw(); });
    el.addEventListener('change', draw); draw();
  };

  const mcardHtml = (m, i) => `<li class="mc${i === 0 ? ' mc0' : ''}"><header><b>${E(m.n)}</b><span class="mono">${E(m.tag)}</span></header><dl>${m.rows.map(([a, b]) => `<div><dt>${E(a)}</dt><dd>${E(b)}</dd></div>`).join('')}</dl></li>`;
  const setupHtml = s => `<div class="pst"><table><thead><tr><th></th>${s.cols.map(c => `<th>${E(c)}</th>`).join('')}</tr></thead><tbody>${s.rows.map(r => `<tr>${r.map((c, i) => `<${i ? 'td' : 'th'}>${E(c)}</${i ? 'td' : 'th'}>`).join('')}</tr>`).join('')}</tbody></table><p class="note">${E(s.foot)}</p></div>`;
  const evIcon = i => [`<svg viewBox="0 0 80 60" aria-hidden="true"><path d="M4 56C10 20 30 8 76 6" fill="none" stroke="var(--pc)" stroke-width="2.4"/><path d="M4 56L76 6" stroke="currentColor" stroke-opacity=".3" stroke-dasharray="3 3"/><path d="M4 56C10 20 30 8 76 6V56Z" fill="var(--pc)" fill-opacity=".12"/></svg>`, `<svg viewBox="0 0 80 60" aria-hidden="true"><rect x="8" y="6" width="30" height="22" fill="var(--pc)"/><rect x="42" y="6" width="30" height="22" fill="none" stroke="var(--pc)" stroke-width="2"/><rect x="8" y="32" width="30" height="22" fill="none" stroke="var(--pc)" stroke-width="2"/><rect x="42" y="32" width="30" height="22" fill="var(--pc)"/></svg>`, `<svg viewBox="0 0 80 60" aria-hidden="true"><path d="M6 54L74 6" stroke="currentColor" stroke-opacity=".3" stroke-dasharray="3 3"/><polyline points="6,52 22,40 38,34 54,22 74,8" fill="none" stroke="var(--pc)" stroke-width="2.4"/>${[[22, 40], [38, 34], [54, 22]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="var(--pc)"/>`).join('')}</svg>`][i] || '';

  P.a_build = (a, k, u0) => {
    const { esc, md } = k, u = use(a, u0, k), st = u.o('steps').steps || [], lg = u.o('logit').logit || [], md2 = u.o('mcards').mcards || [], sp = u.o('setup').spec || {}, ev = u.o('ev').list || [], tx = u.o('lgText').text || [], bt = (u.o('buildText').text || []), tree = u.o('tree').tree || [];
    ['arch', 'lgH', 'mdH', 'setupH', 'evH', 'treeH'].forEach(n => u.o(n));
    const ctx = { personas: (findBlock(k.s, 'city') || {}).personas || [], rule: (findBlock(k.s, 'rule') || {}).rule || { rows: [] }, scen: (findBlock(k.s, 'reqs') || {}).scen || [] };
    return `<header class="p-build">
        <div class="pbd-t"><p class="mono">${esc(a.kicker)}</p><h2 data-noeva>${md(a.title)}</h2><p class="pbd-lead">${md(a.lead)}</p></div>
        <div class="pbd-x">${bt.map(t => `<p>${md(t)}</p>`).join('')}</div>
      </header>
      <section class="p-arch" data-pc="arch" aria-label="实验的七个环节">
        <div class="pa-field">
          <span class="pa-tag mono">FIG.1 · ARCHITECTURE</span><span class="pa-tag r mono">OFFLINE EXPERIMENT · 7 STAGES</span>
          ${archScene('wide', ctx.personas)}
          <p class="pa-hint mono" aria-hidden="true">点一栋楼，下面对应的步骤会亮起</p>
        </div>
        <ol class="pa-legend" aria-label="七个环节">${STEP_NAMES.map((n, i) => `<li><button type="button" data-s="${i + 1}" aria-pressed="false"><b>${i + 1}</b><span>${n}</span></button></li>`).join('')}</ol>
        <p class="pa-cap">${md(u.o('arch').arch.cap)}</p>
        <ol class="pa-steps">${st.map(d => stepCard(d, ctx)).join('')}</ol>
      </section>
      <section class="p-bs p-btree" aria-label="${esc(u.o('treeH').sub)}">
        <header class="qs-h"><span class="mono">${esc(u.o('treeH').en)}</span><h3 data-noeva>${esc(u.o('treeH').sub)}</h3></header>
        <ul class="bt-grid">${tree.map(d => `<li><header><b class="mono">${esc(d.dir)}</b><span class="mono">${esc(d.step)}</span></header><p>${esc(d.t)}</p><ul>${d.files.map(f => `<li class="mono">${esc(f)}</li>`).join('')}</ul></li>`).join('')}</ul>
      </section>
      <section class="p-bs p-bsim" aria-label="${esc(u.o('lgH').sub)}">
        <header class="qs-h"><span class="mono">${esc(u.o('lgH').en)}</span><h3 data-noeva>${esc(u.o('lgH').sub)}</h3></header>
        ${simHtml(lg, ctx.personas, ctx.scen)}
        <div class="qs-cols">${tx.map(t => `<p>${md(t)}</p>`).join('')}</div>
      </section>
      <section class="p-bs p-bmod" aria-label="${esc(u.o('mdH').sub)}">
        <header class="qs-h"><span class="mono">${esc(u.o('mdH').en)}</span><h3 data-noeva>${esc(u.o('mdH').sub)}</h3></header>
        <ul class="mc-grid">${md2.map(mcardHtml).join('')}</ul>
      </section>
      <section class="p-bs p-bset" aria-label="${esc(u.o('setupH').sub)}">
        <header class="qs-h"><span class="mono">${esc(u.o('setupH').en)}</span><h3 data-noeva>${esc(u.o('setupH').sub)}</h3></header>
        ${setupHtml(sp)}
      </section>
      <section class="p-bs p-bev" aria-label="${esc(u.o('evH').sub)}">
        <header class="qs-h"><span class="mono">${esc(u.o('evH').en)}</span><h3 data-noeva>${esc(u.o('evH').sub)}</h3></header>
        <ol class="ev-3">${ev.map(([h, t], i) => `<li><span class="ev-i">${evIcon(i)}</span><b class="mono">0${i + 1}</b><h4>${esc(h)}</h4><p>${esc(t)}</p></li>`).join('')}</ol>
      </section>`;
  };


  /* ================================================================
     ACT · FEATURES — one console: the 3D city and the 48-field atlas are one frame
     ================================================================ */
  const impItems = chart => (chart.items || []).map(d => { const f = (+String(d.label).match(/f_(\d+)/)[1]) - 1; return { label: d.label, v: d.v, t: d.t, f, g: groupOf(f)[0] }; });

  /* if WebGL is not available the city is still readable: a flat isometric drawing of the same 48 buildings */
  const fbScene = (colors, sel) => {
    const s = ISO.scene();
    s.plate(-1, -1, 3 * 5.6 + 1.4, 2 * 4.6 + 1.6, { th: .3, pal: { top: '#2540ff', l: '#1a30d0', r: '#1328b0', ln: 'rgba(255,255,255,.25)' }, fill: '#2540ff' });
    GROUPS.forEach((g, gi) => {
      const cols = Math.ceil(g[2] / 2), ox = (gi % 3) * 5.6 + .2, oy = Math.floor(gi / 3) * 4.6 + .2;
      s.plate(ox - .3, oy - .3, cols * 1.05 + .6, 2.7, { th: .1, fill: '#2e4aff', pal: { top: '#2e4aff', l: '#1a30d0', r: '#1328b0', ln: 'rgba(255,255,255,.5)' } });
      for (let i = 0; i < g[2]; i++) {
        const idx = groupStart(gi) + i, hex = colors[idx], on = idx === sel;
        s.box(ox + (i % cols) * 1.05, oy + Math.floor(i / cols) * 1.05, .1, .8, .8, on ? 2.8 : 1.1, { pal: { top: on ? '#ffffff' : hex, l: mixHex(on ? '#ffffff' : hex, '#000000', .22), r: mixHex(on ? '#ffffff' : hex, '#000000', .42), ln: 'rgba(255,255,255,.55)' }, noShadow: 1, cls: 'bd', attr: ` data-i="${idx}" tabindex="0" role="button" aria-label="f_${pad2(idx + 1)}"` });
      }
      s.text(ox + cols * .5, oy + 3.1, .1, g[0] + ' ' + g[1], { fill: '#ffffff', size: 12, weight: 700 });
    });
    return s.svg({ cls: 'pcy-fb-svg', label: '48 个行为字段的等距示意图', pad: 16, blur: 4, shadow: 'rgba(5,10,80,.3)' });
  };

  const cityCtx = s => { const at = (findBlock(s, 'atlas') || {}).atlas || { groups: [], feats: [] }, imp = findBlock(s, 'imp') || { chart: {} }, items = impItems(imp.chart); return { feats: at.feats, groups: at.groups, rank: new Map(items.map((d, i) => [d.f, [i + 1, d.t]])), top: new Set(items.map(d => d.f)) }; };

  INIT.city = (el, ctx) => {
    const feats = ctx.feats, stage = $('.pcy-stage .stage', el), grid = $('.pcy-grid', el), card = $('.pcy-card', el), top = ctx.top;
    let sel = 0, mode = 'group', focus = groupOf(0)[0];
    const colors = () => feats.map((f, i) => mode === 'source' ? SRC[f[2]][1] : mode === 'top' ? (top.has(i) ? '#ffd23f' : '#3550ff') : GCOL[groupOf(i)[0]]);
    const send = () => { if (!stage) return; stage.dispatchEvent(new CustomEvent('privacy-tint', { detail: { colors: colors() } })); stage.dispatchEvent(new CustomEvent('privacy-select', { detail: { index: sel, group: GROUPS.findIndex(g => g[0] === focus) } })); };
    const noGL = (() => { try { const c = document.createElement('canvas'); return !(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return true; } })();
    const fbBox = $('.pcy-fb', el); if (noGL) el.classList.add('no-gl');
    const paint = () => {
      const cs = colors(); if (noGL && fbBox) fbBox.innerHTML = fbScene(cs, sel); $$('.pcy-sq', grid).forEach((b, i) => { b.style.setProperty('--c', cs[i]); b.setAttribute('aria-pressed', i === sel ? 'true' : 'false'); b.classList.toggle('dim', mode === 'top' && !top.has(i)); });
      $$('.pcy-g', el).forEach(b => { const on = b.dataset.g === focus; b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      $$('.pcy-mode button', el).forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === mode ? 'true' : 'false'));
      const f = feats[sel], g = groupOf(sel), rank = ctx.rank.get(sel);
      card.innerHTML = `<p class="mono">f_${pad2(sel + 1)} · ${g[0]} ${g[1]}</p><h4>${E(f[0])}</h4><p class="pcy-how"><span class="mono">算法</span>${E(f[1])}</p><p class="pcy-meta"><i style="background:${SRC[f[2]][1]}"></i>${E(SRC[f[2]][0])}${rank ? `<span class="mono">置换重要性第 ${rank[0]} · ${rank[1]}</span>` : '<span class="mono">未进前 15</span>'}</p>`;
      $('.pcy-gd', el).textContent = ctx.groups[GROUPS.findIndex(q => q[0] === focus)][3];
      const cnt = { t: 0, p: 0, r: 0, x: 0 }; feats.forEach(q => cnt[q[2]]++); $$('.pcy-cnt b', el).forEach(b => b.textContent = cnt[b.dataset.s]);
    };
    const choose = (i, fromStage) => { sel = i; focus = groupOf(i)[0]; paint(); if (!fromStage) send(); };
    grid.addEventListener('click', e => { const b = e.target.closest('.pcy-sq'); if (b) choose(+b.dataset.i); });
    if (fbBox) { fbBox.addEventListener('click', e => { const b = e.target.closest('.bd[data-i]'); if (b) choose(+b.dataset.i); }); fbBox.addEventListener('keydown', e => { const b = e.target.closest('.bd[data-i]'); if (b && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); choose(+b.dataset.i); } }); }
    $$('.pcy-g', el).forEach(b => b.addEventListener('click', () => choose(groupStart(GROUPS.findIndex(g => g[0] === b.dataset.g)))));
    $$('.pcy-mode button', el).forEach(b => b.addEventListener('click', () => { mode = b.dataset.mode; paint(); send(); }));
    el.addEventListener('click', e => { const r = e.target.closest('[data-f]'); if (r && r.closest('.pcy-imp')) { choose(+r.dataset.f); stage && stage.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); } });
    if (stage) {
      stage.addEventListener('privacy-pick', e => choose(+e.detail.index, false));
      const ready = () => stage.classList.contains('ready'); if (ready()) send(); else new MutationObserver((_, ob) => { if (ready()) { ob.disconnect(); send(); } }).observe(stage, { attributes: true, attributeFilter: ['class'] });
    }
    paint();
  };

  P.a_system = (a, k, u0) => {
    const { esc, md } = k, u = use(a, u0, k), at = u.o('atlas').atlas || { groups: [], feats: [] }, st = u.o('srcs').text || [], it = u.o('impText').text || [], imp = u.o('imp'), sx = u.o('sysText').text || [];
    ['srcH', 'impH'].forEach(n => u.o(n));
    const items = impItems(imp.chart), rank = new Map(items.map((d, i) => [d.f, [i + 1, d.t]])), top = new Set(items.map(d => d.f));
    const cnt = { t: 0, p: 0, r: 0, x: 0 }; at.feats.forEach(f => cnt[f[2]]++);
    return `<header class="p-plasti">
        <div class="pp-t"><p class="mono">${esc(a.kicker)}</p><h2 data-noeva>${md(a.title)}</h2></div>
        <div class="pp-l"><p class="pp-lead">${md(a.lead)}</p>${sx.map(t => `<p class="pp-x">${md(t)}</p>`).join('')}</div>
      </header>
      <section class="p-city" data-pc="city" aria-label="48 个行为字段：三维城市与字段图鉴">
        <div class="pcy-frame">
          <div class="pcy-stage">${k.stageEl('privacy', { line: 1, cam: [21, 25, 27, 2.2, 1.2, -0.4] }, 'FEATURE CITY')}
            <div class="pcy-fb"></div>
            <p class="pcy-cap mono" aria-hidden="true">48 BUILDINGS · 6 DISTRICTS · 拖动旋转 · 悬停看名字</p></div>
          <aside class="pcy-panel" aria-label="字段图鉴">
            <div class="pcy-mode" role="group" aria-label="楼的颜色"><button type="button" data-mode="group" aria-pressed="true">按特征组</button><button type="button" data-mode="source" aria-pressed="false">按来源</button><button type="button" data-mode="top" aria-pressed="false">前 15 重要</button></div>
            <div class="pcy-grid" role="group" aria-label="48 个字段">${GROUPS.map((g, gi) => `<div class="pcy-row"><button type="button" class="pcy-g" data-g="${g[0]}" aria-pressed="false" title="${esc(g[0] + ' ' + g[1])}"><b>${g[0]}</b><span>${esc(g[1])}</span><small>${g[2]}</small></button><div class="pcy-sqs">${Array.from({ length: g[2] }, (_, j) => { const i = groupStart(gi) + j; return `<button type="button" class="pcy-sq" data-i="${i}" aria-pressed="false" aria-label="f_${pad2(i + 1)} ${esc(at.feats[i][0])}" title="${esc(at.feats[i][0])}">${pad2(i + 1)}</button>`; }).join('')}</div></div>`).join('')}</div>
            <p class="pcy-gd"></p>
            <article class="pcy-card" aria-live="polite"></article>
            <p class="pcy-src mono" aria-hidden="true">${['t', 'p', 'r', 'x'].map(s => `<span><i style="background:${SRC[s][1]}"></i>${SRC[s][0]} <b data-s="${s}">${cnt[s]}</b></span>`).join('')}</p>
          </aside>
        </div>
        <section class="pcy-s" aria-label="${esc(u.o('srcH').sub)}">
          <header class="qs-h"><span class="mono">${esc(u.o('srcH').en)}</span><h3 data-noeva>${esc(u.o('srcH').sub)}</h3></header>
          <div class="pcy-bar" role="img" aria-label="48 个字段的来源：${['t', 'p', 'r', 'x'].map(s => SRC[s][0] + ' ' + cnt[s]).join('，')}">${['p', 'r', 't', 'x'].map(s => `<i style="flex:${cnt[s]};background:${SRC[s][1]}"><b>${cnt[s]}</b><span>${esc(SRC[s][0])}</span></i>`).join('')}</div>
          <div class="qs-cols">${st.map(t => `<p>${md(t)}</p>`).join('')}</div>
        </section>
        <section class="pcy-imp" aria-label="${esc(u.o('impH').sub)}">
          <header class="qs-h"><span class="mono">${esc(u.o('impH').en)}</span><h3 data-noeva>${esc(u.o('impH').sub)}</h3></header>
          <div class="pcy-imp-grid"><div class="pcy-imp-c">${k.chart({ type: 'pc-imp', max: .06, items, label: '置换特征重要性前 15' }, md(imp.cap || ''))}</div><div class="pcy-imp-t">${it.map(t => `<p>${md(t)}</p>`).join('')}</div></div>
        </section>
      </section>`;
  };


  /* ================================================================
     ACT · MODELS — R291 dark HUD
     numbers: deploy/model_comparison.json (test set, 750 records)
     ================================================================ */
  const MODELS = [
    { n: 'NumPy MLP', cn: '手写 MLP', mine: 1, auc: .9857, lo: .9774, hi: .9919, f1: .9613, prec: .9414, rec: .982, spec: .8247, ece: .0337, brier: .0392, acc: .9413 },
    { n: 'PyTorch MLP', cn: '框架 MLP', auc: .9853, lo: .9765, hi: .9922, f1: .9739, prec: .9731, rec: .9748, spec: .9227, ece: .0249, brier: .0341, acc: .9613 },
    { n: 'Random Forest', cn: '随机森林', auc: .9907, lo: .9847, hi: .9946, f1: .9704, prec: .9678, rec: .973, spec: .9072, ece: .0132, brier: .0311, acc: .956 },
    { n: 'Decision Tree', cn: '决策树', auc: .9629, lo: .939, hi: .9801, f1: .9655, prec: .9511, rec: .9802, spec: .8557, ece: .0357, brier: .0438, acc: .948 },
    { n: 'Logistic Regression', cn: '逻辑回归', auc: .9723, lo: .9607, hi: .9828, f1: .9059, prec: .8434, rec: .9784, spec: .4794, ece: .2507, brier: .1152, acc: .8493 }
  ];
  const METRIC = [
    ['auc', 'AUC', 1, [.9, 1], 'AUC 看排序：随机抽一个“妥协”和一个“保护”，模型把前者排在前面的概率。横轴只放大了 0.90—1.00，线是 bootstrap 95% 区间；区间互相重叠的差别，不能当成名次。'],
    ['f1', 'F1', 1, [.8, 1], '阈值 0.5 下，查准率和查全率的调和平均。横轴放大到 0.80—1.00；结果取决于阈值。'],
    ['prec', '查准率', 1, [.8, 1], '被判成“妥协”的人里，真是“妥协”的占多少。逻辑回归在这里掉到 0.84。'],
    ['rec', '查全率', 1, [.9, 1], '真“妥协”的人里被找出来的占多少。五个模型都在 0.973—0.982，几乎一样。'],
    ['spec', '特异度', 1, [.4, 1], '真“保护”的人里被判对的占多少，这是五个模型分得最开的一项：0.48—0.92。'],
    ['ece', 'ECE', 0, [0, .27], '10 分箱校准误差，越低越好：模型说有 80% 把握的那一批人，实际是不是接近 80%。逻辑回归是 0.2507，比其余四个高出一个数量级。'],
    ['brier', 'Brier', 0, [0, .13], '概率和 0/1 结果之间的均方差，越低越好。逻辑回归 0.1152，其余四个在 0.031—0.044。']
  ];
  const scoreHtml = () => `<div class="pcm" data-pc="models">
      <div class="pcm-tabs" role="tablist" aria-label="评估指标">${METRIC.map((m, i) => `<button type="button" role="tab" aria-selected="${i ? 'false' : 'true'}" data-i="${i}">${m[1]}</button>`).join('')}</div>
      <ol class="pcm-rows"></ol>
      <p class="pcm-axis mono"></p>
      <p class="pcm-read"></p>
      <aside class="pcm-det" aria-live="polite"></aside>
    </div>`;
  INIT.models = el => {
    const rows = $('.pcm-rows', el), det = $('.pcm-det', el), axis = $('.pcm-axis', el), read = $('.pcm-read', el);
    let mi = 0, sel = 0;
    const draw = () => {
      const [k, name, hi, [a, b], txt] = METRIC[mi], vals = MODELS.map(m => m[k]), best = hi ? Math.max(...vals) : Math.min(...vals), x = v => ((v - a) / (b - a) * 100).toFixed(2);
      rows.innerHTML = MODELS.map((m, i) => `<li class="${i === sel ? 'sel' : ''}${m[k] === best ? ' best' : ''}" data-i="${i}" tabindex="0" role="button" aria-pressed="${i === sel}"><span class="pcm-n">${E(m.n)}${m.mine ? '<em class="mono">本项目</em>' : ''}</span><div class="pcm-t"><i style="width:${Math.max(1.5, x(m[k]))}%"></i>${k === 'auc' ? `<u style="left:${x(m.lo)}%;width:${x(m.hi) - x(m.lo)}%"></u>` : ''}</div><b>${m[k].toFixed(4)}${m[k] === best ? '<small>▲</small>' : ''}</b></li>`).join('');
      axis.textContent = `横轴 ${a.toFixed(2)} — ${b.toFixed(2)}${hi ? '（越高越好）' : '（越低越好）'}${k === 'auc' ? ' · 细线 = 95% 区间' : ''}`; read.textContent = txt;
      $$('.pcm-tabs button', el).forEach((t, i) => t.setAttribute('aria-selected', i === mi ? 'true' : 'false'));
      const m = MODELS[sel], d = (l, v, c) => `<div><dt>${l}</dt><dd${c ? ` class="${c}"` : ''}>${v}</dd></div>`;
      det.innerHTML = `<p class="mono">${E(m.cn)} · 测试集 750</p><h4>${E(m.n)}</h4><dl>${d('AUC', m.auc.toFixed(4))}${d('95% 区间', m.lo.toFixed(4) + '—' + m.hi.toFixed(4))}${d('查准', m.prec.toFixed(4))}${d('查全', m.rec.toFixed(4))}${d('特异度', m.spec.toFixed(4), m.spec < .6 ? 'warn' : '')}${d('F1', m.f1.toFixed(4))}${d('ECE', m.ece.toFixed(4), m.ece > .1 ? 'warn' : '')}${d('Brier', m.brier.toFixed(4))}</dl>`;
    };
    el.addEventListener('click', e => { const t = e.target.closest('.pcm-tabs button'); if (t) { mi = +t.dataset.i; draw(); return; } const r = e.target.closest('.pcm-rows li'); if (r) { sel = +r.dataset.i; draw(); } });
    el.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.pcm-rows li')) { e.preventDefault(); sel = +e.target.closest('li').dataset.i; draw(); $(`.pcm-rows li[data-i="${sel}"]`, el)?.focus(); } });
    draw();
  };

  /* 48 → 64 → 32 → 1, hand-written in NumPy: run it forwards and backwards */
  const mlpHtml = st => {
    const L = [[48, 12, '输入'], [64, 14, 'ReLU'], [32, 10, 'ReLU'], [1, 1, 'Sigmoid']], W = 760, H = 330, xs = [80, 290, 500, 700];
    const pos = L.map(([, n], li) => Array.from({ length: n }, (_, k) => [xs[li], n === 1 ? H / 2 : 22 + k * ((H - 44) / (n - 1))]));
    let e = '', nd = '';
    for (let l = 0; l < 3; l++) pos[l].forEach((a, i) => pos[l + 1].forEach((b, j) => { if ((i * 3 + j * 5 + l) % 4 === 0 || l === 2) e += `<line class="ed e${l}" x1="${a[0]}" y1="${a[1].toFixed(1)}" x2="${b[0]}" y2="${b[1].toFixed(1)}" style="--d:${(l * .45 + (i % 5) * .03).toFixed(2)}s"/>`; }));
    pos.forEach((P_, li) => P_.forEach(([x, y], i) => { nd += `<circle class="nd n${li}" cx="${x}" cy="${y.toFixed(1)}" r="${li === 3 ? 13 : 6}" style="--d:${(li * .45 + (i % 5) * .03).toFixed(2)}s"/>`; }));
    const lab = L.map(([n, , t], li) => `<text x="${xs[li]}" y="${H + 22}" text-anchor="middle" class="lyr">${n}</text><text x="${xs[li]}" y="${H + 38}" text-anchor="middle" class="lyt">${t}</text>`).join('');
    const dim = ['3,136', '2,080', '33'].map((v, i) => `<text x="${(xs[i] + xs[i + 1]) / 2}" y="${-8}" text-anchor="middle" class="dim">${v}</text>`).join('');
    return `<div class="pml" data-pc="mlp">
      <div class="pml-fig"><svg viewBox="0 -24 ${W} ${H + 76}" role="img" aria-label="48-64-32-1 网络结构，点按钮看前向或反向传播">${e}${nd}${lab}${dim}</svg><p class="pml-out mono" aria-live="polite">按“前向传播”，信号从 48 个字段走到一个概率</p></div>
      <div class="pml-side"><ol class="pm-st">${st.map(([v, l, x]) => `<li><b>${E(v)}</b><span>${E(l)}</span><small class="mono">${E(x)}</small></li>`).join('')}</ol>
        <div class="pml-btn"><button type="button" data-run="f">前向传播 →</button><button type="button" data-run="b">← 反向传播</button></div>
        <p class="pml-n">前向、反向传播和梯度检查都用 NumPy 手写；反向传播用 <span class="mono">training/grad_check.py</span> 的数值梯度核对过。</p></div>
    </div>`;
  };
  INIT.mlp = el => {
    const svg = $('svg', el), out = $('.pml-out', el);
    const run = dir => { svg.classList.remove('run', 'back'); void svg.getBoundingClientRect(); svg.classList.add(dir === 'b' ? 'back' : 'run'); out.textContent = dir === 'b' ? '误差从输出一层层往回传，每层按链式法则得到梯度' : '48 个字段 → 64 → 32 → 1 个概率，每经过一层先乘权重、加偏置，再过激活函数'; };
    $$('[data-run]', el).forEach(b => b.addEventListener('click', () => run(b.dataset.run)));
  };

  P.a_model = (a, k, u0) => {
    const { esc, md } = k, u = use(a, u0, k), pair = u.o('diag'), tr = u.o('tr').charts || { items: [] }, tab = u.o('tab').table, st = u.o('mlpStats').stats || [], ci = u.o('ciAuc'), pr = u.o('ciPr'), tm = u.o('time');
    ['mods', 'modsNote', 'ciH', 'tabNote', 'mlpH', 'mlp', 'diagH', 'diagNote', 'trH', 'trNote'].forEach(n => u.o(n));
    const mlpSub = u.o('mlpH');
    return `<div class="p-dark">
        <header class="p-reboot">
          <i class="pb-scan" aria-hidden="true"></i>
          <p class="pb-sys mono" aria-hidden="true">SYSTEM · MODEL CHECK ▲ TEST 750</p>
          <p class="pb-num" aria-hidden="true">${esc(a.open.num)}<small>${esc(a.open.unit)}</small></p>
          <h2 data-noeva>${md(a.title)}</h2>
          <p class="pb-l mono">${esc(a.open.label)}</p>
          <p class="pm-lead">${md(a.lead)}</p>
          <ul class="pb-read mono" aria-hidden="true">${MODELS.map(m => `<li>${esc(m.n.toUpperCase())}</li>`).join('')}</ul>
        </header>
        <section class="pd-s pd-board" aria-label="五个模型的指标">
          <header class="pk-h"><span class="mono">MODEL BOARD · 5,000 SAMPLES · TEST 750</span><h3 data-noeva>五个模型，七项指标</h3></header>
          ${scoreHtml()}
          <p class="note">${md(u.o('modsNote').note)}</p>
        </section>
        <section class="pd-s" aria-label="${esc(u.o('ciH').sub)}">
          <header class="pk-h"><span class="mono">${esc(u.o('ciH').en)}</span><h3 data-noeva>${esc(u.o('ciH').sub)}</h3></header>
          <div class="pd-two"><figure class="pd-fig">${k.chart(ci.chart, '')}<p>${(ci.p || []).map(t => md(t)).join('')}</p></figure><figure class="pd-fig">${k.chart(pr.chart, '')}<p>${(pr.p || []).map(t => md(t)).join('')}</p></figure></div>
          <div class="pd-tab"><table><thead><tr>${tab.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${tab.rows.map(r => `<tr>${r.map((c, i) => `<${i ? 'td' : 'th'}>${esc(c)}</${i ? 'td' : 'th'}>`).join('')}</tr>`).join('')}</tbody></table></div>
          <p class="note">${md(u.o('tabNote').note)}</p>
        </section>
        <section class="pd-s p-mlp" aria-label="${esc(mlpSub.sub)}">
          <header class="pk-h"><span class="mono">${esc(mlpSub.en)}</span><h3 data-noeva>${esc(mlpSub.sub)}</h3></header>
          ${mlpHtml(st)}
        </section>
        <section class="pd-s" aria-label="${esc(u.o('diagH').sub)}">
          <header class="pk-h"><span class="mono">${esc(u.o('diagH').en)}</span><h3 data-noeva>${esc(u.o('diagH').sub)}</h3></header>
          <div class="pd-two pd-diag"><figure class="pd-fig">${k.chart(pair.chart, '')}</figure><div class="pd-side"><h4>${esc(pair.h || '')}</h4>${(pair.p || []).map(t => `<p>${md(t)}</p>`).join('')}<dl>${(pair.dl || []).map(([x, y]) => `<div><dt>${esc(x)}</dt><dd>${esc(y)}</dd></div>`).join('')}</dl><p class="note">${md(u.o('diagNote').note)}</p></div></div>
        </section>
        <section class="pd-s p-train" aria-label="${esc(u.o('trH').sub)}">
          <header class="pk-h"><span class="mono">${esc(u.o('trH').en)}</span><h3 data-noeva>${esc(u.o('trH').sub)}</h3></header>
          <div class="ptr-grid">${tr.items.map((d, i) => `<article class="ptr-c"><h4><span class="mono">${pad2(i + 1)}</span>${esc(d.label)}</h4>${k.chart(d.chart, '')}${(d.p || []).map(t => `<p>${md(t)}</p>`).join('')}</article>`).join('')}</div>
          <div class="ptr-time"><div>${k.chart(tm.chart, '')}</div><div class="ptr-tt"><p>${md(tm.cap || '')}</p><p class="note">${md(u.o('trNote').note)}</p></div></div>
        </section>
      </div>`;
  };


  /* ================================================================
     ACT · RESULTS — R263 blue template grid, every record a tile
     ================================================================ */
  const confList = s => (((findBlock(s, 'conf') || {}).charts || {}).items || []).map(d => { const c = d.chart.cells; return { label: d.label, tn: c[0][0].n, fp: c[0][1].n, fn: c[1][0].n, tp: c[1][1].n }; });

  INIT.tiles = (el, ctx) => {
    const list = ctx.conf, grid = $('.pt2-grid', el), tiles = [];
    for (let i = 0; i < 750; i++) { const t = document.createElement('i'); grid.append(t); tiles.push(t); }
    let cur = 0;
    const set = i => {
      cur = i; const m = list[i], cls = [];
      for (let k = 0; k < 194; k++) cls.push(k < m.fp ? 'p fp' : 'p'); for (let k = 0; k < 556; k++) cls.push(k < m.fn ? 'c fn' : 'c');
      tiles.forEach((t, k) => { t.className = cls[k]; t.style.setProperty('--d', ((k % 30) * 8 + Math.floor(k / 30) * 6) + 'ms'); });
      $('.pt2-m', el).innerHTML = `<b>${E(m.label)}</b><span class="mono">TEST 750</span>`;
      $('.pt2-n', el).innerHTML = [['保护 · 判对', m.tn, 'p'], ['保护 → 妥协', m.fp, 'fp'], ['妥协 → 保护', m.fn, 'fn'], ['妥协 · 判对', m.tp, 'c']].map(([l, v, c]) => `<div><dt><i class="${c}"></i>${l}</dt><dd>${v}</dd></div>`).join('');
      $('.pt2-s', el).textContent = `保护类 194 条里 ${m.fp} 条被判成妥协（${(m.fp / 194 * 100).toFixed(1)}%）；妥协类 556 条里 ${m.fn} 条被判成保护（${(m.fn / 556 * 100).toFixed(1)}%）。`;
      $$('.pt2-sw button', el).forEach((b, k) => b.setAttribute('aria-pressed', k === i ? 'true' : 'false'));
      grid.setAttribute('aria-label', `${m.label} 在测试集 750 条记录上的判断：每格一条记录，${m.fp} 条保护被判成妥协，${m.fn} 条妥协被判成保护。`);
    };
    $$('.pt2-sw button', el).forEach((b, i) => b.addEventListener('click', () => set(i)));
    set(0);
  };

  P.a_evaluation = (a, k, u0) => {
    const { esc, md } = k, u = use(a, u0, k), conf = confList(k.s), abl = u.o('abl').charts || { items: [] }, rel = u.o('rel'), rt = u.o('relText').text || [], give = u.o('give').give || [];
    ['confH', 'conf', 'confNote', 'ablH', 'relH'].forEach(n => u.o(n)); u.o('giveH');
    const cn = u.o('confNote').note;
    return `<header class="p-tiles" data-pc="tiles">
        <div class="pt2-gridw"><div class="pt2-grid" role="img"></div><p class="pt2-cap mono" aria-hidden="true">750 TILES · 30 × 25 · 每格一条测试记录</p></div>
        <div class="pt2-copy">
          <p class="mono">${esc(a.kicker)}</p>
          <h2 data-noeva>${md(a.title)}</h2>
          <p class="pt2-lead">${md(a.lead)}</p>
          <div class="pt2-sw" role="group" aria-label="选择模型">${conf.map((c, i) => `<button type="button" aria-pressed="${i ? 'false' : 'true'}">${esc(c.label)}</button>`).join('')}</div>
          <p class="pt2-m"></p>
          <dl class="pt2-n"></dl>
          <p class="pt2-s"></p>
          <p class="note">${md(cn)}</p>
        </div>
      </header>
      <section class="p-ev p-abl" aria-label="${esc(u.o('ablH').sub)}">
        <header class="qs-h"><span class="mono">${esc(u.o('ablH').en)}</span><h3 data-noeva>${esc(u.o('ablH').sub)}</h3></header>
        <div class="abl-grid"><span class="pa-tag dark mono">FIG.5 · ABLATION · 25 RUNS</span>${[[0, 3], [1, 2]].map(col => `<div class="abl-col">${col.map(j => { const d = abl.items[j], i = j; return `<article class="abl-c abl-${i}"><h4><span class="mono">${'ABCD'[i]}</span>${esc(d.label)}</h4>${k.chart(d.chart, '')}${(d.p || []).map(t => `<p>${md(t)}</p>`).join('')}${(d.dl || []).map(([x, y]) => `<p class="abl-src"><b class="mono">${esc(x)}</b>${esc(y)}</p>`).join('')}</article>`; }).join('')}</div>`).join('')}</div>
        <p class="note">${esc(abl.title || '')} · 各组改动只对应一个设定，其余保持基线。</p>
      </section>
      <section class="p-ev p-rel" aria-label="${esc(u.o('relH').sub)}">
        <header class="qs-h"><span class="mono">${esc(u.o('relH').en)}</span><h3 data-noeva>${esc(u.o('relH').sub)}</h3></header>
        <div class="rel-grid">
          <figure class="rel-c">${k.chart(rel.chart, md(rel.cap || ''))}</figure>
          <div class="rel-t">
            <div class="rel-n"><div class="rn-h mono"><span></span><span>500 名玩家的试跑</span><span></span><span>10,000 名玩家的主训练</span></div>${[["ECE","0.072","0.009"],["Brier","0.031","0.025"],["测试集（条）","80","1,500"]].map(([l,a,b]) => `<div class="rn-r"><span class="mono">${l}</span><b>${a}</b><i aria-hidden="true">→</i><b class="to">${b}</b></div>`).join("")}</div>
            ${rt.map(t => `<p>${md(t)}</p>`).join('')}
          </div>
        </div>
      </section>
      <section class="p-ev p-give" aria-label="${esc(u.o('giveH').sub)}">
        <header class="qs-h"><span class="mono">${esc(u.o('giveH').en)}</span><h3 data-noeva>${esc(u.o('giveH').sub)}</h3></header>
        <ol class="give-l">${give.map((d, i) => `<li class="gl gl${i}"><header><span class="mono">${esc(d.k)}</span><b>${pad2(i + 1)}</b></header><h4>${esc(d.h)}</h4><p>${esc(d.p)}</p>${bars(22, 21 + i * 4)}${i === 1 ? '<i class="gl-hz" aria-hidden="true"></i>' : ''}</li>`).join('')}</ol>
      </section>`;
  };


  /* ================================================================
     page hooks
     ================================================================ */
  P.title = titleHtml;
  P.logline = loglineHtml;
  P.act = (a, i, k) => { const f = P['a_' + a.id]; return f ? f.call(P, a, k, k.use(a)) : null; };
  P.after = (root, k) => {
    const s = k.s;
    // title: the glass dialog answers and says it is a demo; buildings can be picked blue
    const t = $('.pd-t', root);
    $$('.pt-dialog [data-pick]', root).forEach(b => b.addEventListener('click', () => { t.textContent = `当前选择：${b.dataset.pick}。这只是演示：不申请真实权限，也不上传记录。`; }));
    $$('.pt-city .bd', root).forEach(b => b.addEventListener('click', () => b.classList.toggle('on')));
    // hesitation timer on the front dialog of the second act
    const tm = $('.ps-t b', root);
    if (tm && !reduce) { let n = 0; setInterval(() => { n = n >= 7 ? 0 : n + .1; tm.textContent = n.toFixed(1); }, 100); }
    // components, each from its data-pc hook
    const scen = (findBlock(s, 'reqs') || {}).scen || [], personas = (findBlock(s, 'city') || {}).personas || [], rule = (findBlock(s, 'rule') || {}).rule || { rows: [] };
    const CTX = { demo: { scen }, persona: { personas }, rule: { rule }, sim: { personas, scen }, city: cityCtx(s), tiles: { conf: confList(s) } };
    $$('[data-pc]', root).forEach(el => { const f = INIT[el.dataset.pc]; if (f) { try { f(el, CTX[el.dataset.pc] || {}); } catch (e) { console.error('[privacy-city]', el.dataset.pc, e); } } });
    // links between the intro chips / label stickers and the phone
    const open = i => { const d = $('.pcd', root); if (!d) return; d._open(i); d.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); };
    $$('.hd-chips [data-open]', root).forEach(b => b.addEventListener('click', () => open(+b.dataset.open)));
    $$('.rq-b', root).forEach(b => b.addEventListener('click', () => open(+b.closest('.rq').dataset.i)));
    // reveal on view
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
    $$('[data-pc="inview"], .p-title, .p-tiles, .p-arch, .p-city, .pml', root).forEach(el => io.observe(el));
  };
})();

;/* 2026-10-15 polish: type-size floor (small labels >= 11px, running text >= 14px) */
(() => {
  const SKIP = /(note|foot|cap|source|src|hint|meta|tag|legend|mono|pill|chip|badge|kbd|num|axis|label)/i;
  let timer = 0;
  const run = () => {
    const root = document.querySelector('#main') || document.body;
    root.querySelectorAll('*').forEach(e => {
      if (e.closest('svg') || ['SCRIPT', 'STYLE', 'OPTION'].includes(e.tagName)) return;
      let t = '';
      for (const n of e.childNodes) if (n.nodeType === 3) t += n.textContent;
      t = t.trim(); if (!t) return;
      const fs = parseFloat(getComputedStyle(e).fontSize);
      if (fs < 11) e.style.setProperty('font-size', '11px', 'important');
      else if (fs < 14 && t.length >= 28 && !SKIP.test(String(e.className)) && !e.closest('[class*="note"],[class*="foot"],[class*="cap"],[class*="source"]')) e.style.setProperty('font-size', '14px', 'important');
    });
  };
  const sched = () => { if (!timer) timer = setTimeout(() => { timer = 0; run(); }, 500); };
  const start = () => {
    sched();
    new MutationObserver(sched).observe(document.querySelector('#main') || document.body, { childList: true, subtree: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
