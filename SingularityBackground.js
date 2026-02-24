import { useEffect, useRef } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0xYourDeployedContractAddressHere";
const CONTRACT_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

export function useMinerEvents(onBlockSolved) {
  const callbackRef = useRef(onBlockSolved);
  callbackRef.current = onBlockSolved;

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) {
      console.warn("MetaMask not detected — miner listener disabled.");
      return;
    }

    let contract;

    const init = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

        console.log("🌌 Gravity sensors active — listening for BLSR mint events.");

        contract.on("Transfer", (from, to, value) => {
          if (from === ethers.ZeroAddress) {
            console.log("☄️ Block Solved! Singularity triggered.");
            callbackRef.current();
          }
        });
      } catch (err) {
        console.error("❌ Miner event listener failed:", err);
      }
    };

    init();

    return () => {
      if (contract) {
        console.log("🧹 Cleaning up BLSR event listeners.");
        contract.removeAllListeners("Transfer");
      }
    };
  }, []);
}
