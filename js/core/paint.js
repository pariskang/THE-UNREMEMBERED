/* THE UNREMEMBERED — paint ------------------------------------------------
   Procedural scenes. Two palettes:
   · analog dusk  — sodium amber, CRT teal, camcorder grain
   · soft-wrong   — the Veil: everything rendered like a memory of itself
--------------------------------------------------------------------------- */
G.paint = (() => {
  const W = 960, H = 540, U = G.U;
  const buf = document.createElement("canvas"); buf.width = W; buf.height = H;
  const bx = buf.getContext("2d");
  const prev = document.createElement("canvas"); prev.width = W; prev.height = H;
  const px2 = prev.getContext("2d");

  let cur = { id: "void", mood: {} }, fadeT = 1, figures = [];

  /* ============================ primitives ============================ */
  function grad(x, x0, y0, x1, y1, stops) {
    const g = x.createLinearGradient(x0, y0, x1, y1);
    stops.forEach(([p, c]) => g.addColorStop(p, c));
    return g;
  }
  function sky(x, stops) { x.fillStyle = grad(x, 0, 0, 0, H, stops); x.fillRect(0, 0, W, H); }
  function stars(x, t, seed = 1, n = 90, yMax = H * 0.55) {
    for (let i = 0; i < n; i++) {
      const sx = U.hash(i * 7.3 + seed) * W, sy = U.hash(i * 3.1 + seed * 2) * yMax;
      const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * (0.4 + U.hash(i) * 1.2) + i));
      x.globalAlpha = tw * 0.7; x.fillStyle = i % 7 ? "#cfe8f0" : "#ffd9a0";
      x.fillRect(sx, sy, i % 11 === 0 ? 1.6 : 1, i % 11 === 0 ? 1.6 : 1);
    }
    x.globalAlpha = 1;
  }
  function glow(x, cx, cy, r, color, a = 1) {
    const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, color); g.addColorStop(1, "rgba(0,0,0,0)");
    x.globalAlpha = a; x.fillStyle = g; x.fillRect(cx - r, cy - r, r * 2, r * 2); x.globalAlpha = 1;
  }
  function moon(x, cx, cy, r, tint = "#dde8ec") {
    glow(x, cx, cy, r * 5, "rgba(190,220,230,.16)");
    x.fillStyle = tint; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
    x.fillStyle = "rgba(140,170,180,.35)";
    x.beginPath(); x.arc(cx - r * .3, cy - r * .2, r * .22, 0, 7); x.fill();
    x.beginPath(); x.arc(cx + r * .25, cy + r * .3, r * .15, 0, 7); x.fill();
  }
  function ridge(x, baseY, amp, seed, color) {
    x.fillStyle = color; x.beginPath(); x.moveTo(0, H);
    for (let i = 0; i <= 40; i++) {
      const X = (i / 40) * W;
      x.lineTo(X, baseY - (U.hash(i * 1.7 + seed) * amp + Math.sin(i * .6 + seed) * amp * .4));
    }
    x.lineTo(W, H); x.fill();
  }
  function roofs(x, y, seed, hMax, color, winColor, t, litChance = .25) {
    x.fillStyle = color;
    let X = -10;
    const wins = [];
    while (X < W + 10) {
      const w = 34 + U.hash(X * .13 + seed) * 70, h = 24 + U.hash(X * .31 + seed) * hMax;
      x.fillRect(X, y - h, w, h + 4);
      if (U.hash(X * .7 + seed) < .4) x.fillRect(X + w * .3, y - h - 8, w * .2, 9); // chimney
      for (let wy = y - h + 7; wy < y - 8; wy += 13)
        for (let wx = X + 5; wx < X + w - 7; wx += 12)
          if (U.hash(wx * wy * .013 + seed) < litChance) wins.push([wx, wy]);
      X += w + 6 + U.hash(X + seed) * 24;
    }
    wins.forEach(([wx, wy], i) => {
      const fl = U.hash(i * 9.1) < .06 ? (Math.sin(t * 9 + i) > 0 ? 1 : .2) : 1;
      x.globalAlpha = .8 * fl; x.fillStyle = winColor; x.fillRect(wx, wy, 4.5, 6);
      x.globalAlpha = 1;
    });
  }
  function streetlight(x, px, py, h, tint = "#ffb347", t = 0, flicker = 0) {
    const fl = flicker ? (Math.sin(t * 23 + px) > -0.6 ? 1 : 0.15) : 1;
    x.strokeStyle = "#0a0d12"; x.lineWidth = 4;
    x.beginPath(); x.moveTo(px, py); x.lineTo(px, py - h); x.lineTo(px + 14, py - h + 2); x.stroke();
    glow(x, px + 16, py - h + 5, 60, "rgba(255,179,71,.5)", .8 * fl);
    x.fillStyle = tint; x.globalAlpha = fl; x.fillRect(px + 12, py - h + 2, 9, 4); x.globalAlpha = 1;
    // light cone
    const g = x.createLinearGradient(0, py - h, 0, py + 6);
    g.addColorStop(0, `rgba(255,179,71,${0.30 * fl})`); g.addColorStop(1, "rgba(255,179,71,0)");
    x.fillStyle = g; x.beginPath();
    x.moveTo(px + 16, py - h + 4); x.lineTo(px - 26, py + 6); x.lineTo(px + 58, py + 6); x.fill();
  }
  function radioTower(x, cx, baseY, h, t, lightOn = true) {
    x.strokeStyle = "rgba(20,26,34,.96)"; x.lineWidth = 2.4;
    const w0 = h * .26;
    x.beginPath();
    x.moveTo(cx - w0, baseY); x.lineTo(cx - 3, baseY - h);
    x.moveTo(cx + w0, baseY); x.lineTo(cx + 3, baseY - h);
    for (let i = 1; i <= 7; i++) {
      const yy = baseY - (h * i) / 8, ww = w0 * (1 - i / 8.6);
      x.moveTo(cx - ww, yy); x.lineTo(cx + ww, yy);
      x.moveTo(cx - ww, yy); x.lineTo(cx + ww * (1 - 2 / 8.6) * (i < 7 ? 1 : 0), yy - h / 8);
      x.moveTo(cx + ww, yy); x.lineTo(cx - ww * (1 - 2 / 8.6) * (i < 7 ? 1 : 0), yy - h / 8);
    }
    x.stroke();
    if (lightOn) {
      const blink = (Math.sin(t * 1.7) + 1) / 2;
      glow(x, cx, baseY - h - 4, 26 + blink * 18, "rgba(255,90,90,.55)", .5 + blink * .5);
      x.fillStyle = "#ff6b6b"; x.beginPath(); x.arc(cx, baseY - h - 4, 2.6, 0, 7); x.fill();
    }
  }
  function fog(x, y, hgt, t, speed = 6, alpha = .08, tint = "200,220,230") {
    for (let i = 0; i < 3; i++) {
      const off = ((t * speed * (i + 1) * .4) % (W * 2)) - W;
      const g = x.createLinearGradient(0, y - hgt, 0, y + hgt);
      g.addColorStop(0, `rgba(${tint},0)`); g.addColorStop(.5, `rgba(${tint},${alpha})`); g.addColorStop(1, `rgba(${tint},0)`);
      x.fillStyle = g;
      x.beginPath(); x.ellipse(((i * 433) % W) + off, y + i * 9, 420, hgt, 0, 0, 7); x.fill();
    }
  }
  function thread(x, p0, p1, p2, color, t, seed = 0) {
    x.strokeStyle = color; x.lineWidth = 1.1;
    x.shadowColor = color; x.shadowBlur = 7;
    x.beginPath(); x.moveTo(p0[0], p0[1]); x.quadraticCurveTo(p1[0], p1[1], p2[0], p2[1]); x.stroke();
    // travelling pulse
    const tt = (t * .35 + U.hash(seed)) % 1, it = 1 - tt;
    const qx = it * it * p0[0] + 2 * it * tt * p1[0] + tt * tt * p2[0];
    const qy = it * it * p0[1] + 2 * it * tt * p1[1] + tt * tt * p2[1];
    x.fillStyle = "#fff"; x.beginPath(); x.arc(qx, qy, 1.8, 0, 7); x.fill();
    x.shadowBlur = 0;
  }

  /* ---------- figures: faceless silhouettes, rim-lit ---------- */
  function figure(x, fx, fy, s, who, opt = {}) {
    const t = opt.t || 0, sway = Math.sin(t * 1.1 + fx) * 1.2 * s;
    x.save(); x.translate(fx, fy); x.scale(s, s);
    const ink = opt.pale ? "#d8d4ca" : "#0c1016";
    const rim = opt.rim || "#7de8d8";
    x.fillStyle = ink;
    const drawBody = (hW, hH, headR, lean = 0) => {
      x.beginPath();
      x.moveTo(-hW, 0);
      x.quadraticCurveTo(-hW - 1, -hH * .55, -hW * .72 + lean, -hH);
      x.lineTo(hW * .72 + lean, -hH);
      x.quadraticCurveTo(hW + 1, -hH * .55, hW, 0);
      x.closePath(); x.fill();
      x.beginPath(); x.arc(lean, -hH - headR * .8, headR, 0, 7); x.fill();
    };
    switch (who) {
      case "moyi": // hood up, ponytail, sketchbook against chest
        drawBody(7.5, 30, 6, sway * .15);
        x.beginPath(); x.arc(sway * .15, -36, 7.4, Math.PI * .9, Math.PI * 2.1); x.fill(); // hood
        x.beginPath(); x.moveTo(5, -34); x.quadraticCurveTo(11 + sway, -26, 8, -16); x.lineTo(5, -18); x.fill(); // ponytail
        x.fillStyle = "#1a232c"; x.fillRect(-6, -24, 9, 11); // sketchbook
        x.strokeStyle = rim; x.lineWidth = .9; x.globalAlpha = .85;
        x.beginPath(); x.arc(sway * .15, -36, 7.6, -Math.PI * .75, -Math.PI * .1); x.stroke();
        break;
      case "paris": // taller, straight posture, tool roll on shoulder
        drawBody(7, 36, 5.6);
        x.fillRect(-10, -34, 5, 16); // strap
        x.fillStyle = "#141a22"; x.fillRect(-14, -38, 7, 13); // tool roll
        x.strokeStyle = opt.rim || "#ffb347"; x.lineWidth = .9; x.globalAlpha = .85;
        x.beginPath(); x.moveTo(-7, -36); x.lineTo(-7, -4); x.stroke();
        break;
      case "senna": { // scarf, slightly translucent if blurred
        if (opt.blurFace) x.filter = "blur(2.6px)";
        if (opt.ghost) x.globalAlpha = .55;
        drawBody(7, 31, 6);
        x.fillStyle = "#22303e"; x.fillRect(-7, -30, 14, 4.6); // scarf
        x.beginPath(); x.moveTo(5, -28); x.quadraticCurveTo(10 + sway, -20, 7, -12); x.lineTo(4, -16); x.fill();
        x.strokeStyle = "#9ecfff"; x.lineWidth = .9;
        x.beginPath(); x.arc(0, -37, 6.2, -Math.PI * .8, -Math.PI * .15); x.stroke();
        x.filter = "none";
        break;
      }
      case "mom":
        drawBody(8.4, 33, 5.8);
        x.strokeStyle = opt.rim || "#d8b4a0"; x.lineWidth = .8; x.globalAlpha = .7;
        x.beginPath(); x.moveTo(-8, -30); x.quadraticCurveTo(0, -27, 8, -30); x.stroke();
        break;
      case "sheriff":
        drawBody(8.6, 35, 5.6);
        x.fillStyle = ink; x.fillRect(-8, -45.5, 16, 2.4); x.fillRect(-4.6, -50, 9.2, 5); // hat
        x.strokeStyle = "#b9a7e8"; x.lineWidth = .8;
        x.beginPath(); x.arc(0, -26, 2.6, 0, 7); x.stroke(); // badge
        break;
      case "juniper":
        drawBody(7, 30, 6);
        x.strokeStyle = "#ff9ecf"; x.lineWidth = 2;
        x.beginPath(); x.arc(0, -37, 7.6, Math.PI * 1.05, Math.PI * 1.95); x.stroke(); // headphones
        x.fillStyle = "#ff9ecf"; x.fillRect(-9.4, -38.5, 3, 5); x.fillRect(6.4, -38.5, 3, 5);
        break;
      case "asha":
        drawBody(6.8, 31, 5.8);
        x.beginPath(); x.moveTo(4, -34); x.quadraticCurveTo(8, -18, 5.5, -6); x.lineTo(2.6, -10); x.fill(); // braid
        x.strokeStyle = "#ffe08a"; x.lineWidth = .9;
        x.beginPath(); x.moveTo(-5, -22); x.lineTo(3, -22); x.stroke(); // book edge
        break;
      case "hollow": // featureless, perfectly still
        x.globalAlpha = .94; drawBody(7.6, 32, 5.8);
        x.strokeStyle = "rgba(232,228,218,.5)"; x.lineWidth = .7;
        x.beginPath(); x.arc(0, -37.5, 5.9, 0, 7); x.stroke();
        break;
      case "quiet": { // two silhouettes holding hands, bone-pale, stitched smiles
        x.fillStyle = "#e8e4da";
        const two = (ox) => {
          x.beginPath();
          x.moveTo(ox - 8, 0); x.quadraticCurveTo(ox - 9, -22, ox - 5, -40);
          x.lineTo(ox + 5, -40); x.quadraticCurveTo(ox + 9, -22, ox + 8, 0); x.closePath(); x.fill();
          x.beginPath(); x.arc(ox, -46, 6.4, 0, 7); x.fill();
          x.strokeStyle = "#c46a6a"; x.lineWidth = 1;
          x.beginPath(); x.moveTo(ox - 3.4, -44); x.quadraticCurveTo(ox, -42.4, ox + 3.4, -44); x.stroke();
          for (let i = -3; i <= 3; i += 1.5) { x.beginPath(); x.moveTo(ox + i, -44.8); x.lineTo(ox + i, -42.8); x.stroke(); }
          x.fillStyle = "#e8e4da";
        };
        two(-13); two(13);
        x.strokeStyle = "#e8e4da"; x.lineWidth = 2.2;
        x.beginPath(); x.moveTo(-6, -20); x.quadraticCurveTo(0, -16, 6, -20); x.stroke(); // held hands
        glow(x, 0, -30, 46, "rgba(232,228,218,.18)");
        break;
      }
      default: drawBody(7.4, 31, 6);
    }
    x.restore(); x.globalAlpha = 1;
  }

  /* ============================ scenes ============================ */
  const SC = {};

  SC.void = (x) => { x.fillStyle = "#04060a"; x.fillRect(0, 0, W, H); };

  SC.menu = (x, t) => {
    sky(x, [[0, "#0a0e1a"], [.45, "#14182b"], [.8, "#2a2333"], [1, "#3a2b2e"]]);
    stars(x, t, 4, 130);
    moon(x, W * .78, H * .2, 17);
    ridge(x, H * .62, 60, 7, "#0d1119");
    radioTower(x, W * .2, H * .62, 200, t);
    roofs(x, H * .86, 3, 90, "#080b10", "#ffb347", t, .22);
    streetlight(x, W * .42, H * .86, 80, "#ffb347", t);
    streetlight(x, W * .68, H * .86, 80, "#ffb347", t, 1);
    fog(x, H * .8, 50, t, 4, .07);
    thread(x, [W * .42 + 16, H * .86 - 76], [W * .55, H * .4], [W * .2, H * .62 - 200], "rgba(125,232,216,.5)", t, 3);
    thread(x, [W * .9, H * .8], [W * .7, H * .55], [W * .2, H * .62 - 190], "rgba(185,167,232,.4)", t, 8);
  };

  SC.street = (x, t, m) => { // chapter 1 cold open — Senna walks home
    sky(x, [[0, "#0b0f1c"], [.5, "#181a2c"], [.85, "#33252e"], [1, "#3d2a28"]]);
    stars(x, t, 2, 70);
    roofs(x, H * .72, 11, 110, "#0a0d13", "#ffc080", t, .3);
    x.fillStyle = "#10131a"; x.fillRect(0, H * .72, W, H); // street plane
    x.fillStyle = "#161a23"; x.fillRect(0, H * .72, W, 10);
    // sidewalk lines
    x.strokeStyle = "rgba(255,255,255,.05)"; x.lineWidth = 1;
    for (let i = 0; i < 9; i++) {
      const sx = ((i * 130 - (m.walk || 0) * 60) % (W + 130) + W + 130) % (W + 130) - 65;
      x.beginPath(); x.moveTo(sx, H * .74); x.lineTo(sx - 28, H); x.stroke();
    }
    for (let i = 0; i < 4; i++) {
      const sx = ((i * 270 - (m.walk || 0) * 60) % (W + 270) + W + 270) % (W + 270) - 100;
      streetlight(x, sx, H * .73, 95, "#ffb347", t, m.flicker ? 1 : 0);
    }
    fog(x, H * .7, 40, t, 5, .06);
    if (!m.nofigure) figure(x, W * .46, H * .85, 1.5, "senna", { t, ghost: m.fading });
    if (m.phoneGlow) glow(x, W * .46, H * .76, 30, "rgba(125,232,216,.35)");
  };

  SC.kitchen = (x, t) => {
    sky(x, [[0, "#191620"], [1, "#241d22"]]);
    // window with rain-dark dusk
    x.fillStyle = "#0c1322"; x.fillRect(W * .62, H * .14, 180, 150);
    x.strokeStyle = "#332a30"; x.lineWidth = 6; x.strokeRect(W * .62, H * .14, 180, 150);
    x.strokeStyle = "#332a30"; x.beginPath(); x.moveTo(W * .62 + 90, H * .14); x.lineTo(W * .62 + 90, H * .14 + 150); x.stroke();
    stars(x, t, 9, 12, H * .35);
    glow(x, W * .3, H * .25, 130, "rgba(255,190,120,.2)");
    x.fillStyle = "#3a2e26"; x.fillRect(W * .27, H * .2, 50, 16); // lamp
    x.fillStyle = "#171219"; x.fillRect(0, H * .68, W, H); // counter line
    x.fillStyle = "#231b20"; x.fillRect(W * .1, H * .58, W * .42, 14); // table
    x.fillRect(W * .14, H * .58, 10, H * .2); x.fillRect(W * .46, H * .58, 10, H * .2);
    figure(x, W * .2, H * .8, 1.6, "mom", { t });
    figure(x, W * .42, H * .8, 1.5, "moyi", { t });
    // the chair where no one sits
    x.strokeStyle = "rgba(158,207,255,.16)"; x.lineWidth = 2;
    x.strokeRect(W * .56, H * .62, 26, 34);
  };

  SC.room = (x, t, m) => { // Moyi's room — anchor scene
    sky(x, [[0, "#15131f"], [1, "#221c26"]]);
    glow(x, W * .26, H * .42, 110, "rgba(255,195,130,.25)");
    x.fillStyle = "#191420"; x.fillRect(0, H * .76, W, H);
    x.fillStyle = "#241c26"; x.fillRect(W * .12, H * .52, W * .3, 12); // desk
    x.fillRect(W * .14, H * .52, 8, H * .24); x.fillRect(W * .38, H * .52, 8, H * .24);
    x.fillStyle = "#322637"; x.fillRect(W * .2, H * .38, 46, 30); // lamp head approx
    // corkboard with sketches + one empty rectangle
    x.fillStyle = "#2c2231"; x.fillRect(W * .55, H * .2, 230, 130);
    for (let i = 0; i < 6; i++) {
      x.fillStyle = i === 4 ? "rgba(158,207,255,.07)" : "#cabfa8";
      const sx = W * .56 + (i % 3) * 74, sy = H * .22 + ((i / 3) | 0) * 62;
      x.fillRect(sx, sy, 56, 44);
      if (i === 4) { x.strokeStyle = "rgba(158,207,255,.4)"; x.setLineDash([3, 3]); x.strokeRect(sx, sy, 56, 44); x.setLineDash([]); }
      else { x.strokeStyle = "#7a7264"; x.strokeRect(sx + 8, sy + 8, 40, 6); x.strokeRect(sx + 8, sy + 20, 28, 6); }
    }
    if (m.mic) { x.fillStyle = "#3a3140"; x.fillRect(W * .3, H * .42, 6, 22); x.beginPath(); x.arc(W * .3 + 3, H * .4, 8, 0, 7); x.fill(); glow(x, W * .3 + 3, H * .4, 22, "rgba(125,232,216,.25)"); }
    figure(x, W * .3, H * .85, 1.7, "moyi", { t });
  };

  SC.bleachers = (x, t, m) => {
    sky(x, [[0, "#0a0e1a"], [.55, "#131a2a"], [1, "#1d2430"]]);
    stars(x, t, 5, 110); moon(x, W * .16, H * .18, 14);
    ridge(x, H * .6, 40, 3, "#0c1017");
    // field
    x.fillStyle = "#0e1620"; x.fillRect(0, H * .6, W, H);
    x.strokeStyle = "rgba(180,220,210,.07)"; x.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(0, H * (.66 + i * .06)); x.lineTo(W, H * (.66 + i * .06)); x.stroke(); }
    // flood light
    glow(x, W * .84, H * .2, 70, "rgba(220,235,255,.3)");
    x.strokeStyle = "#0a0d12"; x.lineWidth = 5;
    x.beginPath(); x.moveTo(W * .84, H * .6); x.lineTo(W * .84, H * .2); x.stroke();
    // bleachers
    x.fillStyle = "#10151d";
    for (let i = 0; i < 6; i++) x.fillRect(W * .18, H * .58 - i * 22, W * .5, 13);
    x.fillStyle = "#0b0f15";
    for (let i = 0; i < 7; i++) x.fillRect(W * .2 + i * 70, H * .58 - 110, 6, 116);
    // Senna's seat — third row, fourth seat. a thread waits inside it.
    const sx = W * .42, sy = H * .58 - 2 * 22 - 6;
    if (m.thread) {
      glow(x, sx, sy, 30 + Math.sin(t * 2) * 6, "rgba(125,232,216,.4)");
      thread(x, [sx, sy], [sx + 60, sy - 90], [sx + 150, sy - 30], "rgba(125,232,216,.75)", t, 1);
    } else glow(x, sx, sy, 14, "rgba(158,207,255,.18)", .6 + Math.sin(t * 1.4) * .3);
    if (!m.alone) figure(x, W * .3, H * .88, 1.7, "moyi", { t });
  };

  SC.schoolVeil = (x, t, m) => { // first accidental Veildive
    sky(x, [[0, "#120f1e"], [.6, "#16202b"], [1, "#1d2b33"]]);
    // corridor perspective
    const vx = W * .5, vy = H * .44;
    x.fillStyle = "#0e1420"; x.beginPath(); x.moveTo(0, H); x.lineTo(vx - 160, vy + 60); x.lineTo(vx + 160, vy + 60); x.lineTo(W, H); x.fill();
    x.fillStyle = "#121a26"; x.beginPath(); x.moveTo(0, 0); x.lineTo(vx - 160, vy - 120); x.lineTo(vx + 160, vy - 120); x.lineTo(W, 0); x.fill();
    // lockers, leaking light
    for (let s = -1; s <= 1; s += 2) {
      for (let i = 0; i < 7; i++) {
        const d = i / 7, lx = vx + s * (160 + (1 - d) * 360), lw = 36 * (1 - d * .7);
        const ly = vy - 100 * (1 - d * .4), lh = 170 * (1 - d * .55);
        x.fillStyle = "#15202c"; x.fillRect(lx - lw / 2, ly, lw, lh);
        const leak = .25 + .5 * Math.abs(Math.sin(t * 1.2 + i * 2 + s));
        x.strokeStyle = `rgba(125,232,216,${leak * .5})`; x.lineWidth = 1;
        x.strokeRect(lx - lw / 2, ly, lw, lh);
        glow(x, lx, ly + lh * .4, 16, "rgba(125,232,216,.3)", leak);
      }
    }
    glow(x, vx, vy, 120, "rgba(185,167,232,.18)");
    fog(x, H * .8, 60, t, 8, .09, "150,200,210");
    if (m.paris) { // the staircase re-architects itself out of the floor
      x.fillStyle = "#1b2735";
      for (let i = 0; i < 5; i++) x.fillRect(vx - 40 + i * 22, H * .78 - i * 16, 70 - i * 8, 8);
      figure(x, vx + 64, H * .78 - 4 * 16 - 6, 1.5, "paris", { t });
      glow(x, vx + 64, H * .68, 50, "rgba(255,179,71,.25)");
    }
    if (!m.nomoyi) figure(x, W * .34, H * .9, 1.8, "moyi", { t });
  };

  SC.mallExt = (x, t) => {
    sky(x, [[0, "#0d111e"], [.6, "#1a1c2c"], [1, "#2c2430"]]);
    stars(x, t, 11, 80);
    x.fillStyle = "#0c0f16"; x.fillRect(W * .12, H * .34, W * .76, H * .34);
    x.fillStyle = "#11151e"; x.fillRect(W * .3, H * .26, W * .4, H * .1);
    // sign with letters missing
    x.font = "22px monospace"; x.fillStyle = "rgba(255,179,71,.75)";
    const txt = "GREYHOLL W GALLER A";
    [...txt].forEach((ch, i) => {
      const a = U.hash(i * 3) < .15 ? .12 : (.6 + .4 * Math.abs(Math.sin(t * 2 + i)));
      x.globalAlpha = a; x.fillText(ch, W * .335 + i * 15, H * .325);
    });
    x.globalAlpha = 1;
    x.fillStyle = "#0a0d13"; x.fillRect(0, H * .68, W, H); // parking sea
    x.strokeStyle = "rgba(255,255,255,.04)";
    for (let i = 0; i < 14; i++) { x.beginPath(); x.moveTo(i * 75, H * .72); x.lineTo(i * 75 - 30, H); x.stroke(); }
    streetlight(x, W * .14, H * .7, 90, "#ffb347", t, 1);
    streetlight(x, W * .82, H * .7, 90, "#ffb347", t);
    figure(x, W * .44, H * .88, 1.6, "moyi", { t });
    figure(x, W * .52, H * .88, 1.6, "paris", { t });
    fog(x, H * .66, 36, t, 4, .07);
  };

  SC.mallVeil = (x, t, m) => { // the Galleria, open for business
    sky(x, [[0, "#171225"], [.5, "#1b2430"], [1, "#23303a"]]);
    glow(x, W * .5, H * .16, 220, "rgba(185,167,232,.16)");
    // skylight
    x.strokeStyle = "rgba(185,167,232,.25)"; x.lineWidth = 2;
    x.beginPath(); x.arc(W * .5, H * .05, 180, 0.15, Math.PI - 0.15); x.stroke();
    // three balcony floors
    const signs = m.signs || ["APOLOGIES", "CONFESSIONS", "GOODBYES", "u up?", "THANK YOUS", "I MISS YOU"];
    for (let f = 0; f < 3; f++) {
      const fy = H * (.3 + f * .19);
      x.fillStyle = "#141c28"; x.fillRect(0, fy, W, 12);
      x.strokeStyle = "rgba(125,232,216,.12)"; x.lineWidth = 1;
      for (let i = 0; i < 24; i++) { x.beginPath(); x.moveTo(i * 42, fy); x.lineTo(i * 42, fy - 26); x.stroke(); }
      // storefronts
      for (let sN = 0; sN < 4; sN++) {
        const sx = W * (.06 + sN * .24), idx = (f * 4 + sN) % signs.length;
        const pulse = .5 + .5 * Math.abs(Math.sin(t * .9 + idx));
        x.fillStyle = "#101722"; x.fillRect(sx, fy - 64, 150, 62);
        glow(x, sx + 75, fy - 32, 60, f % 2 ? "rgba(125,232,216,.13)" : "rgba(232,157,180,.13)", pulse);
        x.font = "10px monospace"; x.textAlign = "center";
        x.fillStyle = f % 2 ? `rgba(125,232,216,${.5 + pulse * .4})` : `rgba(232,157,180,${.5 + pulse * .4})`;
        x.fillText(signs[idx], sx + 75, fy - 50); x.textAlign = "left";
        x.strokeStyle = "rgba(160,200,220,.1)"; x.strokeRect(sx, fy - 64, 150, 62);
      }
    }
    // ground + escalator
    x.fillStyle = "#0e141d"; x.fillRect(0, H * .82, W, H);
    x.strokeStyle = "rgba(160,200,220,.2)"; x.lineWidth = 2;
    x.beginPath(); x.moveTo(W * .68, H * .82); x.lineTo(W * .82, H * .49); x.stroke();
    for (let i = 0; i < 9; i++) {
      const tt = (i / 9 + t * .05) % 1;
      x.fillStyle = "rgba(160,200,220,.25)";
      x.fillRect(W * (.68 + .14 * tt) - 9, H * (.82 - .33 * tt), 18, 3);
    }
    if (m.clerk) { figure(x, W * .26, H * .94, 1.7, "hollow", { t }); glow(x, W * .26, H * .86, 30, "rgba(232,228,218,.12)"); }
    figure(x, W * .46, H * .96, 1.8, "moyi", { t });
    figure(x, W * .54, H * .96, 1.8, "paris", { t });
  };

  SC.foodcourt = (x, t, m) => { // amphitheater of hold-music; the Backlog
    sky(x, [[0, "#101325"], [.6, "#15222e"], [1, "#1b2f38"]]);
    glow(x, W * .5, H * .3, 260, "rgba(140,200,255,.1)");
    // tiered seating arcs
    x.strokeStyle = "rgba(160,200,220,.14)"; x.lineWidth = 9;
    for (let i = 0; i < 5; i++) { x.beginPath(); x.arc(W * .5, H * 1.15, 290 + i * 52, Math.PI * 1.12, Math.PI * 1.88); x.stroke(); }
    // the Backlog: a glacier of seven years of unsent apologies
    const gx = W * .5, gy = H * .56, shiver = m.calving ? Math.sin(t * 14) * 2.5 : 0;
    x.save(); x.translate(shiver, 0);
    x.fillStyle = "rgba(150,205,235,.16)";
    x.beginPath();
    x.moveTo(gx - 190, gy + 90); x.lineTo(gx - 120, gy - 80); x.lineTo(gx - 40, gy - 30);
    x.lineTo(gx + 10, gy - 130); x.lineTo(gx + 90, gy - 40); x.lineTo(gx + 170, gy - 95);
    x.lineTo(gx + 210, gy + 90); x.closePath(); x.fill();
    x.strokeStyle = "rgba(190,230,255,.4)"; x.lineWidth = 1.4; x.stroke();
    // strata of letters
    x.font = "8px monospace"; x.fillStyle = "rgba(220,240,255,.35)";
    for (let i = 0; i < 40; i++) {
      const lx = gx - 170 + U.hash(i * 5.1) * 350, ly = gy + 80 - U.hash(i * 8.7) * 175;
      x.save(); x.translate(lx, ly); x.rotate((U.hash(i) - .5) * .8);
      x.fillText("dear theo —", 0, 0); x.restore();
    }
    glow(x, gx, gy - 20, 150, "rgba(160,215,245,.14)", .7 + Math.sin(t) * .25);
    x.restore();
    x.fillStyle = "#0d131c"; x.fillRect(0, H * .84, W, H);
    figure(x, W * .3, H * .95, 1.8, "moyi", { t });
    figure(x, W * .7, H * .95, 1.8, "paris", { t });
    if (m.sheriff) figure(x, W * .14, H * .95, 1.7, "sheriff", { t });
  };

  SC.towerClimb = (x, t, m) => { // ch3: inside the broadcast
    const mode = m.mode || "adoration";
    const warm = mode === "adoration";
    sky(x, warm ? [[0, "#1a1228"], [.6, "#241a33"], [1, "#332040"]] : [[0, "#101620"], [.6, "#0f2028"], [1, "#122830"]]);
    // signal rings rising
    x.strokeStyle = warm ? "rgba(255,158,207,.16)" : "rgba(125,232,216,.14)";
    for (let i = 0; i < 6; i++) {
      const rr = ((t * 26 + i * 70) % 420);
      x.lineWidth = 1.4; x.globalAlpha = 1 - rr / 420;
      x.beginPath(); x.arc(W * .5, H * .78, rr, Math.PI, Math.PI * 2); x.stroke();
    }
    x.globalAlpha = 1;
    // lattice core
    radioTower(x, W * .5, H * .95, 360, t);
    // platforms by mode
    const tiers = m.tier || 0;
    for (let i = 0; i < 4; i++) {
      const py = H * .82 - i * 88, on = i <= tiers;
      if (warm) {
        x.fillStyle = on ? "rgba(255,158,207,.3)" : "rgba(255,158,207,.08)";
        x.fillRect(W * (.5 + (i % 2 ? .1 : -.27)), py, 160, 7);
      } else {
        x.strokeStyle = on ? "rgba(125,232,216,.5)" : "rgba(125,232,216,.1)"; x.lineWidth = 2;
        for (let k = 0; k < 5; k++) { // spikes of clipped quotes
          const qx = W * (.5 + (i % 2 ? .12 : -.3)) + k * 34;
          x.beginPath(); x.moveTo(qx, py + 9); x.lineTo(qx + 8, py - 16); x.lineTo(qx + 16, py + 9); x.stroke();
        }
      }
    }
    // chat ghosts drifting (handled in fx too); faint here
    x.font = "9px monospace";
    for (let i = 0; i < 10; i++) {
      const cy = (H - ((t * 22 + i * 67) % H)), cx = W * (.12 + U.hash(i * 3) * .76);
      x.fillStyle = warm ? "rgba(255,190,220,.3)" : "rgba(160,230,220,.28)";
      x.fillText(warm ? U.pick(["we love u", "jun!!", "<3", "stay forever", "good night jun"]) : U.pick(["she's faking", "do the thing", "L", "clip it", "say it again"]), cx, cy);
    }
    figure(x, W * .38, H * .93, 1.7, "moyi", { t });
    figure(x, W * .6, H * .93, 1.7, "paris", { t });
  };

  SC.towerTop = (x, t, m) => { // Juniper, hosting forever
    sky(x, [[0, "#1c1430"], [.55, "#241a36"], [1, "#2c2040"]]);
    glow(x, W * .5, H * .42, 240, "rgba(255,158,207,.13)");
    // ring light — her halo
    x.strokeStyle = "rgba(255,210,230,.7)"; x.lineWidth = 5;
    x.beginPath(); x.arc(W * .5, H * .5, 86, 0, 7); x.stroke();
    glow(x, W * .5, H * .5, 130, "rgba(255,170,210,.22)");
    figure(x, W * .5, H * .67, 1.9, "juniper", { t });
    // chat wall
    x.font = "9px monospace";
    for (let i = 0; i < 26; i++) {
      const cy = (H - ((t * 30 + i * 41) % (H * .9))), side = i % 2;
      const cx = side ? W * .8 + U.hash(i) * 90 : W * .04 + U.hash(i) * 90;
      x.fillStyle = `rgba(190,220,255,${.16 + U.hash(i * 7) * .3})`;
      x.fillText(U.pick(["jun pls", "don't go", "one more song", "we're here", "always", "u ok?", "POG", "stay"]), cx, cy);
    }
    if (m.endscreen) { // Paris drafts an End Screen
      x.strokeStyle = "rgba(255,179,71,.8)"; x.lineWidth = 2;
      x.strokeRect(W * .3, H * .2, W * .4, H * .18);
      x.font = "16px monospace"; x.textAlign = "center";
      x.fillStyle = "rgba(255,217,160,.9)";
      x.fillText("STREAM ENDING", W * .5, H * .27);
      x.font = "10px monospace";
      x.fillText("thank you for watching. you can go to sleep now.", W * .5, H * .32);
      x.textAlign = "left";
      glow(x, W * .5, H * .29, 110, "rgba(255,179,71,.15)");
    }
    figure(x, W * .3, H * .92, 1.7, "moyi", { t });
    figure(x, W * .7, H * .92, 1.7, "paris", { t });
  };

  SC.houseVeil = (x, t, m) => { // ch4: the house he built twice
    sky(x, [[0, "#100d1c"], [.6, "#181527"], [1, "#201a2c"]]);
    fog(x, H * .75, 80, t, 5, .1, "150,170,210");
    const drawHouse = (hx, hy, s, alpha, lit) => {
      x.save(); x.translate(hx, hy); x.scale(s, s); x.globalAlpha = alpha;
      x.fillStyle = "#0d111b";
      x.fillRect(-70, -64, 140, 64);
      x.beginPath(); x.moveTo(-80, -64); x.lineTo(0, -110); x.lineTo(80, -64); x.closePath(); x.fill();
      x.fillRect(28, -100, 12, 30); // chimney
      // windows: the argument loops behind them
      const flash = lit ? .35 + .65 * (Math.sin(t * 3.1 + hx) > .55 ? 1 : .12) : .1;
      x.fillStyle = `rgba(255,190,130,${flash})`;
      x.fillRect(-52, -48, 24, 20); x.fillRect(10, -48, 24, 20);
      x.fillStyle = "#0a0e16"; x.fillRect(-12, -34, 22, 34); // door
      x.globalAlpha = 1; x.restore();
    };
    // ghost drafts behind
    drawHouse(W * .26, H * .5, .55, .25, false);
    drawHouse(W * .76, H * .46, .5, .2, false);
    drawHouse(W * .64, H * .56, .62, .3, false);
    // the present draft
    drawHouse(W * .47, H * .72, 1.25, 1, m.lit !== false);
    glow(x, W * .47, H * .6, 170, "rgba(185,167,232,.12)");
    x.fillStyle = "#0c0f18"; x.fillRect(0, H * .82, W, H);
    if (m.true) { // the true version refuses to fall
      x.strokeStyle = "rgba(232,228,218,.5)"; x.lineWidth = 1.2;
      x.strokeRect(W * .47 - 88, H * .72 - 80, 176, 80);
    }
    if (!m.empty) { figure(x, W * .2, H * .94, 1.8, "paris", { t }); figure(x, W * .12, H * .94, 1.7, "moyi", { t }); }
  };

  SC.basement = (x, t, m) => { // the Counterpart, at rest
    sky(x, [[0, "#0a0910"], [1, "#141019"]]);
    glow(x, W * .5, H * .35, 200, "rgba(196,106,106,.08)");
    // chains up into dark
    x.strokeStyle = "rgba(180,180,190,.3)"; x.lineWidth = 3;
    x.beginPath(); x.moveTo(W * .5, 0); x.lineTo(W * .5, H * .3); x.stroke();
    x.lineWidth = 1;
    for (let i = 0; i < 12; i++) { x.beginPath(); x.ellipse(W * .5, i * H * .025, 5, 8, 0, 0, 7); x.stroke(); }
    // the wrecking ball
    const swing = m.swing ? Math.sin(t * 1.6) * (m.swing * 60) : 0;
    x.save(); x.translate(swing, 0);
    x.fillStyle = "#1c1a22"; x.beginPath(); x.arc(W * .5, H * .44, 64, 0, 7); x.fill();
    x.strokeStyle = "rgba(232,228,218,.25)"; x.lineWidth = 2; x.stroke();
    glow(x, W * .42, H * .38, 30, "rgba(232,228,218,.1)");
    // his own handwriting
    x.font = "italic 12px serif"; x.fillStyle = "rgba(232,228,218,.75)"; x.textAlign = "center";
    x.fillText(m.label || "do not feel this", W * .5, H * .45); x.textAlign = "left";
    x.restore();
    x.fillStyle = "#0b0a10"; x.fillRect(0, H * .8, W, H);
    fog(x, H * .82, 40, t, 3, .07, "120,110,130");
    if (!m.empty) figure(x, W * .26, H * .93, 1.8, "paris", { t });
    if (m.moyi) figure(x, W * .72, H * .93, 1.7, "moyi", { t });
  };

  SC.clinic = (x, t, m) => { // Stillwater Initiative, real world
    sky(x, [[0, "#222831"], [.7, "#39414c"], [1, "#4c5560"]]); // an overcast, reasonable daylight
    x.fillStyle = "#e2e6e4"; x.fillRect(W * .2, H * .3, W * .6, H * .42);
    x.fillStyle = "#cfd8d4"; x.fillRect(W * .2, H * .3, W * .6, 16);
    x.font = "16px monospace"; x.textAlign = "center";
    x.fillStyle = "#5c7a72";
    x.fillText("S T I L L W A T E R", W * .5, H * .42);
    x.font = "9px monospace"; x.fillStyle = "#7d908a";
    x.fillText("a wellness initiative · calm is a choice", W * .5, H * .46);
    x.textAlign = "left";
    x.fillStyle = "#aebfc4"; x.fillRect(W * .44, H * .54, 110, 90); // glass door
    glow(x, W * .5, H * .58, 90, "rgba(190,220,210,.25)");
    x.fillStyle = "#23282f"; x.fillRect(0, H * .72, W, H);
    // queue of people, very still
    for (let i = 0; i < 5; i++) figure(x, W * (.6 - i * .07), H * .87, 1.5, i < (m.hollowN || 2) ? "hollow" : U.pick(["mom"]) , { t: 0 });
    figure(x, W * .16, H * .9, 1.7, "moyi", { t });
    figure(x, W * .24, H * .9, 1.7, "paris", { t });
  };

  SC.cathedral = (x, t, m) => { // the Choir
    sky(x, [[0, "#0e1018"], [.5, "#141a26"], [1, "#1a2430"]]);
    // arches of filing cabinets
    x.strokeStyle = "rgba(170,200,215,.2)"; x.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      const ax = W * (.5 + (i - 2) * .17), s = 1 - Math.abs(i - 2) * .14;
      x.beginPath(); x.moveTo(ax - 90 * s, H); x.quadraticCurveTo(ax, H * (.92 - .8 * s), ax + 90 * s, H); x.stroke();
    }
    // light columns
    for (let i = 0; i < 3; i++) {
      const lx = W * (.3 + i * .2);
      const g = x.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "rgba(220,235,240,.12)"); g.addColorStop(1, "rgba(220,235,240,0)");
      x.fillStyle = g; x.beginPath();
      x.moveTo(lx - 14, 0); x.lineTo(lx + 14, 0); x.lineTo(lx + 50, H * .9); x.lineTo(lx - 50, H * .9); x.fill();
    }
    // the Hollowed, rows of them, singing one note
    x.fillStyle = "#0d121b"; x.fillRect(0, H * .78, W, H);
    for (let r = 0; r < 3; r++)
      for (let i = 0; i < 9; i++) {
        const hx = W * (.16 + i * .085) + (r % 2) * 20, hy = H * (.84 + r * .055);
        figure(x, hx, hy, 1.25 + r * .14, "hollow", { t: 0 });
        if (((i + r * 3) % 4) === ((t * 1.2) | 0) % 4) glow(x, hx, hy - 40, 12, "rgba(232,228,218,.2)");
      }
    glow(x, W * .5, H * .3, 220, "rgba(220,235,240,.07)", .8 + Math.sin(t * .8) * .2);
    figure(x, W * .07, H * .95, 1.8, "moyi", { t });
    if (m.mom) { figure(x, W * .5, H * .9, 1.55, "mom", { t: 0 }); glow(x, W * .5, H * .82, 26, "rgba(216,180,160,.2)"); }
  };

  SC.labyrinth = (x, t, m) => { // the Invigilator's Labyrinth
    sky(x, [[0, "#10141c"], [.6, "#161d28"], [1, "#1b2530"]]);
    // fluorescent panels to the horizon
    for (let i = 0; i < 6; i++) {
      const py = H * .1 + i * 14, pw = 200 - i * 26;
      x.fillStyle = `rgba(210,230,235,${.16 - i * .02})`;
      x.fillRect(W * .5 - pw / 2, py, pw, 4);
    }
    // desks grid in perspective
    for (let r = 0; r < 6; r++) {
      const d = r / 6, dy = H * (.42 + d * .5), s = .4 + d * .9, n = 7 - r % 2;
      for (let i = 0; i < n; i++) {
        const dx = W * .5 + (i - (n - 1) / 2) * (90 * s);
        x.fillStyle = "#141b26"; x.fillRect(dx - 22 * s, dy - 14 * s, 44 * s, 14 * s);
        x.fillStyle = "rgba(220,230,235,.5)"; x.fillRect(dx - 14 * s, dy - 17 * s, 28 * s, 3 * s); // paper
        if (m.futures && U.hash(r * 9 + i) < .3) { // projected futures, grading
          x.globalAlpha = .35; figure(x, dx, dy + 8 * s, .9 * s + .4, "hollow", { t: 0 }); x.globalAlpha = 1;
        }
      }
    }
    // hanging clocks, all different times
    for (let i = 0; i < 4; i++) {
      const cx = W * (.2 + i * .2), cy = H * .16 + Math.sin(t * .7 + i) * 4;
      x.strokeStyle = "rgba(190,210,220,.4)"; x.lineWidth = 1.2;
      x.beginPath(); x.moveTo(cx, 0); x.lineTo(cx, cy); x.stroke();
      x.fillStyle = "#10161f"; x.beginPath(); x.arc(cx, cy + 10, 11, 0, 7); x.fill(); x.stroke();
      const a1 = t * (.2 + i * .13), a2 = -t * (.4 + i * .07);
      x.beginPath(); x.moveTo(cx, cy + 10); x.lineTo(cx + Math.cos(a1) * 7, cy + 10 + Math.sin(a1) * 7); x.stroke();
      x.beginPath(); x.moveTo(cx, cy + 10); x.lineTo(cx + Math.cos(a2) * 4.5, cy + 10 + Math.sin(a2) * 4.5); x.stroke();
    }
    if (m.rubrics) { // scantron-faced wardens
      for (let i = 0; i < (m.rubricN || 2); i++) {
        const rx = W * (.25 + .5 * Math.abs(Math.sin(t * .3 + i * 2.1))), ry = H * .68;
        figure(x, rx, ry, 1.7, "hollow", { t: 0, pale: true });
        // scantron face
        x.fillStyle = "#e6e2d6"; x.fillRect(rx - 6, ry - 78, 12, 16);
        x.fillStyle = "#3a3f48";
        for (let b = 0; b < 4; b++) x.beginPath(), x.arc(rx - 3 + (b % 2) * 6, ry - 74 + ((b / 2) | 0) * 7, 1.6, 0, 7), x.fill();
        // scan cone
        const sweep = Math.sin(t * 1.1 + i * 2.1) * .9;
        const g = x.createLinearGradient(rx, ry - 70, rx + sweep * 160, ry + 40);
        g.addColorStop(0, "rgba(230,226,214,.25)"); g.addColorStop(1, "rgba(230,226,214,0)");
        x.fillStyle = g; x.beginPath();
        x.moveTo(rx, ry - 70); x.lineTo(rx + sweep * 160 - 40, ry + 30); x.lineTo(rx + sweep * 160 + 40, ry + 30); x.fill();
      }
    }
    figure(x, W * .16, H * .92, 1.75, m.lead === "paris" ? "paris" : "moyi", { t });
    figure(x, W * .26, H * .92, 1.7, m.lead === "paris" ? "moyi" : "paris", { t });
    if (m.asha) { figure(x, W * .5, H * .62, 1.3, "asha", { t: 0 }); glow(x, W * .5, H * .56, 40, "rgba(255,224,138,.18)"); }
  };

  SC.hall = (x, t, m) => { // Hall of Withdrawn Consent
    sky(x, [[0, "#0d101c"], [.6, "#131a28"], [1, "#182230"]]);
    // infinite card-catalog wall
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 16; c++) {
        const dx = c * 62 + (r % 2) * 14 - 10, dy = H * .08 + r * 48;
        x.fillStyle = "#121a26"; x.fillRect(dx, dy, 54, 40);
        x.strokeStyle = "rgba(150,180,200,.14)"; x.strokeRect(dx, dy, 54, 40);
        x.fillStyle = "rgba(190,210,225,.25)"; x.fillRect(dx + 18, dy + 18, 18, 3.4);
      }
    // one drawer open, glowing — Senna's file
    const ox = W * .55, oy = H * .42;
    x.fillStyle = "#1a2738"; x.fillRect(ox, oy, 54, 40);
    x.fillStyle = "#223349"; x.fillRect(ox - 16, oy + 6, 70, 30);
    glow(x, ox + 18, oy + 18, 70, "rgba(158,207,255,.35)", .8 + Math.sin(t * 2) * .2);
    x.fillStyle = "#cfe2f4"; x.fillRect(ox - 8, oy + 9, 50, 22);
    figure(x, W * .3, H * .9, 1.8, "moyi", { t });
    figure(x, W * .42, H * .9, 1.8, "paris", { t });
    fog(x, H * .86, 40, t, 4, .06, "140,170,200");
  };

  SC.fort = (x, t, m) => { // the blanket fort, unweaving
    const un = m.unweave || 0;
    sky(x, [[0, "#161122"], [1, "#241b2c"]]);
    // draped blankets
    x.fillStyle = "#241e33";
    x.beginPath(); x.moveTo(0, H * .1); x.quadraticCurveTo(W * .3, H * .3, W * .5, H * .12);
    x.quadraticCurveTo(W * .7, H * .3, W, H * .08); x.lineTo(W, 0); x.lineTo(0, 0); x.fill();
    x.fillStyle = "#2c2240";
    x.beginPath(); x.moveTo(0, H * .1); x.quadraticCurveTo(W * .2, H * .65, W * .12, H); x.lineTo(0, H); x.fill();
    x.beginPath(); x.moveTo(W, H * .08); x.quadraticCurveTo(W * .8, H * .6, W * .88, H); x.lineTo(W, H); x.fill();
    // string lights
    for (let i = 0; i < 12; i++) {
      const lx = W * .08 + i * (W * .07), ly = H * .2 + Math.sin(i * 1.2) * 18;
      const dead = U.hash(i * 3.3) < un;
      glow(x, lx, ly, dead ? 4 : 13, dead ? "rgba(120,110,120,.1)" : "rgba(255,214,150,.5)");
      x.fillStyle = dead ? "#3a3340" : "#ffd696"; x.beginPath(); x.arc(lx, ly, 2.2, 0, 7); x.fill();
    }
    // unweaving threads pulling up and away
    x.strokeStyle = "rgba(158,207,255,.35)"; x.lineWidth = 1;
    for (let i = 0; i < un * 14; i++) {
      const sx = U.hash(i * 7.7) * W, sy = H * (.1 + U.hash(i * 3.1) * .25);
      x.beginPath(); x.moveTo(sx, sy);
      x.quadraticCurveTo(sx + 30, sy - 60 - ((t * 30 + i * 40) % 80), sx + 10, sy - 130 - ((t * 30 + i * 40) % 80));
      x.stroke();
    }
    // low table, two cushions
    x.fillStyle = "#191322"; x.fillRect(0, H * .8, W, H);
    x.fillStyle = "#322840"; x.fillRect(W * .38, H * .68, 200, 12);
    x.fillStyle = "#3a2c44"; x.beginPath(); x.ellipse(W * .3, H * .85, 46, 16, 0, 0, 7); x.fill();
    x.beginPath(); x.ellipse(W * .68, H * .85, 46, 16, 0, 0, 7); x.fill();
    figure(x, W * .3, H * .82, 1.7, "moyi", { t });
    if (m.withdrawal) {
      x.globalAlpha = .85; figure(x, W * .68, H * .82, 1.7, "senna", { t, ghost: true, blurFace: G.state.d.sennaFaceLost }); x.globalAlpha = 1;
      glow(x, W * .68, H * .72, 60, "rgba(158,207,255,.18)");
    }
  };

  SC.festival = (x, t, m) => { // the Calm Festival
    sky(x, [[0, "#1b1626"], [.5, "#2c2133"], [1, "#43293a"]]);
    stars(x, t, 21, 50);
    roofs(x, H * .6, 17, 70, "#0d1016", "#ffc080", t, .18);
    // stage + banner
    x.fillStyle = "#141019"; x.fillRect(W * .3, H * .42, W * .4, H * .2);
    x.fillStyle = "#d8d4ca"; x.fillRect(W * .34, H * .36, W * .32, 26);
    x.font = "13px monospace"; x.textAlign = "center"; x.fillStyle = "#5c7a72";
    x.fillText("C A L M — a gift to greyhollow", W * .5, H * .395); x.textAlign = "left";
    // strings of pale lanterns
    for (let i = 0; i < 16; i++) {
      const lx = W * (.08 + i * .056), ly = H * .3 + Math.sin(i * .9) * 14;
      glow(x, lx, ly, 10, "rgba(232,228,218,.4)");
    }
    // a crowd, too still
    x.fillStyle = "#0d0f15"; x.fillRect(0, H * .62, W, H);
    for (let i = 0; i < 24; i++)
      figure(x, W * (.06 + U.hash(i * 13.7) * .88), H * (.78 + U.hash(i * 5.1) * .16), 1.1 + U.hash(i) * .5, U.hash(i * 31) < (m.hollowRatio || .4) ? "hollow" : "mom", { t: 0 });
    fog(x, H * .68, 36, t, 5, .08, "200,200,210");
  };

  SC.sanctuary = (x, t, m) => { // ch8: the largest structure of his life
    sky(x, [[0, "#120f20"], [.5, "#181830"], [1, "#1d2438"]]);
    stars(x, t, 31, 60);
    const p = m.progress != null ? m.progress : 1, broken = m.broken || 0;
    // ribbed shell
    for (let i = 0; i < 9; i++) {
      const on = i / 9 < p, dead = i / 9 < broken;
      const rx = W * .5, ry = H * .88, rr = 120 + i * 38;
      x.strokeStyle = dead ? "rgba(196,106,106,.25)" : on ? "rgba(255,179,71,.5)" : "rgba(255,179,71,.08)";
      x.lineWidth = on && !dead ? 2.6 : 1.4;
      if (dead) x.setLineDash([6, 9]);
      x.beginPath(); x.arc(rx, ry, rr, Math.PI * 1.06, Math.PI * 1.94); x.stroke();
      x.setLineDash([]);
    }
    glow(x, W * .5, H * .55, 250, m.broken ? "rgba(196,106,106,.1)" : "rgba(255,179,71,.12)", .8 + Math.sin(t * 1.3) * .2);
    // sheltered memories: little lights inside
    for (let i = 0; i < 40 * p; i++) {
      const a = Math.PI * (1.1 + U.hash(i * 3.7) * .8), rr = 40 + U.hash(i * 9.1) * 240;
      const lx = W * .5 + Math.cos(a) * rr, ly = H * .88 + Math.sin(a) * rr;
      if (m.scatter) { // blowing away like ash
        const dx = ((t * 40 + i * 13) % 300);
        glow(x, lx + dx, ly - dx * .6, 5, "rgba(232,228,218,.5)", Math.max(0, 1 - dx / 220));
      } else glow(x, lx, ly, 5 + Math.sin(t * 2 + i) * 2, "rgba(255,224,170,.55)");
    }
    x.fillStyle = "#0e1018"; x.fillRect(0, H * .9, W, H);
    if (m.quiet) figure(x, W * .5, H * .87, 1.9, "quiet", { t });
    if (!m.empty) { figure(x, W * .2, H * .97, 1.8, "paris", { t }); figure(x, W * .3, H * .97, 1.7, "moyi", { t }); }
  };

  SC.deep = (x, t, m) => { // the deep Veil
    sky(x, [[0, "#0a0a14"], [.5, "#10101f"], [1, "#141527"]]);
    // a horizon that is also a floor — inverted town reflection
    x.save(); x.globalAlpha = .2; x.translate(0, H * .95); x.scale(1, -.5);
    roofs(x, 0, 3, 90, "#1a2233", "#7de8d8", t, .1);
    x.restore();
    // floating islands of archived rooms
    for (let i = 0; i < 5; i++) {
      const ix = W * (.12 + i * .19), iy = H * (.3 + Math.sin(t * .3 + i * 1.7) * .03 + U.hash(i * 7) * .2);
      x.fillStyle = "#11131f";
      x.beginPath(); x.ellipse(ix, iy + 26, 64, 13, 0, 0, 7); x.fill();
      x.fillStyle = "#161a2a"; x.fillRect(ix - 28, iy - 22, 56, 44);
      x.strokeStyle = "rgba(125,232,216,.2)"; x.strokeRect(ix - 28, iy - 22, 56, 44);
      glow(x, ix, iy, 36, "rgba(125,232,216,.07)");
      // a door on each island
      x.fillStyle = "#0c0e18"; x.fillRect(ix - 8, iy - 8, 16, 30);
      x.fillStyle = "rgba(232,228,218,.4)"; x.fillRect(ix + 4, iy + 6, 2, 2);
    }
    fog(x, H * .6, 90, t, 3, .05, "150,170,220");
    stars(x, t * .4, 41, 120, H);
    if (m.moyis) for (let i = 0; i < 3; i++) figure(x, W * (.35 + i * .15), H * .8, 1.6, "moyi", { t: t + i * 9, rim: ["#7de8d8", "#e89db4", "#b9a7e8"][i] });
    else if (!m.empty) figure(x, W * .5, H * .82, 1.7, "moyi", { t });
    if (m.door) { // a door with her name, half-stenciled
      x.fillStyle = "#10121d"; x.fillRect(W * .72, H * .5, 70, 130);
      x.strokeStyle = "rgba(232,228,218,.6)"; x.strokeRect(W * .72, H * .5, 70, 130);
      x.font = "12px monospace"; x.textAlign = "center"; x.fillStyle = "rgba(232,228,218,.85)";
      x.fillText("MO", W * .72 + 35, H * .5 + 60);
      x.globalAlpha = .25; x.fillText("YI", W * .72 + 35, H * .5 + 76); x.globalAlpha = 1;
      x.textAlign = "left";
      glow(x, W * .72 + 35, H * .56, 60, "rgba(232,228,218,.12)");
    }
    if (m.quiet) figure(x, W * .26, H * .68, 1.7, "quiet", { t });
  };

  SC.road = (x, t, m) => { // Paris's honest road
    sky(x, [[0, "#0a0a14"], [1, "#12101e"]]);
    stars(x, t * .5, 77, 90, H * .5);
    const n = m.bricks || 0;
    // road into the dark, one true brick at a time
    for (let i = 0; i < 40; i++) {
      const d = i / 40, by = H * .9 - d * H * .52, bw = 120 * (1 - d * .82), laid = i < n;
      x.fillStyle = laid ? `rgba(255,179,71,${.5 - d * .35})` : "rgba(255,255,255,.025)";
      x.fillRect(W * .5 - bw / 2, by, bw, 7 * (1 - d * .7));
      if (laid && i === n - 1) glow(x, W * .5, by, 30, "rgba(255,179,71,.3)");
    }
    glow(x, W * .5, H * .34, 60, "rgba(125,232,216,.1)", .6 + Math.sin(t) * .3);
    figure(x, W * .5, H * .96, 1.9, "paris", { t });
    fog(x, H * .5, 70, t, 2, .05, "120,140,190");
  };

  SC.towerFinale = (x, t, m) => { // both worlds in the same shot
    // left: real dusk. right: the Veil. one tower between.
    const g = x.createLinearGradient(0, 0, W, 0);
    g.addColorStop(0, "#2c2133"); g.addColorStop(.42, "#1c1830"); g.addColorStop(.58, "#15202b"); g.addColorStop(1, "#122830");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    const g2 = x.createLinearGradient(0, 0, 0, H);
    g2.addColorStop(0, "rgba(0,0,0,0)"); g2.addColorStop(1, "rgba(8,10,16,.8)");
    x.fillStyle = g2; x.fillRect(0, 0, W, H);
    stars(x, t, 51, 120);
    // left town / right inverted town
    x.save(); x.beginPath(); x.rect(0, 0, W * .5, H); x.clip();
    roofs(x, H * .78, 3, 80, "#0b0e13", "#ffb347", t, .35); x.restore();
    x.save(); x.beginPath(); x.rect(W * .5, 0, W * .5, H); x.clip();
    x.globalAlpha = .8; roofs(x, H * .78, 3, 80, "#0e1620", "#7de8d8", t, .25); x.globalAlpha = 1; x.restore();
    radioTower(x, W * .5, H * .78, 300, t);
    // broadcast rings on the 1987 frequency
    for (let i = 0; i < 5; i++) {
      const rr = (t * 40 + i * 90) % 460;
      x.strokeStyle = `rgba(232,228,218,${.3 * (1 - rr / 460)})`; x.lineWidth = 1.3;
      x.beginPath(); x.arc(W * .5, H * .78 - 300, rr, 0, 7); x.stroke();
    }
    // the stage
    if (m.stage) {
      const sN = m.stageQuality || 3;
      x.fillStyle = "#16131e"; x.fillRect(W * .36, H * .68, W * .28, 12);
      for (let i = 0; i < sN; i++) {
        x.strokeStyle = "rgba(255,179,71,.55)"; x.lineWidth = 2;
        const bx2 = W * (.38 + i * (0.24 / Math.max(1, sN - 1 || 1)));
        x.beginPath(); x.moveTo(bx2, H * .68); x.lineTo(W * .5, H * .56); x.stroke();
      }
      glow(x, W * .5, H * .6, 110, "rgba(255,217,160,.18)");
      figure(x, W * .46, H * .67, 1.6, "moyi", { t });
      figure(x, W * .56, H * .67, 1.65, "paris", { t });
      if (m.quiet) figure(x, W * .5, H * .5, 1.5, "quiet", { t });
    } else {
      figure(x, W * .42, H * .92, 1.8, "moyi", { t });
      figure(x, W * .52, H * .92, 1.85, "paris", { t });
    }
    fog(x, H * .8, 40, t, 4, .06);
  };

  SC.epilogue = (x, t) => { // morning. the town grieves, and is alive.
    sky(x, [[0, "#7e95a8"], [.45, "#c9b8a0"], [.75, "#e0bC8e"], [1, "#e8c9a0"]]);
    glow(x, W * .26, H * .3, 200, "rgba(255,240,210,.5)");
    x.fillStyle = "rgba(255,250,235,.9)"; x.beginPath(); x.arc(W * .26, H * .3, 26, 0, 7); x.fill();
    ridge(x, H * .58, 50, 7, "rgba(90,100,110,.5)");
    radioTower(x, W * .2, H * .58, 190, t, false);
    roofs(x, H * .84, 3, 90, "#4a4548", "#fff3dd", t, .12);
    // people on the street, finally various
    figure(x, W * .36, H * .94, 1.5, "mom", { t });
    figure(x, W * .44, H * .94, 1.55, "moyi", { t });
    figure(x, W * .53, H * .94, 1.6, "paris", { t });
    figure(x, W * .66, H * .94, 1.45, "asha", { t });
    figure(x, W * .76, H * .94, 1.5, "juniper", { t });
    fog(x, H * .6, 60, t, 3, .12, "255,240,220");
  };

  /* ============================ compositor ============================ */
  function set(id, mood = {}, hard = false) {
    if (cur.id !== id || hard) {
      px2.drawImage(buf, 0, 0); fadeT = 0;
    }
    cur = { id, mood };
    document.body.classList.toggle("veil", !!mood.veilCss);
  }
  function mood(patch) { Object.assign(cur.mood, patch); }

  function render(x, t, dt) {
    const fn = SC[cur.id] || SC.void;
    bx.clearRect(0, 0, W, H);
    fn(bx, t, cur.mood);
    G.fx && G.fx.draw(bx, t, dt);
    G.mini && G.mini.draw(bx, t, dt);
    x.clearRect(0, 0, W, H);
    x.drawImage(buf, 0, 0);
    if (fadeT < 1) { // crossfade from previous scene
      fadeT = Math.min(1, fadeT + dt / 0.9);
      x.globalAlpha = 1 - U.ease.io(fadeT);
      x.drawImage(prev, 0, 0); x.globalAlpha = 1;
    }
    // soft-wrong pass: the world rendered like a memory of itself
    const S = G.state.d;
    const wrong = (cur.mood.veil ? .5 : 0) + (1 - S.lucidity / 100) * .55;
    if (wrong > 0.08) {
      const br = 1 + Math.sin(t * .7) * 0.0035 * wrong * 10;
      x.save();
      x.globalAlpha = .16 * wrong; x.globalCompositeOperation = "lighter";
      x.filter = "blur(3px) hue-rotate(-14deg)";
      x.translate(W / 2, H / 2); x.scale(br, br); x.translate(-W / 2, -H / 2);
      x.drawImage(buf, 1.6 * wrong * 3, 0);
      x.filter = "blur(3px) hue-rotate(12deg)";
      x.drawImage(buf, -1.6 * wrong * 3, 1);
      x.restore(); x.globalAlpha = 1; x.globalCompositeOperation = "source-over";
    }
  }

  return { set, mood, render, figure, glow, thread, W, H, SC };
})();
