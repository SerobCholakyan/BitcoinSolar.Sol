// ai-orchestrator/src/index.ts

import { orchestratorTick } from "./orchestratorTick";
import { updateState } from "./state/state";
import { setHealth } from "./state";

// ---------------------------------------------
// Agent-specific intervals (ms)
// ---------------------------------------------
const INTERVALS = {
  fast: 10_000,       // scripting, webapp, metamask
  medium: 20_000,     // mining, minting
  slow: 60_000,       // trade agent
  executor: 5_000     // intent executor
};

// ---------------------------------------------
// Tick wrappers
// ---------------------------------------------
async function fastTick() {
  try {
    await orchestratorTick("fast");
  } catch (err: any) {
    updateState("orchestrator", "error", err?.message);
  }
}

async function mediumTick() {
  try {
    await orchestratorTick("medium");
  } catch (err: any) {
    updateState("orchestrator", "error", err?.message);
  }
}

async function slowTick() {
  try {
    await orchestratorTick("slow");
  } catch (err: any) {
    updateState("orchestrator", "error", err?.message);
  }
}

async function executorTick() {
  try {
    await orchestratorTick("executor");
  } catch (err: any) {
    updateState("orchestrator", "error", err?.message);
  }
}

// ---------------------------------------------
// Start orchestrator
// ---------------------------------------------
function start() {
  console.log("🚀 AI Orchestrator (mixed-interval) starting…");

  setHealth("running");

  setInterval(fastTick, INTERVALS.fast);
  setInterval(mediumTick, INTERVALS.medium);
  setInterval(slowTick, INTERVALS.slow);
  setInterval(executorTick, INTERVALS.executor);

  console.log("⚡ Mixed-interval scheduler active.");
}

start();
