# Demo video

`touchline-demo.mp4`: 1920×1080 H.264 video with AAC English synthetic narration and burned-in English captions, 108 seconds. This is an edited walkthrough using real interface captures and held frames, not a continuous screen recording. No real match footage or music is included.

Public demonstration video: https://youtu.be/9JvQMpAhdpA

The entrant uploaded the narrated demo to YouTube on 26 October 2026. The watch page opens with the expected title and a 1:48 duration.

## Reproduce

Install Pillow and imageio-ffmpeg in a separate Python environment; run `python tools/build-demo-video.py`. It uses the bundled `submission/touchline-narration.wav`, so this rebuild needs no online speech request. Alternatively set FFMPEG to an installed ffmpeg executable. The current renderer uses macOS Arial fonts.

To regenerate the voice, additionally install edge-tts 7.3.1 and run `python tools/generate-demo-narration.py`. The script sends the public text from `narration-script.json` to Microsoft Edge's online TTS service. Voice: en-GB-RyanNeural; rate +5%, with per-section padding or modest tempo adjustment. No voice cloning is used.

Source captures, caption timeline, narration script, WAV and SRT are included. SRT contains the visual summary captions; narration-script.json contains the full spoken explanation.
