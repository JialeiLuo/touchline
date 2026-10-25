/* Single-process demo controls. Persistent call reservations, not a billing cap. */
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
function createControls(options={}){
 const stateDir=options.stateDir||process.env.TOUCHLINE_STATE_DIR||path.join(__dirname,'../.runtime'),now=options.now||Date.now;
 const positive=(v,fallback)=>{const n=Number(v);return Number.isInteger(n)&&n>0?n:fallback};
 const daily=positive(options.daily??process.env.TOUCHLINE_AI_DAILY_LIMIT,200),total=positive(options.total??process.env.TOUCHLINE_AI_TOTAL_LIMIT,2000),rate=positive(options.rate??process.env.TOUCHLINE_REQUESTS_PER_MINUTE,30),cache=new Map(),visitors=new Map();
 const file=path.join(stateDir,'usage.json');let busy=false;
 const day=()=>new Date(now()).toISOString().slice(0,10);
 function read(){if(!fs.existsSync(file))return{day:day(),daily:0,total:0};const value=JSON.parse(fs.readFileSync(file,'utf8'));if(!Number.isInteger(value.daily)||!Number.isInteger(value.total)||value.daily<0||value.total<0||typeof value.day!=='string')throw Error('Invalid usage ledger');return value.day===day()?value:{...value,day:day(),daily:0};}
 function reserve(){try{const v=read();if(v.daily>=daily||v.total>=total)return{allowed:false,reason:'Online commentary allowance reached. Showing local commentary; replay and evidence still work.'};fs.mkdirSync(stateDir,{recursive:true,mode:0o700});const temp=file+'.tmp';fs.writeFileSync(temp,JSON.stringify({...v,daily:v.daily+1,total:v.total+1}),{mode:0o600});fs.renameSync(temp,file);return{allowed:true};}catch{return{allowed:false,reason:'Online usage tracking is unavailable. Showing local commentary.'};}}
 function visitor(key){const time=now();for(const[k,v]of visitors)if(time-v.start>=60000)visitors.delete(k);const id=createHash('sha256').update(key).digest('hex');let v=visitors.get(id);if(!v){if(visitors.size>=1000)return false;v={start:time,count:0};visitors.set(id,v)}return ++v.count<=rate;}
 function cached(key){const v=cache.get(key);if(!v)return null;if(now()-v.at>=3600000){cache.delete(key);return null}return structuredClone(v.value);}
 function remember(key,value){if(value.mode!=='foundry')return;if(cache.size>=64)cache.delete(cache.keys().next().value);cache.set(key,{at:now(),value:structuredClone(value)});}
 return{reserve,visitor,cached,remember,key:p=>createHash('sha256').update(JSON.stringify(p)).digest('hex'),acquire:()=>{if(busy)return false;busy=true;return true},release:()=>{busy=false},limits:{daily,total,rate}};
}
module.exports={createControls};
