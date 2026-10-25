/* Render server-calculated evidence; no model-generated values or markup. */
(function(){
 const clock=t=>`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;
 function el(tag,text,cls){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node}
 window.renderInvestigation=function(host,packet){
  if(!packet.investigations?.length)return;const section=el('section',undefined,'calculated-comparisons');section.append(el('h3','Substitution investigation'));
  for(const inv of packet.investigations){section.append(el('h4',`${inv.name} · assigned ${inv.assigned_position}`),el('p',`${inv.history.role_minutes} minutes in this role from ${inv.history.minutes} minutes across ${inv.history.records} supplied previous matches. History used only if available when the player came on.`));
   const details=el('details');details.append(el('summary','Investigation steps and sources'));for(const step of inv.trace)details.append(el('p',`${step.tool.replaceAll('_',' ')} · ${step.status}${step.as_of!==undefined?' · known by '+clock(step.as_of):''}${step.record_ids?' · '+step.record_ids.join(', '):''}${step.event_ids?.length?' · '+step.event_ids.join(', '):''}`));section.append(details);
  }host.append(section);
 };
 window.renderSequenceStory=function(host,packet){
  const report=packet.sequence_analysis;if(!report)return;
  const section=el('section',undefined,'calculated-comparisons');section.setAttribute('aria-label','How attacks developed');section.append(el('h3','How attacks developed'));
  for(const team of report.teams){
   section.append(el('p',team.story));
   if(!team.examples.length)continue;
   const details=el('details');details.append(el('summary',`${team.team_name} · inspect passages of play`));
   for(const sequence of team.examples){const line=el('p',`${clock(sequence.start)}–${clock(sequence.end)} · ${sequence.players.join(', ')} · ${sequence.actions} ball actions · ${sequence.reached_final_third?'reached the attacking third':'no completed entry into the attacking third'} · ${sequence.ending}.`);details.append(line);const sources=el('details');sources.append(el('summary','Supporting event IDs'),el('p',sequence.event_ids.join(', '),'muted'));details.append(sources)}
   section.append(details);
  }
  const method=el('details');method.append(el('summary','How this is measured'),el('p',report.method,'muted'));section.append(method);host.append(section);
 };
 window.renderCalculatedComparisons=function(host,packet){
  const groups=packet.comparisons||[];
  const section=el('section',undefined,'calculated-comparisons');section.setAttribute('aria-label','Calculated before and after evidence');
  section.append(el('h3','Before & after · calculated evidence'),el('p','Calculated from match events, independently of the AI wording. A change after an event does not prove the event caused it.','muted'));
  if(!groups.length)section.append(el('p','No substitution or declared tactical change occurs in this selected interval. Try seed 7, minutes 40–50, after advancing the replay to at least 50 minutes.'));
  for(const group of groups){
   const card=el('div',undefined,'comparison-group');card.append(el('h4',`${group.trigger_team} · ${group.trigger_type==='sub'?'substitution':'declared tactical change'} at ${clock(group.boundary)}`));
   if(group.status!=='ready'){card.append(el('p',group.boundary-group.window<0||group.available_at>5400?'This event does not have enough match time on both sides for an equal-window comparison.':`Not enough revealed time in the selected interval. Set its end to at least ${clock(group.available_at)} and advance the replay to that time.`));section.append(card);continue}
   card.append(el('p',`Before ${clock(group.before.from)}–${clock(group.before.to)} · After ${clock(group.after.from)}–${clock(group.after.to)}. Each window includes its start and excludes its end.`,'muted'));
   const table=el('table');table.style.cssText='width:100%;border-collapse:collapse;text-align:left';table.append(el('caption','Equal-window activity comparison'));
   const head=el('thead'),tr=el('tr');for(const label of ['Team / metric','Before','After','Change']){const th=el('th',label);th.scope='col';tr.append(th)}head.append(tr);table.append(head);const body=el('tbody');
   for(const o of group.observations){const row=el('tr'),fact=packet.facts.find(f=>f.event_ids?.includes(group.trigger_id)&&f.comparison?.team_id===o.team_id&&f.comparison?.metric===o.metric),name=fact?.text.split(':')[0]||o.team_id;
    const label=el('th',`${name} · ${o.metric==='shots'?'Shots':'Completed passes'}`);label.scope='row';row.append(label,el('td',String(o.before)),el('td',String(o.after)),el('td',o.delta===0?'Unchanged':`${o.delta>0?'+':''}${o.delta} · ${o.direction}`));body.append(row)
   }table.append(body);card.append(table);
   const details=el('details'),ids=[...new Set([group.trigger_id,...group.observations.flatMap(o=>o.event_ids)])];details.append(el('summary',`Source event IDs (${ids.length})`),el('p',ids.join(', '),'muted'));card.append(details);section.append(card);
  }
  host.append(section);
 };
 const style=el('style');style.textContent='.calculated-comparisons{border:1px solid #76965b;border-radius:12px;padding:18px;margin:18px 0;background:#132a22}.comparison-group{margin-top:20px}.calculated-comparisons th,.calculated-comparisons td{padding:10px 6px;border-bottom:1px solid #385046}.calculated-comparisons caption{text-align:left;margin-bottom:8px}.calculated-comparisons details p{overflow-wrap:anywhere}@media(max-width:600px){.calculated-comparisons{padding:10px}.calculated-comparisons th,.calculated-comparisons td{font-size:12px;padding:8px 3px}}';document.head.append(style);
})();
