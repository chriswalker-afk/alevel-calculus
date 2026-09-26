export const SECURITY_STATES = Object.freeze(["needs-review", "developing", "secure"]);
const RECENT_SUCCESS_LIMIT = 5;

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function emptyProgressSlice() {
  return { activities: {} };
}

function normalizeRecord(activityId, value = {}) {
  const security = SECURITY_STATES.includes(value.security) ? value.security : null;
  const recentSuccess = Array.isArray(value.recentSuccess)
    ? value.recentSuccess.slice(-RECENT_SUCCESS_LIMIT).map((entry) => ({
        success: Boolean(entry?.success),
        at: entry?.at ?? null
      }))
    : [];
  return {
    activityId,
    topicId: value.topicId ?? null,
    mode: value.mode ?? null,
    visited: Boolean(value.visited),
    completed: Boolean(value.completed),
    attempts: Number.isFinite(value.attempts) && value.attempts >= 0 ? Math.floor(value.attempts) : 0,
    recentSuccess,
    bestResult: Number.isFinite(value.bestResult) ? value.bestResult : null,
    lastSeen: value.lastSeen ?? null,
    security
  };
}

export function createProgressStore(localStateStore, { now = () => new Date().toISOString() } = {}) {
  if (!localStateStore) throw new Error("ProgressStore requires LocalStateStore.");

  function readSlice() {
    const slice = localStateStore.getSlice("progress");
    return slice?.activities && typeof slice.activities === "object" ? slice : emptyProgressSlice();
  }

  function writeActivities(activities, reason) {
    localStateStore.updateSlice("progress", { activities }, { reason });
  }

  function getActivity(activityId) {
    const record = readSlice().activities[activityId];
    return record ? clone(normalizeRecord(activityId, record)) : null;
  }

  function listActivities() {
    const activities = readSlice().activities;
    return Object.entries(activities)
      .map(([activityId, record]) => normalizeRecord(activityId, record))
      .sort((a, b) => a.activityId.localeCompare(b.activityId));
  }

  function upsert(activityId, patch, meta = {}, reason = "progress:update") {
    const slice = readSlice();
    const current = normalizeRecord(activityId, slice.activities[activityId]);
    const next = normalizeRecord(activityId, {
      ...current,
      ...meta,
      ...patch
    });
    writeActivities({ ...slice.activities, [activityId]: next }, reason);
    return clone(next);
  }

  function markVisited(activityId, meta = {}) {
    return upsert(activityId, { visited: true, lastSeen: now() }, meta, "progress:visited");
  }

  function setCompleted(activityId, completed = true, meta = {}) {
    return upsert(activityId, { completed: Boolean(completed), visited: true, lastSeen: now() }, meta, "progress:completed");
  }

  function recordAttempt(activityId, { success = false, result = null, completed = false, ...meta } = {}) {
    const slice = readSlice();
    const current = normalizeRecord(activityId, slice.activities[activityId]);
    const timestamp = now();
    const recentSuccess = [...current.recentSuccess, { success: Boolean(success), at: timestamp }].slice(-RECENT_SUCCESS_LIMIT);
    const numericResult = Number.isFinite(result) ? result : null;
    const bestResult = numericResult == null
      ? current.bestResult
      : current.bestResult == null
        ? numericResult
        : Math.max(current.bestResult, numericResult);
    return upsert(activityId, {
      visited: true,
      completed: current.completed || Boolean(completed),
      attempts: current.attempts + 1,
      recentSuccess,
      bestResult,
      lastSeen: timestamp
    }, meta, "progress:attempt");
  }

  function setSecurity(activityId, security, meta = {}) {
    if (security !== null && !SECURITY_STATES.includes(security)) {
      throw new Error(`Unknown security state: ${String(security)}`);
    }
    return upsert(activityId, { security }, meta, "progress:security");
  }

  function getModeCompletionState(topicId, mode) {
    const records = listActivities().filter((record) => record.topicId === topicId && record.mode === mode);
    if (records.length === 0) return "not-started";
    if (records.every((record) => record.completed)) return "complete";
    if (records.some((record) => record.completed || record.attempts > 0)) return "partial";
    return "not-started";
  }

  function exportSnapshot() {
    return clone(readSlice());
  }

  function replaceSnapshot(snapshot) {
    const activities = snapshot?.activities && typeof snapshot.activities === "object" ? snapshot.activities : {};
    const normalized = Object.fromEntries(
      Object.entries(activities).map(([activityId, record]) => [activityId, normalizeRecord(activityId, record)])
    );
    localStateStore.updateSlice("progress", { activities: normalized }, { reason: "progress:replace" });
  }

  function clear() {
    localStateStore.updateSlice("progress", emptyProgressSlice(), { reason: "progress:clear" });
  }

  return Object.freeze({
    getActivity,
    listActivities,
    markVisited,
    setCompleted,
    recordAttempt,
    setSecurity,
    getModeCompletionState,
    exportSnapshot,
    replaceSnapshot,
    clear
  });
}
