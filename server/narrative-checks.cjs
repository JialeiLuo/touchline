/* Independently check typed narrative claims against server-owned calculations. */
const {isDeepStrictEqual}=require('node:util');
function sourceIds(p,predicate){return p.facts.filter(predicate).map(f=>f.id);}
function expectedClaim(c,p){
 const inv=p.investigations.find(i=>i.player_id===c.player_id),situation=p.facts.find(f=>f.kind==='Interval situation');
 if(c.kind==='history_share'&&inv)return{kind:c.kind,player_id:inv.player_id,assigned_position:inv.assigned_position,role_minutes:inv.history.role_minutes,minutes:inv.history.minutes,records:inv.history.records,status:inv.history.status,known_at:inv.at,basis_fact_ids:sourceIds(p,f=>f.kind==='Substitution investigation'&&f.investigation_player===inv.player_id)};
 if(c.kind==='player_windows'&&inv){const x=inv.comparison;return{kind:c.kind,player_id:inv.player_id,status:x.status,before:x.status==='ready'?{completed:x.before.completed,passes:x.before.passes,shots:x.before.shots,seconds:x.before.on_pitch_seconds}:null,after:x.status==='ready'?{completed:x.after.completed,passes:x.after.passes,shots:x.after.shots,seconds:x.after.on_pitch_seconds}:null,from:x.before_window.from,boundary:inv.at,to:x.after_window.to,basis_fact_ids:sourceIds(p,f=>f.kind==='Substitution investigation'&&f.investigation_player===inv.player_id)};}
 if(c.kind==='team_change'){const g=p.comparisons.find(g=>g.trigger_id===c.trigger_id&&g.status==='ready'),values=g?.observations.filter(o=>o.team_id===c.team_id);if(!values?.length)return null;return{kind:c.kind,trigger_id:c.trigger_id,team_id:c.team_id,from:g.before.from,boundary:g.boundary,to:g.after.to,metrics:values.map(o=>({metric:o.metric,before:o.before,after:o.after,direction:o.direction})),basis_fact_ids:sourceIds(p,f=>f.comparison?.team_id===c.team_id&&f.event_ids.includes(c.trigger_id))};}
 if(c.kind==='concurrent_changes'&&inv)return{kind:c.kind,player_id:inv.player_id,count:inv.other_change_ids.length,event_ids:inv.other_change_ids,basis_fact_ids:sourceIds(p,f=>f.kind==='Substitution investigation'&&f.investigation_player===inv.player_id)};
 if(c.kind==='interval_score'&&situation)return{kind:c.kind,from:p.interval.from,to:p.interval.to,start:situation.score_start,end:situation.score_end,shots:[p.interval_statistics.northbridge.shots,p.interval_statistics.southport.shots],basis_fact_ids:[situation.id]};
 if(c.kind==='sequence_summary'){const team=p.sequence_analysis?.teams.find(t=>t.team_id===c.team_id);if(!team)return null;return{kind:c.kind,team_id:team.team_id,from:p.interval.from,to:p.interval.to,counts:team.counts,coverage:team.coverage,basis_fact_ids:sourceIds(p,f=>f.kind==='Possession sequence analysis'&&f.text.startsWith(team.team_name+':'))};}
 if(c.kind==='chance_values'){const t=p.chance_quality?.teams.find(t=>t.team_id===c.team_id);if(t?.status!=='complete')return null;return{kind:c.kind,team_id:t.team_id,source_id:t.source_groups[0].source.id,shots:t.shots,total:t.xg_total,mean:t.xg_per_shot,goals:t.goals,basis_fact_ids:sourceIds(p,f=>f.kind==='Chance quality'&&f.chance_team===t.team_id)};}
 if(c.kind==='quiet_record')return{kind:c.kind,shots:[p.interval_statistics.northbridge.shots,p.interval_statistics.southport.shots],goals:[p.interval_statistics.northbridge.goals,p.interval_statistics.southport.goals],substitutions:p.squad_context.length,cards:['northbridge','southport'].reduce((n,t)=>n+p.interval_statistics[t].yellow+p.interval_statistics[t].red,0),shape_changes:p.football_tools.formation.teams.reduce((n,t)=>n+t.changes.length,0),reports:p.annotations.length,basis_fact_ids:sourceIds(p,f=>['Interval situation','Analysis coverage'].includes(f.kind))};
 if(c.kind==='sequence_availability')return{kind:c.kind,available:!!p.sequence_analysis,basis_fact_ids:sourceIds(p,f=>f.kind==='Analysis coverage')};
 return null;
}
function validateNarrative(paragraph,p){
 if(paragraph.parts){if(Object.keys(paragraph.parts).sort().join('|')!=='alternative|fact|reading'||Object.values(paragraph.parts).some(v=>typeof v!=='string')||[paragraph.parts.fact,paragraph.parts.reading,paragraph.parts.alternative].filter(Boolean).join(' ')!==paragraph.text)throw Error('Narrative text differs from rendered parts');}
 const facts=new Set(p.facts.map(f=>f.id));if(!paragraph.evidence_ids?.length||paragraph.evidence_ids.some(id=>!facts.has(id)))throw Error('Unsupported narrative references');
 for(const claim of paragraph.structured_claims||[]){const expected=expectedClaim(claim,p);if(!expected||!isDeepStrictEqual(claim,expected)||!claim.basis_fact_ids.length||claim.basis_fact_ids.some(id=>!paragraph.evidence_ids.includes(id)))throw Error('Unsupported structured narrative claim');
  if(claim.kind==='quiet_record'&&[...claim.shots,...claim.goals,claim.substitutions,claim.cards,claim.shape_changes,claim.reports].some(Boolean))throw Error('Unsupported quiet-play conclusion');
  if(claim.kind==='team_change'&&claim.to>Math.min(p.as_of,p.interval.to))throw Error('Unrevealed narrative window');
  if(claim.kind==='player_windows'&&claim.status==='ready'&&claim.to>Math.min(p.as_of,p.interval.to))throw Error('Unrevealed player comparison');
 }
 return paragraph;
}
module.exports={expectedClaim,validateNarrative};
