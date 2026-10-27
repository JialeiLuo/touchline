const MatchClock=require('../match-clock.js');
/* Compose complementary source-owned stories; retain decisive incidents first. */
const {validateNarrative}=require('./narrative-checks.cjs');
const words=t=>t.trim().split(/\s+/).filter(Boolean).length;
function compose(selection,p,candidates){
 const ids=selection?.story_ids,limit=p.viewer_mode==='quick'?2:4,wordLimit=p.viewer_mode==='quick'?120:280;
 if(!Array.isArray(ids)||!ids.length||ids.length>limit||new Set(ids).size!==ids.length||ids.some(id=>!candidates.some(s=>s.id===id)))throw Error('Invalid story selection');
 const selected=ids.map(id=>{const story=candidates.find(s=>s.id===id);if(!story.essential&&story.scope.kind==='selected_interval'&&story.evidence_ids.some(id=>p.facts.find(f=>f.id===id)?.kind==='Interval situation'))return candidates.find(s=>s.scope.kind==='interval_synthesis'&&s.evidence_ids.some(id=>story.evidence_ids.includes(id)))||story;if(['contextual_investigation','since_substitution'].includes(story.scope.kind))return candidates.find(s=>s.scope.kind==='substitution_synthesis'&&s.player_id===story.player_id)||story;if(story.scope.kind==='equal_windows')return candidates.find(s=>['substitution_synthesis','change_synthesis'].includes(s.scope.kind)&&s.team_id===story.team_id&&story.evidence_ids.every(id=>s.evidence_ids.includes(id)))||story;return story;}),essentialRows=candidates.filter(s=>s.essential),essential=essentialRows.length>1?[{...essentialRows[0],id:'essential-summary',title:'The decisive recorded incidents',text:essentialRows.map(s=>s.text).join(' '),quick_text:essentialRows.map(s=>s.quick_text).join(' '),evidence_ids:[...new Set(essentialRows.flatMap(s=>s.evidence_ids))]}]:essentialRows;
 const ranked=[...candidates].sort((a,b)=>b.priority-a.priority),player=ranked.find(s=>s.player_id===p.player_focus),team=selected.find(s=>s.team_id===p.viewer_focus&&s.scope.kind==='substitution_synthesis')||selected.find(s=>s.team_id===p.viewer_focus)||ranked.find(s=>s.team_id===p.viewer_focus);
 const connected=selected.filter(s=>s.scope.kind==='substitution_synthesis');
 const ordered=[...essential,...(player?[player]:[]),...(team?[team]:[]),...connected,...selected.filter(s=>!s.essential),...ranked.filter(s=>!s.essential)];
 const chosen=[],views=[],activityScopes=[],alternatives=new Set(),used=new Set(),covered=new Set(),tags=new Set();let wordCount=0;
 for(const story of ordered){if(chosen.length>=limit)break;if(used.has(story.id))continue;used.add(story.id);
  if(!story.essential&&(story.evidence_ids.every(id=>covered.has(id))||story.coverage_tags?.some(tag=>tags.has(tag))))continue;
  const activity=story.activity_scope||(story.scope.kind==='equal_windows'?{team_id:story.team_id,from:story.scope.before.from,to:story.scope.after.to}:null);
  if(activity&&!story.player_id&&activityScopes.some(a=>a.team_id===activity.team_id&&Math.max(0,Math.min(a.to,activity.to)-Math.max(a.from,activity.from))/Math.min(a.to-a.from,activity.to-activity.from)>=.8))continue;
  const contextual=chosen.some(s=>s.player_id===story.player_id&&['substitution_synthesis','contextual_investigation'].includes(s.scope.kind));if(contextual&&['player_interval','since_substitution','contextual_investigation'].includes(story.scope.kind))continue;
  const parts=story.narrative?{...story.narrative[p.viewer_mode]}:null;if(parts&&story.alternative_category&&alternatives.has(story.alternative_category))parts.alternative='';const text=parts?[parts.fact,parts.reading,parts.alternative].filter(Boolean).join(' '):p.viewer_mode==='quick'?story.quick_text:story.text,cost=words(text);
  if(!story.essential&&wordCount+cost>wordLimit&&chosen.length)continue;
  chosen.push(story);if(activity)activityScopes.push(activity);views.push({parts,text});if(parts?.alternative&&story.alternative_category)alternatives.add(story.alternative_category);wordCount+=cost;story.evidence_ids.forEach(id=>covered.add(id));story.coverage_tags?.forEach(tag=>tags.add(tag));
 }
 const paragraphs=chosen.map((story,i)=>{const {parts,text}=views[i],paragraph={text,evidence_ids:story.evidence_ids,scope_label:story.scope_label,origin_story_ids:[story.id],...(parts?{parts}: {}),...(story.structured_claims?{structured_claims:story.structured_claims}:{})};return validateNarrative(paragraph,p);});
 const full=p.match_complete===true,situation=p.facts.find(f=>f.kind==='Interval situation'),clock=t=>MatchClock.format(p,t);
 let takeaway=null;if(full&&situation){const[a,b]=situation.score_end;takeaway=`The match is complete: ${situation.team_names[0]} ${a}–${b} ${situation.team_names[1]}. ${p.interval.from===0?'Review the recorded result alongside the evidence above; no single cause is established.':`The explanation covers ${clock(p.interval.from)}–${clock(p.interval.to)}; its activity counts are not whole-match totals.`}`;}
 return{headline:chosen[0].title,paragraphs,watch_label:full?'Replay takeaway':'What to watch next',watch_next:full?takeaway:chosen.find(s=>s.watch_next)?.watch_next||null,limitations:p.limitations,composition:'selected-stories',commentary_contract:'batch6-v1',word_count:wordCount,word_limit:wordLimit,length_exception:wordCount>wordLimit?(essential.length?'essential_incident_coverage':'long_source_story'):null};
}
module.exports={compose};
