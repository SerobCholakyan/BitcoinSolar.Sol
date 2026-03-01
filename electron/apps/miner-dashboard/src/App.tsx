import React from "react";
import BlsrMintPanel from "./components/BlsrMintPanel";

export default function App() {
  return (
    <div style={{ padding: "2rem", maxWidth: 960, margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        BitcoinSolar Miner Dashboard
      </h1>
      <p style={{ opacity: 0.8, marginBottom: "1.5rem" }}>
        Submit solved block log lines and mint BLSR rewards on-chain.
      </p>
      <BlsrMintPanel />
    </div>
  );
}
