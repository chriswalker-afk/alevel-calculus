export const vocabularyTerms = Object.freeze({
  "vocab:derivative": Object.freeze({
    id: "vocab:derivative",
    label: "derivative",
    scopeId: "y12",
    definition: "The gradient function of a function; at a particular x-value it gives the gradient of the tangent to the curve.",
    notation: "f'(x), dy/dx",
    relatedTopics: Object.freeze([
      "Basics of differentiation",
      "Tangents & normals",
      "Stationary points",
      "Increasing & decreasing"
    ])
  }),
  "vocab:gradient-function": Object.freeze({
    id: "vocab:gradient-function",
    label: "gradient function",
    scopeId: "y12",
    definition: "A function whose value at each x gives the gradient of the original curve at that x-value.",
    notation: "f'(x)",
    relatedTopics: Object.freeze([
      "Basics of differentiation",
      "Stationary points",
      "Increasing & decreasing"
    ])
  }),
  "vocab:tangent": Object.freeze({
    id: "vocab:tangent",
    label: "tangent",
    scopeId: "y12",
    definition: "A straight line that has the same gradient as the curve at the point being considered.",
    notation: "m_tangent = f'(a)",
    relatedTopics: Object.freeze([
      "Basics of differentiation",
      "First principles",
      "Tangents & normals"
    ])
  }),
  "vocab:normal": Object.freeze({
    id: "vocab:normal", label: "normal", scopeId: "y12",
    definition: "A straight line perpendicular to the tangent at the point of contact on a curve.",
    notation: "m_normal = -1/m_tangent (when m_tangent is non-zero)", relatedTopics: Object.freeze(["Tangents & normals"])
  }),
  "vocab:point-of-contact": Object.freeze({
    id: "vocab:point-of-contact", label: "point of contact", scopeId: "y12",
    definition: "The point (a, f(a)) where the tangent or normal meets the curve.", notation: "(a, f(a))", relatedTopics: Object.freeze(["Tangents & normals"])
  }),
  "vocab:perpendicular": Object.freeze({
    id: "vocab:perpendicular", label: "perpendicular", scopeId: "y12",
    definition: "Meeting at a right angle; for two non-vertical perpendicular lines, the product of their gradients is -1.", notation: "m1 m2 = -1", relatedTopics: Object.freeze(["Tangents & normals"])
  }),
  "vocab:negative-reciprocal": Object.freeze({
    id: "vocab:negative-reciprocal", label: "negative reciprocal", scopeId: "y12",
    definition: "The reciprocal of a non-zero number with the sign changed; it gives the gradient of a perpendicular non-vertical line.", notation: "m -> -1/m", relatedTopics: Object.freeze(["Tangents & normals"])
  }),
  "vocab:horizontal-tangent": Object.freeze({
    id: "vocab:horizontal-tangent", label: "horizontal tangent", scopeId: "y12",
    definition: "A tangent with gradient zero.", notation: "f'(a) = 0", relatedTopics: Object.freeze(["Tangents & normals", "Stationary points"])
  }),
  "vocab:vertical-normal": Object.freeze({
    id: "vocab:vertical-normal", label: "vertical normal", scopeId: "y12",
    definition: "The normal to a horizontal tangent; it has equation x = a through the point of contact.", notation: "x = a", relatedTopics: Object.freeze(["Tangents & normals"])
  }),
  "vocab:point-slope-form": Object.freeze({
    id: "vocab:point-slope-form", label: "point-slope form", scopeId: "y12",
    definition: "A form of a straight-line equation using a known point and gradient.", notation: "y - y1 = m(x - x1)", relatedTopics: Object.freeze(["Tangents & normals"])
  }),
  "vocab:coefficient": Object.freeze({
    id: "vocab:coefficient",
    label: "coefficient",
    scopeId: "y12",
    definition: "A number multiplying a variable or algebraic term, such as 3 in 3x^4.",
    notation: "3 in 3x^4",
    relatedTopics: Object.freeze([
      "Basics of differentiation",
      "Tangents & normals"
    ])
  }),
  "vocab:function": Object.freeze({
    id: "vocab:function",
    label: "function",
    scopeId: "y12",
    definition: "A rule that assigns each allowed input exactly one output.",
    notation: "f(x)",
    relatedTopics: Object.freeze(["Basics of differentiation"])
  }),
  "vocab:differentiate": Object.freeze({
    id: "vocab:differentiate",
    label: "differentiate",
    scopeId: "y12",
    definition: "To find the derivative of a function or expression.",
    notation: "differentiate f(x) -> f′(x)",
    relatedTopics: Object.freeze(["Basics of differentiation", "Differentiation from first principles"])
  }),
  "vocab:gradient": Object.freeze({
    id: "vocab:gradient",
    label: "gradient",
    scopeId: "y12",
    definition: "A measure of steepness and direction; for a curve at a point it is the gradient of the tangent there.",
    notation: "m = Δy/Δx",
    relatedTopics: Object.freeze(["Pre-Calculus introduction", "Basics of differentiation", "Tangents & normals"])
  }),
  "vocab:constant": Object.freeze({
    id: "vocab:constant",
    label: "constant",
    scopeId: "y12",
    definition: "A fixed value that does not change with the variable being considered.",
    notation: "c",
    relatedTopics: Object.freeze(["Basics of differentiation"])
  }),
  "vocab:power-index": Object.freeze({
    id: "vocab:power-index",
    label: "power / index",
    scopeId: "y12",
    definition: "The exponent that tells us which power a base is raised to, such as n in xⁿ.",
    notation: "n in xⁿ",
    relatedTopics: Object.freeze(["Basics of differentiation", "Differentiation from first principles"])
  }),
  "vocab:increasing": Object.freeze({
    id: "vocab:increasing",
    label: "increasing",
    scopeId: "y12",
    definition: "A function is increasing on an interval when its output rises as x increases; where differentiable, this corresponds to a positive derivative.",
    notation: "f′(x) > 0",
    relatedTopics: Object.freeze(["Basics of differentiation", "Increasing & decreasing"])
  }),
  "vocab:decreasing": Object.freeze({
    id: "vocab:decreasing",
    label: "decreasing",
    scopeId: "y12",
    definition: "A function is decreasing on an interval when its output falls as x increases; where differentiable, this corresponds to a negative derivative.",
    notation: "f′(x) < 0",
    relatedTopics: Object.freeze(["Basics of differentiation", "Increasing & decreasing"])
  }),
  "vocab:f-prime-notation": Object.freeze({
    id: "vocab:f-prime-notation",
    label: "f′(x)",
    scopeId: "y12",
    definition: "Prime notation for the derivative of f(x); its value at x gives the gradient of f at that x-value.",
    notation: "f′(x)",
    relatedTopics: Object.freeze(["Basics of differentiation", "Tangents & normals"])
  }),
  "vocab:dy-dx-notation": Object.freeze({
    id: "vocab:dy-dx-notation",
    label: "dy/dx",
    scopeId: "y12",
    definition: "Leibniz notation for the derivative of y with respect to x.",
    notation: "dy/dx",
    relatedTopics: Object.freeze(["Basics of differentiation", "Differentiation from first principles"])
  }),
  "vocab:d-dx-operator": Object.freeze({
    id: "vocab:d-dx-operator",
    label: "d/dx operator",
    scopeId: "y12",
    definition: "An instruction meaning differentiate the whole following expression with respect to x.",
    notation: "d/dx [ f(x) ]",
    relatedTopics: Object.freeze(["Basics of differentiation"])
  }),
  "vocab:limit": Object.freeze({
    id: "vocab:limit",
    label: "limit",
    scopeId: "y12",
    definition: "The value that an expression approaches as its input gets closer and closer to a specified value.",
    notation: "lim as h → 0",
    relatedTopics: Object.freeze(["Differentiation from first principles"])
  }),
  "vocab:chord": Object.freeze({
    id: "vocab:chord",
    label: "chord",
    scopeId: "y12",
    definition: "A straight line joining two points on a curve; in first principles its gradient approximates the tangent gradient.",
    notation: "PQ",
    relatedTopics: Object.freeze(["Differentiation from first principles"])
  }),
  "vocab:secant": Object.freeze({
    id: "vocab:secant",
    label: "secant",
    scopeId: "y12",
    definition: "Another name for the straight line through two points on a curve; the chord line used in a difference quotient.",
    notation: "line through P and Q",
    relatedTopics: Object.freeze(["Differentiation from first principles"])
  }),
  "vocab:first-principles": Object.freeze({
    id: "vocab:first-principles",
    label: "first principles",
    scopeId: "y12",
    definition: "The definition of a derivative obtained as the limit of chord gradients as the second point approaches the first.",
    notation: "f′(x) = lim as h → 0 of [f(x+h)−f(x)]/h",
    relatedTopics: Object.freeze(["Differentiation from first principles"])
  }),
  "vocab:approaches": Object.freeze({
    id: "vocab:approaches", label: "approaches", scopeId: "y12",
    definition: "Gets closer and closer to a value; it does not mean the variable must already equal that value.",
    notation: "h → 0", relatedTopics: Object.freeze(["Differentiation from first principles"])
  }),
  "vocab:approximation": Object.freeze({
    id: "vocab:approximation", label: "approximation", scopeId: "y12",
    definition: "A value or representation that is close to the exact one; in first principles a chord gradient approximates a tangent gradient.",
    notation: "m(chord) ≈ m(tangent)", relatedTopics: Object.freeze(["Differentiation from first principles"])
  }),
  "vocab:difference-quotient": Object.freeze({
    id: "vocab:difference-quotient", label: "difference quotient", scopeId: "y12",
    definition: "The chord gradient formed by dividing the change in function value by the horizontal change h.",
    notation: "[f(x+h)−f(x)]/h", relatedTopics: Object.freeze(["Differentiation from first principles"])
  }),
  "vocab:f-x-plus-h": Object.freeze({
    id: "vocab:f-x-plus-h", label: "f(x+h)", scopeId: "y12",
    definition: "The function value when the input x is replaced by x+h; geometrically it is the y-coordinate of the nearby point Q.",
    notation: "Q=(x+h, f(x+h))", relatedTopics: Object.freeze(["Differentiation from first principles"])
  }),
  "vocab:stationary-point": Object.freeze({
    id: "vocab:stationary-point", label: "stationary point", scopeId: "y12",
    definition: "A point on a differentiable curve where the gradient is zero, so the tangent is horizontal.", notation: "f′(a) = 0", relatedTopics: Object.freeze(["Stationary points"])
  }),
  "vocab:turning-point": Object.freeze({
    id: "vocab:turning-point", label: "turning point", scopeId: "y12",
    definition: "A point where the curve changes from increasing to decreasing or from decreasing to increasing.", notation: "+ to - or - to +", relatedTopics: Object.freeze(["Stationary points"])
  }),
  "vocab:local-maximum": Object.freeze({
    id: "vocab:local-maximum", label: "local maximum", scopeId: "y12",
    definition: "A point that is higher than nearby points on the curve; for a differentiable turning point the derivative changes from positive to negative.", notation: "+ → 0 → −", relatedTopics: Object.freeze(["Stationary points"])
  }),
  "vocab:local-minimum": Object.freeze({
    id: "vocab:local-minimum", label: "local minimum", scopeId: "y12",
    definition: "A point that is lower than nearby points on the curve; for a differentiable turning point the derivative changes from negative to positive.", notation: "− → 0 → +", relatedTopics: Object.freeze(["Stationary points"])
  }),
  "vocab:stationary-inflection": Object.freeze({
    id: "vocab:stationary-inflection", label: "stationary point of inflection", scopeId: "y12",
    definition: "A stationary point where the gradient is zero but the derivative keeps the same sign on both sides, so the curve does not turn.", notation: "+ → 0 → + or − → 0 → −", relatedTopics: Object.freeze(["Stationary points"])
  }),
  "vocab:first-derivative": Object.freeze({
    id: "vocab:first-derivative", label: "first derivative", scopeId: "y12",
    definition: "The derivative f′(x), which gives the gradient of the original function and its sign describes whether the function is locally rising or falling.", notation: "f′(x)", relatedTopics: Object.freeze(["Stationary points", "Increasing & decreasing"])
  }),
  "vocab:second-derivative": Object.freeze({
    id: "vocab:second-derivative", label: "second derivative", scopeId: "y12",
    definition: "The derivative of the gradient function f′(x); it describes how the gradient is changing.", notation: "f″(x)", relatedTopics: Object.freeze(["Stationary points"])
  }),
  "vocab:gradient-function": Object.freeze({
    id: "vocab:gradient-function", label: "gradient function", scopeId: "y12",
    definition: "The derivative function whose value gives the gradient of the original curve at each x-value.", notation: "f′(x)", relatedTopics: Object.freeze(["Basics of differentiation", "Stationary points"])
  }),
  "vocab:interval-notation": Object.freeze({
    id: "vocab:interval-notation", label: "interval notation", scopeId: "y12",
    definition: "A compact way to describe a continuous set of x-values; round brackets show that an endpoint is not included.", notation: "(a, b)", relatedTopics: Object.freeze(["Increasing & decreasing"])
  }),
  "vocab:integration": Object.freeze({id:"vocab:integration",label:"integration",scopeId:"y12",definition:"The process of finding an antiderivative; in this topic it is introduced as reverse differentiation.",notation:"∫ f(x) dx",relatedTopics:Object.freeze(["Introduction to integration"])}),
  "vocab:antiderivative": Object.freeze({id:"vocab:antiderivative",label:"antiderivative",scopeId:"y12",definition:"A function whose derivative is the given function.",notation:"F′(x)=f(x)",relatedTopics:Object.freeze(["Introduction to integration"])}),
  "vocab:constant-of-integration": Object.freeze({id:"vocab:constant-of-integration",label:"constant of integration",scopeId:"y12",definition:"The arbitrary constant added to an indefinite antiderivative because differentiation loses vertical-translation information.",notation:"+ C",relatedTopics:Object.freeze(["Introduction to integration","Definite and indefinite integration"])}),
  "vocab:indefinite-integral": Object.freeze({id:"vocab:indefinite-integral",label:"indefinite integral",scopeId:"y12",definition:"An integral with no limits whose answer is a family of antiderivatives.",notation:"∫ f(x) dx = F(x)+C",relatedTopics:Object.freeze(["Introduction to integration","Definite and indefinite integration"])}),
  "vocab:definite-integral": Object.freeze({id:"vocab:definite-integral",label:"definite integral",scopeId:"y12",definition:"An integral with lower and upper limits whose evaluation gives a numerical value.",notation:"∫ₐᵇ f(x) dx",relatedTopics:Object.freeze(["Definite and indefinite integration","Integration as area"])}),
  "vocab:lower-limit": Object.freeze({id:"vocab:lower-limit",label:"lower limit",scopeId:"y12",definition:"The starting x-value used when evaluating a definite integral.",notation:"a in ∫ₐᵇ f(x) dx",relatedTopics:Object.freeze(["Definite and indefinite integration"])}),
  "vocab:upper-limit": Object.freeze({id:"vocab:upper-limit",label:"upper limit",scopeId:"y12",definition:"The finishing x-value used when evaluating a definite integral.",notation:"b in ∫ₐᵇ f(x) dx",relatedTopics:Object.freeze(["Definite and indefinite integration"])}),
  "vocab:evaluation-brackets": Object.freeze({id:"vocab:evaluation-brackets",label:"evaluation brackets",scopeId:"y12",definition:"Square brackets used after integration to show that an antiderivative is evaluated at the upper and lower limits.",notation:"[F(x)]ₐᵇ = F(b) − F(a)",relatedTopics:Object.freeze(["Definite and indefinite integration"])}),
  "vocab:area-under-curve": Object.freeze({id:"vocab:area-under-curve",label:"area under a curve",scopeId:"y12",definition:"For a function that stays above the x-axis on an interval, the ordinary area between the curve and the axis over that interval.",notation:"area from a to b",relatedTopics:Object.freeze(["Integration as area"])}),
  "vocab:accumulated-area": Object.freeze({id:"vocab:accumulated-area",label:"accumulated area",scopeId:"y12",definition:"The area built up from a chosen starting point to a moving endpoint; in this topic the starting point is initially 0.",notation:"A(b)=∫₀ᵇ f(x) dx",relatedTopics:Object.freeze(["Integration as area"])}),
  "vocab:adjacent-intervals": Object.freeze({id:"vocab:adjacent-intervals",label:"adjacent intervals",scopeId:"y12",definition:"Intervals that touch at one endpoint, so their definite integrals can be added to give the integral over the combined interval.",notation:"∫ₐᶜf=∫ₐᵦf+∫ᵦᶜf",relatedTopics:Object.freeze(["Integration as area"])}),
  "vocab:signed-area": Object.freeze({id:"vocab:signed-area",label:"signed area",scopeId:"y12",definition:"Area interpreted with sign: regions above the x-axis contribute positively and regions below contribute negatively to a definite integral.",notation:"above + ; below −",relatedTopics:Object.freeze(["Areas below and crossing the axis"])}),
  "vocab:geometrical-area": Object.freeze({id:"vocab:geometrical-area",label:"total geometrical area",scopeId:"y12",definition:"The ordinary total area between a curve and the x-axis, found by adding the positive magnitudes of separate regions.",notation:"Σ |region integral|",relatedTopics:Object.freeze(["Areas below and crossing the axis"])}),
  "vocab:axis-crossing": Object.freeze({id:"vocab:axis-crossing",label:"axis crossing",scopeId:"y12",definition:"A point where the graph crosses the x-axis; it is a root and may mark a change in the sign of the function.",notation:"f(x)=0",relatedTopics:Object.freeze(["Areas below and crossing the axis"])}),
  "vocab:cancellation": Object.freeze({id:"vocab:cancellation",label:"cancellation",scopeId:"y12",definition:"When positive and negative signed contributions partly or completely offset each other in a definite integral.",notation:"positive + negative",relatedTopics:Object.freeze(["Areas below and crossing the axis"])}),
  "vocab:split-integral": Object.freeze({id:"vocab:split-integral",label:"split the integral",scopeId:"y12",definition:"Break one definite integral into adjacent interval integrals, especially at roots where the sign changes before finding total geometrical area.",notation:"∫ₐᶜf=∫ₐᵦf+∫ᵦᶜf",relatedTopics:Object.freeze(["Areas below and crossing the axis"])}),
  "vocab:integrand": Object.freeze({
    id: "vocab:integrand",
    label: "integrand",
    scopeId: "y12",
    definition: "The expression being integrated inside an integral.",
    notation: "f(x) in integral f(x) dx",
    relatedTopics: Object.freeze([
      "Introduction to integration",
      "Standard integrals",
      "Integration by substitution",
      "Integration by parts"
    ])
  }),
  "vocab:substitution": Object.freeze({id:"vocab:substitution",label:"substitution",scopeId:"y13-additional",definition:"A change of variable used to rewrite an integral in a new variable so its structure becomes simpler or standard.",notation:"u=g(x)",relatedTopics:Object.freeze(["Integration by substitution"])}),
  "vocab:differential": Object.freeze({id:"vocab:differential",label:"differential",scopeId:"y13-additional",definition:"The variable-change factor written with the integration variable, such as dx or du; in substitution it must be transformed consistently with the integrand.",notation:"du=g′(x) dx",relatedTopics:Object.freeze(["Integration by substitution"])}),
  "vocab:integration-by-parts": Object.freeze({id:"vocab:integration-by-parts",label:"integration by parts",scopeId:"y13-additional",definition:"An integration method derived from the product rule that rewrites an integral as uv minus a new integral; it is useful when the new integral becomes simpler.",notation:"∫u dv = uv − ∫v du",relatedTopics:Object.freeze(["Integration by parts"])}),
  "vocab:partial-fractions": Object.freeze({id:"vocab:partial-fractions",label:"partial fractions",scopeId:"y13-additional",definition:"A decomposition of a proper rational function into simpler rational terms whose denominators are factors of the original denominator.",notation:"A/(x−a)+B/(x−b)",relatedTopics:Object.freeze(["Integration using partial fractions"])}),
  "vocab:proper-rational-function": Object.freeze({id:"vocab:proper-rational-function",label:"proper rational function",scopeId:"y13-additional",definition:"A rational function whose numerator has lower degree than its denominator.",notation:"deg numerator < deg denominator",relatedTopics:Object.freeze(["Integration using partial fractions"])}),
  "vocab:repeated-factor": Object.freeze({id:"vocab:repeated-factor",label:"repeated linear factor",scopeId:"y13-additional",definition:"A linear denominator factor occurring more than once; a partial-fraction decomposition must include every power up to its multiplicity.",notation:"(x−a)² ⇒ A/(x−a)+B/(x−a)²",relatedTopics:Object.freeze(["Integration using partial fractions"])}),
  "vocab:polynomial-division": Object.freeze({id:"vocab:polynomial-division",label:"polynomial division",scopeId:"y13-additional",definition:"Division of one polynomial by another to produce a quotient and remainder; used before partial fractions when a rational function is improper.",notation:"numerator/denominator = quotient + remainder/denominator",relatedTopics:Object.freeze(["Integration using partial fractions"])}),
  "vocab:logarithm-laws": Object.freeze({id:"vocab:logarithm-laws",label:"logarithm laws",scopeId:"y13-additional",definition:"Rules for combining logarithms using products, quotients and powers.",notation:"ln A+ln B=ln(AB)",relatedTopics:Object.freeze(["Integration using partial fractions"])}),
  "vocab:standard-function": Object.freeze({id:"vocab:standard-function",label:"standard function",scopeId:"y13-additional",definition:"A commonly used function with a standard derivative rule that should be recognised and recalled fluently.",notation:"sin x, cos x, e^x, ln x",relatedTopics:Object.freeze(["Differentiation of standard functions"])}),
  "vocab:radians": Object.freeze({id:"vocab:radians",label:"radians",scopeId:"y13-additional",definition:"The angle measure required for the standard trigonometric differentiation rules used in A level calculus.",notation:"RAD",relatedTopics:Object.freeze(["Differentiation of standard functions"])}),
  "vocab:scale-factor": Object.freeze({id:"vocab:scale-factor",label:"input scale factor",scopeId:"y13-additional",definition:"A multiplier inside a standard function, such as a in sin(ax), that changes how quickly the input varies and therefore changes gradient size.",notation:"a in f(ax)",relatedTopics:Object.freeze(["Differentiation of standard functions"])}),
  "vocab:exponential-function": Object.freeze({id:"vocab:exponential-function",label:"exponential function",scopeId:"y13-additional",definition:"A function in which the variable appears in the exponent, such as e^x or a^x.",notation:"e^x, a^x",relatedTopics:Object.freeze(["Differentiation of standard functions"])}),
  "vocab:natural-logarithm": Object.freeze({id:"vocab:natural-logarithm",label:"natural logarithm",scopeId:"y13-additional",definition:"The logarithm to base e, defined for positive inputs and written ln x.",notation:"ln x",relatedTopics:Object.freeze(["Differentiation of standard functions"])}),
  "vocab:small-angle-approximation": Object.freeze({id:"vocab:small-angle-approximation",label:"small-angle approximation",scopeId:"y13-additional",definition:"A close approximation valid when an angle measured in radians is near zero, such as sin h being close to h and cos h being close to 1.",notation:"sin h ≈ h; cos h ≈ 1",relatedTopics:Object.freeze(["First-principles proofs for trig derivatives"])}),
  "vocab:trig-limit": Object.freeze({id:"vocab:trig-limit",label:"trigonometric small-angle limit",scopeId:"y13-additional",definition:"A limiting result near zero used in the first-principles proofs of the sine and cosine derivative rules.",notation:"lim sin h/h=1; lim (cos h−1)/h=0",relatedTopics:Object.freeze(["First-principles proofs for trig derivatives"])}),
  "vocab:angle-addition-formula": Object.freeze({id:"vocab:angle-addition-formula",label:"angle-addition formula",scopeId:"y13-additional",definition:"An identity for expanding a trigonometric function of a sum of angles, used to expand sin(x+h) or cos(x+h) in first-principles proofs.",notation:"sin(x+h), cos(x+h)",relatedTopics:Object.freeze(["First-principles proofs for trig derivatives"])}),
  "vocab:first-principles-definition": Object.freeze({id:"vocab:first-principles-definition",label:"first-principles definition",scopeId:"y13-additional",definition:"The derivative defined as the limiting value of a difference quotient as the horizontal increment h approaches zero.",notation:"f′(x)=lim h→0 [f(x+h)−f(x)]/h",relatedTopics:Object.freeze(["First-principles proofs for trig derivatives"])}),
  "vocab:product-rule": Object.freeze({id:"vocab:product-rule",label:"product rule",scopeId:"y13-additional",definition:"A differentiation rule for a product of two functions; the derivative is formed by differentiating each factor in turn while leaving the other unchanged.",notation:"(uv)′=u′v+uv′",relatedTopics:Object.freeze(["Product, quotient and chain rule"])}),
  "vocab:quotient-rule": Object.freeze({id:"vocab:quotient-rule",label:"quotient rule",scopeId:"y13-additional",definition:"A differentiation rule for one function divided by another, with the order v u′ minus u v′ preserved in the numerator.",notation:"(u/v)′=(vu′−uv′)/v²",relatedTopics:Object.freeze(["Product, quotient and chain rule"])}),
  "vocab:chain-rule": Object.freeze({id:"vocab:chain-rule",label:"chain rule",scopeId:"y13-additional",definition:"A differentiation rule for a composite function: differentiate the outside with the inside left in place, then multiply by the derivative of the inside.",notation:"dy/dx=(dy/du)(du/dx)",relatedTopics:Object.freeze(["Product, quotient and chain rule"])}),
  "vocab:function-composition": Object.freeze({id:"vocab:function-composition",label:"function composition",scopeId:"y13-additional",definition:"Feeding the output of one function into another; order matters.",notation:"f(g(x))",relatedTopics:Object.freeze(["Product, quotient and chain rule"])}),
  "vocab:composite-function": Object.freeze({id:"vocab:composite-function",label:"composite function",scopeId:"y13-additional",definition:"A function made by applying one function to the output of another.",notation:"f∘g",relatedTopics:Object.freeze(["Product, quotient and chain rule"])}),
  "vocab:inner-function": Object.freeze({id:"vocab:inner-function",label:"inner function",scopeId:"y13-additional",definition:"The function evaluated first in a composite expression such as g(x) in f(g(x)).",notation:"g(x) in f(g(x))",relatedTopics:Object.freeze(["Product, quotient and chain rule"])}),
  "vocab:outer-function": Object.freeze({id:"vocab:outer-function",label:"outer function",scopeId:"y13-additional",definition:"The function applied after the inner function in a composite expression, such as f in f(g(x)).",notation:"f(□) in f(g(x))",relatedTopics:Object.freeze(["Product, quotient and chain rule"])}),
  "vocab:parametric-equations": Object.freeze({id:"vocab:parametric-equations",label:"parametric equations",scopeId:"y13-additional",definition:"A pair of equations in which x and y are both defined using a shared parameter.",notation:"x=f(t), y=g(t)",relatedTopics:Object.freeze(["Parametric equations and differentiation"])}),
  "vocab:parameter": Object.freeze({id:"vocab:parameter",label:"parameter",scopeId:"y13-additional",definition:"A shared input used to generate both coordinates of a point on a parametric curve.",notation:"t",relatedTopics:Object.freeze(["Parametric equations and differentiation"])}),
  "vocab:parameter-interval": Object.freeze({id:"vocab:parameter-interval",label:"parameter interval",scopeId:"y13-additional",definition:"The allowed range of parameter values; restricting it restricts the portion of the curve being traced.",notation:"a≤t≤b",relatedTopics:Object.freeze(["Parametric equations and differentiation"])}),
  "vocab:eliminate-parameter": Object.freeze({id:"vocab:eliminate-parameter",label:"eliminate the parameter",scopeId:"y13-additional",definition:"Remove the parameter algebraically to obtain a direct relationship between x and y when possible.",notation:"x=f(t), y=g(t) → F(x,y)=0",relatedTopics:Object.freeze(["Parametric equations and differentiation"])}),
  "vocab:parametric-gradient": Object.freeze({id:"vocab:parametric-gradient",label:"parametric gradient",scopeId:"y13-additional",definition:"The gradient of a parametric curve found from the ratio of the y-rate to the x-rate when dx/dt is non-zero.",notation:"dy/dx=(dy/dt)/(dx/dt)",relatedTopics:Object.freeze(["Parametric equations and differentiation"])}),
  "vocab:vertical-tangent": Object.freeze({id:"vocab:vertical-tangent",label:"vertical tangent",scopeId:"y13-additional",definition:"A tangent parallel to the y-axis; in a regular parametric case it occurs when dx/dt=0 while dy/dt is non-zero.",notation:"dx/dt=0, dy/dt≠0",relatedTopics:Object.freeze(["Parametric equations and differentiation"])}),
  "vocab:implicit-relation": Object.freeze({id:"vocab:implicit-relation",label:"implicit relation",scopeId:"y13-additional",definition:"A relationship between x and y written without isolating y as a single function of x.",notation:"F(x,y)=0",relatedTopics:Object.freeze(["Implicit differentiation"])}),
  "vocab:explicit-form": Object.freeze({id:"vocab:explicit-form",label:"explicit form",scopeId:"y13-additional",definition:"A relation written with y isolated as a function of x.",notation:"y=f(x)",relatedTopics:Object.freeze(["Implicit differentiation"])}),
  "vocab:implicit-differentiation": Object.freeze({id:"vocab:implicit-differentiation",label:"implicit differentiation",scopeId:"y13-additional",definition:"Differentiating a relation involving x and y directly with respect to x, using the chain rule on y-dependent terms.",notation:"d/dx[F(x,y)]=0",relatedTopics:Object.freeze(["Implicit differentiation"])}),
  "vocab:dependent-variable": Object.freeze({id:"vocab:dependent-variable",label:"dependent variable",scopeId:"y13-additional",definition:"A variable whose value depends on another variable; in implicit differentiation y is treated as y(x).",notation:"y=y(x)",relatedTopics:Object.freeze(["Implicit differentiation"])}),
  "vocab:inverse-function": Object.freeze({id:"vocab:inverse-function",label:"inverse function",scopeId:"y13-additional",definition:"A function that reverses the effect of a one-to-one function, swapping input and output roles.",notation:"f⁻¹",relatedTopics:Object.freeze(["Trig identities and inverse trig differentiation"])}),
  "vocab:reciprocal-function": Object.freeze({id:"vocab:reciprocal-function",label:"reciprocal",scopeId:"y13-additional",definition:"One divided by a non-zero function value; this is not the same operation as taking an inverse function.",notation:"[f(x)]⁻¹=1/f(x)",relatedTopics:Object.freeze(["Trig identities and inverse trig differentiation"])}),
  "vocab:restricted-domain": Object.freeze({id:"vocab:restricted-domain",label:"restricted domain",scopeId:"y13-additional",definition:"A reduced input interval chosen so a function is one-to-one and therefore has an inverse function.",notation:"sin: −π/2≤x≤π/2",relatedTopics:Object.freeze(["Trig identities and inverse trig differentiation"])}),
  "vocab:arcsin": Object.freeze({id:"vocab:arcsin",label:"arcsin",scopeId:"y13-additional",definition:"The inverse sine function on the principal sine domain.",notation:"arcsin x = sin⁻¹x",relatedTopics:Object.freeze(["Trig identities and inverse trig differentiation"])}),
  "vocab:arccos": Object.freeze({id:"vocab:arccos",label:"arccos",scopeId:"y13-additional",definition:"The inverse cosine function on the principal cosine domain.",notation:"arccos x = cos⁻¹x",relatedTopics:Object.freeze(["Trig identities and inverse trig differentiation"])}),
  "vocab:arctan": Object.freeze({id:"vocab:arctan",label:"arctan",scopeId:"y13-additional",definition:"The inverse tangent function on the principal tangent domain.",notation:"arctan x = tan⁻¹x",relatedTopics:Object.freeze(["Trig identities and inverse trig differentiation"])}),
  "vocab:secant-function": Object.freeze({id:"vocab:secant-function",label:"secant function",scopeId:"y13-additional",definition:"The reciprocal of cosine.",notation:"sec x=1/cos x",relatedTopics:Object.freeze(["Trig identities and inverse trig differentiation"])}),
  "vocab:cosecant-function": Object.freeze({id:"vocab:cosecant-function",label:"cosecant function",scopeId:"y13-additional",definition:"The reciprocal of sine.",notation:"cosec x=1/sin x",relatedTopics:Object.freeze(["Trig identities and inverse trig differentiation"])}),
  "vocab:cotangent-function": Object.freeze({id:"vocab:cotangent-function",label:"cotangent function",scopeId:"y13-additional",definition:"The reciprocal of tangent, equivalently cosine divided by sine.",notation:"cot x=1/tan x=cos x/sin x",relatedTopics:Object.freeze(["Trig identities and inverse trig differentiation"])}),
  "vocab:concave": Object.freeze({id:"vocab:concave",label:"concave",scopeId:"y13-additional",definition:"A curve is concave on an interval when its second derivative is negative (or non-positive in the non-strict convention), so tangent gradients decrease as x increases.",notation:"f″(x)<0",relatedTopics:Object.freeze(["Concavity, convexity and inflection"])}),
  "vocab:convex": Object.freeze({id:"vocab:convex",label:"convex",scopeId:"y13-additional",definition:"A curve is convex on an interval when its second derivative is positive (or non-negative in the non-strict convention), so tangent gradients increase as x increases.",notation:"f″(x)>0",relatedTopics:Object.freeze(["Concavity, convexity and inflection"])}),
  "vocab:point-of-inflection": Object.freeze({id:"vocab:point-of-inflection",label:"point of inflection",scopeId:"y13-additional",definition:"A point where the second derivative changes sign, so the curve changes between concave and convex behaviour.",notation:"f″ changes sign",relatedTopics:Object.freeze(["Concavity, convexity and inflection"])}),
  "vocab:connected-rate": Object.freeze({id:"vocab:connected-rate",label:"connected rate",scopeId:"y13-additional",definition:"A rate of change linked to another rate because the quantities depend on one another.",notation:"dy/dt=(dy/dx)(dx/dt)",relatedTopics:Object.freeze(["Connected rates of change"])}),
  "vocab:rate-flow-diagram": Object.freeze({id:"vocab:rate-flow-diagram",label:"rate-flow diagram",scopeId:"y13-additional",definition:"A dependency diagram that orders changing quantities and labels the derivatives connecting adjacent variables before numerical substitution.",notation:"t → r → A",relatedTopics:Object.freeze(["Connected rates of change"])}),
  "vocab:rate-unit": Object.freeze({id:"vocab:rate-unit",label:"rate unit",scopeId:"y13-additional",definition:"A compound unit describing change in the numerator quantity per unit change in the denominator quantity.",notation:"cm² s⁻¹, cm³ s⁻¹",relatedTopics:Object.freeze(["Connected rates of change"])}),
  "vocab:standard-integral": Object.freeze({id:"vocab:standard-integral",label:"standard integral",scopeId:"y13-additional",definition:"A standard antiderivative result that should be recognised and recalled fluently before choosing more advanced integration methods.",notation:"integrand ↔ antiderivative",relatedTopics:Object.freeze(["Standard integrals to memorise"])}),
  "vocab:fundamental-theorem": Object.freeze({id:"vocab:fundamental-theorem",label:"Fundamental Theorem of Calculus",scopeId:"y13-additional",definition:"The theorem linking antiderivatives to definite integrals: if F prime equals f, then the integral from a to b of f is F(b)-F(a).",notation:"∫_a^b f(x) dx = F(b) - F(a)",relatedTopics:Object.freeze(["Standard integrals to memorise","Definite and indefinite integration","Integration as area"])}),

  "vocab:differential-equation": Object.freeze({id:"vocab:differential-equation",label:"differential equation",scopeId:"y13-additional",definition:"An equation involving an unknown function and one or more of its derivatives.",notation:"dy/dx = f(x,y)",relatedTopics:Object.freeze(["First-order differential equations"])}),
  "vocab:first-order": Object.freeze({id:"vocab:first-order",label:"first order",scopeId:"y13-additional",definition:"A differential equation whose highest derivative is a first derivative.",notation:"dy/dx present; no higher derivative",relatedTopics:Object.freeze(["First-order differential equations"])}),
  "vocab:independent-variable": Object.freeze({id:"vocab:independent-variable",label:"independent variable",scopeId:"y13-additional",definition:"The input variable with respect to which change is measured.",notation:"x in dy/dx",relatedTopics:Object.freeze(["First-order differential equations"])}),
  "vocab:separable": Object.freeze({id:"vocab:separable",label:"separable",scopeId:"y13-additional",definition:"A first-order differential equation that can be rearranged so y-dependent factors are with dy and x-dependent factors are with dx.",notation:"[1/g(y)]dy=f(x)dx",relatedTopics:Object.freeze(["First-order differential equations"])}),
  "vocab:general-solution": Object.freeze({id:"vocab:general-solution",label:"general solution",scopeId:"y13-additional",definition:"A family of solutions containing an arbitrary constant.",notation:"y=F(x)+C",relatedTopics:Object.freeze(["First-order differential equations"])}),
  "vocab:particular-solution": Object.freeze({id:"vocab:particular-solution",label:"particular solution",scopeId:"y13-additional",definition:"One specific member of a general solution family, selected by a condition.",notation:"C fixed by a condition",relatedTopics:Object.freeze(["First-order differential equations"])}),
  "vocab:arbitrary-constant": Object.freeze({id:"vocab:arbitrary-constant",label:"arbitrary constant",scopeId:"y13-additional",definition:"A constant representing all possible members of an indefinite solution family until a condition fixes its value.",notation:"C",relatedTopics:Object.freeze(["First-order differential equations"])}),
  "vocab:initial-condition": Object.freeze({id:"vocab:initial-condition",label:"initial condition",scopeId:"y13-additional",definition:"A stated value of the dependent variable at a specified starting value of the independent variable.",notation:"y(x₀)=y₀",relatedTopics:Object.freeze(["First-order differential equations"])}),
  "vocab:boundary-condition": Object.freeze({id:"vocab:boundary-condition",label:"boundary condition",scopeId:"y13-additional",definition:"A condition imposed on a solution at a specified value of the independent variable; it can determine an arbitrary constant.",notation:"y(a)=b",relatedTopics:Object.freeze(["First-order differential equations"])}),
  "vocab:model": Object.freeze({id:"vocab:model",label:"model",scopeId:"y13-additional",definition:"A mathematical representation of a real situation built from stated relationships and assumptions.",notation:"context → equation → interpretation",relatedTopics:Object.freeze(["First-order differential equations"])}),
  "vocab:proportionality-constant": Object.freeze({id:"vocab:proportionality-constant",label:"proportionality constant",scopeId:"y13-additional",definition:"A constant multiplier introduced when replacing a proportionality statement by an equation.",notation:"A ∝ B ⇒ A=kB",relatedTopics:Object.freeze(["First-order differential equations"])}),
});

export function getVocabularyTerm(termId) {
  return vocabularyTerms[termId] ?? null;
}

export function getVocabularyTerms() {
  return Object.values(vocabularyTerms);
}
