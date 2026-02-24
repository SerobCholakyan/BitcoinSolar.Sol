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

function formatYield(amount: string | number): string {
  return `${amount} BLSR`;
}

export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
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

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  switch (request.method) {
    case 'blsr_checkYield': {
      const mockYield = formatYield('0.128');

      return panel([
        heading('☀️ BitcoinSolar Yield Check'),
        text(`Your estimated solar yield: **${mockYield}**`),
        divider(),
        text('Keep harvesting to maximize your solar rewards.'),
      ]);
    }

    case 'blsr_harvest': {
      const mockTx = '0x1234abcd...';

      return panel([
        heading('🌞 Harvest Successful'),
        text('Your solar yield has been harvested.'),
        divider(),
        text('Transaction Hash:'),
        copyable(mockTx),
      ]);
    }

    default:
      throw new Error(`Unknown RPC method: ${request.method}`);
  }
};
