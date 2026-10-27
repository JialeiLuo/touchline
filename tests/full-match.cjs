const A=require('node:assert/strict'),F=require('../full-match.js');A.deepEqual(F.simulate(7),F.simulate(7));A.throws(()=>F.simulate(-1));
for(let seed=0;seed<60;seed++){const d=F.simulate(seed),ids=new Set();let t=-1;const removed=new Set();for(const e of d.events){A(e.t>=t);t=e.t;A(!ids.has(e.id));ids.add(e.id);if(['pass','carry','shot'].includes(e.type))A(!removed.has(e.actor_id));if(e.type==='sub')removed.add(e.outgoing_id);if(e.type==='red_card')removed.add(e.actor_id);if(e.x!==undefined){A(e.x>=0&&e.x<=105);A(e.y>=0&&e.y<=68)}}A.equal(t,d.clock.periods[1].end);A.equal(d.events.filter(e=>e.type==='half_time').length,1);A.equal(d.events.filter(e=>e.type==='full_time').length,1);const s=F.stats(d.events,d.events.length-1);for(const k of ['northbridge','southport']){const r=s[k];A(r.onTarget<=r.shots);A(r.goals<=r.onTarget);A(r.completed<=r.passes);A.equal(r.goals,d.events.filter(e=>e.team_id===k&&e.type==='shot'&&e.outcome==='goal').length);A.equal(r.controlledSeconds,d.events.filter(e=>e.team_id===k&&e.type==='possession_end').reduce((a,e)=>a+e.duration,0))}A.equal(F.stats(d.events,0).northbridge.shots,0)}
console.log('60 full-match seeds pass timing, identity, cards/substitution eligibility, goal/shot consistency, possession accounting and initial-prefix checks.');

for(let seed=0;seed<60;seed++){
 const d=F.simulate(seed),active={},roles={};
 for(const [key,team] of Object.entries(d.squads.teams)){active[key]=new Set(team.players.filter(p=>p.starting).map(p=>p.id));for(const p of team.players)roles[p.id]=p.usual_position;}
 for(const e of d.events){
  if(['pass','carry','shot','foul','save'].includes(e.type)){A(active[e.team_id].has(e.actor_id),`Inactive actor ${e.actor_id}`);A.equal(roles[e.actor_id]==='GK',e.type==='save','Keeper/outfield action mismatch');}
  if(e.type==='pass'){A.notEqual(e.recipient_id,e.actor_id);A(active[e.team_id].has(e.recipient_id));A.notEqual(roles[e.recipient_id],'GK');}
  if(e.type==='sub'){A(active[e.team_id].has(e.outgoing_id));A(!active[e.team_id].has(e.actor_id));active[e.team_id].delete(e.outgoing_id);active[e.team_id].add(e.actor_id);}
  if(e.type==='red_card')active[e.team_id].delete(e.actor_id);
 }
 A.equal(d.provenance.version,'0.4');A.equal(d.provenance.randomness.seed,seed);
}
console.log('Role checks: 60 seeds pass named keeper saves, outfield-only actions, no self-passes, active recipients and versioned random provenance.');
