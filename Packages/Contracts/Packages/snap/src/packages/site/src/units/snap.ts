const LOCAL_SNAP_ID = 'local:http://localhost:8080';

function assertMetaMask() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is required to use the BitcoinSolar Snap.');
  }
}

export const connectSnap = async () => {
  assertMetaMask();

  await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [LOCAL_SNAP_ID]: {}
    },
  });
};

export const getSnap = async () => {
  assertMetaMask();

  const snaps = await window.ethereum.request({
    method: 'wallet_getSnaps'
  });

  return snaps?.[LOCAL_SNAP_ID] || null;
};

export const isSnapInstalled = async () => {
  const snap = await getSnap();
  return Boolean(snap);
};

export const getYield = async () => {
  assertMetaMask();

  return await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: LOCAL_SNAP_ID,
      request: { method: 'blsr_checkYield' }
    }
  });
};

export const harvestSolar = async () => {
  assertMetaMask();

  return await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: LOCAL_SNAP_ID,
      request: { method: 'blsr_harvest' }
    }
  });
};
