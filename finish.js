/* Art-directed evidence tools. All numerical marks derive from the published source subset. */
(() => {
 'use strict';
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)], id=document.body.dataset.project;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19L19 5M5 5H19V19" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
 $$('.plate-link').forEach(a=>{a.innerHTML=`<span class="finish-cta-label">查看完整项目</span><span class="finish-cta-icon">${arrow}</span>`;a.setAttribute('aria-label',`查看完整项目：${$('.plate-title',a.closest('article')||a.parentElement)?.textContent||'项目案例'}`);});
 $$('.reference-chapter-graphic,.reference-chapter-stamp').forEach(n=>n.remove());
 const guide=$('.rv-case-guide');
 if(guide){const links=$$('a',guide),targets=links.map(a=>$(a.getAttribute('href'))).filter(Boolean);const io=new IntersectionObserver(entries=>{const current=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];if(!current)return;links.forEach(a=>a.setAttribute('aria-current',String(a.hash==='#'+current.target.id)));},{rootMargin:'-10% 0px -65% 0px'});targets.forEach(t=>io.observe(t));}
 if(!id)return;
 const svg=(w,h,title,desc,b)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}" font-family="Arial, Microsoft YaHei, sans-serif" font-size="16" fill="#23372f"><title>${esc(title)}</title><desc>${esc(desc)}</desc>${b}</svg>`;
 const panel=(code,title,body,note,mark='↗')=>{const n=document.createElement('section');n.className='rv-panel finish-panel';n.innerHTML=`<header><div><span class="rv-code">${code}</span><h3>${title}</h3></div><b aria-hidden="true">${mark}</b></header>${body}<p class="rv-source">${note}</p>`;return n;};
 const chapter=n=>$(`#chapter-${n} .chapter-visuals`);
 const controls=(labels,key)=>`<div class="rv-controls" role="group" aria-label="切换图表视角">${labels.map((t,i)=>`<button ${key}="${i}" aria-pressed="${i===0}">${t}</button>`).join('')}</div>`;
 const tabs=(n,key,fn)=>{const bs=$$(`[${key}]`,n),go=i=>{bs.forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));fn(i);};bs.forEach((b,i)=>{b.onclick=()=>go(i);b.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();e.stopPropagation();const j=e.key==='Home'?0:e.key==='End'?bs.length-1:(i+(e.key==='ArrowRight'?1:-1)+bs.length)%bs.length;bs[j].focus();go(j);};});go(0);};
 const json=async url=>{const r=await fetch(url);if(!r.ok)throw new Error(url);return r.json();};
 const error=n=>n.insertAdjacentHTML('beforeend','<p class="rv-source" role="status">图表数据暂未载入；原项目图与说明仍可阅读。</p>');
 if(id==='privacy-city')privacyErrors();
 if(id==='baseball')pitchDistribution();
 if(id==='rallylens')evidenceCoverage();
 if(id==='growth-compass')growthMap();
 if(id==='garden')wordToWorld();
  readingContinuity();
  if(id==='tennisatom')pairedFilms();
  if(id==='afterglow')afterglowIterations();

  function readingContinuity(){
   const routes={
    rallylens:['共同训练的问题','双方解释工作台','研究、证据与设计','原型与论文'],
    'privacy-city':['为什么研究授权','比较模型与误判','事件、特征与实验','网页与离线交付'],
    tennisatom:['为什么制作肖像','真人与数据成片','研究、管线与风格','个人影片与系统'],
    baseball:['为什么分层读数据','三个阅读尺度','字段、图表与交互','前端与数据交付'],
    artemis:['探索与科学试错','移动规则检查','状态机、构筑与战斗','游戏与宣传影片'],
    bronze:['故事与创作职责','十集动画成片','双线、角色与镜头','成片与制作资料'],
    afterglow:['公共空间的问题','环境字形原型','编码、迭代与空间','代码与视觉输出'],
    'growth-compass':['学习期待的错位','学习服务路径','研究、旅程与协作','服务方案与后续'],
    looplab:['校园制作的需求','材料交接流程','研究、模块与履约','产品与商业模式'],
    garden:['文化解谜与职责','园景与改字体验','叙事、机制与适配','模块与团队交付']
   };
   $$('.rv-case-guide a').forEach((a,i)=>{const s=$('span',a);if(s&&routes[id]?.[i])s.textContent=routes[id][i];});
   const next=$('.case-next');if(next){const dest=new URL(next.href).searchParams.get('project');next.dataset.nextProject=dest;next.setAttribute('aria-label','查看下一个项目：'+$('h2',next).textContent);next.insertAdjacentHTML('beforeend','<span class="finish-next-action">查看项目 '+arrow+'</span>');}
   const h=$('.case-result>h2');if(h)h.textContent='交付了什么';
  }

  function pairedFilms(){
   const root=$('.portrait-director'),left=$('.director-stage',root);if(!root||!left)return;
   root.classList.add('finish-paired-cinema');
   left.insertAdjacentHTML('afterbegin','<div class="finish-film-label"><span>01 / PERSONAL FILM</span><h3>把运动，剪成个人表达。</h3></div>');
   left.insertAdjacentHTML('beforeend','<p class="finish-film-caption" data-film-pair-label>FILM 01 ↔ MAIN V6</p>');
   const names=['main-v6','chen-v2','yang-v2','lin-v3','vivian-v3'];
   root.insertAdjacentHTML('beforeend',`<div class="finish-data-stage"><div class="finish-film-label"><span>02 / DATA PORTRAIT</span><h3>让动作信息，成为画面。</h3></div><div class="finish-data-live"><video id="director-data-video" controls playsinline preload="metadata" poster="assets/tennis-data-main-v6.webp" src="media/tennis-data-main-v6.mp4" aria-label="与真人成片对应的数据可视化视频"></video></div><div class="film-switch finish-data-switch" role="group" aria-label="按对应关系选择数据视频">${names.map((f,i)=>`<button type="button" data-film-data="${i}" aria-pressed="${i===0}"><img src="assets/tennis-data-${f}.webp" alt="${f}数据视频截图" loading="lazy"><span>${f.replace('-',' / ').toUpperCase()}</span></button>`).join('')}</div><p class="finish-film-caption" data-data-video-label>对应第 01 支真人成片 · main-v6.mp4 · 30 s</p><p class="finish-video-status" role="status" aria-live="polite"></p></div>`);
   const v=$('#director-data-video'),film=$('#director-video'),buttons=$$('[data-studio-video]',root);
   const select=i=>{v.pause();v.src=`media/tennis-data-${names[i]}.mp4`;v.poster=`assets/tennis-data-${names[i]}.webp`;v.load();$$('[data-film-data]',root).forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));$('[data-data-video-label]',root).textContent=`对应第 ${String(i+1).padStart(2,'0')} 支真人成片 · ${names[i]}.mp4 · 约 30 s`;$('[data-film-pair-label]',root).textContent=`FILM ${String(i+1).padStart(2,'0')} ↔ ${names[i].toUpperCase()}`;$('.finish-video-status',root).textContent='';};
   buttons.forEach((b,i)=>b.addEventListener('click',()=>select(i)));
   tabs(root,'data-film-data',i=>{if(buttons[i])buttons[i].click();else select(i);});
   film?.addEventListener('play',()=>v.pause());v.addEventListener('play',()=>film?.pause());
   v.addEventListener('error',()=>$('.finish-video-status',root).textContent='视频暂未载入，请重选或刷新；对应的原始截图仍可查看。');
    const caption=$('.studio-boundary',root.closest('.project-workbench'));if(caption)caption.textContent='真人成片与数据肖像配对：01 main / 02 chen / 03 yang / 04 lin / 05 vivian。左右独立计时与审看，播放一侧时暂停另一侧。';
   const title=$('.experience-heading h2');if(title)title.textContent='五种肖像，两种观看方式。';
  }

  function afterglowIterations(){
   const steps=[['01','从信息展示到视觉脉冲','面对扁平、密集的交通信息，先以放射排版建立识别。','研究汇报 / V1'],['02','让环境进入形态','同心环与切片遮罩承接四路信号，但文字仍是被动的背景。','研究汇报 / V2'],['03','让每个字成为载体','用逐字变换建立径向字形；独立通道开始形成，但随机扭曲与整点跳变仍影响连续性。','研究汇报 + V3 代码'],['04','把碎裂收成呼吸','相干正弦波组织整体变形，插值连接相邻样本；放大环形尺度，并将最终表达收为黑白。','研究汇报 + V4 代码']];
   const n=panel('ITERATION / FRICTION → DECISION','不是加更多效果，而是让每种变化有理由。',`<ol class="finish-iteration-steps">${steps.map(s=>`<li><b>${s[0]}</b><span>${s[3]}</span><h4>${s[1]}</h4><p>${s[2]}</p></li>`).join('')}</ol><div class="finish-version-bridge"><img src="assets/afterglow-version-bridge.svg" alt="V3整点保持与V4线性插值对照，使用原代码06至08时的三个内置示例样本"><div><span class="rv-code">SAME SAMPLES / DIFFERENT RENDERING</span><h4>样本没有增加，变化更连续。</h4><p>V4 在相邻数据点之间插值，让图形逐帧过渡。插值改善显示方式，不会提高观测精度，也不产生新的实测数据。</p><p>我负责 V3 / V4 代码、数据处理、最终主视觉、编码图与建筑场景渲染。</p></div></div>${controls(['01 / 人流','02 / 噪声','03 / PM2.5','04 / 风'],'data-afterglow-channel')}<div class="finish-channel-reading" aria-live="polite"></div><details class="finish-source-fold"><summary>展开原始编码图与低／中／高状态板</summary><img src="assets/afterglow-mapping-board.webp" alt="原项目四路数据编码图" loading="lazy"><img src="assets/afterglow-state-board.webp" alt="原项目低中高视觉状态，属于示例展示状态" loading="lazy"></details>`,'V1—V4 的摩擦与决定依据最终汇报；V3→V4 的插值与参数变换另用原 HTML 核对。内置数据的采集来源未再次核验，不写作本站实时观测。','V4');
   chapter(2)?.prepend(n);
   const channels=[['FLOW','环幅 × 密度','人流改变环的半径、字形间距和方向数。密度不再只是装饰，而是同一骨架中的视觉变量。','span = maxR × (0.50 + 0.46 × fN)'],['NOISE','波瓣 × 振幅 × 扭曲','噪声进入波瓣数量、波幅、旋转和剪切；统一相位把相邻字形组织成连贯的形变。','warp = sin(angle × lobes − phase + j × 0.55)'],['PM2.5','字号 × 外圈膨胀','V4 用字号与外圈字形膨胀表达该通道。实际代码中的字重仍由独立手动开关控制，不写成由空气指标自动决定。','glyphMul = (0.8 + 0.85 × pN) × size'],['WIND','行进速度 × 倾斜','风速影响行进波的相位推进和整体侧倾。运动通道与静态字形通道分开，读者能检查是哪一类输入在改变。','lean = (wN − 0.45) × 0.55']];
   tabs(n,'data-afterglow-channel',i=>{const s=channels[i];$('.finish-channel-reading',n).innerHTML=`<b>${s[0]}</b><div><h4>${s[1]}</h4><p>${s[2]}</p><code>${esc(s[3])}</code></div>`;});
   const gallery=panel('RENDER / PAPER → CONCOURSE → DOME','同一轮廓，在三个观看尺度中成立。',`<div class="finish-render-gallery"><figure><img src="assets/afterglow-output-a.webp" alt="原项目黑白夜间A3字形输出" loading="lazy"><figcaption>01 / 纸面输出<br>黑白终稿 · 原 A3 导出</figcaption></figure><figure><img src="assets/afterglow-render-concourse.webp" alt="原项目候车厅独立屏幕场景效果图，非落地照片" loading="lazy"><figcaption>02 / 行走视线<br>独立屏幕 · 原场景效果图</figcaption></figure><figure><img src="assets/afterglow-render-dome.webp" alt="原项目穹顶字形投影效果图，非实际安装照片" loading="lazy"><figcaption>03 / 建筑尺度<br>穹顶投影 · 原场景效果图</figcaption></figure></div><div class="finish-render-rationale"><article><b>远看轮廓</b><p>中心盘与整环先建立识别，让字形细节退到第二阅读层。</p></article><article><b>近看纹理</b><p>用字形朝向、密度和形变组织细节，保留画面下方的负空间。</p></article><article><b>从作品到方案</b><p>屏幕、投影与维护属于空间提案；渲染图不作为已建成或现场测试的证据。</p></article></div>`,'本区直接使用团队原始 A3 输出、1.png 与 2.png，仅等比例压缩。三图表示媒介与场景的区别，不标成不同版本的实测截图。','A3');
   chapter(3)?.prepend(gallery);
  }
 
 function privacyErrors(){
  // Three existing forward/backward diagrams told the same story. Keep the computation graph once.
  const duplicate=$('.rv-network-spread')?.closest('.rv-panel');
  const n=panel('ERROR ATLAS / TWO CLASS DENOMINATORS','同样的高召回，可能承担不同的误判。',controls(['NumPy MLP','PyTorch MLP','Random Forest','Decision Tree','Logistic Regression'],'data-finish-confusion')+'<div class="finish-keyline"><b>750</b><span>同一测试集 · 每一格为记录数，不按颜色猜结果。</span></div><div class="finish-reading-grid"><div class="finish-chart" data-finish-confusion-plot></div><aside class="finish-reading" data-finish-confusion-reading aria-live="polite"></aside></div>','依据原 model_comparison.json 的测试集数量、正类比例、召回率与特异度反算整数计数，并核对 Accuracy / Precision 一致性。百分比以各行实际类别为分母。合成数据，非真实访客隐私画像。','2×2');
  if(duplicate)duplicate.replaceWith(n);else chapter(4)?.append(n);
  // The compact topology already provides the exact layer widths. Remove the second copy.
  $$('.depth-panel',chapter(3)).filter(p=>$('.depth-code',p)?.textContent==='NUMPY / COMPUTATION GRAPH').forEach(p=>p.remove());
  json('assets/editorial/privacy-models.json').then(raw=>{
   const N=raw.dataset_info.n_test,P=Math.round(N*raw.dataset_info.pos_ratio_test),Q=N-P;
   const names=['NumPy MLP','PyTorch MLP','Random Forest','Decision Tree','Logistic Regression'];
   tabs(n,'data-finish-confusion',i=>{
    const [key,m]=Object.entries(raw.models).find(([k])=>k.includes(names[i])),TP=Math.round(P*m.recall),TN=Math.round(Q*m.specificity),FN=P-TP,FP=Q-TN;
    if(Math.abs((TP+TN)/N-m.accuracy)>1e-10||Math.abs(TP/(TP+FP)-m.precision)>1e-10)throw new Error('Integer reconstruction did not agree');
    const cells=[[TN,'正确保护','TN',185,115,false],[FP,'保护 → 妥协','FP',395,115,true],[FN,'妥协 → 保护','FN',185,280,true],[TP,'正确妥协','TP',395,280,false]];
    let b='<text x="185" y="30">预测类别 / PREDICTED</text><text x="275" y="78" text-anchor="middle">保护 / 0</text><text x="485" y="78" text-anchor="middle">妥协 / 1</text><text x="22" y="163">实际保护</text><text x="22" y="194">n = '+Q+'</text><text x="22" y="329">实际妥协</text><text x="22" y="359">n = '+P+'</text>';
    b+=cells.map(([v,label,code,x,y,bad])=>`<g><rect x="${x}" y="${y}" width="190" height="145" fill="${bad?'#f4dde3':'#dae7df'}" stroke="${bad?'#ab2953':'#8fa399'}"/><text x="${x+17}" y="${y+30}" style="font-size:14px">${code} / ${label}</text><text x="${x+17}" y="${y+93}" style="font-size:52px;font-weight:700;fill:${bad?'#a7224c':'#254e3b'}">${v}</text><text x="${x+17}" y="${y+125}" style="font-size:14px">${(v/(y===115?Q:P)*100).toFixed(1)}% / 本行</text></g>`).join('');
    b+='<text x="185" y="468">类别分母不同，不能仅凭总准确率比较两类。</text>';
    $('[data-finish-confusion-plot]',n).innerHTML=svg(625,500,names[i]+'测试集混淆矩阵','横向为预测，纵向为实际。保护类194，妥协类556；每格显示整数与本行比例。',b);
    $('[data-finish-confusion-reading]',n).innerHTML=`<span class="rv-code">${esc(key)} / FIXED TEST SET</span><h4>误判落在哪里？</h4><strong>${FP+FN}</strong><p>当前模型的分类错误 / ${N} 条</p><dl><div><dt>保护被判为妥协 / FP</dt><dd>${FP} / ${Q}</dd></div><div><dt>妥协被判为保护 / FN</dt><dd>${FN} / ${P}</dd></div><div><dt>保护类特异度</dt><dd>${(m.specificity*100).toFixed(1)}%</dd></div><div><dt>妥协类召回率</dt><dd>${(m.recall*100).toFixed(1)}%</dd></div></dl><p>两种错误对应不同的分类代价。这里解释原实验输出，不替用户作授权决定，也不重新选择阈值。</p>`;
   });
  }).catch(()=>error(n));
 }
 function pitchDistribution(){
  const n=panel('PITCH DISTRIBUTION / EMPIRICAL CDF','球速不只是一个均值，而是一整段分布。',controls(['2024','2025','2026'],'data-finish-pitch-year')+'<div class="finish-keyline"><b>F(x)</b><span>累计比例：有多少有效记录的球速不高于 x？曲线以每一种球的有效记录数为分母。</span></div><div class="finish-reading-grid"><div class="finish-chart" data-finish-cdf></div><aside class="finish-reading" aria-live="polite" data-finish-pitch-reading></aside></div>','山本投手逐球 CSV 的 release_speed，按球种分别排序，F(x) = # (speed ≤ x) / 有效记录数；不平滑、不外推。四分位数使用最近秩法，缺失单列。2026 仅对应源文件覆盖期。','F(x)');
  chapter(2)?.append(n);
  json('assets/baseball-records.json').then(raw=>{tabs(n,'data-finish-pitch-year',i=>{
   const year=String(2024+i),all=raw.pitch.filter(r=>r.game_date.startsWith(year)),valid=all.filter(r=>Number.isFinite(r.release_speed)),groups=[...new Set(valid.map(r=>r.pitch_type))].map(k=>({key:k,name:valid.find(r=>r.pitch_type===k).pitch_name,values:valid.filter(r=>r.pitch_type===k).map(r=>r.release_speed).sort((a,b)=>a-b)})).sort((a,b)=>b.values.length-a.values.length);
   const palette=['#c32c55','#265fcc','#357b57','#895c22','#7e489b','#3a7688'],dash=['','8 4','2 3','10 3 2 3','5 2 2 2','12 3 3 3 3 3'],X=v=>70+(v-60)/45*485,Y=v=>337-v*255;
   let b='<text x="70" y="30">累计比例 / % · 每条曲线各自从 0 到 100</text>';
   [0,.25,.5,.75,1].forEach(v=>b+=`<path d="M70 ${Y(v)}H555" stroke="#b9c7bd"/><text x="52" y="${Y(v)+5}" text-anchor="end">${v*100}</text>`);
   [60,70,80,90,100,105].forEach(v=>b+=`<path d="M${X(v)} 82V337" stroke="#d3dcd5"/><text x="${X(v)}" y="369" text-anchor="middle">${v}</text>`);
   groups.forEach((g,j)=>{let commands=`M${X(60)} ${Y(0)}`;g.values.forEach((v,k)=>{commands+=`H${X(v)}V${Y((k+1)/g.values.length)}`;});commands+=`H${X(105)}`;b+=`<path d="${commands}" fill="none" stroke="${palette[j%6]}" stroke-width="2.2" stroke-dasharray="${dash[j%6]}"/>`;});
   b+='<text x="312" y="402" text-anchor="middle">投球初速 / mph · 共同横轴 60—105</text>';
   groups.forEach((g,j)=>{const x=70+(j%2)*265,y=439+Math.floor(j/2)*30;b+=`<path d="M${x} ${y-5}h22" stroke="${palette[j%6]}" stroke-width="3" stroke-dasharray="${dash[j%6]}"/><text x="${x+33}" y="${y}" style="font-size:14px">${g.key} / ${g.name} · n=${g.values.length}</text>`;});
   $('[data-finish-cdf]',n).innerHTML=svg(625,455+Math.ceil(groups.length/2)*30,year+'各球种投球初速累计分布','共同横轴为60至105mph，各曲线以自身有效记录数归一；实线和虚线与代码标签区分类别。',b);
   const quant=(v,q)=>v[Math.max(0,Math.ceil(q*v.length)-1)];
   $('[data-finish-pitch-reading]',n).innerHTML=`<span class="rv-code">${year} / YAMAMOTO</span><h4>比较位置，<br>也比较展开程度。</h4><strong>${valid.length}</strong><p>有效投球初速记录 · 缺失 ${all.length-valid.length}</p><dl>${groups.map(g=>`<div><dt>${g.key} / ${g.name}</dt><dd>${quant(g.values,.25).toFixed(1)} / <b>${quant(g.values,.5).toFixed(1)}</b> / ${quant(g.values,.75).toFixed(1)}</dd></div>`).join('')}</dl><p>右表为 Q1 / 中位数 / Q3，单位 mph。曲线越靠右，同一累计比例对应的球速越高；更陡表示分布更集中，不等同投球更有效。</p>`;
  });}).catch(()=>error(n));
 }
 function evidenceCoverage(){
  const n=panel('EVIDENCE COVERAGE / SOURCE SUBSET','先检查证据是否存在，再解释模型的值。','<div class="finish-keyline"><b>12</b><span>DPE · 同一导出子集，保留“接触已确认”“未出现回应”与“未确认”三种状态。</span></div><div class="finish-chart" data-finish-coverage></div>','逐事件表中 actual_status 的精确计数。条长为事件数量，从 0 开始共用尺度；不是训练成效、成功率或搭档公平性。全表 160 条是全项目 2,204 次事件中的可核对子集。','▧');
  chapter(4)?.append(n);
  json('assets/composition/rally-events.json').then(all=>{
   const keys=[...new Set(all.map(r=>r.dpe_id))],rows=keys.map(key=>{const rs=all.filter(r=>r.dpe_id===key),count=s=>rs.filter(r=>r.actual_status===s).length;return{key,n:rs.length,a:count('observed_contact_model_estimate'),b:count('observed_no_response_zero'),c:rs.length-count('observed_contact_model_estimate')-count('observed_no_response_zero')};}),max=Math.ceil(Math.max(...rows.map(r=>r.n))/5)*5,X=v=>135+v/max*600;
   let b='<defs><pattern id="finish-missing" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 6L6 0" stroke="#6a7770" stroke-width="1"/></pattern></defs><text x="135" y="30">逐事件记录 / COUNT</text>';
   for(let t=0;t<=max;t+=5)b+=`<path d="M${X(t)} 57V${81+rows.length*41}" stroke="#c3cfc6"/><text x="${X(t)}" y="${111+rows.length*41}" text-anchor="middle">${t}</text>`;
   rows.forEach((r,j)=>{const y=77+j*41;b+=`<text x="18" y="${y+19}">${r.key.replace('DPE_','')}</text>`;[[r.a,'#2354d8'],[r.b,'#9baed1'],[r.c,'url(#finish-missing)']].reduce((sum,[v,fill])=>{b+=`<rect x="${X(sum)}" y="${y}" width="${X(v)-X(0)}" height="27" fill="${fill}"/>`;if(v>=3)b+=`<text x="${X(sum+v/2)}" y="${y+19}" text-anchor="middle" style="fill:${fill==='#2354d8'?'#fff':'#162538'};font-size:14px">${v}</text>`;return sum+v;},0);b+=`<text x="${X(r.n)+10}" y="${y+19}">${r.n}</text>`;});
   const bottom=150+rows.length*41;b+=`<rect x="135" y="${bottom}" width="15" height="15" fill="#2354d8"/><text x="160" y="${bottom+13}">接触已确认</text><rect x="340" y="${bottom}" width="15" height="15" fill="#9baed1"/><text x="365" y="${bottom+13}">未出现回应</text><rect x="550" y="${bottom}" width="15" height="15" fill="url(#finish-missing)"/><text x="575" y="${bottom+13}">其余 / 未确认</text>`;
   $('[data-finish-coverage]',n).innerHTML=svg(800,bottom+45,'12个DPE的实际回应证据覆盖','每行一段DPE。三类状态按actual_status计数，不合并模型估计和观察。',b);
  }).catch(()=>error(n));
 }
 function growthMap(){
  const rows=[['课程能力难理解','课程预览 / 能力地图','课程目标与案例','知道要学什么'],['作业要求缺支架','设计逻辑画布','任务书 / 正反案例','知道从哪里开始'],['投入与目标脱节','试听 / 调整 / 成长档案','微任务 / 反馈记录','选择并回看自己的路径']];
  const n=panel('INTERVENTION MAP / RESEARCH → SERVICE','三类问题，分别交给合适的服务触点。',controls(['01 / 理解课程','02 / 开始作业','03 / 调整目标'],'data-finish-growth')+'<div class="finish-concept-art" tabindex="0" aria-label="问题到触点的关系图，可横向滚动"><div data-finish-growth-map></div></div><div class="finish-keyline" data-finish-growth-note aria-live="polite"></div>','依据原最终汇报中的研究归纳、课程与作业两条旅程重排。连接说明设计回应，不表示已经测量的因果效果；目标为服务概念。','↳');
  const old=$$('.depth-panel',chapter(2)).find(n=>$('.depth-code',n)?.textContent==='CONCEPT / TOUCHPOINTS');if(old)old.replaceWith(n);else chapter(2)?.append(n);
  tabs(n,'data-finish-growth',active=>{
   let b='<text x="25" y="35">RESEARCH / 问题</text><text x="305" y="35">TOUCHPOINT / 前台</text><text x="650" y="35">RESOURCE / 后台</text>';
   rows.forEach((r,i)=>{const y=72+i*119,a=i===active;b+=`<path d="M250 ${y+39}H295M610 ${y+39}H642" stroke="${a?'#2456cf':'#bdc7bb'}" stroke-width="${a?3:1.5}"/><path d="M283 ${y+33}l10 6-10 6M630 ${y+33}l10 6-10 6" fill="none" stroke="${a?'#2456cf':'#bdc7bb'}"/>${[[25,225,r[0]],[305,305,r[1]],[650,270,r[2]]].map(([x,w,t],j)=>`<rect x="${x}" y="${y}" width="${w}" height="78" fill="${a&&j===1?'#2456cf':a?'#e1e9d9':'#f0f1e8'}" stroke="${a?'#315aa4':'#b9c5b6'}"/><text x="${x+15}" y="${y+46}" style="fill:${a&&j===1?'#fff':'#263b2b'};font-size:17px">${t}</text>`).join('')}`;});
   $('[data-finish-growth-map]',n).innerHTML=svg(945,445,'研究问题、前台触点与后台资源的对应','每一行是一个定性设计映射。箭头不是学习成效测量。',b);
   $('[data-finish-growth-note]',n).innerHTML=`<b>0${active+1}</b><span>期望的下一步：${rows[active][3]}。触点提供支持，不能替学生决定兴趣，也不替代教师判断。</span>`;
  });
 }
 function wordToWorld(){
  const n=panel('WORD → WORLD / SEMANTIC INTERACTION','换一个字，园景给出可读的反馈。','<div class="finish-words" role="group" aria-label="选择原项目的改字谜题"><button data-finish-word="0" aria-pressed="true"><b>雾 → 风</b>水面散雾</button><button data-finish-word="1" aria-pressed="false"><b>云 → 月</b>天心明月</button></div><div class="finish-garden-spread"><div class="finish-chart" data-finish-word-art></div><div class="finish-garden-explain" data-finish-word-reading aria-live="polite"></div></div>','改字例子来自团队公开介绍。下方园景以代码重绘为语义示意，不是原游戏实机、真实园林复原或个人独立完成的谜题设计。原界面保留在本章下方。','字');
  chapter(2)?.prepend(n);
  const rows=[['雾来水面','风来水面','雾','风','清风散雾','“雾”描述遮蔽，“风”成为推动变化的条件。玩家不是填写答案，而是把字义的变化提交给场景。'],['云到天心','月到天心','云','月','唤出明月','“云”与“月”交换视觉状态。天心的中心位置保持不变，光源与氛围成为文字操作的反馈。']];
  tabs(n,'data-finish-word',i=>{
   const r=rows[i];let b=`<rect width="625" height="430" fill="${i?'#173d43':'#e4eadc'}"/><path d="M0 335Q150 310 310 335T625 335V430H0" fill="${i?'#245b5d':'#bfd1ba'}"/><path d="M30 365Q105 347 180 365T330 365T480 365T625 365M0 395Q70 378 145 395T295 395T445 395T595 395" stroke="${i?'#98bfa9':'#719e87'}" fill="none"/><path d="M55 286H345L290 222H113Z" fill="${i?'#bed1ba':'#315746'}"/><path d="M110 286V338M285 286V338M140 285V333M255 285V333" stroke="${i?'#bed1ba':'#315746'}" stroke-width="8"/><path d="M39 286Q118 260 172 216H225Q293 262 362 286" fill="none" stroke="${i?'#ced3a9':'#315746'}" stroke-width="5"/>`;
   b+=i?'<circle cx="478" cy="115" r="47" fill="#f1e5b6"/><path d="M443 184H526M465 197H514" stroke="#94b2a4"/>':'<path d="M380 152Q448 119 529 149M346 185Q428 150 564 184M366 217Q453 186 543 216" fill="none" stroke="#648972" stroke-width="3"/><path d="M531 141l12 8-12 9M566 176l12 8-12 9" fill="none" stroke="#648972" stroke-width="3"/>';
   b+=`<text x="28" y="43" style="fill:${i?'#e3e6c8':'#315746'};font-size:15px">SEMANTIC STUDY / ${i?'MOONLIGHT':'WIND'}</text><text x="29" y="91" style="fill:${i?'#e3e6c8':'#315746'};font-size:33px;font-weight:650">${r[1]}</text>`;
   $('[data-finish-word-art]',n).innerHTML=svg(625,430,r[4]+'的代码园景示意','亭、水面与风或月为原谜题字义的抽象构图，不是实机画面。',b);
   $('[data-finish-word-reading]',n).innerHTML=`<span class="rv-code">MEANING / ACTION / FEEDBACK</span><h4>${r[4]}</h4><div class="finish-garden-relation"><span>${r[0]}</span><b>→</b><span>${r[1]}</span></div><p>${r[5]}</p><dl><div><dt>玩家操作</dt><dd>提取词句 → 替换文字</dd></div><div><dt>系统反馈</dt><dd>${r[4]}</dd></div><div><dt>阅读闭环</dt><dd>字义 → 动作 → 园景</dd></div></dl><p>我的工作是 NPC、摄像机与跨端模块衔接；此图分析团队作品的交互机制，职责边界保持明确。</p>`;
  });
 }
 
 // Large, exact vector reading without stretching tiny source screenshots.
 const dialog=document.createElement('dialog');dialog.id='finish-figure-dialog';dialog.setAttribute('aria-label','放大图表阅读');dialog.innerHTML='<div class="finish-dialog-bar"><span data-finish-dialog-title>图表</span><button data-finish-close>关闭 ×</button></div><div class="finish-dialog-art"></div><p class="finish-dialog-note">放大保留当前选项、坐标、单位与来源。触摸或横向滚动查看完整图；按 Esc 关闭。</p>';document.body.append(dialog);
 $('[data-finish-close]',dialog).onclick=()=>dialog.close();let returnFocus=null;dialog.addEventListener('close',()=>returnFocus?.focus());
 const roots=['.rv-event-visual','.edit-model-plots','.rv-privacy-plot','.comp-tennis-pipeline','.comp-chain-graph','.comp-bronze-map','[data-environment-timeline]','.depth-system','.edit-loop-circuit','.garden-diagram','.finish-chart','.finish-concept-art','[data-baseball-system]','[data-contact-field]'];
 const wired=new WeakSet();
 const nativeCharts=root=>$$('svg',root).filter(chart=>!chart.closest('.finish-tools'));
 function addTools(){roots.forEach(selector=>$$(selector).forEach(root=>{
  if(wired.has(root)&&$('.finish-tools',root))return;
  const charts=nativeCharts(root);if(!charts.length)return;
  wired.add(root);const tools=document.createElement('div');tools.className='finish-tools';
  charts.forEach((chart,index)=>{
   const btn=document.createElement('button');btn.type='button';
   const name=$('title',chart)?.textContent||chart.getAttribute('aria-label')||`图表 ${index+1}`;
   btn.setAttribute('aria-label','放大：'+name);
   btn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5m6 0h5v5M4 15v5h5m6 0h5v-5" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>'+(charts.length===1?'放大读图':`放大图 ${index+1}`);
   tools.append(btn);
   btn.onclick=()=>{
    const current=nativeCharts(root)[index];if(!current)return;returnFocus=btn;
    const copy=current.cloneNode(true),originals=[current,...current.querySelectorAll('*')],copies=[copy,...copy.querySelectorAll('*')];
    originals.forEach((a,i)=>{const css=getComputedStyle(a);['fill','stroke','stroke-width','stroke-dasharray','opacity','font-family','font-size','font-weight','letter-spacing','text-anchor'].forEach(k=>copies[i].style.setProperty(k,css.getPropertyValue(k)));});
    copy.removeAttribute('style');const vb=current.viewBox.baseVal;
    copy.style.width=Math.max(740,Math.min(innerWidth-85,(innerHeight-210)*vb.width/vb.height))+'px';copy.style.marginInline='auto';
    $('.finish-dialog-art',dialog).replaceChildren(copy);
    $('[data-finish-dialog-title]',dialog).textContent=$('title',current)?.textContent||current.getAttribute('aria-label')||'图表阅读';
    const holder=root.closest('.rv-panel,.comp-panel,.edit-panel,.depth-panel,.component'),note=holder?$('.rv-source,.comp-source,.edit-source,.depth-note,.component-note',holder)?.textContent:'';
    $('.finish-dialog-note',dialog).textContent=(note||'放大保留当前图表的坐标、单位与选项。')+' 触摸或横向滚动查看完整图；按 Esc 关闭。';dialog.showModal();
   };
  });root.append(tools);
 }));}
 addTools();new MutationObserver(addTools).observe(document.querySelector('main'),{childList:true,subtree:true});
})();
