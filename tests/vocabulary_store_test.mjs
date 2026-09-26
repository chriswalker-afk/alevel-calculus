import { createLocalStateStore, createMemoryStorage } from '../src/scripts/local-state-store.js';
import { createVocabularyStore } from '../src/scripts/vocabulary-store.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

let tick = 0;
const now = () => `2026-09-24T12:00:0${tick++}.000Z`;
const storage = createMemoryStorage();
const local = createLocalStateStore({ storage, now });
const store = createVocabularyStore({ localStateStore: local, now });
const context = {
  scopeId: 'y12',
  topicId: 'topic:y12:differentiation:basics',
  topicLabel: 'Basics of differentiation',
  microSkillId: 'skill:y12:differentiation:basics:gradient-function',
  activityId: 'activity:y12:differentiation:basics:understand:gradient-function',
  activityTitle: 'See the derivative as a gradient function'
};

const first = store.encounter('vocab:derivative', context);
assert(first.isNew === true, 'First encounter should be marked new');
assert(store.getEncounteredCount() === 1, 'Encounter should enter the Word Bank store');
assert(first.record.firstEncounter.activityTitle === context.activityTitle, 'First encounter should record the exact activity context');
assert(first.record.needsReview === false, 'New vocabulary should not be marked for review by default');

const repeat = store.encounter('vocab:derivative', { ...context, activityTitle: 'Later activity' });
assert(repeat.isNew === false, 'Later encounter should not be marked new');
assert(repeat.record.firstEncounter.activityTitle === context.activityTitle, 'Later encounter must preserve first-encounter metadata');
assert(repeat.record.encounterCount === 2, 'Later encounter should increment encounter count');

store.toggleNeedsReview('vocab:derivative');
assert(store.getRecord('vocab:derivative').needsReview === true, 'Review toggle should update the domain record');

const reloadedLocal = createLocalStateStore({ storage, now });
const reloaded = createVocabularyStore({ localStateStore: reloadedLocal, now });
assert(reloaded.hasEncountered('vocab:derivative'), 'Vocabulary should survive a fresh store instance through LocalStateStore');
assert(reloaded.getRecord('vocab:derivative').needsReview === true, 'Persistent vocabulary should retain review state');

store.clearForTests();
assert(store.getEncounteredCount() === 0, 'Clear should remove vocabulary records through the shared state layer');

console.log('PASS VocabularyStore persistent encounter, first-context and review checks');
