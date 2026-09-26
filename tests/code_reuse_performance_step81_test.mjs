import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  LEARNING_MODE_PRESENTATION,
  learningModeDescriptor,
  learningModeKicker,
  learningModeLabel
} from '../src/scripts/learning-mode-presentation.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scriptsRoot = path.join(root, 'src/scripts');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');

const expected = {
  understand: ['Understand', 'Explore', 'Understand'],
  memorise: ['Memorise', 'Recall', 'Memorise · Memory Lab'],
  ao1: ['AO1', 'Practise', 'AO1'],
  ao2: ['AO2', 'Reason', 'AO2'],
  ao3: ['AO3', 'Apply', 'AO3']
};
for (const [mode, [label, descriptor, kicker]] of Object.entries(expected)) {
  assert(LEARNING_MODE_PRESENTATION[mode], `${mode} must have shared presentation metadata`);
  assert(learningModeLabel(mode) === label, `${mode} label drifted`);
  assert(learningModeDescriptor(mode) === descriptor, `${mode} descriptor drifted`);
  assert(learningModeKicker(mode) === kicker, `${mode} kicker drifted`);
}
let unknownRejected = false;
try { learningModeLabel('not-a-mode'); } catch { unknownRejected = true; }
assert(unknownRejected, 'Unknown modes must fail rather than silently invent presentation text');

const activityFiles = fs.readdirSync(scriptsRoot)
  .filter((name) => name.endsWith('-activities.js'))
  .map((name) => `src/scripts/${name}`);
const canonicalTernaries = [
  "mode==='understand'?'Understand':mode==='memorise'?'Memorise':mode.toUpperCase()",
  "mode==='understand'?'Explore':mode==='memorise'?'Recall':mode==='ao1'?'Practise':mode==='ao2'?'Reason':'Apply'",
  "mode==='understand'?'Understand':mode==='memorise'?'Memorise · Memory Lab':mode.toUpperCase()"
];
for (const relative of activityFiles) {
  const source = read(relative);
  for (const duplicated of canonicalTernaries) {
    assert(!source.includes(duplicated), `${relative} reintroduced the shared learning-mode presentation ternary`);
  }
}
const sharedPresentationConsumers = activityFiles.filter((relative) => read(relative).includes("./learning-mode-presentation.js"));
assert(sharedPresentationConsumers.length === 20, `Expected 20 completed topic adapters to reuse shared mode presentation; found ${sharedPresentationConsumers.length}`);

const directStorageUsers = [];
for (const entry of fs.readdirSync(scriptsRoot, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('.js')) continue;
  const relative = `src/scripts/${entry.name}`;
  if (/\b(?:localStorage|sessionStorage)\b/.test(read(relative))) directStorageUsers.push(relative);
}
assert(JSON.stringify(directStorageUsers) === JSON.stringify(['src/scripts/local-state-store.js']), `Only LocalStateStore may access browser storage directly; found ${directStorageUsers.join(', ')}`);

const questionShellFactories = [];
for (const entry of fs.readdirSync(scriptsRoot, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('.js')) continue;
  const relative = `src/scripts/${entry.name}`;
  if (/export function createQuestionShell\b/.test(read(relative))) questionShellFactories.push(relative);
}
assert(JSON.stringify(questionShellFactories) === JSON.stringify(['src/scripts/question-shell.js']), `QuestionShell must remain a single implementation; found ${questionShellFactories.join(', ')}`);

const localGraphImplementations = activityFiles.filter((relative) => /createElementNS\s*\(|getContext\s*\(/.test(read(relative)));
assert(localGraphImplementations.length === 0, `Topic activity adapters must not create parallel graph renderers: ${localGraphImplementations.join(', ')}`);

const appShell = read('src/scripts/app-shell.js');
assert(appShell.includes("from \"./question-shell.js\"") || appShell.includes("from './question-shell.js'"), 'AppShell must continue to consume the shared QuestionShell');
assert(appShell.includes("from \"./local-state-store.js\"") || appShell.includes("from './local-state-store.js'"), 'AppShell must continue to consume the shared LocalStateStore boundary');

console.log('PASS Step 81 code-reuse/performance cleanup invariants');
