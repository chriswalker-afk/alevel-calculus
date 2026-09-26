import { defineTopicMetadata } from '../topic-metadata.js';
const prefix='y12:differentiation:stationary-points';
const skill=(slug)=>`skill:${prefix}:${slug}`;
const activity=(slug,mode='understand')=>`activity:${prefix}:${mode}:${slug}`;
export const stationaryPointsVocabularyTags=Object.freeze([
  'vocab:stationary-point','vocab:turning-point','vocab:local-maximum','vocab:local-minimum',
  'vocab:stationary-inflection','vocab:first-derivative','vocab:second-derivative','vocab:gradient-function'
]);
export const stationaryPointsTopic=defineTopicMetadata({
  topicId:`topic:${prefix}`,scopeId:'y12',strand:'differentiation',slug:'stationary-points',title:'Stationary and turning points',sequence:50,
  modes:['understand','memorise','ao1','ao2','ao3'],
  prerequisiteTopicIds:['topic:y12:differentiation:basics','topic:y12:differentiation:tangents-normals'],
  prerequisiteTags:['differentiate-polynomials','gradient-function','tangent-gradient'],vocabularyTags:stationaryPointsVocabularyTags,
  journey:[
    {id:'zero-gradient',title:'Find zero gradient',summary:'Connect a horizontal tangent on f to f′(x)=0 on the gradient function.',microSkillIds:[skill('zero-gradient')],vocabularyTags:['vocab:stationary-point','vocab:gradient-function']},
    {id:'max-min-signs',title:'Read sign changes',summary:'Classify local maxima and minima from the sign of f′ before and after a stationary point.',microSkillIds:[skill('first-derivative-sign-test')],vocabularyTags:['vocab:local-maximum','vocab:local-minimum','vocab:first-derivative']},
    {id:'stationary-inflection',title:'Zero does not guarantee a turn',summary:'Use a stationary point of inflection to show that f′(a)=0 is not enough to prove a turning point.',microSkillIds:[skill('stationary-inflection')],vocabularyTags:['vocab:stationary-inflection','vocab:turning-point']},
    {id:'classify-from-signs',title:'Classify from behaviour',summary:'Use +→0→−, −→0→+, and same-sign patterns before naming a memorised test.',microSkillIds:[skill('first-derivative-sign-test')],vocabularyTags:['vocab:first-derivative']},
    {id:'second-derivative',title:'Interpret the second derivative',summary:'Relate f″ to how the gradient function changes and introduce the stationary-point second-derivative check, including its inconclusive zero case.',microSkillIds:[skill('second-derivative-meaning')],vocabularyTags:['vocab:second-derivative']}
  ],
  microSkills:[
    {microSkillId:skill('zero-gradient'),slug:'zero-gradient',title:'Recognise and solve for stationary points from f′(a)=0',prerequisiteTags:['tangent-gradient'],vocabularyTags:['vocab:stationary-point','vocab:gradient-function'],supportTargets:{understand:activity('zero-gradient'),memorise:activity('key-facts','memorise'),ao1:activity('find-stationary','ao1')}},
    {microSkillId:skill('first-derivative-sign-test'),slug:'first-derivative-sign-test',title:'Classify behaviour from derivative signs',prerequisiteTags:['gradient-sign'],vocabularyTags:['vocab:first-derivative','vocab:local-maximum','vocab:local-minimum'],supportTargets:{understand:activity('classify-from-signs'),memorise:activity('sign-patterns','memorise'),ao1:activity('sign-test','ao1')}},
    {microSkillId:skill('stationary-inflection'),slug:'stationary-inflection',title:'Distinguish stationary points from turning points',prerequisiteTags:['stationary-point'],vocabularyTags:['vocab:stationary-inflection','vocab:turning-point'],supportTargets:{understand:activity('stationary-inflection'),memorise:activity('sign-patterns','memorise'),ao1:activity('sign-test','ao1')}},
    {microSkillId:skill('second-derivative-meaning'),slug:'second-derivative-meaning',title:'Interpret f″ at a stationary point',prerequisiteTags:['differentiate-polynomials'],vocabularyTags:['vocab:second-derivative'],supportTargets:{understand:activity('second-derivative'),memorise:activity('second-derivative-test','memorise'),ao1:activity('second-derivative-test','ao1')}},
    {microSkillId:skill('applications'),slug:'applications',title:'Apply stationary-point conditions in simple models and parameter problems',prerequisiteTags:['solve-equations'],vocabularyTags:['vocab:stationary-point'],supportTargets:{}}
  ],
  activities:[
    {activityId:activity('zero-gradient'),mode:'understand',slug:'zero-gradient',title:'Gradient function to stationary point',activityType:'interactive',microSkillIds:[skill('zero-gradient')],vocabularyTags:['vocab:stationary-point','vocab:gradient-function'],implementationStep:41},
    {activityId:activity('max-min-signs'),mode:'understand',slug:'max-min-signs',title:'Maxima and minima from signs',activityType:'interactive',microSkillIds:[skill('first-derivative-sign-test')],vocabularyTags:['vocab:local-maximum','vocab:local-minimum'],implementationStep:41},
    {activityId:activity('stationary-inflection'),mode:'understand',slug:'stationary-inflection',title:'A stationary point with no turn',activityType:'interactive',microSkillIds:[skill('stationary-inflection')],vocabularyTags:['vocab:stationary-inflection','vocab:turning-point'],implementationStep:41},
    {activityId:activity('classify-from-signs'),mode:'understand',slug:'classify-from-signs',title:'Classify from derivative signs',activityType:'interactive',microSkillIds:[skill('first-derivative-sign-test')],vocabularyTags:['vocab:first-derivative'],implementationStep:41},
    {activityId:activity('second-derivative'),mode:'understand',slug:'second-derivative',title:'What the second derivative tells us',activityType:'interactive',microSkillIds:[skill('second-derivative-meaning')],vocabularyTags:['vocab:second-derivative'],implementationStep:41},
    {activityId:activity('key-facts','memorise'),mode:'memorise',slug:'key-facts',title:'Stationary-point key facts',activityType:'memory',microSkillIds:[skill('zero-gradient')],vocabularyTags:stationaryPointsVocabularyTags,implementationStep:42},
    {activityId:activity('sign-patterns','memorise'),mode:'memorise',slug:'sign-patterns',title:'First-derivative sign patterns',activityType:'memory',microSkillIds:[skill('first-derivative-sign-test'),skill('stationary-inflection')],vocabularyTags:['vocab:first-derivative','vocab:local-maximum','vocab:local-minimum','vocab:stationary-inflection'],implementationStep:42},
    {activityId:activity('second-derivative-test','memorise'),mode:'memorise',slug:'second-derivative-test',title:'Second-derivative classification facts',activityType:'memory',microSkillIds:[skill('second-derivative-meaning')],vocabularyTags:['vocab:second-derivative'],implementationStep:42},
    {activityId:activity('vocabulary-recall','memorise'),mode:'memorise',slug:'vocabulary-recall',title:'Stationary-point vocabulary recall',activityType:'memory',microSkillIds:[skill('first-derivative-sign-test')],vocabularyTags:stationaryPointsVocabularyTags,implementationStep:42},
    {activityId:activity('memory-games','memorise'),mode:'memorise',slug:'memory-games',title:'Stationary-point memory games',activityType:'memory',microSkillIds:[skill('first-derivative-sign-test'),skill('second-derivative-meaning')],vocabularyTags:stationaryPointsVocabularyTags,implementationStep:42},
    {activityId:activity('mixed-review','memorise'),mode:'memorise',slug:'mixed-review',title:'Mixed stationary-point review',activityType:'memory',microSkillIds:[skill('zero-gradient'),skill('first-derivative-sign-test'),skill('second-derivative-meaning')],vocabularyTags:stationaryPointsVocabularyTags,implementationStep:42},
    {activityId:activity('find-stationary','ao1'),mode:'ao1',slug:'find-stationary',title:'Find stationary points',activityType:'question-set',microSkillIds:[skill('zero-gradient')],vocabularyTags:['vocab:stationary-point'],implementationStep:42},
    {activityId:activity('sign-test','ao1'),mode:'ao1',slug:'sign-test',title:'Classify from first-derivative signs',activityType:'question-set',microSkillIds:[skill('first-derivative-sign-test'),skill('stationary-inflection')],vocabularyTags:['vocab:first-derivative','vocab:local-maximum','vocab:local-minimum','vocab:stationary-inflection'],implementationStep:42},
    {activityId:activity('second-derivative-test','ao1'),mode:'ao1',slug:'second-derivative-test',title:'Use the second-derivative test',activityType:'question-set',microSkillIds:[skill('second-derivative-meaning')],vocabularyTags:['vocab:second-derivative'],implementationStep:42},
    {activityId:activity('explain-tests','ao2'),mode:'ao2',slug:'explain-tests',title:'Explain the derivative tests',activityType:'question-set',microSkillIds:[skill('first-derivative-sign-test'),skill('second-derivative-meaning')],vocabularyTags:['vocab:first-derivative','vocab:second-derivative'],implementationStep:42},
    {activityId:activity('diagnose-classification','ao2'),mode:'ao2',slug:'diagnose-classification',title:'Diagnose classification errors',activityType:'question-set',microSkillIds:[skill('stationary-inflection'),skill('second-derivative-meaning')],vocabularyTags:['vocab:stationary-inflection','vocab:second-derivative'],implementationStep:42},
    {activityId:activity('applications-parameters','ao3'),mode:'ao3',slug:'applications-parameters',title:'Applications and parameters',activityType:'question-set',microSkillIds:[skill('applications')],vocabularyTags:['vocab:stationary-point','vocab:local-maximum','vocab:local-minimum'],implementationStep:42}
  ]
});
