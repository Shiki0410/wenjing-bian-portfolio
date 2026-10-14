/* 天命：祀与戎 — bespoke page. Museum print: bronze black, patina gold, verdigris, rice paper, vermilion.
   Type: Zen Antique (display), Kaisei Tokumin (headings), Yuji Syuku (vertical inscriptions), Ma Shan Zheng (brush accent),
   Noto Sans SC (text), JetBrains Mono (labels).
   References (number = position in _refs/pins.txt):
     title       R456  铜影千年 — dark bronze field, gold vertical calligraphy, dates in a column
     sheet       R309  組版造形 — huge characters set apart on white, one dense text column
     screening   R466  九大经典青釉 — catalogue grid, one object per cell with its label
     question    R462  花瓶 — two huge white characters over the vessel on grey
     story       R461  red / black grid of panels
     character   R113  vermilion overprint collage
     artifact    R464  black field, one white creature, elegant display type
     direction   R459  white catalogue page, vertical captions beside each object
   Everything drawn here is code: the vessel is a software-rendered lathe (canvas 2D, no external library), charts are SVG. */
(() => {
  const PG = (window.PAGES = window.PAGES || {});
  const EP = ['朱契', '青焰', '蜀眸', '钟界', '问名', '鸮陨', '向北', '南渡', '祀戎', '拓归'];
  const PH = [0, 0, 0, 0, 0, 1, 2, 2, 2, 2];            // 5 + 1 + 4
  const E = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const vt = t => `<span class="z-vt">${t}</span>`;
  const p2 = n => String(n).padStart(2, '0');
  const COL = { ink: '#14120e', brown: '#221d16', gold: '#c9a45c', verd: '#4f8a7c', paper: '#efe8da', sheet: '#f8f5ee', red: '#c0392b', mute: '#8f8a80' };
  const PHC = [COL.ink, COL.red, COL.verd];
  const tipA = (h, b) => ` data-tip="${E(h)}" data-tipb="${E(b || '')}" tabindex="0"`;
  const BAL = [
    ['r', '祀 · 被记得', '阿鸮想起自己是谁，靠的是一次次被人叫出名字：第四集编钟里浮出的“妇”字，第五集那一声真名。祀在片里的意思，是文物被认出来、被记住。', [['bronze-ep01-4', 'EP.01《朱契》'], ['bronze-ep10-4', 'EP.10《拓归》']]],
    ['w', '戎 · 被认出', '每件器物都有自己的战斗领域，来自它原来的用途：编钟靠音波，剑靠复仇的斩击，鼎靠吞噬。打起来是力量对撞，破局的办法却是认出它。', [['bronze-ep02-3', 'EP.02《青焰》'], ['bronze-ep08-5', 'EP.08《南渡》']]]
  ];
  const noeva = h => h.replace(/<(section|header)/g, '<$1 data-noeva');
  const stripVt = s => String(s).replace(/<[^>]+>/g, '');

  /* play episode i in the screening-room player */
  const playEp = (root, i) => {
    const room = root.querySelector('.z-room'); if (!room) return;
    const btn = room.querySelectorAll('[data-player] .list button')[i];
    if (btn) { btn.click(); root.querySelectorAll('.zc-grid a').forEach((a, k) => a.classList.toggle('on', k === i)); room.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  };

  PG.bronze = {
    /* ---------- R456 ---------- */
    title(k) {
      const { p, s, esc } = k;
      return noeva(`<section class="z-title" aria-labelledby="tc-name">
        <img class="zt-img" src="assets/${s.key}.webp" alt="${esc(s.keyCap)}" fetchpriority="high">
        <h1 class="zt-name" id="tc-name">${vt('天命')}<small>${vt('祀与戎')}</small></h1>
        <p class="zt-dates" aria-hidden="true"><b>EP.01</b><i></i><b>EP.10</b></p>
        <p class="zt-sub">${vt(esc(s.sub))}</p>
        <p class="zt-en mono">MANDATE OF HEAVEN · RITE AND WAR · ${esc(p.year)}</p>
        <a class="zt-back mono" href="index.html#scene-${p.id}" data-cut="INDEX">← INDEX</a>
        <dl class="zt-meta">${(s.meta || []).map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>
        <p class="zt-cap mono">${esc(s.keyCap)}</p>
      </section>`);
    },

    /* ---------- R309 ---------- */
    logline(k) {
      const { s, md, esc } = k, L = s.logline || {};
      return noeva(`<section class="z-kumi" aria-label="项目摘要">
        <b class="zk-c c1" aria-hidden="true">祀</b><b class="zk-c c2" aria-hidden="true">与</b><b class="zk-c c3" aria-hidden="true">戎</b>
        <div class="zk-col">${[['問', L.q], ['做', L.a], ['果', L.r]].map(([c, t]) => `<p><b>${c}</b>${md(t)}</p>`).join('')}</div>
        <ul class="zk-stats">${(s.stats || []).map(([v, l]) => `<li><b>${esc(v)}</b><span>${esc(l)}</span></li>`).join('')}</ul>
        <p class="zk-date mono">2026.03—06</p>
      </section>`);
    },

    act(a, i, k) { const f = this['a_' + a.id]; const h = f ? f.call(this, a, k, k.use(a)) : null; return h && noeva(h); },

    /* ---------- R466 ---------- */
    a_screening(a, k, u) {
      const { esc, md } = k;
      return `<header class="z-cat">
          <h2 class="zc-h">${vt(md(a.title))}</h2>
          <p class="zc-lead">${md(a.lead)}</p>
          <ol class="zc-grid">${EP.map((t, i) => `<li><a href="#screening" data-ep="${i}"${i === 0 ? ' class="on"' : ''}><img src="assets/bronze-ep${p2(i + 1)}-1.webp" alt="EP.${p2(i + 1)}《${t}》剧照" loading="lazy"><span class="zc-no">${p2(i + 1)}</span><span class="zc-t">${vt(t)}</span></a></li>`).join('')}</ol>
          <p class="zc-k mono">${esc(a.kicker)} · ${esc(a.open.v)}</p>
        </header>
        <section class="z-room" aria-label="成片">${u.b(0)}${u.b(1)}</section>
        ${u.rest()}`;
    },

    /* ---------- R462 ---------- */
    a_question(a, k, u) {
      const { esc, md, src } = k;
      const refs = u.o(5).list || [], layers = u.o(3).layers || [];
      const P = [['bronze-ep04-4', '铸', 'EP.04《钟界》 · 熔化的铜水'], ['bronze-ep06-2', '阵', 'EP.06《鸮陨》 · 军阵'], ['bronze-ep10-3', '器', 'EP.10《拓归》 · 手里的青铜器']];
      return `<header class="z-vase">
          <div class="zv-spine"><p class="zv-q">${vt('国之大事，在祀与戎。')}</p><p class="zv-src mono">《左传 · 成公十三年》</p></div>
          <p class="zv-big zv-b1" aria-hidden="true">祀</p><p class="zv-big zv-b2" aria-hidden="true">戎</p>
          ${P.map(([n, c, t], i) => `<figure class="zv-p zv-p${i}"><img src="${src(n)}" alt="${esc(t)}" loading="lazy"><figcaption><b>${c}</b><span class="mono">${esc(t)}</span></figcaption></figure>`).join('')}
          <div class="zv-copy"><p class="mono">${esc(a.kicker)}</p><h2>${md(a.title)}</h2><p>${md(a.lead)}</p></div>
        </header>
        <section class="z-balance" aria-label="祀与戎在片中的意思" data-balance>
          <button class="zb-side zb-r on" type="button" data-side="r" aria-pressed="true" aria-controls="zb-p-r"><b>祀</b><span class="zb-k mono">RITE · 被记得</span><ul><li>记忆</li><li>传承</li><li>被记得</li></ul></button>
          <div class="zb-mid" aria-hidden="true"><i></i><p>${vt('左传')}</p><i></i></div>
          <button class="zb-side zb-w" type="button" data-side="w" aria-pressed="false" aria-controls="zb-p-w"><b>戎</b><span class="zb-k mono">WAR · 被认出</span><ul><li>武力</li><li>征服</li><li>占有</li></ul></button>
          ${BAL.map(([id, h, t, st]) => `<article class="zb-pane${id === 'r' ? ' on' : ''}" id="zb-p-${id}" data-side="${id}"${id === 'r' ? '' : ' hidden'}><div class="zbp-t"><h4>${h}</h4><p>${t}</p><p class="mono">点上面的“祀”“戎”切换</p></div><ul class="zbp-s">${st.map(([n, c]) => `<li><img src="${src(n)}" alt="${esc(c)}" loading="lazy"><span class="mono">${esc(c)}</span></li>`).join('')}</ul></article>`).join('')}
        </section>
        <section class="z-memory" aria-label="${esc(u.o(0).sub)}">
          <p class="zm-eyebrow mono">MEMORY · FORCE</p>
          <h3 class="zm-h">${esc(u.o(0).sub)}</h3>
          <div class="zm-f">${u.b(1)}</div>
          <div class="zm-t">${u.b(2)}</div>
          <ol class="zm-steps">${layers.map(([h, t], j) => `<li style="--i:${j}"><b>${esc(h)}</b><p>${esc(t)}</p></li>`).join('')}</ol>
        </section>
        <section class="z-borrow" aria-label="${esc(u.o(4).sub)}">
          <h3 class="zx-h">${esc(u.o(4).sub)}</h3>
          <ol class="zb-list">${refs.map(([h, t], j) => { const c = t.lastIndexOf('·'), body = c > 0 ? t.slice(0, c).trim() : t, use = c > 0 ? t.slice(c + 1).trim() : ''; return `<li data-g="${['绘', '镜', '器', '景'][j] || ''}"><i class="mono">${p2(j + 1)}</i><h4>${esc(h)}</h4><p>${esc(body)}</p>${use ? `<p class="zb-use">${esc(use)}</p>` : ''}</li>`; }).join('')}</ol>
          ${u.b(6)}
        </section>
        ${u.rest()}`;
    },

    /* ---------- R461 ---------- */
    a_story(a, k, u) {
      const { esc, md, src } = k;
      const ch = u.o(4).chapters || [];
      return `<header class="z-grid">
          <figure class="zg-a"><img src="${src(a.open.a)}" alt="${esc(a.open.capA)}" loading="lazy"><figcaption>${vt(esc(a.open.capA))}</figcaption></figure>
          <div class="zg-t"><h2>${md(a.title)}</h2><p>${md(a.lead)}</p><p class="mono">${esc(a.kicker)}</p></div>
          <p class="zg-n" aria-hidden="true"><b>5</b><i>+</i><b>1</b><i>+</i><b>4</b></p>
          <figure class="zg-b"><img src="${src(a.open.b)}" alt="${esc(a.open.capB)}" loading="lazy"><figcaption>${vt(esc(a.open.capB))}</figcaption></figure>
        </header>
        <section class="z-cross" aria-label="${esc(u.o(0).sub)}">
          <h3 class="zx-h">${esc(u.o(0).sub)}</h3>
          ${u.b(1)}${u.b(2)}
        </section>
        <section class="z-chap" aria-label="${esc(u.o(3).sub)}">
          <h3 class="zx-h">${esc(u.o(3).sub)}</h3>
          <ol class="zch-list">${ch.map(([t, en, l1, l2, flag], i) => `<li class="${flag === '中折' ? 'mid' : flag === '高潮' ? 'peak' : ''}"><button type="button" data-ep="${i}" aria-label="播放第 ${i + 1} 集《${esc(t)}》">
              <i class="zch-no mono">${p2(i + 1)}</i><b class="zch-t">${vt(esc(t))}</b>
              <span class="zch-c">${vt(esc(l1))}${vt(esc(l2))}</span>
              <span class="zch-en mono">${esc(en)}</span>${flag ? `<em class="zch-f">${esc(flag)}</em>` : ''}</button></li>`).join('')}</ol>
          ${u.b(5)}
        </section>
        ${u.rest()}`;
    },

    /* ---------- R113 ---------- */
    a_character(a, k, u) {
      const { esc, md, src } = k;
      const form = (n, si, ai, bi, tag) => `<section class="z-form f${n}" aria-label="${esc(u.o(si).sub)}">
          <p class="zf-no" aria-hidden="true">0${n}</p>
          <h3>${esc(u.o(si).sub.replace(/^0\d · /, ''))}</h3>
          <p class="zf-tag mono">${tag}</p>
          <div class="zf-a">${u.b(ai)}</div>
          <div class="zf-b">${u.b(bi)}</div>
        </section>`;
      const anchors = u.o(10).list || [];
      return `<header class="z-over">
          <img class="zo-img" src="${src(a.open.img)}" alt="${esc(a.open.cap)}" loading="lazy">
          <p class="zo-word" aria-hidden="true">${esc(a.open.script)}</p>
          <div class="zo-copy"><h2>${md(a.title)}</h2><p>${md(a.lead)}</p><small class="mono">${esc(a.kicker)} · ${esc(a.open.cap)}</small></div>
          <p class="zo-v">${vt('簪花 · 吊坠 · 一直都在')}</p>
        </header>
        ${form(1, 0, 1, 2, 'DAILY · 短红外套')}
        ${form(2, 3, 4, 5, 'BATTLE · 立领长裙 · 玉箫')}
        ${form(3, 6, 7, 8, 'FINAL · 星辰 + 阿鸮 + 妇好')}
        <section class="z-anchors" aria-label="${esc(u.o(9).sub)}">
          <h3 class="zx-h">${esc(u.o(9).sub)}</h3>
          <ol>${anchors.map(([h, t], j) => { const [a1, a2] = h.split(' · '); return `<li><b>${esc(a1)}</b><span class="mono">0${j + 1} · ${esc(a2 || '')}</span><p>${esc(t)}</p></li>`; }).join('')}</ol>
        </section>
        <section class="z-family" aria-label="${esc(u.o(11).sub)}">
          <h3 class="zx-h">${esc(u.o(11).sub)}</h3>
          ${u.b(12)}
        </section>
        ${u.rest()}`;
    },

    /* ---------- R464 ---------- */
    a_artifact(a, k, u) {
      const { esc, md, src } = k;
      const pr = u.o(2).principles || [], fm = u.o(4).forms || [], rows = (u.o(6).table || { rows: [] }).rows;
      const glyph = ['面', '钟', '剑', '鼎', '爵', '贮'], stills = { 'EP.03': 'bronze-ep03-2', 'EP.04': 'bronze-ep04-5', 'EP.05': 'bronze-ep05-2' };
      const scale = .9, owl = ['M50 4 L40 20 C18 24 6 44 6 72 C6 106 26 128 50 128 C74 128 94 106 94 72 C94 44 82 24 60 20 Z M28 28 L20 2 L44 20 Z M72 28 L80 2 L56 20 Z'];
      const art = fm.filter(f => f[4]);
      return `<header class="z-loong" aria-label="器形与纹饰">
          <p class="zl-k mono">${esc(a.kicker)} · ${esc(a.open.label)}</p>
          <p class="zl-ghost" aria-hidden="true"><span data-zv-ghost>鼎</span></p>
          <div class="zl-view" data-zv>
            <canvas class="zv-gl" aria-hidden="true" hidden></canvas>
            <canvas class="zv-cv" tabindex="0" role="img" aria-label="可拖动旋转的青铜器三维示意：点器身分段"></canvas>
            <p class="zv-hint mono">拖动旋转 · 点击器身分段</p>
            <div class="zv-fail" hidden></div>
          </div>
          <aside class="zl-panel" aria-label="器形控制">
            <p class="zp-l mono">01 · 器形</p>
            <div class="zp-row" role="group" aria-label="器形">${[['ding', '鼎'], ['zun', '尊'], ['zhong', '钟']].map(([id, n], j) => `<button type="button" data-zv-form="${id}" aria-pressed="${j === 0}">${n}</button>`).join('')}</div>
            <p class="zp-l mono">02 · 图层</p>
            <div class="zp-row" role="group" aria-label="图层">${[['body', '器'], ['ornament', '纹'], ['spirit', '意']].map(([id, n], j) => `<button type="button" data-zv-layer="${id}" aria-pressed="${j === 0}">${n}</button>`).join('')}<button type="button" class="zp-spin" data-zv-spin aria-pressed="true">自转</button></div>
            <div class="zp-info" aria-live="polite"><h3 data-zv-h></h3><p class="zp-body mono" data-zv-b></p><p data-zv-d></p></div>
            <div class="zp-zones" role="group" aria-label="分段" data-zv-zones></div>
            <div class="zp-sec" data-zv-sec></div>
          </aside>
          <h2>${md(a.title)}</h2>
          <p class="zl-lead">${md(a.lead)}</p>
          <p class="zl-cap mono">${esc(a.open.cap)}</p>
        </header>
        <section class="z-rules" aria-label="${esc(u.o(0).sub)}">
          <h3 class="zx-h">${esc(u.o(0).sub)}</h3>
          <div class="zr-a">${u.b(1)}</div>
          <ol class="zr-b">${pr.map(([h, t], j) => `<li><i class="mono">0${j + 1}</i><b>${esc(h)}</b><p>${esc(t)}</p></li>`).join('')}</ol>
        </section>
        <section class="z-owl" aria-label="${esc(u.o(3).sub)}">
          <h3 class="zx-h">${esc(u.o(3).sub)}</h3>
          <div class="zo-stage" style="--s:${scale}px">
            <ol class="zo-ruler" aria-hidden="true">${[300, 200, 100, 0].map(c => `<li style="bottom:${c * scale}px"><span class="mono">${c ? c / 100 + ' m' : '0'}</span></li>`).join('')}</ol>
            ${fm.map(([n, cm, lab, d], j) => { const h = Math.max(14, cm * scale), human = j === 3; return `<figure class="zo-f${human ? ' human' : ''}"><div class="zo-fig" style="height:${h}px">${human
              ? `<svg viewBox="0 0 60 130" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><circle cx="30" cy="11" r="9"/><path d="M14 26 Q30 20 46 26 L50 78 L40 78 L38 128 L31 128 L30 86 L29 128 L22 128 L20 78 L10 78 Z"/></svg>`
              : `<svg viewBox="0 0 100 130" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><path d="${owl[0]}" fill-rule="nonzero"/><circle class="eye" cx="34" cy="56" r="13"/><circle class="eye" cx="66" cy="56" r="13"/><circle class="pup" cx="34" cy="56" r="5"/><circle class="pup" cx="66" cy="56" r="5"/><path class="beak" d="M50 64 L44 78 L56 78 Z"/><path class="fea" d="M24 92 Q34 86 44 92 M56 92 Q66 86 76 92 M28 106 Q38 100 48 106 M52 106 Q62 100 72 106"/></svg>`}</div>
              <figcaption><b>${esc(n)}</b><span class="mono">${esc(lab)}</span><em>${esc(d)}</em></figcaption></figure>`; }).join('')}
          </div>
          <p class="zo-note mono">身高按真实尺寸等比例绘制，8 cm 太小，按 14 px 画；轮廓是示意，不是设定稿。</p>
          <ul class="zo-art">${art.map(f => `<li><figure><img src="${src(f[4])}" alt="${esc(f[0])}设定图" loading="lazy"><figcaption><b>${esc(f[0])}</b><span class="mono">${esc(f[2])}</span></figcaption></figure></li>`).join('')}</ul>
        </section>
        <section class="z-relics" aria-label="${esc(u.o(5).sub)}" data-relics>
          <h3 class="zx-h">${esc(u.o(5).sub)}</h3>
          <div class="zre-list" role="tablist" aria-label="文物">${rows.map((r, j) => `<button type="button" role="tab" aria-selected="${j === 0}" data-i="${j}"><i class="mono">0${j + 1}</i><b>${esc(r[0])}</b><span>${esc(r[2].split(' · ')[0])}</span></button>`).join('')}</div>
          ${rows.map((r, j) => `<article class="zre-card" role="tabpanel"${j ? ' hidden' : ''} data-i="${j}">
            <p class="zre-g" aria-hidden="true">${glyph[j] || ''}</p>
            ${stills[r[4]] ? `<figure class="zre-img"><img src="${src(stills[r[4]])}" alt="${esc(r[0])}在成片里的画面" loading="lazy"><figcaption class="mono">${esc(r[4])} · 成片画面</figcaption></figure>` : `<p class="zre-none mono">成片里没有单独的出场画面</p>`}
            <dl><div><dt>真实用途</dt><dd>${esc(r[1])}</dd></div><div><dt>战斗领域</dt><dd>${esc(r[2])}</dd></div><div><dt>怎样解开</dt><dd>${esc(r[3])}</dd></div></dl>
          </article>`).join('')}
        </section>
        ${u.b(7)}${u.rest()}`;
    },

    /* ---------- R459 ---------- */
    a_direction(a, k, u) {
      const { esc, md, src } = k;
      const st = u.o(1).styles || [], g = u.o(5).gallery || [];
      return `<header class="z-ware">
          <h2 class="zw-h"><span>${md(a.title.split('\n')[0] || '')}</span><span>${md(a.title.split('\n')[1] || '')}</span></h2>
          <p class="zw-n" aria-hidden="true">10</p>
          <div class="zw-t"><p class="zw-lead">${md(a.lead)}</p><p class="zw-k mono">${esc(a.kicker)}</p></div>
          <ol class="zw-list" aria-label="${esc(u.o(0).sub)}">${st.map(([no, ep, name, ref, img, d]) => `<li><figure><img src="${src(img)}" alt="第 ${Number(no)} 集《${esc(ep)}》${esc(name)}" loading="lazy"><i class="zw-no mono">${no}</i></figure>
            <h3 class="zw-v">${vt(esc(name))}</h3>
            <p class="zw-e mono">EP.${no} 《${esc(ep)}》</p><p class="zw-r">${esc(ref)}</p><p class="zw-d">${esc(d)}</p></li>`).join('')}</ol>
          <div class="zw-note">${u.b(2)}</div>
        </header>
        <section class="z-fold" aria-label="${esc(u.o(3).sub)}">
          <div class="zf2-t"><p class="mono zf2-k">${esc(u.o(3).en)}</p><h3>${esc(u.o(3).sub)}</h3>${u.b(4)}</div>
          <ul class="zf2-g">${g.map(([n, c]) => `<li><figure><img src="${src(n)}" alt="${esc(c)}" loading="lazy"><figcaption class="mono">${esc(c)}</figcaption></figure></li>`).join('')}</ul>
        </section>
        ${u.rest()}`;
    },

    /* ---------- production ---------- */
    a_production(a, k, u) {
      const { esc, md } = k;
      const pain = u.o(2).list || [];
      return `<header class="z-strip">
          <ol class="zs-row" aria-hidden="true">${EP.map((t, i) => `<li><img src="assets/bronze-ep${p2(i + 1)}-3.webp" alt="" loading="lazy"><b>${p2(i + 1)}</b></li>`).join('')}</ol>
          <p class="zs-num" aria-hidden="true">${esc(a.open.num)}<small>${esc(a.open.unit)}</small></p>
          <div class="zs-copy"><h2>${md(a.title)}</h2><p>${md(a.lead)}</p><small class="mono">${esc(a.open.label)}</small></div>
        </header>
        <section class="z-pipe" aria-label="制作流程">${u.b(0)}</section>
        <section class="z-four" aria-label="${esc(u.o(1).sub)}">
          <h3 class="zx-h">${esc(u.o(1).sub)}</h3>
          <ol class="z4-list">${pain.map(([h, t], j) => { const [q, s] = t.split('｜'); return `<li><i class="mono">0${j + 1}</i><h4>${esc(h)}</h4><p class="z4-q"><b class="mono">PROBLEM</b>${esc(q)}</p><p class="z4-s"><b class="mono">FIX</b>${esc(s || '')}</p></li>`; }).join('')}</ol>
          ${u.b(3)}
        </section>`;
    },

    /* ---------- reception ---------- */
    a_reception(a, k, u) {
      const { esc, md } = k;
      const st = u.o(0).stats || [], plat = u.o(15).list || [];
      const figs = [['13,878', '播放'], ['9,093', '播放'], ['3,004', '第 10 集曝光']];
      const dy = 13878, bl = 9093;
      return `<header class="z-data">
          <p class="zd-k mono">${esc(a.kicker)}</p>
          <p class="zd-num" aria-label="${esc(a.open.num)} 次播放">${esc(a.open.num)}<small>${esc(a.open.unit)}</small></p>
          <div class="zd-split" role="img" aria-label="抖音 13,878，B 站 9,093"><i class="dy" style="flex:${dy}"><b>抖音</b><span>13,878</span></i><i class="bl" style="flex:${bl}"><b>B 站</b><span>9,093</span></i></div>
          <div class="zd-copy"><h2>${md(a.title)}</h2><p>${md(a.lead)}</p></div>
        </header>
        <section class="z-facts" aria-label="成片规格"><ul>${st.map(([v, l]) => `<li><b>${esc(v)}</b><span>${esc(l)}</span></li>`).join('')}</ul></section>
        <section class="z-metrics">
          <div class="zm-blk"><p class="zx-eyebrow mono">${esc(u.o(1).en)}</p><h3 class="zx-h">${esc(u.o(1).sub)}</h3>${u.b(2)}</div>
          <div class="zm-blk"><p class="zx-eyebrow mono">${esc(u.o(3).en)}</p><h3 class="zx-h">${esc(u.o(3).sub)}</h3>${u.b(4)}</div>
          <div class="zm-blk"><p class="zx-eyebrow mono">${esc(u.o(5).en)}</p><h3 class="zx-h">${esc(u.o(5).sub)}</h3>${u.b(6)}</div>
        </section>
        <section class="z-drop" aria-label="${esc(u.o(7).sub)}">
          <div class="zdr-h"><p class="zx-eyebrow mono">${esc(u.o(7).en)}</p><h3 class="zx-h">${esc(u.o(7).sub)}</h3><div class="zdr-t">${u.b(8)}</div></div>
          <div class="zdr-a">${u.b(9)}</div><div class="zdr-b">${u.b(10)}</div>
          <div class="zdr-c"><p class="zx-eyebrow mono">${esc(u.o(11).en)}</p><h3 class="zx-h">${esc(u.o(11).sub)}</h3>${u.b(12)}</div>
          <div class="zdr-d"><p class="zx-eyebrow mono">${esc(u.o(13).en)}</p><h3 class="zx-h">${esc(u.o(13).sub)}</h3>${u.b(14)}</div>
        </section>
        <section class="z-plat" aria-label="三个平台">
          <ol>${plat.map(([h, t], j) => `<li><p class="zpl-f mono">${esc(figs[j][1])}</p><b class="zpl-n">${esc(figs[j][0])}</b><h4>${esc(h)}</h4><p>${esc(t)}</p></li>`).join('')}</ol>
          ${u.b(16)}
        </section>`;
    },

    after(root) {
      if (root._bzBound) return; root._bzBound = 1;
      // catalogue cells, chapter cards, chart rows: all jump the player to that episode
      root.addEventListener('click', e => {
        const a = e.target.closest('.zc-grid [data-ep],.zch-list [data-ep]');
        if (a) { e.preventDefault(); playEp(root, Number(a.dataset.ep)); return; }
        const row = e.target.closest('[data-bronze-ep]');
        if (row) { playEp(root, Number(row.dataset.bronzeEp)); return; }
        const side = e.target.closest('.zb-side');
        if (side) {
          const bal = side.closest('[data-balance]');
          bal.querySelectorAll('.zb-side').forEach(s => { const on = s === side; s.classList.toggle('on', on); s.setAttribute('aria-pressed', on); });
          bal.querySelectorAll('.zb-pane').forEach(p => { const on = p.dataset.side === side.dataset.side; p.hidden = !on; p.classList.toggle('on', on); });
          return;
        }
        const tab = e.target.closest('[data-relics] .zre-list button');
        if (tab) selectRelic(tab.closest('[data-relics]'), Number(tab.dataset.i));
      });
      root.addEventListener('keydown', e => {
        const el = e.target.closest('[data-bronze-ep]');
        if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); playEp(root, Number(el.dataset.bronzeEp)); return; }
        const tab = e.target.closest('[data-relics] .zre-list button');
        if (tab && (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowLeft')) {
          const bs = [...tab.parentElement.children], i = bs.indexOf(tab), j = (i + (/Down|Right/.test(e.key) ? 1 : bs.length - 1)) % bs.length;
          e.preventDefault(); bs[j].focus(); selectRelic(tab.closest('[data-relics]'), j);
        }
      });
      root.querySelectorAll('[data-zv]').forEach(mountVessel);
    }
  };
  const selectRelic = (sec, i) => {
    sec.querySelectorAll('.zre-list button').forEach((b, j) => b.setAttribute('aria-selected', j === i));
    sec.querySelectorAll('.zre-card').forEach((c, j) => { c.hidden = j !== i; });
  };

  /* =========================================================================================================
     CHARTS (registered on VZ.T; spec is JSON, W is the container width)
     ========================================================================================================= */
  const T = window.VZ && window.VZ.T;
  const wrapTxt = (str, em) => { // wrap by visual width (CJK = 1, latin = .56)
    const out = []; let cur = '', w = 0;
    for (const ch of String(str)) { const cw = /[⺀-鿿＀-￯“”‘’、，。：；！？（）《》·—]/.test(ch) ? 1 : .56; if (w + cw > em && cur) { out.push(cur); cur = ''; w = 0; } cur += ch; w += cw; }
    if (cur) out.push(cur); return out;
  };
  const txt = (x, y, lines, o = {}) => `<text x="${x}" y="${y}"${o.cls ? ` class="${o.cls}"` : ''} font-size="${o.fs || 13}"${o.fw ? ` font-weight="${o.fw}"` : ''}${o.fill ? ` fill="${o.fill}"` : ''}${o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${[].concat(lines).map((l, i) => `<tspan x="${x}" dy="${i ? (o.lh || o.fs * 1.5 || 20) : 0}">${E(l)}</tspan>`).join('')}</text>`;

  if (T) {
    /* ---- full production chain: four layers, ten steps, two return loops ---- */
    T['bronze-chain'] = (s, W) => {
      const narrow = W < 900, L = s.layers, pad = narrow ? 4 : 6, gap = narrow ? 0 : 38, colW = narrow ? W - 2 * pad : (W - 2 * pad - gap * (L.length - 1)) / L.length;
      const fs = narrow ? 13 : 13, em = (colW - 28) / fs, lc = [COL.ink, COL.red, COL.verd, '#9a6b2c'];
      const nodeH = n => { const lines = n.t.reduce((a, t) => a + wrapTxt('· ' + t, em).length, 0); return 18 + 26 + 18 + lines * 19 + 10; };
      let g = '', maxB = 0; const colInfo = [];
      L.forEach((ly, li) => {
        const x = narrow ? pad : pad + li * (colW + gap); let y = narrow ? (colInfo.length ? colInfo[colInfo.length - 1].end + 26 : 8) : 8;
        const col = lc[li % 4], top = y;
        g += `<g class="bz-lh"><rect x="${x}" y="${y}" width="${colW}" height="56" fill="${col}"/><path d="M${x + 8} ${y + 22}V${y + 8}H${x + 22}" stroke="${COL.gold}" fill="none" stroke-width="1.5"/>${txt(x + 18, y + 40, ly.h, { fs: 24, fill: '#f8efe0', cls: 'bz-d' })}${txt(x + colW - 12, y + 22, `0${li + 1}`, { fs: 13, fill: COL.gold, anchor: 'end', cls: 't-m' })}${txt(x + colW - 12, y + 42, ly.en, { fs: 10, fill: '#e7d3a6', anchor: 'end', cls: 't-m', ls: 1.5 })}</g>`;
        y += 56 + 16; const nodes = [];
        ly.nodes.forEach((n, ni) => {
          const h = nodeH(n); nodes.push([x, y, h]);
          const tipb = `${n.tool} · ${n.t.join('；')}`;
          g += `<g class="hit bz-n"${tipA(n.h, tipb)}><rect x="${x}" y="${y}" width="${colW}" height="${h}" fill="${COL.sheet}" stroke="${COL.ink}" stroke-opacity=".55"/><rect x="${x}" y="${y}" width="${colW}" height="4" fill="${col}"/>
            ${txt(x + 14, y + 29, `${p2(L.slice(0, li).reduce((a, q) => a + q.nodes.length, 0) + ni + 1)}`, { fs: 11, fill: col, cls: 't-m' })}${txt(x + 40, y + 30, n.h, { fs: 17, fw: 700, cls: 'bz-h' })}
            ${txt(x + 14, y + 52, n.tool, { fs: 10.5, fill: '#8a6a2c', cls: 't-m' })}
            ${n.t.reduce((acc, t) => { const ls = wrapTxt('· ' + t, em); const out = acc.html + txt(x + 14, y + 76 + acc.n * 19, ls, { fs, lh: 19 }); return { html: out, n: acc.n + ls.length }; }, { html: '', n: 0 }).html}</g>`;
          y += h;
          if (ni < ly.nodes.length - 1) { g += `<path d="M${x + colW / 2} ${y + 1}v12m-5-5l5 6 5-6" stroke="${COL.ink}" fill="none" stroke-width="1.4"/>`; y += 14; }
        });
        colInfo.push({ x, top, end: y, nodes, col }); maxB = Math.max(maxB, y);
        if (narrow && li < L.length - 1) g += `<path d="M${W / 2} ${y + 2}v18m-6-7l6 7 6-7" stroke="${COL.gold}" fill="none" stroke-width="2"/>`;
      });
      if (!narrow) L.slice(0, -1).forEach((ly, li) => { const x = colInfo[li].x + colW, y = 8 + 28; g += `<path d="M${x + 3} ${y}H${x + gap - 6}m-6 -6l6 6-6 6" stroke="${COL.gold}" stroke-width="2.2" fill="none"/>`; });
      // return loops
      const idx = id => L.findIndex(l => l.id === id);
      let H;
      if (!narrow) {
        s.back.forEach(([f, t, label], i) => {
          const a = colInfo[idx(f)], b = colInfo[idx(t)], y = maxB + 34 + i * 54, x1 = a.x + colW * (.35 + .1 * i), x2 = b.x + colW * (.35 + .22 * i);
          g += `<path d="M${x1} ${a.end + 2}V${y}H${x2}V${b.end + 6}" fill="none" stroke="${COL.red}" stroke-width="1.8" stroke-dasharray="6 5"/><path d="M${x2 - 6} ${b.end + 14}l6-9 6 9" fill="none" stroke="${COL.red}" stroke-width="1.8"/>`;
          g += `<rect x="${(x1 + x2) / 2 - 8}" y="${y - 11}" width="${wrapTxt(label, 99)[0].length * 13 + 22}" height="22" fill="${COL.paper}"/>${txt((x1 + x2) / 2 + 3, y + 5, label, { fs: 13, fill: COL.red, fw: 700 })}`;
        });
        H = maxB + 34 + s.back.length * 54 + 4;
      } else {
        let y = maxB + 26;
        s.back.forEach(([f, t, label]) => { const ls = wrapTxt(label, (W - 52) / 13); g += `<path d="M10 ${y - 6}v${ls.length * 20 + 6}" stroke="${COL.red}" stroke-width="2" stroke-dasharray="5 4"/>${txt(24, y + 8, ls, { fs: 13, fill: COL.red, fw: 700, lh: 20 })}<text x="24" y="${y + 8 + ls.length * 20}" font-size="10.5" class="t-m" fill="${COL.red}">↶ ${E(L[idx(f)].h)} → ${E(L[idx(t)].h)}</text>`; y += ls.length * 20 + 40; });
        H = y;
      }
      return { H, g };
    };

    /* ---- plays per episode, Bilibili on the left, Douyin on the right, one scale ---- */
    T['bronze-reach'] = (s, W) => {
      const narrow = W < 560, cw = narrow ? 84 : 132, numW = narrow ? 42 : 56, mid = W / 2, bw = W / 2 - cw / 2 - numW, max = 4000, rh = narrow ? 40 : 46, top = 34;
      let g = `<text x="${mid - cw / 2 - 6}" y="16" text-anchor="end" font-size="12" fill="${COL.verd}" font-weight="700">B 站 BILIBILI</text><text x="${mid + cw / 2 + 6}" y="16" font-size="12" fill="${COL.red}" font-weight="700">抖音 DOUYIN</text>`;
      [1000, 2000, 3000, 4000].forEach(v => { const dx = v / max * bw; g += `<line x1="${mid - cw / 2 - dx}" x2="${mid - cw / 2 - dx}" y1="${top - 6}" y2="${top + s.eps.length * rh}" class="gr"/><line x1="${mid + cw / 2 + dx}" x2="${mid + cw / 2 + dx}" y1="${top - 6}" y2="${top + s.eps.length * rh}" class="gr"/>`; if (!narrow || v % 2000 === 0) g += `<text x="${mid + cw / 2 + dx}" y="${top + s.eps.length * rh + 14}" text-anchor="middle" font-size="10" class="t-m" opacity=".6">${v / 1000}k</text>`; });
      s.eps.forEach((ep, i) => {
        const y = top + i * rh, lv = s.bl.plays[i], rv = s.dy.plays[i], lw = lv / max * bw, rw = rv / max * bw, c = PHC[PH[i]];
        g += `<g class="hit" data-bronze-ep="${i}" role="button" tabindex="0" aria-label="播放第 ${i + 1} 集《${E(ep)}》"${tipA(`EP.${p2(i + 1)} 《${ep}》`, `B 站 ${lv.toLocaleString()} · 抖音 ${rv.toLocaleString()} 次播放`).replace(' tabindex="0"', '')}>
          <rect x="0" y="${y - 3}" width="${W}" height="${rh - 2}" fill="${PH[i] === 1 ? 'rgba(192,57,43,.07)' : 'transparent'}"/>
          <rect x="${mid - cw / 2 - lw}" y="${y + 4}" width="${lw}" height="${rh - 14}" fill="${COL.verd}" class="grow" style="transform-origin:right center;transition-delay:${i * .04}s"/>
          <rect x="${mid + cw / 2}" y="${y + 4}" width="${rw}" height="${rh - 14}" fill="${COL.red}" class="grow" style="transition-delay:${i * .04}s"/>
          <text x="${mid - cw / 2 - lw - 5}" y="${y + rh / 2 + 3}" text-anchor="end" font-size="11.5" class="t-m">${lv.toLocaleString()}</text>
          <text x="${mid + cw / 2 + rw + 5}" y="${y + rh / 2 + 3}" font-size="11.5" class="t-m">${rv.toLocaleString()}</text>
          <rect x="${mid - cw / 2 + 3}" y="${y + 4}" width="${cw - 6}" height="${rh - 14}" fill="${c}"/>
          <text x="${mid}" y="${y + rh / 2 + 3}" text-anchor="middle" font-size="${narrow ? 12 : 13.5}" fill="#f8efe0" class="bz-h">${p2(i + 1)} ${E(ep)}</text></g>`;
      });
      const ly = top + s.eps.length * rh + 34;
      g += [['铺陈 EP.01—05', COL.ink], ['断裂 EP.06', COL.red], ['收拢 EP.07—10', COL.verd]].map(([t, c], i) => `<rect x="${(narrow ? 0 : mid - 190) + i * (narrow ? 118 : 130)}" y="${ly - 9}" width="12" height="12" fill="${c}"/><text x="${(narrow ? 0 : mid - 190) + i * (narrow ? 118 : 130) + 17}" y="${ly + 1}" font-size="11">${t}</text>`).join('');
      return { H: ly + 12, g };
    };

    /* ---- likes per 100 plays, dumbbell ---- */
    T['bronze-like'] = (s, W) => {
      const narrow = W < 560, left = narrow ? 70 : 108, right = narrow ? 8 : 150, pw = W - left - right, rh = narrow ? 40 : 44, max = 15, top = 28;
      let g = [0, 5, 10, 15].map(v => `<line x1="${left + v / max * pw}" x2="${left + v / max * pw}" y1="${top - 8}" y2="${top + s.eps.length * rh}" class="gr"/><text x="${left + v / max * pw}" y="${top - 12}" text-anchor="middle" font-size="10" class="t-m" opacity=".6">${v}</text>`).join('');
      s.eps.forEach((ep, i) => {
        const y = top + i * rh + rh / 2, b = s.bl.likes[i] / s.bl.plays[i] * 100, d = s.dy.likes[i] / s.dy.plays[i] * 100, xb = left + b / max * pw, xd = left + d / max * pw;
        g += `<g class="hit" data-bronze-ep="${i}" role="button" tabindex="0" aria-label="播放第 ${i + 1} 集《${E(ep)}》"${tipA(`EP.${p2(i + 1)} 《${ep}》`, `B 站 ${b.toFixed(1)} · 抖音 ${d.toFixed(1)}（每 100 次播放的点赞）`).replace(' tabindex="0"', '')}>
          <rect x="0" y="${y - rh / 2}" width="${W}" height="${rh}" fill="transparent"/>
          <text x="2" y="${y + 4}" font-size="${narrow ? 12 : 13.5}" class="bz-h" fill="${PHC[PH[i]]}">${p2(i + 1)} ${E(ep)}</text>
          <line x1="${Math.min(xb, xd)}" x2="${Math.max(xb, xd)}" y1="${y}" y2="${y}" stroke="${COL.ink}" stroke-width="2" opacity=".35"/>
          <circle cx="${xb}" cy="${y}" r="6.5" fill="${COL.verd}"/><rect x="${xd - 6}" y="${y - 6}" width="12" height="12" fill="${COL.red}"/>
          ${narrow ? '' : `<text x="${left + max / max * pw + 14}" y="${y + 4}" font-size="11.5" class="t-m"><tspan fill="${COL.verd}">${b.toFixed(1)}</tspan> / <tspan fill="${COL.red}">${d.toFixed(1)}</tspan></text>`}</g>`;
      });
      const ly = top + s.eps.length * rh + 22;
      g += `<circle cx="8" cy="${ly - 4}" r="6" fill="${COL.verd}"/><text x="20" y="${ly}" font-size="11.5">B 站</text><rect x="${narrow ? 66 : 70}" y="${ly - 10}" width="12" height="12" fill="${COL.red}"/><text x="${narrow ? 84 : 88}" y="${ly}" font-size="11.5">抖音</text><text x="${narrow ? 128 : 130}" y="${ly}" font-size="11" class="t-m" opacity=".7">点赞数 / 播放量 × 100</text>`;
      return { H: ly + 12, g };
    };

    /* ---- who leaves in the first seconds: one panel per platform (the two bounce definitions differ), ten columns, three phases ---- */
    T['bronze-drop'] = (s, W) => {
      const narrow = W < 560, padL = narrow ? 30 : 40, top = 52, ph = narrow ? 200 : 240, n = s.v.length, cw = (W - padL - 4) / n, bw = Math.min(cw - (narrow ? 5 : 12), 52);
      const ord = s.v.map((v, i) => [v, i]).sort((x, y) => y[0] - x[0]), worst = new Set(ord.slice(0, 2).map(q => q[1])), best = new Set(ord.slice(-2).map(q => q[1]));
      let g = '<defs>' + PHC.map((c, k) => `<pattern id="bzdh${k}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="5" fill="${c}" fill-opacity=".1"/><path d="M0 0V5" stroke="${c}" stroke-opacity=".55" stroke-width="1.2"/></pattern>`).join('') + '</defs>';
      [[0, 4, narrow ? '铺陈' : '铺陈 EP.01—05', 0], [5, 5, '断裂', 1], [6, 9, narrow ? '收拢' : '收拢 EP.07—10', 2]].forEach(([a0, a1, t, k]) => {
        const x1 = padL + a0 * cw + 3, x2 = padL + (a1 + 1) * cw - 3;
        g += `<path d="M${x1} 26V16H${x2}V26" fill="none" stroke="${PHC[k]}" stroke-width="2"/><text x="${(x1 + x2) / 2}" y="10" text-anchor="middle" font-size="12" font-weight="700" fill="${PHC[k]}" class="bz-h">${t}</text>`;
      });
      [0, 50, 100].forEach(v => { const y = top + ph - v / 100 * ph; g += `<line x1="${padL}" x2="${W}" y1="${y}" y2="${y}" class="gr"${v === 50 ? ' stroke-dasharray="5 4"' : ''}/><text x="${padL - 6}" y="${y + 3}" text-anchor="end" font-size="9.5" class="t-m" opacity=".6">${v}</text>`; });
      g += `<text x="${padL - 6}" y="${top - 16}" text-anchor="end" font-size="9" class="t-m" opacity=".6">%</text>`;
      s.v.forEach((v, i) => {
        const x = padL + i * cw + (cw - bw) / 2, hb = v / 100 * ph, c = PHC[PH[i]], w = worst.has(i), bt = best.has(i), y1 = top + ph + 18;
        g += `<g class="hit"${tipA('EP.' + p2(i + 1) + ' 《' + s.eps[i] + '》', s.name + ' ' + v + '% · 看下去的 ' + (100 - v).toFixed(1) + '%')}>`
          + `<rect x="${x - 3}" y="${top - 22}" width="${bw + 6}" height="${ph + 84}" fill="transparent"/>`
          + `<rect x="${x}" y="${top + hb}" width="${bw}" height="${ph - hb}" fill="${c}" fill-opacity="${bt ? 1 : .86}" class="growy" style="transition-delay:${i * .04}s"/>`
          + `<rect x="${x}" y="${top}" width="${bw}" height="${hb}" fill="url(#bzdh${PH[i]})" stroke="${w ? COL.red : c}" stroke-width="${w ? 2.4 : 1}"/>`
          + `<text x="${x + bw / 2}" y="${top - 6}" text-anchor="middle" font-size="${narrow ? 10 : 12}" font-weight="${w || bt ? 700 : 400}" fill="${w ? COL.red : bt ? '#8a6a2c' : COL.ink}" class="t-m">${v.toFixed(1)}</text>`
          + `<text x="${x + bw / 2}" y="${y1}" text-anchor="middle" font-size="${narrow ? 11.5 : 13.5}" class="bz-h" fill="${c}">${E(s.eps[i])}</text><text x="${x + bw / 2}" y="${y1 + 14}" text-anchor="middle" font-size="9.5" class="t-m" opacity=".6">${p2(i + 1)}</text>`
          + (w ? `<text x="${x + bw / 2}" y="${y1 + 32}" text-anchor="middle" font-size="11" font-weight="700" fill="${COL.red}" class="bz-h">▲${narrow ? '' : '最重'}</text>` : '')
          + (bt ? `<text x="${x + bw / 2}" y="${y1 + 32}" text-anchor="middle" font-size="11" font-weight="700" fill="#8a6a2c" class="bz-h">▼${narrow ? '' : '最稳'}</text>` : '') + '</g>';
      });
      const ly = top + ph + 66;
      g += `<rect x="${padL}" y="${ly - 9}" width="12" height="12" fill="url(#bzdh0)" stroke="${COL.ink}"/><text x="${padL + 18}" y="${ly + 1}" font-size="11">划走的人（${s.name}）</text><rect x="${padL + (narrow ? 150 : 190)}" y="${ly - 9}" width="12" height="12" fill="${COL.ink}" fill-opacity=".86"/><text x="${padL + (narrow ? 168 : 208)}" y="${ly + 1}" font-size="11">看下去的人</text>`;
      return { H: ly + 10, g };
    };

    /* ---- Bilibili: how far the average viewer gets, as a progress bar against the running time ---- */
    T['bronze-prog'] = (s, W) => {
      const narrow = W < 560, lw = narrow ? 64 : 100, rw = narrow ? 0 : 190, tw = W - lw - rw - 6, rh = narrow ? 44 : 38, top = 28, mm = v => p2(Math.floor(v / 60)) + ':' + p2(Math.round(v % 60));
      const mx = Math.max(...s.prog), mn = Math.min(...s.prog);
      let g = `<line x1="${lw + tw / 2}" x2="${lw + tw / 2}" y1="${top - 10}" y2="${top + s.eps.length * rh}" stroke="${COL.red}" stroke-dasharray="5 4" stroke-width="1.2"/><text x="${lw + tw / 2}" y="${top - 14}" text-anchor="middle" font-size="10.5" fill="${COL.red}" class="bz-h">看到一半</text><text x="${lw}" y="${top - 14}" text-anchor="middle" font-size="9.5" class="t-m" opacity=".6">0</text><text x="${lw + tw}" y="${top - 14}" text-anchor="middle" font-size="9.5" class="t-m" opacity=".6">片尾</text>`;
      s.eps.forEach((ep, i) => {
        const y = top + i * rh, c = PHC[PH[i]], w = s.prog[i] / 100 * tw, sec = s.d[i] * s.prog[i] / 100, hi = s.prog[i] === mx, lo = s.prog[i] === mn;
        g += `<g class="hit"${tipA('EP.' + p2(i + 1) + ' 《' + ep + '》', '平均看到 ' + s.prog[i] + '%，约 ' + mm(sec) + ' / 全长 ' + mm(s.d[i]))}>`
          + `<rect x="0" y="${y - 2}" width="${W}" height="${rh - 2}" fill="transparent"/>`
          + `<text x="2" y="${y + 14}" font-size="${narrow ? 12 : 13.5}" class="bz-h" fill="${c}">${p2(i + 1)} ${E(ep)}</text>`
          + `<rect x="${lw}" y="${y + 3}" width="${tw}" height="14" fill="${c}" fill-opacity=".1" stroke="${c}" stroke-opacity=".4"/>`
          + `<rect x="${lw}" y="${y + 3}" width="${w}" height="14" fill="${c}" class="grow" style="transform-origin:left center;transition-delay:${i * .04}s"/>`
          + `<path d="M${lw + w} ${y - 1}v22" stroke="${COL.gold}" stroke-width="2.4"/>`
          + (narrow ? `<text x="${lw + w + 6}" y="${y + 33}" font-size="10.5" class="t-m">${s.prog[i]}% · ${mm(sec)}</text>` : `<text x="${lw + tw + 14}" y="${y + 15}" font-size="11.5" class="t-m"${hi || lo ? ' font-weight="700"' : ''}>${s.prog[i]}% · ${mm(sec)} / ${mm(s.d[i])}${hi ? '  最高' : lo ? '  最低' : ''}</text>`) + '</g>';
      });
      return { H: top + s.eps.length * rh + 6, g };
    };

    /* ---- RedNote: two notes, three steps each, normalised to each note's own exposure ---- */
    T['bronze-rn'] = (s, W) => {
      const two = W >= 640, pw = two ? (W - 30) / 2 : W, ph = 236;
      let g = '';
      s.notes.forEach((nt, k) => {
        const x0 = two ? k * (pw + 30) : 0, y0 = two ? 0 : k * (ph + 24), c = nt.c, bx = x0 + 70, bwid = pw - 70 - 10;
        g += `<g><rect x="${x0}" y="${y0}" width="${pw}" height="${ph}" fill="${COL.sheet}" stroke="${COL.ink}" stroke-opacity=".5"/><rect x="${x0}" y="${y0}" width="${pw}" height="5" fill="${c}"/>`
          + `<text x="${x0 + 14}" y="${y0 + 36}" font-size="20" class="bz-d">${E(nt.h)}</text><text x="${x0 + pw - 12}" y="${y0 + 34}" text-anchor="end" font-size="11" fill="${c}" class="t-m">${E(nt.tag)}</text>`;
        [['曝光', nt.exp], ['观看', nt.view], ['互动', nt.act]].forEach(([l, v, r], ri) => {
          const y = y0 + 58 + ri * 36, w = Math.max(3, v / nt.exp * bwid), inside = w > 230;
          g += `<text x="${x0 + 14}" y="${y + 16}" font-size="13" class="bz-h">${l}</text><rect x="${bx}" y="${y}" width="${bwid}" height="22" fill="${c}" fill-opacity=".08"/><rect x="${bx}" y="${y}" width="${w}" height="22" fill="${c}" fill-opacity="${.95 - ri * .22}" class="grow" style="transform-origin:left center"/>`
            + `<text x="${inside ? bx + w - 8 : bx + w + 8}" y="${y + 16}" ${inside ? 'text-anchor="end" fill="#fff"' : ''} font-size="12" class="t-m">${v.toLocaleString()}${ri === 1 ? ' · 占曝光 ' + (v / nt.exp * 100).toFixed(1) + '%' : ri === 2 ? ' · 占观看 ' + (v / nt.view * 100).toFixed(1) + '%' : ''}</text>`;
        });
        const gy = y0 + 58 + 3 * 36 + 6;
        g += `<text x="${x0 + 14}" y="${gy + 14}" font-size="13" class="bz-h">女性</text><rect x="${bx}" y="${gy}" width="${bwid}" height="18" fill="${COL.ink}" fill-opacity=".1"/><rect x="${bx}" y="${gy}" width="${nt.f / 100 * bwid}" height="18" fill="${COL.red}" fill-opacity=".85"/><text x="${bx + 8}" y="${gy + 13}" font-size="11.5" fill="#fff" class="t-m">${nt.f}%</text>`
          + `<text x="${x0 + 14}" y="${gy + 44}" font-size="12.5" fill="${COL.ink}">平台评价：${E(nt.rate)}${nt.ctr ? '　封面点击率 ' + nt.ctr : ''}</text></g>`;
      });
      return { H: two ? ph : 2 * ph + 24, g };
    };

    /* ---- running time per episode ---- */
    T['bronze-dur'] = (s, W) => {
      const narrow = W < 560, left = 0, n = s.d.length, cw = (W - 8) / n, bw = Math.min(cw - 8, 58), top = 34, ph = narrow ? 190 : 250, max = 240, avg = s.d.reduce((a, b) => a + b, 0) / n;
      const mm = v => `${p2(Math.floor(v / 60))}:${p2(Math.round(v % 60))}`, y = v => top + ph - v / max * ph;
      let g = [60, 120, 180, 240].map(v => `<line x1="0" x2="${W}" y1="${y(v)}" y2="${y(v)}" class="gr"/><text x="0" y="${y(v) - 4}" font-size="10" class="t-m" opacity=".6">${v / 60} min</text>`).join('');
      s.d.forEach((v, i) => {
        const x = 4 + i * cw + (cw - bw) / 2;
        g += `<g class="hit" data-bronze-ep="${i}" role="button" tabindex="0" aria-label="播放第 ${i + 1} 集《${E(s.eps[i])}》"${tipA(`EP.${p2(i + 1)} 《${s.eps[i]}》`, `时长 ${mm(v)}`).replace(' tabindex="0"', '')}><rect x="${x - 2}" y="${top - 14}" width="${bw + 4}" height="${ph + 52}" fill="transparent"/>
          <rect x="${x}" y="${y(v)}" width="${bw}" height="${top + ph - y(v)}" fill="${PHC[PH[i]]}" class="growy" style="transition-delay:${i * .05}s"/>
          <text x="${x + bw / 2}" y="${y(v) - 6}" text-anchor="middle" font-size="${narrow ? 9.5 : 12}" class="t-m">${mm(v)}</text>
          <text x="${x + bw / 2}" y="${top + ph + 18}" text-anchor="middle" font-size="${narrow ? 11 : 13}" class="bz-h">${E(s.eps[i])}</text>
          <text x="${x + bw / 2}" y="${top + ph + 33}" text-anchor="middle" font-size="9.5" class="t-m" opacity=".6">${p2(i + 1)}</text></g>`;
      });
      g += `<line x1="0" x2="${W}" y1="${y(avg)}" y2="${y(avg)}" stroke="${COL.gold}" stroke-width="1.6" stroke-dasharray="6 4"/><text x="${W}" y="${y(avg) - 5}" text-anchor="end" font-size="11" fill="#8a6a2c" class="t-m">平均 ${mm(avg)}</text>`;
      return { H: top + ph + 48, g };
    };
  }

  /* the shared stylesheet sets text fill and font on '.vz text', which beats presentation attributes; turn fill attributes into inline style */
  if (T) ['bronze-chain', 'bronze-reach', 'bronze-like', 'bronze-drop', 'bronze-prog', 'bronze-rn', 'bronze-dur'].forEach(k => {
    const f = T[k]; if (!f) return;
    T[k] = (s, W) => { const r = f(s, W); r.g = r.g.replace(/<(text|tspan)([^>]*?) fill="([^"]+)"/g, '<$1$2 style="fill:$3"'); return r; };
  });

  /* =========================================================================================================
     3D VESSEL — a lathe-turned bronze. three.js 0.160 draws it when the CDN and WebGL are available; if either is missing
     a software renderer on a 2D canvas takes over (same geometry, same controls); if even that fails, the section drawing
     (profile, zone bands, names) fills the stage. Three forms (ding, zun, zhong), three layers (body, ornament, spirit),
     drag to turn, click a band of the body to read what it stands for.
     ========================================================================================================= */
  const FORMS = {
    ding: {
      ghost: '鼎', name: '鼎', tilt: .26,
      parts: [
        { prof: { out: [[0, .6], [.4, .62], [.68, .7], [.86, .86], [.93, 1.06], [.93, 1.28], [.9, 1.46], [.93, 1.52], [.98, 1.54], [.98, 1.6], [.9, 1.6]], inn: [[.86, 1.5], [.84, 1.3], [.78, 1.02], [.55, .78], [0, .72]] }, n: 72 },
        ...[90, 210, 330].map(a => ({ prof: { out: [[0, 0], [.11, 0], [.12, .08], [.16, .36], [.2, .66], [.2, .74]], inn: [[0, .74]] }, n: 16, at: [Math.cos(a * Math.PI / 180) * .6, 0, Math.sin(a * Math.PI / 180) * .6], tag: 'leg' })),
        ...[-1, 1].map(sd => ({ ring: { R: .2, m: .045 }, n: 20, at: [sd * .93, 1.74, 0], rotX: 90, tag: 'ear' }))
      ],
      zones: [
        { n: '足', a: 0, b: .3, body: '下肢与站姿', d: '三足决定器灵怎么站：重心低，落地稳，站姿最先被看见。' },
        { n: '腹', a: .3, b: .78, body: '躯干', d: '腹部最大，纹饰最密。饕餮纹在这里当成皮肤上的花纹。' },
        { n: '口沿与耳', a: .78, b: 1, body: '头部与手臂', d: '口沿外撇，两只立耳立在两侧，位置像抬起的手臂。' }
      ],
      pat: [
        { part: 0, t0: .46, t1: .86, kind: 'taotie', k: 3, zone: 1 },
        { part: 0, t0: .9, t1: .98, kind: 'fret', k: 24, zone: 2, tt: 'out' }
      ],
      spirit: { dom: '饕餮吞噬域 · 吸走生命', solve: '把祭品奉进鼎里。', use: '烹煮祭品的礼器，也用于祭祀。' }
    },
    zun: {
      ghost: '尊', name: '尊', tilt: .3,
      parts: [{ prof: { out: [[0, 0], [.52, 0], [.54, .05], [.5, .1], [.5, .2], [.58, .34], [.7, .52], [.74, .66], [.68, .82], [.52, .96], [.42, 1.08], [.4, 1.2], [.46, 1.34], [.62, 1.52], [.8, 1.7], [.9, 1.8], [.92, 1.84], [.86, 1.84]], inn: [[.78, 1.7], [.6, 1.5], [.44, 1.3], [.36, 1.1], [.4, .9], [.5, .66], [.5, .3], [0, .24]] }, n: 80 }],
      zones: [
        { n: '圈足', a: 0, b: .17, body: '下肢与站姿', d: '圈足稳稳托住全身，决定器灵站得多稳。' },
        { n: '腹', a: .17, b: .56, body: '躯干', d: '腹部鼓出，饕餮纹和雷纹带都在这里，是躯干的主视觉。' },
        { n: '颈', a: .56, b: .76, body: '颈与肩', d: '颈部收窄，纹带也窄，连接头部和躯干。' },
        { n: '侈口', a: .76, b: 1, body: '头部', d: '口沿向外张开，像抬起的头和展开的肩。' }
      ],
      pat: [
        { part: 0, t0: .26, t1: .5, kind: 'taotie', k: 4, zone: 1 },
        { part: 0, t0: .54, t1: .62, kind: 'fret', k: 28, zone: 1 },
        { part: 0, t0: .68, t1: .76, kind: 'fret', k: 22, zone: 2 }
      ],
      spirit: { dom: '设定里的通用示例', solve: '具体角色按器灵设定稿。', use: '盛酒的礼器，出现在祭祀和宴飨场合。' }
    },
    zhong: {
      ghost: '钟', name: '钟', tilt: -.1,
      parts: [{ prof: { out: [[.34, 2.1], [.36, 2.1], [.36, 1.96], [.5, 1.9], [.54, 1.7], [.64, 1.4], [.76, 1.0], [.9, .56], [.98, .16], [1.02, .02], [.96, 0]], inn: [[.88, .1], [.8, .5], [.64, 1.0], [.5, 1.5], [.4, 1.84], [.34, 1.9]] }, n: 80 }],
      zones: [
        { n: '于口', a: 0, b: .14, body: '下摆与脚', d: '钟口向两侧撇出，落点最宽，像长衣的下摆。' },
        { n: '鼓', a: .14, b: .48, body: '胸口与发声', d: '正面敲击的位置，对应胸口，也是声音出来的地方。' },
        { n: '篆带与枚', a: .48, b: .86, body: '肩与手臂', d: '枚（乳钉）排成三层，篆带在中间，像铠甲上的甲片。' },
        { n: '钮', a: .86, b: 1, body: '头顶', d: '悬挂用的钮，位置在最上面，对应头顶的冠饰。' }
      ],
      pat: [
        { part: 0, t0: .3, t1: .52, kind: 'boss', k: 4, zone: 2 },
        { part: 0, t0: .56, t1: .62, kind: 'fret', k: 26, zone: 2 },
        { part: 0, t0: .66, t1: .84, kind: 'boss', k: 4, zone: 1 }
      ],
      spirit: { dom: '礼乐律法域 · 音波震退', solve: '吹奏《楚商》，用律吕和鸣破掉压制。', use: '雅乐礼器，成片 EP.04 出场。' }
    }
  };

  function buildForm(F) {
    const quads = [], verts = [], uvs = []; // verts: flat [x,y,z]; quads: {a,b,c,d,zone,hash,part}
    let ymin = 1e9, ymax = -1e9;
    const partsGeo = F.parts.map((P, pi) => {
      const prof = P.ring ? (() => { const arr = []; for (let k = 0; k <= 10; k++) { const ph = (-90 + 360 * k / 10) * Math.PI / 180; arr.push([P.ring.R + P.ring.m * Math.cos(ph), P.ring.m * Math.sin(ph)]); } return arr; })() : P.prof.out.concat(P.prof.inn);
      const N = P.n, base = verts.length / 3, cx = (P.at || [0, 0, 0]), rx = (P.rotX || 0) * Math.PI / 180;
      for (let i = 0; i < prof.length; i++) for (let j = 0; j <= N; j++) {
        const th = j / N * Math.PI * 2, r = prof[i][0]; let x = r * Math.cos(th), y = prof[i][1], z = r * Math.sin(th);
        if (rx) { const y2 = y * Math.cos(rx) - z * Math.sin(rx), z2 = y * Math.sin(rx) + z * Math.cos(rx); y = y2; z = z2; }
        x += cx[0]; y += cx[1]; z += cx[2];
        verts.push(x, y, z); uvs.push(j / N * 3, i / (prof.length - 1) * 2); if (y < ymin) ymin = y; if (y > ymax) ymax = y;
      }
      return { base, N, np: prof.length, prof, P, pi };
    });
    // centre and normalise height to 2
    const sc = 2 / (ymax - ymin), mid = (ymax + ymin) / 2;
    for (let v = 0; v < verts.length; v += 3) { verts[v] *= sc; verts[v + 1] = (verts[v + 1] - mid) * sc; verts[v + 2] *= sc; }
    const yn = y => (y / sc + mid - ymin) / (ymax - ymin) * 1; // original-y → normalised 0..1 (unused helper)
    partsGeo.forEach(G => {
      for (let i = 0; i < G.np - 1; i++) for (let j = 0; j < G.N; j++) {
        const a = G.base + i * (G.N + 1) + j, b = a + 1, d = G.base + (i + 1) * (G.N + 1) + j, c = d + 1;
        const ya = (verts[a * 3 + 1] + verts[d * 3 + 1]) / 2, h01 = (ya + 1) / 2;
        const zone = F.zones.findIndex(z => h01 >= z.a && h01 <= z.b + 1e-6);
        // geometric normal, outward from material
        const ux = verts[d * 3] - verts[a * 3], uy = verts[d * 3 + 1] - verts[a * 3 + 1], uz = verts[d * 3 + 2] - verts[a * 3 + 2];
        const wx = verts[b * 3] - verts[a * 3], wy = verts[b * 3 + 1] - verts[a * 3 + 1], wz = verts[b * 3 + 2] - verts[a * 3 + 2];
        let nx = uy * wz - uz * wy, ny = uz * wx - ux * wz, nz = ux * wy - uy * wx; const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
        const hash = ((i * 73856093) ^ (j * 19349663) ^ (G.pi * 83492791)) >>> 0;
        quads.push({ a, b, c, d, zone: Math.max(0, zone), h: (hash % 1000) / 1000, nx, ny, nz, part: G.pi, tag: G.P.tag || '' });
      }
    });
    // outer-profile lookup for ornament placement: point on outer wall at fraction t (0..1 of the *outer* list)
    const outerPt = (part, t, th) => {
      const G = partsGeo[part], outN = G.P.prof.out.length, f = Math.max(0, Math.min(1, t)) * (outN - 1), i0 = Math.floor(f), i1 = Math.min(outN - 1, i0 + 1), k = f - i0;
      const get = (i, jj) => { const idx = G.base + i * (G.N + 1) + jj; return [verts[idx * 3], verts[idx * 3 + 1], verts[idx * 3 + 2]]; };
      const ang = (th / (Math.PI * 2) % 1 + 1) % 1 * G.N, j0 = Math.floor(ang), jf = ang - j0, j1 = Math.min(G.N, j0 + 1);
      const p00 = get(i0, j0), p01 = get(i0, j1), p10 = get(i1, j0), p11 = get(i1, j1);
      const lerp = (p, q, w) => [p[0] + (q[0] - p[0]) * w, p[1] + (q[1] - p[1]) * w, p[2] + (q[2] - p[2]) * w];
      const A = lerp(p00, p01, jf), B = lerp(p10, p11, jf), P = lerp(A, B, k);
      // push out along the radial direction a hair to sit on top of the shell
      const r = Math.hypot(P[0], P[2]) || 1; return [P[0] * (1 + .006 / r), P[1], P[2] * (1 + .006 / r)];
    };
    // ornament polylines in 3D, each with the radial normal angle
    const lines = [];
    const addCell = (pat, c0, polys) => polys.forEach(pl => lines.push({ pts: pl.map(([u, v]) => outerPt(pat.part, pat.t0 + v * (pat.t1 - pat.t0), c0 + u * (Math.PI * 2 / pat.k))), zone: pat.zone, kind: pat.kind }));
    (F.pat || []).forEach(pat => {
      for (let c = 0; c < pat.k; c++) {
        const c0 = c * Math.PI * 2 / pat.k, flip = c % 2;
        if (pat.kind === 'fret') {
          const f = pts => flip ? pts.map(([u, v]) => [1 - u, v]) : pts;
          addCell(pat, c0, [f([[.06, .1], [.94, .1], [.94, .9], [.2, .9], [.2, .3], [.74, .3], [.74, .7], [.4, .7], [.4, .5], [.56, .5]])]);
        } else if (pat.kind === 'taotie') {
          const circ = (cu, cv, ru, rv) => { const a = []; for (let q = 0; q <= 14; q++) { const ph = q / 14 * Math.PI * 2; a.push([cu + ru * Math.cos(ph), cv + rv * Math.sin(ph)]); } return a; };
          addCell(pat, c0, [circ(.3, .58, .09, .1), circ(.7, .58, .09, .1), circ(.3, .58, .035, .04), circ(.7, .58, .035, .04),
            [[.14, .74], [.26, .84], [.42, .8], [.5, .66], [.58, .8], [.74, .84], [.86, .74]], [[.5, .66], [.5, .3], [.42, .18], [.58, .18], [.5, .3]],
            [[.2, .4], [.1, .3], [.14, .16], [.28, .14]], [[.8, .4], [.9, .3], [.86, .16], [.72, .14]], [[.1, .92], [.5, .96], [.9, .92]]]);
        } else if (pat.kind === 'boss') {
          const rows = 3, cols = 3;
          for (let rr = 0; rr < rows; rr++) for (let cc = 0; cc < cols; cc++) {
            const cu = .2 + cc * .3, cv = .2 + rr * .3, a = []; for (let q = 0; q <= 10; q++) { const ph = q / 10 * Math.PI * 2; a.push([cu + .08 * Math.cos(ph), cv + .1 * Math.sin(ph)]); }
            addCell(pat, c0, [a]);
          }
          addCell(pat, c0, [[[.02, 0], [.02, 1]], [[.98, 0], [.98, 1]]]);
        }
      }
    });
    return { F, verts: new Float32Array(verts), uvs: new Float32Array(uvs), quads, lines, nq: quads.length, ymin, ymax };
  }

  /* ---- section drawing: wall profile, zone bands, names. Always shown in the side panel; fills the stage if no 3D works ---- */
  const secCache = {};
  function sectionSvg(name, zone, big) {
    const F = FORMS[name], G = secCache[name] || (secCache[name] = buildForm(F)), y0 = G.ymin, y1 = G.ymax, dy = y1 - y0;
    let rmax = 0; F.parts.forEach(P => { if (P.prof) { const ox = Math.abs((P.at || [0])[0]); P.prof.out.forEach(([r]) => { rmax = Math.max(rmax, r + ox); }); } else rmax = Math.max(rmax, Math.abs(P.at[0]) + P.ring.R + P.ring.m); });
    const Wd = 300, Hd = 330, top = 22, bot = 24, cx = 118, k = Math.min((Hd - top - bot) / dy, (cx - 20) / rmax), gap = (Hd - top - bot - dy * k) / 2;
    const base = Hd - bot - gap, Yv = y => base - (y - y0) * k;
    let bands = '', body = '', marks = '';
    F.zones.forEach((z, i) => {
      const ya = Yv(y0 + z.a * dy), yb = Yv(y0 + z.b * dy), on = zone === i;
      bands += `<g class="sc-band${on ? ' on' : ''}" data-zi="${i}" role="button" tabindex="0" aria-label="${z.n}"><rect x="0" y="${yb}" width="${Wd}" height="${ya - yb}"/><path d="M${cx + rmax * k + 12} ${yb + 1}H${Wd - 6}M${cx + rmax * k + 12} ${ya - 1}H${Wd - 6}" /><text x="${Wd - 10}" y="${(ya + yb) / 2 + 4}" text-anchor="end">${z.n}</text></g>`;
    });
    F.parts.forEach(P => {
      const ox = (P.at || [0, 0, 0])[0], oy = (P.at || [0, 0, 0])[1];
      if (P.prof) {
        const pts = P.prof.out.concat(P.prof.inn), d = side => 'M' + pts.map(([r, y]) => `${(cx + (ox + side * r) * k).toFixed(1)} ${Yv(y + oy).toFixed(1)}`).join('L') + 'Z';
        body += `<path class="sc-wall" d="${d(1)}"/><path class="sc-wall" d="${d(-1)}"/>`;
      } else {
        body += `<circle class="sc-ear" cx="${(cx + P.at[0] * k).toFixed(1)}" cy="${Yv(P.at[1]).toFixed(1)}" r="${((P.ring.R + P.ring.m) * k).toFixed(1)}"/>`;
      }
    });
    body += `<path class="sc-axis" d="M${cx} ${top - 8}V${base + 10}"/>`;
    marks = `<text class="sc-cap" x="10" y="14">${F.name} · 剖面</text><text class="sc-cap" x="10" y="${Hd - 6}">0</text>`;
    return `<svg class="zs-svg${big ? ' big' : ''}" viewBox="0 0 ${Wd} ${Hd}" role="img" aria-label="${F.name}的器壁剖面和分段"><defs><pattern id="bzhatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V5" stroke="#c9a45c" stroke-opacity=".55" stroke-width="1"/></pattern></defs>${bands}${body}${marks}</svg>`;
  }

  /* ---- vessel viewer ---- */
  const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
  let threeP = null;
  const loadThree = () => threeP || (threeP = Promise.race([import(THREE_URL), new Promise((_, no) => setTimeout(() => no(new Error('three timeout')), 12000))]));

  function patinaTex(THREE) {
    const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d');
    const lg = g.createLinearGradient(0, 0, 0, 512); lg.addColorStop(0, '#6d5532'); lg.addColorStop(.5, '#5d472a'); lg.addColorStop(1, '#4b3a22'); g.fillStyle = lg; g.fillRect(0, 0, 512, 512);
    let sd = 11; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 3200; i++) {
      const x = rnd() * 512, y = rnd() * 512, r = 2 + rnd() * 20, q = rnd();
      g.fillStyle = q < .5 ? `rgba(62,140,116,${.05 + rnd() * .15})` : q < .78 ? `rgba(24,18,10,${.08 + rnd() * .2})` : `rgba(214,178,100,${.05 + rnd() * .12})`;
      g.beginPath(); g.ellipse(x, y, r, r * (.35 + rnd() * .6), rnd() * 3.14, 0, 6.3); g.fill();
    }
    g.strokeStyle = 'rgba(20,14,8,.25)'; g.lineWidth = 1;
    for (let i = 0; i < 40; i++) { const y = rnd() * 512; g.beginPath(); g.moveTo(0, y); g.lineTo(512, y + (rnd() - .5) * 6); g.stroke(); }
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
  }

  function mountVessel(host) {
    const cv = host.querySelector('.zv-cv'), glc = host.querySelector('.zv-gl'); if (!cv || host._zv) return; host._zv = 1;
    const panelRoot = host.closest('.z-loong'), ctx = cv.getContext && cv.getContext('2d');
    const $ = s => panelRoot.querySelector(s), $$ = s => [...panelRoot.querySelectorAll(s)];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const S = { mode: 'soft', form: 'ding', layer: 'body', zone: -1, yaw: .5, pitch: .22, vyaw: 0, spin: !reduce, idle: 0, down: false, moved: 0, x0: 0, y0: 0, visible: true, geo: {} };
    host._zvState = S;
    let W = 0, H = 0, dpr = 1, GL = null, screenYs = [], railX = 0;

    /* ----- total failure: no 2D canvas, so show the section drawing at full size ----- */
    const showFallback = () => { host.classList.add('nofx'); cv.hidden = true; if (glc) glc.hidden = true; host.querySelector('.zv-hint').hidden = true; const f = host.querySelector('.zv-fail'); f.hidden = false; f.innerHTML = `<span class="mono">3D 没有加载出来，下面是同一件器物的剖面图。点分段名，读每一段在器灵身上对应什么。</span><span class="zv-sec"></span>`; };
    const drawSec = () => { const html = sectionSvg(S.form, S.zone, false); const a = $('[data-zv-sec]'); if (a) a.innerHTML = html; const b = host.querySelector('.zv-sec'); if (b) b.innerHTML = sectionSvg(S.form, S.zone, true); };

    const resize = () => {
      const r = host.getBoundingClientRect(); dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(280, Math.round(r.width)); H = Math.max(300, Math.round(r.height));
      [cv, glc].forEach(c => { if (!c) return; c.width = W * dpr; c.height = H * dpr; c.style.width = W + 'px'; c.style.height = H + 'px'; });
      if (GL) { GL.r.setPixelRatio(dpr); GL.r.setSize(W, H, false); GL.cam.aspect = W / H; GL.cam.position.z = W < 560 ? 7.6 : 6.4; GL.group.position.x = W < 560 ? -.1 : -.28; GL.cam.updateProjectionMatrix(); }
      draw();
    };
    const geo = () => S.geo[S.form] || (S.geo[S.form] = buildForm(FORMS[S.form]));
    const lightD = (() => { const l = Math.hypot(-.5, .7, .7); return [-.5 / l, .7 / l, .7 / l]; })();

    /* ----- software renderer ----- */
    function drawSoft() {
      const G = geo(), V = G.verts, nv = V.length / 3;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      const cy = Math.cos(S.yaw), sy = Math.sin(S.yaw), cp = Math.cos(S.pitch), sp = Math.sin(S.pitch);
      const Dz = 7.2, fl = Math.min(W * .56, H * .5) * (7.2 / 3.4) * (W < 560 ? 1.3 : 1), cx = W * (W < 560 ? .38 : .42), cyc = H * .5;
      const px = new Float32Array(nv), py = new Float32Array(nv), pz = new Float32Array(nv);
      for (let i = 0; i < nv; i++) {
        const x = V[i * 3], y = V[i * 3 + 1], z = V[i * 3 + 2];
        const x1 = x * cy + z * sy, z1 = -x * sy + z * cy, y1 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
        const k = fl / (Dz - z2); px[i] = cx + x1 * k; py[i] = cyc - y1 * k; pz[i] = z2;
      }
      const vis = [];
      for (let qi = 0; qi < G.nq; qi++) {
        const q = G.quads[qi];
        const nx = q.nx * cy + q.nz * sy, nz1 = -q.nx * sy + q.nz * cy, ny = q.ny * cp - nz1 * sp, nz = q.ny * sp + nz1 * cp;
        if (nz <= -0.02) continue;
        q._n = [nx, ny, nz]; vis.push(qi);
      }
      vis.sort((a, b) => (pz[G.quads[a].a] + pz[G.quads[a].c]) - (pz[G.quads[b].a] + pz[G.quads[b].c]));
      const layer = S.layer;
      for (const qi of vis) {
        const q = G.quads[qi], n = q._n;
        const dif = Math.max(0, n[0] * lightD[0] + n[1] * lightD[1] + n[2] * lightD[2]);
        const rim = Math.pow(1 - Math.max(0, n[2]), 2.2) * .5;
        const pa = Math.min(1, q.h * .85 + Math.max(0, .35 - n[1]) * .5);
        let r, g, b; const hl = S.zone === q.zone;
        if (layer === 'spirit') { r = 26 + 40 * pa; g = 58 + 110 * pa; b = 52 + 90 * pa; const gl = .35 + dif * .55 + rim * .7; r *= gl; g *= gl * 1.1; b *= gl * 1.05; if (hl) { r += 30; g += 70; b += 60; } }
        else {
          const bs = [58 + 118 * dif, 44 + 90 * dif, 26 + 36 * dif], ver = [46 + 40 * dif, 96 + 56 * dif, 82 + 46 * dif];
          r = bs[0] * (1 - pa * .8) + ver[0] * pa * .8; g = bs[1] * (1 - pa * .8) + ver[1] * pa * .8; b = bs[2] * (1 - pa * .8) + ver[2] * pa * .8;
          r += rim * 90; g += rim * 80; b += rim * 50;
          if (layer === 'ornament') { r *= .55; g *= .55; b *= .55; }
          if (hl) { r += 46; g += 40; b += 22; }
        }
        ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`; ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = .8;
        ctx.beginPath(); ctx.moveTo(px[q.a], py[q.a]); ctx.lineTo(px[q.b], py[q.b]); ctx.lineTo(px[q.c], py[q.c]); ctx.lineTo(px[q.d], py[q.d]); ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      const show = layer === 'ornament' ? 1 : layer === 'body' ? .55 : .3;
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      for (const L of G.lines) {
        const hl = S.zone === L.zone;
        ctx.strokeStyle = layer === 'spirit' ? `rgba(160,230,212,${.5 * show + (hl ? .4 : 0)})` : `rgba(${hl ? '255,226,150' : '226,190,110'},${show + (hl ? .25 : 0)})`;
        ctx.lineWidth = (layer === 'ornament' ? 1.7 : 1.2) * Math.min(1.3, W / 640 + .4);
        ctx.beginPath(); let pen = false;
        for (const P of L.pts) {
          const x1 = P[0] * cy + P[2] * sy, z1 = -P[0] * sy + P[2] * cy, y1 = P[1] * cp - z1 * sp, z2 = P[1] * sp + z1 * cp;
          const rn = Math.hypot(P[0], P[2]) || 1, nz1 = -P[0] / rn * sy + P[2] / rn * cy, nz = nz1 * cp;
          const k = fl / (Dz - z2), X = cx + x1 * k, Y = cyc - y1 * k;
          if (nz > .08) { if (!pen) { ctx.moveTo(X, Y); pen = true; } else ctx.lineTo(X, Y); } else pen = false;
        }
        ctx.stroke();
      }
      const k0 = fl / Dz; screenYs = FORMS[S.form].zones.map(z => [cyc - (z.a * 2 - 1) * cp * k0, cyc - (z.b * 2 - 1) * cp * k0]);
      railX = Math.min(W - 54, cx + Math.min(W * .34, 1.15 * fl / Dz * 1.2) + 18);
      rail();
    }

    /* ----- rail + readout, drawn on the 2D canvas in both modes ----- */
    function rail() {
      const F = FORMS[S.form];
      ctx.font = '700 13px "ZCOOL XiaoWei","Noto Serif SC",serif'; ctx.textBaseline = 'middle';
      F.zones.forEach((z, i) => {
        const [y0, y1] = screenYs[i], on = S.zone === i;
        ctx.strokeStyle = on ? '#f2d58a' : 'rgba(201,164,92,.7)'; ctx.lineWidth = on ? 2.4 : 1.2;
        ctx.beginPath(); ctx.moveTo(railX, y0 - 1); ctx.lineTo(railX, y1 + 1); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(railX - 5, y0); ctx.lineTo(railX + 5, y0); ctx.moveTo(railX - 5, y1); ctx.lineTo(railX + 5, y1); ctx.stroke();
        ctx.fillStyle = on ? '#f2d58a' : '#cdb177'; ctx.textAlign = 'left'; ctx.fillText(z.n, railX + 10, (y0 + y1) / 2);
      });
      ctx.font = '500 10.5px "JetBrains Mono",monospace'; ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(201,164,92,.75)';
      ctx.fillText(`${F.name} · ${S.layer === 'body' ? 'BODY 器' : S.layer === 'ornament' ? 'ORNAMENT 纹' : 'SPIRIT 意'} · ${Math.round(((S.yaw % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) / Math.PI * 180)}° · ${S.mode === 'gl' ? 'WEBGL' : 'CANVAS'}`, 14, H - 16);
    }

    /* ----- three.js ----- */
    function initGL(THREE) {
      const r = new THREE.WebGLRenderer({ canvas: glc, antialias: true, alpha: true, powerPreference: 'low-power' });
      if (!r.getContext()) throw new Error('no webgl');
      r.setClearColor(0x000000, 0); r.outputColorSpace = THREE.SRGBColorSpace; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
      const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(28, 1, .1, 50), group = new THREE.Group();
      cam.position.set(0, .1, 6.4); scene.add(group);
      // studio environment: three soft boxes and a dark floor, baked once
      const env = new THREE.Scene(); env.background = new THREE.Color(0x0e0b08);
      const box = (w, h, col, k, x, y, z) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); env.add(m); };
      box(9, 5, 0xfff0d2, 6, -5, 5, 5); box(4, 9, 0x6fe0c6, 2.4, 7, 1, -3); box(10, 3, 0xffd9a0, 2, 0, -5, 4); box(8, 8, 0x3a2e20, 1, 0, 3, -8);
      const pm = new THREE.PMREMGenerator(r); scene.environment = pm.fromScene(env, .03).texture; pm.dispose();
      scene.add(new THREE.HemisphereLight(0xfff0d6, 0x20180f, .35));
      const key = new THREE.DirectionalLight(0xfff0d6, 1.6); key.position.set(-3, 4, 5); scene.add(key);
      const rim = new THREE.DirectionalLight(0x6fe0c6, 1.1); rim.position.set(4, 1, -4); scene.add(rim);
      const tex = patinaTex(THREE);
      const matBody = new THREE.MeshStandardMaterial({ map: tex, bumpMap: tex, bumpScale: 1.6, roughness: .46, metalness: .72, vertexColors: true, envMapIntensity: 1.15, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 2 });
      const matSpirit = new THREE.MeshStandardMaterial({ color: 0x2f9f88, emissive: 0x1d8a74, emissiveIntensity: .9, roughness: .35, metalness: .2, transparent: true, opacity: .55, vertexColors: true, side: THREE.DoubleSide, envMapIntensity: .6, polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 2 });
      const matGlow = new THREE.MeshBasicMaterial({ color: 0x5fe0c4, transparent: true, opacity: .16, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false });
      const objs = {};
      const build = name => {
        if (objs[name]) return objs[name];
        const G = S.geo[name] || (S.geo[name] = buildForm(FORMS[name])), nv = G.verts.length / 3;
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(G.verts, 3)); g.setAttribute('uv', new THREE.BufferAttribute(G.uvs, 2));
        const col = new Float32Array(nv * 3).fill(1), zoneOf = new Int8Array(nv), idx = [];
        G.quads.forEach(q => { idx.push(q.a, q.d, q.b, q.b, q.d, q.c); [q.a, q.b, q.c, q.d].forEach(v => { zoneOf[v] = q.zone; }); });
        g.setIndex(idx); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.computeVertexNormals();
        const mesh = new THREE.Mesh(g, matBody), glow = new THREE.Mesh(g, matGlow); glow.scale.setScalar(1.035);
        const grp = new THREE.Group(); grp.add(mesh, glow);
        const nz = FORMS[name].zones.length, segs = Array.from({ length: nz + 1 }, () => []);
        G.lines.forEach(L => { const a = segs[Math.min(nz, Math.max(0, L.zone))]; for (let i = 0; i < L.pts.length - 1; i++) a.push(...L.pts[i], ...L.pts[i + 1]); });
        const lines = segs.map(a => { const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); const l = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0xe2be6e, transparent: true, opacity: .6 })); grp.add(l); return l; });
        group.add(grp); grp.visible = false;
        return (objs[name] = { grp, mesh, glow, lines, col, zoneOf, g, G });
      };
      GL = { r, scene, cam, group, objs, build, matBody, matSpirit, ray: new THREE.Raycaster(), V3: THREE.Vector3, THREE };
      S.mode = 'gl'; glc.hidden = false; resize(); applyGL();
    }
    function applyGL() {
      if (!GL) return;
      Object.values(GL.objs).forEach(o => { o.grp.visible = false; });
      const o = GL.build(S.form); o.grp.visible = true;
      const sp = S.layer === 'spirit'; o.mesh.material = sp ? GL.matSpirit : GL.matBody; o.glow.visible = sp;
      const dim = S.zone >= 0;
      for (let v = 0; v < o.zoneOf.length; v++) { const on = o.zoneOf[v] === S.zone, k = S.layer === 'ornament' ? .55 : 1, m = dim ? (on ? 1.5 : .6) : 1; o.col[v * 3] = k * m * (on ? 1.05 : 1); o.col[v * 3 + 1] = k * m * (on ? .95 : 1); o.col[v * 3 + 2] = k * m * (on ? .72 : 1); }
      o.g.attributes.color.needsUpdate = true;
      o.lines.forEach((l, i) => { const on = i === S.zone; l.material.color.set(sp ? 0xa0e6d4 : on ? 0xffe296 : 0xe2be6e); l.material.opacity = S.layer === 'ornament' ? 1 : S.layer === 'body' ? (on ? 1 : (dim ? .35 : .6)) : (on ? 1 : .55); });
    }
    function drawGL() {
      const o = GL.build(S.form); GL.group.rotation.set(S.pitch, S.yaw, 0, 'XYZ'); GL.group.updateMatrixWorld(true);
      GL.r.render(GL.scene, GL.cam);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      const F = FORMS[S.form], v = new GL.V3(), pj = y => { v.set(0, y, 0); GL.group.localToWorld(v); v.project(GL.cam); return (1 - v.y) * H / 2; };
      screenYs = F.zones.map(z => [pj(z.a * 2 - 1), pj(z.b * 2 - 1)]);
      v.set(1.05, 0, 0); v.project(GL.cam); railX = Math.min(W - 54, (v.x + 1) * W / 2 + 40);
      rail();
    }
    function draw() { if (!W) return; if (S.mode === 'gl' && GL) drawGL(); else drawSoft(); }

    /* ----- panel text ----- */
    function info() {
      const F = FORMS[S.form], h = $('[data-zv-h]'), b = $('[data-zv-b]'), d = $('[data-zv-d]');
      $('[data-zv-ghost]').textContent = F.ghost;
      $('[data-zv-zones]').innerHTML = F.zones.map((z, i) => `<button type="button" data-zi="${i}" aria-pressed="${S.zone === i}">${z.n}</button>`).join('');
      drawSec();
      if (S.layer === 'spirit') { h.textContent = F.name + ' · 器灵的“意”'; b.textContent = F.spirit.dom; d.textContent = F.spirit.use + ' ' + F.spirit.solve; return; }
      if (S.zone < 0) { h.textContent = F.name + ' · ' + (S.layer === 'body' ? '器形分段' : '纹饰分段'); b.textContent = S.layer === 'body' ? `${F.zones.length} 段，点器身、标尺或剖面都可以` : '纹带落在躯干和颈部'; d.textContent = S.layer === 'body' ? '点一段，看它在器灵身上对应什么位置。分段是示意，不是设定稿。' : '雷纹、饕餮纹、乳钉各占一条纹带。点一段，看这一段的纹饰长在器灵的哪里。'; return; }
      const z = F.zones[S.zone];
      h.textContent = F.name + ' · ' + z.n; b.textContent = '对应：' + z.body;
      const pats = (F.pat || []).filter(p => p.zone === S.zone).map(p => ({ taotie: '饕餮纹', fret: '雷纹', boss: '乳钉纹' }[p.kind]));
      d.textContent = z.d + (S.layer === 'ornament' ? (pats.length ? ' 这一段的纹饰：' + [...new Set(pats)].join('、') + '，长在器灵的皮肤上。' : ' 这一段没有主纹饰，留作素面。') : '');
    }
    const refresh = () => { info(); applyGL(); draw(); };

    /* ----- events ----- */
    const setPressed = (sel, attr, val) => $$(sel).forEach(b => b.setAttribute('aria-pressed', b.getAttribute(attr) === val));
    panelRoot.addEventListener('click', e => {
      const f = e.target.closest('[data-zv-form]'), l = e.target.closest('[data-zv-layer]'), sp = e.target.closest('[data-zv-spin]'), z = e.target.closest('[data-zi]');
      if (f) { S.form = f.dataset.zvForm; S.zone = -1; setPressed('[data-zv-form]', 'data-zv-form', S.form); refresh(); }
      else if (l) { S.layer = l.dataset.zvLayer; setPressed('[data-zv-layer]', 'data-zv-layer', S.layer); refresh(); }
      else if (sp) { S.spin = !S.spin; sp.setAttribute('aria-pressed', S.spin); }
      else if (z) { const i = Number(z.dataset.zi); S.zone = S.zone === i ? -1 : i; refresh(); }
    });
    panelRoot.addEventListener('keydown', e => { const z = e.target.closest && e.target.closest('[data-zi][role=button]'); if (z && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); const i = Number(z.dataset.zi); S.zone = S.zone === i ? -1 : i; refresh(); } });
    const zoneAt = (x, y, cx, cy) => {
      if (S.mode === 'gl' && GL) {
        const o = GL.build(S.form), p = new GL.V3(x / W * 2 - 1, -(y / H) * 2 + 1, .5);
        GL.ray.setFromCamera({ x: p.x, y: p.y }, GL.cam); const hit = GL.ray.intersectObject(o.mesh, false)[0];
        if (hit && hit.faceIndex != null) return Math.max(-1, o.G.quads[hit.faceIndex >> 1].zone);
        return -1;
      }
      for (let i = 0; i < screenYs.length; i++) { const [y0, y1] = screenYs[i]; if (y <= Math.max(y0, y1) && y >= Math.min(y0, y1)) return i; } return -1;
    };
    cv.addEventListener('pointerdown', e => { S.down = true; S.moved = 0; S.x0 = e.clientX; S.y0 = e.clientY; S.idle = 0; cv.setPointerCapture && cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', e => {
      if (!S.down) return;
      const dx = e.clientX - S.x0, dy = e.clientY - S.y0; S.moved += Math.abs(dx) + Math.abs(dy); S.x0 = e.clientX; S.y0 = e.clientY;
      S.yaw += dx * .008; S.vyaw = dx * .008; S.pitch = Math.max(-.2, Math.min(.5, S.pitch + dy * .004)); draw();
    });
    cv.addEventListener('pointerup', e => {
      if (!S.down) return; S.down = false;
      if (S.moved < 6) { const r = cv.getBoundingClientRect(), i = zoneAt(e.clientX - r.left, e.clientY - r.top); S.zone = (i === S.zone) ? -1 : i; refresh(); }
    });
    cv.addEventListener('pointercancel', () => { S.down = false; });
    cv.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { S.yaw -= .15; S.idle = 0; draw(); e.preventDefault(); }
      if (e.key === 'ArrowRight') { S.yaw += .15; S.idle = 0; draw(); e.preventDefault(); }
      if (e.key === 'ArrowUp') { S.pitch = Math.min(.5, S.pitch + .06); draw(); e.preventDefault(); }
      if (e.key === 'ArrowDown') { S.pitch = Math.max(-.2, S.pitch - .06); draw(); e.preventDefault(); }
    });

    if (!ctx) { info(); showFallback(); drawSec(); return; }
    let last = performance.now();
    const loop = now => {
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      if (S.visible && !document.hidden) {
        if (!S.down) { S.vyaw *= .93; S.yaw += S.vyaw; S.idle += dt; if (S.spin && S.idle > 1.2) S.yaw += dt * .45; }
        draw();
      }
      requestAnimationFrame(loop);
    };
    if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => { S.visible = en.isIntersecting; }).observe(host);
    new ResizeObserver(resize).observe(host);
    info(); resize(); requestAnimationFrame(loop);
    // upgrade to WebGL when three.js arrives; the canvas renderer keeps the stage alive until then, and for good if it never does
    loadThree().then(THREE => { try { initGL(THREE); } catch (err) { S.mode = 'soft'; if (glc) glc.hidden = true; console.info('[bronze] webgl unavailable, canvas renderer kept', err && err.message); } })
      .catch(err => { console.info('[bronze] three.js did not load, canvas renderer kept', err && err.message); });
  }
})();
