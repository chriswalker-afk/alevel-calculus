import { defineTopicMetadata } from '../topic-metadata.js';
const prefix='y12:integration:introduction';
const skill=(slug)=>`skill:${prefix}:${slug}`;
const activity=(slug,mode='understand')=>`activity:${prefix}:${mode}:${slug}`;
export const integrationIntroVocabularyTags=Object.freeze(['vocab:integration','vocab:antiderivative','vocab:constant-of-integration','vocab:indefinite-integral','vocab:integrand']);
export const integrationIntroTopic=defineTopicMetadata({
  topicId:`topic:${prefix}`,scopeId:'y12',strand:'integration',slug:'introduction',title:'Introduction to integration',sequence:70,
  modes:['understand','memorise','ao1','ao2','ao3'],
  prerequisiteTopicIds:['topic:y12:differentiation:basics','topic:y12:foundations:pre-calculus'],
  prerequisiteTags:['differentiate-polynomials','indices'],vocabularyTags:integrationIntroVocabularyTags,
  journey:[
    {id:'reverse',title:'Reverse differentiation',summary:'Recover possible original functions from a derivative.',microSkillIds:[skill('reverse-differentiation')],vocabularyTags:['vocab:integration','vocab:antiderivative']},
    {id:'constant',title:'Why +C?',summary:'Use vertically translated curves to see why the derivative cannot determine height.',microSkillIds:[skill('constant-of-integration')],vocabularyTags:['vocab:constant-of-integration']},
    {id:'rule',title:'Integration power rule',summary:'Reverse the differentiation power rule, including constants, roots and suitable negative powers.',microSkillIds:[skill('power-rule')],vocabularyTags:['vocab:indefinite-integral','vocab:integrand']},
    {id:'terms',title:'Integrate term by term',summary:'Integrate sums and differences one term at a time and add one constant after recombining.',microSkillIds:[skill('term-by-term')],vocabularyTags:['vocab:constant-of-integration']}
  ],
  microSkills:[
    {microSkillId:skill('reverse-differentiation'),slug:'reverse-differentiation',title:'Recognise integration as reverse differentiation',prerequisiteTags:['differentiate-polynomials'],vocabularyTags:['vocab:integration','vocab:antiderivative'],supportTargets:{understand:activity('guess-original'),memorise:activity('reverse-facts','memorise'),ao1:activity('reverse-differentiate','ao1')}},
    {microSkillId:skill('constant-of-integration'),slug:'constant-of-integration',title:'Explain why indefinite antiderivatives need +C',prerequisiteTags:['vertical-translation'],vocabularyTags:['vocab:constant-of-integration'],supportTargets:{understand:activity('family-of-curves'),memorise:activity('plus-c','memorise'),ao1:activity('power-rule','ao1')}},
    {microSkillId:skill('power-rule'),slug:'power-rule',title:'Integrate powers of x using the reverse power rule',prerequisiteTags:['indices'],vocabularyTags:['vocab:integration','vocab:integrand'],supportTargets:{understand:activity('power-rule'),memorise:activity('power-rule','memorise'),ao1:activity('power-rule','ao1')}},
    {microSkillId:skill('rewrite-powers'),slug:'rewrite-powers',title:'Rewrite roots and reciprocals as powers before integrating',prerequisiteTags:['indices'],vocabularyTags:['vocab:integration'],supportTargets:{understand:activity('power-rule'),memorise:activity('special-cases','memorise'),ao1:activity('rewrite-and-integrate','ao1')}},
    {microSkillId:skill('term-by-term'),slug:'term-by-term',title:'Integrate sums and differences term by term',prerequisiteTags:['algebraic-simplification'],vocabularyTags:['vocab:constant-of-integration'],supportTargets:{understand:activity('term-by-term'),memorise:activity('term-by-term','memorise'),ao1:activity('term-by-term','ao1')}},
    {microSkillId:skill('reasoning'),slug:'reasoning',title:'Reason about families of antiderivatives and common errors',prerequisiteTags:['differentiate-polynomials'],vocabularyTags:['vocab:antiderivative','vocab:constant-of-integration'],supportTargets:{understand:activity('family-of-curves')}},
    {microSkillId:skill('applications'),slug:'applications',title:'Apply routine antiderivatives in simple contexts',prerequisiteTags:['integration-power-rule'],vocabularyTags:['vocab:integration'],supportTargets:{}}
  ],
  activities:[
    ...['guess-original','family-of-curves','constant-of-integration','power-rule','term-by-term'].map((slug,i)=>({activityId:activity(slug),mode:'understand',slug,title:['Guess the original function','Gradient does not determine height','Reveal the constant of integration','Reverse the power rule','Integrate term by term'][i],activityType:'interactive',microSkillIds:i===1?[skill('constant-of-integration'),skill('reasoning')]:i===3?[skill('power-rule'),skill('rewrite-powers')]:[skill(i===0?'reverse-differentiation':i<3?'constant-of-integration':'term-by-term')],vocabularyTags:integrationIntroVocabularyTags,implementationStep:44})),
    ...['reverse-facts','power-rule','special-cases','term-by-term','plus-c','vocabulary-recall','memory-games','mixed-review'].map((slug,i)=>({activityId:activity(slug,'memorise'),mode:'memorise',slug,title:['Reverse differentiation','Integration power rule','Constants, x, roots and reciprocals','Term-by-term integration','The constant +C','Vocabulary recall','Memory games','Mixed review'][i],activityType:'memory',microSkillIds:[skill(i===0?'reverse-differentiation':i===1?'power-rule':i===2?'rewrite-powers':i===3?'term-by-term':i===4?'constant-of-integration':'power-rule')],vocabularyTags:integrationIntroVocabularyTags,implementationStep:44})),
    {activityId:activity('reverse-differentiate','ao1'),mode:'ao1',slug:'reverse-differentiate',title:'Reverse differentiation',activityType:'question-set',microSkillIds:[skill('reverse-differentiation')],vocabularyTags:integrationIntroVocabularyTags,implementationStep:44},
    {activityId:activity('power-rule','ao1'),mode:'ao1',slug:'power-rule',title:'Integration power rule',activityType:'question-set',microSkillIds:[skill('power-rule'),skill('constant-of-integration')],vocabularyTags:integrationIntroVocabularyTags,implementationStep:44},
    {activityId:activity('rewrite-and-integrate','ao1'),mode:'ao1',slug:'rewrite-and-integrate',title:'Rewrite and integrate',activityType:'question-set',microSkillIds:[skill('rewrite-powers')],vocabularyTags:integrationIntroVocabularyTags,implementationStep:44},
    {activityId:activity('term-by-term','ao1'),mode:'ao1',slug:'term-by-term',title:'Integrate term by term',activityType:'question-set',microSkillIds:[skill('term-by-term')],vocabularyTags:integrationIntroVocabularyTags,implementationStep:44},
    {activityId:activity('why-plus-c','ao2'),mode:'ao2',slug:'why-plus-c',title:'Why +C?',activityType:'question-set',microSkillIds:[skill('constant-of-integration')],vocabularyTags:integrationIntroVocabularyTags,implementationStep:44},
    {activityId:activity('diagnose-errors','ao2'),mode:'ao2',slug:'diagnose-errors',title:'Diagnose integration errors',activityType:'question-set',microSkillIds:[skill('reasoning')],vocabularyTags:integrationIntroVocabularyTags,implementationStep:44},
    {activityId:activity('simple-applications','ao3'),mode:'ao3',slug:'simple-applications',title:'Simple reverse-rate applications',activityType:'question-set',microSkillIds:[skill('applications')],vocabularyTags:integrationIntroVocabularyTags,implementationStep:44}
  ]
});
