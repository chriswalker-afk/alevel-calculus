export const APP_STATE_ID = "calculus-website";
export const APP_STATE_SCHEMA_VERSION = 1;
export const APP_STATE_STORAGE_KEY = "calculus-website:state";

export function createBlankAppState() {
  return {
    progress: { activities: {} },
    vocabulary: { records: {} }
  };
}

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function normalizeState(value) {
  const blank = createBlankAppState();
  const progressActivities = value?.progress?.activities;
  const vocabularyRecords = value?.vocabulary?.records;
  return {
    progress: {
      activities: progressActivities && typeof progressActivities === "object" && !Array.isArray(progressActivities)
        ? clone(progressActivities)
        : blank.progress.activities
    },
    vocabulary: {
      records: vocabularyRecords && typeof vocabularyRecords === "object" && !Array.isArray(vocabularyRecords)
        ? clone(vocabularyRecords)
        : blank.vocabulary.records
    }
  };
}

function validateEnvelope(envelope, { requireCompleteState = false } = {}) {
  if (!envelope || typeof envelope !== "object" || Array.isArray(envelope)) {
    throw new Error("The progress file is not a valid Calculus Website data object.");
  }
  if (envelope.appId !== APP_STATE_ID) {
    throw new Error("This file was not exported by the Calculus Website.");
  }
  if (envelope.schemaVersion !== APP_STATE_SCHEMA_VERSION) {
    throw new Error(`Unsupported data version ${String(envelope.schemaVersion)}. Expected version ${APP_STATE_SCHEMA_VERSION}.`);
  }
  if (!envelope.state || typeof envelope.state !== "object" || Array.isArray(envelope.state)) {
    throw new Error("The progress file does not contain a state payload.");
  }
  if (requireCompleteState) {
    const activities = envelope.state?.progress?.activities;
    const records = envelope.state?.vocabulary?.records;
    if (!activities || typeof activities !== "object" || Array.isArray(activities)) {
      throw new Error("The progress file is missing a valid progress activity collection.");
    }
    if (!records || typeof records !== "object" || Array.isArray(records)) {
      throw new Error("The progress file is missing a valid Word Bank record collection.");
    }
  }
  return normalizeState(envelope.state);
}

function createEnvelope(state, now) {
  return {
    appId: APP_STATE_ID,
    schemaVersion: APP_STATE_SCHEMA_VERSION,
    updatedAt: now(),
    state: normalizeState(state)
  };
}


function getDefaultBrowserStorage() {
  try {
    return typeof globalThis.localStorage === "undefined" ? null : globalThis.localStorage;
  } catch {
    return null;
  }
}

export function createMemoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem(key) { return data.has(key) ? data.get(key) : null; },
    setItem(key, value) { data.set(key, String(value)); },
    removeItem(key) { data.delete(key); },
    clear() { data.clear(); },
    dump() { return Object.fromEntries(data.entries()); }
  };
}

export function createLocalStateStore({
  storage = getDefaultBrowserStorage(),
  storageKey = APP_STATE_STORAGE_KEY,
  now = () => new Date().toISOString(),
  initialState = createBlankAppState(),
  resetState = createBlankAppState()
} = {}) {
  const listeners = new Set();
  let state = normalizeState(initialState);
  let persistent = Boolean(storage);
  let lastError = null;

  function notify(reason) {
    const snapshot = getState();
    for (const listener of listeners) listener(snapshot, reason);
  }

  function persist(reason = "save") {
    if (!storage) return false;
    try {
      storage.setItem(storageKey, JSON.stringify(createEnvelope(state, now)));
      persistent = true;
      lastError = null;
      return true;
    } catch (error) {
      persistent = false;
      lastError = error;
      return false;
    }
  }

  function load() {
    if (!storage) return false;
    try {
      const raw = storage.getItem(storageKey);
      if (!raw) {
        persist("initialise");
        return false;
      }
      state = validateEnvelope(JSON.parse(raw));
      persistent = true;
      lastError = null;
      return true;
    } catch (error) {
      persistent = false;
      lastError = error;
      state = normalizeState(initialState);
      return false;
    }
  }

  function getState() {
    return clone(state);
  }

  function getSlice(name) {
    return clone(state[name]);
  }

  function replaceState(nextState, { reason = "replace" } = {}) {
    state = normalizeState(nextState);
    persist(reason);
    notify(reason);
    return getState();
  }

  function updateSlice(name, updater, { reason = `update:${name}` } = {}) {
    if (!Object.hasOwn(state, name)) throw new Error(`Unknown state slice: ${name}`);
    const current = clone(state[name]);
    const next = typeof updater === "function" ? updater(current) : updater;
    state = normalizeState({ ...state, [name]: next });
    persist(reason);
    notify(reason);
    return getSlice(name);
  }

  function exportData() {
    return JSON.stringify({
      appId: APP_STATE_ID,
      schemaVersion: APP_STATE_SCHEMA_VERSION,
      exportedAt: now(),
      state: getState()
    }, null, 2);
  }

  function inspectImport(text) {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("The selected file is not valid JSON.");
    }
    const importedState = validateEnvelope(parsed, { requireCompleteState: true });
    return {
      appId: parsed.appId,
      schemaVersion: parsed.schemaVersion,
      exportedAt: parsed.exportedAt ?? null,
      state: importedState,
      activityCount: Object.keys(importedState.progress.activities).length,
      vocabularyCount: Object.keys(importedState.vocabulary.records).length
    };
  }

  function importData(text) {
    const inspection = inspectImport(text);
    replaceState(inspection.state, { reason: "import" });
    return inspection;
  }

  function reset() {
    state = normalizeState(resetState);
    persist("reset");
    notify("reset");
    return getState();
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function getStatus() {
    return {
      persistent,
      storageKey,
      schemaVersion: APP_STATE_SCHEMA_VERSION,
      lastError: lastError ? String(lastError.message ?? lastError) : null
    };
  }

  load();

  return Object.freeze({
    getState,
    getSlice,
    replaceState,
    updateSlice,
    exportData,
    inspectImport,
    importData,
    reset,
    subscribe,
    getStatus
  });
}
