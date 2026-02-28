// blsr-contract.js
// Production-ready contract loader for BitcoinSolar (BLSR)

import { ethers } from "ethers";
import BLSR_ABI from "./BitcoinSolar.json" assert { type: "json" };

// Real deployed contract address
export const BLSR_ADDRESS = "0xddaAd340b0f1Ef65169Ae5E41A8b10776a75482d";

/**
 * Returns a connected BitcoinSolar contract instance.
 * @param {ethers.Provider | ethers.Signer} providerOrSigner
 */
export function getBlsrContract(providerOrSigner) {
  if (!providerOrSigner) {
    throw new Error("Provider or signer is required to initialize BLSR contract");
  }

  return new ethers.Contract(
    BLSR_ADDRESS,
    BLSR_ABI,
    providerOrSigner
  );
}
