import { createDiagnosticRouter } from '../src/scripts/diagnostic-router.js';
import { createMasteryFeedbackModel } from '../src/scripts/mastery-feedback-model.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';
import { powerRuleAlgebraicDefinition, powerRuleChoiceDefinition } from '../src/scripts/question-definitions/power-rule.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const router = createDiagnosticRouter();
const model = createMasteryFeedbackModel({ router });
const runner = createGeneratorRunner({ debugSeed: 'mastery-feedback-test' });
const algebraic = runner.generate(powerRuleAlgebraicDefinition, { sequence: 0 });
const choice = runner.generate(powerRuleChoiceDefinition, { sequence: 1 });

const outcomes = [
  {
    success: false,
    errorCategory: 'power-not-reduced',
    metadata: algebraic.metadata
  },
  {
    success: false,
    errorCategory: 'coefficient-not-multiplied',
    metadata: choice.metadata
  },
  {
    success: true,
    errorCategory: null,
    metadata: {
      ...algebraic.metadata,
      microSkillId: 'skill:y12:differentiation:basics:gradient-function'
    }
  }
];

const summary = model.summarise(outcomes);
assert(summary.attemptCount === 3, 'Mastery feedback should count tagged evidence rather than calculate a score percentage');
assert(summary.weaknesses.length === 1, 'Failed power-rule evidence should create one micro-skill weakness rather than duplicate entries per question');
assert(summary.strengths.length === 1, 'Successful-only evidence should be surfaced separately as a strength');
const weakness = summary.weaknesses[0];
assert(weakness.microSkillId === 'skill:y12:differentiation:basics:power-rule', 'Weakness should aggregate by stable micro-skill ID');
assert(weakness.executionErrors === 1 && weakness.recognitionErrors === 1, 'Mastery feedback should keep recognition and execution failures distinct');
assert(weakness.focus === 'Recognition and execution', 'Mixed evidence should describe both weakness types without collapsing them into a score');
assert(weakness.nextStep?.activityId === 'activity:y12:differentiation:basics:memorise:power-rule-recall', 'Latest recognition weakness should retain the exact diagnostic next step');
assert(!('security' in weakness), 'MasteryFeedbackModel must not duplicate ProgressStore security state');

const empty = model.summarise([]);
assert(empty.attemptCount === 0 && empty.strengths.length === 0 && empty.weaknesses.length === 0, 'Empty mastery evidence should remain an empty diagnostic summary');

console.log('PASS MasteryFeedbackModel aggregates tagged strengths/weaknesses and separates recognition from execution');
