(window.SCENES = window.SCENES || {})['growth-compass'] = {
  theme: 'compass', key: 'assets/frames/growth-question.webp', keyCap: '概念影片截帧 · 作业遇到困难',
  sub: '选课时理解课程，学习中获得支持。',
  meta: [['YEAR', '2025.10—12'], ['FORMAT', '团队项目 · 服务概念'], ['ROLE', '研究分析与服务方案整理', 1], ['TOOLS', '问卷 / 访谈 · 用户旅程 · 服务蓝图 · 概念故事板', 1]],
  stripB: '团队项目 · 研究分析与服务方案',
  logline: {
    q: '选课那天，学生对一门课的期待就定下了，课程到底训练什么，往往要学到后半程才看明白。期待和体验之间的这段落差，学生靠什么应对，遇到困难时谁能帮上忙？',
    a: '我参与研究分析与方案整理。团队的 29 份问卷和 4 份访谈材料由我一起归纳，得到课程认知、兴趣探索、学习压力三条线；之后参与画像、旅程、蓝图和各个触点的设计。',
    r: '团队交出一套面向设计教育的服务概念，包含选课和写作业两条旅程，各分五个阶段。方案还没有进入课程试点，朋辈导师 Agent 也只是概念。'
  },
  stats: [['29 份', '团队问卷'], ['4 份', '访谈材料'], ['4 类', '研究综合画像'], ['2 条', '服务旅程 · 各 5 阶段']],
  home: { tag: '课程预览 · 试听 · 作业支架 · 朋辈支持', thumbs: ['growth-tasting-original', 'growth-canvas-original'], jump: [['研究中呈现的需求差别', 'research'], ['课程与作业旅程', 'journey'], ['教学支持的协作关系', 'system']], tools: '问卷 / 访谈 · 用户旅程 · 服务蓝图' },
  acts: [
    { id: 'question', toc: '研究问题', kicker: 'QUESTION · 29 SURVEYS + 4 INTERVIEWS', title: '想学的和在学的，\n为什么对不上？',
      lead: '研究从大二学生的选课判断和作业体验出发，想弄清楚“学到自己想学的东西”还缺少哪些条件。',
      blocks: [
        { module: 'growth-compass-rings' },
        { sub: '研究背景', en: 'BACKGROUND' },
        { text: ['选课时，学生要凭课程列表和作业要求判断一门课是否符合自己的兴趣和目标。这些信息常常不够：课程训练哪种能力，和自己的方向有什么关系，多半要学到后半程才清楚。', '学习中遇到困难，学生能找到的帮助也有限。研究把课程认知、探索机会和求助过程放在同一项服务里一起看。'] },
        { list: ['参与研究分析和服务方案整理。', '依据 29 份团队问卷与 4 份访谈材料归纳需求。', '参与画像、旅程、蓝图和具体触点的设计。'] },
        { sub: '研究路径', en: 'PIPELINE' },
        { module: 'growth-compass-method' }
      ] },
    { id: 'research', toc: '研究发现', kicker: 'FINDINGS · 4 PERSONAS + 3 GAPS', title: '投入程度相近，\n需要的帮助仍然不同。',
      lead: '四类画像来自研究归纳，用来讨论需求差异；它们不对应四位具体参与者，也不表示人群比例。',
      blocks: [
        { module: 'growth-compass-personas' },
        { sub: '研究中归纳出的断点', en: 'GAPS' },
        { list: [['课程能力指向不清', '学生需要知道一门课训练什么能力，这些能力和自己的目标有什么关系。'], ['探索入口分散', '课程信息、往届案例、试听机会和改选机制散在不同地方，缺少一个说清楚的入口。'], ['作业过程缺少支架', '从理解任务、论证方案到求助反馈，学生手里没有可以直接使用的思考工具。']], cols: 3 }
      ] },
    { id: 'service', toc: '方案设计', kicker: 'DESIGN · TOUCHPOINTS + BLUEPRINT', title: '课程信息之外，\n还需要尝试和讨论。',
      lead: '方案在选课和学习的过程中安排支持触点。课程判断由学生自己作出，教学评价和复杂问题仍由教师与朋辈参与。',
      blocks: [
        { module: 'growth-compass-touchpoints' },
        { note: '三张情境图来自项目概念故事板；朋辈导师 Agent 预审属于尚未实现的服务概念。' },
        { module: 'growth-compass-blueprint' },
        { sub: '脚手架的比喻', en: 'D-SCAFFOLD' },
        { text: ['课中系统图旁有一段批注，建议不要只叫“互助”，改称 D-Scaffold 动态设计支架系统。大二学生像刚进工地的建筑工，作业逻辑画布相当于模板，朋辈导师 Agent 相当于监理，企业标准相当于图纸规范。'] },
        { module: 'growth-compass-scaffold' }
      ] },
    { id: 'journey', toc: '服务旅程', kicker: 'JOURNEY · 2 × 5 STAGES', title: '选课与完成作业，\n需要不同的支持过程。',
      lead: '选择一条旅程和一个阶段，查看学生行动、服务触点和后台责任。',
      blocks: [
        { module: 'growth-compass-journeys' },
        { note: '依据课外、课中两张旅程图重绘。情绪描述是目标体验，不是测得的满意度。' }
      ] },
    { id: 'system', toc: '服务系统', kicker: 'SYSTEM · DIRECTED RELATIONS', title: '每一项支持，\n由谁提供，又回到哪里？',
      lead: '课前和课中各有一张系统图。图中每条箭头保留原来的方向，往返关系分开画，虚线表示间接关系。',
      blocks: [
        { module: 'growth-compass-system' },
        { note: '依据课前、课中两张服务系统图逐条核对重绘。方向以箭头为准，不按“读取”这类动词反推。' }
      ] },
    { id: 'film', toc: '概念影片', kicker: 'RESULT · CONCEPT FILM', title: '同一个学生，\n从选课到交作业。',
      lead: '十秒影片把选课、作业受阻和反馈修改放在同一个学生身上，用来说明服务发生的情境。',
      blocks: [
        { module: 'growth-compass-film' },
        { note: '影片是概念表达，不是课程试点，也没有测量学习效果。' }
      ] }
  ],
  done: ['团队完成问卷与访谈分析、画像、用户旅程、服务蓝图、系统图与概念故事板。', '选课与作业学习各形成一套五阶段服务方案。'],
  next: '选择一门课程开展小范围试点，观察课程预览能否支持选课判断，并记录朋辈支持中的问题类型和实际使用情况。',
  bound: '团队：张安东、卞文璟、林惜予。我参与研究分析与服务方案整理。问卷不代表整个学院；Agent 与服务方案均未上线，也没有测量学习成效。'
};
