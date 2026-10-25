const A=require('node:assert/strict'),{analyseSequences}=require('../server/sequences.cjs'),{simulate}=require('../full-match.js'),{packet}=require('../server/evidence.cjs');
const teams={northbridge:{name:'Northbridge'},southport:{name:'Southport'}};
const action=(id,t,x,outcome='complete',team_id='northbridge')=>({id,t,x,type:'pass',team_id,actor_id:'A',duration:1,outcome,possession_id:id.split('-')[0]});
const end=(id,t,team_id='northbridge')=>({id:id+'-end',t,type:'possession_end',team_id,possession_id:id});
const es=[action('a-1',10,40),action('a-2',20,50,'lost'),end('a',21),action('b-1',30,75),end('b',31),action('c-1',40,30,'complete','southport'),end('c',41,'southport'),action('d-1',50,80)];
const r=analyseSequences(es,{from:0,to:60,asOf:60,teams});A.deepEqual(r.teams[0].counts,{complete_sequences:2,attacking_third_entries:1,shot_sequences:0,early_losses:1});A.equal(r.teams[1].counts.attacking_third_entries,1);
A.equal(analyseSequences(es,{from:15,to:60,asOf:60,teams}).teams[0].counts.complete_sequences,1);
A.equal(analyseSequences(es,{from:0,to:60,asOf:25,teams}).teams[0].counts.complete_sequences,1);
A.equal(analyseSequences([...es,end('d',70)],{from:0,to:60,asOf:100,teams}).teams[0].counts.complete_sequences,2);
for(let seed=0;seed<20;seed++){const data=simulate(seed),p=packet({seed,index:data.events.length-1,from:2400,to:3000});A(p.sequence_analysis);for(const t of p.sequence_analysis.teams){A(t.counts.attacking_third_entries<=t.counts.complete_sequences);for(const e of t.examples)A(e.start>=2400&&e.end<=3000)}}
console.log('Sequence analysis: complete groups, both attack directions, failed entry, partial intervals, unfinished possessions and future exclusions pass.');
