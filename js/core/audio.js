/* THE UNREMEMBERED — audio -----------------------------------------------
   Everything is synthesized. The score is diegetic: Moyi's registers are
   real sung motifs; Hush literally drains the music from the game.
--------------------------------------------------------------------------- */
G.audio = (() => {
  let ctx = null, master, music, sfxBus, verb, verbGain;
  let drone = null, droneName = null;
  let presence = 1;            // music presence — Hush erodes this
  let enabled = true;
  const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);

  function ensure() {
    if (ctx || !enabled) return !!ctx;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createDynamicsCompressor();
    master.threshold.value = -18; master.ratio.value = 6;
    const out = ctx.createGain(); out.gain.value = 0.9;
    master.connect(out); out.connect(ctx.destination);

    music = ctx.createGain(); music.gain.value = 0.8; music.connect(master);
    sfxBus = ctx.createGain(); sfxBus.gain.value = 0.9; sfxBus.connect(master);

    // soft synthetic hall
    verb = ctx.createConvolver();
    const len = ctx.sampleRate * 2.6, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8);
    }
    verb.buffer = ir;
    verbGain = ctx.createGain(); verbGain.gain.value = 0.35;
    verb.connect(verbGain); verbGain.connect(master);
    return true;
  }
  const t0 = () => ctx.currentTime;

  /* ---------- primitives ---------- */
  function env(g, at, a, peak, d, sus, rel, end) {
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0001), at + a);
    if (sus != null) g.gain.exponentialRampToValueAtTime(Math.max(sus, 0.0001), at + a + d);
    g.gain.exponentialRampToValueAtTime(0.0001, end != null ? end : at + a + d + rel);
  }
  function noiseBuf(color = "white") {
    const len = ctx.sampleRate * 2, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (color === "white") d[i] = w;
      else { last = (last + 0.02 * w) / 1.02; d[i] = last * (color === "brown" ? 6 : 3.5); }
    }
    return b;
  }
  function noiseSrc(color, loop = true) {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf(color); s.loop = loop; return s;
  }

  /* ---------- voice: one sung note ---------- */
  function voice(m, at, dur, opt = {}) {
    const o = ctx.createOscillator(), o2 = ctx.createOscillator();
    const g = ctx.createGain(), g2 = ctx.createGain();
    const det = opt.detune || 0;
    o.type = opt.wave || "sine"; o2.type = "triangle";
    const f = midi(m);
    o.frequency.setValueAtTime(opt.glideFrom ? midi(opt.glideFrom) : f, at);
    if (opt.glideFrom) o.frequency.exponentialRampToValueAtTime(f, at + 0.09);
    o2.frequency.setValueAtTime(f * 2, at);
    o.detune.value = det; o2.detune.value = det;
    // vibrato arrives late, like a real voice settling
    const vib = ctx.createOscillator(), vg = ctx.createGain();
    vib.frequency.value = opt.vibRate || 5.2; vg.gain.setValueAtTime(0, at);
    vg.gain.linearRampToValueAtTime(opt.vib != null ? opt.vib : 5, at + Math.min(0.35, dur * 0.5));
    vib.connect(vg); vg.connect(o.frequency); vg.connect(o2.frequency);
    const vol = opt.vol != null ? opt.vol : 0.16;
    env(g, at, Math.min(0.12, dur * 0.3), vol, dur * 0.5, vol * 0.7, 0.5, at + dur + 0.45);
    env(g2, at, 0.1, vol * (opt.bright || 0.18), dur * 0.5, vol * 0.08, 0.4, at + dur + 0.3);
    o.connect(g); o2.connect(g2);
    const dest = opt.dest || music;
    g.connect(dest); g2.connect(dest); g.connect(verb);
    [o, o2, vib].forEach((n) => { n.start(at); n.stop(at + dur + 0.7); });
  }

  /* ---------- motifs ---------- */
  // Senna's lullaby — E minor pentatonic, 6/8. The spine of the whole score.
  const LULLABY = [
    [64,.5],[67,.5],[69,1],[67,.5],[64,.5],[62,1],
    [64,.5],[67,.5],[71,1],[69,1.6],[0,.4],
    [67,.5],[69,.5],[71,1],[74,.5],[71,.5],[69,1],
    [67,.5],[69,.5],[64,1.4],[64,1.6],
  ];
  const NAMING_TAIL = [ // answering phrase for ch10
    [71,.5],[74,.5],[76,1],[74,.5],[71,.5],[69,1],
    [71,.5],[69,.5],[67,1],[64,2.2],
  ];
  function motif(name = "lullaby", opt = {}) {
    if (!ensure()) return 0;
    const beat = opt.beat || 0.42;
    let seq = LULLABY;
    if (name === "naming") seq = LULLABY.concat(NAMING_TAIL);
    if (name === "fragment") seq = LULLABY.slice(0, 6);
    let at = t0() + 0.05, shift = opt.shift || 0;
    seq.forEach(([m, b]) => {
      const dur = b * beat * (opt.stretch || 1);
      if (m > 0) {
        let mm = m + shift, o = Object.assign({}, opt.voice);
        if (opt.broken) { // Paris singing: out of tune, out of time, real
          o = o || {};
          o.detune = (Math.random() * 2 - 1) * 65;
          o.wave = "triangle"; o.vib = 1.2; o.vol = 0.13; o.bright = 0.04;
          if (Math.random() < 0.22) mm += Math.random() < 0.5 ? -1 : 2;
          at += (Math.random() - 0.4) * 0.07;
        }
        voice(mm, at, dur * 0.92, o || {});
      }
      at += dur;
    });
    return at - t0(); // duration, for cueing visuals
  }

  /* ---------- registers (one-shot gestures) ---------- */
  function register(kind) {
    if (!ensure()) return;
    const at = t0();
    if (kind === "lull") { voice(64, at, 1.6, { vol: 0.15 }); voice(59, at + 0.15, 1.7, { vol: 0.1 }); }
    if (kind === "wake") {
      [76, 79, 83].forEach((m, i) => voice(m, at + i * 0.07, 0.9, { vol: 0.13, wave: "triangle", bright: 0.4, vib: 2 }));
      shimmer(0.8);
    }
    if (kind === "shift") {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(midi(69), at);
      o.frequency.exponentialRampToValueAtTime(midi(64), at + 1.1);
      env(g, at, 0.1, 0.14, 0.6, 0.08, 0.6);
      o.connect(g); g.connect(music); g.connect(verb); o.start(at); o.stop(at + 1.8);
      voice(73, at + 0.1, 1, { vol: 0.08, detune: 12 });
    }
    if (kind === "hush") hushFall();
  }
  function hushFall() { // beautiful. always works. always costs.
    const at = t0();
    voice(81, at, 0.5, { vol: 0.12 }); voice(74, at + 0.4, 0.6, { vol: 0.1 });
    voice(69, at + 0.9, 1.8, { vol: 0.09, vib: 0 });
    const n = noiseSrc("white", false); n.loop = false;
    const f = ctx.createBiquadFilter(); f.type = "lowpass";
    f.frequency.setValueAtTime(9000, at); f.frequency.exponentialRampToValueAtTime(120, at + 2.2);
    const g = ctx.createGain(); env(g, at, 0.3, 0.1, 1.2, 0.04, 1);
    n.connect(f); f.connect(g); g.connect(sfxBus); n.start(at); n.stop(at + 2.5);
    presence = Math.max(0.22, presence - 0.16); // the music never quite comes back
    if (drone) drone.gain.gain.linearRampToValueAtTime(drone.level * presence, at + 2.5);
  }
  function shimmer(dur = 1) {
    const n = noiseSrc("white", false), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = "bandpass"; f.frequency.value = 5200; f.Q.value = 4;
    env(g, t0(), 0.05, 0.045, dur * 0.4, 0.01, dur * 0.6);
    n.connect(f); f.connect(g); g.connect(verb); n.start(); n.stop(t0() + dur + 0.4);
  }

  /* ---------- sfx ---------- */
  const sfx = {
    glitch() {
      if (!ensure()) return;
      const at = t0();
      for (let i = 0; i < 5; i++) {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "square"; o.frequency.value = 180 + Math.random() * 2400;
        const s = at + i * 0.035; env(g, s, 0.004, 0.05, 0.02, 0.005, 0.02);
        o.connect(g); g.connect(sfxBus); o.start(s); o.stop(s + 0.06);
      }
    },
    uiVanish() { // a piece of the interface is taken
      if (!ensure()) return;
      const at = t0(), o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "triangle"; o.frequency.setValueAtTime(1300, at);
      o.frequency.exponentialRampToValueAtTime(70, at + 0.5);
      env(g, at, 0.01, 0.12, 0.3, 0.02, 0.25);
      o.connect(g); g.connect(sfxBus); o.start(at); o.stop(at + 0.7); sfx.glitch();
    },
    chime(up = true) {
      if (!ensure()) return;
      const ms = up ? [76, 83] : [71, 64];
      ms.forEach((m, i) => voice(m, t0() + i * 0.1, 0.7, { vol: 0.1, wave: "triangle", bright: 0.5, vib: 0, dest: sfxBus }));
    },
    rumble(dur = 1.6, deep = 0.2) {
      if (!ensure()) return;
      const n = noiseSrc("brown", false), f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = "lowpass"; f.frequency.value = 90;
      env(g, t0(), 0.08, deep, dur * 0.5, deep * 0.4, dur * 0.5);
      n.connect(f); f.connect(g); g.connect(sfxBus); n.start(); n.stop(t0() + dur + 0.5);
    },
    collapse() {
      sfx.rumble(3, 0.32); sfx.glitch();
      if (!ensure()) return;
      for (let i = 0; i < 9; i++) {
        const at = t0() + Math.random() * 1.6, o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sawtooth"; o.frequency.value = 50 + Math.random() * 320;
        env(g, at, 0.005, 0.07, 0.12, 0.01, 0.2);
        o.connect(g); g.connect(sfxBus); o.start(at); o.stop(at + 0.4);
      }
    },
    staticBurst(dur = 0.5) {
      if (!ensure()) return;
      const n = noiseSrc("white", false), f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = "highpass"; f.frequency.value = 1200;
      env(g, t0(), 0.02, 0.07, dur * 0.5, 0.02, dur * 0.5);
      n.connect(f); f.connect(g); g.connect(sfxBus); n.start(); n.stop(t0() + dur + 0.2);
    },
    heartbeat(n = 2) {
      if (!ensure()) return;
      for (let i = 0; i < n; i++) {
        const at = t0() + i * 0.9;
        [0, 0.18].forEach((d, j) => {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = "sine"; o.frequency.value = j ? 48 : 58;
          env(g, at + d, 0.01, 0.22, 0.08, 0.03, 0.12);
          o.connect(g); g.connect(sfxBus); o.start(at + d); o.stop(at + d + 0.25);
        });
      }
    },
    key() {
      if (!ensure()) return;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.value = 2300 + Math.random() * 600;
      env(g, t0(), 0.002, 0.03, 0.01, 0.005, 0.03);
      o.connect(g); g.connect(sfxBus); o.start(); o.stop(t0() + 0.06);
    },
    threadHum() {
      if (!ensure()) return;
      voice(64, t0(), 1.1, { vol: 0.07, vib: 7, dest: sfxBus }); shimmer(1.4);
    },
    notify(wrong) {
      if (!ensure()) return;
      voice(wrong ? 70 : 79, t0(), 0.25, { vol: 0.07, wave: "triangle", vib: 0, dest: sfxBus });
      if (wrong) voice(66, t0() + 0.18, 0.4, { vol: 0.06, wave: "triangle", vib: 0, dest: sfxBus });
    },
    stamp() {
      if (!ensure()) return;
      const n = noiseSrc("white", false), g = ctx.createGain(), f = ctx.createBiquadFilter();
      f.type = "lowpass"; f.frequency.value = 600;
      env(g, t0(), 0.004, 0.25, 0.07, 0.02, 0.1);
      n.connect(f); f.connect(g); g.connect(sfxBus); n.start(); n.stop(t0() + 0.25);
    },
  };

  /* ---------- drones (scene beds) ---------- */
  const PROFILES = {
    town:   { oscs: [[41.2,"sine",.12],[82.4,"sine",.05],[123.5,"sine",.022]], noise: ["brown", 220, .025], level: .5 },
    night:  { oscs: [[36.7,"sine",.1],[110,"sine",.03]], noise: ["brown", 150, .02], level: .45 },
    veil:   { oscs: [[55,"sine",.09],[82.5,"sine",.07],[164.8,"sine",.03],[165.6,"sine",.03]], noise: ["white", 4200, .012], level: .55, glass: true },
    mall:   { holdMusic: true, noise: ["white", 3000, .008], level: .5 },
    tower:  { oscs: [[98,"sine",.05],[196.5,"sine",.03]], noise: ["white", 1800, .03], level: .5, carrier: true },
    house:  { oscs: [[49,"sine",.08]], noise: ["brown", 300, .04], level: .5, murmur: true },
    choir:  { choir: true, level: .6 },
    exam:   { oscs: [[65.4,"sine",.04]], noise: ["brown", 200, .015], level: .4, ticks: true },
    fort:   { oscs: [[82.4,"sine",.05],[123.5,"sine",.03]], noise: ["white", 6000, .01], level: .45, box: true },
    deep:   { oscs: [[27.5,"sine",.1],[55.3,"sine",.04]], noise: ["white", 7000, .006], level: .5, glass: true },
    finale: { oscs: [[41.2,"sine",.08],[123.5,"sine",.03],[164.8,"sine",.025]], noise: ["white", 2400, .012], level: .55, carrier: true },
    silence:{ oscs: [], level: .0001 },
  };
  function buildDrone(name) {
    const p = PROFILES[name] || PROFILES.town;
    const g = ctx.createGain(); g.gain.value = 0.0001; g.connect(music);
    const stop = [];
    (p.oscs || []).forEach(([f, type, vol]) => {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = type; o.frequency.value = f; og.gain.value = vol;
      const lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.frequency.value = 0.05 + Math.random() * 0.08; lg.gain.value = vol * 0.4;
      lfo.connect(lg); lg.connect(og.gain);
      o.connect(og); og.connect(g); og.connect(verb);
      o.start(); lfo.start(); stop.push(o, lfo);
    });
    if (p.noise) {
      const [color, f, vol] = p.noise, n = noiseSrc(color), nf = ctx.createBiquadFilter(), ng = ctx.createGain();
      nf.type = color === "brown" ? "lowpass" : "bandpass"; nf.frequency.value = f; ng.gain.value = vol;
      n.connect(nf); nf.connect(ng); ng.connect(g); n.start(); stop.push(n);
    }
    if (p.glass) glassLoop(g, stop);
    if (p.holdMusic) holdMusicLoop(g, stop);
    if (p.carrier) { const o = ctx.createOscillator(), og = ctx.createGain(); o.frequency.value = 932; og.gain.value = .006; o.connect(og); og.connect(g); o.start(); stop.push(o); }
    if (p.murmur) murmurLoop(g, stop);
    if (p.choir) choirPad(g, stop);
    if (p.ticks) tickLoop(g, stop);
    if (p.box) boxLoop(g, stop);
    return { gain: g, stop, level: p.level };
  }
  function glassLoop(dest, stop) { // sparse far-off tones in the Veil
    const id = setInterval(() => {
      if (!ctx) return;
      const m = G.U.pick([76, 79, 83, 88, 71]);
      voice(m, t0() + Math.random(), 2.4, { vol: 0.022, vib: 0.5, dest });
    }, 4200);
    stop.push({ stop: () => clearInterval(id) });
  }
  function holdMusicLoop(dest, stop) { // the dead mall is still on hold
    const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 1100; f.Q.value = 0.7;
    const hg = ctx.createGain(); hg.gain.value = 1.6; f.connect(hg); hg.connect(dest);
    const chords = [[57,60,64],[55,59,62],[53,57,60],[55,59,64]];
    let step = 0;
    const playBar = () => {
      if (!ctx) return;
      const ch = chords[step % 4]; step++;
      ch.forEach((m, i) => voice(m + 12, t0() + 0.05 + i * 0.04, 2.4, { vol: 0.05, wave: "triangle", vib: 0, dest: f }));
      voice(ch[0], t0() + 0.05, 2.4, { vol: 0.05, vib: 0, dest: f });
    };
    playBar(); const id = setInterval(playBar, 2600);
    stop.push({ stop: () => clearInterval(id) });
  }
  function murmurLoop(dest, stop) { // an argument through the walls. no words survive.
    const n = noiseSrc("brown"), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = "bandpass"; f.frequency.value = 240; f.Q.value = 1.6; g.gain.value = 0;
    n.connect(f); f.connect(g); g.connect(dest); n.start(); stop.push(n);
    const id = setInterval(() => {
      if (!ctx) return;
      const at = t0(), bursts = 2 + (Math.random() * 4 | 0);
      for (let i = 0, c = at; i < bursts; i++) {
        const len = 0.1 + Math.random() * 0.3;
        g.gain.setTargetAtTime(0.5 + Math.random() * 0.5, c, 0.03);
        g.gain.setTargetAtTime(0.02, c + len, 0.05);
        f.frequency.setValueAtTime(180 + Math.random() * 220, c);
        c += len + 0.07;
      }
    }, 3400);
    stop.push({ stop: () => clearInterval(id) });
  }
  function choirPad(dest, stop) { // the Hollowed sing one perfect note
    [220, 220.2, 219.8, 330, 329.6, 110].forEach((f) => {
      const o = ctx.createOscillator(), bf = ctx.createBiquadFilter(), og = ctx.createGain();
      o.type = "sawtooth"; o.frequency.value = f;
      bf.type = "bandpass"; bf.frequency.value = 700; bf.Q.value = 2.2;
      og.gain.value = 0.035;
      o.connect(bf); bf.connect(og); og.connect(dest); og.connect(verb); o.start(); stop.push(o);
    });
  }
  function tickLoop(dest, stop) {
    const id = setInterval(() => {
      if (!ctx) return;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.value = 1700;
      env(g, t0(), 0.001, 0.05, 0.012, 0.01, 0.02);
      o.connect(g); g.connect(dest); o.start(); o.stop(t0() + 0.05);
    }, 1000);
    stop.push({ stop: () => clearInterval(id) });
  }
  function boxLoop(dest, stop) { // music box, half-remembered
    const id = setInterval(() => {
      if (!ctx) return;
      if (Math.random() < 0.6) voice(G.U.pick([88, 91, 93, 95]), t0(), 1.6, { vol: 0.03, wave: "triangle", vib: 0, bright: 0.6, dest });
    }, 2300);
    stop.push({ stop: () => clearInterval(id) });
  }

  function setDrone(name) {
    if (!ensure()) { droneName = name; return; }
    if (droneName === name) return;
    droneName = name;
    if (drone) {
      const old = drone;
      old.gain.gain.setTargetAtTime(0.0001, t0(), 0.8);
      setTimeout(() => old.stop.forEach((n) => { try { n.stop(); } catch (e) {} }), 3200);
    }
    drone = buildDrone(name);
    drone.gain.gain.setTargetAtTime(drone.level * presence, t0() + 0.1, 1.2);
  }
  function duck(amount = 0.25, sec = 2) {
    if (!ctx || !drone) return;
    drone.gain.gain.setTargetAtTime(drone.level * presence * amount, t0(), 0.3);
    drone.gain.gain.setTargetAtTime(drone.level * presence, t0() + sec, 1.5);
  }

  return {
    ensure, motif, register, sfx, setDrone, duck, voice: (...a) => ensure() && voice(...a), midi,
    get presence() { return presence; },
    set enabled(v) { enabled = v; if (!v && ctx) ctx.suspend(); if (v && ctx) ctx.resume(); },
    get enabled() { return enabled; },
    resume() { if (ctx && ctx.state === "suspended") ctx.resume(); },
  };
})();
