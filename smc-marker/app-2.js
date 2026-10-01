async function processAll(){
  if(!state.key||!state.scans.length)return;
  state.processing=true;state.results=[];state.reviewLog=[];updateMarkButton();
  el('clearButton').disabled=true;el('progressWrap').hidden=false;setProgress(0,'Preparing scans…');
  try{
    const tasks=await countTasks(state.scans);let done=0;
    for(const file of state.scans){
      if(/\.pdf$/i.test(file.name)){
        const pdf=await pdfjsLib.getDocument({data:await file.arrayBuffer()}).promise;
        for(let i=1;i<=pdf.numPages;i++){
          setProgress(done/tasks,`Rendering ${file.name} — page ${i}/${pdf.numPages}`);
          const page=await pdf.getPage(i),viewport=page.getViewport({scale:2.4}),canvas=document.createElement('canvas');
          canvas.width=Math.round(viewport.width);canvas.height=Math.round(viewport.height);
          await page.render({canvasContext:canvas.getContext('2d',{willReadFrequently:true}),viewport}).promise;
          state.results.push(await processCanvas(canvas,file.name,i));done++;
          setProgress(done/tasks,`Processed ${done} of ${tasks} pages`);await yieldUI();
        }
        pdf.destroy();
      }else{
        const canvas=await imageFileToCanvas(file);
        state.results.push(await processCanvas(canvas,file.name,1));done++;
        setProgress(done/tasks,`Processed ${done} of ${tasks} pages`);await yieldUI();
      }
    }
    flagDuplicateIds();renderAll();setProgress(1,`Finished — ${state.results.length} pages processed`);
  }catch(err){console.error(err);alert(`Marking stopped: ${err.message}`)}
  finally{state.processing=false;updateMarkButton();el('clearButton').disabled=false}
}
async function countTasks(files){
  let t=0;
  for(const f of files){
    if(/\.pdf$/i.test(f.name)){
      const p=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise;t+=p.numPages;p.destroy();
    }else t++;
  }
  return Math.max(t,1);
}
async function imageFileToCanvas(f){
  const bmp=await createImageBitmap(f),scale=Math.min(1,2200/Math.max(bmp.width,bmp.height)),c=document.createElement('canvas');
  c.width=Math.round(bmp.width*scale);c.height=Math.round(bmp.height*scale);
  c.getContext('2d',{willReadFrequently:true}).drawImage(bmp,0,0,c.width,c.height);bmp.close();return c;
}
function sourceFromCanvas(canvas){
  const ctx=canvas.getContext('2d',{willReadFrequently:true}),im=ctx.getImageData(0,0,canvas.width,canvas.height);
  return{width:canvas.width,height:canvas.height,data:im.data};
}
async function processCanvas(canvas,sourceFile,pageNumber){
  const source=sourceFromCanvas(canvas),pageThumb=canvasThumb(canvas,420),fid=detectFiducials(source);
  if(!fid)return makeFailedPage(sourceFile,pageNumber,pageThumb,'Could not find all four registration squares.');
  let best=null;
  for(let shift=0;shift<4;shift++){
    const H=transformForShift(fid,shift);
    if(!H)continue;
    const qr=decodeQR(source,H),score=alignmentScore(source,H),candidate={H,qr,score,qrValid:parseQR(qr)!==null,shift};
    if(!best||compareCandidate(candidate,best)>0)best=candidate;
  }
  if(!best)return makeFailedPage(sourceFile,pageNumber,pageThumb,'Could not align the answer sheet.');
  const parsed=parseQR(best.qr),readings=readBubbles(source,best.H),geometryOk=best.score>=APP.thresholds.geometry,warnings=[];
  if(!geometryOk)warnings.push('Registration alignment confidence is low; all answers require review.');
  if(!parsed)warnings.push('QR code could not be read; candidate ID needs checking.');
  const candidateId=parsed?parsed.candidateId:'',review=new Set(geometryOk?readings.reviewQuestions:Array.from({length:25},(_,i)=>i+1)),details={};
  for(const q of review)details[q]={initial:readings.responses[q],reason:geometryOk?readings.reasons[q]:'Low geometry confidence',scores:readings.scores[q],cropUrl:questionCropUrl(source,best.H,q)};
  return{sourceFile,pageNumber,candidateId,qrPayload:best.qr,qrOk:!!parsed,form:parsed?.form||'?',geometryOk,geometryScore:best.score,responses:readings.responses,bubbleScores:readings.scores,unresolved:new Set([...review]),reviewDetails:details,warnings,pageThumb,status:'processed'};
}
function makeFailedPage(sourceFile,pageNumber,pageThumb,message){
  return{sourceFile,pageNumber,candidateId:'',qrPayload:'',qrOk:false,form:'?',geometryOk:false,geometryScore:0,responses:{},bubbleScores:{},unresolved:new Set(Array.from({length:25},(_,i)=>i+1)),reviewDetails:{},warnings:[message],pageThumb,status:'rescan'};
}
function grayOf(data,i){return Math.round(.299*data[i]+.587*data[i+1]+.114*data[i+2])}
function detectFiducials(src){
  const w=src.width,h=src.height,stride=w+1,integral=new Uint32Array((w+1)*(h+1));
  for(let y=0;y<h;y++){
    let row=0,base=y*w*4,ii=(y+1)*stride;
    for(let x=0;x<w;x++){
      const p=base+x*4;row+=grayOf(src.data,p)<125?1:0;
      integral[ii+x+1]=integral[ii-stride+x+1]+row;
    }
  }
  const centers=dstFiducials().map(([x,y])=>[x/APP.outW,y/APP.outH]);
  const baseSize=Math.max(12,Math.round(((w*5.5/APP.pageWmm)+(h*5.5/APP.pageHmm))/2));
  const out=[];
  for(const [nx,ny] of centers){
    let best=null;
    const sizes=[.78,.92,1.06,1.20].map(k=>Math.max(10,Math.round(baseSize*k)));
    for(const size of sizes){
      const half=Math.round(size/2),cx0=Math.round((nx-.055)*w),cx1=Math.round((nx+.055)*w),cy0=Math.round((ny-.045)*h),cy1=Math.round((ny+.045)*h),step=Math.max(2,Math.round(size/7));
      for(let cy=Math.max(half,cy0);cy<=Math.min(h-half-1,cy1);cy+=step){
        for(let cx=Math.max(half,cx0);cx<=Math.min(w-half-1,cx1);cx+=step){
          const x0=cx-half,y0=cy-half,x1=x0+size,y1=y0+size;
          const dark=rectIntegral(integral,stride,x0,y0,x1,y1),score=dark/(size*size);
          if(!best||score>best.score)best={cx,cy,size,score};
        }
      }
    }
    if(!best||best.score<.42)return null;
    const r=Math.round(best.size*.72);let sx=0,sy=0,n=0;
    for(let y=Math.max(0,best.cy-r);y<Math.min(h,best.cy+r+1);y++)for(let x=Math.max(0,best.cx-r);x<Math.min(w,best.cx+r+1);x++){
      const p=(y*w+x)*4;if(grayOf(src.data,p)<150){sx+=x;sy+=y;n++}
    }
    out.push(n>[best.size*best.size*.25]?[sx/n,sy/n]:[best.cx,best.cy]);
  }
  return out;
}
function rectIntegral(I,stride,x0,y0,x1,y1){return I[y1*stride+x1]-I[y0*stride+x1]-I[y1*stride+x0]+I[y0*stride+x0]}
function dstFiducials(){
  return['TL','TR','BR','BL'].map(name=>{const f=APP.fiducials[name],x=f.x+f.size/2,y=APP.pageHmm-(f.y+f.size/2);return[x*APP.pxPerMm,y*APP.pxPerMm]});
}
function transformForShift(fid,shift){
  const canonical=dstFiducials(),physical=[0,1,2,3].map(i=>fid[(i+shift)%4]);return homographyFrom4(canonical,physical);
}
function homographyFrom4(from,to){
  const A=[],b=[];
  for(let i=0;i<4;i++){
    const [x,y]=from[i],[u,v]=to[i];
    A.push([x,y,1,0,0,0,-u*x,-u*y]);b.push(u);
    A.push([0,0,0,x,y,1,-v*x,-v*y]);b.push(v);
  }
  const h=solveLinear(A,b);return h?[h[0],h[1],h[2],h[3],h[4],h[5],h[6],h[7],1]:null;
}
function solveLinear(A,b){
  const n=b.length,M=A.map((r,i)=>[...r,b[i]]);
  for(let c=0;c<n;c++){
    let p=c;for(let r=c+1;r<n;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;
    if(Math.abs(M[p][c])<1e-10)return null;
    [M[c],M[p]]=[M[p],M[c]];const d=M[c][c];for(let j=c;j<=n;j++)M[c][j]/=d;
    for(let r=0;r<n;r++)if(r!==c){const f=M[r][c];if(!f)continue;for(let j=c;j<=n;j++)M[r][j]-=f*M[c][j]}
  }
  return M.map(r=>r[n]);
}
function mapH(H,x,y){const d=H[6]*x+H[7]*y+1;return[(H[0]*x+H[1]*y+H[2])/d,(H[3]*x+H[4]*y+H[5])/d]}
function sampleRGBA(src,x,y){
  const xi=Math.max(0,Math.min(src.width-1,Math.round(x))),yi=Math.max(0,Math.min(src.height-1,Math.round(y))),p=(yi*src.width+xi)*4;
  return[src.data[p],src.data[p+1],src.data[p+2],255];
}
function renderCanonicalRegion(src,H,x0,y0,x1,y1,scale=1){
  const w=Math.max(1,Math.round((x1-x0)*scale)),h=Math.max(1,Math.round((y1-y0)*scale)),c=document.createElement('canvas');c.width=w;c.height=h;
  const ctx=c.getContext('2d'),im=ctx.createImageData(w,h),d=im.data;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const tx=x0+(x+.5)/scale,ty=y0+(y+.5)/scale,[sx,sy]=mapH(H,tx,ty),rgba=sampleRGBA(src,sx,sy),p=(y*w+x)*4;
    d[p]=rgba[0];d[p+1]=rgba[1];d[p+2]=rgba[2];d[p+3]=255;
  }
  ctx.putImageData(im,0,0);return c;
}
function decodeQR(src,H){
  const q=APP.qr,m=7,x0=Math.max(0,(q.x-m)*APP.pxPerMm),x1=Math.min(APP.outW,(q.x+q.w+m)*APP.pxPerMm);
  const top=APP.pageHmm-(q.y+q.h),bottom=APP.pageHmm-q.y,y0=Math.max(0,(top-m)*APP.pxPerMm),y1=Math.min(APP.outH,(bottom+m)*APP.pxPerMm);
  const c=renderCanonicalRegion(src,H,x0,y0,x1,y1,1.7),im=c.getContext('2d').getImageData(0,0,c.width,c.height),a=jsQR(im.data,im.width,im.height,{inversionAttempts:'attemptBoth'});
  return a?.data?.trim()||'';
}
function parseQR(t){const m=String(t||'').match(/^SMC2026\|FORM=([A-Z])\|CANDIDATE=(\d{3})\|OMR=([0-9.]+)$/);return m?{form:m[1],candidateId:m[2],version:m[3]}:null}
function compareCandidate(a,b){if(a.qrValid!==b.qrValid)return a.qrValid?1:-1;return a.score-b.score}
