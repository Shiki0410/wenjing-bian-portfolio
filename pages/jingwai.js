/* 镜外 ORPHÉE — bespoke page (visual pass 2026-10-15).
   References (number = position in _refs/pins.txt): R510 diagonal strip on a saturated field · R519 cream poster, one diagonal strip of stills ·
   R517 two-colour grain with a crossing strip · D02/D03/D08 type in perspective, tategaki rail, film reel (board.html).
   Local modules: jwSlip jwLoop jwRefs jwWorld jwRescue jwDelivery jwSets jwClues jwJoin jwOutcomes jwInnovation jwMake jwHall jwShader jwChecks jwNow.
   The 3D film sets are the game's own FBX files (assets/jingwai-*.fbx), loaded with three@0.160 + FBXLoader from jsDelivr. */
(() => {
  const PG = (window.PAGES = window.PAGES || {});
  const M = (window.MODULES = window.MODULES || {});
  const asset = n => (/^assets\//.test(n) ? n : `assets/${n}.webp`);
  const E = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  /* a strip of stills; sprocket holes are drawn by CSS */
  const film = (imgs, cls = '') => `<div class="jf ${cls}">${imgs.map(([n, c, tc]) => `<figure><img src="${asset(n)}" alt="${E(c)}" loading="lazy"><figcaption><b>${tc || ''}</b>${c}</figcaption></figure>`).join('')}</div>`;
  const role = (a, k) => a.role ? `<span class="jrole"><b class="mono">我的部分</b>${k.md(a.role)}</span>` : "";
  const NUM = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];
  /* chapter opener, three variants: night with a slanted foot / coral field / cream with a black band behind the type */
  const chap = (a, k, i, v) => `<header class="jch v${v}" data-noeva><span class="jch-n" aria-hidden="true">${NUM[i] || ''}</span><p class="jch-v" aria-hidden="true">${k.esc(a.kicker.split('·')[0].trim())}</p><div class="jch-t"><p class="jch-k">${k.esc(a.kicker)}</p><h2>${k.md(a.title)}</h2></div><p class="jch-l">${k.md(a.lead || '')}${role(a, k)}</p><i class="jch-band" aria-hidden="true"></i></header>`;
  const sec = (o, cls, inner, extra = '') => `<section class="jsec ${cls}" aria-label="${E(o.sub || '')}"><div class="jsec-h" data-noeva>${o.en ? `<p class="mono">${E(o.en)}</p>` : ''}<h3 class="jh">${E(o.sub || '')}</h3>${extra}</div>${inner}</section>`;
  const tr = t => `<p class="jx-src">${t}</p>`;

  /* ================================================================
     PAGE TEMPLATES
     ================================================================ */
  PG.jingwai = {
    title(k) {
      const { p, s, esc } = k;
      const frames = [[s.key, '025 · 23:17 之前', '25A'], ['jingwai/ada-v138', '艾达', '26'], ['jingwai/workbench-v138', '07 · 检修台', '27'], ['jingwai/chandelier-v138', '吊灯与吊索', '28'], ['jingwai/editing-v138', '档案室剪辑台', '29'], ['jingwai/hotel-v138', '酒店大厅', '30']];
      return `<section class="jhero" aria-labelledby="tc-name" data-noeva>
        <i class="jhero-beam" aria-hidden="true"></i>
        ${film(frames, 'jhero-strip')}
        <p class="jhero-v" aria-hidden="true">ORPHÉE　025 号片盘　放映中</p>
        <a class="jhero-back mono" href="index.html#scene-${p.id}" data-cut="INDEX">← INDEX</a>
        <i class="jhero-dot" aria-hidden="true"><b>REEL</b>025</i>
        <h1 class="jhero-name" id="tc-name"><span>镜外</span><small>ORPHÉE</small></h1>
        <p class="jhero-sub">${esc(s.sub)}</p>
        <p class="jhero-q">${esc(s.logline.q)}</p>
        <dl class="jhero-meta">${(s.meta || []).map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>
      </section>`;
    },

    logline(k) {
      const { s, md, esc } = k;
      return `<section class="jsum" aria-label="项目范围" data-noeva>
        <p class="jsum-n" aria-hidden="true">12<small>SEC</small></p>
        <div class="jsum-c"><p class="mono">PERSONAL PROJECT / WORLD · LEVEL · INTERACTION</p><p class="a">${md(s.logline.a)}</p><p>${md(s.logline.r)}</p></div>
        <ul class="jsum-s">${s.stats.map(([v, l]) => `<li><b>${esc(v)}</b><i aria-hidden="true"></i><span>${esc(l)}</span></li>`).join('')}</ul>
      </section>`;
    },

    act(a, i, k) { const f = this['a_' + a.id]; return f ? f.call(this, a, k, k.use(a), i) : null; },

    a_why(a, k, u) {
      const { esc, md } = k;
      return `<header class="jwy" data-noeva>
          ${film(a.open.imgs.map(([n, c], j) => [n, c, ['25A', '26', '07'][j]]), 'jwy-film v')}
          <p class="jwy-tag" aria-hidden="true"><b>025</b><span>REEL · 35MM</span></p>
          <div class="jwy-copy"><p class="jch-k">${esc(a.kicker)}</p><h2>${md(a.title)}</h2><p class="jwy-lead">${md(a.lead)}${role(a, k)}</p></div>
          <p class="jwy-big" aria-hidden="true">23:17</p>
        </header>
        <section class="jbu" aria-label="${esc(u.o(0).sub)}">
          <div class="jsec-h" data-noeva><p class="mono">${esc(u.o(0).en)}</p><h3 class="jh">${esc(u.o(0).sub)}</h3></div>
          ${u.b(1)}
          <div class="jbu-t">${(u.o(2).text || []).map((t, j) => `<p class="${j ? '' : 'big'}">${md(t)}</p>`).join('')}<p class="jbu-n">${md(u.o(3).note)}</p><p class="jbu-n">${md(u.o(4).note)}</p></div>
        </section>${u.rest()}`;
    },

    a_design(a, k, u, i) {
      const { esc, md } = k;
      return `${chap(a, k, i, 1)}
        <section class="jlg">${u.b(0)}
          <ol class="jrules">${(u.o(1).list || []).map(([h, t], j) => `<li><b aria-hidden="true">0${j + 1}</b><h4>${esc(h)}</h4><p>${md(t)}</p></li>`).join('')}</ol>
        </section>${u.rest()}`;
    },

    a_refs(a, k, u, i) { return `${chap(a, k, i, 2)}${u.b(0)}${u.rest()}`; },
    a_world(a, k, u, i) { return `${chap(a, k, i, 3)}${u.b(0)}${u.rest()}`; },
    a_result(a, k, u, i) { return `${chap(a, k, i, 1)}${u.b(0)}${u.b(1)}${u.rest()}`; },
    a_novel(a, k, u, i) { return `${chap(a, k, i, 2)}${u.b(0)}${u.rest()}`; },

    a_play(a, k, u) {
      const { esc, md } = k;
      return `<header class="jcl" data-noeva>
          <div class="jcl-board">
            <p class="jcl-stripes" aria-hidden="true"></p>
            <div class="jcl-slate">
              <p class="jcl-t">ORPHÉE<small>FIRST CHAPTER</small></p>
              <dl><div><dt>PROD</dt><dd>镜外</dd></div><div><dt>ROLL</dt><dd>025</dd></div><div><dt>SCENE</dt><dd>首章</dd></div><div><dt>TAKE</dt><dd>${esc(a.open.num)} ${esc(a.open.unit)}</dd></div></dl>
            </div>
          </div>
          <div class="jcl-copy"><p class="jch-k">${esc(a.kicker)}</p><h2>${md(a.title)}</h2><p>${md(a.lead)}${role(a, k)}</p><small class="mono">${esc(a.open.label)}</small></div>
        </header>
        <section class="jlive" aria-label="试玩">${u.b(0)}</section>
        ${sec(u.o(1), 'jcut', u.b(2))}${u.rest()}`;
    },

    a_rescue(a, k, u) {
      const { esc, md } = k;
      return `<header class="jca" data-noeva>
          <i class="jca-bar" aria-hidden="true"></i>
          <p class="jca-stamp" aria-hidden="true">025 → 07</p>
          ${film([['assets/frames/jw-025-hall.webp', '025 · 宴会厅', '25A'], ['assets/frames/jw-07-repair.webp', '07 · 检修', '26'], ['assets/frames/jw-07-stairs.webp', '07 · 桥与楼梯', '27']], 'jca-strip v')}
          <div class="jca-copy"><p class="jch-k">${esc(a.kicker)}</p><h2>${md(a.title)}</h2><p>${md(a.lead)}${role(a, k)}</p></div>
          <p class="jca-name" aria-hidden="true">A CART<br>A ROPE<br>A BRACE</p>
        </header>
        ${u.b(0)}
        ${sec(u.o(1), 'jhook', u.b(2))}${u.rest()}`;
    },

    a_letter(a, k, u) {
      const { esc, md } = k;
      return `<header class="jed" data-noeva>
          <div class="jed-in">
            <p class="jed-k mono">余映局 · 送递记录 · 026 → 027 → 07</p>
            <p class="jed-t" aria-hidden="true"><span>ONE LETTER</span><span>THREE ROUTES</span></p>
            <h2>${md(a.title)}</h2>
            <p class="jed-lead">${md(a.lead)}${role(a, k)}</p>
          </div>
          <ol class="jed-r" aria-hidden="true"><li><b>01</b>赶上邮车</li><li><b>02</b>错过后补送</li><li><b>03</b>直接亲送</li><li class="end">米娅亲收</li></ol>
        </header>
        ${sec(u.o(0), 'jroutes', u.b(1))}
        ${sec(u.o(2), 'jsets', u.b(3))}
        ${sec(u.o(4), 'jclues', u.b(5))}${u.rest()}`;
    },

    a_make(a, k, u, i) {
      return `${chap(a, k, i, 3)}
        ${u.b(0)}
        ${sec(u.o(1), 'jswatch', u.b(2))}
        ${sec(u.o(3), 'jshader', u.b(4))}
        ${sec(u.o(5), 'jchecks', u.b(6))}${u.rest()}`;
    },

    a_next(a, k, u, i) {
      return `${chap(a, k, i, 1)}${u.b(0)}${u.rest()}`;
    },

    /* the title strip slides sideways while the page scrolls, like a film passing the beam */
    after(root) {
      const h = root.querySelector('.jhero'); if (!h || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      let tk = false;
      const run = () => { tk = false; const r = h.getBoundingClientRect(); if (r.bottom < -50 || r.top > innerHeight) return; const p = Math.max(0, Math.min(1.2, -r.top / Math.max(1, r.height))); h.style.setProperty('--sx', (-p * 14).toFixed(2) + '%'); };
      addEventListener('scroll', () => { if (!tk) { tk = true; requestAnimationFrame(run); } }, { passive: true }); run();
    }
  };

  /* ================================================================
     icons — 40px line pictograms (currentColor)
     ================================================================ */
  const IC = {
    camera: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 15H15L18 10H30L33 15H42V38H6Z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><circle cx="24" cy="26" r="8" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="24" cy="26" r="3" fill="currentColor"/></svg>',
    hand: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 40V22L10 17M14 22V12M22 22V8M30 22V12M38 22V30Q38 40 28 40H14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 22H38" stroke="currentColor" stroke-width="2.6"/></svg>',
    play: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="9" width="36" height="30" rx="3" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M20 17L33 24L20 31Z" fill="currentColor"/></svg>',
    lever: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="34" width="32" height="6" fill="currentColor" opacity=".3" stroke="currentColor" stroke-width="2.2"/><path d="M24 34V12" stroke="currentColor" stroke-width="3"/><circle cx="24" cy="10" r="5" fill="currentColor"/></svg>',
    glass: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="21" cy="21" r="12" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M30 30L41 41" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/><path d="M16 21H26M21 16V26" stroke="currentColor" stroke-width="2"/></svg>',
    brace: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 42V12" stroke="currentColor" stroke-width="3.4"/><path d="M24 30H10M24 22H38" stroke="currentColor" stroke-width="2.6"/><path d="M15 8H33L30 14H18Z" fill="currentColor"/><circle cx="24" cy="38" r="6" fill="none" stroke="currentColor" stroke-width="2.6"/></svg>',
    letter: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="11" width="36" height="26" rx="2" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M6 13L24 28L42 13" fill="none" stroke="currentColor" stroke-width="2.6"/></svg>',
    frame: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="10" width="36" height="28" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M6 32L16 22L25 30L32 24L42 33" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><circle cx="32" cy="18" r="3" fill="currentColor"/></svg>'
  };

  /* ================================================================
     hallSvg — the 025 ballroom drawn in code (schematic, not a screenshot).
     t = second 0..11 of the twelve; mode = none | cart | hook | brace
     ================================================================ */
  const hallSvg = ({ t = 0, mode = 'none', cam = false, lab = true, slice = false } = {}) => {
    const xAt = (i, y) => (320 + i * 84 * ((y - 160) / 200)).toFixed(1), rows = [250, 270, 294, 324, 360];
    let floor = '';
    for (let r = 0; r < 4; r++) for (let i = -7; i < 7; i++) if (!((i + r) & 1)) floor += `<path d="M${xAt(i, rows[r])} ${rows[r]}L${xAt(i + 1, rows[r])} ${rows[r]}L${xAt(i + 1, rows[r + 1])} ${rows[r + 1]}L${xAt(i, rows[r + 1])} ${rows[r + 1]}Z"/>`;
    const falling = mode === 'none';
    let cy = 70, tilt = 0;
    if (falling) { if (t >= 11) cy = 252; else if (t === 10) cy = 190; else if (t === 9) cy = 96; else if (t >= 5) tilt = (t % 2 ? 1 : -1) * (t > 7 ? 3 : 1.6); }
    if (mode === 'cart') cy = 236; if (mode === 'brace') { cy = 150; tilt = 0; }
    const lamp = (x, y) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="-20" rx="9" ry="5" fill="#8a6420"/><rect x="-3" y="-20" width="6" height="34" fill="#b58a3a"/><path d="M-50 2Q-48 24 0 15Q48 24 50 2" fill="none" stroke="#b58a3a" stroke-width="5" stroke-linecap="round"/><path d="M-30 6Q-28 20 0 15Q28 20 30 6" fill="none" stroke="#e0b765" stroke-width="3"/>${[-50, -26, 0, 26, 50].map((bx, bi) => `<circle cx="${bx}" cy="${bi === 2 ? 20 : 0 + (bi % 2) * 4}" r="${bi === 2 ? 6 : 7}" fill="#f6c76a"/>`).join('')}<path d="M-14 24V34M0 28V40M14 24V34" stroke="#e0b765" stroke-width="2"/></g>`;
    const person = (x, fy, h, coat, extra = '', ghost = false) => {
      const w = h * .34, hd = h * .1, st = ghost ? 'fill="none" stroke="#f1e6cf" stroke-width="2" stroke-dasharray="5 4"' : '';
      return `<g ${ghost ? 'opacity=".75"' : ''}><path d="M${x - w / 2} ${fy - h * .42}L${x - w / 2 + 3} ${fy - h * .8}H${x + w / 2 - 3}L${x + w / 2} ${fy - h * .42}Z" ${st || `fill="${coat}"`}/><rect x="${x - w * .3}" y="${fy - h * .44}" width="${w * .24}" height="${h * .44}" ${st || 'fill="#2b3157"'}/><rect x="${x + w * .06}" y="${fy - h * .44}" width="${w * .24}" height="${h * .44}" ${st || 'fill="#2b3157"'}/><circle cx="${x}" cy="${fy - h * .8 - hd * 1.15}" r="${hd}" ${st || 'fill="#e8c5a0"'}/>${ghost ? '' : extra}</g>`;
    };
    const ada = ghostAda => person(250, 306, 124, '#c9a97a', '<path d="M243 217q7 8 14 0v10h-14z" fill="#7a2f3a"/>', ghostAda);
    const MX = (mode === 'hook' ? 372 : mode === 'brace' ? 470 : 404);
    const martinArm = (mode === 'hook') ? '' : `<path d="M${MX - 2} 232L${MX + 22} 168" stroke="#1d2a44" stroke-width="8" stroke-linecap="round"/><circle cx="${MX + 23}" cy="165" r="5" fill="#e8c5a0"/>`;
    const martin = person(MX, 306, 132, '#1d2a44', `<rect x="${MX - 11}" y="${306 - 132 * .8 - 14 - 7}" width="22" height="6" fill="#141c33"/><path d="M${MX - 3} 232V258M${MX + 3} 232V258" stroke="#e0b765" stroke-width="2"/>`);
    const mia = person(190, 312, 74, '#a8434f');
    const rope = mode === 'hook' ? `<path d="M320 ${cy - 22}L566 74" stroke="#3b2b1b" stroke-width="3"/><path d="M566 74v10a6 6 0 1 1-12 0" fill="none" stroke="#b58a3a" stroke-width="4"/>` : (mode === 'none' && t >= 10 ? '' : `<path d="M320 ${cy - 22}Q380 ${cy + 10} ${MX + 23} 166" fill="none" stroke="#3b2b1b" stroke-width="3"/>`);
    const cart = mode === 'cart' ? `<g><rect x="250" y="262" width="140" height="8" fill="#4a2c1c"/><rect x="258" y="270" width="6" height="46" fill="#4a2c1c"/><rect x="376" y="270" width="6" height="46" fill="#4a2c1c"/><rect x="258" y="300" width="124" height="5" fill="#4a2c1c"/><circle cx="268" cy="322" r="8" fill="#141c33" stroke="#b58a3a" stroke-width="2"/><circle cx="372" cy="322" r="8" fill="#141c33" stroke="#b58a3a" stroke-width="2"/><path d="M236 262v-26" stroke="#4a2c1c" stroke-width="5"/><path d="M300 250l8-9 6 9 8-9 8 9" fill="none" stroke="#f2c94c" stroke-width="3"/></g>` : '';
    const brace = mode === 'brace' ? `<g><rect x="316" y="246" width="8" height="86" fill="#2b3157"/><rect x="318" y="172" width="4" height="76" fill="#b58a3a"/><path d="M308 172H332L328 164H312Z" fill="#b58a3a"/><circle cx="320" cy="306" r="11" fill="none" stroke="#b58a3a" stroke-width="4"/><path d="M309 306H331M320 295V317" stroke="#b58a3a" stroke-width="3"/>${[258, 270, 282].map((y, j) => `<path d="M326 ${y}h9" stroke="${j === 2 ? '#f2c94c' : '#f1e6cf'}" stroke-width="2.5"/>`).join('')}</g>` : '';
    const reticle = cam ? `<g stroke="#f2c94c" stroke-width="3" fill="none"><path d="M168 138v-18h18M470 138v-18h-18M168 322v18h18M470 322v18h-18"/></g><circle cx="320" cy="230" r="3" fill="#f2c94c"/>` : '';
    const labels = !lab ? '' : mode === 'cart' ? `<g font-size="15" fill="#f1e6cf" stroke="#141c33" stroke-width="4" paint-order="stroke" stroke-linejoin="round" font-family="'JetBrains Mono',monospace"><text x="320" y="352" text-anchor="middle">餐车</text><text x="320" y="204" text-anchor="middle" fill="#f2c94c">灯座撞痕</text></g>` : mode === 'brace' ? `<g font-size="15" fill="#f1e6cf" stroke="#141c33" stroke-width="4" paint-order="stroke" stroke-linejoin="round" font-family="'JetBrains Mono',monospace"><text x="346" y="312">低位握轮</text><text x="346" y="272" fill="#f2c94c">三节锁位</text><text x="346" y="214">托头</text></g>` : mode === 'hook' ? `<g font-size="15" fill="#f1e6cf" stroke="#141c33" stroke-width="4" paint-order="stroke" stroke-linejoin="round" font-family="'JetBrains Mono',monospace"><text x="520" y="106">吊环 · 钩索</text><text x="318" y="352" text-anchor="middle" fill="#f2c94c">三人同框</text></g>` : '';
    return `<svg viewBox="0 0 640 360"${slice ? ' preserveAspectRatio="xMidYMid slice"' : ''} role="img" aria-label="025 宴会厅示意：${mode === 'none' ? `第 ${t} 秒` : mode}"><rect width="640" height="360" fill="#c86763"/>
      <rect y="196" width="640" height="56" fill="#2b3157"/>${[110, 320, 530].map(x => `<path d="M${x - 56} 196V92A56 56 0 0 1 ${x + 56} 92V196Z" fill="#0e1626" stroke="#f1e6cf" stroke-width="7"/>`).join('')}<rect x="206" y="40" width="16" height="156" fill="#f1e6cf" opacity=".8"/><rect x="418" y="40" width="16" height="156" fill="#f1e6cf" opacity=".8"/>
      <path d="M0 206H640" stroke="#141c33" stroke-width="5"/><path d="M0 212H640" stroke="#141c33" stroke-width="1.5"/>
      <rect y="250" width="640" height="110" fill="#ecdcc0"/><g fill="#b8605f">${floor}</g>
      ${rope}<g transform="rotate(${tilt} 320 0)"><path d="M320 0V${cy - 24}" stroke="#3b2b1b" stroke-width="3"/>${lamp(320, cy)}</g>
      ${cart}${brace}${mia}${ada(falling && t >= 10)}${mode === 'none' && t >= 10 ? '' : martin}${martinArm}${reticle}${labels}
    </svg>`;
  };

  /* ================================================================
     jwSlip — commission slip and the twelve seconds
     ================================================================ */
  const SEC = [
    [0, '23:16:50', '吊灯还挂着，吊索已经松脱，马丁抓着它。'], [1, '23:16:51', '米娅站在母亲身旁，等一张合影。'], [2, '23:16:52', '艾达看见灯在晃，想的是家人。'],
    [3, '23:16:53', '试放可以从这里重来。'], [4, '23:16:54', '救援的动作要在这几秒内完成。'], [5, '23:16:55', '排演失败，不扣记忆。'], [6, '23:16:56', '拍下安全的艾达。'], [7, '23:16:57', '三人合影是额外的愿望。'],
    [8, '23:16:58', '封存之前，一切还可以改。'], [9, '23:16:59', '临界点：吊灯落下。'], [10, '23:17:00', '没有救援的话，艾达走不出饭店。'], [11, '23:17:01', '被重拍的这一秒，会从她的记忆里拿掉。'], [12, '23:17:02', '许可时间结束。']
  ];
  M.jwSlip = {
    html: () => `<div class="jsl" data-noeva aria-label="第 25 号委托单与十二秒">
      <article class="jsl-paper"><p class="mono">余映局 · 委托单</p><h3>第 25 号委托</h3>
        <dl><div><dt>对象</dt><dd>艾达</dd></div><div><dt>地点</dt><dd>冬庭饭店</dd></div><div><dt>许可时间</dt><dd>23:16:50—23:17:02</dd></div><div><dt>临界点</dt><dd>23:16:59</dd></div><div class="wide"><dt>代价</dt><dd>封存之后，艾达永久失去这十二秒的亲身记忆；照片和别人的讲述能告诉她发生过什么，还不回那段经历。</dd></div></dl>
        <blockquote>“灯要掉了，帮帮我。我们还没拍成照片。”<cite>胶片里艾达在事故前留下的求救</cite></blockquote>
      </article>
      <div class="jsl-time">
        <figure class="jsl-stage"><div class="jsl-svg"></div><figcaption class="mono">冬庭饭店 025 · 不救援时的十二秒 · 示意图</figcaption></figure>
        <div class="jsl-ruler" aria-hidden="true"><span class="t-try">排演可以在这十二秒里反复重来</span><span class="t-seal">正式封存后，这十二秒从艾达的记忆里拿掉</span>${SEC.slice(0, 12).map(([n, t]) => `<i data-n="${n}"${n === 9 ? ' class="crit"' : ''}><b>${t.slice(-2)}</b></i>`).join('')}<em class="flag">临界点</em></div>
        <input type="range" min="0" max="11" value="0" aria-label="时间点，拖动查看这十二秒" aria-valuetext="23:16:50">
        <p class="jsl-now"><b class="mono"></b><span></span></p>
      </div>
    </div>`,
    init(el) {
      const r = el.querySelector('input'), cells = [...el.querySelectorAll('.jsl-ruler i')], now = el.querySelector('.jsl-now'), host = el.querySelector('.jsl-svg');
      const draw = () => { const n = Number(r.value), s = SEC[n]; cells.forEach((c, i) => c.classList.toggle('on', i <= n)); now.querySelector('b').textContent = s[1]; now.querySelector('span').textContent = s[2]; r.setAttribute('aria-valuetext', s[1]); now.classList.toggle('crit', n >= 9); host.innerHTML = hallSvg({ t: n, mode: 'none', cam: n >= 6 && n < 10, lab: false }); };
      r.addEventListener('input', draw); cells.forEach((c, i) => c.addEventListener('click', () => { r.value = i; draw(); })); draw();
    }
  };

  /* ================================================================
     jwLoop — observe → intervene → rehearse → seal → verify, as one strip
     ================================================================ */
  M.jwLoop = {
    html: () => `<div class="jlp" data-noeva aria-label="观察、介入、查证">
      <p class="jlp-bar t-try"><b>尝试</b>摄影、介入、排演，可以反复</p><p class="jlp-bar t-seal"><b>结果</b>封存、查证，不能撤回</p>
      <ol class="jf jlp-row">${[
        ['camera', '观察与留底', '真实线索、合法机位、完整画框。', '右键举镜 · 左键拍摄'],
        ['hand', '实体介入', '物件的受力和位置真的发生改变。', 'E 拿起 · 操作'],
        ['play', '排演', '失败可以调整；合格的照片保留这次结果。', 'T 观察下一秒'],
        ['lever', '正式封存', '封存杆压到底，艾达才支付十二秒。', '按住 E'],
        ['glass', '现实查证', '对白、原件与检修，回应已经发生的事实。', '07 号街区']
      ].map(([ic, h, t, key], i) => `<li class="${i === 3 ? 'cost' : ''}"><span class="jlp-no mono">0${i + 1}</span><span class="jlp-ic">${IC[ic]}</span><h4>${h}</h4><p>${t}</p><kbd>${key}</kbd>${i === 3 ? '<em class="jlp-12" aria-hidden="true">12<small>SEC</small></em>' : ''}</li>`).join('')}</ol>
      <p class="jlp-back" aria-hidden="true"><span>↺ 失败可调整，不扣记忆</span></p>
    </div>`
  };

  /* ================================================================
     jwRefs — three references, each in a full-width row
     ================================================================ */
  const REF = [
    { code: 'VIEWFINDER', no: '01', t: '空间实验允许局部退回', a: '开发者用 Rewind 处理“照片放置可能删掉出口”的问题，让实验可以局部退回。', b: '未封存的排演可以重试；桥梯摆错，在安全条件下可以回收。正式的记忆代价另外发生。', href: 'https://blog.playstation.com/2023/06/08/create-destroy-and-rewind-in-viewfinder-out-july-18-play-the-demo-today/', l: '开发者说明' },
    { code: 'WILL', no: '02', t: '改变顺序会改变后果', a: '官方说明里，重排来信里的句子，会改变人物的经历。', b: '顺序落在同一封原信的真实装载与首次离站上；错过了就要补送，不靠选项随机决定结局。', href: 'https://store.steampowered.com/app/588040/WILL_A_Wonderful_World/', l: '官方作品说明' },
    { code: 'OUTER WILDS', no: '03', t: '工具的用途靠探索建立', a: '开发者谈到可以自由尝试的教学场景，也谈到过度线性的教程容易让人失去目的。', b: '断索、吊环、握轮和纸图提供近处的信息；E 操作、T 排演、摄影各有各的职责。', href: 'https://www.mobiusdigitalgames.com/news/filling-out-the-toolbox', l: '工具与教学访谈' }
  ];
  M.jwRefs = {
    html: () => `<section class="jrf" data-noeva><ol>${REF.map(r => `<li><p class="jrf-w" aria-hidden="true">${r.code}</p><span class="jrf-no mono">REF ${r.no}</span><div class="jrf-a"><h3>${r.t}</h3><p class="mono">参考</p><p>${r.a}</p><a href="${r.href}" target="_blank" rel="noopener">${r.l} ↗</a></div><span class="jrf-arrow" aria-hidden="true">→</span><div class="jrf-b"><p class="mono">镜外的转译</p><p>${r.b}</p></div></li>`).join('')}</ol>
      ${tr('参考原则来自官方文字和开发者说明；转译是本作自己的设计判断，不是比较实验，也不代表这些作品的完整设计。')}</section>`
  };

  /* ================================================================
     jwWorld — film wall (posters), archive room, street
     ================================================================ */
  const clockSvg = '<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="50" fill="#f1e6cf" stroke="#141c33" stroke-width="6"/>' + Array.from({ length: 12 }, (_, i) => `<path d="M60 14V${i % 3 ? 20 : 26}" stroke="#141c33" stroke-width="${i % 3 ? 2.5 : 4}" transform="rotate(${i * 30} 60 60)"/>`).join('') + '<path d="M60 60V30M60 60L82 70" stroke="#c86763" stroke-width="6" stroke-linecap="round"/><circle cx="60" cy="60" r="5" fill="#141c33"/></svg>';
  const POST = [
    { no: '025', c: 'coral', t: '酒店', n: '《23:17 之前》', img: 'jingwai/chandelier-v138', d: '首章主线。拍断索与吊环，用餐车、钩索或撑杆救下艾达。' },
    { no: '026', c: 'brass', t: '邮局', n: '《未寄出的信》', img: 'assets/frames/jw-026-letter.webp', d: '邮路器械：装袋、盖戳、摄影运单。可以独立进入。' },
    { no: '027', c: 'teal', t: '车站', n: '《最后一班车》', svg: clockSvg, d: '站钟与信号，拍下运动的车，装袋、发车。可以独立进入。' }
  ];
  M.jwWorld = {
    html: () => `<div class="jw" data-noeva aria-label="世界结构与操作">
      <div class="jw-film"><p class="jw-lab mono">FILM / 片内　墙上的三张海报</p>
        <ul class="jw-posters">${POST.map(p => `<li class="${p.c}"><p class="jwp-no" aria-hidden="true">${p.no}</p><div class="jwp-img">${p.img ? `<img src="${asset(p.img)}" alt="" loading="lazy">` : p.svg}</div><h4>${p.t}</h4><p class="jwp-n">${p.n}</p><p class="jwp-d">${p.d}</p></li>`).join('')}</ul>
        <p class="jw-go"><span><b>右键举镜</b>，让整张海报入框，稳住后<b>左键拍摄</b>，进入片场</span><span><kbd>Q</kbd> 拉片返回</span></p></div>
      <div class="jw-room"><p class="jw-lab mono">ARCHIVE / 档案室</p>
        <ol><li><b>01</b><h4>委托桌</h4><p>读来函，拿起第 25 号片盘。</p></li><li><b>02</b><h4>放映机</h4><p>装入片盘，墙上的海报才能入片。</p></li><li><b>03</b><h4>剪辑台 · 封存杆</h4><p>装回原片，按住 E 压到底，支付十二秒。</p></li></ol>
        <p class="jw-go dark"><span>封存之后，领取纪念匣，走出档案门</span></p></div>
      <div class="jw-real"><figure><img src="${asset('jingwai/workbench-v138')}" alt="07 号街区的检修台" loading="lazy"><figcaption class="mono">07 · 检修台 · v1.3.8</figcaption></figure>
        <div><p class="jw-lab mono">REALITY / 首章现实层</p><ul><li><h4>07 号街区</h4><p>见艾达、交原信、检修、拍照搭路。</p></li><li><h4>对岸影院</h4><p>亲自跨河登上影院，看自己留下的结果。</p></li></ul></div></div>
      <div class="jw-ctrl"><p class="jw-lab mono">CONTROLS / 操作</p><ul>${[['右键 · C', '举起相机'], ['左键', '拍摄'], ['E', '拿起 · 操作'], ['T', '排演 · 观察下一秒'], ['G', '放稳'], ['Q', '拉片返回'], ['Z', '复演']].map(([k, t]) => `<li><kbd>${k}</kbd><span>${t}</span></li>`).join('')}</ul></div>
      ${tr('依据首章玩家指引与实机版本绘制。相机识别依据作者制作的物件网格、人物朝向、构图、遮挡和真实底片像素，结构照片绑定指定的 Blender 模型；不是任意图片的 AI 识别，也不是自动三维重建。')}
    </div>`
  };

  /* ================================================================
     jwRescue — three rescue methods, each with a code-drawn diagram and the evidence it leaves
     ================================================================ */
  const RESC = [
    { mode: 'cart', no: '01', label: '餐车接住', ev: '受损灯座与撞痕', h: '接住落灯，留下撞痕。', p: '把餐车推到吊灯下，接住落下的灯。艾达避开了危险，灯座却撞坏了；马丁仍要处理吊索。', dl: [['025 / 救援', '推车接灯，排演确认，拍下艾达获救的画面。'], ['留下的证据', '受损灯座与撞痕。照片记录了灯落在哪里、怎样被接住。'], ['07 / 检修', '拍撞痕，读刻线，按这次损伤调整器械与光路。']], img: 'assets/frames/jw-025-hall.webp', icap: '025 宴会厅 · v1.3.8 实机选编帧', crop: true },
    { mode: 'hook', no: '02', label: '钩索接回', ev: '完整三人合影', h: '把索接回去，让马丁松手。', p: '拍清断索和吊环，用钩索接回受力点。灯没有摔下，马丁终于能走到家人身边；艾达想要的合影，这时才拍得成。', dl: [['025 / 救援', '对准挂点接索，排演后把三个人一起拍进画面。'], ['留下的证据', '同一次放映中的三人合影。只拍到艾达也能救人，完整合影另有用途。'], ['07 / 检修', '用写着三个人名字的镂空框，对齐照片里的马丁、艾达与米娅，拍下校准片；合影不完整时，改用公共片继续。']], img: 'jingwai/family-v133', icap: '钩索路线 · 三人合影 · v1.3.3 留存帧' },
    { mode: 'brace', no: '03', label: '撑杆托住', ev: '两段行程与三节锁位', h: '从下面托住，记下锁位。', p: '把撑杆放到吊灯下，转动低位握轮，让托头贴住灯底，再锁住。艾达可以离开，马丁仍抓着原索。灯被临时撑住了，吊索还没修好。', dl: [['025 / 救援', '放稳撑杆，伸长到接触灯底，锁止后排演。'], ['留下的证据', '两段伸长行程与三节锁位，记录这次支撑怎样成立。'], ['07 / 检修', '对照锁位照片，调节检修架的两段套管；铜环对齐后合总锁，抬起挡光闸。']], img: 'jingwai/brace-v133', icap: '撑杆路线 · 低位握轮与支撑 · v1.3.3 留存帧' }
  ];
  M.jwRescue = {
    html: () => `<section class="jr" data-noeva aria-label="三种救法">
      <div class="jr-tabs" role="tablist" aria-label="选择救法">${RESC.map((r, i) => `<button type="button" role="tab" id="jr-t${i}" aria-selected="${!i}" aria-controls="jr-p" tabindex="${i ? -1 : 0}" data-i="${i}"><b>${r.no}</b><span>${r.label}</span><em>留下：${r.ev}</em></button>`).join('')}</div>
      <div class="jr-panel" id="jr-p" role="tabpanel" aria-live="polite"></div>
    </section>`,
    init(el) {
      const panel = el.querySelector('.jr-panel'), tabs = [...el.querySelectorAll('[role=tab]')];
      const show = i => {
        const r = RESC[i];
        tabs.forEach((b, j) => { b.setAttribute('aria-selected', j === i); b.tabIndex = j === i ? 0 : -1; });
        panel.setAttribute('aria-labelledby', 'jr-t' + i);
        panel.innerHTML = `<div class="jr-vis"><div class="jr-svg">${hallSvg({ t: 10, mode: r.mode, cam: r.mode === 'hook', slice: true })}</div><span class="jr-tag mono">示意图 · 代码绘制</span><figure class="jr-real${r.crop ? ' crop' : ''}"><img src="${asset(r.img)}" alt="${E(r.icap)}" loading="lazy"><figcaption class="mono">${r.icap}</figcaption></figure></div>
          <div class="jr-txt"><p class="jr-n" aria-hidden="true">${r.no}</p><h3>${r.h}</h3><p class="jr-p">${r.p}</p><ol class="jr-steps">${r.dl.map(([a, b], j) => `<li><span class="mono">${a}</span><p>${b}</p></li>`).join('')}</ol></div>`;
      };
      tabs.forEach((b, i) => { b.addEventListener('click', () => show(i)); b.addEventListener('keydown', e => { const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0; if (!d) return; e.preventDefault(); const n = (i + d + tabs.length) % tabs.length; show(n); tabs[n].focus(); }); });
      show(0);
    }
  };

  /* ================================================================
     jwDelivery — three routes on one map, three receiving windows at station 07
     ================================================================ */
  const ROUTES = [
    { name: '赶上邮车', code: '027 / TRAM', win: '固定窗', place: '07 上层收件柜', paper: '到站纸', act: '窗已经就位。完成救援检修后，把光筒对准中央窗。',
      lane: ['025 拿原信', '026 装袋 · 盖戳', '027 装车 · 发车', '07 上层柜取信', '米娅亲收'],
      pts: [[235, 108], [555, 108], [875, 108], [372, 330], [540, 352]], segs: ['M235 108H555', 'M555 108H875', 'M875 108C875 240 372 180 372 330', 'M372 330Q450 352 540 352'],
      steps: [['025 原信', 'E 拿起艾达写给米娅的同一封原件。'], ['026 登记', '装袋，放上承袋盘，持续按 E 压下真戳，再摄影完整运单。'], ['027 装载', 'T 放映；门开、车动时摄影停帧，走近 E 装同一只袋，T 续映。'], ['07 到柜', '车真的离站、片尾运输之后，到上层柜取出原信。'], ['米娅亲收', '持同一件原件亲手递交；到站纸指向固定窗。']] },
    { name: '错过后补送', code: '026 / FORWARDING', win: '滑动窗', place: '07 侧下方补送盘', paper: '补送纸', act: '握住导轨的铜把手，分两次按 E 拉到 07 白线；停稳后再对光。',
      lane: ['027 车先离站', '同袋回 026', '补送盘 · 分拣轮', '07 下层盘取信', '米娅亲收'],
      pre: 'M235 108Q555 30 875 130', pts: [[875, 130], [555, 130], [455, 250], [372, 387], [540, 352]], segs: ['M875 130Q715 170 555 130', 'M555 130C555 200 455 200 455 250', 'M455 250C455 310 372 330 372 387', 'M372 387Q470 390 540 352'],
      steps: [['保留错过的事实', '首次离站时没有装上有效邮袋；原信仍在它真实所在的地方。'], ['026 同袋登记', '原件装回同一只袋，真戳与地址成立；已经有戳的不必重盖。'], ['机械补送', '放盘腾手，分拣轮对准 07，持续按 E 压杆，同袋从出件口通过。'], ['07 下盘', 'E 拉盘取出同一封原信；补送不会改写首次离站的事实。'], ['米娅亲收', '亲手交信；补送纸指向侧位的滑动窗。']] },
    { name: '直接亲送', code: '025 → STREET', win: '便携窗', place: '米娅手中', paper: '马丁的检修便条', act: 'E 拿起架上的便携窗，走到台侧的黄铜座，E 安装，再对光。',
      lane: ['025 拿原信', '封存 · 带回档案室', '领纪念匣 · 出档案门', '街区 · 米娅亲收', '台侧出现便条'],
      pts: [[235, 108], [160, 350], [330, 350], [540, 352], [610, 322]], segs: ['M235 108C110 200 130 290 160 350', 'M160 350H330', 'M330 350H540', 'M540 352Q590 352 610 322'],
      steps: [['025 拿原信', '取得实物；拍到信封不等于拿到原件。'], ['带出与封存', '同一封信（或同一只袋）带回档案室，放上托盘腾出手，正式封存。'], ['回到街区', '领取纪念匣，走出档案门，与现实里的艾达见面。'], ['米娅亲收', '持原信亲手递交，不要求再跑一趟邮局和邮车。'], ['07 留下便条', '米娅收信后，台侧出现马丁的检修便条，指出架上的便携窗和黄铜座。']] }
  ];

  /* the route map: the film layer above, the street below; the letter sits at the current step */
  const mapSvg = (r, s) => {
    const R = ROUTES[r], mono = "font-family=\"'JetBrains Mono',monospace\"";
    const faint = ROUTES.map((q, i) => i === r ? '' : `<g fill="none" stroke="#1d2a44" stroke-opacity=".16" stroke-width="3" stroke-dasharray="3 7">${q.pre ? `<path d="${q.pre}"/>` : ''}${q.segs.map(d => `<path d="${d}"/>`).join('')}</g>`).join('');
    const mine = (R.pre ? `<path d="${R.pre}" fill="none" stroke="#c86763" stroke-width="5" stroke-opacity="${s >= 0 ? 1 : .3}" stroke-dasharray="9 9" class="jdm-flow"/>` : '') + R.segs.map((d, i) => `<path d="${d}" fill="none" stroke="#c86763" stroke-width="${i < s ? 6 : 4}" stroke-opacity="${i < s ? 1 : .45}" ${i < s ? '' : 'stroke-dasharray="9 9" class="jdm-flow"'} stroke-linecap="round"/>`).join('');
    const nodes = R.pts.map(([x, y], i) => `<g class="jdm-n${i === s ? ' on' : ''}"><circle cx="${x}" cy="${y}" r="${i === s ? 19 : 14}" fill="${i <= s ? '#c86763' : '#faf4e6'}" stroke="#1d2a44" stroke-width="3"/><text x="${x}" y="${y + 6}" text-anchor="middle" font-size="${i === s ? 18 : 15}" font-weight="800" fill="${i <= s ? '#faf4e6' : '#1d2a44'}" ${mono}>${i + 1}</text></g>`).join('');
    const [px, py] = R.pts[s];
    const lx = Math.min(840, Math.max(160, px)), ly = py < 200 ? py + 46 : py - 34;
    return `<svg viewBox="0 0 1000 440" role="img" aria-label="${R.name}路线地图，第 ${s + 1} 步：${R.lane[s]}"><title>${R.name} · 路线示意</title>
      <defs><pattern id="jdm-h" width="22" height="10" patternUnits="userSpaceOnUse"><rect x="4" y="1" width="14" height="8" rx="2" fill="#f1e6cf"/></pattern><pattern id="jdm-w" width="40" height="14" patternUnits="userSpaceOnUse"><path d="M0 7Q10 0 20 7T40 7" fill="none" stroke="#faf4e6" stroke-opacity=".6" stroke-width="2"/></pattern></defs>
      <rect x="20" y="10" width="960" height="200" fill="#141210"/><rect x="20" y="16" width="960" height="10" fill="url(#jdm-h)"/><rect x="20" y="194" width="960" height="10" fill="url(#jdm-h)"/>
      ${[['025', '酒店 · 23:17 之前', 180], ['026', '邮局 · 未寄出的信', 500], ['027', '车站 · 最后一班车', 820]].map(([n, t, cx]) => `<rect x="${cx - 135}" y="40" width="270" height="128" fill="#232b4a"/><text x="${cx - 122}" y="98" font-size="52" fill="#f1e6cf" opacity=".92" font-family="'Archivo Black',sans-serif">${n}</text><text x="${cx - 122}" y="156" font-size="17" fill="#f1e6cf" opacity=".85" ${mono}>${t}</text>`).join('')}
      <text x="36" y="226" font-size="14" fill="#1d2a44" ${mono} letter-spacing="2">REALITY / 现实</text>
      <rect x="20" y="236" width="960" height="190" fill="#e6d6b4"/>
      <rect x="60" y="296" width="200" height="108" fill="#2b3157"/><text x="160" y="332" text-anchor="middle" font-size="20" font-weight="800" fill="#f1e6cf">档案室</text><text x="160" y="360" text-anchor="middle" font-size="13" fill="#f1e6cf" opacity=".8" ${mono}>封存杆 · 放映机</text>
      <rect x="330" y="278" width="310" height="140" fill="#faf4e6" stroke="#1d2a44" stroke-width="3"/><text x="346" y="302" font-size="14" font-weight="800" fill="#1d2a44" ${mono}>07 号街区 · 检修台</text>
      <rect x="372" y="312" width="86" height="34" fill="#e0b765" stroke="#6e4d14" stroke-width="2"/><text x="415" y="334" text-anchor="middle" font-size="13" font-weight="700" fill="#1d2a44">上层柜</text>
      <rect x="372" y="372" width="86" height="30" fill="#e0b765" stroke="#6e4d14" stroke-width="2"/><text x="415" y="392" text-anchor="middle" font-size="13" font-weight="700" fill="#1d2a44">补送盘</text>
      <rect x="590" y="336" width="42" height="14" fill="#b58a3a" stroke="#6e4d14" stroke-width="2"/><text x="611" y="368" text-anchor="middle" font-size="13" font-weight="700" fill="#1d2a44">黄铜座</text>
      <circle cx="540" cy="352" r="11" fill="#c86763" stroke="#1d2a44" stroke-width="3"/><text x="540" y="332" text-anchor="middle" font-size="15" font-weight="800" fill="#1d2a44">米娅</text>
      <rect x="700" y="236" width="76" height="190" fill="#7fb5ad"/><rect x="700" y="236" width="76" height="190" fill="url(#jdm-w)"/><path d="M690 330H786" stroke="#1d2a44" stroke-width="10"/><path d="M690 318H786M690 342H786" stroke="#1d2a44" stroke-width="2"/>
      <path d="M810 410V330Q810 296 855 296T900 330V410Z" fill="#1d2a44"/><path d="M830 410V348Q830 328 855 328T880 348V410Z" fill="#c86763"/><text x="855" y="278" text-anchor="middle" font-size="16" font-weight="800" fill="#1d2a44">对岸影院</text>
      ${faint}${mine}${nodes}
      <g class="jdm-pk" style="transform:translate(${px}px,${py}px)"><rect x="-17" y="-34" width="34" height="23" fill="#faf4e6" stroke="#1d2a44" stroke-width="3"/><path d="M-17 -34L0 -21L17 -34" fill="none" stroke="#1d2a44" stroke-width="2.5"/><circle cx="12" cy="-12" r="4" fill="#c86763"/></g>
    </svg>`;
  };

  /* receiving window at 07: all geometry in one 640×360 box, work position at x=320 */
  const winSvg = (route, ready) => {
    const home = route === 0 ? [320, 190] : route === 1 ? [520, 196] : [548, 104];
    const [x, y] = ready || route === 0 ? [320, 190] : home;
    const sc = route === 2 && !ready ? .78 : 1;
    const at = route === 0 || ready;
    const call = (tx, ty, txt, x1, y1) => `<g><path d="M${x1} ${y1}L${tx} ${ty}" stroke="#f2c94c" stroke-width="1.5"/><circle cx="${x1}" cy="${y1}" r="3.5" fill="#f2c94c"/><text x="${tx}" y="${ty - 5}" font-size="14" fill="#f2c94c" font-family="'JetBrains Mono',monospace">${txt}</text></g>`;
    return `<svg viewBox="0 0 640 360" role="img" aria-label="07 号接收窗：${ROUTES[route].win}${at ? '在工作位' : '在准备前的位置'}"><title>07 号接收窗 · ${ROUTES[route].win}</title>
      <defs><linearGradient id="jw-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fd2c9" stop-opacity=".55"/><stop offset="1" stop-color="#3f8a86" stop-opacity=".2"/></linearGradient><linearGradient id="jw-brass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a6420"/><stop offset=".5" stop-color="#e0b765"/><stop offset="1" stop-color="#8a6420"/></linearGradient><pattern id="jw-grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#f1e6cf" stroke-opacity=".07"/></pattern><radialGradient id="jw-spot"><stop offset="0" stop-color="#fff4d0" stop-opacity=".9"/><stop offset="1" stop-color="#fff4d0" stop-opacity="0"/></radialGradient></defs>
      <rect width="640" height="360" fill="#1d2a44"/><rect width="640" height="360" fill="url(#jw-grid)"/>
      <rect x="0" y="262" width="640" height="98" fill="#141c33"/><rect x="0" y="262" width="640" height="8" fill="url(#jw-brass)"/>
      <rect x="566" y="120" width="54" height="130" fill="#f1e6cf" opacity=".12"/>${at ? '<ellipse cx="593" cy="190" rx="42" ry="62" fill="url(#jw-spot)"/>' : ''}
      ${route === 0 ? '<g><rect x="236" y="104" width="168" height="170" fill="#141c33" stroke="#b58a3a" stroke-width="4"/><path d="M236 104H404" stroke="url(#jw-brass)" stroke-width="10"/><text x="320" y="298" text-anchor="middle" font-size="14" fill="#e0b765" font-family="\'JetBrains Mono\',monospace">上层收件柜</text></g>' : ''}
      ${route === 2 ? `<g><rect x="496" y="40" width="104" height="14" rx="3" fill="url(#jw-brass)"/><path d="M510 54V74M586 54V74" stroke="#b8893a" stroke-width="5"/>${ready ? '' : '<path d="M520 74H576" stroke="#b8893a" stroke-width="4" stroke-dasharray="4 5"/>'}</g><g><path d="M268 262H372L356 244H284Z" fill="url(#jw-brass)"/><circle cx="296" cy="252" r="4" fill="#141c33"/><circle cx="344" cy="252" r="4" fill="#141c33"/></g>` : ''}
      ${route === 1 ? `<g><path d="M240 276H600M240 288H600" stroke="url(#jw-brass)" stroke-width="5"/>${Array.from({ length: 19 }, (_, i) => `<path d="M${250 + i * 19} 270V294" stroke="#b8893a" stroke-width="1.6" opacity=".6"/>`).join('')}</g>` : ''}
      <path d="M320 112V262" stroke="#f1e6cf" stroke-width="3" stroke-dasharray="9 7" opacity=".85"/><text x="320" y="326" fill="#f1e6cf" font-size="18" text-anchor="middle" font-family="'JetBrains Mono',monospace">07 白线 · WORK LINE</text>
      <g><rect x="38" y="196" width="94" height="60" rx="10" fill="#c86763"/><rect x="108" y="206" width="36" height="40" rx="5" fill="#8e3f3d"/><circle cx="144" cy="226" r="15" fill="#141c33" stroke="#e0b765" stroke-width="3"/><circle cx="144" cy="226" r="7" fill="#fff4d0"/><path d="M52 214H88M52 226H88M52 238H88" stroke="#8e3f3d" stroke-width="3"/><path d="M60 256L48 282M110 256L122 282" stroke="#e0b765" stroke-width="4"/><text x="84" y="304" fill="#f1e6cf" font-size="16" text-anchor="middle" font-family="'JetBrains Mono',monospace">光筒</text></g>
      <path d="M156 220L${x - 52} ${y - 58}V${y + 58}L156 232Z" fill="#f1e6cf" opacity="${at ? .3 : .07}"/>${at ? '' : '<path d="M156 220L268 132V248L156 232Z" fill="none" stroke="#f1e6cf" stroke-opacity=".5" stroke-dasharray="6 6"/>'}
      <g style="transform:translate(${x}px,${y}px) scale(${sc});transition:transform .7s cubic-bezier(.3,.7,.2,1)">
        ${route === 2 ? '<path d="M-26 -78Q0 -112 26 -78" fill="none" stroke="#b8893a" stroke-width="6"/><path d="M-26 -62V-78M26 -62V-78" stroke="#b8893a" stroke-width="5"/>' : ''}
        <rect x="-52" y="-62" width="104" height="124" fill="url(#jw-glass)" stroke="url(#jw-brass)" stroke-width="9"/>
        <path d="M-52 0H52M0 -62V62" stroke="#b8893a" stroke-width="3.5"/><path d="M-34 -48L-12 -48L-34 -24Z" fill="#fff" opacity=".28"/><path d="M14 40L40 14" stroke="#fff" stroke-width="3" opacity=".2"/>
        ${[[-52, -62], [52, -62], [-52, 62], [52, 62]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="6" fill="#e0b765" stroke="#6e4d14" stroke-width="2"/>`).join('')}
        ${route === 1 ? '<rect x="56" y="-30" width="12" height="60" rx="5" fill="url(#jw-brass)" stroke="#6e4d14" stroke-width="2"/><path d="M52 -16H58M52 16H58" stroke="#6e4d14" stroke-width="3"/>' : ''}
        ${route === 2 ? '<rect x="-30" y="62" width="60" height="8" rx="2" fill="#b8893a"/>' : ''}
        ${route === 0 ? '<rect x="-12" y="62" width="24" height="12" rx="2" fill="#b8893a"/><path d="M-52 76H52" stroke="#6e4d14" stroke-width="2"/>' : ''}
      </g>
      ${call(150, 120, '铜环', Math.round(x - 52 + (route === 2 && !ready ? 6 : 0)), Math.round(y - 62 + (route === 2 && !ready ? 8 : 0)))}
      ${route === 1 ? call(460, 332, '导轨把手', x + 62, y) : route === 2 ? call(440, 332, '黄铜座', 320, 252) : call(420, 150, '收件柜', 404, 190)}
      <text x="${at ? 320 : x}" y="${at ? 94 : y + 92}" fill="${at ? '#9fd2c9' : '#e0b765'}" font-size="18" text-anchor="middle" font-family="'JetBrains Mono',monospace">${at ? '光路接通' : route === 1 ? '导轨侧位' : '架上'}</text>
    </svg>`;
  };
  const paperSvg = r => `<svg viewBox="0 0 220 150" role="img" aria-label="${ROUTES[r].paper}示意"><title>${ROUTES[r].paper}</title><rect x="6" y="6" width="208" height="138" fill="#faf4e6" stroke="#1d2a44" stroke-width="2.5"/><path d="M6 36H214" stroke="#1d2a44" stroke-width="2"/><path d="M20 20H120" stroke="#c86763" stroke-width="5"/>${r === 0 ? '<g stroke="#1d2a44" stroke-width="2" fill="none"><rect x="20" y="52" width="46" height="62"/><path d="M80 66H196M80 82H170M80 98H184"/></g><circle cx="176" cy="22" r="11" fill="none" stroke="#c86763" stroke-width="3"/>' : r === 1 ? '<g stroke="#1d2a44" stroke-width="2" fill="none"><path d="M20 112H196"/><path d="M30 112V70H80V112M110 112V90H170"/><circle cx="60" cy="58" r="8"/></g><path d="M20 126H196" stroke="#b8893a" stroke-width="3" stroke-dasharray="6 5"/>' : '<g stroke="#1d2a44" stroke-width="2" fill="none"><rect x="26" y="54" width="58" height="68"/><path d="M26 88H84M55 54V122"/><path d="M110 70H196M110 88H180M110 106H190"/></g><path d="M20 130H70" stroke="#b8893a" stroke-width="4"/>'}</svg>`;

  M.jwDelivery = {
    html: () => `<div class="jd" data-noeva aria-label="三条送法与三扇接收窗">
      <div class="jd-pick" role="group" aria-label="选择送递方式">${ROUTES.map((r, i) => `<button type="button" data-r="${i}" aria-pressed="${!i}"><span class="jdp-n" aria-hidden="true">0${i + 1}</span><span class="mono">${r.code}</span><b>${r.name}</b><em>→ ${r.win}</em></button>`).join('')}</div>
      <div class="jd-main">
        <figure class="jd-map"><div class="jd-mapsvg"></div><figcaption class="mono">原信的路线 · 片内在上，现实在下 · 示意地图，不按实际尺寸</figcaption></figure>
        <div class="jd-steps"><p class="mono jd-sc"></p><ol></ol><div class="jd-nav"><button type="button" data-prev>上一步</button><button type="button" data-next>下一步</button><button type="button" data-play aria-pressed="false">自动播放</button></div></div>
      </div>
      <div class="jd-bench">
        <figure class="jd-fig"><div class="jd-svg"></div><figcaption class="mono">07 号台 · 接收窗与光筒 · 结构示意</figcaption></figure>
        <aside>
          <p class="mono">STATION 07 / RECEIVER</p><h3 class="jd-wn"></h3>
          <dl class="jd-facts"></dl>
          <div class="jd-paper"></div>
          <p class="jd-act"></p>
          <button type="button" class="jd-go" data-go></button>
          <p class="jd-st" aria-live="polite"></p>
        </aside>
      </div>
      ${tr('依据首章关卡脚本里的送递规则重绘。按钮只切换说明与示意状态；地图、窗的形状和位置是结构示意，不是 Unity 资产、运行画面或实测尺寸。')}
    </div>`,
    init(el) {
      let r = 0, s = 0, ready = false, timer = 0;
      const q = x => el.querySelector(x);
      const stop = () => { clearInterval(timer); timer = 0; q('[data-play]').setAttribute('aria-pressed', 'false'); q('[data-play]').textContent = '自动播放'; };
      const draw = () => {
        const d = ROUTES[r];
        el.querySelectorAll('[data-r]').forEach(b => b.setAttribute('aria-pressed', Number(b.dataset.r) === r));
        q('.jd-mapsvg').innerHTML = mapSvg(r, s);
        q('.jd-svg').innerHTML = winSvg(r, ready);
        q('.jd-wn').textContent = d.win;
        q('.jd-facts').innerHTML = `<div><dt>送达位置</dt><dd>${d.place}</dd></div><div><dt>对应纸面</dt><dd>${d.paper}</dd></div>`;
        q('.jd-paper').innerHTML = paperSvg(r);
        q('.jd-act').textContent = d.act;
        const go = q('[data-go]'); go.hidden = r === 0; go.textContent = ready ? '退回准备前' : r === 1 ? '拉到 07 白线' : '安装到黄铜座';
        q('.jd-st').textContent = r === 0 ? '固定窗一直在工作位。' : ready ? '窗已在工作位，光路接通。' : '窗还没有到工作位，光路未通。';
        q('.jd-sc').textContent = `${d.name} · 第 ${s + 1} / ${d.steps.length} 步`;
        q('.jd-steps ol').innerHTML = d.steps.map(([h, t], i) => `<li class="${i === s ? 'now' : i < s ? 'past' : ''}"><button type="button" data-s="${i}" aria-current="${i === s ? 'step' : 'false'}"><span class="mono">${String(i + 1).padStart(2, '0')}</span><b>${h}</b><p>${t}</p></button></li>`).join('');
        q('[data-prev]').disabled = !s; q('[data-next]').disabled = s === d.steps.length - 1;
      };
      el.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b || !el.contains(b)) return;
        if (b.dataset.r !== undefined) { stop(); r = Number(b.dataset.r); s = 0; ready = false; }
        else if (b.hasAttribute('data-go')) ready = !ready;
        else if (b.hasAttribute('data-prev')) { stop(); s = Math.max(0, s - 1); }
        else if (b.hasAttribute('data-next')) { stop(); s = Math.min(ROUTES[r].steps.length - 1, s + 1); }
        else if (b.dataset.s !== undefined) { stop(); s = Number(b.dataset.s); }
        else if (b.hasAttribute('data-play')) {
          if (timer) { stop(); return; }
          if (s >= ROUTES[r].steps.length - 1) s = 0;
          b.setAttribute('aria-pressed', 'true'); b.textContent = '暂停'; draw();
          timer = setInterval(() => { if (!el.isConnected) return stop(); if (s >= ROUTES[r].steps.length - 1) { stop(); return; } s++; draw(); b.setAttribute('aria-pressed', 'true'); b.textContent = '暂停'; if (s >= ROUTES[r].steps.length - 1) stop(); }, 2400);
          return;
        } else return;
        draw();
      });
      draw();
    }
  };
  /* ================================================================
     jwSets — the game's own FBX sets (026 post office, 027 station, the street)
     ================================================================ */
  const SETS = [
    { id: 'postal', name: '邮局', code: '026 · 《未寄出的信》', file: 'assets/jingwai-postal.fbx', cut: 3.55, dist: 1.05, h: 'PostalScene · 18 × 20 m',
      d: '公众大厅在前，办理区在后：书写桌、邮戳台和邮槽。原信在这里装袋、盖戳，运单要摄影登记；错过班车的邮袋回到这里补送。',
      f: [['属于哪条路', '赶上邮车 · 错过后补送'], ['在这里做', '装袋 · 压戳 · 摄影运单'], ['模型', '303 个网格，Blender 建模']] },
    { id: 'station', name: '邮车', code: '027 · 《最后一班车》', file: 'assets/jingwai-station.fbx', cut: 4.4, dist: 1.0, h: 'StationScene · 24 × 28 m',
      d: '站台、站钟、信号臂和单层车厢。玩家把运动的车拍成停帧，走近把同一只袋装上车，再续映；车真的离站，袋才算上了班车。',
      f: [['属于哪条路', '赶上邮车'], ['在这里做', '摄影停帧 · 装车 · 发车'], ['模型', '259 个网格，Blender 建模']] },
    { id: 'street', name: '带回街上', code: '07 号街区 · 现实', file: 'assets/jingwai-street.fbx', cut: 99, dist: 1.0, h: 'CityDistrict',
      d: '封存之后，玩家领取纪念匣，走出档案门来到街区。艾达后来和女儿在这里开了 07 号相片店；直接亲送的原信从这里递到米娅手里。',
      f: [['属于哪条路', '直接亲送'], ['在这里做', '见艾达 · 亲手交信 · 检修后搭路'], ['模型', '首章现实层街区']] }
  ];
  const lib = {};
  const loadLib = () => lib.p || (lib.p = Promise.all([import('https://cdn.jsdelivr.net/npm/three@0.160.0/+esm'), import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/FBXLoader.js/+esm')]).then(([T, L]) => ({ T, FBXLoader: L.FBXLoader })));
  M.jwSets = {
    html: () => `<section class="js3" data-noeva aria-label="三个片场的三维模型">
      <div class="js3-tabs" role="group" aria-label="选择片场">${SETS.map((s, i) => `<button type="button" data-set="${i}" aria-pressed="${!i}"><span class="mono">${s.code}</span><b>${s.name}</b></button>`).join('')}</div>
      <div class="js3-body">
        <div class="js3-stage" tabindex="0" role="group" aria-label="三维模型，拖动旋转，左右方向键转动"><div class="js3-gl"></div><p class="js3-load mono">LOADING MODEL…</p><p class="js3-hint mono">DRAG · ← →</p></div>
        <aside><p class="mono js3-code"></p><h3 class="js3-name"></h3><p class="js3-d"></p><dl class="js3-f"></dl>
          <div class="js3-ctl"><label><input type="checkbox" data-cut checked> 剖开屋顶</label><label><input type="checkbox" data-spin checked> 自动旋转</label><label class="rng">距离<input type="range" data-zoom min="60" max="150" value="100" aria-label="距离"></label></div>
          <p class="js3-src mono"></p></aside>
      </div>
      ${tr('模型是游戏里的实际场景文件（Blender 建模后导出），页面中只显示几何与材质色；碰撞、光照和交互属于 Unity 运行时，这里不演示。')}
    </section>`,
    init(el) {
      const q = x => el.querySelector(x);
      let cur = 0, api = null, ready = false;
      const info = () => { const s = SETS[cur]; el.querySelectorAll('[data-set]').forEach(b => b.setAttribute('aria-pressed', Number(b.dataset.set) === cur)); q('.js3-code').textContent = s.code; q('.js3-name').textContent = s.name; q('.js3-d').textContent = s.d; q('.js3-f').innerHTML = s.f.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join(''); q('.js3-src').textContent = s.h; q('[data-cut]').disabled = s.cut > 90; };
      el.querySelectorAll('[data-set]').forEach(b => b.addEventListener('click', () => { cur = Number(b.dataset.set); info(); api && api.show(cur); }));
      info();
      const start = () => {
        if (ready) return; ready = true;
        loadLib().then(({ T, FBXLoader }) => {
          const host = q('.js3-gl'), scene = new T.Scene(), cam = new T.PerspectiveCamera(34, 1, .1, 500);
          const rd = new T.WebGLRenderer({ antialias: true, alpha: true }); rd.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); rd.localClippingEnabled = true; host.append(rd.domElement); rd.domElement.setAttribute('aria-hidden', 'true');
          scene.add(new T.HemisphereLight(0xfff4de, 0x3a4766, 1.6)); const sun = new T.DirectionalLight(0xffffff, 2.1); sun.position.set(-8, 14, 10); scene.add(sun);
          const plane = new T.Plane(new T.Vector3(0, -1, 0), 99), root = new T.Group(); scene.add(root);
          const cache = {}; let yaw = .7, pitch = .55, dist = 30, sz = 20, drag = null, spin = true, zoom = 1, last = 0, visible = true, raf = 0, showing = -1;
          const place = () => { const d = dist * zoom; cam.position.set(Math.sin(yaw) * Math.cos(pitch) * d, Math.sin(pitch) * d + sz * .12, Math.cos(yaw) * Math.cos(pitch) * d); cam.lookAt(0, sz * .12, 0); };
          const render = () => { place(); rd.render(scene, cam); };
          const size = () => { const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return; rd.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); render(); };
          const fit = i => {
            const g = cache[i], s = SETS[i]; root.clear(); root.add(g);
            const b = new T.Box3().setFromObject(g), v = b.getSize(new T.Vector3()), c = b.getCenter(new T.Vector3());
            g.position.set(-c.x, -b.min.y, -c.z); sz = Math.max(v.x, v.z); dist = Math.max(v.x, v.z, v.y) * 1.55 * s.dist; place();
            g.traverse(o => { if (o.isMesh) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { m.side = T.DoubleSide; m.clippingPlanes = [plane]; if (m.shininess) m.shininess = 8; }); });
            plane.constant = q('[data-cut]').checked ? s.cut : 99; q('.js3-load').hidden = true; showing = i; render();
          };
          const show = i => {
            if (cache[i]) return fit(i);
            const l = q('.js3-load'); l.hidden = false; l.textContent = 'LOADING MODEL…';
            new FBXLoader().load(SETS[i].file, g => { cache[i] = g; if (i === cur) fit(i); }, undefined, () => { l.textContent = '模型没有加载成功'; });
          };
          const loop = ts => { if (!visible || !el.isConnected) { raf = 0; return; } const dt = Math.min(.05, (ts - last) / 1000 || .016); last = ts; if (spin && !drag && showing >= 0) yaw += dt * .25; render(); raf = requestAnimationFrame(loop); };
          const stage = q('.js3-stage');
          stage.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, yw: yaw, pt: pitch, on: false }; });
          addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (!drag.on && Math.abs(dx) > 5 && Math.abs(dx) >= Math.abs(dy)) { drag.on = true; try { stage.setPointerCapture(e.pointerId); } catch (_) {} } if (drag.on) { yaw = drag.yw - dx * .008; pitch = Math.max(.12, Math.min(1.35, drag.pt + dy * .006)); render(); } });
          const up = () => { drag = null; }; addEventListener('pointerup', up); addEventListener('pointercancel', up);
          stage.addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { yaw += e.key === 'ArrowLeft' ? -.15 : .15; render(); e.preventDefault(); } });
          q('[data-spin]').addEventListener('change', e => { spin = e.target.checked; });
          q('[data-cut]').addEventListener('change', e => { plane.constant = e.target.checked ? SETS[cur].cut : 99; render(); });
          q('[data-zoom]').addEventListener('input', e => { zoom = Number(e.target.value) / 100; render(); });
          new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); } }).observe(el);
          new ResizeObserver(size).observe(host);
          api = { show }; el.dataset.sets = '3d'; size(); show(cur);
          addEventListener('pagehide', () => rd.dispose(), { once: true });
        }).catch(err => { q('.js3-load').textContent = '三维库没有加载成功'; console.warn('jwSets', err); });
      };
      new IntersectionObserver((es, ob) => { if (es[0].isIntersecting) { ob.disconnect(); start(); } }, { rootMargin: '300px' }).observe(el);
    }
  };

  /* ================================================================
     jwClues — the two paper clues and the film strip they lead to
     ================================================================ */
  M.jwClues = {
    html: () => `<div class="jcs" data-noeva aria-label="07 号的两条线索">
      <ol>${[
        ['读', '便条告诉你该用哪扇窗。', 'jingwai/paper-note-v138', '送递便条的实机帧', 'CLUE 01 · READ FIRST', '送递便条', '说明这封信怎样抵达，也指出这一次要找的接收窗。', '07 · 1A'],
        ['修', '按救援留下的证据完成主检修，对好光路。', 'jingwai/paper-map-v138', '完整检修图的实机帧', 'CLUE 02 · AFTER REPAIR', '完整检修图', '完成检修与光路，开盖，把整张图拍清楚，才开放桥与楼梯的摄影。', '07 · 2A'],
        ['拍', '开盖后拍清整张图，再拍桥与楼梯。', 'jingwai/structure-v136', '桥与楼梯样机的实机帧', 'RESULT · STRUCTURE', '桥与楼梯', '检修图记进场记簿后，举镜拍下样机，用照片补出去影院的路。', '07 · 3A']
      ].map(([g, s, img, alt, k, h, t, fn]) => `<li><p class="jcs-g" aria-hidden="true">${g}</p><p class="jcs-s">${s}</p><figure class="jcs-f"><img src="${asset(img)}" alt="${alt}" loading="lazy"><span class="mono">${fn}</span></figure><div class="jcs-c"><b class="mono">${k}</b><h4>${h}</h4><p>${t}</p></div></li>`).join('')}</ol>
      ${tr('三张都是 v1.3.6 / v1.3.8 的引擎画面。纸图的使用规则来自首章关卡脚本；读纸本身不是强制的门票。')}
    </div>`
  };

  /* ================================================================
     jwJoin / jwOutcomes — rescue × delivery meet at 07
     ================================================================ */
  const RES = [
    { name: '餐车', sev: '撞痕', ev: '受损灯座与撞痕', rep: '读撞痕与刻线，按实际损伤调节光路', res: '艾达安全；马丁仍要处理吊索', ent: '服务门', entS: '服务门', img: 'assets/frames/jw-025-hall.webp', crop: true },
    { name: '钩索', sev: '合影', ev: '完整三人合影（拍齐才有）', rep: '镂空人名框逐人对位，摄影生成校准片；没有合影就用公共片', res: '吊索修好，马丁可以松手参加合影', ent: '完整合影走正门；缺合影走服务门', entS: '正门 / 服务门', img: 'jingwai/family-v133' },
    { name: '撑杆', sev: '锁位', ev: '两段行程与三节锁位', rep: '对照锁位摄影，调两段套管，合总锁、抬挡光闸', res: '灯被临时托住；马丁仍抓着原索', ent: '服务门', entS: '服务门', img: 'jingwai/brace-v133' }
  ];
  const GL = {
    cart: '<svg viewBox="0 0 48 32" aria-hidden="true"><rect x="6" y="8" width="36" height="5" fill="currentColor"/><path d="M10 13V26M38 13V26M10 22H38" stroke="currentColor" stroke-width="2.4" fill="none"/><circle cx="12" cy="28" r="3.2" fill="currentColor"/><circle cx="36" cy="28" r="3.2" fill="currentColor"/></svg>',
    hook: '<svg viewBox="0 0 48 32" aria-hidden="true"><path d="M8 4H40" stroke="currentColor" stroke-width="3"/><path d="M24 4V18Q24 28 16 28Q10 28 10 22" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="36" cy="22" r="5" fill="none" stroke="currentColor" stroke-width="3"/></svg>',
    brace: '<svg viewBox="0 0 48 32" aria-hidden="true"><path d="M24 30V8" stroke="currentColor" stroke-width="4"/><path d="M14 8H34L31 3H17Z" fill="currentColor"/><circle cx="24" cy="25" r="5" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>',
    fixed: '<svg viewBox="0 0 48 32" aria-hidden="true"><rect x="9" y="3" width="30" height="26" fill="none" stroke="currentColor" stroke-width="3"/><path d="M24 3V29M9 16H39" stroke="currentColor" stroke-width="2"/></svg>',
    slide: '<svg viewBox="0 0 48 32" aria-hidden="true"><rect x="6" y="5" width="22" height="20" fill="none" stroke="currentColor" stroke-width="3"/><path d="M3 29H45M28 15H36" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    carry: '<svg viewBox="0 0 48 32" aria-hidden="true"><path d="M16 10Q24 -2 32 10" fill="none" stroke="currentColor" stroke-width="3"/><rect x="11" y="10" width="26" height="20" fill="none" stroke="currentColor" stroke-width="3"/><path d="M24 10V30M11 20H37" stroke="currentColor" stroke-width="2"/></svg>'
  };
  const RG = ['cart', 'hook', 'brace'], WG = ['fixed', 'slide', 'carry'];
  /* convergence diagram: rescue evidence and window both end on the 07 bench, then the same five steps */
  const flowSvg = (r, c) => {
    const rx = [30, 190, 350], wx = [540, 700, 860], rt = [350, 410, 470], wt = [530, 590, 650];
    const seq = ['完成主检修与窗的准备', '真实调光', '退闩开盖', '摄影完整检修图', '开放桥与楼梯'];
    const win = ['上层收件柜', '补送盘', '黄铜座'];
    const rib = (x0, xt, on, col) => `<path d="M${x0} 156C${x0} 196 ${xt} 186 ${xt} 226" fill="none" stroke="${col}" stroke-width="${on ? 18 : 10}" stroke-opacity="${on ? .9 : .16}" stroke-linecap="butt"/>`;
    const node = (x, y, w, h, txt, sub, on, col, fg) => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${on ? col : '#faf4e6'}" stroke="#1d2a44" stroke-width="${on ? 3 : 1.5}" opacity="${on ? 1 : .75}"/><text x="${x + w / 2}" y="${y + (sub ? h / 2 - 3 : h / 2 + 7)}" text-anchor="middle" font-size="20" font-weight="800" fill="${on ? fg : '#1d2a44'}">${txt}</text>${sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 19}" text-anchor="middle" font-size="14" fill="${on ? fg : '#5b5a55'}">${sub}</text>` : ''}</g>`;
    return `<svg viewBox="0 0 1000 480" role="img" aria-label="${RES[r].name}与${ROUTES[c].win}在 07 号汇合的流程图"><title>救法与送法在 07 号汇合</title>
      ${RES.map((s, i) => `<path d="M${rx[i] + 70} 56V96" stroke="#1d2a44" stroke-width="2" stroke-opacity="${i === r ? 1 : .3}"/>`).join('')}${ROUTES.map((s, i) => `<path d="M${wx[i] + 65} 56V96" stroke="#1d2a44" stroke-width="2" stroke-opacity="${i === c ? 1 : .3}"/>`).join('')}
      ${RES.map((s, i) => rib(rx[i] + 70, rt[i], i === r, '#c86763')).join('')}${ROUTES.map((s, i) => rib(wx[i] + 65, wt[i], i === c, '#b58a3a')).join('')}
      ${RES.map((s, i) => node(rx[i], 10, 140, 46, s.name, '', i === r, '#c86763', '#fff9ee') + node(rx[i], 96, 140, 60, s.sev, '留下的证据', i === r, '#f3d3cf', '#1d2a44')).join('')}
      ${ROUTES.map((s, i) => node(wx[i], 10, 130, 46, s.win, '', i === c, '#b58a3a', '#fff9ee') + node(wx[i], 96, 130, 60, win[i], '送到这里', i === c, '#f3e3bd', '#1d2a44')).join('')}
      <rect x="30" y="226" width="940" height="62" fill="#1d2a44"/><text x="50" y="266" font-size="26" font-weight="900" fill="#f1e6cf">07 检修台</text><text x="950" y="264" text-anchor="end" font-size="16" fill="#e0b765" font-family="'JetBrains Mono',monospace">读证据 · 对光路 · 开盖 · 拍整图</text>
      ${seq.map((t, i) => `<path d="M${30 + i * 196 + 90} 288V322" stroke="#1d2a44" stroke-width="2.5"/><rect x="${30 + i * 196}" y="322" width="180" height="64" fill="${i === 4 ? '#c86763' : '#f1e6cf'}" stroke="#1d2a44" stroke-width="2.5"/><text x="${30 + i * 196 + 14}" y="346" font-size="13" fill="${i === 4 ? '#fff9ee' : '#c86763'}" font-family="'JetBrains Mono',monospace" font-weight="700">0${i + 1}</text><text x="${30 + i * 196 + 90}" y="372" text-anchor="middle" font-size="15" font-weight="800" fill="${i === 4 ? '#fff9ee' : '#1d2a44'}">${t}</text>`).join('')}
      <path d="M886 386V424" stroke="#1d2a44" stroke-width="2.5"/><rect x="740" y="424" width="230" height="46" fill="#faf4e6" stroke="#1d2a44" stroke-width="3"/><text x="855" y="454" text-anchor="middle" font-size="19" font-weight="900" fill="#1d2a44">影院入口：${RES[r].entS}</text>
    </svg>`;
  };
  M.jwJoin = {
    html: () => `<section class="jj" data-noeva aria-label="救援与送递在 07 号汇合">
      <div class="jj-grid" role="group" aria-label="九种组合，选一格查看"><span class="corner mono">救援 ＼ 送递</span>${ROUTES.map((r, c) => `<b class="ch" data-c="${c}"><i>${GL[WG[c]]}</i>${r.win}</b>`).join('')}${RES.map((s, rr) => `<b class="rh" data-r="${rr}"><i>${GL[RG[rr]]}</i>${s.name}</b>${ROUTES.map((r, c) => `<button type="button" data-rc="${rr}${c}" aria-pressed="${!rr && !c}"><span class="mono">${s.name} × ${r.win}</span><b>${s.sev} ＋ ${r.win}</b><em>入口：${s.entS}</em></button>`).join('')}`).join('')}</div>
      <div class="jj-flow"><figure><div class="jj-svg"></div><figcaption class="mono">救援与送递在 07 号汇合 · 流程示意</figcaption></figure></div>
      <div class="jj-out" aria-live="polite"><article class="a"><span class="mono">救援决定</span><h4></h4><p></p></article><article class="b"><span class="mono">送递决定</span><h4></h4><p></p></article></div>
      ${tr('救援决定检修的对象，送递决定接收窗。九种组合是在解释机制条件，不表示九种组合都在同一构建里逐一验收过。')}
    </section>`,
    init(el) {
      let r = 0, c = 0; const q = x => el.querySelector(x);
      const draw = () => {
        el.querySelectorAll('[data-rc]').forEach(b => b.setAttribute('aria-pressed', b.dataset.rc === `${r}${c}`));
        el.querySelectorAll('.rh').forEach(b => b.classList.toggle('on', Number(b.dataset.r) === r)); el.querySelectorAll('.ch').forEach(b => b.classList.toggle('on', Number(b.dataset.c) === c));
        q('.jj-svg').innerHTML = flowSvg(r, c);
        q('.jj-out .a h4').textContent = `${RES[r].name} → ${RES[r].ev}`; q('.jj-out .a p').textContent = `07 检修：${RES[r].rep}。`;
        q('.jj-out .b h4').textContent = `${ROUTES[c].name} → ${ROUTES[c].win}`; q('.jj-out .b p').textContent = `${ROUTES[c].act}`;
      };
      el.querySelectorAll('[data-rc]').forEach(b => b.addEventListener('click', () => { r = Number(b.dataset.rc[0]); c = Number(b.dataset.rc[1]); draw(); }));
      el.querySelectorAll('.rh').forEach(b => b.addEventListener('click', () => { r = Number(b.dataset.r); draw(); })); el.querySelectorAll('.ch').forEach(b => b.addEventListener('click', () => { c = Number(b.dataset.c); draw(); })); draw();
    }
  };
  M.jwOutcomes = {
    html: () => `<section class="jo" data-noeva aria-label="三种救援留下的差别">
      <ol>${RES.map((s, i) => `<li><figure class="${s.crop ? 'crop' : ''}">${s.crop ? '<div class="jo-dia">' + hallSvg({ t: 10, mode: 'cart', slice: true }) + '</div>' : `<img src="${asset(s.img)}" alt="${s.name}路线的画面" loading="lazy">`}<b aria-hidden="true">0${i + 1}</b><figcaption class="mono">${s.name}</figcaption></figure><div><h4>${s.res}</h4><dl><div><dt>留下的证据</dt><dd>${s.ev}</dd></div><div><dt>07 检修</dt><dd>${s.rep}</dd></div><div><dt>影院入口</dt><dd>${s.ent}</dd></div></dl></div></li>`).join('')}</ol>
      <div class="jo-same"><p class="jo-12" aria-hidden="true">12<small>SEC</small></p><div><b class="mono">三种方法的共同结果</b><p>艾达获救，正式封存后失去 23:16:50—23:17:02 这十二秒的亲身记忆。三人合影也不免除代价；照片里缺人，只说明没有入镜，不能推断人物死亡。</p></div></div>
      ${tr('依据首章关卡脚本。结章仍需正式封存、领纪念匣、见艾达、米娅亲收、实际检修与完整图纸摄影、桥梯通路，以及身体进入影院。')}
    </section>`
  };

  /* ================================================================
     jwInnovation — three design positions
     ================================================================ */
  const posSvg = [
    '<svg viewBox="0 0 260 130" role="img" aria-label="尝试可以反复，封存只有一次"><title>排演与封存分开</title><rect x="10" y="20" width="150" height="90" rx="45" fill="none" stroke="#3f8a86" stroke-width="3" stroke-dasharray="7 6"/><path d="M60 45a28 28 0 1 1-8 30" fill="none" stroke="#3f8a86" stroke-width="3"/><path d="M44 78l8-8-1 11z" fill="#3f8a86"/><text x="85" y="70" font-size="17" fill="#1d2a44">尝试</text><path d="M160 65H200" stroke="#1d2a44" stroke-width="3"/><rect x="200" y="38" width="50" height="54" fill="#c86763"/><text x="225" y="72" font-size="17" text-anchor="middle" fill="#faf4e6">封存</text></svg>',
    '<svg viewBox="0 0 260 130" role="img" aria-label="三条分支各留下一件实物证据"><title>分支留下实物证据</title><path d="M20 65H70M70 65L120 24H170M70 65H170M70 65L120 106H170" fill="none" stroke="#1d2a44" stroke-width="3"/><g fill="#faf4e6" stroke="#1d2a44" stroke-width="3"><rect x="170" y="10" width="76" height="28"/><rect x="170" y="51" width="76" height="28"/><rect x="170" y="92" width="76" height="28"/></g><g font-size="15" fill="#1d2a44"><text x="208" y="30" text-anchor="middle">撞痕</text><text x="208" y="71" text-anchor="middle">合影</text><text x="208" y="112" text-anchor="middle">锁位</text></g><circle cx="20" cy="65" r="8" fill="#c86763"/></svg>',
    '<svg viewBox="0 0 260 130" role="img" aria-label="同一封原信从片内走到现实"><title>唯一原件贯穿片内与现实</title><rect x="6" y="14" width="248" height="46" fill="#f3d3cf" opacity=".7"/><rect x="6" y="70" width="248" height="46" fill="#d7e9e6" opacity=".9"/><text x="12" y="30" font-size="13" fill="#1d2a44">片内</text><text x="12" y="86" font-size="13" fill="#1d2a44">现实</text><path d="M60 38H120L150 94H214" fill="none" stroke="#c86763" stroke-width="3.5"/><g transform="translate(60 38)"><rect x="-12" y="-8" width="24" height="16" fill="#faf4e6" stroke="#1d2a44" stroke-width="2.5"/><path d="M-12 -8L0 2L12 -8" fill="none" stroke="#1d2a44" stroke-width="2"/></g><g transform="translate(214 94)"><rect x="-12" y="-8" width="24" height="16" fill="#faf4e6" stroke="#1d2a44" stroke-width="2.5"/><path d="M-12 -8L0 2L12 -8" fill="none" stroke="#1d2a44" stroke-width="2"/></g></svg>'
  ];
  M.jwInnovation = {
    html: () => `<section class="jn" data-noeva aria-label="三处设计定位"><ol>${[
      ['排演与不可逆封存分开', '快门不自动收取代价。玩家可以先检验物件受力，正式提交由实体封存杆确认。', '参考里的“局部退回”处理空间；镜外把“可重试”和“不可撤回的记忆代价”分成两层。'],
      ['分支留下可查的实物证据', '撞痕、合影、锁位会改变下一段要做的操作，不只是换一段结局文字。', '参考里的顺序决定后果；镜外让后果落在 07 号要读、要对、要重搭的实物上。'],
      ['唯一原件贯穿电影与现实', '装袋、到柜、亲交保留成不同的事实；运单、回执和照片都不能替代原信。', '参考里的工具靠探索建立用途；镜外让同一件实物跨片流转，它放在哪里，剧情就走到哪里。']
    ].map(([h, t, d], i) => `<li><p class="jn-no" aria-hidden="true">0${i + 1}</p><div class="jn-fig">${posSvg[i]}</div><div class="jn-tx"><h3>${h}</h3><p>${t}</p><p class="vs"><b class="mono">相对参考</b>${d}</p></div></li>`).join('')}</ol>
      ${tr('这是相对上述参考原则的设计定位，不声称行业首创、效果优于其他游戏，也没有得到玩家研究的验证。')}</section>`
  };

  /* ================================================================
     jwMake — two lanes, five steps, one loop back
     ================================================================ */
  M.jwMake = {
    html: () => `<section class="jmk" data-noeva aria-label="制作链路">
      <div class="jmk-who"><article class="me"><span class="mono">ME / 我</span><h4>设计取舍与验收</h4><p>世界观、人物关系、关卡脚本、记忆代价；试玩里的问题，逐条写成按键、状态和反馈要求；决定什么算通过。</p></article><article class="ai"><span class="mono">CODEX / 实现</span><h4>代码、模型与渲染</h4><p>Unity C# 脚本、Blender 功能资产、纸本界面、材质与渲染，按合同实现，再回报实际结果。</p></article></div>
      <ol class="jmk-chain"><li class="lane me" aria-hidden="true"><b>我</b></li><li class="lane ai" aria-hidden="true"><b>Codex</b></li>${[
        ['01', '设计合同', '人物目的、状态、失败恢复、功能部件。', '关卡脚本 · 要求清单', 'me'],
        ['02', '资产与代码', 'Blender 分件建模，Unity 写输入与实体判定。', '.blend · FBX · C#', 'ai'],
        ['03', '画面校对', '大厅色面、功能握柄、纸面、Shader 与局部光。', '固定机位的引擎帧', 'both'],
        ['04', '原生构建', '固定版本下用真实输入跑流程，保存结果与引擎帧。', 'Windows 包 · WebGL 版', 'ai'],
        ['05', '复核交付', '受影响的流程复测；没测到的范围单独记录。', '验收记录 · 版本说明', 'me']
      ].map(([n, h, t, a, w]) => `<li class="st ${w}" style="grid-column:${Number(n) + 1}"><span class="mono">${n}</span><h4>${h}</h4><p>${t}</p><em>${a}</em></li>`).join('')}</ol>
      <p class="jmk-loop" aria-hidden="true">↺ 没通过，回到第 01 步改合同</p>
      ${tr('制作顺序来自首章制作规范与 v1.3.8 的描边、灯光文档。自动功能检查不等于第一次真人游玩，没有测到的范围单独登记。')}
    </section>`
  };

  /* ================================================================
     jwHall — the coral hall and its five colours
     ================================================================ */
  M.jwHall = {
    html: () => `<div class="jh2" data-noeva aria-label="大厅与色面">
      <figure class="a"><img src="${asset('jingwai/ada-v138')}" alt="人物：帽檐、肩袖与手部动作" loading="lazy"><figcaption class="mono">A · 人物：帽檐、肩袖与手部动作</figcaption></figure>
      <ul class="pal">${[['#f1e6cf', '奶油 / 纸', '纸面与墙面留白', '#1d2a44'], ['#c86763', '珊瑚 / 建筑', '大厅的大色面', '#fff9ee'], ['#2b3157', '墨蓝 / 结构', '压住结构和阴影', '#f1e6cf'], ['#b58a3a', '黄铜 / 机械', '握轮、锁扣、灯架', '#fff9ee'], ['#7fb5ad', '青绿 / 远景', '把对岸影院推远', '#1d2a44']].map(([c, n, u, f]) => `<li style="background:${c};color:${f}"><b>${n}</b><span>${u}</span><i class="mono">${c.toUpperCase()}</i></li>`).join('')}</ul>
      <p class="why">拱窗、长桌和吊灯排出一场家庭电影的布景。奶油与珊瑚铺开空间，墨蓝压住结构，黄铜只留给要动手的部件；近处的轮廓和局部光帮人认出工具，青绿的远景让影院显得在河的另一边。</p>
      <figure class="b"><img src="${asset('jingwai/forwarding-v135')}" alt="器械：07 号检修台" loading="lazy"><figcaption class="mono">B · 器械：07 号检修台 · v1.3.5</figcaption></figure>
      <figure class="c"><img src="${asset('jingwai/editing-v138')}" alt="剪辑台：原盘入槽，封存杆到底" loading="lazy"><figcaption class="mono">C · 剪辑台：原盘入槽，封存杆到底</figcaption></figure>
      <figure class="d"><img src="${asset('jingwai/arrival-note-v138')}" alt="街头线索：便条与相机留底" loading="lazy"><figcaption class="mono">D · 街头线索：看见便条，用相机留底</figcaption></figure>
    </div>`
  };

  /* ================================================================
     jwShader — flat colour, outline, local light, paper; a before/after wipe plus per-layer switches
     ================================================================ */
  const LAY = [
    ['flat', '平涂色面', '把物件分成大块颜色：墙是珊瑚，机械是黄铜。关掉以后只剩灰模，分不清哪里能动手。'],
    ['line', '描边', '轮廓线把握轮、杆和台面从背景里拎出来，近处的工具先被看见。'],
    ['light', '局部光', '只给要操作的部件加一点高光，视线会落到握轮和纸图上。'],
    ['paper', '纸面', '纸图的纹理和折角让它看起来是一张能拿起来的实物。']
  ];
  const shSvg = (u, cls) => `<svg viewBox="0 0 520 340" class="jsh-svg ${cls}" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <defs><radialGradient id="jsh-hl${u}" cx=".3" cy=".28" r=".7"><stop offset="0" stop-color="#fff6d8" stop-opacity=".95"/><stop offset=".55" stop-color="#fff6d8" stop-opacity=".18"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></radialGradient><radialGradient id="jsh-lamp${u}" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#ffe9b0" stop-opacity=".55"/><stop offset="1" stop-color="#ffe9b0" stop-opacity="0"/></radialGradient><pattern id="jsh-pp${u}" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M0 9L9 0" stroke="#b9a37a" stroke-width=".8" opacity=".5"/></pattern></defs>
        <g class="fill" style="--f:#c86763"><rect x="0" y="0" width="520" height="340"/></g>
        <g class="fill" style="--f:#e0a29b"><rect x="0" y="236" width="520" height="104"/></g>
        <g class="ol"><path d="M0 236H520" /></g>
        <g class="fill" style="--f:#2b3157"><rect x="40" y="226" width="250" height="38" rx="3"/></g><g class="ol"><rect x="40" y="226" width="250" height="38" rx="3"/></g>
        <g class="fill" style="--f:#2b3157"><rect x="148" y="166" width="34" height="62"/></g><g class="ol"><rect x="148" y="166" width="34" height="62"/></g>
        <g class="wheel">
          <g class="fill" style="--f:#b58a3a"><circle cx="165" cy="120" r="74"/></g>
          <g class="fill" style="--f:#e0c27a"><circle cx="165" cy="120" r="58"/></g>
          <g class="fill" style="--f:#b58a3a">${Array.from({ length: 8 }, (_, i) => `<rect x="161" y="56" width="8" height="128" rx="3" transform="rotate(${i * 22.5} 165 120)"/>`).join('')}</g>
          <g class="fill" style="--f:#2b3157"><circle cx="165" cy="120" r="16"/></g>
          <g class="fill" style="--f:#b58a3a"><circle cx="165" cy="120" r="7"/></g>
          <g class="ol"><circle cx="165" cy="120" r="74"/><circle cx="165" cy="120" r="58"/><circle cx="165" cy="120" r="16"/>${Array.from({ length: 4 }, (_, i) => `<rect x="161" y="56" width="8" height="128" rx="3" transform="rotate(${i * 45} 165 120)"/>`).join('')}</g>
          <circle class="lt" cx="165" cy="120" r="74" fill="url(#jsh-hl${u})"/>
        </g>
        <g class="paper"><g class="fill" style="--f:#f1e6cf"><path d="M318 130L486 118L494 258L326 270Z"/></g><g class="ol"><path d="M318 130L486 118L494 258L326 270Z"/><path d="M342 160H462M344 184H446M346 208H470" /></g><path class="pp" d="M318 130L486 118L494 258L326 270Z" fill="url(#jsh-pp${u})"/><path class="pp" d="M486 118L494 258L462 250Z" fill="#cdb98c" opacity=".7"/></g>
        <ellipse class="lt" cx="400" cy="190" rx="130" ry="100" fill="url(#jsh-lamp${u})"/>
      </svg>`;
  M.jwShader = {
    html: () => `<div class="jsh" data-noeva aria-label="Shader 分层演示">
      <figure class="jsh-fig"><div class="jsh-cmp" style="--pos:50%">
        <div class="jsh-l jsh-a">${shSvg('a', '')}</div>
        <div class="jsh-l jsh-b">${shSvg('b', 'no-flat no-line no-light no-paper')}</div>
        <i class="jsh-handle" aria-hidden="true"><b>◀ ▶</b></i>
        <span class="lbl l mono">勾选的分层</span><span class="lbl r mono">无分层 · 灰模</span>
        <input type="range" class="jsh-range" min="2" max="98" value="50" aria-label="拖动对比：左侧是当前勾选的分层，右侧是灰模">
      </div><figcaption class="mono">黄铜握轮与纸图 · 左右拖动对比 · 左侧为勾选的分层，右侧为灰模 · 分层示意（代码绘制，不是 Unity 截图）</figcaption></figure>
      <div class="jsh-ctl"><p class="mono">LAYERS · 勾选右侧要保留的分层</p>${LAY.map(([k, h, t], i) => `<label><input type="checkbox" data-l="${k}" checked><span><i class="mono">0${i + 1}</i><b>${h}</b>${t}</span></label>`).join('')}
        <p class="jsh-why">这些分层服务一个目的：玩家第一眼能认出哪里可以动手、哪张纸要读。判断范围、机位、遮挡、描边和局部光一起调整，每次都回到引擎画面看一遍。</p></div>
      ${tr('v1.3.8 的渲染记录保留了固定机位和两种纸面的实际摄影。它能说明有限画面里的可读性，不等于全场的性能、全部分支或首次无攻略真人游玩已经通过。')}
    </div>`,
    init(el) {
      const svg = el.querySelector('.jsh-a svg'), cmp = el.querySelector('.jsh-cmp'), rg = el.querySelector('.jsh-range');
      el.querySelectorAll('[data-l]').forEach(c => c.addEventListener('change', () => svg.classList.toggle('no-' + c.dataset.l, !c.checked)));
      const set = () => cmp.style.setProperty('--pos', rg.value + '%'); rg.addEventListener('input', set); set();
    }
  };

  /* ================================================================
     jwChecks — four checks: what went wrong, what Codex was asked, what was verified in the engine
     ================================================================ */
  const ckSvg = [
    /* 撑杆 */ '<svg viewBox="0 0 360 170" role="img" aria-label="撑杆：提示补充前后的对比示意"><rect width="360" height="170" fill="#f6ecd8"/><path d="M180 0V170" stroke="#1d2a44" stroke-width="2" stroke-dasharray="6 6"/><text x="12" y="20" font-size="13" fill="#c86763" font-family="\'JetBrains Mono\',monospace">BEFORE</text><text x="192" y="20" font-size="13" fill="#3f8a86" font-family="\'JetBrains Mono\',monospace">AFTER</text><g transform="translate(95 44)"><ellipse cx="0" cy="-8" rx="26" ry="5" fill="#b58a3a" opacity=".5"/><circle cx="0" cy="0" r="8" fill="#f6c76a" opacity=".5"/></g><path d="M60 150L82 76" stroke="#1d2a44" stroke-width="5" stroke-dasharray="6 6" opacity=".5"/><text x="102" y="110" font-size="34" fill="#c86763" font-weight="900">?</text><text x="90" y="160" text-anchor="middle" font-size="13" fill="#5b5a55">只写“拿起、寻找细节”</text><g transform="translate(270 44)"><ellipse cx="0" cy="-8" rx="26" ry="5" fill="#b58a3a"/><circle cx="0" cy="0" r="8" fill="#f6c76a"/></g><rect x="266" y="116" width="8" height="38" fill="#2b3157"/><rect x="268" y="66" width="4" height="52" fill="#b58a3a"/><path d="M259 66H281L278 58H262Z" fill="#b58a3a"/><circle cx="270" cy="142" r="9" fill="none" stroke="#b58a3a" stroke-width="3.5"/><path d="M286 118h10M286 130h10M286 142h10" stroke="#1d2a44" stroke-width="2.5"/><circle cx="296" cy="118" r="0" fill="#f2c94c"/><text x="212" y="146" font-size="13" fill="#1d2a44" text-anchor="end">握轮</text><text x="300" y="66" font-size="13" fill="#1d2a44">托头</text><path d="M326 150l8 8 18-22" fill="none" stroke="#3f8a86" stroke-width="4"/></svg>',
    /* 握柄 */ '<svg viewBox="0 0 360 170" role="img" aria-label="握柄：命中范围与遮挡的对比示意"><rect width="360" height="170" fill="#f6ecd8"/><path d="M180 0V170" stroke="#1d2a44" stroke-width="2" stroke-dasharray="6 6"/><text x="12" y="20" font-size="13" fill="#c86763" font-family="\'JetBrains Mono\',monospace">BEFORE</text><text x="192" y="20" font-size="13" fill="#3f8a86" font-family="\'JetBrains Mono\',monospace">AFTER</text><rect x="60" y="70" width="60" height="50" fill="#2b3157"/><circle cx="90" cy="68" r="6" fill="#b58a3a"/><path d="M30 126h22l12-30" fill="none" stroke="#c86763" stroke-width="4" stroke-dasharray="4 5"/><text x="90" y="156" text-anchor="middle" font-size="13" fill="#5b5a55">看得见，够不着</text><rect x="240" y="70" width="60" height="50" fill="#2b3157"/><circle cx="270" cy="68" r="6" fill="#b58a3a"/><circle cx="270" cy="68" r="34" fill="#3f8a86" fill-opacity=".14" stroke="#3f8a86" stroke-width="2.5" stroke-dasharray="6 5"/><rect x="224" y="88" width="92" height="12" fill="#c86763" opacity=".35"/><text x="320" y="98" font-size="12" fill="#c86763" text-anchor="end"></text><g font-size="12" fill="#1d2a44"><text x="270" y="30" text-anchor="middle">命中范围</text></g><g fill="#3f8a86"><circle cx="212" cy="150" r="5"/><circle cx="268" cy="150" r="5" fill="#f2c94c"/><circle cx="324" cy="150" r="5"/></g><path d="M217 150H263M273 150H319" stroke="#3f8a86" stroke-width="2"/><g font-size="11.5" fill="#1d2a44" text-anchor="middle"><text x="212" y="138">按住</text><text x="268" y="138">松手</text><text x="324" y="138">留在原处</text></g></svg>',
    /* 原信 */ '<svg viewBox="0 0 360 170" role="img" aria-label="原信：状态合并与分开登记的对比示意"><rect width="360" height="170" fill="#f6ecd8"/><path d="M180 0V170" stroke="#1d2a44" stroke-width="2" stroke-dasharray="6 6"/><text x="12" y="20" font-size="13" fill="#c86763" font-family="\'JetBrains Mono\',monospace">BEFORE</text><text x="192" y="20" font-size="13" fill="#3f8a86" font-family="\'JetBrains Mono\',monospace">AFTER</text><rect x="30" y="64" width="128" height="46" fill="#c86763"/><text x="94" y="93" text-anchor="middle" font-size="15" font-weight="800" fill="#fff9ee">在柜里＝收到</text><text x="94" y="140" text-anchor="middle" font-size="13" fill="#5b5a55">三件事混成一个状态</text><g font-size="13" font-weight="800" text-anchor="middle"><rect x="196" y="76" width="44" height="34" fill="#faf4e6" stroke="#1d2a44" stroke-width="2.5"/><text x="218" y="98" fill="#1d2a44">在柜</text><rect x="252" y="76" width="44" height="34" fill="#faf4e6" stroke="#1d2a44" stroke-width="2.5"/><text x="274" y="98" fill="#1d2a44">取出</text><rect x="308" y="76" width="44" height="34" fill="#c86763" stroke="#1d2a44" stroke-width="2.5"/><text x="330" y="98" fill="#fff9ee">亲交</text></g><path d="M240 93H252M296 93H308" stroke="#1d2a44" stroke-width="2.5"/><path d="M322 66l8 -12h22v18h-16z" fill="#faf4e6" stroke="#1d2a44" stroke-width="2"/><text x="338" y="68" font-size="11" text-anchor="middle" fill="#1d2a44">收到</text><text x="274" y="140" text-anchor="middle" font-size="13" fill="#1d2a44">只有亲交才回应</text></svg>',
    /* 画面 */ '<svg viewBox="0 0 360 170" role="img" aria-label="画面：描边与局部光的对比示意"><rect width="360" height="170" fill="#f6ecd8"/><path d="M180 0V170" stroke="#1d2a44" stroke-width="2" stroke-dasharray="6 6"/><text x="12" y="20" font-size="13" fill="#c86763" font-family="\'JetBrains Mono\',monospace">BEFORE</text><text x="192" y="20" font-size="13" fill="#3f8a86" font-family="\'JetBrains Mono\',monospace">AFTER</text><circle cx="94" cy="84" r="40" fill="#d9a9a2"/><circle cx="94" cy="84" r="30" fill="#e3b8b0"/><path d="M94 44V124M54 84H134" stroke="#d1a09a" stroke-width="5"/><text x="94" y="152" text-anchor="middle" font-size="13" fill="#5b5a55">轮廓和底色糊在一起</text><circle cx="274" cy="84" r="40" fill="#b58a3a" stroke="#141210" stroke-width="4"/><circle cx="274" cy="84" r="30" fill="#e0c27a" stroke="#141210" stroke-width="3"/><path d="M274 44V124M234 84H314" stroke="#141210" stroke-width="4"/><circle cx="262" cy="70" r="14" fill="#fff6d8" opacity=".7"/><text x="274" y="152" text-anchor="middle" font-size="13" fill="#1d2a44">描边 + 局部光</text></svg>'
  ];
  const CHECKS = [
    ['brace', '撑杆', '提示只写“拿起、寻找细节”，看不出撑杆放在哪、怎么用。', '提示直接写明：放在灯下，转低位握轮伸长，托头顶到灯底，锁住。', '在引擎里走一遍：认得出握轮，托头接触时有回应。'],
    ['hand', '握柄', '物件看得见，握柄却够不着；中途松手，动作就断了。', '核对命中范围、距离和遮挡；持续按住的动作被打断时，物件留在原处，可以重试。', '用真实按键，按住、松手、重试各走一遍。'],
    ['letter', '原信', '信还在柜里，米娅就说收到了；到柜、取信、亲交混成了一个状态。', '原件位置、运输记录、人物对白分开登记，只有亲手交给米娅才算亲收。', '到柜之后米娅不说收到，取出递交后才回应。'],
    ['frame', '画面', '刻线、纸面和工具的轮廓不够清楚。', '在固定机位下调整描边、局部光和纸面构图；正式摄影保存普通相机图。', '代码通过之后，再看引擎帧里认不认得出部件、读不读得到线索。']
  ];
  M.jwChecks = {
    html: () => `<section class="jk" data-noeva aria-label="四次检查">
      <ol>${CHECKS.map(([ic, h, a, b, c], i) => `<li><div class="jk-t"><b class="jk-no" aria-hidden="true">0${i + 1}</b><span class="jk-ic">${IC[ic]}</span><h4>${h}</h4></div><figure class="jk-fig">${ckSvg[i]}</figure><div class="jk-s"><div class="x"><span class="mono">发现的问题</span><p>${a}</p></div><div class="y"><span class="mono">交给 Codex 的要求</span><p>${b}</p></div><div class="z"><span class="mono">回到引擎核对</span><p>${c}</p></div></div></li>`).join('')}</ol>
      <p class="jk-lab">提示校准实验室用 4 组固定样例和人工打分，只用来检查提示写法。<a href="demos/jingwai/index.html#lab" target="_blank" rel="noopener">打开实验室 ↗</a></p>
      ${tr('四项是验收的角度，不是四次用户实验，也没有评分或效果提升的数据；示意图是代码绘制的概念图，不是引擎截图。')}</section>`
  };

  /* ================================================================
     jwNow — what exists now, what is only an idea
     ================================================================ */
  M.jwNow = {
    html: () => `<section class="jnw" data-noeva aria-label="现在与后续">
      <div class="jnw-now"><p class="jnw-big" aria-hidden="true">v1.3.8</p><h3>现在做完的</h3>
        <p>摄影、搬动物件、排演和封存，让同一次选择留在照片、人物动作和路上。Unity Windows 版本为 v1.3.8。</p>
        <ul>${[['首章 Demo', 'Windows / 浏览器'], ['提示校准实验室', '4 组固定样例'], ['Blender 源文件', '三个场景与功能资产'], ['关卡脚本', '送递、检修、封存规则'], ['验收记录', '固定机位的引擎帧']].map(([a, b]) => `<li><i aria-hidden="true">✓</i><b>${a}</b><span class="mono">${b}</span></li>`).join('')}</ul></div>
      <div class="jnw-next"><h3>后续设想：电影里再套一层电影</h3>
        <figure><img src="assets/jingwai/layered-film-study.svg" alt="电影里套着电影的结构设想图" loading="lazy"><figcaption class="mono">结构设想 · 非游戏截图 · 还没有做</figcaption></figure>
        <p>想把单张照片延伸到录像：拆开声音、动作和时间，用手里的素材重新剪接情节。玩家走进下一层电影，直到“回到现实”也成了一件需要确认的事。先写完整故事和连续关卡，再扩展机制。</p></div>
    </section>`
  };
})();
