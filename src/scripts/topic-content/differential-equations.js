import { defineTopicMetadata } from '../topic-metadata.js';
const prefix='y13:differential-equations:first-order';
const skill=s=>`skill:${prefix}:${s}`; const activity=(mode,s)=>`activity:${prefix}:${mode}:${s}`;
export const differentialEquationsVocabularyTags=Object.freeze([
  'vocab:differential-equation','vocab:first-order','vocab:independent-variable','vocab:dependent-variable','vocab:separable','vocab:general-solution','vocab:particular-solution','vocab:arbitrary-constant','vocab:initial-condition','vocab:boundary-condition','vocab:model','vocab:proportionality-constant'
]);
const micros=[
 ['vocabulary','Use first-order differential-equation vocabulary precisely',['differential-notation']],
 ['translate-rate','Translate verbal rate statements into differential equations',['proportionality']],
 ['recognise-separable','Recognise separable first-order differential equations',['algebraic-rearrangement']],
 ['separate-only','Separate variables using multiplication and division',['algebraic-rearrangement']],
 ['integrate-both-sides','Integrate a separated equation and combine arbitrary constants',['standard-integrals']],
 ['family-particular','Explain general versus particular solutions',['constant-of-integration']],
 ['initial-condition','Apply an initial or boundary condition to find a particular solution',['substitution']],
 ['interpret-model','Interpret constants, signs, units and long-term behaviour',['modelling','units']],
 ['model-limitations','State assumptions, realistic domain and limitations of a differential-equation model',['modelling']],
 ['applications','Construct, solve and interpret a differential-equation model in context',['proportionality','integration-method-selection']]
];
const support={
 vocabulary:{understand:activity('understand','vocabulary')},
 'translate-rate':{understand:activity('understand','translate-rate-statements'),memorise:activity('memorise','translation-signs'),ao1:activity('ao1','construct-rate-equations')},
 'recognise-separable':{understand:activity('understand','recognise-separable'),memorise:activity('memorise','separation-method'),ao1:activity('ao1','solve-and-condition')},
 'separate-only':{understand:activity('understand','separate-only'),memorise:activity('memorise','separation-method'),ao1:activity('ao1','solve-and-condition')},
 'integrate-both-sides':{understand:activity('understand','integrate-both-sides'),memorise:activity('memorise','separation-method'),ao1:activity('ao1','solve-and-condition')},
 'family-particular':{understand:activity('understand','family-particular'),memorise:activity('memorise','general-particular'),ao1:activity('ao1','solve-and-condition')},
 'initial-condition':{memorise:activity('memorise','general-particular'),ao1:activity('ao1','solve-and-condition')},
 'interpret-model':{memorise:activity('memorise','model-checks'),ao1:activity('ao1','interpret-solutions')},
 'model-limitations':{memorise:activity('memorise','model-checks'),ao1:activity('ao1','interpret-solutions')},
 applications:{memorise:activity('memorise','model-checks'),ao1:activity('ao1','construct-rate-equations')}
};
export const differentialEquationsTopic=defineTopicMetadata({
  topicId:`topic:${prefix}`,scopeId:'y13-additional',strand:'differential-equations',slug:'first-order',title:'First-order differential equations',sequence:370,
  modes:['understand','memorise','ao1','ao2','ao3'],prerequisiteTopicIds:['topic:y12:integration:introduction','topic:y13:integration:standard-integrals'],prerequisiteTags:['differential-notation','integration-method-selection','proportionality'],vocabularyTags:differentialEquationsVocabularyTags,
  journey:[
    {id:'language',title:'Read and translate the model',summary:'Translate the context into a signed first-order differential equation.',microSkillIds:[skill('vocabulary'),skill('translate-rate')]},
    {id:'separate',title:'Separate before integrating',summary:'Recognise separability and gather x- and y-factors on opposite sides.',microSkillIds:[skill('recognise-separable'),skill('separate-only')]},
    {id:'solve',title:'Integrate and apply a condition',summary:'Use the existing integration toolkit, form the general solution, then determine the constant.',microSkillIds:[skill('integrate-both-sides'),skill('family-particular'),skill('initial-condition')]},
    {id:'interpret',title:'Interpret the model rather than just the algebra',summary:'Attach signs, units, long-term behaviour, assumptions and realistic domain.',microSkillIds:[skill('interpret-model'),skill('model-limitations')]},
    {id:'apply',title:'Build and critique unfamiliar models',summary:'Construct, solve and judge a model without extrapolating it blindly.',microSkillIds:[skill('applications')]}
  ],
  microSkills:micros.map(([slug,title,prerequisiteTags])=>({microSkillId:skill(slug),slug,title,prerequisiteTags,vocabularyTags:differentialEquationsVocabularyTags,supportTargets:support[slug]})),
  activities:[
    ...[['vocabulary','Key vocabulary'],['translate-rate-statements','Translate rate statements'],['recognise-separable','Recognise separable structure'],['separate-only','Separate variables — and stop'],['integrate-both-sides','Integrate both sides'],['family-particular','General family and particular solution']].map(([slug,title])=>({activityId:activity('understand',slug),mode:'understand',slug,title,activityType:'interactive',microSkillIds:[skill(slug==='translate-rate-statements'?'translate-rate':slug==='recognise-separable'?'recognise-separable':slug==='separate-only'?'separate-only':slug==='integrate-both-sides'?'integrate-both-sides':slug==='family-particular'?'family-particular':'vocabulary')],vocabularyTags:differentialEquationsVocabularyTags,implementationStep:72})),
    {activityId:activity('memorise','translation-signs'),mode:'memorise',slug:'translation-signs',title:'Rate language, k and signs',activityType:'memory',microSkillIds:[skill('translate-rate')],vocabularyTags:differentialEquationsVocabularyTags,implementationStep:73},
    {activityId:activity('memorise','separation-method'),mode:'memorise',slug:'separation-method',title:'Separate → integrate → +C',activityType:'memory',microSkillIds:[skill('recognise-separable'),skill('separate-only'),skill('integrate-both-sides')],vocabularyTags:differentialEquationsVocabularyTags,implementationStep:73},
    {activityId:activity('memorise','general-particular'),mode:'memorise',slug:'general-particular',title:'General → condition → particular',activityType:'memory',microSkillIds:[skill('family-particular'),skill('initial-condition')],vocabularyTags:differentialEquationsVocabularyTags,implementationStep:73},
    {activityId:activity('memorise','model-checks'),mode:'memorise',slug:'model-checks',title:'Interpretation and model checks',activityType:'memory',microSkillIds:[skill('interpret-model'),skill('model-limitations'),skill('applications')],vocabularyTags:differentialEquationsVocabularyTags,implementationStep:73},
    {activityId:activity('ao1','construct-rate-equations'),mode:'ao1',slug:'construct-rate-equations',title:'Construct rate equations',activityType:'question-set',microSkillIds:[skill('translate-rate'),skill('applications')],vocabularyTags:differentialEquationsVocabularyTags,implementationStep:73},
    {activityId:activity('ao1','solve-and-condition'),mode:'ao1',slug:'solve-and-condition',title:'Solve and apply conditions',activityType:'question-set',microSkillIds:[skill('recognise-separable'),skill('separate-only'),skill('integrate-both-sides'),skill('family-particular'),skill('initial-condition')],vocabularyTags:differentialEquationsVocabularyTags,implementationStep:73},
    {activityId:activity('ao1','interpret-solutions'),mode:'ao1',slug:'interpret-solutions',title:'Interpret signs, units and long-term behaviour',activityType:'question-set',microSkillIds:[skill('interpret-model'),skill('model-limitations')],vocabularyTags:differentialEquationsVocabularyTags,implementationStep:73},
    {activityId:activity('ao2','explain-and-diagnose'),mode:'ao2',slug:'explain-and-diagnose',title:'Explain and diagnose solution methods',activityType:'question-set',microSkillIds:[skill('separate-only'),skill('initial-condition')],vocabularyTags:differentialEquationsVocabularyTags,implementationStep:73},
    {activityId:activity('ao2','assumptions-limitations'),mode:'ao2',slug:'assumptions-limitations',title:'Assumptions and model limitations',activityType:'question-set',microSkillIds:[skill('interpret-model'),skill('model-limitations')],vocabularyTags:differentialEquationsVocabularyTags,implementationStep:73},
    {activityId:activity('ao3','unfamiliar-modelling'),mode:'ao3',slug:'unfamiliar-modelling',title:'Unfamiliar differential-equation modelling',activityType:'question-set',microSkillIds:[skill('applications')],vocabularyTags:differentialEquationsVocabularyTags,implementationStep:73}
  ]
});
