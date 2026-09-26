import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { differentialEquationsTopic } from '../src/scripts/topic-content/differential-equations.js';
import { differentialEquationsLearningModes } from '../src/scripts/differential-equations-activities.js';
import { MODEL_INTERPRETATION_EXAMPLES, applyInitialCondition, modelValidityChecklist } from '../src/scripts/differential-equations-data.js';
import { differentialEquationsAssessmentQuestionDefinitions } from '../src/scripts/question-definitions/differential-equations-assessment.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { getMemoryItemsForTopic } from '../src/scripts/memory-content.js';
import { getMemoryGamePackForTopic } from '../src/scripts/memory-game-content.js';
import { getMemoryReviewPackForTopic } from '../src/scripts/memory-review-content.js';
import { createDiagnosticRouter } from '../src/scripts/diagnostic-router.js';
import { INTEGRATION_METHOD_TAGS } from '../src/scripts/integration-method-vocabulary.js';
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const topicId='topic:y13:differential-equations:first-order';
assert.deepEqual(differentialEquationsTopic.modes,['understand','memorise','ao1','ao2','ao3']);
assert.equal(differentialEquationsTopic.activities.filter(a=>a.implementationStep===72).length,6);
assert.equal(differentialEquationsTopic.activities.filter(a=>a.implementationStep===73).length,10);
for(const mode of ['memorise','ao1','ao2','ao3']) assert.ok(differentialEquationsLearningModes[mode]?.activities.length>0,`${mode} must be implemented in Step 73.`);
assert.equal(applyInitialCondition({generalValueAtPoint:4,targetValue:7}),3);
assert.equal(modelValidityChecklist({units:true,sign:true,longTerm:true,assumption:true,domain:true}).complete,true);
assert.ok(MODEL_INTERPRETATION_EXAMPLES.some(x=>/without bound/.test(x.longTerm)&&/resources/i.test(x.limitation)));
assert.ok(MODEL_INTERPRETATION_EXAMPLES.some(x=>/realistic domain/i.test(x.limitation)||/p≤0/.test(x.limitation)),'At least one model must make the valid domain explicit.');
assert.equal(differentialEquationsAssessmentQuestionDefinitions.length,7);
assert.deepEqual([...new Set(differentialEquationsAssessmentQuestionDefinitions.map(q=>q.assessmentObjective))].sort(),['ao1','ao2','ao3']);
assert.ok(differentialEquationsAssessmentQuestionDefinitions.some(q=>q.methodTags.includes(INTEGRATION_METHOD_TAGS.standard)),'Post-separation questions should reuse the canonical integration vocabulary.');
for(const q of differentialEquationsAssessmentQuestionDefinitions){
  for(const rule of Object.values(q.diagnosticRules)) assert.ok(['understand','memorise','ao1'].includes(rule.supportNeed));
}
for(const id of [
 'activity:y13:differential-equations:first-order:ao1:construct-rate-equations',
 'activity:y13:differential-equations:first-order:ao1:solve-and-condition',
 'activity:y13:differential-equations:first-order:ao2:assumptions-limitations',
 'activity:y13:differential-equations:first-order:ao3:unfamiliar-modelling'
]) assert.ok(getQuestionSetDefinitionForActivity(id),`Missing question set ${id}`);
const memory=getMemoryItemsForTopic(topicId); assert.ok(memory.length>=8,'Step 73 requires a Memory Lab bank.');
assert.ok(getMemoryGamePackForTopic(topicId)); assert.ok(getMemoryReviewPackForTopic(topicId));
const router=createDiagnosticRouter();
const limitation=differentialEquationsAssessmentQuestionDefinitions.find(q=>q.templateId.endsWith('model-limitation'));
const outcome=limitation.answerChecker('b',{}); outcome.metadata=limitation;
const route=router.routeOutcome(outcome); assert.ok(route,'Model limitation errors must route to support.'); assert.equal(route.supportNeed,'memorise');
const shell=fs.readFileSync(path.join(root,'src/scripts/app-shell.js'),'utf8');
assert.match(shell,/topic:y13:differential-equations:first-order/); assert.match(shell,/differentialEquationsLearningModes/); assert.match(shell,/availableModes: Object\.freeze\(\[\.\.\.learningModeOrder\]\)/);
const activities=fs.readFileSync(path.join(root,'src/scripts/differential-equations-activities.js'),'utf8');
assert.match(activities,/do not extrapolate blindly/i);
const assessment=fs.readFileSync(path.join(root,'src/scripts/question-definitions/differential-equations-assessment.js'),'utf8');
assert.match(assessment,/assumption/i); assert.match(assessment,/long-term/i); assert.match(assessment,/units/i); assert.match(assessment,/condition/i);
console.log('Differential equations Step 73 tests passed.');
