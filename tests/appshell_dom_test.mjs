const listeners = new Map();
const documentListeners = new Map();
const mediaListeners = [];
const allElements = [];

class FakeElement {
  constructor(name, { id = '' } = {}) {
    this.name = name;
    this.id = id;
    this.textContent = '';
    this.dataset = {};
    this.scrollTop = 12;
    this.children = new Map();
    this.collections = new Map();
    this.attributes = new Map();
    this.hidden = false;
    this.inert = false;
    this.focused = false;
    this.value = '';
    this.style = { setProperty(name, value) { this[name] = value; } };
    this.appended = [];
    const classes = new Set();
    this.classList = {
      toggle(name, force) {
        const shouldAdd = force === undefined ? !classes.has(name) : Boolean(force);
        if (shouldAdd) classes.add(name); else classes.delete(name);
        return shouldAdd;
      },
      contains(name) { return classes.has(name); },
      add(...names) { names.forEach((name) => classes.add(name)); },
      remove(...names) { names.forEach((name) => classes.delete(name)); }
    };
    allElements.push(this);
  }
  append(...nodes) { this.appended.push(...nodes); }
  prepend(...nodes) { this.appended.unshift(...nodes); }
  insertBefore(node, referenceNode = null) {
    const index = referenceNode ? this.appended.indexOf(referenceNode) : -1;
    if (index >= 0) this.appended.splice(index, 0, node); else this.appended.push(node);
    return node;
  }
  remove() { this.removed = true; }
  replaceChildren(...nodes) { this.appended = [...nodes]; }
  addEventListener(type, handler) {
    listeners.set(`${this.name}:${type}`, handler);
  }
  removeEventListener(type, handler) {
    const key = `${this.name}:${type}`;
    if (listeners.get(key) === handler) listeners.delete(key);
  }
  querySelector(selector) {
    return this.children.get(selector) ?? null;
  }
  querySelectorAll(selector) {
    return this.collections.get(selector) ?? [];
  }
  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }
  removeAttribute(name) {
    this.attributes.delete(name);
  }
  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }
  focus() {
    for (const element of allElements) element.focused = false;
    this.focused = true;
  }
}

const body = new FakeElement('body');
const root = new FakeElement('root');
root.dataset.learningMode = 'understand';
root.dataset.courseScope = 'y12';
const shell = new FakeElement('shell');
const topbar = new FakeElement('topbar');
const topicNavigation = new FakeElement('topicNavigation');
const topicNavigationToggle = new FakeElement('topicNavigationToggle');
const topicNavigationClose = new FakeElement('topicNavigationClose');
const navigationScrim = new FakeElement('navigationScrim');
navigationScrim.hidden = true;
const learningWorkspace = new FakeElement('learningWorkspace');
const modePanel = new FakeElement('modePanel');
const stage = new FakeElement('stage');
const standardActivityContent = new FakeElement('standardActivityContent');
const activityVisual = new FakeElement('activityVisual');
const customUnderstandHost = new FakeElement('customUnderstandHost');
customUnderstandHost.hidden = true;
const questionShellElement = new FakeElement('questionShellElement');

const memoryLabElement = new FakeElement('memoryLabElement');
memoryLabElement.hidden = true;
const memoryLabSummary = new FakeElement('memoryLabSummary');
const memoryViews = ['learn', 'flashcards', 'games', 'review'].map((view, index) => {
  const button = new FakeElement(`memoryView-${view}`);
  button.dataset.memoryLabView = view;
  button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
  button.setAttribute('tabindex', index === 0 ? '0' : '-1');
  return button;
});
const memoryLearnPanel = new FakeElement('memoryLearnPanel');
memoryLearnPanel.dataset.memoryLabPanel = 'learn';
memoryLearnPanel.children.set('[data-memory-learn-list]', new FakeElement('memoryLearnList'));
memoryLearnPanel.children.set('[data-memory-learn-summary]', new FakeElement('memoryLearnSummary'));
const memoryFlashPanel = new FakeElement('memoryFlashPanel');
memoryFlashPanel.dataset.memoryLabPanel = 'flashcards';
for (const selector of [
  '[data-flashcard-card]', '[data-flashcard-cue]', '[data-flashcard-face-label]', '[data-flashcard-content]',
  '[data-flashcard-counter]', '[data-flashcard-prompt]', '[data-flashcard-rating]', '[data-flashcard-not-yet]',
  '[data-flashcard-know]', '[data-flashcard-status]'
]) memoryFlashPanel.children.set(selector, new FakeElement(`memoryFlash:${selector}`));
const memoryGamesPanel = new FakeElement('memoryGamesPanel');
memoryGamesPanel.dataset.memoryLabPanel = 'games';
const memoryGameButtons = ['match', 'build', 'missing-piece', 'sort', 'impostor'].map((game, index) => {
  const button = new FakeElement(`memoryGame-${game}`);
  button.dataset.memoryGame = game;
  button.textContent = game;
  button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
  button.setAttribute('tabindex', index === 0 ? '0' : '-1');
  return button;
});
function gamePanel(name, selectors) {
  const panel = new FakeElement(`memoryGamePanel-${name}`);
  panel.dataset.memoryGamePanel = name;
  for (const selector of selectors) panel.children.set(selector, new FakeElement(`${name}:${selector}`));
  return panel;
}
const memoryMatchPanel = gamePanel('match', ['[data-match-left]', '[data-match-right]', '[data-match-status]', '[data-match-progress]', '[data-match-reset]']);
const memoryBuildPanel = gamePanel('build', ['[data-build-prompt]', '[data-build-context]', '[data-build-slots]', '[data-build-tokens]', '[data-build-status]', '[data-build-undo]', '[data-build-reset]', '[data-build-check]']);
const memoryMissingPanel = gamePanel('missing-piece', ['[data-missing-prompt]', '[data-missing-expression]', '[data-missing-options]', '[data-missing-status]', '[data-missing-reset]', '[data-missing-check]']);
const memorySortPanel = gamePanel('sort', ['[data-sort-prompt]', '[data-sort-items]', '[data-sort-buckets]', '[data-sort-progress]', '[data-sort-status]', '[data-sort-reset]', '[data-sort-check]']);
const memoryImpostorPanel = gamePanel('impostor', ['[data-impostor-prompt]', '[data-impostor-options]', '[data-impostor-status]', '[data-impostor-reset]', '[data-impostor-check]']);
memoryGamesPanel.collections.set('[data-memory-game]', memoryGameButtons);
memoryGamesPanel.collections.set('[data-memory-game-panel]', [memoryMatchPanel, memoryBuildPanel, memoryMissingPanel, memorySortPanel, memoryImpostorPanel]);

const memoryReviewPanel = new FakeElement('memoryReviewPanel');
memoryReviewPanel.dataset.memoryLabPanel = 'review';
const memoryReviewModes = ['mix', 'rapid', 'diagram'].map((mode, index) => {
  const button = new FakeElement(`memoryReviewMode-${mode}`);
  button.dataset.memoryReviewMode = mode;
  button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
  button.setAttribute('tabindex', index === 0 ? '0' : '-1');
  return button;
});
function reviewTaskPanel(name, selectors) {
  const panel = new FakeElement(`memoryReviewTask-${name}`);
  panel.dataset.memoryReviewTaskPanel = name;
  for (const selector of selectors) panel.children.set(selector, new FakeElement(`review-${name}:${selector}`));
  return panel;
}
const reviewRapidPanel = reviewTaskPanel('rapid', [
  '[data-rapid-prompt]', '[data-rapid-cue]', '[data-rapid-options]', '[data-rapid-progress]', '[data-rapid-status]',
  '[data-rapid-next]', '[data-rapid-reset]', '[data-rapid-timer-toggle]', '[data-rapid-timer]'
]);
const reviewDiagramPanel = reviewTaskPanel('diagram', [
  '[data-diagram-recall-canvas]', '[data-diagram-recall-prompt]', '[data-diagram-recall-options]', '[data-diagram-recall-progress]',
  '[data-diagram-recall-status]', '[data-diagram-recall-next]', '[data-diagram-recall-reset]'
]);
const reviewBuildPanel = reviewTaskPanel('build', ['[data-build-prompt]', '[data-build-context]', '[data-build-slots]', '[data-build-tokens]', '[data-build-status]', '[data-build-undo]', '[data-build-reset]', '[data-build-check]']);
const reviewMissingPanel = reviewTaskPanel('missing-piece', ['[data-missing-prompt]', '[data-missing-expression]', '[data-missing-options]', '[data-missing-status]', '[data-missing-reset]', '[data-missing-check]']);
const reviewSortPanel = reviewTaskPanel('sort', ['[data-sort-prompt]', '[data-sort-items]', '[data-sort-buckets]', '[data-sort-progress]', '[data-sort-status]', '[data-sort-reset]', '[data-sort-check]']);
const reviewImpostorPanel = reviewTaskPanel('impostor', ['[data-impostor-prompt]', '[data-impostor-options]', '[data-impostor-status]', '[data-impostor-reset]', '[data-impostor-check]']);
const memoryMixContainer = new FakeElement('memoryMixContainer');
for (const selector of ['[data-memory-mix-counter]', '[data-memory-mix-task-label]', '[data-memory-mix-status]', '[data-memory-mix-next]', '[data-memory-mix-restart]']) {
  memoryMixContainer.children.set(selector, new FakeElement(`memoryMix:${selector}`));
}
memoryReviewPanel.children.set('[data-memory-mix]', memoryMixContainer);
memoryReviewPanel.collections.set('[data-memory-review-mode]', memoryReviewModes);
memoryReviewPanel.collections.set('[data-memory-review-task-panel]', [reviewRapidPanel, reviewDiagramPanel, reviewBuildPanel, reviewMissingPanel, reviewSortPanel, reviewImpostorPanel]);

const memoryLearnComplete = new FakeElement('memoryLearnComplete');
memoryLabElement.children.set('[data-memory-lab-bank-summary]', memoryLabSummary);
memoryLabElement.children.set('[data-memory-learn-complete]', memoryLearnComplete);
memoryLabElement.collections.set('[data-memory-lab-view]', memoryViews);
memoryLabElement.collections.set('[data-memory-lab-panel]', [memoryLearnPanel, memoryFlashPanel, memoryGamesPanel, memoryReviewPanel]);
const questionShellSelectors = [
  '[data-question-shell-format]',
  '[data-question-shell-counter]',
  '[data-question-shell-prompt]',
  '[data-question-shell-math]',
  '[data-question-response="input"]',
  '[data-question-shell-input-label]',
  '[data-question-shell-input]',
  '[data-question-response="choice"]',
  '[data-question-response="short-reasoning"]',
  '[data-question-shell-reasoning-label]',
  '[data-question-shell-reasoning]',
  '[data-question-shell-hint]',
  '[data-question-shell-solution]',
  '[data-question-shell-check]',
  '[data-question-shell-feedback]',
  '[data-question-shell-feedback-symbol]',
  '[data-question-shell-feedback-title]',
  '[data-question-shell-feedback-message]',
  '[data-question-shell-diagnostic]',
  '[data-question-shell-diagnostic-kind]',
  '[data-question-shell-diagnostic-title]',
  '[data-question-shell-diagnostic-message]',
  '[data-question-shell-diagnostic-link]',
  '[data-question-shell-hint-panel]',
  '[data-question-shell-hint-progress]',
  '[data-question-shell-hint-list]',
  '[data-question-shell-solution-panel]',
  '[data-question-shell-solution-steps]',
  '[data-question-shell-progress]',
  '[data-question-shell-next]'
];
for (const selector of questionShellSelectors) questionShellElement.children.set(selector, new FakeElement(`question:${selector}`));
const questionOptionRows = Array.from({ length: 4 }, (_, index) => {
  const row = new FakeElement(`questionOption-${index}`);
  row.children.set('[data-question-shell-choice]', new FakeElement(`questionChoice-${index}`));
  row.children.set('[data-question-shell-choice-label]', new FakeElement(`questionChoiceLabel-${index}`));
  row.children.set('[data-question-shell-choice-marker]', new FakeElement(`questionChoiceMarker-${index}`));
  return row;
});
questionShellElement.collections.set('[data-question-shell-option]', questionOptionRows);
questionShellElement.hidden = true;
const previousButton = new FakeElement('previous');
const nextButton = new FakeElement('next');
const footerPosition = new FakeElement('footerPosition');
const classWizPanel = new FakeElement('classWizPanel');
classWizPanel.setAttribute('aria-hidden', 'true');
const classWizTrigger = new FakeElement('classWizTrigger');
classWizTrigger.setAttribute('aria-expanded', 'false');
const classWizClose = new FakeElement('classWizClose');
const classWizScrim = new FakeElement('classWizScrim');
classWizScrim.hidden = true;
const classWizUseCaseTabList = new FakeElement('classWizUseCaseTabList');
const classWizIntro = new FakeElement('classWizIntro');
const classWizUseCaseTabs = ['derivative-check', 'integral-check'].map((id, index) => {
  const button = new FakeElement(`classWizUseCase-${id}`);
  button.dataset.classwizUseCase = id;
  button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
  button.setAttribute('tabindex', index === 0 ? '0' : '-1');
  return button;
});
const classWizModelTabs = ['cw', 'ex'].map((id, index) => {
  const button = new FakeElement(`classWizModel-${id}`);
  button.dataset.classwizModel = id;
  button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
  button.setAttribute('tabindex', index === 0 ? '0' : '-1');
  return button;
});
for (const selector of [
  '[data-classwiz-helps]', '[data-classwiz-example]', '[data-classwiz-radians]', '[data-classwiz-steps]',
  '[data-classwiz-does-not-replace]', '[data-classwiz-model-name]'
]) classWizPanel.children.set(selector, new FakeElement(`classWiz:${selector}`));
classWizPanel.children.set('.classwiz-use-case-tabs', classWizUseCaseTabList);
classWizPanel.children.set('.classwiz-support-panel__intro', classWizIntro);
classWizPanel.collections.set('[data-classwiz-use-case]', classWizUseCaseTabs);
classWizPanel.collections.set('[data-classwiz-model]', classWizModelTabs);

const helpDrawer = new FakeElement('helpDrawer');
helpDrawer.setAttribute('aria-hidden', 'true');
const helpDrawerTrigger = new FakeElement('helpDrawerTrigger');
helpDrawerTrigger.setAttribute('aria-expanded', 'false');
const helpDrawerClose = new FakeElement('helpDrawerClose');
const helpDrawerScrim = new FakeElement('helpDrawerScrim');
helpDrawerScrim.hidden = true;
const helpContext = new FakeElement('helpContext');
const topicGoalsTrigger = new FakeElement('topicGoalsTrigger');
topicGoalsTrigger.setAttribute('aria-expanded', 'false');
const topicGoalsDialog = new FakeElement('topicGoalsDialog');
topicGoalsDialog.open = false;
topicGoalsDialog.showModal = function () { this.open = true; };
topicGoalsDialog.close = function () { this.open = false; const handler = listeners.get('topicGoalsDialog:close'); if (handler) handler(); };
const topicGoalsClose = new FakeElement('topicGoalsClose');
const topicGoalsHeading = new FakeElement('topicGoalsHeading');
const topicGoalsTopic = new FakeElement('topicGoalsTopic');
const topicGoalsList = new FakeElement('topicGoalsList');
const topicGoalsFooter = new FakeElement('topicGoalsFooter');
const topicObjectivesInline = new FakeElement('topicObjectivesInline');
topicObjectivesInline.hidden = true;
const topicObjectivesInlineEyebrow = new FakeElement('topicObjectivesInlineEyebrow');
const topicObjectivesInlineHeading = new FakeElement('topicObjectivesInlineHeading');
const topicObjectivesInlineList = new FakeElement('topicObjectivesInlineList');
const topicObjectivesInlineFooter = new FakeElement('topicObjectivesInlineFooter');
const topicPathway = new FakeElement('topicPathway');
topicPathway.hidden = true;
const topicPathwayHeading = new FakeElement('topicPathwayHeading');
const topicPathwayNote = new FakeElement('topicPathwayNote');
const topicPathwayRevisit = new FakeElement('topicPathwayRevisit');
const topicPathwayModeButtons = ['memorise','ao1','ao2','ao3'].map((mode) => {
  const button = new FakeElement(`topicPathwayMode-${mode}`);
  button.dataset.topicPathwayMode = mode;
  return button;
});
const wordBankDrawer = new FakeElement('wordBankDrawer');
wordBankDrawer.setAttribute('aria-hidden', 'true');
const wordBankTrigger = new FakeElement('wordBankTrigger');
wordBankTrigger.setAttribute('aria-expanded', 'false');
const wordBankClose = new FakeElement('wordBankClose');
const wordBankScrim = new FakeElement('wordBankScrim');
wordBankScrim.hidden = true;
const wordBankCount = new FakeElement('wordBankCount');
const wordBankSearch = new FakeElement('wordBankSearch');
const wordBankResultsSummary = new FakeElement('wordBankResultsSummary');
const wordBankList = new FakeElement('wordBankList');
const wordBankEmpty = new FakeElement('wordBankEmpty');
const wordBankDetail = new FakeElement('wordBankDetail');
const wordBankDetailScope = new FakeElement('wordBankDetailScope');
const wordBankDetailTerm = new FakeElement('wordBankDetailTerm');
const wordBankDetailDefinition = new FakeElement('wordBankDetailDefinition');
const wordBankDetailNotation = new FakeElement('wordBankDetailNotation');
const wordBankDetailFirst = new FakeElement('wordBankDetailFirst');
const wordBankDetailRelated = new FakeElement('wordBankDetailRelated');
const wordBankReviewToggle = new FakeElement('wordBankReviewToggle');
const dataManagementTrigger = new FakeElement('dataManagementTrigger');
const dataManagementDialog = new FakeElement('dataManagementDialog');
dataManagementDialog.open = false;
dataManagementDialog.showModal = function () { this.open = true; };
dataManagementDialog.close = function () { this.open = false; const handler = listeners.get('dataManagementDialog:close'); if (handler) handler(); };
const storageStatus = new FakeElement('storageStatus');
const stateSchemaVersion = new FakeElement('stateSchemaVersion');
const progressRecordCount = new FakeElement('progressRecordCount');
const vocabularyRecordCount = new FakeElement('vocabularyRecordCount');
const exportProgress = new FakeElement('exportProgress');
const importProgressFile = new FakeElement('importProgressFile');
importProgressFile.files = [];
const importFilename = new FakeElement('importFilename');
const importPreview = new FakeElement('importPreview');
importPreview.hidden = true;
const importPreviewSummary = new FakeElement('importPreviewSummary');
const confirmImport = new FakeElement('confirmImport');
const resetProgress = new FakeElement('resetProgress');
const resetConfirmation = new FakeElement('resetConfirmation');
resetConfirmation.hidden = true;
const confirmReset = new FakeElement('confirmReset');
const cancelReset = new FakeElement('cancelReset');
const dataManagementStatus = new FakeElement('dataManagementStatus');
const currentTopicLabelElement = new FakeElement('currentTopicLabelElement');
const currentTopicBreadcrumb = new FakeElement('currentTopicBreadcrumb');
const wordBankFilters = ['all', 'y12', 'y13', 'needs-review'].map((filter) => {
  const button = new FakeElement(`wordBankFilter-${filter}`);
  button.dataset.wordBankFilter = filter;
  button.setAttribute('aria-pressed', filter === 'all' ? 'true' : 'false');
  return button;
});

const helpNeeds = ['understand', 'memorise', 'ao1'];
const helpTargetLinks = helpNeeds.map((need) => {
  const link = new FakeElement(`helpTarget-${need}`);
  link.dataset.helpTarget = need;
  for (const selector of [
    '[data-help-target-label]',
    '[data-help-target-title]',
    '[data-help-target-description]'
  ]) link.children.set(selector, new FakeElement(`${need}:${selector}`));
  return link;
});

const scopeIds = ['y12', 'y13-additional', 'full-alevel'];
const scopeBadges = [
  Object.assign(new FakeElement('scope-current'), { dataset: { courseScope: 'y12' } }),
  Object.assign(new FakeElement('scope-y12'), { dataset: { courseScope: 'y12' } }),
  Object.assign(new FakeElement('scope-y13'), { dataset: { courseScope: 'y13-additional' } }),
  Object.assign(new FakeElement('scope-full'), { dataset: { courseScope: 'full-alevel' } })
];

const topicPreCalculus = new FakeElement('topicPreCalculus');
topicPreCalculus.dataset.topicId = 'topic:y12:foundations:pre-calculus';
topicPreCalculus.dataset.topicLabel = 'Pre-calculus';
const topicBasics = new FakeElement('topicBasics');
topicBasics.dataset.topicId = 'topic:y12:differentiation:basics';
topicBasics.dataset.topicLabel = 'Basics of differentiation';
const topicProgressItems = [topicPreCalculus, topicBasics];

const modeIds = ['understand', 'memorise', 'ao1', 'ao2', 'ao3'];
const modeTabs = modeIds.map((mode, index) => {
  const tab = new FakeElement(`mode-${mode}`, { id: `mode-tab-${mode}` });
  tab.dataset.modeTab = mode;
  tab.dataset.learningMode = mode;
  tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
  tab.setAttribute('tabindex', index === 0 ? '0' : '-1');
  return tab;
});

const fieldSelectors = [
  '[data-activity-kicker]',
  '[data-activity-position]',
  '[data-activity-overline]',
  '[data-activity-title]',
  '[data-activity-body]',
  '[data-activity-callout] .activity-callout__label',
  '[data-activity-callout] p',
  '[data-activity-formula]',
  '[data-activity-caption]'
];
for (const selector of fieldSelectors) stage.children.set(selector, new FakeElement(selector));
stage.children.set('.activity-stage__tools', new FakeElement('activityStageTools'));

const documentMap = new Map([
  ['[data-app-shell]', shell],
  ['[data-shell-topbar]', topbar],
  ['[data-topic-navigation]', topicNavigation],
  ['[data-topic-navigation-toggle]', topicNavigationToggle],
  ['[data-topic-navigation-close]', topicNavigationClose],
  ['[data-navigation-scrim]', navigationScrim],
  ['[data-learning-workspace]', learningWorkspace],
  ['[data-mode-panel]', modePanel],
  ['[data-activity-stage]', stage],
  ['[data-standard-activity-content]', standardActivityContent],
  ['[data-activity-visual]', activityVisual],
  ['[data-understand-visual-host]', customUnderstandHost],
  ['[data-question-shell]', questionShellElement],
  ['[data-memory-lab]', memoryLabElement],
  ['[data-previous-activity]', previousButton],
  ['[data-next-activity]', nextButton],
  ['[data-footer-position]', footerPosition],
  ['[data-classwiz-panel]', classWizPanel],
  ['[data-classwiz-trigger]', classWizTrigger],
  ['[data-classwiz-close]', classWizClose],
  ['[data-classwiz-scrim]', classWizScrim],
  ['[data-help-drawer]', helpDrawer],
  ['[data-help-drawer-trigger]', helpDrawerTrigger],
  ['[data-help-drawer-close]', helpDrawerClose],
  ['[data-help-drawer-scrim]', helpDrawerScrim],
  ['[data-help-context]', helpContext],
  ['[data-topic-goals-trigger]', topicGoalsTrigger],
  ['[data-topic-goals-dialog]', topicGoalsDialog],
  ['[data-topic-goals-close]', topicGoalsClose],
  ['[data-topic-goals-heading]', topicGoalsHeading],
  ['[data-topic-goals-topic]', topicGoalsTopic],
  ['[data-topic-goals-list]', topicGoalsList],
  ['[data-topic-goals-footer]', topicGoalsFooter],
  ['[data-topic-objectives-inline]', topicObjectivesInline],
  ['[data-topic-objectives-inline-eyebrow]', topicObjectivesInlineEyebrow],
  ['[data-topic-objectives-inline-heading]', topicObjectivesInlineHeading],
  ['[data-topic-objectives-inline-list]', topicObjectivesInlineList],
  ['[data-topic-objectives-inline-footer]', topicObjectivesInlineFooter],
  ['[data-topic-pathway]', topicPathway],
  ['[data-topic-pathway-heading]', topicPathwayHeading],
  ['[data-topic-pathway-note]', topicPathwayNote],
  ['[data-topic-pathway-revisit]', topicPathwayRevisit],
  ['[data-word-bank-drawer]', wordBankDrawer],
  ['[data-word-bank-trigger]', wordBankTrigger],
  ['[data-word-bank-close]', wordBankClose],
  ['[data-word-bank-scrim]', wordBankScrim],
  ['[data-word-bank-count]', wordBankCount],
  ['[data-word-bank-search]', wordBankSearch],
  ['[data-word-bank-results-summary]', wordBankResultsSummary],
  ['[data-word-bank-list]', wordBankList],
  ['[data-word-bank-empty]', wordBankEmpty],
  ['[data-word-bank-detail]', wordBankDetail],
  ['[data-word-bank-detail-scope]', wordBankDetailScope],
  ['[data-word-bank-detail-term]', wordBankDetailTerm],
  ['[data-word-bank-detail-definition]', wordBankDetailDefinition],
  ['[data-word-bank-detail-notation]', wordBankDetailNotation],
  ['[data-word-bank-detail-first]', wordBankDetailFirst],
  ['[data-word-bank-detail-related]', wordBankDetailRelated],
  ['[data-word-bank-review-toggle]', wordBankReviewToggle],
  ['[data-data-management-trigger]', dataManagementTrigger],
  ['[data-data-management-dialog]', dataManagementDialog],
  ['[data-storage-status]', storageStatus],
  ['[data-state-schema-version]', stateSchemaVersion],
  ['[data-progress-record-count]', progressRecordCount],
  ['[data-vocabulary-record-count]', vocabularyRecordCount],
  ['[data-export-progress]', exportProgress],
  ['[data-import-progress-file]', importProgressFile],
  ['[data-import-filename]', importFilename],
  ['[data-import-preview]', importPreview],
  ['[data-import-preview-summary]', importPreviewSummary],
  ['[data-confirm-import]', confirmImport],
  ['[data-reset-progress]', resetProgress],
  ['[data-reset-confirmation]', resetConfirmation],
  ['[data-confirm-reset]', confirmReset],
  ['[data-cancel-reset]', cancelReset],
  ['[data-data-management-status]', dataManagementStatus],
  ['[data-current-topic-label]', currentTopicLabelElement],
  ['[data-current-topic-breadcrumb]', currentTopicBreadcrumb]
]);

globalThis.document = {
  documentElement: root,
  body,
  querySelector(selector) {
    return documentMap.get(selector) ?? null;
  },
  querySelectorAll(selector) {
    if (selector === '[data-mode-tab]') return modeTabs;
    if (selector === '[data-scope-badge]') return scopeBadges;
    if (selector === '[data-topic-progress-item]') return topicProgressItems;
    if (selector === '[data-classwiz-use-case]') return classWizUseCaseTabs;
    if (selector === '[data-classwiz-model]') return classWizModelTabs;
    if (selector === '[data-help-target]') return helpTargetLinks;
    if (selector === '[data-word-bank-filter]') return wordBankFilters;
    if (selector === '[data-topic-pathway-mode]') return topicPathwayModeButtons;
    return [];
  },
  addEventListener(type, handler) {
    documentListeners.set(type, handler);
  },
  createElement(tag) {
    const element = new FakeElement(`created-${tag}-${allElements.length}`);
    element.ownerDocument = this;
    return element;
  },
  createElementNS(namespace, tag) {
    const element = new FakeElement(`created-svg-${tag}-${allElements.length}`);
    element.ownerDocument = this;
    return element;
  }
};
activityVisual.ownerDocument = globalThis.document;
customUnderstandHost.ownerDocument = globalThis.document;

const media = {
  matches: true,
  addEventListener(type, handler) {
    if (type === 'change') mediaListeners.push(handler);
  },
  addListener(handler) {
    mediaListeners.push(handler);
  }
};

globalThis.window = {
  location: { search: '?questionSeed=dom-test' },
  matchMedia(query) {
    if (query !== '(max-width: 900px)') throw new Error(`Unexpected media query: ${query}`);
    return media;
  }
};

const moduleUrl = new URL('../src/scripts/app-shell.js', import.meta.url);
const appShellModule = await import(`${moduleUrl.href}?test=${Date.now()}`);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const title = stage.children.get('[data-activity-title]');
assert(root.dataset.courseScope === 'y12', 'Initial course scope should remain Year 12');
assert(scopeBadges[0].textContent === 'Year 12 · 8MA0', 'Current scope badge should use shared Year 12 metadata');
assert(scopeBadges[2].textContent === 'Year 13 additional · 9MA0', 'Year 13 navigation scope badge should use shared metadata');
assert(scopeBadges[3].textContent === 'Full A level · 9MA0', 'Full A level scope badge should use shared metadata');
assert(scopeBadges[2].dataset.routeScope === 'y13', 'Visual Year 13 scope should map to canonical route segment y13');
assert(scopeBadges[3].dataset.routeScope === 'full', 'Full A level scope should map to canonical route segment full');

assert(root.dataset.learningMode === 'understand', 'Understand should be the initial learning mode');
assert(shell.dataset.learningMode === 'understand', 'Shell should expose the active learning mode');
assert(shell.dataset.activityIndex === '0', 'Initial activity index should be 0');
assert(title.textContent === 'Goals for Basics of differentiation', 'Understand should open on its dedicated Topic goals page');
assert(customUnderstandHost.hidden === true, 'Topic goals should keep the dedicated custom visual host hidden');
assert(stage.scrollTop === 0, 'Initial render should reset only the activity-stage scroll position');

const preCalcClick = listeners.get('topicPreCalculus:click');
assert(typeof preCalcClick === 'function', 'Implemented Pre-calculus navigation needs a click handler');
preCalcClick();
assert(shell.dataset.topicId === 'topic:y12:foundations:pre-calculus', 'Pre-calculus selection should update shell topic identity');
assert(currentTopicLabelElement.textContent === 'Pre-calculus', 'Pre-calculus selection should update workspace topic label');
assert(currentTopicBreadcrumb.textContent === 'Foundations › Pre-calculus', 'Pre-calculus selection should update breadcrumb');
assert(title.textContent === 'Goals for Pre-calculus', 'Pre-calculus should also open on its dedicated Topic goals page');
assert(modeTabs[0].disabled === false, 'Understand must remain enabled for Pre-calculus');
assert(modeTabs.slice(1).every((tab) => tab.disabled === true), 'Unimplemented Pre-calculus modes must be disabled');
assert(classWizTrigger.hidden === true, 'ClassWiz should be hidden for the conceptual Pre-calculus introduction');

const basicsClick = listeners.get('topicBasics:click');
assert(typeof basicsClick === 'function', 'Basics navigation needs to remain selectable after Step 37');
basicsClick();
assert(shell.dataset.topicId === 'topic:y12:differentiation:basics', 'Switching back should restore Basics topic identity');
assert(title.textContent === 'Goals for Basics of differentiation', 'Switching back should restore the Basics Topic goals page');
assert(modeTabs.every((tab) => tab.disabled === false), 'All five frozen modes must be restored for Basics');
assert(classWizTrigger.hidden === false, 'Basics ClassWiz support must remain available');
assert(modeTabs[0].getAttribute('aria-selected') === 'true', 'Understand tab should initialize selected');
assert(modeTabs[1].getAttribute('tabindex') === '-1', 'Inactive tabs should leave the tab order');
assert(modePanel.getAttribute('aria-labelledby') === 'mode-tab-understand', 'Mode panel should be labelled by the active tab');
assert(shell.dataset.navigationOpen === 'false', 'Compact navigation should initialize closed');
assert(topicNavigation.getAttribute('aria-hidden') === 'true', 'Closed compact navigation should be hidden from accessibility tree');
assert(navigationScrim.hidden === true, 'Navigation scrim should initialize hidden');
assert(shell.dataset.classwizOpen === 'false', 'ClassWiz support should initialize closed');
assert(classWizPanel.getAttribute('aria-hidden') === 'true', 'Closed ClassWiz support should be hidden from accessibility tree');
assert(classWizScrim.hidden === true, 'ClassWiz support scrim should initialize hidden');
assert(shell.dataset.helpOpen === 'false', 'Help drawer should initialize closed');
assert(helpDrawer.getAttribute('aria-hidden') === 'true', 'Closed HelpDrawer should be hidden from accessibility tree');
assert(helpDrawerScrim.hidden === true, 'HelpDrawer scrim should initialize hidden');
assert(helpTargetLinks[0].href === '/y12/differentiation/basics/understand/gradient-function', 'Understand help should expose its canonical route');
assert(helpTargetLinks[1].dataset.helpTargetId === 'activity:y12:differentiation:basics:memorise:derivative-notation', 'Memorise help should expose its stable activity ID');
assert(shell.dataset.wordBankOpen === 'false', 'Word Bank drawer should initialize closed');
assert(wordBankDrawer.getAttribute('aria-hidden') === 'true', 'Closed Word Bank should be hidden from accessibility tree');
assert(wordBankScrim.hidden === true, 'Word Bank scrim should initialize hidden');
assert(wordBankCount.textContent === '0', 'Topic goals should not falsely mark vocabulary as encountered before the maths begins');
assert(topicObjectivesInline.hidden === false, 'Initial Topic goals should render on their own opening Understand page');
assert(topicObjectivesInlineHeading.textContent === 'In this topic you will learn to…', 'Initial Topic goals should use the teaching-topic heading');
assert(topicObjectivesInlineList.appended.length >= 3, 'Initial Topic goals should render several student-facing objectives');

const goalsClick = listeners.get('topicGoalsTrigger:click');
assert(typeof goalsClick === 'function', 'Topic goals control should have a click handler');
goalsClick();
assert(topicGoalsDialog.open === true, 'Topic goals control should open the goals dialog');
assert(topicGoalsHeading.textContent === 'In this topic you will learn to…', 'Goals dialog should use the current topic objective heading');
assert(topicGoalsTopic.textContent === 'Basics of differentiation', 'Goals dialog should identify the current topic');
assert(topicGoalsList.appended.length >= 3, 'Goals dialog should list the topic objectives');
assert(topicGoalsClose.focused === true, 'Opening Topic goals should move focus to the close button');
listeners.get('topicGoalsClose:click')();
assert(topicGoalsDialog.open === false, 'Topic goals close control should close the dialog');


stage.dataset.answerDraft = '3x^2';
stage.dataset.sliderValue = '0.63';
stage.dataset.selectedPoint = 'P';
shell.dataset.questionState = 'attempt-2';
const beforeHelpTitle = title.textContent;
const beforeHelpIndex = shell.dataset.activityIndex;
const beforeHelpScroll = stage.scrollTop;
listeners.get('helpDrawerTrigger:click')();
assert(shell.dataset.helpOpen === 'true', 'Need a reminder should open the HelpDrawer');
assert(helpDrawerTrigger.getAttribute('aria-expanded') === 'true', 'Help trigger should expose expanded state');
assert(helpDrawer.getAttribute('aria-hidden') === 'false', 'Open HelpDrawer should be accessible');
assert(helpDrawerScrim.hidden === false, 'Open HelpDrawer should reveal its scrim');
assert(topbar.inert === true && topicNavigation.inert === true && learningWorkspace.inert === true, 'HelpDrawer should make background shell regions inert');
assert(helpDrawerClose.focused === true, 'Opening HelpDrawer should move focus to close control');
assert(title.textContent === beforeHelpTitle && shell.dataset.activityIndex === beforeHelpIndex && stage.scrollTop === beforeHelpScroll, 'Opening HelpDrawer must not re-render or reset the activity');
assert(stage.dataset.answerDraft === '3x^2' && stage.dataset.sliderValue === '0.63' && stage.dataset.selectedPoint === 'P' && shell.dataset.questionState === 'attempt-2', 'Opening HelpDrawer must preserve answer, slider, selected-point and question-state fixtures');

documentListeners.get('keydown')({ key: 'Escape', preventDefault() {} });
assert(shell.dataset.helpOpen === 'false', 'Escape should close HelpDrawer');
assert(helpDrawerTrigger.focused === true, 'Closing HelpDrawer should restore focus to its trigger');
assert(topbar.inert === false && topicNavigation.inert === false && learningWorkspace.inert === false, 'Closing HelpDrawer should restore background interaction');
assert(stage.dataset.answerDraft === '3x^2' && stage.dataset.sliderValue === '0.63' && stage.dataset.selectedPoint === 'P' && shell.dataset.questionState === 'attempt-2', 'Closing HelpDrawer must leave activity state unchanged');

const beforeWordBankTitle = title.textContent;
const beforeWordBankIndex = shell.dataset.activityIndex;
listeners.get('wordBankTrigger:click')();
assert(shell.dataset.wordBankOpen === 'true', 'Word Bank trigger should open the shared drawer');
assert(wordBankTrigger.getAttribute('aria-expanded') === 'true', 'Word Bank trigger should expose expanded state');
assert(wordBankDrawer.getAttribute('aria-hidden') === 'false', 'Open Word Bank should be accessible');
assert(wordBankScrim.hidden === false, 'Open Word Bank should reveal its scrim');
assert(topbar.inert === true && topicNavigation.inert === true && learningWorkspace.inert === true, 'Word Bank should make background regions inert');
assert(wordBankSearch.focused === true, 'Opening Word Bank should move focus to search');
assert(title.textContent === beforeWordBankTitle && shell.dataset.activityIndex === beforeWordBankIndex, 'Opening Word Bank must not re-render the activity');
assert(stage.dataset.answerDraft === '3x^2' && stage.dataset.sliderValue === '0.63' && stage.dataset.selectedPoint === 'P' && shell.dataset.questionState === 'attempt-2', 'Opening Word Bank must preserve activity state fixtures');
documentListeners.get('keydown')({ key: 'Escape', preventDefault() {} });
assert(shell.dataset.wordBankOpen === 'false', 'Escape should close Word Bank');
assert(wordBankTrigger.focused === true, 'Closing Word Bank should restore focus to its trigger');
assert(stage.dataset.answerDraft === '3x^2' && stage.dataset.sliderValue === '0.63' && stage.dataset.selectedPoint === 'P' && shell.dataset.questionState === 'attempt-2', 'Closing Word Bank must leave activity state unchanged');

listeners.get('topicNavigationToggle:click')();
assert(shell.dataset.navigationOpen === 'true', 'Topics button should open compact navigation');
assert(topicNavigationToggle.getAttribute('aria-expanded') === 'true', 'Topics button should expose expanded state');
assert(topicNavigation.getAttribute('aria-hidden') === 'false', 'Open navigation should be accessible');
assert(navigationScrim.hidden === false, 'Open navigation should reveal scrim');
assert(topbar.inert === true && learningWorkspace.inert === true, 'Background shell should be inert while drawer is open');
assert(topicNavigationClose.focused === true, 'Opening navigation should move focus to its close control');

documentListeners.get('keydown')({ key: 'Escape', preventDefault() {} });
assert(shell.dataset.navigationOpen === 'false', 'Escape should close compact navigation');
assert(topicNavigationToggle.focused === true, 'Closing compact navigation should restore focus to its trigger');
assert(topbar.inert === false && learningWorkspace.inert === false, 'Closing navigation should restore background interaction');

listeners.get('topicNavigationToggle:click')();
listeners.get('navigationScrim:click')();
assert(shell.dataset.navigationOpen === 'false', 'Scrim should close compact navigation');

media.matches = false;
for (const handler of mediaListeners) handler({ matches: false });
assert(topicNavigation.getAttribute('aria-hidden') === null, 'Wide viewport should expose the persistent topic navigation');
assert(navigationScrim.hidden === true, 'Wide viewport sync should keep scrim hidden');

shell.dataset.stabilityMarker = 'same-shell';
topicNavigation.dataset.contextMarker = 'same-topic';
listeners.get('next:click')();
assert(shell.dataset.activityIndex === '1', 'Next from Topic goals should advance to the first mathematical Understand page');
assert(title.textContent === 'What does gradient mean on a curve?', 'The first mathematical Understand activity should follow Topic goals');
assert(customUnderstandHost.hidden === false, 'The first real Understand activity should mount into the dedicated visual host');
assert(standardActivityContent.dataset.customUnderstandActive === 'true', 'AppShell should expose the shared custom-Understand layout state');
assert(wordBankCount.textContent === '2', 'Vocabulary should be encountered when the first mathematical Understand page is visited');
assert(shell.dataset.stabilityMarker === 'same-shell', 'Next should not replace the AppShell object');

listeners.get('mode-ao2:click')();
assert(root.dataset.learningMode === 'ao2', 'Clicking AO2 should update the root mode identity');
assert(root.dataset.courseScope === 'y12', 'Mode switching must not alter course scope');
assert(shell.dataset.learningMode === 'ao2', 'Shell should expose AO2 as the active mode');
assert(shell.dataset.activityIndex === '0', 'First visit to AO2 should start at its first activity');
assert(title.textContent === 'Explain what a derivative value says about the original graph', 'AO2 should render its canonical Step 35 first activity');
assert(modeTabs[3].getAttribute('aria-selected') === 'true', 'AO2 tab should be selected');
assert(modeTabs[0].getAttribute('aria-selected') === 'false', 'Understand tab should be deselected');
assert(modePanel.getAttribute('aria-labelledby') === 'mode-tab-ao2', 'Panel label should follow the selected tab');
assert(topicNavigation.dataset.contextMarker === 'same-topic', 'Mode switching must preserve topic context');
assert(shell.dataset.stabilityMarker === 'same-shell', 'Mode switching must not replace the AppShell object');

listeners.get('next:click')();
assert(shell.dataset.activityIndex === '1', 'Next should advance within AO2');
assert(title.textContent === 'Say why the power rule changes both coefficient and exponent', 'AO2 second activity should render the canonical Step 35 reasoning task');

listeners.get('mode-understand:click')();
assert(root.dataset.learningMode === 'understand', 'Returning to Understand should restore its identity');
assert(shell.dataset.activityIndex === '1', 'Returning to Understand should restore its previous mathematical activity index');
assert(title.textContent === 'What does gradient mean on a curve?', 'Understand should restore its prior mathematical activity');

let prevented = false;
listeners.get('mode-understand:keydown')({ key: 'ArrowRight', preventDefault() { prevented = true; } });
assert(prevented, 'Mode arrow navigation should prevent the browser default');
assert(root.dataset.learningMode === 'memorise', 'ArrowRight should activate the next mode');
assert(modeTabs[1].focused === true, 'ArrowRight should move focus to the selected next tab');
assert(modeTabs[1].getAttribute('tabindex') === '0', 'Active mode should own the tab stop');

listeners.get('mode-memorise:keydown')({ key: 'End', preventDefault() {} });
assert(root.dataset.learningMode === 'ao3', 'End should activate the last mode');
assert(modeTabs[4].focused === true, 'End should focus the last mode tab');

listeners.get('mode-ao3:keydown')({ key: 'Home', preventDefault() {} });
assert(root.dataset.learningMode === 'understand', 'Home should activate the first mode');
assert(modeTabs[0].focused === true, 'Home should focus the first mode tab');

listeners.get('previous:click')();
assert(shell.dataset.activityIndex === '0', 'Previous from the first mathematical Understand page should return to Topic goals');
assert(previousButton.disabled === true, 'Previous should be disabled on the Topic goals page');
listeners.get('previous:click')();
assert(shell.dataset.activityIndex === '0', 'Previous from Topic goals must not wrap to the end of Understand');
assert(footerPosition.textContent === '1 of 10', 'Footer should include the two dedicated Understand bookend pages');

for (let i = 0; i < 9; i += 1) listeners.get('next:click')();
assert(shell.dataset.activityIndex === '9', 'Understand should finish on the dedicated pathway page');
assert(title.textContent === 'Turn understanding into recall and practice', 'Final Understand page should explain the next learning sequence');
assert(topicPathway.hidden === false, 'Final Understand page should reveal the pathway panel');
assert(customUnderstandHost.hidden === true, 'The final pathway page should hide the custom visual host');
assert(nextButton.disabled === true, 'Next should be disabled at the end of Understand');
listeners.get('next:click')();
assert(shell.dataset.activityIndex === '9', 'Next from the final Understand page must not wrap to Topic goals');
listeners.get('topicPathwayRevisit:click')();
assert(shell.dataset.activityIndex === '1', 'Revisit Understand should return to the first mathematical Understand page');
assert(title.textContent === 'What does gradient mean on a curve?', 'Revisit Understand should skip the goals page and reopen teaching content');

stage.dataset.answerDraft = '3x^2';
stage.dataset.sliderValue = '0.63';
stage.dataset.selectedPoint = 'P';
shell.dataset.questionState = 'attempt-2';
listeners.get('classWizTrigger:click')();
assert(shell.dataset.classwizOpen === 'true', 'ClassWiz trigger should open the shared support panel');
assert(classWizPanel.getAttribute('aria-hidden') === 'false', 'Open ClassWiz panel should be exposed to the accessibility tree');
assert(learningWorkspace.inert === true, 'ClassWiz support should make the learning workspace inert while open');
assert(classWizClose.focused === true, 'ClassWiz support should move focus to its close control');
assert(classWizPanel.children.get('[data-classwiz-radians]').hidden === false, 'Trig derivative sample should show the RADIAN reminder');
listeners.get('classWizModel-ex:click')();
assert(classWizPanel.children.get('[data-classwiz-model-name]').textContent === 'fx-991EX', 'ClassWiz model toggle should show fx-991EX instructions');
listeners.get('classWizUseCase-integral-check:click')();
assert(classWizPanel.children.get('[data-classwiz-radians]').hidden === true, 'Non-trig integral sample should not show a RADIAN warning');
documentListeners.get('keydown')({ key: 'Escape', preventDefault() {} });
assert(shell.dataset.classwizOpen === 'false', 'Escape should close ClassWiz support');
assert(classWizTrigger.focused === true, 'Closing ClassWiz support should restore trigger focus');
assert(stage.dataset.answerDraft === '3x^2' && stage.dataset.sliderValue === '0.63' && stage.dataset.selectedPoint === 'P' && shell.dataset.questionState === 'attempt-2', 'ClassWiz support open/close must preserve current activity state');

listeners.get('helpDrawerTrigger:click')();
let helpPrevented = false;
listeners.get('helpTarget-memorise:click')({ preventDefault() { helpPrevented = true; } });
assert(helpPrevented, 'Help target should intercept the static anchor for in-app support navigation');
assert(shell.dataset.helpOpen === 'false', 'Following a support target should close HelpDrawer');
assert(root.dataset.learningMode === 'memorise', 'Memorise support target should switch to Memorise');
assert(shell.dataset.activityIndex === '0', 'Memorise support target should resolve to the exact notation Learn activity');
assert(title.textContent === 'Build a compact mental reference', 'Memorise support target should open the Memory Lab Learn activity');
assert(memoryLabElement.hidden === false, 'Memorise support should reveal the shared MemoryLab');
assert(stage.focused === true, 'Following support should move focus into the resolved activity');

listeners.get('mode-ao1:click')();
assert(root.dataset.learningMode === 'ao1', 'AO1 should activate the shared practice mode');
assert(shell.dataset.activityIndex === '0', 'AO1 should open its first activity');
assert(questionShellElement.hidden === false, 'AO1 power-rule activity should reveal the shared QuestionShell');
assert(standardActivityContent.hidden === true, 'QuestionShell activity should hide the generic placeholder workspace rather than layering on top of it');
const questionInput = questionShellElement.children.get('[data-question-shell-input]');
const questionFeedback = questionShellElement.children.get('[data-question-shell-feedback]');
const { createGeneratorRunner } = await import('../src/scripts/generator-runner.js');
const { getQuestionPracticeDefinitionForActivity } = await import('../src/scripts/question-catalogue.js');
const { createQuestionPracticeSession } = await import('../src/scripts/question-practice-session.js');
const domRunner = createGeneratorRunner({ debugSeed: 'dom-test' });
const domPracticeSession = createQuestionPracticeSession({
  setDefinition: getQuestionPracticeDefinitionForActivity('activity:y12:differentiation:basics:ao1:power-rule'),
  runner: domRunner
});
const generatedAlgebraic = domPracticeSession.currentBatch().questions[0];
const gp = generatedAlgebraic.parameters;
const term = (coefficient, power) => `${coefficient}${power === 0 ? '' : `x${power === 1 ? '' : `^${power}`}`}`;
questionInput.value = `${term(gp.a * gp.highPower, gp.highPower - 1)}${gp.b * gp.lowPower < 0 ? '' : '+'}${term(gp.b * gp.lowPower, gp.lowPower - 1)}`;
listeners.get('question:[data-question-shell-input]:input')();
listeners.get('question:[data-question-shell-check]:click')();
assert(questionFeedback.dataset.tone === 'correct', 'AO1 QuestionShell should check a sample algebraic response in place');
const preservedQuestionResponse = questionInput.value;
listeners.get('helpDrawerTrigger:click')();
documentListeners.get('keydown')({ key: 'Escape', preventDefault() {} });
assert(questionInput.value === preservedQuestionResponse, 'Opening and closing HelpDrawer must preserve real QuestionShell response state');
listeners.get('wordBankTrigger:click')();
documentListeners.get('keydown')({ key: 'Escape', preventDefault() {} });
assert(questionInput.value === preservedQuestionResponse, 'Opening and closing Word Bank must preserve real QuestionShell response state');

listeners.get('next:click')();
assert(questionShellElement.hidden === false, 'Step 35 AO1 activities should continue to reuse the shared QuestionShell when moving to the next generated micro-set');
assert(standardActivityContent.hidden === true, 'Generated AO1 activities should keep the generic placeholder workspace hidden');
listeners.get('previous:click')();
assert(questionShellElement.hidden === false, 'Returning to the AO1 power-rule activity should restore QuestionShell');
assert(questionInput.value === preservedQuestionResponse, 'QuestionShell response state should survive activity navigation away and back');

questionInput.value = '0';
listeners.get('question:[data-question-shell-input]:input')();
listeners.get('question:[data-question-shell-check]:click')();
const questionDiagnostic = questionShellElement.children.get('[data-question-shell-diagnostic]');
const questionDiagnosticLink = questionShellElement.children.get('[data-question-shell-diagnostic-link]');
assert(questionDiagnostic.hidden === false, 'A deliberate failed sample question should produce a diagnostic next step');
assert(questionDiagnosticLink.href === '/y12/differentiation/basics/memorise/power-rule-recall', 'Failed sample should expose the exact canonical support route');
let diagnosticPrevented = false;
listeners.get('question:[data-question-shell-diagnostic-link]:click')({ preventDefault() { diagnosticPrevented = true; } });
assert(diagnosticPrevented, 'Diagnostic support link should be intercepted for in-app routing');
assert(root.dataset.learningMode === 'memorise', 'Diagnostic support should switch to the exact target mode');
assert(shell.dataset.activityIndex === '1', 'Diagnostic support should resolve to the power-rule recall activity rather than a generic Memorise landing page');
assert(title.textContent === 'Recall before you reveal', 'Diagnostic support should open the exact power-rule recall activity');

listeners.get('mode-memorise:click')();
listeners.get('memoryView-games:click')();
assert(root.dataset.learningMode === 'memorise', 'Memory Lab Games should remain in Memorise mode');
assert(shell.dataset.activityIndex === '6', 'The top-level Games tab should preserve the separate Step 19 games activity identity after Step 34 adds the missing canonical Memorise activities');
assert(footerPosition.textContent === '7 of 8', 'Step 19 games should retain a stable identity while the Step 34 canonical activities are added before it');
listeners.get('memoryGame-sort:click')();
assert(shell.dataset.activityIndex === '6', 'Sort should stay on the shared Step 19 games activity');
assert(memoryGameButtons[3].getAttribute('aria-selected') === 'true', 'Sort should become the active game tab');
listeners.get('memoryGame-match:click')();
assert(shell.dataset.activityIndex === '5', 'Match should retain the vocabulary-recall stable activity identity');
assert(footerPosition.textContent === '6 of 8', 'Vocabulary Match should use the canonical vocabulary-recall activity');
listeners.get('memoryGame-build:click')();
assert(shell.dataset.activityIndex === '6', 'Build should return to the Step 19 games activity');
assert(memoryGameButtons[1].getAttribute('aria-selected') === 'true', 'Build should become the active game tab');
listeners.get('memoryView-review:click')();
assert(shell.dataset.activityIndex === '7', 'Review should preserve the Step 20 stable activity identity');
assert(footerPosition.textContent === '8 of 8', 'Review should follow the six canonical Step 34 activities plus the preserved Memory Games activity');
assert(memoryReviewModes[0].getAttribute('aria-selected') === 'true', 'Memory Mix should be the default Review activity');
listeners.get('memoryReviewMode-rapid:click')();
assert(memoryReviewModes[1].getAttribute('aria-selected') === 'true', 'Rapid Recall should be selectable without leaving Review');
listeners.get('memoryReviewMode-diagram:click')();
assert(memoryReviewModes[2].getAttribute('aria-selected') === 'true', 'Diagram Recall should be selectable without leaving Review');

appShellModule.selectTopic('topic:y12:differentiation:basics', { focusStage: false });
listeners.get('mode-ao2:click')();
assert(root.dataset.learningMode === 'ao2', 'Regression setup should put the current topic in AO2');
appShellModule.selectTopic('topic:y12:differentiation:stationary-points', { focusStage: false });
assert(root.dataset.learningMode === 'understand', 'Selecting a different topic must reset the learning mode to Understand rather than carrying AO2 across');
assert(shell.dataset.learningMode === 'understand', 'Shell mode identity must also reset to Understand on a topic change');
assert(shell.dataset.activityIndex === '0', 'A newly selected topic should begin at the first Understand page');

listeners.get('dataManagementTrigger:click')();
assert(dataManagementDialog.open === true, 'Data trigger should open the progress-data dialog');
assert(Number(progressRecordCount.textContent) > 0, 'Progress-data dialog should summarize persisted activity records');
assert(Number(vocabularyRecordCount.textContent) >= 2, 'Progress-data dialog should summarize persisted vocabulary records');
listeners.get('resetProgress:click')();
assert(resetConfirmation.hidden === false, 'Reset must reveal an explicit confirmation step before clearing data');
listeners.get('cancelReset:click')();
assert(resetConfirmation.hidden === true, 'Reset confirmation should be cancellable');
listeners.get('resetProgress:click')();
listeners.get('confirmReset:click')();
assert(progressRecordCount.textContent === '0', 'Confirmed reset should clear progress records');
assert(vocabularyRecordCount.textContent === '0', 'Confirmed reset should clear vocabulary records');
dataManagementDialog.close();
assert(dataManagementDialog.open === false, 'Progress-data dialog should close cleanly');
assert(dataManagementTrigger.focused === true, 'Closing progress-data dialog should restore focus to its trigger on wide layouts');

console.log('PASS AppShell responsive navigation, ModeTabs, HelpDrawer, WordBank, QuestionShell, MemoryLab and progress-data controls');
