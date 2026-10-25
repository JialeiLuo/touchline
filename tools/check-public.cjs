/* Run against the public host. Makes one or two real model calls if configured. */
const A=require('node:assert/strict'),fs=require('node:fs');
const base=process.argv[2];if(!base||!base.startsWith('https://'))throw Error('Pass the public HTTPS origin');
(async()=>{const checks=[];const get=async p=>fetch(base+p,{signal:AbortSignal.timeout(60000)});const post=async(p,b,headers={})=>fetch(base+p,{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(b),signal:AbortSignal.timeout(60000)});
for(const p of ['/','/app.js','/viewer-ui.js','/product-ui.js','/data/player-history.js'])A.equal((await get(p)).status,200,p);checks.push('public HTML and browser assets');
for(const p of ['/.env','/server.cjs','/server/provider.cjs','/.runtime/usage.json','/docs/context-evaluation.json'])A.equal((await get(p)).status,404,p);checks.push('private files blocked');
A.equal((await post('/api/evidence',{}, {Origin:'https://unrelated.example'})).status,403);checks.push('cross-origin POST rejected');
const status=await(await get('/api/status')).json();A.equal(status.configured,true);A.equal(status.version,require('../package.json').version);checks.push('model configured');
const body={seed:7,index:899,from:3300,to:3960,viewer_mode:'quick',player_focus:'Ellis'};
const evidence=await(await post('/api/evidence',body)).json();A.ok(evidence.facts.length);checks.push('calculated evidence');
const first=await(await post('/api/commentary',body)).json();A.equal(first.mode,'foundry',first.reason);const second=await(await post('/api/commentary',body)).json();A.equal(second.delivery,'cached');A.deepEqual(second.paragraphs,first.paragraphs);checks.push('live Foundry response and identical cached reply');
const example=await(await get('/api/package-example')).json();const uploaded=await post('/api/packages',example);A.equal(uploaded.status,201);const info=await uploaded.json();A.ok(info.package_id);checks.push('synthetic JSON upload');
const report={checked_at:new Date().toISOString(),origin:base,version:status.version,checks,first_delivery:first.delivery,cached_delivery:second.delivery,live_mode:first.mode,notes:'Remote HTTPS checks from development machine; browser journey and restart persistence recorded separately.'};fs.writeFileSync('docs/public-demo-check.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));})().catch(e=>{console.error(e);process.exitCode=1});
