// ai-orchestrator/src/executor/txBuilder.ts

import { ethers } from "ethers";

export class TxBuilder {
  constructor() {}

  // -----------------------------
  // ERC20 Approve
  // -----------------------------
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

  // -----------------------------
  // ERC20 Transfer
  // -----------------------------
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

  // -----------------------------
  // Uniswap V2 Swap (ETH → Token)
  // -----------------------------
  buildUniswapV2SwapETHForTokens(router: string, tokenOut: string, amountIn: bigint) {
    const iface = new ethers.Interface([
      "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)"
    ]);

    const path = ["0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", tokenOut];

    return {
      to: router,
      value: amountIn,
      data: iface.encodeFunctionData("swapExactETHForTokens", [
        0, // amountOutMin
        path,
        "0x0000000000000000000000000000000000000000", // replaced by MetaMask
        Math.floor(Date.now() / 1000) + 300
      ])
    };
  }

  // -----------------------------
  // Seaport NFT Buy (scaffold)
  // -----------------------------
  buildSeaportBuy(order: any) {
    return {
      to: order.seaportAddress,
      data: order.calldata,
      value: order.price
    };
  }

  // -----------------------------
  // Blur NFT Buy (scaffold)
  // -----------------------------
  buildBlurBuy(order: any) {
    return {
      to: order.exchange,
      data: order.calldata,
      value: order.price
    };
  }
}
