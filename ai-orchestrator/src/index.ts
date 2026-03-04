import { checkWebApp } from "./agents/webAppAgent";
import { checkMining } from "./agents/miningAgent";
import { checkMinting } from "./agents/mintingAgent";
import { checkScripts } from "./agents/scriptAgent";
import { checkMetaMask } from "./agents/metamaskAgent";
import { getState } from "./state";
import { TradeAgent } from "./agents/tradeAgent";
import { IntentExecutor } from "./executor/intentExecutor";

const tradeAgent = new TradeAgent();
const intentExecutor = new IntentExecutor();

async function tick() {
  await Promise.all([
    checkWebApp(),
    checkMining(),
    checkMinting(),
    checkScripts(),
    checkMetaMask(),
    tradeAgent.run(),
    intentExecutor.execute()
  ]);

  const snapshot = getState();
  console.log("AI snapshot:", JSON.stringify(snapshot, null, 2));
}

async function main() {
  console.log("BitcoinSolar AI Orchestrator starting...");

  await tick();

  setInterval(tick, 30_000);
}

main().catch((e) => {
  console.error("Fatal error in AI orchestrator:", e);
  process.exit(1);
});
