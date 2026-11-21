// Garden of Differences R2 — the beach scene.
// One file, one job: draw the beach. `drawBeach(ctx, vars, t)`
// paints one panel: `vars` maps each difference id to its variant
// (0 plain, 1 changed) for this panel, `t` is the clock in ms and
// drives every animation — rolling waves, the bobbing boat, the
// shuffling crab, the fluttering flag and the swaying palm.
(function () {
  var S = Spot;
  var W = S.W;
  var D = S.draw;

  function drawSky(ctx, vars, t) {
    var g = ctx.createLinearGradient(0, 0, 0, 160);
    g.addColorStop(0, '#ff9a5a'); g.addColorStop(1, '#ffd6a5');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, 160);
    // Sun — difference 0: yellow with slowly turning rays, or plain orange.
    if (vars[0] === 0) {
      ctx.fillStyle = '#ffd93d';
      D.circle(ctx, 520, 70, 32);
      ctx.strokeStyle = '#ffd93d'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      var rot = (t / 9000) * Math.PI * 2;
      for (var i = 0; i < 8; i++) {
        var a = rot + (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(520 + Math.cos(a) * 40, 70 + Math.sin(a) * 40);
        ctx.lineTo(520 + Math.cos(a) * 50, 70 + Math.sin(a) * 50);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = '#ff8c42';
      D.circle(ctx, 520, 70, 32);
    }
    // Clouds drift; gulls fly across, wings flapping.
    var drift = (t / 300) % 160;
    D.cloud(ctx, 140 - drift * 0.3 + 30, 48, 1);
    D.cloud(ctx, 300 - drift * 0.4 + 40, 36, 0.9);
    var gx = (t / 110) % 760 - 70;
    D.bird(ctx, gx, 100, D.sway(t, 700, 0));
    D.bird(ctx, gx + 46, 120, D.sway(t, 700, 350));
    // Difference 1: a third gull appears.
    if (vars[1] === 1) D.bird(ctx, 350, 70, D.sway(t, 700, 200));
  }

  function drawSea(ctx, vars, t) {
    var g = ctx.createLinearGradient(0, 150, 0, 260);
    g.addColorStop(0, '#2fa8d8'); g.addColorStop(1, '#7ed0ea');
    ctx.fillStyle = g; ctx.fillRect(0, 150, W, 110);
    // Rolling wave lines, offset by time.
    ctx.strokeStyle = 'rgba(255,255,255,0.65)'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    for (var row = 0; row < 3; row++) {
      var y = 180 + row * 26;
      var off = (t / 40 + row * 70) % 80;
      ctx.beginPath();
      for (var x = -80 + off; x <= W; x += 80) {
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + 20, y - 7, x + 40, y);
        ctx.quadraticCurveTo(x + 60, y + 7, x + 80, y);
      }
      ctx.stroke();
    }
    // Boat bobs on the swell — difference 7: white sail, or yellow sail.
    var bob = D.sway(t, 1800, 0) * 3;
    var bx = 130, by = 198 + bob;
    ctx.fillStyle = '#8a5a33';
    ctx.beginPath(); ctx.moveTo(bx - 34, by); ctx.lineTo(bx + 34, by); ctx.lineTo(bx + 24, by + 14); ctx.lineTo(bx - 24, by + 14); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#5a3a1a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by - 34); ctx.stroke();
    ctx.fillStyle = vars[7] === 0 ? '#ffffff' : '#ffd93d';
    ctx.beginPath(); ctx.moveTo(bx + 2, by - 32); ctx.lineTo(bx + 2, by - 4); ctx.lineTo(bx + 26, by - 4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ff70a6';
    ctx.beginPath(); ctx.moveTo(bx - 2, by - 30); ctx.lineTo(bx - 2, by - 4); ctx.lineTo(bx - 20, by - 4); ctx.closePath(); ctx.fill();
  }

  function drawSand(ctx, t) {
    ctx.fillStyle = '#f2d8a0'; ctx.fillRect(0, 255, W, 175);
    ctx.fillStyle = '#e8c88a';
    var dots = [[40, 300], [120, 420], [240, 290], [340, 420], [480, 285], [580, 320], [60, 380], [560, 410]];
    for (var i = 0; i < dots.length; i++) {
      D.ellipse(ctx, dots[i][0], dots[i][1], 9, 4);
    }
    // Wet sand band where the waves reach.
    ctx.fillStyle = '#e0bd7e'; ctx.fillRect(0, 255, W, 10);
  }

  function drawPalm(ctx, vars, t) {
    // Trunk leans left; fronds sway.
    ctx.strokeStyle = '#8a5a33'; ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(96, 340); ctx.quadraticCurveTo(88, 260, 78, 190); ctx.stroke();
    ctx.strokeStyle = '#2f9e44'; ctx.lineWidth = 7;
    var sway = D.sway(t, 2600, 0) * 6;
    var top = { x: 78, y: 190 };
    var fronds = [[-1, -1], [-0.6, -1.2], [0, -1.3], [0.7, -1.1], [1.1, -0.6], [-1.2, -0.3], [1.2, -0.1]];
    for (var i = 0; i < fronds.length; i++) {
      var f = fronds[i];
      ctx.beginPath();
      ctx.moveTo(top.x, top.y);
      ctx.quadraticCurveTo(top.x + f[0] * 26, top.y + f[1] * 14, top.x + f[0] * 46 + sway, top.y + f[1] * 30 + 8);
      ctx.stroke();
    }
    // Coconuts — difference 8: three coconuts, or two.
    ctx.fillStyle = '#6b4423';
    D.circle(ctx, 70, 196, 7); D.circle(ctx, 86, 200, 7);
    if (vars[8] === 0) D.circle(ctx, 78, 206, 7);
  }

  function drawUmbrella(ctx, vars) {
    // Pole and striped canopy — difference 2: red stripes, or blue stripes.
    ctx.strokeStyle = '#8a5a33'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(330, 360); ctx.lineTo(330, 272); ctx.stroke();
    var stripe = vars[2] === 0 ? '#e63946' : '#3d7ec9';
    for (var i = 0; i < 6; i++) {
      ctx.fillStyle = i % 2 === 0 ? stripe : '#fff8e1';
      ctx.beginPath();
      ctx.moveTo(330, 272);
      var a0 = Math.PI + (i / 6) * Math.PI, a1 = Math.PI + ((i + 1) / 6) * Math.PI;
      ctx.arc(330, 272, 56, a0, a1);
      ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = '#ffd93d'; D.circle(ctx, 330, 270, 5);
  }

  function drawTowelAndBall(ctx, t) {
    // Striped towel.
    ctx.fillStyle = '#ff70a6'; ctx.fillRect(232, 342, 76, 26);
    ctx.fillStyle = '#fff8e1';
    ctx.fillRect(232, 342, 12, 26); ctx.fillRect(258, 342, 12, 26); ctx.fillRect(284, 342, 12, 26);
    // Beach ball, rocking gently.
    var rock = D.sway(t, 2000, 0) * 0.12;
    ctx.save();
    ctx.translate(168, 352); ctx.rotate(rock);
    ctx.fillStyle = '#ffffff'; D.circle(ctx, 0, 0, 17);
    ctx.fillStyle = '#e63946';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 17, -0.5, 0.7); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#3d7ec9';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 17, 1.8, 3.0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffd93d';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 17, 3.6, 4.8); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function drawCastle(ctx, vars, t) {
    // Sandcastle: two towers and a wall.
    ctx.fillStyle = '#e8c88a';
    ctx.fillRect(420, 330, 60, 34);
    ctx.fillRect(428, 306, 18, 26); ctx.fillRect(456, 306, 18, 26);
    ctx.fillStyle = '#d9b06a';
    ctx.beginPath(); ctx.moveTo(428, 306); ctx.lineTo(437, 296); ctx.lineTo(446, 306); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(456, 306); ctx.lineTo(465, 296); ctx.lineTo(474, 306); ctx.closePath(); ctx.fill();
    // Flag flutters — difference 3: the flag is there, or gone.
    if (vars[3] === 0) {
      ctx.strokeStyle = '#5a3a1a'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(465, 296); ctx.lineTo(465, 272); ctx.stroke();
      var wave = D.sway(t, 500, 0) * 3;
      ctx.fillStyle = '#e63946';
      ctx.beginPath(); ctx.moveTo(465, 272); ctx.lineTo(465 + 18, 276 + wave); ctx.lineTo(465, 282); ctx.closePath(); ctx.fill();
    }
  }

  function drawBucket(ctx, vars) {
    // Bucket and spade — difference 6: red bucket, or blue bucket.
    ctx.fillStyle = vars[6] === 0 ? '#e63946' : '#3d7ec9';
    ctx.beginPath(); ctx.moveTo(198, 372); ctx.lineTo(222, 372); ctx.lineTo(218, 398); ctx.lineTo(202, 398); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffd93d'; ctx.fillRect(196, 368, 28, 5);
    ctx.strokeStyle = '#8a5a33'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(228, 398); ctx.lineTo(244, 378); ctx.stroke();
    ctx.fillStyle = '#ff70a6';
    ctx.beginPath(); ctx.moveTo(244, 378); ctx.lineTo(252, 370); ctx.lineTo(248, 384); ctx.closePath(); ctx.fill();
  }

  function drawCritters(ctx, vars, t) {
    // Starfish — difference 4: there, or gone.
    if (vars[4] === 0) {
      ctx.fillStyle = '#ff8c42';
      drawStar(ctx, 530, 395, 13);
    }
    // Shell — difference 9: there, or gone.
    if (vars[9] === 0) {
      ctx.fillStyle = '#fff8e1';
      ctx.beginPath(); ctx.arc(300, 405, 10, Math.PI, 0); ctx.fill();
      ctx.strokeStyle = '#d9a06a'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(294, 405); ctx.lineTo(294, 397); ctx.moveTo(300, 405); ctx.lineTo(300, 395); ctx.moveTo(306, 405); ctx.lineTo(306, 397); ctx.stroke();
    }
    // Crab shuffles sideways — difference 5: faces left, or right.
    var dir = vars[5] === 0 ? -1 : 1;
    var shuf = D.sway(t, 3000, 0) * 6;
    var cx = 390 + shuf, cy = 398;
    ctx.fillStyle = '#e63946';
    D.ellipse(ctx, cx, cy, 15, 10);
    D.circle(ctx, cx + dir * 12, cy - 8, 5);
    ctx.fillStyle = '#222222'; D.circle(ctx, cx + dir * 14, cy - 10, 1.5);
    ctx.strokeStyle = '#e63946'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (var i = 0; i < 3; i++) {
      ctx.beginPath(); ctx.moveTo(cx - 10, cy + i * 3 - 2); ctx.lineTo(cx - 20, cy + i * 3 + 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 10, cy + i * 3 - 2); ctx.lineTo(cx + 20, cy + i * 3 + 2); ctx.stroke();
    }
  }

  function drawStar(ctx, x, y, r) {
    ctx.beginPath();
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + (i / 10) * Math.PI * 2;
      var rad = i % 2 === 0 ? r : r * 0.45;
      var px = x + Math.cos(a) * rad, py = y + Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath(); ctx.fill();
  }

  S.drawBeach = function (ctx, vars, t) {
    drawSky(ctx, vars, t);
    drawSea(ctx, vars, t);
    drawSand(ctx, t);
    drawPalm(ctx, vars, t);
    drawUmbrella(ctx, vars);
    drawTowelAndBall(ctx, t);
    drawCastle(ctx, vars, t);
    drawBucket(ctx, vars);
    drawCritters(ctx, vars, t);
  };
})();
