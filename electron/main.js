// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const BLSRMinter = require("../backend/blsr-mint"); // path to your production BLSRMinter

let mainWindow;
let blsrMinter;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL("http://localhost:3000"); // or your bundled frontend
}

app.whenReady().then(() => {
  // Instantiate once, reuse
  blsrMinter = new BLSRMinter({
    rpcUrl: process.env.BLSR_RPC_URL,
    privateKey: process.env.BLSR_MINTER_PK,
    contractAddress: process.env.BLSR_CONTRACT,
    abi: require("../backend/blsr-abi.json"),
    gas: {
      maxFeePerGas: process.env.BLSR_MAX_FEE_PER_GAS || undefined,
      maxPriorityFeePerGas: process.env.BLSR_MAX_PRIORITY_FEE_PER_GAS || undefined,
    },
    logger: console,
  });

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", async () => {
  if (blsrMinter) {
    await blsrMinter.shutdown();
  }
});

// IPC handler for minting
ipcMain.handle("blsr:mintReward", async (_event, logLine) => {
  try {
    const receipt = await blsrMinter.mintReward(logLine);
    return {
      ok: true,
      txHash: receipt.transactionHash,
      status: receipt.status,
      blockNumber: receipt.blockNumber,
    };
  } catch (err) {
    const message = err?.message || "Unknown error";
    return {
      ok: false,
      error: message,
    };
  }
});
