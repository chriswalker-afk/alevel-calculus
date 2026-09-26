import { createLocalStateStore, createMemoryStorage } from '../src/scripts/local-state-store.js';
import { createProgressStore } from '../src/scripts/progress-store.js';
import {
  getModeProgress,
  getTopicProgress,
  listProgressTopicIds,
  progressStatePresentation
} from '../src/scripts/progress-model.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const local = createLocalStateStore({ storage: createMemoryStorage() });
const store = createProgressStore(local);
const basicsTopic = 'topic:y12:differentiation:basics';

store.setCompleted('activity:y12:differentiation:basics:understand:a', true, { topicId: basicsTopic, mode: 'understand' });
store.recordAttempt('activity:y12:differentiation:basics:ao1:a', { topicId: basicsTopic, mode: 'ao1', success: false });

const ids = listProgressTopicIds();
assert(ids.length === 20, 'Expected twenty sample topic metadata records');
const basics = getTopicProgress(basicsTopic, store);
assert(basics.state === 'partial', 'Basics should derive partial from persisted mode records');
assert(basics.modes.understand.state === 'complete', 'Understand should derive complete from ProgressStore');
assert(basics.modes.ao1.state === 'partial', 'AO1 should derive partial from a meaningful attempt');
assert(basics.modes.ao3.state === 'not-started', 'Untouched modes should remain not started');

const preCalculus = getTopicProgress('topic:y12:foundations:pre-calculus', store);
assert(preCalculus.totalModes === 1, 'Pre-calculus should still only expose Understand');
assert(getModeProgress('topic:y12:foundations:pre-calculus', 'ao1', store).enabled === false, 'Disabled modes must remain disabled');

const unknown = getTopicProgress('topic:unknown', store);
assert(unknown.state === 'not-started', 'Unknown topics should default safely to not-started');
assert(progressStatePresentation.complete.symbol === '✓', 'Complete state must have a non-colour symbol');
assert(progressStatePresentation.partial.symbol === '◐', 'Partial state must have a non-colour symbol');
assert(progressStatePresentation['not-started'].symbol === '○', 'Not-started state must have a non-colour symbol');

console.log('PASS shared topic progress selectors now read persisted ProgressStore completion state');
