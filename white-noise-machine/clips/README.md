# White Noise Machine — clips

Drop video clips here (mp4 or webm, any length; 5–30s soundbites work well),
then list them in the `VIDEO_SOURCES` array at the top of
`../../white-noise-machine.html`, e.g.:

```js
const VIDEO_SOURCES = [
  "white-noise-machine/clips/clip-01.mp4",
  "white-noise-machine/clips/clip-02.mp4",
];
```

Clips that fail to load are skipped automatically. If the list is empty (or
nothing loads), the page falls back to synthetic TV static so the piece still
runs.

Handy preview params on the page URL:

- `?timescale=5` — run the pacing 5x faster
- `?skip=150` — start 150 seconds in (straight into the chaos)
- `?debug` — overlay elapsed time / clip count / depths
- `?auto` — skip the "begin" click (audio may stay muted; browsers require a
  real gesture to unmute)
