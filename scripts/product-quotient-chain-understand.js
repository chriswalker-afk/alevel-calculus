import { renderEquationSteps } from './equation-step-renderer.js';
import { applyStructuredExpression, structureLegend } from './expression-structure-highlighter.js?v=auditstep9';
const IDS=new Set(['activity:y13:differentiation:product-quotient-chain:understand:rule-orientation','activity:y13:differentiation:product-quotient-chain:understand:classify-structure','activity:y13:differentiation:product-quotient-chain:understand:function-machines','activity:y13:differentiation:product-quotient-chain:understand:inside-outside-builder','activity:y13:differentiation:product-quotient-chain:understand:rule-application','activity:y13:differentiation:product-quotient-chain:understand:nested-mixtures']);
function el(d,t,c='',x=''){const n=d.createElement(t);if(c)n.className=c;if(x)n.textContent=x;return n;}
function button(d,label,fn){const b=el(d,'button','pqc__button',label);b.type='button';b.addEventListener('click',fn);return b;}
const CLASSIFY=Object.freeze([
 {e:'(x²+1)eˣ',a:'product',why:'Two functions are multiplied.'},{e:'sin x / (x+2)',a:'quotient',why:'One function is divided by another.'},{e:'sin(3x²)',a:'composite',why:'3x² is fed into sin.'},{e:'(x²+1)·e^(3x)',a:'mixture',why:'The outside structure is a product; one factor is itself composite.'},{e:'ln(x²+1)/(1+x)',a:'mixture',why:'The outside structure is a quotient; the numerator is composite.'}
]);
const COMPOSITES=Object.freeze([
 {e:'(3x+1)⁵',inside:'3x+1',outside:'u⁵',insideChoices:['3x+1','x','(3x+1)⁵'],outsideChoices:['u⁵','3u+1','u+5']},
 {e:'sin(x²+4)',inside:'x²+4',outside:'sin u',insideChoices:['x²+4','x²','sin(x²+4)'],outsideChoices:['sin u','u²+4','u+4']},
 {e:'e^(2x−1)',inside:'2x−1',outside:'eᵘ',insideChoices:['2x−1','2x','e^(2x−1)'],outsideChoices:['eᵘ','2u−1','u−1']},
 {e:'ln(1+x²)',inside:'1+x²',outside:'ln u',insideChoices:['1+x²','x²','ln(1+x²)'],outsideChoices:['ln u','1+u²','u²']}
]);
export const RULE_WORKED_EXAMPLES=Object.freeze({
 product:Object.freeze({
  label:'Product rule',
  example:'y = x² sin x',
  identity:'u = x², v = sin x; u′ = 2x, v′ = cos x',
  cue:'Differentiate the first, leave the second; then vice versa; add.',
  skeleton:'y′ = [first term] + [second term]',
  slots:Object.freeze([
   Object.freeze({id:'product-first',label:'First term',correct:'(2x)(sin x)',options:Object.freeze(['(2x)(sin x)','(x²)(cos x)','(2x)(cos x)'])}),
   Object.freeze({id:'product-second',label:'Second term',correct:'(x²)(cos x)',options:Object.freeze(['(x²)(cos x)','(2x)(sin x)','(x²)(sin x)'])})
  ]),
  roles:Object.freeze(['first','second']),
  steps:Object.freeze([
   Object.freeze({id:'product-rule',kind:'working',label:'Rule assembled',expression:"y′ = u′v + uv′",explanation:'Differentiate the first, leave the second; then vice versa; add.'}),
   Object.freeze({id:'product-substitute',kind:'working',label:'Substitute the differentiated pieces',expression:'y′ = (2x)(sin x) + (x²)(cos x)',explanation:'Each term differentiates one factor and leaves the other unchanged.'}),
   Object.freeze({id:'product-complete',kind:'result',label:'Completed derivative',expression:'y′ = 2x sin x + x² cos x',explanation:'Both product-rule terms are present.'})
  ]),
  structures:Object.freeze({
   'product-rule':Object.freeze({prefix:"y′ = ",parts:Object.freeze([{text:"u′",role:'first'},{text:'v',role:'second'},{text:' + '},{text:'u',role:'first'},{text:"v′",role:'second'}])})
  })
 }),
 quotient:Object.freeze({
  label:'Quotient rule',
  example:'y = (x² + 1)/(x + 1)',
  identity:'u = x² + 1, v = x + 1; u′ = 2x, v′ = 1',
  cue:'Fix u and v first. The v in the denominator is the v that begins the numerator, and that same v appears squared in the denominator. Keep the subtraction order v u′ − u v′.',
  skeleton:'y′ = ([first numerator term] − [second numerator term]) / [denominator]',
  slots:Object.freeze([
   Object.freeze({id:'quotient-first',label:'First numerator term',correct:'(x+1)(2x)',options:Object.freeze(['(x+1)(2x)','(x²+1)(1)','(x²+1)(2x)'])}),
   Object.freeze({id:'quotient-second',label:'Second numerator term',correct:'(x²+1)(1)',options:Object.freeze(['(x²+1)(1)','(x+1)(2x)','(x+1)(1)'])}),
   Object.freeze({id:'quotient-denominator',label:'Denominator',correct:'(x+1)²',options:Object.freeze(['(x+1)²','x+1','(x²+1)²'])})
  ]),
  roles:Object.freeze(['first','second']),
  steps:Object.freeze([
   Object.freeze({id:'quotient-rule',kind:'working',label:'Rule assembled',expression:"y′ = (vu′ − uv′)/v²",explanation:'The denominator function v begins the numerator; subtraction stays v u′ − u v′; the denominator is v².'}),
   Object.freeze({id:'quotient-substitute',kind:'working',label:'Substitute the differentiated pieces',expression:'y′ = [(x+1)(2x) − (x²+1)(1)]/(x+1)²',explanation:'The positional cue keeps the numerator order and denominator square fixed.'}),
   Object.freeze({id:'quotient-complete',kind:'result',label:'Completed derivative',expression:'y′ = (x² + 2x − 1)/(x+1)²',explanation:'Only simplify after the quotient-rule structure is secure.'})
  ]),
  structures:Object.freeze({
   'quotient-rule':Object.freeze({prefix:"y′ = [",parts:Object.freeze([{text:'v',role:'second'},{text:"u′",role:'first'},{text:' − '},{text:'u',role:'first'},{text:"v′",role:'second'},{text:'] / '},{text:'v²',role:'second'}])})
  })
 }),
 chain:Object.freeze({
  label:'Chain rule',
  example:'y = sin(3x² + 1)',
  identity:'inside = 3x² + 1; outside = sin u; inside derivative = 6x',
  cue:'Identify inside/outside. Differentiate the outside while leaving the inside in place, then multiply by the inside derivative.',
  skeleton:'y′ = [outside derivative, inside left in place] × [inside derivative]',
  slots:Object.freeze([
   Object.freeze({id:'chain-outer',label:'Outside derivative with inside left in place',correct:'cos(3x²+1)',options:Object.freeze(['cos(3x²+1)','cos x','sin(3x²+1)'])}),
   Object.freeze({id:'chain-inner',label:'Inside derivative',correct:'6x',options:Object.freeze(['6x','3x²+1','3x'])})
  ]),
  roles:Object.freeze(['outer','inner']),
  steps:Object.freeze([
   Object.freeze({id:'chain-rule',kind:'working',label:'Rule assembled',expression:"dy/dx = f′(g(x)) · g′(x)",explanation:'Differentiate the outside while leaving the inside in place, then multiply by the inside derivative.'}),
   Object.freeze({id:'chain-substitute',kind:'working',label:'Substitute the differentiated pieces',expression:'y′ = cos(3x²+1) · 6x',explanation:'The inside expression remains inside cos while the factor 6x is multiplied afterwards.'}),
   Object.freeze({id:'chain-complete',kind:'result',label:'Completed derivative',expression:'y′ = 6x cos(3x²+1)',explanation:'Outside derivative × inside derivative.'})
  ]),
  structures:Object.freeze({
   'chain-rule':Object.freeze({prefix:'dy/dx = ',parts:Object.freeze([{text:"f′(",role:'outer'},{text:'g(x)',role:'inner'},{text:')',role:'outer'},{text:' · '},{text:"g′(x)",role:'inner'}])})
  })
 })
});
export class ProductQuotientChainUnderstandExperience{
 constructor(host){if(!host)throw new Error('ProductQuotientChainUnderstandExperience requires a host.');this.host=host;this.document=host.ownerDocument||document;}
 supports(id){return IDS.has(id);} destroy(){this.host.replaceChildren();this.host.classList.remove('pqc');}
 render(id){if(!this.supports(id))return false;this.destroy();this.host.classList.add('pqc');this[`render_${id.split(':').at(-1).replaceAll('-','_')}`]();return true;}
 panel(title,copy){const p=el(this.document,'section','pqc__panel');const h=el(this.document,'div','pqc__header');h.append(el(this.document,'span','pqc__eyebrow','STRUCTURE BEFORE CALCULATION'),el(this.document,'h3','',title),el(this.document,'p','',copy));p.append(h);this.host.append(p);return p;}
 render_rule_orientation(){
  const p=this.panel('Three new rules — first recognise what each one is for','You are about to learn three differentiation rules. On this page, only learn the names and the kinds of expressions they handle. The formulas come later.');
  const intro=el(this.document,'div','pqc__orientation-intro');
  intro.append(el(this.document,'strong','','Do not calculate yet.'),el(this.document,'span','','Your first job is to recognise the structure of an expression so you know which rule might be needed.'));
  const grid=el(this.document,'div','pqc__orientation-grid');
  const cards=[
   ['Product rule','Use when two functions are multiplied.','(x² + 1)eˣ','product'],
   ['Quotient rule','Use when one function is divided by another.','sin x / (x + 2)','quotient'],
   ['Chain rule','Use when one function is inside another function.','sin(3x² + 1)','composite']
  ];
  for(const [name,purpose,example,structure] of cards){
   const card=el(this.document,'article','pqc__orientation-card');
   card.setAttribute('data-rule-orientation',structure);
   card.append(el(this.document,'span','pqc__orientation-rule',name),el(this.document,'p','',purpose),el(this.document,'div','pqc__expression pqc__orientation-example',example),el(this.document,'span','pqc__orientation-structure',`Structure: ${structure}`));
   grid.append(card);
  }
  p.append(intro,grid,el(this.document,'div','pqc__takeaway','Next, you will classify expressions as product, quotient, composite or mixture. Only after that will the formal differentiation rules be revealed.'));
 }
 render_classify_structure(){const p=this.panel('Name the structure before you choose a rule','The formulas are deliberately not needed yet. Read the whole expression first.');let i=0;const card=el(this.document,'div','pqc__classification');const expression=el(this.document,'div','pqc__expression');const status=el(this.document,'p','pqc__status');const controls=el(this.document,'div','pqc__choices');const opts=['product','quotient','composite','mixture'];const paint=()=>{expression.textContent=CLASSIFY[i].e;status.textContent=`Expression ${i+1} of ${CLASSIFY.length}: choose the dominant structure.`;};for(const o of opts){controls.append(button(this.document,o[0].toUpperCase()+o.slice(1),()=>{const q=CLASSIFY[i];status.textContent=o===q.a?`Correct — ${q.why}`:`Not yet. Look at the whole expression: ${q.why}`;}));}card.append(expression,controls,status,button(this.document,'Next expression',()=>{i=(i+1)%CLASSIFY.length;paint();}));p.append(card);paint();}
 render_function_machines(){const p=this.panel('Composition is an order, not just a pair of functions','Choose f and g, then compare x → g(x) → f(g(x)) with x → f(x) → g(f(x)).');const defs=[{label:'square',text:'x²',fn:x=>x*x},{label:'add 1',text:'x+1',fn:x=>x+1},{label:'sin',text:'sin x',fn:x=>Math.sin(x)},{label:'exp',text:'eˣ',fn:x=>Math.exp(x)}];let fi=0,gi=1,x=2;const controls=el(this.document,'div','pqc__machine-controls');const makeSelect=(label,onchange)=>{const wrap=el(this.document,'label','pqc__control',label);const s=el(this.document,'select');defs.forEach((q,j)=>{const o=el(this.document,'option','',q.label);o.value=String(j);s.append(o);});s.addEventListener('change',()=>onchange(Number(s.value)));wrap.append(s);return [wrap,s];};const [fw,fs]=makeSelect('f',v=>{fi=v;draw();});const [gw,gs]=makeSelect('g',v=>{gi=v;draw();});gs.value='1';const xw=el(this.document,'label','pqc__control','x');const xr=el(this.document,'input');xr.type='range';xr.min='-2';xr.max='2';xr.step='.25';xr.value='2';xr.addEventListener('input',()=>{x=Number(xr.value);draw();});xw.append(xr);controls.append(fw,gw,xw);const grid=el(this.document,'div','pqc__machine-grid');const a=el(this.document,'div','pqc__machine');const b=el(this.document,'div','pqc__machine');grid.append(a,b);p.append(controls,grid);const fmt=n=>Number.isFinite(n)?Number(n.toFixed(4)).toString():'undefined';const draw=()=>{a.replaceChildren();b.replaceChildren();const f=defs[fi],g=defs[gi];const gx=g.fn(x),fg=f.fn(gx),fx=f.fn(x),gf=g.fn(fx);a.append(el(this.document,'h4','',`f(g(x)) with f=${f.text}, g=${g.text}`),el(this.document,'div','pqc__flow',`${fmt(x)} → g → ${fmt(gx)} → f → ${fmt(fg)}`),el(this.document,'p','',`Inside: g(x). Outside: f(□). Result: f(g(x)) = ${fmt(fg)}.`));b.append(el(this.document,'h4','',`g(f(x)) with the same functions`),el(this.document,'div','pqc__flow',`${fmt(x)} → f → ${fmt(fx)} → g → ${fmt(gf)}`),el(this.document,'p','',`Changing the order usually changes the function: ${fmt(fg)} ${Math.abs(fg-gf)<1e-9?'=':'≠'} ${fmt(gf)}.`));};draw();}
 render_inside_outside_builder(){
  const p=this.panel('Find the inside and outside without differentiating','Function machines showed that order matters. Now unpack several composite expressions by identifying what happens first and what is applied afterwards.');
  let i=0,insideChoice='',outsideChoice='';
  const card=el(this.document,'div','pqc__composition-builder');
  const expression=el(this.document,'div','pqc__expression');
  const insideGroup=el(this.document,'div','pqc__builder-group');
  const outsideGroup=el(this.document,'div','pqc__builder-group');
  const insideChoices=el(this.document,'div','pqc__builder-choices');
  const outsideChoices=el(this.document,'div','pqc__builder-choices');
  insideGroup.append(el(this.document,'strong','','1 · What is the inside function?'),insideChoices);
  outsideGroup.append(el(this.document,'strong','','2 · What is the outside function? Write it using u.'),outsideChoices);
  const status=el(this.document,'p','pqc__status');
  status.setAttribute('role','status');
  status.setAttribute('aria-live','polite');
  const actions=el(this.document,'div','pqc__choices');
  const check=button(this.document,'Check inside and outside',()=>checkAnswer());
  const next=button(this.document,'Next composite',()=>{i=(i+1)%COMPOSITES.length;paint();});
  check.disabled=true;
  actions.append(check,next);
  card.append(expression,insideGroup,outsideGroup,actions,status);
  p.append(card,el(this.document,'div','pqc__takeaway','Composite-function habit: identify the inside expression first, then describe the outside function as something acting on u. This prepares the chain rule without using the differentiation formula yet.'));

  const renderChoices=(host,values,kind)=>{
   host.replaceChildren();
   for(const value of values){
    const b=button(this.document,value,()=>{
     if(kind==='inside')insideChoice=value;else outsideChoice=value;
     for(const candidate of host.querySelectorAll('button')){const selected=candidate===b;candidate.classList.toggle('is-selected',selected);candidate.setAttribute('aria-pressed',String(selected));}
     check.disabled=!(insideChoice&&outsideChoice);
     status.textContent='Both parts selected. Check whether the inner-to-outer order is correct.';
    });
    b.setAttribute('aria-pressed','false');
    host.append(b);
   }
  };
  const paint=()=>{
   const q=COMPOSITES[i];
   insideChoice='';outsideChoice='';check.disabled=true;
   expression.textContent=q.e;
   renderChoices(insideChoices,q.insideChoices,'inside');
   renderChoices(outsideChoices,q.outsideChoices,'outside');
   status.textContent=`Composite ${i+1} of ${COMPOSITES.length}: choose the inside function and the outside function.`;
  };
  const checkAnswer=()=>{
   const q=COMPOSITES[i];
   const insideCorrect=insideChoice===q.inside;
   const outsideCorrect=outsideChoice===q.outside;
   if(insideCorrect&&outsideCorrect){status.textContent=`Correct — ${q.inside} happens first, then that result is fed into ${q.outside}. No differentiation is needed yet.`;return;}
   if(!insideCorrect&&outsideCorrect){status.textContent='The outside function is right. For the inside, find the complete expression that must be evaluated before the outside function can act.';return;}
   if(insideCorrect&&!outsideCorrect){status.textContent='The inside function is right. Now replace that whole inside expression by u and identify the function acting on u.';return;}
   status.textContent='Not yet. Read from the innermost brackets or input outwards: first identify what is calculated, then what acts on that result.';
  };
  paint();
 }
 render_rule_application(){
  const p=this.panel('Build each rule before the completed derivative is revealed','Choose a rule, then select the correct differentiated pieces for each slot. The finished derivative stays hidden until the structure is assembled correctly.');
  let kind='product';
  const completed=new Set();
  const tabs=el(this.document,'div','pqc__choices pqc__rule-tabs');
  const work=el(this.document,'div','pqc__work pqc__rule-worked');
  const tabButtons=new Map();
  const selectRule=(next)=>{
   kind=next;
   for(const [key,b] of tabButtons){const on=key===kind;b.classList.toggle('is-selected',on);b.setAttribute('aria-pressed',String(on));}
   draw();
  };
  for(const key of ['product','quotient','chain']){
   const b=button(this.document,RULE_WORKED_EXAMPLES[key].label,()=>selectRule(key));
   b.setAttribute('aria-pressed','false');
   tabButtons.set(key,b);
   tabs.append(b);
  }
  p.append(tabs,work);

  const draw=()=>{
   const cfg=RULE_WORKED_EXAMPLES[kind];
   work.replaceChildren();
   const heading=el(this.document,'div','pqc__worked-heading');
   heading.append(el(this.document,'span','pqc__worked-rule',cfg.label),el(this.document,'div','pqc__expression pqc__worked-example',cfg.example),el(this.document,'p','pqc__worked-identity',cfg.identity));
   const cue=el(this.document,'div','pqc__rule-cue');
   cue.append(el(this.document,'strong','','Quick method'),el(this.document,'span','',cfg.cue));
   const skeleton=el(this.document,'div','pqc__assembly-skeleton',cfg.skeleton);
   skeleton.setAttribute('aria-label',`${cfg.label} formula with missing pieces`);
   const assembly=el(this.document,'div','pqc__rule-assembly');
   assembly.dataset.ruleAssembly=kind;
   const selections={};
   const status=el(this.document,'p','pqc__status');
   status.setAttribute('role','status');
   status.setAttribute('aria-live','polite');
   const check=button(this.document,'Check assembled rule',()=>checkAssembly());
   check.disabled=true;
   const reveal=el(this.document,'div','pqc__rule-reveal');
   reveal.hidden=true;

   for(const slot of cfg.slots){
    const group=el(this.document,'div','pqc__assembly-slot');
    group.dataset.slotId=slot.id;
    group.append(el(this.document,'strong','',slot.label));
    const choices=el(this.document,'div','pqc__builder-choices');
    for(const value of slot.options){
     const option=button(this.document,value,()=>{
      selections[slot.id]=value;
      for(const candidate of choices.querySelectorAll('button')){const on=candidate===option;candidate.classList.toggle('is-selected',on);candidate.setAttribute('aria-pressed',String(on));}
      check.disabled=cfg.slots.some(item=>!selections[item.id]);
      reveal.hidden=true;
      reveal.replaceChildren();
      status.textContent='Piece selected. Complete every slot, then check the structure.';
     });
     option.setAttribute('aria-pressed','false');
     choices.append(option);
    }
    group.append(choices);
    assembly.append(group);
   }

   const checkAssembly=()=>{
    const wrong=cfg.slots.filter(slot=>selections[slot.id]!==slot.correct);
    if(wrong.length){
     if(kind==='quotient'){
      const reversed=selections['quotient-first']==='(x²+1)(1)'&&selections['quotient-second']==='(x+1)(2x)';
      if(reversed){status.textContent='The quotient numerator order is reversed. Fix u and v: denominator v must begin the numerator as v u′, then subtract u v′.';return;}
      if(selections['quotient-denominator']!=='(x+1)²'){status.textContent='Check the denominator: the same v=x+1 is squared below, so the denominator must be (x+1)².';return;}
      status.textContent='Keep the positional cue visible: v u′ − u v′ over v². Check which differentiated piece belongs in each numerator slot.';
      return;
     }
     if(kind==='product'){status.textContent='Use both product terms: differentiate the first and leave the second, then differentiate the second and leave the first.';return;}
     status.textContent='Keep the inside expression in place while differentiating the outside, then multiply by the derivative of the inside.';
     return;
    }
    completed.add(kind);
    status.textContent=`Correct — ${cfg.label} assembled. The completed derivative is now revealed.`;
    const tab=tabButtons.get(kind);
    if(tab&&!tab.textContent.endsWith(' ✓'))tab.textContent=`${cfg.label} ✓`;
    reveal.hidden=false;
    const legend=structureLegend(this.document,cfg.roles);
    const stepsHost=el(this.document,'div','pqc__steps');
    reveal.append(legend,stepsHost);
    renderEquationSteps(stepsHost,cfg.steps,{decorateExpression:(node,row)=>{const structure=cfg.structures[row.id];if(structure)applyStructuredExpression(node,structure);}});
   };

   const actions=el(this.document,'div','pqc__choices');
   actions.append(check);
   work.append(heading,cue,skeleton,assembly,actions,status,reveal);
   status.textContent=completed.has(kind)?'Rebuild the rule if you want another retrieval attempt. The completed derivative remains hidden until you check a correct assembly.':'Select one piece for every slot before checking.';
  };

  selectRule('product');
 }
 render_nested_mixtures(){const p=this.panel('Mixed structures: peel from the outside in','For each example, identify the outer structure first, then inspect each part for another rule. No differentiation is required yet.');const examples=[['(x²+1)e^(3x)','Outside: product','First factor: standard/power rule · Second factor: composite → chain rule'],['sin(x²+1)/(x+3)','Outside: quotient','Numerator: composite → chain rule · Denominator: standard/power rule'],['[ln(2x+1)]³','Outside: composite','Outer: cube · Inner: ln(2x+1), which itself contains another composite structure']];const grid=el(this.document,'div','pqc__nested-grid');for(const [e,a,b] of examples){const c=el(this.document,'article','pqc__nested-card');c.append(el(this.document,'div','pqc__expression',e),el(this.document,'strong','',a),el(this.document,'p','',b));grid.append(c);}p.append(grid,el(this.document,'div','pqc__takeaway','Rule-choice habit: name the outer structure first. Then inspect the pieces. A mixture can require product/quotient and chain rules in the same derivative.'));}
}
export function createProductQuotientChainUnderstandExperience(host){return new ProductQuotientChainUnderstandExperience(host);}
