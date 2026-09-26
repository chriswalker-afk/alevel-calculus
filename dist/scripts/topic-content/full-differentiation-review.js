import { defineTopicMetadata } from '../topic-metadata.js';
import { basicsDifferentiationVocabularyTags } from './basics-differentiation.js';
import { firstPrinciplesVocabularyTags } from './first-principles.js';
import { tangentsNormalsVocabularyTags } from './tangents-normals.js';
import { stationaryPointsVocabularyTags } from './stationary-points.js';
import { increasingDecreasingVocabularyTags } from './increasing-decreasing.js';
import { standardFunctionsVocabularyTags } from './standard-functions.js';
import { trigFirstPrinciplesVocabularyTags } from './trig-first-principles.js';
import { productQuotientChainVocabularyTags } from './product-quotient-chain.js';
import { parametricDifferentiationVocabularyTags } from './parametric-differentiation.js';
import { implicitDifferentiationVocabularyTags } from './implicit-differentiation.js';
import { trigIdentitiesInverseVocabularyTags } from './trig-identities-inverse.js';
import { concavityInflectionVocabularyTags } from './concavity-inflection.js';
import { connectedRatesVocabularyTags } from './connected-rates.js';

const prefix='full:review:calculus-mastery';
const skill=s=>`skill:${prefix}:${s}`;
const activity=(s,m='memorise')=>`activity:${prefix}:${m}:${s}`;
export const fullDifferentiationReviewVocabularyTags=Object.freeze([...new Set([
  ...basicsDifferentiationVocabularyTags,...firstPrinciplesVocabularyTags,...tangentsNormalsVocabularyTags,
  ...stationaryPointsVocabularyTags,...increasingDecreasingVocabularyTags,...standardFunctionsVocabularyTags,
  ...trigFirstPrinciplesVocabularyTags,...productQuotientChainVocabularyTags,...parametricDifferentiationVocabularyTags,
  ...implicitDifferentiationVocabularyTags,...trigIdentitiesInverseVocabularyTags,...concavityInflectionVocabularyTags,
  ...connectedRatesVocabularyTags
])]);

export const fullDifferentiationReviewTopic=defineTopicMetadata({
  topicId:`topic:${prefix}`,scopeId:'full-alevel',strand:'review',slug:'calculus-mastery',title:'Differentiation review and mastery',sequence:260,
  modes:['memorise','ao1','ao2','ao3'],
  prerequisiteTopicIds:[
    'topic:y12:differentiation:basics','topic:y12:differentiation:first-principles','topic:y12:differentiation:tangents-normals',
    'topic:y12:differentiation:stationary-points','topic:y12:differentiation:increasing-decreasing',
    'topic:y13:differentiation:standard-functions','topic:y13:differentiation:trig-first-principles','topic:y13:differentiation:product-quotient-chain',
    'topic:y13:differentiation:parametric-differentiation','topic:y13:differentiation:implicit-differentiation','topic:y13:differentiation:trig-identities-inverse',
    'topic:y13:differentiation:concavity-inflection','topic:y13:differentiation:connected-rates'
  ],
  prerequisiteTags:['full-differentiation-complete'],vocabularyTags:fullDifferentiationReviewVocabularyTags,
  journey:[
    {id:'recall',title:'Things to remember',summary:'Recall the complete differentiation toolkit and link each fact back to its learning page.',microSkillIds:[skill('consolidated-recall')],vocabularyTags:fullDifferentiationReviewVocabularyTags},
    {id:'select-method',title:'Which method do I need?',summary:'Select the differentiation method or combination before carrying out any algebra.',microSkillIds:[skill('method-selection')],vocabularyTags:fullDifferentiationReviewVocabularyTags},
    {id:'execute',title:'Topic-blind fluency',summary:'Execute differentiation without a topic label revealing the method.',microSkillIds:[skill('mixed-execution')],vocabularyTags:fullDifferentiationReviewVocabularyTags},
    {id:'justify',title:'Explain and diagnose',summary:'Justify method choice, interpret derivatives and diagnose recognition versus execution errors.',microSkillIds:[skill('method-justification')],vocabularyTags:fullDifferentiationReviewVocabularyTags},
    {id:'apply',title:'Apply differentiation',summary:'Solve multi-step applications with parameters, tangents, stationary points and implicit/parametric contexts.',microSkillIds:[skill('mixed-applications')],vocabularyTags:fullDifferentiationReviewVocabularyTags},
    {id:'mastery',title:'Differentiation mastery',summary:'Use topic-blind evidence to separate method recognition from method execution and route to precise support.',microSkillIds:[skill('diagnostic-mastery')],vocabularyTags:fullDifferentiationReviewVocabularyTags}
  ],
  microSkills:[
    {microSkillId:skill('consolidated-recall'),slug:'consolidated-recall',title:'Recall the full differentiation toolkit',prerequisiteTags:[],vocabularyTags:fullDifferentiationReviewVocabularyTags,supportTargets:{memorise:activity('things-to-remember','memorise')}},
    {microSkillId:skill('method-selection'),slug:'method-selection',title:'Select the correct differentiation method before execution',prerequisiteTags:[],vocabularyTags:fullDifferentiationReviewVocabularyTags,supportTargets:{memorise:activity('method-map','memorise'),ao1:activity('method-selection-only','ao1')}},
    {microSkillId:skill('mixed-execution'),slug:'mixed-execution',title:'Execute topic-blind differentiation accurately',prerequisiteTags:[],vocabularyTags:fullDifferentiationReviewVocabularyTags,supportTargets:{ao1:activity('topic-blind-fluency','ao1')}},
    {microSkillId:skill('method-justification'),slug:'method-justification',title:'Explain method choice and diagnose errors',prerequisiteTags:[],vocabularyTags:fullDifferentiationReviewVocabularyTags,supportTargets:{memorise:activity('method-map','memorise'),ao1:activity('method-selection-only','ao1')}},
    {microSkillId:skill('mixed-applications'),slug:'mixed-applications',title:'Apply differentiation in multi-step contexts',prerequisiteTags:[],vocabularyTags:fullDifferentiationReviewVocabularyTags,supportTargets:{ao1:activity('topic-blind-fluency','ao1')}},
    {microSkillId:skill('diagnostic-mastery'),slug:'diagnostic-mastery',title:'Distinguish recognition weaknesses from execution weaknesses',prerequisiteTags:[],vocabularyTags:fullDifferentiationReviewVocabularyTags,supportTargets:{memorise:activity('method-map','memorise'),ao1:activity('method-selection-only','ao1')}}
  ],
  activities:[
    {activityId:activity('things-to-remember','memorise'),mode:'memorise',slug:'things-to-remember',title:'Things to remember',activityType:'memory',microSkillIds:[skill('consolidated-recall')],vocabularyTags:fullDifferentiationReviewVocabularyTags,implementationStep:59},
    {activityId:activity('method-map','memorise'),mode:'memorise',slug:'method-map',title:'Method map',activityType:'memory',microSkillIds:[skill('method-selection'),skill('method-justification'),skill('diagnostic-mastery')],vocabularyTags:fullDifferentiationReviewVocabularyTags,implementationStep:59},
    {activityId:activity('rapid-recall','memorise'),mode:'memorise',slug:'rapid-recall',title:'Rapid differentiation recall',activityType:'memory',microSkillIds:[skill('consolidated-recall')],vocabularyTags:fullDifferentiationReviewVocabularyTags,implementationStep:59},
    {activityId:activity('method-selection-only','ao1'),mode:'ao1',slug:'method-selection-only',title:'Which method do I need?',activityType:'question-set',microSkillIds:[skill('method-selection'),skill('method-justification'),skill('diagnostic-mastery')],vocabularyTags:fullDifferentiationReviewVocabularyTags,implementationStep:59},
    {activityId:activity('topic-blind-fluency','ao1'),mode:'ao1',slug:'topic-blind-fluency',title:'Topic-blind fluency',activityType:'question-set',microSkillIds:[skill('mixed-execution'),skill('mixed-applications')],vocabularyTags:fullDifferentiationReviewVocabularyTags,implementationStep:59},
    {activityId:activity('justify-and-diagnose','ao2'),mode:'ao2',slug:'justify-and-diagnose',title:'Explain, compare and diagnose',activityType:'question-set',microSkillIds:[skill('method-justification')],vocabularyTags:fullDifferentiationReviewVocabularyTags,implementationStep:59},
    {activityId:activity('mixed-applications','ao3'),mode:'ao3',slug:'mixed-applications',title:'Mixed differentiation applications',activityType:'question-set',microSkillIds:[skill('mixed-applications')],vocabularyTags:fullDifferentiationReviewVocabularyTags,implementationStep:59},
    {activityId:activity('diagnostic-mastery','ao3'),mode:'ao3',slug:'diagnostic-mastery',title:'Differentiation mastery',activityType:'mastery',microSkillIds:[skill('diagnostic-mastery')],vocabularyTags:fullDifferentiationReviewVocabularyTags,implementationStep:59}
  ]
});
