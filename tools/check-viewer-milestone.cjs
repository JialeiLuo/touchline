/* Bounded local integration check; two live model calls with --live. */
const A=require('node:assert/strict'),fs=require('node:fs');
async function post(route,data){const r=await fetch('http://127.0.0.1:8767'+route,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});return{status:r.status,data:await r.json()}}
(async()=>{
 const input={seed:7,index:require('../full-match.js').simulate(7).events.findIndex(e=>e.t>=3000),from:2400,to:3000,player_focus:'Morgan',viewer_focus:'northbridge'},checks=[];
 const p=await post('/api/evidence',input);A.equal(p.status,200);A.equal(p.data.player_context.name,'Morgan');checks.push('Player evidence linked to selected interval');
 A.equal((await post('/api/evidence',{...input,player_focus:'unknown'})).status,400);checks.push('Unknown player rejected');
 const example=await(await fetch('http://127.0.0.1:8767/api/package-example')).json();example.squads.teams.northbridge.name='Harbour FC';const uploaded=await post('/api/packages',example);A.equal(uploaded.status,201);
 const up=await post('/api/evidence',{package_id:uploaded.data.package_id,index:example.events.findIndex(e=>e.t>=3000),from:2400,to:3000,player_focus:'Morgan'});A.equal(up.data.player_context.team_name,'Harbour FC');A.equal(up.data.sequence_analysis,null);checks.push('Uploaded squad naming and player evidence; directional sequence analysis correctly unavailable');
 const rows=[];
 if(process.argv.includes('--live'))for(const viewer_mode of ['quick','tactical']){const started=Date.now(),reply=await post('/api/commentary',{...input,viewer_mode});A.equal(reply.status,200);A(reply.data.paragraphs.some(p=>p.text.includes('Morgan')));A(reply.data.watch_next);rows.push({viewer_mode,latency_ms:Date.now()-started,mode:reply.data.mode,headline:reply.data.headline,paragraphs:reply.data.paragraphs,watch_next:reply.data.watch_next});console.log(JSON.stringify(rows.at(-1)))}
 if(rows.length){A.notEqual(rows[0].paragraphs[0].text,rows[1].paragraphs[0].text);checks.push('Quick/Tactical player wording differs; watch-next present')}
 fs.writeFileSync('docs/viewer-milestone-check.json',JSON.stringify({checked_at:new Date().toISOString(),checks,live_samples:rows,limitations:'Two samples are integration evidence, not a usefulness or reliability benchmark.'},null,2)+'\n');console.log(checks.join('\n'));
})().catch(e=>{console.error(e.message);process.exitCode=1});
