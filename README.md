# BitcoinSolar.Sol

BitcoinSolar is a sovereign, cloud-native mining and governance platform with:

- Solidity contracts
- Native Rust miner
- Python mining backend
- Web dashboard
- Operator panel
- Kubernetes + Nginx deployment

## Structure

- `contracts/` – BitcoinSolar smart contracts
- `blsr-miner-backend/` – Python backend for mining coordination
- `blsr-native-miner/` – Rust native miner
- `blsr-miner-website/` – Miner dashboard (frontend)
- `blsr-operator-panel/` – Operator control panel
- `infra/` – Kubernetes manifests
- `nginx/` – Nginx configs
- `.github/workflows/` – CI/CD pipelines

## Environment

Each service has its own `.env.example`. Copy and fill:

```bash
cp blsr-miner-backend/.env.example blsr-miner-backend/.env
cp blsr-miner-website/.env.example blsr-miner-website/.env
cp blsr-operator-panel/.env.example blsr-operator-panel/.env
cp blsr-native-miner/.env.example blsr-native-miner/.env
