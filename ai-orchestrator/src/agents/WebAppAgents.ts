import axios from "axios";
import { updateState } from "../state";
import { ServiceName } from "../config";

const NAME: ServiceName = "BitcoinSolarWebApp";

export async function checkWebApp() {
  try {
    const res = await axios.get("https://app.bitcoinsolar.org/health", {
      timeout: 5000
    });
    if (res.status === 200) {
      updateState(NAME, "healthy", "WebApp responded 200");
    } else {
      updateState(NAME, "degraded", `Unexpected status ${res.status}`);
    }
  } catch (e: any) {
    updateState(NAME, "down", `Error: ${e?.message || "unknown"}`);
  }
}
