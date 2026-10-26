const A=require('node:assert/strict'),{scenarios,fixture}=require('../evaluation/scenarios.cjs'),{evaluate}=require('../tools/evaluate-scenarios.cjs'),{validate}=require('../match-package.js');
A.equal(new Set(scenarios.map(s=>s.id)).size,scenarios.length);
A.equal(scenarios.filter(s=>s.split==='holdout').length,4);
for(const spec of scenarios){validate(fixture(spec).data);const a=evaluate(spec,'tactical'),b=evaluate(spec,'tactical');A(a.passed,JSON.stringify(a.checks.filter(c=>!c.passed)));A.deepEqual(a,b,'Fixture and outputs must be reproducible');}
const quiet=scenarios[0],bad=evaluate({...quiet,expect:{...quiet.expect,score:[9,9]}},'quick');A.equal(bad.passed,false);A(bad.checks.some(c=>!c.passed&&c.name==='closing score'),'Incorrect expectations must fail, not silently refresh');
console.log('Scenario suite: deterministic fixtures, separate holdout membership, explicit expectations and failure reporting pass.');
