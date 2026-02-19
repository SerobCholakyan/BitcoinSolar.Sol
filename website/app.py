import os
from flask import Flask, render_template, request, jsonify
from security import SecurityModule # Your handmade security file

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/mine', methods=['POST'])
def mine():
    data = request.json
    address = data.get('address')
    
    if not SecurityModule.validate_evm_address(address):
        return jsonify({"error": "INVALID_NODE_ID"}), 400
        
    return jsonify({"status": "SUCCESS", "node": "LYNNIC_ACTIVE"})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)
