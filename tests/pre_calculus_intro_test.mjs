import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { preCalculusTopic } from '../src/scripts/topic-content/pre-calculus.js';
import { preCalculusLearningModes } from '../src/scripts/pre-calculus-activities.js';
import { getHelpTargets } from '../src/scripts/help-content.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');

assert(preCalculusTopic.topicId === 'topic:y12:foundations:pre-calculus', 'Step 37 topic ID must be stable');
assert(JSON.stringify(preCalculusTopic.modes) === JSON.stringify(['understand']), 'Pre-calculus must remain understanding-only in Step 37');
assert(preCalculusTopic.activities.length === 8, 'Pre-calculus must contain eight short Understand states after the notation-introduction pass');
assert(preCalculusLearningModes.understand.activities.length === 8, 'Live Pre-calculus surface must expose all eight Understand activities');
for (const mode of ['memorise', 'ao1', 'ao2', 'ao3']) {
  assert(preCalculusLearningModes[mode].activities.length === 0, `${mode} must not be implemented early in Step 37`);
}

const modelIds = preCalculusTopic.activities.map((activity) => activity.activityId);
const liveIds = preCalculusLearningModes.understand.activities.map((activity) => activity.activityId);
assert(JSON.stringify(modelIds) === JSON.stringify(liveIds), 'Pre-calculus live activity order must match TopicMetadata');
assert(preCalculusTopic.activities.every((activity) => activity.implementationStep === 37), 'Every Step 37 activity must be owned by Step 37');
assert(preCalculusTopic.activities.every((activity) => activity.route.startsWith('/y12/foundations/pre-calculus/understand/')), 'Pre-calculus routes must keep the five-segment route contract');

const titles = preCalculusLearningModes.understand.activities.map((activity) => activity.title).join(' | ');
for (const phrase of ['hill', 'Positive, negative or zero', 'steepness', 'same gradient', 'vertical', 'Δy', 'curve']) {
  assert(titles.toLowerCase().includes(phrase.toLowerCase()) || preCalculusLearningModes.understand.activities.some((a) => `${a.body} ${a.callout} ${a.formula}`.toLowerCase().includes(phrase.toLowerCase())), `Step 37 journey is missing ${phrase}`);
}

const experience = read('src/scripts/pre-calculus-understand.js');
assert(experience.includes("from './diagram-primitives.js"), 'Pre-calculus must reuse DiagramPrimitives');
assert(!experience.includes('createElementNS') && !experience.includes('<canvas'), 'Pre-calculus must not create a topic-local graph renderer');
assert(experience.includes('Drive across hill'), 'Hill intuition must provide an animated/automatic car journey');
assert(experience.includes("prefers-reduced-motion: reduce"), 'Hill animation must respect reduced-motion preference');
assert(experience.includes('gradient undefined') || experience.includes('gradient is undefined'), 'Vertical-line state must state undefined gradient');
assert(experience.includes('there is vertical change but no horizontal change'), 'Vertical-line reasoning must remain notation-free before delta is introduced');
assert(experience.includes("min: -89") && experience.includes("max: 89"), 'Near-vertical exploration must approach vertical from both negative- and positive-gradient sides');
assert(experience.includes('positive-gradient side') && experience.includes('negative-gradient side'), 'Near-vertical exploration must describe both one-sided behaviours without premature m notation');
assert(experience.includes('gradient magnitude grows without bound') || experience.includes('magnitude grows without bound'), 'Near-vertical exploration must explicitly describe unbounded gradient magnitude');
assert(experience.includes('does not mean a vertical line has gradient “infinity”'), 'The page must distinguish a limiting infinity statement from the undefined gradient of a vertical line');
assert(experience.includes('same gradient') || experience.includes('gradient remains'), 'Gradient-vs-height state must preserve gradient under vertical translation');
const beforeDeltaIntroduction = experience.split('render_delta_meaning()')[0];
assert(!beforeDeltaIntroduction.includes('Δx') && !beforeDeltaIntroduction.includes('Δy'), 'Delta notation must not appear before the delta-introduction activity');
assert(!beforeDeltaIntroduction.includes('m →') && !beforeDeltaIntroduction.includes('Horizontal: m') && !beforeDeltaIntroduction.includes('side: m ≈'), 'm notation must not appear in student-facing pre-delta content');
assert(experience.includes('The symbol Δ is the capital Greek letter delta'), 'The new activity must explicitly explain what delta means before using it in the formula');
assert(experience.includes('change in x = 5 − 1 = 4') && experience.includes('change in y = 3 − 1 = 2'), 'The delta activity must begin with plain-language change in x and change in y');
assert(experience.includes('gradient of a straight line = Δy ÷ Δx'), 'The delta activity must introduce the straight-line gradient formula');
assert(experience.includes('(y₂ − y₁) ÷ (x₂ − x₁)'), 'The formula must be connected to two-point coordinate notation');

const css = read('src/styles/pre-calculus-understand.css');
assert(css.includes('var(--touch-target-min)'), 'Step 37 controls must use the shared 44px touch-target token');
assert(css.includes(':focus-visible'), 'Step 37 controls must preserve visible keyboard focus');
assert(/@media\s*\(max-width:680px\)/.test(css), 'Step 37 must include the frozen phone breakpoint');
assert(css.includes('overflow:auto'), 'Step 37 must use internal scrolling rather than document-level overflow');

const shell = read('src/scripts/app-shell.js');
assert(shell.includes('topic:y12:foundations:pre-calculus'), 'AppShell must recognise the implemented Pre-calculus topic');
assert(shell.includes('availableModes: Object.freeze(["understand"])'), 'AppShell must disable unimplemented Pre-calculus modes rather than invent placeholders');
assert(shell.includes('selectTopic'), 'Step 37 must make the existing Pre-calculus navigation item genuinely selectable');
assert(shell.includes('preCalculusUnderstand'), 'AppShell must route Pre-calculus Understand to its thin orchestration layer');

const helpTargets = getHelpTargets(preCalculusTopic.topicId);
assert(helpTargets.length === 1 && helpTargets[0].mode === 'understand', 'Pre-calculus Help must stay understanding-only');
assert(modelIds.includes(helpTargets[0].activityId), 'Pre-calculus Help target must resolve to a real Step 37 activity');

console.log('PASS Step 37 Pre-calculus understanding-only gradient journey');
