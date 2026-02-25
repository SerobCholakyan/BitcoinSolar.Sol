// blsr-mint.js
// Handles on-chain minting of BLSR rewards when a block is solved.

const { ethers } = require("ethers");

class BLSRMinter {
  constructor(rpcUrl, privateKey, contractAddress, abi) {
    this.rpcUrl = rpcUrl;
    this.privateKey = privateKey;
    this.contractAddress = contractAddress;
    this.abi = abi;

    this.provider = null;
    this.wallet = null;
    this.contract = null;

    this._boot();
  }

  _boot() {
    if (!this.rpcUrl) {
      throw new Error("RPC URL is required for BLSRMinter");
    }

    if (!this.privateKey || this.privateKey === "0xYOUR_PRIVATE_KEY") {
      console.warn("[BLSRMinter] WARNING: Using placeholder private key.");
    }

    if (!this.contractAddress || this.contractAddress === "0xYOUR_BLSR_CONTRACT") {
      console.warn("[BLSRMinter] WARNING: Using placeholder contract address.");
    }

    this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
    this.wallet = new ethers.Wallet(this.privateKey, this.provider);
    this.contract = new ethers.Contract(
      this.contractAddress,
      this.abi,
      this.wallet
    );
  }

  /**
   * Mint reward based on a solved block log line.
   * You can customize how logLine is parsed and passed.
   *
   * Strategy:
   * - If contract has `mintReward(string)` → call that
   * - Else if contract has `mine(bytes32)` → hash logLine and call that
   */
  async mintReward(logLine) {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }

    const iface = new ethers.Interface(this.abi);
    const functions = Object.keys(iface.functions || {});

    const hasMintReward = functions.some((f) =>
      f.startsWith("mintReward(")
    );
    const hasMine = functions.some((f) => f.startsWith("mine("));

    let tx;

    if (hasMintReward) {
      tx = await this._sendWithRetry(() =>
        this.contract.mintReward(logLine)
      );
    } else if (hasMine) {
      const nonceBytes = ethers.id(logLine); // keccak256(logLine)
      tx = await this._sendWithRetry(() =>
        this.contract.mine(nonceBytes)
      );
    } else {
      throw new Error(
        "No supported mint function found (expected mintReward(string) or mine(bytes32))"
      );
    }

    const receipt = await tx.wait();
    return receipt;
  }

  async _sendWithRetry(fn, maxRetries = 3) {
    let lastError = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const tx = await fn();
        return tx;
      } catch (err) {
        lastError = err;
        console.error(
          `[BLSRMinter] tx attempt ${i + 1} failed:`,
          err
        );
        await new Promise((res) =>
          setTimeout(res, 1500 * (i + 1))
        );
      }
    }

    throw lastError || new Error("Transaction failed after retries");
  }

  async shutdown() {
    // Placeholder for future cleanup if needed
    this.provider = null;
    this.wallet = null;
    this.contract = null;
  }
}

module.exports = BLSRMinter;
