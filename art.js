/* ART — marks drawn for this portfolio: the WB monogram,
   one emblem per project, and the PV decoration set (burst, speed
   lines, registration mark, sparkle, chevrons, sticker). All SVG,
   all currentColor, so every scene recolours them with its palette. */
(() => {
  const sv = (vb, body, cls = '') => `<svg class="art ${cls}" viewBox="${vb}" aria-hidden="true" focusable="false">${body}</svg>`;

  /* WB monogram: W as a zigzag, B as two bowls, a paper slash cuts through both */
  const logo = (cls = '') => sv('0 0 64 64', `<rect width="64" height="64" fill="currentColor"/><path d="M7 17 13.5 47 20 27.5 26.5 47 33 17" fill="none" stroke="var(--logo-on,#fff)" stroke-width="5.2" stroke-linejoin="miter" stroke-miterlimit="10"/><path d="M39 17v30h9.5a7.5 7.5 0 0 0 0-15H39m0 0h8a7.5 7.5 0 0 0 0-15H39" fill="none" stroke="var(--logo-on,#fff)" stroke-width="5.2"/><path d="M-4 58 58-4" stroke="var(--logo-cut,#5aaeff)" stroke-width="3"/>`, 'logo ' + cls);

  /* one emblem per project, 64 grid, stroke 3 */
  const st = 'fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"';
  const hexP = (cx, cy, r) => Array.from({ length: 6 }, (_, k) => { const a = Math.PI / 3 * k + Math.PI / 6; return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
  const EM = {
    rallylens: `<circle cx="17" cy="43" r="10" ${st}/><rect x="37" y="11" width="18" height="18" ${st}/><path d="M24 35C28 14 38 10 46 29" ${st} stroke-dasharray="4 4"/><path d="M41 31l5-2 2 5" ${st}/>`,
    'privacy-city': `<path d="M8 54V30h10v24M22 54V18h12v36M38 54V26h9v28M51 54V36h6v18" ${st}/><path d="M4 54h56" ${st}/><circle cx="28" cy="30" r="3.5" fill="currentColor"/><path d="M28 33v7" ${st}/>`,
    tennisatom: `<ellipse cx="32" cy="32" rx="26" ry="9" ${st}/><ellipse cx="32" cy="32" rx="26" ry="9" ${st} transform="rotate(60 32 32)"/><ellipse cx="32" cy="32" rx="26" ry="9" ${st} transform="rotate(120 32 32)"/><circle cx="32" cy="32" r="5" fill="currentColor"/>`,
    baseball: `<path d="M32 5 59 32 32 59 5 32Z" ${st}/><circle cx="32" cy="32" r="11" ${st}/><path d="M24.5 24c3 4 3 12 0 16M39.5 24c-3 4-3 12 0 16" ${st} stroke-width="2"/>`,
    artemis: `<polygon points="${hexP(32, 32, 26)}" ${st}/><path d="M38 18a14 14 0 1 0 0 28 11 11 0 1 1 0-28Z" fill="currentColor"/><path d="M12 32l5-5M12 32l5 5" ${st} stroke-width="2"/>`,
    bronze: `<path d="M10 22h44l-4 18H14Z" ${st}/><path d="M16 22v-8h6v8M42 22v-8h6v8" ${st}/><path d="M18 40l-3 14M32 40v14M46 40l3 14" ${st}/><path d="M18 30h28" ${st} stroke-width="2" stroke-dasharray="3 3"/>`,
    afterglow: `${Array.from({ length: 18 }, (_, i) => { const a = Math.PI + i / 17 * Math.PI, r1 = 14, r2 = i % 3 ? 22 : 27; return `<path d="M${(32 + r1 * Math.cos(a)).toFixed(1)} ${(42 + r1 * Math.sin(a)).toFixed(1)}L${(32 + r2 * Math.cos(a)).toFixed(1)} ${(42 + r2 * Math.sin(a)).toFixed(1)}" ${st} stroke-width="2"/>`; }).join('')}<path d="M22 42a10 10 0 0 1 20 0Z" fill="currentColor"/><path d="M4 46h56M12 52h40" ${st}/>`,
    'growth-compass': `<circle cx="32" cy="32" r="26" ${st}/><path d="M32 8l5 24-5 24-5-24Z" fill="currentColor"/><path d="M8 32l24-4 24 4-24 4Z" ${st} stroke-width="2"/>`,
    looplab: `<path d="M14 32c0-8 6-13 12-13 9 0 12 26 22 26 6 0 10-5 10-13s-4-13-10-13c-10 0-13 26-22 26-6 0-12-5-12-13Z" ${st}/><path d="M50 15l6 4-6 4" ${st}/>`,
    garden: `<path d="M32 52 8 22a34 34 0 0 1 48 0Z" ${st}/>${[14, 20, 26, 32, 38, 44, 50].map(x => `<path d="M32 52 ${x} ${x < 32 ? 22 - (32 - x) * .2 : 22 - (x - 32) * .2}" ${st} stroke-width="1.6"/>`).join('')}<circle cx="47" cy="12" r="6" fill="currentColor"/>`,
    jingwai: `<rect x="12" y="8" width="40" height="48" rx="2" ${st}/>${[14, 24, 34, 44].map(y => `<rect x="5" y="${y}" width="4" height="5" fill="currentColor"/><rect x="55" y="${y}" width="4" height="5" fill="currentColor"/>`).join('')}<path d="M22 16 34 32l-6 6 12 12" ${st} stroke-width="2"/>`
  };
  const emblem = (id, cls = '') => EM[id] ? sv('0 0 64 64', EM[id], 'em em-' + id + ' ' + cls) : '';

  /* deterministic random */
  const rng = seed => { let s = String(seed).split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7); return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
  /* anime starburst: spikes of uneven length */
  const burst = (seed, cls = '') => { const r = rng(seed), n = 18, pts = []; for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * Math.PI * 2, rr = i % 2 ? 30 + r() * 8 : 44 + r() * 18; pts.push(`${(64 + rr * Math.cos(a)).toFixed(1)},${(64 + rr * Math.sin(a)).toFixed(1)}`); } return sv('0 0 128 128', `<polygon points="${pts.join(' ')}" fill="currentColor"/>`, 'burst ' + cls); };
  /* speed lines converging on a point */
  const speed = (seed, cls = '') => { const r = rng(seed); return sv('0 0 200 120', Array.from({ length: 26 }, () => { const y = r() * 120, w = .6 + r() * 2.4, x0 = r() * 60; return `<path d="M${x0.toFixed(0)} ${y.toFixed(1)}L200 ${(60 + (y - 60) * .15).toFixed(1)}" stroke="currentColor" stroke-width="${w.toFixed(1)}"/>`; }).join(''), 'speed ' + cls); };
  const reg = (cls = '') => sv('0 0 40 40', `<circle cx="20" cy="20" r="11" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M20 2v36M2 20h36" stroke="currentColor" stroke-width="1.5"/><circle cx="20" cy="20" r="4" fill="currentColor"/>`, 'reg ' + cls);
  const sparkle = (cls = '') => sv('0 0 24 24', `<path d="M12 0c.8 6.4 2.6 10.2 12 12-9.4 1.8-11.2 5.6-12 12-.8-6.4-2.6-10.2-12-12C9.4 10.2 11.2 6.4 12 0Z" fill="currentColor"/>`, 'sparkle ' + cls);
  const chevrons = (cls = '') => sv('0 0 60 20', `<path d="M0 0h8l10 10-10 10H0l10-10zM20 0h8l10 10-10 10h-8l10-10zM40 0h8l10 10-10 10h-8l10-10z" fill="currentColor"/>`, 'chev ' + cls);
  /* sticker: emblem + code on a tilted label */
  const sticker = (id, code, sub = '', cls = '') => `<span class="sticker ${cls}" aria-hidden="true">${emblem(id)}<b>${code}</b>${sub ? `<small>${sub}</small>` : ''}</span>`;

  window.ART = { logo, emblem, burst, speed, reg, sparkle, chevrons, sticker, EM };
})();
