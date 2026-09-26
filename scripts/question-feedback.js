const allowedTones = Object.freeze(["correct", "incorrect", "warning", "info"]);

export function normaliseQuestionCheckResult(result, { allowedErrorCategories = [] } = {}) {
  const value = result && typeof result === "object" ? result : {};
  const tone = allowedTones.includes(value.tone) ? value.tone : "info";
  const title = typeof value.title === "string" ? value.title.trim() : "";
  const message = typeof value.message === "string" ? value.message.trim() : "";
  let errorCategory = typeof value.errorCategory === "string" ? value.errorCategory.trim() : "";

  if (tone === "correct") errorCategory = "";
  if (errorCategory && Array.isArray(allowedErrorCategories) && allowedErrorCategories.length > 0 && !allowedErrorCategories.includes(errorCategory)) {
    throw new Error(`Question checker returned undeclared error category: ${errorCategory}.`);
  }

  return Object.freeze({
    tone,
    title,
    message,
    errorCategory: errorCategory || null
  });
}

export const questionFeedbackTones = allowedTones;
