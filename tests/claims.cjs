const A=require('node:assert/strict'),{packet,validateOutput}=require('../server/evidence.cjs'),{simulate}=require('../full-match.js');
const es=simulate(7).events,sub=es.findIndex(e=>e.type==='sub'),t=es[sub].t;
const before=packet({seed:7,index:sub-1,from:0,to:es[sub-1].t});A.equal(before.squad_context.length,0);
const during=packet({seed:7,index:sub,from:t-60,to:t});A.equal(during.squad_context[0].player_id,es[sub].actor_id);A.equal(during.squad_context[0].assigned_position,'RW');
const old=packet({seed:7,index:es.length-1,from:0,to:3000});A.equal(old.squad_context.length,0);
const f=during.facts.find(f=>f.context_ids?.length),make=text=>({headline:'A personnel change',paragraphs:[{text,evidence_ids:[f.id]}],limitations:[]});
A.equal(validateOutput(make(f.text),during).headline,'A personnel change');
A.throws(()=>validateOutput(make('Ellis took 99 shots.'),during),/numeric/);
A.throws(()=>validateOutput(make('A six-minute burst followed.'),during));
A.throws(()=>validateOutput({...make('A substitution was recorded.'),headline:'Three goals in six minutes'},during),/headline/);
const simple={facts:[{id:'f',text:'Southport took 2 shots at 50′.'}]};
A.equal(validateOutput({headline:'Attacking activity',paragraphs:[{text:'Southport took two shots at the 50th minute.',evidence_ids:['f']}],limitations:[]},simple).paragraphs.length,1);
A.throws(()=>validateOutput({headline:'Attacking activity',paragraphs:[{text:'Southport scored 3 goals.',evidence_ids:['f']}],limitations:[]},simple),/numeric/);
console.log('Claim/context checks passed: word numerals, unsupported counts/durations/headlines, substitution context, no future squad changes. Lexical checks do not prove semantic correctness.');

A.doesNotThrow(()=>validateOutput({headline:'Progress in the final third',paragraphs:[{text:'Southport took two shots.',evidence_ids:['f']}],limitations:[]},simple));

A.throws(()=>validateOutput({headline:'Attacking play',paragraphs:[{text:'Southport entered the box.',evidence_ids:['f']}],limitations:[]},simple),/penalty-area/);
A.throws(()=>validateOutput({headline:'Attacking play',paragraphs:[{text:'Southport threat increased.',evidence_ids:['f']}],limitations:[]},simple),/chance-quality/);
