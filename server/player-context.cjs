/* Interval involvement counts, not performance ratings or inferred movement. */
function playerContext(data,events,index,from,to,id){
 if(!id)return null;
 let player,team;for(const value of Object.values(data.squads.teams)){const found=value.players.find(p=>p.id===id);if(found){player=found;team=value;break}}
 if(!player)throw Error('Unknown player focus');
 const seen=events.slice(0,index+1).filter(e=>e.t>=from&&e.t<=to),actions=seen.filter(e=>e.actor_id===id),passes=actions.filter(e=>e.type==='pass'),shots=actions.filter(e=>e.type==='shot'),received=seen.filter(e=>e.type==='pass'&&e.outcome==='complete'&&e.recipient_id===id),sub=seen.find(e=>e.type==='sub'&&(e.actor_id===id||e.outgoing_id===id));
 const cutoff=events.slice(0,index+1).findLastIndex(e=>e.t<=to),status=require('../squads.js').snapshot(events,cutoff,data.squads).teams[team.id].players.find(p=>p.id===id).status;
 const source=seen.filter(e=>e.actor_id===id||e.recipient_id===id||e.outgoing_id===id);
 return{status,player_id:id,name:player.name,team_id:team.id,team_name:team.name,usual_position:player.usual_position,passes:passes.length,completed_passes:passes.filter(e=>e.outcome==='complete').length,received_passes:received.length,carries:actions.filter(e=>e.type==='carry').length,shots:shots.length,goals:actions.filter(e=>e.type==='goal').length,yellow:actions.filter(e=>e.type==='yellow_card').length,red:actions.filter(e=>e.type==='red_card').length,substitution:sub?{at:sub.t,incoming:sub.actor_id===id}:null,event_ids:source.map(e=>e.id)};
}
module.exports={playerContext};
