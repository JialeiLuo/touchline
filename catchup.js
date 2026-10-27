/* Evidence-grounded narrative builder. Templates, not an LLM. */
(function(root){
const Clock=typeof module!=='undefined'?require('./match-clock.js'):root.MatchClock;
function report(events,index,from,to,teamNames=null,data=null){const label=e=>Clock.format(data||{},e);
 if(!Number.isFinite(from)||!Number.isFinite(to)||from<0||to<=from)throw Error('Choose an end time after the start.');
 const seen=events.slice(0,index+1);if(!seen.length||to>seen.at(-1).t)throw Error('Advance the replay before requesting this end time.');
 const period=seen.filter(e=>e.t>=from&&e.t<=to),name=k=>teamNames?.[k]?.name||(k==='northbridge'?'Northbridge':k==='southport'?'Southport':k);
 const blocks=[];const add=(title,text,evidence)=>blocks.push({title,text,evidence_ids:evidence.map(e=>e.id)});
 const goals=period.filter(e=>e.type==='goal'),shots=period.filter(e=>e.type==='shot');
 if(goals.length)add('The score changed',goals.map(e=>`${label(e)}: ${name(e.team_id)} scored through ${e.actor_id}`).join('. ')+'.',goals);
 const threat={northbridge:shots.filter(e=>e.team_id==='northbridge'),southport:shots.filter(e=>e.team_id==='southport')};
 if(shots.length){const a=threat.northbridge.length,b=threat.southport.length,leader=a>b?'northbridge':b>a?'southport':null;const saved=shots.filter(e=>e.outcome==='saved');add('Where the chances came',leader?`${name(leader)} produced more attempts during this spell (${Math.max(a,b)} against ${Math.min(a,b)}). ${saved.length?`${saved.length} attempt(s) required a save.`:'No attempts were recorded as saved.'} Shot counts alone do not establish chance quality or overall dominance.`:`Both sides produced ${a} attempt(s). ${saved.length} required a save; the balance of shots alone does not tell us who controlled the game.`,shots)}
 for(const change of period.filter(e=>e.type==='sub')){const involved=shots.filter(e=>e.t>=change.t&&e.actor_id===change.actor_id);add('A personnel change', `At ${label(change)}, ${name(change.team_id)} introduced ${change.actor_id} for ${change.outgoing_id}.${involved.length?` The substitute subsequently took ${involved.length} shot(s) in this interval.`:' No subsequent shot by the substitute is recorded in this interval.'} This is a direct contribution check, not proof of a tactical improvement.`,[change,...involved])}
 const reds=period.filter(e=>e.type==='red_card');for(const red of reds)add('A dismissal changed the numbers',`${red.actor_id} was sent off for ${name(red.team_id)}${red.reason==='second_yellow'?' after a second yellow':''}. That changes the available personnel, but the event stream alone does not establish how the team reorganised.`,[red]);
 const yellows=period.filter(e=>e.type==='yellow_card');if(yellows.length)add('Discipline to watch',`${yellows.map(e=>e.actor_id).join(', ')} received a yellow card. We would need comparable defensive actions before claiming that a booked player became more cautious.`,yellows);
 const tactics=period.filter(e=>e.type==='tactical_change');
 for(const change of tactics){
  add('A recorded tactical change',`${name(change.team_id)} declared a change from ${change.from_formation} to ${change.to_formation} at ${label(change)}. This is an explicit synthetic instruction, not a formation inferred from video. Its effect still needs assessment.`,[change]);
  const boundary=change.t+300;
  if(to<boundary){add('Wait for a comparable window','The full post-change comparison window has not been revealed in this selected interval. No before/after effect is claimed.',[change]);continue;}
  const prior=seen.filter(e=>e.t>=change.t-300&&e.t<change.t&&e.team_id===change.team_id),after=seen.filter(e=>e.t>=change.t&&e.t<boundary&&e.team_id===change.team_id);
  const count=(list,type)=>list.filter(e=>e.type===type).length,success=list=>list.filter(e=>e.type==='pass'&&e.outcome==='complete').length;
  add('Before and after the declared change',`Comparison windows: ${label(change.t-300)}–${label(change)} before, ${label(change)}–${label(boundary)} after. ${name(change.team_id)} recorded ${count(prior,'shot')} shots before and ${count(after,'shot')} after; completed passes were ${success(prior)} before and ${success(after)} after. These equal match-clock windows describe recorded activity. Different opponents' actions, game state and chance variation remain alternative explanations; the comparison does not establish a causal formation effect.`,[change,...prior.filter(e=>['pass','shot'].includes(e.type)),...after.filter(e=>['pass','shot'].includes(e.type))]);
 }
 if(!blocks.length)add('No major recorded incident',period.length?'This interval contains routine play but no recorded goal, shot, card, substitution or tactical change. That does not prove that the play was uneventful.':'No events are recorded in this interval.',period.slice(0,3));
 return{from,to,blocks,coverage:'Template-generated commentary from the revealed event stream. Formation, off-ball movement and chance quality are not inferred from sparse events.',event_count:period.length};
}
root.Catchup={report};if(typeof module!=='undefined')module.exports={report};
})(globalThis);
