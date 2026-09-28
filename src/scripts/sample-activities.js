export const learningModeOrder = Object.freeze([
  "understand",
  "memorise",
  "ao1",
  "ao2",
  "ao3"
]);

export const learningModes = Object.freeze({
  understand: Object.freeze({
    label: "Understand",
    descriptor: "Explore",
    activities: Object.freeze([
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:understand:curve-tangent-gradient",
        microSkillId: "skill:y12:differentiation:basics:gradient-on-curve",
        kicker: "Understand", overline: "Gradient on a curve",
        title: "What does gradient mean on a curve?",
        body: "Move the tangent along the curve. Decide whether the gradient is positive, negative or zero before using the numerical value to check.",
        bodySegments: Object.freeze([
          "Move the ",
          Object.freeze({ termId: "vocab:tangent" }),
          " along the curve and decide whether the ",
          Object.freeze({ termId: "vocab:gradient" }),
          " is positive, negative or zero before using the numerical value to check."
        ]),
        calloutLabel: "Look for", callout: "Gradient describes local steepness and direction. The height of the point on the curve is a different quantity.",
        formula: "curve → tangent → gradient", caption: "Move the point to connect the curve's local direction with its tangent gradient.", basicsUnderstand: true
      }),
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:understand:gradient-function",
        microSkillId: "skill:y12:differentiation:basics:gradient-function",
        kicker: "Understand", overline: "Build the gradient function",
        title: "Can tangent gradients make a new graph?",
        body: "At several x-values, inspect the tangent gradient and plot that value at the same x-coordinate on a second graph. Then reveal the complete gradient function.",
        bodySegments: Object.freeze([
          "At several x-values, inspect the tangent gradient and use it to construct the ",
          Object.freeze({ termId: "vocab:derivative" }),
          " as a ",
          Object.freeze({ termId: "vocab:gradient-function" }),
          ". Then reveal the complete curve."
        ]),
        calloutLabel: "Key idea", callout: "The height of f′(x) represents the gradient of f(x), not the height of f(x).",
        formula: "x ↦ gradient of f at x", caption: "Construct the derivative from local gradients before seeing its full curve.", basicsUnderstand: true
      }),
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:understand:polynomial-explorer",
        microSkillId: "skill:y12:differentiation:basics:gradient-function",
        kicker: "Understand", overline: "Polynomial explorer",
        title: "Does the idea survive when the function changes?",
        body: "Type a polynomial (up to degree 6) or edit its coefficients, then move the tangent. The derivative graph must still record the gradient of the original function at every x-value.",
        calloutLabel: "Keep fixed", callout: "Function, tangent and derivative stay linked. Changing the algebra changes the curves, not what the derivative means.",
        formula: "f(x) ↔ tangent ↔ f′(x)", caption: "Type a polynomial such as 3x^4 − 2x + 7, or use the coefficient controls, then test the gradient-function relationship.", basicsUnderstand: true
      }),
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:understand:derivative-notation",
        microSkillId: "skill:y12:differentiation:basics:derivative-notation",
        kicker: "Understand", overline: "Derivative notation",
        title: "Three notations, two different jobs",
        body: "Compare f′(x), dy/dx and d/dx. The first two name or represent a derivative; d/dx is an instruction that acts on an expression.",
        bodySegments: Object.freeze([
          "Compare f′(x), dy/dx and d/dx. The first two represent a ",
          Object.freeze({ termId: "vocab:derivative" }),
          "; the ",
          Object.freeze({ termId: "vocab:d-dx-operator" }),
          " is an instruction that acts on an expression."
        ]),
        calloutLabel: "Distinguish", callout: "dy/dx is a derivative. d/dx is the operator meaning ‘differentiate with respect to x’.",
        formula: "d/dx [f(x)] = f′(x)", caption: "Read the notation by asking whether it names a result or gives an instruction.", basicsUnderstand: true
      }),
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:understand:differentiation-machine",
        microSkillId: "skill:y12:differentiation:basics:differentiation-operator",
        kicker: "Understand", overline: "The d/dx operator",
        title: "Treat d/dx as a differentiation machine",
        body: "Place a whole expression inside the operator. The machine differentiates that entire expression with respect to x and outputs its derivative.",
        calloutLabel: "Operator", callout: "The brackets matter: d/dx acts on the complete expression placed inside them.",
        formula: "d/dx [ expression ] → derivative", caption: "Change the input and watch the differentiation operator produce a derivative.", basicsUnderstand: true
      }),
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:understand:calculus-backstory",
        microSkillId: "skill:y12:differentiation:basics:derivative-notation",
        kicker: "Understand", overline: "Calculus has a backstory",
        title: "Why are there several derivative notations?",
        body: "Newton, Leibniz and Lagrange developed or popularised different ways to express change. Their notations emphasise different ideas and still coexist today.",
        calloutLabel: "History, briefly", callout: "Newton and Leibniz developed calculus independently; their priority dispute became famously bitter.",
        formula: "ẏ   dy/dx   f′(x)", caption: "Different historical viewpoints left us several useful notations.", basicsUnderstand: true
      }),
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:understand:power-rule-pattern",
        microSkillId: "skill:y12:differentiation:basics:power-rule",
        kicker: "Understand", overline: "Power-rule pattern",
        title: "What pattern connects each power to its derivative?",
        body: "Compare several differentiated powers before revealing the general rule. Focus on what happens to the coefficient and the power each time.",
        calloutLabel: "Notice", callout: "The old power multiplies the coefficient, then the power decreases by 1.",
        formula: "d/dx (axⁿ) = anxⁿ⁻¹", caption: "Generalise only after the repeated pattern is visible.", basicsUnderstand: true
      }),
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:understand:term-by-term",
        microSkillId: "skill:y12:differentiation:basics:term-by-term",
        kicker: "Understand", overline: "Term-by-term differentiation",
        title: "A polynomial differentiates one term at a time",
        body: "Apply the differentiation rule separately to every term in a sum or difference, including constants, then combine the derivative terms again.",
        calloutLabel: "Structure", callout: "Addition and subtraction let us differentiate each term independently.",
        formula: "d/dx [u ± v] = du/dx ± dv/dx", caption: "Follow each term through the operator before recombining the result.", basicsUnderstand: true
      })
    ])
  }),
  memorise: Object.freeze({
    label: "Memorise",
    descriptor: "Recall",
    activities: Object.freeze([
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:memorise:derivative-notation",
        microSkillId: "skill:y12:differentiation:basics:derivative-notation",
        memoryLabView: "learn",
        kicker: "Memorise · Memory Lab",
        overline: "Learn",
        title: "Build a compact mental reference",
        body: "Build one compact reference for the facts and vocabulary that support this topic.",
        calloutLabel: "Memory Lab",
        callout: "The Learn, Flashcards and Games views all project the same shared MemoryItem and VocabularyTerm content.",
        formula: "f′(x), dy/dx, d/dx",
        caption: "Vocabulary definitions come from the shared Word Bank source rather than a topic-specific glossary."
      }),
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:memorise:power-rule-recall",
        microSkillId: "skill:y12:differentiation:basics:power-rule",
        memoryLabView: "flashcards",
        kicker: "Memorise · Memory Lab",
        overline: "Flashcards",
        title: "Recall before you reveal",
        body: "Recall the general rule before revealing the result.",
        calloutLabel: "Memory Lab",
        callout: "The power rule is retrieved from the same fact bank used by Learn and Games.",
        formula: "d/dx (axⁿ) = ?",
        caption: "Formula-to-result and result-to-formula cards share the same source item."
      }),
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:memorise:special-cases",
        microSkillId: "skill:y12:differentiation:basics:constant-and-linear",
        memoryLabView: "flashcards",
        memoryLabNavTarget: false,
        kicker: "Memorise · Memory Lab",
        overline: "Special cases",
        title: "Special differentiation cases",
        body: "Retrieve the small derivatives that should become automatic: constants, x, ax, reciprocal powers and common square-root forms.",
        calloutLabel: "Know the result and the reason",
        callout: "Recall these directly for speed, but keep the rewrite route underneath them: reciprocals are negative powers and roots are fractional powers.",
        formula: "c→0 · x→1 · ax→a · a/x→−a/x² · a√x→a/(2√x)",
        caption: "Direct-recall cards include a/x, a/xⁿ, a√x and a/√x; the separate Rewrite Powers activity still explains how the power rule produces them."
      }),
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:memorise:rewrite-powers",
        microSkillId: "skill:y12:differentiation:basics:rewrite-powers",
        memoryLabView: "games",
        memoryLabGame: "sort",
        memoryLabNavTarget: false,
        kicker: "Memorise · Memory Lab",
        overline: "Rewrite cues",
        title: "Roots and reciprocals as powers",
        body: "Recognise when an expression needs rewriting before the power rule is applied.",
        calloutLabel: "Remember",
        callout: "Reciprocals become negative powers; roots become fractional powers.",
        formula: "1/xⁿ = x⁻ⁿ   ·   √x = x¹ᐟ²",
        caption: "The shared Sort game provides retrieval without creating a topic-specific interaction."
      }),
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:memorise:term-by-term",
        microSkillId: "skill:y12:differentiation:basics:term-by-term",
        memoryLabView: "games",
        memoryLabNavTarget: false,
        kicker: "Memorise · Memory Lab",
        overline: "Method fact",
        title: "Differentiate term by term",
        body: "Recall what to do when a polynomial is written as a sum or difference.",
        calloutLabel: "Remember",
        callout: "Differentiate each term separately, keeping the plus and minus signs between terms.",
        formula: "d/dx [u ± v] = du/dx ± dv/dx",
        caption: "The fact uses the same MemoryItem projection as the rest of the topic."
      }),
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:memorise:vocabulary-recall",
        microSkillId: "skill:y12:differentiation:basics:derivative-notation",
        memoryLabView: "games",
        memoryLabGame: "match",
        memoryLabNavTarget: false,
        kicker: "Memorise · Memory Lab",
        overline: "Vocabulary",
        title: "Differentiation vocabulary",
        body: "Connect the topic's notation and language to their meanings using the shared vocabulary source.",
        calloutLabel: "Word Bank",
        callout: "Every vocabulary card is generated from VocabularyTerm, so its definition matches the Word Bank exactly.",
        formula: "term ↔ meaning",
        caption: "Match remains keyboard, touch and pointer accessible; resetting creates another sample from the shared bank."
      }),
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:memorise:memory-games",
        microSkillId: "skill:y12:differentiation:basics:power-rule",
        memoryLabView: "games",
        memoryLabGame: "build",
        memoryLabNavTarget: true,
        memoryLabGames: Object.freeze(["build", "missing-piece", "sort", "impostor"]),
        kicker: "Memorise · Memory Lab",
        overline: "Games",
        title: "Retrieve the same facts in different ways",
        body: "Switch between Build, Missing Piece, Sort and Spot the Impostor without changing the underlying topic content.",
        calloutLabel: "Memory Lab",
        callout: "Reusable game engines take declarative labels, tokens, buckets and choices rather than topic-specific interfaces.",
        formula: "recall → classify → reconstruct",
        caption: "The Step 19 game set keeps its stable activity identity for existing progress records."
      }),
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:memorise:mixed-review",
        microSkillId: "skill:y12:differentiation:basics:power-rule",
        memoryLabView: "review",
        memoryLabNavTarget: true,
        kicker: "Memorise · Memory Lab",
        overline: "Review",
        title: "Mix retrieval across the topic",
        body: "Use Rapid Recall, Diagram Recall and a mixed sequence that reuses the same retrieval engines from Learn and Games.",
        calloutLabel: "Memory Lab",
        callout: "Time pressure is optional. Mixed review reports completion and security through the same shared progress layer.",
        formula: "facts ↔ notation ↔ diagram ↔ rule",
        caption: "Memory Mix keeps its Step 20 stable identity while the Step 34 content bank becomes production-ready."
      })
    ])
  }),

  ao1: Object.freeze({
    label: "AO1",
    descriptor: "Practise",
    activities: Object.freeze([
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:ao1:power-rule",
        microSkillId: "skill:y12:differentiation:basics:power-rule",
        kicker: "AO1 · Practise", overline: "Power-rule fluency",
        title: "Differentiate powers accurately",
        body: "Use generated algebraic, numerical and multiple-choice practice to make the power rule reliable.",
        calloutLabel: "AO1 focus", callout: "Carry out the familiar method accurately. Hints stay close to the current line of working.",
        formula: "d/dx (axⁿ) = anxⁿ⁻¹", caption: "Each attempt is tagged to the exact micro-skill and can route a misconception to focused support."
      }),
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:ao1:rewrite-and-differentiate",
        microSkillId: "skill:y12:differentiation:basics:rewrite-powers",
        kicker: "AO1 · Practise", overline: "Rewrite then differentiate",
        title: "Turn roots and reciprocals into power-rule form",
        body: "Rewrite reciprocals with negative powers and roots with fractional powers before applying the power rule.",
        calloutLabel: "AO1 focus", callout: "The setup choice is small and familiar: rewrite first, then execute the standard rule.",
        formula: "1/xⁿ = x⁻ⁿ   ·   √x = x¹ᐟ²", caption: "Generated questions diagnose whether the gap is rewriting or carrying out the derivative."
      }),
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:ao1:term-by-term",
        microSkillId: "skill:y12:differentiation:basics:term-by-term",
        kicker: "AO1 · Practise", overline: "Term by term",
        title: "Differentiate a polynomial without losing a term",
        body: "Apply the rule to every term independently, including the linear term and constant, then recombine the result.",
        calloutLabel: "AO1 focus", callout: "This is procedural fluency: the method is known, so accuracy and completeness matter.",
        formula: "d/dx [u ± v] = du/dx ± dv/dx", caption: "Worked solutions keep each original term visible until the derivative is recombined."
      }),
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:ao1:graph-matching",
        microSkillId: "skill:y12:differentiation:basics:function-derivative-match",
        kicker: "AO1 · Practise", overline: "Function ↔ derivative",
        title: "Match a function with its gradient-function graph",
        body: "Use familiar polynomial shapes, increasing/decreasing regions and horizontal tangents to identify the corresponding derivative graph.",
        calloutLabel: "AO1 focus", callout: "The derivative graph records gradient, not the height of the original function.",
        formula: "f increasing ⇒ f′ > 0", caption: "Matching questions reuse the same gradient-function relationship established in Understand."
      })
    ])
  }),
  ao2: Object.freeze({
    label: "AO2",
    descriptor: "Explain",
    activities: Object.freeze([
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:ao2:explain-gradient-function",
        microSkillId: "skill:y12:differentiation:basics:function-derivative-match",
        kicker: "AO2 · Explain", overline: "Connect representations",
        title: "Explain what a derivative value says about the original graph",
        body: "Use tangent gradient, derivative sign and increasing/decreasing behaviour as evidence rather than simply stating a result.",
        calloutLabel: "AO2 focus", callout: "A complete explanation links the derivative value to the local behaviour of f.",
        formula: "f′(a) = tangent gradient at x = a", caption: "Short reasoning is checked for the mathematical links that make the explanation valid."
      }),
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:ao2:diagnose-power-rule",
        microSkillId: "skill:y12:differentiation:basics:power-rule",
        kicker: "AO2 · Explain", overline: "Explain the rule",
        title: "Say why the power rule changes both coefficient and exponent",
        body: "Describe both parts of the rule clearly enough that someone else could carry it out correctly.",
        calloutLabel: "AO2 focus", callout: "Naming the final derivative is not enough; explain the coefficient and power changes.",
        formula: "axⁿ → anxⁿ⁻¹", caption: "Feedback distinguishes missing coefficient reasoning from missing exponent reasoning."
      }),
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:ao2:error-correction",
        microSkillId: "skill:y12:differentiation:basics:error-correction",
        kicker: "AO2 · Explain", overline: "Error correction",
        title: "Identify the misconception before correcting the derivative",
        body: "Explain what went wrong in a student's method, then repair the mathematics rather than replacing only the final answer.",
        calloutLabel: "AO2 focus", callout: "Diagnosis and correction are separate parts of the task.",
        formula: "incorrect method → misconception → correction", caption: "The generated cases include rewriting errors that expose why the method failed."
      }),
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:ao2:unknown-coefficients",
        microSkillId: "skill:y12:differentiation:basics:unknown-coefficients",
        kicker: "AO2 · Explain", overline: "Use derivative information",
        title: "Work backwards from gradient conditions to unknown coefficients",
        body: "Differentiate an algebraic model, translate derivative conditions into equations and solve for the unknown coefficient.",
        calloutLabel: "AO2 focus", callout: "The reasoning is in deciding how the derivative information constrains the original function.",
        formula: "derivative conditions → equations → coefficient", caption: "Generated values are constructed from known integer coefficients so every case is internally consistent."
      })
    ])
  }),
  ao3: Object.freeze({
    label: "AO3",
    descriptor: "Apply",
    activities: Object.freeze([
      Object.freeze({
        activityId: "activity:y12:differentiation:basics:ao3:simple-applications",
        microSkillId: "skill:y12:differentiation:basics:simple-applications",
        kicker: "AO3 · Apply", overline: "Simple applications",
        title: "Choose differentiation, calculate a rate and interpret it",
        body: "Use a short unfamiliar model, decide that a derivative is required, calculate the instantaneous rate and return to the context.",
        calloutLabel: "AO3 focus", callout: "The calculus is deliberately basic; the challenge is selecting and interpreting the method in context.",
        formula: "model → derivative → value → interpretation", caption: "The application set keeps supporting formulae in hints and solutions rather than crowding the problem."
      })
    ])
  })
});
