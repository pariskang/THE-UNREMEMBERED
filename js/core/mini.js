/* THE UNREMEMBERED — mini ----------------------------------------------------
   Every mechanic is a metaphor the player enacts rather than reads.
--------------------------------------------------------------------------- */
G.mini = (() => {
  const U = G.U, $ = U.$, W = 960, H = 540;
  const canvas = $("#scene");
  let active = null, pointer = { x: 0, y: 0, down: false };

  function toLocal(e) {
    const r = canvas.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  }
  canvas.addEventListener("pointermove", (e) => { const p = toLocal(e); pointer.x = p.x; pointer.y = p.y; });
  canvas.addEventListener("pointerdown", (e) => { pointer.down = true; const p = toLocal(e); pointer.x = p.x; pointer.y = p.y; active && active.onDown && active.onDown(p); });
  window.addEventListener("pointerup", () => { pointer.down = false; active && active.onUp && active.onUp(); });
  window.addEventListener("keydown", (e) => {
    if (e.repeat) return;
    if (active && active.onKey) active.onKey(e);
    if (e.key === " " && active && active.onDown) active.onDown({ x: pointer.x, y: pointer.y, key: true });
  });
  window.addEventListener("keyup", (e) => { if (e.key === " " && active && active.onUp) active.onUp(); });

  function draw(x, t, dt) { active && active.draw && active.draw(x, t, dt); }
  const run = (game) => new Promise((res) => { active = game; game.done = (v) => { active = null; res(v); }; });

  const ring = (x, cx, cy, r, c, lw = 2, a = 1) => { x.globalAlpha = a; x.strokeStyle = c; x.lineWidth = lw; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.stroke(); x.globalAlpha = 1; };
  const label = (x, tx, ty, text, c = "rgba(207,216,220,.85)", size = 11, align = "center") => {
    x.font = size + "px monospace"; x.textAlign = align; x.fillStyle = c; x.fillText(text, tx, ty); x.textAlign = "left";
  };

  /* ================= hold to hum (the first thread) ================= */
  function holdHum(opts = {}) {
    let v = 0, started = false;
    return run({
      draw(x, t, dt) {
        if (pointer.down || started) v = Math.min(1, v + dt / (opts.secs || 2.6));
        const cx = opts.x || W * .42, cy = opts.y || H * .45;
        ring(x, cx, cy, 26, "rgba(125,232,216,.25)", 2);
        ring(x, cx, cy, 26, "#7de8d8", 3, .9 * v);
        x.strokeStyle = "#7de8d8"; x.lineWidth = 3;
        x.beginPath(); x.arc(cx, cy, 26, -Math.PI / 2, -Math.PI / 2 + v * 7); x.stroke();
        for (let i = 0; i < v * 5; i++) ring(x, cx, cy, 30 + ((t * 40 + i * 22) % 90), "rgba(125,232,216,.3)", 1, 1 - ((t * 40 + i * 22) % 90) / 90);
        label(x, cx, cy + 58, opts.hint || "hold — hum", "rgba(125,232,216,.8)");
        if (v >= 1) this.done(true);
      },
      onDown() { started = true; if (!this._h) { this._h = 1; G.audio.voice(64, undefined, 2.4, { vol: .08 }); } },
    });
  }

  /* ================= threadstep ================= */
  function threadstep(opts = {}) {
    // nodes: places where something was felt. grey nodes: nothing ever happened here.
    const nodes = opts.nodes || [
      { x: 200, y: 430, live: 1, s: "the bleachers" }, { x: 360, y: 360, live: 1, s: "first-day bench" },
      { x: 470, y: 430, live: 0, s: "(nothing was ever felt here)" }, { x: 540, y: 300, live: 1, s: "the spot she laughed" },
      { x: 660, y: 380, live: 0, s: "(no one remembers this corner)" }, { x: 760, y: 280, live: 1, s: "locker 144", exit: 1 },
    ];
    let at = 0, msg = "";
    return run({
      draw(x, t) {
        const cur = nodes[at];
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i], d = Math.hypot(n.x - cur.x, n.y - cur.y);
          const reach = d < 270 && i !== at;
          if (n.live && reach) G.paint.thread(x, [cur.x, cur.y], [(cur.x + n.x) / 2, Math.min(cur.y, n.y) - 70], [n.x, n.y], "rgba(125,232,216,.45)", t, i);
          ring(x, n.x, n.y, 9 + (n.exit ? Math.sin(t * 3) * 2 : 0), n.live ? (n.exit ? "#ffd9a0" : "#7de8d8") : "rgba(140,150,160,.35)", 2, n.live ? .9 : .5);
          if (!n.live) label(x, n.x, n.y + 20, "·", "rgba(140,150,160,.5)");
        }
        ring(x, cur.x, cur.y, 14, "#fff", 1.5, .8);
        G.paint.figure(x, cur.x, cur.y + 26, 1.5, "moyi", { t });
        label(x, W / 2, 60, opts.hint || "step only where something was once felt", "rgba(125,232,216,.75)");
        if (msg) label(x, W / 2, 84, msg, "rgba(232,157,180,.85)");
      },
      onDown(p) {
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          if (Math.hypot(p.x - n.x, p.y - n.y) < 26 && i !== at) {
            const d = Math.hypot(n.x - nodes[at].x, n.y - nodes[at].y);
            if (d > 270) { msg = "too far — no thread reaches"; return; }
            if (!n.live) { msg = "nothing was ever felt there. there is no thread."; G.audio.sfx.glitch(); return; }
            at = i; msg = n.s; G.audio.sfx.threadHum();
            if (n.exit) { this.done(true); }
            return;
          }
        }
      },
    });
  }

  /* ================= murmuration escape ================= */
  function murmurationEscape() {
    G.fx.murmurationStart(26);
    const me = { x: W * .72, y: H * .62 }; let sing = 0, hp = 1, msg0 = true;
    const door = { x: 90, y: H * .55 };
    return run({
      draw(x, t, dt) {
        sing = U.clamp(sing + ((pointer.down ? 1 : -1) * dt) / 1.1, 0, 1);
        if (this._k) { me.x += (pointer.x - me.x) * dt * 2.2; me.y += (pointer.y - me.y) * dt * 2.2; }
        G.fx.murmurationTarget(me.x, me.y);
        G.fx.murmurationCalm(1 - sing * .92);
        // door out
        ring(x, door.x, door.y, 18 + Math.sin(t * 2.4) * 3, "#ffd9a0", 2);
        label(x, door.x, door.y + 36, "the crack in the floor", "rgba(255,217,160,.8)", 10);
        // me
        G.paint.figure(x, me.x, me.y + 22, 1.5, "moyi", { t });
        if (sing > .05) {
          ring(x, me.x, me.y, 30 + sing * 60, `rgba(125,232,216,${.4 * sing})`, 2);
          ring(x, me.x, me.y, 60 + sing * 90, `rgba(125,232,216,${.18 * sing})`, 1);
        }
        // harm
        const fl = G.fx.flock;
        if (fl) {
          let near = 0;
          fl.boids.forEach((b) => { if (Math.hypot(b.x - me.x, b.y - me.y) < 34) near++; });
          if (near > 2 && sing < .5) { hp -= dt * .25; if (Math.random() < .05) G.fx.shake(3); }
        }
        x.fillStyle = `rgba(196,106,106,${(1 - hp) * .35})`; x.fillRect(0, 0, W, H);
        label(x, W / 2, 54, "move: follow pointer · hold: Lull, sing them soft", "rgba(125,232,216,.75)");
        if (msg0) label(x, W / 2, 78, "they are made of every overheard thing", "rgba(190,210,230,.6)", 10);
        if (hp <= 0) { hp = .6; me.x = W * .72; me.y = H * .62; G.fx.flash(.35); } // gentle retry
        if (Math.hypot(me.x - door.x, me.y - door.y) < 30) { G.fx.murmurationStop(); this.done(true); }
        this._k = true; msg0 = t % 9 < 5;
      },
      onDown() { if (!this._s) { this._s = 1; } G.audio.register("lull"); },
    });
  }

  /* ================= resonance (trust expressed as timing) ================= */
  function resonance(opts = {}) {
    const rounds = opts.rounds || 3; let round = 0, r = 0, hits = 0, missFlash = 0;
    const target = () => 120 + round * 36;
    return run({
      draw(x, t, dt) {
        const cx = W / 2, cy = H * .52;
        r += dt * (110 + round * 18); if (r > 320) r = 0;
        // paris's structure: a drawn shell
        x.strokeStyle = "rgba(255,179,71,.5)"; x.lineWidth = 2;
        x.beginPath(); x.arc(cx, cy, target() + 16, Math.PI * 1.1, Math.PI * 1.9); x.stroke();
        ring(x, cx, cy, target(), "rgba(255,179,71,.85)", 2.5);
        ring(x, cx, cy, r, "rgba(125,232,216,.8)", 2);
        if (missFlash > 0) { missFlash -= dt; x.fillStyle = "rgba(232,157,180,.08)"; x.fillRect(0, 0, W, H); }
        label(x, cx, cy + target() + 46, `press when her song meets his structure  ·  ${hits}/${rounds}`, "rgba(207,216,220,.8)");
        G.paint.figure(x, cx - 200, cy + 130, 1.6, "moyi", { t });
        G.paint.figure(x, cx + 200, cy + 130, 1.65, "paris", { t });
      },
      onDown() {
        if (Math.abs(r - target()) < 26) {
          hits++; round++; r = 0;
          G.audio.register("lull"); G.audio.sfx.chime(true);
          G.fx.burst("sparks", 16, { x: W / 2, y: H * .52, color: "#b9a7e8" });
          if (hits >= rounds) { G.state.mark("resonance.first", true, "first resonance"); this.done(true); }
        } else { missFlash = .4; G.audio.sfx.glitch(); r = 0; }
      },
    });
  }

  /* ================= deliver in order (the Backlog) ================= */
  function orderDeliver(opts) {
    // opts.items: [{id,label,body,order}] — deliver oldest wound first
    return new Promise((res) => {
      const P = $("#panel"), B = $("#panel-body"), F = $("#panel-foot");
      $("#panel-title").textContent = opts.title || "DELIVER THEM IN THE ORDER THE WOUND WAS MADE";
      B.innerHTML = ""; F.innerHTML = "";
      let expect = 1, tries = 0;
      const note = U.el("div", "pn-note", opts.note || "read them. the glacier is stratified — oldest grief at the bottom.");
      B.appendChild(note);
      opts.items.forEach((it) => {
        const d = U.el("div", "pn-item", `<h4>${it.label}</h4><p>${it.body}</p>`);
        d.onclick = () => {
          if (d.classList.contains("dead")) return;
          if (it.order === expect) {
            expect++; d.classList.add("dead"); d.style.opacity = .25;
            G.audio.sfx.chime(true); G.state.deliver(it.id);
            if (expect > opts.items.length) { P.classList.add("hidden"); res({ tries }); }
          } else {
            tries++; G.audio.sfx.rumble(1, .25); G.fx.shake(6);
            note.textContent = opts.wrong || "the glacier groans. that apology isn't ready — something older is still under it.";
          }
        };
        B.appendChild(d);
      });
      P.classList.remove("hidden");
    });
  }

  /* ================= panel: choose one (memory burning, triage…) ================= */
  function choosePanel(opts) {
    return new Promise((res) => {
      const P = $("#panel"), B = $("#panel-body"), F = $("#panel-foot");
      $("#panel-title").textContent = opts.title;
      B.innerHTML = ""; F.innerHTML = "";
      if (opts.note) B.appendChild(U.el("div", "pn-note", opts.note));
      let sel = null, selEl = null;
      opts.items.forEach((it) => {
        const d = U.el("div", "pn-item" + (it.dead ? " dead" : ""), `<h4>${it.label}</h4><p>${it.desc || ""}</p>${it.cost ? `<span class="cost">${it.cost}</span>` : ""}`);
        if (!it.dead) d.onclick = () => { sel = it; selEl && selEl.classList.remove("sel"); selEl = d; d.classList.add("sel"); };
        B.appendChild(d);
      });
      const ok = U.el("button", "pn-btn" + (opts.warn ? " warn" : ""), opts.confirm || "confirm");
      ok.onclick = () => { if (!sel && !opts.allowNone) return; P.classList.add("hidden"); res(sel); };
      F.appendChild(ok);
      if (opts.skip) { const sk = U.el("button", "pn-btn", opts.skip); sk.onclick = () => { P.classList.add("hidden"); res(null); }; F.appendChild(sk); }
      P.classList.remove("hidden");
    });
  }

  /* ================= multi-pick (collapse triage) ================= */
  function pickN(opts) {
    return new Promise((res) => {
      const P = $("#panel"), B = $("#panel-body"), F = $("#panel-foot");
      $("#panel-title").textContent = opts.title;
      B.innerHTML = ""; F.innerHTML = "";
      if (opts.note) B.appendChild(U.el("div", "pn-note", opts.note));
      const sel = new Set();
      opts.items.forEach((it) => {
        const d = U.el("div", "pn-item", `<h4>${it.label}</h4><p>${it.desc || ""}</p>`);
        d.onclick = () => {
          if (sel.has(it)) { sel.delete(it); d.classList.remove("sel"); }
          else if (sel.size < opts.n) { sel.add(it); d.classList.add("sel"); }
          ok.textContent = `${opts.confirm} (${sel.size}/${opts.n})`;
        };
        B.appendChild(d);
      });
      const ok = U.el("button", "pn-btn", `${opts.confirm} (0/${opts.n})`);
      ok.onclick = () => { if (sel.size !== opts.n) return; P.classList.add("hidden"); res([...sel]); };
      F.appendChild(ok);
      P.classList.remove("hidden");
    });
  }

  /* ================= crackread: find the structural lie ================= */
  function crackread(opts) {
    return new Promise((res) => {
      const P = $("#panel"), B = $("#panel-body"), F = $("#panel-foot");
      $("#panel-title").textContent = opts.title || "CRACKREAD — find the load-bearing lie";
      B.innerHTML = ""; F.innerHTML = "";
      B.appendChild(U.el("div", "pn-note", opts.story));
      let wrongs = 0;
      const tremors = [];
      opts.beams.forEach((bm) => {
        const d = U.el("div", "pn-item", `<h4>${bm.label}</h4><p>${bm.claim}</p>`);
        if (bm.lie) { // the fault only the player can see
          tremors.push(setInterval(() => {
            if (!P.classList.contains("hidden") && Math.random() < .3) {
              d.style.transform = "translateX(1.5px)";
              setTimeout(() => (d.style.transform = ""), 90);
            }
          }, 1700));
        }
        d.onclick = () => {
          if (bm.lie) {
            tremors.forEach(clearInterval);
            G.audio.sfx.chime(true); G.fx.burst("sparks", 14, { x: W / 2, y: H / 2, color: "#ffd9a0" });
            P.classList.add("hidden"); res({ wrongs });
          } else { wrongs++; G.audio.sfx.glitch(); d.classList.add("dead"); G.state.stab(-3); }
        };
        B.appendChild(d);
      });
      P.classList.remove("hidden");
    });
  }

  /* ================= rhythm lullaby (timing in draw clock) ================= */
  function rhythm(opts = {}) {
    const beats = opts.beats || 8, interval = .62; let elapsed = 0, idx = 0, hits = 0, fl = 0, started = false;
    G.audio.motif(opts.motif || "lullaby", { beat: .42, shift: opts.shift || 0 });
    return run({
      draw(x, t, dt) {
        elapsed += dt;
        const cx = W / 2, cy = H * .56;
        ring(x, cx, cy, 34, "rgba(125,232,216,.75)", 2.2);
        for (let i = idx; i < beats; i++) {
          const d = i * interval + .9 - elapsed;
          if (d < 2.2 && d > -0.3) ring(x, cx, cy, 34 + Math.max(0, d) * 170, "rgba(255,217,160,.6)", 2, 1 - Math.abs(d) / 2.2);
        }
        if (fl > 0) { fl -= dt; ring(x, cx, cy, 38, "#7de8d8", 5, fl * 2); }
        label(x, cx, cy + 72, (opts.hint || "press on the pulse") + `  ·  ${hits}/${beats}`, "rgba(207,216,220,.8)");
        if (idx * interval + .9 - elapsed < -0.33 && idx < beats) idx++;
        if (idx >= beats) this.done({ hits, beats });
      },
      onDown() {
        const d = Math.abs(idx * interval + .9 - elapsed);
        if (d < .3) { hits++; idx++; fl = .4; G.audio.voice(64 + [0, 3, 5, 7, 10][hits % 5], undefined, .5, { vol: .1 }); }
        else { G.audio.sfx.glitch(); }
      },
    });
  }

  /* ================= wrecking ball (one continuous shot) ================= */
  function wreckingBall() {
    let charge = 0, released = false, prog = 0;
    return run({
      draw(x, t, dt) {
        if (pointer.down && !released) charge = Math.min(1, charge + dt / 2.2);
        if (released) {
          prog += dt / 4.5;
          G.paint.mood({ swing: Math.min(1, prog * 2) });
          if (prog > .2 && !this._r1) { this._r1 = 1; G.audio.sfx.collapse(); G.fx.shake(10); G.fx.burst("debris", 30, { x: W * .47, y: H * .6 }); }
          if (prog > .5 && !this._r2) { this._r2 = 1; G.audio.sfx.collapse(); G.fx.shake(12); G.fx.burst("debris", 40, { x: W * .3, y: H * .5 }); }
          if (prog > .8 && !this._r3) { this._r3 = 1; G.audio.sfx.collapse(); G.fx.shake(14); G.fx.burst("debris", 50, { x: W * .68, y: H * .5 }); }
          if (prog >= 1) this.done(true);
          return;
        }
        const cx = W * .5, cy = H * .44;
        ring(x, cx, cy, 70 + charge * 16, `rgba(232,228,218,${.25 + charge * .6})`, 2 + charge * 3);
        label(x, cx, H * .84, charge < 1 ? "hold — let it mean something" : "release — a controlled demolition", charge < 1 ? "rgba(232,228,218,.7)" : "#ffd9a0");
      },
      onUp() { if (charge >= 1 && !released) { released = true; G.audio.motif("lullaby", { shift: -3, beat: .56, voice: { vol: .12 } }); } },
    });
  }

  /* ================= graded drafting (ch6) ================= */
  function gradedDraft() {
    const anchors = [[W * .3, H * .7], [W * .45, H * .62], [W * .6, H * .56], [W * .75, H * .5]];
    const grades = ["B−", "F", "A", "C+"]; // arbitrary. that's the point.
    let placed = 0, stampT = 0, lastGrade = "";
    return run({
      draw(x, t, dt) {
        for (let i = 0; i < anchors.length; i++) {
          const [ax, ay] = anchors[i];
          if (i < placed) {
            const sag = grades[i] === "F" ? Math.sin(t * 2) * 3 + 6 : 0;
            x.strokeStyle = grades[i] === "F" ? "rgba(255,179,71,.45)" : "rgba(255,179,71,.85)"; x.lineWidth = 3.5;
            const [px, py] = i ? anchors[i - 1] : [W * .18, H * .76];
            x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo((px + ax) / 2, (py + ay) / 2 + sag * 3, ax, ay + sag); x.stroke();
            label(x, ax, ay - 18, grades[i], grades[i] === "A" ? "#9fe8a0" : grades[i] === "F" ? "#e89db4" : "#ffe08a", 13);
          } else if (i === placed) ring(x, ax, ay, 10 + Math.sin(t * 3) * 2, "#ffb347", 2);
        }
        if (stampT > 0) { stampT -= dt; label(x, W / 2, H * .3, "GRADED: " + lastGrade, "rgba(230,226,214,.9)", 26); }
        label(x, W / 2, 56, "draft the bridge — click each anchor. every span will be graded.", "rgba(255,179,71,.8)");
        label(x, W / 2, 80, "the rubric is not posted. the rubric was never posted.", "rgba(150,160,170,.55)", 10);
      },
      onDown(p) {
        if (placed >= anchors.length) return;
        const [ax, ay] = anchors[placed];
        if (Math.hypot(p.x - ax, p.y - ay) < 30) {
          lastGrade = grades[placed]; placed++; stampT = 1.1;
          G.audio.sfx.stamp(); if (lastGrade === "F") { G.fx.shake(5); G.state.stab(-4); } else G.state.stab(-1);
          if (placed >= anchors.length) setTimeout(() => this.done(true), 1100);
        }
      },
    });
  }

  /* ================= rubric stealth (ch6) ================= */
  function rubricStealth() {
    const desks = [W * .2, W * .36, W * .52, W * .68, W * .84];
    let at = 0, caught = 0, msgT = 0;
    return run({
      draw(x, t, dt) {
        const sweep = Math.sin(t * 1.1); // rubric gaze: dangerous when |sweep| < .35 over your lane
        G.paint.mood({ rubrics: true, rubricN: 2 });
        for (let i = 0; i < desks.length; i++) {
          x.fillStyle = i === at ? "rgba(125,232,216,.16)" : "rgba(255,255,255,.04)";
          x.fillRect(desks[i] - 26, H * .76, 52, 36);
          if (i === at + 1) ring(x, desks[i], H * .8, 10 + Math.sin(t * 4) * 2, "#7de8d8", 1.6);
        }
        G.paint.figure(x, desks[at], H * .88, 1.6, "moyi", { t });
        const danger = Math.abs(sweep) < .4;
        label(x, W / 2, 56, "dash desk to desk — click the next desk while the scan looks away", "rgba(207,216,220,.8)");
        label(x, W / 2, 80, danger ? "— it is reading you —" : "now", danger ? "rgba(232,157,180,.8)" : "rgba(125,232,216,.9)", 11);
        if (msgT > 0) { msgT -= dt; label(x, W / 2, H * .3, "REDUCED TO A PERCENTILE — 61st", "#e89db4", 18); }
        if (at >= desks.length - 1) this.done({ caught });
      },
      onDown(p) {
        const nx = desks[at + 1]; if (nx == null) return;
        if (Math.abs(p.x - nx) < 40 && Math.abs(p.y - H * .8) < 70) {
          if (Math.abs(Math.sin(performance.now() / 1000 * 1.1)) < .4) { caught++; msgT = 1.2; G.audio.sfx.stamp(); G.state.luc(-3); at = Math.max(0, at - 1); }
          else { at++; G.audio.sfx.threadHum(); }
        }
      },
    });
  }

  /* ================= sanctuary build (ch8) ================= */
  function sanctuaryBuild() {
    const wings = [[W * .3, H * .66], [W * .42, H * .55], [W * .5, H * .48], [W * .58, H * .55], [W * .7, H * .66]];
    let placed = 0;
    const cracks = Math.min(4, G.state.d.crackedDrafts); // the past pays interest
    return run({
      draw(x, t) {
        G.paint.mood({ progress: placed / wings.length });
        for (let i = 0; i < wings.length; i++) {
          const [ax, ay] = wings[i];
          if (i === placed) ring(x, ax, ay, 11 + Math.sin(t * 3) * 2, "#ffb347", 2);
          if (i < placed && i < cracks) { // hidden cracks only the player can see
            x.strokeStyle = `rgba(196,106,106,${.25 + .2 * Math.abs(Math.sin(t * 2 + i))})`; x.lineWidth = 1;
            x.beginPath(); x.moveTo(ax - 12, ay + 8); x.lineTo(ax - 2, ay - 6); x.lineTo(ax + 9, ay + 4); x.stroke();
          }
        }
        label(x, W / 2, 56, "raise the Sanctuary — anchor each wing", "rgba(255,179,71,.85)");
        if (cracks > 0 && placed > 0) label(x, W / 2, 80, "you can see the hairline faults. he can't. he never could.", "rgba(196,106,106,.6)", 10);
      },
      onDown(p) {
        const w = wings[placed]; if (!w) return;
        if (Math.hypot(p.x - w[0], p.y - w[1]) < 30) {
          placed++; G.audio.sfx.chime(true); G.fx.burst("sparks", 12, { x: w[0], y: w[1], color: "#ffb347" });
          if (placed >= wings.length) this.done({ cracks });
        }
      },
    });
  }

  /* ================= honest road (ch9, Paris) ================= */
  function honestRoad(opts) {
    // statements: {text, certain} — lay only what he is certain of
    return new Promise(async (res) => {
      let bricks = 0, broke = 0;
      for (const st of opts.statements) {
        const pick = await choosePanel({
          title: "ONE HONEST BRICK AT A TIME",
          note: `“${st.text}”`,
          items: [
            { label: "Lay it.", desc: "He is certain of this. It will bear weight.", v: true },
            { label: "Set it down.", desc: "Not certain. Not tonight. The road can be shorter and true.", v: false },
          ],
          confirm: "place",
        });
        const laid = pick && pick.v;
        if (laid && st.certain) { bricks++; G.audio.sfx.chime(true); }
        else if (laid && !st.certain) { broke++; G.audio.sfx.collapse(); G.fx.shake(8); G.hud.toast("the brick cracks under its own doubt", true); }
        else if (!laid && st.certain) { G.hud.toast("…it was true, though. he carries it instead."); }
        else { G.audio.sfx.chime(false); }
        G.paint.mood({ bricks: bricks * 5 });
        await U.sleep(420);
      }
      G.state.d.honestBricks += bricks;
      res({ bricks, broke });
    });
  }

  /* ================= FEEL IT (the last interactive beat) ================= */
  function feelIt(opts = {}) {
    return new Promise((res) => {
      const btn = $("#feelit"), ringEl = $("#feelit-ring");
      btn.classList.remove("hidden");
      let held = 0, need = opts.secs || 38, last = null, holding = false, gentle = 0;
      const lines = ["it's okay. take a breath.", "you can hold it again when you're ready.", "the song waits. it doesn't leave."];
      const tick = (ts) => {
        if (last == null) last = ts;
        const dt = (ts - last) / 1000; last = ts;
        if (holding) { held += dt; G.audio.duck(1, 0); }
        else if (held > 0) { G.audio.duck(.15, .5); }
        ringEl.style.setProperty("--fill", Math.min(100, (held / need) * 100));
        if (held >= need) { btn.classList.add("hidden"); res(true); return; }
        requestAnimationFrame(tick);
      };
      btn.addEventListener("pointerdown", () => { holding = true; });
      window.addEventListener("pointerup", () => {
        if (holding && held < need) { holding = false; G.hud.toast(lines[(gentle++) % lines.length]); }
        else holding = false;
      });
      window.addEventListener("keydown", (e) => { if (e.key === " ") holding = true; });
      window.addEventListener("keyup", (e) => { if (e.key === " ") holding = false; });
      requestAnimationFrame(tick);
    });
  }

  /* ================= the haunted phone (ch1) ================= */
  function phone(opts) {
    return new Promise(async (res) => {
      const P = $("#phone"), TH = $("#ph-thread"), D = $("#ph-draft");
      const send = $("#ph-send"), del = $("#ph-del");
      $(".ph-time") && ($(".ph-time").textContent = "9:47 PM");
      TH.innerHTML = ""; D.textContent = "";
      (opts.thread || []).forEach((m) => TH.appendChild(U.el("div", "ph-msg " + (m.me ? "me" : "them") + (m.faded ? " faded" : ""), m.t)));
      P.classList.remove("hidden");
      let typing = true, skip = false, evasions = 0, deleting = false;
      send.onmouseenter = () => { // the Send button evades. the Veil edits.
        if (typing) return;
        if (evasions < 2) { evasions++; send.style.transform = `translate(${U.rand(-70, 40)}px,${U.rand(-46, -10)}px)`; G.audio.sfx.glitch(); }
        else { send.style.opacity = .25; send.disabled = true; send.textContent = "​"; G.audio.sfx.uiVanish(); }
      };
      send.onclick = () => {
        if (typing) { skip = true; return; }
        if (evasions >= 2) return;
        evasions = 2; send.style.opacity = .25; send.disabled = true; G.audio.sfx.uiVanish();
      };
      del.onclick = async () => {
        if (typing) { skip = true; return; } // first tap: the thumb hovers — finish the thought
        if (deleting) return;
        deleting = true;
        let s = D.textContent;
        while (s.length) { s = s.slice(0, -1); D.textContent = s; await U.sleep(20); }
        G.audio.sfx.key(); await U.sleep(700);
        P.classList.add("hidden");
        send.style.transform = ""; send.style.opacity = 1; send.disabled = false; send.textContent = "send";
        res({ deleted: true, triedSend: evasions > 0 });
      };
      await U.sleep(900);
      for (const ch of opts.draft) {
        if (skip) { D.textContent = opts.draft; break; }
        D.textContent += ch; G.audio.sfx.key();
        await U.sleep(ch === " " ? 46 : 26 + Math.random() * 38);
      }
      typing = false;
    });
  }

  function abort() { // chapter jumps mid-minigame: clear every overlay
    active = null;
    ["#panel", "#phone", "#feelit", "#choices"].forEach((s) => $(s).classList.add("hidden"));
  }

  const api = {
    draw, holdHum, threadstep, murmurationEscape, resonance, orderDeliver,
    choosePanel, pickN, crackread, rhythm, wreckingBall, gradedDraft,
    rubricStealth, sanctuaryBuild, honestRoad, feelIt, phone, abort,
    activeName: null,
  };
  // tag the running minigame so saves/tests can introspect it
  for (const k of Object.keys(api)) {
    if (k === "draw" || k === "abort" || k === "activeName") continue;
    const fn = api[k];
    api[k] = (...a) => {
      api.activeName = k;
      const r = Promise.resolve(fn(...a));
      r.finally(() => { if (api.activeName === k) api.activeName = null; });
      return r;
    };
  }
  return api;
})();
