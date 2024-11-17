@echo off
echo Installing required Node.js packages...

:: Install inquirer@6
npm install inquirer@6

:: Install axios
npm install axios

:: Install ws
npm install ws

:: Install uuid
npm install uuid

:: Install colors
npm install colors

:: Install socks-proxy-agent
npm install socks-proxy-agent

:: Install https-proxy-agent
npm install https-proxy-agent

echo All packages installed successfully!
pause
