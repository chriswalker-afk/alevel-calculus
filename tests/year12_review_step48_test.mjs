import assert from 'node:assert/strict';
import fs from 'node:fs';
import { year12ReviewTopic } from '../src/scripts/topic-content/year12-review.js';
import { year12ReviewLearningModes } from '../src/scripts/year12-review-activities.js';
import { getMemoryItemsForTopic } from '../src/scripts/memory-content.js';
import { getMemoryGamePackForTopic } from '../src/scripts/memory-game-content.js';
import { getMemoryReviewPackForTopic } from '../src/scripts/memory-review-content.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';
import { createDiagnosticRouter } from '../src/scripts/diagnostic-router.js';
import { createMasteryFeedbackModel } from '../src/scripts/mastery-feedback-model.js';
import { getYear12ReviewMicroSkill } from '../src/scripts/year12-review-model.js';

const topicId='topic:y12:review:calculus-mastery';
assert.equal(year12ReviewTopic.topicId,topicId);
assert.deepEqual(year12ReviewTopic.modes,['memorise','ao1','ao2','ao3'],'Review must not invent an Understand journey.');
assert(year12ReviewTopic.activities.every(a=>a.implementationStep===48));
for(const mode of year12ReviewTopic.modes){
  assert.deepEqual(year12ReviewLearningModes[mode].activities.map(a=>a.activityId),year12ReviewTopic.activities.filter(a=>a.mode===mode).map(a=>a.activityId));
}

const rememberSlugs=['gradient-derivatives','first-principles','tangents-normals','stationary-points','increasing-decreasing','integration','definite-integration','areas'];
for(const slug of rememberSlugs) assert(year12ReviewTopic.activities.some(a=>a.mode==='memorise'&&a.slug===slug),`Missing Things to Remember section: ${slug}`);
const vocabularySlugs=['vocabulary-flashcards','definition-matching','diagram-notation-check','mixed-recall'];
for(const slug of vocabularySlugs) assert(year12ReviewTopic.activities.some(a=>a.mode==='memorise'&&a.slug===slug),`Missing Vocabulary Check activity: ${slug}`);

const memory=getMemoryItemsForTopic(topicId);
assert(memory.length>=80,'Combined Year 12 vocabulary/notation bank should be comprehensive.');
assert(memory.some(item=>item.learn?.notation),'Review bank must include notation-to-meaning retrieval.');
assert(getMemoryGamePackForTopic(topicId)?.build && getMemoryGamePackForTopic(topicId)?.sort,'Review must reuse the shared declarative Memory Lab games.');
assert(getMemoryReviewPackForTopic(topicId)?.diagram,'Review must include diagram recall.');

const ao1=getQuestionSetDefinitionForActivity('activity:y12:review:calculus-mastery:ao1:topic-blind-mixed');
const ao2=getQuestionSetDefinitionForActivity('activity:y12:review:calculus-mastery:ao2:topic-blind-mixed');
const ao3=getQuestionSetDefinitionForActivity('activity:y12:review:calculus-mastery:ao3:topic-blind-mixed');
const mastery=getQuestionSetDefinitionForActivity('activity:y12:review:calculus-mastery:ao3:diagnostic-mastery');
for(const set of [ao1,ao2,ao3,mastery]) assert(set?.definitions.length>=8,'Each mixed review set should draw broadly from completed Year 12 calculus.');
assert(ao1.definitions.every(d=>d.assessmentObjective==='ao1'));
assert(ao2.definitions.every(d=>d.assessmentObjective==='ao2'));
assert(ao3.definitions.every(d=>d.assessmentObjective==='ao3'));
assert.deepEqual(new Set(mastery.definitions.map(d=>d.assessmentObjective)),new Set(['ao1','ao2','ao3']),'Mastery must mix AO1/AO2/AO3.');

const ao1Topics=new Set(ao1.definitions.map(d=>d.topicId));
for(const required of ['topic:y12:differentiation:basics','topic:y12:differentiation:first-principles','topic:y12:differentiation:tangents-normals','topic:y12:differentiation:stationary-points','topic:y12:differentiation:increasing-decreasing','topic:y12:integration:introduction','topic:y12:integration:definite-indefinite','topic:y12:integration:area','topic:y12:integration:signed-area']) assert(ao1Topics.has(required),`AO1 mixed set missing ${required}`);
assert(ao3.definitions.some(d=>d.templateId.includes('reconstruct-from-derivative')),'AO3 must include reconstruction combining differentiation/integration.');

const runner=createGeneratorRunner({debugSeed:48});
const generated=runner.generateSet(mastery);
assert.equal(generated.questions.length,mastery.definitions.length);
assert(generated.questions.every(q=>q.metadata?.microSkillId),'Mastery questions must retain micro-skill metadata.');
assert(generated.questions.every(q=>getYear12ReviewMicroSkill(q.metadata.microSkillId)||q.metadata.topicId===topicId),'Source diagnostic metadata must remain traceable.');

const targetQuestion=generated.questions.find(q=>q.metadata.topicId!==topicId && q.metadata.defaultDiagnostic);
assert(targetQuestion,'Mastery should contain source-topic questions with exact diagnostic metadata.');
const router=createDiagnosticRouter();
const diagnostic=router.routeOutcome({success:false,metadata:targetQuestion.metadata,errorCategory:null});
assert(diagnostic?.target?.activityId,'A failed mixed question must resolve to an exact support activity.');
assert.notEqual(diagnostic.target.topicId,topicId,'Default weakness routing should return to a source Year 12 teaching topic.');
const feedback=createMasteryFeedbackModel({router}).summarise([{success:false,metadata:targetQuestion.metadata,errorCategory:null}]);
assert.equal(feedback.weaknesses.length,1);
assert.equal(feedback.weaknesses[0].nextStep?.activityId,diagnostic.target.activityId);

const shell=fs.readFileSync(new URL('../src/scripts/app-shell.js',import.meta.url),'utf8');
assert.match(shell,/year12ReviewLearningModes/);
assert.match(shell,/year12ReviewOutcomeHistory/,'Review mastery evidence must be isolated from earlier-topic attempts.');
assert.match(shell,/topicId: isReview \? currentTopicId/,'Mixed source questions must count toward Review progress, not mutate source-topic progress.');
assert.match(shell,/syncYear12MasterySummary/);
assert.match(shell,/getYear12ReviewMicroSkillLabel/);
const questionShell=fs.readFileSync(new URL('../src/scripts/question-shell.js',import.meta.url),'utf8');
assert.doesNotMatch(questionShell,/year12Review|calculus-mastery/i,'Frozen QuestionShell must remain topic-agnostic.');
const html=fs.readFileSync(new URL('../src/index.html',import.meta.url),'utf8');
assert.match(html,/data-year12-mastery-summary/);
assert.match(html,/topic:y12:review:calculus-mastery/);

console.log('PASS Step 48 Year 12 consolidated recall, topic-blind mixed practice and exact diagnostic mastery contracts');
