import { checkWebApp } from "./agents/webAppAgent";
import { checkMining } from "./agents/miningAgent";
import { checkMinting } from "./agents/mintingAgent";
import { checkScripts } from "./agents/scriptAgent";
import { checkMetaMask } from "./agents/metamaskAgent";
import { getState } from "./state";

async function tick() {
  await Promise.all([
    checkWebApp(),
    checkMining(),
    checkMinting(),
    checkScripts(),
    checkMetaMask()
  ]);

  const snapshot = getState();
  // This is where your “AI” logic would live:
  // - detect degraded/down
  // - trigger redeploys
  // - call GitHub App / Render / DO hooks
  // - send alerts
  console.log("AI snapshot:", JSON.stringify(snapshot, null, 2));
}

async function main() {
  console.log("BitcoinSolar AI Orchestrator starting...");
  // run every 30 seconds
  await tick();
  setInterval(tick, 30_000);
}

main().catch((e) => {
  console.error("Fatal error in AI orchestrator:", e);
  process.exit(1);
});
