/* CHAPTER 5 — The Choir of Hollow Voices (midpoint) ------------------------- */
G.script[5] = [
  { t: "title", n: 5 },
  { t: "bg", id: "clinic", drone: "town", mood: { hollowN: 2 } },
  { t: "card", text: "The Stillwater Initiative opens on a Tuesday.<br>Free for residents. Walk-ins welcome.<br><br><em>calm is a choice.</em>" },
  { t: "narr", text: "Participants come back after one session. They come back polite. They come back punctual. They come back the way a form comes back: filled in, and incapable of surprise." },
  { t: "say", who: "teacher", text: "Good morning, Moyi. Your essay was late. That's alright. Everything is alright. Have you considered the Initiative? I used to lie awake cataloguing everyone I'd disappointed. Now I sleep through the night." },
  { t: "say", who: "moyi", text: "Ms. Vale, last month you cried reading us the end of <em>Charlotte's Web</em>. You said the crying was the point of the assignment." },
  { t: "say", who: "teacher", text: "That sounds exhausting. <em>You children keep calling it giving up. We call it finally getting some sleep.</em>" },
  { t: "say", who: "paris", text: "Crackread on the clinic: the building's real, the paperwork's real, the calm is real. That's the problem. There's no lie to find. It's a genuine product and the town is genuinely buying." },
  { t: "say", who: "moyi", text: "It's the Quiet. It's gone <em>retail</em>. Why hunt the exhausted one by one when you can open a storefront and let them line up?" },
  { t: "narr", text: "On the clinic's sign-up clipboard, between a night-shift nurse and the man who plows the church lot, in handwriting that packed Moyi's lunches for eleven years: her mother's name. Appointment Thursday." },
  { t: "say", who: "moyi", text: "...She didn't even tell me. She picked up a pamphlet for <em>me</em> and signed it for <em>herself</em>." },

  /* ------------------------- the cathedral ------------------------- */
  { t: "bg", id: "cathedral", veil: true, drone: "choir", mood: {} },
  { t: "fx", op: "on", args: ["motes"] },
  { t: "card", text: "Stillwater, in the Veil:<br>a cathedral. Arches of filing cabinets. Light through windows of frosted consent forms.<br><br>And the Choir — every Hollowed resident, rows of them,<br>singing one perfect, terrible unison.<br><br>No harmony. Harmony requires difference." },
  { t: "meter", luc: -8 },
  { t: "narr", text: "Moyi's hum bends toward them on instinct — and snags. Waking a Hollowed person isn't a song. It's a <em>transplant</em>. The melody needs a seed: one of her own memories, spent whole. The Veil is very clear about the exchange rate, the way only honest predators are." },
  { t: "say", who: "paris", text: "Moyi. Read the math before you sing it. Whatever you seed them with — <em>you lose.</em> Not 'forget a little.' The game stops having it. We stop having it." },
  { t: "say", who: "moyi", text: "Four people in the front row, Paris. The teacher who cried at the right parts. The mail carrier who knows which houses stopped getting letters. Dev, who used to do calculus for <em>fun</em>. The librarian who keeps the town's whole attic in his head." },
  { t: "say", who: "moyi", text: "My voice can carry two seeds tonight. Two. Before it gives out. Don't ask me how I know my own register limits — I just <em>do</em>, the way you know a span limit." },

  { t: "do", fn: async (S) => {
      const cands = [
        { id: "vale", label: "Ms. Vale — the teacher", desc: "Cried at the right parts of books. Hollowed, she grades on time and feels nothing about Charlotte." },
        { id: "ruth", label: "Ruth — the mail carrier", desc: "Knows every address that stopped receiving letters, and exactly when. A walking map of the town's silences." },
        { id: "dev", label: "Dev — the classmate", desc: "Gifted-kid burnout, hollowed himself the week before finals. Used to leave the answers half-visible so others could catch up." },
        { id: "okafor", label: "Mr. Okafor — the librarian", desc: "Keeper of the archive, including the basement shelves no one signs out. Including 1987." },
      ];
      const picked = await G.mini.pickN({
        title: "THE CHOIR — your voice carries two seeds. choose who wakes.",
        note: "there is no way to wake everyone. there was never a way. the chapter is the triage.",
        items: cands, n: 2, confirm: "wake them",
      });
      for (const p of picked) {
        const kept = G.state.keptMemories().map((m) => ({ label: m.label, desc: m.desc, cost: "COST — " + m.loss, id: m.id }));
        const seed = await G.mini.choosePanel({
          title: "SEED FOR " + p.label.toUpperCase() + " — burn one of your own memories",
          note: "the game will genuinely forget it with you.",
          items: kept, confirm: "burn it", warn: true,
        });
        if (seed) {
          G.state.burnMemory(seed.id);
          G.audio.register("wake"); G.audio.motif("fragment", { beat: .5 });
          G.hud.toast("burned: “" + seed.label + "” — " + "the melody takes root", false, 5200);
        }
        if (!S.woke.includes(p.id)) S.woke.push(p.id);
        G.state.mark("woke." + p.id, true, "woke " + p.label);
        await G.U.sleep(1400);
      }
    } },
  { t: "narr", text: "The woken come up out of the unison coughing, like swimmers who'd agreed to drown. The first thing each of them does is <em>feel something</em> — and none of it is gratitude, and that's how Moyi knows it worked." },
  { t: "if", cond: (S) => S.woke.includes("okafor"), then: [
      { t: "say", who: "voice", text: "1987. You want the basement shelf, children. The radio station's old reel-to-reels. There was a duet act — local kids. The town loved them, and then the town... misplaced them. I kept the reels. I couldn't have told you why. <em>Now I remember why.</em>" },
      { t: "do", fn: (S) => G.state.mark("lore.1987early", true, "Okafor's reels — early lead on 1987") },
  ] },
  { t: "if", cond: (S) => S.woke.includes("ruth"), then: [
      { t: "gain", kind: "msg", id: "u_ruth", label: "to the house on Linden St.", from: "Ruth's undeliverable bag", body: "return to sender, addressee unknown — except Ruth remembers the addressee. Ruth remembers everyone now. The bag goes to the duet: evidence." },
  ] },

  /* ------------------------- her mother ------------------------- */
  { t: "narr", text: "And then the Choir parts, polite as a calendar, and her mother walks up the nave in her Thursday coat, early for her appointment in <em>both worlds</em>." },
  { t: "do", fn: () => G.paint.mood({ mom: true }) },
  { t: "say", who: "mom", text: "Moyi. You're here. That's nice. Everything is nice. I signed up because I was tired, baby. Tired of being frightened for you every single day since— since—" },
  { t: "narr", text: "The unison swells to catch her sentence before it can land anywhere that hurts. Her mother's face begins the smoothing. Moyi's voice can carry one more seed — barely — and the Veil names the price without being asked, the way only honest predators do:" },
  { t: "card", text: "To wake her mother, the seed must be the brightest thing Moyi carries.<br><br><b>Senna's face.</b><br><br>Not the friendship. Not the laugh. The <em>face</em> — gone from every flashback, every dream, every margin of every sketchbook, forever." },
  { t: "choice", id: "mother", prompt: "the midpoint's knife", options: [
      { k: "wake", label: "Sing. Burn Senna's face. Bring mom home feeling everything.", sub: "you will never see Senna's face again — the game means it", burn: true },
      { k: "leave", label: "Don't. Keep Senna whole. Let mom have the calm she chose.", sub: "she did sign the form herself. it was her choice. wasn't it?" },
  ], branch: {
      wake: [
        { t: "do", fn: (S) => { S.motherWoken = true; S.sennaFaceLost = true; if (!S.woke.includes("mom")) S.woke.push("mom"); G.state.mark("mother", "woken", "woke mother — spent Senna's face"); } },
        { t: "motif", name: "lullaby", opts: { beat: .5 } },
        { t: "narr", text: "Moyi sings the seed out of herself. Somewhere in her skull, a portrait turns its head away forever. Her mother surfaces sobbing — real, ugly, magnificent sobbing — and grabs her daughter like a railing." },
        { t: "say", who: "mom", text: "I was frightened FOR you, not OF you — oh, baby, who let me sand that down. Who let me— I'm sorry. I'm awake. I'm <em>awake.</em>" },
        { t: "narr", text: "That night Moyi opens her sketchbook to the dotted-line girl. Above the scarf, where the face goes: paper. Beautiful, merciless paper. She presses her thumb to it until the page warms. It doesn't help. She does it anyway." },
      ],
      leave: [
        { t: "do", fn: (S) => { S.motherWoken = false; G.state.mark("mother", "hollow", "left mother in the calm she chose"); } },
        { t: "narr", text: "Moyi lowers her unfinished note. Her mother smiles — a smile like a receipt — pats her daughter's cheek with a hand that remembers the gesture but not the reason, and takes her seat in the unison." },
        { t: "say", who: "moyi", text: "She <em>chose</em> it. People are allowed to choose it. If I overrule everyone who's tired, I'm just the Quiet with better PR. ...Say something, Paris. Tell me that math holds." },
        { t: "say", who: "paris", text: "...The math holds. It's the proof I can't stand. Come on. We're done singing tonight." },
        { t: "narr", text: "At home, breakfast happens on time now. Lunches appear, nutritionally complete. 'Good morning' arrives daily, like mail. Like mail to a house where no one's name is on anything." },
      ],
  } },
  { t: "meter", luc: -10 },

  { t: "if", cond: (S) => S.sennaFaceLost, then: [
      { t: "card", wound: true, text: "From this night on, Senna appears with her face blurred.<br>In every flashback. In every memory the game shows you.<br><br>This is not an effect that gets better.<br>The game never gives it back." },
    ], else: [
      { t: "card", wound: true, text: "Her mother sings in the unison now, by her own signature.<br>Breakfast is punctual. The house is calm.<br><br>Moyi has begun setting two alarms —<br>one to wake up, and one to make sure she still <em>wants</em> to." },
  ] },
];
G.CHAPTER_TITLES[4].tag = "burnout · numbness as a rational consumer choice · the horror is the interest rate";
