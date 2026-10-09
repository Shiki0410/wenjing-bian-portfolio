(() => {
  'use strict';
  const portfolio = window.PORTFOLIO;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const asset = name => `assets/${esc(name)}.webp`;
  const caseUrl = id => `case.html?project=${encodeURIComponent(id)}`;
  const chineseTitle = p => ['bronze','garden'].includes(p.id) ? ' chinese-title' : '';
  const gardenGraphic = suffix => `<svg viewBox="0 0 600 360" role="img" aria-labelledby="garden-title-${suffix} garden-desc-${suffix}"><title id="garden-title-${suffix}">园林探索与对话关系示意</title><desc id="garden-desc-${suffix}">一条蜿蜒的路径穿过亭、石与水，表示场景探索、知识触点和 NPC 对话的关系；属于作品集展示重构。</desc><g fill="none" stroke="#58725d"><path d="M60 280Q115 290 152 218T261 224Q343 320 417 217T540 104" stroke-width="2" stroke-dasharray="5 6"/><path d="M60 114Q125 70 187 95T291 83Q339 60 384 75" stroke-width="1"/><path d="M40 129Q120 96 188 114T308 105Q343 88 370 93" stroke-width="1"/><path d="M210 318Q306 294 357 321T480 307"/><path d="M217 331Q306 310 357 334T480 322"/></g><g stroke="#58725d" fill="#f4f2eb"><path d="m135 158 44-23 44 23-13 8h-62z" stroke-width="2"/><path d="M154 166v43h51v-43M160 168v40m39-40v40M147 211h65" stroke-width="2"/><path d="m380 152 28-49 32 32 18 34-7 24-40-6z"/><path d="m441 173 19-41 27 26 5 24-25 20z"/><path d="m500 57 25-15 29 14-9 10h-38z"/><path d="M510 66v34h32V66"/></g><g fill="#c33b28"><circle cx="150" cy="234" r="5"/><circle cx="340" cy="274" r="5"/><circle cx="522" cy="117" r="5"/></g><g font-family="Noto Sans SC, sans-serif" font-size="12" fill="#405c45"><text x="98" y="264">场景探索</text><text x="292" y="300">知识触点</text><text x="475" y="144">NPC 对话</text></g></svg>`;
  const gardenCover = suffix => `<div class="garden-cover"><small>EXPLORATION / CULTURE / INTERACTION</small><h4>游园画境</h4>${gardenGraphic(suffix)}</div>`;
  const growthCover = () => `<div class="growth-cover"><span class="growth-cover-label">LEARNING BY EXPERIENCING</span><div class="growth-orbit" aria-hidden="true"><i></i><i></i><i></i><b>＋</b></div><h4>先体验，<br>再选择。</h4><div class="growth-ticket ticket-one"><small>01 / BEFORE CLASS</small><strong>课程预览</strong><span>看见目标与学习内容</span></div><div class="growth-ticket ticket-two"><small>02 / DURING CLASS</small><strong>朋辈支持</strong><span>把问题说得具体</span></div><p>Growth Compass <span>服务概念 / 展示重构</span></p></div>`;
  const coverArt = (p,suffix) => p.id==='growth-compass'?growthCover():p.cover?`<img src="${asset(p.cover)}" alt="${esc(p.coverAlt)}" ${suffix==='card'?'loading="lazy" decoding="async"':'fetchpriority="high"'}>`:gardenCover(suffix);
  const fileThemes = {
    rallylens:{bg:'#1b1d1a',fg:'#f5f5e8',tab:'#4263f6',cover:'rally-ui',mini:'rally-court',note:'same practice, two stories.',caption:'on the court'},
    'privacy-city':{bg:'#f4d146',fg:'#1b1c1a',tab:'#e9ba20',cover:'privacy-compare',mini:'privacy-scene1',note:'choices leave a trace.',caption:'permission / choice'},
    tennisatom:{bg:'#e96842',fg:'#fff8e8',tab:'#ba4928',cover:'tennis-poster',note:'a portrait in motion.'},
    baseball:{bg:'#d7daf0',fg:'#20213a',tab:'#afbadb',cover:'baseball-web-macro',mini:'baseball-web-detail',note:'a season, seen differently.',caption:'look a little closer'},
    artemis:{bg:'#26252d',fg:'#fbf8ef',tab:'#8067ae',cover:'artemis-boss',mini:'artemis-build',note:'design, build, play.',caption:'inside the build'},
    bronze:{bg:'#162d26',fg:'#fbf1d5',tab:'#967341',cover:'bronze-character',mini:'bronze-threeviews',note:'old stories, new frames.',caption:'character study'},
    afterglow:{bg:'#e0ddce',fg:'#292a23',tab:'#b6ad94',cover:'afterglow-glyph',mini:'afterglow-dome',note:'the station has a rhythm.',caption:'into the space'},
    'growth-compass':{bg:'#d5dcf4',fg:'#203154',tab:'#b1bfeb',note:'try first. find your way.'},
    looplab:{bg:'#b9d5b2',fg:'#22351e',tab:'#92b888',cover:'loop-materials',note:'materials, with a next chapter.'},
    garden:{bg:'#ebd8b0',fg:'#2a3526',tab:'#c1c796',note:'a garden you can explore.'}
  };
  const card = p => {
    const t=fileThemes[p.id];
    const visual=p.id==='growth-compass'?growthCover():p.id==='garden'?gardenCover(`file-${p.id}`):`<img src="${asset(t.cover)}" alt="${esc(p.id==='tennisatom'?'TennisAtom 原项目运动特效海报':p.coverAlt)}" loading="lazy" decoding="async">`;
    const extra=p.id==='tennisatom'?`<div class="film-photo"><span class="tape" aria-hidden="true"></span><img src="${asset('tennis-real-5')}" alt="TennisAtom 为真实球员制作的个人视频画面" loading="lazy" decoding="async"><p class="hand">a film of your own.</p></div>`:t.mini?`<div class="screen-mini"><img src="${asset(t.mini)}" alt="${esc(p.name)} 项目细节" loading="lazy" decoding="async"><small>${esc(t.caption)}</small></div>`:'';
    return `<a class="project-card project-file" data-category="${esc(p.category)}" data-id="${esc(p.id)}" href="${caseUrl(p.id)}" style="--file-bg:${t.bg};--file-fg:${t.fg};--file-tab:${t.tab}" aria-label="查看 ${esc(p.name)} 项目案例"><div class="file-tabs"><span>PROJECT / ${p.number}</span><span>${esc(p.label)}</span></div><div class="file-body"><div class="file-copy"><p class="file-meta">${esc(p.year)} / ${p.category.toUpperCase()}</p><h3 class="${chineseTitle(p).trim()}">${esc(p.name)}</h3><p class="file-subtitle">${esc(p.cn)}</p><p class="file-summary">${esc(p.summary)}</p><p class="file-role">${esc(p.role)}</p><span class="file-cta">VIEW CASE <span aria-hidden="true">↗</span></span></div><div class="file-preview"><span class="preview-scribble">${esc(t.note)}</span><span class="preview-corner" aria-hidden="true"></span><div class="screen-print"><div class="screen-toolbar"><span aria-hidden="true"><i></i><i></i><i></i></span><b>${esc(p.name)} / ${p.number}</b></div><span class="tape" aria-hidden="true"></span>${visual}</div>${extra}</div><small class="file-stamp">WENJING BIAN / PROJECT ${p.number}</small></div></a>`;
  };
  function setupHome() {
    document.querySelector('#project-grid').innerHTML = portfolio.projects.map(card).join('');
    document.querySelector('#research-list').innerHTML = portfolio.research.map((r,i)=>`<article class="research-item"><span>0${i+1}</span><div><h3>${esc(r.title)}</h3><p class="eyebrow">${esc(r.label)}</p></div><p>${esc(r.text)}</p></article>`).join('');
    const filters = [...document.querySelectorAll('[data-filter]')];
    filters.forEach(button => button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filters.forEach(b=>{const on=b===button;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
      let count=0;
      document.querySelectorAll('.project-card').forEach(c=>{c.hidden=filter!=='all'&&c.dataset.category!==filter;if(!c.hidden)count++;});
      document.querySelector('#filter-status').textContent=`${button.textContent.trim()}：显示 ${count} 个项目`;
    }));
  }
  const figure = (name,caption) => `<figure class="case-figure"><button class="image-open" data-full-image="${asset(name)}" data-caption="${esc(caption)}" aria-label="放大：${esc(caption)}"><img src="${asset(name)}" alt="${esc(caption)}" loading="lazy" decoding="async"></button><figcaption>${esc(caption)}</figcaption></figure>`;
  const label = (name,note='交互与关系示意') => `<div class="component-label"><span>${esc(name)}</span><span>${esc(note)}</span></div>`;
  const note = text => `<p class="component-note">${esc(text)}</p>`;
  const tabButtons = (items,attr) => `<div class="component-tabs" role="group" aria-label="切换展示">${items.map((item,i)=>`<button ${attr}="${i}" aria-pressed="${i===0}">${esc(item)}</button>`).join('')}</div>`;
  function pipeline(name,steps,foot) {
    return `<div class="component">${label(name)}<div class="pipeline${steps.length===5?' has-five':''}">${steps.map((s,i)=>`<div class="pipeline-step"><span class="step-number">0${i+1}</span><h3>${esc(s[0])}</h3><p>${esc(s[1])}</p></div>`).join('')}</div>${note(foot)}</div>`;
  }
  const evidenceData = [
    {key:'VIDEO / EVENTS',title:'画面与可验证事件',text:'源视频提供动作、回球与时间依据；方向性事件连接给球者和接球者。记录中保留来源和未知项，便于回查。',source:'视频 / 人工标注',scope:'事件或回合',unknown:'遮挡、未确认方向与缺失保持可见。'},
    {key:'GOAL / INTENT',title:'当时希望练什么',text:'目标卡保留双方各自的练习计划。阅读时分别检查目标由谁提出、作用于哪段练习，避免默认双方共享同一目标。',source:'双方当场目标卡',scope:'目标卡对应的阶段',unknown:'没有记录的目标，不能从动作自动补齐。'},
    {key:'ACCOUNT / INTERPRETATION',title:'后来如何理解',text:'球员回访与教练意见保留各自来源。球员的回忆可以指向一个区间，也可能未能定位；两种状态都应如实记录。',source:'球员回访 / 教练读片',scope:'已定位区间或未定位',unknown:'来源不同，意见可以并列保留。'},
    {key:'MODEL / ESTIMATE',title:'计算候选与估计',text:'模型结果作为可检查的候选，与视频和人工判断相邻呈现。它需要自己的输入、定义、时间范围与不确定性说明。',source:'计算结果',scope:'具体事件或区间',unknown:'只在评估条件内解释模型表现。'},
    {key:'UNKNOWN / UNRESOLVED',title:'留住没有答案的部分',text:'未知方向、缺失材料和仍有分歧的计划继续留在记录里。用户能够知道哪些信息有依据，哪些仍需回看或讨论。',source:'缺失 / 未定位 / 未确认',scope:'记录本身标注的范围',unknown:'未知状态不填成零，也不合并成单一评分。'}
  ];
  function evidenceSvg(active=0) {
    const coords=[[15,15],[210,15],[15,145],[210,145],[112,245]];
    return `<svg viewBox="0 0 400 320" role="img" aria-labelledby="evidence-title evidence-desc"><title id="evidence-title">DPE 的信息来源</title><desc id="evidence-desc">视频事件、当场目标、参与者解释、计算候选与未知信息连接到一个双人练习片段。当前选择 ${esc(evidenceData[active].title)}。</desc><g class="evidence-line"><path d="M100 55 195 122M292 55 195 122M95 185 195 122M292 185 195 122M195 280V122"/></g><g>${coords.map((xy,i)=>`<rect class="evidence-node ${i===active?'selected':''}" x="${xy[0]}" y="${xy[1]}" width="175" height="72" rx="0"/><text x="${xy[0]+15}" y="${xy[1]+28}" class="${i===active?'selected-text':''}">${['视频与事件','当场目标','球员与教练解释','计算候选','未知信息'][i]}</text><text x="${xy[0]+15}" y="${xy[1]+50}" class="${i===active?'selected-text':''}" style="font-size:8px">${['VERIFIABLE EVENTS','STATED GOALS','HUMAN ACCOUNTS','MODEL ESTIMATES','UNKNOWN'][i]}</text>`).join('')}</g><g><circle cx="195" cy="122" r="24" fill="#f4f2eb" stroke="#477a65"/><text x="195" y="126" text-anchor="middle" style="font-family:Consolas;font-size:13px">DPE</text></g></svg>`;
  }
  const evidenceDetail = i => {const d=evidenceData[i];return `<span class="source-kind">${d.key}</span><h3>${d.title}</h3><p>${d.text}</p><dl><dt>来源</dt><dd>${d.source}</dd><dt>时间范围</dt><dd>${d.scope}</dd><dt>保留状态</dt><dd>${d.unknown}</dd></dl>`;};
  const layerData=[
    {image:'rally-ui',title:'01 / 先看两侧的真实过程',text:'回放提供共同的检查入口。双方目标与陈述放在画面附近，保留解释来源；同一段练习可以支持不同理解。'},
    {image:'rally-braid',title:'02 / 展开方向与事件',text:'方向表示谁为谁提供练习条件；A→B 与 B→A 分开阅读。回合断开和问号分别提醒用户检查边界与未知。'},
    {image:'rally-goal',title:'03 / 查看候选与定义',text:'E、R、U 分别描述有效进入、可达性与可用回应。计算候选需要回到对应事件检查，不能替代人的解释。'}
  ];
  const layerDetail=i=>`<img src="${asset(layerData[i].image)}" alt="${esc(layerData[i].title)}"><div><h3>${layerData[i].title}</h3><p>${layerData[i].text}</p>${i===2?`<div class="eru-grid"><div><strong>E</strong><span>Effective entry<br>有效进入</span></div><div><strong>R</strong><span>Reachability<br>可达性</span></div><div><strong>U</strong><span>Usable response<br>可用回应</span></div></div>`:''}</div>`;
  const permissions=[
    ['邮箱','@','读取联系邮箱','邮箱可能用于联系，也可能被用于营销。先检查用途、保存期限与是否允许另作他用。'],
    ['定位','⌖','访问位置信息','位置记录会暴露活动轨迹。应检查是否需要持续定位，以及任务是否只需要大致位置。'],
    ['联系人','＋','读取联系人列表','联系人涉及其他人的资料。检查选择范围、是否整表上传，以及拒绝后的替代流程。'],
    ['摄像头 / 麦克风','◉','开启音视频输入','音视频可能包含人物与环境信息。检查处理发生在何处、是否保存和何时停止。'],
    ['画像分析','≡','分析行为与偏好','画像可能影响后续推荐与判断。检查输入来源、关联范围以及能否查看和撤回。']
  ];
  const privacyCard=i=>`<div class="permission-card"><span class="permission-icon" aria-hidden="true">${permissions[i][1]}</span><h3>${permissions[i][2]}</h3><p>这是模拟授权界面。阅读用途和影响后，选择接受或拒绝；下方反馈展示规则说明。</p><div class="permission-actions"><button data-decision="refuse">拒绝</button><button data-decision="accept">接受</button></div></div><div class="permission-feedback" aria-live="polite"><small>SIMULATED PERMISSION / ${String(i+1).padStart(2,'0')}</small><h4>先确认请求范围。</h4><p>${permissions[i][3]}</p><div class="sim-events">SCENARIO SELECTED → WAITING FOR A DECISION</div></div>`;
  function mlpSvg(){
    const xs=[60,240,420,600],ys=[83,111,139,167,195],labels=['48 INPUT','64 / ReLU','32 / ReLU','1 / Sigmoid'];
    let lines='',nodes='';
    for(let i=0;i<3;i++)for(const y of ys)for(const z of (i===2?[139]:ys))lines+=`<path d="M${xs[i]+7} ${y}L${xs[i+1]-7} ${z}"/>`;
    xs.forEach((x,i)=>{(i===3?[139]:ys).forEach(y=>nodes+=`<circle cx="${x}" cy="${y}" r="7" fill="${i===3?'#355da6':'#f4f2eb'}" stroke="#355da6"/>`);nodes+=`<text x="${x}" y="40" text-anchor="middle">${labels[i]}</text>`;});
    return `<svg viewBox="0 0 660 250" role="img" aria-labelledby="mlp-title mlp-desc"><title id="mlp-title">Privacy City MLP 拓扑示意</title><desc id="mlp-desc">输入 48、隐藏层 64 与 32、输出 1。图中只画代表节点，完整模型有 5249 个可训练参数。</desc><g stroke="#9dadcb" stroke-width=".6" opacity=".35" fill="none">${lines}</g><g font-family="Consolas" font-size="12" fill="#355da6">${nodes}</g><text x="330" y="235" text-anchor="middle" font-family="Noto Sans SC, sans-serif" font-size="9" fill="#73766d">代表节点示意 / 完整层宽度见上方标记</text></svg>`;
  }
  const tennisFilms=[['真人运动肖像 / 01','从球场素材进入个人叙事，以动作、剪辑和动态视觉共同呈现。'],['真人运动肖像 / 02','保留击球现场，将运动特征和视觉处理接入成片。'],['竖屏与动态文字 / 03','以竖屏适应媒体阅读，真人动作和动态文字形成个人化表达。'],['动作与细节 / 04','通过动作特写和片段选择，突出具体球员的运动表现。'],['运动与视觉节奏 / 05','围绕真人素材组合片段、运动信息与特效，完成专属视频。']];
  const glyphs=[['afterglow-low','低强度视觉样本','保持径向结构，调整笔画、密度与整体尺度。'],['afterglow-mid','中间状态视觉样本','图形在统一骨架中变化，便于比较形态与层次。'],['afterglow-high','高强度视觉样本','形态扩张和密度变化提供不同的阅读状态。']];
  const glyphContent=i=>`<img src="${asset(glyphs[i][0])}" alt="${glyphs[i][1]}"><div><p class="eyebrow">VISUAL SAMPLE / 0${i+1}</p><h3>${glyphs[i][1]}</h3><p>${glyphs[i][2]}</p><div class="glyph-line">PEOPLE / NOISE / PM2.5 / WIND</div></div>`;
  const journey=[
    {front:'先体验课程，再做选择',ftext:'通过课程预览、试听和案例了解学习目标，留出调整选择的机会。',back:'课程信息与预览维护',btext:'教师提供课程目标与案例，教务协调预览与调整窗口，信息以统一方式被整理。',tags:['课程预览','模块试听','选择调整']},
    {front:'卡住时，找到下一步',ftext:'学习支架、作业逻辑画布和朋辈讨论帮助学生具体表达问题，并获得可执行反馈。',back:'案例、反馈与朋辈安排',btext:'组织案例资源与支持角色；AI 预审属于服务概念，需要在具体课程中另行验证。',tags:['作业画布','朋辈问诊','案例库']},
    {front:'让学习经验可以继续',ftext:'整理作品档案、回顾课程经验，将下一次课程选择接到自己的兴趣与能力发展。',back:'档案和经验传递',btext:'协作维护课程经验与作品材料，为下一届学生的探索提供参考。',tags:['作品档案','课程回顾','经验交流']}
  ];
  const journeyPanel=i=>`<div class="journey-side"><small>FRONTSTAGE / 学生接触到的服务</small><h3>${journey[i].front}</h3><p>${journey[i].ftext}</p><div class="touchpoint-tags">${journey[i].tags.map(t=>`<span>${t}</span>`).join('')}</div></div><div class="journey-side"><small>BACKSTAGE / 支撑角色与工作</small><h3>${journey[i].back}</h3><p>${journey[i].btext}</p></div>`;
  const loopModules=[
    ['材料交换','让闲置材料找到下一位使用者。','以材料类型、规格与状态组织发布信息，匹配需求后进入确认和线下交接。','发布材料 → 核对信息 → 确认交接'],
    ['团购','把分散需求汇集成一次采购。','聚合材料需求，讨论采购与分配方式，并在取件环节保持订单和材料对应。','汇集需求 → 确认采购 → 分配取件'],
    ['制作预约','让制作需求对应具体资源。','预约需要连接需求说明、制作条件和可用时间，后续确认由实际服务角色完成。','提交需求 → 确认条件 → 制作与取件'],
    ['项目档案','让作品成果成为可回看的数字档案。','保存项目照片或 3D 扫描，建立数字作品档案，保留成果并支持后续回顾与资源复用。','完成项目 → 上传成果 → 归档与复用'],
    ['校园取件地图','找到离自己近的服务触点。','以地图组织校园自提柜、制作店和材料交换地点。预约与订单提醒连接具体位置和线下核对。','查找地点 → 确认时间 → 线下交接']
  ];
  const loopContent=i=>`<p class="eyebrow">SERVICE MODULE / 0${i+1}</p><h3>${loopModules[i][1]}</h3><p>${loopModules[i][2]}</p><div class="loop-module-visual"><div class="material-icon" aria-hidden="true"></div><div><strong>${loopModules[i][0]}</strong><p>${loopModules[i][3]}</p></div></div><p class="concept-stamp">CONCEPT INTERFACE / 模块关系展示</p>`;
  const states=[
    {name:'待机',code:'PlayerIdleState',enter:'角色初始化，或停步动画结束后进入。',action:'初始化待机动画，注册移动、跳跃等输入监听。',exit:'有效 Hex 路径提交后进入起步；待机状态也保留 Move.started 输入入口。'},
    {name:'起步',code:'PlayerMoveStartState',enter:'SetHexPath 写入目标；当前不在起步或持续移动状态时，切入起步。',action:'播放起步动画，朝路径目标调整方向与速度。',exit:'起步动画的 OnEnd 回调进入持续移动。公共移动逻辑也会检查路径是否已经结束。'},
    {name:'持续移动',code:'PlayerMoveLoopState',enter:'起步动画结束后进入，播放循环移动动画。',action:'跟随 currentHexTarget；距离小于 0.4 个世界单位时检查队列，有后续点就继续取点。',exit:'最后一个目标到达后清空当前目标，进入停步；导航失效时也有自动停步检查。'},
    {name:'停步',code:'PlayerMoveEndState',enter:'目标已到达且路径队列为空，或持续移动中的导航结束。',action:'按前脚位置选择左脚或右脚停步动画；满足近墙条件时播放靠墙结束动作。',exit:'结束动画的 OnEnd 回调返回待机；新路径可再次发起起步。'}
  ];
  const stateDetail=i=>{const s=states[i];return `<div class="logic-detail-heading"><span>STATE / 0${i+1}</span><h3>${s.name}</h3><code>${s.code}</code></div><dl><dt>进入</dt><dd>${s.enter}</dd><dt>执行</dt><dd>${s.action}</dd><dt>离开</dt><dd>${s.exit}</dd></dl>`;};
  function stateSvg(active=0){
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 268" role="img" aria-labelledby="state-title state-desc"><title id="state-title">Hex 地图中的玩家移动主链</title><desc id="state-desc">四个节点依次为待机、起步、持续移动、停步。有效路径启动起步，起步动画结束进入持续移动；到达最后一个目标且队列为空时停步，停步动画结束返回待机。箭头为代码中的主要切换，不表示耗时；未画出跳跃、攀爬和中断分支。当前查看${states[active].name}。</desc><metadata>{"source":"Artemis PLAYER LOCOMOTION / SOURCE SCRIPTS","evidence":"source-code","scope":"primary Hex locomotion transitions","geometry":"non-quantitative"}</metadata><defs><marker id="state-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1L9 5L0 9" fill="none" stroke="#70677b" stroke-width="1.5"/></marker></defs><g id="background" aria-hidden="true"><rect width="900" height="268" fill="#f8f6ef"/></g><g id="axes" aria-label="状态切换条件" fill="none" stroke="#70677b" stroke-width="1.5" marker-end="url(#state-arrow)"><path d="M175 112H246"/><path d="M390 112H461"/><path d="M605 112H676"/><path d="M748 154V216H102V155"/></g><g id="data" aria-label="玩家移动状态" data-unit-of-analysis="declared locomotion state">${[30,245,460,675].map((x,i)=>`<g data-record-id="${states[i].code}" data-evidence-type="fact"><rect x="${x}" y="77" width="145" height="76" fill="${i===active?'#746098':'#f8f6ef'}" stroke="${i===active?'#746098':'#70677b'}" stroke-width="${i===active?'2':'1.5'}"/><text x="${x+72.5}" y="105" text-anchor="middle" class="logic-node-caption" fill="${i===active?'#ffffff':'#5b5363'}">${['IDLE','MOVE START','MOVE LOOP','MOVE END'][i]}</text><text x="${x+72.5}" y="133" text-anchor="middle" class="logic-node-title" fill="${i===active?'#ffffff':'#302a37'}">${states[i].name}</text></g>`).join('')}</g><g id="annotations" class="logic-edge-caption" fill="#4c4457" text-anchor="middle"><text x="211" y="37">有效路径</text><text x="211" y="60">SetHexPath</text><text x="426" y="37">起步动画结束</text><text x="426" y="60">OnEnd</text><text x="641" y="37">到达最后目标</text><text x="641" y="60">队列为空</text><rect x="327" y="197" width="195" height="38" fill="#f8f6ef"/><text x="425" y="222">停步动画结束 · OnEnd</text></g><g id="source-notes" aria-label="阅读边界"><text x="30" y="258" class="logic-svg-note" fill="#5e5765">主要切换 / 路径与动画事件共同控制；其他移动分支另行组织。</text></g></svg>`;
  }
  const stateMobile=()=>`<ol class="logic-mobile-flow" aria-label="玩家移动主链"><li>待机 <span>→ 有效路径提交</span></li><li>起步 <span>→ 起步动画结束</span></li><li>持续移动 <span>→ 最后目标到达、队列为空</span></li><li>停步 <span>→ 停步动画结束，返回待机</span></li></ol>`;
  const artemisChain=()=>`<div class="component artemis-chain">${label('BUILD / TRIGGER TREE','节点、能量与效果传递')}<div class="chain-intro"><span class="logic-kicker">BUILD → ACTIVATE → ADVANCE</span><h3>连接方式决定效果如何继续。</h3><p>编辑模式调整零件连接。退出编辑后，左键启动根节点；每一层完成当前效果后等待右键，再把修饰数据交给相连的子节点。</p></div><ol class="chain-flow"><li><span class="chain-key">TAB</span><h4>编辑连接</h4><p>切换背包编辑模式，组织槽位与零件关系。</p></li><li><span class="chain-key">左键</span><h4>启动根节点</h4><p>每个起始槽位获得独立的初始能量与修饰数据副本。</p></li><li><span class="chain-key">能量检查</span><h4>执行当前效果</h4><p>检查并扣除 energyCost，调用 TriggerEffect，再通知订阅者。</p></li><li><span class="chain-key">右键</span><h4>推进下一层</h4><p>复制当前结果，触发相连的子槽位；子节点各自继续这一流程。</p></li></ol><div class="chain-rules"><div><span class="logic-rule-mark">↳</span><h4>分支有自己的停止条件</h4><p>剩余能量不足以支付当前零件时，直接结束该分支，跳过当前效果与后续子节点。</p></div><div><span class="logic-rule-mark">↗</span><h4>武器接收构筑后的参数</h4><p>GunItem 获得有效位置和修饰数据后生成子弹，传入速度、持续时间、伤害倍率和额外弹数；方向来自指定目标或鼠标所在的 XZ 平面。</p></div></div>${note('流程来自 HexSystem、BackpackSlot 与 GunItem；图中步骤表示执行顺序，未模拟完整游戏运行。')}</div>`;
  const artemisEnemies=()=>`<div class="component artemis-enemies">${label('ENEMIES / TELEGRAPH & TRANSFORM','分别组织敌人行为')}<article class="enemy-mechanism"><header><span>ELITE 02 / HOOK</span><h3>钩爪先给预警，再检查玩家是否离开。</h3></header><p>发现目标后，优先判断近战；玩家处于配置的钩爪距离内且冷却结束时，进入钩爪状态。</p><ol class="enemy-phases"><li><span>01 / 前摇</span><h4>标出射线格子</h4><p>停止导航、面向目标，显示当前目标方向的六边形预警。</p></li><li><span>02 / 命中检查</span><h4>再次核对玩家位置</h4><p>只有仍在预警格子中的玩家会被拉拽；离开该区域就跳过拉拽。</p></li><li><span>03 / 后摇</span><h4>清理并回到追击</h4><p>切换后摇颜色，等待配置时间后清除预警；退出状态时也执行清理。</p></li></ol></article><article class="enemy-mechanism"><header><span>ELITE 01 / TRANSFORM</span><h3>血量门槛，切换敌人的战斗阶段。</h3></header><p>允许变身、尚未触发且当前血量比例达到配置门槛时，进入变身状态；标记保证这一触发只发生一次。</p><div class="transform-sequence"><span>血量比例 ≤ 配置门槛</span><b aria-hidden="true">→</b><span>变身期间无敌</span><b aria-hidden="true">→</b><span>开启盾牌，恢复控制器</span></div><p class="enemy-return">变身结束后重新判断距离与冷却，选择射击待机、换弹、近战、追击或待机。退出变身状态时解除无敌标记。</p></article>${note('按现有脚本整理；预警时间、距离和变身门槛由 EnemySO 配置。')}</div>`;
  function component(id){
    switch(id){
      case 'evidence':return `<div class="component evidence">${label('DPE / SOURCE & SCOPE')}${tabButtons(['可验证事件','当场目标','人的解释','计算候选','未知信息'],'data-evidence')}<div class="evidence-board"><div class="evidence-map">${evidenceSvg()}</div><div class="evidence-detail" aria-live="polite">${evidenceDetail(0)}</div></div>${note('该交互说明表征关系，不模拟研究参与者的真实陈述。')}</div>`;
      case 'rallyLayers':return `<div class="component rally-layers">${label('INSPECTION / THREE READING LAYERS')}${tabButtons(['源视频与陈述','方向与事件','候选与定义'],'data-layer')}<div class="layer-display" aria-live="polite">${layerDetail(0)}</div>${note('原型与图表素材来自原项目；这里重构层级切换，便于理解检查顺序。')}</div>`;
      case 'privacyDemo':return `<div class="component privacy-demo">${label('PERMISSION / RULE FEEDBACK','模拟交互 · 不申请真实权限')}${tabButtons(permissions.map(p=>p[0]),'data-permission')}<div class="privacy-sim" aria-live="polite">${privacyCard(0)}</div>${note('选择仅在本页展示，未连接真实权限或数据采集；机器学习部分为离线实验。')}</div>`;
      case 'privacyPipeline':return pipeline('SYSTEM / EXPERIENCE → EXPERIMENT',[['情境配置','定义授权内容与选择。'],['行为记录','停留、点击、滚动、时间。'],['数据整理','形成特征与离线样本。'],['模型评估','比较、消融与校准分析。']],'规则反馈在网页端；多模型训练和评估在离线端。');
      case 'mlp':return `<div class="component mlp">${label('MLP / IMPLEMENTATION & PARAMETER COUNT','模型拓扑示意') }<div class="mlp-topology">${mlpSvg()}</div><div class="mlp-counts"><div><strong>3,136</strong><small>48 × 64 + 64</small></div><div><strong>2,080</strong><small>64 × 32 + 32</small></div><div><strong>33</strong><small>32 × 1 + 1</small></div></div><div class="batch-control"><label for="batch-size">批量大小 B</label><input id="batch-size" type="range" min="32" max="64" step="32" value="32"><output for="batch-size" id="batch-number">32</output><span class="batch-result" aria-live="polite">参数数量 5,249 / 批量改变不增加参数</span></div>${note('参数来自权重与偏置。批量大小改变一次处理的样本数；隐藏层宽度保持不变。')}</div>`;
      case 'tennisWorkflow':return `<div class="component tennis-workflow"><div class="component-label">PRODUCT / TWO PATHS<span>制作路径示意</span></div><div class="workflow-source"><span>01—02 / 共同输入</span><h3>上传素材 → 动作与事件分析</h3><p>真人影像、动作片段与运动数据保留在同一份素材结构中。</p></div><div class="workflow-choice" role="group" aria-label="制作路径"><button data-film-path="quick" aria-pressed="true">一键成片 <span>QUICK CREATE</span></button><button data-film-path="custom" aria-pressed="false">定制精修 <span>CREATIVE CONTROL</span></button></div><div class="workflow-path" data-workflow-path aria-live="polite"></div><div class="workflow-output"><span>05 / 输出</span><h3>观看、审看与分享</h3><p>同一制作能力连接私人留存和社交媒体表达。</p></div><p class="component-note">依据项目说明书重新编排的产品流程。路径切换用于解释设计，不触发视频生成。</p></div>`;
      case 'tennisPipeline':return pipeline('MOTION / FROM PERSON TO FILM',[['明确表达','运动特征与个人表达需求。'],['提取动作','MediaPipe 关键点处理。'],['组织视觉','轨迹、姿态与冲击表达。'],['剪辑成片','个人片段、文字和节奏。']],'真人影像与动作可视化共同形成个性化作品；个人职责以案例上方说明为准。');
      case 'tennisPlayer':return `<div class="component tennis-player">${label('FILMS / FIVE PERSONAL PORTRAITS','原项目真人视频')}${tabButtons(['01','02','03','04','05'],'data-film')}<div class="tennis-screen"><video id="tennis-video" controls preload="metadata" playsinline poster="${asset('tennis-real-1')}" src="media/tennis-1.mp4" aria-label="TennisAtom 真人定制视频 01"></video><div class="tennis-info" aria-live="polite"><span class="film-code">01</span><p class="eyebrow">TENNISATOM / PERSONAL FILM</p><h3>${tennisFilms[0][0]}</h3><p>${tennisFilms[0][1]}</p></div></div>${note('保留原片内容，转换为网页播放格式。使用播放器控制播放；切换影片不会自动播放。')}</div>`;
      case 'glyphSelector':return `<div class="component glyph-selector">${label('AFTERGLOW / VISUAL SAMPLES','原项目图形 · 展示状态')}${tabButtons(['样本 01','样本 02','样本 03'],'data-glyph')}<div class="glyph-display" aria-live="polite">${glyphContent(0)}</div>${note('三个样本用于展示视觉变化，不代表实时数据与实际站点测量值。')}</div>`;
      case 'serviceJourney':return `<div class="component service-journey">${label('SERVICE / FRONTSTAGE & BACKSTAGE','服务概念 · 旅程关系')}${tabButtons(['课前 / 选择','课中 / 支持','课后 / 延续'],'data-journey')}<div class="journey-panel" aria-live="polite">${journeyPanel(0)}</div>${note('前台触点与后台角色需要同步安排；概念尚需课程内的实际试点验证。')}</div>`;
      case 'loopDemo':return `<div class="component loop-demo">${label('LOOPLAB / MVP SCOPE','作品集展示重构 · 服务概念')}<div class="loop-display"><div class="loop-menu"><div class="loop-logo">LoopLab.</div>${loopModules.map((m,i)=>`<button data-loop="${i}" aria-pressed="${i===0}">${m[0]}</button>`).join('')}</div><div class="loop-content" aria-live="polite">${loopContent(0)}</div></div>${note('此界面说明 MVP 的模块关系，原项目交付为服务方案；材料与流程属于概念展示。')}</div>`;
      case 'loopPipeline':return pipeline('SERVICE / ONLINE TO OFFLINE',[['需求入口','发布、团购或制作预约。'],['信息确认','规格、数量、时间与条件。'],['资源与制作','连接材料和制作服务。'],['线下交接','核对结果与完成取件。']],'履约角色、成本与责任需要在概念落地时进一步确认。');
      case 'stateMachine':return `<div class="component state-machine artemis-logic">${label('PLAYER / HEX LOCOMOTION','依据当前六边形地图脚本')}<div class="logic-input"><span class="logic-kicker">INPUT / 先检查能不能走</span><p><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> 选择相邻六边形方向；通过边界、可行走性与高度差检查，再提交目标。</p><ul><li>目标格存在且 IsWalkable</li><li>与当前格的高度差 ≤ 1</li><li>满足移动指令的冷却间隔</li></ul></div>${tabButtons(states.map(s=>s.name),'data-state')}<div class="state-diagram">${stateSvg()}</div>${stateMobile()}<div class="state-detail" aria-live="polite">${stateDetail(0)}</div><div class="logic-implementation"><div><h4>目标与动画分开管理</h4><p>SetHexPath 保存目标队列；移动状态读取目标方向。已经起步或持续移动时，新路径更新目标，不重复发起起步。</p></div><div><h4>状态切换清理上一状态</h4><p>ChangeState 依次执行旧状态 OnExit 与新状态 OnEnter；各状态在进入、退出时绑定或移除输入监听。</p></div></div>${note('展示玩家移动主链；状态机另含跳跃、攀爬和落地等分支。到达阈值为 0.4 个世界单位。')}</div>`;
      case 'artemisChain':return artemisChain();
      case 'artemisEnemies':return artemisEnemies();
      case 'filmPipeline':return pipeline('FILM / SHOT PRODUCTION',[['角色与分镜','确认人物、场景与画面。'],['结构化镜头','构图、动作阶段、时间点。'],['生成与检查','角色一致性与动作衔接。'],['后期与发布','局部修正、合成与剪辑。']],'制作流程保留人工检查与局部修正，持续整理角色参考和镜头约束。');
      case 'gardenMap':return `<div class="component">${label('GARDEN / EXPLORATION & DIALOGUE') }<div class="garden-diagram">${gardenGraphic('detail')}</div><div class="garden-detail"><div><h3>探索</h3><p>玩家位置和视角决定可到达的场景。</p></div><div><h3>触发</h3><p>条件满足后打开文化内容入口。</p></div><div><h3>对话</h3><p>NPC 交互连接知识和下一步探索。</p></div></div>${note('图形为探索与对话关系示意，不复原真实园区地理或完整游戏地图。')}</div>`;
      case 'gardenPipeline':return pipeline('ADAPTATION / WEB TO MINI PROGRAM',[['原网页模块','梳理 NPC 与摄像机逻辑。'],['交互改写','衔接触发、对话与探索。'],['环境适配','调整小程序中的操作。'],['部署与检查','配合团队完成呈现。']],'项目职责集中于所负责交互模块与适配，团队完成整体文化科普作品。');
      default:throw new Error(`Undefined component: ${id}`);
    }
  }
  function chapter(c,i){return `<section class="case-chapter" id="chapter-${i+1}" aria-labelledby="chapter-title-${i+1}"><div class="chapter-heading"><p class="eyebrow">${esc(c.eyebrow)}</p><h2 id="chapter-title-${i+1}">${esc(c.title)}</h2><p>${esc(c.text)}</p></div>${c.component?component(c.component):''}${c.image?figure(c.image,c.caption||c.title):''}${c.gallery?`<div class="figure-gallery">${c.gallery.map(g=>figure(...g)).join('')}</div>`:''}${c.cards?`<div class="case-cards">${c.cards.map(c=>`<article><h3>${esc(c[0])}</h3><p>${esc(c[1])}</p></article>`).join('')}</div>`:''}</section>`;}
  function setupCase(){
    const id = new URLSearchParams(location.search).get('project') || 'rallylens';
    const p = portfolio.projects.find(p=>p.id===id);
    if(!p){document.querySelector('main').innerHTML='<section class="section-pad"><h1>没有找到这个项目。</h1><p style="margin-top:25px"><a class="text-link" href="index.html#work">返回项目目录 →</a></p></section>';return;}
    document.title=`${p.name} — 卞文璟作品集`;
    document.body.dataset.project=p.id;
    document.documentElement.style.setProperty('--accent',p.color);
    document.documentElement.style.setProperty('--tone',p.tone);
    document.documentElement.style.setProperty('--case-file-bg',fileThemes[p.id].bg);
    const next=portfolio.projects[(portfolio.projects.indexOf(p)+1)%portfolio.projects.length];
    document.querySelector('main').innerHTML=`<section class="case-hero"><div class="case-breadcrumb"><a href="index.html#work">← 全部项目</a><span>${p.number} / ${esc(p.label)} / ${esc(p.year)}</span></div><div class="case-title-grid"><div><h1 class="${chineseTitle(p).trim()}">${esc(p.name)}</h1><p class="case-subtitle">${esc(p.cn)}</p></div><p>${esc(p.summary)}</p></div><dl class="case-meta"><div><dt>MY ROLE / 我的工作</dt><dd>${esc(p.role)}</dd></div><div><dt>DELIVERY / 交付状态</dt><dd>${esc(p.status)}</dd></div><div><dt>METHODS & TOOLS / 方法与技术</dt><dd>${p.tools.map(esc).join(' · ')}</dd></div></dl><div class="case-cover">${p.cover?`<img src="${asset(p.cover)}" alt="${esc(p.coverAlt)}" fetchpriority="high">`:gardenCover('hero')}</div><p class="case-cover-caption">${p.cover?esc(p.coverAlt):'作品集展示重构 · 场景探索关系示意'}</p></section><section class="case-overview"><div><p class="eyebrow">CONTEXT / 项目背景</p><h2>问题从哪里开始。</h2><p>${esc(p.intro)}</p><div class="case-metrics">${p.metrics.map(m=>`<div><strong>${esc(m[0])}</strong><span>${esc(m[1])}</span></div>`).join('')}</div></div><div class="responsibilities"><h3>我负责的部分</h3><ul>${p.responsibilities.map(r=>`<li>${esc(r)}</li>`).join('')}</ul></div></section><div class="case-body"><aside class="case-toc" aria-label="案例章节"><p class="eyebrow">IN THIS CASE</p>${p.chapters.map((c,i)=>`<a href="#chapter-${i+1}"><small>0${i+1}</small>${esc(c.eyebrow.split('/').slice(1).join('/').trim())}</a>`).join('')}${p.videos?'<a href="#project-videos"><small>↳</small>VIDEOS / 成片</a>':''}<a href="#project-results"><small>↳</small>OUTPUT / 交付</a></aside><div class="case-content">${p.chapters.map(chapter).join('')}${p.videos?`<section class="case-videos" id="project-videos"><p class="eyebrow">PROJECT VIDEOS / 项目视频</p><h2>在片段中，看到具体的过程。</h2><div class="video-grid">${p.videos.map(v=>`<figure class="video-item"><video src="media/${esc(v.src)}" poster="${asset(v.poster)}" controls preload="metadata" playsinline aria-label="${esc(v.title)}"></video><figcaption><h3>${esc(v.title)}</h3><p>${esc(v.note)}</p></figcaption></figure>`).join('')}</div></section>`:''}<section class="case-result" id="project-results"><p class="eyebrow">OUTPUT / 交付与后续</p><h2>把成果落在可见的作品中。</h2><ul>${p.outcomes.map(o=>`<li>${esc(o)}</li>`).join('')}</ul><div class="case-reflection"><h3>下一步，我会继续检查</h3><p>${esc(p.reflection)}</p></div>${p.links.length?`<div class="case-links">${p.links.map(l=>`<a class="text-link" href="${esc(l[1])}" target="_blank" rel="noopener noreferrer">${esc(l[0])}<span>↗</span></a>`).join('')}</div>`:''}</section></div></div><a class="case-next" href="${caseUrl(next.id)}"><div><p>NEXT PROJECT / ${next.number}</p><h2>${esc(next.name)} — ${esc(next.cn)}</h2></div><span aria-hidden="true">↗</span></a>`;
    if(p.id==='growth-compass'){
      document.querySelector('.case-cover').innerHTML=growthCover();
      document.querySelector('.case-cover-caption').textContent='服务概念视觉 · 本次作品集展示重构';
    }
    bindComponents();setupLightbox();setupReadingProgress();
  }
  function choose(button,selector){document.querySelectorAll(selector).forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}
  function bindComponents(){
    document.querySelectorAll('[data-evidence]').forEach(b=>b.addEventListener('click',()=>{choose(b,'[data-evidence]');const i=+b.dataset.evidence;document.querySelector('.evidence-map').innerHTML=evidenceSvg(i);document.querySelector('.evidence-detail').innerHTML=evidenceDetail(i);}));
    document.querySelectorAll('[data-layer]').forEach(b=>b.addEventListener('click',()=>{choose(b,'[data-layer]');document.querySelector('.layer-display').innerHTML=layerDetail(+b.dataset.layer);}));
    let permission=0;
    document.querySelectorAll('[data-permission]').forEach(b=>b.addEventListener('click',()=>{choose(b,'[data-permission]');permission=+b.dataset.permission;document.querySelector('.privacy-sim').innerHTML=privacyCard(permission);}));
    document.querySelector('.privacy-sim')?.addEventListener('click',e=>{const b=e.target.closest('[data-decision]');if(!b)return;const accepted=b.dataset.decision==='accept';document.querySelector('.permission-feedback').innerHTML=`<small>RULE FEEDBACK / ${accepted?'ACCEPTED':'REFUSED'}</small><h4>已${accepted?'接受':'拒绝'}这项模拟请求。</h4><p>${accepted?'接受前应确认用途和边界。':'拒绝后可继续检查任务是否有替代路径。'}${permissions[permission][3]}</p><div class="sim-events">${permissions[permission][0]} → ${accepted?'ACCEPT':'REFUSE'} → RULE EXPLANATION</div>`;});
    document.querySelector('#batch-size')?.addEventListener('input',e=>{document.querySelector('#batch-number').value=e.target.value;});
    document.querySelectorAll('[data-film]').forEach(b=>b.addEventListener('click',()=>{choose(b,'[data-film]');const i=+b.dataset.film;const video=document.querySelector('#tennis-video');video.pause();video.src=`media/tennis-${i+1}.mp4`;video.poster=asset(`tennis-real-${i+1}`);video.setAttribute('aria-label',`TennisAtom 真人定制视频 0${i+1}`);video.load();document.querySelector('.tennis-info').innerHTML=`<span class="film-code">0${i+1}</span><p class="eyebrow">TENNISATOM / PERSONAL FILM</p><h3>${tennisFilms[i][0]}</h3><p>${tennisFilms[i][1]}</p>`;}));
    document.querySelectorAll('[data-glyph]').forEach(b=>b.addEventListener('click',()=>{choose(b,'[data-glyph]');document.querySelector('.glyph-display').innerHTML=glyphContent(+b.dataset.glyph);}));
    document.querySelectorAll('[data-journey]').forEach(b=>b.addEventListener('click',()=>{choose(b,'[data-journey]');document.querySelector('.journey-panel').innerHTML=journeyPanel(+b.dataset.journey);}));
    document.querySelectorAll('[data-loop]').forEach(b=>b.addEventListener('click',()=>{choose(b,'[data-loop]');document.querySelector('.loop-content').innerHTML=loopContent(+b.dataset.loop);}));
    document.querySelectorAll('[data-state]').forEach(b=>b.addEventListener('click',()=>{choose(b,'[data-state]');const i=+b.dataset.state;document.querySelector('.state-diagram').innerHTML=stateSvg(i);document.querySelector('.state-detail').innerHTML=stateDetail(i);}));
  }
  function setupLightbox(){
    const dialog=document.querySelector('#lightbox');
    document.querySelectorAll('[data-full-image]').forEach(button=>button.addEventListener('click',()=>{dialog.querySelector('img').src=button.dataset.fullImage;dialog.querySelector('img').alt=button.dataset.caption;dialog.querySelector('p').textContent=button.dataset.caption;dialog.showModal();}));
    dialog.querySelector('button').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  }
  function setupReadingProgress(){
    const bar=document.querySelector('.case-progress span');let queued=false;
    const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;bar.style.width=`${max>0?Math.min(100,scrollY/max*100):0}%`;queued=false;};
    window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update);}},{passive:true});
    window.addEventListener('resize',update);update();
    const sections=[...document.querySelectorAll('.case-chapter,.case-videos,.case-result')];const links=[...document.querySelectorAll('.case-toc a')];
    const observer=new IntersectionObserver(entries=>{const seen=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);if(seen.length){links.forEach(a=>{const active=a.hash===`#${seen[0].target.id}`;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}},{rootMargin:'-5% 0px -65% 0px',threshold:0});
    sections.forEach(s=>observer.observe(s));
  }
  if(document.querySelector('#project-grid'))setupHome();else setupCase();
})();
