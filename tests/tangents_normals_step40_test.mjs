import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { tangentsNormalsTopic } from '../src/scripts/topic-content/tangents-normals.js';
import { tangentsNormalsLearningModes } from '../src/scripts/tangents-normals-activities.js';
import { tangentNormalModel } from '../src/scripts/tangents-normals-understand.js';
import { createPolynomialFunctionDefinition } from '../src/scripts/linked-function-gradient-explorer.js';
import { getMemoryItemsForTopic } from '../src/scripts/memory-content.js';
import { getMemoryGamePackForTopic } from '../src/scripts/memory-game-content.js';
import { getMemoryReviewPackForTopic } from '../src/scripts/memory-review-content.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';
import { getSupportTargetForMicroSkill } from '../src/scripts/help-content.js';

const topicId='topic:y12:differentiation:tangents-normals';
assert.equal(tangentsNormalsTopic.topicId,topicId);
assert.deepEqual(tangentsNormalsTopic.modes,['understand','memorise','ao1','ao2','ao3']);
for(const mode of tangentsNormalsTopic.modes){
  const metadata=tangentsNormalsTopic.activities.filter(a=>a.mode===mode).map(a=>a.activityId);
  const live=tangentsNormalsLearningModes[mode].activities.map(a=>a.activityId);
  assert.deepEqual(live,metadata,`${mode} live order should match TopicMetadata`);
  assert(live.every(id=>id.startsWith(`activity:y12:differentiation:tangents-normals:${mode}:`)));
}
assert(tangentsNormalsTopic.activities.every(a=>a.implementationStep===40));

const curve=createPolynomialFunctionDefinition({id:'test',label:'x²−1',coefficients:[-1,0,1],xDomain:[-3,3],yDomains:{function:[-3,8],derivative:[-7,7]},initialX:0});
const regular=tangentNormalModel(curve,1);
assert.equal(regular.tangentGradient,2);
assert.equal(regular.normalGradient,-0.5);
assert.equal(regular.verticalNormal,false);
assert.equal(regular.normalEquation,'y − 0 = -0.5(x − 1)');
const special=tangentNormalModel(curve,0);
assert.equal(special.tangentGradient,0);
assert.equal(special.normalGradient,null);
assert.equal(special.verticalNormal,true);
assert.equal(special.normalEquation,'x = 0');
assert(!special.normalEquation.includes('undefined'));

const source=readFileSync(new URL('../src/scripts/tangents-normals-understand.js',import.meta.url),'utf8');
assert(source.includes('createLinkedFunctionGradientExplorer'));
assert(source.includes("diagram.line"),'Normal must use the shared DiagramPrimitives line overlay');
assert(!source.includes('createElementNS'),'Topic must not create a local SVG system');
assert(source.includes("setAttribute('aria-live','off')")||source.includes("setAttribute(\"aria-live\",\"off\")"),'Continuous movement must not announce every update');

assert(getMemoryItemsForTopic(topicId).length>=10);
assert(getMemoryGamePackForTopic(topicId));
assert(getMemoryReviewPackForTopic(topicId));
const runner=createGeneratorRunner({debugSeed:'step40'});
for(const mode of ['ao1','ao2','ao3']){
  for(const activity of tangentsNormalsTopic.activities.filter(a=>a.mode===mode)){
    const def=getQuestionSetDefinitionForActivity(activity.activityId);
    assert(def,`Missing question set for ${activity.activityId}`);
    const set=runner.generateSet(def);
    assert(set.questions.length>0);
    assert(set.questions.every(q=>q.metadata.assessmentObjective===mode));
  }
}
assert.equal(getSupportTargetForMicroSkill('skill:y12:differentiation:tangents-normals:normal-gradient','understand')?.activityId,'activity:y12:differentiation:tangents-normals:understand:normal-gradient');
assert.equal(getSupportTargetForMicroSkill('skill:y12:differentiation:tangents-normals:tangent-gradient','ao1')?.activityId,'activity:y12:differentiation:tangents-normals:ao1:tangent-gradient');
assert.equal(getSupportTargetForMicroSkill('skill:y12:differentiation:tangents-normals:normal-gradient','ao1')?.activityId,'activity:y12:differentiation:tangents-normals:ao1:normal-gradient');
assert.equal(getSupportTargetForMicroSkill('skill:y12:differentiation:tangents-normals:normal-line','ao1')?.activityId,'activity:y12:differentiation:tangents-normals:ao1:normal-line');
assert.equal(getSupportTargetForMicroSkill('skill:y12:differentiation:tangents-normals:special-cases','understand')?.activityId,'activity:y12:differentiation:tangents-normals:understand:special-cases');

const shell=readFileSync(new URL('../src/scripts/app-shell.js',import.meta.url),'utf8');
assert(shell.includes('tangentsNormalsLearningModes'));
assert(shell.includes('tangentsNormalsUnderstand'));
assert(shell.includes('tangentsNormalsMemoryLabHost'));
console.log('PASS Step 40 Tangents and Normals all-mode, shared-visual, memory, assessment and special-case contracts');
