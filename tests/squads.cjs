const A=require('node:assert/strict'),F=require('../full-match.js'),S=require('../squads.js');
for(let seed=0;seed<60;seed++){
 const d=F.simulate(seed),start=S.snapshot(d.events,0),end=S.snapshot(d.events,d.events.length-1);
 for(const team of Object.values(start.teams)){A.equal(team.players.filter(p=>p.starting).length,11);A.equal(team.players.filter(p=>p.status==='On pitch').length,11);A.equal(new Set(team.players.map(p=>p.shirt_number)).size,team.players.length);}
 for(let i=0;i<d.events.length;i++)if(['sub','red_card'].includes(d.events[i].type)){
  const e=d.events[i],before=S.snapshot(d.events,i-1),after=S.snapshot(d.events,i),person=after.teams[e.team_id].players.find(p=>p.id===e.actor_id);
  if(e.type==='sub'){A.equal(before.teams[e.team_id].players.find(p=>p.id===e.actor_id).status,'Available substitute');A.equal(person.status,'On pitch');A.equal(after.teams[e.team_id].players.find(p=>p.id===e.outgoing_id).status,'Substituted off');A.equal(person.replaced,e.outgoing_id);}
  else {A.equal(person.status,'Sent off');A(person.red);}
 }
 A.deepEqual(S.snapshot(d.events,0),start);A.deepEqual(d.squads,S.data);
 for(const e of d.events.filter(e=>['pass','carry','shot'].includes(e.type)))A(S.data.teams[e.team_id].players.some(p=>p.id===e.actor_id));
}
A.deepEqual(require('../data/squads.json'),S.data);
console.log('Squads: 60 seeds pass kickoff XI, actor linkage, substitution/dismissal boundaries, rewind, export provenance and JSON mirror checks.');
