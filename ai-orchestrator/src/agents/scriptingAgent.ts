import { RPC_ENDPOINTS } from "../config/rpc";
import { updateState } from "../state";
import { ServiceName } from "../config";
import { exec } from "child_process";
import { ethers } from "ethers";

// Centralized provider resolver
function getProvider(chain: string, network: string) {
  const url = RPC_ENDPOINTS?.[chain]?.[network];
  if (!url) throw new Error(`RPC not found for ${chain}:${network}`);
  return new ethers.JsonRpcProvider(url);
}

const NAME: ServiceName = "BitcoinSolarScripts";

export class ScriptAgent {
  private scriptPath: string;

  constructor() {
    // You can change this to any script you want the orchestrator to run
    this.scriptPath = "./scripts/heartbeat.sh";
  }

  async run() {
    try {
      exec(this.scriptPath, (err, stdout, stderr) => {
        if (err) {
          updateState(NAME, "down", `Script error: ${err.message}`);
          return;
        }

        if (stderr) {
          updateState(NAME, "degraded", `Script stderr: ${stderr}`);
          return;
        }

        updateState(NAME, "healthy", `Script OK: ${stdout.trim()}`);
      });
    } catch (e: any) {
      updateState(NAME, "down", `Exception: ${e?.message || "unknown"}`);
    }
  }
}
