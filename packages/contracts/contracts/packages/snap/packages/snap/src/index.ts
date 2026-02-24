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

/**
 * ---------------------------------------------------------
 * Utility: Format BLSR yield nicely
 * ---------------------------------------------------------
 */
function formatYield(amount: string | number): string {
  return `${amount} BLSR`;
}

/**
 * ---------------------------------------------------------
 * Transaction Insight Handler
 * Triggered when user signs a transaction
 * ---------------------------------------------------------
 */
export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  // Placeholder logic — replace with real contract read
  const estimatedYield = formatYield('0.052');

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
 * ---------------------------------------------------------
 * RPC Handler
 * Called by your frontend or cronjob
 * ---------------------------------------------------------
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  switch (request.method) {
    /**
     * -----------------------------------------------------
     * Check yield (used by cronjob + UI)
     * -----------------------------------------------------
     */
    case 'blsr_checkYield': {
      // Placeholder — replace with real RPC call to Polygon
      const mockYield = formatYield('0.128');

      return panel([
        heading('☀️ BitcoinSolar Yield Check'),
        text(`Your estimated solar yield: **${mockYield}**`),
        divider(),
        text('Keep harvesting to maximize your solar rewards.'),
      ]);
    }

    /**
     * -----------------------------------------------------
     * Harvest yield (future expansion)
     * -----------------------------------------------------
     */
    case 'blsr_harvest': {
      // Placeholder — real version will call your backend or contract
      const mockTx = '0x1234abcd...';

      return panel([
        heading('🌞 Harvest Successful'),
        text('Your solar yield has been harvested.'),
        divider(),
        text(`Transaction Hash:`),
        copyable(mockTx),
      ]);
    }

    /**
     * -----------------------------------------------------
     * Unknown method
     * -----------------------------------------------------
     */
    default:
      throw new Error(`Unknown RPC method: ${request.method}`);
  }
};
