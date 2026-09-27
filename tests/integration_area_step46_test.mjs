import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { integrationAreaTopic } from '../src/scripts/topic-content/integration-area.js';
import { integrationAreaLearningModes } from '../src/scripts/integration-area-activities.js';
import { INTEGRATION_AREA_POSITIVE_FUNCTIONS, accumulatedFromZero, removalIdentityState, betweenCurvesAreaState, adjacentIntervalState, reversedIntervalState } from '../src/scripts/integration-area-model.js';
import { getMemoryItemsForTopic } from '../src/scripts/memory-content.js';
import { getMemoryGamePackForTopic } from '../src/scripts/memory-game-content.js';
import { getMemoryReviewPackForTopic } from '../src/scripts/memory-review-content.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';
import { getSupportTargetForMicroSkill } from '../src/scripts/help-content.js';

const topicId='topic:y12:integration:area';
assert.equal(integrationAreaTopic.topicId,topicId);
assert.deepEqual(integrationAreaTopic.modes,['understand','memorise','ao1','ao2','ao3']);
assert(integrationAreaTopic.activities.every(a=>a.implementationStep===46));
for(const mode of integrationAreaTopic.modes){
  const metadata=integrationAreaTopic.activities.filter(a=>a.mode===mode).map(a=>a.activityId);
  const live=integrationAreaLearningModes[mode].activities.map(a=>a.activityId);
  assert.deepEqual(live,metadata,`${mode} live order should match TopicMetadata`);
  assert(live.length>0);
}
assert.deepEqual(integrationAreaLearningModes.understand.activities.map(a=>a.activityId),[
 'activity:y12:integration:area:understand:lower-limit-zero',
 'activity:y12:integration:area:understand:remove-unwanted-region',
 'activity:y12:integration:area:understand:endpoint-difference',
 'activity:y12:integration:area:understand:between-positive-curves',
 'activity:y12:integration:area:understand:visual-properties'
]);
for(const definition of INTEGRATION_AREA_POSITIVE_FUNCTIONS){
  assert.deepEqual(definition.xDomain,[0,4]);
  for(let x=0;x<=4;x+=0.25) assert(definition.evaluate(x)>0,`${definition.id} must stay positive for Step 46`);
}
const f=INTEGRATION_AREA_POSITIVE_FUNCTIONS[0];
assert(Math.abs(accumulatedFromZero(f,3)-7.5)<1e-6);
const removal=removalIdentityState(f,1,3);
assert(Math.abs(removal.toB-7.5)<1e-6);
assert(Math.abs(removal.toA-1.5)<1e-6);
assert(Math.abs(removal.difference-removal.direct)<1e-6,'Removing 0→a must equal direct a→b area');
const top=INTEGRATION_AREA_POSITIVE_FUNCTIONS.find(x=>x.id==='integration-area-linear');
const bottom=INTEGRATION_AREA_POSITIVE_FUNCTIONS.find(x=>x.id==='integration-area-quadratic');
const between=betweenCurvesAreaState(top,bottom,0,2);
assert(Math.abs(between.difference-2/3)<1e-6,'Simple Year 12 top-minus-bottom example should have area 2/3');
assert(between.upperArea>between.lowerArea,'The Year 12 introduction must keep the top curve above the bottom curve on the chosen interval');
const adjacent=adjacentIntervalState(f,0,1,3);
assert(Math.abs(adjacent.whole-adjacent.sum)<1e-6,'Adjacent interval areas must add');
const reversed=reversedIntervalState(f,1,3);
assert(Math.abs(reversed.reversed+reversed.forward)<1e-6,'Reversing limits must negate the integral');
assert(getMemoryItemsForTopic(topicId).length>=10);
assert(getMemoryGamePackForTopic(topicId));
assert(getMemoryReviewPackForTopic(topicId));
const runner=createGeneratorRunner({debugSeed:'step46'});
for(const mode of ['ao1','ao2','ao3']) for(const activity of integrationAreaTopic.activities.filter(a=>a.mode===mode)){
  const setDef=getQuestionSetDefinitionForActivity(activity.activityId);
  assert(setDef,`Missing question set ${activity.activityId}`);
  const set=runner.generateSet(setDef);
  assert(set.questions.length>0);
  assert(set.questions.every(q=>q.metadata.assessmentObjective===mode));
}
assert.equal(getSupportTargetForMicroSkill('skill:y12:integration:area:arbitrary-lower-limit','understand')?.activityId,'activity:y12:integration:area:understand:remove-unwanted-region');
assert.equal(getSupportTargetForMicroSkill('skill:y12:integration:area:endpoint-difference','understand')?.activityId,'activity:y12:integration:area:understand:endpoint-difference');
assert.equal(getSupportTargetForMicroSkill('skill:y12:integration:area:visual-properties','ao1')?.activityId,'activity:y12:integration:area:ao1:visual-properties');
const understand=readFileSync(new URL('../src/scripts/integration-area-understand.js',import.meta.url),'utf8');
assert.match(understand,/createAreaExplorer/,'Step 46 must reuse AreaExplorer');
assert.match(understand,/lockedLowerLimit:\s*0/,'The first exploration must lock the lower limit at zero');
assert.match(understand,/Remove 0 → a/,'The arbitrary lower limit must be introduced by removing the unwanted initial region');
assert.match(understand,/F\(b\).*F\(a\)/s,'The visual subtraction must connect to F(b)-F(a)');
assert.match(understand,/(?:Area between two curves|Required area) = (?:top area|area under top curve) − (?:bottom area|area under bottom curve)/,'Year 12 must include the simple top-minus-bottom introduction.');
assert.match(understand,/A\(x\) − B\(x\)/,'The simple between-curves visual must connect subtraction of areas to one integrand.');
assert.match(understand,/Year 13 you will revisit areas where curves cross/,'The Year 12 page must explicitly defer crossings and advanced method choice to Year 13.');
assert.doesNotMatch(understand,/Riemann|limit of a sum/i,'Step 46 must not introduce integration as the limit of a sum');
const areaSource=readFileSync(new URL('../src/scripts/area-explorer.js',import.meta.url),'utf8');
assert.match(areaSource,/showAdvancedReadout = true/,'AreaExplorer defaults must preserve its existing advanced presentation');
assert.match(areaSource,/showSplitControls = true/,'AreaExplorer defaults must preserve split controls for later signed-area work');
const app=readFileSync(new URL('../src/scripts/app-shell.js',import.meta.url),'utf8');
assert.match(app,/createIntegrationAreaUnderstandExperience/);
assert.match(app,/integrationAreaMemoryLabHost/);
const html=readFileSync(new URL('../src/index.html',import.meta.url),'utf8');
assert.match(html,/topic:y12:integration:area/);
assert.match(html,/integration-area-understand\.css/);
console.log('PASS Step 46 Integration as Area lower-zero, removed-region, endpoint-difference and visual-property contracts');
