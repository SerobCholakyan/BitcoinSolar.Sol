// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

abstract contract SupplyManager {
    uint256 private constant INITIAL_REWARD = 50 * 10**18;
    uint256 private constant HALVING_INTERVAL = 2_100_000 * 10**18;

    /**
     * @dev Calculates reward based on current supply.
     * Cuts reward in half every 2.1M tokens minted.
     */
    function calculateCurrentReward(uint256 currentSupply) public pure returns (uint256) {
        uint256 era = currentSupply / HALVING_INTERVAL;
        
        if (era >= 33) return 0; // Finality reached
        
        return INITIAL_REWARD >> era; // Bit-shift for efficient division by 2
    }
}
