/* -------------------------------------------------------------
 * BitcoinSolar Snap Utilities
 * -------------------------------------------------------------
 * This file provides:
 *  • connectSnap() — installs/requests the Snap
 *  • getSnap() — returns installed Snap info
 *  • getYield() — calls blsr_checkYield
 *  • harvestSolar() — calls blsr_harvest
 *  • isSnapInstalled() — quick boolean check
 * ----------------------------------------------------------- */

const LOCAL_SNAP_ID = 'local:http://localhost:8080';

/**
 * -------------------------------------------------------------
 * Ensure MetaMask + Snaps are available
 * -------------------------------------------------------------
 */
function assertMetaMask() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is required to use the BitcoinSolar Snap.');
  }
}

/**
 * -------------------------------------------------------------
 * Connect / install the Snap
 * -------------------------------------------------------------
 */
export const connectSnap = async () => {
  assertMetaMask();

  try {
    await window.ethereum.request({
      method: 'wallet_requestSnaps',
      params: {
        [LOCAL_SNAP_ID]: {}
      },
    });
  } catch (err) {
    console.error('Failed to connect Snap:', err);
    throw new Error('Unable to connect to BitcoinSolar Snap.');
  }
};

/**
 * -------------------------------------------------------------
 * Get installed Snap info
 * -------------------------------------------------------------
 */
export const getSnap = async () => {
  assertMetaMask();

  const snaps = await window.ethereum.request({
    method: 'wallet_getSnaps'
  });

  return snaps?.[LOCAL_SNAP_ID] || null;
};

/**
 * -------------------------------------------------------------
 * Check if Snap is installed
 * -------------------------------------------------------------
 */
export const isSnapInstalled = async () => {
  const snap = await getSnap();
  return Boolean(snap);
};

/**
 * -------------------------------------------------------------
 * Call Snap RPC: blsr_checkYield
 * -------------------------------------------------------------
 */
export const getYield = async () => {
  assertMetaMask();

  try {
    const result = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: LOCAL_SNAP_ID,
        request: {
          method: 'blsr_checkYield'
        }
      }
    });

    return result;
  } catch (err) {
    console.error('Snap yield check failed:', err);
    throw new Error('Unable to fetch yield from BitcoinSolar Snap.');
  }
};

/**
 * -------------------------------------------------------------
 * Call Snap RPC: blsr_harvest
 * -------------------------------------------------------------
 */
export const harvestSolar = async () => {
  assertMetaMask();

  try {
    const result = await window.ethereum.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: LOCAL_SNAP_ID,
        request: {
          method: 'blsr_harvest'
        }
      }
    });

    return result;
  } catch (err) {
    console.error('Snap harvest failed:', err);
    throw new Error
