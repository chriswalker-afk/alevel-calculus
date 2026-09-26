import {
  createHintSequence,
  getHintActionLabel,
  getHintProgressLabel,
  getVisibleHints,
  nextHintRevealCount
} from '../src/scripts/hint-sequence.js';
import { defineSolutionStep, normaliseSolutionSteps } from '../src/scripts/solution-step.js';
import { buildEquationStepViewModel, renderEquationSteps } from '../src/scripts/equation-step-renderer.js';
import { createWorkedSolutionRenderer, inspectSolutionSteps } from '../src/scripts/worked-solution-renderer.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';
import {
  powerRuleAlgebraicDefinition,
  powerRuleChoiceDefinition,
  powerRuleReasoningDefinition
} from '../src/scripts/question-definitions/power-rule.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const hints = createHintSequence([
  { id: 'strategy', text: 'Differentiate each term separately.' },
  { id: 'rule', text: 'Multiply by the old power and reduce the power by 1.' },
  { id: 'apply', text: 'Apply the rule to the first term, then the second.' }
]);
assert(Object.isFrozen(hints) && hints.every(Object.isFrozen), 'HintSequence should normalise to immutable items');
assert(getVisibleHints(hints, 0).length === 0, 'No hint should be visible before the first request');
let revealed = nextHintRevealCount(hints, 0);
assert(revealed === 1 && getVisibleHints(hints, revealed).length === 1, 'First request must reveal only the least-revealing hint');
assert(getHintActionLabel(hints, revealed).includes('2 of 3'), 'Hint action should advertise only the next staged hint');
revealed = nextHintRevealCount(hints, revealed);
assert(revealed === 2 && getVisibleHints(hints, revealed)[1].id === 'rule', 'Second request should add exactly one hint');
revealed = nextHintRevealCount(hints, revealed);
assert(revealed === 3 && getHintProgressLabel(hints, revealed) === '3 of 3 hints shown', 'All hints should report a clear staged progress label');
assert(nextHintRevealCount(hints, revealed) === 0, 'After the final hint, the same control should hide/reset the staged hints');

const steps = normaliseSolutionSteps([
  defineSolutionStep({ id: 'differentiate', kind: 'working', label: 'Differentiate', expression: 'dy/dx = 12x³ − 10x', explanation: 'Apply the power rule term by term.' }),
  defineSolutionStep({ id: 'result', kind: 'result', label: 'Result', expression: 'dy/dx = 12x³ − 10x', explanation: 'This is the gradient function.' })
]);
assert(Object.isFrozen(steps) && steps.every(Object.isFrozen), 'SolutionStep contract should produce immutable rows');
const view = buildEquationStepViewModel(steps);
assert(view.length === 2 && view[0].number === 1 && view[1].kind === 'result', 'EquationStepRenderer should preserve solution order and semantic kind');
const debugRows = inspectSolutionSteps(steps);
assert(JSON.stringify(debugRows) === JSON.stringify(view), 'Teacher/debug inspection must read the same SolutionStep objects used by the student renderer');
const fakeContainer = { innerHTML: '' };
renderEquationSteps(fakeContainer, steps);
assert(fakeContainer.innerHTML.includes('equation-step-list') && fakeContainer.innerHTML.includes('data-solution-step-id="differentiate"'), 'EquationStepRenderer should render structured line-by-line markup');
const renderer = createWorkedSolutionRenderer(fakeContainer);
renderer.render(steps);
assert(renderer.inspect().length === 2 && renderer.inspect()[1].id === 'result', 'WorkedSolutionRenderer inspection should expose the rendered SolutionStep rows without regenerating logic');

let rejectedPlainString = false;
try {
  normaliseSolutionSteps(['plain string']);
} catch {
  rejectedPlainString = true;
}
assert(rejectedPlainString, 'Step 17 worked solutions should use structured SolutionStep objects rather than legacy strings');

const runner = createGeneratorRunner({ debugSeed: 'step17-feedback' });
const algebraic = runner.generate(powerRuleAlgebraicDefinition);
assert(algebraic.hintSequence.length === 3, 'Sample generated algebraic question should provide three staged hints');
assert(algebraic.solutionSteps.length === 3, 'Sample generated algebraic question should provide a coherent multi-line solution');
assert(algebraic.solutionSteps.at(-1).kind === 'result', 'Final solution line should be identified as the result');
assert(algebraic.metadata.errorCategories.includes('power-not-reduced'), 'Generated metadata should expose declared error categories for later diagnostics');

const { a, b, highPower, lowPower } = algebraic.parameters;
const wrongPower = `${a * highPower}x^${highPower}${b * lowPower < 0 ? '' : '+'}${b * lowPower}x^${lowPower}`;
const wrongPowerFeedback = algebraic.check(wrongPower);
assert(wrongPowerFeedback.tone === 'incorrect' && wrongPowerFeedback.errorCategory === 'power-not-reduced', 'Algebraic checker should classify a recognisable power-rule error');

const choice = runner.generate(powerRuleChoiceDefinition);
const choiceFeedback = choice.check('linear-term-unchanged');
assert(choiceFeedback.errorCategory === 'linear-term-not-constant', 'Choice checker should preserve option-specific error categories');

const reasoning = runner.generate(powerRuleReasoningDefinition);
const reasoningFeedback = reasoning.check('The coefficient is multiplied by the power.');
assert(reasoningFeedback.tone === 'warning' && reasoningFeedback.errorCategory === 'missing-power-change', 'Short reasoning feedback should distinguish the missing part of an explanation');

console.log('PASS staged HintSequence, structured SolutionStep rendering and error-category feedback hooks');
