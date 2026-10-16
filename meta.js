/* Project file specs — compiled from assets/folio-repair/briefs/*.json, data.js / source-content.js
   and the original data files. Every number here was re-checked against its source. */
window.META = {
  rallylens: {
    unit: '一段双人练习片段（DPE）里的方向性事件',
    sample: '150 个双机位片段 · 2,204 个事件；可核对子集 12 个 DPE · 3 对搭档 · 160 条事件',
    measures: ['回球方向 A→B / B→A / 未知', '当场目标卡', '三天后的书面回顾', '教练读片', 'Offer / Actual 模型候选 · 0—100'],
    sources: [['论文 Fig.1 · 同一案例的两种读法', 'refinement/fig01_shared_rally'], ['论文 Fig.3 · 五路来源', 'refinement/fig03_five_sources'], ['补充 Fig.S1 · 12 个 DPE 的事件覆盖', 'refinement/figS1_dpe_coverage'], ['补充 Fig.S4 · 五个重叠窗口', 'refinement/figS4_reporting_windows']],
    limit: '留一对搭档校准后，五个维度的 Brier 与 ECE 均有改善，但换一对搭档时的区分能力只有 AUC .45—.62。模型只在同一对搭档内检索和比较事件，不拿来给人打分。',
    open: '更明确的计划能不能带回球场、换一对搭档是否同样稳定，还要更多搭档的长期使用来回答。',
    credit: ['PAPER', 'Practising Together, Understood Apart: How Amateur Badminton Partners Produce and Understand Dyadic Practice · CSCW 在投 · 共同第一作者']
  },
  'privacy-city': {
    unit: '一次模拟授权；或一条合成样本。两类单位分开统计',
    sample: '5,000 条合成样本 · 3,500 / 750 / 750 划分 · 48 个行为特征',
    measures: ['停留 / 滚动 / 点击 / 决策时间 / 最终选择', 'AUC · F1 · ECE · Brier', 'NumPy MLP · PyTorch MLP · 随机森林 · 决策树 · 逻辑回归'],
    sources: [],
    limit: '样本是合成的，模型成绩外推不到真实访客，也外推不到真实设备授权。',
    open: '真人的动机和阅读习惯可能跟模拟器差很远，下一步要在征得同意的真实任务里重测。'
  },
  tennisatom: {
    unit: '一位球员的一段素材，以及与它对齐的制作事件',
    sample: '5 支真人定制影片 · MediaPipe 33 点姿态 · 7 个技术模块',
    measures: ['姿态关键点', 'TrackNetV2 球路', '击球事件与 ADSR 特效强度', '动态文字与声音节奏'],
    sources: [],
    limit: '分镜、透卡和风格样本是设计稿；这次没有重测算法性能。',
    open: '成片保留哪些片段、发不发出去，仍由球员本人审看决定。',
    credit: ['AWARD', '同济大学设计创意学院 信息可视化最佳创作奖 · 团队 · 2026.06']
  },
  baseball: {
    unit: '逐球 / 击球 / 球队汇总，按源表分开处理',
    sample: '山本由伸投球 4,649 条（2024 · 1,474 / 2025 · 2,792 / 2026 · 383）；大谷翔平打席逐球 6,139 条（2,877 / 2,940 / 322）',
    measures: ['release_speed 出手球速', '球种与有效记录', 'plate_x / plate_z 进垒位置', 'launch_speed / launch_angle 击球初速与仰角', 'events 结果'],
    sources: [],
    limit: '数据截至 2026-04-14，2026 只是开季的一小段；四份 CSV 的单位也不一样，不能直接横比。',
    open: '球速分布和击球聚集解释不了胜负，比赛语境还没接进来。',
    credit: ['RANGE', 'Statcast 逐球数据 · 2024-03-20 — 2026-04-14']
  },
  artemis: {
    unit: '一个机制的输入与状态转换',
    sample: '主角移动 Idle / Start / Move / Stop · 2 类机制敌人 · 2 场 Boss 战',
    measures: ['六边形邻接与 SetHexPath 寻路', '背包零件的能量分支', 'Elite2 射线前摇', 'Elite1 血量阈值变身'],
    sources: [['设定 · 重装角色', 'composition/artemis-character-heavy'], ['实机 · 构筑界面', 'artemis-build'], ['精英 02 · 设定', 'folio-repair/artemis-elite2-design'], ['精英 01 · 动作帧', 'folio-repair/artemis-elite1-motion-sheet']],
    limit: '机制图按工程脚本和演示录屏整理；手上没有帧数、伤害统计和玩家测试。',
    open: '数值平衡和新玩家第一次上手会卡在哪里，还没有做玩家测试。',
    credit: ['ROLE', '个人负责战斗机制设计与 Unity / C# 实现：主角与敌人状态机、2 类机制精英敌人、2 场 Boss 战']
  },
  bronze: {
    unit: '一集成片，或一个角色形态',
    sample: '10 集 · 剧情结构 5 + 1 + 4 · B 站 9,093 / 抖音 13,878 播放（至 2026.06.16）· 每张剧照标原片时间码',
    measures: ['集序与时长', '星辰的三种形态：常服 / 战斗服 / 妇好终', '器灵三原则：以器为形 · 以纹为肤 · 以意为魂'],
    sources: [['考古常服设定', 'bronze-xingchen-study'], ['器灵设计原则', 'bronze-spirit-source'], ['EP.07 · 02:17.22', 'bronze-ep07-4']],
    limit: '5 + 1 + 4 是编剧结构，不是观众情绪曲线，也不是历史考证。',
    open: '观众能不能跟上明暗两条线，没有做过观看测试。'
  },
  afterglow: {
    unit: '一个时刻样本，以及它渲染出的字环状态',
    sample: 'V4 内置 19 个时刻样本 · 06:00 至次日 00:00 · 4 路输入',
    measures: ['人流', '噪声 dB', 'PM2.5', '风速 m/s'],
    sources: [],
    limit: '19 个样本是代码里写死的演示数据，不是上海南站实测；空间图是渲染提案。',
    open: '路人能否读懂图形，以及观看距离和现场亮度的影响，还需要到站内实测。',
    credit: ['TEAM', 'Wenjing Bian、Qianheng Zhang、Xianyue Xiao']
  },
  'growth-compass': {
    unit: '研究问题，以及它落到的服务触点',
    sample: '29 份问卷 · 4 份访谈材料 · 选课与学习两条旅程',
    measures: ['课程认知', '兴趣探索', '学习压力与求助成本'],
    sources: [['综合画像', 'growth-personas'], ['选课旅程', 'growth-course-journey'], ['学习旅程', 'growth-learning-journey'], ['课前服务系统', 'folio-repair/growth-system-page32'], ['课中服务系统', 'folio-repair/growth-system-page38']],
    limit: '画像是研究归纳；朋辈导师 Agent 和整套服务都没有上线。',
    open: '29 份问卷说明不了代表性，得放进一门真实课程里试一学期。',
    credit: ['TEAM', '课程小组 · 个人负责研究分析与服务方案整理']
  },
  looplab: {
    unit: '一次服务需求，以及它的交接环节',
    sample: '5 类相邻产品机制 · 5 类 MVP 模块 · 线上 / 线下两条泳道',
    measures: ['材料交换', '团购', '制作预约', '项目档案', '校园取件'],
    sources: [],
    limit: '需求、流程和商业模式都停在方案；没有交易数据。项目档案存的是照片和 3D 扫描，不是库存。',
    open: '线下取件靠不靠得住，要靠真实运营和试点来回答。',
    credit: ['ROLE', '个人负责竞品研究与方案表达']
  },
  garden: {
    unit: '一个游戏机制，或一个跨端模块',
    sample: '秋 → 冬 → 春 → 夏 4 章 · 剧情 / 游览 2 种模式 · 个人负责 3 个模块',
    measures: ['NPC 对话与触发', '摄像机视角', '微信小程序输入适配'],
    sources: [['游戏 · 奇扇教学', 'garden-fan-guide'], ['游戏 · 游览模式', 'garden-tour'], ['团队实机 · 夜景探索', 'garden-night']],
    limit: '美术和整体游戏属于团队；我只对列出的模块负责。',
    open: '诗句改字玩家能不能看懂，小屏幕上视角舒不舒服，都还要做可用性测试。',
    credit: ['HONOR', '教育部 2025 高校“礼敬中华优秀传统文化” · “数智未来”焕活传统文化案例 · 团队']
  },
  jingwai: {
    unit: '一次介入（救援办法），以及它在现实里留下的证据',
    sample: '首章 · 3 种救援办法 · 3 条送信办法 · Unity v1.3.8 Windows 与浏览器版',
    measures: ['封存代价：23:16:50—23:17:02 · 12 秒', '救援方法 → 证据 → 07 号检修', 'AI 输出的四项验收标准'],
    sources: [['原创结构图 · 摄影 → 介入 → 查证', 'jingwai/projection-study.svg'], ['实机 · 025 酒店', 'jingwai/hotel-v138'], ['实机 · 07 号检修台', 'jingwai/workbench-v138']],
    limit: '录像、音轨编排和更深的电影系统还在方案阶段。',
    open: '“排演可以重来、封存要付代价”，第一次玩的人能不能读懂，要靠试玩来验。'
  }
};
