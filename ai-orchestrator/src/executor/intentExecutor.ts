// ai-orchestrator/src/executor/intentExecutor.ts

import { pushIntent } from "../state/intents";
import { TxBuilder } from "./txBuilder";
import { ethers } from "ethers";
import { RPC_ENDPOINTS } from "../config/rpc";
import { PORTFOLIO_CONFIG } from "../config/portfolio";
import { getState } from "../state";

type TradeIntent =
  | { type: "BUY_TOKEN"; chain: string; token: string; amount: string }
  | { type: "SELL_TOKEN"; chain: string; token: string; amount: string }
  | { type: "BUY_NFT"; chain: string; collection: string; tokenId: string; price: string }
  | { type: "SELL_NFT"; chain: string; collection: string; tokenId: string; price: string };

export class IntentExecutor {
  private txBuilder = new TxBuilder();

  private getProvider(chain: string) {
    const url = RPC_ENDPOINTS?.[chain]?.["mainnet"];
    if (!url) throw new Error(`RPC not found for ${chain}`);
    return new ethers.JsonRpcProvider(url);
  }

  async execute() {
    const snapshot = getState() as any;
    const intents: TradeIntent[] = snapshot?.TradeAgent?.intents || [];

    if (!intents.length) {
      console.log("No trade intents to execute.");
      return;
    }

    console.log(`Preparing ${intents.length} intents for MetaMask signing...`);

    for (const intent of intents) {
      switch (intent.type) {
        case "BUY_TOKEN":
          await this.prepareBuyToken(intent);
          break;
        case "SELL_TOKEN":
          await this.prepareSellToken(intent);
          break;
        case "BUY_NFT":
          await this.prepareBuyNFT(intent);
          break;
        case "SELL_NFT":
          await this.prepareSellNFT(intent);
          break;
      }
    }
  }

  // ---------------------------------------------------------
  // BUY TOKEN
  // ---------------------------------------------------------
  private async prepareBuyToken(intent: TradeIntent & { type: "BUY_TOKEN" }) {
    const provider = this.getProvider(intent.chain);
    const walletAddress = PORTFOLIO_CONFIG.hotWalletAddress;
    const balance = await provider.getBalance(walletAddress);
    const amountWei = BigInt(intent.amount);

    if (amountWei > balance) {
      console.log(`Skipping BUY_TOKEN: insufficient balance for ${intent.token}`);
      return;
    }

    // Build a real ETH/MATIC → TOKEN transfer (placeholder)
    const tx = {
      from: walletAddress,
      to: intent.token,
      value: amountWei,
      data: "0x"
    };

    // Push to persistent queue for UI execution
    pushIntent({
      type: "BUY_TOKEN",
      chain: intent.chain,
      token: intent.token,
      amount: intent.amount,
      tx
    });

    console.log("\n--- BUY TOKEN INTENT ---");
    console.log("Chain:", intent.chain);
    console.log("Token:", intent.token);
    console.log("Amount (wei):", amountWei.toString());
    console.log("Unsigned TX queued for MetaMask:", tx);
  }

  // ---------------------------------------------------------
  // SELL TOKEN
  // ---------------------------------------------------------
  private async prepareSellToken(intent: TradeIntent & { type: "SELL_TOKEN" }) {
    // Placeholder: ERC20 approve + router swap
    const tx = {
      from: PORTFOLIO_CONFIG.hotWalletAddress,
      to: intent.token,
      value: "0x0",
      data: "0x" // UI will replace with real calldata
    };

    pushIntent({
      type: "SELL_TOKEN",
      chain: intent.chain,
      token: intent.token,
      amount: intent.amount,
      tx
    });

    console.log("\n--- SELL TOKEN INTENT ---");
    console.log("Chain:", intent.chain);
    console.log("Token:", intent.token);
    console.log("Amount (wei):", intent.amount);
    console.log("Unsigned TX queued for MetaMask.");
  }

  // ---------------------------------------------------------
  // BUY NFT
  // ---------------------------------------------------------
  private async prepareBuyNFT(intent: TradeIntent & { type: "BUY_NFT" }) {
    const tx = {
      from: PORTFOLIO_CONFIG.hotWalletAddress,
      to: intent.collection,
      value: intent.price,
      data: "0x" // UI will replace with marketplace calldata
    };

    pushIntent({
      type: "BUY_NFT",
      chain: intent.chain,
      collection: intent.collection,
      tokenId: intent.tokenId,
      price: intent.price,
      tx
    });

    console.log("\n--- BUY NFT INTENT ---");
    console.log("Chain:", intent.chain);
    console.log("Collection:", intent.collection);
    console.log("Token ID:", intent.tokenId);
    console.log("Max Price (wei):", intent.price);
    console.log("Unsigned TX queued for MetaMask.");
  }

  // ---------------------------------------------------------
  // SELL NFT
  // ---------------------------------------------------------
  private async prepareSellNFT(intent: TradeIntent & { type: "SELL_NFT" }) {
    const tx = {
      from: PORTFOLIO_CONFIG.hotWalletAddress,
      to: intent.collection,
      value: "0x0",
      data: "0x" // UI will replace with listing calldata
    };

    pushIntent({
      type: "SELL_NFT",
      chain: intent.chain,
      collection: intent.collection,
      tokenId: intent.tokenId,
      price: intent.price,
      tx
    });

    console.log("\n--- SELL NFT INTENT ---");
    console.log("Chain:", intent.chain);
    console.log("Collection:", intent.collection);
    console.log("Token ID:", intent.tokenId);
    console.log("Price (wei):", intent.price);
    console.log("Unsigned TX queued for MetaMask.");
  }
}
