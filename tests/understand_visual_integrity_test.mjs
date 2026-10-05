import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const appShell = readFileSync(new URL("../src/scripts/app-shell.js", import.meta.url), "utf8");
const sourceHtml = readFileSync(new URL("../src/index.html", import.meta.url), "utf8");
const productionHtml = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const appCss = readFileSync(new URL("../src/styles/app-shell.css", import.meta.url), "utf8");
const diagramSource = readFileSync(new URL("../src/scripts/diagram-primitives.js", import.meta.url), "utf8");

const created = [...appShell.matchAll(/const\s+(\w+Understand)\s*=\s*create\w+UnderstandExperience\(customUnderstandHost(?:,[^)]*)?\)/g)]
  .map((match) => match[1]);
assert.ok(created.length >= 30, `Expected the complete Understand renderer set; found ${created.length}.`);

const registryStart = appShell.indexOf("const understandExperiences = Object.freeze([");
const registryEnd = appShell.indexOf("]);", registryStart);
assert.ok(registryStart >= 0 && registryEnd > registryStart, "Understand renderer registry must exist.");
const registry = appShell.slice(registryStart, registryEnd);
for (const renderer of created) {
  assert.ok(registry.includes(renderer), `${renderer} is instantiated but missing from the shared Understand renderer registry.`);
  assert.ok(appShell.includes(`understandExperience: ${renderer}`), `${renderer} is not reachable from topic runtime.`);
}

assert.match(appShell, /currentTopicRuntime\(\)\.understandExperience/);
assert.match(appShell, /understandExperience\?\.supports\?\.\(activity\.activityId\)/);
assert.match(appShell, /understandExperience\.render\(activity\.activityId\)/);
assert.doesNotMatch(appShell, /const customBasicsUnderstand/);

for (const html of [sourceHtml, productionHtml]) {
  assert.match(html, /data-understand-visual-host/);
  for (const stylesheet of [
    "area-explorer.css",
    "family-of-curves-explorer.css",
    "rectangle-sum-explorer.css"
  ]) {
    assert.ok(html.includes(stylesheet), `Missing shared explorer stylesheet: ${stylesheet}`);
  }
}

assert.match(appCss, /data-custom-understand-active="true"/);
assert.match(appCss, /data-custom-understand-active="true"[\s\S]*\.math-placeholder[\s\S]*height:\s*auto/);
assert.match(appCss, /data-custom-understand-active="true"[\s\S]*\.math-placeholder[\s\S]*overflow:\s*visible/);
assert.match(appCss, /\.understand-visual-host\[hidden\]\s*\{\s*display:\s*none/);
assert.match(appCss, /html\[data-learning-mode="understand"\][\s\S]*\.activity-copy > \.activity-overline[\s\S]*display:\s*none/, "Understand pages must not repeat the activity title as an overline.");
assert.match(appCss, /data-custom-understand-active="true"[\s\S]*> \.activity-copy > h2[\s\S]*display:\s*none/, "Custom Understand visuals must own the single visible activity title.");
assert.match(appCss, /\.understand-visual-host \[class\$="__eyebrow"\][\s\S]*display:\s*none/, "Custom Understand primary headings must not be repeated by an internal eyebrow label.");

assert.match(diagramSource, /preserveAspectRatio:\s*"xMidYMid meet"/);
assert.match(diagramSource, /const scale = Math\.min\(rect\.width \/ this\.width, rect\.height \/ this\.height\)/);
assert.doesNotMatch(diagramSource, /preserveAspectRatio:\s*"none"/);
assert.match(diagramSource, /aspectRatio = "5 \/ 3"/);

console.log(`PASS Understand visual integrity: ${created.length} renderers registered, shared explorer CSS loaded, custom visuals unclipped, SVG geometry preserved.`);
