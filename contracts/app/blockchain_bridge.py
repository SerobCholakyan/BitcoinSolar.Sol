import time
import requests
from web3 import Web3
from eth_account import Account

# -----------------------------
# CONFIGURATION
# -----------------------------

BTC_API = "https://api.blockcypher.com/v1/btc/main"
BLSR_RPC = "https://mainnet.infura.io/v3/YOUR_KEY"
CONTRACT_ADDRESS = "0xddaAd340b0f1Ef65169Ae5E41A8b10776a75482d"

# Load ABI from your repo
import json
with open("abi/blsr-abi.json") as f:
    BLSR_ABI = json.load(f)["abi"]

# Miner private key (authorized node)
MINER_PRIVATE_KEY = "YOUR_PRIVATE_KEY"
ACCOUNT = Account.from_key(MINER_PRIVATE_KEY)

# Web3 client
w3 = Web3(Web3.HTTPProvider(BLSR_RPC))
contract = w3.eth.contract(address=Web3.to_checksum_address(CONTRACT_ADDRESS), abi=BLSR_ABI)

# -----------------------------
# BITCOIN POLLING
# -----------------------------

def get_bitcoin_block():
    r = requests.get(BTC_API, timeout=10)
    r.raise_for_status()
    return r.json()

# -----------------------------
# MINER SELECTION (entropy from BTC hash)
# -----------------------------

def select_miner(btc_hash, authorized_nodes):
    seed = Web3.keccak(text=btc_hash)
    idx = int.from_bytes(seed, "big") % len(authorized_nodes)
    return authorized_nodes[idx]

# -----------------------------
# BLSR CONTRACT HELPERS
# -----------------------------

def get_authorized_nodes():
    # In your system, you maintain this list off-chain
    # or query your operator panel API.
    # For now, assume static list:
    return [
        ACCOUNT.address
    ]

def execute_mining(miner):
    nonce = w3.eth.get_transaction_count(ACCOUNT.address)
    tx = contract.functions.executeMining(miner).build_transaction({
        "from": ACCOUNT.address,
        "nonce": nonce,
        "gas": 300000,
        "gasPrice": w3.eth.gas_price
    })
    signed = w3.eth.account.sign_transaction(tx, MINER_PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
    return tx_hash.hex()

# -----------------------------
# MAIN LOOP
# -----------------------------

def run():
    print("Starting Bitcoin → BLSR mining bridge...")
    last_height = None

    while True:
        try:
            btc = get_bitcoin_block()
            height = btc["height"]
            block_hash = btc["hash"]

            if last_height is None:
                last_height = height
                print(f"Synced at BTC height {height}")
                time.sleep(10)
                continue

            if height > last_height:
                print(f"New BTC block detected: {height} {block_hash}")

                authorized = get_authorized_nodes()
                miner = select_miner(block_hash, authorized)

                print(f"Selected BLSR miner: {miner}")

                tx_hash = execute_mining(miner)
                print(f"BLSR mining tx sent: {tx_hash}")

                last_height = height

            time.sleep(10)

        except Exception as e:
            print(f"Error: {e}")
            time.sleep(10)

if __name__ == "__main__":
    run()
