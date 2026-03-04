import { updateState } from "../state";
import { ServiceName } from "../config";

const NAME: ServiceName = "BlsrMetaMask";

export async function checkMetaMask() {
  // Here you’d check Snap version, manifest, or a simple RPC test.
  updateState(NAME, "healthy", "MetaMask Snap check placeholder");
}
