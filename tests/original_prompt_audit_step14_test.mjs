import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  INTEGRATION_METHOD_MAP_BRANCHES,
  INTEGRATION_METHOD_MAP_MESSAGE,
  INTEGRATION_METHOD_MAP_CONTEXT_TOPIC_IDS,
  INTEGRATION_METHOD_SELECTION_TEMPLATE_IDS,
  getIntegrationMethodMapBranchForTag,
  getIntegrationMethodMapHelpTarget
} from '../src/scripts/integration-method-map.js';
import { INTEGRATION_METHOD_TAGS } from '../src/scripts/integration-method-vocabulary.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { getIntegrationMethodDecisionHelpTarget, getSupportTargetForMicroSkill } from '../src/scripts/help-content.js';
import { standardIntegralsTopic } from '../src/scripts/topic-content/standard-integrals.js';
import { reverseChainRuleTopic } from '../src/scripts/topic-content/reverse-chain-rule.js';
import { trigIdentityIntegrationTopic } from '../src/scripts/topic-content/trig-identity-integration.js';
import { substitutionTopic } from '../src/scripts/topic-content/substitution.js';
import { partialFractionsIntegrationTopic } from '../src/scripts/topic-content/partial-fractions-integration.js';
import { integrationByPartsTopic } from '../src/scripts/topic-content/integration-by-parts.js';

const ids=INTEGRATION_METHOD_MAP_BRANCHES.map(branch=>branch.id);
assert.deepEqual(ids,[
 'simplify-rewrite',
 'standard',
 'recognition',
 'trig-identity',
 'substitution',
 'partial-fractions',
 'by-parts'
],'The canonical integration map must preserve the intended decision order.');
assert.deepEqual(INTEGRATION_METHOD_MAP_BRANCHES.map(branch=>branch.order),[1,2,3,4,5,6,7]);

assert.match(INTEGRATION_METHOD_MAP_MESSAGE.differentiation,/product, quotient and chain rules/i);
assert.match(INTEGRATION_METHOD_MAP_MESSAGE.differentiation,/does not have direct reverse versions of all three/i);
assert.match(INTEGRATION_METHOD_MAP_MESSAGE.integration,/recognition, substitution, partial fractions and integration by parts are separate strategies/i);

const parts=INTEGRATION_METHOD_MAP_BRANCHES.at(-1);
assert.equal(parts.id,'by-parts');
assert.equal(parts.late,true);
assert.match(parts.label,/late option/i);
assert.match(parts.question,/After the earlier routes fail/i);
assert.match(parts.question,/differentiation genuinely simplifies the remaining integral/i);
assert.match(parts.cue,/A product is not enough/i);

const topics=new Map([
 [standardIntegralsTopic.topicId,standardIntegralsTopic],
 [reverseChainRuleTopic.topicId,reverseChainRuleTopic],
 [trigIdentityIntegrationTopic.topicId,trigIdentityIntegrationTopic],
 [substitutionTopic.topicId,substitutionTopic],
 [partialFractionsIntegrationTopic.topicId,partialFractionsIntegrationTopic],
 [integrationByPartsTopic.topicId,integrationByPartsTopic]
]);
for(const branch of INTEGRATION_METHOD_MAP_BRANCHES){
 assert(branch.targets.length>0,branch.id+' must link to existing teaching rather than duplicate it.');
 for(const target of branch.targets){
  const topic=topics.get(target.topicId);
  assert(topic,'Unknown integration-map topic '+target.topicId);
  assert(topic.activities.some(activity=>activity.activityId===target.activityId),'Missing target activity '+target.activityId);
  assert.equal(target.mode,'understand');
  assert.match(target.route,/^\/y13\/integration\//);
 }
}

assert(INTEGRATION_METHOD_MAP_CONTEXT_TOPIC_IDS.includes('topic:full:review:full-calculus-mastery'),'Full 9MA0 mastery must expose the same map.');
for(const topicId of topics.keys()) assert(INTEGRATION_METHOD_MAP_CONTEXT_TOPIC_IDS.includes(topicId),topicId+' should expose the shared map.');

assert.deepEqual(INTEGRATION_METHOD_SELECTION_TEMPLATE_IDS,[
 'question-template:y13:integration:reverse-chain-rule:classify',
 'question-template:y13:integration:trig-identities:choose-method',
 'question-template:y13:integration:substitution:choose-u',
 'question-template:y13:integration:partial-fractions:structure-choice'
]);
const methodOnly=getQuestionSetDefinitionForActivity('activity:full:review:full-calculus-mastery:ao1:method-only');
assert(methodOnly);
const methodOnlyIds=new Set(methodOnly.definitions.map(definition=>definition.templateId));
for(const templateId of INTEGRATION_METHOD_SELECTION_TEMPLATE_IDS) assert(methodOnlyIds.has(templateId),'Full mastery method-only set must reuse canonical map question '+templateId);

const questionCatalogue=readFileSync(new URL('../src/scripts/question-catalogue.js',import.meta.url),'utf8');
const methodStart=questionCatalogue.indexOf('const step75MethodOnlyDefinitions');
const methodEnd=questionCatalogue.indexOf('const step75MethodOrderDefinitions',methodStart);
const methodBlock=questionCatalogue.slice(methodStart,methodEnd);
assert.match(methodBlock,/\.\.\.INTEGRATION_METHOD_SELECTION_TEMPLATE_IDS/,'Method-selection-only integration questions must be sourced from the canonical map.');
for(const templateId of INTEGRATION_METHOD_SELECTION_TEMPLATE_IDS) assert(!methodBlock.includes("'"+templateId+"'"),templateId+' should not be copied into the method-only list.');

const helpCases=[
 [INTEGRATION_METHOD_TAGS.standard,'skill:y13:integration:standard-integrals:standard-array'],
 [INTEGRATION_METHOD_TAGS.reverseChain,'skill:y13:integration:reverse-chain-rule:recognition-classification'],
 [INTEGRATION_METHOD_TAGS.trigIdentity,'skill:y13:integration:trig-identities:method-choice'],
 [INTEGRATION_METHOD_TAGS.substitution,'skill:y13:integration:substitution:choose-u'],
 [INTEGRATION_METHOD_TAGS.partialFractions,'skill:y13:integration:partial-fractions:recognise-proper'],
 [INTEGRATION_METHOD_TAGS.byParts,'skill:y13:integration:by-parts:method-positioning']
];
for(const [tag,microSkillId] of helpCases){
 const branch=getIntegrationMethodMapBranchForTag(tag);
 assert(branch);
 const canonical=getIntegrationMethodMapHelpTarget(tag);
 const exported=getIntegrationMethodDecisionHelpTarget(tag);
 const diagnostic=getSupportTargetForMicroSkill(microSkillId,'understand');
 assert.equal(exported.activityId,branch.targets[0].activityId);
 assert.equal(canonical.activityId,branch.targets[0].activityId);
 assert.equal(diagnostic.activityId,branch.targets[0].activityId,'Diagnostic Help routing must use the canonical map target.');
}

const surface=readFileSync(new URL('../src/scripts/integration-method-map-surface.js',import.meta.url),'utf8');
assert.match(surface,/INTEGRATION_METHOD_MAP_BRANCHES/);
assert.match(surface,/INTEGRATION_METHOD_MAP_MESSAGE/);
assert.match(surface,/Integration method map/);
assert.match(surface,/Do not use “product present → parts”/);
assert.match(surface,/dataset\.integrationMethodMapBranch=branch\.id/);
assert.match(surface,/this\.onNavigate\(target\)/);

const partsUnderstand=readFileSync(new URL('../src/scripts/integration-by-parts-understand.js',import.meta.url),'utf8');
assert.match(partsUnderstand,/INTEGRATION_METHOD_MAP_BRANCHES/);
assert.match(partsUnderstand,/Shared Integration method map/);
assert.match(partsUnderstand,/Use parts only at the late branch/);
assert.match(partsUnderstand,/A visible product by itself is not a reason to choose parts/);

const appShell=readFileSync(new URL('../src/scripts/app-shell.js',import.meta.url),'utf8');
assert.match(appShell,/createIntegrationMethodMapSurface/);
assert.match(appShell,/integrationMethodMapSurface\.setContext\(\{topicId:currentTopicId,activityId:activity\.activityId\}\)/);
assert.match(appShell,/onNavigate:navigateToActivityTarget/);

const sourceMap=readFileSync(new URL('../src/scripts/integration-method-map.js',import.meta.url),'utf8');
const publishedMap=readFileSync(new URL('../scripts/integration-method-map.js',import.meta.url),'utf8');
const sourceSurface=readFileSync(new URL('../src/scripts/integration-method-map-surface.js',import.meta.url),'utf8');
const publishedSurface=readFileSync(new URL('../scripts/integration-method-map-surface.js',import.meta.url),'utf8');
assert.equal(sourceMap,publishedMap);
assert.equal(sourceSurface,publishedSurface);

console.log('PASS Original-prompt audit Step 14 canonical integration method map, late-parts order, deep links, mastery reuse and Help routing');
