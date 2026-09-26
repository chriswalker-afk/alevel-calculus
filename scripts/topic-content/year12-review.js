import { defineTopicMetadata } from '../topic-metadata.js';
import { basicsDifferentiationVocabularyTags } from './basics-differentiation.js';
import { firstPrinciplesVocabularyTags } from './first-principles.js';
import { tangentsNormalsVocabularyTags } from './tangents-normals.js';
import { stationaryPointsVocabularyTags } from './stationary-points.js';
import { increasingDecreasingVocabularyTags } from './increasing-decreasing.js';
import { integrationIntroVocabularyTags } from './integration-intro.js';
import { definiteIndefiniteVocabularyTags } from './definite-indefinite-integration.js';
import { integrationAreaVocabularyTags } from './integration-area.js';
import { signedAreaVocabularyTags } from './signed-area.js';

const prefix='y12:review:calculus-mastery';
const skill=(slug)=>`skill:${prefix}:${slug}`;
const activity=(slug,mode='memorise')=>`activity:${prefix}:${mode}:${slug}`;
export const year12ReviewVocabularyTags=Object.freeze([...new Set([
  ...basicsDifferentiationVocabularyTags,...firstPrinciplesVocabularyTags,...tangentsNormalsVocabularyTags,
  ...stationaryPointsVocabularyTags,...increasingDecreasingVocabularyTags,...integrationIntroVocabularyTags,
  ...definiteIndefiniteVocabularyTags,...integrationAreaVocabularyTags,...signedAreaVocabularyTags
])]);

export const year12ReviewTopic=defineTopicMetadata({
  topicId:`topic:${prefix}`,scopeId:'y12',strand:'review',slug:'calculus-mastery',title:'Year 12 review and mastery',sequence:110,
  modes:['memorise','ao1','ao2','ao3'],
  prerequisiteTopicIds:[
    'topic:y12:differentiation:basics','topic:y12:differentiation:first-principles','topic:y12:differentiation:tangents-normals',
    'topic:y12:differentiation:stationary-points','topic:y12:differentiation:increasing-decreasing','topic:y12:integration:introduction',
    'topic:y12:integration:definite-indefinite','topic:y12:integration:area','topic:y12:integration:signed-area'
  ],
  prerequisiteTags:['year12-calculus-complete'],vocabularyTags:year12ReviewVocabularyTags,
  journey:[
    {id:'remember',title:'Things to remember',summary:'Consolidate the essential Year 12 calculus facts without adding new content.',microSkillIds:[skill('consolidated-recall')],vocabularyTags:year12ReviewVocabularyTags},
    {id:'vocabulary',title:'Vocabulary check',summary:'Retrieve definitions, notation and diagram meanings from the shared Year 12 vocabulary.',microSkillIds:[skill('vocabulary-check')],vocabularyTags:year12ReviewVocabularyTags},
    {id:'mixed-ao1',title:'Topic-blind AO1',summary:'Execute routine Year 12 calculus without being told the topic first.',microSkillIds:[skill('mixed-ao1')],vocabularyTags:year12ReviewVocabularyTags},
    {id:'mixed-ao2',title:'Topic-blind AO2',summary:'Connect representations, explain ideas and diagnose incorrect reasoning.',microSkillIds:[skill('mixed-ao2')],vocabularyTags:year12ReviewVocabularyTags},
    {id:'mixed-ao3',title:'Topic-blind AO3',summary:'Decide what calculus is needed in multi-step applications.',microSkillIds:[skill('mixed-ao3')],vocabularyTags:year12ReviewVocabularyTags},
    {id:'mastery',title:'Diagnostic mastery',summary:'Mix AO1-AO3 and turn weaknesses into precise next steps.',microSkillIds:[skill('diagnostic-mastery')],vocabularyTags:year12ReviewVocabularyTags}
  ],
  microSkills:[
    {microSkillId:skill('consolidated-recall'),slug:'consolidated-recall',title:'Recall the complete Year 12 calculus reference',prerequisiteTags:[],vocabularyTags:year12ReviewVocabularyTags,supportTargets:{}},
    {microSkillId:skill('vocabulary-check'),slug:'vocabulary-check',title:'Recall Year 12 calculus vocabulary and notation',prerequisiteTags:[],vocabularyTags:year12ReviewVocabularyTags,supportTargets:{}},
    {microSkillId:skill('mixed-ao1'),slug:'mixed-ao1',title:'Complete topic-blind Year 12 AO1 practice',prerequisiteTags:[],vocabularyTags:year12ReviewVocabularyTags,supportTargets:{}},
    {microSkillId:skill('mixed-ao2'),slug:'mixed-ao2',title:'Complete topic-blind Year 12 AO2 reasoning',prerequisiteTags:[],vocabularyTags:year12ReviewVocabularyTags,supportTargets:{}},
    {microSkillId:skill('mixed-ao3'),slug:'mixed-ao3',title:'Complete topic-blind Year 12 AO3 applications',prerequisiteTags:[],vocabularyTags:year12ReviewVocabularyTags,supportTargets:{}},
    {microSkillId:skill('diagnostic-mastery'),slug:'diagnostic-mastery',title:'Use mixed evidence to identify precise next steps',prerequisiteTags:[],vocabularyTags:year12ReviewVocabularyTags,supportTargets:{}}
  ],
  activities:[
    ...[
      ['gradient-derivatives','Gradient and derivatives'],['first-principles','First principles'],['tangents-normals','Tangents and normals'],
      ['stationary-points','Stationary points'],['increasing-decreasing','Increasing and decreasing'],['integration','Integration'],
      ['definite-integration','Definite integration'],['areas','Areas']
    ].map(([slug,title])=>({activityId:activity(slug),mode:'memorise',slug,title,activityType:'memory',microSkillIds:[skill('consolidated-recall')],vocabularyTags:year12ReviewVocabularyTags,implementationStep:48})),
    ...[
      ['vocabulary-flashcards','Vocabulary flashcards'],['definition-matching','Definition matching'],['diagram-notation-check','Term, diagram and notation check'],['mixed-recall','Mixed recall']
    ].map(([slug,title])=>({activityId:activity(slug),mode:'memorise',slug,title,activityType:'memory',microSkillIds:[skill('vocabulary-check')],vocabularyTags:year12ReviewVocabularyTags,implementationStep:48})),
    {activityId:activity('topic-blind-mixed','ao1'),mode:'ao1',slug:'topic-blind-mixed',title:'Topic-blind mixed AO1',activityType:'question-set',microSkillIds:[skill('mixed-ao1')],vocabularyTags:year12ReviewVocabularyTags,implementationStep:48},
    {activityId:activity('topic-blind-mixed','ao2'),mode:'ao2',slug:'topic-blind-mixed',title:'Topic-blind mixed AO2',activityType:'question-set',microSkillIds:[skill('mixed-ao2')],vocabularyTags:year12ReviewVocabularyTags,implementationStep:48},
    {activityId:activity('topic-blind-mixed','ao3'),mode:'ao3',slug:'topic-blind-mixed',title:'Topic-blind mixed AO3',activityType:'question-set',microSkillIds:[skill('mixed-ao3')],vocabularyTags:year12ReviewVocabularyTags,implementationStep:48},
    {activityId:activity('diagnostic-mastery','ao3'),mode:'ao3',slug:'diagnostic-mastery',title:'Diagnostic mastery',activityType:'mastery',microSkillIds:[skill('diagnostic-mastery')],vocabularyTags:year12ReviewVocabularyTags,implementationStep:48}
  ]
});
