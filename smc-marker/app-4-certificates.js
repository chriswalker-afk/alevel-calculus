/* Certificate generator - all personal data remains in the browser. */
'use strict';

const CERTIFICATE_TEMPLATES = {
  'participation': 'certificates/templates/participation.svg',
  'silver': 'certificates/templates/silver.svg',
  'gold': 'certificates/templates/gold.svg',
  'best-in-year': 'certificates/templates/best-in-year.svg',
  'best-in-school': 'certificates/templates/best-in-school.svg'
};
const CERTIFICATE_LABELS = {
  'participation': 'Participation',
  'silver': 'Silver',
  'gold': 'Gold',
  'best-in-year': 'Best in Year',
  'best-in-school': 'Best in School'
};
const certState = {templates:{}, batch:[], currentSvg:'', currentName:''};

window.addEventListener('DOMContentLoaded', initCertificates);

async function initCertificates(){
  if(!document.getElementById('certificateSection')) return;
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset()*60000).toISOString().slice(0,10);
  el('certBatchDate').value = localDate;
  el('certIndividualDate').value = localDate;

  el('certCandidateSelect').addEventListener('focus', refreshCertificateCandidates);
  el('certCandidateSelect').addEventListener('change', populateCertificateCandidate);
  el('certPreviewSingle').addEventListener('click', previewIndividualCertificate);
  el('certDownloadSvg').addEventListener('click', downloadIndividualCertificate);
  el('certPrintSingle').addEventListener('click', printIndividualCertificate);
  el('certBuildBatch').addEventListener('click', buildCertificateBatch);
  el('certPrintBatch').addEventListener('click', printCertificateBatch);
  el('certCutoffMode').addEventListener('change', updateCertificateCutoffLabels);

  ['certCutoffMode','certMaxScore','certSilverCutoff','certGoldCutoff','certParticipationRule',
   'certBestYear','certBestSchool','certShowScore','certBatchDate','certSignatory']
    .forEach(id=>el(id).addEventListener('input', invalidateCertificateBatch));

  await loadCertificateTemplates();
  refreshCertificateCandidates();
  updateCertificateCutoffLabels();
}

async function loadCertificateTemplates(){
  const status = el('certificateStatus');
  try{
    status.textContent='Loading templates…';
    const entries = await Promise.all(Object.entries(CERTIFICATE_TEMPLATES).map(async ([key,path])=>{
      const response = await fetch(path, {cache:'no-store'});
      if(!response.ok) throw new Error('Could not load '+path);
      return [key, await response.text()];
    }));
    certState.templates = Object.fromEntries(entries);
    status.textContent='Templates ready';
    status.className='status-pill good';
  }catch(err){
    console.error(err);
    status.textContent='Template load failed';
    status.className='status-pill bad';
  }
}

function updateCertificateCutoffLabels(){
  const pct = el('certCutoffMode').value==='percentage';
  el('certSilverCutoff').placeholder = pct ? 'e.g. 65' : 'e.g. 80';
  el('certGoldCutoff').placeholder = pct ? 'e.g. 80' : 'e.g. 100';
  el('certMaxScoreWrap').style.opacity = pct ? '1' : '.72';
}

function invalidateCertificateBatch(){
  if(!certState.batch.length) return;
  certState.batch=[];
  el('certPrintBatch').disabled=true;
  el('certBatchSummary').textContent='Settings changed - rebuild the batch before printing.';
}

function refreshCertificateCandidates(){
  const select=el('certCandidateSelect');
  if(!select) return;
  const previous=select.value;
  const records=new Map();

  state.roster.forEach((p,id)=>records.set(id,{
    id,
    name:p.name||'',
    year:p.year||'',
    school:p.school||'',
    score:''
  }));

  state.results.forEach(r=>{
    if(!r.candidateId) return;
    const p=state.roster.get(r.candidateId)||{};
    const s=scoreResult(r);
    const existing=records.get(r.candidateId)||{id:r.candidateId,name:'',year:'',school:'',score:''};
    existing.name=p.name||existing.name;
    existing.year=p.year||existing.year;
    existing.school=p.school||existing.school;
    if(s.score!==null) existing.score=s.score;
    records.set(r.candidateId,existing);
  });

  const options=[...records.values()].sort((a,b)=>Number(a.id)-Number(b.id));
  select.innerHTML='<option value="">Manual entry</option>';
  options.forEach(p=>{
    const option=document.createElement('option');
    option.value=p.id;
    option.textContent=`${p.id} - ${p.name||'Unnamed candidate'}${p.score!==''?' · '+p.score+' marks':''}`;
    option.dataset.name=p.name;
    option.dataset.year=p.year;
    option.dataset.school=p.school;
    option.dataset.score=p.score;
    select.appendChild(option);
  });
  if([...select.options].some(o=>o.value===previous)) select.value=previous;
}

function populateCertificateCandidate(){
  const select=el('certCandidateSelect'), option=select.selectedOptions[0];
  if(!select.value || !option) return;
  el('certName').value=option.dataset.name||'';
  el('certYear').value=option.dataset.year||'';
  el('certSchool').value=option.dataset.school||'';
  el('certScore').value=option.dataset.score||'';
}

function xmlEscape(value){
  return String(value??'').replace(/[&<>"']/g,ch=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'
  }[ch]));
}

function displayDate(value){
  if(!value) return '';
  const d=new Date(value+'T12:00:00');
  if(Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric'}).format(d);
}

function certificateMaxScore(){
  const m=Number(el('certMaxScore').value);
  return Number.isFinite(m)&&m>0?m:125;
}

function scoreLine(score, show=true){
  if(!show || score==='' || score===null || score===undefined || !Number.isFinite(Number(score))) return '';
  const max=certificateMaxScore(), value=Number(score), pct=100*value/max;
  return `Score: ${formatNumber(value)} / ${formatNumber(max)} (${pct.toFixed(1)}%)`;
}

function formatNumber(n){
  return Number.isInteger(Number(n))?String(Number(n)):Number(n).toFixed(1).replace(/\.0$/,'');
}

function detailForCertificate(type, data){
  switch(type){
    case 'participation':
      return 'for participating in the Senior Maths Competition 2026';
    case 'silver':
      return 'for achieving a Silver Award';
    case 'gold':
      return 'for achieving a Gold Award';
    case 'best-in-year':
      return data.year ? `for achieving the highest score in ${data.year}` : 'for achieving the highest score in the year group';
    case 'best-in-school':
      return data.school ? 'for achieving the highest score in the school' : 'for achieving the highest score in the school';
    default:
      return '';
  }
}

function renderCertificate(type,data){
  let svg=certState.templates[type];
  if(!svg) throw new Error('Certificate template is not ready.');
  const schoolLine=[data.school,data.year].filter(Boolean).join('  •  ');
  const replacements={
    '{{NAME}}':data.name||'',
    '{{DETAIL}}':detailForCertificate(type,data),
    '{{SCHOOL}}':schoolLine,
    '{{SCORE_LINE}}':scoreLine(data.score,data.showScore),
    '{{DATE}}':displayDate(data.date),
    '{{SIGNATORY}}':data.signatory||'Competition Organiser'
  };
  Object.entries(replacements).forEach(([token,value])=>{svg=svg.split(token).join(xmlEscape(value))});

  const length=String(data.name||'').length;
  const size=length>52?21:length>42?25:length>32?30:38;
  svg=svg.replace(/(<text x="561\.5" y="391"[^>]*font-size=")38("[^>]*>)/, `$1${size}$2`);
  return svg;
}

function setCertificatePreview(svg){
  certState.currentSvg=svg;
  el('certificatePreview').innerHTML=svg;
  el('certDownloadSvg').disabled=false;
  el('certPrintSingle').disabled=false;
}

function individualCertificateData(){
  return {
    name:el('certName').value.trim(),
    year:el('certYear').value.trim(),
    school:el('certSchool').value.trim(),
    score:el('certScore').value===''?'':Number(el('certScore').value),
    date:el('certIndividualDate').value,
    signatory:el('certSignatory').value.trim()||'Competition Organiser',
    showScore:el('certScore').value!==''
  };
}

function previewIndividualCertificate(){
  const type=el('certAward').value, data=individualCertificateData();
  if(!data.name){alert('Enter the student name before generating a certificate.');return}
  try{
    const svg=renderCertificate(type,data);
    certState.currentName=`${data.name} - ${CERTIFICATE_LABELS[type]}`;
    setCertificatePreview(svg);
    el('certificateStatus').textContent='Individual preview ready';
    el('certificateStatus').className='status-pill good';
  }catch(err){alert(err.message)}
}

function downloadIndividualCertificate(){
  if(!certState.currentSvg) return;
  const blob=new Blob([certState.currentSvg],{type:'image/svg+xml;charset=utf-8'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=safeFilename(certState.currentName||'Certificate')+'.svg';
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1500);
}

function printIndividualCertificate(){
  if(!certState.currentSvg) return;
  openCertificatePrintWindow([certState.currentSvg], certState.currentName||'Certificate');
}

function collectCertificateCandidates(){
  const skipped=[];
  const candidates=[];
  state.results.forEach(r=>{
    if(!r.candidateId || r.status==='rescan') return;
    const s=scoreResult(r);
    if(s.score===null) return;
    const p=state.roster.get(r.candidateId)||{};
    if(!String(p.name||'').trim()){
      skipped.push(r.candidateId);
      return;
    }
    candidates.push({
      candidateId:r.candidateId,
      name:String(p.name).trim(),
      year:String(p.year||'').trim(),
      school:String(p.school||'').trim(),
      score:s.score,
      percentage:100*s.score/certificateMaxScore()
    });
  });
  return {candidates,skipped};
}

function buildCertificateBatch(){
  if(Object.keys(certState.templates).length!==5){alert('Certificate templates are still loading.');return}
  if(!state.results.length){alert('Mark the answer sheets first, or use the Individual certificate panel.');return}

  const mode=el('certCutoffMode').value;
  const silver=Number(el('certSilverCutoff').value), gold=Number(el('certGoldCutoff').value);
  if(!Number.isFinite(silver)||!Number.isFinite(gold)){
    alert('Enter both the Silver and Gold cut-offs.');
    return;
  }
  if(gold<silver){alert('The Gold cut-off must be at least as high as the Silver cut-off.');return}
  if(mode==='percentage' && (silver<0||gold>100)){
    alert('Percentage cut-offs should be between 0 and 100.');
    return;
  }
  if(certificateMaxScore()<=0){alert('Enter a positive maximum score.');return}

  const {candidates,skipped}=collectCertificateCandidates();
  if(!candidates.length){
    alert('No completed results with matching student names were found. Load a roster with Candidate ID and Name, or generate an individual certificate manually.');
    return;
  }

  const participationRule=el('certParticipationRule').value;
  const showScore=el('certShowScore').checked;
  const common={date:el('certBatchDate').value,signatory:el('certSignatory').value.trim()||'Competition Organiser',showScore};
  const certs=[];

  candidates.forEach(c=>{
    const value=mode==='percentage'?c.percentage:c.score;
    if(participationRule==='all') certs.push({type:'participation',data:{...c,...common}});
    if(value>=gold) certs.push({type:'gold',data:{...c,...common}});
    else if(value>=silver) certs.push({type:'silver',data:{...c,...common}});
    else if(participationRule==='below') certs.push({type:'participation',data:{...c,...common}});
  });

  if(el('certBestYear').checked){
    groupedWinners(candidates,'year').forEach(c=>certs.push({type:'best-in-year',data:{...c,...common}}));
  }
  if(el('certBestSchool').checked){
    groupedWinners(candidates,'school').forEach(c=>certs.push({type:'best-in-school',data:{...c,...common}}));
  }

  const order={'gold':1,'silver':2,'participation':3,'best-in-year':4,'best-in-school':5};
  certs.sort((a,b)=>Number(a.data.candidateId)-Number(b.data.candidateId) || order[a.type]-order[b.type]);

  certState.batch=certs.map(c=>({...c,svg:renderCertificate(c.type,c.data)}));
  el('certPrintBatch').disabled=certState.batch.length===0;

  const counts={};
  certState.batch.forEach(c=>counts[c.type]=(counts[c.type]||0)+1);
  const parts=Object.entries(counts).map(([type,n])=>`${CERTIFICATE_LABELS[type]}: ${n}`);
  let summary=`${certState.batch.length} certificates built from ${candidates.length} completed candidates. ${parts.join(' · ')}.`;
  if(skipped.length) summary+=` Skipped ${skipped.length} result(s) with no roster name: ${skipped.join(', ')}.`;
  summary+=' Tied top scores receive the same Best in Year / Best in School award.';
  el('certBatchSummary').textContent=summary;
  el('certificateStatus').textContent='Batch ready';
  el('certificateStatus').className='status-pill good';

  if(certState.batch[0]){
    el('certificatePreview').innerHTML=certState.batch[0].svg;
  }
}

function groupedWinners(candidates,field){
  const groups=new Map();
  candidates.forEach(c=>{
    const raw=String(c[field]||'').trim();
    if(!raw) return;
    const key=raw.toLocaleLowerCase();
    if(!groups.has(key)) groups.set(key,[]);
    groups.get(key).push(c);
  });
  const winners=[];
  groups.forEach(list=>{
    const max=Math.max(...list.map(c=>c.score));
    list.filter(c=>c.score===max).forEach(c=>winners.push(c));
  });
  return winners;
}

function printCertificateBatch(){
  if(!certState.batch.length) return;
  openCertificatePrintWindow(certState.batch.map(c=>c.svg), 'Senior Maths Competition 2026 Certificates');
}

function openCertificatePrintWindow(svgs,title){
  const w=window.open('','_blank');
  if(!w){alert('The browser blocked the print window. Allow pop-ups for this site and try again.');return}
  const pages=svgs.map(svg=>`<section class="certificate-page">${svg}</section>`).join('');
  w.document.open();
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${htmlEscape(title)}</title>
    <style>
      @page{size:A4 landscape;margin:0}
      html,body{margin:0;padding:0;background:white}
      .certificate-page{width:297mm;height:210mm;display:flex;align-items:center;justify-content:center;break-after:page;page-break-after:always;overflow:hidden}
      .certificate-page:last-child{break-after:auto;page-break-after:auto}
      .certificate-page svg{width:297mm;height:210mm;display:block}
      @media screen{body{background:#dfe4e7}.certificate-page{margin:12px auto;background:white;box-shadow:0 4px 20px rgba(0,0,0,.18)}}
    </style></head><body>${pages}<script>window.addEventListener('load',()=>setTimeout(()=>window.print(),250));<\/script></body></html>`);
  w.document.close();
}

function safeFilename(value){
  return String(value||'Certificate').replace(/[\\/:*?"<>|]+/g,'-').replace(/\s+/g,' ').trim();
}
function htmlEscape(value){
  return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
