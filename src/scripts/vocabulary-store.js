function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function createEmptyState() {
  return { records: {} };
}

export function createVocabularyStore({
  localStateStore = null,
  now = () => new Date().toISOString()
} = {}) {
  let sessionState = createEmptyState();

  function readState() {
    if (localStateStore) {
      const slice = localStateStore.getSlice("vocabulary");
      return slice?.records && typeof slice.records === "object" ? slice : createEmptyState();
    }
    return sessionState;
  }

  function writeState(nextState, reason = "vocabulary:update") {
    const normalized = {
      records: nextState?.records && typeof nextState.records === "object"
        ? clone(nextState.records)
        : {}
    };
    if (localStateStore) {
      localStateStore.updateSlice("vocabulary", normalized, { reason });
    } else {
      sessionState = normalized;
    }
  }

  function getRecord(termId) {
    return clone(readState().records[termId] ?? null);
  }

  function hasEncountered(termId) {
    return Boolean(readState().records[termId]);
  }

  function encounter(termId, context = {}) {
    const state = readState();
    const current = state.records[termId];
    if (current) {
      const updated = {
        ...current,
        lastEncounteredAt: now(),
        encounterCount: (current.encounterCount ?? 0) + 1
      };
      writeState({ records: { ...state.records, [termId]: updated } }, "vocabulary:encounter");
      return { record: clone(updated), isNew: false };
    }

    const timestamp = now();
    const record = {
      termId,
      firstEncounteredAt: timestamp,
      lastEncounteredAt: timestamp,
      encounterCount: 1,
      firstEncounter: {
        scopeId: context.scopeId ?? null,
        topicId: context.topicId ?? null,
        topicLabel: context.topicLabel ?? null,
        microSkillId: context.microSkillId ?? null,
        activityId: context.activityId ?? null,
        activityTitle: context.activityTitle ?? null
      },
      needsReview: false
    };
    writeState({ records: { ...state.records, [termId]: record } }, "vocabulary:encounter");
    return { record: clone(record), isNew: true };
  }

  function setNeedsReview(termId, needsReview) {
    const state = readState();
    const current = state.records[termId];
    if (!current) return null;
    const updated = { ...current, needsReview: Boolean(needsReview) };
    writeState({ records: { ...state.records, [termId]: updated } }, "vocabulary:review");
    return clone(updated);
  }

  function toggleNeedsReview(termId) {
    const current = readState().records[termId];
    if (!current) return null;
    return setNeedsReview(termId, !current.needsReview);
  }

  function listRecords() {
    return Object.values(readState().records)
      .map(clone)
      .sort((a, b) => (a.firstEncounteredAt ?? "").localeCompare(b.firstEncounteredAt ?? ""));
  }

  function getEncounteredCount() {
    return Object.keys(readState().records).length;
  }

  function exportSnapshot() {
    return clone(readState());
  }

  function replaceSnapshot(snapshot) {
    const records = snapshot?.records && typeof snapshot.records === "object" ? snapshot.records : {};
    writeState({ records }, "vocabulary:replace");
  }

  function clearForTests() {
    writeState(createEmptyState(), "vocabulary:clear");
  }

  return Object.freeze({
    getRecord,
    hasEncountered,
    encounter,
    setNeedsReview,
    toggleNeedsReview,
    listRecords,
    getEncounteredCount,
    exportSnapshot,
    replaceSnapshot,
    clearForTests
  });
}
