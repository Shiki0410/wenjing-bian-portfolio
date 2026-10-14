/* PV edition — narrative layer.
   Facts stay in data.js / source-content.js / jingwai-data.js.
   This file reorganises them: tracks, Q→A→R briefs, chapter modules and collage material. */
(() => {
  const P = window.PORTFOLIO;
  const byId = id => P.projects.find(p => p.id === id);

  P.profile = {
    statement: ['把研究、系统与影像，', '做成能被操作的体验。'],
    lead: '我在同一个过程里研究问题、设计交互、搭建原型、做影像。先弄清楚人卡在哪里，再把答案做成能拿到手里、能操作、能检查的东西。',
    facts: [
      ['SCHOOL', '同济大学 设计创意学院', '视觉传达设计 × 人工智能 双学士'],
      ['NEXT', '浙江大学 人工智能与设计', '已获推免录取'],
      ['LANG', '雅思 6.5', '大学英语六级 506'],
      ['AVAIL', '上海 · 每周 4 天', '可连续实习 3 个月']
    ],
    roles: ['用户研究', 'AI 产品', '游戏系统', 'AIGC 影像', '数据可视化'],
    method: [
      ['問', 'ASK', '找到卡住的人', '访谈、视频回溯与问卷，先确认问题属于谁、发生在哪里。', 'target'],
      ['構', 'MODEL', '把问题变成结构', '事件、状态、旅程与数据契约，让模糊的体验可以被设计。', 'node'],
      ['作', 'BUILD', '做成能操作的东西', '原型、游戏、网站与影像。代码和 AI 是工具，判断由我负责。', 'chip'],
      ['検', 'CHECK', '回到证据检查', '标明来源与边界：哪些是实测，哪些是示意，哪些仍待验证。', 'eye']
    ]
  };

  /* Each claim points to the work that proves it. */
  P.capabilities = [
    { code: 'A', en: 'USER RESEARCH', cn: '用户研究', icon: 'target', text: '访谈、视频回溯、问卷与旅程梳理，把模糊的体验问题拆成可以设计的对象。', proof: ['rallylens', 'tennisatom', 'growth-compass'] },
    { code: 'B', en: 'AI × PRODUCT', cn: 'AI 产品与模型', icon: 'chip', text: '行为记录、模型比较与评估，以及用自然语言组织 AI 完成工程，并逐一核对结果。', proof: ['privacy-city', 'jingwai', 'rallylens'] },
    { code: 'C', en: 'GAME SYSTEMS', cn: '游戏与交互系统', icon: 'hex', text: '世界观、关卡脚本、状态机与跨端交互，让规则和反馈接住玩家的每一次操作。', proof: ['jingwai', 'artemis', 'garden'] },
    { code: 'D', en: 'VISUAL & MOTION', cn: '视觉与影像', icon: 'film', text: 'AIGC 短剧、运动影像与数据可视化，用画面承载信息，而不只是装饰。', proof: ['bronze', 'tennisatom', 'afterglow', 'baseball'] }
  ];

  P.tracks = [
    { id: 'research', code: 'TRACK A', en: 'RESEARCH × AI PRODUCT', cn: '研究与 AI 产品', jp: '研究', icon: 'radar', line: '从行为与证据出发，把研究做成可检查的产品原型。', ids: ['rallylens', 'privacy-city', 'baseball', 'afterglow'] },
    { id: 'game', code: 'TRACK B', en: 'GAME × INTERACTION', cn: '游戏与互动叙事', jp: '遊戯', icon: 'hex', line: '用规则、状态与反馈讲故事，让玩家的每一次操作都有后果。', ids: ['jingwai', 'artemis', 'garden'] },
    { id: 'motion', code: 'TRACK C', en: 'MOTION × SERVICE', cn: '影像与服务设计', jp: '映像', icon: 'film', line: '用影像和服务流程，把个人经验与公共需求组织成可交付的作品。', ids: ['bronze', 'tennisatom', 'growth-compass', 'looplab'] }
  ];

  /* ch: per-chapter overrides by index → module / image / gallery / layout */
  const briefs = {
    rallylens: {
      en: 'SPORTS HCI', team: '研究团队 · 共同第一作者', jp: '協働',
      q: '羽毛球搭档都觉得“配合得不错”，对练习目标和成功标准的理解却可能完全不同。',
      a: '主导研究设计与用户研究，参与模型算法、数据架构与可视化交互；提出 DPE 双人练习片段表征，并做成可回查的 RallyLens 原型。',
      r: '2,204 次逐事件分析、150 段双机位训练片段；共同第一作者论文 CSCW 在投。',
      key: 'rally-ui', art: 'rally-flat-pair-v1',
      ch: {
        0: { module: 'rallySources' },
        1: { module: 'dpe' },
        2: { module: 'rallyLayers', image: null },
        3: { module: 'rallyTimeline' },
        4: { image: 'rally-flat-review-v1', caption: '回顾访谈情境 · 原创插画，非实拍' }
      }
    },
    'privacy-city': {
      en: 'AI PRODUCT', team: '个人项目', jp: '同意',
      q: '授权弹窗里的“同意”，其实是一段阅读、犹豫与选择的过程，却只被记录成一个结果。',
      a: '独立设计五类模拟授权情境与行为记录；用 NumPy 手写 MLP 的前向与反向传播，并与四种模型比较排序、分类与校准。',
      r: '交付网页原型、离线多模型实验与分析仪表盘；结果来自合成数据，适用边界在页面中写明。',
      key: 'privacy-scene1', art: 'folio-repair/privacy-city-flat-v1',
      ch: {
        0: { module: 'privacyDemo' },
        1: { module: 'privacyPipeline', image: 'refinement/fig1_architecture', caption: '系统架构：情境配置、行为记录与实验模块分离。' },
        2: { module: 'mlp', image: 'privacy-compare' },
        3: { module: 'models', image: 'refinement/fig6_calibration_curve', caption: '概率校准曲线。' }
      }
    },
    baseball: {
      en: 'DATA STORY', team: '个人项目', jp: '投打',
      q: '投球的速度、落点与击球结果，需要不同的观察尺度，一张图讲不清。',
      a: '整理投打 CSV 数据，用 React、ECharts、GSAP 与 Three.js 搭建从人物叙事进入图表实验室的滚动网站。',
      r: '独立完成可演示的数据网站原型与源代码。',
      key: 'baseball-web-macro',
      videos: [{ src: 'baseball-original-demo.mp4', poster: 'baseball-web-hero', title: '网站实录', note: '原网站浏览录屏。' }],
      demo: ['打开网站原型', 'demos/baseball/index.html'],
      ch: {
        0: { module: 'liveDemo', opt: { code: 'MOD.B0', title: '原网站 · 直接操作', src: 'demos/baseball/index.html', poster: 'baseball-web-hero' } },
        1: { module: 'pitchMix' }
      }
    },
    afterglow: {
      en: 'GENERATIVE VIS', team: '三人团队', jp: '残光',
      q: '车站里的人流、噪声、PM2.5 和风，能不能被读成同一种图形语言？',
      a: '负责 V3 / V4 版 p5.js 代码与数据处理，建立四类信号到密度、形变、字形与运动的映射，完成核心视觉。',
      r: '交付可访问的可视化原型、A3 输出与公共空间设计方案。',
      key: 'afterglow-glyph',
      videos: [{ src: 'afterglow-original-demo.webm', poster: 'afterglow-web', title: '原型实录', note: '原 p5.js 原型运行录屏。' }],
      ch: {
        0: { module: 'encoding' },
        1: { module: 'glyph', gallery: [['afterglow-low', '低活跃状态 · 原项目样本'], ['afterglow-mid', '中活跃状态 · 原项目样本'], ['afterglow-high', '高活跃状态 · 原项目样本']] },
        2: { module: 'liveDemo', opt: { code: 'MOD.A3', title: '原型 · 直接运行', src: 'demos/afterglow/index.html', poster: 'afterglow-web' } }
      }
    },
    jingwai: {
      en: 'INDIE GAME', team: '个人项目 · AI 协作实现', jp: '鏡外',
      q: '摄影能不能真正介入故事？不只是收集截图，而是用一张照片改变一个人的命运。',
      a: '独立完成世界观、关卡与交互设计；用自然语言组织 Codex 完成 Unity、Blender 与 Shader 实现，每次修改都回到引擎画面核对。',
      r: 'Unity 首章 Demo，Windows 与浏览器均可直接试玩；三种救援办法、三条送信路线，结果彼此不同。',
      key: 'jingwai/hotel-v138',
      videos: [{ src: 'jingwai-first-chapter-v138.mp4', poster: 'jingwai/hotel-v138', title: '首章实机选编 · 94 秒', note: 'Unity v1.3.8 实机；含机位切换与剪辑，后期字幕，无音轨。' }],
      demo: ['直接试玩首章', 'demos/jingwai/index.html'],
      pdf: ['作品说明 PDF', 'downloads/Wenjing-Bian-Jingwai-VibeCoding.pdf'],
      chapters: [
        { eyebrow: '01 / WHY THIS GAME', title: '23:17 之前，艾达还站在吊灯下。', text: '你是放映员，可以走进一卷旧胶片，停在事故发生之前。搬动物件，排演一次，再拍下改变后的画面。正式封存后，艾达活了下来，却失去这十二秒的记忆；她写给女儿的原信还在，接下来要把它交出去。', module: 'jwFlow', gallery: [['jingwai/ada-v138', '艾达 · Unity 实机帧'], ['jingwai/chandelier-v138', '吊灯结构 · Unity 实机帧'], ['jingwai/projection-study.svg', '放映结构研究 · 原创矢量图']] },
        { eyebrow: '02 / ACTION → CONSEQUENCE', title: '灯接住了，马丁却未必能松手。', text: '餐车接住、钩索接回、撑杆托住：三条路都能救下艾达，也都付出同样的记忆代价。区别留在人物动作、照片和下一关的操作里。餐车留下撞痕，钩索让马丁空出手，撑杆留下锁位。', gallery: [['jingwai/brace-v133', '撑杆救援 · 历史版本操作帧'], ['jingwai/family-v133', '合影 · 历史版本操作帧'], ['jingwai/layered-film-study.svg', '多层胶片研究 · 原创矢量图']] },
        { eyebrow: '03 / ONE LETTER, THREE ROUTES', title: '一封信，三种送法。', text: '信只有一封：赶上邮车、错过后补送，或亲手送到。送法决定 07 号检修台使用哪扇接收窗，救法决定检修哪一处；两条线在 07 号汇合，完成检修与光路后，桥与楼梯的照片才成为通往影院的路。试着在下方组合一次。', module: 'jwMatrix', gallery: [['jingwai/letter-route-study.svg', '送信路线研究 · 原创矢量图'], ['jingwai/workbench-v138', '07 号检修台 · Unity 实机帧'], ['jingwai/forwarding-v135', '补送分拣 · 历史版本操作帧']] },
        { eyebrow: '04 / DESIGN WITH AI', title: '撑杆拿起来以后，还得让人知道怎么用。', text: '“这个伸缩杆怎么用？”是试玩里反复出现的问题。我把它拆成低位握轮、托头接触与锁止三个状态，要求提示写出对象、动作和完成条件，再交给 Codex 实现。故事、玩法和画面的取舍由我决定，AI 负责把它做出来；每次修改都回到引擎画面，看玩家能否认出部件、读到线索。', module: 'jwPrompt', gallery: [['jingwai/editing-v138', '剪辑台 · Unity 实机帧'], ['jingwai/paper-map-v138', '纸本地图 · Unity 实机帧']] }
      ]
    },
    artemis: {
      en: 'UNITY GAME', team: '课程游戏', jp: '星海',
      q: '怎样把航天探索、零件构筑与战斗，接成一个能玩下去的循环？',
      a: '负责主角与敌人的状态机和行为逻辑，设计并实现两类机制敌人、两场 Boss 战；独立制作理念宣传片。',
      r: '团队交付可演示游戏；个人模块覆盖移动、构筑效果链与战斗预警。',
      key: 'composition/artemis-cg-launch', art: 'composition/artemis-hero',
      videos: [{ src: 'artemis-gameplay.mp4', poster: 'composition/artemis-gameplay', title: '实机演示', note: '结题实机录屏。' }, { src: 'artemis-concept-film.mp4', poster: 'composition/artemis-concept-film', title: '理念宣传片', note: '个人制作。' }, { src: 'artemis-cutscene-one.mp4', poster: 'composition/artemis-cutscene-one', title: '过场 01', note: '游戏过场动画。' }],
      ch: {
        0: { gallery: [['artemis-build', '构筑与游戏界面 · 原素材'], ['composition/artemis-cg-tower', '过场 CG · 原素材'], ['composition/artemis-cg-laboratory', '过场 CG · 原素材']], image: null },
        1: { module: 'hexState', image: 'artemis-original-01', caption: '原项目移动与状态设计素材。' },
        2: { module: 'partChain', image: 'artemis-original-02', caption: '原项目构筑系统素材。' },
        3: { module: 'enemies' }
      }
    },
    garden: {
      en: 'CULTURE GAME', team: '同济团队 · 模块负责', jp: '游園',
      q: '园林文化怎样变成可以亲手操作的玩法，而不是一段展板说明？',
      a: '重构 NPC 交互与摄像机模块，衔接探索、对话与视角；参与网页版本到微信小程序的交互改写与适配。',
      r: '团队作品入选教育部“数智未来”焕活传统文化案例。',
      key: 'garden-autumn-overview',
      ch: {
        0: { module: 'seasons' },
        1: { module: 'fan', gallery: [['garden-fan-guide', '奇扇功能教学 · 原游戏界面']] },
        3: { module: 'gardenPipeline' }
      }
    },
    bronze: {
      en: 'AIGC SERIES', team: '个人主创', jp: '天命',
      q: '青铜器能不能不只是背景，而是成为角色的身体与叙事机制？',
      a: '编写十集明暗双线剧本，完成人物与器灵设定和分镜；镜头生成后逐段人工筛选、重做，再完成配音、剪辑与合成。',
      r: '十集 AIGC 动画短剧完整成片，可逐集观看。',
      key: 'bronze-ep06-4', episodes: true,
      ch: {
        0: { module: 'dualLine' },
        1: { gallery: [['bronze-threeviews', '人物三视图 · 设定'], ['bronze-xingchen-battle', '星辰战斗形态 · 设定'], ['bronze-xingchen-study', '星辰造型研究 · 设定']] },
        2: { module: 'triad' },
        3: { gallery: [['bronze-ep03-2', 'EP.03 剧照'], ['bronze-ep07-3', 'EP.07 剧照'], ['bronze-ep10-1', 'EP.10 剧照']] },
        4: { module: 'bronzePipeline', gallery: [['bronze-fusion-study', '融合形态研究'], ['bronze-rules', '器灵设计规则']] }
      }
    },
    tennisatom: {
      en: 'MOTION × DATA', team: '团队统筹 · 橙狮体育合作', jp: '肖像',
      q: '运动数据怎样服务个人表达，而不是把一个人压缩成一组指标？',
      a: '统筹团队与用户研究，参与个性化算法架构（MatchBundle 数据契约），负责视频全栈创作：真人影像、程序化视觉、动态文字与声音。',
      r: '5 支真人定制成片；获同济设创信息可视化最佳创作奖（团队）。',
      key: 'tennis-poster', contain: true,
      videos: [{ src: 'tennis-introduction.mp4', poster: 'tennis-real-5', title: '项目介绍', note: '身体的肖像项目介绍影片。' }],
      ch: {
        0: { gallery: [['tennis-real-3', '真人成片中的动态文字 · 截图'], ['refinement/tennis-user-voice', '用户原话 · 原研究材料']], image: null },
        1: { module: 'tennisPaths', image: 'tennis-product-board', caption: '原项目产品板：一键成片与定制两条路径。' },
        2: { module: 'tennisPipeline', image: 'refinement/tennis-tech-4', caption: '原技术图：事件、包络与特效渲染。' },
        3: { module: 'tennisLayers', gallery: null, after: 'tennisStyles' },
        4: { module: 'tennisFilms' }
      }
    },
    'growth-compass': {
      en: 'SERVICE DESIGN', team: '三人团队', jp: '羅針',
      q: '学生在选课时形成期待，却要到很久之后才真正理解课程目标。',
      a: '参与问卷与访谈分析，整理画像、用户旅程与服务蓝图，把需求落到课程预览、选择调整与朋辈支持等触点。',
      r: '形成兴趣导向的设计教育服务概念，区分选课与作业支持两条路径。',
      key: 'growth-concept-poster', art: 'folio-repair/growth-compass-flat-v1',
      videos: [{ src: 'growth-concept.mp4', poster: 'growth-concept-poster', title: '服务概念视频', note: '原项目概念影片。' }],
      ch: {
        1: { module: 'journey', image: 'growth-canvas-original', caption: '作业逻辑画布 · 概念界面。' },
        4: { image: null, gallery: [['folio-repair/growth-system-page32', '服务系统图 · 原方案高清页（箭头方向保留原义）'], ['folio-repair/growth-system-page38', '服务系统图 · 原方案高清页']], wide: true }
      }
    },
    looplab: {
      en: 'SERVICE PRODUCT', team: '团队项目', jp: '循環',
      q: '设计学生的材料获取、闲置流转与制作预约，分散在好几个渠道里。',
      a: '承担桌面与竞品研究，对照五类相邻产品机制；整理需求、服务流程与商业模式之间的关系。',
      r: '交付五类 MVP 模块与线上线下服务方案。',
      key: 'loop-source-09', art: 'folio-repair/looplab-flat-v1',
      ch: {
        1: { module: 'loopHub', image: 'loop-source-10', caption: 'MVP 模块界面。' },
        2: { module: 'loopFlow', image: 'loop-source-11', caption: '线下履约流程。' }
      }
    }
  };

  /* Apply: order by track, renumber, merge brief and chapter overrides. */
  const order = P.tracks.flatMap(t => t.ids);
  P.projects = order.map(byId).filter(Boolean);
  P.projects.forEach((p, i) => {
    p.number = String(i + 1).padStart(2, '0');
    p.track = P.tracks.find(t => t.ids.includes(p.id));
    const b = briefs[p.id] || {};
    p.brief = b;
    if (b.chapters) p.chapters = b.chapters;
    if (b.videos) p.videos = (p.videos || []).concat(b.videos);
    Object.entries(b.ch || {}).forEach(([k, add]) => {
      const c = p.chapters[k];
      if (!c) return;
      Object.entries(add).forEach(([key, v]) => {
        if (v === null) delete c[key];
        else if (key === 'image' && c.image && add.image) c.image = v;
        else c[key] = v;
      });
    });
  });
})();
