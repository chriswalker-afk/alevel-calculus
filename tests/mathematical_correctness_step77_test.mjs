import assert from 'node:assert/strict';
import { listQuestionDefinitions, getQuestionDefinition } from '../src/scripts/question-catalogue.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';
import { classifyTrapeziumBound, TRAPEZIUM_RULE_FUNCTIONS } from '../src/scripts/trapezium-rule-builder.js';
import { INTEGRATION_METHOD_TAG_LIST } from '../src/scripts/integration-method-vocabulary.js';

const definitions = listQuestionDefinitions();
const runner = createGeneratorRunner({ debugSeed: 'step77-mathematical-audit' });
const seedFamilies = Object.freeze([
  ...Array.from({ length: 16 }, (_, index) => `step77:representative:${index}`),
  ...Array.from({ length: 16 }, (_, index) => `step77:boundary:${index}`)
]);
const forbiddenRenderedTokens = /\b(?:NaN|Infinity)\b|\[object Object\]/;
const explicitAnswerKeys = Object.freeze(['expected', 'answer', 'gradient', 'rate', 'slope']);
let generatedCount = 0;
let choiceCount = 0;
let explicitAnswerChecks = 0;

function serialisableSnapshot(question) {
  return {
    templateId: question.templateId,
    generationSeed: question.generationSeed,
    sequence: question.sequence,
    parameters: question.parameters,
    metadata: question.metadata,
    responseType: question.responseType,
    prompt: question.prompt,
    math: question.math,
    options: question.options,
    hintSequence: question.hintSequence,
    solutionSteps: question.solutionSteps,
    diagramConfig: question.diagramConfig
  };
}

function renderedText(question) {
  const stepText = question.solutionSteps.flatMap((step) => Object.values(step).filter((value) => typeof value === 'string'));
  const optionText = question.options?.flatMap((option) => Object.values(option).filter((value) => typeof value === 'string')) ?? [];
  return [question.prompt, question.math, ...optionText, ...stepText].join(' ');
}

for (const definition of definitions) {
  for (let sequence = 0; sequence < seedFamilies.length; sequence += 1) {
    const seed = `${seedFamilies[sequence]}:${definition.templateId}`;
    const question = runner.generate(definition, { seed, sequence });
    const repeated = runner.generate(definition, { seed, sequence });
    generatedCount += 1;

    assert.deepEqual(
      serialisableSnapshot(repeated),
      serialisableSnapshot(question),
      `${definition.templateId} must reproduce exactly for seed ${seed}`
    );
    assert.equal(forbiddenRenderedTokens.test(renderedText(question)), false, `${definition.templateId} emitted malformed rendered text for seed ${seed}`);
    assert.ok(question.prompt.trim().length > 0, `${definition.templateId} requires a non-empty prompt`);
    assert.ok(question.solutionSteps.length > 0, `${definition.templateId} requires worked solution steps`);
    assert.ok(question.solutionSteps.every((step) => String(step.expression ?? '').trim().length > 0), `${definition.templateId} has a blank solution expression`);
    assert.notEqual(question.check('__step77_invalid_response__').tone, 'correct', `${definition.templateId} accepted a nonsense response`);

    if (question.responseType === 'choice') {
      choiceCount += 1;
      if (question.diagramConfig?.kind === 'calculus-graph-classifier') {
        const stagedResponse = `graph:${question.parameters.correctGraphId}|sign:${question.parameters.correctSign}`;
        assert.equal(
          question.check(stagedResponse).tone,
          'correct',
          `${definition.templateId} must accept the generated graph plus derivative-sign response for seed ${seed}`
        );
        assert.ok(question.options.some((option) => option.id === question.parameters.correctGraphId), `${definition.templateId} correct graph must be one of the displayed graph options`);
      } else {
        const judged = question.options.map((option) => ({ option, result: question.check(option.id) }));
        const correct = judged.filter(({ result }) => result.tone === 'correct');
        assert.equal(correct.length, 1, `${definition.templateId} must accept exactly one displayed option for seed ${seed}`);
        assert.ok(correct[0].option.label.trim().length > 0, `${definition.templateId} correct option must have visible text`);
      }
    } else if (question.responseType !== 'short-reasoning') {
      for (const key of explicitAnswerKeys) {
        if (!(key in question.parameters)) continue;
        const value = question.parameters[key];
        if (typeof value !== 'string' && typeof value !== 'number') continue;
        explicitAnswerChecks += 1;
        assert.equal(
          question.check(String(value)).tone,
          'correct',
          `${definition.templateId} rejected its explicit generated ${key}=${value} for seed ${seed}`
        );
      }
    }
  }
}

assert.equal(definitions.length, 232, 'Step 77 audits the complete Step 76 canonical question catalogue.');
assert.equal(generatedCount, definitions.length * seedFamilies.length, 'Every generator must run in both reproducible audit batches.');
assert.ok(choiceCount > 6000, 'The batch should exercise the large choice-question surface.');
assert.ok(explicitAnswerChecks > 100, 'The batch should verify a substantial set of generated explicit numeric/algebraic answers.');

// Unit coefficients should be omitted from displayed algebraic terms.
const simpleRateDefinition = getQuestionDefinition('question-template:y12:differentiation:basics:ao3:simple-rate-application');
let unitCoefficientRateQuestion = null;
for (let index = 0; index < 80 && !unitCoefficientRateQuestion; index += 1) {
  const question = runner.generate(simpleRateDefinition, { seed: `step77:unit-coefficient:${index}`, sequence: index });
  if (question.parameters.a === 1) unitCoefficientRateQuestion = question;
}
assert.ok(unitCoefficientRateQuestion, 'Seed batch must expose a unit leading coefficient in the AO3 height model.');
assert.equal(unitCoefficientRateQuestion.math, '', 'Inline model questions should not duplicate the model in the separate display-maths card.');
assert.doesNotMatch(unitCoefficientRateQuestion.prompt, /h\(t\)=1t³/);
assert.match(unitCoefficientRateQuestion.prompt, /h\(t\)=t³/);

// Undefined gradients / vertical tangents: never divide by zero or invent an infinite numeric gradient.
const verticalNormal = runner.generate(getQuestionDefinition('question-template:y12:differentiation:tangents-normals:special-case'), { seed: 'step77:vertical-normal' });
assert.equal(verticalNormal.check('b').tone, 'correct');
assert.match(renderedText(verticalNormal), /vertical normal|vertical/i);
assert.doesNotMatch(renderedText(verticalNormal), /gradient is .*Infinity|=\s*Infinity/i);

const verticalTangent = runner.generate(getQuestionDefinition('question-template:y13:differentiation:parametric-differentiation:vertical-tangent'), { seed: 'step77:vertical-tangent' });
assert.equal(verticalTangent.check('a').tone, 'correct');
assert.match(renderedText(verticalTangent), /not finite|do not divide by zero/i);

// Logarithm domains: reciprocal integrals require absolute values; ln x by parts states x>0.
const standardCore = getQuestionDefinition('question-template:y13:integration:standard-integrals:core-array');
let reciprocalQuestion = null;
for (let index = 0; index < 80 && !reciprocalQuestion; index += 1) {
  const question = runner.generate(standardCore, { seed: `step77:reciprocal:${index}`, sequence: index });
  if (question.parameters.kind === 'reciprocal') reciprocalQuestion = question;
}
assert.ok(reciprocalQuestion, 'Seed batch must expose the reciprocal standard integral.');
assert.match(renderedText(reciprocalQuestion), /ln\|x\|/i);
const lnByParts = runner.generate(getQuestionDefinition('question-template:y13:integration:by-parts:hidden-one'), { seed: 'step77:ln-domain' });
assert.match(lnByParts.prompt, /x>0/);

// Definite-limit changes: transformed-variable limits and direction must be explicit and consistent.
const substitutionLimits = runner.generate(getQuestionDefinition('question-template:y13:integration:substitution:change-limits'), { seed: 'step77:substitution-limits' });
assert.equal(substitutionLimits.check('a').tone, 'correct');
assert.match(renderedText(substitutionLimits), /x=0.*u=1|u=0²\+1=1/s);
assert.match(renderedText(substitutionLimits), /x=1.*u=2|u=1²\+1=2/s);

const parametricLimits = runner.generate(getQuestionDefinition('question-template:y13:integration:parametric-area:limits'), { seed: 'step77:parametric-limits' });
assert.equal(parametricLimits.check('a').tone, 'correct');
assert.match(renderedText(parametricLimits), /0 to 2|0≤t≤2/);
const parametricDirection = runner.generate(getQuestionDefinition('question-template:y13:integration:parametric-area:direction'), { seed: 'step77:parametric-direction' });
assert.equal(parametricDirection.check('a').tone, 'correct');
assert.match(renderedText(parametricDirection), /dx\/dt<0|dx\/dt=−3sin t<0/);
assert.match(renderedText(parametricDirection), /negate|reverse the limits|−∫/i);

// Signed area: retain orientation for integrals and magnitudes for geometrical area.
const crossing = runner.generate(getQuestionDefinition('question-template:y12:integration:signed-area:crossing'), { seed: 'step77:signed-crossing' });
assert.equal(crossing.check('a').tone, 'correct');
assert.match(renderedText(crossing), /7−7=0|\(\+7\)\+\(−7\)/);
const totalArea = runner.generate(getQuestionDefinition('question-template:y12:integration:signed-area:total-area'), { seed: 'step77:total-area' });
assert.equal(totalArea.check('a').tone, 'correct');
assert.match(renderedText(totalArea), /3\+4\+2=9|\|3\|\+\|−4\|\+\|2\|/);

// Concavity claims: only make whole-interval bound claims when concavity has one sign.
const convex = TRAPEZIUM_RULE_FUNCTIONS.find((item) => item.id === 'trapezium-convex');
const concave = TRAPEZIUM_RULE_FUNCTIONS.find((item) => item.id === 'trapezium-concave');
const inflection = TRAPEZIUM_RULE_FUNCTIONS.find((item) => item.id === 'trapezium-inflection');
assert.equal(classifyTrapeziumBound(convex, ...convex.xDomain).kind, 'overestimate');
assert.equal(classifyTrapeziumBound(concave, ...concave.xDomain).kind, 'underestimate');
const mixedBound = classifyTrapeziumBound(inflection, ...inflection.xDomain);
assert.equal(mixedBound.kind, 'mixed');
assert.match(mixedBound.reason, /no whole-interval over\/under bound/i);

// Recognition classifications: all reverse-chain / f'/f / neither branches are reachable and checker-aligned.
const classify = getQuestionDefinition('question-template:y13:integration:reverse-chain-rule:classify');
const seenKinds = new Set();
for (let index = 0; index < 80; index += 1) {
  const question = runner.generate(classify, { seed: `step77:classification:${index}`, sequence: index });
  seenKinds.add(question.parameters.kind);
  const expectedId = question.parameters.kind === 'reverse' ? 'reverse' : question.parameters.kind === 'log' ? 'log' : 'neither';
  assert.equal(question.check(expectedId).tone, 'correct', `Classification checker mismatch for ${question.parameters.kind}`);
}
assert.deepEqual([...seenKinds].sort(), ['log', 'neither', 'reverse']);

// Step 71 method vocabulary remains the only integration method taxonomy.
assert.equal(new Set(INTEGRATION_METHOD_TAG_LIST).size, INTEGRATION_METHOD_TAG_LIST.length);

console.log(`Step 77 mathematical/generator audit passed: ${definitions.length} definitions, ${generatedCount} seeded questions, ${choiceCount} choice instances, ${explicitAnswerChecks} explicit generated answers.`);
