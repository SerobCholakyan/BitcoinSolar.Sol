"use server";

import { getState } from "../../ai-orchestrator/src/state";
import { getServiceState } from "../../ai-orchestrator/src/state/state";
import { listIntents } from "../../ai-orchestrator/src/state/intents";
import { getHistory } from "../../ai-orchestrator/src/state/history";
import { getPnl } from "../../ai-orchestrator/src/state/pnl";

export async function getDashboardSnapshot() {
  const orchestrator = getState();
  const services = getServiceState();
  const pending = listIntents();
  const recentExecutions = getHistory().slice(-10);

  return {
    orchestrator: {
      health: orchestrator.health,
      lastTick: Date.now()
    },
    services,
    intents: {
      queueLength: pending.length,
      pending: pending.map((i) => ({
        id: i.id,
        type: i.type,
        chain: i.chain,
        timestamp: i.timestamp
      })),
      recentExecutions
    },
    metrics: {
      dailyPnl: getPnl()
    }
  };
}
