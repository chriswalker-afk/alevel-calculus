import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parametricDifferentiationTopic } from '../src/scripts/topic-content/parametric-differentiation.js';
import { parametricDifferentiationLearningModes } from '../src/scripts/parametric-differentiation-activities.js';
import { calculateParametricState, calculateCoordinateRanges, PARAMETRIC_CURVES } from '../src/scripts/parametric-curve-tracer.js';
import { getMemoryItemsForTopic } from '../src/scripts/memory-content.js';
import { getMemoryGamePackForTopic } from '../src/scripts/memory-game-content.js';
import { getMemoryReviewPackForTopic } from '../src/scripts/memory-review-content.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';
import { getSupportTargetForMicroSkill, getHelpTargets } from '../src/scripts/help-content.js';
import { getVocabularyTerm } from '../src/scripts/vocabulary-data.js';
import { getClassWizSupportPack } from '../src/scripts/classwiz-support-data.js';

const topic=parametricDifferentiationTopic;
assert.equal(topic.scopeId,'y13-additional');
assert.equal(topic.routeScope,'y13');
assert.equal(topic.sequence,210);
assert.deepEqual(topic.modes,['understand','memorise','ao1','ao2','ao3']);
assert.ok(topic.prerequisiteTopicIds.includes('topic:y13:differentiation:product-quotient-chain'));
assert.equal(topic.activities.filter(a=>a.mode==='understand').length,5);
assert.equal(topic.activities.filter(a=>a.mode==='memorise').length,8);
assert.equal(topic.activities.filter(a=>a.mode==='ao1').length,5);
assert.equal(topic.activities.filter(a=>a.mode==='ao2').length,3);
assert.equal(topic.activities.filter(a=>a.mode==='ao3').length,1);
for(const mode of topic.modes) assert.ok(parametricDifferentiationLearningModes[mode].activities.length>0,mode);
for(const tag of topic.vocabularyTags) assert.ok(getVocabularyTerm(tag),tag);

const parabola=PARAMETRIC_CURVES.find(d=>d.id==='parametric-parabola');
const cubic=PARAMETRIC_CURVES.find(d=>d.id==='parametric-cubic');
assert.ok(parabola && cubic);
const ranges=calculateCoordinateRanges(parabola,[-2,1],2400);
assert.ok(Math.abs(ranges.xRange[0]+2)<1e-9 && Math.abs(ranges.xRange[1]-1)<1e-9);
assert.ok(Math.abs(ranges.yRange[0]+1)<1e-5 && Math.abs(ranges.yRange[1]-3)<1e-9);
const vertical=calculateParametricState(cubic,0);
assert.equal(vertical.dxdt,0); assert.equal(vertical.dydt,-3); assert.equal(vertical.dydx,-Infinity);

const memory=getMemoryItemsForTopic(topic.topicId);
assert.ok(memory.length>=12);
assert.ok(memory.some(x=>x.learn.notation==='dy/dx=(dy/dt)/(dx/dt)'));
assert.ok(memory.some(x=>x.learn.statement.toLowerCase().includes('chain rule')));
assert.ok(memory.some(x=>x.learn.statement.toLowerCase().includes('vertical')));
assert.ok(getMemoryGamePackForTopic(topic.topicId));
assert.ok(getMemoryReviewPackForTopic(topic.topicId));
assert.equal(getHelpTargets(topic.topicId).length,3);
for(const [skill,need] of [['trace-and-evaluate','understand'],['domain-range','understand'],['elimination','ao1'],['parametric-gradient','memorise'],['vertical-tangents','understand'],['tangents','ao1'],['applications','ao1']]) {
  assert.ok(getSupportTargetForMicroSkill(`skill:y13:differentiation:parametric-differentiation:${skill}`,need),`${skill}:${need}`);
}
const cw=getClassWizSupportPack(topic.topicId); assert.ok(cw); assert.equal(cw.defaultUseCaseId,'paired-table');
assert.match(cw.introduction,/do not replace/i);

const runner=createGeneratorRunner({debugSeed:'step54'});
for(const activity of topic.activities.filter(a=>['ao1','ao2','ao3'].includes(a.mode))){
  const set=getQuestionSetDefinitionForActivity(activity.activityId); assert.ok(set,activity.activityId);
  for(let i=0;i<8;i++){
    const generated=runner.generateSet({...set,seed:`step54-${activity.slug}-${i}`});
    assert.ok(generated.questions.length>0);
    for(const q of generated.questions){assert.equal(q.metadata.topicId,topic.topicId);assert.equal(q.metadata.assessmentObjective,activity.mode);assert.ok(q.solutionSteps.length>0);}
  }
}
const chainSet=getQuestionSetDefinitionForActivity('activity:y13:differentiation:parametric-differentiation:ao2:explain-chain-rule');
assert.ok(chainSet.definitions[0].errorCategories.includes('chain-justification'));
const verticalSet=getQuestionSetDefinitionForActivity('activity:y13:differentiation:parametric-differentiation:ao2:vertical-tangent-reasoning');
assert.ok(verticalSet.definitions[0].errorCategories.includes('vertical-tangent'));

const tracer=fs.readFileSync(new URL('../src/scripts/parametric-curve-tracer.js',import.meta.url),'utf8');
const tracerCss=fs.readFileSync(new URL('../src/styles/parametric-curve-tracer.css',import.meta.url),'utf8');
const understand=fs.readFileSync(new URL('../src/scripts/parametric-differentiation-understand.js',import.meta.url),'utf8');
const app=fs.readFileSync(new URL('../src/scripts/app-shell.js',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../src/index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/styles/parametric-differentiation-understand.css',import.meta.url),'utf8');
assert.match(tracer,/calculateCoordinateRanges/); assert.match(tracer,/parametric-tracer__vertical-tangent/);
assert.match(tracerCss,/parametric-tracer__full-curve[^}]*opacity:\s*\.28/s);
assert.match(understand,/ParametricCurveTracer/); assert.match(understand,/renderEquationSteps/);
assert.match(understand,/chain rule/i); assert.match(understand,/intuition/i); assert.match(understand,/dx\/dt=0/);
assert.doesNotMatch(understand,/new DiagramPrimitives/);
assert.match(app,/parametricDifferentiationLearningModes/); assert.match(app,/parametricDifferentiationMemoryLabHost/);
assert.match(app,/topic:y13:differentiation:parametric-differentiation/);
assert.match(html,/parametric-differentiation-understand\.css/); assert.match(html,/parametric-curve-tracer\.css/);
assert.match(css,/min-height:\s*44px/); assert.match(css,/@media\s*\(max-width:\s*700px\)/);
console.log('PASS Step 54 parametric tracing, restricted ranges, elimination, chain-rule gradient, vertical tangents, Memory Lab, diagnostics and AO1-AO3 contracts');
