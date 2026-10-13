import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  await page.goto('http://localhost:3000/p/dukaanmitra-ai-kirana-management');
  await page.waitForTimeout(3000);
  const pBodyHTML = await page.evaluate(() => document.body.innerHTML);
  console.log('P BODY:', pBodyHTML.substring(0, 500));
  await browser.close();
})();
