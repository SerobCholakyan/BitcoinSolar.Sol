import React, { useState } from 'react';
import SingularityBackground from './SingularityBackground';
import { useMinerEvents } from './useMinerEvents'; // Auto-detects mint events

export default function MinerDashboard() {
  const [solved, setSolved] = useState(false);

  // 🔥 Automatically triggers when your smart contract emits a mint/Transfer event
  useMinerEvents(() => setSolved(true));

  // 🧪 Manual test button
  const handleManualSolve = () => setSolved(true);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      
      {/* 🌌 Animated Background Layer */}
      <SingularityBackground
        isBlockSolved={solved}
        onAnimationComplete={() => setSolved(false)}
      />

      {/* 🖥️ Foreground UI Layer */}
      <main style={styles.container}>
        <h1 style={{ color: '#f7931a', marginBottom: 10 }}>BLSR MINER</h1>
        <p style={{ opacity: 0.8 }}>Searching for the next singularity...</p>

        <button style={styles.button} onClick={handleManualSolve}>
          Simulate Block Solve
        </button>
      </main>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    color: 'white',
    background: 'rgba(0,0,0,0.35)',
    backdropFilter: 'blur(6px)',
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    padding: '10px 20px',
    background: 'transparent',
    border: '1px solid #f7931a',
    color: '#f7931a',
    cursor: 'pointer',
    borderRadius: 6,
    fontSize: 16,
  }
};
