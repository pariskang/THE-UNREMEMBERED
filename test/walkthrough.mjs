/* full walkthrough: an auto-player that solves every minigame and plays
   chapters 1..10 end to end, watching for errors and deadlocks. */
import { chromium } from "playwright";

const BASE = "http://127.0.0.1:8321";
const START = parseInt(process.argv[2] || "1", 10);
const END = parseInt(process.argv[3] || "10", 10);
const SX = 1280 / 960, SY = 720 / 540; // canvas → page
const px = (x, y) => [x * SX, y * SY];

const errors = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("AudioContext")) errors.push("CONSOLE: " + m.text()); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

await page.goto(BASE, { waitUntil: "networkidle" });
await sleep(800);

if (START === 1) await page.click("#mm-new");
else {
  // seed a plausible mid-run state so recall puzzles have true answers
  await page.evaluate((n) => {
    G.state.reset();
    const S = G.state.d;
    S.maxChapter = n; S.chapter = n;
    S.flags.regs = n >= 7 ? ["wake", "lull", "shift", "hush"] : ["wake", "lull", "shift"];
    S.flags["tower.t3"] = "wake";
    S.sennaChoice = "visit"; S.sennaFaceLost = true; S.motherWoken = true;
    S.apology = "accepted"; S.namesLearned = true; S.honestBricks = 3;
    S.crackedDrafts = 2; S.woke = ["vale", "mom"];
    G.state.gainMemory("bleachers", "The Bleacher Thread", "", "");
    G.state.gainMemory("endscreen", "Juniper's End Screen", "", "");
    G.state.gainMemory("ribbon", "Asha's Volcano", "", "");
    G.state.gainMemory("flyer", "The 1987 Flyer", "", "");
    G.state.gainMsg("u1", "to dad", "", ""); G.state.deliver("u1");
    G.state.save();
  }, START);
  await page.evaluate(() => { try { G.audio.ensure(); } catch (e) {} });
  await page.evaluate((n) => { G.engine.runChapter(n); return 1; }, START); // fire and forget
}
await sleep(800);

const visible = (sel) => page.$eval(sel, (el) => !el.classList.contains("hidden")).catch(() => false);
const q = (sel) => page.$$(sel);

async function holdAt(x, y, ms) {
  await page.mouse.move(x, y); await page.mouse.down(); await sleep(ms); await page.mouse.up();
}

const miniSolvers = {
  async holdHum() { await holdAt(...px(420, 280), 3400); },
  async threadstep() {
    for (const [x, y] of [[360, 360], [540, 300], [760, 280], [360, 360], [540, 300], [760, 280]]) {
      await page.mouse.click(...px(x, y)); await sleep(350);
    }
  },
  async murmurationEscape() {
    await page.mouse.move(...px(90, 295)); await page.mouse.down(); await sleep(9000); await page.mouse.up();
  },
  async resonance() {
    for (let i = 0; i < 30; i++) {
      if (await page.evaluate(() => G.mini.activeName) !== "resonance") return;
      const hits = await page.evaluate(() => (G.mini.progress || {}).hits || 0);
      const target = 120 + hits * 36, speed = 110 + hits * 18;
      await sleep(Math.max(60, Math.round((target / speed) * 1000) - 150));
      await page.mouse.click(...px(480, 280));
      await sleep(120);
    }
  },
  async rhythm() { for (let i = 0; i < 12; i++) { await page.mouse.click(...px(480, 300)); await sleep(615); } },
  async wreckingBall() { await holdAt(...px(480, 240), 3200); await sleep(5200); },
  async gradedDraft() {
    for (const [x, y] of [[288, 378], [432, 334.8], [576, 302.4], [720, 270]]) {
      await page.mouse.click(...px(x, y)); await sleep(1250);
    }
    await sleep(1400);
  },
  async rubricStealth() {
    const desks = [192, 345.6, 499.2, 652.8, 806.4];
    for (let i = 0; i < 60; i++) {
      if (await page.evaluate(() => G.mini.activeName) !== "rubricStealth") return;
      for (const d of desks) { await page.mouse.click(...px(d, 432)); await sleep(140); }
    }
  },
  async sanctuaryBuild() {
    for (const [x, y] of [[288, 356.4], [403.2, 297], [480, 259.2], [556.8, 297], [672, 356.4]]) {
      await page.mouse.click(...px(x, y)); await sleep(420);
    }
  },
  async feelIt() {
    const el = await page.$("#feelit");
    const box = await el.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down(); await sleep(40000); await page.mouse.up();
  },
};

const fclick = async (h) => { try { await h.click({ force: true, timeout: 3000 }); } catch (e) {} };

let lastProgress = Date.now(), lastSig = "", sameMini = { name: null, n: 0 };
for (let iter = 0; iter < 4000; iter++) {
  try {
  const ch = await page.evaluate(() => G.state.d.chapter).catch(() => 0);
  const onMenu = await page.evaluate(() => G.engine.onMenu).catch(() => false);
  if (onMenu && iter > 10) { console.log("REACHED MENU after chapter", ch); break; }
  if (ch > END) break;

  // 1) phone
  if (await visible("#phone")) {
    await page.click("#ph-del", { force: true }); await sleep(900);
    await page.click("#ph-del", { force: true }); await sleep(6500);
    lastProgress = Date.now(); continue;
  }
  // 2) canvas minigame?
  const mini = await page.evaluate(() => G.mini.activeName).catch(() => null);
  if (mini && miniSolvers[mini]) {
    sameMini = mini === sameMini.name ? { name: mini, n: sameMini.n + 1 } : { name: mini, n: 1 };
    if (sameMini.n > 8) { errors.push(`STALL: mini ${mini} unsolved after ${sameMini.n} attempts (ch${ch})`); break; }
    console.log(`[ch${ch}] solving mini: ${mini} (attempt ${sameMini.n})`);
    await miniSolvers[mini](); lastProgress = Date.now(); continue;
  }
  sameMini = { name: null, n: 0 };
  // 3) panel (choose/pick/order/crackread/recall…)
  if (await visible("#panel")) {
    const items = await q("#panel-body .pn-item:not(.dead)");
    const contBtn = await page.$$eval("#panel-body .pn-item", (els) => els.findIndex((e) => e.textContent.includes("Continue —")));
    if (contBtn >= 0) {
      console.log(`[ch${ch}] chapter complete → continue`);
      await fclick((await q("#panel-body .pn-item"))[contBtn]);
      const btn = await page.$("#panel-foot .pn-btn"); btn && (await fclick(btn));
    } else if (items.length) {
      const needN = /\((\d)\/(\d)\)/.exec(await page.$eval("#panel-foot", (el) => el.textContent).catch(() => "")) ;
      if (needN) { // pickN: select first N then confirm
        const n = parseInt(needN[2], 10);
        const all = await q("#panel-body .pn-item");
        for (let i = 0; i < Math.min(n, all.length); i++) { await fclick(all[i]); await sleep(120); }
        const btn = await page.$("#panel-foot .pn-btn"); btn && (await fclick(btn));
      } else {
        await fclick(items[Math.floor(Math.random() * items.length)]); await sleep(160);
        const btn = await page.$("#panel-foot .pn-btn"); btn && (await fclick(btn));
      }
    }
    await sleep(420); lastProgress = Date.now(); continue;
  }
  // 4) choices
  if (await visible("#choices")) {
    const cs = await q("#choices .choice");
    if (cs.length) { await fclick(cs[Math.floor(Math.random() * cs.length)]); await sleep(300); lastProgress = Date.now(); continue; }
  }
  // 5) registers: clicking is a harmless no-op unless a sing pick is pending
  if (await visible("#registers")) {
    const regs = await q("#registers .reg");
    if (regs.length) await fclick(regs[Math.floor(Math.random() * regs.length)]);
  }
  // 6) feelit button visible without active mini tag (safety)
  if (await visible("#feelit")) { await miniSolvers.feelIt(); lastProgress = Date.now(); continue; }
  // 7) default: advance dialogue/cards
  await page.mouse.click(640, 200); await sleep(230); await page.mouse.click(640, 200); await sleep(230);

  // progress watchdog
  const sig = await page.evaluate(() => (G.U.$("#dlg-text").textContent || "") + "|" + (G.U.$("#card-text").textContent || "") + "|" + G.state.d.chapter);
  if (iter % 30 === 0) {
    const pt = await page.evaluate(() => (G.U.$("#panel").classList.contains("hidden") ? "-" : G.U.$("#panel-title").textContent.slice(0, 60)));
    console.log(`[hb] iter=${iter} ch=${ch} panel="${pt}" sig="${sig.slice(0, 70).replace(/\n/g, " ")}"`);
  }
  if (sig !== lastSig) { lastSig = sig; lastProgress = Date.now(); }
  if (Date.now() - lastProgress > 80000) {
    await page.screenshot({ path: "test/stuck.png" });
    const m2 = await page.evaluate(() => G.mini.activeName);
    errors.push(`DEADLOCK in chapter ${ch} (mini=${m2}, sig=${sig.slice(0, 80)})`);
    break;
  }
  } catch (e) { errors.push("LOOPERR: " + e.message.split("\n")[0]); await sleep(400); }
}

await page.screenshot({ path: `test/walk-end-${START}-${END}.png` });
console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : `OK — chapters ${START}..${END} walked clean`);
await browser.close();
process.exit(errors.length ? 1 : 0);
