import { HealthStatus, OrchestratorState, Intent } from "./types";

let state: OrchestratorState = {
  health: "idle",
  intentQueue: []
};

export function initState() {
  state.health = "running";
  state.intentQueue = [];
}

export function setHealth(status: HealthStatus) {
  state.health = status;
}

export function getState(): OrchestratorState {
  return state;
}

export function enqueueIntent(intent: Intent) {
  state.intentQueue.push(intent);
}
