// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('minerAPI', {
  onBlockSolved: (callback) => {
    ipcRenderer.on("miner:block-solved", (_, data) => callback(data));
  }
});
