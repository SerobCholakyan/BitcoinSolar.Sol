"use client";

import React, { useState } from "react";
import MintForm from "../components/MintForm";
import TxStatus from "../components/TxStatus";

export default function HomePage() {
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          background: "rgba(15, 23, 42, 0.9)",
          borderRadius: 16,
          border: "1px solid rgba(148, 163, 184, 0.3)",
          padding: "1.5rem 1.75rem",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)"
        }}
      >
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.25rem" }}>
          BitcoinSolar BLSR Minter
        </h1>

        <p style={{ opacity: 0.8, marginBottom: "1rem" }}>
          Mint BLSR rewards on-chain by submitting solved block log lines.
        </p>

        <MintForm onResult={setResult} onError={setError} />

        {result && <TxStatus result={result} />}
        {error && (
          <div
            style={{
              marginTop: "1rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              fontSize: "0.9rem",
              color: "#fecaca"
            }}
          >
            ❌ {error}
          </div>
        )}
      </div>
    </main>
  );
}
