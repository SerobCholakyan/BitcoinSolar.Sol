import os
import time
import secrets
import threading
import sqlite3
import hashlib
from dataclasses import dataclass, field
from typing import Dict

from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from web3 import Web3
from web3.middleware import geth_poa_middleware
from dotenv import load_dotenv
from prometheus_client import (
    Counter,
    Gauge,
    generate_latest,
    CONTENT_TYPE_LATEST,
)

load_dotenv()

app = Flask(__name__)
CORS(app)

RPC_URL = os.getenv("POLYGON_RPC", "")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")

MINER_API_KEYS = set(
    k.strip() for k in os.getenv("MINER_API_KEYS", "").split(",") if k.strip()
)

w3 = Web3(Web3.HTTPProvider(RPC_URL)) if RPC_URL else None
if w3:
    w3.middleware_onion.inject(geth_poa_middleware, layer=0)

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

DB_PATH = "database.db"


def db():
    return sqlite3.connect(DB_PATH, check_same_thread=False)


def init_db():
    conn = db()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS payouts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            address TEXT NOT NULL,
            worker TEXT,
            amount TEXT NOT NULL,
            tx_hash TEXT,
            timestamp INTEGER
        )
        """
    )
    conn.commit()
    conn.close()


init_db()


@dataclass
class Job:
    job_id: str
    seed: bytes
    target: bytes
    created_at: float = field(default_factory=time.time)


jobs: Dict[str, Job] = {}
_seen_miners = set()

BLSR_JOBS_ISSUED = Counter("blsr_jobs_issued_total", "Total mining jobs issued")

BLSR_SHARES_SUBMITTED = Counter(
    "blsr_shares_submitted_total", "Total shares submitted", ["result"]
)

BLSR_MINER_SHARES = Counter(
    "blsr_miner_shares_total",
    "Shares submitted per miner",
    ["address", "worker", "result"],
)

BLSR_MINER_LAST_SHARE = Gauge(
    "blsr_miner_last_share_ts",
    "Unix timestamp of last share per miner/worker",
    ["address", "worker"],
)

BLSR_MINERS = Gauge("blsr_miners_connected", "Number of distinct miners seen")

BLSR_PAYOUTS = Counter(
    "blsr_payouts_total",
    "Total payouts sent",
    ["address", "worker"],
)

BLSR_LAST_EXEC_TX = Gauge(
    "blsr_last_execute_mining_ts", "Unix timestamp of last executeMining tx"
)


def require_api_key():
    if not MINER_API_KEYS:
        return True
    key = request.headers.get("X-API-Key")
    return key in MINER_API_KEYS


def new_job() -> Job:
    job_id = secrets.token_hex(8)
    seed = secrets.token_bytes(32)
    target_hex = "00000fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    target = bytes.fromhex(target_hex)
    job = Job(job_id=job_id, seed=seed, target=target)
    jobs[job_id] = job
    BLSR_JOBS_ISSUED.inc()
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


def record_payout(address: str, worker: str, amount: str, tx_hash_hex: str):
    conn = db()
    conn.execute(
        "INSERT INTO payouts (address, worker, amount, tx_hash, timestamp) VALUES (?, ?, ?, ?, ?)",
        (address, worker, amount, tx_hash_hex, int(time.time())),
    )
    conn.commit()
    conn.close()
    BLSR_PAYOUTS.labels(address=address, worker=worker).inc()


def credit_miner(address: str, worker: str):
    global _seen_miners
    if address not in _seen_miners:
        _seen_miners.add(address)
        BLSR_MINERS.set(len(_seen_miners))

    if not (w3 and contract and PRIVATE_KEY):
        print("[BACKEND] No blockchain connection; skipping payout.")
        return

    def _tx():
        try:
            acct = w3.eth.account.from_key(PRIVATE_KEY)
            amount = "1"

            tx = contract.functions.executeMining(address).build_transaction(
                {
                    "from": acct.address,
                    "nonce": w3.eth.get_transaction_count(acct.address, "pending"),
                    "gasPrice": w3.eth.gas_price,
                }
            )
            tx["gas"] = w3.eth.estimate_gas(tx)

            signed = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
            tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
            tx_hash_hex = tx_hash.hex()

            print(f"[BACKEND] executeMining sent: {tx_hash_hex}")
            BLSR_LAST_EXEC_TX.set(time.time())

            record_payout(address, worker, amount, tx_hash_hex)

        except Exception as e:
            print(f"[BACKEND] executeMining failed: {e}")

    threading.Thread(target=_tx, daemon=True).start()


@app.route("/work", methods=["GET"])
def get_work():
    if not require_api_key():
        return jsonify({"status": "error", "message": "Unauthorized"}), 401

    job = new_job()
    return jsonify(
        {
            "job_id": job.job_id,
            "seed": job.seed.hex(),
            "target": job.target.hex(),
        }
    )


@app.route("/share", methods=["POST"])
def submit_share():
    if not require_api_key():
        return jsonify({"status": "error", "message": "Unauthorized"}), 401

    data = request.get_json(silent=True) or {}
    job_id = data.get("job_id")
    address = data.get("address")
    nonce = data.get("nonce")
    hash_hex = data.get("hash")
    worker = data.get("worker") or "default"

    if not job_id or not address or not nonce or not hash_hex:
        BLSR_SHARES_SUBMITTED.labels(result="invalid").inc()
        if address:
            BLSR_MINER_SHARES.labels(
                address=address, worker=worker, result="invalid"
            ).inc()
        return jsonify({"status": "error", "message": "Missing fields"}), 400

    job = jobs.get(job_id)
    if not job:
        BLSR_SHARES_SUBMITTED.labels(result="invalid").inc()
        BLSR_MINER_SHARES.labels(
            address=address, worker=worker, result="invalid"
        ).inc()
        return jsonify({"status": "error", "message": "Unknown job"}), 400

    if not verify_share(job, nonce, hash_hex):
        BLSR_SHARES_SUBMITTED.labels(result="invalid").inc()
        BLSR_MINER_SHARES.labels(
            address=address, worker=worker, result="invalid"
        ).inc()
        return jsonify({"status": "error", "message": "Invalid share"}), 400

    BLSR_SHARES_SUBMITTED.labels(result="valid").inc()
    BLSR_MINER_SHARES.labels(
        address=address, worker=worker, result="valid"
    ).inc()
    BLSR_MINER_LAST_SHARE.labels(address=address, worker=worker).set(time.time())

    credit_miner(address, worker)
    return jsonify({"status": "ok", "message": "Share accepted"})


@app.route("/stats", methods=["GET"])
def stats():
    total_jobs = len(jobs)
    total_mined = None
    if contract:
        try:
            total_mined = contract.functions.totalMined().call()
        except Exception:
            total_mined = None

    return jsonify(
        {
            "total_jobs": total_jobs,
            "total_mined": str(total_mined) if total_mined is not None else None,
            "miners": len(_seen_miners),
        }
    )


@app.route("/payouts/<address>", methods=["GET"])
def get_payouts(address):
    conn = db()
    rows = conn.execute(
        "SELECT worker, amount, tx_hash, timestamp FROM payouts WHERE address = ? ORDER BY timestamp DESC",
        (address,),
    ).fetchall()
    conn.close()

    return jsonify(
        [
            {
                "worker": r[0],
                "amount": r[1],
                "tx_hash": r[2],
                "timestamp": r[3],
            }
            for r in rows
        ]
    )


@app.route("/metrics", methods=["GET"])
def metrics():
    return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
