/* Render server-calculated evidence; no model-generated values or markup. */
(function(){
 const clock=t=>`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;
 function el(tag,text,cls){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node}
 window.renderInvestigation=function(host,packet){
  if(!packet.investigations?.length)return;const section=el('section',undefined,'calculated-comparisons');section.append(el('h3','Substitution investigation'));
  for(const inv of packet.investigations){section.append(el('h4',`${inv.name} · assigned ${inv.assigned_position}`),el('p',`${inv.history.minutes?`${inv.history.role_minutes} minutes in this role from ${inv.history.minutes} minutes across ${inv.history.records} supplied previous matches.`:'No usable role-minute history is available.'} History used only if available when the player came on.`));
   const c=inv.comparison;if(c.status==='ready')section.append(el('p',`Player exposure: outgoing ${c.before.on_pitch_seconds} / ${c.before.duration_seconds}s; incoming ${c.after.on_pitch_seconds} / ${c.after.duration_seconds}s. Different time on pitch can affect the counts. ${inv.other_change_ids.length} concurrent recorded changes; this cannot isolate a substitution effect.`));else section.append(el('p','A full post-entry window is not available. Player comparison counts are unavailable.'));
   const details=el('details');details.append(el('summary','Investigation steps and sources'));for(const source of inv.history.sources||[])details.append(el('p',`${source.id} · ${source.source} · available ${clock(source.available_at)}`));for(const step of inv.trace)details.append(el('p',`${step.tool.replaceAll('_',' ')} · ${step.status}${step.as_of!==undefined?' · known by '+clock(step.as_of):''}${step.record_ids?' · '+step.record_ids.join(', '):''}${step.event_ids?.length?' · '+step.event_ids.join(', '):''}`));section.append(details);
  }host.append(section);
 };
 window.renderSequenceStory=function(host,packet){
  const report=packet.sequence_analysis;if(!report){if(packet.input_capabilities?.sequence_reason)host.append(el('p','How attacks developed · '+packet.input_capabilities.sequence_reason,'muted'));return;}
  const section=el('section',undefined,'calculated-comparisons');section.setAttribute('aria-label','How attacks developed');section.append(el('h3','How attacks developed'));
  for(const team of report.teams){
   section.append(el('p',team.story));if(team.coverage)section.append(el('p',`Excluded: ${team.coverage.boundary_crossing} boundary-crossing and ${team.coverage.unfinished} unfinished sequences. Shares use only ${team.coverage.included} complete sequences.`, 'muted'));
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
  if(!groups.length)section.append(el('p','No substitution, dismissal or declared tactical change occurs in this selected interval. Try seed 7, minutes 40–50, after advancing the replay to at least 50 minutes.'));
  for(const group of groups){
   const card=el('div',undefined,'comparison-group');card.append(el('h4',`${group.trigger_team} · ${group.trigger_type==='sub'?'substitution':group.trigger_type==='red_card'?'dismissal':'declared tactical change'} at ${clock(group.boundary)}`));
   if(group.status!=='ready'){card.append(el('p',group.boundary-group.window<0||group.available_at>5400?'This event does not have enough match time on both sides for an equal-window comparison.':`Not enough revealed time in the selected interval. Set its end to at least ${clock(group.available_at)} and advance the replay to that time.`));section.append(card);continue}
   card.append(el('p',`Before ${clock(group.before.from)}–${clock(group.before.to)} · After ${clock(group.after.from)}–${clock(group.after.to)}. Each window includes its start and excludes its end.`,'muted'));
   const table=el('table');table.style.cssText='width:100%;border-collapse:collapse;text-align:left';table.append(el('caption','Equal-window activity comparison'));
   const head=el('thead'),tr=el('tr');for(const label of ['Team / metric','Before','After','Change']){const th=el('th',label);th.scope='col';tr.append(th)}head.append(tr);table.append(head);const body=el('tbody');
   for(const o of group.observations){const row=el('tr'),fact=packet.facts.find(f=>f.event_ids?.includes(group.trigger_id)&&f.comparison?.team_id===o.team_id&&f.comparison?.metric===o.metric),name=fact?.text.split(':')[0]||o.team_id;
    const label=el('th',`${name} · ${o.metric==='shots'?'Shots':'Completed passes'}`);label.scope='row';row.append(label,el('td',String(o.before)),el('td',String(o.after)),el('td',o.delta===0?'Unchanged':`${o.delta>0?'+':''}${o.delta} · ${o.direction}`));body.append(row)
   }table.append(body);card.append(table);
   const tools=packet.football_tools?.change_comparisons.find(c=>c.trigger_id===group.trigger_id);
   if(tools?.status==='ready'){
    for(const team of tools.teams){const name=packet.facts.find(f=>f.comparison?.team_id===team.team_id)?.text.split(':')[0]||team.team_id;
     const describe=side=>{const p=side.progression;return `passes completed ${side.pass_completion.numerator}/${side.pass_completion.denominator}${side.pass_completion.value===null?' (no pass attempts)':''}; progression ${p.status==='unavailable'?'unavailable':`${p.entry_share.numerator}/${p.entry_share.denominator} complete sequences reached the attacking third${p.entry_share.value===null?' (no complete sequences)':''}`}; ${side.discipline.yellow_events} cautions, ${side.discipline.dismissals} dismissals`;};
     card.append(el('p',`${name} · Before: ${describe(team.before)}. After: ${describe(team.after)}.`));
    }
    card.append(el('p',`${tools.concurrent_changes.length} other recorded goal, dismissal, substitution or formation changes overlap these windows. These counts do not measure chance quality or establish cause.`, 'muted'));
    const source=el('details');source.append(el('summary','Detailed denominators, exclusions and concurrent sources'),el('pre',JSON.stringify(tools,null,2)));card.append(source);
   }
   const details=el('details'),ids=[...new Set([group.trigger_id,...group.observations.flatMap(o=>o.event_ids)])];details.append(el('summary',`Source event IDs (${ids.length})`),el('p',ids.join(', '),'muted'));card.append(details);section.append(card);
  }
  const tools=packet.football_tools;
  if(tools){const state=el('details');state.append(el('summary','Declared shape and discipline in the selected interval'));
   for(const team of tools.formation.teams){const d=tools.discipline.teams.find(t=>t.team_id===team.team_id),name=packet.facts.find(f=>f.comparison?.team_id===team.team_id)?.text.split(':')[0]||team.team_id;state.append(el('p',`${name}: declared shape ${team.before} → ${team.after}; ${team.changes.length} recorded declarations. On pitch ${d.on_pitch_start} → ${d.on_pitch_end}; ${d.booked_on_pitch_end.length}/${d.on_pitch_end} remaining players booked. No declaration does not prove the on-field tactics stayed the same.`));}
   state.append(el('p','Only core recorded player cards are counted. Incident reports do not establish sanctions.','muted'));section.append(state);
  }
  host.append(section);
 };
 const style=el('style');style.textContent='.calculated-comparisons{border:1px solid #76965b;border-radius:12px;padding:18px;margin:18px 0;background:#132a22}.comparison-group{margin-top:20px}.calculated-comparisons th,.calculated-comparisons td{padding:10px 6px;border-bottom:1px solid #385046}.calculated-comparisons caption{text-align:left;margin-bottom:8px}.calculated-comparisons details p{overflow-wrap:anywhere}.calculated-comparisons pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:360px;overflow:auto}@media(max-width:600px){.calculated-comparisons{padding:10px}.calculated-comparisons th,.calculated-comparisons td{font-size:12px;padding:8px 3px}}';document.head.append(style);
})();
