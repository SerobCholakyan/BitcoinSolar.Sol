

BitcoinSolar (BTCSOL)

A decentralized, energy‑inspired ERC‑20 token powering the BitcoinSolar ecosystem.

---

🌞 Overview

BitcoinSolar (BTCSOL) is an ERC‑20 token deployed on the Ethereum mainnet, designed to support a hybrid ecosystem of decentralized mining, staking, and community‑driven growth.
This repository contains the full source code for the token contract, miner dashboard, backend services, and deployment tools.

BitcoinSolar aims to merge clean‑energy concepts with blockchain incentives — creating a token that is simple, transparent, and built for long‑term scalability.

---

🚀 Features

Token

• ERC‑20 standard
• Fixed supply: 21,000,000 BTCSOL
• Fully audited OpenZeppelin base
• Minted to deployer at launch
• Mainnet‑ready contract


Ecosystem Components

• Miner Dashboard (web UI)
• Backend services (Python)
• Electron desktop miner
• Smart contract ABI + JS utilities
• Docker support
• Netlify deployment config


---

📦 Repository Structure

BitcoinSolar.Sol/
│
├── contracts/                 # Solidity smart contracts
├── packages/contracts/        # Additional contract modules + ABI
│
├── blsr-miner-website/        # Frontend UI for miners
├── website/                   # Public landing page
│
├── main.py                    # Backend service
├── security.py                # Security utilities
├── requirements.txt           # Python dependencies
│
├── main.js                    # Electron app entry
├── preload.js                 # Electron preload scripts
├── package.json               # Node/Electron config
│
├── docker-compose.yml         # Containerized deployment
├── .env.example               # Environment variable template
│
└── README.md                  # You are here


---

🔗 Smart Contract

Name: BitcoinSolar
Symbol: BTCSOL
Supply: 21,000,000
Standard: ERC‑20
Network: Ethereum Mainnet

Contract Source (simplified)

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BitcoinSolar is ERC20 {
    constructor() ERC20("BitcoinSolar", "BTCSOL") {
        _mint(msg.sender, 21_000_000 * 10 ** decimals());
    }
}


---

🛠️ Development

Install Dependencies

Node / Frontend

npm install


Python Backend

pip install -r requirements.txt


---

🧪 Testing

Use Hardhat, Foundry, or Remix to test the contract.
Example (Hardhat):

npx hardhat test


---

🚀 Deployment

Deploy via Remix

1. Open Remix
2. Upload BitcoinSolar.sol
3. Select compiler 0.8.x
4. Enable OpenZeppelin imports
5. Deploy using MetaMask
6. Verify on Etherscan


---

🌐 Frontend Deployment

The miner dashboard and landing page can be deployed via:

• Netlify
• Vercel
• GitHub Pages
• Docker containers


netlify.toml is included for instant deployment.

---

🧩 Miner Dashboard

The miner UI includes:

• Wallet connection
• Token balance display
• Miner activity
• Reward tracking
• Real‑time updates


---

🛡️ Security

• Built on OpenZeppelin audited libraries
• No owner‑controlled minting
• No hidden functions
• Fixed supply
• Public, transparent codebase


---

🤝 Contributing

Pull requests are welcome!
For major changes, please open an issue first to discuss what you’d like to modify.

---

📄 License

This project is licensed under the MIT License.

---

🌞 BitcoinSolar — Powering a Brighter Blockchain

If you’d like, I can also generate:

• A logo
• A whitepaper
• A tokenomics page
• A press‑ready launch announcement
• A website landing page
