// main.js
// BLSR Miner — Singularity Engine Host (Electron Shell)

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
require("dotenv").config();

const MinerWatcher = require("./miner-watcher");
const BLSRMinter = require("./blsr-mint");
const CONTRACT_ABI = require("./blsr-abi.json");

// ------------------------------------------------------------
// CONFIG — All production-sensitive values should use env vars
// ------------------------------------------------------------
const LOG_PATH =
  process.env.BLSR_MINER_LOG_PATH || "C:/miner/logs/miner.log";

const RPC_URLS = [
  process.env.BLSR_RPC_URL,
  "https://polygon-rpc.com",
  "https://rpc-mainnet.matic.quiknode.pro",
  "https://polygon-bor.publicnode.com"
].filter(Boolean);

const PRIVATE_KEY = process.env.BLSR_PRIVATE_KEY || "0xYOUR_PRIVATE_KEY";
const CONTRACT_ADDRESS =
  process.env.BLSR_CONTRACT_ADDRESS || "0xYOUR_BLSR_CONTRACT";

let mainWindow = null;
let watcher = null;
let minter = null;
let isReady = false;

// ------------------------------------------------------------
// Helper: Send IPC safely
// ------------------------------------------------------------
function sendToRenderer(channel, payload) {
  if (!mainWindow || !mainWindow.webContents) return;
  try {
    mainWindow.webContents.send(channel, payload);
  } catch (err) {
    console.error(`IPC send failed (${channel}):`, err);
  }
}

// ------------------------------------------------------------
// Create Electron Window
// ------------------------------------------------------------
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1024,
    minHeight: 600,
    backgroundColor: "#050510",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile("index.html");

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    sendToRenderer("app:ready", {
      logPath: LOG_PATH,
      rpcUrls: RPC_URLS,
      contract: CONTRACT_ADDRESS
    });
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// ------------------------------------------------------------
// RPC Fallback Logic
// ------------------------------------------------------------
async function getWorkingRPC() {
  for (const url of RPC_URLS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_blockNumber",
          params: []
        })
      });
      if (res.ok) {
        console.log("RPC OK:", url);
        return url;
      }
    } catch (_) {
      // ignore and try next
    }
  }
  throw new Error("No working RPC endpoint available.");
}

// ------------------------------------------------------------
// Miner Integration
// ------------------------------------------------------------
async function setupMinerIntegration() {
  let rpcUrl = null;

  try {
    rpcUrl = await getWorkingRPC();
  } catch (err) {
    console.error("RPC selection failed:", err);
    sendToRenderer("miner:error", {
      type: "rpc",
      message: "No working RPC endpoint available."
    });
    return;
  }

  watcher = new MinerWatcher(LOG_PATH);
  minter = new BLSRMinter(rpcUrl, PRIVATE_KEY, CONTRACT_ADDRESS, CONTRACT_ABI);

  sendToRenderer("miner:status", {
    status: "watching",
    logPath: LOG_PATH,
    rpcUrl
  });

  watcher.on("blockSolved", async (logLine) => {
    console.log("Block solved detected:", logLine);

    sendToRenderer("miner:solved", {
      status: "detected",
      log: logLine,
      tx: null
    });

    try {
      const receipt = await minter.mintReward(logLine);
      sendToRenderer("miner:solved", {
        status: "minted",
        log: logLine,
        tx: receipt?.transactionHash || null
      });
    } catch (err) {
      console.error("Mint error:", err);
      sendToRenderer("miner:error", {
        type: "mint",
        message: err?.message || String(err),
        log: logLine
      });
    }
  });

  watcher.on("error", (err) => {
    console.error("Watcher error:", err);
    sendToRenderer("miner:error", {
      type: "watcher",
      message: err?.message || String(err)
    });
  });
}

// ------------------------------------------------------------
// IPC: Renderer Requests Status
// ------------------------------------------------------------
ipcMain.handle("miner:get-status", async () => {
  return {
    logPath: LOG_PATH,
    rpcUrls: RPC_URLS,
    contract: CONTRACT_ADDRESS,
    watching: !!watcher
  };
});

// ------------------------------------------------------------
// App Lifecycle
// ------------------------------------------------------------
app.whenReady().then(() => {
  isReady = true;
  createWindow();
  setupMinerIntegration();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// ------------------------------------------------------------
// Graceful Shutdown
// ------------------------------------------------------------
app.on("before-quit", () => {
  try {
    watcher?.stop?.();
  } catch (err) {
    console.error("Error stopping watcher:", err);
  }
  try {
    minter?.shutdown?.();
  } catch (err) {
    console.error("Error shutting down minter:", err);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// ------------------------------------------------------------
// Uncaught Exception Handling
// ------------------------------------------------------------
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  if (isReady) {
    sendToRenderer("miner:error", {
      type: "uncaught",
      message: err?.message || String(err)
    });
  }
});

