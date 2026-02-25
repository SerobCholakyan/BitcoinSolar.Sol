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
 * RPC_URL: real Polygon mainnet public RPC.
 * BLSR_CONTRACT: you MUST replace with your real deployed BLSR ERC-20 address.
 */

const RPC_URL = 'https://polygon-rpc.com';
const BLSR_CONTRACT = '0xYOUR_BLSR_CONTRACT_ADDRESS'; // <-- REPLACE WITH REAL ADDRESS

/**
 * ERC-20 ABI derived from your BitcoinSolar.sol (standard ERC-20).
 * If your implementation adds extra functions, you can extend this.
 */
const BLSR_ABI = [
  // Read functions
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',

  // Write functions
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',

  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
];

const provider = new ethers.JsonRpcProvider(RPC_URL);
const blsrContract = new ethers.Contract(BLSR_CONTRACT, BLSR_ABI, provider);

/**
 * Format BLSR nicely.
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
 * Read "yield" as the live BLSR balance of the active account.
 * This is real on-chain data from your ERC-20 contract.
 */
async function fetchRealYield(): Promise<{
  ok: boolean;
  account: string;
  raw: string;
  blsr: string;
  timestamp: number;
}> {
  const account = await getActiveAccount();

  const balance = (await blsrContract.balanceOf(account)) as ethers.BigNumberish;
  const raw = balance.toString();

  // Standard ERC-20: 18 decimals (adjust if your token uses a different value)
  const human = ethers.formatUnits(balance, 18);

  return {
    ok: true,
    account,
    raw,
    blsr: human,
    timestamp: Date.now(),
  };
}

/**
 * Harvest: for a pure ERC-20 token there is no "harvest" function.
 * If your yield is minted elsewhere, wire that contract here.
 * For now, we just return the current balance as a "harvest snapshot".
 */
async function performHarvest(): Promise<{
  ok: boolean;
  account: string;
  raw: string;
  blsr: string;
  timestamp: number;
}> {
  const yieldInfo = await fetchRealYield();
  return yieldInfo;
}

/**
 * Transaction insight handler – UI only.
 */
export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  const estimatedYield = formatYield('0.052'); // You can wire this to real data later.

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
