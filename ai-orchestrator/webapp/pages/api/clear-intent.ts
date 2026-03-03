import type { NextApiRequest, NextApiResponse } from "next";
import { clearIntents } from "../../../ai-orchestrator/src/state/intents";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
