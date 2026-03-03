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
  // In a real system you’d persist this in state or a DB.
  private dailyPnlPct = 0;

  async run() {
    try {
      // 1. Respect daily gain stop rule
      if (this.dailyPnlPct >= PORTFOLIO_CONFIG.dailyMaxGainPct) {
        updateState(NAME, "paused", "Daily gain limit reached, no more trade planning today");
        return;
      }

      // 2. Fetch on-chain data / prices (placeholder)
      //    You’d use providers, DEX APIs, NFT APIs, etc.
      const intents = await this.generateTradeIntents();

      // 3. Record intents instead of executing them
      updateState(
        NAME,
        "planning",
        `Planned ${intents.length} trade intents (simulation/planning only, no auto-execution)`
      );

      // IMPORTANT:
      // A separate, explicit tool/script (that YOU run) would:
      // - Read these intents from state/logs
      // - Decide whether to execute
      // - Build & sign transactions using your own wallet infra
      // This file does NOT send transactions or touch private keys.

    } catch (e: any) {
      updateState(NAME, "down", `TradeAgent error: ${e?.message || "unknown"}`);
    }
  }

  private async generateTradeIntents(): Promise<TradeIntent[]> {
    const intents: TradeIntent[] = [];

    // ------------------------------------------------------------------
    // This is where your “chart scanning / research” logic would live.
    // ------------------------------------------------------------------
    // Examples of what YOU might implement here (not provided by me):
    // - Read historical prices from an API and compute trends/volatility.
    // - Filter tokens/NFTs by volume, liquidity, or other metrics.
    // - Decide which assets look attractive to buy/sell.
    //
    // Whatever you implement MUST:
    // - Only consider assets in PORTFOLIO_CONFIG.allowedTokens / allowedCollections.
    // - Size each trade so it never exceeds PORTFOLIO_CONFIG.maxPerTradePct
    //   of your hot wallet balance.
    // - Respect PORTFOLIO_CONFIG.maxPerAssetPct caps.
    //
    // This function should return BUY/SELL intents only.
    // No signing, no broadcasting, no direct wallet interaction here.

    return intents;
  }

  // Example helper to get a provider for a given chain
  private getChainProvider(chain: string) {
    // You can map chain → network here (e.g. mainnet only)
    const network = "mainnet";
    return getProvider(chain, network);
  }
}
