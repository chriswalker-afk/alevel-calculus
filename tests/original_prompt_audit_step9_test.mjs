import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { productQuotientChainTopic } from '../src/scripts/topic-content/product-quotient-chain.js';
import { productQuotientChainLearningModes } from '../src/scripts/product-quotient-chain-activities.js';

const ids=productQuotientChainLearningModes.understand.activities.map(activity=>activity.activityId);
const orientation='activity:y13:differentiation:product-quotient-chain:understand:rule-orientation';
const classify='activity:y13:differentiation:product-quotient-chain:understand:classify-structure';
const machines='activity:y13:differentiation:product-quotient-chain:understand:function-machines';
const builder='activity:y13:differentiation:product-quotient-chain:understand:inside-outside-builder';
const formal='activity:y13:differentiation:product-quotient-chain:understand:rule-application';
const mixed='activity:y13:differentiation:product-quotient-chain:understand:nested-mixtures';

assert.equal(ids[0],orientation,'Students must meet the three rule names and purposes before classification.');
assert.equal(ids[1],classify,'Structure classification must remain immediately after the orientation page.');
assert(ids.indexOf(machines)>ids.indexOf(classify));
assert(ids.indexOf(builder)>ids.indexOf(machines));
assert(ids.indexOf(builder)<ids.indexOf(formal),'Both composition interactions must occur before formal chain-rule execution.');
assert(ids.indexOf(formal)<ids.indexOf(mixed),'The existing formal-rule page must remain before mixed structures.');

const metadataIds=productQuotientChainTopic.activities.filter(activity=>activity.mode==='understand').map(activity=>activity.activityId);
assert.deepEqual(metadataIds,ids,'Topic metadata and live Understand ordering must remain identical.');

const source=readFileSync(new URL('../src/scripts/product-quotient-chain-understand.js',import.meta.url),'utf8');
const orientationStart=source.indexOf(' render_rule_orientation(){');
const classificationStart=source.indexOf(' render_classify_structure(){',orientationStart);
const machinesStart=source.indexOf(' render_function_machines(){',classificationStart);
const builderStart=source.indexOf(' render_inside_outside_builder(){',machinesStart);
const formalStart=source.indexOf(' render_rule_application(){',builderStart);
const mixedStart=source.indexOf(' render_nested_mixtures(){',formalStart);
assert(orientationStart>=0&&classificationStart>orientationStart&&machinesStart>classificationStart&&builderStart>machinesStart&&formalStart>builderStart&&mixedStart>formalStart);

const orientationSource=source.slice(orientationStart,classificationStart);
assert.match(orientationSource,/Product rule/);
assert.match(orientationSource,/Quotient rule/);
assert.match(orientationSource,/Chain rule/);
assert.match(orientationSource,/two functions are multiplied/i);
assert.match(orientationSource,/one function is divided by another/i);
assert.match(orientationSource,/one function is inside another/i);
assert.match(orientationSource,/\(x² \+ 1\)eˣ/);
assert.match(orientationSource,/sin x \/ \(x \+ 2\)/);
assert.match(orientationSource,/sin\(3x² \+ 1\)/);
assert.doesNotMatch(orientationSource,/u′v|uv′|vu′|v²|f′\(|g′\(|dy\/dx|dy\/du/,'The opening orientation must not reveal a formal differentiation-rule formula.');

const machinesSource=source.slice(machinesStart,builderStart);
assert.match(machinesSource,/f\(g\(x\)\)/);
assert.match(machinesSource,/g\(f\(x\)\)/);
assert.match(machinesSource,/function machines|Inside:/i);

const builderSource=source.slice(builderStart,formalStart);
assert.match(builderSource,/COMPOSITES/);
assert.match(builderSource,/inside function/i);
assert.match(builderSource,/outside function/i);
assert.match(builderSource,/Check inside and outside/);
assert.match(builderSource,/Next composite/);
assert.match(builderSource,/No differentiation is needed yet/);
assert.doesNotMatch(builderSource,/u′v|vu′|f′\(|g′\(|dy\/dx/,'The second composition interaction must still precede formal chain-rule execution.');

const formalSource=source.slice(formalStart,mixedStart);
assert.match(formalSource,/RULE_WORKED_EXAMPLES/,'The formal-rule page must still render the three formal rule definitions.');
assert.match(source,/y′ = u′v \+ uv′/,'The existing formal product rule must be preserved.');
assert.match(source,/y′ = \(vu′ − uv′\)\/v²/,'The existing formal quotient rule must be preserved.');
assert.match(source,/dy\/dx = f′\(g\(x\)\) · g′\(x\)/,'The existing formal chain rule must be preserved.');

console.log('PASS Original-prompt audit Step 9 PQC orientation, classification and two-stage composition sequence');
