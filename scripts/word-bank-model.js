import { getVocabularyTerm } from "./vocabulary-data.js";

export const wordBankFilters = Object.freeze([
  Object.freeze({ id: "all", label: "All" }),
  Object.freeze({ id: "y12", label: "Year 12" }),
  Object.freeze({ id: "y13", label: "Year 13" }),
  Object.freeze({ id: "needs-review", label: "Needs review" })
]);

export function buildWordBankEntries(records) {
  return records
    .map((record) => {
      const term = getVocabularyTerm(record.termId);
      if (!term) return null;
      return Object.freeze({ ...term, record });
    })
    .filter(Boolean);
}

export function filterWordBankEntries(entries, { query = "", filter = "all" } = {}) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return entries.filter((entry) => {
    if (filter === "y12" && entry.scopeId !== "y12") return false;
    if (filter === "y13" && entry.scopeId !== "y13-additional") return false;
    if (filter === "needs-review" && !entry.record.needsReview) return false;
    if (!normalizedQuery) return true;
    const haystack = `${entry.label} ${entry.definition} ${entry.notation} ${entry.relatedTopics.join(" ")}`.toLocaleLowerCase();
    return haystack.includes(normalizedQuery);
  });
}
