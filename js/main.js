/* THE UNREMEMBERED — main ---------------------------------------------------- */
G.main = (() => {
  const U = G.U, $ = U.$;

  function refreshMenu() {
    const has = G.state.hasSave();
    $("#mm-continue").classList.toggle("hidden", !has);
    $("#mm-chapters").classList.toggle("hidden", !has);
  }

  function openChapters() {
    G.state.load();
    const list = $("#cs-list"); list.innerHTML = "";
    const max = G.state.d.maxChapter;
    G.CHAPTER_TITLES.forEach((c, i) => {
      const b = U.el("button", "", `<span>CHAPTER ${i + 1}</span>${c.en} · ${c.zh}`);
      b.disabled = i + 1 > max;
      b.onclick = () => { G.audio.ensure(); $("#chapselect").classList.add("hidden"); G.engine.runChapter(i + 1); };
      list.appendChild(b);
    });
    $("#chapselect").classList.remove("hidden");
  }

  function boot() {
    refreshMenu();
    G.audio.setDrone("night");

    $("#mm-new").onclick = () => {
      G.audio.ensure(); G.audio.resume();
      G.state.reset(); G.state.save();
      G.engine.runChapter(1);
    };
    $("#mm-continue").onclick = () => {
      G.audio.ensure(); G.audio.resume();
      G.state.load();
      G.engine.runChapter(Math.min(10, G.state.d.chapter || 1));
    };
    $("#mm-chapters").onclick = () => { G.audio.ensure(); openChapters(); };
    $("#mm-sound").onclick = (e) => {
      G.audio.ensure();
      G.audio.enabled = !G.audio.enabled;
      e.target.textContent = "sound: " + (G.audio.enabled ? "on" : "off");
    };
    $("#cs-back").onclick = () => $("#chapselect").classList.add("hidden");

    // first gesture anywhere unlocks audio (autoplay policy)
    window.addEventListener("pointerdown", () => { G.audio.ensure(); G.audio.resume(); }, { once: true });
    document.body.classList.remove("boot");
  }

  window.addEventListener("DOMContentLoaded", boot);
  return { refreshMenu, openChapters };
})();
