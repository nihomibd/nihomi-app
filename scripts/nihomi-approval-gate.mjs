#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const VERSION = '1.0.0';
const args = process.argv.slice(2);
const command = args[0] || 'help';
function option(name, fallback) { const i=args.indexOf(name); return i>=0 && args[i+1] ? args[i+1] : fallback; }
function findRoot(start) {
  let dir=path.resolve(start);
  while(true) {
    if (fs.existsSync(path.join(dir,'AGENTS.md')) && fs.existsSync(path.join(dir,'docs','approval'))) return dir;
    const parent=path.dirname(dir); if(parent===dir) return null; dir=parent;
  }
}
const rootArg=option('--root', process.cwd());
const root=findRoot(rootArg);
if(!root) { console.error('NIHOMI approval gate: repository root not found. Run from NIHOMI workspace or pass --root. Expected AGENTS.md and docs/approval/.'); process.exit(2); }
const approvalDir=path.join(root,'docs','approval');
const pendingFile=path.join(approvalDir,'PENDING_TASK.json');
const stateFile=path.join(approvalDir,'APPROVAL_STATE.json');
function readJson(file) { try { return JSON.parse(fs.readFileSync(file,'utf8')); } catch(e) { throw new Error(`Cannot read valid JSON at ${path.relative(root,file)}: ${e.message}`); } }
function writeJsonAtomic(file,obj) {
  const tmp=`${file}.${process.pid}.${crypto.randomBytes(4).toString('hex')}.tmp`;
  fs.writeFileSync(tmp,JSON.stringify(obj,null,2)+'\n',{encoding:'utf8',flag:'wx'});
  fs.renameSync(tmp,file);
}
function fingerprint(task) {
  const stable={
    schema_version:task.schema_version, task_id:task.task_id, title:task.title, objective:task.objective,
    domain:task.domain, in_scope:task.in_scope, out_of_scope:task.out_of_scope,
    acceptance_criteria:task.acceptance_criteria, verification:task.verification,
    risks:task.risks, dependencies:task.dependencies, base_commit:task.base_commit
  };
  return crypto.createHash('sha256').update(JSON.stringify(stable)).digest('hex');
}
function inspect() {
  const task=readJson(pendingFile); const state=readJson(stateFile);
  if(task.status!=='pending') return {validProposal:false, approved:false, task, state, message:task.status==='idle'?'No task is currently awaiting approval.':`Proposal status is ${String(task.status)}; only status=pending may be approved.`};
  const required=['task_id','title','objective','domain','in_scope','out_of_scope','acceptance_criteria','verification','risks','dependencies','base_commit','created_at'];
  const missing=required.filter(k=>task[k]===undefined || task[k]===null || task[k]==='');
  if(missing.length) return {validProposal:false,approved:false,task,state,message:`Proposal is missing required fields: ${missing.join(', ')}`};
  if(!Array.isArray(task.in_scope)||!Array.isArray(task.out_of_scope)||!Array.isArray(task.acceptance_criteria)||!Array.isArray(task.verification)||!Array.isArray(task.risks)||!Array.isArray(task.dependencies)) return {validProposal:false,approved:false,task,state,message:'Scope, criteria, verification, risks, and dependencies must be arrays.'};
  if(!/^[A-Z0-9][A-Z0-9._-]{2,79}$/.test(task.task_id)) return {validProposal:false,approved:false,task,state,message:'task_id must use uppercase letters, digits, dot, underscore, or hyphen (3–80 characters).'};
  const fp=fingerprint(task);
  const approved=state.status==='approved' && state.task_id===task.task_id && state.scope_fingerprint===fp;
  const stateMatches=state.task_id===task.task_id && state.scope_fingerprint===fp;
  return {validProposal:true,approved,task,state,fingerprint:fp,stateMatches,message:approved?'APPROVED: exact task ID and scope fingerprint match.':stateMatches&&state.status==='changes_requested'?'Changes requested; revise the proposal and obtain fresh approval.':'WAITING: this exact task scope has not been approved.'};
}
function printStatus() {
  const s=inspect();
  console.log(JSON.stringify({repository:root,status:s.approved?'APPROVED':s.validProposal?'WAITING':'NO_VALID_PENDING_TASK',task_id:s.task?.task_id??null,task_title:s.task?.title??null,scope_fingerprint:s.fingerprint??null,message:s.message},null,2));
  return s;
}
if(command==='help'||command==='--help') {
  console.log(`NIHOMI Approval Gate v${VERSION}\n\nCommands:\n  node scripts/nihomi-approval-gate.mjs status [--root PATH]\n  node scripts/nihomi-approval-gate.mjs validate [--root PATH]\n  node scripts/nihomi-approval-gate.mjs serve [--root PATH] [--port 4179]\n\nThe proposal must be recorded in docs/approval/PENDING_TASK.json. Approval is bound to the task ID and SHA-256 fingerprint of its scope/criteria. Server binds only to 127.0.0.1.`); process.exit(0);
}
if(command==='status') { const s=printStatus(); process.exit(s.approved?0:s.validProposal?1:2); }
if(command==='validate') { const s=printStatus(); if(!s.approved) { console.error('STOP: do not begin this proposed task until the Founder approves the exact task and scope.'); process.exit(2); } process.exit(0); }
if(command!=='serve') { console.error(`Unknown command: ${command}`); process.exit(2); }
let initial;
try { initial=inspect(); } catch(e) { console.error(e.message); process.exit(2); }
const port=Number(option('--port','4179'));
if(!Number.isInteger(port)||port<1024||port>65535) { console.error('Port must be an integer from 1024 to 65535.'); process.exit(2); }
const sessionToken=crypto.randomBytes(24).toString('hex');
const host=`127.0.0.1:${port}`;
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>NIHOMI — Founder Task Approval</title><style>
:root{color-scheme:dark;--bg:#090b13;--panel:#121727;--line:#2c3650;--text:#f3f6ff;--muted:#a8b2ca;--violet:#a78bfa;--green:#34d399;--amber:#fbbf24;--red:#fb7185}*{box-sizing:border-box}body{margin:0;background:radial-gradient(ellipse at top,#17203a 0%,var(--bg) 55%);color:var(--text);font:16px/1.55 system-ui,-apple-system,Segoe UI,sans-serif}.wrap{max-width:900px;margin:auto;padding:32px 18px 60px}.eyebrow{color:var(--violet);font-size:.78rem;font-weight:800;letter-spacing:.16em;text-transform:uppercase}.head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;flex-wrap:wrap}h1{font-size:clamp(1.6rem,5vw,2.4rem);line-height:1.1;margin:.45rem 0}.sub{color:var(--muted);max-width:650px}.pill{border:1px solid var(--line);border-radius:999px;padding:6px 12px;color:var(--amber);font-size:.82rem;font-weight:700}.card{margin-top:22px;background:rgba(18,23,39,.96);border:1px solid var(--line);border-radius:18px;padding:24px;box-shadow:0 20px 70px #0005}.row{margin:18px 0}.label{color:var(--muted);font-size:.8rem;text-transform:uppercase;letter-spacing:.08em;font-weight:750}.value{font-size:1.03rem;white-space:pre-wrap;overflow-wrap:anywhere}.title{font-size:1.6rem;font-weight:800;margin-top:4px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.list{margin:8px 0 0;padding-left:22px}.list li{margin:5px 0}.notice{border:1px solid var(--line);border-radius:12px;padding:13px 15px;background:#0c1120;color:var(--muted);margin-top:18px}.buttons{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}button{font:inherit;font-weight:800;cursor:pointer;border:0;border-radius:11px;padding:12px 18px;min-height:48px}button:disabled{opacity:.45;cursor:not-allowed}.approve{background:var(--green);color:#052e24}.revise{background:#3a2030;color:#fecdd3;border:1px solid #6b3146}.neutral{background:#27324b;color:var(--text);border:1px solid var(--line)}textarea{width:100%;min-height:90px;background:#090d18;color:var(--text);border:1px solid var(--line);border-radius:10px;padding:12px;font:inherit;margin-top:8px}#msg{margin-top:16px;font-weight:750}.ok{color:var(--green)}.bad{color:var(--red)}.small{color:var(--muted);font-size:.88rem}.foot{margin-top:20px;color:var(--muted);font-size:.82rem}@media(max-width:620px){.grid{grid-template-columns:1fr}.card{padding:18px}.buttons button{width:100%}}
</style></head><body><main class="wrap"><div class="head"><div><div class="eyebrow">NIHOMI · Founder Control</div><h1>Next task approval</h1><p class="sub">Review one bounded work package. Approval authorizes this task only—not the whole backlog, a production merge, or public launch.</p></div><div class="pill">LOCAL ONLY · NOT PUBLIC</div></div><section class="card" id="app"><p>Loading proposal…</p></section><p class="foot">This dashboard binds approval to the exact task ID and SHA-256 scope fingerprint. If the proposal changes, it must be approved again. Server listens only on 127.0.0.1.</p></main><script>
const TOKEN=${JSON.stringify(sessionToken)};const app=document.getElementById('app');let current=null;
function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=String(text);return n}
function field(parent,label,value){const w=el('div','row');w.append(el('div','label',label));w.append(el('div','value',value||'—'));parent.append(w)}
function list(parent,label,items){const w=el('div','row');w.append(el('div','label',label));const ul=el('ul','list');(items||[]).forEach(x=>ul.append(el('li','',x)));if(!(items||[]).length)ul.append(el('li','','None specified'));w.append(ul);parent.append(w)}
async function load(){try{const r=await fetch('/api/status',{cache:'no-store'});const s=await r.json();current=s;app.replaceChildren();if(!s.validProposal){app.append(el('div','title','No valid task proposal'));app.append(el('p','sub',s.message||'No task is currently awaiting approval.'));app.append(el('div','notice','The agent must create a complete proposal in docs/approval/PENDING_TASK.json before an approval decision can be made.'));return}const t=s.task;app.append(el('div','label','Proposed task · '+t.task_id));app.append(el('div','title',t.title));field(app,'Objective',t.objective);field(app,'Domain',t.domain);const grid=el('div','grid');list(grid,'In scope',t.in_scope);list(grid,'Out of scope',t.out_of_scope);app.append(grid);list(app,'Acceptance criteria',t.acceptance_criteria);list(app,'Verification plan',t.verification);list(app,'Risks',t.risks);list(app,'Dependencies',t.dependencies);field(app,'Base commit / branch',t.base_commit);field(app,'Scope fingerprint (SHA-256)',s.fingerprint);const note=el('div','notice',s.approved?'This exact task scope is already approved.':s.stateMatches&&s.state?.status==='changes_requested'?'Previous decision requested changes. The proposal must be revised and resubmitted for approval.':s.state?.task_id===t.task_id&&s.state?.status==='approved'?'The saved approval does not match this proposal. Approval is invalidated.': 'No work may begin until this exact proposal is approved.');app.append(note);if(s.approved){app.append(el('div','ok','APPROVED — exact task/scope match. The agent may begin this task only.'));return}const label=el('label','label','Request changes (optional explanation)');const ta=el('textarea','');ta.id='reason';ta.placeholder='Tell the agent what to change in the proposal…';app.append(label,ta);const buttons=el('div','buttons');const approve=el('button','approve','✓ Approve task');approve.type='button';approve.onclick=()=>decide('approve');const revise=el('button','revise','↻ Request changes');revise.type='button';revise.onclick=()=>decide('request_changes');const refresh=el('button','neutral','Refresh proposal');refresh.type='button';refresh.onclick=load;buttons.append(approve,revise,refresh);app.append(buttons);app.append(el('div','',''));const msg=el('div','','');msg.id='msg';app.append(msg)}catch(e){app.replaceChildren(el('div','title','Approval server error'),el('p','bad',e.message),el('p','small','Keep this server local. Review the terminal output and repository files.'))}}
async function decide(action){const msg=document.getElementById('msg');if(!current?.task?.task_id)return;const reason=(document.getElementById('reason')?.value||'').trim();if(action==='approve'&&!confirm('Approve '+current.task.task_id+' for its exact proposed scope only?'))return;if(action==='request_changes'&&!reason){if(!confirm('Send a request for changes without additional comments?'))return}for(const b of app.querySelectorAll('button'))b.disabled=true;try{const res=await fetch('/api/decision',{method:'POST',headers:{'Content-Type':'application/json','X-NIHOMI-APPROVAL-TOKEN':TOKEN},body:JSON.stringify({action,task_id:current.task.task_id,scope_fingerprint:current.fingerprint,reason})});const data=await res.json();if(!res.ok)throw new Error(data.error||'Decision was not saved');msg.className=data.status==='approved'?'ok':'bad';msg.textContent=data.message;await load()}catch(e){msg.className='bad';msg.textContent=e.message;for(const b of app.querySelectorAll('button'))b.disabled=false}}
load();
</script></body></html>`;
function respond(res,status,obj) { res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','content-security-policy':"default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; frame-ancestors 'none'"}); res.end(JSON.stringify(obj)); }
const server=http.createServer(async(req,res)=>{
  const hostHeader=req.headers.host||'';
  if(hostHeader!==host){res.writeHead(403,{'content-type':'text/plain'});res.end('Host not allowed');return;}
  if(req.method==='GET' && req.url==='/') {res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','content-security-policy':"default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; frame-ancestors 'none'"});res.end(html);return;}
  if(req.method==='GET' && req.url==='/api/status') {try{respond(res,200,{...inspect(),server_version:VERSION,csrf_token:sessionToken});}catch(e){respond(res,500,{error:e.message});}return;}
  if(req.method==='POST' && req.url==='/api/decision') {
    const expectedOrigin=`http://${host}`;
    if(req.headers.origin!==expectedOrigin){respond(res,403,{error:'Origin check failed.'});return;}
    if(req.headers['x-nihomi-approval-token']!==sessionToken){respond(res,403,{error:'Approval session token is invalid or expired. Refresh the dashboard.'});return;}
    if(!String(req.headers['content-type']||'').toLowerCase().startsWith('application/json')){respond(res,415,{error:'Expected application/json.'});return;}
    let body='';for await(const chunk of req){body+=chunk;if(body.length>16384){respond(res,413,{error:'Request too large.'});return;}}
    let input;try{input=JSON.parse(body);}catch{respond(res,400,{error:'Invalid JSON.'});return;}
    try {
      const s=inspect();
      if(!s.validProposal){respond(res,409,{error:'No valid pending task proposal.'});return;}
      if(input.task_id!==s.task.task_id||input.scope_fingerprint!==s.fingerprint){respond(res,409,{error:'Proposal changed. Refresh and review the new exact scope.'});return;}
      if(input.action==='approve') {
        const state={schema_version:'1.0',status:'approved',task_id:s.task.task_id,scope_fingerprint:s.fingerprint,approved_at:new Date().toISOString(),approved_via:'nihomi-local-founder-approval-dashboard',approved_scope_summary:{title:s.task.title,domain:s.task.domain,base_commit:s.task.base_commit}};
        writeJsonAtomic(stateFile,state);respond(res,200,{status:'approved',message:`Approved ${s.task.task_id}. Only this exact task scope is authorized.`});return;
      }
      if(input.action==='request_changes') {
        const state={schema_version:'1.0',status:'changes_requested',task_id:s.task.task_id,scope_fingerprint:s.fingerprint,requested_at:new Date().toISOString(),reason:String(input.reason||'Founder requested changes.').slice(0,2000)};
        writeJsonAtomic(stateFile,state);respond(res,200,{status:'changes_requested',message:`Changes requested for ${s.task.task_id}. The agent must revise the proposal and seek fresh approval.`});return;
      }
      respond(res,400,{error:'Action must be approve or request_changes.'});
    } catch(e){respond(res,500,{error:e.message});}
    return;
  }
  res.writeHead(404,{'content-type':'text/plain'});res.end('Not found');
});
server.on('error',e=>{console.error(`Approval server failed: ${e.message}`);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>{console.log(`NIHOMI approval dashboard: http://${host}/`);console.log(`Repository: ${root}`);console.log('Local loopback only. Press Ctrl+C to stop.');});
