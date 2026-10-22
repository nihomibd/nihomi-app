#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import net from 'node:net';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const gate=path.join(here,'nihomi-approval-gate.mjs');
if(!fs.existsSync(gate)){console.error(`Approval gate script not found: ${gate}`);process.exit(2);}
const root=fs.mkdtempSync(path.join(os.tmpdir(),'nihomi-approval-smoke-'));
let child;
function writeJson(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n');}
function assert(cond,msg){if(!cond)throw new Error(msg);}
async function freePort(){const s=net.createServer();await new Promise((resolve,reject)=>s.listen(0,'127.0.0.1',resolve).once('error',reject));const p=s.address().port;await new Promise(r=>s.close(r));return p;}
async function getJson(url){const r=await fetch(url,{cache:'no-store'});return {status:r.status,body:await r.json()};}
async function postJson(url,body,headers={}){const r=await fetch(url,{method:'POST',headers:{'content-type':'application/json',...headers},body:JSON.stringify(body)});return {status:r.status,body:await r.json()};}
try{
  fs.writeFileSync(path.join(root,'AGENTS.md'),'# temporary test root\n');
  const approval=path.join(root,'docs','approval');fs.mkdirSync(approval,{recursive:true});
  writeJson(path.join(approval,'APPROVAL_STATE.json'),{schema_version:'1.0',status:'none',task_id:null});
  writeJson(path.join(approval,'PENDING_TASK.json'),{
    schema_version:'1.0',status:'pending',task_id:'NIHOMI-SMOKE-001',title:'Approval-gate smoke test',
    objective:'Prove the local dashboard requires explicit Founder approval for one exact scope.',domain:'platform',
    in_scope:['Test approval flow'],out_of_scope:['Modify application code'],
    acceptance_criteria:['Clicking approve saves approval for exact scope'],verification:['Node smoke test'],risks:[],dependencies:[],
    base_commit:'test-fixture',created_at:new Date().toISOString(),proposed_by:'smoke-test'
  });
  fs.mkdirSync(path.join(root,'scripts'),{recursive:true});
  fs.copyFileSync(gate,path.join(root,'scripts','nihomi-approval-gate.mjs'));
  const port=await freePort();
  child=spawn(process.execPath,[gate,'serve','--root',root,'--port',String(port)],{cwd:root,stdio:['ignore','pipe','pipe']});
  let logs='';child.stdout.on('data',d=>logs+=d);child.stderr.on('data',d=>logs+=d);
  const base=`http://127.0.0.1:${port}`;
  let status;
  for(let i=0;i<80;i++){
    if(child.exitCode!==null)throw new Error(`Approval server exited early: ${logs}`);
    try{status=await getJson(`${base}/api/status`);break;}catch{await new Promise(r=>setTimeout(r,150));}
  }
  assert(status?.status===200,'Dashboard API did not start.');
  const s=status.body;assert(s.validProposal===true&&!s.approved,'Task must start pending and unapproved.');
  const home=await fetch(base+'/');const html=await home.text();
  assert(home.status===200&&html.includes('Approve task')&&html.includes('Request changes'),'Real approval controls are missing from the dashboard.');
  const wrongOrigin=await postJson(base+'/api/decision',{action:'approve',task_id:s.task.task_id,scope_fingerprint:s.fingerprint},{Origin:'http://localhost:9999','X-NIHOMI-APPROVAL-TOKEN':s.csrf_token});
  assert(wrongOrigin.status===403,'Cross-origin decision should be rejected.');
  const approved=await postJson(base+'/api/decision',{action:'approve',task_id:s.task.task_id,scope_fingerprint:s.fingerprint,reason:''},{Origin:base,'X-NIHOMI-APPROVAL-TOKEN':s.csrf_token});
  assert(approved.status===200&&approved.body.status==='approved','Approval click did not persist.');
  const validation=spawnSync(process.execPath,[gate,'validate','--root',root],{cwd:root,encoding:'utf8'});
  assert(validation.status===0&&validation.stdout.includes('APPROVED'),'Approved proposal failed command-line validation.');
  const taskFile=path.join(approval,'PENDING_TASK.json');const changed=JSON.parse(fs.readFileSync(taskFile,'utf8'));changed.in_scope.push('unapproved scope mutation');writeJson(taskFile,changed);
  const invalid=spawnSync(process.execPath,[gate,'validate','--root',root],{cwd:root,encoding:'utf8'});
  assert(invalid.status===2&&!invalid.stdout.includes('"status": "APPROVED"'),'Changing the approved scope must invalidate authorization.');
  console.log('PASS: dashboard has actual Approve/Request changes buttons.');
  console.log('PASS: pending task requires explicit approval.');
  console.log('PASS: cross-origin approval request rejected.');
  console.log('PASS: approval persists and exact scope validates.');
  console.log('PASS: post-approval scope mutation invalidates authorization.');
}catch(e){console.error(`FAIL: ${e.stack||e}`);if(child)console.error(logs||'');process.exitCode=1;}
finally{if(child){child.kill('SIGTERM');await new Promise(r=>setTimeout(r,100));if(child.exitCode===null)child.kill('SIGKILL');}fs.rmSync(root,{recursive:true,force:true});}
