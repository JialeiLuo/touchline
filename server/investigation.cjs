const MatchClock=require('../match-clock.js');
const {roleHistory,ratio,playerExposure}=require('./football-tools.cjs');
/* Explicit investigation steps; deterministic tools, no causal effect estimate. */
function investigateSubstitutions(data,seen,from,to,contexts){
 return contexts.map(c=>{
  const history=roleHistory(data,{player_id:c.player_id,position:c.assigned_position,asOf:c.at}),window=300,ready=c.at>=window&&c.at+window<=MatchClock.end(data)&&to>=c.at+window&&seen.at(-1).t>=c.at+window;
  const actions=(id,a,b)=>seen.filter(e=>e.actor_id===id&&e.t>=a&&e.t<b&&['pass','carry','shot'].includes(e.type));
  const old=ready?actions(seen.find(e=>e.id===c.event_id).outgoing_id,c.at-window,c.at):[],incoming=ready?actions(c.player_id,c.at,c.at+window):[];
  const count=(list,id,a,b)=>!ready?{duration_seconds:window,on_pitch_seconds:null,pass_completion:null,passes:null,completed:null,shots:null,carries:null}:({duration_seconds:window,on_pitch_seconds:ready?playerExposure(data,seen,{player_id:id,from:a,to:b}):null,pass_completion:ratio(list.filter(e=>e.type==='pass'&&e.outcome==='complete').length,list.filter(e=>e.type==='pass').length),passes:list.filter(e=>e.type==='pass').length,completed:list.filter(e=>e.type==='pass'&&e.outcome==='complete').length,shots:list.filter(e=>e.type==='shot').length,carries:list.filter(e=>e.type==='carry').length});
  const otherChanges=seen.filter(e=>e.id!==c.event_id&&e.t>=c.at-window&&e.t<c.at+window&&e.t<=to&&['goal','red_card','sub','tactical_change'].includes(e.type));
  const trace=[{tool:'retrieve_role_history',status:history.status,as_of:c.at,record_ids:history.record_ids},{tool:'compare_player_windows',status:ready?'ready':'waiting',before:{from:c.at-window,to:c.at},after:{from:c.at,to:c.at+window}},{tool:'check_other_changes',status:'complete',event_ids:otherChanges.map(e=>e.id)}];
  return{player_id:c.player_id,team_id:c.team_id,name:c.player_name,team_name:c.team_name,assigned_position:c.assigned_position,at:c.at,history,comparison:{status:ready?'ready':'waiting',before:count(old,seen.find(e=>e.id===c.event_id).outgoing_id,c.at-window,c.at),after:count(incoming,c.player_id,c.at,c.at+window),before_window:{from:c.at-window,to:c.at},after_window:{from:c.at,to:c.at+window},interval_convention:'[from,to)',method:'Equal clock windows; on_pitch_seconds reports actual player exposure. Unequal exposure and concurrent changes prevent attributing differences to the substitution.',event_ids:[...old,...incoming].map(e=>e.id)},other_change_ids:otherChanges.map(e=>e.id),trace,event_ids:[c.event_id,...old,...incoming,...otherChanges].map(e=>typeof e==='string'?e:e.id)};
 });
}
module.exports={investigateSubstitutions};
