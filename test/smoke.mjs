/* smoke test: boot the game, walk the opening, screenshot, surface errors */
import { chromium } from "playwright";

const BASE = "http://127.0.0.1:8321";
const errors = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
page.on("console", (m) => { if (m.type() === "error") errors.push("CONSOLE: " + m.text()); });

await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: "test/shot-menu.png" });

// begin
await page.click("#mm-new");
await page.waitForTimeout(1200);
await page.screenshot({ path: "test/shot-card1.png" });

// advance through the cold open (cards + dialogue), interacting with the phone when it appears
for (let i = 0; i < 26; i++) {
  const phoneVisible = await page.$eval("#phone", (el) => !el.classList.contains("hidden")).catch(() => false);
  if (phoneVisible) break;
  await page.mouse.click(640, 360);
  await page.waitForTimeout(420);
  await page.mouse.click(640, 360); // second click to finish typewriter + advance
  await page.waitForTimeout(380);
}
await page.screenshot({ path: "test/shot-street.png" });

// phone sequence: wait for draft typing, then delete
const phoneUp = await page.$eval("#phone", (el) => !el.classList.contains("hidden")).catch(() => false);
if (phoneUp) {
  await page.waitForTimeout(11000); // draft types out
  await page.screenshot({ path: "test/shot-phone.png" });
  await page.click("#ph-del");
  await page.waitForTimeout(4500);
}

// keep advancing through erasure + title card + kitchen scene
for (let i = 0; i < 30; i++) {
  await page.mouse.click(640, 360);
  await page.waitForTimeout(300);
  await page.mouse.click(640, 360);
  await page.waitForTimeout(300);
}
await page.screenshot({ path: "test/shot-ch1-mid.png" });

// jump straight into a later chapter via engine to validate scripts load & scenes paint
await page.evaluate(() => { G.state.d.maxChapter = 10; G.state.save(); });
for (const ch of [2, 5, 9]) {
  await page.evaluate((n) => { G.fx.clear(); G.engine.runChapter(n); }, ch);
  await page.waitForTimeout(900);
  for (let i = 0; i < 10; i++) { await page.mouse.click(640, 360); await page.waitForTimeout(260); }
  await page.screenshot({ path: `test/shot-ch${ch}.png` });
}

console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "OK — no page errors");
await browser.close();
process.exit(errors.length ? 1 : 0);
