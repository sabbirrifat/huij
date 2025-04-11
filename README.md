# Web Scraping Script with Session Management

This Node.js script performs web scraping with login session management and extracts the Bearer authentication token.

## Setup

1. Install dependencies:
```
npm install puppeteer
```

2. Edit the script (`pipo.js`) to add your actual login credentials:
```javascript
const email = 'your-email@example.com'; // Replace with your email
const password = 'your-password';       // Replace with your password
```

## Usage

Run the script with:
```
node pipo.js
```

## Features

- Logs into the specified website using the provided credentials
- Maintains session state
- Navigates to the desired page after login
- Extracts the Bearer authentication token
- Logs the token to the console

## Configuration

- Set `headless: true` in the Puppeteer configuration to run the browser in headless mode
- Adjust the XPath selectors if the website structure changes 