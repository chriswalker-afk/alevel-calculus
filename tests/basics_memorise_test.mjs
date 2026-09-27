import assert from "node:assert/strict";
import { buildFlashcardDeck } from "../src/scripts/flashcard-engine.js";
import { createMatchRound } from "../src/scripts/match-engine.js";
import {
  basicsDifferentiationFactItems,
  basicsDifferentiationVocabularyItems,
  basicsDifferentiationMemoryItems
} from "../src/scripts/memory-content.js";
import { basicsDifferentiationVocabularyTags } from "../src/scripts/topic-content/basics-differentiation.js";
import { getVocabularyTerm } from "../src/scripts/vocabulary-data.js";
import { learningModes } from "../src/scripts/sample-activities.js";

const factIds = new Set(basicsDifferentiationFactItems.map((item) => item.id));
const requiredFacts = [
  "memory-item:y12:differentiation:basics:power-rule",
  "memory-item:y12:differentiation:basics:constant",
  "memory-item:y12:differentiation:basics:x",
  "memory-item:y12:differentiation:basics:linear",
  "memory-item:y12:differentiation:basics:a-over-x",
  "memory-item:y12:differentiation:basics:a-over-x-power",
  "memory-item:y12:differentiation:basics:a-root-x",
  "memory-item:y12:differentiation:basics:a-over-root-x",
  "memory-item:y12:differentiation:basics:negative-powers",
  "memory-item:y12:differentiation:basics:fractional-powers",
  "memory-item:y12:differentiation:basics:term-by-term"
];
for (const id of requiredFacts) assert(factIds.has(id), `Missing planned Memorise fact ${id}`);
assert.equal(basicsDifferentiationFactItems.find((item) => item.id.endsWith(":x")).flashcard.back, "1", "x must be memorised as a distinct special case");
assert.equal(basicsDifferentiationFactItems.find((item)=>item.id.endsWith(":a-over-x")).flashcard.back,"−a/x²","a/x must be directly retrievable, not only derivable after rewriting.");
assert.equal(basicsDifferentiationFactItems.find((item)=>item.id.endsWith(":a-over-x-power")).learn.notation,"d/dx (a/xⁿ) = −(an)/(xⁿ⁺¹)","Reciprocal powers must have an explicit remembered derivative pattern.");
assert.equal(basicsDifferentiationFactItems.find((item)=>item.id.endsWith(":a-root-x")).flashcard.back,"a/(2√x)","Square-root derivatives must be directly retrievable.");
assert.equal(basicsDifferentiationFactItems.find((item)=>item.id.endsWith(":a-over-root-x")).flashcard.back,"−a/(2x³ᐟ²)","Reciprocal-root derivatives must be directly retrievable.");

const deck = buildFlashcardDeck(basicsDifferentiationMemoryItems);
for (const item of basicsDifferentiationFactItems) {
  assert(deck.some((card) => card.itemId === item.id), `${item.id} must be retrievable as a flashcard`);
  const targetFirst = (values) => [...values].sort((a, b) => {
    const aid = a.id ?? a.itemId ?? "";
    const bid = b.id ?? b.itemId ?? "";
    const aTarget = aid.includes(item.id);
    const bTarget = bid.includes(item.id);
    return aTarget === bTarget ? 0 : aTarget ? -1 : 1;
  });
  const match = createMatchRound(basicsDifferentiationMemoryItems, { limit: 4, shuffle: targetFirst });
  assert(match.itemIds.includes(item.id), `${item.id} must be eligible for reusable Match retrieval, not trapped outside the first fixed slice`);
}

assert.equal(basicsDifferentiationVocabularyItems.length, basicsDifferentiationVocabularyTags.length, "Every planned Basics vocabulary tag must have one MemoryItem projection");
for (const item of basicsDifferentiationVocabularyItems) {
  const term = getVocabularyTerm(item.sourceVocabularyTermId);
  assert(term, `${item.sourceVocabularyTermId} must resolve through VocabularyTerm`);
  assert.equal(item.learn.statement, term.definition, `${term.label} Learn definition must come from VocabularyTerm`);
  assert.equal(item.learn.notation, term.notation, `${term.label} notation must match the Word Bank source`);
  assert.equal(item.flashcard.back, term.definition, `${term.label} flashcard must not duplicate a divergent definition`);
}

const memoriseIds = new Set(learningModes.memorise.activities.map((activity) => activity.activityId));
for (const slug of ["power-rule-recall", "derivative-notation", "special-cases", "rewrite-powers", "term-by-term", "vocabulary-recall"]) {
  assert(memoriseIds.has(`activity:y12:differentiation:basics:memorise:${slug}`), `Step 34 must expose canonical Memorise activity ${slug}`);
}
assert(memoriseIds.has("activity:y12:differentiation:basics:memorise:memory-games"), "Step 19 Memory Games progress identity must be preserved");
assert(memoriseIds.has("activity:y12:differentiation:basics:memorise:mixed-review"), "Step 20 Review progress identity must be preserved");

console.log("PASS Basics Step 34 Memorise facts, reusable retrieval coverage and VocabularyTerm wiring");
