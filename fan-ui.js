/* Fan journey integration: shared revealed-time and request gates. */
(function(){
 const workspace=$('commentaryWorkspace'),result=$('aiResult');
 const preferences=document.createElement('div');preferences.className='commentary-preferences';preferences.setAttribute('role','group');preferences.setAttribute('aria-label','Viewing preferences');
 aiPanel.insertBefore(preferences,aiPanel.querySelector('label[for="viewerMode"]'));
 for(const id of ['viewerMode','viewerFocus','playerFocus']){const field=document.createElement('div');field.append(aiPanel.querySelector('label[for="'+id+'"]'),$(id));preferences.append(field);}
 const approach=document.createElement('div');approach.className='toolbar';approach.append(aiPanel.querySelector('label[for="analysisMode"]'),$('analysisMode'));$('showComparisons').parentElement.append(approach);
 const clockHint=document.createElement('p');clockHint.className='muted';clockHint.textContent='Enter 66 or 66:30; use 45+2 or 90+4 for added time. H2 45:00 means second-half kickoff. Full time follows the final whistle.';$('catchGenerate').parentElement.after(clockHint);
 const status=document.createElement('p');status.id='intervalHelp';status.className='muted';status.setAttribute('role','status');$('catchGenerate').parentElement.after(status);
 for(const id of ['catchFrom','catchTo'])$(id).setAttribute('aria-describedby','intervalHelp');
 const selection=document.createElement('p');selection.id='selectionSummary';selection.className='answer';aiPanel.insertBefore(selection,$('aiCatchup'));
 const navigation=document.createElement('div');navigation.className='toolbar';navigation.setAttribute('aria-label','Interval navigation');status.after(navigation);
 function interval(from,to,period){setIntervalTimes(from,to,period);}
 function button(id,label,fn){const b=document.createElement('button');b.id=id;b.textContent=label;b.onclick=fn;navigation.append(b);return b;}
 const previous=button('previousInterval','← Previous interval',()=>move(-1)),next=button('nextInterval','Next interval →',()=>move(1)),latest=button('revealedInterval','Use latest 5 minutes',()=>{const event=active().events[index];interval(Math.max(active().events[0].t,event.t-300),event.t,event.period)});
 const endHere=button('endAtReplay','End at current replay time',()=>{const s=state();interval(s.from,s.end,active().events[index].period)});
 const jump=document.createElement('a');jump.href='#commentaryWorkspace';jump.className='skip-link';jump.textContent='Skip to interval commentary';document.body.prepend(jump);workspace.tabIndex=-1;
 const recovery=document.createElement('div');recovery.className='toolbar';recovery.id='commentaryRecovery';recovery.hidden=true;
 const retry=document.createElement('button');retry.textContent='Try commentary again';retry.onclick=()=>requestCommentary(false);
 const local=document.createElement('button');local.textContent='Show the events in this interval';local.onclick=()=>{$('catchGenerate').click();$('catchReport').scrollIntoView({block:'center'});};recovery.append(retry,local);const recoveryHelp=document.createElement('p');recoveryHelp.className='muted';recoveryHelp.textContent='Get another explanation for your current choices, or see a simple list of the recorded events.';recovery.append(recoveryHelp);result.after(recovery);
 let pending=false;
 const recapKey=()=>JSON.stringify([fullReplay.package_id||fullReplay.seed,$('scenario').value,index,$('catchFrom').value,$('catchTo').value]);
 const priorRecap=makeCatchup;makeCatchup=function(){priorRecap();$('catchReport').dataset.selectionKey=recapKey();};
 const write=(node,text)=>{if(node.textContent!==text)node.textContent=text};
 function state(){const events=active().events,event=events[index],now=event.t,parsed=readInterval(),{from,to}=parsed,earliest=events[0].t,end=now;let error=parsed.error;
  if(!$('catchFrom').value||!$('catchTo').value)error='Enter both a start and an end time.';
  else if(!error&&from<earliest)error=`This replay starts at ${intervalText(earliest)}. Choose that time or later.`;
  else if(!error&&to<=from)error='The end time must be after the start time.';
  else if(!error&&to>end)error=`The replay is at ${MatchClock.format(active(),event)}; ${$('catchTo').value} has not happened yet. Choose End at current replay time below.`;
  return{from,to,earliest,end,error,full:$('scenario').value==='full'};
 }
 function move(direction){const s=state();if(s.error)return;const width=s.to-s.from,from=s.from+direction*width,to=s.to+direction*width;if(from>=s.earliest&&to<=s.end)interval(from,to);}
 function sync(){const s=state(),valid=!s.error,expired=packageExpired();endHere.hidden=!(s.to>s.end&&Number.isFinite(s.from)&&s.from>=s.earliest&&s.from<s.end);endHere.disabled=pending;write(endHere,`End at current replay time (${MatchClock.format(active(),active().events[index])})`);
  write(status,s.error||`Selected ${$('catchFrom').value}–${$('catchTo').value} · revealed through ${MatchClock.format(active(),active().events[index])}. Changing the interval does not request AI commentary.`);
  const report=$('catchReport');if(report.dataset.selectionKey&&report.dataset.selectionKey!==recapKey()){report.textContent='The match, replay position or interval changed. Select Show event recap to update this summary.';delete report.dataset.selectionKey;}
  for(const id of ['catchFrom','catchTo'])$(id).setAttribute('aria-invalid',String(!valid));
  for(const id of ['aiCatchup','showComparisons','inspectPacket'])$(id).disabled=pending||!valid||!s.full||expired;
  $('catchGenerate').disabled=pending||!valid;retry.disabled=$('aiCatchup').disabled;local.disabled=!valid||pending;
  previous.disabled=pending||!valid||s.from-(s.to-s.from)<s.earliest;next.disabled=pending||!valid||s.to+(s.to-s.from)>s.end;latest.disabled=pending||s.end<=s.earliest;
  const player=Object.values(fullReplay.squads.teams).flatMap(t=>t.players).find(p=>p.id===$('playerFocus').value);
  write(selection,`${s.full?(fullReplay.match?.title||'Built-in synthetic match'):'Diagnostic sequence'} · ${$('viewerMode').value==='quick'?'Quick catch-up':'Tactical detail'} · ${player?'Following '+player.name:$('viewerFocus').selectedOptions[0].textContent+' focus'} · ${valid?$('catchFrom').value+'–'+$('catchTo').value:'Choose a valid interval'}`);
  if(expired){$('commentaryFreshness').hidden=false;$('commentaryFreshness').textContent='This upload’s server copy expired. Open Match data & demo settings and select Reload expired package. Your local replay and event recap remain available.';}
  $('aiCatchup').textContent=pending?'Preparing explanation…':'Explain what changed';result.setAttribute('aria-busy',String(pending));
  $('progress').setAttribute('aria-valuetext',`Replay at ${MatchClock.format(active(),active().events[index])}`);
  $('guidedExample').hidden=$('guidedExampleHelp').hidden=showTeams||!!fullReplay.package_id;
 }
 const priorRequest=requestCommentary;requestCommentary=async function(inspect){sync();if(pending||$('aiCatchup').disabled)return;pending=true;recovery.hidden=true;sync();try{await priorRequest(inspect);}finally{pending=false;sync();recovery.hidden=!result.textContent.trim();retry.textContent=result.querySelector('h3')?'Explain my current selection':'Try commentary again';}};
 const priorRender=render;render=function(){priorRender();sync()};
 const priorReset=reset;reset=function(){priorReset();sync();recovery.hidden=true};$('reset').onclick=reset;
 for(const id of ['catchFrom','catchTo','analysisMode','viewerMode','viewerFocus','playerFocus'])$(id).addEventListener('input',sync);
 for(const b of $('catchGenerate').parentElement.querySelectorAll('button'))b.addEventListener('click',sync);
 const priorView=selectMatchView;selectMatchView=function(teams){priorView(teams);sync()};
 function updateGlossary(){for(const root of [result,$('catchReport')])for(const term of root.querySelectorAll('.term')){const key=Object.keys(definitions).find(k=>k.toLowerCase()===term.textContent.toLowerCase());term.title=GLOSSARY_LANGUAGES[$('language').value].terms[key]||key;}}
 $('language').addEventListener('change',updateGlossary);
 ui.dialog.setAttribute('aria-labelledby','dictionaryName');
 guideButton.onclick=()=>{selectMatchView(false);pause();guideIndex=0;showGuideStep();guide.showModal()};
 guideSteps[3].body='Read the explanation, then open supporting evidence for source references. Recorded facts, readings of the play and limitations are distinguished. Quick and Tactical change detail; team and player focus change priority. Important incidents remain included.';
 guideSteps[6].body='All matches here are synthetic. The investigator uses Microsoft Foundry to choose evidence tools and follow-up queries; the app checks and composes the wording. When online analysis is unavailable, a labelled local explanation or event recap remains available. No live feed or player tracking is connected.';
 const help=document.createElement('p');help.className='muted';help.textContent='Underlined terms open the glossary. Changing its language updates definitions; the interface and commentary remain English.';$('language').after(help);
 const style=document.createElement('style');style.textContent=`
 :focus-visible{outline:3px solid #d2f48c;outline-offset:4px}
 .skip-link{position:fixed;top:-100px;left:12px;z-index:100;background:#192a23;color:white;padding:12px}.skip-link:focus{top:12px}
 .commentary-preferences{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:20px 0}.commentary-preferences label{display:block;margin:0 0 8px!important}.commentary-preferences select{width:100%;max-width:100%;margin:0!important}#selectionSummary{overflow-wrap:anywhere}#intervalHelp{min-height:2em}#aiResult pre{overflow-wrap:anywhere}dialog{box-sizing:border-box;max-height:85vh;overflow:auto}
 @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;animation:none!important;transition:none!important}}
 @media(max-width:600px){.commentary-preferences{grid-template-columns:1fr;gap:4px}.toolbar{flex-wrap:wrap}.card,.grid>*{min-width:0}select,input{max-width:100%}button,select,input{min-height:44px;box-sizing:border-box}#commentaryWorkspace select{display:block;width:100%;margin:8px 0}#commentaryWorkspace label{display:block;margin:12px 0 4px!important}.score{flex-wrap:wrap;gap:8px}#events{overflow-wrap:anywhere}.lineup-player{min-height:44px}#aiResult,#catchReport{overflow-wrap:anywhere}header{padding:16px}h1{font-size:32px}pre{max-width:100%;overflow:auto}}
 `;document.head.append(style);
 setInterval(sync,1000);sync();
})();
