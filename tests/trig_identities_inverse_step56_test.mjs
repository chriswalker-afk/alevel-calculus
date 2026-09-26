import assert from 'node:assert/strict'; import fs from 'node:fs';
import { trigIdentitiesInverseTopic } from '../src/scripts/topic-content/trig-identities-inverse.js';
import { trigIdentitiesInverseLearningModes } from '../src/scripts/trig-identities-inverse-activities.js';
import { getQuestionSetDefinitionForActivity } from '../src/scripts/question-catalogue.js';
import { createGeneratorRunner } from '../src/scripts/generator-runner.js';
import { getMemoryItemsForTopic } from '../src/scripts/memory-content.js';
import { getMemoryGamePackForTopic } from '../src/scripts/memory-game-content.js';
import { getMemoryReviewPackForTopic } from '../src/scripts/memory-review-content.js';
import { getSupportTargetForMicroSkill } from '../src/scripts/help-content.js';
assert.equal(trigIdentitiesInverseTopic.sequence,230);
assert.deepEqual(trigIdentitiesInverseTopic.modes,['understand','memorise','ao1','ao2','ao3']);
assert.deepEqual(Object.keys(trigIdentitiesInverseLearningModes),['understand','memorise','ao1','ao2','ao3']);
assert.ok(trigIdentitiesInverseTopic.vocabularyTags.includes('vocab:inverse-function'));
assert.ok(trigIdentitiesInverseTopic.vocabularyTags.includes('vocab:reciprocal-function'));
for(const [skill,needs] of Object.entries({
 'inverse-vs-reciprocal':['understand','memorise','ao1'],
 'restricted-domain':['understand','memorise','ao1'],
 'further-trig-derivatives':['understand','memorise','ao1'],
 'inverse-derivative':['understand','memorise','ao1'],
 'inverse-trig-derivatives':['understand','memorise','ao1'],
 'rewrite-differentiate-identity-simplify':['understand','memorise','ao1'],
 'mixed-trig':['understand','memorise','ao1']
})) for(const need of needs) assert.ok(getSupportTargetForMicroSkill(`skill:y13:differentiation:trig-identities-inverse:${skill}`,need),`${skill}:${need}`);
const ids=['ao1:classify-notation','ao1:further-trig','ao1:inverse-relationship','ao1:inverse-trig','ao1:mixed','ao2:explain-notation','ao2:explain-identity','ao2:diagnose-chain','ao3:applications'].map(x=>`activity:y13:differentiation:trig-identities-inverse:${x}`);
const runner=createGeneratorRunner({debugSeed:'step56'}); for(const id of ids){const set=getQuestionSetDefinitionForActivity(id); assert.ok(set,id); for(const d of set.definitions){const q=runner.generate(d); assert.ok(q.prompt); assert.ok(q.solutionSteps.length>=2); assert.equal(q.metadata.assessmentObjective,id.split(':')[4]);}}
const further=getQuestionSetDefinitionForActivity('activity:y13:differentiation:trig-identities-inverse:ao1:further-trig').definitions[0]; assert.ok(further.errorCategories.includes('missing-chain-factor'));
const memory=getMemoryItemsForTopic('topic:y13:differentiation:trig-identities-inverse'); assert.ok(memory.length>=14); assert.ok(memory.some(i=>i.learn.notation?.includes('Rewrite → Differentiate → Identity → Simplify')));
assert.ok(getMemoryGamePackForTopic('topic:y13:differentiation:trig-identities-inverse')); assert.ok(getMemoryReviewPackForTopic('topic:y13:differentiation:trig-identities-inverse'));
const src=fs.readFileSync(new URL('../src/scripts/trig-identities-inverse-understand.js',import.meta.url),'utf8');
for(const needle of ['sin⁻¹x = arcsin x','(sin x)⁻¹ = 1/sin x = cosec x','Restrict first; only then reflect','dy/dx = 1/(dx/dy)','Rewrite','Differentiate','Identity','Simplify','d/dx[tan x] = sec²x']) assert.ok(src.includes(needle),needle);
assert.match(src,/DiagramPrimitives/); assert.match(src,/renderEquationSteps/); assert.match(src,/Math\.asin/);
const html=fs.readFileSync(new URL('../src/index.html',import.meta.url),'utf8'); assert.match(html,/topic:y13:differentiation:trig-identities-inverse/); assert.match(html,/trig-identities-inverse-understand\.css/);
console.log('PASS Step 56 inverse-vs-reciprocal notation, restricted-domain inverse visuals, further trig/inverse derivations, Memory Lab, diagnostics and AO1-AO3 contracts');
