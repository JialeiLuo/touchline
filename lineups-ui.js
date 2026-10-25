/* Teams view shares the match replay clock; no separate hidden timeline. */
const teamMain=document.querySelector('main'),matchSections=[...teamMain.children];
const teamNav=document.createElement('nav');teamNav.className='toolbar';teamNav.setAttribute('aria-label','Match views');
const matchViewButton=document.createElement('button'),teamsViewButton=document.createElement('button');
matchViewButton.textContent='Match';teamsViewButton.textContent='Teams & lineups';teamNav.append(matchViewButton,teamsViewButton);teamMain.prepend(teamNav);
const teamsPage=document.createElement('section');teamsPage.hidden=true;teamsPage.id='teamsPage';teamMain.append(teamsPage);
let teamView='current',showTeams=false;
function selectMatchView(teams){showTeams=teams;matchSections.forEach(el=>el.hidden=teams);teamsPage.hidden=!teams;matchViewButton.setAttribute('aria-pressed',String(!teams));teamsViewButton.setAttribute('aria-pressed',String(teams));if(teams){pause();drawLineups()}else render();}
matchViewButton.onclick=()=>selectMatchView(false);teamsViewButton.onclick=()=>selectMatchView(true);
function teamText(tag,text,className){const el=document.createElement(tag);el.textContent=text;if(className)el.className=className;return el;}
function drawLineups(){
 teamsPage.replaceChildren();teamsPage.append(teamText('h1','Teams & lineups'));
 if($('scenario').value!=='full'){teamsPage.append(teamText('p','Squad records currently cover the full synthetic match. Return to Match and select Full synthetic match · 90 minutes.'));return;}
 const state=Squads.snapshot(fullReplay.events,index,fullReplay.squads),min=Math.floor(state.as_of/60);
 teamsPage.append(teamText('p',`Replay clock: ${min}:${String(Math.floor(state.as_of%60)).padStart(2,'0')} · All clubs, players and managers are fictional.`));
 const controls=document.createElement('div');controls.className='toolbar';for(const [key,label]of [['starting','Starting XI'],['current','Current lineup']]){const b=teamText('button',label);b.setAttribute('aria-pressed',String(teamView===key));b.onclick=()=>{teamView=key;drawLineups()};controls.append(b)}
 const next=teamText('button','Next lineup / shape change');next.onclick=()=>{const at=fullReplay.events.findIndex((e,i)=>i>index&&['sub','red_card','tactical_change'].includes(e.type));index=at<0?fullReplay.events.length-1:at;render();drawLineups()};controls.append(next);teamsPage.append(controls);
 teamsPage.append(teamText('p',teamView==='starting'?'Kickoff selection. Current incident badges still reflect only the revealed replay.':'Current personnel. Positions retain declared slots; this does not infer how the team reorganised.','muted'));
 const grid=document.createElement('div');grid.className='lineup-grid';
 for(const team of Object.values(state.teams)){
  const card=document.createElement('section');card.className='card';card.append(teamText('h2',team.name),teamText('p',`Manager: ${team.manager}`),teamText('p',`Declared ${teamView==='starting'?'starting':'current'} formation: ${teamView==='starting'?team.declared_formation:team.current_formation}`));
  const pitch=document.createElement('div');pitch.className='lineup-pitch';pitch.setAttribute('aria-label',team.name+' schematic lineup');
  const visible=team.players.filter(p=>teamView==='starting'?p.starting:p.status==='On pitch');
  for(const p of visible){const initial=fullReplay.squads.teams[team.id].players.find(v=>v.id===p.id),slot=teamView==='starting'?initial.slot:p.slot,position=teamView==='starting'?initial.assigned_position:p.assigned_position;const b=teamText('button',`${p.shirt_number} ${p.name}\n${position}${p.red?' · RED':p.yellow?' · YC '+p.yellow:''}`);b.className='lineup-player';b.style.left=slot.y+'%';b.style.top=(100-slot.x)+'%';b.setAttribute('aria-label',`${team.name} player ${p.name}, ${position}, ${p.status}`);b.onclick=()=>showSquadPlayer(p,team);pitch.append(b)}
  card.append(pitch,teamText('h3','Bench & player status'));
  const list=document.createElement('div');for(const p of team.players.filter(p=>!p.starting||p.status!=='On pitch')){const b=teamText('button',`${p.shirt_number} ${p.name} · ${p.usual_position} · ${p.status}${p.changed_at!==undefined?' '+Math.floor(p.changed_at/60)+'′':''}`);b.className='squad-row';b.onclick=()=>showSquadPlayer(p,team);list.append(b)}card.append(list);grid.append(card);
 }
 teamsPage.append(grid,teamText('p',state.provenance.limitations+' No injury or suspension history is supplied.','muted'));
}
const squadDialog=document.createElement('dialog');squadDialog.setAttribute('aria-label','Player details');document.body.append(squadDialog);
function showSquadPlayer(p,team){squadDialog.replaceChildren();const close=teamText('button','Close player details');close.onclick=()=>squadDialog.close();squadDialog.append(close,teamText('h2',`${p.name} · ${team.name}`));for(const text of [`Shirt number: ${p.shirt_number}`,`Usual position: ${p.usual_position}`,`Assigned match role: ${p.assigned_position||'Not assigned — bench'}`,`Preferred foot: ${p.preferred_foot}`,`Status at replay time: ${p.status}`,`Observed cards: ${p.yellow} yellow${p.red?', sent off':''}`,p.replaced?`Replaced ${p.replaced} at ${Math.floor(p.changed_at/60)}′. The incoming player inherits the declared slot; tactical adaptation is not inferred.`:'Role history and recent form are not supplied.'])squadDialog.append(teamText('p',text));squadDialog.append(teamText('p','Authored fictional metadata, available at kickoff.','muted'));squadDialog.showModal();}
const squadRender=render;render=function(){squadRender();if(showTeams){matchSections.forEach(el=>el.hidden=true);drawLineups()}};
const teamStyle=document.createElement('style');teamStyle.textContent=`[hidden]{display:none!important}.lineup-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}.lineup-pitch{height:430px;position:relative;border:1px solid #8ba58f;border-radius:12px;background:repeating-linear-gradient(#234d35 0 54px,#28593e 54px 108px);margin:20px 0}.lineup-pitch:before{content:'';position:absolute;inset:50% 0 auto;border-top:1px solid #8ba58f}.lineup-player{position:absolute;transform:translate(-50%,-50%);white-space:pre-line;text-align:center;font-size:12px;padding:6px;min-width:65px;background:#142c24}.squad-row{display:block;width:100%;text-align:left;margin:7px 0;font-size:13px}button[aria-pressed=true]{border-color:#c7e88a;background:#354c35}@media(max-width:850px){.lineup-grid{grid-template-columns:1fr}.lineup-player{font-size:11px;min-width:55px}}`;document.head.append(teamStyle);selectMatchView(false);
