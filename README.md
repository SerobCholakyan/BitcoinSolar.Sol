🌞 BitcoinSolar — BLSR Mining Ecosystem

This repository contains the complete mining stack for the BitcoinSolar (BLSR) network:

Native Miner (Rust) — performs real PoW‑style hashing and submits shares

Mining Backend / Pool Server (Python) — issues work, validates shares, triggers on‑chain rewards

Web Mining Dashboard (HTML/JS) — wallet connect, stats, mining UX

Together, these components form a fully functional, Unmineable‑style mining system designed specifically for BLSR.

📁 Repository Structure

BitcoinSolar.Sol/
│
├── blsr-native-miner/        # Rust-based native miner (real hashing)
│   ├── Cargo.toml
│   └── src/
│       └── main.rs
│
├── blsr-miner-backend/       # Mining pool backend (Python + Flask)
│   ├── app.py
│   ├── requirements.txt
│   └── .env.example
│
└── blsr-miner-website/       # Web mining dashboard (HTML + JS)
    ├── index.html
    ├── style.css
    ├── api.js
    └── app.js

⚙️ 1. Native Miner (Rust)

The native miner performs real SHA‑256 hashing work and submits valid shares to the backend.

🔧 Build & Run

cd blsr-native-miner
cargo build --release
./target/release/blsr-native-miner --address 0xYOUR_ADDRESS --backend http://localhost:8080 --threads 4

🧠 How it works

Fetches work from /work

Hashes seed || nonce using SHA‑256

Compares hash to target difficulty

Submits valid shares to /share

Backend verifies and credits miner

🖥️ 2. Mining Backend (Python)

The backend acts as a mining pool server:

Issues work (/work)

Verifies shares (/share)

Credits miners

Can call executeMining(address) on your BLSR contract

🔧 Install & Run

cd blsr-miner-backend
pip install -r requirements.txt
cp .env.example .env
# Fill in RPC, contract address, and private key
python app.py

🔌 API Endpoints

Endpoint

Description

GET /work

Issues new mining job

POST /share

Validates submitted share

GET /stats

Returns basic pool stats

🌐 3. Web Mining Dashboard

A lightweight, modern dashboard for:

Wallet connect (MetaMask)

Viewing difficulty, jobs, mining status

Triggering mining sessions

Linking users to the native miner

🔧 Run Locally

Just open:

blsr-miner-website/index.html

Or serve it:

cd blsr-miner-website
python3 -m http.server 3000

🧠 How it works

Connects to MetaMask

Displays backend stats

Sends mining signals

Designed to pair with the native miner

🔗 End‑to‑End Flow

Native Miner → Backend → Smart Contract → Dashboard

1. Miner requests work

GET /work

2. Miner performs hashing

SHA‑256(seed || nonce)

3. Miner submits share

POST /share

4. Backend verifies

recomputes hash

checks difficulty

credits miner

5. Backend optionally calls

executeMining(address) on-chain

6. Dashboard displays stats

Live mining status, difficulty, jobs, etc.

🛡️ Security Notes

The native miner never stores private keys

Backend private key must be kept server-side only

.env should never be committed

All RPC and contract interactions are isolated to backend

🚀 Roadmap

Add persistent miner stats (SQLite/Postgres)

Add worker hashrate reporting

Add WebSocket live updates

Add payout history

Add downloadable installer for native miner

Add GPU mining module (optional future)

🤝 Contributing

Pull requests are welcome.For major changes, open an issue first to discuss what you’d like to modify.
