// ai-orchestrator/src/executor/txBuilder.ts

import { ethers } from "ethers";

export class TxBuilder {
  constructor() {}

  // -------------------------------------------------
  // ERC-20 approve(spender, amount)
  // -------------------------------------------------
  buildERC20Approve(token: string, spender: string, amount: bigint) {
    const iface = new ethers.Interface([
      "function approve(address spender, uint256 amount)"
    ]);

    return {
      to: token,
      data: iface.encodeFunctionData("approve", [spender, amount]),
      value: "0x0"
    };
  }

  // -------------------------------------------------
  // ERC-20 transfer(to, amount)
  // -------------------------------------------------
  buildERC20Transfer(token: string, to: string, amount: bigint) {
    const iface = new ethers.Interface([
      "function transfer(address to, uint256 amount)"
    ]);

    return {
      to: token,
      data: iface.encodeFunctionData("transfer", [to, amount]),
      value: "0x0"
    };
  }

  // -------------------------------------------------
  // Uniswap V2: swapExactETHForTokens
  // (ETH/MATIC → ERC-20; you’ll set router + path)
  // -------------------------------------------------
  buildUniswapV2SwapETHForTokens(
    router: string,
    tokenOut: string,
    amountIn: bigint,
    recipient: string
  ) {
    const iface = new ethers.Interface([
      "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)"
    ]);

    const path = [
      "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // placeholder “native” token
      tokenOut
    ];

    const deadline = Math.floor(Date.now() / 1000) + 300; // +5 minutes

    return {
      to: router,
      value: amountIn,
      data: iface.encodeFunctionData("swapExactETHForTokens", [
        0,        // amountOutMin (you can tighten this in UI)
        path,
        recipient,
        deadline
      ])
    };
  }

  // -------------------------------------------------
  // Seaport NFT buy (scaffold)
  // You pass in already-built order data from your infra.
  // -------------------------------------------------
  buildSeaportBuy(order: {
    seaportAddress: string;
    calldata: string;
    price: string;
  }) {
    return {
      to: order.seaportAddress,
      data: order.calldata,
      value: order.price
    };
  }

  // -------------------------------------------------
  // Blur NFT buy (scaffold)
  // -------------------------------------------------
  buildBlurBuy(order: {
    exchange: string;
    calldata: string;
    price: string;
  }) {
    return {
      to: order.exchange,
      data: order.calldata,
      value: order.price
    };
  }
}
