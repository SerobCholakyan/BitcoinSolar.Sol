#!/bin/bash

echo "Updating system..."
sudo apt update && sudo apt upgrade -y

echo "Installing Docker..."
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

echo "Installing Docker Compose..."
sudo apt install docker-compose-plugin -y

echo "Pulling repo..."
git clone https://github.com/SerobCholakyan/BitcoinSolar.Sol || true

echo "Copying deployment files..."
cp -r digitalocean-deploy/* /root/blsr-deploy/

cd /root/blsr-deploy

echo "Starting services..."
docker compose up -d --build

echo "Deployment complete."
