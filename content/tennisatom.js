(window.SCENES = window.SCENES || {})['tennisatom'] = {
  theme: 'portrait', key: 'tennis-real-5', keyCap: '真人定制影片截帧',
  sub: '不只看球打得怎样，也看见打球的这个人。',
  meta: [['YEAR', '2026'], ['FORMAT', '橙狮体育合作 · 真人定制成片'], ['ROLE', '团队统筹 · 用户研究与原型整合 · 原型创作 · 视频全栈创作 · 个性化算法架构设计 · 实地调研反馈', 1], ['TOOLS', '半结构访谈 / 主题编码 / 用户旅程 · MediaPipe 33 点姿态 / TrackNetV2 球路 · 事件交叉匹配 / ADSR 特效包络 · MatchBundle 数据契约 · OpenCV / Remotion 双路径渲染 · p5.js / three.js / WebGL · FFmpeg / 动态文字 / 声音合成', 1]],
  stripB: '团队统筹 · 橙狮体育合作',
  logline: {
    q: '运动数据很容易把一个人缩成一排指标。可球员想被看见的，也许是某一拍特别狠的击球，也许是练了好几年才有的那股劲儿。',
    a: '我统筹团队分工和用户研究；参与个性化算法架构，把姿态、球路和事件整理成一份共用的数据契约；成片从头到尾由我负责——真人影像、程序化视觉、动态文字和声音，最后剪在一起。',
    r: '5 支真人定制视频和对应的数据肖像，一套双轨制作流程和视觉系统。团队拿到同济大学设计创意学院信息可视化最佳创作奖（2026 年 6 月）。'
  },
  stats: [['5 支', '真人定制视频'], ['动作 + 影像', '个性化叙事素材'], ['7 模块', '制作管线'], ['团队获奖', '信息可视化最佳创作奖']],
  home: {
    tag: '真人影像 · 动作轨迹 · 定制成片',
    thumbs: ['tennis-poster', 'tennis-impact'],
    jump: [['为什么做“身体的肖像”', 'purpose'], ['七个模块，一份 MatchBundle', 'pipeline'], ['整个制作过程', 'output']],
    tools: 'MEDIAPIPE · TRACKNETV2 · P5.JS / THREE.JS · FFMPEG'
  },
  acts: [
    {
      id: 'films', kicker: 'FILMS / 五种肖像，两种观看', toc: '成片', title: '五种肖像，\n两种观看方式。',
      lead: '左边是真人成片，看这个人；右边是对应的数据肖像，看动作怎么变成画面。两边各放各的。',
      blocks: [
        { sub: '01 / 剪成一个人的片子', span: 'half' },
        { sub: '02 / 动作长成的画面', span: 'half' },
        { player: { title: '真人成片', items: [1, 2, 3, 4, 5].map(n => ({ src: `tennis-${n}.mp4`, poster: `tennis-real-${n}`, label: `FILM / 0${n}` })) }, span: 'half' },
        { player: { title: '数据肖像', items: [['main-v6', 'MAIN / V6'], ['chen-v2', 'CHEN / V2'], ['yang-v2', 'YANG / V2'], ['lin-v3', 'LIN / V3'], ['vivian-v3', 'VIVIAN / V3']].map(([f, l]) => ({ src: `tennis-data-${f}.mp4`, poster: `tennis-data-${f}`, label: l })) }, span: 'half' },
        { note: '一一对应：01 main / 02 chen / 03 yang / 04 lin / 05 vivian（main-v6 约 30 秒）。两边是分别做、分别审的，不是同帧同步。' }
      ]
    },
    {
      id: 'purpose', kicker: 'PURPOSE / 从记录到表达', toc: '研究与动机', title: '从记录自己，\n到表达自己。',
      lead: '先听球员说想被怎样看见，再决定怎么审、怎么发。',
      blocks: [
        { text: ['有人想留下某一拍漂亮的击球，有人想让别人看出自己这几年的打法。“身体的肖像”把动作记录和真实影像接起来，给每个人配不同的片段、文字节奏和特效。'], h: '项目背景' },
        { list: ['统筹分工、用户研究、原型和系统整合；实地调研听到的反馈，直接改进制作决定。', '参与个性化算法架构：姿态、球路、事件进同一份数据契约，再分给特效和内容生成。', '负责视频从拍到成片：真人影像、程序化视觉、动态文字、声音，全部由我合在一起。'], span: 'half' },
        { quote: '不只看打得如何，\n还看见你。', cite: 'THE PORTRAIT OF THE BODY · 借体育转播的分析语言，画的是个人：身体 BODY · 信号 SIGNAL · 叙事 STORY' },
        { sub: '球员说的话，变成了四个决定。' },
        { viz: 4, cap: '访谈编码矩阵（原汇报）：心理阻抗、识别信任、创作主权、深度负荷。' },
        { list: [['“打得不好的我不想公开”', '出口分三档：只自己看、存档、公开。'], ['“识别错了得能改”', '自动分析之后留人工修改和重做的入口。'], ['“高光我想自己挑”', '片段和风格让球员一起选。'], ['“我想知道下次怎么改”', '数据整理成看得懂的反馈，一次只给几条。']], cols: 4 },
        { note: '依据最终汇报第 7 页 S1—S4 的定性编码重排成“需求 → 决定”。这是定性归纳，不是满意度统计。' },
        { gallery: [['refinement/tennis-user-voice', '原研究 · 用户原话 — 先弄清他们为什么要看，再定画面。'], ['tennis-real-6', '真人成片截帧 — 竖屏里的动态文字和动作。']], n: 2 },
        { sub: '设计依据' },
        { list: [['先问为什么要看', '记录成长、感受动作、看懂战术、发泄情绪，要的画面不一样，所以入口先问目的。· 四类观看动机'], ['每种图形只干一件事', '轨迹讲路线，骨骼讲姿态，特效跟着动作的节奏走。· 轨迹 / 姿态 / 冲击'], ['真人是主角', '选片段、排叙事都围着这个人转，生成和特效只往真实影像上加。· 五支真人定制成片'], ['选择权在球员手里', '情绪、关键词、颜色、节奏和球员一起定。挥拍轨迹看不出一个人的性格。· 人工审看 / 媒体适配']], cols: 4 }
      ]
    },
    {
      id: 'product', kicker: 'PRODUCT / 信息何时变成画面', toc: '触发与产品', title: '什么时候，\n该给画面加特效？',
      lead: '每个特效都得有信号触发，也得知道什么时候退场。',
      blocks: [
        { module: 'tennisPaths' },
        { fig: 'tennis-product-board', cap: '产品板（原项目）：上传、分析之后分两条路——轻量版一键成片；定制版先选风格、关键词、颜色和节奏，再精修、观看、分享。', span: 'inset' },
        { sub: '三种信号，触发四种特效。' },
        { stats: [['骨骼极值', 'SOURCE 01'], ['球路变化', 'SOURCE 02'], ['音频峰值', 'SOURCE 03']] },
        { snap: { group: 4, title: '事件 → 特效', items: [
          { label: 'BALL_IMPACT', h: 'ImpactRing · 击球点出现二维半透明涟漪', p: ['骨骼加速度到极值、球路曲率突变、击球声出现峰值，三样同时满足才算一次击球。'] },
          { label: 'BALL_FLIGHT', h: 'SpeedTrail · 速度超过 100 km/h，触发高对比渐变拖尾', p: ['先用球路和时间算出速度，过了阈值，再把事件交给效果层。'] },
          { label: 'ACE_SERVE', h: 'GlitchFrame · 画幅瞬时 RGB 分色', p: ['特效按事件类型选；强弱由包络控制，和识别是两回事。'] },
          { label: 'SWING_START', h: 'FocusBox · 人体周围出现精准半包围框', p: ['动作刚开始就框住身体，先定位人，再上风格。'] }
        ] } },
        { note: '特效强度按起音、衰减、持续、释放（ADSR）四段走，图是原理示意，横轴是归一化的阶段。事件和触发条件重绘自最终汇报第 18 页；冲击图来自海报物料，上面的数字是设计元素。' }
      ]
    },
    {
      id: 'pipeline', kicker: 'PIPELINE / 一个共同输入', toc: '七模块管线', title: '一份输入，\n喂给所有输出。',
      lead: '姿态、球路、声音汇进一份 MatchBundle，再分给特效、内容和合成。',
      blocks: [
        { module: 'tennisPipeline' },
        { snap: { group: 7, title: '七个模块 · 原技术图', imgs: 1, items: [
          { label: 'M1 视频输入', h: '4K / 1080p 素材 · 时间基准', p: ['视频、帧率和时间索引是后面所有分析与合成的共同起点。'] },
          { label: 'M2 骨骼提取', h: 'MediaPipe · 33 关键点', p: ['33 点姿态，经过平滑滤波，算出关节运动特征和动作阶段。'] },
          { label: 'M3 球路分析', h: 'TrackNetV2 · 轨迹与事件', p: ['追出球路和变化点，把击球、弹跳等事件挂到时间轴上。'] },
          { label: 'M4 特效渲染', h: 'EffectDirector · OpenCV / Remotion', p: ['EffectDirector 管包络和触发；OpenCV 和 Remotion 两条渲染路径分工。'] },
          { label: 'M5 AI 内容', h: '影像 / 图文 / 旁白三路', p: ['MatchBundle 分给风格化影像、海报图文和旁白脚本，三路用的是同一份运动数据。'] },
          { label: 'M6 后期合成', h: 'FFmpeg · 多轨', p: ['真人影像、动态文字、特效、声音和字幕，在一条流程里合成。'] },
          { label: 'M7 交付', h: '输出 · 分发 · 复用', p: ['整理素材和输出规格，方便重做，也方便换平台发。'] }
        ] } },
        { note: '技术图出自“海报物料设计 / 物料 / 技术栈”1—7，模块划分对应最终汇报第 16—19、26 页。图里的参数和性能描述这次没有重新测。' }
      ]
    },
    {
      id: 'visual', kicker: 'VISUAL SYSTEM / 身体、轨迹与漫画', toc: '视觉系统', title: '身体、轨迹、漫画，\n叠在同一张画里。',
      lead: '透明图层可以随意开关，真人那一层始终在。',
      blocks: [
        { module: 'tennisLayers' },
        { gallery: [['tennis-trace', '运动轨迹 · 设计物料'], ['tennis-pose', '姿态结构 · 设计物料'], ['tennis-impact', '冲击特效 · 设计物料']], n: 3, ar: '16/10' },
        { sub: '同一份数据，四种语气。' },
        { gallery: [[10, 'SILENT ARCHIVE · 像一份安静的档案'], [11, 'KINETIC ECHO · 声音和动作一起起伏'], [12, 'TACTICAL MATRIX · 线条和角度讲判断'], [13, 'EMOTION SPLASH · 高饱和，往外炸']], n: 4, free: 1 },
        { text: '换的是语气和构图，人还是那个人，数据也还是那份数据。' },
        { viz: 14, cap: '26 秒分镜的五段节奏：0—3 s 开场钩子 FocusBox · 3—12 s 推进 SpeedTrail · 12—18 s 加速 RhythmPulse · 18—22 s 最狠的一拍 Glitch / Impact · 22—26 s 收尾 Constellation。出自最终汇报第 14 页；五支成片并不都是 26 秒。' },
        { module: 'tennisStyles' }
      ]
    },
    {
      id: 'output', kicker: 'OUTPUT / 完整制作系统', toc: '项目介绍', title: '从上传一段视频，\n到拿到成片。',
      lead: '前面看的是每个人，这一支看整套制作是怎么跑起来的。',
      blocks: [
        { video: [{ src: 'tennis-introduction.mp4', poster: 'tennis-real-7', title: '项目介绍', note: '项目介绍视频。' }], n: 1, span: 'inset' }
      ]
    }
  ],
  done: ['团队完成 5 支真人定制视频和对应的运动数据可视化。', '交付产品原型、双轨制作流程、视觉系统和个人化成片。', '同济大学设计创意学院信息可视化最佳创作奖（团队，2026 年 6 月）。'],
  next: '下一步把模板里固定的部分和因人而异的部分拆开，少做重复劳动；挑片段、排叙事这些事，还是留给人。',
    links: [['观看项目介绍 · Bilibili', 'https://www.bilibili.com/video/BV1Us3F6LEyz/', 'blue']]
};
