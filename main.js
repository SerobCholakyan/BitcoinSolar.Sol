const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

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

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ---- Miner integration stub ----
// Call this from your real miner logic when a block is solved.
function minerBlockSolved() {
  if (mainWindow) {
    mainWindow.webContents.send('miner:block-solved');
  }
}

// Demo: simulate a solved block every 30 seconds
setInterval(() => {
  minerBlockSolved();
}, 30000);
