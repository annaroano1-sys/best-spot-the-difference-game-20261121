// Garden of Differences R2 — the sound engine.
// One file, one job: every sound the game makes, synthesized with
// WebAudio at run time — no audio files, no network. The context is
// created lazily on the first user gesture (browsers block audio
// before one), everything is wrapped so a missing AudioContext can
// never break the game, and mute persists across visits.
(function () {
  var S = Spot;
  var ctx = null;
  var muted = false;
  try { muted = window.localStorage.getItem('spot-muted') === '1'; } catch (e) { muted = false; }

  function ensure() {
    if (ctx) return ctx;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    } catch (e) { ctx = null; }
    return ctx;
  }

  function tone(freq, at, dur, type, vol) {
    if (muted) return;
    var ac = ensure();
    if (!ac) return;
    try {
      if (ac.state === 'suspended') ac.resume();
      var osc = ac.createOscillator();
      var gain = ac.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, ac.currentTime + at);
      gain.gain.setValueAtTime(0.0001, ac.currentTime + at);
      gain.gain.exponentialRampToValueAtTime(vol || 0.12, ac.currentTime + at + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + at + dur);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(ac.currentTime + at);
      osc.stop(ac.currentTime + at + dur + 0.05);
    } catch (e) { /* sound is decoration; never break play */ }
  }

  S.audio = {
    isMuted: function () { return muted; },
    setMuted: function (m) {
      muted = !!m;
      try { window.localStorage.setItem('spot-muted', muted ? '1' : '0'); } catch (e) { /* ignore */ }
    },
    unlock: ensure,
    click: function () { tone(1200, 0, 0.04, 'sine', 0.04); },
    correct: function () { tone(659, 0, 0.14, 'sine', 0.14); tone(880, 0.09, 0.2, 'sine', 0.14); },
    wrong: function () { tone(110, 0, 0.18, 'sawtooth', 0.06); },
    hint: function () { tone(990, 0, 0.1, 'sine', 0.09); tone(1320, 0.07, 0.12, 'sine', 0.07); },
    win: function () {
      var notes = [523, 659, 784, 1047];
      for (var i = 0; i < notes.length; i++) tone(notes[i], i * 0.13, 0.22, 'triangle', 0.14);
      tone(1319, 0.55, 0.35, 'triangle', 0.1);
    },
    lose: function () { tone(392, 0, 0.2, 'sine', 0.1); tone(311, 0.18, 0.3, 'sine', 0.1); },
  };
})();
