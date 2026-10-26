"""Rebuild timed English narration. Requires edge-tts 7.3.1 and ffmpeg/imageio-ffmpeg.
Sends only the public demonstration script to Microsoft's online speech service.
The bundled WAV permits an offline video rebuild without calling that service.
"""
import asyncio,json,subprocess,re,wave,os,shutil,tempfile
from pathlib import Path
import edge_tts
root=Path(__file__).resolve().parents[1]; out=root/'submission'
config=json.loads((out/'narration-script.json').read_text())
ff=os.environ.get('FFMPEG') or shutil.which('ffmpeg')
if not ff:
 import imageio_ffmpeg
 ff=imageio_ffmpeg.get_ffmpeg_exe()
async def main():
 with tempfile.TemporaryDirectory(prefix='touchline-narration-') as tmp:
  temp=Path(tmp)
  for i,part in enumerate(config['segments']):
   clip=temp/f'{i:02}.mp3'
   await edge_tts.Communicate(part['text'],config['voice'],rate=config['rate']).save(str(clip))
   info=subprocess.run([ff,'-hide_banner','-i',str(clip)],capture_output=True,text=True).stderr
   match=re.search(r'Duration: (\d+):(\d+):([\d.]+)',info)
   if not match: raise RuntimeError('Cannot determine generated audio duration')
   seconds=int(match[1])*3600+int(match[2])*60+float(match[3])
   speed=max(1,seconds/(part['duration']-.2))
   subprocess.run([ff,'-y','-i',str(clip),'-af',f'atempo={speed},apad','-t',str(part['duration']),'-ar','24000','-ac','1',str(temp/f'{i:02}.wav')],capture_output=True,check=True)
  with wave.open(str(out/'touchline-narration.wav'),'wb') as target:
   target.setnchannels(1);target.setsampwidth(2);target.setframerate(24000)
   for i in range(len(config['segments'])):
    with wave.open(str(temp/f'{i:02}.wav'),'rb') as source: target.writeframes(source.readframes(source.getnframes()))
 print('Built timed narration:',out/'touchline-narration.wav')
asyncio.run(main())
