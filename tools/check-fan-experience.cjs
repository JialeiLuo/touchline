/* Browser integration checks; local fallback and controlled failure, no model calls. */
const A=require('node:assert/strict'),{spawn}=require('node:child_process'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.TOUCHLINE_PLAYWRIGHT||'playwright');
(async()=>{
 const port=18767,origin='http://127.0.0.1:'+port;
 const server=spawn(process.execPath,['server.cjs'],{cwd:path.resolve(__dirname,'..'),env:{...process.env,PORT:String(port),AZURE_FOUNDRY_BASE_URL:'',AZURE_FOUNDRY_API_KEY:'',AZURE_FOUNDRY_DEPLOYMENT:''},stdio:'ignore'});
 let browser;const checks=[],errors=[];
 try{
  for(let i=0;i<60;i++){try{if((await fetch(origin+'/api/status')).ok)break}catch{}await new Promise(r=>setTimeout(r,100));}
  browser=await chromium.launch({executablePath:process.env.TOUCHLINE_BROWSER||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
  const page=await browser.newPage({viewport:{width:1280,height:900}});page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin);await page.locator('#guidedExample').click();
  A.match(await page.locator('#selectionSummary').innerText(),/Ellis/);
  A.equal(await page.locator('#aiCatchup').isEnabled(),true);
  await page.locator('#previousInterval').click();A.equal(await page.locator('#catchFrom').inputValue(),'44');A.equal(await page.locator('#catchTo').inputValue(),'55');
  await page.locator('#nextInterval').click();A.equal(await page.locator('#catchFrom').inputValue(),'55');A.equal(await page.locator('#nextInterval').isDisabled(),true);
  await page.locator('#catchTo').fill('67');A.equal(await page.locator('#aiCatchup').isDisabled(),true);A.match(await page.locator('#intervalHelp').innerText(),/has not happened yet/);
  await page.locator('#catchTo').fill('65.5');A.match(await page.locator('#intervalHelp').innerText(),/whole minutes or a football clock/);
  await page.locator('#revealedInterval').click();A.match(await page.locator('#catchFrom').inputValue(),/^61(?::[0-5]\d)?$/);checks.push('Whole-minute validation, interval stepping and future-time prevention');
  await page.locator('#aiCatchup').click();await page.waitForFunction(()=>document.querySelector('#aiResult').getAttribute('aria-busy')==='false');
  A.match(await page.locator('#aiResult').innerText(),/fallback|local/i);A(await page.locator('#aiResult details').count()>0);A.equal(await page.locator('#aiResult pre .term').count(),0);
  const term=page.locator('#aiResult .term').first();A(await term.count());await page.selectOption('#language','zh');await term.click();A.equal(await page.locator('dialog[open]').count(),1);await page.keyboard.press('Escape');checks.push('Local commentary, evidence disclosure and glossary in retained commentary');
  let release;const gate=new Promise(r=>release=r);let calls=0;
  await page.route('**/api/commentary',async route=>{calls++;await gate;await route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Simulated connection failure. Use the local recap.'})});});
  await page.locator('#aiCatchup').click();await page.waitForFunction(()=>document.querySelector('#aiResult').getAttribute('aria-busy')==='true');
  A.equal(await page.locator('#aiCatchup').isDisabled(),true);A.equal(await page.locator('#showComparisons').isDisabled(),true);
  await page.locator('#viewerFocus').selectOption('southport');release();await page.waitForFunction(()=>document.querySelector('#aiResult').getAttribute('aria-busy')==='false');
  A.match(await page.locator('#aiResult').innerText(),/selection changed/i);A.equal(calls,1);await page.unroute('**/api/commentary');
  await page.route('**/api/commentary',route=>route.abort('failed'));
  await page.locator('#aiCatchup').click();await page.waitForFunction(()=>document.querySelector('#aiResult').getAttribute('aria-busy')==='false');A.match(await page.locator('#aiResult').innerText(),/could not be reached/i);A.equal(await page.locator('#commentaryRecovery').isVisible(),true);await page.unroute('**/api/commentary');
  await page.locator('#aiCatchup').click();await page.waitForFunction(()=>document.querySelector('#aiResult').getAttribute('aria-busy')==='false');
  await page.locator('#commentaryRecovery button').last().click();A(await page.locator('#catchReport h3').count());await page.locator('#previousInterval').click();A.match(await page.locator('#catchReport').innerText(),/changed/);checks.push('Single in-flight request, stale-response suppression and local recovery');
  await page.locator('#demoControls').evaluate(e=>e.open=true);await page.locator('#loadExample').click();await page.waitForFunction(()=>document.querySelector('#packageStatus').textContent.startsWith('Loaded'));
  A.equal(await page.locator('#guidedExample').isVisible(),false);
  await page.evaluate(()=>{packageExpiresAt=0;render()});A.equal(await page.locator('#aiCatchup').isDisabled(),true);A.equal(await page.locator('#showComparisons').isDisabled(),true);A.match(await page.locator('#commentaryFreshness').innerText(),/Reload expired package/);checks.push('Uploaded match protected from example replacement; expiry blocks every server analysis action');
  await page.locator('#clearPackage').click();await page.waitForFunction(()=>!fullReplay.package_id);await page.locator('#guidedExample').click();
  await page.locator('#demoControls').evaluate(e=>e.open=false);await page.setViewportSize({width:390,height:844});await page.screenshot({path:'docs/batch-7-mobile.png',fullPage:true});
  A(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth).map(e=>[e.tagName,e.id,e.getBoundingClientRect().right]).slice(0,20))));
  await page.getByRole('button',{name:'Teams & lineups',exact:true}).click();await page.locator('.lineup-player').first().click();await page.getByRole('button',{name:'Follow this player in commentary'}).click();A.equal(await page.locator('#commentaryWorkspace').isVisible(),true);A.match(await page.locator('#selectionSummary').innerText(),/Following/);checks.push('Lineup player follow returns to commentary with the selected player');
  await page.locator('#quickGuide').click();await page.keyboard.press('Escape');A.equal(await page.locator('#quickGuide').evaluate(e=>e===document.activeElement),true);
  await page.setViewportSize({width:1280,height:900});await page.locator('#commentaryWorkspace').scrollIntoViewIfNeeded();await page.screenshot({path:'docs/batch-7-commentary.png'});await page.screenshot({path:'docs/batch-7-desktop.png',fullPage:true});checks.push('390px viewport without horizontal page overflow; keyboard dismissal returns focus');
  A.deepEqual(errors,[]);fs.writeFileSync('docs/batch-7-browser-check.json',JSON.stringify({checks,errors,limitations:'Automated browser integration checks with local fallback and controlled failures; not unfamiliar-user testing or a WCAG conformance audit.'},null,2)+'\n');console.log(checks.join('\n'));
 }finally{if(browser)await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
