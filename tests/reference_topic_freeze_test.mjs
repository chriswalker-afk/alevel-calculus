import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { learningModes } from '../src/scripts/sample-activities.js';
import { basicsDifferentiationTopic, basicsDifferentiationVocabularyTags } from '../src/scripts/topic-content/basics-differentiation.js';
import { getVocabularyTerm } from '../src/scripts/vocabulary-data.js';
import { basicsDifferentiationMemoryItems } from '../src/scripts/memory-content.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const canonicalModes = ['understand', 'memorise', 'ao1', 'ao2', 'ao3'];
const plannedCounts = { understand: 8, memorise: 6, ao1: 4, ao2: 4, ao3: 1 };

// 1. Reference-topic identity and all five frozen mode surfaces.
assert(basicsDifferentiationTopic.topicId === 'topic:y12:differentiation:basics', 'Reference topic identity must stay stable');
assert(JSON.stringify(basicsDifferentiationTopic.modes) === JSON.stringify(canonicalModes), 'Reference topic must keep the five core modes in the locked order');
for (const mode of canonicalModes) {
  const modelIds = basicsDifferentiationTopic.activities.filter((activity) => activity.mode === mode).map((activity) => activity.activityId);
  const runtimeIds = learningModes[mode].activities.map((activity) => activity.activityId);
  assert(modelIds.length === plannedCounts[mode], `${mode} TopicMetadata count drifted from the Step 32-35 reference contract`);
  for (const id of modelIds) assert(runtimeIds.includes(id), `${id} is modelled but missing from the live ${mode} surface`);
}

// Memory Games / Review are shared MemoryLab extensions, not duplicate Step 32 topic-model entries.
const memoriseRuntimeIds = new Set(learningModes.memorise.activities.map((activity) => activity.activityId));
for (const id of [
  'activity:y12:differentiation:basics:memorise:memory-games',
  'activity:y12:differentiation:basics:memorise:mixed-review'
]) assert(memoriseRuntimeIds.has(id), `${id} stable shared MemoryLab progress identity must survive the design freeze`);

const liveIds = canonicalModes.flatMap((mode) => learningModes[mode].activities.map((activity) => activity.activityId));
assert(new Set(liveIds).size === liveIds.length, 'Reference-topic activity IDs must be globally unique across the five modes');

// 2. Every diagnostic support target must resolve to a real current activity.
const liveIdSet = new Set(liveIds);
for (const skill of basicsDifferentiationTopic.microSkills) {
  for (const [mode, target] of Object.entries(skill.supportTargets ?? {})) {
    assert(canonicalModes.includes(mode), `${skill.microSkillId} has an unsupported diagnostic mode ${mode}`);
    assert(liveIdSet.has(target), `${skill.microSkillId} diagnostic target ${target} is not live`);
  }
}

// 3. One vocabulary source; every topic tag resolves and is represented in the MemoryLab projection.
const memoryVocabularyIds = new Set(basicsDifferentiationMemoryItems.filter((item) => item.sourceVocabularyTermId).map((item) => item.sourceVocabularyTermId));
for (const tag of basicsDifferentiationVocabularyTags) {
  assert(getVocabularyTerm(tag), `Vocabulary tag ${tag} must resolve through the canonical Word Bank source`);
  assert(memoryVocabularyIds.has(tag), `Vocabulary tag ${tag} must project into the shared MemoryLab bank`);
}

// 4. Every AO activity stays on the shared generated-question path and preserves AO identity.
const runner = createGeneratorRunner({ debugSeed: 'step36-reference-freeze' });
for (const mode of ['ao1', 'ao2', 'ao3']) {
  for (const activity of learningModes[mode].activities) {
    const definition = getQuestionSetDefinitionForActivity(activity.activityId);
    assert(definition, `${activity.activityId} must keep a shared QuestionDefinition/GeneratorRunner set`);
    const generated = runner.generateSet(definition);
    assert(generated.questions.length > 0, `${activity.activityId} must generate a non-empty question set`);
    assert(generated.questions.every((question) => question.metadata.assessmentObjective === mode), `${activity.activityId} leaked another assessment objective`);
    assert(generated.questions.every((question) => liveIdSet.has(activity.activityId)), `${activity.activityId} must remain a live reference-topic activity`);
  }
}

// 5. AppShell/semantic accessibility conventions future topics must inherit.
const html = read('src/index.html');
for (const mode of canonicalModes) assert(html.includes(`data-mode-tab="${mode}"`), `AppShell is missing the ${mode} mode tab`);
assert((html.match(/role="tab"/g) ?? []).length >= 5, 'Mode and MemoryLab tabs must retain semantic tab roles');
assert(html.includes('role="tabpanel"'), 'Reference topic must expose semantic tab panels');
assert(html.includes('aria-live="polite"'), 'Reference topic must retain polite live feedback regions');
assert(html.includes('data-help-drawer') && html.includes('data-word-bank-drawer'), 'Help and Word Bank overlays must remain shared AppShell surfaces');
assert(html.includes('data-question-shell') && html.includes('data-memory-lab'), 'QuestionShell and MemoryLab must remain shared reference-topic surfaces');

const appCss = read('src/styles/app-shell.css');
const understandCss = read('src/styles/basics-understand.css');
const memoryCss = read('src/styles/memory-lab.css');
const questionCss = read('src/styles/question-shell.css');
for (const css of [appCss, understandCss, memoryCss, questionCss]) {
  assert(/@media\s*\(max-width:\s*680px\)/.test(css), 'Every primary reference-topic presentation layer needs a phone breakpoint');
}
assert(appCss.includes('overflow: hidden;') && /overflow:\s*auto;/.test(appCss), 'AppShell must keep document overflow contained and provide internal scrolling');
assert(/@media\s*\(min-width:\s*681px\)[\s\S]*?\.basics-understand__panel-body\s*\{[\s\S]*?overflow:\s*hidden;/.test(understandCss), 'Basics Understand should keep desktop activity bodies on one screen without internal vertical scrolling');
assert(/@media\s*\(max-width:\s*680px\)[\s\S]*?\.basics-understand__panel-body\s*\{[\s\S]*?overflow:\s*auto;/.test(understandCss), 'Basics Understand should restore scrolling on narrow screens when content genuinely cannot fit');
assert(memoryCss.includes('overflow: auto;') && questionCss.includes('overflow: auto;'), 'Memorise and QuestionShell retain deliberate internal scrolling where their task structure requires it');
assert(understandCss.includes('.linked-gradient-explorer__card[hidden] { display: none; }'), 'Hidden derivative panels must remain hidden when the single-screen graph-card layout is active');
assert(understandCss.includes('var(--touch-target-min)'), 'Basics-specific controls must use the shared touch-target token');
assert(appCss.includes('topic-navigation-toggle') && appCss.includes('min-height: var(--touch-target-min);'), 'Narrow-screen Topics control must keep the shared touch-target minimum');
assert(understandCss.includes(':focus-visible') && questionCss.includes(':focus-visible') && memoryCss.includes(':focus-visible'), 'All primary reference-topic interaction layers need visible focus treatment');

// 6. Persistence boundary: only the canonical storage module may touch localStorage.
const scriptsRoot = path.join(root, 'src/scripts');
const directStorageUsers = [];
for (const name of fs.readdirSync(scriptsRoot, { withFileTypes: true })) {
  if (!name.isFile() || !name.name.endsWith('.js')) continue;
  const relative = `src/scripts/${name.name}`;
  if (read(relative).includes('localStorage')) directStorageUsers.push(relative);
}
assert(JSON.stringify(directStorageUsers) === JSON.stringify(['src/scripts/local-state-store.js']), `Only LocalStateStore may access localStorage directly; found ${directStorageUsers.join(', ')}`);

// 7. Diagram/reuse boundary: Basics orchestration must configure the shared linked explorer, not draw its own SVG/canvas.
const understandJs = read('src/scripts/basics-understand.js');
assert(understandJs.includes('LinkedFunctionGradientExplorer'), 'Basics Understand must reuse LinkedFunctionGradientExplorer');
assert(!understandJs.includes('createElementNS') && !understandJs.includes('<canvas'), 'Basics Understand must not create a parallel graph renderer');
const visualJs = read('src/scripts/question-visual-renderer.js');
assert(visualJs.includes('DiagramPrimitives'), 'Question visuals must continue through canonical DiagramPrimitives');

// 8. Step 36 accessibility refinements: discrete dynamic updates are announced without making dragging noisy.
assert(understandJs.includes("sampleStatus.setAttribute('aria-live', 'polite')"), 'Gradient-point count should announce discrete updates');
assert(understandJs.includes("output.setAttribute('aria-live', 'polite')"), 'd/dx machine result should announce selection changes');

console.log('PASS Step 36 reference-topic regression/design-freeze contract across all five modes');
