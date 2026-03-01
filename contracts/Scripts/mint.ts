const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const abi = require("../artifacts/contracts/BitcoinSolar.sol/BitcoinSolar.json").abi;
  const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

  const tx = await contract.mint(wallet.address, 1);
  console.log("Mint tx:", tx.hash);

  await tx.wait();
  console.log("Minted!");
}

main();
