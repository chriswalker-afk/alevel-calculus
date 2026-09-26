import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  getTopicObjectiveConfig,
  listTopicObjectiveConfigs,
  topicObjectiveCount
} from "../src/scripts/topic-objectives-data.js";
import { basicsDifferentiationTopic } from "../src/scripts/topic-content/basics-differentiation.js";
import { preCalculusTopic } from "../src/scripts/topic-content/pre-calculus.js";
import { year12ReviewTopic } from "../src/scripts/topic-content/year12-review.js";
import { fullCalculusMasteryTopic } from "../src/scripts/topic-content/full-calculus-mastery.js";

const configs=listTopicObjectiveConfigs();
assert.equal(topicObjectiveCount,33,"The objective registry must cover all 33 registered topics.");
assert.equal(configs.length,33);
assert.equal(new Set(configs.map((entry)=>entry.topicId)).size,33,"Topic objective IDs must be unique.");

const usefulVerbs=/^(adjust|apply|bring|build|calculate|carry|check|choose|classify|collect|combine|compare|complete|confirm|connect|construct|convert|decide|derive|determine|diagnose|differentiate|distinguish|evaluate|execute|explain|find|form|handle|identify|include|integrate|interpret|orient|read|recognise|recognize|reverse|rewrite|select|separate|solve|split|substitute|track|transform|translate|treat|use|write)/i;
for(const entry of configs){
  assert.ok(entry.objectives.length>=3 && entry.objectives.length<=6,entry.topicId+" should have 3–6 objectives.");
  assert.equal(new Set(entry.objectives).size,entry.objectives.length,entry.topicId+" objectives should not repeat.");
  for(const objective of entry.objectives){
    assert.ok(objective.trim().length>=24,entry.topicId+" objective is too vague: "+objective);
    assert.ok(usefulVerbs.test(objective),entry.topicId+" should begin objectives with student-facing action verbs: "+objective);
    assert.doesNotMatch(objective,/^(understand|know|learn about)\b/i,entry.topicId+" should avoid vague objective verbs.");
  }
}

assert.equal(basicsDifferentiationTopic.objectives,getTopicObjectiveConfig(basicsDifferentiationTopic.topicId).objectives);
assert.equal(preCalculusTopic.objectiveKind,"teaching");
assert.match(preCalculusTopic.objectiveHeading,/In this topic you will learn to/);
assert.equal(year12ReviewTopic.objectiveKind,"review");
assert.match(year12ReviewTopic.objectiveHeading,/In this review you will bring together/);
assert.equal(fullCalculusMasteryTopic.objectiveKind,"mastery");
assert.match(fullCalculusMasteryTopic.objectiveHeading,/In this mastery section you will/);

const appShell=readFileSync(new URL("../src/scripts/app-shell.js",import.meta.url),"utf8");
const html=readFileSync(new URL("../src/index.html",import.meta.url),"utf8");
const css=readFileSync(new URL("../src/styles/app-shell.css",import.meta.url),"utf8");
for(const entry of configs){
  assert.ok(appShell.includes(entry.topicId),"Runtime is missing "+entry.topicId+".");
}
assert.match(appShell,/syncInlineTopicObjectives/);
assert.match(appShell,/isFirstUnderstand/);
assert.match(appShell,/isLastUnderstand/);
assert.match(appShell,/openTopicGoals/);
assert.match(html,/data-topic-goals-trigger/);
assert.match(html,/data-topic-objectives-inline/);
assert.match(html,/data-topic-goals-dialog/);
assert.match(css,/topic-objectives-card--inline/);
assert.match(css,/grid-column:\s*1\s*\/\s*-1/);
assert.match(css,/topic-goals-dialog/);
assert.match(css,/@media \(max-width: 680px\)/);

console.log("PASS topic objectives: all 33 topics have student-facing goals, review/mastery wording, intro/recap rendering and reusable access.");
