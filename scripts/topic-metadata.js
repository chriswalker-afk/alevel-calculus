import { getCourseScope } from "./scope-metadata.js";

const allowedModes = Object.freeze(["understand", "memorise", "ao1", "ao2", "ao3", "mastery"]);
const allowedActivityTypes = Object.freeze(["lesson", "interactive", "memory", "question-set", "mastery"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function requireString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`TopicMetadata ${label} must be a non-empty string.`);
  }
  return value;
}

function requireSlug(value, label) {
  const slug = requireString(value, label);
  if (!slugPattern.test(slug)) {
    throw new Error(`TopicMetadata ${label} must be lower-case kebab-case.`);
  }
  return slug;
}

function freezeStrings(values, label) {
  if (!Array.isArray(values)) throw new Error(`TopicMetadata ${label} must be an array.`);
  for (const value of values) requireString(value, `${label} item`);
  return Object.freeze([...values]);
}

function freezeUniqueStrings(values, label) {
  const frozen = freezeStrings(values, label);
  if (new Set(frozen).size !== frozen.length) {
    throw new Error(`TopicMetadata ${label} must not contain duplicates.`);
  }
  return frozen;
}

function normaliseMicroSkill(topicPrefix, config) {
  const slug = requireSlug(config.slug, "microSkill.slug");
  const microSkillId = requireString(config.microSkillId, "microSkill.microSkillId");
  if (microSkillId !== `${topicPrefix}:${slug}`) {
    throw new Error(`Micro-skill ${microSkillId} must match ${topicPrefix}:${slug}.`);
  }

  const supportTargets = Object.freeze({ ...(config.supportTargets ?? {}) });
  for (const [mode, activityId] of Object.entries(supportTargets)) {
    if (!allowedModes.includes(mode)) throw new Error(`Unsupported support-target mode: ${mode}.`);
    requireString(activityId, `microSkill.supportTargets.${mode}`);
  }

  return Object.freeze({
    microSkillId,
    slug,
    title: requireString(config.title, "microSkill.title"),
    prerequisiteTags: freezeUniqueStrings(config.prerequisiteTags ?? [], "microSkill.prerequisiteTags"),
    vocabularyTags: freezeUniqueStrings(config.vocabularyTags ?? [], "microSkill.vocabularyTags"),
    supportTargets
  });
}

function normaliseActivity({ routeScope, strand, topicSlug, topicId, microSkillIds }, config) {
  const mode = requireSlug(config.mode, "activity.mode");
  if (!allowedModes.includes(mode)) throw new Error(`Unsupported activity mode: ${mode}.`);
  const slug = requireSlug(config.slug, "activity.slug");
  const activityId = requireString(config.activityId, "activity.activityId");
  const expectedId = `activity:${routeScope}:${strand}:${topicSlug}:${mode}:${slug}`;
  if (activityId !== expectedId) {
    throw new Error(`Activity ${activityId} must match ${expectedId}.`);
  }
  const expectedRoute = `/${routeScope}/${strand}/${topicSlug}/${mode}/${slug}`;
  const activityMicroSkillIds = freezeUniqueStrings(config.microSkillIds ?? [], "activity.microSkillIds");
  for (const id of activityMicroSkillIds) {
    if (!microSkillIds.has(id)) throw new Error(`Activity ${activityId} references unknown micro-skill ${id}.`);
  }
  const activityType = requireString(config.activityType, "activity.activityType");
  if (!allowedActivityTypes.includes(activityType)) {
    throw new Error(`Unsupported activityType: ${activityType}.`);
  }

  return Object.freeze({
    activityId,
    topicId,
    mode,
    slug,
    title: requireString(config.title, "activity.title"),
    activityType,
    microSkillIds: activityMicroSkillIds,
    vocabularyTags: freezeUniqueStrings(config.vocabularyTags ?? [], "activity.vocabularyTags"),
    prerequisiteTags: freezeUniqueStrings(config.prerequisiteTags ?? [], "activity.prerequisiteTags"),
    implementationStep: Number.isInteger(config.implementationStep) ? config.implementationStep : null,
    route: expectedRoute
  });
}

function normaliseJourneyItem(config, microSkillIds) {
  const id = requireSlug(config.id, "journey.id");
  const ids = freezeUniqueStrings(config.microSkillIds ?? [], "journey.microSkillIds");
  for (const microSkillId of ids) {
    if (!microSkillIds.has(microSkillId)) throw new Error(`Journey item ${id} references unknown micro-skill ${microSkillId}.`);
  }
  return Object.freeze({
    id,
    title: requireString(config.title, "journey.title"),
    summary: requireString(config.summary, "journey.summary"),
    microSkillIds: ids,
    vocabularyTags: freezeUniqueStrings(config.vocabularyTags ?? [], "journey.vocabularyTags")
  });
}

export function defineTopicMetadata(config) {
  const scopeId = requireSlug(config.scopeId, "scopeId");
  const scope = getCourseScope(scopeId);
  if (!scope) throw new Error(`Unknown course scope: ${scopeId}.`);
  const routeScope = scope.routeScope;
  const strand = requireSlug(config.strand, "strand");
  const slug = requireSlug(config.slug, "slug");
  const topicId = requireString(config.topicId, "topicId");
  const expectedTopicId = `topic:${routeScope}:${strand}:${slug}`;
  if (topicId !== expectedTopicId) throw new Error(`Topic ID must be ${expectedTopicId}.`);

  const modes = freezeUniqueStrings(config.modes ?? [], "modes");
  for (const mode of modes) {
    if (!allowedModes.includes(mode)) throw new Error(`Unsupported topic mode: ${mode}.`);
  }

  const topicPrefix = `skill:${routeScope}:${strand}:${slug}`;
  const microSkills = Object.freeze((config.microSkills ?? []).map((item) => normaliseMicroSkill(topicPrefix, item)));
  const microSkillIds = new Set(microSkills.map((item) => item.microSkillId));
  if (microSkillIds.size !== microSkills.length) throw new Error("TopicMetadata microSkill IDs must be unique.");

  const activityContext = { routeScope, strand, topicSlug: slug, topicId, microSkillIds };
  const activities = Object.freeze((config.activities ?? []).map((item) => normaliseActivity(activityContext, item)));
  const activityIds = new Set(activities.map((item) => item.activityId));
  if (activityIds.size !== activities.length) throw new Error("TopicMetadata activity IDs must be unique.");
  const activityRoutes = new Set(activities.map((item) => item.route));
  if (activityRoutes.size !== activities.length) throw new Error("TopicMetadata activity routes must be unique.");

  for (const microSkill of microSkills) {
    for (const [mode, activityId] of Object.entries(microSkill.supportTargets)) {
      const activity = activities.find((candidate) => candidate.activityId === activityId);
      if (!activity) throw new Error(`Support target ${activityId} does not exist.`);
      if (activity.mode !== mode) throw new Error(`Support target ${activityId} must use ${mode} mode.`);
      if (!activity.microSkillIds.includes(microSkill.microSkillId)) {
        throw new Error(`Support target ${activityId} must include ${microSkill.microSkillId}.`);
      }
    }
  }

  const journey = Object.freeze((config.journey ?? []).map((item) => normaliseJourneyItem(item, microSkillIds)));
  const journeyIds = new Set(journey.map((item) => item.id));
  if (journeyIds.size !== journey.length) throw new Error("TopicMetadata journey IDs must be unique.");

  return Object.freeze({
    topicId,
    scopeId,
    routeScope,
    strand,
    slug,
    title: requireString(config.title, "title"),
    sequence: Number.isFinite(config.sequence) ? config.sequence : 0,
    modes,
    prerequisiteTopicIds: freezeUniqueStrings(config.prerequisiteTopicIds ?? [], "prerequisiteTopicIds"),
    prerequisiteTags: freezeUniqueStrings(config.prerequisiteTags ?? [], "prerequisiteTags"),
    vocabularyTags: freezeUniqueStrings(config.vocabularyTags ?? [], "vocabularyTags"),
    journey,
    microSkills,
    activities,
    navigationBoundaryAfter: config.navigationBoundaryAfter ?? null
  });
}

export function getActivityById(topic, activityId) {
  return topic.activities.find((activity) => activity.activityId === activityId) ?? null;
}

export function getActivityByRoute(topic, route) {
  return topic.activities.find((activity) => activity.route === route) ?? null;
}

export function getMicroSkillById(topic, microSkillId) {
  return topic.microSkills.find((microSkill) => microSkill.microSkillId === microSkillId) ?? null;
}

export function listActivitiesForMode(topic, mode) {
  return topic.activities.filter((activity) => activity.mode === mode);
}

export const topicMetadataModes = allowedModes;
