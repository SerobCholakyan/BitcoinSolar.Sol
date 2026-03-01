import type { OnRpcRequestHandler } from "@metamask/snaps-types";

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  switch (request.method) {
    case "ping":
      return "BitcoinSolar Snap is alive";
    default:
      throw new Error(`Method not found: ${request.method}`);
  }
};
