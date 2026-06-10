/* CHAPTER 1 — The Girl Nobody Remembers ------------------------------------
   Cold open in second person: the player is Senna for ten minutes.
--------------------------------------------------------------------------- */
G.script = G.script || {};
G.script[1] = [
  { t: "drone", name: "night" },
  { t: "card", text: "You are walking home.<br><br>You know this because the game says so —<br>the objective marker, the little map, the bar that proves you're alive.<br><br>Hold on to those.<br><em>While you can.</em>" },

  { t: "bg", id: "street", mood: { walk: 0, phoneGlow: false }, drone: "town" },
  { t: "hud", op: "fake" },
  { t: "fx", op: "on", args: ["motes"] },
  { t: "you", text: "Greyhollow at 9:47 PM. Sodium light the color of flat orange soda. Every house is watching television at itself." },
  { t: "you", text: "You are sixteen blocks from your bed and three drafts deep into a text you will not send." },
  { t: "do", fn: () => G.paint.mood({ phoneGlow: true }) },
  { t: "you", text: "You take out your phone. The screen is the brightest thing on the street. It always is." },

  { t: "mini", name: "phone", store: "senna_text", args: {
      thread: [
        { t: "ok but the bus thing was NOT my fault", me: false },
        { t: "it was 100% your fault and also iconic", me: true },
        { t: "lmaooo ok. sleep well moyi", me: true, faded: true },
        { t: "you up?", me: false, faded: true },
      ],
      draft: "hey. can i tell you something weird? lately i feel like i'm becoming see-through. like if i stop posting, stop answering, stop performing senna… there's nothing underneath. you'd tell me if i was already gone, right?",
    },
    after: async (out) => { G.state.mark("senna.triedSend", out.triedSend, out.triedSend ? "Senna tried to send it" : "Senna never tried"); },
  },

  { t: "you", text: "Deleted. Better. Moyi worries, and worry is a weight, and you are so tired of being carried." },
  { t: "narr", text: "The streetlights begin to hum." },
  { t: "do", fn: () => { G.paint.mood({ flicker: true }); G.audio.sfx.staticBurst(1.2); } },
  { t: "sfx", name: "heartbeat", args: [2] },
  { t: "you", text: "Not the electric hum. A held note. A <em>throat</em> sound. The kind of tone someone makes when they're deciding whether to speak." },
  { t: "you", text: "You stop walking. The hum is coming from inside the light." },

  { t: "narr", text: "Something in the interface flinches." },
  { t: "hud", op: "fakeStrip" },
  { t: "do", fn: () => G.paint.mood({ fading: true }) },
  { t: "you", text: "No bar. No map. No objective. You check your phone — the thread with Moyi is there, but your half of it is <em>unbraiding</em>, message by message, like stitches coming out." },
  { t: "you", text: "It doesn't hurt. That's the worst part. It feels like finally putting something heavy down." },
  { t: "narr", text: "A voice made of two voices, perfectly in tune:" },
  { t: "say", who: "voice", text: "<em>You don't have to be perceived anymore. We have a place for girls who are tired of being looked at and never seen. Nothing will ever hurt you again.</em>" },
  { t: "you", text: "You should be screaming. You should call Moyi. You should—" },
  { t: "hud", op: "erodeName" },
  { t: "wait", ms: 2700 },
  { t: "you", as: "noone", text: "you should" },
  { t: "you", as: "noone", text: "you" },
  { t: "do", fn: () => { G.fx.flash(.8, 300); G.audio.sfx.uiVanish(); G.audio.sfx.staticBurst(1.6); } },
  { t: "hud", op: "fakeHide" },
  { t: "card", text: "<em>— signal lost —</em><br><br>EIGHT MONTHS LATER" },

  { t: "title", n: 1 },

  /* ------------------------- eight months later ------------------------- */
  { t: "bg", id: "kitchen", drone: "town" },
  { t: "hud", op: "show" },
  { t: "do", fn: () => { G.state.d.resonance = false; G.hud.meters(); } },
  { t: "say", who: "mom", text: "Moyi. Look at me. The school counselor called again." },
  { t: "say", who: "moyi", text: "Because I asked about Senna's transcript. That's not a crime, mom, that's <em>paperwork</em>." },
  { t: "say", who: "mom", text: "There is no Senna, baby. There was never a Senna in your class. We've been through the yearbook—" },
  { t: "say", who: "moyi", text: "The yearbook has a <b>gap</b>. Page thirty-one, between Reyes and Sharma, there's a space where the layout breathes wrong. Someone was there." },
  { t: "say", who: "mom", text: "You've always had... so much imagination. The clinic that's opening — Stillwater — they have a program for exactly this kind of rumination. I picked up a pamphlet. That's all. A pamphlet." },
  { t: "narr", text: "The pamphlet is the color of a held breath. On the cover, a pond with no ripples in it, and the words: <em>calm is a choice.</em>" },
  { t: "say", who: "moyi", text: "I'm not ruminating. I'm <em>remembering</em>. Apparently I'm the only one in this town still doing it." },
  { t: "narr", text: "Her mother's face does something complicated — the thing where worry has been worn so long it fits like a face. Moyi leaves before it finishes." },

  { t: "bg", id: "bleachers", mood: {}, drone: "night" },
  { t: "hud", op: "objective", text: "the bleachers — third row, fourth seat" },
  { t: "narr", text: "School field, 11 PM. Moyi's sketchbook is full of the same drawing: a girl made of dotted lines, labeled in marginalia only Moyi can read." },
  { t: "say", who: "moyi", text: "Third row. Fourth seat. You ate lunch here every day it didn't rain, and twice when it did, because we were committed to the bit." },
  { t: "say", who: "moyi", text: "Everyone says I sat here alone. The seat <em>disagrees</em>. I can feel it disagreeing." },
  { t: "narr", text: "She hums. It's a nervous habit. It has always been a nervous habit. It has never once made the air change temperature, until—" },
  { t: "mini", name: "holdHum", args: { x: 400, y: 290, hint: "hold — hum the nervous habit" } },
  { t: "do", fn: () => { G.paint.mood({ thread: true }); G.audio.sfx.threadHum(); } },
  { t: "narr", text: "A filament of light crawls out of the fourth seat like a vein finding its pulse. It is the exact color of being remembered." },
  { t: "say", who: "moyi", text: "...okay. Okay okay okay. Either I'm finally as unwell as everyone's been implying, or the bleachers just <em>agreed with me</em>." },

  { t: "hud", op: "registers", list: ["wake"] },
  { t: "narr", text: "The hum wants a shape. Her voice knows three. Tonight it learns the first: <b>WAKE</b> — the register that rouses what a place still feels." },
  { t: "sing", id: "bleachers", registers: ["wake"], prompt: "sing — to the seat, to the thread, to whoever is still listening" },
  { t: "gain", kind: "memory", id: "bleachers", label: "The Bleacher Thread", desc: "The seat remembered her even when the yearbook didn't. Lunches, rain, the committed bit.", loss: "lose the thread back to where Senna was last felt" },
  { t: "narr", text: "The seat plays its memory like a struck bell: a laugh, cut off mid-breath. A voice saying <em>moyi, you absolute—</em> and then eight months of nothing, folded into one second." },
  { t: "say", who: "moyi", text: "Senna. That's your laugh. I'd know it compressed, corrupted, at any bitrate. <em>Where did they file you?</em>" },

  { t: "narr", text: "The thread tugs. Threads connect places to the feelings that happened in them — and they can be <em>walked</em>." },
  { t: "mini", name: "threadstep", args: { hint: "THREADSTEP — click a lit node. you can only step where something was once felt." } },
  { t: "meter", luc: -6 },
  { t: "narr", text: "The last step doesn't land. The world tilts sideways into somewhere that has been waiting, and the night swallows its own streetlights." },

  /* ------------------------- the first veildive ------------------------- */
  { t: "bg", id: "schoolVeil", veil: true, drone: "veil" },
  { t: "fx", op: "on", args: ["msgSnow"] },
  { t: "card", text: "The school. At night. <em>Underneath</em> the school at night.<br><br>The hallway is one door longer than it should be, and the text on every poster is almost legible, the way words are in dreams." },
  { t: "narr", text: "Unsent messages drift down like snow. Every locker leaks sound: conversations that almost happened, apologies drafted against locker doors and swallowed at the bell." },
  { t: "say", who: "moyi", text: "I know this place. I've drawn this place without ever seeing it. This is where the unfelt things go to keep being unfelt." },
  { t: "meter", luc: -6 },
  { t: "narr", text: "Something detaches from the lockers. A flock. A <em>murmuration</em> — hundreds of overheard fragments flying in formation, every whisper that ever circled her in a hallway, now circling for real." },
  { t: "mini", name: "murmurationEscape", store: "murmuration" },
  { t: "narr", text: "They press in — <em>weird girl, always alone, did you hear</em> — and the floor, impossibly, politely, <b>re-architects itself</b>." },
  { t: "do", fn: () => { G.paint.mood({ paris: true }); G.audio.sfx.rumble(1.4, .2); G.fx.shake(6); } },
  { t: "narr", text: "Tiles stand up out of the floor and become a staircase, the way an idea becomes a sentence. At the top of it: a boy with a tool roll, looking exactly as surprised as she is." },

  { t: "say", who: "paris", text: "...You can see me. You're — in here, and you can see me. Okay. Don't take the fourth stair, I rushed the joinery." },
  { t: "say", who: "moyi", text: "You built a staircase. Out of <em>floor</em>. While a flock of gossip tried to eat me." },
  { t: "say", who: "paris", text: "It wasn't going to eat you. It was going to <em>quote you out of context forever</em>, which is worse. Come on." },
  { t: "say", who: "moyi", text: "You're the new kid. Paris. You moved into the Harlan place — nobody moves <em>into</em> Greyhollow." },
  { t: "say", who: "paris", text: "And you're the girl who argues with yearbooks. I notice structures. Yours is — sorry, no offense — yours is load-bearing on a person who isn't there." },
  { t: "say", who: "moyi", text: "She <b>is</b> there. That's the whole point. She's the only thing in this town that's anywhere." },
  { t: "narr", text: "Above them, the murmuration reforms into a single sentence and holds it, like a sky writing a verdict:" },
  { t: "card", text: "<em>SHE LEFT THE DOOR OPEN ON PURPOSE.</em>" },
  { t: "say", who: "paris", text: "...We should not be here when it learns punctuation. There's a seam two lockers down. I can hold it open for exactly one person plus one stubborn person." },
  { t: "meter", luc: -4 },

  { t: "bg", id: "street", mood: { nofigure: false, walk: 0 }, drone: "town" },
  { t: "narr", text: "They surface behind the gym, in the real night, gasping in the ordinary air. The streetlights are just streetlights. Probably." },
  { t: "say", who: "paris", text: "Rule one: we don't tell adults. Adults in this town have a way of... <em>smoothing over</em>. Rule two: I don't do feelings, I do structures." },
  { t: "say", who: "moyi", text: "Joke's on you. In there, those are the same thing." },
  { t: "narr", text: "He doesn't answer. But he doesn't leave either, and in Greyhollow that's practically a signature on a contract." },

  { t: "card", wound: true, text: "Senna's last text was deleted, not unsent.<br>The interface can be taken from you, piece by piece — it happened while you were holding it.<br><br><em>Did she leave the door open on purpose?</em>" },
];
G.CHAPTER_TITLES[0].tag = "being forgotten while alive · the unsent message as a haunted object";
