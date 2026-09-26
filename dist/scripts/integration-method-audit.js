import { INTEGRATION_METHOD_TAGS, INTEGRATION_METHOD_TAG_LIST, INTEGRATION_METHOD_LABELS } from './integration-method-vocabulary.js';
import { standardIntegralsAssessmentQuestionDefinitions } from './question-definitions/standard-integrals-assessment.js';
import { reverseChainRuleAssessmentQuestionDefinitions } from './question-definitions/reverse-chain-rule-assessment.js';
import { trigIdentityIntegrationAssessmentQuestionDefinitions } from './question-definitions/trig-identity-integration-assessment.js';
import { substitutionAssessmentQuestionDefinitions } from './question-definitions/substitution-assessment.js';
import { integrationByPartsAssessmentQuestionDefinitions } from './question-definitions/integration-by-parts-assessment.js';
import { partialFractionsAssessmentQuestionDefinitions } from './question-definitions/partial-fractions-assessment.js';
import { year13AreasAssessmentQuestionDefinitions } from './question-definitions/year13-areas-assessment.js';
import { parametricAreaAssessmentQuestionDefinitions } from './question-definitions/parametric-area-assessment.js';
import { limitOfSumAssessmentQuestionDefinitions } from './question-definitions/limit-of-sum-assessment.js';
import { trapeziumIntegrationAssessmentQuestionDefinitions } from './question-definitions/trapezium-integration-assessment.js';

export const INTEGRATION_METHOD_AUDIT_GROUPS=Object.freeze([
 ['standard-integrals',standardIntegralsAssessmentQuestionDefinitions],['reverse-chain-rule',reverseChainRuleAssessmentQuestionDefinitions],['trig-identities',trigIdentityIntegrationAssessmentQuestionDefinitions],['substitution',substitutionAssessmentQuestionDefinitions],['by-parts',integrationByPartsAssessmentQuestionDefinitions],['partial-fractions',partialFractionsAssessmentQuestionDefinitions],['areas',year13AreasAssessmentQuestionDefinitions],['parametric-area',parametricAreaAssessmentQuestionDefinitions],['limit-of-sum',limitOfSumAssessmentQuestionDefinitions],['numerical-integration',trapeziumIntegrationAssessmentQuestionDefinitions]
]);
export const LEGACY_INTEGRATION_METHOD_ALIASES=Object.freeze(['standard-integrals','integration-recognition','integration-method-selection','area-construction']);
const exact=new Map([
 ['question-template:y13:integration:reverse-chain-rule:classify',[INTEGRATION_METHOD_TAGS.reverseChain,INTEGRATION_METHOD_TAGS.fPrimeOverF]],
 ['question-template:y13:integration:reverse-chain-rule:f-over-f',[INTEGRATION_METHOD_TAGS.fPrimeOverF]],
 ['question-template:y13:integration:reverse-chain-rule:trig',[INTEGRATION_METHOD_TAGS.reverseChain,INTEGRATION_METHOD_TAGS.fPrimeOverF]],
 ['question-template:y13:integration:reverse-chain-rule:multi-step',[INTEGRATION_METHOD_TAGS.fPrimeOverF]],
 ['question-template:y13:integration:parametric-area:mixed',[INTEGRATION_METHOD_TAGS.parametricArea,INTEGRATION_METHOD_TAGS.trigIdentity]],
 ['question-template:y13:integration:limit-of-sum:evaluate',[INTEGRATION_METHOD_TAGS.limitOfSum,INTEGRATION_METHOD_TAGS.standard]],
 ['question-template:y13:integration:limit-of-sum:mixed',[INTEGRATION_METHOD_TAGS.limitOfSum,INTEGRATION_METHOD_TAGS.reverseChain]]
]);
const topicDefault=new Map([
 ['topic:y13:integration:standard-integrals',[INTEGRATION_METHOD_TAGS.standard]],['topic:y13:integration:trig-identities',[INTEGRATION_METHOD_TAGS.trigIdentity]],['topic:y13:integration:substitution',[INTEGRATION_METHOD_TAGS.substitution]],['topic:y13:integration:by-parts',[INTEGRATION_METHOD_TAGS.byParts]],['topic:y13:integration:partial-fractions',[INTEGRATION_METHOD_TAGS.partialFractions]],['topic:y13:integration:parametric-area',[INTEGRATION_METHOD_TAGS.parametricArea]],['topic:y13:integration:limit-of-sum',[INTEGRATION_METHOD_TAGS.limitOfSum]],['topic:y13:integration:numerical-integration',[INTEGRATION_METHOD_TAGS.trapeziumRule]]
]);
export function auditIntegrationQuestionDefinitions(){
 const issues=[]; const allowed=new Set(INTEGRATION_METHOD_TAG_LIST); let questionCount=0;
 for(const [,defs] of INTEGRATION_METHOD_AUDIT_GROUPS) for(const d of defs){ questionCount++;
   for(const tag of d.methodTags) if(!allowed.has(tag)) issues.push(`${d.templateId}: non-canonical method tag ${tag}`);
   for(const tag of d.prerequisiteTags) if(tag==='standard-integrals'||tag==='integration-recognition') issues.push(`${d.templateId}: legacy prerequisite alias ${tag}`);
   const expected=exact.get(d.templateId)??topicDefault.get(d.topicId);
   if(expected && expected.some(tag=>!d.methodTags.includes(tag))) issues.push(`${d.templateId}: missing expected method tag(s) ${expected.filter(tag=>!d.methodTags.includes(tag)).join(', ')}`);
 }
 for(const tag of INTEGRATION_METHOD_TAG_LIST) if(!INTEGRATION_METHOD_LABELS[tag]) issues.push(`Missing canonical label for ${tag}`);
 return Object.freeze({questionCount,issues:Object.freeze(issues),methodTags:INTEGRATION_METHOD_TAG_LIST});
}
