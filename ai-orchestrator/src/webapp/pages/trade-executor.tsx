import { useEffect, useState } from "react";

type Intent = {
  id: string;
  type: string;
  chain: string;
  tx: any;
  meta?: any;
  timestamp: number;
};

export default function TradeExecutor() {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadIntents() {
    try {
      const res = await fetch("/api/intents");
      const data = await res.json();
      setIntents(data);
    } catch (err: any) {
      setError("Failed to load intents");
    }
  }

  async function executeIntent(intent: Intent) {
    try {
      setLoading(true);
      setError(null);

      if (!window.ethereum) {
        setError("MetaMask not detected");
        return;
      }

      const tx = intent.tx;

      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [tx]
      });

      alert(`Intent ${intent.id} submitted to MetaMask`);
    } catch (err: any) {
      setError(err?.message || "Failed to execute transaction");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIntents();
    const interval = setInterval(loadIntents, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Trade Executor</h1>

      {error && (
        <div style={{ color: "red", marginBottom: 20 }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ marginBottom: 20 }}>
          Executing transaction...
        </div>
      )}

      {intents.length === 0 && (
        <div>No pending intents.</div>
      )}

      {intents.map((intent) => (
        <div
          key={intent.id}
          style={{
            marginBottom: 20,
            padding: 20,
            border: "1px solid #444",
            borderRadius: 8,
            background: "#111",
            color: "#eee"
          }}
        >
          <h3>{intent.type}</h3>
          <p><strong>Chain:</strong> {intent.chain}</p>
          <p><strong>ID:</strong> {intent.id}</p>
          <p><strong>Timestamp:</strong> {new Date(intent.timestamp).toLocaleString()}</p>

          <pre
            style={{
              background: "#222",
              padding: 10,
              borderRadius: 6,
              overflowX: "auto"
            }}
          >
            {JSON.stringify(intent.tx, null, 2)}
          </pre>

          <button
            onClick={() => executeIntent(intent)}
            style={{
              marginTop: 10,
              padding: "10px 20px",
              background: "#0af",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              color: "#000",
              fontWeight: "bold"
            }}
          >
            Execute in MetaMask
          </button>
        </div>
      ))}
    </div>
  );
}
