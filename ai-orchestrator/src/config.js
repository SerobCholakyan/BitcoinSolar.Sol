export type ServiceName =
  | "BitcoinSolarOrg"
  | "BitcoinSolarWebApp"
  | "BlsrMining"
  | "BlsrMinting"
  | "BlsrMiningScript"
  | "BlsrMetaMask";

export interface ServiceConfig {
  name: ServiceName;
  url?: string;
  repoPath?: string;
  description: string;
}

export const services: ServiceConfig[] = [
  {
    name: "BitcoinSolarOrg",
    url: "https://bitcoinsolar.org",
    repoPath: "blsr-miner-website",
    description: "Main marketing / landing surface for BitcoinSolar."
  },
  {
    name: "BitcoinSolarWebApp",
    url: "https://app.bitcoinsolar.org",
    repoPath: "blsr-operator-panel",
    description: "Operator / miner dashboard web app."
  },
  {
    name: "BlsrMining",
    repoPath: "blsr-native-miner",
    description: "Native miner binaries and configs."
  },
  {
    name: "BlsrMinting",
    repoPath: "blsr-miner-backend",
    description: "On-chain minting backend using blsr-mint.js and ABI."
  },
  {
    name: "BlsrMiningScript",
    repoPath: "blsr-miner-backend",
    description: "Python/JS scripts that watch miners and trigger mints."
  },
  {
    name: "BlsrMetaMask",
    repoPath: "Packages/Contracts/Packages/snap",
    description: "MetaMask Snap integration for BitcoinSolar."
  }
];
