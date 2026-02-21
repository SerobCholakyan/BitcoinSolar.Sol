import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';

// --- 1. LEGAL OVERLAY COMPONENT ---
const LegalOverlay = ({ onAccept }) => {
  const [show, setShow] = useState(true);
  if (!show) return null;

  return (
    <div style={styles.legalOverlay}>
      <div style={styles.legalModal}>
        <h2 style={{color: '#f7931a'}}>BitcoinSolar (BLSR) Legal Agreement</h2>
        <div style={styles.legalContent}>
          <p><strong>1. No Investment Advice:</strong> BLSR is a utility token for use within the BitcoinSolar ecosystem. It is not an investment or security.</p>
          <p><strong>2. Risk of Loss:</strong> Crypto mining involves hardware wear and costs. You assume all risks.</p>
          <p><strong>3. Compliance:</strong> By clicking "I Agree," you certify that mining BLSR is legal in your jurisdiction.</p>
          <p><strong>4. 2026 Tax:</strong> Users are responsible for reporting rewards to local tax authorities (e.g., Form 1099-DA).</p>
        </div>
        <button onClick={() => { setShow(false); onAccept(); }} style={styles.legalButton}>
          I AGREE & START MINER
        </button>
      </div>
    </div>
  );
};

// --- 2. SINGULARITY BACKGROUND COMPONENT ---
const ICONS = {
  blsr: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg', // Replace with your BLSR logo
  metamask: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
  polygon: 'https://cryptologos.cc/logos/polygon-matic-logo.svg'
};

const SingularityBackground = ({ isBlockSolved, onAnimationComplete }) => {
  const [bubbles, setBubbles] = useState([]);
  const bubblesRef = useRef([]);
  const [activeSingularity, setActiveSingularity] = useState(null);

  useEffect(() => {
    const initialBubbles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      type: ['blsr', 'metamask', 'polygon'][Math.floor(Math.random() * 3)],
      size: Math.random() * 40 + 40,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      isSucked: false
    }));
    bubblesRef.current = initialBubbles;
    setBubbles(initialBubbles);

    let frame;
    const animate = () => {
      if (!activeSingularity) {
        bubblesRef.current.forEach(b => {
          b.x += b.vx; b.y += b.vy;
          if (b.x <= 0 || b.x >= window.innerWidth) b.vx *= -1;
          if (b.y <= 0 || b.y >= window.innerHeight) b.vy *= -1;
        });
        setBubbles([...bubblesRef.current]);
      }
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [activeSingularity]);

  useEffect(() => {
    if (isBlockSolved && !activeSingularity) {
      const targetId = bubblesRef.current[0].id;
      setActiveSingularity(targetId);
      bubblesRef.current.forEach(b => { if (b.id !== targetId) b.isSucked = true; });
      setTimeout(() => {
        setActiveSingularity(null);
        bubblesRef.current.forEach(b => { 
            b.isSucked = false; 
            b.x = Math.random() * window.innerWidth;
            b.y = Math.random() * window.innerHeight;
        });
        onAnimationComplete();
      }, 2500);
    }
  }, [isBlockSolved]);

  return (
    <div style={styles.bgContainer}>
      {bubbles.map(b => (
        <div key={b.id} className={`bubble ${activeSingularity === b.id ? 'active' : ''} ${b.isSucked ? 'sucked' : ''}`}
          style={{ ...styles.bubble, width: b.size, height: b.size, left: b.x, top: b.y }}>
          <img src={ICONS[b.type]} style={{width: '60%'}} alt="icon" />
        </div>
      ))}
      <style>{`
        .bubble { transition: transform 0.1s linear; }
        .bubble.active { transform: scale(4) rotate(360deg) !important; z-index: 100; transition: all 2s ease-in !important; filter: hue-rotate(180deg) shadow(0 0 20px gold); }
        .bubble.sucked { transform: scale(0) translate(0,0) !important; opacity: 0; transition: all 1.5s ease-in !important; }
      `}</style>
    </div>
  );
};

// --- 3. MAIN DASHBOARD ---
export default function MinerDashboard() {
  const [isLegalAccepted, setIsLegalAccepted] = useState(false);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    if (!isLegalAccepted) return;

    const CONTRACT_ADDRESS = "0xYourContractAddressFromRemix"; 
    const ABI = ["event Transfer(address indexed from, address indexed to, uint256 value)"];

    const listenToBlockchain = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        contract.on("Transfer", (from) => {
          if (from === "0x0000000000000000000000000000000000000000") {
            setSolved(true);
          }
        });
      }
    };
    listenToBlockchain();
  }, [isLegalAccepted]);

  return (
    <div style={styles.mainApp}>
      {!isLegalAccepted && <LegalOverlay onAccept={() => setIsLegalAccepted(true)} />}
      
      <SingularityBackground isBlockSolved={solved} onAnimationComplete={() => setSolved(false)} />

      <div style={styles.uiLayer}>
        <header style={styles.header}>
          <h1 style={{margin: 0, letterSpacing: '2px'}}>BITCOIN SOLAR</h1>
          <div style={styles.statusBadge}>NETWORK: POLYGON POS</div>
        </header>

        <main style={styles.minerBox}>
          <div style={styles.statLine}>HASHRATE: <span style={{color: '#00ff00'}}>1.24 GH/s</span></div>
          <div style={styles.statLine}>BLSR MINED: <span>42.00</span></div>
          <button style={styles.mineButton} onClick={() => setSolved(true)}>MANUAL TEST SOLVE</button>
        </main>

        <footer style={styles.footer}>
          © 2026 BitcoinSolar Network | Utility Token Disclosed
        </footer>
      </div>
    </div>
  );
}

const styles = {
  mainApp: { position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000', color: 'white', fontFamily: 'sans-serif' },
  bgContainer: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 },
  bubble: { position: 'absolute', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' },
  uiLayer: { position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7))' },
  header: { padding: '40px', textAlign: 'center' },
  statusBadge: { fontSize: '12px', color: '#f7931a', marginTop: '5px' },
  minerBox: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  statLine: { fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' },
  mineButton: { marginTop: '20px', padding: '10px 20px', background: 'transparent', border: '1px solid #f7931a', color: '#f7931a', cursor: 'pointer', borderRadius: '4px' },
  footer: { padding: '20px', textAlign: 'center', fontSize: '10px', color: '#666' },
  // Legal Styles
  legalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  legalModal: { backgroundColor: '#111', padding: '30px', borderRadius: '15px', maxWidth: '500px', border: '1px solid #333', textAlign: 'center' },
  legalContent: { textAlign: 'left', fontSize: '13px', color: '#ccc', maxHeight: '200px', overflowY: 'auto', marginBottom: '20px' },
  legalButton: { backgroundColor: '#f7931a', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }
};
