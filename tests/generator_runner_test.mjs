import { defineQuestionDefinition } from '../src/scripts/question-definition.js';
import { createGeneratorRunner, createSeededRandom, deriveQuestionSeed, readQuestionDebugSeed } from '../src/scripts/generator-runner.js';
import { getQuestionSetDefinitionForActivity, listQuestionDefinitions } from '../src/scripts/question-catalogue.js';
import { powerRuleAlgebraicDefinition, powerRuleReasoningDefinition } from '../src/scripts/question-definitions/power-rule.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function asciiTerm(coefficient, power) {
  if (power === 0) return String(coefficient);
  const coefficientText = coefficient === 1 ? '' : coefficient === -1 ? '-' : String(coefficient);
  return `${coefficientText}x${power === 1 ? '' : `^${power}`}`;
}

function asciiPolynomial(terms) {
  return terms.map(({ coefficient, power }, index) => {
    const raw = asciiTerm(Math.abs(coefficient), power);
    if (index === 0) return coefficient < 0 ? `-${raw}` : raw;
    return coefficient < 0 ? `-${raw}` : `+${raw}`;
  }).join('');
}

const definitions = listQuestionDefinitions();
assert(definitions.length >= 13, 'Question catalogue should retain the four Step 16 definitions and add the Step 35 Basics assessment definitions');
for (const definition of definitions) {
  assert(definition.templateId.startsWith('question-template:'), 'Every definition needs a stable template ID');
  assert(['y12', 'y13', 'full'].includes(definition.courseScope), 'Every definition needs a canonical course scope');
  assert(definition.topicId.startsWith(`topic:${definition.courseScope}:`), 'Topic ID should match the question scope');
  assert(definition.microSkillId.startsWith(`skill:${definition.courseScope}:`), 'Micro-skill ID should match the question scope');
  assert(['ao1', 'ao2', 'ao3'].includes(definition.assessmentObjective), 'Every definition needs an assessment objective');
  assert(typeof definition.difficulty === 'string' && definition.difficulty.length > 0, 'Every definition needs difficulty metadata');
  assert(Array.isArray(definition.prerequisiteTags), 'Prerequisite tags should use the shared array contract');
  assert(Array.isArray(definition.methodTags), 'Method tags should use the shared array contract');
  assert(Array.isArray(definition.vocabularyTags), 'Vocabulary tags should use the shared array contract');
  assert(Array.isArray(definition.errorCategories), 'Error categories should use the shared array contract');
  assert(definition.diagnosticRules && typeof definition.diagnosticRules === 'object', 'QuestionDefinition should carry declarative diagnostic rules');
  assert(typeof definition.parameterGenerator === 'function', 'Every definition needs a parameter generator');
  assert(typeof definition.promptRenderer === 'function', 'Every definition needs a prompt renderer');
  assert(typeof definition.answerChecker === 'function', 'Every definition needs an answer checker');
  assert(typeof definition.workedSolutionGenerator === 'function', 'Every definition needs a worked-solution generator');
}

let rejected = false;
try {
  defineQuestionDefinition({ templateId: 'bad' });
} catch {
  rejected = true;
}
assert(rejected, 'Invalid QuestionDefinitions should be rejected at registration time');

const debugRunnerA = createGeneratorRunner({ debugSeed: 'debug-seed-42', runtimeSeed: 'ignored-a' });
const debugRunnerB = createGeneratorRunner({ debugSeed: 'debug-seed-42', runtimeSeed: 'ignored-b' });
const deterministicA = debugRunnerA.generate(powerRuleAlgebraicDefinition, { sequence: 3 });
const deterministicB = debugRunnerB.generate(powerRuleAlgebraicDefinition, { sequence: 3 });
assert(JSON.stringify(deterministicA.parameters) === JSON.stringify(deterministicB.parameters), 'Same debug seed should reproduce the same parameters');
assert(deterministicA.prompt === deterministicB.prompt && deterministicA.math === deterministicB.math, 'Same debug seed should reproduce the same rendered question');
assert(JSON.stringify(deterministicA.solutionSteps) === JSON.stringify(deterministicB.solutionSteps), 'Same debug seed should reproduce the same structured worked solution');
assert(Object.isFrozen(deterministicA.solutionSteps) && deterministicA.solutionSteps.every(Object.isFrozen), 'Generated SolutionStep arrays and rows should be immutable');
assert(deterministicA.generationSeed === deterministicB.generationSeed, 'Same debug seed should preserve the exact generation seed');

assert(readQuestionDebugSeed('?questionSeed=teacher-case-17') === 'teacher-case-17', 'questionSeed query parameter should activate deterministic debug mode');
assert(readQuestionDebugSeed('?other=1') === null, 'Missing questionSeed should leave debug mode off');
assert(deriveQuestionSeed('base', 'salt') === deriveQuestionSeed('base', 'salt'), 'Seed derivation should be deterministic');
const seededA = createSeededRandom('same');
const seededB = createSeededRandom('same');
assert(Array.from({ length: 10 }, () => seededA.int(-10, 10)).join(',') === Array.from({ length: 10 }, () => seededB.int(-10, 10)).join(','), 'Seeded random helper should be reproducible');

const batchRunner = createGeneratorRunner({ debugSeed: 'batch-quality' });
const seenMath = new Set();
const seenHighPowers = new Set();
const seenLowPowers = new Set();
const seenConstants = new Set();
for (let sequence = 0; sequence < 240; sequence += 1) {
  const question = batchRunner.generate(powerRuleAlgebraicDefinition, { sequence });
  const { a, b, c, highPower, lowPower } = question.parameters;
  assert(Number.isInteger(a) && a !== 0 && Math.abs(a) >= 2 && Math.abs(a) <= 6, 'Generated leading coefficient should stay in the constrained range');
  assert(Number.isInteger(b) && b !== 0 && Math.abs(b) >= 2 && Math.abs(b) <= 6, 'Generated second coefficient should stay in the constrained range');
  assert(highPower >= 3 && highPower <= 5 && lowPower >= 1 && lowPower < highPower, 'Generated powers should stay valid and ordered');
  assert(c >= -9 && c <= 9, 'Generated constant should stay in the constrained range');
  const expected = asciiPolynomial([
    { coefficient: a * highPower, power: highPower - 1 },
    { coefficient: b * lowPower, power: lowPower - 1 }
  ]);
  const feedback = question.check(expected);
  assert(feedback.tone === 'correct', `Generated checker must accept the derivative implied by the same parameter object: ${question.math}`);
  assert(question.solutionSteps.some((step) => step.expression.includes('dy/dx')), 'Generated structured worked solution should be derived for the same question');
  assert(question.hintSequence.length >= 2, 'Step 17 sample generators should provide progressive hints');
  seenMath.add(question.math);
  seenHighPowers.add(highPower);
  seenLowPowers.add(lowPower);
  seenConstants.add(c);
}
assert(seenMath.size >= 100, 'Representative batch should demonstrate substantial generated variation');
assert(seenHighPowers.has(3) && seenHighPowers.has(5), 'Representative batch should exercise both high-power boundaries');
assert(seenLowPowers.has(1) && seenLowPowers.has(4), 'Representative batch should exercise low-power boundary cases, including linear and x^4 terms');
assert(seenConstants.has(-9) && seenConstants.has(9), 'Representative batch should exercise both constant boundaries');

const ao1SetDefinition = getQuestionSetDefinitionForActivity('activity:y12:differentiation:basics:ao1:power-rule');
assert(ao1SetDefinition?.definitions.length === 3, 'AO1 power-rule activity should consume three shared QuestionDefinitions');
const ao1Set = debugRunnerA.generateSet(ao1SetDefinition);
assert(ao1Set.questions.every((question) => question.metadata.assessmentObjective === 'ao1'), 'AO1 generated set should retain AO metadata on every question object');
assert(ao1Set.questions.every((question) => question.metadata.topicId === 'topic:y12:differentiation:basics'), 'Generated questions should retain topic metadata');
assert(ao1Set.questions.every((question) => question.metadata.microSkillId === 'skill:y12:differentiation:basics:power-rule'), 'Generated questions should retain micro-skill metadata');
assert(ao1Set.questions.every((question) => question.metadata.diagnosticRules && typeof question.metadata.diagnosticRules === 'object'), 'Generated questions should retain diagnostic metadata for automatic routing');

const mixedSet = debugRunnerA.generateSet({
  id: 'question-set:debug:mixed-mastery',
  label: 'Mixed mastery contract check',
  definitions: [powerRuleAlgebraicDefinition, powerRuleReasoningDefinition]
});
assert(mixedSet.questions.length === 2, 'A mixed consumer should be able to request existing definitions through the same runner');
assert(mixedSet.questions[0].templateId === powerRuleAlgebraicDefinition.templateId, 'Mixed set should consume the same AO1 definition, not a copied mastery question');
assert(mixedSet.questions[1].templateId === powerRuleReasoningDefinition.templateId, 'Mixed set should consume the same AO2 definition, not a copied mastery question');
assert(new Set(mixedSet.questions.map((question) => question.metadata.assessmentObjective)).size === 2, 'Mixed set should preserve each source question AO metadata');

console.log('PASS QuestionDefinition contract, deterministic GeneratorRunner, 240-question quality batch and mixed-consumer reuse');
