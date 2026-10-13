import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  const rootContent = await page.$eval('#root', el => el.innerHTML);
  console.log("Root content snippet:", rootContent.substring(0, 500));
  
  await browser.close();
})();
