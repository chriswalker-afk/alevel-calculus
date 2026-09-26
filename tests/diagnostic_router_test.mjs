import { createDiagnosticRouter } from '../src/scripts/diagnostic-router.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';
import { powerRuleAlgebraicDefinition, powerRuleNumericDefinition } from '../src/scripts/question-definitions/power-rule.js';
import { learningModes } from '../src/scripts/sample-activities.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const router = createDiagnosticRouter();
const runner = createGeneratorRunner({ debugSeed: 'diagnostic-router-test' });

const numeric = runner.generate(powerRuleNumericDefinition, { sequence: 0 });
const np = numeric.parameters;
const originalFunctionValue = np.a * (np.xValue ** np.n) + np.b * np.xValue;
const recognitionFeedback = numeric.check(String(originalFunctionValue));
assert(recognitionFeedback.errorCategory === 'evaluated-function-not-derivative', 'Numeric fixture should deliberately trigger the derivative-recognition category');
const recognition = router.routeOutcome({
  success: false,
  errorCategory: recognitionFeedback.errorCategory,
  metadata: numeric.metadata
});
assert(recognition?.kind === 'recognition', 'Using f(x) instead of f′(x) should be diagnostic recognition evidence');
assert(recognition?.target.route === '/y12/differentiation/basics/understand/gradient-function', 'Recognition failure should route to the exact Understand gradient-function support');
assert(recognition?.target.activityId === 'activity:y12:differentiation:basics:understand:gradient-function', 'Recognition route should retain the exact stable activity ID');
assert(learningModes.understand.activities.some((activity) => activity.activityId === recognition.target.activityId), 'Diagnostic Understand target must resolve to an existing activity');

const algebraic = runner.generate(powerRuleAlgebraicDefinition, { sequence: 1 });
const ap = algebraic.parameters;
const term = (coefficient, power) => `${coefficient}${power === 0 ? '' : `x${power === 1 ? '' : `^${power}`}`}`;
const powerUnchanged = `${term(ap.a * ap.highPower, ap.highPower)}${ap.b * ap.lowPower < 0 ? '' : '+'}${term(ap.b * ap.lowPower, ap.lowPower)}`;
const executionFeedback = algebraic.check(powerUnchanged);
assert(executionFeedback.errorCategory === 'power-not-reduced', 'Algebraic fixture should deliberately trigger the power-execution category');
const execution = router.routeOutcome({
  success: false,
  errorCategory: executionFeedback.errorCategory,
  metadata: algebraic.metadata
});
assert(execution?.kind === 'execution', 'Power not reduced should be classified as execution evidence');
assert(execution?.target.route === '/y12/differentiation/basics/ao1/power-rule', 'Execution failure should route to exact AO1 power-rule practice');
assert(learningModes.ao1.activities.some((activity) => activity.activityId === execution.target.activityId), 'Diagnostic AO1 target must resolve to an existing activity');

assert(router.routeOutcome({ success: true, metadata: algebraic.metadata }) === null, 'Successful outcomes should not create weakness support routes');
assert(router.routeOutcome({ success: false, errorCategory: 'unknown', metadata: algebraic.metadata })?.target.route === '/y12/differentiation/basics/ao1/power-rule', 'Unknown checker detail should use the definition default diagnostic without inventing a route');

console.log('PASS DiagnosticRouter distinguishes recognition/execution and resolves exact existing support routes');
