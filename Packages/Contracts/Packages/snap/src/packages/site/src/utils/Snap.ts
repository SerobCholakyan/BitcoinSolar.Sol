export const BLSR_SNAP_ID = 'npm:bitcoin-solar-snap';

type SnapRpcResult = any;

export async function connectSnap(): Promise<void> {
  if (!(window as any).ethereum) {
    throw new Error('MetaMask is not available in this browser.');
  }

  await (window as any).ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [BLSR_SNAP_ID]: {},
    },
  });
}

export async function getSnap(): Promise<any | null> {
  if (!(window as any).ethereum) {
    throw new Error('MetaMask is not available in this browser.');
  }

  const snaps = await (window as any).ethereum.request({
    method: 'wallet_getSnaps',
  });

  const entries = Object.values(snaps || {}) as any[];

  return entries.find((snap: any) => snap.id === BLSR_SNAP_ID) ?? null;
}

export async function isSnapInstalled(): Promise<boolean> {
  const snap = await getSnap();
  return !!snap;
}

export async function getYield(): Promise<SnapRpcResult> {
  if (!(window as any).ethereum) {
    throw new Error('MetaMask is not available in this browser.');
  }

  const result = await (window as any).ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: BLSR_SNAP_ID,
      request: {
        method: 'blsr_checkYield',
      },
    },
  });

  return result;
}

export async function harvestSolar(): Promise<SnapRpcResult> {
  if (!(window as any).ethereum) {
    throw new Error('MetaMask is not available in this browser.');
  }

  const result = await (window as any).ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: BLSR_SNAP_ID,
      request: {
        method: 'blsr_harvest',
      },
    },
  });

  return result;
}
