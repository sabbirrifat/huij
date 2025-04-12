const axios = require("axios");
const fs = require("fs");
const readline = require("readline");


const accountName = "Ryan Hendricks";
// Global array to store all fetched items
let authToken = "";
let allFetchedItems = [];
const resultsFile = "testing-10k.json";

// Counter for API calls
let apiCallCount = 0;
const MAX_API_CALLS = 100;
const WAIT_TIME = 100;

// a80c0b91-30b4-415a-a2a2-c5cbbfe0f500
// e3266d9f-1e25-4fb5-97fe-d4a9bee042d7
// e3266d9f-1e25-4fb5-97fe-d4a9bee042d7



// Base URL and authorization token
const baseUrl =
  "https://api.zeliq.com/api/a80c0b91-30b4-415a-a2a2-c5cbbfe0f500/leads/search?limitPerPage=100&resource=contact";

// Create readline interface for prompting user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

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

// Function to make API request with optional page token
async function fetchData(pageToken = null) {
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

    console.log(`Making API call #${apiCallCount} of ${MAX_API_CALLS}`);

    const response = await axios.post(
      url,
      {
        filters: [
          {
            field: "location_country",
            operator: "ANY_OF_VALUES",
            values: ["united states"],
          },
          {
            field: "job_company_industry",
            operator: "ANY_OF_VALUES",
            values: [
              "accessible architecture and design",
              "accounting",
              "advertising services",
              "alternative dispute resolution",
              "architecture and planning",
              "biotechnology research",
              "business consulting and services",
              "computer and network security",
              "design",
              "design services",
              "digital accessibility services",
              "engineering services",
              "environmental services",
              "government relations services",
              "graphic design",
              "human resources",
              "human resources services",
              "interior design",
              "it services and it consulting",
              "it system custom software development",
              "it system data services",
              "it system design services",
              "it system installation and disposal",
              "it system operations and maintenance",
              "it system testing and evaluation",
              "it system training and support",
              "law practice",
              "legal services",
              "market research",
              "marketing services",
              "nanotechnology research",
              "operations consulting",
              "outsourcing and offshoring consulting",
              "photography",
              "program development",
              "public relations and communications services",
              "regenerative design",
              "research services",
              "robotics engineering",
              "services for renewable energy",
              "strategic management services",
              "surveying and mapping services",
              "think tanks",
              "veterinary services",
            ],
          },
        ],
      },
      {
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
          //"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        },
        //httpsAgent: httpsAgent,
      }
    );

    const data = response.data;

    // Add items to global array
    if (data.items && Array.isArray(data.items)) {
      allFetchedItems.push(...data.items);
      console.log(`Fetched ${data.items.length} items. Total items so far: ${allFetchedItems.length}`);
    }

    // Check if we have a next page token and haven't reached the API call limit
    if (data.meta && data.meta.nextPageToken && apiCallCount < MAX_API_CALLS) {
      console.log(`Fetching next page with token: ${data.meta.nextPageToken}`);
      // Wait 1 second between requests to avoid rate limiting
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
    }
  } catch (error) {
    console.log("Error fetching data:", error.message);
    if (error.response) {
      console.log("Response status:", error.response.status);
      console.log("Response data:", error.response.data);

      // Handle 401 Unauthorized error
      if (error.response.status === 401) {
        console.log(
          `\x1b[31m🚨 Authentication token expired for ${accountName}. Please enter a new session token: 🚨\x1b[0m`
        );

        // Prompt for new auth token
        const newToken = await new Promise((resolve) => {
          rl.question("Enter new session token: ", (answer) => {
            resolve(answer.trim());
          });
        });

        // Update auth token and save to session.txt
        authToken = newToken;
        fs.writeFileSync("session.txt", authToken);
        console.log("New authentication token saved to session.txt");

        // Retry the request with the new token (don't increment API call count)
        apiCallCount--;
        await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));
        return await fetchData(pageToken);
      }
    }
  }
}

// Start the initial fetch
(async function () {
  try {
    if (fs.existsSync("session.txt")) {
      authToken = fs.readFileSync("session.txt", "utf8").trim();
      console.log(`Loaded auth token from session.txt`);
    } else {
      console.error("No session found in session.txt");
      return;
    }
    // Load existing data
    allFetchedItems = loadExistingData();
    console.log(`Loaded ${allFetchedItems.length} existing items from ${resultsFile}`);

    // Check if we have a stored page token
    let lastPageToken = null;
    if (fs.existsSync("lastPageToken.txt")) {
      lastPageToken = fs.readFileSync("lastPageToken.txt", "utf8").trim();
      console.log(`Starting with stored page token: ${lastPageToken}`);
    }

    // Start the fetch process
    await fetchData(lastPageToken);
    console.log("Process completed");
    rl.close(); // Close readline interface when done
  } catch (err) {
    console.error("Unhandled error:", err);
    rl.close(); // Close readline interface on error
  }
})();
