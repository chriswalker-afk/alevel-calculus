import assert from "node:assert/strict";
import { basicsDifferentiationGamePack, getMemoryGamePackForTopic } from "../src/scripts/memory-game-content.js";
import { createBuildRuleRound, isBuildRuleCorrect } from "../src/scripts/build-rule-engine.js";
import { createMissingPieceRound, isMissingPieceCorrect } from "../src/scripts/missing-piece-engine.js";
import { createSortRound, scoreSortAssignments } from "../src/scripts/sort-engine.js";
import { createImpostorRound, isImpostorCorrect } from "../src/scripts/impostor-engine.js";

const pack = getMemoryGamePackForTopic("topic:y12:differentiation:basics");
assert.equal(pack, basicsDifferentiationGamePack);
assert.equal(Object.isFrozen(pack), true);

const build = createBuildRuleRound(pack.build);
assert.equal(Object.isFrozen(build), true);
assert.equal(isBuildRuleCorrect([...build.answer], build.answer), true);
assert.equal(isBuildRuleCorrect([...build.answer].reverse(), build.answer), false);
assert.equal(build.tokens.length >= build.answer.length + 1, true, "Build needs distractor tokens");

const missing = createMissingPieceRound(pack.missingPiece);
assert.equal(isMissingPieceCorrect(missing.answerId, missing.answerId), true);
assert.equal(isMissingPieceCorrect(missing.options.find((option) => option.id !== missing.answerId).id, missing.answerId), false);

const sort = createSortRound(pack.sort);
const correctAssignments = new Map(sort.items.map((item) => [item.id, item.bucketId]));
const perfectSort = scoreSortAssignments(sort.items, correctAssignments);
assert.deepEqual(perfectSort, { correct: sort.items.length, total: sort.items.length, success: true });
const oneWrong = new Map(correctAssignments);
const first = sort.items[0];
const wrongBucket = sort.buckets.find((bucket) => bucket.id !== first.bucketId).id;
oneWrong.set(first.id, wrongBucket);
assert.equal(scoreSortAssignments(sort.items, oneWrong).success, false);

const impostor = createImpostorRound(pack.impostor);
assert.equal(isImpostorCorrect(impostor.answerId, impostor.answerId), true);
assert.equal(isImpostorCorrect(impostor.options.find((option) => option.id !== impostor.answerId).id, impostor.answerId), false);

for (const [name, definition] of Object.entries(pack)) {
  assert.match(definition.id, /^memory-game:/, `${name} needs a stable memory-game id`);
  assert.ok(definition.prompt.length > 0, `${name} needs student-facing prompt data`);
}
console.log("PASS declarative Build, Missing Piece, Sort and Impostor game contracts");
