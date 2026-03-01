// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./SecurityBridge.sol";
import "./SupplyManager.sol";

/**
 * @title BitcoinSolar (BLSR)
 * @dev ERC‑20 token with a 21M hard cap and deterministic halving schedule.
 *
 * Mining reward halves every 2.1M tokens mined.
 * Mining is executed only by authorized backend nodes.
 *
 * Halving is computed mathematically from totalMined — no mutable reward state.
 */
contract BitcoinSolar is ERC20, SecurityBridge, SupplyManager {
    uint256 public constant MAX_SUPPLY = 21_000_000 * 10**18;

    // Total tokens mined so far
    uint256 public totalMined;

    // Rate‑limit: one mint per miner per block
    mapping(address => uint256) private _lastMinedBlock;

    event BlockMined(address indexed miner, uint256 amount, uint256 newTotal);
    event HalvingOccurred(uint256 newReward, uint256 era);

    constructor() ERC20("BitcoinSolar", "BLSR") {
        // Initialize deployer as the first authorized backend node
        authorizedNodes[msg.sender] = true;
        emit NodeAuthorized(msg.sender);
    }

    /**
     * @dev Mint the current-era reward to `miner`.
     * Access restricted to authorized backend nodes.
     * Reward is derived from totalMined via SupplyManager.
     */
    function executeMining(address miner) external onlyAuthorized {
        require(miner != address(0), "BLSR: zero address");
        require(_lastMinedBlock[miner] < block.number, "BLSR: one mint per block");

        uint256 reward = calculateCurrentReward(totalMined);
        require(reward > 0, "BLSR: mining exhausted");
        require(totalMined + reward <= MAX_SUPPLY, "BLSR: max supply reached");

        uint256 prevEra = totalMined / HALVING_INTERVAL;

        totalMined += reward;
        _lastMinedBlock[miner] = block.number;
        _mint(miner, reward);

        uint256 newEra = totalMined / HALVING_INTERVAL;
        if (newEra > prevEra) {
            emit HalvingOccurred(calculateCurrentReward(totalMined), newEra);
        }

        emit BlockMined(miner, reward, totalMined);
    }

    /**
     * @dev Remaining tokens before the 21M cap.
     */
    function remainingSupply() public view returns (uint256) {
        return MAX_SUPPLY - totalMined;
    }

    /**
     * @dev Last block a miner minted.
     */
    function lastMinedBlock(address miner) external view returns (uint256) {
        return _lastMinedBlock[miner];
    }
}
