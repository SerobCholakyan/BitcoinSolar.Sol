import type { NextApiRequest, NextApiResponse } from "next";
import { listIntents } from "../../../ai-orchestrator/src/state/intents";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const intents = listIntents();
    res.status(200).json(intents);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to load intents" });
  }
}
