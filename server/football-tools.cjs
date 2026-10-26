/* Deterministic, replay-scoped evidence tools. No tactical or causal inference. */
const {snapshot}=require('../squads.js');
const {analyseSequences}=require('./sequences.cjs');
const {contract,capabilities}=require('../match-package.js');
const ratio=(numerator,denominator)=>({numerator,denominator,value:denominator?numerator/denominator:null});
function roleHistory(data,{player_id,position,asOf,limit=5}){
 if(!Object.values(data.squads.teams).some(t=>t.players.some(p=>p.id===player_id)))throw Error('Unknown history player');
 if(typeof position!=='string'||!position||!Number.isFinite(asOf)||asOf<0||!Number.isInteger(limit)||limit<1||limit>20)throw Error('Invalid history query');
 const all=(data.history?.records||[]).filter(r=>r.player_id===player_id),available=all.filter(r=>r.happened_at<0&&r.available_at<=asOf).sort((a,b)=>b.happened_at-a.happened_at||a.id.localeCompare(b.id)),records=available.slice(0,limit),minutes=records.reduce((n,r)=>n+r.minutes,0),roleMinutes=records.filter(r=>r.position===position).reduce((n,r)=>n+r.minutes,0);
 return{status:!minutes?'missing':!roleMinutes?'not_recorded':roleMinutes<minutes/4?'limited_sample':'recorded_experience',as_of:asOf,position,records:records.length,minutes,role_minutes:roleMinutes,role_share:ratio(roleMinutes,minutes),available_records:available.length,omitted_older_records:Math.max(0,available.length-records.length),record_ids:records.map(r=>r.id),sources:records.map(r=>({id:r.id,source:r.source,available_at:r.available_at,happened_at:r.happened_at})),method:`Most recent ${limit} available prior-match records; role-minute share is sample familiarity, not ability. Zero-minute or absent records provide no usable denominator.`};
}
function stateAt(data,events,t,exclusive=false){const idx=events.findLastIndex(e=>exclusive?e.t<t:e.t<=t);if(idx<0)throw Error('No revealed squad state');return snapshot(events,idx,data.squads);}
function discipline(data,events,{from,to,asOf,endExclusive=false}){
 if(![from,to,asOf].every(Number.isFinite)||from<0||to<from||to>5400||to>Math.min(asOf,events.at(-1)?.t??0))throw Error('Invalid discipline interval');
 const seen=events.filter(e=>e.t<=asOf),start=stateAt(data,seen,from,from>0),end=stateAt(data,seen,to,endExclusive),cards=seen.filter(e=>e.t>=from&&(endExclusive?e.t<to:e.t<=to)&&['yellow_card','red_card'].includes(e.type));
 return{status:'available',from,to,teams:Object.keys(data.squads.teams).map(team_id=>{const a=start.teams[team_id],b=end.teams[team_id],count=t=>t.players.filter(p=>p.status==='On pitch').length,booked=t=>t.players.filter(p=>p.status==='On pitch'&&p.yellow>0).map(p=>p.id),own=cards.filter(e=>e.team_id===team_id);return{team_id,booked_on_pitch_share:ratio(booked(b).length,count(b)),on_pitch_start:count(a),on_pitch_end:count(b),booked_on_pitch_start:booked(a),booked_on_pitch_end:booked(b),yellow_events:own.filter(e=>e.type==='yellow_card').length,dismissals:own.filter(e=>e.type==='red_card').length,event_ids:own.map(e=>e.id),state_event_ids:seen.filter(e=>(endExclusive?e.t<to:e.t<=to)&&e.team_id===team_id&&['sub','yellow_card','red_card'].includes(e.type)).map(e=>e.id)};}),method:'Starting state excludes events at from (except kickoff); ending state includes events at to unless endExclusive is requested. Counts are recorded on-field players, not a risk estimate. Second-yellow records and dismissal records are separate events; do not add them as distinct people.'};
}
function formation(data,events,{from,to,asOf,endExclusive=false}){
 if(![from,to,asOf].every(Number.isFinite)||from<0||to<from||to>5400||to>Math.min(asOf,events.at(-1)?.t??0))throw Error('Invalid formation interval');
 const seen=events.filter(e=>e.t<=asOf),a=stateAt(data,seen,from,from>0),b=stateAt(data,seen,to,endExclusive);
 return{status:'available',from,to,teams:Object.keys(data.squads.teams).map(team_id=>{const changes=seen.filter(e=>e.t>=from&&(endExclusive?e.t<to:e.t<=to)&&e.type==='tactical_change'&&e.team_id===team_id);return{team_id,status:changes.length?'declared_changes':'no_recorded_change',before:a.teams[team_id].current_formation,after:b.teams[team_id].current_formation,changes:changes.map(e=>({id:e.id,at:e.t,from:e.from_formation,to:e.to_formation,assignments:e.assignments})),event_ids:seen.filter(e=>(endExclusive?e.t<to:e.t<=to)&&e.team_id===team_id&&e.type==='tactical_change').map(e=>e.id)};}),method:'Declared formations and role assignments only. No change record means no recorded declaration, not proof of unchanged on-field tactics.'};
}
function compareFootball(data,events,{boundary,asOf,window=300,trigger_id=null}){
 if(![boundary,asOf,window].every(Number.isFinite)||window<=0||boundary<0||asOf<0)throw Error('Invalid football comparison');
 const from=boundary-window,to=boundary+window,base={boundary,window,before:{from,to:boundary},after:{from:boundary,to},interval_convention:'[from,to)',available_at:to};
 if(from<0||to>5400||Math.min(asOf,events.at(-1)?.t??0)<to)return{...base,status:'insufficient_window',reason:'Two full equal clock windows are required.',teams:[]};
 const seen=events.filter(e=>e.t<=asOf),windows=[[from,boundary],[boundary,to]],other=seen.filter(e=>e.id!==trigger_id&&e.t>=from&&e.t<to&&['goal','sub','red_card','tactical_change'].includes(e.type));
 const teams=Object.keys(data.squads.teams).map(team_id=>{
  const sides=windows.map(([a,b])=>{const rows=seen.filter(e=>e.team_id===team_id&&e.t>=a&&e.t<b),passes=rows.filter(e=>e.type==='pass'),shots=rows.filter(e=>e.type==='shot'),sequenceInput=seen.filter(e=>e.t<b),supported=capabilities(data,sequenceInput).sequences;
   const seq=supported?analyseSequences(sequenceInput,{from:a,to:b,asOf:b,teams:data.squads.teams,direction:contract(data).direction}).teams.find(t=>t.team_id===team_id):null;
   return{duration_seconds:window,discipline:discipline(data,events,{from:a,to:b,asOf,endExclusive:true}).teams.find(t=>t.team_id===team_id),passes:passes.length,completed_passes:passes.filter(e=>e.outcome==='complete').length,pass_completion:ratio(passes.filter(e=>e.outcome==='complete').length,passes.length),shots:shots.length,shots_per_minute:ratio(shots.length,window/60),progression:seq?{status:seq.counts.complete_sequences?'available':'no_complete_sequences',counts:seq.counts,entry_share:ratio(seq.counts.attacking_third_entries,seq.counts.complete_sequences),shot_share:ratio(seq.counts.shot_sequences,seq.counts.complete_sequences),coverage:seq.coverage,event_ids:seq.event_ids}:{status:'unavailable',reason:'Complete possession IDs and spatial endpoints are required.',entry_share:null,shot_share:null},event_ids:rows.filter(e=>['pass','carry','shot'].includes(e.type)).map(e=>e.id)};});
  return{team_id,before:sides[0],after:sides[1]};
 });
 return{...base,status:'ready',teams,concurrent_changes:other.map(e=>({id:e.id,at:e.t,type:e.type,team_id:e.team_id})),formation:formation(data,events,{from,to,asOf,endExclusive:true}),discipline:discipline(data,events,{from,to,asOf,endExclusive:true}),method:'Equal clock exposure, not equal possession or player exposure. Pass attempts and complete possession groups are denominators. Counts do not measure chance quality or isolate a change effect. Comparison spans exclude the right endpoint.'};
}
function playerExposure(data,events,{player_id,from,to}){
 if(![from,to].every(Number.isFinite)||from<0||to<from||to>5400||to>(events.at(-1)?.t??0))throw Error('Invalid exposure interval');
 const team=Object.values(data.squads.teams).find(t=>t.players.some(p=>p.id===player_id));if(!team)throw Error('Unknown exposure player');
 let active=team.players.find(p=>p.id===player_id).starting,at=from,seconds=0;
 for(const e of events.filter(e=>e.t<to)){
  if(e.t>=from){if(active)seconds+=e.t-at;at=e.t;}
  if(e.type==='sub'){if(e.actor_id===player_id)active=true;if(e.outgoing_id===player_id)active=false;}
  if(e.type==='red_card'&&e.actor_id===player_id)active=false;
 }
 if(active)seconds+=to-at;
 return seconds;
}
module.exports={playerExposure,ratio,roleHistory,formation,discipline,compareFootball};
