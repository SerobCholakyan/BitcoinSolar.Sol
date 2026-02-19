import os
from flask import Flask, render_template, request, jsonify
from web3 import Web3

app = Flask(__name__)

# CONFIGURATION (Use Replit Secrets for security)
RPC_URL = os.getenv('POLYGON_RPC', "https://polygon-rpc.com")
CONTRACT_ADDR = os.getenv('CONTRACT_ADDRESS')
PRIVATE_KEY = os.getenv('ADMIN_PRIVATE_KEY')

w3 = Web3(Web3.HTTPProvider(RPC_URL))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/mine', methods=['POST'])
def mine():
    user_address = request.json.get('address')
    abi = [{"inputs":[{"internalType":"address","name":"miner","type":"address"}],"name":"mintMiningReward","outputs":[],"stateMutability":"nonpayable","type":"function"}]
    
    contract = w3.eth.contract(address=CONTRACT_ADDR, abi=abi)
    account = w3.eth.account.from_key(PRIVATE_KEY)
    
    tx = contract.functions.mintMiningReward(user_address).build_transaction({
        'from': account.address,
        'nonce': w3.eth.get_transaction_count(account.address),
        'gas': 200000,
        'gasPrice': w3.eth.gas_price
    })
    
    signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    
    return jsonify({"status": "Success", "tx": w3.to_hex(tx_hash)})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)
