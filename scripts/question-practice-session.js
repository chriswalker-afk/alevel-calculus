import { createSeededRandom, deriveQuestionSeed } from "./generator-runner.js";

function freezeArray(values) {
  return Object.freeze(values.map((value) => Object.freeze({ ...value })));
}

function normaliseText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

export function questionFingerprint(question) {
  const options = Array.isArray(question?.options)
    ? question.options
        .map((option) => `${normaliseText(option.id)}:${normaliseText(option.label)}`)
        .sort()
        .join("|")
    : "";
  return [
    normaliseText(question?.templateId),
    normaliseText(question?.prompt),
    normaliseText(question?.math),
    options
  ].join("::");
}

function uniqueDefinitions(definitions) {
  const byTemplate = new Map();
  for (const definition of definitions ?? []) {
    if (definition?.templateId && !byTemplate.has(definition.templateId)) {
      byTemplate.set(definition.templateId, definition);
    }
  }
  return [...byTemplate.values()];
}

function validatePracticeDefinition(setDefinition) {
  if (!setDefinition?.id || !Array.isArray(setDefinition.definitions) || setDefinition.definitions.length === 0) {
    throw new Error("QuestionPracticeSession requires a question-set definition with at least one primary definition.");
  }
}

function shuffleChoicePresentation(question, seed) {
  if (question?.responseType !== "choice" || !Array.isArray(question.options) || question.options.length < 2) return question;
  const random = createSeededRandom(seed);
  const options = freezeArray(random.shuffle(question.options));
  return Object.freeze({
    ...question,
    options,
    practicePresentationSeed: seed
  });
}

export function createQuestionPracticeSession({
  setDefinition,
  runner,
  maxBatchSize = 4,
  recentWindow = 12,
  maxFreshnessAttempts = 10
} = {}) {
  validatePracticeDefinition(setDefinition);
  if (!runner?.generate || !runner?.baseSeed) throw new Error("QuestionPracticeSession requires a GeneratorRunner.");
  if (!Number.isInteger(maxBatchSize) || maxBatchSize < 1) throw new Error("maxBatchSize must be a positive integer.");

  const primaryDefinitions = uniqueDefinitions(setDefinition.definitions);
  const practiceDefinitions = uniqueDefinitions([
    ...primaryDefinitions,
    ...(setDefinition.practiceDefinitions ?? [])
  ]);
  const recentFingerprints = [];
  const recentFingerprintSet = new Set();
  let definitionQueue = [];
  let definitionCycle = 0;
  let generationSerial = 0;
  let batchIndex = 0;
  let current = null;
  let lastTemplateId = null;
  let generatedQuestions = 0;
  let avoidedDuplicates = 0;
  let unavoidableDuplicates = 0;

  function rememberFingerprint(fingerprint) {
    recentFingerprints.push(fingerprint);
    recentFingerprintSet.add(fingerprint);
    while (recentFingerprints.length > recentWindow) {
      const removed = recentFingerprints.shift();
      if (!recentFingerprints.includes(removed)) recentFingerprintSet.delete(removed);
    }
  }

  function refillQueue() {
    const seed = deriveQuestionSeed(runner.baseSeed, `${setDefinition.id}:definition-cycle:${definitionCycle}`);
    definitionCycle += 1;
    const random = createSeededRandom(seed);
    definitionQueue = random.shuffle(practiceDefinitions);
    if (definitionQueue.length > 1 && definitionQueue[0]?.templateId === lastTemplateId) {
      [definitionQueue[0], definitionQueue[1]] = [definitionQueue[1], definitionQueue[0]];
    }
  }

  function takePracticeDefinitions(count) {
    const selected = [];
    while (selected.length < count) {
      if (definitionQueue.length === 0) refillQueue();
      const next = definitionQueue.shift();
      if (!next) break;
      if (selected.length === 0 && practiceDefinitions.length > 1 && next.templateId === lastTemplateId) {
        definitionQueue.push(next);
        continue;
      }
      selected.push(next);
    }
    if (selected.length) lastTemplateId = selected[selected.length - 1].templateId;
    return selected;
  }

  function generateFreshQuestion(definition, batchNumber, position) {
    let accepted = null;
    let acceptedFingerprint = "";
    let duplicate = false;

    for (let attempt = 0; attempt < maxFreshnessAttempts; attempt += 1) {
      const serial = generationSerial++;
      const seed = deriveQuestionSeed(
        runner.baseSeed,
        `${setDefinition.id}:batch:${batchNumber}:position:${position}:template:${definition.templateId}:serial:${serial}:attempt:${attempt}`
      );
      const question = runner.generate(definition, { seed, sequence: serial });
      const presented = shuffleChoicePresentation(
        question,
        deriveQuestionSeed(seed, "choice-presentation")
      );
      const fingerprint = questionFingerprint(presented);
      accepted = presented;
      acceptedFingerprint = fingerprint;
      duplicate = recentFingerprintSet.has(fingerprint);
      if (!duplicate) break;
      avoidedDuplicates += 1;
    }

    if (!accepted) throw new Error(`Unable to generate a question for ${definition.templateId}.`);
    if (duplicate) unavoidableDuplicates += 1;
    rememberFingerprint(acceptedFingerprint);
    generatedQuestions += 1;
    return accepted;
  }

  function buildBatch() {
    const batchNumber = batchIndex + 1;
    const usePrimary = batchIndex === 0;
    const source = usePrimary ? primaryDefinitions : practiceDefinitions;
    const batchSize = Math.min(maxBatchSize, source.length);
    const definitions = usePrimary
      ? primaryDefinitions.slice(0, batchSize)
      : takePracticeDefinitions(batchSize);
    const setSeed = deriveQuestionSeed(runner.baseSeed, `${setDefinition.id}:practice-batch:${batchNumber}`);
    const questions = definitions.map((definition, index) => generateFreshQuestion(definition, batchNumber, index));

    batchIndex += 1;
    current = Object.freeze({
      id: setDefinition.id,
      label: setDefinition.label ?? setDefinition.id,
      generationSeed: setSeed,
      practiceBatch: batchNumber,
      practiceInfinite: true,
      questions: Object.freeze(questions)
    });
    return current;
  }

  function currentBatch() {
    return current ?? buildBatch();
  }

  function nextBatch() {
    return buildBatch();
  }

  function getStats() {
    return Object.freeze({
      setId: setDefinition.id,
      batchCount: batchIndex,
      generatedQuestions,
      avoidedDuplicates,
      unavoidableDuplicates,
      recentFingerprints: recentFingerprints.length,
      primaryTemplateCount: primaryDefinitions.length,
      practiceTemplateCount: practiceDefinitions.length
    });
  }

  return Object.freeze({
    currentBatch,
    nextBatch,
    getStats,
    getCurrentBatch: () => current,
    getPracticeTemplateIds: () => Object.freeze(practiceDefinitions.map((definition) => definition.templateId))
  });
}
