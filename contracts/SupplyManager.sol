// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SupplyManager
 * @dev Pure halving logic for BitcoinSolar.
 *
 * Reward halves every 2.1M tokens mined.
 * No mutable reward state is stored — reward is derived mathematically
 * from totalMined, ensuring deterministic halving behavior.
 *
 * Era = floor(totalMined / HALVING_INTERVAL)
 * Reward = INITIAL_REWARD >> era
 *
 * After ~33 halvings, reward becomes zero.
 */
abstract contract SupplyManager {
    uint256 internal constant INITIAL_REWARD = 50 * 10**18;
    uint256 internal constant HALVING_INTERVAL = 2_100_000 * 10**18;

    /**
     * @dev Returns the current mining reward based on total mined supply.
     * @param currentSupply Total mined tokens so far.
     */
    function calculateCurrentReward(uint256 currentSupply) public pure returns (uint256) {
        uint256 era = currentSupply / HALVING_INTERVAL;

        // After ~33 halvings, reward becomes zero (similar to Bitcoin)
        if (era >= 33) return 0;

        // Bitshift halves the reward each era
        return INITIAL_REWARD >> era;
    }
}
