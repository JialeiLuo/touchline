/* Declared slots are metadata, never presented as observed tracking. */
const pitchSvg=document.querySelector('svg.pitch'),pitchGroup=$('declaredPlayers');
const pitchControls=document.createElement('div');pitchControls.className='toolbar';
const pitchToggle=document.createElement('input');pitchToggle.type='checkbox';pitchToggle.id='showDeclared';pitchToggle.checked=true;
const pitchLabel=document.createElement('label');pitchLabel.htmlFor=pitchToggle.id;pitchLabel.textContent='Show team formation';pitchControls.append(pitchToggle,pitchLabel);pitchSvg.before(pitchControls);
function svgNode(tag,attrs){const el=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const[k,v]of Object.entries(attrs))el.setAttribute(k,v);return el;}
function drawEventPitch(){
 const full=$('scenario').value==='full',data=active(),event=data.events[index],label=$('eventActor');pitchGroup.replaceChildren();pitchControls.hidden=!full;
 const x=event.x??52.5,y=event.y??34,teamName=full?fullReplay.squads.teams[event.team_id]?.name||'':event.team_id==='northbridge'?'Northbridge':event.team_id==='southport'?'Southport':'';
 label.textContent=event.actor_id?`${event.actor_id} · ${event.type.replaceAll('_',' ')}`:`${teamName?teamName+' · ':''}${event.type.replaceAll('_',' ')}`;
 label.setAttribute('x',x>72?Math.max(4,x-3):Math.min(100,x+3));label.setAttribute('y',Math.max(7,Math.min(60,y-4)));label.setAttribute('text-anchor',x>72?'end':'start');label.setAttribute('paint-order','stroke');label.setAttribute('stroke','#10251b');label.setAttribute('stroke-width','.7');
 if(full&&pitchToggle.checked){const state=Squads.snapshot(fullReplay.events,index,fullReplay.squads);
  for(const [key,team]of Object.entries(state.teams))for(const p of team.players.filter(p=>p.status==='On pitch')){
   const increasing=MatchPackage.contract(fullReplay).direction[key]==='increasing_x';let px=increasing?p.slot.x*1.05:105-p.slot.x*1.05;const py=p.slot.y*.68;const other=state.teams[key==='northbridge'?'southport':'northbridge'];const overlap=other.players.filter(v=>v.status==='On pitch').some(v=>{const ox=increasing?105-v.slot.x*1.05:v.slot.x*1.05;return Math.hypot(px-ox,py-v.slot.y*.68)<4.3});if(overlap)px+=increasing?-2.5:2.5;const group=svgNode('g',{role:'button',tabindex:'0','aria-label':`${p.name}, ${team.name}, declared ${p.assigned_position}; open player details`,cursor:'pointer'});
   const dot=svgNode('circle',{cx:px,cy:py,r:1.9,fill:key==='northbridge'?'#c7e88a':'#79b9e7',stroke:p.id===event.actor_id?'#fff':'#172b20','stroke-width':p.id===event.actor_id?'.8':'.3'}),number=svgNode('text',{x:px,y:py+.65,'text-anchor':'middle','font-size':'1.8',fill:'#10251b'}),title=svgNode('title',{});number.textContent=p.shirt_number;title.textContent=`${p.name} · ${p.assigned_position} · declared slot, not tracked location`;group.append(title,dot,number);group.onclick=()=>showSquadPlayer(p,team);group.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showSquadPlayer(p,team)}};pitchGroup.append(group);
  }
 }
 // Keep the recorded event marker above the declared lineup dots.
 pitchSvg.append($('trail'),$('ball'),label);
 $('pitchExplanation').textContent=full?(pitchToggle.checked?'Green: home team · Blue: away team · numbered dots are declared slots, not live locations. Overlapping markers are separated slightly for visibility. White dot: latest event. Click a player for details.':'White dot: latest recorded event location. Player tracking is not supplied.'):'Short test scenario: white dot marks the latest event; this is not a complete player-position feed.';
 if(full&&pitchToggle.checked){const current=Squads.snapshot(fullReplay.events,index,fullReplay.squads);$('pitchExplanation').textContent=`On pitch: ${current.teams.northbridge.name} ${current.teams.northbridge.players.filter(p=>p.status==='On pitch').length} · ${current.teams.southport.name} ${current.teams.southport.players.filter(p=>p.status==='On pitch').length}. `+$('pitchExplanation').textContent;}
 pitchSvg.setAttribute('aria-label',`Synthetic pitch: ${label.textContent}. ${full&&pitchToggle.checked?'Declared lineup positions shown; not live tracking.':'Event location only.'}`);
}
pitchToggle.onchange=drawEventPitch;const beforePitchRender=render;render=function(){beforePitchRender();drawEventPitch()};drawEventPitch();
