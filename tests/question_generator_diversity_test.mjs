import assert from "node:assert/strict";
import {
  listQuestionDefinitions,
  listQuestionSetDefinitions,
  getQuestionPracticeDefinitionForActivity
} from "../src/scripts/question-catalogue.js";
import { createGeneratorRunner } from "../src/scripts/generator-runner.js";
import { createQuestionPracticeSession, questionFingerprint } from "../src/scripts/question-practice-session.js";

const runner = createGeneratorRunner({ debugSeed: "question-diversity-audit" });
const definitions = listQuestionDefinitions();
let parameterisedDefinitions = 0;
let genuinelyRenderedDefinitions = 0;
let fixedDefinitions = 0;
const staleParameterised = [];

for (const definition of definitions) {
  const parameterSignatures = new Set();
  const renderedSignatures = new Set();
  for (let index = 0; index < 12; index += 1) {
    const question = runner.generate(definition, { seed: `diversity:${definition.templateId}:${index}`, sequence: index });
    parameterSignatures.add(JSON.stringify(question.parameters));
    renderedSignatures.add(questionFingerprint(question));
  }
  if (parameterSignatures.size > 1) {
    parameterisedDefinitions += 1;
    if (renderedSignatures.size > 1) genuinelyRenderedDefinitions += 1;
    else staleParameterised.push(definition.templateId);
  } else {
    fixedDefinitions += 1;
  }
}

assert.ok(parameterisedDefinitions >= 40, "The catalogue should retain a substantial genuinely parameterised generator surface.");
assert.deepEqual(staleParameterised, [], "Any generator that varies parameters must visibly vary the rendered question.");

let auditedSets = 0;
let broadenedSets = 0;
for (const setDefinition of listQuestionSetDefinitions()) {
  const representativeActivity = Object.entries(
    Object.fromEntries([])
  );
  void representativeActivity;
  if (!setDefinition?.definitions?.length) continue;
  const topics = new Set(setDefinition.definitions.map((definition) => definition.topicId));
  const aos = new Set(setDefinition.definitions.map((definition) => definition.assessmentObjective));
  const practiceDefinition = topics.size === 1 && aos.size === 1
    ? {
        ...setDefinition,
        practiceDefinitions: definitions.filter((definition) =>
          definition.topicId === setDefinition.definitions[0].topicId
          && definition.assessmentObjective === setDefinition.definitions[0].assessmentObjective
        )
      }
    : { ...setDefinition, practiceDefinitions: setDefinition.definitions };
  const session = createQuestionPracticeSession({ setDefinition: practiceDefinition, runner });
  const ids = new Set();
  const templates = new Set();
  for (let batchIndex = 0; batchIndex < 3; batchIndex += 1) {
    const batch = batchIndex === 0 ? session.currentBatch() : session.nextBatch();
    for (const question of batch.questions) {
      assert.equal(ids.has(question.id), false, `${setDefinition.id} repeated a generated question identity across fresh batches.`);
      ids.add(question.id);
      templates.add(question.templateId);
    }
  }
  auditedSets += 1;
  if (templates.size > Math.min(1, setDefinition.definitions.length)) broadenedSets += 1;
}

assert.ok(auditedSets >= 80, "The diversity audit should cover the full AO1-AO3 question-set catalogue.");
console.log(`Question diversity audit passed: ${definitions.length} definitions; ${parameterisedDefinitions} parameterised; ${genuinelyRenderedDefinitions} visibly varied; ${fixedDefinitions} finite conceptual stems; ${auditedSets} practice sets exercised across fresh batches.`);
