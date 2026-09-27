import { createQuestionShell, questionResponseTypes } from '../src/scripts/question-shell.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { createDiagnosticRouter } from '../src/scripts/diagnostic-router.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

class FakeElement {
  constructor(name) {
    this.name = name;
    this.textContent = '';
    this.value = '';
    this.placeholder = '';
    this.inputMode = '';
    this.hidden = false;
    this.disabled = false;
    this.checked = false;
    this.dataset = {};
    this.children = new Map();
    this.collections = new Map();
    this.attributes = new Map();
    this.listeners = new Map();
    this.focused = false;
  }
  querySelector(selector) { return this.children.get(selector) ?? null; }
  querySelectorAll(selector) { return this.collections.get(selector) ?? []; }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  removeAttribute(name) { this.attributes.delete(name); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  addEventListener(type, handler) { this.listeners.set(type, handler); }
  trigger(type, event = {}) { this.listeners.get(type)?.({ preventDefault() {}, ...event }); }
  focus() { this.focused = true; }
}

function buildQuestionShellFixture() {
  const root = new FakeElement('root');
  const selectors = [
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
  for (const selector of selectors) root.children.set(selector, new FakeElement(selector));

  const optionRows = Array.from({ length: 4 }, (_, index) => {
    const row = new FakeElement(`option-${index}`);
    row.children.set('[data-question-shell-choice]', new FakeElement(`choice-${index}`));
    row.children.set('[data-question-shell-choice-label]', new FakeElement(`choice-label-${index}`));
    row.children.set('[data-question-shell-choice-marker]', new FakeElement(`choice-marker-${index}`));
    return row;
  });
  root.collections.set('[data-question-shell-option]', optionRows);
  return { root, optionRows };
}

const runner = createGeneratorRunner({ debugSeed: 'question-shell-test' });
const ao1Definition = getQuestionSetDefinitionForActivity('activity:y12:differentiation:basics:ao1:power-rule');
const ao2Definition = getQuestionSetDefinitionForActivity('activity:y12:differentiation:basics:ao2:diagnose-power-rule');
const ao1Set = runner.generateSet(ao1Definition);
const ao2Set = runner.generateSet(ao2Definition);
assert(ao1Set.questions.length === 3, 'Generated AO1 set should contain algebraic, numeric and choice questions');
assert(questionResponseTypes.filter((type) => type !== 'short-reasoning').every((type) => ao1Set.questions.some((question) => question.responseType === type)), 'AO1 generated set should cover algebraic, numeric and choice responses');
assert(ao2Set.questions.length === 1 && ao2Set.questions[0].responseType === 'short-reasoning', 'Generated AO2 set should exercise the short-reasoning response surface');

const { root, optionRows } = buildQuestionShellFixture();
const attempts = [];
const diagnosticNavigations = [];
const diagnosticRouter = createDiagnosticRouter();
const shell = createQuestionShell(root, {
  resolveDiagnostic: (attempt) => diagnosticRouter.routeOutcome(attempt),
  onDiagnosticNavigate: (target) => diagnosticNavigations.push(target),
  onAttempt: (attempt) => attempts.push(attempt)
});
shell.loadSet(ao1Set);

const input = root.querySelector('[data-question-shell-input]');
const reasoning = root.querySelector('[data-question-shell-reasoning]');
const hintButton = root.querySelector('[data-question-shell-hint]');
const solutionButton = root.querySelector('[data-question-shell-solution]');
const nextButton = root.querySelector('[data-question-shell-next]');
const feedback = root.querySelector('[data-question-shell-feedback]');
const promptField = root.querySelector('[data-question-shell-prompt]');
const feedbackMessageField = root.querySelector('[data-question-shell-feedback-message]');
const hintListField = root.querySelector('[data-question-shell-hint-list]');

assert(promptField.getAttribute('data-math-prose') === '', 'Question prompts should use prose-safe maths rendering');
assert(feedbackMessageField.getAttribute('data-math-prose') === '', 'Feedback messages should use prose-safe maths rendering');
assert(hintListField.getAttribute('data-math-prose') === '', 'Hint text should use prose-safe maths rendering');
assert(root.hidden === false, 'Loading a generated question set should reveal the shared shell');
assert(root.dataset.questionResponseType === 'algebraic', 'First generated sample should use the algebraic response surface');
assert(shell.getSnapshot().templateId?.startsWith('question-template:'), 'QuestionShell snapshot should retain generated template identity');
assert(shell.getSnapshot().generationSeed, 'QuestionShell snapshot should retain generation seed for reproducibility');
assert(nextButton.disabled === true, 'Next question should remain unavailable until the current response is checked');

shell.checkCurrent();
assert(feedback.dataset.tone === 'warning', 'Checking an empty response should prompt for an answer without recording an attempt');
assert(attempts.length === 0, 'Empty checks must not count as attempts');

const first = ao1Set.questions[0];
const { a, b, highPower, lowPower } = first.parameters;
const term = (coefficient, power) => `${coefficient}${power === 0 ? '' : `x${power === 1 ? '' : `^${power}`}`}`;
const expected = `${term(a * highPower, highPower - 1)}${b * lowPower < 0 ? '' : '+'}${term(b * lowPower, lowPower - 1)}`;
input.value = expected;
input.trigger('input');
shell.checkCurrent();
assert(feedback.dataset.tone === 'correct', 'Generated algebraic answer should receive universal correct feedback');
assert(attempts.length === 1 && attempts[0].success === true, 'A checked generated answer should report one successful attempt');
assert(attempts[0].metadata?.microSkillId === 'skill:y12:differentiation:basics:power-rule', 'QuestionShell attempt should forward generated metadata');
assert(attempts[0].generationSeed === first.generationSeed, 'QuestionShell attempt should forward the generation seed');
assert(solutionButton.disabled === false, 'Worked solution access should unlock after an attempt');
assert(nextButton.disabled === false, 'Next question should unlock after an attempt');

hintButton.trigger('click');
assert(root.querySelector('[data-question-shell-hint-panel]').hidden === false, 'Hint access should reveal the first generated hint locally');
assert(shell.getSnapshot().hintsRevealed === 1, 'First hint action should reveal only the least-revealing hint');
const firstHintText = root.querySelector('[data-question-shell-hint-list]').textContent;
hintButton.trigger('click');
assert(shell.getSnapshot().hintsRevealed === 2, 'Second hint action should progressively reveal one additional hint');
assert(root.querySelector('[data-question-shell-hint-list]').textContent.length > firstHintText.length, 'Progressive hints should add to, rather than replace, the earlier hint');
solutionButton.trigger('click');
assert(root.querySelector('[data-question-shell-solution-panel]').hidden === false, 'Generated worked solution should reveal in place after checking');
assert(root.querySelector('[data-question-shell-solution-steps]').innerHTML.includes('equation-step'), 'Worked solution should render structured line-by-line SolutionStep rows');

shell.nextQuestion();
assert(root.dataset.questionResponseType === 'numeric', 'Next generated question should reuse the same shell for numeric response');
const numeric = ao1Set.questions[1];
const p = numeric.parameters;
input.value = String(p.a * p.n * (p.xValue ** (p.n - 1)) + p.b);
shell.checkCurrent();
assert(feedback.dataset.tone === 'correct', 'Generated numeric response should be checkable in the shared shell');

shell.nextQuestion();
assert(root.dataset.questionResponseType === 'choice', 'Next generated question should reuse the shell for choice response');
const wrongOptionIndex = ao1Set.questions[2].options.findIndex((option) => option.id === 'power-unchanged');
optionRows[wrongOptionIndex].querySelector('[data-question-shell-choice]').checked = true;
shell.checkCurrent();
assert(feedback.dataset.tone === 'incorrect', 'Generated choice response should surface targeted incorrect feedback');
assert(feedback.dataset.errorCategory === 'power-not-reduced', 'Error-category hook should retain the checker category on the feedback region');
assert(attempts.at(-1).errorCategory === 'power-not-reduced', 'Attempt evidence should forward the error category for later diagnostics');
const diagnosticPanel = root.querySelector('[data-question-shell-diagnostic]');
const diagnosticLink = root.querySelector('[data-question-shell-diagnostic-link]');
assert(diagnosticPanel.hidden === false, 'A failed generated question should reveal a diagnostic next step');
assert(diagnosticPanel.dataset.diagnosticKind === 'recognition', 'Choice-recognition failure should be classified separately from execution failure');
assert(diagnosticLink.href === '/y12/differentiation/basics/memorise/power-rule-recall', 'Recognition failure should route to exact power-rule Memorise support');
diagnosticLink.trigger('click');
assert(diagnosticNavigations.at(-1)?.activityId === 'activity:y12:differentiation:basics:memorise:power-rule-recall', 'Diagnostic link should hand the exact stable support activity to AppShell navigation');
assert(attempts.at(-1).diagnostic?.kind === 'recognition', 'Attempt evidence should retain the resolved diagnostic kind for mastery aggregation');
const correctOptionIndex = ao1Set.questions[2].options.findIndex((option) => option.id === 'correct');
for (const row of optionRows) row.querySelector('[data-question-shell-choice]').checked = false;
optionRows[correctOptionIndex].querySelector('[data-question-shell-choice]').checked = true;
shell.checkCurrent();
assert(feedback.dataset.tone === 'correct', 'Generated choice response should be checkable in the shared shell');
assert(root.querySelector('[data-question-shell-diagnostic]').hidden === true, 'A successful retry should clear the current diagnostic next-step card');
shell.nextQuestion();
assert(root.dataset.questionResponseType === 'algebraic', 'Generated AO1 set should wrap to its first question');
assert(input.value === expected, 'Wrapped generated set should restore the original algebraic response');

shell.loadSet(ao2Set);
assert(root.dataset.questionResponseType === 'short-reasoning', 'Same QuestionShell should accept generated AO2 short reasoning');
reasoning.value = 'Multiply the coefficient by the old power, then reduce the power by one.';
shell.checkCurrent();
assert(feedback.dataset.tone === 'correct', 'Generated short-reasoning question should support concise response feedback');

shell.loadSet(ao1Set);
assert(shell.getSnapshot().checked === true, 'Question state should survive switching generated sets and returning');
assert(shell.getSnapshot().hintOpen === true && shell.getSnapshot().hintsRevealed === 2 && shell.getSnapshot().solutionOpen === true, 'Progressive-hint and worked-solution state should survive returning to the generated question');
assert(input.value === expected, 'Generated question response should survive returning to the set');

shell.hide();
assert(root.hidden === true, 'QuestionShell can be hidden when the current activity is not question-based');
shell.loadSet(ao1Set);
assert(shell.getSnapshot().response === expected, 'Question state should survive hiding and restoring the same generated set');

console.log('PASS shared QuestionShell consumes generated AO1/AO2 QuestionDefinition objects and preserves state');
