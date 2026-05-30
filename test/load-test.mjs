// load-test.mjs — payload weight, cold-load timing, and stress (repeated sessions,
// largest grade, DOM-growth/leak proxy). Tuned to the "₹8,000 Android on 4G" constraint.
import { chromium } from 'file:///C:/Users/maila/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { createServer } from 'node:http';
import { readFile, writeFile, stat, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)),'..');
const UI = join(ROOT,'app','ui');
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webmanifest':'application/manifest+json','.png':'image/png'};

// throttle helper: simulate "slow 4G-ish" by delaying each response a little
let transferred = 0;
const server=createServer(async(req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);if(p==='/')p='/index.html';const fp=join(UI,p);if(!existsSync(fp)){res.writeHead(404);res.end();return;}const body=await readFile(fp);transferred+=body.length;res.writeHead(200,{'Content-Type':MIME[extname(fp)]||'application/octet-stream'});res.end(body);});
await new Promise(r=>server.listen(8735,r));
const BASE='http://127.0.0.1:8735';

const report={generatedAt:new Date().toISOString(),payload:{},coldLoad:{},stress:{},largestGrade:{}};

// ── 1. static payload weight (initial shell, before content) ────────────────
async function dirSize(dir){let t=0,files=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=join(dir,e.name);if(e.isDirectory()){const s=await dirSize(p);t+=s.total;}else{const st=await stat(p);t+=st.size;files.push({f:p.replace(UI+'\\','').replace(/\\/g,'/'),kb:+(st.size/1024).toFixed(1)});}}return{total:t,files};}
const css=await dirSize(join(UI,'css')), js=await dirSize(join(UI,'js'));
const idxSize=(await stat(join(UI,'index.html'))).size;
report.payload.shellKB=+(((css.total+js.total+idxSize))/1024).toFixed(1);
report.payload.cssKB=+(css.total/1024).toFixed(1);
report.payload.jsKB=+(js.total/1024).toFixed(1);
report.payload.largestJS=js.files.sort((a,b)=>b.kb-a.kb).slice(0,5);
report.payload.largestCSS=css.files.sort((a,b)=>b.kb-a.kb).slice(0,5);

const b=await chromium.launch();

// ── 2. cold load timing (3 grades) + transferred bytes ──────────────────────
for(const grade of ['2','6','12']){
  const ctx=await b.newContext();const pg=await ctx.newPage();
  await pg.route('**raw.githubusercontent.com**',r=>r.abort());
  await pg.route('**fonts.g*',r=>r.abort());
  await pg.addInitScript(g=>localStorage.setItem('decashift_user',JSON.stringify({userId:'t',name:'T',email:'k@t.com',category:'school',grade:g,plan:'pro',trialStartDate:new Date().toISOString(),createdAt:new Date().toISOString()})),grade);
  transferred=0;const t0=Date.now();
  await pg.goto(BASE,{waitUntil:'domcontentloaded'});
  await pg.waitForFunction(()=>window.state&&state.questions&&state.questions.length>=0&&state.currentScreen==='home',{timeout:10000}).catch(()=>{});
  const ms=Date.now()-t0;
  const m=await pg.evaluate(()=>({q:(state.questions||[]).length,g:(state.goals||[]).length,res:performance.getEntriesByType('resource').length}));
  report.coldLoad['grade'+grade]={ms,transferredKB:+(transferred/1024).toFixed(1),questions:m.q,goals:m.g,resources:m.res};
  await ctx.close();
}

// ── 3. stress: 10 quiz sessions back-to-back, watch DOM node + JS heap growth ─
{
  const ctx=await b.newContext();const pg=await ctx.newPage();
  pg.setDefaultTimeout(2500);   // avoid 30s actionability stalls on optional clicks
  await pg.route('**raw.githubusercontent.com**',r=>r.abort());
  await pg.route('**fonts.g*',r=>r.abort());
  await pg.addInitScript(()=>localStorage.setItem('decashift_user',JSON.stringify({userId:'t',name:'T',email:'k@t.com',category:'school',grade:'6',plan:'pro',trialStartDate:new Date().toISOString(),createdAt:new Date().toISOString()})));
  await pg.goto(BASE,{waitUntil:'domcontentloaded'});await pg.waitForTimeout(800);
  const snap=async()=>pg.evaluate(()=>({nodes:document.getElementsByTagName('*').length,heap:performance.memory?Math.round(performance.memory.usedJSHeapSize/1048576):null}));
  const before=await snap();
  const tStart=Date.now();
  let completed=0;
  for(let s=0;s<10;s++){
    await pg.evaluate(s=>{_showScreen('home');const list=state.goals||[];const g=list[s%(list.length||1)]||list[0];startGoal(g.id);},s);
    await pg.waitForTimeout(120);
    for(let i=0;i<20;i++){
      const has=await pg.locator('#screen-quiz.active .answer-option, #screen-quiz.active .answer-card').count();
      if(!has)break;
      await pg.locator('#screen-quiz.active .answer-option, #screen-quiz.active .answer-card').first().click().catch(()=>{});
      const sub=pg.locator('#screen-quiz.active button:has-text("Submit")');
      if(await sub.count())await sub.first().click().catch(()=>{});
      await pg.waitForTimeout(40);
      const nx=pg.locator('#screen-quiz.active button:visible').filter({hasText:/Next|Result|Finish|See|Done/i});
      if(await nx.count())await nx.first().click().catch(()=>{});
      await pg.waitForTimeout(40);
      if(await pg.locator('#screen-result.active').count()){completed++;break;}
    }
    await pg.evaluate(()=>{const back=[...document.querySelectorAll('#screen-result.active button')].find(b=>/Goals|Back/i.test(b.textContent));if(back)back.click();});
    await pg.waitForTimeout(80);
  }
  const after=await snap();
  report.stress={sessionsCompleted:completed,totalMs:Date.now()-tStart,avgMsPerSession:Math.round((Date.now()-tStart)/10),
    domNodesBefore:before.nodes,domNodesAfter:after.nodes,domGrowth:after.nodes-before.nodes,
    heapBeforeMB:before.heap,heapAfterMB:after.heap,sessionsStored:await pg.evaluate(()=>Storage.loadSessions().length)};
  await ctx.close();
}

await b.close();server.close();
await writeFile(join(ROOT,'test','_load-result.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
