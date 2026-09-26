function freeze(value){return Object.freeze(value);}
function finite(value,label){const n=Number(value);if(!Number.isFinite(n))throw new Error(`${label} must be finite.`);return n;}
function el(doc,name,cls='',text=''){const node=doc.createElement(name);if(cls)node.className=cls;if(text)node.textContent=text;return node;}
export function defineIntervalSegments(boundaries,{leftInfinity=true,rightInfinity=true}={}){
  if(!Array.isArray(boundaries)||boundaries.length<1)throw new Error('IntervalSelectionOverlay requires at least one boundary.');
  const sorted=[...boundaries].map((v)=>finite(v,'Interval boundary')).sort((a,b)=>a-b);
  if(new Set(sorted).size!==sorted.length)throw new Error('Interval boundaries must be unique.');
  const points=[leftInfinity?-Infinity:sorted[0],...sorted,rightInfinity?Infinity:sorted.at(-1)];
  const segments=[];
  for(let i=0;i<points.length-1;i++){
    const a=points[i],b=points[i+1];
    if(a===b)continue;
    const label=`${a===-Infinity?'−∞':a} < x < ${b===Infinity?'∞':b}`;
    const notation=`(${a===-Infinity?'−∞':a}, ${b===Infinity?'∞':b})`;
    segments.push(freeze({id:`interval-${i}`,a,b,label,notation}));
  }
  return freeze(segments);
}
export function sameIntervalSelection(selectedIds,expectedIds){
  const a=[...new Set(selectedIds)].sort();const b=[...new Set(expectedIds)].sort();
  return a.length===b.length&&a.every((v,i)=>v===b[i]);
}
export class IntervalSelectionOverlay{
  constructor(host,{segments,expectedIds=[],prompt='Select the interval(s).',onChange=()=>{}}={}){
    if(!host?.ownerDocument)throw new Error('IntervalSelectionOverlay requires a DOM host.');
    if(!Array.isArray(segments)||!segments.length)throw new Error('IntervalSelectionOverlay requires interval segments.');
    this.host=host;this.document=host.ownerDocument;this.segments=segments;this.expectedIds=[...expectedIds];this.selected=new Set();this.onChange=onChange;this.#render(prompt);
  }
  destroy(){this.host.replaceChildren();this.host.classList.remove('interval-selection-overlay');}
  getSelection(){return [...this.selected];}
  isCorrect(){return sameIntervalSelection(this.getSelection(),this.expectedIds);}
  clear(){this.selected.clear();this.#sync();this.#emit();}
  setExpected(expectedIds){this.expectedIds=[...expectedIds];this.#sync();}
  #render(prompt){
    this.host.classList.add('interval-selection-overlay');
    this.host.setAttribute('aria-label','Interval selection');
    const lead=el(this.document,'p','interval-selection-overlay__prompt',prompt);
    const track=el(this.document,'div','interval-selection-overlay__track');track.setAttribute('role','group');
    this.buttons=this.segments.map((segment)=>{
      const button=el(this.document,'button','interval-selection-overlay__segment',segment.notation);button.type='button';button.dataset.intervalId=segment.id;button.setAttribute('aria-pressed','false');button.setAttribute('aria-label',`Select interval ${segment.label}`);
      button.addEventListener('click',()=>{this.selected.has(segment.id)?this.selected.delete(segment.id):this.selected.add(segment.id);this.#sync();this.#emit();});
      track.append(button);return button;
    });
    this.status=el(this.document,'div','interval-selection-overlay__status','No interval selected.');this.status.setAttribute('role','status');
    this.host.replaceChildren(lead,track,this.status);
  }
  #sync(){for(const button of this.buttons){const selected=this.selected.has(button.dataset.intervalId);button.setAttribute('aria-pressed',String(selected));button.classList.toggle('is-selected',selected);}const selected=this.segments.filter(s=>this.selected.has(s.id));this.status.textContent=selected.length?`Selected: ${selected.map(s=>s.notation).join(' ∪ ')}`:'No interval selected.';}
  #emit(){this.onChange({selectedIds:this.getSelection(),correct:this.isCorrect(),segments:this.segments});}
}
export function createIntervalSelectionOverlay(host,options){return new IntervalSelectionOverlay(host,options);}
