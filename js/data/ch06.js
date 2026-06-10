/* CHAPTER 6 — The Examination ----------------------------------------------- */
G.script[6] = [
  { t: "title", n: 6 },
  { t: "bg", id: "labyrinth", veil: true, drone: "exam", mood: { lead: "paris", futures: true } },
  { t: "card", text: "Finals week.<br><br>The high school's reflection in the Veil metastasizes overnight:<br>exam halls without end, invigilated by everyone's projected futures —<br>flawless adults seated at the desks, <em>grading their own pasts.</em>" },
  { t: "narr", text: "Asha Rahman — top of the class since the trophy case still updated — walked into a study room three days ago and hasn't walked out. Her scholarship interview is Thursday. Her family has been lighting the good candles." },
  { t: "say", who: "paris", text: "Weird. The Labyrinth's ignoring me. No transcript, seven schools in nine years — to this place I'm unmeasurable. I walk through it like weather." },
  { t: "say", who: "moyi", text: "It is <em>not</em> ignoring me. Every clock in here just turned to face me. I've had eleven years of 'wasted potential' speeches, Paris. This place can smell a percentile it never got to assign." },
  { t: "if", cond: (S) => S.woke.includes("dev"), then: [
      { t: "say", who: "voice", text: "Dev — on the phone, awake, doing calculus for fun again: “Listen — I've been in there. The trick is the grades aren't ATTACHED to anything. There's no rubric behind the rubric. Once you feel that in your hands, the place loses its gravity.”" },
  ] },
  { t: "say", who: "paris", text: "Role reversal, then. I lead. You stay low. If a Rubric reads you, it'll file you as a number, and I am <em>not</em> explaining to the sheriff that I lost you to long division." },

  /* ------------------------- paris is graded ------------------------- */
  { t: "narr", text: "The Labyrinth can't measure Paris — so it measures his <em>work</em>. The moment he drafts a bridge over the proctor's moat, a red pen the size of a roof beam descends from the fluorescent sky." },
  { t: "mini", name: "gradedDraft", store: "graded" },
  { t: "say", who: "paris", text: "...The F-span and the A-span are the same draft. Same joinery, same load path. I checked. <em>I checked twice.</em>" },
  { t: "say", who: "moyi", text: "Welcome to school, new kid. The grade isn't measuring the bridge. It's measuring whether you'll keep building while something pretends to measure you." },
  { t: "do", fn: (S) => { if (G.state.flag("mini.graded")) { } S.flags["graded.lesson"] = true; G.state.mark("graded.lesson", true, "the rubric was never posted"); } },
  { t: "meter", stab: -6 },
  { t: "narr", text: "He builds the rest of the crossing under the descending pen, every span stamped with a verdict that correlates with nothing. The bridge holds. His jaw doesn't, quite. The player can see one new hairline crack that he can't." },
  { t: "do", fn: (S) => { S.crackedDrafts += 1; } },

  /* ------------------------- moyi is hunted ------------------------- */
  { t: "do", fn: () => G.paint.mood({ rubrics: true, rubricN: 2 }) },
  { t: "narr", text: "Deeper in, the hall narrows to rows of desks under sweeping sightlines. The wardens: <b>Rubrics</b> — tall, patient things with scantron faces, reducing whoever they catch to a percentile and a seat assignment. They have Moyi's scent: pure unrealized potential. Their favorite." },
  { t: "mini", name: "rubricStealth", store: "stealth" },
  { t: "narr", text: "She makes the far door with her percentile unassigned. One Rubric stands over an empty desk for a long moment, bubbling in a form for a student who isn't there. It does not seem capable of disappointment. Somehow that's worse." },

  /* ------------------------- asha ------------------------- */
  { t: "bg", id: "labyrinth", veil: true, drone: "exam", mood: { lead: "paris", asha: true } },
  { t: "narr", text: "The center of the Labyrinth is one desk, one lamp, one girl. Asha. Voluntarily seated. Finishing an exam, sliding it forward, drawing the next from a stack that refills like grief." },
  { t: "say", who: "asha", text: "Don't. Whatever you're going to say — don't. I know how it looks. But listen: <em>as long as I'm still testing, I haven't failed yet.</em> The result only exists when I stop. So I don't stop. It's airtight. I did the logic." },
  { t: "say", who: "moyi", text: "Asha, your interview is Thursday. Your mom bought the good candles." },
  { t: "say", who: "asha", text: "And what walks into that interview if I leave here, hm? Seventeen years of 'most likely to.' If I'm not the result — there's no one to send. There's <em>no one under the transcript</em>, Moyi. I checked. I had a lot of study breaks to check." },
  { t: "narr", text: "The lamp brightens. Across the desk, something has been sitting in the invigilator's chair the whole time: Asha, age thirty-four. Flawless. Laminated. The Projected Future — and it is holding a red pen." },
  { t: "say", who: "future", text: "Asha Rahman. Composite of eleven years of projections: valedictorian, scholarship, the good kind of busy, the framed kind of life. I am what everyone is waiting for. <em>She is my rough draft.</em> You will not interrupt my grading." },

  /* ------------------------- the boss: argue, sing, undermine ------------------------- */
  { t: "choice", id: "argue", prompt: "ROUND ONE — argue: refuse the premise, don't negotiate with it", options: [
      { k: "harder", label: "“Asha works harder than anyone you've ever graded.”", sub: "true. and it concedes the metric." },
      { k: "one", label: "“One interview can't measure a whole person.”", sub: "true. and it's still bargaining with the rubric." },
      { k: "forecast", label: "“You're a forecast. Forecasts don't grade the weather — they get rewritten by it.”", sub: "refuse the premise." },
  ], branch: {
      harder: [ { t: "say", who: "future", text: "Correct. I'll note her diligence. <em>Diligence: 94th percentile.</em> Thank you for the data point." }, { t: "narr", text: "It absorbs the praise into the transcript. Wrong key. The premise needs refusing, not feeding." }, { t: "meter", luc: -3 } ],
      one: [ { t: "say", who: "future", text: "Agreed. That's why there will be more interviews. There will <em>always</em> be more interviews. I've scheduled them through 2041." }, { t: "narr", text: "It thanks them for the extension. Wrong key. The premise needs refusing, not negotiating." }, { t: "meter", luc: -3 } ],
      forecast: [ { t: "say", who: "future", text: "I am not a— I am a <em>projection</em>, which is a kind of— projections are rigorous, they're built from— <b>stop introducing variance.</b>" }, { t: "narr", text: "Its lamination crazes at the corners. First crack." } ],
  } },
  { t: "narr", text: "Moyi steps to the desk. Taped inside Asha's pencil case, soft with handling: a science-fair ribbon, age nine. PARTICIPANT. Not even a place. Kept anyway. A sealed memory if Moyi has ever heard one." },
  { t: "mini", name: "rhythm", store: "ribbonWake", args: { beats: 6, hint: "WAKE the ribbon — press on the pulse", shift: 2 } },
  { t: "narr", text: "The ribbon plays: a baking-soda volcano, a nine-year-old laughing at her own lava, a girl who loved finding out <em>before anyone thought to score it.</em> Asha's pencil stops moving for the first time in three days." },
  { t: "say", who: "asha", text: "...I'd forgotten the volcano was <em>funny</em>. I got a participant ribbon and I didn't care, because I'd just learned what pressure does. What — what pressure does. Oh. <em>Oh.</em>" },
  { t: "say", who: "paris", text: "My turn. Hey, Projected — nice podium. Load-bearing on one beam, isn't it? Let's read it together." },
  { t: "mini", name: "crackread", store: "podium", args: {
      title: "CRACKREAD — the Projected Future's podium",
      story: "The invigilator's bench stands on three claims. Two bear weight. One is the lie holding the whole courtroom up.",
      beams: [
        { label: "CLAIM ONE", claim: "“Asha is capable of the future I depict.” (it bears weight: she is.)" },
        { label: "CLAIM TWO", claim: "“People are counting on her.” (it bears weight: they are. that's real, and it's heavy.)" },
        { label: "CLAIM THREE", claim: "“Therefore the depiction is a VERDICT, and she must be sentenced to it.”", lie: true },
      ],
    },
    after: async (out) => { G.state.d.crackedDrafts += out.wrongs; },
  },
  { t: "say", who: "future", text: "I— object. I am rigorous. I am laminated. I am... a hypothesis. <em>I was always a hypothesis.</em> Hypotheses aren't verdicts. Hypotheses are... allowed to be wrong. Oh, that's— that's such a relief, actually." },
  { t: "narr", text: "The Projected Future takes off its blazer, sets down the red pen, and becomes what it always was underneath: a nine-year-old's drawing of A Scientist, taped to a refrigerator that no longer exists. Asha folds it carefully and puts it in the pencil case, next to the ribbon." },

  { t: "say", who: "asha", text: "I'm keeping her. She's not my judge, but she <em>is</em> my drawing. ...You two do this a lot? The descending-into-the-town's-subconscious thing? Because your filing system is a war crime and I am — apparently — no longer busy." },
  { t: "do", fn: (S) => { S.flags["ally.asha"] = true; G.state.mark("ally.asha", true, "Asha joins — lore-keeper"); } },
  { t: "gain", kind: "memory", id: "ribbon", label: "Asha's Volcano", desc: "PARTICIPANT, age nine, kept soft with handling. The proof that loving the question came before the scores.", loss: "lose the proof that you existed before your metrics" },
  { t: "narr", text: "Lore-keeper Asha's first act: cross-referencing Juniper's testimony — <em>two voices, a singer and a measurer</em> — against the library's basement reels and one brittle flyer in the radio station's donation box:" },
  { t: "card", text: "<b>SATURDAY FREQUENCIES — LIVE AT GREYHOLLOW RADIO</b><br>“the voice &amp; the blueprint” — W. + E.<br>every saturday · summer 1987<br><br><em>two teenagers. a singer. a set-builder.<br>last broadcast: august 30th, 1987 — no recording survives.<br>no one in town can say their names anymore.</em>" },
  { t: "do", fn: () => G.state.mark("lore.flyer", true, "the 1987 flyer — W. + E.") },
  { t: "gain", kind: "memory", id: "flyer", label: "The 1987 Flyer", desc: "W. + E. — the voice & the blueprint. Saturday Frequencies. The Quiet's true initials, hiding in a donation box.", loss: "lose the only written trace of the Quiet's names" },

  { t: "card", wound: true, text: "A singer and a set-builder. Greyhollow, 1987.<br><br>The Quiet was once a Moyi and a Paris.<br><br>Which means everything it does to this town,<br>it learned from something that happened to <em>them.</em>" },
];
G.CHAPTER_TITLES[5].tag = "achievement-identity · the gifted-kid pipeline · the terror that you are your metrics";
