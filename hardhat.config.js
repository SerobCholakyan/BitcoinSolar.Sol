require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.21",
  networks: {
    ...(process.env.RPC_URL && process.env.PRIVATE_KEY
      ? {
          mainnet: {
            url: process.env.RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
          },
        }
      : {}),
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
};
