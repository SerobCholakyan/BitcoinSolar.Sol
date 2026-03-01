"use client";

import React, { useState } from "react";

export default function MintForm({ onResult, onError }) {
  const [logLine, setLogLine] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMint = async () => {
    setLoading(true);
    onResult(null);
    onError(null);

    try {
      const res = await fetch("/api/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logLine })
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        onError(data.error || "Mint failed");
      } else {
        onResult(data);
      }
    } catch (err) {
      onError(err?.message || "Unexpected error");
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
          background: loading ? "#374151" : "#fbbf24",
          color: "#111827",
          borderRadius: 999,
          border: "none",
          fontWeight: 600,
          cursor: loading || !logLine.trim() ? "default" : "pointer",
          boxShadow: loading ? "none" : "0 10px 30px rgba(251, 191, 36, 0.35)"
        }}
      >
        {loading ? "Minting..." : "Mint BLSR"}
      </button>
    </div>
  );
}
