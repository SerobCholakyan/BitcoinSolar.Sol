BitcoinSolar.Sol

A sovereign, cloud‑native mining, orchestration, and governance platform powering decentralized compute and capital allocation.

---

Platform Overview

BitcoinSolar is a modular ecosystem composed of smart contracts, orchestrators, miners, dashboards, and operator tooling. The system is designed for sovereign execution, deterministic orchestration, and trust‑minimized mining operations across cloud, bare‑metal, and native environments.

The repository contains all major components required to run the BitcoinSolar network end‑to‑end.

---

Architecture

Core Components

• Smart Contracts
Solidity contracts governing identity, staking, mining rights, rewards, and governance.
• AI Orchestrator
TypeScript/Python hybrid orchestrator responsible for agent scheduling, health monitoring, and rule‑based execution.
• Python Backend
REST API and worker services supporting miner registration, telemetry ingestion, and operator actions.
• Rust Native Miner
High‑performance native miner optimized for deterministic workloads and low‑latency execution.
• Miner Dashboard
Web interface for miners to monitor performance, rewards, and node health.
• Operator Panel
Administrative UI for orchestrator control, agent scheduling, and governance actions.
• Kubernetes Deployment
Full manifests for orchestrator, backend, dashboards, and supporting services.
• Nginx Reverse Proxy
Unified ingress layer for all web‑facing components.
• CI/CD Pipelines
GitHub Actions workflows for contracts, backend, miner releases, and dashboard deployments.


---

Repository Structure

.
├── .github/workflows
├── Packages/Contracts
├── ai-orchestrator
├── app
├── blsr-miner-backend
├── blsr-miner-website
├── blsr-native-miner
├── blsr-operator-panel
├── contracts
├── digitalocean-deploy
└── README.md


---

Deployment Model

1. Environment Setup

Each service includes an .env.example.
Copy and configure:

cp .env.example .env


Required values typically include:

• RPC endpoints
• Wallet private keys (operator)
• Database URLs
• Orchestrator intervals
• Miner identity keys
• Dashboard API URLs


2. Kubernetes

The platform is designed for cloud‑native deployment:

• Orchestrator as a stateful service
• Backend as scalable API pods
• Miner dashboard and operator panel as stateless web deployments
• Nginx ingress for routing
• Secrets stored in K8s Secret Manager


3. CI/CD

GitHub Actions workflows 

• contracts-ci.yml
• backend-deploy.yml
• native-miner-release.yml
• dashboard-deploy.yml
• infra-apply.yml


These automate:

• Contract compilation/testing
• Backend deployment
• Miner binary releases
• Dashboard builds
• Infrastructure updates


---

Component Details

Smart Contracts

Located in:

• Packages/Contracts
• contracts/


Includes:

• Identity registry
• Miner staking
• Reward distribution
• Governance primitives


AI Orchestrator

Located in:

• ai-orchestrator/


Responsibilities:

• Agent scheduling
• Health checks
• Intent queue execution
• Rule‑based capital allocation
• Telemetry ingestion


Python Backend

Located in:

• blsr-miner-backend/


Provides:

• Miner registration
• Telemetry API
• Reward calculation endpoints
• Operator actions


Rust Native Miner

Located in:

• blsr-native-miner/


Features:

• Deterministic mining loop
• Low‑latency execution
• Native OS integration
• Secure identity signing


Miner Dashboard

Located in:

• blsr-miner-website/


Provides:

• Miner performance charts
• Reward history
• Node health indicators


Operator Panel

Located in:

• blsr-operator-panel/


Provides:

• Orchestrator control
• Agent scheduling
• Governance actions
• System health overview


---

Local Development

Prerequisites

• Node.js 20+
• Python 3.10+
• Rust stable
• Docker + Docker Compose
• Foundry (for contracts)


Install Dependencies

npm install
pip install -r requirements.txt
cargo build


Run Services

Each service includes its own start script:

npm run dev
python main.py
cargo run


---

Releases
## Release: v0.1.0‑alpha — Genesis Release

This is the first public alpha release of the BitcoinSolar.Sol contract suite. It establishes the foundation for sovereign compute orchestration, miner coordination, and deterministic capital allocation.

### Included in this release
- Core contract architecture for orchestrator and miner coordination
- Initial emission curve logic and reward distribution scaffolding
- Intent queue and transaction builder foundations
- Modular structure for future expansion of governance and operator tooling
- Full ABI, bytecode, and flattened contract outputs (available in the Release assets)

### Status
This is an **alpha**, intended for architecture validation, ecosystem alignment, and early operator experimentation.  
Not production‑ready. Interfaces and modules may evolve as the orchestrator and miner layers mature.

### Release Assets
The GitHub Release includes:
- `BitcoinSolar.Sol-artifacts-v0.1.0-alpha.zip`
- `BitcoinSolar.Sol-abi-v0.1.0-alpha.json`
- `BitcoinSolar.Sol-bytecode-v0.1.0-alpha.json`
- `BitcoinSolar.Sol-flattened-v0.1.0-alpha.sol`

These binaries support integrators, auditors, and orchestrator‑level automation.

---

## Versioning Strategy
BitcoinSolar follows semantic versioning with pre‑release identifiers:
- `alpha` for early architecture and interface evolution
- `beta` for stability and integration testing
- `rc` for release candidates
- `stable` for production‑ready deployments

All releases are immutable once published.


---

Contributors

• SerobCholakyan

---
