function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

export const basicsDifferentiationReviewPack = deepFreeze({
  rapid: {
    id: "memory-review:y12:differentiation:basics:rapid-recall",
    label: "Rapid recall",
    limit: 5,
    optionCount: 4,
    secondsPerItem: 12
  },
  diagram: {
    id: "memory-review:y12:differentiation:basics:diagram-recall",
    label: "Diagram recall",
    ariaLabel: "A curve, a tangent line and the point where the tangent touches the curve, marked with labels A, B and C.",
    viewBox: "0 0 420 240",
    elements: [
      { type: "line", variant: "axis", x1: 38, y1: 205, x2: 392, y2: 205 },
      { type: "line", variant: "axis", x1: 48, y1: 218, x2: 48, y2: 28 },
      { type: "path", variant: "curve", d: "M 55 176 C 104 171 143 93 210 115 C 279 138 321 158 382 126", fill: "none" },
      { type: "line", variant: "tangent", x1: 118, y1: 146, x2: 304, y2: 84 },
      { type: "circle", variant: "point", cx: 210, cy: 115, r: 5 }
    ],
    markers: [
      { id: "A", label: "A", optionLabel: "curve", x: 87, y: 118, targetX: 108, targetY: 151 },
      { id: "B", label: "B", optionLabel: "line", x: 336, y: 63, targetX: 286, targetY: 90 },
      { id: "C", label: "C", optionLabel: "point", x: 241, y: 158, targetX: 210, targetY: 115 }
    ],
    questions: [
      { id: "diagram-question:curve", prompt: "Which label points to the curve y = f(x)?", answerMarkerId: "A", successMessage: "Correct. A points to the curve itself." },
      { id: "diagram-question:tangent", prompt: "Which label points to the tangent line?", answerMarkerId: "B", successMessage: "Correct. B points to the tangent line." },
      { id: "diagram-question:contact", prompt: "Which label marks the point where the tangent touches the curve?", answerMarkerId: "C", successMessage: "Correct. C marks the point of contact." }
    ]
  },
  mix: {
    id: "memory-review:y12:differentiation:basics:memory-mix",
    label: "Mixed review",
    taskIds: ["rapid", "build", "diagram", "missing-piece", "impostor"]
  }
});



export const firstPrinciplesReviewPack = deepFreeze({
  rapid: {
    id: "memory-review:y12:differentiation:first-principles:rapid-recall",
    label: "Rapid recall", limit: 5, optionCount: 4, secondsPerItem: 14
  },
  diagram: {
    id: "memory-review:y12:differentiation:first-principles:diagram-recall",
    label: "Diagram recall",
    ariaLabel: "A curve with nearby points P and Q, their chord, and the tangent at P, marked with labels A, B, C and D.",
    viewBox: "0 0 420 240",
    elements: [
      { type: "line", variant: "axis", x1: 36, y1: 205, x2: 394, y2: 205 },
      { type: "line", variant: "axis", x1: 48, y1: 218, x2: 48, y2: 24 },
      { type: "path", variant: "curve", d: "M 52 182 C 118 176 161 126 211 103 C 267 77 326 86 386 137", fill: "none" },
      { type: "line", variant: "tangent", x1: 128, y1: 145, x2: 304, y2: 69 },
      { type: "line", variant: "guide", x1: 210, y1: 103, x2: 276, y2: 84 },
      { type: "circle", variant: "point", cx: 210, cy: 103, r: 5 },
      { type: "circle", variant: "point", cx: 276, cy: 84, r: 5 }
    ],
    markers: [
      { id: "A", label: "A", optionLabel: "point P", x: 187, y: 77, targetX: 210, targetY: 103 },
      { id: "B", label: "B", optionLabel: "point Q", x: 301, y: 61, targetX: 276, targetY: 84 },
      { id: "C", label: "C", optionLabel: "chord PQ", x: 252, y: 128, targetX: 246, targetY: 94 },
      { id: "D", label: "D", optionLabel: "tangent at P", x: 120, y: 107, targetX: 164, targetY: 129 }
    ],
    questions: [
      { id: "fp-diagram:p", prompt: "Which label marks the fixed point P?", answerMarkerId: "A", successMessage: "Correct. P is the fixed point where the tangent gradient is wanted." },
      { id: "fp-diagram:q", prompt: "Which label marks the nearby point Q?", answerMarkerId: "B", successMessage: "Correct. Q is the point that approaches P." },
      { id: "fp-diagram:chord", prompt: "Which label points to the chord through P and Q?", answerMarkerId: "C", successMessage: "Correct. The chord gradient is the difference quotient." },
      { id: "fp-diagram:tangent", prompt: "Which label points to the tangent at P?", answerMarkerId: "D", successMessage: "Correct. The chord approaches this tangent as Q approaches P." }
    ]
  },
  mix: {
    id: "memory-review:y12:differentiation:first-principles:memory-mix",
    label: "Mixed review", taskIds: ["rapid", "build", "diagram", "missing-piece", "impostor"]
  }
});

export const tangentsNormalsReviewPack = deepFreeze({
  rapid:{id:"memory-review:y12:differentiation:tangents-normals:rapid-recall",label:"Rapid recall",limit:5,optionCount:4,secondsPerItem:14},
  diagram:{id:"memory-review:y12:differentiation:tangents-normals:diagram-recall",label:"Diagram recall",ariaLabel:"A curve with a tangent and perpendicular normal at one point, marked A, B and C.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:38,y1:205,x2:392,y2:205},{type:"line",variant:"axis",x1:48,y1:218,x2:48,y2:28},{type:"path",variant:"curve",d:"M 55 180 C 120 175 165 118 215 102 C 275 84 330 112 385 160",fill:"none"},{type:"line",variant:"tangent",x1:120,y1:144,x2:310,y2:80},{type:"line",variant:"guide",x1:180,y1:42,x2:245,y2:190},{type:"circle",variant:"point",cx:215,cy:102,r:5}],markers:[{id:"A",label:"A",optionLabel:"tangent",x:315,y:72,targetX:282,targetY:89},{id:"B",label:"B",optionLabel:"normal",x:166,y:38,targetX:190,targetY:66},{id:"C",label:"C",optionLabel:"point of contact",x:239,y:128,targetX:215,targetY:102}],questions:[{id:"tn-diagram:tangent",prompt:"Which label points to the tangent?",answerMarkerId:"A",successMessage:"Correct. A points to the tangent."},{id:"tn-diagram:normal",prompt:"Which label points to the normal?",answerMarkerId:"B",successMessage:"Correct. B points to the perpendicular normal."},{id:"tn-diagram:point",prompt:"Which label marks the point of contact?",answerMarkerId:"C",successMessage:"Correct. Both lines pass through C."}]},
  mix:{id:"memory-review:y12:differentiation:tangents-normals:memory-mix",label:"Mixed review",taskIds:["rapid","build","diagram","missing-piece","impostor"]}
});


export const stationaryPointsReviewPack = deepFreeze({
  rapid:{id:"memory-review:y12:differentiation:stationary-points:rapid-recall",label:"Rapid recall",limit:5,optionCount:4,secondsPerItem:14},
  diagram:{id:"memory-review:y12:differentiation:stationary-points:diagram-recall",label:"Diagram recall",ariaLabel:"A curve with a local maximum, local minimum and stationary point of inflection marked A, B and C.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:38,y1:205,x2:392,y2:205},{type:"line",variant:"axis",x1:48,y1:218,x2:48,y2:28},{type:"path",variant:"curve",d:"M 55 175 C 95 120 120 75 160 90 C 205 106 210 175 250 166 C 292 157 290 92 330 98 C 350 101 365 120 385 145",fill:"none"}],markers:[{id:"A",label:"A",optionLabel:"local maximum",x:145,y:60,targetX:160,targetY:90},{id:"B",label:"B",optionLabel:"local minimum",x:235,y:195,targetX:250,targetY:166},{id:"C",label:"C",optionLabel:"stationary inflection",x:350,y:74,targetX:330,targetY:98}],questions:[{id:"sp-diagram:max",prompt:"Which label marks the local maximum?",answerMarkerId:"A",successMessage:"Correct. A is higher than nearby points."},{id:"sp-diagram:min",prompt:"Which label marks the local minimum?",answerMarkerId:"B",successMessage:"Correct. B is lower than nearby points."},{id:"sp-diagram:inf",prompt:"Which label marks the stationary point that does not turn?",answerMarkerId:"C",successMessage:"Correct. C has a horizontal tangent but no turn."}]},
  mix:{id:"memory-review:y12:differentiation:stationary-points:memory-mix",label:"Mixed review",taskIds:["rapid","build","diagram","missing-piece","impostor"]}
});


export const increasingDecreasingReviewPack = deepFreeze({
 rapid:{id:"memory-review:y12:differentiation:increasing-decreasing:rapid-recall",label:"Rapid recall",limit:5,optionCount:4,secondsPerItem:14},
 diagram:{id:"memory-review:y12:differentiation:increasing-decreasing:diagram-recall",label:"Diagram recall",ariaLabel:"A curve with one falling section and one rising section marked A and B.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:38,y1:205,x2:392,y2:205},{type:"line",variant:"axis",x1:48,y1:218,x2:48,y2:28},{type:"path",variant:"curve",d:"M 65 65 C 135 72 155 175 218 175 C 280 175 315 78 382 62",fill:"none"}],markers:[{id:"A",label:"A",optionLabel:"decreasing section",x:116,y:100,targetX:142,targetY:120},{id:"B",label:"B",optionLabel:"increasing section",x:318,y:112,targetX:294,targetY:128}],questions:[{id:"id-diagram:dec",prompt:"Which label marks a decreasing section?",answerMarkerId:"A",successMessage:"Correct. A falls left-to-right."},{id:"id-diagram:inc",prompt:"Which label marks an increasing section?",answerMarkerId:"B",successMessage:"Correct. B rises left-to-right."}]},
 mix:{id:"memory-review:y12:differentiation:increasing-decreasing:memory-mix",label:"Mixed review",taskIds:["rapid","build","diagram","missing-piece","impostor"]}
});


const integrationIntroReviewPack=Object.freeze({
 rapid:{id:"memory-review:y12:integration:introduction:rapid-recall",label:"Rapid recall",limit:6,optionCount:4,secondsPerItem:14},
 diagram:{id:"memory-review:y12:integration:introduction:diagram-recall",label:"Diagram recall",ariaLabel:"Three vertically translated curves from the same family.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:35,y1:195,x2:390,y2:195},{type:"line",variant:"axis",x1:55,y1:220,x2:55,y2:25},{type:"path",variant:"curve",d:"M 70 150 Q 205 25 370 145",fill:"none"},{type:"path",variant:"curve",d:"M 70 180 Q 205 55 370 175",fill:"none"},{type:"path",variant:"curve",d:"M 70 120 Q 205 -5 370 115",fill:"none"}],markers:[{id:"A",label:"A",optionLabel:"same derivative family",x:335,y:72,targetX:315,targetY:104}],questions:[{id:"int-diagram:family",prompt:"What do these vertical translations share?",answerMarkerId:"A",successMessage:"Correct. They have the same derivative and differ only by a constant."}]},
 mix:{id:"memory-review:y12:integration:introduction:memory-mix",label:"Mixed review",taskIds:["rapid","build","diagram","missing-piece","impostor"]}
});


const definiteIndefiniteReviewPack=Object.freeze({
 rapid:{id:"memory-review:y12:integration:definite-indefinite:rapid-recall",label:"Rapid recall",limit:6,optionCount:4,secondsPerItem:14},
 diagram:{id:"memory-review:y12:integration:definite-indefinite:diagram-recall",label:"Diagram recall",ariaLabel:"A two-stage definite-integration workflow with integrate and evaluate boxes.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:45,y1:120,x2:375,y2:120},{type:"circle",variant:"point",cx:115,cy:120,r:5},{type:"circle",variant:"point",cx:305,cy:120,r:5}],markers:[{id:"A",label:"A",optionLabel:"integrate",x:105,y:82,targetX:115,targetY:120},{id:"B",label:"B",optionLabel:"evaluate",x:295,y:82,targetX:305,targetY:120}],questions:[{id:"di-diagram:integrate",prompt:"Which label represents the first stage: find an antiderivative?",answerMarkerId:"A",successMessage:"Correct. Integrate first."},{id:"di-diagram:evaluate",prompt:"Which label represents applying the limits?",answerMarkerId:"B",successMessage:"Correct. Evaluate second."}]},
 mix:{id:"memory-review:y12:integration:definite-indefinite:memory-mix",label:"Mixed review",taskIds:["rapid","build","diagram","missing-piece","impostor"]}
});


const integrationAreaReviewPack=Object.freeze({
 rapid:{id:"memory-review:y12:integration:area:rapid-recall",label:"Rapid recall",limit:6,optionCount:4,secondsPerItem:14},
 diagram:{id:"memory-review:y12:integration:area:diagram-recall",label:"Diagram recall",ariaLabel:"A positive curve above the x-axis with lower boundary a, upper boundary b and a shaded region between them.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:40,y1:200,x2:390,y2:200},{type:"line",variant:"axis",x1:55,y1:218,x2:55,y2:25},{type:"path",variant:"curve",d:"M 55 172 C 140 150 225 105 380 62",fill:"none"},{type:"line",variant:"guide",x1:145,y1:200,x2:145,y2:145},{type:"line",variant:"guide",x1:315,y1:200,x2:315,y2:82}],markers:[{id:"A",label:"A",optionLabel:"lower boundary a",x:128,y:218,targetX:145,targetY:200},{id:"B",label:"B",optionLabel:"upper boundary b",x:302,y:218,targetX:315,targetY:200},{id:"C",label:"C",optionLabel:"wanted a-to-b region",x:232,y:132,targetX:232,targetY:160}],questions:[{id:"ia-diagram:lower",prompt:"Which label marks the lower boundary a?",answerMarkerId:"A",successMessage:"Correct. A marks where the wanted interval begins."},{id:"ia-diagram:upper",prompt:"Which label marks the upper boundary b?",answerMarkerId:"B",successMessage:"Correct. B marks where the wanted interval ends."},{id:"ia-diagram:region",prompt:"Which label points to the region represented by ∫ₐᵇf(x)dx for this positive curve?",answerMarkerId:"C",successMessage:"Correct. C is the wanted region after the initial accumulation has been removed."}]},
 mix:{id:"memory-review:y12:integration:area:memory-mix",label:"Mixed review",taskIds:["rapid","build","diagram","missing-piece","impostor"]}
});


const signedAreaReviewPack=Object.freeze({
 rapid:{id:"memory-review:y12:integration:signed-area:rapid-recall",label:"Rapid recall",limit:6,optionCount:4,secondsPerItem:14},
 diagram:{id:"memory-review:y12:integration:signed-area:diagram-recall",label:"Diagram recall",ariaLabel:"A curve crosses the x-axis with one positive region and one negative region marked A, B and root C.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:40,y1:130,x2:390,y2:130},{type:"line",variant:"axis",x1:55,y1:220,x2:55,y2:25},{type:"path",variant:"curve",d:"M 60 195 C 140 180 180 75 250 65 C 310 58 345 95 385 120",fill:"none"}],markers:[{id:"A",label:"A",optionLabel:"negative signed region",x:115,y:180,targetX:135,targetY:155},{id:"B",label:"B",optionLabel:"positive signed region",x:275,y:45,targetX:265,targetY:82},{id:"C",label:"C",optionLabel:"axis crossing / split point",x:185,y:150,targetX:195,targetY:130}],questions:[{id:"sa-diagram:neg",prompt:"Which label marks a below-axis negative contribution?",answerMarkerId:"A",successMessage:"Correct. A lies below the x-axis."},{id:"sa-diagram:pos",prompt:"Which label marks an above-axis positive contribution?",answerMarkerId:"B",successMessage:"Correct. B lies above the x-axis."},{id:"sa-diagram:root",prompt:"Which label marks the root where a total-area calculation should be split?",answerMarkerId:"C",successMessage:"Correct. C is the axis crossing."}]},
 mix:{id:"memory-review:y12:integration:signed-area:memory-mix",label:"Mixed review",taskIds:["rapid","build","diagram","missing-piece","impostor"]}
});


const year12ReviewReviewPack=deepFreeze({
 rapid:{id:"memory-review:y12:review:calculus-mastery:rapid-recall",label:"Rapid vocabulary",limit:8,optionCount:4,secondsPerItem:16},
 diagram:{id:"memory-review:y12:review:calculus-mastery:diagram-recall",label:"Term ↔ diagram",ariaLabel:"A Year 12 review diagram showing a curve, tangent, stationary point, x-axis crossing and a below-axis region.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:35,y1:145,x2:392,y2:145},{type:"line",variant:"axis",x1:55,y1:220,x2:55,y2:24},{type:"path",variant:"curve",d:"M 60 190 C 110 185 135 95 190 95 C 240 95 255 160 300 165 C 345 170 365 105 388 78",fill:"none"},{type:"line",variant:"tangent",x1:120,y1:75,x2:250,y2:116}],markers:[{id:"A",label:"A",optionLabel:"tangent",x:245,y:74,targetX:220,targetY:104},{id:"B",label:"B",optionLabel:"stationary point",x:186,y:68,targetX:190,targetY:95},{id:"C",label:"C",optionLabel:"axis crossing / root",x:275,y:126,targetX:282,targetY:145},{id:"D",label:"D",optionLabel:"below-axis signed region",x:326,y:194,targetX:320,targetY:164}],questions:[{id:"y12-review:tangent",prompt:"Which label points to the tangent?",answerMarkerId:"A",successMessage:"Correct. A points to the tangent line."},{id:"y12-review:stationary",prompt:"Which label marks a stationary point?",answerMarkerId:"B",successMessage:"Correct. B marks a horizontal-tangent point."},{id:"y12-review:root",prompt:"Which label marks an axis crossing used as a split point?",answerMarkerId:"C",successMessage:"Correct. C marks the root / axis crossing."},{id:"y12-review:negative",prompt:"Which label marks a below-axis negative signed contribution?",answerMarkerId:"D",successMessage:"Correct. D lies below the x-axis."}]},
 mix:{id:"memory-review:y12:review:calculus-mastery:memory-mix",label:"Mixed Year 12 vocabulary",taskIds:["rapid","diagram","build","missing-piece","impostor"]}
});

export const standardFunctionsReviewPack = deepFreeze({
  rapid:{id:"memory-review:y13:differentiation:standard-functions:rapid",label:"Rapid recall",limit:7,optionCount:4,secondsPerItem:14},
  diagram:{id:"memory-review:y13:differentiation:standard-functions:diagram",label:"Graph recall",ariaLabel:"A standard function curve and a tangent, with the tangent-gradient location marked.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:35,y1:120,x2:390,y2:120},{type:"line",variant:"axis",x1:210,y1:220,x2:210,y2:25},{type:"path",variant:"curve",d:"M 45 120 C 95 50 145 50 210 120 C 275 190 325 190 385 120",fill:"none"},{type:"line",variant:"tangent",x1:250,y1:150,x2:365,y2:205}],markers:[{id:"A",label:"A",optionLabel:"tangent gradient",x:320,y:135,targetX:300,targetY:174}],questions:[{id:"sf-diagram:tangent",prompt:"Which label points to the tangent whose gradient gives the derivative value?",answerMarkerId:"A",successMessage:"Correct. The derivative graph records this tangent gradient."}]},
  mix:{id:"memory-review:y13:differentiation:standard-functions:mix",label:"Mixed review",taskIds:["rapid","build","diagram","missing-piece","impostor"]}
});

export const trigFirstPrinciplesReviewPack = deepFreeze({
  rapid:{id:"memory-review:y13:differentiation:trig-first-principles:rapid",label:"Rapid recall",limit:8,optionCount:4,secondsPerItem:15},
  diagram:{id:"memory-review:y13:differentiation:trig-first-principles:diagram",label:"Small-angle recall",ariaLabel:"A near-zero trig diagram comparing sine with the line y equals h.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:35,y1:120,x2:390,y2:120},{type:"line",variant:"axis",x1:210,y1:220,x2:210,y2:25},{type:"path",variant:"curve",d:"M 65 175 C 130 150 160 132 210 120 C 260 108 290 90 355 65",fill:"none"},{type:"line",variant:"tangent",x1:70,y1:175,x2:355,y2:65}],markers:[{id:"A",label:"A",optionLabel:"small-angle agreement",x:300,y:75,targetX:285,targetY:92}],questions:[{id:"tfp-diagram:agreement",prompt:"Which label marks the region where sin h and h are nearly indistinguishable?",answerMarkerId:"A",successMessage:"Correct. Close to zero in radians, sin h is approximately h."}]},
  mix:{id:"memory-review:y13:differentiation:trig-first-principles:mix",label:"Mixed review",taskIds:["rapid","build","diagram","missing-piece","impostor"]}
});


export const productQuotientChainReviewPack = deepFreeze({
  rapid:{id:"memory-review:y13:differentiation:product-quotient-chain:rapid",label:"Rapid recall",limit:8,optionCount:4,secondsPerItem:15},
  diagram:{id:"memory-review:y13:differentiation:product-quotient-chain:diagram",label:"Structure recall",ariaLabel:"A composite function machine with an inside stage and an outside stage, labelled A and B.",viewBox:"0 0 420 240",elements:[{type:"rect",variant:"guide",x:70,y:80,width:110,height:70,rx:12},{type:"rect",variant:"guide",x:240,y:80,width:110,height:70,rx:12},{type:"line",variant:"axis",x1:35,y1:115,x2:70,y2:115},{type:"line",variant:"axis",x1:180,y1:115,x2:240,y2:115},{type:"line",variant:"axis",x1:350,y1:115,x2:390,y2:115}],markers:[{id:"A",label:"A",optionLabel:"inside function",x:125,y:55,targetX:125,targetY:82},{id:"B",label:"B",optionLabel:"outside function",x:295,y:55,targetX:295,targetY:82}],questions:[{id:"pqc-diagram:inside",prompt:"Which label marks the function applied first in f(g(x))?",answerMarkerId:"A",successMessage:"Correct. A is the inside function g."},{id:"pqc-diagram:outside",prompt:"Which label marks the function applied second in f(g(x))?",answerMarkerId:"B",successMessage:"Correct. B is the outside function f."}]},
  mix:{id:"memory-review:y13:differentiation:product-quotient-chain:mix",label:"Mixed review",taskIds:["rapid","build","diagram","missing-piece","impostor"]}
});


export const parametricDifferentiationReviewPack = deepFreeze({
  rapid:{id:"memory-review:y13:differentiation:parametric-differentiation:rapid",label:"Rapid recall",limit:8,optionCount:4,secondsPerItem:15},
  diagram:{id:"memory-review:y13:differentiation:parametric-differentiation:diagram",label:"Parametric recall",ariaLabel:"A simple parametric curve with direction of increasing t and one marked point.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:35,y1:190,x2:390,y2:190},{type:"line",variant:"axis",x1:80,y1:220,x2:80,y2:25},{type:"path",variant:"curve",d:"M 95 175 C 150 165 185 135 225 105 C 270 70 315 65 365 80",fill:"none"}],markers:[{id:"A",label:"A",optionLabel:"current parametric point",x:230,y:92,targetX:225,targetY:105}],questions:[{id:"pd-diagram:point",prompt:"Which label marks the point generated by the current t-value?",answerMarkerId:"A",successMessage:"Correct. One t-value generates one coordinate pair."}]},
  mix:{id:"memory-review:y13:differentiation:parametric-differentiation:mix",label:"Mixed review",taskIds:["rapid","build","diagram","missing-piece","impostor"]}
});

export const trigIdentitiesInverseReviewPack = deepFreeze({
  rapid:{id:"memory-review:y13:differentiation:trig-identities-inverse:rapid",label:"Rapid recall",limit:8,optionCount:4,secondsPerItem:15},
  diagram:{id:"memory-review:y13:differentiation:trig-identities-inverse:diagram",label:"Inverse graph recall",ariaLabel:"A function and its inverse reflected in the line y equals x.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:35,y1:195,x2:390,y2:195},{type:"line",variant:"axis",x1:70,y1:220,x2:70,y2:25},{type:"line",variant:"tangent",x1:70,y1:195,x2:350,y2:30},{type:"path",variant:"curve",d:"M 85 170 C 135 145 190 110 250 85 C 295 65 330 58 365 55",fill:"none"}],markers:[{id:"A",label:"A",optionLabel:"line y=x",x:310,y:75,targetX:285,targetY:68}],questions:[{id:"tii-diagram:reflect",prompt:"Which label marks the reflection line used to construct an inverse graph?",answerMarkerId:"A",successMessage:"Correct. A function and its inverse reflect in y=x."}]},
  mix:{id:"memory-review:y13:differentiation:trig-identities-inverse:mix",label:"Mixed review",taskIds:["rapid","build","diagram","missing-piece","impostor"]}
});

export const concavityInflectionReviewPack = deepFreeze({
  rapid:{id:"memory-review:y13:differentiation:concavity-inflection:rapid",label:"Rapid recall",limit:7,optionCount:4,secondsPerItem:14},
  diagram:{id:"memory-review:y13:differentiation:concavity-inflection:diagram",label:"Shape recall",ariaLabel:"A cubic curve changing concavity at the origin.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:35,y1:120,x2:390,y2:120},{type:"line",variant:"axis",x1:210,y1:220,x2:210,y2:25},{type:"path",variant:"curve",d:"M 60 190 C 130 190 165 150 210 120 C 255 90 290 50 360 50",fill:"none"}],markers:[{id:"A",label:"A",optionLabel:"inflection region",x:230,y:100,targetX:210,targetY:120}],questions:[{id:"ci-diagram:inflection",prompt:"Which label marks where the curve changes concavity?",answerMarkerId:"A",successMessage:"Correct. The concavity changes at the inflection."}]},
  mix:{id:"memory-review:y13:differentiation:concavity-inflection:mix",label:"Mixed review",taskIds:["rapid","build","diagram","missing-piece","impostor"]}
});

export const connectedRatesReviewPack = deepFreeze({
  rapid:{id:"memory-review:y13:differentiation:connected-rates:rapid",label:"Rapid recall",limit:8,optionCount:4,secondsPerItem:15},
  diagram:{id:"memory-review:y13:differentiation:connected-rates:diagram",label:"Rate-flow recall",ariaLabel:"A dependency chain from time to radius to area.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:65,y1:120,x2:355,y2:120}],markers:[{id:"A",label:"A",optionLabel:"middle variable radius",x:210,y:95,targetX:210,targetY:120}],questions:[{id:"cr-diagram:middle",prompt:"Which label marks the intermediate variable in t → r → A?",answerMarkerId:"A",successMessage:"Correct. Radius links time to area."}]},
  mix:{id:"memory-review:y13:differentiation:connected-rates:mix",label:"Mixed review",taskIds:["rapid","build","diagram","missing-piece","impostor"]}
});


export const fullDifferentiationReviewReviewPack = deepFreeze({
 rapid:{id:"memory-review:full:review:calculus-mastery:rapid",label:"Rapid differentiation recall",limit:8,optionCount:4,secondsPerItem:15},
 diagram:{id:"memory-review:full:review:calculus-mastery:diagram",label:"Method cue recall",ariaLabel:"A method map showing explicit structure, parameter, implicit relation, second derivative and rate-flow cues.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:45,y1:120,x2:375,y2:120}],markers:[{id:"A",label:"A",optionLabel:"method-selection checkpoint",x:210,y:90,targetX:210,targetY:120}],questions:[{id:"fdr-diagram:method",prompt:"Which label marks the checkpoint that should happen before execution?",answerMarkerId:"A",successMessage:"Correct. Select the method before carrying out algebra."}]},
 mix:{id:"memory-review:full:review:calculus-mastery:mix",label:"Mixed differentiation recall",taskIds:["rapid","build","diagram","missing-piece","impostor"]}
});


export const standardIntegralsReviewPack = deepFreeze({
  rapid:{id:"memory-review:y13:integration:standard-integrals:rapid",label:"Rapid integral recall",limit:9,optionCount:4,secondsPerItem:14},
  diagram:{id:"memory-review:y13:integration:standard-integrals:diagram",label:"Fundamental Theorem recall",ariaLabel:"An antiderivative F links a definite integral from a to b to the endpoint difference F(b)-F(a).",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:60,y1:120,x2:360,y2:120}],markers:[{id:"A",label:"A",optionLabel:"endpoint evaluation F(b)-F(a)",x:300,y:90,targetX:300,targetY:120}],questions:[{id:"si-diagram:ftc",prompt:"Which label marks the endpoint evaluation used by the Fundamental Theorem?",answerMarkerId:"A",successMessage:"Correct. If F'=f, the definite integral is F(b)-F(a)."}]},
  mix:{id:"memory-review:y13:integration:standard-integrals:mix",label:"Mixed standard-integral review",taskIds:["rapid","build","diagram","missing-piece","impostor"]}
});


export const reverseChainRuleReviewPack = deepFreeze({
  rapid:{id:"memory-review:y13:integration:reverse-chain-rule:rapid",label:"Rapid recognition recall",limit:9,optionCount:4,secondsPerItem:14},
  diagram:{id:"memory-review:y13:integration:reverse-chain-rule:diagram",label:"Structure recall",ariaLabel:"A structure map linking an inside function g(x), its derivative g prime x and the reverse-chain classification.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:70,y1:120,x2:350,y2:120}],markers:[{id:"A",label:"A",optionLabel:"inner derivative checkpoint",x:210,y:90,targetX:210,targetY:120}],questions:[{id:"rc-diagram:derivative",prompt:"Which label marks the check that must happen before classifying a reverse-chain integral?",answerMarkerId:"A",successMessage:"Correct. Differentiate the proposed inside before comparing factors."}]},
  mix:{id:"memory-review:y13:integration:reverse-chain-rule:mix",label:"Mixed recognition review",taskIds:["rapid","build","diagram","missing-piece","sort","impostor"]}
});

export const trigIdentityIntegrationReviewPack = deepFreeze({
  rapid:{id:"memory-review:y13:integration:trig-identities:rapid",label:"Rapid identity and method recall",limit:8,optionCount:4,secondsPerItem:14},
  diagram:{id:"memory-review:y13:integration:trig-identities:diagram",label:"Rewrite-first route recall",ariaLabel:"A five-stage route from recognition through exact rewrite to integration.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:45,y1:120,x2:375,y2:120}],markers:[{id:"A",label:"A",optionLabel:"exact rewrite before integration",x:210,y:90,targetX:210,targetY:120}],questions:[{id:"tii-diagram:rewrite",prompt:"Which label marks the step that must be exact before calculus continues?",answerMarkerId:"A",successMessage:"Correct. Rewrite the trig expression exactly before integrating."}]},
  mix:{id:"memory-review:y13:integration:trig-identities:mix",label:"Mixed trig-integration review",taskIds:["rapid","build","diagram","missing-piece","impostor"]}
});


export const substitutionReviewPack = deepFreeze({
  rapid:{id:"memory-review:y13:integration:substitution:rapid",label:"Rapid substitution recall",limit:8,optionCount:4,secondsPerItem:14},
  diagram:{id:"memory-review:y13:integration:substitution:diagram",label:"Transformation checkpoint",ariaLabel:"A five-stage substitution route from choosing u through transformation to finishing the integral.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:45,y1:120,x2:375,y2:120}],markers:[{id:"A",label:"A",optionLabel:"complete transformation checkpoint",x:210,y:90,targetX:210,targetY:120}],questions:[{id:"sub-diagram:transform",prompt:"Which label marks the checkpoint where no mixed x/u state may remain?",answerMarkerId:"A",successMessage:"Correct. Integrate only after the variable transformation is complete."}]},
  mix:{id:"memory-review:y13:integration:substitution:mix",label:"Mixed substitution review",taskIds:["rapid","build","diagram","missing-piece","sort","impostor"]}
});

export const integrationByPartsReviewPack = deepFreeze({
  rapid:{id:"memory-review:y13:integration:by-parts:rapid",label:"Rapid parts recall",limit:8,optionCount:4,secondsPerItem:14},
  diagram:{id:"memory-review:y13:integration:by-parts:diagram",label:"Parts choice recall",ariaLabel:"A method route showing the original integral leading to a simpler remaining integral.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:55,y1:120,x2:365,y2:120}],markers:[{id:"A",label:"A",optionLabel:"new integral must be easier",x:255,y:90,targetX:255,targetY:120}],questions:[{id:"ibp-diagram:easier",prompt:"Which label marks the key checkpoint after choosing u and dv?",answerMarkerId:"A",successMessage:"Correct. Continue only when the new integral is easier."}]},
  mix:{id:"memory-review:y13:integration:by-parts:mix",label:"Mixed parts review",taskIds:["rapid","build","diagram","missing-piece","sort","impostor"]}
});


export const partialFractionsReviewPack = deepFreeze({
  rapid:{id:"memory-review:y13:integration:partial-fractions:rapid",label:"Rapid partial-fractions recall",limit:8,optionCount:4,secondsPerItem:14},
  diagram:{id:"memory-review:y13:integration:partial-fractions:diagram",label:"Decomposition checkpoint",ariaLabel:"A six-stage route from recognising a rational function through making it proper and integrating its decomposition.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:45,y1:120,x2:375,y2:120}],markers:[{id:"A",label:"A",optionLabel:"proper before decomposition",x:160,y:90,targetX:160,targetY:120}],questions:[{id:"pf-diagram:proper",prompt:"Which label marks the checkpoint that must be passed before a partial-fraction decomposition is written?",answerMarkerId:"A",successMessage:"Correct. Make the rational function proper before decomposing."}]},
  mix:{id:"memory-review:y13:integration:partial-fractions:mix",label:"Mixed partial-fractions review",taskIds:["rapid","build","diagram","missing-piece","sort","impostor"]}
});

export const year13AreasReviewPack = deepFreeze({
  rapid:{id:"memory-review:y13:integration:areas:rapid",label:"Rapid area-construction recall",limit:6,optionCount:4,secondsPerItem:14},
  diagram:{id:"memory-review:y13:integration:areas:diagram",label:"Area construction checkpoint",ariaLabel:"A route from region identification through limits and top-bottom order to later integration method selection.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:45,y1:120,x2:375,y2:120}],markers:[{id:"A",label:"A",optionLabel:"construction before technique",x:230,y:90,targetX:230,targetY:120}],questions:[{id:"areas-diagram:construction",prompt:"Which label marks the checkpoint that must be complete before choosing substitution, parts or another integration method?",answerMarkerId:"A",successMessage:"Correct. Region construction comes first."}]},
  mix:{id:"memory-review:y13:integration:areas:mix",label:"Mixed Year 13 area review",taskIds:["rapid","build","diagram","missing-piece","sort","impostor"]}
});


export const parametricAreaReviewPack = deepFreeze({
  rapid:{id:"memory-review:y13:integration:parametric-area:rapid",label:"Rapid parametric-area recall",limit:6,optionCount:4,secondsPerItem:14},
  diagram:{id:"memory-review:y13:integration:parametric-area:diagram",label:"Parametric-area checkpoint",ariaLabel:"A setup route from x-boundaries to t-limits, transformed strip width, direction and later integration technique.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:45,y1:120,x2:375,y2:120}],markers:[{id:"A",label:"A",optionLabel:"direction checked before later technique",x:270,y:90,targetX:270,targetY:120}],questions:[{id:"param-area-diagram:direction",prompt:"Which checkpoint must be complete before choosing a later trig, substitution or parts method?",answerMarkerId:"A",successMessage:"Correct. Parametric limits and direction/sign come first."}]},
  mix:{id:"memory-review:y13:integration:parametric-area:mix",label:"Mixed parametric-area review",taskIds:["rapid","build","diagram","missing-piece","sort","impostor"]}
});


export const limitOfSumReviewPack = deepFreeze({
 rapid:{id:"memory-review:y13:integration:limit-of-sum:rapid",label:"Rapid limit-of-sum recall",limit:6,optionCount:4,secondsPerItem:14},
 diagram:{id:"memory-review:y13:integration:limit-of-sum:diagram",label:"Sum-to-integral checkpoint",ariaLabel:"A route from rectangle sum through integrand and limits to definite integral and later evaluation.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:45,y1:120,x2:375,y2:120}],markers:[{id:"A",label:"A",optionLabel:"integrand and limits recognised before evaluation",x:230,y:90,targetX:230,targetY:120}],questions:[{id:"los-diagram:recognition",prompt:"Which checkpoint must be complete before evaluating?",answerMarkerId:"A",successMessage:"Correct. Identify the integral first."}]},
 mix:{id:"memory-review:y13:integration:limit-of-sum:mix",label:"Mixed limit-of-sum review",taskIds:["rapid","build","diagram","missing-piece","sort","impostor"]}
});

const numericalIntegrationReviewPack=deepFreeze({
 rapid:{id:"memory-review:y13:integration:numerical:rapid",label:"Rapid trapezium recall",limit:6,optionCount:4,secondsPerItem:14},
 diagram:{id:"memory-review:y13:integration:numerical:diagram",label:"Coefficient checkpoint",ariaLabel:"A sequence of five ordinates with endpoints and interior points.",viewBox:"0 0 420 240",elements:[{type:"line",variant:"axis",x1:45,y1:180,x2:375,y2:180}],markers:[{id:"A",label:"A",optionLabel:"interior ordinate has coefficient 2",x:210,y:110,targetX:210,targetY:180}],questions:[{id:"trap-diagram:coefficient",prompt:"Which statement explains an interior ordinate in adjacent trapezia?",answerMarkerId:"A",successMessage:"Correct. It is used twice."}]},
 mix:{id:"memory-review:y13:integration:numerical:mix",label:"Mixed trapezium review",taskIds:["rapid","build","diagram","missing-piece","sort","impostor"]}
});


const differentialEquationsReviewPack=deepFreeze({
 rapid:{id:"memory-review:y13:differential-equations:first-order:rapid",label:"Rapid DE recall",limit:8,optionCount:4,secondsPerItem:15},
 mix:{id:"memory-review:y13:differential-equations:first-order:mix",label:"Mixed DE review",taskIds:["rapid","build","missing-piece","sort","impostor"]}
});

export const memoryReviewPacks = Object.freeze({
  "topic:y12:differentiation:basics": basicsDifferentiationReviewPack,
  "topic:y12:differentiation:first-principles": firstPrinciplesReviewPack,
  "topic:y12:differentiation:tangents-normals": tangentsNormalsReviewPack,
  "topic:y12:differentiation:stationary-points": stationaryPointsReviewPack,
  "topic:y12:differentiation:increasing-decreasing": increasingDecreasingReviewPack,
  "topic:y12:integration:introduction": integrationIntroReviewPack,
  "topic:y12:integration:definite-indefinite": definiteIndefiniteReviewPack,
  "topic:y12:integration:area": integrationAreaReviewPack,
  "topic:y12:integration:signed-area": signedAreaReviewPack,
  "topic:y12:review:calculus-mastery": year12ReviewReviewPack,
  "topic:y13:differentiation:standard-functions": standardFunctionsReviewPack,
  "topic:y13:differentiation:trig-first-principles": trigFirstPrinciplesReviewPack,
  "topic:y13:differentiation:product-quotient-chain": productQuotientChainReviewPack,
  "topic:y13:differentiation:parametric-differentiation": parametricDifferentiationReviewPack,
  "topic:y13:differentiation:trig-identities-inverse": trigIdentitiesInverseReviewPack,
  "topic:y13:differentiation:concavity-inflection": concavityInflectionReviewPack,
  "topic:y13:differentiation:connected-rates": connectedRatesReviewPack,
  "topic:full:review:calculus-mastery": fullDifferentiationReviewReviewPack,
  "topic:y13:integration:standard-integrals": standardIntegralsReviewPack,
  "topic:y13:integration:reverse-chain-rule": reverseChainRuleReviewPack,
  "topic:y13:integration:trig-identities": trigIdentityIntegrationReviewPack,
  "topic:y13:integration:substitution": substitutionReviewPack,
  "topic:y13:integration:by-parts": integrationByPartsReviewPack,
  "topic:y13:integration:partial-fractions": partialFractionsReviewPack,
  "topic:y13:integration:areas": year13AreasReviewPack,
  "topic:y13:integration:parametric-area": parametricAreaReviewPack,
  "topic:y13:integration:limit-of-sum": limitOfSumReviewPack,
  "topic:y13:integration:numerical-integration": numericalIntegrationReviewPack,
  "topic:y13:differential-equations:first-order": differentialEquationsReviewPack
});




export function getMemoryReviewPackForTopic(topicId) {
  return memoryReviewPacks[topicId] ?? null;
}
