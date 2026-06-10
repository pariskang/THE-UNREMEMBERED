/* CHAPTER 8 — Demolition Day -------------------------------------------------
   The catastrophe chapter. The whole Stability economy pays off, in order.
--------------------------------------------------------------------------- */
G.script[8] = [
  { t: "title", n: 8 },
  { t: "bg", id: "festival", drone: "town", mood: { hollowRatio: .4 } },
  { t: "card", text: "Exposed, the Stillwater Initiative does not retreat. It <em>accelerates</em>:<br><br>THE CALM FESTIVAL — one night, the whole town square,<br>timed to a Veil-conjunction that happens once a generation.<br><br>By morning, Greyhollow can be Hollowed in a single sitting." },
  { t: "say", who: "asha", text: "Conjunction math: tonight the membrane is thin enough that the Quiet can sing its unison <em>up through the bandstand</em>. Anyone in the square who's signed anything — pamphlet, mailing list, a sympathetic nod — counts as consent." },
  { t: "say", who: "sheriff", text: "I can stall the stage on permit violations for maybe two hours. After that, this town gets the sleep it thinks it wants." },
  { t: "say", who: "moyi", text: "Then we shelter what they'd lose. Every waking memory in Greyhollow — we hold it in the Veil until the conjunction passes. One structure. The biggest ever drafted." },
  { t: "say", who: "paris", text: "A Sanctuary. ...I've been sketching it since the cathedral, in the back of my head, in the back of <em>your</em> sketchbook — sorry, your margins are excellent drafting paper. I can build it. If I'm steady, I can build it." },
  { t: "narr", text: "Nobody says the obvious: that 'if' has been doing structural work all game." },

  /* ------------------------- raising the sanctuary ------------------------- */
  { t: "bg", id: "sanctuary", veil: true, drone: "veil", mood: { progress: 0 } },
  { t: "mini", name: "sanctuaryBuild", store: "sanctuary" },
  { t: "narr", text: "It rises like a ribcage for a heart the size of a town. Memories stream in as lights and nest in its vaults: first snows, last dances, the smell of one specific kitchen in 1994. Moyi sings them up the ramps. For one hour, the duet is winning, and it feels exactly like the montage they never got to have." },

  /* ------------------------- the tenant ------------------------- */
  { t: "narr", text: "Then the Sanctuary's foundation touches the one structure in the deep Veil that never fell — the true house — and the thing living inside it finally introduces itself." },
  { t: "bg", id: "houseVeil", veil: true, drone: "house", mood: { true: true, empty: true, lit: false } },
  { t: "narr", text: "It's the radio. The one from his garage — the one he's been restoring all game, the only machine he ever fixed without being able to say why. Its twin sits in the true house's basement, playing what the real one has been trying to tune into for nine years." },
  { t: "say", who: "radio", text: "—<em>krzzt</em>— is it on? it's on. okay. okokok. testing testing. this is paris from the future, um, recording on june ninth—" },
  { t: "narr", text: "A six-year-old's voice. His own. The night of the worst argument, recorded on a toy cassette deck pressed against a heating vent, because little kids tape things that frighten them; it makes the things smaller." },
  { t: "say", who: "radio", text: "—they're doing it again. the loud thing. i did the math like dad showed me. if the house is gone they have to stop fighting about the house. so i wish it. i'm allowed one wish per tape, those are the rules. <em>i wish the house would go away.</em> —krzzt—" },
  { t: "narr", text: "Eleven days later, faulty wiring that no six-year-old had ever touched burned the house to the ground. Nobody was hurt. Nobody was at fault. And a first-grader, doing the math like dad showed him, concluded that his feelings had a body count radius — and began building the basement, and the label, and the boy who doesn't do feelings." },
  { t: "say", who: "paris", text: "...I made the tape go away. I made the WISH go away. I moved nine hundred miles from a tape and it's been <em>broadcasting this whole time</em> and I fixed the radio myself. I carried the receiver to it. I—" },
  { t: "narr", text: "His Stability does not drop. Dropping is a behavior of things that still have somewhere to stand. It simply—" },
  { t: "hud", op: "removeStab" },
  { t: "sfx", name: "uiVanish" },
  { t: "narr", text: "—isn't there. The meter is gone from the screen. Not at zero. <b>Gone.</b> The player has managed that bar for seven chapters. The game just removed the steering wheel at speed." },

  /* ------------------------- the collapse ------------------------- */
  { t: "bg", id: "sanctuary", veil: true, drone: "silence", mood: { progress: 1, broken: 0 } },
  { t: "do", fn: async (S) => {
      // everything drafted under suppressed panic fails NOW, in the order it was built
      const cracks = Math.max(1, Math.min(5, S.crackedDrafts));
      const names = ["the mezzanine brace from the Galleria", "the graded bridge from the Labyrinth", "a stair he rushed the night you met", "the sound-shell's third rib", "the Sanctuary's east wing"];
      for (let i = 0; i < cracks; i++) {
        G.hud.toast("FAILING: " + names[i % names.length], true, 2600);
        G.audio.sfx.collapse(); G.fx.shake(10 + i * 2);
        G.paint.mood({ broken: (i + 1) / cracks * .8 });
        await G.U.sleep(1700);
      }
    } },
  { t: "narr", text: "Every hidden crack the player has been carrying since Chapter 2 cashes out at once, in order, like dominoes that waited politely for the worst night. Drafting controls answer backwards. Pull is push. Hold is drop. The interface of him is failing." },
  { t: "choice", id: "inverted", prompt: "HIS CONTROLS ARE INVERTED — to reach him, read everything backwards", options: [
      { k: "a", label: "PUSH HIM AWAY — (the controls are inverted. this pulls him in.)", sub: "trust the inversion" },
      { k: "b", label: "PULL HIM CLOSE — (the controls are inverted. this throws him into the breach.)", sub: "the honest-looking option. tonight, honesty looks wrong." },
  ], branch: {
      b: [ { t: "narr", text: "She pulls — and the inverted night throws him toward the breach; she catches his sleeve at the cost of the west vault, which goes up in light. The inversion does not care that she meant well. Inversions never do." }, { t: "meter", luc: -6 } ],
      a: [ { t: "narr", text: "She pushes — every instinct screaming — and the inverted night folds him back to her like a door swinging shut against a storm. Trusting the wrongness. There's a lesson in that she'd rather not have needed." } ],
  } },
  { t: "do", fn: () => G.paint.mood({ scatter: true, broken: 1 }) },
  { t: "fx", op: "on", args: ["ash"] },
  { t: "narr", text: "The Sanctuary goes. Not with a roar — with a <em>hush</em>: hundreds of sheltered memories blowing away like ash from a page, first snows and last dances and one specific kitchen, paid out into the dark. The spectacle peak of the game is also its quietest shot." },
  { t: "do", fn: () => G.paint.mood({ quiet: true }) },
  { t: "narr", text: "And through the wreckage, on-screen at last, walk two silhouettes holding hands, mouths sewn into serene smiles, footsteps making no sound on the ash because the ash recognizes its landlords. The Quiet surveys the ruin of the largest act of love ever drafted in Greyhollow, and says, with what can only be called tenderness:" },
  { t: "say", who: "quiet", text: "<em>We tried building one of those too.</em>" },

  /* ------------------------- triage ------------------------- */
  { t: "narr", text: "The breach is open. The conjunction is rising. Moyi's voice is one girl wide, and the night is a town wide. She cannot hold everything. The game means this." },
  { t: "do", fn: async (S) => {
      const items = [];
      if (G.state.hasMemory("bleachers")) items.push({ id: "bleachers", label: "The Bleacher Thread", desc: "the way back to where Senna was last felt" });
      if (G.state.hasMemory("endscreen")) items.push({ id: "endscreen", label: "Juniper's End Screen", desc: "the proof that logging off is survivable" });
      if (G.state.hasMemory("demolition")) items.push({ id: "demolition", label: "The Controlled Demolition", desc: "the proof that feelings can be expressed without casualties" });
      if (G.state.hasMemory("ribbon")) items.push({ id: "ribbon", label: "Asha's Volcano", desc: "the proof that you exist before your metrics" });
      if (G.state.hasMemory("flyer")) items.push({ id: "flyer", label: "The 1987 Flyer", desc: "W. + E. — the only written trace of the Quiet's names" });
      if (S.motherWoken) items.push({ id: "mom", label: "Her Mother's Waking", desc: "everything it cost. everything it bought." });
      items.push({ id: "town", label: "The Square's Strangers", desc: "two hundred people who never learned your name" });
      items.push({ id: "paris", label: "PARIS", desc: "he is standing in the breach doing arithmetic about acceptable losses, and his answer is himself" });
      const saved = await G.mini.pickN({
        title: "TRIAGE — her song can hold THREE things through the breach",
        note: "what does she sing to save? everything else scatters tonight. it does not come back by feeling bad about it later.",
        items, n: 3, confirm: "sing",
      });
      const savedIds = saved.map((s) => s.id);
      items.forEach((it) => { if (!savedIds.includes(it.id)) { S.flags["ash." + it.id] = true; G.state.mark("ash." + it.id, true, "scattered: " + it.label); } });
      savedIds.forEach((id) => G.state.mark("held." + id, true, "held through the breach: " + id));
      S.flags["paris.sungFor"] = savedIds.includes("paris");
      G.audio.motif("lullaby", { beat: .48 });
    } },
  { t: "narr", text: "Three things come through the breach wrapped in melody. The rest of the night belongs to the ash. The Calm Festival, robbed of its conjunction by a sheriff's permit war and a dying song, Hollow-fades only its front rows — a catastrophe instead of an extinction. This is what winning looks like tonight." },

  /* ------------------------- the apology ------------------------- */
  { t: "bg", id: "sanctuary", veil: true, drone: "silence", mood: { progress: 0, broken: 1, scatter: true, empty: false } },
  { t: "narr", text: "Rubble settles. It is still settling — that matters. Paris doesn't wait for it to finish. Apologizing into the dust, not after it's been swept: that's the whole difference between accountability and a press release." },
  { t: "if", cond: (S) => S.flags["paris.sungFor"], then: [
      { t: "say", who: "paris", text: "You spent a third of your voice on <em>me</em>. I watched you triage a town and pick— okay. Okay. Then I owe you the unmanaged version:" },
  ] },
  { t: "say", who: "paris", text: "I built our whole plan on a basement I refused to open. The cracks were mine. The Sanctuary was carrying them <em>because I was carrying them</em>, and I let you all stand under it anyway. I'm not asking you to tell me it wasn't my fault. Some of it was. I'm asking to keep building with you — with the cracks <b>on the drawings</b> this time, where everyone can read them." },
  { t: "choice", id: "apology", prompt: "as Moyi — the rubble is still moving. what does she do with it?", options: [
      { k: "accepted", label: "“Then we draw them together. All of them. Mine too.” — accept it, as an equal.", sub: "acceptance with terms. the terms are honesty." },
      { k: "absorbed", label: "“It's fine, Paris. It's FINE. Tonight just— it's fine.” — absorb it, to keep moving.", sub: "the kind of fine that compounds" },
  ] },
  { t: "do", fn: (S) => { S.apology = G.state.flag("choice.apology"); G.state.mark("apology", S.apology, "his apology was " + S.apology); } },

  /* ------------------------- zero ------------------------- */
  { t: "narr", text: "She stands up, and the world tips. She has been singing since sundown: the shelter, the triage, the breach. The meter the player has guarded for eight chapters pays out its last pixel—" },
  { t: "do", fn: (S) => { G.state.luc(-100); } },
  { t: "sfx", name: "staticBurst", args: [2] },
  { t: "narr", text: "—and Lucidity hits <b>zero</b> on the chapter's final frame." },
  { t: "card", text: "The screen does not fade to black.<br><br>It fades to <em>somewhere else.</em>" },
  { t: "card", wound: true, text: "The Sanctuary is ash. The town half-stands.<br>His meter is gone. Hers is empty.<br><br>And somewhere below every map the game ever showed you,<br>a door with her name on it is two letters from finished." },
];
G.CHAPTER_TITLES[7].tag = "rage · harm done to the people we love · accountability without self-annihilation";
