const {buildStories,assembleStories}=require('./stories.cjs');
const fs = require('node:fs');
const path = require('node:path');
const {validateOutput} = require('./evidence.cjs');
const instruction = fs.readFileSync(path.join(__dirname, '../prompts/commentary.txt'), 'utf8');
function configured() {
  return !!(process.env.AZURE_FOUNDRY_BASE_URL && process.env.AZURE_FOUNDRY_DEPLOYMENT && process.env.AZURE_FOUNDRY_API_KEY);
}
const modes={quick:'Viewer mode: Quick catch-up. Use at most 2 short paragraphs and 90 words total. Prioritise what changed and its relevance to a returning fan. Explain any specialist term in plain English. Omit secondary numerical detail. Keep one essential uncertainty.',tactical:'Viewer mode: Tactical detail. Use 2–4 paragraphs, at most 220 words. Explain declared roles, before/after comparisons, conflicting signals and alternative explanations when supplied. Distinguish authored instructions from observed outcomes. Do not invent tactics when evidence is absent.'};
function fallback(p, reason) {
  const candidates=buildStories(p);if(candidates.length){const result=assembleStories({story_ids:candidates.sort((a,b)=>b.priority-a.priority).slice(0,p.viewer_mode==='quick'?2:4).map(s=>s.id)},p);return{...result,mode:'template',reason};}
  const ordered=[...p.facts.filter(f=>f.kind==='Possession sequence analysis'),...p.facts.filter(f=>f.kind!=='Possession sequence analysis')];
  return {mode:'template', reason, headline:'Your interval catch-up', paragraphs:(p.viewer_mode==='quick'?ordered.slice(0,2):ordered).map(f => ({text:f.text, evidence_ids:[f.id]})), limitations:p.limitations};
}
function comparisonSchema(p){
 const available=p.facts.filter(f=>f.comparison);
 const fields=['fact_id','team_id','metric','before','after','direction'];
 if(!available.length)return{type:'array',maxItems:0,items:{type:'object',additionalProperties:false,required:fields,properties:Object.fromEntries(fields.map(k=>[k,{type:['before','after'].includes(k)?'integer':'string'}]))}};
 return{type:'array',items:{anyOf:available.map(f=>({type:'object',additionalProperties:false,required:fields,properties:Object.fromEntries(fields.map(k=>[k,{type:['before','after'].includes(k)?'integer':'string',enum:[k==='fact_id'?f.id:f.comparison[k]]}]))}))}};
}
function schema(p) {
  return {
    type:'object', additionalProperties:false, required:['headline','paragraphs','limitations'],
    properties:{
      headline:{type:'string'},
      paragraphs:{type:'array', items:{
        type:'object', additionalProperties:false, required:['text','evidence_ids','comparisons'],
        properties:{comparisons:comparisonSchema(p),text:{type:'string'}, evidence_ids:{type:'array', items:{type:'string', enum:p.facts.map(f => f.id)}}}
      }},
      limitations:{type:'array', items:{type:'string'}}
    }
  };
}
// Numerical comparisons render directly in the interface. The model receives
// their calculated direction, rather than reconstructing count records.
function narrativePacket(p){
 const facts=p.facts.filter(f=>f.kind!=='Before and after the declared change').map(f=>{
  if(!f.comparison)return f;
  const c=f.comparison,name=f.text.split(':')[0],metric=c.metric==='shots'?'shot count':'completed-pass count';
  return{id:f.id,kind:'Calculated trend',text:`${name}'s ${metric} ${c.direction==='unchanged'?'was unchanged':c.direction} across equal windows around the recorded change. This describes activity, not its cause.`,event_ids:f.event_ids};
 });
 return{...p,facts};
}
function cleanCitationArtifacts(output){
 if(!Array.isArray(output?.paragraphs))return output;
 for(const para of output.paragraphs){if(typeof para.text!=='string'||!Array.isArray(para.evidence_ids))continue;
  para.text=para.text.replace(/\[([^\]]*)\]/g,(original,inside)=>{
   const ids=inside.split(',').map(x=>x.trim()).filter(Boolean);
   return ids.length===0||ids.every(id=>/^fact-\d+$/.test(id)&&para.evidence_ids.includes(id))?'':original;
  }).replace(/ +([.,;])/g,'$1').replace(/ {2,}/g,' ').trim();
 }
 return output;
}
async function explain(p, fetcher=fetch) {
  const narrative=narrativePacket(p),stories=buildStories(p);
  if (!configured()) return fallback(p, 'Microsoft Foundry is not configured. Showing the evidence-based template.');
  let failureCode='provider_unavailable';
  try {
    const base = new URL(process.env.AZURE_FOUNDRY_BASE_URL);
    if (base.protocol !== 'https:' || !base.hostname.endsWith('.openai.azure.com') || base.username || base.password || base.search || base.hash) throw Error('Unsupported endpoint');
    const response = await fetcher(new URL(base.href.replace(/\/$/, '') + '/responses'), {
      method:'POST', headers:{'Content-Type':'application/json','api-key':process.env.AZURE_FOUNDRY_API_KEY},
      signal:AbortSignal.timeout(20000),
      body:JSON.stringify({
        model:process.env.AZURE_FOUNDRY_DEPLOYMENT, instructions:stories.length?'Rank supported story IDs for a returning football viewer. Return only the requested JSON object; do not write paragraphs. Choose distinct IDs, never repeat one. Prefer explanations connecting evidence (role history, progression or contrasting passing/shooting) over a plain count summary when available. Preserve goals and dismissals. Respect player and team focus. '+(p.viewer_mode==='tactical'?'Choose up to four complementary stories.':'Choose up to two complementary stories.'):instruction+'\n'+modes[p.viewer_mode||'quick'], input:JSON.stringify(stories.length?{viewer_mode:p.viewer_mode,viewer_focus:p.viewer_focus||'neutral',player_focus:p.player_focus||null,interval:p.interval,stories}: {viewer_mode:p.viewer_mode||'quick',synthetic:p.synthetic,as_of:p.as_of,interval:p.interval,facts:narrative.facts.map(({id,text,comparison})=>({id,text,...(comparison?{comparison}:{} )})),limitations:p.limitations.map(x=>x.replace('Template-generated commentary from the revealed event stream. ',''))}),
        text:{format:{type:'json_schema',name:'commentary',strict:true,schema:stories.length?{type:'object',additionalProperties:false,required:['story_ids'],properties:{story_ids:{type:'array',minItems:1,maxItems:p.viewer_mode==='quick'?2:4,items:{type:'string',enum:stories.map(s=>s.id)}}}}:schema(narrative)}},
        max_output_tokens:2400,
        ...(process.env.AZURE_FOUNDRY_DEPLOYMENT === 'gpt-5-mini' ? {reasoning:{effort:'minimal'}} : {}),
        store:false
      })
    });
    if (!response.ok) {failureCode=response.status===429?'provider_rate_limit':response.status>=500?'provider_service_error':'provider_http_error';throw Error('Model request failed');}
    const data = await response.json();
    const raw = (data.output || []).filter(x => x.type === 'message').flatMap(x => x.content || []).filter(x => x.type === 'output_text').map(x => x.text).join('');
    failureCode=raw?'invalid_selection_or_output':'empty_provider_output';
    if(stories.length)return{...assembleStories(JSON.parse(raw),p),mode:'foundry',reason:'Microsoft Foundry ranked the stories; team focus and goal coverage are applied locally. Wording and figures come from scoped event evidence.'};
    const result = validateOutput(cleanCitationArtifacts(JSON.parse(raw)), narrative);
    return {...result,mode:'foundry',reason:'Generated through Microsoft Foundry. Fact references and limited number/timing checks passed; interpretation still needs review.'};
  } catch (error) {
    if(error.name==='TimeoutError'||error.name==='AbortError')failureCode='provider_timeout';
    return {...fallback(p, 'Online story selection is unavailable. Your evidence-based local commentary is shown instead.'),failure_code:failureCode};
  }
}
module.exports = {configured, explain, fallback, narrativePacket, cleanCitationArtifacts};
