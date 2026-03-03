import React from "react";

type Intent = {
  id: string;
  type: string;
  chain: string;
  tx: any;
  meta?: any;
  timestamp: number;
};

type Props = {
  intent: Intent;
  onExecute: (intent: Intent) => void;
};

export const IntentCard: React.FC<Props> = ({ intent, onExecute }) => {
  return (
    <div
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
        onClick={() => onExecute(intent)}
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
  );
};
