let history: any[] = [];

export function recordExecution(intent: any, txHash: string) {
  history.push({
    id: intent.id,
    type: intent.type,
    chain: intent.chain,
    txHash,
    timestamp: Date.now()
  });
}

export function getHistory() {
  return history;
}
