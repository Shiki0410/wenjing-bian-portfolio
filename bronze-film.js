/* The films, character sheets and narrative sources are distinct evidence types. */
(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pad=n=>String(n).padStart(2,'0');
  const stamp=t=>`${pad(Math.floor(t/60))}:${(t%60).toFixed(2).padStart(5,'0')}`;
  const episodes=[
    {title:'朱契',en:'THE CRIMSON PLEDGE',duration:97.69,times:[11.72,29.31,46.89,64.48,82.06],note:'由仪式与回忆进入星辰的追寻。'},
    {title:'青焰',en:'AWAKENING IN CYAN',duration:89.12,times:[10.69,26.74,42.78,58.82,74.86],note:'青铜小鸮进入故事，青绿色成为器灵觉醒的视觉线索。'},
    {title:'蜀眸',en:'EYES ACROSS THREE MILLENNIA',duration:136.98,times:[16.44,41.09,65.75,90.41,115.06],note:'纵目面具与竞技场，把器物的凝视转化为战斗画面。'},
    {title:'钟界',en:'THE BELL THAT CALLED HER NAME',duration:128.04,times:[15.36,38.41,61.46,84.51,107.55],note:'编钟、文字与铸造意象进入镜头。成片顺序中，编钟在剑之前。'},
    {title:'问名',en:'THE UNRUSTED SWORD WITHOUT A LORD',duration:120.14,times:[14.42,36.04,57.67,79.29,100.92],note:'剑的器形、红黑与金色画面，承接器灵与身份的线索。'},
    {title:'鸮陨',en:'WHEN THE OWL CARVED THE STONE',duration:76.90,times:[9.23,23.07,36.91,50.75,64.60],note:'黑白朱红剪影压缩军阵与人物；阿鸮陨落，两条叙事线在这里转折。'},
    {title:'向北',en:'TO THE NORTH',duration:207.91,times:[24.95,62.37,99.80,137.22,174.64],note:'候车室、回忆与实景混合承接陨落后的身份揭示。'},
    {title:'南渡',en:'SOUTHWARD DEFIANCE',duration:105.30,times:[12.64,31.59,50.54,69.50,88.45],omit:[1],note:'从吊坠与实景继续南行，人物重新进入行动。'},
    {title:'祀戎',en:'FATE',duration:99.22,times:[11.91,29.77,47.63,65.49,83.34],note:'星辰、阿鸮与妇好的线索汇入融合形态，进入终局对抗。'},
    {title:'拓归',en:'ECHOES OF THE LINKED MEMORY',duration:220.01,times:[26.40,66.00,105.60,145.21,184.81],note:'对抗之后转向记忆、告别与归位，收束十集故事。'}
  ];
  const frameKey=(episode,index)=>`bronze-ep${pad(episode)}-${index}`;
  function still(episode,index,extra='',cls=''){
    const e=episodes[episode-1], caption=`EP.${pad(episode)}《${e.title}》 · ${stamp(e.times[index-1])} · 原成片截图${extra?' / '+extra:''}`;
    return art(frameKey(episode,index),caption,cls);
  }
  function art(key,caption,cls=''){
    return `<figure class="bronze-source ${cls}"><button data-book-art="${key}" data-caption="${esc(caption)}" aria-label="放大：${esc(caption)}"><img src="assets/${key}.webp" alt="${esc(caption)}" loading="lazy" decoding="async"></button><figcaption>${esc(caption)}</figcaption></figure>`;
  }
  const strip=()=>`<div class="bronze-opening-film">${still(6,4,'阿鸮', 'opening-owl')}${still(6,5,'星辰', 'opening-human')}${still(7,4,'实景混合', 'opening-world')}</div>`;
  const home=$('#folio-bronze');
  if(home){
    $('.image-1',home).outerHTML=`<div class="plate-image image-1 bronze-home-film">${strip()}</div>`;
    return;
  }
  if(document.body.dataset.project!=='bronze')return;
  document.body.classList.add('bronze-film-case');
  $('.case-cover').innerHTML=strip();
  $('.case-opening .spread-footer a').textContent='观看十集原片 ↓';
  $('.experience-heading h2').textContent='十集原片 / 从这里看起';
  $('.experience-heading .eyebrow').textContent='SCREENING ROOM / 剧集观看';
  const experience=$('#experience'),bench=$('.project-workbench',experience);
  bench.classList.add('bronze-film-browser');
  bench.innerHTML=`<div class="bronze-screen"><div class="bronze-screen-head"><span>ORIGINAL FILM / 原始成片</span><span data-film-number></span></div><video id="bronze-player" controls playsinline preload="none" aria-label="天命：祀与戎原始成片"></video><div class="bronze-screen-foot"><span data-film-clock>00:00 / 00:00</span><span>竖屏原画幅 · 网页转码 · 无内容裁切</span></div></div><div class="bronze-film-desk"><div class="bronze-current"><span class="bronze-kicker" data-film-label></span><h3 data-film-title></h3><p class="bronze-episode-en" data-film-en></p><p data-film-note></p><p class="bronze-play-hint">选择剧集后点击播放器播放。点击下方剧照，定位到原片时间。</p></div><div class="bronze-episode-index" role="group" aria-label="选择短剧剧集">${episodes.map((e,i)=>`<button data-bronze-episode="${i}" aria-pressed="false"><span>${pad(i+1)}</span><b>${e.title}</b><small>${stamp(e.duration).slice(0,5)}</small></button>`).join('')}</div><div class="bronze-episode-paging"><button data-film-prev>← 上一集</button><output data-film-status aria-live="polite"></output><button data-film-next>下一集 →</button></div></div><div class="bronze-frame-reel"><div class="bronze-reel-heading"><h4>剧中截图 / 时间码</h4><p>源自所选剧集；可定位或放大。</p></div><div data-film-frames class="bronze-frame-line"></div><p data-film-seek-state role="status" class="bronze-seek-state">未启动播放。</p></div>`;
  const video=$('#bronze-player');let selected=5,pendingSeek=null;
  function seek(time){
    pendingSeek=time;video.preload='metadata';
    if(video.readyState>=1){video.currentTime=time;pendingSeek=null;}
    else video.load();
    $('[data-film-seek-state]').textContent=`定位到 EP.${pad(selected+1)}《${episodes[selected].title}》 ${stamp(time)}；点击播放器继续观看。`;
  }
  function choose(index){
    if(index<0||index>=episodes.length)return;
    selected=index;pendingSeek=null;const e=episodes[index];video.pause();
    video.preload='none';video.src=`media/bronze-episode-${pad(index+1)}.mp4`;video.poster=`assets/${frameKey(index+1,index===5?4:1)}.webp`;video.load();
    $('[data-film-number]').textContent=`EP.${pad(index+1)} / 10`;
    $('[data-film-label]').textContent=`第 ${index+1} 集 / ${stamp(e.duration).slice(0,5)}`;
    $('[data-film-title]').textContent=e.title;
    $('[data-film-en]').textContent=e.en;
    $('[data-film-note]').textContent=e.note;
    $('[data-film-clock]').textContent=`00:00 / ${stamp(e.duration).slice(0,5)}`;
    $('[data-film-status]').textContent=`${index+1} / 10`;
    $('[data-film-prev]').disabled=index===0;$('[data-film-next]').disabled=index===9;
    $$('[data-bronze-episode]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.bronzeEpisode===index)));
    $('[data-film-frames]').innerHTML=e.times.map((time,i)=>{
      if(e.omit?.includes(i))return '';
      const key=frameKey(index+1,i+1),caption=`EP.${pad(index+1)}《${e.title}》 · ${stamp(time)} · 原成片截图`;
      return `<figure><button class="bronze-frame-seek" data-seek-film="${time}" aria-label="定位 EP.${pad(index+1)} ${stamp(time)}"><img src="assets/${key}.webp" alt="${esc(caption)}" loading="lazy"></button><figcaption><button data-seek-film="${time}" aria-label="定位原片 ${stamp(time)}">${stamp(time)} ↗</button><button data-book-art="${key}" data-caption="${esc(caption)}" aria-label="放大 ${esc(caption)}">放大 ＋</button></figcaption></figure>`;
    }).join('');
    $('[data-film-seek-state]').textContent=`已选择第 ${index+1} 集《${e.title}》，未自动播放。`;
  }
  video.addEventListener('loadedmetadata',()=>{if(pendingSeek!==null){video.currentTime=Math.min(pendingSeek,video.duration);pendingSeek=null;}});
  video.addEventListener('timeupdate',()=>{$('[data-film-clock]').textContent=`${stamp(video.currentTime).slice(0,5)} / ${stamp(episodes[selected].duration).slice(0,5)}`;});
  video.addEventListener('error',()=>{$('[data-film-seek-state]').textContent='视频暂时无法加载；剧照仍可查看，可从页面底部打开公开合集。';});
  bench.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;if(b.dataset.bronzeEpisode!==undefined)choose(+b.dataset.bronzeEpisode);if(b.dataset.seekFilm!==undefined)seek(+b.dataset.seekFilm);});
  $('.bronze-episode-index').addEventListener('keydown',event=>{
    const b=event.target.closest('[data-bronze-episode]');if(!b||!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(event.key))return;
    event.preventDefault();event.stopPropagation();const delta=['ArrowRight','ArrowDown'].includes(event.key)?1:-1;
    const i=event.key==='Home'?0:event.key==='End'?9:(+b.dataset.bronzeEpisode+delta+10)%10;choose(i);$(`[data-bronze-episode="${i}"]`).focus();
  });
  $('[data-film-prev]').addEventListener('click',()=>choose(selected-1));$('[data-film-next]').addEventListener('click',()=>choose(selected+1));
  choose(5);
  const chapter=n=>$(`#chapter-${n} .chapter-visuals`);
  chapter(1).innerHTML=`<div class="bronze-narrative"><div class="bronze-thread-head"><span>明线 / 星辰</span><span>暗线 / 阿鸮</span></div><ol class="bronze-story-acts"><li><span class="bronze-act-range">EP.01—05 / 铺陈</span><div><h3>追查父母 → 进入器灵竞技</h3><p>地宫核心准入权，让竞技成为接近真相的路径。</p></div><div><h3>觉醒 → 记忆碎片累积</h3><p>每次相遇都让器灵离自己的身份更近一步。</p></div></li><li class="bronze-act-crossing"><span class="bronze-act-range">EP.06 / 交汇与断裂</span><div><h3>追寻抵达冲突</h3><p>始皇与父母真相的线索，推翻此前的竞技节奏。</p></div><div><h3>阿鸮陨落</h3><p>记忆与身份不再只由战斗逐次揭开。</p></div></li><li><span class="bronze-act-range">EP.07—10 / 整合</span><div><h3>身份理解 → 终局对抗与和解</h3><p>星辰不只追问答案，也重新选择如何与记忆相处。</p></div><div><h3>妇好显露 → 三方融合与归位</h3><p>第九集交汇，第十集以告别收束。</p></div></li></ol><p class="bronze-source-note">依据最终汇报的“5 + 1 + 4”架构重排；这是剧情结构，不是情绪或效果测量。</p></div><div class="bronze-story-stills">${still(1,3,'回忆中的传递')}${still(6,5,'陨落后的星辰')}${still(10,5,'终局归位')}</div><nav class="bronze-story-links" aria-label="从叙事结构查看剧集">${[1,6,7,9,10].map(n=>`<a href="#experience" data-open-bronze="${n-1}">EP.${pad(n)} ${episodes[n-1].title} ↗</a>`).join('')}</nav>`;
  chapter(2).innerHTML=[
    ['01 / DAILY','星辰 · 考古常服','bronze-xingchen-study','原始人设 / 考古常服.png',2,2,'短红外套、工装裤与挎包建立日常身份，簪花与吊坠保留家人的痕迹。'],
    ['02 / BATTLE','星辰 · 战斗服','bronze-xingchen-battle','原始人设 / 战斗服.png',5,3,'立领长裙与玉箫转向战斗表达，仍保留红色、发饰与吊坠。'],
    ['03 / FUSION','妇好终态 · 三方融合','bronze-fusion-study','原始人设 / 妇好终.png',9,1,'银发、军帽、单片眼镜与黑粉风衣组织终态；它是星辰、阿鸮与妇好的融合，不是孤立的换装。']
  ].map(([tag,title,key,caption,ep,index,note])=>`<div class="bronze-character-spread"><div class="bronze-character-heading"><span>${tag}</span><h3>${title}</h3><p>${note}</p></div>${art(key,caption,'bronze-character-sheet')}${still(ep,index,'设定进入成片','bronze-character-shot')}</div>`).join('');
  chapter(3).innerHTML=`<div class="bronze-artifact-board">${art('bronze-spirit-source','原项目最终汇报 / 第 9 页 · 器灵设计原则与形态（设定资料，非剧照）','bronze-artifact-report')}${art('bronze-owl-study','原始人设 / 阿鸮.png（造型设定，非剧照）','bronze-owl-sheet')}${still(2,5,'青绿器灵进入成片','bronze-owl-shot')}</div><div class="bronze-artifact-reading"><p><span>形</span>保留鸟、面具与兵器的基本轮廓，使器物本身成为生命体。</p><p><span>纹</span>纹饰进入表面与阵营识别，避免用任意几何符号替代原作语言。</p><p><span>意</span>记忆、名字和“被看见”连接情节；能力设定是创作转译。</p></div>`;
  chapter(4).innerHTML=`<div class="bronze-art-direction">${[
    [4,3,'TYPE / 文字画面','文字与编钟','字面、器形和留白共同进入镜头，而不是把说明写在画面之外。'],
    [6,3,'SHADOW / 剪影','军阵与压迫','黑白轮廓与朱红重点压缩细节，重复的队列组织力量。'],
    [7,4,'HYBRID / 实景混合','真实空间，二维人物','玻璃桥与景观建立空间，再让人物与镜头进入其中。'],
    [10,2,'CEL / 光色对抗','玄黑、青绿与金色','人物轮廓、硬边明暗和能量光，在终局保留不同阵营的辨识。']
  ].map(([ep,index,tag,title,note])=>`<div>${still(ep,index)}<span class="bronze-kicker">${tag}</span><h3>${title}</h3><p>${note}</p></div>`).join('')}</div>`;
  chapter(5).innerHTML=`<ol class="bronze-production-ledger">${[
    ['剧本与角色','明暗双线剧本、人设多轮版本和固定造型共同定义角色身份；最终汇报与成片优先于早期稿的集数排序。'],
    ['镜头参考与约束','分镜、构图、动作阶段与首尾帧描述进入生成任务。参考资料用于明确镜头目标，不被当作自己的成片成果。'],
    ['片段生成与人工筛选','结合角色参考生成候选，检查服饰、比例、动作与承接。不可用片段返回重做，不能用提示词长度证明画面质量。'],
    ['声音、剪辑与合成','汇报记录了声音一致性、背景音乐混入等问题的处理；在配音、剪辑和后期中重新组织连续观看的节奏。']
  ].map(([title,note],i)=>`<li><span>0${i+1}</span><div><h3>${title}</h3><p>${note}</p></div></li>`).join('')}</ol><p class="bronze-source-note">实际制作资料涉及 Seedance、AE 与 DaVinci。此页不模拟生成服务，也不将新增 Agent 概念写作已实现成果。</p>`;
  const decisions=$('#design-decisions');
  decisions.classList.add('bronze-reference-notes');
  decisions.innerHTML=`<div><p class="eyebrow">SOURCE REFERENCES / 原项目创作参考</p><h2>从参考里提取语言，<br>再让它服务剧情。</h2></div><dl><dt>赛璐璐动画</dt><dd>风格稿以 MAPPA 系动画为参考，明确轮廓、平涂与硬边阴影。<small>转译任务 / 保持人物与动作的辨识</small></dd><dt>日系 MV / PV</dt><dd>原稿借助 MV、动画 OP 的构图意识，组织景别、文字、转场与光色。<small>转译任务 / 镜头节奏与信息焦点</small></dd><dt>器物与纹饰</dt><dd>商周青铜器形制、凤鸟纹与兽面纹提供角色与器灵的视觉线索。<small>转译任务 / 器形、身份与叙事锚点</small></dd><dt>最终成片的发展</dt><dd>第六集的朱红剪影、后段实景混合，以实际画面为展示依据。<small>转译任务 / 为不同剧情阶段选择视觉方式</small></dd></dl><p class="bronze-source-note">参考来自项目自身的《艺术风格prompt完整版》与最终汇报。风格目标不等于成片已达到的质量指标；外部参考作品不标作个人作品。</p>`;
  $$('.experience-toc').forEach(a=>a.innerHTML='<small>↗</small>FILMS / 十集成片');
  $('a[href="#design-decisions"]',$('.case-toc')).innerHTML='<small>→</small>REFERENCES / 创作参考';
  $$('.book-case-nav a').forEach(a=>{if(a.hash==='#experience')a.textContent='成片';});
  const sourceDetails=document.createElement('details');sourceDetails.className='bronze-source-details';
  sourceDetails.innerHTML='<summary>素材来源与版本说明</summary><p>剧照直接从「智能设计 / 第一集.mp4」至「第十集.mp4」抽取，保留原画幅并标注原片时间码。网页视频仅转码，未重新剪辑。</p><p>三视图来自「短剧 / 人设」中的考古常服、战斗服、妇好终与阿鸮图。器灵原则页来自「天命：祀与戎 / 最终汇报PPT.pdf」第 9 页。剧集标题与顺序采用该最终汇报第 6 页；叙事结构综合第 5 页与明暗双线剧本。</p><p>早期剧本的第 4、5 集顺序与成片不同，此页按最终成片的「钟界 → 问名」呈现。作品集的结构图是重新整理后的说明，人物图与剧照分别注明。</p>';
  $('.case-result').append(sourceDetails);
  document.addEventListener('click',event=>{const a=event.target.closest('[data-open-bronze]');if(a)choose(+a.dataset.openBronze);});
})();
