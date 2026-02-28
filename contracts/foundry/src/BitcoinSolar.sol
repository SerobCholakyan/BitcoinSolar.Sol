// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./SecurityBridge.sol";
import "./SupplyManager.sol";

/**
 * @title BitcoinSolar (BLSR) Mining Controller
 * @dev ERC-20 token with a 21M hard cap and halving schedule.
 *
 * The halving interval is measured in tokens mined (not blocks):
 * each 2.1M-token era pays the same reward per call, then halves.
 * This means ~10 eras before the supply cap is reached.
 *
 * Mining is executed via authorized backend nodes.
 */
contract BitcoinSolar is ERC20, SecurityBridge, SupplyManager {
    uint256 public constant MAX_SUPPLY = 21_000_000 * 10 ** 18;

    uint256 public totalMined;

    // Rate-limiting: one mint per miner per block
    mapping(address => uint256) private _lastMinedBlock;

    event BlockMined(address indexed miner, uint256 amount, uint256 currentTotal);
    event HalvingOccurred(uint256 newReward, uint256 era);

    constructor() ERC20("BitcoinSolar", "BLSR") {}

    /**
     * @dev Mint the current-era reward to `miner`.
     *
     * Access: restricted to authorized nodes (see SecurityBridge).
     * The reward is derived from totalMined via SupplyManager, so
     * halvings are computed — not tracked in mutable state.
     */
    function executeMining(address miner) external onlyAuthorized {
        require(miner != address(0), "BLSR: zero address");
        require(
            _lastMinedBlock[miner] < block.number,
            "BLSR: one mint per miner per block"
        );

        // Derive reward from the current era (fixes missed-halving bug)
        uint256 reward = calculateCurrentReward(totalMined);
        require(reward > 0, "BLSR: mining exhausted");
        require(totalMined + reward <= MAX_SUPPLY, "BLSR: max supply reached");

        // Detect era boundary for event
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
     * @dev Tokens remaining before the supply cap.
     */
    function remainingSupply() public view returns (uint256) {
        return MAX_SUPPLY - totalMined;
    }
}
