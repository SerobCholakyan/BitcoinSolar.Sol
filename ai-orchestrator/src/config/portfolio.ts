// ai-orchestrator/src/config/portfolio.ts

export type AllowedToken = {
  chain: string;      // "ethereum", "polygon", etc.
  address: string;    // ERC-20 contract address
  symbol: string;     // e.g. "ETH", "MATIC"
};

export type AllowedCollection = {
  chain: string;      // "ethereum", "polygon"
  address: string;    // NFT contract address
  name: string;       // human-readable name
};

export const PORTFOLIO_CONFIG = {
  // PUBLIC wallet address only — never put private keys here.
  hotWalletAddress: "0xe454ebF611e2231477767F4B5303BEEbCe1F7194",

  // RISK RULES (your exact instructions)
  maxPerTradePct: 0.03,     // Never more than 3% of hot wallet per trade
  maxPerAssetPct: 0.10,     // Optional: cap any single asset at 10%
  dailyMaxGainPct: 0.30,    // Stop for the day if gain > 30%

  // CHAINS your orchestrator is allowed to trade on
  allowedChains: ["ethereum", "polygon"] as const,

  // TOKENS your orchestrator is allowed to buy/sell
  // (blue-chip, liquid, safe to simulate with)
  allowedTokens: [
    {
      chain: "ethereum",
      address: "0xC02aaa39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
      symbol: "WETH"
    },
    {
      chain: "ethereum",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
      symbol: "USDC"
    },
    {
      chain: "polygon",
      address: "0x0000000000000000000000000000000000001010", // MATIC (native wrapper)
      symbol: "MATIC"
    },
    {
      chain: "polygon",
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC on Polygon
      symbol: "USDC"
    }
  ] as AllowedToken[],

  // NFT COLLECTIONS your orchestrator is allowed to buy/sell
  // (safe defaults — you can add/remove anytime)
  allowedCollections: [
    {
      chain: "ethereum",
      address: "0xBC4CA0eda7647A8aB7C2061c2E118A18a936f13D", // BAYC
      name: "BoredApeYachtClub"
    },
    {
      chain: "ethereum",
      address: "0x60E4d786628Fea6478F785A6d7e704777c86a7c6", // MAYC
      name: "MutantApeYachtClub"
    }
  ] as AllowedCollection[]
};
