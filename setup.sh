#!/bin/bash

# Update and install dependencies
apt-get update
apt-get install -y libappindicator1 fonts-liberation

# Install Google Chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
dpkg -i google-chrome-stable_current_amd64.deb || apt --fix-broken install -y
dpkg -i google-chrome-stable_current_amd64.deb

# Check Chrome version
google-chrome-stable --version

npm install

echo ""
echo "================================================="
echo "Setup complete! Please run the following command or restart your terminal:"
echo "source ~/.bashrc  # If using bash"
echo "source ~/.zshrc   # If using zsh"
echo "================================================="

