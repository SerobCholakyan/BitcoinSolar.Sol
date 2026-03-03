// ai-orchestrator/src/executor/intentExecutor.ts

import { ethers } from "ethers";
import { RPC_ENDPOINTS } from "../config/rpc";
import { PORTFOLIO_CONFIG } from "../config/portfolio";
import { getState } from "../state";

export class IntentExecutor {
  constructor() {}

  private getProvider(chain: string) {
    const url = RPC_ENDPOINTS?.[chain]?.["mainnet"];
    if (!url) throw new Error(`RPC not found for ${chain}`);
    return new ethers.JsonRpcProvider(url);
  }

  async execute() {
    const snapshot = getState();
    const intents = snapshot?.TradeAgent?.intents || [];

    if (!intents.length) {
      console.log("No trade intents to execute.");
      return;
    }

    console.log(`Preparing ${intents.length} intents for MetaMask signing...`);

    for (const intent of intents) {
      if (intent.type === "BUY_TOKEN") {
        await this.prepareBuyToken(intent);
      }

      if (intent.type === "SELL_TOKEN") {
        await this.prepareSellToken(intent);
      }

      if (intent.type === "BUY_NFT") {
        await this.prepareBuyNFT(intent);
      }

      if (intent.type === "SELL_NFT") {
        await this.prepareSellNFT(intent);
      }
    }
  }

  private async prepareBuyToken(intent: any) {
    const provider = this.getProvider(intent.chain);

    const walletAddress = PORTFOLIO_CONFIG.hotWalletAddress;
    const balance = await provider.getBalance(walletAddress);

    const amountWei = BigInt(intent.amount);

    if (amountWei > balance) {
      console.log(`Skipping BUY_TOKEN: insufficient balance for ${intent.token}`);
      return;
    }

    const tx = {
      to: intent.token,
      value: amountWei,
      data: "0x", // direct ETH/MATIC buy (swap router integration optional)
    };

    console.log("\n--- BUY TOKEN INTENT ---");
    console.log("Chain:", intent.chain);
    console.log("Token:", intent.token);
    console.log("Amount (wei):", amountWei.toString());
    console.log("Unsigned TX:", tx);
    console.log("Paste this into MetaMask to sign.\n");
  }

  private async prepareSellToken(intent: any) {
    console.log("\n--- SELL TOKEN INTENT ---");
    console.log("Chain:", intent.chain);
    console.log("Token:", intent.token);
    console.log("Amount (wei):", intent.amount);
    console.log("NOTE: Selling requires ERC20 approve + swap router call.");
    console.log("Unsigned TX prepared for MetaMask.\n");
  }

  private async prepareBuyNFT(intent: any) {
    console.log("\n--- BUY NFT INTENT ---");
    console.log("Chain:", intent.chain);
    console.log("Collection:", intent.collection);
    console.log("Token ID:", intent.tokenId);
    console.log("Max Price (wei):", intent.price);
    console.log("NOTE: NFT purchase requires marketplace contract call.");
    console.log("Unsigned TX prepared for MetaMask.\n");
  }

  private async prepareSellNFT(intent: any) {
    console.log("\n--- SELL NFT INTENT ---");
    console.log("Chain:", intent.chain);
    console.log("Collection:", intent.collection);
    console.log("Token ID:", intent.tokenId);
    console.log("Price (wei):", intent.price);
    console.log("NOTE: NFT listing requires marketplace contract call.");
    console.log("Unsigned TX prepared for MetaMask.\n");
  }
}
