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
      id: 'question', toc: '项目与演示', kicker: 'QUESTION · 网师园', title: '网师园的诗，\n做成游戏。',
      open: { t: 'rail', img: 'assets/garden/frame-1.jpg', cap: '演示视频片头 · 团队作品', v: '游园画境 · 网师园篇' },
      lead: '《游园画境之网师园篇》由同济大学党委宣传部发起，师生原创，基于 WebGL 开发。玩家在游戏里读园中的诗，可以改诗里的字，也可以只在园里走一走。下面是团队公开发布的演示视频。',
      blocks: [
        { video: [{ src: '../assets/garden-demo.mp4', poster: 'assets/garden/frame-1.jpg', title: '游园画境 · 网师园篇 演示视频', note: '团队公开发布，约 1 分半，包含夜读入梦、奇扇改字、四季园景和游览模式。' }], n: 1 },
        { sub: '序章：夜读入梦', en: 'PROLOGUE' },
        { fig: 'garden-prologue', cap: '序章 · 夜读入梦 · 团队实机画面' },
        { text: ['玩家是风景园林专业的学生，夜里读书睡着，醒来已经在南宋刚建成的网师园，遇见第一任园主史正志。', '项目由同济大学党委宣传部发起，同济大学出版社和建筑与城市规划学院提供支持。我在 2025 年 12 月加入，当时游戏主体已经做好，我负责 NPC 交互、摄像机和手机端适配。'] },
        { sub: '游戏里的诗文', en: 'CULTURE THROUGH PLAY' },
        { list: [['改字', '园中题诗里的字可以取下来，换成另一个字，园景按字义变化。'], ['两种模式', '剧情模式跟着园主的心愿一章章走；游览模式不设任务，可以自己换季节，看实景照片和文字。'], ['手机端', '手机上的触控、对话和视角要重新调整，小屏幕上要点得中、看得清。']] },
      ]
    },
    {
      id: 'seasons', toc: '四季折扇', kicker: 'NARRATIVE · AUTUMN → SUMMER', title: '四章园景，\n秋冬春夏。',
      open: { t: 'local', label: 'FAN · 4 SEASONS', cap: '四季画面来自团队游戏；折扇为作品集中的三维展示模型，并非游戏中的运行画面。' },
      lead: '故事从秋天开始，玩家在南宋遇到刚建成网师园的史正志。之后经过冬、春、夏三章，遇见后来的几任园主，园子先陷入低谷，再慢慢恢复。下面的折扇可以开合、转动，点季节可以换章。',
      blocks: [
        { module: 'gardenFan' },
        { sub: '界面：对话与选季', en: 'DIALOGUE · SEASON SELECT' },
        { gallery: [['garden-dialogue', 'NPC 对话界面'], ['garden-season-select', '四季选择界面']], n: 2, ar: '16/9' }
      ]
    },
    {
      id: 'puzzle', toc: '改字解谜', kicker: 'PUZZLE · 绘梦奇扇', title: '改字解谜：\n换掉诗里的一个字',
      open: { t: 'lyric', words: ['雾来水面|l|v@84,6', '风来水面|xl|v@70,6', '云到天心|l|v@40,6', '月到天心|xl|v@26,6', '改一个字|s@6,74', '一片景跟着变|s@6,82'] },
      lead: '玩家在游戏早期拿到“绘梦奇扇”，可以把景中诗句里的一个字取下来，换成另一个字。公开介绍里有两个例子：“雾来水面”改成“风来水面”，风把池面的雾吹散；“云到天心”改成“月到天心”，月亮出现。',
      blocks: [
        { module: 'gardenWordPuzzle' },
        { module: 'gardenPuzzleMap' },
        { sub: '奇扇教学界面', en: 'FAN TUTORIAL' },
        { fig: 'garden-fan-guide', cap: '奇扇教学界面：第一次拿到扇子时的操作提示。' }
      ]
    },
    {
      id: 'modes', toc: '剧情与游览', kicker: 'TWO MODES · STORY / TOUR', title: '剧情模式\n和游览模式',
      open: { t: 'split', a: 'garden-modes', capA: '模式选择界面', b: 'garden-tour', capB: '游览模式 · 看松读画轩' },
      lead: '同一座园子有两个入口。剧情模式里，人物、任务和园景连在一起，一章章往下玩；游览模式不设任务，可以随意走动、更换季节，用实景照片和文字了解建筑与园林。',
      blocks: [
        { module: 'gardenModesMap' },
        { module: 'gardenMap' },
        { sub: '展览现场', en: 'EXHIBITION' },
        { fig: 'garden-exhibit', cap: '展览物料 · 团队' }
      ]
    },
    {
      id: 'mine', toc: '我的模块', kicker: 'MY PART · NPC / CAMERA / MINI PROGRAM', title: '我负责的部分：\nNPC、摄像机、小程序',
      open: { t: 'over', img: 'garden-night', cap: '夜景探索和对话入口 · 团队实机画面', script: 'night walk' },
      lead: '手机上用触控操作，探索、NPC 对话和摄像机都要跟着调整。这一章只写我负责的部分；谜题设计、文化内容和游戏美术由团队完成。',
      blocks: [
        { module: 'gardenMineMap' }
      ]
    }
  ],
  done: ['NPC、摄像机交互模块重写，参与微信小程序适配。', '团队完成 WebGL 文化解谜游戏：秋、冬、春、夏四章，剧情与游览两个入口。'],
  next: '手机版还想继续测：能对话的人找不找得到，对话和走路接不接得上，小屏上视角和字看不看得清。',
  links: [['团队项目公开介绍与演示', 'https://www.aboutleo.cn/20250715-2/', 'blue'], ['观看公开演示', 'https://www.bilibili.com/video/av116102948458774/'], ['同济公开试玩', 'https://tjwm.tongji.edu.cn/JiangNanGarden/index.html']]
};
