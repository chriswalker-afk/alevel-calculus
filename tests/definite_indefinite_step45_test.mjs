import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { definiteIndefiniteTopic } from '../src/scripts/topic-content/definite-indefinite-integration.js';
import { definiteIndefiniteLearningModes } from '../src/scripts/definite-indefinite-activities.js';
import { evaluateBracket, evaluateWithConstant, constantCancellationState, reverseLimits, zeroWidthIntegral, splitIntegral, differenceFromZero } from '../src/scripts/definite-indefinite-model.js';
import { getMemoryItemsForTopic } from '../src/scripts/memory-content.js';
import { getMemoryGamePackForTopic } from '../src/scripts/memory-game-content.js';
import { getMemoryReviewPackForTopic } from '../src/scripts/memory-review-content.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';
import { definiteApplicationDefinition } from '../src/scripts/question-definitions/definite-indefinite-assessment.js';
import { getSupportTargetForMicroSkill } from '../src/scripts/help-content.js';
const topicId='topic:y12:integration:definite-indefinite';
assert.equal(definiteIndefiniteTopic.topicId,topicId);
assert.deepEqual(definiteIndefiniteTopic.modes,['understand','memorise','ao1','ao2','ao3']);
assert(definiteIndefiniteTopic.activities.every(a=>a.implementationStep===45));
for(const mode of definiteIndefiniteTopic.modes){
 const metadata=definiteIndefiniteTopic.activities.filter(a=>a.mode===mode).map(a=>a.activityId);
 const live=definiteIndefiniteLearningModes[mode].activities.map(a=>a.activityId);
 assert.deepEqual(live,metadata,`${mode} live order should match TopicMetadata`);
 assert(live.length>0);
}
const U=definiteIndefiniteLearningModes.understand.activities;
assert.deepEqual(U.map(a=>a.activityId),[
 'activity:y12:integration:definite-indefinite:understand:family-vs-number',
 'activity:y12:integration:definite-indefinite:understand:integrate-then-evaluate',
 'activity:y12:integration:definite-indefinite:understand:bracket-notation',
 'activity:y12:integration:definite-indefinite:understand:why-no-c',
 'activity:y12:integration:definite-indefinite:understand:properties'
]);
assert.equal(evaluateBracket(x=>x*x,1,3),8);
for(const C of [-7,0,5.5]) assert.equal(evaluateWithConstant(x=>x*x,1,3,C),8,'C must cancel');
assert.deepEqual(constantCancellationState(x=>x*x,1,3,[-3,0,3]).map(x=>x.value),[8,8,8]);
assert.equal(reverseLimits(8),-8); assert.equal(zeroWidthIntegral(),0); assert.equal(splitIntegral(3,5),8); assert.equal(differenceFromZero(11,3),8);
assert(getMemoryItemsForTopic(topicId).length>=12);
assert(getMemoryGamePackForTopic(topicId)); assert(getMemoryReviewPackForTopic(topicId));
const runner=createGeneratorRunner({debugSeed:'step45'});
const applicationQuestion=runner.generate(definiteApplicationDefinition,{seed:'step45:inline-integration'});
assert.equal(applicationQuestion.math,'∫_(1)^(3) 2t dt');
assert(Array.isArray(applicationQuestion.promptSegments));
assert(applicationQuestion.promptSegments.some(segment=>segment.type==='math'&&segment.value==='r(t) = 2t'));
assert(applicationQuestion.promptSegments.some(segment=>segment.type==='math'&&segment.value==='t = 1'));
assert(applicationQuestion.promptSegments.some(segment=>segment.type==='math'&&segment.value==='t = 3'));
for(const mode of ['ao1','ao2','ao3']) for(const activity of definiteIndefiniteTopic.activities.filter(a=>a.mode===mode)){
 const setDef=getQuestionSetDefinitionForActivity(activity.activityId); assert(setDef,`Missing question set ${activity.activityId}`);
 const set=runner.generateSet(setDef); assert(set.questions.length>0); assert(set.questions.every(q=>q.metadata.assessmentObjective===mode));
}
assert.equal(getSupportTargetForMicroSkill('skill:y12:integration:definite-indefinite:constant-cancellation','understand')?.activityId,'activity:y12:integration:definite-indefinite:understand:why-no-c');
assert.equal(getSupportTargetForMicroSkill('skill:y12:integration:definite-indefinite:bracket-notation','understand')?.activityId,'activity:y12:integration:definite-indefinite:understand:bracket-notation');
const understand=readFileSync(new URL('../src/scripts/definite-indefinite-understand.js',import.meta.url),'utf8');
assert.match(understand,/createFamilyOfCurvesExplorer/,'C cancellation must reuse FamilyOfCurvesExplorer');
assert.match(understand,/renderEquationSteps/,'Integrate/evaluate working must reuse EquationStepRenderer');
assert.match(understand,/Square brackets mean evaluation, not integration/);
assert.match(understand,/constants cancel/);
const app=readFileSync(new URL('../src/scripts/app-shell.js',import.meta.url),'utf8');
assert.match(app,/createDefiniteIndefiniteUnderstandExperience/); assert.match(app,/definiteIndefiniteMemoryLabHost/);
const html=readFileSync(new URL('../src/index.html',import.meta.url),'utf8');
assert.match(html,/topic:y12:integration:definite-indefinite/); assert.match(html,/definite-indefinite-understand\.css/);
console.log('PASS Step 45 Definite/Indefinite Integration family-vs-number, evaluate, C-cancellation and limit-property contracts');
