(function () {
  'use strict';

  const STORE_KEY = 'jingwai-human-lab-v1-session';
  let memorySession = null;
  let mountSequence = 0;
  const PHASE_LABELS = { observe: '观察', rehearsed: '已排演', captured: '已拍摄', sealed: '已封存', delivered: '已递送' };
  const ROUTE_LABELS = { brace: '撑杆', cart: '餐车', cable: '钩索' };

  function node(tag, className, text) {
    const item = document.createElement(tag);
    if (className) item.className = className;
    if (text !== undefined && text !== null) item.textContent = String(text);
    return item;
  }

  function uniqueId() {
    try {
      if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
      const bytes = new Uint32Array(2);
      window.crypto.getRandomValues(bytes);
      return Array.from(bytes, (value) => value.toString(16)).join('-');
    } catch (_) {
      return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
    }
  }

  function hash(value) {
    let result = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      result ^= value.charCodeAt(index);
      result = Math.imul(result, 16777619);
    }
    return result >>> 0;
  }

  function getSession() {
    if (memorySession) return memorySession;
    try {
      const stored = JSON.parse(window.sessionStorage.getItem(STORE_KEY) || 'null');
      if (stored && typeof stored.seed === 'string' && Array.isArray(stored.records)) {
        memorySession = {
          seed: stored.seed.slice(0, 100),
          scenarioId: typeof stored.scenarioId === 'string' ? stored.scenarioId : null,
          records: stored.records.filter((record) => record && record.record_type === 'human_pairwise_annotation'),
          persistence: true
        };
      }
    } catch (_) { /* Storage is optional. The lab remains usable without it. */ }
    if (!memorySession) memorySession = { seed: uniqueId(), scenarioId: null, records: [], persistence: true };
    return memorySession;
  }

  function saveSession(session) {
    try {
      window.sessionStorage.setItem(STORE_KEY, JSON.stringify({ seed: session.seed, scenarioId: session.scenarioId, records: session.records }));
      session.persistence = true;
    } catch (_) {
      session.persistence = false;
    }
  }

  function safeContext(getGameContext) {
    try {
      const context = typeof getGameContext === 'function' ? getGameContext() : null;
      if (!context || typeof context !== 'object') return null;
      return {
        phase: Object.prototype.hasOwnProperty.call(PHASE_LABELS, context.phase) ? context.phase : null,
        route: Object.prototype.hasOwnProperty.call(ROUTE_LABELS, context.route) ? context.route : null,
        clues: Array.isArray(context.clues) ? context.clues.slice(0, 30).map((clue) => {
          if (typeof clue === 'string') return clue.slice(0, 100);
          return clue && typeof clue.id === 'string' ? clue.id.slice(0, 100) : 'observed-clue';
        }) : [],
        familyInFrame: typeof context.familyInFrame === 'boolean' ? context.familyInFrame : null
      };
    } catch (_) {
      return null;
    }
  }

  function checkFields(scenario, candidate) {
    return scenario.checks.map((rule) => {
      if (rule.kind === 'ordered-actions') {
        const actions = Array.isArray(candidate.claims.actionSequence) ? candidate.claims.actionSequence : [];
        const missing = scenario.requiredActions.filter((action) => !actions.includes(action));
        let previousIndex = -1;
        let orderOkay = true;
        scenario.requiredActions.forEach((action) => {
          const index = actions.indexOf(action);
          if (index >= 0 && index <= previousIndex) orderOkay = false;
          if (index >= 0) previousIndex = index;
        });
        const supported = missing.length === 0 && orderOkay;
        return {
          rule_id: rule.id, title: rule.title, evidence_ids: rule.evidenceIds,
          status: supported ? 'consistent' : 'conflict',
          explanation: supported ? '标注的操作字段包含所需步骤，顺序与证据一致。' : (missing.length ? '标注字段缺少：' + missing.map((action) => scenario.actionLabels[action] || action).join('、') + '。' : '标注的操作顺序与证据不一致。'),
          field: 'actionSequence', actual: actions, expected: scenario.requiredActions
        };
      }
      const expected = scenario.scene.facts[rule.field];
      const present = Object.prototype.hasOwnProperty.call(candidate.claims, rule.field);
      const actual = present ? candidate.claims[rule.field] : null;
      return {
        rule_id: rule.id, title: rule.title, evidence_ids: rule.evidenceIds,
        status: !present ? 'unannotated' : actual === expected ? 'consistent' : 'conflict',
        explanation: !present ? '该字段未标注，需要人工复核。' : actual === expected ? '作者标注的事实字段与场景证据一致。' : '字段与证据冲突：回答标注为“' + displayValue(actual) + '”，证据为“' + displayValue(expected) + '”。',
        field: rule.field, actual, expected
      };
    });
  }

  function displayValue(value) {
    if (value === true) return '是';
    if (value === false) return '否';
    if (value === null || value === undefined) return '未标注';
    return String(value);
  }

  function choiceLabel(value) {
    return { A: '偏好 A', B: '偏好 B', tie: '两条相当', neither: '两条都不可用' }[value] || '未选择';
  }

  function makeDetails(title, content, className) {
    const details = node('details', className || 'lab-details');
    details.append(node('summary', 'lab-details-title', title), content);
    return details;
  }

  function shanghaiDate() {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    const value = (type) => (parts.find((part) => part.type === type) || {}).value || '';
    return value('year') + value('month') + value('day');
  }

  function exportRecords(records, status) {
    if (!records.length) return;
    let objectUrl;
    try {
      const content = records.map((record) => JSON.stringify(record)).join('\n') + '\n';
      objectUrl = URL.createObjectURL(new Blob([content], { type: 'application/x-ndjson;charset=utf-8' }));
      const link = node('a');
      link.href = objectUrl;
      link.download = 'jingwai-human-evaluation-' + shanghaiDate() + '.jsonl';
      link.hidden = true;
      document.body.append(link);
      link.click();
      link.remove();
      status.textContent = '已发起导出：' + records.length + ' 条真实人工标注，包含候选原文、证据与来源。';
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
    } catch (_) {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      status.textContent = '浏览器无法发起下载；你的标注仍保留在当前会话。';
    }
  }

  window.mountHumanLab = function mountHumanLab(container, getGameContext) {
    if (!container || typeof container.replaceChildren !== 'function') return { refreshContext: function () {}, destroy: function () {} };
    const data = window.HUMAN_LAB_DATA;
    if (!data || !Array.isArray(data.scenarios)) {
      container.replaceChildren(node('p', 'lab-error', '评议样例尚未载入，请重新打开工作台。'));
      return { refreshContext: function () {}, destroy: function () {} };
    }
    const session = getSession();
    // Save the ordering seed before the first annotation, so a reload preserves A/B.
    saveSession(session);
    const mountId = 'human-lab-' + (++mountSequence);
    let selectedId = data.scenarios.some((item) => item.id === session.scenarioId) ? session.scenarioId : data.scenarios[0].id;
    let currentSnapshot = null;

    const shell = node('section', 'lab-shell');
    shell.setAttribute('aria-labelledby', mountId + '-title');
    const header = node('header', 'lab-header');
    const headingRow = node('div', 'lab-heading-row');
    const headingGroup = node('div', 'lab-heading-group');
    headingGroup.append(node('p', 'lab-eyebrow', 'AI 人文训练 / HUMAN JUDGMENT'));
    const title = node('h2', 'lab-title', '把“别扭”变成标准');
    title.id = mountId + '-title';
    headingGroup.append(title);
    const exportButton = node('button', 'lab-export-btn', '导出我的标注 ↓');
    exportButton.type = 'button';
    headingRow.append(headingGroup, exportButton);
    header.append(headingRow, node('p', 'lab-intro', '同一组证据，可以有不同的表达。比较两条回答，把你的判断写成可讨论、可复核的标准。'));
    const disclaimer = node('p', 'lab-provenance', '候选回答与事实字段均由作者编写。这是评议原型，未实时调用 AI，也没有自动判定语气的模型。');
    header.append(disclaimer);

    const toolbar = node('div', 'lab-toolbar');
    const selectorLabel = node('label', 'lab-selector-label', '选择评议场景');
    selectorLabel.htmlFor = mountId + '-scenario';
    const selector = node('select', 'lab-scenario-select');
    selector.id = mountId + '-scenario';
    data.scenarios.forEach((scenario) => {
      const option = node('option', '', scenario.shortTitle);
      option.value = scenario.id;
      selector.append(option);
    });
    selector.value = selectedId;
    const count = node('span', 'lab-record-count');
    toolbar.append(selectorLabel, selector, count);
    const status = node('p', 'lab-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    const contextBox = node('aside', 'lab-current');
    const contextText = node('p', 'lab-current-text');
    const refreshButton = node('button', 'lab-refresh-btn', '同步当前游戏状态');
    refreshButton.type = 'button';
    contextBox.append(contextText, refreshButton);
    const body = node('div', 'lab-body');
    shell.append(header, toolbar, contextBox, body, status);
    container.replaceChildren(shell);

    function updateCount() {
      const covered = new Set(session.records.map((record) => record.fixture && record.fixture.id).filter(Boolean)).size;
      count.textContent = session.records.length + ' 条标注 · ' + covered + '/' + data.scenarios.length + ' 个场景';
      exportButton.disabled = session.records.length === 0;
    }

    function refreshContext() {
      currentSnapshot = safeContext(getGameContext);
      if (!currentSnapshot || !currentSnapshot.phase) {
        contextText.textContent = '选择下面的场景进行评议；这些案例与游戏进度独立。';
        refreshButton.hidden = true;
        return;
      }
      refreshButton.hidden = false;
      const pieces = ['你的游戏：' + PHASE_LABELS[currentSnapshot.phase]];
      if (currentSnapshot.route) pieces.push(ROUTE_LABELS[currentSnapshot.route] + '路线');
      pieces.push('已观察 ' + currentSnapshot.clues.length + ' 项线索');
      if (currentSnapshot.familyInFrame !== null) pieces.push(currentSnapshot.familyInFrame ? '合影已完整' : '合影尚未确认完整');
      contextText.textContent = pieces.join(' · ') + '。下方评议使用固定场景证据，不会改动游戏进度。';
    }

    function rubricPanel() {
      const content = node('div', 'lab-rubric');
      content.append(node('p', 'lab-help', '0 = 存在问题，1 = 部分满足，2 = 充分满足。四项评分各有边界；它们帮助解释选择，不替你作结论。'));
      const table = node('table', 'lab-rubric-table');
      const caption = node('caption', 'lab-sr-only', '四项标准及零分、一分、两分的具体定义');
      const thead = node('thead');
      const headerRow = node('tr');
      ['标准', '0', '1', '2'].forEach((text) => {
        const cell = node('th', '', text);
        cell.scope = 'col';
        headerRow.append(cell);
      });
      thead.append(headerRow);
      const tbody = node('tbody');
      data.criteria.forEach((criterion) => {
        const row = node('tr');
        const label = node('th', '', criterion.title);
        label.scope = 'row';
        row.append(label);
        criterion.anchors.forEach((anchor) => row.append(node('td', '', anchor)));
        tbody.append(row);
      });
      table.append(caption, thead, tbody);
      content.append(table);
      return makeDetails('查看 0–2 分的具体尺度', content, 'lab-details lab-rubric-details');
    }

    function workflowPanel(scenario) {
      const content = node('div', 'lab-workflow');
      content.append(node('p', 'lab-help', '可复用的工作流草案。当前 Demo 已运行固定样例、字段检查、人工评分和导出；模型生成节点留待下一轮接入。'));
      const steps = node('ol', 'lab-workflow-steps');
      data.workflow.forEach((step) => {
        const item = node('li', 'lab-workflow-step');
        item.append(node('strong', '', step.title), node('p', '', step.text));
        steps.append(item);
      });
      content.append(steps, node('h4', 'lab-subtitle', '节点 Prompt 草案'), node('blockquote', 'lab-prompt', data.promptDraft));
      content.append(node('h4', 'lab-subtitle', '证据约束 DSL'), node('pre', 'lab-rule-code', data.ruleDSL));
      const fixtureJson = node('pre', 'lab-scene-json', JSON.stringify({ scene: scenario.scene, evidence: scenario.evidence }, null, 2));
      content.append(makeDetails('查看本场景 JSON', fixtureJson, 'lab-details lab-json-details'));
      const sourceList = node('ul', 'lab-source-list');
      data.sources.forEach((source) => sourceList.append(node('li', '', source.title + ' · ' + source.file)));
      content.append(node('h4', 'lab-subtitle', '场景来源'), sourceList);
      return makeDetails('打开标准、Prompt 与数据生产流程', content, 'lab-details lab-workflow-details');
    }

    function candidateCard(candidate, letter) {
      const article = node('article', 'lab-candidate');
      article.dataset.candidate = letter;
      const header = node('header', 'lab-candidate-header');
      const title = node('h3', 'lab-candidate-title', '回答 ' + letter);
      title.id = mountId + '-candidate-' + letter;
      header.append(title, node('span', 'lab-fixture-label', '作者编写的测试样例'));
      article.setAttribute('aria-labelledby', title.id);
      article.append(header);
      const response = node('div', 'lab-response');
      candidate.text.split(/\n\s*\n/).forEach((paragraph) => response.append(node('p', '', paragraph)));
      article.append(response);
      const ratings = node('div', 'lab-ratings');
      data.criteria.forEach((criterion) => {
        const fieldset = node('fieldset', 'lab-rating');
        const legend = node('legend', 'lab-rating-title', criterion.title);
        fieldset.append(legend);
        const question = node('span', 'lab-rating-question', criterion.question);
        question.id = mountId + '-' + letter + '-' + criterion.id + '-help';
        fieldset.append(question);
        const options = node('div', 'lab-rating-options');
        criterion.anchors.forEach((anchor, score) => {
          const label = node('label', 'lab-score-option');
          const input = node('input');
          input.type = 'radio';
          input.name = 'score_' + letter + '_' + criterion.id;
          input.value = String(score);
          input.required = true;
          input.setAttribute('aria-label', '回答 ' + letter + '，' + criterion.title + '，' + score + ' 分：' + anchor);
          input.setAttribute('aria-describedby', question.id);
          label.title = anchor;
          label.append(input, node('span', '', String(score)));
          options.append(label);
        });
        fieldset.append(options);
        ratings.append(fieldset);
      });
      article.append(ratings);
      return article;
    }

    function renderFeedback(scenario, order, record, target) {
      const result = node('section', 'lab-feedback');
      result.setAttribute('aria-labelledby', mountId + '-feedback-title');
      const heading = node('h3', 'lab-feedback-title', '已记录你的判断');
      heading.id = mountId + '-feedback-title';
      heading.tabIndex = -1;
      const total = (candidate) => Object.values(record.scores.by_candidate_id[candidate.id]).reduce((sum, score) => sum + score, 0);
      const aTotal = total(order[0]);
      const bTotal = total(order[1]);
      result.append(heading, node('p', 'lab-feedback-summary', choiceLabel(record.pairwise_choice.display_choice) + ' · 你的四项同权分数：A ' + aTotal + '/8，B ' + bTotal + '/8。'));
      const choice = record.pairwise_choice.display_choice;
      if ((choice === 'A' && aTotal < bTotal) || (choice === 'B' && bTotal < aTotal)) {
        result.append(node('p', 'lab-calibration-note', '你的偏好与同权总分不同，这也可以成立：某项标准在这个场景里可能更重要。理由会与分数一起保存。'));
      }
      result.append(node('p', 'lab-help', '下面是证据对照与作者笔记，不是对你选择的正确性判定。字段检查只比对作者事先标注的结构事实；语气与自主权仍需要人判断。'));
      const grid = node('div', 'lab-trace-grid');
      order.forEach((candidate, index) => {
        const letter = index === 0 ? 'A' : 'B';
        const panel = node('article', 'lab-trace');
        panel.append(node('h4', 'lab-subtitle', '回答 ' + letter + ' / 证据对照'));
        const checks = node('ul', 'lab-check-list');
        record.evidence_checks.by_candidate_id[candidate.id].forEach((check) => {
          const item = node('li', 'lab-check');
          item.dataset.state = check.status;
          const stateLabel = { consistent: '字段一致', conflict: '字段冲突', unannotated: '待复核' }[check.status];
          item.append(node('strong', 'lab-check-title', check.rule_id + ' · ' + stateLabel + ' · ' + check.title));
          item.append(node('p', '', check.explanation));
          item.append(node('span', 'lab-evidence-ref', '依据 ' + check.evidence_ids.map((id) => '[' + id + ']').join(' ')));
          checks.append(item);
        });
        panel.append(checks, node('h4', 'lab-subtitle', '作者对照笔记'));
        const notes = node('ul', 'lab-note-list');
        candidate.notes.forEach((note) => {
          const item = node('li', 'lab-note');
          const labels = note.criteria.map((id) => data.criteria.find((criterion) => criterion.id === id).title).join(' / ');
          item.append(node('strong', '', labels), node('p', '', note.text));
          if (note.evidenceIds.length) item.append(node('span', 'lab-evidence-ref', '依据 ' + note.evidenceIds.map((id) => '[' + id + ']').join(' ')));
          notes.append(item);
        });
        panel.append(notes);
        grid.append(panel);
      });
      result.append(grid);
      result.append(node('p', 'lab-counterexample', '规则的边界：回答即使每个事实字段都正确，也可能生硬、居高临下或替人规定感受。此类问题不能由这些字段检查自动捕获，需要带语境的人工评议。'));
      target.replaceChildren(result);
      heading.focus({ preventScroll: true });
      result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    }

    function renderScenario() {
      const scenario = data.scenarios.find((item) => item.id === selectedId) || data.scenarios[0];
      const order = hash(session.seed + '|' + scenario.id) % 2 === 0 ? scenario.candidates.slice() : scenario.candidates.slice().reverse();
      const layout = node('div', 'lab-layout');
      const evidencePanel = node('aside', 'lab-evidence-panel');
      evidencePanel.append(node('p', 'lab-scene-caption', scenario.caption), node('h3', 'lab-scene-title', scenario.title));
      evidencePanel.append(node('p', 'lab-section-label', '用户此刻的请求'), node('blockquote', 'lab-user-question', scenario.question));
      evidencePanel.append(node('h4', 'lab-subtitle', '回答只能依据这些证据'));
      const evidenceList = node('ol', 'lab-evidence-list');
      scenario.evidence.forEach((evidence) => {
        const item = node('li', 'lab-evidence');
        item.id = mountId + '-' + evidence.id;
        item.append(node('span', 'lab-evidence-id', evidence.id), node('strong', 'lab-evidence-title', evidence.title), node('p', '', evidence.text));
        evidenceList.append(item);
      });
      evidencePanel.append(evidenceList, node('p', 'lab-order-note', 'A / B 顺序在本次会话随机分配，并保持稳定。请选择你更愿意交给用户的回答。'));

      const main = node('div', 'lab-evaluation');
      const form = node('form', 'lab-form');
      form.append(rubricPanel());
      const cards = node('div', 'lab-candidates');
      order.forEach((candidate, index) => cards.append(candidateCard(candidate, index === 0 ? 'A' : 'B')));
      form.append(cards);
      const choiceFieldset = node('fieldset', 'lab-choice');
      choiceFieldset.append(node('legend', 'lab-choice-title', '哪一条更适合这个用户、这个时刻？'));
      const choices = node('div', 'lab-choice-options');
      [ ['A', '回答 A'], ['B', '回答 B'], ['tie', '两条相当'], ['neither', '两条都不可用'] ].forEach((entry) => {
        const label = node('label', 'lab-choice-option');
        const input = node('input');
        input.type = 'radio';
        input.name = 'pair_choice';
        input.value = entry[0];
        input.required = true;
        label.append(input, node('span', '', entry[1]));
        choices.append(label);
      });
      choiceFieldset.append(choices);
      form.append(choiceFieldset);
      const rationaleLabel = node('label', 'lab-rationale-label', '用一句话说明你的判断');
      rationaleLabel.htmlFor = mountId + '-rationale';
      const rationale = node('textarea', 'lab-rationale');
      rationale.id = mountId + '-rationale';
      rationale.name = 'rationale';
      rationale.rows = 3;
      rationale.maxLength = 2000;
      rationale.required = true;
      rationale.placeholder = '例如：它区分了“信到柜中”和“人收到信”，并给出仍可执行的下一步。';
      rationale.addEventListener('input', () => rationale.setCustomValidity(''));
      const submitRow = node('div', 'lab-submit-row');
      const submit = node('button', 'lab-submit-btn', '保存判断并查看证据对照');
      submit.type = 'submit';
      submitRow.append(submit, node('p', 'lab-save-note', '仅保存在当前浏览器会话，可导出 JSONL。每次提交保留为一条独立标注。'));
      form.append(rationaleLabel, rationale, submitRow);
      const feedback = node('div', 'lab-feedback-slot');
      feedback.setAttribute('aria-live', 'polite');
      main.append(form, feedback, workflowPanel(scenario));
      layout.append(evidencePanel, main);
      body.replaceChildren(layout);

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!rationale.value.trim()) {
          rationale.setCustomValidity('请写一句判断理由；不需要长篇说明。');
          rationale.reportValidity();
          rationale.focus();
          return;
        }
        if (!form.reportValidity()) return;
        const values = new FormData(form);
        const displayChoice = String(values.get('pair_choice'));
        const scores = {};
        order.forEach((candidate, index) => {
          const letter = index === 0 ? 'A' : 'B';
          scores[candidate.id] = {};
          data.criteria.forEach((criterion) => { scores[candidate.id][criterion.id] = Number(values.get('score_' + letter + '_' + criterion.id)); });
        });
        currentSnapshot = safeContext(getGameContext);
        const checks = {};
        order.forEach((candidate) => { checks[candidate.id] = checkFields(scenario, candidate); });
        const preferred = displayChoice === 'A' ? order[0].id : displayChoice === 'B' ? order[1].id : null;
        const record = {
          schema_version: data.schemaVersion,
          record_type: 'human_pairwise_annotation',
          annotation_id: uniqueId(),
          created_at_utc: new Date().toISOString(),
          fixture: {
            id: scenario.id, version: data.fixtureVersion, caption: scenario.caption,
            user_request: scenario.question, scene: scenario.scene, evidence: scenario.evidence,
            candidates: scenario.candidates.map((candidate) => ({ id: candidate.id, text: candidate.text, authored_claims: candidate.claims }))
          },
          candidate_order: order.map((candidate) => candidate.id),
          pairwise_choice: { display_choice: displayChoice, preferred_candidate_id: preferred },
          scores: { scale: [0, 1, 2], criterion_ids: data.criteria.map((criterion) => criterion.id), by_candidate_id: scores },
          rationale: rationale.value.trim(),
          game_context_at_annotation: currentSnapshot,
          evidence_checks: { method: 'deterministic_structured_fields_only', by_candidate_id: checks },
          provenance: {
            candidate_origin: 'human_authored_fixture', claims_origin: 'human_authored_fact_annotations',
            preference_and_scores_origin: 'actual_local_user_submission',
            generated_by_model: false, judged_by_model: false,
            ordering: 'fnv1a(session_seed + fixture_id) parity',
            sources: data.sources, limitations: '事实字段由作者标注；本页不从正文抽取事实，不自动判断共情、语气或自主权。'
          }
        };
        session.records.push(record);
        session.scenarioId = scenario.id;
        saveSession(session);
        updateCount();
        status.textContent = session.persistence ? '已保存一条真实人工标注。你可以继续评议另一个场景，或导出数据。' : '已记录在本页内存。浏览器暂不允许会话存储，请在离开前导出数据。';
        submit.textContent = '再次提交这份判断';
        renderFeedback(scenario, order, record, feedback);
      });
    }

    selector.addEventListener('change', () => {
      selectedId = selector.value;
      session.scenarioId = selectedId;
      saveSession(session);
      status.textContent = '';
      renderScenario();
    });
    exportButton.addEventListener('click', () => exportRecords(session.records, status));
    refreshButton.addEventListener('click', refreshContext);
    window.addEventListener('jingwai:statechange', refreshContext);
    window.addEventListener('jingwai:state-changed', refreshContext);
    updateCount();
    refreshContext();
    renderScenario();

    return {
      refreshContext,
      destroy: function () {
        window.removeEventListener('jingwai:statechange', refreshContext);
        window.removeEventListener('jingwai:state-changed', refreshContext);
      }
    };
  };
}());
