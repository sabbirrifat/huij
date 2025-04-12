const puppeteer = require("puppeteer");

// Helper function for delays
function delay(time) {
  return new Promise(function(resolve) { 
    setTimeout(resolve, time);
  });
}

async function scrape() {
  // Replace these with actual credentials
  const email = "brendon@aifusion.space";
  const password = "bRendonsikka782@jj";

  // Launch browser
  const browser = await puppeteer.launch({
    headless: false, // Set to true in production
    defaultViewport: null,
    args: ["--window-size=1920,1080"],
  });

  try {
    const page = await browser.newPage();

    // Navigate to login page
    console.log("Navigating to login page...");
    await page.goto("https://app.zeliq.com/sign-in", { waitUntil: "networkidle2" });

    // Fill email field
    console.log("Filling email field...");
    await page.waitForSelector('input[type="email"]', { visible: true });
    await page.type('input[type="email"]', email);
    
    // Fill password field
    console.log("Filling password field...");
    await page.waitForSelector('input[type="password"]', { visible: true });
    await page.type('input[type="password"]', password);
    
    // Wait for 3 seconds after filling credentials
    console.log("Waiting for 3 seconds after filling credentials...");
    await delay(3000);
    
    // Click login button - wait for it to be enabled first
    console.log("Waiting for login button to be enabled...");
    await page.waitForFunction(() => {
      const button = document.querySelector('form button[type="submit"]');
      return button && !button.disabled;
    }, { timeout: 5000 });
    
    console.log("Clicking login button...");
    await page.click('form button[type="submit"]');

    // Wait for navigation
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    console.log("Login successful!");

    // Wait for 5 seconds after login
    console.log("Waiting for 5 seconds after login...");
    await delay(5000);

    // Navigate to the specified page
    console.log("Navigating to leads/contact page...");
    await page.goto("https://app.zeliq.com/app/search/contact", { waitUntil: "networkidle2" });

    // Extract Bearer token from network requests
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

    console.log("Checking localStorage for token...");
    bearerToken = await page.evaluate(() => {
      // Find the Cognito token by matching pattern
      let token = null;
      const prefix = "CognitoIdentityServiceProvider";
      const suffix = ".idToken";

      console.log("gussed one <<<<", localStorage.key(3));
      
      // Iterate through all localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix) && key.endsWith(suffix)) {
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
