# Garden of Differences — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/annaroano1-sys/best-spot-the-difference-game-20261121/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/annaroano1-sys/best-spot-the-difference-game-20261121/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Two pictures of the same place — but things changed. Find them all!

A complete, original spot-the-difference game that runs offline in a desktop
browser from static files. Both scenes are drawn procedurally on canvas
(no network, no downloaded assets), so the two pictures are pixel-identical
except for the differences — and every new game hides a fresh set, with
each difference able to sit in either picture.

## What's in it

- **Two living scenes**: a sunny **Garden** (12 differences: sun colour,
  missing tulip, extra bird, door colour, missing apple, duck direction,
  butterfly colour, chimney smoke, missing fence picket, flower colour,
  missing path stone, extra cloud) and a sunset **Beach** (10 differences:
  sun colour, extra seagull, umbrella stripes, missing castle flag,
  missing starfish, crab direction, bucket colour, sail colour, missing
  coconut, missing shell). Clouds drift, birds fly, the butterfly
  flutters, the duck bobs, the waves roll and the crab shuffles — nothing
  in the pictures stands still.
- **Three difficulties**: Easy (7 differences, count-up timer, 3 hints),
  Medium (10 differences, 5:00 countdown, 2 hints), Hard (12 differences,
  3:00 countdown, 1 hint). The clock turns red and pulses under 30 seconds.
- **Hints**: up to 3 per game — a hint makes one unfound difference throb
  gold on both pictures. Hints used are counted on the final screen.
- **Sound, made on the spot**: WebAudio chimes for a find, a soft buzz
  for a miss, a pluck for a hint and a little fanfare for the win — no
  audio files. Mute button and `M` key, remembered between visits.
- **A proper start and finish**: pick a scene and a difficulty, see your
  best times, then hunt. Win and confetti falls; your best time per
  scene and difficulty is saved and shown. Play again reshuffles the
  differences, so no two games are the same.
- **Mouse and keyboard**: click a difference on either picture to circle
  it on both; arrows move the crosshair, Enter selects, Tab switches
  picture, H hints, M mutes, R resets.

## Run it

```sh
# Play it: open game/index.html in a desktop browser (Chrome), no server needed.
# Or serve it locally:
python3 -m http.server -d game 8000
# then open http://localhost:8000/

# Build the hand-in package (what the grader runs):
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=fjta9fmj&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
