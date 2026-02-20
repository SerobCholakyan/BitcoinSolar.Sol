import os
import threading
from flask import Flask, render_template, jsonify, request
from web3 import Web3
from web3.middleware import geth_poa_middleware
from dotenv import load_dotenv

load_dotenv() # Load keys from .env file

app = Flask(__name__)
w3 = Web3(Web3.HTTPProvider(os.getenv('POLYGON_RPC', 'https://polygon-rpc.com')))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)

# CONFIG
CONTRACT_ADDRESS = os.getenv('CONTRACT_ADDRESS')
PRIVATE_KEY = os.getenv('PRIVATE_KEY')
ABI = '[{"inputs":[{"internalType":"address","name":"miner","type":"address"}],"name":"executeMining","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalMined","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]'

def background_mint(miner_address):
    try:
        account = w3.eth.account.from_key(PRIVATE_KEY)
        contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=ABI)
        tx = contract.functions.executeMining(miner_address).build_transaction({
            'from': account.address,
            'nonce': w3.eth.get_transaction_count(account.address),
            'gas': 250000,
            'gasPrice': w3.eth.gas_price
        })
        signed = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        w3.eth.send_raw_transaction(signed.rawTransaction)
    except Exception as e:
        print(f"Mining Fail: {e}")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_difficulty')
def get_difficulty():
    """Calculates scaling difficulty based on total supply."""
    try:
        contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=ABI)
        mined = contract.functions.totalMined().call() / 10**18
        # Scaled difficulty (Genesis = 2s, 21M = 100s)
        difficulty = 2 + (mined / 2100000) * 10
        return jsonify({"difficulty": round(difficulty, 1)})
    except:
        return jsonify({"difficulty": 2.0})

@app.route('/mine', methods=['POST'])
def mine():
    miner_addr = request.json.get('address')
    if not w3.is_address(miner_addr):
        return jsonify({"status": "error", "message": "Invalid Address"})
    threading.Thread(target=background_mint, args=(miner_addr,)).start()
    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
