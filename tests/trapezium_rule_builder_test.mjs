import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  TRAPEZIUM_RULE_FUNCTIONS,
  buildCoefficientSummary,
  buildLongWayTerms,
  calculateTrapeziumRule,
  classifyTrapeziumBound,
  normalizeTrapeziumCount
} from "../src/scripts/trapezium-rule-builder.js";
import { createPolynomialFunctionDefinition } from "../src/scripts/linked-function-gradient-explorer.js";

const quadratic = createPolynomialFunctionDefinition({ id:"trap-test", label:"x²", coefficients:[0,0,1], xDomain:[0,2], yDomains:{function:[0,5],derivative:[0,5],secondDerivative:[0,3]} });
assert.equal(normalizeTrapeziumCount(0),1); assert.equal(normalizeTrapeziumCount(2.6),3); assert.equal(normalizeTrapeziumCount(99),24);
const two = calculateTrapeziumRule(quadratic,{lower:0,upper:2,n:2});
assert.equal(two.h,1); assert.deepEqual(two.ordinates.map(o=>o.y),[0,1,4]); assert.equal(two.trapezia.length,2); assert.equal(two.estimate,3); assert.ok(Math.abs(two.exactIntegral-8/3)<1e-7); assert.ok(Math.abs(two.percentageError-12.5)<1e-6);
assert.deepEqual(buildLongWayTerms(two),["½h(y0+y1)","½h(y1+y2)"]);
assert.deepEqual(buildCoefficientSummary(two).coefficients,[1,2,1]); assert.equal(buildCoefficientSummary(two).expression,"y0 + 2y1 + y2");
assert.equal(classifyTrapeziumBound(quadratic,0,2).kind,"overestimate");
const concave=TRAPEZIUM_RULE_FUNCTIONS.find(d=>d.id==="trapezium-concave"); assert.equal(classifyTrapeziumBound(concave,0,3).kind,"underestimate");
const mixed=TRAPEZIUM_RULE_FUNCTIONS.find(d=>d.id==="trapezium-inflection"); assert.equal(classifyTrapeziumBound(mixed,0,3).kind,"mixed");
const one=calculateTrapeziumRule(quadratic,{lower:0,upper:2,n:1}); assert.equal(one.trapezia[0].area,4);
const reversed=calculateTrapeziumRule(quadratic,{lower:2,upper:0,n:4}); assert.ok(reversed.h<0); assert.ok(reversed.estimate<0); assert.ok(reversed.exactIntegral<0);
assert.ok(TRAPEZIUM_RULE_FUNCTIONS.length>=3);
const root=path.resolve(import.meta.dirname,".."); const source=fs.readFileSync(path.join(root,"src/scripts/trapezium-rule-builder.js"),"utf8"); const css=fs.readFileSync(path.join(root,"src/styles/trapezium-rule-builder.css"),"utf8"); const demo=fs.readFileSync(path.join(root,"src/trapezium-rule-builder-demo.html"),"utf8");
assert.match(source,/from "\.\/diagram-primitives\.js"/); assert.match(source,/from "\.\/area-explorer\.js"/); assert.match(source,/from "\.\/linked-function-gradient-explorer\.js"/); assert.doesNotMatch(source,/createElementNS|<svg|canvas/i); assert.match(source,/shadedRegion\(/); assert.match(source,/One trapezium/); assert.match(source,/Two: add the long way/); assert.match(source,/Three: spot repeats/); assert.match(source,/Repeated interior ordinates give coefficient 2/); assert.match(source,/Percentage error/); assert.match(source,/Concavity changes on this interval/); assert.match(source,/exact integral &lt; trapezium estimate/); assert.match(source,/exact integral &gt; trapezium estimate/); assert.match(css,/@media\(max-width:980px\)/); assert.match(css,/@media\(max-width:720px\)/); assert.match(demo,/One rotated trapezium/); assert.match(demo,/Concavity-aware bounds/);
console.log("TrapeziumRuleBuilder tests passed.");
