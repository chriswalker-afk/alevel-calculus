import { getHelpTarget, getHelpTargets, getSupportTargetForMicroSkill, helpTargetOrder } from "../src/scripts/help-content.js";
import { learningModes } from "../src/scripts/sample-activities.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const topicId = "topic:y12:differentiation:basics";
const targets = getHelpTargets(topicId);
assert(targets.length === 3, "Basics should expose Understand, Memorise and AO1 support targets");
assert(JSON.stringify(targets.map((target) => target.need)) === JSON.stringify(helpTargetOrder), "Support target order should be canonical");

for (const target of targets) {
  assert(target.topicId === topicId, "Every support target should remain inside the current topic");
  assert(target.activityId.startsWith(`activity:y12:differentiation:basics:${target.mode}:`), "Activity ID should follow the Step 5 stable-ID contract");
  assert(target.microSkillId.startsWith("skill:y12:differentiation:basics:"), "Micro-skill ID should follow the Step 5 stable-ID contract");
  assert(target.route.startsWith(`/y12/differentiation/basics/${target.mode}/`), "Route should follow the Step 5 five-segment pattern");
  const existing = learningModes[target.mode]?.activities.some((activity) => activity.activityId === target.activityId);
  assert(existing, "Support target should resolve by stable activity ID to an existing sample activity");
}

assert(learningModes.understand.activities.some((activity) => activity.activityId === getHelpTarget(topicId, "understand")?.activityId), "Understand support should resolve to the canonical gradient-function activity");
assert(getHelpTarget(topicId, "memorise")?.activityId === learningModes.memorise.activities[0].activityId, "Memorise support should resolve to the existing notation-recall sample");
assert(getHelpTarget(topicId, "ao1")?.activityId === learningModes.ao1.activities[0].activityId, "AO1 support should resolve to the existing power-rule sample");
assert(getHelpTargets("topic:missing").length === 0, "Unknown topics should not invent placeholder support links");

const powerRuleMemorise = getSupportTargetForMicroSkill("skill:y12:differentiation:basics:power-rule", "memorise");
assert(powerRuleMemorise?.activityId === "activity:y12:differentiation:basics:memorise:power-rule-recall", "Diagnostic support should resolve the exact power-rule Memorise activity rather than the generic HelpDrawer target");
assert(powerRuleMemorise?.route === "/y12/differentiation/basics/memorise/power-rule-recall", "Diagnostic support should retain a canonical five-segment route");
assert(learningModes.memorise.activities.some((activity) => activity.activityId === powerRuleMemorise?.activityId), "Diagnostic support must resolve to an activity that actually exists");
assert(getSupportTargetForMicroSkill("skill:missing", "ao1") === null, "Unknown diagnostic micro-skills should not invent placeholder routes");

console.log("PASS HelpDrawer exact support target metadata");
