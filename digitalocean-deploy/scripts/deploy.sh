#!/bin/bash

set -e

cd /srv/ai-orchestrator/app

git pull origin main
npm ci
npm run build

systemctl restart orchestrator
echo "Deployment complete."
