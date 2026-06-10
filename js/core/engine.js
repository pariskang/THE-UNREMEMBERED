/* THE UNREMEMBERED — engine --------------------------------------------------
   Branch-and-bottleneck: chapters end in fixed beats, but the emotional
   state of the world persists and recolors everything after.
--------------------------------------------------------------------------- */
G.engine = (() => {
  const U = G.U, $ = U.$;
  const ctx = $("#scene").getContext("2d");
  const mctx = $("#menucanvas").getContext("2d");
  let t = 0, last = null, onMenu = true;

  /* ---------------- render loop ---------------- */
  function loop(ts) {
    if (last == null) last = ts;
    const dt = Math.min(0.05, (ts - last) / 1000); last = ts; t += dt;
    if (onMenu) { G.paint.SC.menu(mctx, t); }
    else G.paint.render(ctx, t, dt);
    requestAnimationFrame(loop);
  }

  /* ---------------- corrupted dialogue ---------------- */
  const SWAPS = [
    ["friend", "stranger"], ["home", "hollow"], ["remember", "invent"], ["real", "rehearsed"],
    ["sleep", "sink"], ["song", "silence"], ["mom", "someone"], ["okay", "archived"],
    ["morning", "mourning"], ["true", "tidy"], ["alone", "all one"], ["name", "number"],
  ];
  function corrupt(text) {
    const S = G.state.d;
    const level = S.flags["deepVeil"] ? 2 : S.lucidity <= 40 ? 1 : 0;
    if (!level) return { html: text, settled: null };
    let settled = text, html = text, hit = false;
    for (const [a, b] of SWAPS) {
      const re = new RegExp(`\\b${a}\\b`, "i");
      if (re.test(text) && Math.random() < (level === 2 ? 0.5 : 0.3) && !hit) {
        hit = true;
        html = text.replace(re, `<span class="wrong">${b}</span>`);
        if (level === 2) settled = null; // it never settles down here
      }
    }
    return hit ? { html, settled: level === 1 ? text : null } : { html: text, settled: null };
  }

  /* ---------------- typewriter (tag-aware) ---------------- */
  let skipType = false;
  async function typeInto(el, html) {
    el.innerHTML = ""; skipType = false;
    const tokens = html.split(/(<[^>]+>)/g).filter(Boolean);
    let stack = [el];
    for (const tk of tokens) {
      if (tk.startsWith("</")) { stack.pop(); continue; }
      if (tk.startsWith("<")) {
        const tag = tk.match(/<(\w+)/)[1], cls = (tk.match(/class="([^"]+)"/) || [])[1];
        const node = U.el(tag, cls); stack[stack.length - 1].appendChild(node); stack.push(node);
        continue;
      }
      const target = stack[stack.length - 1];
      const tn = document.createTextNode(""); target.appendChild(tn);
      for (const ch of tk) {
        if (skipType) { tn.textContent += tk.slice(tn.textContent.length); break; }
        tn.textContent += ch;
        if (ch !== " ") await U.sleep(14);
      }
    }
  }
  async function waitAdvance() {
    for (;;) {
      await U.advance();
      if (!G.hud.paused) return;
      await U.sleep(120);
    }
  }

  /* ---------------- dialogue / cards ---------------- */
  async function say(who, text, kind) {
    const dlg = $("#dlg"), chip = $("#dlg-chip"), name = $("#dlg-name"), body = $("#dlg-text");
    dlg.classList.remove("hidden", "narr", "you", "done");
    if (kind) dlg.classList.add(kind);
    if (who) {
      const c = G.CHARS[who] || { name: who.toUpperCase(), color: "#cfd8dc" };
      chip.style.display = ""; chip.classList.remove("gone");
      name.textContent = c.name; name.style.color = c.color;
      chip.style.borderColor = c.color + "55";
    } else chip.style.display = "none";
    const cor = corrupt(text);
    const clickSkip = (e) => { skipType = true; };
    dlg.addEventListener("pointerdown", clickSkip);
    await typeInto(body, cor.html);
    if (cor.settled) { await U.sleep(700); body.innerHTML = cor.settled; } // it flickers… then settles. this time.
    dlg.removeEventListener("pointerdown", clickSkip);
    dlg.classList.add("done");
    await waitAdvance();
    dlg.classList.remove("done");
  }
  function hideDlg() { $("#dlg").classList.add("hidden"); }

  async function card(text, wound) {
    hideDlg();
    const c = $("#card"), ct = $("#card-text");
    ct.innerHTML = (wound ? `<span class="wound">—  W O U N D  —</span>` : "") + text;
    c.classList.remove("hidden"); c.classList.add("fadein");
    await U.sleep(600); await waitAdvance();
    c.classList.add("hidden"); c.classList.remove("fadein");
  }

  async function title(n) {
    hideDlg();
    const tcd = $("#titlecard"), T = G.CHAPTER_TITLES[n - 1];
    tcd.querySelector(".tc-n").textContent = `C H A P T E R · ${["I","II","III","IV","V","VI","VII","VIII","IX","X"][n-1]}`;
    tcd.querySelector(".tc-en").textContent = T.en;
    tcd.querySelector(".tc-zh").textContent = T.zh;
    tcd.querySelector(".tc-tag").textContent = T.tag || "";
    tcd.classList.remove("hidden"); tcd.classList.add("fadein");
    G.audio.sfx.chime(true);
    await U.sleep(900); await waitAdvance();
    tcd.classList.add("hidden"); tcd.classList.remove("fadein");
  }

  async function choice(b) {
    hideDlg();
    const box = $("#choices"); box.innerHTML = "";
    if (b.prompt) box.appendChild(U.el("div", "prompt", b.prompt));
    const picked = await new Promise((res) => {
      b.options.forEach((o) => {
        if (o.cond && !o.cond(G.state.d)) return;
        const btn = U.el("button", "choice" + (o.hush ? " hush" : "") + (o.burn ? " burn" : ""),
          o.label + (o.sub ? `<small>${o.sub}</small>` : ""));
        btn.onclick = () => { box.classList.add("hidden"); res(o); };
        box.appendChild(btn);
      });
      box.classList.remove("hidden");
    });
    if (b.id) G.state.mark("choice." + b.id, picked.k, (b.prompt || b.id) + " → " + picked.k);
    if (picked.hush) { G.state.useHush(b.id || "choice"); }
    return picked.k;
  }

  /* ---------------- register singing ---------------- */
  async function sing(b) {
    hideDlg();
    G.hud.registers(b.registers);
    if (b.prompt) { $("#choices").innerHTML = ""; $("#choices").appendChild(U.el("div", "prompt", b.prompt)); $("#choices").classList.remove("hidden"); }
    const r = await G.hud.pickRegister();
    $("#choices").classList.add("hidden");
    G.audio.register(r);
    if (r === "hush") G.state.useHush(b.id || "sing");
    if (b.id) G.state.mark("sing." + b.id, r, (b.prompt || b.id) + " → sang " + r.toUpperCase());
    G.hud.registers(G.state.d.flags["regs"] || []);
    return r;
  }

  /* ---------------- beat executor ---------------- */
  async function exec(b) {
    const S = G.state.d;
    switch (b.t) {
      case "bg": G.paint.set(b.id, Object.assign({ veil: !!b.veil, veilCss: !!b.veil }, b.mood || {})); if (b.drone) G.audio.setDrone(b.drone); break;
      case "mood": G.paint.mood(b.m); break;
      case "title": await title(b.n); break;
      case "card": await card(b.text, b.wound); break;
      case "say": await say(b.who, b.text); break;
      case "narr": await say(null, b.text, "narr"); break;
      case "you": await say(b.as || "you", b.text, "you"); break;
      case "choice": { const k = await choice(b); if (b.branch && b.branch[k]) await run(b.branch[k]); break; }
      case "sing": { const r = await sing(b); if (b.branch && b.branch[r]) await run(b.branch[r]); break; }
      case "mini": {
        hideDlg();
        const out = await G.mini[b.name](b.args || {});
        if (b.store) G.state.mark("mini." + b.store, out, b.store);
        if (b.after) await b.after(out, G.state.d);
        break;
      }
      case "fx": G.fx[b.op] && G.fx[b.op](...(b.args || [])); break;
      case "sfx": G.audio.sfx[b.name] && G.audio.sfx[b.name](...(b.args || [])); break;
      case "drone": G.audio.setDrone(b.name); break;
      case "motif": G.audio.motif(b.name || "lullaby", b.opts || {}); break;
      case "meter": if (b.luc) G.state.luc(b.luc); if (b.stab) G.state.stab(b.stab); break;
      case "hud": {
        const ops = {
          show: () => G.hud.show(), hide: () => G.hud.hide(),
          fake: () => G.hud.fakeShow(), fakeStrip: () => G.hud.fakeStrip(), fakeHide: () => G.hud.fakeHide(),
          objective: () => G.hud.objective(b.text), toast: () => G.hud.toast(b.text, b.wrong),
          registers: () => { G.state.d.flags["regs"] = b.list; G.hud.registers(b.list); },
          removeLuc: () => G.hud.removeMeter("#m-luc"), removeStab: () => G.hud.removeMeter("#m-stab"),
          restoreStab: () => G.hud.restoreMeter("#m-stab"), restoreLuc: () => G.hud.restoreMeter("#m-luc"),
          lie: () => G.hud.setLying(b.level), stopFeeling: () => G.hud.setStopFeeling(b.v),
          erodeName: () => G.hud.erodeName(),
        };
        const r = ops[b.op] && ops[b.op]();
        if (b.op === "fakeStrip") await r;
        break;
      }
      case "gain":
        if (b.kind === "memory") G.state.gainMemory(b.id, b.label, b.desc, b.loss);
        if (b.kind === "msg") { G.state.gainMsg(b.id, b.label, b.from, b.body); G.hud.toast("✉ undelivered acquired — “" + b.label + "”"); }
        break;
      case "do": await b.fn(S); break;
      case "if": await run(b.cond(S) ? b.then : (b.else || [])); break;
      case "wait": await U.sleep(b.ms); break;
    }
  }
  async function run(beats) { for (const b of beats) await exec(b); }

  /* ---------------- chapter management ---------------- */
  async function runChapter(n) {
    onMenu = false;
    $("#mainmenu").classList.add("hidden");
    $("#chapselect").classList.add("hidden");
    G.mini.abort(); hideDlg();
    ["#card", "#titlecard", "#pause"].forEach((s) => $(s).classList.add("hidden"));
    G.hud.fakeReset(); G.hud.fakeHide(); G.hud.togglePause(false);
    G.fx.clear(); G.hud.objective(null);
    G.state.d.chapter = n;
    const S = G.state.d;
    G.hud.setLying(S.flags["deepVeil"] ? 2 : 0);
    G.hud.setStopFeeling(!!S.flags["deepVeil"]);
    G.hud.registers(S.flags["regs"] || []);
    try {
      await run(G.script[n]);
    } catch (e) { console.error(e); }
    // bottleneck: fixed beat ends, wounds persist
    S.maxChapter = Math.max(S.maxChapter, n + 1);
    G.state.save();
    if (n < 10) {
      const next = await G.mini.choosePanel({
        title: "CHAPTER " + n + " — COMPLETE",
        note: "the wound is written. the world will remember it even if you don't.",
        items: [
          { label: "Continue — Chapter " + (n + 1) + ": " + G.CHAPTER_TITLES[n].en, desc: G.CHAPTER_TITLES[n].zh, v: 1 },
          { label: "Rest — return to the title", desc: "progress is saved", v: 0 },
        ],
        confirm: "go",
      });
      if (next && next.v) runChapter(n + 1);
      else toMenu();
    } else {
      await credits();
      toMenu();
    }
  }

  async function credits() {
    const S = G.state.d;
    const el = $("#credits"), roll = $("#credits-roll");
    roll.innerHTML = `
      <h3>THE UNREMEMBERED</h3><div class="dim">未被记得的人 · a weird-fiction mystery in ten chapters</div>
      <br><div>MOYI — the voice</div><div>PARIS — the architect</div><div>SENNA — who chose</div>
      <div>JUNIPER — who logged off</div><div>ASHA — who is not a verdict</div>
      <div>WREN & ELLIS — witnessed, at last</div>
      <br><div class="dim">your run</div>
      <div>memories kept · ${G.state.keptMemories().length} / ${S.memories.length}</div>
      <div>undelivereds delivered · ${G.state.deliveredCount()}</div>
      <div>hollowed woken · ${S.woke.length}</div>
      <div>honest bricks · ${S.honestBricks}</div>
      <div>times Hush was chosen · ${S.hush.uses}</div>
      <br><div class="dim">numbness is anesthesia, not healing.</div>
      <div class="dim">being witnessed is terrifying, and survivable.</div>
      <br><div>thank you for feeling it.</div>
      <div class="dim">谢谢你，把它感受完。</div><br><br>
      <div class="dim">somewhere far away, another town's streetlights hum.</div>`;
    el.classList.remove("hidden");
    G.audio.setDrone("finale");
    await U.sleep(46000);
    el.classList.add("hidden");
  }

  function toMenu(showChapters) {
    onMenu = true; G.fx.clear(); G.hud.hide(); G.hud.fakeHide(); hideDlg();
    document.body.classList.remove("veil");
    $("#choices").classList.add("hidden"); $("#panel").classList.add("hidden");
    $("#mainmenu").classList.remove("hidden");
    G.audio.setDrone("night");
    G.main && G.main.refreshMenu();
    if (showChapters) G.main.openChapters();
  }

  requestAnimationFrame(loop);
  return { runChapter, toMenu, run, get onMenu() { return onMenu; }, paused: false };
})();
