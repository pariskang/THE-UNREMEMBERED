/* CHAPTER 2 — The Mall of Unsent Messages --------------------------------- */
G.script[2] = [
  { t: "title", n: 2 },
  { t: "bg", id: "mallExt", drone: "night" },
  { t: "hud", op: "show" },
  { t: "hud", op: "objective", text: "the dead Galleria — where unremembered things get trucked" },
  { t: "narr", text: "Two weeks of side-by-side research conducted the way teenagers actually ally: shoulder to shoulder, eyes forward, half-jokes carrying full confessions." },
  { t: "say", who: "moyi", text: "So your file on me probably says 'delusional, draws in margins, hums at furniture.'" },
  { t: "say", who: "paris", text: "It says 'sample size one, but the furniture hummed back.' I checked the county records. When someone gets... filed, their stuff gets a freight code. Same code every time. Same destination." },
  { t: "say", who: "moyi", text: "The Galleria. They've been trucking unremembered people's bedrooms into a dead mall. That's either a conspiracy or the saddest museum in America." },
  { t: "say", who: "paris", text: "The structure's wrong, by the way. The mall. It has more inside than outside. I can read it from the parking lot — like a coat with too many pockets." },
  { t: "choice", id: "alliance", prompt: "the terms of the alliance — say it without saying it", options: [
      { k: "joke", label: "“If I get filed in there, you have to remember me. Contractually.”", sub: "a half-joke carrying a full confession" },
      { k: "honest", label: "“I'm scared no one will look for me the way I'm looking for her.”", sub: "no joke at all. eyes forward." },
      { k: "deflect", label: "“Let's just say you're the crowbar and I'm the flashlight.”", sub: "strictly logistics. safer." },
  ] },
  { t: "say", who: "paris", text: "...Noted. Filed. <em>Load-bearing.</em> Let's go in before I think about it." },

  /* ------------------------- inside: open for business ------------------------- */
  { t: "bg", id: "mallVeil", veil: true, drone: "mall", mood: { clerk: false } },
  { t: "fx", op: "on", args: ["msgSnow"] },
  { t: "card", text: "In the real Greyhollow, the Galleria died in 2014.<br><br>In the Veil, it never closed. The hold-music never resolved.<br>Every storefront sells a category of unsaid thing." },
  { t: "narr", text: "APOLOGIES. CONFESSIONS. GOODBYES. A kiosk in the middle distance sells nothing but <em>u up?</em>s, fanned out like duty-free perfume." },
  { t: "do", fn: () => G.paint.mood({ clerk: true }) },
  { t: "say", who: "clerk", text: "Welcome to the Galleria. Everything you never said, kept safe, kept <em>pristine</em>. Browse freely. Nothing leaves the building." },
  { t: "say", who: "moyi", text: "What if something wants to leave? What if it was always meant to be delivered?" },
  { t: "say", who: "clerk", text: "Delivery voids the warranty, miss. A delivered message can be <em>answered</em>. We can't guarantee anyone's safety after that. In stock, never delivered — that's the Galleria promise." },
  { t: "narr", text: "The Clerk has no face — just the polite suggestion of one, like a name tag where a person should be. It bags nothing, beautifully." },

  { t: "narr", text: "Moyi pockets what calls to her. The messages weigh nothing and also exactly as much as the person who didn't send them." },
  { t: "gain", kind: "msg", id: "u1", label: "to dad (drafts: 41)", from: "a kid from the trailer court", body: "i got the scholarship. i didn't tell you because you'd make it about you. i wanted one thing that was mine. it's been four years. it was mine." },
  { t: "gain", kind: "msg", id: "u2", label: "to the group chat", from: "someone who left", body: "you renamed the chat after the lake trip and i wasn't on the lake trip. i checked it every day for a year anyway. good luck at state, i guess." },
  { t: "gain", kind: "msg", id: "u3", label: "to juniper_lol", from: "viewer #4,116", body: "your stream is the only voice in my house most nights. if you ever stop i don't know what the quiet would do to me. no pressure lol. (draft, 2 yrs)" },
  { t: "say", who: "paris", text: "Why does that one have a return address <em>inside the mall?</em>" },
  { t: "say", who: "moyi", text: "...File that. We're going to need it." },

  /* ------------------------- lull + first resonance ------------------------- */
  { t: "narr", text: "From the atrium: a sound like an avalanche clearing its throat. The hold-music stutters. Even the Clerks stop pretending to fold." },
  { t: "hud", op: "registers", list: ["wake", "lull"] },
  { t: "narr", text: "Her voice finds its second register on pure instinct: <b>LULL</b> — the one that pacifies what feeling has turned feral." },
  { t: "say", who: "paris", text: "Whatever's in the food court is big. Your song won't reach the third floor — sound dies in this atrium, the architecture eats it. <em>Unless someone redesigns the architecture.</em>" },
  { t: "say", who: "moyi", text: "Build me a shell. I'll fill it." },
  { t: "narr", text: "He kneels, palms to the tile, and drafts: ribs of translucent structure blooming up the atrium like the inside of an instrument. First duet. Nobody counts them in." },
  { t: "mini", name: "resonance", store: "resonance1" },
  { t: "do", fn: (S) => { S.resonance = true; G.hud.meters(); } },
  { t: "narr", text: "Her lullaby fills three stories like water finding a glass. His structure stops being scaffolding and becomes <em>warmth with geometry</em>. Both of them pretend this is normal. Neither heart rate agrees." },

  /* ------------------------- the backlog ------------------------- */
  { t: "bg", id: "foodcourt", veil: true, drone: "veil", mood: {} },
  { t: "narr", text: "The food court is an amphitheater now, and on its stage: a glacier. Seven years of one man's unsent apologies, compressed into blue ice, calving drafts the size of car doors." },
  { t: "say", who: "paris", text: "It's not hostile. It's <em>over-full</em>. Structurally it's a dam, and the reservoir is somebody's whole chest." },
  { t: "say", who: "moyi", text: "Then we don't fight it. We <em>deliver</em> it. Oldest wound first — you can see the strata. Wrong order and the whole thing comes down on us." },
  { t: "do", fn: () => G.paint.mood({ calving: true }) },
  { t: "do", fn: () => { ["b1","b2","b3","b4"].forEach((id,i)=>G.state.gainMsg(id, ["to theo, 2019","to theo, 2021","to theo, 2023","to theo, last week"][i], "the man under the glacier", "")); } },
  { t: "mini", name: "orderDeliver", store: "backlog", args: {
      title: "THE BACKLOG — deliver the apologies, oldest wound first",
      note: "read them. the dates are inside the words, not on them.",
      items: [
        { id: "b2", order: 2, label: "“I should have come to the funeral.”", body: "…I told myself you wanted space. You wanted a brother. I mailed flowers like a coworker." },
        { id: "b4", order: 4, label: "“I'm outside.”", body: "Two words. Drafted in a truck across the street from your porch light, eleven times this year." },
        { id: "b1", order: 1, label: "“I shouldn't have laughed.”", body: "You were nineteen and you told me what you wanted to be, and I laughed, and you folded it up so small. It started here. Everything started here." },
        { id: "b3", order: 3, label: "“I heard you got sober.”", body: "I practiced saying 'I'm proud of you' in the cruiser mirror. It sounded like an arrest. I never risked it." },
      ],
      wrong: "the glacier GROANS — a mezzanine shears loose overhead. Paris catches it with a drafted brace, jaw tight, pretending his hands aren't shaking.",
    },
    after: async (out) => { if (out.tries > 0) { G.state.d.crackedDrafts += 1; G.state.stab(-6); } },
  },
  { t: "narr", text: "The last apology leaves like a bird that forgot it was one. The glacier exhales seven years in one long unspectacular breath — and is a man. Sitting in the wreckage of a food court. Wearing a sheriff's jacket." },

  { t: "say", who: "sheriff", text: "...You kids shouldn't — <em>hh.</em> You delivered them. In order. I've been trying to organize that ice for seven years; it's why I patrol past the Galleria. I thought it was just bad sleep." },
  { t: "say", who: "moyi", text: "You're the sheriff. You're an <em>adult</em>. Adults aren't supposed to have a floor down here." },
  { t: "say", who: "sheriff", text: "Kid, who do you think poured the foundation? Every speed trap on Route 9, I sat there drafting to my brother. This town runs on unsaid. Has since before you were born — since '87, if the old-timers' silence means anything." },
  { t: "say", who: "paris", text: "What happened in '87?" },
  { t: "say", who: "sheriff", text: "That's the thing. <em>Nobody remembers.</em> And in this town, that means it mattered. ...Theo's porch light is still on. I'm going to go stand under it like a man instead of a glacier. You two — whatever you're doing — my radio's channel 9. I remember things now. Use that." },
  { t: "do", fn: (S) => { S.flags["ally.sheriff"] = true; G.state.mark("ally.sheriff", true, "the sheriff remembers"); } },
  { t: "gain", kind: "memory", id: "holdmusic", label: "The Hold-Music Atrium", desc: "The first resonance: his shell, her lullaby, three stories of hold-music finally resolving.", loss: "lose the proof that the duet works" },

  { t: "card", wound: true, text: "The Backlog was the sheriff's.<br>The Veil isn't haunted by monsters. It is built, floor by floor,<br>out of <em>the adults' feelings too.</em><br><br>And something happened in 1987 that the whole town forgot in unison." },
];
G.CHAPTER_TITLES[1].tag = "social anxiety · the gap between the drafted self and the sent self";
