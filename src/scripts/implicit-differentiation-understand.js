import { renderEquationSteps } from './equation-step-renderer.js';
const IDS=new Set(['activity:y13:differentiation:implicit-differentiation:understand:explicit-implicit','activity:y13:differentiation:implicit-differentiation:understand:y-chain-rule','activity:y13:differentiation:implicit-differentiation:understand:term-workspace','activity:y13:differentiation:implicit-differentiation:understand:rearrange']);
function el(d,t,c='',x=''){const n=d.createElement(t);if(c)n.className=c;if(x)n.textContent=x;return n;}
export class ImplicitDifferentiationUnderstandExperience{
 constructor(host){if(!host)throw new Error('ImplicitDifferentiationUnderstandExperience requires a host.');this.host=host;this.document=host.ownerDocument||document;this.termWorkspaceComplete=false;}
 supports(id){return IDS.has(id);} destroy(){this.host.replaceChildren();this.host.classList.remove('implicit-differentiation-understand');}
 render(id){if(!this.supports(id))return false;this.destroy();this.host.classList.add('implicit-differentiation-understand');this[`render_${id.split(':').at(-1).replaceAll('-','_')}`]();return true;}
 panel(title,instruction){const p=el(this.document,'section','implicit-differentiation-understand__panel');const h=el(this.document,'div','implicit-differentiation-understand__header');h.append(el(this.document,'h3','',title),el(this.document,'p','',instruction));p.append(h);this.host.append(p);return p;}
 render_explicit_implicit(){
  const p=this.panel('Explicit or implicit? You decide first','For each relation, choose a classification before the label or explanation is revealed. Explicit form isolates y as one expression in x; implicit form keeps x and y in one relation.');
  const examples=[
   {expr:'y = 3x² − 2',answer:'explicit',why:'y is already written directly as one function of x.'},
   {expr:'x² + y² = 25',answer:'implicit',why:'x and y remain in one relation; the circle has more than one y-value for some x-values.'},
   {expr:'x + y³ = 4',answer:'implicit',why:'y is not isolated, so the relation is naturally handled implicitly.'}
  ];
  const grid=el(this.document,'div','implicit-differentiation-understand__classify');
  for(const example of examples){
   const card=el(this.document,'article','implicit-differentiation-understand__card implicit-differentiation-understand__classify-card');
   const expression=el(this.document,'strong','implicit-differentiation-understand__classify-expression',example.expr);
   const prompt=el(this.document,'span','implicit-differentiation-understand__classify-prompt','Choose before revealing the explanation.');
   const choices=el(this.document,'div','implicit-differentiation-understand__classify-choices');
   const feedback=el(this.document,'div','implicit-differentiation-understand__classify-feedback');
   feedback.hidden=true;
   feedback.setAttribute('role','status');
   feedback.setAttribute('aria-live','polite');
   for(const choice of ['explicit','implicit']){
    const b=el(this.document,'button','implicit-differentiation-understand__classify-choice',choice[0].toUpperCase()+choice.slice(1));
    b.type='button';
    b.setAttribute('aria-pressed','false');
    b.addEventListener('click',()=>{
     for(const candidate of choices.querySelectorAll('button')){const selected=candidate===b;candidate.classList.toggle('is-selected',selected);candidate.setAttribute('aria-pressed',String(selected));}
     feedback.hidden=false;
     feedback.dataset.correct=String(choice===example.answer);
     const label=example.answer[0].toUpperCase()+example.answer.slice(1);
     feedback.replaceChildren(el(this.document,'span','implicit-differentiation-understand__tag',label),el(this.document,'p','',choice===example.answer?`Correct — ${example.why}`:`Not quite — this is ${label.toLowerCase()}. ${example.why}`));
     card.dataset.classified='true';
    });
    choices.append(b);
   }
   card.append(expression,prompt,choices,feedback);
   grid.append(card);
  }
  p.append(grid,el(this.document,'p','implicit-differentiation-understand__note','Classification comes before method choice: first inspect how x and y are related, then decide whether implicit differentiation is useful.'));
 }
 render_y_chain_rule(){
  const p=this.panel('Why dy/dx appears when a term contains y','Treat y as y(x). The formal reason is the chain rule: differentiate the outer y-expression, then multiply by the derivative of y with respect to x.');
  const s=el(this.document,'div','implicit-differentiation-understand__steps');
  p.append(s);
  renderEquationSteps(s,[
   {id:'y1',kind:'setup',label:'Dependent variable',expression:'y = y(x)',explanation:'y changes when x changes.'},
   {id:'y2',kind:'working',label:'Differentiate y itself',expression:'d/dx[y] = dy/dx',explanation:'This is the derivative of y with respect to x.'},
   {id:'y3',kind:'working',label:'See the chain rule on y²',expression:'d/dx[y²] = 2y · dy/dx',explanation:'Differentiate y² with respect to y, then multiply by dy/dx because y=y(x).'},
   {id:'y4',kind:'result',label:'General chain-rule form',expression:'d/dx[f(y)] = f′(y) · dy/dx',explanation:'This is ordinary chain rule applied to the dependent variable y(x).'}
  ]);
  const cue=el(this.document,'div','implicit-differentiation-understand__mental-cue');
  cue.append(
   el(this.document,'strong','','Memory cue: “dy/dx pops out”'),
   el(this.document,'span','','When you differentiate a y-dependent expression with respect to x, it can be useful to think of a dy/dx factor as popping out.'),
   el(this.document,'span','implicit-differentiation-understand__mental-warning','This is shorthand only, not a separate rule: formally y=y(x), so the chain rule produces the dy/dx factor.')
  );
  p.append(cue);
 }
 render_term_workspace(){
  this.termWorkspaceComplete=false;
  const p=this.panel('Apply d/dx to both sides, then process every term','First apply the same differentiation operator to both sides of the equation. Only then process individual terms. Rearrangement remains locked until every term has been differentiated and the differentiated equation has been rebuilt.');
  const original=el(this.document,'div','implicit-differentiation-understand__equation','x² + xy + y² = 7');
  const operatorStage=el(this.document,'section','implicit-differentiation-understand__operator-stage');
  operatorStage.append(el(this.document,'strong','','1 · Apply the same operator to both sides'));
  const operatorAction=el(this.document,'button','implicit-differentiation-understand__apply-operator','Apply d/dx to both sides');
  operatorAction.type='button';
  const operatorEquation=el(this.document,'div','implicit-differentiation-understand__operator-equation');
  operatorEquation.hidden=true;
  operatorEquation.setAttribute('data-math-render','');
  operatorEquation.innerHTML='<span><strong>d/dx</strong> [x² + xy + y²]</span><span class="implicit-differentiation-understand__equals">=</span><span><strong>d/dx</strong> [7]</span>';
  const operatorStatus=el(this.document,'p','implicit-differentiation-understand__operator-status','The term buttons stay locked until d/dx has been applied to both equal expressions.');
  operatorStatus.setAttribute('role','status');
  operatorStatus.setAttribute('aria-live','polite');
  operatorStage.append(operatorAction,operatorEquation,operatorStatus);
  p.append(original,operatorStage);

  const terms=[['x²','2x','No dy/dx: this term depends directly on x.'],['xy','y + x dy/dx','Product rule: x·y(x), so differentiating y introduces dy/dx.'],['y²','2y dy/dx','Chain rule: the mental cue is that dy/dx “pops out”; formally it is the y=y(x) chain factor.'],['7','0','Constant derivative.']];
  const grid=el(this.document,'div','implicit-differentiation-understand__term-grid');
  const state=new Set();
  const termButtons=[];
  const unlock=el(this.document,'button','implicit-differentiation-understand__unlock','Rebuild differentiated equation');
  unlock.type='button';
  unlock.disabled=true;
  const out=el(this.document,'div','implicit-differentiation-understand__result');
  out.setAttribute('data-math-render','');

  terms.forEach(([term,deriv,why],i)=>{
   const b=el(this.document,'button','implicit-differentiation-understand__term');
   b.type='button';
   b.disabled=true;
   b.innerHTML=`<span data-math-render>${term}</span><small>Differentiate this term</small>`;
   b.addEventListener('click',()=>{
    b.disabled=true;
    b.dataset.done='true';
    b.innerHTML=`<span data-math-render>${term} → ${deriv}</span><small>${why}</small>`;
    state.add(i);
    unlock.disabled=state.size!==terms.length;
   });
   termButtons.push(b);
   grid.append(b);
  });

  operatorAction.addEventListener('click',()=>{
   operatorAction.disabled=true;
   operatorEquation.hidden=false;
   operatorStage.dataset.applied='true';
   operatorStatus.textContent='d/dx is now acting on both sides. Process every term before rebuilding the differentiated equation.';
   for(const b of termButtons)b.disabled=false;
  });

  unlock.addEventListener('click',()=>{
   if(state.size!==terms.length)return;
   out.textContent='2x + y + x dy/dx + 2y dy/dx = 0';
   out.dataset.ready='true';
   unlock.disabled=true;
   this.termWorkspaceComplete=true;
   const ready=el(this.document,'p','implicit-differentiation-understand__ready','All terms are differentiated. The separate rearrangement stage is now unlocked.');
   out.after(ready);
  });
  p.append(grid,unlock,out);
 }
 render_rearrange(){
  const p=this.panel('Now make dy/dx the subject','This algebra stage is deliberately separate from differentiation.');
  if(!this.termWorkspaceComplete){
   const locked=el(this.document,'div','implicit-differentiation-understand__rearrange-lock');
   locked.append(el(this.document,'strong','','Rearrangement is still locked.'),el(this.document,'p','','Return to the previous Understand page, apply d/dx to both sides, differentiate every term, and rebuild the complete differentiated equation first.'));
   p.append(locked);
   return;
  }
  const s=el(this.document,'div','implicit-differentiation-understand__steps');
  p.append(s);
  renderEquationSteps(s,[
   {id:'r1',kind:'setup',label:'Differentiated equation',expression:'2x + y + x dy/dx + 2y dy/dx = 0',explanation:'Every original term has already been processed.'},
   {id:'r2',kind:'working',label:'Move non-derivative terms',expression:'x dy/dx + 2y dy/dx = −2x − y',explanation:'Separate terms containing dy/dx.'},
   {id:'r3',kind:'working',label:'Factor dy/dx',expression:'(x+2y) dy/dx = −2x − y',explanation:'Treat dy/dx as the common factor.'},
   {id:'r4',kind:'result',label:'Divide',expression:'dy/dx = (−2x−y)/(x+2y)',explanation:'The calculus and algebra stages are now clearly separated.'}
  ]);
 }
}
export function createImplicitDifferentiationUnderstandExperience(host){return new ImplicitDifferentiationUnderstandExperience(host);}
