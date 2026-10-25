const A=require('node:assert/strict'),F=require('../full-match.js'),S=require('../squads.js'),C=require('../catchup.js'),{packet}=require('../server/evidence.cjs');
for(let seed=0;seed<60;seed++){
 const d=F.simulate(seed),at=d.events.findIndex(e=>e.type==='tactical_change');
 if(seed%2===0){A.equal(at,-1);A.equal(S.snapshot(d.events,d.events.length-1).teams.northbridge.current_formation,'4-3-3');continue;}
 A(at>0);const before=S.snapshot(d.events,at-1),after=S.snapshot(d.events,at);
 A.equal(before.teams.northbridge.current_formation,'4-3-3');A.equal(after.teams.northbridge.current_formation,'4-2-3-1');
 const mason=after.teams.northbridge.players.find(p=>p.id==='Mason');if(mason.status==='On pitch')A.equal(mason.assigned_position,'AM');
 A.equal(S.snapshot(d.events,0).teams.northbridge.current_formation,'4-3-3');
 const end=d.events.findIndex(e=>e.t>=3000),later=d.events.findIndex(e=>e.t>=3600);
 const pending=C.report(d.events,at,2400,2700);A(pending.blocks.some(b=>b.text.includes('not been revealed')));A(!pending.blocks.some(b=>b.title==='Before and after the declared change'));
 const ready=C.report(d.events,end,2400,3000);const comparison=ready.blocks.find(b=>b.title==='Before and after the declared change');A(comparison);A(comparison.evidence_ids.every(id=>d.events.find(e=>e.id===id).t<3000));
 const p=packet({seed,index:later,from:2400,to:2999});A(!p.facts.some(f=>f.text.includes('completed passes were')));
 const control=C.report(F.simulate(seed-1).events,F.simulate(seed-1).events.findIndex(e=>e.t>=3000),2400,3000);A(!control.blocks.some(b=>b.title==='A recorded tactical change'));
}
console.log('Tactics: 60 seeds pass declared-shape timing, rewind, role assignment, matched windows, future-window exclusion and unchanged-shape controls. No causal validation claimed.');
