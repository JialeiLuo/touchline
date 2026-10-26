from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
out=Path(__file__).resolve().parents[1]/'submission'
im=Image.new('RGB',(1280,720),'#0b1d18');d=ImageDraw.Draw(im)
font='/System/Library/Fonts/Supplemental/Arial.ttf';bold='/System/Library/Fonts/Supplemental/Arial Bold.ttf'
def text(x,y,s,size,color='#f3f5e8',heavy=False):d.text((x,y),s,font=ImageFont.truetype(bold if heavy else font,size),fill=color)
# Original graphic; no external images or logos.
for x in range(740,1280,68):d.rectangle((x,0,x+34,720),fill='#0d241d')
d.rectangle((0,0,12,720),fill='#c9ed8e')
text(62,48,'touchline.',55,heavy=True);text(64,119,'YOUR AI CO-COMMENTATOR',19,'#c9ed8e',True)
text(58,224,'MISSED',91,heavy=True);text(58,322,'10 MINUTES?',91,'#c9ed8e',True)
text(65,455,'Catch up on the story.',38,heavy=True)
text(65,506,'Not just the score.',34,'#c3cfc4')
d.rounded_rectangle((64,610,370,658),radius=24,fill='#c9ed8e');text(86,621,'WORKING DEMO',23,'#10251b',True)
# Abstract pitch and evidence-led commentary card.
d.rounded_rectangle((810,100,1210,600),radius=24,fill='#183c2c',outline='#42634b',width=2)
d.rectangle((839,131,1181,569),outline='#8cae79',width=3);d.line((839,350,1181,350),fill='#8cae79',width=3);d.ellipse((949,293,1071,407),outline='#8cae79',width=3)
d.rectangle((914,131,1106,202),outline='#8cae79',width=3);d.rectangle((914,498,1106,569),outline='#8cae79',width=3)
for x,y,c in [(905,260,'#c9ed8e'),(1004,235,'#c9ed8e'),(1120,278,'#c9ed8e'),(930,424,'#80bdd6'),(1057,451,'#80bdd6'),(1110,386,'#80bdd6')]:d.ellipse((x-14,y-14,x+14,y+14),fill=c,outline='#122c21',width=3)
d.line((1004,235,1116,215),fill='#e4f3bf',width=4);d.polygon([(1116,215),(1101,210),(1106,227)],fill='#e4f3bf')
d.rounded_rectangle((749,340,1217,472),radius=19,fill='#edf4de');d.polygon([(1092,472),(1124,472),(1092,496)],fill='#edf4de')
text(775,360,'WHAT CHANGED?',26,'#193927',True);text(775,402,'Context. Commentary. Evidence.',23,'#365342')
im.save(out/'touchline-youtube-thumbnail.png',optimize=True)
print(out/'touchline-youtube-thumbnail.png')
