"""Render the final verified-public-build demo with English speech and captions."""
import asyncio,json,pathlib,subprocess,re,wave,os,tempfile
from PIL import Image,ImageDraw,ImageFont
import edge_tts,imageio_ffmpeg
root=pathlib.Path(__file__).resolve().parent.parent
out=root/'submission/final-0.6.0';parts=json.loads((out/'VIDEO_SCRIPT.json').read_text());capture=json.loads((out/'capture-verification.json').read_text());assert capture['status']['version']=='0.6.0' and not capture['errors']
ff=imageio_ffmpeg.get_ffmpeg_exe();work=pathlib.Path(tempfile.mkdtemp(prefix='touchline-final-video-'));font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',30);bold=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf',37)
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
def wrap(text,draw,font,width):
 lines=[];line=''
 for word in text.split():
  trial=(line+' '+word).strip()
  if draw.textlength(trial,font=font)>width:lines.append(line);line=word
  else:line=trial
 return lines+[line]
async def main():
 elapsed=0;subtitles=[];audio_parts=[];rendered=[]
 for i,p in enumerate(parts):
  mp3=work/f'{i}.mp3';wav=work/f'{i}.wav';await edge_tts.Communicate(p['text'],'en-GB-RyanNeural',rate='+5%').save(str(mp3))
  info=subprocess.run([ff,'-hide_banner','-i',str(mp3)],capture_output=True,text=True).stderr;m=re.search(r'Duration: (\d+):(\d+):([\d.]+)',info);assert m;seconds=int(m[1])*3600+int(m[2])*60+float(m[3]);speed=max(1,seconds/(p['duration']-.2));assert speed<1.5,'Narration slot too short'
  subprocess.run([ff,'-y','-i',str(mp3),'-af',f'atempo={speed},apad','-t',str(p['duration']),'-ar','24000','-ac','1',str(wav)],capture_output=True,check=True);audio_parts.append(wav)
  im=Image.new('RGB',(1920,1080),'#08251f');im.paste(Image.open(out/'frames'/f"{p['frame']:03}.png").convert('RGB').resize((1600,900)),(160,0));d=ImageDraw.Draw(im);d.rectangle((0,900,1920,1080),fill='#08251f');d.text((60,914),p['title'],font=bold,fill='#c7e88a')
  for j,line in enumerate(wrap(p['text'],d,font,1800)):d.text((60,963+j*34),line,font=font,fill='white')
  target=work/f'{i:03}.png';im.save(target);rendered.append(target);subtitles.append(f'{i+1}\n{stamp(elapsed)} --> {stamp(elapsed+p["duration"])}\n{p["text"]}\n');elapsed+=p['duration'];print('Prepared segment',i+1,flush=True)
 assert elapsed<120
 audio=out/'touchline-final-narration.wav'
 with wave.open(str(audio),'wb') as w:
  w.setnchannels(1);w.setsampwidth(2);w.setframerate(24000)
  for p in audio_parts:
   with wave.open(str(p),'rb') as f:w.writeframes(f.readframes(f.getnframes()))
 (out/'touchline-final-demo.srt').write_text('\n'.join(subtitles));video=out/'touchline-final-demo.mp4';command=[ff,'-y','-f','rawvideo','-pixel_format','rgb24','-video_size','1920x1080','-framerate','24','-i','pipe:0','-i',str(audio),'-af','loudnorm=I=-16:TP=-1.5:LRA=11','-c:a','aac','-b:a','128k','-t',str(elapsed),'-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',str(video)]
 with open(work/'encode.log','w') as log:
  process=subprocess.Popen(command,stdin=subprocess.PIPE,stdout=subprocess.DEVNULL,stderr=log)
  for p,frame in zip(parts,rendered):
   pixels=Image.open(frame).convert('RGB').tobytes()
   for _ in range(p['duration']*24):process.stdin.write(pixels)
  process.stdin.close();assert process.wait()==0
 report={'duration_seconds':elapsed,'resolution':'1920x1080','frames_per_second':24,'narration':'Synthetic English en-GB-RyanNeural via Microsoft Edge TTS','source_revision':capture['revision'],'origin':capture['origin'],'product_frames':'Captured from the verified public release; final two frames are explanation/end cards.','video_bytes':video.stat().st_size};(out/'video-verification.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report),flush=True)
asyncio.run(main())
