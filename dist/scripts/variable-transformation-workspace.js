import { SUBSTITUTION_CHECKLIST, getSubstitutionExample } from './substitution-data.js';

const freeze=Object.freeze;
const X_TOKEN=/(^|[^a-z])x([^a-z]|$)|x²|x\^/i;
const U_TOKEN=/(^|[^a-z])u([^a-z]|$)|u\^/i;

function variableFlags(text){
  const value=String(text??'');
  return freeze({hasX:X_TOKEN.test(value),hasU:U_TOKEN.test(value),hasDx:/\bdx\b/.test(value),hasDu:/\bdu\b/.test(value)});
}

export function inspectVariableState({integrand='',differential='',limits=null}={}){
  const combined=`${integrand} ${differential} ${limits?.lower??''} ${limits?.upper??''}`;
  const flags=variableFlags(combined);
  const mixed=flags.hasX&&flags.hasU;
  const wrongDifferential=(flags.hasU&&flags.hasDx)||(flags.hasX&&flags.hasDu);
  return freeze({...flags,mixed,wrongDifferential,valid:!mixed&&!wrongDifferential});
}

export function createVariableTransformationWorkspace(exampleOrId){
  const example=typeof exampleOrId==='string'?getSubstitutionExample(exampleOrId):exampleOrId;
  if(!example) throw new Error('VariableTransformationWorkspace requires a substitution example.');
  const definite=example.kind==='definite';
  const stages=[
    freeze({id:'original',label:'Original integral',integrand:example.expression,differential:'dx',limits:definite?example.xLimits:null,variable:'x'}),
    freeze({id:'substitution',label:'Choose substitution',integrand:`u = ${example.suggestedU}`,differential:example.differential,limits:definite?example.xLimits:null,variable:'bridge'}),
    freeze({id:'transformed',label:'Change everything',integrand:example.transformedIntegrand,differential:'du',limits:definite?example.uLimits:null,variable:'u'}),
    freeze({id:'integrated',label:'Integrate in u',integrand:example.resultU??'Transformation does not simplify the integral.',differential:'',limits:definite?example.uLimits:null,variable:'u'}),
    freeze({id:'finished',label:definite?'Evaluate in u':'Substitute back to x',integrand:definite?(example.resultU??'No valid transformed result.'):(example.resultX??'Reject this substitution and choose again.'),differential:'',limits:null,variable:definite?'u':'x'})
  ];
  return freeze({
    example,
    checklist:SUBSTITUTION_CHECKLIST,
    stages:freeze(stages),
    inspectStage(index){
      const stage=stages[Math.max(0,Math.min(stages.length-1,index))];
      if(stage.variable==='bridge') return freeze({valid:true,mixed:false,wrongDifferential:false,bridge:true});
      const state=inspectVariableState({integrand:stage.integrand,differential:stage.differential,limits:stage.limits});
      return freeze({...state,bridge:false});
    },
    validateProposal({integrand,differential,limits}){return inspectVariableState({integrand,differential,limits});}
  });
}

export function validateTransformedIntegral(config){return inspectVariableState(config);}
