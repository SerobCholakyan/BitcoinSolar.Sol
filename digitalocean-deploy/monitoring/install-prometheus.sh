#!/bin/bash
set -euo pipefail

PROMETHEUS_VERSION="2.52.0"
ARCH="linux-amd64"
TARBALL="prometheus-${PROMETHEUS_VERSION}.${ARCH}.tar.gz"
URL="https://github.com/prometheus/prometheus/releases/download/v${PROMETHEUS_VERSION}/${TARBALL}"

id -u prometheus &>/dev/null || useradd --no-create-home --shell /usr/sbin/nologin prometheus

cd /tmp
wget -q "$URL"
tar xf "$TARBALL"

mkdir -p /etc/prometheus /var/lib/prometheus

cp "prometheus-${PROMETHEUS_VERSION}.${ARCH}/prometheus" /usr/local/bin/
cp "prometheus-${PROMETHEUS_VERSION}.${ARCH}/promtool" /usr/local/bin/
cp -r "prometheus-${PROMETHEUS_VERSION}.${ARCH}/consoles" /etc/prometheus/
cp -r "prometheus-${PROMETHEUS_VERSION}.${ARCH}/console_libraries" /etc/prometheus/

chown -R prometheus:prometheus /etc/prometheus /var/lib/prometheus

cat <<EOF >/etc/prometheus/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']

  - job_name: 'blsr-backend'
    static_configs:
      - targets: ['localhost:8080']
    metrics_path: '/metrics'
EOF

cat <<EOF >/etc/systemd/system/prometheus.service
[Unit]
Description=Prometheus
After=network.target

[Service]
User=prometheus
ExecStart=/usr/local/bin/prometheus --config.file=/etc/prometheus/prometheus.yml --storage.tsdb.path=/var/lib/prometheus
Restart=always

[Install]
WantedBy=multi-user.target
EOF

rm -rf "/tmp/prometheus-${PROMETHEUS_VERSION}.${ARCH}" "/tmp/${TARBALL}"

systemctl daemon-reload
systemctl enable prometheus
systemctl start prometheus
