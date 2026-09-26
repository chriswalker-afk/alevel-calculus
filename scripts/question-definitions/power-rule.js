import { defineQuestionDefinition } from "../question-definition.js";
import { defineSolutionStep } from "../solution-step.js";

const superscriptDigits = Object.freeze({
  0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹"
});

function superscript(power) {
  if (power === 1) return "";
  return String(power).split("").map((digit) => superscriptDigits[digit] ?? digit).join("");
}

function compactMath(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[\s·×*]/g, "")
    .replace(/−/g, "-")
    .replace(/⁰/g, "^0")
    .replace(/¹/g, "^1")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/⁴/g, "^4")
    .replace(/⁵/g, "^5")
    .replace(/⁶/g, "^6")
    .replace(/x\^1(?!\d)/g, "x")
    .replace(/\+\-/g, "-");
}

function signedJoin(parts) {
  return parts
    .filter((part) => part && part.coefficient !== 0)
    .map((part, index) => {
      const { coefficient, body } = part;
      const magnitude = Math.abs(coefficient);
      const sign = coefficient < 0 ? "−" : "+";
      const coefficientText = body && magnitude === 1 ? "" : String(magnitude);
      const term = `${coefficientText}${body}`;
      if (index === 0) return coefficient < 0 ? `−${term}` : term;
      return `${sign} ${term}`;
    })
    .join(" ");
}

function displayPolynomial(terms, constant = 0) {
  const parts = terms.map(({ coefficient, power }) => ({
    coefficient,
    body: power === 0 ? "" : `x${superscript(power)}`
  }));
  if (constant !== 0) parts.push({ coefficient: constant, body: "" });
  return signedJoin(parts);
}

function displayUnsimplifiedDerivative(terms) {
  return signedJoin(terms.map(({ coefficient, power }) => ({
    coefficient,
    body: `·${power}${power - 1 === 0 ? "" : `x${superscript(power - 1)}`}`
  })));
}

function asciiTerm(coefficient, power) {
  if (power === 0) return String(coefficient);
  const coefficientText = coefficient === 1 ? "" : coefficient === -1 ? "-" : String(coefficient);
  const powerText = power === 1 ? "x" : `x^${power}`;
  return `${coefficientText}${powerText}`;
}

function asciiPolynomial(terms) {
  return terms.map(({ coefficient, power }, index) => {
    const raw = asciiTerm(Math.abs(coefficient), power);
    if (index === 0) return coefficient < 0 ? `-${raw}` : raw;
    return coefficient < 0 ? `-${raw}` : `+${raw}`;
  }).join("");
}

function matchesPolynomial(response, terms) {
  const canonical = asciiPolynomial(terms);
  const reversed = asciiPolynomial([...terms].reverse());
  const value = compactMath(response);
  return value === compactMath(canonical) || value === compactMath(reversed);
}

function algebraicFeedback(response, { a, b, c, highPower, lowPower }) {
  const expectedTerms = [
    { coefficient: a * highPower, power: highPower - 1 },
    { coefficient: b * lowPower, power: lowPower - 1 }
  ];
  if (matchesPolynomial(response, expectedTerms)) {
    return { tone: "correct", title: "Correct", message: "The derivative is accurate." };
  }

  const powerUnchanged = [
    { coefficient: a * highPower, power: highPower },
    { coefficient: b * lowPower, power: lowPower }
  ];
  if (matchesPolynomial(response, powerUnchanged)) {
    return {
      tone: "incorrect",
      errorCategory: "power-not-reduced",
      title: "Reduce each power by 1",
      message: "You multiplied by the old power, but the exponent must also decrease by 1."
    };
  }

  const coefficientUnchanged = [
    { coefficient: a, power: highPower - 1 },
    { coefficient: b, power: lowPower - 1 }
  ];
  if (matchesPolynomial(response, coefficientUnchanged)) {
    return {
      tone: "incorrect",
      errorCategory: "coefficient-not-multiplied",
      title: "Use the old power as a multiplier",
      message: "The powers decreased correctly, but each coefficient must be multiplied by its old power."
    };
  }

  if (c !== 0 && matchesPolynomial(response, [...expectedTerms, { coefficient: c, power: 0 }])) {
    return {
      tone: "incorrect",
      errorCategory: "constant-retained",
      title: "A constant differentiates to 0",
      message: "The polynomial terms are differentiated correctly; remove the original constant from the derivative."
    };
  }

  return {
    tone: "incorrect",
    errorCategory: "power-rule-error",
    title: "Not quite",
    message: "Differentiate each term: multiply by the old power, then reduce the power by 1."
  };
}

function numericFeedback(expected, response, { a, n, b, xValue }) {
  const value = Number(String(response ?? "").trim());
  if (Number.isFinite(value) && Math.abs(value - expected) <= 1e-9) {
    return { tone: "correct", title: "Correct", message: "Your numerical derivative value is right." };
  }

  const functionValue = a * (xValue ** n) + b * xValue;
  if (Number.isFinite(value) && Math.abs(value - functionValue) <= 1e-9) {
    return {
      tone: "incorrect",
      errorCategory: "evaluated-function-not-derivative",
      title: "Differentiate before substituting",
      message: "That is the function value. Find f′(x) first, then substitute the given x-value."
    };
  }

  const powerUnchangedValue = a * n * (xValue ** n) + b;
  if (Number.isFinite(value) && Math.abs(value - powerUnchangedValue) <= 1e-9) {
    return {
      tone: "incorrect",
      errorCategory: "power-not-reduced",
      title: "Check the new power",
      message: "After multiplying by the old power, reduce the exponent by 1 before substituting."
    };
  }

  const missingLinearValue = a * n * (xValue ** (n - 1));
  if (b !== 0 && Number.isFinite(value) && Math.abs(value - missingLinearValue) <= 1e-9) {
    return {
      tone: "incorrect",
      errorCategory: "omitted-linear-derivative",
      title: "Do not lose the linear term",
      message: `The derivative of ${b}x is ${b}, so it still contributes after differentiation.`
    };
  }

  return {
    tone: "incorrect",
    errorCategory: "evaluation-error",
    title: "Not quite",
    message: "Differentiate first, then substitute the given x-value carefully."
  };
}

const nonZeroSmallIntegers = Object.freeze([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);

export const powerRuleAlgebraicDefinition = defineQuestionDefinition({
  templateId: "question-template:y12:differentiation:basics:ao1:power-rule-polynomial",
  courseScope: "y12",
  topicId: "topic:y12:differentiation:basics",
  assessmentObjective: "ao1",
  microSkillId: "skill:y12:differentiation:basics:power-rule",
  difficulty: "standard",
  prerequisiteTags: ["integer-powers"],
  methodTags: ["power-rule", "term-by-term"],
  vocabularyTags: ["vocab:derivative", "vocab:coefficient"],
  errorCategories: ["power-not-reduced", "coefficient-not-multiplied", "constant-retained", "power-rule-error"],
  diagnosticRules: {
    "power-not-reduced": {
      kind: "execution",
      supportNeed: "ao1",
      studentMessage: "You have started the power rule, but one execution step is incomplete. A focused retry will help."
    },
    "coefficient-not-multiplied": {
      kind: "execution",
      supportNeed: "ao1",
      studentMessage: "You are using the right rule area; practise carrying out the coefficient change accurately."
    },
    "constant-retained": {
      kind: "execution",
      supportNeed: "ao1",
      studentMessage: "The main differentiation is in place. Practise applying the rule cleanly to every term, including constants."
    },
    "power-rule-error": {
      kind: "recognition",
      supportNeed: "memorise",
      studentMessage: "This looks more like a power-rule recall gap than a single arithmetic slip. Retrieve the rule before retrying."
    }
  },
  defaultDiagnostic: { kind: "execution", supportNeed: "ao1" },
  responseType: "algebraic",
  responseLabel: "Your derivative",
  placeholder: "e.g. 12x^3 - 10x",
  parameterGenerator({ random }) {
    const highPower = random.int(3, 5);
    const lowPower = random.int(1, highPower - 1);
    return {
      a: random.pick(nonZeroSmallIntegers),
      b: random.pick(nonZeroSmallIntegers),
      c: random.int(-9, 9),
      highPower,
      lowPower
    };
  },
  promptRenderer() {
    return "Differentiate with respect to x.";
  },
  mathRenderer({ a, b, c, highPower, lowPower }) {
    return `y = ${displayPolynomial([
      { coefficient: a, power: highPower },
      { coefficient: b, power: lowPower }
    ], c)}`;
  },
  answerChecker(response, parameters) {
    return algebraicFeedback(response, parameters);
  },
  workedSolutionGenerator({ a, b, c, highPower, lowPower }) {
    const original = displayPolynomial([
      { coefficient: a, power: highPower },
      { coefficient: b, power: lowPower }
    ], c);
    const unsimplified = displayUnsimplifiedDerivative([
      { coefficient: a, power: highPower },
      { coefficient: b, power: lowPower }
    ]);
    const derivative = displayPolynomial([
      { coefficient: a * highPower, power: highPower - 1 },
      { coefficient: b * lowPower, power: lowPower - 1 }
    ]);
    return [
      defineSolutionStep({
        id: "identify-terms",
        kind: "working",
        label: "Differentiate term by term",
        expression: `d/dx(${original})`,
        explanation: "Treat each power term separately. The constant contributes 0."
      }),
      defineSolutionStep({
        id: "apply-power-rule",
        kind: "working",
        label: "Multiply, then lower the power",
        expression: `dy/dx = ${unsimplified}`,
        explanation: "For each axⁿ term, multiply a by n and reduce the power from n to n − 1."
      }),
      defineSolutionStep({
        id: "simplify-derivative",
        kind: "result",
        label: "Simplify",
        expression: `dy/dx = ${derivative}`,
        explanation: "This is the gradient function."
      })
    ];
  },
  hintSequenceGenerator({ a, b, highPower, lowPower }) {
    return [
      { id: "separate-terms", text: "Differentiate each term separately. The constant differentiates to 0." },
      { id: "recall-rule", text: "For axⁿ, multiply the coefficient by n and reduce the power by 1." },
      { id: "apply-rule", text: `Start with ${a}x${superscript(highPower)} → (${a} × ${highPower})x${superscript(highPower - 1)} and apply the same rule to ${b}x${superscript(lowPower)}.` }
    ];
  }
});

export const powerRuleNumericDefinition = defineQuestionDefinition({
  templateId: "question-template:y12:differentiation:basics:ao1:power-rule-value-at-point",
  courseScope: "y12",
  topicId: "topic:y12:differentiation:basics",
  assessmentObjective: "ao1",
  microSkillId: "skill:y12:differentiation:basics:power-rule",
  difficulty: "standard",
  prerequisiteTags: ["substitution", "integer-powers"],
  methodTags: ["power-rule", "evaluate-derivative"],
  vocabularyTags: ["vocab:derivative"],
  errorCategories: ["evaluated-function-not-derivative", "power-not-reduced", "omitted-linear-derivative", "evaluation-error"],
  diagnosticRules: {
    "evaluated-function-not-derivative": {
      kind: "recognition",
      supportNeed: "understand",
      supportMicroSkillId: "skill:y12:differentiation:basics:gradient-function",
      studentMessage: "The response used the original function rather than its derivative. Revisit what f′(x) represents before retrying."
    },
    "power-not-reduced": {
      kind: "execution",
      supportNeed: "ao1",
      studentMessage: "You chose differentiation, but the exponent change was not carried through correctly. Practise the execution step."
    },
    "omitted-linear-derivative": {
      kind: "execution",
      supportNeed: "ao1",
      studentMessage: "The method is appropriate, but one term was lost during execution. Practise differentiating term by term."
    },
    "evaluation-error": {
      kind: "execution",
      supportNeed: "ao1",
      studentMessage: "The derivative method is in place; focus on carrying the differentiation and substitution through accurately."
    }
  },
  defaultDiagnostic: { kind: "execution", supportNeed: "ao1" },
  responseType: "numeric",
  responseLabel: "Value of the derivative",
  placeholder: "Enter a number",
  parameterGenerator({ random }) {
    return {
      a: random.int(1, 5),
      n: random.int(2, 4),
      b: random.int(-6, 6),
      xValue: random.pick([-3, -2, 2, 3])
    };
  },
  promptRenderer({ xValue }) {
    return `Find the value of the derivative at x = ${xValue}.`;
  },
  mathRenderer({ a, n, b }) {
    return `f(x) = ${displayPolynomial([
      { coefficient: a, power: n },
      { coefficient: b, power: 1 }
    ])}`;
  },
  answerChecker(response, parameters) {
    const { a, n, b, xValue } = parameters;
    return numericFeedback(a * n * (xValue ** (n - 1)) + b, response, parameters);
  },
  workedSolutionGenerator({ a, n, b, xValue }) {
    const derivative = displayPolynomial([
      { coefficient: a * n, power: n - 1 },
      { coefficient: b, power: 0 }
    ]);
    const result = a * n * (xValue ** (n - 1)) + b;
    return [
      defineSolutionStep({
        id: "differentiate-first",
        kind: "working",
        label: "Find the gradient function",
        expression: `f′(x) = ${derivative}`,
        explanation: "Differentiate before substituting the x-value."
      }),
      defineSolutionStep({
        id: "substitute-x",
        kind: "working",
        label: `Substitute x = ${xValue}`,
        expression: `f′(${xValue}) = ${a * n}(${xValue})${superscript(n - 1)} ${b < 0 ? "−" : "+"} ${Math.abs(b)}`,
        explanation: "Substitute into the derivative, not the original function."
      }),
      defineSolutionStep({
        id: "evaluate",
        kind: "result",
        label: "Evaluate",
        expression: `f′(${xValue}) = ${result}`,
        explanation: "This is the gradient of the original curve at the stated x-value."
      })
    ];
  },
  hintSequenceGenerator({ xValue }) {
    return [
      { id: "differentiate-first", text: "Find f′(x) first. Do not substitute into the original function yet." },
      { id: "recall-power-rule", text: "Use d/dx(axⁿ) = anxⁿ⁻¹, and remember that d/dx(bx) = b." },
      { id: "substitute", text: `Once you have f′(x), substitute x = ${xValue}.` }
    ];
  }
});

const choiceOptionLabels = Object.freeze({
  correct({ a, n, b }) {
    return displayPolynomial([
      { coefficient: a * n, power: n - 1 },
      { coefficient: -b, power: 0 }
    ]);
  },
  "power-unchanged"({ a, n, b }) {
    return displayPolynomial([
      { coefficient: a * n, power: n },
      { coefficient: -b, power: 0 }
    ]);
  },
  "coefficient-unchanged"({ a, n, b }) {
    return displayPolynomial([
      { coefficient: a, power: n - 1 },
      { coefficient: -b, power: 0 }
    ]);
  },
  "linear-term-unchanged"({ a, n, b }) {
    return displayPolynomial([
      { coefficient: a * n, power: n - 1 },
      { coefficient: -b, power: 1 }
    ]);
  }
});

const choiceErrorCategories = Object.freeze({
  "power-unchanged": "power-not-reduced",
  "coefficient-unchanged": "coefficient-not-multiplied",
  "linear-term-unchanged": "linear-term-not-constant"
});

export const powerRuleChoiceDefinition = defineQuestionDefinition({
  templateId: "question-template:y12:differentiation:basics:ao1:power-rule-choice",
  courseScope: "y12",
  topicId: "topic:y12:differentiation:basics",
  assessmentObjective: "ao1",
  microSkillId: "skill:y12:differentiation:basics:power-rule",
  difficulty: "standard",
  prerequisiteTags: ["integer-powers"],
  methodTags: ["power-rule", "recognise-correct-result"],
  vocabularyTags: ["vocab:derivative", "vocab:coefficient"],
  errorCategories: ["power-not-reduced", "coefficient-not-multiplied", "linear-term-not-constant", "power-rule-error"],
  diagnosticRules: {
    "power-not-reduced": { kind: "recognition", supportNeed: "memorise", studentMessage: "The incorrect option reflects a rule-recall issue. Retrieve both parts of the power rule before choosing again." },
    "coefficient-not-multiplied": { kind: "recognition", supportNeed: "memorise", studentMessage: "The incorrect option suggests the coefficient change is not yet secure. Recall the full power rule before retrying." },
    "linear-term-not-constant": { kind: "recognition", supportNeed: "memorise", studentMessage: "The incorrect option suggests a recall gap about differentiating a linear term. Review the rule facts, then retry." },
    "power-rule-error": { kind: "recognition", supportNeed: "memorise", studentMessage: "Review the power rule facts before trying to recognise the correct derivative again." }
  },
  defaultDiagnostic: { kind: "recognition", supportNeed: "memorise" },
  responseType: "choice",
  parameterGenerator({ random }) {
    return {
      a: random.int(2, 6),
      n: random.int(2, 5),
      b: random.int(2, 6),
      optionOrder: random.shuffle(["correct", "power-unchanged", "coefficient-unchanged", "linear-term-unchanged"])
    };
  },
  promptRenderer() {
    return "Which derivative is correct?";
  },
  mathRenderer({ a, n, b }) {
    return `y = ${displayPolynomial([
      { coefficient: a, power: n },
      { coefficient: -b, power: 1 }
    ])}`;
  },
  responseOptionsRenderer(parameters) {
    return parameters.optionOrder.map((id) => Object.freeze({ id, label: choiceOptionLabels[id](parameters) }));
  },
  answerChecker(response) {
    if (response === "correct") {
      return { tone: "correct", title: "Correct", message: "That applies the power rule to both terms." };
    }
    const errorCategory = choiceErrorCategories[response] ?? "power-rule-error";
    const messages = {
      "power-not-reduced": "The coefficient was multiplied correctly, but the power must also reduce by 1.",
      "coefficient-not-multiplied": "The new power is right, but the coefficient must be multiplied by the old power.",
      "linear-term-not-constant": "A linear term differentiates to a constant; the x should disappear."
    };
    return {
      tone: "incorrect",
      errorCategory,
      title: "Check the power rule",
      message: messages[errorCategory] ?? "Multiply by the old power, reduce the power by 1, and differentiate the linear term to a constant."
    };
  },
  workedSolutionGenerator({ a, n, b }) {
    const original = displayPolynomial([{ coefficient: a, power: n }, { coefficient: -b, power: 1 }]);
    const derivative = choiceOptionLabels.correct({ a, n, b });
    return [
      defineSolutionStep({
        id: "apply-rule-to-each-term",
        kind: "working",
        label: "Differentiate each term",
        expression: `d/dx(${original})`,
        explanation: "Use the power rule on the power term and turn the linear term into a constant."
      }),
      defineSolutionStep({
        id: "correct-choice",
        kind: "result",
        label: "Result",
        expression: `dy/dx = ${derivative}`,
        explanation: "This matches the correct option."
      })
    ];
  },
  hintSequenceGenerator() {
    return [
      { id: "inspect-power", text: "Check the power term first: the coefficient should be multiplied by the old power." },
      { id: "inspect-exponent", text: "After multiplying, the exponent must decrease by 1." },
      { id: "inspect-linear", text: "A linear term differentiates to a constant, so its x disappears." }
    ];
  }
});

export const powerRuleReasoningDefinition = defineQuestionDefinition({
  templateId: "question-template:y12:differentiation:basics:ao2:explain-power-rule",
  courseScope: "y12",
  topicId: "topic:y12:differentiation:basics",
  assessmentObjective: "ao2",
  microSkillId: "skill:y12:differentiation:basics:power-rule",
  difficulty: "standard",
  prerequisiteTags: ["integer-powers"],
  methodTags: ["power-rule", "explain-rule"],
  vocabularyTags: ["vocab:derivative", "vocab:coefficient"],
  errorCategories: ["missing-coefficient-change", "missing-power-change", "incomplete-explanation"],
  diagnosticRules: {
    "missing-coefficient-change": { kind: "recognition", supportNeed: "memorise", studentMessage: "Your explanation is missing one recalled part of the power rule. Retrieve the rule, then explain both changes." },
    "missing-power-change": { kind: "recognition", supportNeed: "memorise", studentMessage: "Your explanation is missing the exponent change. Retrieve the full rule before trying the explanation again." },
    "incomplete-explanation": { kind: "recognition", supportNeed: "memorise", studentMessage: "This looks like a recall gap in the two-part power rule. Review the rule before rewriting the explanation." }
  },
  defaultDiagnostic: { kind: "recognition", supportNeed: "memorise" },
  responseType: "short-reasoning",
  responseLabel: "Explain the rule in words",
  placeholder: "Write one or two sentences.",
  parameterGenerator({ random }) {
    return {
      a: random.int(2, 6),
      n: random.int(2, 5)
    };
  },
  promptRenderer({ a, n }) {
    return `Explain what happens to the coefficient and the power when differentiating ${a}x${superscript(n)}.`;
  },
  mathRenderer({ a, n }) {
    return `${a}x${superscript(n)} → ?`;
  },
  answerChecker(response) {
    const text = String(response ?? "").toLowerCase();
    const mentionsMultiplier = /(multiply|times|coefficient|bring.*down|power.*coefficient)/.test(text);
    const mentionsPowerChange = /(subtract|minus|reduce|decrease|lower|one less|power.*1)/.test(text);
    if (mentionsMultiplier && mentionsPowerChange) {
      return { tone: "correct", title: "Clear explanation", message: "You have described both parts of the power rule." };
    }
    if (!mentionsMultiplier && mentionsPowerChange) {
      return {
        tone: "warning",
        errorCategory: "missing-coefficient-change",
        title: "Add what happens to the coefficient",
        message: "You described the exponent change; also say how the old power changes the coefficient."
      };
    }
    if (mentionsMultiplier && !mentionsPowerChange) {
      return {
        tone: "warning",
        errorCategory: "missing-power-change",
        title: "Add what happens to the power",
        message: "You described the coefficient change; also say that the exponent decreases by 1."
      };
    }
    return {
      tone: "warning",
      errorCategory: "incomplete-explanation",
      title: "Add both parts of the rule",
      message: "Explain what happens to the coefficient and what happens to the power."
    };
  },
  workedSolutionGenerator({ a, n }) {
    return [
      defineSolutionStep({
        id: "coefficient-change",
        kind: "reasoning",
        label: "Coefficient",
        expression: `${a} × ${n} = ${a * n}`,
        explanation: "Multiply the old coefficient by the old power."
      }),
      defineSolutionStep({
        id: "power-change",
        kind: "reasoning",
        label: "Power",
        expression: `${n} → ${n - 1}`,
        explanation: "Reduce the power by 1."
      }),
      defineSolutionStep({
        id: "combined-rule",
        kind: "result",
        label: "Together",
        expression: `${a}x${superscript(n)} → ${a * n}x${superscript(n - 1)}`,
        explanation: "Both changes happen in one application of the power rule."
      })
    ];
  },
  hintSequenceGenerator() {
    return [
      { id: "two-changes", text: "There are two separate changes to describe." },
      { id: "coefficient-cue", text: "One change affects the coefficient: think about where the old power goes." },
      { id: "power-cue", text: "The other change affects the exponent: compare the old and new powers." }
    ];
  }
});

export const powerRuleQuestionDefinitions = Object.freeze([
  powerRuleAlgebraicDefinition,
  powerRuleNumericDefinition,
  powerRuleChoiceDefinition,
  powerRuleReasoningDefinition
]);
