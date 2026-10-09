/* Flat book compositions. Project interactions keep their original event owners. */
(() => {
 'use strict';
 const P=window.PORTFOLIO,$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const el=(tag,cls,html='')=>{const e=document.createElement(tag);e.className=cls;e.innerHTML=html;return e;};
 const art=(src,caption,cls='')=>`<figure class="book-art ${cls}"><button data-book-art="${src}" data-caption="${esc(caption)}" aria-label="放大：${esc(caption)}"><img src="assets/${src}.webp" alt="${esc(caption)}" loading="lazy" decoding="async"></button><figcaption>${esc(caption)}</figcaption></figure>`;
 const plates={
  rallylens:{layout:'one',title:'Rally<br>Lens.',images:[['rally-ui','回放、目标与事件 / 研究原型'],['rally-court','双人练习现场'],['rally-accounts','双方解释，保留各自来源']],note:'8 对搭档，14 次训练记录。7 位专业教练评估与 6 名球员回访分别开展，支持方向分轨、并列陈述和区间定位的设计。'},
  'privacy-city':{layout:'two',title:'Privacy<br>City.',images:[['privacy-scene1','隐私请求 / 模拟授权情境'],['privacy-compare','五种模型 / 同一划分的离线比较'],['privacy-start','游戏入口']],note:'五类授权情境连接行为记录与模型实验。48 维特征、5,249 参数的 NumPy MLP，与四种基线共同检查排序、分类与概率质量。'},
  tennisatom:{layout:'three',title:'The body<br>as portrait.',images:[['tennis-real-5','为真实球员制作的个人视频'],['tennis-poster','身体的肖像 / 项目主视觉'],['tennis-impact','动作冲击视觉']],note:'同一份运动素材可以成为私人的成长记录，也可以走向社交媒体。原型把上传、分析、风格选择、精修与观看接成一条制作流程。'},
  baseball:{layout:'four',title:'Pitch /<br>Impact.',images:[['baseball-web-hero','山本由伸 / 人物叙事入口'],['baseball-web-macro','投打分析 / 原网站截图'],['baseball-web-detail','球种、空间与精确指标']],note:'以 Statcast 数据组织山本由伸与大谷翔平的投打叙事。年份、球员和图层切换，让滚动阅读与图表探索相互接续。'},
  artemis:{layout:'one',title:'Artemis.',images:[['artemis-boss','Boss 战 / 原游戏实机'],['artemis-world','重返星海 / 世界观视觉'],['artemis-build','零件构筑 / 原游戏界面']],note:'探索、资源、构筑与战斗形成玩法循环。个人工作集中于角色状态、两类敌人与两场 Boss 战；实现说明来自实际工程脚本。'},
  bronze:{layout:'two',title:'天命：<br>祀与戎',images:[['bronze-ep06-4','第六集《鸮陨》 / 00:50.75 · 原成片截图'],['bronze-ep07-4','第七集《向北》 / 02:17.22 · 原成片截图'],['bronze-ep10-5','第十集《拓归》 / 03:04.81 · 原成片截图']],note:'明线追寻父母，暗线恢复记忆。第六集的陨落与第九集的融合，让器物、角色和身份走到同一处；十集成片、人设与分镜共同呈现制作过程。'},
  afterglow:{layout:'three',title:'Afterglow.',images:[['afterglow-glyph','余晖环 / 最终径向视觉'],['afterglow-source-poster','原项目 A3 视觉输出'],['afterglow-dome','上海南站 / 空间提案']],note:'四种环境信号进入同一个径向骨架。V3、V4 原型连接 CSV、插值、视觉映射与时间切换，空间效果图继续检查观看尺度。'},
  'growth-compass':{layout:'four',title:'Growth<br>Compass.',images:[['growth-tasting-original','模块化试听 / 原项目故事板'],['growth-course-journey','课外服务 / 原用户旅程'],['growth-canvas-original','作业逻辑画布 / 服务概念']],note:'29 份问卷与 4 份访谈材料帮助团队识别期待错位、课程导航模糊和作业支架缺失。课程试听、逻辑画布与朋辈支持回应这些机会。'},
  looplab:{layout:'one',title:'Loop<br>Lab.',images:[['loop-materials','材料流转 / 服务概念视觉'],['loop-demo-poster','校园取件 / 概念视频']],note:'交换、团购、制作预约、材料档案和线下取件，共同组织学生的一次材料需求。竞品研究和履约流程界定 MVP 的范围。'},
  garden:{layout:'two',title:'游园<br>画境',images:[['garden-autumn-overview','网师园 / 团队游戏实机'],['garden-fan','绘梦奇扇 / 改字解谜'],['garden-summer','四季游园 / 夏季']],note:'从夜读入梦，穿过网师园的四季与历史。奇扇改字让诗意进入可操作的园景；个人参与 NPC、摄像机模块和小程序适配。'}
 };
 function home(){
  document.body.classList.add('coral-book');
  $('#project-grid').innerHTML=P.projects.map((p,i)=>{const c=plates[p.id],start=4+i*2;return `<article class="book-spread project-plate plate-${c.layout}" id="folio-${p.id}" data-project="${p.id}"><div class="plate-colour" aria-hidden="true"></div><p class="book-running">${p.number} / ${esc(p.label)} <span>${esc(p.year)}</span></p><h3 class="plate-title"><a href="case.html?project=${p.id}" aria-label="查看 ${esc(p.name)} 案例">${c.title}</a></h3><div class="plate-copy"><h4>${esc(p.cn)}</h4><p>${esc(p.summary)}</p><p>${esc(c.note)}</p><p class="plate-role">${esc(p.role)}<br>${esc(p.status)}</p><a class="plate-link" href="case.html?project=${p.id}">查看项目 / ${p.number} <span>↗</span></a></div>${c.images.map((a,j)=>art(...a,`plate-image image-${j+1}`)).join('')}<div class="spread-footer"><span>${esc(p.name.toUpperCase())} / ${esc(p.tools.slice(0,2).join(' · '))}</span><span>${String(start).padStart(2,'0')}—${String(start+1).padStart(2,'0')}</span></div></article>`;}).join('');
  $('#research-list').innerHTML=P.research.map((r,i)=>`<article><span>0${i+1}</span><div><h3>${esc(r.title)}</h3><p class="research-label">${esc(r.label)}</p><p>${esc(r.text)}</p></div></article>`).join('');
  const index=el('nav','book-project-index');index.setAttribute('aria-label','项目索引');index.innerHTML=P.projects.map(p=>`<a href="#folio-${p.id}" data-index-project="${p.id}"><span>${p.number}</span>${esc(p.name)}</a>`).join('');$('.book-index').append(index);
  const groups={product:['rallylens','privacy-city','tennisatom','growth-compass','looplab'],game:['artemis','garden'],ai:['privacy-city','bronze','tennisatom','growth-compass'],data:['baseball','afterglow','rallylens']};let route='all';
  const filter=()=>{const q=$('#work-query').value.trim().toLowerCase();let n=0;$$('[data-project]').forEach(e=>{const p=P.projects.find(p=>p.id===e.dataset.project);e.hidden=(route!=='all'&&!groups[route].includes(p.id))||!`${p.name}${p.cn}${p.summary}${p.tools.join(' ')}${p.label}${plates[p.id].note}`.toLowerCase().includes(q);const indexLink=$(`[data-index-project="${p.id}"]`);if(indexLink)indexLink.hidden=e.hidden;if(!e.hidden)n++;});$('#filter-status').textContent=`显示 ${n} 个项目`;$('#work-empty').hidden=n>0;$$('[data-route]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.route===route)));};
  $$('[data-route]').forEach(b=>b.addEventListener('click',()=>{route=b.dataset.route;filter();}));$('#work-query').addEventListener('input',filter);$('#work-clear').addEventListener('click',()=>{$('#work-query').value='';filter();$('#work-query').focus();});
 }
 function caseBook(){
  const p=P.projects.find(p=>p.id===document.body.dataset.project);if(!p)return;const c=plates[p.id];document.body.classList.remove('studio-case');document.body.classList.add('coral-book','coral-case');
  const hero=$('.case-hero');hero.className='case-hero book-spread case-opening';
  const breadcrumb=$('.case-breadcrumb'),title=$('.case-title-grid'),meta=$('.case-meta'),cover=$('.case-cover'),caption=$('.case-cover-caption');
  hero.replaceChildren(breadcrumb,el('div','opening-colour'),title,cover,meta);$('.experience-jump')?.remove();$('h1',title).innerHTML=c.title;$('h1',title).className='';cover.innerHTML=art(...c.images[0],'opening-art');caption.remove();
  hero.append(el('div','spread-footer',`<span>${esc(p.name.toUpperCase())} / ${esc(p.year)}</span><a href="#experience">查看与操作 ↓</a>`));
  const experience=$('#experience'),overview=$('.case-overview');overview.classList.add('book-spread','case-context');$('h2',overview).textContent='项目背景';experience.before(overview);
  $('.experience-heading h2').textContent=({rallylens:'回放与解释','privacy-city':'模型比较',tennisatom:'观看与制作',artemis:'移动规则',bronze:'镜头与角色',afterglow:'图形编码','growth-compass':'服务触点',looplab:'材料交接',garden:'四季与奇扇',baseball:'界面与数据'})[p.id];experience.classList.add('book-spread');
  const decisions=$('#design-decisions');decisions.classList.add('book-spread');$('.decision-header h2').textContent='设计的依据';$('.decision-header').append(el('div','decision-source',art(...c.images[Math.min(1,c.images.length-1)])));
  $$('.case-chapter').forEach((section,i)=>{section.classList.add('book-spread','chapter-plate','chapter-layout-'+(i%3));$('.chapter-heading',section).classList.add('chapter-caption');const visuals=$$('.case-figure,.figure-gallery,.component',section).filter(e=>e.parentElement===section),area=el('div','chapter-visuals');visuals.forEach(e=>area.append(e));section.append(area);});
  const toc=$('.case-toc');toc.className='case-toc book-contents';toc.prepend(el('span','contents-title','本案目录 /'));$('.case-body').before(toc);
  const library=$('#design-assets');library?.classList.add('book-spread');if(library){$('.asset-library-heading h2').textContent='视觉与过程物料';$('.asset-library-heading>div:last-child').remove();$('.asset-strip').className='asset-strip book-asset-mosaic';}
  const videos=$('.case-videos');if(videos){videos.classList.add('book-spread');$('h2',videos).textContent='项目影片';}
  const result=$('.case-result');result.classList.add('book-spread');$('h2',result).textContent='项目交付';$('.case-reflection h3').textContent='继续迭代';$('.case-next').classList.add('book-spread');$('.case-section-dock')?.remove();
  const nav=el('nav','book-case-nav');nav.setAttribute('aria-label','案例快速导航');nav.innerHTML=`<a href="index.html#folio-${p.id}">← 目录</a><a href="#main">封面</a><a href="#experience">操作</a><a href="#chapter-1">过程</a><a href="#project-results">交付</a>`;document.body.append(nav);
 }
 function bindImages(){
  const d=$('#lightbox');if(!d)return;document.addEventListener('click',e=>{const b=e.target.closest('[data-book-art]');if(!b)return;$('img',d).src='assets/'+b.dataset.bookArt+'.webp';$('img',d).alt=b.dataset.caption;$('p',d).textContent=b.dataset.caption;d.showModal();});
  if($('.book-home'))$('.lightbox-close',d).addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d)d.close();});
  const arrows=el('div','lightbox-navigation','<button data-art-step="-1" aria-label="上一张图片">←</button><button data-art-step="1" aria-label="下一张图片">→</button>');d.append(arrows);
  const list=()=>$$('[data-book-art],[data-art],[data-full-image]').filter(b=>!b.closest('[hidden]')).map(b=>({src:b.dataset.bookArt?'assets/'+b.dataset.bookArt+'.webp':b.dataset.art?'assets/'+b.dataset.art+'.webp':b.dataset.fullImage,caption:b.dataset.caption||b.dataset.artCaption||''})).filter((v,i,a)=>a.findIndex(q=>q.src===v.src)===i);
   const move=direction=>{const a=list(),idx=a.findIndex(v=>$('img',d).getAttribute('src')===v.src);if(!a.length)return;const item=a[(Math.max(idx,0)+direction+a.length)%a.length];d.dispatchEvent(new Event('artchange'));$('img',d).src=item.src;$('img',d).alt=item.caption;$('p',d).textContent=item.caption;};$$('[data-art-step]',d).forEach(b=>b.addEventListener('click',()=>move(+b.dataset.artStep)));d.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1);}});
 }
 function bookMotion(){
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(!reduce && 'IntersectionObserver' in window){
   const entering=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-read');entering.unobserve(entry.target);}}),{threshold:.12});
   $$('.project-plate,.chapter-plate,.case-opening,.book-about,.design-decisions').forEach(e=>entering.observe(e));
  }
  const progress=el('div','book-reading-progress');progress.setAttribute('aria-hidden','true');document.body.append(progress);
  let pending=false;
  const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?Math.min(1,Math.max(0,scrollY/max)):0})`;pending=false;};
  addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update);}},{passive:true});addEventListener('resize',update);update();
  $$('[role="group"]').forEach(group=>group.addEventListener('keydown',e=>{
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)||e.target.tagName!=='BUTTON')return;
   const choices=$$('button',group).filter(b=>!b.disabled&&b.getClientRects().length);const idx=choices.indexOf(e.target);if(idx<0)return;
   e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?choices.length-1:(idx+(e.key==='ArrowRight'?1:-1)+choices.length)%choices.length;choices[next].focus();choices[next].click();
  }));
 }
 function productPaths(){
  const flow=$('.tennis-workflow');if(!flow)return;
  const paths={quick:[['选择风格','从已有视觉方向中选择成片的语气。'],['生成候选','整理高光片段、动态文字与特效节奏。'],['审看成片','检查个人表达，再保存或分享。']],custom:[['设定表达','给出关键词、色彩、风格与节奏选择。'],['分步精修','调整片段、画面和文字，保留人工判断。'],['审看成片','核对动作与表达，确认最终输出。']]};
  const update=key=>{$$('[data-film-path]',flow).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filmPath===key)));$('[data-workflow-path]',flow).innerHTML=paths[key].map((item,i)=>`<div><span>0${i+1}</span><h4>${item[0]}</h4><p>${item[1]}</p></div>`).join('');};
  $$('[data-film-path]',flow).forEach(b=>b.addEventListener('click',()=>update(b.dataset.filmPath)));update('quick');
 }
 function artDirection(){
  $$('.project-plate').forEach(e=>{const p=P.projects.find(p=>p.id===e.dataset.project);const n=el('span','plate-folio',p.number);n.setAttribute('aria-hidden','true');e.append(n);});
  const cover=$('.book-cover');if(cover){const spine=el('span','cover-spine','DESIGN / WENJING BIAN');spine.setAttribute('aria-hidden','true');cover.append(spine);}
  const d=$('#lightbox');if(!d)return;
  const zoom=el('button','lightbox-zoom','放大细节 ＋');zoom.setAttribute('aria-pressed','false');d.append(zoom);
  const reset=()=>{d.classList.remove('detail-zoom');zoom.setAttribute('aria-pressed','false');zoom.textContent='放大细节 ＋';};
  zoom.addEventListener('click',()=>{const on=!d.classList.contains('detail-zoom');d.classList.toggle('detail-zoom',on);zoom.setAttribute('aria-pressed',String(on));zoom.textContent=on?'适合窗口 －':'放大细节 ＋';});
   d.addEventListener('close',reset);d.addEventListener('artchange',reset);
 }
  function benchDesign(){
   const bench=$('.project-workbench');if(!bench)return;
   $$('.studio-tabs',bench).forEach(group=>$$('button',group).forEach((button,i)=>{
    const number=el('span','control-index',String(i+1).padStart(2,'0'));
    number.setAttribute('aria-hidden','true');button.prepend(number);
   }));
   const bar=$('.workbench-bar',bench);if(bar){
    const mark=el('span','workbench-registration','＋');mark.setAttribute('aria-hidden','true');bar.prepend(mark);
   }
   const transaction=$('.handoff-steps',bench);if(transaction){
    $$('[data-loop-step]',transaction).forEach((step,i)=>{const index=el('b','step-index',String(i+1).padStart(2,'0'));index.setAttribute('aria-hidden','true');step.prepend(index);});
   }
   if(!matchMedia('(prefers-reduced-motion:reduce)').matches){
    const feedback=new MutationObserver(records=>{
     const targets=new Set(records.map(record=>record.target.nodeType===3?record.target.parentElement:record.target));
     targets.forEach(target=>{const output=target.closest('output,[data-hex-result],[data-material-result]');if(output&&bench.contains(output)){output.classList.remove('feedback-changed');requestAnimationFrame(()=>output.classList.add('feedback-changed'));}});
    });
    $$('output,[data-hex-result],[data-material-result]',bench).forEach(output=>{feedback.observe(output,{subtree:true,childList:true,characterData:true});output.addEventListener('animationend',()=>output.classList.remove('feedback-changed'));});
   }
  }
  if($('.book-home'))home();else caseBook();bindImages();productPaths();artDirection();benchDesign();bookMotion();
 document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const target=document.getElementById(a.getAttribute('href').slice(1));if(!target)return;e.preventDefault();history.replaceState(null,'',a.getAttribute('href'));target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});});
 if(location.hash)requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({behavior:'instant'}));
})();
