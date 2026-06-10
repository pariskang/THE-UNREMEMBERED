/* CHAPTER 3 — The Stream That Never Ended ---------------------------------- */
G.script[3] = [
  { t: "title", n: 3 },
  { t: "bg", id: "street", mood: { nofigure: true }, drone: "night" },
  { t: "narr", text: "The undelivered message addressed to <b>juniper_lol</b> won't sit still in Moyi's bag. At night it plays compression artifacts of a girl's voice saying <em>hey besties</em> to an empty room." },
  { t: "say", who: "moyi", text: "Juniper Vale. Greyhollow's only famous person, if you count 41,000 followers as famous, which Greyhollow absolutely did. Unremembered two years ago. Her mom runs the pharmacy and has one daughter and has always had... zero daughters." },
  { t: "say", who: "paris", text: "And the freight code on her bedroom went to the radio tower, not the mall. Which is wrong. The tower's been decommissioned since before we were born — there's no <em>structure</em> up there to store anything in." },
  { t: "say", who: "moyi", text: "There is in the Veil. I can hear it from my house when the wind's right. Chat messages. Donation pings. A stream that never ended." },
  { t: "narr", text: "Moyi doesn't mention her own account. The anonymous one. The one where she hums lullabies for strangers who can't sleep, and never shows her face, and reads every comment twice." },

  { t: "bg", id: "towerClimb", veil: true, drone: "tower", mood: { tier: 0, mode: "demand" } },
  { t: "fx", op: "on", args: ["chatGhosts"] },
  { t: "card", text: "The decommissioned tower, in the Veil:<br>still broadcasting. Always broadcasting.<br><br>The chat never closed. The viewers never left.<br>They just stopped having anywhere else to be." },
  { t: "narr", text: "The climb is made of her stream's timeline. Platforms of praise. Ledges of demand. The architecture changes depending on <em>how the room feels about her</em> — and the room can be retuned." },
  { t: "hud", op: "registers", list: ["wake", "lull", "shift"] },
  { t: "narr", text: "Third register: <b>SHIFT</b> — recolor a scene's emotional weather, and change what is possible inside it." },

  { t: "do", fn: async () => { // tier 1 — spikes of clipped quotes
      const say = (txt) => G.hud.toast(txt);
      let done = false;
      G.U.$("#dlg").classList.add("hidden");
      G.hud.toast("TIER 1 — the floor is spikes of clipped-out-of-context quotes");
      while (!done) {
        G.hud.registers(["wake", "lull", "shift"]);
        const r = await G.hud.pickRegister(); G.audio.register(r);
        if (r === "shift") { done = true; G.state.mark("tower.t1", "shift", "tier 1 opened with SHIFT"); G.paint.mood({ mode: "adoration", tier: 1 }); say("the weather turns to adoration — the floors rise to carry you"); }
        else if (r === "lull") { say("the quotes drowse… and sharpen again. you can't soothe a misquote."); G.state.luc(-3); }
        else { say("the quotes WAKE — they remember their original sentences and grieve. climb is worse."); G.state.luc(-3); }
      }
    } },
  { t: "narr", text: "Under <em>adoration</em>, the tower is warm and rising. Hearts drift up like thermal lift. It would be easy to mistake this floor for solid." },
  { t: "do", fn: async () => { // tier 2 — adoration turns syrup-thick
      let done = false;
      G.U.$("#dlg").classList.add("hidden");
      G.hud.toast("TIER 2 — the love thickens. hands of light reach to keep you HERE, adored, forever");
      while (!done) {
        G.hud.registers(["wake", "lull", "shift"]);
        const r = await G.hud.pickRegister(); G.audio.register(r);
        if (r === "lull") { done = true; G.state.mark("tower.t2", "lull", "tier 2 soothed with LULL"); G.paint.mood({ tier: 2 }); G.hud.toast("you sing the grasping light to sleep, gently, like closing a hundred tabs"); }
        else if (r === "shift") { G.hud.toast("the weather flips to demand — the spikes again. worse, they want CONTENT."); G.state.luc(-3); G.paint.mood({ mode: Math.random()<.5?"demand":"adoration" }); }
        else { G.hud.toast("the love wakes fully and becomes a wall of WE MISS YOU. you can't climb a wall of that."); G.state.luc(-3); }
      }
    } },
  { t: "do", fn: async () => { // tier 3 — the sealed first broadcast
      let done = false;
      G.U.$("#dlg").classList.add("hidden");
      G.hud.toast("TIER 3 — a sealed landing: her first broadcast, locked inside the architecture");
      while (!done) {
        G.hud.registers(["wake", "lull", "shift"]);
        const r = await G.hud.pickRegister(); G.audio.register(r);
        if (r === "wake") { done = true; G.state.mark("tower.t3", "wake", "tier 3 unsealed with WAKE"); G.paint.mood({ tier: 3 }); G.hud.toast("the landing remembers being a beginning — and opens"); }
        else { G.hud.toast("the seal holds. this isn't weather and it isn't feral. it's a memory, and memories want to be WOKEN."); G.state.luc(-3); }
      }
    } },
  { t: "meter", luc: -5 },
  { t: "narr", text: "On the sealed landing, her first stream plays: a fourteen-year-old in a beanie, six viewers, saying <em>“oh my god, six whole people”</em> with a joy that hadn't learned to perform itself yet." },

  /* ------------------------- the top ------------------------- */
  { t: "bg", id: "towerTop", veil: true, drone: "tower", mood: {} },
  { t: "say", who: "juniper", text: "—and we're BACK, besties, day seven hundred and… day seven hund— okay chat, chat, be honest, what day is it. Don't look it up. Don't—" },
  { t: "narr", text: "She is neither dead nor captive. She is <em>hosting</em>. Her outline is made of ring-light; where the chat's love touches her she is vivid, and where it doesn't she simply isn't." },
  { t: "say", who: "chat", text: "jun pls one more song · don't end it · my house is so quiet jun · stay · STAY · stay" },
  { t: "say", who: "juniper", text: "New viewers! Welcome welcome — okay this is awkward, you two are like... <em>solid.</em> Mods, are they solid? Why are they solid?" },
  { t: "say", who: "moyi", text: "Juniper. The stream's been live for two years. You can end it. There's an end button — there's always an end button." },
  { t: "say", who: "juniper", text: "Oh, babe. No. No no. You don't get it — look at them. <em>Listen</em> to them. Some of these usernames, I'm the only voice in their house. If I log off, where does all of that <b>go?</b>" },
  { t: "say", who: "juniper", text: "And, um. Follow-up question, asked totally casually: if I log off... where do <em>I</em> go? Because I checked, besties. There's no me behind the camera anymore. The chat's love is the only thing holding my shape." },
  { t: "say", who: "paris", text: "...She's right. Crackreading her is like reading a building with no foundation — she's a roof held up by weather. If the stream ends and there's nowhere for the love to land, she drops." },
  { t: "say", who: "moyi", text: "Then we build somewhere for it to land. <em>Both directions.</em> Paris — I need the one structure no streamer ever drafts for themselves." },
  { t: "say", who: "paris", text: "...An End Screen. Yeah. Give me a minute. I've never built a <em>goodbye</em> before; I want the joints to hold." },
  { t: "do", fn: () => { G.paint.mood({ endscreen: true }); G.audio.sfx.chime(true); } },
  { t: "narr", text: "It rises behind her like a sunrise in reverse: THANK YOU FOR WATCHING. YOU CAN GO TO SLEEP NOW. And Moyi — who hums for strangers and has never once let an audience see her — steps into frame." },
  { t: "mini", name: "rhythm", store: "lullaby_audience", args: { beats: 8, hint: "the first lullaby of the game, sung TO an audience — press on the pulse" },
    after: async (out) => { G.state.mark("ch3.lullaby", out.hits >= 6 ? "true" : "shaky", "lullaby for the chat: " + out.hits + "/8"); } },
  { t: "narr", text: "She sings to the chat. Not at them — <em>to</em> them. To viewer #4,116 in a silent house. The usernames glow one by one, like windows going warm, and the love finally has somewhere to be that isn't a girl's outline." },
  { t: "do", fn: () => { G.state.deliver("u3"); G.fx.burst("petals", 30); } },
  { t: "narr", text: "Moyi delivers the two-year-old draft. <em>your stream is the only voice in my house.</em> Juniper reads it, and laughs, and cries the way you do when something is finally allowed to be heavy." },
  { t: "say", who: "juniper", text: "Chat... besties... thank you for seven hundred days. I'm gonna do something I should have done a long time ago. I'm gonna say goodnight <em>and mean it.</em>" },
  { t: "narr", text: "She reaches past the camera. The screen card glows. The stream that never ended — ends. Not with a cut. With a <em>tuck-in</em>." },
  { t: "do", fn: () => { G.fx.off("chatGhosts"); G.audio.duck(.15, 4); } },
  { t: "gain", kind: "memory", id: "endscreen", label: "Juniper's End Screen", desc: "THANK YOU FOR WATCHING. YOU CAN GO TO SLEEP NOW. The first goodbye ever built on purpose.", loss: "lose the proof that logging off is survivable" },

  { t: "bg", id: "street", mood: { nofigure: true }, drone: "town" },
  { t: "narr", text: "Three days later, Greyhollow has a pharmacy with a daughter again. The town absorbs her return the way it absorbs everything: by deciding it was always so. Only the duet, the sheriff, and Juniper herself keep the seam." },
  { t: "say", who: "juniper", text: "Before it took me, it <em>talked</em> to me. The Quiet. Everyone assumes it's a thing, but it spoke like a person. Actually—" },
  { t: "say", who: "juniper", text: "—like two people. In harmony. A voice that sings and a voice that... <em>measures</em>. They finished each other's silences. Whatever the Quiet is, it used to be a <b>pair</b>." },
  { t: "card", wound: true, text: "A singer and a measurer. Two voices, perfectly in tune.<br><br>The Quiet has been a duet all along —<br>and it has already met one of you." },
];
G.CHAPTER_TITLES[2].tag = "parasocial grief, from both directions · the audience and the cage";
