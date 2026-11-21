// Garden of Differences R2 — the garden scene.
// One file, one job: draw the garden. `drawGarden(ctx, vars, t)`
// paints one panel: `vars` maps each difference id to its variant
// (0 plain, 1 changed) for this panel, `t` is the clock in ms and
// drives every animation — drifting clouds, flying birds, the
// fluttering butterfly, the bobbing duck and the swaying flowers.
(function () {
  var S = Spot;
  var W = S.W, H = S.H;
  var D = S.draw;

  function drawSky(ctx, vars, t) {
    var g = ctx.createLinearGradient(0, 0, 0, 260);
    g.addColorStop(0, '#7ec8f2'); g.addColorStop(1, '#d8f1fb');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, 265);
    // Sun — difference 0: yellow with slowly turning rays, or plain orange.
    if (vars[0] === 0) {
      ctx.fillStyle = '#ffd93d';
      D.circle(ctx, 72, 62, 32);
      ctx.strokeStyle = '#ffd93d'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      var rot = (t / 9000) * Math.PI * 2;
      for (var i = 0; i < 8; i++) {
        var a = rot + (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(72 + Math.cos(a) * 40, 62 + Math.sin(a) * 40);
        ctx.lineTo(72 + Math.cos(a) * 50, 62 + Math.sin(a) * 50);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = '#ff8c42';
      D.circle(ctx, 72, 62, 32);
    }
    // Clouds drift across the sky; difference 11 adds a small fourth cloud.
    var drift = (t / 260) % 140;
    D.cloud(ctx, 200 - drift * 0.4 + 40, 55, 1);
    D.cloud(ctx, 380 - drift * 0.3 + 20, 38, 1.25);
    D.cloud(ctx, 520 - drift * 0.5 + 60, 82, 0.85);
    if (vars[11] === 1) D.cloud(ctx, 150, 110, 0.7);
    // Birds fly across, wings flapping; difference 2 adds a third bird.
    var bx = (t / 90) % 760 - 70;
    D.bird(ctx, bx, 92, D.sway(t, 700, 0));
    D.bird(ctx, bx + 42, 112, D.sway(t, 700, 350));
    if (vars[2] === 1) D.bird(ctx, 470, 70, D.sway(t, 700, 100));
  }

  function drawHills(ctx) {
    ctx.fillStyle = '#8fd07a';
    ctx.beginPath(); ctx.moveTo(0, 250); ctx.quadraticCurveTo(180, 205, 360, 248);
    ctx.quadraticCurveTo(500, 282, 620, 240); ctx.lineTo(620, 430); ctx.lineTo(0, 430); ctx.fill();
    ctx.fillStyle = '#6cbf5e';
    ctx.beginPath(); ctx.moveTo(0, 300); ctx.quadraticCurveTo(220, 258, 430, 300);
    ctx.quadraticCurveTo(540, 322, 620, 296); ctx.lineTo(620, 430); ctx.lineTo(0, 430); ctx.fill();
  }

  function drawHouse(ctx, vars, t) {
    ctx.fillStyle = '#f5d6a0'; ctx.fillRect(430, 210, 116, 84);
    ctx.fillStyle = '#d96c4a';
    ctx.beginPath(); ctx.moveTo(418, 212); ctx.lineTo(488, 158); ctx.lineTo(558, 212); ctx.closePath(); ctx.fill();
    // Chimney with smoke — difference 7: smoke puffs rise, or none at all.
    ctx.fillStyle = '#b85c3e'; ctx.fillRect(520, 168, 16, 34);
    if (vars[7] === 0) {
      var rise = (t / 1400) % 1;
      ctx.fillStyle = 'rgba(235,235,235,' + (0.85 * (1 - rise)) + ')';
      D.circle(ctx, 528 - rise * 8, 158 - rise * 34, 5 + rise * 7);
      D.circle(ctx, 530 - rise * 12, 150 - rise * 34, 4 + rise * 5);
    }
    // Window with panes.
    ctx.fillStyle = '#bfe8ff'; ctx.fillRect(444, 224, 26, 26);
    ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 2;
    ctx.strokeRect(444, 224, 26, 26);
    ctx.beginPath(); ctx.moveTo(457, 224); ctx.lineTo(457, 250); ctx.moveTo(444, 237); ctx.lineTo(470, 237); ctx.stroke();
    // Door — difference 3: blue, or green.
    ctx.fillStyle = vars[3] === 0 ? '#3d7ec9' : '#3da35d';
    ctx.fillRect(494, 246, 26, 48);
    ctx.fillStyle = '#ffd93d'; D.circle(ctx, 516, 272, 2.5);
  }

  function drawTree(ctx, vars) {
    ctx.fillStyle = '#8a5a33'; ctx.fillRect(104, 268, 14, 66);
    ctx.fillStyle = '#2f9e44';
    D.circle(ctx, 88, 258, 30); D.circle(ctx, 126, 246, 34); D.circle(ctx, 142, 276, 28);
    // Apples — difference 4: the middle apple is missing.
    ctx.fillStyle = '#e63946';
    D.circle(ctx, 95, 272, 7); D.circle(ctx, 140, 286, 7);
    if (vars[4] === 0) D.circle(ctx, 125, 255, 7);
    // Mushrooms at the base.
    ctx.fillStyle = '#f4f1de'; ctx.fillRect(148, 344, 5, 9); ctx.fillRect(164, 346, 5, 8);
    ctx.fillStyle = '#e63946';
    ctx.beginPath(); ctx.arc(150, 344, 8, Math.PI, 0); ctx.fill();
    ctx.beginPath(); ctx.arc(166, 346, 7, Math.PI, 0); ctx.fill();
  }

  function drawFence(ctx, vars) {
    ctx.fillStyle = '#e8dcc3';
    for (var x = 24; x <= 300; x += 24) {
      // Difference 8: the picket at x=168 is missing.
      if (vars[8] === 1 && x === 168) continue;
      ctx.fillRect(x, 318, 10, 30);
      ctx.beginPath(); ctx.moveTo(x, 318); ctx.lineTo(x + 5, 310); ctx.lineTo(x + 10, 318); ctx.fill();
    }
    ctx.fillRect(18, 326, 296, 5); ctx.fillRect(18, 338, 296, 5);
  }

  function drawPond(ctx, vars, t) {
    ctx.fillStyle = '#6ec1e4'; D.ellipse(ctx, 480, 382, 92, 26);
    ctx.fillStyle = '#a5dcf2'; D.ellipse(ctx, 462, 376, 40, 9);
    // Duck bobs on the water — difference 5: faces left, or right.
    var bob = D.sway(t, 1600, 0) * 2;
    var dir = vars[5] === 0 ? -1 : 1;
    ctx.fillStyle = '#ffffff';
    D.ellipse(ctx, 460, 380 + bob, 16, 10);
    D.circle(ctx, 460 + dir * 14, 372 + bob, 7);
    ctx.fillStyle = '#ffb703';
    ctx.beginPath();
    ctx.moveTo(460 + dir * 20, 372 + bob);
    ctx.lineTo(460 + dir * 28, 375 + bob);
    ctx.lineTo(460 + dir * 20, 378 + bob);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#222222'; D.circle(ctx, 460 + dir * 16, 370 + bob, 1.6);
    // Reeds sway at the pond's edge.
    ctx.strokeStyle = '#2f7d32'; ctx.lineWidth = 3;
    var lean = D.sway(t, 2200, 0) * 3;
    ctx.beginPath(); ctx.moveTo(556, 392); ctx.lineTo(556 + lean, 366); ctx.moveTo(566, 392); ctx.lineTo(566 + lean, 372); ctx.stroke();
  }

  function drawFlowers(ctx, vars, t) {
    var colors = ['#e63946', '#ffd93d', '#ff70a6', '#ff8c42', '#e63946', '#ffd93d', '#ff70a6', '#ff8c42', '#e63946', '#ffd93d'];
    var xs = [40, 90, 150, 210, 270, 330, 390, 450, 510, 570];
    for (var i = 0; i < xs.length; i++) {
      // Difference 1: the red tulip at x=210 is missing.
      if (vars[1] === 1 && xs[i] === 210) continue;
      var x = xs[i], y = 396;
      var bend = D.sway(t, 2400, i * 300) * 3;
      ctx.strokeStyle = '#2f7d32'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x, y + 12); ctx.quadraticCurveTo(x + bend, y, x + bend, y - 8); ctx.stroke();
      // Difference 9: the flower at x=330 is yellow, or pink.
      var c = colors[i];
      if (vars[9] === 1 && xs[i] === 330) c = '#ff70a6';
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.moveTo(x + bend - 8, y - 6); ctx.lineTo(x + bend - 8, y - 16);
      ctx.quadraticCurveTo(x + bend, y - 24, x + bend + 8, y - 16);
      ctx.lineTo(x + bend + 8, y - 6);
      ctx.closePath(); ctx.fill();
    }
  }

  function drawPath(ctx, vars) {
    ctx.fillStyle = '#e8dcc3';
    ctx.beginPath(); ctx.moveTo(330, 430); ctx.lineTo(430, 296); ctx.lineTo(470, 296);
    ctx.lineTo(560, 430); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#c9b896';
    D.ellipse(ctx, 400, 400, 12, 7);
    // Difference 10: the middle stepping stone is missing.
    if (vars[10] === 0) D.ellipse(ctx, 448, 362, 12, 7);
    D.ellipse(ctx, 486, 326, 11, 6);
  }

  function drawButterfly(ctx, vars, t) {
    // Wanders a small loop above the flower bed, wings flapping.
    // Difference 6: purple wings, or yellow wings.
    var wx = 300 + D.sway(t, 5200, 0) * 26;
    var wy = 150 + D.sway(t, 3400, 800) * 14;
    var flap = (D.sway(t, 320, 0) + 1) / 2;
    D.butterfly(ctx, wx, wy, vars[6] === 0 ? '#9b5de5' : '#ffd93d', flap);
  }

  function drawGrass(ctx, t) {
    ctx.strokeStyle = '#3f9142'; ctx.lineWidth = 2;
    var spots = [[30, 420], [330, 420], [600, 420], [250, 360], [580, 340], [60, 350]];
    for (var i = 0; i < spots.length; i++) {
      var x = spots[i][0], y = spots[i][1];
      var lean = D.sway(t, 2000, i * 500) * 2;
      ctx.beginPath();
      ctx.moveTo(x - 5, y); ctx.lineTo(x - 3 + lean, y - 8);
      ctx.moveTo(x, y); ctx.lineTo(x + lean, y - 10);
      ctx.moveTo(x + 5, y); ctx.lineTo(x + 3 + lean, y - 8);
      ctx.stroke();
    }
  }

  S.drawGarden = function (ctx, vars, t) {
    drawSky(ctx, vars, t);
    drawHills(ctx);
    drawPath(ctx, vars);
    drawHouse(ctx, vars, t);
    drawTree(ctx, vars);
    drawFence(ctx, vars);
    drawPond(ctx, vars, t);
    drawFlowers(ctx, vars, t);
    drawButterfly(ctx, vars, t);
    drawGrass(ctx, t);
  };
})();
