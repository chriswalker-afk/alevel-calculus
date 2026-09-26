import { defineTopicMetadata } from '../topic-metadata.js';

const topicPrefix = 'y12:differentiation:first-principles';
const skill = (slug) => `skill:${topicPrefix}:${slug}`;
const activity = (slug, mode = 'understand') => `activity:${topicPrefix}:${mode}:${slug}`;

export const firstPrinciplesVocabularyTags = Object.freeze([
  'vocab:gradient',
  'vocab:tangent',
  'vocab:derivative',
  'vocab:limit',
  'vocab:chord',
  'vocab:secant',
  'vocab:first-principles',
  'vocab:approaches',
  'vocab:approximation',
  'vocab:difference-quotient',
  'vocab:f-x-plus-h'
]);

export const firstPrinciplesTopic = defineTopicMetadata({
  topicId: 'topic:y12:differentiation:first-principles',
  scopeId: 'y12',
  strand: 'differentiation',
  slug: 'first-principles',
  title: 'Differentiation from first principles',
  sequence: 30,
  modes: ['understand', 'memorise', 'ao1', 'ao2', 'ao3'],
  prerequisiteTopicIds: ['topic:y12:differentiation:basics'],
  prerequisiteTags: ['straight-line-gradient', 'basic-algebra', 'function-notation'],
  vocabularyTags: firstPrinciplesVocabularyTags,
  journey: [
    { id: 'limit-intuition', title: 'Approaching a value', summary: 'Read h → 0 as h getting closer and closer to zero rather than setting h equal to zero.', microSkillIds: [skill('limit-intuition')], vocabularyTags: ['vocab:limit'] },
    { id: 'simple-limits', title: 'Simple limits', summary: 'Use simple numerical expressions to see outputs approach a value as h approaches zero.', microSkillIds: [skill('simple-limits')], vocabularyTags: ['vocab:limit'] },
    { id: 'two-points', title: 'Why two points?', summary: 'Use P = (x, f(x)) and Q = (x+h, f(x+h)) so a chord gradient can be formed.', microSkillIds: [skill('two-points')], vocabularyTags: ['vocab:chord', 'vocab:secant'] },
    { id: 'chord-approximation', title: 'Chord approximates tangent', summary: 'Move Q towards P and watch the chord rotate towards the tangent.', microSkillIds: [skill('chord-approximation')], vocabularyTags: ['vocab:chord', 'vocab:tangent'] },
    { id: 'h-to-zero', title: 'What happens as h → 0?', summary: 'Connect decreasing h values with chord gradients approaching the tangent gradient.', microSkillIds: [skill('h-to-zero')], vocabularyTags: ['vocab:limit', 'vocab:chord', 'vocab:tangent'] },
    { id: 'formal-definition', title: 'First-principles formula', summary: 'Connect every symbol in the first-principles definition back to the chord-and-tangent diagram.', microSkillIds: [skill('formal-definition')], vocabularyTags: ['vocab:first-principles', 'vocab:derivative'] },
    { id: 'derive-x2', title: 'Prove the x² rule', summary: 'Differentiate x² from first principles with slow, sequential algebra.', microSkillIds: [skill('derive-x2')], vocabularyTags: ['vocab:first-principles', 'vocab:differentiate'] },
    { id: 'derive-x3', title: 'Prove the x³ rule', summary: 'Differentiate x³ from first principles and reconnect the result to the familiar power rule.', microSkillIds: [skill('derive-x3')], vocabularyTags: ['vocab:first-principles', 'vocab:differentiate'] },
    { id: 'proof-vs-use', title: 'Using versus proving a rule', summary: 'Distinguish applying a known differentiation rule from proving why it works.', microSkillIds: [skill('proof-vs-use')], vocabularyTags: ['vocab:first-principles', 'vocab:derivative'] }
  ],
  microSkills: [
    { microSkillId: skill('limit-intuition'), slug: 'limit-intuition', title: 'Interpret h → 0 as approaching zero', prerequisiteTags: ['number-sense'], vocabularyTags: ['vocab:limit'], supportTargets: { understand: activity('limit-intuition'), memorise: activity('key-facts','memorise'), ao1: activity('building-blocks','ao1') } },
    { microSkillId: skill('simple-limits'), slug: 'simple-limits', title: 'Interpret simple limits numerically', prerequisiteTags: ['substitution'], vocabularyTags: ['vocab:limit'], supportTargets: { understand: activity('simple-limits'), ao1: activity('building-blocks','ao1') } },
    { microSkillId: skill('two-points'), slug: 'two-points', title: 'Explain why two nearby points define a chord gradient', prerequisiteTags: ['function-notation', 'straight-line-gradient'], vocabularyTags: ['vocab:chord', 'vocab:secant'], supportTargets: { understand: activity('two-points'), memorise: activity('vocabulary-recall','memorise') } },
    { microSkillId: skill('chord-approximation'), slug: 'chord-approximation', title: 'Explain how a chord approximates a tangent', prerequisiteTags: ['straight-line-gradient'], vocabularyTags: ['vocab:chord', 'vocab:tangent'], supportTargets: { understand: activity('chord-approximation'), memorise: activity('vocabulary-recall','memorise'), ao2: activity('explain-chord-limit','ao2') } },
    { microSkillId: skill('h-to-zero'), slug: 'h-to-zero', title: 'Connect h → 0 with chord gradient approaching tangent gradient', prerequisiteTags: ['limit-intuition'], vocabularyTags: ['vocab:limit', 'vocab:chord', 'vocab:tangent'], supportTargets: { understand: activity('h-to-zero'), memorise: activity('key-facts','memorise'), ao2: activity('explain-chord-limit','ao2') } },
    { microSkillId: skill('formal-definition'), slug: 'formal-definition', title: 'Connect the first-principles definition to the diagram', prerequisiteTags: ['function-notation', 'straight-line-gradient'], vocabularyTags: ['vocab:first-principles', 'vocab:derivative'], supportTargets: { understand: activity('formal-definition'), memorise: activity('formula-recall','memorise'), ao1: activity('building-blocks','ao1') } },
    { microSkillId: skill('derive-x2'), slug: 'derive-x2', title: 'Derive the derivative of x² from first principles', prerequisiteTags: ['expanding-brackets', 'simplifying-algebra'], vocabularyTags: ['vocab:first-principles', 'vocab:differentiate'], supportTargets: { understand: activity('derive-x2'), ao1: activity('fading-practice','ao1'), ao2: activity('diagnose-derivation','ao2') } },
    { microSkillId: skill('derive-x3'), slug: 'derive-x3', title: 'Derive the derivative of x³ from first principles', prerequisiteTags: ['expanding-brackets', 'simplifying-algebra'], vocabularyTags: ['vocab:first-principles', 'vocab:differentiate'], supportTargets: { understand: activity('derive-x3'), ao1: activity('independent-proof','ao1') } },
    { microSkillId: skill('proof-vs-use'), slug: 'proof-vs-use', title: 'Distinguish proving a differentiation rule from applying it', prerequisiteTags: ['power-rule'], vocabularyTags: ['vocab:first-principles', 'vocab:derivative'], supportTargets: { understand: activity('proof-vs-use'), ao3: activity('select-and-apply','ao3') } }
  ],
  activities: [
    { activityId: activity('limit-intuition'), mode: 'understand', slug: 'limit-intuition', title: 'What does h → 0 mean?', activityType: 'interactive', microSkillIds: [skill('limit-intuition')], vocabularyTags: ['vocab:limit'], implementationStep: 38 },
    { activityId: activity('simple-limits'), mode: 'understand', slug: 'simple-limits', title: 'Watch simple limits settle', activityType: 'interactive', microSkillIds: [skill('simple-limits')], vocabularyTags: ['vocab:limit'], implementationStep: 38 },
    { activityId: activity('two-points'), mode: 'understand', slug: 'two-points', title: 'Why do we need a second point?', activityType: 'lesson', microSkillIds: [skill('two-points')], vocabularyTags: ['vocab:chord', 'vocab:secant'], implementationStep: 38 },
    { activityId: activity('chord-approximation'), mode: 'understand', slug: 'chord-approximation', title: 'Move Q towards P', activityType: 'interactive', microSkillIds: [skill('chord-approximation')], vocabularyTags: ['vocab:chord', 'vocab:tangent'], implementationStep: 38 },
    { activityId: activity('h-to-zero'), mode: 'understand', slug: 'h-to-zero', title: 'Shrink h and compare the gradients', activityType: 'interactive', microSkillIds: [skill('h-to-zero')], vocabularyTags: ['vocab:limit', 'vocab:chord', 'vocab:tangent'], implementationStep: 38 },
    { activityId: activity('formal-definition'), mode: 'understand', slug: 'formal-definition', title: 'The formula now has a picture', activityType: 'interactive', microSkillIds: [skill('formal-definition')], vocabularyTags: ['vocab:first-principles', 'vocab:derivative'], implementationStep: 38 },
    { activityId: activity('derive-x2'), mode: 'understand', slug: 'derive-x2', title: 'Prove the derivative of x²', activityType: 'lesson', microSkillIds: [skill('derive-x2')], vocabularyTags: ['vocab:first-principles', 'vocab:differentiate'], implementationStep: 38 },
    { activityId: activity('derive-x3'), mode: 'understand', slug: 'derive-x3', title: 'Prove the derivative of x³', activityType: 'lesson', microSkillIds: [skill('derive-x3')], vocabularyTags: ['vocab:first-principles', 'vocab:differentiate'], implementationStep: 38 },
    { activityId: activity('proof-vs-use'), mode: 'understand', slug: 'proof-vs-use', title: 'Using a rule is not the same as proving it', activityType: 'lesson', microSkillIds: [skill('proof-vs-use')], vocabularyTags: ['vocab:first-principles', 'vocab:derivative'], implementationStep: 38 },

    { activityId: activity('key-facts','memorise'), mode: 'memorise', slug: 'key-facts', title: 'First-principles key facts', activityType: 'memory', microSkillIds: [skill('limit-intuition'), skill('h-to-zero'), skill('formal-definition')], vocabularyTags: firstPrinciplesVocabularyTags, implementationStep: 39 },
    { activityId: activity('formula-recall','memorise'), mode: 'memorise', slug: 'formula-recall', title: 'First-principles formula recall', activityType: 'memory', microSkillIds: [skill('formal-definition')], vocabularyTags: ['vocab:first-principles','vocab:difference-quotient','vocab:f-x-plus-h'], implementationStep: 39 },
    { activityId: activity('vocabulary-recall','memorise'), mode: 'memorise', slug: 'vocabulary-recall', title: 'First-principles vocabulary recall', activityType: 'memory', microSkillIds: [skill('two-points'), skill('chord-approximation')], vocabularyTags: firstPrinciplesVocabularyTags, implementationStep: 39 },
    { activityId: activity('memory-games','memorise'), mode: 'memorise', slug: 'memory-games', title: 'First-principles memory games', activityType: 'memory', microSkillIds: [skill('formal-definition')], vocabularyTags: firstPrinciplesVocabularyTags, implementationStep: 39 },
    { activityId: activity('mixed-review','memorise'), mode: 'memorise', slug: 'mixed-review', title: 'First-principles mixed review', activityType: 'memory', microSkillIds: [skill('formal-definition')], vocabularyTags: firstPrinciplesVocabularyTags, implementationStep: 39 },

    { activityId: activity('building-blocks','ao1'), mode: 'ao1', slug: 'building-blocks', title: 'First-principles building blocks', activityType: 'question-set', microSkillIds: [skill('limit-intuition'), skill('simple-limits'), skill('formal-definition')], vocabularyTags: ['vocab:limit','vocab:difference-quotient','vocab:f-x-plus-h'], implementationStep: 39 },
    { activityId: activity('fading-practice','ao1'), mode: 'ao1', slug: 'fading-practice', title: 'Fading first-principles practice', activityType: 'question-set', microSkillIds: [skill('derive-x2')], vocabularyTags: ['vocab:first-principles','vocab:limit'], implementationStep: 39 },
    { activityId: activity('independent-proof','ao1'), mode: 'ao1', slug: 'independent-proof', title: 'Independent first-principles proof', activityType: 'question-set', microSkillIds: [skill('derive-x3')], vocabularyTags: ['vocab:first-principles','vocab:limit'], implementationStep: 39 },

    { activityId: activity('explain-chord-limit','ao2'), mode: 'ao2', slug: 'explain-chord-limit', title: 'Explain chord and limit', activityType: 'question-set', microSkillIds: [skill('chord-approximation'), skill('h-to-zero')], vocabularyTags: ['vocab:chord','vocab:tangent','vocab:limit','vocab:approximation'], implementationStep: 39 },
    { activityId: activity('diagnose-derivation','ao2'), mode: 'ao2', slug: 'diagnose-derivation', title: 'Diagnose a first-principles derivation', activityType: 'question-set', microSkillIds: [skill('derive-x2')], vocabularyTags: ['vocab:first-principles','vocab:limit'], implementationStep: 39 },

    { activityId: activity('select-and-apply','ao3'), mode: 'ao3', slug: 'select-and-apply', title: 'Select and apply first principles', activityType: 'question-set', microSkillIds: [skill('formal-definition'), skill('proof-vs-use')], vocabularyTags: ['vocab:difference-quotient','vocab:first-principles','vocab:gradient','vocab:tangent'], implementationStep: 39 }
  ]
});
