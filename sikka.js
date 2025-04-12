const puppeteer = require("puppeteer");

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function scrape() {
  // Replace these with actual credentials
  const email = "sikka@gmail.com";
  const password = "admin4321";

  // Launch browser
  const browser = await puppeteer.launch({
    headless: false, // Set to true in production
    defaultViewport: null,
    args: ["--window-size=1920,1080", "--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // Navigate to login page
    console.log("Navigating to login page...");
    await page.goto("https://dancing-kulfi-68a09f.netlify.app", { waitUntil: "networkidle2" });

    // Fill email field
    console.log("Filling email field...");
    await page.waitForSelector('input[type="email"]', { visible: true });
    await page.type('input[type="email"]', email);

    // Fill password field
    console.log("Filling password field...");
    await page.waitForSelector('input[type="password"]', { visible: true });
    await page.type('input[type="password"]', password);

    // Click login button - wait for it to be enabled first
    /* console.log("Waiting for login button to be enabled...");
    await page.waitForFunction(() => {
      const button = document.querySelector('form button[type="submit"]');
      return button && !button.disabled;
    }, { timeout: 5000 }); */

    await delay(3000);

    console.log("Clicking login button...");
    await page.click('form button[type="submit"]');

    /* // Wait for navigation
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    console.log("Login successful!"); */

    /* // Navigate to the specified page
    console.log("Navigating to leads/contact page...");
    await page.goto("https://app.zeliq.com/app/search/contact", { waitUntil: "networkidle2" }); */

    // Extract Bearer token from network requests
    await delay(3000);
    console.log("Extracting Bearer token...");

    /* // Enable request interception to view headers
    await page.setRequestInterception(true);
    
    let bearerToken = null;
    
    page.on('request', request => {
      const headers = request.headers();
      if (headers.authorization && headers.authorization.startsWith('Bearer ')) {
        bearerToken = headers.authorization;
      }
      request.continue();
    });
    
    // Trigger some navigation or action to capture network requests
    await page.reload({ waitUntil: 'networkidle2' }); */

    // If the token wasn't found in requests, try checking localStorage

    bearerToken = await page.evaluate(() => {
      // Find the Cognito token by matching pattern
      let token = null;
      const prefix = "Services";

      // Iterate through all localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          // Found a matching Cognito token key
          token = localStorage.getItem(key);
          console.log("Found token with key:", key);
          break;
        }
      }

      if (token && token.startsWith("Bearer ")) {
        return token;
      } else if (token) {
        return `Bearer ${token}`;
      }
      return null;
    });

    if (bearerToken) {
      console.log("Bearer token found:", bearerToken);
    } else {
      console.log("Could not find Bearer token");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // Close the browser
    await browser.close();
  }
}

scrape().catch(console.error);
