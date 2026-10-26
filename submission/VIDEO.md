# Demo video

Local artifact: `touchline-demo.mp4` (1920×1080 H.264, approximately 107 seconds, English captions, no audio). This is an edited walkthrough using real interface captures and held frames, not a continuous screen recording. No real match footage is included.

Public supported-platform upload is pending. A GitHub-only video does not complete the submission requirement.

Rebuild: install Pillow and imageio-ffmpeg in a separate Python environment, then run `python tools/build-demo-video.py`. Alternatively set FFMPEG to an installed ffmpeg executable. Source captures, timeline and SRT captions are included. The current renderer uses macOS Arial fonts.
