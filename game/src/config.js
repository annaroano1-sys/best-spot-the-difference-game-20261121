// Garden of Differences R2 — configuration: the two scenes, every
// difference in each, and the three difficulties. One file, one job:
// everything the game can show or ask for lives here, so the other
// files only read it. Loaded first; defines the shared Spot namespace.
var Spot = window.Spot || {};
Spot.W = 620;
Spot.H = 430;

Spot.DIFFICULTIES = {
  easy:   { id: 'easy',   label: 'Easy',   hints: 3, countdown: null, garden: 7,  beach: 7,  blurb: 'Relaxed — count up, 3 hints' },
  medium: { id: 'medium', label: 'Medium', hints: 2, countdown: 300,  garden: 10, beach: 10, blurb: '5:00 on the clock, 2 hints' },
  hard:   { id: 'hard',   label: 'Hard',   hints: 1, countdown: 180,  garden: 12, beach: 10, blurb: '3:00 on the clock, 1 hint' },
};

// A difference: id, label, hotspot centre and radius. `variant` is
// decided per game: variant 0 is the "plain" look, variant 1 the
// "changed" look. Each panel draws variant 0 or 1 per difference,
// so which picture carries the change is randomised every game.
Spot.SCENES = {
  garden: {
    id: 'garden',
    name: 'Garden',
    tagline: 'A sunny garden — house, pond and flower beds',
    differences: [
      { id: 0,  label: 'sun colour',           x: 72,  y: 62,  r: 30 },
      { id: 1,  label: 'missing red tulip',    x: 210, y: 388, r: 26 },
      { id: 2,  label: 'extra bird',           x: 470, y: 70,  r: 26 },
      { id: 3,  label: 'door colour',          x: 483, y: 268, r: 26 },
      { id: 4,  label: 'missing apple',        x: 125, y: 255, r: 24 },
      { id: 5,  label: 'duck direction',       x: 460, y: 378, r: 30 },
      { id: 6,  label: 'butterfly colour',     x: 300, y: 150, r: 26 },
      { id: 7,  label: 'chimney smoke',        x: 528, y: 152, r: 20 },
      { id: 8,  label: 'missing fence picket', x: 173, y: 330, r: 20 },
      { id: 9,  label: 'flower colour',        x: 330, y: 388, r: 22 },
      { id: 10, label: 'missing path stone',   x: 448, y: 362, r: 18 },
      { id: 11, label: 'extra cloud',          x: 150, y: 110, r: 22 },
    ],
  },
  beach: {
    id: 'beach',
    name: 'Beach',
    tagline: 'A sunset beach — palm, umbrella and sandcastle',
    differences: [
      { id: 0, label: 'sun colour',        x: 520, y: 70,  r: 30 },
      { id: 1, label: 'extra seagull',     x: 350, y: 70,  r: 24 },
      { id: 2, label: 'umbrella stripes',  x: 330, y: 280, r: 28 },
      { id: 3, label: 'missing castle flag', x: 450, y: 315, r: 18 },
      { id: 4, label: 'missing starfish',  x: 530, y: 395, r: 20 },
      { id: 5, label: 'crab direction',    x: 390, y: 395, r: 26 },
      { id: 6, label: 'bucket colour',     x: 210, y: 385, r: 24 },
      { id: 7, label: 'sail colour',       x: 130, y: 185, r: 26 },
      { id: 8, label: 'missing coconut',   x: 85,  y: 175, r: 18 },
      { id: 9, label: 'missing shell',     x: 300, y: 405, r: 18 },
    ],
  },
};

Spot.SCENE_ORDER = ['garden', 'beach'];
Spot.DIFFICULTY_ORDER = ['easy', 'medium', 'hard'];
Spot.MAX_HINTS = 3;
