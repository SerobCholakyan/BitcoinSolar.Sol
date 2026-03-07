#!/bin/bash

set -e

apt update && apt upgrade -y
apt install -y git ufw nginx redis-server certbot python3-certbot-nginx curl

useradd -m -s /bin/bash aiorchestrator || true
mkdir -p /srv/ai-orchestrator
chown -R aiorchestrator:aiorchestrator /srv/ai-orchestrator

curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

sed -i 's/^supervised no/supervised systemd/' /etc/redis/redis.conf
sed -i 's/^bind .*/bind 127.0.0.1/' /etc/redis/redis.conf
sed -i 's/^protected-mode no/protected-mode yes/' /etc/redis/redis.conf
systemctl restart redis-server
