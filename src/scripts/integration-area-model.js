import { createPolynomialFunctionDefinition } from "./linked-function-gradient-explorer.js";
import { integrateFunction } from "./area-explorer.js";
import { differenceFromZero } from "./definite-indefinite-model.js";

export const INTEGRATION_AREA_POSITIVE_FUNCTIONS = Object.freeze([
  createPolynomialFunctionDefinition({
    id: "integration-area-linear",
    label: "Positive line: x + 1",
    coefficients: [1, 1],
    xDomain: [0, 4],
    yDomains: { function: [0, 6], derivative: [0, 2], secondDerivative: [-1, 1] },
    initialX: 2,
    description: "A positive linear function for interpreting a definite integral as an ordinary area."
  }),
  createPolynomialFunctionDefinition({
    id: "integration-area-quadratic",
    label: "Positive curve: 1 + ½x²",
    coefficients: [1, 0, 0.5],
    xDomain: [0, 4],
    yDomains: { function: [0, 10], derivative: [0, 5], secondDerivative: [0, 2] },
    initialX: 2,
    description: "A positive curved function for changing the upper and lower limits."
  }),
  createPolynomialFunctionDefinition({
    id: "integration-area-bowl",
    label: "Positive bowl: 4 − x + ¼x²",
    coefficients: [4, -1, 0.25],
    xDomain: [0, 4],
    yDomains: { function: [0, 6], derivative: [-2, 2], secondDerivative: [0, 1] },
    initialX: 2,
    description: "A positive function whose shaded area changes non-linearly with the interval."
  })
]);

export function accumulatedFromZero(definition, x) {
  return integrateFunction(definition, 0, x);
}

export function removalIdentityState(definition, a, b) {
  const toB = accumulatedFromZero(definition, b);
  const toA = accumulatedFromZero(definition, a);
  const difference = differenceFromZero(toB, toA);
  const direct = integrateFunction(definition, a, b);
  return Object.freeze({ a, b, toB, toA, difference, direct });
}

export function adjacentIntervalState(definition, a, b, c) {
  const whole = integrateFunction(definition, a, c);
  const left = integrateFunction(definition, a, b);
  const right = integrateFunction(definition, b, c);
  return Object.freeze({ a, b, c, whole, left, right, sum: left + right });
}

export function reversedIntervalState(definition, a, b) {
  const forward = integrateFunction(definition, a, b);
  const reversed = integrateFunction(definition, b, a);
  return Object.freeze({ a, b, forward, reversed });
}
