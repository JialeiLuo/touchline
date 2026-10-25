/* v0.1: seeded attacking-phase generator, not a full football simulator. */
(function(root){
function random(seed){let s=seed>>>0;return()=>{s+=0x6D2B79F5;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function generate(seed=7,profile='neutral'){
 if(!Number.isInteger(seed)||seed<0||seed>4294967295)throw Error('Seed must be a uint32');if(!['neutral','shift'].includes(profile))throw Error('Unknown profile');
 const rng=random(seed),prior=[],events=[];let count=0;
 const make=(type,t,fields)=>({id:`g${seed}-${++count}`,t,type,synthetic:true,...fields});
 for(let i=0;i<8;i++)prior.push(make('attack',3005+i*35,{flank:rng()<.34}));
 events.push(make('baseline',3300,{x:52,y:34,text:'Replay starts. Earlier attacking phases provide the comparison baseline.'}));
 events.push(make('booking',3360,{actor_id:'reed',team_id:'southport',x:86,y:13,text:'Southport right-back Reed receives a yellow card.'}));
 let t=3370,player='vale';
 for(let i=0;i<12;i++){
  if(i===6){events.push(make('sub',t,{actor_id:'ellis',outgoing_id:'vale',team_id:'northbridge',x:52,y:4,text:'Northbridge make a substitution: Ellis replaces Vale.'}));player='ellis';t+=5}
  const flank=rng()<(profile==='shift'?.78:.34),y=flank?10+rng()*8:28+rng()*25;let x=52+rng()*8;const chainId=`phase-${i+1}`;let actor='morgan';const actions=[];
  const steps=2+Math.floor(rng()*3);let ended=false;
  for(let j=0;j<steps;j++){
   const start_x=x,start_y=j===0?34:y; x=Math.min(95,x+7+rng()*10);t+=3+Math.floor(rng()*5);const type=j%2===0?'pass':'carry';const success=rng()<.88;const recipient=type==='pass'?(actor==='morgan'?player:'morgan'):actor;
   const action=make(type,t,{chain_id:chainId,actor_id:actor,team_id:'northbridge',recipient_id:recipient,start_x,start_y,x,y,outcome:success?'complete':'lost',text:`${actor[0].toUpperCase()+actor.slice(1)} ${type==='pass'?'attempts a pass':'carries the ball'} ${flank?'towards Reed’s flank':'through the central area'}${success?'.':'; possession is lost.'}`});events.push(action);actions.push(action.id);actor=recipient;if(!success){ended=true;break}
  }
  const duel=flank&&rng()<.55,shot=!ended&&rng()<(duel?.25:.6);t+=3;
  events.push(make('attack',t,{chain_id:chainId,actor_id:actor,team_id:'northbridge',flank,duel,shot,x,y,evidence_ids:actions,text:`Northbridge attacking phase ends ${flank?'on Reed’s flank':'away from Reed’s flank'}${shot?' with a shot':ended?' after losing possession':duel?' after a defensive challenge':' without a shot'}.`}));
  t+=18+Math.floor(rng()*20);
 }
 return {schema_version:'0.3',seed,profile,provenance:{method:'seeded rule-based attacking-phase generator',version:'0.1',real_match_data:false,scope:'Twelve Northbridge attacking phases with schematic pass/carry chains. Not a full match, tracking feed or calibrated football model.'},prior_events:prior,events};
}
root.MatchGenerator={generate};if(typeof module!=='undefined')module.exports={generate};
})(globalThis);
