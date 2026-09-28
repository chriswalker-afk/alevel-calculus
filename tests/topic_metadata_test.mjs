import {
  defineTopicMetadata,
  getActivityById,
  getActivityByRoute,
  getMicroSkillById,
  listActivitiesForMode
} from "../src/scripts/topic-metadata.js";
import {
  basicsDifferentiationTopic,
  basicsDifferentiationVocabularyTags
} from "../src/scripts/topic-content/basics-differentiation.js";
import { getVocabularyTerm } from "../src/scripts/vocabulary-data.js";
import { listQuestionDefinitions } from "../src/scripts/question-catalogue.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const topic = basicsDifferentiationTopic;
assert(topic.topicId === "topic:y12:differentiation:basics", "Basics must keep its canonical topic ID");
assert(topic.scopeId === "y12" && topic.routeScope === "y12", "Basics must remain in the Year 12 scope");
assert(topic.strand === "differentiation" && topic.slug === "basics", "Basics must keep its canonical route segments");
assert(JSON.stringify(topic.modes) === JSON.stringify(["understand", "memorise", "ao1", "ao2", "ao3"]), "Basics must model all five learning modes");
assert(topic.prerequisiteTopicIds.includes("topic:y12:foundations:pre-calculus"), "Basics must point back to the pre-calculus prerequisite topic");
assert(topic.prerequisiteTags.includes("straight-line-gradient") && topic.prerequisiteTags.includes("indices"), "Basics must carry gradient and index prerequisites");

const journeyOrder = topic.journey.map((item) => item.id);
assert(JSON.stringify(journeyOrder) === JSON.stringify([
  "gradient-on-a-curve",
  "gradient-function",
  "polynomial-explorer",
  "notation-and-operator",
  "power-rule",
  "term-by-term"
]), "Basics journey must preserve the planned conceptual sequence");

for (const vocabularyTag of basicsDifferentiationVocabularyTags) {
  assert(getVocabularyTerm(vocabularyTag), `Vocabulary tag ${vocabularyTag} must resolve through the shared vocabulary schema`);
}

for (const microSkill of topic.microSkills) {
  assert(microSkill.vocabularyTags.every((tag) => getVocabularyTerm(tag)), `${microSkill.microSkillId} vocabulary tags must all resolve`);
  const supportTargets = Object.values(microSkill.supportTargets);
  assert(supportTargets.length > 0, `${microSkill.microSkillId} must route to at least one exact activity ID`);
  for (const activityId of supportTargets) {
    const target = getActivityById(topic, activityId);
    assert(target, `${microSkill.microSkillId} support target ${activityId} must exist`);
    assert(target.microSkillIds.includes(microSkill.microSkillId), `${activityId} must explicitly address ${microSkill.microSkillId}`);
    assert(getActivityByRoute(topic, target.route)?.activityId === activityId, `${activityId} must round-trip through its canonical route`);
  }
}

for (const activity of topic.activities) {
  assert(activity.route === `/${activity.activityId.split(":").slice(1).join("/")}`, `${activity.activityId} must derive the canonical five-segment route`);
  assert(activity.vocabularyTags.every((tag) => getVocabularyTerm(tag)), `${activity.activityId} vocabulary tags must all resolve`);
  assert(activity.implementationStep >= 33 && activity.implementationStep <= 35, `${activity.activityId} must remain planned for Steps 33-35 rather than being implemented in Step 32`);
}

for (const mode of ["understand", "memorise", "ao1", "ao2", "ao3"]) {
  assert(listActivitiesForMode(topic, mode).length > 0, `Basics must have at least one routed ${mode} activity`);
}

for (const definition of listQuestionDefinitions().filter((item) => item.topicId === topic.topicId)) {
  assert(getMicroSkillById(topic, definition.microSkillId), `${definition.templateId} must point to a modelled Basics micro-skill`);
  assert(definition.vocabularyTags.every((tag) => getVocabularyTerm(tag)), `${definition.templateId} vocabulary tags must resolve`);
}

let invalidRejected = false;
try {
  defineTopicMetadata({
    topicId: "topic:y12:differentiation:bad-topic",
    scopeId: "y12",
    strand: "differentiation",
    slug: "bad-topic",
    title: "Bad topic",
    modes: ["understand"],
    microSkills: [{ microSkillId: "skill:y12:differentiation:bad-topic:skill", slug: "skill", title: "Skill", supportTargets: { understand: "activity:y12:differentiation:bad-topic:understand:missing" } }],
    activities: []
  });
} catch {
  invalidRejected = true;
}
assert(invalidRejected, "TopicMetadata must reject support targets that do not resolve to real activities");

console.log("PASS TopicMetadata and Basics of Differentiation Step 32 content model");
