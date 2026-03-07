#!/bin/bash
systemctl restart orchestrator
systemctl status orchestrator --no-pager
