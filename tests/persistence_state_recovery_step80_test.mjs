import {
  APP_STATE_SCHEMA_VERSION,
  createBlankAppState,
  createLocalStateStore,
  createMemoryStorage
} from '../src/scripts/local-state-store.js';
import { CURRICULUM_AUDIT_TOPICS } from '../src/scripts/curriculum-coverage-audit.js';
import {
  activityRouteFromId,
  parseActivityRoute,
  resolveActivityRoute,
  createHistoryRouteController
} from '../src/scripts/navigation-route.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const topicRuntime = Object.fromEntries(CURRICULUM_AUDIT_TOPICS.map((topic) => {
  const learningModes = Object.fromEntries(topic.modes.map((mode) => [mode, {
    activities: topic.activities.filter((activity) => activity.mode === mode)
  }]));
  return [topic.topicId, { availableModes: topic.modes, learningModes }];
}));

let routeCount = 0;
for (const topic of CURRICULUM_AUDIT_TOPICS) {
  for (const activity of topic.activities) {
    routeCount += 1;
    assert(activityRouteFromId(activity.activityId) === activity.route, `Activity route must be derivable from stable ID: ${activity.activityId}`);
    const parsed = parseActivityRoute(activity.route);
    assert(parsed?.topicId === topic.topicId, `Route must recover topic ID: ${activity.route}`);
    assert(parsed?.activityId === activity.activityId, `Route must recover activity ID: ${activity.route}`);
    const resolved = resolveActivityRoute(activity.route, topicRuntime);
    assert(resolved?.activityId === activity.activityId, `Route must resolve to an implemented activity: ${activity.route}`);
  }
}
assert(routeCount > 200, 'Step 80 route audit should cover the full implemented curriculum.');
assert(resolveActivityRoute('/y13/integration/not-real/ao1/nope', topicRuntime) === null, 'Unknown routes must not resolve.');

const journeyRuntime = {
  'topic:y12:differentiation:basics': {
    availableModes: ['understand'],
    learningModes: {
      understand: {
        activities: [
          { activityId: 'activity:y12:differentiation:basics:understand:topic-goals' },
          { activityId: 'activity:y12:differentiation:basics:understand:gradient-function' },
          { activityId: 'activity:y12:differentiation:basics:understand:next-steps' }
        ]
      }
    }
  }
};
for (const slug of ['topic-goals', 'next-steps']) {
  const activityId = `activity:y12:differentiation:basics:understand:${slug}`;
  const route = `/y12/differentiation/basics/understand/${slug}`;
  assert(activityRouteFromId(activityId) === route, `Understand bookend route should derive from its stable ID: ${slug}`);
  assert(parseActivityRoute(route)?.activityId === activityId, `Understand bookend route should parse back to its stable ID: ${slug}`);
  assert(resolveActivityRoute(route, journeyRuntime)?.activityId === activityId, `Understand bookend route should resolve in the augmented runtime: ${slug}`);
}

const productionAppStateSource = await import('node:fs').then(({ readFileSync }) => readFileSync(new URL('../src/scripts/app-state.js', import.meta.url), 'utf8'));
assert(!productionAppStateSource.includes('sampleInitialState'), 'A genuinely clean production profile must not be seeded with prototype progress.');
assert(productionAppStateSource.includes('initialState: createBlankAppState()'), 'Production app state must initialise from a blank versioned state.');

const first = CURRICULUM_AUDIT_TOPICS[0].activities[0];
const secondTopic = CURRICULUM_AUDIT_TOPICS.find((topic) => topic.topicId === 'topic:y13:integration:substitution');
const second = secondTopic.activities.find((activity) => activity.mode === 'ao1');
const location = { pathname: first.route, search: '?debugSeed=123', hash: '' };
const historyCalls = [];
const history = {
  pushState(state, _title, url) {
    historyCalls.push({ type: 'push', state, url });
    location.pathname = url.split('?')[0];
  },
  replaceState(state, _title, url) {
    historyCalls.push({ type: 'replace', state, url });
    location.pathname = url.split('?')[0];
  }
};
let applied = null;
const controller = createHistoryRouteController({
  history,
  location,
  topicRuntime,
  applyRoute(route) { applied = route; },
  schedule(callback) { callback(); }
});
controller.scheduleWrite(second.route);
assert(historyCalls.at(-1)?.type === 'push', 'A new activity route should create one browser-history entry.');
assert(historyCalls.at(-1)?.url === `${second.route}?debugSeed=123`, 'Route changes must preserve the existing query string.');
location.pathname = first.route;
const restored = controller.restore();
assert(restored?.activityId === first.activityId && applied?.activityId === first.activityId, 'Browser Back/Forward restoration must recover the exact activity route.');

let tick = 0;
const now = () => `2026-09-26T08:00:${String(tick++).padStart(2, '0')}.000Z`;
const sourceStorage = createMemoryStorage();
const source = createLocalStateStore({ storage: sourceStorage, now, initialState: createBlankAppState() });
source.updateSlice('progress', { activities: {
  [second.activityId]: { activityId: second.activityId, topicId: secondTopic.topicId, mode: second.mode, visited: true, completed: true, attempts: 3 }
}});
source.updateSlice('vocabulary', { records: {
  'vocab:derivative': { termId: 'vocab:derivative', encountered: true, needsReview: true }
}});
const exported = source.exportData();
const cleanProfile = createLocalStateStore({ storage: createMemoryStorage(), now, initialState: createBlankAppState() });
cleanProfile.importData(exported);
assert(cleanProfile.getSlice('progress').activities[second.activityId].attempts === 3, 'Clean-profile import must restore activity progress exactly.');
assert(cleanProfile.getSlice('vocabulary').records['vocab:derivative'].needsReview === true, 'Clean-profile import must restore Word Bank state exactly.');

const malformed = JSON.stringify({ appId: 'calculus-website', schemaVersion: APP_STATE_SCHEMA_VERSION, state: {} });
let malformedRejected = false;
try { cleanProfile.inspectImport(malformed); } catch { malformedRejected = true; }
assert(malformedRejected, 'Structurally incomplete imports must be rejected rather than silently replacing progress with blanks.');

const corruptStorage = createMemoryStorage({ 'calculus-website:state': '{broken json' });
const recovered = createLocalStateStore({ storage: corruptStorage, now, initialState: createBlankAppState() });
assert(recovered.getStatus().persistent === false, 'Corrupt stored state must fail closed to safe in-memory state.');
recovered.updateSlice('vocabulary', { records: { 'vocab:tangent': { termId: 'vocab:tangent', encountered: true } } });
assert(recovered.getStatus().persistent === true, 'A later valid update must recover persistence by replacing corrupt stored data.');
const refreshed = createLocalStateStore({ storage: corruptStorage, now, initialState: createBlankAppState() });
assert(refreshed.getSlice('vocabulary').records['vocab:tangent'].encountered === true, 'Recovered storage must survive a fresh store instance.');

console.log(`PASS Step 80 persistence/state-recovery audit (${routeCount} canonical activity routes)`);
