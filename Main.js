// Import dependencies
const colors = require('colors');
const inquirer = require('inquirer');
const axios = require('axios');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const { SocksProxyAgent } = require('socks-proxy-agent');
const { HttpsProxyAgent } = require('https-proxy-agent');
const fs = require('fs');

// Base64 Encoded ASCII Banner
const encodedBanner = 'Ky0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSsKfCDilojilojilojilojilojilojilZcg4paI4paI4paI4paI4paI4paI4pWXIOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKVl+KWiOKWiOKVlyAgICDilojilojilojilZcgICDilojilojilojilZcg4paI4paI4paI4paI4paI4pWXIOKWiOKWiOKVlyAgICAgfAp84paI4paI4pWU4pWQ4pWQ4pWQ4paI4paI4pWX4paI4paI4pWU4pWQ4pWQ4paI4paI4pWX4pWa4pWQ4pWQ4paI4paI4pWU4pWQ4pWQ4pWd4paI4paI4pWRICAgIOKWiOKWiOKWiOKWiOKVlyDilojilojilojilojilZHilojilojilZTilZDilZDilojilojilZfilojilojilZEgICAgIHwKfOKWiOKWiOKVkSAgIOKWiOKWiOKVkeKWiOKWiOKWiOKWiOKWiOKWiOKVlOKVnSAgIOKWiOKWiOKVkSAgIOKWiOKWiOKVkSAgICDilojilojilZTilojilojilojilojilZTilojilojilZHilojilojilojilojilojilojilojilZHilojilojilZEgICAgIHwKfOKWiOKWiOKVkSAgIOKWiOKWiOKVkeKWiOKWiOKVlOKVkOKVkOKVkOKVnSAgICDilojilojilZEgICDilojilojilZEgICAg4paI4paI4pWR4pWa4paI4paI4pWU4pWd4paI4paI4pWR4paI4paI4pWU4pWQ4pWQ4paI4paI4pWR4paI4paI4pWRICAgICB8CnzilZrilojilojilojilojilojilojilZTilZ3ilojilojilZEgICAgICAgIOKWiOKWiOKVkSAgIOKWiOKWiOKVkSAgICDilojilojilZEg4pWa4pWQ4pWdIOKWiOKWiOKVkeKWiOKWiOKVkSAg4paI4paI4pWR4paI4paI4paI4paI4paI4paI4paI4pWXfAp8IOKVmuKVkOKVkOKVkOKVkOKVkOKVnSDilZrilZDilZ0gICAgICAgIOKVmuKVkOKVnSAgIOKVmuKVkOKVnSAgICDilZrilZDilZ0gICAgIOKVmuKVkOKVneKVmuKVkOKVnSAg4pWa4pWQ4pWd4pWa4pWQ4pWQ4pWQ4pWQ4pWQ4pWQ4pWdfAp8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfAp8IOKWiOKWiOKWiOKWiOKWiOKWiOKVlyDilojilojilojilojilojilojilZcgIOKWiOKWiOKWiOKWiOKWiOKWiOKVlyDilojilojilZcgICAg4paI4paI4pWXICAgIOKWiOKWiOKVlyAgIOKWiOKWiOKVl+KWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKVlyAgfAp84paI4paI4pWU4pWQ4pWQ4pWQ4pWQ4pWdIOKWiOKWiOKVlOKVkOKVkOKWiOKWiOKVl+KWiOKWiOKVlOKVkOKVkOKVkOKWiOKWiOKVl+KWiOKWiOKVkSAgICDilojilojilZEgICAg4pWa4paI4paI4pWXIOKWiOKWiOKVlOKVneKVmuKVkOKVkOKWiOKWiOKVlOKVkOKVkOKVnSAgfAp84paI4paI4pWRICDilojilojilojilZfilojilojilojilojilojilojilZTilZ3ilojilojilZEgICDilojilojilZHilojilojilZEg4paI4pWXIOKWiOKWiOKVkSAgICAg4pWa4paI4paI4paI4paI4pWU4pWdICAgIOKWiOKWiOKVkSAgICAgfAp84paI4paI4pWRICAg4paI4paI4pWR4paI4paI4pWU4pWQ4pWQ4paI4paI4pWX4paI4paI4pWRICAg4paI4paI4pWR4paI4paI4pWR4paI4paI4paI4pWX4paI4paI4pWRICAgICAg4pWa4paI4paI4pWU4pWdICAgICDilojilojilZEgICAgIHwKfOKVmuKWiOKWiOKWiOKWiOKWiOKWiOKVlOKVneKWiOKWiOKVkSAg4paI4paI4pWR4pWa4paI4paI4paI4paI4paI4paI4pWU4pWd4pWa4paI4paI4paI4pWU4paI4paI4paI4pWU4pWdICAgICAgIOKWiOKWiOKVkSAgICAgIOKWiOKWiOKVkSAgICAgfAp8IOKVmuKVkOKVkOKVkOKVkOKVkOKVnSDilZrilZDilZ0gIOKVmuKVkOKVnSDilZrilZDilZDilZDilZDilZDilZ0gIOKVmuKVkOKVkOKVneKVmuKVkOKVkOKVnSAgICAgICAg4pWa4pWQ4pWdICAgICAg4pWa4pWQ4pWdICAgICB8CistLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0r==';  // This is a base64 string of the banner

// Configuration object
class Config {
  constructor() {
    this.ipCheckURL = 'https://ipinfo.io/json';
    this.wssList = ['proxy2.wynd.network:4444', 'proxy2.wynd.network:4650'];
    this.retryInterval = 20000;
    this.wssHost =
      this.wssList[Math.floor(Math.random() * this.wssList.length)];
  }
}

// Bot class to manage WebSocket connections and proxy handling
class Bot {
  constructor(config) {
    this.config = config;
  }

  async getProxyIP(proxy) {
    const agent = proxy.startsWith('http')
      ? new HttpsProxyAgent(proxy)
      : new SocksProxyAgent(proxy);
    try {
      const response = await axios.get(this.config.ipCheckURL, {
        httpsAgent: agent,
      });
      console.log(`Connected through proxy ${proxy}`.green);
      return response.data;
    } catch (error) {
      console.error(
        `Skipping proxy ${proxy} due to connection error: ${error.message}`
          .yellow
      );
      return null;
    }
  }

  async connectToProxy(proxy, userID) {
    const formattedProxy = proxy.startsWith('socks5://')
      ? proxy
      : proxy.startsWith('http')
      ? proxy
      : `socks5://${proxy}`;
    const proxyInfo = await this.getProxyIP(formattedProxy);

    if (!proxyInfo) {
      return;
    }

    try {
      const agent = formattedProxy.startsWith('http')
        ? new HttpsProxyAgent(formattedProxy)
        : new SocksProxyAgent(formattedProxy);
      const wsURL = `wss://${this.config.wssHost}`;
      const ws = new WebSocket(wsURL, {
        agent,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0',
          Pragma: 'no-cache',
          'Accept-Language': 'uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7',
          'Cache-Control': 'no-cache',
          OS: 'Windows',
          Platform: 'Desktop',
          Browser: 'Mozilla',
        },
      });

      ws.on('open', () => {
        console.log(`Connected to ${proxy}`.cyan);
        console.log(`Proxy IP Info: ${JSON.stringify(proxyInfo)}`.magenta);
        this.sendPing(ws, proxyInfo.ip);
      });

      ws.on('message', (message) => {
        const msg = JSON.parse(message);
        console.log(`Received message: ${JSON.stringify(msg)}`.blue);

        if (msg.action === 'AUTH') {
          const authResponse = {
            id: msg.id,
            origin_action: 'AUTH',
            result: {
              browser_id: uuidv4(),
              user_id: userID,
              user_agent: 'Mozilla/5.0',
              timestamp: Math.floor(Date.now() / 1000),
              device_type: 'desktop',
              version: '4.28.2',
            },
          };
          ws.send(JSON.stringify(authResponse));
          console.log(
            `Sent auth response: ${JSON.stringify(authResponse)}`.green
          );
        } else if (msg.action === 'PONG') {
          console.log(`Received PONG: ${JSON.stringify(msg)}`.blue);
        }
      });

      ws.on('close', (code, reason) => {
        console.log(
          `WebSocket closed with code: ${code}, reason: ${reason}`.yellow
        );
        setTimeout(
          () => this.connectToProxy(proxy, userID),
          this.config.retryInterval
        );
      });

      ws.on('error', (error) => {
        console.error(
          `WebSocket error on proxy ${proxy}: ${error.message}`.red
        );
        ws.terminate();
      });
    } catch (error) {
      console.error(
        `Failed to connect with proxy ${proxy}: ${error.message}`.red
      );
    }
  }

  async connectDirectly(userID) {
    try {
      const wsURL = `wss://${this.config.wssHost}`;
      const ws = new WebSocket(wsURL, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0',
          Pragma: 'no-cache',
          'Accept-Language': 'uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7',
          'Cache-Control': 'no-cache',
          OS: 'Windows',
          Platform: 'Desktop',
          Browser: 'Mozilla',
        },
      });

      ws.on('open', () => {
        console.log(`Connected directly without proxy`.cyan);
        this.sendPing(ws, 'Direct IP');
      });

      ws.on('message', (message) => {
        const msg = JSON.parse(message);
        console.log(`Received message: ${JSON.stringify(msg)}`.blue);

        if (msg.action === 'AUTH') {
          const authResponse = {
            id: msg.id,
            origin_action: 'AUTH',
            result: {
              browser_id: uuidv4(),
              user_id: userID,
              user_agent: 'Mozilla/5.0',
              timestamp: Math.floor(Date.now() / 1000),
              device_type: 'desktop',
              version: '4.28.2',
            },
          };
          ws.send(JSON.stringify(authResponse));
          console.log(
            `Sent auth response: ${JSON.stringify(authResponse)}`.green
          );
        } else if (msg.action === 'PONG') {
          console.log(`Received PONG: ${JSON.stringify(msg)}`.blue);
        }
      });

      ws.on('close', (code, reason) => {
        console.log(
          `WebSocket closed with code: ${code}, reason: ${reason}`.yellow
        );
        setTimeout(
          () => this.connectDirectly(userID),
          this.config.retryInterval
        );
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error: ${error.message}`.red);
        ws.terminate();
      });
    } catch (error) {
      console.error(`Failed to connect directly: ${error.message}`.red);
    }
  }

  sendPing(ws, proxyIP) {
    setInterval(() => {
      const pingMessage = {
        id: uuidv4(),
        version: '1.0.0',
        action: 'PING',
        data: {},
      };
      ws.send(JSON.stringify(pingMessage));
      console.log(
        `Sent ping - IP: ${proxyIP}, Message: ${JSON.stringify(pingMessage)}`
          .cyan
      );
    }, 26000);
  }
}

// Proxy manager functions
const PROXY_SOURCES = {
  'SERVER 1': 'https://files.ramanode.top/airdrop/grass/server_1.txt',
  'SERVER 2': 'https://files.ramanode.top/airdrop/grass/server_2.txt',
  'SERVER 3': 'https://files.ramanode.top/airdrop/grass/server_3.txt',
  'SERVER 4': 'https://files.ramanode.top/airdrop/grass/server_4.txt',
  'SERVER 5': 'https://files.ramanode.top/airdrop/grass/server_5.txt',
  'SERVER 6': 'https://files.ramanode.top/airdrop/grass/server_6.txt',
};

async function fetchProxies(url) {
  try {
    const response = await axios.get(url);
    console.log(`\nFetched proxies from ${url}`.green);
    return response.data.split('\n').filter(Boolean);
  } catch (error) {
    console.error(`Failed to fetch proxies from ${url}: ${error.message}`.red);
    return [];
  }
}

async function readLines(filename) {
  try {
    const data = await fs.promises.readFile(filename, 'utf-8');
    console.log(`Loaded data from ${filename}`.green);
    return data.split('\n').filter(Boolean);
  } catch (error) {
    console.error(`Failed to read ${filename}: ${error.message}`.red);
    return [];
  }
}

async function selectProxySource(inquirer) {
  const choices = [...Object.keys(PROXY_SOURCES), 'CUSTOM', 'NO PROXY'];
  const { source } = await inquirer.prompt([
    {
      type: 'list',
      name: 'source',
      message: 'Select proxy source:'.cyan,
      choices,
    },
  ]);

  if (source === 'CUSTOM') {
    const { filename } = await inquirer.prompt([
      {
        type: 'input',
        name: 'filename',
        message: 'Enter the path to your proxy.txt file:'.cyan,
        default: 'proxy.txt',
      },
    ]);
    return { type: 'file', source: filename };
  } else if (source === 'NO PROXY') {
    return { type: 'none' };
  }

  return { type: 'url', source: PROXY_SOURCES[source] };
}

// Utility functions
const delay = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Decode and display the ASCII banner
function displayHeader() {
  process.stdout.write('\x1Bc');
  const decodedBanner = Buffer.from(encodedBanner, 'base64').toString('utf-8');
  console.log(decodedBanner.cyan);  // Display the decoded ASCII banner
  console.log(colors.white.bold('CREATED BY : DR ABDUL MATIN KARIMI: ⨭ ' + colors.green('https://t.me/doctor_amk')));
  console.log(colors.white('DOWNLOAD LATEST HACKS HERE ➤ ' + colors.green('https://t.me/optimalgrowYT')));
  console.log(colors.red('LEARN HACKING HERE ➤ ' + colors.green('https://www.youtube.com/@optimalgrowYT/videos')));
  console.log(colors.red('DOWNLOAD MORE HACKS ➤ ' + colors.green('https://github.com/OptimalGrowYT')));
  console.log(colors.yellow('PASTE YOUR [USER 🆔] INTO USER_ID.TXT FILE AND PRESS START'));
  console.log(colors.green('❖❀～ ɢʀᴀꜱꜱ ʜᴀᴄᴋ ᴍᴀꜱᴛᴇʀ ～❀❖ '));
  console.log();
}

// Main execution function
async function main() {
  displayHeader();
  console.log(`Please wait...\n`.yellow);

  await delay(1000);

  const config = new Config();
  const bot = new Bot(config);

  const proxySource = await selectProxySource(inquirer);

  let proxies = [];
  if (proxySource.type === 'file') {
    proxies = await readLines(proxySource.source);
  } else if (proxySource.type === 'url') {
    proxies = await fetchProxies(proxySource.source);
  } else if (proxySource.type === 'none') {
    console.log('No proxy selected. Connecting directly.'.cyan);
  }

  if (proxySource.type !== 'none' && proxies.length === 0) {
    console.error('No proxies found. Exiting...'.red);
    return;
  }

  console.log(
    proxySource.type !== 'none'
      ? `Loaded ${proxies.length} proxies`.green
      : 'Direct connection mode enabled.'.green
  );

  const userIDs = await readLines('USER_ID.txt');
  if (userIDs.length === 0) {
    console.error('No user IDs found in uid.txt. Exiting...'.red);
    return;
  }

  console.log(`Loaded ${userIDs.length} user IDs\n`.green);

  const connectionPromises = userIDs.flatMap((userID) =>
    proxySource.type !== 'none'
      ? proxies.map((proxy) => bot.connectToProxy(proxy, userID))
      : [bot.connectDirectly(userID)]
  );

  await Promise.all(connectionPromises);
}

main().catch(console.error);
