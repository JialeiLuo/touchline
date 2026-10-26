"""Build a source-only archive and optionally verify a fresh extracted copy."""
import argparse, hashlib, json, os, pathlib, shutil, subprocess, tempfile, time, urllib.request, zipfile
root = pathlib.Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser()
parser.add_argument('--node', default=shutil.which('node'))
parser.add_argument('--verify', action='store_true')
args = parser.parse_args()
version = json.loads((root/'package.json').read_text())['version']
out = root.parent/'releases'
out.mkdir(exist_ok=True)
archive = out/f'touchline-{version}-source.zip'
files = [p for p in root.iterdir() if p.is_file() and (p.suffix in ['.js','.cjs','.html'] or p.name in ['README.md','SUBMISSION.md','TESTING_INSTRUCTIONS.md','COPYRIGHT.md','package.json','Dockerfile','.gitignore','.dockerignore','.env.example'])]
for folder in ['server','prompts','tests','tools','data','submission']:
    files += [p for p in (root/folder).rglob('*') if p.is_file() and p.suffix in ['.js','.cjs','.json','.txt','.py','.md','.srt','.mp4','.wav'] and '__pycache__' not in p.parts]
files += list((root/'submission'/'demo-frames').glob('*.jpg'))
files += [p for p in (root/'docs').iterdir() if p.suffix in ['.md','.json','.txt']]
for name in ['viewer-milestone.jpg','contextual-investigation.jpg','scoped-stories.jpg','team-focus.jpg','public-demo.jpg','product-milestone.jpg','product-mobile.jpg']:
    if (root/'docs'/name).exists(): files.append(root/'docs'/name)
files = sorted(set(files))
secret = ''
if (root/'.env').exists():
    for line in (root/'.env').read_text().splitlines():
        if line.startswith('AZURE_FOUNDRY_API_KEY='): secret = line.split('=',1)[1].strip().strip('\"\'')
manifest = {}
for p in files:
    data=p.read_bytes()
    if secret and secret.encode() in data: raise SystemExit('Export blocked: private credential found in '+str(p.relative_to(root)))
    if p.name=='.env' or 'azure-' in p.name: raise SystemExit('Private file in export plan')
    manifest[str(p.relative_to(root))]=hashlib.sha256(data).hexdigest()
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
    for p in files: z.write(p,'touchline/'+str(p.relative_to(root)))
    z.writestr('touchline/SOURCE_MANIFEST.json',json.dumps(manifest,indent=2)+'\n')
report={'archive':archive.name,'files':len(files),'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'credential_scan':'configured key absent from every exported file','excluded':'private .env, account screenshots, old workspace archive, caches','fresh_copy_verified':False}
if args.verify:
    if not args.node: raise SystemExit('Pass --node with a Node 22+ executable')
    target=pathlib.Path(tempfile.mkdtemp(prefix='touchline-release-'))
    with zipfile.ZipFile(archive) as z: z.extractall(target)
    project=target/'touchline'
    assert not (project/'.env').exists()
    for relative,digest in manifest.items(): assert hashlib.sha256((project/relative).read_bytes()).hexdigest()==digest
    env=os.environ.copy()
    for key in ['AZURE_FOUNDRY_API_KEY','AZURE_FOUNDRY_BASE_URL','AZURE_FOUNDRY_DEPLOYMENT']: env.pop(key,None)
    tests=sorted(str(p) for p in (project/'tests').glob('*.cjs'))
    check=subprocess.run([args.node,'--test',*tests],cwd=project,env=env,capture_output=True,text=True)
    if check.returncode:
        shutil.rmtree(target)
        raise SystemExit(check.stdout+check.stderr)
    env.update(PORT='18767',HOST='127.0.0.1')
    server=subprocess.Popen([args.node,'server.cjs'],cwd=project,env=env,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
    try:
        status=None
        for attempt in range(30):
            try:
                with urllib.request.urlopen('http://127.0.0.1:18767/api/status',timeout=1) as r: status=json.load(r)
                break
            except Exception: time.sleep(.1)
        assert status and status['configured'] is False
        request=urllib.request.Request('http://127.0.0.1:18767/api/commentary',data=json.dumps({'seed':7,'index':899,'from':3300,'to':3960,'viewer_mode':'tactical','player_focus':'Ellis'}).encode(),headers={'Content-Type':'application/json'})
        with urllib.request.urlopen(request,timeout=10) as r: response=json.load(r)
        assert response['mode']=='template'
        assert any('20 of 305' in p['text'] for p in response['paragraphs'])
        report.update(fresh_copy_verified=True,test_files=len(tests),startup_without_credentials=True,fallback_context_verified=True)
    finally:
        server.terminate(); server.wait(timeout=10); shutil.rmtree(target)
(out/f'touchline-{version}-verification.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
