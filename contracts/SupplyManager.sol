// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @dev Pure halving logic for BitcoinSolar.
 * Reward halves every 2.1M tokens mined.
 */
abstract contract SupplyManager {
    uint256 internal constant INITIAL_REWARD = 50 * 10**18;
    uint256 internal constant HALVING_INTERVAL = 2_100_000 * 10**18;

    function calculateCurrentReward(uint256 currentSupply) public pure returns (uint256) {
        uint256 era = currentSupply / HALVING_INTERVAL;
        if (era >= 33) return 0;
        return INITIAL_REWARD >> era;
    }
}
