import { renderMathElement } from './math-renderer.js';
const freeze=Object.freeze;
export const STRUCTURE_ROLES=freeze({first:'First / u',second:'Second / v',outer:'Outside',inner:'Inside'});
function el(d,t,c='',x=''){const n=d.createElement(t);if(c)n.className=c;if(x!==undefined&&x!=='')n.textContent=x;return n;}
export function structureToken(document,{text,role,label=STRUCTURE_ROLES[role]??role}){
 const wrap=el(document,'span','structure-token');wrap.dataset.structureRole=role;
 const badge=el(document,'span','structure-token__label',label);const value=el(document,'span','structure-token__value',text);
 renderMathElement(value,{source:text}); wrap.append(badge,value);return wrap;
}
export function applyStructuredExpression(host,{prefix='',parts=[],suffix='',ariaLabel=''}){
 if(!host)throw new Error('StructureHighlighter requires an expression host.');
 const d=host.ownerDocument||document;host.replaceChildren();host.dataset.structureExpression='true';if(ariaLabel)host.setAttribute('aria-label',ariaLabel);
 if(prefix){const n=el(d,'span','structure-line__plain',prefix);renderMathElement(n,{source:prefix});host.append(n);}
 for(const part of parts){if(part.role)host.append(structureToken(d,part));else{const n=el(d,'span','structure-line__plain',part.text);renderMathElement(n,{source:part.text});host.append(n);}}
 if(suffix){const n=el(d,'span','structure-line__plain',suffix);renderMathElement(n,{source:suffix});host.append(n);}return host;
}
export function structureLegend(document,roles){const box=el(document,'div','structure-legend');for(const role of roles){const item=el(document,'span','structure-legend__item');item.dataset.structureRole=role;item.append(el(document,'span','structure-legend__swatch',''),el(document,'span','',STRUCTURE_ROLES[role]??role));box.append(item);}return box;}
