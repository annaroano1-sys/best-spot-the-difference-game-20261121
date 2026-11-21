# Garden of Differences — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/annaroano1-sys/best-spot-the-difference-game-20261121/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/annaroano1-sys/best-spot-the-difference-game-20261121/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Two pictures of the same garden — but seven things changed. Find them all!

A complete, original spot-the-difference game that runs offline in a desktop
browser from static files. The garden scene is drawn procedurally on canvas
(no network, no downloaded assets), so the two pictures are pixel-identical
except for the seven differences:

1. The sun changes colour (yellow with rays → plain orange)
2. A red tulip goes missing from the flower bed
3. A third bird appears in the sky
4. The house door changes colour (blue → green)
5. An apple goes missing from the tree
6. The duck in the pond turns around
7. The butterfly changes colour (purple → yellow)

Click a difference on either picture to circle it on both. The counter shows
how many of the 7 you have found, with a timer and a miss count. Find all
seven to win. Keyboard works too: arrow keys move the crosshair, Enter
selects, Tab switches picture, R resets.

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
