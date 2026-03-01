import React, { useState } from "react";

export default function BlsrMintPanel() {
  const [logLine, setLogLine] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMint = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const api =
        (window as any).blsr && typeof (window as any).blsr.mintReward === "function"
          ? (window as any).blsr
          : null;

      if (!api) {
        setError("Electron bridge not available (window.blsr.mintReward missing).");
        return;
      }

      const res = await api.mintReward(logLine);
      if (res.ok) setResult(res);
      else setError(res.error || "Mint failed");
    } catch (e: any) {
      setError(e?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea
        value={logLine}
        onChange={(e) => setLogLine(e.target.value)}
        rows={5}
        style={{
          width: "100%",
          padding: "0.75rem",
          background: "#020617",
          color: "#e5e7eb",
          borderRadius: 8,
          border: "1px solid #1f2937",
          fontFamily: "monospace",
          fontSize: "0.9rem"
        }}
        placeholder="[miner] block=12345 nonce=0xabc... difficulty=..."
      />

      <button
        onClick={handleMint}
        disabled={loading || !logLine.trim()}
        style={{
          marginTop: "0.75rem",
          padding: "0.6rem 1.4rem",
          background: loading || !logLine.trim() ? "#374151" : "#fbbf24",
          color: "#111827",
          borderRadius: 999,
          border: "none",
          fontWeight: 600,
          cursor: loading || !logLine.trim() ? "default" : "pointer"
        }}
      >
        {loading ? "Minting..." : "Mint BLSR"}
      </button>

      {result && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            borderRadius: 8,
            background: "rgba(22, 163, 74, 0.1)",
            border: "1px solid rgba(22, 163, 74, 0.4)"
          }}
        >
          <div>✅ Mint successful</div>
          <div>Tx: {result.txHash}</div>
          <div>Status: {result.status}</div>
          <div>Block: {result.blockNumber}</div>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            borderRadius: 8,
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            color: "#fecaca"
          }}
        >
          ❌ {error}
        </div>
      )}
    </div>
  );
}
