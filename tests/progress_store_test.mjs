import { createLocalStateStore, createMemoryStorage } from '../src/scripts/local-state-store.js';
import { createProgressStore } from '../src/scripts/progress-store.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

let tick = 0;
const now = () => `2026-09-25T00:01:${String(tick++).padStart(2, '0')}.000Z`;
const local = createLocalStateStore({ storage: createMemoryStorage(), now });
const store = createProgressStore(local, { now });
const id = 'activity:y12:differentiation:basics:ao1:power-rule';
const meta = { topicId: 'topic:y12:differentiation:basics', mode: 'ao1' };

const visited = store.markVisited(id, meta);
assert(visited.visited === true && visited.attempts === 0, 'Visit should persist without pretending an attempt occurred');
assert(store.getModeCompletionState(meta.topicId, meta.mode) === 'partial', 'Visiting a section must show that it has been started');

store.recordAttempt(id, { ...meta, success: false, result: 0.4 });
assert(store.getModeCompletionState(meta.topicId, meta.mode) === 'partial', 'A meaningful attempt should produce partial completion progress');
store.recordAttempt(id, { ...meta, success: true, result: 0.8 });
store.recordAttempt(id, { ...meta, success: true, result: 0.7 });
store.recordAttempt(id, { ...meta, success: false, result: 0.5 });
store.recordAttempt(id, { ...meta, success: true, result: 0.9 });
store.recordAttempt(id, { ...meta, success: true, result: 0.85 });
const attempted = store.getActivity(id);
assert(attempted.attempts === 6, 'Attempts must accumulate independently of visits');
assert(attempted.recentSuccess.length === 5, 'Recent success history should remain bounded');
assert(attempted.bestResult === 0.9, 'Best result should keep the best numeric score');

store.setSecurity(id, 'developing', meta);
assert(store.getActivity(id).security === 'developing', 'Security must be an explicit stored field');
assert(store.getActivity(id).completed === false, 'Security must not imply completion');
store.setCompleted(id, true, meta);
assert(store.getModeCompletionState(meta.topicId, meta.mode) === 'complete', 'Explicit completion should drive completion state');
assert(store.getActivity(id).security === 'developing', 'Completion must not overwrite security');

let invalidSecurityRejected = false;
try { store.setSecurity(id, 'excellent', meta); } catch { invalidSecurityRejected = true; }
assert(invalidSecurityRejected, 'Unknown security labels must be rejected');

console.log('PASS ProgressStore visit/attempt/completion/security separation checks');
