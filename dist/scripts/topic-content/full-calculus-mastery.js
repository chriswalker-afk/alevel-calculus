import { defineTopicMetadata } from '../topic-metadata.js';
const prefix='full:review:full-calculus-mastery';
const skill=s=>`skill:${prefix}:${s}`; const activity=(s,m)=>`activity:${prefix}:${m}:${s}`;
export const fullCalculusMasteryTopic=defineTopicMetadata({
 topicId:`topic:${prefix}`,scopeId:'full-alevel',strand:'review',slug:'full-calculus-mastery',title:'Full 9MA0 calculus mastery',sequence:390,
 modes:['ao1','ao2','ao3'],prerequisiteTopicIds:['topic:full:review:calculus-mastery','topic:y13:modelling:calculus'],prerequisiteTags:['full-calculus-complete','calculus-method-selection'],vocabularyTags:[],
 journey:[
  {id:'recognise',title:'Select the method only',summary:'Identify the structure before calculating.',microSkillIds:[skill('recognition')],vocabularyTags:[]},
  {id:'order',title:'Which method first?',summary:'Decide whether to simplify, rewrite or sequence more than one method.',microSkillIds:[skill('order')],vocabularyTags:[]},
  {id:'execute',title:'Select, complete and check',summary:'Choose a route, carry it out, then check the result.',microSkillIds:[skill('execution')],vocabularyTags:[]},
  {id:'interpret',title:'Explain and interpret',summary:'Justify choices and finish with contextual meaning where required.',microSkillIds:[skill('interpretation')],vocabularyTags:[]},
  {id:'mastery',title:'Full mixed mastery',summary:'Topic-blind AO1-AO3 evidence across the full calculus course.',microSkillIds:[skill('mastery')],vocabularyTags:[]}
 ],
 microSkills:[
  {microSkillId:skill('recognition'),slug:'recognition',title:'Recognise the required calculus method',prerequisiteTags:['calculus-method-selection'],vocabularyTags:[],supportTargets:{ao1:activity('method-only','ao1')}},
  {microSkillId:skill('order'),slug:'order',title:'Choose the correct first step or method order',prerequisiteTags:['calculus-method-selection'],vocabularyTags:[],supportTargets:{ao1:activity('which-method-first','ao1')}},
  {microSkillId:skill('execution'),slug:'execution',title:'Execute a selected calculus route accurately',prerequisiteTags:['full-calculus-complete'],vocabularyTags:[],supportTargets:{ao1:activity('select-complete-check','ao1')}},
  {microSkillId:skill('interpretation'),slug:'interpretation',title:'Explain method choice and interpret results',prerequisiteTags:['modelling'],vocabularyTags:[],supportTargets:{ao2:activity('select-and-explain','ao2')}},
  {microSkillId:skill('mastery'),slug:'mastery',title:'Use topic-blind evidence across AO1-AO3',prerequisiteTags:['full-calculus-complete'],vocabularyTags:[],supportTargets:{ao3:activity('mixed-mastery','ao3')}}
 ],
 activities:[
  {activityId:activity('method-only','ao1'),mode:'ao1',slug:'method-only',title:'Method only: what do I need?',activityType:'question-set',microSkillIds:[skill('recognition')],vocabularyTags:[],implementationStep:75},
  {activityId:activity('which-method-first','ao1'),mode:'ao1',slug:'which-method-first',title:'Simplify, rewrite or which method first?',activityType:'question-set',microSkillIds:[skill('order')],vocabularyTags:[],implementationStep:75},
  {activityId:activity('select-complete-check','ao1'),mode:'ao1',slug:'select-complete-check',title:'Select, complete and check',activityType:'question-set',microSkillIds:[skill('recognition'),skill('execution')],vocabularyTags:[],implementationStep:75},
  {activityId:activity('select-and-explain','ao2'),mode:'ao2',slug:'select-and-explain',title:'Select and explain',activityType:'question-set',microSkillIds:[skill('recognition'),skill('interpretation')],vocabularyTags:[],implementationStep:75},
  {activityId:activity('diagnose-order','ao2'),mode:'ao2',slug:'diagnose-order',title:'Diagnose method order',activityType:'question-set',microSkillIds:[skill('order'),skill('execution')],vocabularyTags:[],implementationStep:75},
  {activityId:activity('mixed-mastery','ao3'),mode:'ao3',slug:'mixed-mastery',title:'Full 9MA0 mixed mastery',activityType:'mastery',microSkillIds:[skill('mastery')],vocabularyTags:[],implementationStep:75}
 ]
});
