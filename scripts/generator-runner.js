import { getQuestionDefinitionMetadata } from "./question-definition.js";
import { createHintSequence } from "./hint-sequence.js";
import { normaliseQuestionCheckResult } from "./question-feedback.js";
import { normaliseSolutionSteps } from "./solution-step.js";

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const item of Object.values(value)) deepFreeze(item);
  return value;
}

function hashSeed(value) {
  const text = String(value ?? "");
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function normaliseQuestionSeed(seed) {
  if (seed == null || String(seed).trim() === "") return null;
  return String(seed).trim();
}

export function deriveQuestionSeed(baseSeed, salt) {
  return `${hashSeed(`${baseSeed}::${salt}`)}`;
}

export function createSeededRandom(seed) {
  const resolvedSeed = normaliseQuestionSeed(seed);
  if (resolvedSeed == null) throw new Error("A deterministic seed is required to create seeded random values.");
  const next = mulberry32(hashSeed(resolvedSeed));

  return Object.freeze({
    float() {
      return next();
    },
    int(min, max) {
      if (!Number.isInteger(min) || !Number.isInteger(max) || max < min) {
        throw new Error("random.int(min, max) requires integer bounds with max >= min.");
      }
      return min + Math.floor(next() * (max - min + 1));
    },
    pick(values) {
      if (!Array.isArray(values) || values.length === 0) throw new Error("random.pick requires a non-empty array.");
      return values[Math.floor(next() * values.length)];
    },
    shuffle(values) {
      if (!Array.isArray(values)) throw new Error("random.shuffle requires an array.");
      const copy = [...values];
      for (let index = copy.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(next() * (index + 1));
        [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
      }
      return copy;
    }
  });
}

export function createRuntimeQuestionSeed() {
  if (globalThis.crypto?.getRandomValues) {
    const values = new Uint32Array(2);
    globalThis.crypto.getRandomValues(values);
    return `${values[0]}-${values[1]}`;
  }
  return `${Date.now()}-${Math.floor(Math.random() * 1_000_000_000)}`;
}

export function readQuestionDebugSeed(search = "") {
  try {
    const params = new URLSearchParams(search);
    return normaliseQuestionSeed(params.get("questionSeed"));
  } catch {
    return null;
  }
}

function validateRenderedQuestion(question) {
  if (!question.prompt || typeof question.prompt !== "string") throw new Error("Generated question requires a prompt string.");
  if (!Array.isArray(question.solutionSteps) || question.solutionSteps.length === 0) throw new Error("Generated question requires structured solution steps.");
  if (!Array.isArray(question.hintSequence)) throw new Error("Generated question requires a normalised hint sequence.");
  if (question.responseType === "choice") {
    if (!Array.isArray(question.options) || question.options.length < 2 || question.options.length > 4) {
      throw new Error("Generated choice question requires between 2 and 4 options.");
    }
    const ids = question.options.map((option) => option.id);
    if (new Set(ids).size !== ids.length) throw new Error("Generated choice option IDs must be unique.");
  }
}

export function createGeneratorRunner({ debugSeed = null, runtimeSeed = null } = {}) {
  const explicitDebugSeed = normaliseQuestionSeed(debugSeed);
  const baseSeed = explicitDebugSeed ?? normaliseQuestionSeed(runtimeSeed) ?? createRuntimeQuestionSeed();

  function generate(definition, { seed = null, sequence = 0 } = {}) {
    if (!definition?.templateId || typeof definition.parameterGenerator !== "function") {
      throw new Error("GeneratorRunner received an invalid QuestionDefinition.");
    }
    if (!Number.isInteger(sequence) || sequence < 0) throw new Error("GeneratorRunner sequence must be a non-negative integer.");

    const generationSeed = normaliseQuestionSeed(seed)
      ?? deriveQuestionSeed(baseSeed, `${definition.templateId}:${sequence}`);
    const random = createSeededRandom(generationSeed);
    const parameters = deepFreeze(definition.parameterGenerator(Object.freeze({ random, seed: generationSeed, sequence })));
    if (!parameters || typeof parameters !== "object" || Array.isArray(parameters)) {
      throw new Error(`QuestionDefinition ${definition.templateId} parameterGenerator must return an object.`);
    }

    const hintSequence = createHintSequence(
      definition.hintSequenceGenerator
        ? definition.hintSequenceGenerator(parameters)
        : definition.hintSequence
    );
    const solutionSteps = normaliseSolutionSteps(
      definition.workedSolutionGenerator(parameters),
      { sourceLabel: `QuestionDefinition ${definition.templateId} workedSolutionGenerator` }
    );
    const options = definition.responseOptionsRenderer
      ? definition.responseOptionsRenderer(parameters)
      : null;

    const question = {
      id: `generated-question:${hashSeed(`${definition.templateId}:${generationSeed}:${sequence}`)}`,
      templateId: definition.templateId,
      generationSeed,
      sequence,
      parameters,
      metadata: getQuestionDefinitionMetadata(definition),
      responseType: definition.responseType,
      responseLabel: definition.responseLabel,
      placeholder: definition.placeholder,
      selfReviewCriteria: definition.selfReviewCriteria,
      prompt: definition.promptRenderer(parameters),
      math: definition.mathRenderer ? definition.mathRenderer(parameters) : "",
      options: options ? Object.freeze(options.map((option) => Object.freeze({ ...option }))) : undefined,
      hintSequence,
      solutionSteps,
      diagramConfig: definition.diagramConfig,
      check(response) {
        return normaliseQuestionCheckResult(definition.answerChecker(response, parameters), {
          allowedErrorCategories: definition.errorCategories
        });
      }
    };
    validateRenderedQuestion(question);
    return Object.freeze(question);
  }

  function generateSet({ id, label, definitions, seed = null } = {}) {
    if (typeof id !== "string" || id.trim() === "") throw new Error("GeneratorRunner.generateSet requires a stable set id.");
    if (!Array.isArray(definitions) || definitions.length === 0) throw new Error("GeneratorRunner.generateSet requires at least one QuestionDefinition.");
    const setSeed = normaliseQuestionSeed(seed) ?? deriveQuestionSeed(baseSeed, id);
    const questions = definitions.map((definition, index) => generate(definition, {
      seed: deriveQuestionSeed(setSeed, `${definition.templateId}:${index}`),
      sequence: index
    }));
    return Object.freeze({
      id,
      label: typeof label === "string" && label.trim() ? label.trim() : id,
      generationSeed: setSeed,
      questions: Object.freeze(questions)
    });
  }

  return Object.freeze({
    baseSeed,
    debugSeed: explicitDebugSeed,
    generate,
    generateSet
  });
}
