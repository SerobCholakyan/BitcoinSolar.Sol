import { ethers, network, run } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("--- Starting Deployment ---");
  console.log(`Network:  ${network.name}`);
  console.log(`Deployer: ${deployer.address}`);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Balance:  ${ethers.formatEther(balance)} ETH`);
  console.log("---------------------------");

  // 1. Define Contract Parameters
  const contractName = "BitcoinSolar"; // Change this to your actual contract name
  const args: any[] = [
    // Add your constructor arguments here
    // e.g., "Initial Token Name", "BSOLR", 1000000
  ];

  // 2. Deployment Logic
  console.log(`Deploying ${contractName}...`);
  
  // In Ethers v6 + Hardhat, we use deployContract for a cleaner syntax
  const contract = await ethers.deployContract(contractName, args);

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log(`✅ ${contractName} deployed to: ${contractAddress}`);

  // 3. Automatic Verification (Only on public networks)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Waiting for block confirmations (6 blocks)...");
    
    // Wait for 6 confirmations to ensure Etherscan has indexed the bytecode
    await contract.deploymentTransaction()?.wait(6);
    
    await verify(contractAddress, args);
  }

  console.log("--- Deployment Complete ---");
}

/**
 * Programmatic verification function for Etherscan/Polygonscan/etc.
 */
async function verify(contractAddress: string, args: any[]) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
    console.log("✅ Contract Verified!");
  } catch (e: any) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!");
    } else {
      console.log("Verification Error:", e);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
