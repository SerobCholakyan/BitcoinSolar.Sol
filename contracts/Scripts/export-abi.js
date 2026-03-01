const fs = require("fs");
const path = require("path");

const artifactPath = path.join(
  __dirname,
  "..",
  "artifacts",
  "contracts",
  "BlsrRewards.sol",
  "BlsrRewards.json"
);

if (!fs.existsSync(artifactPath)) {
  console.error("Artifact not found:", artifactPath);
  process.exit(1);
}

const artifact = require(artifactPath);
const outPath = path.join(__dirname, "..", "..", "blsr-abi.json");

fs.writeFileSync(outPath, JSON.stringify(artifact.abi, null, 2));
console.log("ABI exported to", outPath);
