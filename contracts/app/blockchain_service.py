import os
import hvac
from web3 import Web3
from eth_account import Account

class BLSRBlockchain:
    def __init__(self):
        # 1. Connect to Blockchain (Polygon/Ethereum) via RPC
        self.w3 = Web3(Web3.HTTPProvider(os.getenv('RPC_URL')))
        self.contract_address = os.getenv('CONTRACT_ADDRESS')
        self.contract_abi = [...] # Full ABI from Remix/Truffle
        self.contract = self.w3.eth.contract(address=self.contract_address, abi=self.contract_abi)

        # 2. Connect to Vault for the Admin Key
        self.vault = hvac.Client(url=os.getenv('VAULT_ADDR'), token=os.getenv('VAULT_TOKEN'))

    def distribute_reward(self, miner_address, amount_blsr):
        """Mints real BLSR tokens on the blockchain"""
        # Fetch Admin Key from Secure Vault
        secret = self.vault.secrets.kv.v2.read_secret_version(path='blsr-admin')
        admin_key = secret['data']['data']['private_key']
        admin_acct = Account.from_key(admin_key)

        # Build On-Chain Transaction
        nonce = self.w3.eth.get_transaction_count(admin_acct.address)
        amount_wei = self.w3.to_wei(amount_blsr, 'ether')
        
        tx = self.contract.functions.mintMiningReward(miner_address, amount_wei).build_transaction({
            'from': admin_acct.address,
            'nonce': nonce,
            'gas': 200000,
            'gasPrice': self.w3.eth.gas_price
        })

        # Sign and Broadcast
        signed_tx = self.w3.eth.account.sign_transaction(tx, admin_key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        return self.w3.to_hex(tx_hash)
