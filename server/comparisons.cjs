/* Deterministic evidence tool. Equal clock windows are descriptive, not causal. */
function compareWindows(events,{boundary,asOf,window=300,teams,match_end=events.findLast(e=>e.type==='full_time')?.t??Infinity}){
 if(!Number.isFinite(boundary)||!Number.isFinite(asOf)||!Number.isFinite(window)||window<=0)throw Error('Invalid comparison window');
 const start=boundary-window,end=boundary+window;
 if(start<0||end>match_end||asOf<end)return{status:'insufficient_window',boundary,window,available_at:end,observations:[]};
 const visible=events.filter(e=>e.t<=asOf),before=visible.filter(e=>e.t>=start&&e.t<boundary),after=visible.filter(e=>e.t>=boundary&&e.t<end);
 const metrics={shots:e=>e.type==='shot',completed_passes:e=>e.type==='pass'&&e.outcome==='complete'};
 const observations=[];
 for(const team of teams)for(const[metric,accept]of Object.entries(metrics)){
  const a=before.filter(e=>e.team_id===team&&accept(e)),b=after.filter(e=>e.team_id===team&&accept(e));
  observations.push({team_id:team,metric,before:a.length,after:b.length,delta:b.length-a.length,direction:b.length>a.length?'increased':b.length<a.length?'decreased':'unchanged',event_ids:[...a,...b].map(e=>e.id)});
 }
 return{status:'ready',boundary,window,before:{from:start,to:boundary},after:{from:boundary,to:end},interval_convention:'[from,to)',observations};
}
function validateComparisons(output,packet){
 const facts=new Map(packet.facts.map(f=>[f.id,f]));
 for(const para of output.paragraphs){
  const expected=para.evidence_ids.filter(id=>facts.get(id)?.comparison);
  if(expected.length&&(!Array.isArray(para.comparisons)||expected.some(id=>!para.comparisons.some(c=>c.fact_id===id))))throw Error('Missing structured comparison');
  if(para.comparisons!==undefined&&!Array.isArray(para.comparisons))throw Error('Invalid structured comparison');
  for(const c of para.comparisons||[]){
  const source=facts.get(c.fact_id)?.comparison;
  if(!para.evidence_ids.includes(c.fact_id)||!source||['team_id','metric','before','after','direction'].some(k=>c[k]!==source[k]))throw Error('Unsupported structured comparison');
 }
 }
 return output;
}
module.exports={compareWindows,validateComparisons};
