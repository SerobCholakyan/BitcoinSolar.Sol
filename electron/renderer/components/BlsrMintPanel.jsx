import React, { useState } from "react";

export default function BlsrMintPanel() {
  const [logLine, setLogLine] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleMint = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await window.blsr.mintReward(logLine);
      if (res.ok) {
        setResult(res);
      } else {
        setError(res.error || "Mint failed");
      }
    } catch (err) {
      setError(err?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem", background: "#05060a", color: "#f5f5f5" }}>
      <h2>BLSR On-Chain Mint</h2>
      <p style={{ opacity: 0.8 }}>
        Paste a solved block log line to mint BLSR rewards on-chain.
      </p>

      <textarea
        value={logLine}
        onChange={(e) => setLogLine(e.target.value)}
        rows={4}
        style={{
          width: "100%",
          marginTop: "0.5rem",
          padding: "0.5rem",
          background: "#0b0d14",
          color: "#f5f5f5",
          border: "1px solid #222",
          borderRadius: 4,
          fontFamily: "monospace",
        }}
        placeholder="[miner] block=12345 nonce=0xabc... difficulty=..."
      />

      <button
        onClick={handleMint}
        disabled={loading || !logLine.trim()}
        style={{
          marginTop: "0.75rem",
          padding: "0.5rem 1rem",
          background: loading ? "#333" : "#ffb300",
          color: "#05060a",
          border: "none",
          borderRadius: 4,
          cursor: loading ? "default" : "pointer",
          fontWeight: 600,
        }}
      >
        {loading ? "Minting..." : "Mint BLSR"}
      </button>

      {result && (
        <div style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
          <div>✅ Mint successful</div>
          <div>Tx: {result.txHash}</div>
          <div>Status: {result.status}</div>
          <div>Block: {result.blockNumber}</div>
        </div>
      )}

      {error && (
        <div style={{ marginTop: "1rem", color: "#ff6b6b", fontSize: "0.9rem" }}>
          ❌ {error}
        </div>
      )}
    </div>
  );
}
