import {
  APP_STATE_SCHEMA_VERSION,
  APP_STATE_STORAGE_KEY,
  createBlankAppState,
  createLocalStateStore,
  createMemoryStorage
} from '../src/scripts/local-state-store.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

let tick = 0;
const now = () => `2026-09-25T00:00:0${tick++}.000Z`;
const storage = createMemoryStorage();
const initial = createBlankAppState();
initial.progress.activities['activity:y12:test:topic:ao1:q1'] = {
  activityId: 'activity:y12:test:topic:ao1:q1',
  topicId: 'topic:y12:test:topic',
  mode: 'ao1',
  visited: true,
  completed: false,
  attempts: 1,
  recentSuccess: [],
  bestResult: null,
  lastSeen: now(),
  security: null
};

const store = createLocalStateStore({ storage, now, initialState: initial, resetState: createBlankAppState() });
assert(store.getStatus().persistent === true, 'Memory adapter should behave as persistent storage');
assert(JSON.parse(storage.getItem(APP_STATE_STORAGE_KEY)).schemaVersion === APP_STATE_SCHEMA_VERSION, 'Stored envelope must include schema version');

store.updateSlice('vocabulary', { records: { 'vocab:derivative': { termId: 'vocab:derivative', needsReview: true } } });
const reloaded = createLocalStateStore({ storage, now, initialState: createBlankAppState() });
assert(reloaded.getSlice('vocabulary').records['vocab:derivative'].needsReview === true, 'State must survive a fresh store instance');

const exported = reloaded.exportData();
const inspection = reloaded.inspectImport(exported);
assert(inspection.schemaVersion === APP_STATE_SCHEMA_VERSION, 'Export/import schema versions must match');
assert(inspection.activityCount === 1 && inspection.vocabularyCount === 1, 'Export inspection must count both domain slices');

const destinationStorage = createMemoryStorage();
const destination = createLocalStateStore({ storage: destinationStorage, now });
destination.importData(exported);
assert(destination.getSlice('progress').activities['activity:y12:test:topic:ao1:q1'].attempts === 1, 'Import must restore progress records');
assert(destination.getSlice('vocabulary').records['vocab:derivative'].needsReview === true, 'Import must restore vocabulary records');

destination.reset();
assert(Object.keys(destination.getSlice('progress').activities).length === 0, 'Reset must clear progress records');
assert(Object.keys(destination.getSlice('vocabulary').records).length === 0, 'Reset must clear vocabulary records');
assert(destination.getStatus().persistent === true, 'Reset state itself must remain persisted so refresh does not restore defaults');

let rejected = false;
try {
  destination.inspectImport(JSON.stringify({ appId: 'calculus-website', schemaVersion: 999, state: createBlankAppState() }));
} catch {
  rejected = true;
}
assert(rejected, 'Future/unknown schema versions must be rejected instead of guessed');


const originalLocalStorageDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  get() { throw new Error('storage denied'); }
});
const deniedStorageStore = createLocalStateStore({ initialState: createBlankAppState() });
assert(deniedStorageStore.getStatus().persistent === false, 'Denied localStorage getter should fall back to in-memory state instead of crashing');
if (originalLocalStorageDescriptor) Object.defineProperty(globalThis, 'localStorage', originalLocalStorageDescriptor);
else delete globalThis.localStorage;

console.log('PASS LocalStateStore versioned persistence, refresh, export/import and reset checks');
