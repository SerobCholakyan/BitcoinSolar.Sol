import React, { useState } from "react";
import SingularityBackground from "./SingularityBackground";
import { useMinerEvents } from "./useMinerEvents";

export default function MinerPage() {
  const [solved, setSolved] = useState(false);

  // 🔥 Auto-trigger when smart contract emits a mint/Transfer event
  useMinerEvents(() => setSolved(true));

  // 🧪 Manual test button
  const handleManualSolve = () => setSolved(true);

  return (
    <div style={styles.wrapper}>
      {/* 🌌 Animated Background Layer */}
      <SingularityBackground
        isBlockSolved={solved}
        onAnimationComplete={() => setSolved(false)}
      />

      {/* 🖥️ Foreground UI Layer */}
      <main style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>BLSR MINER</h1>
          <p style={styles.subtitle}>Searching for the next singularity…</p>

          <button style={styles.button} onClick={handleManualSolve}>
            Simulate Block Solve
          </button>

          {solved && (
            <div style={styles.solvedBanner}>
              <span style={styles.solvedGlow}>BLOCK SOLVED</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

//
// 🎨 Styles
//
const styles = {
  wrapper: {
    position: "relative",
    minHeight: "100vh",
    overflow: "hidden",
    background: "#050510",
  },

  container: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    padding: 20,
  },

  card: {
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: "40px 60px",
    textAlign: "center",
    boxShadow: "0 0 40px rgba(0,0,0,0.6)",
    maxWidth: 420,
  },

  title: {
    color: "#f7931a",
    fontSize: 36,
    letterSpacing: "0.12em",
    marginBottom: 10,
    textTransform: "uppercase",
  },

  subtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    marginBottom: 30,
  },

  button: {
    marginTop: 10,
    padding: "12px 26px",
    background: "transparent",
    border: "1px solid #f7931a",
    color: "#f7931a",
    cursor: "pointer",
    borderRadius: 8,
    fontSize: 16,
    letterSpacing: "0.08em",
    transition: "all 0.2s ease",
  },

  solvedBanner: {
    marginTop: 30,
    padding: "10px 20px",
    borderRadius: 8,
    background: "rgba(34,197,94,0.15)",
    border: "1px solid rgba(34,197,94,0.4)",
  },

  solvedGlow: {
    color: "#22c55e",
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textShadow: "0 0 12px rgba(34,197,94,0.9)",
  },
};
