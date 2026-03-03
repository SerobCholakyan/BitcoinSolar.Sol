import { useEffect, useState } from "react";

export default function TradeExecutor() {
  const [intents, setIntents] = useState([]);

  async function loadIntents() {
    const res = await fetch("/api/intents");
    const data = await res.json();
    setIntents(data);
  }

  async function executeIntent(intent: any) {
    const tx = intent.tx;

    await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [tx]
    });
  }

  useEffect(() => {
    loadIntents();
    const interval = setInterval(loadIntents, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Trade Executor</h1>

      {intents.map((intent: any, i: number) => (
        <div key={i} style={{ marginBottom: 20, padding: 20, border: "1px solid #444" }}>
          <pre>{JSON.stringify(intent, null, 2)}</pre>
          <button onClick={() => executeIntent(intent)}>Execute in MetaMask</button>
        </div>
      ))}
    </div>
  );
}
