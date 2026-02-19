// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SupplyManager.sol";
import "./SecurityBridge.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

/**
 * @title BitcoinSolar (BLSR)
 * @author Gemini Pulse Design
 * @notice Scarcity-driven mining token with 21M Hard Cap.
 */
contract BitcoinSolar is ERC20, ERC20Capped, SecurityBridge, SupplyManager {
    
    // Exact Bitcoin Metrics
    uint256 public constant MAX_SUPPLY = 21_000_000 * 10**18;

    constructor() 
        ERC20("BitcoinSolar", "BLSR") 
        ERC20Capped(MAX_SUPPLY) 
    {}

    /**
     * @dev The Mining Core. Triggered by your backend.
     * Inherits security from SecurityBridge and logic from SupplyManager.
     */
    function processMiningJob(address miner) external onlyAuthorized {
        uint256 reward = calculateCurrentReward(totalSupply());
        
        require(reward > 0, "MINING_COMPLETE");
        require(totalSupply() + reward <= cap(), "CAP_REACHED");

        _mint(miner, reward);
        emit MiningCompleted(miner, reward, block.timestamp);
    }

    // Mandatory override for ERC20 + ERC20Capped
    function _update(address from, address to, uint256 value) 
        internal 
        override(ERC20, ERC20Capped) 
    {
        super._update(from, to, value);
    }

    event MiningCompleted(address indexed miner, uint256 amount, uint256 time);
}
