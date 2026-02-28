from flask import Blueprint, render_template, request, jsonify
from .blockchain_service import BLSRBlockchain
import requests

main_bp = Blueprint('main', __name__)
chain = BLSRBlockchain()

@main_bp.route('/')
def index():
    # Fetch live BTC price from Blockchain.com to map BLSR value
    res = requests.get("https://api.blockchain.com/v3/exchange/tickers/BTC-USD")
    market_price = res.json().get('last_trade_price', "Syncing...")
    return render_template('index.html', price=market_price)

@main_bp.route('/mine', methods=['POST'])
def mine():
    user_wallet = request.json.get('wallet')
    try:
        # Trigger real on-chain reward
        tx_hash = chain.distribute_reward(user_wallet, 0.5) # 0.5 BLSR reward
        return jsonify({"status": "SUCCESS", "tx_hash": tx_hash})
    except Exception as e:
        return jsonify({"status": "ERROR", "message": str(e)}), 400
