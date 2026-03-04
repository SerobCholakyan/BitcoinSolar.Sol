"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useMetamask } from "./useMetamask";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

export function useTokenBalance(tokenAddress: string) {
  const { provider, address } = useMetamask();
  const [balance, setBalance] = useState<string | null>(null);
  const [symbol, setSymbol] = useState<string | null>(null);

  useEffect(() => {
    if (!provider || !address || !tokenAddress) return;

    (async () => {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
      const [rawBalance, decimals, sym] = await Promise.all([
        contract.balanceOf(address),
        contract.decimals(),
        contract.symbol()
      ]);
      const formatted = ethers.formatUnits(rawBalance, decimals);
      setBalance(formatted);
      setSymbol(sym);
    })();
  }, [provider, address, tokenAddress]);

  return { balance, symbol };
}
