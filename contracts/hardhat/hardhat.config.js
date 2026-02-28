@@ -1,16 +1,18 @@
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.8.21",
  networks: {
    mainnet: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
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
    apiKey: process.env.ETHERSCAN_API_KEY,
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
};
