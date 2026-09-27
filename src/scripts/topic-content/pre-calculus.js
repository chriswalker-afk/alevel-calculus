import { defineTopicMetadata } from '../topic-metadata.js';

const topicId = 'topic:y12:foundations:pre-calculus';
const skill = (slug) => `skill:y12:foundations:pre-calculus:${slug}`;
const activity = (slug) => `activity:y12:foundations:pre-calculus:understand:${slug}`;

export const preCalculusVocabularyTags = Object.freeze([
  'vocab:gradient'
]);

export const preCalculusTopic = defineTopicMetadata({
  topicId,
  scopeId: 'y12',
  strand: 'foundations',
  slug: 'pre-calculus',
  title: 'Pre-calculus',
  sequence: 10,
  modes: ['understand'],
  prerequisiteTopicIds: [],
  prerequisiteTags: ['coordinates', 'straight-lines'],
  vocabularyTags: preCalculusVocabularyTags,
  journey: [
    {
      id: 'hill-gradient',
      title: 'Gradient means change',
      summary: 'Use a car moving left-to-right along a hill to interpret gradient as how vertical position changes as horizontal position changes.',
      microSkillIds: [skill('gradient-as-change')],
      vocabularyTags: ['vocab:gradient']
    },
    {
      id: 'gradient-sign',
      title: 'Read the sign left-to-right',
      summary: 'Connect rising, falling and horizontal lines with positive, negative and zero gradient.',
      microSkillIds: [skill('gradient-sign')],
      vocabularyTags: ['vocab:gradient']
    },
    {
      id: 'steepness',
      title: 'Steepness changes magnitude',
      summary: 'Compare straight lines so steeper upward lines have larger positive gradient and steeper downward lines have more negative gradient.',
      microSkillIds: [skill('gradient-steepness')],
      vocabularyTags: ['vocab:gradient']
    },
    {
      id: 'gradient-vs-height',
      title: 'Gradient is not height',
      summary: 'Translate a line vertically and observe that its gradient is unchanged.',
      microSkillIds: [skill('gradient-not-height')],
      vocabularyTags: ['vocab:gradient']
    },
    {
      id: 'vertical-limit',
      title: 'What happens near vertical?',
      summary: 'Approach vertical from positive- and negative-gradient sides: m tends to +∞ or −∞ while an exactly vertical line still has undefined gradient.',
      microSkillIds: [skill('vertical-line-gradient')],
      vocabularyTags: ['vocab:gradient']
    },
    {
      id: 'delta-change',
      title: 'Measure change with Δy/Δx',
      summary: 'Build straight-line gradient from vertical change divided by horizontal change.',
      microSkillIds: [skill('delta-y-over-delta-x')],
      vocabularyTags: ['vocab:gradient']
    },
    {
      id: 'curve-question',
      title: 'From straight lines to curves',
      summary: 'Finish by asking what gradient should mean when the graph is curved and no single straight-line gradient works everywhere.',
      microSkillIds: [skill('curve-transition')],
      vocabularyTags: ['vocab:gradient']
    }
  ],
  microSkills: [
    { microSkillId: skill('gradient-as-change'), slug: 'gradient-as-change', title: 'Interpret gradient as vertical change for each unit of horizontal change', prerequisiteTags: ['coordinates'], vocabularyTags: ['vocab:gradient'], supportTargets: { understand: activity('hill-gradient') } },
    { microSkillId: skill('gradient-sign'), slug: 'gradient-sign', title: 'Classify positive, negative and zero gradient from left-to-right behaviour', prerequisiteTags: ['straight-lines'], vocabularyTags: ['vocab:gradient'], supportTargets: { understand: activity('gradient-sign') } },
    { microSkillId: skill('gradient-steepness'), slug: 'gradient-steepness', title: 'Compare gradient magnitudes using steepness', prerequisiteTags: ['straight-lines'], vocabularyTags: ['vocab:gradient'], supportTargets: { understand: activity('steepness') } },
    { microSkillId: skill('gradient-not-height'), slug: 'gradient-not-height', title: 'Distinguish gradient from absolute vertical position', prerequisiteTags: ['coordinates'], vocabularyTags: ['vocab:gradient'], supportTargets: { understand: activity('gradient-vs-height') } },
    { microSkillId: skill('vertical-line-gradient'), slug: 'vertical-line-gradient', title: 'Explain unbounded gradient near vertical and undefined gradient at vertical', prerequisiteTags: ['straight-lines'], vocabularyTags: ['vocab:gradient'], supportTargets: { understand: activity('vertical-limit') } },
    { microSkillId: skill('delta-y-over-delta-x'), slug: 'delta-y-over-delta-x', title: 'Calculate straight-line gradient using Δy/Δx', prerequisiteTags: ['coordinates', 'straight-lines'], vocabularyTags: ['vocab:gradient'], supportTargets: { understand: activity('delta-change') } },
    { microSkillId: skill('curve-transition'), slug: 'curve-transition', title: 'Recognise why curved graphs need a local idea of gradient', prerequisiteTags: ['straight-lines'], vocabularyTags: ['vocab:gradient'], supportTargets: { understand: activity('curve-question') } }
  ],
  activities: [
    { activityId: activity('hill-gradient'), mode: 'understand', slug: 'hill-gradient', title: 'Gradient means change', activityType: 'interactive', microSkillIds: [skill('gradient-as-change')], vocabularyTags: ['vocab:gradient'], implementationStep: 37 },
    { activityId: activity('gradient-sign'), mode: 'understand', slug: 'gradient-sign', title: 'Signs of gradient', activityType: 'interactive', microSkillIds: [skill('gradient-sign')], vocabularyTags: ['vocab:gradient'], implementationStep: 37 },
    { activityId: activity('steepness'), mode: 'understand', slug: 'steepness', title: 'Steepness and gradient', activityType: 'interactive', microSkillIds: [skill('gradient-steepness')], vocabularyTags: ['vocab:gradient'], implementationStep: 37 },
    { activityId: activity('gradient-vs-height'), mode: 'understand', slug: 'gradient-vs-height', title: 'Gradient is not height', activityType: 'interactive', microSkillIds: [skill('gradient-not-height')], vocabularyTags: ['vocab:gradient'], implementationStep: 37 },
    { activityId: activity('vertical-limit'), mode: 'understand', slug: 'vertical-limit', title: 'Near-vertical gradient and the vertical line', activityType: 'interactive', microSkillIds: [skill('vertical-line-gradient')], vocabularyTags: ['vocab:gradient'], implementationStep: 37 },
    { activityId: activity('delta-change'), mode: 'understand', slug: 'delta-change', title: 'Straight-line gradient as Δy/Δx', activityType: 'interactive', microSkillIds: [skill('delta-y-over-delta-x')], vocabularyTags: ['vocab:gradient'], implementationStep: 37 },
    { activityId: activity('curve-question'), mode: 'understand', slug: 'curve-question', title: 'What about a curve?', activityType: 'interactive', microSkillIds: [skill('curve-transition')], vocabularyTags: ['vocab:gradient'], implementationStep: 37 }
  ]
});
