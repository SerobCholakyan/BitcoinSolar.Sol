#!/bin/bash
set -euo pipefail

REPO_DIR="/root/BitcoinSolar.Sol"

echo "Updating system..."
sudo apt update && sudo apt upgrade -y

echo "Installing Docker..."
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker "$USER"

echo "Installing Docker Compose..."
sudo apt install -y docker-compose-plugin

echo "Cloning/updating repo..."
if [ -d "$REPO_DIR" ]; then
    cd "$REPO_DIR" && git pull
else
    git clone https://github.com/SerobCholakyan/BitcoinSolar.Sol.git "$REPO_DIR"
fi

cd "$REPO_DIR/digitalocean-deploy"

if [ ! -f ./env/backend.env ]; then
    echo "ERROR: Create ./env/backend.env from ./env/backend.env.example before deploying."
    exit 1
fi

echo "Starting services..."
docker compose up -d --build

echo "Deployment complete."
