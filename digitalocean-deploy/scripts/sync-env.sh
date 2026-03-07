#!/bin/bash

cp /srv/ai-orchestrator/config/orchestrator.env /etc/default/orchestrator.env
chmod 600 /etc/default/orchestrator.env
chown aiorchestrator:aiorchestrator /etc/default/orchestrator.env

systemctl restart orchestrator
