import { defineTopicMetadata } from '../topic-metadata.js';
const prefix='y13:modelling:calculus'; const skill=s=>`skill:${prefix}:${s}`; const activity=(s,m='understand')=>`activity:${prefix}:${m}:${s}`;
export const calculusModellingVocabularyTags=Object.freeze(['vocab:model','vocab:derivative','vocab:definite-integral','vocab:rate-unit','vocab:restricted-domain']);
const support=(slug)=>({understand:activity(slug),memorise:activity(slug==='framework'?'framework-recall':slug==='method-choice'?'method-cues':'interpret-checks','memorise'),ao1:activity(slug==='method-choice'?'specified-step':'framework-practice','ao1')});
export const calculusModellingTopic=defineTopicMetadata({
 topicId:`topic:${prefix}`,scopeId:'y13-additional',strand:'modelling',slug:'calculus',title:'Full 9MA0 calculus modelling',sequence:380,
 modes:['understand','memorise','ao1','ao2','ao3'],
 prerequisiteTopicIds:['topic:y13:differentiation:connected-rates','topic:y13:integration:areas','topic:y13:integration:numerical-integration','topic:y13:differential-equations:first-order'],
 prerequisiteTags:['modelling','calculus-method-selection'],vocabularyTags:calculusModellingVocabularyTags,
 journey:[
  {id:'framework',title:'Use one modelling framework',summary:'Variables/units → relationship → target → method → solve → interpret → limitations.',microSkillIds:[skill('framework')],vocabularyTags:calculusModellingVocabularyTags},
  {id:'method-choice',title:'Choose calculus from structure',summary:'Do not let the context reveal the technique before the model and target are clear.',microSkillIds:[skill('method-choice')],vocabularyTags:calculusModellingVocabularyTags},
  {id:'exact-numerical',title:'Choose exact or numerical appropriately',summary:'Decide between exact methods, trapezium rule and numerical checking from the available information.',microSkillIds:[skill('exact-numerical')],vocabularyTags:calculusModellingVocabularyTags},
  {id:'interpret',title:'Interpret and critique',summary:'State sign, size, units, domain and realistic limitations.',microSkillIds:[skill('interpret-limitations')],vocabularyTags:calculusModellingVocabularyTags}
 ],
 microSkills:[
  {microSkillId:skill('framework'),slug:'framework',title:'Apply the seven-stage modelling scaffold',prerequisiteTags:['modelling'],vocabularyTags:calculusModellingVocabularyTags,supportTargets:support('framework')},
  {microSkillId:skill('method-choice'),slug:'method-choice',title:'Choose calculus only after relationship and target are identified',prerequisiteTags:['calculus-method-selection'],vocabularyTags:calculusModellingVocabularyTags,supportTargets:support('method-choice')},
  {microSkillId:skill('exact-numerical'),slug:'exact-numerical',title:'Choose exact versus numerical integration appropriately',prerequisiteTags:['integration-method-selection'],vocabularyTags:calculusModellingVocabularyTags,supportTargets:{understand:activity('exact-vs-numerical'),memorise:activity('method-cues','memorise'),ao2:activity('exact-vs-numerical','ao2')}},
  {microSkillId:skill('interpret-limitations'),slug:'interpret-limitations',title:'Interpret sign, units, domain and model limitations',prerequisiteTags:['modelling'],vocabularyTags:calculusModellingVocabularyTags,supportTargets:{understand:activity('interpret-limitations'),memorise:activity('interpret-checks','memorise'),ao2:activity('interpret-critique','ao2')}}
 ],
 activities:[
  ...[['framework','One scaffold for every calculus model'],['contexts','Same scaffold, different contexts'],['method-choice','Technique comes after target'],['exact-vs-numerical','Exact or numerical?'],['interpret-limitations','Interpret and test the model'],['combined-tools','Combine tools without changing layout']].map(([slug,title])=>({activityId:activity(slug),mode:'understand',slug,title,activityType:'interactive',microSkillIds:[skill(slug==='method-choice'||slug==='combined-tools'?'method-choice':slug==='exact-vs-numerical'?'exact-numerical':slug==='interpret-limitations'?'interpret-limitations':'framework')],vocabularyTags:calculusModellingVocabularyTags,implementationStep:74})),
  ...[['framework-recall','Seven-stage framework','framework'],['method-cues','Method-choice cues','method-choice'],['interpret-checks','Interpretation and limitation checks','interpret-limitations']].map(([slug,title,sk])=>({activityId:activity(slug,'memorise'),mode:'memorise',slug,title,activityType:'memory',microSkillIds:slug==='method-cues'?[skill('method-choice'),skill('exact-numerical')]:[skill(sk)],vocabularyTags:calculusModellingVocabularyTags,implementationStep:74})),
  {activityId:activity('specified-step','ao1'),mode:'ao1',slug:'specified-step',title:'Specified calculus step in context',activityType:'question-set',microSkillIds:[skill('method-choice')],vocabularyTags:calculusModellingVocabularyTags,implementationStep:74},
  {activityId:activity('framework-practice','ao1'),mode:'ao1',slug:'framework-practice',title:'Complete the modelling scaffold',activityType:'question-set',microSkillIds:[skill('framework'),skill('interpret-limitations')],vocabularyTags:calculusModellingVocabularyTags,implementationStep:74},
  {activityId:activity('method-appropriateness','ao2'),mode:'ao2',slug:'method-appropriateness',title:'Explain why a calculus method is appropriate',activityType:'question-set',microSkillIds:[skill('method-choice')],vocabularyTags:calculusModellingVocabularyTags,implementationStep:74},
  {activityId:activity('exact-vs-numerical','ao2'),mode:'ao2',slug:'exact-vs-numerical',title:'Exact versus numerical methods',activityType:'question-set',microSkillIds:[skill('exact-numerical')],vocabularyTags:calculusModellingVocabularyTags,implementationStep:74},
  {activityId:activity('interpret-critique','ao2'),mode:'ao2',slug:'interpret-critique',title:'Interpret, reason and critique',activityType:'question-set',microSkillIds:[skill('interpret-limitations')],vocabularyTags:calculusModellingVocabularyTags,implementationStep:74},
  {activityId:activity('topic-blind-model','ao3'),mode:'ao3',slug:'topic-blind-model',title:'Topic-blind modelling challenge',activityType:'question-set',microSkillIds:[skill('framework'),skill('method-choice'),skill('interpret-limitations')],vocabularyTags:calculusModellingVocabularyTags,implementationStep:74}
 ]
});
