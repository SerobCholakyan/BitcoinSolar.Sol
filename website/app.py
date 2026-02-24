import os
import logging
from datetime import datetime

from flask import Flask, render_template, request, jsonify
from security import SecurityModule  # Your custom security module

try:
    from flask_cors import CORS
except ImportError:
    CORS = None

# -------------------------------------------------------------
# Flask App Setup
# -------------------------------------------------------------
app = Flask(__name__, template_folder="templates", static_folder="static")

if CORS:
    CORS(app)

# -------------------------------------------------------------
# Logging Setup
# -------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger("BitcoinSolar-WebAPI")

# -------------------------------------------------------------
# Environment Config
# -------------------------------------------------------------
API_VERSION = os.getenv("BLSR_API_VERSION", "1.0")
NODE_NAME = os.getenv("BLSR_NODE_NAME", "LYNNIC_ACTIVE")
NETWORK = os.getenv("BLSR_NETWORK", "polygon-mainnet")


# -------------------------------------------------------------
# Routes
# -------------------------------------------------------------
@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "OK",
        "node": NODE_NAME,
        "api_version": API_VERSION,
        "network": NETWORK,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    })


@app.route("/api/mine", methods=["POST"])
def mine():
    """
    Legacy/simple endpoint: validate node and return a basic success.
    """
    try:
        data = request.get_json(force=True)
    except Exception:
        return jsonify({"error": "INVALID_JSON"}), 400

    if not data:
        return jsonify({"error": "EMPTY_PAYLOAD"}), 400

    address = data.get("address")
    if not address:
        return jsonify({"error": "MISSING_ADDRESS"}), 400

    if not SecurityModule.validate_evm_address(address):
        logger.warning(f"Rejected invalid address: {address}")
        return jsonify({"error": "INVALID_NODE_ID"}), 400

    logger.info(f"Node validated via /api/mine: {address}")

    return jsonify({
        "status": "SUCCESS",
        "node": NODE_NAME,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "api_version": API_VERSION
    })


@app.route("/api/submit", methods=["POST"])
def submit_share():
    """
    Miner submits a 'share' or proof-of-work/proof-of-yield sample.
    This is where you'd plug in real difficulty / scoring logic.
    """
    try:
        data = request.get_json(force=True)
    except Exception:
        return jsonify({"error": "INVALID_JSON"}), 400

    if not data:
        return jsonify({"error": "EMPTY_PAYLOAD"}), 400

    address = data.get("address")
    share = data.get("share")

    if not address or not share:
        return jsonify({"error": "MISSING_FIELDS"}), 400

    if not SecurityModule.validate_evm_address(address):
        logger.warning(f"Rejected invalid address in /api/submit: {address}")
        return jsonify({"error": "INVALID_NODE_ID"}), 400

    # Placeholder: validate share (hash, difficulty, etc.)
    valid_share = SecurityModule.validate_share(share)
    if not valid_share:
        logger.info(f"Invalid share from {address}")
        return jsonify({"status": "REJECTED", "reason": "INVALID_SHARE"}), 400

    logger.info(f"Accepted share from {address}")

    return jsonify({
        "status": "ACCEPTED",
        "address": address,
        "score": 1,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    })


@app.route("/api/reward", methods=["POST"])
def reward():
    """
    Backend endpoint to simulate or trigger a reward event.
    In production, this would talk to your BLSR minter backend.
    """
    try:
        data = request.get_json(force=True)
    except Exception:
        return jsonify({"error": "INVALID_JSON"}), 400

    if not data:
        return jsonify({"error": "EMPTY_PAYLOAD"}), 400

    address = data.get("address")
    amount = data.get("amount")

    if not address or amount is None:
        return jsonify({"error": "MISSING_FIELDS"}), 400

    if not SecurityModule.validate_evm_address(address):
        return jsonify({"error": "INVALID_NODE_ID"}), 400

    if not SecurityModule.validate_reward_amount(amount):
        return jsonify({"error": "INVALID_AMOUNT"}), 400

    logger.info(f"Reward requested: {amount} to {address}")

    # Placeholder: call your on-chain minter or queue a job
    tx_hash = "0xmockrewardtxhash"

    return jsonify({
        "status": "QUEUED",
        "address": address,
        "amount": amount,
        "tx_hash": tx_hash,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    })


@app.route("/api/verify", methods=["POST"])
def verify_node():
    """
    Verify a node / address for UI or Snap.
    """
    try:
        data = request.get_json(force=True)
    except Exception:
        return jsonify({"error": "INVALID_JSON"}), 400

    if not data:
        return jsonify({"error": "EMPTY_PAYLOAD"}), 400

    address = data.get("address")
    if not address:
        return jsonify({"error": "MISSING_ADDRESS"}), 400

    valid = SecurityModule.validate_evm_address(address)

    return jsonify({
        "address": address,
        "valid": bool(valid),
        "node": NODE_NAME,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    })


# -------------------------------------------------------------
# Run App
# -------------------------------------------------------------
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
