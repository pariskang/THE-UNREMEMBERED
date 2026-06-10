/* CHAPTER 10 — The Song of Naming ----------------------------------------------
   The finale refuses the genre's standard ending. There is no fail state.
   Only versions. Both endings are written to be true.
--------------------------------------------------------------------------- */
G.script[10] = [
  { t: "title", n: 10 },
  { t: "bg", id: "room", drone: "night", mood: { mic: true } },
  { t: "card", text: "You cannot destroy the Quiet.<br>It is two children made of eighty years of withheld feeling,<br>and demolishing it detonates everything it has archived:<br>Senna. The unremembered. The whole basement of the town's heart.<br><br>So the duet will attempt the one thing nobody offered in 1987.<br><br><em>To witness it.</em>" },
  { t: "say", who: "asha", text: "Plan of record. Moyi learns the true names and sings them on the restored 1987 frequency — the whole town hears, awake or Hollow. Paris drafts the one structure his power was never meant for. Not a shelter. Not a weapon." },
  { t: "say", who: "paris", text: "A stage. A place where it is safe to be perceived. I've been sketching it since the road. With the cracks on the drawings — all of them, labeled, load paths published. If I'm going to build in public, it builds in public." },
  { t: "hud", op: "restoreStab" },
  { t: "do", fn: (S) => { G.state.stab(40); G.hud.meters(); } },
  { t: "narr", text: "His meter returns to the screen — lower, honester, <em>his.</em> He rebuilt it himself, by hand, out of road. The player never gets the old one back. The player was never supposed to." },
  { t: "if", cond: (S) => S.flags["ally.sheriff"], then: [
      { t: "say", who: "sheriff", text: "Tower power's patched through my cruiser battery and three extension cords of questionable legality. You'll have the 1987 frequency at full dark. Theo's coming to listen. <em>Everyone's</em> coming to listen — they don't know why. They keep saying it feels like remembering an appointment." },
  ] },

  /* ------------------------- the audit ------------------------- */
  { t: "card", text: "What follows is an audit of everything you did.<br><br>Every memory kept, every message delivered, every person woken,<br>every honest brick — they are not score.<br>They are <em>material.</em>" },
  { t: "do", fn: async (S) => {
      const kept = G.state.keptMemories().filter((m) => !S.flags["ash." + m.id]);
      const delivered = G.state.deliveredCount(), woke = S.woke.length, bricks = S.honestBricks;
      const material = kept.length + delivered + woke + Math.min(4, bricks);
      let q = 2 + Math.round(material / 3) - (S.hush.uses > 2 ? 1 : 0);
      q = G.U.clamp(q, 2, 7);
      S.flags["stage.quality"] = q; S.flags["stage.cathedral"] = q >= 5;
      G.state.mark("stage.quality", q, "stage built at quality " + q);
      for (const m of kept) { G.hud.toast("VERSE — " + m.label); G.audio.voice(64 + (Math.random() * 12 | 0), undefined, .8, { vol: .07 }); await G.U.sleep(750); }
      if (delivered) { G.hud.toast("VERSE — " + delivered + " undelivered message" + (delivered > 1 ? "s" : "") + ", finally sent"); await G.U.sleep(750); }
      for (const w of S.woke) { G.hud.toast("CHORUS — a woken voice: " + w); await G.U.sleep(600); }
      if (bricks) { G.hud.toast("BEAM — " + bricks + " honest brick" + (bricks > 1 ? "s" : "") + " from the road"); await G.U.sleep(750); }
      if (S.hush.uses) { G.hud.toast("REST — " + S.hush.uses + " silence" + (S.hush.uses > 1 ? "s" : "") + " where verses might have been", true); await G.U.sleep(900); }
    } },

  /* ------------------------- the naming ------------------------- */
  { t: "bg", id: "towerFinale", drone: "finale", mood: { stage: true, stageQuality: 3 } },
  { t: "do", fn: (S) => G.paint.mood({ stageQuality: S.flags["stage.quality"] }) },
  { t: "card", text: "The radio tower. Full dark. The restored 1987 frequency, live.<br><br>For the first time in the game, the Veil and the town<br>are visible in the same shot." },
  { t: "narr", text: "The town gathers at the ridge with lawn chairs and no explanation. The Hollowed come too, precise as appointments. In the teal half of the world, the unremembered drift to their windows. Two silhouettes holding hands walk up the middle of the shot, where the palettes meet, and stop at the foot of a stage built out of everything you did." },
  { t: "if", cond: (S) => S.flags["stage.cathedral"], then: [
      { t: "narr", text: "And it is a <em>cathedral</em> — verse upon verse, beam upon honest beam, the whole run standing up at once in lights. The Quiet tilts both heads, reading the manifest of how much was carried here, and how far." },
    ], else: [
      { t: "narr", text: "It is a sparse stage. A few true beams, a thin handful of verses — everything that survived a costly, honest run. The Quiet tilts both heads. Sparse is not small. Anyone who has sung in an empty room knows that." },
  ] },
  { t: "do", fn: async (S) => {
      for (;;) {
        const names = [
          { label: "WREN & ELLIS", good: true },
          { label: "JUNE & RHODES", good: false },
          { label: "VESPER & HALLOWAY", good: false },
          { label: "SENNA & MOYI", good: false },
          { label: "MARA & THEO", good: false },
          { label: "THE QUIET HAS NO NAMES", good: false },
        ].sort(() => Math.random() - .5);
        const pick = await G.mini.choosePanel({
          title: "THE SONG OF NAMING — sing them by their true names",
          note: S.flags["lore.flyer"] && G.state.hasMemory("flyer") && !S.flags["ash.flyer"]
            ? "the flyer said W. + E. — the voice & the blueprint. and at the Veil's floor, the chairs told you the rest."
            : "the flyer is gone — but at the Veil's floor, the chairs told you. things kept only inside it become it. say them out loud.",
          items: names, confirm: "sing the names",
        });
        if (pick.good) return;
        G.audio.sfx.staticBurst(.8);
        G.hud.toast("the name slides off them like rain off a stitched smile. that is not who they were.", true);
      }
    } },
  { t: "motif", name: "naming", opts: { beat: .46 } },
  { t: "say", who: "moyi", text: "WREN. Who sang this town legible every Saturday, and dove too deep, and waited under the under for somebody — <em>anybody</em> — to come down after her. We came down. We're sorry it took forty years. <b>WREN. WREN. WREN.</b>" },
  { t: "say", who: "paris", text: "ELLIS. Who tore out a wall between worlds because the load was unbearable and nobody co-signed it. You built the archive so well, man. You built it so well it forgot it was a wound. <b>I'm reading your joints right now. I see every cut you made. I see YOU.</b>" },
  { t: "narr", text: "The stitched smiles tremble. Being witnessed is exactly as terrifying as the Quiet always promised its clients it was — and the duet on stage does not look away, and the town does not look away, and the radio carries two names into every kitchen in Greyhollow at once." },
  { t: "say", who: "quiet", text: "<em>We— we have processed forty years of withdrawal. We have never once filed an application of our own. There was never anyone left at the desk to take it. Is this— children, is this what the desk feels like from the other side?</em>" },
  { t: "if", cond: (S) => S.hush.uses === 0, then: [
      { t: "say", who: "quiet", text: "<em>You never used our register. Not once. We checked the logs nightly; we found it… we believe the word is 'moving.' You carried every feeling at full weight up ten chapters of stairs. Then you know the load you're asking us to set down.</em>" },
    ], else: [
      { t: "say", who: "quiet", text: "<em>You used our register. You know it works. You know exactly how well it works, and what it shaves off each time — and you climbed back up anyway, every time, and chose the stairs. That is not a failure in the logs, little voice. That is the most credible witness we have ever had.</em>" },
  ] },
  { t: "narr", text: "The seams of their mouths — sewn by no one, sewn by everyone, sewn by a town that needed its grief filed — loosen, stitch by stitch, to the sound of their own names in a key from 1987." },

  /* ------------------------- what the song does ------------------------- */
  { t: "if", cond: (S) => S.sennaChoice === "comeback", then: [
      { t: "narr", text: "And the archive opens its drawers. The unremembered walk out of the teal half of the shot into the amber half — and among them, a scarf Moyi would know at any bitrate. Senna. Coming back to the world. Her answer, hers alone, arriving on her own feet." },
      { t: "if", cond: (S) => S.sennaFaceLost, then: [
          { t: "say", who: "senna", text: "Hey, Mo. ...You're looking at me weird. Low-res, sort of. Whatever it costs you to look at me like that — we're going to talk about it. We're going to talk about <em>everything</em>, at a normal volume, with breaks." },
        ], else: [
          { t: "say", who: "senna", text: "Hey, Mo. The door got loud with your name in it, all year. I'm not coming back because you searched. I'm coming back because you finally <em>asked</em> — and asking is the version where I get to answer." },
      ] },
  ] },
  { t: "if", cond: (S) => S.sennaChoice === "visit", then: [
      { t: "narr", text: "And the archive does something it has never done: it installs a <em>hinge</em>. At the third row of the bleachers, fourth seat, a door now stands — unlocked one night a month, with a brass plate that reads BY KNOCK ONLY. Senna keeps her dark. Moyi keeps her knock. The town learns to leave flowers at a door without pulling on it." },
  ] },
  { t: "if", cond: (S) => S.sennaChoice === "letgo", then: [
      { t: "narr", text: "And in Moyi's bag, a postcard that wasn't there before: no return address, a drawing of a hammock in the dark, perfectly at rest. <em>'lesson one, graduated. — s.'</em> She reads it twice, shelves it where she can reach, and — gently, audibly, on purpose — lets the file close." },
  ] },
  { t: "if", cond: (S) => S.apology === "accepted", then: [
      { t: "narr", text: "On the stage, Paris pins his drawings where the whole town can read them — every crack labeled, every load path published. Accountability turns out to be a public works project. They are already arguing about the next structure, as equals, at a normal volume, with breaks." },
    ], else: [
      { t: "narr", text: "On the stage, Moyi takes the microphone one extra second. “Earlier this year someone apologized to me and I said it was fine. It wasn't fine. It was <em>forgivable</em> — that's different, and better, and I'm saying the true one now, on the record, on his frequency.” Paris's laugh-sob is broadcast to the entire county. Worth it." },
  ] },

  /* ------------------------- FEEL IT ------------------------- */
  { t: "card", text: "One verse remains — the closing song.<br>It contains the hard parts. It was always going to.<br><br>The game asks one last thing of you, the player.<br>Not Moyi. <em>You.</em>" },
  { t: "do", fn: () => { G.audio.motif("naming", { beat: .5 }); setTimeout(() => G.audio.motif("lullaby", { beat: .48, shift: -3 }), 9000); setTimeout(() => G.audio.motif("naming", { beat: .44, shift: 2 }), 18000); setTimeout(() => G.audio.motif("lullaby", { broken: true, beat: .5 }), 27000); } },
  { t: "mini", name: "feelIt", store: "feelit", args: { secs: 36 } },
  { t: "narr", text: "Held. All the way through the parts that are hard to listen to. The credits have been waiting on you, specifically, and they would have waited all night." },

  /* ------------------------- epilogue ------------------------- */
  { t: "bg", id: "epilogue", drone: "finale" },
  { t: "fx", op: "clear" },
  { t: "card", text: "Greyhollow remembers everyone now.<br><br>Which means Greyhollow now <em>grieves</em> —<br>the town is sadder than it was,<br>and visibly, defiantly, more alive." },
  { t: "narr", text: "The trophy case updates. The yearbook reprints page thirty-one with the gap filled in. The mall stays dead in the correct, dignified way. The Quiet — Wren and Ellis, unsewn, smaller every week — take a part-time job at the library archive under Mr. Okafor's supervision, filing things that people <em>mean</em> to keep. Some mornings they are just two gray-haired regulars who flinch at loud noises and are learning, on a forty-year delay, to be perceived." },
  { t: "hud", op: "toast", text: "moyi_hums posted under her real name: “lullaby no. 1 — for greyhollow” · 312 listening · senna_arch1ve is not among the listeners. an account called just senna is." },
  { t: "narr", text: "Moyi posts the lullaby with her face in frame. Paris breaks ground on something small behind the Harlan place — nobody knows what yet, but it has, for the first time in his life, a <em>foundation</em>. Asha's interview goes fine. She tells them about pressure, and what it does, and laughs at the right part. They don't get the joke. She gets the scholarship anyway, and turns out to be more than it." },
  { t: "card", text: "Numbness is anesthesia, not healing.<br>Being witnessed is terrifying, and survivable.<br>A generation fluent in archiving its pain<br>can learn — on purpose — to play it back.<br><br><em>This was the thesis. You enacted it.</em>" },
  { t: "card", text: "post-credits frame:<br><br>somewhere far away,<br>another town's streetlights<br>begin<br>to hum." },
];
G.CHAPTER_TITLES[9].tag = "the thesis, spoken aloud · the player must hold the button through the hard parts";
