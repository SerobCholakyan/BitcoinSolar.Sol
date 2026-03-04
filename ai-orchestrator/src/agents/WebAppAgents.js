import axios from "axios";
import { updateState } from "../state";
import { ServiceName } from "../config";

const NAME: ServiceName = "BitcoinSolarWebApp";

export class WebAppAgent {
  private healthUrl: string;

  constructor() {
    this.healthUrl = "https://app.bitcoinsolar.org/health";
  }

  async run() {
    try {
      const res = await axios.get(this.healthUrl, { timeout: 5000 });

      if (res.status === 200) {
        updateState(NAME, "healthy", "WebApp responded 200");
      } else {
        updateState(NAME, "degraded", `Unexpected status ${res.status}`);
      }
    } catch (e: any) {
      updateState(NAME, "down", `Error: ${e?.message || "unknown"}`);
    }
  }
}
