import { createAreaExplorer, formatAreaNumber } from './area-explorer.js';
import { DiagramPrimitives } from './diagram-primitives.js?v=diagramfix3';
import { INTEGRATION_AREA_POSITIVE_FUNCTIONS, removalIdentityState, betweenCurvesAreaState, adjacentIntervalState, reversedIntervalState } from './integration-area-model.js?v=auditstep8';

const IDS=new Set(['lower-limit-zero','remove-unwanted-region','endpoint-difference','between-positive-curves','visual-properties'].map(s=>`activity:y12:integration:area:understand:${s}`));
const el=(d,n,c='',t='')=>{const x=d.createElement(n);if(c)x.className=c;if(t)x.textContent=t;return x;};
const number=(v)=>formatAreaNumber(v,3);
function sampleDefinition(definition,from=0,to=2,samples=180){return Array.from({length:samples+1},(_,i)=>{const x=from+(i/samples)*(to-from);return{x,y:definition.evaluate(x)};});}
function sampleBetween(upper,lower,from,to,samples=120){const top=[],bottom=[];for(let i=0;i<=samples;i++){const x=from+(i/samples)*(to-from);top.push({x,y:upper.evaluate(x)});}for(let i=samples;i>=0;i--){const x=from+(i/samples)*(to-from);bottom.push({x,y:lower.evaluate(x)});}return [...top,...bottom];}
function sampleUnderCurve(definition,from,to,samples=120){return [...sampleDefinition(definition,from,to,samples),{x:to,y:0},{x:from,y:0}];}

export class IntegrationAreaUnderstandExperience{
 constructor(host,{navigateToActivity=null}={}){if(!host)throw new Error('IntegrationAreaUnderstandExperience requires a DOM host.');this.host=host;this.document=host.ownerDocument||globalThis.document;this.navigateToActivity=typeof navigateToActivity==='function'?navigateToActivity:null;this.explorer=null;this.betweenDiagram=null;this.cleanup=[];}
 supports(id){return IDS.has(id);}
 destroy(){for(const f of this.cleanup.splice(0))f();this.explorer?.destroy();this.explorer=null;this.betweenDiagram?.destroy();this.betweenDiagram=null;this.host.replaceChildren();this.host.classList.remove('integration-area-understand');}
 render(id){if(!this.supports(id))return false;this.destroy();this.host.classList.add('integration-area-understand');this[`render_${id.split(':').at(-1).replaceAll('-','_')}`]();return true;}
 #panel(title,eyebrow){const p=el(this.document,'section','integration-area-understand__panel');const h=el(this.document,'div','integration-area-understand__header');h.append(el(this.document,'span','integration-area-understand__eyebrow',eyebrow),el(this.document,'h3','',title));const b=el(this.document,'div','integration-area-understand__body');p.append(h,b);this.host.append(p);return b;}
 #createExplorer(host,options={}){this.explorer=createAreaExplorer(host,{functions:INTEGRATION_AREA_POSITIVE_FUNCTIONS,initialFunctionId:'integration-area-linear',initialLower:0,initialUpper:3,maxSplitPoints:2,showSplitControls:false,showLegend:false,showAdvancedReadout:false,title:'Area represented by the integral',noteText:'For the positive curves in this activity, the shaded region lies above the x-axis, so its ordinary area has the same numerical value as the forward definite integral.',...options});return this.explorer;}
 #button(label,onClick){const b=el(this.document,'button','integration-area-understand__button',label);b.type='button';const f=()=>onClick(b);b.addEventListener('click',f);this.cleanup.push(()=>b.removeEventListener('click',f));return b;}
 render_lower_limit_zero(){const b=this.#panel('Start with a boundary you already understand','1 · Lower limit fixed at 0');b.append(el(this.document,'p','integration-area-understand__lead','Choose a positive function, then move only the upper limit b. The shaded region is the area from x=0 to x=b, and the live definite-integral value changes with it.'));const host=el(this.document,'div','integration-area-understand__explorer');b.append(host);this.#createExplorer(host,{lockedLowerLimit:0,initialUpper:2.5,showFunctionSelector:true,title:'Area from 0 to b'});b.append(el(this.document,'div','integration-area-understand__takeaway','Keep the lower boundary fixed at 0 for now. The definite integral from 0 to b measures the accumulated region for these positive curves.'));
 }
 render_remove_unwanted_region(){const b=this.#panel('An arbitrary lower limit removes an initial piece','2 · Visually remove 0 → a');const intro=el(this.document,'p','integration-area-understand__lead','First look at the whole accumulated region from 0 to b. Then remove the unwanted first part from 0 to a. What remains is exactly the region from a to b.');b.append(intro);const controls=el(this.document,'div','integration-area-understand__button-row');const host=el(this.document,'div','integration-area-understand__explorer');const readout=el(this.document,'div','integration-area-understand__identity');b.append(controls,host,readout);const a=1,bound=3;const explorer=this.#createExplorer(host,{showFunctionSelector:false,initialLower:0,initialUpper:bound,title:'Start with the whole 0 → b region'});const update=(stage)=>{const state=removalIdentityState(explorer.definition,a,bound);readout.innerHTML=`<span>whole 0→b: <strong>${number(state.toB)}</strong></span><span>unwanted 0→a: <strong>${number(state.toA)}</strong></span><span>remaining a→b: <strong>${number(state.direct)}</strong></span><div class="integration-area-understand__equation">∫_(a)^(b) f(x) dx = ∫_(0)^(b) f(x) dx − ∫_(0)^(a) f(x) dx = ${number(state.toB)} − ${number(state.toA)} = ${number(state.difference)}</div><p>${stage==='removed'?'The shading now shows only the wanted region from a to b.':'The shading currently includes the unwanted initial region from 0 to a.'}</p>`;};const showWhole=this.#button('Show full 0 → b',()=>{explorer.setLimits(0,bound,'step46-whole');update('whole');});const remove=this.#button('Remove 0 → a',()=>{explorer.setLimits(a,bound,'step46-remove');update('removed');});controls.append(showWhole,remove);update('whole');b.append(el(this.document,'div','integration-area-understand__takeaway','The lower limit a tells us how much initial accumulation must be removed.'));
 }
 render_endpoint_difference(){const b=this.#panel('The picture and F(b) − F(a) say the same thing','3 · Connect the visual to endpoint evaluation');b.append(el(this.document,'p','integration-area-understand__lead','Move a and b. The graph shows the remaining interval; the live equation rewrites that same removal using accumulated endpoint values.'));const host=el(this.document,'div','integration-area-understand__explorer');const algebra=el(this.document,'div','integration-area-understand__algebra');b.append(host,algebra);const explorer=this.#createExplorer(host,{initialLower:1,initialUpper:3,showFunctionSelector:true,title:'From a to b',onChange:()=>update()});const update=()=>{const {lower:a,upper:bound}=explorer.getAreaState();const state=removalIdentityState(explorer.definition,a,bound);algebra.innerHTML=`<div><strong>Accumulation to b</strong><span class="integration-area-understand__math" data-math-display>∫_(0)^(b) f(x) dx = F(b) − F(0) = ${number(state.toB)}</span></div><div><strong>Accumulation to a</strong><span class="integration-area-understand__math" data-math-display>∫_(0)^(a) f(x) dx = F(a) − F(0) = ${number(state.toA)}</span></div><div class="integration-area-understand__algebra-result"><strong>Remove the first from the second</strong><span class="integration-area-understand__math" data-math-display>(F(b)−F(0)) − (F(a)−F(0)) = F(b) − F(a) = ${number(state.difference)}</span></div>`;};update();b.append(el(this.document,'div','integration-area-understand__takeaway','This is why endpoint evaluation gives F(b) − F(a): it removes the unwanted initial accumulation.'));
 }
 render_between_positive_curves(){
  const b=this.#panel('Build the area between two curves from two familiar areas','4 · Top area − bottom area');
  b.append(el(this.document,'p','integration-area-understand__lead','The line A(x)=x+1 and the curve B(x)=1+½x² meet at x=0 and x=2. Between those simple limits A is always the top curve. Build the required region geometrically before writing the integral.'));
  const top=INTEGRATION_AREA_POSITIVE_FUNCTIONS.find(x=>x.id==='integration-area-linear');
  const bottom=INTEGRATION_AREA_POSITIVE_FUNCTIONS.find(x=>x.id==='integration-area-quadratic');
  const state=betweenCurvesAreaState(top,bottom,0,2);
  const controls=el(this.document,'div','integration-area-understand__button-row integration-area-understand__between-stage-controls');
  controls.setAttribute('aria-label','Highlight the component areas and the resulting region');
  const graph=el(this.document,'div','integration-area-understand__between-graph');
  const status=el(this.document,'p','integration-area-understand__between-status');
  status.setAttribute('role','status');
  status.setAttribute('aria-live','polite');
  const readout=el(this.document,'div','integration-area-understand__between-readout');
  readout.setAttribute('data-math-render','');
  readout.innerHTML=`<div><span>1 · Area under top curve</span><strong class="integration-area-understand__math" data-math-display>∫_(0)^(2) A(x) dx = ${number(state.upperArea)}</strong></div><div><span>2 · Area under bottom curve</span><strong class="integration-area-understand__math" data-math-display>∫_(0)^(2) B(x) dx = ${number(state.lowerArea)}</strong></div><div class="integration-area-understand__between-result"><span>3 · Required area</span><strong>top − bottom = ${number(state.difference)}</strong></div><p class="integration-area-understand__between-equation"><strong>Required area = area under top curve − area under bottom curve</strong><span class="integration-area-understand__math" data-math-display>∫_(0)^(2) A(x) dx − ∫_(0)^(2) B(x) dx = ∫_(0)^(2) [A(x) − B(x)] dx = ${number(state.difference)}</span></p>`;
  b.append(controls,graph,status,readout);

  const draw=(view)=>{
    this.betweenDiagram?.destroy();
    graph.replaceChildren();
    this.betweenDiagram=new DiagramPrimitives(graph,{xDomain:[-.15,2.15],yDomain:[0,3.5],ariaLabel:'The line A of x equals x plus 1 and the curve B of x equals 1 plus one half x squared, intersecting at x equals 0 and x equals 2',minHeight:340,aspectRatio:'16 / 9'});
    const d=this.betweenDiagram;
    d.grid({xStep:.5,yStep:1});
    d.axes({ticks:true,tickStep:.5});
    if(view==='top')d.shadedRegion(sampleUnderCurve(top,0,2),{tone:'curve',opacity:.15});
    if(view==='bottom')d.shadedRegion(sampleUnderCurve(bottom,0,2),{tone:'accent',opacity:.16});
    if(view==='result')d.shadedRegion(sampleBetween(top,bottom,0,2),{tone:'region',opacity:.28});
    d.polyline(sampleDefinition(top,0,2),{tone:'curve'});
    d.polyline(sampleDefinition(bottom,0,2),{tone:'accent'});
    d.line({x1:2,y1:0,x2:2,y2:3.35,tone:'warning',dashed:true});
    d.point({x:0,y:1,radius:6,tone:'point',label:'x=0'});
    d.point({x:2,y:3,radius:6,tone:'point',label:'x=2'});
    d.label({x:1.5,y:2.75,text:'A(x) = x + 1',tone:'curve'});
    d.label({x:1.25,y:1.72,text:'B(x) = 1 + ½x²',tone:'accent'});
    status.textContent=view==='top'?'Step 1: highlight the whole area under the top curve A(x) from x=0 to x=2.':view==='bottom'?'Step 2: highlight the area under the bottom curve B(x) over exactly the same limits.':'Step 3: subtract the bottom area from the top area. The green strip is the required area between the curves.';
  };

  const buttons=[];
  const activate=(view,button)=>{for(const candidate of buttons){const on=candidate===button;candidate.classList.toggle('is-active',on);candidate.setAttribute('aria-pressed',String(on));}draw(view);};
  const showTop=this.#button('1 · Show area under top A(x)',btn=>activate('top',btn));
  const showBottom=this.#button('2 · Show area under bottom B(x)',btn=>activate('bottom',btn));
  const showResult=this.#button('3 · Show required region',btn=>activate('result',btn));
  buttons.push(showTop,showBottom,showResult);
  for(const button of buttons){button.setAttribute('aria-pressed','false');controls.append(button);}
  showTop.click();

  const forward=el(this.document,'div','integration-area-understand__forward');
  const forwardCopy=el(this.document,'div','integration-area-understand__forward-copy');
  forwardCopy.append(el(this.document,'strong','','Later: full Year 13 Areas'),el(this.document,'span','','Year 13 revisits this construction when curves cross or the integral needs a more advanced method. Region construction still comes first; method selection comes afterwards.'));
  const forwardButton=this.#button('Go to Year 13 Areas',()=>this.navigateToActivity?.({topicId:'topic:y13:integration:areas',mode:'understand',activityId:'activity:y13:integration:areas:understand:construction-visual'}));
  forwardButton.classList.add('integration-area-understand__button--forward');
  forward.append(forwardCopy,forwardButton);
  b.append(forward,el(this.document,'div','integration-area-understand__takeaway','Year 12 method: identify the same limits, decide which curve is on top, then subtract bottom from top. This page stops there deliberately.'));
 }
 render_visual_properties(){const b=this.#panel('The basic properties become visible','5 · Identical, adjacent and reversed limits');b.append(el(this.document,'p','integration-area-understand__lead','Use one positive curve and switch between three interval pictures. The graph and numerical relationship should tell the same story.'));const controls=el(this.document,'div','integration-area-understand__button-row');const host=el(this.document,'div','integration-area-understand__explorer');const explanation=el(this.document,'div','integration-area-understand__property-readout');b.append(controls,host,explanation);const explorer=this.#createExplorer(host,{showFunctionSelector:false,initialLower:0,initialUpper:3,title:'Visual properties'});const buttons=[];const activate=(button)=>buttons.forEach(x=>{x.classList.toggle('is-active',x===button);x.setAttribute('aria-pressed',String(x===button));});const same=this.#button('Identical limits',btn=>{activate(btn);explorer.setSplitPoints([]);explorer.setLimits(2,2,'step46-same');explanation.innerHTML='<strong>Identical limits</strong><span class="integration-area-understand__math" data-math-display>There is no interval width to shade, so ∫_(2)^(2) f(x) dx = 0.</span>';});const adjacent=this.#button('Adjacent intervals',btn=>{activate(btn);explorer.setLimits(0,3,'step46-adjacent');explorer.setSplitPoints([1]);const s=adjacentIntervalState(explorer.definition,0,1,3);explanation.innerHTML=`<strong>Adjacent intervals</strong><span>The guide at x=1 divides one region into two touching pieces.</span><span>${number(s.whole)} = ${number(s.left)} + ${number(s.right)}</span>`;});const reversed=this.#button('Reversed limits',btn=>{activate(btn);explorer.setSplitPoints([]);explorer.setLimits(3,1,'step46-reversed');const s=reversedIntervalState(explorer.definition,1,3);explanation.innerHTML=`<strong>Reversed limits</strong><span>The same geometric strip is traversed in the opposite limit order.</span><span class="integration-area-understand__math" data-math-display>∫_(3)^(1) f(x) dx = ${number(s.reversed)} = −(${number(s.forward)})</span>`;});buttons.push(same,adjacent,reversed);buttons.forEach(x=>{x.setAttribute('aria-pressed','false');controls.append(x);});adjacent.click();b.append(el(this.document,'div','integration-area-understand__takeaway','These are visual versions of the properties from the previous topic. Curves crossing the axis are deliberately left for the next topic.'));
 }
}
export function createIntegrationAreaUnderstandExperience(host,options){return new IntegrationAreaUnderstandExperience(host,options);}
