/* Offline only: no provider calls, no credentials, no claims of AI superiority. */
const A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const {fixture,scenarios}=require('../evaluation/scenarios.cjs'),{validate}=require('../match-package.js'),{packet}=require('../server/evidence.cjs'),store=require('../server/package-store.cjs'),{fallback}=require('../server/provider.cjs');
function evaluate(spec,mode){
 const {data,input}=fixture(spec);validate(data);const id=store.put(data);let p;try{p=packet({...input,package_id:id,viewer_mode:mode});}finally{store.remove(id);}
 const e=spec.expect,checks=[];const check=(name,actual,expected)=>{try{A.deepEqual(actual,expected);checks.push({name,passed:true});}catch{checks.push({name,passed:false,actual,expected});}};
 const situation=p.facts.find(f=>f.kind==='Interval situation');check('closing score',situation.score_end,e.score);check('Northbridge interval shots',p.interval_statistics.northbridge.shots,e.shots);check('investigation count',p.investigations.length,e.investigations);
 if(e.investigations){const inv=p.investigations[0];check('history availability',inv.history.status,e.history);check('window readiness',inv.comparison.status,e.comparison);if(e.passes){check('equal-window completed passes',[inv.comparison.before.completed,inv.comparison.after.completed],e.passes);check('equal-window shots',[inv.comparison.before.shots,inv.comparison.after.shots],e.attempts);}if(e.otherChanges!==undefined)check('concurrent changes',inv.other_change_ids.length,e.otherChanges);}
 check('visible incident versions',p.annotations.map(a=>a.id),e.annotations??[]);check('missing coordinates remain unavailable',p.sequence_analysis,null);
 const factOutput={headline:'Recorded interval facts',paragraphs:p.facts.map(f=>({text:f.text,evidence_ids:[f.id]}))};
 const ranked=fallback(p,'Offline Batch 2 baseline');const outputs={all_facts:factOutput,priority_stories:ranked};
 const visibleIds=new Set(data.events.slice(0,input.index+1).filter(e=>e.t<=input.to).map(e=>e.id));
 for(const[name,out]of Object.entries(outputs)){
  check(`${name}: valid fact references`,out.paragraphs.every(row=>row.evidence_ids.length&&row.evidence_ids.every(id=>p.facts.some(f=>f.id===id))),true);
  const refs=out.paragraphs.flatMap(row=>row.evidence_ids).map(id=>p.facts.find(f=>f.id===id));
  check(`${name}: no future event references`,refs.every(f=>(f.event_ids||[]).every(id=>visibleIds.has(id))),true);
  check(`${name}: mandatory incidents retained`,p.facts.filter(f=>['The score changed','A dismissal changed the numbers'].includes(f.kind)).every(f=>refs.includes(f)),true);
 }
 check('priority story paragraph budget',ranked.paragraphs.length<=(mode==='quick'?2:4),true);
 return{id:spec.id,split:spec.split,mode,question:spec.question??'What changed around this interval and what evidence helps explain it?',rubric:spec.rubric,input_sha256:crypto.createHash('sha256').update(JSON.stringify({data,input,mode})).digest('hex'),input:{...input,viewer_mode:mode},expected:e,checks,passed:checks.every(c=>c.passed),facts:p.facts,baseline_outputs:outputs,manual_review:{status:'pending',dimensions:['factual support','relevance to question','conflicting signals','appropriate uncertainty','readability'],scale:'0 absent/incorrect; 1 partial; 2 clear and supported; N/A when irrelevant'}};
}
function run(split='development'){
 if(!['development','holdout','all'].includes(split))throw Error('Use --split=development, holdout or all');
 const rows=scenarios.filter(s=>split==='all'||s.split===split).flatMap(s=>['quick','tactical'].map(mode=>evaluate(s,mode)));
 return{schema_version:1,suite_version:'batch2-v1',split,source_revision:execFileSync('git',['rev-parse','HEAD'],{cwd:path.join(__dirname,'..'),encoding:'utf8'}).trim(),runtime:process.version,source_hashes:Object.fromEntries(['evaluation/scenarios.cjs','tools/evaluate-scenarios.cjs','server/evidence.cjs','server/provider.cjs','server/stories.cjs','server/investigation.cjs','server/comparisons.cjs','match-package.js'].map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'..',file))).digest('hex')])),method:'Authored synthetic fixtures; all-facts and deterministic priority-story baselines use the identical evidence packet. No model calls. Mechanical checks are separate from pending human semantic review.',cases:rows.length,passed:rows.filter(r=>r.passed).length,failed:rows.filter(r=>!r.passed).length,rows};
}
if(require.main===module){const split=process.argv.find(a=>a.startsWith('--split='))?.slice(8)??'development',report=run(split),dest=path.join(__dirname,`../docs/scenario-baseline-${split}.json`);fs.writeFileSync(dest,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({split,cases:report.cases,passed:report.passed,failed:report.failed,report:dest}));if(report.failed)process.exitCode=1;}
module.exports={evaluate,run};
