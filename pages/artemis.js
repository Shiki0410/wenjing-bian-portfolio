/* Artemis: project-local modules and act layouts (2026-10-14 rebuild).
   Layout keys are stable content block ids (never positional indexes).
   Nothing here mutates shared renderer / stage / pv-modules code. */
(() => {
  const PG = window.PAGES = window.PAGES || {};
  const M = window.MODULES = window.MODULES || {};
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const $ = (s, r) => r.querySelector(s), $$ = (s, r) => [...r.querySelectorAll(s)];
  const image = (src, alt, cls = '') => `<img class="${cls}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy">`;
  const ic = name => `assets/artemis/ic/${name}.webp`;
  let serial = 0;

  /* The shared META entry still carries the team-size credit line and old source labels. Patch only this project's entry at runtime. */
  const proj = window.PORTFOLIO && (window.PORTFOLIO.projects || []).find(x => x.id === 'artemis');
  if (window.META && window.META.artemis) {
    const m = window.META.artemis;
    delete m.credit;
    m.sources = [['精英一 · 角色设定', 'folio-repair/artemis-elite1-design'], ['精英二 · 角色设定', 'folio-repair/artemis-elite2-design'], ['精英一 · 动作帧', 'folio-repair/artemis-elite1-motion-sheet'], ['实机 · 背包界面', 'artemis/ui-backpack.webp']];
    m.limit = '机制图按工程脚本和演示录屏整理；暂无帧数、伤害统计和玩家测试。';
  }

  /* ---------- tabs ---------- */
  const tabbar = (labels, name, cls = '') => {
    const id = 'artemis-tabs-' + (++serial);
    return `<div class="ar-tabs ${cls}" role="tablist" aria-label="${esc(name)}" data-group="${id}">${labels.map((t, i) => `<button type="button" role="tab" data-tab="${i}" id="${id}-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${t}</button>`).join('')}</div>`;
  };
  const bindTabs = (el, fn, bar0) => {
    const bar = bar0 || $('.ar-tabs', el), bs = $$('[data-tab]', bar);
    const pick = i => {
      bs.forEach((b, j) => { b.setAttribute('aria-selected', j === i); b.tabIndex = j === i ? 0 : -1; });
      fn(i);
    };
    bs.forEach((b, i) => b.addEventListener('click', () => pick(i)));
    bar.addEventListener('keydown', e => {
      const i = bs.indexOf(document.activeElement);
      if (i < 0 || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return;
      const f = ['ArrowRight', 'ArrowDown'].includes(e.key);
      const j = e.key === 'Home' ? 0 : e.key === 'End' ? bs.length - 1 : (i + (f ? 1 : bs.length - 1)) % bs.length;
      e.preventDefault(); bs[j].focus(); pick(j);
    });
    pick(0);
    return pick;
  };
  const shell = (code, body, source, cls = '') => `<div class="ar-module ${cls}" data-noeva><header class="ar-module-head mono"><span>${code}</span><span>ARTEMIS</span></header>${body}${source ? `<p class="ar-source">${source}</p>` : ''}</div>`;
  const polygon = (x, y, r = 32) => Array.from({ length: 6 }, (_, i) => { const a = (60 * i - 30) * Math.PI / 180; return `${(x + r * Math.cos(a)).toFixed(2)},${(y + r * Math.sin(a)).toFixed(2)}`; }).join(' ');
  const svg = (label, desc, body, vb) => `<svg viewBox="${vb}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title><desc>${esc(desc)}</desc>${body}</svg>`;

  /* ---------- axial hex helpers (same direction table as HexEdgeManager) ---------- */
  const DIRS = [[0, 1], [1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1]];
  const DN = ['TopRight', 'Right', 'BottomRight', 'BottomLeft', 'Left', 'TopLeft'];
  const hxy = (q, r, R) => [R * Math.sqrt(3) * (q + r / 2), -R * 1.5 * r];
  const hcells = n => { const a = []; for (let q = -n; q <= n; q++) for (let r = -n; r <= n; r++) if (Math.abs(q + r) <= n) a.push([q, r]); return a; };
  const K = (q, r) => q + ',' + r;
  const hdist = (a, b) => (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[0] + a[1] - b[0] - b[1])) / 2;
  const hline = (a, b) => {
    const n = hdist(a, b), out = [];
    const cube = (q, r) => [q, -q - r, r];
    const ca = cube(...a), cb = cube(...b);
    for (let i = 0; i <= n; i++) {
      const t = n ? i / n : 0, f = ca.map((v, j) => v + (cb[j] - v) * t + 1e-6 * (j + 1));
      let rx = Math.round(f[0]), ry = Math.round(f[1]), rz = Math.round(f[2]);
      const dx = Math.abs(rx - f[0]), dy = Math.abs(ry - f[1]), dz = Math.abs(rz - f[2]);
      if (dx > dy && dx > dz) rx = -ry - rz; else if (dy > dz) ry = -rx - rz; else rz = -rx - ry;
      out.push([rx, rz]);
    }
    return out;
  };
  const bfs = (from, to, open) => {
    const prev = new Map([[K(...from), null]]), Q = [from];
    while (Q.length) {
      const c = Q.shift(); if (K(...c) === K(...to)) break;
      DIRS.forEach(([dq, dr]) => { const n = [c[0] + dq, c[1] + dr], k = K(...n); if (open(n) && !prev.has(k)) { prev.set(k, c); Q.push(n); } });
    }
    if (!prev.has(K(...to))) return null;
    const p = []; for (let c = to; c; c = prev.get(K(...c))) p.unshift(c); return p;
  };

  /* =================================================================
     01 WORLD · fall frame split into three spatial layers (CSS 3D)
     ================================================================= */
  M.artemisFall = {
    html: (p, o) => {
      const L = o.layers, order = ['BACK', 'MID', 'FRONT'];
      const layerEl = k => {
        const l = L.find(x => x.k === k), [x, y, w, h] = l.box, full = w === 100 && h === 100;
        const im = `<img src="${esc(o.frame)}" alt="" style="width:${(10000 / w).toFixed(3)}%;height:${(10000 / h).toFixed(3)}%;left:${(-x / w * 100).toFixed(3)}%;top:${(-y / h * 100).toFixed(3)}%">`;
        return `<div class="fl fl-${k.toLowerCase()}" data-layer="${k}" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%">${im}${full ? '' : `<i class="fl-tag mono">${esc(l.n)}</i>`}</div>`;
      };
      return shell('FALL / ' + esc(o.time), `<div class="ar-fall">
        <div class="ar-fall-view"><div class="ar-fall-stage" style="--open:0"><div class="ar-fall-3d">${order.map(layerEl).join('')}</div><img class="ar-fall-flat" src="${esc(o.seq[0][0])}" alt="" hidden></div><p class="ar-fall-tc mono"><b>${esc(o.time)}</b><span>理念宣传片</span></p></div>
        <div class="ar-fall-side">
          <h3>跌落这一幕</h3>
          <div class="ar-fall-ctl"><label>拆开 <output>0</output>%<input type="range" min="0" max="100" value="0" aria-label="三层拆开程度"></label></div>
          ${tabbar(L.slice().reverse().map(l => `<b>${l.k}</b>${esc(l.n)}`), '空间层', 'ar-layer-tabs')}
          <div class="ar-read" aria-live="polite"></div>
        </div>
        <div class="ar-fall-seq" role="group" aria-label="镜头前后五帧">${o.seq.map(([s, t], i) => `<button type="button" data-f="${i}" aria-pressed="${t === o.time}"><img src="${esc(s)}" alt="${esc(t)} 镜头" loading="lazy"><span class="mono">${esc(t)}</span></button>`).join('')}</div>
      </div>`, '画面截自理念宣传片，不做绘制。拖动滑杆把同一帧里的三层空间沿纵深拆开；下方五帧是这一幕前后的镜头。');
    },
    init(el, p, o) {
      const st = $('.ar-fall-stage', el), rng = $('input', el), out = $('output', el), flat = $('.ar-fall-flat', el), td = $('.ar-fall-3d', el), tc = $('.ar-fall-tc b', el);
      const L = o.layers.slice().reverse(), keyIdx = o.seq.findIndex(s => s[1] === o.time);
      let cur = L[0].k, frame = keyIdx;
      const setOpen = v => { st.style.setProperty('--open', v / 100); out.textContent = v; };
      const mark = () => $$('.fl', el).forEach(n => n.classList.toggle('on', n.dataset.layer === cur));
      const read = () => { const l = o.layers.find(x => x.k === cur); $('.ar-read', el).innerHTML = `<span class="mono">${l.k} / ${esc(l.n)}</span><h4>${esc(l.h)}</h4><p>${esc(l.p)}</p>`; mark(); };
      rng.addEventListener('input', () => setOpen(+rng.value));
      bindTabs(el, i => { cur = L[i].k; read(); }, $('.ar-layer-tabs', el));
      $$('[data-f]', el).forEach(b => b.addEventListener('click', () => {
        frame = +b.dataset.f; $$('[data-f]', el).forEach(x => x.setAttribute('aria-pressed', x === b));
        const key = frame === keyIdx; td.hidden = !key; flat.hidden = key;
        rng.disabled = !key; $$('.ar-layer-tabs button', el).forEach(x => x.disabled = !key);
        if (!key) { flat.src = o.seq[frame][0]; setOpen(0); rng.value = 0; $('.ar-read', el).innerHTML = `<span class="mono">${esc(o.seq[frame][1])}</span><h4>${['人物坐在砖墙前，顶光落下', '镜头上移，人物仍在右下', '', '窗口占满画面中央，人物退到下沿', '切到窗外的发射场，人物离开画面'][frame]}</h4><p>只有 ${esc(o.time)} 这一帧同时有前景人物、窗口和砖墙，可以拆层；回到该帧再拖动滑杆。</p>`; }
        else read();
        tc.textContent = o.seq[frame][1];
      }));
      setOpen(0); read();
    }
  };

  /* =================================================================
     02 GAMEPLAY · loop + system map
     ================================================================= */
  M.artemisLoop = {
    html: (p, o) => shell('GAMEPLAY LOOP', `<div class="ar-loop">${tabbar(o.steps.map(s => `<b>${s.k}</b>${esc(s.t)}`), '玩法循环', 'ar-loop-tabs')}<div class="ar-loop-body"><figure class="ar-loop-shot"><img alt="" loading="lazy"><figcaption class="mono"></figcaption></figure><div class="ar-read" aria-live="polite"></div></div></div>`, '依据 HexSystem、BackpackSlot 与实机录屏整理。点上方三个按钮切换环节，画面是对应的实机截帧。'),
    init(el, p, o) {
      bindTabs(el, i => {
        const s = o.steps[i], im = $('.ar-loop-shot img', el);
        im.src = s.img; im.alt = s.h; $('.ar-loop-shot figcaption', el).textContent = s.tc;
        $('.ar-read', el).innerHTML = `<span class="mono">${esc(s.c)}</span><h4>${esc(s.h)}</h4><p>${esc(s.p)}</p>`;
      });
    }
  };

  M.artemisSystem = {
    html: (p, o) => {
      const pos = { INPUT: 'c1 r2', WORLD: 'c2 r2', STATE: 'c3 r1', BUILD: 'c3 r2', ENEMY: 'c3 r3', PRESENT: 'c4 r2' };
      const outs = k => o.edges.filter(e => e[0] === k).map(e => `${e[1]}：${e[2]}`).join(' · ');
      return shell('SYSTEM MAP / 6 RESPONSIBILITIES', `<div class="ar-sys"><svg class="ar-sys-lines" aria-hidden="true"></svg>${o.nodes.map((n, i) => `<button type="button" class="ar-sys-node ${pos[n.k]}" data-k="${n.k}" aria-pressed="${i === 0}"><span class="mono">0${i + 1} / ${n.k}</span><b>${esc(n.n)}</b><small>${esc(n.c)}</small><em class="mono">${esc(outs(n.k) || 'END')}</em></button>`).join('')}</div><div class="ar-sys-read ar-read" aria-live="polite"></div>`, '');
    },
    init(el, p, o) {
      const box = $('.ar-sys', el), sv = $('.ar-sys-lines', el), nodes = $$('.ar-sys-node', el);
      const by = Object.fromEntries(o.nodes.map(n => [n.k, n]));
      const draw = () => {
        const b = box.getBoundingClientRect();
        if (getComputedStyle(sv).display === 'none') return;
        sv.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`);
        const sel = $('.ar-sys-node[aria-pressed=true]', el)?.dataset.k;
        const R = k => { const r = $(`[data-k=${k}]`, box).getBoundingClientRect(); return { l: r.left - b.left, r: r.right - b.left, t: r.top - b.top, b: r.bottom - b.top, cx: (r.left + r.right) / 2 - b.left, cy: (r.top + r.bottom) / 2 - b.top }; };
        sv.innerHTML = '<defs><marker id="ar-arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" fill="currentColor"/></marker></defs>' + o.edges.map(([a, c, t]) => {
          const A = R(a), C = R(c), hot = a === sel || c === sel;
          const x1 = A.r, y1 = A.cy, x2 = C.l, y2 = C.cy, mx = (x1 + x2) / 2;
          return `<path class="${hot ? 'hot' : ''}" d="M${x1} ${y1}C${mx} ${y1} ${mx} ${y2} ${x2 - 2} ${y2}" marker-end="url(#ar-arr)"/><text x="${mx}" y="${(y1 + y2) / 2 - 6}" text-anchor="middle" class="${hot ? 'hot' : ''}">${esc(t)}</text>`;
        }).join('');
      };
      const show = k => {
        nodes.forEach(n => n.setAttribute('aria-pressed', n.dataset.k === k));
        const n = by[k]; $('.ar-sys-read', el).innerHTML = `<span class="mono">${n.k}</span><h4>${esc(n.n)}</h4><p>${esc(n.p)}</p><code>${esc(n.code)}</code>`;
        draw();
      };
      nodes.forEach(n => n.addEventListener('click', () => show(n.dataset.k)));
      new ResizeObserver(draw).observe(box); show(o.nodes[0].k);
    }
  };

  /* =================================================================
     03 HEX × BACKPACK
     ================================================================= */
  const PACK0 = () => ({
    '0,0': { im: 'slot-power', nm: '动力根槽', e: ['Exit', 'None', 'Exit', 'None', 'None', 'None'] },
    '0,1': { im: 'accelerate-level1', nm: '加速', e: ['Exit', 'None', 'None', 'Entrance', 'None', 'None'] },
    '0,2': { im: '1bullet-level1', nm: '一发子弹', e: ['None', 'None', 'None', 'Entrance', 'None', 'None'] },
    '1,-1': { im: 'power-level1', nm: '增幅', e: ['None', 'None', 'Exit', 'None', 'None', 'Entrance'] },
    '2,-2': { im: 'target-level1', nm: '瞄准', e: ['None', 'None', 'None', 'None', 'None', 'Entrance'] }
  });
  M.artemisHexDual = {
    html: () => shell('ONE HEX GRID / TWO USES', `<div class="ar-dual">
      <section class="ar-dual-map"><h3><b>A</b>地块<small class="mono">MapCell · 点格子，主角沿六邻格走</small></h3><div class="ar-hex-svg" data-hex="map"></div></section>
      <section class="ar-dual-pack"><h3><b>B</b>背包<small class="mono">PackCell · 点零件，再转动它的出口</small></h3><div class="ar-hex-svg" data-hex="pack"></div></section>
    </div>
    <div class="ar-dual-bar"><div class="ar-read" role="status" aria-live="polite"></div><div class="ar-dual-btns"><button type="button" data-do="rot">转动选中零件 60°</button><button type="button" data-do="reset">还原</button></div></div>
    <ol class="ar-dirs">${DIRS.map((d, i) => `<li><b>${i}</b><span>${DN[i]}</span><i class="mono">(${d[0] > 0 ? '+' : ''}${d[0]}, ${d[1] > 0 ? '+' : ''}${d[1]})</i></li>`).join('')}</ol>`,
      '', 'ar-module-wide'),
    init(el) {
      const R = 34, RAD = 2, cells = hcells(RAD), WALL = new Set(['0,0', '-1,1', '1,0']), START = [-2, 1];
      let sel = [0, 0], token = START.slice(), path = new Set(), pack = PACK0(), timer = null, say = '';
      const nbOf = (c) => new Map(DIRS.map(([dq, dr], i) => [K(c[0] + dq, c[1] + dr), i]));
      const inRegion = c => Math.abs(c[0]) <= RAD && Math.abs(c[1]) <= RAD && Math.abs(c[0] + c[1]) <= RAD;
      const VB = '-150 -140 300 280';
      const drawMap = () => {
        const nb = nbOf(sel); let g = '';
        cells.forEach(([q, r]) => {
          const [x, y] = hxy(q, r, R), k = K(q, r), cls = ['hx', WALL.has(k) ? 'wall' : '', path.has(k) ? 'path' : '', k === K(...sel) ? 'sel' : '', nb.has(k) ? 'nb' : ''].join(' ');
          g += `<g class="${cls}" data-q="${q}" data-r="${r}" tabindex="0" role="button" aria-label="地块 ${q},${r}${WALL.has(k) ? ' 墙' : ''}"><polygon points="${polygon(x, y, R - 2)}"/>${nb.has(k) ? `<text x="${x}" y="${y + 5}" text-anchor="middle">${nb.get(k)}</text>` : ''}</g>`;
        });
        const [tx, ty] = hxy(...token, R);
        g += `<g class="tok"><circle cx="${tx}" cy="${ty}" r="11"/><circle cx="${tx}" cy="${ty}" r="4"/></g>`;
        $('[data-hex=map]', el).innerHTML = svg('地块六边形', '五乘五的六边形地块，深色为墙，圆点为主角，蓝色为路径。', g, VB);
      };
      const edgeMark = (x, y, d, type) => {
        const [vx, vy] = hxy(...DIRS[d], R), mx = x + vx * .47, my = y + vy * .47, a = Math.atan2(vy, vx) * 180 / Math.PI;
        const dia = `M-7 0L0 -5L7 0L0 5Z`;
        return `<path transform="translate(${mx.toFixed(1)} ${my.toFixed(1)}) rotate(${a.toFixed(0)})" d="${dia}" class="eg ${type.toLowerCase()}"/>`;
      };
      const drawPack = () => {
        const nb = nbOf(sel); let g = '', links = '';
        cells.forEach(([q, r]) => {
          const [x, y] = hxy(q, r, R), k = K(q, r), pc = pack[k], isSel = k === K(...sel);
          g += `<g class="hx pk ${pc ? 'has' : ''} ${isSel ? 'sel' : ''} ${nb.has(k) ? 'nb' : ''}" data-q="${q}" data-r="${r}" tabindex="0" role="button" aria-label="背包槽 ${q},${r}${pc ? ' ' + pc.nm : ' 空'}">`;
          g += pc ? `<polygon points="${polygon(x, y, R - 2)}"/><image href="${ic(pc.im)}" x="${x - 21}" y="${y - 21}" width="42" height="42"/>${pc.e.map((t, d) => t === 'None' ? '' : edgeMark(x, y, d, t)).join('')}` : `<polygon class="empty" points="${polygon(x, y, 10)}"/>${nb.has(k) ? `<text x="${x}" y="${y + 5}" text-anchor="middle">${nb.get(k)}</text>` : ''}`;
          g += '</g>';
          if (pc) pc.e.forEach((t, d) => {
            if (t !== 'Exit' && t !== 'Both') return;
            const nq = q + DIRS[d][0], nr = r + DIRS[d][1], nk = K(nq, nr), nc = pack[nk], [nx, ny] = hxy(nq, nr, R);
            const ok = nc && ['Entrance', 'Both'].includes(nc.e[(d + 3) % 6]);
            links += ok ? `<path class="lk ok" d="M${x} ${y}L${nx} ${ny}"/>` : `<path class="lk no" d="M${x} ${y}L${(x + (nx - x) * .55).toFixed(1)} ${(y + (ny - y) * .55).toFixed(1)}"/>`;
          });
        });
        $('[data-hex=pack]', el).innerHTML = svg('背包六边形', '背包槽位与零件。菱形是边上的连接口，实心为出口，空心为入口。', `<g>${links}</g>${g}`, VB);
      };
      const readout = () => {
        const [q, r] = sel, k = K(q, r), nb = DIRS.map(([dq, dr], i) => `${i} ${DN[i]} → (${q + dq}, ${r + dr})`);
        const pc = pack[k];
        const conn = Object.entries(pack).flatMap(([ck, c]) => { const [cq, cr] = ck.split(',').map(Number); return c.e.map((t, d) => { if (t !== 'Exit' && t !== 'Both') return null; const n = pack[K(cq + DIRS[d][0], cr + DIRS[d][1])]; return n && ['Entrance', 'Both'].includes(n.e[(d + 3) % 6]) ? 1 : 0; }).filter(v => v !== null); });
        $('.ar-read', el).innerHTML = `<span class="mono">SELECT (${q}, ${r}) · 地块：${WALL.has(k) ? '墙' : '地面'} · 背包：${pc ? esc(pc.nm) : '空槽'}</span><p>${say || (pc ? `出口边对上相邻零件的入口边才连通。当前 ${conn.filter(Boolean).length} 条连通、${conn.filter(v => !v).length} 个出口落空。` : '六个相邻格编号 0 到 5，地块和背包使用同一张方向表。')}</p><p class="mono ar-nbs">${nb.join('　')}</p>`;
        $('[data-do=rot]', el).disabled = !pc;
      };
      const draw = () => { drawMap(); drawPack(); readout(); };
      const select = c => { sel = c; say = ''; draw(); };
      el.addEventListener('click', e => {
        const g = e.target.closest('[data-q]'); if (!g) return;
        const c = [+g.dataset.q, +g.dataset.r], isMap = !!g.closest('[data-hex=map]');
        if (isMap) {
          if (WALL.has(K(...c))) { sel = c; say = `(${c[0]}, ${c[1]}) 是墙，不可走。`; draw(); return; }
          const p = bfs(token, c, n => inRegion(n) && !WALL.has(K(...n)));
          sel = c; say = ''; if (!p) { say = '走不到：被墙隔开。'; draw(); return; }
          clearInterval(timer); let i = 0; path = new Set(p.map(x => K(...x)));
          say = `SetHexPath · ${p.length - 1} 步，沿六邻格走过去。`; draw();
          timer = setInterval(() => { i++; if (i >= p.length) { clearInterval(timer); path = new Set(); token = c; say = ''; draw(); return; } token = p[i]; drawMap(); }, 130);
        } else select(c);
      });
      el.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest?.('[data-q]')) { e.preventDefault(); e.target.closest('[data-q]').dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
      $('[data-do=rot]', el).addEventListener('click', () => { const pc = pack[K(...sel)]; if (!pc) return; pc.e.unshift(pc.e.pop()); say = ''; draw(); });
      $('[data-do=reset]', el).addEventListener('click', () => { clearInterval(timer); pack = PACK0(); token = START.slice(); path = new Set(); sel = [0, 0]; say = ''; draw(); });
      draw();
    }
  };

  M.artemisHexShots = {
    html: (p, o) => `<div class="ar-shots" data-noeva>${['map', 'pack'].map((k, i) => `<figure class="ar-shot ar-shot-${k}"><div class="ar-shot-img"><img src="${esc(o[k][0])}" alt="${esc(o[k][1])}" loading="lazy"><i class="ar-shot-no mono">${i ? 'B' : 'A'}</i></div><figcaption><b class="mono">${esc(o[k][1])}</b><span>${esc(o[k][2])}</span></figcaption></figure>`).join('')}</div>`
  };

  /* ---------- build tree ---------- */
  const buildNodes = [
    { x: 82, y: 220, name: '根槽位', im: 'slot-power', cost: 2, parent: -1 },
    { x: 286, y: 104, name: '加速分支', im: 'accelerate-level1', cost: 1, parent: 0 },
    { x: 286, y: 336, name: '增幅分支', im: 'power-level1', cost: 2, parent: 0 },
    { x: 490, y: 104, name: '弹丸输出', im: '1bullet-level1', cost: 3, parent: 1 },
    { x: 490, y: 336, name: '目标修饰', im: 'target-level1', cost: 2, parent: 2 }
  ];
  M.artemisBuild = {
    html: () => shell('BACKPACK / ROOT → NEIGHBOR → EFFECT', `<p class="ar-example mono">执行示例 · 5 个槽位 · 耗能 2 / 1 / 2 / 3 / 2 为示例值</p><div class="ar-build-grid"><div class="ar-build-svg"></div><div class="ar-build-controls"><label>示例初始能量 <output>8</output><input type="range" min="0" max="12" value="8" aria-label="示例初始能量"></label><button type="button" data-build="start">左键 · 启动根节点</button><button type="button" data-build="next">右键 · 推进下一层</button><button type="button" data-build="reset">重置</button><p class="ar-build-status" role="status">等待启动。</p><p class="ar-legend">● 已执行　○ 等待　× 分支停止</p><dl><dt>连接条件</dt><dd>出口边 → 相邻入口边</dd><dt>分支数据</dt><dd>outgoingModifier.Clone()</dd></dl></div></div><table class="ar-build-table"><caption>各槽位的示例能量与执行状态</caption><thead><tr><th>槽位</th><th>耗能</th><th>剩余</th><th>状态</th></tr></thead><tbody></tbody></table>`, ''),
    init(el) {
      let depth = -1, states = Array(5).fill('wait'), energy = Array(5).fill(null);
      const r = $('input', el), status = $('.ar-build-status', el);
      const paint = () => {
        let g = '<g fill="none" stroke="#5aaeff" stroke-width="2.5">';
        buildNodes.forEach(n => { if (n.parent < 0) return; const p = buildNodes[n.parent]; g += `<path d="M${p.x + 46} ${p.y}L${n.x - 46} ${n.y}"/>`; }); g += '</g>';
        buildNodes.forEach((n, i) => {
          const st = states[i], fill = st === 'done' ? '#1f3bff' : st === 'stop' ? '#394058' : '#0a1240';
          g += `<g data-slot="${i}" data-state="${st}"><polygon points="${polygon(n.x, n.y, 57)}" fill="${fill}" stroke="${st === 'done' ? '#5aaeff' : '#d6e4ff'}" stroke-width="2"/><image href="${ic(n.im)}" x="${n.x - 38}" y="${n.y - 38}" width="76" height="76"/><text x="${n.x}" y="${n.y + 78}" text-anchor="middle" fill="currentColor" font-size="15">${n.name}</text><text x="${n.x}" y="${n.y + 99}" text-anchor="middle" fill="currentColor" opacity=".75" font-size="12">${st === 'done' ? '● 剩余 ' + energy[i] : st === 'stop' ? '× 停止' : '○ 等待'} / 耗能 ${n.cost}</text></g>`;
        });
        $('.ar-build-svg', el).innerHTML = svg('背包构筑分支执行示例', '根槽位分出加速和增幅分支；每个子节点取得独立数据副本。', g, '0 0 580 460');
        $('tbody', el).innerHTML = buildNodes.map((n, i) => `<tr><th>${n.name}</th><td>${n.cost}</td><td>${energy[i] ?? '—'}</td><td>${{ wait: '等待', done: '已执行', stop: '分支停止' }[states[i]]}</td></tr>`).join('');
      };
      const reset = () => { depth = -1; states.fill('wait'); energy.fill(null); status.textContent = '等待启动。每条分支读取自己的能量副本。'; paint(); };
      const run = l => {
        [[0], [1, 2], [3, 4]][l].forEach(i => {
          const n = buildNodes[i], p = n.parent, available = p < 0 ? +r.value : energy[p];
          if ((p >= 0 && states[p] !== 'done') || available < n.cost) { states[i] = 'stop'; return; }
          energy[i] = available - n.cost; states[i] = 'done';
        });
        status.textContent = `第 ${l + 1} 层完成：${states.filter(x => x === 'done').length} 个已执行，${states.filter(x => x === 'stop').length} 个停止。${l < 2 ? '可推进下一层。' : '所有层级已检查。'}`; paint();
      };
      r.addEventListener('input', () => { $('output', el).textContent = r.value; reset(); });
      $('[data-build=start]', el).addEventListener('click', () => { reset(); depth = 0; run(depth); });
      $('[data-build=next]', el).addEventListener('click', () => { if (depth < 0) { status.textContent = '需要先启动根节点。'; return; } if (depth >= 2) { status.textContent = '所有层级已检查，可重置或改变示例能量。'; return; } run(++depth); });
      $('[data-build=reset]', el).addEventListener('click', reset); paint();
    }
  };

  /* ---------- parts atlas: project icons and slot logos ---------- */
  const SLOTS = [['slot-power', '动力槽', '能量从这里进入，构筑树的根。'], ['slot-shoot', '发射槽', '修饰数据在这里交给武器。'], ['slot-split', '分流槽', '一个入口接出两条分支。'], ['slot-slot', '空槽', '没有零件的格子。']];
  const FAM = [
    { id: 'accelerate', n: '加速', g: 'A', d: '流星拖尾的星形图标。StatModifierItem 类，修改弹道速度一类的数值。' },
    { id: 'power', n: '增幅', g: 'A', d: '闪电图标。StatModifierItem 类，修改伤害一类的数值。' },
    { id: '1bullet', n: '单发', g: 'A', d: '一枚子弹。增加弹数的字段是 addBulletCount。' },
    { id: '2bullet', n: '双发', g: 'A', d: '两枚子弹，同一字段取更大的值。' },
    { id: '3bullet', n: '三发', g: 'A', d: '三枚子弹，同一字段取更大的值。' },
    { id: 'teleport', n: '传送', g: 'B', d: '靶心加箭头。TeleportItem：子弹落点附近的地块成为主角的落脚点，PlayerMovement.TeleportPlayerTo 执行。' },
    { id: 'target', n: '瞄准', g: 'C', d: '准星图标。命名取自图标文件，工程里没有单独的脚本类。' },
    { id: 'turbo', n: '涡轮', g: 'C', d: '风扇图标，同上。' },
    { id: 'the-world', n: '时计', g: 'C', d: '怀表图标，同上。' }
  ];
  M.artemisParts = {
    html: () => shell('ICON ATLAS / LOGOS + PARTS', `<div class="ar-parts">
      <div class="ar-parts-slots"><h3>槽位 logo</h3><ul>${SLOTS.map(([f, n, d]) => `<li><img src="${ic(f)}" alt="${n}" loading="lazy"><b>${n}</b><span>${d}</span></li>`).join('')}</ul></div>
      <div class="ar-parts-main"><div class="ar-parts-head"><h3>零件图标</h3>${tabbar(['LV 1', 'LV 2', 'LV 3'], '零件等级', 'ar-level-tabs')}</div>
      <ul class="ar-parts-grid">${FAM.map((f, i) => `<li><button type="button" data-fam="${i}" aria-pressed="${i === 0}"><img alt="${f.n}" loading="lazy"><b>${f.n}</b><i class="mono">${f.g === 'A' ? 'StatModifier' : f.g === 'B' ? 'Teleport' : 'Prefab'}</i></button></li>`).join('')}</ul>
      <div class="ar-read" aria-live="polite"></div></div></div>`, '图标与槽位 logo 来自项目素材。等级越高边框越亮；分类按工程里的脚本类划分，三个未单列脚本的图标只按画面命名。', 'ar-module-wide'),
    init(el) {
      let lv = 1, cur = 0;
      const paint = () => {
        $$('.ar-parts-grid img', el).forEach((im, i) => { const f = FAM[i]; im.src = ic(`${f.id}-level${lv}`); });
        const f = FAM[cur];
        $('.ar-read', el).innerHTML = `<div class="ar-parts-big">${[1, 2, 3].map(l => `<img src="${ic(`${f.id}-level${l}`)}" alt="${f.n} LV${l}" class="${l === lv ? 'on' : ''}">`).join('')}</div><div><span class="mono">${f.id.toUpperCase()} / ${f.g === 'A' ? 'StatModifierItem' : f.g === 'B' ? 'TeleportItem' : 'PREFAB'}</span><h4>${f.n}</h4><p>${esc(f.d)}</p></div>`;
        $$('[data-fam]', el).forEach((b, i) => b.setAttribute('aria-pressed', i === cur));
      };
      bindTabs(el, i => { lv = i + 1; paint(); }, $('.ar-level-tabs', el));
      $$('[data-fam]', el).forEach(b => b.addEventListener('click', () => { cur = +b.dataset.fam; paint(); }));
    }
  };

  /* =================================================================
     04 STATE MACHINE (kept as the single movement-chain explanation)
     ================================================================= */
  M.artemisStates = {
    html: (p, o) => shell('PLAYER / MOVEMENT STATE', `${tabbar(o.states.map(x => `<b>${x.k}</b>${x.t}`), '移动状态详情', 'ar-state-tabs')}<div class="ar-state-panel"><ol class="ar-state-chain">${o.states.map((s, i) => `<li data-state-node="${i}"><span class="mono">${s.k}</span><b>${s.t}</b><small>${['有效路径 / SetHexPath', '起步动画 / OnEnd', '最后目标到达', '停步动画 / OnEnd'][i]}</small></li>`).join('')}</ol><p class="ar-return mono">END → IDLE / OnEnd　·　LOOP 继续取点 / 距离 &lt; 0.4 世界单位</p><div class="ar-read" aria-live="polite"></div></div>`, '移动主链重绘；跳跃、攀爬、落地分支未画出。'),
    init(el, p, o) { bindTabs(el, i => { const s = o.states[i]; $$('[data-state-node]', el).forEach((n, j) => n.classList.toggle('on', j === i)); $('.ar-read', el).innerHTML = `<h4>${esc(s.cls)}</h4><dl>${[['进入', s.enter], ['执行', s.run], ['离开', s.exit]].map(([t, v]) => `<dt>${t}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`; }); }
  };

  /* =================================================================
     05 CHARACTERS · enemy labs
     ================================================================= */
  const E1 = { transform: .3, detect: 10, melee: 2, shoot: [5, 15] };
  M.artemisElite1 = {
    html: () => shell('ELITE 01 / DECISION LAB', `<div class="ar-lab">
      <div class="ar-lab-ctl">
        <label>血量 <output data-o="hp">100</output>%<input type="range" data-i="hp" min="0" max="100" value="100" aria-label="精英一血量百分比"><i class="ar-mark" style="left:30%"></i></label>
        <label>与玩家距离 <output data-o="dist">12</output> m<input type="range" data-i="dist" min="0" max="20" step="0.5" value="12" aria-label="与玩家距离"></label>
        <label class="ar-chk"><input type="checkbox" data-i="ammo" checked>弹匣里有弹</label>
        <div class="ar-lab-btns"><button type="button" data-do="finish">变身动画播完</button><button type="button" data-do="reset">重置</button></div>
      </div>
      <ol class="ar-lab-states">${[['IDLE', '待机', 'Elite1IdleState'], ['TRANSFORM', '变身', 'Elite1TransformState'], ['ATTACK', '近战', 'Elite1AttackState'], ['SHOOT IDLE', '射击待机', 'Elite1ShootIdleState'], ['RELOAD', '换弹', 'Elite1ReloadState'], ['CHASE', '追击', 'Elite1ChaseState']].map(([k, t, c]) => `<li data-s="${k}"><span class="mono">${k}</span><b>${t}</b><small>${c}</small></li>`).join('')}</ol>
      <div class="ar-read" role="status" aria-live="polite"></div>
      <dl class="ar-flags"><div><dt>hasTriggeredTransform</dt><dd data-f="trig">false</dd></div><div><dt>isTransformed</dt><dd data-f="done">false</dd></div><div><dt>isInvulnerable</dt><dd data-f="inv">false</dd></div><div><dt>shield</dt><dd data-f="shield">off</dd></div></dl>
    </div>`, '血量门槛 0.3、检测 10 m、近战 2 m、射击窗口 5 至 15 m 为工程默认值；决策顺序依据 Elite1IdleState，冷却与随机项省略。'),
    init(el) {
      const st = { hp: 100, dist: 12, ammo: true, trig: false, done: false };
      const out = () => { const m = { hp: st.hp, dist: st.dist }; Object.entries(m).forEach(([k, v]) => $(`[data-o=${k}]`, el).textContent = v); };
      const decide = () => {
        if (st.trig && !st.done) return ['TRANSFORM', '变身期间：关闭移动、开启无敌，播放变身动画。播完之后才会重新选择动作。'];
        if (st.dist > E1.detect) return ['IDLE', `距离 ${st.dist} m 超出检测范围 ${E1.detect} m，保持待机。`];
        if (st.dist <= E1.melee) return ['ATTACK', `距离 ${st.dist} m 在近战范围 ${E1.melee} m 内，优先近战。`];
        if (st.done && st.dist >= E1.shoot[0] && st.dist <= E1.shoot[1]) return st.ammo ? ['SHOOT IDLE', '已变身且处在 5 至 15 m 的射击窗口，进入射击待机。'] : ['RELOAD', '射击窗口内弹匣已空，先换弹。'];
        return ['CHASE', st.done ? '距离不在射击窗口，向玩家追击。' : '尚未变身，不会射击，向玩家追击。'];
      };
      const paint = () => {
        const [s, why] = decide();
        $$('[data-s]', el).forEach(n => n.classList.toggle('on', n.dataset.s === s));
        $('.ar-read', el).innerHTML = `<span class="mono">NOW / ${s}</span><p>${why}</p>`;
        $('[data-f=trig]', el).textContent = st.trig; $('[data-f=done]', el).textContent = st.done;
        $('[data-f=inv]', el).textContent = st.trig && !st.done; $('[data-f=shield]', el).textContent = st.done ? 'on' : 'off';
        $('[data-do=finish]', el).disabled = !(st.trig && !st.done); out();
      };
      $('[data-i=hp]', el).addEventListener('input', e => { st.hp = +e.target.value; if (st.hp / 100 <= E1.transform && !st.trig) st.trig = true; paint(); });
      $('[data-i=dist]', el).addEventListener('input', e => { st.dist = +e.target.value; paint(); });
      $('[data-i=ammo]', el).addEventListener('change', e => { st.ammo = e.target.checked; paint(); });
      $('[data-do=finish]', el).addEventListener('click', () => { st.done = true; paint(); });
      $('[data-do=reset]', el).addEventListener('click', () => { Object.assign(st, { hp: 100, dist: 12, ammo: true, trig: false, done: false }); $('[data-i=hp]', el).value = 100; $('[data-i=dist]', el).value = 12; $('[data-i=ammo]', el).checked = true; paint(); });
      paint();
    }
  };

  M.artemisElite2 = {
    html: () => shell('ELITE 02 / HOOK LAB', `<div class="ar-lab ar-hook">
      <div class="ar-hook-board"><div class="ar-hex-svg"></div></div>
      <div class="ar-hook-side">
        <ol class="ar-steps"><li data-p="1"><b>01</b>前摇<small>0.25 s · 缓存射线格子并亮起</small></li><li data-p="2"><b>02</b>核对<small>只看缓存格里还有没有玩家</small></li><li data-p="3"><b>03</b>后摇<small>0.25 s · 清理预警回到追击</small></li></ol>
        <div class="ar-lab-btns"><button type="button" data-do="start">发现玩家 · 进入钩爪</button><button type="button" data-do="resolve" disabled>前摇结束 · 核对</button><button type="button" data-do="recover" disabled>后摇结束 · 清理</button><button type="button" data-do="reset">重置</button></div>
        <div class="ar-read" role="status" aria-live="polite"></div>
      </div></div>`, '时长为 Elite2SO 的默认值（前摇 0.25 s、后摇 0.25 s、冷却 4 s、触发距离 5 至 10 m）；格子与距离为示意。前摇期间可以点棋盘移动玩家。'),
    init(el) {
      const R = 24, RAD = 3, cells = hcells(RAD), E = [-3, 0], P0 = [2, 0];
      let player = P0.slice(), cached = null, phase = 0, res = null;
      const board = $('.ar-hex-svg', el), read = $('.ar-read', el), B = n => $(`[data-do=${n}]`, el);
      const COLOR = { 1: 'wind', 2: 'hit', 3: 'rec' };
      const draw = () => {
        let g = '';
        cells.forEach(([q, r]) => {
          const [x, y] = hxy(q, r, R), k = K(q, r), inRay = cached && cached.some(c => K(...c) === k);
          g += `<g class="hx ${inRay ? 'ray ' + COLOR[phase] : ''}" data-q="${q}" data-r="${r}" tabindex="0" role="button" aria-label="格 ${q},${r}"><polygon points="${polygon(x, y, R - 1.5)}"/></g>`;
        });
        const [ex, ey] = hxy(...E, R), [px, py] = hxy(...player, R);
        g += `<rect class="en" x="${ex - 11}" y="${ey - 11}" width="22" height="22"/><text x="${ex}" y="${ey + 34}" text-anchor="middle" class="lb">精英二</text><circle class="pl" cx="${px}" cy="${py}" r="10"/><text x="${px}" y="${py - 18}" text-anchor="middle" class="lb">玩家</text>`;
        board.innerHTML = svg('精英二钩爪预警与判定', '方形为敌人，圆形为玩家；黄色、红色、蓝灰色六边形是缓存的射线格子在前摇、判定与后摇阶段的颜色。', g, '-170 -125 340 250');
        $$('.ar-steps li', el).forEach(li => li.classList.toggle('on', +li.dataset.p === phase));
      };
      const say = h => read.innerHTML = h;
      const reset = () => { player = P0.slice(); cached = null; phase = 0; res = null; B('start').disabled = false; B('resolve').disabled = true; B('recover').disabled = true; say('<span class="mono">IDLE</span><p>精英二发现玩家后，先看近战，再看玩家是否在钩爪距离内、冷却是否结束。条件满足时进入钩爪状态。</p>'); draw(); };
      B('start').addEventListener('click', () => { phase = 1; cached = hline(E, player).slice(1); B('start').disabled = true; B('resolve').disabled = false; say(`<span class="mono">WINDUP · _warnCells = ${cached.length} cells</span><p>停止移动、转向玩家，缓存从敌人到玩家的 ${cached.length} 个格子并亮黄。现在点棋盘上的别处，让玩家离开这一排格子。</p>`); draw(); });
      B('resolve').addEventListener('click', () => { phase = 2; const hit = cached.some(c => K(...c) === K(...player)); res = hit; if (hit) { player = cached[0].slice(); } B('resolve').disabled = true; B('recover').disabled = false; say(hit ? '<span class="mono">HIT · IsPlayerInCells = true</span><p>玩家还在缓存的格子里，格子变红，PullPlayerToMe 把玩家拉到敌人身边。</p>' : '<span class="mono">MISS · IsPlayerInCells = false</span><p>玩家已经离开缓存的格子，格子变红但没有拉拽，这一钩落空。</p>'); draw(); });
      B('recover').addEventListener('click', () => { phase = 3; B('recover').disabled = true; say('<span class="mono">RECOVER → CHASE</span><p>格子变成蓝灰色，等后摇结束后 ClearHexTelegraph 清掉预警，状态回到追击。中途被打断时 OnExit 同样清理预警、协程和缓存。</p>'); draw(); setTimeout(() => { if (phase === 3) { cached = null; draw(); } }, 700); });
      B('reset').addEventListener('click', reset);
      board.addEventListener('click', e => { const g = e.target.closest('[data-q]'); if (!g) return; const c = [+g.dataset.q, +g.dataset.r]; if (K(...c) === K(...E)) return; if (phase === 0 || phase === 1) { player = c; draw(); } });
      reset();
    }
  };

  M.artemisBoss = {
    html: (p, o) => shell('BOSS ENCOUNTERS / 3D', `<div class="ar-boss">
      <figure class="ar-boss-1"><div class="ar-boss-img"><img src="${/^assets\//.test(o.boss1[0]) ? esc(o.boss1[0]) : 'assets/' + esc(o.boss1[0]) + '.webp'}" alt="${esc(o.boss1[1])} 战斗画面" loading="lazy"><i class="ar-boss-no">01</i></div><figcaption><b class="mono">${esc(o.boss1[1])}</b><span>${esc(o.boss1[2])}</span></figcaption></figure>
      <figure class="ar-boss-2"><div class="ar-boss-img"><img src="${esc(o.boss2[0][0])}" alt="" loading="lazy"><i class="ar-boss-no">02</i></div><figcaption><b class="mono">Boss 二</b><span class="ar-boss-cap"></span></figcaption>${tabbar(o.boss2.map(f => esc(f[1])), 'Boss 二的三个镜头', 'ar-boss-tabs')}</figure>
    </div>`, ''),
    init(el, p, o) { bindTabs(el, i => { const f = o.boss2[i], im = $('.ar-boss-2 img', el); im.src = f[0]; im.alt = f[2]; $('.ar-boss-cap', el).textContent = f[2]; }); }
  };

  /* =================================================================
     06 UI inspector (numbered pins)
     ================================================================= */
  M.artemisUI = {
    html: () => shell('UI / THREE READING LEVELS', `${tabbar(['<b>01</b>地图 HUD', '<b>02</b>背包', '<b>03</b>主菜单'], '游戏界面', 'ar-ui-tabs')}<div class="ar-ui"><figure class="ar-ui-screen"><div class="ar-ui-frame"></div><figcaption class="mono"></figcaption></figure><div class="ar-ui-side"><ol class="ar-pins"></ol><div class="ar-read" aria-live="polite"></div></div></div>`, ''),
    init(el) {
      const V = [
        ['assets/artemis/ui-hud.webp', '00:46 / MAP HUD', '地图 HUD', [
          [9, 11, '左上 · 背包缩略', '背包的六边形槽位缩成一块，随时能看到当前组合。'],
          [13, 20, '红线与白球', '一条红线串着白球，横贯左上，作为状态读数。'],
          [55, 47, '黄红六边形', '一排黄色接着红色的六边形，是敌人射线预警的格子。'],
          [88, 41, '粉红圆点', '目标标记，落在场地边缘的角色位置上。'],
          [6, 88, '左下读数', '双色指针叠在圆盘上，是角色状态的读数。']]],
        ['assets/artemis/ui-backpack.webp', '实机 / BACKPACK', '背包', [
          [19, 21, '标题', 'BACKPACK 位于左上，细字压在曲线旁边。'],
          [42, 29, '空槽', '小六边形是空槽，红点在中央。'],
          [38, 44, '已放零件', '大六边形是放进去的零件，六个边上的白色菱形是连接口。'],
          [84, 52, '说明面板', '右侧面板显示选中零件的名称、按键提示与效果。'],
          [6, 90, '状态读数', '与地图 HUD 同一个读数，切换界面后位置不变。']]],
        ['assets/artemis/gameplay-menu.webp', '00:03 / MAIN MENU', '主菜单', [
          [50, 33, '发射场', '火箭在升空，背景是完整的绘制插画。'],
          [50, 75, '分界线', '一条橙色横线把画面切成插画和菜单两半。'],
          [50, 90, '按钮', 'START、OPTION、QUIT 竖排，居中放在下半部。']]]
      ];
      const frame = $('.ar-ui-frame', el), list = $('.ar-pins', el), read = $('.ar-read', el);
      let cur = 0, pin = 0;
      const sel = i => { if (!V[cur][3][i]) return; pin = i; $$('.ar-pin', frame).forEach((b, j) => b.classList.toggle('on', j === i)); $$('li', list).forEach((b, j) => b.classList.toggle('on', j === i)); const [, , t, d] = V[cur][3][i]; read.innerHTML = `<span class="mono">PIN 0${i + 1}</span><h4>${t}</h4><p>${d}</p>`; };
      bindTabs(el, i => {
        cur = i; const [src, tc, h, pins] = V[i];
        frame.innerHTML = `<img src="${src}" alt="${h}" loading="lazy">${pins.map(([x, y], j) => `<button type="button" class="ar-pin" style="left:${x}%;top:${y}%" aria-label="标注 ${j + 1}：${pins[j][2]}">${j + 1}</button>`).join('')}`;
        $('figcaption', el).textContent = tc;
        list.innerHTML = pins.map((p, j) => `<li><button type="button" data-p="${j}"><b>${j + 1}</b>${p[2]}</button></li>`).join('');
        $$('.ar-pin', frame).forEach((b, j) => b.addEventListener('click', () => sel(j)));
        $$('[data-p]', list).forEach(b => b.addEventListener('click', () => sel(+b.dataset.p)));
        sel(0);
      }, $('.ar-ui-tabs', el));
    }
  };

  /* =================================================================
     07 CUTSCENE CG: big, obvious selector
     ================================================================= */
  M.artemisCG = {
    html: () => shell('CUTSCENE 01 / SELECT A CUT', `<div class="ar-cg"><figure class="ar-cg-screen"><img alt="" loading="lazy"><figcaption class="mono"></figcaption><button type="button" class="ar-cg-arrow prev" aria-label="上一幅">‹</button><button type="button" class="ar-cg-arrow next" aria-label="下一幅">›</button></figure><div class="ar-cg-pick"><p class="ar-cg-hint mono">▼ 选择画面 / CHOOSE</p>${tabbar(['<img src="assets/composition/artemis-cg-fracture.webp" alt=""><b>01</b><span>裂变</span>', '<img src="assets/composition/artemis-cg-tower.webp" alt=""><b>02</b><span>重建</span>', '<img src="assets/composition/artemis-cg-assembly.webp" alt=""><b>03</b><span>承诺</span>', '<img src="assets/composition/artemis-cg-laboratory.webp" alt=""><b>04</b><span>异议</span>'], '过场 CG', 'ar-cg-cards')}</div><div class="ar-read" aria-live="polite"></div></div>`, '四幅项目 CG 按过场一的叙事顺序排列。大图两侧的箭头与下方四张卡片都可以切换。'),
    init(el) {
      const cg = [['fracture', '月面裂变', '月面与碎块占据大幅画面，开场建立灾变尺度。'], ['tower', '重建的塔楼', '建筑的垂直线与近处的人物拉开尺度，视线沿塔楼上升。'], ['assembly', '集体的承诺', '前景群像包围中央的光，字幕与动态文字在这里承担叙述。'], ['laboratory', '实验室里的异议', '宇航员位于前景，实验室在身后展开，叙事由集体转向个人。']];
      let cur = 0;
      const pick = bindTabs(el, i => { cur = i; const [im, h, t] = cg[i], x = $('.ar-cg-screen img', el); x.src = `assets/composition/artemis-cg-${im}.webp`; x.alt = h; $('.ar-cg-screen figcaption', el).textContent = `CUTSCENE 01 / CG 0${i + 1}`; $('.ar-read', el).innerHTML = `<h4>${h}</h4><p>${t}</p>`; }, $('.ar-cg-cards', el));
      $('.prev', el).addEventListener('click', () => pick((cur + 3) % 4)); $('.next', el).addEventListener('click', () => pick((cur + 1) % 4));
    }
  };

  const tc = t => Math.floor(t / 60).toString().padStart(2, '0') + ':' + (t % 60).toFixed(Number.isInteger(t) ? 0 : 2).padStart(Number.isInteger(t) ? 2 : 5, '0');
  M.artemisFilms = {
    html: (p, o) => shell('FILM ROOM / SELECT A REEL', `<div class="ar-films"><div class="ar-film-main"><video controls playsinline preload="metadata" src="${esc(o.items[0].src)}" poster="${esc(o.items[0].poster)}" aria-label="Artemis 项目影片"></video><h3 class="ar-film-title">${esc(o.items[0].label)}</h3><p class="ar-film-desc">${esc(o.items[0].desc)}</p><p class="ar-film-status" role="status">选择影片或定位镜头；点击播放器播放。</p><div class="ar-marks" role="group" aria-label="影片时间点"></div></div><aside><p class="ar-cg-hint mono">▼ 选择影片 / REELS</p><div class="ar-tabs ar-reels" role="tablist" aria-label="选择影片">${o.items.map((it, i) => `<button type="button" role="tab" data-tab="${i}" id="artemis-reel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><b>0${i + 1}</b><span>${esc(it.label)}</span><small>${esc(it.len)} · ${esc(it.desc)}</small></button>`).join('')}</div><a class="ar-film-file" href="${esc(o.items[0].src)}" target="_blank" rel="noopener">独立打开当前影片 ↗</a></aside></div>`, ''),
    init(el, p, o) {
      const v = $('video', el), status = $('.ar-film-status', el); let cur = -1, pending = null;
      const seek = t => { pending = t; if (v.readyState >= 1) { v.currentTime = Math.min(t, Math.max(0, v.duration - .1)); pending = null; status.textContent = '已定位 ' + tc(t) + ' · 点击播放观看该镜头。'; } else status.textContent = '正在读取影片，随后定位 ' + tc(t) + '。'; };
      v.addEventListener('loadedmetadata', () => { if (pending !== null) seek(pending); });
      v.addEventListener('error', () => { status.textContent = '当前浏览器无法读取影片，可使用右侧链接独立打开。'; });
      bindTabs(el, i => {
        const it = o.items[i];
        if (cur !== i) { v.pause(); pending = null; v.src = it.src; v.poster = it.poster; v.load(); cur = i; }
        v.setAttribute('aria-label', it.label); $('.ar-film-title', el).textContent = it.label; $('.ar-film-desc', el).textContent = it.desc;
        status.textContent = '已选择 ' + it.label + ' · 点击播放器播放。'; $('.ar-film-file', el).href = it.src;
        $('.ar-marks', el).innerHTML = it.marks.map(([t, l]) => `<button type="button" data-time="${t}"><b>${tc(t)}</b><span>${esc(l)}</span></button>`).join('');
        $$('[data-time]', el).forEach(b => b.addEventListener('click', () => { seek(+b.dataset.time); $$('[data-time]', el).forEach(x => x.setAttribute('aria-pressed', x === b)); }));
      }, $('.ar-reels', el));
    }
  };

  /* =================================================================
     page layouts
     ================================================================= */
  const block = (a, k, u, id) => {
    const i = a.blocks.findIndex(b => b.id === id);
    if (i < 0) throw new Error('Artemis missing content block: ' + a.id + '/' + id);
    const html = u.b(i);
    if (!html) throw new Error('Artemis unsupported block: ' + a.id + '/' + id);
    return `<div class="ar-block ar-block-${id}" data-artemis-block="${id}">${html}</div>`;
  };
  const all = (a, k, u) => a.blocks.map(b => block(a, k, u, b.id)).join('');
  const NO = { world: '01', architecture: '02', question: '03', logic: '04', combat: '05', ui: '06', films: '07' };
  const KANA = { world: 'セカイ', architecture: 'システム', question: 'ヘックス', logic: 'ステート', combat: 'キャラ', ui: 'インターフェース', films: 'ムービー' };
  const head = (a, k, rail) => `<header class="ar-act-head" data-noeva><span class="ar-act-no" aria-hidden="true">${NO[a.id] || ''}</span><span class="ar-act-kana" aria-hidden="true">${KANA[a.id] || ''}</span><p class="mono">${k.esc(a.kicker)}</p><h2>${k.md(a.title)}</h2><p class="ar-lead">${k.md(a.lead)}</p><span class="ar-act-rail" aria-hidden="true">${rail || a.id.toUpperCase()}</span></header>`;
  const bc = n => `<i class="a-bc" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<b style="--w:${1 + i * 7 % 3}"></b>`).join('')}</i>`;
  const stripe = '<div class="ar-stripe" aria-hidden="true"></div>';

  PG.artemis = {
    title(k) {
      const { p, s, esc } = k;
      return `<section class="ar-title" aria-labelledby="tc-name" data-noeva>
        <i class="at-hex at-hex1" aria-hidden="true"></i><i class="at-hex at-hex2" aria-hidden="true"></i><i class="at-slash" aria-hidden="true"></i>
        <p class="at-vert at-vert1" aria-hidden="true">アルテミス</p>
        <p class="at-vert at-vert2">月亮碎裂之后，我们仍然选择重返星海。</p>
        <a class="at-back mono" href="index.html#scene-${p.id}" data-cut="INDEX">← INDEX</a>
        <h1 class="at-name" id="tc-name"><span>ARTE</span><span>MIS</span></h1>
        <img class="at-fig" src="assets/composition/artemis-hero.webp" alt="探索者：工程装备与琥珀色面罩的宇航员" fetchpriority="high">
        <p class="at-front" aria-hidden="true">RETURN<br>TO THE<br>STARS</p>
        <div class="at-tag mono"><b>SC-${p.number}</b><span>${esc(s.stripB)}</span>${bc(36)}</div>
        <dl class="at-meta">${s.meta.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>
        ${stripe}
      </section>`;
    },
    logline(k) {
      const { s, esc, md } = k;
      return `<section class="ar-summary" data-noeva aria-label="项目摘要"><header><p class="mono">OPERATOR FILE / 05</p><h2>重返<br>星海</h2><span aria-hidden="true">05</span></header><div class="ar-summary-copy"><p>${md(s.logline.q)}</p><p>${md(s.logline.a)}</p><p>${md(s.logline.r)}</p></div><dl class="ar-summary-stats">${s.stats.map(([v, t]) => `<div><dd>${esc(v)}</dd><dt>${esc(t)}</dt></div>`).join('')}</dl></section>`;
    },
    act(a, i, k) { const u = k.use(a), fn = this['a_' + a.id]; return fn ? fn.call(this, a, k, u) : head(a, k) + `<div class="ar-body">${all(a, k, u)}</div>`; },
    a_world(a, k, u) {
      return `<div class="ar-world-open"><figure><img src="${k.src(a.open.img)}" alt="${k.esc(a.open.cap)}" loading="lazy"><figcaption class="mono">${k.esc(a.open.cap)}</figcaption></figure>${head(a, k, 'RETURN TO THE STARS')}</div><div class="ar-body ar-world-body">${all(a, k, u)}</div>`;
    },
    a_architecture(a, k, u) { return head(a, k, 'GAMEPLAY') + `<div class="ar-body ar-architecture">${all(a, k, u)}</div>`; },
    a_question(a, k, u) {
      const b = id => block(a, k, u, id);
      return head(a, k, 'HEX / BACKPACK') + `<div class="ar-hex-stage"><div class="ar-hex-3d">${k.stageEl(a.open.stage, {}, a.open.label)}</div><aside><p class="mono">A / MAP · 3D</p><h3>点一块地面</h3><p>${k.esc(a.open.cap)}</p><p class="mono">拖动旋转视角</p></aside></div><div class="ar-body">${b('hex-dual')}${b('hex-shots')}${b('build')}${b('parts')}${b('hex-source')}</div>`;
    },
    a_logic(a, k, u) { return head(a, k, 'STATE MACHINE') + `<div class="ar-body ar-logic">${all(a, k, u)}</div>`; },
    a_combat(a, k, u) {
      const b = id => block(a, k, u, id);
      return head(a, k, 'PERSONNEL / COMBAT') + `<div class="ar-body ar-combat-body">
        <article class="ar-personnel ar-player"><div class="ar-pers-head"><span class="mono">PLAYER</span><h3>探索者</h3></div><div class="ar-personnel-grid">${b('player-design')}${b('player-mechanism')}</div></article>
        <article class="ar-personnel ar-elite1"><div class="ar-pers-head"><span class="mono">ELITE 01</span><h3>精英一 · 重甲守卫</h3></div><div class="ar-personnel-grid">${b('elite1-design')}${b('elite1-rule')}</div>${b('elite1-lab')}${b('elite1-motion')}</article>
        <article class="ar-personnel ar-elite2"><div class="ar-pers-head"><span class="mono">ELITE 02</span><h3>精英二 · 钩爪机械</h3></div><div class="ar-personnel-grid">${b('elite2-design')}${b('elite2-rule')}</div>${b('elite2-lab')}</article>
        <article class="ar-personnel ar-bosses"><div class="ar-pers-head"><span class="mono">BOSS 01 / 02</span><h3>两场 Boss 战</h3></div>${b('boss-pair')}</article>
        ${b('combat-source')}</div>`;
    },
    a_ui(a, k, u) { return head(a, k, 'INTERFACE') + `<div class="ar-body">${all(a, k, u)}</div>`; },
    a_films(a, k, u) { return head(a, k, 'FILM ROOM') + `<div class="ar-body ar-films-body">${all(a, k, u)}</div>`; },
    after(main) {
      const scene = window.SCENES.artemis, expected = scene.acts.flatMap(a => a.blocks.map(b => b.id));
      const rendered = $$('[data-artemis-block]', main).map(el => el.dataset.artemisBlock);
      const missing = expected.filter(id => !rendered.includes(id)), duplicate = rendered.filter((id, i) => rendered.indexOf(id) !== i);
      main.dataset.artemisBlocks = rendered.length + '/' + expected.length;
      if (missing.length || duplicate.length) console.error('Artemis block contract', { missing, duplicate });
    }
  };
})();
