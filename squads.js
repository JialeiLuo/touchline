/* Replay-prefix squad state. No inferred tactics or model calls. */
(function(root){
const data=typeof module!=='undefined'?require('./data/squads.js'):root.SQUAD_DATA;
function snapshot(events,index,squadData=data){
 if(!Number.isInteger(index)||index<0||index>=events.length)throw Error('Invalid replay position');
 const teams=JSON.parse(JSON.stringify(squadData.teams));
 for(const team of Object.values(teams)){team.current_formation=team.declared_formation;}
 for(const team of Object.values(teams))for(const p of team.players){p.status=p.starting?'On pitch':'Available substitute';p.yellow=0;p.red=false;}
 for(const e of events.slice(0,index+1)){
  const team=teams[e.team_id];if(!team)continue;
  if(e.type==='tactical_change'){team.current_formation=e.to_formation;team.formation_changed_at=e.t;for(const a of e.assignments||[]){const player=team.players.find(p=>p.id===a.player_id);if(player&&player.status==='On pitch'){player.assigned_position=a.position;player.slot={...a.slot};}}}
  const p=team.players.find(p=>p.id===e.actor_id);
  if(e.type==='yellow_card'&&p)p.yellow++;
  if(e.type==='red_card'&&p){p.status='Sent off';p.red=true;}
  if(e.type==='sub'){
   const out=team.players.find(p=>p.id===e.outgoing_id);
   if(!p||!out||p.status!=='Available substitute'||out.status!=='On pitch')throw Error('Invalid squad substitution');
   out.status='Substituted off';out.changed_at=e.t;p.status='On pitch';p.changed_at=e.t;p.assigned_position=out.assigned_position;p.slot={...out.slot};p.replaced=out.id;
  }
 }
 return{teams,as_of:events[index].t,provenance:squadData.provenance||{limitations:'User-supplied synthetic squad metadata; declared slots are not tracking.'}};
}
root.Squads={snapshot,data};if(typeof module!=='undefined')module.exports={snapshot,data};
})(globalThis);
