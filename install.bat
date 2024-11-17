@echo off
echo Starting the bot...

:: Install required npm packages
npm install colors
npm install inquirer@6
npm install axios
npm install ws
npm install uuid
npm install socks-proxy-agent
npm install https-proxy-agent

:: fs is built-in, no need to install it via npm
echo fs is a built-in Node.js module and does not need to be installed.

pause
