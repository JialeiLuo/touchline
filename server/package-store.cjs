const {randomUUID}=require('node:crypto'),{validate}=require('../match-package.js');
const expired='Uploaded package expired. Load it again.';
function createStore({now=Date.now,ttl=3600000,max=8}={}){
 const entries=new Map();
 function prune(){for(const[id,v]of entries)if(now()>=v.expires_at)entries.delete(id);}
 function metadata(id){prune();const v=entries.get(id);if(!v)throw Error(expired);return{package_id:id,created_at:v.created_at,expires_at:v.expires_at,expires_in_seconds:Math.max(0,Math.ceil((v.expires_at-now())/1000))};}
 function put(data,{replace}={}){validate(data);prune();if(entries.size>=max&&!entries.has(replace))throw Error('Package capacity reached. Replace or remove your loaded package, or wait for expiry.');const id=randomUUID(),created_at=now();entries.set(id,{data,created_at,expires_at:created_at+ttl});if(replace)entries.delete(replace);return id;}
 function get(id){metadata(id);return entries.get(id).data;}
 function remove(id){return entries.delete(id);}
 return{put,get,metadata,remove};
}
module.exports={...createStore(),createStore};
