import { createPolynomialFunctionDefinition } from "./linked-function-gradient-explorer.js";
import { calculateAreaState, integrateFunction, findRoots } from "./area-explorer.js";

export const SIGNED_AREA_FUNCTIONS = Object.freeze([
  createPolynomialFunctionDefinition({
    id: "signed-area-line",
    label: "Line: x",
    coefficients: [0, 1],
    xDomain: [-3, 3],
    yDomains: { function: [-4, 4], derivative: [0, 2], secondDerivative: [-1, 1] },
    initialX: 0,
    description: "Equal positive and negative triangular regions make cancellation easy to see."
  }),
  createPolynomialFunctionDefinition({
    id: "signed-area-quadratic",
    label: "Quadratic: x² − 1",
    coefficients: [-1, 0, 1],
    xDomain: [-3, 3],
    yDomains: { function: [-2, 9], derivative: [-7, 7], secondDerivative: [0, 3] },
    initialX: 0,
    description: "Crosses at x=-1 and x=1, producing positive and negative signed regions."
  }),
  createPolynomialFunctionDefinition({
    id: "signed-area-cubic",
    label: "Cubic: x³ − 4x",
    coefficients: [0, -4, 0, 1],
    xDomain: [-3, 3],
    yDomains: { function: [-16, 16], derivative: [-5, 24], secondDerivative: [-20, 20] },
    initialX: 0,
    description: "Three roots create alternating signed contributions."
  })
]);

export function signedAreaState(definition, lower, upper, splitPoints = []) {
  return calculateAreaState(definition, { lower, upper, splitPoints });
}

export function signedContribution(definition, lower, upper) {
  return integrateFunction(definition, lower, upper);
}

export function requiredRootSplits(definition, lower, upper) {
  const min = Math.min(lower, upper);
  const max = Math.max(lower, upper);
  return Object.freeze(findRoots(definition, min, max).filter((root) => root > min + 1e-7 && root < max - 1e-7));
}

export function totalGeometricalArea(definition, lower, upper) {
  return calculateAreaState(definition, { lower, upper }).geometricArea;
}

export function compareSignedAndGeometrical(definition, lower, upper) {
  const state = calculateAreaState(definition, { lower, upper });
  return Object.freeze({
    integral: state.integral,
    geometricalArea: state.geometricArea,
    roots: state.roots,
    regions: state.regions
  });
}
