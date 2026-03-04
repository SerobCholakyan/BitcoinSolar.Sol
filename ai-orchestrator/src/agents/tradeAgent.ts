// ai-orchestrator/src/agents/tradeAgent.ts

import { ethers } from "ethers";
import { RPC_ENDPOINTS } from "../config/rpc";
import { PORTFOLIO_CONFIG } from "../config/portfolio";
import { updateState } from "../state";
import { ServiceName } from "../config";

const NAME: ServiceName = "TradeAgent";

type TradeIntent =
  | { type: "BUY_TOKEN"; chain: string; token: string; amount: string }
  | { type: "SELL_TOKEN"; chain: string; token: string; amount: string }
  | { type: "BUY_NFT"; chain: string; collection: string; tokenId: string; price: string }
  | { type: "SELL_NFT"; chain: string; collection: string; tokenId: string; price: string };

function getProvider(chain: string, network: string) {
  const url = RPC_ENDPOINTS?.[chain]?.[network];
  if (!url) throw new Error(`RPC not found for ${chain}:${network}`);
  return new ethers.JsonRpcProvider(url);
}

export class TradeAgent {
  // In a real system you’d persist this in state or a DB and update it from real PnL.
  private dailyPnlPct = 0;

  async run() {
    try {
      // 1. Respect daily gain stop rule: stop if made more than configured daily gain
      if (this.dailyPnlPct >= PORTFOLIO_CONFIG.dailyMaxGainPct) {
        updateState(
          NAME,
          "paused",
          `Daily gain limit (${PORTFOLIO_CONFIG.dailyMaxGainPct * 100}%) reached, no more trade planning today`
        );
        return;
      }

      // 2. Generate trade intents based on your config + 3% rule
      const intents = await this.generateTradeIntents();

      // 3. Record intents instead of executing them
      updateState(
        NAME,
        "planning",
        `Planned ${intents.length} trade intents (simulation/planning only, no auto-execution)`
      );

      // IMPORTANT:
      // Your separate execution layer (CLI/script/service that YOU run) should:
      // - Read these intents from state/logs
      // - Apply your chart/research-based decision logic
      // - Decide which intents to execute
      // - Build & sign transactions using your own wallet infra
      // This file does NOT send transactions or touch private keys.

    } catch (e: any) {
      updateState(NAME, "down", `TradeAgent error: ${e?.message || "unknown"}`);
    }
  }

  private async generateTradeIntents(): Promise<TradeIntent[]> {
    const intents: TradeIntent[] = [];

    // If nothing is whitelisted, nothing to plan.
    if (
      PORTFOLIO_CONFIG.allowedTokens.length === 0 &&
      PORTFOLIO_CONFIG.allowedCollections.length === 0
    ) {
      return intents;
    }

    // We enforce your "never more than 3% of hot wallet per trade" rule
    // by computing a max trade value per chain and using that as the
    // notional amount/price in wei.
    const maxPct = PORTFOLIO_CONFIG.maxPerTradePct; // e.g. 0.03 for 3%
    const scale = 10_000; // for fixed-point math

    // ---- Tokens: create BUY intents with 3% of wallet per chain ----
    for (const token of PORTFOLIO_CONFIG.allowedTokens) {
      if (!PORTFOLIO_CONFIG.allowedChains.includes(token.chain as any)) continue;

      const provider = this.getChainProvider(token.chain);
      const balance = await provider.getBalance(PORTFOLIO_CONFIG.hotWalletAddress);

      if (balance === 0n) continue;

      const scaledPct = Math.floor(maxPct * scale); // e.g. 0.03 * 10000 = 300
      const maxTradeValue = (balance * BigInt(scaledPct)) / BigInt(scale);

      if (maxTradeValue <= 0n) continue;

      // BUY intent: up to 3% of current hot wallet balance on that chain
      intents.push({
        type: "BUY_TOKEN",
        chain: token.chain,
        token: token.address,
        amount: maxTradeValue.toString(), // wei
      });

      // You can later add SELL_TOKEN intents here based on your own signals.
    }

    // ---- NFTs: create BUY intents with 3% of wallet as max budget ----
    for (const collection of PORTFOLIO_CONFIG.allowedCollections) {
      if (!PORTFOLIO_CONFIG.allowedChains.includes(collection.chain as any)) continue;

      const provider = this.getChainProvider(collection.chain);
      const balance = await provider.getBalance(PORTFOLIO_CONFIG.hotWalletAddress);

      if (balance === 0n) continue;

      const scaledPct = Math.floor(maxPct * scale);
      const maxBudget = (balance * BigInt(scaledPct)) / BigInt(scale);

      if (maxBudget <= 0n) continue;

      // BUY_NFT intent: you still need your own logic to pick tokenId and actual price.
      intents.push({
        type: "BUY_NFT",
        chain: collection.chain,
        collection: collection.address,
        tokenId: "0", // placeholder – your research logic should decide which IDs
        price: maxBudget.toString(), // max budget in wei
      });

      // Similarly, you can add SELL_NFT intents when your logic says so.
    }

    return intents;
  }

  private getChainProvider(chain: string) {
    const network = "mainnet"; // adjust if you want testnets
    return getProvider(chain, network);
  }
}
