export const connectSnap = async () => {
  await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      'local:http://localhost:8080': {} // Local dev URL
    },
  });
};

export const harvestSolar = async (contractAddress: string) => {
  // Standard Ethers/Viem call to the contract
  console.log("Triggering harvest on chain...");
};
