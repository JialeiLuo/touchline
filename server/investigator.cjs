/* Bounded stateless Responses loop. No shell, browsing or model-owned prose. */
const fs=require('node:fs'),path=require('node:path'),{createTools}=require('./investigator-tools.cjs'),{assembleStories}=require('./stories.cjs'),{fallback,configured}=require('./provider.cjs');
const instructions=fs.readFileSync(path.join(__dirname,'../prompts/investigator.txt'),'utf8');
const LIMITS=Object.freeze({model_calls:4,tool_calls:6,duration_ms:22000,max_output_tokens:1200,token_budget:60000,request_bytes:36000,result_bytes:18000,response_bytes:100000});
const error=code=>Object.assign(Error(code),{code});
async function investigate(p,{fetcher=fetch,reserve=()=>({allowed:true}),signal,limits={},now=Date.now}={}){
 const budget={...LIMITS};for(const[k,v]of Object.entries(limits)){if(!(k in budget)||!Number.isInteger(v)||v<=0||v>budget[k])throw Error('Invalid investigator limits');budget[k]=v;}
 const started=now(),deadline=started+budget.duration_ms,tools=createTools(p),trace={version:'batch5-v1',status:'running',stop_reason:null,model:process.env.AZURE_FOUNDRY_DEPLOYMENT||null,budgets:budget,model_calls:[],steps:[],usage:{input_tokens:0,output_tokens:0,reported_calls:0,unreported_calls:0,reserved_token_upper_estimate:0},duration_ms:0};
 const complete=(result,status,reason)=>{trace.status=status;trace.stop_reason=reason;trace.duration_ms=now()-started;return{...result,investigation:trace};};
 const fail=code=>complete({...fallback(p,'Investigation is unavailable or reached its limit. Showing local evidence-based stories.'),failure_code:code},'fallback',code);
 if(!configured())return fail('not_configured');
 let base;try{base=new URL(process.env.AZURE_FOUNDRY_BASE_URL);if(base.protocol!=='https:'||!base.hostname.endsWith('.openai.azure.com')||base.username||base.password||base.search||base.hash)throw Error();}catch{return fail('invalid_endpoint');}
 const history=[{role:'user',content:JSON.stringify(tools.context)}],usedCallIds=new Set();let attempts=0;
 try{
  while(trace.model_calls.length<budget.model_calls){
   if(signal?.aborted)throw error('cancelled');if(now()>=deadline)throw error('time_budget');if(attempts>=budget.tool_calls)throw error('tool_budget');
   let finalTurn=trace.model_calls.length===budget.model_calls-1||attempts>=budget.tool_calls-1;
   const body={model:process.env.AZURE_FOUNDRY_DEPLOYMENT,instructions,input:history,tools:tools.definitions,tool_choice:finalTurn?{type:'function',name:'finish_investigation'}:'required',parallel_tool_calls:false,max_output_tokens:budget.max_output_tokens,store:false,include:['reasoning.encrypted_content'],...(process.env.AZURE_FOUNDRY_DEPLOYMENT==='gpt-5-mini'?{reasoning:{effort:'minimal'}}:{})};
   let encoded=JSON.stringify(body),bytes=Buffer.byteLength(encoded),reservation=bytes+1024+body.max_output_tokens;
   // Preserve room for the next result and final request rather than querying into a fallback.
   if(!finalTurn&&tools.results.size>1&&budget.token_budget-trace.usage.reserved_token_upper_estimate<reservation*2+budget.result_bytes){finalTurn=true;body.tool_choice={type:'function',name:'finish_investigation'};encoded=JSON.stringify(body);bytes=Buffer.byteLength(encoded);reservation=bytes+1024+body.max_output_tokens;}
   if(bytes>budget.request_bytes||trace.usage.reserved_token_upper_estimate+reservation>budget.token_budget)throw error('token_budget');
   const allowance=reserve();if(!allowance.allowed)throw error('allowance_reached');
   trace.usage.reserved_token_upper_estimate+=reservation;const record={number:trace.model_calls.length+1,finish_only:finalTurn,max_output_tokens:body.max_output_tokens,input_bytes:bytes,status:'requested',latency_ms:0};trace.model_calls.push(record);const requestStart=now();
   let timer;const abort=new AbortController(),onAbort=()=>abort.abort();signal?.addEventListener('abort',onAbort,{once:true});
   let response,data;
   try{const operation=(async()=>{response=await fetcher(new URL(base.href.replace(/\/$/,'')+'/responses'),{method:'POST',headers:{'Content-Type':'application/json','api-key':process.env.AZURE_FOUNDRY_API_KEY},body:encoded,signal:abort.signal});if(!response.ok)throw error(response.status===429?'provider_rate_limit':'provider_http_error');const value=await response.json();if(Buffer.byteLength(JSON.stringify(value))>budget.response_bytes)throw error('provider_response_too_large');return value;})();
    const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>{abort.abort();reject(error('time_budget'));},Math.max(1,deadline-now()));});
    const cancelled=new Promise((_,reject)=>{abort.signal.addEventListener('abort',()=>reject(error(signal?.aborted?'cancelled':'time_budget')),{once:true});});data=await Promise.race([operation,timeout,cancelled]);
   }catch(e){if(signal?.aborted)e=error('cancelled');record.status=e.code||'provider_unavailable';trace.usage.unreported_calls++;throw e;}finally{clearTimeout(timer);signal?.removeEventListener('abort',onAbort);record.latency_ms=now()-requestStart;}
   record.status='received';
   const u=data.usage;if(u&&Number.isInteger(u.input_tokens)&&u.input_tokens>=0&&Number.isInteger(u.output_tokens)&&u.output_tokens>=0){record.usage={input_tokens:u.input_tokens,output_tokens:u.output_tokens};trace.usage.input_tokens+=u.input_tokens;trace.usage.output_tokens+=u.output_tokens;trace.usage.reported_calls++;if(u.input_tokens+u.output_tokens>reservation||u.output_tokens>body.max_output_tokens)throw error('provider_usage_over_budget');}else trace.usage.unreported_calls++;
   if(data.status&&data.status!=='completed')throw error(data.status==='incomplete'?'provider_incomplete':'provider_failed');
   if(!Array.isArray(data.output)||data.output.some(x=>!['reasoning','function_call','message'].includes(x.type)))throw error('invalid_provider_output');
   const calls=data.output.filter(x=>x.type==='function_call');if(!calls.length||calls.length>budget.tool_calls-attempts)throw error('tool_budget_or_no_calls');
   // Preserve encrypted reasoning/output items for stateless continuation, never in UI trace.
   history.push(...data.output);
   for(const call of calls){
    if(signal?.aborted)throw error('cancelled');if(now()>=deadline)throw error('time_budget');if(typeof call.call_id!=='string'||call.call_id.length>160||usedCallIds.has(call.call_id))throw error('invalid_call_id');usedCallIds.add(call.call_id);attempts++;
    const step={number:attempts,tool:tools.definitions.some(t=>t.name===call.name)?call.name:'unknown_tool',status:'requested',result_id:null,summary:null};trace.steps.push(step);let args;
    try{
     if(typeof call.arguments!=='string'||call.arguments.length>4096)throw Error('invalid_arguments');args=JSON.parse(call.arguments);
     if(finalTurn&&call.name!=='finish_investigation')throw Error('finish_required');
     if(call.name==='finish_investigation'){
      if(calls.length!==1)throw Error('finish_must_be_alone');const selection=tools.finish(args);step.status='complete';step.result_ids=selection.result_ids;step.references_completed=selection.references_completed;step.story_ids=selection.story_ids;step.summary=selection.status;
      const out=assembleStories({story_ids:selection.story_ids},p,selection.available_story_ids);
      return complete({...out,mode:'foundry',composition:'investigated-stories',evidence_status:selection.status,reason:'Microsoft Foundry selected evidence tools and follow-up queries; the displayed wording and figures come from inspected server-owned evidence.',limitations:[...out.limitations,...(selection.status==='insufficient_evidence'?['The investigation did not establish a supported explanation beyond the recorded facts.']:[])]},'complete',selection.status);
     }
     const result=tools.execute(call.name,args),encodedResult=JSON.stringify(result);step.arguments=args;step.result_id=result.result_id;step.status=result.status;step.event_ids=result.event_ids.slice(0,100);step.history_ids=result.history_ids;step.summary=`${call.name.replaceAll('_',' ')}: ${result.status}`;
     if(Buffer.byteLength(encodedResult)>budget.result_bytes){step.status='result_too_large';throw error('result_budget');}
     history.push({type:'function_call_output',call_id:call.call_id,output:encodedResult});
    }catch(e){if(e.code)throw e;const allowed=['unknown_tool','invalid_arguments','unknown_substitute','unknown_change','duplicate_query','finish_required','finish_must_be_alone','inspect_evidence_first','invalid_finish_references','uninspected_story','insufficient_support'];const code=allowed.includes(e.message)?e.message:'invalid_arguments';step.status='rejected';step.summary=code;history.push({type:'function_call_output',call_id:call.call_id,output:JSON.stringify({error:code,instruction:'Use a valid listed query or finish using the available stories below and all their required_result_ids, including context-0 where required. No execution occurred.',...(call.name==='finish_investigation'?{max_story_ids:p.viewer_mode==='quick'?2:4,valid_result_ids:[...tools.results.keys()],available_stories:tools.candidates()}:{})})});}
   }
  }
  throw error('model_call_budget');
 }catch(e){return fail(e.code||'provider_unavailable');}
}
module.exports={investigate,LIMITS};
