#!/bin/bash
set -euo pipefail

NODE_EXPORTER_VERSION="1.7.0"
ARCH="linux-amd64"
TARBALL="node_exporter-${NODE_EXPORTER_VERSION}.${ARCH}.tar.gz"
URL="https://github.com/prometheus/node_exporter/releases/download/v${NODE_EXPORTER_VERSION}/${TARBALL}"

id -u node_exporter &>/dev/null || useradd --no-create-home --shell /usr/sbin/nologin node_exporter

cd /tmp
wget -q "$URL"
tar xf "$TARBALL"
cp "node_exporter-${NODE_EXPORTER_VERSION}.${ARCH}/node_exporter" /usr/local/bin/

rm -rf "/tmp/node_exporter-${NODE_EXPORTER_VERSION}.${ARCH}" "/tmp/${TARBALL}"

cat <<EOF >/etc/systemd/system/node_exporter.service
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=node_exporter
ExecStart=/usr/local/bin/node_exporter
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable node_exporter
systemctl start node_exporter
