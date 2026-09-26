import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { trigIdentityIntegrationTopic } from '../src/scripts/topic-content/trig-identity-integration.js';
import { trigIdentityIntegrationLearningModes } from '../src/scripts/trig-identity-integration-activities.js';
import { TRIG_INTEGRATION_IDENTITIES, TRIG_INTEGRATION_EXAMPLES, INTEGRATION_METHOD_TAGS, STANDARD_INTEGRAL_TRIG_SOURCE, TRIG_IDENTITY_SOURCE_TOPIC } from '../src/scripts/trig-integration-data.js';
import { STANDARD_INTEGRAL_DEFINITIONS } from '../src/scripts/standard-integrals-data.js';
import { INTEGRATION_RECOGNITION_TAGS } from '../src/scripts/reverse-chain-recognition-data.js';
import { trigIdentityIntegrationMemoryItems, getMemoryItemsForTopic } from '../src/scripts/memory-content.js';
import { getMemoryGamePackForTopic } from '../src/scripts/memory-game-content.js';
import { getMemoryReviewPackForTopic } from '../src/scripts/memory-review-content.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { getSupportTargetForMicroSkill } from '../src/scripts/help-content.js';

const topicId='topic:y13:integration:trig-identities';
assert.equal(trigIdentityIntegrationTopic.topicId,topicId);
assert.equal(trigIdentityIntegrationTopic.sequence,290);
assert.deepEqual(trigIdentityIntegrationTopic.modes,['understand','memorise','ao1','ao2','ao3']);
assert.ok(trigIdentityIntegrationTopic.prerequisiteTopicIds.includes('topic:y13:differentiation:trig-identities-inverse'));
assert.ok(trigIdentityIntegrationTopic.prerequisiteTopicIds.includes('topic:y13:integration:standard-integrals'));
assert.ok(trigIdentityIntegrationTopic.prerequisiteTopicIds.includes('topic:y13:integration:reverse-chain-rule'));
assert.ok(trigIdentityIntegrationTopic.activities.every(a=>a.implementationStep===62));
for(const mode of trigIdentityIntegrationTopic.modes) assert.ok(trigIdentityIntegrationLearningModes[mode].activities.length>0,`missing ${mode}`);

assert.equal(STANDARD_INTEGRAL_TRIG_SOURCE,STANDARD_INTEGRAL_DEFINITIONS,'Step 62 must reuse Step 60 standard-integral data by reference');
assert.equal(INTEGRATION_METHOD_TAGS.reverseChain,INTEGRATION_RECOGNITION_TAGS.reverseChain,'Step 62 method selection must consume Step 61 reverse-chain tag');
assert.equal(TRIG_IDENTITY_SOURCE_TOPIC,'topic:y13:differentiation:trig-identities-inverse');
for(const id of ['sin-square','cos-square','tan-square']) assert.ok(TRIG_INTEGRATION_IDENTITIES.some(x=>x.id===id),`missing identity ${id}`);
assert.ok(TRIG_INTEGRATION_EXAMPLES.some(x=>x.id==='cos-square-scaled'&&x.rewrite.includes('cos 6x')),'scaled case should double the whole angle');
assert.ok(TRIG_INTEGRATION_EXAMPLES.some(x=>x.definite&&x.result==='π/4'),'definite exact example required');
for(const route of ['standard-integral','reverse-chain','trig-identity','substitution']) assert.ok(TRIG_INTEGRATION_EXAMPLES.some(x=>x.route===route),`method-choice examples need ${route}`);

assert.ok(trigIdentityIntegrationMemoryItems.length>=10);
assert.equal(getMemoryItemsForTopic(topicId).length,trigIdentityIntegrationMemoryItems.length);
const games=getMemoryGamePackForTopic(topicId); assert.ok(games?.sort); assert.equal(games.sort.buckets.length,4); assert.ok(games.sort.items.some(x=>x.bucketId==='identity'));
const review=getMemoryReviewPackForTopic(topicId); assert.ok(review?.mix.taskIds.includes('build'));

const qids=['ao1:rewrite-only','ao1:integrate-rewritten','ao1:scaled-and-definite','ao1:choose-method','ao2:explain-choice','ao2:diagnose-rewrite','ao3:mixed-application'];
for(const suffix of qids){const id=`activity:y13:integration:trig-identities:${suffix}`;const set=getQuestionSetDefinitionForActivity(id);assert.ok(set,`missing ${id}`);assert.ok(set.definitions.length>0);for(const d of set.definitions){assert.equal(d.topicId,topicId);assert.ok(d.methodTags.includes('trig-identity'));}}
const rewrite=getQuestionSetDefinitionForActivity('activity:y13:integration:trig-identities:ao1:rewrite-only').definitions[0];
assert.equal(rewrite.diagnosticRules['identity-selection'].kind,'recognition');
const diagnose=getQuestionSetDefinitionForActivity('activity:y13:integration:trig-identities:ao2:diagnose-rewrite').definitions[0];
assert.equal(diagnose.diagnosticRules['chain-factor'].kind,'execution');
assert.equal(getSupportTargetForMicroSkill('skill:y13:integration:trig-identities:identity-selection','understand').activityId,'activity:y13:integration:trig-identities:understand:identity-bank');
assert.equal(getSupportTargetForMicroSkill('skill:y13:integration:trig-identities:method-choice','ao1').activityId,'activity:y13:integration:trig-identities:ao1:choose-method');

const understand=await fs.readFile(new URL('../src/scripts/trig-identity-integration-understand.js',import.meta.url),'utf8');
assert.match(understand,/renderEquationSteps/);
assert.match(understand,/STANDARD_INTEGRAL_TRIG_SOURCE/);
assert.match(understand,/substitution/i,'method-choice workspace should keep substitution visible without implementing Step 63');
const app=await fs.readFile(new URL('../src/scripts/app-shell.js',import.meta.url),'utf8');
assert.match(app,/createTrigIdentityIntegrationUnderstandExperience/);
assert.match(app,/topic:y13:integration:trig-identities/);
const html=await fs.readFile(new URL('../src/index.html',import.meta.url),'utf8');
assert.match(html,/Integration using trig identities/);
assert.match(html,/trig-identity-integration-understand\.css/);
console.log('Step 62 trig-identity integration contract checks passed.');
