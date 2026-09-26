function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

export const basicsDifferentiationGamePack = deepFreeze({
  build: {
    id: "memory-game:y12:differentiation:basics:build-power-rule",
    label: "Build",
    prompt: "Build the right-hand side of the general power rule.",
    context: "d/dx (axⁿ) =",
    slots: 3,
    tokens: [
      { id: "a", label: "a" },
      { id: "n", label: "n" },
      { id: "x-n-minus-1", label: "xⁿ⁻¹" },
      { id: "x-n", label: "xⁿ" },
      { id: "n-minus-1", label: "n − 1" }
    ],
    answer: ["a", "n", "x-n-minus-1"],
    successMessage: "That builds anxⁿ⁻¹: multiply by the power, then reduce the power by 1."
  },
  missingPiece: {
    id: "memory-game:y12:differentiation:basics:missing-power-rule",
    label: "Missing piece",
    prompt: "Which expression belongs in the missing exponent?",
    expression: "d/dx (xⁿ) = nx^( ? )",
    options: [
      { id: "n-minus-1", label: "n − 1" },
      { id: "n", label: "n" },
      { id: "n-plus-1", label: "n + 1" },
      { id: "one-minus-n", label: "1 − n" }
    ],
    answerId: "n-minus-1",
    successMessage: "Correct. The exponent decreases by 1."
  },
  sort: {
    id: "memory-game:y12:differentiation:basics:sort-rewrite-first",
    label: "Sort",
    prompt: "Sort each expression by what you should do before applying the power rule.",
    buckets: [
      { id: "ready", label: "Power rule ready", description: "Already written as a power of x." },
      { id: "rewrite", label: "Rewrite first", description: "Rewrite a reciprocal or root using indices first." }
    ],
    items: [
      { id: "x5", label: "x⁵", bucketId: "ready" },
      { id: "three-x-neg2", label: "3x⁻²", bucketId: "ready" },
      { id: "x-half", label: "x¹ᐟ²", bucketId: "ready" },
      { id: "reciprocal-x3", label: "1/x³", bucketId: "rewrite" },
      { id: "root-x", label: "√x", bucketId: "rewrite" },
      { id: "reciprocal-root", label: "1/√x", bucketId: "rewrite" }
    ],
    successMessage: "Correct. Reciprocals and roots are rewritten as powers before differentiating."
  },
  impostor: {
    id: "memory-game:y12:differentiation:basics:impostor-basic-derivatives",
    label: "Impostor",
    prompt: "One derivative is incorrect. Which is the impostor?",
    options: [
      { id: "x5", label: "d/dx (x⁵) = 5x⁴" },
      { id: "four-x", label: "d/dx (4x) = 4" },
      { id: "constant", label: "d/dx (7) = 0" },
      { id: "wrong-x3", label: "d/dx (x³) = 3x³" }
    ],
    answerId: "wrong-x3",
    successMessage: "Correct. The power should reduce by 1, so d/dx (x³) = 3x²."
  }
});




export const firstPrinciplesGamePack = deepFreeze({
  build: {
    id: "memory-game:y12:differentiation:first-principles:build-difference-quotient",
    label: "Build",
    prompt: "Build the difference quotient from left to right.",
    context: "chord gradient =",
    slots: 3,
    tokens: [
      { id: "numerator", label: "f(x+h) − f(x)" },
      { id: "divide", label: "÷" },
      { id: "h", label: "h" },
      { id: "sum", label: "f(x+h) + f(x)" },
      { id: "x-plus-h", label: "x+h" }
    ],
    answer: ["numerator", "divide", "h"],
    successMessage: "Correct. Vertical change divided by horizontal change gives the difference quotient."
  },
  missingPiece: {
    id: "memory-game:y12:differentiation:first-principles:missing-limit",
    label: "Missing piece",
    prompt: "Which piece completes the first-principles definition?",
    expression: "f′(x) = lim h→0 [ f(x+h) − f(x) ] / ?",
    options: [
      { id: "h", label: "h" }, { id: "x", label: "x" }, { id: "x-plus-h", label: "x+h" }, { id: "zero", label: "0" }
    ],
    answerId: "h",
    successMessage: "Correct. h is the horizontal change from P to Q."
  },
  sort: {
    id: "memory-game:y12:differentiation:first-principles:sort-meaning",
    label: "Sort",
    prompt: "Sort each statement by whether it describes the chord or the tangent.",
    buckets: [
      { id: "chord", label: "Chord / secant", description: "Uses two distinct points P and Q." },
      { id: "tangent", label: "Tangent", description: "Has the curve's instantaneous gradient at P." }
    ],
    items: [
      { id: "two-points", label: "Uses P and Q", bucketId: "chord" },
      { id: "difference-quotient", label: "Gradient is [f(x+h)−f(x)]/h", bucketId: "chord" },
      { id: "approximation", label: "Approximates the gradient at P", bucketId: "chord" },
      { id: "one-point", label: "Matches the curve's gradient at P", bucketId: "tangent" },
      { id: "derivative", label: "Gradient is f′(x)", bucketId: "tangent" }
    ],
    successMessage: "Correct. The chord gives the temporary two-point approximation; the tangent gives the limiting gradient."
  },
  impostor: {
    id: "memory-game:y12:differentiation:first-principles:impostor-limit",
    label: "Impostor",
    prompt: "One statement is incorrect. Which is the impostor?",
    options: [
      { id: "approaches", label: "h→0 means h approaches zero." },
      { id: "chord", label: "The difference quotient is a chord gradient." },
      { id: "tangent", label: "As Q approaches P, the chord gradient approaches the tangent gradient." },
      { id: "equals-zero", label: "h→0 means substitute h=0 into the original quotient immediately." }
    ],
    answerId: "equals-zero",
    successMessage: "Correct. Approaching zero is not the same as substituting h=0 before simplification."
  }
});

export const tangentsNormalsGamePack = deepFreeze({
  build:{id:"memory-game:y12:differentiation:tangents-normals:build-line",label:"Build",prompt:"Build point-slope form from left to right.",context:"line equation:",slots:3,tokens:[{id:"y",label:"y − y₁"},{id:"eq",label:"="},{id:"mx",label:"m(x − x₁)"},{id:"plus",label:"+"},{id:"recip",label:"−1/m"}],answer:["y","eq","mx"],successMessage:"Correct. A point and gradient give y − y₁ = m(x − x₁)."},
  missingPiece:{id:"memory-game:y12:differentiation:tangents-normals:missing-normal",label:"Missing piece",prompt:"Complete the normal-gradient rule for a non-zero tangent gradient.",expression:"m_normal = ?",options:[{id:"neg-recip",label:"−1/m_tangent"},{id:"same",label:"m_tangent"},{id:"neg",label:"−m_tangent"},{id:"recip",label:"1/m_tangent"}],answerId:"neg-recip",successMessage:"Correct. Perpendicular gradients are negative reciprocals."},
  sort:{id:"memory-game:y12:differentiation:tangents-normals:sort-lines",label:"Sort",prompt:"Sort each fact to tangent or normal.",buckets:[{id:"tangent",label:"Tangent",description:"Same gradient as the curve."},{id:"normal",label:"Normal",description:"Perpendicular to the tangent."}],items:[{id:"derivative",label:"gradient f′(a)",bucketId:"tangent"},{id:"same-gradient",label:"same gradient as curve",bucketId:"tangent"},{id:"perp",label:"perpendicular to tangent",bucketId:"normal"},{id:"negative-recip",label:"negative reciprocal gradient",bucketId:"normal"}],successMessage:"Correct. The derivative gives the tangent gradient; the normal is perpendicular."},
  impostor:{id:"memory-game:y12:differentiation:tangents-normals:impostor",label:"Impostor",prompt:"Which statement is incorrect?",options:[{id:"point",label:"Tangent and normal pass through the same point of contact."},{id:"tangent",label:"m_tangent=f′(a)."},{id:"normal",label:"For non-zero m, m_normal=−1/m_tangent."},{id:"wrong",label:"A horizontal tangent has a horizontal normal."}],answerId:"wrong",successMessage:"Correct. A horizontal tangent has a vertical normal."}
});


export const stationaryPointsGamePack = deepFreeze({
  build:{id:"memory-game:y12:differentiation:stationary-points:build-sign",label:"Build",prompt:"Build the local-maximum sign pattern from left to right.",context:"f′ around a stationary point:",slots:3,tokens:[{id:"plus",label:"+"},{id:"zero",label:"0"},{id:"minus",label:"−"},{id:"plus2",label:"+"}],answer:["plus","zero","minus"],successMessage:"Correct. Increasing then decreasing gives a local maximum."},
  missingPiece:{id:"memory-game:y12:differentiation:stationary-points:missing-zero",label:"Missing piece",prompt:"Complete the limitation of the second-derivative test.",expression:"f″(a)=0 ⇒ ?",options:[{id:"inc",label:"inconclusive"},{id:"max",label:"maximum"},{id:"min",label:"minimum"},{id:"inf",label:"stationary inflection"}],answerId:"inc",successMessage:"Correct. Zero second derivative does not classify the stationary point."},
  sort:{id:"memory-game:y12:differentiation:stationary-points:sort",label:"Sort",prompt:"Sort each derivative pattern by behaviour.",buckets:[{id:"turn",label:"Turns",description:"Derivative changes sign."},{id:"no-turn",label:"Does not turn",description:"Derivative keeps the same sign."}],items:[{id:"max",label:"+ → 0 → −",bucketId:"turn"},{id:"min",label:"− → 0 → +",bucketId:"turn"},{id:"inf-plus",label:"+ → 0 → +",bucketId:"no-turn"},{id:"inf-minus",label:"− → 0 → −",bucketId:"no-turn"}],successMessage:"Correct. A turn requires a change in the sign of f′."},
  impostor:{id:"memory-game:y12:differentiation:stationary-points:impostor",label:"Impostor",prompt:"Which statement is incorrect?",options:[{id:"s",label:"At a stationary point, f′(a)=0."},{id:"max",label:"+→0→− gives a local maximum."},{id:"min",label:"−→0→+ gives a local minimum."},{id:"wrong",label:"If f″(a)=0, the point must be a stationary inflection."}],answerId:"wrong",successMessage:"Correct. f″(a)=0 is inconclusive."}
});


export const increasingDecreasingGamePack = deepFreeze({
  build:{id:"memory-game:y12:differentiation:increasing-decreasing:build",label:"Build",prompt:"Build the increasing rule.",context:"f increasing when",slots:3,tokens:[{id:"fp",label:"f′(x)"},{id:"gt",label:">"},{id:"zero",label:"0"},{id:"lt",label:"<"}],answer:["fp","gt","zero"],successMessage:"Correct. Positive derivative means increasing."},
  missingPiece:{id:"memory-game:y12:differentiation:increasing-decreasing:missing",label:"Missing piece",prompt:"Complete the decreasing rule.",expression:"f decreasing where f′(x) ? 0",options:[{id:"lt",label:"<"},{id:"gt",label:">"},{id:"eq",label:"="}],answerId:"lt",successMessage:"Correct. Negative derivative means decreasing."},
  sort:{id:"memory-game:y12:differentiation:increasing-decreasing:sort",label:"Sort",prompt:"Sort each sign or description by behaviour.",buckets:[{id:"inc",label:"Increasing",description:"Rises left-to-right."},{id:"dec",label:"Decreasing",description:"Falls left-to-right."}],items:[{id:"p",label:"f′>0",bucketId:"inc"},{id:"rise",label:"positive tangent gradient",bucketId:"inc"},{id:"n",label:"f′<0",bucketId:"dec"},{id:"fall",label:"negative tangent gradient",bucketId:"dec"}],successMessage:"Correct. Gradient sign and curve direction agree."},
  impostor:{id:"memory-game:y12:differentiation:increasing-decreasing:impostor",label:"Impostor",prompt:"Which statement is incorrect?",options:[{id:"a",label:"f′>0 means increasing."},{id:"b",label:"f′<0 means decreasing."},{id:"c",label:"Roots of f′ can be interval boundaries."},{id:"wrong",label:"f′=0 means the function is decreasing."}],answerId:"wrong",successMessage:"Correct. Zero derivative marks a stationary value, not a decreasing interval."}
});


const integrationIntroGamePack=Object.freeze({
 build:{id:"memory-game:y12:integration:introduction:build",label:"Build",prompt:"Build the integration power rule in student language.",context:"integrate axⁿ:",slots:3,tokens:[{id:"add",label:"add 1 to the power"},{id:"divide",label:"divide by the new power"},{id:"c",label:"add C"},{id:"minus",label:"subtract 1 from the power"}],answer:["add","divide","c"],successMessage:"Correct. Reverse the differentiation power rule, then add C."},
 missingPiece:{id:"memory-game:y12:integration:introduction:missing",label:"Missing piece",prompt:"Complete the general indefinite integral.",expression:"∫2x dx = x² + ?",options:[{id:"c",label:"C"},{id:"zero",label:"0"},{id:"x",label:"x"}],answerId:"c",successMessage:"Correct. The family needs +C."},
 sort:{id:"memory-game:y12:integration:introduction:sort",label:"Sort",prompt:"Sort each statement by integration behaviour.",buckets:[{id:"routine",label:"Routine power rule",description:"Can use add-one/divide."},{id:"exception",label:"Exception",description:"Do not use the routine rule."}],items:[{id:"x2",label:"x²",bucketId:"routine"},{id:"root",label:"x¹ᐟ²",bucketId:"routine"},{id:"neg2",label:"x⁻²",bucketId:"routine"},{id:"neg1",label:"x⁻¹",bucketId:"exception"}],successMessage:"Correct. Only n=−1 is excluded from this routine rule."},
 impostor:{id:"memory-game:y12:integration:introduction:impostor",label:"Impostor",prompt:"Which statement is incorrect?",options:[{id:"a",label:"Integration can reverse differentiation."},{id:"b",label:"Indefinite antiderivatives require +C."},{id:"c",label:"Sums can be integrated term by term."},{id:"wrong",label:"The routine power rule works when n=−1."}],answerId:"wrong",successMessage:"Correct. n=−1 is the exception."}
});


const definiteIndefiniteGamePack=Object.freeze({
 build:{id:"memory-game:y12:integration:definite-indefinite:build",label:"Build",prompt:"Build the definite-integration workflow.",context:"For ∫ₐᵇf(x)dx:",slots:3,tokens:[{id:"integrate",label:"integrate to find F(x)"},{id:"brackets",label:"write [F(x)]ₐᵇ"},{id:"evaluate",label:"calculate F(b)−F(a)"},{id:"c",label:"finish with +C"}],answer:["integrate","brackets","evaluate"],successMessage:"Correct. Integrate first; evaluate second."},
 missingPiece:{id:"memory-game:y12:integration:definite-indefinite:missing",label:"Missing piece",prompt:"Complete the evaluation rule.",expression:"[F(x)]ₐᵇ = F(b) ? F(a)",options:[{id:"minus",label:"−"},{id:"plus",label:"+"},{id:"times",label:"×"}],answerId:"minus",successMessage:"Correct. Upper minus lower."},
 sort:{id:"memory-game:y12:integration:definite-indefinite:sort",label:"Sort",prompt:"Sort each statement by integral type.",buckets:[{id:"indef",label:"Indefinite",description:"Produces a family."},{id:"def",label:"Definite",description:"Produces a number."}],items:[{id:"family",label:"F(x)+C",bucketId:"indef"},{id:"nolimits",label:"no limits",bucketId:"indef"},{id:"number",label:"numerical value",bucketId:"def"},{id:"limits",label:"lower and upper limits",bucketId:"def"}],successMessage:"Correct. Limits turn the family question into an evaluation question."},
 impostor:{id:"memory-game:y12:integration:definite-indefinite:impostor",label:"Impostor",prompt:"Which statement is incorrect?",options:[{id:"a",label:"[F(x)]ₐᵇ means F(b)−F(a)."},{id:"b",label:"Reversing limits changes the sign."},{id:"c",label:"∫ₐᵃf(x)dx=0."},{id:"wrong",label:"A definite integral answer must include +C."}],answerId:"wrong",successMessage:"Correct. The constant cancels in a definite evaluation."}
});


const integrationAreaGamePack=Object.freeze({
 build:{id:"memory-game:y12:integration:area:build",label:"Build",prompt:"Build the arbitrary-lower-limit area relationship.",context:"To get the region a→b:",slots:3,tokens:[{id:"whole",label:"start with 0→b"},{id:"remove",label:"subtract 0→a"},{id:"remain",label:"leave a→b"},{id:"add",label:"add 0→a"}],answer:["whole","remove","remain"],successMessage:"Correct. Remove the unwanted first region from the whole accumulation."},
 missingPiece:{id:"memory-game:y12:integration:area:missing",label:"Missing piece",prompt:"Complete the endpoint relationship.",expression:"∫ₐᵇf(x)dx = F(b) ? F(a)",options:[{id:"minus",label:"−"},{id:"plus",label:"+"},{id:"times",label:"×"}],answerId:"minus",successMessage:"Correct. The lower endpoint removes the earlier accumulation."},
 sort:{id:"memory-game:y12:integration:area:sort",label:"Sort",prompt:"Sort each picture idea by interval property.",buckets:[{id:"same",label:"Identical limits",description:"No interval width."},{id:"adjacent",label:"Adjacent intervals",description:"Touching pieces make a whole."},{id:"reverse",label:"Reversed limits",description:"Same strip, opposite order."}],items:[{id:"zero",label:"integral is 0",bucketId:"same"},{id:"add",label:"two touching pieces add",bucketId:"adjacent"},{id:"negate",label:"change the integral sign",bucketId:"reverse"}],successMessage:"Correct. Each algebraic property has a matching interval picture."},
 impostor:{id:"memory-game:y12:integration:area:impostor",label:"Impostor",prompt:"Which statement is incorrect for this positive-curve topic?",options:[{id:"a",label:"∫₀ᵇf represents the shaded area from 0 to b."},{id:"b",label:"∫ₐᵇf can be seen as 0→b minus 0→a."},{id:"c",label:"F(b)−F(a) matches that subtraction."},{id:"wrong",label:"Changing the lower limit from 0 to a means add the 0→a region."}],answerId:"wrong",successMessage:"Correct. The initial 0→a region is removed, not added."}
});


const signedAreaGamePack=Object.freeze({
 build:{id:"memory-game:y12:integration:signed-area:build",label:"Build",prompt:"Build the total-geometrical-area method.",context:"Across an axis crossing:",slots:4,tokens:[{id:"roots",label:"find sign-changing roots"},{id:"split",label:"split the integral"},{id:"magnitudes",label:"take magnitudes"},{id:"add",label:"add the pieces"},{id:"cancel",label:"let signs cancel"}],answer:["roots","split","magnitudes","add"],successMessage:"Correct. Split before allowing signed regions to cancel."},
 missingPiece:{id:"memory-game:y12:integration:signed-area:missing",label:"Missing piece",prompt:"Complete the signed-area rule.",expression:"below x-axis → ? contribution",options:[{id:"negative",label:"negative"},{id:"positive",label:"positive"},{id:"zero",label:"zero"}],answerId:"negative",successMessage:"Correct. Below-axis regions contribute negatively."},
 sort:{id:"memory-game:y12:integration:signed-area:sort",label:"Sort",prompt:"Sort each quantity by what it keeps.",buckets:[{id:"signed",label:"Signed integral",description:"Keeps positive and negative signs."},{id:"geometric",label:"Total geometrical area",description:"Adds positive magnitudes."}],items:[{id:"cancel",label:"can cancel",bucketId:"signed"},{id:"net",label:"net signed total",bucketId:"signed"},{id:"abs",label:"sum of magnitudes",bucketId:"geometric"},{id:"split",label:"split at sign changes",bucketId:"geometric"}],successMessage:"Correct. The two totals answer different questions."},
 impostor:{id:"memory-game:y12:integration:signed-area:impostor",label:"Impostor",prompt:"Which statement is incorrect?",options:[{id:"a",label:"Above-axis regions contribute positively."},{id:"b",label:"Below-axis regions contribute negatively."},{id:"c",label:"Total geometrical area adds magnitudes of split pieces."},{id:"wrong",label:"A zero definite integral means there is no geometrical area."}],answerId:"wrong",successMessage:"Correct. Opposite signed regions can cancel to zero."}
});


const year12ReviewGamePack=Object.freeze({
 build:{id:"memory-game:y12:review:calculus-mastery:build",label:"Build",prompt:"Build a reliable Year 12 area workflow.",context:"For total geometrical area across an axis crossing:",slots:4,tokens:[{id:"roots",label:"find sign-changing roots"},{id:"split",label:"split the interval"},{id:"integrate",label:"evaluate each region integral"},{id:"magnitudes",label:"add magnitudes"},{id:"cancel",label:"allow signs to cancel"}],answer:["roots","split","integrate","magnitudes"],successMessage:"Correct. Geometrical area needs the sign-changing regions kept separate."},
 missingPiece:{id:"memory-game:y12:review:calculus-mastery:missing",label:"Missing piece",prompt:"Complete the first-principles definition.",expression:"f′(x)=lim h→0 [f(x+h)−f(x)] / ?",options:[{id:"h",label:"h"},{id:"x",label:"x"},{id:"c",label:"C"}],answerId:"h",successMessage:"Correct. The difference quotient divides the change in f by the horizontal change h."},
 sort:{id:"memory-game:y12:review:calculus-mastery:sort",label:"Sort",prompt:"Sort each notation by what it describes.",buckets:[{id:"differentiate",label:"Differentiation",description:"Gradient / rate information."},{id:"integrate",label:"Integration",description:"Antiderivative / accumulation information."}],items:[{id:"fp",label:"f′(x)",bucketId:"differentiate"},{id:"ddx",label:"d/dx",bucketId:"differentiate"},{id:"indef",label:"∫f(x)dx",bucketId:"integrate"},{id:"def",label:"∫ₐᵇf(x)dx",bucketId:"integrate"}],successMessage:"Correct. The notation separates gradient ideas from antiderivative and accumulation ideas."},
 impostor:{id:"memory-game:y12:review:calculus-mastery:impostor",label:"Impostor",prompt:"Which Year 12 statement is incorrect?",options:[{id:"a",label:"f′(x)>0 means f is increasing."},{id:"b",label:"f′′(a)=0 is inconclusive for classifying a stationary point."},{id:"c",label:"A definite integral can be zero while geometrical area is positive."},{id:"wrong",label:"Every definite integral answer should include +C."}],answerId:"wrong",successMessage:"Correct. +C belongs to an indefinite family; it cancels in definite evaluation."}
});

export const standardFunctionsGamePack = deepFreeze({
  build:{id:"memory-game:y13:differentiation:standard-functions:build",label:"Build",prompt:"Build the derivative of cos(ax).",context:"d/dx[cos(ax)] =",slots:3,tokens:[{id:"minus",label:"−"},{id:"a",label:"a"},{id:"sin",label:"sin(ax)"},{id:"cos",label:"cos(ax)"},{id:"x",label:"x"}],answer:["minus","a","sin"],successMessage:"Correct: −a sin(ax)."},
  missingPiece:{id:"memory-game:y13:differentiation:standard-functions:missing",label:"Missing piece",prompt:"Complete the general exponential rule.",expression:"d/dx[a^(kx)] = ? · a^(kx)",options:[{id:"kln",label:"k ln(a)"},{id:"k",label:"k"},{id:"lna",label:"ln(a)"},{id:"a",label:"a"}],answerId:"kln",successMessage:"Correct. The multiplier is k ln(a)."},
  sort:{id:"memory-game:y13:differentiation:standard-functions:sort",label:"Sort",prompt:"Sort each derivative fact.",buckets:[{id:"same",label:"Same family",description:"Derivative stays in the same function family."},{id:"changes",label:"Changes family",description:"Derivative becomes a paired/reciprocal function."}],items:[{id:"exp",label:"e^x → e^x",bucketId:"same"},{id:"pow",label:"a^(kx) → multiple of a^(kx)",bucketId:"same"},{id:"sin",label:"sin x → cos x",bucketId:"changes"},{id:"cos",label:"cos x → −sin x",bucketId:"changes"},{id:"ln",label:"ln x → 1/x",bucketId:"changes"}],successMessage:"Correct."},
  impostor:{id:"memory-game:y13:differentiation:standard-functions:impostor",label:"Impostor",prompt:"Which derivative is incorrect?",options:[{id:"sin",label:"sin(2x) → 2cos(2x)"},{id:"cos",label:"cos(3x) → −3sin(3x)"},{id:"exp",label:"e^(2x) → 2e^(2x)"},{id:"wrong",label:"ln(2x) → 2/x"}],answerId:"wrong",successMessage:"Correct. ln(2x) differentiates to 1/x."}
});

export const trigFirstPrinciplesGamePack = deepFreeze({
  build:{id:"memory-game:y13:differentiation:trig-first-principles:build",label:"Build",prompt:"Build the common proof sequence.",context:"Trig first-principles proof:",slots:4,tokens:[{id:"definition",label:"first-principles definition"},{id:"identity",label:"addition formula"},{id:"group",label:"group into key quotients"},{id:"limits",label:"apply small-angle limits"},{id:"differentiate",label:"differentiate by rule first"}],answer:["definition","identity","group","limits"],successMessage:"Correct. Definition → addition formula → grouped quotients → limits."},
  missingPiece:{id:"memory-game:y13:differentiation:trig-first-principles:missing",label:"Missing piece",prompt:"Complete the key limit in radians.",expression:"lim h→0 sin h / h = ?",options:[{id:"one",label:"1"},{id:"zero",label:"0"},{id:"inf",label:"∞"}],answerId:"one",successMessage:"Correct. In radians the limit is 1."},
  sort:{id:"memory-game:y13:differentiation:trig-first-principles:sort",label:"Sort",prompt:"Sort each quotient by its limit.",buckets:[{id:"one",label:"Approaches 1",description:"Survives with its coefficient."},{id:"zero",label:"Approaches 0",description:"Its coefficient is removed."}],items:[{id:"sin",label:"sin h / h",bucketId:"one"},{id:"cos",label:"(cos h−1) / h",bucketId:"zero"}],successMessage:"Correct. These two limits explain which coefficient survives."},
  impostor:{id:"memory-game:y13:differentiation:trig-first-principles:impostor",label:"Impostor",prompt:"Which statement is incorrect?",options:[{id:"a",label:"The clean trig derivative rules assume radians."},{id:"b",label:"Both proofs use the two small-angle limits."},{id:"c",label:"Numerical tables support the limits but do not prove them."},{id:"wrong",label:"The first-principles proof should substitute h=0 into the original quotient immediately."}],answerId:"wrong",successMessage:"Correct. The limit follows values as h approaches 0; the original quotient is not evaluated at h=0."}
});


export const productQuotientChainGamePack = deepFreeze({
  build:{id:"memory-game:y13:differentiation:product-quotient-chain:build",label:"Build",prompt:"Build the quotient-rule numerator for y=u/v.",context:"numerator =",slots:5,tokens:[{id:"v",label:"v"},{id:"up",label:"u′"},{id:"minus",label:"−"},{id:"u",label:"u"},{id:"vp",label:"v′"},{id:"plus",label:"+"}],answer:["v","up","minus","u","vp"],successMessage:"Start with v·u′, then subtract u·v′. The full numerator is vu′−uv′."},
  missingPiece:{id:"memory-game:y13:differentiation:product-quotient-chain:missing",label:"Missing piece",prompt:"What factor is missing from this chain-rule derivative?",expression:"d/dx[(3x+1)^5] = 5(3x+1)^4 × ?",options:[{id:"3",label:"3"},{id:"5",label:"5"},{id:"x",label:"x"},{id:"1",label:"1"}],answerId:"3",successMessage:"Correct. Multiply by the derivative of the inside, 3x+1."},
  sort:{id:"memory-game:y13:differentiation:product-quotient-chain:sort",label:"Sort",prompt:"Sort each expression by its outer rule.",buckets:[{id:"product",label:"Product"},{id:"quotient",label:"Quotient"},{id:"chain",label:"Chain / composite"},{id:"mixture",label:"Mixture"}],items:[{id:"p",label:"x²e^x",bucketId:"product"},{id:"q",label:"sin x/(x+1)",bucketId:"quotient"},{id:"c",label:"sin(3x)",bucketId:"chain"},{id:"m",label:"x·e^(2x)",bucketId:"mixture"}],successMessage:"Correct. Name the outer structure first."},
  impostor:{id:"memory-game:y13:differentiation:product-quotient-chain:impostor",label:"Impostor",prompt:"Which derivative contains a structural error?",options:[{id:"p",label:"d(xe^x)/dx = e^x + xe^x"},{id:"q",label:"d(u/v)/dx = (vu′−uv′)/v²"},{id:"c",label:"d[sin(3x)]/dx = cos(3x)"},{id:"e",label:"d[e^(2x)]/dx = 2e^(2x)"}],answerId:"c",successMessage:"Correct. The chain factor 3 is missing."}
});


export const parametricDifferentiationGamePack = deepFreeze({
  build:{id:"memory-game:y13:differentiation:parametric-differentiation:build",label:"Build",prompt:"Build the parametric gradient rule.",context:"dy/dx =",slots:3,tokens:[{id:"dy",label:"dy/dt"},{id:"divide",label:"÷"},{id:"dx",label:"dx/dt"},{id:"reverse",label:"dx/dt"}],answer:["dy","divide","dx"],successMessage:"Correct. Parametric gradient is y-rate divided by x-rate."},
  missingPiece:{id:"memory-game:y13:differentiation:parametric-differentiation:missing",label:"Missing piece",prompt:"Complete the vertical-tangent condition.",expression:"dx/dt=0 and ? ≠ 0",options:[{id:"dy",label:"dy/dt"},{id:"y",label:"y"},{id:"x",label:"x"}],answerId:"dy",successMessage:"Correct. A non-zero y-rate with zero x-rate gives a vertical tangent."},
  sort:{id:"memory-game:y13:differentiation:parametric-differentiation:sort",label:"Sort",prompt:"Sort each action by its purpose.",buckets:[{id:"coords",label:"Coordinates / trace",description:"Work directly with t."},{id:"cart",label:"Cartesian link",description:"Remove t."},{id:"grad",label:"Gradient",description:"Compare the two rates."}],items:[{id:"sub",label:"substitute t into x(t),y(t)",bucketId:"coords"},{id:"elim",label:"solve one equation for t and substitute",bucketId:"cart"},{id:"ratio",label:"(dy/dt)/(dx/dt)",bucketId:"grad"}],successMessage:"Correct. Parametric work keeps coordinate, elimination and rate tasks conceptually separate."},
  impostor:{id:"memory-game:y13:differentiation:parametric-differentiation:impostor",label:"Impostor",prompt:"Which statement is incorrect?",options:[{id:"a",label:"One t-value generates both x and y coordinates."},{id:"b",label:"dy/dx=(dy/dt)/(dx/dt) when dx/dt≠0."},{id:"c",label:"dx/dt=0 with dy/dt≠0 indicates a vertical tangent."},{id:"wrong",label:"The formula works because dt is always an ordinary fraction that can be cancelled in any context."}],answerId:"wrong",successMessage:"Correct. The chain rule is the justification; fraction-like cancellation is only intuition."}
});

export const trigIdentitiesInverseGamePack = deepFreeze({
  build:{id:"memory-game:y13:differentiation:trig-identities-inverse:build",label:"Build",prompt:"Build the inverse-trig derivation method.",context:"Method:",slots:4,tokens:[{id:"rewrite",label:"Rewrite"},{id:"differentiate",label:"Differentiate"},{id:"identity",label:"Identity"},{id:"simplify",label:"Simplify"},{id:"substitute",label:"Substitute numbers first"}],answer:["rewrite","differentiate","identity","simplify"],successMessage:"Correct. Keep the four-stage structure visible."},
  missingPiece:{id:"memory-game:y13:differentiation:trig-identities-inverse:missing",label:"Missing piece",prompt:"Complete the derivative.",expression:"d/dx[tan(3x)] = ? sec²(3x)",options:[{id:"three",label:"3"},{id:"one",label:"1"},{id:"minus",label:"−3"}],answerId:"three",successMessage:"Correct. The chain factor is 3."},
  sort:{id:"memory-game:y13:differentiation:trig-identities-inverse:sort",label:"Sort",prompt:"Sort each notation as inverse or reciprocal.",buckets:[{id:"inverse",label:"Inverse function"},{id:"reciprocal",label:"Reciprocal"}],items:[{id:"asin",label:"sin⁻¹x",bucketId:"inverse"},{id:"acos",label:"cos⁻¹x",bucketId:"inverse"},{id:"cosec",label:"(sin x)⁻¹",bucketId:"reciprocal"},{id:"cot",label:"(tan x)⁻¹",bucketId:"reciprocal"}],successMessage:"Correct. Brackets and context distinguish the two meanings."},
  impostor:{id:"memory-game:y13:differentiation:trig-identities-inverse:impostor",label:"Impostor",prompt:"Which statement is incorrect?",options:[{id:"a",label:"d/dx[tan x]=sec²x"},{id:"b",label:"d/dx[arctan x]=1/(1+x²)"},{id:"c",label:"sin⁻¹x means arcsin x"},{id:"wrong",label:"(sin x)⁻¹ means arcsin x"}],answerId:"wrong",successMessage:"Correct. (sin x)⁻¹ is the reciprocal cosec x."}
});

export const concavityInflectionGamePack = deepFreeze({
  build:{id:"memory-game:y13:differentiation:concavity-inflection:build",label:"Build",prompt:"Build the inflection test.",context:"Point of inflection:",slots:3,tokens:[{id:"fpp",label:"f″"},{id:"changes",label:"changes"},{id:"sign",label:"sign"},{id:"zero",label:"equals 0 only"}],answer:["fpp","changes","sign"],successMessage:"Correct. A sign change in f″ confirms an inflection."},
  missingPiece:{id:"memory-game:y13:differentiation:concavity-inflection:missing",label:"Missing piece",prompt:"Complete the shape rule.",expression:"f″(x) > 0 ⇒ curve is ?",options:[{id:"convex",label:"convex"},{id:"concave",label:"concave"},{id:"stationary",label:"stationary"}],answerId:"convex",successMessage:"Correct. Positive f″ means increasing gradients and a convex section."},
  sort:{id:"memory-game:y13:differentiation:concavity-inflection:sort",label:"Sort",prompt:"Sort the evidence by conclusion.",buckets:[{id:"concave",label:"Concave"},{id:"convex",label:"Convex"},{id:"candidate",label:"Candidate only"}],items:[{id:"neg",label:"f″<0",bucketId:"concave"},{id:"pos",label:"f″>0",bucketId:"convex"},{id:"zero",label:"f″=0 without side checks",bucketId:"candidate"}],successMessage:"Correct. Zero alone never completes the inflection test."},
  impostor:{id:"memory-game:y13:differentiation:concavity-inflection:impostor",label:"Impostor",prompt:"Which statement is incorrect?",options:[{id:"a",label:"f″<0 corresponds to concavity."},{id:"b",label:"f″>0 corresponds to convexity."},{id:"c",label:"An inflection requires f″ to change sign."},{id:"wrong",label:"Every solution of f″=0 is an inflection point."}],answerId:"wrong",successMessage:"Correct. f″=0 identifies candidates; a sign change is required."}
});

export const connectedRatesGamePack = deepFreeze({
  build:{id:"memory-game:y13:differentiation:connected-rates:build",label:"Build",prompt:"Build the connected-rates method.",context:"Method:",slots:4,tokens:[{id:"dependency",label:"dependency"},{id:"orient",label:"orient rates"},{id:"substitute",label:"substitute"},{id:"interpret",label:"interpret"},{id:"numbers",label:"numbers first"}],answer:["dependency","orient","substitute","interpret"],successMessage:"Correct. Structure comes before numbers."},
  missingPiece:{id:"memory-game:y13:differentiation:connected-rates:missing",label:"Missing piece",prompt:"Complete the rate chain.",expression:"dA/dt = ( ? )(dr/dt)",options:[{id:"forward",label:"dA/dr"},{id:"reverse",label:"dr/dA"},{id:"area",label:"A/r"}],answerId:"forward",successMessage:"Correct. r → A means dA/dr."},
  sort:{id:"memory-game:y13:differentiation:connected-rates:sort",label:"Sort",prompt:"Sort each rate by interpretation.",buckets:[{id:"increase",label:"Increasing"},{id:"decrease",label:"Decreasing"},{id:"units",label:"Unit meaning"}],items:[{id:"pos",label:"dA/dt>0",bucketId:"increase"},{id:"neg",label:"dV/dt<0",bucketId:"decrease"},{id:"unit",label:"cm³ s⁻¹",bucketId:"units"}],successMessage:"Correct. Sign gives direction; compound units give quantity per time."},
  impostor:{id:"memory-game:y13:differentiation:connected-rates:impostor",label:"Impostor",prompt:"Which statement is incorrect?",options:[{id:"a",label:"For x → y use dy/dx."},{id:"b",label:"Build the dependency before substituting numbers."},{id:"c",label:"A negative target rate means the target quantity decreases."},{id:"wrong",label:"For r → A use dr/dA."}],answerId:"wrong",successMessage:"Correct. The derivative orientation is reversed in the impostor."}
});


export const fullDifferentiationReviewGamePack = deepFreeze({
 build:{id:"memory-game:full:review:calculus-mastery:build",label:"Build",prompt:"Build the method-selection sequence.",context:"For a topic-blind differentiation question:",slots:4,tokens:[{id:"structure",label:"identify structure/context"},{id:"method",label:"select method(s)"},{id:"execute",label:"execute"},{id:"interpret",label:"interpret/check"},{id:"numbers",label:"substitute numbers first"}],answer:["structure","method","execute","interpret"],successMessage:"Correct. Recognition comes before execution."},
 missingPiece:{id:"memory-game:full:review:calculus-mastery:missing",label:"Missing piece",prompt:"Complete the parametric gradient rule.",expression:"dy/dx = (dy/dt) / ?",options:[{id:"dxdt",label:"dx/dt"},{id:"dtdy",label:"dt/dy"},{id:"dydx",label:"dy/dx"}],answerId:"dxdt",successMessage:"Correct. Divide by dx/dt."},
 sort:{id:"memory-game:full:review:calculus-mastery:sort",label:"Sort",prompt:"Sort each cue by the method it signals.",buckets:[{id:"chain",label:"Chain",description:"Composite explicit structure."},{id:"implicit",label:"Implicit",description:"x and y mixed in a relation."},{id:"parametric",label:"Parametric",description:"x and y share parameter t."},{id:"rates",label:"Connected rates",description:"Several quantities change with time."}],items:[{id:"composite",label:"f(g(x))",bucketId:"chain"},{id:"xy",label:"x²+xy+y²=7",bucketId:"implicit"},{id:"t",label:"x=x(t), y=y(t)",bucketId:"parametric"},{id:"time",label:"t→r→V",bucketId:"rates"}],successMessage:"Correct. Structural cues identify the method."},
 impostor:{id:"memory-game:full:review:calculus-mastery:impostor",label:"Impostor",prompt:"Which statement confuses recognition with execution?",options:[{id:"a",label:"Choosing quotient rule for u/v is recognition."},{id:"b",label:"Reversing vu′−uv′ is an execution error."},{id:"c",label:"Omitting the inner derivative after selecting chain rule is an execution error."},{id:"wrong",label:"Selecting product rule for an implicit relation is an execution error."}],answerId:"wrong",successMessage:"Correct. Choosing the wrong rule is a recognition/method-selection error."}
});


export const standardIntegralsGamePack = deepFreeze({
  build:{id:"memory-game:y13:integration:standard-integrals:build",label:"Build",prompt:"Build the power-integral method.",context:"For x^n, n != -1:",slots:4,tokens:[{id:"add",label:"increase power by 1"},{id:"divide",label:"divide by new power"},{id:"plusc",label:"add +C"},{id:"check",label:"differentiate to check"},{id:"subtract",label:"decrease power by 1"}],answer:["add","divide","plusc","check"],successMessage:"Correct. Increase, divide, add C, then differentiate to check."},
  missingPiece:{id:"memory-game:y13:integration:standard-integrals:missing",label:"Missing piece",prompt:"Complete the standard integral.",expression:"integral sin x dx = ? + C",options:[{id:"negcos",label:"-cos x"},{id:"cos",label:"cos x"},{id:"sin",label:"sin x"}],answerId:"negcos",successMessage:"Correct. Differentiating -cos x returns sin x."},
  sort:{id:"memory-game:y13:integration:standard-integrals:sort",label:"Sort",prompt:"Sort each standard integral by whether a negative sign is needed in the antiderivative.",buckets:[{id:"negative",label:"Negative sign needed"},{id:"positive",label:"No negative sign"}],items:[{id:"sin",label:"integral sin x dx",bucketId:"negative"},{id:"cosec2",label:"integral cosec^2 x dx",bucketId:"negative"},{id:"coseccot",label:"integral cosec x cot x dx",bucketId:"negative"},{id:"cos",label:"integral cos x dx",bucketId:"positive"},{id:"sec2",label:"integral sec^2 x dx",bucketId:"positive"},{id:"sectan",label:"integral sec x tan x dx",bucketId:"positive"}],successMessage:"Correct. A quick differentiation check confirms every sign."},
  impostor:{id:"memory-game:y13:integration:standard-integrals:impostor",label:"Impostor",prompt:"Which standard integral is incorrect?",options:[{id:"a",label:"integral e^x dx = e^x + C"},{id:"b",label:"integral 1/x dx = ln|x| + C"},{id:"c",label:"integral cos x dx = sin x + C"},{id:"wrong",label:"integral sec^2 x dx = -tan x + C"}],answerId:"wrong",successMessage:"Correct. The derivative of tan x is sec^2 x, so no negative sign is needed."}
});


export const reverseChainRuleGamePack = deepFreeze({
  build:{id:"memory-game:y13:integration:reverse-chain-rule:build",label:"Build",prompt:"Build the recognition sequence.",context:"Before integrating:",slots:4,tokens:[{id:"inside",label:"identify g(x)"},{id:"differentiate",label:"find g'(x)"},{id:"compare",label:"compare factors"},{id:"classify",label:"classify / adjust"},{id:"integrate",label:"integrate immediately"}],answer:["inside","differentiate","compare","classify"],successMessage:"Correct. Recognition is completed before integration starts."},
  missingPiece:{id:"memory-game:y13:integration:reverse-chain-rule:missing",label:"Missing piece",prompt:"Complete the f'/f pattern.",expression:"integral f'(x)/f(x) dx = ? + C",options:[{id:"log",label:"ln|f(x)|"},{id:"f2",label:"f(x)^2/2"},{id:"recip",label:"1/f(x)"}],answerId:"log",successMessage:"Correct. Differentiate ln|f(x)| to recover f'/f."},
  sort:{id:"memory-game:y13:integration:reverse-chain-rule:sort",label:"Sort",prompt:"Classify each integrand before calculating.",buckets:[{id:"reverse",label:"Reverse chain"},{id:"log",label:"f'/f"},{id:"neither",label:"Neither"}],items:[{id:"a",label:"6x(3x²+4)^5",bucketId:"reverse"},{id:"b",label:"x/(x²+4)",bucketId:"log"},{id:"c",label:"x² cos(x²+1)",bucketId:"neither"},{id:"d",label:"sin³x cos x",bucketId:"reverse"},{id:"e",label:"(2x+3)/(x²+3x+7)",bucketId:"log"}],successMessage:"Correct. Exact matches and near-misses are being separated before execution."},
  impostor:{id:"memory-game:y13:integration:reverse-chain-rule:impostor",label:"Impostor",prompt:"Which recognition statement is false?",options:[{id:"a",label:"A constant multiple of g'(x) can be adjusted."},{id:"b",label:"tan(kx) can be rewritten to expose f'/f."},{id:"c",label:"sin³x cos x has inner function sin x."},{id:"wrong",label:"Any factor containing x can be treated as a constant adjustment."}],answerId:"wrong",successMessage:"Correct. A valid adjustment must be one constant, not an x-dependent factor."}
});

export const trigIdentityIntegrationGamePack = deepFreeze({
  build:{id:"memory-game:y13:integration:trig-identities:build",label:"Build",prompt:"Build the rewrite-first integration sequence.",context:"For a trig form that needs an identity:",slots:5,tokens:[{id:"recognise",label:"recognise trig form"},{id:"identity",label:"choose identity"},{id:"rewrite",label:"rewrite exactly"},{id:"route",label:"identify exposed route"},{id:"integrate",label:"integrate"},{id:"calculator",label:"use calculator first"}],answer:["recognise","identity","rewrite","route","integrate"],successMessage:"Correct. Exact trig manipulation comes before integration."},
  missingPiece:{id:"memory-game:y13:integration:trig-identities:missing",label:"Missing piece",prompt:"Complete the identity.",expression:"cos²x = ?",options:[{id:"right",label:"(1+cos2x)/2"},{id:"minus",label:"(1−cos2x)/2"},{id:"nodouble",label:"(1+cos x)/2"}],answerId:"right",successMessage:"Correct. The cosine-square identity has a plus sign and doubled angle."},
  sort:{id:"memory-game:y13:integration:trig-identities:sort",label:"Sort",prompt:"Choose the best first route for each integral.",buckets:[{id:"standard",label:"Standard"},{id:"reverse",label:"Reverse chain"},{id:"identity",label:"Trig identity"},{id:"substitution",label:"Substitution"}],items:[{id:"a",label:"∫sec²(4x)dx",bucketId:"standard"},{id:"b",label:"∫sin³x cos x dx",bucketId:"reverse"},{id:"c",label:"∫cos²x dx",bucketId:"identity"},{id:"d",label:"∫x cos(x²)dx",bucketId:"substitution"}],successMessage:"Correct. Do not use an identity by reflex."},
  impostor:{id:"memory-game:y13:integration:trig-identities:impostor",label:"Impostor",prompt:"Which statement is incorrect?",options:[{id:"a",label:"sin²x=(1−cos2x)/2"},{id:"b",label:"tan²x=sec²x−1"},{id:"c",label:"cos²(3x)=(1+cos6x)/2"},{id:"wrong",label:"cos²(3x)=(1+cos3x)/2"}],answerId:"wrong",successMessage:"Correct. The identity doubles the entire angle."}
});


export const substitutionGamePack = deepFreeze({
  build:{id:"memory-game:y13:integration:substitution:build",label:"Build",prompt:"Build the complete substitution sequence.",context:"For a useful substitution:",slots:5,tokens:[{id:"choose",label:"choose u"},{id:"du",label:"find du"},{id:"transform",label:"transform everything"},{id:"integrate",label:"integrate in u"},{id:"finish",label:"finish with the correct variable rule"},{id:"mix",label:"keep x and u together"}],answer:["choose","du","transform","integrate","finish"],successMessage:"Correct. Transformation must be complete before integration."},
  missingPiece:{id:"memory-game:y13:integration:substitution:missing",label:"Missing piece",prompt:"Complete the definite-limit conversion.",expression:"u=x²+1, x=0 to x=1 ⇒ u = ? to ?",options:[{id:"right",label:"1 to 2"},{id:"same",label:"0 to 1"},{id:"reverse",label:"2 to 1"}],answerId:"right",successMessage:"Correct. Evaluate u at each original x-endpoint."},
  sort:{id:"memory-game:y13:integration:substitution:sort",label:"Sort",prompt:"Classify the first broken stage.",buckets:[{id:"choice",label:"Choice of u"},{id:"transform",label:"Transformation"},{id:"integrate",label:"Integration/evaluation"}],items:[{id:"a",label:"u=x leaves cos(x²+1) unchanged",bucketId:"choice"},{id:"b",label:"integral contains x and u with du",bucketId:"transform"},{id:"c",label:"correct u-integral but wrong antiderivative",bucketId:"integrate"}],successMessage:"Correct. Diagnose the first broken stage."},
  impostor:{id:"memory-game:y13:integration:substitution:impostor",label:"Impostor",prompt:"Which statement is incorrect?",options:[{id:"a",label:"A completed transformed integral should use one integration variable."},{id:"b",label:"For indefinite integrals, substitute back to x and include +C."},{id:"c",label:"For definite integrals, convert the limits if you change variable."},{id:"wrong",label:"After changing to u-limits, always substitute x back before evaluating."}],answerId:"wrong",successMessage:"Correct. Definite work stays in u after the limits are changed."}
});


export const integrationByPartsGamePack = deepFreeze({
  build:{id:"memory-game:y13:integration:by-parts:build",label:"Build",prompt:"Build the integration-by-parts sequence.",context:"After deciding parts is appropriate:",slots:5,tokens:[{id:"choose",label:"choose u and dv"},{id:"duv",label:"find du and v"},{id:"formula",label:"write uv − ∫v du"},{id:"easier",label:"check the new integral is easier"},{id:"finish",label:"integrate / repeat / solve"},{id:"product",label:"use parts because there is a product"}],answer:["choose","duv","formula","easier","finish"],successMessage:"Correct. The new integral must represent progress."},
  missingPiece:{id:"memory-game:y13:integration:by-parts:missing",label:"Missing piece",prompt:"Complete the formula.",expression:"∫u dv = uv ? ∫v du",options:[{id:"minus",label:"−"},{id:"plus",label:"+"},{id:"times",label:"×"}],answerId:"minus",successMessage:"Correct. Integration by parts subtracts the new integral."},
  sort:{id:"memory-game:y13:integration:by-parts:sort",label:"Sort",prompt:"Choose the best first route for each integral.",buckets:[{id:"standard",label:"Standard"},{id:"reverse",label:"Reverse chain"},{id:"identity",label:"Trig identity"},{id:"substitution",label:"Substitution"},{id:"parts",label:"By parts"}],items:[{id:"a",label:"∫e^x dx",bucketId:"standard"},{id:"b",label:"∫2x cos(x²)dx",bucketId:"reverse"},{id:"c",label:"∫cos²x dx",bucketId:"identity"},{id:"d",label:"∫x cos(x²+1)dx",bucketId:"substitution"},{id:"e",label:"∫x e^x dx",bucketId:"parts"}],successMessage:"Correct. Parts is a later option, not a reflex for every product."},
  impostor:{id:"memory-game:y13:integration:by-parts:impostor",label:"Impostor",prompt:"Which statement is incorrect?",options:[{id:"a",label:"Choose u/dv so ∫v du becomes easier."},{id:"b",label:"∫ln x dx can use the hidden product 1·ln x."},{id:"c",label:"If I reappears in a cyclic case, collect I terms algebraically."},{id:"wrong",label:"Any product should immediately be integrated by parts."}],answerId:"wrong",successMessage:"Correct. A product alone does not determine the method."}
});


export const partialFractionsGamePack = deepFreeze({
  build:{id:"memory-game:y13:integration:partial-fractions:build",label:"Build",prompt:"Build the partial-fractions integration sequence.",context:"For a rational integrand:",slots:6,tokens:[{id:"recognise",label:"recognise rational form"},{id:"proper",label:"make proper"},{id:"structure",label:"choose decomposition"},{id:"coeff",label:"find coefficients"},{id:"integrate",label:"integrate simple terms"},{id:"logs",label:"combine logarithms"},{id:"parts",label:"use integration by parts first"}],answer:["recognise","proper","structure","coeff","integrate","logs"],successMessage:"Correct. Algebraic decomposition is completed before calculus begins."},
  missingPiece:{id:"memory-game:y13:integration:partial-fractions:missing",label:"Missing piece",prompt:"Complete the repeated-factor structure.",expression:"1/(x−a)² ⇒ A/(x−a) + ?",options:[{id:"right",label:"B/(x−a)²"},{id:"wrong1",label:"B/(x−b)"},{id:"wrong2",label:"B only"}],answerId:"right",successMessage:"Correct. Include every power up to the repeated power."},
  sort:{id:"memory-game:y13:integration:partial-fractions:sort",label:"Sort",prompt:"Choose the first algebraic action.",buckets:[{id:"decompose",label:"Decompose now"},{id:"divide",label:"Polynomial division first"},{id:"power",label:"Repeated-power integration"}],items:[{id:"a",label:"(5x+1)/((x−1)(x+2))",bucketId:"decompose"},{id:"b",label:"(x²+3x+5)/((x+1)(x+2))",bucketId:"divide"},{id:"c",label:"8/(x−1)² after decomposition",bucketId:"power"}],successMessage:"Correct. Properness and repeated powers control the next step."},
  impostor:{id:"memory-game:y13:integration:partial-fractions:impostor",label:"Impostor",prompt:"Which statement is incorrect?",options:[{id:"a",label:"Improper rational functions are divided before decomposition."},{id:"b",label:"A repeated factor (x−a)² needs both first- and second-power terms."},{id:"c",label:"1/(x−a) integrates to ln|x−a|."},{id:"wrong",label:"Every repeated-factor term integrates to a logarithm."}],answerId:"wrong",successMessage:"Correct. Higher repeated powers use the power rule."}
});

export const year13AreasGamePack = deepFreeze({
  build:{id:"memory-game:y13:integration:areas:build",label:"Build",prompt:"Build the area-problem sequence.",context:"Area problem:",slots:6,tokens:[{id:"region",label:"identify region"},{id:"intersections",label:"find intersections"},{id:"order",label:"top/bottom + split"},{id:"geometry",label:"geometry or calculus"},{id:"method",label:"choose integration method"},{id:"calculate",label:"calculate area"},{id:"parts",label:"choose parts immediately"}],answer:["region","intersections","order","geometry","method","calculate"],successMessage:"Correct. Construct the area before selecting a calculus technique."},
  missingPiece:{id:"memory-game:y13:integration:areas:missing",label:"Missing piece",prompt:"Complete the vertical-strip setup.",expression:"Area = ∫( ? ) dx",options:[{id:"right",label:"top − bottom"},{id:"wrong",label:"bottom − top"},{id:"abs",label:"|top| − |bottom|"}],answerId:"right",successMessage:"Correct. Use top minus bottom while the order is fixed."},
  sort:{id:"memory-game:y13:integration:areas:sort",label:"Sort",prompt:"Sort each decision by stage.",buckets:[{id:"construct",label:"Area construction"},{id:"technique",label:"Integration technique"}],items:[{id:"limits",label:"find intersection limits",bucketId:"construct"},{id:"split",label:"decide split points",bucketId:"construct"},{id:"sub",label:"substitution",bucketId:"technique"},{id:"parts",label:"integration by parts",bucketId:"technique"}],successMessage:"Correct. Keep setup and technique choice separate."},
  impostor:{id:"memory-game:y13:integration:areas:impostor",label:"Impostor",prompt:"Which statement is incorrect?",options:[{id:"a",label:"Split if upper/lower order changes."},{id:"b",label:"Use geometry if an exact elementary shape is simpler."},{id:"c",label:"Choose the integration technique after constructing the integral."},{id:"wrong",label:"A signed integral is always equal to total geometrical area."}],answerId:"wrong",successMessage:"Correct. Signed contributions can cancel; geometrical area adds magnitudes."}
});


export const parametricAreaGamePack = deepFreeze({
  build:{id:"memory-game:y13:integration:parametric-area:build",label:"Build",prompt:"Build the parametric-area setup sequence.",context:"Parametric area:",slots:6,tokens:[{id:"region",label:"identify region"},{id:"limits",label:"convert to t-limits"},{id:"integrand",label:"form y(t)x′(t)"},{id:"direction",label:"check direction/sign"},{id:"method",label:"choose later technique"},{id:"calculate",label:"calculate"},{id:"parts",label:"choose parts immediately"}],answer:["region","limits","integrand","direction","method","calculate"],successMessage:"Correct. Parametric setup and direction come before the later calculus technique."},
  missingPiece:{id:"memory-game:y13:integration:parametric-area:missing",label:"Missing piece",prompt:"Complete the formula.",expression:"A = ∫ y(t) · ? · dt",options:[{id:"right",label:"dx/dt"},{id:"wrong",label:"dy/dt"},{id:"one",label:"1 always"}],answerId:"right",successMessage:"Correct. dx=(dx/dt)dt."},
  sort:{id:"memory-game:y13:integration:parametric-area:sort",label:"Sort",prompt:"Sort each action by stage.",buckets:[{id:"setup",label:"Parametric setup"},{id:"later",label:"Later integration technique"}],items:[{id:"limits",label:"convert x-boundaries to t",bucketId:"setup"},{id:"sign",label:"check sign of dx/dt",bucketId:"setup"},{id:"trig",label:"trig identity",bucketId:"later"},{id:"parts",label:"integration by parts",bucketId:"later"}],successMessage:"Correct. Setup, limits and direction come first."},
  impostor:{id:"memory-game:y13:integration:parametric-area:impostor",label:"Impostor",prompt:"Which statement is incorrect?",options:[{id:"a",label:"A t-integral needs t-limits."},{id:"b",label:"dx/dt may be negative."},{id:"c",label:"Geometrical area may require reversing limits or splitting."},{id:"wrong",label:"The factor dx/dt can be omitted because y is already written in t."}],answerId:"wrong",successMessage:"Correct. The horizontal strip width dx must also be transformed."}
});


export const limitOfSumGamePack = deepFreeze({
 build:{id:"memory-game:y13:integration:limit-of-sum:build",label:"Build",prompt:"Build the recognition-first sequence.",context:"Limiting sum:",slots:5,tokens:[{id:"width",label:"identify Δx"},{id:"sample",label:"identify xₖ / integrand"},{id:"limits",label:"identify limits"},{id:"integral",label:"write definite integral"},{id:"evaluate",label:"evaluate"},{id:"parts",label:"choose parts immediately"}],answer:["width","sample","limits","integral","evaluate"],successMessage:"Correct. Recognition is complete before evaluation."},
 missingPiece:{id:"memory-game:y13:integration:limit-of-sum:missing",label:"Missing piece",prompt:"Complete the mapping.",expression:"lim Σ f(xₖ)Δx = ?",options:[{id:"right",label:"∫ₐᵇf(x)dx"},{id:"wrong",label:"f′(x)"},{id:"sum",label:"Σf(x)"}],answerId:"right",successMessage:"Correct. The limiting rectangle sum is the definite integral."},
 sort:{id:"memory-game:y13:integration:limit-of-sum:sort",label:"Sort",prompt:"Sort each object by its role.",buckets:[{id:"sum",label:"Finite/limiting sum"},{id:"integral",label:"Definite integral"}],items:[{id:"height",label:"f(xₖ)",bucketId:"sum"},{id:"width",label:"Δx",bucketId:"sum"},{id:"integrand",label:"f(x)",bucketId:"integral"},{id:"dx",label:"dx",bucketId:"integral"}],successMessage:"Correct. Height and width become integrand and differential."},
 impostor:{id:"memory-game:y13:integration:limit-of-sum:impostor",label:"Impostor",prompt:"Which statement is incorrect?",options:[{id:"a",label:"Δx=(b−a)/n for n equal widths."},{id:"b",label:"xₖ=a+kΔx can describe right endpoints."},{id:"c",label:"Identify integrand and limits before evaluating."},{id:"wrong",label:"The limit-of-sum section requires a separate integration technique after recognition."}],answerId:"wrong",successMessage:"Correct. After recognition, use the existing integration toolkit."}
});

const numericalIntegrationGamePack=deepFreeze({
 build:{id:"memory-game:y13:integration:numerical:build",label:"Build",prompt:"Build the trapezium workflow.",context:"Numerical integral:",slots:5,tokens:[{id:"h",label:"find h"},{id:"table",label:"list ordinates"},{id:"coeff",label:"apply 1,2,…,2,1"},{id:"estimate",label:"calculate estimate"},{id:"check",label:"error/bound check"},{id:"integrate",label:"differentiate"}],answer:["h","table","coeff","estimate","check"],successMessage:"Correct. Structure comes before the arithmetic."},
 missingPiece:{id:"memory-game:y13:integration:numerical:missing",label:"Missing piece",prompt:"Complete the coefficient pattern.",expression:"(h/2)[ y₀ + ? + yₙ ]",options:[{id:"right",label:"2(y₁+…+yₙ₋₁)"},{id:"one",label:"(y₁+…+yₙ₋₁)"},{id:"ends",label:"2y₀+2yₙ"}],answerId:"right",successMessage:"Correct. Interior ordinates appear twice."},
 sort:{id:"memory-game:y13:integration:numerical:sort",label:"Sort",prompt:"Sort each claim by concavity.",buckets:[{id:"convex",label:"f″>0 throughout"},{id:"concave",label:"f″<0 throughout"},{id:"mixed",label:"f″ changes sign"}],items:[{id:"over",label:"overestimate",bucketId:"convex"},{id:"under",label:"underestimate",bucketId:"concave"},{id:"none",label:"no whole-interval claim",bucketId:"mixed"}],successMessage:"Correct. Bounds require uniform concavity."},
 impostor:{id:"memory-game:y13:integration:numerical:impostor",label:"Impostor",prompt:"Which statement is incorrect?",options:[{id:"a",label:"h=(b−a)/n"},{id:"b",label:"Interior ordinates have coefficient 2."},{id:"c",label:"Percentage error uses the exact/reference value in the denominator."},{id:"wrong",label:"If f″ changes sign, the trapezium estimate is always an upper bound."}],answerId:"wrong",successMessage:"Correct. Changing concavity prevents that whole-interval conclusion."}
});


const differentialEquationsGamePack=deepFreeze({
 build:{id:"memory-game:y13:differential-equations:first-order:build",label:"Build",prompt:"Build the separable differential-equation workflow.",context:"Method:",slots:5,tokens:[{id:"translate",label:"translate"},{id:"separate",label:"separate"},{id:"integrate",label:"integrate"},{id:"constant",label:"combine +C"},{id:"condition",label:"apply condition"},{id:"extrapolate",label:"extrapolate forever"}],answer:["translate","separate","integrate","constant","condition"],successMessage:"Correct. The condition selects the particular solution after the general solution is found."},
 missingPiece:{id:"memory-game:y13:differential-equations:first-order:missing",label:"Missing piece",prompt:"Complete the model check.",expression:"sign + units + long-term + ? + realistic domain",options:[{id:"assumption",label:"assumptions"},{id:"differentiate",label:"differentiate again"},{id:"deleteC",label:"delete C"}],answerId:"assumption",successMessage:"Correct. State the assumptions that make the rate law plausible."},
 sort:{id:"memory-game:y13:differential-equations:first-order:sort",label:"Sort",prompt:"Sort each statement by modelling role.",buckets:[{id:"math",label:"Mathematical result"},{id:"assumption",label:"Assumption"},{id:"limit",label:"Limitation"}],items:[{id:"growth",label:"P→∞ as t→∞",bucketId:"math"},{id:"constant",label:"proportional growth rate stays constant",bucketId:"assumption"},{id:"resources",label:"finite resources may invalidate long-term growth",bucketId:"limit"}],successMessage:"Correct. Separate what the mathematics predicts from assumptions and limitations."},
 impostor:{id:"memory-game:y13:differential-equations:first-order:impostor",label:"Impostor",prompt:"Which statement is incorrect?",options:[{id:"a",label:"Apply the initial condition after finding the general solution."},{id:"b",label:"A negative rate can represent decrease."},{id:"c",label:"An exact solution can still be a limited model."},{id:"wrong",label:"If the algebra is exact, the model must be realistic for all future time."}],answerId:"wrong",successMessage:"Correct. Exact mathematics does not guarantee unlimited model validity."}
});

export const memoryGamePacks = Object.freeze({
  "topic:y12:differentiation:basics": basicsDifferentiationGamePack,
  "topic:y12:differentiation:first-principles": firstPrinciplesGamePack,
  "topic:y12:differentiation:tangents-normals": tangentsNormalsGamePack,
  "topic:y12:differentiation:stationary-points": stationaryPointsGamePack,
  "topic:y12:differentiation:increasing-decreasing": increasingDecreasingGamePack,
  "topic:y12:integration:introduction": integrationIntroGamePack,
  "topic:y12:integration:definite-indefinite": definiteIndefiniteGamePack,
  "topic:y12:integration:area": integrationAreaGamePack,
  "topic:y12:integration:signed-area": signedAreaGamePack,
  "topic:y12:review:calculus-mastery": year12ReviewGamePack,
  "topic:y13:differentiation:standard-functions": standardFunctionsGamePack,
  "topic:y13:differentiation:trig-first-principles": trigFirstPrinciplesGamePack,
  "topic:y13:differentiation:product-quotient-chain": productQuotientChainGamePack,
  "topic:y13:differentiation:parametric-differentiation": parametricDifferentiationGamePack,
  "topic:y13:differentiation:trig-identities-inverse": trigIdentitiesInverseGamePack,
  "topic:y13:differentiation:concavity-inflection": concavityInflectionGamePack,
  "topic:y13:differentiation:connected-rates": connectedRatesGamePack,
  "topic:full:review:calculus-mastery": fullDifferentiationReviewGamePack,
  "topic:y13:integration:standard-integrals": standardIntegralsGamePack,
  "topic:y13:integration:reverse-chain-rule": reverseChainRuleGamePack,
  "topic:y13:integration:trig-identities": trigIdentityIntegrationGamePack,
  "topic:y13:integration:substitution": substitutionGamePack,
  "topic:y13:integration:by-parts": integrationByPartsGamePack,
  "topic:y13:integration:partial-fractions": partialFractionsGamePack,
  "topic:y13:integration:areas": year13AreasGamePack,
  "topic:y13:integration:parametric-area": parametricAreaGamePack,
  "topic:y13:integration:limit-of-sum": limitOfSumGamePack,
  "topic:y13:integration:numerical-integration": numericalIntegrationGamePack,
  "topic:y13:differential-equations:first-order": differentialEquationsGamePack
});




export function getMemoryGamePackForTopic(topicId) {
  return memoryGamePacks[topicId] ?? null;
}
