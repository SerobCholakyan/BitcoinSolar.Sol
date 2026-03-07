#!/bin/bash

echo "Redis:"
redis-cli ping

echo "Systemd:"
systemctl is-active orchestrator

echo "HTTP health:"
curl -s http://127.0.0.1:3100/health || echo "No health endpoint"
