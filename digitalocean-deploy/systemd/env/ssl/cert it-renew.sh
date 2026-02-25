#!/bin/bash
certbot renew --quiet
systemctl reload nginx
