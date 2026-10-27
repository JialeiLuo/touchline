/* Authored report regressions, not held-out validation or realistic distributions. */
const F=require('../full-match.js'),P=require('../match-package.js');
function reportFixture({quiet=false,missingHistory=false}={}){
 const d=P.fromReplay(F.simulate(1,{added_time:[{minimum:120,actual:180},{minimum:180,actual:240}]}));
 const player=team=>d.squads.teams[team].players.find(p=>p.starting&&p.assigned_position!=='GK').id;
 const sub=d.squads.teams.northbridge.players.find(p=>!p.starting&&p.usual_position==='ST').id,out=d.squads.teams.northbridge.players.find(p=>p.starting&&p.assigned_position==='RW').id,red=d.squads.teams.southport.players.find(p=>p.starting&&p.assigned_position==='RW').id;
 const e=(id,t,period,type,extra={})=>({id,t,period,type,synthetic:true,...extra}),goal=(id,t,period,team)=>[e(id+'-shot',t,period,'shot',{team_id:team,actor_id:player(team),outcome:'goal'}),e(id,t,period,'goal',{team_id:team,actor_id:player(team),shot_id:id+'-shot'})];
 d.events=[e('ko',0,1,'kickoff'),e('tick',1000,1,'restart'),e('add1',2700,1,'added_time',{minimum_seconds:120}),...(!quiet?goal('opener',2820,1,'northbridge'):[]),e('ht',2880,1,'half_time'),e('ko2',2880,2,'kickoff'),e('tick2',3000,2,'restart'),...(!quiet?goal('equaliser',5500,2,'southport'):[]),e('add2',5580,2,'added_time',{minimum_seconds:180}),...(!quiet?[e('sub',5600,2,'sub',{team_id:'northbridge',actor_id:sub,outgoing_id:out})]:[]),e('report-ready',5710,2,'restart'),...(!quiet?[e('red',5800,2,'red_card',{team_id:'southport',actor_id:red}),...goal('winner',5810,2,'northbridge')]:[]),e('same-time',5820,2,'restart'),e('ft',5820,2,'full_time')];
 d.annotations=quiet?[]:[{id:'initial',kind:'incident',happened_at:5700,available_at:5710,status:'reported',description:'An initial observer account.',source:'Authored observer',synthetic:true},{id:'corrected',kind:'incident',happened_at:5700,available_at:5810,status:'corrected',description:'The earlier account was corrected; no additional sanction is confirmed.',source:'Authored clarification',supersedes:'initial',synthetic:true}];
 if(missingHistory)delete d.history;P.validate(d);return d;
}
module.exports={reportFixture};
