/* CHAPTER 9 — The Cartographer of Sleep ---------------------------------------
   The game stops telling the player the truth. Trust shifts from UI to memory.
--------------------------------------------------------------------------- */
G.script[9] = [
  { t: "do", fn: (S) => { S.flags["deepVeil"] = true; G.hud.setLying(2); G.hud.setStopFeeling(true); } },
  { t: "title", n: 9 },
  { t: "bg", id: "deep", veil: true, drone: "deep", mood: {} },
  { t: "fx", op: "on", args: ["static"] },
  { t: "hud", op: "objective", text: "objective complete ✓" },
  { t: "card", text: "There is no map for where she is.<br>There is a map on screen. Those are different sentences." },
  { t: "narr", text: "Moyi wakes on a floating island of archived bedroom, in light with no source, in a quiet with no edges. Her Lucidity is zero. Which means the game — menus, map, save files, this very text — is no longer on her side. Read accordingly." },
  { t: "hud", op: "toast", text: "senna_arch1ve and 3 others liked a memory you don't have", wrong: true },
  { t: "hud", op: "toast", text: "STILLWATER: your appointment is confirmed for yesterday", wrong: true },
  { t: "narr", text: "The save menu, if you open it, offers slots with titles like <em>Chapter 3 — The Stream That Never Ended (Senna's Version)</em>. The pause menu has grown a fifth item. It glows. It is very patient. It can wait." },

  /* ------------------------- the three moyis ------------------------- */
  { t: "do", fn: () => G.paint.mood({ moyis: true }) },
  { t: "narr", text: "Three Moyis are waiting for her on the next island, all wearing her face with total confidence. Each offers to lead the way up. Down here, the only working compass is <em>emotional continuity</em> — which story matches the weight of what was actually lived? The interface cannot answer. Only the player can." },
  { t: "do", fn: async (S) => {
      const ask = async (q) => {
        for (;;) {
          const pick = await G.mini.choosePanel(q);
          if (pick && pick.good) { G.audio.sfx.chime(true); G.hud.toast("one of the Moyis thins like fog and is gone"); return; }
          G.audio.sfx.staticBurst(1); G.fx.flash(.25); S.flags["driftDeep"] = true;
          G.hud.toast("the false Moyi smiles wider. “see? even you don't remember you.”", true);
        }
      };
      await ask({
        title: "THE FIRST MOYI — “easy one. in the blanket fort, what did we ask of Senna?”",
        note: "the false ones were built from plausible versions of you. plausible isn't lived.",
        items: [
          { label: "Come back.", good: S.sennaChoice === "comeback" },
          { label: "Let me visit.", good: S.sennaChoice === "visit" },
          { label: "Teach me how to let go.", good: S.sennaChoice === "letgo" },
          { label: "We never found her file.", good: false },
        ].sort(() => Math.random() - .5), confirm: "answer",
      });
      await ask({
        title: "THE SECOND MOYI — “the radio tower. the sealed landing at the top tier. which register opened it?”",
        items: [
          { label: "LULL — we soothed it open.", good: false },
          { label: "SHIFT — we changed its weather.", good: false },
          { label: "WAKE — it was a memory, and memories want waking.", good: G.state.flag("tower.t3") === "wake" },
          { label: "HUSH — we made it stop.", good: false },
        ].sort(() => Math.random() - .5), confirm: "answer",
      });
      await ask({
        title: S.sennaFaceLost
          ? "THE THIRD MOYI — “and the cathedral. waking your mother. what did it cost us?”"
          : "THE THIRD MOYI — “and the cathedral. your mother. what did she remain?”",
        items: S.sennaFaceLost ? [
          { label: "Nothing. The song was free that night.", good: false },
          { label: "Senna's face. We never see it again.", good: true },
          { label: "The bleacher thread.", good: false },
        ].sort(() => Math.random() - .5) : [
          { label: "We woke her. She cried in the nave.", good: false },
          { label: "Hollow. By her own signature. We let the choice be hers.", good: true },
          { label: "The Quiet took her by force.", good: false },
        ].sort(() => Math.random() - .5), confirm: "answer",
      });
    } },
  { t: "narr", text: "The last false Moyi unravels into the dark with no hard feelings — nothing down here has hard feelings, that's the whole product line. The real path was under her own feet the entire time, which is the kind of joke the deep Veil finds funny." },

  /* ------------------------- paris, in parallel ------------------------- */
  { t: "bg", id: "road", drone: "silence", mood: { bricks: 0 } },
  { t: "card", text: "In parallel, somewhere above:<br><br>Paris — emptied, steady in the terrible way of someone with nothing left to protect —<br>is building a road into the deep Veil <em>by hand.</em><br><br>No drafting. He doesn't trust a single structure he isn't certain of.<br>One honest brick at a time." },
  { t: "mini", name: "honestRoad", store: "road", args: { statements: [
      { text: "Moyi is down there, and she is real.", certain: true },
      { text: "Everything that broke tonight was my fault — all of it, alone.", certain: false },
      { text: "I was six. The wish did not wire the house.", certain: true },
      { text: "If I let myself feel things, people around me get hurt.", certain: false },
      { text: "She would come for me. She did come for me. Through a storm.", certain: true },
      { text: "She'd be better off if I stayed up here.", certain: false },
      { text: "The Quiet was a person once. Two. Somebody should have gone after THEM.", certain: true },
  ] } },
  { t: "narr", text: "The road is short. The road is true. Both of those, all the way down." },

  /* ------------------------- the quiet's biography ------------------------- */
  { t: "bg", id: "deep", veil: true, drone: "deep", mood: { quiet: true, door: false } },
  { t: "narr", text: "At the Veil's floor, the Quiet is waiting for her — not as a boss arena. As a kitchen table with two chairs and a pot of something warm that smells like 1987." },
  { t: "say", who: "quiet", text: "<em>You came all the way down. Nobody has ever come all the way down on purpose. Sit. We were two people once, and the part of us that remembers chairs would like to use them.</em>" },
  { t: "say", who: "quiet", text: "<em>A singer and a set-builder. Saturday Frequencies, on the county radio. Her name was</em> <b>Wren</b><em>. His was</em> <b>Ellis</b><em>. Write that down somewhere that isn't us. Things kept only inside us have a way of becoming us.</em>" },
  { t: "do", fn: () => { G.state.mark("names.heard", true, "the Quiet said its names: Wren & Ellis"); G.state.d.namesLearned = true; } },
  { t: "say", who: "quiet", text: "<em>Wren dove the way you dive — deeper every week, because the Veil was the only place the town's feelings were legible. One Saturday she went under the under, and did not come back up. And Ellis—</em>" },
  { t: "say", who: "quiet", text: "<em>Ellis did what builders do with unbearable load. He demolished. The boundary, the membrane, the door and its frame and the wall around the frame — he tore the divider down to get to her, and the two worlds' grief poured through the hole, and the children in the hole became its archivists. We have been filing Greyhollow's unfelt things ever since. Neatly. Mercifully. Ask anyone we've taken: it doesn't hurt.</em>" },
  { t: "say", who: "moyi", text: "Nobody came after you. Forty years of taking the town's pain, and the town's pain started with <em>nobody coming after two kids.</em>" },
  { t: "say", who: "quiet", text: "<em>...The chairs say thank you for sitting. That's all. That's the whole biography. Now. We have something of yours nearly ready.</em>" },
  { t: "do", fn: () => G.paint.mood({ door: true }) },
  { t: "narr", text: "A door, on the farthest island. Good joinery. Kind hinges. Stenciled across it in fresh paint: <b>MO</b> — and the second syllable half-finished, the brush still wet, no painter in sight." },
  { t: "say", who: "quiet", text: "<em>No threats. We have never once threatened anyone. The door is simply yours, whenever the being-perceived gets heavy enough. We finish the stencil the day you ask. Most people ask.</em>" },

  /* ------------------------- the pull-back ------------------------- */
  { t: "narr", text: "And then, from impossibly far above, two sounds arrive at once down the honest road. The deep Veil, scrupulously fair, lets her hear both:" },
  { t: "do", fn: async (S) => {
      for (;;) {
        const pick = await G.mini.choosePanel({
          title: "TWO SONGS IN THE DARK — follow one",
          note: "one is your lullaby, note-perfect, in your own recorded voice. the other is also your lullaby — wrecked. flat where it should lift, cracking on every third note, sung by someone who cannot sing and is doing it anyway.",
          items: [
            { label: "Follow the perfect one.", desc: "it sounds like home. it sounds exactly, exactly like home.", v: "perfect" },
            { label: "Follow the broken one.", desc: "it sounds like someone's actual throat. somewhere a tool roll has been set down.", v: "broken" },
          ], confirm: "walk",
        });
        if (pick.v === "perfect") {
          G.audio.motif("lullaby", { beat: .42 });
          await G.U.sleep(2400);
          G.audio.sfx.staticBurst(1.6); G.fx.flash(.3);
          G.hud.toast("the perfect song dissolves into playback. into archive hiss. into nothing with your name on it.", true, 5000);
          S.flags["followedPerfect"] = true; G.state.mark("followedPerfect", true, "followed the archived voice first");
        } else {
          G.audio.motif("lullaby", { broken: true, beat: .46 });
          G.state.mark("followedBroken", true, "followed the real, wrecked song");
          return;
        }
      }
    } },
  { t: "narr", text: "It's Paris. Of course it's Paris. At the end of a road with no drafted inch in it, <em>singing</em> — badly, tunelessly, her own Chapter 3 lullaby — because his hands are empty and it was the only material left, and some structures can only be built out of exactly that." },
  { t: "say", who: "paris", text: "—I know. I KNOW. Asha made me a pitch chart and everything, it didn't take. Don't— okay, you're laughing. Laughing is lucid. Laughing I can <em>anchor</em>." },
  { t: "say", who: "moyi", text: "You built the road by hand. And then you became the worst siren in two worlds. For me." },
  { t: "say", who: "paris", text: "You sang my register all year. Felt fair to finally sing yours. ...Come on. Come up. Everyone's waiting, and I left the radio on, and we have two names that need a stage." },
  { t: "do", fn: (S) => { G.state.luc(28, true); S.flags["deepVeil"] = false; G.hud.setLying(0); G.hud.meters(); } },
  { t: "fx", op: "off", args: ["static"] },
  { t: "drone", name: "night" },

  { t: "card", wound: true, text: "What pulled her back was not the road reaching her.<br>It was a builder, singing wrong on purpose, in public.<br><br>For one scene, the duet swapped instruments —<br>and both of them finally heard what the other had been carrying." },
];
G.CHAPTER_TITLES[8].tag = "derealization rendered as level design · the glass between self and world";
