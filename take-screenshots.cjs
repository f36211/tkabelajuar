import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch();
  
  // PC 
  const pagePC = await browser.newPage();
  await pagePC.setViewport({ width: 1280, height: 800 });
  await pagePC.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  await pagePC.screenshot({ path: path.join(process.cwd(), 'screenshot-pc.png'), fullPage: true });

  // Mobile
  const pageMobile = await browser.newPage();
  await pageMobile.setViewport({ width: 375, height: 812, isMobile: true });
  await pageMobile.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  await pageMobile.screenshot({ path: path.join(process.cwd(), 'screenshot-mobile.png'), fullPage: true });

  await browser.close();
  console.log('Screenshots saved: screenshot-pc.png, screenshot-mobile.png');
})();
