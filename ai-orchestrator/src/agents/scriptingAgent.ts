import { updateState } from "../state";
import { ServiceName } from "../config";

const NAME: ServiceName = "BlsrMiningScript";

export async function checkScripts() {
  // Here you’d inspect logs / process list / supervisor API.
  updateState(NAME, "healthy", "Mining scripts check placeholder");
}
