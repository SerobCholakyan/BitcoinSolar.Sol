# BitcoinSolar.Sol

A sovereign, cloud-native mining and governance platform.

## Components

- Smart contracts
- Python backend
- Rust native miner
- Miner dashboard
- Operator panel
- Kubernetes deployment
- Nginx reverse proxy
- CI/CD pipelines

## Setup

Copy `.env.example` → `.env` in each service.

## CI/CD

GitHub Actions:

- contracts-ci.yml
- backend-deploy.yml
- native-miner-release.yml
- dashboard-deploy.yml
- infra-apply.yml
