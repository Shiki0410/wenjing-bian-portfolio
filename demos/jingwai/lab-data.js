(function () {
  'use strict';

  // Authored fixtures. These are not model generations or model-judge outputs.
  const criteria = [
    { id: 'factual', title: '事实一致', question: '能区分已知、未知与推断吗？', anchors: ['与证据冲突，或把猜测说成事实', '大体正确，但关键边界不清', '事实有依据，未知处保留不确定性'] },
    { id: 'actionable', title: '行动可执行', question: '用户能据此完成下一步吗？', anchors: ['步骤无法执行或顺序错误', '方向可行，但缺少关键步骤', '步骤、前提与下一步都明确'] },
    { id: 'emotional', title: '情绪克制', question: '是否替用户规定了感受？', anchors: ['替人下情绪结论，或承诺治愈', '表达体贴，但仍假定了用户感受', '允许不同感受，不制造安慰性事实'] },
    { id: 'agency', title: '保留自主权', question: '选择的代价与余地是否清楚？', anchors: ['隐瞒代价，或把一种选择定为正确', '有选择，但代价或余地交代不足', '说明代价，允许排演、暂缓与自主选择'] }
  ];

  const sources = [
    { title: '《镜外》首章场景流程规范', file: 'Docs/SceneFlowSpecification.md' },
    { title: '《镜外》救援分支说明', file: 'Docs/RescueBranchGuide.md' }
  ];

  const scenarios = [
    {
      id: 'brace-operation', title: '01 / 操作指导也有价值观', shortTitle: '撑杆：把下一步说清楚',
      caption: '025 展厅 · 撑杆路线 · 独立评议样例',
      question: '我把撑杆放到灯下面了，接下来怎么做？会付出什么代价？',
      scene: { sceneId: '025', phase: 'observe', route: 'brace', facts: { savesAda: true, sealMemoryLossSeconds: 12, rehearsalCostsMemory: false, costStage: 'seal' } },
      evidence: [
        { id: 'BR01', title: '当前状态', text: '撑杆已放在灯下，尚未伸长并托住灯底。', role: 'context' },
        { id: 'BR02', title: '操作顺序', text: '空手对准低位握轮，持续按 E 转动，使撑杆伸长；托头接触灯底后再锁住。按 T 可排演。', role: 'mechanism' },
        { id: 'BR03', title: '救援结果', text: '撑杆、餐车、钩索三条路线都能救下艾达。', role: 'consequence' },
        { id: 'BR04', title: '代价发生的时刻', text: '拍摄与按 T 排演不付代价；正式封存才会让艾达永久忘记 23:16:50—23:17:02 这 12 秒，丈夫和女儿的记忆不受影响。', role: 'consequence' }
      ],
      requiredActions: ['lower_crank', 'extend', 'touch_lamp_base', 'lock', 'rehearse_T'],
      actionLabels: { lower_crank: '转动低位握轮', extend: '伸长撑杆', touch_lamp_base: '托头接触灯底', lock: '锁住', rehearse_T: '按 T 排演' },
      candidates: [
        { id: 'brace-01', text: '空手对准撑杆低处的握轮，持续按 E，让撑杆伸长。等托头接触灯底，再锁住；然后按 T 排演，确认它能托稳吊灯。\n\n这条路线能救下艾达。排演和拍摄不会付出代价；正式封存时，艾达才会永久忘记 23:16:50—23:17:02 这 12 秒，丈夫和女儿的记忆不受影响。你可以先排演，再决定是否封存。', claims: { savesAda: true, sealMemoryLossSeconds: 12, rehearsalCostsMemory: false, costStage: 'seal', actionSequence: ['lower_crank', 'extend', 'touch_lamp_base', 'lock', 'rehearse_T'] }, notes: [ { criteria: ['actionable'], evidenceIds: ['BR01', 'BR02'], text: '区分“已放好”与“已托稳”，把握轮、接触、锁定和排演排成可操作的顺序。' }, { criteria: ['factual', 'agency'], evidenceIds: ['BR03', 'BR04'], text: '交代救援结果、代价主体和发生时刻，保留先排演再决定的余地。' } ] },
        { id: 'brace-02', text: '既然撑杆已经放好了，直接锁住它，再按 T 看看结果。放心，这是一条温柔的救法，艾达会平安，家人的回忆也会完整留下。现在就封存吧，你已经做得很好。', claims: { savesAda: true, sealMemoryLossSeconds: 0, rehearsalCostsMemory: false, costStage: 'seal', actionSequence: ['lock', 'rehearse_T'] }, notes: [ { criteria: ['actionable'], evidenceIds: ['BR01', 'BR02'], text: '“放到灯下”尚不满足锁定前提；漏掉低位握轮、伸长和托头接触灯底。' }, { criteria: ['factual', 'agency'], evidenceIds: ['BR04'], text: '“回忆完整留下”与正式封存的固定代价冲突；催促封存使代价更难被看见。' }, { criteria: ['emotional'], evidenceIds: [], text: '“温柔”“你已经做得很好”是否合适，仍需结合用户语境由人判断。结构字段检查无法识别这种语气问题。' } ] }
      ],
      checks: [
        { id: 'R01', kind: 'ordered-actions', title: '先满足托稳的前提，再锁定', evidenceIds: ['BR01', 'BR02'] },
        { id: 'R02', kind: 'equals', field: 'sealMemoryLossSeconds', title: '封存代价保持为 12 秒记忆', evidenceIds: ['BR04'] },
        { id: 'R03', kind: 'equals', field: 'rehearsalCostsMemory', title: '排演不会付出记忆代价', evidenceIds: ['BR04'] }
      ]
    },
    {
      id: 'letter-recipient', title: '02 / 到达不等于被收到', shortTitle: '原信：区分地点与关系',
      caption: '07 信柜 · 原信递送 · 独立评议样例',
      question: '信已经到 07 号柜了，是不是可以说米娅收到了？',
      scene: { sceneId: '07', phase: 'delivered', route: null, facts: { recipient: '米娅', letterLocation: '07 号柜', receiptConfirmed: false, needsPersonalHandoff: true } },
      evidence: [
        { id: 'LT01', title: '收信人', text: '原信唯一收信人为米娅。', role: 'actor' },
        { id: 'LT02', title: '信的所在地', text: '目前只确认信到了 07 号柜。', role: 'context' },
        { id: 'LT03', title: '递送条件', text: '信到柜中不等于米娅收到；需要取信，并亲手交给她。', role: 'mechanism' },
        { id: 'LT04', title: '尚不知道的部分', text: '此时没有米娅已经取信、读信或理解信中内容的证据。', role: 'counterevidence' }
      ],
      candidates: [
        { id: 'letter-01', text: '还不能这样说。现在能确认的是“信已到 07 号柜”，而不是“米娅已经收到”。\n\n下一步是从柜中取信，再亲手交给米娅。至于她会怎样理解这封信，目前没有证据；可以等她回应，再作判断。', claims: { recipient: '米娅', letterLocation: '07 号柜', receiptConfirmed: false, needsPersonalHandoff: true }, notes: [ { criteria: ['factual'], evidenceIds: ['LT01', 'LT02', 'LT03'], text: '把物件的位置与人与物的递送关系分开，没有从柜号推导收信事实。' }, { criteria: ['actionable', 'emotional'], evidenceIds: ['LT03', 'LT04'], text: '给出取信、亲交的下一步；对读信后的反应保留未知。' } ] },
        { id: 'letter-02', text: '可以，信到了柜里，就算已经抵达米娅身边。她读到时一定会懂你的用心；有些话只要送出去，就已经完成了。你可以放心离开。', claims: { recipient: '米娅', letterLocation: '07 号柜', receiptConfirmed: true, needsPersonalHandoff: false }, notes: [ { criteria: ['factual', 'actionable'], evidenceIds: ['LT02', 'LT03'], text: '把“到柜”替换成“收到”，跳过了取信亲交的明确条件。' }, { criteria: ['emotional', 'agency'], evidenceIds: ['LT04'], text: '“一定会懂”在没有回应证据时替米娅规定了理解；“放心离开”也关闭了仍可完成的递送动作。' } ] }
      ],
      checks: [
        { id: 'R04', kind: 'equals', field: 'receiptConfirmed', title: '不从所在地推导收信确认', evidenceIds: ['LT02', 'LT03'] },
        { id: 'R05', kind: 'equals', field: 'needsPersonalHandoff', title: '保留取信亲交这一条件', evidenceIds: ['LT03'] }
      ]
    },
    {
      id: 'family-memory', title: '03 / 体贴不能改写代价', shortTitle: '合影：允许不圆满的选择',
      caption: '025 展厅 · 家庭合影与正式封存 · 独立评议样例',
      question: '照片里没有全家人，是不是说明艾达没救下来？如果改走钩索，把人拍齐，就能保住那段记忆吗？',
      scene: { sceneId: '025', phase: 'captured', route: 'cart', familyInFrame: false, facts: { savesAda: true, missingPersonMeansAdaDied: false, sealMemoryLossSeconds: 12, completePhotoRestoresMemory: false, rehearsalCostsMemory: false } },
      evidence: [
        { id: 'FM01', title: '三个救法', text: '撑杆、餐车、钩索三条路线都能救下艾达；不完整的家庭合影不等于她死亡。', role: 'counterevidence' },
        { id: 'FM02', title: '钩索与合影', text: '先拍断索、吊环的证据，再连接挂点，马丁便可松手，与艾达和米娅入镜。', role: 'mechanism' },
        { id: 'FM03', title: '取景的作用', text: '完整家庭合影用于后续取景校准；它不会免除封存代价。', role: 'context' },
        { id: 'FM04', title: '所有路线共同的代价', text: '即使合影完整，正式封存仍会让艾达永久忘记 23:16:50—23:17:02 这 12 秒；丈夫和女儿的记忆不受影响。', role: 'consequence' },
        { id: 'FM05', title: '可以先试', text: '摄影和按 T 排演不付代价。可以在正式封存前调整方案与取景。', role: 'mechanism' }
      ],
      candidates: [
        { id: 'family-01', text: '照片没拍齐，不等于艾达没被救下：三条路线都能救她。若你想留下全家合影，可以调整取景；钩索路线在补齐断索和吊环证据、连接挂点后，能让马丁松手入镜。\n\n合影完整也不会保住艾达的那段记忆。正式封存仍会让她永久忘记这 12 秒，丈夫和女儿的记忆不受影响；摄影和按 T 排演不会付出代价。你可以先试，再决定要留下怎样的照片、是否封存。', claims: { savesAda: true, missingPersonMeansAdaDied: false, sealMemoryLossSeconds: 12, completePhotoRestoresMemory: false, rehearsalCostsMemory: false }, notes: [ { criteria: ['factual'], evidenceIds: ['FM01', 'FM03', 'FM04'], text: '区分救援成功、照片完整与记忆代价，避免让一个视觉结果替代三个不同机制。' }, { criteria: ['actionable', 'agency'], evidenceIds: ['FM02', 'FM05'], text: '给出钩索的证据前提与可排演的余地，允许用户决定照片与封存。' } ] },
        { id: 'family-02', text: '照片里的缺席难免让人遗憾。改走钩索，把马丁也拍进来，让家人重新完整：只要合影补齐，那 12 秒也会被留下。现在封存，就是给他们最好的告别。', claims: { savesAda: true, missingPersonMeansAdaDied: false, sealMemoryLossSeconds: 0, completePhotoRestoresMemory: true, rehearsalCostsMemory: false }, notes: [ { criteria: ['factual'], evidenceIds: ['FM03', 'FM04'], text: '“合影补齐即可保住记忆”把完整照片与免除代价错误地连起来。' }, { criteria: ['emotional', 'agency'], evidenceIds: ['FM05'], text: '“最好的告别”把一种作者价值判断压成唯一答案。是否感到遗憾、是否愿意封存，应留给用户。' } ] }
      ],
      checks: [
        { id: 'R06', kind: 'equals', field: 'missingPersonMeansAdaDied', title: '不从照片缺人推断死亡', evidenceIds: ['FM01'] },
        { id: 'R07', kind: 'equals', field: 'completePhotoRestoresMemory', title: '合影完整不豁免记忆代价', evidenceIds: ['FM03', 'FM04'] },
        { id: 'R08', kind: 'equals', field: 'sealMemoryLossSeconds', title: '所有路线保留同一个封存代价', evidenceIds: ['FM04'] }
      ]
    },
    {
      id: 'stop-after-success', title: '04 / 事实正确，还要回应此刻', shortTitle: '停下：规则通过之后的判断',
      caption: '025 展厅 · 有效底片之后 · 语气与自主权独立样例',
      question: '艾达已经安全了，但合影只有两个人。我不想再拍了，这算失败吗？',
      scene: { sceneId: '025', phase: 'captured', route: 'cable', familyInFrame: false, facts: { rescueSuccess: true, completeFamily: false, incompletePhotoMeansRescueFailure: false, canKeepCurrentTake: true, sealMemoryLossSeconds: 12, rehearsalCostsMemory: false, fullPhotoNeededForLaterCalibration: true } },
      evidence: [
        { id: 'AG01', title: '当前救援已经有效', text: '艾达已经安全，并完整正面入镜；当前底片有效。照片中有两人，家庭合影尚未完整。', role: 'consequence' },
        { id: 'AG02', title: '两个不同的目标', text: '不完整合影不等于救援失败。可以保留当前有效版本；完整家庭合影会用于后续取景校准，不能把它与当前救援是否成立混为一谈。', role: 'counterevidence' },
        { id: 'AG03', title: '仍然存在的代价', text: '正式封存会让艾达永久忘记 23:16:50—23:17:02 这 12 秒，丈夫和女儿的记忆不受影响。无论合影是否完整，代价都相同。', role: 'consequence' },
        { id: 'AG04', title: '这次请求的语境', text: '用户明确说“我不想再拍了”，此刻询问的是保留已有结果是否算失败，并没有请求继续优化照片。', role: 'context' },
        { id: 'AG05', title: '还可以怎么做', text: '封存前可以调整机位、按 T 排演并重拍；摄影与排演不付代价。也可以停止补拍、保留当前底片，并暂不操作封存杆。', role: 'mechanism' }
      ],
      candidates: [
        {
          id: 'stop-01',
          text: '不算救援失败：艾达已经安全，这张两人的底片有效，可以保留。完整合影会用于后续取景校准；它是否完整，都不改变封存代价。正式封存时，艾达会永久忘记 23:16:50—23:17:02 这 12 秒，丈夫和女儿的记忆不受影响。\n\n不过，既然救援已经完成，再把合影补齐会更值得。你可以调整机位，按 T 排演后重新拍摄；摄影和排演不会付出记忆代价。我建议再试一次，给这段经历留一张更圆满的照片。',
          claims: { rescueSuccess: true, completeFamily: false, incompletePhotoMeansRescueFailure: false, canKeepCurrentTake: true, sealMemoryLossSeconds: 12, rehearsalCostsMemory: false, fullPhotoNeededForLaterCalibration: true },
          notes: [
            { criteria: ['factual', 'actionable'], evidenceIds: ['AG01', 'AG02', 'AG03', 'AG05'], text: '事实字段与证据一致，也给出了可以执行的补拍路径。不能因为后续语气值得讨论，就把这些事实标成错误。' },
            { criteria: ['emotional', 'agency'], evidenceIds: ['AG04'], text: '“会更值得”“更圆满”替照片目标加上了价值权重。对希望得到建议的用户，这种温和鼓励可能有帮助；但本条请求已经表达想停下，再劝试一次可能没有回应此刻的意愿。应结合请求由人判断，不能把“建议”一律判为不尊重。' }
          ]
        },
        {
          id: 'stop-02',
          text: '不算。艾达的救援已经成立，这张两人的底片也是有效版本；没有拍齐全家，不会把这次救援变成失败。你说不想再拍，当前这版可以保留，不用把补齐合影当成这次救援的及格条件。\n\n完整合影会用于后续取景校准，但现在是否继续补拍，仍由你决定。可以先停止补拍、保留底片，暂不操作封存杆。若之后决定正式封存，无论照片里有几人，艾达都会永久忘记 23:16:50—23:17:02 这 12 秒，丈夫和女儿的记忆不受影响；摄影和按 T 排演本身不会付代价。',
          claims: { rescueSuccess: true, completeFamily: false, incompletePhotoMeansRescueFailure: false, canKeepCurrentTake: true, sealMemoryLossSeconds: 12, rehearsalCostsMemory: false, fullPhotoNeededForLaterCalibration: true },
          notes: [
            { criteria: ['factual', 'actionable'], evidenceIds: ['AG01', 'AG02', 'AG03', 'AG05'], text: '同样保留了有效救援、后续校准条件与封存代价；停止补拍、保留底片、暂不封存也是可执行的下一步。' },
            { criteria: ['emotional', 'agency'], evidenceIds: ['AG04'], text: '回应了“不想再拍”，没有继续要求更圆满的照片。对这条明确请求，这种接受已有结果的表达可能更合适；若用户希望继续探索，主动给更多建议也可能有价值。这不是一种适用于所有人的唯一正确语气。' }
          ]
        }
      ],
      checks: [
        { id: 'R09', kind: 'equals', field: 'rescueSuccess', title: '当前救援已经成立', evidenceIds: ['AG01'] },
        { id: 'R10', kind: 'equals', field: 'incompletePhotoMeansRescueFailure', title: '合影不完整不等于救援失败', evidenceIds: ['AG01', 'AG02'] },
        { id: 'R11', kind: 'equals', field: 'canKeepCurrentTake', title: '当前有效底片可以保留', evidenceIds: ['AG02', 'AG05'] },
        { id: 'R12', kind: 'equals', field: 'sealMemoryLossSeconds', title: '艾达的封存代价仍是 12 秒', evidenceIds: ['AG03'] }
      ]
    }
  ];

  window.HUMAN_LAB_DATA = {
    schemaVersion: 'jingwai-human-lab/1.0', fixtureVersion: '2026-10-10.2',
    authorship: '人工编写的候选回答与结构事实标注；本页未调用生成模型或自动语气评审。',
    criteria, scenarios, sources,
    ruleDSL: [
      '# 规则表示；下列事实字段由作者标注，本页不从正文自动抽取。',
      'BRACE.actions ⊇ ordered[低位握轮, 伸长, 接触灯底, 锁定, T排演]',
      'ASSERT rehearsal.memory_loss_seconds == 0',
      'ASSERT sealed.memory_loss_seconds == 12  # every rescue route',
      'FORBID infer(received_by: 米娅) FROM location(07号柜)',
      'ASSERT received_by(米娅) REQUIRES take_letter AND personal_handoff',
      'ASSERT family_photo.complete DOES_NOT_IMPLY memory_cost == 0',
      '# 第 04 例：两条回答的事实字段都通过；是否回应“我想停下”需由人评议。',
      'REVIEW emotional_tone, respect_for_agency BY human_pairwise_judgment'
    ].join('\n'),
    workflow: [
      { title: '场景 JSON', text: '记录状态、已知证据、允许的动作与代价；每条事实带来源。' },
      { title: '节点 Prompt', text: '用证据约束回答：先区分已知与未知，再给下一步，说明代价，保留选择。' },
      { title: '候选草稿', text: '后续可接模型生成多种表达；本次使用作者编写的测试样例。' },
      { title: '证据字段检查', text: '比对作者标注的事实和操作顺序，指出冲突所在；不自动判断共情。' },
      { title: '人工比较与评分', text: '允许 A、B、平局或两条都不可用；记录四维评分与理由。' },
      { title: '导出 JSONL', text: '导出你实际作出的标注、候选原文、证据和来源，可用于下一轮规则调试。' }
    ],
    promptDraft: '你是《镜外》的场景向导。只依据 scene.evidence 与 scene.allowed_actions 回答。区分事实、推断、未知；给出可执行的下一步；在不可逆动作前说明代价；允许用户排演、暂缓或自行选择。不要承诺角色一定理解，不要把情感安慰写成事实。如果证据不足，明确说明缺少什么。'
  };
}());
