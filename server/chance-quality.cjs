/* Supplied pre-shot values only; never fits a model or infers missing values. */
function analyseChanceQuality(data,events,{from,to,asOf,endExclusive=false}){
 if(![from,to,asOf].every(Number.isFinite)||from<0||to<from||to>5400||to>asOf)throw Error('Invalid chance-quality interval');
 const cutoff=Math.min(to,asOf),visible=events.filter(e=>endExclusive?e.t<cutoff:e.t<=cutoff),inside=e=>e.t>=from&&(endExclusive?e.t<to:e.t<=to),catalogue=new Map((data.xg_sources||[]).map(s=>[s.id,s]));
 const shots=visible.filter(e=>e.type==='shot'&&inside(e)).map(e=>{
  const available=e.xg&&(endExclusive?(e.xg.available_at??e.t)<cutoff:(e.xg.available_at??e.t)<=cutoff),source=available?catalogue.get(e.xg.source_id):null;
  const linked=visible.find(g=>g.type==='goal'&&(g.shot_id?g.shot_id===e.id:g.team_id===e.team_id&&g.actor_id===e.actor_id&&g.t===e.t));
  return{shot_id:e.id,team_id:e.team_id,player_id:e.actor_id,t:e.t,outcome:e.outcome,goal_id:linked?.id??null,xg:source?e.xg.value:null,source_id:source?.id??null,availability:source?'available':e.xg?'not_available_at_cutoff':'not_supplied'};
 });
 const teams=Object.entries(data.squads.teams).map(([team_id,team])=>{
  const own=shots.filter(s=>s.team_id===team_id),covered=own.filter(s=>s.xg!==null),ids=[...new Set(covered.map(s=>s.source_id))],groups=ids.map(source_id=>{const rows=covered.filter(s=>s.source_id===source_id);return{source:catalogue.get(source_id),shot_count:rows.length,xg_sum:rows.reduce((n,s)=>n+s.xg,0),goals:rows.filter(s=>s.goal_id).length,shot_ids:rows.map(s=>s.shot_id),goal_ids:rows.map(s=>s.goal_id).filter(Boolean)};});
  const status=!own.length?'no_shots':!covered.length?'unavailable':covered.length<own.length?'partial':groups.length>1?'mixed_sources':'complete',known=groups.length===1?groups[0].xg_sum:null,total=status==='no_shots'?0:status==='complete'?known:null;
  return{team_id,team_name:team.name,status,shots:own.length,covered_shots:covered.length,missing_shots:own.length-covered.length,goals:own.filter(s=>s.goal_id).length,xg_total:total,xg_per_shot:status==='complete'?total/own.length:null,known_xg_sum:known,source_groups:groups,event_ids:own.flatMap(s=>[s.shot_id,...(s.goal_id?[s.goal_id]:[])])};
 });
 return{from,to,as_of:cutoff,interval_convention:endExclusive?'[from,to)':'[from,to]',shots,teams,method:'Pre-shot values are supplied on shot events. Goals are linked outcomes, never additional xG. Missing or delayed values are not zero. Different source IDs are reported separately; total and average require complete single-source coverage. All matches are synthetic; illustrative values are not calibrated professional xG and supplied provenance is not independently verified.'};
}
module.exports={analyseChanceQuality};
