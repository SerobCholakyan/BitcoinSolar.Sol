import React from 'react';

export const SolarCard = ({ title, children }: any) => (
  <div
    style={{
      padding: '1.25rem',
      borderRadius: 16,
      background: 'rgba(15,23,42,0.9)',
      border: '1px solid rgba(55,65,81,0.8)',
      marginBottom: '1.5rem',
    }}
  >
    <h2 style={{ margin: 0, marginBottom: '0.75rem', fontSize: '1.1rem' }}>
      {title}
    </h2>
    {children}
  </div>
);
