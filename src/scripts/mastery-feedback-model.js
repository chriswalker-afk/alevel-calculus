import { diagnosticRouter } from "./diagnostic-router.js";

const defaultDiagnosticRouter = diagnosticRouter;

function frozenEntry(entry) {
  return Object.freeze({ ...entry });
}

function focusLabel(recognitionErrors, executionErrors) {
  if (recognitionErrors > 0 && executionErrors > 0) return "Recognition and execution";
  if (recognitionErrors > 0) return "Recognition / recall";
  if (executionErrors > 0) return "Method execution";
  return "No failed evidence";
}

export function createMasteryFeedbackModel({ router = defaultDiagnosticRouter } = {}) {
  if (!router || typeof router.routeOutcome !== "function") {
    throw new Error("MasteryFeedbackModel requires a DiagnosticRouter-like object.");
  }

  function summarise(outcomes = []) {
    if (!Array.isArray(outcomes)) throw new Error("MasteryFeedbackModel.summarise requires an array of outcomes.");
    const bySkill = new Map();

    outcomes.forEach((outcome, index) => {
      const microSkillId = outcome?.metadata?.microSkillId;
      if (!microSkillId) return;
      if (!bySkill.has(microSkillId)) {
        bySkill.set(microSkillId, {
          microSkillId,
          attempts: 0,
          successes: 0,
          failures: 0,
          recognitionErrors: 0,
          executionErrors: 0,
          lastDiagnostic: null,
          lastIndex: -1
        });
      }
      const record = bySkill.get(microSkillId);
      record.attempts += 1;
      if (outcome.success === true) {
        record.successes += 1;
        return;
      }

      record.failures += 1;
      const diagnostic = outcome.diagnostic ?? router.routeOutcome(outcome);
      if (diagnostic?.kind === "recognition") record.recognitionErrors += 1;
      if (diagnostic?.kind === "execution") record.executionErrors += 1;
      if (diagnostic) {
        record.lastDiagnostic = diagnostic;
        record.lastIndex = index;
      }
    });

    const strengths = [];
    const weaknesses = [];
    for (const record of bySkill.values()) {
      if (record.failures === 0 && record.successes > 0) {
        strengths.push(frozenEntry({
          microSkillId: record.microSkillId,
          attempts: record.attempts,
          successes: record.successes,
          evidence: "Successful evidence with no observed failed attempt in this set"
        }));
        continue;
      }
      if (record.failures > 0) {
        weaknesses.push(frozenEntry({
          microSkillId: record.microSkillId,
          attempts: record.attempts,
          successes: record.successes,
          failures: record.failures,
          recognitionErrors: record.recognitionErrors,
          executionErrors: record.executionErrors,
          focus: focusLabel(record.recognitionErrors, record.executionErrors),
          nextStep: record.lastDiagnostic?.target ?? null,
          diagnostic: record.lastDiagnostic
        }));
      }
    }

    return Object.freeze({
      attemptCount: outcomes.filter((outcome) => outcome?.metadata?.microSkillId).length,
      strengths: Object.freeze(strengths),
      weaknesses: Object.freeze(weaknesses)
    });
  }

  return Object.freeze({ summarise });
}

export const masteryFeedbackModel = createMasteryFeedbackModel();
