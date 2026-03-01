// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BlsrRewards {
    event RewardMinted(address indexed miner, uint256 blockNumber, uint256 amount);

    mapping(uint256 => bool) public blockClaimed;

    function mintReward(uint256 blockNumber, uint256 amount) external {
        require(!blockClaimed[blockNumber], "Block already claimed");
        blockClaimed[blockNumber] = true;
        emit RewardMinted(msg.sender, blockNumber, amount);
    }
}
