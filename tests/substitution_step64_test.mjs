import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { substitutionTopic } from '../src/scripts/topic-content/substitution.js';
import { substitutionLearningModes } from '../src/scripts/substitution-activities.js';
import { substitutionMemoryItems } from '../src/scripts/memory-content.js';
import { substitutionGamePack } from '../src/scripts/memory-game-content.js';
import { substitutionReviewPack } from '../src/scripts/memory-review-content.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { substitutionAssessmentQuestionDefinitions } from '../src/scripts/question-definitions/substitution-assessment.js';
import { getSupportTargetForMicroSkill } from '../src/scripts/help-content.js';
import { SUBSTITUTION_METHOD_TAG } from '../src/scripts/substitution-data.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';

assert.deepEqual(substitutionTopic.modes,['understand','memorise','ao1','ao2','ao3']);
assert.deepEqual(Object.keys(substitutionLearningModes),['understand','memorise','ao1','ao2','ao3']);
assert.equal(substitutionTopic.activities.filter(a=>a.implementationStep===64).length,15);
assert.equal(substitutionLearningModes.memorise.activities.length,8);
assert.equal(substitutionLearningModes.ao1.activities.length,4);
assert.equal(substitutionLearningModes.ao2.activities.length,2);
assert.equal(substitutionLearningModes.ao3.activities.length,1);
assert.ok(substitutionMemoryItems.length>=10,'Step 64 should supply a substantive substitution memory bank');
assert.ok(substitutionGamePack.sort.buckets.some(b=>b.id==='choice'));
assert.ok(substitutionGamePack.sort.buckets.some(b=>b.id==='transform'));
assert.ok(substitutionGamePack.sort.buckets.some(b=>b.id==='integrate'));
assert.ok(substitutionReviewPack.mix.taskIds.includes('sort'));

for(const id of [
 'activity:y13:integration:substitution:ao1:given-substitution',
 'activity:y13:integration:substitution:ao1:choose-u',
 'activity:y13:integration:substitution:ao1:change-limits',
 'activity:y13:integration:substitution:ao1:complete-substitution',
 'activity:y13:integration:substitution:ao2:diagnose-errors',
 'activity:y13:integration:substitution:ao2:compare-recognition',
 'activity:y13:integration:substitution:ao3:unfamiliar-applications'
]) assert.ok(getQuestionSetDefinitionForActivity(id),`missing question set ${id}`);

assert.equal(substitutionAssessmentQuestionDefinitions.length,7);
for(const def of substitutionAssessmentQuestionDefinitions){
 assert.ok(def.methodTags.includes(SUBSTITUTION_METHOD_TAG));
 assert.equal(def.topicId,'topic:y13:integration:substitution');
}
const categories=new Set(substitutionAssessmentQuestionDefinitions.flatMap(d=>d.errorCategories));
for(const c of ['choice','transformation','integration']) assert.ok(categories.has(c),`missing diagnostic category ${c}`);

const runner=createGeneratorRunner({runtimeSeed:'step64-tests'});
const choose= substitutionAssessmentQuestionDefinitions.find(d=>d.templateId.endsWith(':choose-u'));
for(let i=0;i<50;i++){
 const q=runner.generate(choose,{seed:`step64-${i}`});
 assert.ok(q.prompt.includes('Choose the most useful u'));
 const correct=q.options.find(o=>o.id==='a');
 assert.ok(correct,'generated choose-u question must have an intended helpful substitution');
}
const app=substitutionAssessmentQuestionDefinitions.find(d=>d.templateId.endsWith(':application'));
const q=runner.generate(app,{seed:'definite'});
assert.match(q.prompt,/∫₀¹/);
assert.equal(q.check('a').tone,'correct');
assert.ok(q.solutionSteps.some(s=>String(s.expression).includes('u=1')),'definite solution must convert limits');
assert.ok(q.solutionSteps.every(s=>!String(s.expression).includes('x back')),'definite solution must stay in u after changing limits');

assert.equal(getSupportTargetForMicroSkill('skill:y13:integration:substitution:choose-u','ao1').activityId,'activity:y13:integration:substitution:ao1:choose-u');
assert.equal(getSupportTargetForMicroSkill('skill:y13:integration:substitution:definite-limits','ao1').activityId,'activity:y13:integration:substitution:ao1:change-limits');
assert.equal(getSupportTargetForMicroSkill('skill:y13:integration:substitution:given-substitution','ao1').activityId,'activity:y13:integration:substitution:ao1:given-substitution');

const appShell=await fs.readFile(new URL('../src/scripts/app-shell.js',import.meta.url),'utf8');
assert.match(appShell,/topic:y13:integration:substitution/);
assert.match(appShell,/substitutionMemoryLabHost/);
assert.match(appShell,/learningModes: substitutionLearningModes, availableModes: Object\.freeze\(\[\.\.\.learningModeOrder\]\)/);
console.log('Step 64 substitution AO1-AO3, Memory Lab and diagnostic contracts passed.');
