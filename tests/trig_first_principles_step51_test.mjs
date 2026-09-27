import assert from 'node:assert/strict';
import fs from 'node:fs';
import { trigFirstPrinciplesTopic } from '../src/scripts/topic-content/trig-first-principles.js';
import { trigFirstPrinciplesLearningModes } from '../src/scripts/trig-first-principles-activities.js';
import { getMemoryItemsForTopic } from '../src/scripts/memory-content.js';
import { getMemoryGamePackForTopic } from '../src/scripts/memory-game-content.js';
import { getMemoryReviewPackForTopic } from '../src/scripts/memory-review-content.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';
import { getHelpTargets, getSupportTargetForMicroSkill } from '../src/scripts/help-content.js';
import { getVocabularyTerm } from '../src/scripts/vocabulary-data.js';
import { getClassWizSupportPack } from '../src/scripts/classwiz-support-data.js';

assert.equal(trigFirstPrinciplesTopic.scopeId,'y13-additional');
assert.equal(trigFirstPrinciplesTopic.routeScope,'y13');
assert.equal(trigFirstPrinciplesTopic.sequence,190);
assert.deepEqual(trigFirstPrinciplesTopic.modes,['understand','memorise','ao1','ao2','ao3']);
assert.equal(trigFirstPrinciplesTopic.activities.length,16);
for(const mode of trigFirstPrinciplesTopic.modes) assert.ok(trigFirstPrinciplesLearningModes[mode].activities.length>0,mode);
for(const tag of trigFirstPrinciplesTopic.vocabularyTags) assert.ok(getVocabularyTerm(tag),tag);
assert.ok(getMemoryItemsForTopic(trigFirstPrinciplesTopic.topicId).length>=10);
assert.ok(getMemoryGamePackForTopic(trigFirstPrinciplesTopic.topicId));
assert.ok(getMemoryReviewPackForTopic(trigFirstPrinciplesTopic.topicId));
assert.equal(getHelpTargets(trigFirstPrinciplesTopic.topicId).length,3);
assert.ok(getSupportTargetForMicroSkill('skill:y13:differentiation:trig-first-principles:small-angle-limits','understand'));
assert.ok(getSupportTargetForMicroSkill('skill:y13:differentiation:trig-first-principles:reconstruction','ao1'));
const cw=getClassWizSupportPack(trigFirstPrinciplesTopic.topicId);assert.ok(cw);assert.equal(cw.defaultUseCaseId,'small-angle-table');assert.match(cw.useCases[0].doesNotReplace,/do not/i);
for(const h of [1e-1,1e-2,1e-3,1e-4]){assert.ok(Math.abs(Math.sin(h)/h-1)<h*h/5);assert.ok(Math.abs((Math.cos(h)-1)/h)<h/2+1e-8)}
const runner=createGeneratorRunner({debugSeed:'step51'});
for(const activity of trigFirstPrinciplesTopic.activities.filter(a=>['ao1','ao2','ao3'].includes(a.mode))){const set=getQuestionSetDefinitionForActivity(activity.activityId);assert.ok(set,activity.activityId);for(let i=0;i<12;i++){const generated=runner.generateSet({...set,seed:`step51-${i}`});for(const q of generated.questions){assert.equal(q.metadata.topicId,trigFirstPrinciplesTopic.topicId);assert.ok(q.solutionSteps.length>0);}}}
const html=fs.readFileSync(new URL('../src/index.html',import.meta.url),'utf8');
const app=fs.readFileSync(new URL('../src/scripts/app-shell.js',import.meta.url),'utf8');
const understand=fs.readFileSync(new URL('../src/scripts/trig-first-principles-understand.js',import.meta.url),'utf8');
assert.match(html,/topic:y13:differentiation:trig-first-principles/);assert.match(html,/topic-index">19/);assert.match(html,/trig-first-principles-understand\.css/);
assert.match(app,/trigFirstPrinciplesLearningModes/);assert.match(app,/classWiz: true/);
assert.match(understand,/new DiagramPrimitives/);assert.match(understand,/Unit circle/);assert.match(understand,/lim_\(h→0\) \(sin h\)\/h = 1/);assert.match(understand,/\(cos h−1\)\/h→0/);assert.match(understand,/renderEquationSteps/);assert.match(understand,/RADIAN MODE/);
console.log('PASS Step 51 trig first-principles small-angle evidence, proof reconstruction, Memory Lab, ClassWiz evidence and AO1-AO3 contracts');
