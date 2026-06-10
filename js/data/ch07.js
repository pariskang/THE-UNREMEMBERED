/* CHAPTER 7 — The Unfollowing ------------------------------------------------
   The chapter that breaks the game's promise.
--------------------------------------------------------------------------- */
G.script[7] = [
  { t: "title", n: 7 },
  { t: "bg", id: "hall", veil: true, drone: "veil" },
  { t: "fx", op: "on", args: ["msgSnow"] },
  { t: "card", text: "Below the Galleria, below the cathedral, the Veil keeps its records:<br><br>THE HALL OF WITHDRAWN CONSENT.<br><br>Drawer after drawer of people who could not bear to be perceived anymore —<br>filed, dated, <em>signed.</em>" },
  { t: "narr", text: "Asha's research pointed here: every unremembered person has a file. The duet came for proof of abduction. The drawers have been expecting them with the patience of paperwork." },
  { t: "say", who: "asha", text: "Found the V's. Vale... Vasquez... <em>Senna.</em> It's thick. Moyi — before you open it. Files in here aren't about people. They're <b>by</b> them." },
  { t: "narr", text: "The folder is in Senna's handwriting. All of it. Application. Initials in every box. And stapled to the front, a checklist titled in the Quiet's two-voiced font: <em>REASONS, IN THE APPLICANT'S OWN WORDS.</em>" },
  { t: "card", text: "<em>1. i am tired of being a picture of myself. the picture posts. the picture answers. maintaining her is a second job i cannot quit because everyone follows her instead of me.</em>" },
  { t: "card", text: "<em>2. when i said i was tired, people sent me wellness infographics. when i said nothing, people said i seemed so much better.</em>" },
  { t: "card", text: "<em>3. moyi.</em><br><br><em>not because she hurt me. write that down twice. because she remembers EVERYTHING. she keeps me so completely that there is no room to become anyone she doesn't already know. being someone's whole world is a job with no breaks. i wanted one night where nobody was holding my file open.</em>" },
  { t: "narr", text: "The Hall is very quiet. Even the hold-music from the mall upstairs has stopped, out of something like respect." },
  { t: "say", who: "moyi", text: "...She applied. She <em>applied.</em> Eight months I've been storming two worlds to rescue someone from a kidnapping, and it was a <em>resignation letter.</em>" },
  { t: "say", who: "paris", text: "Reason three isn't an accusation, Moyi. Read the— she wrote 'write that down twice.' She was protecting you <em>inside her own leaving.</em>" },
  { t: "say", who: "moyi", text: "Protecting me. From me. Which means every thread I've walked, every seat I've sung at — say it, Paris. You're the one who reads load paths. <em>Say what I've been building.</em>" },
  { t: "say", who: "paris", text: "...A search party is a beautiful structure. But if the person doesn't want to be found, the same structure has another name." },

  /* ------------------------- lull, pointed inward ------------------------- */
  { t: "narr", text: "He goes quiet then — too quiet, the specific densening of a boy deciding all over again that feelings are demolition charges. And Moyi feels it before she means to: her Lull register, turning in her chest like a key. It would work on him. It has <em>always</em> worked on people. That's the thing about lullabies." },
  { t: "choice", id: "lull1", prompt: "her song, pointed at her own party — what is it for?", options: [
      { k: "soothe", label: "Sing low — comfort, openly. Let him hear what it is.", sub: "a lullaby with consent" },
      { k: "manage", label: "Sing under speech — smooth his doubt before it spreads to her.", sub: "he will not notice. that's the point." },
      { k: "refrain", label: "Don't sing. Let him doubt out loud, even if it cuts.", sub: "doubt is also a load-bearing feeling" },
  ] },
  { t: "narr", text: "Whatever she chose, the Hall wrote it down. The Hall writes everything down. That is the Hall's whole personality." },

  /* ------------------------- the offer ------------------------- */
  { t: "narr", text: "And in the silence after, the temperature of the room drops to exactly comfortable, and a voice made of two voices speaks from everywhere with terrible gentleness:" },
  { t: "say", who: "quiet", text: "<em>You found the consent forms. We were never hiding them. We only take the ones who ask — and we take their pain so completely that no one even has to miss them. Tell us we are wrong to exist. We'll wait. We're very good at waiting.</em>" },
  { t: "say", who: "quiet", text: "<em>You're tired, little voice. Here. Our register. No catch — every gift we give is exactly what it is. It makes feelings stop. You'll find it always works. Forever. On everything.</em>" },
  { t: "do", fn: (S) => { S.hush.offered = true; S.flags["regs"] = ["wake", "lull", "shift", "hush"]; G.hud.registers(S.flags["regs"]); G.state.mark("hush.offered", true, "the Quiet offered HUSH"); } },
  { t: "narr", text: "A fourth register settles into her voice like a gold tooth: <b>HUSH</b>. From this night on it will sit in every choice, glowing, optimal, patient. Using it will always work. Using it is always a step toward the cathedral. The game will never stop you. The game is watching what you believe." },
  { t: "meter", luc: -6 },

  /* ------------------------- the blanket fort ------------------------- */
  { t: "bg", id: "fort", veil: true, drone: "fort", mood: { withdrawal: true, unweave: 0 } },
  { t: "card", text: "Senna's file contains one appointment slot, never used:<br><em>EXIT INTERVIEW — available to the applicant's listed emergency contact.</em><br><br>Listed emergency contact: <b>moyi</b>.<br>It has been waiting eight months for her to find it." },
  { t: "narr", text: "The interview room is their blanket fort. Age eleven, the good winter, fairy lights and a smuggled space heater. The Veil rebuilt it thread-perfect — and across the low table sits the Withdrawal: the avatar of Senna's decision, wearing Senna like a coat she's already half out of." },
  { t: "say", who: "withdraw", text: "Hi, Mo. ...Don't look at the face too long. It's the part of me that's still arguing. The rest signed." },
  { t: "say", who: "moyi", text: "I read your reasons. All three. I came anyway — not to drag you back. I think. I don't know what I came to do, Senna. Nobody writes a script for the exit interview of your whole world." },
  { t: "do", fn: () => G.paint.mood({ unweave: .25 }) },
  { t: "say", who: "withdraw", text: "You hummed at my seat. I felt it down here — like someone knocking politely on a coffin and the coffin is a hammock and you can't explain that to them through the lid. You never once knocked like you'd break in. I noticed. I want you to know I noticed." },
  { t: "say", who: "moyi", text: "Was it me? Reason three. Just — say the load path plainly. I can stand under it. I've had practice lately." },
  { t: "do", fn: () => G.paint.mood({ unweave: .45 }) },
  { t: "say", who: "withdraw", text: "It was gravity, Mo. Yours is just the warmest gravity I had. You remembered me so well that I could never be new. And everyone else remembered me so badly I could never be real. Between those two mirrors — I picked the dark. It wasn't fair to either of us. It was just the only door with my height marked on it." },
  { t: "narr", text: "The fort is unweaving as they talk — thread by thread, light by light, paid out like the last of a spool. The interview lasts exactly as long as the fort does. The Veil's idea of mercy: a clock you can <em>see</em>." },
  { t: "choice", id: "lull2", prompt: "Paris stands watch at the fort's edge, doubting audibly — “what if asking is just taking, slower?” — and her Lull turns in her chest again", options: [
      { k: "soothe", label: "Sing to him openly for one bar — then let him finish the doubt.", sub: "comfort that doesn't edit" },
      { k: "manage", label: "Sing under his words — this moment is too important for his doubt.", sub: "smooth him. just this once." },
      { k: "refrain", label: "Let the doubt stand in the room with you. It might be right.", sub: "the fort unweaves a little faster" },
  ] },
  { t: "do", fn: (S) => {
      const a = G.state.flag("choice.lull1"), b = G.state.flag("choice.lull2");
      S.lullOnParis = (a === "manage" || b === "manage") ? "manage" : (a === "soothe" || b === "soothe") ? "soothe" : "refrain";
      G.state.mark("lullOnParis", S.lullOnParis, "her song, pointed at her own duet: " + S.lullOnParis);
    } },
  { t: "do", fn: () => G.paint.mood({ unweave: .7 }) },
  { t: "say", who: "withdraw", text: "Last thread soon, Mo. The interview form has one box left, and it's yours: <em>what does the emergency contact ask of the applicant?</em> They honor it. Whatever it is. That's the one rule down here that's never been broken." },
  { t: "choice", id: "senna", prompt: "the question the whole game has been hiding inside its premise", options: [
      { k: "comeback", label: "“Come back. Not for me — but please, come back to the world.”", sub: "is rescue love, or possession? you'll find out." },
      { k: "visit", label: "“Let me visit. Keep your dark, keep your door — just leave me a knock.”", sub: "boundaries, with a hinge in them" },
      { k: "letgo", label: "“Teach me how to let you go.”", sub: "the hardest ask. the only one that's purely a gift." },
  ], branch: {
      comeback: [
        { t: "do", fn: (S) => { S.sennaChoice = "comeback"; G.state.mark("senna.ask", "comeback", "asked Senna to come back"); } },
        { t: "say", who: "withdraw", text: "...Filed. She'll hear it — all of her, not just this part in the coat. I can't promise you the answer, Mo. I can promise you it will be HERS. That's more than either of you had yesterday." },
      ],
      visit: [
        { t: "do", fn: (S) => { S.sennaChoice = "visit"; G.state.mark("senna.ask", "visit", "asked Senna for a door that knows her knock"); } },
        { t: "say", who: "withdraw", text: "...Filed. A door with a knock in it. You're the first applicant's contact in the Hall's whole history to ask for a <em>hinge</em> instead of a verdict. The architecture is going to talk about you." },
      ],
      letgo: [
        { t: "do", fn: (S) => { S.sennaChoice = "letgo"; G.state.mark("senna.ask", "letgo", "asked Senna to teach the letting go"); } },
        { t: "say", who: "withdraw", text: "...Filed. Then here's lesson one, and there's only one: you don't stop loving them. You stop <em>holding the file open.</em> Close it gently. Shelve it where you can reach. Oh, Mo — you were always going to be good at this. That's the worst part, huh?" },
      ],
  } },
  { t: "do", fn: () => G.paint.mood({ unweave: 1 }) },
  { t: "narr", text: "The last fairy light pays out. The fort becomes thread becomes dark becomes the Hall again. On the table where the fort stood: one filing tab, in handwriting Moyi would know at any bitrate — <em>'good interview. — s.'</em>" },
  { t: "narr", text: "All three asks are honored. None of them is painless. The game would like to be clear that those were never different sentences." },

  { t: "if", cond: (S) => S.lullOnParis === "manage", then: [
      { t: "say", who: "paris", text: "...You sang under me. Back there. I felt the seams smooth and I <em>let</em> you, because it was nice, and then I did the math on what 'nice' cost. Don't manage me, Moyi. I get managed by everything. I came here to be <em>built with.</em>" },
      { t: "do", fn: (S) => { S.estranged = true; G.hud.meters(); G.state.mark("duet.cracked", true, "the duet enters chapter 8 cracked"); } },
      { t: "card", wound: true, text: "He watched her use Lull on him.<br>The relationship enters the catastrophe <em>cracked</em> —<br>and the game has been silently Crackreading the duet all along." },
    ], else: [
      { t: "say", who: "paris", text: "You had a register that would've made me easy tonight. You didn't spend it. ...I notice structures. I noticed." },
      { t: "do", fn: (S) => { G.state.mark("duet.loadtested", true, "the duet enters chapter 8 load-tested"); } },
      { t: "card", wound: true, text: "She had the means to manage him, and chose his real voice instead.<br>The relationship enters the catastrophe <em>load-tested</em> —<br>and the game has been silently Crackreading the duet all along." },
  ] },
];
G.CHAPTER_TITLES[6].tag = "ghosting, boundaries, the right to disappear · being missed vs. being owed";
