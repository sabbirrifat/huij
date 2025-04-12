const puppeteer = require("puppeteer");
const axios = require("axios");
const fs = require("fs");
const readline = require("readline");

const { RealEstateAndEquipmentRentalServices, OilGasAndMining } = require("./categoryPayloads");

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt for input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

// Global variables
let browser;
let page;
let authToken = "";
let allFetchedItems = [];
let email;
let password;
let orgId = "";

// Counter for API calls
let apiCallCount = 0;
//const MAX_API_CALLS = 100;
const WAIT_TIME = 100;

const resultsFile = "us-oil-gas-and-mining.json";

// Initialize existing data from results.json if it exists
function loadExistingData() {
  try {
    if (fs.existsSync(resultsFile)) {
      const existingData = fs.readFileSync(resultsFile, "utf8");
      return JSON.parse(existingData);
    }
  } catch (error) {
    console.error("Error reading existing results file:", error.message);
  }
  return [];
}

// Function to login and get token using puppeteer
async function loginAndGetToken() {
  console.log("Starting browser session for authentication...");

  if (!browser) {
    // Launch browser if not already running
    browser = await puppeteer.launch({
      headless: true, // Set to true in production
      defaultViewport: null,
      args: ["--window-size=1920,1080", "--no-sandbox", "--disable-setuid-sandbox"],
    });

    page = await browser.newPage();
  }

  try {
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

    await delay(3000);

    // Click login button - wait for it to be enabled first
    console.log("Waiting for login button to be enabled...");
    await page.waitForFunction(
      () => {
        const button = document.querySelector('form button[type="submit"]');
        return button && !button.disabled;
      },
      { timeout: 5000 }
    );

    console.log("Clicking login button...");
    await page.click('form button[type="submit"]');

    // Wait for navigation
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    console.log("Login successful!");

    await delay(5000);

    // Navigate to the specified page
    console.log("Navigating to leads/contact page...");
    await page.goto("https://app.zeliq.com/app/search/contact", { waitUntil: "networkidle2" });

    // Extract token from localStorage
    console.log("Extracting token from localStorage...");
    const token = await page.evaluate(() => {
      // Find the Cognito token by matching pattern
      const prefix = "CognitoIdentityServiceProvider";
      const suffix = ".idToken";

      // Iterate through all localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix) && key.endsWith(suffix)) {
          // Found a matching Cognito token key
          const token = localStorage.getItem(key);
          return token;
        }
      }
      return null;
    });
    const findOrgId = await page.evaluate(() => {
      const userDetails = JSON.parse(localStorage.getItem("ajs_user_traits"));
      return userDetails.user_organization_id;
    });

    if (findOrgId) {
      orgId = findOrgId;
    } else {
      throw new Error("Could not find orgId in localStorage");
    }

    if (token) {
      authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      console.log("Token successfully retrieved");

      // Save token to session.txt for reference
      fs.writeFileSync("session.txt", authToken);
      console.log("Token saved to session.txt");

      return authToken;
    } else {
      throw new Error("Could not find token in localStorage");
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

// Function to refresh token when expired
async function refreshToken() {
  console.log("Refreshing token...");

  try {
    // Reload the page to refresh the session
    await page.reload({ waitUntil: "networkidle2" });

    // Re-extract token from localStorage
    const token = await page.evaluate(() => {
      const prefix = "CognitoIdentityServiceProvider";
      const suffix = ".idToken";

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix) && key.endsWith(suffix)) {
          return localStorage.getItem(key);
        }
      }
      return null;
    });

    if (token) {
      authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      console.log("Token successfully refreshed");

      // Update token in session.txt
      fs.writeFileSync("session.txt", authToken);
      console.log("Updated token saved to session.txt");

      return authToken;
    } else {
      console.log("Token not found after refresh, attempting re-login");
      return await loginAndGetToken();
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    console.log("Attempting to re-login...");
    return await loginAndGetToken();
  }
}

// Function to make API request with optional page token
async function fetchData(pageToken = null) {
  // Base URL for API
  const baseUrl = `https://api.zeliq.com/api/${orgId}/leads/search?limitPerPage=100&resource=contact`;
  try {
    // Increment API call counter
    apiCallCount++;

    let url = baseUrl;

    // Add page token if available
    if (pageToken) {
      // Replace space with + in page token
      const formattedToken = pageToken.replace(" ", "+");
      url = `${baseUrl}&pageToken=${formattedToken}`;
    }

    console.log(`Making API call #${apiCallCount}`);

    const response = await axios.post(
      url,
      {
        filters: OilGasAndMining.filters,
      },
      {
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    // Add items to global array
    if (data.items && Array.isArray(data.items)) {
      allFetchedItems.push(...data.items);
      console.log(`Fetched ${data.items.length} items. Total items so far: ${allFetchedItems.length}`);
    }

    // Check if we have a next page token and haven't reached the API call limit
    if (data.meta && data.meta.nextPageToken) {
      console.log(`Fetching next page with token: ${data.meta.nextPageToken}`);
      // Wait between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));
      await fetchData(data.meta.nextPageToken);
    } else {
      console.log(`Finished fetching data after ${apiCallCount} API calls.`);

      // Save the last page token to file if available
      if (data.meta && data.meta.nextPageToken) {
        fs.writeFileSync("lastPageToken.txt", data.meta.nextPageToken);
        console.log(`Saved last page token to lastPageToken.txt`);
      }

      // Write results to file when done
      fs.writeFileSync(resultsFile, JSON.stringify(allFetchedItems, null, 2));
      console.log(`Wrote ${allFetchedItems.length} items to ${resultsFile}`);

      // Close browser when completely done
      if (browser) {
        await browser.close();
        console.log("Browser closed");
      }
    }
  } catch (error) {
    console.log("Error fetching data:", error.message);

    if (error.response) {
      console.log("Response status:", error.response.status);

      // Handle 401 Unauthorized error with automatic token refresh
      if (error.response.status === 401) {
        console.log(`\x1b[31m🚨 Authentication token expired. Refreshing automatically... 🚨\x1b[0m`);

        // Refresh token automatically
        await refreshToken();
        console.log("Token refreshed, retrying request...");

        // Retry the request with the new token (don't increment API call count)
        apiCallCount--;
        await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));
        return await fetchData(pageToken);
      } else {
        console.log("Something went wrong, saving last page token and results to file");
        // Save the last page token to file if available
        if (pageToken) {
          fs.writeFileSync("lastPageToken.txt", pageToken);
          console.log(`Saved last page token to lastPageToken.txt`);
        }

        // Write results to file when done
        fs.writeFileSync(resultsFile, JSON.stringify(allFetchedItems, null, 2));
        console.log(`Wrote ${allFetchedItems.length} items to ${resultsFile}`);

        // Close browser when completely done
        if (browser) {
          await browser.close();
          console.log("Browser closed");
        }
      }
    } else {
      console.log("Something went wrong, saving last page token and results to file");
      // Save the last page token to file if available
      if (pageToken) {
        fs.writeFileSync("lastPageToken.txt", pageToken);
        console.log(`Saved last page token to lastPageToken.txt`);
      }

      // Write results to file when done
      fs.writeFileSync(resultsFile, JSON.stringify(allFetchedItems, null, 2));
      console.log(`Wrote ${allFetchedItems.length} items to ${resultsFile}`);

      // Close browser when completely done
      if (browser) {
        await browser.close();
        console.log("Browser closed");
      }
    }

    // For other errors, log and continue
    console.error("Error details:", error);
  }
}

// Main function to start the process
async function main() {
  try {
    // Get user input for email, password, and results file
    email = await prompt("Enter your email: ");
    password = await prompt("Enter your password: ");

    // Close readline interface
    rl.close();

    // Load existing data
    allFetchedItems = loadExistingData();
    console.log(`Loaded ${allFetchedItems.length} existing items from ${resultsFile}`);

    // First login and get token
    await loginAndGetToken();

    // Check if we have a stored page token
    let lastPageToken = null;
    if (fs.existsSync("lastPageToken.txt")) {
      lastPageToken = fs.readFileSync("lastPageToken.txt", "utf8").trim();
      console.log(`Starting with stored page token: ${lastPageToken}`);
    }

    // Start the fetch process
    await fetchData(lastPageToken);
    console.log("Process completed");

    // Ensure browser is closed at the end
    if (browser) {
      await browser.close();
      console.log("Browser closed");
    }
  } catch (err) {
    console.error("Unhandled error:", err);

    // Ensure browser is closed on error
    if (browser) {
      await browser.close();
      console.log("Browser closed due to error");
    }
  }
}

// Start the process
main();
