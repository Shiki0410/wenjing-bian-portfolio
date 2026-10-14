(window.SCENES = window.SCENES || {})['garden'] = {
  theme: 'garden',
  key: 'garden-autumn-overview', keyCap: '秋季园景 · 团队实机画面',
  sub: '网师园篇 · 诗里的字，园中的景。',
  meta: [['YEAR', '2025.12—2026.01'], ['FORMAT', '网师园科普互动游戏 · 同济团队 WebGL 作品'], ['ROLE', '交互体验设计与模块开发 · NPC 交互与摄像机模块重写 · 微信小程序适配', 1], ['TOOLS', 'WebGL 游戏 · NPC 对话 · 摄像机 · 微信小程序', 1]],
  stripB: '同济团队 · 个人负责 NPC / 摄像机 / 小程序适配',
  logline: {
    q: '网师园的诗文和匾额大多留在展板与说明牌上。团队希望游客能在园子里读到诗，再亲手改一个字，看园景怎样回应。',
    a: '2025 年 12 月到 2026 年 1 月，我加入后续开发：重写 NPC 交互和摄像机模块，理顺移动输入、对话触发和视角切换之间的关系，让玩家能在场景探索、NPC 对话和返回探索之间连续操作；并参与网页版向微信小程序的适配部署，把 NPC 与摄像机功能移植过去。',
    r: '团队完成一款 WebGL 文化解谜游戏，包含秋、冬、春、夏四章和剧情、游览两种入口。作品入选教育部 2025 年高校“礼敬中华优秀传统文化”宣传教育活动“数智未来”焕活传统文化案例。'
  },
  stats: [['4 章', '秋 · 冬 · 春 · 夏'], ['2 个入口', '剧情解谜 / 自由游览'], ['3 项', '个人负责：NPC · 摄像机 · 小程序'], ['入选', '教育部“数智未来”案例']],
  home: {
    tag: '四季园景 · 绘梦奇扇 · 跨端交互',
    thumbs: ['garden-fan', 'garden-summer'],
    jump: [['四季折扇', 'seasons'], ['移字换景', 'puzzle'], ['我的交互模块', 'mine']],
    tools: 'WEBGL · NPC 对话 · 摄像机 · 微信小程序'
  },
  acts: [
    {
      id: 'question', toc: '项目与演示', kicker: 'QUESTION · 网师园', title: '说明牌上的园林，\n拿在手里玩。',
      open: { t: 'rail', img: 'assets/garden/frame-1.jpg', cap: '演示视频片头 · 团队作品', v: '游园画境 · 网师园篇' },
      lead: '《游园画境之网师园篇》由同济大学党委宣传部发起，师生原创、基于 WebGL 开发。玩家在游戏里读诗、改字，也可以只在园中走一走。下面是团队公开发布的演示视频。',
      blocks: [
        { video: [{ src: '../assets/garden-demo.mp4', poster: 'assets/garden/frame-1.jpg', title: '游园画境 · 网师园篇 演示视频', note: '团队公开发布，约 1 分半，包含夜读入梦、奇扇改字、四季园景和游览模式。' }], n: 1 },
        { sub: '一个学园林的学生，梦回南宋。', en: 'PROLOGUE' },
        { fig: 'garden-prologue', cap: '序章 · 夜读入梦 · 团队实机画面' },
        { text: ['玩家是风景园林专业的学生，夜里读书睡着，醒来已经在南宋刚建成的网师园，遇见第一任园主史正志。', '项目由同济大学党委宣传部发起，得到同济大学出版社和建筑与城市规划学院的支持。我加入的时间在后期：游戏主体已经成形，我负责让它在更多设备上走得通。'] },
        { sub: '诗文怎样参与游园？', en: 'CULTURE THROUGH PLAY' },
        { list: [['诗里的字可以改', '园中题诗里的字可以取下来换成另一个字，园景随字义变化。'], ['剧情和游览各有入口', '剧情模式跟着园主的心愿一章章走；游览模式不设任务，可以自己换季节、看实景照片和文字。'], ['跨端之后要重新核对', '触控、对话和视角在手机上要重新对一遍，小屏幕上也要点得中、看得清。']] },
      ]
    },
    {
      id: 'seasons', toc: '四季折扇', kicker: 'NARRATIVE · AUTUMN → SUMMER', title: '醒来在南宋的园子里，\n一路走到夏天。',
      open: { t: 'local', label: 'FAN · 4 SEASONS', cap: '四季画面来自团队游戏；折扇为作品集中的三维展示模型，并非游戏中的运行画面。' },
      lead: '故事从秋天开始：玩家见到初建网师园的史正志。之后穿过冬、春、夏，遇见一任任园主，园子经历低谷，又慢慢兴盛起来。四张画面就是四章的开场，折扇可以开合，也可以换章。',
      blocks: [
        { module: 'gardenFan' },
        { sub: '对话和选季。', en: 'DIALOGUE · SEASON SELECT' },
        { gallery: [['garden-dialogue', 'NPC 对话界面'], ['garden-season-select', '四季选择界面']], n: 2, ar: '16/9' }
      ]
    },
    {
      id: 'puzzle', toc: '改字解谜', kicker: 'PUZZLE · 绘梦奇扇', title: '改一个字，\n雾就散了。',
      open: { t: 'lyric', words: ['雾来水面|l|v@84,6', '风来水面|xl|v@70,6', '云到天心|l|v@40,6', '月到天心|xl|v@26,6', '改一个字|s@6,74', '一片景跟着变|s@6,82'] },
      lead: '玩家很早拿到“绘梦奇扇”，可以把景中诗句里的字取下来换掉。公开介绍给出两个例子：“雾来水面”改成“风来水面”，清风吹散池上的雾；“云到天心”改成“月到天心”，月亮出来了。',
      blocks: [
        { module: 'gardenWordPuzzle' },
        { module: 'gardenPuzzleMap' },
        { sub: '第一次拿到扇子。', en: 'FAN TUTORIAL' },
        { fig: 'garden-fan-guide', cap: '奇扇教学界面：第一次拿到扇子时的操作提示。' }
      ]
    },
    {
      id: 'modes', toc: '剧情与游览', kicker: 'TWO MODES · STORY / TOUR', title: '想解谜，\n还是只想逛逛？',
      open: { t: 'split', a: 'garden-modes', capA: '模式选择界面', b: 'garden-tour', capB: '游览模式 · 看松读画轩' },
      lead: '同一座园子有两个入口。剧情模式里，人物、任务和园景连在一起；游览模式不设任务，可以随意走动、更换季节，用实景照片和文字了解建筑与园林。',
      blocks: [
        { module: 'gardenModesMap' },
        { module: 'gardenMap' },
        { sub: '展览现场。', en: 'EXHIBITION' },
        { fig: 'garden-exhibit', cap: '展览物料 · 团队' }
      ]
    },
    {
      id: 'mine', toc: '我的模块', kicker: 'MY PART · NPC / CAMERA / MINI PROGRAM', title: '搬到手机上，\n还要逛得顺。',
      open: { t: 'over', img: 'garden-night', cap: '夜景探索和对话入口 · 团队实机画面', script: 'night walk' },
      lead: '触控输入改变了玩家的操作方式，探索、NPC 对话和摄像机需要一起重新处理。这一章只讲我负责的部分；谜题设计、文化内容和游戏美术属于团队。',
      blocks: [
        { module: 'gardenMineMap' },
        { sub: '三个模块各管什么。', en: 'NPC · CAMERA · ADAPTATION' },
        { tabs: { title: '模块说明', items: [
          { label: 'NPC · 对话与触发', h: '发现 → 接近 → 对话', p: ['园子里的人要看得出“可以说话”，说完之后还能回到探索，不卡在对话里。'] },
          { label: 'CAMERA · 视角与探索', h: '观察 → 定位 → 行动', p: ['摄像机跟着角色输入移动；从走路切到对话、再切回来时，视角不能跳，玩家要靠园景认路。'] },
          { label: 'ADAPTATION · 小程序适配', h: '网页输入 → 触控输入', p: ['参与 WebGL 网页版向微信小程序的适配部署：结合小程序的触控方式和运行环境改写交互模块，把 NPC 与摄像机相关功能移植过去。'] }
        ] } }
      ]
    }
  ],
  done: ['NPC、摄像机交互模块重写，参与微信小程序适配。', '团队完成 WebGL 文化解谜游戏：秋、冬、春、夏四章，剧情与游览两个入口。', '入选教育部 2025 年高校“礼敬中华优秀传统文化”宣传教育活动“数智未来”焕活传统文化案例（团队）。'],
  next: '手机版还想继续测：能对话的人找不找得到，对话和走路接不接得上，小屏上视角和字看不看得清。',
  links: [['团队项目公开介绍与演示', 'https://www.aboutleo.cn/20250715-2/', 'blue'], ['观看公开演示', 'https://www.bilibili.com/video/av116102948458774/'], ['同济公开试玩', 'https://tjwm.tongji.edu.cn/JiangNanGarden/index.html']]
};
