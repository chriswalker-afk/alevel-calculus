import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stationaryPointsTopic } from '../src/scripts/topic-content/stationary-points.js';
import { stationaryPointsLearningModes } from '../src/scripts/stationary-points-activities.js';
import { getMemoryItemsForTopic } from '../src/scripts/memory-content.js';
import { getMemoryGamePackForTopic } from '../src/scripts/memory-game-content.js';
import { getMemoryReviewPackForTopic } from '../src/scripts/memory-review-content.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';
import { getSupportTargetForMicroSkill } from '../src/scripts/help-content.js';
import { secondDerivativeDefinition } from '../src/scripts/question-definitions/stationary-points-assessment.js';

const topicId='topic:y12:differentiation:stationary-points';
assert.equal(stationaryPointsTopic.topicId,topicId);
assert.deepEqual(stationaryPointsTopic.modes,['understand','memorise','ao1','ao2','ao3']);
for(const mode of stationaryPointsTopic.modes){
  const metadata=stationaryPointsTopic.activities.filter(a=>a.mode===mode).map(a=>a.activityId);
  const live=stationaryPointsLearningModes[mode].activities.map(a=>a.activityId);
  assert.deepEqual(live,metadata,`${mode} live order should match TopicMetadata`);
  assert(live.length>0,`${mode} should be implemented in Step 42`);
}
const step42=stationaryPointsTopic.activities.filter(a=>a.mode!=='understand');
assert(step42.every(a=>a.implementationStep===42));
assert.equal(step42.length,12);

assert(getMemoryItemsForTopic(topicId).length>=12,'Stationary Points should have a substantive MemoryItem bank');
assert(getMemoryGamePackForTopic(topicId));
assert(getMemoryReviewPackForTopic(topicId));

const runner=createGeneratorRunner({debugSeed:'step42'});
for(const mode of ['ao1','ao2','ao3']){
  for(const activity of stationaryPointsTopic.activities.filter(a=>a.mode===mode)){
    const def=getQuestionSetDefinitionForActivity(activity.activityId);
    assert(def,`Missing question set for ${activity.activityId}`);
    const set=runner.generateSet(def);
    assert(set.questions.length>0);
    assert(set.questions.every(q=>q.metadata.assessmentObjective===mode));
  }
}
const signSet=getQuestionSetDefinitionForActivity('activity:y12:differentiation:stationary-points:ao1:sign-test');
const signQuestions=runner.generateSet(signSet).questions;
assert.equal(signQuestions.length,3);
const prompts=signQuestions.map(q=>q.prompt+' '+q.math).join(' ');
assert.match(prompts,/positive.*negative|\+ → 0 → −/s);
assert.match(prompts,/negative.*positive|− → 0 → \+/s);
assert.match(prompts,/positive.*positive|\+ → 0 → \+/s);

const zeroParams={v:0,answer:'inconclusive'};
assert.equal(secondDerivativeDefinition.answerChecker('inc',zeroParams).success,true);
assert.equal(secondDerivativeDefinition.answerChecker('max',zeroParams).errorCategory,'inconclusive-zero');

assert.equal(getSupportTargetForMicroSkill('skill:y12:differentiation:stationary-points:zero-gradient','ao1')?.activityId,'activity:y12:differentiation:stationary-points:ao1:find-stationary');
assert.equal(getSupportTargetForMicroSkill('skill:y12:differentiation:stationary-points:first-derivative-sign-test','ao1')?.activityId,'activity:y12:differentiation:stationary-points:ao1:sign-test');
assert.equal(getSupportTargetForMicroSkill('skill:y12:differentiation:stationary-points:second-derivative-meaning','ao1')?.activityId,'activity:y12:differentiation:stationary-points:ao1:second-derivative-test');
assert.equal(getSupportTargetForMicroSkill('skill:y12:differentiation:stationary-points:stationary-inflection','understand')?.activityId,'activity:y12:differentiation:stationary-points:understand:stationary-inflection');

const understandSource=readFileSync(new URL('../src/scripts/stationary-points-understand.js',import.meta.url),'utf8');
assert.match(understandSource,/Stationary','f′\(a\)=0'/,'The Understand page must define stationary explicitly.');
assert.match(understandSource,/Turning point','f′ changes sign'/,'The Understand page must define a turn by a derivative sign change.');
assert.match(understandSource,/Stationary point of inflection','f′\(a\)=0, but no turn'/,'A stationary inflection must be explicitly distinguished from a turning point.');
assert.match(understandSource,/“turning point”, “local maximum” and “local minimum” are not/,'x³ at the origin must not be described as a turning point or local extremum.');

const app=readFileSync(new URL('../src/scripts/app-shell.js',import.meta.url),'utf8');
assert.match(app,/stationaryPointsMemoryLabHost/);
const topicSlice=app.slice(app.indexOf('"topic:y12:differentiation:stationary-points"'),app.indexOf('"topic:y12:differentiation:stationary-points"')+500);
assert.match(topicSlice,/availableModes:\s*Object\.freeze\(\[\.\.\.learningModeOrder\]\)/);
console.log('PASS Step 42 Stationary/Turning Points Memorise/AO1-AO3, shared-memory, generated-assessment and classification contracts');
