import { learningModes } from '../src/scripts/sample-activities.js';
import { basicsDifferentiationTopic } from '../src/scripts/topic-content/basics-differentiation.js';
import { createPolynomialFunctionDefinition, parsePolynomialExpression } from '../src/scripts/linked-function-gradient-explorer.js';
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

const source=fs.readFileSync(new URL('../src/scripts/basics-understand.js',import.meta.url),'utf8');
assert(source.includes('Type a polynomial'),'Basics polynomial explorer must expose a typed expression field.');
assert(source.includes('parsePolynomialExpression'),'Typed entry must use the shared safe polynomial parser.');
assert(source.includes('maxDegree: 6'),'Typed entry must retain the reasonable-degree guard.');
assert(source.includes('aria-invalid'),'Invalid typed expressions must be reported accessibly.');
assert(source.includes('Or edit the coefficients'),'Coefficient controls must remain as a synchronized fallback.');
assert(source.includes("'x⁶'"),'Coefficient fallback must remain synchronized through the maximum supported degree.');

console.log('PASS Basics Understand eight-state reference journey and linked polynomial contract');
