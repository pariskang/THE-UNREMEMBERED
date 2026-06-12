/* THE UNREMEMBERED — state ------------------------------------------------
   The persistent emotional state of Greyhollow. The save file is honest;
   what the *interface shows you* is only as honest as Moyi's Lucidity.
--------------------------------------------------------------------------- */
G.state = (() => {
  const KEY = "unremembered.v1";

  const fresh = () => ({
    chapter: 1, maxChapter: 1,
    lucidity: 86, stability: 72,
    resonance: false, estranged: false,
    hush: { offered: false, uses: 0, menuTouched: false },
    memories: [],        // {id,label,desc,burned,loss}
    undelivereds: [],    // {id,label,from,body,delivered}
    crackedDrafts: 0,    // structures drafted while suppressing panic
    honestBricks: 0,
    woke: [], motherWoken: null, sennaFaceLost: false,
    sennaChoice: null,   // comeback | visit | letgo
    lullOnParis: null,   // soothe | manage | refrain
    apology: null,       // accepted | absorbed
    namesLearned: false,
    history: [],         // [{ch,key,val,label}]
    flags: {},
  });

  let S = fresh();

  const api = {
    get d() { return S; },
    reset() { S = fresh(); },

    /* ---------- meters ---------- */
    luc(delta, silent) {
      S.lucidity = G.U.clamp(S.lucidity + delta, 0, 100);
      G.hud && G.hud.meters();
      if (!silent && delta < 0) G.hud && G.hud.lucidityBodyClass();
    },
    stab(delta) {
      S.stability = G.U.clamp(S.stability + delta, 0, 100);
      G.hud && G.hud.meters();
    },

    /* ---------- memory economy ---------- */
    gainMemory(id, label, desc, loss) {
      if (S.memories.find((m) => m.id === id)) return;
      S.memories.push({ id, label, desc, loss, burned: false });
    },
    burnMemory(id) {
      const m = S.memories.find((x) => x.id === id);
      if (m) { m.burned = true; api.mark("burn." + id, true, "burned: " + m.label); }
    },
    hasMemory(id) {
      const m = S.memories.find((x) => x.id === id);
      return m && !m.burned;
    },
    keptMemories() { return S.memories.filter((m) => !m.burned); },

    /* ---------- undelivereds ---------- */
    gainMsg(id, label, from, body) {
      if (S.undelivereds.find((u) => u.id === id)) return;
      S.undelivereds.push({ id, label, from, body, delivered: false });
      G.hud && G.hud.satchel();
    },
    deliver(id) {
      const u = S.undelivereds.find((x) => x.id === id);
      if (u && !u.delivered) { u.delivered = true; api.mark("deliver." + id, true, "delivered: " + u.label); }
      G.hud && G.hud.satchel();
    },
    heldCount() { return S.undelivereds.filter((u) => !u.delivered).length; },
    deliveredCount() { return S.undelivereds.filter((u) => u.delivered).length; },

    /* ---------- the record (for chapter 9 recall + chapter 10 audit) ---------- */
    mark(key, val, label) {
      S.history.push({ ch: S.chapter, key, val, label: label || key });
      S.flags[key] = val;
    },
    flag(key) { return S.flags[key]; },

    /* ---------- hush ---------- */
    useHush(where) {
      S.hush.uses++; api.mark("hush." + where, true, "used Hush: " + where);
      G.audio.register("hush");
    },

    /* ---------- persistence ---------- */
    save() {
      try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
    },
    load() {
      try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return false;
        S = Object.assign(fresh(), JSON.parse(raw));
        return true;
      } catch (e) { return false; }
    },
    hasSave() { try { return !!localStorage.getItem(KEY); } catch (e) { return false; } },
    wipe() { try { localStorage.removeItem(KEY); } catch (e) {} },

    /* the save menu lies when Moyi can't verify her own past */
    saveTitle() {
      const real = `Chapter ${S.chapter} — ${G.CHAPTER_TITLES[S.chapter - 1].en}`;
      if (S.lucidity > 35 && !S.flags["deepVeil"]) return real;
      const lies = [
        `Chapter 3 — The Stream That Never Ended (Senna's Version)`,
        `Chapter ${S.chapter} — ${G.CHAPTER_TITLES[S.chapter - 1].en} (again)`,
        `Chapter 11 — The Girl Who Stayed`,
        `Chapter ? — you were never here`,
        real,
      ];
      return G.U.pick(lies);
    },
  };
  return api;
})();

G.CHAPTER_TITLES = [
  { en: "The Girl Nobody Remembers",   zh: "无人记得的女孩" },
  { en: "The Mall of Unsent Messages", zh: "未寄出讯息的商场" },
  { en: "The Stream That Never Ended", zh: "永不结束的直播" },
  { en: "The House He Built Twice",    zh: "他建过两次的房子" },
  { en: "The Choir of Hollow Voices",  zh: "空心之声的合唱" },
  { en: "The Examination",             zh: "考 试" },
  { en: "The Unfollowing",             zh: "取 消 关 注" },
  { en: "Demolition Day",              zh: "拆 除 日" },
  { en: "The Cartographer of Sleep",   zh: "睡眠制图师" },
  { en: "The Song of Naming",          zh: "命 名 之 歌" },
];

G.CHARS = {
  you:     { name: "SENNA", color: "#9ecfff" },
  noone:   { name: "", color: "#9ecfff" },
  senna:   { name: "SENNA", color: "#9ecfff" },
  moyi:    { name: "MOYI", color: "#7de8d8" },
  paris:   { name: "PARIS", color: "#ffb347" },
  mom:     { name: "MOM", color: "#d8b4a0" },
  sheriff: { name: "SHERIFF DANE", color: "#b9a7e8" },
  clerk:   { name: "CLERK", color: "#aab4bd" },
  juniper: { name: "JUNIPER_LOL", color: "#ff9ecf" },
  chat:    { name: "THE CHAT", color: "#8fd4ff" },
  asha:    { name: "ASHA", color: "#ffe08a" },
  teacher: { name: "MS. VALE", color: "#9aa8a0" },
  holt:    { name: "MR. HOLT", color: "#9aa8a0" },
  future:  { name: "ASHA · PROJECTED", color: "#ffffff" },
  withdraw:{ name: "THE WITHDRAWAL", color: "#9ecfff" },
  quiet:   { name: "THE QUIET", color: "#e8e4da" },
  wren:    { name: "WREN", color: "#e8e4da" },
  ellis:   { name: "ELLIS", color: "#e8e4da" },
  radio:   { name: "THE RADIO", color: "#c8b89a" },
  rubric:  { name: "RUBRIC", color: "#c0c8d0" },
  voice:   { name: "?", color: "#cfd8dc" },
};
