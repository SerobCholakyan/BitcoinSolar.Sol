import { OnTransactionHandler } from '@metamask/snaps-types';
import { panel, text, heading, divider } from '@metamask/snaps-ui';

export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  // Mock logic to simulate contract read
  const estimatedYield = "0.052 BTCS";

  return {
    content: panel([
      heading('BitcoinSolar Alert'),
      text('You are interacting with the Solar Network.'),
      divider(),
      text(`Estimated Yield to Harvest: **${estimatedYield}**`),
      text('Status: ☀️ High Intensity'),
    ]),
  };
};
