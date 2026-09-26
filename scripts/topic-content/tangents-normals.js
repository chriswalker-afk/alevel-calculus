import { defineTopicMetadata } from '../topic-metadata.js';

const prefix = 'y12:differentiation:tangents-normals';
const skill = (slug) => `skill:${prefix}:${slug}`;
const activity = (slug, mode='understand') => `activity:${prefix}:${mode}:${slug}`;

export const tangentsNormalsVocabularyTags = Object.freeze([
  'vocab:derivative','vocab:gradient','vocab:tangent','vocab:normal','vocab:point-of-contact',
  'vocab:perpendicular','vocab:negative-reciprocal','vocab:horizontal-tangent','vocab:vertical-normal','vocab:point-slope-form'
]);

export const tangentsNormalsTopic = defineTopicMetadata({
  topicId: `topic:${prefix}`, scopeId:'y12', strand:'differentiation', slug:'tangents-normals', title:'Tangents and normals', sequence:40,
  modes:['understand','memorise','ao1','ao2','ao3'],
  prerequisiteTopicIds:['topic:y12:differentiation:basics'],
  prerequisiteTags:['differentiate-polynomials','straight-line-gradient','equation-of-line'],
  vocabularyTags:tangentsNormalsVocabularyTags,
  journey:[
    {id:'derivative-gradient',title:'Derivative gives gradient',summary:'Evaluate f′(a) to obtain the tangent gradient at x=a.',microSkillIds:[skill('tangent-gradient')],vocabularyTags:['vocab:derivative','vocab:tangent']},
    {id:'tangent-line',title:'Build the tangent',summary:'Use the point of contact (a,f(a)) and tangent gradient in point-slope form.',microSkillIds:[skill('tangent-line')],vocabularyTags:['vocab:point-of-contact','vocab:point-slope-form']},
    {id:'normal-gradient',title:'Turn to the normal',summary:'Use perpendicular gradients and the negative reciprocal when the tangent gradient is non-zero.',microSkillIds:[skill('normal-gradient')],vocabularyTags:['vocab:normal','vocab:perpendicular','vocab:negative-reciprocal']},
    {id:'normal-line',title:'Build the normal',summary:'Use the same point of contact with the normal gradient.',microSkillIds:[skill('normal-line')],vocabularyTags:['vocab:normal','vocab:point-slope-form']},
    {id:'special-cases',title:'Handle special cases',summary:'A horizontal tangent has gradient 0 and its normal is the vertical line x=a.',microSkillIds:[skill('special-cases')],vocabularyTags:['vocab:horizontal-tangent','vocab:vertical-normal']}
  ],
  microSkills:[
    {microSkillId:skill('tangent-gradient'),slug:'tangent-gradient',title:'Find tangent gradient from f′(a)',prerequisiteTags:['differentiate-polynomials'],vocabularyTags:['vocab:derivative','vocab:tangent'],supportTargets:{understand:activity('derivative-gradient'),memorise:activity('key-facts','memorise'),ao1:activity('tangent-gradient','ao1')}},
    {microSkillId:skill('tangent-line'),slug:'tangent-line',title:'Find a tangent equation',prerequisiteTags:['equation-of-line'],vocabularyTags:['vocab:tangent','vocab:point-of-contact','vocab:point-slope-form'],supportTargets:{understand:activity('tangent-line'),memorise:activity('formula-recall','memorise'),ao1:activity('tangent-line','ao1')}},
    {microSkillId:skill('normal-gradient'),slug:'normal-gradient',title:'Find a perpendicular normal gradient',prerequisiteTags:['reciprocal','negative-numbers'],vocabularyTags:['vocab:normal','vocab:perpendicular','vocab:negative-reciprocal'],supportTargets:{understand:activity('normal-gradient'),memorise:activity('key-facts','memorise'),ao1:activity('normal-gradient','ao1')}},
    {microSkillId:skill('normal-line'),slug:'normal-line',title:'Find a normal equation',prerequisiteTags:['equation-of-line'],vocabularyTags:['vocab:normal','vocab:point-slope-form'],supportTargets:{understand:activity('normal-line'),ao1:activity('normal-line','ao1')}},
    {microSkillId:skill('special-cases'),slug:'special-cases',title:'Handle horizontal tangents and vertical normals',prerequisiteTags:['gradient-zero'],vocabularyTags:['vocab:horizontal-tangent','vocab:vertical-normal'],supportTargets:{understand:activity('special-cases'),memorise:activity('special-cases','memorise'),ao2:activity('special-cases','ao2')}}
  ],
  activities:[
    {activityId:activity('derivative-gradient'),mode:'understand',slug:'derivative-gradient',title:'Derivative gives the tangent gradient',activityType:'interactive',microSkillIds:[skill('tangent-gradient')],vocabularyTags:['vocab:derivative','vocab:tangent'],implementationStep:40},
    {activityId:activity('tangent-line'),mode:'understand',slug:'tangent-line',title:'A tangent needs a gradient and a point',activityType:'interactive',microSkillIds:[skill('tangent-line')],vocabularyTags:['vocab:point-of-contact','vocab:point-slope-form'],implementationStep:40},
    {activityId:activity('normal-gradient'),mode:'understand',slug:'normal-gradient',title:'The normal is perpendicular',activityType:'interactive',microSkillIds:[skill('normal-gradient')],vocabularyTags:['vocab:normal','vocab:negative-reciprocal'],implementationStep:40},
    {activityId:activity('normal-line'),mode:'understand',slug:'normal-line',title:'Use the same point for the normal',activityType:'interactive',microSkillIds:[skill('normal-line')],vocabularyTags:['vocab:normal','vocab:point-slope-form'],implementationStep:40},
    {activityId:activity('special-cases'),mode:'understand',slug:'special-cases',title:'Horizontal tangent, vertical normal',activityType:'interactive',microSkillIds:[skill('special-cases')],vocabularyTags:['vocab:horizontal-tangent','vocab:vertical-normal'],implementationStep:40},
    {activityId:activity('key-facts','memorise'),mode:'memorise',slug:'key-facts',title:'Tangents and normals key facts',activityType:'memory',microSkillIds:[skill('tangent-gradient'),skill('normal-gradient')],vocabularyTags:tangentsNormalsVocabularyTags,implementationStep:40},
    {activityId:activity('formula-recall','memorise'),mode:'memorise',slug:'formula-recall',title:'Formula recall',activityType:'memory',microSkillIds:[skill('tangent-line'),skill('normal-gradient')],vocabularyTags:['vocab:point-slope-form','vocab:negative-reciprocal'],implementationStep:40},
    {activityId:activity('special-cases','memorise'),mode:'memorise',slug:'special-cases',title:'Special-case recall',activityType:'memory',microSkillIds:[skill('special-cases')],vocabularyTags:['vocab:horizontal-tangent','vocab:vertical-normal'],implementationStep:40},
    {activityId:activity('vocabulary-recall','memorise'),mode:'memorise',slug:'vocabulary-recall',title:'Vocabulary recall',activityType:'memory',microSkillIds:[skill('normal-gradient')],vocabularyTags:tangentsNormalsVocabularyTags,implementationStep:40},
    {activityId:activity('memory-games','memorise'),mode:'memorise',slug:'memory-games',title:'Tangents and normals memory games',activityType:'memory',microSkillIds:[skill('tangent-line'),skill('normal-gradient')],vocabularyTags:tangentsNormalsVocabularyTags,implementationStep:40},
    {activityId:activity('mixed-review','memorise'),mode:'memorise',slug:'mixed-review',title:'Mixed tangents and normals review',activityType:'memory',microSkillIds:[skill('tangent-gradient'),skill('normal-line'),skill('special-cases')],vocabularyTags:tangentsNormalsVocabularyTags,implementationStep:40},
    {activityId:activity('tangent-gradient','ao1'),mode:'ao1',slug:'tangent-gradient',title:'Find tangent gradients',activityType:'question-set',microSkillIds:[skill('tangent-gradient')],vocabularyTags:['vocab:tangent'],implementationStep:40},
    {activityId:activity('tangent-line','ao1'),mode:'ao1',slug:'tangent-line',title:'Find tangent equations',activityType:'question-set',microSkillIds:[skill('tangent-line')],vocabularyTags:['vocab:tangent','vocab:point-slope-form'],implementationStep:40},
    {activityId:activity('normal-gradient','ao1'),mode:'ao1',slug:'normal-gradient',title:'Find normal gradients',activityType:'question-set',microSkillIds:[skill('normal-gradient')],vocabularyTags:['vocab:normal'],implementationStep:40},
    {activityId:activity('normal-line','ao1'),mode:'ao1',slug:'normal-line',title:'Find normal equations',activityType:'question-set',microSkillIds:[skill('normal-line')],vocabularyTags:['vocab:normal','vocab:point-slope-form'],implementationStep:40},
    {activityId:activity('explain-perpendicular','ao2'),mode:'ao2',slug:'explain-perpendicular',title:'Explain the normal gradient',activityType:'question-set',microSkillIds:[skill('normal-gradient')],vocabularyTags:['vocab:perpendicular','vocab:negative-reciprocal'],implementationStep:40},
    {activityId:activity('special-cases','ao2'),mode:'ao2',slug:'special-cases',title:'Reason about special cases',activityType:'question-set',microSkillIds:[skill('special-cases')],vocabularyTags:['vocab:horizontal-tangent','vocab:vertical-normal'],implementationStep:40},
    {activityId:activity('diagnose-line','ao2'),mode:'ao2',slug:'diagnose-line',title:'Diagnose tangent and normal errors',activityType:'question-set',microSkillIds:[skill('tangent-line'),skill('normal-line')],vocabularyTags:['vocab:point-of-contact','vocab:point-slope-form'],implementationStep:40},
    {activityId:activity('applications','ao3'),mode:'ao3',slug:'applications',title:'Apply tangents and normals',activityType:'question-set',microSkillIds:[skill('tangent-line'),skill('normal-line')],vocabularyTags:['vocab:tangent','vocab:normal'],implementationStep:40}
  ]
});
