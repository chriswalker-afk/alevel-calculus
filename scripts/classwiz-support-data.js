const models = Object.freeze({
  cw: Object.freeze({ id:'cw', label:'fx-991CW', shortLabel:'991CW' }),
  ex: Object.freeze({ id:'ex', label:'fx-991EX', shortLabel:'991EX' })
});

function freezeSteps(steps){return Object.freeze(steps.map((step)=>Object.freeze({...step})));}
const freeze=Object.freeze;

const derivativeSteps=freeze({
  cw:freezeSteps([
    {label:'Open',text:'HOME -> Calculate.'},
    {label:'Insert d/dx',text:'CATALOG -> Func Analysis -> Derivative(d/dx).'},
    {label:'Enter',text:'Enter the function and the x-value at which the derivative is required.'},
    {label:'Check',text:'Press EXE and compare the numerical derivative with your symbolic result.'}
  ]),
  ex:freezeSteps([
    {label:'Open',text:'Open Calculate/COMP.'},
    {label:'Insert d/dx',text:'Press SHIFT, then the integral key labelled d/dx above it.'},
    {label:'Enter',text:'Enter the function and the x-value at which the derivative is required.'},
    {label:'Check',text:'Press = and compare the numerical derivative with your symbolic result.'}
  ])
});

const integralSteps=freeze({
  cw:freezeSteps([
    {label:'Open',text:'HOME -> Calculate.'},
    {label:'Insert integral',text:'CATALOG -> Func Analysis -> Integration(∫).'},
    {label:'Enter',text:'Enter the lower limit, upper limit and integrand.'},
    {label:'Check',text:'Press EXE and compare the numerical value with your exact result.'}
  ]),
  ex:freezeSteps([
    {label:'Open',text:'Open Calculate/COMP.'},
    {label:'Insert integral',text:'Press the integral key to insert the definite-integral template.'},
    {label:'Enter',text:'Enter the lower limit, upper limit and integrand.'},
    {label:'Check',text:'Press = and compare the numerical value with your exact result.'}
  ])
});

function tableSteps({paired=false}={}){
  return freeze({
    cw:freezeSteps([
      {label:'Open TABLE',text:'HOME -> Table.'},
      {label:'Enter function'+(paired?'s':''),text:paired?'Enter the two expressions as f(x) and g(x).':'Enter the required expression as f(x).'},
      {label:'Set range',text:'Set the table range so Start, End and Step match the values you need.'},
      {label:'Inspect',text:paired?'Compare the paired f(x), g(x) outputs row by row.':'Read the required x and f(x) values from the table.'}
    ]),
    ex:freezeSteps([
      {label:'Open TABLE',text:'MENU -> Table.'},
      {label:'Enter function'+(paired?'s':''),text:paired?'Enter the two expressions as f(X) and g(X).':'Enter the required expression as f(X).'},
      {label:'Set range',text:'Choose Start, End and Step to match the values you need.'},
      {label:'Inspect',text:paired?'Compare the paired f(X), g(X) outputs row by row.':'Read the required X and f(X) values from the table.'}
    ])
  });
}

const polynomialRootSteps=freeze({
  cw:freezeSteps([
    {label:'Open Equation',text:'HOME -> Equation.'},
    {label:'Choose Polynomial',text:'Select Polynomial, then choose the degree (2, 3 or 4).'},
    {label:'Enter coefficients',text:'Enter the coefficients in descending powers, including any zero coefficients.'},
    {label:'Check roots',text:'Read the listed roots and compare them with the roots obtained in your written solution.'}
  ]),
  ex:freezeSteps([
    {label:'Open Equation/Func',text:'MENU -> Equation/Func.'},
    {label:'Choose Polynomial',text:'Select Polynomial, then choose the degree (2, 3 or 4).'},
    {label:'Enter coefficients',text:'Enter the coefficients in descending powers, including any zero coefficients.'},
    {label:'Check roots',text:'Read the listed roots and compare them with the roots obtained in your written solution.'}
  ])
});

function useCase({id,label,helpsWith,example,radiansRequired=false,radiansReminder='',doesNotReplace,models:steps}){
  return freeze({id,label,helpsWith,exampleLabel:'Sample check',example,radiansRequired,radiansReminder,doesNotReplace,models:steps});
}

export const SHARED_CLASSWIZ_USE_CASES=freeze({
  derivativeCheck:useCase({
    id:'derivative-check',label:'Numerical d/dx',
    helpsWith:'Checking a derivative value at one chosen point after differentiating symbolically.',
    example:'For f(x)=sin x at x=π/3, the numerical derivative should be approximately 0.5.',
    radiansRequired: true,radiansReminder:'Use RADIAN mode for this trigonometric derivative check.',
    doesNotReplace:'This checks one numerical derivative value. It does not replace finding the derivative algebraically or showing the differentiation method required by the question.',
    models:derivativeSteps
  }),
  integralCheck:useCase({
    id:'integral-check',label:'Numerical integral',
    radiansRequired: false,
    helpsWith:'Checking the value of a definite integral after the exact setup and method have been completed.',
    example:'For ∫₀²(3x²+1) dx, the calculator should give 10.',
    doesNotReplace:'This checks a definite numerical value. It does not replace exact integration, method selection, algebraic working, or +C in indefinite integration.',
    models:integralSteps
  }),
  trigIntegralCheck:useCase({
    id:'trig-integral-check',label:'Trig integral check',
    helpsWith:'Checking a definite trigonometric integral after the exact identity or integration method has been shown.',
    example:'In radians, compare your exact value for ∫₀^(π/2) sin x dx with the calculator value 1.',
    radiansRequired: true,radiansReminder:'Set the angle unit to RADIAN before checking a trigonometric integral.',
    doesNotReplace:'The numerical value does not replace the trig identity, exact antiderivative, limits or exact working required in the solution.',
    models:integralSteps
  }),
  functionTable:useCase({
    id:'function-table',label:'TABLE: function values',
    helpsWith:'Exploring or checking function values at a regular set of x-values.',
    example:'Enter a function and compare values on each side of a suspected root, turning point or interval boundary.',
    doesNotReplace:'A value table is evidence and a checking tool. It does not replace algebraic solving, exact roots, differentiation or proof.',
    models:tableSteps()
  }),
  pairedTable:useCase({
    id:'paired-table',label:'TABLE: paired values',
    helpsWith:'Generating paired values for two expressions, such as x(t) and y(t), to inspect a parametric trace.',
    example:'For x=t²−1 and y=t³−3t, enter the two expressions and compare paired outputs over a suitable t-range.',
    doesNotReplace:'A coordinate table supports exploration. It does not replace eliminating the parameter, finding exact ranges, differentiating parametrically or showing exact working.',
    models:tableSteps({paired:true})
  }),
  ordinateTable:useCase({
    id:'ordinate-table',label:'TABLE: ordinates',
    helpsWith:'Generating or checking f(x) values at the equally spaced x-values required by the trapezium rule.',
    example:'For f(x)=x²+1 on 0≤x≤4 with four trapezia, use x=0,1,2,3,4 and compare the y-values.',
    doesNotReplace:'TABLE checks the ordinate data. It does not replace finding h, showing the 1,2,…,2,1 coefficients or writing the trapezium-rule calculation.',
    models:tableSteps()
  }),
  smallAngleTable:useCase({
    id:'small-angle-table',label:'TABLE: small-angle evidence',
    helpsWith:'Seeing numerical evidence that sin h / h approaches 1 as h approaches 0.',
    example:'In radians, compare sin(x)/x at x=0.1, 0.01 and 0.001.',
    radiansRequired: true,radiansReminder:'RADIAN mode is essential for this small-angle limit evidence.',
    doesNotReplace:'The table supplies numerical evidence only. Do not use it to replace the limit argument or the first-principles proof.',
    models:tableSteps()
  }),
  polynomialRoots:useCase({
    id:'polynomial-roots',label:'Polynomial root check',
    helpsWith:'Checking roots of a quadratic, cubic or quartic after forming and solving the polynomial equation.',
    example:'After solving 2x²+x−3=0 by an exact method, use Polynomial mode to verify the two roots.',
    doesNotReplace:'Polynomial mode verifies roots. It does not replace forming the equation, exact factorisation/algebra, sign analysis or any method the question asks you to show.',
    models:polynomialRootSteps
  })
});

function pack(topicId,title,useCases,{defaultUseCaseId=useCases[0].id,introduction='Use the calculator as a numerical check after the mathematics has been set up. It should not replace working the course expects you to show.'}={}){
  return freeze({topicId,title,introduction,defaultUseCaseId,defaultModelId:'cw',useCases:freeze(useCases)});
}

const U=SHARED_CLASSWIZ_USE_CASES;

const supportPacksArray=[
  pack('topic:y12:differentiation:basics','ClassWiz numerical checks',[U.derivativeCheck,U.integralCheck],{defaultUseCaseId:'derivative-check'}),
  pack('topic:y12:differentiation:tangents-normals','ClassWiz tangent checks',[U.derivativeCheck]),
  pack('topic:y12:differentiation:stationary-points','ClassWiz stationary-point checks',[U.polynomialRoots,U.functionTable],{defaultUseCaseId:'polynomial-roots'}),
  pack('topic:y12:differentiation:increasing-decreasing','ClassWiz interval checks',[U.polynomialRoots,U.functionTable],{defaultUseCaseId:'polynomial-roots'}),
  pack('topic:y12:integration:definite-indefinite','ClassWiz definite-integral checks',[U.integralCheck]),
  pack('topic:y12:integration:area','ClassWiz area checks',[U.integralCheck]),
  pack('topic:y12:integration:signed-area','ClassWiz signed-area checks',[U.integralCheck,U.polynomialRoots],{defaultUseCaseId:'integral-check'}),
  pack('topic:y13:differentiation:standard-functions','ClassWiz derivative checks',[U.derivativeCheck]),
  pack('topic:y13:differentiation:trig-first-principles','ClassWiz small-angle evidence',[U.smallAngleTable]),
  pack('topic:y13:differentiation:product-quotient-chain','ClassWiz rule checks',[U.derivativeCheck]),
  pack('topic:y13:differentiation:parametric-differentiation','ClassWiz parametric checks',[U.pairedTable,U.derivativeCheck],{defaultUseCaseId:'paired-table',introduction:'Use TABLE for paired-coordinate exploration and numerical d/dx only as checks. These calculator checks do not replace parametric algebra, exact ranges or the chain-rule derivation.'}),
  pack('topic:y13:differentiation:trig-identities-inverse','ClassWiz trig derivative checks',[U.derivativeCheck]),
  pack('topic:y13:differentiation:concavity-inflection','ClassWiz concavity checks',[U.polynomialRoots,U.functionTable],{defaultUseCaseId:'polynomial-roots'}),
  pack('topic:y13:integration:standard-integrals','ClassWiz integral checks',[U.integralCheck]),
  pack('topic:y13:integration:reverse-chain-rule','ClassWiz reverse-chain checks',[U.integralCheck]),
  pack('topic:y13:integration:trig-identities','ClassWiz trig integral checks',[U.trigIntegralCheck]),
  pack('topic:y13:integration:substitution','ClassWiz substitution checks',[U.integralCheck]),
  pack('topic:y13:integration:by-parts','ClassWiz integration-by-parts checks',[U.integralCheck]),
  pack('topic:y13:integration:partial-fractions','ClassWiz partial-fractions checks',[U.integralCheck,U.polynomialRoots],{defaultUseCaseId:'integral-check'}),
  pack('topic:y13:integration:areas','ClassWiz area checks',[U.integralCheck,U.polynomialRoots],{defaultUseCaseId:'integral-check'}),
  pack('topic:y13:integration:parametric-area','ClassWiz parametric-area checks',[U.pairedTable,U.integralCheck],{defaultUseCaseId:'paired-table'}),
  pack('topic:y13:integration:limit-of-sum','ClassWiz converted-integral checks',[U.integralCheck]),
  pack('topic:y13:integration:numerical-integration','ClassWiz numerical-integration checks',[U.ordinateTable,U.integralCheck],{
    defaultUseCaseId:'ordinate-table',
    introduction:'Use TABLE to generate/check the same equally spaced ordinates used in the written trapezium-rule setup. A calculator definite-integral command also gives a numerical approximation, but this support does not claim that a ClassWiz uses the trapezium rule internally. The calculator does not replace the coefficient working.'
  })
];

const supportPacks=new Map(supportPacksArray.map((entry)=>[entry.topicId,entry]));

const noPackAuditReasons=freeze({
  'topic:y12:foundations:pre-calculus':'The topic is conceptual preparation; calculator output would add little to the intended gradient/graph reasoning.',
  'topic:y12:differentiation:first-principles':'The point is the limiting argument and proof. Numerical calculator evidence would risk replacing rather than supporting the derivation.',
  'topic:y12:integration:introduction':'The early inverse-differentiation ideas are better checked by differentiating the result than by introducing calculator integration immediately.',
  'topic:y12:review:calculus-mastery':'Review mixes many methods. Calculator support is more precise in the source topics than as a generic review overlay.',
  'topic:y13:differentiation:implicit-differentiation':'The course method is symbolic term-by-term differentiation and rearrangement; no single calculator check naturally verifies the full implicit method.',
  'topic:y13:differentiation:connected-rates':'The main difficulty is modelling the dependency and units, not a calculator operation.',
  'topic:full:review:calculus-mastery':'This review is topic-blind. Calculator checks should be used from the relevant source topic after the method has been identified.',
  'topic:y13:differential-equations:first-order':'The assessed work is separation, exact integration, constants and interpretation; a generic calculator action would not verify the complete method reliably.',
  'topic:y13:modelling:calculus':'Calculator opportunities depend on the selected model. Source-topic calculator support is more accurate than a generic modelling pack.',
  'topic:full:review:full-calculus-mastery':'Full calculus mastery is deliberately topic-blind. Once a method is identified, use the calculator support from the relevant source topic rather than a generic mastery pack.'
});

export const CLASSWIZ_OPPORTUNITY_AUDIT=freeze([
  ...supportPacksArray.map((entry)=>freeze({topicId:entry.topicId,status:'enabled',useCaseIds:freeze(entry.useCases.map((useCase)=>useCase.id)),reason:'A calculator check or TABLE exploration naturally supports this topic without replacing its symbolic method.'})),
  ...Object.entries(noPackAuditReasons).map(([topicId,reason])=>freeze({topicId,status:'not-added',useCaseIds:freeze([]),reason}))
]);

export function getClassWizModels(){return models;}
export function getClassWizSupportPack(topicId){return supportPacks.get(topicId)??null;}
export function hasClassWizSupport(topicId){return supportPacks.has(topicId);}
export function getClassWizUseCase(topicId,useCaseId){return getClassWizSupportPack(topicId)?.useCases.find((entry)=>entry.id===useCaseId)??null;}
export function getClassWizAuditDecision(topicId){return CLASSWIZ_OPPORTUNITY_AUDIT.find((entry)=>entry.topicId===topicId)??null;}
