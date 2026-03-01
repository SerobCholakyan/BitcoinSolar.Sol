const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const BLSRMinter = require("../backend/blsr-mint");

let mainWindow;
let blsrMinter;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: "#000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, "renderer/index.html"));
}

app.whenReady().then(() => {
  blsrMinter = new BLSRMinter({
    rpcUrl: process.env.BLSR_RPC_URL,
    privateKey: process.env.BLSR_MINTER_PK,
    contractAddress: process.env.BLSR_CONTRACT,
    abi: require("../backend/blsr-abi.json"),
    gas: {
      maxFeePerGas: process.env.BLSR_MAX_FEE_PER_GAS || undefined,
      maxPriorityFeePerGas: process.env.BLSR_MAX_PRIORITY_FEE_PER_GAS || undefined
    },
    logger: console
  });

  createWindow();
});

app.on("before-quit", async () => {
  if (blsrMinter) await blsrMinter.shutdown();
});

ipcMain.handle("blsr:mintReward", async (_event, logLine) => {
  try {
    const receipt = await blsrMinter.mintReward(logLine);
    return {
      ok: true,
      txHash: receipt.transactionHash,
      status: receipt.status,
      blockNumber: receipt.blockNumber
    };
  } catch (err) {
    return { ok: false, error: err?.message || "Unknown error" };
  }
});
