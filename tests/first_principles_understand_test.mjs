import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { firstPrinciplesTopic, firstPrinciplesVocabularyTags } from '../src/scripts/topic-content/first-principles.js';
import { firstPrinciplesLearningModes } from '../src/scripts/first-principles-activities.js';
import { calculateChordState } from '../src/scripts/chord-to-tangent-explorer.js';
import { createPolynomialFunctionDefinition } from '../src/scripts/linked-function-gradient-explorer.js';
import { getHelpTargets } from '../src/scripts/help-content.js';
import { getVocabularyTerm } from '../src/scripts/vocabulary-data.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');

assert(firstPrinciplesTopic.topicId === 'topic:y12:differentiation:first-principles', 'Step 38 topic ID must be stable');
const understandModel = firstPrinciplesTopic.activities.filter((activity) => activity.mode === 'understand');
assert(understandModel.length === 10, 'Step 38 must include the new purpose-first opening plus the nine existing Understand states');
assert(firstPrinciplesLearningModes.understand.activities.length === 10, 'Live Step 38 surface must include all ten Understand states');
const modelIds = understandModel.map((activity) => activity.activityId);
const liveIds = firstPrinciplesLearningModes.understand.activities.map((activity) => activity.activityId);
assert(JSON.stringify(modelIds) === JSON.stringify(liveIds), 'First-principles Understand live order must match TopicMetadata');
assert(understandModel.every((activity) => activity.implementationStep === 38), 'Every Step 38 Understand activity must remain owned by Step 38');
assert(understandModel.every((activity) => activity.route.startsWith('/y12/differentiation/first-principles/understand/')), 'Step 38 routes must keep the canonical five-segment contract');

const journey = firstPrinciplesTopic.journey.map((item) => item.id);
assert(JSON.stringify(journey) === JSON.stringify([
  'purpose', 'limit-intuition', 'simple-limits', 'two-points', 'chord-approximation', 'h-to-zero', 'formal-definition', 'derive-x2', 'derive-x3', 'proof-vs-use'
]), 'Step 38 must preserve the planned visual-to-formal journey');

for (const tag of firstPrinciplesVocabularyTags) assert(getVocabularyTerm(tag), `Step 38 vocabulary tag ${tag} must resolve through the shared Word Bank`);

const purposeActivity = firstPrinciplesLearningModes.understand.activities[0];
assert(purposeActivity.activityId.endsWith(':understand:purpose'), 'The first student-facing page must be the purpose-first opening');
assert(purposeActivity.title === 'Why are we learning first principles?', 'The opening must answer why the topic is being learned before technical limit work');
assert(purposeActivity.body.includes('learn how differentiation rules can be proved'), 'The opening must explicitly frame first principles as proving differentiation rules');
assert(purposeActivity.callout.includes('only the limit ideas needed for A level first-principles differentiation'), 'The opening must limit the scope of the limit work');
assert(purposeActivity.formula === 'simple limits → chord approximation → h → 0 → formal definition → examples', 'The opening must preview the intended learning sequence');

const earlyActivities = firstPrinciplesLearningModes.understand.activities.slice(0, 6);
assert(earlyActivities.every((activity) => !activity.formula.includes("f′(x) = lim")), 'The formal first-principles derivative formula must remain hidden throughout the purpose/visual h→0 journey');
assert(firstPrinciplesLearningModes.understand.activities[6].formula.includes("f′(x) = lim"), 'The formal definition must first appear only after the purpose and visual journey');

const x2 = createPolynomialFunctionDefinition({ id:'step38-test-x2', label:'x²', coefficients:[0,0,1], xDomain:[-2,3] });
const chordGradients = [1, 0.5, 0.1, 0.01].map((h) => calculateChordState(x2, 1, 1 + h));
assert(JSON.stringify(chordGradients.map((state) => Number(state.chordGradient.toFixed(2)))) === JSON.stringify([3, 2.5, 2.1, 2.01]), 'Planned h sequence must produce the correct x² chord gradients');
assert(chordGradients.every((state) => state.tangentGradient === 2), 'Tangent gradient at x=1 for x² must remain fixed at 2');
assert(chordGradients.at(-1).gradientError < chordGradients[0].gradientError, 'Chord gradient error must shrink as h approaches zero');

const experience = read('src/scripts/first-principles-understand.js');
assert(experience.includes("from './chord-to-tangent-explorer.js'"), 'Step 38 must reuse ChordToTangentExplorer');
assert(experience.includes("from './equation-step-renderer.js'"), 'Step 38 derivations must reuse EquationStepRenderer');
assert(!experience.includes('createElementNS') && !experience.includes('<canvas'), 'Step 38 must not create a topic-local SVG/canvas renderer');
assert(experience.includes("aria-live', 'off'"), 'Continuous chord dragging must suppress noisy live announcements');
assert(experience.includes('H_SEQUENCE') && experience.includes('0.01'), 'Step 38 must include the planned decreasing-h sequence through 0.01');
assert(experience.includes('Why are we learning first principles?'), 'The rendered first page must explain the purpose before technical limit work.');
assert(experience.includes('not a full course on limits'), 'The rendered purpose page must restrict limit content to what first principles needs.');
assert(experience.includes('Simple limits') && experience.includes('Chord approximation') && experience.includes('Formal definition') && experience.includes('Examples'), 'The purpose page must preview the visual-to-formal route.');
assert(experience.includes("expression: \"f′(x) = lim_(h→0) [((x+h)² − x²)/h]\""), 'The existing x² derivation must remain intact.');
assert(experience.includes("expression: \"f′(x) = lim_(h→0) [((x+h)³ − x³)/h]\""), 'The existing x³ derivation must remain intact.');
assert(experience.includes('Cancel h while h ≠ 0'), 'Worked derivations must explain that h is cancelled before the limit is taken');
assert(experience.includes('apply a rule') || experience.includes('Use a rule'), 'Step 38 must finish by distinguishing use from proof');

const css = read('src/styles/first-principles-understand.css');
assert(css.includes('var(--touch-target-min)'), 'Step 38 controls must use the shared 44px touch-target token');
assert(css.includes(':focus-visible'), 'Step 38 controls must preserve visible keyboard focus');
assert(/@media\s*\(max-width:680px\)/.test(css), 'Step 38 must include the frozen phone breakpoint');
assert(css.includes('overflow:auto'), 'Step 38 must use internal scrolling rather than document-level overflow');

const shell = read('src/scripts/app-shell.js');
assert(shell.includes('topic:y12:differentiation:first-principles'), 'AppShell must recognise First principles as a real topic');
assert(shell.includes('firstPrinciplesUnderstand'), 'AppShell must route Step 38 through its thin Understand orchestration layer');
assert(shell.includes('firstPrinciplesLearningModes'), 'AppShell must consume the topic learning-mode configuration');

const helpTargets = getHelpTargets(firstPrinciplesTopic.topicId);
assert(helpTargets.some((target) => target.mode === 'understand' && modelIds.includes(target.activityId)), 'Step 38 Understand Help target must continue resolving to a real Step 38 activity');

console.log('PASS Step 38 Differentiation from First Principles Understand journey');
