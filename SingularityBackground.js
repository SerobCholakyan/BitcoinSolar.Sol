import { useEffect } from 'react';
import { ethers } from 'ethers';

// 1. Your Contract Info (Get these from Remix after deploying)
const CONTRACT_ADDRESS = "0xYourDeployedContractAddressHere";
const CONTRACT_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

export function useMinerEvents(onBlockSolved) {
  useEffect(() => {
    const initListener = async () => {
      // Connect to the Polygon network via MetaMask
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      console.log("🌌 Gravity sensors active... watching for BLSR blocks.");

      // 2. Listen for the 'Transfer' event 
      // In ERC20, a 'Mint' is just a Transfer from the "0x0" address.
      contract.on("Transfer", (from, to, value) => {
        if (from === "0x0000000000000000000000000000000000000000") {
          console.log("☄️ Block Solved! Singularity initiated...");
          onBlockSolved(); // This triggers the Black Hole animation!
        }
      });
    };

    if (window.ethereum) {
      initListener();
    }
    
    // Cleanup listener when app closes
    return () => {
      // contract.removeAllListeners("Transfer");
    };
  }, [onBlockSolved]);
}
import React, { useEffect, useRef, useState } from 'react';

const ICONS = {
  blsr: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=024', // Replace with your BLSR logo path
  metamask: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
  polygon: 'https://cryptologos.cc/logos/polygon-matic-logo.svg?v=024'
};

const SingularityBackground = ({ isBlockSolved, onAnimationComplete }) => {
  const containerRef = useRef(null);
  const [bubbles, setBubbles] = useState([]);
  const bubblesRef = useRef([]); // Persistent ref for physics engine
  const [activeSingularity, setActiveSingularity] = useState(null);

  // Initialize bubbles
  useEffect(() => {
    const initialBubbles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      type: ['blsr', 'metamask', 'polygon', 'metamask', 'polygon'][Math.floor(Math.random() * 5)],
      size: Math.random() * 40 + 50,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      isSucked: false
    }));
    bubblesRef.current = initialBubbles;
    setBubbles(initialBubbles);

    // Animation Loop
    let animationFrame;
    const animate = () => {
      if (!activeSingularity) {
        bubblesRef.current.forEach(b => {
          b.x += b.vx;
          b.y += b.vy;
          if (b.x <= 0 || b.x + b.size >= window.innerWidth) b.vx *= -1;
          if (b.y <= 0 || b.y + b.size >= window.innerHeight) b.vy *= -1;
        });
        setBubbles([...bubblesRef.current]);
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [activeSingularity]);

  // Handle the Singularity Event
  useEffect(() => {
    if (isBlockSolved && !activeSingularity) {
      const blsrOnes = bubblesRef.current.filter(b => b.type === 'blsr');
      const target = blsrOnes[Math.floor(Math.random() * blsrOnes.length)];
      
      setActiveSingularity(target.id);

      // Suck others in
      bubblesRef.current.forEach(b => {
        if (b.id !== target.id) {
          b.isSucked = true;
          b.x = target.x;
          b.y = target.y;
        }
      });

      // Reset after 2 seconds
      setTimeout(() => {
        setActiveSingularity(null);
        bubblesRef.current.forEach(b => {
          b.isSucked = false;
          // Scatter them back
          b.x = Math.random() * window.innerWidth;
          b.y = Math.random() * window.innerHeight;
        });
        onAnimationComplete();
      }, 2000);
    }
  }, [isBlockSolved]);

  return (
    <div ref={containerRef} style={styles.wallpaper}>
      {bubbles.map((b) => (
        <div
          key={b.id}
          className={`bubble ${b.type} ${activeSingularity === b.id ? 'singularity' : ''} ${b.isSucked ? 'sucked' : ''}`}
          style={{
            ...styles.bubble,
            width: b.size,
            height: b.size,
            left: b.x,
            top: b.y,
            transform: `translateY(${Math.sin(Date.now() / 1000 + b.x) * 5}px)`
          }}
        >
          <img src={ICONS[b.type]} style={styles.icon} alt="token" />
        </div>
      ))}
      <style>{`
        .bubble.singularity {
          transition: all 1.5s ease-in-out !important;
          transform: scale(3) rotate(360deg) !important;
          box-shadow: 0 0 60px 20px #f7931a, inset 0 0 20px #000 !important;
          background: #000 !important;
          z-index: 99;
        }
        .bubble.sucked {
          transition: all 1.2s cubic-bezier(0.7, 0, 0.84, 0) !important;
          transform: scale(0) rotate(720deg) !important;
          opacity: 0 !important;
        }
      `}</style>
    </div>
  );
};

const styles = {
  wallpaper: {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    background: 'radial-gradient(circle at center, #0a0a1a 0%, #000 100%)',
    zIndex: -1, overflow: 'hidden'
  },
  bubble: {
    position: 'absolute', borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backdropFilter: 'blur(4px)', pointerEvents: 'none'
  },
  icon: { width: '60%', height: '60%', objectFit: 'contain' }
};

export default SingularityBackground;
