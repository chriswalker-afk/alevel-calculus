import { getClassWizModels, getClassWizSupportPack } from './classwiz-support-data.js?v=auditstep16final';

function requireElement(root,selector){
  const element=root.querySelector(selector);
  if(!element)throw new Error(`ClassWizSupportPanel is missing ${selector}`);
  return element;
}
function setSelected(buttons,dataKey,value){
  for(const button of buttons){
    const selected=button.dataset[dataKey]===value;
    button.setAttribute('aria-selected',selected?'true':'false');
    button.setAttribute('tabindex',selected?'0':'-1');
  }
}

export function createClassWizSupportPanel({element,topicId}){
  const documentRef=element?.ownerDocument??globalThis.document;
  if(!element||!documentRef)throw new Error('ClassWizSupportPanel requires a host element.');
  const models=getClassWizModels();
  const useCaseTabList=requireElement(element,'.classwiz-use-case-tabs');
  const modelTabs=Array.from(element.querySelectorAll('[data-classwiz-model]'));
  const intro=requireElement(element,'.classwiz-support-panel__intro');
  const helps=requireElement(element,'[data-classwiz-helps]');
  const example=requireElement(element,'[data-classwiz-example]');
  const radians=requireElement(element,'[data-classwiz-radians]');
  const steps=requireElement(element,'[data-classwiz-steps]');
  const doesNotReplace=requireElement(element,'[data-classwiz-does-not-replace]');
  const modelName=requireElement(element,'[data-classwiz-model-name]');

  let pack=null;
  let activeUseCaseId=null;
  let activeModelId='cw';
  let useCaseTabs=[];

  function activeUseCase(){return pack?.useCases.find((entry)=>entry.id===activeUseCaseId)??pack?.useCases[0]??null;}

  function moveTab(buttons,current,key,datasetKey,onChange){
    const index=buttons.indexOf(current);
    if(index<0)return;
    let next=index;
    if(key==='ArrowRight')next=(index+1)%buttons.length;
    if(key==='ArrowLeft')next=(index-1+buttons.length)%buttons.length;
    if(key==='Home')next=0;
    if(key==='End')next=buttons.length-1;
    if(next!==index||key==='Home'||key==='End'){
      onChange(buttons[next].dataset[datasetKey]);
      buttons[next].focus?.();
    }
  }

  function renderUseCaseTabs(){
    useCaseTabList.replaceChildren();
    useCaseTabs=[];
    for(const useCase of pack.useCases){
      const button=documentRef.createElement('button');
      button.type='button';
      button.setAttribute('role','tab');
      button.dataset.classwizUseCase=useCase.id;
      button.textContent=useCase.label;
      button.addEventListener('click',()=>setUseCase(useCase.id));
      button.addEventListener('keydown',(event)=>{
        if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
        event.preventDefault();
        moveTab(useCaseTabs,button,event.key,'classwizUseCase',setUseCase);
      });
      useCaseTabList.append(button);
      useCaseTabs.push(button);
    }
  }

  function render(){
    if(!pack)return false;
    const useCase=activeUseCase();
    const model=models[activeModelId];
    if(!useCase||!model)return false;
    intro.textContent=pack.introduction;
    setSelected(useCaseTabs,'classwizUseCase',useCase.id);
    setSelected(modelTabs,'classwizModel',activeModelId);
    helps.textContent=useCase.helpsWith;
    example.textContent=useCase.example;
    radians.hidden=!useCase.radiansRequired;
    radians.textContent=useCase.radiansReminder;
    doesNotReplace.textContent=useCase.doesNotReplace;
    modelName.textContent=model.label;
    steps.replaceChildren();
    for(const [index,step] of useCase.models[activeModelId].entries()){
      const row=documentRef.createElement('li');row.className='classwiz-step';
      const number=documentRef.createElement('span');number.className='classwiz-step__number';number.textContent=String(index+1);
      const copy=documentRef.createElement('span');copy.className='classwiz-step__copy';
      const label=documentRef.createElement('strong');label.textContent=step.label;
      const text=documentRef.createElement('span');text.textContent=step.text;
      copy.append(label,text);row.append(number,copy);steps.append(row);
    }
    return true;
  }

  function setUseCase(id){
    if(!pack?.useCases.some((entry)=>entry.id===id))return false;
    activeUseCaseId=id;render();return true;
  }
  function setModel(id){
    if(!models[id])return false;
    activeModelId=id;render();return true;
  }
  function setTopic(id){
    const next=getClassWizSupportPack(id);
    if(!next)return false;
    pack=next;
    activeUseCaseId=pack.defaultUseCaseId??pack.useCases[0]?.id??null;
    activeModelId=pack.defaultModelId??activeModelId;
    renderUseCaseTabs();
    render();
    return true;
  }

  for(const button of modelTabs){
    button.addEventListener('click',()=>setModel(button.dataset.classwizModel));
    button.addEventListener('keydown',(event)=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();
      moveTab(modelTabs,button,event.key,'classwizModel',setModel);
    });
  }

  if(!setTopic(topicId))return null;

  return Object.freeze({
    render,setUseCase,setModel,setTopic,
    getState(){return Object.freeze({topicId:pack?.topicId??null,activeUseCaseId,activeModelId});}
  });
}
