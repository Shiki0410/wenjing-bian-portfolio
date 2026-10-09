/* Nine source-led editorial cases. RallyLens remains untouched. */
(() => {
 'use strict';
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const id=document.body.dataset.project,p=window.FOLIO_REPAIR?.[id];if(!p)return;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const br=s=>esc(s).replace(/\n/g,'<br>');
 const color=getComputedStyle(document.body).getPropertyValue('--accent').trim()||'#2354d8';
 const ink='#111719',paper='#f5f6f2';
 document.body.classList.add('folio-repaired');document.body.style.setProperty('--fr-accent',color);
 const rgb=(color.match(/[a-f\d]{2}/gi)||['23','54','d8']).map(v=>parseInt(v,16)),luminance=rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((v,x,i)=>v+x*[.2126,.7152,.0722][i],0);
 document.body.style.setProperty('--fr-accent-ink',luminance>.18?(id==='afterglow'?'#6c5900':'#b53c00'):color);
 document.body.style.setProperty('--fr-on-accent',luminance>.18?ink:paper);
 const section=(cls,html)=>{const n=document.createElement('section');n.className=cls;n.innerHTML=html;return n;};
 const icon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19L19 5M5 5H19V19" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>';
 const image=(src,label,cls='')=>`<figure class="fr-image ${cls}"><button type="button" data-fr-zoom="${esc(src)}" aria-label="放大：${esc(label)}"><img src="${esc(src)}" alt="${esc(label)}" loading="lazy"><span class="fr-zoom">原图 ↗</span></button><figcaption>${esc(label)}</figcaption></figure>`;
 function zoom(root){$$('[data-fr-zoom]',root).forEach(b=>b.addEventListener('click',()=>{const d=$('#lightbox'),i=$('img',d);i.src=b.dataset.frZoom;i.alt=$('img',b)?.alt||p.title;$('p',d).textContent=i.alt;d.showModal();}));}
 function tabs(root,key,fn){const bs=$$(`[${key}]`,root),set=i=>{bs.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));fn(i);};bs.forEach((b,i)=>{b.addEventListener('click',()=>set(i));b.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();e.stopPropagation();const j=e.key==='Home'?0:e.key==='End'?bs.length-1:(i+(e.key==='ArrowRight'?1:-1)+bs.length)%bs.length;bs[j].focus();set(j);});});set(0);}
 // Keep the original art-directed cover and its theme. Refine, do not replace it.
 const hero=$('.case-hero');hero?.classList.add('fr-fused-cover');
 if(hero?.classList.contains('reference-cover')){
  // The original colour-block/grid cover remains. Only its image field becomes a designed composition.
  const cover=$('.case-cover',hero);
  if(p.art&&cover&&id!=='growth-compass'){
   cover.classList.add('fr-fused-art');cover.innerHTML=`<div class="fr-cover-art-field">${image(p.art,p.artNote)}</div><div class="fr-cover-art-key"><span>${esc(p.strap)}</span><b>${id==='privacy-city'?'情境 / 阅读 / 选择':'材料 / 制作 / 交接'}</b></div>`;zoom(cover);
  }
 }
 $$('.reference-chapter-graphic,.reference-chapter-stamp').forEach(n=>n.remove());
 const overview=$('.case-overview');
 if(overview){overview.classList.add('fr-overview');const question=section('fr-question',`<span class="fr-kicker">THE QUESTION / 核心问题</span><h2>${esc(p.question)}</h2><p><b>证据边界</b> ${esc(p.boundary)}</p>`);overview.prepend(question);}
 const plate=section('fr-research-plate',`<header class="fr-plate-header"><span class="fr-kicker">RESEARCH & DESIGN / 从依据到设计</span><h2>${esc(p.mapTitle)}</h2><p>${esc(p.mapDesc)}</p></header><div class="fr-method-layout"><div class="fr-method-main"><div class="fr-method-scroll" tabindex="0" aria-label="项目关系图，可横向滚动"><div class="fr-method-graphic"></div></div><p class="fr-diagram-note">结构图解 / 顺序与关系，不编码未提供的时长、成效或数量</p><div class="fr-inspection" role="group" aria-label="选择设计检查点">${p.details.map((d,i)=>`<button type="button" data-fr-inspect="${i}" aria-pressed="${i===0}"><b>0${i+1}</b>${esc(d[0])}</button>`).join('')}</div><div class="fr-inspection-note" aria-live="polite"></div></div><aside class="fr-method-asset">${image(p.art||p.secondary||p.hero,p.artNote||p.secondaryNote||p.heroNote)}<div><span class="fr-kicker">READ THE RELATION / 读图</span><p>${esc(p.boundary)}</p></div></aside></div><div class="fr-source-gallery"><div class="fr-source-index"><span class="fr-kicker">SOURCE PLATES / 原素材导读</span><h3>看原图，<br>也看设计判断。</h3><div role="group" aria-label="选择原素材">${p.sources.map((s,i)=>`<button type="button" data-fr-source="${i}" aria-pressed="${i===0}"><b>0${i+1}</b><span>${esc(s[1])}</span>${icon}</button>`).join('')}</div></div><div class="fr-source-stage" aria-live="polite"></div></div><footer class="fr-plate-footer"><span>来源：本页原项目材料 / 编辑层与证据层分开</span><a href="assets/folio-repair/svg/${id}.svg" target="_blank" rel="noopener">独立 SVG 图解 ↗</a></footer>`);
 plate.id='source-reading';const decisions=$('#design-decisions');if(decisions)decisions.before(plate);else $('.case-overview').after(plate);
 if(id==='growth-compass')$('.fr-method-asset .fr-image',plate).outerHTML=image(p.secondary,p.secondaryNote);
 $('.fr-method-graphic',plate).innerHTML=diagram(p);
 tabs(plate,'data-fr-inspect',i=>{$('.fr-inspection-note',plate).innerHTML=`<b>0${i+1} / ${esc(p.details[i][0])}</b><p>${esc(p.details[i][1])}</p>`;$$('[data-fr-focus]',plate).forEach(g=>{const active=g.getAttribute('data-fr-focus')===String(i),r=$('rect',g);if(r){r.setAttribute('stroke',active?color:ink);r.setAttribute('stroke-width',active?'3':'1.5');r.setAttribute('fill',active?'#e4e8e0':paper);}});});
 tabs(plate,'data-fr-source',i=>{const s=p.sources[i];$('.fr-source-stage',plate).innerHTML=`${image(s[0],s[1])}<div class="fr-source-reading"><span>0${i+1} / SOURCE → DECISION</span><h4>${esc(s[2])}</h4><p>${esc(s[3])}</p><a href="${esc(s[0])}" target="_blank" rel="noopener">打开完整原素材 ${icon}</a></div>`;zoom($('.fr-source-stage',plate));});zoom($('.fr-method-asset',plate));
 $$('[data-fr-source]',plate).forEach((b,i)=>{b.insertAdjacentHTML('beforeend',`<img src="${esc(p.sources[i][0])}" alt="${esc(p.sources[i][1])}缩略预览" loading="lazy">`);});
 if(decisions){const fold=document.createElement('details');fold.className='fr-decision-fold';fold.innerHTML='<summary><span>DESIGN DECISIONS / 设计判断</span><b>展开原有设计依据</b><span>＋</span></summary>';decisions.before(fold);fold.append(decisions);}
 const guide=$('.rv-case-guide');if(guide){guide.innerHTML=[['01','问题与我的工作',overview?.id||'case-guide-01'],['02','观看与操作','experience'],['03','依据、图解与原素材','source-reading'],['04','项目交付','project-results']].map(([num,label,target])=>`<a href="#${target}"><b>${num}</b><span>${label}</span></a>`).join('');}
 $$('.case-chapter').forEach((chapter,i)=>{chapter.classList.add('fr-chapter');const desc=p.chapters[i];if(!desc)return;const caption=$('.chapter-caption',chapter),tag=$('.chapter-topline',chapter);if(tag)tag.remove();const header=section('fr-chapter-intro',`<span class="fr-chapter-number">${String(i+1).padStart(2,'0')}</span><div><span class="fr-kicker">${esc(desc[0])} / ${esc(p.strap.split(' / ')[0])}</span><h2>${esc(desc[1])}</h2></div><p>${esc(desc[2])}</p>`);if(caption){const original=$('p:last-child',caption);if(original&&!original.classList.contains('eyebrow'))header.insertAdjacentHTML('beforeend',`<details class="fr-chapter-context"><summary>这一步的项目背景</summary><p>${esc(original.textContent)}</p></details>`);caption.replaceWith(header);}else chapter.prepend(header);});
 // Move original supporting material into disclosures only when it duplicates a visible source.
 if(id==='privacy-city')$$('.case-figure img[src="assets/privacy-scene1.webp"]').forEach(i=>{const f=i.closest('figure');if(f){const d=document.createElement('details');d.className='fr-original-fold';d.innerHTML='<summary>核对原网页完整界面</summary>';f.before(d);d.append(f);}});
 if(id==='afterglow'){$$('.folio-montage').forEach(g=>{if(!g.closest('.case-chapter'))return;const d=document.createElement('details');d.className='fr-original-fold';d.innerHTML='<summary>展开原汇报与补充场景资料</summary>';g.before(d);d.append(g);});}
 // Fix inherited blue/green art fields in TennisAtom; the original orange identity stays intact.
 if(id==='tennisatom'){
  const field=$('.rv-art-crop')?.parentElement;if(field){const paint=()=>{const s=$('svg',field);if(!s)return;const base=$('rect',s);if(base)base.setAttribute('fill','#fff0e8');$$('text',s).forEach(t=>t.style.fill=ink);};paint();new MutationObserver(paint).observe(field,{childList:true});}
 }
 const current=$('.book-case-nav');if(current)current.setAttribute('aria-label','页面快捷导航');
 // Restyle only the reconstructed vector layer, never pixels in original research/art plates.
 if(id==='artemis')enemyRecords();
 const io=new IntersectionObserver(entries=>{for(const e of entries){if(!e.isIntersecting)continue;$$('.rv-case-guide a').forEach(a=>a.setAttribute('aria-current',String(a.hash==='#'+e.target.id)));}},{rootMargin:'-10% 0px -70% 0px'});['case-guide-01','experience','source-reading','project-results'].forEach(k=>{const n=$('#'+k);if(n)io.observe(n);});
 document.body.dataset.folioRepair='20261009-r2';

 function enemyRecords(){
  const root=$('.artemis-enemies');if(!root)return;root.classList.add('fr-enemy-codex');
  const records=$$('.enemy-mechanism',root);
  const assets='assets/folio-repair/';
  records.forEach((article,i)=>{
   article.classList.add('fr-enemy-record');
   const copy=document.createElement('div');copy.className='fr-enemy-copy';while(article.firstChild)copy.append(article.firstChild);
   const design=section('fr-enemy-design',image('assets/composition/artemis-character-'+(i?'heavy':'machine')+'.webp',i?'精英 01 / 重甲守卫原设定':'精英 02 / 机器人原设定'));
   design.insertAdjacentHTML('beforeend',`<div class="fr-enemy-traits"><span>${i?'厚重体块':'三角头部'}</span><span>${i?'背部管线':'外露关节'}</span><span>${i?'盾与短枪':'机械轮廓'}</span></div>`);
   article.append(design,copy);zoom(design);
   const field=section('fr-enemy-performance',`<div class="fr-enemy-view-heading"><span>${i?'ART / MOTION STUDIES':'RULE / TELEGRAPH STUDY'}</span><h4>${i?'盾牌、射击与状态变化。':'预警可看见，命中要再检查。'}</h4></div><div class="fr-enemy-controls" role="group" aria-label="${i?'查看原动作帧':'查看钩爪阶段'}">${(i?['持盾动作','射击动作','状态变化']:['01 / 前摇','02 / 命中检查','03 / 后摇']).map((label,j)=>`<button type="button" data-fr-enemy-step="${j}" aria-pressed="${j===0}">${label}</button>`).join('')}</div>${i?'':'<button class="fr-escape-toggle" type="button" aria-pressed="false">模拟玩家离开预警格</button>'}<div class="fr-enemy-stage"></div><p class="fr-enemy-state" aria-live="polite"></p>`);
   const before=i?$('.transform-sequence',copy):$('.enemy-phases',copy);before.before(field);
   let escaped=false,step=0;
   const draw=()=>{
    if(i){const [y,h]=[[270,280],[552,270],[825,307]][step];$('.fr-enemy-stage',field).innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 ${y} 1800 ${h}" role="img" aria-label="原精英怪动作帧：${['持盾动作','射击动作','状态变化'][step]}"><image href="${assets}artemis-elite1-motion-sheet.webp" width="1800" height="1132"/></svg>`;$('.fr-enemy-state',field).textContent=['原动作帧：抬盾与持盾姿态。下方规则说明变身完成后开启盾牌。','原动作帧：瞄准、发射与持枪动作。变身后仍按距离、弹药和冷却选择状态。','原动作帧：发光状态与受击／消失表现；与变身规则分别阅读。'][step];return;}
    const fill=['#ead39b','#c9503e','#b2c9b6'][step];
    const hex=(x,y)=>`${x-28},${y} ${x-14},${y-24} ${x+14},${y-24} ${x+28},${y} ${x+14},${y+24} ${x-14},${y+24}`;
    let marks='';for(let row=0;row<3;row++)for(let col=0;col<6;col++){const x=240+col*60+(row%2?30:0),y=70+row*52;marks+=`<polygon points="${hex(x,y)}" fill="${row===1?fill:'#eef0e7'}" stroke="#819084" stroke-width="1.5"/>`;}
    const px=460,py=escaped?55:122;
    $('.fr-enemy-stage',field).innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 250" role="img" aria-labelledby="hook-study-title"><title id="hook-study-title">钩爪规则示意：${['前摇预警','再次检查玩家位置','清理预警'][step]}</title><desc>依Elite2HookState重绘，不是实机截图。玩家离开预警格后不执行拉拽。</desc><rect width="660" height="250" fill="#f1f1e9"/>${marks}<image href="${assets}artemis-elite2-design.webp" x="14" y="8" width="175" height="205" preserveAspectRatio="xMidYMid meet"/><path d="M185 122H570" fill="none" stroke="${step===2?'#53775c':'#bd4739'}" stroke-width="3" stroke-dasharray="7 6"/><path d="M${px} ${py-15}l15 15-15 15-15-15Z" fill="#173e65" stroke="#fff" stroke-width="2"/><text x="${px}" y="${py-23}" text-anchor="middle" fill="#173e65" font-size="16">玩家</text><text x="22" y="232" font-size="16" fill="#294d3b">原机器人设定</text><text x="260" y="232" font-size="16" fill="#294d3b">${step===0?'显示射线格子':step===1?(escaped?'已离开 → 跳过拉拽':'仍在格内 → 执行拉拽'):'清除预警 → 回到追击'}</text></svg>`;
    $('.fr-enemy-state',field).textContent=['前摇：停住并面向目标，显示射线格子。',escaped?'命中检查：玩家已离开预警格，跳过拉拽。':'命中检查：重新检查位置，仅拉拽仍在格内的玩家。','后摇：切换颜色并清除预警；异常退出也执行清理。'][step];
   };
   tabs(field,'data-fr-enemy-step',j=>{step=j;draw();});
   const toggle=$('.fr-escape-toggle',field);if(toggle)toggle.onclick=()=>{escaped=!escaped;toggle.setAttribute('aria-pressed',String(escaped));toggle.textContent=escaped?'模拟玩家回到预警格':'模拟玩家离开预警格';draw();};
  });
  root.insertAdjacentHTML('beforeend',`<div class="fr-enemy-live"><header><span>IN GAME / 原战斗录屏</span><h3>预警落在场地上，反馈回到行动中。</h3><p>在完整场地中检查预警线、敌我位置和反馈。原片与规则图分别观看。</p></header><div class="fr-enemy-live-stills">${image(assets+'artemis-telegraph-field.webp','原战斗录屏 / 00:40 · 场地预警')}${image(assets+'artemis-telegraph-response.webp','原战斗录屏 / 00:56 · 战斗反馈')}</div><details><summary>观看这一段原实机 ↓</summary><video controls playsinline preload="none" poster="${assets}artemis-telegraph-field.webp" src="media/artemis-gameplay.mp4#t=40,64" aria-label="原实机战斗录屏40至64秒"></video></details></div><p class="fr-enemy-source-note">设定与动作帧来自原美术目录；规则以 Elite2HookState、Elite1TransformState 核对。设定、可操作规则示意与原实机分开标记。</p>`);zoom($('.fr-enemy-live',root));
 }

 function diagram(c){
  const accentInk=getComputedStyle(document.body).getPropertyValue('--fr-accent-ink').trim();
  const text=(x,y,t,size=21,fill=ink,anchor='start')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill===color?accentInk:fill}" text-anchor="${anchor}">${esc(t)}</text>`;
  const line=(path,dash=false,stroke=ink)=>`<path d="${path}" fill="none" stroke="${stroke}" stroke-width="2" ${dash?'stroke-dasharray="7 7"':''}/>`;
  const box=(x,y,w,h,label,n,focus=0)=>`<g data-fr-focus="${focus}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${paper}" stroke="${ink}" stroke-width="1.5"/>${text(x+15,y+29,n,17,color)}${text(x+15,y+65,label,22)}</g>`;
  const picture=(src,x,y,w,h)=>`<image href="${src}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;
  let b='',h=420;
  if(c.map==='dual'){
   c.lanes.forEach((l,j)=>{const y=45+j*180;b+=text(25,y+30,l[0],20);l.slice(1).forEach((t,i)=>{b+=box(260+i*230,y,205,95,t,String(i+1).padStart(2,'0'),i);if(i<2)b+=line(`M${465+i*230} ${y+47}h25`);});});b+=line('M360 140V195H820V225',true,color)+text(430,185,'仅参考设计 / 非在线推理',19,color);b+=text(25,396,'网页反馈 ≠ 模型概率 / 来源与验证路径分别保留',20);
  }else if(c.map==='bundle'){
   c.lanes[0].slice(1).forEach((t,i)=>{b+=box(25,35+i*115,235,90,t,'SOURCE 0'+(i+1),i)+line(`M260 ${80+i*115}H315V195H385`);});
   b+=picture('assets/composition/tennis-skeleton.webp',360,22,280,275)+`<rect x="365" y="300" width="280" height="75" fill="${color}"/>`+text(505,347,'MatchBundle',27,'#111719','middle');
   c.lanes[1].slice(1).forEach((t,i)=>{b+=line(`M640 195H695V${80+i*115}H735`)+box(735,35+i*115,235,90,t,'OUTPUT 0'+(i+1),i);});b+=text(500,404,'共享时间索引 / 原骨骼透卡，不作为测量样本',19,ink,'middle');
  }else if(c.map==='scales'){
   b+=text(30,33,'四份 CSV / 单位分别保留',22);c.lanes[0].slice(1).forEach((t,i)=>b+=box(30,60+i*100,240,80,t,'SOURCE / '+(i+1),i));
   ['宏观 / 认识对象','实验室 / 比较分布','细节 / 检查位置'].forEach((t,i)=>{b+=`<rect x="${330+i*30}" y="${45+i*85}" width="${620-i*60}" height="${315-i*90}" fill="${paper}" stroke="${color}" stroke-width="2" data-fr-focus="${i}"/>`+text(350+i*30,80+i*85,t,24);});b+=line('M270 190H330')+text(30,392,'逐球 / 击球 / 球队汇总 ≠ 同一个分母',20)+text(520,392,'图形位置与数值相邻',20);
  }else if(c.map==='state'){
   b+=text(30,35,'MOVEMENT / 非测量时间轴',20);c.lanes[0].slice(1).forEach((t,i)=>{b+=box(30+i*238,60,210,95,t,'STATE 0'+(i+1),Math.min(i,2));if(i<3)b+=line(`M${240+i*238} 107h28`);});b+=line('M850 155V185H135V155',true)+text(420,211,'完成条件与动画回调分别检查',21);
   b+=picture('assets/folio-repair/artemis-elite2-design.webp',20,235,215,165);c.lanes[1].slice(1).forEach((t,i)=>{b+=box(275+i*238,255,210,95,t,'COMBAT 0'+(i+1),i);if(i<2)b+=line(`M${485+i*238} 302h28`);});b+=text(275,390,'邻接检查 → SetHexPath / 距离与冷却 → 敌人行为',20);
  }else if(c.map==='braid'){
   const group=['EP.01—05 / 铺陈','EP.06 / 断裂','EP.07—10 / 整合'];group.forEach((t,i)=>b+=text(235+i*280,35,t,22,ink,'middle'));
   c.lanes.forEach((l,j)=>{const y=65+j*180;b+=text(25,y+50,l[0],19);l.slice(1).forEach((t,i)=>{b+=box(160+i*280,y,240,95,t,'0'+(i+1),i);if(i<2)b+=line(`M${400+i*280} ${y+48}h40`);});});b+=line('M840 160V245',true,color)+text(530,217,'身份线在终局交汇 / 第9集融合，第10集归位',19,color);b+=text(160,391,'并列 = 两条叙事视角；纵向位置不是情绪强度',20);
  }else if(c.map==='radial'){
   b+=picture('assets/afterglow-glyph.webp',330,60,340,290);
   const pos=[[20,35,315,85],[665,35,315,85],[20,250,315,85],[665,250,315,85]];c.lanes[0].slice(1).forEach((t,i)=>{const [x,y,w,hh]=pos[i];b+=box(x,y,w,hh,t,'CHANNEL 0'+(i+1),Math.min(i,2))+line(`M${x<500?x+w:x} ${y+42}L${x<500?370:630} ${y<200?135:285}`);});b+=text(500,386,'字重 / 手动控制     ·     相邻样本 / 插值',20,ink,'middle');
  }else if(c.map==='service'){
   b+=text(30,35,'RESEARCH / 29份问卷 + 4份访谈材料',20);c.lanes[0].slice(1).forEach((t,i)=>{const y=65+i*100;b+=box(30,y,245,80,t,'FRICTION 0'+(i+1),i)+line(`M275 ${y+40}H445`)+box(445,y,300,80,c.lanes[1][i+1],'TOUCHPOINT 0'+(i+1),i);});b+=picture('assets/folio-repair/growth-compass-flat-v1.webp',775,65,200,270)+text(785,355,'概念人物 / 非参与者',17)+text(30,399,'前台触点 ← 学生、同伴、教师、平台的后台协作',21);
  }else if(c.map==='blueprint'){
   c.lanes.forEach((l,j)=>{b+=text(25,35+j*205,l[0],20);l.slice(1).forEach((t,i)=>{const x=25+i*192,y=55+j*200;b+=box(x,y,177,90,t,'0'+(i+1),Math.min(i,2));if(i<4)b+=line(`M${x+177} ${y+45}h15`);if(j===0)b+=line(`M${x+88} 145V255`,true,color);});});b+=text(25,393,'列宽不表示耗时 / 通知跨模块 / 档案记录项目资料',20);
  }else if(c.map==='seasons'){
   const pics=['autumn','winter','spring','summer'];c.lanes[0].slice(1).forEach((t,i)=>{const x=25+i*240;b+=picture('assets/garden-'+pics[i]+'.webp',x,50,220,140)+text(x,32,'0'+(i+1)+' / '+t,24);if(i<3)b+=line(`M${x+220} 123h20`);});b+=line('M25 221H975');c.lanes[1].slice(1).forEach((t,i)=>b+=box(70+i*305,260,250,90,t,'MY MODULE / 0'+(i+1),i));b+=text(25,397,'故事顺序 / 秋冬春夏     ·     剧情解谜 ≠ 自由游览',21);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 ${h}" role="img" aria-labelledby="fr-${id}-title fr-${id}-desc" font-family="Inter Tight, Arial, Microsoft YaHei, sans-serif" fill="${ink}"><title id="fr-${id}-title">${esc(c.mapTitle)}</title><desc id="fr-${id}-desc">${esc(c.mapDesc)} ${esc(c.boundary)}</desc><rect width="1000" height="${h}" fill="${paper}"/>${b}</svg>`;
 }
})();
