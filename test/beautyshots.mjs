/* capture a gallery of scenes for the README */
import { chromium } from "playwright";

const BASE = "http://127.0.0.1:8321";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(2200);
await page.screenshot({ path: "docs/shots/01-menu.png" });

const shots = [
  ["02-street", `G.paint.set("street",{phoneGlow:true});`, false],
  ["03-school-veil", `G.paint.set("schoolVeil",{veil:true,veilCss:true,paris:true}); G.fx.on("msgSnow");`, true],
  ["04-mall-veil", `G.paint.set("mallVeil",{veil:true,veilCss:true,clerk:true});`, true],
  ["05-tower-top", `G.fx.clear(); G.fx.on("chatGhosts"); G.paint.set("towerTop",{veil:true,veilCss:true,endscreen:true});`, true],
  ["06-house", `G.fx.clear(); G.paint.set("houseVeil",{veil:true,veilCss:true,true:true});`, true],
  ["07-cathedral", `G.paint.set("cathedral",{veil:true,veilCss:true,mom:true}); G.fx.on("motes");`, true],
  ["08-labyrinth", `G.fx.clear(); G.paint.set("labyrinth",{veil:true,veilCss:true,rubrics:true,rubricN:2,futures:true,asha:true});`, true],
  ["09-fort", `G.paint.set("fort",{veil:true,veilCss:true,withdrawal:true,unweave:.5});`, true],
  ["10-sanctuary", `G.paint.set("sanctuary",{veil:true,veilCss:true,progress:1,quiet:true,empty:true}); G.fx.on("ash");`, true],
  ["11-deep-veil", `G.fx.clear(); G.fx.on("static"); G.paint.set("deep",{veil:true,veilCss:true,door:true,quiet:true});`, true],
  ["12-finale", `G.fx.clear(); G.paint.set("towerFinale",{stage:true,stageQuality:6,quiet:true});`, false],
  ["13-epilogue", `G.paint.set("epilogue",{});`, false],
];

// enter the game shell (hidden menu, running render loop)
await page.evaluate(() => {
  G.U.$("#mainmenu").classList.add("hidden");
  G.engine.runChapter ; // noop reference
  // flip engine off menu without running a chapter
});
await page.evaluate(() => { G.state.reset(); });
await page.evaluate(() => { const e = G.engine; }); // keep
// run chapter 1 briefly to switch loop off menu, then take manual control
await page.evaluate(() => { G.engine.runChapter(1); });
await page.waitForTimeout(700);
await page.mouse.click(640, 360); // past first card
await page.waitForTimeout(700);

for (const [name, code, veil] of shots) {
  await page.evaluate(code);
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `docs/shots/${name}.png` });
}
await browser.close();
console.log("shots captured");
