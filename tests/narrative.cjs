const A=require('node:assert/strict'),{fixture,scenarios}=require('../evaluation/scenarios.cjs'),{packet}=require('../server/evidence.cjs'),{fallback}=require('../server/provider.cjs'),{buildStories,assembleStories}=require('../server/stories.cjs'),{validateNarrative}=require('../server/narrative-checks.cjs'),{createTools}=require('../server/investigator-tools.cjs'),{simulate}=require('../full-match.js'),store=require('../server/package-store.cjs');
function sample(id,mode='quick'){const {data,input}=fixture(scenarios.find(s=>s.id===id)),pid=store.put(data);try{return packet({...input,package_id:pid,viewer_mode:mode});}finally{store.remove(pid);}}
const p=sample('dev-conflicting'),quick=fallback(p,'test'),tactical=fallback({...p,viewer_mode:'tactical'},'test');
A(quick.paragraphs.some(p=>p.parts?.reading.includes('did not come with more')),'Quick must retain the conflicting activity signal');A(quick.paragraphs[0].parts.fact.includes('role'));A.equal(quick.paragraphs[0].structured_claims.find(c=>c.kind==='history_share').assigned_position,p.investigations[0].assigned_position);A(tactical.paragraphs[0].text.includes('1/1'));A(tactical.paragraphs[0].text.includes('3/3'));A.notEqual(quick.paragraphs[0].text,tactical.paragraphs[0].text);A(quick.word_count<tactical.word_count);A(quick.paragraphs[0].structured_claims.length>=3);A(quick.paragraphs.every(row=>!row.text.includes('Southport: completed passes 0')),'No zero-only opponent filler');
for(const mode of ['quick','tactical']){const z=fallback(sample('dev-no-change',mode),'test');A(z.paragraphs.some(p=>p.parts?.reading.includes('unchanged')));const q=fallback(sample('dev-quiet',mode),'test');A.equal(q.paragraphs.length,1);A(q.paragraphs[0].parts.alternative.includes('unavailable'));A(!/dominated|improved|controlled the match/i.test(q.paragraphs[0].text));}
const waiting=fallback(sample('dev-waiting','tactical'),'test');A(waiting.paragraphs[0].text.includes('not yet available'));A(!waiting.paragraphs[0].text.includes('completed 0/0'));A.equal(waiting.paragraphs[0].structured_claims.find(c=>c.kind==='player_windows').after,null);
// Independent typed checks reject changed values, actor, timing, source binding and shape.
const para=tactical.paragraphs[0];A.doesNotThrow(()=>validateNarrative(para,p));
function reject(mutate){const row=structuredClone(para);mutate(row);A.throws(()=>validateNarrative(row,p));}
reject(r=>r.structured_claims.find(c=>c.kind==='history_share').minutes=999);reject(r=>r.structured_claims.find(c=>c.kind==='history_share').player_id='other');reject(r=>r.structured_claims.find(c=>c.kind==='player_windows').to=5400);reject(r=>r.structured_claims.find(c=>c.kind==='team_change').metrics[0].after=99);reject(r=>r.structured_claims[0].basis_fact_ids=['invented']);reject(r=>r.structured_claims[0].cause='substitution');reject(r=>r.text+=' unsupported appended prose');
// Investigator gating applies to composed narratives, including automatic focus/refill.
const tools=createTools({...p,player_focus:'Ellis'});A(!tools.candidates().some(s=>s.scope.kind==='substitution_synthesis'));tools.execute('role_history',{player_id:'Ellis'});A(!tools.candidates().some(s=>s.scope.kind==='substitution_synthesis'));const change=p.squad_context.find(c=>c.player_id==='Ellis');const checked=tools.execute('compare_change',{event_id:change.event_id}),story=checked.stories.find(s=>s.scope.kind==='substitution_synthesis');A(story);A.equal(story.required_result_ids.length,2);const gated=assembleStories({story_ids:[story.id]},{...p,player_focus:'Ellis'},new Set(checked.stories.map(s=>s.id)));A(gated.paragraphs.every(row=>row.structured_claims?.every(c=>c.player_id===undefined||c.player_id==='Ellis')??true));
// Deduplication refills with complementary inspected evidence, not the same player again.
const d=simulate(7),actual=packet({seed:7,index:899,from:3300,to:3960,player_focus:'Ellis',viewer_mode:'tactical'}),stories=buildStories(actual),context=stories.find(s=>s.scope.kind==='contextual_investigation'&&s.player_id==='Ellis'),basic=stories.find(s=>s.scope.kind==='player_interval');const composed=assembleStories({story_ids:[context.id,basic.id]},actual);A.equal(composed.paragraphs.filter(p=>p.text.startsWith('Ellis')).length,1);A(composed.paragraphs.length>1);A.equal(composed.paragraphs.filter(p=>p.parts?.alternative.includes('effect cannot be isolated')).length,1);
// Full-time scope: late-interval counts never become whole-match counts; no next-play instruction.
for(const from of [0,4800]){const end=packet({seed:7,index:d.events.length-1,from,to:5400,viewer_mode:'tactical'}),out=fallback(end,'test');A.equal(out.watch_label,'Replay takeaway');A(out.watch_next.includes('match is complete'));if(from)A(out.watch_next.includes('not whole-match totals'));A(!out.paragraphs.some(p=>/\b(Watch|Follow|Wait for)\b/.test(p.text)));}
// Incident descriptions retain report status, not assumed truth or sanction.
const corrected=fallback(sample('dev-corrected','tactical'),'test');A(corrected.paragraphs.some(p=>p.text.includes('A corrected report says:')));A(!corrected.paragraphs.some(p=>p.text.includes('Initial report of an incident.')));
// Broad rendering contracts: no duplicate paragraphs, word caps (essential exception explicit), valid claims.
for(let seed=0;seed<8;seed++){const es=simulate(seed).events;for(const[from,to]of [[0,120],[2400,3000],[3300,3960],[0,5400],[4800,5400]])for(const viewer_mode of ['quick','tactical']){const data=packet({seed,index:es.length-1,from,to,viewer_mode}),out=fallback(data,'test');A(out.paragraphs.length<=(viewer_mode==='quick'?2:4));A(out.word_count<=out.word_limit||out.length_exception);A.equal(new Set(out.paragraphs.map(p=>p.text)).size,out.paragraphs.length);for(const row of out.paragraphs)validateNarrative(row,data);}}
console.log('Narrative: conflicting/unchanged signals, quiet/missing evidence, typed-claim rejection, inspected synthesis, repetition/refill, full-time scope, corrected reports and 80 interval/mode checks per seed-set pass.');

// A late substitution cannot acquire a post-entry comparison just because full time is reached.
const late=fixture({id:'late-sub',change:true});for(const e of late.data.events){if(e.type==='sub')e.t=5300;if(e.type==='pass')e.t=e.actor_id===late.incoming?5350:5200;if(e.type==='restart')e.t=5370;}late.data.events.sort((a,b)=>a.t-b.t);const lid=store.put(late.data);try{const lp=packet({package_id:lid,index:late.data.events.length-1,from:5100,to:5400,viewer_mode:'tactical'}),o=fallback(lp,'test');A(o.paragraphs.some(p=>p.text.includes('match ended before a full post-entry')));A(!o.paragraphs.some(p=>p.text.includes('Watch')));}finally{store.remove(lid);}

// Nearly overlapping windows for the same team should not repeat a trend as a new finding.
const close=packet({seed:7,index:899,from:3300,to:3960,viewer_mode:'tactical'}),co=fallback(close,'test'),origins=co.paragraphs.flatMap(p=>p.origin_story_ids),built=buildStories(close),chosenStories=origins.map(id=>built.find(s=>s.id===id)).filter(Boolean);for(const s of chosenStories.filter(s=>s.scope.kind==='change_synthesis'))A(!chosenStories.some(other=>other!==s&&other.player_id&&other.team_id===s.team_id&&other.activity_scope&&Math.abs(other.activity_scope.from-s.activity_scope.from)<60));

// Reported minute-66 confusion: a useful answer without focus; explicit past-minute denominators in Tactical.
const replay66=d.events.findIndex(e=>e.t>=3960);
for(const player_focus of [null,'Ellis']){
 const input={seed:7,index:replay66,from:3300,to:3900,player_focus};
 const qp=packet({...input,viewer_mode:'quick'}),tp=packet({...input,viewer_mode:'tactical'}),q=fallback(qp,'review'),t=fallback(tp,'review');
 A.match(q.paragraphs[0].text,/cannot tell yet whether the substitution helped/);
 A.doesNotMatch(q.paragraphs[0].text,/305|prior match records|past match records/);
 A.match(t.paragraphs[0].text,/of 305 total minutes were in this role/);
 A.match(t.paragraphs[0].text,/past-match minutes, not minutes in this match/);
 A.notEqual(q.paragraphs[0].text,t.paragraphs[0].text);
 A(q.word_count<t.word_count);
 if(player_focus)A.match(t.paragraphs[0].text,/20 of 305/);
}
