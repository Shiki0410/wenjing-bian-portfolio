/* A source-led editorial system. Native project controls retain their event owners. */
(() => {
 'use strict';
 const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 const E=(tag,cls,html='')=>{const x=document.createElement(tag);x.className=cls;x.innerHTML=html;return x;};
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const art=(key,caption,cls='')=>`<figure class="folio-source ${cls}"><button data-book-art="${key}" data-caption="${esc(caption)}" aria-label="放大：${esc(caption)}"><img src="assets/${key}.webp" alt="${esc(caption)}" loading="lazy" decoding="async"></button><figcaption>${esc(caption)}</figcaption></figure>`;
 const specs={
  rallylens:{accent:'#2354d8',paper:'#eeefe9',cover:'rally-court',inset:'rally-ui',title:'RallyLens',line:'同一场练习。<br>两个人的解释。',code:'FIELD NOTES / DYADIC PRACTICE',motif:'court',chapters:['field','diagram','interface','sequence','ledger']},
  'privacy-city':{accent:'#d9285d',paper:'#f2edef',cover:'privacy-scene1',inset:'privacy-compare',title:'Privacy City',line:'一次授权，<br>一段决策过程。',code:'PERMISSION / BEHAVIOUR / MODEL',motif:'permission',chapters:['interface','diagram','model','ledger']},
  tennisatom:{accent:'#ff5b00',paper:'#f9f9f9',cover:'tennis-real-5',inset:'tennis-real-3',title:'TennisAtom',line:'身体的肖像',code:'MOTION INTO A PERSONAL FILM',motif:'motion',chapters:['portrait','diagram','diagram','posters','cinema']},
  baseball:{accent:'#ee493d',paper:'#ecece5',cover:'baseball-web-hero',inset:'baseball-web-detail',title:'Pitch / Impact',line:'从投球，<br>读到击球。',code:'STATCAST / NARRATIVE DATA WEBSITE',motif:'pitch',chapters:['panorama','interface','atlas']},
   artemis:{accent:'#3b6149',paper:'#ecece6',cover:'artemis-boss',inset:'artemis-build',title:'Artemis',line:'重返星海',code:'HEX / BUILD / TELEGRAPH',motif:'hex',chapters:['panorama','diagram','diagram','combat']},
  afterglow:{accent:'#e1c234',paper:'#eeede4',cover:'afterglow-glyph',inset:'afterglow-dome',title:'AFTERGLOW',line:'环境有了<br>自己的字形。',code:'SHANGHAI SOUTH / ENVIRONMENTAL GLYPH',motif:'radial',chapters:['encoding','diagram','exhibition']},
  'growth-compass':{accent:'#2357e8',paper:'#f0f1e8',cover:'growth-tasting-original',inset:'growth-canvas-original',title:'Growth Compass',line:'先体验，<br>再选择。',code:'COURSE DISCOVERY / LEARNING SUPPORT',motif:'journey',chapters:['research','diagram','storyboard','journey','system']},
  looplab:{accent:'#236656',paper:'#f1f0e4',cover:'loop-source-09',inset:'loop-materials',title:'LoopLab',line:'材料再流转。<br>制作有着落。',code:'CAMPUS / MATERIALS / SERVICE',motif:'handoff',chapters:['benchmark','mvp','diagram']},
  garden:{accent:'#a24734',paper:'#f3efe2',cover:'garden-autumn-overview',inset:'garden-fan',title:'游园画境',line:'改字成景。<br>穿行四季。',code:'网师园篇 / 文化解谜 / 跨端交互',motif:'poem',chapters:['panorama','poetry','atlas','interface']}
 };
 const SVG=(content,desc)=>`<svg viewBox="0 0 440 220" role="img" aria-label="${desc}" class="folio-mark"><g fill="none" stroke="currentColor" stroke-width="1.4">${content}</g></svg>`;
 function motif(kind){
  switch(kind){
   case 'court':return SVG('<path d="M75 22H365V196H75ZM75 109H365M104 22V196M336 22V196M75 67H365M75 152H365M220 22V67M220 152V196"/><path d="M137 141Q176 45 296 78M300 77l-11-6m11 6-5 12"/><circle cx="137" cy="141" r="5"/><circle cx="298" cy="77" r="5"/>','双人练习的方向与球场结构示意，不表示测量轨迹');
   case 'permission':return SVG('<path d="M44 50H310V162H44M310 50V98M310 122V162M75 84H249M75 110H202M75 137H232M335 104l15 15 32-34"/><rect x="290" y="84" width="102" height="58"/>','授权文本、选择与记录的结构示意');
   case 'motion':return SVG('<path d="M30 151Q118 10 272 108T419 118M35 166Q124 44 277 127T418 138M40 183Q126 70 279 148T414 157"/><path d="M254 96v36M236 114h36"/><circle cx="254" cy="114" r="23"/>','运动轨迹与冲击时刻的非测量图形');
   case 'pitch':return SVG('<path d="M85 163L220 35 355 163 220 204ZM220 124v80M85 163h270"/><circle cx="220" cy="124" r="30"/><path d="M222 122Q328 60 365 24"/>','棒球场结构与投打关系示意，不承载比赛统计');
   case 'hex':return SVG([0,1,2,3,4].map((i)=>{const x=105+i*52,y=i%2?86:116;return `<path d="M${x-25} ${y}l13-22h25l13 22-13 22h-25Z"/>`;}).join('')+'<path d="M105 116L157 86 209 116 261 86 313 116"/>','Hex 相邻格路径结构；非实机关卡');
   case 'radial':return SVG(Array.from({length:28},(_,i)=>{const a=i*Math.PI/14,x=220+70*Math.cos(a),y=110+70*Math.sin(a);return `<path d="M${x} ${y}l${28*Math.cos(a)} ${28*Math.sin(a)}"/>`;}).join('')+'<circle cx="220" cy="110" r="52"/>','径向图形的统一骨架示意；无环境测量值');
   case 'journey':return SVG('<path d="M40 60H400M40 160H400"/>'+[40,130,220,310,400].map(x=>`<rect x="${x-17}" y="43" width="34" height="34"/><rect x="${x-17}" y="143" width="34" height="34"/>`).join('')+'<path d="M220 78v62M213 130l7 10 7-10"/>','课外与课中的两条五阶段旅程；图形不表示满意度或能力数值');
   case 'handoff':return SVG('<path d="M75 65l48-27 48 27v68l-48 27-48-27ZM75 65l48 28 48-28M123 93v67M218 92h112l-18-13m18 13-18 13M235 141h128v37H235M251 126h94v15H251"/>','材料到制作与交接的服务结构');
   case 'poem':return SVG('<path d="M115 174Q115 48 220 27 325 48 325 174ZM115 174Q220 123 325 174M220 27V160M155 66l65 94 65-94M130 108l90 52 90-52"/>','绘梦奇扇的扇形结构示意');
   case 'bronze':return SVG('<path d="M140 43l32 18q48-30 96 0l32-18-7 90q-8 38-45 47l-28 14-28-14q-37-9-45-47ZM152 94l38 37 30-26 30 26 38-37M175 159l45-27 45 27M181 181v20M259 181v20"/><circle cx="185" cy="85" r="23"/><circle cx="255" cy="85" r="23"/><circle cx="185" cy="85" r="8"/><circle cx="255" cy="85" r="8"/><path d="M211 89l9 20 9-20"/>','鸮形器物到器灵角色的形制研究图形，不是历史器物复原');
  }
 }
 function bindSelection(root,attr,onSelect){
  const buttons=$$(`[${attr}]`,root);const activate=b=>{buttons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));onSelect(Number(b.getAttribute(attr)));};
  buttons.forEach((b,i)=>{b.addEventListener('click',()=>activate(b));b.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight'||e.key==='ArrowDown')n=(i+1)%buttons.length;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')n=(i+buttons.length-1)%buttons.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=buttons.length-1;else return;e.preventDefault();buttons[n].focus();activate(buttons[n]);});});
  if(buttons[0])activate(buttons[0]);
 }
 function sourceFold(keys,label='展开原始完整图'){
  return `<details class="folio-original"><summary>${label}<span>＋</span></summary><div>${keys.map(([k,c])=>art(k,c)).join('')}</div></details>`;
 }
  const loopPhone=()=>`<svg viewBox="1440 175 455 840" role="img" aria-label="原最终汇报中的小程序概念界面"><image href="assets/loop-source-09.webp" width="1920" height="1080"/></svg>`;
  function loopCover(){
   return `<div class="loop-product-composition"><div class="loop-cover-device">${loopPhone()}<span>原小程序设计 / MVP</span></div><div class="loop-cover-type"><span>CAMPUS MATERIAL CIRCULATION</span><strong>MAKE.<br>USE.<br>REUSE.</strong><p>材料交换<br>制作预约<br>小量团购<br>项目档案<br>校园取件</p></div></div>`;
  }
  const mechanisms={
   rallylens:[['双向证据','事件与陈述分开看',2],['并列解释','保留不同的来源',3],['时间定位','回到具体训练回合',4]],
   'privacy-city':[['授权情境','五类模拟请求',1],['行为特征','选择进入记录',2],['模型检查','排序、分类与校准',3]],
   tennisatom:[['身体肖像','动作、信号与构图',1],['制作管线','七模块与 MatchBundle',3],['项目介绍','观看整体制作过程',5]],
   baseball:[['球员叙事','从人物进入数据',1],['球种比较','原 CSV 与固定比例轴',2],['空间探索','位置与结果对应',3]],
   artemis:[['Hex 空间','移动、槽位与构筑',1],['角色行为','实际工程状态转换',2],['战斗反馈','敌人预警与 Boss',4]],
   bronze:[['叙事双线','寻亲与寻名',1],['角色设定','器物进入身体',2],['镜头制作','分镜、生成与合成',3]],
   afterglow:[['环境通道','四类信号的编码',1],['径向字形','结构与运动变化',2],['公共空间','网页与建筑尺度',3]],
   'growth-compass':[['学习期待','四类研究综合画像',1],['服务旅程','选择课程与完成作业',4],['协作网络','人、资源与预审概念',5]],
   looplab:[['机制研究','比较获取与履约',1],['产品范围','五个核心 MVP 模块',2],['材料流转','屏幕与校园交接',3]],
   garden:[['四季游园','秋、冬、春、夏',1],['改字解谜','诗句进入园景',2],['跨端交互','NPC、视角与小程序',4]]
  };
  // The reference's graphic grammar is rebuilt from each project's own structure.
  // These marks are not measurements, geographic coordinates or fake UI telemetry.
  function referenceGraphic(kind){
   let base=motif(kind)||motif('permission');
   const descriptions={court:'双人方向',permission:'选择与记录',motion:'动作与冲击',pitch:'投打空间',hex:'相邻与触发',radial:'径向编码',journey:'阶段与交接',handoff:'流转与取件',poem:'诗句与园景',bronze:'器物与身份'};
   const labels={court:['P01 → P02','P02 → P01'],permission:['REQUEST','CHOICE → RECORD'],motion:['MOTION','PERSONAL FILM'],pitch:['PITCH','IMPACT'],hex:['ROOT','TRIGGER → EFFECT'],radial:['ENVIRONMENT','TYPE IN MOTION'],journey:['BEFORE CLASS','DURING CLASS'],handoff:['MAKE / USE','CIRCULATE'],poem:['雾 → 风','云 → 月'],bronze:['ARTIFACT','NAME / IDENTITY']};
   const l=labels[kind]||['STORY','IMAGE'];
   const detail=kind==='court'?'<path d="M300 92Q303 170 151 150" fill="none" stroke="currentColor" stroke-width="6"/><path d="M152 150l15-5-2 15" fill="none" stroke="currentColor" stroke-width="3"/>':kind==='hex'?'<path d="M104 117L157 87 210 117 262 87 314 117" fill="none" stroke="currentColor" stroke-width="10"/>':kind==='permission'?'<path d="M342 170l13 13 28-30" fill="none" stroke="currentColor" stroke-width="8"/>':'';
   base=base.replace('</svg>',`${detail}<g class="graphic-type" fill="currentColor"><text x="18" y="22">${l[0]}</text><text x="422" y="212" text-anchor="end">${l[1]}</text></g></svg>`);
   return `<div class="reference-graphic graphic-${kind}"><div class="graphic-registration" aria-hidden="true"><i></i><i></i><i></i><i></i></div><div class="graphic-field">${base}</div><div class="graphic-ruler" aria-hidden="true"></div><span class="graphic-caption">${descriptions[kind]||'叙事与制作'} / STRUCTURE STUDY</span></div>`;
  }
  function referenceCover(hero,p,s){
   hero.classList.add('reference-cover');
   hero.append(E('span','reference-cover-number',p.number));
   hero.append(E('div','reference-cover-graphic',referenceGraphic(s.motif)));
   hero.append(E('p','reference-cover-label',`${esc(p.label)}<br><span>${esc(p.year)}</span>`));
   hero.append(E('nav','reference-mechanisms',mechanisms[p.id].map((m,i)=>`<a href="#chapter-${m[2]}"><span>0${i+1}</span><div><b>${m[0]}</b><small>${m[1]}</small></div><i aria-hidden="true">↘</i></a>`).join('')));
   $('.reference-mechanisms',hero).setAttribute('aria-label','项目结构入口');
  }
  function referenceChapters(cases,p,s){
   cases.forEach((c,i)=>{
    c.classList.add('reference-chapter');
    c.append(E('span','reference-chapter-number',String(i+1).padStart(2,'0')));
    const title=$('.folio-index',c)?.textContent?.replace(/^\d+\s*\//,'').trim()||'DESIGN';
    c.append(E('div','reference-chapter-stamp',`<span>${esc(p.name)}</span><b>${esc(title)}</b><i aria-hidden="true"></i>`));
    c.append(E('div','reference-chapter-graphic',referenceGraphic(s.motif)));
   });
  }
  function growthPersonas(c){
   const personas=[['焦虑努力型','想努力，但需要清晰的方向。','学习投入意愿强，容易围绕评价与要求反复确认。','先说明课程与能力的关系，提供任务支架和正反案例。',[644,5]],['积极探索型','主动寻找适合自己的资源。','愿意探索课程与跨领域机会，需要更有效的发现入口。','用课程星图、体验入口与可调整的组合支持主动选择。',[1005,5]],['受挫明确型','目标明确，课程却未必对齐。','有自己的职业或能力目标，担心课程投入不能服务个人方向。','先展示能力目标与课程案例，再通过低成本试听校准期待。',[644,369]],['被动适应型','先完成要求，还没找到目的。','个人目标不清晰，容易被学分与截止日期推着走。','用兴趣探索、可理解的学习目标与成长档案建立连接。',[1005,369]]];
   const v=$('.chapter-visuals',c);v.innerHTML=`<div class="folio-persona-reader"><div class="persona-index" role="group" aria-label="比较四类研究画像">${personas.map((x,i)=>`<button data-folio-persona="${i}" aria-pressed="${i===0}"><span>0${i+1}</span>${x[0]}</button>`).join('')}</div><div class="persona-detail" aria-live="polite"></div></div><p class="folio-source-note">研究综合画像 / 原方案插画，不对应某一个真人，也不是四位受访者的直接引语。</p>${sourceFold([['growth-personas','原方案的四类研究综合画像']],'查看原始画像材料')}`;
   bindSelection(v,'data-folio-persona',i=>{const p=personas[i];$('.persona-detail',v).innerHTML=`<div class="persona-source-crop"><svg viewBox="${p[4][0]} ${p[4][1]+29} 352 310" role="img" aria-label="${p[0]}的原方案插画"><image href="assets/growth-personas.webp" width="2000" height="752"/></svg></div><div><span class="folio-kicker">RESEARCH SYNTHESIS / 0${i+1}</span><h3>${p[1]}</h3><dl><div><dt>面对的问题</dt><dd>${p[2]}</dd></div><div><dt>服务回应</dt><dd>${p[3]}</dd></div></dl></div>`;});
   c.classList.remove('folio-layout-research');c.classList.add('folio-layout-diagram');
  }
  function growthSystem(c){
   const roles=[['学生','输出作业，累积学习记录','完成逻辑画布、提交作品，并把反馈带回下一次修改。','逻辑画布 → 预审 → 人工反馈 → 作品档案'],['教师','把目标、标准与反馈连起来','明确课程目标，维护正反案例，结合真实行业标准提供作业反馈。','课程目标 ⇄ 正反案例 ⇄ 作业评价'],['学院','维护课程与平台支撑','原方案把课程能力地图、教学目标与平台支持放在学院层面组织。','课程地图 → 平台支撑 → 教学资源'],['技术与平台','让材料进入可检查的流程','案例库支持预审规则，预审读取作业；自动建议保留转入人工讨论的出口。','案例库 → 预审概念 → 反馈记录'],['企业校友','提供行业尺度与经验','向教学与案例提供真实行业参考，参与经验分享与学生支持。','行业标准 → 教学案例 → 学习支持']];
   const v=$('.chapter-visuals',c);v.innerHTML=`<div class="folio-service-network"><p class="folio-kicker">FRONTSTAGE ⇄ BACKSTAGE / SERVICE CONCEPT</p><div class="service-role-strip" role="group" aria-label="查看服务协作角色">${roles.map((r,i)=>`<button data-folio-role="${i}" aria-pressed="${i===0}"><span>0${i+1}</span>${r[0]}</button>`).join('')}</div><div class="service-role-detail" aria-live="polite"></div></div><p class="folio-source-note">原系统图中的角色与资源关系重排；Agent 与平台为待验证服务概念，不表示已部署运行。</p>${sourceFold([['growth-system','原系统图 / 角色、作业、案例与行业资源']],'查看原系统图与连线')}`;
   bindSelection(v,'data-folio-role',i=>{const r=roles[i];$('.service-role-detail',v).innerHTML=`<strong>${r[0]}</strong><div><h3>${r[1]}</h3><p>${r[2]}</p><div class="role-path">${r[3]}</div></div>`;});
   c.classList.remove('folio-layout-system');c.classList.add('folio-layout-diagram');
  }
  function rallySequence(c){
   const views=[['全段','0 0 1630 470','两个方向，共用同一条时间轴。','上轨 P01→P02，下轨 P02→P01；保留每个回合之间的空白。'],['R1','10 75 340 330','开场回合。','局部图保留原始坐标和线型，没有从图片推算新数值。'],['R2','330 75 440 330','同一回合里的方向交换。','原图中的问号与灰色虚线保留未确认信息，不强行指派给某一方。'],['R3','810 75 420 330','方向交替，回合仍有边界。','高活动背景与事件线同时出现；它们不等同于训练质量或公平评分。'],['R4','1400 75 230 330','末段回合。','查看局部后可以回到全段；回合间空白不会被插值补齐。']];
   const v=$('.chapter-visuals',c);v.innerHTML=`<div class="folio-sequence-reader"><div class="sequence-toolbar"><span>G01_02 / ORIGINAL EVENT SEQUENCE</span><div role="group" aria-label="检查时间线回合">${views.map((x,i)=>`<button data-folio-rally="${i}" aria-pressed="${i===0}">${x[0]}</button>`).join('')}</div></div><div class="sequence-detail" aria-live="polite"></div><div class="sequence-reading-key"><p><b>P01 → P02</b>上轨方向</p><p><b>P02 → P01</b>下轨方向</p><p><b>?</b>方向仍未确认</p><p><b>空白</b>回合之间不连线</p></div></div><p class="folio-source-note">原时间线局部检查 / 使用原始图像，未重新估计概率；E、R、U 线型沿用原图。</p>${sourceFold([['rally-timeline','原始方向时间线完整图']],'核对原图与图例')}`;
   bindSelection(v,'data-folio-rally',i=>{const x=views[i];$('.sequence-detail',v).innerHTML=`<div class="sequence-focus"><svg viewBox="${x[1]}" role="img" aria-label="${x[0]} / 原时间线"><image href="assets/rally-timeline.webp" width="1630" height="470"/></svg></div><div class="sequence-note"><span>${x[0]} / READ THE EXCHANGE</span><h3>${x[2]}</h3><p>${x[3]}</p></div>`;});
  }
  function tennisDirector(c){
   const agents=[['骨骼师','PoseExtractor','从视频提取姿态关键点。','输入 / 原视频','输出 / 33 点姿态序列','运动处理核心已有'],['球探','BallTracker / MotionAnalyzer','追踪球与动作特征，为事件定位准备数据。','输入 / 视频与姿态','输出 / 轨迹与动作特征','运动处理核心已有'],['星探','EventDetector','识别候选高光，交给人做片段选择。','输入 / 动作与轨迹','输出 / 高光候选','高光选择可人工调整'],['编剧','MiMo','根据素材与语气生成分镜、社交文案；当前方案不含解说配音。','输入 / 高光与语气','输出 / 分镜与社交文案','生成 MVP 与导演交互方案'],['特效师','Effects','把动作信号映射为轨迹、描边、冲击与动态文字等效果。','输入 / 高光与动作数据','输出 / 特效画面','已有视觉效果与真人成片'],['剪辑师','Composer','将选定片段、文案和特效组织为最终视频。','输入 / 片段、分镜与效果','输出 / 成片与审看入口','合成仍含 Passthrough；分发为 DryRun']];
   const v=$('.chapter-visuals',c);v.innerHTML=`<div class="folio-director-network"><div class="director-network-heading"><span>AI DIRECTOR / 工程方案</span><h3>一支剧组。<br>两次人工选择。</h3></div><div class="director-agent-path" role="group" aria-label="查看导演流程角色">${agents.map((x,i)=>`<button data-folio-agent="${i}" aria-pressed="${i===0}" class="agent-${i}"><span>0${i+1}</span><b>${x[0]}</b><small>${x[1]}</small></button>`).join('')}</div><div class="director-agent-detail" aria-live="polite"></div><div class="director-checkpoints"><label><input type="checkbox" data-folio-check="a">人工控制点 A / 选择高光</label><label><input type="checkbox" data-folio-check="b">人工控制点 B / 选择语气</label><output data-director-check-output aria-live="polite">两处均可跳过，采用默认设置。</output></div><p class="folio-source-note">依据工程 UX 文档：编剧与特效师在高光之后并行，剪辑师汇合输出。此处是流程检查，不上传素材、不实时生成；跨场次历史与发布尚有模拟或未接入部分。</p></div>`;
   bindSelection(v,'data-folio-agent',i=>{const x=agents[i];$('.director-agent-detail',v).innerHTML=`<span class="agent-detail-id">${String(i+1).padStart(2,'0')}</span><div><h4>${x[0]} / ${x[1]}</h4><p>${x[2]}</p><dl><div><dt>${x[3].split(' / ')[0]}</dt><dd>${x[3].split(' / ')[1]}</dd></div><div><dt>${x[4].split(' / ')[0]}</dt><dd>${x[4].split(' / ')[1]}</dd></div><div><dt>实现边界</dt><dd>${x[5]}</dd></div></dl></div>`;});
   $$('[data-folio-check]',v).forEach(input=>input.addEventListener('change',()=>{const choices=$$('[data-folio-check]:checked',v).map(x=>x.dataset.folioCheck==='a'?'A：人工调整片段':'B：人工确认语气');$('[data-director-check-output]',v).textContent=choices.length?choices.join('；')+'。未选的控制点采用默认设置。':'两处均可跳过，采用默认设置。';}));
  }
  function tennisPortrait(c){
   const visual=$('.chapter-visuals',c);if(!visual)return;
   visual.prepend(E('div','reference-portrait-type','<span>MOTION → PERSONAL FILM</span><strong>THE<br>BODY<span>AS</span>PORTRAIT.</strong><div class="portrait-motion-mark">'+referenceGraphic('motion')+'</div><p>身体的肖像 / 真人定制影像<br>动作数据、个人表达与视觉制作</p>'));
   visual.classList.add('reference-portrait-composition');
  }
  async function baseballSource(c){
   const v=$('.chapter-visuals',c);v.innerHTML=`<div class="folio-pitch-reader"><div class="pitch-reader-heading"><span>YOSHINOBU YAMAMOTO / SOURCE CSV</span><h3>球种改变。<br>分母也要看清。</h3></div><div class="pitch-year-controls" role="group" aria-label="选择源数据年份"></div><div class="pitch-reading-body" aria-live="polite"><p>正在读取原 CSV 的汇总。</p></div><p class="folio-source-note">按本地原 CSV 重新统计，未套用旧截图中的展示数值。每年以该年全部记录为分母；球速空值不进入均值。占比轴固定为 0—100%，不是相对最长条。</p></div>${sourceFold([['baseball-web-lab','原网站图表实验室截图 / 制作时的展示版本']],'查看原网站图表实验室')}`;
    const reader=$('.folio-pitch-reader',v);
    try{
    const response=await fetch('assets/baseball-pitch-summary.json');if(!response.ok)throw new Error('source unavailable');const d=await response.json();
     if(!reader.isConnected)return;
     $('.pitch-year-controls',reader).innerHTML=d.years.map((y,i)=>`<button data-pitch-year="${i}" aria-pressed="${i===0}"><span>${y.year}</span><small>${y.total.toLocaleString()} 条记录</small></button>`).join('');
    bindSelection(v,'data-pitch-year',i=>{const y=d.years[i];$('.pitch-reading-body',v).innerHTML=`<div class="pitch-data-scope"><b>${y.total.toLocaleString()}<span>条投球记录</span></b><p>${y.dateStart} — ${y.dateEnd}<br>文件中的日期范围，不代表完整赛季</p></div><div class="pitch-chart-axis"><span>球种 / PITCH TYPE</span><span>占全部记录的比例 / 0 ─ 50 ─ 100%</span><span>平均球速 / mph</span></div><div class="pitch-source-rows">${y.types.map(t=>`<div><span class="pitch-type-name">${esc(t.name)}<small>${t.count.toLocaleString()} 条 · 球速有效 ${t.speedN.toLocaleString()} 条</small></span><div class="pitch-bar-track"><span style="width:${t.share*100}%"></span><b>${(t.share*100).toFixed(1)}%</b></div><strong>${t.meanSpeed===null?'—':t.meanSpeed.toFixed(1)}<small>${t.missingSpeed?'缺失 '+t.missingSpeed+' 条':'mph'}</small></strong></div>`).join('')}</div><details class="pitch-accessible-data"><summary>展开精确数值表</summary><div class="pitch-table-scroll"><table><caption>${y.year} / 原 CSV 分组统计</caption><thead><tr><th>球种</th><th>记录数</th><th>占比</th><th>均速 mph</th><th>速度缺失</th></tr></thead><tbody>${y.types.map(t=>`<tr><th scope="row">${esc(t.name)}</th><td>${t.count}</td><td>${(t.share*100).toFixed(2)}%</td><td>${t.meanSpeed===null?'—':t.meanSpeed.toFixed(2)}</td><td>${t.missingSpeed}</td></tr>`).join('')}</tbody></table></div></details>`;});
    }catch(error){const message=$('.pitch-reading-body',reader);if(reader.isConnected&&message)message.textContent='暂时无法读取数据；可展开下方原始界面查看。';}
   c.classList.remove('folio-layout-interface');c.classList.add('folio-layout-diagram');
  }
  function gardenPuzzle(c){
   const demo=$('.garden-poem-demo'),v=$('.chapter-visuals',c);if(!demo||!v)return;
   v.innerHTML=`<div class="folio-garden-puzzle"><div class="garden-native-poem"></div>${art('garden-fan','原游戏奇扇界面 / 此截图是另一组谜题，不与左侧示例逐字对应')}</div>${sourceFold([['garden-fan-guide','原游戏奇扇教学界面']],'查看原奇扇教学')}`;
   $('.garden-native-poem',v).append(demo);
  }
  // Dense source diagrams stay available at readable scale. Wheel / touch / keyboard
  // scrolling pans the source, never changes its observations or aspect ratio.
  function sourceInspectors(){
   $$('.case-figure,.folio-original .folio-source').forEach((f,index)=>{
    if(f.closest('.folio-cover,#design-assets')||f.classList.contains('folio-inspectable'))return;
    const img=$('img',f),button=$('button',f);if(!img||!button)return;
    if(!/privacy-compare|rally-ui|rally-accounts|baseball-web|garden-fan|garden-tour|afterglow-web|afterglow-source-poster|growth-personas|growth-system|growth-.*journey|loop-source/.test(img.getAttribute('src')))return;
    f.classList.add('folio-inspectable');const toolbar=E('div','folio-figure-tools',`<span>原图阅读</span><button data-source-zoom="1" aria-pressed="true">适应宽度</button><button data-source-zoom="1.8" aria-pressed="false">放大细节</button><button data-source-zoom="2.6" aria-pressed="false">精读</button>`);const pane=E('div','folio-source-pan');pane.tabIndex=0;pane.setAttribute('role','region');pane.setAttribute('aria-label',(img.alt||'原图')+'，放大后可滚动查看');button.replaceWith(pane);pane.append(button);button.style.transformOrigin='top left';f.prepend(toolbar);
    $$('[data-source-zoom]',toolbar).forEach(b=>b.addEventListener('click',()=>{const scale=Number(b.dataset.sourceZoom);$$('[data-source-zoom]',toolbar).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));button.style.width=scale*100+'%';pane.classList.toggle('is-zoomed',scale>1);pane.scrollLeft=0;pane.scrollTop=0;}));
   });
  }
 function decorateChapter(c,i,s){
  c.classList.add('folio-chapter','folio-layout-'+s.chapters[i]);
  const heading=$('.chapter-heading',c),visual=$('.chapter-visuals',c);
  if(heading){const eyebrow=$('.eyebrow',heading);if(eyebrow){eyebrow.classList.add('folio-index');c.prepend(eyebrow);}heading.append(E('span','folio-chapter-rail',`${String(i+1).padStart(2,'0')} / ${s.code}`));}
  if(visual){visual.classList.add('folio-composition');const galleries=$$('.figure-gallery',visual);galleries.forEach(g=>g.classList.add('folio-montage'));}
  $$('.case-cards',c).forEach(x=>x.classList.add('folio-ledger'));
 }
 const journeys={
  course:{label:'课外 / 课程选择',source:'growth-course-journey',phases:[
   ['探索兴趣','先认识自己想学什么','H5 设计 DNA 探索将兴趣变成可讨论的方向，不作为能力测评。','兴趣探索 / 课程导航','教务与技术团队维护入口、课程标签与资源。'],
   ['预见课程','先看到目标，再选课程','课程星图与 WHY 预告片说明课程能带来什么；感兴趣的课程先进入试听池。','课程星图 / 60 秒预告','教师提供教学目标和案例，技术团队组织预览。'],
   ['低成本试听','用一次小体验校准期待','开放周与 5 分钟微工作坊降低试错成本；学生可以保留、删除或调整选择。','开放周 / 微工作坊','教师组织体验任务，教务协调时间与容量。'],
   ['调整并承诺','把兴趣变成正式选择','根据试听重新组合课程，检查学习目标和学分要求，再完成正式选课。','选课调整 / 目标确认','教务与技术团队支持规则检查和课程衔接。'],
   ['留存成长','作品成为下一次选择的依据','课程结束后回顾能力变化、整理作品档案，积累个人学习星图与经验。','作品档案 / 学期回顾','学生维护档案，教师与校友提供作品反馈和经验。']
  ]},
  learning:{label:'课中 / 完成作业',source:'growth-learning-journey',phases:[
   ['理解任务','先对齐任务与评价要求','把课程目标、任务约束与行业标准放在同一入口，减少对最终结果的猜测。','任务说明 / 正反案例','教师明确要求，案例库维护可比较的参考。'],
   ['搭建支架','先完成思考，再开启预审','用作业逻辑画布表达目标、问题与核心策略；完成画布后才进入 Agent 预审概念路径。','逻辑画布 / 案例库','教师提供支架；Agent 入口以画布完成作为前置条件。'],
   ['快速预审','及时发现基础方向错误','上传初步方案，概念中的 Agent 检查目标与方案是否对齐，再提供下一步建议。','方案上传 / 即时反馈','预审属于待验证服务概念，不表示已有运行效果。'],
   ['深入诊断','把自动建议交还给人讨论','结合教师反馈与深入诊断修改方案；遇到复杂问题可转入朋辈或教师问诊。','诊断报告 / 人工问诊','教师、朋辈与学生共同判断，不让 Agent 替代最终评价。'],
   ['交付归档','让一次作业进入成长记录','完成提交、互评与作品整理，把经验和成果连接到后续课程与个人发展。','作品提交 / 互评 / 归档','教师评价，学生整理档案，朋辈经验继续流转。']
  ]}
 };
 function growthJourney(c){
  const visuals=$('.chapter-visuals',c);if(!visuals)return;
  visuals.innerHTML=`<div class="folio-journey-reader"><div class="journey-mode" role="group" aria-label="选择服务旅程"><button data-folio-journey="0" aria-pressed="true">课外 / 课程选择</button><button data-folio-journey="1" aria-pressed="false">课中 / 完成作业</button></div><div class="journey-stations" role="group" aria-label="选择旅程阶段"></div><div class="journey-scene-editorial" aria-live="polite"></div><p class="folio-source-note">原用户旅程拆解阅读 / 目标体验，不是已测量的满意度；Agent 为服务概念。</p>${sourceFold([['growth-course-journey','原方案 · 课外服务旅程完整图'],['growth-learning-journey','原方案 · 课中服务旅程完整图']],'查看两份原始用户旅程')}</div>`;
  const root=$('.folio-journey-reader',c);let mode='course';
  const show=i=>{const d=journeys[mode],p=d.phases[i];$('.journey-scene-editorial',root).innerHTML=`<div class="journey-crop"><svg viewBox="${mode==='course'?280+i*294:291+i*309} 217 292 125" role="img" aria-label="${esc(d.label+' / '+p[0]+' 原故事板细节')}"><image href="assets/${d.source}.webp" width="2000" height="1125"/></svg><span>原故事板 / ${String(i+1).padStart(2,'0')}</span></div><div class="journey-stage-title"><span>${d.label}</span><h3>${p[1]}</h3><p>${p[2]}</p></div><dl class="journey-lanes"><div><dt>学生经过的触点</dt><dd>${p[3]}</dd></div><div><dt>后台如何支撑</dt><dd>${p[4]}</dd></div></dl>`;};
  bindSelection(root,'data-folio-journey',i=>{mode=i===0?'course':'learning';$('.journey-stations',root).innerHTML=journeys[mode].phases.map((p,j)=>`<button data-journey-stage="${j}" aria-pressed="${j===0}"><span>0${j+1}</span>${p[0]}</button>`).join('');bindSelection(root,'data-journey-stage',show);});
 }
 function afterglowEncoding(c){
  const v=$('.chapter-visuals',c);if(!v)return;
  v.innerHTML=`<div class="folio-encoding-map">${art('afterglow-glyph','原项目最终径向视觉','encoding-master')}<div class="encoding-legend">${[['人流','密度','方向数、径向密度与环幅'],['噪声','振幅','波幅、波瓣数与字形扭曲'],['PM2.5','字号','字号与外圈膨胀 / V4'],['风','运动','行进波速度与倾斜']].map((x,i)=>`<div><span>0${i+1} / ${x[0]}</span><strong>${x[1]}</strong><p>${x[2]}</p></div>`).join('')}</div></div>${sourceFold([['afterglow-map','原项目四类信号与视觉映射 / 设计说明；字重在 V4 为手动控制']],'核对原始编码说明')}`;
 }
 function loopSource(cases){
  const research=$('.chapter-visuals',cases[0])||E('div','chapter-visuals');if(!research.parentElement)cases[0].append(research);
  research.innerHTML=`<div class="loop-benchmark"><div class="loop-research-brief"><span>DESK RESEARCH → MVP</span><h3>不照搬平台。<br>拆开可用的机制。</h3><p>设计学生的材料需求量小、临近截止日期、服务半径短。比较的重点是信息能否找到、规格能否确认，以及最终怎样交到学生手上。</p></div></div>`;
  const cards=$('.case-cards',cases[0]);if(cards)research.append(cards);
  research.append(E('div','',`<p class="folio-source-note">需求调查、单店试点与指标测量是原方案中的下一步计划，并非已完成的运营成果。</p>${sourceFold([['loop-source-04','最终汇报第 4 页 / 桌面研究与研究计划']],'核对原始研究与计划')}`));
  const v=$('.chapter-visuals',cases[1]);if(v){
   const demo=$('.component',v);v.prepend(E('div','loop-native-mvp',`<div class="loop-phone-source"><button data-book-art="loop-source-09" data-caption="原最终汇报第 9 页 / 小程序 MVP 概念界面" aria-label="放大原 MVP 设计"><svg viewBox="1440 175 455 840" role="img" aria-label="原最终汇报中的 LoopLab 小程序概念界面"><image href="assets/loop-source-09.webp" width="1920" height="1080"/></svg></button><span>原设计 / 第 9 页</span></div><div class="loop-mvp-list"><p class="folio-kicker">FIVE CORE MODULES</p><h3>从获取材料，<br>到留下作品。</h3>${[['交换材料','规格与状态连接供需'],['预约制作','上传文件，等待报价与排期'],['小量团购','合并学生的小批量需求'],['项目档案','保存作品照片或 3D 扫描'],['校园取件地图','自提柜、制作店与交换地点']].map((x,i)=>`<div><span>0${i+1}</span><h4>${x[0]}</h4><p>${x[1]}</p></div>`).join('')}<p class="folio-source-note">界面是源方案的概念设计；库存、价格和通知并非实时服务。</p></div></div>`));if(demo)demo.classList.add('folio-module-reader');v.append(E('div','',sourceFold([['loop-source-09','最终汇报第 9 页 / 完整产品功能与用户流程']])));}
  const third=$('.chapter-visuals',cases[2]);if(third){
   const steps=[['发现需求','寻找材料、制作资源与可用地点','材料、自提柜与制作店成为可发现的服务入口','学生 / 校园伙伴'],['发布与上传','提供材料信息或上传制作文件','闲置材料提交、文件与制作条件核对','学生 / 制作店'],['确认与制作','确认预约与制作安排','制作店接收需求并排期；材料交换确认交接','学生 / 制作店 / 平台'],['通知与取件','接收提醒，查看取件位置','自提柜或制作店承接交接与结果核对','学生 / 触点维护者'],['归档与再流转','保存作品照片或 3D 扫描','剩余材料回收、再分配与存放，进入下一次使用','学生 / 校园伙伴']];
   third.innerHTML=`<div class="folio-handoff-score"><div class="handoff-score-heading"><span>ONLINE ⇄ OFFLINE</span><h3>同一笔需求，<br>经过屏幕，也经过校园。</h3></div><div class="handoff-score-stops" role="group" aria-label="选择材料流转阶段">${steps.map((x,i)=>`<button data-folio-handoff="${i}" aria-pressed="${i===0}"><span>0${i+1}</span>${x[0]}</button>`).join('')}</div><div class="handoff-score-lanes" aria-live="polite"></div><p class="folio-source-note">依据原方案的线上／线下旅程重构；这是一条服务概念路径，没有提交真实订单。</p></div>${sourceFold([['loop-source-11','最终汇报 / 线上操作与线下服务旅程'],['loop-source-08','最终汇报 / 校园服务生态']],'查看原始旅程与服务生态')}`;
   bindSelection(third,'data-folio-handoff',i=>{const x=steps[i];$('.handoff-score-lanes',third).innerHTML=`<div><span>屏幕之内 / ONLINE</span><p>${x[1]}</p></div><div><span>校园之中 / OFFLINE</span><p>${x[2]}</p></div><small>参与角色 / ${x[3]}</small>`;});
  }
  $$('[data-loop]',document).forEach(b=>{if(b.textContent.includes('材料档案'))b.textContent='项目档案';if(b.textContent.includes('线下取件'))b.textContent='校园取件地图';});
  const update=()=>{const text=$('.loop-content');if(text?.textContent.includes('材料档案'))text.innerHTML='<p class="eyebrow">SERVICE MODULE / 04</p><h3>让项目成果可以继续被使用。</h3><p>原方案的 Project Archive 保存作品照片或 3D 扫描，组织数字作品档案，支持后续回顾与资源复用。</p><p class="concept-stamp">SOURCE MVP / 项目档案概念</p>';};
  document.addEventListener('click',e=>{if(e.target.closest('[data-loop]'))update();});update();
   const modules=$$('[data-loop]');modules.forEach((button,i)=>button.addEventListener('keydown',e=>{let next;if(e.key==='Home')next=0;else if(e.key==='End')next=modules.length-1;else if(e.key==='ArrowRight'||e.key==='ArrowDown')next=(i+1)%modules.length;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')next=(i+modules.length-1)%modules.length;else return;e.preventDefault();e.stopPropagation();modules[next].focus();modules[next].click();}));
 }
 function mlp(c){
  const component=$('.component.mlp',c)||$('.component',c);if(!component)return;
  const old=$('svg',component);if(old)old.replaceWith(E('div','folio-network',`<p>NUMPY / FORWARD → BACKPROPAGATION</p><div class="network-layers">${[['48','INPUT','行为特征','输入数据'],['64','HIDDEN 01','ReLU','3,136 参数'],['32','HIDDEN 02','ReLU','2,080 参数'],['1','OUTPUT','Sigmoid','33 参数']].map((x,i)=>`<div class="network-layer"><span>${x[1]}</span><strong>${x[0]}</strong><b>${x[2]}</b><small>${x[3]}</small></div>${i<3?'<i aria-hidden="true">→</i>':''}`).join('')}</div><span class="folio-source-note">48→64→32→1 / 5,249 可训练参数；层宽与参数数来自模型，不用装饰节点冒充完整拓扑。</span>`));
   const original=$('.case-figure',c);if(original)original.replaceWith(E('div','',sourceFold([['privacy-compare','原模型比较界面 / 5,000 合成样本口径']],'核对原模型比较界面')));
 }
 function posterHeaders(){
  const id=document.body.dataset.project,s=specs[id];if(!s)return;
   document.body.classList.add('folio-directed');document.body.style.setProperty('--folio-accent',s.accent);document.body.style.setProperty('--accent',s.accent);document.body.style.setProperty('--folio-paper',s.paper);
  const hero=$('.case-opening');hero.classList.add('folio-cover');
  $('.case-cover',hero).innerHTML=art(s.cover,({rallylens:'训练现场 / 原研究视频',artemis:'Boss 战 / 原游戏实机',afterglow:'余晖环 / 原最终视觉',looplab:'产品功能与小程序 / 原最终汇报第 9 页',garden:'秋季园景 / 团队实机画面','growth-compass':'课程体验 / 原方案概念故事板',tennisatom:'真人运动肖像 / 原定制影片',baseball:'人物叙事首页 / 原数据网站','privacy-city':'授权情境 / 原网页游戏界面'}[id]||'原项目成果 / 设计资产'),'folio-cover-art');
  $('.case-title-grid h1',hero).textContent=s.title;
  hero.append(E('div','folio-cover-line',s.line));hero.append(E('div','folio-cover-inset',art(s.inset,({tennisatom:'竖屏成片 / 原真人影片',afterglow:'公共空间 / 设计效果图',looplab:'材料流转 / 概念视觉',garden:'绘梦奇扇 / 团队游戏界面','growth-compass':'逻辑画布 / 原方案概念故事板'}[id]||'原项目界面 / 设计材料'))));
  hero.append(E('div','folio-cover-symbol',motif(s.motif)));
  hero.append(E('span','folio-cover-code',s.code));
  const cases=$$('.case-chapter');cases.forEach((c,i)=>decorateChapter(c,i,s));
   if(id==='growth-compass'){growthPersonas(cases[0]);growthJourney(cases[3]);growthSystem(cases[4]);}
   if(id==='rallylens')rallySequence(cases[3]);
  if(id==='afterglow')afterglowEncoding(cases[0]);
   if(id==='looplab'){loopSource(cases);$('.case-cover',hero).innerHTML=loopCover();}
  if(id==='privacy-city')mlp(cases[2]);
   if(id==='baseball')baseballSource(cases[1]);
    if(id==='tennisatom'){tennisPortrait(cases[0]);tennisDirector(cases[2]);}
  if(id==='garden'){
   $('.case-opening').append(E('p','folio-garden-seasons','秋　／　冬　／　春　／　夏'));
   const poetry=cases[1];poetry.append(E('div','folio-poetry-margin','雾来水面　→　风来水面<br>云到天心　→　月到天心'));
    gardenPuzzle(poetry);
  }
   referenceCover(hero,window.PORTFOLIO.projects.find(p=>p.id===id),s);
   referenceChapters(cases,window.PORTFOLIO.projects.find(p=>p.id===id),s);
   // A precise source line travels with every composition, instead of becoming a separate wall of explanation.
  $$('.case-figure img,.figure-gallery img').forEach(img=>{img.decoding='async';});
  const bench=$('.project-workbench');if(bench)bench.classList.add('folio-live-work');
  const decision=$('#design-decisions');if(decision)decision.classList.add('folio-decision-spread');
   sourceInspectors();
 }
 function home(){
  if(!$('.book-cover'))return;
  document.body.classList.add('folio-home');
  $('.cover-work-source').innerHTML=art('rally-court','RallyLens / 双人训练现场');
   const cover=$('.book-cover');cover.classList.add('reference-home-cover');
   const directions=[['PRODUCT','产品与服务','需求 → 触点 → 产品','rallylens','court'],['GAME','游戏与交互','规则 → 行为 → 反馈','artemis','hex'],['AI','AI 与影像','素材 → 导演 → 成片','tennisatom','motion'],['DATA','数据与视觉','记录 → 编码 → 探索','baseball','pitch']];
   cover.innerHTML=`<div class="reference-home-head"><span>WENJING BIAN / 卞文璟</span><span>DESIGN · RESEARCH · BUILD</span><span>SELECTED WORK / 10 PROJECTS</span></div><div class="reference-direction-index" role="group" aria-label="选择作品方向">${directions.map((d,i)=>`<button data-reference-direction="${i}" aria-pressed="${i===0}"><span class="direction-check" aria-hidden="true"></span><span class="direction-title">${d[1]}<small>${d[0]}</small></span><b>0${i+1}</b><span class="direction-detail">${d[2]}</span></button>`).join('')}</div><div class="reference-home-display"><div class="reference-home-title"><span>DESIGN THROUGH MAKING</span><h1 id="cover-title">从研究，<br>到可用体验<span>↘</span></h1></div><div class="reference-feature-view" aria-live="polite"></div></div><div class="reference-home-footer"><span>同济大学 / 视觉传达设计 × 人工智能</span><a href="#work">打开项目目录 <span>↓</span></a><span>SHANGHAI / 2026</span></div>`;
   bindSelection(cover,'data-reference-direction',i=>{
    const d=directions[i],p=window.PORTFOLIO.projects.find(p=>p.id===d[3]),s=specs[p.id];
    $('.reference-feature-view',cover).innerHTML=`<figure class="reference-feature-photo preview-${p.id}"><a href="case.html?project=${p.id}" aria-label="查看 ${esc(p.name)} 案例"><img src="assets/${s.cover}.webp" alt="${esc(p.name)} / ${esc({rallylens:'原研究训练现场',artemis:'原游戏 Boss 战实机',tennisatom:'原真人定制影片画面',baseball:'原数据网站叙事首页'}[p.id]||p.cn)}" decoding="async" fetchpriority="high"></a><figcaption><span>${p.number} / ${esc(p.name)}</span><b>${esc(p.label)}</b></figcaption></figure><div class="reference-feature-system">${referenceGraphic(d[4])}</div><div class="reference-feature-caption"><span>0${i+1} / ${d[0]}</span><p>${esc(p.cn)}</p><a href="case.html?project=${p.id}">进入案例 <span>↗</span></a></div>`;
   });
  $$('.project-plate').forEach(plate=>{
    const id=plate.dataset.project,s=specs[id];
    const p=window.PORTFOLIO.projects.find(p=>p.id===id);
    plate.classList.add('reference-project');
    plate.style.setProperty('--folio-accent',s?.accent||p.color);
    plate.style.setProperty('--folio-paper',s?.paper||'#eee8de');
    plate.append(E('span','reference-project-number',p.number));
    plate.append(E('div','reference-project-graphic',referenceGraphic(s?.motif||(id==='bronze'?'bronze':'permission'))));
    plate.append(E('nav','reference-mechanisms',mechanisms[id].map((m,i)=>`<a href="case.html?project=${id}#chapter-${m[2]}"><span>0${i+1}</span><div><b>${m[0]}</b><small>${m[1]}</small></div><i aria-hidden="true">↗</i></a>`).join('')));
    $('.reference-mechanisms',plate).setAttribute('aria-label',p.name+' 章节入口');
    if(!s)return;
    plate.classList.add('folio-project','folio-project-'+s.motif,'reference-project-'+s.motif);plate.style.setProperty('--folio-accent',id==='artemis'?'#cbea52':s.accent);plate.style.setProperty('--folio-paper',id==='artemis'?'#242c32':s.paper);
   plate.append(E('div','folio-plate-symbol',motif(s.motif)));
    if(id==='looplab'){const main=$('.image-1',plate);main.innerHTML=loopCover();$('.plate-copy>p:nth-of-type(2)',plate).textContent='材料交换、制作预约、小量团购、项目档案与校园取件地图。内容与视觉重构串联需求、流程和商业模式，让服务触点与履约路径相互对应。';}
   if(id==='rallylens')$('.plate-copy>p:nth-of-type(2)',plate).textContent='2,204 次事件、150 段训练片段，结合 10+ 位专业教练回访、10+ 位测试球员深度回访与多对球友长期跟踪。研究、模型算法与底层数据架构共同支持可回查的双向证据。';
  });
 }
 posterHeaders();home();
 if(!matchMedia('(prefers-reduced-motion:reduce)').matches){
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('folio-in-view');observer.unobserve(e.target);}}),{threshold:.08});
  $$('.folio-chapter,.folio-project').forEach(x=>observer.observe(x));
 }
})();
