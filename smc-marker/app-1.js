/* Reusable Senior Maths Competition browser OMR marker */
'use strict';

const APP={
  competitionName:'Senior Maths Competition',
  defaultYear:2026,
  form:'A',
  candidateMin:1,
  candidateMax:140,
  pageWmm:210,
  pageHmm:297,
  pxPerMm:4,
  qr:{x:164,y:252,w:25,h:25},
  fiducials:{
    TL:{x:10,y:281.5,size:5.5},
    TR:{x:194.5,y:281.5,size:5.5},
    BR:{x:194.5,y:10,size:5.5},
    BL:{x:10,y:10,size:5.5}
  },
  thresholds:{innerRadiusFraction:.66,pixelDark:205,blank:.075,marked:.22,ambiguityDelta:.075,moderate:.13,geometry:.035}
};

APP.outW=Math.round(APP.pageWmm*APP.pxPerMm);
APP.outH=Math.round(APP.pageHmm*APP.pxPerMm);
APP.bubbles=buildBubbleTemplate();

const state={
  key:null,
  scoring:{start:25,correct:4,incorrect:-1,blank:0},
  competition:{name:APP.competitionName,year:APP.defaultYear},
  roster:new Map(),
  scans:[],
  results:[],
  reviewLog:[],
  engineReady:false,
  processing:false
};

const el=id=>document.getElementById(id);
window.addEventListener('DOMContentLoaded',init);

function init(){
  if(window.pdfjsLib) pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  loadCompetitionSettings();
  bindUI();
  applyCompetitionSettings(false);
  refreshKeyFromText();

  const missing=[];
  if(!window.pdfjsLib) missing.push('PDF.js');
  if(!window.jsQR) missing.push('QR reader');
  if(!window.XLSX) missing.push('Excel export');

  if(missing.length){
    state.engineReady=false;
    el('runtimeStatus').textContent='Could not load: '+missing.join(', ');
    el('runtimeStatus').style.color='#9e2e2e';
  }else{
    state.engineReady=true;
    el('runtimeStatus').textContent='Marking engine ready';
    el('runtimeStatus').style.color='#1f6a48';
  }
  updateMarkButton();
}

function bindUI(){
  el('answerKeyText').addEventListener('input',refreshKeyFromText);
  el('answerKeyFile').addEventListener('change',handleKeyFile);
  ['scoreStart','scoreCorrect','scoreIncorrect','scoreBlank'].forEach(id=>el(id).addEventListener('input',refreshScoring));
  el('rosterFile').addEventListener('change',handleRosterFile);
  el('competitionName').addEventListener('change',()=>applyCompetitionSettings(true));
  el('competitionYear').addEventListener('change',()=>applyCompetitionSettings(true));
  el('scanFiles').addEventListener('change',e=>setScanFiles([...e.target.files]));

  const dz=el('dropZone');
  ['dragenter','dragover'].forEach(t=>dz.addEventListener(t,e=>{e.preventDefault();dz.classList.add('dragover')}));
  ['dragleave','drop'].forEach(t=>dz.addEventListener(t,e=>{e.preventDefault();dz.classList.remove('dragover')}));
  dz.addEventListener('drop',e=>setScanFiles([...e.dataTransfer.files]));

  el('markButton').addEventListener('click',processAll);
  el('clearButton').addEventListener('click',clearAll);
  el('exportXlsx').addEventListener('click',exportExcel);
  el('exportCsv').addEventListener('click',exportCsv);
}

function loadCompetitionSettings(){
  let saved=null;
  try{saved=JSON.parse(localStorage.getItem('smcMarkerCompetitionSettings')||'null')}catch(_){}
  const name=String(saved?.name||APP.competitionName).trim()||APP.competitionName;
  const year=validCompetitionYear(saved?.year)?Number(saved.year):APP.defaultYear;
  if(el('competitionName')) el('competitionName').value=name;
  if(el('competitionYear')) el('competitionYear').value=year;
}

function validCompetitionYear(value){
  const y=Number(value);
  return Number.isInteger(y)&&y>=2000&&y<=2099;
}

function applyCompetitionSettings(persist=true){
  const name=String(el('competitionName')?.value||APP.competitionName).trim()||APP.competitionName;
  const year=validCompetitionYear(el('competitionYear')?.value)?Number(el('competitionYear').value):APP.defaultYear;

  state.competition={name,year};
  if(el('competitionName')) el('competitionName').value=name;
  if(el('competitionYear')) el('competitionYear').value=year;

  document.querySelectorAll('[data-competition-name]').forEach(node=>node.textContent=name);
  document.querySelectorAll('[data-competition-year]').forEach(node=>node.textContent=String(year));
  document.title=`${name} ${year} - OMR Marker`;

  if(persist){
    try{localStorage.setItem('smcMarkerCompetitionSettings',JSON.stringify(state.competition))}catch(_){}
  }
  if(typeof invalidateCertificateBatch==='function') invalidateCertificateBatch();
  if(typeof refreshCertificateCandidates==='function') refreshCertificateCandidates();
}

function competitionLabel(){
  return `${state.competition.name} ${state.competition.year}`;
}

function competitionFileStem(){
  return competitionLabel().replace(/[^A-Za-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
}

function applyCompetitionFromMetadata(meta){
  if(!meta||typeof meta!=='object') return;
  let name='';
  let year=null;

  if(meta.competition_name) name=String(meta.competition_name).trim();
  if(validCompetitionYear(meta.year)) year=Number(meta.year);
  else if(validCompetitionYear(meta.competition_year)) year=Number(meta.competition_year);

  if(typeof meta.competition==='string'){
    const label=meta.competition.trim();
    const yearMatch=label.match(/\b(20\d{2})\b/);
    if(year===null&&yearMatch) year=Number(yearMatch[1]);
    if(!name){
      name=yearMatch?label.replace(yearMatch[0],'').replace(/\s{2,}/g,' ').trim():label;
    }
  }

  if(name) el('competitionName').value=name;
  if(validCompetitionYear(year)) el('competitionYear').value=year;
  if(name||validCompetitionYear(year)) applyCompetitionSettings(true);
}

function buildBubbleTemplate(){
  const b={};
  for(let q=1;q<=25;q++){
    const left=q<=13,row=left?q-1:q-14,baseX=left?47.5:135.5,y=178.5-9.8*row;
    b[q]={};
    ['A','B','C','D','E'].forEach((c,i)=>b[q][c]={x:baseX+12*i,y,r:2.55});
  }
  return b;
}

function parseKey(t){
  const a=String(t||'').toUpperCase().match(/[A-E]/g)||[];
  return a.length===25?Object.fromEntries(a.map((v,i)=>[i+1,v])):null;
}

function refreshKeyFromText(){
  state.key=parseKey(el('answerKeyText').value);
  const s=el('keyStatus');
  if(state.key){
    s.textContent='25 answers loaded';
    s.className='status-pill good';
  }else{
    const n=(el('answerKeyText').value.toUpperCase().match(/[A-E]/g)||[]).length;
    s.textContent=n?`${n}/25 answers`:'No key loaded';
    s.className=n?'status-pill warning':'status-pill neutral';
  }
  updateMarkButton();
}

async function handleKeyFile(e){
  const f=e.target.files[0];
  if(!f)return;
  try{
    const d=JSON.parse(await f.text()),a=d.answers||d;
    const seq=Array.from({length:25},(_,i)=>String(a[String(i+1)]||a[i+1]||'').toUpperCase());
    if(!seq.every(x=>/^[A-E]$/.test(x))) throw new Error('JSON must contain answers 1-25 using A-E.');

    el('answerKeyText').value=seq.join(' ');
    if(d.scoring){
      if(Number.isFinite(Number(d.scoring.starting_score))) el('scoreStart').value=d.scoring.starting_score;
      if(Number.isFinite(Number(d.scoring.correct))) el('scoreCorrect').value=d.scoring.correct;
      if(Number.isFinite(Number(d.scoring.incorrect))) el('scoreIncorrect').value=d.scoring.incorrect;
      if(Number.isFinite(Number(d.scoring.blank))) el('scoreBlank').value=d.scoring.blank;
    }
    applyCompetitionFromMetadata(d);
    refreshScoring();
    refreshKeyFromText();
  }catch(err){
    alert(`Could not load answer key: ${err.message}`);
  }
}

function refreshScoring(){
  state.scoring={
    start:Number(el('scoreStart').value||0),
    correct:Number(el('scoreCorrect').value||0),
    incorrect:Number(el('scoreIncorrect').value||0),
    blank:Number(el('scoreBlank').value||0)
  };
  renderResults();
}

async function handleRosterFile(e){
  const f=e.target.files[0];
  if(!f)return;
  try{
    const wb=XLSX.read(await f.arrayBuffer(),{type:'array'});
    const ws=wb.Sheets[wb.SheetNames[0]];
    const rows=XLSX.utils.sheet_to_json(ws,{defval:''});
    const map=new Map();

    rows.forEach(row=>{
      const n={};
      Object.entries(row).forEach(([k,v])=>n[String(k).trim().toLowerCase().replace(/_/g,' ')]=v);
      const id=normalizeId(pick(n,['candidate id','candidate','candidate number','id','number']));
      if(!id)return;
      map.set(id,{
        candidateId:id,
        name:String(pick(n,['name','student name','student'])||'').trim(),
        year:String(pick(n,['year','year group','grade'])||'').trim(),
        school:String(pick(n,['school','school name'])||'').trim()
      });
    });

    state.roster=map;
    el('rosterStatus').textContent=`${map.size} candidates loaded`;
    el('rosterStatus').className='status-pill good';
    renderResults();
    if(typeof refreshCertificateCandidates==='function') refreshCertificateCandidates();
  }catch(err){
    alert(`Could not read roster: ${err.message}`);
  }
}

function pick(o,k){
  for(const x of k) if(o[x]!==undefined&&o[x]!=='') return o[x];
  return '';
}

function normalizeId(v){
  const m=String(v??'').match(/\d+/);
  return m?String(Number(m[0])).padStart(3,'0'):'';
}

function setScanFiles(files){
  state.scans=files.filter(f=>/\.(pdf|png|jpe?g)$/i.test(f.name));
  const l=el('scanList');
  l.innerHTML='';
  state.scans.forEach(f=>{
    const c=document.createElement('span');
    c.className='file-chip';
    c.textContent=`${f.name} · ${formatBytes(f.size)}`;
    l.appendChild(c);
  });
  el('clearButton').disabled=state.scans.length===0&&state.results.length===0;
  updateMarkButton();
}

function updateMarkButton(){
  el('markButton').disabled=!(state.engineReady&&state.key&&state.scans.length&&!state.processing);
}

function clearAll(){
  state.scans=[];
  state.results=[];
  state.reviewLog=[];
  el('scanFiles').value='';
  el('scanList').innerHTML='';
  el('resultsSection').hidden=true;
  el('reviewSection').hidden=true;
  el('progressWrap').hidden=true;
  el('clearButton').disabled=true;
  updateMarkButton();
  if(typeof refreshCertificateCandidates==='function') refreshCertificateCandidates();
}
