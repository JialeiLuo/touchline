// Descriptive simulator audit; no comparison with real football and no model calls.
const fs=require('node:fs'),path=require('node:path'),{simulate,stats}=require('../full-match.js');
const rows=[];for(let seed=0;seed<60;seed++){const d=simulate(seed),s=stats(d.events,d.events.length-1),teams=Object.values(s);rows.push({seed,events:d.events.length,goals:teams.reduce((a,r)=>a+r.goals,0),shots:teams.reduce((a,r)=>a+r.shots,0),passes:teams.reduce((a,r)=>a+r.passes,0),yellow:teams.reduce((a,r)=>a+r.yellow,0),red:teams.reduce((a,r)=>a+r.red,0)})}
const summary={};for(const k of ['events','goals','shots','passes','yellow','red']){const v=rows.map(r=>r[k]);summary[k]={min:Math.min(...v),max:Math.max(...v),mean:Number((v.reduce((a,b)=>a+b,0)/v.length).toFixed(2))}}
const result={simulator_version:'0.3',seeds:'0–59',purpose:'Descriptive audit, not empirical football calibration or independent realism validation',summary,rows};
fs.writeFileSync(path.join(__dirname,'../docs/simulator-audit.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(summary,null,2));
