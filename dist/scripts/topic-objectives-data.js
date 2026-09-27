const teachingHeading = "In this topic you will learn to…";
const teachingRecapHeading = "You should now be able to…";
const teachingFooter = "You’ll meet these ideas across Understand → Memorise → AO1 → AO2 → AO3.";
const reviewHeading = "In this review you will bring together…";
const reviewRecapHeading = "You should be ready to connect…";
const reviewFooter = "Use the review to connect methods, explain choices and identify precise next steps.";
const masteryHeading = "In this mastery section you will…";
const masteryRecapHeading = "You should now be ready to…";
const masteryFooter = "Use structure rather than topic labels: select, execute, check and interpret.";

function freezeConfig(config) {
  const kind = config.kind ?? "teaching";
  const heading = config.heading ?? (kind === "review" ? reviewHeading : kind === "mastery" ? masteryHeading : teachingHeading);
  const recapHeading = config.recapHeading ?? (kind === "review" ? reviewRecapHeading : kind === "mastery" ? masteryRecapHeading : teachingRecapHeading);
  const footer = config.footer ?? (kind === "review" ? reviewFooter : kind === "mastery" ? masteryFooter : teachingFooter);
  return Object.freeze({
    kind,
    heading,
    recapHeading,
    footer,
    objectives: Object.freeze([...config.objectives])
  });
}

const topicObjectiveConfigs = Object.freeze({
  "topic:y12:foundations:pre-calculus": freezeConfig({
    objectives: [
      "interpret gradient as vertical change for each unit of horizontal change",
      "distinguish positive, negative, zero and undefined gradients from a graph",
      "compare gradient magnitude using steepness without confusing gradient with height",
      "calculate a straight-line gradient using Δy/Δx",
      "explain why a curved graph needs a local idea of gradient"
    ]
  }),
  "topic:y12:differentiation:basics": freezeConfig({
    objectives: [
      "interpret the derivative as the gradient function of a curve",
      "read f′(x) and dy/dx as derivatives and d/dx as an instruction to differentiate",
      "differentiate powers of x, constants and linear terms using the power rule",
      "rewrite roots and reciprocals as powers before differentiating",
      "connect features of a function graph with the sign and shape of its derivative"
    ]
  }),
  "topic:y12:differentiation:first-principles": freezeConfig({
    objectives: [
      "interpret simple limits and the notation h → 0",
      "use a chord as an approximation to the tangent at a point on a curve",
      "connect the difference quotient with the gradient of that chord",
      "derive simple derivatives from the first-principles definition",
      "distinguish between using a differentiation rule and proving one"
    ]
  }),
  "topic:y12:differentiation:tangents-normals": freezeConfig({
    objectives: [
      "find the gradient of a curve at a point using its derivative",
      "form the equation of a tangent through a known point",
      "use perpendicular gradients to form the equation of a normal",
      "handle horizontal tangents and vertical normals correctly",
      "apply tangent and normal equations in multi-step problems"
    ]
  }),
  "topic:y12:differentiation:stationary-points": freezeConfig({
    objectives: [
      "find stationary points by solving f′(x)=0",
      "classify stationary points from changes in the sign of f′",
      "use the second derivative to classify stationary points when it is conclusive",
      "recognise when f″=0 is inconclusive and another test is needed",
      "interpret stationary points in mathematical and modelling contexts"
    ]
  }),
  "topic:y12:differentiation:increasing-decreasing": freezeConfig({
    objectives: [
      "recognise where a graph is increasing or decreasing from its appearance",
      "connect increasing and decreasing behaviour to the sign of f′(x)",
      "find interval boundaries from stationary points",
      "solve derivative inequalities to state increasing and decreasing intervals",
      "interpret increasing and decreasing intervals in simple models"
    ]
  }),
  "topic:y12:integration:introduction": freezeConfig({
    objectives: [
      "interpret integration as reversing differentiation",
      "integrate powers of x using the reverse power rule",
      "include the constant of integration in indefinite integrals",
      "rewrite roots and reciprocals into a form that can be integrated",
      "check an antiderivative by differentiating it"
    ]
  }),
  "topic:y12:integration:definite-indefinite": freezeConfig({
    objectives: [
      "distinguish an indefinite integral from a definite integral",
      "evaluate a definite integral using F(b)−F(a)",
      "explain why the constant of integration cancels in a definite integral",
      "use zero-width, reversed and adjacent-interval properties",
      "interpret the numerical output of a definite integral in context"
    ]
  }),
  "topic:y12:integration:area": freezeConfig({
    objectives: [
      "interpret a definite integral as area for a curve above the x-axis",
      "identify the correct interval and limits from a graph",
      "connect accumulated area with the endpoint difference F(b)−F(a)",
      "interpret a simple area between two non-crossing positive curves as top minus bottom",
      "construct and evaluate an integral for a positive bounded region",
      "interpret area units appropriately"
    ]
  }),
  "topic:y12:integration:signed-area": freezeConfig({
    objectives: [
      "distinguish signed area from total geometrical area",
      "recognise that regions below the x-axis contribute negatively to a forward integral",
      "find roots where an area calculation must be split",
      "combine separate integrals to find total geometrical area",
      "explain how reversing limits changes the sign of a definite integral"
    ]
  }),
  "topic:y12:review:calculus-mastery": freezeConfig({
    kind: "review",
    objectives: [
      "connect gradient, derivative and graph behaviour across Year 12 differentiation",
      "bring together first principles, tangents, normals, stationary points and derivative-sign reasoning",
      "connect indefinite integration, definite integration and area",
      "select a method without relying on a topic heading",
      "use mixed AO1, AO2 and AO3 evidence to identify precise areas to revisit"
    ]
  }),
  "topic:y13:differentiation:standard-functions": freezeConfig({
    objectives: [
      "differentiate the standard exponential, logarithmic and trigonometric functions in the course",
      "combine standard-function derivatives with constant multiples and sums",
      "recognise equivalent forms before differentiating",
      "evaluate standard-function derivatives at specified points",
      "apply standard derivatives in tangent, stationary-point and modelling problems"
    ]
  }),
  "topic:y13:differentiation:trig-first-principles": freezeConfig({
    objectives: [
      "use radian-based small-angle limits needed for trigonometric first-principles proofs",
      "derive the derivative of sin x from first principles",
      "derive the derivative of cos x from first principles",
      "explain where the key trigonometric identities enter each proof",
      "distinguish a first-principles proof from simply quoting a standard derivative"
    ]
  }),
  "topic:y13:differentiation:product-quotient-chain": freezeConfig({
    objectives: [
      "recognise product, quotient and composite-function structure before differentiating",
      "apply the product rule and quotient rule accurately",
      "apply the chain rule to composite functions",
      "combine differentiation rules in nested multi-stage expressions",
      "diagnose method-selection and execution errors in mixed differentiation"
    ]
  }),
  "topic:y13:differentiation:parametric-differentiation": freezeConfig({
    objectives: [
      "interpret coordinates generated by a parameter",
      "find dx/dt and dy/dt and combine them to obtain dy/dx",
      "find tangent and normal information at a specified parameter value",
      "identify horizontal and vertical tangents from the parameter rates",
      "apply parametric differentiation in multi-step problems"
    ]
  }),
  "topic:y13:differentiation:implicit-differentiation": freezeConfig({
    objectives: [
      "treat y as a function of x when differentiating an implicit relation",
      "identify the terms whose differentiation introduces a dy/dx factor",
      "apply product and chain rules inside implicit differentiation",
      "collect and solve algebraically for dy/dx",
      "use implicit derivatives to solve tangent and related problems"
    ]
  }),
  "topic:y13:differentiation:trig-identities-inverse": freezeConfig({
    objectives: [
      "use trigonometric identities to rewrite expressions into differentiable forms",
      "differentiate functions involving inverse trigonometric relationships",
      "connect inverse-function differentiation with reciprocal gradients",
      "combine trigonometric, inverse and chain-rule differentiation",
      "choose an efficient equivalent form before differentiating"
    ]
  }),
  "topic:y13:differentiation:concavity-inflection": freezeConfig({
    objectives: [
      "use the sign of f″(x) to describe concavity and convexity",
      "find intervals on which the shape of a curve is concave or convex",
      "identify candidate points of inflection from f″(x)=0",
      "confirm an inflection by checking for a change in concavity",
      "distinguish stationary and non-stationary points of inflection"
    ]
  }),
  "topic:y13:differentiation:connected-rates": freezeConfig({
    objectives: [
      "build a dependency chain before carrying out a connected-rates calculation",
      "orient derivatives correctly from source quantity to dependent quantity",
      "connect rates using the chain rule",
      "substitute values at the correct instant and retain signs and units",
      "interpret multi-stage connected rates in geometric and modelling contexts"
    ]
  }),
  "topic:full:review:calculus-mastery": freezeConfig({
    kind: "review",
    objectives: [
      "bring together the full Year 12 and Year 13 differentiation toolkit",
      "recognise which differentiation method or combination is required from structure alone",
      "separate method recognition from accurate execution",
      "explain and diagnose differentiation methods and errors",
      "apply mixed differentiation in unfamiliar and modelling contexts"
    ]
  }),
  "topic:y13:integration:standard-integrals": freezeConfig({
    objectives: [
      "integrate the standard exponential, logarithmic and trigonometric forms in the course",
      "recognise when the integral of 1/x produces a logarithm",
      "combine standard integrals with constants, sums and differences",
      "include +C appropriately in indefinite integration",
      "check standard integrals by differentiating the result"
    ]
  }),
  "topic:y13:integration:reverse-chain-rule": freezeConfig({
    objectives: [
      "recognise integrands that contain a function together with its derivative",
      "reverse the chain rule for powers and standard functions",
      "adjust for constant factors accurately",
      "recognise logarithmic reverse-chain structures",
      "choose between direct integration and a reverse-chain approach"
    ]
  }),
  "topic:y13:integration:trig-identities": freezeConfig({
    objectives: [
      "recognise when a trigonometric identity is needed before integration",
      "rewrite trigonometric powers and products into integrable forms",
      "select an efficient identity for the structure given",
      "integrate the transformed expression accurately",
      "check equivalent antiderivative forms"
    ]
  }),
  "topic:y13:integration:substitution": freezeConfig({
    objectives: [
      "choose a useful substitution from the structure of an integral",
      "transform the differential consistently using du",
      "rewrite the whole integrand in terms of the new variable",
      "transform limits for definite integrals",
      "complete the integral and return to the original variable when required"
    ]
  }),
  "topic:y13:integration:by-parts": freezeConfig({
    objectives: [
      "recognise products that are suited to integration by parts",
      "choose u and dv strategically",
      "apply the integration-by-parts formula with correct signs",
      "use repeated integration by parts when necessary",
      "check whether the resulting integral is simpler than the original"
    ]
  }),
  "topic:y13:integration:partial-fractions": freezeConfig({
    objectives: [
      "recognise when a rational function should be decomposed before integration",
      "form an appropriate partial-fraction decomposition",
      "determine the unknown coefficients accurately",
      "integrate the decomposed terms, including logarithmic results",
      "check a decomposition before using it in an integral"
    ]
  }),
  "topic:y13:integration:areas": freezeConfig({
    objectives: [
      "find intersection points that define the boundaries of an enclosed region",
      "construct area integrals using upper curve minus lower curve",
      "split an area calculation when the upper and lower curves change order",
      "combine multiple regions to find total geometrical area",
      "interpret the geometry before carrying out the integration"
    ]
  }),
  "topic:y13:integration:parametric-area": freezeConfig({
    objectives: [
      "convert x-boundaries into parameter limits",
      "construct a parametric area integral using y(dx/dt)",
      "track the direction in which increasing t moves along the curve",
      "adjust orientation so a geometrical area is positive",
      "evaluate and interpret parametric area problems"
    ]
  }),
  "topic:y13:integration:limit-of-sum": freezeConfig({
    objectives: [
      "identify Δx, sample points and rectangle heights in a Riemann sum",
      "write a finite rectangle sum using sigma notation",
      "explain how a rectangle sum approaches a definite integral",
      "connect summation limits with integration limits",
      "use the limit-of-a-sum idea to derive or evaluate integrals"
    ]
  }),
  "topic:y13:integration:numerical-integration": freezeConfig({
    objectives: [
      "construct the trapezium-rule approximation from equally spaced ordinates",
      "use the 1,2,…,2,1 coefficient pattern correctly",
      "calculate the strip width h from the interval and number of trapezia",
      "use concavity to justify whether a trapezium estimate is an overestimate or underestimate",
      "interpret numerical-integration accuracy in context"
    ]
  }),
  "topic:y13:differential-equations:first-order": freezeConfig({
    objectives: [
      "recognise and form simple first-order differential equations from rate statements",
      "separate variables when a differential equation is separable",
      "integrate both sides and include the constant of integration",
      "use an initial condition to determine a particular solution",
      "interpret solution curves and long-term behaviour in context"
    ]
  }),
  "topic:y13:modelling:calculus": freezeConfig({
    objectives: [
      "translate a modelling context into variables, relationships and assumptions",
      "select suitable differentiation or integration methods from the model structure",
      "carry out the calculus while respecting domains, units and parameter restrictions",
      "interpret mathematical results in the original context",
      "evaluate the limitations and reasonableness of a calculus model"
    ]
  }),
  "topic:full:review:full-calculus-mastery": freezeConfig({
    kind: "mastery",
    objectives: [
      "select differentiation and integration methods without relying on topic labels",
      "decide when algebraic rewriting or method ordering is needed before calculation",
      "execute mixed AO1 methods accurately and check the result",
      "explain and diagnose method choices in AO2 reasoning",
      "apply, interpret and evaluate calculus in unfamiliar AO3 problems"
    ]
  })
});

export function getTopicObjectiveConfig(topicId) {
  return topicObjectiveConfigs[topicId] ?? null;
}

export function listTopicObjectiveConfigs() {
  return Object.freeze(Object.entries(topicObjectiveConfigs).map(([topicId, config]) => Object.freeze({ topicId, ...config })));
}

export const topicObjectiveCount = Object.keys(topicObjectiveConfigs).length;
