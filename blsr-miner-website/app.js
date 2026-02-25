// app.js
// Frontend logic for BLSR web miner dashboard

import { fetchStats, pingMining } from "./api.js";

const connectBtn = document.getElementById("connect-btn");
const startMiningBtn = document.getElementById("start-mining-btn");
const statusText = document.getElementById("status-text");
const addressText = document.getElementById("address-text");
const difficultyValue = document.getElementById("difficulty-value");
const totalJobsValue = document.getElementById("total-jobs-value");
const lastStatusEl = document.getElementById("last-status");
const lastMessageEl = document.getElementById("last-message");

let provider = null;
let signer = null;
let currentAddress = null;

async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask is required to use the BLSR web miner.");
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    currentAddress = await signer.getAddress();

    statusText.textContent = "Wallet Connected";
    addressText.textContent = currentAddress;
    startMiningBtn.disabled = false;
  } catch (err) {
    console.error("Wallet connect failed:", err);
    statusText.textContent = "Connection Failed";
  }
}

async function refreshStats() {
  try {
    const data = await fetchStats();
    // You can derive difficulty from totalMined on-chain if you want.
    difficultyValue.textContent = "dynamic";
    totalJobsValue.textContent = data.total_jobs ?? "–";
  } catch (err) {
    console.error("Stats fetch failed:", err);
    difficultyValue.textContent = "–";
    totalJobsValue.textContent = "–";
  }
}

async function handleStartMining() {
  if (!currentAddress) {
    alert("Connect your wallet first.");
    return;
  }

  statusText.textContent = "Signaling miner / backend...";
  lastStatusEl.textContent = "Pending";

  try {
    const res = await pingMining(currentAddress);
    lastStatusEl.textContent = res.status || "ok";
    lastMessageEl.textContent = res.message || "";
    statusText.textContent = "Mining signal sent";
  } catch (err) {
    console.error("Mining request failed:", err);
    statusText.textContent = "Mining failed";
    lastStatusEl.textContent = "Error";
    lastMessageEl.textContent = err.message;
  }
}

connectBtn.addEventListener("click", connectWallet);
startMiningBtn.addEventListener("click", handleStartMining);

refreshStats();
setInterval(refreshStats, 30_000);
