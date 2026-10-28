/* Relates recorded facts to curated laws; never classifies footage or uploaded prose. */
(function(root){const Rules=typeof module!=='undefined'?require('./data/rules.js'):root.OFFICIAL_RULES;
function explain(event){if(!event||!['foul','yellow_card','red_card','restart','added_time'].includes(event.type))return null;
 if(event.type==='restart'&&!event.decision&&!/free kick/i.test(event.text||''))return null;
 const d=event.decision||{};let key='challenge',missing=null;
 if(event.type==='added_time')key='added_time';
 else if(event.type==='red_card'&&event.reason==='second_yellow')key='second_yellow';
 else if(d.offence==='dissent')key='ifab-player-dissent-2026-10-25';
 else if(d.offence==='challenge'&&['careless','reckless','excessive_force'].includes(d.severity))key=d.severity;
 else if(event.type==='restart'){key='restart';missing='The restart record does not identify the underlying offence or whether this was a direct or indirect free kick.';}
 else missing='The record does not specify the offence and its severity. A card or free kick alone cannot establish whether a challenge was reckless, used excessive force, or involved another offence.';
 const law=Rules[key];return{recorded:event.text||event.type.replaceAll('_',' '),decision:event.type==='added_time'?`Minimum announced: ${event.minimum_seconds/60} minutes.`:[d.offence&&`Offence: ${d.offence}`,d.severity&&`Supplied classification: ${d.severity.replaceAll('_',' ')}`,d.sanction&&`Recorded sanction: ${d.sanction.replaceAll('_',' ')}`,d.restart&&`Recorded restart: ${d.restart.replaceAll('_',' ')}`].filter(Boolean).join('. ')||`Recorded event: ${event.type.replaceAll('_',' ')}.`,law,explanation:law.explanation,missing,provenance:'Input facts are synthetic and supplied, not independently verified. The law reference does not certify the referee’s decision.'};}
root.DecisionExplanations={explain};if(typeof module!=='undefined')module.exports={explain};})(globalThis);
