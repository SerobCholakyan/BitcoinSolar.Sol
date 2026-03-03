// ai-orchestrator/src/state/intents.ts

import fs from "fs";
import path from "path";

const INTENT_FILE = path.join(__dirname, "intentQueue.json");

type Intent = any;

function loadQueue(): Intent[] {
  try {
    if (!fs.existsSync(INTENT_FILE)) return [];
    const raw = fs.readFileSync(INTENT_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveQueue(queue: Intent[]) {
  fs.writeFileSync(INTENT_FILE, JSON.stringify(queue, null, 2));
}

export function pushIntent(intent: Intent) {
  const queue = loadQueue();
  queue.push({
    ...intent,
    timestamp: Date.now()
  });
  saveQueue(queue);
}

export function popIntent(): Intent | null {
  const queue = loadQueue();
  if (queue.length === 0) return null;
  const intent = queue.shift();
  saveQueue(queue);
  return intent;
}

export function listIntents(): Intent[] {
  return loadQueue();
}

export function clearIntents() {
  saveQueue([]);
}
