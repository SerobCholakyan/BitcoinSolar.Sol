// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
 *  BitcoinSolar (BTCS)
 *  --------------------
 *  • Dynamic yield token with time‑based harvesting
 *  • Uses OpenZeppelin 5.x (ERC20 + Ownable)
 *  • SolarMath library handles yield calculations
 *  • Prevents zero‑harvest exploits
 *  • Emits events for transparency
 */

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Library for solar‑yield math (kept separate for gas clarity)
library SolarMath {
    /**
     * @notice Computes yield based on balance × time × rate
     * @dev Example: 1% daily yield → (balance * duration) / 1 days / 100
     */
    function computeSolarYield(uint256 balance, uint256 duration)
        internal
        pure
        returns (uint256)
    {
        if (balance == 0 || duration == 0) return 0;
        return (balance * duration) / 1 days / 100; // 1% daily
    }
}

contract BitcoinSolar is ERC20, Ownable {
    /// @notice Tracks last harvest timestamp per user
    mapping(address => uint256) public lastHarvest;

    /// @notice Emitted whenever a user harvests yield
    event Harvest(address indexed user, uint256 reward, uint256 timestamp);

    constructor()
        ERC20("BitcoinSolar", "BTCS")
        Ownable(msg.sender) // Required in OZ 5.x
    {}

    /**
     * @notice Harvest accumulated solar yield based on time passed
     */
    function harvest() external {
        uint256 last = lastHarvest[msg.sender];
        uint256 timePassed = block.timestamp - last;

        require(timePassed > 0, "BTCS: Wait for next sun cycle");

        uint256 userBalance = balanceOf(msg.sender);
        require(userBalance > 0, "BTCS: No balance to generate yield");

        uint256 reward = SolarMath.computeSolarYield(userBalance, timePassed);
        require(reward > 0, "BTCS: No yield available yet");

        lastHarvest[msg.sender] = block.timestamp;
        _mint(msg.sender, reward);

        emit Harvest(msg.sender, reward, block.timestamp);
    }
}
