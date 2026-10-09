/* Source-led editions. Artwork is the project; publication graphics only orient it. */
(() => {
 'use strict';
 const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 const el=(tag,cls,html='')=>{const e=document.createElement(tag);e.className=cls;e.innerHTML=html;return e;};
 const editions={
  rallylens:{family:'field',title:'RallyLens.',key:'同一片段 / 分别陈述',visual:'回放 · 事件 · 双方解释'},
  'privacy-city':{family:'protocol',title:'Privacy<br>City.',key:'授权情境 / 行为实验',visual:'模拟授权 → 行为记录 → 离线比较'},
  tennisatom:{family:'motion',title:'身体的肖像',key:'动作记录 / 个人表达',visual:'真实影像 · 动作轨迹 · 定制成片'},
  baseball:{family:'data',title:'Pitch /<br>Impact.',key:'Statcast / 投打叙事',visual:'人物 → 数据 → 空间'},
  artemis:{family:'game',title:'ARTEMIS',key:'重返星海 / 游戏实机',visual:'探索 · 构筑 · 战斗'},
  bronze:{family:'cinema',title:'天命：<br>祀与戎',key:'成片 / 明暗双线 / 角色设计',visual:'十集成片 · 原始人设 · 叙事结构'},
  afterglow:{family:'generative',title:'AFTER<br>GLOW',key:'上海南站 / 环境信息',visual:'字母径向图 · p5.js · 空间提案'},
  'growth-compass':{family:'service',title:'Growth<br>Compass.',key:'课程选择 / 学习支持',visual:'试听 → 选择 → 作业支架 → 朋辈支持'},
  looplab:{family:'material',title:'LoopLab.',key:'校园材料 / 服务概念',visual:'交换 · 团购 · 预约 · 档案 · 取件'},
  garden:{family:'garden',title:'游园<br>画境',key:'网师园篇 / 团队游戏',visual:'四季园景 · 绘梦奇扇 · 跨端交互'}
 };
 document.body.classList.add('project-editions');
 function imageButton(src,caption,cls=''){
  return `<figure class="edition-source ${cls}"><button data-book-art="${src}" data-caption="${caption}" aria-label="放大：${caption}"><img src="assets/${src}.webp" alt="${caption}" decoding="async"></button><figcaption>${caption}</figcaption></figure>`;
 }
 const cover=$('.book-cover');
 if(cover){
  const portrait=$('.cover-photo');
  portrait.classList.add('profile-portrait');$('.book-about').append(portrait);
  const title=$('#cover-title');title.innerHTML='<span>WENJING</span><span>BIAN<span class="name-point">.</span></span>';
  const note=$('.cover-note');note.innerHTML='<p class="cover-discipline">产品与交互 / 游戏 / AI 制作 / 数据可视化</p><p>从人的经历出发，<br>把研究做进界面，让想法成为作品。</p><a href="#work">进入作品 <span>↘</span></a>';
  cover.append(el('p','edition-cover-name','卞文璟 / 设计 · 人工智能'));
  cover.append(el('div','cover-work-source',imageButton('rally-ui','01 / RallyLens · 回放、目标与事件 · 研究原型')));
  const previews=el('nav','cover-work-ribbon');previews.setAttribute('aria-label','精选作品入口');
  previews.innerHTML=[['tennisatom','tennis-real-3','03','身体的肖像','真人定制影像'],['artemis','artemis-boss','05','Artemis','游戏实机'],['afterglow','afterglow-glyph','07','AFTERGLOW','原项目径向视觉']].map(([id,src,n,name,kind])=>`<a href="case.html?project=${id}"><img src="assets/${src}.webp" alt="${name} ${kind}"><span><b>${n}</b>${name}<small>${kind} ↗</small></span></a>`).join('');
  cover.append(previews);
  $('.book-index h2').innerHTML='Selected work<span> / 10</span>';
 }
 $$('.project-plate').forEach(plate=>{
  const p=window.PORTFOLIO.projects.find(p=>p.id===plate.dataset.project),e=editions[p.id];
  plate.classList.add('edition-'+e.family);
  $('.plate-title a',plate).innerHTML=e.title;
  const key=el('p','edition-key',e.key);$('.plate-title',plate).before(key);
  const credit=el('p','edition-visual-credit',e.visual);$('.plate-copy',plate).append(credit);
  if(p.id==='tennisatom')$('.plate-title',plate).append(el('span','edition-subtitle','TENNISATOM / THE BODY AS PORTRAIT'));
  if(p.id==='garden')$('.plate-title',plate).append(el('span','edition-subtitle','网师园篇'));
 });
 const id=document.body.dataset.project,e=editions[id];
 if(e){
  document.body.dataset.edition=e.family;
  $('.case-opening').classList.add('edition-'+e.family);
  $('.case-title-grid h1').innerHTML=e.title;
  $('.case-opening').append(el('p','edition-key',e.key));
  // No identity stamp inside evidence views: the actual model/court/fan remains authoritative.
  const bench=$('.project-workbench');
  if(bench){
   const nav=$('.workspace-rail,.service-nav',bench),flow=nav&&$('.studio-tabs',nav);
   if(flow){
    const signal=el('p','edition-flow-state');signal.setAttribute('aria-live','polite');flow.after(signal);
    const update=()=>{const b=$$('button',flow),selected=b.find(x=>x.getAttribute('aria-pressed')==='true');signal.textContent='当前视图 / '+(selected?.textContent.replace(/^\s*\d+\s*/,'').trim()||'');};
    flow.addEventListener('click',update);update();
   }
  }
 }
 // One-time editorial reveal, not animated data and not a repeating visual effect.
 if(!matchMedia('(prefers-reduced-motion:reduce)').matches){
  const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(isIntersecting){target.classList.add('edition-entered');observer.unobserve(target);}}),{threshold:.12});
  $$('.cover-work-source,.project-plate,.case-opening').forEach(x=>observer.observe(x));
 }
})();
