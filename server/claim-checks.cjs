/* Conservative lexical guard, not a semantic or causal verifier. */
const words={zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20};
function numbers(text){return [...text.matchAll(/\b\d+(?:\.\d+)?(?:st|nd|rd|th)?\b|\b(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty)\b/gi)].map(m=>String(words[m[0].toLowerCase()]??Number(m[0].replace(/(st|nd|rd|th)$/i,''))));}
function checkClaims(output,p){
 const facts=new Map(p.facts.map(f=>[f.id,f.text]));
 for(const para of output.paragraphs){
  const source=para.evidence_ids.map(id=>facts.get(id)||'').join(' '),allowed=new Set(numbers(source));
  if(/\b(?:box|penalty area)\b/i.test(para.text)&&!/\b(?:box|penalty area)\b/i.test(source))throw Error('Unsupported penalty-area observation');
  if(/\b(?:threat|chance quality)\b.{0,35}\b(?:rose|increased|improved|fell|decreased)\b/i.test(para.text)&&!/\b(?:xG|expected goals|chance quality increased|chance quality decreased)\b/i.test(source))throw Error('Unsupported chance-quality trend');
  if(numbers(para.text).some(n=>!allowed.has(n)))throw Error('Unsupported numeric claim');
  // Durations require dedicated calculated facts, which this prototype does not supply.
  if(/\b(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten)[ -](?:minute|second|hour)s?\b|\b(?:final|last)\s+(?:\d+|five|ten)\s+minutes\b/i.test(para.text))throw Error('Unsupported duration claim');
 }
 // A short neutral headline avoids unchecked model-created score/duration assertions.
 if(numbers(output.headline).length||/\b(?:equalis|equaliz|winner|winning|comeback|final(?![ -]third)|caused)\w*\b/i.test(output.headline))throw Error('Unsupported headline claim');
 return output;
}
module.exports={checkClaims,numbers};
