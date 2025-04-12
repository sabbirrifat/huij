#!/bin/bash

# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 22
nvm install 22

# Show versions
node -v
nvm current
npm -v

# Update and install dependencies
apt-get update
apt-get install -y libappindicator1 fonts-liberation

# Install Google Chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
dpkg -i google-chrome-stable_current_amd64.deb || apt --fix-broken install -y
dpkg -i google-chrome-stable_current_amd64.deb

# Check Chrome version
google-chrome-stable --version

