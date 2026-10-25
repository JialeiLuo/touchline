/* Explicit investigation steps; deterministic tools, no causal effect estimate. */
function investigateSubstitutions(data,seen,from,to,contexts){
 return contexts.map(c=>{
  const records=(data.history?.records||[]).filter(r=>r.player_id===c.player_id&&r.happened_at<0&&r.available_at<=c.at).sort((a,b)=>b.happened_at-a.happened_at).slice(0,5);
  const minutes=records.reduce((n,r)=>n+r.minutes,0),roleMinutes=records.filter(r=>r.position===c.assigned_position).reduce((n,r)=>n+r.minutes,0),window=300,ready=c.at>=window&&to>=c.at+window&&seen.at(-1).t>=c.at+window;
  const actions=(id,a,b)=>seen.filter(e=>e.actor_id===id&&e.t>=a&&e.t<b&&['pass','carry','shot'].includes(e.type));
  const old=ready?actions(seen.find(e=>e.id===c.event_id).outgoing_id,c.at-window,c.at):[],incoming=ready?actions(c.player_id,c.at,c.at+window):[];
  const count=list=>({passes:list.filter(e=>e.type==='pass').length,completed:list.filter(e=>e.type==='pass'&&e.outcome==='complete').length,shots:list.filter(e=>e.type==='shot').length,carries:list.filter(e=>e.type==='carry').length});
  const otherChanges=seen.filter(e=>e.id!==c.event_id&&e.t>=c.at-window&&e.t<c.at+window&&e.t<=to&&['goal','red_card','sub','tactical_change'].includes(e.type));
  const trace=[{tool:'retrieve_role_history',status:records.length?'available':'missing',as_of:c.at,record_ids:records.map(r=>r.id)},{tool:'compare_player_windows',status:ready?'ready':'waiting',before:{from:c.at-window,to:c.at},after:{from:c.at,to:c.at+window}},{tool:'check_other_changes',status:'complete',event_ids:otherChanges.map(e=>e.id)}];
  return{player_id:c.player_id,team_id:c.team_id,name:c.player_name,team_name:c.team_name,assigned_position:c.assigned_position,at:c.at,history:{records:records.length,minutes,role_minutes:roleMinutes,record_ids:records.map(r=>r.id),status:!records.length||minutes===0?'missing':roleMinutes===0?'not_recorded':roleMinutes<minutes/4?'limited_sample':'recorded_experience'},comparison:{status:ready?'ready':'waiting',before:count(old),after:count(incoming),event_ids:[...old,...incoming].map(e=>e.id)},other_change_ids:otherChanges.map(e=>e.id),trace,event_ids:[c.event_id,...old,...incoming,...otherChanges].map(e=>typeof e==='string'?e:e.id)};
 });
}
module.exports={investigateSubstitutions};
