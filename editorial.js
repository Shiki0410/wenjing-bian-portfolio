/* Evidence remains separate from editorial and illustrative form. */
(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const id=document.body.dataset.project, scope=['rallylens','privacy-city','tennisatom','baseball','bronze','afterglow','looplab'];
  if(!scope.includes(id))return;
  document.body.classList.add('editorial-edition');
  // A recurring subject sketch is useful once, not after every chapter.
  $$('.reference-chapter-graphic,.reference-chapter-stamp').forEach(n=>n.remove());
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const countInk=rgb=>{const s=rgb.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4),lum=.2126*s[0]+.7152*s[1]+.0722*s[2];return 1.05/(lum+.05)>=4.5?'#fff':'#000';};
  const svg=(w,h,title,desc,body)=>`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title><desc>${esc(desc)}</desc><g aria-hidden="true">${body}</g></svg>`;
  const panel=(code,title,mark,body,note,cls='')=>{const n=document.createElement('section');n.className='edit-panel '+cls;n.innerHTML=`<header class="edit-heading"><div><span class="edit-code">${code}</span><h3>${title}</h3></div><b aria-hidden="true">${mark}</b></header>${body}<p class="edit-source">${note}</p>`;return n;};
  const chapter=n=>$(`#chapter-${n} .chapter-visuals`);
  const buttons=(items,attr)=>`<div class="edit-controls" role="group">${items.map((t,i)=>`<button ${attr}="${i}" aria-pressed="${i===0}">${t}</button>`).join('')}</div>`;
  function choose(p,attr,cb,initial=0){const bs=$$(`[${attr}]`,p);const go=i=>{bs.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));cb(i);};bs.forEach((b,i)=>{b.onclick=()=>go(i);b.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();e.stopPropagation();const next=e.key==='Home'?0:e.key==='End'?bs.length-1:(i+(e.key==='ArrowRight'?1:-1)+bs.length)%bs.length;bs[next].focus();go(next);};});go(initial);}
  async function data(url){const r=await fetch(url);if(!r.ok)throw Error(url);return r.json();}
  const failure=p=>p.insertAdjacentHTML('beforeend','<p role="status" class="edit-source">数据暂未载入，请刷新后重试。原项目内容仍可阅读。</p>');
  if(id==='rallylens')rally();
  if(id==='privacy-city')privacy();
  if(id==='tennisatom')tennis();
  if(id==='baseball')baseball();
  if(id==='bronze')bronze();
  if(id==='afterglow')afterglow();
  if(id==='looplab')loop();

  function rally(){
    const dims=[['response_continuity','回应连续'],['technique_transition','技术转换'],['placement_line_control','落点线路'],['spatial_coverage','空间覆盖'],['movement_demand','移动需求'],['recovery_readiness','回位准备'],['rhythm_stability_variation','节奏变化'],['decision_pressure','决策压力']];
    const p=panel('EVENT ATLAS / DIRECTION × CONDITION','从一个事件，读到一段交换。','↔',`<div class="edit-rally-atlas"><nav class="edit-corpus-nav" aria-label="选择十二个研究片段"></nav><div class="edit-corpus-stage"><div class="edit-atlas-summary" aria-live="polite"></div>${buttons(['○ Offer / 来球条件','■ Actual / 回应实现'],'data-atlas-head')}<div class="edit-matrix-frame"><div data-matrix-rowlabels></div><div class="edit-chart-scroll" tabindex="0" aria-label="八维事件矩阵，可以横向滚动，左侧维度固定"><div data-rally-matrix></div></div></div><div class="edit-scale"><span>0</span><i></i><span>100</span><b>▧ 缺失</b></div><div class="edit-atlas-reading" aria-live="polite"></div><details><summary>查看当前片段数值表</summary><div class="edit-table-scroll" data-rally-values></div></details></div></div>`,'展示表包含 12 个 DPE、160 条事件，属于背景中 2,204 条事件的一个可核对子集。圆 / 方 / 菱形区分两个方向与未定；色阶为 0—100 模型尺度，不是成功率。Actual 为 0 与值缺失分别处理。','edit-rally-corpus');
    const old=$('.depth-panel',chapter(1));if(old)old.replaceWith(p);else chapter(1)?.append(p);
    data('assets/composition/rally-events.json').then(all=>{
      const ids=[...new Set(all.map(r=>r.dpe_id))];let selected=1,head='offer';
      const maxEvents=Math.max(...ids.map(key=>all.filter(r=>r.dpe_id===key).length));
      $('.edit-corpus-nav',p).innerHTML=`<small class="edit-nav-scale">条带 / 0—${maxEvents} 个事件</small>`+ids.map((key,i)=>{const rows=all.filter(r=>r.dpe_id===key),n=d=>rows.filter(r=>r.direction===d).length;return `<button data-corpus="${i}" aria-pressed="${i===selected}"><span>${key.replace('DPE_','')}</span><b>${rows.length}</b><i style="width:${rows.length/maxEvents*100}%"><em style="flex:${n('A_to_B')}" title="A→B ${n('A_to_B')}"></em><em style="flex:${n('B_to_A')}" title="B→A ${n('B_to_A')}"></em><em style="flex:${n('unknown')}" title="未定 ${n('unknown')}"></em></i></button>`;}).join('');
      const paint=()=>{
        const rows=all.filter(r=>r.dpe_id===ids[selected]),n=d=>rows.filter(r=>r.direction===d).length;
        const key=ids[selected].replace('DPE_',''),col=33,w=150+rows.length*col,h=365;
        $('.edit-atlas-summary',p).innerHTML=`<div><span class="edit-code">${key} / SESSION ${rows[0].session_no} / STAGE ${rows[0].stage_id}</span><h4>${rows.length} 次事件，<br>方向分别保留。</h4></div><dl><div><dt>○ A→B</dt><dd>${n('A_to_B')}</dd></div><div><dt>□ B→A</dt><dd>${n('B_to_A')}</dd></div><div><dt>◇ 未定</dt><dd>${n('unknown')}</dd></div></dl>`;
        let body=`<defs><pattern id="atlas-missing" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 6L6 0" stroke="#89989c" stroke-width=".7"/></pattern></defs><text x="0" y="22">${head==='offer'?'OFFER / 来球条件':'ACTUAL / 回应实现'}</text>`;
        rows.forEach((r,i)=>{const x=140+i*col;body+=`<text x="${x+14}" y="55" text-anchor="middle">${i+1}</text><text x="${x+14}" y="82" text-anchor="middle">${r.direction==='A_to_B'?'○':r.direction==='B_to_A'?'□':'◇'}</text>`;});
        dims.forEach(([field,name],j)=>{body+=`<text x="0" y="${113+j*29}">${name}</text>`;rows.forEach((r,i)=>{const v=r[head+'_'+field],fill=v===null?'url(#atlas-missing)':`rgb(${Math.round(239-v*1.97)},${Math.round(242-v*1.48)},${Math.round(247-v*.47)})`;body+=`<rect x="${140+i*col}" y="${96+j*29}" width="29" height="25" fill="${fill}" data-event-id="${esc(r.gold_shot_id)}"><title>事件${i+1} / ${name} / ${v===null?'缺失':v.toFixed(2)}</title></rect>`;});});
        body+=`<text x="140" y="353">一列 = 一个事件 / 按源事件顺序排列</text>`;
        $('[data-rally-matrix]',p).innerHTML=svg(w,h,key+'八维事件矩阵','每列一个事件，每行一个模型维度。时间间隔未编码为列宽，色阶统一0到100。',body);
        $('[data-rally-matrix] svg',p).setAttribute('viewBox',`140 0 ${w-140} ${h}`);
        $('[data-rally-matrix] svg',p).style.width=(w-140)+'px';
        $('[data-matrix-rowlabels]',p).innerHTML=svg(130,h,'模型维度固定标签','左右滑动事件时维度名称保持可见。',`<text x="0" y="22">${head==='offer'?'OFFER':'ACTUAL'}</text>${dims.map(([field,name],j)=>`<text x="0" y="${113+j*29}">${name}</text>`).join('')}`);
        const missing=rows.reduce((s,r)=>s+dims.filter(([k])=>r[head+'_'+k]===null).length,0),zero=rows.filter(r=>r.actual_status==='observed_no_response_zero').length;
        $('.edit-atlas-reading',p).innerHTML=`<p><b>读法</b>先看圆 / 方交替，再沿行检查同一个维度。方向不明仍保留事件位置；列宽表示事件顺序，真实时间见下方逐事件时间线。</p><p><b>证据状态</b>${zero} 条事件记录为未出现可观察回应；当前 ${head==='offer'?'Offer':'Actual'} 的 ${rows.length*8} 个单元中，${missing} 个值缺失。模型尺度描述条件，不评价搭档或关系。</p>`;
        $('[data-rally-values]',p).innerHTML=`<table><caption>${key} / ${head} / 0—100 模型尺度</caption><thead><tr><th>事件 / 源时间 s</th>${dims.map(x=>`<th>${x[1]}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr><th>${r.physical_event_index} / ${r.event_time_a_s.toFixed(3)}</th>${dims.map(([k])=>`<td>${r[head+'_'+k]===null?'缺失':r[head+'_'+k].toFixed(2)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
      };
      choose(p,'data-corpus',i=>{selected=i;paint();},1);choose(p,'data-atlas-head',i=>{head=i?'actual':'offer';paint();});
    }).catch(()=>failure(p));
    // Dual camera is an original prototype still, not two fabricated video feeds.
    $('.comp-dual-camera')?.insertAdjacentHTML('afterend','<div class="edit-camera-contract"><span>01 / 同一事件</span><b>机位 A</b><i>时间戳 ↔ 事件索引</i><b>机位 B</b><span>02 / 不同视角</span></div>');
    const films=$('#project-videos');if(films)$('.case-toc a[href="#project-videos"]')?.setAttribute('aria-label','项目影片，正文前置');
  }

  function privacy(){
    const p=panel('MODEL COMPARISON / UNCERTAINTY','排序接近时，还要看分类代价。','±',`<div class="edit-model-index" aria-label="选择比较模型"></div><div class="edit-model-spread"><div class="edit-model-plots"><div data-auc-ci></div><div data-pr-plot></div></div><aside class="edit-model-reading" aria-live="polite"></aside></div><details><summary>查看五模型导出值与 AUC 区间</summary><div class="edit-table-scroll" data-model-values></div></details>`,'原导出 model_comparison.json，5,000 合成样本，测试集 750。AUC 95% 区间使用原实现的 bootstrap 导出值；图上局部横轴明确标注 0.93—1。查准与查全图使用完整 0—1 轴。不是新增实验或真实用户预测性能。','edit-privacy-analysis');chapter(3)?.prepend(p);
    data('assets/editorial/privacy-models.json').then(raw=>{
      const names=['NumPy MLP','PyTorch MLP','Random Forest','Decision Tree','Logistic Regression'];
      const entries=names.map(name=>({name,...Object.entries(raw.models).find(([k])=>k.includes(name))[1]}));
      $('.edit-model-index',p).innerHTML=buttons(names,'data-compare-model');
      choose(p,'data-compare-model',index=>{
        const narrow=matchMedia('(max-width:700px)').matches, plotWidth=narrow?420:680;
        let body=`<text x="25" y="25">AUC / BOOTSTRAP 95% CI</text><text x="25" y="49" class="edit-svg-note">${narrow?'局部轴 0.93—1 / 点 = AUC，线 = 区间':'横轴局部放大 0.93—1.00 / 点为 AUC，线为区间'}</text>`;
        const X=x=>(narrow?165:195)+(x-.93)/.07*(narrow?235:445);
        [.93,.95,.97,.99,1].forEach(t=>body+=`<path d="M${X(t)} 65V300" class="edit-grid"/><text x="${X(t)}" y="328" text-anchor="middle">${t.toFixed(2)}</text>`);
        entries.forEach((e,i)=>{const y=86+i*47;body+=`<g class="${i===index?'edit-active':'edit-muted'}"><text x="25" y="${y+5}">${i+1}. ${narrow&&i===4?'Logistic Reg.':e.name}</text><path d="M${X(e.auc_95ci_low)} ${y}H${X(e.auc_95ci_high)}M${X(e.auc_95ci_low)} ${y-6}V${y+6}M${X(e.auc_95ci_high)} ${y-6}V${y+6}" class="edit-interval"/><circle cx="${X(e.roc_auc)}" cy="${y}" r="${i===index?7:5}"/></g>`;});
        $('[data-auc-ci]',p).innerHTML=svg(plotWidth,350,'五模型 AUC 与 bootstrap 95% 区间','区间高度重叠，不从微小AUC差异推断模型优越性。',body);
        const xp=x=>70+x*(narrow?325:505),yp=y=>265-y*200;
        let pr='<text x="25" y="24">PRECISION × RECALL / 完整 0—1 轴</text>';
        [0,.25,.5,.75,1].forEach(t=>pr+=`<path d="M${xp(t)} 65V265M70 ${yp(t)}H${xp(1)}" class="edit-grid"/><text x="${xp(t)}" y="292" text-anchor="middle">${t}</text><text x="56" y="${yp(t)+5}" text-anchor="end">${t}</text>`);
        // Closely spaced labels would overlap: only label the selected record.
        entries.filter((_,i)=>i!==index).forEach(e=>{pr+=`<circle class="edit-muted" cx="${xp(e.recall)}" cy="${yp(e.precision)}" r="5"/>`;});
        const active=entries[index];pr+=`<g class="edit-active"><circle cx="${xp(active.recall)}" cy="${yp(active.precision)}" r="8"/><text x="${xp(active.recall)-13}" y="${yp(active.precision)+6}" text-anchor="end">${index+1}</text></g>`;
        pr+=`<text x="${narrow?230:320}" y="330" text-anchor="middle">查全率 Recall</text><text x="28" y="49">查准率 Precision</text>`;
        $('[data-pr-plot]',p).innerHTML=svg(plotWidth,350,'五模型查准率和查全率','选中模型显示于右侧。每个圆对应一条原模型导出。圆大小仅区分选择状态，不编码模型指标。',pr);
        const e=entries[index];$('.edit-model-reading',p).innerHTML=`<span class="edit-code">0${index+1} / SAME TEST SET</span><h4>${e.name}</h4><strong>${e.roc_auc.toFixed(4)}</strong><p>AUC / 95% CI<br>${e.auc_95ci_low.toFixed(4)}—${e.auc_95ci_high.toFixed(4)}</p><dl>${[['查准率',e.precision],['查全率',e.recall],['特异度',e.specificity],['F1',e.f1_score],['ECE',e.ece],['Brier',e.brier_score]].map(([k,v])=>`<div><dt>${k}</dt><dd>${v.toFixed(4)}</dd></div>`).join('')}</dl><p>高查全率可以与较低特异度同时存在。AUC、分类阈值与概率校准分别检查。</p>`;
      });
      $('[data-model-values]',p).innerHTML=`<table><caption>测试集 750 / 原导出值</caption><thead><tr><th>模型</th><th>AUC</th><th>95% CI</th><th>Precision</th><th>Recall</th><th>Specificity</th></tr></thead><tbody>${entries.map(e=>`<tr><th>${e.name}</th><td>${e.roc_auc.toFixed(6)}</td><td>${e.auc_95ci_low.toFixed(6)}—${e.auc_95ci_high.toFixed(6)}</td><td>${e.precision.toFixed(6)}</td><td>${e.recall.toFixed(6)}</td><td>${e.specificity.toFixed(6)}</td></tr>`).join('')}</tbody></table>`;
    }).catch(()=>failure(p));
  }

  function tennis(){
    const bindings=[
      ['BALL_IMPACT','ImpactRing','击球点出现二维半透明涟漪。','骨骼极值加速、球轨迹曲率突变与击球声峰值，作为击球事件的组合条件。',0],
      ['BALL_FLIGHT','SpeedTrail','速度超过 100 km/h 时，触发高对比渐变拖尾。','球轨迹与时间基准进入速度条件，再将已识别事件交给效果层。',1],
      ['ACE_SERVE','GlitchFrame','画幅瞬时 RGB 分色。','按事件类型选择特效；视觉强度由包络控制，与事件识别分开。',2],
      ['SWING_START','FocusBox','人体周围出现精准半包围框。','追踪结构承接动作开始，先建立身体锚点，再进入风格化表达。',3]
    ];
    const p=panel('EVENT → EFFECT / VISUAL GRAMMAR','动作、事件和特效，各有一层。','＊',`<div class="edit-tennis-spread"><div class="edit-tennis-art"><svg viewBox="0 0 900 1000" role="img" aria-label="原冲击特效透明图层的编辑式重组，非实测数据"><title>原特效透明图层</title><defs><clipPath id="tennis-effect-crop"><rect width="900" height="1000"/></clipPath></defs><rect width="900" height="1000" fill="#e7f2e8"/><path d="M30 310H870M280 30V950" class="edit-tennis-reference"/><text x="40" y="120" class="edit-tennis-large">HIT.</text><image href="assets/composition/tennis-impact.webp" x="-50" y="100" width="850" height="1275" clip-path="url(#tennis-effect-crop)"/><rect x="30" y="894" width="840" height="75" fill="#13201b"/><text x="55" y="926" class="edit-art-caption">ORIGINAL EFFECT LAYER / 风格设计</text><text x="55" y="951" class="edit-art-caption">图中文字为原视觉提案，非团队球员实测</text></svg></div><div class="edit-tennis-director"><span class="edit-code">SOURCE SIGNALS / 三路依据</span><div class="edit-signal-ports"><span>骨骼极值</span><span>球路变化</span><span>音频峰值</span></div>${buttons(bindings.map(x=>x[0]),'data-effect-binding')}<div class="edit-effect-reading" aria-live="polite"></div><div data-effect-diagram></div><div class="edit-envelope"><span class="edit-code">ADSR / 强度包络示意</span>${svg(480,135,'特效强度包络示意','横轴为规范化阶段，纵轴为示意强度；曲线不代表原片时长或实测。','<path d="M20 108H460M20 18V108" class="edit-grid"/><path d="M20 108L90 22L165 57H330L445 108" class="edit-envelope-path"/><text x="80" y="130">A</text><text x="155" y="130">D</text><text x="250" y="130">S</text><text x="410" y="130">R</text>')}<p>强度经历起音、衰减、持续、释放。按阶段说明特效的节奏，不补造识别置信度。</p></div></div></div>`,'事件绑定与触发条件重绘自最终汇报第 18 页。透明冲击图来自原海报物料；新增包络是原理示意。上方五支成片只保留一个观看入口，本区解释制作机制。','edit-tennis-effects');chapter(2)?.replaceChildren(p);
    const heading=$('#chapter-2 .chapter-heading h2');if(heading)heading.textContent='从动作信息，到画面的触发条件。';const copy=$('#chapter-2 .chapter-heading>p');if(copy)copy.textContent='骨骼、球路与音频提供不同的识别依据。事件字典把分析结果交给特效层，强度包络控制进入与退出，避免将每一种视觉都当作测量结果。';
    choose(p,'data-effect-binding',i=>{const [event,effect,text,explain]=bindings[i];$('.edit-effect-reading',p).innerHTML=`<span class="edit-code">0${i+1} / ${event}</span><h4>${effect}</h4><p>${text}</p><small>${explain}</small>`;const shapes=['<circle cx="125" cy="100" r="48"/><circle cx="125" cy="100" r="27"/><circle cx="125" cy="100" r="5" fill="currentColor"/>','<path d="M25 145L210 45M45 157L220 65M70 163L230 95"/>','<path d="M50 50H175V145H50ZM60 42H185V137H60M42 62H166V155H42"/>','<path d="M70 50H35V85M155 50H195V85M35 115V150H70M155 150H195V115"/>'];$('[data-effect-diagram]',p).innerHTML=svg(480,200,event+'进入'+effect,'连接表示事件触发关系，图形是特效机制示意，不表示球员轨迹。',`<g class="edit-effect-glyph">${shapes[i]}</g><path d="M245 100H320M305 91L320 100 305 109" class="edit-effect-wire"/><text x="340" y="82">${effect}</text><text x="340" y="115">触发与渲染</text>`);});
    // Preserve the product distinction without a second watching/film module.
    p.insertAdjacentHTML('beforeend','<div class="edit-product-route"><b>产品路径</b><span>共用素材与分析</span><span>一键成片 / 风格定制</span><span>精修、审看与交付</span></div>');
    $$('.case-result a[href="https://www.bilibili.com/video/BV1Us3F6LEyz/"]').slice(1).forEach(a=>a.remove());
  }

  function baseball(){
    const pipe=$('.comp-baseball-pipeline');
    if(pipe){
      $('.comp-pipeline-art',pipe)?.remove();$('.comp-pipeline-readout',pipe)?.remove();
      const graph=document.createElement('div');graph.className='edit-baseball-system';
      graph.innerHTML=`${buttons(['01 / 数据源','02 / 视图模型','03 / 视觉编码','04 / 阅读状态'],'data-source-step')}<div class="edit-chart-scroll" tabindex="0" aria-label="数据架构，可横向滚动"><div data-baseball-system></div></div><div class="edit-system-reading" aria-live="polite"></div>`;
      $('.comp-source',pipe).before(graph);
      const steps=[['数据源','四份 CSV 分别保留逐球记录与球队汇总。球员、年份、球种及缺失状态先进入字段层。'],['视图模型','原记录按年份、球种与结果构成筛选子集；统计分布与逐球空间共用数据，不共用不明分母。'],['视觉编码','球队与人物提供概览，实验室比较分布，局部视图检查每一球。ECharts 与 Three.js 分别承担统计与空间表达。'],['阅读状态','React 保存选择状态；GSAP / Lenis 组织滚动章节。滚动、筛选与局部检查是三种不同的阅读动作。']];
      choose(graph,'data-source-step',step=>{const nodes=[['山本逐球',40,75,0],['大谷逐球',40,170,0],['道奇投球汇总',40,265,0],['道奇打击汇总',40,360,0],['字段与缺失',300,130,1],['年份 / 球种 / 结果',300,305,1],['概览',565,75,2],['分布 / 比较',565,225,2],['逐球 / 空间',565,375,2],['滚动章节',820,75,3],['选择状态',820,225,3],['局部检查',820,375,3]],links=[[0,4],[1,4],[2,4],[3,4],[4,5],[4,6],[5,7],[5,8],[6,9],[7,10],[8,11]];
        const body=`<text x="40" y="30">SOURCE</text><text x="300" y="30">VIEW MODEL</text><text x="565" y="30">READING SCALE</text><text x="820" y="30">INTERACTION</text>${links.map(([a,b])=>{const s=nodes[a],t=nodes[b],same=s[1]===t[1];return `<path class="edit-system-link" d="${same?`M${s[1]+90} ${s[2]+60}V${t[2]}`:`M${s[1]+180} ${s[2]+30}C${s[1]+220} ${s[2]+30} ${t[1]-40} ${t[2]+30} ${t[1]} ${t[2]+30}`}"/>`;}).join('')}${nodes.map(([name,x,y,group])=>`<g class="edit-system-node ${group===step?'active':''}"><rect x="${x}" y="${y}" width="180" height="60"/><text x="${x+14}" y="${y+37}">${name}</text></g>`).join('')}`;
        $('[data-baseball-system]',graph).innerHTML=svg(1050,480,'从四份CSV到三个阅读尺度','连接表示字段与视图依赖，不表示流量或性能。',body);$('.edit-system-reading',graph).innerHTML=`<b>0${step+1}</b><div><h4>${steps[step][0]}</h4><p>${steps[step][1]}</p></div>`;});
    }
    const p=panel('CONTACT FIELD / EXIT VELOCITY × ANGLE','看一球，也看击球如何聚集。','▦',`<div class="edit-contact-toolbar">${buttons(['2024','2025','2026'],'data-contact-year')}<label>结果<select data-contact-result aria-label="筛选击球结果"><option value="all">全部逐球记录</option><option value="home_run">本垒打</option><option value="hit">安打（含本垒打）</option><option value="out">出局结果</option></select></label></div><div class="edit-contact-spread"><div class="edit-chart-scroll" tabindex="0" aria-label="击球速度与角度区间计数"><div data-contact-field></div></div><aside class="edit-contact-detail" aria-live="polite"></aside></div><details><summary>展开每格的记录数</summary><div class="edit-table-scroll" data-contact-values></div></details>`,'同一份大谷打者 CSV：每格 10 mph × 10°，从 0 到 130 mph、−50° 到 90°。图形为区间计数，不重建三维飞行轨迹。缺失与范围外值单列；颜色按当前筛选最大计数更新，最大值始终可见。2026 为源文件覆盖期。','edit-baseball-contact');chapter(3)?.prepend(p);
    data('assets/baseball-records.json').then(raw=>{let year='2024';const results=$('[data-contact-result]',p);
      const draw=()=>{const records=raw.bat.filter(r=>r.game_date.startsWith(year)),result=results.value,isHit=r=>['single','double','triple','home_run'].includes(r.events),isOut=r=>['field_out','force_out','grounded_into_double_play','double_play','sac_fly','sac_bunt','fielders_choice_out'].includes(r.events),subset=records.filter(r=>result==='all'||result==='home_run'&&r.events==='home_run'||result==='hit'&&isHit(r)||result==='out'&&isOut(r)),valid=subset.filter(r=>Number.isFinite(r.launch_speed)&&Number.isFinite(r.launch_angle)),inside=valid.filter(r=>r.launch_speed>=0&&r.launch_speed<130&&r.launch_angle>=-50&&r.launch_angle<90),grid=Array.from({length:14},()=>Array(13).fill(0));inside.forEach(r=>grid[Math.floor((r.launch_angle+50)/10)][Math.floor(r.launch_speed/10)]++);const max=Math.max(1,...grid.flat());
        const narrow=matchMedia('(max-width:700px)').matches, step=narrow?22:34,start=narrow?64:72;
        let body='<text x="30" y="28">LAUNCH ANGLE / °</text>';
        for(let j=0;j<14;j++){const y=60+(13-j)*23;body+=`<text x="52" y="${y+17}" text-anchor="end">${-50+j*10}</text>`;for(let i=0;i<13;i++){const v=grid[j][i],rgb=[Math.round(247-v/max*35),Math.round(239-v/max*200),Math.round(243-v/max*145)],fill=v?`rgb(${rgb.join(',')})`:'#f4f3ed';body+=`<g><rect x="${start+i*step}" y="${y}" width="${step-2}" height="21" fill="${fill}" stroke="#d8cecf" stroke-width=".5"/><text x="${start+(step-2)/2+i*step}" y="${y+15}" text-anchor="middle" style="font-size:${narrow?14:12}px;fill:${v?countInk(rgb):'#000'}">${v||'·'}</text></g>`;}}
        [0,20,40,60,80,100,120].forEach(t=>body+=`<text x="${start+t/10*step}" y="409" text-anchor="middle">${t}</text>`);body+=`<text x="${narrow?200:285}" y="444" text-anchor="middle">${narrow?'初速 / mph · 网格下界':'EXIT VELOCITY / mph · 网格下界'}</text>`;
        $('[data-contact-field]',p).innerHTML=svg(narrow?370:570,465,'大谷击球速度与角度区间计数','数字为原CSV的有效接触记录数，点表示零记录。每格10mph乘10度，颜色随当前最大计数归一。',body);
        $('.edit-contact-detail',p).innerHTML=`<span class="edit-code">${year} / OHTANI / CONTACT</span><h4>${results.options[results.selectedIndex].text}</h4><strong>${inside.length.toLocaleString()}</strong><p>进入网格的接触记录</p><dl><div><dt>当前筛选</dt><dd>${subset.length}</dd></div><div><dt>速度 / 角度缺失</dt><dd>${subset.length-valid.length}</dd></div><div><dt>范围外</dt><dd>${valid.length-inside.length}</dd></div><div><dt>最大单格</dt><dd>${Math.max(...grid.flat())}</dd></div></dl><p>离散格子显示聚集结构。回到原散点图，可检查同一范围内的逐球位置。</p>`;
        $('[data-contact-values]',p).innerHTML=`<table><caption>${year} / 行为角度下界，列为速度下界；每格计数</caption><thead><tr><th>° / mph</th>${grid[0].map((_,i)=>`<th>${i*10}</th>`).join('')}</tr></thead><tbody>${grid.map((row,j)=>`<tr><th>${-50+j*10}</th>${row.map(v=>`<td>${v}</td>`).join('')}</tr>`).reverse().join('')}</tbody></table>`;
      };results.onchange=draw;choose(p,'data-contact-year',i=>{year=String(2024+i);draw();});
    }).catch(()=>failure(p));
    // A quiet, distinct diagram preview avoids reusing the hero as the site launch tile.
    const launch=$('#experience .depth-web-cover');if(launch){$('img',launch)?.remove();launch.insertAdjacentHTML('afterbegin',`<div class="edit-baseball-launch"><span class="edit-code">ORIGINAL REACT WEBSITE</span><strong>SCROLL.<br>COMPARE.<br>INSPECT.</strong><i aria-hidden="true">↗</i><p>宏观叙事 / 图表实验室 / 逐球检查</p></div>`);}
  }

  function bronze(){
    const p=$('.comp-bronze-analysis');if(!p)return;
    p.classList.add('edit-bronze-analysis');
    const points=Array.from({length:10},(_,i)=>[55+i*65.5,i===5||i===8?220:165,i===5||i===8?220:267]);
    const path=k=>points.map((q,i)=>`${i?'L':'M'}${q[0]} ${q[k]}`).join('');
    const old=$('.comp-bronze-map',p);if(old)old.innerHTML=svg(680,470,'十集的明暗双线与叙事回收','节点按集数排列，纵向只区分故事线，不表示情绪或强度。第6集断裂，第9集三方融合。',`<rect x="28" y="82" width="316" height="255" fill="#e7e0ce"/><rect x="350" y="82" width="58" height="255" fill="#ae302b" opacity=".14"/><rect x="414" y="82" width="238" height="255" fill="#ead7c6"/><text x="28" y="48">5 / 铺陈</text><text x="350" y="48">1 / 断裂</text><text x="480" y="48">4 / 整合</text><text x="40" y="114">星辰 / 明线</text><text x="40" y="310">阿鸮 / 暗线</text><path d="${path(1)}" class="edit-bronze-path"/><path d="${path(2)}" class="edit-bronze-path secondary"/>${points.map(([x,y,y2],i)=>`<g><circle cx="${x}" cy="${y}" r="${i===5||i===8?18:6}" fill="${i===5||i===8?'#ae302b':'#794b40'}"/>${y!==y2?`<rect x="${x-4}" y="${y2-4}" width="8" height="8" fill="#8c7b55"/>`:''}<text x="${x}" y="364" text-anchor="middle">${String(i+1).padStart(2,'0')}</text></g>`).join('')}<path d="M55 399H645" stroke="#ac9982"/><text x="28" y="430">器灵相遇 / 记忆累积</text><text x="350" y="455">陨落</text><text x="475" y="430">身份 / 融合 / 告别</text>`);
    const insert=document.createElement('div');insert.className='edit-bronze-close-reading';insert.innerHTML=`<span class="edit-code">VISUAL ANCHORS / 身份如何保持连续</span>${[['01','簪花 / 母亲的痕迹','从日常造型进入战斗形态，保持星辰与家人的关系。'],['02','吊坠 / 记忆的携带','形态改变时仍留下识别锚点；物件连接回忆与行动。'],['03','融合 / 线索的回收','第九集将星辰、阿鸮与妇好交汇，终局造型承接此前身份线。']].map(x=>`<div><b>${x[0]}</b><h4>${x[1]}</h4><p>${x[2]}</p></div>`).join('')}`;$('.comp-source',p).before(insert);
    const readings=[['物件先于身份','手掌、伤痕与信物的近景，让回忆通过可辨认的物件进入。'],['用色差改变阅读重心','黑白线稿保留人物轮廓，朱红勾出星辰；背景身份留在另一层。'],['让关系在同框中收束','人物与器灵重新进入同一构图；画面的并置承接终局的归位。']];
    $$('.bronze-story-stills figure').forEach((fig,i)=>$('figcaption',fig)?.insertAdjacentHTML('beforeend',`<div class="edit-frame-reading"><span>FRAME READING / 画面读法</span><h4>${readings[i][0]}</h4><p>${readings[i][1]}</p></div>`));
  }

  function afterglow(){
    const p=panel('NINETEEN STATES / ONE VISUAL SYSTEM','时间改变信号，信号改变字环。','19',`<div class="edit-environment-spread"><div class="edit-environment-chart"><div data-environment-timeline></div><label class="edit-time-slider">选择内置时刻 <output data-environment-time>08:00</output><input type="range" min="0" max="18" value="2" step="1" data-environment-index aria-label="AFTERGLOW样本时刻"></label></div><aside class="edit-environment-reading" aria-live="polite"></aside></div><div class="edit-environment-specimens" aria-label="三种既有样本的编码轮廓"></div><details><summary>查看 V4 的 19 个原始内置样本</summary><div class="edit-table-scroll" data-environment-table></div></details>`,'数据精确读取原 V4 的 CSV_FALLBACK，06:00 至次日 00:00 共 19 点。是内置演示样本，不是当前南站监测。曲线各自采用代码归一范围，人流缺少采样周期，保留为原样本值；PM2.5 保留为原文件指数。','edit-afterglow-evidence');
    const engine=chapter(2)?.querySelector('.depth-panel');if(engine)engine.replaceWith(p);else chapter(2)?.append(p);
    data('assets/editorial/afterglow-samples.json').then(rows=>{
      const metrics=[['flow','人流 / 原样本值',15,200],['noise','噪声 / dB',50,96],['pm25','PM2.5 / 指数',15,65],['wind','风速 / m/s',.5,5]],normal=(v,a,b)=>Math.max(0,Math.min(1,(v-a)/(b-a)));
      const glyph=(r,size=280)=>{const f=normal(r.flow,15,200),n=normal(r.noise,50,96),pm=normal(r.pm25,15,65),wind=normal(r.wind,.5,5),count=Math.round(96*(.6+.7*f)),R=size*.35,span=size*.5*(.5+.46*f)*.86,fontsize=5+pm*5;let body='';for(let j=0;j<count;j++){const a=j/count*Math.PI*2,inner=size*.1,outer=Math.min(size*.47,inner+span*.75+(Math.sin(a*4)*( .1+.85*n)*size*.06)),x=size/2+Math.cos(a)*outer,y=size/2+Math.sin(a)*outer;body+=`<path d="M${size/2+Math.cos(a)*inner} ${size/2+Math.sin(a)*inner}L${x} ${y}" stroke="currentColor" stroke-width=".55"/><text x="${size/2+Math.cos(a)*R}" y="${size/2+Math.sin(a)*R}" transform="rotate(${a*180/Math.PI+90} ${size/2+Math.cos(a)*R} ${size/2+Math.sin(a)*R})" text-anchor="middle" style="font-size:${fontsize}px">余晖</text>`;}return svg(size,size,r.time+'编码轮廓','按V4归一逻辑绘制的简化示意，不是原p5.js实时输出。',`<g transform="rotate(${(wind-.45)*.55*180/Math.PI} ${size/2} ${size/2})">${body}</g><circle cx="${size/2}" cy="${size/2}" r="${size*.065}" fill="currentColor"/>`);};
      const draw=()=>{const i=+$('[data-environment-index]',p).value,r=rows[i],narrow=matchMedia('(max-width:700px)').matches;let body='';const X=i=>(narrow?110:120)+i*(narrow?16:26.7);
        metrics.forEach(([k,label,a,b],j)=>{const top=50+j*91,Y=v=>top+55-normal(v,a,b)*47;body+=`<text x="10" y="${top+15}">${label}</text><text x="10" y="${top+38}" class="edit-svg-note">${a}—${b}</text><path d="M${X(0)} ${top+55}H${X(18)}" class="edit-grid"/><path d="${rows.map((r,l)=>`${l?'L':'M'}${X(l)} ${Y(r[k])}`).join('')}" class="edit-environment-line"/>${rows.map((rr,l)=>`<circle cx="${X(l)}" cy="${Y(rr[k])}" r="${l===i?5:2}" fill="currentColor"/>`).join('')}`;});
        body+=`<path d="M${X(i)} 28V390" class="edit-selected-time"/>${(narrow?[0,6,12,18]:[0,3,6,9,12,15,18]).map(k=>`<text x="${X(k)}" y="415" text-anchor="middle">${rows[k].time}</text>`).join('')}`;
        $('[data-environment-timeline]',p).innerHTML=svg(narrow?425:635,440,'AFTERGLOW四通道19时刻样本','四条曲线共享时刻轴，各自按V4的归一范围排列；不会共用不同单位的数值轴。',body);$('[data-environment-time]',p).textContent=r.time;
        $('.edit-environment-reading',p).innerHTML=`<span class="edit-code">${r.time} / SOURCE SAMPLE</span><h4>从数值，<br>进入形态条件。</h4><dl>${metrics.map(([k,label])=>`<div><dt>${label}</dt><dd>${r[k]}</dd></div>`).join('')}</dl><div class="edit-selected-glyph">${glyph(r)}</div><p>简化编码轮廓：人流改变方向数，噪声改变径向起伏，指数影响字号，风改变倾斜。原 V4 的完整绘制与运动仍在上方原型中。</p>`;
      };$('[data-environment-index]',p).oninput=draw;draw();
      $('.edit-environment-specimens',p).innerHTML=[0,3,12].map(i=>`<figure>${glyph(rows[i])}<figcaption><b>${rows[i].time}</b><span>人流 ${rows[i].flow} / 噪声 ${rows[i].noise} dB<br>PM2.5 指数 ${rows[i].pm25} / 风 ${rows[i].wind} m/s</span></figcaption></figure>`).join('');
      $('[data-environment-table]',p).innerHTML=`<table><caption>V4 内置样本 / 非实时数据</caption><thead><tr><th>时刻</th>${metrics.map(x=>`<th>${x[1]}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr><th>${r.time}</th>${metrics.map(([k])=>`<td>${r[k]}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    }).catch(()=>failure(p));
  }

  function loop(){
    // Keep the original five-stage online/offline journey; remove the second summary of the same handoff.
    $$('.depth-panel',chapter(3)).filter(n=>$('.depth-code',n)?.textContent==='SERVICE / HANDOFF').forEach(n=>n.remove());
    const modes=[['校园 SaaS','学校管理方','年度订阅 / 存储与社区','平台维护、资源组织与校内服务入口。'],['高级功能','高频使用者','高级下载 / 展示 / 企业包','基础交换之外，围绕归档、展示与输出组织增值服务。'],['企业合作','材料品牌与供应商','展示费 / 收益分成','材料信息连接实际采购与供需，不让展示取代履约。'],['服务佣金','打印店 / 制作社团','制作订单佣金','预约、文件、时间与完成状态共同构成订单交接。'],['免费基础入口','所有学生','基础交换免费 / 便利服务付费','保持交换入口开放，让取件、检索与档案服务对应具体价值。']];
    const small=matchMedia('(max-width:700px)').matches,L=small?80:155,R=small?300:480,M=small?190:314;
    const circuit=svg(small?380:650,430,'LoopLab供需、制作与归档的循环','箭头表示服务与资源关系，不编码资金规模或实际经营结果。',`<path d="M${L} 120H${R}V320H${L}V120" class="edit-loop-route"/><path d="M${M} 120V320" class="edit-loop-route secondary"/>${[[L,120,'学生需求'],[R,120,'材料 / 制作'],[R,320,'线下交接'],[L,320,'作品 / 余料']].map(([x,y,name])=>`<circle cx="${x}" cy="${y}" r="52"/><text x="${x}" y="${y+6}" text-anchor="middle">${name}</text>`).join('')}<rect x="${M-73}" y="188" width="146" height="62"/><text x="${M}" y="226" text-anchor="middle">LoopLab</text><text x="${M}" y="70" text-anchor="middle">信息 / 匹配 / 预约</text><text x="${M}" y="402" text-anchor="middle">归档 / 再使用</text>`);
    const p=panel('SERVICE × BUSINESS / VALUE EXCHANGE','需求、履约与商业模式放在一起。','↻',`<div class="edit-loop-value"><div class="edit-loop-circuit">${circuit}<div class="edit-loop-principle"><b>服务价值</b><p>获取更明确，制作有条件，交接有位置，作品能留存。</p></div></div><div class="edit-loop-business">${buttons(modes.map((x,i)=>`0${i+1} / ${x[0]}`),'data-value-mode')}<div class="edit-loop-value-detail" aria-live="polite"></div></div></div>`,'关系图依据原汇报第 10 页系统图与第 11 页商业模式重构。展示方案中的付费对象、服务机制与职责，不把定价区间或经营目标写成已发生的收入。','edit-loop-business-model');chapter(3)?.append(p);
    $('.edit-loop-circuit',p).setAttribute('tabindex','0');
    $('.edit-loop-circuit',p).setAttribute('aria-label','供需与履约关系图');
    $('.edit-loop-circuit svg',p).insertAdjacentHTML('beforeend',`<g aria-hidden="true"><path d="M${M} 113L${M+7} 120 ${M} 127M${R-7} 213L${R} 220 ${R+7} 213M${M+7} 313L${M} 320 ${M+7} 327M${L-7} 227L${L} 220 ${L+7} 227" fill="none" stroke="#5b805f" stroke-width="3"/></g>`);
    choose(p,'data-value-mode',i=>{const m=modes[i];$('.edit-loop-value-detail',p).innerHTML=`<span class="edit-code">0${i+1} / VALUE EXCHANGE</span><h4>${m[0]}</h4><dl><div><dt>服务对象</dt><dd>${m[1]}</dd></div><div><dt>商业机制</dt><dd>${m[2]}</dd></div></dl><p>${m[3]}</p><p class="edit-loop-reconstruction">内容与视觉重构串联需求、流程和商业模式，使服务触点与履约路径在同一套方案中对应。</p>`;});
    // No report-page count, financial forecast label, or duplicate reflection block.
    $('.case-reflection')?.remove();
  }
})();
