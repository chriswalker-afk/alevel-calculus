import { learningModes } from '../src/scripts/sample-activities.js';
import { basicsDifferentiationTopic } from '../src/scripts/topic-content/basics-differentiation.js';
import { createPolynomialFunctionDefinition } from '../src/scripts/linked-function-gradient-explorer.js';

function assert(condition, message) { if (!condition) throw new Error(message); }
const understand = learningModes.understand.activities;
assert(understand.length === 8, 'Step 33 should expose exactly eight Understand activities.');
const expected = basicsDifferentiationTopic.activities.filter((activity) => activity.mode === 'understand' && activity.implementationStep === 33).map((activity) => activity.activityId);
assert(JSON.stringify(understand.map((activity) => activity.activityId)) === JSON.stringify(expected), 'Understand order must match Step 32 canonical metadata.');
assert(understand.every((activity) => activity.basicsUnderstand === true), 'Every Step 33 Understand activity should opt into the shared custom experience.');

const polynomial = createPolynomialFunctionDefinition({ id:'check', label:'x^3-3x', coefficients:[0,-3,0,1] });
assert(polynomial.evaluate(2) === 2, 'Polynomial helper should preserve ascending coefficient convention.');
assert(polynomial.derivative(2) === 9, 'Derivative helper should remain mathematically correct for Step 33 explorer reuse.');

console.log('PASS Basics Understand eight-state reference journey and linked polynomial contract');
