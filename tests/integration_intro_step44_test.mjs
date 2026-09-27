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
const memoryItems=getMemoryItemsForTopic(topicId);
assert(memoryItems.length>=16);
const byId=new Map(memoryItems.map(item=>[item.id,item]));
assert.equal(byId.get('memory-item:y12:integration:introduction:a-root-x')?.flashcard.back,'(2a/3)x³ᐟ² + C','a√x must be an explicit Year 12 recall target.');
assert.equal(byId.get('memory-item:y12:integration:introduction:a-over-root-x')?.flashcard.back,'2a√x + C','a/√x must be an explicit Year 12 recall target.');
assert.equal(byId.get('memory-item:y12:integration:introduction:a-over-x2')?.flashcard.back,'−a/x + C','a/x² must be an explicit Year 12 recall target.');
assert.equal(byId.get('memory-item:y12:integration:introduction:a-over-xn')?.learn.notation,'∫a/xⁿ dx = a/(1−n)x¹⁻ⁿ + C, n≥2','Suitable reciprocal powers must have an explicit remembered integration pattern.');
assert.match(byId.get('memory-item:y12:integration:introduction:exception')?.learn.statement ?? '',/1\/x case is handled later with logarithms/,'The n=-1 exception must be signposted to later logarithm work rather than forced through the power rule.');
assert(!memoryItems.some(item=>item.id.includes('one-over-x')||item.learn?.notation==='∫1/x dx = ln|x| + C'),'The Year 12 introduction must not pull the logarithmic reciprocal integral into the power-rule recall set.');
const gamePack=getMemoryGamePackForTopic(topicId);
assert(gamePack);
assert(gamePack.impostor.options.some(option=>option.label==='∫√x dx = (2/3)x³ᐟ² + C'),'Memory games must retrieve an explicit root integral.');
assert(gamePack.impostor.options.some(option=>option.label==='∫3/x² dx = −3/x + C'),'Memory games must retrieve an explicit reciprocal-power integral.');
assert.equal(gamePack.impostor.answerId,'wrong');
assert.match(gamePack.impostor.successMessage,/n=−1 exception/);
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
assert.match(understand,/∫a√x dx = \(2a\/3\)x³ᐟ² \+ C/,'Understand must surface the common root result explicitly.');
assert.match(understand,/∫a\/√x dx = 2a√x \+ C/,'Understand must surface the reciprocal-root result explicitly.');
assert.match(understand,/∫a\/x² dx = −a\/x \+ C/,'Understand must surface a suitable reciprocal-power result explicitly.');
assert.match(understand,/x⁻¹ = 1\/x is the n=−1 exception: do not force the power rule/,'Understand must explicitly protect the n=-1 exception.');
assert.match(understand,/Integrate each term → recombine → add one \+C/,'Term-by-term integration must finish with exactly one final +C.');
const app=readFileSync(new URL('../src/scripts/app-shell.js',import.meta.url),'utf8');
assert.match(app,/createIntegrationIntroUnderstandExperience/);
assert.match(app,/integrationIntroMemoryLabHost/);
const html=readFileSync(new URL('../src/index.html',import.meta.url),'utf8');
assert.match(html,/topic:y12:integration:introduction/);
assert.match(html,/integration-intro-understand\.css/);
console.log('PASS Step 44 Introduction to Integration reverse-differentiation, +C motivation, Memory Lab and AO contracts');
