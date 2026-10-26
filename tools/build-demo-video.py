from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import shutil, subprocess, json, os, tempfile
root=Path(__file__).resolve().parents[1]
out=root/'submission'; raw=out/'demo-frames'; raw.mkdir(exist_ok=True)
# Source frames are captured from the functioning public app and bundled in submission/demo-frames.
segments=[(0,8,'Touchline | Your AI Co-commentator','Missed ten minutes? Catch up on the story, not just the score.'),*[(i,1.875,'Follow a fictional full match','Replay events, watch the clock and inspect the changing match statistics.') for i in range(1,9)],(9,4,'Start with the match evidence','Both teams’ statistics are calculated from the recorded events.'),(15,6,'Meet the teams','Inspect the starting XI, current lineup, formations and managers.'),(16,5,'Understand the player’s role','Player details distinguish the assigned position from the usual role.'),(10,8,'Choose the spell you missed','Select an interval, commentary depth and the team or player you care about.'),(11,2,'Ask for the story','Microsoft Foundry ranks supported stories for this interval.'),(12,14,'A co-commentator with context','The prepared example connects Ellis’s changed role with match activity and fictional player history.'),(13,10,'Open the supporting evidence','Inspect source facts behind the explanation. Interpretation stays separate from calculated evidence.'),(14,6,'Make it personal','Quick and Tactical views change the depth; team and player focus change the emphasis.'),(17,7,'Bridge football languages','Click highlighted terms for a translated name and an explanation in your chosen glossary language.'),(18,7,'Bring your own match package','Load supported structured match data, or explore the reproducible synthetic examples.'),(19,8,'Put incidents in context','Reported incidents can include corrections and a linked, versioned official rule reference.'),(0,8,'Try Touchline','Public demo and source repository. Fictional data; bounded AI story selection, with a local fallback.')]
font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',34)
bold=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf',38)
render=Path(tempfile.mkdtemp(prefix='touchline-video-'))
def wrap(text,draw,font,width):
 words=text.split(); lines=[]; line=''
 for word in words:
  trial=(line+' '+word).strip()
  if draw.textlength(trial,font=font)>width: lines.append(line); line=word
  else: line=trial
 lines.append(line); return lines
concat=[]; subtitles=[]; elapsed=0
for n,(idx,duration,title,caption) in enumerate(segments):
 im=Image.new('RGB',(1920,1080),'#08251f'); shot=Image.open(raw/f'{idx:03}.jpg').convert('RGB').resize((1600,900)); im.paste(shot,(160,0)); d=ImageDraw.Draw(im); d.rectangle((0,900,1920,1080),fill='#08251f'); d.text((65,916),title,font=bold,fill='#8ee5b4')
 for j,line in enumerate(wrap(caption,d,font,1780)): d.text((65,969+j*40),line,font=font,fill='white')
 target=render/f'{n:03}.jpg'; im.save(target,quality=92); concat += [f"file '{target}'",f'duration {duration}'];
 def stamp(t):
  ms=round(t*1000); return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
 subtitles.append(f'{n+1}\n{stamp(elapsed)} --> {stamp(elapsed+duration)}\n{title}\n{caption}\n'); elapsed+=duration
concat.append(f"file '{target}'"); (render/'concat.txt').write_text('\n'.join(concat)); (out/'touchline-demo.srt').write_text('\n'.join(subtitles)); (out/'video-timeline.json').write_text(json.dumps(segments,indent=2))
ff=os.environ.get('FFMPEG') or shutil.which('ffmpeg')
if not ff:
 import imageio_ffmpeg
 ff=imageio_ffmpeg.get_ffmpeg_exe()
# Write an exact number of frames so caption and narration timestamps remain aligned.
audio=out/'touchline-narration.wav'
command=[ff,'-y','-f','rawvideo','-pixel_format','rgb24','-video_size','1920x1080','-framerate','24','-i','pipe:0']
if audio.exists(): command += ['-i',str(audio),'-af','loudnorm=I=-16:TP=-1.5:LRA=11','-c:a','aac','-b:a','128k']
command += ['-t',str(elapsed),'-c:v','libx264','-preset','veryfast','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart',str(out/'touchline-demo.mp4')]
with open(render/'encode.log','w') as log:
 process=subprocess.Popen(command,stdin=subprocess.PIPE,stdout=subprocess.DEVNULL,stderr=log)
 try:
  for n,(_,duration,_,_) in enumerate(segments):
   pixels=Image.open(render/f'{n:03}.jpg').convert('RGB').tobytes()
   for _ in range(round(duration*24)): process.stdin.write(pixels)
 finally: process.stdin.close()
 if process.wait(): raise RuntimeError('Video encoding failed; inspect '+str(render/'encode.log'))
print(f'Built {elapsed}s video: {out/"touchline-demo.mp4"}; narration={audio.exists()}')
