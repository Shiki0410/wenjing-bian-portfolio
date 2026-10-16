(window.SCENES = window.SCENES || {})['jingwai'] = {
  theme: 'film',
  key: 'jingwai/hotel-v138', keyCap: '025 · 23:17 之前 · Unity v1.3.8 实机帧',
  sub: '她活了下来，却不记得这十二秒。',
  meta: [['YEAR', '2026'], ['FORMAT', 'Unity 首章 Demo · Windows / 浏览器'], ['DESIGN', '世界观、关卡与交互设计 · 美术方向与制作统筹', 1], ['BUILD', 'Codex · Unity / C# · Blender · 脚本、道具、纸本界面与 Shader', 1]],
  stripB: 'ORPHÉE / 025 号片盘 · 个人项目',
  logline: {
    q: '很多游戏里的拍照只是收集截图。我想让拍照影响剧情：玩家走进一卷电影，改变一次事故，回到现实后查看这次改变留下了什么。',
    a: '个人项目。世界观、人物关系、记忆代价和连续关卡脚本由我完成；试玩里出现的“看不懂、够不着、做了没区别”，我逐条写成物件状态、按键和反馈要求，交给 Codex 做 Unity 脚本、Blender 资产、纸本界面和 Shader，每次修改都回到引擎画面核对。',
    r: '交付 Unity v1.3.8 首章 Demo，有 Windows 与浏览器两个入口。救援方式改变人物动作与检修证据，送递方式改变接收窗的准备操作。录像与多层电影没有实现。'
  },
  stats: [['12 秒', '艾达失去的记忆'], ['3 种', '救援办法'], ['3 条', '原信送法'], ['94 秒', '首章实机选编']],
  home: {
    tag: '走进电影 · 送信 · 查证',
    thumbs: ['jingwai/workbench-v138', 'jingwai/ada-v138'],
    jump: [['三种救法', 'rescue'], ['一封信，三条路', 'letter'], ['制作与验收', 'make']],
    tools: 'CODEX · UNITY / C# · BLENDER · SHADER'
  },
  acts: [
    {
      id: 'why', toc: '故事背景', kicker: 'REEL 025 · 23:16:50', title: '23:17 之前，\n艾达还站在吊灯下。',
      open: { t: 'reel', imgs: [['jingwai/chandelier-v138', '吊灯与吊索'], ['assets/frames/jw-026-letter.webp', '026 · 原信装袋、盖戳、留底'], ['jingwai/workbench-v138', '07 · 机构与光路']] },
      lead: '问题：玩家要在吊灯落下前救下艾达，救援成功后艾达会失去 23:16:50—23:17:02 这十二秒的记忆。排演可以重来，正式封存不能。',
      role: '我写了世界观、人物关系、委托单和记忆代价。',
      blocks: [
        { sub: '余映局的第 25 号委托', en: 'THE SCREENING' },
        { module: 'jwSlip' },
        { text: ['在《镜外》里，电影会摄取人的灵魂：胶片留下当事人的一部分意识，也留下她没来得及完成的事。余映局接到这类求助，就派放映员走进一小段电影，搬动物件、试放、补拍，再把结果带回现实。', '第 25 号委托来自艾达。她要回冬庭饭店见丈夫马丁和女儿米娅，随身带着一封写给女儿的信。吊索已经松脱，马丁抓着它走不开，米娅还在等一张合影。下一秒，吊灯就要落下。', '放映员要在灯落下前救下艾达，拍下这次结果，并把她没交出去的原信交到现实里的米娅手里。结果正式封存以后，艾达会忘掉这十二秒。'] },
        { note: '首章 · Unity v1.3.8 实机帧：开场三张里，吊灯与 07 是留底截图，026 截自实机选编视频。' }
      ]
    },
    {
      id: 'design', toc: '设计逻辑', kicker: 'DESIGN LOGIC · OBSERVE / INTERVENE / VERIFY', title: '让摄影留下\n可以查证的后果',
      open: { t: 'local', label: 'LOGIC', cap: '设计逻辑' },
      lead: '目标：照片要能改变人物的经历，也要能在现实里查到改变的结果。首章设计了观察、介入、查证三个动作，并把可以重试的尝试和不能撤回的结果分开。',
      role: '我定下规则，写成按键、状态和反馈要求。',
      blocks: [
        { module: 'jwLoop' }
      ]
    },
    {
      id: 'refs', toc: '借鉴参考', kicker: 'REFERENCES · VIEWFINDER / WILL / OUTER WILDS', title: '参考了三部作品',
      open: { t: 'local', label: 'REFERENCES', cap: '借鉴参考' },
      lead: '方法：设计之前，我读了三部作品怎样处理相机、顺序和工具。资料来自官方文字和开发者说明；镜外在此基础上做自己的转译，没有做对比实验。',
      role: '我整理参考，决定各取哪一处。',
      blocks: [{ module: 'jwRefs' }]
    },
    {
      id: 'world', toc: '世界与机制', kicker: 'WORLD · MECHANISM', title: '首章的世界\n分片内和现实两层',
      open: { t: 'local', label: 'WORLD', cap: '世界与机制' },
      lead: '设计与实现：片内是 025 酒店、026 邮局、027 车站三段电影；现实是档案室、07 号街区和对岸的影院。相机与实体操作把两层连在一起。',
      role: '我画出空间关系和操作流程，Codex 搭建场景。',
      blocks: [{ module: 'jwWorld' }]
    },
    {
      id: 'play', toc: '试玩原型', kicker: 'PLAY THE BUILD · UNITY WEBGL', title: '首章可以直接试玩',
      open: { t: 'num', num: '94', unit: 'SEC', label: 'WINDOWS 首章实机选编 · v1.3.8 · 撑杆救援 → 封存 → 送信 → 07 检修 → 拍照搭路' },
      lead: '交付：保留的 v1.3.8 首章，用键盘和鼠标游玩，点开始才会下载游戏。这是首章，不代表后来扩展的完整方案。',
      role: '我定验收路线，Codex 驱动输入并录制 94 秒选编。',
      blocks: [
        { module: 'liveDemo', opt: { code: 'PLAY / UNITY WEBGL', title: '镜外 · 首章', src: 'demos/jingwai/index.html', poster: 'assets/frames/jw-07-stairs.webp' } },
        { sub: '94 秒实机选编', en: 'FIRST CHAPTER · 94 s' },
        { video: [{ src: 'jingwai-first-chapter-v138.mp4', poster: 'assets/frames/jw-07-repair.webp', title: 'Windows 首章实机选编 · 94 秒 · v1.3.8', note: '撑杆救援 → 封存 → 送信 → 07 检修 → 拍照搭路。Unity 原生运行，输入由程序驱动；剪过、切过机位，字幕是后加的，没有声音。' }], n: 1 }
      ]
    },
    {
      id: 'rescue', toc: '三种救法', kicker: 'ACTION → CONSEQUENCE · 025 → 07', title: '救艾达有三种办法',
      open: { t: 'slash' },
      lead: '设计与实现：餐车接住灯，钩索接回吊索，撑杆托住灯底。三种都救下艾达，也都付出同样的记忆代价，但留下的证据不同，到 07 号要按证据检修。',
      role: '我设计三条分支的证据和检修要求。',
      blocks: [
        { module: 'jwRescue' },
        { sub: '钩索路线在 07 号：对着照片取景', en: 'HOOK ROUTE · 07' },
        { fig: 'jingwai/frame-v136', cap: '马丁留下的取景架：镂空框对准照片里的三个人，按左键拍下 · v1.3.6 实机帧' }
      ]
    },
    {
      id: 'letter', toc: '三条送法', kicker: 'ONE LETTER · THREE ROUTES', title: '原信怎么\n送到米娅手里',
      open: { t: 'local', label: 'LETTER', cap: '三条送法' },
      lead: '设计与实现：原信只有一封，可以经 026 邮局和 027 邮车，也可以自己带回街上。送法决定 07 号用哪扇接收窗，信最后都要亲手递给米娅。',
      role: '我写送递规则和三扇窗的准备操作，Codex 实现并建三个场景模型。',
      blocks: [
        { sub: '三条送法，三扇接收窗', en: 'FIXED · SLIDING · PORTABLE' },
        { module: 'jwDelivery' },
        { sub: '三个场景的模型', en: 'POST OFFICE · TRAM · STREET' },
        { module: 'jwSets' },
        { sub: '07 号的两条线索', en: 'READ FIRST · AFTER REPAIR' },
        { module: 'jwClues' }
      ]
    },
    {
      id: 'result', toc: '结果差别', kicker: 'CONSEQUENCE · EVIDENCE / MEMORY / ORIGINAL', title: '三种救法\n留下不同的东西',
      open: { t: 'local', label: 'CONSEQUENCE', cap: '游玩结果' },
      lead: '结果：救法决定 07 号检修什么，送法决定用哪扇接收窗，两个条件拼成九种组合。三种救法都救下艾达，送递也不决定一家人的生死。',
      role: '我整理分支对照；九种组合是机制推演，没有逐一验收。',
      blocks: [{ module: 'jwJoin' }, { module: 'jwOutcomes' }]
    },
    {
      id: 'novel', toc: '创新点', kicker: 'DESIGN POSITION · COMPARED WITH THE REFERENCES', title: '和参考相比的\n三处不同',
      open: { t: 'local', label: 'DESIGN POSITION', cap: '创新点' },
      lead: '结果：参考作品各有成熟的做法。镜外在此基础上做了三处不同：拍照和付出记忆代价分成两步；每种救法在 07 号留下不同的实物；同一封原信从电影里一直带到现实。',
      role: '这是我对设计位置的判断，没有做玩家研究。',
      blocks: [{ module: 'jwInnovation' }]
    },
    {
      id: 'make', toc: '制作与验收', kicker: 'PRODUCTION · BUILD / HALL / SHADER / CHECK', title: '制作过程\n和四次检查',
      open: { t: 'local', label: 'PRODUCTION', cap: '制作与验收' },
      lead: '交付与实现：我把每件东西写成合同，交给 Codex 做 Unity 脚本、Blender 资产、纸本界面和渲染，做完后回到引擎画面核对。',
      role: '我写合同，决定取舍，也决定什么算通过。',
      blocks: [
        { module: 'jwMake' },
        { sub: '大厅用珊瑚色，机关用黄铜', en: 'HALL · PALETTE' },
        { module: 'jwHall' },
        { sub: 'Shader 的四个分层', en: 'SHADER · OUTLINE · LOCAL LIGHT' },
        { module: 'jwShader' },
        { sub: '四次检查，各改了什么', en: 'FOUR CHECKS' },
        { module: 'jwChecks' }
      ]
    },
    {
      id: 'next', toc: '首章之后', kicker: 'WHAT COMES NEXT · REEL 026', title: '首章之后',
      open: { t: 'local', label: 'REEL / v1.3.8', cap: '当前首章与后续方案分开登记。' },
      lead: '交付与结果：现在完成的是首章 Demo，流程从救艾达开始，经过原信送递和 07 号检修，到对岸影院为止。录像和多层电影只是设想，还没有实现。',
      role: '边界由我登记：做完的、测过的、只是设想的分开写。',
      blocks: [{ module: 'jwNow' }]
    }
  ],
  done: ['Unity Windows 与浏览器首章、提示校准原型，以及 Blender 源文件、关卡脚本和验收记录。'],
  next: '录像、音轨编排和更深层的电影仍是后续方案，放在完整故事与连续关卡完成之后。',
  links: [['直接试玩首章', 'demos/jingwai/index.html', 'blue'], ['作品说明 PDF', 'downloads/Wenjing-Bian-Jingwai-VibeCoding.pdf'], ['提示校准实验室', 'demos/jingwai/index.html#lab']]
};
