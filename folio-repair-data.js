/* Editorial interpretation is separate from original sources and measured values. */
window.FOLIO_REPAIR = {
 'privacy-city': {
  number:'02', title:'Privacy City', strap:'PERMISSION / BEHAVIOUR / MODEL', thesis:'一次授权，\n一段决策过程。',
  deck:'把“是否同意”放回阅读、犹豫与选择的情境。网页解释规则，离线实验检查模型；两者不冒充彼此。',
  art:'assets/folio-repair/privacy-city-flat-v1.webp', artNote:'原创概念场景 / 不是游戏实机', hero:'assets/privacy-scene1.webp', heroNote:'原网页 / 模拟权限情境',
  question:'如何让抽象的授权成为可体验、可记录、可检查的选择？', boundary:'5,000 条合成样本实验；不是在线访客画像，也不是实际设备授权。',
  phases:[['情境','五类模拟请求','#chapter-1'],['记录','48 维输入','#chapter-2'],['检查','五模型比较','#chapter-3'],['交付','网页与离线实验','#project-results']],
  map:'dual', mapTitle:'同一个问题，两条不同的验证路径。', mapDesc:'上路：网页情境、阅读和选择进入规则反馈。下路：合成样本经48维特征进入离线模型和评估。虚线只表示设计参考，不表示在线推理。',
  lanes:[['WEB / 可体验原型','模拟请求','阅读与选择','规则反馈'],['OFFLINE / 可复现实验','合成样本','48 维特征','模型与评估']],
  details:[['不索取真实权限','界面中的接受／拒绝用于演示，不能等同用户的真实隐私行为。'],['同一划分再比较','五模型使用 3,500 / 750 / 750；另一个 10,000 样本基线不混入该轮。'],['把误判和信心分开','分类阈值与概率校准分别检查；高 AUC 不是授权建议。']],
  sources:[['assets/refinement/fig1_architecture.webp','原报告 / 系统架构','区分情境配置、行为记录与实验模块。','看数据怎样进入模型，而不是把模块图当成已上线服务。'],['assets/refinement/fig6_calibration_curve.webp','原报告 / 概率校准','概率与实际比例需要单独对照。','此处保留原报告图；与下方同一实验数值的关系按来源核对，不重估曲线。'],['assets/privacy-compare.webp','原界面 / 五模型导出','把排序、分类和校准放在一起读。','下方交互保留原导出值、分母和 bootstrap 区间。']],
  chapters:[['体验','先让选择发生。','操作五类模拟情境，查看选择的规则解释。'],['数据','再把记录组织起来。','输入字段可检查，网页与离线边界可见。'],['模型','比较不是一张排名表。','先看不确定性，再看阈值与概率。'],['误判','同一个分数，可能隐藏不同代价。','检查两类分母，不用准确率替代用户判断。']],
  family:'parallel evidence lanes', unit:'一个模拟权限情境或一条合成样本；两者不合并', measures:['48个输入字段','五模型导出指标','测试集750'],
  uncertainty:'合成数据的外部有效性未建立；AUC区间沿用原报告，图解不添加新因果证据。', support:['五类模拟请求与规则反馈已有网页','模型导出保留同一数据划分'], counterpoint:'真实用户的动机、阅读习惯和隐私行为可能与模拟器不同。'
 },
 tennisatom:{
  number:'03',title:'TennisAtom',strap:'BODY / SIGNAL / PERSONAL FILM',thesis:'不是一组动作。\n是一个人的肖像。',
  deck:'保留真人作为识别锚点，让动作分析、动态文字、声音与风格进入同一段表达。',hero:'assets/tennis-poster.webp',heroNote:'原项目主视觉 / 身体的肖像',secondary:'assets/tennis-real-3.webp',secondaryNote:'原真人定制影片 / 截图',
  question:'运动信息如何服务个人表达，而不把身体压成一组指标？',boundary:'透卡与分镜属于设计表达；五支真人与数据影片分别审看，不伪装为同帧同步。',
  phases:[['动机','用户研究','#chapter-1'],['信号','骨骼、球路与音频','#chapter-2'],['制作','MatchBundle','#chapter-3'],['表达','风格与视觉分层','#chapter-4']],
  map:'bundle',mapTitle:'三路依据汇合，但没有丢掉各自的来源。',mapDesc:'骨骼、球路、音频经事件交叉匹配和时间索引进入MatchBundle，交给特效、个性化内容与后期合成；这是原技术方案重绘，不是算法性能测试。',
  lanes:[['SOURCES','骨骼 / 33点','球路 / TrackNetV2','音频 / 峰值'],['OUTPUTS','特效包络','个性化内容','多轨合成']],
  details:[['事件要有共同时间','帧率、时间索引与事件字典连接三路输出，避免画面和触发错位。'],['风格不改写测量','静默档案、律动波纹、几何决策与热烈球场改变的是表达语言。'],['审看同样重要','观看动机、关键词和节奏进入制作选择；个人影片与数据影片独立计时。']],
  sources:[['assets/refinement/tennis-user-voice.webp','原研究 / 用户原话','先读观看动机，再决定视觉。','保留原话的语境；不把个案换算成无来源的比例。'],['assets/refinement/tennis-tech-4.webp','原技术图 / 特效渲染','事件、包络与渲染职责分开。','OpenCV 与 Remotion 为原方案双路径；原图表述不提升为新性能验证。'],['assets/refinement/tennis-report-20.webp','原汇报 / 四种风格','相同运动依据可以进入不同的影像语气。','风格样本是制作设计，非人格分类或自动心理诊断。']],
  chapters:[['研究','从记录自己，到表达自己。','用户原话与观看动机，决定审看和发布的方式。'],['触发','信息什么时候变成画面？','每种特效都要有信号依据和进入／退出条件。'],['架构','给多种表达一个共同输入。','七模块与原技术图逐层核对。'],['美术','身体、轨迹与漫画共同构图。','原透明图层可组合，风格仍保留真人锚点。'],['交付','让制作流程能够被接续。','从输入与分析到合成和输出，查看完整项目。']],
  family:'source-to-bundle architecture',unit:'一段个人运动素材及其时间对齐的制作事件',measures:['33点姿态','七模块原技术方案','五支个人影片'],uncertainty:'风格方案、分镜和透明素材不作为实测；算法性能未在本次重绘中重验。',support:['原技术图说明共同输入与双渲染路径','真人成片保留不同球员表达'],counterpoint:'自动分析并不能决定一个人的表达动机，仍需要审看与创作判断。'
 },
 baseball:{
  number:'04',title:'Pitch / Impact',strap:'STATCAST / FIELD / READING SCALES',thesis:'从投球，\n读到击球。',deck:'以人物建立入口，以图表检查分布，以空间返回一次表现。数据口径不因页面切换而消失。',hero:'assets/baseball-web-lab.webp',heroNote:'原数据网站 / 图表实验室',secondary:'assets/baseball-web-detail.webp',secondaryNote:'原网站 / 空间细节',
  question:'如何让大规模投打记录同时支持快速浏览和深入检查？',boundary:'四份 CSV 的单位不同；2026 只覆盖源文件时段，不作完整赛季结论。',
  phases:[['人物','建立阅读起点','#chapter-1'],['分布','字段与球种','#chapter-2'],['空间','一球与聚集','#chapter-3'],['交付','前端与数据','#project-results']],
  map:'scales',mapTitle:'阅读尺度变了，统计单位不能偷偷改变。',mapDesc:'原四份CSV进入聚合、筛选和编码。人物概览、图表实验室、空间细节分别显示自己的统计单位；结构箭头不编码性能提升。',
  lanes:[['INPUT','投手 / 逐球','打者 / 击球','球队 / 汇总'],['VIEWS','人物概览','图表实验室','空间细节']],
  details:[['浏览：先辨认人','人物章节先交代对象，再逐层展开指标，不同时推出所有图表。'],['比较：先辨认分母','按年份与球种比较，并明确有效记录数、缺失和源覆盖期。'],['检查：图形旁有数字','点位置、数值卡与累计分布互补，不能只凭动效推测表现。']],
  sources:[['assets/baseball-web-macro.webp','原网站 / 宏观视图','以球员与章节组织数据入口。','这是原前端截图，不作新的球员表现评价。'],['assets/baseball-web-lab.webp','原网站 / 实验室','指标分组与图表标题共同导航。','下方累计分布另由原逐球记录计算，保留共同轴与缺失。'],['assets/baseball-web-atlas.webp','原网站 / 数据图谱','空间组织与精确数值相邻。','图谱中的视觉聚集不能单独说明因果或效率。']],
  chapters:[['叙事','先知道正在看谁。','从人物入口进入表现，再展开时间与空间。'],['图表','一个指标，需要不止一个读法。','字段、球种、累计分布与缺失共同检查。'],['空间','让一球和一组球相互解释。','保留精确数值、图形位置与原网站入口。']],
  family:'nested reading scales',unit:'逐球、击球或球队汇总，按源表分别处理',measures:['release_speed','球种有效记录数','击球位置与结果'],uncertainty:'源文件覆盖期和缺失限制比较；网站结构图不编码数值。',support:['原CSV图表保留各自分母','宏观实验室细节三个入口已有前端'],counterpoint:'球速分布和空间聚集不能独自解释比赛结果。'
 },
 artemis:{
  number:'05',title:'Artemis',strap:'RULE / STATE / SCIENTIFIC PLAY',thesis:'把试错，\n变成可操作的规则。',deck:'探索、零件构筑与战斗让科学知识进入动作。我负责的机制通过输入、规则、状态和反馈接续起来。',hero:'assets/composition/artemis-world.webp',heroNote:'原游戏 / 世界观美术',secondary:'assets/artemis-boss.webp',secondaryNote:'原游戏实机 / Boss战',
  question:'怎样让科学试错与角色动作接成可玩的探索循环？',boundary:'游戏机制图依据原脚本与演示；概念 CG、界面提案和实机分开标记。',
  phases:[['世界','原美术与叙事','#chapter-1'],['移动','规则与状态','#chapter-2'],['构筑','能量与分支','#chapter-3'],['战斗','预警与判定','#chapter-4']],
  map:'state',mapTitle:'输入给出目标，规则决定动作何时继续。',mapDesc:'Idle、Start、Move、Stop状态依次接续。输入检查六边形邻接，SetHexPath接收目标；逻辑完成与动画完成分别处理。支线显示攻击预警与判定，不表示未提供的毫秒时长。',
  lanes:[['MOVEMENT','Idle','Start','Move','Stop'],['COMBAT','预警','判定','阶段变化']],
  details:[['不是点击就移动','邻接规则与目标路径决定输入是否有效，状态机接续动作。'],['构筑改变触发路径','根节点、下一阶段、能量与修饰模块共同决定效果如何继续。'],['预警先于伤害','精英钩爪、配置化阶段和距离／冷却条件，给玩家可读的行动窗口。']],
  sources:[['assets/composition/artemis-character-heavy.webp','原设定 / 角色造型','体块、装备与颜色建立世界识别。','原角色页保留；不恢复已经删除的角色拆装模块。'],['assets/artemis-build.webp','原实机 / 构筑界面','零件被连接为分步触发的结构。','机制解释与下方可操作的分支示例相互对应。'],['assets/composition/artemis-cg-laboratory.webp','原 CG / 实验室','叙事美术提示科学探索的环境。','CG 属于叙事设定，不冒充游戏运行画面。']],
  chapters:[['美术','让角色带着世界的痕迹。','角色设定、CG、界面与场景空间使用各自来源。'],['逻辑','一次输入，要经过几层检查。','原状态机与模块职责放在一起读。'],['构筑','连接方式决定效果如何继续。','检查能量如何沿分支传递，而不只看零件列表。'],['战斗','先看懂，再作出反应。','预警、判定和阶段变化形成可读的战斗节奏。']],
  family:'state transition with separate trigger conditions',unit:'一个游戏机制的输入与状态转换',measures:['Idle Start Move Stop状态','邻接与路径','能量分支和敌人条件'],uncertainty:'不补写帧数、伤害统计或玩家测试结果；逻辑示意不是实测时间轴。',support:['原脚本区分规则、状态和反馈','原实机与美术资产能核对'],counterpoint:'原型可演示不等于机制已平衡或玩家体验已验证。'
 },
 bronze:{
  number:'06',title:'天命：祀与戎',strap:'TWO IDENTITIES / TEN EPISODES',thesis:'她寻找父母。\n它寻找自己的名字。',deck:'把青铜器的形、纹与意放进角色、双线叙事和镜头。原设定到成片的对应关系，比风格标签更重要。',hero:'assets/bronze-ep06-5.webp',heroNote:'EP.06 原成片 / 星辰',secondary:'assets/bronze-owl-study.webp',secondaryNote:'阿鸮原造型设定 / 非剧照',
  question:'如何让文化形态、角色连续性与十集双线故事互相支撑？',boundary:'5 + 1 + 4 是剧情结构，不是观众情绪、效果测量或历史事实。',
  phases:[['双线','追查与觉醒','#chapter-1'],['人物','形态中的连续性','#chapter-2'],['器灵','形、纹与意','#chapter-3'],['镜头','参考到成片','#chapter-4']],
  map:'braid',mapTitle:'交汇改变故事，但两条身份线仍然可读。',mapDesc:'第1至5集铺陈、第6集断裂、第7至10集整合；星辰线与阿鸮线并列，节点表示剧情单元，纵向位置不是情绪强度。第9集三方融合，第10集归位与告别。',
  lanes:[['星辰 / 明线','追查父母','追寻抵达冲突','身份理解与和解'],['阿鸮 / 暗线','记忆碎片累积','阿鸮陨落','妇好显露与归位']],
  details:[['5 / 铺陈','人物追查与记忆觉醒各自推进，保留同一器物的不同理解。'],['1 / 断裂','第六集的陨落打断竞技节奏，让身份问题进入前景。'],['4 / 整合','第九集交汇与融合，第十集以归位和告别收束。']],
  sources:[['assets/bronze-xingchen-study.webp','原人设 / 考古常服','衣服、簪花与吊坠建立连续识别。','造型设定与成片分别标记，不能将设定页称为镜头截图。'],['assets/bronze-spirit-source.webp','原汇报 / 器灵原则','以器为形，以纹为肤，以意为魂。','这是角色转译原则，不以虚构角色说明真实历史。'],['assets/bronze-ep07-4.webp','EP.07 原成片 / 02:17.22','实景与二维角色混合进入新的观看语气。','按原片时间点核对镜头，风格分析不是效果测量。']],
  chapters:[['结构','同一段旅程，两条身份线。','剧集次序、转折与原成片共同阅读。'],['角色','形态变了，仍然是同一个人。','原人设与成片之间寻找可辨认的设计锚点。'],['转译','器物不是一层装饰。','用形、纹、意解释器灵的设计逻辑。'],['镜头','不同场景，需要不同的语言。','硬边、剪影和实景混合各自服务叙事。'],['制作','从稳定参考，到连续镜头。','保留剧本、角色、生成与剪辑的制作边界。']],
  family:'parallel narrative sequence',unit:'一个剧集或角色形态；非观众测量',measures:['十集次序','5+1+4剧情结构','原成片时间点'],uncertainty:'叙事分析不构成历史论证或观众反应数据。',support:['原最终汇报与剧集保留对应关系','人设与成片可逐项核对'],counterpoint:'清晰的结构不保证观众理解或文化传播效果。'
 },
 afterglow:{
  number:'07',title:'AFTERGLOW',strap:'ENVIRONMENT / GLYPH / PUBLIC SPACE',thesis:'环境的变化，\n成为字形的条件。',deck:'在同一字环骨架里组织人流、噪声、空气与风。先读轮廓，再读纹理，让代码决定的变化能够被解释。',hero:'assets/afterglow-output-a.webp',heroNote:'原项目 / 黑白 A3 视觉输出',secondary:'assets/afterglow-render-concourse.webp',secondaryNote:'原场景效果图 / 非落地照片',
  question:'环境信号如何进入字形，而不是成为信息屏的背景装饰？',boundary:'原代码内置样本用于演示，不写作实时车站实测；空间图是渲染提案。',
  phases:[['编码','四路信号','#chapter-1'],['迭代','V1 到 V4','#chapter-2'],['空间','观看尺度','#chapter-3'],['交付','代码与视觉','#project-results']],
  map:'radial',mapTitle:'同一骨架，四种变化各有职责。',mapDesc:'人流改变环幅与密度，噪声改变波瓣与扭曲，PM2.5改变字号与外圈膨胀，风改变行进与倾斜。字重由独立手动开关控制，中心盘不是数据总分。',
  lanes:[['CHANNELS','人流 / 环幅·密度','噪声 / 波瓣·扭曲','PM2.5 / 字号·膨胀','风 / 行进·倾斜'],['CONTROL','字重 / 手动','相邻样本 / 插值']],
  details:[['静态不是全部','形态编码与运动编码分开，风和噪声承担不同的动态职责。'],['V3 → V4','插值连接相邻样本，相干正弦波组织整体；显示更连续不等于测量更精确。'],['远近两个层级','公共空间远看完整轮廓，近看字形方向、密度与形变。']],
  sources:[['assets/afterglow-mapping-board.webp','原项目 / 编码图','把四路输入与字形变量逐项对应。','以 V4 原 HTML 为准；字重不是由 PM2.5 自动驱动。'],['assets/afterglow-state-board.webp','原项目 / 状态板','在同一骨架里比较低、中、高状态。','这是演示状态而非三次现场实验。'],['assets/afterglow-render-dome.webp','原渲染 / 穹顶投影','从字形细节延伸到建筑观看尺度。','渲染不作为已安装、实际客流或可读性测试证据。']],
  chapters:[['编码','每种形变，都能回到一个输入。','四路职责与原代码对应，保留手动控制。'],['迭代','从碎裂，到连贯的呼吸。','V1—V4 的问题、决定与原输出放在一起。'],['空间','字环走出屏幕之后。','A3、候车厅和穹顶分别解释观看尺度。']],
  family:'channel-to-glyph encoding anatomy',unit:'一个内置时刻样本及其渲染状态',measures:['人流噪声PM2.5风四路输入','V3与V4插值机制','手动字重'],uncertainty:'19个内置样本采集来源未再次核验；投影方案未经现场验证。',support:['原V4代码保留四路编码','原输出和建筑效果图可核对'],counterpoint:'图形连贯不等于信息已被公众准确理解。'
 },
 'growth-compass':{
  number:'08',title:'Growth Compass',strap:'EXPECTATION / SUPPORT / LEARNING JOURNEY',thesis:'把期待说清，\n把支持放对位置。',deck:'让课程先被体验，再被选择；让作业中的卡点，找到同伴、教师和工具各自能承担的支持。',hero:'assets/growth-concept-poster.webp',heroNote:'原方案 / 概念主视觉',secondary:'assets/growth-canvas-original.webp',secondaryNote:'原方案 / 逻辑画布故事板',
  art:'assets/folio-repair/growth-compass-flat-v1.webp',artNote:'原创服务情境人物 / 非参与者肖像',
  question:'课程期待与实际学习错位时，支持怎样落到具体触点？',boundary:'29 份问卷、4 份访谈材料；研究综合画像与服务概念不是上线效果。',
  phases:[['研究','期待与错位','#chapter-1'],['体验','先试再选','#chapter-2'],['触点','作业与支持','#chapter-3'],['协作','前后台角色','#chapter-5']],
  map:'service',mapTitle:'研究问题不直接跳到功能，先经过服务触点。',mapDesc:'课程期待、思路卡住和求助成本三类问题分别关联课程体验、逻辑画布和朋辈问诊；教师、学生与平台承担不同职责。连线是原方案的设计回应，不是因果估计。',
  lanes:[['FRICTIONS','期待错位','思路卡住','求助成本'],['TOUCHPOINTS','课程体验','逻辑画布','朋辈问诊']],
  details:[['课前：降低选择的信息差','课程预览与模块体验先说明意义、方式和预期，再允许调整选择。'],['课中：把问题变具体','案例库与任务逻辑画布帮助拆解卡点；AI 预审仅为方案触点。'],['协作：不把职责都交给 AI','同伴、教师和平台共同接续支持；系统地图保留前后台分工。']],
  sources:[['assets/growth-personas.webp','原研究 / 综合画像','四类画像用于解释研究中的需求差异。','不是四个真实个人肖像，也不代表总体比例。'],['assets/growth-course-journey.webp','原方案 / 选课旅程','从期待、体验到选择与调整。','图中的理想旅程不作满意度实测。'],['assets/growth-learning-journey.webp','原方案 / 学习旅程','把任务卡点与支持触点连接。','服务节点是设计提案，尚无长期学习效果证明。']],
  chapters:[['研究','先找到期待在哪里错位。','问卷、访谈与综合画像各自保留来源。'],['体验','课程先被体验，再被选择。','进入服务路径，查看三类问题如何被接住。'],['触点','支持要落在实际经过的位置。','原故事板说明试听、卡住与朋辈问诊的情境。'],['旅程','选课与作业，是相连但不同的过程。','两条旅程不合并成无来源的满意度曲线。'],['协作','一个触点，背后有多方职责。','前台体验与后台支持一起阅读。']],
  family:'evidence-to-touchpoint service map',unit:'研究问题与设计触点，不汇总为用户表现分数',measures:['29份问卷','4份访谈材料','两条原服务旅程'],uncertainty:'画像为研究综合，AI预审与服务旅程尚未上线验证。',support:['原画像和旅程说明需求与触点','后台系统图保留多角色'],counterpoint:'研究材料数量不能替代代表性或长期效果检验。'
 },
 looplab:{
  number:'09',title:'LoopLab',strap:'MATERIAL / MAKING / HANDOVER',thesis:'一次材料需求，\n不能止于一个按钮。',deck:'材料交换、制作预约、团购和项目档案通过校园取件衔接。把屏幕上的需求，接到线下的履约。',art:'assets/folio-repair/looplab-flat-v1.webp',artNote:'原创概念情境 / 非上线服务',hero:'assets/loop-source-09.webp',heroNote:'原最终汇报 / MVP 模块',
  question:'如何让校园中的材料与制作需求形成可以接续的服务？',boundary:'原需求、流程与商业模式为服务设计方案；项目档案记录照片／3D 扫描，不是库存档案。',
  phases:[['机制','五类相邻参考','#chapter-1'],['模块','五类 MVP','#chapter-2'],['交接','线上到校园','#chapter-3'],['交付','产品与商业模式','#project-results']],
  map:'blueprint',mapTitle:'线上确定需求，线下完成交接。',mapDesc:'找到材料、协商预约、确认与通知、校园取件、归档与再用五阶段分别接续屏幕操作与线下服务。项目档案记录项目资料；图的列宽相等，不表示实测耗时。',
  lanes:[['ONLINE','发现需求','协商与预约','确认与通知','取件信息','项目档案'],['OFFLINE','材料信息','制作准备','履约安排','校园交接','再用与制作']],
  details:[['先界定交易对象','材料交换与项目档案不同，余料流转不替代制作成果的记录。'],['交接要留下明确状态','谁在等待、在哪里领取、何时继续，都需要线上信息与线下职责对应。'],['通知横跨模块','通知是跨模块支撑，不把它写成第六个独立 MVP。']],
  sources:[['assets/loop-source-03.webp','原汇报 / 需求研究','先找获取与制作的具体阻碍。','原调研内容保留语境，不添加未经核实的频次。'],['assets/loop-source-09.webp','原汇报 / MVP','材料交换、预约、团购、档案与地图。','档案存放项目照片／3D 扫描；通知横跨模块。'],['assets/loop-source-11.webp','原汇报 / 线上线下旅程','一笔需求从屏幕走到校园。','这是服务流程，不把交接时间或成功率画成测量值。']],
  chapters:[['定位','借用机制，不复制整个平台。','先比较获取与履约，再界定功能边界。'],['模块','五类模块，连接一次需求。','从余料到制作，用服务对象辨认各模块职责。'],['交接','线上操作结束，服务仍要继续。','需求、履约和商业模式一起阅读。']],
  family:'two-lane handover service blueprint',unit:'一次概念服务需求及其交接阶段',measures:['五类相邻机制','五类MVP模块','线上线下交接'],uncertainty:'履约流程和商业模式为原设计方案；不添加未给出的交易统计。',support:['原MVP和旅程保留对应关系','机制比较支持模块边界'],counterpoint:'功能串联不保证线下履约可靠，仍需要运营与试点。'
 },
 garden:{
  number:'10',title:'游园画境',strap:'POEM / SCENE / CROSS-PLATFORM PLAY',thesis:'改字成景。\n穿行四季。',deck:'在网师园的四季与历史中探索，让诗句成为可操作的园景。我参与 NPC、摄像机模块和微信小程序适配。',hero:'assets/garden-autumn-overview.webp',heroNote:'团队原游戏 / 秋季实机',secondary:'assets/garden-dialogue.webp',secondaryNote:'原游戏 / NPC 对话',
  question:'文化信息如何进入解谜、对话与视角，而不只停留在说明文字？',boundary:'团队美术与个人模块职责分别说明；改字示例不与另一组截图逐字冒认。',
  phases:[['四季','秋冬春夏','#chapter-1'],['解谜','改字与园景','#chapter-2'],['模式','剧情与游览','#chapter-3'],['适配','NPC与摄像机','#chapter-4']],
  map:'seasons',mapTitle:'一条故事路径，两种观看目的，三层交互职责。',mapDesc:'故事依原次序秋冬春夏展开；剧情与游览模式分别进入解谜和文化阅读。输入、NPC与摄像机职责在微信小程序适配中分开；不表示所有美术由个人完成。',
  lanes:[['SEASONS','秋','冬','春','夏'],['ROLES','输入适配','NPC交互','摄像机视角']],
  details:[['文字带来可读的变化','选择、替换与园景反馈构成操作闭环，玩家能看到诗句如何进入环境。'],['两种模式，不同目的','剧情模式推进解谜；游览模式提供地点与文化信息，不强行共享同一节奏。'],['适配不是只缩放屏幕','保留探索、对话与视角的状态和职责，说明我参与的模块边界。']],
  sources:[['assets/garden-fan-guide.webp','原游戏 / 奇扇教学','从操作提示进入改字机制。','公开例与原截图分别保留，不伪造相同谜题状态。'],['assets/garden-tour.webp','原游戏 / 游览模式','场景照片与知识说明接在一起。','文化材料来自团队原界面，不另补未经查证的历史断言。'],['assets/garden-night.webp','团队实机 / 探索场景','场景探索、NPC 和视角共同接续。','我负责的模块与团队整体成果分别说明。']],
  chapters:[['叙事','从一次入梦，走进四季。','原序章、对话和游戏场景解释入口。'],['机制','文字成为可操作的园景。','教学、替字与反馈放在同一读法中。'],['模式','解谜与游览，各有观看动机。','原游戏界面保留两个模式的区别。'],['适配','让探索在新的环境继续。','输入、NPC 与摄像机模块各自有职责。']],
  family:'ordered narrative with interaction roles',unit:'一个原游戏机制或跨端模块',measures:['秋冬春夏次序','两种模式','NPC摄像机与输入职责'],uncertainty:'未添加文化传播效果或玩家测试数据；团队原美术不改写为个人创作。',support:['原模式与奇扇教学展示机制','个人参与模块在交付处标明'],counterpoint:'可操作的文化内容还需要可用性与理解度测试。'
 }
};
