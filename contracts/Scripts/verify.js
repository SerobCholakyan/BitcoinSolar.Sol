const hre = require("hardhat");

async function main() {
  const address = process.env.CONTRACT_ADDRESS;

  if (!address) {
    console.error("Missing CONTRACT_ADDRESS");
    process.exit(1);
  }

  await hre.run("verify:verify", {
    address,
    constructorArguments: [],
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
