// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

abstract contract SupplyManager {
    uint256 internal constant INITIAL_REWARD = 50 * 10**18;
    uint256 internal constant HALVING_INTERVAL = 2_100_000 * 10**18;

    /**
     * @dev Calculates the mining reward based on total mined supply.
     * Reward halves every 2.1M tokens.
     *
     * Era progression:
     *   era = currentSupply / HALVING_INTERVAL
     *   reward = INITIAL_REWARD >> era
     *
     * After ~33 halvings, reward becomes zero.
     */
    function calculateCurrentReward(uint256 currentSupply) public pure returns (uint256) {
        uint256 era = currentSupply / HALVING_INTERVAL;

        if (era >= 33) return 0;

        return INITIAL_REWARD >> era;
    }
}
