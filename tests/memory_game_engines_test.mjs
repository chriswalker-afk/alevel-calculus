import assert from "node:assert/strict";
import { basicsDifferentiationGamePack as pack } from "../src/scripts/memory-game-content.js";
import { createBuildRuleEngine } from "../src/scripts/build-rule-engine.js";
import { createMissingPieceEngine } from "../src/scripts/missing-piece-engine.js";
import { createSortEngine } from "../src/scripts/sort-engine.js";
import { createImpostorEngine } from "../src/scripts/impostor-engine.js";

class FakeElement {
  constructor() {
    this.children = new Map();
    this.appended = [];
    this.dataset = {};
    this.attributes = new Map();
    this.textContent = "";
    this.disabled = false;
  }
  querySelector(selector) { return this.children.get(selector) ?? null; }
  replaceChildren(...nodes) { this.appended = [...nodes]; }
  append(...nodes) { this.appended.push(...nodes); }
  addEventListener() {}
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
}
globalThis.document = { createElement() { return new FakeElement(); } };

function containerFor(selectors) {
  const root = new FakeElement();
  for (const selector of selectors) root.children.set(selector, new FakeElement());
  return root;
}
function evidenceSink() {
  const attempts = [], security = [], completions = [];
  return {
    attempts, security, completions,
    handlers: {
      onAttempt: (entry) => attempts.push(entry),
      onSecurity: (entry) => security.push(entry),
      onComplete: (entry) => completions.push(entry)
    }
  };
}

{
  const sink = evidenceSink();
  const engine = createBuildRuleEngine(containerFor([
    '[data-build-prompt]', '[data-build-context]', '[data-build-slots]', '[data-build-tokens]', '[data-build-status]',
    '[data-build-undo]', '[data-build-reset]', '[data-build-check]'
  ]), { definition: pack.build, ...sink.handlers });
  for (const tokenId of pack.build.answer) engine.choose(tokenId);
  assert.equal(engine.check(), true);
  assert.equal(sink.attempts.at(-1).success, true);
  assert.equal(sink.security.at(-1).security, 'secure');
  assert.equal(sink.completions.length, 1);
}

{
  const sink = evidenceSink();
  const engine = createMissingPieceEngine(containerFor([
    '[data-missing-prompt]', '[data-missing-expression]', '[data-missing-options]', '[data-missing-status]', '[data-missing-reset]', '[data-missing-check]'
  ]), { definition: pack.missingPiece, ...sink.handlers });
  const wrong = pack.missingPiece.options.find((option) => option.id !== pack.missingPiece.answerId).id;
  engine.select(wrong);
  assert.equal(engine.check(), false);
  assert.equal(sink.security.at(-1).security, 'needs-review');
  engine.select(pack.missingPiece.answerId);
  assert.equal(engine.check(), true);
  assert.equal(sink.security.at(-1).security, 'developing');
  assert.equal(sink.completions.length, 1);
}

{
  const sink = evidenceSink();
  const engine = createSortEngine(containerFor([
    '[data-sort-prompt]', '[data-sort-items]', '[data-sort-buckets]', '[data-sort-progress]', '[data-sort-status]', '[data-sort-reset]', '[data-sort-check]'
  ]), { definition: pack.sort, ...sink.handlers });
  for (const item of pack.sort.items) {
    engine.selectItem(item.id);
    engine.assignSelected(item.bucketId);
  }
  assert.equal(engine.check(), true);
  assert.equal(sink.attempts.at(-1).result, 1);
  assert.equal(sink.security.at(-1).security, 'secure');
  assert.equal(sink.completions.length, 1);
}

{
  const sink = evidenceSink();
  const engine = createImpostorEngine(containerFor([
    '[data-impostor-prompt]', '[data-impostor-options]', '[data-impostor-status]', '[data-impostor-reset]', '[data-impostor-check]'
  ]), { definition: pack.impostor, ...sink.handlers });
  engine.select(pack.impostor.answerId);
  assert.equal(engine.check(), true);
  assert.equal(sink.attempts.at(-1).success, true);
  assert.equal(sink.security.at(-1).security, 'secure');
  assert.equal(sink.completions.length, 1);
}

console.log('PASS Build, Missing Piece, Sort and Impostor engines report attempt/security/completion evidence');
