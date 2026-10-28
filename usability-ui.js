/* Batch 9: a single introduction before setup, with fan-facing source guidance. */
(function(){
 const main=document.querySelector('main'),title=main.querySelector('h1'),tag=title.previousElementSibling,intro=title.nextElementSibling;
 // Preserve existing view visibility handlers: move their original nodes rather than clone them.
 main.prepend(tag,title,intro);$('viewerGettingStarted')?.remove();
 intro.textContent='Missed a spell? Find out what changed, check the evidence, and follow the players you care about. This is a fictional match replay.';
 $('guidedExampleHelp').textContent='Start with the example: it prepares a short Quick catch-up for minutes 55–66 and follows substitute Ellis. Then choose Explain what changed. Nothing is sent for online analysis until you ask.';
 // Reuse the existing English definitions instead of opening Chinese definitions by default.
 GLOSSARY_LANGUAGES.en={label:'English',terms:Object.fromEntries(Object.keys(definitions).map(k=>[k,k])),definitions:{...definitions},name_note:'Fictional player or club in this prototype.'};
 const english=document.createElement('option');english.value='en';english.textContent='English';$('language').prepend(english);$('language').value='en';$('language').dispatchEvent(new Event('change',{bubbles:true}));
 const sourceHelp=document.createElement('p');sourceHelp.className='muted';sourceHelp.id='evidenceHelp';sourceHelp.textContent='Open Why this explanation? beneath a takeaway to check its sources.';aiPanel.insertBefore(sourceHelp,$('aiResult'));
 const css=document.createElement('style');css.textContent='.source-fact{border-top:1px solid #35483c;padding:10px 0}.source-fact>p{font-size:14px}.evidence-notice{margin:16px 0}.evidence-notice p{margin:8px 0}.source-fact details{overflow-wrap:anywhere}#evidenceHelp{font-size:13px}';document.head.append(css);
})();
