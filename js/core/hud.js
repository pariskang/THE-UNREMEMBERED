/* THE UNREMEMBERED — hud ----------------------------------------------------
   The interface is a character. It can be taken from you, and at low
   Lucidity it is no longer on your side.
--------------------------------------------------------------------------- */
G.hud = (() => {
  const U = G.U, $ = U.$;
  let lying = 0; // 0 honest · 1 uneasy · 2 the menus lie

  function show() { $("#hud").classList.remove("hidden"); meters(); satchel(); }
  function hide() { $("#hud").classList.add("hidden"); }

  function meters() {
    const S = G.state.d;
    let luc = S.lucidity, stab = S.stability;
    if (lying >= 1) { luc = U.clamp(luc + Math.sin(Date.now() / 700) * 9, 0, 100); }
    $("#m-luc-fill").style.width = luc + "%";
    $("#m-stab-fill").style.width = stab + "%";
    $("#m-link").classList.toggle("off", S.estranged || !S.resonance);
    lucidityBodyClass();
  }
  function lucidityBodyClass() {
    const l = G.state.d.lucidity;
    document.body.classList.toggle("luc-low", l <= 40);
    document.body.classList.toggle("luc-zero", l <= 12);
  }
  function satchel() { $("#satchel-n").textContent = G.state.heldCount(); }

  /* ---------- meter removal (the game's deepest threat) ---------- */
  function removeMeter(sel) {
    const el = $(sel); if (!el) return;
    G.audio.sfx.uiVanish();
    el.classList.add("hud-vanish");
    setTimeout(() => el.classList.add("hidden"), 950);
  }
  function restoreMeter(sel) {
    const el = $(sel); el.classList.remove("hud-vanish", "hidden");
  }

  /* ---------- registers ---------- */
  const REGS = { wake: "WAKE ✶", lull: "LULL ☾", shift: "SHIFT ∿", hush: "HUSH ●" };
  let regUnlocked = [], regResolve = null;
  function registers(list) {
    regUnlocked = list || [];
    const box = $("#registers"); box.innerHTML = "";
    if (!regUnlocked.length) { box.classList.add("hidden"); return; }
    box.classList.remove("hidden");
    regUnlocked.forEach((r) => {
      const b = U.el("button", "reg" + (r === "hush" ? " hush" : ""), REGS[r]);
      b.onclick = () => { if (regResolve) { const f = regResolve; regResolve = null; markSel(b); f(r); } };
      box.appendChild(b);
    });
  }
  function markSel(b) { U.$$(".reg").forEach((x) => x.classList.remove("sel")); b.classList.add("sel"); setTimeout(() => b.classList.remove("sel"), 900); }
  function pickRegister() { // engine awaits a register choice
    return new Promise((res) => { regResolve = res; });
  }
  function cancelRegister() { regResolve = null; }

  /* ---------- toasts: notifications from accounts that don't exist ---------- */
  function toast(text, wrong = false, ms = 4200) {
    const t = U.el("div", "toast" + (wrong ? " wrong" : ""), text);
    $("#toasts").appendChild(t);
    G.audio.sfx.notify(wrong);
    setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 600); }, ms);
  }

  function objective(text) {
    const o = $("#objective");
    if (!text) { o.classList.add("hidden"); return; }
    if (lying >= 2 && Math.random() < .45) {
      const lies = ["return to where you started", "objective complete ✓", "find Senna (she is right behind you)", "stop looking", "███ ████ ███"];
      text = U.pick(lies);
    }
    $("#objective-text").textContent = text;
    o.classList.remove("hidden");
  }

  /* ---------- fake HUD (cold open) ---------- */
  function fakeShow() { $("#fakehud").classList.remove("hidden"); }
  function fakeHide() { $("#fakehud").classList.add("hidden"); }
  async function fakeStrip() { // one by one, the ordinary game is taken away
    for (const id of ["#fh-hp", "#fh-map", "#fh-quest", "#fh-pausebtn"]) {
      await U.sleep(1300);
      removeMeter(id);
    }
    await U.sleep(1100);
  }
  function fakeReset() { ["#fh-hp", "#fh-map", "#fh-quest", "#fh-pausebtn"].forEach((s) => { const e = $(s); e.classList.remove("hud-vanish", "hidden"); }); }

  /* ---------- pause ---------- */
  let paused = false, stopFeelingItem = false;
  function buildPause() {
    const box = $("#pz-items"); box.innerHTML = "";
    const add = (label, fn, cls) => { const b = U.el("button", cls || "", label); b.onclick = fn; box.appendChild(b); return b; };
    add("resume", togglePause);
    add("save — “" + G.state.saveTitle() + "”", () => { G.state.save(); toast("the game will remember this. probably."); togglePause(); });
    add("sound: " + (G.audio.enabled ? "on" : "off"), (e) => { G.audio.enabled = !G.audio.enabled; e.target.textContent = "sound: " + (G.audio.enabled ? "on" : "off"); });
    add("chapters", () => { togglePause(); G.engine.toMenu(true); });
    if (stopFeelingItem) {
      add("stop feeling.", (e) => {
        G.state.d.hush.menuTouched = true;
        G.state.mark("hush.menu", true, "the pause menu made an offer");
        G.audio.register("hush");
        e.target.textContent = "…not yet. but it's always here.";
      }, "stopfeeling");
    }
    const sub = U.el("div", "pz-sub", lying >= 2
      ? "autosave last verified: <span class='glitchtext'>never</span> · lucidity untrusted"
      : "progress autosaves at every chapter");
    box.appendChild(sub);
  }
  function togglePause(force) {
    paused = force != null ? force : !paused;
    if (paused) buildPause();
    $("#pause").classList.toggle("hidden", !paused);
    G.engine && (G.engine.paused = paused);
  }

  function setLying(level) { lying = level; }
  function setStopFeeling(v) { stopFeelingItem = v; }

  /* ---------- dialogue name erosion (Senna, ch1) ---------- */
  async function erodeName() {
    const chip = $("#dlg-name");
    let name = chip.textContent;
    while (name.length) {
      await U.sleep(420);
      name = name.slice(0, -1);
      chip.textContent = name || "​";
      G.audio.sfx.key();
    }
    $("#dlg-chip").classList.add("gone");
  }

  /* wire pause inputs */
  window.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#hud").classList.contains("hidden")) togglePause(); });
  $("#pausebtn").addEventListener("click", () => togglePause());
  $("#fh-pausebtn") && ($("#fh-pausebtn").onclick = () => {});

  return {
    show, hide, meters, satchel, lucidityBodyClass, removeMeter, restoreMeter,
    registers, pickRegister, cancelRegister, toast, objective,
    fakeShow, fakeHide, fakeStrip, fakeReset, togglePause, setLying, setStopFeeling, erodeName,
    get paused() { return paused; },
  };
})();
