// Garden of Differences R2 — boot, the render loop and input.
// One file, one job: wire the page together. It starts the game on
// the start screen, redraws both pictures every animation frame
// (scenes, found rings, hint pulse, miss marks, crosshair), moves
// the timer and the countdown, and listens for mouse and keyboard.
// It also exposes window.SpotGame, the test hook the screenshot
// script drives — harmless in play.
(function () {
  var S = Spot;
  var W = S.W, H = S.H;

  var canvasA = document.getElementById('canvasA');
  var canvasB = document.getElementById('canvasB');
  var ctxA = canvasA.getContext('2d');
  var ctxB = canvasB.getContext('2d');
  var lastTimerText = '';

  function drawMarkers(ctx, panel, now) {
    var st = S.game.state;
    for (var i = 0; i < st.found.length; i++) {
      var id = st.found[i];
      var d = null;
      for (var j = 0; j < st.active.length; j++) if (st.active[j].id === id) { d = st.active[j]; break; }
      if (!d) continue;
      var age = now - (st.foundAt[id] || now);
      var pop = 1 + 0.35 * Math.exp(-age / 180);
      ctx.strokeStyle = '#ff2e2e';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r * pop, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(d.x, d.y, Math.max(4, (d.r - 8) * pop), 0, Math.PI * 2); ctx.stroke();
    }
    // Hint pulse: a gold ring throbbing around the hinted difference.
    if (st.hintPulse && now < st.hintPulse.until) {
      var hd = null;
      for (var k = 0; k < st.active.length; k++) if (st.active[k].id === st.hintPulse.id) { hd = st.active[k]; break; }
      if (hd) {
        var pulse = 1 + 0.12 * Math.sin(now / 140);
        ctx.strokeStyle = '#ffd93d';
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(hd.x, hd.y, hd.r * pulse + 6, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,217,61,0.55)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(hd.x, hd.y, hd.r * pulse + 13, 0, Math.PI * 2); ctx.stroke();
      }
    }
    // Miss marks: red X, fading after 700 ms.
    st.missMarks = st.missMarks.filter(function (m) { return m.until > now; });
    for (var m = 0; m < st.missMarks.length; m++) {
      var mark = st.missMarks[m];
      if (mark.panel !== panel) continue;
      ctx.strokeStyle = '#ff2e2e'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(mark.x - 9, mark.y - 9); ctx.lineTo(mark.x + 9, mark.y + 9);
      ctx.moveTo(mark.x + 9, mark.y - 9); ctx.lineTo(mark.x - 9, mark.y + 9);
      ctx.stroke();
    }
  }

  function drawCrosshair(ctx, panel) {
    var st = S.game.state;
    if (st.crosshair.panel !== panel || st.screen !== 'playing') return;
    var x = st.crosshair.x, y = st.crosshair.y;
    ctx.strokeStyle = '#ffe08a'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 18, y); ctx.lineTo(x - 7, y); ctx.moveTo(x + 7, y); ctx.lineTo(x + 18, y);
    ctx.moveTo(x, y - 18); ctx.lineTo(x, y - 7); ctx.moveTo(x, y + 7); ctx.lineTo(x, y + 18);
    ctx.stroke();
    ctx.fillStyle = '#ffe08a';
    ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
  }

  function drawSceneFor(ctx, panel, t) {
    var st = S.game.state;
    var vars = S.game.varsFor(panel);
    if (st.sceneId === 'beach') S.drawBeach(ctx, vars, t);
    else S.drawGarden(ctx, vars, t);
  }

  function render(t) {
    var now = Date.now();
    var st = S.game.state;
    drawSceneFor(ctxA, 0, t);
    drawSceneFor(ctxB, 1, t);
    drawMarkers(ctxA, 0, now);
    drawMarkers(ctxB, 1, now);
    drawCrosshair(ctxA, 0);
    drawCrosshair(ctxB, 1);
    // Timer text, updated only when the displayed second changes.
    var rem = S.game.remainingMs();
    var text = rem !== null ? S.game.fmtTime(rem) : S.game.fmtTime(S.game.elapsedMs());
    if (text !== lastTimerText) {
      document.getElementById('timer').textContent = text;
      lastTimerText = text;
    }
    S.game.checkTimer();
    requestAnimationFrame(render);
  }

  // ---- input ----
  function canvasPos(canvas, ev) {
    var r = canvas.getBoundingClientRect();
    return { x: (ev.clientX - r.left) * (canvas.width / r.width), y: (ev.clientY - r.top) * (canvas.height / r.height) };
  }
  canvasA.addEventListener('click', function (ev) { var p = canvasPos(canvasA, ev); S.game.tryClick(0, p.x, p.y); });
  canvasB.addEventListener('click', function (ev) { var p = canvasPos(canvasB, ev); S.game.tryClick(1, p.x, p.y); });

  document.getElementById('resetBtn').addEventListener('click', function () { S.audio.click(); S.game.reset(); });
  document.getElementById('hintBtn').addEventListener('click', function () { S.game.useHint(); });
  document.getElementById('muteBtn').addEventListener('click', function () {
    S.audio.setMuted(!S.audio.isMuted());
    S.game.updateHud();
  });
  document.getElementById('setupBtn').addEventListener('click', function () { S.audio.click(); S.game.toStart(); });
  document.getElementById('startBtn').addEventListener('click', function () {
    var scene = document.querySelector('input[name="scene"]:checked').value;
    var diff = document.querySelector('input[name="difficulty"]:checked').value;
    S.audio.click();
    S.game.start(scene, diff);
  });
  document.getElementById('againBtn').addEventListener('click', function () { S.audio.click(); S.game.reset(); });
  document.getElementById('winSetupBtn').addEventListener('click', function () { S.audio.click(); S.game.toStart(); });
  document.getElementById('loseAgainBtn').addEventListener('click', function () { S.audio.click(); S.game.reset(); });
  document.getElementById('loseSetupBtn').addEventListener('click', function () { S.audio.click(); S.game.toStart(); });

  document.addEventListener('keydown', function (ev) {
    var st = S.game.state;
    var step = ev.shiftKey ? 30 : 10;
    var c = st.crosshair;
    if (ev.key === 'Tab') { ev.preventDefault(); c.panel = 1 - c.panel; S.game.updateHud(); return; }
    if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); S.game.tryClick(c.panel, c.x, c.y); return; }
    if (ev.key === 'r' || ev.key === 'R') { S.game.reset(); return; }
    if (ev.key === 'h' || ev.key === 'H') { S.game.useHint(); return; }
    if (ev.key === 'm' || ev.key === 'M') { S.audio.setMuted(!S.audio.isMuted()); S.game.updateHud(); return; }
    if (ev.key === 'ArrowLeft') { c.x = Math.max(10, c.x - step); }
    if (ev.key === 'ArrowRight') { c.x = Math.min(W - 10, c.x + step); }
    if (ev.key === 'ArrowUp') { c.y = Math.max(10, c.y - step); }
    if (ev.key === 'ArrowDown') { c.y = Math.min(H - 10, c.y + step); }
  });

  // ---- start-screen pickers ----
  function buildPickers() {
    var sceneBox = document.getElementById('scenePicker');
    S.SCENE_ORDER.forEach(function (id, i) {
      var sc = S.SCENES[id];
      var label = document.createElement('label');
      label.className = 'pick';
      label.innerHTML = '<input type="radio" name="scene" value="' + id + '"' + (i === 0 ? ' checked' : '') + '> ' +
        '<b>' + sc.name + '</b><span>' + sc.tagline + ' · ' + sc.differences.length + ' differences</span>';
      sceneBox.appendChild(label);
    });
    var diffBox = document.getElementById('diffPicker');
    S.DIFFICULTY_ORDER.forEach(function (id, i) {
      var df = S.DIFFICULTIES[id];
      var label = document.createElement('label');
      label.className = 'pick';
      label.innerHTML = '<input type="radio" name="difficulty" value="' + id + '"' + (i === 1 ? ' checked' : '') + '> ' +
        '<b>' + df.label + '</b><span>' + df.blurb + '</span>';
      diffBox.appendChild(label);
    });
  }

  // ---- test hook (used by the screenshot script, harmless in play) ----
  window.SpotGame = {
    scenes: S.SCENES,
    difficulties: S.DIFFICULTIES,
    state: function () {
      var st = S.game.state;
      return {
        screen: st.screen, scene: st.sceneId, difficulty: st.difficultyId,
        found: st.found.slice(), total: st.active.length, misses: st.misses,
        hintsLeft: st.hintsLeft, hintsUsed: st.hintsUsed,
        active: st.active.map(function (d) { return { id: d.id, label: d.label, x: d.x, y: d.y, r: d.r, side: d.side }; }),
      };
    },
    start: function (scene, diff) { S.game.start(scene, diff); },
    toStart: function () { S.game.toStart(); },
    clickAt: function (panel, x, y) { return S.game.tryClick(panel, x, y); },
    useHint: function () { return S.game.useHint(); },
    reset: function () { S.game.reset(); },
    bestTime: function (scene, diff) { return S.game.bestTime(scene, diff); },
  };

  buildPickers();
  S.game.toStart();
  requestAnimationFrame(render);
})();
