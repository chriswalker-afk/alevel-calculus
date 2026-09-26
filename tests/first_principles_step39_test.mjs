import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { firstPrinciplesTopic, firstPrinciplesVocabularyTags } from '../src/scripts/topic-content/first-principles.js';
import { firstPrinciplesLearningModes } from '../src/scripts/first-principles-activities.js';
import { firstPrinciplesMemoryItems } from '../src/scripts/memory-content.js';
import { getMemoryGamePackForTopic } from '../src/scripts/memory-game-content.js';
import { getMemoryReviewPackForTopic } from '../src/scripts/memory-review-content.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { createDiagnosticRouter } from '../src/scripts/diagnostic-router.js';
import { getHelpTargets, getSupportTargetForMicroSkill } from '../src/scripts/help-content.js';
import { getVocabularyTerm } from '../src/scripts/vocabulary-data.js';

function assert(condition, message) { if (!condition) throw new Error(message); }
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const topicId = 'topic:y12:differentiation:first-principles';
const modes = ['understand','memorise','ao1','ao2','ao3'];

assert(JSON.stringify(firstPrinciplesTopic.modes) === JSON.stringify(modes), 'Step 39 must activate the five canonical modes');
const expectedCounts = { understand: 9, memorise: 5, ao1: 3, ao2: 2, ao3: 1 };
for (const mode of modes) {
  const model = firstPrinciplesTopic.activities.filter((activity) => activity.mode === mode);
  const live = firstPrinciplesLearningModes[mode].activities;
  assert(model.length === expectedCounts[mode], `${mode} TopicMetadata count is wrong`);
  assert(live.length === expectedCounts[mode], `${mode} live activity count is wrong`);
  assert(JSON.stringify(model.map((a) => a.activityId)) === JSON.stringify(live.map((a) => a.activityId)), `${mode} live order must match TopicMetadata`);
}
assert(firstPrinciplesTopic.activities.filter((a) => a.mode !== 'understand').every((a) => a.implementationStep === 39), 'All new non-Understand activities must belong to Step 39');
assert(firstPrinciplesTopic.activities.every((a) => a.route.split('/').filter(Boolean).length === 5), 'All Step 39 routes must keep the canonical five-segment shape');

for (const tag of firstPrinciplesVocabularyTags) assert(getVocabularyTerm(tag), `VocabularyTerm missing for ${tag}`);
const vocabProjection = new Set(firstPrinciplesMemoryItems.filter((item) => item.sourceVocabularyTermId).map((item) => item.sourceVocabularyTermId));
for (const tag of firstPrinciplesVocabularyTags) assert(vocabProjection.has(tag), `Memory Lab must project ${tag} from VocabularyTerm`);
assert(firstPrinciplesMemoryItems.some((item) => item.learn.notation?.includes('f(x+h)')), 'Memory bank must include the first-principles definition/difference quotient');
assert(getMemoryGamePackForTopic(topicId)?.build && getMemoryGamePackForTopic(topicId)?.sort, 'First principles must reuse the declarative Memory Lab game pack contract');
assert(getMemoryReviewPackForTopic(topicId)?.diagram && getMemoryReviewPackForTopic(topicId)?.mix, 'First principles must reuse shared review engines including diagram recall');

const runner = createGeneratorRunner({ debugSeed: 'step39-first-principles' });
for (const mode of ['ao1','ao2','ao3']) {
  for (const activity of firstPrinciplesLearningModes[mode].activities) {
    const set = getQuestionSetDefinitionForActivity(activity.activityId);
    assert(set, `${activity.activityId} must use the shared QuestionShell/GeneratorRunner path`);
    const generated = runner.generateSet(set);
    assert(generated.questions.length > 0, `${activity.activityId} must generate questions`);
    assert(generated.questions.every((question) => question.metadata.assessmentObjective === mode), `${activity.activityId} must preserve ${mode} metadata`);
  }
}

const router = createDiagnosticRouter();
const fadingSet = runner.generateSet(getQuestionSetDefinitionForActivity('activity:y12:differentiation:first-principles:ao1:fading-practice'));
const x2Question = fadingSet.questions.find((q) => q.metadata.microSkillId.endsWith(':derive-x2'));
assert(x2Question, 'Fading set must include x² first-principles practice');
const algebraDiagnostic = router.routeOutcome({ success:false, errorCategory:'expansion-error', metadata:x2Question.metadata });
assert(algebraDiagnostic?.target?.activityId === 'activity:y12:differentiation:first-principles:ao1:fading-practice', 'Algebra execution errors must route to fading AO1 practice');
const limitDiagnostic = router.routeOutcome({ success:false, errorCategory:'substitutes-zero-too-early', metadata:x2Question.metadata });
assert(limitDiagnostic?.target?.activityId === 'activity:y12:differentiation:first-principles:understand:limit-intuition', 'Premature h=0 errors must route to the limits introduction');
const ao3Set = runner.generateSet(getQuestionSetDefinitionForActivity('activity:y12:differentiation:first-principles:ao3:select-and-apply'));
const quotientQuestion = ao3Set.questions.find((q) => q.metadata.templateId.includes('choose-difference-quotient'));
const gradientDiagnostic = router.routeOutcome({ success:false, errorCategory:'wrong-denominator', metadata:quotientQuestion.metadata });
assert(gradientDiagnostic?.target?.activityId === 'activity:y12:foundations:pre-calculus:understand:delta-change', 'Difference-quotient gradient errors must route to the exact Δy/Δx prerequisite');

const helpTargets = getHelpTargets(topicId);
assert(helpTargets.map((t) => t.mode).join(',') === 'understand,memorise,ao1', 'Help drawer must offer exact Understand/Memorise/AO1 First Principles support');
assert(getSupportTargetForMicroSkill('skill:y12:differentiation:first-principles:formal-definition','memorise')?.activityId.endsWith(':memorise:formula-recall'), 'Formula recall diagnostic link must be exact');

const shell = read('src/scripts/app-shell.js');
assert(shell.includes('createTopicMemoryLab') && shell.includes('memoryLabHosts'), 'AppShell must configure shared MemoryLab per topic without a new memory UI');
assert(shell.includes('availableModes: Object.freeze([...learningModeOrder])'), 'First Principles must expose all five frozen ModeTabs');
const questionDefs = read('src/scripts/question-definitions/first-principles-assessment.js');
assert(!questionDefs.includes('createElementNS') && !questionDefs.includes('<canvas'), 'Step 39 must not introduce a new visual engine');
assert(questionDefs.includes('backwards-fading') && questionDefs.includes('substitutes-zero-too-early'), 'Step 39 must include fading practice and exact limit diagnostics');

console.log('PASS Step 39 First Principles Memorise/AO1-AO3 shared-memory, assessment and diagnostic contracts');
