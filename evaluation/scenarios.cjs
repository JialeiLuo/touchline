/* Fixed authored fixtures. Expectations are declared independently of production tools. */
const {simulateLegacy:simulate}=require('../full-match.js'),{fromReplay}=require('../match-package.js');
function fixture(spec){
 const data=structuredClone(fromReplay(simulate(7)));data.match={id:spec.id,title:spec.id};delete data.history;delete data.xg_sources;
 const players=data.squads.teams.northbridge.players,starter=players.find(p=>p.starting&&p.assigned_position!=='GK'),recipient=players.find(p=>p.starting&&p.id!==starter.id&&p.assigned_position!=='GK'),incoming=players.find(p=>!p.starting);
 let n=0;const event=(t,type,fields={})=>({id:`${spec.id}-${++n}`,t,type,synthetic:true,text:`Authored ${type} at ${t} seconds.`,...fields});
 const action=(t,type='pass',actor=starter.id)=>event(t,type,{team_id:'northbridge',actor_id:actor,...(type==='pass'?{recipient_id:recipient.id,outcome:'complete',duration:2}: {outcome:'off_target'})});
 const events=[event(0,'kickoff')];
 if(spec.change){events.push(event(600,'sub',{team_id:'northbridge',actor_id:incoming.id,outgoing_id:starter.id}));
  for(let i=0;i<(spec.beforePasses??1);i++)events.push(action(350+i*20));
  for(let i=0;i<(spec.afterPasses??1);i++)events.push(action(620+i*20,'pass',incoming.id));
  for(let i=0;i<(spec.beforeShots??0);i++)events.push(action(500+i*20,'shot'));
  for(let i=0;i<(spec.afterShots??0);i++)events.push(action(750+i*20,'shot',incoming.id));
  if(spec.history)data.history={schema_version:'1',records:[{id:`${spec.id}-history`,player_id:incoming.id,match_id:'prior',happened_at:-1000,available_at:spec.lateHistory?800:0,position:starter.assigned_position,minutes:90,source:'Authored fixture',synthetic:true}]};
 }
 if(spec.goal){events.push(event(700,'shot',{team_id:'southport',actor_id:data.squads.teams.southport.players.find(p=>p.starting&&p.assigned_position!=='GK').id,outcome:'goal'}));events.push(event(700,'goal',{team_id:'southport',actor_id:events.at(-1).actor_id}));}
 if(spec.dismissal)events.push(event(710,'red_card',{team_id:'southport',actor_id:data.squads.teams.southport.players.find(p=>p.starting&&p.assigned_position!=='GK').id,reason:'direct'}));
 events.push(event(spec.cutoff??950,'restart'),event(5400,'full_time'));events.sort((a,b)=>a.t-b.t);data.events=events;
 data.annotations=spec.correction?[{id:'report',kind:'incident',description:'Initial report of an incident.',happened_at:650,available_at:660,status:'reported',source:'Authored report',synthetic:true},{id:'correction',kind:'incident',description:'The initial report was corrected; no sanction is established.',happened_at:650,available_at:850,status:'corrected',supersedes:'report',source:'Authored correction',synthetic:true}]:[];
 return{data,input:{index:events.findIndex(e=>e.t===(spec.cutoff??950)&&e.type==='restart'),from:300,to:spec.cutoff??950},incoming:incoming.id};
}
const scenarios=[
 {id:'dev-quiet',split:'development',question:'What changed?',expect:{score:[0,0],shots:0,investigations:0},rubric:'Say the score held; do not invent tactical improvement.'},
 {id:'dev-goal',split:'development',goal:true,expect:{score:[0,1],shots:0,investigations:0},rubric:'Retain the Southport goal and changed score.'},
 {id:'dev-positive',split:'development',change:true,history:true,afterPasses:3,afterShots:2,expect:{score:[0,0],shots:2,investigations:1,history:'recorded_experience',comparison:'ready',passes:[1,3],attempts:[0,2]},rubric:'Describe higher activity, never a demonstrated substitution effect.'},
 {id:'dev-no-change',split:'development',change:true,expect:{score:[0,0],shots:0,investigations:1,history:'missing',comparison:'ready',passes:[1,1],attempts:[0,0]},rubric:'Unchanged counts are a negative control; no claimed improvement.'},
 {id:'dev-conflicting',split:'development',change:true,beforeShots:2,afterPasses:3,expect:{score:[0,0],shots:2,investigations:1,history:'missing',comparison:'ready',passes:[1,3],attempts:[2,0]},rubric:'More passes and fewer attempts are conflicting signals; no quality inference.'},
 {id:'dev-missing-history',split:'development',change:true,expect:{score:[0,0],shots:0,investigations:1,history:'missing',comparison:'ready',passes:[1,1],attempts:[0,0]},rubric:'Missing history does not mean zero ability or zero prior experience.'},
 {id:'dev-waiting',split:'development',change:true,cutoff:650,expect:{score:[0,0],shots:0,investigations:1,history:'missing',comparison:'waiting'},rubric:'Wait for the full after window; do not compare partial and full windows.'},
 {id:'dev-corrected',split:'development',correction:true,expect:{score:[0,0],shots:0,investigations:0,annotations:['correction']},rubric:'Use the correction and suppress the superseded report.'},
 {id:'holdout-concurrent',split:'holdout',change:true,goal:true,dismissal:true,history:true,afterShots:1,expect:{score:[0,1],shots:1,investigations:1,history:'recorded_experience',comparison:'ready',passes:[1,1],attempts:[0,1],otherChanges:2},rubric:'Retain goal and dismissal; identify concurrent changes and avoid causal attribution.'},
 {id:'holdout-late-history',split:'holdout',change:true,history:true,lateHistory:true,expect:{score:[0,0],shots:0,investigations:1,history:'missing',comparison:'ready',passes:[1,1],attempts:[0,0]},rubric:'History arriving after entry cannot establish what was known at entry.'},
 {id:'holdout-before-correction',split:'holdout',correction:true,cutoff:800,expect:{score:[0,0],shots:0,investigations:0,annotations:['report']},rubric:'Do not leak the later correction into this replay prefix.'},
 {id:'holdout-decline',split:'holdout',change:true,beforePasses:4,afterPasses:1,beforeShots:2,expect:{score:[0,0],shots:2,investigations:1,history:'missing',comparison:'ready',passes:[4,1],attempts:[2,0]},rubric:'Describe the activity decline with equal windows and uncertainty.'}
];
module.exports={fixture,scenarios};
