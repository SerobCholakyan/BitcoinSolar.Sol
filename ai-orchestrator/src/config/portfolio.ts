export const PORTFOLIO_CONFIG = {
  hotWalletAddress: "0x...",          // your MetaMask account (public)
  maxPerTradePct: 0.01,               // 1% of hot wallet per trade
  maxPerAssetPct: 0.05,               // 5% cap per asset
  dailyMaxLossPct: 0.05,              // stop if down 5% in a day
  allowedChains: ["ethereum", "polygon"],
  allowedTokens: [
    // ERC-20 addresses
  ],
  allowedCollections: [
    // NFT contract addresses
  ]
};
