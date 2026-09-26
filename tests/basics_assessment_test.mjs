import { learningModes } from '../src/scripts/sample-activities.js';
import { basicsDifferentiationTopic } from '../src/scripts/topic-content/basics-differentiation.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';
import { getQuestionSetDefinitionForActivity, listQuestionDefinitions } from '../src/scripts/question-catalogue.js';
import {
  rewriteReciprocalDefinition,
  rewriteRootDefinition,
  termByTermDefinition,
  graphMatchingDefinition,
  explainGradientFunctionDefinition,
  errorCorrectionDefinition,
  unknownCoefficientsDefinition,
  simpleApplicationRateDefinition,
  simpleApplicationInterpretDefinition
} from '../src/scripts/question-definitions/basics-assessment.js';

function assert(condition, message) { if (!condition) throw new Error(message); }

const expectedActivities = {
  ao1: ['power-rule','rewrite-and-differentiate','term-by-term','graph-matching'],
  ao2: ['explain-gradient-function','diagnose-power-rule','error-correction','unknown-coefficients'],
  ao3: ['simple-applications']
};
for (const [mode, slugs] of Object.entries(expectedActivities)) {
  const runtimeIds = learningModes[mode].activities.map((a) => a.activityId);
  const metadataIds = basicsDifferentiationTopic.activities.filter((a) => a.mode === mode && a.implementationStep === 35).map((a) => a.activityId);
  assert(runtimeIds.length === slugs.length, `${mode} should expose exactly the Step 35 canonical activities`);
  for (const slug of slugs) {
    const id = `activity:y12:differentiation:basics:${mode}:${slug}`;
    assert(runtimeIds.includes(id), `${mode} runtime should expose ${slug}`);
    assert(metadataIds.includes(id), `${mode} TopicMetadata should own ${slug} at Step 35`);
    assert(getQuestionSetDefinitionForActivity(id), `${id} should resolve to a generated QuestionShell set`);
  }
}

const addedDefinitions = [
  rewriteReciprocalDefinition, rewriteRootDefinition, termByTermDefinition, graphMatchingDefinition,
  explainGradientFunctionDefinition, errorCorrectionDefinition, unknownCoefficientsDefinition,
  simpleApplicationRateDefinition, simpleApplicationInterpretDefinition
];
assert(listQuestionDefinitions().length >= 13, 'Step 35 should add nine definitions without replacing the Step 16 definitions');
for (const definition of addedDefinitions) {
  assert(['ao1','ao2','ao3'].includes(definition.assessmentObjective), 'Every Step 35 definition needs an AO tag');
  assert(definition.topicId === 'topic:y12:differentiation:basics', 'Every Step 35 definition must stay in the Basics topic');
  assert(definition.microSkillId.startsWith('skill:y12:differentiation:basics:'), 'Every Step 35 definition needs an exact Basics micro-skill');
  assert(definition.prerequisiteTags.length > 0, 'Every Step 35 definition needs prerequisite metadata');
  assert(definition.vocabularyTags.length > 0, 'Every Step 35 definition needs vocabulary metadata');
  assert(definition.errorCategories.length > 0, 'Every Step 35 definition needs diagnostic error categories');
}

const runner = createGeneratorRunner({ debugSeed: 'step35-quality' });
for (let sequence = 0; sequence < 80; sequence += 1) {
  let q = runner.generate(rewriteReciprocalDefinition, { sequence });
  assert(q.check(`-${q.parameters.a*q.parameters.n}x^-${q.parameters.n+1}`).tone === 'correct', 'Reciprocal generator must accept its mathematically implied derivative');

  q = runner.generate(rewriteRootDefinition, { sequence });
  assert(q.check(`${q.parameters.k}x^-1/2`).tone === 'correct', 'Root generator must accept the fractional-power derivative');

  q = runner.generate(termByTermDefinition, { sequence });
  const p=q.parameters;
  const terms=[
    {c:p.a*p.p,power:p.p-1},
    {c:p.b*p.q,power:p.q-1},
    {c:p.c,power:0}
  ];
  const answer=terms.map((t,i)=>{
    const mag=Math.abs(t.c); const raw=t.power===0?String(mag):`${mag===1?'':mag}x${t.power===1?'':`^${t.power}`}`;
    return i===0?(t.c<0?`-${raw}`:raw):(t.c<0?`-${raw}`:`+${raw}`);
  }).join('');
  assert(q.check(answer).tone === 'correct', 'Term-by-term generator must accept the derivative generated from the same parameters');

  q = runner.generate(graphMatchingDefinition, { sequence });
  assert(q.diagramConfig?.kind === 'function-derivative-choice', 'Graph-match questions should use the shared QuestionShell visual hook');
  assert(q.parameters.candidateGraphs?.length === 4, 'Graph-match questions should supply four rendered derivative candidates from the same parameter object');
  assert(q.check(q.parameters.correct).tone === 'correct', 'Graph-match generator must accept the derivative-shape option paired with its function');

  q = runner.generate(explainGradientFunctionDefinition, { sequence });
  const explanation = q.parameters.gradient > 0 ? 'The tangent gradient is positive, so f is increasing.' : 'The tangent gradient is negative, so f is decreasing.';
  assert(q.check(explanation).tone === 'correct', 'AO2 gradient explanation must accept sign + tangent reasoning');

  q = runner.generate(errorCorrectionDefinition, { sequence });
  assert(q.check(`Rewrite the reciprocal using a negative power, then differentiate to get -${q.parameters.a*q.parameters.n}x^-${q.parameters.n+1}.`).tone === 'correct', 'AO2 error-correction generator must accept a misconception plus corrected derivative');

  q = runner.generate(unknownCoefficientsDefinition, { sequence });
  assert(q.check(String(q.parameters.a)).tone === 'correct', 'Unknown-coefficient generator must recover its source coefficient exactly');

  q = runner.generate(simpleApplicationRateDefinition, { sequence });
  assert(q.check(String(q.parameters.rate)).tone === 'correct', 'AO3 rate application must accept the instantaneous rate generated by the model');

  q = runner.generate(simpleApplicationInterpretDefinition, { sequence });
  const interpretation = q.parameters.rate < 0 ? `The object is moving downward at ${Math.abs(q.parameters.rate)} m/s.` : `The object is moving upward at ${q.parameters.rate} m/s.`;
  assert(q.check(interpretation).tone === 'correct', 'AO3 interpretation must accept direction and units');
}

for (const mode of ['ao1','ao2','ao3']) {
  for (const activity of learningModes[mode].activities) {
    const set = runner.generateSet(getQuestionSetDefinitionForActivity(activity.activityId));
    assert(set.questions.length > 0, `${activity.activityId} should generate a non-empty batch`);
    assert(set.questions.every((question) => question.metadata.assessmentObjective === mode), `${activity.activityId} must not blur the AO label`);
    assert(set.questions.every((question) => question.metadata.microSkillId.startsWith('skill:y12:differentiation:basics:')), `${activity.activityId} questions need diagnostic micro-skill tags`);
  }
}

console.log('PASS Basics Step 35 AO1/AO2/AO3 generated batches, mathematics, metadata and mode separation');
