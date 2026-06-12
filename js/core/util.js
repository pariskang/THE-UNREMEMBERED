/* THE UNREMEMBERED — util ------------------------------------------------ */
window.G = window.G || {};

G.U = {
  $: (s) => document.querySelector(s),
  $$: (s) => Array.from(document.querySelectorAll(s)),
  el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  },
  sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
  clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
  lerp: (a, b, t) => a + (b - a) * t,
  rand: (a = 1, b) => (b == null ? Math.random() * a : a + Math.random() * (b - a)),
  pick: (arr) => arr[(Math.random() * arr.length) | 0],
  // deterministic noise for stable procedural art
  hash(n) { let x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); },
  ease: {
    io: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
    out: (t) => 1 - Math.pow(1 - t, 3),
  },
  fmtTime(d = new Date()) {
    let h = d.getHours() % 12 || 12, m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m} ${d.getHours() >= 12 ? "PM" : "AM"}`;
  },
  // wait for a click/keypress on the stage (advance dialogue etc.)
  once(target, evs) {
    return new Promise((res) => {
      const fns = [];
      const done = (e) => { fns.forEach(([t, ev, f]) => t.removeEventListener(ev, f)); res(e); };
      evs.forEach(([t, ev, filter]) => {
        const f = (e) => { if (!filter || filter(e)) done(e); };
        fns.push([t, ev, f]); t.addEventListener(ev, f);
      });
    });
  },
  advance() { // standard "next" input: click stage / space / enter
    return G.U.once(window, [
      [G.U.$("#stage"), "pointerdown"],
      [window, "keydown", (e) => e.key === " " || e.key === "Enter"],
    ]);
  },
};
