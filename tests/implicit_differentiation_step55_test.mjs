import assert from 'node:assert/strict'; import fs from 'node:fs';
import { implicitDifferentiationTopic } from '../src/scripts/topic-content/implicit-differentiation.js';
import { implicitDifferentiationLearningModes } from '../src/scripts/implicit-differentiation-activities.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';
import { getMemoryItemsForTopic } from '../src/scripts/memory-content.js';
import { getSupportTargetForMicroSkill } from '../src/scripts/help-content.js';
assert.equal(implicitDifferentiationTopic.sequence,220); assert.deepEqual(implicitDifferentiationTopic.modes,['understand','memorise','ao1','ao2','ao3']);
assert.deepEqual(Object.keys(implicitDifferentiationLearningModes),['understand','memorise','ao1','ao2','ao3']);
for(const skill of ['classify-forms','y-chain-rule','term-by-term','rearrange-dydx']) for(const need of ['understand','memorise','ao1']) assert.ok(getSupportTargetForMicroSkill(`skill:y13:differentiation:implicit-differentiation:${skill}`,need),`${skill}:${need}`);
const ids=['ao1:classify','ao1:differentiate-y-terms','ao1:full-method','ao1:rearrange','ao2:explain-dydx','ao2:explain-both-sides','ao2:diagnose-errors','ao3:applications'].map(x=>`activity:y13:differentiation:implicit-differentiation:${x}`);
const runner=createGeneratorRunner({debugSeed:'step55'}); for(const id of ids){const set=getQuestionSetDefinitionForActivity(id); assert.ok(set,id); for(const d of set.definitions){const q=runner.generate(d); assert.ok(q.prompt); assert.ok(q.solutionSteps.length>=2);}}
const diag=getQuestionSetDefinitionForActivity('activity:y13:differentiation:implicit-differentiation:ao2:diagnose-errors').definitions[0]; assert.ok(diag.errorCategories.includes('missing-dydx')); assert.ok(diag.errorCategories.includes('product-rule'));
const memory=getMemoryItemsForTopic('topic:y13:differentiation:implicit-differentiation'); assert.ok(memory.length>=7); assert.ok(memory.some(i=>i.learn.notation?.includes('dy/dx')));
const src=fs.readFileSync(new URL('../src/scripts/implicit-differentiation-understand.js',import.meta.url),'utf8'); assert.match(src,/unlock\.disabled=true/); assert.match(src,/state\.size!==terms\.length/); assert.match(src,/2y dy\/dx/); assert.match(src,/product rule/i);
const html=fs.readFileSync(new URL('../src/index.html',import.meta.url),'utf8'); assert.match(html,/topic:y13:differentiation:implicit-differentiation/); assert.match(html,/implicit-differentiation-understand\.css/);
console.log('PASS Step 55 explicit/implicit classification, gated term-by-term workflow, y-chain cue, diagnostics, Memory Lab and AO1-AO3 contracts');
