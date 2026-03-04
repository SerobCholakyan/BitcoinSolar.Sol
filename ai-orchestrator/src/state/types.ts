export type ServiceName =
  | "webapp"
  | "orchestrator"
  | "miner"
  | "BitcoinSolarScripts"
  | "TradeAgent";

export type HealthStatus =
  | "idle"
  | "running"
  | "paused"
  | "planning"
  | "error";

export type Intent = {
  type: string;
  chain: string;
  tx: any;
  meta?: any;
  token?: string;
  collection?: string;
};

export type OrchestratorState = {
  health: HealthStatus;
  intentQueue: Intent[];
};
