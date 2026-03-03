import { RPC_ENDPOINTS } from "../config/rpc";
import { updateState } from "../state";
import { ServiceName } from "../config";
// plus ethers, APIs, etc.

const NAME: ServiceName = "TradeAgent";

export class TradeAgent {
  async run() {
    // 1. Load portfolio + risk config
    // 2. Fetch prices / on-chain data
    // 3. Decide: buy / sell / hold / do nothing
    // 4. Write planned actions into state/logs
  }
}
