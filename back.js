// Wait for the element using modern Puppeteer API
await page.waitForSelector('xpath=//*[@id="root"]/div[1]/div[1]/div[2]/div[1]/form/div/div[1]/div/input', { visible: true });
// Use page.$eval with xpath selector
await page.$eval('xpath=//*[@id="root"]/div[1]/div[1]/div[2]/div[1]/form/div/div[1]/div/input', (el, value) => {
  el.value = value;
}, email);

await page.waitForSelector('xpath=//*[@id="password"]', { visible: true });
    await page.$eval('xpath=//*[@id="password"]', (el, value) => {
      el.value = value;
    }, password);

    await page.waitForSelector('xpath=//*[@id="root"]/div[1]/div[1]/div[2]/div[1]/form/button', { visible: true });
    await page.click('xpath=//*[@id="root"]/div[1]/div[1]/div[2]/div[1]/form/button');