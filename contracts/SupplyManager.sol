// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

abstract contract SupplyManager {
    uint256 public constant INITIAL_REWARD = 50 * 10 ** 18;
    uint256 public constant HALVING_INTERVAL = 2_100_000 * 10 ** 18;

    // After 64 shifts the reward is zero; no need to go further.
    uint256 private constant MAX_ERA = 64;

    /**
     * @dev Calculates reward based on current supply.
     * Cuts reward in half every 2.1M tokens minted.
     * Returns 0 once the bit-shift reduces the reward below 1 wei.
     */
    function calculateCurrentReward(uint256 currentSupply) public pure returns (uint256) {
        uint256 era = currentSupply / HALVING_INTERVAL;

        if (era >= MAX_ERA) return 0;

        return INITIAL_REWARD >> era;
    }
}
