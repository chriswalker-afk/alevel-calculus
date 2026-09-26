import assert from 'node:assert/strict';
import { createLocalStateStore, createMemoryStorage } from '../src/scripts/local-state-store.js';
import { createProgressStore } from '../src/scripts/progress-store.js';
import { createVocabularyStore } from '../src/scripts/vocabulary-store.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';
import { createDiagnosticRouter } from '../src/scripts/diagnostic-router.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { basicsDifferentiationTopic } from '../src/scripts/topic-content/basics-differentiation.js';
import { year12ReviewTopic } from '../src/scripts/topic-content/year12-review.js';
import { substitutionTopic } from '../src/scripts/topic-content/substitution.js';
import { fullCalculusMasteryTopic } from '../src/scripts/topic-content/full-calculus-mastery.js';
import { activityRouteFromId, parseActivityRoute } from '../src/scripts/navigation-route.js';
import { createMasteryFeedbackModel } from '../src/scripts/mastery-feedback-model.js';
import { fullCalculusMasteryModel } from '../src/scripts/full-calculus-mastery-model.js';

const routeShape = /^\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+$/;
let tick = 0;
const now = () => `2026-09-26T12:00:${String(tick++).padStart(2, '0')}Z`;
const storage = createMemoryStorage();
const localStateStore = createLocalStateStore({ storage, now });
const progressStore = createProgressStore(localStateStore, { now });
const vocabularyStore = createVocabularyStore({ localStateStore, now });
const runner = createGeneratorRunner({ debugSeed: 'step82-release-journey' });
const router = createDiagnosticRouter();
const masteryFeedback = createMasteryFeedbackModel({ router });

assert.deepEqual(localStateStore.getState(), { progress: { activities: {} }, vocabulary: { records: {} } }, 'A first visit must begin from a clean learner state.');

function activity(topic, mode, slug) {
  const result = topic.activities.find((item) => item.mode === mode && item.slug === slug);
  assert(result, `Missing ${topic.topicId} ${mode}/${slug}`);
  assert.match(result.route, routeShape);
  assert.equal(activityRouteFromId(result.activityId), result.route);
  const parsed = parseActivityRoute(result.route);
  assert.equal(parsed?.activityId, result.activityId);
  return result;
}

function visitAndComplete(item) {
  progressStore.markVisited(item.activityId, { topicId: item.topicId, mode: item.mode });
  return progressStore.setCompleted(item.activityId, true, { topicId: item.topicId, mode: item.mode });
}

function findChoiceResponses(question) {
  assert.equal(question.responseType, 'choice', `${question.templateId} must be a choice question for the release journey.`);
  const evaluated = question.options.map((option) => ({ option, result: question.check(option.id) }));
  const correct = evaluated.find((entry) => entry.result.tone === 'correct');
  const incorrect = evaluated.find((entry) => entry.result.tone !== 'correct');
  assert(correct, `${question.templateId} must expose one correct choice.`);
  assert(incorrect, `${question.templateId} must expose at least one distractor.`);
  return { correct, incorrect };
}

function failDiagnoseRetry({ question, activityItem, expectedSupportScope = null }) {
  const { correct, incorrect } = findChoiceResponses(question);
  const failed = progressStore.recordAttempt(activityItem.activityId, {
    success: false,
    topicId: activityItem.topicId,
    mode: activityItem.mode
  });
  assert.equal(failed.attempts, 1);
  const diagnostic = router.routeOutcome({
    success: false,
    metadata: question.metadata,
    errorCategory: incorrect.result.errorCategory ?? null
  });
  assert(diagnostic?.target?.activityId, `${question.templateId} failure must route to exact diagnostic help.`);
  assert.match(diagnostic.target.route, routeShape);
  assert.equal(activityRouteFromId(diagnostic.target.activityId), diagnostic.target.route);
  if (expectedSupportScope) assert.equal(diagnostic.target.topicId.split(':')[1], expectedSupportScope);

  progressStore.markVisited(diagnostic.target.activityId, {
    topicId: diagnostic.target.topicId,
    mode: diagnostic.target.mode
  });

  const retryResult = question.check(correct.option.id);
  assert.equal(retryResult.tone, 'correct', 'The same generated question must accept a correct retry after support.');
  const retried = progressStore.recordAttempt(activityItem.activityId, {
    success: true,
    completed: true,
    topicId: activityItem.topicId,
    mode: activityItem.mode
  });
  assert.equal(retried.attempts, 2);
  assert.deepEqual(retried.recentSuccess.map((entry) => entry.success), [false, true]);
  return { diagnostic, failedResult: incorrect.result, retryResult };
}

// Representative Year 12 journey: first visit -> Understand -> Memorise -> practice -> diagnostic help -> retry -> mastery.
const y12Understand = activity(basicsDifferentiationTopic, 'understand', 'curve-tangent-gradient');
const y12Memorise = activity(basicsDifferentiationTopic, 'memorise', 'power-rule-recall');
const y12Practice = activity(basicsDifferentiationTopic, 'ao1', 'graph-matching');
visitAndComplete(y12Understand);
visitAndComplete(y12Memorise);
vocabularyStore.encounter('vocab:gradient', {
  scopeId: 'y12', topicId: basicsDifferentiationTopic.topicId, topicLabel: basicsDifferentiationTopic.title,
  activityId: y12Understand.activityId, activityTitle: y12Understand.title
});
const y12PracticeSet = getQuestionSetDefinitionForActivity(y12Practice.activityId);
const y12Question = runner.generateSet(y12PracticeSet).questions[0];
const y12Loop = failDiagnoseRetry({ question: y12Question, activityItem: y12Practice, expectedSupportScope: 'y12' });
assert.equal(y12Loop.diagnostic.kind, 'recognition');

const y12Mastery = activity(year12ReviewTopic, 'ao3', 'diagnostic-mastery');
const y12MasterySet = getQuestionSetDefinitionForActivity(y12Mastery.activityId);
const y12MasteryQuestions = runner.generateSet(y12MasterySet).questions;
assert(new Set(y12MasteryQuestions.map((question) => question.metadata.assessmentObjective)).has('ao1'));
assert(new Set(y12MasteryQuestions.map((question) => question.metadata.assessmentObjective)).has('ao2'));
assert(new Set(y12MasteryQuestions.map((question) => question.metadata.assessmentObjective)).has('ao3'));
visitAndComplete(y12Mastery);
progressStore.setSecurity(y12Mastery.activityId, 'secure', { topicId: y12Mastery.topicId, mode: y12Mastery.mode });
const y12Feedback = masteryFeedback.summarise([{
  success: false,
  metadata: y12Question.metadata,
  errorCategory: y12Loop.failedResult.errorCategory ?? null
}, {
  success: true,
  metadata: y12Question.metadata,
  errorCategory: null
}]);
assert.equal(y12Feedback.attemptCount, 2);
assert.equal(y12Feedback.weaknesses.length, 1, 'The Year 12 failure remains visible as actionable mastery evidence even after retry.');
assert(y12Feedback.weaknesses[0].nextStep?.activityId);

// Representative full-A-level journey: Year 13 Understand -> Memorise -> practice, then final topic-blind mastery with its own failure/help/retry loop.
const fullUnderstand = activity(substitutionTopic, 'understand', 'why-substitution');
const fullMemorise = activity(substitutionTopic, 'memorise', 'method-position');
const fullPractice = activity(substitutionTopic, 'ao1', 'given-substitution');
visitAndComplete(fullUnderstand);
visitAndComplete(fullMemorise);
visitAndComplete(fullPractice);
vocabularyStore.encounter('vocab:substitution', {
  scopeId: 'y13-additional', topicId: substitutionTopic.topicId, topicLabel: substitutionTopic.title,
  activityId: fullUnderstand.activityId, activityTitle: fullUnderstand.title
});

const fullMastery = activity(fullCalculusMasteryTopic, 'ao3', 'mixed-mastery');
const fullMasterySet = getQuestionSetDefinitionForActivity(fullMastery.activityId);
const fullMasteryQuestions = runner.generateSet(fullMasterySet).questions;
const fullChoiceQuestion = fullMasteryQuestions.find((question) => question.responseType === 'choice' && question.metadata.defaultDiagnostic);
assert(fullChoiceQuestion, 'Full mastery must contain a diagnostically-routable choice question.');
const fullLoop = failDiagnoseRetry({ question: fullChoiceQuestion, activityItem: fullMastery });
assert(['recognition', 'execution'].includes(fullLoop.diagnostic.kind));
progressStore.setSecurity(fullMastery.activityId, 'secure', { topicId: fullMastery.topicId, mode: fullMastery.mode });

const fullSummary = fullCalculusMasteryModel.summarise([{
  activityId: fullMastery.activityId,
  attempt: { success: false, errorCategory: fullLoop.failedResult.errorCategory ?? null, metadata: fullChoiceQuestion.metadata, diagnostic: fullLoop.diagnostic }
}, {
  activityId: fullMastery.activityId,
  attempt: { success: true, errorCategory: null, metadata: fullChoiceQuestion.metadata, diagnostic: null }
}]);
assert.equal(fullSummary.attemptCount, 2);
assert(Object.values(fullSummary.dimensions).some((bucket) => bucket.failures === 1));
assert(Object.values(fullSummary.dimensions).some((bucket) => bucket.successes === 1));

// Final release journey persistence: exported learner state must survive a clean-profile import without browser-history coupling.
const beforeExport = localStateStore.getState();
assert(Object.keys(beforeExport.progress.activities).length >= 9, 'The combined journeys should leave substantial persisted progress evidence.');
assert.equal(Object.keys(beforeExport.vocabulary.records).length, 2);
const exported = localStateStore.exportData();
const cleanStorage = createMemoryStorage();
const restoredState = createLocalStateStore({ storage: cleanStorage, now });
assert.deepEqual(restoredState.getState(), { progress: { activities: {} }, vocabulary: { records: {} } });
const inspection = restoredState.importData(exported);
assert.equal(inspection.activityCount, Object.keys(beforeExport.progress.activities).length);
assert.equal(inspection.vocabularyCount, 2);
assert.deepEqual(restoredState.getState(), beforeExport, 'Clean-profile import must reproduce the complete end-to-end journey state.');

const restoredProgress = createProgressStore(restoredState, { now });
assert.equal(restoredProgress.getActivity(y12Mastery.activityId)?.security, 'secure');
assert.equal(restoredProgress.getActivity(fullMastery.activityId)?.security, 'secure');
assert.equal(restoredProgress.getActivity(y12Practice.activityId)?.attempts, 2);
assert.equal(restoredProgress.getActivity(fullMastery.activityId)?.attempts, 2);

console.log('PASS Step 82 end-to-end Year 12 and full A level journeys, diagnostic retry loops, mastery evidence and clean-profile recovery');
