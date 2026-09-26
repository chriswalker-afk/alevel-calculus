import assert from 'node:assert/strict';
import fs from 'node:fs';
import { signedAreaTopic } from '../src/scripts/topic-content/signed-area.js';
import { signedAreaLearningModes } from '../src/scripts/signed-area-activities.js';
import { SIGNED_AREA_FUNCTIONS, compareSignedAndGeometrical, requiredRootSplits } from '../src/scripts/signed-area-model.js';
import { getMemoryItemsForTopic } from '../src/scripts/memory-content.js';
import { getMemoryGamePackForTopic } from '../src/scripts/memory-game-content.js';
import { getMemoryReviewPackForTopic } from '../src/scripts/memory-review-content.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { getSupportTargetForMicroSkill } from '../src/scripts/help-content.js';

const topicId='topic:y12:integration:signed-area';
assert.equal(signedAreaTopic.topicId,topicId);
assert.deepEqual(signedAreaTopic.modes,['understand','memorise','ao1','ao2','ao3']);
assert(signedAreaTopic.activities.every(a=>a.implementationStep===47));
for(const mode of signedAreaTopic.modes){
 const metadata=signedAreaTopic.activities.filter(a=>a.mode===mode).map(a=>a.activityId);
 const runtime=signedAreaLearningModes[mode].activities.map(a=>a.activityId);
 assert.deepEqual(runtime,metadata,`Runtime ${mode} order must match TopicMetadata.`);
}

const q=SIGNED_AREA_FUNCTIONS.find(f=>f.id==='signed-area-quadratic');
const roots=requiredRootSplits(q,-2,2);
assert.equal(roots.length,2);
assert(Math.abs(roots[0]+1)<1e-4 && Math.abs(roots[1]-1)<1e-4,'x^2-1 must require splits at -1 and 1.');
const line=SIGNED_AREA_FUNCTIONS.find(f=>f.id==='signed-area-line');
const cancellation=compareSignedAndGeometrical(line,-2,2);
assert(Math.abs(cancellation.integral)<1e-9,'Symmetric y=x signed integral should cancel to zero.');
assert(Math.abs(cancellation.geometricalArea-4)<1e-6,'Symmetric y=x total geometrical area should be 4.');
const quadratic=compareSignedAndGeometrical(q,-2,2);
assert(quadratic.geometricalArea>Math.abs(quadratic.integral),'Crossing quadratic total geometrical area should exceed magnitude of signed integral.');
assert(quadratic.regions.some(r=>r.sign==='positive') && quadratic.regions.some(r=>r.sign==='negative'));

const memory=getMemoryItemsForTopic(topicId);
assert(memory.length>=10,'Step 47 should populate the shared Memory Lab with facts plus vocabulary.');
assert(getMemoryGamePackForTopic(topicId)?.build);
assert(getMemoryReviewPackForTopic(topicId)?.diagram);
for(const mode of ['ao1','ao2','ao3']) for(const activity of signedAreaTopic.activities.filter(a=>a.mode===mode)){
 assert(getQuestionSetDefinitionForActivity(activity.activityId),`Missing generated question set for ${activity.activityId}`);
}
assert.equal(getSupportTargetForMicroSkill('skill:y12:integration:signed-area:split-at-roots','understand')?.activityId,'activity:y12:integration:signed-area:understand:split-the-integral');
assert.equal(getSupportTargetForMicroSkill('skill:y12:integration:signed-area:total-geometrical-area','ao1')?.activityId,'activity:y12:integration:signed-area:ao1:split-and-area');

const understand=fs.readFileSync(new URL('../src/scripts/signed-area-understand.js',import.meta.url),'utf8');
assert.match(understand,/createAreaExplorer/,'Step 47 must reuse AreaExplorer.');
assert.doesNotMatch(understand,/createElementNS|<svg|canvas/i,'Step 47 must not create a parallel graph renderer.');
assert.match(understand,/Split the Integral/,'The explicit split exercise must be present.');
assert.match(understand,/candidates=\[-1,0,1\]/,'The root-selection task must visibly offer roots plus a distractor.');
assert.match(understand,/root → axis crossing → sign change → split integral/,'The required conceptual chain must be explicit.');
const areaSource=fs.readFileSync(new URL('../src/scripts/area-explorer.js',import.meta.url),'utf8');
assert.match(areaSource,/Total geometrical area/);
assert.match(areaSource,/region\.sign === "positive"/);
const html=fs.readFileSync(new URL('../src/index.html',import.meta.url),'utf8');
assert.match(html,/topic:y12:integration:signed-area/);
assert.match(html,/Areas below &amp; crossing the axis/);

console.log('PASS Step 47 signed-area, cancellation, root-splitting, total-area and all-mode contracts');
