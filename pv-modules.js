/* PV edition — project modules.
   Every module states its provenance: 原数据 (exported project data),
   原图 (original asset), or 重绘示意 (diagram redrawn from project documents). */
(() => {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const img = n => /^(assets|viz|media)\//.test(n) ? n : /\.\w{3,4}$/.test(n) ? `assets/${n}` : `assets/${n}.webp`;
  const I = (n, c) => window.ICON ? window.ICON(n, c) : '';
  const $ = (s, r) => r.querySelector(s);
  const $$ = (s, r) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const json = {};
  const load = u => json[u] || (json[u] = fetch(u).then(r => r.json()));

  /* frame every module in the same HUD shell */
  const shell = (code, title, kind, body, cls = '') => `<div class="mod ${cls}">
    <div class="mod-bar"><span class="mod-code">${I('frame')}${esc(code)}</span><span class="mod-title">${esc(title)}</span><span class="mod-kind" data-kind="${esc(kind)}">${esc(kind)}</span></div>
    <div class="mod-body">${body}</div></div>`;
  const tabs = (items, name) => `<div class="mod-tabs" role="tablist" aria-label="${esc(name)}">${items.map((t, i) => `<button type="button" role="tab" aria-selected="${i ? 'false' : 'true'}" data-i="${i}">${esc(t)}</button>`).join('')}</div>`;
  const bindTabs = (el, fn) => {
    const bs = $$('.mod-tabs button', el);
    bs.forEach(b => b.addEventListener('click', () => { bs.forEach(x => x.setAttribute('aria-selected', x === b ? 'true' : 'false')); fn(+b.dataset.i); }));
    fn(0);
  };
  const steps = (arr, opt = {}) => `<ol class="steps${opt.cls ? ' ' + opt.cls : ''}">${arr.map(([t, s, ic], i) => `<li style="--i:${i}"><span class="st-n">${String(i + 1).padStart(2, '0')}</span>${ic ? I(ic, 'st-ic') : ''}<b>${esc(t)}</b>${s ? `<small>${esc(s)}</small>` : ''}</li>`).join('')}</ol>`;

  const M = {};

  /* ======================= RALLYLENS ======================= */
  M.rallySources = {
    html: () => shell('MOD.R1', '四种来源，各答一个问题', '重绘示意', `
      <div class="src-grid">
        <svg class="src-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M18 22 50 50M82 22 50 50M18 78 50 50M82 78 50 50"/></svg>
        ${[['双机位视频', '画面里发生了什么？', 'film'], ['当场目标卡', '当时想练什么？', 'target'], ['教练读片', '专业的人怎么看？', 'eye'], ['球员回访', '后来怎样解释？', 'node']].map(([t, q, ic], i) => `<div class="src s${i}" tabindex="0">${I(ic)}<b>${t}</b><span>${q}</span></div>`).join('')}
        <div class="core"><span class="mono">DYADIC PRACTICE EPISODE</span><b>DPE</b><span>双人练习片段</span></div>
      </div>`)
  };

  M.dpe = {
    html: () => {
      const rows = [
        ['源视频', '时间轴的锚点，所有信息都回到同一段画面。'],
        ['方向性事件', 'A→B 与 B→A 分开记录，谁给出、谁回应保持可见。'],
        ['阶段目标', '当场填写的目标卡，标出这一段想练什么。'],
        ['双方解释', '两人的陈述各有自己的时间范围，可以不重合。'],
        ['教练意见', '专业读片作为独立来源，不覆盖球员的理解。'],
        ['计算候选', '模型给出的估计，透明度表示置信程度。'],
        ['未知信息', '尚未定位的陈述也有位置，不被丢弃。']
      ];
      const W = 900, L = 120, H = 30;
      const ev = Array.from({ length: 22 }, (_, i) => L + 18 + i * 33);
      let s = `<svg class="dpe-svg" viewBox="0 0 ${W} ${rows.length * H + 30}" role="img" aria-label="DPE 结构示意">`;
      rows.forEach(([t], r) => {
        const y = 20 + r * H;
        s += `<g class="dpe-row" data-r="${r}"><rect class="hit" x="0" y="${y - 13}" width="${W}" height="${H}"/><text x="0" y="${y + 4}" class="lbl">${t}</text><line x1="${L}" x2="${W}" y1="${y}" y2="${y}" class="axis"/>`;
        if (r === 0) for (let x = L; x < W; x += 12) s += `<rect x="${x}" y="${y - 7}" width="9" height="14" class="frm"/>`;
        if (r === 1) ev.forEach((x, i) => { const up = i % 2 === 0; s += `<path class="${up ? 'ab' : 'ba'}" d="M${x} ${y + (up ? 7 : -7)} l5 ${up ? -14 : 14} l5 ${up ? 14 : -14}z"/>`; });
        if (r === 2) s += `<rect x="${L + 10}" y="${y - 6}" width="370" height="12" class="goal"/><rect x="${L + 400}" y="${y - 6}" width="360" height="12" class="goal g2"/>`;
        if (r === 3) s += `<rect x="${L + 60}" y="${y - 10}" width="280" height="8" class="sa"/><rect x="${L + 200}" y="${y + 2}" width="330" height="8" class="sb"/><text x="${L + 64}" y="${y - 12}" class="mini">A 的陈述</text><text x="${L + 204}" y="${y + 22}" class="mini">B 的陈述</text>`;
        if (r === 4) s += `<rect x="${L + 300}" y="${y - 5}" width="240" height="10" class="coach"/>`;
        if (r === 5) ev.forEach((x, i) => { s += `<rect x="${x + 2}" y="${y - 5}" width="10" height="10" transform="rotate(45 ${x + 7} ${y})" class="cand" style="opacity:${(0.25 + ((i * 37) % 70) / 100).toFixed(2)}"/>`; });
        if (r === 6) s += `<g class="unk"><rect x="${W - 150}" y="${y - 11}" width="146" height="22"/><text x="${W - 140}" y="${y + 5}">? ? ?  未定位</text></g>`;
        s += '</g>';
      });
      s += '</svg>';
      return shell('MOD.R2', 'DPE：把方向、来源和时间放回记录', '重绘示意', `${s}<p class="mod-read" aria-live="polite"><b>${rows[0][0]}</b>${rows[0][1]}</p>`);
    },
    init(el) {
      const rows = ['时间轴的锚点，所有信息都回到同一段画面。', 'A→B 与 B→A 分开记录，谁给出、谁回应保持可见。', '当场填写的目标卡，标出这一段想练什么。', '两人的陈述各有自己的时间范围，可以不重合。', '专业读片作为独立来源，不覆盖球员的理解。', '模型给出的估计，透明度表示置信程度。', '尚未定位的陈述也有位置，不被丢弃。'];
      const names = ['源视频', '方向性事件', '阶段目标', '双方解释', '教练意见', '计算候选', '未知信息'];
      const out = $('.mod-read', el);
      $$('.dpe-row', el).forEach(g => g.addEventListener('mouseenter', () => {
        $$('.dpe-row', el).forEach(x => x.classList.toggle('on', x === g));
        out.innerHTML = `<b>${names[g.dataset.r]}</b>${rows[g.dataset.r]}`;
      }));
    }
  };

  M.rallyTimeline = {
    html: () => shell('MOD.R3', '方向时间线 · 真实导出事件', '原数据', `
      <div class="rt-pick" role="group" aria-label="选择片段"></div>
      <div class="rt-plot"><svg viewBox="0 0 900 220" role="img" aria-label="方向时间线"></svg></div>
      <div class="rt-legend"><span><i class="ab"></i>A → B</span><span><i class="ba"></i>B → A</span><span><i class="brk"></i>回合断开</span><span class="mono rt-stat"></span></div>
      <p class="mod-note">来源：项目导出的 12 个 DPE 片段、160 个方向性事件（示例子集）。折线连接同一回合内的事件；相邻事件间隔超过 3.5 秒视为回合断开。</p>`),
    async init(el) {
      let data; try { data = await load('assets/composition/rally-events.json'); } catch (e) { $('.rt-plot', el).innerHTML = '<p class="mod-note">数据加载失败。</p>'; return; }
      const ids = [...new Set(data.map(d => d.dpe_id))];
      const pick = $('.rt-pick', el), svg = $('.rt-plot svg', el);
      pick.innerHTML = ids.map((id, i) => `<button type="button" aria-pressed="${i ? 'false' : 'true'}" data-id="${id}">${id.replace('DPE_', '')}</button>`).join('');
      const draw = id => {
        const ev = data.filter(d => d.dpe_id === id).sort((a, b) => a.event_time_a_s - b.event_time_a_s);
        const t0 = ev[0].event_time_a_s, t1 = ev[ev.length - 1].event_time_a_s, span = Math.max(1, t1 - t0);
        const X = t => 60 + (t - t0) / span * 800, Y = d => d.direction === 'A_to_B' ? 70 : 150;
        let s = `<text x="0" y="74" class="lane">A→B</text><text x="0" y="154" class="lane">B→A</text><line x1="60" x2="860" y1="70" y2="70" class="axis"/><line x1="60" x2="860" y1="150" y2="150" class="axis"/>`;
        let path = '', prev = null, brks = 0;
        ev.forEach(d => {
          const x = X(d.event_time_a_s), y = Y(d);
          if (prev && d.event_time_a_s - prev.event_time_a_s <= 3.5) path += `L${x.toFixed(1)} ${y}`;
          else { if (prev) { brks++; s += `<line x1="${(X(prev.event_time_a_s) + x) / 2}" x2="${(X(prev.event_time_a_s) + x) / 2}" y1="40" y2="180" class="brk"/>`; } path += `M${x.toFixed(1)} ${y}`; }
          prev = d;
        });
        s += `<path d="${path}" class="zig"/>`;
        ev.forEach((d, i) => { s += `<circle cx="${X(d.event_time_a_s).toFixed(1)}" cy="${Y(d)}" r="5" class="${d.direction === 'A_to_B' ? 'ab' : 'ba'}" style="--d:${i * 18}ms"><title>${d.direction === 'A_to_B' ? 'A→B' : 'B→A'} · ${(d.event_time_a_s - t0).toFixed(1)}s</title></circle>`; });
        s += `<text x="60" y="210" class="tick">0s</text><text x="860" y="210" class="tick" text-anchor="end">${span.toFixed(1)}s</text>`;
        svg.innerHTML = s;
        const ab = ev.filter(d => d.direction === 'A_to_B').length;
        $('.rt-stat', el).textContent = `${ev.length} EVENTS · A→B ${ab} · B→A ${ev.length - ab} · ${brks + 1} RALLIES`;
      };
      $$$('button', pick).forEach(b => b.addEventListener('click', () => { $$$('button', pick).forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false')); draw(b.dataset.id); }));
      draw(ids[0]);
    }
  };

  M.rallyLayers = {
    html: () => shell('MOD.R4', '先回看片段，再展开估计', '原图', `${tabs(['01 视频回放', '02 人工观察层', '03 模型层'], '原型层级')}
      <div class="layer-stage">${['rally-ui', 'composition/figS6_rallylens_layer1', 'composition/figS7_rallylens_layer2'].map((n, i) => `<img src="${img(n)}" alt="RallyLens 原型层级 ${i + 1}" loading="lazy" data-i="${i}">`).join('')}</div>
      <p class="mod-read" aria-live="polite"></p>`),
    init(el) {
      const t = ['以视频为阅读入口：双视角回放、目标卡与事件检查围绕同一片段组织。', '展开人工观察：事件方向、阶段目标与双方陈述并列，教练读片保留独立来源。', '再展开模型估计：计算候选始终标明来源，切换层级时保留选中的事件和播放位置。'];
      bindTabs(el, i => { $$('.layer-stage img', el).forEach(x => x.classList.toggle('on', +x.dataset.i === i)); $('.mod-read', el).textContent = t[i]; });
    }
  };

  /* ======================= PRIVACY CITY ======================= */
  const SCEN = [
    ['邮箱', 'frame', '读取联系邮箱', '邮箱可能用于联系，也可能被用于营销。先检查用途、保存期限，以及是否允许另作他用。'],
    ['定位', 'target', '访问位置信息', '位置记录会暴露活动轨迹。应检查是否需要持续定位，任务是否只需要大致位置。'],
    ['联系人', 'node', '读取联系人列表', '联系人涉及其他人的资料。检查选择范围、是否整表上传，以及拒绝后的替代流程。'],
    ['摄像头 / 麦克风', 'eye', '开启音视频输入', '音视频可能包含人物与环境信息。检查处理发生在哪里、是否保存、何时停止。'],
    ['画像分析', 'radar', '分析行为与偏好', '画像可能影响后续推荐与判断。检查输入来源、关联范围，以及能否查看和撤回。']
  ];
  M.privacyDemo = {
    html: () => shell('MOD.P1', '五类模拟授权 · 你的操作正在被记录', '交互重绘 · 模拟情境', `
      ${tabs(SCEN.map(s => s[0]), '授权情境')}
      <div class="pv-demo">
        <div class="phone"><div class="phone-top"><span>PRIVACY CITY</span><span class="mono pv-clock">00.0s</span></div>
          <div class="phone-req">${I('warn')}<p class="pv-q"></p></div><p class="pv-hint">这是模拟授权界面。读完用途和影响，再选择接受或拒绝。</p>
          <div class="phone-terms" tabindex="0"><p>条款摘要：数据将用于提供本功能，并可能与合作方共享以改进服务。你可以在设置中撤回授权。撤回前已共享的数据不受影响。数据保存期限以实际业务需要为准。</p><p>继续阅读：部分数据可能用于统计分析与个性化内容。我们会采取合理措施保护你的信息。</p></div>
          <div class="phone-btns"><button type="button" data-a="0">拒绝</button><button type="button" data-a="1">接受</button></div>
          <p class="pv-fb" aria-live="polite"></p></div>
        <div class="pv-log"><p class="mono">BEHAVIOUR LOG / 行为记录</p>
          <dl><div><dt>决策时间</dt><dd data-k="t">—</dd></div><div><dt>条款滚动</dt><dd data-k="s">0</dd></div><div><dt>回滚次数</dt><dd data-k="r">0</dd></div><div><dt>点击次数</dt><dd data-k="c">0</dd></div><div><dt>阅读完成率</dt><dd data-k="p">0%</dd></div><div><dt>选择</dt><dd data-k="d">—</dd></div></dl>
          <p class="mod-note">数值只在你的浏览器里计算，不上传、不存储；没有连接真实权限。原项目用同类事件构成 48 维特征，机器学习部分是离线实验。</p></div>
      </div>`),
    init(el) {
      let st, timer, cur = 0, rec;
      const reset = i => {
        cur = i; rec = { s: 0, r: 0, c: 0, p: 0, last: 0, done: false }; st = performance.now();
        $('.pv-q', el).textContent = SCEN[i][2]; $('.pv-fb', el).textContent = ''; $('.phone-terms', el).scrollTop = 0;
        $$('.pv-log dd', el).forEach(d => d.textContent = { t: '—', s: '0', r: '0', c: '0', p: '0%', d: '—' }[d.dataset.k]);
        clearInterval(timer); timer = setInterval(() => { if (!rec.done) $('.pv-clock', el).textContent = ((performance.now() - st) / 1000).toFixed(1) + 's'; }, 100);
      };
      const set = (k, v) => { $(`dd[data-k="${k}"]`, el).textContent = v; };
      const terms = $('.phone-terms', el);
      terms.addEventListener('scroll', () => {
        const y = terms.scrollTop; if (y < rec.last) rec.r++; rec.s++; rec.last = y;
        rec.p = Math.max(rec.p, Math.round((y + terms.clientHeight) / terms.scrollHeight * 100));
        set('s', rec.s); set('r', rec.r); set('p', rec.p + '%');
      }, { passive: true });
      el.addEventListener('click', () => { if (!rec.done) { rec.c++; set('c', rec.c); } });
      $$('.phone-btns button', el).forEach(b => b.addEventListener('click', () => {
        if (rec.done) return; rec.done = true;
        const a = +b.dataset.a, t = ((performance.now() - st) / 1000).toFixed(1);
        set('t', t + 's'); set('d', a ? '接受' : '拒绝');
        $('.pv-fb', el).textContent = `${a ? '已接受' : '已拒绝'} · 先确认请求范围：${SCEN[cur][3]}`;
      }));
      bindTabs(el, reset);
    }
  };

  M.privacyPipeline = {
    html: () => shell('MOD.P2', '同一个问题，两条验证路径', '重绘示意', `
      <div class="lanes">
        <div class="lane-row"><span class="lane-tag">WEB<small>可体验原型</small></span>${steps([['模拟请求', '五类情境', 'warn'], ['阅读与选择', '停留 / 滚动 / 点击', 'eye'], ['规则反馈', '解释该选择的风险', 'chev']], { cls: 'h' })}</div>
        <div class="lane-link"><span>设计参考 · 不是在线推理</span></div>
        <div class="lane-row dark"><span class="lane-tag">OFFLINE<small>可复现实验</small></span>${steps([['合成样本', '5,000 条', 'stack'], ['48 维特征', '7 组行为信号', 'chip'], ['模型与评估', '五模型 · 校准', 'radar']], { cls: 'h' })}</div>
      </div>`)
  };

  const FEAT_GROUPS = [['A 行为节奏', 8], ['B 阅读行为', 8], ['C 风险偏好', 10], ['D 情境特征', 8], ['E 时序演变', 6], ['F 交互效应', 8]];
  M.mlp = {
    html: () => {
      const layers = [[48, 12], [64, 14], [32, 10], [1, 1]];
      const W = 720, Hh = 330, xs = [70, 280, 490, 680];
      const pos = layers.map(([, n], li) => Array.from({ length: n }, (_, k) => [xs[li], n === 1 ? Hh / 2 : 24 + k * ((Hh - 48) / (n - 1))]));
      let e = '', nodes = '';
      for (let l = 0; l < 3; l++) pos[l].forEach((a, i) => pos[l + 1].forEach((b, j) => { if ((i + j * 3 + l) % 3 === 0 || l === 2) e += `<line x1="${a[0]}" y1="${a[1].toFixed(1)}" x2="${b[0]}" y2="${b[1].toFixed(1)}" class="ed l${l}"/>`; }));
      pos.forEach((L, li) => L.forEach(([x, y]) => { nodes += `<circle cx="${x}" cy="${y.toFixed(1)}" r="${li === 3 ? 12 : 6}" class="nd n${li}"/>`; }));
      const labels = layers.map(([n], li) => `<text x="${xs[li]}" y="${Hh + 26}" text-anchor="middle" class="lyr">${n}</text>`).join('');
      const groups = FEAT_GROUPS.map(([g, n]) => `<li><span>${g}</span><i style="--n:${n}"></i><b>${n}</b></li>`).join('');
      return shell('MOD.P3', '从 48 个输入，到一个概率', '原结构 · 重绘', `
        <div class="mlp"><svg viewBox="0 0 ${W} ${Hh + 40}" role="img" aria-label="48-64-32-1 网络结构">${e}${nodes}${labels}</svg>
        <div class="mlp-side"><p class="mono">INPUT 48 = 6 GROUPS</p><ul class="fg">${groups}</ul>
        <button type="button" class="btn small mlp-go">${I('play')} 前向传播</button>
        <p class="mod-note">48→64→32→1，共 5,249 个参数。前向、反向传播与梯度检查以 NumPy 手写实现。</p></div></div>`);
    },
    init(el) {
      const go = () => { if (reduce) return; const s = $('.mlp svg', el); s.classList.remove('run'); void s.getBoundingClientRect(); s.classList.add('run'); };
      $('.mlp-go', el).addEventListener('click', go);
    }
  };

  M.models = {
    html: () => shell('MOD.P4', '五模型比较 · 同一划分', '原数据', `${tabs(['AUC · 排序', 'F1 · 分类', 'ECE · 校准', 'Brier · 概率误差'], '指标')}<p class="mod-read bars-read"></p>${''}
      <div class="bars" aria-live="polite"></div>
      <p class="mod-note">5,000 条合成样本，训练 / 验证 / 测试 = 3,500 / 750 / 750。另一轮 10,000 样本基线实验不混入本表。合成数据结果不代表真实用户表现。</p>`),
    async init(el) {
      let d; try { d = await load('assets/editorial/privacy-models.json'); } catch (e) { return; }
      const keys = ['roc_auc', 'f1_score', 'ece', 'brier_score'];
      const READ = ['在共同的 0—1 尺度上比较排序能力。越高越好；AUC 不需要先固定分类阈值，但说明不了输出概率是否可信。', '比较当前阈值下的分类表现。越高越好；F1 是查准率与查全率的调和平均，结果取决于分类阈值。', '比较分组概率与实际频率的差距。越低越好；分箱设置会影响 ECE，要和排序、分类一起读。', '比较概率预测的平方误差。越低越好；结果来自共同设置下的二分类实验，不能推到真实玩家场景。'];
      const names = Object.keys(d.models);
      bindTabs(el, i => {
        const k = keys[i], low = i >= 2; $('.bars-read', el).textContent = READ[i];
        const vals = names.map(n => d.models[n][k]);
        const max = low ? Math.max(...vals) * 1.1 : 1, min = 0;
        const best = low ? Math.min(...vals) : Math.max(...vals);
        $('.bars', el).innerHTML = names.map((n, j) => {
          const v = vals[j], w = ((v - min) / (max - min) * 100).toFixed(1);
          const ci = k === 'roc_auc' && d.models[n].auc_95ci_low ? `<i class="ci" style="left:${((d.models[n].auc_95ci_low - min) / (max - min) * 100).toFixed(1)}%;right:${(100 - (d.models[n].auc_95ci_high - min) / (max - min) * 100).toFixed(1)}%"></i>` : '';
          return `<div class="bar${v === best ? ' best' : ''}${j === 0 ? ' mine' : ''}"><span>${esc(n.replace(' / ', ' · '))}</span><div class="track"><i style="width:${w}%"></i>${ci}</div><b>${v.toFixed(3)}</b></div>`;
        }).join('');
      });
    }
  };

  /* ======================= BASEBALL ======================= */
  M.pitchMix = {
    html: () => shell('MOD.B1', '山本由伸 · 球种结构逐年变化', '原数据', `<div class="pm"></div><div class="pm-legend"></div>
      <p class="mod-note">按年份与球种分组；占比分母为该年全部 CSV 行，未记录赛季不补齐。2026 年仅含 3 月 26 日至 4 月 14 日。</p>`),
    async init(el) {
      let d; try { d = await load('assets/baseball-pitch-summary.json'); } catch (e) { return; }
      const types = ['4-Seam Fastball', 'Split-Finger', 'Curveball', 'Cutter', 'Sinker', 'Slider', 'Sweeper', '未标注球种'];
      const col = ['var(--cobalt)', 'var(--navy)', 'var(--sky)', '#8e9ab8', '#a8c8ff', '#c9ccd4', '#3a55ff', '#e5e7eb'];
      $('.pm', el).innerHTML = d.years.map(y => `<div class="pm-row"><span class="pm-y">${y.year}<small>${y.total.toLocaleString()} 球</small></span><div class="pm-bar">${types.map((t, i) => { const x = y.types.find(z => z.name === t); return x ? `<i style="flex:${x.share};background:${col[i]}" title="${t} · ${x.count} 球 · ${(x.share * 100).toFixed(1)}%${x.meanSpeed ? ` · 均速 ${x.meanSpeed.toFixed(1)} mph` : ''}">${x.share > .09 ? `<span>${(x.share * 100).toFixed(0)}%</span>` : ''}</i>` : ''; }).join('')}</div></div>`).join('');
      $('.pm-legend', el).innerHTML = types.slice(0, 6).map((t, i) => `<span><i style="background:${col[i]}"></i>${t}</span>`).join('');
    }
  };

  M.liveDemo = {
    html: (p, opt) => shell(opt.code, opt.title, '原项目网页', `<div class="live" data-src="${esc(opt.src)}"><img src="${img(opt.poster)}" alt="" loading="lazy"><button type="button" class="btn blue">${I('play')} 在本页加载原型</button><a class="mono" href="${esc(opt.src)}" target="_blank" rel="noopener">新窗口打开 ↗</a></div>`),
    init(el) {
      const box = $('.live', el);
      $('button', box).addEventListener('click', () => { box.innerHTML = `<iframe src="${box.dataset.src}" title="项目原型" loading="lazy" allow="fullscreen"></iframe>`; box.classList.add('on'); });
    }
  };

  /* ======================= AFTERGLOW ======================= */
  M.glyph = {
    html: () => shell('MOD.A1', '19 个内置时刻 → 一个径向字环', '代码重绘 · 原样本', `
      <div class="glyph"><canvas width="720" height="720" aria-label="环境信号径向图形"></canvas>
        <div class="glyph-side">
          <div class="g-time"><b>06:00</b><button type="button" class="btn small g-play">${I('play')} 播放 24 小时</button></div>
          <input type="range" min="0" max="23" value="2" aria-label="时间">
          <dl class="g-vals"><div><dt>人流 → 环幅 · 方向数</dt><dd data-k="flow">—</dd></div><div><dt>噪声 → 波瓣 · 扭曲</dt><dd data-k="noise">—</dd></div><div><dt>PM2.5 → 字号 · 外圈膨胀</dt><dd data-k="pm25">—</dd></div><div><dt>风 → 行进 · 倾斜</dt><dd data-k="wind">—</dd></div></dl>
          <p class="mod-note">按 V4 编码逻辑在网页里重绘，用来演示映射关系，不是原 p5.js 的实时输出。样本是 V4 内置的 19 个演示时刻，不是车站实时监测。</p>
        </div></div>`),
    async init(el) {
      let data; try { data = await load('assets/editorial/afterglow-samples.json'); } catch (e) { return; }
      const cv = $('canvas', el), ctx = cv.getContext('2d'), rg = $('input', el);
      const N = data.length; rg.max = N - 1; rg.value = Math.min(2, N - 1);
      let cur = { ...data[rg.value] }, target = data[rg.value], rot = 0, raf, playing = false, lastStep = 0;
      const lerp = (a, b, t) => a + (b - a) * t;
      const show = d => { $('.g-time b', el).textContent = d.time; ['flow', 'noise', 'pm25', 'wind'].forEach(k => $(`dd[data-k="${k}"]`, el).textContent = d[k]); };
      const frame = ts => {
        ['flow', 'noise', 'pm25', 'wind'].forEach(k => cur[k] = lerp(cur[k], target[k], .08));
        if (playing && ts - lastStep > 900) { lastStep = ts; rg.value = (+rg.value + 1) % N; target = data[rg.value]; show(target); }
        const css = getComputedStyle(el), ink = css.getPropertyValue('--ink').trim() || '#0a0c10', acc = css.getPropertyValue('--cobalt').trim() || '#1f3bff', lime = css.getPropertyValue('--sky').trim() || '#5aaeff';
        ctx.clearRect(0, 0, 720, 720); ctx.save(); ctx.translate(360, 360);
        rot += cur.wind * 0.0016 * (reduce ? 0 : 1);
        const rays = Math.round(36 + cur.flow * 0.9), base = 120, t = ts / 1000;
        ctx.rotate(rot); ctx.transform(1, 0, Math.sin(rot) * cur.wind * 0.02, 1, 0, 0);
        for (let i = 0; i < rays; i++) {
          const a = i / rays * Math.PI * 2;
          const amp = cur.noise * 1.6 * (0.55 + 0.45 * Math.sin(i * 1.7 + t * 2));
          ctx.strokeStyle = i % 9 === 0 ? acc : ink; ctx.lineWidth = i % 9 === 0 ? 2.4 : 1;
          ctx.beginPath(); ctx.moveTo(Math.cos(a) * base, Math.sin(a) * base); ctx.lineTo(Math.cos(a) * (base + amp), Math.sin(a) * (base + amp)); ctx.stroke();
        }
        ctx.fillStyle = lime; ctx.beginPath(); ctx.arc(0, 0, base - 18 + cur.pm25 * .25, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(0, 0, base - 34, 0, Math.PI * 2); ctx.fill();
        const fs = 10 + cur.pm25 * 0.32, txt = 'AFTERGLOW · SHANGHAI SOUTH · ';
        ctx.font = `600 ${fs}px "Barlow Condensed", sans-serif`; ctx.fillStyle = ink;
        const R = base + cur.noise * 1.6 + 40;
        for (let i = 0; i < txt.length * 2; i++) { const a = i / (txt.length * 2) * Math.PI * 2; ctx.save(); ctx.rotate(a); ctx.translate(0, -R); ctx.fillText(txt[i % txt.length], 0, 0); ctx.restore(); }
        ctx.restore();
        ctx.fillStyle = '#fff'; ctx.font = '400 64px Anton, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(target.time, 360, 384);
        raf = requestAnimationFrame(frame);
      };
      rg.addEventListener('input', () => { target = data[rg.value]; show(target); });
      $('.g-play', el).addEventListener('click', e => { playing = !playing; e.currentTarget.classList.toggle('on', playing); });
      show(target);
      new IntersectionObserver(es => es.forEach(x => { cancelAnimationFrame(raf); if (x.isIntersecting) raf = requestAnimationFrame(frame); })).observe(cv);
    }
  };

  M.encoding = {
    html: () => shell('MOD.A2', '信号与视觉通道', '原编码 · 重绘', `<div class="enc">${[
      ['人流', 'FLOW · 原样本值', '环幅 × 密度 · span = maxR × (0.50 + 0.46 × fN)', 'node'], ['噪声', 'NOISE · dB', '波瓣 × 振幅 × 扭曲 · warp = sin(angle × lobes − phase + j × 0.55)', 'bars'], ['PM2.5', 'PM2.5 · 指数', '字号 × 外圈膨胀 · glyphMul = (0.8 + 0.85 × pN) × size', 'orbit'], ['风', 'WIND · m/s', '行进速度 × 倾斜 · lean = (wN − 0.45) × 0.55', 'chev']
    ].map(([a, b, c, ic]) => `<div class="enc-row">${I(ic)}<b>${a}<small>${b}</small></b><span class="enc-arrow"></span><span>${c}</span></div>`).join('')}</div>
    <p class="mod-note">V4 代码中，人流同时改变环幅与方向数，PM2.5 驱动字号和外圈膨胀；字重为独立的手动开关。</p>`)
  };

  /* ======================= 镜外 ======================= */
  M.jwFlow = {
    html: () => shell('MOD.J1', '一卷胶片里的六个动作', '重绘示意', steps([['入片', '拍 025 海报，进入事故前', 'film'], ['救人', '搬动物件，排演、补拍', 'pen'], ['封存', '保存新画面，艾达获救', 'disc'], ['交信', '找回同一封原信，递给米娅', 'flow'], ['检修', '查救援证据，接光、开盖、拍图', 'chip'], ['抵达', '拍桥与楼梯，搭路去影院', 'chev']], { cls: 'h flow6' }))
  };

  M.jwMatrix = {
    html: () => shell('MOD.J2', '救法 × 送法 → 07 号检修台', '玩法结构 · 交互', `
      <div class="jm">
        <div class="jm-col"><p class="mono">RESCUE / 救法</p>${[['餐车接住', '留下撞痕'], ['钩索接回', '马丁空出手'], ['撑杆托住', '留下锁位']].map(([a, b], i) => `<button type="button" class="jm-r" data-i="${i}" aria-pressed="${i ? 'false' : 'true'}"><b>${a}</b><small>${b}</small></button>`).join('')}</div>
        <div class="jm-col"><p class="mono">DELIVERY / 送法</p>${[['赶上邮车', '上层收件柜'], ['错过补送', '侧下方补送盘'], ['亲手送到', '马丁的便条']].map(([a, b], i) => `<button type="button" class="jm-d" data-i="${i}" aria-pressed="${i ? 'false' : 'true'}"><b>${a}</b><small>${b}</small></button>`).join('')}</div>
        <div class="jm-out"><p class="mono">STATION 07 / 检修台</p><div class="jm-07">07</div><dl><div><dt>检修</dt><dd class="o-r"></dd></div><div><dt>接收窗</dt><dd class="o-d"></dd></div></dl><p class="jm-cost">三条救法都救下艾达，也都付出同样的记忆代价。</p></div>
      </div>`),
    init(el) {
      const R = ['读撞痕', '对齐合影', '重搭支撑'], D = ['固定窗 · 已就位，把光对进去', '滑动窗 · 拉回 07 白线再对光', '便携窗 · 安装到黄铜座上'];
      let r = 0, d = 0;
      const upd = () => { $('.o-r', el).textContent = R[r]; $('.o-d', el).textContent = D[d]; const o = $('.jm-07', el); o.classList.remove('hit'); void o.offsetWidth; o.classList.add('hit'); };
      $$('.jm-r', el).forEach(b => b.addEventListener('click', () => { r = +b.dataset.i; $$('.jm-r', el).forEach(x => x.setAttribute('aria-pressed', x === b)); upd(); }));
      $$('.jm-d', el).forEach(b => b.addEventListener('click', () => { d = +b.dataset.i; $$('.jm-d', el).forEach(x => x.setAttribute('aria-pressed', x === b)); upd(); }));
      upd();
    }
  };

  M.jwPrompt = {
    html: () => shell('MOD.J3', '一条提示怎么改', 'AI 协作记录', `
      <div class="pr"><div class="pr-a"><p class="mono">BEFORE / 原提示</p><p class="pr-t">伸缩撑杆 · 拿起 · 寻找细节</p><p class="pr-why">${I('xmark')}没说对象怎么用，玩家不知道下一步。</p></div>
      <div class="pr-arrow">${I('chev')}</div>
      <div class="pr-b"><p class="mono">AFTER / 改写</p><p class="pr-t pr-type" data-text="放稳撑杆。转动低位握轮，让托头接触灯底；锁住后按 T 排演。"></p><p class="pr-why">${I('star')}写出对象、动作和完成条件；按键与物件状态一致。</p></div></div>
      <div class="pr-check">${['知道要做什么', '手上真能操作', '做法留下差别'].map((t, i) => `<span>${I('frame')}0${i + 1} ${t}</span>`).join('')}</div>`),
    init(el) {
      const t = $('.pr-type', el), full = t.dataset.text;
      if (reduce) { t.textContent = full; return; }
      new IntersectionObserver((es, o) => es.forEach(e => { if (!e.isIntersecting) return; o.disconnect(); let i = 0; const tick = () => { t.textContent = full.slice(0, ++i); if (i < full.length) setTimeout(tick, 45); }; tick(); }), { threshold: .6 }).observe(t);
    }
  };

  /* ======================= ARTEMIS ======================= */
  M.hexState = {
    html: () => {
      const r = 26, cols = 9, rows = 5; let hex = '';
      for (let q = 0; q < cols; q++) for (let s = 0; s < rows; s++) {
        const x = 40 + q * r * 1.5, y = 36 + s * r * 1.732 + (q % 2) * r * .866;
        const pts = Array.from({ length: 6 }, (_, k) => { const a = Math.PI / 3 * k; return `${(x + r * .94 * Math.cos(a)).toFixed(1)},${(y + r * .94 * Math.sin(a)).toFixed(1)}`; }).join(' ');
        hex += `<polygon points="${pts}" data-q="${q}" data-s="${s}" class="hx"/>`;
      }
      const states = [['IDLE', '待机'], ['START', '起步'], ['MOVE', '持续移动'], ['STOP', '停步']];
      return shell('MOD.G1', '输入给出目标，状态机接续动作', '交互重绘 · 原脚本逻辑', `
        <div class="hs"><svg class="hs-map" viewBox="0 0 400 300" role="img" aria-label="六边形地图">${hex}<circle class="tok" r="11"/></svg>
        <div class="hs-side"><div class="fsm">${states.map(([e, c], i) => `<span data-s="${i}"><b>${e}</b>${c}</span>`).join('<i></i>')}</div>
        <div class="keys" role="group" aria-label="移动方向">${['Q', 'W', 'E', 'A', 'S', 'D'].map(k => `<button type="button" data-k="${k}">${k}</button>`).join('')}</div>
        <p class="mod-read" aria-live="polite">按键或点击相邻格：目标先经校验，再由 SetHexPath 交给角色。</p></div></div>`);
    },
    init(el) {
      const hx = $$('.hx', el), tok = $('.tok', el), fsm = $$('.fsm span', el), out = $('.mod-read', el);
      let q = 4, s = 2, busy = false;
      const at = (q, s) => hx.find(h => +h.dataset.q === q && +h.dataset.s === s);
      const center = h => { const p = h.getAttribute('points').split(' ').map(v => v.split(',').map(Number)); return [p.reduce((a, b) => a + b[0], 0) / 6, p.reduce((a, b) => a + b[1], 0) / 6]; };
      const place = () => { const [x, y] = center(at(q, s)); tok.setAttribute('cx', x); tok.setAttribute('cy', y); hx.forEach(h => h.classList.toggle('adj', isAdj(+h.dataset.q, +h.dataset.s))); };
      const isAdj = (a, b) => { const odd = q % 2; const n = [[0, -1], [0, 1], [-1, odd ? 0 : -1], [-1, odd ? 1 : 0], [1, odd ? 0 : -1], [1, odd ? 1 : 0]]; return n.some(([dq, ds]) => q + dq === a && s + ds === b); };
      const state = i => fsm.forEach(f => f.classList.toggle('on', +f.dataset.s === i));
      const move = (nq, ns) => {
        if (busy) return;
        if (!at(nq, ns) || !isAdj(nq, ns)) { out.textContent = '目标格不可达：校验失败，保持待机。'; state(0); return; }
        busy = true; state(1); out.textContent = '起步：路径已提交，播放起步动画。';
        setTimeout(() => { q = nq; s = ns; place(); state(2); out.textContent = '持续移动：沿路径前进，路径完成后切换。'; }, reduce ? 0 : 320);
        setTimeout(() => { state(3); out.textContent = '停步：动画结束后回到待机。'; }, reduce ? 0 : 760);
        setTimeout(() => { state(0); busy = false; }, reduce ? 0 : 1150);
      };
      hx.forEach(h => h.addEventListener('click', () => move(+h.dataset.q, +h.dataset.s)));
      const dir = { W: [0, -1], S: [0, 1], Q: [-1, null], A: [-1, 'd'], E: [1, null], D: [1, 'd'] };
      const key = k => { const [dq, t] = dir[k]; const odd = q % 2; const ds = t === null ? (odd ? 0 : -1) : t === 'd' ? (odd ? 1 : 0) : t; move(q + dq, s + ds); };
      $$('.keys button', el).forEach(b => b.addEventListener('click', () => key(b.dataset.k)));
      el.tabIndex = 0; el.addEventListener('keydown', e => { const k = e.key.toUpperCase(); if (dir[k]) { e.preventDefault(); key(k); } });
      place(); state(0);
    }
  };

  M.partChain = {
    html: () => {
      const nodes = [['ROOT', '推进器', 0, 1], ['A1', '燃料舱', 1, 0], ['A2', '导航仪', 1, 2], ['B1', '分离环', 2, 0], ['B2', '护盾板', 2, 1], ['B3', '增幅器', 2, 2], ['C1', '主载荷', 3, 1]];
      const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [4, 6], [5, 6]];
      const P = n => [60 + n[2] * 190, 50 + n[3] * 95];
      return shell('MOD.G2', '零件连成可分步触发的效果链', '交互重绘 · 原系统逻辑', `
        <div class="pc"><svg viewBox="0 0 680 290" role="img" aria-label="零件效果链">${edges.map(([a, b]) => { const [x1, y1] = P(nodes[a]), [x2, y2] = P(nodes[b]); return `<path class="pe" data-l="${nodes[b][2]}" d="M${x1} ${y1} C${x1 + 90} ${y1} ${x2 - 90} ${y2} ${x2} ${y2}"/>`; }).join('')}
        ${nodes.map(n => { const [x, y] = P(n); return `<g class="pn" data-l="${n[2]}" transform="translate(${x} ${y})"><rect x="-44" y="-22" width="88" height="44"/><text y="-3" text-anchor="middle" class="c">${n[0]}</text><text y="13" text-anchor="middle">${n[1]}</text></g>`; }).join('')}</svg>
        <div class="pc-ctl"><label class="mono">ENERGY / 能量 <output>3</output><input type="range" min="1" max="3" value="3"></label>
        <div><button type="button" class="btn small pc-start">左键 · 启动根节点</button><button type="button" class="btn small ghost pc-next">右键 · 推进下一层</button></div>
        <p class="mod-read" aria-live="polite">背包槽位保存零件与连接关系；能量决定分支能继续到哪一层。</p></div></div>`);
    },
    init(el) {
      let lvl = -1; const rg = $('input', el), out = $('.mod-read', el);
      const paint = () => { const e = +rg.value; $$('[data-l]', el).forEach(g => { const l = +g.dataset.l; g.classList.toggle('on', l <= lvl); g.classList.toggle('lock', l > e); }); };
      rg.addEventListener('input', () => { $('output', el).textContent = rg.value; if (lvl > +rg.value) lvl = +rg.value; paint(); });
      $('.pc-start', el).addEventListener('click', () => { lvl = 0; out.textContent = '根节点触发：推进器生效，等待下一层。'; paint(); });
      $('.pc-next', el).addEventListener('click', () => { if (lvl < 0) { out.textContent = '先启动根节点。'; return; } if (lvl >= +rg.value) { out.textContent = '能量不足：分支停在这一层。'; return; } lvl++; out.textContent = `第 ${lvl} 层触发：前序零件的修饰数据影响后续效果。`; paint(); });
      paint();
    }
  };

  M.enemies = {
    html: () => shell('MOD.G3', '预警、判定与阶段变化', '原设计图 · 交互', `
      <div class="en">
        <figure class="en-card"><div class="en-img"><img src="${img('folio-repair/artemis-telegraph-field')}" alt="Elite2 射线前摇预警" loading="lazy"></div><figcaption><b>ELITE 02</b>射线格子先亮起前摇，给玩家避让的机会。</figcaption></figure>
        <figure class="en-card"><div class="en-img"><img class="e1a" src="${img('folio-repair/artemis-elite1-design')}" alt="Elite1 装甲形态" loading="lazy"><img class="e1b" src="${img('folio-repair/artemis-elite1-unarmored')}" alt="Elite1 变身形态" loading="lazy"></div>
          <figcaption><b>ELITE 01</b>血量达到配置门槛时变身，再按距离与冷却选择行动。</figcaption>
          <label class="mono en-hp">HP <output>100%</output><input type="range" min="0" max="100" value="100"></label></figure>
      </div>`),
    init(el) {
      const rg = $('.en-hp input', el), card = rg.closest('.en-card');
      rg.addEventListener('input', () => { $('.en-hp output', el).textContent = rg.value + '%'; card.classList.toggle('phase2', +rg.value <= 50); });
    }
  };

  /* ======================= 游园画境 ======================= */
  M.fan = {
    html: () => shell('WORD → WORLD', '换一个字，园景给出看得懂的反馈', '公开例 · 交互重绘', `
      <div class="fan">${[['雾来水面', 0, '风', '清风散雾'], ['云到天心', 0, '月', '唤出明月']].map(([line, k, rep, fx], i) => `
        <div class="fan-line" data-i="${i}"><p class="v">${[...line].map((c, j) => j === k ? `<button type="button" class="ch" data-rep="${rep}" data-orig="${c}" aria-label="改写「${c}」为「${rep}」">${c}</button>` : `<span>${c}</span>`).join('')}</p><span class="fx mono">${fx}</span></div>`).join('')}
        <div class="fan-scene"><img src="${img('garden-fan')}" alt="原游戏改字操作界面" loading="lazy"><p class="fan-st">点击竖排诗句中可改写的字</p></div></div>`),
    init(el) {
      $$('.ch', el).forEach(b => b.addEventListener('click', () => {
        const on = b.classList.toggle('done'); b.textContent = on ? b.dataset.rep : b.dataset.orig;
        const line = b.closest('.fan-line'); line.classList.toggle('done', on);
        const EXP = ['“雾”描述遮蔽，“风”成为推动变化的条件。玩家不是在填答案，而是把字义的变化交给场景。', '“云”与“月”交换视觉状态。天心的中心位置不变，光源与氛围成为文字操作的反馈。'];
        $('.fan-st', el).textContent = on ? `${line.querySelector('.fx').textContent}：${EXP[+line.dataset.i]}` : '点击竖排诗句中可改写的字';
      }));
    }
  };

  M.seasons = {
    html: () => shell('MOD.Y2', '秋 → 冬 → 春 → 夏', '原游戏画面', `${tabs(['秋 · 初建', '冬', '春', '夏'], '四季')}
      <div class="layer-stage">${['garden-autumn', 'garden-winter', 'garden-spring', 'garden-summer'].map((n, i) => `<img src="${img(n)}" alt="网师园四季场景 ${i + 1}" loading="lazy" data-i="${i}">`).join('')}<span class="season-kanji" aria-hidden="true">秋</span></div>`),
    init(el) { const k = '秋冬春夏'; bindTabs(el, i => { $$('.layer-stage img', el).forEach(x => x.classList.toggle('on', +x.dataset.i === i)); $('.season-kanji', el).textContent = k[i]; }); }
  };

  M.gardenPipeline = {
    html: () => shell('MOD.Y3', '我负责的模块', '重绘示意', steps([['场景探索', '玩家移动与触点', 'target'], ['NPC 交互', '对话触发与状态', 'node'], ['摄像机', '视角控制与过渡', 'eye'], ['小程序适配', '输入与运行环境改写', 'chip']], { cls: 'h' }))
  };

  /* ======================= 天命 ======================= */
  M.dualLine = {
    html: () => {
      const ev = { 1: '追查父母 · 进入竞技', 6: '阿鸮陨落 · 断裂', 7: '身份揭示', 9: '三方融合', 10: '归位与告别' };
      return shell('MOD.T1', '明线寻亲，暗线寻名', '剧集结构 · 重绘', `
        <div class="dl"><div class="dl-lane a"><span class="dl-name">明线<small>星辰寻找父母失踪的真相</small></span></div><div class="dl-lane b"><span class="dl-name">暗线<small>阿鸮找回自己的名字</small></span></div>
        <div class="dl-eps">${Array.from({ length: 10 }, (_, i) => `<button type="button" data-ep="${String(i + 1).padStart(2, '0')}" class="${ev[i + 1] ? 'key' : ''}${i + 1 >= 9 ? ' merge' : ''}"><img src="${img(`bronze-ep${String(i + 1).padStart(2, '0')}-${({ 6: 2, 7: 2 })[i + 1] || 4}`)}" alt="" loading="lazy"><b>${String(i + 1).padStart(2, '0')}</b>${ev[i + 1] ? `<small>${ev[i + 1]}</small>` : ''}</button>`).join('')}</div></div>
        <p class="mod-note">点击任一集，跳到上方播放器观看。剧集顺序以最终汇报与成片为准。</p>`);
    },
    init(el) { $$('.dl-eps button', el).forEach(b => b.addEventListener('click', () => document.dispatchEvent(new CustomEvent('pv:episode', { detail: b.dataset.ep })))); }
  };

  M.triad = {
    html: () => shell('MOD.T2', '器灵设计原则', '原设定 · 重排', `<div class="triad">${[['器', '形', '以器为形', '器物即躯干：鸟形轮廓、纵目面具、剑的器形各成动作方式。', 'bronze-owl-study'], ['纹', '肤', '以纹为肤', '纹饰承担识别，而不是贴在表面的装饰。', 'bronze-spirit'], ['意', '魂', '以意为魂', '历史器物提供原型；能力、人格与剧情属于本剧虚构。', 'bronze-fuhao']].map(([a, b, t, d, n]) => `
      <figure class="tri"><div class="tri-img"><img src="${img(n)}" alt="${t}" loading="lazy"></div><p class="tri-k" aria-hidden="true">${a}<span>${b}</span></p><figcaption><b>${t}</b>${d}</figcaption></figure>`).join('')}</div>`)
  };

  M.bronzePipeline = {
    html: () => shell('MOD.T3', '从角色参考，到能连续观看的镜头', '制作流程 · 重绘', `${steps([['人设参考', '三视图 · 常服 / 战斗 / 融合', 'pen'], ['分镜', '多轮镜头规划', 'frame'], ['首尾帧生成', 'Seedance', 'bolt'], ['人工审看', '一致性 · 动作衔接', 'eye'], ['配音与声音', '声音处理', 'bars'], ['剪辑合成', 'AE · DaVinci', 'film']], { cls: 'h loop' })}<p class="loop-note">${I('chev')} 审看不通过 → 回到生成：重新生成、首尾帧约束与局部返修</p>`)
  };

  /* ======================= TENNISATOM ======================= */
  M.tennisPaths = {
    html: () => shell('MOD.N1', '同一份素材，两条制作路径', '产品流程 · 重绘', `${tabs(['一键成片', '定制成片'], '制作路径')}<div class="tp"></div>`),
    init(el) {
      const A = [['上传视频', '', 'film'], ['动作分析', 'MediaPipe · 球路', 'chip'], ['自动成片', '模板与节奏', 'bolt'], ['观看与分享', '横竖屏', 'ne']];
      const B = [['上传视频', '', 'film'], ['动作分析', 'MediaPipe · 球路', 'chip'], ['风格选择', '关键词 · 色彩 · 节奏', 'pen'], ['精修', '片段与文字', 'frame'], ['观看与分享', '横竖屏', 'ne']];
      bindTabs(el, i => { $('.tp', el).innerHTML = steps(i ? B : A, { cls: 'h' }); });
    }
  };

  M.tennisPipeline = {
    html: () => shell('MOD.N2', '三路信号汇入 MatchBundle', '原技术方案 · 重绘', `
      <div class="tb">
        <div class="tb-col">${[['骨骼', 'MediaPipe 33 点'], ['球路', 'TrackNetV2'], ['音频', '击球峰值']].map(([a, b]) => `<div class="tb-in"><b>${a}</b><small>${b}</small></div>`).join('')}</div>
        <div class="tb-mid"><span class="mono">事件交叉匹配 · 时间索引</span><div class="tb-core">MATCH<br>BUNDLE</div><span class="mono">共同数据契约</span></div>
        <div class="tb-col">${[['特效包络', 'ADSR · 冲击 / 轨迹'], ['个性化内容', '关键词 · 动态文字'], ['多轨合成', 'OpenCV / Remotion']].map(([a, b]) => `<div class="tb-in out"><b>${a}</b><small>${b}</small></div>`).join('')}</div>
      </div><p class="mod-note">原技术方案重绘，不代表算法性能测试。</p>`)
  };

  M.tennisLayers = {
    html: () => shell('MOD.N3', '把同一动作拆成可组合的视觉层', '原透明图层', `
      <div class="tl"><div class="tl-stage">${[['tennis-base', '真人底片'], ['tennis-skeleton', '骨骼'], ['tennis-analysis', '分析标注'], ['tennis-fx', '特效']].map(([n, t], i) => `<img src="${img('composition/' + n)}" alt="${t}图层" data-i="${i}" class="on" loading="lazy">`).join('')}</div>
      <div class="tl-ctl">${[['真人底片', 'BASE'], ['骨骼', 'SKELETON'], ['分析标注', 'ANALYSIS'], ['冲击特效', 'FX']].map(([t, e], i) => `<label><input type="checkbox" checked data-i="${i}"><span><b>${e}</b>${t}</span></label>`).join('')}
      <p class="mod-note">原项目透卡图层在网页中重新组合；开关查看技术信息如何进入肖像构图。</p></div></div>`),
    init(el) { $$('input', el).forEach(c => c.addEventListener('change', () => $(`.tl-stage img[data-i="${c.dataset.i}"]`, el).classList.toggle('on', c.checked))); }
  };

  M.tennisFilms = {
    html: () => shell('MOD.N4', '五位球员，五支成片', '原成片', `<div class="tf"><video controls preload="none" playsinline poster="${img('tennis-real-1')}"><source src="media/tennis-1.mp4" type="video/mp4"></video>
      <div class="tf-list">${[1, 2, 3, 4, 5].map(n => `<button type="button" data-n="${n}" aria-pressed="${n === 1}"><img src="${img('tennis-real-' + n)}" alt="" loading="lazy"><b>0${n}</b></button>`).join('')}</div></div>`),
    init(el) { const v = $('video', el); $$('.tf-list button', el).forEach(b => b.addEventListener('click', () => { $$('.tf-list button', el).forEach(x => x.setAttribute('aria-pressed', x === b)); v.poster = img('tennis-real-' + b.dataset.n); $('source', v).src = `media/tennis-${b.dataset.n}.mp4`; v.load(); v.play().catch(() => {}); })); }
  };

  M.tennisStyles = {
    html: () => shell('MOD.N5', '同一份依据，四种影像语气', '原汇报', `<div class="ts"><img src="${img('refinement/tennis-report-20')}" alt="原汇报：四种风格" loading="lazy">
      <ul>${[['静默档案', '克制、留白，像一份个人记录'], ['律动波纹', '节奏驱动，声音与画面同步起伏'], ['几何决策', '线条与角度，突出判断与路线'], ['热烈球场', '高饱和与冲击，强调爆发力']].map(([a, b], i) => `<li><span class="mono">STYLE.0${i + 1}</span><b>${a}</b>${b}</li>`).join('')}</ul></div>
      <p class="mod-note">风格改变的是表达语言，不改写测量；不是人格分类。</p>`)
  };

  /* ======================= GROWTH COMPASS ======================= */
  M.journey = {
    html: () => shell('MOD.C1', '两条相连的学习旅程', '服务方案 · 重绘', `${tabs(['课外 · 选课旅程', '课中 · 作业旅程'], '旅程')}<div class="jr"></div><p class="mod-note">方案中的满意度表达目标体验，不是已完成的效果测量；AI 预审属于服务设想。</p>`),
    init(el) {
      const A = [['兴趣探索', '我到底想学什么？', 'star'], ['课程预览', '能力指向先看清', 'eye'], ['模块试听', '先体验再选择', 'play'], ['选择调整', '允许试错', 'flow'], ['成长档案', '记录兴趣变化', 'stack']];
      const B = [['任务理解', '作业要求有支架', 'target'], ['逻辑画布', '拆解思路', 'pen'], ['Agent 预审', '服务设想', 'chip'], ['人工反馈', '教师与朋辈', 'node'], ['作品交付', '进入档案', 'ne']];
      bindTabs(el, i => { $('.jr', el).innerHTML = steps(i ? B : A, { cls: 'h' }); });
    }
  };

  /* ======================= LOOPLAB ======================= */
  M.loopHub = {
    html: () => {
      const mods = [['材料交换', 'flow'], ['制作预约', 'chip'], ['小量团购', 'stack'], ['项目档案', 'film'], ['校园取件', 'target']];
      return shell('MOD.L1', '五类模块，连接一次材料需求', 'MVP 方案 · 重绘', `<div class="hub"><svg class="hub-ring" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="38"/><circle cx="50" cy="50" r="46" class="dash"/></svg>
        <div class="hub-core"><span class="mono">ONE REQUEST</span><b>一次材料需求</b><small>通知承担跨模块提醒</small></div>
        ${mods.map(([t, ic], i) => `<div class="hub-n" style="--a:${i * 72 - 90}deg">${I(ic)}<b>${t}</b></div>`).join('')}</div>`);
    }
  };

  M.loopFlow = {
    html: () => shell('MOD.L2', '线上结束后，服务仍在继续', '服务流程 · 重绘', `
      <div class="lanes"><div class="lane-row"><span class="lane-tag">ONLINE<small>线上</small></span>${steps([['发布 / 预约', '材料信息与文件'], ['确认', '匹配材料与资源']], { cls: 'h' })}</div>
      <div class="lane-row dark"><span class="lane-tag">OFFLINE<small>线下</small></span>${steps([['制作', '制作资源与时间'], ['校园取件', '取件地图 · 自提']], { cls: 'h' })}</div></div>`)
  };

  /* ---- RallyLens: 12-DPE eight-dimension event matrix (native, from exported events) ---- */
  M.rallyMatrix = {
    html: () => shell('EVENT ATLAS', '从一个事件，读到一段交换', '原数据', `
      <div class="rm-pick" role="group" aria-label="选择 DPE 片段"></div>
      <div class="rm-head"><p class="rm-title"></p><div class="rm-count"></div><div class="rm-mode" role="group" aria-label="模型层"><button type="button" aria-pressed="true" data-m="offer">○ Offer · 来球条件</button><button type="button" aria-pressed="false" data-m="actual">■ Actual · 回应实现</button></div></div>
      <div class="rm-grid" aria-live="polite"></div>
      <div class="rm-scale"><span>0</span><i></i><span>100</span><span class="rm-miss"><i></i>缺失</span></div>
      <p class="mod-note rm-status"></p>
      <details class="rm-table"><summary>查看当前片段数值表</summary><div class="b-table"></div></details>`),
    async init(el) {
      let data; try { data = await load('assets/composition/rally-events.json'); } catch (e) { return; }
      const DIM = [['response_continuity', '回应连续'], ['technique_transition', '技术转换'], ['placement_line_control', '落点线路'], ['spatial_coverage', '空间覆盖'], ['movement_demand', '移动需求'], ['recovery_readiness', '回位准备'], ['rhythm_stability_variation', '节奏变化'], ['decision_pressure', '决策压力']];
      const ids = [...new Set(data.map(d => d.dpe_id))];
      let id = 'DPE_G01_02', mode = 'offer';
      const pick = $('.rm-pick', el);
      pick.innerHTML = ids.map(x => `<button type="button" data-id="${x}" aria-pressed="${x === id}">${x.replace('DPE_', '')}<small>${data.filter(d => d.dpe_id === x).length}</small></button>`).join('');
      const shape = d => d.direction === 'A_to_B' ? '○' : d.direction === 'B_to_A' ? '□' : '◇';
      const col = v => { const t = Math.max(0, Math.min(1, v / 100)); return `color-mix(in srgb, var(--cobalt) ${Math.round(8 + t * 92)}%, var(--sheet))`; };
      const draw = () => {
        const ev = data.filter(d => d.dpe_id === id).sort((a, b) => a.event_time_a_s - b.event_time_a_s);
        const f = ev[0];
        $('.rm-title', el).innerHTML = `<b>${id.replace('DPE_', '')}</b> / SESSION ${f.session_no} / STAGE ${f.stage_id}<br><span>${ev.length} 次事件，方向分别保留。</span>`;
        const n = k => ev.filter(d => d.direction === k).length;
        $('.rm-count', el).innerHTML = `<span>○ A→B <b>${n('A_to_B')}</b></span><span>□ B→A <b>${n('B_to_A')}</b></span><span>◇ 未定 <b>${ev.length - n('A_to_B') - n('B_to_A')}</b></span>`;
        let miss = 0;
        const rows = DIM.map(([k, name]) => `<div class="rm-row"><span class="rm-dim">${name}</span>${ev.map((d, i) => { const v = d[`${mode}_${k}`]; if (v == null) { miss++; return `<i class="miss" title="事件${i + 1} / ${name} / 缺失"></i>`; } return `<i style="background:${col(v)}" title="事件${i + 1} / ${name} / ${v.toFixed(2)}"></i>`; }).join('')}</div>`).join('');
        const grid = $('.rm-grid', el);
        grid.innerHTML = `<div class="rm-row rm-ev"><span class="rm-dim">${mode === 'offer' ? 'OFFER' : 'ACTUAL'}</span>${ev.map((d, i) => `<b>${i + 1}<small>${shape(d)}</small></b>`).join('')}</div>${rows}`;
        grid.style.setProperty('--cols', ev.length);
        const none = ev.filter(d => d.actual_status === 'observed_no_response_zero').length, unk = ev.filter(d => d.actual_status === 'not_observable_unknown').length;
        $('.rm-status', el).textContent = `证据状态：${none} 条事件为“未出现可观察回应”，${unk} 条无法观察；当前 ${mode === 'offer' ? 'Offer' : 'Actual'} 的 ${ev.length * 8} 个单元中 ${miss} 个缺失。先看圆 / 方交替，再沿行看同一维度。列宽只表示顺序，不表示时间间隔；模型尺度描述条件，不评价搭档或关系。`;
        $('.rm-table .b-table', el).innerHTML = `<table><thead><tr><th>事件 / 源时间 s</th>${DIM.map(d => `<th>${d[1]}</th>`).join('')}</tr></thead><tbody>${ev.map((d, i) => `<tr><td>${i + 1} ${shape(d)} / ${d.event_time_a_s.toFixed(3)}</td>${DIM.map(([k]) => { const v = d[`${mode}_${k}`]; return `<td>${v == null ? '—' : v.toFixed(2)}</td>`; }).join('')}</tr>`).join('')}</tbody></table>`;
      };
      $$('button', pick).forEach(b => b.addEventListener('click', () => { id = b.dataset.id; $$('button', pick).forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); }));
      $$('.rm-mode button', el).forEach(b => b.addEventListener('click', () => { mode = b.dataset.m; $$('.rm-mode button', el).forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); }));
      draw();
    }
  };

  /* ---- Privacy City: 48-feature atlas (names & groups from feature_engine.py) ---- */
  const FG = [['A', '行为节奏', 8, '点击、滚动与决定的时间模式。'], ['B', '阅读行为', 8, '停留、完成、回看与条款参与。'], ['C', '风险偏好', 10, '试探问题与不同权限的拒绝倾向。'], ['D', '情境特征', 8, '设备、时间压力、资源和社交情境。'], ['E', '时序演变', 6, '决定时间、疲劳与阅读深度的变化。'], ['F', '交互效应', 8, '阅读×风险、疲劳×稀缺等交叉特征。']];
  M.featureAtlas = {
    html: () => shell('FEATURE ATLAS', '把行为，组织成可以检查的输入', '原数据', `
      <div class="fa"><div class="fa-grid" role="group" aria-label="48 个输入字段"></div>
      <div class="fa-side"><div class="fa-groups" role="group" aria-label="特征分组"></div><p class="fa-g"></p><p class="fa-name mono"></p><p class="mod-note">原始记录 → 归一化 [0,1] → 输入向量</p></div></div>`),
    async init(el) {
      let names; try { names = await load('assets/composition/privacy-features.json'); } catch (e) { return; }
      const groupOf = i => { let n = 0; for (const g of FG) { n += g[2]; if (i < n) return g; } return FG[FG.length - 1]; };
      const grid = $('.fa-grid', el), gs = $('.fa-groups', el);
      grid.innerHTML = names.map((f, i) => `<button type="button" data-i="${i}" data-g="${groupOf(i)[0]}"><b>${groupOf(i)[0]}</b>${String(i + 1).padStart(2, '0')}</button>`).join('');
      gs.innerHTML = FG.map(g => `<button type="button" data-g="${g[0]}">${g[0]} / ${g[1]} <small>${g[2]}</small></button>`).join('');
      const show = i => {
        const g = groupOf(i);
        $$('.fa-grid button', el).forEach(b => { b.classList.toggle('on', +b.dataset.i === i); b.classList.toggle('grp', b.dataset.g === g[0]); });
        $$('.fa-groups button', el).forEach(b => b.setAttribute('aria-pressed', b.dataset.g === g[0]));
        $('.fa-g', el).innerHTML = `<b>${g[0]} / ${g[1]} / ${g[2]} FEATURES</b>${g[3]}`;
        $('.fa-name', el).textContent = `${String(i + 1).padStart(2, '0')} · ${names[i]}`;
      };
      $$('.fa-grid button', el).forEach(b => b.addEventListener('click', () => show(+b.dataset.i)));
      $$('.fa-groups button', el).forEach(b => b.addEventListener('click', () => show(names.findIndex((_, i) => groupOf(i)[0] === b.dataset.g))));
      show(0);
    }
  };

  /* ---- Pitch / Impact: contact grid & scatter, from the submitted site's CSV export ---- */
  const BB = () => load('assets/baseball-records.json');
  M.contactGrid = {
    html: () => shell('CONTACT FIELD', '击球初速 × 仰角 · 区间计数', '原数据', `
      <div class="cg-ctl"><div class="cg-years" role="group" aria-label="年份">${['2024', '2025', '2026'].map((y, i) => `<button type="button" data-y="${y}" aria-pressed="${!i}">${y}</button>`).join('')}</div>
      <label class="cg-sel">结果 <select><option value="all">全部逐球记录</option><option value="home_run">本垒打</option><option value="hit">安打（含本垒打）</option><option value="out">出局结果</option></select></label></div>
      <div class="cg"><div class="cg-grid"></div><dl class="cg-stats"></dl></div>
      <p class="mod-note">同一份大谷打者 CSV。每格 10 mph × 10°，范围 0—130 mph、−50°—90°；数字为有效接触记录数，点表示零。颜色随当前筛选的最大计数归一，最大值始终标出。不重建三维飞行轨迹；缺失与范围外单列。2026 只代表源文件覆盖期。</p>`),
    async init(el) {
      let raw; try { raw = await BB(); } catch (e) { return; }
      let year = '2024'; const sel = $('select', el);
      const isHit = r => ['single', 'double', 'triple', 'home_run'].includes(r.events);
      const isOut = r => ['field_out', 'force_out', 'grounded_into_double_play', 'double_play', 'sac_fly', 'sac_bunt', 'fielders_choice_out'].includes(r.events);
      const draw = () => {
        const res = sel.value, recs = raw.bat.filter(r => r.game_date.startsWith(year));
        const sub = recs.filter(r => res === 'all' || (res === 'home_run' && r.events === 'home_run') || (res === 'hit' && isHit(r)) || (res === 'out' && isOut(r)));
        const valid = sub.filter(r => Number.isFinite(r.launch_speed) && Number.isFinite(r.launch_angle));
        const inside = valid.filter(r => r.launch_speed >= 0 && r.launch_speed < 130 && r.launch_angle >= -50 && r.launch_angle < 90);
        const g = Array.from({ length: 14 }, () => Array(13).fill(0));
        inside.forEach(r => g[Math.floor((r.launch_angle + 50) / 10)][Math.floor(r.launch_speed / 10)]++);
        const max = Math.max(1, ...g.flat());
        let h = '<div class="cg-row cg-ax"><span>° / mph</span>' + Array.from({ length: 13 }, (_, c) => `<b>${c * 10}</b>`).join('') + '</div>';
        for (let r = 13; r >= 0; r--) h += `<div class="cg-row"><span>${r * 10 - 50}</span>${g[r].map(v => v ? `<i style="background:color-mix(in srgb,var(--cobalt) ${Math.round(12 + v / max * 88)}%,var(--sheet));color:${v / max > .5 ? '#fff' : 'var(--ink)'}" title="${v}">${v}</i>` : '<i class="z">·</i>').join('')}</div>`;
        $('.cg-grid', el).innerHTML = h;
        $('.cg-stats', el).innerHTML = [[inside.length, '进入网格的接触记录'], [sub.length, '当前筛选'], [sub.length - valid.length, '速度 / 角度缺失'], [valid.length - inside.length, '范围外'], [max === 1 && !inside.length ? 0 : max, '最大单格']].map(([v, l]) => `<div><dt>${l}</dt><dd>${v.toLocaleString()}</dd></div>`).join('');
      };
      $$('.cg-years button', el).forEach(b => b.addEventListener('click', () => { year = b.dataset.y; $$('.cg-years button', el).forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); }));
      sel.addEventListener('change', draw);
      draw();
    }
  };

  M.pitchScatter = {
    html: () => shell('STATCAST', '把每一球，放回空间', '原数据', `
      <div class="ps-ctl"><div class="ps-views" role="group" aria-label="视图">${['山本 · 投球落点', '山本 · 位移分布', '大谷 · 击球速度 × 仰角'].map((t, i) => `<button type="button" data-v="${i}" aria-pressed="${!i}">${t}</button>`).join('')}</div>
      <label class="cg-sel">年份 <select class="ps-year"><option value="all">全部源记录</option><option>2024</option><option>2025</option><option>2026</option></select></label>
      <label class="cg-sel">球种 <select class="ps-type"><option value="all">全部球种</option>${['CU', 'FC', 'FF', 'FS', 'SI', 'SL', 'ST'].map(t => `<option>${t}</option>`).join('')}</select></label></div>
      <div class="ps"><canvas width="900" height="680" aria-label="逐球散点图"></canvas><div class="ps-side"><p class="ps-who mono"></p><h4 class="ps-title"></h4><p class="ps-n"></p><p class="ps-read"></p><div class="ps-legend"></div></div></div>
      <p class="mod-note">数据直接来自提交网站的山本、大谷逐球 CSV。每个点是一条有效记录；缺失坐标不补零，筛选后的有效数与总数分开列出。2026 只覆盖文件已有日期，不代表完整赛季。</p>`),
    async init(el) {
      let raw; try { raw = await BB(); } catch (e) { return; }
      const V = [['plate_x', 'plate_z', '水平落点 / ft', '垂直落点 / ft', '投球位置', '位置散点呈现球种与落点范围，不把一个统一方框冒充每位打者的实际好球带。', 'pitch', 'YOSHINOBU YAMAMOTO'], ['pfx_x', 'pfx_z', '水平位移 / ft', '垂直位移 / ft', '球路位移', '用相同坐标系比较球种的位移分布；这不是三维轨迹重建。', 'pitch', 'YOSHINOBU YAMAMOTO'], ['launch_angle', 'launch_speed', '击球仰角 / °', '击球初速 / mph', '击球结果', '只显示同时有击球速度与仰角的接触记录；没有发生击球的球不作为零值进入图中。', 'bat', 'SHOHEI OHTANI']];
      const TYPES = ['CU', 'FC', 'FF', 'FS', 'SI', 'SL', 'ST'];
      const css = getComputedStyle(el), C = ['#1f3bff', '#0d1020', '#5aaeff', '#0d1a8f', '#8e9ab8', '#2f8cff', '#a8c3ff'];
      let v = 0; const cv = $('canvas', el), ctx = cv.getContext('2d');
      const draw = () => {
        const [kx, ky, lx, ly, title, read, src, who] = V[v], yr = $('.ps-year', el).value, ty = $('.ps-type', el).value;
        const rows = raw[src].filter(r => (yr === 'all' || r.game_date.startsWith(yr)) && (ty === 'all' || r.pitch_type === ty));
        const ok = rows.filter(r => Number.isFinite(r[kx]) && Number.isFinite(r[ky]));
        const xs = ok.map(r => r[kx]), ys = ok.map(r => r[ky]);
        const pad = (a, b) => { const d = (b - a) * .06 || 1; return [a - d, b + d]; };
        const [x0, x1] = pad(Math.min(...xs), Math.max(...xs)), [y0, y1] = pad(Math.min(...ys), Math.max(...ys));
        const L = 70, R = 20, T = 20, B = 60, W = cv.width - L - R, Hh = cv.height - T - B;
        const X = x => L + (x - x0) / (x1 - x0) * W, Y = y => T + Hh - (y - y0) / (y1 - y0) * Hh;
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.strokeStyle = 'rgba(13,16,32,.14)'; ctx.fillStyle = '#7d8399'; ctx.font = '500 18px ui-monospace,Consolas,monospace'; ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) { const gx = L + W * i / 4, gy = T + Hh * i / 4; ctx.beginPath(); ctx.moveTo(gx, T); ctx.lineTo(gx, T + Hh); ctx.moveTo(L, gy); ctx.lineTo(L + W, gy); ctx.stroke(); ctx.textAlign = 'center'; ctx.fillText((x0 + (x1 - x0) * i / 4).toFixed(1), gx, T + Hh + 26); ctx.textAlign = 'right'; ctx.fillText((y1 - (y1 - y0) * i / 4).toFixed(1), L - 10, gy + 6); }
        ctx.fillStyle = '#0d1020'; ctx.textAlign = 'center'; ctx.font = '600 18px Inter Tight,PingFang SC,sans-serif'; ctx.fillText(lx, L + W / 2, cv.height - 10);
        ctx.save(); ctx.translate(18, T + Hh / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(ly, 0, 0); ctx.restore();
        ctx.globalAlpha = ok.length > 2000 ? .35 : .6;
        ok.forEach(r => { ctx.fillStyle = C[Math.max(0, TYPES.indexOf(r.pitch_type)) % C.length]; ctx.beginPath(); ctx.arc(X(r[kx]), Y(r[ky]), 3.2, 0, 7); ctx.fill(); });
        ctx.globalAlpha = 1;
        $('.ps-who', el).textContent = who; $('.ps-title', el).textContent = title;
        $('.ps-n', el).innerHTML = `<b>${ok.length.toLocaleString()}</b> 有效点 / 筛选记录 ${rows.length.toLocaleString()} · 坐标缺失 ${(rows.length - ok.length).toLocaleString()} 条`;
        $('.ps-read', el).textContent = read;
        $('.ps-legend', el).innerHTML = TYPES.map((t, i) => `<span><i style="background:${C[i]}"></i>${t}</span>`).join('');
      };
      $$('.ps-views button', el).forEach(b => b.addEventListener('click', () => { v = +b.dataset.v; $$('.ps-views button', el).forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); }));
      $$('select', el).forEach(s => s.addEventListener('change', draw));
      draw();
    }
  };

  /* ---- Artemis: movement rule check (seven-hex demo, rules from the current Hex script) ---- */
  M.hexRules = {
    html: () => {
      const cells = [['C', 0, 0, '◎', '当前格', 'cur'], ['W', 0, -1, 'W', '可行走', 'ok'], ['D', .866, -.5, 'D', '高度差 2', 'high'], ['S', 0, 1, 'S', '不可行走', 'no'], ['A', -.866, -.5, 'A', '可行走', 'ok'], ['SW', -.866, .5, '↙', '可行走', 'ok'], ['SE', .866, .5, '↘', '地图边界', 'edge']];
      const r = 46, cx = 180, cy = 150;
      const hex = (x, y) => Array.from({ length: 6 }, (_, k) => { const a = Math.PI / 3 * k; return `${(x + r * .95 * Math.cos(a)).toFixed(1)},${(y + r * .95 * Math.sin(a)).toFixed(1)}`; }).join(' ');
      return shell('MOVEMENT LAB', '一个指令，先经过规则', '规则演示 · 依据原脚本', `
        <div class="hr"><svg viewBox="0 0 360 300" role="img" aria-label="六边形移动规则示意">${cells.map(([k, dx, dy, t, s, c]) => { const x = cx + dx * r * 1.75, y = cy + dy * r * 1.75; return `<g class="hr-c ${c}" data-k="${k}" tabindex="0" role="button" aria-label="${t} ${s}"><polygon points="${hex(x, y)}"/><text x="${x}" y="${y - 2}" text-anchor="middle" class="t">${t}</text><text x="${x}" y="${y + 16}" text-anchor="middle" class="s">${s}</text></g>`; }).join('')}</svg>
        <div class="hr-side"><div class="keys" role="group" aria-label="移动方向">${['W', 'A', 'S', 'D'].map(k => `<button type="button" data-k="${k}">${k}</button>`).join('')}</div>
        <p class="hr-state mono">WAITING / 等待输入</p><h4 class="hr-h">选择一格，检查移动条件。</h4><p class="hr-p">中心是当前格；目标格不会真的移动，只用来逐项检查规则。</p>
        <ol class="hr-chk"><li>目标格存在且 IsWalkable</li><li>与当前格的高度差 ≤ 1</li><li>满足移动指令的冷却间隔</li></ol>
        <button type="button" class="btn small ghost hr-reset">重置检查</button></div></div>
        <p class="mod-note">格子是作品集里的规则演示，不复原实机关卡。高度差 ≤ 1、IsWalkable 和边界检查依据当前脚本。</p>`);
    },
    init(el) {
      const R = { W: ['VALID / 目标通过', '提交目标 → 起步 → 持续移动', '边界、可行走与高度条件都满足。真实输入还要满足冷却；到达最后一个目标后进入停步。', 'ok'], A: ['VALID / 目标通过', '提交目标 → 起步 → 持续移动', '边界、可行走与高度条件都满足。真实输入还要满足冷却。', 'ok'], SW: ['VALID / 目标通过', '提交目标 → 起步 → 持续移动', '边界、可行走与高度条件都满足。', 'ok'], S: ['REJECTED / 目标未提交', 'IsWalkable 为 false', '这一项检查失败，保持原目标，不发起有效移动。', 'no'], D: ['REJECTED / 目标未提交', '高度差 2，超过允许值 1', '这一项检查失败，保持原目标，不发起有效移动。', 'no'], SE: ['REJECTED / 目标未提交', '超出地图边界', '目标格不存在，输入被忽略。', 'no'], C: ['WAITING / 等待输入', '选择一格，检查移动条件。', '中心是当前格；目标格不会真的移动，只用来逐项检查规则。', ''] };
      const show = k => { const [a, b, c, cls] = R[k] || R.C; $('.hr-state', el).textContent = a; $('.hr-state', el).className = 'hr-state mono ' + cls; $('.hr-h', el).textContent = b; $('.hr-p', el).textContent = c; $$('.hr-c', el).forEach(g => g.classList.toggle('sel', g.dataset.k === k)); };
      $$('.hr-c', el).forEach(g => { g.addEventListener('click', () => show(g.dataset.k)); g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(g.dataset.k); } }); });
      $$('.keys button', el).forEach(b => b.addEventListener('click', () => show(b.dataset.k)));
      $('.hr-reset', el).addEventListener('click', () => show('C'));
      el.tabIndex = 0; el.addEventListener('keydown', e => { const k = e.key.toUpperCase(); if ('WASD'.includes(k) && k.length === 1) { e.preventDefault(); show(k); } });
    }
  };

  /* ---- Artemis: five-node trigger tree (HexSystem / BackpackSlot / ItemComponent) ---- */
  M.buildTree = {
    html: () => {
      const N = [['CLONE ROOT', '根节点', 1, 70, 150], ['NODE 02', '修饰分支 A', 2, 260, 70], ['NODE 03', '修饰分支 B', 4, 260, 230], ['NODE 04', '效果 A', 3, 450, 70], ['NODE 05', '效果 B', 2, 450, 230]];
      const E = [[0, 1], [0, 2], [1, 3], [2, 4]];
      return shell('BUILD / TRIGGER TREE', '同一份能量，沿分支继续', '规则演示 · 依据原脚本', `
        <div class="bt"><svg viewBox="0 0 540 300" role="img" aria-label="五节点构筑树">${E.map(([a, b]) => `<path class="be" data-to="${b}" d="M${N[a][3] + 58} ${N[a][4]} C${N[a][3] + 120} ${N[a][4]} ${N[b][3] - 70} ${N[b][4]} ${N[b][3] - 58} ${N[b][4]}"/>`).join('')}
        ${N.map(([c, n, cost, x, y], i) => `<g class="bn" data-i="${i}" transform="translate(${x} ${y})"><rect x="-58" y="-34" width="116" height="68"/><text y="-12" text-anchor="middle" class="c">${c}</text><text y="6" text-anchor="middle">${n}</text><text y="24" text-anchor="middle" class="e" data-e="${i}">耗能 ${cost}</text></g>`).join('')}</svg>
        <div class="bt-side"><p class="mono bt-legend">○ 等待　● 已执行　× 分支停止</p>
        <label class="mono">初始能量 <output>8</output><input type="range" min="1" max="12" value="8"></label>
        <div class="bt-btns"><button type="button" class="btn small bt-go">左键 · 启动根节点</button><button type="button" class="btn small ghost bt-next">右键 · 推进下一层</button><button type="button" class="btn small ghost bt-reset">重置</button></div>
        <p class="mod-read bt-read" aria-live="polite">等待启动。调整能量，看两个分支怎样继续。</p>
        <dl class="bt-dl"><dt>连接</dt><dd>出口边 → 相邻入口边</dd><dt>数据</dt><dd>currentEnergy / energyCost</dd><dt>传播</dt><dd>outgoingModifier.Clone()</dd></dl></div></div>`);
    },
    init(el) {
      const COST = [1, 2, 4, 3, 2], PARENT = [-1, 0, 0, 1, 2], LAYER = [[0], [1, 2], [3, 4]];
      let layer = -1, state = [], energy = [];
      const rg = $('input', el), out = $('.bt-read', el);
      const paint = () => {
        $$('.bn', el).forEach(g => { const i = +g.dataset.i; g.classList.toggle('done', state[i] === 'done'); g.classList.toggle('stop', state[i] === 'stop'); const t = g.querySelector('[data-e]'); t.textContent = state[i] === 'done' ? `余能 ${energy[i]}` : state[i] === 'stop' ? `× 能量不足` : `耗能 ${COST[i]}`; });
        $$('.be', el).forEach(p => p.classList.toggle('on', state[+p.dataset.to] === 'done'));
      };
      const run = l => {
        let ok = 0, stop = 0;
        LAYER[l].forEach(i => {
          const p = PARENT[i]; if (p >= 0 && state[p] !== 'done') { state[i] = 'stop'; stop++; return; }
          const avail = p < 0 ? +rg.value : energy[p]; // each child receives its own copy
          if (avail < COST[i]) { state[i] = 'stop'; stop++; return; }
          energy[i] = avail - COST[i]; state[i] = 'done'; ok++;
        });
        out.textContent = `第 ${l + 1} 层：${ok} 个节点执行 · ${stop} 个分支停止${l < 2 ? ' · 等待推进下一层' : ' · 全部层级完成'}`;
        paint();
      };
      const reset = () => { layer = -1; state = []; energy = []; out.textContent = '等待启动。调整能量，看两个分支怎样继续。'; paint(); };
      rg.addEventListener('input', () => { $('output', el).textContent = rg.value; reset(); });
      $('.bt-go', el).addEventListener('click', () => { reset(); layer = 0; run(0); });
      $('.bt-next', el).addEventListener('click', () => { if (layer < 0) { out.textContent = '先启动根节点。'; return; } if (layer >= 2) { out.textContent = '已经是最后一层。'; return; } layer++; run(layer); });
      $('.bt-reset', el).addEventListener('click', reset);
      paint();
    }
  };

  /* ---- Growth Compass: dual-journey blueprint (stage rows from the original journey maps) ---- */
  const GJ = {
    course: { name: '课外 · 选择课程', pics: ['growth-course-journey'], stages: [
      ['探索兴趣', '好奇，也不确定自己想学什么。', '手机 H5 · 设计 DNA · 探索潜力图', '进入选课平台，完成兴趣探索；输出“好奇心引力场”，不作能力诊断。', '学生会 / 行政教师 / 校友职业资料', '焦虑 → 好奇', '秀米 / AI 概念'],
      ['预见课程', '课程列表很多，需要看懂能力指向。', '课程星图 · WHY FIRST 预告 · 企业认证', '看 60 秒预告、课程案例和评价，把感兴趣的课加入试听清单。', '教师录制预告 / 学生评价 / 企业参考', '纠结 → 有期待', '网站 / 课程内容'],
      ['低成本试听', '先体验，再判断适不适合。', '开放教室 · 微体验环节', '在开放周做一个小任务；从真实案例和约五分钟的练习判断匹配度。', '教务开放试听 / 教师设计微体验', '兴奋 · 审视', '教室 / 试听机制'],
      ['调整并承诺', '做减法，确认自己的目标。', '选课调整 · 智能换留推荐', '看冲突和时间花费，删掉不合适的课，确认最终课表。', '技术团队 / 学院教务', '笃定 · 确认', '选课逻辑 / Plan B'],
      ['成长留存', '回看一学期学到了什么。', '能力星图 · 成长节点', '课程结束后点亮成长节点，回看能力路径，作为下一轮选课的依据。', '平台维护 / 学习档案', '充实 · 回顾', '网站 / 成长记录']] },
    learn: { name: '课中 · 完成作业', pics: ['growth-learning-journey'], stages: [
      ['理解任务', '理解老师布置的模糊课题。', '任务书 · 行业标准 · 课程平台', '听课题导入、浏览资源库，明确任务目标、约束和评价尺度。', '课程教师 / 企业校友', '困惑 · 找入口', '任务书 / 平台'],
      ['强制支架', '想开始设计，但不知道从哪下手。', '正反案例 · 设计逻辑 · 设计目标', '先填逻辑画布：目标、痛点、核心策略；对照案例自查，再启用 Agent。', '技术团队 / 教务 / 案例库', '受阻 → 有结构', '逻辑画布'],
      ['即时预审', '确认草稿的基本要求，避免低级错误。', '线上朋辈导师 Agent', '上传基于画布完成的草稿；看对齐、信息完整性等检查，先改掉基础问题。', '朋辈导师 Agent 概念', '确认 · 初步安心', '预审规则 / 案例'],
      ['深入诊断', '拿到老师意见后继续改。', '课程汇报 · Agent 深度交流', '把老师建议带回迭代；结合行业参考与案例，讨论方案更深一层的逻辑。', '老师 / 朋辈导师 Agent', '挑战 · 深入交流', '教师意见 / 诊断'],
      ['自信交付', '提交作品，得到评价和认可。', '结课成果 · 展示 · 作品档案', '按诊断修改后提交；参加期末讲评，记下这门课的技能与成果。', '教师 / 校友共同反馈', '完成 · 成就感', '个人作品 / 档案']] }
  };
  M.blueprint = {
    html: () => shell('SERVICE BLUEPRINT', '选课与作业，共用一条成长线', '原方案 · 重排', `
      <div class="bp-top">${tabs([GJ.course.name, GJ.learn.name], '旅程')}</div>
      <div class="bp-scroll"><table class="bp"><thead><tr><th>阶段 / STAGE</th></tr></thead><tbody></tbody></table></div>
      <p class="mod-note">依据原课外、课中旅程图，重排为五阶段 × 多层蓝图。情绪一行是原方案的目标体验描述，不是测量过的满意度。“Agent”属于服务设想，没有开发成 AI 系统。</p>`),
    init(el) {
      const ROWS = ['目标与心态', '触点与渠道', '用户行动', '后台与责任', '情绪 / 目标', '工具与资源'];
      let cur = 0;
      const draw = k => {
        const J = k ? GJ.learn : GJ.course;
        $('.bp thead tr', el).innerHTML = `<th>阶段 / STAGE</th>${J.stages.map((s, i) => `<th><button type="button" data-c="${i}"><b>${String(i + 1).padStart(2, '0')}</b>${s[0]}</button></th>`).join('')}`;
        $('.bp tbody', el).innerHTML = ROWS.map((r, ri) => `<tr><th>${r}</th>${J.stages.map((s, i) => `<td data-c="${i}">${s[ri + 1]}</td>`).join('')}</tr>`).join('');
        const sel = c => { cur = c; $$('[data-c]', el).forEach(x => x.classList.toggle('on', +x.dataset.c === c)); };
        $$('thead button', el).forEach(b => b.addEventListener('click', () => sel(+b.dataset.c)));
        sel(0);
      };
      bindTabs(el, draw);
    }
  };

  /* ---- Growth Compass: original system pages with role locator ---- */
  const ROLES = {
    in: { img: 'folio-repair/growth-system-page38', title: '课中 / 作业与支持 · 原页 38', roles: [
      ['学生', 803, 732, '学生与 Agent、学生与教师之间各有不同来向；建议进入作业，修改结果再回到支持过程。', '学生与作业数据独立相连。每条箭头与旁边文字共同说明这段关系。'],
      ['朋辈导师 Agent', 656, 444, '原稿连接作业读取、作业反馈、案例与行业尺度，各条箭头保留自己的方向与文字。', '“读取”是连线上的行为说明，不据此翻转原图的箭头。'],
      ['教师', 803, 512, '教师、Agent、案例与行业标准共同参与作业支持；学生基于教师建议继续迭代。', '“给出建议”和“学生带回修改”是两条关系，不能只留教师指向学生的一条线。'],
      ['学院', 803, 236, '原图保留课程目标、设计技能树、平台支持，以及与企业校友的联系。', '学院、教师和社会资源不合并成一个抽象的“后台”。'],
      ['技术 / AI 预审模型', 332, 323, 'AI 预审模型与 Agent 的联系是虚线；正反案例向模型提供直接数据。', '实线、虚线按原图保留，不统一画成同一种依赖箭头。'],
      ['企业 / 校友', 1170, 405, '场地、资金、政策支持与行业经验的介入，分别在不同的连线上。', '企业校友与学院、行业标准之间的联系保留各自路径。'],
      ['正反案例', 552, 522, '案例与教师共同参与质量确定，同时连接 AI 预审模型和作业参考。', '案例库不只是一条指向学生的内容输出。'],
      ['设计方法论 / 行业标准', 1029, 539, '同时连接企业校友、教师与 Agent，承担教学和作业判断的不同参考。', '行业经验与课程对标依据的文字标注保留在主图上。'],
      ['作业数据', 656, 624, '作业数据是原稿中的独立节点，连接提交、读取和案例参考。', '保留虚线箭头和旁边的文字，不用一个“数据库”图标替代这些关系。']] },
    pre: { img: 'folio-repair/growth-system-page32', title: '课前 / 选课与课程资源 · 原页 32', roles: [
      ['学生', 777, 700, '学生与网站之间保留课程要点、使用与偏好数据、课程反馈等不同方向。', '课程体验、工作坊与 mentorship 也保留各自来源。'],
      ['网站', 533, 493, '网站承接课程信息与学生反馈，还连接学院教务和学生会的开发维护。', '学生与网站、网站与教务的往返路线分别呈现，不合并成一条单向箭头。'],
      ['教课老师', 777, 484, '课程意义、总体气质、工作坊和课程内容放在各自的连接上。', '与校友、学院行政和学生的往返关系按原图阅读。'],
      ['学院老师', 777, 330, '原图单列的角色，保留在学院内部轴上。', '不擅自和“教课老师”合并。'],
      ['学院教务', 778, 217, '保留学生选课信息、学分认定、课程介绍与试听模块规划。', '网站与教务之间的上行、下行路径含义不同。'],
      ['学院行政', 778, 127, '内容需求、系统功能需求、资金和人力资源分别标注。', '与学生会、教课老师、名企校友的路径保持独立。'],
      ['学生会', 427, 390, '保留开发维护、mentorship，以及与学院行政的双向交换。', '资金、需求和人力资源的符号不压缩成一个“支持”标签。'],
      ['名企校友', 1142, 386, '行业标准、专业建议、企业资源和课程内容有不同的方向与来源。', '感谢资金、储备人才等关系也在完整原图中保留。']] }
  };
  M.systemMap = {
    html: () => shell('SERVICE SYSTEM', '教学支持，不是单向交付', '原页 · 角色导读', `
      ${tabs(['课中 / 作业与支持', '课前 / 选课与课程资源'], '系统图')}
      <div class="sm"><div class="sm-stage"><div class="sm-zoom"><svg viewBox="0 0 1600 900" role="img" aria-label="原系统图"><image width="1600" height="900"/><circle class="ring" r="34"/></svg></div></div>
      <div class="sm-side"><div class="sm-z" role="group" aria-label="缩放">${['总览', '150%', '200%'].map((t, i) => `<button type="button" data-z="${[1, 1.5, 2][i]}" aria-pressed="${!i}">${t}</button>`).join('')}</div>
      <div class="sm-roles" role="group" aria-label="角色定位"></div><div class="mod-read sm-read" aria-live="polite">选一个角色，在原图上定位，再读它的每一条关系。</div>
      <p class="mod-note">单向：按箭头与原文阅读 · 往返：两个方向分别保留 · 虚线：原稿中的间接关系。</p><a class="mono sm-full" target="_blank" rel="noopener">打开 4000px 原页 ↗</a></div></div>
      <p class="mod-note">源于《最终汇报》课前系统图（第 32 页）与课中系统图（第 38 页）。主图是完整原页：不裁图例、不重写箭头、不合并往返路线。蓝色定位圈和右侧文字是新增导读，不属于原图。</p>`),
    init(el) {
      let set = ROLES.in, z = 1, rx = 800, ry = 450;
      const svg = $('.sm-zoom svg', el), ring = $('.ring', el), zoom = $('.sm-zoom', el);
      const apply = () => { zoom.style.transform = `scale(${z})`; zoom.style.transformOrigin = `${rx / 16}% ${ry / 9}%`; };
      const pick = i => {
        const [n, x, y, a, b] = set.roles[i]; rx = x; ry = y;
        ring.setAttribute('cx', x); ring.setAttribute('cy', y); ring.classList.add('on');
        $$('.sm-roles button', el).forEach((btn, k) => btn.setAttribute('aria-pressed', k === i));
        $('.sm-read', el).innerHTML = `<b>${n}</b>${a}<br><small>${b}</small>`; apply();
      };
      const load = k => {
        set = k ? ROLES.pre : ROLES.in; ring.classList.remove('on');
        $('image', svg).setAttribute('href', img(set.img)); $('.sm-full', el).href = img(set.img);
        $('.sm-roles', el).innerHTML = set.roles.map((r, i) => `<button type="button" data-i="${i}">${r[0]}</button>`).join('');
        $$('.sm-roles button', el).forEach(b => b.addEventListener('click', () => pick(+b.dataset.i)));
        $('.sm-read', el).textContent = '选一个角色，在原图上定位，再读它的每一条关系。'; rx = 800; ry = 450; apply();
      };
      $$('.sm-z button', el).forEach(b => b.addEventListener('click', () => { z = +b.dataset.z; $$('.sm-z button', el).forEach(x => x.setAttribute('aria-pressed', x === b)); apply(); }));
      bindTabs(el, load);
    }
  };

  /* ---- LoopLab: material hand-off walkthrough (concept states only, no real orders) ---- */
  M.handoff = {
    html: () => shell('MATERIAL HANDOFF', '一次需求，从规格开始', '概念演示', `
      <div class="ho"><div class="ho-ticket"><p class="mono">LOOPLAB · TICKET</p>
        <label class="cg-sel">选择材料类别 <select><option>板材 / 模型制作</option><option>纸材 / 印刷与装订</option><option>耗材 / 制作预约</option></select></label>
        <dl><dt>需核对</dt><dd>尺寸、数量、状态与使用条件</dd><dt>服务方式</dt><dd>材料交换 / 团购 / 制作预约</dd><dt>履约触点</dt><dd>信息确认后安排线下交接</dd></dl>
        <ol class="ho-steps"><li class="on">01 选择</li><li>02 确认</li><li>03 取件准备</li></ol>
        <div class="ho-res" aria-live="polite"></div>
        <div class="ho-btns"><button type="button" class="btn small ho-next">确认需求 →</button><button type="button" class="btn small ghost ho-reset">重新开始</button></div></div>
        <figure class="ho-img"><img src="${img('loop-materials')}" alt="材料流转概念视觉" loading="lazy"></figure></div>
      <p class="mod-note">材料类别和交接状态只用来说明服务流程，没有真实库存、订单或预约提交。原交付是竞品研究、MVP 范围和服务方案。</p>`),
    init(el) {
      let step = 0; const sel = $('select', el), res = $('.ho-res', el), next = $('.ho-next', el);
      const MSG = [['先选择需求类别。', '：先确认尺寸、数量与使用条件。'], ['需要进一步核对材料信息。', '：确认规格和状态后再安排交接。'], ['交接准备完成', ' · 交接前核对材料、时间与责任。演示没有提交真实预约。']];
      const draw = () => {
        res.innerHTML = `<h4>${MSG[step][0]}</h4><p>${sel.value}${MSG[step][1]}</p>`;
        $$('.ho-steps li', el).forEach((li, i) => li.classList.toggle('on', i <= step));
        next.textContent = ['确认需求 →', '安排交接 →', '交接准备 / 概念状态'][step]; next.disabled = step === 2;
      };
      next.addEventListener('click', () => { if (step < 2) { step++; draw(); } });
      $('.ho-reset', el).addEventListener('click', () => { step = 0; draw(); });
      sel.addEventListener('change', () => { step = 0; draw(); });
      draw();
    }
  };

  window.MODULES = M;
})();
