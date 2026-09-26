import fs from 'node:fs';
import assert from 'node:assert/strict';
import { memoryReviewPacks } from '../src/scripts/memory-review-content.js';

const supported = new Set(['rapid', 'diagram', 'build', 'missing-piece', 'sort', 'impostor']);
for (const [topicId, pack] of Object.entries(memoryReviewPacks)) {
  for (const taskId of pack.mix?.taskIds ?? []) {
    assert.ok(supported.has(taskId), `${topicId} Memory Mix references unsupported task ${taskId}`);
  }
}

const memoryLabSource = fs.readFileSync(new URL('../src/scripts/memory-lab.js', import.meta.url), 'utf8');
assert.match(memoryLabSource, /const reviewSort = createSortEngine\(reviewTaskPanelById\.get\("sort"\)/, 'Review must instantiate the sort engine.');
assert.match(memoryLabSource, /\["sort", reviewSort\]/, 'Review engine map must expose sort to Memory Mix.');
assert.match(memoryLabSource, /\["sort", gamePack\.sort\.label\]/, 'Review label map must expose sort label.');

const html = fs.readFileSync(new URL('../src/index.html', import.meta.url), 'utf8');
assert.match(html, /data-memory-review-task-panel="sort"/, 'Review markup must include a sort task panel.');
assert.match(html, /data-memory-review-task-panel="sort"[\s\S]*?data-sort-buckets/, 'Review sort panel must include sort buckets.');
assert.match(html, /data-memory-review-task-panel="sort"[\s\S]*?data-sort-progress/, 'Review sort panel must include sort progress.');

console.log(`Memory Review wiring hotfix regression passed for ${Object.keys(memoryReviewPacks).length} review packs.`);
