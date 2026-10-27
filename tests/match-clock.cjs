const A=require('node:assert/strict'),Clock=require('../match-clock.js'),F=require('../full-match.js'),P=require('../match-package.js'),{packet}=require('../server/evidence.cjs'),{fallback}=require('../server/provider.cjs'),store=require('../server/package-store.cjs');
// New generator spans zero, short and longer added time and keeps legacy output reproducible.
for(let seed=0;seed<60;seed++){
 const d=F.simulate(seed),p=P.fromReplay(d);P.validate(p);A.equal(p.package_version,'2');A.deepEqual(F.simulate(seed),d);
 for(const period of d.clock.periods){const rows=d.events.filter(e=>e.period===period.period),announcement=rows.find(e=>e.type==='added_time');A(announcement);A(period.end>=period.start+2700+announcement.minimum_seconds);A.equal(rows.at(-1).t,period.end);A.equal(rows.at(-1).type,period.period===1?'half_time':'full_time');}
}
const long=F.simulate(3,{added_time:[{minimum:900,actual:900},{minimum:900,actual:900}]});P.validate(P.fromReplay(long));A.equal(Clock.format(long,long.events.at(-1)),'90+15:00');
const data=P.fromReplay(F.simulate(1,{added_time:[{minimum:120,actual:180},{minimum:180,actual:240}]}));
const actor=team=>data.squads.teams[team].players.find(p=>p.starting&&p.assigned_position!=='GK').id;
const sub=team=>({actor_id:data.squads.teams[team].players.find(p=>!p.starting&&p.usual_position==='ST').id,outgoing_id:data.squads.teams[team].players.find(p=>p.starting&&p.assigned_position==='RW').id,team_id:team});
const ev=(id,t,period,type,extra={})=>({id,t,period,type,synthetic:true,...extra});
data.events=[ev('start',0,1,'kickoff'),ev('a1',2700,1,'added_time',{minimum_seconds:120}),ev('shot1',2820,1,'shot',{team_id:'northbridge',actor_id:actor('northbridge'),outcome:'goal',xg:{value:.2,source_id:'touchline-illustrative-v1'}}),ev('goal1',2820,1,'goal',{team_id:'northbridge',actor_id:actor('northbridge'),shot_id:'shot1'}),ev('ht',2880,1,'half_time'),ev('second',2880,2,'kickoff'),ev('foul',3000,2,'foul',{team_id:'northbridge',actor_id:actor('northbridge')}),ev('card',3000,2,'yellow_card',{team_id:'northbridge',actor_id:actor('northbridge')}),ev('early-sub',5390,2,'sub',sub('northbridge')),ev('a2',5580,2,'added_time',{minimum_seconds:180}),ev('late-sub',5700,2,'sub',sub('southport')),ev('report-ready',5710,2,'restart'),ev('late-shot',5810,2,'shot',{team_id:'southport',actor_id:sub('southport').actor_id,outcome:'goal',xg:{value:.3,source_id:'touchline-illustrative-v1',available_at:5815}}),ev('late-goal',5810,2,'goal',{team_id:'southport',actor_id:sub('southport').actor_id,shot_id:'late-shot'}),ev('value-ready',5815,2,'restart'),ev('pre-whistle',5820,2,'restart'),ev('ft',5820,2,'full_time')];
data.annotations=[{id:'report',kind:'incident',happened_at:5700,available_at:5710,description:'Initial account.',source:'Authored test',status:'reported',synthetic:true},{id:'correction',kind:'incident',happened_at:5700,available_at:5810,description:'Corrected account.',source:'Authored test',status:'corrected',supersedes:'report',synthetic:true}];
data.history.records.push({id:'late-history',player_id:sub('southport').actor_id,match_id:'late-history',happened_at:-10,available_at:5790,position:'RW',minutes:90,source:'Delayed test history',synthetic:true});P.validate(data);
A.equal(Clock.format(data,data.events[2]),'45+2:00');A.equal(Clock.format(data,data.events[6]),'47:00');A.notEqual(Clock.parse(data,'45+2'),Clock.parse(data,'47'));
for(const time of ['45+2','47','90+3:50','H2 45:00'])A.equal(Clock.parse(data,Clock.input(data,Clock.parse(data,time))),Clock.parse(data,time));
A.throws(()=>Clock.parse(data,'90+16'));A.throws(()=>Clock.parse(data,'45+4'));A.throws(()=>Clock.parse(data,'92'));A.throws(()=>Clock.parse(data,'65.5'));
const id=store.put(data),get=(index,to,from=0)=>packet({package_id:id,index,from,to,viewer_mode:'tactical'});
try{
 const beforeHalf=get(3,2820);A.equal(beforeHalf.match_complete,false);A(!('end'in beforeHalf.clock.periods[0]));A.equal(beforeHalf.clock.periods.length,1);A.match(beforeHalf.facts.find(f=>f.kind==='The score changed').text,/45\+2:00/);
 const beforeAnnouncement=get(0,0.1); // This request must reject an unrevealed end.
 A.fail('Future interval unexpectedly accepted');
}catch(e){A.match(e.message,/Advance the replay/);}
try{
 const opening=get(0,0.001);A.fail('unrevealed end accepted');
}catch(e){A.match(e.message,/Advance the replay/);}
try{
 const regularEnd=get(9,5580);A.equal(regularEnd.match_complete,false);A(!regularEnd.clock.periods[1].end);A.equal(regularEnd.clock.periods[1].announced_minimum_seconds,180);A.equal(fallback(regularEnd,'test').watch_label,'What to watch next');
 const beforeGoal=get(data.events.findIndex(e=>e.id==='report-ready'),5710,5580);A.equal(beforeGoal.chance_quality.teams[1].shots,0);A.equal(beforeGoal.annotations[0].id,'report');A.throws(()=>get(data.events.findIndex(e=>e.id==='report-ready'),5810),/Advance/);
 const delayed=get(data.events.findIndex(e=>e.id==='late-goal'),5810,5580);A.equal(delayed.chance_quality.teams[1].xg_total,null);A.equal(delayed.annotations[0].id,'correction');
 const ready=get(data.events.findIndex(e=>e.id==='value-ready'),5815,5580);A.equal(ready.chance_quality.teams[1].goals,1);A.equal(ready.chance_quality.teams[1].xg_total,.3);
 const sameTime=get(data.events.findIndex(e=>e.id==='pre-whistle'),5820);A.equal(sameTime.match_complete,false);A(!sameTime.clock.periods[1].end);
 const final=get(data.events.findIndex(e=>e.id==='ft'),5820),out=fallback(final,'test');A.equal(final.match_complete,true);A.equal(out.watch_label,'Replay takeaway');A.equal(final.clock.periods[1].end,5820);A.equal(final.facts.find(f=>f.kind==='Interval situation').score_end.join(','),'1,1');
 const early=final.investigations.find(i=>i.player_id===sub('northbridge').actor_id),late=final.investigations.find(i=>i.player_id===sub('southport').actor_id);A.equal(early.comparison.status,'ready');A.equal(late.comparison.status,'waiting');A(!late.history.record_ids.includes('late-history'));
 A.equal(final.events.filter(e=>e.id==='late-goal').length,1);A(final.facts.some(f=>f.text.includes('90+3:50')));
 // Reimport preserves every clock, statistic and source. Full built-in/export parity includes added time.
 for(const seed of [1,2,7]){const d=F.simulate(seed),pid=store.put(P.fromReplay(d));try{const input={index:d.events.length-1,from:0,to:d.events.at(-1).t};const a=packet({...input,seed}),b=packet({...input,package_id:pid});for(const key of ['clock','match_complete','facts','chance_quality','football_tools','interval_statistics'])A.deepEqual(a[key],b[key]);}finally{store.remove(pid);}}
 const legacy=P.fromReplay(F.simulateLegacy(7));P.validate(legacy);A.equal(legacy.package_version,'1');A.equal(Clock.end(legacy),5400);A.throws(()=>Clock.parse(legacy,'90+1'));
 function bad(change){const copy=structuredClone(data);change(copy);A.throws(()=>P.validate(copy));}
 bad(d=>d.events[4].period=2);bad(d=>d.events[2].period=2);bad(d=>d.events[1].minimum_seconds=240);bad(d=>d.clock.periods[1].start=2881);bad(d=>d.clock.periods[1].end=8000);bad(d=>d.events.at(-1).t=5819);bad(d=>d.events.splice(1,0,{...d.events[1],id:'duplicate-announcement'}));bad(d=>d.annotations[1].available_at=6000);bad(d=>d.events.find(e=>e.id==='late-shot').xg.available_at=6000);
}finally{store.remove(id);}
console.log('R1: 60 deterministic v2 seeds; distinct added-time clocks; late goals/cards/substitutions, delayed history/shot values and corrections; no future whistle/clock leakage; actual full time; import parity and v1 compatibility.');
