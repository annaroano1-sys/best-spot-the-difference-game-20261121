// Garden of Differences R2 — the game itself.
// One file, one job: the rules and the state. Starting a game picks
// which differences are live and which picture carries each change,
// so every new game is a different hunt; clicks, hints, the timer,
// the win and the loss, the best times and the confetti all live
// here. It never draws a scene — that is the scenes' job — it only
// decides what is true and tells the page about it.
(function () {
  var S = Spot;

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function bestKey(sceneId, diffId) { return 'spot-best:' + sceneId + ':' + diffId; }

  function loadBest(sceneId, diffId) {
    try {
      var v = window.localStorage.getItem(bestKey(sceneId, diffId));
      return v === null ? null : parseInt(v, 10);
    } catch (e) { return null; }
  }

  function saveBest(sceneId, diffId, seconds) {
    try { window.localStorage.setItem(bestKey(sceneId, diffId), String(seconds)); } catch (e) { /* ignore */ }
  }

  var state = {
    screen: 'start',      // 'start' | 'playing' | 'won' | 'lost'
    sceneId: 'garden',
    difficultyId: 'medium',
    active: [],           // live differences: {id,label,x,y,r,side} (side 0=A, 1=B carries variant 1)
    found: [],            // ids found
    foundAt: {},          // id -> timestamp of the find (for the ring animation)
    misses: 0,
    hintsLeft: 0,
    hintsUsed: 0,
    hintPulse: null,      // {id, until}
    startMs: 0,
    endMs: 0,
    newBest: false,
    crosshair: { panel: 0, x: 310, y: 215 },
    missMarks: [],        // {panel, x, y, until}
  };

  function $(id) { return document.getElementById(id); }

  function fmtTime(ms) {
    var s = Math.max(0, Math.floor(ms / 1000));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }

  function pickActive(sceneId, difficultyId) {
    var scene = S.SCENES[sceneId];
    var diff = S.DIFFICULTIES[difficultyId];
    var count = diff[sceneId];
    var pool = scene.differences.slice();
    // Easy garden is the classic seven, in their classic order.
    if (sceneId === 'garden' && difficultyId === 'easy') pool = pool.slice(0, 7);
    else pool = shuffle(pool);
    return pool.slice(0, count).map(function (d) {
      return { id: d.id, label: d.label, x: d.x, y: d.y, r: d.r, side: Math.random() < 0.5 ? 0 : 1 };
    });
  }

  // Variant map for one panel: 1 where this panel carries the change.
  function varsFor(panel) {
    var vars = {};
    for (var i = 0; i < state.active.length; i++) {
      var d = state.active[i];
      vars[d.id] = d.side === panel ? 1 : 0;
    }
    return vars;
  }

  function elapsedMs() {
    if (state.screen === 'playing') return Date.now() - state.startMs;
    if (state.screen === 'won' || state.screen === 'lost') return state.endMs - state.startMs;
    return 0;
  }

  function remainingMs() {
    var diff = S.DIFFICULTIES[state.difficultyId];
    if (!diff.countdown) return null;
    return diff.countdown * 1000 - elapsedMs();
  }

  function updateHud() {
    $('foundCount').textContent = state.found.length + ' / ' + state.active.length;
    $('missCount').textContent = state.misses;
    $('hintCount').textContent = state.hintsLeft;
    $('hintBtn').disabled = state.hintsLeft <= 0 || state.screen !== 'playing';
    var t = $('timer');
    var rem = remainingMs();
    if (rem !== null) {
      t.textContent = fmtTime(rem);
      t.parentElement.classList.toggle('danger', rem <= 30000 && state.screen === 'playing');
    } else {
      t.textContent = fmtTime(elapsedMs());
      t.parentElement.classList.remove('danger');
    }
    $('sceneName').textContent = S.SCENES[state.sceneId].name + ' · ' + S.DIFFICULTIES[state.difficultyId].label;
    $('panelA').classList.toggle('active', state.crosshair.panel === 0);
    $('panelB').classList.toggle('active', state.crosshair.panel === 1);
    $('muteBtn').textContent = S.audio.isMuted() ? 'Sound: off' : 'Sound: on';
  }

  function showOverlay(which) {
    $('startOverlay').classList.toggle('show', which === 'start');
    $('winOverlay').classList.toggle('show', which === 'win');
    $('loseOverlay').classList.toggle('show', which === 'lose');
  }

  function startGame(sceneId, difficultyId) {
    state.sceneId = sceneId;
    state.difficultyId = difficultyId;
    state.active = pickActive(sceneId, difficultyId);
    state.found = [];
    state.foundAt = {};
    state.misses = 0;
    state.hintsLeft = S.DIFFICULTIES[difficultyId].hints;
    state.hintsUsed = 0;
    state.hintPulse = null;
    state.missMarks = [];
    state.startMs = Date.now();
    state.endMs = 0;
    state.newBest = false;
    state.screen = 'playing';
    state.crosshair = { panel: 0, x: 310, y: 215 };
    S.audio.unlock();
    showOverlay(null);
    updateHud();
  }

  function toStart() {
    state.screen = 'start';
    state.active = pickActive(state.sceneId, state.difficultyId);
    state.found = [];
    state.foundAt = {};
    state.misses = 0;
    state.hintsLeft = S.DIFFICULTIES[state.difficultyId].hints;
    state.hintsUsed = 0;
    state.hintPulse = null;
    state.missMarks = [];
    state.startMs = Date.now();
    renderBestList();
    showOverlay('start');
    updateHud();
  }

  function win() {
    state.screen = 'won';
    state.endMs = Date.now();
    var seconds = Math.floor((state.endMs - state.startMs) / 1000);
    var prev = loadBest(state.sceneId, state.difficultyId);
    state.newBest = prev === null || seconds < prev;
    if (state.newBest) saveBest(state.sceneId, state.difficultyId, seconds);
    $('winTime').textContent = fmtTime(state.endMs - state.startMs);
    $('winMisses').textContent = state.misses;
    $('winHints').textContent = state.hintsUsed;
    var best = loadBest(state.sceneId, state.difficultyId);
    $('winBest').textContent = best === null ? '—' : fmtTime(best * 1000);
    $('winBestBadge').style.display = state.newBest ? 'inline-block' : 'none';
    S.audio.win();
    confettiBurst();
    showOverlay('win');
    updateHud();
  }

  function lose() {
    state.screen = 'lost';
    state.endMs = Date.now();
    $('loseFound').textContent = state.found.length + ' / ' + state.active.length;
    S.audio.lose();
    showOverlay('lose');
    updateHud();
  }

  function tryClick(panel, x, y) {
    if (state.screen !== 'playing') return false;
    S.audio.unlock();
    for (var i = 0; i < state.active.length; i++) {
      var d = state.active[i];
      if (state.found.indexOf(d.id) !== -1) continue;
      var dx = x - d.x, dy = y - d.y;
      if (dx * dx + dy * dy <= d.r * d.r + 220) {
        state.found.push(d.id);
        state.foundAt[d.id] = Date.now();
        S.audio.correct();
        updateHud();
        if (state.found.length === state.active.length) win();
        return true;
      }
    }
    state.misses++;
    state.missMarks.push({ panel: panel, x: x, y: y, until: Date.now() + 700 });
    S.audio.wrong();
    updateHud();
    return false;
  }

  function useHint() {
    if (state.screen !== 'playing' || state.hintsLeft <= 0) return null;
    var remaining = [];
    for (var i = 0; i < state.active.length; i++) {
      if (state.found.indexOf(state.active[i].id) === -1) remaining.push(state.active[i]);
    }
    if (!remaining.length) return null;
    var pick = remaining[Math.floor(Math.random() * remaining.length)];
    state.hintsLeft--;
    state.hintsUsed++;
    state.hintPulse = { id: pick.id, until: Date.now() + 2600 };
    S.audio.hint();
    updateHud();
    return pick.id;
  }

  function checkTimer() {
    if (state.screen !== 'playing') return;
    var rem = remainingMs();
    if (rem !== null && rem <= 0) lose();
  }

  // ---- confetti: coloured paper falling over the win screen ----
  var confetti = null;
  function confettiBurst() {
    var canvas = $('confettiCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var colors = ['#e63946', '#ffd93d', '#3da35d', '#3d7ec9', '#ff70a6', '#9b5de5'];
    var parts = [];
    for (var i = 0; i < 140; i++) {
      parts.push({
        x: Math.random() * canvas.width, y: -20 - Math.random() * 120,
        w: 6 + Math.random() * 7, h: 8 + Math.random() * 8,
        vy: 2 + Math.random() * 3, vx: -1 + Math.random() * 2,
        rot: Math.random() * Math.PI * 2, vr: -0.1 + Math.random() * 0.2,
        color: colors[i % colors.length],
      });
    }
    var start = Date.now();
    if (confetti) cancelAnimationFrame(confetti);
    (function frame() {
      var age = Date.now() - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var j = 0; j < parts.length; j++) {
        var p = parts[j];
        p.x += p.vx + Math.sin(age / 300 + j) * 0.6;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = age > 2600 ? Math.max(0, 1 - (age - 2600) / 600) : 1;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (age < 3200) confetti = requestAnimationFrame(frame);
      else { ctx.clearRect(0, 0, canvas.width, canvas.height); confetti = null; }
    })();
  }

  function renderBestList() {
    var el = $('bestList');
    if (!el) return;
    var rows = [];
    for (var s = 0; s < S.SCENE_ORDER.length; s++) {
      for (var d = 0; d < S.DIFFICULTY_ORDER.length; d++) {
        var sc = S.SCENE_ORDER[s], df = S.DIFFICULTY_ORDER[d];
        var b = loadBest(sc, df);
        rows.push(S.SCENES[sc].name + ' · ' + S.DIFFICULTIES[df].label + ': ' + (b === null ? '—' : fmtTime(b * 1000)));
      }
    }
    el.textContent = rows.join('   •   ');
  }

  S.game = {
    state: state,
    start: startGame,
    toStart: toStart,
    reset: function () { startGame(state.sceneId, state.difficultyId); },
    tryClick: tryClick,
    useHint: useHint,
    varsFor: varsFor,
    elapsedMs: elapsedMs,
    remainingMs: remainingMs,
    checkTimer: checkTimer,
    updateHud: updateHud,
    fmtTime: fmtTime,
    bestTime: loadBest,
    renderBestList: renderBestList,
  };
})();
