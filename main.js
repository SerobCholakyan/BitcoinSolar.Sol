// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

const MinerWatcher = require('./miner-watcher');
const BLSRMinter = require('./blsr-mint');
const CONTRACT_ABI = require('./blsr-abi.json');

// ---- CONFIG (edit these) ----
const LOG_PATH = "C:/miner/logs/miner.log"; // path to your miner log
const RPC_URL = "https://polygon-rpc.com";  // or your preferred RPC
const PRIVATE_KEY = "0xYOUR_PRIVATE_KEY";   // NEVER commit this
const CONTRACT_ADDRESS = "0xYOUR_BLSR_CONTRACT";

let mainWindow;
let watcher;
let minter;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    backgroundColor: '#050510',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function setupMinerIntegration() {
  watcher = new MinerWatcher(LOG_PATH);
  minter = new BLSRMinter(RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS, CONTRACT_ABI);

  watcher.on("blockSolved", async (logLine) => {
    console.log("Block solved detected:", logLine);

    let receipt = null;
    try {
      receipt = await minter.mintReward(logLine);
    } catch (e) {
      console.error("Error during mintReward:", e);
    }

    if (mainWindow) {
      mainWindow.webContents.send("miner:block-solved", {
        log: logLine,
        tx: receipt?.transactionHash || null
      });
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  setupMinerIntegration();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
