/* -------------------------------------------------------------
 * BitcoinSolar Snap Utilities
 * -------------------------------------------------------------
 * This file provides:
 *  • connectSnap() — installs/requests the Snap
 *  • getSnap() — returns installed Snap info
 *  • getYield() — calls blsr_checkYield
 *  • harvestSolar() — calls blsr_harvest
 * ----------------------------------------------------------- */

const LOCAL_SNAP_ID = 'local:http://localhost:8080';

/**
 * -------------------------------------------------------------
 * Request installation / connection to the Snap
 * -------------------------------------------------------------
 */
export const connectSnap = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is required to use BitcoinSolar Snap.");
  }

  await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [LOCAL_SNAP_ID]: {}
    },
  });
};

/**
 * -------------------------------------------------------------
 * Get installed Snap info (debug helper)
 * -------------------------------------------------------------
 */
export const getSnap = async () => {
  const snaps = await window.ethereum.request({
    method: 'wallet_getSnaps'
  });

  return snaps?.[LOCAL_SNAP_ID] || null;
};

/**
 * -------------------------------------------------------------
 * Call the Snap RPC method: blsr_checkYield
 * -------------------------------------------------------------
 */
export const getYield = async () => {
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
    console.error("Snap yield check failed:", err);
    throw err;
  }
};

/**
 * -------------------------------------------------------------
 * Call the Snap RPC method: blsr_harvest
 * -------------------------------------------------------------
 */
export const harvestSolar = async () => {
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
    console.error("Snap harvest failed:", err);
    throw err;
  }
};
