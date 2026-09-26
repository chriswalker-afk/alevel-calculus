import { DiagramPrimitives } from './diagram-primitives.js';
import { renderEquationSteps } from './equation-step-renderer.js';
import { applyStructuredExpression, structureLegend } from './expression-structure-highlighter.js';
const IDS=new Set([
 'activity:y13:differentiation:trig-identities-inverse:understand:inverse-or-reciprocal',
 'activity:y13:differentiation:trig-identities-inverse:understand:restricted-domain',
 'activity:y13:differentiation:trig-identities-inverse:understand:further-trig',
 'activity:y13:differentiation:trig-identities-inverse:understand:inverse-derivative',
 'activity:y13:differentiation:trig-identities-inverse:understand:inverse-trig-derivations',
 'activity:y13:differentiation:trig-identities-inverse:understand:mixed-workspace'
]);
function el(d,t,c='',x=''){const n=d.createElement(t);if(c)n.className=c;if(x)n.textContent=x;return n;}
function sample(fn,a,b,n=180){const pts=[];for(let i=0;i<=n;i++){const x=a+(b-a)*i/n;const y=fn(x);if(Number.isFinite(y))pts.push({x,y});}return pts;}
export class TrigIdentitiesInverseUnderstandExperience{
 constructor(host){if(!host)throw new Error('TrigIdentitiesInverseUnderstandExperience requires a host.');this.host=host;this.document=host.ownerDocument||document;this.diagram=null;}
 supports(id){return IDS.has(id);} destroy(){this.diagram?.destroy();this.diagram=null;this.host.replaceChildren();this.host.classList.remove('trig-identities-inverse-understand');}
 render(id){if(!this.supports(id))return false;this.destroy();this.host.classList.add('trig-identities-inverse-understand');this[`render_${id.split(':').at(-1).replaceAll('-','_')}`]();return true;}
 panel(title,instruction){const p=el(this.document,'section','trig-identities-inverse-understand__panel');const h=el(this.document,'div','trig-identities-inverse-understand__header');h.append(el(this.document,'div','trig-identities-inverse-understand__radians','RADIAN MODE'),el(this.document,'h3','',title),el(this.document,'p','',instruction));p.append(h);this.host.append(p);return p;}
 render_inverse_or_reciprocal(){const p=this.panel('Inverse is not reciprocal','Classify the operation before touching the derivative. The superscript −1 is overloaded, so brackets and function names matter.');const grid=el(this.document,'div','trig-identities-inverse-understand__classify');[
 ['sin⁻¹x = arcsin x','Inverse function','Undo sine on its restricted range.'],['(sin x)⁻¹ = 1/sin x = cosec x','Reciprocal','Take one divided by the sine value.'],['cos⁻¹x = arccos x','Inverse function','Undo cosine on its restricted range.'],['(tan x)⁻¹ = 1/tan x = cot x','Reciprocal','Take one divided by tangent.']
 ].forEach(([expr,label,why])=>{const c=el(this.document,'article','trig-identities-inverse-understand__card');c.append(el(this.document,'strong','',expr),el(this.document,'span','trig-identities-inverse-understand__tag',label),el(this.document,'p','',why));grid.append(c)});p.append(grid);}
 render_restricted_domain(){const p=this.panel('Restrict first; only then reflect','A trig function must be one-to-one before it can have an inverse function. Use the control to compare unrestricted sine with the principal branch −π/2 ≤ x ≤ π/2 and its reflection in y=x.');const controls=el(this.document,'div','trig-identities-inverse-understand__controls');const toggle=el(this.document,'button','','Show principal branch and inverse');toggle.type='button';const status=el(this.document,'p','trig-identities-inverse-understand__status','Unrestricted sine repeats y-values, so reflection would not define a function.');controls.append(toggle,status);const host=el(this.document,'div','trig-identities-inverse-understand__graph');p.append(controls,host);this.diagram=new DiagramPrimitives(host,{xDomain:[-3.4,3.4],yDomain:[-2,2],ariaLabel:'Sine graph, principal restricted branch and reflected inverse relation'});const d=this.diagram;d.grid({xStep:1,yStep:1});d.axes({ticks:true,tickStep:1});d.polyline(sample(Math.sin,-Math.PI,Math.PI),{tone:'curve'});d.line({x1:-2,y1:-2,x2:2,y2:2,tone:'accent',dashed:true});d.label({x:1.8,y:1.55,text:'y = x',tone:'accent'});let shown=false;toggle.addEventListener('click',()=>{shown=!shown;toggle.textContent=shown?'Hide inverse overlay':'Show principal branch and inverse';if(shown){d.polyline(sample(Math.sin,-Math.PI/2,Math.PI/2),{tone:'tangent',className:'trig-identities-inverse-understand__principal'});d.polyline(sample(Math.asin,-1,1),{tone:'interactive',className:'trig-identities-inverse-understand__inverse'});d.label({x:1.1,y:Math.asin(1),text:'y = arcsin x',tone:'interactive'});status.textContent='On the restricted branch sine is one-to-one. Reflecting across y=x gives y=arcsin x.';}else{d.clear({keepGrid:true,keepAxes:true});d.polyline(sample(Math.sin,-Math.PI,Math.PI),{tone:'curve'});d.line({x1:-2,y1:-2,x2:2,y2:2,tone:'accent',dashed:true});d.label({x:1.8,y:1.55,text:'y = x',tone:'accent'});status.textContent='Unrestricted sine repeats y-values, so reflection would not define a function.';}});}
 render_further_trig(){const p=this.panel('Build the further trig rules from known rules','Do not treat tan, sec, cosec and cot as magic facts on first encounter. Derive them from quotient/product rules and identities, then memorise the finished results.');const s=el(this.document,'div','trig-identities-inverse-understand__steps');p.append(s);renderEquationSteps(s,[
 {id:'t1',kind:'setup',label:'Rewrite',expression:'tan x = sin x / cos x',explanation:'Use the quotient form.'},
 {id:'t2',kind:'working',label:'Differentiate',expression:'d/dx[tan x] = (cos²x + sin²x)/cos²x',explanation:'Quotient rule with sin′x=cos x and cos′x=−sin x.'},
 {id:'t3',kind:'working',label:'Identity',expression:'sin²x + cos²x = 1',explanation:'Use the Pythagorean identity.'},
 {id:'t4',kind:'result',label:'Simplify',expression:'d/dx[tan x] = sec²x',explanation:'Since 1/cos²x = sec²x.'},
 {id:'s1',kind:'setup',label:'Further facts',expression:'sec x → sec x tan x; cosec x → −cosec x cot x; cot x → −cosec²x',explanation:'These follow from reciprocal/quotient forms plus the same identities.'}
 ]);}
 render_inverse_derivative(){const p=this.panel('Inverse functions have reciprocal gradients','Treat this as a general inverse-function relationship, not a trig trick. It works where the relevant derivative is non-zero.');const s=el(this.document,'div','trig-identities-inverse-understand__steps');p.append(s);renderEquationSteps(s,[
 {id:'i1',kind:'setup',label:'Inverse relation',expression:'x = f(y)',explanation:'The inverse swaps the roles of input and output.'},
 {id:'i2',kind:'working',label:'Differentiate with respect to x',expression:'1 = (dx/dy)(dy/dx)',explanation:'Chain rule links the two rates.'},
 {id:'i3',kind:'result',label:'Rearrange',expression:'dy/dx = 1/(dx/dy)',explanation:'Valid when dx/dy ≠ 0.'}
 ]);}
 render_inverse_trig_derivations(){const p=this.panel('One derivation pattern for arcsin, arccos and arctan','Keep the four stages visible: Rewrite → Differentiate → Identity → Simplify. The final derivative must be written entirely in x.');const s=el(this.document,'div','trig-identities-inverse-understand__steps');p.append(s);renderEquationSteps(s,[
 {id:'a1',kind:'setup',label:'Rewrite',expression:'y = arcsin x  ⇔  x = sin y',explanation:'Use the inverse relation.'},
 {id:'a2',kind:'working',label:'Differentiate',expression:'1 = cos y · dy/dx',explanation:'Implicit differentiation; y depends on x.'},
 {id:'a3',kind:'working',label:'Identity',expression:'cos y = √(1−sin²y) = √(1−x²)',explanation:'On the principal arcsin range, cos y ≥ 0.'},
 {id:'a4',kind:'result',label:'Simplify',expression:'d/dx[arcsin x] = 1/√(1−x²)',explanation:'For |x|<1.'},
 {id:'c1',kind:'result',label:'Parallel results',expression:'arccos x → −1/√(1−x²);  arctan x → 1/(1+x²)',explanation:'The same four-stage process gives both.'}
 ]);}
 render_mixed_workspace(){const p=this.panel('Rewrite → Differentiate → Identity → Simplify','A good trig solution is often shorter because an identity is used deliberately. Keep the chain factor visible throughout.');p.append(structureLegend(this.document,['outer','inner']));const s=el(this.document,'div','trig-identities-inverse-understand__steps');p.append(s);const structures={
  m1:{prefix:'y = ',parts:[{text:'[tan(',role:'outer'},{text:'2x',role:'inner'},{text:')]²',role:'outer'}]},
  m2:{prefix:'dy/dx = ',parts:[{text:'2tan(',role:'outer'},{text:'2x',role:'inner'},{text:') · sec²(',role:'outer'},{text:'2x',role:'inner'},{text:') · '},{text:'2',role:'inner'}]},
  m4:{prefix:'dy/dx = ',parts:[{text:'4tan(',role:'outer'},{text:'2x',role:'inner'},{text:')sec²(',role:'outer'},{text:'2x',role:'inner'},{text:')',role:'outer'}]}
 };renderEquationSteps(s,[
 {id:'m1',kind:'setup',label:'Rewrite',expression:'y = tan²(2x) = [tan(2x)]²',explanation:'Expose the outer square and the inner 2x.'},
 {id:'m2',kind:'working',label:'Differentiate',expression:'dy/dx = 2tan(2x) · sec²(2x) · 2',explanation:'Outer power rule, tan derivative, then inner derivative.'},
 {id:'m3',kind:'working',label:'Identity',expression:'sec²(2x) = 1 + tan²(2x)',explanation:'Use an identity only if it helps the requested form or later algebra.'},
 {id:'m4',kind:'result',label:'Simplify',expression:'dy/dx = 4tan(2x)sec²(2x)',explanation:'A concise final form with the chain factor preserved.'}
 ],{decorateExpression:(node,row)=>structures[row.id]?applyStructuredExpression(node,structures[row.id]):undefined});}
}
export function createTrigIdentitiesInverseUnderstandExperience(host){return new TrigIdentitiesInverseUnderstandExperience(host);}
