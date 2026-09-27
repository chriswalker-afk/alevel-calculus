import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { RULE_WORKED_EXAMPLES } from '../src/scripts/product-quotient-chain-understand.js';
import { getMemoryItemsForTopic } from '../src/scripts/memory-content.js';
import { productQuotientChainTopic } from '../src/scripts/topic-content/product-quotient-chain.js';
import { quotientRuleDefinition, quotientErrorDefinition } from '../src/scripts/question-definitions/product-quotient-chain-assessment.js';

const product=RULE_WORKED_EXAMPLES.product;
const quotient=RULE_WORKED_EXAMPLES.quotient;
const chain=RULE_WORKED_EXAMPLES.chain;

assert(product&&quotient&&chain,'All three rules need a worked interactive definition.');
assert.match(product.cue,/Differentiate the first, leave the second; then vice versa; add\./);
assert.match(chain.cue,/Identify inside\/outside\. Differentiate the outside while leaving the inside in place, then multiply by the inside derivative\./);
assert.match(quotient.cue,/Fix u and v first/);
assert.match(quotient.cue,/v in the denominator is the v that begins the numerator/);
assert.match(quotient.cue,/same v appears squared in the denominator/);
assert.match(quotient.cue,/v u′ − u v′/);

for(const [name,config] of Object.entries(RULE_WORKED_EXAMPLES)){
  assert(config.slots.length>=2,`${name} needs student-selected formula pieces`);
  assert(config.slots.every(slot=>slot.correct&&slot.options.includes(slot.correct)),`${name} slots need a selectable correct piece`);
  assert(config.steps.some(step=>/Completed derivative/i.test(step.label)),`${name} must reveal a completed derivative after assembly`);
}

const understand=readFileSync(new URL('../src/scripts/product-quotient-chain-understand.js',import.meta.url),'utf8');
const formalStart=understand.indexOf(' render_rule_application(){');
const mixedStart=understand.indexOf(' render_nested_mixtures(){',formalStart);
const formalSource=understand.slice(formalStart,mixedStart);
assert.match(formalSource,/cfg\.slots/,'The formal-rule page must render actionable slots for each rule.');
assert.match(formalSource,/Check assembled rule/);
assert.match(formalSource,/reveal\.hidden=true/,'The completed derivative must begin hidden.');
assert.match(formalSource,/if\(wrong\.length\)/,'Incorrect assemblies must be rejected before reveal.');
assert.match(formalSource,/reveal\.hidden=false/,'A correct assembly must reveal the worked derivative.');
assert.match(formalSource,/quotient numerator order is reversed/i,'The interactive must target reversed quotient order explicitly.');
assert.match(formalSource,/same v=x\+1 is squared below/i,'The interactive must target the quotient denominator square explicitly.');
assert.match(formalSource,/renderEquationSteps/,'Correct assembly should reveal the existing worked-step renderer.');

const memory=getMemoryItemsForTopic(productQuotientChainTopic.topicId);
const productMemory=memory.find(item=>item.id.endsWith(':product-rule'));
const quotientMemory=memory.find(item=>item.id.endsWith(':quotient-rule'));
const quotientOrderMemory=memory.find(item=>item.id.endsWith(':quotient-order'));
const chainMemory=memory.find(item=>item.id.endsWith(':chain-rule'));
assert.match(productMemory.learn.statement,/Differentiate the first, leave the second; then vice versa; add\./);
assert.match(chainMemory.learn.statement,/Identify inside and outside\. Differentiate the outside while leaving the inside in place, then multiply by the inside derivative\./);
assert.match(quotientMemory.learn.statement,/denominator v begins the derivative numerator as v u′/);
assert.match(quotientMemory.learn.statement,/same v appears squared in the denominator/);
assert.match(quotientOrderMemory.learn.statement,/Fix u\/v first/);
assert.match(quotientOrderMemory.learn.statement,/Reversing the numerator terms changes the sign/);

assert(quotientRuleDefinition.errorCategories.includes('quotient-order'));
assert(quotientRuleDefinition.errorCategories.includes('denominator-square'));
assert(quotientErrorDefinition.errorCategories.includes('quotient-order'));
assert(quotientErrorDefinition.errorCategories.includes('denominator-square'));

const ao1Order=productQuotientChainTopic.activities.filter(activity=>activity.mode==='ao1').map(activity=>activity.slug);
assert.deepEqual(ao1Order,['product-rule','quotient-rule','chain-rule','mixed-one-rule','mixed-multi-rule'],'Individual product, quotient and chain fluency must remain before mixed-rule sets.');

const assessment=readFileSync(new URL('../src/scripts/question-definitions/product-quotient-chain-assessment.js',import.meta.url),'utf8');
assert.match(assessment,/denominator v must begin the numerator as v u′, then subtract u v′/i);
assert.match(assessment,/same denominator function v.*v²/i);

console.log('PASS Original-prompt audit Step 10 quick-method cues, interactive rule assembly and quotient-order diagnostics');
