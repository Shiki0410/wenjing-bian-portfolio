/* VZ — charts drawn in code from the project data, in the page's own palette (CSS variables --cobalt / --sky /
   --ink / --pale / --sheet) and the EVA type system. Every chart is an SVG built at the container's real width,
   animates in once when it enters the view, and shows its values on hover / focus.
   Types: flow, range, stack, events, heat, bars, lines, hist, court, chain, crop, dots, matrix, donut, ci, scatter, pair,
   lanes, tier, seg, tones, duo, cols, states, layers, hex, braid, radial (with sliders), multi, cycle, route, blue, tiles. */
(() => {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const lin = (d0, d1, r0, r1) => v => r0 + (v - d0) / ((d1 - d0) || 1) * (r1 - r0);
  const f1 = v => (Math.round(v * 10) / 10).toString();
  const tipA = (h, b) => ` data-tip="${esc(h)}" data-tipb="${esc(b || '')}" tabindex="0"`;
  const glyph = (d, x, y, r, cls = '') => {
    if (d === 'a') return `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}"/>`;
    if (d === 'b') return `<rect class="${cls}" x="${x - r}" y="${y - r}" width="${2 * r}" height="${2 * r}"/>`;
    return `<rect class="${cls}" x="${x - r * .8}" y="${y - r * .8}" width="${1.6 * r}" height="${1.6 * r}" transform="rotate(45 ${x} ${y})"/>`;
  };
  const wrap = (t, n) => { const out = []; let s = String(t); while (s.length > n) { out.push(s.slice(0, n)); s = s.slice(n); } out.push(s); return out; };
  const T = {};

  /* left items → right items, links only say "goes with" */
  T.flow = (s, W) => {
    const L = s.left, R = s.right, n = Math.max(L.length, R.length), rh = s.rowH || 46, top = 34, H = top + n * rh + 10;
    const lx = W * .02, rx = W * .98, lw = W * (s.lw || .34), cx0 = lx + lw + 12, cx1 = rx - W * (s.rw || .2) - 12;
    const ly = i => top + (i + .5) * rh * n / L.length, ry = i => top + (i + .5) * rh * n / R.length;
    let g = `<text class="t-m" x="${lx}" y="16" font-size="10" opacity=".6">${esc(s.lt || '')}</text><text class="t-m" x="${rx}" y="16" font-size="10" opacity=".6" text-anchor="end">${esc(s.rt || '')}</text>`;
    s.links.forEach(([i, j, d], k) => { const y0 = ly(i), y1 = ry(j); g += `<path class="ln ${d ? '' : 'draw '}s1" data-l="${i}" data-r="${j}" d="M${cx0} ${y0}C${(cx0 + cx1) / 2} ${y0} ${(cx0 + cx1) / 2} ${y1} ${cx1} ${y1}" fill="none" stroke-width="${d ? 1.2 : 1.8}" ${d ? 'stroke-dasharray="4 5" opacity=".55"' : ''} style="--len:${W};transition-delay:${k * .05}s"/>`; });
    L.forEach((t, i) => { g += `<g class="nd hit" data-side="l" data-i="${i}"${tipA(t, s.ltips ? s.ltips[i] : '')}><text x="${lx}" y="${ly(i) + 5}" font-size="${s.fs || 15}" font-weight="600">${esc(t)}</text><circle class="a1 pop" cx="${cx0}" cy="${ly(i)}" r="4.5"/></g>`; });
    R.forEach((t, j) => { g += `<g class="nd hit" data-side="r" data-i="${j}"${tipA(t, s.rtips ? s.rtips[j] : '')}><circle class="a3 pop" cx="${cx1}" cy="${ry(j)}" r="4.5"/><text class="t-h" x="${rx}" y="${ry(j) + 7}" font-size="${(s.fs || 15) + 5}" text-anchor="end">${esc(t)}</text></g>`; });
    return { H, g };
  };

  /* value ranges on one shared axis */
  T.range = (s, W) => {
    const [a, b] = s.axis || [0, 1], pad = W * .04, lw = Math.min(W * .32, 220), x = lin(a, b, pad + lw, W - pad), rh = 54, top = 20, H = top + s.rows.length * rh + 46;
    let g = '';
    (s.ticks || [a, (a + b) / 2, b]).forEach(t => { g += `<line class="gr" x1="${x(t)}" x2="${x(t)}" y1="${top - 6}" y2="${H - 34}"/><text class="t-m" x="${x(t)}" y="${H - 16}" font-size="11" text-anchor="middle">${esc(s.fmt ? s.fmt(t) : String(t).replace(/^0\./, '.'))}</text>`; });
    if (s.ref) g += `<line class="s3" x1="${x(s.ref.x)}" x2="${x(s.ref.x)}" y1="${top - 10}" y2="${H - 34}" stroke-dasharray="4 4" stroke-width="1.5"/><text class="t-m" x="${x(s.ref.x) + 6}" y="${top - 2}" font-size="10">${esc(s.ref.label)}</text>`;
    s.rows.forEach((r, i) => { const y = top + i * rh + rh / 2; g += `<g class="hit"${tipA(r.label, `${r.lo}—${r.hi}${r.note ? ' · ' + r.note : ''}`)}><text x="${pad}" y="${y + 5}" font-size="15" font-weight="700">${esc(r.label)}</text><line class="ax" x1="${pad + lw}" x2="${W - pad}" y1="${y}" y2="${y}"/><rect class="${r.c || 'a1'} grow" x="${x(r.lo)}" y="${y - 9}" width="${Math.max(3, x(r.hi) - x(r.lo))}" height="18"/><text class="t-h" x="${x(r.hi) + 10}" y="${y + 6}" font-size="17">${esc(r.text || `${r.lo}—${r.hi}`)}</text></g>`; });
    return { H, g };
  };

  /* stacked horizontal bars, one row per item */
  T.stack = (s, W) => {
    const lw = Math.min(W * .16, 110), pad = 8, tot = s.rows.map(r => r.v.reduce((a, b) => a + b, 0)), max = s.max || Math.max(...tot), x = lin(0, max, lw, W - 50), rh = s.rowH || 30, top = 26, H = top + s.rows.length * rh + 30;
    const cls = s.cls || ['a1', 'a2', 'a4'];
    let g = '';
    const step = s.tick || Math.ceil(max / 5);
    for (let t = 0; t <= max; t += step) g += `<line class="gr" x1="${x(t)}" x2="${x(t)}" y1="${top - 6}" y2="${H - 24}"/><text class="t-m" x="${x(t)}" y="${H - 8}" font-size="10" text-anchor="middle">${t}</text>`;
    s.rows.forEach((r, i) => {
      const y = top + i * rh; let acc = 0;
      g += `<text x="${lw - pad}" y="${y + rh / 2 + 5}" font-size="13" font-weight="700" text-anchor="end">${esc(r.label)}</text>`;
      r.v.forEach((v, k) => { if (!v) return; const x0 = x(acc), w = x(acc + v) - x0; acc += v; g += `<g class="hit"${tipA(r.label, `${s.keys[k]} · ${v}`)}><rect class="${cls[k]} grow" x="${x0}" y="${y + 4}" width="${w}" height="${rh - 8}" style="transition-delay:${i * .04}s"/>${w > 22 ? `<text x="${x0 + w / 2}" y="${y + rh / 2 + 4}" font-size="11" font-weight="700" text-anchor="middle" fill="${k === 0 ? 'var(--sheet,#fff)' : 'var(--ink)'}" style="fill:${k === 0 ? 'var(--sheet,#fff)' : 'var(--ink)'}">${v}</text>` : ''}</g>`; });
      g += `<text class="t-h" x="${x(acc) + 8}" y="${y + rh / 2 + 6}" font-size="15">${tot[i]}</text>`;
    });
    return { H, g, legend: s.keys.map((k, i) => [k, cls[i]]) };
  };

  /* events on clip time: lanes for the two directions and the unknown */
  T.events = (s, W) => {
    const ev = s.rally ? s.events.filter(e => e.r === s.rally) : s.events;
    const d0 = s.domain ? s.domain[0] : Math.floor(ev[0].t) - .5, d1 = s.domain ? s.domain[1] : Math.ceil(ev[ev.length - 1].t) + .5;
    const pad = 44, x = lin(d0, d1, pad, W - 16), lane = { a: 40, u: 82, b: 124 }, H = s.windows ? 250 + s.windows.length * 0 : 186;
    let g = '';
    const rs = [...new Set(ev.map(e => e.r))];
    rs.forEach(r => { const e = ev.filter(q => q.r === r), x0 = x(e[0].t) - 10, x1 = x(e[e.length - 1].t) + 10; g += `<rect class="a4" x="${x0}" y="20" width="${x1 - x0}" height="124" opacity=".55"/><text class="t-m" x="${x0 + 4}" y="15" font-size="10" font-weight="700">R${r}</text>`; });
    const step = (d1 - d0) > 12 ? 5 : 1;
    for (let t = Math.ceil(d0 / step) * step; t <= d1; t += step) g += `<line class="gr" x1="${x(t)}" x2="${x(t)}" y1="20" y2="150"/><text class="t-m" x="${x(t)}" y="166" font-size="10" text-anchor="middle">${t}</text>`;
    g += `<text class="t-m" x="4" y="${lane.a + 4}" font-size="10">○→</text><text class="t-m" x="4" y="${lane.u + 4}" font-size="10">◇</text><text class="t-m" x="4" y="${lane.b + 4}" font-size="10">□→</text>`;
    for (let i = 1; i < ev.length; i++) { const p = ev[i - 1], q = ev[i]; if (p.r !== q.r) continue; const dash = p.dir === 'u' || q.dir === 'u'; g += `<line class="s3" x1="${x(p.t)}" y1="${lane[p.dir]}" x2="${x(q.t)}" y2="${lane[q.dir]}" stroke-width="1.4" ${dash ? 'stroke-dasharray="3 4"' : ''} opacity=".55"/>`; }
    ev.forEach((e, i) => { const sel = e.n === s.select, cx = x(e.t), cy = lane[e.dir]; g += `<g class="hit"${tipA(`#${String(e.n).padStart(2, '0')} · ${e.t.toFixed(2)} s · R${e.r}`, `${{ a: 'P01 → P02', b: 'P02 → P01', u: '方向未确认' }[e.dir]}${e.st ? ' · ' + e.st : ''}`)}>${glyph(e.dir, cx, cy, sel ? 9 : 6.5, `${e.dir === 'b' ? 'a3' : e.dir === 'a' ? 'a1' : 'a2'} pop`)}${e.nr ? `<line class="s3" x1="${cx - 8}" x2="${cx + 8}" y1="${cy + 13}" y2="${cy + 13}" stroke-width="2"/>` : ''}<text class="t-m" x="${cx}" y="${cy - 12}" font-size="9" text-anchor="middle" opacity=".7">${String(e.n).padStart(2, '0')}</text></g>`; if (sel) g += `<line class="s1" x1="${cx}" x2="${cx}" y1="20" y2="150" stroke-width="2"/>`; });
    if (s.windows) s.windows.forEach((w, i) => { const y = 186 + i * 12, on = s.win === i; g += `<rect class="${on ? 'a1' : 'a4'}" x="${x(w[0])}" y="${y}" width="${x(w[1]) - x(w[0])}" height="8" opacity="${on ? 1 : .8}"/><text class="t-m" x="${x(w[1]) + 6}" y="${y + 8}" font-size="10" font-weight="${on ? 700 : 400}">${esc(w[2] || '')}</text>`; });
    return { H: s.windows ? 186 + s.windows.length * 12 + 16 : H, g };
  };

  /* rows × columns, cell value 0..max */
  T.heat = (s, W) => {
    const lw = Math.min(W * .2, 120), cw = Math.min(46, (W - lw - 10) / s.cols.length), ch = s.ch || 30, top = 46, H = top + s.rows.length * ch + 10;
    let g = '';
    s.cols.forEach((c, j) => { g += `<text class="t-m" x="${lw + j * cw + cw / 2}" y="18" font-size="10" text-anchor="middle">${esc(c.n ?? j + 1)}</text>${c.d ? glyph(c.d, lw + j * cw + cw / 2, 32, 5, c.d === 'b' ? 'a3' : c.d === 'a' ? 'a1' : 'a2') : ''}`; });
    s.rows.forEach((r, i) => { g += `<text x="${lw - 8}" y="${top + i * ch + ch / 2 + 5}" font-size="12.5" font-weight="600" text-anchor="end">${esc(r)}</text>`; s.cells[i].forEach((v, j) => { const o = v == null ? 0 : Math.max(.06, v / (s.max || 100)); g += `<rect class="${v == null ? '' : 'a1'} hit" x="${lw + j * cw + 1}" y="${top + i * ch + 1}" width="${cw - 2}" height="${ch - 2}" ${v == null ? 'fill="none" stroke="currentColor" stroke-opacity=".2" stroke-dasharray="2 3"' : `opacity="${o.toFixed(2)}"`}${tipA(`${r} · ${s.cols[j].n ?? j + 1}`, v == null ? '没有值' : f1(v))}/>`; }); });
    return { H, g };
  };

  /* simple bars; orient h (default) or v */
  T.bars = (s, W) => {
    const items = s.items, max = s.max || Math.max(...items.map(i => i.v));
    if (s.orient === 'v') {
      const H = s.h || 260, top = 30, bot = 46, bw = (W - 20) / items.length, y = lin(0, max, H - bot, top);
      let g = `<line class="ax" x1="10" x2="${W - 10}" y1="${H - bot}" y2="${H - bot}"/>`;
      items.forEach((it, i) => { const cx = 10 + i * bw + bw / 2, hi = s.hi === i; g += `<g class="hit"${tipA(it.label, `${it.v}${s.unit || ''}${it.note ? ' · ' + it.note : ''}`)}><rect class="${hi ? 'a1' : it.c || 'a3'} growy" x="${cx - bw * .32}" y="${y(it.v)}" width="${bw * .64}" height="${H - bot - y(it.v)}" style="transition-delay:${i * .04}s"/><text class="t-h" x="${cx}" y="${y(it.v) - 8}" font-size="14" text-anchor="middle">${esc(it.t ?? it.v)}</text><text x="${cx}" y="${H - bot + 18}" font-size="11.5" text-anchor="middle" font-weight="600">${esc(it.label)}</text>${it.sub ? `<text class="t-m" x="${cx}" y="${H - bot + 33}" font-size="9.5" text-anchor="middle" opacity=".6">${esc(it.sub)}</text>` : ''}</g>`; });
      return { H, g };
    }
    const lw = Math.min(W * (s.lw || .3), 240), rh = s.rowH || 34, top = 8, H = top + items.length * rh + 8, x = lin(0, max, lw, W - 70);
    let g = '';
    items.forEach((it, i) => { const y = top + i * rh, hi = s.hi === i; g += `<g class="hit"${tipA(it.label, `${it.v}${s.unit || ''}${it.note ? ' · ' + it.note : ''}`)}><text x="${lw - 10}" y="${y + rh / 2 + 5}" font-size="13" font-weight="${hi ? 800 : 600}" text-anchor="end">${esc(it.label)}</text><rect class="${hi ? 'a1' : it.c || 'a3'} grow" x="${lw}" y="${y + 6}" width="${Math.max(2, x(it.v) - lw)}" height="${rh - 12}" style="transition-delay:${i * .04}s"/><text class="t-h" x="${x(it.v) + 8}" y="${y + rh / 2 + 6}" font-size="15">${esc(it.t ?? it.v)}</text></g>`; });
    return { H, g , legend: s.legend };
  };

  /* lines (cdf, series); step: true draws a step function */
  T.lines = (s, W) => {
    const H = s.h || 300, l = 46, r = 16, t = 16, b = 40, xs = s.x, ys = s.y;
    const x = lin(xs.min, xs.max, l, W - r), y = lin(ys.min, ys.max, H - b, t);
    let g = '';
    (ys.ticks || [ys.min, (ys.min + ys.max) / 2, ys.max]).forEach(v => { g += `<line class="gr" x1="${l}" x2="${W - r}" y1="${y(v)}" y2="${y(v)}"/><text class="t-m" x="${l - 8}" y="${y(v) + 4}" font-size="10" text-anchor="end">${esc(ys.fmt ? ys.fmt(v) : v)}</text>`; });
    (xs.ticks || []).forEach(v => { g += `<text class="t-m" x="${x(v)}" y="${H - b + 18}" font-size="10" text-anchor="middle">${esc(v)}</text>`; });
    g += `<line class="ax" x1="${l}" x2="${W - r}" y1="${H - b}" y2="${H - b}"/><text class="t-m" x="${W - r}" y="${H - 4}" font-size="10" text-anchor="end">${esc(xs.label || '')}</text><text class="t-m" x="${l}" y="${t - 4}" font-size="10">${esc(ys.label || '')}</text>`;
    const cls = s.cls || ['s1', 's3', 's2', 's1', 's3'];
    s.series.forEach((se, k) => { const pts = se.pts; let d = ''; pts.forEach(([px, py], i) => { d += i ? (s.step || se.step ? `H${x(px)}V${y(py)}` : `L${x(px)} ${y(py)}`) : `M${x(px)} ${y(py)}`; }); g += `<path class="${cls[k % cls.length]} ${se.dash ? '' : 'draw'} hit" d="${d}" fill="none" stroke-width="${se.w || 2.4}" ${se.dash ? 'stroke-dasharray="5 4"' : ''} style="--len:${W * 2}"${tipA(se.name, se.note || '')}/>`; const [lx, ly] = pts[se.at != null ? se.at : pts.length - 1]; if (se.label !== false) g += `<text x="${Math.min(x(lx) + 6, W - r)}" y="${y(ly) + 4}" font-size="11" font-weight="700" ${x(lx) > W - 80 ? 'text-anchor="end"' : ''}>${esc(se.name)}</text>`; });
    return { H, g };
  };

  /* histograms; mirror: true puts two groups back to back */
  T.hist = (s, W) => {
    const H = s.h || 260, l = 40, r = 10, t = 20, b = 36, gs = s.groups, bins = gs[0].bins;
    const x = lin(bins[0][0], bins[bins.length - 1][1], l, W - r), max = s.max || Math.max(...gs.flatMap(q => q.bins.map(v => v[2]))), y = lin(0, max, H - b, t);
    let g = `<line class="ax" x1="${l}" x2="${W - r}" y1="${H - b}" y2="${H - b}"/>`;
    gs.forEach((q, k) => q.bins.forEach(([a, c, n]) => { if (!n) return; const w = (x(c) - x(a)) / gs.length; g += `<rect class="${['a1', 'a3', 'a2'][k]} growy hit" x="${x(a) + k * w + .5}" y="${y(n)}" width="${w - 1}" height="${H - b - y(n)}"${tipA(`${q.name} · ${a}—${c}${s.unit || ''}`, `${n} 条`)}/>`; }));
    (s.ticks || []).forEach(v => { g += `<text class="t-m" x="${x(v)}" y="${H - b + 16}" font-size="10" text-anchor="middle">${v}</text>`; });
    g += `<text class="t-m" x="${W - r}" y="${H - 4}" font-size="10" text-anchor="end">${esc(s.xlabel || '')}</text><text class="t-m" x="${l}" y="${t - 6}" font-size="10">${esc(s.ylabel || '')} · 上限 ${max}</text>`;
    return { H, g, legend: gs.length > 1 ? gs.map((q, k) => [q.name, ['a1', 'a3', 'a2'][k]]) : null };
  };

  /* badminton court from above, two players, the role of each */
  T.court = (s, W) => {
    const H = Math.round(W * .52), cx = W / 2, m = W * .06, cw = W - 2 * m, chh = H - 2 * m * .9, y0 = m * .9;
    let g = `<rect x="${m}" y="${y0}" width="${cw}" height="${chh}" fill="none" class="s3" stroke-width="2"/><line class="s3" x1="${cx}" x2="${cx}" y1="${y0 - 8}" y2="${y0 + chh + 8}" stroke-width="3"/><line class="gr" x1="${cx - cw * .15}" x2="${cx - cw * .15}" y1="${y0}" y2="${y0 + chh}"/><line class="gr" x1="${cx + cw * .15}" x2="${cx + cw * .15}" y1="${y0}" y2="${y0 + chh}"/><line class="gr" x1="${m}" x2="${cx - cw * .15}" y1="${y0 + chh / 2}" y2="${y0 + chh / 2}"/><line class="gr" x1="${cx + cw * .15}" x2="${m + cw}" y1="${y0 + chh / 2}" y2="${y0 + chh / 2}"/>`;
    const ax = m + cw * .24, bx = m + cw * .76, py = y0 + chh / 2;
    g += `<path class="s1 draw" d="M${ax} ${py}Q${cx} ${py - chh * .55} ${bx} ${py}" fill="none" stroke-width="2.4" stroke-dasharray="6 5" style="--len:${W}"/>`;
    g += glyph('a', ax, py, 12, `a1 pop`) + glyph('b', bx, py, 11, 'a3 pop');
    g += `<text class="t-h" x="${ax}" y="${py + 38}" font-size="${Math.max(14, W * .05)}" text-anchor="middle">${esc(s.a)}</text><text class="t-h" x="${bx}" y="${py + 38}" font-size="${Math.max(14, W * .05)}" text-anchor="middle">${esc(s.b)}</text>`;
    return { H, g };
  };

  /* a chain of checks or steps */
  T.chain = (s, W) => {
    const n = s.steps.length, gap = 12, bw = (W - gap * (n - 1)) / n, H = s.h || 150;
    let g = '';
    s.steps.forEach((st, i) => { const x = i * (bw + gap); g += `<g class="hit"${tipA(st.h, st.t || '')}><rect class="${i === (s.hi ?? -1) ? 'a1' : 'a4'} grow" x="${x}" y="20" width="${bw}" height="${H - 40}" style="transition-delay:${i * .12}s"/><text class="t-m" x="${x + 10}" y="40" font-size="10" ${i === s.hi ? 'style="fill:var(--sheet,#fff)"' : ''}>${String(i + 1).padStart(2, '0')}</text>${wrap(st.h, Math.max(4, Math.floor(bw / 17))).map((ln, k) => `<text class="t-h" x="${x + 10}" y="${66 + k * 22}" font-size="18" ${i === s.hi ? 'style="fill:var(--sheet,#fff)"' : ''}>${esc(ln)}</text>`).join('')}${st.t ? wrap(st.t, Math.max(6, Math.floor(bw / 12))).slice(0, 3).map((ln, k) => `<text x="${x + 10}" y="${H - 52 + k * 15}" font-size="11.5" ${i === s.hi ? 'style="fill:var(--sheet,#fff)"' : ''}>${esc(ln)}</text>`).join('') : ''}</g>${i < n - 1 ? `<path class="s3" d="M${x + bw + 2} ${H / 2}l${gap - 4} 0" stroke-width="2"/>` : ''}`; });
    if (s.foot) g += `<text class="t-m" x="0" y="${H - 4}" font-size="10.5">${esc(s.foot)}</text>`;
    return { H: H + (s.foot ? 10 : 0), g };
  };

  /* every record a dot, coloured by class */
  T.dots = (s, W) => {
    const per = s.per || 30, r = Math.min(9, (W - 4) / per / 2.4), step = r * 2.4, rows = Math.ceil(s.n / per), H = rows * step + 10;
    let g = '';
    for (let i = 0; i < s.n; i++) { const c = s.cls(i); g += `<circle class="${c} pop" cx="${(i % per) * step + r + 2}" cy="${Math.floor(i / per) * step + r + 2}" r="${r}" style="transition-delay:${(i % per) * .01}s"/>`; }
    return { H, g };
  };

  /* labelled cells with counts and shares (confusion matrix, cross tables) */
  T.matrix = (s, W) => {
    const lw = Math.min(W * .26, 170), top = 40, cw = (W - lw) / s.cols.length, ch = s.ch || 74, H = top + s.rows.length * ch;
    let g = '';
    s.cols.forEach((c, j) => { g += `<text class="t-m" x="${lw + j * cw + cw / 2}" y="${top - 12}" font-size="10.5" text-anchor="middle">${esc(c)}</text>`; });
    s.rows.forEach((rw, i) => { g += `<text x="${lw - 10}" y="${top + i * ch + ch / 2 + 5}" font-size="13" font-weight="700" text-anchor="end">${esc(rw)}</text>`; s.cells[i].forEach((c, j) => { const on = c.hi; g += `<g class="hit"${tipA(`${rw} → ${s.cols[j]}`, `${c.n}${c.p ? ' · ' + c.p : ''}`)}><rect class="${on ? 'a1' : 'a4'} pop" x="${lw + j * cw + 2}" y="${top + i * ch + 2}" width="${cw - 4}" height="${ch - 4}" style="opacity:${on ? 1 : .35 + .65 * (c.w || 0)}"/><text class="t-h" x="${lw + j * cw + cw / 2}" y="${top + i * ch + ch / 2 + 4}" font-size="24" text-anchor="middle" ${on ? 'style="fill:var(--sheet,#fff)"' : ''}>${esc(c.n)}</text>${c.p ? `<text class="t-m" x="${lw + j * cw + cw / 2}" y="${top + i * ch + ch / 2 + 22}" font-size="10" text-anchor="middle" ${on ? 'style="fill:var(--sheet,#fff)"' : ''}>${esc(c.p)}</text>` : ''}</g>`; }); });
    return { H, g };
  };

  /* parts of one whole */
  T.donut = (s, W) => {
    const H = Math.min(W, s.h || 260), R = H / 2 - 10, cx = H / 2, cy = H / 2, tot = s.parts.reduce((a, p) => a + p.v, 0);
    let a0 = -Math.PI / 2, g = '';
    s.parts.forEach((p, i) => { const a1 = a0 + p.v / tot * Math.PI * 2, la = a1 - a0 > Math.PI ? 1 : 0, r0 = R * .62; const P = (a, r) => `${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)}`; g += `<path class="${p.c || ['a1', 'a3', 'a2', 'a4'][i % 4]} pop hit" d="M${P(a0, R)}A${R} ${R} 0 ${la} 1 ${P(a1, R)}L${P(a1, r0)}A${r0} ${r0} 0 ${la} 0 ${P(a0, r0)}Z"${tipA(p.label, `${p.v}${s.unit || ''}`)}/>`; a0 = a1; });
    g += `<text class="t-h" x="${cx}" y="${cy + 10}" font-size="${R * .42}" text-anchor="middle">${esc(s.center || tot)}</text>`;
    let ly = 20; s.parts.forEach((p, i) => { g += `<rect class="${p.c || ['a1', 'a3', 'a2', 'a4'][i % 4]}" x="${H + 20}" y="${ly - 10}" width="12" height="12"/><text x="${H + 40}" y="${ly}" font-size="13" font-weight="600">${esc(p.label)} · ${p.v}${esc(s.unit || '')}</text>`; ly += 24; });
    return { H, g };
  };

  /* point estimate with its interval, one row each; the axis can be zoomed */
  T.ci = (s, W) => {
    const lw = Math.min(W * .3, 200), rh = 40, top = 30, H = top + s.rows.length * rh + 34, [a, b] = s.axis, x = lin(a, b, lw, W - 20);
    let g = (s.ticks || [a, b]).map(t => `<line class="gr" x1="${x(t)}" x2="${x(t)}" y1="${top - 8}" y2="${H - 30}"/><text class="t-m" x="${x(t)}" y="${H - 12}" font-size="10" text-anchor="middle">${t}</text>`).join('');
    if (s.note) g += `<text class="t-m" x="${lw}" y="14" font-size="10" opacity=".7">${esc(s.note)}</text>`;
    s.rows.forEach((r, i) => { const y = top + i * rh + rh / 2, hi = s.hi === i; g += `<g class="hit"${tipA(r.label, `${r.v} · 95% CI ${r.lo}—${r.hi}`)}><text x="${lw - 12}" y="${y + 5}" font-size="13" font-weight="${hi ? 800 : 600}" text-anchor="end">${esc(r.label)}</text><line class="${hi ? 's1' : 's3'} grow" x1="${x(r.lo)}" x2="${x(r.hi)}" y1="${y}" y2="${y}" stroke-width="${hi ? 5 : 3}" opacity="${hi ? 1 : .55}"/><circle class="${hi ? 'a1' : 'a3'} pop" cx="${x(r.v)}" cy="${y}" r="${hi ? 8 : 6}"/><text class="t-m" x="${x(r.hi) + 8}" y="${y + 4}" font-size="11" font-weight="${hi ? 700 : 400}">${r.v}</text></g>`; });
    return { H, g };
  };
  /* labelled points on two axes */
  T.scatter = (s, W) => {
    const H = s.h || Math.min(420, W * .7), l = 48, r = 20, t = 20, b = 40, [x0, x1] = s.x.range, [y0, y1] = s.y.range, x = lin(x0, x1, l, W - r), y = lin(y0, y1, H - b, t);
    let g = '';
    (s.x.ticks || [x0, x1]).forEach(v => { g += `<line class="gr" x1="${x(v)}" x2="${x(v)}" y1="${t}" y2="${H - b}"/><text class="t-m" x="${x(v)}" y="${H - b + 16}" font-size="10" text-anchor="middle">${v}</text>`; });
    (s.y.ticks || [y0, y1]).forEach(v => { g += `<line class="gr" x1="${l}" x2="${W - r}" y1="${y(v)}" y2="${y(v)}"/><text class="t-m" x="${l - 8}" y="${y(v) + 4}" font-size="10" text-anchor="end">${v}</text>`; });
    g += `<text class="t-m" x="${W - r}" y="${H - 4}" font-size="10" text-anchor="end">${esc(s.x.label)}</text><text class="t-m" x="${l}" y="${t - 6}" font-size="10">${esc(s.y.label)}</text>`;
    s.pts.forEach((p, i) => { const hi = s.hi === i; g += `<g class="hit"${tipA(p.label, `${s.x.label} ${p.x} · ${s.y.label} ${p.y}`)}><circle class="${hi ? 'a1' : 'a3'} pop" cx="${x(p.x)}" cy="${y(p.y)}" r="${hi ? 10 : 6}" opacity="${hi ? 1 : .7}"/><text x="${x(p.x) + 13}" y="${y(p.y) + 4}" font-size="${hi ? 13 : 11}" font-weight="${hi ? 800 : 500}">${esc(p.short || p.label)}</text></g>`; });
    return { H, g };
  };
  /* two values per row on one axis (e.g. recall vs specificity) */
  T.pair = (s, W) => {
    const lw = Math.min(W * .3, 200), rh = 46, top = 34, H = top + s.rows.length * rh + 30, [a, b] = s.axis || [0, 1], x = lin(a, b, lw, W - 30);
    let g = (s.ticks || [0, .25, .5, .75, 1]).map(t => `<line class="gr" x1="${x(t)}" x2="${x(t)}" y1="${top - 10}" y2="${H - 26}"/><text class="t-m" x="${x(t)}" y="${H - 10}" font-size="10" text-anchor="middle">${t.toFixed(2)}</text>`).join('');
    g += `<circle class="a1" cx="${lw}" cy="10" r="5"/><text x="${lw + 10}" y="14" font-size="11">${esc(s.keys[0])}</text><rect class="a3" x="${lw + 150}" y="5" width="10" height="10"/><text x="${lw + 166}" y="14" font-size="11">${esc(s.keys[1])}</text>`;
    s.rows.forEach((r, i) => { const y = top + i * rh + rh / 2, [p, q] = r.v; g += `<g class="hit"${tipA(r.label, `${s.keys[0]} ${p} · ${s.keys[1]} ${q}`)}><text x="${lw - 12}" y="${y + 5}" font-size="13" font-weight="700" text-anchor="end">${esc(r.label)}</text><line class="s3 grow" x1="${x(Math.min(p, q))}" x2="${x(Math.max(p, q))}" y1="${y}" y2="${y}" stroke-width="2" opacity=".4"/><circle class="a1 pop" cx="${x(p)}" cy="${y}" r="7"/><rect class="a3 pop" x="${x(q) - 6}" y="${y - 6}" width="12" height="12"/><text class="t-m" x="${x(Math.min(p, q)) - 10}" y="${y + 4}" font-size="10.5" text-anchor="end">${Math.min(p, q)}</text></g>`; });
    return { H, g };
  };
  /* parallel lanes of steps */
  T.lanes = (s, W) => {
    const lh = 92, gap = 44, H = s.lanes.length * lh + (s.lanes.length - 1) * gap + 30;
    let g = '';
    s.lanes.forEach((ln, i) => { const y = i * (lh + gap) + 18, n = ln.steps.length, lw = Math.min(150, W * .2), bw = (W - lw - 10 * (n - 1)) / n; g += `<text class="t-m" x="0" y="${y + 12}" font-size="10.5" font-weight="700">${esc(ln.title)}</text>`; ln.steps.forEach((st, j) => { const x = lw + j * (bw + 10); g += `<g class="hit"${tipA(st, ln.title)}><rect class="${i ? 'a3' : 'a1'} grow" x="${x}" y="${y}" width="${bw}" height="${lh}" style="transition-delay:${(i * n + j) * .08}s"/><text class="t-m" x="${x + 12}" y="${y + 22}" font-size="10" style="fill:var(--sheet,#fff)">0${j + 1}</text><text class="t-h" x="${x + 12}" y="${y + lh - 18}" font-size="${Math.min(22, bw / 6)}" style="fill:var(--sheet,#fff)">${esc(st)}</text></g>${j < n - 1 ? `<path class="s3" d="M${x + bw + 1} ${y + lh / 2}h8" stroke-width="2"/>` : ''}`; }); });
    if (s.cross) { const lw = Math.min(150, W * .2), x = lw + 30; g += `<path class="s2" d="M${x} ${18 + lh}V${18 + lh + gap}" stroke-width="2" stroke-dasharray="4 4"/><text class="t-m" x="${x + 10}" y="${18 + lh + gap / 2 + 4}" font-size="10.5">${esc(s.cross)}</text>`; }
    if (s.foot) g += `<text class="t-m" x="0" y="${H - 2}" font-size="10.5" opacity=".75">${esc(s.foot)}</text>`;
    return { H: H + (s.foot ? 8 : 0), g };
  };

  /* rows dropped into one of a few columns (priority tiers) */
  T.tier = (s, W) => {
    const lw = Math.min(W * .32, 220), top = 40, rh = s.rowH || 54, n = s.cols.length, cw = (W - lw) / n, H = top + s.rows.length * rh + 6;
    let g = '';
    s.cols.forEach((c, j) => { const x = lw + j * cw; g += `<rect class="${j ? 'a4' : 'a1'}" x="${x + 2}" y="${top - 8}" width="${cw - 4}" height="${H - top + 2}" opacity="${j ? .55 - j * .15 : .1}"/><text class="t-h" x="${x + cw / 2}" y="${top - 16}" font-size="17" text-anchor="middle">${esc(c)}</text>`; });
    const pts = s.rows.map((r, i) => [lw + r.c * cw + cw / 2, top + i * rh + rh / 2]);
    g += `<path class="s3" d="M${pts.map(p => p.join(' ')).join('L')}" fill="none" stroke-width="1.4" stroke-dasharray="3 5" opacity=".5"/>`;
    s.rows.forEach((r, i) => { const [cx, y] = pts[i]; g += `<line class="gr" x1="0" x2="${W}" y1="${top + (i + 1) * rh}" y2="${top + (i + 1) * rh}"/><g class="hit"${tipA(`${r.code || ''} ${r.label}`, r.q || '')}><text class="t-m" x="0" y="${y - 8}" font-size="10.5" opacity=".7">${esc(r.code || '')}</text><text x="0" y="${y + 12}" font-size="${W < 480 ? 14 : 17}" font-weight="800">${esc(r.label)}</text>${glyph('a', cx, y, r.c ? 8 : 12, `${r.c ? 'a3' : 'a1'} pop`)}${r.tag ? `<text class="t-m" x="${cx + 18}" y="${y + 4}" font-size="10">${esc(r.tag)}</text>` : ''}</g>`; });
    return { H, g };
  };

  /* spans on one time axis, with a small pictogram per span */
  const pict = (k, x, y, z, c) => {
    const st = `stroke="${c}" fill="none" stroke-width="1.6"`;
    if (k === 'box') return `<path ${st} d="M${x} ${y + z * .3}V${y}H${x + z * .3}M${x + z * .7} ${y}H${x + z}V${y + z * .3}M${x + z} ${y + z * .7}V${y + z}H${x + z * .7}M${x + z * .3} ${y + z}H${x}V${y + z * .7}"/>`;
    if (k === 'trail') return [0, 1, 2, 3].map(i => `<line ${st} x1="${x + i * z * .12}" x2="${x + z}" y1="${y + z * (.2 + i * .2)}" y2="${y + z * (.2 + i * .2)}" opacity="${1 - i * .2}"/>`).join('');
    if (k === 'pulse') return [.18, .34, .5].map((r, i) => `<circle ${st} cx="${x + z / 2}" cy="${y + z / 2}" r="${z * r}" opacity="${1 - i * .25}"/>`).join('');
    if (k === 'glitch') return `<rect ${st} x="${x}" y="${y + z * .1}" width="${z * .7}" height="${z * .5}"/><rect ${st} x="${x + z * .3}" y="${y + z * .4}" width="${z * .7}" height="${z * .5}"/><line ${st} x1="${x}" x2="${x + z}" y1="${y + z * .45}" y2="${y + z * .45}" stroke-width="3"/>`;
    if (k === 'stars') { const p = [[.1, .7], [.35, .25], [.6, .55], [.9, .15], [.8, .9]].map(([a, b]) => [x + a * z, y + b * z]); return `<path ${st} d="M${p.map(q => q.join(' ')).join('L')}" opacity=".7"/>${p.map(([a, b]) => `<circle cx="${a}" cy="${b}" r="2.4" fill="${c}"/>`).join('')}`; }
    return '';
  };
  T.seg = (s, W) => {
    const [a, b] = s.axis, u = s.unit || '';
    if (W < 560) { // narrow: one row per span
      const lw = 112, x = lin(a, b, lw, W - 6), rh = 52, H = s.segs.length * rh + 22;
      let g = (s.ticks || [a, b]).map(t => `<line class="gr" x1="${x(t)}" x2="${x(t)}" y1="0" y2="${H - 18}"/><text class="t-m" x="${x(t)}" y="${H - 4}" font-size="9.5" text-anchor="middle">${t}</text>`).join('');
      s.segs.forEach((q, i) => { const y = i * rh, hi = s.hi === i; g += `<g class="hit"${tipA(`${q.a}—${q.b} ${u} · ${q.label}`, q.sub || '')}><text x="0" y="${y + 22}" font-size="14" font-weight="800">${esc(q.label)}</text><text class="t-m" x="0" y="${y + 38}" font-size="10">${esc(q.sub || '')}</text><rect class="${hi ? 'a1' : 'a3'} grow" x="${x(q.a)}" y="${y + 10}" width="${x(q.b) - x(q.a)}" height="30" style="transition-delay:${i * .1}s"/></g>`; });
      return { H, g };
    }
    const x = lin(a, b, 0, W), top = 8, bh = s.bh || 92, H = top + bh + 78;
    let g = '';
    s.segs.forEach((q, i) => { const x0 = x(q.a), x1 = x(q.b), w = x1 - x0 - 4, hi = s.hi === i, fg = 'var(--sheet,#fff)';
      g += `<g class="hit"${tipA(`${q.a}—${q.b} ${u} · ${q.label}`, q.sub || '')}><rect class="${hi ? 'a1' : 'a3'} grow" x="${x0 + 2}" y="${top}" width="${w}" height="${bh}" style="transition-delay:${i * .1}s"/>${w > 44 ? pict(q.p, x0 + 12, top + 12, Math.min(26, w * .3), fg) : ''}<text class="t-h" x="${x0 + 12}" y="${top + bh - 14}" font-size="${Math.min(30, w / 3.6)}" style="fill:${fg}">${q.a}—${q.b}</text><text x="${x0 + 4}" y="${top + bh + 26}" font-size="${Math.min(16, w / 4.2)}" font-weight="800">${esc(q.label)}</text><text class="t-m" x="${x0 + 4}" y="${top + bh + 46}" font-size="${Math.min(11, w / 7)}">${esc(q.sub || '')}</text></g>`; });
    g += `<text class="t-m" x="${W}" y="${H - 4}" font-size="10" text-anchor="end" opacity=".6">${a}—${b} ${esc(u)}</text>`;
    return { H, g };
  };

  /* one swing drawn in four tones — same pose, same path, different voice */
  const SWING = { j: { n: [.04, 1.8], ls: [-.15, 1.56], rs: [.17, 1.64], le: [-.2, 1.3], re: [.23, 1.97], lw: [-.05, 1.14], rw: [.26, 2.32], lh: [-.1, 1.08], rh: [.12, 1.08], lk: [-.14, .62], rk: [.16, .63], la: [-.14, .2], ra: [.18, .22] }, b: [['ls', 'rs'], ['ls', 'le'], ['le', 'lw'], ['rs', 're'], ['re', 'rw'], ['ls', 'lh'], ['rs', 'rh'], ['lh', 'rh'], ['lh', 'lk'], ['lk', 'la'], ['rh', 'rk'], ['rk', 'ra']] };
  T.tones = (s, W) => {
    const cols = W >= 700 ? 4 : 2, gap = 14, pw = (W - gap * (cols - 1)) / cols, ph = pw * 1.3, lh = 46, rows = Math.ceil(s.items.length / cols), H = rows * (ph + lh) + (rows - 1) * 14;
    const arc = []; for (let k = 0; k <= 40; k++) { const t = (-70 + k * 7.5) * Math.PI / 180; arc.push([.17 + 1.15 * Math.cos(t), 1.64 + 1.15 * Math.sin(t)]); }
    const J = SWING.j, dir = [J.rw[0] - J.re[0], J.rw[1] - J.re[1]], dl = Math.hypot(...dir), head = [J.rw[0] + dir[0] / dl * .5, J.rw[1] + dir[1] / dl * .5];
    const sheet = 'var(--sheet,#fff)', ink = 'var(--ink)', acc = 'var(--cobalt)';
    let g = '';
    s.items.forEach((it, i) => {
      const ox = (i % cols) * (pw + gap), oy = Math.floor(i / cols) * (ph + lh + 14);
      const k = it.k, sc = Math.min(pw / 2.6, ph / 3.4) * (k === 'silent' ? .62 : 1), cx = k === 'silent' ? pw * .36 : pw * .42, base = k === 'silent' ? ph * .9 : ph * .93;
      const P = ([x, y]) => [cx + x * sc, base - y * sc], pl = pts => pts.map(P).map((p, q) => (q ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('');
      const bones = (c, w, extra = '') => SWING.b.map(([p, q]) => { const [x0, y0] = P(J[p]), [x1, y1] = P(J[q]); return `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`; }).join('') + (() => { const [hx, hy] = P(J.n); return `<circle cx="${hx}" cy="${hy - sc * .06}" r="${sc * .11}" fill="none" stroke="${c}" stroke-width="${w}"/>`; })() + (() => { const [a0, b0] = P(J.rw), [a1, b1] = P(head); return `<line x1="${a0}" y1="${b0}" x2="${a1}" y2="${b1}" stroke="${c}" stroke-width="${w}"/><ellipse cx="${a1}" cy="${b1}" rx="${sc * .08}" ry="${sc * .12}" fill="none" stroke="${c}" stroke-width="${w}"/>`; })();
      let body = '';
      if (k === 'silent') {
        body = `<rect width="${pw}" height="${ph}" fill="${sheet}"/><path d="${pl(arc)}" fill="none" stroke="${ink}" stroke-width="1" stroke-dasharray="1 5" stroke-linecap="round"/>${bones(ink, 1)}<text class="t-m" x="12" y="20" font-size="9" opacity=".7">ARCHIVE № 017</text><text class="t-m" x="12" y="33" font-size="9" opacity=".45">2025.04 · S1</text><line x1="12" x2="${pw - 12}" y1="${ph - 12}" y2="${ph - 12}" stroke="${ink}" stroke-opacity=".3"/>`;
      } else if (k === 'echo') {
        const bars = Array.from({ length: 30 }, (_, q) => .2 + .8 * Math.exp(-(((q - 20) / 3.5) ** 2)) + .12 * Math.abs(Math.sin(q * 1.7)));
        const bw = (pw - 24) / bars.length;
        body = `<rect width="${pw}" height="${ph}" fill="${sheet}"/>${[4, 3, 2, 1, 0].map(e => `<path d="${pl(arc)}" transform="translate(${-e * 7} ${e * 4})" fill="none" stroke="${acc}" stroke-width="${e ? 1.6 : 3}" opacity="${e ? .5 - e * .1 : 1}"/>`).join('')}${bones(ink, 2)}${bars.map((v, q) => `<rect x="${12 + q * bw}" y="${ph - 14 - v * 34}" width="${bw * .6}" height="${v * 34}" fill="${q === 20 ? acc : ink}" opacity="${q === 20 ? 1 : .55}"/>`).join('')}`;
      } else if (k === 'matrix') {
        const poly = arc.filter((_, q) => q % 6 === 0), gl = [];
        for (let x = 0; x < pw; x += pw / 8) gl.push(`<line x1="${x}" x2="${x}" y1="0" y2="${ph}"/>`);
        for (let y = 0; y < ph; y += pw / 8) gl.push(`<line x1="0" x2="${pw}" y1="${y}" y2="${y}"/>`);
        const [ex, ey] = P(J.re);
        body = `<rect width="${pw}" height="${ph}" fill="${ink}"/><g stroke="${sheet}" stroke-opacity=".12">${gl.join('')}</g><path d="${pl(poly)}" fill="none" stroke="var(--sky)" stroke-width="1.6"/>${poly.map(p => { const [x, y] = P(p); return `<path d="M${x - 4} ${y}h8M${x} ${y - 4}v8" stroke="var(--sky)" stroke-width="1.4"/>`; }).join('')}${bones(sheet, 1.3)}<path d="M${ex - 16} ${ey + 10}A18 18 0 0 1 ${ex + 4} ${ey - 18}" fill="none" stroke="${acc}" stroke-width="2"/><text class="t-m" x="${ex - 52}" y="${ey - 6}" font-size="10" style="fill:${acc}">θe 112°</text><text class="t-m" x="12" y="20" font-size="9" style="fill:var(--sky)">ANGLE · PATH · 0.32 m</text>`;
      } else {
        const [hx, hy] = P(head); let rays = '', dots = '';
        for (let q = 0; q < 18; q++) { const t = q / 18 * Math.PI * 2 + .2, r0 = sc * .2, r1 = sc * (.45 + ((q * 37) % 10) / 14); rays += `<line x1="${hx + Math.cos(t) * r0}" y1="${hy + Math.sin(t) * r0}" x2="${hx + Math.cos(t) * r1}" y2="${hy + Math.sin(t) * r1}" stroke="${sheet}" stroke-width="${2 + (q % 3)}" stroke-linecap="round"/>`; }
        for (let q = 0; q < 16; q++) { const t = q * 2.39, r = sc * (.5 + (q % 5) * .22); dots += `<circle cx="${hx + Math.cos(t) * r}" cy="${hy + Math.sin(t) * r}" r="${2 + (q * 7) % 6}" fill="${q % 3 ? sheet : ink}"/>`; }
        body = `<rect width="${pw}" height="${ph}" fill="${acc}"/><path d="${pl(arc)}" fill="none" stroke="${sheet}" stroke-width="9" stroke-linecap="round" opacity=".85"/>${rays}${dots}${bones(ink, 6)}<text class="t-h" x="${pw - 10}" y="${ph - 16}" font-size="${pw * .16}" text-anchor="end" transform="rotate(-8 ${pw - 10} ${ph - 16})" style="fill:${sheet}">IMPACT</text>`;
      }
      g += `<g class="hit"${tipA(it.label, it.cn || '')}><svg x="${ox}" y="${oy}" width="${pw}" height="${ph}" viewBox="0 0 ${pw} ${ph}" style="overflow:hidden">${body}</svg><text class="t-m" x="${ox}" y="${oy + ph + 18}" font-size="10.5" font-weight="700">${String(i + 1).padStart(2, '0')} ${esc(it.label)}</text><text x="${ox}" y="${oy + ph + 36}" font-size="12.5" font-weight="600">${esc(it.cn || '')}</text></g>`;
    });
    return { H, g };
  };

  /* two charts side by side (stacked when narrow), each on its own scale */
  T.duo = (s, W) => {
    const narrow = W < 640, gap = 32, w = narrow ? W : (W - gap) / 2, A = T[s.a.type](s.a, w), B = T[s.b.type](s.b, w), th = 26;
    const ttl = (t, x, y) => t ? `<text class="t-h" x="${x}" y="${y}" font-size="15">${esc(t)}</text>` : '';
    if (narrow) return { H: th * 2 + A.H + B.H + 24, g: `${ttl(s.a.title, 0, 16)}<g transform="translate(0 ${th})">${A.g}</g>${ttl(s.b.title, 0, th + A.H + 24 + 16)}<g transform="translate(0 ${th * 2 + A.H + 24})">${B.g}</g>` };
    return { H: th + Math.max(A.H, B.H), g: `${ttl(s.a.title, 0, 16)}<g transform="translate(0 ${th})">${A.g}</g>${ttl(s.b.title, w + gap, 16)}<g transform="translate(${w + gap} ${th})">${B.g}</g><line class="gr" x1="${w + gap / 2}" x2="${w + gap / 2}" y1="0" y2="${th + Math.max(A.H, B.H)}"/>` };
  };

  /* columns of nodes linked left → right; hi lights a column, hiRow lights the same row across columns */
  T.cols = (s, W) => {
    const n = s.cols.length, on = (c, i) => s.hi === c || s.hiRow === i || (s.hi == null && s.hiRow == null);
    if ((W - 30 * (n - 1)) / n < 104) { // narrow: columns become stacked bands
      let y = 0, g = '';
      s.cols.forEach((c, ci) => { g += `<text class="t-m" x="0" y="${y + 12}" font-size="10" font-weight="700">${esc(c.t)}</text>`; y += 20; c.items.forEach((it, i) => { const lit = on(ci, i), hl = s.hi === ci || s.hiRow === i; g += `<g class="hit"${tipA(it.h || it, it.t || c.t)}><rect class="${hl ? 'a1' : 'a4'}" x="0" y="${y}" width="${W}" height="34" opacity="${lit ? 1 : .45}"/><text x="10" y="${y + 22}" font-size="13" font-weight="700" ${hl ? 'style="fill:var(--sheet,#fff)"' : ''}>${esc(it.h || it)}${it.t ? ` · ${esc(it.t)}` : ''}</text></g>`; y += 38; }); if (ci < n - 1) { g += `<path class="s3" d="M${W / 2} ${y}v14m-5 -6l5 6 5 -6" fill="none" stroke-width="1.6"/>`; y += 20; } });
      return { H: y, g };
    }
    const gap = s.gap || Math.min(56, W * .05), cw = (W - gap * (n - 1)) / n, top = 30, nh = s.nh || 50, vg = 10, rows = Math.max(...s.cols.map(c => c.items.length)), span = rows * (nh + vg) - vg, H = top + span + 6;
    const pos = (c, i) => { const m = s.cols[c].items.length, tot = m * (nh + vg) - vg; return [c * (cw + gap), top + (span - tot) / 2 + i * (nh + vg)]; };
    let g = '';
    (s.links || []).forEach(([c, i, c2, j, d]) => { const [x0, y0] = pos(c, i), [x1, y1] = pos(c2, j), lit = on(c, i) && on(c2, j) && (s.hi != null || s.hiRow != null), a = x0 + cw, m = (a + x1) / 2; g += c === c2 ? `<path class="${lit ? 's1' : 's3'}" d="M${x0 + cw / 2} ${y0 + nh}V${y1}" stroke-width="${lit ? 2.2 : 1.2}" opacity="${lit ? 1 : .35}"/>` : `<path class="${lit ? 's1' : 's3'}" d="M${a} ${y0 + nh / 2}C${m} ${y0 + nh / 2} ${m} ${y1 + nh / 2} ${x1} ${y1 + nh / 2}" fill="none" stroke-width="${lit ? 2.2 : 1.2}" opacity="${lit ? 1 : .35}" ${d ? 'stroke-dasharray="4 4"' : ''}/>`; });
    s.cols.forEach((c, ci) => { g += `<text class="t-m" x="${ci * (cw + gap)}" y="14" font-size="10" font-weight="700" opacity=".75">${esc(c.t)}</text>`; c.items.forEach((it, i) => { const [x, y] = pos(ci, i), hl = s.hi === ci || s.hiRow === i, lit = on(ci, i), h = it.h || it, sub = it.t || '', fs = Math.min(15, cw / Math.max(5, h.length) * 1.05); g += `<g class="hit"${tipA(h, sub || c.t)}><rect class="${hl ? 'a1' : 'a4'} pop" x="${x}" y="${y}" width="${cw}" height="${nh}" opacity="${lit ? 1 : .4}" style="transition-delay:${ci * .1}s"/><text x="${x + 10}" y="${y + (sub ? nh / 2 - 1 : nh / 2 + 5)}" font-size="${fs}" font-weight="700" ${hl ? 'style="fill:var(--sheet,#fff)"' : ''} opacity="${lit ? 1 : .55}">${esc(h)}</text>${sub ? `<text class="t-m" x="${x + 10}" y="${y + nh / 2 + 15}" font-size="9.5" ${hl ? 'style="fill:var(--sheet,#fff)"' : ''} opacity="${lit ? .85 : .45}">${esc(sub)}</text>` : ''}</g>`; }); });
    if (s.foot) g += `<text class="t-m" x="0" y="${H + 14}" font-size="10.5" opacity=".75">${esc(s.foot)}</text>`;
    return { H: H + (s.foot ? 20 : 0), g };
  };

  /* a state machine: states in a row, labelled transitions, a way back, an optional branch */
  T.states = (s, W) => {
    const n = s.nodes.length, fg = 'style="fill:var(--sheet,#fff)"';
    if (W < 560) { // narrow: top to bottom
      const bh = 54, gp = 46; let g = '', y = 0;
      s.nodes.forEach((nd, i) => { const hi = s.hi === i; g += `<g class="hit"${tipA(nd.k, nd.t)}><rect class="${hi ? 'a1' : 'a4'} pop" x="0" y="${y}" width="${W * .55}" height="${bh}"/><text class="t-m" x="10" y="${y + 18}" font-size="9.5" ${hi ? fg : ''}>${esc(nd.k)}</text><text class="t-h" x="10" y="${y + 42}" font-size="19" ${hi ? fg : ''}>${esc(nd.t)}</text></g>`; y += bh; if (s.edges && s.edges[i]) { const e = s.edges[i]; g += `<path class="s3" d="M${W * .2} ${y + 4}v${gp - 8}m-5 -7l5 7 5 -7" fill="none" stroke-width="1.6"/><text x="${W * .2 + 14}" y="${y + gp / 2}" font-size="12" font-weight="700">${esc(e.t)}</text><text class="t-m" x="${W * .2 + 14}" y="${y + gp / 2 + 14}" font-size="9.5">${esc(e.c || '')}</text>`; y += gp; } });
      if (s.back) { g += `<path class="s1" d="M${W * .55} ${y - bh / 2}h${W * .12}V${bh / 2}H${W * .55}" fill="none" stroke-width="1.6" stroke-dasharray="4 4"/><text class="t-m" x="0" y="${y + 18}" font-size="10">↺ ${esc(s.back.t)}</text>`; y += 24; }
      if (s.branch) { y += 26; g += `<text class="t-m" x="0" y="${y}" font-size="10" font-weight="700">${esc(s.branch.t)}</text>`; y += 10; s.branch.nodes.forEach((t, i) => { g += `<rect class="a3" x="0" y="${y}" width="${W * .55}" height="30"/><text x="10" y="${y + 20}" font-size="13" font-weight="700" ${fg}>${esc(t)}</text>`; y += 36; }); }
      return { H: y + 4, g };
    }
    const gap = Math.max(40, W * .08), bw = (W - gap * (n - 1)) / n, top = s.edges ? 50 : 14, bh = 78;
    let g = '', H = top + bh;
    s.nodes.forEach((nd, i) => { const x = i * (bw + gap), hi = s.hi === i; g += `<g class="hit"${tipA(nd.k, nd.t)}><rect class="${hi ? 'a1' : 'a4'} pop" x="${x}" y="${top}" width="${bw}" height="${bh}" style="transition-delay:${i * .08}s"/><text class="t-m" x="${x + 12}" y="${top + 20}" font-size="10" ${hi ? fg : ''}>${String(i + 1).padStart(2, '0')} · ${esc(nd.k)}</text><text class="t-h" x="${x + 12}" y="${top + bh - 16}" font-size="${Math.min(26, bw / 4.4)}" ${hi ? fg : ''}>${esc(nd.t)}</text></g>`;
      if (i < n - 1) { const ax = x + bw + 6, bx = x + bw + gap - 6, e = s.edges && s.edges[i], lit = s.hi === i || s.hi === i + 1; g += `<path class="${lit ? 's1' : 's3'}" d="M${ax} ${top + bh / 2}H${bx}m-7 -5l7 5 -7 5" fill="none" stroke-width="${lit ? 2.4 : 1.6}"/>`; if (e) g += `<text x="${x + bw + gap / 2}" y="${top - 26}" font-size="12" font-weight="700" text-anchor="middle">${esc(e.t)}</text><text class="t-m" x="${x + bw + gap / 2}" y="${top - 11}" font-size="9.5" text-anchor="middle" opacity=".75">${esc(e.c || '')}</text><line class="gr" x1="${x + bw + gap / 2}" x2="${x + bw + gap / 2}" y1="${top - 6}" y2="${top + bh / 2 - 6}"/>`; }
    });
    if (s.back) { const y = top + bh, x0 = (n - 1) * (bw + gap) + bw / 2, x1 = bw / 2, lit = s.hi === n - 1 || s.hi === 0; g += `<path class="${lit ? 's1' : 's3'}" d="M${x0} ${y + 4}V${y + 30}H${x1}V${y + 8}m-5 7l5 -7 5 7" fill="none" stroke-width="${lit ? 2.2 : 1.4}" stroke-dasharray="5 4"/><text class="t-m" x="${(x0 + x1) / 2}" y="${y + 46}" font-size="10" text-anchor="middle">${esc(s.back.t)}</text>`; H = y + 54; }
    if (s.branch) { const y = H + 26, m = s.branch.nodes.length, w2 = Math.min(bw, (W - 140 - 24 * (m - 1)) / m); g += `<text class="t-m" x="0" y="${y + 20}" font-size="10" font-weight="700">${esc(s.branch.t)}</text>`; s.branch.nodes.forEach((t, i) => { const x = 140 + i * (w2 + 24); g += `<g class="hit"${tipA(s.branch.t, t)}><rect class="a3 pop" x="${x}" y="${y}" width="${w2}" height="40"/><text x="${x + 10}" y="${y + 26}" font-size="14" font-weight="800" ${fg}>${esc(t)}</text></g>${i < m - 1 ? `<path class="s3" d="M${x + w2 + 3} ${y + 20}h18" stroke-width="1.6"/>` : ''}`; }); if (s.branch.foot) g += `<text class="t-m" x="140" y="${y + 60}" font-size="10" opacity=".7">${esc(s.branch.foot)}</text>`; H = y + 68; }
    return { H, g };
  };

  /* stacked isometric plates, one per layer; hi lifts one out */
  T.layers = (s, W) => {
    const n = s.items.length, dw = Math.min(W * .46, 320), dh = dw * .36, dy = s.dy || 48, cx = dw / 2 + 4, top = 18, H = top + (n - 1) * dy + dh + 30, lx = dw + 34;
    let g = '';
    for (let i = n - 1; i >= 0; i--) { const it = s.items[i], hi = s.hi === i, y = top + i * dy - (hi ? 14 : 0); g += `<g class="hit"${tipA(`${it.k} · ${it.h}`, it.t || '')}><path class="${hi ? 'a1' : 'a4'}" d="M${cx} ${y}L${cx + dw / 2} ${y + dh / 2}L${cx} ${y + dh}L${cx - dw / 2} ${y + dh / 2}Z" stroke="var(--ink)" stroke-width="${hi ? 0 : 1}" stroke-opacity=".35" opacity="${s.hi == null || hi ? 1 : .8}"/><path d="M${cx - dw / 2} ${y + dh / 2}v6L${cx} ${y + dh + 6}L${cx + dw / 2} ${y + dh / 2 + 6}v-6L${cx} ${y + dh}Z" class="${hi ? 'a3' : 'a4'}" opacity="${hi ? .9 : .6}"/>${hi ? `<text class="t-h" x="${cx}" y="${y + dh / 2 + 6}" font-size="${dh * .32}" text-anchor="middle" style="fill:var(--sheet,#fff)">${esc(it.k)}</text>` : ''}</g>`; }
    s.items.forEach((it, i) => { const hi = s.hi === i, y = top + i * dy - (hi ? 14 : 0) + dh / 2; g += `<line class="${hi ? 's1' : 's3'}" x1="${cx + dw / 2 + 4}" x2="${lx - 6}" y1="${y}" y2="${top + i * dy + dh / 2}" stroke-width="${hi ? 2 : 1}" opacity="${hi ? 1 : .35}"/><g opacity="${s.hi == null || hi ? 1 : .5}"><text class="t-m" x="${lx}" y="${top + i * dy + dh / 2 - 8}" font-size="9.5">${String(i + 1).padStart(2, '0')} / ${esc(it.k)}</text><text x="${lx}" y="${top + i * dy + dh / 2 + 9}" font-size="${hi ? 15 : 13.5}" font-weight="800">${esc(it.h)}</text>${it.c ? `<text class="t-m" x="${lx}" y="${top + i * dy + dh / 2 + 23}" font-size="9.5" opacity=".75">${esc(it.c)}</text>` : ''}</g>`; });
    return { H, g };
  };

  /* a hex field: enemy, player, telegraphed cells */
  T.hex = (s, W) => {
    const C = s.cols || 11, R = s.rows || 5, r = Math.min(W / ((C + .5) * Math.sqrt(3)), 34), hw = Math.sqrt(3) * r, H = (R - 1) * r * 1.5 + 2 * r + 30;
    const at = (c, q) => [hw * (c + .5 + (q % 2) * .5), r + q * r * 1.5], key = (c, q) => c + ',' + q, lit = new Set((s.lit || []).map(([c, q]) => key(c, q)));
    const hexP = (x, y, k = .94) => Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 180 * (60 * i - 90); return `${(x + r * k * Math.cos(a)).toFixed(1)},${(y + r * k * Math.sin(a)).toFixed(1)}`; }).join(' ');
    let g = '';
    for (let q = 0; q < R; q++) for (let c = 0; c < C; c++) { const [x, y] = at(c, q), on = lit.has(key(c, q)); g += `<polygon points="${hexP(x, y)}" class="${on ? (s.litCls || 'a2') : ''}" ${on ? `opacity="${s.litOp || 1}"` : 'fill="none"'} stroke="var(--ink)" stroke-opacity="${on ? .5 : .16}" stroke-width="1"${on && s.litDash ? ' stroke-dasharray="3 3"' : ''}/>`; }
    if (s.pull) { const [x0, y0] = at(...s.pull[0]), [x1, y1] = at(...s.pull[1]); g += `<path class="s1 draw" d="M${x0} ${y0}L${x1 + 8} ${y1}" stroke-width="3" style="--len:${W}"/><path class="a1" d="M${x1 + 2} ${y1}l12 -7v14z"/>`; }
    if (s.ghost) { const [x, y] = at(...s.ghost); g += `<circle cx="${x}" cy="${y}" r="${r * .42}" fill="none" class="s3" stroke-width="1.5" stroke-dasharray="3 3"/>${s.ghostT ? `<text class="t-m" x="${x}" y="${y - r * .7}" font-size="10" text-anchor="middle">${esc(s.ghostT)}</text>` : ''}`; }
    const [ex, ey] = at(...s.enemy), [px, py] = at(...s.player);
    g += `<g class="hit"${tipA(s.enemyT || '敌人', s.state || '')}>${glyph('b', ex, ey, r * .5, 'a3 pop')}<text class="t-m" x="${ex}" y="${ey + r + 12}" font-size="10" text-anchor="middle">${esc(s.enemyT || '敌人')}</text></g><g class="hit"${tipA('玩家', s.state || '')}>${glyph('a', px, py, r * .42, 'a1 pop')}<text class="t-m" x="${px}" y="${py + r + 12}" font-size="10" text-anchor="middle">玩家</text></g>`;
    if (s.note) g += `<text class="t-h" x="${W - 4}" y="${H - 4}" font-size="15" text-anchor="end">${esc(s.note)}</text>`;
    return { H, g };
  };

  /* two story lines across episodes, phase bands on top */
  T.braid = (s, W) => {
    const n = s.n, l = W < 520 ? 12 : 92, r = 18, x = lin(1, n, l + 10, W - r), top = 54, band = 170, H = top + band + 48, y = v => top + 14 + v * (band - 28);
    let g = '';
    s.phases.forEach(([a, b, t], i) => { const x0 = x(a) - (a === 1 ? 10 : (x(a) - x(a - 1)) / 2), x1 = x(b) + (b === n ? r - 4 : (x(b + 1) - x(b)) / 2); g += `<rect class="${i === 1 ? 'a1' : 'a4'}" x="${x0}" y="${top}" width="${x1 - x0}" height="${band}" opacity="${i === 1 ? .14 : .5 - i * .1}"/><text class="t-h" x="${x0 + 6}" y="${top - 26}" font-size="${W < 520 ? 12 : 15}">${esc(t[0])}</text><text class="t-m" x="${x0 + 6}" y="${top - 10}" font-size="9.5">${esc(t[1] || '')}</text>`; });
    for (let e = 1; e <= n; e++) g += `<text class="t-m" x="${x(e)}" y="${H - 22}" font-size="9.5" text-anchor="middle">${String(e).padStart(2, '0')}</text>`;
    g += `<text class="t-m" x="${W - r}" y="${H - 6}" font-size="9.5" text-anchor="end" opacity=".6">EPISODE</text>`;
    const curve = v => { const p = v.map((q, i) => [x(i + 1), y(q)]); let d = `M${p[0][0]} ${p[0][1]}`; for (let i = 1; i < p.length; i++) { const m = (p[i - 1][0] + p[i][0]) / 2; d += `C${m} ${p[i - 1][1]} ${m} ${p[i][1]} ${p[i][0]} ${p[i][1]}`; } return d; };
    s.lines.forEach((ln, k) => { g += `<path class="${k ? 's3' : 's1'} draw" d="${curve(ln.v)}" fill="none" stroke-width="${k ? 3 : 4}" style="--len:${W * 1.6}"/>`; if (W >= 520) g += `<text x="0" y="${y(ln.v[0]) + 5}" font-size="13" font-weight="800">${esc(ln.name)}</text>`; });
    s.lines.forEach((ln, k) => ln.nodes.forEach(([e, t]) => { const cx = x(e), cy = y(ln.v[Math.round(e) - 1]), up = !k; g += `<g class="hit"${tipA(`${ln.name} · EP.${String(Math.round(e)).padStart(2, '0')}`, t)}>${glyph(k ? 'b' : 'a', cx, cy, 7, `${k ? 'a3' : 'a1'} pop`)}<text x="${cx}" y="${up ? cy - 14 : cy + 24}" font-size="${W < 520 ? 10.5 : 12.5}" font-weight="700" text-anchor="middle">${esc(t)}</text></g>`; }));
    (s.marks || []).forEach(([e, t]) => { const cx = x(e); g += `<line class="s1" x1="${cx}" x2="${cx}" y1="${top}" y2="${top + band}" stroke-width="1.2" stroke-dasharray="2 4"/><text class="t-m" x="${cx + 5}" y="${top + band - 6}" font-size="9.5">${esc(t)}</text>`; });
    if (W < 520) g += s.lines.map((ln, k) => `${glyph(k ? 'b' : 'a', 6 + k * 110, H - 4, 5, k ? 'a3' : 'a1')}<text x="${16 + k * 110}" y="${H}" font-size="11" font-weight="700">${esc(ln.name)}</text>`).join('');
    return { H: H + (W < 520 ? 10 : 0), g };
  };

  /* generative radial type after the V4 encoding; each slider is one input, normalised 0—1 */
  T.radial = (s, W) => {
    const v = s.v || (s.v = Object.fromEntries(s.ctrl.map(c => [c.k, c.d]))), H = Math.min(W, s.h || 560), cx = W / 2, cy = H / 2, maxR = H * .36;
    const R = maxR * (.5 + .46 * v.flow), n = Math.round(14 + 34 * v.flow), lobes = 2 + Math.round(v.noise * 6), amp = .04 + .22 * v.noise, size = H * .024 * (.8 + .85 * v.pm), lean = (v.wind - .45) * .55, word = s.word || 'AFTERGLOW';
    const rr = (t, j) => R * (1 + amp * Math.sin(t * lobes - 1 + j * .55 * v.noise * .2));
    let g = `<circle cx="${cx}" cy="${cy}" r="${maxR * .2}" class="a1"/><circle cx="${cx}" cy="${cy}" r="${R * (1.2 + .22 * v.pm)}" fill="none" class="s3" stroke-dasharray="2 6" stroke-opacity=".4"/>`;
    let d = ''; for (let i = 0; i <= 120; i++) { const t = i / 120 * Math.PI * 2, r = R * (1 + amp * Math.sin(t * lobes - 1)); d += (i ? 'L' : 'M') + (cx + Math.cos(t) * r).toFixed(1) + ' ' + (cy + Math.sin(t) * r).toFixed(1); }
    g += `<path d="${d}Z" fill="none" class="s1" stroke-width="1.4" opacity=".6"/>`;
    for (let i = 0; i < n; i++) {
      const t = i / n * Math.PI * 2, r = rr(t, i), x0 = (cx + Math.cos(t) * r).toFixed(1), y0 = (cy + Math.sin(t) * r).toFixed(1), deg = ((t + lean) * 180 / Math.PI).toFixed(1);
      g += `<text x="${x0}" y="${y0}" font-size="${size.toFixed(1)}" transform="rotate(${deg} ${x0} ${y0})" class="t-h" opacity="${i % 3 ? .55 : 1}">${esc(word)}</text>`;
    }
    g += `<text class="t-h" x="${cx}" y="${cy + 6}" font-size="${H * .034}" text-anchor="middle" style="fill:var(--sheet,#fff)">${esc(s.center || '')}</text><text class="t-m" x="0" y="${H - 4}" font-size="10" opacity=".7">${n} 个字 · ${lobes} 瓣 · 倾斜 ${(lean * 180 / Math.PI).toFixed(0)}°</text>`;
    return { H, g, ctrl: s.ctrl };
  };

  /* small multiples sharing one time axis; hover a column for every value at that moment */
  T.multi = (s, W) => {
    const n = s.series.length, rh = s.rowH || 66, l = W < 520 ? 74 : 128, r = 14, top = 6, H = top + n * rh + 28, m = s.x.length, x = lin(0, m - 1, l, W - r), step = (W - l - r) / (m - 1);
    let g = '';
    s.series.forEach((se, k) => {
      const y0 = top + k * rh, y = lin(se.range[0], se.range[1], y0 + rh - 10, y0 + 8), pts = se.v.map((q, i) => [x(i), y(q)]);
      const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('');
      g += `<line class="gr" x1="${l}" x2="${W - r}" y1="${y0 + rh - 10}" y2="${y0 + rh - 10}"/><path d="${d}L${x(m - 1)} ${y0 + rh - 10}L${l} ${y0 + rh - 10}Z" class="${k % 2 ? 'a2' : 'a1'}" opacity=".16"/><path class="${k % 2 ? 's3' : 's1'} draw" d="${d}" fill="none" stroke-width="2" style="--len:${W * 1.4}"/>${pts.map(([a, b]) => `<circle cx="${a}" cy="${b}" r="2.4" class="${k % 2 ? 'a3' : 'a1'}"/>`).join('')}<text x="0" y="${y0 + rh / 2}" font-size="${W < 520 ? 12 : 14}" font-weight="800">${esc(se.name)}</text><text class="t-m" x="0" y="${y0 + rh / 2 + 15}" font-size="9.5" opacity=".7">${esc(se.unit || '')}</text>`;
    });
    s.x.forEach((t, i) => { if (i % (s.every || 3) === 0) g += `<text class="t-m" x="${x(i)}" y="${H - 8}" font-size="9.5" text-anchor="middle">${esc(t)}</text>`; g += `<rect x="${x(i) - step / 2}" y="${top}" width="${step}" height="${n * rh}" fill="transparent" class="hit"${tipA(t, s.series.map(se => `${se.name} ${se.v[i]}${se.u || ''}`).join(' · '))}/>`; });
    return { H, g };
  };

  /* a loop of nodes around a hub */
  T.cycle = (s, W) => {
    const n = s.nodes.length, H = Math.min(Math.max(W * .62, 300), 440), cx = W / 2, cy = H / 2, ry = H * .36, rx = Math.min(W * .38, ry * 1.9), pos = i => { const t = -Math.PI / 2 + i / n * Math.PI * 2; return [cx + rx * Math.cos(t), cy + ry * Math.sin(t), t]; };
    let g = '';
    for (let i = 0; i < n; i++) { const [, , t0] = pos(i), t1 = t0 + Math.PI * 2 / n, a = t0 + .26, b = t1 - .26, p = q => [cx + rx * Math.cos(q), cy + ry * Math.sin(q)], [x0, y0] = p(a), [x1, y1] = p(b), [mx, my] = p((a + b) / 2), [px, py] = p(b - .05), ang = Math.atan2(y1 - py, x1 - px) * 180 / Math.PI; g += `<path class="s1 draw" d="M${x0} ${y0}Q${mx + (mx - cx) * .08} ${my + (my - cy) * .08} ${x1} ${y1}" fill="none" stroke-width="2" style="--len:${W};transition-delay:${i * .12}s"/><path class="a1" d="M${x1} ${y1}l-10 -5v10z" transform="rotate(${ang} ${x1} ${y1})"/>`; }
    s.nodes.forEach((t, i) => { const [x, y] = pos(i), w = Math.max(84, t.length * 15 + 26); g += `<line class="s3" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke-dasharray="2 5" opacity=".35"/><g class="hit"${tipA(`0${i + 1} · ${t}`, s.tips ? s.tips[i] : '')}><rect class="${i === s.hi ? 'a1' : 'a3'} pop" x="${x - w / 2}" y="${y - 19}" width="${w}" height="38" rx="19"/><text x="${x}" y="${y + 6}" font-size="14" font-weight="800" text-anchor="middle" style="fill:var(--sheet,#fff)">${esc(t)}</text></g>`; });
    g += `<circle cx="${cx}" cy="${cy}" r="${Math.min(ry * .5, 64)}" class="a4 pop"/><text class="t-h" x="${cx}" y="${cy + 2}" font-size="${Math.min(24, W * .045)}" text-anchor="middle">${esc(s.hub || '')}</text><text class="t-m" x="${cx}" y="${cy + 20}" font-size="9.5" text-anchor="middle">${esc(s.hubT || '')}</text>`;
    return { H, g };
  };

  /* a route with stops, like a line map */
  T.route = (s, W) => {
    const n = s.stops.length, l = 30, r = 30, x = i => l + i * (W - l - r) / (n - 1), y = 56, sp = (W - l - r) / (n - 1), ch = Math.max(4, Math.floor(sp / 13)), H = 150;
    let g = `<line class="s1 draw" x1="${x(0)}" x2="${x(n - 1)}" y1="${y}" y2="${y}" stroke-width="7" stroke-linecap="round" style="--len:${W}"/>`;
    s.stops.forEach((t, i) => { const up = i % 2 === 1 && sp < 150, hi = s.hi === i, ln = wrap(t, ch).slice(0, 3), an = i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle', tx = x(i) + (i === 0 ? -10 : i === n - 1 ? 10 : 0); g += `<g class="hit"${tipA(`0${i + 1}`, t)}><circle cx="${x(i)}" cy="${y}" r="${hi ? 12 : 9}" style="fill:${hi ? 'var(--ink)' : 'var(--sheet,#fff)'}" class="s3 pop" stroke-width="3"/><text class="t-m" x="${tx}" y="${up ? y - 40 : y + 30}" font-size="10" text-anchor="${an}" font-weight="700">0${i + 1}</text>${ln.map((q, k) => `<text x="${tx}" y="${up ? y - 24 - (ln.length - 1 - k) * 15 : y + 47 + k * 15}" font-size="12.5" font-weight="${hi ? 800 : 600}" text-anchor="${an}">${esc(q)}</text>`).join('')}</g>`; });
    return { H: s.stops.some((_, i) => i % 2 === 1) && sp < 150 ? H + 10 : H, g: sp < 150 ? `<g transform="translate(0 ${30})">${g}</g>` : g };
  };

  /* service blueprint: stages × front / back, one stage lit */
  T.blue = (s, W) => {
    const n = s.cols.length, lw = W < 520 ? 0 : 80, cw = (W - lw) / n, top = 40, lane = s.lh || 92, gap = 26, H = top + lane * 2 + gap + 6;
    let g = `<line class="s3" x1="0" x2="${W}" y1="${top + lane + gap / 2}" y2="${top + lane + gap / 2}" stroke-dasharray="6 5" opacity=".6"/><text class="t-m" x="${W}" y="${top + lane + gap / 2 - 5}" font-size="9" text-anchor="end" opacity=".7">LINE OF VISIBILITY</text>`;
    s.cols.forEach((c, j) => { const x = lw + j * cw, hi = s.hi === j; g += `<text class="t-h" x="${x + 6}" y="${top - 14}" font-size="${hi ? 17 : 15}" opacity="${hi || s.hi == null ? 1 : .5}">${esc(c)}</text>`; s.lanes.forEach((ln, k) => { const y = top + k * (lane + gap), lines = String(ln.v[j]).split(' · '); g += `<g class="hit"${tipA(`${c} · ${ln.t}`, ln.v[j])}><rect class="${hi ? (k ? 'a3' : 'a1') : 'a4'} pop" x="${x + 3}" y="${y}" width="${cw - 6}" height="${lane}" opacity="${hi || s.hi == null ? 1 : .55}" style="transition-delay:${j * .1}s"/>${lines.slice(0, 4).map((q, m) => `<text x="${x + 14}" y="${y + 26 + m * 19}" font-size="${Math.min(13.5, cw / 9)}" font-weight="${m ? 500 : 800}" ${hi ? 'style="fill:var(--sheet,#fff)"' : ''}>${esc(q)}</text>`).join('')}</g>`; }); });
    if (lw) s.lanes.forEach((ln, k) => { g += `<text class="t-m" x="0" y="${top + k * (lane + gap) + 18}" font-size="10" font-weight="700">${esc(ln.t)}</text>`; });
    return { H, g };
  };

  /* image tiles with labels; swatch: true samples each image's palette in the browser */
  T.tiles = (s, W) => {
    const n = s.items.length, per = W < 560 ? Math.min(2, n) : (s.per || n), gap = 12, tw = (W - gap * (per - 1)) / per, th = tw / (s.ar || 1.4), lab = s.swatch ? 74 : 46, rows = Math.ceil(n / per);
    let g = '', H = rows * (th + lab) + (rows - 1) * 10;
    s.items.forEach((it, i) => { const x = (i % per) * (tw + gap), y = Math.floor(i / per) * (th + lab + 10), hi = s.hi === i; g += `<g class="hit"${tipA(it.label, it.sub || '')}><rect class="a4" x="${x}" y="${y}" width="${tw}" height="${th}"/><svg x="${x}" y="${y}" width="${tw}" height="${th}" style="overflow:hidden"><image href="${esc(it.src)}" width="${tw}" height="${th}" preserveAspectRatio="${s.fit === 'meet' ? 'xMidYMid meet' : 'xMidYMid slice'}"/></svg>${hi ? `<rect x="${x + 1.5}" y="${y + 1.5}" width="${tw - 3}" height="${th - 3}" fill="none" class="s1" stroke-width="3"/>` : ''}<text class="t-m" x="${x}" y="${y + th + 16}" font-size="10" font-weight="700">${esc(it.k || String(i + 1).padStart(2, '0'))}</text><text x="${x}" y="${y + th + 34}" font-size="${Math.min(15, tw / 9)}" font-weight="800">${esc(it.label)}</text>${s.swatch ? `<g data-sw="${esc(it.src)}" data-x="${x}" data-y="${y + th + 46}" data-w="${tw}"></g>` : ''}</g>`; });
    if (s.foot) { const m = s.foot.length, fw = (W - gap * (m - 1)) / m, y = H + 16; g += `<text class="t-m" x="0" y="${y + 8}" font-size="10" font-weight="700">${esc(s.footT || '')}</text>`; s.foot.forEach(([h, t], i) => { const x = i * (fw + gap); g += `<g class="hit"${tipA(h, t)}><rect class="${i === s.footHi ? 'a1' : 'a3'} grow" x="${x}" y="${y + 16}" width="${fw}" height="58" style="transition-delay:${i * .1}s"/><text class="t-m" x="${x + 10}" y="${y + 34}" font-size="9.5" style="fill:var(--sheet,#fff)">${esc(t)}</text><text class="t-h" x="${x + 10}" y="${y + 62}" font-size="${Math.min(19, fw / 6.5)}" style="fill:var(--sheet,#fff)">${esc(h)}</text></g>`; }); H = y + 78; }
    if (s.note) { g += `<text class="t-m" x="0" y="${H + 16}" font-size="10.5" opacity=".75">${esc(s.note)}</text>`; H += 22; }
    return { H, g };
  };
  const palette = (src, k = 5) => new Promise(res => {
    const im = new Image(); im.onerror = () => res([]);
    im.onload = () => { try { const c = document.createElement('canvas'), w = 64, h = Math.max(1, Math.round(64 * im.naturalHeight / im.naturalWidth)); c.width = w; c.height = h; const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0, w, h); const d = x.getImageData(0, 0, w, h).data, m = new Map(); for (let i = 0; i < d.length; i += 4) { if (d[i + 3] < 200) continue; const r = d[i], gg = d[i + 1], b = d[i + 2]; if (Math.min(r, gg, b) > 228 || Math.max(r, gg, b) < 18) continue; const key = (r >> 5) << 6 | (gg >> 5) << 3 | (b >> 5), e = m.get(key) || [0, 0, 0, 0]; e[0] += r; e[1] += gg; e[2] += b; e[3]++; m.set(key, e); } const out = []; for (const e of [...m.values()].sort((a, b) => b[3] - a[3])) { const q = [e[0] / e[3], e[1] / e[3], e[2] / e[3]].map(Math.round); if (out.every(o => Math.hypot(o[0] - q[0], o[1] - q[1], o[2] - q[2]) > 56)) out.push(q); if (out.length >= k) break; } res(out); } catch (e) { res([]); } };
    im.src = src;
  });

  /* a pipeline whose stages each carry a small drawing of what they hold */
  const stageArt = (k, x, y, w, h, on) => {
    const ink = on ? 'var(--sheet,#fff)' : 'var(--ink)', acc = on ? 'var(--sheet,#fff)' : 'var(--cobalt)';
    let g = '';
    if (k === 'grid') { const cs = Math.min(w / 13, h / 6.5); for (let r = 0; r < 5; r++) for (let c = 0; c < 12; c++) g += `<circle cx="${x + c * cs + cs / 2}" cy="${y + r * cs + cs / 2}" r="${cs * .3}" fill="${(c * 5 + r) % 7 === 0 ? acc : ink}" opacity="${(c * 5 + r) % 7 === 0 ? 1 : .45}"/>`; g += `<text class="t-m" x="${x}" y="${y + 5 * cs + 13}" font-size="9" fill="${ink}" style="fill:${ink}">12 × 5</text>`; }
    if (k === 'bars') { const n = [8, 8, 10, 8, 6, 8], bh = Math.min(h / 7.2, 12); n.forEach((v, i) => { g += `<rect x="${x + 12}" y="${y + i * (bh + 3)}" width="${(w - 14) * v / 10}" height="${bh}" fill="${i === 2 ? acc : ink}" opacity="${i === 2 ? 1 : .5}"/><text class="t-m" x="${x}" y="${y + i * (bh + 3) + bh - 2}" font-size="8.5" style="fill:${ink}">${'ABCDEF'[i]}</text>`; }); }
    if (k === 'net') { const L = [[48, 9], [64, 11], [32, 7], [1, 1]], pts = L.map(([, m], j) => Array.from({ length: m }, (_, i) => [x + 6 + j * (w - 12) / 3, y + (i + .5) * h * .86 / m])); for (let j = 0; j < 3; j++) pts[j].forEach(p => pts[j + 1].forEach(q => { g += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${ink}" stroke-width=".5" opacity=".22"/>`; })); pts.forEach((c, j) => c.forEach(p => { g += `<circle cx="${p[0]}" cy="${p[1]}" r="${j === 3 ? 5 : 2.6}" fill="${j === 3 ? acc : ink}"/>`; })); L.forEach(([n], j) => { g += `<text class="t-m" x="${x + 6 + j * (w - 12) / 3}" y="${y + h * .86 + 13}" font-size="8.5" text-anchor="middle" style="fill:${ink}">${n}</text>`; }); }
    if (k === 'gauge') { const cx = x + w / 2, cy = y + h * .72, r = Math.min(w * .42, h * .66), P = a => [cx + r * Math.cos(a), cy + r * Math.sin(a)], a1 = Math.PI + Math.PI * .86, [ex, ey] = P(a1), [sx, sy] = P(Math.PI); g += `<path d="M${sx} ${sy}A${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="none" stroke="${ink}" stroke-width="6" opacity=".2"/><path d="M${sx} ${sy}A${r} ${r} 0 0 1 ${ex} ${ey}" fill="none" stroke="${acc}" stroke-width="6"/><line x1="${cx}" y1="${cy}" x2="${ex}" y2="${ey}" stroke="${ink}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="4" fill="${ink}"/><text class="t-h" x="${cx}" y="${cy + 20}" font-size="15" text-anchor="middle" style="fill:${ink}">0.86</text>`; }
    return g;
  };
  T.pipe = (s, W) => {
    const n = s.stages.length, narrow = W < 620, per = narrow ? 2 : n, gap = narrow ? 14 : 34, bw = (W - gap * (per - 1)) / per, bh = s.bh || 250, rows = Math.ceil(n / per), H = rows * bh + (rows - 1) * 18 + (s.foot ? 26 : 4);
    let g = '';
    s.stages.forEach((st, i) => {
      const x = (i % per) * (bw + gap), y = Math.floor(i / per) * (bh + 18), on = s.hi === i, fg = on ? 'style="fill:var(--sheet,#fff)"' : '';
      g += `<g class="hit"${tipA(st.h, st.t)}><path class="${on ? 'a1' : 'a4'} pop" d="M${x} ${y}H${x + bw - 16}L${x + bw} ${y + 16}V${y + bh}H${x + 16}L${x} ${y + bh - 16}Z" style="transition-delay:${i * .12}s"/><path d="M${x + 6} ${y + 18}V${y + 6}H${x + 18}M${x + bw - 6} ${y + bh - 18}V${y + bh - 6}H${x + bw - 18}" fill="none" stroke="var(--cobalt)" stroke-width="1.6" ${on ? 'style="stroke:var(--sheet,#fff)"' : ''}/>
        <text class="t-m" x="${x + 16}" y="${y + 30}" font-size="10" ${fg}>${String(i + 1).padStart(2, '0')} · ${esc(st.k)}</text><text class="t-h" x="${x + 16}" y="${y + 56}" font-size="${Math.min(19, bw / 8.5)}" ${fg}>${esc(st.h)}</text>
        <g transform="translate(0 0)">${stageArt(st.art, x + 16, y + 72, bw - 32, bh - 140, on)}</g>
        ${wrap(st.t, Math.max(8, Math.floor((bw - 32) / 11.5))).slice(0, 3).map((q, m) => `<text x="${x + 16}" y="${y + bh - 50 + m * 15}" font-size="11.5" ${fg} opacity=".85">${esc(q)}</text>`).join('')}</g>`;
      if (i < n - 1 && (i % per) < per - 1) g += `<path class="s1 draw" d="M${x + bw + 4} ${y + bh / 2}h${gap - 10}" stroke-width="2" style="--len:60"/><path class="a1" d="M${x + bw + gap - 4} ${y + bh / 2}l-8 -5v10z"/>`;
    });
    if (s.foot) g += `<text class="t-m" x="0" y="${H - 6}" font-size="10.5" opacity=".75">${esc(s.foot)}</text>`;
    return { H, g };
  };

  /* reliability diagram: predicted vs observed, the gap to the diagonal shaded */
  T.rel = (s, W) => {
    const sz = Math.min(W, s.h || 420), l = 46, r = 14, t = 14, b = 40, H = sz, x = lin(0, 1, l, W - r), y = lin(0, 1, H - b, t);
    let g = '';
    [0, .2, .4, .6, .8, 1].forEach(v => { g += `<line class="gr" x1="${x(v)}" x2="${x(v)}" y1="${t}" y2="${H - b}"/><line class="gr" x1="${l}" x2="${W - r}" y1="${y(v)}" y2="${y(v)}"/><text class="t-m" x="${x(v)}" y="${H - b + 15}" font-size="9.5" text-anchor="middle">${v}</text><text class="t-m" x="${l - 6}" y="${y(v) + 3}" font-size="9.5" text-anchor="end">${v}</text>`; });
    s.pts.forEach(([p, o], i) => { const w = 9; g += `<rect x="${x(p) - w / 2}" y="${y(Math.max(p, o))}" width="${w}" height="${Math.abs(y(p) - y(o))}" class="a2" opacity=".45"/>`; });
    g += `<line class="s3" x1="${x(0)}" y1="${y(0)}" x2="${x(1)}" y2="${y(1)}" stroke-dasharray="4 4" opacity=".6"/><text class="t-m" x="${x(.72)}" y="${y(.66)}" font-size="9.5" transform="rotate(${-Math.atan2(y(0) - y(1), x(1) - x(0)) * 180 / Math.PI} ${x(.72)} ${y(.66)})" opacity=".7">完全校准</text>`;
    g += `<path class="s1 draw" d="${s.pts.map(([p, o], i) => (i ? 'L' : 'M') + x(p) + ' ' + y(o)).join('')}" fill="none" stroke-width="2.4" style="--len:${W * 2}"/>`;
    s.pts.forEach(([p, o], i) => { g += `<g class="hit"${tipA(`预测 ≈ ${p}`, `实际比例 ≈ ${o} · 偏差 ${(o - p).toFixed(2)}`)}><circle class="a1 pop" cx="${x(p)}" cy="${y(o)}" r="6"/></g>`; });
    g += `<text class="t-m" x="${W - r}" y="${H - 4}" font-size="10" text-anchor="end">预测概率</text><text class="t-m" x="${l}" y="${t - 2}" font-size="10">实际比例</text>`;
    if (s.badge) g += `<g><rect x="${l + 10}" y="${t + 8}" width="140" height="42" class="a3"/><text class="t-h" x="${l + 20}" y="${t + 30}" font-size="15" style="fill:var(--sheet,#fff)">${esc(s.badge[0])}</text><text class="t-m" x="${l + 20}" y="${t + 44}" font-size="9.5" style="fill:var(--sheet,#fff)">${esc(s.badge[1])}</text></g>`;
    (s.marks || []).forEach(([p, o, tx]) => { g += `<text class="t-m" x="${x(p) + 10}" y="${y(o) - 8}" font-size="10" font-weight="700">${esc(tx)}</text>`; });
    return { H, g };
  };

  /* signed bars around a baseline (ablations): left = worse, right = better */
  T.diverge = (s, W) => {
    const lw = Math.min(W * .3, 190), rh = s.rowH || 30, top = 22, H = top + s.rows.length * rh + 30, [a, b] = s.axis, x = lin(a, b, lw, W - 54), z = x(0);
    let g = (s.ticks || [a, 0, b]).map(v => `<line class="gr" x1="${x(v)}" x2="${x(v)}" y1="${top - 6}" y2="${H - 26}"/><text class="t-m" x="${x(v)}" y="${H - 10}" font-size="9.5" text-anchor="middle">${v > 0 ? '+' : ''}${v}</text>`).join('');
    g += `<line class="s3" x1="${z}" x2="${z}" y1="${top - 10}" y2="${H - 26}" stroke-width="1.6"/><text class="t-m" x="${z}" y="${top - 12}" font-size="9.5" text-anchor="middle">${esc(s.base || '基线')}</text>`;
    s.rows.forEach((r, i) => { const y0 = top + i * rh, v = r.v, x1 = x(v), neg = v < 0, base = r.base; g += `<g class="hit"${tipA(r.label, `${r.t || ''}${r.t ? ' · ' : ''}Δ ${v > 0 ? '+' : ''}${v}`)}><text x="${lw - 10}" y="${y0 + rh / 2 + 4}" font-size="12" font-weight="${base ? 800 : 600}" text-anchor="end">${esc(r.label)}</text>${base ? `<circle cx="${z}" cy="${y0 + rh / 2}" r="5" class="a3"/>` : `<rect class="${neg ? (s.negCls || 'a2') : 'a1'} grow" x="${Math.min(z, x1)}" y="${y0 + 5}" width="${Math.max(1.5, Math.abs(x1 - z))}" height="${rh - 10}" style="transform-origin:${neg ? 'right' : 'left'} center;transition-delay:${i * .03}s"/>`}<text class="t-m" x="${neg ? Math.min(z, x1) - 6 : Math.max(z, x1) + 6}" y="${y0 + rh / 2 + 4}" font-size="10" text-anchor="${neg ? 'end' : 'start'}">${esc(r.t || '')}</text></g>`; });
    return { H, g };
  };

  /* a crop of an original image (paper figures, screenshots): no SVG wrapper, real pixels */
  const crop = s => `<div class="vz-crop" style="aspect-ratio:${s.w}/${s.h};position:relative;overflow:hidden;background:#fff"><img src="${esc(s.src)}" alt="${esc(s.alt || '')}" loading="lazy" style="position:absolute;max-width:none;width:${(s.iw / s.w * 100).toFixed(3)}%;left:${(-s.x / s.w * 100).toFixed(3)}%;top:${(-s.y / s.h * 100).toFixed(3)}%">${(s.marks || []).map(([mx, my, n, t, b]) => `<span class="vz-mk" style="left:${((mx - s.x) / s.w * 100).toFixed(2)}%;top:${((my - s.y) / s.h * 100).toFixed(2)}%" tabindex="0" data-tip="${esc(t)}" data-tipb="${esc(b || '')}"><i>${esc(n)}</i><em>${esc(t)}<small>${esc(b || '')}</small></em></span>`).join('')}</div>`;

  /* ---------- mount ---------- */
  const draw = el => {
    const s = el._spec; if (!s) return;
    const box = el.querySelector('.vz-c');
    if (s.type === 'crop') { box.innerHTML = crop(s); return; }
    const W = Math.max(280, Math.round(box.clientWidth || el.clientWidth || 600));
    if (el._w === W) return; el._w = W;
    const fn = T[s.type]; if (!fn) { box.textContent = 'chart: ' + s.type; return; }
    const { H, g, legend, ctrl } = fn(s, W);
    box.innerHTML = `${legend ? `<ul class="vz-legend">${legend.map(([t, c]) => `<li><i class="${c}" style="background:var(${{ a1: '--cobalt', a2: '--sky', a3: '--ink', a4: '--pale' }[c]})"></i>${esc(t)}</li>`).join('')}</ul>` : ''}<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(s.label || '')}">${g}</svg>`;
    // sliders, built once; each one redraws the chart
    if (ctrl && !el.querySelector('.vz-ctrl')) {
      const c = document.createElement('div'); c.className = 'vz-ctrl';
      c.innerHTML = ctrl.map(q => `<label><span>${esc(q.label)}</span><input type="range" min="${q.min}" max="${q.max}" step="${q.step}" value="${s.v[q.k]}" data-k="${q.k}"><output>${s.v[q.k]}</output></label>`).join('') + '<button type="button" class="vz-reset">复位</button>';
      box.after(c);
      c.addEventListener('input', e => { const k = e.target.dataset.k; if (!k) return; s.v[k] = +e.target.value; e.target.nextElementSibling.textContent = e.target.value; el._w = 0; draw(el); });
      c.querySelector('.vz-reset').addEventListener('click', () => { ctrl.forEach(q => { s.v[q.k] = q.d; const i = c.querySelector(`[data-k="${q.k}"]`); i.value = q.d; i.nextElementSibling.textContent = q.d; }); el._w = 0; draw(el); });
    }
    // palette swatches sampled from the images themselves
    box.querySelectorAll('[data-sw]').forEach(gEl => palette(gEl.dataset.sw).then(cs => { const x = +gEl.dataset.x, y = +gEl.dataset.y, w = Math.min(+gEl.dataset.w, 5 * 30) / 5; gEl.innerHTML = cs.map((q, i) => { const hex = '#' + q.map(v => v.toString(16).padStart(2, '0')).join(''); return `<rect x="${x + i * w}" y="${y}" width="${w - 3}" height="18" fill="${hex}"/><text class="t-m" x="${x + i * w}" y="${y + 28}" font-size="7.5" opacity=".7">${hex}</text>`; }).join(''); }));
    // flow: hover a node lights its links
    if (s.type === 'flow') box.querySelectorAll('.nd').forEach(n => { const on = v => box.querySelectorAll('.ln').forEach(l => l.classList.toggle('dim', v && l.dataset[n.dataset.side] !== n.dataset.i)); n.addEventListener('mouseenter', () => on(true)); n.addEventListener('mouseleave', () => on(false)); n.addEventListener('focus', () => on(true)); n.addEventListener('blur', () => on(false)); });
  };
  const tip = el => {
    const t = document.createElement('div'); t.className = 'vz-tip'; el.appendChild(t);
    const show = (n, x, y) => { t.innerHTML = `<b>${esc(n.dataset.tip)}</b>${esc(n.dataset.tipb || '')}`; t.style.left = x + 'px'; t.style.top = y + 'px'; t.classList.add('on'); };
    el.addEventListener('pointermove', e => { const n = e.target.closest('[data-tip]'); if (!n) return t.classList.remove('on'); const r = el.getBoundingClientRect(); show(n, e.clientX - r.left, e.clientY - r.top); });
    el.addEventListener('pointerleave', () => t.classList.remove('on'));
    el.addEventListener('focusin', e => { const n = e.target.closest('[data-tip]'); if (!n) return; const r = el.getBoundingClientRect(), q = n.getBoundingClientRect(); show(n, q.left - r.left + q.width / 2, q.top - r.top); });
    el.addEventListener('focusout', () => t.classList.remove('on'));
  };
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .2 }) : null;
  const mount = root => {
    root.querySelectorAll('.vz[data-vz]').forEach(el => {
      if (el._spec) return;
      try { el._spec = JSON.parse(el.dataset.vz); } catch (e) { console.error('vz spec', e); return; }
      draw(el); tip(el);
      if (io) io.observe(el); else el.classList.add('in');
      if ('ResizeObserver' in window) new ResizeObserver(() => { const w = Math.round(el.querySelector('.vz-c').clientWidth); if (w && Math.abs(w - (el._w || 0)) > 8) { el._w = 0; draw(el); el.classList.add('in'); } }).observe(el);
    });
    // chart tabs: one panel at a time
    root.querySelectorAll('.vz-tabs').forEach(tb => {
      if (tb._bound) return; tb._bound = 1;
      const wrapEl = tb.parentElement, panels = [...wrapEl.querySelectorAll(':scope > .vz-panel')], btns = [...tb.querySelectorAll('button')];
      const pick = i => { btns.forEach((b, k) => b.setAttribute('aria-selected', k === i)); panels.forEach((p, k) => { p.hidden = k !== i; if (k === i) p.querySelectorAll('.vz[data-vz]').forEach(v => { v._w = 0; draw(v); requestAnimationFrame(() => v.classList.add('in')); }); }); };
      btns.forEach((b, i) => b.addEventListener('click', () => pick(i)));
      tb.addEventListener('keydown', e => { const i = btns.indexOf(document.activeElement); if (i < 0) return; if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const j = (i + (e.key === 'ArrowRight' ? 1 : btns.length - 1)) % btns.length; btns[j].focus(); pick(j); e.preventDefault(); } });
    });
  };
  /* html for one chart block */
  const html = (spec, cap, no) => `<figure class="vz vz-${esc(spec.type)}" data-vz='${esc(JSON.stringify(spec))}'><div class="vz-c"></div>${cap ? `<figcaption class="vz-cap"><b>${no ? 'FIG.' + no : 'DATA'}</b><span>${cap}</span></figcaption>` : ''}</figure>`;
  /* html for a set of charts under tab buttons; each item: {label, chart?, h?, p?, dl?} */
  const tabs = (t, md) => `<div class="vz-set">${t.title ? `<p class="eva-cap">${esc(t.title)}</p>` : ''}<div class="vz-tabs" role="tablist">${t.items.map((it, i) => `<button type="button" role="tab" aria-selected="${i ? 'false' : 'true'}">${esc(it.label)}</button>`).join('')}</div>${t.items.map((it, i) => `<div class="vz-panel${it.h || it.p || it.dl ? '' : ' solo'}" role="tabpanel"${i ? ' hidden' : ''}>${it.chart ? html(it.chart, it.cap) : ''}${it.h || it.p || it.dl ? `<div class="vz-side">${it.h ? `<h4>${esc(it.h)}</h4>` : ''}${(it.p || []).map(x => `<p>${md ? md(x) : esc(x)}</p>`).join('')}${it.dl ? `<dl>${it.dl.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${md ? md(b) : esc(b)}</dd></div>`).join('')}</dl>` : ''}</div>` : ''}</div>`).join('')}</div>`;
  window.VZ = { mount, html, tabs, T };
})();
