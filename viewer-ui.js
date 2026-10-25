/* Viewer-first presentation; technical controls remain available on demand. */
(function(){
 const main=document.querySelector('main'),developer=document.createElement('details');developer.className='card bottom';developer.id='demoControls';
 const heading=document.createElement('summary');heading.textContent='Match data & demo settings';developer.append(heading);teamNav.after(developer);
 developer.append(packagePanel);
 const sourceSection=$('sourceDescription').closest('section'),historySection=$('historyEvidence').closest('section');developer.append(sourceSection,historySection);
 const experiment=$('experimentSummary')?.closest('section')||$('experimentSummary');if(experiment&&experiment!==main)developer.append(experiment);
 const technical=document.createElement('div');technical.className='toolbar';
 for(const id of ['scenario','mode','seed','profile','generate','download']){const node=$(id);const label=document.querySelector(`label[for="${id}"]`);if(label)technical.append(label);technical.append(node)}developer.append(technical);
 const debug=document.createElement('details'),debugTitle=document.createElement('summary');debugTitle.textContent='Inspect calculations and raw evidence';debug.append(debugTitle,$('showComparisons'),$('inspectPacket'));aiPanel.insertBefore(debug,$('aiResult'));
 aiPanel.querySelector('.label').textContent='Your match companion';
 $('aiStatus').textContent='Choose an interval and your viewing preferences, then ask what changed.';
 const recap=$('recap').closest('section');recap.querySelector('.label').textContent='Match so far · replay clock';
 const help=document.createElement('p');help.className='muted';help.textContent='The match-so-far summary follows the replay clock. Your catch-up covers only the selected interval.';recap.prepend(help);
 const intro=document.createElement('p');intro.className='muted';intro.textContent='New here? Play the match or move the replay slider, choose the minutes you missed, then select Explain what changed. Use Teams & lineups to inspect the squad.';teamNav.after(intro);
 guideSteps.splice(0,guideSteps.length,
  {title:'1. Follow the match',target:'#play',body:'Play the synthetic match, advance one event, jump to a key moment or move the slider below the pitch. The score, statistics and current lineup follow this replay clock.'},
  {title:'2. Catch up on an interval',target:'#catchFrom',body:'Choose the start and end minutes you missed. Advance the replay beyond the interval end first. Explain what changed creates a commentary with supporting evidence; Generate catch-up gives a local event recap.'},
  {title:'3. Make it yours',target:'#playerFocus',body:'Choose Quick for the main story or Tactical for figures and more detail. Team focus changes story priority. Player focus follows a squad member’s recorded actions. Preferences do not change facts, and major events remain included.'},
  {title:'4. Explore the explanation',target:'#aiCatchup',body:'Each story shows its time scope. Expand supporting evidence or Explore the play behind this explanation to inspect sequences and comparisons. What to watch next is a viewing question, not a prediction.'},
  {title:'5. Learn football vocabulary',target:'#language',body:'Choose a glossary language and click a highlighted supported term or player name. Definitions use that language; the main interface stays English.'},
  {title:'6. Bring your own match',target:'#demoControls',body:'Open Match data & demo settings to load the example or upload Touchline package JSON. Download current package gives a complete format example. CSV, video and arbitrary provider files are not supported. Files contain match metadata, squads, timestamped events, provenance and optional incident annotations.'},
  {title:'7. Understand the demo',target:'#demoControls',body:'This is fictional football data. Seeded generation and provenance are under demo settings. Most calculations and the local recap work without Azure; online story ranking uses Foundry, with a labelled local fallback. Player tracking, injury histories and real live feeds are not connected.'}
 );
 let squadKey='';
 function updatePlayers(){const key=JSON.stringify(Object.values(fullReplay.squads.teams).map(t=>[t.id,t.name,t.players.map(p=>[p.id,p.name])]));if(key===squadKey)return;squadKey=key;
  const select=$('playerFocus'),previous=select.value;select.replaceChildren();const none=document.createElement('option');none.value='';none.textContent='No individual player';select.append(none);
  for(const team of Object.values(fullReplay.squads.teams)){const group=document.createElement('optgroup');group.label=team.name;for(const p of team.players){const option=document.createElement('option');option.value=p.id;option.textContent=`${p.name} · ${p.usual_position}`;group.append(option)}select.append(group)}if([...select.options].some(o=>o.value===previous))select.value=previous;
 }
 const previousRender=render;render=function(){previousRender();updatePlayers()};
 const originalPlayerDetails=showSquadPlayer;showSquadPlayer=function(player,team){originalPlayerDetails(player,team);const follow=document.createElement('button');follow.textContent='Follow this player in commentary';follow.onclick=()=>{$('playerFocus').value=player.id;$('aiResult').textContent=`Following ${player.name}. Choose an interval, then Explain what changed.`;squadDialog.close();selectMatchView(false);aiPanel.scrollIntoView({block:'start',behavior:'smooth'})};squadDialog.append(follow)};
 const previousView=selectMatchView;selectMatchView=function(teams){previousView(teams);developer.hidden=teams;intro.hidden=teams};
 $('viewerModeHelp').textContent='Quick catch-up gives the main story. Tactical detail adds exact figures and more supporting stories.';
 const style=document.createElement('style');style.textContent='#demoControls>summary{font-weight:600;padding:6px}#demoControls>.card{border:0;padding:12px 0}#demoControls .toolbar{margin-top:16px}#viewerMode,#viewerFocus,#playerFocus{max-width:100%;margin:6px 10px 6px 0}#aiResult>p.muted{font-size:12px}#aiResult>details{margin:10px 0}';document.head.append(style);
 updatePlayers();
})();
