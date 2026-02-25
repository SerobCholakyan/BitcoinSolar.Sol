// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BitcoinSolar (BLSR) Mining Controller
 * @dev Replicates Bitcoin's 21M supply and halving schedule.
 * Mining is executed via the Global Node (Website Backend).
 */
contract BitcoinSolar is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 21_000_000 * 10**18;
    uint256 public constant HALVING_INTERVAL = 2_100_000 * 10**18; // Halve every 2.1M tokens

    uint256 public currentReward = 50 * 10**18; // Start at 50 BLSR per "block"
    uint256 public totalMined = 0;
    uint256 public lastHalvingMinedAmount = 0;

    // Events for the Website to listen to
    event BlockMined(address indexed miner, uint256 amount, uint256 currentTotal);
    event HalvingOccurred(uint256 newReward);

    constructor() ERC20("BitcoinSolar", "BLSR") Ownable(msg.sender) {}

    /**
     * @dev Called by the website backend to mint tokens to miners.
     * Enforces the halving logic and supply cap.
     */
    function executeMining(address miner) external onlyOwner {
        require(
            totalMined + currentReward <= MAX_SUPPLY,
            "BLSR: Max supply reached"
        );

        // Check if we need to halve the reward
        if (totalMined - lastHalvingMinedAmount >= HALVING_INTERVAL) {
            currentReward = currentReward / 2;
            lastHalvingMinedAmount = totalMined;
            emit HalvingOccurred(currentReward);
        }

        totalMined += currentReward;
        _mint(miner, currentReward);

        emit BlockMined(miner, currentReward, totalMined);
    }

    /**
     * @dev Returns how many tokens are left to be mined.
     */
    function remainingSupply() public view returns (uint256) {
        return MAX_SUPPLY - totalMined;
    }
}
