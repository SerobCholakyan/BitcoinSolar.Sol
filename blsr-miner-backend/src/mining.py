import os
from web3 import Web3

RPC = os.getenv("RPC_BLSR_CHAIN=https://blsr-rpc.bitcoinsolar.org
")
PRIVATE_KEY = os.getenv("BLSR_PRIVATE_KEY")
CONTRACT = os.getenv("BLSR_CONTRACT_ADDRESS")

w3 = Web3(Web3.HTTPProvider(RPC))

def mine_block():
    return {"status": "mined", "difficulty": os.getenv("MINING_DIFFICULTY")}
