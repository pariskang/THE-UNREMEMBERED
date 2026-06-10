/* THE UNREMEMBERED — fx ----------------------------------------------------
   Particles & events. Unsent messages drift like snow; gossip flocks;
   sheltered memories blow away like ash.
--------------------------------------------------------------------------- */
G.fx = (() => {
  const U = G.U, W = 960, H = 540;
  let parts = [], systems = {}, shakeAmt = 0;

  /* ---------- ambient systems (on/off by name) ---------- */
  const SYS = {
    msgSnow: { // tiny undelivered envelopes, falling forever
      rate: 0.5,
      spawn: () => ({ x: U.rand(W), y: -8, vx: U.rand(-6, 6), vy: U.rand(9, 22), rot: U.rand(7), vr: U.rand(-1, 1), life: 40, type: "env", a: U.rand(.25, .6) }),
    },
    ash: { // what a sanctuary becomes
      rate: 3,
      spawn: () => ({ x: U.rand(W), y: U.rand(H * .3, H * .8), vx: U.rand(14, 46), vy: U.rand(-22, -6), life: U.rand(3, 7), type: "ash", a: U.rand(.2, .6), r: U.rand(.8, 2.2) }),
    },
    motes: { // dust in lamplight
      rate: 1.2,
      spawn: () => ({ x: U.rand(W), y: U.rand(H), vx: U.rand(-4, 4), vy: U.rand(-3, 3), life: U.rand(4, 9), type: "mote", a: U.rand(.06, .2), r: U.rand(.5, 1.4) }),
    },
    chatGhosts: { // viewer-ghosts, drifting up
      rate: 1.4,
      spawn: () => ({ x: U.rand(W), y: H + 8, vx: U.rand(-3, 3), vy: U.rand(-30, -14), life: 9, type: "chat", a: U.rand(.15, .4), text: U.pick(["we miss u", "stay", "<3", "don't end it", "jun", "always here", "good night"]) }),
    },
    static: { // rain of dead signal
      rate: 14,
      spawn: () => ({ x: U.rand(W), y: U.rand(H), vx: 0, vy: 0, life: .12, type: "stat", a: U.rand(.05, .22), r: U.rand(.5, 1.5) }),
    },
  };

  /* ---------- murmuration: a flock of overheard gossip ---------- */
  let flock = null;
  function murmurationStart(n = 26) {
    flock = { boids: [], target: { x: W * .3, y: H * .5 }, aggression: 1 };
    for (let i = 0; i < n; i++)
      flock.boids.push({ x: U.rand(W * .6, W), y: U.rand(H * .2, H * .6), vx: U.rand(-20, 20), vy: U.rand(-20, 20), w: U.pick(["did you hear", "she said", "no way", "who?", "everyone knows", "don't tell", "i heard", "weird girl", "always alone"]) });
  }
  function murmurationStop() { flock = null; }
  function murmurationCalm(v) { if (flock) flock.aggression = v; }
  function murmurationTarget(x, y) { if (flock) { flock.target.x = x; flock.target.y = y; } }

  function stepFlock(dt) {
    if (!flock) return;
    const B = flock.boids, ag = flock.aggression;
    for (const b of B) {
      let cx = 0, cy = 0, ax = 0, ay = 0, sx = 0, sy = 0, n = 0;
      for (const o of B) {
        if (o === b) continue;
        const dx = o.x - b.x, dy = o.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < 110 * 110) { cx += o.x; cy += o.y; ax += o.vx; ay += o.vy; n++; }
        if (d2 < 26 * 26) { sx -= dx; sy -= dy; }
      }
      if (n) {
        b.vx += ((cx / n - b.x) * .9 + (ax / n - b.vx) * .6) * dt;
        b.vy += ((cy / n - b.y) * .9 + (ay / n - b.vy) * .6) * dt;
      }
      b.vx += (sx * 3.2 + (flock.target.x - b.x) * 1.1 * ag) * dt;
      b.vy += (sy * 3.2 + (flock.target.y - b.y) * 1.1 * ag) * dt;
      const sp = Math.hypot(b.vx, b.vy), max = 90 + 130 * ag;
      if (sp > max) { b.vx *= max / sp; b.vy *= max / sp; }
      b.x += b.vx * dt; b.y += b.vy * dt;
    }
  }

  /* ---------- public api ---------- */
  function on(name) { systems[name] = { acc: 0 }; }
  function off(name) { delete systems[name]; }
  function clear() { systems = {}; parts = []; flock = null; }
  function burst(type, n, cfg = {}) {
    for (let i = 0; i < n; i++) {
      if (type === "sparks") parts.push({ x: cfg.x || W / 2, y: cfg.y || H / 2, vx: U.rand(-130, 130), vy: U.rand(-180, 30), life: U.rand(.4, 1.2), type: "spark", a: 1, r: U.rand(1, 2.4), g: 220, color: cfg.color });
      if (type === "debris") parts.push({ x: cfg.x || W / 2, y: cfg.y || H / 2, vx: U.rand(-90, 90), vy: U.rand(-220, -40), life: U.rand(.8, 2), type: "deb", a: 1, r: U.rand(2, 6), g: 300 });
      if (type === "petals") parts.push({ x: U.rand(W), y: -10, vx: U.rand(-12, 12), vy: U.rand(16, 34), rot: U.rand(7), vr: U.rand(-2, 2), life: 20, type: "env", a: U.rand(.4, .8) });
    }
  }
  function shake(amt = 8) { shakeAmt = Math.max(shakeAmt, amt); G.U.$("#stage").classList.remove("shaking"); void G.U.$("#stage").offsetWidth; G.U.$("#stage").classList.add("shaking"); }
  function flash(a = .5, ms = 120) {
    const f = G.U.$("#flash"); f.style.opacity = a;
    setTimeout(() => (f.style.opacity = 0), ms);
  }

  function draw(x, t, dt) {
    // spawn from active systems
    for (const k in systems) {
      const s = SYS[k]; if (!s) continue;
      systems[k].acc += dt * s.rate;
      while (systems[k].acc > 1) { systems[k].acc--; parts.push(s.spawn()); }
    }
    // step + draw particles
    parts = parts.filter((p) => (p.life -= dt) > 0);
    if (parts.length > 600) parts.splice(0, parts.length - 600);
    for (const p of parts) {
      p.vy += (p.g || 0) * dt * (p.type === "ash" ? 0 : 1);
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.rot != null) p.rot += p.vr * dt;
      x.globalAlpha = Math.min(p.a, p.life);
      switch (p.type) {
        case "env": // a little unsent letter
          x.save(); x.translate(p.x, p.y); x.rotate(Math.sin(p.rot) * .5);
          x.fillStyle = "#cfe0ea"; x.fillRect(-3.4, -2.2, 6.8, 4.4);
          x.strokeStyle = "rgba(80,110,140,.8)"; x.lineWidth = .5;
          x.beginPath(); x.moveTo(-3.4, -2.2); x.lineTo(0, .6); x.lineTo(3.4, -2.2); x.stroke();
          x.restore(); break;
        case "ash":
          x.fillStyle = "#d8d4ca"; x.fillRect(p.x, p.y, p.r, p.r); break;
        case "mote":
          x.fillStyle = "#ffe2b0"; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7); x.fill(); break;
        case "chat":
          x.font = "9px monospace"; x.fillStyle = "#9ed4ff"; x.fillText(p.text, p.x, p.y); break;
        case "stat":
          x.fillStyle = Math.random() < .5 ? "#9fe8da" : "#e89db4"; x.fillRect(p.x, p.y, p.r, p.r); break;
        case "spark":
          x.fillStyle = p.color || "#ffd9a0"; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7); x.fill(); break;
        case "deb":
          x.fillStyle = "#1a202c"; x.fillRect(p.x, p.y, p.r, p.r * .7); break;
      }
      x.globalAlpha = 1;
    }
    // murmuration
    stepFlock(dt);
    if (flock) {
      x.font = "8.5px monospace";
      for (const b of flock.boids) {
        x.save(); x.translate(b.x, b.y); x.rotate(Math.atan2(b.vy, b.vx) * .15);
        x.fillStyle = `rgba(20,26,36,.9)`;
        x.beginPath(); x.ellipse(0, 0, 9, 3.2, 0, 0, 7); x.fill();
        x.fillStyle = `rgba(190,210,230,${.35 + .3 * flock.aggression})`;
        x.fillText(b.w, -8, -5); x.restore();
      }
    }
    // shake decay (canvas-space)
    if (shakeAmt > 0) shakeAmt = Math.max(0, shakeAmt - dt * 18);
  }

  return { on, off, clear, burst, shake, flash, draw, murmurationStart, murmurationStop, murmurationCalm, murmurationTarget, get flock() { return flock; } };
})();
