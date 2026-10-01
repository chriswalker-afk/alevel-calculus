function sampleGrayTemplate(src,H,x,y){
  const [sx,sy]=mapH(H,x,y);
  if(!Number.isFinite(sx)||!Number.isFinite(sy)||sx<0||sy<0||sx>=src.width||sy>=src.height)return 255;
  const xi=Math.round(sx),yi=Math.round(sy),p=(yi*src.width+xi)*4;return grayOf(src.data,p);
}
function alignmentScore(src,H){
  const vals=[];
  for(let q=1;q<=25;q++)for(const c of['A','B','C','D','E']){
    const b=APP.bubbles[q][c],cx=b.x*APP.pxPerMm,cy=(APP.pageHmm-b.y)*APP.pxPerMm,r=b.r*APP.pxPerMm,r0=Math.max(1,r*.72),r1=Math.max(2,r*1.22),step=Math.max(1,r/4);
    let sum=0,n=0;
    for(let dy=-r1;dy<=r1;dy+=step)for(let dx=-r1;dx<=r1;dx+=step){
      const d2=dx*dx+dy*dy;if(d2>=r0*r0&&d2<=r1*r1){sum+=(255-sampleGrayTemplate(src,H,cx+dx,cy+dy))/255;n++}
    }
    if(n)vals.push(sum/n);
  }
  return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0;
}
function bubbleScore(src,H,b){
  const cx=b.x*APP.pxPerMm,cy=(APP.pageHmm-b.y)*APP.pxPerMm,r=b.r*APP.pxPerMm*APP.thresholds.innerRadiusFraction,step=Math.max(.8,r/5);
  let darkness=0,dark=0,n=0;
  for(let dy=-r;dy<=r;dy+=step)for(let dx=-r;dx<=r;dx+=step)if(dx*dx+dy*dy<=r*r){
    const v=sampleGrayTemplate(src,H,cx+dx,cy+dy);darkness+=(255-v)/255;if(v<APP.thresholds.pixelDark)dark++;n++;
  }
  return n?.62*(darkness/n)+.38*(dark/n):0;
}
function classifyQuestion(scores){
  const r=Object.entries(scores).sort((a,b)=>b[1]-a[1]),[tc,t]=r[0],s=r[1][1],strong=r.filter(([,v])=>v>=APP.thresholds.marked),moderate=r.filter(([,v])=>v>=APP.thresholds.moderate);
  if(t<APP.thresholds.blank)return{response:'Blank',review:false,reason:'No bubble appears filled'};
  if(strong.length>=2)return{response:'Multiple',review:true,reason:'More than one bubble is strongly marked'};
  if(strong.length===1&&t-s>=APP.thresholds.ambiguityDelta)return{response:tc,review:false,reason:'Clear single mark'};
  if(moderate.length===1&&t-s>=APP.thresholds.ambiguityDelta)return{response:tc,review:true,reason:'Single mark is lighter than normal'};
  if(moderate.length>=2)return{response:'Multiple',review:true,reason:'Two or more possible marks'};
  return{response:t>=APP.thresholds.moderate?tc:'Blank',review:true,reason:'Mark strength is uncertain'};
}
function readBubbles(src,H){
  const responses={},scores={},reasons={},reviewQuestions=[];
  for(let q=1;q<=25;q++){
    const s={};for(const c of['A','B','C','D','E'])s[c]=bubbleScore(src,H,APP.bubbles[q][c]);
    const cl=classifyQuestion(s);responses[q]=cl.response;scores[q]=s;reasons[q]=cl.reason;if(cl.review)reviewQuestions.push(q);
  }
  return{responses,scores,reasons,reviewQuestions};
}
function questionCropUrl(src,H,q){
  const xs=['A','B','C','D','E'].map(c=>APP.bubbles[q][c].x),y=APP.bubbles[q].A.y;
  const x0=Math.max(0,(Math.min(...xs)-9)*APP.pxPerMm),x1=Math.min(APP.outW,(Math.max(...xs)+9)*APP.pxPerMm),ym=(APP.pageHmm-y)*APP.pxPerMm,y0=Math.max(0,ym-7*APP.pxPerMm),y1=Math.min(APP.outH,ym+7*APP.pxPerMm);
  return renderCanonicalRegion(src,H,x0,y0,x1,y1,1.35).toDataURL('image/jpeg',.8);
}
function canvasThumb(canvas,w){
  const s=Math.min(1,w/canvas.width),o=document.createElement('canvas');o.width=Math.round(canvas.width*s);o.height=Math.round(canvas.height*s);
  o.getContext('2d').drawImage(canvas,0,0,o.width,o.height);return o.toDataURL('image/jpeg',.65);
}
function flagDuplicateIds(){
  const m=new Map();state.results.forEach((r,i)=>{if(!r.candidateId)return;if(!m.has(r.candidateId))m.set(r.candidateId,[]);m.get(r.candidateId).push(i)});
  m.forEach((a,id)=>{if(a.length>1)a.forEach(i=>state.results[i].warnings.push(`Duplicate candidate ID ${id}.`))});
}
function scoreResult(r){
  if(r.status==='rescan')return{correct:0,incorrect:0,blank:0,unresolved:25,score:null};
  let correct=0,incorrect=0,blank=0,unresolved=0;
  for(let q=1;q<=25;q++){
    if(r.unresolved.has(q)){unresolved++;continue}
    const a=r.responses[q]||'Blank';if(a==='Blank')blank++;else if(a===state.key[q])correct++;else incorrect++;
  }
  return{correct,incorrect,blank,unresolved,score:unresolved?null:state.scoring.start+state.scoring.correct*correct+state.scoring.incorrect*incorrect+state.scoring.blank*blank};
}
function renderAll(){renderResults();renderReview()}
function renderResults(){
  if(!state.results.length)return;el('resultsSection').hidden=false;
  const tb=el('resultsTable').querySelector('tbody');tb.innerHTML='';let rev=0,scored=0,sum=0;
  state.results.forEach(r=>{
    const s=scoreResult(r),p=state.roster.get(r.candidateId)||{};rev+=s.unresolved;if(s.score!==null){scored++;sum+=s.score}
    const tr=document.createElement('tr'),status=r.status==='rescan'?'Re-scan':s.unresolved?'Review':r.candidateId?'Ready':'Check ID';
    tr.innerHTML=`<td>${escapeHtml(r.candidateId||'—')}</td><td>${escapeHtml(p.name||'')}</td><td>${escapeHtml(p.year||'')}</td><td>${r.pageNumber}</td><td>${s.correct}</td><td>${s.incorrect}</td><td>${s.blank}</td><td>${s.unresolved}</td><td><b>${s.score??'—'}</b></td><td>${status}</td>`;tb.appendChild(tr);
  });
  el('resultsSummary').textContent=`${state.results.length} pages processed · ${rev} responses awaiting review.`;
  el('summaryTiles').innerHTML=`<div class="summary-tile"><strong>${state.results.length}</strong><span>Papers</span></div><div class="summary-tile"><strong>${scored}</strong><span>Ready to score</span></div><div class="summary-tile"><strong>${scored?(sum/scored).toFixed(1):'—'}</strong><span>Average score</span></div><div class="summary-tile"><strong>${rev}</strong><span>Items to review</span></div>`;
}
function renderReview(){
  const list=el('reviewList');list.innerHTML='';let count=0;
  state.results.forEach(r=>{
    if(r.status==='rescan'){
      count++;const d=document.createElement('div');d.className='review-item';
      d.innerHTML=`<img class="review-image" src="${r.pageThumb}"><div><strong>${escapeHtml(r.sourceFile)} page ${r.pageNumber}</strong><p>Re-scan: ${escapeHtml(r.warnings.join(' '))}</p></div>`;list.appendChild(d);return;
    }
    if(!r.candidateId){
      count++;const d=document.createElement('div');d.className='review-item';
      d.innerHTML=`<img class="review-image" src="${r.pageThumb}"><div><strong>Candidate ID could not be read</strong><p>Enter the three-digit ID printed beside the QR code.</p><div class="row"><input class="manual-id" inputmode="numeric" maxlength="3" placeholder="001"><button class="button secondary">Apply ID</button></div></div>`;
      d.querySelector('button').onclick=()=>{const id=normalizeId(d.querySelector('input').value);if(!id||Number(id)<APP.candidateMin||Number(id)>APP.candidateMax){alert('Enter a candidate ID from 001 to 140.');return}r.candidateId=id;r.qrOk=false;state.reviewLog.push({page:r.pageNumber,candidateId:id,action:'Manual candidate ID'});flagDuplicateIds();renderAll()};list.appendChild(d);
    }
    [...r.unresolved].sort((a,b)=>a-b).forEach(q=>{
      count++;const x=r.reviewDetails[q],d=document.createElement('div');d.className='review-item';
      d.innerHTML=`<img class="review-image" src="${x.cropUrl}"><div><strong>Candidate ${escapeHtml(r.candidateId||'?')} · Question ${q}</strong><p>Detected: ${escapeHtml(x.initial)} · ${escapeHtml(x.reason)}</p><div class="review-actions"></div></div>`;
      const a=d.querySelector('.review-actions');['A','B','C','D','E','Blank','Multiple'].forEach(ch=>{const b=document.createElement('button');b.className='choice-btn';b.textContent=ch;b.onclick=()=>{r.responses[q]=ch;r.unresolved.delete(q);state.reviewLog.push({candidateId:r.candidateId,page:r.pageNumber,question:q,resolved:ch});renderAll()};a.appendChild(b)});list.appendChild(d);
    });
  });
  el('reviewSection').hidden=count===0;el('reviewCount').textContent=`${count} to review`;
}
function resultRows(){
  return state.results.map(r=>{const s=scoreResult(r),p=state.roster.get(r.candidateId)||{};return{'Candidate ID':r.candidateId,Name:p.name||'',Year:p.year||'',School:p.school||'',Page:r.pageNumber,Correct:s.correct,Incorrect:s.incorrect,Blank:s.blank,Unresolved:s.unresolved,Score:s.score??'',Warnings:(r.warnings||[]).join(' | ')}})
}
function responseRows(){
  return state.results.map(r=>{const row={'Candidate ID':r.candidateId};for(let q=1;q<=25;q++)row[`Q${q}`]=r.unresolved.has(q)?`REVIEW (${r.responses[q]||''})`:(r.responses[q]||'');return row})
}
function analysisRows(){
  const rows=[];for(let q=1;q<=25;q++){const c={A:0,B:0,C:0,D:0,E:0,Blank:0,Multiple:0,Unresolved:0},v=[];
    state.results.forEach(r=>{if(r.status==='rescan'||r.unresolved.has(q)){c.Unresolved++;return}const a=r.responses[q]||'Blank';c[a]=(c[a]||0)+1;v.push(a)});
    const good=v.filter(a=>a===state.key[q]).length;rows.push({Question:q,Key:state.key[q],Correct:good,'% correct':v.length?Number((100*good/v.length).toFixed(1)):'',...c});
  }return rows;
}
function exportExcel(){
  const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(resultRows()),'Results');XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(responseRows()),'Responses');XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(analysisRows()),'Question Analysis');XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(state.reviewLog),'Review Log');XLSX.writeFile(wb,'Senior_Maths_Competition_2026_Results.xlsx');
}
function exportCsv(){
  const csv=XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(resultRows())),a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='Senior_Maths_Competition_2026_Results.csv';a.click();
}
function setProgress(f,t){el('progressBar').style.width=`${Math.max(0,Math.min(1,f))*100}%`;el('progressText').textContent=t}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
function yieldUI(){return sleep(0)}
function formatBytes(n){return n<1048576?`${(n/1024).toFixed(1)} KB`:`${(n/1048576).toFixed(1)} MB`}
function escapeHtml(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
