import os
import threading
import json
from flask import Flask, render_template, jsonify, request
from web3 import Web3
from web3.middleware import geth_poa_middleware
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

app = Flask(__name__)

# --- BLOCKCHAIN CONFIG ---
RPC_URL = os.getenv('POLYGON_RPC', 'https://polygon-mainnet.infura.io/v3/3f69ffd3c39747099f55586c0dfbe8ed')
w3 = Web3(Web3.HTTPProvider(RPC_URL))

# Polygon (and Infura) needs POA middleware to parse blocks correctly
w3.middleware_onion.inject(geth_poa_middleware, layer=0)

CONTRACT_ADDRESS = os.getenv('CONTRACT_ADDRESS')
PRIVATE_KEY = os.getenv('PRIVATE_KEY')

# BitcoinSolar ABI (Simplified for Mining) as Python object
ABI = json.loads(
    '[{"inputs":[{"internalType":"address","name":"miner","type":"address"}],'
    '"name":"executeMining","outputs":[],"stateMutability":"nonpayable","type":"function"},'
    '{"inputs":[],"name":"totalMined","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],'
    '"stateMutability":"view","type":"function"}]'
)

def background_mint(miner_address):
    try:
        if not PRIVATE_KEY or not CONTRACT_ADDRESS:
            print("Error: Missing Keys in .env")
            return

        account = w3.eth.account.from_key(PRIVATE_KEY)
        contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=ABI)

        # Use pending nonce to avoid collisions under concurrency
        nonce = w3.eth.get_transaction_count(account.address, 'pending')

        # Estimate gas instead of hard-coding
        gas_estimate = contract.functions.executeMining(miner_address).estimate_gas({
            'from': account.address
        })

        tx = contract.functions.executeMining(miner_address).build_transaction({
            'from': account.address,
            'nonce': nonce,
            'gas': gas_estimate,
            'gasPrice': w3.eth.gas_price
        })

        signed = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
        print(f"Mining Successful for {miner_address} | TX: {tx_hash.hex()}")

    except Exception as e:
        print(f"Mining Fail: {e}")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_difficulty')
def get_difficulty():
    """Bitcoin-style difficulty scaling logic."""
    try:
        contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=ABI)
        mined = contract.functions.totalMined().call() / 10**18
        # Scaled difficulty (Base 2s + supply weight)
        difficulty = 2.0 + (mined / 2100000) * 10
        return jsonify({"difficulty": round(difficulty, 1)})
    except Exception as e:
        print(f"Difficulty fetch failed: {e}")
        return jsonify({"difficulty": 2.0})

@app.route('/mine', methods=['POST'])
def mine():
    data = request.get_json(silent=True) or {}
    miner_addr = data.get('address')

    if not miner_addr or not w3.is_address(miner_addr):
        return jsonify({"status": "error", "message": "Invalid Address"}), 400

    if not PRIVATE_KEY or not CONTRACT_ADDRESS:
        return jsonify({"status": "error", "message": "Server misconfigured"}), 500

    # Send transaction to network in background
    threading.Thread(target=background_mint, args=(miner_addr,), daemon=True).start()

    return jsonify({
        "status": "submitted",
        "message": "Mining transaction submitted in background"
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
