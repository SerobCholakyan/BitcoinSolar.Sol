import os
import time
import secrets
import threading
from dataclasses import dataclass, field
from typing import Dict

from flask import Flask, jsonify, request
from flask_cors import CORS
from web3 import Web3
from web3.middleware import geth_poa_middleware
from dotenv import load_dotenv
import hashlib

load_dotenv()

app = Flask(__name__)
CORS(app)

# --- Blockchain config ---
RPC_URL = os.getenv("POLYGON_RPC", "")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")

w3 = Web3(Web3.HTTPProvider(RPC_URL)) if RPC_URL else None
if w3:
    w3.middleware_onion.inject(geth_poa_middleware, layer=0)

# Minimal ABI stub – replace with your real BitcoinSolar ABI
CONTRACT_ABI = [
    {
        "inputs": [{"internalType": "address", "name": "miner", "type": "address"}],
        "name": "executeMining",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "inputs": [],
        "name": "totalMined",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function",
    },
]

contract = (
    w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
    if w3 and CONTRACT_ADDRESS
    else None
)


@dataclass
class Job:
    job_id: str
    seed: bytes
    target: bytes
    created_at: float = field(default_factory=time.time)


jobs: Dict[str, Job] = {}


def new_job() -> Job:
    job_id = secrets.token_hex(8)
    seed = secrets.token_bytes(32)
    # Simple difficulty: leading zeros in target
    # Lower target => higher difficulty
    target_hex = "00000fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    target = bytes.fromhex(target_hex)
    job = Job(job_id=job_id, seed=seed, target=target)
    jobs[job_id] = job
    return job


def verify_share(job: Job, nonce_hex: str, hash_hex: str) -> bool:
    try:
        nonce_bytes = bytes.fromhex(nonce_hex)
        claimed_hash = bytes.fromhex(hash_hex)
    except ValueError:
        return False

    m = hashlib.sha256()
    m.update(job.seed)
    m.update(nonce_bytes)
    real_hash = m.digest()

    if real_hash != claimed_hash:
        return False

    return real_hash <= job.target


def credit_miner(address: str):
    # This is where you can:
    # - increment an internal DB counter
    # - and/or call executeMining(address) on-chain
    # For now, we just log.
    print(f"[BACKEND] Valid share credited to {address}")

    if not (w3 and contract and PRIVATE_KEY):
        return

    # Optional: call executeMining in background
    def _tx():
        try:
            acct = w3.eth.account.from_key(PRIVATE_KEY)
            tx = contract.functions.executeMining(address).build_transaction(
                {
                    "from": acct.address,
                    "nonce": w3.eth.get_transaction_count(acct.address, "pending"),
                   
