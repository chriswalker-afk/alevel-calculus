import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { reverseChainRuleTopic } from '../src/scripts/topic-content/reverse-chain-rule.js';
import { reverseChainRuleLearningModes } from '../src/scripts/reverse-chain-rule-activities.js';
import { INTEGRATION_RECOGNITION_TAGS, RECOGNITION_FAMILIES, REVERSE_CHAIN_RECOGNITION_EXAMPLES, STANDARD_INTEGRAL_RECOGNITION_SOURCE } from '../src/scripts/reverse-chain-recognition-data.js';
import { STANDARD_INTEGRAL_DEFINITIONS } from '../src/scripts/standard-integrals-data.js';
import { reverseChainRuleMemoryItems, getMemoryItemsForTopic } from '../src/scripts/memory-content.js';
import { getMemoryGamePackForTopic } from '../src/scripts/memory-game-content.js';
import { getMemoryReviewPackForTopic } from '../src/scripts/memory-review-content.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { getSupportTargetForMicroSkill } from '../src/scripts/help-content.js';

const topicId='topic:y13:integration:reverse-chain-rule';
assert.equal(reverseChainRuleTopic.topicId,topicId);
assert.equal(reverseChainRuleTopic.sequence,280);
assert.deepEqual(reverseChainRuleTopic.modes,['understand','memorise','ao1','ao2','ao3']);
assert.ok(reverseChainRuleTopic.prerequisiteTopicIds.includes('topic:y13:differentiation:product-quotient-chain'));
assert.ok(reverseChainRuleTopic.prerequisiteTopicIds.includes('topic:y13:integration:standard-integrals'));
for(const mode of ['understand','memorise','ao1','ao2','ao3']) assert.ok(reverseChainRuleLearningModes[mode].activities.length>0,`${mode} should have activities`);

assert.equal(STANDARD_INTEGRAL_RECOGNITION_SOURCE,STANDARD_INTEGRAL_DEFINITIONS,'Step 61 must reuse the Step 60 canonical standard-integral array by reference');
assert.equal(RECOGNITION_FAMILIES.length,3);
assert.deepEqual(RECOGNITION_FAMILIES.map(x=>x.id),['reverse-chain','f-prime-over-f','neither']);
assert.equal(INTEGRATION_RECOGNITION_TAGS.reverseChain,'reverse-chain');
assert.ok(REVERSE_CHAIN_RECOGNITION_EXAMPLES.some(x=>x.id==='near-miss-variable-factor'&&x.classification==='neither'));
assert.ok(REVERSE_CHAIN_RECOGNITION_EXAMPLES.some(x=>x.id==='near-miss-wrong-inner'&&x.classification==='neither'));
assert.ok(REVERSE_CHAIN_RECOGNITION_EXAMPLES.some(x=>x.id==='tan-kx'&&x.classification==='f-prime-over-f'));
assert.ok(REVERSE_CHAIN_RECOGNITION_EXAMPLES.some(x=>x.id==='cot-kx'&&x.classification==='f-prime-over-f'));
assert.ok(REVERSE_CHAIN_RECOGNITION_EXAMPLES.some(x=>x.id==='odd-power-trig'&&x.classification==='reverse-chain'));
assert.ok(REVERSE_CHAIN_RECOGNITION_EXAMPLES.some(x=>x.structureTags.includes('definite')),'Step 71 separates structure metadata from canonical method tags');
assert.ok(REVERSE_CHAIN_RECOGNITION_EXAMPLES.every(x=>x.standardIntegralIds.every(id=>STANDARD_INTEGRAL_DEFINITIONS.some(f=>f.id===id))),'recognition examples should reference Step 60 fact IDs');

assert.ok(reverseChainRuleMemoryItems.length>=10);
assert.equal(getMemoryItemsForTopic(topicId).length,reverseChainRuleMemoryItems.length);
const games=getMemoryGamePackForTopic(topicId); assert.ok(games?.sort); assert.equal(games.sort.buckets.length,3); assert.ok(games.sort.items.some(x=>x.bucketId==='neither'));
const review=getMemoryReviewPackForTopic(topicId); assert.ok(review?.mix.taskIds.includes('sort'));

const expectedQuestionActivities=[
 'activity:y13:integration:reverse-chain-rule:ao1:classify-only',
 'activity:y13:integration:reverse-chain-rule:ao1:constant-adjustment',
 'activity:y13:integration:reverse-chain-rule:ao1:f-prime-over-f',
 'activity:y13:integration:reverse-chain-rule:ao1:trig-recognition',
 'activity:y13:integration:reverse-chain-rule:ao1:definite-recognition',
 'activity:y13:integration:reverse-chain-rule:ao2:explain-near-misses',
 'activity:y13:integration:reverse-chain-rule:ao2:diagnose-coefficients',
 'activity:y13:integration:reverse-chain-rule:ao3:multi-step-recognition'
];
for(const id of expectedQuestionActivities){const set=getQuestionSetDefinitionForActivity(id);assert.ok(set,`Missing question set ${id}`);assert.ok(set.definitions.length>0);for(const d of set.definitions){assert.equal(d.topicId,topicId);assert.ok(['ao1','ao2','ao3'].includes(d.assessmentObjective));}}
const classification=getQuestionSetDefinitionForActivity(expectedQuestionActivities[0]).definitions[0];
assert.ok(classification.methodTags.includes('reverse-chain'));
assert.ok(classification.methodTags.includes('f-prime-over-f'));
assert.ok(!classification.methodTags.includes('integration-recognition'),'Step 71 removes legacy method aliases');
assert.equal(classification.diagnosticRules.recognition.kind,'recognition');
const coefficient=getQuestionSetDefinitionForActivity('activity:y13:integration:reverse-chain-rule:ao2:diagnose-coefficients').definitions[0];
assert.equal(coefficient.diagnosticRules.coefficient.kind,'execution','coefficient mistakes should remain execution evidence');

assert.equal(getSupportTargetForMicroSkill('skill:y13:integration:reverse-chain-rule:recognition-classification','ao1').activityId,'activity:y13:integration:reverse-chain-rule:ao1:classify-only');
assert.equal(getSupportTargetForMicroSkill('skill:y13:integration:reverse-chain-rule:f-prime-over-f','understand').activityId,'activity:y13:integration:reverse-chain-rule:understand:f-prime-over-f');
assert.equal(getSupportTargetForMicroSkill('skill:y13:integration:reverse-chain-rule:trig-recognition','ao1').activityId,'activity:y13:integration:reverse-chain-rule:ao1:trig-recognition');

const understand=await fs.readFile(new URL('../src/scripts/reverse-chain-rule-understand.js',import.meta.url),'utf8');
assert.match(understand,/applyStructuredExpression/,'Understand must reuse StructureHighlighter');
assert.match(understand,/STANDARD_INTEGRAL_RECOGNITION_SOURCE/,'Understand should expose reuse of Step 60 definitions');
const app=await fs.readFile(new URL('../src/scripts/app-shell.js',import.meta.url),'utf8');
assert.match(app,/createReverseChainRuleUnderstandExperience/);
assert.match(app,/topic:y13:integration:reverse-chain-rule/);
const html=await fs.readFile(new URL('../src/index.html',import.meta.url),'utf8');
assert.match(html,/Recognition &amp; reverse chain/);
assert.match(html,/reverse-chain-rule-understand\.css/);

console.log('Step 61 reverse-chain recognition contract checks passed.');
