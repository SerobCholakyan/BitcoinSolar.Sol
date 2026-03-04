import { Intent } from "../state/types";
import { rpcMap } from "../config/rpcConfig";

async function execute(intent: Intent) {
  const { chain, tx } = intent;
  const network = tx.network || "mainnet";
  const rpcUrl = rpcMap[chain]?.[network];

  if (!rpcUrl) {
    throw new Error(`No RPC URL for ${chain}:${network}`);
  }

  // TODO: plug in actual provider + execution logic
  console.log("Executing intent", { intent, rpcUrl });
}

export default { execute };
