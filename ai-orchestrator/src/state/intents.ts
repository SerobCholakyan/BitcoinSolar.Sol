// ai-orchestrator/src/state/intents.ts

import fs from "fs";
import path from "path";

export type QueuedIntent = {
  id: string;
  type: string;
  chain: string;
  tx: any;
  meta?: any;
  timestamp: number;
};

const INTENT_FILE = path.join(__dirname, "intentQueue.json");

// -------------------------------
// Load queue from disk
// -------------------------------
function loadQueue(): QueuedIntent[] {
  try {
    if (!fs.existsSync(INTENT_FILE)) return [];
    const raw = fs.readFileSync(INTENT_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// -------------------------------
// Save queue to disk
// -------------------------------
function saveQueue(queue: QueuedIntent[]) {
  fs.writeFileSync(INTENT_FILE, JSON.stringify(queue, null, 2));
}

// -------------------------------
// Push new intent
// -------------------------------
export function pushIntent(intent: {
  type: string;
  chain: string;
  tx: any;
  meta?: any;
}) {
  const queue = loadQueue();

  const entry: QueuedIntent = {
    id: crypto.randomUUID(),
    type: intent.type,
    chain: intent.chain,
    tx: intent.tx,
    meta: intent.meta || {},
    timestamp: Date.now()
  };

  queue.push(entry);
  saveQueue(queue);

  console.log(`Queued intent: ${entry.id} (${entry.type})`);
}

// -------------------------------
// Pop (consume) next intent
// -------------------------------
export function popIntent(): QueuedIntent | null {
  const queue = loadQueue();
  if (queue.length === 0) return null;

  const next = queue.shift()!;
  saveQueue(queue);
  return next;
}

// -------------------------------
// List all intents
// -------------------------------
export function listIntents(): QueuedIntent[] {
  return loadQueue();
}

// -------------------------------
// Clear queue
// -------------------------------
export function clearIntents() {
  saveQueue([]);
}
