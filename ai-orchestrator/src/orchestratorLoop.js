import { checkWebApp } from "./agents/webAppAgent";
import { checkMining } from "./agents/miningAgent";
import { checkMinting } from "./agents/mintingAgent";
import { checkScripts } from "./agents/scriptingAgent";
import { checkMetaMask } from "./agents/metamaskAgent";
import { TradeAgent } from "./agents/tradeAgent";
import { IntentExecutor } from "./executor/intentExecutor";
import { getState } from "./state";

const tradeAgent = new TradeAgent();
const intentExecutor = new IntentExecutor();

export async function orchestratorTick() {
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
