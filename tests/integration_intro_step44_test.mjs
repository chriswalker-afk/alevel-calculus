import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { integrationIntroTopic } from '../src/scripts/topic-content/integration-intro.js';
import { integrationIntroLearningModes } from '../src/scripts/integration-intro-activities.js';
import { integratePowerTerm, sameDerivativeUpToConstant } from '../src/scripts/integration-intro-model.js';
import { getMemoryItemsForTopic } from '../src/scripts/memory-content.js';
import { getMemoryGamePackForTopic } from '../src/scripts/memory-game-content.js';
import { getMemoryReviewPackForTopic } from '../src/scripts/memory-review-content.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';
import { getSupportTargetForMicroSkill } from '../src/scripts/help-content.js';
const topicId='topic:y12:integration:introduction';
assert.equal(integrationIntroTopic.topicId,topicId);
assert.deepEqual(integrationIntroTopic.modes,['understand','memorise','ao1','ao2','ao3']);
for(const mode of integrationIntroTopic.modes){
 const metadata=integrationIntroTopic.activities.filter(a=>a.mode===mode).map(a=>a.activityId);
 const live=integrationIntroLearningModes[mode].activities.map(a=>a.activityId);
 assert.deepEqual(live,metadata,`${mode} live order should match TopicMetadata`);
 assert(live.length>0);
}
assert(integrationIntroTopic.activities.every(a=>a.implementationStep===44));
assert.equal(integrationIntroLearningModes.understand.activities[0].activityId,'activity:y12:integration:introduction:understand:guess-original');
assert.equal(integrationIntroLearningModes.understand.activities[1].activityId,'activity:y12:integration:introduction:understand:family-of-curves');
assert.equal(integrationIntroLearningModes.understand.activities[2].activityId,'activity:y12:integration:introduction:understand:constant-of-integration');
assert.deepEqual(integratePowerTerm(6,2),{supported:true,coefficient:2,power:3});
assert.equal(integratePowerTerm(1,-1).supported,false,'n=-1 must remain an explicit exception');
const A={derivative:x=>2*x}; const B={derivative:x=>2*x};
assert(sameDerivativeUpToConstant(A,B));
assert(getMemoryItemsForTopic(topicId).length>=12);
assert(getMemoryGamePackForTopic(topicId));
assert(getMemoryReviewPackForTopic(topicId));
const runner=createGeneratorRunner({debugSeed:'step44'});
for(const mode of ['ao1','ao2','ao3']){
 for(const activity of integrationIntroTopic.activities.filter(a=>a.mode===mode)){
  const setDef=getQuestionSetDefinitionForActivity(activity.activityId); assert(setDef,`Missing question set ${activity.activityId}`);
  const set=runner.generateSet(setDef); assert(set.questions.length>0); assert(set.questions.every(q=>q.metadata.assessmentObjective===mode));
 }
}
assert.equal(getSupportTargetForMicroSkill('skill:y12:integration:introduction:constant-of-integration','understand')?.activityId,'activity:y12:integration:introduction:understand:family-of-curves');
assert.equal(getSupportTargetForMicroSkill('skill:y12:integration:introduction:power-rule','ao1')?.activityId,'activity:y12:integration:introduction:ao1:power-rule');
const understand=readFileSync(new URL('../src/scripts/integration-intro-understand.js',import.meta.url),'utf8');
assert.match(understand,/createFamilyOfCurvesExplorer/,'Understand must reuse FamilyOfCurvesExplorer');
assert.match(understand,/shape of a wave doesn't tell us the height of the water/);
assert.match(understand,/n ≠ −1/);
const app=readFileSync(new URL('../src/scripts/app-shell.js',import.meta.url),'utf8');
assert.match(app,/createIntegrationIntroUnderstandExperience/);
assert.match(app,/integrationIntroMemoryLabHost/);
const html=readFileSync(new URL('../src/index.html',import.meta.url),'utf8');
assert.match(html,/topic:y12:integration:introduction/);
assert.match(html,/integration-intro-understand\.css/);
console.log('PASS Step 44 Introduction to Integration reverse-differentiation, +C motivation, Memory Lab and AO contracts');
