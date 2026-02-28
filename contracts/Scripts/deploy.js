const hre = require("hardhat");

async function main() {
  const Token = await hre.ethers.getContractFactory("BitcoinSolar");
  const token = await Token.deploy();
  await token.waitForDeployment();
  console.log("BitcoinSolar deployed:", token.target);
}

main();
