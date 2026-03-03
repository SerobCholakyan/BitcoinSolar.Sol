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

  private async prepareBuyToken(intent: TradeIntent & { type: "BUY_TOKEN" }) {
    const provider = this.getProvider(intent.chain);
    const walletAddress = PORTFOLIO_CONFIG.hotWalletAddress;
    const balance = await provider.getBalance(walletAddress);
    const amountWei = BigInt(intent.amount);

    if (amountWei > balance) {
      console.log(`Skipping BUY_TOKEN: insufficient balance for ${intent.token}`);
      return;
    }

    const tx = {
      from: walletAddress,
      to: intent.token,
      value: amountWei,
      data: "0x"
    };

    console.log("\n--- BUY TOKEN INTENT ---");
    console.log("Chain:", intent.chain);
    console.log("Token:", intent.token);
    console.log("Amount (wei):", amountWei.toString());
    console.log("Unsigned TX:", tx);
    console.log("Use this payload in your dapp / MetaMask to sign.\n");
  }

  private async prepareSellToken(intent: TradeIntent & { type: "SELL_TOKEN" }) {
    console.log("\n--- SELL TOKEN INTENT ---");
    console.log("Chain:", intent.chain);
    console.log("Token:", intent.token);
    console.log("Amount (wei):", intent.amount);
    console.log("NOTE: Implement ERC20 approve + swap router call in your dapp.");
    console.log("Unsigned TX placeholder prepared for MetaMask.\n");
  }

  private async prepareBuyNFT(intent: TradeIntent & { type: "BUY_NFT" }) {
    console.log("\n--- BUY NFT INTENT ---");
    console.log("Chain:", intent.chain);
    console.log("Collection:", intent.collection);
    console.log("Token ID:", intent.tokenId);
    console.log("Max Price (wei):", intent.price);
    console.log("NOTE: Implement marketplace (Seaport/Blur/etc.) call in your dapp.");
    console.log("Unsigned TX placeholder prepared for MetaMask.\n");
  }

  private async prepareSellNFT(intent: TradeIntent & { type: "SELL_NFT" }) {
    console.log("\n--- SELL NFT INTENT ---");
    console.log("Chain:", intent.chain);
    console.log("Collection:", intent.collection);
    console.log("Token ID:", intent.tokenId);
    console.log("Price (wei):", intent.price);
    console.log("NOTE: Implement marketplace listing call in your dapp.");
    console.log("Unsigned TX placeholder prepared for MetaMask.\n");
  }
}
