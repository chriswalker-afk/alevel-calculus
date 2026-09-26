import { defineTopicMetadata } from '../topic-metadata.js';
const prefix='y13:differentiation:standard-functions';
const skill=(s)=>`skill:${prefix}:${s}`; const activity=(s,m='understand')=>`activity:${prefix}:${m}:${s}`;
export const standardFunctionsVocabularyTags=Object.freeze(['vocab:standard-function','vocab:radians','vocab:scale-factor','vocab:exponential-function','vocab:natural-logarithm']);
export const standardFunctionsTopic=defineTopicMetadata({
  topicId:`topic:${prefix}`,scopeId:'y13-additional',strand:'differentiation',slug:'standard-functions',title:'Differentiation of standard functions',sequence:180,
  modes:['understand','memorise','ao1','ao2','ao3'],prerequisiteTopicIds:['topic:y12:review:calculus-mastery'],prerequisiteTags:['gradient-function','radians'],vocabularyTags:standardFunctionsVocabularyTags,
  journey:[
    {id:'graph-discovery',title:'Link each function to its gradient function',summary:'Use tangent gradients to predict the derivative graph before revealing it.',microSkillIds:[skill('standard-rules')],vocabularyTags:['vocab:standard-function','vocab:radians']},
    {id:'scaled-forms',title:'See the scale factor in the gradient',summary:'Compare sin(ax), cos(ax), e^(ax), ln(ax) and a^(kx).',microSkillIds:[skill('scaled-rules'),skill('reasoning')],vocabularyTags:['vocab:scale-factor']},
    {id:'mixed-use',title:'Recognise and use the correct standard derivative',summary:'Mix polynomial, trigonometric, exponential and logarithmic derivatives.',microSkillIds:[skill('mixed-selection'),skill('applications')],vocabularyTags:standardFunctionsVocabularyTags}
  ],
  microSkills:[
    {microSkillId:skill('standard-rules'),slug:'standard-rules',title:'Differentiate sin x, cos x, e^x and ln x',prerequisiteTags:['gradient-function'],vocabularyTags:['vocab:standard-function','vocab:radians'],supportTargets:{understand:activity('graph-discovery'),memorise:activity('core-rules','memorise'),ao1:activity('standard-rules','ao1')}},
    {microSkillId:skill('scaled-rules'),slug:'scaled-rules',title:'Differentiate scaled standard functions including a^(kx)',prerequisiteTags:['standard-rules'],vocabularyTags:['vocab:scale-factor'],supportTargets:{understand:activity('scaled-functions'),memorise:activity('scaled-rules','memorise'),ao1:activity('scaled-rules','ao1')}},
    {microSkillId:skill('mixed-selection'),slug:'mixed-selection',title:'Select the correct standard derivative in mixed work',prerequisiteTags:['power-rule','standard-rules'],vocabularyTags:['vocab:standard-function'],supportTargets:{understand:activity('mixed-comparison'),memorise:activity('mixed-recall','memorise'),ao1:activity('mixed-standard-functions','ao1')}},
    {microSkillId:skill('reasoning'),slug:'reasoning',title:'Explain signs and scale factors from graph behaviour',prerequisiteTags:['gradient-function'],vocabularyTags:['vocab:scale-factor','vocab:radians'],supportTargets:{understand:activity('scaled-functions'),ao1:activity('scaled-rules','ao1')}},
    {microSkillId:skill('applications'),slug:'applications',title:'Use standard derivatives in tangent and stationary-point applications',prerequisiteTags:['tangents-normals','stationary-points'],vocabularyTags:['vocab:standard-function'],supportTargets:{ao1:activity('mixed-standard-functions','ao1')}}
  ],
  activities:[
    {activityId:activity('graph-discovery'),mode:'understand',slug:'graph-discovery',title:'Discover the standard gradient functions',activityType:'interactive',microSkillIds:[skill('standard-rules')],vocabularyTags:standardFunctionsVocabularyTags,implementationStep:50},
    {activityId:activity('scaled-functions'),mode:'understand',slug:'scaled-functions',title:'What changes when the input is scaled?',activityType:'interactive',microSkillIds:[skill('scaled-rules'),skill('reasoning')],vocabularyTags:standardFunctionsVocabularyTags,implementationStep:50},
    {activityId:activity('mixed-comparison'),mode:'understand',slug:'mixed-comparison',title:'Connect graphs, rules and numerical gradients',activityType:'interactive',microSkillIds:[skill('mixed-selection'),skill('applications')],vocabularyTags:standardFunctionsVocabularyTags,implementationStep:50},
    ...['core-rules','scaled-rules','radians','mixed-recall','vocabulary-recall','memory-games','mixed-review'].map((slug,i)=>({activityId:activity(slug,'memorise'),mode:'memorise',slug,title:['Core rules','Scaled rules','Radians reminder','Mixed recall','Vocabulary recall','Memory games','Mixed review'][i],activityType:'memory',microSkillIds:[skill(i===0?'standard-rules':i===1?'scaled-rules':i===2?'standard-rules':'mixed-selection')],vocabularyTags:standardFunctionsVocabularyTags,implementationStep:50})),
    {activityId:activity('standard-rules','ao1'),mode:'ao1',slug:'standard-rules',title:'Standard derivatives',activityType:'question-set',microSkillIds:[skill('standard-rules')],vocabularyTags:standardFunctionsVocabularyTags,implementationStep:50},
    {activityId:activity('scaled-rules','ao1'),mode:'ao1',slug:'scaled-rules',title:'Scaled standard derivatives',activityType:'question-set',microSkillIds:[skill('scaled-rules'),skill('reasoning')],vocabularyTags:standardFunctionsVocabularyTags,implementationStep:50},
    {activityId:activity('mixed-standard-functions','ao1'),mode:'ao1',slug:'mixed-standard-functions',title:'Mixed standard functions',activityType:'question-set',microSkillIds:[skill('mixed-selection'),skill('applications')],vocabularyTags:standardFunctionsVocabularyTags,implementationStep:50},
    {activityId:activity('explain-graphs','ao2'),mode:'ao2',slug:'explain-graphs',title:'Explain the gradient graphs',activityType:'question-set',microSkillIds:[skill('reasoning')],vocabularyTags:standardFunctionsVocabularyTags,implementationStep:50},
    {activityId:activity('diagnose-scale-sign','ao2'),mode:'ao2',slug:'diagnose-scale-sign',title:'Diagnose sign and scale errors',activityType:'question-set',microSkillIds:[skill('reasoning'),skill('scaled-rules')],vocabularyTags:standardFunctionsVocabularyTags,implementationStep:50},
    {activityId:activity('tangent-stationary-applications','ao3'),mode:'ao3',slug:'tangent-stationary-applications',title:'Tangent and stationary-point applications',activityType:'question-set',microSkillIds:[skill('applications'),skill('mixed-selection')],vocabularyTags:standardFunctionsVocabularyTags,implementationStep:50}
  ]
});
