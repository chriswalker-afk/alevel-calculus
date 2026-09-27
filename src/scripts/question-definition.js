import { questionResponseTypes } from "./question-shell.js";

const allowedScopes = Object.freeze(["y12", "y13", "full"]);
const allowedAssessmentObjectives = Object.freeze(["ao1", "ao2", "ao3"]);
const allowedDiagnosticKinds = Object.freeze(["recognition", "execution"]);
const allowedDiagnosticNeeds = Object.freeze(["understand", "memorise", "ao1"]);

function assertString(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`QuestionDefinition requires ${label}.`);
  }
  return value.trim();
}

function freezeStringTags(value, label) {
  if (!Array.isArray(value)) throw new Error(`QuestionDefinition ${label} must be an array.`);
  const tags = value.map((tag) => assertString(tag, `${label} tag`));
  return Object.freeze([...new Set(tags)]);
}

function optionalFunction(value, label) {
  if (value == null) return null;
  if (typeof value !== "function") throw new Error(`QuestionDefinition ${label} must be a function when supplied.`);
  return value;
}

function optionalFrozenValue(value) {
  if (value == null) return null;
  if (Array.isArray(value)) return Object.freeze(value.map((item) => optionalFrozenValue(item)));
  if (typeof value === "object") {
    return Object.freeze(Object.fromEntries(Object.entries(value).map(([key, item]) => [key, optionalFrozenValue(item)])));
  }
  return value;
}

function normaliseDiagnosticRule(value, label, courseScope) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`QuestionDefinition ${label} must be an object.`);
  }
  const kind = assertString(value.kind, `${label}.kind`);
  const supportNeed = assertString(value.supportNeed, `${label}.supportNeed`);
  if (!allowedDiagnosticKinds.includes(kind)) {
    throw new Error(`QuestionDefinition ${label}.kind must be one of: ${allowedDiagnosticKinds.join(", ")}.`);
  }
  if (!allowedDiagnosticNeeds.includes(supportNeed)) {
    throw new Error(`QuestionDefinition ${label}.supportNeed must be one of: ${allowedDiagnosticNeeds.join(", ")}.`);
  }
  const supportMicroSkillId = value.supportMicroSkillId
    ? assertString(value.supportMicroSkillId, `${label}.supportMicroSkillId`)
    : "";
  if (supportMicroSkillId && !supportMicroSkillId.startsWith(`skill:${courseScope}:`)) {
    throw new Error(`QuestionDefinition ${label}.supportMicroSkillId must use the same canonical scope as courseScope.`);
  }
  return Object.freeze({
    kind,
    supportNeed,
    supportMicroSkillId,
    studentMessage: value.studentMessage ? assertString(value.studentMessage, `${label}.studentMessage`) : ""
  });
}

function normaliseDiagnosticRules(value, errorCategories, courseScope) {
  if (value == null) return Object.freeze({});
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new Error("QuestionDefinition diagnosticRules must be an object keyed by declared error category.");
  }
  const entries = Object.entries(value).map(([errorCategory, rule]) => {
    if (!errorCategories.includes(errorCategory)) {
      throw new Error(`QuestionDefinition diagnosticRules references undeclared error category: ${errorCategory}.`);
    }
    return [errorCategory, normaliseDiagnosticRule(rule, `diagnosticRules.${errorCategory}`, courseScope)];
  });
  return Object.freeze(Object.fromEntries(entries));
}

export function defineQuestionDefinition(config) {
  if (!config || typeof config !== "object") throw new Error("QuestionDefinition requires a configuration object.");

  const templateId = assertString(config.templateId, "a stable templateId");
  const courseScope = assertString(config.courseScope, "courseScope");
  const topicId = assertString(config.topicId, "topicId");
  const assessmentObjective = assertString(config.assessmentObjective, "assessmentObjective");
  const microSkillId = assertString(config.microSkillId, "microSkillId");
  const difficulty = assertString(config.difficulty, "difficulty");
  const responseType = assertString(config.responseType, "responseType");

  if (!templateId.startsWith("question-template:")) {
    throw new Error("QuestionDefinition templateId must start with question-template:.");
  }
  if (!allowedScopes.includes(courseScope)) {
    throw new Error(`QuestionDefinition courseScope must be one of: ${allowedScopes.join(", ")}.`);
  }
  if (!topicId.startsWith(`topic:${courseScope}:`)) {
    throw new Error("QuestionDefinition topicId must use the same canonical scope as courseScope.");
  }
  if (!microSkillId.startsWith(`skill:${courseScope}:`)) {
    throw new Error("QuestionDefinition microSkillId must use the same canonical scope as courseScope.");
  }
  if (!allowedAssessmentObjectives.includes(assessmentObjective)) {
    throw new Error(`QuestionDefinition assessmentObjective must be one of: ${allowedAssessmentObjectives.join(", ")}.`);
  }
  if (!questionResponseTypes.includes(responseType)) {
    throw new Error(`QuestionDefinition responseType must be one of: ${questionResponseTypes.join(", ")}.`);
  }

  const parameterGenerator = config.parameterGenerator;
  const promptRenderer = config.promptRenderer;
  const answerChecker = config.answerChecker;
  const workedSolutionGenerator = config.workedSolutionGenerator;
  for (const [label, value] of [
    ["parameterGenerator", parameterGenerator],
    ["promptRenderer", promptRenderer],
    ["answerChecker", answerChecker],
    ["workedSolutionGenerator", workedSolutionGenerator]
  ]) {
    if (typeof value !== "function") throw new Error(`QuestionDefinition ${label} must be a function.`);
  }

  const errorCategories = freezeStringTags(config.errorCategories ?? [], "errorCategories");
  const diagnosticRules = normaliseDiagnosticRules(config.diagnosticRules, errorCategories, courseScope);
  const defaultDiagnostic = config.defaultDiagnostic
    ? normaliseDiagnosticRule(config.defaultDiagnostic, "defaultDiagnostic", courseScope)
    : null;

  return Object.freeze({
    templateId,
    courseScope,
    topicId,
    assessmentObjective,
    microSkillId,
    difficulty,
    prerequisiteTags: freezeStringTags(config.prerequisiteTags ?? [], "prerequisiteTags"),
    methodTags: freezeStringTags(config.methodTags ?? [], "methodTags"),
    vocabularyTags: freezeStringTags(config.vocabularyTags ?? [], "vocabularyTags"),
    errorCategories,
    diagnosticRules,
    defaultDiagnostic,
    responseType,
    responseLabel: config.responseLabel ? assertString(config.responseLabel, "responseLabel") : "",
    placeholder: config.placeholder ? assertString(config.placeholder, "placeholder") : "",
    selfReviewCriteria: optionalFrozenValue(config.selfReviewCriteria ?? []),
    parameterGenerator,
    promptRenderer,
    promptSegmentsRenderer: optionalFunction(config.promptSegmentsRenderer, "promptSegmentsRenderer"),
    mathRenderer: optionalFunction(config.mathRenderer, "mathRenderer"),
    responseOptionsRenderer: optionalFunction(config.responseOptionsRenderer, "responseOptionsRenderer"),
    answerChecker,
    workedSolutionGenerator,
    hintSequence: optionalFrozenValue(config.hintSequence ?? []),
    hintSequenceGenerator: optionalFunction(config.hintSequenceGenerator, "hintSequenceGenerator"),
    diagramConfig: optionalFrozenValue(config.diagramConfig)
  });
}

export function getQuestionDefinitionMetadata(definition) {
  return Object.freeze({
    templateId: definition.templateId,
    courseScope: definition.courseScope,
    topicId: definition.topicId,
    assessmentObjective: definition.assessmentObjective,
    microSkillId: definition.microSkillId,
    difficulty: definition.difficulty,
    prerequisiteTags: definition.prerequisiteTags,
    methodTags: definition.methodTags,
    vocabularyTags: definition.vocabularyTags,
    errorCategories: definition.errorCategories,
    diagnosticRules: definition.diagnosticRules,
    defaultDiagnostic: definition.defaultDiagnostic
  });
}

export const questionDefinitionScopes = allowedScopes;
export const questionDefinitionAssessmentObjectives = allowedAssessmentObjectives;
export const questionDefinitionDiagnosticKinds = allowedDiagnosticKinds;
export const questionDefinitionDiagnosticNeeds = allowedDiagnosticNeeds;
