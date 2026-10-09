/* Linked source figures and native scientific diagrams. Source files remain unchanged. */
(() => {
 'use strict';
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)], id=document.body.dataset.project;
 document.body.classList.add('refined-edition');
 const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const A='assets/refinement/';
 const svg=(w,h,b,t,d=t)=>`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${E(t)}"><title>${E(t)}</title><desc>${E(d)}</desc>${b}</svg>`;
 const crop=(key,box,w,h,title)=>`<svg viewBox="${box}" role="img" aria-label="${E(title)}"><title>${E(title)}</title><desc>原图的语义区域裁切，未重估数值。</desc><image href="${A+key}.webp" width="${w}" height="${h}"/></svg>`;
 const panel=(code,title,b,extra='',cls='')=>{const n=document.createElement('section');n.className='rv-panel '+cls;n.innerHTML=`<header><div><span class="rv-code">${code}</span><h3>${title}</h3></div><b>${extra}</b></header>${b}`;return n;};
 const source=t=>`<p class="rv-source">${t}</p>`;
 const controls=(labels,key)=>`<div class="rv-controls" role="group">${labels.map((s,i)=>`<button ${key}="${i}" aria-pressed="${i===0}">${s}</button>`).join('')}</div>`;
 const chapter=n=>$(`#chapter-${n} .chapter-visuals`);
 function tabs(n,key,fn){const bs=$$(`[${key}]`,n);const set=i=>{bs.forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));fn(i);};bs.forEach((b,i)=>{b.onclick=()=>set(i);b.onkeydown=e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();e.stopPropagation();const j=e.key==='Home'?0:e.key==='End'?bs.length-1:(i+(e.key==='ArrowRight'?1:-1)+bs.length)%bs.length;bs[j].focus();set(j);};});set(0);}
 function activate(n,key,fn){$$(`[${key}]`,n).forEach(g=>{g.onclick=()=>fn(+g.getAttribute(key));g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fn(+g.getAttribute(key));}};});}
 function loadError(n){n.insertAdjacentHTML('beforeend','<p class="rv-source" role="status">数据暂未载入，请刷新或查看本页原项目内容。</p>');}
  if(!id){const contact=$('#contact')||$('.contact');if(contact&&!$('.rv-resume-link',contact))contact.insertAdjacentHTML('beforeend','<a class="rv-resume-link" href="downloads/Wenjing-Bian-CV.pdf" download>综合简历 / 产品 · 研究 · 技术 · 游戏 · 影像 <span>↓ PDF</span></a>');const about=$('#about .about-text');if(about&&!$('.rv-about-cv',about))about.insertAdjacentHTML('beforeend','<a class="rv-about-cv" href="downloads/Wenjing-Bian-CV.pdf" target="_blank" rel="noopener">综合简历 · 四页完整版 ↗</a>');return;}
 const p=window.PORTFOLIO?.projects.find(p=>p.id===id);
 const guide=document.createElement('nav');guide.className='rv-case-guide';guide.setAttribute('aria-label','案例阅读路径');
 guide.innerHTML=[['01','问题与我的职责','.case-overview'],['02','可操作的作品','#experience'],['03','设计与实现过程','#chapter-1'],['04','成果与后续','#project-results']].map(([num,label,target])=>{const n=$(target);if(!n)return '';if(!n.id)n.id='case-guide-'+num;return `<a href="#${n.id}"><b>${num}</b><span>${label}</span></a>`;}).join('');$('.case-hero')?.append(guide);
 if(id==='rallylens'){rallyEvents();rallyFindings();rallyPaper();}
 if(id==='privacy-city'){privacyDiagnostics();privacyArchitecture();}
 if(id==='tennisatom'){tennisResearch();tennisArt();tennisTechnology();tennisNarrative();}

 function rallyEvents(){
  const n=panel('G01_02 / LINKED EVENT REGISTER','逐拍位置与过程区间，放在同一时间轴。',controls(['全片段','0—10 s','5—15 s','10—20 s','15—25 s','20—30 s'],'data-rv-window')+`<div class="rv-events-main"><div class="rv-event-visual"><div class="rv-scroll" tabindex="0" aria-label="逐事件与重叠窗口，可横向滚动"><div data-rv-event-plot></div></div><p>圆 / 方区分来球方向，菱形保留未知；实线连接同一回合，虚线经过未知事件。</p></div><aside class="rv-event-inspector" aria-live="polite"></aside></div><div class="rv-window-summary" aria-live="polite"></div><details><summary>检查当前事件的八个模型维度　○ Offer / ■ Actual-model</summary><div class="rv-parent" data-rv-parent></div></details><details><summary>对照论文原图 Fig. S4 / 五个重叠窗口</summary><div class="rv-paper-display"><img src="${A}figS4_reporting_windows.webp" alt="原论文五个十秒窗口与事件数量" loading="lazy"></div></details>`+source('数据：12-DPE逐事件表中的 G01_02，源视频 525—555 s。位置由真实秒数计算，窗口为 10 s / 5 s 步长。图中 16 拍是这个案例，不等同全项目 2,204 个事件。区间描述不摊派到单拍。'),'16');
  $('.comp-rally-events')?.replaceWith(n);
  fetch('assets/composition/rally-events.json').then(r=>r.json()).then(all=>{
   const es=all.filter(e=>e.dpe_id==='DPE_G01_02');let selected=1,wi=0;
   const time=e=>e.event_time_a_s-525, inWindow=(e,i)=>i===0||(time(e)>=(i-1)*5&&time(e)<(i-1)*5+10), counts=Array.from({length:5},(_,i)=>es.filter(e=>inWindow(e,i+1)).length);
   const colors={A_to_B:'#2255cf',B_to_A:'#aa4434',unknown:'#596563'}, directions={A_to_B:'P01 → P02',B_to_A:'P02 → P01',unknown:'方向未确认'};
   function draw(){
    const x=t=>115+t/30*705,y=d=>d==='A_to_B'?98:d==='B_to_A'?236:167;
    let b='';for(let t=0;t<=30;t+=5)b+=`<path d="M${x(t)} 65V555" class="rv-grid"/><text x="${x(t)}" y="310" text-anchor="middle">${t}</text>`;
    b+='<text x="822" y="335" text-anchor="end">片段时间 / s</text><text x="10" y="103">○ P01→P02</text><text x="10" y="172">◇ 未确认</text><text x="10" y="241">□ P02→P01</text>';
    if(wi)b+=`<rect x="${x((wi-1)*5)}" y="65" width="235" height="209" class="rv-window"/>`;
    [[0,0],[1,5],[6,12],[13,15]].forEach(([a,z],r)=>{const xa=x(time(es[a])),xz=x(time(es[z]));b+=`<path d="M${xa} 48V38H${Math.max(xa+20,xz)}V48" stroke="#596b65" fill="none"/><text x="${(xa+xz)/2}" y="24" text-anchor="middle">R${r+1}</text>`;for(let j=a;j<z;j++){const e=es[j],f=es[j+1];b+=`<path d="M${x(time(e))} ${y(e.direction)}L${x(time(f))} ${y(f.direction)}" class="rv-rally-path" ${[e.direction,f.direction].includes('unknown')?'stroke-dasharray="5 6"':''}/>`;}});
    es.forEach((e,j)=>{const xx=x(time(e)),yy=y(e.direction);b+=`<g class="rv-hit ${j===selected?'selected':''}" data-rv-hit="${j}" role="button" tabindex="0" aria-pressed="${j===selected}" aria-label="事件${j+1}，${time(e).toFixed(2)}秒，${directions[e.direction]}"><circle class="rv-hit-bg" cx="${xx}" cy="${yy}" r="20"/>${e.direction==='A_to_B'?`<circle cx="${xx}" cy="${yy}" r="7"/>`:e.direction==='B_to_A'?`<rect x="${xx-7}" y="${yy-7}" width="14" height="14"/>`:`<path d="M${xx} ${yy-9}l9 9-9 9-9-9Z" class="rv-diamond"/>`}<text x="${xx}" y="${yy+32}" text-anchor="middle" class="rv-event-number">${String(j+1).padStart(2,'0')}</text></g>`;});
    b+='<text x="10" y="369">区间 / 10 s</text>';
    counts.forEach((c,j)=>{const start=j*5,yy=355+j*40;b+=`<g data-rv-range="${j+1}" class="rv-window-track ${wi===j+1?'selected':''}" role="button" tabindex="0" aria-pressed="${wi===j+1}" aria-label="${start}到${start+10}秒，${c}次事件"><rect x="${x(start)}" y="${yy}" width="235" height="28"/><text x="${x(start)+117.5}" y="${yy+20}" text-anchor="middle">${start}—${start+10} s · ${c} 拍</text></g>`;});
    $('[data-rv-event-plot]',n).innerHTML=svg(850,565,b,'16次真实事件与五个重叠窗口','横轴0至30秒。选中事件更新来源和八维模型分解；窗口与事件是两种记录尺度。');
    activate(n,'data-rv-hit',j=>{selected=j;if(!inWindow(es[j],wi)){wi=0;sync();}draw();});activate(n,'data-rv-range',j=>chooseWindow(j));
    const e=es[selected],span=wi?es.filter(e=>inWindow(e,wi)):es;
    $('.rv-event-inspector',n).innerHTML=`<span class="rv-code">EVENT / SELECTED</span><strong class="rv-event-index">${String(selected+1).padStart(2,'0')}</strong><h4>${time(e).toFixed(2)} s<br>${directions[e.direction]}</h4><dl><div><dt>源时间</dt><dd>${e.event_time_a_s.toFixed(3)} s</dd></div><div><dt>来源索引</dt><dd>${E(e.gold_shot_id.split('_').slice(0,2).join('_'))}</dd></div><div><dt>证据状态</dt><dd>${e.actual_status==='observed_no_response_zero'?'未出现回应':e.actual_status==='observed_contact_model_estimate'?'接触已确认':'模型候选 / 见原表'}</dd></div></dl><p>${e.actual_status==='observed_contact_model_estimate'?'存在接触证据，因此可以保留 Actual 模型候选；这并不把估计变成训练成效。':'模型与观察分别标记。没有接触证据的维度不自动成为已实现结果。'}</p><figure>${crop('fig01_shared_rally','30 202 780 440',2000,1588,'原论文共享案例的A机位，事件2的固定证据图')}<figcaption>Fig. 1 / 固定证据锚点：事件 #02，6.80 s。上方选择不伪装为逐帧视频同步。</figcaption></figure>`;
    const cnt=d=>span.filter(e=>e.direction===d).length;
    $('.rv-window-summary',n).innerHTML=[[span.length,wi?`${(wi-1)*5}—${(wi-1)*5+10} s / 事件`:'0—30 s / 事件'],[cnt('A_to_B'),'○ P01 → P02'],[cnt('B_to_A'),'□ P02 → P01'],[cnt('unknown'),'◇ 未确认方向']].map(([a,b])=>`<div><strong>${a}</strong>${b}</div>`).join('');
    const dims=[['response_continuity','回应连续'],['technique_transition','技术转换'],['placement_line_control','落点 / 线路'],['spatial_coverage','空间覆盖'],['movement_demand','移动需求'],['recovery_readiness','回位准备'],['rhythm_stability_variation','节奏变化'],['decision_pressure','决策压力']];
    $('[data-rv-parent]',n).innerHTML='<p>共享 0—100 模型尺度。○ 为 Offer；■ 为 Actual-model，非成功率。</p>'+dims.map(([k,name])=>{const a=e['offer_'+k],b=e['actual_'+k];return `<div><span>${name}</span><div class="rv-parent-track">${a!==null?`<i style="left:${a}%"></i>`:''}${b!==null?`<b style="left:${b}%"></b>`:''}</div><code>${a===null?'—':a.toFixed(2)} / ${b===null?'—':b.toFixed(2)}</code></div>`;}).join('')+'<p>0　　　　　　　　　　　　　　　　　50　　　　　　　　　　　　　　　　　100</p>';
   }
   function sync(){$$('[data-rv-window]',n).forEach((b,i)=>b.setAttribute('aria-pressed',String(i===wi)));}
   function chooseWindow(i){wi=i;if(!inWindow(es[selected],wi))selected=es.findIndex(e=>inWindow(e,wi));sync();draw();}
   tabs(n,'data-rv-window',chooseWindow);
  }).catch(()=>loadError(n));
 }
 function rallyFindings(){
  const rows=[
    {code:'G07_03 / §4.1',title:'练习条件，依赖双方的下一次回球。',box:'20 335 610 325',a:'P09',b:'P10',left:'有意把球送到前场，让搭档练习发接发。',right:'只有双方回球保持较低时，才觉得在一起练；球一挑高，练习就散开。',decision:'用区间标注保留条件持续的范围。单拍记录显示动作，过程范围表达“这段练习何时成立”。'},
    {code:'G03 / §4.2',title:'同一对搭档，选择了不同的共同练习片段。',box:'25 822 610 265',a:'P06 · G03_02',b:'P05 · G03_03',left:'刻意送中场球，让搭档更容易回球；两人此前讨论过安排。',right:'聊天后更放松，也更想移动，因此选择另一段。',decision:'陈述保留独立锚点，并允许在旁边回复。不同定位不由系统强行合并成一个答案。'},
   {code:'G01_04 / G03_02 / §4.3',title:'有用的重复，可能跨越几次独立尝试。',box:'10 1485 650 450',a:'P02 · G01_04',b:'P05 · G03_02',left:'把网前球回到想要的位置，类似来球再次做到，就是练习。',right:'后来放松让小球更容易，却也更容易忘记原本的目标。',decision:'下一步计划保留“仍在讨论”状态。将某次成功尝试与一段持续练习区分开。'}
  ];
  const n=panel('FINDINGS / SOURCE → DESIGN','让研究发现，进入具体的交互决定。',controls(['01 / 条件','02 / 定位','03 / 重复'],'data-rv-finding')+'<div class="rv-findings-spread"><div class="rv-findings-art"></div><div class="rv-findings-reading" aria-live="polite"></div></div>'+source('源论文 Fig. 2 / §4.1—4.3。图标裁自原研究图；中文为原陈述意译，案例范围各自保留。交互决定结合回顾反馈，不作为新增研究结果。'),'↳');
  chapter(5)?.replaceChildren(n);tabs(n,'data-rv-finding',i=>{const r=rows[i];$('.rv-findings-art',n).innerHTML=crop('fig02_findings_contrasts',r.box,2000,1993,r.title+'，原研究示意图');$('.rv-findings-reading',n).innerHTML=`<span class="rv-code">${r.code}</span><h4>${r.title}</h4><div class="rv-pair-accounts"><article><b>${r.a}</b><p>${r.left}</p></article><article><b>${r.b}</b><p>${r.right}</p></article></div><div class="rv-implication"><span>DESIGN IMPLICATION / 设计决定</span><p>${r.decision}</p></div>`;});
 }
 function rallyPaper(){
  const rows=[['fig03_five_sources','多路依据有自己的时间范围。','目标卡记录当时的计划，视频记录动作，教练意见连接阶段，双方回顾保持独立解释。Fig. 3 中教练的 594 s 是同阶段另一窗口，不能当作 6.80 s 事件的逐拍评价。'],['fig04_goal_heatmap_g01_02','共享尺度下，查看两个方向的模型维度。','上半格为 Offer，下半格为 Actual-model；共用 0—100 尺度，未知方向单列。该图是模型估计而非实际训练表现分数。'],['figS5_goal_heatmap_g01_04','目标变了，检查的维度也要跟着变化。','G01_04 的网前练习使用自己的所选目标头。图中多数 Actual-model 单元没有观察回应证据，因此不能当作已实现结果。'],['fig05_rallylens_three_layers','回放、观察与估计分层，但选择保持一致。','三个层级保留同一片段、事件与播放位置。小球场、双方陈述和模型候选在各自层级出现，避免来源混淆。']];
  const n=panel('PAPER ATLAS / ORIGINAL FIGURES','论文中的关键图，回到它们解释的问题。',controls(['来源 / Fig.3','方向维度 / Fig.4','网前案例 / Fig.S5','三层原型 / Fig.5'],'data-rv-paper')+'<div class="rv-paper-description" aria-live="polite"></div><div class="rv-paper-display"></div>'+source('来自主论文与 supplement 的既有图，不重算或填补数值。图内的旧版案例范围沿用原图；项目总范围以本页背景中的最新补充为准。'),'04');
  chapter(2)?.append(n);tabs(n,'data-rv-paper',i=>{const [key,title,desc]=rows[i];$('.rv-paper-display',n).innerHTML=`<img src="${A+key}.webp" alt="${E(title)}" loading="lazy">`;$('.rv-paper-description',n).innerHTML=`<h4>${title}</h4><p>${desc}</p>`;});
 }
 function privacyDiagnostics(){
  const n=panel('MODEL DIAGNOSTICS / FIXED EXPERIMENT','高召回之外，也要检查拒绝与概率。',controls(['01 / 两类召回','02 / 校准误差','03 / 概率误差'],'data-rv-diagnostic')+'<div class="rv-privacy-spread"><div class="rv-privacy-plot"><div class="rv-scroll" tabindex="0" aria-label="五模型诊断图，可横向滚动"><div data-rv-diagnostic-plot></div></div></div><aside class="rv-privacy-reading" aria-live="polite"></aside></div>'+source('精确使用 model_comparison.json 的同一次 5,000 合成样本实验，测试集 750。召回率与特异度以 0—1 共享轴比较；ECE 和 Brier 使用各自明确范围，不与其他轮次的制图脚本混算。'),'±');
  chapter(3)?.append(n);
  fetch('assets/editorial/privacy-models.json').then(r=>r.json()).then(data=>{const rows=Object.entries(data.models),names=['NumPy MLP','PyTorch MLP','Logistic Regression','Decision Tree','Random Forest'];tabs(n,'data-rv-diagnostic',mode=>{
   const max=mode===0?1:mode===1?.3:.15,x=v=>180+v/max*390;let b='';
   for(let i=0;i<=4;i++){const t=max*i/4;b+=`<path d="M${x(t)} 50V385" class="rv-grid"/><text x="${x(t)}" y="420" text-anchor="middle">${t.toFixed(mode===0?2:3)}</text>`;}
   rows.forEach(([key,m],j)=>{const y=90+j*65;b+=`<text x="12" y="${y+4}" class="rv-model-label">${names[j]}</text>`;if(mode===0){b+=`<path d="M${x(m.specificity)} ${y}H${x(m.recall)}" stroke="#9a7c85" stroke-width="2"/><circle cx="${x(m.recall)}" cy="${y}" r="7" class="rv-dot"/><rect x="${x(m.specificity)-6}" y="${y-6}" width="12" height="12" class="rv-model-alt"/><text x="180" y="${y+24}" class="rv-model-value">召回 ${m.recall.toFixed(4)}　特异 ${m.specificity.toFixed(4)}</text>`;}else{const v=mode===1?m.ece:m.brier_score;b+=`<rect x="${x(0)}" y="${y-9}" width="${x(v)-x(0)}" height="18" class="rv-model-bar"/><text x="${Math.min(x(v)+10,580)}" y="${y+5}" class="rv-model-value">${v.toFixed(4)}</text>`;}});
   const labels=['○ Compromise recall　■ Protected specificity','ECE / 越低越好','Brier / 越低越好'];b+=`<text x="180" y="26">${labels[mode]}</text>`;$('[data-rv-diagnostic-plot]',n).innerHTML=svg(640,445,b,'五模型同一实验的分类和概率诊断');
   const m=rows[0][1];$('.rv-privacy-reading',n).innerHTML=mode===0?`<span class="rv-code">NUMPY MLP / TWO CLASSES</span><strong>${m.balanced_accuracy.toFixed(4)}</strong><h4>平衡准确率</h4><p>测试集正类占 ${ (data.dataset_info.pos_ratio_test*100).toFixed(2)}%。仅看整体准确率，会弱化对“拒绝 / 保护”类别的检查。</p><dl><div><dt>妥协类召回</dt><dd>${m.recall.toFixed(4)}</dd></div><div><dt>保护类特异度</dt><dd>${m.specificity.toFixed(4)}</dd></div><div><dt>整体准确率</dt><dd>${m.accuracy.toFixed(4)}</dd></div></dl>`:`<span class="rv-code">NUMPY MLP / PROBABILITY QUALITY</span><strong>${(mode===1?m.ece:m.brier_score).toFixed(4)}</strong><h4>${mode===1?'ECE / 校准偏差':'Brier / 概率误差'}</h4><p>${mode===1?'检查给出的置信度与实际频率是否相符。较高 AUC 不能单独说明概率可信。':'检查概率预测与二元结果的平方误差。它同时受到分类与校准影响。'}</p><p>图上每一条均来自同一固定实验。原型当前采用规则反馈，离线预测未被写作线上用户模型。</p>`;
  });}).catch(()=>loadError(n));
 }
 function privacyArchitecture(){
  const n=panel('TRAINING ANATOMY / NUMPY IMPLEMENTATION','前向计算给出概率，反向计算更新权重。',`<div class="rv-network-spread"><div class="rv-network-art">${svg(760,510,`<path d="M60 125H690M690 340H60" class="rv-edge"/><text x="40" y="52">FORWARD / 前向</text><text x="40" y="460">BACKWARD / 反向</text>${[[55,48,'输入'],[230,64,'隐藏层 1'],[410,32,'隐藏层 2'],[590,1,'输出']].map(([x,size,name],j)=>`<rect x="${x}" y="85" width="115" height="280" class="rv-node"/><text x="${x+15}" y="116">${name}</text><text x="${x+15}" y="158" style="font-size:34px">${size}</text>${Array.from({length:Math.min(size,7)},(_,k)=>`<circle cx="${x+58}" cy="${200+k*20}" r="5" fill="${j===3?'#fe95aa':'#b9d1c4'}"/>`).join('')}<text x="${x+12}" y="399">${j===0?'[0,1] 特征':j===3?'Sigmoid':'ReLU'}</text>`).join('')}<path d="M170 240H230M345 240H410M525 240H590" stroke="#ff92a5" stroke-width="3"/><text x="270" y="486">梯度检查 → 优化器 → 下一轮参数</text>`,'48到64到32到1的模型与双向计算关系')}</div><div class="rv-network-reading"><span class="rv-code">5,249 PARAMETERS / FROM SCRATCH</span><h4>把实现拆成可检查的模块。</h4><code>z = XW + b<br>a = ReLU(z)<br>p = sigmoid(z₃)</code><p>模型代码分别组织层、激活、损失、优化器与正则项；梯度检查比较解析梯度和数值差分。</p><p>训练集更新参数，验证集用于选择与早停，测试集保留给最后比较。合成器、模型与网页反馈属于不同模块。</p><small>图中的圆点代表层结构，不逐个代表全部神经元；宽度以数字明确标注。</small></div></div>`+source('依据 model/mlp.py、layers.py、activations.py、training/grad_check.py 与 trainer.py 重绘。此图说明实际代码组织，不声明生产部署或真实玩家在线推断。'),'↔');
  chapter(4)?.append(n);
 }
 function tennisResearch(){
  const n=panel('RESEARCH → PRODUCT / ORIGINAL UX MATERIAL','从用户原话，推到审看与发布的决定。',`<div class="rv-tennis-ux"><div class="rv-tennis-research">${crop('tennis-report-07','63 184 1175 405',1300,732,'原PPT访谈编码矩阵，心理阻抗、识别信任、创作主权与深度负荷')}</div><div class="rv-tennis-choices">${[['01','不想公开“打得不好”的自己','出口保留私域、存档和公开选择，降低分享压力。'],['02','识别错误要能被人纠正','把自动分析放进人机协作流程，保留修改与重制入口。'],['03','希望自己选高光与风格','允许参与片段选择，将个性表达交还给球员。'],['04','想知道下一次如何改进','将数据整理成可读反馈，避免一次堆出全部指标。']].map(([i,t,d])=>`<article class="rv-tennis-choice"><b>${i}</b><div><h4>${t}</h4><p>${d}</p></div></article>`).join('')}</div></div>`+source('依据最终汇报第 7 页的 S1—S4 定性编码与设计映射重排；不是满意度统计。原始访谈指南、主题编码与旅程被组织到需求—决定链中。'),'S1–4');
  chapter(1)?.append(n);
 }
 function tennisArt(){
  const art=$('.edit-tennis-art');if(!art)return;
  const menu=document.createElement('div');menu.className='rv-art-menu';menu.setAttribute('role','group');
  const rows=[['冲击 / IMPACT','assets/composition/tennis-impact.webp','冲击特效原透明图层'],['风格 / COMIC','assets/composition/tennis-fx.webp','漫画特效原透明图层'],['身体 / SKELETON','assets/composition/tennis-skeleton.webp','骨骼结构原透明图层'],['分析 / TRACE',A+'tennis-analysis.webp','原分析透卡图层']];
  menu.innerHTML=rows.map(([label],i)=>`<button data-rv-art="${i}" aria-pressed="${i===0}">${label}</button>`).join('');$('.edit-tennis-spread')?.append(menu);
  tabs(menu,'data-rv-art',i=>{const [label,href,desc]=rows[i];art.innerHTML=`<svg class="rv-art-crop" viewBox="0 0 900 1000" role="img" aria-label="${desc}的编辑式构图"><title>${desc}</title><desc>原项目透卡重组，文字与数值为设计表达，非球员实测。</desc><rect width="900" height="1000" fill="#dfebd9"/><path d="M40 120H860M40 900H860M40 120V900M860 120V900" stroke="#9aaf9a" fill="none"/><text x="65" y="83" style="font:18px monospace;fill:#294539">${label}</text><svg x="105" y="138" width="690" height="700" viewBox="0 0 1200 1800" preserveAspectRatio="xMidYMid meet"><image href="${href}" width="1200" height="1800" preserveAspectRatio="xMidYMid meet"/></svg><text x="65" y="938" style="font:17px monospace;fill:#294539">SOURCE LAYER / 非实测数据</text></svg>`;});
  const title=$('.edit-heading h3',$('.edit-tennis-effects'));if(title)title.textContent='不同信号，选择不同的视觉表达。';
 }
 function tennisTechnology(){
  const rows=[['INPUT','原视频与时间基准','视频、帧率与时间索引是后续分析和合成的共同入口。'],['POSE','姿态结构与动作状态','MediaPipe 33 点姿态、平滑滤波、关节运动特征与动作阶段。'],['TRAJECTORY','球轨迹与事件','TrackNetV2 连接球路、变化点与事件；分析输出必须保持时间对齐。'],['FX RENDER','双路径特效渲染','EffectDirector 组织包络与事件触发，OpenCV 与 Remotion 承担不同渲染路径。'],['AI CONTENT','共享输入与个性化内容','MatchBundle 连接风格化影像、图文与旁白，保留相同运动依据。'],['POST','多轨合成与输出','真人影像、动态文字、特效、声音与字幕进入同一合成流程。'],['DELIVERY','复用与分发','组织素材、输出规格与交付，便于重制和不同载体适配。']];
  const n=panel('TECHNICAL PLATES / SOURCE DESIGN','七张原技术图，展开同一套制作架构。',controls(rows.map((r,i)=>`0${i+1} / ${r[0]}`),'data-rv-tech')+'<div class="rv-tech-stage"><div class="rv-tech-art"></div><div class="rv-tech-reading" aria-live="polite"></div></div>'+source('原技术图来自“海报物料设计 / 物料 / 技术栈”1—7。它们保留原团队的实现与设计说明；原图中的参数、生成模块和性能表述不提升为本次重新验证的结果。'),'07');
  chapter(3)?.append(n);tabs(n,'data-rv-tech',i=>{$('.rv-tech-art',n).innerHTML=`<img src="${A}tennis-tech-${i+1}.webp" alt="TennisAtom第${i+1}张原技术架构图" loading="lazy">`;$('.rv-tech-reading',n).innerHTML=`<span class="rv-code">MODULE / 0${i+1}</span><h4>${rows[i][1]}</h4><p>${rows[i][2]}</p><p>上方原生架构图用于快速读模块关系，这里保留原技术图中的细节。选择编号逐层核对，不将七张缩成难读的缩略图。</p>`;});
 }
 function tennisNarrative(){
   const styles=[['SILENT ARCHIVE','沉稳的档案语气','322 356 170 88'],['KINETIC ECHO','声音与运动波纹','553 357 165 86'],['TACTICAL MATRIX','几何与线路决策','784 356 168 88'],['EMOTION SPLASH','热烈的球场表达','1012 356 170 88']];
  const n=panel('STYLE SYSTEM / FOUR PORTRAITS','同一运动输入，进入四种影像语言。',`<div class="rv-tennis-specimens">${styles.map(([name,desc,box])=>`<figure>${crop('tennis-report-20',box,1300,732,name+'原视觉样本')}<figcaption><b>${name}</b>${desc}</figcaption></figure>`).join('')}</div><div class="rv-story-score"><div class="rv-scroll" tabindex="0" aria-label="26秒分镜节奏，可横向滚动"><div>${svg(900,215,`<text x="30" y="30">NARRATIVE SCORE / 原汇报中的 26 秒节奏骨架</text><path d="M35 110H865" stroke="#afbfae"/>${[[0,3,'开场钩子','FocusBox'],[3,12,'推进叙事','SpeedTrail'],[12,18,'节奏加速','RhythmPulse'],[18,22,'最强瞬间','Glitch / Impact'],[22,26,'回归余韵','Constellation']].map(([a,b,t,e],i)=>{const x=35+a/26*830,w=(b-a)/26*830;return `<rect x="${x}" y="70" width="${w-3}" height="40" fill="${i===3?'#ff7434':'#415e50'}"/><text x="${x+8}" y="96" style="font-size:14px;fill:#fff">${a}—${b} s</text><text x="${x+5}" y="146">${t}</text><text x="${x+5}" y="178" style="font-size:13px;fill:#d9e8d5">${e}</text>`;}).join('')}`,'原分镜五阶段与对应特效','区间来自最终汇报第14页，不是情绪测量或所有成片的实际镜头时长。')}</div></div></div><div class="rv-story-note"><p>视觉风格改变的是观看语气和构图组织。沉稳档案、律动波纹、几何决策与热烈球场，均保留真人作为识别锚点。</p><p>分镜骨架来自原汇报第 14 页，样本来自第 20 页。时间用于讲解编辑节奏，不作为情绪数据，也不要求五支成片采用相同时长。</p></div>`+source('原 PPT 的风格与分镜被拆分重组为样本和节奏谱，保留原图。上方五支真人成片承担实际效果展示，这里解释视觉选择与制作方法。'),'04');
  chapter(4)?.append(n);
 }
})();
