const A=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{createControls}=require('../server/demo-controls.cjs');const stateDir=fs.mkdtempSync(path.join(os.tmpdir(),'touchline-controls-'));let time=Date.UTC(2026,9,25);const opts={stateDir,daily:2,total:3,rate:2,now:()=>time};try{
let c=createControls(opts);A(c.visitor('one'));A(c.visitor('one'));A(!c.visitor('one'));A(c.visitor('two'));A(c.acquire());A(!c.acquire());c.release();A(c.acquire());c.release();
A(c.reserve().allowed);A(c.reserve().allowed);A(!c.reserve().allowed);c=createControls(opts);A(!c.reserve().allowed);time+=86400000;A(c.reserve().allowed);A(!c.reserve().allowed);
const k=c.key({viewer_focus:'neutral'});c.remember(k,{mode:'foundry',text:'test'});A.equal(c.cached(k).text,'test');A.equal(c.cached(c.key({viewer_focus:'northbridge'})),null);time+=3600000;A.equal(c.cached(k),null);c.remember(k,{mode:'template'});A.equal(c.cached(k),null);
fs.writeFileSync(path.join(stateDir,'usage.json'),'broken');A(!c.reserve().allowed);
console.log('Demo controls: persistent daily/total reservations, restart/day rollover, cache isolation/expiry, rate/concurrency limits and corrupt-ledger fallback pass.');
}finally{fs.rmSync(stateDir,{recursive:true,force:true})}
