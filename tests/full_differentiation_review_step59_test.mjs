import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { fullDifferentiationReviewTopic } from '../src/scripts/topic-content/full-differentiation-review.js';
import { fullDifferentiationReviewLearningModes } from '../src/scripts/full-differentiation-review-activities.js';
import { fullDifferentiationReviewSourceTopics } from '../src/scripts/full-differentiation-review-model.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';
import { createDiagnosticRouter } from '../src/scripts/diagnostic-router.js';
import { createMasteryFeedbackModel } from '../src/scripts/mastery-feedback-model.js';
import { getMemoryItemsForTopic } from '../src/scripts/memory-content.js';
import { getMemoryGamePackForTopic } from '../src/scripts/memory-game-content.js';
import { getMemoryReviewPackForTopic } from '../src/scripts/memory-review-content.js';
import { getSupportTargetForMicroSkill } from '../src/scripts/help-content.js';

const topicId='topic:full:review:calculus-mastery';
assert.equal(fullDifferentiationReviewTopic.topicId,topicId);
assert.equal(fullDifferentiationReviewTopic.scopeId,'full-alevel');
assert.deepEqual(fullDifferentiationReviewTopic.modes,['memorise','ao1','ao2','ao3']);
assert(fullDifferentiationReviewTopic.activities.every(a=>a.implementationStep===59));
for(const mode of fullDifferentiationReviewTopic.modes) assert.ok(fullDifferentiationReviewLearningModes[mode].activities.length>0,`missing ${mode}`);
assert.equal(fullDifferentiationReviewSourceTopics.length,13);
assert(fullDifferentiationReviewSourceTopics.every(t=>t.strand==='differentiation'),'Step 59 source set must remain differentiation-only.');
assert(!fullDifferentiationReviewSourceTopics.some(t=>t.topicId.includes(':integration:')),'Year 12 integration must not leak into differentiation review.');

const methodSet=getQuestionSetDefinitionForActivity('activity:full:review:calculus-mastery:ao1:method-selection-only');
assert.equal(methodSet.definitions.length,7);
assert(methodSet.definitions.every(d=>d.topicId===topicId && d.assessmentObjective==='ao1'));
assert(methodSet.definitions.every(d=>d.methodTags.includes('method-selection-only')));
const methodLabels=methodSet.definitions.map(d=>d.templateId).join(' ');
for(const cue of ['product-chain','quotient-chain','parametric','implicit','inverse-relation','connected-rates','second-derivative']) assert(methodLabels.includes(cue),`method-only set missing ${cue}`);

const ao1=getQuestionSetDefinitionForActivity('activity:full:review:calculus-mastery:ao1:topic-blind-fluency');
const ao2=getQuestionSetDefinitionForActivity('activity:full:review:calculus-mastery:ao2:justify-and-diagnose');
const ao3=getQuestionSetDefinitionForActivity('activity:full:review:calculus-mastery:ao3:mixed-applications');
const mastery=getQuestionSetDefinitionForActivity('activity:full:review:calculus-mastery:ao3:diagnostic-mastery');
for(const set of [ao1,ao2,ao3,mastery]) assert.ok(set?.definitions.length>=10,'mixed sets should draw broadly across differentiation');
assert(ao1.definitions.every(d=>d.assessmentObjective==='ao1'));
assert(ao2.definitions.every(d=>d.assessmentObjective==='ao2'));
assert(ao3.definitions.every(d=>d.assessmentObjective==='ao3'));
assert.deepEqual(new Set(mastery.definitions.map(d=>d.assessmentObjective)),new Set(['ao1','ao2','ao3']));
const sourceTopicIds=new Set(ao1.definitions.map(d=>d.topicId));
for(const required of ['topic:y12:differentiation:basics','topic:y13:differentiation:standard-functions','topic:y13:differentiation:product-quotient-chain','topic:y13:differentiation:parametric-differentiation','topic:y13:differentiation:implicit-differentiation','topic:y13:differentiation:trig-identities-inverse','topic:y13:differentiation:concavity-inflection','topic:y13:differentiation:connected-rates']) assert(sourceTopicIds.has(required),`AO1 topic-blind set missing ${required}`);

const runner=createGeneratorRunner({debugSeed:'step59'});
for(const set of [methodSet,ao1,ao2,ao3,mastery]) { const generated=runner.generateSet(set); assert.equal(generated.questions.length,set.definitions.length); assert(generated.questions.every(q=>q.metadata?.microSkillId)); }
const wrongMethod=runner.generateSet(methodSet).questions[0];
const router=createDiagnosticRouter();
const recognition=router.routeOutcome({success:false,metadata:wrongMethod.metadata,errorCategory:'method-choice'});
assert.equal(recognition.kind,'recognition');
assert.equal(recognition.target.activityId,'activity:full:review:calculus-mastery:memorise:method-map');
const executionSource=runner.generateSet(mastery).questions.find(q=>q.metadata.topicId!==topicId && Object.values(q.metadata.diagnosticRules??{}).some(r=>r.kind==='execution'));
assert(executionSource,'mastery must retain a source question capable of execution diagnosis');
const executionRule=Object.entries(executionSource.metadata.diagnosticRules).find(([,r])=>r.kind==='execution');
const execution=router.routeOutcome({success:false,metadata:executionSource.metadata,errorCategory:executionRule[0]});
assert.equal(execution.kind,'execution');
assert.notEqual(execution.target.topicId,topicId,'execution weakness should route to the precise source teaching topic');
const snapshot=createMasteryFeedbackModel({router}).summarise([
 {success:false,metadata:wrongMethod.metadata,errorCategory:'method-choice'},
 {success:false,metadata:executionSource.metadata,errorCategory:executionRule[0]}
]);
assert(snapshot.weaknesses.some(w=>w.recognitionErrors>0));
assert(snapshot.weaknesses.some(w=>w.executionErrors>0));

assert.ok(getMemoryItemsForTopic(topicId).length>=8);
assert.ok(getMemoryGamePackForTopic(topicId)?.sort);
assert.ok(getMemoryReviewPackForTopic(topicId)?.rapid);
assert.equal(getSupportTargetForMicroSkill('skill:full:review:calculus-mastery:method-selection','ao1').activityId,'activity:full:review:calculus-mastery:ao1:method-selection-only');

const app=await fs.readFile(new URL('../src/scripts/app-shell.js',import.meta.url),'utf8');
assert.match(app,/fullDifferentiationReviewLearningModes/);
assert.match(app,/fullDifferentiationReviewOutcomeHistory/);
assert.match(app,/isFullDifferentiationReview/);
assert.match(app,/topicId: isReview \? currentTopicId/);
const html=await fs.readFile(new URL('../src/index.html',import.meta.url),'utf8');
assert.match(html,/data-course-scope="full-alevel"/);
assert.match(html,/Differentiation review &amp; mastery/);
assert.match(html,/data-full-differentiation-mastery-summary/);
console.log('PASS Step 59 full differentiation recall, method-selection-only, topic-blind AO1-AO3 and recognition-vs-execution mastery contracts');
