import React, { useState } from 'react';
import SingularityBackground from './SingularityBackground';
import { useMinerEvents } from './useMinerEvents'; // The code above

export default function MinerDashboard() {
  const [solved, setSolved] = useState(false);

  // This hook "listens" to the blockchain and sets 'solved' to true automatically
  useMinerEvents(() => setSolved(true));

  return (
    <div style={{ position: 'relative' }}>
      <SingularityBackground 
        isBlockSolved={solved} 
        onAnimationComplete={() => setSolved(false)} 
      />
      
      {/* Your Miner Stats/UI go here */}
      <div className="stats-overlay">
        <h1>BLSR MINER ACTIVE</h1>
        <p>Searching for the next singularity...</p>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import SingularityBackground from './SingularityBackground';

export default function MinerDashboard() {
  const [solved, setSolved] = useState(false);

  // Trigger this when your actual mining logic finds a block
  const handleBlockFound = () => {
    setSolved(true);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 🌌 Background Layer */}
      <SingularityBackground 
        isBlockSolved={solved} 
        onAnimationComplete={() => setSolved(false)} 
      />

      {/* 🖥️ UI Layer */}
      <main style={dashboardStyles.container}>
         <h1 style={{color: '#f7931a'}}>BLSR MINER</h1>
         <button onClick={handleBlockFound}>Simulate Block Solve</button>
      </main>
    </div>
  );
}

const dashboardStyles = {
  container: {
    position: 'relative',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    height: '100vh', color: 'white', zIndex: 1,
    background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)'
  }
};
