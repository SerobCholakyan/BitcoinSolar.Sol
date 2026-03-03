import { useState } from "react";
import { useIntents } from "../hooks/useIntents";
import { IntentCard } from "../components/IntentCard";

export default function TradeExecutor() {
  const { intents, error } = useIntents();
  const [loading, setLoading] = useState(false);

  async function executeIntent(intent: any) {
    try {
      setLoading(true);

      if (!window.ethereum) {
        alert("MetaMask not detected");
        return;
      }

      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [intent.tx]
      });

      alert(`Intent ${intent.id} submitted to MetaMask`);
    } catch (err: any) {
      alert(err?.message || "Failed to execute transaction");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Trade Executor</h1>

      {error && <div style={{ color: "red" }}>{error}</div>}
      {loading && <div>Executing transaction…</div>}

      {intents.length === 0 && <div>No pending intents.</div>}

      {intents.map((intent: any) => (
        <IntentCard key={intent.id} intent={intent} onExecute={executeIntent} />
      ))}
    </div>
  );
}
