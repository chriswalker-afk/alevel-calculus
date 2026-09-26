import { buildWordBankEntries, filterWordBankEntries, wordBankFilters } from '../src/scripts/word-bank-model.js';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const records = [
  {
    termId: 'vocab:derivative',
    firstEncounteredAt: '2026-09-24T12:00:00.000Z',
    firstEncounter: { topicLabel: 'Basics of differentiation' },
    needsReview: true
  },
  {
    termId: 'vocab:integrand',
    firstEncounteredAt: '2026-09-24T12:01:00.000Z',
    firstEncounter: { topicLabel: 'Standard integrals' },
    needsReview: false
  },
  { termId: 'vocab:unknown', firstEncounteredAt: '2026-09-24T12:02:00.000Z', firstEncounter: {}, needsReview: false }
];

const entries = buildWordBankEntries(records);
assert(entries.length === 2, 'Unknown vocabulary IDs should not produce drawer entries');
assert(wordBankFilters.map((filter) => filter.id).join(',') === 'all,y12,y13,needs-review', 'Expected four canonical Word Bank filters');
assert(filterWordBankEntries(entries, { filter: 'y12' }).map((entry) => entry.id).join(',') === 'vocab:derivative,vocab:integrand', 'Year 12 filter should use scope metadata');
assert(filterWordBankEntries(entries, { filter: 'y13' }).map((entry) => entry.id).join(',') === '', 'Year 13 filter should use scope metadata');
assert(filterWordBankEntries(entries, { filter: 'needs-review' }).map((entry) => entry.id).join(',') === 'vocab:derivative', 'Needs review filter should use student review state');
assert(filterWordBankEntries(entries, { query: 'gradient' }).map((entry) => entry.id).includes('vocab:derivative'), 'Search should match definitions');
assert(filterWordBankEntries(entries, { query: 'integration by parts' }).map((entry) => entry.id).includes('vocab:integrand'), 'Search should match related topics');

console.log('PASS Word Bank metadata join, search and scope/review filter checks');
