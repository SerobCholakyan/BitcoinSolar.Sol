// ai-orchestrator/src/config/portfolio.ts

export type AllowedToken = {
  chain: string;          // e.g. "ethereum", "polygon"
  address: string;        // ERC-20 contract address
  symbol: string;         // e.g. "ETH", "MATIC"
};

export type AllowedCollection = {
  chain: string;          // e.g. "ethereum"
  address: string;        // ERC-721/1155 contract address
  name: string;           // human-readable name
};

export const PORTFOLIO_CONFIG = {
  // Public address only – do NOT put private keys here.
  hotWalletAddress: "0xYOUR_METAMASK_ADDRESS_HERE",

  // Risk limits
  // Use only a small hot wallet, never more than 3% of it per trade.
  maxPerTradePct: 0.03,      // 3% of current hot wallet balance per trade
  maxPerAssetPct: 0.10,      // optional: 10% cap per single asset

  // Stop for the day if made more than 30% of initial investment (daily PnL).
  dailyMaxGainPct: 0.30,     // +30% daily gain → stop planning new trades

  // Scope of operation
  allowedChains: ["ethereum", "polygon"] as const,

  // Whitelisted fungible tokens (you must fill these in yourself)
  allowedTokens: [] as AllowedToken[],

  // Whitelisted NFT collections (you must fill these in yourself)
  allowedCollections: [] as AllowedCollection[],
};
