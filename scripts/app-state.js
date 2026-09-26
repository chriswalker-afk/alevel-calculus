import { createBlankAppState, createLocalStateStore } from "./local-state-store.js";
import { createProgressStore } from "./progress-store.js";
import { createVocabularyStore } from "./vocabulary-store.js";

export const localStateStore = createLocalStateStore({
  initialState: createBlankAppState(),
  resetState: createBlankAppState()
});

export const progressStore = createProgressStore(localStateStore);
export const vocabularyStore = createVocabularyStore({ localStateStore });
