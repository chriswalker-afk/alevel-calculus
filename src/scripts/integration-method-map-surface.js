import {
  INTEGRATION_METHOD_MAP_BRANCHES,
  INTEGRATION_METHOD_MAP_MESSAGE,
  isIntegrationMethodMapContext
} from './integration-method-map.js?v=auditstep14';

const el=(d,n,c='',t='')=>{const x=d.createElement(n);if(c)x.className=c;if(t)x.textContent=t;return x;};

export class IntegrationMethodMapSurface{
 constructor({documentRef=globalThis.document,triggerHost,onNavigate=()=>false}={}){
  if(!documentRef||!triggerHost)throw new Error('IntegrationMethodMapSurface requires a document and trigger host.');
  this.document=documentRef;
  this.onNavigate=onNavigate;
  this.trigger=el(this.document,'button','integration-method-map-trigger','Integration method map');
  this.trigger.type='button';
  this.trigger.hidden=true;
  this.trigger.setAttribute('aria-haspopup','dialog');
  this.dialog=el(this.document,'dialog','integration-method-map-dialog');
  this.dialog.setAttribute('aria-label','Integration method decision map');
  this.dialogHost=el(this.document,'div','integration-method-map');
  this.dialog.append(this.dialogHost);
  const helpTrigger=triggerHost.querySelector('[data-help-drawer-trigger]');
  triggerHost.insertBefore(this.trigger,helpTrigger??null);
  this.document.body.append(this.dialog);
  this.trigger.addEventListener('click',()=>this.open());
  this.dialog.addEventListener('click',event=>{if(event.target===this.dialog)this.close();});
  this.dialog.addEventListener('cancel',event=>{event.preventDefault();this.close();});
  this.render();
 }
 setContext({topicId,activityId=null}={}){
  const available=isIntegrationMethodMapContext(topicId);
  this.trigger.hidden=!available;
  this.trigger.dataset.currentTopic=topicId??'';
  this.trigger.dataset.methodSelection=String(activityId?.endsWith(':method-only')||activityId?.endsWith(':which-method-first'));
  if(!available&&this.dialog.open)this.close();
 }
 open(){
  this.render();
  this.trigger.setAttribute('aria-expanded','true');
  if(typeof this.dialog.showModal==='function')this.dialog.showModal();else this.dialog.setAttribute('open','');
  this.dialog.querySelector('[data-integration-map-close]')?.focus();
 }
 close(){
  this.trigger.setAttribute('aria-expanded','false');
  if(typeof this.dialog.close==='function'&&this.dialog.open)this.dialog.close();else this.dialog.removeAttribute('open');
  this.trigger.focus?.({preventScroll:true});
 }
 render(){
  const header=el(this.document,'header','integration-method-map__header');
  const identity=el(this.document,'div','integration-method-map__identity');
  identity.append(el(this.document,'span','integration-method-map__eyebrow','One canonical route'),el(this.document,'h2','',INTEGRATION_METHOD_MAP_MESSAGE.title),el(this.document,'p','',INTEGRATION_METHOD_MAP_MESSAGE.differentiation),el(this.document,'p','integration-method-map__contrast',INTEGRATION_METHOD_MAP_MESSAGE.integration));
  const close=el(this.document,'button','integration-method-map__close','Close');
  close.type='button';close.dataset.integrationMapClose='';close.addEventListener('click',()=>this.close());
  header.append(identity,close);

  const flow=el(this.document,'ol','integration-method-map__flow');
  flow.setAttribute('aria-label','Integration method decision order');
  INTEGRATION_METHOD_MAP_BRANCHES.forEach((branch,index)=>{
   const item=el(this.document,'li',`integration-method-map__branch${branch.late?' integration-method-map__branch--late':''}`);
   item.dataset.integrationMethodMapBranch=branch.id;
   const number=el(this.document,'span','integration-method-map__number',String(branch.order));
   const copy=el(this.document,'div','integration-method-map__copy');
   const heading=el(this.document,'div','integration-method-map__branch-heading');
   heading.append(el(this.document,'strong','',branch.label),branch.late?el(this.document,'span','integration-method-map__late-badge','Late option'):el(this.document,'span'));
   copy.append(heading,el(this.document,'p','integration-method-map__question',branch.question),el(this.document,'p','integration-method-map__cue',branch.cue));
   const links=el(this.document,'div','integration-method-map__links');
   for(const target of branch.targets){
    const button=el(this.document,'button','integration-method-map__link',target.label);
    button.type='button';
    button.dataset.integrationMapTarget=target.activityId;
    button.addEventListener('click',()=>{const moved=this.onNavigate(target);if(moved!==false)this.close();});
    links.append(button);
   }
   copy.append(links);
   item.append(number,copy);
   flow.append(item);
   if(index<INTEGRATION_METHOD_MAP_BRANCHES.length-1){
    const arrow=el(this.document,'li','integration-method-map__arrow','↓ if not yet');
    arrow.setAttribute('aria-hidden','true');
    flow.append(arrow);
   }
  });

  const footer=el(this.document,'footer','integration-method-map__footer');
  footer.append(el(this.document,'strong','','Especially before parts:'),el(this.document,'span','','Do not use “product present → parts”. Reach integration by parts only after the earlier structural routes have been checked.'));
  this.dialogHost.replaceChildren(header,flow,footer);
 }
 destroy(){this.trigger.remove();if(this.dialog.open)this.dialog.close();this.dialog.remove();}
}
export function createIntegrationMethodMapSurface(options){return new IntegrationMethodMapSurface(options);}
