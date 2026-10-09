/* Original graphic assets + bounded interface effects adapted from supplied references. */
(() => {
 'use strict';
 const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 const make=(tag,cls,html='')=>{const e=document.createElement(tag);e.className=cls;e.innerHTML=html;return e;};
 const decorative=(cls,html='',tag='div')=>{const e=make(tag,cls,html);e.setAttribute('aria-hidden','true');return e;};
 const symbols={rallylens:'rally','privacy-city':'privacy',tennisatom:'tennis',baseball:'baseball',artemis:'artemis',bronze:'bronze',afterglow:'afterglow','growth-compass':'growth',looplab:'loop',garden:'garden'};
 const system=(number,label,symbol)=>`<span class="atlas-register-cross"></span><span class="atlas-small-code">${label}</span><span class="atlas-barcode"></span><span class="atlas-frame-number">${number}</span><span class="atlas-symbol atlas-symbol-${symbol}"></span>`;
 document.body.classList.add('graphic-atlas');
 const cover=$('.book-cover');
 if(cover){
  $('#cover-title').innerHTML='<span>WENJING</span><span>BIAN.</span>';
  cover.append(decorative('atlas-cover-field','<span class="atlas-cover-cut cut-rally"><img src="assets/rally-court.webp" alt=""><b>RALLYLENS / FIELDWORK</b></span><span class="atlas-cover-cut cut-artemis"><img src="assets/artemis-boss.webp" alt=""><b>ARTEMIS / GAMEPLAY</b></span><span class="atlas-cover-motif motif-rally"><i class="atlas-symbol atlas-symbol-rally"></i><b>RALLYLENS / 双人解释</b></span><span class="atlas-cover-motif motif-artemis"><i class="atlas-symbol atlas-symbol-artemis"></i><b>ARTEMIS / 移动规则</b></span><span class="atlas-cover-motif motif-afterglow"><i class="atlas-symbol atlas-symbol-afterglow"></i><b>AFTERGLOW / 径向编码</b></span>'));
  cover.append(decorative('atlas-cover-registration',system('01','DESIGN / FIELD INDEX','rally')));
  const stamp=make('p','atlas-cover-stamp','卞文璟 / 设计 · 人工智能');cover.append(stamp);
  $('.cover-photo').append(decorative('atlas-photo-band','<span>W/B</span><span>RESEARCH<br>DESIGN / BUILD</span>'));
  const title=$('.book-index h2');title.innerHTML='Selected<br>works / <span>10</span>';
 }
 $$('.book-spread').forEach((spread,i)=>{
  spread.append(decorative('atlas-construction'));
  const p=spread.dataset.project||document.body.dataset.project;
  if(spread.classList.contains('project-plate')||spread.classList.contains('case-opening')){
   const id=window.PORTFOLIO.projects.find(project=>project.id===p),symbol=symbols[p]||'portal';
   spread.append(decorative('atlas-spread-register',system(id?.number||'01','PROJECT / INDEX',symbol)));
   const image=$('.book-art button',spread);
   image?.append(decorative('atlas-media-corners','<i></i><i></i><i></i><i></i>','span'));
   const role=$('.plate-role',spread);
   role?.prepend(decorative('atlas-role-mark',`<span class="atlas-symbol atlas-symbol-${symbol}"></span>`,'span'));
   const colour=$('.plate-colour',spread);if(colour)colour.append(decorative('atlas-project-mark',`<span class="atlas-symbol atlas-symbol-${symbol}"></span>`));
  }
 });
 const about=$('.about-photo');if(about)about.append(decorative('atlas-profile-label','<span>03</span><span>BODY / MOTION</span><span class="atlas-barcode"></span>'));
 const bench=$('.project-workbench');
 if(bench){
  const id=document.body.dataset.project,symbol=symbols[id]||'portal';
  $('.workbench-bar',bench).append(decorative('atlas-bench-code','<span class="atlas-barcode"></span><span class="atlas-symbol atlas-symbol-'+symbol+'"></span>'));
  const nav=$('.workspace-rail,.service-nav',bench);
  if(nav){
   nav.append(decorative('atlas-navigation-seal',`<span class="atlas-symbol atlas-symbol-${symbol}"></span><span class="atlas-navigation-code">CONTROL / SEQUENCE</span>`));
  }
  const stage=$('.rally-main,.director-stage,.game-art-title,.encoding-image,.atlas-workspace,.garden-viewer-caption,.material-visual',bench);
  if(stage){
   stage.classList.add('atlas-stage');
   const origin={rallylens:'SOURCE / EVENT',tennisatom:'FILM / ORIGINAL',artemis:'GAMEPLAY / SOURCE',afterglow:'SOURCE + DESIGN STUDY',baseball:'INTERFACE / ORIGINAL',garden:'SOURCE / SCENE',looplab:'SERVICE / CONCEPT'};
   const tag=decorative('atlas-stage-register','<span class="atlas-register-cross"></span><span>'+(origin[id]||'SOURCE / VIEW')+'</span><span class="atlas-dotted-rule"></span>');stage.prepend(tag);
  }
  const flow=$('.workspace-rail .studio-tabs,.service-nav .studio-tabs',bench);
  if(flow){
   const signal=decorative('atlas-flow-signal','<b></b><span>01 / SELECTED</span>');flow.after(signal);
   const update=()=>{const buttons=$$('button',flow),index=buttons.findIndex(b=>b.getAttribute('aria-pressed')==='true');signal.style.setProperty('--step',String(index+1));$('span',signal).textContent=String(index+1).padStart(2,'0')+' / SELECTED';};
   flow.addEventListener('click',update);update();
  }
 }
 const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const interactive=$$('[data-book-art],.studio-image,.image-open');
 interactive.forEach(button=>{
  button.classList.add('atlas-viewfinder');
  if(!reduce){
   let frame=0;button.addEventListener('pointermove',event=>{
    if(event.pointerType!=='mouse')return;
    cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const r=button.getBoundingClientRect();button.style.setProperty('--focus-x',((event.clientX-r.left)/r.width*100).toFixed(1)+'%');button.style.setProperty('--focus-y',((event.clientY-r.top)/r.height*100).toFixed(1)+'%');});
   });
   button.addEventListener('pointerleave',()=>cancelAnimationFrame(frame));
  }
 });
 if(!reduce){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('atlas-impressed');observer.unobserve(entry.target);}}),{threshold:.15});
  $$('.book-cover,.project-plate,.case-opening,.project-workbench').forEach(e=>observer.observe(e));
  const scene=$('.project-workbench');if(scene)scene.addEventListener('click',event=>{const target=event.target.closest('.studio-tabs button');if(!target)return;scene.classList.remove('atlas-signal-change');requestAnimationFrame(()=>scene.classList.add('atlas-signal-change'));});
 }
})();
