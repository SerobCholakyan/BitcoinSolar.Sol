import { useState, useCallback, useEffect } from 'react';
import {
  connectSnap,
  isSnapInstalled,
  getYield,
  harvestSolar,
} from './utils/snap';

export function useSnap() {
  const [installed, setInstalled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [yieldInfo, setYieldInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const checkInstalled = useCallback(async () => {
    try {
      const ok = await isSnapInstalled();
      setInstalled(ok);
    } catch (err: any) {
      setInstalled(false);
      setError(err?.message || 'Failed to detect Snap.');
    }
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await connectSnap();
      await checkInstalled();
    } catch (err: any) {
      setError(err?.message || 'Failed to connect Snap.');
    } finally {
      setLoading(false);
    }
  }, [checkInstalled]);

  const checkYield = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await getYield();
      setYieldInfo(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch yield.');
    } finally {
      setLoading(false);
    }
  }, []);

  const harvest = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await harvestSolar();
      setYieldInfo(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to harvest yield.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void checkInstalled();
  }, [checkInstalled]);

  return {
    installed,
    loading,
    yieldInfo,
    error,
    connect,
    checkInstalled,
    checkYield,
    harvest,
  };
}
