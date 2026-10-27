/* Readable source disclosures and inspected-evidence limitations. */
(function(){
 const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
 const clock=t=>`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;
 window.renderFactEvidence=function(host,f,packet){
  if(!f){host.append(el('p','The source detail is unavailable in this response.'));return;}
  const item=el('section');item.className='source-fact';item.append(el('p',f.text));
  const events=[...new Set(f.event_ids||[])],history=[...new Set(f.history_ids||[])],reports=[...new Set(f.annotation_ids||[])];
  const records=el('details');records.append(el('summary',`Underlying records · ${events.length} events, ${history.length} history, ${reports.length} reports`));
  for(const id of events){const event=packet.events?.find(e=>e.id===id);records.append(el('p',event?`${clock(event.t)} · ${event.type.replaceAll('_',' ')} · ${event.text||event.actor_id||'Recorded event'} [${id}]`:`Event reference: ${id}. Its individual description is not included here; the calculated source statement above includes its contribution.`));}
  for(const id of history)records.append(el('p',`Supplied historical record: ${id}. Role history describes the supplied sample, not ability.`));
  for(const id of reports){const report=packet.annotations?.find(a=>a.id===id);records.append(el('p',report?`${report.status} report · available ${clock(report.available_at)} · ${report.source}: ${report.description} [${id}]`:`Report reference: ${id}`));}
  records.append(el('p',`Fact reference: ${f.id}. Comparison windows can include events before the selected interval; only evidence available at the permitted replay time is used.`));item.append(records);host.append(item);
 };
 window.renderEvidenceNotice=function(host,output){
  const limited=output.evidence_status==='insufficient_evidence',local=output.mode==='template';if(!limited&&!local)return;
  const box=el('section');box.className='answer evidence-notice';box.setAttribute('aria-label',limited?'Limited evidence':'Local explanation');box.append(el('strong',limited?'Evidence is limited':'Local explanation'));
  const messages=[];
  if(limited){messages.push('The inspected evidence does not establish a fuller explanation. The recorded events below are still available.');
   for(const step of output.investigation?.steps||[]){if(step.status==='rejected')continue;
    if(step.tool==='compare_change'&&['insufficient_window','waiting'].includes(step.status))messages.push('There is not enough recorded play for a full before-and-after comparison. A later replay position may help if more play after the change is needed.');
    if(step.tool==='role_history'&&step.status==='missing')messages.push('Usable prior role history is missing. This does not mean the player has no experience.');
    if(step.tool==='analyse_possession'&&step.status==='unavailable')messages.push('Possession detail is unavailable, so passing totals alone cannot explain how attacks developed.');
    if(step.tool==='analyse_possession'&&step.status==='no_complete_sequences')messages.push('No complete possession sequences were available for this query. This does not establish that no play occurred.');
    if(step.tool==='inspect_chances'&&['unavailable','partial','mixed_sources'].includes(step.status))messages.push('Comparable chance values are unavailable or incomplete; missing values are not zero.');
   }
  }else messages.push('Online analysis was unavailable or stopped at its limit. This explanation uses the recorded evidence and local rules. You can still inspect sources or open the event recap.');
  for(const text of new Set(messages))box.append(el('p',text));host.append(box);
 };
})();
