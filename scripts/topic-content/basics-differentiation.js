import { defineTopicMetadata } from "../topic-metadata.js";

const topicId = "topic:y12:differentiation:basics";
const skill = (slug) => `skill:y12:differentiation:basics:${slug}`;
const activity = (mode, slug) => `activity:y12:differentiation:basics:${mode}:${slug}`;

export const basicsDifferentiationVocabularyTags = Object.freeze([
  "vocab:function",
  "vocab:derivative",
  "vocab:differentiate",
  "vocab:gradient",
  "vocab:gradient-function",
  "vocab:tangent",
  "vocab:coefficient",
  "vocab:constant",
  "vocab:power-index",
  "vocab:increasing",
  "vocab:decreasing",
  "vocab:f-prime-notation",
  "vocab:dy-dx-notation",
  "vocab:d-dx-operator"
]);

export const basicsDifferentiationTopic = defineTopicMetadata({
  topicId,
  scopeId: "y12",
  strand: "differentiation",
  slug: "basics",
  title: "Basics of differentiation",
  sequence: 20,
  modes: ["understand", "memorise", "ao1", "ao2", "ao3"],
  prerequisiteTopicIds: ["topic:y12:foundations:pre-calculus"],
  prerequisiteTags: [
    "straight-line-gradient",
    "function-notation",
    "polynomial-graphs",
    "indices",
    "algebraic-simplification"
  ],
  vocabularyTags: basicsDifferentiationVocabularyTags,
  journey: [
    {
      id: "gradient-on-a-curve",
      title: "Gradient on a curve",
      summary: "Move a tangent along a polynomial curve and connect its steepness and direction to a numerical gradient.",
      microSkillIds: [skill("gradient-on-curve")],
      vocabularyTags: ["vocab:gradient", "vocab:tangent", "vocab:increasing", "vocab:decreasing"]
    },
    {
      id: "gradient-function",
      title: "Build the gradient function",
      summary: "Use tangent gradients at selected x-values to construct a second graph whose height records the gradient of the original curve.",
      microSkillIds: [skill("gradient-function"), skill("function-derivative-match")],
      vocabularyTags: ["vocab:function", "vocab:derivative", "vocab:gradient-function", "vocab:f-prime-notation"]
    },
    {
      id: "polynomial-explorer",
      title: "Polynomial explorer",
      summary: "Connect an entered polynomial, its movable tangent and its complete derivative graph while keeping gradient meaning primary.",
      microSkillIds: [skill("gradient-function"), skill("function-derivative-match")],
      vocabularyTags: ["vocab:function", "vocab:derivative", "vocab:tangent"]
    },
    {
      id: "notation-and-operator",
      title: "Derivative notation and the d/dx operator",
      summary: "Distinguish f′(x) and dy/dx as derivative notation from d/dx as the instruction to differentiate with respect to x.",
      microSkillIds: [skill("derivative-notation"), skill("differentiation-operator")],
      vocabularyTags: ["vocab:derivative", "vocab:differentiate", "vocab:f-prime-notation", "vocab:dy-dx-notation", "vocab:d-dx-operator"]
    },
    {
      id: "calculus-backstory",
      title: "Calculus has a backstory",
      summary: "Briefly connect Leibniz, Newton and Lagrange to the notation students now use, without turning the topic into a history course.",
      microSkillIds: [skill("derivative-notation")],
      vocabularyTags: ["vocab:f-prime-notation", "vocab:dy-dx-notation"]
    },
    {
      id: "power-rule",
      title: "Power rule",
      summary: "Generalise the pattern d/dx(ax^n)=anx^(n-1), including constants, x and ax.",
      microSkillIds: [skill("power-rule"), skill("constant-and-linear")],
      vocabularyTags: ["vocab:differentiate", "vocab:coefficient", "vocab:constant", "vocab:power-index"]
    },
    {
      id: "term-by-term",
      title: "Differentiate term by term",
      summary: "Rewrite roots and reciprocals where needed, then differentiate each term of a sum or difference separately.",
      microSkillIds: [skill("rewrite-powers"), skill("term-by-term")],
      vocabularyTags: ["vocab:differentiate", "vocab:power-index", "vocab:coefficient", "vocab:constant"]
    }
  ],
  microSkills: [
    {
      microSkillId: skill("gradient-on-curve"),
      slug: "gradient-on-curve",
      title: "Interpret the gradient of a curve at a point",
      prerequisiteTags: ["straight-line-gradient", "polynomial-graphs"],
      vocabularyTags: ["vocab:gradient", "vocab:tangent", "vocab:increasing", "vocab:decreasing"],
      supportTargets: { understand: activity("understand", "curve-tangent-gradient") }
    },
    {
      microSkillId: skill("gradient-function"),
      slug: "gradient-function",
      title: "Interpret the derivative as a gradient function",
      prerequisiteTags: ["function-notation", "polynomial-graphs"],
      vocabularyTags: ["vocab:function", "vocab:derivative", "vocab:gradient-function", "vocab:f-prime-notation"],
      supportTargets: { understand: activity("understand", "gradient-function") }
    },
    {
      microSkillId: skill("derivative-notation"),
      slug: "derivative-notation",
      title: "Interpret f′(x) and dy/dx notation",
      prerequisiteTags: ["function-notation"],
      vocabularyTags: ["vocab:derivative", "vocab:f-prime-notation", "vocab:dy-dx-notation"],
      supportTargets: {
        understand: activity("understand", "derivative-notation"),
        memorise: activity("memorise", "derivative-notation")
      }
    },
    {
      microSkillId: skill("differentiation-operator"),
      slug: "differentiation-operator",
      title: "Interpret d/dx as a differentiation operator",
      prerequisiteTags: ["function-notation"],
      vocabularyTags: ["vocab:differentiate", "vocab:d-dx-operator", "vocab:derivative"],
      supportTargets: {
        understand: activity("understand", "differentiation-machine"),
        memorise: activity("memorise", "derivative-notation")
      }
    },
    {
      microSkillId: skill("power-rule"),
      slug: "power-rule",
      title: "Differentiate powers of x using the power rule",
      prerequisiteTags: ["indices", "algebraic-simplification"],
      vocabularyTags: ["vocab:differentiate", "vocab:coefficient", "vocab:power-index"],
      supportTargets: {
        understand: activity("understand", "power-rule-pattern"),
        memorise: activity("memorise", "power-rule-recall"),
        ao1: activity("ao1", "power-rule")
      }
    },
    {
      microSkillId: skill("constant-and-linear"),
      slug: "constant-and-linear",
      title: "Differentiate constants, x and ax",
      prerequisiteTags: ["indices"],
      vocabularyTags: ["vocab:constant", "vocab:coefficient"],
      supportTargets: {
        memorise: activity("memorise", "special-cases"),
        ao1: activity("ao1", "power-rule")
      }
    },
    {
      microSkillId: skill("rewrite-powers"),
      slug: "rewrite-powers",
      title: "Rewrite roots and reciprocals as powers before differentiating",
      prerequisiteTags: ["indices"],
      vocabularyTags: ["vocab:power-index", "vocab:differentiate"],
      supportTargets: {
        memorise: activity("memorise", "rewrite-powers"),
        ao1: activity("ao1", "rewrite-and-differentiate"),
        ao2: activity("ao2", "error-correction")
      }
    },
    {
      microSkillId: skill("term-by-term"),
      slug: "term-by-term",
      title: "Differentiate sums and differences term by term",
      prerequisiteTags: ["algebraic-simplification"],
      vocabularyTags: ["vocab:differentiate", "vocab:coefficient", "vocab:constant"],
      supportTargets: {
        understand: activity("understand", "term-by-term"),
        memorise: activity("memorise", "term-by-term"),
        ao1: activity("ao1", "term-by-term"),
        ao2: activity("ao2", "error-correction")
      }
    },
    {
      microSkillId: skill("function-derivative-match"),
      slug: "function-derivative-match",
      title: "Match a function graph to its derivative graph",
      prerequisiteTags: ["polynomial-graphs"],
      vocabularyTags: ["vocab:function", "vocab:derivative", "vocab:gradient-function", "vocab:increasing", "vocab:decreasing"],
      supportTargets: {
        understand: activity("understand", "gradient-function"),
        ao1: activity("ao1", "graph-matching"),
        ao2: activity("ao2", "explain-gradient-function")
      }
    },
    {
      microSkillId: skill("error-correction"),
      slug: "error-correction",
      title: "Explain and correct differentiation errors",
      prerequisiteTags: ["indices", "algebraic-simplification"],
      vocabularyTags: ["vocab:differentiate", "vocab:coefficient", "vocab:power-index"],
      supportTargets: { ao2: activity("ao2", "error-correction") }
    },
    {
      microSkillId: skill("unknown-coefficients"),
      slug: "unknown-coefficients",
      title: "Use derivative information to determine unknown coefficients",
      prerequisiteTags: ["linear-equations", "algebraic-simplification"],
      vocabularyTags: ["vocab:coefficient", "vocab:derivative"],
      supportTargets: { ao2: activity("ao2", "unknown-coefficients") }
    },
    {
      microSkillId: skill("simple-applications"),
      slug: "simple-applications",
      title: "Apply basic differentiation in a simple unfamiliar context",
      prerequisiteTags: ["power-rule", "function-notation"],
      vocabularyTags: ["vocab:derivative", "vocab:gradient"],
      supportTargets: { ao3: activity("ao3", "simple-applications") }
    }
  ],
  activities: [
    { activityId: activity("understand", "curve-tangent-gradient"), mode: "understand", slug: "curve-tangent-gradient", title: "Gradient on a curve", activityType: "interactive", microSkillIds: [skill("gradient-on-curve")], vocabularyTags: ["vocab:gradient", "vocab:tangent", "vocab:increasing", "vocab:decreasing"], implementationStep: 33 },
    { activityId: activity("understand", "gradient-function"), mode: "understand", slug: "gradient-function", title: "Build the gradient function", activityType: "interactive", microSkillIds: [skill("gradient-function"), skill("function-derivative-match")], vocabularyTags: ["vocab:derivative", "vocab:gradient-function", "vocab:f-prime-notation"], implementationStep: 33 },
    { activityId: activity("understand", "polynomial-explorer"), mode: "understand", slug: "polynomial-explorer", title: "Polynomial explorer", activityType: "interactive", microSkillIds: [skill("gradient-function"), skill("function-derivative-match")], vocabularyTags: ["vocab:function", "vocab:derivative", "vocab:tangent"], implementationStep: 33 },
    { activityId: activity("understand", "derivative-notation"), mode: "understand", slug: "derivative-notation", title: "Derivative notation", activityType: "lesson", microSkillIds: [skill("derivative-notation")], vocabularyTags: ["vocab:f-prime-notation", "vocab:dy-dx-notation"], implementationStep: 33 },
    { activityId: activity("understand", "differentiation-machine"), mode: "understand", slug: "differentiation-machine", title: "The d/dx differentiation machine", activityType: "interactive", microSkillIds: [skill("differentiation-operator")], vocabularyTags: ["vocab:d-dx-operator", "vocab:differentiate"], implementationStep: 33 },
    { activityId: activity("understand", "calculus-backstory"), mode: "understand", slug: "calculus-backstory", title: "Calculus has a backstory", activityType: "lesson", microSkillIds: [skill("derivative-notation")], vocabularyTags: ["vocab:f-prime-notation", "vocab:dy-dx-notation"], implementationStep: 33 },
    { activityId: activity("understand", "power-rule-pattern"), mode: "understand", slug: "power-rule-pattern", title: "See the power-rule pattern", activityType: "lesson", microSkillIds: [skill("power-rule"), skill("constant-and-linear")], vocabularyTags: ["vocab:coefficient", "vocab:power-index"], implementationStep: 33 },
    { activityId: activity("understand", "term-by-term"), mode: "understand", slug: "term-by-term", title: "Differentiate term by term", activityType: "lesson", microSkillIds: [skill("term-by-term")], vocabularyTags: ["vocab:differentiate"], implementationStep: 33 },

    { activityId: activity("memorise", "power-rule-recall"), mode: "memorise", slug: "power-rule-recall", title: "Power-rule recall", activityType: "memory", microSkillIds: [skill("power-rule")], vocabularyTags: ["vocab:coefficient", "vocab:power-index"], implementationStep: 34 },
    { activityId: activity("memorise", "derivative-notation"), mode: "memorise", slug: "derivative-notation", title: "Derivative notation recall", activityType: "memory", microSkillIds: [skill("derivative-notation"), skill("differentiation-operator")], vocabularyTags: ["vocab:f-prime-notation", "vocab:dy-dx-notation", "vocab:d-dx-operator"], implementationStep: 34 },
    { activityId: activity("memorise", "special-cases"), mode: "memorise", slug: "special-cases", title: "Special differentiation cases", activityType: "memory", microSkillIds: [skill("constant-and-linear"), skill("rewrite-powers")], vocabularyTags: ["vocab:constant", "vocab:coefficient", "vocab:power-index"], implementationStep: 34 },
    { activityId: activity("memorise", "rewrite-powers"), mode: "memorise", slug: "rewrite-powers", title: "Roots and reciprocals as powers", activityType: "memory", microSkillIds: [skill("rewrite-powers")], vocabularyTags: ["vocab:power-index"], implementationStep: 34 },
    { activityId: activity("memorise", "term-by-term"), mode: "memorise", slug: "term-by-term", title: "Term-by-term rule", activityType: "memory", microSkillIds: [skill("term-by-term")], vocabularyTags: ["vocab:differentiate"], implementationStep: 34 },
    { activityId: activity("memorise", "vocabulary-recall"), mode: "memorise", slug: "vocabulary-recall", title: "Differentiation vocabulary", activityType: "memory", microSkillIds: [skill("gradient-on-curve"), skill("gradient-function"), skill("derivative-notation"), skill("differentiation-operator"), skill("power-rule")], vocabularyTags: basicsDifferentiationVocabularyTags, implementationStep: 34 },

    { activityId: activity("ao1", "power-rule"), mode: "ao1", slug: "power-rule", title: "Power-rule fluency", activityType: "question-set", microSkillIds: [skill("power-rule"), skill("constant-and-linear")], vocabularyTags: ["vocab:coefficient", "vocab:power-index"], implementationStep: 35 },
    { activityId: activity("ao1", "rewrite-and-differentiate"), mode: "ao1", slug: "rewrite-and-differentiate", title: "Rewrite then differentiate", activityType: "question-set", microSkillIds: [skill("rewrite-powers"), skill("power-rule")], vocabularyTags: ["vocab:power-index", "vocab:differentiate"], implementationStep: 35 },
    { activityId: activity("ao1", "term-by-term"), mode: "ao1", slug: "term-by-term", title: "Differentiate polynomials term by term", activityType: "question-set", microSkillIds: [skill("term-by-term"), skill("power-rule")], vocabularyTags: ["vocab:differentiate", "vocab:coefficient", "vocab:constant"], implementationStep: 35 },
    { activityId: activity("ao1", "graph-matching"), mode: "ao1", slug: "graph-matching", title: "Match functions and derivative graphs", activityType: "question-set", microSkillIds: [skill("function-derivative-match")], vocabularyTags: ["vocab:derivative", "vocab:gradient-function"], implementationStep: 35 },

    { activityId: activity("ao2", "explain-gradient-function"), mode: "ao2", slug: "explain-gradient-function", title: "Explain function and derivative features", activityType: "question-set", microSkillIds: [skill("gradient-on-curve"), skill("gradient-function"), skill("function-derivative-match")], vocabularyTags: ["vocab:gradient", "vocab:gradient-function", "vocab:increasing", "vocab:decreasing"], implementationStep: 35 },
    { activityId: activity("ao2", "diagnose-power-rule"), mode: "ao2", slug: "diagnose-power-rule", title: "Diagnose a power-rule method", activityType: "question-set", microSkillIds: [skill("power-rule"), skill("error-correction")], vocabularyTags: ["vocab:coefficient", "vocab:power-index"], implementationStep: 35 },
    { activityId: activity("ao2", "error-correction"), mode: "ao2", slug: "error-correction", title: "Explain and correct differentiation errors", activityType: "question-set", microSkillIds: [skill("rewrite-powers"), skill("term-by-term"), skill("error-correction")], vocabularyTags: ["vocab:differentiate", "vocab:power-index"], implementationStep: 35 },
    { activityId: activity("ao2", "unknown-coefficients"), mode: "ao2", slug: "unknown-coefficients", title: "Find unknown coefficients from derivative information", activityType: "question-set", microSkillIds: [skill("unknown-coefficients")], vocabularyTags: ["vocab:coefficient", "vocab:derivative"], implementationStep: 35 },

    { activityId: activity("ao3", "simple-applications"), mode: "ao3", slug: "simple-applications", title: "Apply basic differentiation", activityType: "question-set", microSkillIds: [skill("simple-applications"), skill("power-rule"), skill("term-by-term")], vocabularyTags: ["vocab:derivative", "vocab:gradient"], implementationStep: 35 }
  ]
});

export function getBasicsDifferentiationMicroSkill(microSkillId) {
  return basicsDifferentiationTopic.microSkills.find((item) => item.microSkillId === microSkillId) ?? null;
}

export function getBasicsDifferentiationActivity(activityId) {
  return basicsDifferentiationTopic.activities.find((item) => item.activityId === activityId) ?? null;
}
