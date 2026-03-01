// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("blsr", {
  mintReward: async (logLine) => {
    return ipcRenderer.invoke("blsr:mintReward", logLine);
  },
});
