// preload.js
// Secure IPC bridge for BLSR Miner — Singularity Engine

const { contextBridge, ipcRenderer } = require("electron");

// ------------------------------------------------------------
// Internal helpers (not exposed directly)
// ------------------------------------------------------------

// Safe event subscription wrapper
function on(channel, callback) {
  ipcRenderer.on(channel, (_, data) => callback(data));
}

// Safe invoke wrapper
function invoke(channel, payload) {
  return ipcRenderer.invoke(channel, payload);
}

// ------------------------------------------------------------
// Exposed API surface — the ONLY bridge to the renderer
// ------------------------------------------------------------
contextBridge.exposeInMainWorld("minerAPI", {
  //
  // 🔥 Events from main → renderer
  //

  /**
   * Fired when Electron window is ready and config is sent.
   * Contains: logPath, rpcUrls, contract
   */
  onAppReady: (callback) => on("app:ready", callback),

  /**
   * Fired when a block is solved.
   * status = "detected" or "minted"
   * tx = transaction hash (if minted)
   */
  onSolved: (callback) => on("miner:solved", callback),

  /**
   * Fired when miner status changes.
   * Contains: watching, rpcUrl, logPath
   */
  onStatus: (callback) => on("miner:status", callback),

  /**
   * Fired when ANY error occurs:
   * - RPC failure
   * - Minting error
   * - Watcher error
   * - Uncaught exception
   */
  onError: (callback) => on("miner:error", callback),

  //
  // ⚡ Renderer → main requests
  //

  /**
   * Ask main process for miner status.
   * Returns: { logPath, rpcUrls, contract, watching }
   */
  getStatus: () => invoke("miner:get-status"),

  //
  // 🧹 Utility
  //

  /**
   * Remove all listeners for a given channel.
   * Useful when navigating between pages in React.
   */
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});
