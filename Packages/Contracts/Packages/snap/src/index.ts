import {
  OnTransactionHandler,
  OnRpcRequestHandler,
} from '@metamask/snaps-types';

import {
  panel,
  text,
  heading,
  divider,
  copyable,
} from '@metamask/snaps-ui';

import { ethers } from 'ethers';

/**
 * -----------------------------
 *  BitcoinSolar chain config
 * -----------------------------
 *
 * TODO: Replace the placeholders below with your real values:
 *  - RPC_URL: your Polygon / BLSR RPC endpoint
 *  - BLSR_CONTRACT: your deployed BLSR yield contract
 *  - ABI: the real ABI of your yield + harvest functions
 */

const RPC_URL = 'https://polygon-mainnet.infura.io/v3/YOUR_INFURA_KEY'; // TODO
const BLSR_CONTRACT = '0xYOUR_BLSR_CONTRACT_ADDRESS'; // TODO

const BLSR_ABI = [
  // Example ABI entries – replace with your real contract ABI
  'function pendingYield(address account) view returns (uint256)',
  'function harvest() returns (bool)',
];

const provider = new ethers.JsonRpcProvider(RPC_URL);
const blsrContract = new ethers.Contract(BLSR_CONTRACT, BLSR_ABI, provider);

/**
 * Format BLSR yield nicely.
 */
function formatYield(amount: string | number): string {
  return `${amount} BLSR`;
}

/**
 * Get the currently selected EOA from MetaMask via ethereum-provider endowment.
 */
async function getActiveAccount(): Promise<string> {
  // @ts-ignore - ethereum is injected by the ethereum-provider endowment
  const accounts = (await ethereum.request({
    method: 'eth_accounts',
  })) as string[];

  if (!accounts || accounts.length === 0) {
    throw new Error('No active account found. Please unlock MetaMask and select an account.');
  }

  return accounts[0];
}

/**
 * Read real yield from the BLSR contract for the active account.
 */
async function fetchRealYield(): Promise<{
  ok: boolean;
  account: string;
  raw: string;
  blsr: string;
  timestamp: number;
}> {
  const account = await getActiveAccount();

  const pending = (await blsrContract.pendingYield(account)) as ethers.BigNumberish;
  const raw = pending.toString();

  // If your token has 18 decimals, adjust here
  const human = ethers.formatUnits(pending, 18);

  return {
    ok: true,
    account,
    raw,
    blsr: human,
    timestamp: Date.now(),
  };
}

/**
 * Trigger a real harvest transaction.
 *
 * NOTE:
 *  - This uses a raw JSON-RPC `eth_sendTransaction` via the ethereum provider.
 *  - If your contract requires a specific method selector / data, encode it with ethers.
 */
async function performHarvest(): Promise<{
  ok: boolean;
  account: string;
  txHash: string;
  timestamp: number;
}> {
  const account = await getActiveAccount();

  const iface = new ethers.Interface(BLSR_ABI);
  const data = iface.encodeFunctionData('harvest', []);

  // @ts-ignore - ethereum is injected by the ethereum-provider endowment
  const txHash = (await ethereum.request({
    method: 'eth_sendTransaction',
    params: [
      {
        from: account,
        to: BLSR_CONTRACT,
        data,
      },
    ],
  })) as string;

  return {
    ok: true,
    account,
    txHash,
    timestamp: Date.now(),
  };
}

/**
 * Transaction insight handler – stays UI-focused.
 */
export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  const estimatedYield = formatYield('0.052'); // Optional: you can wire this to real data later.

  return {
    content: panel([
      heading('BitcoinSolar Alert'),
      text('You are interacting with the Solar Network.'),
      divider(),
      text(`Estimated Yield to Harvest: **${estimatedYield}**`),
      text('Status: ☀️ High Intensity'),
      divider(),
      text('Transaction Details:'),
      copyable(JSON.stringify(transaction, null, 2)),
    ]),
  };
};

/**
 * RPC handler – returns JSON for the dapp, not UI panels.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  switch (request.method) {
    case 'blsr_checkYield': {
      const yieldInfo = await fetchRealYield();

      return {
        ...yieldInfo,
        formatted: formatYield(yieldInfo.blsr),
      };
    }

    case 'blsr_harvest': {
      const result = await performHarvest();

      return {
        ...result,
        harvested: true,
      };
    }

    default:
      throw new Error(`Unknown RPC method: ${request.method}`);
  }
};
