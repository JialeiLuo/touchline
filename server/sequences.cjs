/* Ball-event sequences, not off-ball tracking. Direction matches the simulator. */
function analyseSequences(events,{from,to,asOf,teams}){
 const visible=events.filter(e=>e.t<=Math.min(to,asOf)),groups=new Map();
 for(const e of visible){if(!e.possession_id)continue;if(!groups.has(e.possession_id))groups.set(e.possession_id,[]);groups.get(e.possession_id).push(e)}
 const results=[];
 for(const[team_id,team]of Object.entries(teams)){
  const sequences=[];
  for(const[id,rows]of groups){
   const actions=rows.filter(e=>e.team_id===team_id&&['pass','carry'].includes(e.type));
   const end=rows.find(e=>e.type==='possession_end'&&e.team_id===team_id);
   if(!actions.length||!end||actions[0].t-(actions[0].duration||0)<from||end.t>to)continue;
   const located=actions.filter(e=>Number.isFinite(e.x)),progress=e=>team_id==='northbridge'?e.x:105-e.x;
   const reached=located.some(e=>progress(e)>=70&&e.outcome==='complete');
   const shot=rows.some(e=>e.type==='shot'&&e.team_id===team_id),last=actions.at(-1);
   sequences.push({id,start:actions[0].t,end:end.t,actions:actions.length,reached_final_third:reached,shot,ending:last.outcome==='lost'?'lost possession':shot?'shot recorded':'sequence ended',players:[...new Set(actions.map(e=>e.actor_id).filter(Boolean))],event_ids:rows.map(e=>e.id),max_progress:located.length?Math.max(...located.map(progress)):null});
  }
  const reached=sequences.filter(s=>s.reached_final_third).length,shots=sequences.filter(s=>s.shot).length,lostEarly=sequences.filter(s=>s.ending==='lost possession'&&!s.reached_final_third).length;
  let story=sequences.length?`${team.name}: ${sequences.length} complete recorded possession sequences; ${reached} reached the attacking third through a completed action, ${shots} included a shot, and ${lostEarly} ended with a failed action before a completed attacking-third entry.`:`${team.name}: no complete recorded possession sequences are available in this interval.`;
  if(sequences.length>=3&&reached===0)story+=' Their completed sequences did not carry a successful action into the attacking third; the passing activity stayed short of that zone.';
  else if(reached>=2&&shots===0)story+=' They reached advanced territory repeatedly, but none of these complete sequences produced a recorded shot.';
  const examples=[...sequences].sort((a,b)=>(b.shot-a.shot)||(Number(b.reached_final_third)-Number(a.reached_final_third))||((b.max_progress??-1)-(a.max_progress??-1))).slice(0,3);
  results.push({team_id,team_name:team.name,counts:{complete_sequences:sequences.length,attacking_third_entries:reached,shot_sequences:shots,early_losses:lostEarly},story,examples,event_ids:sequences.flatMap(s=>s.event_ids)});
 }
 return{from,to,method:'Complete possession_id groups only; boundary-crossing or unfinished groups excluded. Attacking third uses successful action endpoint x>=70 for Northbridge, x<=35 for Southport. Fixed direction follows the synthetic simulator; no tracking, pressure or support inferred.',teams:results};
}
module.exports={analyseSequences};
