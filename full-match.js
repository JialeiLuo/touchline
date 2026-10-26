/* Original seeded, simplified full-timeline event simulation. Not empirically calibrated. */
(function(root){
function simulate(seed=7){
 if(!Number.isInteger(seed)||seed<0||seed>4294967295)throw Error('Seed must be a uint32');
 let z=seed>>>0;const rand=()=>{z+=0x6D2B79F5;let q=z;q=Math.imul(q^q>>>15,q|1);q^=q+Math.imul(q^q>>>7,q|61);return((q^q>>>14)>>>0)/4294967296};
 const squadData=typeof module!=='undefined'?require('./data/squads.js'):root.SQUAD_DATA;
 const events=[],teams=['northbridge','southport'],players={},roles={},subs={northbridge:false,southport:false},yellows={},dismissed=new Set();let t=0,id=0,team=0,chain=0;
 for(const key of teams){players[key]=squadData.teams[key].players.filter(p=>p.starting).map(p=>p.id);for(const p of squadData.teams[key].players)roles[p.id]=p.assigned_position||p.usual_position;}
 const add=(type,fields={})=>{const ev={id:`full-v03-${seed}-${++id}`,t:Math.round(t*10)/10,type,period:t<2700?1:2,synthetic:true,...fields};events.push(ev);return ev};
 // Role weights are authored sampling assumptions, not learned football rates.
 const pick=(key,progress=25,exclude=null)=>{
  const list=players[key].filter(p=>!dismissed.has(p)&&roles[p]!=='GK'&&p!==exclude);
  const weights=list.map(p=>{const role=roles[p];return progress<40?(['CB','LB','RB','DM'].includes(role)?3:1):progress>65?(['ST','LW','RW'].includes(role)?4:['CM','AM'].includes(role)?2:1):(['CM','AM','DM','LW','RW'].includes(role)?3:1)});
  let draw=rand()*weights.reduce((a,b)=>a+b,0);for(let i=0;i<list.length;i++){draw-=weights[i];if(draw<0)return list[i]}return list.at(-1);
 };
 const keeper=key=>players[key].find(p=>roles[p]==='GK'&&!dismissed.has(p));
 add('kickoff',{text:'Kickoff. Northbridge and Southport begin the synthetic match.',x:52.5,y:34});
 for(let half=0;half<2;half++){
  t=half*2700;if(half)add('kickoff',{text:'Second half begins.',x:52.5,y:34});const end=(half+1)*2700;
  // Controlled tactical scenario: odd seeds change at half-time; even seeds retain shape.
  if(half&&seed%2===1){
   const assignments=[['Morgan','DM',50,65],['Turner','DM',50,35],['Mason','AM',68,50],['Lane','LW',68,15],['Vale','RW',68,85],['Brooks','ST',85,50]].filter(([player_id])=>!dismissed.has(player_id)).map(([player_id,position,x,y])=>({player_id,position,slot:{x,y}}));
   for(const a of assignments)roles[a.player_id]=a.position;
   add('tactical_change',{team_id:'northbridge',from_formation:'4-3-3',to_formation:'4-2-3-1',assignments,source:'authored synthetic manager instruction',text:'Northbridge declare a change from 4-3-3 to 4-2-3-1 at half-time; Mason takes the attacking midfield slot.'});
  }

  while(t<end-30){
   const key=teams[team],op=teams[1-team],direction=team===0?1:-1,owner=pick(key);let actor=owner,x=team===0?18+rand()*12:75+rand()*12,y=8+rand()*52;const possession_id=`p-${++chain}`,start=t;let lost=false;
   const advance=seconds=>{const dt=Math.min(seconds,end-t);t+=dt;return dt};
   for(let j=0;j<3+Math.floor(rand()*7)&&t<end-22;j++){
    const duration=advance(2+rand()*4),sx=x,sy=y;x=Math.max(3,Math.min(102,x+direction*(3+rand()*10)));y=Math.max(3,Math.min(65,y+(rand()-.5)*20));const pass=rand()<.82,success=rand()<.84,recipient=pick(key,team===0?x:105-x,actor);
    add(pass?'pass':'carry',{team_id:key,actor_id:actor,recipient_id:pass?recipient:actor,possession_id,start_x:sx,start_y:sy,x,y,duration,outcome:success?'complete':'lost',text:`${actor} ${pass?'passes':'carries'}${success?' successfully':'; possession is lost'}.`});if(pass&&success)actor=recipient;if(!success){lost=true;break;}
   }
   if(!lost&&t<end-15){
    const foul=rand()<.15;
    if(foul){const defender=pick(op,25);advance(1);add('foul',{team_id:op,actor_id:defender,x,y,text:`${defender} commits a foul.`});if(rand()<.22){yellows[defender]=(yellows[defender]||0)+1;add('yellow_card',{team_id:op,actor_id:defender,x,y,text:`${defender} receives a yellow card.`});if(yellows[defender]===2){dismissed.add(defender);add('red_card',{team_id:op,actor_id:defender,reason:'second_yellow',x,y,text:`${defender} is dismissed after a second yellow.`})}}advance(8);add('restart',{team_id:key,x,y,text:`${key==='northbridge'?'Northbridge':'Southport'} restart with a free kick.`})}
    else if(rand()<.12){advance(1);const progress=team===0?x:105-x,goalProbability=.04+.22*Math.max(0,Math.min(1,(progress-35)/65));const outcome=rand()<goalProbability?'goal':rand()<.48?'saved':'off_target';const shot=add('shot',{team_id:key,actor_id:actor,possession_id,x,y,xg:{value:goalProbability,source_id:'touchline-illustrative-v1'},outcome,text:`${actor} shoots — ${outcome==='goal'?'goal!':outcome==='saved'?'saved.':'off target.'}`});if(outcome==='goal'){add('goal',{team_id:key,actor_id:actor,shot_id:shot.id,x,y,text:`Goal for ${key==='northbridge'?'Northbridge':'Southport'}.`});advance(12);add('restart',{team_id:op,x:52.5,y:34,text:'Play restarts from the centre.'})}else if(outcome==='saved'){add('save',{team_id:op,actor_id:keeper(op),x,y,text:`${keeper(op)} makes a save.`});if(rand()<.25){add('corner',{team_id:key,x:team===0?105:0,y:0,text:'Corner awarded to the attacking team.'});advance(8);add('restart',{team_id:key,x,y,text:'The corner is taken.'})}}}
   }
   // Explicit controlled-ball intervals; no stoppage time contributes to possession.
   const controlled=events.filter(e=>e.possession_id===possession_id&&(e.type==='pass'||e.type==='carry')).reduce((a,e)=>a+e.duration,0);
   add('possession_end',{team_id:key,possession_id,duration:controlled,text:`${key} possession ends.`});
   if(t>=3600&&!subs[key]){const out=players[key].find(p=>roles[p]==='RW'&&!dismissed.has(p)),incoming=squadData.teams[key].players.find(p=>!p.starting&&p.usual_position==='ST').id;if(out){players[key][players[key].indexOf(out)]=incoming;roles[incoming]=roles[out];subs[key]=true;add('sub',{team_id:key,actor_id:incoming,outgoing_id:out,text:`${incoming} replaces ${out}.`,x:52.5,y:4})}}
   advance(3+rand()*7);team=1-team;
  }
  t=end;add(half?'full_time':'half_time',{text:half?'Full time.':'Half time.',x:52.5,y:34});
 }
 return{schema_version:'0.5',xg_sources:[{id:'touchline-illustrative-v1',label:'Touchline simulator illustration',stage:'pre_shot',kind:'illustrative',version:'1',method:'Pre-shot simulator probability: 0.04 + 0.22 * clamp((attacking_progress - 35) / 65, 0, 1). Uses only endpoint progress; no shot outcome. Not fitted or calibrated to real football.'}],history:JSON.parse(JSON.stringify(typeof module!=='undefined'?require('./data/player-history.js'):root.PLAYER_HISTORY)),squads:JSON.parse(JSON.stringify(squadData)),seed,mode:'full',provenance:{method:'original seeded simplified full-timeline simulator',version:'0.3',randomness:{algorithm:'Mulberry32-style uint32 PRNG',seed,identity_source:'data/squads.json; fixed authored names, sequential shirt numbers',role_weights:'build-up defenders 3:1; middle midfield/wide 3:1; advanced forwards 4, CM 2, others 1',goal_probability:'0.04 + 0.22 * clamp((attacking_progress - 35) / 65, 0, 1); illustrative, not xG'},tactical_scenario:seed%2===1?'authored half-time shape change':'retained starting shape control',real_match_data:false,scope:'Two 45-minute halves, no added time. Role-weighted outfield actions, named goalkeepers and illustrative location-dependent shot outcomes; not calibrated to professional football.'},prior_events:[],events};
}
function stats(events,index){const rows={};for(const k of ['northbridge','southport'])rows[k]={goals:0,shots:0,onTarget:0,passes:0,completed:0,fouls:0,yellow:0,red:0,corners:0,substitutions:0,controlledSeconds:0};for(const e of events.slice(0,index+1)){const r=rows[e.team_id];if(!r)continue;if(e.type==='goal')r.goals++;if(e.type==='shot'){r.shots++;if(['goal','saved'].includes(e.outcome))r.onTarget++}if(e.type==='pass'){r.passes++;if(e.outcome==='complete')r.completed++}if(['pass','carry'].includes(e.type))r.controlledSeconds+=e.duration||0;if(e.type==='foul')r.fouls++;if(e.type==='yellow_card')r.yellow++;if(e.type==='red_card')r.red++;if(e.type==='corner')r.corners++;if(e.type==='sub')r.substitutions++}return rows}
root.FullMatch={simulate,stats};if(typeof module!=='undefined')module.exports={simulate,stats};
})(globalThis);
