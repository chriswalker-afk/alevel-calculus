import { REVERSE_CHAIN_RECOGNITION_EXAMPLES, INTEGRATION_RECOGNITION_TAGS } from './reverse-chain-recognition-data.js';
import { INTEGRATION_METHOD_TAGS } from './trig-integration-data.js';

const freeze=Object.freeze;
const freezeArray=(items)=>freeze([...(items??[])]);
const example=(config)=>freeze({...config,helpfulCues:freezeArray(config.helpfulCues),steps:freezeArray(config.steps)});

export const SUBSTITUTION_METHOD_TAG=INTEGRATION_METHOD_TAGS.substitution;
export const REVERSE_CHAIN_SUBSTITUTION_SOURCE=REVERSE_CHAIN_RECOGNITION_EXAMPLES;
export const REVERSE_CHAIN_TAG_SOURCE=INTEGRATION_RECOGNITION_TAGS.reverseChain;

export const SUBSTITUTION_CHECKLIST=freeze([
  freeze({id:'substitution',label:'Choose u',question:'Have you stated u = g(x)?'}),
  freeze({id:'differential',label:'Change dx',question:'Have you converted the differential so the integrand is entirely in u?'}),
  freeze({id:'integrand',label:'Change the integrand',question:'Has every remaining x-expression been rewritten in u or absorbed into du?'}),
  freeze({id:'limits',label:'Change limits when definite',question:'For a definite integral, did you write x = a and x = b before converting to u-limits?'}),
  freeze({id:'finish',label:'Finish in the correct variable',question:'Indefinite: substitute back to x and add C. Definite: stay in u once limits are changed.'})
]);

export const SUBSTITUTION_EXAMPLES=freeze([
  example({
    id:'recognition-comparison',kind:'indefinite',expression:'∫ 6x(3x²+4)^5 dx',suggestedU:'3x²+4',duDx:'6x',differential:'du = 6x dx',transformedIntegrand:'∫ u^5 du',resultU:'u^6/6 + C',resultX:'(3x²+4)^6/6 + C',
    recognitionSourceId:'power-exact',helpful:true,helpfulCues:['inner expression repeats','its derivative 6x is present'],
    steps:[
      'Recognition route: see reverse-chain structure and integrate immediately.',
      'Substitution route: set u=3x²+4, so du=6x dx.',
      'Change everything: ∫6x(3x²+4)^5 dx becomes ∫u^5 du.',
      'Integrate in u, then substitute back because the original integral is indefinite.'
    ]
  }),
  example({
    id:'indefinite-cos',kind:'indefinite',expression:'∫ x cos(x²+1) dx',suggestedU:'x²+1',duDx:'2x',differential:'du = 2x dx, so x dx = du/2',transformedIntegrand:'(1/2)∫ cos u du',resultU:'(1/2)sin u + C',resultX:'(1/2)sin(x²+1) + C',helpful:true,
    helpfulCues:['x²+1 is inside cos','its derivative 2x matches the remaining x factor up to a constant'],
    steps:['Choose u=x²+1.','Convert x dx to du/2.','Rewrite the whole integral as (1/2)∫cos u du.','Integrate in u, substitute back to x, then write +C.']
  }),
  example({
    id:'definite-power',kind:'definite',expression:'∫₀¹ 2x(x²+1)^3 dx',suggestedU:'x²+1',duDx:'2x',differential:'du = 2x dx',xLimits:freeze({lower:'0',upper:'1'}),uLimits:freeze({lower:'1',upper:'2'}),transformedIntegrand:'∫₁² u^3 du',resultU:'[u^4/4]₁² = 15/4',resultX:null,helpful:true,
    helpfulCues:['x²+1 is repeated inside a power','2x is exactly its derivative'],
    steps:['Write the original limits explicitly as x=0 and x=1.','Choose u=x²+1 and calculate du=2x dx.','Convert limits: x=0 → u=1; x=1 → u=2.','Rewrite as ∫₁²u³du.','Evaluate in u. Do not substitute x back after changing to u-limits.']
  }),
  example({
    id:'linear-power',kind:'indefinite',expression:'∫ (3x+1)^4 dx',suggestedU:'3x+1',duDx:'3',differential:'du = 3 dx, so dx = du/3',transformedIntegrand:'(1/3)∫ u^4 du',resultU:'u^5/15 + C',resultX:'(3x+1)^5/15 + C',helpful:true,
    helpfulCues:['linear expression sits inside a power','its derivative is the constant 3'],steps:['Choose u=3x+1.','Convert dx=du/3.','Integrate (1/3)∫u⁴du.','Substitute back to x and add C.']
  }),
  example({
    id:'root-quadratic',kind:'indefinite',expression:'∫ x√(x²+3) dx',suggestedU:'x²+3',duDx:'2x',differential:'du = 2x dx, so x dx = du/2',transformedIntegrand:'(1/2)∫ u^(1/2) du',resultU:'u^(3/2)/3 + C',resultX:'(x²+3)^(3/2)/3 + C',helpful:true,
    helpfulCues:['x²+3 is inside a root','its derivative 2x is present up to a constant'],steps:['Choose u=x²+3.','Use x dx=du/2.','Rewrite the root as u^(1/2).','Integrate and substitute back.']
  }),
  example({
    id:'quadratic-denominator',kind:'indefinite',expression:'∫ (4x+3)/(2x²+3x+7) dx',suggestedU:'2x²+3x+7',duDx:'4x+3',differential:'du = (4x+3) dx',transformedIntegrand:'∫ 1/u du',resultU:'ln|u| + C',resultX:'ln|2x²+3x+7| + C',helpful:true,
    helpfulCues:['quadratic is in the denominator','its derivative appears exactly in the numerator'],steps:['Choose the denominator as u.','Notice du=(4x+3)dx.','Rewrite as ∫1/u du.','Integrate to ln|u|+C and substitute back.']
  }),
  example({
    id:'unhelpful-u-x',kind:'indefinite',expression:'∫ x cos(x²+1) dx',suggestedU:'x',duDx:'1',differential:'du = dx',transformedIntegrand:'∫ u cos(x²+1) du',resultU:null,resultX:null,helpful:false,
    helpfulCues:['choosing u=x does not remove x from the cosine','the transformed integral mixes u and x'],steps:['Proposed u=x gives du=dx.','The cosine still contains x²+1.','The state ∫u cos(x²+1) du mixes variables, so reject this substitution.','Choose u=x²+1 instead.']
  }),
  example({
    id:'unhelpful-inner',kind:'indefinite',expression:'∫ x² cos(x²+1) dx',suggestedU:'x²+1',duDx:'2x',differential:'du = 2x dx',transformedIntegrand:'(1/2)∫ x cos u du',resultU:null,resultX:null,helpful:false,
    helpfulCues:['the derivative supplies only one factor of x','one x remains after converting dx'],steps:['u=x²+1 is a plausible inner expression.','du=2x dx absorbs only one factor x.','One x remains, producing a mixed-variable state unless it can be rewritten in u.','At this stage this substitution has not simplified the integral.']
  })
]);

export const SUBSTITUTION_CHOICE_GUIDANCE=freeze([
  freeze({cue:'inside',label:'Inside another function',examples:'power, root, exponential, trig or logarithm',question:'What expression is sitting inside the outer function?'}),
  freeze({cue:'denominator',label:'Denominator',examples:'u = x²+a or u = ax²+bx+c',question:'Does the numerator resemble the denominator derivative?'}),
  freeze({cue:'repeated',label:'Repeated expression',examples:'the same bracket appears several times',question:'Would naming the repeated expression make the integral simpler?'}),
  freeze({cue:'derivative',label:'Derivative check',examples:'g′(x) is present elsewhere',question:'If this is u, is du available up to a constant multiple?'})
]);

export function getSubstitutionExample(id){return SUBSTITUTION_EXAMPLES.find((item)=>item.id===id)??null;}
export function isHelpfulSubstitution(id){return Boolean(getSubstitutionExample(id)?.helpful);}
