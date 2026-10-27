const A=require('node:assert/strict'),http=require('node:http'),{handler}=require('../server.cjs');
(async()=>{const server=http.createServer(handler);await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;try{
 for(const path of ['/','/app.js','/match-clock.js','/report-ui.js','/viewer-ui.js','/investigator-ui.js','/data/player-history.js'])A.equal((await fetch(base+path)).status,200);
 for(const path of ['/.env','/server.cjs','/server/provider.cjs','/server/investigator.cjs','/server/investigator-tools.cjs','/prompts/investigator.txt','/prompts/commentary.txt','/docs/azure-gpt5-mini-deployed.jpg','/docs/context-evaluation.json','/tools/evaluate-context.cjs','/package.json'])A.equal((await fetch(base+path)).status,404,path);
 const reply=await fetch(base+'/api/evidence',{method:'POST',headers:{Origin:'https://unrelated.example','Content-Type':'application/json'},body:'{}'});A.equal(reply.status,403);
 A.equal((await fetch(base+'/api/status')).status,200);
 const example=await (await fetch(base+'/api/package-example')).json();A(example.analysis_contract);
 const upload=async(data,replace)=>{const r=await fetch(base+'/api/packages',{method:'POST',headers:{'Content-Type':'application/json',...(replace?{'X-Replace-Package':replace}:{})},body:JSON.stringify(data)});return{status:r.status,body:await r.json()}};
 const first=await upload(example);A.equal(first.status,201);A(first.body.expires_at>Date.now());const id=first.body.package_id;
 A.equal((await fetch(base+'/api/packages/'+id)).status,200);
 const invalid=await upload({...example,synthetic:false},id);A.equal(invalid.status,400);A.equal((await fetch(base+'/api/packages/'+id)).status,200);
 const next=await upload(example,id);A.equal(next.status,201);A.equal((await fetch(base+'/api/packages/'+id)).status,410);
 A.equal((await fetch(base+'/api/packages/'+next.body.package_id,{method:'DELETE',headers:{Origin:'https://unrelated.example'}})).status,403);
 A.equal((await fetch(base+'/api/packages/'+next.body.package_id,{method:'DELETE'})).status,200);A.equal((await fetch(base+'/api/packages/'+next.body.package_id)).status,410);
 A.equal((await fetch(base+'/api/packages')).status,404);

 console.log('HTTP checks passed: public assets available; credentials, server code, tools and documentation blocked; origin checked.');
 }finally{await new Promise(resolve=>server.close(resolve))}})().catch(e=>{console.error(e);process.exitCode=1});
