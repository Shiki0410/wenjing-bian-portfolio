/* Faithful source reader: never infer arrow direction from the label's wording. */
(() => {
 'use strict';
 if(document.body.dataset.project!=='growth-compass')return;
 const root=document.querySelector('#chapter-5 .depth-panel');
 if(!root||!root.querySelector('.depth-system'))return;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const maps=[{
  label:'课中 / 作业与支持',page:38,
  description:'保留学生、教师、Agent、案例、作业数据及行业资源的原始关系，往返路径不合并。',
  nodes:[
   ['学生',803,732,'学生与 Agent、学生与教师之间各有不同来向；建议进入作业，修改结果再回到支持过程。','学生与作业数据独立相连。每条箭头与旁边文字共同说明这段关系。'],
   ['朋辈导师 Agent',656,444,'原稿连接作业读取、作业反馈、案例与行业尺度。各条箭头保留自己的方向与文字。','“读取”是连线上的行为说明，不据此自行翻转原图的箭头。'],
   ['教师',803,512,'教师、Agent、案例与行业标准共同参与作业支持；学生基于教师建议继续迭代。','给出建议与学生带回修改是不同的关系，不能只保留教师指向学生的一条线。'],
   ['学院',803,236,'原图保留课程目标、设计技能树、平台支持，以及与企业校友的联系。','学院、教师和社会资源不合并成一个抽象“后台”。'],
   ['技术 / AI 预审模型',332,323,'AI 预审模型与 Agent 的联系为虚线；正反案例向模型提供直接数据。','实线、虚线按原图保留，不统一绘成同一种依赖箭头。'],
   ['企业 / 校友',1170,405,'原图把场地、资金、政策支持与行业经验的介入分别放在不同连线上。','企业校友与学院、行业标准之间的联系保留各自路径。'],
   ['正反案例',552,522,'案例与教师共同参与质量确定，同时连接 AI 预审模型和作业参考。','案例库不是只有一条指向学生的内容输出。'],
   ['设计方法论 / 行业标准',1029,539,'原稿同时连接企业校友、教师与 Agent，承担教学和作业判断的不同参考。','行业经验与课程对标依据的文字标注保留在主图上。'],
   ['作业数据',656,624,'作业数据是原稿中的独立节点，连接提交、读取和案例参考。','保留虚线箭头及邻近文字，不以一个“数据库”图标替代这些关系。']
  ]
 },{
  label:'课前 / 选课与课程资源',page:32,
  description:'恢复学院行政、教务、教师、学生会、网站和名企校友之间的完整资源交换，包括双向往返路径。',
  nodes:[
   ['学生',777,700,'学生与网站之间保留课程要点、使用与偏好数据、课程反馈等不同方向。','课程体验、工作坊与 mentorship 也保留各自来源。'],
   ['网站',533,493,'网站承接课程信息与学生反馈，还连接学院教务和学生会的开发维护。','学生与网站、网站与教务的往返路线分别呈现，不合并成一条单向箭头。'],
   ['教课老师',777,484,'原稿将课程意义、总体气质、工作坊和课程内容放在各自连接上。','与校友、学院行政和学生的往返关系按原图阅读。'],
   ['学院老师',777,330,'这是原图单列的角色，保留在学院内部轴上。','不擅自把它与“教课老师”合并。'],
   ['学院教务',778,217,'保留学生选课信息、学分认定、课程介绍与试听模块规划。','网站与教务之间的上行、下行路径含义不同。'],
   ['学院行政',778,127,'内容需求、系统功能需求、资金和人力资源分别标注。','与学生会、教课老师、名企校友的路径保持独立。'],
   ['学生会',427,390,'原稿保留开发维护、mentorship，以及与学院行政的双向交换。','资金、需求和人力资源的符号不压缩成一个“支持”标签。'],
   ['名企校友',1142,386,'行业标准、专业建议、企业资源和课程内容具有不同的方向与来源。','感谢资金、储备人才等关系也在完整原图中保留。']
  ]
 }];
 let mode=0,selected=-1,scale=1;
 root.classList.add('gr-source-system');
 root.innerHTML=`<header><div><span class="depth-code">SERVICE SYSTEM / 支持与反馈</span><h3>教学支持，不是单向交付。</h3></div><span>02</span></header>
 <div class="gr-system-toolbar"><div role="group" aria-label="切换原服务系统图">${maps.map((m,i)=>`<button type="button" data-gr-map="${i}" aria-pressed="${i===0}">${m.label}</button>`).join('')}</div><div role="group" aria-label="系统图阅读倍率"><button type="button" data-gr-scale="1" aria-pressed="true">总览</button><button type="button" data-gr-scale="1.5" aria-pressed="false">150%</button><button type="button" data-gr-scale="2" aria-pressed="false">200%</button></div></div>
 <div class="gr-arrow-key" aria-label="箭头阅读说明"><span><svg viewBox="0 0 62 24" aria-hidden="true"><path d="M3 12H54M46 5L54 12 46 19"/></svg>单向：按箭头与原文阅读</span><span><svg viewBox="0 0 62 24" aria-hidden="true"><path d="M5 6Q31 -1 55 6M48 1L55 6 48 11M55 18Q31 25 5 18M12 13L5 18 12 23"/></svg>往返：两个方向分别保留</span><span><svg viewBox="0 0 62 24" aria-hidden="true"><path d="M3 12H54" stroke-dasharray="4 3"/><path d="M46 5L54 12 46 19"/></svg>虚线：原稿中的间接关系</span></div>
 <p class="gr-system-description"></p><div class="depth-network-index gr-node-index" role="group" aria-label="定位原图角色"></div>
 <div class="gr-original-scroll" tabindex="0" aria-label="原系统图；放大后可横向滚动"><div class="gr-original-canvas"></div></div>
 <div class="gr-reader-detail" aria-live="polite"></div><div class="gr-source-actions"><button type="button" data-gr-reset>清除角色定位</button><button type="button" data-gr-open>放大完整原页 ↗</button><a data-gr-file target="_blank" rel="noopener">打开 4000px 原页 ↗</a></div>
 <p class="depth-source">源于《最终汇报》课前系统图（第32页）与课中系统图（第38页）。主图为完整原页：不裁掉图例，不重写箭头，不合并往返路线。蓝色定位圈与下方文字是新增导读，不属于原图；原图配色仅作为来源保留，不改变项目主题。</p>`;
 const $=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)];
 function buttons(attr,fn){const bs=$$(`[${attr}]`);bs.forEach((b,i)=>{b.addEventListener('click',()=>fn(b));b.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();e.stopPropagation();const next=e.key==='Home'?0:e.key==='End'?bs.length-1:(i+(e.key==='ArrowRight'?1:-1)+bs.length)%bs.length;bs[next].focus();bs[next].click();});});}
 function detail(){const m=maps[mode],n=m.nodes[selected];$('.gr-reader-detail').innerHTML=n?`<strong>${String(selected+1).padStart(2,'0')}</strong><div><span>角色导读 / 非重新编码</span><h4>${esc(n[0])}</h4><p>${esc(n[3])}</p><p>${esc(n[4])}</p></div>`:`<strong>↔</strong><div><span>原图导读</span><h4>先看结构，再读每条关系。</h4><p>选择角色定位原图；用 150% 或 200% 阅读箭头与文字。关系方向、实线和虚线始终来自原页。</p><p>课前图例区分信息、资金与资源；字母、图形符号均保留原稿，不自行扩写其定义。</p></div>`;$$('[data-sys-node]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===selected)));$$('[data-gr-mark]').forEach((g,i)=>{g.classList.toggle('active',i===selected);g.setAttribute('aria-pressed',String(i===selected));});}
 function applyScale(){ $('.gr-original-canvas').style.width=Math.max($('.gr-original-scroll').clientWidth,1000)*scale+'px'; }
 function choose(i){selected=i;detail();const n=maps[mode].nodes[i],viewport=$('.gr-original-scroll'),canvas=$('.gr-original-canvas'),ratio=canvas.getBoundingClientRect().width/1600;viewport.scrollLeft=Math.max(0,n[1]*ratio-viewport.clientWidth/2);viewport.scrollTop=Math.max(0,n[2]*ratio-viewport.clientHeight/2);const visibleY=viewport.getBoundingClientRect().top+n[2]*ratio-viewport.scrollTop;if(visibleY>innerHeight-90||visibleY<90)viewport.scrollIntoView({block:'center',behavior:'auto'});}
 function render(){const m=maps[mode],src=`assets/folio-repair/growth-system-page${m.page}.webp`;$('.gr-system-description').textContent=m.description;$('.gr-node-index').innerHTML=m.nodes.map((n,i)=>`<button type="button" data-sys-node="${i}" aria-pressed="false">${esc(n[0])}</button>`).join('');$('.gr-original-canvas').innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="group" aria-labelledby="gr-system-title gr-system-desc"><title id="gr-system-title">${esc(m.label)}完整原系统图</title><desc id="gr-system-desc">${esc(m.description)}源页${m.page}；原页像素作为证据层。蓝色圆环为角色定位，不编码关系强弱。</desc><g data-layer="original-source"><image href="${src}" width="1600" height="900"/></g><g data-layer="reader-annotations">${m.nodes.map((n,i)=>`<g data-gr-mark="${i}" tabindex="0" role="button" aria-label="定位：${esc(n[0])}" aria-pressed="false"><circle class="gr-hit" cx="${n[1]}" cy="${n[2]}" r="24"/><circle class="gr-focus-ring" cx="${n[1]}" cy="${n[2]}" r="26"/></g>`).join('')}</g></svg>`;$('.gr-original-canvas').style.width=(scale*100)+'%';$('.gr-original-scroll').scrollLeft=0;$('.gr-original-scroll').scrollTop=0;$('[data-gr-file]').href=src;buttons('data-sys-node',b=>choose(+b.dataset.sysNode));$$('[data-gr-mark]').forEach(g=>{g.addEventListener('click',()=>choose(+g.dataset.grMark));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(+g.dataset.grMark);}});});detail();}
 buttons('data-gr-map',b=>{mode=+b.dataset.grMap;selected=-1;$$('[data-gr-map]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();applyScale();});
 buttons('data-gr-scale',b=>{scale=+b.dataset.grScale;$$('[data-gr-scale]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));applyScale();if(selected>=0)choose(selected);});
 $('[data-gr-reset]').addEventListener('click',()=>{selected=-1;detail();});
 $('[data-gr-open]').addEventListener('click',()=>{const d=document.querySelector('#lightbox'),i=d.querySelector('img');i.src=`assets/folio-repair/growth-system-page${maps[mode].page}.webp`;i.alt=maps[mode].label+' / 完整原页';d.querySelector('p').textContent=i.alt;d.showModal();});
 render();applyScale();window.addEventListener('resize',applyScale);root.dataset.sourcePrecision='full-original-pages-32-38';
})();
