import { learningModes } from '../src/scripts/sample-activities.js';
import { basicsDifferentiationTopic } from '../src/scripts/topic-content/basics-differentiation.js';
import { createPolynomialFunctionDefinition, niceYAxisTickStep, parsePolynomialExpression } from '../src/scripts/linked-function-gradient-explorer.js';
import fs from 'node:fs';

function assert(condition, message) { if (!condition) throw new Error(message); }
const understand = learningModes.understand.activities;
assert(understand.length === 8, 'Step 33 should expose exactly eight Understand activities.');
const expected = basicsDifferentiationTopic.activities.filter((activity) => activity.mode === 'understand' && activity.implementationStep === 33).map((activity) => activity.activityId);
assert(JSON.stringify(understand.map((activity) => activity.activityId)) === JSON.stringify(expected), 'Understand order must match Step 32 canonical metadata.');
assert(understand.every((activity) => activity.basicsUnderstand === true), 'Every Step 33 Understand activity should opt into the shared custom experience.');

const polynomial = createPolynomialFunctionDefinition({ id:'check', label:'x^3-3x', coefficients:[0,-3,0,1] });
assert(polynomial.evaluate(2) === 2, 'Polynomial helper should preserve ascending coefficient convention.');
assert(polynomial.derivative(2) === 9, 'Derivative helper should remain mathematically correct for Step 33 explorer reuse.');
const typed=parsePolynomialExpression('3x^4 - 2x + 7');
const typedDefinition=createPolynomialFunctionDefinition({id:'typed-check',label:typed.canonicalText,coefficients:typed.coefficients});
assert(typedDefinition.evaluate(2)===51,'Typed polynomial coefficients must feed the shared function evaluator correctly.');
assert(typedDefinition.derivative(2)===94,'Typed polynomial coefficients must feed the shared derivative evaluator correctly.');
assert(niceYAxisTickStep([-38,38])===10,'Large polynomial y-ranges should use sparse readable y-axis labels.');
assert(niceYAxisTickStep([-8,8])===2,'Ordinary y-ranges should retain useful axis detail.');

const source=fs.readFileSync(new URL('../src/scripts/basics-understand.js',import.meta.url),'utf8');
const shellSource=fs.readFileSync(new URL('../src/scripts/app-shell.js',import.meta.url),'utf8');
const cssSource=fs.readFileSync(new URL('../src/styles/basics-understand.css',import.meta.url),'utf8');
assert(source.includes('Type a polynomial'),'Basics polynomial explorer must expose a typed expression field.');
assert(source.includes('parsePolynomialExpression'),'Typed entry must use the shared safe polynomial parser.');
assert(source.includes('maxDegree: 6'),'Typed entry must retain the reasonable-degree guard.');
assert(source.includes('aria-invalid'),'Invalid typed expressions must be reported accessibly.');
assert(source.includes('Or edit the coefficients'),'Coefficient controls must remain as a synchronized fallback.');
assert(source.includes("dataset.basicsActivity"),'Basics Understand must expose the current activity to the responsive single-screen layout.');
assert(source.includes('basics-understand__coefficient-details'),'The polynomial coefficient fallback should be collapsed by default so the graph remains the primary desktop workspace.');
assert(source.includes("'x⁶'"),'Coefficient fallback must remain synchronized through the maximum supported degree.');
assert(source.includes('Show gradient') && source.includes('Hide gradient'),'Gradient-on-curve feedback must use an explicit reveal toggle.');
assert(source.includes('basics-understand__gradient-popin'),'Gradient-on-curve feedback must be embedded as an in-graph pop-in.');
assert(source.includes('sidebarHost'),'Basics Understand must support moving tangent-activity controls into the teaching column.');
assert(shellSource.includes('sidebarHost: activityCopy'),'AppShell must provide the left activity-copy column to Basics Understand.');
assert(cssSource.includes('.basics-understand__gradient-popin') && cssSource.includes('position:absolute'),'The gradient pop-in must overlay the graph rather than consume a separate row.');
assert(cssSource.includes('curve_tangent_gradient') && cssSource.includes('.linked-gradient-explorer__controls { display:none; }'),'The tangent activity should remove the redundant explorer toolbar from the graph area.');

console.log('PASS Basics Understand eight-state reference journey and linked polynomial contract');
