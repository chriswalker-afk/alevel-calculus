import assert from 'node:assert/strict';
import fs from 'node:fs';
import { STANDARD_FUNCTIONS, createStandardFunctionDefinition } from '../src/scripts/linked-function-gradient-explorer.js';
import { standardFunctionsTopic } from '../src/scripts/topic-content/standard-functions.js';
import { standardFunctionsLearningModes } from '../src/scripts/standard-functions-activities.js';
import { getMemoryItemsForTopic } from '../src/scripts/memory-content.js';
import { getMemoryGamePackForTopic } from '../src/scripts/memory-game-content.js';
import { getMemoryReviewPackForTopic } from '../src/scripts/memory-review-content.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { getHelpTargets, getSupportTargetForMicroSkill } from '../src/scripts/help-content.js';
import { getVocabularyTerm } from '../src/scripts/vocabulary-data.js';
assert.equal(standardFunctionsTopic.scopeId,'y13-additional');
assert.equal(standardFunctionsTopic.routeScope,'y13');
assert.deepEqual(standardFunctionsTopic.modes,['understand','memorise','ao1','ao2','ao3']);
assert.equal(standardFunctionsTopic.activities.length,16);
for(const mode of standardFunctionsTopic.modes) assert.ok(standardFunctionsLearningModes[mode].activities.length>0);
for(const id of ['sin-x','cos-x','exp-x','ln-x','sin-2x','cos-3x','exp-2x','ln-2x','two-3x']) assert.ok(STANDARD_FUNCTIONS.some(f=>f.id===id),id);
for(const f of STANDARD_FUNCTIONS){const x=f.initialX,h=1e-6,n=(f.evaluate(x+h)-f.evaluate(x-h))/(2*h);assert.ok(Math.abs(n-f.derivative(x))<1e-4,`${f.id}: ${n} vs ${f.derivative(x)}`)}
for(const scale of [0.5,1,2,4]){const f=createStandardFunctionDefinition({id:`sin-${scale}`,label:'test',kind:'sin',scale});const x=.37,h=1e-6;assert.ok(Math.abs((f.evaluate(x+h)-f.evaluate(x-h))/(2*h)-f.derivative(x))<1e-4)}
for(const id of standardFunctionsTopic.vocabularyTags) assert.ok(getVocabularyTerm(id),id);
assert.ok(getMemoryItemsForTopic(standardFunctionsTopic.topicId).length>=10);
assert.ok(getMemoryGamePackForTopic(standardFunctionsTopic.topicId));assert.ok(getMemoryReviewPackForTopic(standardFunctionsTopic.topicId));
for(const a of standardFunctionsTopic.activities.filter(a=>['ao1','ao2','ao3'].includes(a.mode))) assert.ok(getQuestionSetDefinitionForActivity(a.activityId),a.activityId);
assert.equal(getHelpTargets(standardFunctionsTopic.topicId).length,3);
assert.ok(getSupportTargetForMicroSkill('skill:y13:differentiation:standard-functions:scaled-rules','ao1'));
const html=fs.readFileSync(new URL('../src/index.html',import.meta.url),'utf8'); const app=fs.readFileSync(new URL('../src/scripts/app-shell.js',import.meta.url),'utf8'); const understand=fs.readFileSync(new URL('../src/scripts/standard-functions-understand.js',import.meta.url),'utf8');
assert.match(html,/topic:y13:differentiation:standard-functions/);assert.match(html,/standard-functions-understand\.css/);assert.match(app,/standardFunctionsLearningModes/);assert.match(app,/scopeId: "y13-additional"/);assert.match(understand,/RADIAN MODE/);assert.match(understand,/derivativePanelVisible:true/);
console.log('Step 50 standard functions tests passed.');
