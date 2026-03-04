export type RpcMap = {
  [chain: string]: {
    [network: string]: string;
  };
};

export const rpcMap: RpcMap = {
  ethereum: {
    mainnet: process.env.ETH_MAINNET_RPC || "",
    sepolia: process.env.ETH_SEPOLIA_RPC || "",
    hoodi: process.env.ETH_HOODI_RPC || ""
  },
  // ...other chains
};
