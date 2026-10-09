/* Unity first chapter. The newer story is intentionally not used in this case. */
(()=>{const p={
  "id": "jingwai",
  "number": "11",
  "name": "镜外",
  "cn": "改一段电影，回到现实看它留下什么。",
  "category": "game",
  "label": "独立游戏 / AI 协作制作",
  "year": "2026",
  "color": "#c86763",
  "tone": "#f3ebd7",
  "cover": "jingwai/hotel-v138",
  "coverAlt": "镜外 Unity v1.3.8 酒店实际运行画面",
  "summary": "扮演放映员，拍下线索、走进电影、搬动真实物件。救人的方式和送信的顺序，会改变回到街道后需要查证的东西。",
  "role": "独立策划与视觉把关 · AI 协作实现",
  "status": "Unity Windows 首章 Demo · v1.3.8",
  "tools": [
    "Codex / 自然语言协作",
    "Unity / C#",
    "Blender",
    "Shader / 纸本 UI"
  ],
  "metrics": [
    [
      "3 种",
      "救援办法"
    ],
    [
      "3 条",
      "原信送法"
    ],
    [
      "首章",
      "Windows 可玩 Demo"
    ]
  ],
  "intro": "我喜欢电影，也想让游戏里的摄影承担更多事情。于是我设计了一位能走进电影的放映员：他可以改变一段事故，却必须回到现实检查，自己到底留下了什么。",
  "responsibilities": [
    "定义世界观、人物关系、记忆代价和连续关卡脚本。",
    "把玩家看不懂、操作不到、结果没区别的问题拆成物件状态、按键和反馈要求。",
    "通过自然语言组织 Codex 的脚本、Blender资产、UI和渲染迭代，并核对真实引擎结果。"
  ],
  "chapters": [],
  "outcomes": [
    "交付 Unity Windows 首章与 Blender 源文件、关卡脚本、参考和验收记录。"
  ],
  "reflection": "录像、音轨编排和更深层的电影仍是后续方案。",
  "links": []
};if(window.PORTFOLIO){const a=window.PORTFOLIO.projects,old=a.findIndex(x=>x.id===p.id);if(old>=0)a.splice(old,1);const garden=a.findIndex(x=>x.id==='garden');a.splice(garden>=0?garden+1:a.length,0,p);a.forEach((x,i)=>x.number=String(i+1).padStart(2,'0'));window.PORTFOLIO.order=a.map(x=>x.id);}})();
