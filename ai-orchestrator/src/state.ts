import { ServiceName } from "./config";

export type HealthStatus = "unknown" | "healthy" | "degraded" | "down";

export interface ServiceState {
  name: ServiceName;
  status: HealthStatus;
  lastCheck: number | null;
  notes: string[];
}

const state: Record<ServiceName, ServiceState> = {
  BitcoinSolarOrg: { name: "BitcoinSolarOrg", status: "unknown", lastCheck: null, notes: [] },
  BitcoinSolarWebApp: { name: "BitcoinSolarWebApp", status: "unknown", lastCheck: null, notes: [] },
  BlsrMining: { name: "BlsrMining", status: "unknown", lastCheck: null, notes: [] },
  BlsrMinting: { name: "BlsrMinting", status: "unknown", lastCheck: null, notes: [] },
  BlsrMiningScript: { name: "BlsrMiningScript", status: "unknown", lastCheck: null, notes: [] },
  BlsrMetaMask: { name: "BlsrMetaMask", status: "unknown", lastCheck: null, notes: [] }
};

export function updateState(
  name: ServiceName,
  status: HealthStatus,
  note?: string
) {
  const s = state[name];
  s.status = status;
  s.lastCheck = Date.now();
  if (note) s.notes.push(note);
}

export function getState() {
  return state;
}
