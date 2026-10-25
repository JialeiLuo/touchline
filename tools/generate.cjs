// Usage: node tools/generate.cjs 7 neutral > generated.json
const {generate}=require('../generator.js');process.stdout.write(JSON.stringify(generate(Number(process.argv[2]||7),process.argv[3]||'neutral'),null,2)+'\n');
