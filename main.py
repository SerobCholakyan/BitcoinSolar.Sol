# main.py
import json
import os
import subprocess
import time
from pathlib import Path

from dotenv import load_dotenv
from web3 import Web3

ROOT = Path(__file__).resolve().parent

load_dotenv(ROOT / ".env")

RPC_URL = os.getenv("RPC_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")

if not RPC_URL or not PRIVATE_KEY or not CONTRACT_ADDRESS:
    raise RuntimeError("RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS must be set in .env")

with open(ROOT / "blsr-abi.json") as f:
    ABI = json.load(f)

w3 = Web3(Web3.HTTPProvider(RPC_URL))
account = w3.eth.account.from_key(PRIVATE_KEY)
contract = w3.eth.contract(address=Web3.to_checksum_address(CONTRACT_ADDRESS), abi=ABI)


def play_sound(kind: str):
    try:
        subprocess.Popen(["node", "make-sound.js", kind], cwd=ROOT)
    except Exception as e:
        print("sound error:", e)


def mint_reward(block_number: int, amount: int):
    try:
        tx = contract.functions.mintReward(block_number, amount).build_transaction(
            {
                "from": account.address,
                "nonce": w3.eth.get_transaction_count(account.address),
                "gas": 300000,
                "maxFeePerGas": w3.to_wei("30", "gwei"),
                "maxPriorityFeePerGas": w3.to_wei("1.5", "gwei"),
            }
        )
        signed = account.sign_transaction(tx)
        tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
        print("tx sent:", tx_hash.hex())
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        print("tx mined in block", receipt.blockNumber)
        play_sound("success")
    except Exception as e:
        print("mint error:", e)
        play_sound("error")


def main():
    print("Starting BitcoinSolar Python watcher...")
    while True:
        # TODO: replace with real miner log parsing
        fake_block = 12345
        fake_amount = 1
        mint_reward(fake_block, fake_amount)
        time.sleep(30)


if __name__ == "__main__":
    main()
