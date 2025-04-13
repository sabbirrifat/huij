const puppeteer = require("puppeteer");
const axios = require("axios");
const fs = require("fs");
const readline = require("readline");

const {
  AccomodationServices,
  AdministrativeAndSupportServices,
  Construction,
  ConsumerGoods,
  ConsumerServices,
  Education,
  EntertainmnetProviders,
  FarmingRanchingAndForestry,
  FinancialServices,
  FoodProduction,
  GovermentAdministration,
  HealthCare,
  hospitalsAndHealthCare,
  Manufacturing,
  NonProfitOrganizations,
  OilGasAndMining,
  ProfessionalServices,
  RealEstateAndEquipmentRentalServices,
  Retail,
  TechnologyInformationAndMedia,
  TransportationLogisticsAndSupplyChain,
  Utilities,
  Wholesale,
} = require("./categoryPayloads");

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

let resultsFile = ""; // Changed from const to let to allow updating

// Initialize existing data from results.json if it exists
function loadExistingData() {
  try {
    const baseFilename = resultsFile.replace(".json", "");
    let allData = [];
    let chunkIndex = 1;
    let chunkedFilesExist = false;
    
    // First check if chunked files exist
    const firstChunkFilename = `${baseFilename}_chunk_1.json`;
    if (fs.existsSync(firstChunkFilename)) {
      chunkedFilesExist = true;
      console.log("Found chunked files, loading data from all chunks...");
      
      // Load data from all chunks
      while (true) {
        const chunkFilename = `${baseFilename}_chunk_${chunkIndex}.json`;
        if (!fs.existsSync(chunkFilename)) {
          break;
        }

        console.log(`Loading data from ${chunkFilename}...`);
        const chunkResult = fs.readFileSync(chunkFilename, "utf8");
        const chunkData = JSON.parse(chunkResult);
        allData.push(...chunkData);
        console.log(`Loaded ${chunkData.length} items from chunk ${chunkIndex}`);

        chunkIndex++;
      }
      
      console.log(`Total loaded items from all chunks: ${allData.length}`);
      return allData;
    }
    
    // If no chunks exist, try loading the single file
    if (fs.existsSync(resultsFile)) {
      console.log(`Loading data from single file: ${resultsFile}`);
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

// Function to save data in chunks
function saveDataInChunks(data, filename) {
  // Use a fixed chunk size of 250,000 items
  const chunkSize = 250000;
  const numChunks = Math.ceil(data.length / chunkSize);

  console.log(`Splitting ${data.length} items into ${numChunks} chunk(s) of ${chunkSize} items each`);

  // If data fits in one file, just write it directly
  if (data.length <= chunkSize) {
    fs.writeFileSync(filename, JSON.stringify(data));
    console.log(`Wrote ${data.length} items to ${filename}`);
    return;
  }

  // Otherwise split data into chunks and save each chunk
  for (let i = 0; i < numChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, data.length);
    const chunk = data.slice(start, end);

    const chunkFilename = `${filename.replace(".json", "")}_chunk_${i + 1}.json`;
    fs.writeFileSync(chunkFilename, JSON.stringify(chunk));
    console.log(`Wrote ${chunk.length} items to ${chunkFilename}`);
  }
}

// Function to make API request with optional page token
async function fetchData(pageToken = null, selectedCategory) {
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
        filters: selectedCategory.filters,
      },
      {
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
        timeout: 20000, // 20 second timeout
      }
    );

    const data = response.data;

    // Add items to global array
    if (data.items && Array.isArray(data.items)) {
      allFetchedItems.push(...data.items);
      console.log(`\x1b[32mFetched ${data.items.length} items. Total items so far: ${allFetchedItems.length}\x1b[0m`);
    }

    // Check if we have a next page token and haven't reached the API call limit
    if (data.meta && data.meta.nextPageToken) {
      console.log(`Fetching next page with token: ${data.meta.nextPageToken}`);

      if (apiCallCount % 1000 === 0) {
        console.log(`\x1b[33mWaiting for 10 seconds before fetching next page\x1b[0m`);
        await new Promise((resolve) => setTimeout(resolve, 10000));

        fs.writeFileSync("lastPageToken.txt", data.meta.nextPageToken);
        console.log(`Saved last page token to lastPageToken.txt`);

        saveDataInChunks(allFetchedItems, resultsFile);
        console.log(`\x1b[33mCheckpoint saved at ${apiCallCount} API calls\x1b[0m`);
      }
      // Wait between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));
      await fetchData(data.meta.nextPageToken, selectedCategory);
    } else {
      console.log(`Finished fetching data after ${apiCallCount} API calls.`);

      // Save the last page token to file if available
      if (data.meta && data.meta.nextPageToken) {
        fs.writeFileSync("lastPageToken.txt", data.meta.nextPageToken);
        console.log(`Saved last page token to lastPageToken.txt`);
      }

      // Write results to file when done
      saveDataInChunks(allFetchedItems, resultsFile);
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
        return await fetchData(pageToken, selectedCategory);
      } else {
        console.log("Something went wrong, INSIDE ELSE saving last page token and results to file");
        // Save the last page token to file if available
        if (pageToken) {
          fs.writeFileSync("lastPageToken.txt", pageToken);
          console.log(`Saved last page token to lastPageToken.txt`);
        }

        // Write results to file when done
        saveDataInChunks(allFetchedItems, resultsFile);
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
      saveDataInChunks(allFetchedItems, resultsFile);
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

    // Ask user to select a category
    console.log("\nPlease select a category by entering the corresponding number:");
    console.log("1. Accommodation Services");
    console.log("2. Administrative And Support Services");
    console.log("3. Construction");
    console.log("4. Consumer Goods");
    console.log("5. Consumer Services");
    console.log("6. Education");
    console.log("7. Entertainment Providers");
    console.log("8. Farming, Ranching And Forestry");
    console.log("9. Financial Services");
    console.log("10. Food Production");
    console.log("11. Government Administration");
    console.log("12. Health Care");
    console.log("13. Hospitals And Health Care");
    console.log("14. Manufacturing");
    console.log("15. Non-Profit Organizations");
    console.log("16. Oil, Gas And Mining");
    console.log("17. Professional Services");
    console.log("18. Real Estate And Equipment Rental Services");
    console.log("19. Retail");
    console.log("20. Technology, Information And Media");
    console.log("21. Transportation, Logistics And Supply Chain");
    console.log("22. Utilities");
    console.log("23. Wholesale");

    const categoryChoice = await prompt("Enter your choice (1-23): ");
    
    // Parse the category choice
    let selectedCategory;
    let categoryName;
    
    switch (categoryChoice.trim()) {
      case "1":
        selectedCategory = AccomodationServices;
        categoryName = "accommodation-services";
        break;
      case "2":
        selectedCategory = AdministrativeAndSupportServices;
        categoryName = "administrative-and-support-services";
        break;
      case "3":
        selectedCategory = Construction;
        categoryName = "construction";
        break;
      case "4":
        selectedCategory = ConsumerGoods;
        categoryName = "consumer-goods";
        break;
      case "5":
        selectedCategory = ConsumerServices;
        categoryName = "consumer-services";
        break;
      case "6":
        selectedCategory = Education;
        categoryName = "education";
        break;
      case "7":
        selectedCategory = EntertainmnetProviders;
        categoryName = "entertainment-providers";
        break;
      case "8":
        selectedCategory = FarmingRanchingAndForestry;
        categoryName = "farming-ranching-and-forestry";
        break;
      case "9":
        selectedCategory = FinancialServices;
        categoryName = "financial-services";
        break;
      case "10":
        selectedCategory = FoodProduction;
        categoryName = "food-production";
        break;
      case "11":
        selectedCategory = GovermentAdministration;
        categoryName = "government-administration";
        break;
      case "12":
        selectedCategory = HealthCare;
        categoryName = "health-care";
        break;
      case "13":
        selectedCategory = hospitalsAndHealthCare;
        categoryName = "hospitals-and-health-care";
        break;
      case "14":
        selectedCategory = Manufacturing;
        categoryName = "manufacturing";
        break;
      case "15":
        selectedCategory = NonProfitOrganizations;
        categoryName = "non-profit-organizations";
        break;
      case "16":
        selectedCategory = OilGasAndMining;
        categoryName = "oil-gas-and-mining";
        break;
      case "17":
        selectedCategory = ProfessionalServices;
        categoryName = "professional-services";
        break;
      case "18":
        selectedCategory = RealEstateAndEquipmentRentalServices;
        categoryName = "real-estate-and-equipment-rental-services";
        break;
      case "19":
        selectedCategory = Retail;
        categoryName = "retail";
        break;
      case "20":
        selectedCategory = TechnologyInformationAndMedia;
        categoryName = "technology-information-and-media";
        break;
      case "21":
        selectedCategory = TransportationLogisticsAndSupplyChain;
        categoryName = "transportation-logistics-and-supply-chain";
        break;
      case "22":
        selectedCategory = Utilities;
        categoryName = "utilities";
        break;
      case "23":
        selectedCategory = Wholesale;
        categoryName = "wholesale";
        break;
      default:
        console.log("Invalid choice. Defaulting to Oil, Gas And Mining.");
        selectedCategory = OilGasAndMining;
        categoryName = "oil-gas-and-mining";
    }

    // Update the results file based on selected category
    resultsFile = `us-${categoryName}.json`;
    console.log(`\nSelected category: ${categoryName}`);
    console.log(`Results will be saved to: ${resultsFile}`);

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

    // Start the fetch process with the selected category
    await fetchData(lastPageToken, selectedCategory);
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
