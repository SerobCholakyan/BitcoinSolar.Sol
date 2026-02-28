// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SecurityBridge.sol";
import "./SupplyManager.sol";

/**
 * @title BitcoinSolar (BLSR) Mining Controller
 * @dev Replicates Bitcoin's 21M supply and halving schedule.
 * Mining is executed via the Global Node (Website Backend).
 * @dev ERC-20 token with a 21M hard cap and halving schedule.
 *
 * The halving interval is measured in tokens mined (not blocks):
 * each 2.1M-token era pays the same reward per call, then halves.
 * This means ~10 eras before the supply cap is reached.
 *
 * Mining is executed via authorized backend nodes.
 */
contract BitcoinSolar is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 21_000_000 * 10**18;
    uint256 public constant HALVING_INTERVAL = 2_100_000 * 10**18; // Halve every 2.1M tokens
contract BitcoinSolar is ERC20, SecurityBridge, SupplyManager {
    uint256 public constant MAX_SUPPLY = 21_000_000 * 10 ** 18;

    uint256 public currentReward = 50 * 10**18; // Start at 50 BLSR per "block"
    uint256 public totalMined = 0;
    uint256 public lastHalvingMinedAmount = 0;
    uint256 public totalMined;

    // Rate-limiting: one mint per miner per block
    mapping(address => uint256) private _lastMinedBlock;

    event BlockMined(address indexed miner, uint256 amount, uint256 currentTotal);
    event HalvingOccurred(uint256 newReward);
    event HalvingOccurred(uint256 newReward, uint256 era);

    constructor() ERC20("BitcoinSolar", "BLSR") Ownable(msg.sender) {}
    constructor() ERC20("BitcoinSolar", "BLSR") {}

    /**
     * @dev Called by the website backend to mint tokens to miners.
     * Enforces the halving logic and supply cap.
     * @dev Mint the current-era reward to `miner`.
     *
     * Access: restricted to authorized nodes (see SecurityBridge).
     * The reward is derived from totalMined via SupplyManager, so
     * halvings are computed — not tracked in mutable state.
     */
    function executeMining(address miner) external onlyAuthorized {
        require(miner != address(0), "BLSR: zero address");
        require(
    function executeMining(address miner) external onlyOwner {
    function executeMining(address miner) external onlyAuthorized {
        require(miner != address(0), "BLSR: zero address");
        require(
            totalMined + currentReward <= MAX_SUPPLY,
            "BLSR: Max supply reached"
            _lastMinedBlock[miner] < block.number,
            "BLSR: one mint per miner per block"
        );

        // Check if we need to halve the reward
        if (totalMined - lastHalvingMinedAmount >= HALVING_INTERVAL) {
            currentReward = currentReward / 2;
            lastHalvingMinedAmount = totalMined;
            emit HalvingOccurred(currentReward);
        }
        // Derive reward from the current era (fixes missed-halving bug)
        uint256 reward = calculateCurrentReward(totalMined);
        require(reward > 0, "BLSR: mining exhausted");
        require(totalMined + reward <= MAX_SUPPLY, "BLSR: max supply reached");

        // Detect era boundary for event
        uint256 prevEra = totalMined / HALVING_INTERVAL;

        totalMined += currentReward;
        _mint(miner, currentReward);
        totalMined += reward;
        _lastMinedBlock[miner] = block.number;
        _mint(miner, reward);

        uint256 newEra = totalMined / HALVING_INTERVAL;
        if (newEra > prevEra) {
            emit HalvingOccurred(calculateCurrentReward(totalMined), newEra);
        }

        emit BlockMined(miner, currentReward, totalMined);
        emit BlockMined(miner, reward, totalMined);
    }

    /**
     * @dev Returns how many tokens are left to be mined.
     * @dev Tokens remaining before the supply cap.
     */
    function remainingSupply() public view returns (uint256) {
        return MAX_SUPPLY - totalMined;
    }
}
