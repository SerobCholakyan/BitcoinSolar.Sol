import os
import logging
from flask import Flask, render_template, request, jsonify
from security import SecurityModule  # Your custom security module
from datetime import datetime

# -------------------------------------------------------------
# Flask App Setup
# -------------------------------------------------------------
app = Flask(__name__)

# Optional: Enable CORS if your frontend calls this API
try:
    from flask_cors import CORS
    CORS(app)
except ImportError:
    pass

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

# -------------------------------------------------------------
# Routes
# -------------------------------------------------------------
@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/mine", methods=["POST"])
def mine():
    """
    Endpoint called by miners or Snap UI to validate a node
    and simulate a mining event.
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

    # Validate EVM address
    if not SecurityModule.validate_evm_address(address):
        logger.warning(f"Rejected invalid address: {address}")
        return jsonify({"error": "INVALID_NODE_ID"}), 400

    # Simulated mining response
    logger.info(f"Node validated: {address}")

    return jsonify({
        "status": "SUCCESS",
        "node": NODE_NAME,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "api_version": API_VERSION
    })


# -------------------------------------------------------------
# Health Check
# -------------------------------------------------------------
@app.route("/api/health")
def health():
    return jsonify({
        "status": "OK",
        "node": NODE_NAME,
        "api_version": API_VERSION,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    })


# -------------------------------------------------------------
# Run App
# -------------------------------------------------------------
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
