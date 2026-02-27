import os
from web3 import Web3

RPC = os.getenv("BLSR_RPC_URL")
PRIVATE_KEY = os.getenv("BLSR_PRIVATE_KEY")
CONTRACT = os.getenv("BLSR_CONTRACT_ADDRESS")

w3 = Web3(Web3.HTTPProvider(RPC))

def mine_block():
    return {"status": "mined", "difficulty": os.getenv("MINING_DIFFICULTY")}
