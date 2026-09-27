import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { getCourseScope } from '../src/scripts/scope-metadata.js';
import { getVocabularyTerm } from '../src/scripts/vocabulary-data.js';
import { getMemoryItemsForTopic } from '../src/scripts/memory-content.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';
import { getTopicProgress, listProgressTopicIds } from '../src/scripts/progress-model.js';

import { preCalculusTopic } from '../src/scripts/topic-content/pre-calculus.js';
import { basicsDifferentiationTopic } from '../src/scripts/topic-content/basics-differentiation.js';
import { firstPrinciplesTopic } from '../src/scripts/topic-content/first-principles.js';
import { tangentsNormalsTopic } from '../src/scripts/topic-content/tangents-normals.js';
import { stationaryPointsTopic } from '../src/scripts/topic-content/stationary-points.js';
import { increasingDecreasingTopic } from '../src/scripts/topic-content/increasing-decreasing.js';
import { integrationIntroTopic } from '../src/scripts/topic-content/integration-intro.js';
import { definiteIndefiniteTopic } from '../src/scripts/topic-content/definite-indefinite-integration.js';
import { integrationAreaTopic } from '../src/scripts/topic-content/integration-area.js';
import { signedAreaTopic } from '../src/scripts/topic-content/signed-area.js';
import { year12ReviewTopic } from '../src/scripts/topic-content/year12-review.js';

import { preCalculusLearningModes } from '../src/scripts/pre-calculus-activities.js';
import { learningModes as basicsLearningModes } from '../src/scripts/sample-activities.js';
import { firstPrinciplesLearningModes } from '../src/scripts/first-principles-activities.js';
import { tangentsNormalsLearningModes } from '../src/scripts/tangents-normals-activities.js';
import { stationaryPointsLearningModes } from '../src/scripts/stationary-points-activities.js';
import { increasingDecreasingLearningModes } from '../src/scripts/increasing-decreasing-activities.js';
import { integrationIntroLearningModes } from '../src/scripts/integration-intro-activities.js';
import { definiteIndefiniteLearningModes } from '../src/scripts/definite-indefinite-activities.js';
import { integrationAreaLearningModes } from '../src/scripts/integration-area-activities.js';
import { signedAreaLearningModes } from '../src/scripts/signed-area-activities.js';
import { year12ReviewLearningModes } from '../src/scripts/year12-review-activities.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const canonicalModes = ['understand', 'memorise', 'ao1', 'ao2', 'ao3'];

const entries = [
  { section: 5, topic: preCalculusTopic, runtime: preCalculusLearningModes, sequence: 10 },
  { section: 6, topic: basicsDifferentiationTopic, runtime: basicsLearningModes, sequence: 20 },
  { section: 7, topic: firstPrinciplesTopic, runtime: firstPrinciplesLearningModes, sequence: 30 },
  { section: 8, topic: tangentsNormalsTopic, runtime: tangentsNormalsLearningModes, sequence: 40 },
  { section: 9, topic: stationaryPointsTopic, runtime: stationaryPointsLearningModes, sequence: 50 },
  { section: 10, topic: increasingDecreasingTopic, runtime: increasingDecreasingLearningModes, sequence: 60 },
  { section: 11, topic: integrationIntroTopic, runtime: integrationIntroLearningModes, sequence: 70 },
  { section: 12, topic: definiteIndefiniteTopic, runtime: definiteIndefiniteLearningModes, sequence: 80 },
  { section: 13, topic: integrationAreaTopic, runtime: integrationAreaLearningModes, sequence: 90 },
  { section: 14, topic: signedAreaTopic, runtime: signedAreaLearningModes, sequence: 100 },
  // Plan section 15 remains a Year 13 advanced treatment; Year 12 now contains only a simple top-minus-bottom introduction inside the existing Integration as Area topic.
  { section: 16, topic: year12ReviewTopic, runtime: year12ReviewLearningModes, sequence: 110 }
];

// 1. Sections 5-14 and 16 are represented exactly once and remain in the intended order.
assert.deepEqual(entries.map(({ section }) => section), [5,6,7,8,9,10,11,12,13,14,16]);
assert.deepEqual(entries.map(({ topic }) => topic.sequence), entries.map(({ sequence }) => sequence), 'Year 12 TopicMetadata sequence must preserve curriculum/navigation order.');
assert.equal(new Set(entries.map(({ topic }) => topic.topicId)).size, entries.length, 'Year 12 topic IDs must be unique.');
assert(entries.every(({ topic }) => topic.scopeId === 'y12' && topic.routeScope === 'y12'), 'Every Year 12 topic must stay inside the 8MA0 scope.');
assert(!entries.some(({ topic }) => /between-curves/.test(topic.topicId)), 'Do not create a duplicate standalone Year 12 between-curves topic.');
assert(integrationAreaTopic.activities.some((activity)=>activity.activityId==='activity:y12:integration:area:understand:between-positive-curves'),'The existing Year 12 Integration as Area topic must include the scoped top-minus-bottom introduction.');

// 2. TopicMetadata and the live activity surfaces must agree mode-by-mode.
for (const { topic, runtime } of entries) {
  const runtimeModes = Object.keys(runtime).filter((mode) => canonicalModes.includes(mode));
  for (const mode of topic.modes) assert(runtimeModes.includes(mode), `${topic.topicId} is missing enabled runtime mode ${mode}.`);
  for (const mode of runtimeModes.filter((candidate) => !topic.modes.includes(candidate))) {
    assert.equal(runtime[mode].activities.length, 0, `${topic.topicId} must not expose live activities in disabled mode ${mode}.`);
  }
  for (const mode of topic.modes) {
    const modelIds = topic.activities.filter((activity) => activity.mode === mode).map((activity) => activity.activityId);
    const runtimeIds = runtime[mode].activities.map((activity) => activity.activityId);
    // Stable shared MemoryLab extension IDs may exist in the runtime but every modelled activity must be live.
    for (const activityId of modelIds) assert(runtimeIds.includes(activityId), `${topic.topicId} is missing live activity ${activityId}.`);
  }
  for (const activity of topic.activities) {
    assert.match(activity.route, /^\/y12\/[a-z0-9-]+\/[a-z0-9-]+\/(understand|memorise|ao1|ao2|ao3)\/[a-z0-9-]+$/, `${activity.activityId} must retain a canonical five-segment Year 12 route.`);
  }
}

// 3. The Year 12 scope badge contract is still the 8MA0 identity.
const y12Scope = getCourseScope('y12');
assert.equal(y12Scope.label, 'Year 12 · 8MA0');
assert.equal(y12Scope.routeScope, 'y12');
const html = read('src/index.html');
assert(html.includes('data-scope-badge data-course-scope="y12"'), 'AppShell must expose the Year 12 8MA0 scope badge.');

// 4. Vocabulary remains canonical and every assessed/memorise topic resolves its planned tags.
for (const { topic } of entries) {
  for (const tag of topic.vocabularyTags) assert(getVocabularyTerm(tag), `${topic.topicId} references unresolved vocabulary ${tag}.`);
  if (topic.modes.includes('memorise')) {
    assert(getMemoryItemsForTopic(topic.topicId).length > 0, `${topic.topicId} has Memorise enabled but no shared MemoryLab content.`);
  }
}

// 5. Progress applicability exactly follows the implemented topic modes, including the two intentional exceptions.
const progressIds = new Set(listProgressTopicIds());
const emptyProgressStore = { getModeCompletionState: () => 'not-started' };
for (const { topic } of entries) {
  assert(progressIds.has(topic.topicId), `${topic.topicId} is missing from the progress catalogue.`);
  const progress = getTopicProgress(topic.topicId, emptyProgressStore);
  assert.deepEqual(progress.enabledModes, topic.modes, `${topic.topicId} progress modes must match its implemented modes.`);
}
assert.deepEqual(preCalculusTopic.modes, ['understand'], 'Pre-calculus remains intentionally Understand-only.');
assert.deepEqual(year12ReviewTopic.modes, ['memorise','ao1','ao2','ao3'], 'Year 12 Review must not invent an Understand mode.');

// 6. Every Year 12 AO activity is on the shared generator path and generates valid metadata/solution structure.
const runner = createGeneratorRunner({ debugSeed: 'step49-year12-gate' });
for (const { topic } of entries) {
  for (const activity of topic.activities.filter((candidate) => ['ao1','ao2','ao3'].includes(candidate.mode))) {
    const setDefinition = getQuestionSetDefinitionForActivity(activity.activityId);
    assert(setDefinition, `${activity.activityId} must resolve through the shared QuestionDefinition catalogue.`);
    const generated = runner.generateSet(setDefinition);
    assert(generated.questions.length > 0, `${activity.activityId} generated an empty question set.`);
    for (const question of generated.questions) {
      assert.equal(question.metadata.courseScope, 'y12', `${activity.activityId} leaked out of the Year 12 course scope.`);
      assert(['ao1','ao2','ao3'].includes(question.metadata.assessmentObjective), `${activity.activityId} generated invalid AO metadata.`);
      assert(question.metadata.microSkillId, `${activity.activityId} generated a question without a micro-skill ID.`);
      assert(Array.isArray(question.solutionSteps) && question.solutionSteps.length > 0, `${activity.activityId} generated a question without a worked solution.`);
    }
  }
}

// 7. The review checkpoint is the explicit boundary into additional 9MA0 content.
const reviewIndex = html.indexOf('topic:y12:review:calculus-mastery');
const boundaryIndex = html.indexOf('8MA0 boundary before additional Year 13 calculus');
const year13Index = html.indexOf('Additional Year 13');
assert(reviewIndex >= 0 && boundaryIndex > reviewIndex && year13Index > boundaryIndex, 'Year 12 Review must remain before the explicit 8MA0 -> additional 9MA0 boundary.');

// 8. Responsive gate: one fixed AppShell, internal scrolling and a phone/tablet collapse for every topic-specific Year 12 visual layer.
const appCss = read('src/styles/app-shell.css');
assert(appCss.includes('overflow: hidden;') && /overflow:\s*auto;/.test(appCss), 'AppShell must preserve fixed-shell/internal-scroll behaviour.');
const responsiveStyles = [
  'pre-calculus-understand.css', 'basics-understand.css', 'first-principles-understand.css',
  'tangents-normals-understand.css', 'stationary-points-understand.css', 'increasing-decreasing-understand.css',
  'integration-intro-understand.css', 'definite-indefinite-understand.css', 'integration-area-understand.css',
  'signed-area-understand.css', 'year12-review.css'
];
for (const file of responsiveStyles) {
  const css = read(`src/styles/${file}`);
  assert(/@media\s*\(max-width:\s*(?:6[0-9]{2}|7[0-2][0-9])px\)/.test(css), `${file} needs a <=720px responsive rule.`);
  for (const match of css.matchAll(/min-height:\s*(44px|var\(--touch-target-min\))/g)) {
    assert(match[1] === '44px' || match[1] === 'var(--touch-target-min)', `${file} must not shrink interactive targets below 44px.`);
  }
}

console.log('PASS Step 49 Year 12 plan traceability, scope, vocabulary, progress, route, generator, boundary and responsive regression gate');
