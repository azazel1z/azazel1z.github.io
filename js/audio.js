/* ---------------------------------------------------------------------------
   Navigation blips, synthesised with the Web Audio API.

   These are *not* Sony's samples — those are copyrighted and don't belong in a
   public repo. They're built from an oscillator plus a filtered noise tick,
   voiced to sit in the same place as the XMB originals.

   To use real audio files instead, replace the bodies of move/enter/back with
   `new Audio('assets/move.wav').play()`.

   Exposes window.XMBAudio: .move() .enter() .back() .toggle() .muted
--------------------------------------------------------------------------- */

(() => {
  'use strict';

  const KEY = 'xmb-muted';
  let ctx = null;
  let muted = localStorage.getItem(KEY) === '1';
  let noiseBuf = null;

  // AudioContext must be created inside a gesture or it starts suspended.
  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      noiseBuf = makeNoise(ctx);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function makeNoise(ac) {
    const len = Math.floor(ac.sampleRate * 0.08);
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      // decaying white noise — the "tick" transient
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    return buf;
  }

  // A short pitched blip with an exponential decay.
  function blip({ from, to, dur, gain, type = 'sine' }) {
    const ac = ensure();
    if (!ac) return;
    const t = ac.currentTime;

    const osc = ac.createOscillator();
    const amp = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t);
    osc.frequency.exponentialRampToValueAtTime(to, t + dur);

    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(gain, t + 0.006);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(amp).connect(ac.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  // The percussive edge that makes it read as a UI click rather than a beep.
  function tick(gain, cutoff) {
    const ac = ensure();
    if (!ac || !noiseBuf) return;
    const t = ac.currentTime;

    const src = ac.createBufferSource();
    src.buffer = noiseBuf;

    const hp = ac.createBiquadFilter();
    hp.type = 'bandpass';
    hp.frequency.value = cutoff;
    hp.Q.value = 0.9;

    const amp = ac.createGain();
    amp.gain.setValueAtTime(gain, t);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);

    src.connect(hp).connect(amp).connect(ac.destination);
    src.start(t);
  }

  const API = {
    get muted() { return muted; },

    move() {
      if (muted) return;
      blip({ from: 1450, to: 880, dur: 0.055, gain: 0.045 });
      tick(0.030, 2600);
    },

    enter() {
      if (muted) return;
      blip({ from: 720, to: 1560, dur: 0.11, gain: 0.060 });
      blip({ from: 1440, to: 2340, dur: 0.09, gain: 0.022, type: 'triangle' });
      tick(0.035, 3200);
    },

    back() {
      if (muted) return;
      blip({ from: 980, to: 460, dur: 0.10, gain: 0.050 });
      tick(0.022, 1800);
    },

    toggle() {
      muted = !muted;
      localStorage.setItem(KEY, muted ? '1' : '0');
      if (!muted) API.move();
      return muted;
    },
  };

  window.XMBAudio = API;
})();
