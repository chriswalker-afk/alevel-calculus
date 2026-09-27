import { ParametricCurveTracer, PARAMETRIC_CURVES, calculateCoordinateRanges } from './parametric-curve-tracer.js?v=auditstep11';
import { renderEquationSteps } from './equation-step-renderer.js';
const IDS=new Set(['activity:y13:differentiation:parametric-differentiation:understand:trace-curve','activity:y13:differentiation:parametric-differentiation:understand:restrict-domain','activity:y13:differentiation:parametric-differentiation:understand:eliminate-parameter','activity:y13:differentiation:parametric-differentiation:understand:derive-gradient','activity:y13:differentiation:parametric-differentiation:understand:gradient-view']);
function el(d,t,c='',x=''){const n=d.createElement(t);if(c)n.className=c;if(x)n.textContent=x;return n;}
function fmt(v){if(!Number.isFinite(v))return v>0?'∞':v<0?'−∞':'undefined';return String(Number(v.toFixed(3))).replace('-','−');}
export class ParametricDifferentiationUnderstandExperience{
 constructor(host){if(!host)throw new Error('ParametricDifferentiationUnderstandExperience requires a host.');this.host=host;this.document=host.ownerDocument||document;this.tracer=null;}
 supports(id){return IDS.has(id);} destroy(){this.tracer?.destroy();this.tracer=null;this.host.replaceChildren();this.host.classList.remove('parametric-differentiation-understand');}
 render(id){if(!this.supports(id))return false;this.destroy();this.host.classList.add('parametric-differentiation-understand');const slug=id.split(':').at(-1);this[`render_${slug.replaceAll('-','_')}`]();return true;}
 panel(title,instruction){const p=el(this.document,'section','parametric-differentiation-understand__panel');const h=el(this.document,'div','parametric-differentiation-understand__header');h.append(el(this.document,'h3','',title),el(this.document,'p','',instruction));p.append(h);this.host.append(p);return p;}
 mountTracer(panel,opts={}){const g=el(this.document,'div','parametric-differentiation-understand__tracer');panel.append(g);this.tracer=new ParametricCurveTracer(g,opts);return this.tracer;}
 render_trace_curve(){const p=this.panel('One parameter, two coordinates','Compare y=f(x) with x=f(t), y=g(t). Move t: the same value is substituted into both equations, creating one point. Direction arrows show increasing t.');const call=el(this.document,'div','parametric-differentiation-understand__callout');call.innerHTML='<strong>Why parametrise?</strong><span>A circle or loop can fail the vertical-line test globally, but a parameter can still trace every point in order.</span>';p.append(call);this.mountTracer(p,{curves:PARAMETRIC_CURVES,initialCurveId:'parametric-ellipse',initialStage:'coordinates'});}
 render_restrict_domain(){
  const p=this.panel('Recap domain and range, then restrict t','Before using a parameter interval, recall the ordinary function language: domain means the allowed input values; range means the output values that those inputs produce.');
  const recap=el(this.document,'div','parametric-differentiation-understand__domain-recap');
  const domain=el(this.document,'div','parametric-differentiation-understand__domain-card');
  domain.append(el(this.document,'strong','','Domain'),el(this.document,'span','','The allowed input values. For y=f(x), these are the allowed x-values.'));
  const range=el(this.document,'div','parametric-differentiation-understand__domain-card');
  range.append(el(this.document,'strong','','Range'),el(this.document,'span','','The output values produced by those inputs. For y=f(x), these are the resulting y-values.'));
  recap.append(domain,range);

  const check=el(this.document,'section','parametric-differentiation-understand__recall-check');
  check.setAttribute('aria-labelledby','parametric-domain-check-title');
  const checkTitle=el(this.document,'strong','','Quick recall check');
  checkTitle.id='parametric-domain-check-title';
  const prompt=el(this.document,'p','','For f(x)=x² restricted to −2≤x≤1, which statement gives the domain?');
  const choices=el(this.document,'div','parametric-differentiation-understand__recall-choices');
  const status=el(this.document,'p','parametric-differentiation-understand__recall-status','Choose the input interval, not the outputs.');
  status.setAttribute('role','status');
  status.setAttribute('aria-live','polite');
  check.append(checkTitle,prompt,choices,status);

  const explorer=el(this.document,'div','parametric-differentiation-understand__range-explorer');
  explorer.hidden=true;
  const handoff=el(this.document,'div','parametric-differentiation-understand__callout');
  handoff.innerHTML='<strong>Now transfer that idea to parametrics.</strong><span>The allowed t-values form the parameter domain. Those t-values generate corresponding x-values and y-values, so restricting t can change both coordinate ranges.</span>';
  const readout=el(this.document,'div','parametric-differentiation-understand__range-grid');
  explorer.append(handoff,readout);
  p.append(recap,check,explorer);

  const revealExplorer=()=>{
   explorer.hidden=false;
   status.textContent='Correct. Domain means allowed inputs. Now restrict the t-domain and watch the resulting x- and y-ranges.';
   explorer.scrollIntoView?.({block:'nearest',behavior:'smooth'});
  };
  const options=[
   ['domain','−2≤x≤1'],
   ['range','0≤f(x)≤4']
  ];
  for(const [id,label] of options){
   const b=el(this.document,'button','parametric-differentiation-understand__recall-choice',label);
   b.type='button';
   b.setAttribute('aria-pressed','false');
   b.addEventListener('click',()=>{
    for(const candidate of choices.querySelectorAll('button')){const selected=candidate===b;candidate.classList.toggle('is-selected',selected);candidate.setAttribute('aria-pressed',String(selected));}
    if(id==='domain'){revealExplorer();return;}
    explorer.hidden=true;
    status.textContent='That interval describes the range of output values. The domain is the allowed input interval: −2≤x≤1.';
   });
   choices.append(b);
  }

  const update=({state})=>{
   const def=this.tracer.definition;
   const ranges=calculateCoordinateRanges(def,state.interval);
   readout.innerHTML=`<div><span>t-domain</span><strong>[${fmt(state.interval[0])}, ${fmt(state.interval[1])}]</strong></div><div><span>x-range</span><strong>[${fmt(ranges.xRange[0])}, ${fmt(ranges.xRange[1])}]</strong></div><div><span>y-range</span><strong>[${fmt(ranges.yRange[0])}, ${fmt(ranges.yRange[1])}]</strong></div>`;
  };
  this.mountTracer(explorer,{initialCurveId:'parametric-cubic',initialStage:'coordinates',onChange:update});
  update({state:this.tracer.getState()});
 }
 render_eliminate_parameter(){const p=this.panel('From paired equations back to a Cartesian relationship','Treat x=f(t), y=g(t) like simultaneous equations sharing the same parameter. Eliminate t when the algebra allows it.');const steps=el(this.document,'div','parametric-differentiation-understand__steps');p.append(steps);renderEquationSteps(steps,[{id:'e1',kind:'setup',label:'Parametric pair',expression:'x = t + 1,    y = t²',explanation:'Both coordinates use the same t.'},{id:'e2',kind:'working',label:'Solve one equation for t',expression:'t = x − 1',explanation:'This is the elimination link to simultaneous equations.'},{id:'e3',kind:'working',label:'Substitute into the other',expression:'y = (x − 1)²',explanation:'The parameter has disappeared.'},{id:'e4',kind:'result',label:'Cartesian form',expression:'y = (x − 1)²',explanation:'Any restriction on t must also be translated into the corresponding x/y range.'}]);const note=el(this.document,'p','parametric-differentiation-understand__note','Elimination is a connection, not always the best way to work. For gradients, staying in t is often more efficient.');p.append(note);}
 render_derive_gradient(){const p=this.panel('The ratio formula comes from the chain rule','The formal derivation is the chain rule applied to y=y(x(t)). Any fraction-like “cancellation” picture comes only afterwards as an A-level memory aid.');const steps=el(this.document,'div','parametric-differentiation-understand__steps');p.append(steps);renderEquationSteps(steps,[{id:'c1',kind:'setup',label:'Think of y as changing through x, and x through t',expression:'y = y(x(t))',explanation:'This is a composite function.'},{id:'c2',kind:'working',label:'Apply the chain rule with respect to t',expression:'dy/dt = (dy/dx)(dx/dt)',explanation:'The rate in t factors through x.'},{id:'c3',kind:'working',label:'Rearrange when dx/dt ≠ 0',expression:'dy/dx = (dy/dt) / (dx/dt)',explanation:'This is the parametric gradient rule.'},{id:'c4',kind:'result',label:'Important condition',expression:'dx/dt ≠ 0',explanation:'If dx/dt=0, do not divide by zero; inspect the geometry and dy/dt.'}]);const hint=el(this.document,'div','parametric-differentiation-understand__intuition');hint.innerHTML='<strong>A-level intuition, not proof:</strong><span data-math-render>At A level it can be useful to think of the differentials as if dt cancels when moving from (dy/dt)/(dx/dt) to dy/dx. Treat that only as a mnemonic or intuition: the chain rule above is the justification. Differentials are not ordinary algebraic factors that may always be cancelled, and later mathematics treats differential notation more carefully.</span>';p.append(hint);}
 render_gradient_view(){const p=this.panel('See dx/dt, dy/dt and dy/dx on the same moving point','Use the cubic trace and move t through 0. At t=0, dx/dt=0 while dy/dt≠0: the tangent is vertical, so dy/dx is not a finite number.');const status=el(this.document,'div','parametric-differentiation-understand__status');status.setAttribute('data-math-render','');p.append(status);const update=({point})=>{const vertical=Math.abs(point.dxdt)<1e-10&&Math.abs(point.dydt)>=1e-10;status.textContent=vertical?`At t=${fmt(point.t)}: dx/dt=0 and dy/dt=${fmt(point.dydt)}. This gives a vertical tangent; do not form a finite quotient.`:`At t=${fmt(point.t)}: dy/dx=${fmt(point.dydx)} = ${fmt(point.dydt)} ÷ ${fmt(point.dxdt)}. The tangent shown has the same gradient.`;status.dataset.vertical=vertical?'true':'false';};this.mountTracer(p,{initialCurveId:'parametric-cubic',initialStage:'gradient',initialT:0,onChange:update});update({point:this.tracer.getParametricState()});}
}
export function createParametricDifferentiationUnderstandExperience(host,options){return new ParametricDifferentiationUnderstandExperience(host,options);}
