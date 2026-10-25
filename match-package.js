/* Touchline synthetic match-package v1. Shared browser/server validation. */
(function(root){
const rules=typeof module!=='undefined'?require('./data/rules.js'):root.OFFICIAL_RULES;
const teams=['northbridge','southport'];
const core=new Set(['kickoff','half_time','full_time','pass','carry','foul','yellow_card','red_card','shot','goal','save','corner','restart','sub','possession_end','tactical_change']);
const officialHosts=['theifab.com','www.theifab.com','premierleague.com','www.premierleague.com','uefa.com','www.uefa.com','fifa.com','www.fifa.com'];
function fail(message){throw Error(message)}
function str(v,label,max=300){if(typeof v!=='string'||!v.trim()||v.length>max)fail(label+' must be a non-empty string (max '+max+').');}
function num(v,label,min=0,max=5400){if(!Number.isFinite(v)||v<min||v>max)fail(label+' is outside the supported range.');}
function validate(p){
 if(!p||p.package_version!=='1'||p.synthetic!==true)fail('Use a synthetic Touchline match package, version 1.');
 str(p.match?.id,'Match ID',100);str(p.match?.title,'Match title',200);str(p.provenance?.method,'Provenance method',500);
 if(!p.squads?.teams)fail('Squads are required.');
 const known=new Map(),active={},positions={};
 for(const key of teams){const team=p.squads.teams[key];if(team?.id!==key)fail('Team IDs must match their internal slots.');str(team?.name,key+' name',80);str(team?.manager,key+' manager',100);str(team?.declared_formation,key+' formation',30);if(!Array.isArray(team.players)||team.players.length<11||team.players.length>25)fail(key+' needs 11 starters and at most 25 players.');
  const shirts=new Set();active[key]=new Set();
  for(const person of team.players){str(person.id,'Player ID',80);str(person.name,'Player name',80);str(person.usual_position,'Usual position',20);if(known.has(person.id))fail('Player IDs must be globally unique.');known.set(person.id,key);if(!Number.isInteger(person.shirt_number)||person.shirt_number<1||person.shirt_number>99||shirts.has(person.shirt_number))fail('Shirt numbers must be distinct integers 1–99 within each team.');shirts.add(person.shirt_number);if(typeof person.starting!=='boolean')fail('Player starting must be boolean.');if(person.starting){str(person.assigned_position,'Assigned position',20);num(person.slot?.x,'Slot x',0,100);num(person.slot?.y,'Slot y',0,100);active[key].add(person.id);}positions[person.id]=person.assigned_position||person.usual_position;}
  if(active[key].size!==11)fail(key+' must start with exactly 11 players.');
 }
 if(p.history!==undefined){if(p.history?.schema_version!=='1'||!Array.isArray(p.history.records)||p.history.records.length>1000)fail('Invalid history collection.');const historyIds=new Set(),historyMatches=new Set();for(const r of p.history.records){str(r.id,'History ID',120);if(historyIds.has(r.id))fail('Duplicate history ID.');historyIds.add(r.id);if(!known.has(r.player_id))fail('Unknown history player.');str(r.match_id,'Historical match ID',120);const matchKey=r.player_id+'|'+r.match_id;if(historyMatches.has(matchKey))fail('History supports one position record per player per prior match.');historyMatches.add(matchKey);str(r.position,'Historical role',20);num(r.happened_at,'Historical time',-31536000,-1);num(r.available_at,'History availability',r.happened_at,5400);num(r.minutes,'Historical minutes',0,130);str(r.source,'History source',300);if(r.synthetic!==true)fail('History must be synthetic.');}}
 if(!Array.isArray(p.events)||p.events.length<2||p.events.length>12000)fail('Provide 2–12000 chronological events.');
 const ids=new Set(),goalShots=new Set(),usedGoals=new Set();let last=-1;const removed=new Set(),yellow={};let ended=false;
 for(const e of p.events){str(e.id,'Event ID',120);if(ids.has(e.id))fail('Duplicate event ID.');ids.add(e.id);num(e.t,'Event time');if(e.t<last||ended)fail('Events must be chronological and end at full time.');last=e.t;if(!core.has(e.type))fail('Unsupported core event '+e.type+'; use an annotation for other incidents.');if(e.synthetic!==true)fail('Every core event must be marked synthetic.');if(e.available_at!==undefined&&e.available_at!==e.t)fail('Core events must be available at their event time; use annotations for delayed reports.');if(e.text!==undefined)str(e.text,'Event text',1000);if(e.team_id!==undefined&&!teams.includes(e.team_id))fail('Unknown team ID.');
  if(e.x!==undefined)num(e.x,'Event x',0,105);if(e.y!==undefined)num(e.y,'Event y',0,68);if(['pass','carry'].includes(e.type))num(e.duration,'Controlled duration',0,120);
  if(['pass','carry','shot','goal','save','foul','yellow_card','red_card','sub'].includes(e.type)){
   if(!teams.includes(e.team_id)||known.get(e.actor_id)!==e.team_id)fail('Event actor must belong to its team.');
   if(e.type==='sub'){if(!active[e.team_id].has(e.outgoing_id)||active[e.team_id].has(e.actor_id)||removed.has(e.actor_id))fail('Invalid substitution eligibility.');positions[e.actor_id]=positions[e.outgoing_id];active[e.team_id].delete(e.outgoing_id);removed.add(e.outgoing_id);active[e.team_id].add(e.actor_id);}
   else if(['yellow_card','red_card'].includes(e.type)){if(!active[e.team_id].has(e.actor_id))fail('Core player cards currently require an on-field player; use annotations for bench/staff sanctions.');if(e.type==='yellow_card')yellow[e.actor_id]=(yellow[e.actor_id]||0)+1;if(e.type==='red_card'){if(e.reason==='second_yellow'&&(yellow[e.actor_id]||0)<2)fail('Second-yellow dismissal needs two cautions.');active[e.team_id].delete(e.actor_id);removed.add(e.actor_id);}}
   else if(!active[e.team_id].has(e.actor_id))fail('Inactive event actor.');
  }
  if(e.type==='pass'&&(!active[e.team_id].has(e.recipient_id)||e.recipient_id===e.actor_id))fail('Invalid pass recipient.');
  if(['pass','carry'].includes(e.type)&&!['complete','lost'].includes(e.outcome))fail('Invalid action outcome.');
  if(e.type==='shot'&&!['goal','saved','off_target'].includes(e.outcome))fail('Unsupported shot outcome.');
  if(e.type==='shot'&&e.outcome==='goal')goalShots.add(e.team_id+'|'+e.actor_id+'|'+e.t);
  if(e.type==='goal'){const k=e.team_id+'|'+e.actor_id+'|'+e.t;if(!goalShots.has(k)||usedGoals.has(k))fail('Goal must match one preceding goal-outcome shot at the same timestamp.');usedGoals.add(k);}
  if(e.type==='save'&&positions[e.actor_id]!=='GK')fail('Save actor must have the assigned goalkeeper role.');
  if(e.type==='tactical_change'){str(e.from_formation,'Previous formation',30);str(e.to_formation,'New formation',30);if(!teams.includes(e.team_id)||!Array.isArray(e.assignments)||e.assignments.length>11)fail('Tactical assignments are required.');for(const a of e.assignments){if(!active[e.team_id].has(a.player_id))fail('Tactical assignment references inactive player.');str(a.position,'Assigned role',20);num(a.slot?.x,'Slot x',0,100);num(a.slot?.y,'Slot y',0,100);positions[a.player_id]=a.position;}}
  if(e.type==='full_time')ended=true;
 }
 if(goalShots.size!==usedGoals.size)fail('Every goal-outcome shot needs its goal record.');
 if(p.events[0].type!=='kickoff'||p.events[0].t!==0||!ended)fail('Version 1 supports completed 0–90 minute packages beginning at kickoff and ending at full time.');
 if(p.events.at(-1).t!==5400)fail('Version 1 requires full time at 5400 match seconds.');
 const annotations=p.annotations??[];if(!Array.isArray(annotations)||annotations.length>200)fail('At most 200 annotations are supported.');
 const annotationIds=new Set();for(const a of annotations){str(a.id,'Annotation ID',120);if(ids.has(a.id)||annotationIds.has(a.id))fail('Duplicate annotation ID.');annotationIds.add(a.id);str(a.kind,'Incident kind',80);str(a.description,'Incident description',1200);num(a.happened_at,'Incident time');num(a.available_at,'Report availability',a.happened_at);str(a.source,'Incident source',300);if(!['reported','confirmed','corrected','withdrawn'].includes(a.status))fail('Invalid annotation status.');if(a.synthetic!==true)fail('Annotations must be synthetic.');if(a.participants!==undefined&&(!Array.isArray(a.participants)||a.participants.length>30||a.participants.some(x=>typeof x!=='string'||x.length>100)))fail('Invalid incident participants.');if(a.related_event_ids!==undefined&&(!Array.isArray(a.related_event_ids)||a.related_event_ids.some(id=>!ids.has(id))))fail('Annotation references an unknown core event.');}
 for(const a of annotations){if(a.supersedes&&!annotations.some(old=>old.id===a.supersedes&&old.available_at<a.available_at&&old.id!==a.id))fail('Invalid annotation correction link.');if(a.rule_refs!==undefined&&(!Array.isArray(a.rule_refs)||a.rule_refs.length>5))fail('Invalid rule references.');for(const r of a.rule_refs||[]){str(r.title,'Rule title',200);str(r.version,'Rule season/version',50);let u;try{u=new URL(r.url)}catch{fail('Invalid official rule URL.')}if(u.protocol!=='https:'||!officialHosts.includes(u.hostname)||u.username||u.password)fail('Rule links must use supported official HTTPS domains.');if(r.catalogue_id&&(!rules[r.catalogue_id]||rules[r.catalogue_id].url!==r.url))fail('Unknown curated rule reference.');if(r.quote!==undefined)fail('Uploaded rule quotations are not verified; provide an official link instead.');}}
 return p;
}
function visibleAnnotations(p,asOf,from=0,to=asOf){const available=(p.annotations||[]).filter(a=>a.available_at<=asOf);const superseded=new Set(available.map(a=>a.supersedes).filter(Boolean));return available.filter(a=>!superseded.has(a.id)&&a.status!=='withdrawn'&&a.happened_at>=from&&a.happened_at<=to);}
function fromReplay(d){return{package_version:'1',synthetic:true,match:{id:'synthetic-'+(d.seed??'import'),title:(d.squads.teams.northbridge.name+' v '+d.squads.teams.southport.name)},provenance:d.provenance,squads:d.squads,...(d.history?{history:d.history}:{}),events:d.events,annotations:[]};}
const api={validate,visibleAnnotations,fromReplay};root.MatchPackage=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
