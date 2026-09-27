import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { increasingDecreasingTopic } from '../src/scripts/topic-content/increasing-decreasing.js';
import { increasingDecreasingLearningModes } from '../src/scripts/increasing-decreasing-activities.js';
import { defineIntervalSegments, sameIntervalSelection } from '../src/scripts/interval-selection-overlay.js';
import { increasingDecreasingModels, intervalTruth } from '../src/scripts/increasing-decreasing-model.js';
import { getMemoryItemsForTopic } from '../src/scripts/memory-content.js';
import { getMemoryGamePackForTopic } from '../src/scripts/memory-game-content.js';
import { getMemoryReviewPackForTopic } from '../src/scripts/memory-review-content.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';
import { getSupportTargetForMicroSkill } from '../src/scripts/help-content.js';
import { visualClassificationCases, visualClassificationDefinition } from '../src/scripts/question-definitions/increasing-decreasing-assessment.js';
import { graphClassificationFromResponse, graphClassificationResponse, isInteractiveQuestionVisual } from '../src/scripts/question-visual-renderer.js';

const topicId='topic:y12:differentiation:increasing-decreasing';
assert.equal(increasingDecreasingTopic.topicId,topicId);
assert.deepEqual(increasingDecreasingTopic.modes,['understand','memorise','ao1','ao2','ao3']);
for(const mode of increasingDecreasingTopic.modes){
  const metadata=increasingDecreasingTopic.activities.filter(a=>a.mode===mode).map(a=>a.activityId);
  const live=increasingDecreasingLearningModes[mode].activities.map(a=>a.activityId);
  assert.deepEqual(live,metadata,`${mode} live order should match TopicMetadata`);
  assert(live.length>0);
}
assert(increasingDecreasingTopic.activities.every(a=>a.implementationStep===43));
assert.equal(increasingDecreasingLearningModes.understand.activities[0].activityId,'activity:y12:differentiation:increasing-decreasing:understand:appearance-first');
assert.equal(increasingDecreasingLearningModes.understand.activities[3].activityId,'activity:y12:differentiation:increasing-decreasing:understand:select-intervals');

const cubic=increasingDecreasingModels.find(m=>m.id==='cubic-turns');
const segments=defineIntervalSegments(cubic.boundaries);
assert.equal(segments.length,3);
assert(sameIntervalSelection(cubic.increasing,intervalTruth(cubic,'increasing').ids));
assert.equal(cubic.increasingNotation,'(−∞, −1) ∪ (1, ∞)');
assert.equal(cubic.decreasingNotation,'(−1, 1)');
for(const x of [-2,0,2]){
  const sign=Math.sign(cubic.definition.derivative(x));
  if(x===0) assert(sign<0); else assert(sign>0);
}

assert(getMemoryItemsForTopic(topicId).length>=9);
assert(getMemoryGamePackForTopic(topicId));
assert(getMemoryReviewPackForTopic(topicId));
const visualSet=getQuestionSetDefinitionForActivity('activity:y12:differentiation:increasing-decreasing:ao1:visual-classification');
assert.equal(visualSet.definitions[0].diagramConfig.kind,'calculus-graph-classifier');
assert(visualClassificationCases.some(item=>item.scope==='whole'),'Visual classification must include whole-interval examples.');
assert(visualClassificationCases.some(item=>item.scope==='interval'),'Visual classification must include stated-interval examples.');
for(const scenario of visualClassificationCases){
  const prompt=visualClassificationDefinition.promptRenderer(scenario);
  const math=visualClassificationDefinition.mathRenderer(scenario);
  assert(!/f′|gradient|derivative/i.test(prompt+math),'Stage 1 must be solvable from graph appearance without a derivative clue.');
  const response=graphClassificationResponse(scenario.correctGraphId,scenario.correctSign);
  const parsed=graphClassificationFromResponse(response);
  assert.equal(parsed.graphId,scenario.correctGraphId);
  assert.equal(parsed.signId,scenario.correctSign);
  const result=visualClassificationDefinition.answerChecker(response,scenario);
  assert.equal(result.success,true);
  if(scenario.correctSign==='positive') assert.match(result.message,/f′\(x\)>0/);
  if(scenario.correctSign==='negative') assert.match(result.message,/f′\(x\)<0/);
  if(scenario.boundaryZero===0) assert.match(result.message,/f′\(0\)=0/);
}
const visualQuestion=createGeneratorRunner({debugSeed:'step43-visual'}).generate(visualClassificationDefinition,{sequence:0});
assert(isInteractiveQuestionVisual(visualQuestion),'Visual classification must be handled as a shared interactive graph response.');
assert.equal(visualQuestion.options.length,4,'Students must physically choose among graph/function options.');
const wrongSign=visualClassificationDefinition.answerChecker(graphClassificationResponse(
  visualClassificationCases[0].correctGraphId,
  visualClassificationCases[0].correctSign==='positive'?'negative':'positive'
),visualClassificationCases[0]);
assert.equal(wrongSign.errorCategory,'sign-rule','The second stage must diagnose derivative-sign errors separately from appearance errors.');

const runner=createGeneratorRunner({debugSeed:'step43'});
for(const mode of ['ao1','ao2','ao3']){
 for(const activity of increasingDecreasingTopic.activities.filter(a=>a.mode===mode)){
  const setDef=getQuestionSetDefinitionForActivity(activity.activityId); assert(setDef,`Missing question set ${activity.activityId}`);
  const set=runner.generateSet(setDef); assert(set.questions.length>0); assert(set.questions.every(q=>q.metadata.assessmentObjective===mode));
 }
}
assert.equal(getSupportTargetForMicroSkill('skill:y12:differentiation:increasing-decreasing:gradient-sign','understand')?.activityId,'activity:y12:differentiation:increasing-decreasing:understand:derivative-sign');
assert.equal(getSupportTargetForMicroSkill('skill:y12:differentiation:increasing-decreasing:derivative-inequalities','ao1')?.activityId,'activity:y12:differentiation:increasing-decreasing:ao1:solve-inequalities');
const app=readFileSync(new URL('../src/scripts/app-shell.js',import.meta.url),'utf8');
assert.match(app,/createIncreasingDecreasingUnderstandExperience/);
assert.match(app,/increasingDecreasingMemoryLabHost/);
const visualRendererSource=readFileSync(new URL('../src/scripts/question-visual-renderer.js',import.meta.url),'utf8');
assert.match(visualRendererSource,/question-graph-classifier__card/,'The student must select graph cards, not only text options.');
assert.match(visualRendererSource,/signStage\.hidden = !graphSelected/,'Derivative-sign choices must stay hidden until a graph has been selected.');
assert.match(visualRendererSource,/Stage 2 · Connect appearance to the derivative/,'The derivative connection must be a distinct second stage.');
const html=readFileSync(new URL('../src/index.html',import.meta.url),'utf8');
assert.match(html,/topic:y12:differentiation:increasing-decreasing/);
assert.match(html,/interval-selection-overlay\.css/);
console.log('PASS Step 43 Increasing/Decreasing appearance-first, interval-selection, memory, assessment and algebra-agreement contracts');
