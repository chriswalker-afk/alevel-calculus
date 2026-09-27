import assert from 'node:assert/strict';
import fs from 'node:fs';
import { productQuotientChainTopic } from '../src/scripts/topic-content/product-quotient-chain.js';
import { productQuotientChainLearningModes } from '../src/scripts/product-quotient-chain-activities.js';
import { getVocabularyTerm } from '../src/scripts/vocabulary-data.js';
import { STRUCTURE_ROLES } from '../src/scripts/expression-structure-highlighter.js';
assert.equal(productQuotientChainTopic.scopeId,'y13-additional');
assert.equal(productQuotientChainTopic.routeScope,'y13');
assert.equal(productQuotientChainTopic.sequence,200);
assert.ok(productQuotientChainTopic.modes.includes('understand'));
assert.equal(productQuotientChainTopic.activities.filter(a=>a.mode==='understand').length,6);
assert.equal(productQuotientChainLearningModes.understand.activities.length,6);
const understandOrder=productQuotientChainLearningModes.understand.activities.map(a=>a.activityId);
assert.deepEqual(understandOrder,[
 'activity:y13:differentiation:product-quotient-chain:understand:rule-orientation',
 'activity:y13:differentiation:product-quotient-chain:understand:classify-structure',
 'activity:y13:differentiation:product-quotient-chain:understand:function-machines',
 'activity:y13:differentiation:product-quotient-chain:understand:inside-outside-builder',
 'activity:y13:differentiation:product-quotient-chain:understand:rule-application',
 'activity:y13:differentiation:product-quotient-chain:understand:nested-mixtures'
]);
for(const tag of productQuotientChainTopic.vocabularyTags) assert.ok(getVocabularyTerm(tag),tag);
for(const skill of productQuotientChainTopic.microSkills.filter(s=>s.supportTargets.understand)){const a=productQuotientChainTopic.activities.find(x=>x.activityId===skill.supportTargets.understand);assert.ok(a);assert.ok(a.microSkillIds.includes(skill.microSkillId));}
assert.equal(STRUCTURE_ROLES.inner,'Inside');assert.equal(STRUCTURE_ROLES.outer,'Outside');
const html=fs.readFileSync(new URL('../src/index.html',import.meta.url),'utf8');
const app=fs.readFileSync(new URL('../src/scripts/app-shell.js',import.meta.url),'utf8');
const understand=fs.readFileSync(new URL('../src/scripts/product-quotient-chain-understand.js',import.meta.url),'utf8');
const highlighter=fs.readFileSync(new URL('../src/scripts/expression-structure-highlighter.js',import.meta.url),'utf8');
assert.match(html,/topic:y13:differentiation:product-quotient-chain/);assert.match(html,/topic-index">20/);assert.match(html,/product-quotient-chain-understand\.css/);
assert.match(app,/productQuotientChainLearningModes/);assert.match(app,/productQuotientChainUnderstand\.render/);
assert.match(understand,/product.*quotient.*composite.*mixture/s);assert.match(understand,/f\(g\(x\)\)/);assert.match(understand,/g\(f\(x\)\)/);assert.match(understand,/renderEquationSteps/);assert.match(understand,/decorateExpression/);assert.match(understand,/v begins the numerator/);assert.match(understand,/v²/);assert.match(understand,/dy\/dx =/);assert.match(understand,/outer structure first/i);
assert.match(highlighter,/applyStructuredExpression/);assert.match(highlighter,/structureRole/);
console.log('PASS Step 52 product/quotient/chain structure classification, composition machines and persistent labelled rule highlighting');
