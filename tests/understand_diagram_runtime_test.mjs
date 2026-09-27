import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const appShell = read("src/scripts/app-shell.js");
const html = read("src/index.html");
const css = read("src/styles/app-shell.css");

const experiences = [
  "basicsUnderstand",
  "preCalculusUnderstand",
  "firstPrinciplesUnderstand",
  "tangentsNormalsUnderstand",
  "stationaryPointsUnderstand",
  "increasingDecreasingUnderstand",
  "integrationIntroUnderstand",
  "definiteIndefiniteUnderstand",
  "integrationAreaUnderstand",
  "signedAreaUnderstand",
  "standardFunctionsUnderstand",
  "trigFirstPrinciplesUnderstand",
  "productQuotientChainUnderstand",
  "parametricDifferentiationUnderstand",
  "implicitDifferentiationUnderstand",
  "trigIdentitiesInverseUnderstand",
  "concavityInflectionUnderstand",
  "connectedRatesUnderstand",
  "standardIntegralsUnderstand",
  "reverseChainRuleUnderstand",
  "trigIdentityIntegrationUnderstand",
  "substitutionUnderstand",
  "integrationByPartsUnderstand",
  "partialFractionsUnderstand",
  "year13AreasUnderstand",
  "parametricAreaUnderstand",
  "limitOfSumUnderstand",
  "numericalIntegrationUnderstand",
  "differentialEquationsUnderstand",
  "calculusModellingUnderstand"
];

assert.match(appShell, /const understandExperiences = Object\.freeze\(\[/);
for (const experience of experiences) {
  assert.ok(appShell.includes(experience), `Shared Understand dispatch is missing ${experience}.`);
}
assert.match(appShell, /currentTopicRuntime\(\)\.understandExperience/);
assert.match(appShell, /understandExperience\.render\(activity\.activityId\)/);
assert.match(appShell, /destroyUnderstandExperiences\(\{ except: understandExperience \}\)/);

assert.match(html, /data-understand-visual-host/);
for (const stylesheet of [
  "family-of-curves-explorer.css",
  "area-explorer.css",
  "rectangle-sum-explorer.css"
]) {
  assert.ok(html.includes(stylesheet), `Main AppShell must load ${stylesheet}.`);
}

assert.match(css, /data-custom-understand-active="true"[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/);
assert.match(css, /data-custom-understand-active="true"[\s\S]*?\.math-placeholder[\s\S]*?height:\s*auto/);
assert.match(css, /data-custom-understand-active="true"[\s\S]*?\.math-placeholder[\s\S]*?overflow:\s*visible/);
assert.match(css, /\.understand-visual-host\s*\{[\s\S]*?min-width:\s*0/);
assert.match(css, /@media \(max-width: 820px\)[\s\S]*?linked-gradient-explorer__graphs[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\)/);

console.log("Understand diagram runtime audit passed.");
