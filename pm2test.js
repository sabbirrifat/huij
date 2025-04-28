const { exec } = require('child_process');
const fs = require('fs');

const countFile = 'testo.txt';
let counter = 0;
const maxCount = 600;
let shouldStopPM2 = false;

// Load counter from file if it exists
try {
  if (fs.existsSync(countFile)) {
    const data = fs.readFileSync(countFile, 'utf8');
    counter = parseInt(data.trim(), 10) || 0;
    console.log('\x1b[34m%s\x1b[0m', `Loaded count from file: ${counter}`);
  }
} catch (err) {
  console.error(`Error reading count file: ${err.message}`);
}

const interval = setInterval(() => {
  counter++;
  console.log('\x1b[32m%s\x1b[0m', `The current counter is: ${counter}`);
  
  // Save counter to file every 60 counts
  if (counter % 60 === 0) {
    try {
      fs.writeFileSync(countFile, counter.toString());
      console.log('\x1b[36m%s\x1b[0m', `Saved count to file <><><><><><><><><>: ${counter}`);
    } catch (err) {
      console.error(`Error saving count to file: ${err.message}`);
    }
  }
  
  if (counter >= maxCount) {
    shouldStopPM2 = true;
    clearInterval(interval);
    stopPM2();
  }
}, 1000);

function stopPM2() {
  // Save final count to file before stopping
  try {
    fs.writeFileSync(countFile, counter.toString());
    console.log('\x1b[36m%s\x1b[0m', `Saved final count to file: ${counter}`);
  } catch (err) {
    console.error(`Error saving count to file: ${err.message}`);
  }

  exec('pm2 stop all', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error stopping PM2: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`PM2 stderr: ${stderr}`);
      return;
    }
    console.log(`PM2 stopped: ${stdout}`);
    process.exit(0);
  });
}
