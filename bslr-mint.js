// blsr-mint.js
const Web3 = require("web3");

class BLSRMinter {
  constructor(rpcUrl, privateKey, contractAddress, contractABI) {
    this.web3 = new Web3(rpcUrl);
    this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    this.web3.eth.accounts.wallet.add(this.account);
    this.contract = new this.web3.eth.Contract(contractABI, contractAddress);
  }

  async mintReward(blockLogLine) {
    try {
      // You can parse block height / hash from the log line if needed
      const blockMeta = blockLogLine.slice(0, 200);

      const tx = this.contract.methods.mintReward(
        this.account.address,
        blockMeta
      );

      const gas = await tx.estimateGas({ from: this.account.address });
      const gasPrice = await this.web3.eth.getGasPrice();

      const receipt = await tx.send({
        from: this.account.address,
        gas,
        gasPrice
      });

      console.log("BLSR Minted:", receipt.transactionHash);
      return receipt;
    } catch (err) {
      console.error("Minting failed:", err);
      return null;
    }
  }
}

module.exports = BLSRMinter;
