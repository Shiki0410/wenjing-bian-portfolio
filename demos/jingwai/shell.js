(()=>{
 'use strict';
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 let loaded=false,ready=false,selected='play',lab,engineState=null;
 const frame=$('#unity-frame');
 function view(name){
  if(!['play','lab','notes'].includes(name)) name='play';
  selected=name;
  $$('.view').forEach(el=>el.hidden=el.id!=='view-'+name);
  $$('[data-view]').forEach(b=>{const on=b.dataset.view===name;b.classList.toggle('active',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  if(name==='lab'){
   if(!lab&&window.mountHumanLab) lab=window.mountHumanLab($('#lab-root'),()=>({phase:'unity',route:null,source:'固定场景案例，与游戏进度独立'}));
   else lab?.refreshContext();
  }
  history.replaceState(null,'','#'+name);
 }
 $$('[data-view]').forEach(b=>b.addEventListener('click',()=>view(b.dataset.view)));
 $$('[data-go]').forEach(b=>b.addEventListener('click',()=>{view(b.dataset.go);window.scrollTo({top:0,behavior:'instant'});}));
 function start(){
  $('#cover').hidden=true;$('#workspace').hidden=false;
  if(!loaded){frame.src='unity-web/index.html';loaded=true;$('#loading-overlay').hidden=false;$('#load-message').textContent='首次载入需要下载游戏资源，请稍候。';$('#retry-game').hidden=true;}
  frame.focus();window.scrollTo({top:0,behavior:'instant'});
 }
 $('#start').addEventListener('click',start);
 $('#back-cover').addEventListener('click',()=>{$('#workspace').hidden=true;$('#cover').hidden=false;window.scrollTo({top:0,behavior:'instant'});});
 $('#retry-game').addEventListener('click',()=>{ready=false;$('#load-progress').style.width='0%';$('#retry-game').hidden=true;$('#load-message').textContent='重新载入中…';frame.src='unity-web/index.html?reload='+Date.now();});
 window.addEventListener('message',e=>{
  if(e.origin!==location.origin||e.source!==frame.contentWindow||!e.data||typeof e.data.type!=='string')return;
  if(e.data.type==='jingwai-unity-progress'){
   const value=Number(e.data.value);if(!Number.isFinite(value))return;
   const pc=Math.round(Math.max(0,Math.min(1,value))*100);$('#load-progress').style.width=pc+'%';$('#load-message').textContent=pc<90?'载入游戏资源 · '+pc+'%':'正在初始化引擎 · '+pc+'%';
  }else if(e.data.type==='jingwai-unity-state'){
   const raw=e.data.state||e.data.value||e.data.payload;
   try{const value=typeof raw==='string'?JSON.parse(raw):raw;if(value&&typeof value==='object')engineState=value;}catch{}
  }else if(e.data.type==='jingwai-unity-ready'){
   ready=true;$('#loading-overlay').hidden=true;frame.focus();
  }else if(e.data.type==='jingwai-unity-error'){
   $('#loading-overlay').hidden=false;$('#load-message').textContent=String(e.data.message||'游戏未能载入，请刷新后重试。').slice(0,250);$('#retry-game').hidden=false;
  }
 });
 frame.addEventListener('load',()=>{
  if(!loaded)return;
  try{
   const d=frame.contentDocument;
   if(!d||!d.querySelector('canvas')){ $('#load-message').textContent='游戏资源未能载入。请重试，或在制作手记中查看原作实机。';$('#retry-game').hidden=false; }
  }catch{}
 });
 $('#full-game').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('.unity-frame-wrap').requestFullscreen();frame.focus();}catch{$('#load-message').textContent='当前浏览器未允许全屏，仍可在页面中游玩。';}});
 const help=$('#help');$('#help-open').addEventListener('click',()=>help.showModal());$$('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));help.addEventListener('click',e=>{if(e.target===help)help.close();});
 if(matchMedia('(max-width:760px)').matches)$('#mobile-note').hidden=false;
 window.render_game_to_text=()=>JSON.stringify({surface:'portfolio-unity-wrapper',view:selected,unity:{requested:loaded,ready,iframe:'unity-web/index.html',state:engineState},lab:selected==='lab'?$('#lab-root').textContent.slice(0,350):undefined,note:'Engine state is received from the read-only Unity bridge.'});
 // Unity keeps its real-time loop; this waits for that loop rather than setting game state.
 window.advanceTime=ms=>new Promise(resolve=>setTimeout(resolve,Math.max(0,Math.min(1000,Number(ms)||0))));
 window.addEventListener('hashchange',()=>view(location.hash.slice(1)||'play'));
 view(location.hash.slice(1)||'play');
})();
