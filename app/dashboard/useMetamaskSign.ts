"use client";

import { useMetamask } from "./useMetamask";
import { ethers } from "ethers";

export function useMetamaskSign() {
  const { provider, address } = useMetamask();

  const signMessage = async (message: string) => {
    if (!provider || !address) throw new Error("Wallet not connected");
    const signer = await provider.getSigner();
    return signer.signMessage(message);
  };

  const signTypedData = async (domain: any, types: any, value: any) => {
    if (!provider || !address) throw new Error("Wallet not connected");
    const signer = await provider.getSigner();
    // @ts-ignore
    return signer._signTypedData(domain, types, value);
  };

  return { address, signMessage, signTypedData };
}
