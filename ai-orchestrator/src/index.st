import { initState, setHealth, getState } from "./state/index";
import scriptingAgent from "./agents/scriptingAgent";
import tradeAgent from "./agents/tradeAgent";
import miningAgent from "./agents/miningAgent";
import mintingAgent from "./agents/mintingAgent";
import metamaskAgent from "./agents/metamaskAgent";
import webAppAgent from "./agents/webAppAgent";
import intentExecutor from "./executor/intentExecutor";

async function startOrchestrator() {
  console.log("🚀 AI Orchestrator starting…");

  // Initialize global orchestrator state
  initState();
  setHealth("running");

  // Start all agents
  console.log("🔧 Initializing agents…");

  const agents = [
    scriptingAgent,
    tradeAgent,
    miningAgent,
    mintingAgent,
    metamaskAgent,
    webAppAgent
  ];

  for (const agent of agents) {
    try {
      await agent.start();
      console.log(`✅ Agent started: ${agent.name}`);
    } catch (err) {
      console.error(`❌ Agent failed: ${agent.name}`, err);
      setHealth("error");
    }
  }

  console.log("⚡ All agents initialized.");
  console.log("🧠 Orchestrator entering main loop…");

  // Main orchestrator loop
  while (true) {
    try {
      const state = getState();

      // Execute pending intents
      if (state.intentQueue.length > 0) {
        const nextIntent = state.intentQueue.shift();
        if (nextIntent) {
          await intentExecutor.execute(nextIntent);
        }
      }

      // Health heartbeat
      console.log("💓 Health:", state.health);

      // Loop delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (err) {
      console.error("❌ Orchestrator loop error:", err);
      setHealth("error");
    }
  }
}

// Start orchestrator
startOrchestrator().catch((err) => {
  console.error("Fatal orchestrator error:", err);
  process.exit(1);
});
