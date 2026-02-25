// preload.js
// Secure IPC bridge for BLSR Miner — Singularity Engine

const { contextBridge, ipcRenderer } = require("electron");

function on(channel, callback) {
  ipcRenderer.on(channel, (_, data) => callback(data));
}

function invoke(channel, payload) {
  return ipcRenderer.invoke(channel, payload);
}

contextBridge.exposeInMainWorld("minerAPI", {
  onAppReady: (callback) => on("app:ready", callback),
  onSolved: (callback) => on("miner:solved", callback),
  onStatus: (callback) => on("miner:status", callback),
  onError: (callback) => on("miner:error", callback),
  getStatus: () => invoke("miner:get-status"),
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});
