import { createLinkedFunctionGradientExplorer, createPolynomialFunctionDefinition } from './linked-function-gradient-explorer.js';

const IDS = new Set([
  'activity:y12:differentiation:tangents-normals:understand:derivative-gradient',
  'activity:y12:differentiation:tangents-normals:understand:tangent-line',
  'activity:y12:differentiation:tangents-normals:understand:normal-gradient',
  'activity:y12:differentiation:tangents-normals:understand:normal-line',
  'activity:y12:differentiation:tangents-normals:understand:special-cases'
]);

const CURVE = createPolynomialFunctionDefinition({
  id:'tn-quadratic', label:'Quadratic: x² − 1', coefficients:[-1,0,1], xDomain:[-3,3],
  yDomains:{function:[-3,8], derivative:[-7,7], secondDerivative:[-1,3]}, initialX:1.5,
  description:'A simple quadratic with a horizontal tangent at x=0.'
});

const el=(doc,name,className='',text='')=>{ const node=doc.createElement(name); if(className) node.className=className; if(text) node.textContent=text; return node; };
const fmt=(v,d=2)=>{ if(!Number.isFinite(v)) return 'undefined'; const n=Math.abs(v)<1e-10?0:Number(v.toFixed(d)); return String(n); };

export function tangentNormalModel(definition, x){
  const y=definition.evaluate(x); const tangentGradient=definition.derivative(x);
  const verticalNormal=Math.abs(tangentGradient)<1e-10;
  const normalGradient=verticalNormal?null:-1/tangentGradient;
  return Object.freeze({x,y,tangentGradient,normalGradient,verticalNormal,
    point:`(${fmt(x)}, ${fmt(y)})`,
    tangentEquation:`y − ${fmt(y)} = ${fmt(tangentGradient)}(x − ${fmt(x)})`,
    normalEquation:verticalNormal?`x = ${fmt(x)}`:`y − ${fmt(y)} = ${fmt(normalGradient)}(x − ${fmt(x)})`
  });
}

export class TangentsNormalsUnderstandExperience {
  constructor(host){ if(!host) throw new Error('TangentsNormalsUnderstandExperience requires a DOM host.'); this.host=host; this.document=host.ownerDocument||globalThis.document; this.explorer=null; this.normalLine=null; }
  supports(id){ return IDS.has(id); }
  destroy(){ this.explorer?.destroy(); this.explorer=null; this.normalLine=null; this.host.replaceChildren(); this.host.classList.remove('tangents-normals-understand'); }
  render(id){ if(!this.supports(id)) return false; this.destroy(); this.host.classList.add('tangents-normals-understand'); const slug=id.split(':').at(-1).replaceAll('-','_'); this[`render_${slug}`](); return true; }
  #panel(title,eyebrow){ const panel=el(this.document,'section','tangents-normals-understand__panel'); const head=el(this.document,'div','tangents-normals-understand__panel-header'); head.append(el(this.document,'span','tangents-normals-understand__eyebrow',eyebrow),el(this.document,'h3','',title)); const body=el(this.document,'div','tangents-normals-understand__panel-body'); panel.append(head,body); this.host.append(panel); return body; }
  #mount(body,{x=1.5,showDerivative=false,showNormal=false,focus='all'}={}){
    const readout=el(this.document,'div','tangents-normals-understand__line-readout');
    const graphHost=el(this.document,'div','tangents-normals-understand__graph-host'); body.append(graphHost,readout);
    let updateOverlay=()=>{};
    this.explorer=createLinkedFunctionGradientExplorer(graphHost,{functions:[CURVE],initialFunctionId:CURVE.id,revealDerivative:showDerivative,allowSecondDerivative:false,showFunctionSelector:false,showDerivativeControls:false,showDerivativeReadout:true,derivativePanelVisible:showDerivative,onChange:({x:nextX})=>updateOverlay(nextX)});
    this.explorer.setX(x,'programmatic'); this.explorer.readout?.setAttribute('aria-live','off');
    const diagram=this.explorer.diagrams.get('function'); const [xMin,xMax]=CURVE.xDomain; const [yMin,yMax]=CURVE.yDomains.function;
    this.normalLine=diagram.line({x1:x,y1:yMin,x2:x,y2:yMax,tone:'accent',className:'tangents-normals-understand__normal-line'});
    const update=(nextX)=>{
      const m=tangentNormalModel(CURVE,nextX); const span=(xMax-xMin)*0.34;
      if(m.verticalNormal){ this.normalLine.setCoordinates({x1:m.x,y1:yMin,x2:m.x,y2:yMax}); }
      else { this.normalLine.setCoordinates({x1:m.x-span/2,y1:m.y-m.normalGradient*span/2,x2:m.x+span/2,y2:m.y+m.normalGradient*span/2}); }
      this.normalLine.element.style.display=showNormal?'':'none';
      const bits=[];
      if(focus==='gradient'||focus==='all') bits.push(`<strong>At x = ${fmt(m.x)}</strong><span>point = ${m.point}</span><span>f′(a) = ${fmt(m.tangentGradient)}</span>`);
      if(focus==='tangent'||focus==='all') bits.push(`<span>tangent: ${m.tangentEquation}</span>`);
      if(focus==='normal'||focus==='all') bits.push(`<span>${m.verticalNormal?'normal is vertical':`m_normal = ${fmt(m.normalGradient)}`}</span><span>normal: ${m.normalEquation}</span>`);
      readout.innerHTML=bits.join('');
      readout.dataset.specialCase=m.verticalNormal?'vertical-normal':'regular';
    };
    updateOverlay=update; update(this.explorer.getState().x);
    return {readout,update};
  }
  #jumpButtons(body, values){ const row=el(this.document,'div','tangents-normals-understand__choice-row'); values.forEach(({x,label})=>{const b=el(this.document,'button','tangents-normals-understand__button',label); b.type='button'; b.addEventListener('click',()=>this.explorer?.setX(x,'button')); row.append(b);}); body.append(row); }
  render_derivative_gradient(){ const body=this.#panel('The derivative supplies the tangent gradient','1 · Derivative → gradient'); body.append(el(this.document,'p','tangents-normals-understand__lead','Move the point on f(x)=x²−1. The tangent rotates, while f′(x)=2x reports its gradient at the same x-value.')); this.#mount(body,{showDerivative:true,showNormal:false,focus:'gradient'}); this.#jumpButtons(body,[{x:-1,label:'Try x = −1'},{x:1,label:'Try x = 1'},{x:2,label:'Try x = 2'}]); }
  render_tangent_line(){ const body=this.#panel('A tangent needs one point and one gradient','2 · Build the tangent'); body.append(el(this.document,'p','tangents-normals-understand__lead','The point of contact is (a,f(a)); the derivative gives f′(a). Put both into point-slope form.')); this.#mount(body,{showNormal:false,focus:'tangent'}); this.#jumpButtons(body,[{x:0.5,label:'a = 0.5'},{x:1,label:'a = 1'},{x:2,label:'a = 2'}]); }
  render_normal_gradient(){ const body=this.#panel('The normal stays perpendicular','3 · Tangent → normal'); body.append(el(this.document,'p','tangents-normals-understand__lead','The accent line is the normal. As the tangent rotates, the normal rotates with it so the two lines remain perpendicular.')); this.#mount(body,{showNormal:true,focus:'normal'}); body.append(el(this.document,'div','tangents-normals-understand__takeaway','For a non-zero tangent gradient, m_tangent × m_normal = −1, so m_normal = −1/m_tangent.')); }
  render_normal_line(){ const body=this.#panel('Same point, perpendicular gradient','4 · Build the normal'); body.append(el(this.document,'p','tangents-normals-understand__lead','The tangent and normal meet at the same point of contact. Only the gradient changes.')); this.#mount(body,{showNormal:true,focus:'all'}); this.#jumpButtons(body,[{x:-2,label:'a = −2'},{x:-1,label:'a = −1'},{x:1,label:'a = 1'}]); }
  render_special_cases(){ const body=this.#panel('Horizontal tangent means vertical normal','5 · Special case'); body.append(el(this.document,'p','tangents-normals-understand__lead','Move to x=0. The tangent gradient is 0, so taking −1/0 is not valid. Geometry tells us the perpendicular normal is vertical.')); this.#mount(body,{x:0,showNormal:true,focus:'all'}); this.#jumpButtons(body,[{x:0,label:'Horizontal tangent: x = 0'},{x:0.5,label:'Move away from the special case'}]); body.append(el(this.document,'div','tangents-normals-understand__takeaway','When m_tangent = 0, write the normal as x = a. Do not display an “undefined gradient” as if it were the line equation.')); }
}
export function createTangentsNormalsUnderstandExperience(host){ return new TangentsNormalsUnderstandExperience(host); }
