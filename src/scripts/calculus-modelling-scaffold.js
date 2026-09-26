export const MODELLING_STAGE_IDS = Object.freeze(['variables','relationship','target','method','solve','interpret','limitations']);

export const MODELLING_STAGE_LABELS = Object.freeze({
  variables:'Variables, units & restrictions',
  relationship:'Relationship / model',
  target:'What is being asked?',
  method:'Choose calculus',
  solve:'Solve',
  interpret:'Interpret sign, size, units & domain',
  limitations:'Reasonableness, assumptions & limitations'
});

function freezeContext(context){
  const stages={};
  for(const id of MODELLING_STAGE_IDS){
    if(!context.stages?.[id]) throw new Error(`Modelling context ${context.id} is missing stage ${id}.`);
    stages[id]=Object.freeze({...context.stages[id]});
  }
  return Object.freeze({...context,stages:Object.freeze(stages),techniqueTags:Object.freeze([...(context.techniqueTags??[])]),support:Object.freeze({...context.support})});
}

export const CALCULUS_MODELLING_CONTEXTS = Object.freeze([
  freezeContext({
    id:'optimisation-box',label:'Optimisation · packaging',family:'optimisation',techniqueTags:['stationary-points'],
    prompt:'A square sheet of side 24 cm has equal squares of side x removed from each corner and is folded into an open box. Find the value of x that maximises volume.',
    stages:{
      variables:{summary:'x cm is the cut size; 0 < x < 12. Volume is measured in cm³.'},
      relationship:{summary:'V=x(24−2x)².'},target:{summary:'Maximise V over the physical domain.'},
      method:{summary:'Differentiate V, solve dV/dx=0, then classify/check endpoints.'},solve:{summary:'Use stationary-point methods after the model is built.'},
      interpret:{summary:'Report a positive length x in cm and the corresponding maximum volume.'},limitations:{summary:'The model assumes negligible material thickness and exact folds.'}
    },support:{topicId:'topic:y12:differentiation:stationary-points',activityId:'activity:y12:differentiation:stationary-points:ao3:applications-parameters'}
  }),
  freezeContext({
    id:'connected-rates-tank',label:'Connected rates · tank',family:'connected-rates',techniqueTags:['connected-rates'],
    prompt:'Water fills a conical tank. The geometry links volume V and depth h, while dh/dt is known at one instant. Find dV/dt.',
    stages:{variables:{summary:'t in s, h in cm, V in cm³; identify the instant before substituting.'},relationship:{summary:'Use the geometric relation V=V(h) implied by similar shapes.'},target:{summary:'Find dV/dt at the stated instant.'},method:{summary:'Build the dependency chain t → h → V and use the chain rule.'},solve:{summary:'Differentiate the relationship before substituting instantaneous values.'},interpret:{summary:'State the sign and units cm³ s⁻¹ in context.'},limitations:{summary:'Assume the tank geometry is exact and water depth is represented by the stated model.'}},
    support:{topicId:'topic:y13:differentiation:connected-rates',activityId:'activity:y13:differentiation:connected-rates:understand:consistent-method'}
  }),
  freezeContext({
    id:'parametric-motion',label:'Parametric motion',family:'parametric',techniqueTags:['parametric'],
    prompt:'A particle moves with x=x(t), y=y(t). At a specified parameter value, determine the gradient of its path and interpret the direction of motion.',
    stages:{variables:{summary:'t is the parameter/time; x and y are position coordinates with stated units.'},relationship:{summary:'The path is represented parametrically by x(t), y(t).'},target:{summary:'Find dy/dx and interpret the local motion/gradient at the stated t.'},method:{summary:'Use dy/dx=(dy/dt)/(dx/dt); retain parameter restrictions.'},solve:{summary:'Differentiate both parametric equations and substitute the specified parameter value.'},interpret:{summary:'Interpret gradient/sign and check whether dx/dt=0 creates a vertical tangent.'},limitations:{summary:'Conclusions apply only on the stated parameter interval and modelled motion.'}},
    support:{topicId:'topic:y13:differentiation:parametric-differentiation',activityId:'activity:y13:differentiation:parametric-differentiation:ao3:applications'}
  }),
  freezeContext({
    id:'implicit-constraint',label:'Implicit relationship',family:'implicit',techniqueTags:['implicit'],
    prompt:'Two quantities x and y satisfy an implicit constraint. Find a required local rate/gradient without first solving explicitly for y.',
    stages:{variables:{summary:'Define x and y with units/restrictions before differentiating.'},relationship:{summary:'Use the stated implicit relation F(x,y)=0.'},target:{summary:'Identify the required dy/dx or connected local rate.'},method:{summary:'Differentiate both sides with respect to x and include dy/dx on y-terms.'},solve:{summary:'Collect dy/dx terms and rearrange only after differentiation.'},interpret:{summary:'Interpret the sign and units/geometry of the resulting local gradient.'},limitations:{summary:'Check domain restrictions and points where the rearranged denominator is zero.'}},
    support:{topicId:'topic:y13:differentiation:implicit-differentiation',activityId:'activity:y13:differentiation:implicit-differentiation:ao3:applications'}
  }),
  freezeContext({
    id:'accumulation-flow',label:'Accumulation / area',family:'accumulation',techniqueTags:['standard-integral'],
    prompt:'A flow rate q(t) litres per minute varies with time. Determine the total amount accumulated over a stated interval.',
    stages:{variables:{summary:'t in minutes; q(t) in L min⁻¹; accumulated amount is in litres.'},relationship:{summary:'Total change is the definite integral of the rate.'},target:{summary:'Find the accumulated quantity over the given time interval.'},method:{summary:'Construct ∫ q(t)dt with correct limits, then choose the integration method.'},solve:{summary:'Evaluate exactly when practical; split if the context requires signed versus total accumulation.'},interpret:{summary:'State litres accumulated and explain any negative contribution if q changes sign.'},limitations:{summary:'Assume the rate model is valid throughout the stated interval.'}},
    support:{topicId:'topic:y13:integration:areas',activityId:'activity:y13:integration:areas:ao3:unfamiliar-diagrams'}
  }),
  freezeContext({
    id:'sampled-distance',label:'Numerical integration · sampled data',family:'numerical',techniqueTags:['trapezium-rule'],
    prompt:'Speed is known only at equally spaced times from a sensor table. Estimate the distance travelled and comment on the approximation.',
    stages:{variables:{summary:'t in s; v in m s⁻¹; distance is measured in m.'},relationship:{summary:'Distance is the area under the speed-time graph.'},target:{summary:'Estimate the definite integral from tabulated data.'},method:{summary:'Use the trapezium rule because only discrete ordinates are available.'},solve:{summary:'Build the 1,2,…,2,1 coefficient sum with h equal to the sampling interval.'},interpret:{summary:'Report an estimated distance in metres and distinguish estimate from exact value.'},limitations:{summary:'Accuracy depends on sampling spacing and curve shape between measurements.'}},
    support:{topicId:'topic:y13:integration:numerical-integration',activityId:'activity:y13:integration:numerical-integration:ao1:estimate'}
  }),
  freezeContext({
    id:'growth-model',label:'Differential equation · growth/decay',family:'differential-equations',techniqueTags:['standard-integral'],
    prompt:'A quantity changes at a rate proportional to its current value. Construct, solve and interpret the model from contextual information.',
    stages:{variables:{summary:'Define the dependent quantity, time variable, units and realistic domain.'},relationship:{summary:'Translate the rate law into dP/dt=kP or dP/dt=−kP.'},target:{summary:'Determine the required quantity/constant and interpret the prediction.'},method:{summary:'Separate variables, then use the existing integration toolkit.'},solve:{summary:'Find the general solution and apply the condition to obtain the particular model.'},interpret:{summary:'Interpret k, sign, units and long-term behaviour.'},limitations:{summary:'Constant proportional rate is an assumption; do not extrapolate beyond a realistic domain.'}},
    support:{topicId:'topic:y13:differential-equations:first-order',activityId:'activity:y13:differential-equations:first-order:ao3:unfamiliar-modelling'}
  })
]);

export function getCalculusModellingContext(id){return CALCULUS_MODELLING_CONTEXTS.find(c=>c.id===id)??null;}

export function buildModellingScaffold(contextOrId,{revealMethod=true}={}){
  const context=typeof contextOrId==='string'?getCalculusModellingContext(contextOrId):contextOrId;
  if(!context) throw new Error('Unknown calculus modelling context.');
  return Object.freeze(MODELLING_STAGE_IDS.map((id,index)=>Object.freeze({
    id,label:MODELLING_STAGE_LABELS[id],index:index+1,
    summary:id==='method'&&!revealMethod?'Choose a calculus route from the structure; technique intentionally hidden until you commit.':context.stages[id].summary,
    hidden:id==='method'&&!revealMethod
  })));
}

export function compareExactAndNumerical({hasFormula,hasOnlyTable,exactAntiderivativePractical=true}={}){
  if(hasOnlyTable) return Object.freeze({choice:'trapezium-rule',reason:'Only sampled ordinates are available, so numerical integration is appropriate.'});
  if(hasFormula&&exactAntiderivativePractical) return Object.freeze({choice:'exact',reason:'An exact model and practical antiderivative are available, so exact integration preserves more information.'});
  return Object.freeze({choice:'numerical-check',reason:'Use numerical evaluation/checking after the mathematical model and integral have been set up.'});
}
