/* Artemis · 2026-10-13 rebuild.
   Evidence: H:/final Unity scripts, F:/游戏PV project films.
   Seven acts: world -> gameplay -> hex tile + backpack -> state machine -> characters -> UI -> cutscene CG.
   Every block has a stable id; pages/artemis.js looks blocks up by id, never by index. */
(window.SCENES = window.SCENES || {})['artemis'] = {
  theme: 'operator', key: 'artemis-boss', keyCap: '第一场 Boss 战 · 游戏实机',
  sub: '月亮碎裂之后，我们仍然选择重返星海。',
  meta: [['YEAR', '2025.09—2026.01'], ['FORMAT', '航天探索与战斗游戏 · 课程团队作品'], ['ROLE', '战斗机制设计与 Unity / C# 开发 · 主角与敌人状态机 · 理念宣传片', 1], ['TOOLS', 'Unity / C# · 状态机 · 战斗设计 · 场景交互', 1]],
  stripB: '角色行为 · 构筑与战斗',
  logline: {
    q: '月亮碎裂，地面重建了秩序。探索者离开塔楼，在废土寻找零件，尝试重新发射火箭。这段旅程由探索、构筑和战斗三部分支撑。',
    a: '我负责战斗机制设计与 Unity / C# 实现：主角和敌人的状态机与行为逻辑，两类机制精英敌人（盾枪阶段切换、钩爪位移），以及两场 Boss 战。两场完整 Boss 战的全流程全场景全建模设计由我完成，包括状态机的维护与玩家状态的协同化处理，其中一场是含攻击、格挡、处决的全 3D 战斗。游戏理念宣传片由我独立制作。',
    r: '团队做出了覆盖探索、背包构筑、遭遇战与 Boss 战的可演示游戏；我交付其中的战斗模块和理念宣传片。页面里的规则图对照 Unity 工程重绘，角色、美术与影片使用项目已有素材。'
  },
  stats: [['2 类', '机制敌人'], ['2 场', 'Boss 战'], ['HEX', '移动 / 构筑 / 预警'], ['4 支', '实机 · 过场 · 理念片']],
  home: {
    tag: '探索 · 构筑 · 战斗', thumbs: ['artemis-world', 'artemis-build'],
    jump: [['月亮碎裂之后', 'world'], ['地块与背包的共同结构', 'question'], ['人物与战斗机制', 'combat']],
    tools: 'UNITY / C# · 状态机 · 战斗设计'
  },
  acts: [
    {
      id: 'world', toc: '世界观', kicker: '01 / WORLD',
      title: '月亮碎裂之后，\n还有人要去星空。',
      open: { img: 'composition/artemis-cg-fall', cap: '过场 CG · 坠落后的地景', rail: 'RETURN TO THE STARS' },
      lead: '灾变、重建、集体的承诺与个人的异议，构成出发前的世界。废土上的行动指向一次新的发射。',
      blocks: [
        { id: 'world-story', text: ['过场一里，月面碎裂，建筑重新竖起，人群围向同一束光。实验室里的探索者留下另一个选择：离开既定秩序，重新尝试太空探索。', '玩法延续这个问题。玩家在地面搜集零件、编辑组合，在遭遇战里检验自己的操作与构筑。火箭的拼装给这条旅程一个明确的目标。'] },
        { id: 'fall-space', module: 'artemisFall', opt: {
          frame: 'assets/artemis/fall-scene.webp', time: '02:55.3',
          seq: [['assets/artemis/seq/fall-1.webp', '02:53.6'], ['assets/artemis/seq/fall-2.webp', '02:54.3'], ['assets/artemis/seq/fall-3.webp', '02:55.3'], ['assets/artemis/seq/fall-4.webp', '02:56.0'], ['assets/artemis/seq/fall-5.webp', '02:56.7']],
          layers: [
            { k: 'FRONT', n: '前景', h: '宇航员', box: [55, 57, 38, 43], p: '白色线稿的宇航员坐在右下角，头盔和背包最亮。人物从上一镜头的黑底里淡入，停在砖墙前面。' },
            { k: 'MID', n: '中景', h: '窗外的发射场', box: [27.5, 0, 46.5, 33], p: '墙上的窗口里是发射架与火箭。窗口从画面上沿进入，向中央移动，同时人物从下沿离开，镜头从人物转向发射设施。' },
            { k: 'BACK', n: '后景', h: '砖墙与侧光', box: [0, 0, 100, 100], p: '深蓝砖墙和两侧暗影构成背景。背景的亮度压低，让线稿人物与窗外的发射场都能读出来。' }
          ] } },
        { id: 'world-source', note: '画面截自理念宣传片 02:53—02:57。影片中的航天历史镜头属于引用资料，与虚构世界分开阅读。' }
      ]
    },
    {
      id: 'architecture', toc: '玩法与架构', kicker: '02 / GAMEPLAY',
      title: '玩法与架构',
      lead: '玩家在六边形地图上移动、拾取零件，在背包里组合效果，在遭遇战中检验结果。我负责角色行为、敌人机制和对应的场景交互。',
      blocks: [
        { id: 'loop', module: 'artemisLoop', opt: { steps: [
          { k: '01', t: '探索', img: 'assets/artemis/gameplay-terrain.webp', tc: '实机 00:37', h: '地图提供路径与拾取位置', p: 'Hex 地图限定可走的格子和资源所在的位置。拾取到的零件进入背包，下一次组合有了新的选择。', c: 'HexSystem / MapCell / Inventory' },
          { k: '02', t: '构筑', img: 'assets/artemis/gameplay-pack.webp', tc: '实机 01:18', h: '连接关系决定输出', p: '按 TAB 进入编辑，槽位里的零件出口边对上相邻零件的入口边才会相连。根节点触发后，修饰数据沿连接继续传递。', c: 'BackpackSlot / BulletModifierData' },
          { k: '03', t: '战斗', img: 'assets/artemis/boss2-173.webp', tc: '实机 02:53', h: '遭遇战检验当前组合', p: '预警和命中检查给玩家反馈，构筑参数由武器接收。战斗之后回到探索，继续调整组合。', c: 'GunItem / Elite1 / Elite2' }
        ] } },
        { id: 'architecture-map', module: 'artemisSystem', opt: {
          nodes: [
            { k: 'INPUT', n: '动作意图', c: 'WASD · TAB · 鼠标', code: 'PlayerMovement', p: '键鼠输入转成移动目标和构筑指令。左键、右键分别触发背包的根节点与下一层。' },
            { k: 'WORLD', n: '空间与资源', c: 'Hex · Slot · Inventory', code: 'HexSystem / MapCell / BackpackSlot', p: '同一套六边形邻接关系连接地块、槽位和零件存取，规定动作能否执行。' },
            { k: 'STATE', n: '角色状态', c: 'Idle · Start · Loop · End', code: 'PlayerIdleState / PlayerMoveStartState / PlayerMoveLoopState / PlayerMoveEndState', p: '路径提交后切换状态，动画结束事件决定何时进入下一状态。' },
            { k: 'BUILD', n: '构筑效果链', c: 'Root · Neighbor · Effect', code: 'BackpackSlot.TriggerTreeCoroutine / ItemComponent / BulletModifierData', p: '从根节点出发，修饰数据的副本沿相邻零件传播，能量不足时当前分支停止。' },
            { k: 'ENEMY', n: '敌人行为', c: '预警 · 命中 · 阶段', code: 'Elite1TransformState / Elite2HookState', p: '精英一在条件满足时变身；精英二缓存射线格子，前摇结束后核对玩家位置。' },
            { k: 'PRESENT', n: '视听反馈', c: '动画 · UI · 场景', code: 'GunItem / Animancer / UI', p: '状态、效果和攻击的结果在画面、界面和场景里给出反馈。' }
          ],
          edges: [['INPUT', 'WORLD', '目标'], ['WORLD', 'STATE', '路径'], ['WORLD', 'BUILD', '槽位'], ['WORLD', 'ENEMY', '格子'], ['STATE', 'PRESENT', '动作'], ['BUILD', 'PRESENT', '效果'], ['ENEMY', 'PRESENT', '攻击反馈']] } },
        { id: 'architecture-source', note: '依据 HexSystem、BackpackSlot、角色状态机、Elite1 / Elite2 与 GunItem。六个职责区是页面归纳，工程中不存在六个独立子系统；连线表示依赖和输出。' }
      ]
    },
    {
      id: 'question', toc: '地块与背包', kicker: '03 / HEX TILE × BACKPACK',
      title: '六边形地块\n与背包槽位',
      open: { stage: 'artemis', label: 'HEX 13 × 9', cap: '地形为规则示意，点一块地面，主角沿六邻格走过去。' },
      lead: '地图上的相邻格决定移动和拾取，背包里的相邻槽位决定零件怎样连接。两个界面共用六边形的邻接关系。',
      blocks: [
        { id: 'hex-dual', module: 'artemisHexDual' },
        { id: 'hex-shots', module: 'artemisHexShots', opt: {
          map: ['assets/artemis/gameplay-terrain.webp', '地块 · 实机 00:37', '橙色六边形铺满行走区域，粉红圆点是目标标记。'],
          pack: ['assets/artemis/pack-parts.webp', '背包 · 实机 01:20（局部）', '大六边形是已放入的零件，六个边上的白色菱形是连接口；小六边形是空槽。'] } },
        { id: 'build', module: 'artemisBuild' },
        { id: 'parts', module: 'artemisParts' },
        { id: 'hex-source', note: '依据 HexSystem、BackpackSlot、BulletModifierData、StatModifierItem、TeleportItem。零件图标取自项目素材；槽位拓扑与耗能是标注的执行示例，不是游戏平衡参数。' }
      ]
    },
    {
      id: 'logic', toc: '状态机', kicker: '04 / STATE MACHINE',
      title: '角色状态机',
      lead: '主角的移动在这里完整讲一遍。路径队列保存目标，动画结束事件推动状态切换，移动中收到新路径不会重新起步。',
      blocks: [
        { id: 'move-states', module: 'artemisStates', opt: { states: [
          { k: 'IDLE', t: '待机', cls: 'PlayerIdleState', enter: '角色初始化，或停步动画结束。', run: '播放待机动画，注册移动、跳跃等输入监听。', exit: '有效 Hex 路径提交后切入起步。' },
          { k: 'START', t: '起步', cls: 'PlayerMoveStartState', enter: 'SetHexPath 写入目标；当前不在起步或持续移动时进入。', run: '播放起步动画，朝路径目标调整方向与速度。', exit: '起步动画的 OnEnd 回调进入持续移动；公共逻辑同时检查路径结束。' },
          { k: 'LOOP', t: '持续移动', cls: 'PlayerMoveLoopState', enter: '起步动画结束，播放循环移动动画。', run: '跟随 currentHexTarget；距离小于 0.4 个世界单位时检查队列，有后续点就继续取点。', exit: '最后目标到达且队列为空时进入停步；导航失效时也检查停止。' },
          { k: 'END', t: '停步', cls: 'PlayerMoveEndState', enter: '最后目标到达，或导航结束。', run: '根据前脚位置选择左脚或右脚停步动画；近墙时使用靠墙结束动作。', exit: '结束动画的 OnEnd 回调返回待机。新路径可以重新发起起步。' }
        ] } },
        { id: 'state-separation', list: [['路径队列', 'SetHexPath 保存目标队列。移动中的新路径更新目标，不重新播放起步动画。'], ['状态生命周期', 'ChangeState 执行旧状态 OnExit 和新状态 OnEnter；输入监听在进入、退出时注册与清理。']], cols: 2 },
        { id: 'state-source', note: '依据 PlayerIdleState、PlayerMoveStartState、PlayerMoveLoopState、PlayerMoveEndState 与公共移动逻辑。到达阈值为 0.4 世界单位；跳跃、攀爬、落地分支未画出。上方演示的时长是示意值。' }
      ]
    },
    {
      id: 'combat', toc: '人物与机制', kicker: '05 / PERSONNEL FILE',
      title: '人物与机制',
      lead: '探索者携带工程装备；重甲守卫配盾与短枪；机械敌人使用钩爪。每个角色的造型和它的机制放在同一张档案里。',
      blocks: [
        { id: 'player-design', fig: 'composition/artemis-hero', cap: '探索者 · 工程装备与琥珀色面罩的宇航员' },
        { id: 'player-mechanism', text: ['探索者的工程装备与宇航员面罩贯穿世界观。角色在地块上移动、拾取资源，并把背包组合用于战斗。主角状态机管理动作衔接，地图与槽位规则限定动作发生的条件。'] },
        { id: 'elite1-design', fig: 'folio-repair/artemis-elite1-design', cap: '精英一 · 重甲、管线、盾与短枪的角色设定' },
        { id: 'elite1-rule', text: ['canTransform、尚未变身、血量比例达到配置门槛，三个条件同时满足才进入变身。变身期间开启无敌，完成后开盾，再按距离、弹药与冷却选择射击待机、换弹、近战、追击或待机。退出时撤掉无敌。'] },
        { id: 'elite1-lab', module: 'artemisElite1' },
        { id: 'elite1-motion', charts: { title: '精英一的动作帧', items: [
          { label: '持盾', chart: { type: 'crop', src: 'assets/folio-repair/artemis-elite1-motion-sheet.webp', iw: 1800, x: 0, y: 270, w: 1800, h: 280, alt: '精英一持盾动作帧' }, p: ['抬盾与持盾姿态。变身完成后调用 EnableShield。'] },
          { label: '射击', chart: { type: 'crop', src: 'assets/folio-repair/artemis-elite1-motion-sheet.webp', iw: 1800, x: 0, y: 552, w: 1800, h: 270, alt: '精英一瞄准、射击与端枪动作帧' }, p: ['瞄准、射击与端枪动作；是否进入射击由范围、冷却与弹药共同判断。'] },
          { label: '状态变化', chart: { type: 'crop', src: 'assets/folio-repair/artemis-elite1-motion-sheet.webp', iw: 1800, x: 0, y: 825, w: 1800, h: 307, alt: '精英一发光、受击与消失动作帧' }, p: ['发光、受击与消失的动作素材。'] }
        ] } },
        { id: 'elite2-design', fig: 'folio-repair/artemis-elite2-design', cap: '精英二 · 三角头部、外露关节与机械轮廓' },
        { id: 'elite2-rule', text: ['发现玩家后检查近战、钩爪距离和冷却。进入钩爪状态时停止移动并转向玩家，记录射线格子。前摇结束时只对仍在这些格子里的玩家执行拉拽。后摇结束或状态中断，预警格与协程都会清理。'] },
        { id: 'elite2-lab', module: 'artemisElite2' },
        { id: 'boss-pair', module: 'artemisBoss', opt: {
          boss1: ['artemis-boss', 'Boss 一', '六边场地中的触手与范围攻击。红色格子是攻击范围，处理触手才有机会攻击本体。'],
          boss2: [
            ['assets/artemis/boss2-183.webp', '实机 03:03', '远处的 Boss 站在栈桥另一端，玩家沿栈桥接近。'],
            ['assets/artemis/boss2-192.5.webp', '实机 03:12', '粉色笔触是挥击特效，Boss 悬在半空向玩家俯冲。'],
            ['assets/artemis/boss2-203.webp', '实机 03:23', '近身交手，玩家举着发光的长刃，Boss 披着紫色斗篷。']
          ] } },
        { id: 'combat-source', note: '机制依据 Elite1IdleState、Elite1TransformState 与 Elite2HookState。血量门槛、距离、冷却和前后摇时长做成可配置参数，演示里的数值取自 Elite1SO、Elite2SO 的默认值，关卡内以实际配置为准。我完成了两场完整 Boss 战的全流程全场景全建模设计，包括状态机的维护与玩家状态的协同化处理：Boss 一围绕触手和范围攻击展开，Boss 二是全 3D 动作战斗，包含攻击、格挡与处决。Boss 二的三帧截自实机录屏 03:03、03:12、03:23。角色设定与动作帧使用项目美术素材。' }
      ]
    },
    {
      id: 'ui', toc: '界面', kicker: '06 / INTERFACE',
      title: '界面设计',
      lead: '地图 HUD 贴着场地边缘，背包界面用六边形槽位展开零件与说明，主菜单以发射场景开场。截图均来自实机录屏，编号只用来标注信息层级。',
      blocks: [
        { id: 'ui-inspector', module: 'artemisUI' },
        { id: 'ui-source', note: '三张界面均截自实机录屏；编号是页面标注，不是游戏中的按钮。' }
      ]
    },
    {
      id: 'films', toc: '过场 CG 与影片', kicker: '07 / CUTSCENE & FILMS',
      title: '过场 CG\n与影片',
      lead: '过场的构图和动态文字叙述虚构世界，理念片把玩法说明和航天历史放在一起。点缩略图或箭头切换画面，影片默认不自动播放。',
      blocks: [
        { id: 'cg-contact', module: 'artemisCG' },
        { id: 'film-player', module: 'artemisFilms', opt: { items: [
          { src: 'media/artemis-gameplay.mp4', poster: 'assets/composition/artemis-gameplay.webp', label: '实机', len: '03:50', desc: '六边形地图、背包构筑、遭遇战与两场 Boss 战。', marks: [[16, '地图'], [71, '背包'], [136, '探索'], [183, 'Boss 二']] },
          { src: 'media/artemis-cutscene-one.mp4', poster: 'assets/composition/artemis-cutscene-one.webp', label: '过场一', len: '01:27', desc: '月亮碎裂后的重建、承诺与异议。', marks: [[6, '开场文字'], [27, '断裂'], [51, '群像'], [72, '实验室']] },
          { src: 'media/artemis-cutscene-two.mp4', poster: 'assets/composition/artemis-cutscene-two.webp', label: '过场二', len: '01:41', desc: '绘制的发射场景与引用的历史航天影像交替出现。', marks: [[7, '发射'], [31, '1957 · 历史资料'], [59, '飞行资料'], [83, '登月资料']] },
          { src: 'media/artemis-concept-film.mp4', poster: 'assets/composition/artemis-concept-film.webp', label: '理念片', len: '04:32', desc: '由我独立制作，说明角色、构筑玩法、世界叙事与航天探索。', marks: [[19, '角色'], [84, '构筑'], [160, '世界叙事'], [173.5, '宇航员跌落'], [226, '航天资料']] }
        ] } },
        { id: 'film-source', note: '项目成片来自 F:/游戏PV。历史影像保留引用语境；影片里的叙事不作为玩家测试或玩法平衡的证据。' }
      ]
    }
  ],
  done: ['战斗机制设计与实现：主角和敌人的状态机、两类机制精英敌人、两场 Boss 战与场景交互。', '团队完成可演示游戏；我交付战斗模块和独立制作的理念宣传片。'],
  next: '后续检查移动提交时的格坐标与角色位置是否一致，以及路径结束、钩爪退出和阶段变化之后的清理。玩家首次上手与平衡性尚未验证。',
  links: [['观看实机 · 小红书', 'https://www.xiaohongshu.com/discovery/item/696d05a1000000000a029c7b?source=webshare&xhsshare=pc_web&xsec_token=YBHZK_W9wFOSMD3f7eMjhRpNweEZYovKwlDE4n_9wuaW4=&xsec_source=pc_share', 'blue'], ['观看理念宣传片 · Bilibili', 'https://www.bilibili.com/video/BV1BurDBCEQP/']]
};
