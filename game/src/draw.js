// Garden of Differences R2 — shared drawing helpers and animation.
// One file, one job: the small shapes every scene reuses, plus the
// time-based motion (flutter, bob, drift, sway) that makes both
// pictures feel alive. Every animated value is a pure function of
// the time `t` in milliseconds, so a frame is fully decided by `t`.
(function () {
  var S = Spot;

  function circle(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
  function ellipse(ctx, x, y, rx, ry) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); }
  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // Oscillates smoothly between -1 and 1.
  function sway(t, period, phase) { return Math.sin(((t + (phase || 0)) / period) * Math.PI * 2); }
  // 0..1 triangle wave, for a back-and-forth wander.
  function wander(t, period, phase) {
    var u = (((t + (phase || 0)) / period) % 1 + 1) % 1;
    return u < 0.5 ? u * 2 : 2 - u * 2;
  }

  function cloud(ctx, x, y, s) {
    ctx.fillStyle = '#ffffff';
    circle(ctx, x, y, 16 * s); circle(ctx, x + 18 * s, y + 3 * s, 13 * s);
    circle(ctx, x - 18 * s, y + 4 * s, 12 * s); circle(ctx, x + 4 * s, y - 9 * s, 13 * s);
  }

  // A bird in flight: wings flap by `flap` (-1..1), body at (x, y).
  function bird(ctx, x, y, flap) {
    ctx.strokeStyle = '#2b3a42'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    var w = 6 + flap * 4;
    ctx.beginPath();
    ctx.moveTo(x - 10, y); ctx.quadraticCurveTo(x - 5, y - w, x, y);
    ctx.quadraticCurveTo(x + 5, y - w, x + 10, y);
    ctx.stroke();
  }

  // A butterfly: wings open/close by `flap` (0..1), body at (x, y).
  function butterfly(ctx, x, y, colour, flap) {
    var open = 0.45 + flap * 0.55;
    ctx.fillStyle = colour;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(open, 1);
    ellipse(ctx, -11, -4, 11, 15); ellipse(ctx, 11, -4, 11, 15);
    ellipse(ctx, -9, 12, 8, 10); ellipse(ctx, 9, 12, 8, 10);
    ctx.restore();
    ctx.strokeStyle = '#3a2a4a'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y - 10); ctx.lineTo(x, y + 18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y - 10); ctx.quadraticCurveTo(x - 6, y - 18, x - 9, y - 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y - 10); ctx.quadraticCurveTo(x + 6, y - 18, x + 9, y - 20); ctx.stroke();
  }

  S.draw = { circle: circle, ellipse: ellipse, rr: rr, sway: sway, wander: wander, cloud: cloud, bird: bird, butterfly: butterfly };
})();
