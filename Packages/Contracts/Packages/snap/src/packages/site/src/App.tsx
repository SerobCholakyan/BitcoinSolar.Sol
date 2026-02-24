import React, { useEffect } from 'react';
import { useSnap } from './useSnap';
import { SnapStatus } from './SnapStatus';
import { SolarCard } from './SolarCard';

const App: React.FC = () => {
  const {
    installed,
    loading,
    yieldInfo,
    error,
    connect,
    checkInstalled,
    checkYield,
    harvest,
  } = useSnap();

  useEffect(() => {
    void checkInstalled();
  }, [checkInstalled]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top, #1f2937 0, #020617 55%, #000 100%)',
        color: '#e5e7eb',
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 640,
          borderRadius: 24,
          padding: '2rem',
          background: 'linear-gradient(145deg, rgba(15,23,42,0.95), rgba(3,7,18,0.98))',
          boxShadow: '0 25px 60px rgba(0,0,0,0.75), 0 0 40px rgba(251,191,36,0.15)',
          border: '1px solid rgba(148,163,184,0.25)',
        }}
      >
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
          BitcoinSolar Snap
        </h1>
        <p style={{ marginBottom: '1.5rem', color: '#9ca3af' }}>
          Monitor and harvest your <strong>BLSR</strong> solar yield inside MetaMask.
        </p>

        <SolarCard title="Snap Status">
          <SnapStatus installed={installed} />
        </SolarCard>

        {installed === false && (
          <button
            onClick={connect}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #facc15, #f97316, #fb923c)',
              color: '#111827',
              fontWeight: 600,
              marginBottom: '1.5rem',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Connecting…' : 'Connect BitcoinSolar Snap'}
          </button>
        )}

        {installed && (
          <>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <button
                onClick={checkYield}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: 999,
                  border: 'none',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #22c55e, #4ade80)',
                  color: '#022c22',
                  fontWeight: 600,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Checking…' : 'Check Yield'}
              </button>

              <button
                onClick={harvest}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: 999,
                  border: 'none',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #f97316, #fb923c)',
                  color: '#111827',
                  fontWeight: 600,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Harvesting…' : 'Harvest'}
              </button>
            </div>

            <SolarCard title="Yield & Activity">
              {yieldInfo ? (
                <pre
                  style={{
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    color: '#e5e7eb',
                    maxHeight: 220,
                    overflow: 'auto',
                  }}
                >
                  {JSON.stringify(yieldInfo, null, 2)}
                </pre>
              ) : (
                <p style={{ margin: 0, color: '#9ca3af' }}>
                  No yield data yet. Check or harvest to see results.
                </p>
              )}
            </SolarCard>
          </>
        )}

        {error && (
          <div
            style={{
              marginTop: '1.25rem',
              padding: '0.75rem 1rem',
              borderRadius: 12,
              background: 'rgba(127,29,29,0.9)',
              color: '#fee2e2',
              fontSize: '0.85rem',
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
