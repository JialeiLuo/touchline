const A=require('node:assert/strict'),P=require('../match-package.js'),{simulate}=require('../full-match.js'),{packet}=require('../server/evidence.cjs'),store=require('../server/package-store.cjs');
for(const seed of [0,7,19]){
 const replay=simulate(seed),data=P.fromReplay(replay),id=store.put(data),input={index:replay.events.length-1,from:2400,to:3000};
 const a=packet({...input,seed}),b=packet({...input,package_id:id});
 for(const field of ['sequence_analysis','comparisons','interval_statistics','score_before','investigations','facts'])A.deepEqual(b[field],a[field],`${field}: seed ${seed} import parity`);
 store.remove(id);
}
const data=P.fromReplay(simulate(7));
const missing=structuredClone(data);for(const e of missing.events){delete e.x;delete e.y;}P.validate(missing);const id=store.put(missing),p=packet({package_id:id,index:missing.events.length-1,from:2400,to:3000});A.equal(p.sequence_analysis,null);A.equal(p.input_capabilities.sequences,false);A.match(p.input_capabilities.sequence_reason,/Unavailable/);store.remove(id);
for(const mutate of [d=>d.events[1].x=999,d=>d.events[1].actor_id='unknown',d=>d.events[1].t=-1,d=>d.events[1].y=undefined]){const bad=structuredClone(data);mutate(bad);A.throws(()=>P.validate(bad),/events\[1\]/);}
const legacy=structuredClone(data);delete legacy.analysis_contract;P.validate(legacy);A.match(P.capabilities(legacy).contract,/Legacy/);
const reverse=structuredClone(data);reverse.analysis_contract.direction={northbridge:'decreasing_x',southport:'increasing_x'};for(const e of reverse.events)if(e.x!==undefined)e.x=105-e.x;P.validate(reverse);const rid=store.put(reverse);const input={index:data.events.length-1,from:2400,to:3000};A.deepEqual(packet({...input,package_id:rid}).sequence_analysis.teams.map(t=>t.counts),packet({...input,seed:7}).sequence_analysis.teams.map(t=>t.counts));store.remove(rid);
const {createStore}=require('../server/package-store.cjs');let now=0;const local=createStore({now:()=>now,ttl:1000,max:1}),first=local.put(data);A.equal(local.metadata(first).expires_at,1000);A.throws(()=>local.put(data),/capacity/);A.throws(()=>local.put({...data,synthetic:false},{replace:first}));A.equal(local.get(first),data);const replacement=local.put(data,{replace:first});A.throws(()=>local.get(first),/expired/);now=1000;A.throws(()=>local.get(replacement),/expired/);const cleared=local.put(data);A(local.remove(cleared));A.throws(()=>local.get(cleared),/expired/);
console.log('Input contract: three import parity matches, missing-data distinction, actionable event errors, legacy defaults, mirrored direction, atomic replacement, capacity, exact expiry and removal pass.');
