# Final Touchline video — release 0.6.0

[Watch the public final video](https://youtu.be/juiWMsbUzJk). YouTube title: **Touchline — Your AI Co-commentator | Final 0.6.0 Demo**. The source cut is 114 seconds; YouTube displays 1:55, below the two-minute limit.

The file is `final-0.6.0/touchline-final-demo.mp4`, with English narration and burned-in captions. Narration uses the synthetic en-GB-RyanNeural voice. `VIDEO_SCRIPT.json`, SRT captions, captured product frames and verification metadata sit beside it. The first ten frames show the working public product; the last two are clearly prepared explanation/end cards. No real match footage or copyrighted music is used.

Product version 0.6.0, source revision `1b2600724c142f46f31e0c9252c13d7326d24841`. Capture verification records the public API identity, actual Foundry/cached results and no script errors. Full video decoding passed. Audio slots are bounded to the narration timeline. The video does not claim independent fan validation or comparative superiority.

The MP4, SRT and verification JSON are also public [release assets](https://github.com/JialeiLuo/touchline/releases/tag/v0.6.0). Rebuild using `tools/capture-final-demo.cjs` against the verified public origin, then `tools/build-final-video.py` with Pillow, edge-tts, imageio-ffmpeg and the documented Arial font paths. Capturing may use bounded model calls; results can legitimately vary.

Earlier files in this folder are retained as historical production artifacts. The old 1:48 video is superseded and is not the final release demonstration.
