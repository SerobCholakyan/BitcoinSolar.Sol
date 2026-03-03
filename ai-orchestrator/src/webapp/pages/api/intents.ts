import type { NextApiRequest, NextApiResponse } from "next";
import { listIntents } from "../../../ai-orchestrator/src/state/intents";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const intents = listIntents();
  res.status(200).json(intents);
}
