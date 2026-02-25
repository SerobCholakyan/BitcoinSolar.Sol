#!/bin/bash

useradd --no-create-home prometheus

wget https://github.com/prometheus/prometheus/releases/latest/download/prometheus-2.52.0.linux-amd64.tar.gz
tar xvf prometheus-*.tar.gz

mkdir -p /etc/prometheus
mkdir -p /var/lib/prometheus

cp prometheus-*/prometheus /usr/local/bin/
cp prometheus-*/promtool /usr/local/bin/
cp -r prometheus-*/consoles /etc/prometheus
cp -r prometheus-*/console_libraries /etc/prometheus

cat <<EOF >/etc/prometheus/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']
EOF

cat <<EOF >/etc/systemd/system/prometheus.service
[Unit]
Description=Prometheus

[Service]
User=prometheus
ExecStart=/usr/local/bin/prometheus --config.file=/etc/prometheus/prometheus.yml

[Install]
WantedBy=default.target
EOF

systemctl daemon-reload
systemctl enable prometheus
systemctl start prometheus
