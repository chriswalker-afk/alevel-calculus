import { INTEGRATION_METHOD_TAGS } from './integration-method-vocabulary.js';

const freeze=Object.freeze;
const target=(label,topicId,activityId,route)=>freeze({label,topicId,activityId,mode:'understand',route});

export const INTEGRATION_METHOD_MAP_MESSAGE=freeze({
 title:'Integration method map',
 differentiation:'Differentiation has named product, quotient and chain rules. Integration does not have direct reverse versions of all three.',
 integration:'For integration, recognition, substitution, partial fractions and integration by parts are separate strategies. Work through the structure in order instead of matching a surface feature such as “there is a product”.'
});

export const INTEGRATION_METHOD_MAP_BRANCHES=freeze([
 freeze({
  id:'simplify-rewrite',order:1,label:'Simplify or rewrite first',question:'Can algebra, splitting, factorisation or a known trig identity expose a simpler standard form?',cue:'Do this before choosing a heavy method.',
  methodTags:freeze([]),
  targets:freeze([
   target('Review standard forms','topic:y13:integration:standard-integrals','activity:y13:integration:standard-integrals:understand:standard-array','/y13/integration/standard-integrals/understand/standard-array'),
   target('Trig identity rewrites','topic:y13:integration:trig-identities','activity:y13:integration:trig-identities:understand:rewrite-first','/y13/integration/trig-identities/understand/rewrite-first')
  ])
 }),
 freeze({
  id:'standard',order:2,label:'Standard integral',question:'After rewriting, is the integrand already one of the standard forms?',cue:'If yes, integrate directly and check by differentiating.',
  methodTags:freeze([INTEGRATION_METHOD_TAGS.standard]),
  targets:freeze([target('Standard integrals','topic:y13:integration:standard-integrals','activity:y13:integration:standard-integrals:understand:standard-array','/y13/integration/standard-integrals/understand/standard-array')])
 }),
 freeze({
  id:'recognition',order:3,label:'Recognition / reverse chain',question:'Can you see an inside function together with its derivative, or an f′/f structure, up to a constant factor?',cue:'Recognition is faster than introducing a substitution when the pattern is already visible.',
  methodTags:freeze([INTEGRATION_METHOD_TAGS.reverseChain,INTEGRATION_METHOD_TAGS.fPrimeOverF]),
  methodSelectionTemplateIds:freeze(['question-template:y13:integration:reverse-chain-rule:classify']),
  targets:freeze([target('Reverse chain and f′/f','topic:y13:integration:reverse-chain-rule','activity:y13:integration:reverse-chain-rule:understand:recognition-first','/y13/integration/reverse-chain-rule/understand/recognition-first')])
 }),
 freeze({
  id:'trig-identity',order:4,label:'Trig identity',question:'Is a trigonometric identity needed to rewrite powers or products into integrable standard forms?',cue:'Rewrite first; integrate second.',
  methodTags:freeze([INTEGRATION_METHOD_TAGS.trigIdentity]),
  methodSelectionTemplateIds:freeze(['question-template:y13:integration:trig-identities:choose-method']),
  targets:freeze([target('Integration using trig identities','topic:y13:integration:trig-identities','activity:y13:integration:trig-identities:understand:method-choice','/y13/integration/trig-identities/understand/method-choice')])
 }),
 freeze({
  id:'substitution',order:5,label:'Substitution',question:'Would a deliberate change of variable turn the integral into a standard form?',cue:'Change the variable completely: integrand, differential and limits when definite.',
  methodTags:freeze([INTEGRATION_METHOD_TAGS.substitution]),
  methodSelectionTemplateIds:freeze(['question-template:y13:integration:substitution:choose-u']),
  targets:freeze([target('Integration by substitution','topic:y13:integration:substitution','activity:y13:integration:substitution:understand:choosing-u','/y13/integration/substitution/understand/choosing-u')])
 }),
 freeze({
  id:'partial-fractions',order:6,label:'Partial fractions',question:'Is it a rational function that can be made proper and decomposed into simpler fractions?',cue:'For improper rational functions, divide first; then decompose.',
  methodTags:freeze([INTEGRATION_METHOD_TAGS.partialFractions]),
  methodSelectionTemplateIds:freeze(['question-template:y13:integration:partial-fractions:structure-choice']),
  targets:freeze([target('Integration using partial fractions','topic:y13:integration:partial-fractions','activity:y13:integration:partial-fractions:understand:recognise-proper','/y13/integration/partial-fractions/understand/recognise-proper')])
 }),
 freeze({
  id:'by-parts',order:7,label:'Integration by parts — late option',question:'After the earlier routes fail, is there a factor whose differentiation genuinely simplifies the remaining integral while the other factor integrates reliably?',cue:'A product is not enough. Use parts because the new integral is easier, not because two factors are visible.',
  methodTags:freeze([INTEGRATION_METHOD_TAGS.byParts]),late:true,
  targets:freeze([target('Integration by parts','topic:y13:integration:by-parts','activity:y13:integration:by-parts:understand:method-positioning','/y13/integration/by-parts/understand/method-positioning')])
 })
]);

export const INTEGRATION_METHOD_SELECTION_TEMPLATE_IDS=freeze(
 INTEGRATION_METHOD_MAP_BRANCHES.flatMap(branch=>branch.methodSelectionTemplateIds??[])
);

export const INTEGRATION_METHOD_MAP_CONTEXT_TOPIC_IDS=freeze([
 'topic:y13:integration:standard-integrals',
 'topic:y13:integration:reverse-chain-rule',
 'topic:y13:integration:trig-identities',
 'topic:y13:integration:substitution',
 'topic:y13:integration:by-parts',
 'topic:y13:integration:partial-fractions',
 'topic:y13:integration:areas',
 'topic:y13:integration:parametric-area',
 'topic:full:review:full-calculus-mastery'
]);

export function getIntegrationMethodMapBranch(id){return INTEGRATION_METHOD_MAP_BRANCHES.find(branch=>branch.id===id)??null;}
export function getIntegrationMethodMapBranchForTag(tag){return INTEGRATION_METHOD_MAP_BRANCHES.find(branch=>branch.methodTags.includes(tag))??null;}
export function getIntegrationMethodMapHelpTarget(tag){
 const branch=getIntegrationMethodMapBranchForTag(tag);
 const target=branch?.targets?.[0];
 if(!branch||!target)return null;
 return freeze({need:'understand',prompt:`I need help choosing ${branch.label.toLowerCase()}`,supportLabel:'Integration map',title:branch.label,description:branch.cue,...target});
}
export function isIntegrationMethodMapContext(topicId){return INTEGRATION_METHOD_MAP_CONTEXT_TOPIC_IDS.includes(topicId);}
