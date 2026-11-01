# The Blue LED: motion graphics explainer

A 50-second vertical video (1080×1920, 30 fps) built with [Remotion](https://remotion.dev),
for TikTok, Reels or Shorts.

**Finished video:** [`out/blue-led.mp4`](out/blue-led.mp4)

## Scenes
1. Title: "The Blue LED, the tiny light that took 30 years to invent"
2. What is an LED? Electrons and holes meet at the p-n junction and emit light
3. Red (1962) and green (1970s) came fast, but blue was missing
4. Why blue was hard: a bigger band gap, which needs gallium nitride (GaN)
5. The breakthrough: Akasaki, Amano and Nakamura, Nobel Prize in Physics 2014
6. Blue LED + yellow phosphor = white light
7. Impact: about 75% less energy and up to 25× longer life than incandescent bulbs

## Edit and re-render
```bash
npm install
npm run dev      # opens Remotion Studio to preview and edit live
npm run render   # writes out/blue-led.mp4
```
All the animation code is in `src/BlueLED.tsx`. Scene lengths are in the `SCENES` array at the top.
