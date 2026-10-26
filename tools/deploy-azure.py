"""Update an existing Free F1 app using a verified source ZIP and private .env.
Does not create resources or upgrade billing. Requires an authenticated Azure CLI.
"""
import argparse,json,os,pathlib,subprocess,tempfile,zipfile
p=argparse.ArgumentParser();p.add_argument('--az',default='az');p.add_argument('--app',required=True);p.add_argument('--group',required=True);p.add_argument('--archive',required=True);p.add_argument('--env-file',default='.env');a=p.parse_args()
common=['-g',a.group,'-n',a.app]
def query(args):return json.loads(subprocess.check_output([a.az,*args,'-o','json']))
def run(args):subprocess.run([a.az,*args,'-o','none'],check=True)
app=query(['webapp','show',*common]);plan=query(['appservice','plan','show','--ids',app['appServicePlanId']]);assert plan['sku']['name']=='F1','Refusing non-Free hosting plan'
settings={}
for line in pathlib.Path(a.env_file).read_text().splitlines():
 if line.startswith('AZURE_FOUNDRY_'):
  k,v=line.split('=',1);settings[k]=v.strip().strip('\"\'')
assert all(settings.get(k) for k in ['AZURE_FOUNDRY_BASE_URL','AZURE_FOUNDRY_API_KEY','AZURE_FOUNDRY_DEPLOYMENT'])
settings.update(HOST='0.0.0.0',TOUCHLINE_STATE_DIR='/home/touchline-state',TOUCHLINE_AI_DAILY_LIMIT='200',TOUCHLINE_AI_TOTAL_LIMIT='2000',TOUCHLINE_REQUESTS_PER_MINUTE='30',SCM_DO_BUILD_DURING_DEPLOYMENT='false',WEBSITES_ENABLE_APP_SERVICE_STORAGE='true')
with tempfile.TemporaryDirectory(prefix='touchline-deploy-') as temp:
 temp=pathlib.Path(temp);config=temp/'private-settings.json';config.touch(mode=0o600);config.write_text(json.dumps(settings));archive=temp/'app.zip'
 with zipfile.ZipFile(a.archive) as source,zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as target:
  for name in source.namelist():
   relative=name.removeprefix('touchline/')
   assert relative and not relative.startswith('/') and '..' not in pathlib.PurePosixPath(relative).parts
   assert pathlib.PurePosixPath(relative).name!='.env','Private .env must never be deployed as a file'
   data=source.read(name);assert settings['AZURE_FOUNDRY_API_KEY'].encode() not in data,'Credential detected in archive'
   target.writestr(relative,data)
 run(['webapp','config','set',*common,'--startup-file','node server.cjs','--always-on','false'])
 run(['webapp','update',*common,'--https-only','true'])
 run(['webapp','config','appsettings','set',*common,'--settings','@'+str(config)])
 run(['webapp','deploy',*common,'--src-path',str(archive),'--type','zip','--clean','true','--restart','true','--track-status','false'])
print('Deployment submitted. Run tools/check-public.cjs and verify persistent usage before announcing success.')
