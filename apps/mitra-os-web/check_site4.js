import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const rootContent = await page.$eval('#root', el => el.innerHTML);
  if (!rootContent) console.log("Root is empty! Blank screen.");
  else console.log("Root has content.");
  
  await browser.close();
})();
