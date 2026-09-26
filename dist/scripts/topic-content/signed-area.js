import { defineTopicMetadata } from '../topic-metadata.js';
const prefix='y12:integration:signed-area';
const skill=(slug)=>`skill:${prefix}:${slug}`;
const activity=(slug,mode='understand')=>`activity:${prefix}:${mode}:${slug}`;
export const signedAreaVocabularyTags=Object.freeze(['vocab:signed-area','vocab:geometrical-area','vocab:axis-crossing','vocab:cancellation','vocab:split-integral','vocab:definite-integral']);
export const signedAreaTopic=defineTopicMetadata({
 topicId:`topic:${prefix}`,scopeId:'y12',strand:'integration',slug:'signed-area',title:'Areas below and crossing the axis',sequence:100,
 modes:['understand','memorise','ao1','ao2','ao3'],prerequisiteTopicIds:['topic:y12:integration:area'],prerequisiteTags:['integration-as-area','definite-integral'],vocabularyTags:signedAreaVocabularyTags,
 journey:[
  {id:'signed-contributions',title:'A definite integral is signed area',summary:'See above-axis regions contribute positively and below-axis regions negatively.',microSkillIds:[skill('signed-contributions')],vocabularyTags:['vocab:signed-area']},
  {id:'cancellation',title:'Positive and negative regions can cancel',summary:'Compare a zero signed integral with a non-zero geometrical area.',microSkillIds:[skill('cancellation')],vocabularyTags:['vocab:cancellation','vocab:geometrical-area']},
  {id:'split-roots',title:'Split at axis crossings',summary:'Choose the roots where the sign changes before calculating total geometrical area.',microSkillIds:[skill('split-at-roots')],vocabularyTags:['vocab:axis-crossing','vocab:split-integral']},
  {id:'total-area',title:'Add magnitudes for total area',summary:'Distinguish signed integral from total geometrical area and add region magnitudes.',microSkillIds:[skill('total-geometrical-area')],vocabularyTags:['vocab:geometrical-area','vocab:signed-area']}
 ],
 microSkills:[
  {microSkillId:skill('signed-contributions'),slug:'signed-contributions',title:'Interpret above-axis area as positive and below-axis area as negative',prerequisiteTags:['integration-as-area'],vocabularyTags:['vocab:signed-area'],supportTargets:{understand:activity('signed-contributions'),memorise:activity('signed-area-meaning','memorise'),ao1:activity('signed-contributions','ao1')}},
  {microSkillId:skill('cancellation'),slug:'cancellation',title:'Recognise cancellation between positive and negative signed regions',prerequisiteTags:['signed-area'],vocabularyTags:['vocab:cancellation','vocab:signed-area'],supportTargets:{understand:activity('cancellation-zero'),memorise:activity('cancellation','memorise'),ao1:activity('crossing-integral','ao1')}},
  {microSkillId:skill('split-at-roots'),slug:'split-at-roots',title:'Choose roots as split points when finding total geometrical area',prerequisiteTags:['roots'],vocabularyTags:['vocab:axis-crossing','vocab:split-integral'],supportTargets:{understand:activity('split-the-integral'),memorise:activity('split-at-roots','memorise'),ao1:activity('split-and-area','ao1')}},
  {microSkillId:skill('total-geometrical-area'),slug:'total-geometrical-area',title:'Find total geometrical area by adding magnitudes of signed pieces',prerequisiteTags:['split-at-roots'],vocabularyTags:['vocab:geometrical-area','vocab:signed-area'],supportTargets:{understand:activity('signed-vs-total'),memorise:activity('total-area','memorise'),ao1:activity('split-and-area','ao1')}},
  {microSkillId:skill('reasoning'),slug:'reasoning',title:'Explain why crossing the axis changes the area calculation',prerequisiteTags:['signed-area'],vocabularyTags:['vocab:cancellation','vocab:axis-crossing'],supportTargets:{understand:activity('split-the-integral'),ao1:activity('split-and-area','ao1')}},
  {microSkillId:skill('applications'),slug:'applications',title:'Apply signed and geometrical area ideas in a simple context',prerequisiteTags:['signed-area'],vocabularyTags:['vocab:signed-area','vocab:geometrical-area'],supportTargets:{}}
 ],
 activities:[
  {activityId:activity('signed-contributions'),mode:'understand',slug:'signed-contributions',title:'Above positive, below negative',activityType:'interactive',microSkillIds:[skill('signed-contributions')],vocabularyTags:signedAreaVocabularyTags,implementationStep:47},
  {activityId:activity('cancellation-zero'),mode:'understand',slug:'cancellation-zero',title:'When substantial areas cancel',activityType:'interactive',microSkillIds:[skill('cancellation')],vocabularyTags:signedAreaVocabularyTags,implementationStep:47},
  {activityId:activity('split-the-integral'),mode:'understand',slug:'split-the-integral',title:'Split the integral at roots',activityType:'interactive',microSkillIds:[skill('split-at-roots'),skill('reasoning')],vocabularyTags:signedAreaVocabularyTags,implementationStep:47},
  {activityId:activity('signed-vs-total'),mode:'understand',slug:'signed-vs-total',title:'Signed integral versus total geometrical area',activityType:'interactive',microSkillIds:[skill('total-geometrical-area')],vocabularyTags:signedAreaVocabularyTags,implementationStep:47},
  ...['signed-area-meaning','cancellation','split-at-roots','total-area','vocabulary-recall','memory-games','mixed-review'].map((slug,i)=>({activityId:activity(slug,'memorise'),mode:'memorise',slug,title:['Signed area','Cancellation','Split at roots','Total geometrical area','Vocabulary recall','Memory games','Mixed review'][i],activityType:'memory',microSkillIds:[skill(i===0?'signed-contributions':i===1?'cancellation':i===2?'split-at-roots':i===3?'total-geometrical-area':'signed-contributions')],vocabularyTags:signedAreaVocabularyTags,implementationStep:47})),
  {activityId:activity('signed-contributions','ao1'),mode:'ao1',slug:'signed-contributions',title:'Signed contributions',activityType:'question-set',microSkillIds:[skill('signed-contributions')],vocabularyTags:signedAreaVocabularyTags,implementationStep:47},
  {activityId:activity('crossing-integral','ao1'),mode:'ao1',slug:'crossing-integral',title:'Integrals across the axis',activityType:'question-set',microSkillIds:[skill('cancellation')],vocabularyTags:signedAreaVocabularyTags,implementationStep:47},
  {activityId:activity('split-and-area','ao1'),mode:'ao1',slug:'split-and-area',title:'Split and find total area',activityType:'question-set',microSkillIds:[skill('split-at-roots'),skill('total-geometrical-area'),skill('reasoning')],vocabularyTags:signedAreaVocabularyTags,implementationStep:47},
  {activityId:activity('explain-cancellation','ao2'),mode:'ao2',slug:'explain-cancellation',title:'Explain cancellation',activityType:'question-set',microSkillIds:[skill('reasoning'),skill('cancellation')],vocabularyTags:signedAreaVocabularyTags,implementationStep:47},
  {activityId:activity('diagnose-splitting','ao2'),mode:'ao2',slug:'diagnose-splitting',title:'Diagnose splitting errors',activityType:'question-set',microSkillIds:[skill('reasoning'),skill('split-at-roots')],vocabularyTags:signedAreaVocabularyTags,implementationStep:47},
  {activityId:activity('signed-area-applications','ao3'),mode:'ao3',slug:'signed-area-applications',title:'Signed-area applications',activityType:'question-set',microSkillIds:[skill('applications')],vocabularyTags:signedAreaVocabularyTags,implementationStep:47}
 ]
});
