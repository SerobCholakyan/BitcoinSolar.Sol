"use client";

import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useMetamask() {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  useEffect(() => {
    if (!window.ethereum) return;

    const p = new BrowserProvider(window.ethereum);
    setProvider(p);

    window.ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
      if (accounts.length > 0) setAddress(accounts[0]);
    });

    const handleAccountsChanged = (accounts: string[]) => {
      setAddress(accounts[0] ?? null);
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  const connect = async () => {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });
    setAddress(accounts[0]);
  };

  return { address, provider, connect };
}
