/* Fan journey integration: shared revealed-time and request gates. */
(function(){
 const workspace=$('commentaryWorkspace'),result=$('aiResult');
 const preferences=document.createElement('div');preferences.className='commentary-preferences';preferences.setAttribute('role','group');preferences.setAttribute('aria-label','Viewing preferences');
 aiPanel.insertBefore(preferences,aiPanel.querySelector('label[for="viewerMode"]'));
 for(const id of ['viewerMode','viewerFocus','playerFocus']){const field=document.createElement('div');field.append(aiPanel.querySelector('label[for="'+id+'"]'),$(id));preferences.append(field);}
 const approach=document.createElement('div');approach.className='toolbar';approach.append(aiPanel.querySelector('label[for="analysisMode"]'),$('analysisMode'));$('showComparisons').parentElement.append(approach);
 const status=document.createElement('p');status.id='intervalHelp';status.className='muted';status.setAttribute('role','status');$('catchGenerate').parentElement.after(status);
 for(const id of ['catchFrom','catchTo'])$(id).setAttribute('aria-describedby','intervalHelp');
 const selection=document.createElement('p');selection.id='selectionSummary';selection.className='answer';aiPanel.insertBefore(selection,$('aiCatchup'));
 const navigation=document.createElement('div');navigation.className='toolbar';navigation.setAttribute('aria-label','Interval navigation');status.after(navigation);
 function interval(from,to){$('catchFrom').value=from;$('catchTo').value=to;for(const id of ['catchFrom','catchTo'])$(id).dispatchEvent(new Event('input',{bubbles:true}));}
 function button(id,label,fn){const b=document.createElement('button');b.id=id;b.textContent=label;b.onclick=fn;navigation.append(b);return b;}
 const previous=button('previousInterval','← Previous interval',()=>move(-1)),next=button('nextInterval','Next interval →',()=>move(1)),latest=button('revealedInterval','Use latest 5 minutes',()=>{const end=Math.floor(active().events[index].t/60);interval(Math.max(Math.ceil(active().events[0].t/60),end-5),end)});
 const jump=document.createElement('a');jump.href='#commentaryWorkspace';jump.className='skip-link';jump.textContent='Skip to interval commentary';document.body.prepend(jump);workspace.tabIndex=-1;
 const recovery=document.createElement('div');recovery.className='toolbar';recovery.id='commentaryRecovery';recovery.hidden=true;
 const retry=document.createElement('button');retry.textContent='Try commentary again';retry.onclick=()=>requestCommentary(false);
 const local=document.createElement('button');local.textContent='Open local event recap';local.onclick=()=>{$('catchGenerate').click();$('catchReport').scrollIntoView({block:'center'});};recovery.append(retry,local);result.after(recovery);
 let pending=false;
 const recapKey=()=>JSON.stringify([fullReplay.package_id||fullReplay.seed,$('scenario').value,index,$('catchFrom').value,$('catchTo').value]);
 const priorRecap=makeCatchup;makeCatchup=function(){priorRecap();$('catchReport').dataset.selectionKey=recapKey();};
 const write=(node,text)=>{if(node.textContent!==text)node.textContent=text};
 function state(){const events=active().events,now=events[index].t,from=Number($('catchFrom').value),to=Number($('catchTo').value),earliest=Math.ceil(events[0].t/60),end=Math.floor(now/60);let error='';
  if(!$('catchFrom').value||!$('catchTo').value)error='Enter both a start and an end minute.';
  else if(!Number.isInteger(from)||!Number.isInteger(to))error='Use whole minutes for the start and end.';
  else if(from<earliest)error=`This replay starts at minute ${earliest}. Choose that minute or later.`;
  else if(to<=from)error='The end minute must be after the start minute.';
  else if(to>end)error=`Only minutes through ${end} are revealed. Advance the replay or use the latest 5 minutes.`;
  return{from,to,earliest,end,error,full:$('scenario').value==='full'};
 }
 function move(direction){const s=state();if(s.error)return;const width=s.to-s.from,from=s.from+direction*width,to=s.to+direction*width;if(from>=s.earliest&&to<=s.end)interval(from,to);}
 function sync(){const s=state(),valid=!s.error,expired=packageExpired();
  write(status,s.error||`Selected ${s.from}–${s.to} minutes · revealed through minute ${s.end}. Changing the interval does not request AI commentary.`);
  const report=$('catchReport');if(report.dataset.selectionKey&&report.dataset.selectionKey!==recapKey()){report.textContent='The match, replay position or interval changed. Select Show event recap to update this summary.';delete report.dataset.selectionKey;}
  for(const id of ['catchFrom','catchTo'])$(id).setAttribute('aria-invalid',String(!valid));
  for(const id of ['aiCatchup','showComparisons','inspectPacket'])$(id).disabled=pending||!valid||!s.full||expired;
  $('catchGenerate').disabled=pending||!valid;retry.disabled=$('aiCatchup').disabled;local.disabled=!valid||pending;
  previous.disabled=pending||!valid||s.from-(s.to-s.from)<s.earliest;next.disabled=pending||!valid||s.to+(s.to-s.from)>s.end;latest.disabled=pending||s.end<=s.earliest;
  const player=Object.values(fullReplay.squads.teams).flatMap(t=>t.players).find(p=>p.id===$('playerFocus').value);
  write(selection,`${s.full?(fullReplay.match?.title||'Built-in synthetic match'):'Diagnostic sequence'} · ${$('viewerMode').value==='quick'?'Quick catch-up':'Tactical detail'} · ${player?'Following '+player.name:$('viewerFocus').selectedOptions[0].textContent+' focus'} · ${valid?s.from+'–'+s.to+' minutes':'Choose a valid interval'}`);
  if(expired){$('commentaryFreshness').hidden=false;$('commentaryFreshness').textContent='This upload’s server copy expired. Open Match data & demo settings and select Reload expired package. Your local replay and event recap remain available.';}
  $('aiCatchup').textContent=pending?'Preparing explanation…':'Explain what changed';result.setAttribute('aria-busy',String(pending));
  $('progress').setAttribute('aria-valuetext',`Replay at ${Math.floor(active().events[index].t/60)} minutes ${active().events[index].t%60} seconds`);
  $('guidedExample').hidden=$('guidedExampleHelp').hidden=showTeams||!!fullReplay.package_id;
 }
 const priorRequest=requestCommentary;requestCommentary=async function(inspect){sync();if(pending||$('aiCatchup').disabled)return;pending=true;recovery.hidden=true;sync();try{await priorRequest(inspect);}finally{pending=false;sync();recovery.hidden=!result.textContent.trim();retry.textContent=result.querySelector('h3')?'Refresh explanation':'Try commentary again';}};
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
