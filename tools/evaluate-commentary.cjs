/* Run explicitly with --live. Four serial calls; no keys/endpoints saved. */
const fs=require('node:fs'),path=require('node:path');
const {simulate}=require('../full-match.js'),{packet,validateOutput}=require('../server/evidence.cjs'),{explain,narrativePacket,cleanCitationArtifacts}=require('../server/provider.cjs');
function cases(){
 const seed=7,events=simulate(seed).events,index=to=>events.findIndex(e=>e.t>=to);
 const goal=events.find(e=>e.type==='goal'),sub=events.find(e=>e.type==='sub');
 if(!goal||!sub)throw Error('Fixture seed changed; update explicit cases');
 let quiet;
 for(let from=0;from<2400;from+=60){const to=from+120,es=events.filter(e=>e.t>=from&&e.t<=to);if(es.length&&!es.some(e=>['shot','goal','sub','yellow_card','red_card','tactical_change'].includes(e.type))){quiet={from,to};break}}
 if(!quiet)throw Error('No quiet fixture');
 return [{name:'goal',from:Math.max(0,goal.t-120),to:Math.ceil(goal.t+60),viewer_mode:'quick'},
 {name:'substitution',from:Math.floor(sub.t-300),to:Math.ceil(sub.t+300),viewer_mode:'tactical'},
 {name:'quiet',...quiet,viewer_mode:'quick'},
 {name:'tactical-change',from:2400,to:3000,viewer_mode:'tactical'}].map(c=>({...c,seed,index:index(c.to)}));
}
async function run(){
 const live=process.argv.includes('--live');
 if(!live){console.log(JSON.stringify(cases(),null,2));return}
 const rows=[],out=path.join(__dirname,'../docs/commentary-evaluation.json');
 for(const c of cases()){
  const p=packet(c);let transport={},raw=null;
  const fetcher=async(...args)=>{const response=await fetch(...args);transport.http_status=response.status;const data=await response.clone().json();if(data.usage)transport.usage=data.usage;raw=(data.output||[]).filter(x=>x.type==='message').flatMap(x=>x.content||[]).filter(x=>x.type==='output_text').map(x=>x.text).join('');return response};
  const start=Date.now(),result=await explain(p,fetcher);let validation_error=null;
  if(raw)try{JSON.parse(raw).story_ids?require('../server/stories.cjs').assembleStories(JSON.parse(raw),p):validateOutput(cleanCitationArtifacts(JSON.parse(raw)),narrativePacket(p))}catch(e){validation_error=e.message}
  rows.push({case:c.name,input:c,latency_ms:Date.now()-start,...transport,validation_error,result,evidence:p.facts,raw_model_output:raw?JSON.parse(safeJSON(raw)):null,review_status:'Not independently reviewed; passing guards does not establish semantic correctness.'});
  fs.writeFileSync(out,JSON.stringify({generated_at:new Date().toISOString(),generator_version:'0.3',prompt_sha256:require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(__dirname,'../prompts/commentary.txt'))).digest('hex'),scope:'Four fixed seed-7 intervals, one sample each. Not a statistical benchmark. Token usage includes failed validation responses where returned. No automatic retries.',rows},null,2)+'\n');
  console.log(JSON.stringify({case:c.name,mode:result.mode,latency_ms:rows.at(-1).latency_ms,usage:transport.usage,validation_error}));
  if(rows.length<4)await new Promise(resolve=>setTimeout(resolve,22000));
 }
}
function safeJSON(raw){try{JSON.parse(raw);return raw}catch{return JSON.stringify({unparsed_text:raw})}}
if(require.main===module)run().catch(e=>{console.error(e.message);process.exitCode=1});
module.exports={cases};
