import React from 'react';

export const SnapStatus = ({ installed }: { installed: boolean | null }) => {
  if (installed === null) {
    return <span style={{ color: '#9ca3af' }}>Checking Snap…</span>;
  }
  if (installed === true) {
    return <span style={{ color: '#4ade80' }}>Snap Connected ✓</span>;
  }
  return <span style={{ color: '#f97316' }}>Snap Not Installed ⚠️</span>;
};
