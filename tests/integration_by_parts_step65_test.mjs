import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { integrationByPartsTopic } from '../src/scripts/topic-content/integration-by-parts.js';
import { integrationByPartsLearningModes } from '../src/scripts/integration-by-parts-activities.js';
import { PARTS_FORMULA, PARTS_METHOD_POSITION, PARTS_CHOICE_PREVIEWS, DI_TABLE_EXAMPLE, PARTS_EXAMPLES, STANDARD_INTEGRAL_PARTS_SOURCE, INTEGRATION_BY_PARTS_METHOD_TAG } from '../src/scripts/integration-by-parts-data.js';
import { STANDARD_INTEGRAL_DEFINITIONS } from '../src/scripts/standard-integrals-data.js';
import { INTEGRATION_METHOD_TAGS } from '../src/scripts/trig-integration-data.js';
import { integrationByPartsMemoryItems } from '../src/scripts/memory-content.js';
import { integrationByPartsGamePack } from '../src/scripts/memory-game-content.js';
import { integrationByPartsReviewPack } from '../src/scripts/memory-review-content.js';
import { integrationByPartsAssessmentQuestionDefinitions } from '../src/scripts/question-definitions/integration-by-parts-assessment.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { getSupportTargetForMicroSkill } from '../src/scripts/help-content.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';

assert.equal(integrationByPartsTopic.topicId,'topic:y13:integration:by-parts');
assert.equal(integrationByPartsTopic.sequence,310);
assert.deepEqual(integrationByPartsTopic.modes,['understand','memorise','ao1','ao2','ao3']);
assert.deepEqual(Object.keys(integrationByPartsLearningModes),['understand','memorise','ao1','ao2','ao3']);
assert.equal(integrationByPartsLearningModes.understand.activities.length,8);
assert.equal(integrationByPartsLearningModes.memorise.activities.length,9);
assert.equal(integrationByPartsLearningModes.ao1.activities.length,4);
assert.equal(integrationByPartsLearningModes.ao2.activities.length,3);
assert.equal(integrationByPartsLearningModes.ao3.activities.length,2);
assert.equal(integrationByPartsTopic.activities.filter(a=>a.implementationStep===65).length,26);

assert.equal(PARTS_FORMULA.integral,'∫u dv = uv − ∫v du');
assert.equal(INTEGRATION_METHOD_TAGS.byParts,'integration-by-parts');
assert.equal(INTEGRATION_BY_PARTS_METHOD_TAG,INTEGRATION_METHOD_TAGS.byParts);
assert.strictEqual(STANDARD_INTEGRAL_PARTS_SOURCE,STANDARD_INTEGRAL_DEFINITIONS,'Step 65 must reuse Step 60 standard-integral data by reference');
assert.equal(PARTS_METHOD_POSITION.at(-1).method,'integration-by-parts');
assert.ok(PARTS_METHOD_POSITION.some(x=>x.method==='substitution'));
for(const preview of PARTS_CHOICE_PREVIEWS){
 const good=preview.choices.find(x=>x.id==='good');
 const poor=preview.choices.find(x=>x.id==='poor');
 assert.equal(good.easier,true);
 assert.equal(poor.easier,false);
 assert.notEqual(good.newIntegral,poor.newIntegral);
}
assert.equal(DI_TABLE_EXAMPLE.derivatives.at(-1),'0');
assert.deepEqual(DI_TABLE_EXAMPLE.signs,['+','−','+']);
assert.equal(PARTS_EXAMPLES.find(x=>x.id==='hidden-one').result,'x ln x−x+C');
assert.match(PARTS_EXAMPLES.find(x=>x.id==='cyclic').result,/e\^x\/2/);

assert.ok(integrationByPartsMemoryItems.length>=10);
assert.ok(integrationByPartsGamePack.sort.buckets.some(b=>b.id==='parts'));
assert.ok(integrationByPartsReviewPack.mix.taskIds.includes('sort'));

for(const id of [
 'activity:y13:integration:by-parts:ao1:choose-and-complete',
 'activity:y13:integration:by-parts:ao1:definite-basic',
 'activity:y13:integration:by-parts:ao1:hidden-one',
 'activity:y13:integration:by-parts:ao1:repeated-di',
 'activity:y13:integration:by-parts:ao2:explain-choice',
 'activity:y13:integration:by-parts:ao2:derive-from-product',
 'activity:y13:integration:by-parts:ao2:diagnose-errors',
 'activity:y13:integration:by-parts:ao3:unsignposted',
 'activity:y13:integration:by-parts:ao3:cyclic-mixed'
]) assert.ok(getQuestionSetDefinitionForActivity(id),`missing question set ${id}`);
assert.equal(integrationByPartsAssessmentQuestionDefinitions.length,9);
for(const def of integrationByPartsAssessmentQuestionDefinitions){
 assert.equal(def.topicId,'topic:y13:integration:by-parts');
 assert.ok(def.methodTags.includes('integration-by-parts'));
}

const runner=createGeneratorRunner({runtimeSeed:'step65-tests'});
const choose=integrationByPartsAssessmentQuestionDefinitions.find(d=>d.templateId.endsWith(':choose-complete'));
const q1=runner.generate(choose,{seed:'exp'});
assert.equal(q1.check('a').tone,'correct');
assert.ok(q1.solutionSteps.some(s=>String(s.label).includes('Apply parts')));
const cyclic=integrationByPartsAssessmentQuestionDefinitions.find(d=>d.templateId.endsWith(':cyclic-mixed'));
const q2=runner.generate(cyclic,{seed:'cyclic'});
assert.equal(q2.check('a').tone,'correct');
assert.ok(q2.solutionSteps.some(s=>String(s.expression).includes('2I=')));

assert.equal(getSupportTargetForMicroSkill('skill:y13:integration:by-parts:choose-u-dv','understand').activityId,'activity:y13:integration:by-parts:understand:choice-preview');
assert.equal(getSupportTargetForMicroSkill('skill:y13:integration:by-parts:repeated-parts','ao1').activityId,'activity:y13:integration:by-parts:ao1:repeated-di');
assert.equal(getSupportTargetForMicroSkill('skill:y13:integration:by-parts:cyclic-parts','understand').activityId,'activity:y13:integration:by-parts:understand:cyclic-cases');

const appShell=await fs.readFile(new URL('../src/scripts/app-shell.js',import.meta.url),'utf8');
assert.match(appShell,/topic:y13:integration:by-parts/);
assert.match(appShell,/integrationByPartsMemoryLabHost/);
assert.match(appShell,/createIntegrationByPartsUnderstandExperience/);
const index=await fs.readFile(new URL('../src/index.html',import.meta.url),'utf8');
assert.match(index,/data-topic-id="topic:y13:integration:by-parts"/);
assert.match(index,/integration-by-parts-understand\.css/);
assert.match(index,/topic:y13:integration:by-parts/,'Step 65 topic remains registered after later integration topics are added.');
console.log('Step 65 integration-by-parts contracts passed.');
