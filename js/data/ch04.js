/* CHAPTER 4 — The House He Built Twice ------------------------------------- */
G.script[4] = [
  { t: "title", n: 4 },
  { t: "bg", id: "street", mood: { nofigure: true }, drone: "night" },
  { t: "narr", text: "At 3:11 AM the Veil has an earthquake. Nothing in the real town moves, but every dog in Greyhollow stands up at the same time, and Moyi wakes with drywall dust in her dream." },
  { t: "say", who: "moyi", text: "Something surfaced. Big. Wrong-shaped — there are no foundations on that block, real or under. Paris isn't answering. Paris <em>always</em> answers; he treats his phone like a load-bearing wall." },

  { t: "bg", id: "houseVeil", veil: true, drone: "house", mood: {} },
  { t: "card", text: "A suburban house, in Greyhollow's underworld.<br>From three states away. Rebuilt brick by remembered brick.<br><br>It shouldn't exist here. It's been being built for months —<br>in secret, at night, by hand." },
  { t: "narr", text: "Moyi knows immediately whose it is. Architecture has handwriting, and she's watched this handwriting build staircases out of floors. The front door is unlocked the way a wound is unlocked." },
  { t: "choice", id: "enterHouse", prompt: "the door is not yours", options: [
      { k: "enter", label: "Go in. He could be hurt in there.", sub: "without permission" },
      { k: "knock", label: "Knock first — then go in anyway when no one answers.", sub: "with the gesture of permission" },
  ] },
  { t: "narr", text: "Inside, the air is loop-recorded: an argument plays through the walls, two adult voices fighting about the mortgage, the move, <em>her mother's offer</em> — the words half-melted, like a tape played thin. And the house is plural. Door after door, the same rooms, drafted again and again." },

  /* ------------------------- draft one: his fault ------------------------- */
  { t: "mini", name: "crackread", store: "house_fault", args: {
      title: "DRAFT ONE — the version where it was his fault",
      story: "This house is built guilty. The boy's crayon marks are framed like evidence. The argument loops loudest near his bedroom door. Listen, though — the words inside the fight: <em>the mortgage. the layoffs. your mother's offer.</em> Find the beam that lies.",
      beams: [
        { label: "HALLWAY BEAM", claim: "“The fights got worse every year.” (it bears weight: they did.)" },
        { label: "BEDROOM-DOOR LINTEL", claim: "“The fights were about the boy.” — every wall leans on this one.", lie: true },
        { label: "KITCHEN JOIST", claim: "“Nobody was sleeping well that winter.” (it bears weight: nobody was.)" },
        { label: "STAIR STRINGER", claim: "“A six-year-old heard every word through the vents.” (it bears weight: vents carry.)" },
      ],
    },
    after: async (out) => { G.state.d.crackedDrafts += out.wrongs; },
  },
  { t: "narr", text: "The lintel cracks and the whole guilty house exhales. The argument keeps playing — <em>mortgage, layoffs, offer</em> — and not once, in the entire loop, does it say a child's name. It never did. He just couldn't hear that from inside a six-year-old." },

  /* ------------------------- draft two: nobody's fault ------------------------- */
  { t: "mini", name: "crackread", store: "house_nofault", args: {
      title: "DRAFT TWO — the version where no one was at fault",
      story: "This house is pristine and reasonable. A framed inspection report hangs where family photos go. Plaque on the mantle: <em>ELECTRICAL FIRE — ACT OF GOD — NO ONE WAS HURT.</em> Everything here is true. So why does it feel like a showroom for a feeling no one bought? Find the beam that lies.",
      beams: [
        { label: "MANTLE BEAM", claim: "“It was the wiring. Old houses burn.” (it bears weight: they do.)" },
        { label: "PORCH COLUMN", claim: "“No one was hurt. Everyone got out.” (it bears weight: they did.)" },
        { label: "RIDGE BEAM", claim: "“No one was at fault — therefore nothing needs to be grieved.”", lie: true },
        { label: "FOUNDATION SILL", claim: "“The family was already breaking before the fire.” (it bears weight: quietly.)" },
      ],
    },
    after: async (out) => { G.state.d.crackedDrafts += out.wrongs; },
  },
  { t: "narr", text: "The ridge beam snaps like a sentence ending. Of course. A no-fault loss is still a <em>loss</em>. This house was a deal he'd drafted with himself: if nobody's guilty, nobody has to cry. The house never agreed to the deal. Houses don't." },

  /* ------------------------- draft three: it never happened ------------------------- */
  { t: "mini", name: "crackread", store: "house_never", args: {
      title: "DRAFT THREE — the version where it never happened",
      story: "Warm windows. A dinner that has been being eaten for nine years. Laughter on a loop with the seams sanded off. In this draft there was no fire, no moving truck, no silence in the cab of it. It's the most beautiful house Moyi has ever stood in, and her skin is trying to leave. Find the beam that lies.",
      beams: [
        { label: "DINING TABLE (load-bearing, here)", claim: "“We were happy some of the time.” (it bears weight: they truly were.)" },
        { label: "WINDOW HEADER", claim: "“The light did come in like this, October evenings.” (it bears weight: it did.)" },
        { label: "EVERY NAIL AT ONCE", claim: "“Nothing was lost, so nothing has to be carried.”", lie: true },
        { label: "DOORFRAME (pencil marks, heights)", claim: "“He was small here, once.” (it bears weight: 3'9”, age six.)" },
      ],
    },
    after: async (out) => { G.state.d.crackedDrafts += out.wrongs; },
  },

  /* ------------------------- the fight ------------------------- */
  { t: "narr", text: "She's reading the pencil-marked doorframe when the front door opens. Paris, with the night's dust on him and a coil of drafted rebar over one shoulder. He sees her in his house. <em>In all of his houses.</em>" },
  { t: "say", who: "paris", text: "Get out." },
  { t: "say", who: "moyi", text: "Paris — the quake. I thought something had you. Your door was—" },
  { t: "say", who: "paris", text: "It was <b>closed</b>. There's no version where it wasn't closed. You read yearbooks for gaps, you read seats for girls who aren't there — and you walked into the one structure in two worlds that is <em>none of your business.</em>" },
  { t: "say", who: "moyi", text: "I cracked your drafts. I'm sorry. I'm — no, you know what? I'm half sorry. You've been carrying a burnt house alone for nine years and building it <em>nightly</em>. That's not privacy, that's a slow-motion collapse with a privacy fence around it." },
  { t: "say", who: "paris", text: "You don't get to renovate me. I looked at your missing person and never once said the obvious — that maybe the seat is just a seat. You owe my house the same silence." },
  { t: "say", who: "moyi", text: "...That's not the same and you know it." },
  { t: "say", who: "paris", text: "It's exactly the same. Get. Out." },
  { t: "drone", name: "silence" },
  { t: "do", fn: (S) => { S.estranged = true; G.hud.meters(); } },
  { t: "narr", text: "She goes. The game goes with her: no music. No resonance. The link between the meters grays out like a name in an old yearbook — and for the first time, the player can feel exactly how much the duet was holding up." },

  /* ------------------------- the basement ------------------------- */
  { t: "bg", id: "basement", veil: true, drone: "silence", mood: { label: "do not feel this" } },
  { t: "narr", text: "Paris, alone, goes down. Every house he's ever drafted has had the same basement, and the basement has the same tenant." },
  { t: "narr", text: "A wrecking ball. At rest. Patient as a parked planet. Labeled — in his own six-year-old handwriting, in crayon pressed hard enough to tear paper — <em>DO NOT FEEL THIS.</em>" },
  { t: "say", who: "paris", text: "Hey. ...Yeah. Me too." },
  { t: "narr", text: "Above him, the argument-storm is feeding on the night's fight. The loops sharpen. The walls play HER voice now too — <em>that's not the same and you know it</em> — the house archiving Moyi into the noise. And then, through a cracked draft, he hears her real voice. Outside. Caught in the loop-storm between houses, where the air itself is argument." },
  { t: "do", fn: () => { G.fx.shake(8); G.audio.sfx.rumble(2, .3); } },
  { t: "say", who: "paris", text: "She came back. Of course she came back, she's load-bearing on people who aren't— <em>okay.</em> Okay. Nine years of 'do not feel this.' But the storm is made of held-in. You can't out-hold a storm of holding." },
  { t: "say", who: "paris", text: "...Controlled demolition. You bring a structure down <em>on purpose</em>, or it comes down on someone. Those are the only two endings a condemned house has ever had." },
  { t: "narr", text: "He puts his hand on the crayon label. He swings, for the first time, <em>deliberately.</em>" },
  { t: "mini", name: "wreckingBall", store: "demolition" },
  { t: "bg", id: "houseVeil", veil: true, drone: "silence", mood: { lit: false, empty: true, true: true } },
  { t: "narr", text: "One continuous shot: the guilty house folding into the no-fault house folding into the beautiful lie, dust rising in the shape of nine years, and under it all — her lullaby, the one from the tower, returning in a minor key like it had been waiting in the basement too." },
  { t: "narr", text: "The storm loses its food and disperses. Moyi stands in the settling quiet. Three houses are gone. One refuses." },
  { t: "say", who: "moyi", text: "...That one didn't fall." },
  { t: "say", who: "paris", text: "No. That's the true one. I've dropped a planet on it. It doesn't even dust. Moyi — I drafted four houses and I only remember building <em>three</em>. And there's a light on in the basement, and I never wire my drafts." },
  { t: "say", who: "moyi", text: "Something's living in your true house." },
  { t: "say", who: "paris", text: "Something's living in my true house. ...I yelled at you and you came back through an argument-storm." },
  { t: "say", who: "moyi", text: "You built me a staircase once. I figure I owe you infrastructure. We're not okay yet — you don't get 'okay' for free. But we're <em>standing</em>, and I've recently learned that's a technical term." },
  { t: "do", fn: (S) => { S.estranged = false; S.flags["house.tension"] = true; G.hud.meters(); } },
  { t: "drone", name: "night" },
  { t: "gain", kind: "memory", id: "demolition", label: "The Controlled Demolition", desc: "Three false houses, brought down on purpose, to a lullaby in a minor key. Nobody was standing under them.", loss: "lose the proof that feelings can be expressed without casualties" },

  { t: "card", wound: true, text: "STABILITY — now you know what the meter protects.<br>Drafting under suppressed panic leaves cracks only <em>you</em>, the player, can see.<br>He cannot perceive his own faults. You are now the keeper of them.<br><br>And one house refuses to fall. Something he didn't build is living in it." },
];
G.CHAPTER_TITLES[3].tag = "family collapse · perfectionism · the child's conviction that his feelings are a public hazard";
