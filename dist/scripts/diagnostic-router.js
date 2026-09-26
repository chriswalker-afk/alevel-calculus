import { getSupportTargetForMicroSkill } from "./help-content.js";

export const diagnosticKinds = Object.freeze(["recognition", "execution"]);

const kindPresentation = Object.freeze({
  recognition: Object.freeze({
    label: "Recognition / recall",
    fallbackMessage: "Revisit the idea or rule before trying this micro-skill again."
  }),
  execution: Object.freeze({
    label: "Method execution",
    fallbackMessage: "You appear to have the right method area; focus on carrying it out accurately."
  })
});

function validMetadata(metadata) {
  return metadata && typeof metadata === "object" && typeof metadata.microSkillId === "string";
}

export function createDiagnosticRouter({ supportResolver = getSupportTargetForMicroSkill } = {}) {
  if (typeof supportResolver !== "function") throw new Error("DiagnosticRouter requires a support resolver function.");

  function routeOutcome(outcome = {}) {
    if (outcome.success === true) return null;
    if (!validMetadata(outcome.metadata)) return null;

    const errorCategory = outcome.errorCategory ?? null;
    const rule = (errorCategory ? outcome.metadata.diagnosticRules?.[errorCategory] : null)
      ?? outcome.metadata.defaultDiagnostic
      ?? null;
    if (!rule || !diagnosticKinds.includes(rule.kind)) return null;

    const supportMicroSkillId = rule.supportMicroSkillId || outcome.metadata.microSkillId;
    const target = supportResolver(supportMicroSkillId, rule.supportNeed);
    if (!target) return null;

    const presentation = kindPresentation[rule.kind];
    return Object.freeze({
      kind: rule.kind,
      kindLabel: presentation.label,
      errorCategory,
      sourceMicroSkillId: outcome.metadata.microSkillId,
      supportMicroSkillId,
      supportNeed: rule.supportNeed,
      message: rule.studentMessage || presentation.fallbackMessage,
      target
    });
  }

  return Object.freeze({ routeOutcome });
}

export const diagnosticRouter = createDiagnosticRouter();
