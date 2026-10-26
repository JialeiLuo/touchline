const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),data=JSON.parse(fs.readFileSync(path.join(root,'data/squads.json'),'utf8'));
fs.writeFileSync(path.join(root,'data/squads.js'),'/* Generated from squads.json by tools/sync-squads.cjs. */\n(function(root){const data='+JSON.stringify(data)+';root.SQUAD_DATA=data;if(typeof module!=="undefined")module.exports=data;})(globalThis);\n');
