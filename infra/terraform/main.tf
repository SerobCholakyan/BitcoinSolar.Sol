terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
  required_version = ">= 1.3.0"
}

provider "digitalocean" {
  token = var.do_token
}

variable "do_token" {
  type      = string
  sensitive = true
}

variable "ssh_key_id" {
  type = string
}

variable "domain" {
  type = string
}

resource "digitalocean_droplet" "blsr_miner" {
  name   = "blsr-miner-node"
  region = "sfo3"
  size   = "s-1vcpu-2gb"
  image  = "ubuntu-22-04-x64"

  ssh_keys = [var.ssh_key_id]

  user_data = file("${path.module}/../bootstrap/cloud-init.yaml")
}

resource "digitalocean_domain" "blsr_domain" {
  name = var.domain
}

resource "digitalocean_record" "api_record" {
  domain = digitalocean_domain.blsr_domain.name
  type   = "A"
  name   = "api"
  value  = digitalocean_droplet.blsr_miner.ipv4_address
  ttl    = 300
}
