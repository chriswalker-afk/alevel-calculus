const models = Object.freeze({
  cw: Object.freeze({
    id: 'cw',
    label: 'fx-991CW',
    shortLabel: '991CW'
  }),
  ex: Object.freeze({
    id: 'ex',
    label: 'fx-991EX',
    shortLabel: '991EX'
  })
});

function freezeSteps(steps) {
  return Object.freeze(steps.map((step) => Object.freeze({ ...step })));
}

const basicsSupportPack = Object.freeze({
  topicId: 'topic:y12:differentiation:basics',
  title: 'ClassWiz numerical checks',
  introduction: 'Use the calculator to check a numerical value after you have set up the mathematics.',
  defaultUseCaseId: 'derivative-check',
  defaultModelId: 'cw',
  useCases: Object.freeze([
    Object.freeze({
      id: 'derivative-check',
      label: 'Numerical d/dx',
      helpsWith: 'Checking the gradient of a function at one chosen x-value.',
      exampleLabel: 'Sample check',
      example: 'For f(x) = sin x at x = pi/3, the calculator should give approximately 0.5.',
      radiansRequired: true,
      radiansReminder: 'RADIAN mode required for this trigonometric check.',
      doesNotReplace: 'This checks one numerical gradient. It does not replace differentiating sin x algebraically or showing the differentiation method required in an exam.',
      models: Object.freeze({
        cw: freezeSteps([
          { label: 'Open', text: 'HOME -> Calculate.' },
          { label: 'Insert d/dx', text: 'CATALOG -> Func Analysis -> Derivative(d/dx).' },
          { label: 'Enter', text: 'Enter sin(x) for f(x), then enter pi/3 at x = a.' },
          { label: 'Check', text: 'Press EXE. The numerical result should be about 0.5.' }
        ]),
        ex: freezeSteps([
          { label: 'Open', text: 'Open the Calculate/COMP screen.' },
          { label: 'Insert d/dx', text: 'Press SHIFT, then the integral key labelled d/dx above it.' },
          { label: 'Enter', text: 'Enter sin(x) in the function field and pi/3 in the x = field.' },
          { label: 'Check', text: 'Press =. The numerical result should be about 0.5.' }
        ])
      })
    }),
    Object.freeze({
      id: 'integral-check',
      label: 'Numerical integral',
      helpsWith: 'Checking the numerical value of a definite integral after the exact method has been set up.',
      exampleLabel: 'Sample check',
      example: 'For integral from 0 to 2 of (3x^2 + 1) dx, the calculator should give 10.',
      radiansRequired: false,
      radiansReminder: '',
      doesNotReplace: 'This checks a definite numerical value. It does not replace exact integration, the constant of integration for indefinite work, or any integration method the question expects you to show.',
      models: Object.freeze({
        cw: freezeSteps([
          { label: 'Open', text: 'HOME -> Calculate.' },
          { label: 'Insert integral', text: 'CATALOG -> Func Analysis -> Integration(integral).' },
          { label: 'Enter', text: 'Enter lower limit 0, upper limit 2 and integrand 3x^2 + 1.' },
          { label: 'Check', text: 'Press EXE. The numerical result should be 10.' }
        ]),
        ex: freezeSteps([
          { label: 'Open', text: 'Open the Calculate/COMP screen.' },
          { label: 'Insert integral', text: 'Press the integral key to insert the definite-integral template.' },
          { label: 'Enter', text: 'Enter lower limit 0, upper limit 2 and integrand 3x^2 + 1.' },
          { label: 'Check', text: 'Press =. The numerical result should be 10.' }
        ])
      })
    })
  ])
});

const trigFirstPrinciplesSupportPack = Object.freeze({
  topicId: 'topic:y13:differentiation:trig-first-principles',
  title: 'ClassWiz small-angle evidence',
  introduction: 'Use TABLE only to gather numerical evidence for the limiting behaviour. The table does not replace the first-principles proof.',
  defaultUseCaseId: 'small-angle-table',
  defaultModelId: 'cw',
  useCases: Object.freeze([Object.freeze({
    id: 'small-angle-table',
    label: 'TABLE: sin h / h',
    helpsWith: 'Seeing sin h / h approach 1 as h becomes small.',
    exampleLabel: 'Sample check',
    example: 'In RADIAN mode, compare sin(x)/x at x = 0.1, 0.01 and 0.001. The outputs should approach 1.',
    radiansRequired: true,
    radiansReminder: 'RADIAN mode is essential. Degree mode changes the limiting scale.',
    doesNotReplace: 'Numerical values support the claim that the limit is 1. They do not establish the limit or replace the first-principles derivation.',
    models: Object.freeze({
      cw: freezeSteps([{label:'Mode',text:'Set Angle Unit to Radian.'},{label:'Open TABLE',text:'HOME -> Table.'},{label:'Enter function',text:'Enter sin(x)/x.'},{label:'Check small x',text:'Evaluate values such as 0.1, 0.01 and 0.001 and watch the outputs approach 1.'}]),
      ex: freezeSteps([{label:'Mode',text:'Set Angle Unit to Radian.'},{label:'Open TABLE',text:'MENU -> Table.'},{label:'Enter function',text:'Enter sin(X)/X.'},{label:'Check small x',text:'Use small positive x-values and observe the outputs approaching 1.'}])
    })
  })])
});


const parametricDifferentiationSupportPack = Object.freeze({
  topicId: 'topic:y13:differentiation:parametric-differentiation',
  title: 'ClassWiz parametric checks',
  introduction: 'Use TABLE to generate paired coordinates and numerical d/dx only as a check. These tools do not replace parametric algebra or the chain-rule derivation.',
  defaultUseCaseId: 'paired-table',
  defaultModelId: 'cw',
  useCases: Object.freeze([
    Object.freeze({id:'paired-table',label:'TABLE: paired coordinates',helpsWith:'Generating x(t), y(t) values to inspect the trace or check a point.',exampleLabel:'Sample check',example:'For x=t^2−1 and y=t^3−3t, generate values around t=0 to see the direction of travel.',radiansRequired:false,radiansReminder:'',doesNotReplace:'A coordinate table supports exploration. It does not replace eliminating t, finding exact ranges or showing differentiation.',models:Object.freeze({cw:freezeSteps([{label:'Open TABLE',text:'HOME -> Table.'},{label:'Enter x(t)',text:'Enter t^2−1 as the first function.'},{label:'Enter y(t)',text:'Enter t^3−3t as the second function.'},{label:'Inspect',text:'Use a suitable t range and compare paired outputs.'}]),ex:freezeSteps([{label:'Open TABLE',text:'MENU -> Table.'},{label:'Enter x(t)',text:'Enter X^2−1 as f(X).'},{label:'Enter y(t)',text:'Enter X^3−3X as g(X).'},{label:'Inspect',text:'Choose a suitable start/end/step and compare paired outputs.'}])})}),
    Object.freeze({id:'gradient-check',label:'Numerical gradient check',helpsWith:'Checking a tangent gradient after the symbolic parametric derivative has been found.',exampleLabel:'Sample check',example:'After finding dy/dx as a function of t, evaluate it at the required t-value.',radiansRequired:false,radiansReminder:'',doesNotReplace:'This checks a number. It does not replace deriving dx/dt, dy/dt and dy/dx or showing the tangent method.',models:Object.freeze({cw:freezeSteps([{label:'Calculate',text:'HOME -> Calculate.'},{label:'Evaluate',text:'Substitute the chosen t-value into your derived dy/dx expression.'},{label:'Check',text:'Compare with your exact symbolic result.'}]),ex:freezeSteps([{label:'Calculate',text:'Open COMP/Calculate.'},{label:'Evaluate',text:'Substitute the chosen t-value into your derived dy/dx expression.'},{label:'Check',text:'Compare with your exact symbolic result.'}])})})
  ])
});


const numericalIntegrationSupportPack=Object.freeze({
 topicId:'topic:y13:integration:numerical-integration',title:'ClassWiz ordinate-table checks',introduction:'Use TABLE to generate/check the same equally spaced ordinates used in the written trapezium-rule setup. The calculator does not replace the coefficient working.',defaultUseCaseId:'ordinate-table',defaultModelId:'cw',useCases:Object.freeze([Object.freeze({id:'ordinate-table',label:'TABLE: ordinates',helpsWith:'Generating or checking f(x) values at the equally spaced x-values required by the trapezium rule.',exampleLabel:'Sample check',example:'For f(x)=x^2+1 on 0≤x≤4 with four trapezia, use x=0,1,2,3,4 and read the corresponding y-values.',radiansRequired:false,radiansReminder:'',doesNotReplace:'TABLE checks the ordinate data. It does not replace finding h, showing the 1,2,…,2,1 coefficients or writing the trapezium-rule calculation.',models:Object.freeze({cw:freezeSteps([{label:'Open TABLE',text:'HOME -> Table.'},{label:'Enter function',text:'Enter the given f(x).'},{label:'Set range',text:'Choose Start, End and Step so the x-values match the required equal spacing h.'},{label:'Copy/check',text:'Read the y-values and compare them with the written ordinate table.'}]),ex:freezeSteps([{label:'Open TABLE',text:'MENU -> Table.'},{label:'Enter function',text:'Enter the given f(X).'},{label:'Set range',text:'Use Start, End and Step matching the required h.'},{label:'Copy/check',text:'Read the y-values and compare them with the written ordinate table.'}])})})])
});

const supportPacks = new Map([[basicsSupportPack.topicId, basicsSupportPack],[trigFirstPrinciplesSupportPack.topicId,trigFirstPrinciplesSupportPack],[parametricDifferentiationSupportPack.topicId,parametricDifferentiationSupportPack],[numericalIntegrationSupportPack.topicId,numericalIntegrationSupportPack]]);

export function getClassWizModels() {
  return models;
}

export function getClassWizSupportPack(topicId) {
  return supportPacks.get(topicId) ?? null;
}

export function getClassWizUseCase(topicId, useCaseId) {
  return getClassWizSupportPack(topicId)?.useCases.find((entry) => entry.id === useCaseId) ?? null;
}
