const {randomUUID}=require('node:crypto'),{validate}=require('../match-package.js');
const entries=new Map(),ttl=60*60*1000;
function put(data){validate(data);for(const[id,v]of entries)if(Date.now()-v.created>ttl)entries.delete(id);if(entries.size>=8)throw Error('Eight packages are already loaded. Restart the local server to clear them.');const id=randomUUID();entries.set(id,{data,created:Date.now()});return id;}
function get(id){const value=entries.get(id);if(!value||Date.now()-value.created>ttl){entries.delete(id);throw Error('Uploaded package expired. Load it again.');}return value.data;}
module.exports={put,get};
