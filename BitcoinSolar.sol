// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
 *  BitcoinSolar (BLSR)
 *  --------------------
 *  • 21,000,000 max supply
 *  • 10% minted to deployer at launch (2.1M)
 *  • Remaining 90% minted through backend-controlled mining rewards
 *  • Uses OpenZeppelin 5.x (ERC20 + ERC20Capped + Ownable)
 */

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BitcoinSolar is ERC20, ERC20Capped, Ownable {
    /// @notice Maximum supply: 21,000,000 BLSR (18 decimals)
    uint256 public constant MAX_SUPPLY = 21_000_000 * 10**18;

    /// @notice Emitted whenever mining rewards are minted
    event MiningRewardMinted(address indexed miner, uint256 amount);

    constructor()
        ERC20("BitcoinSolar", "BLSR")
        ERC20Capped(MAX_SUPPLY)
        Ownable(msg.sender) // OZ 5.x requires explicit initial owner
    {
        // Mint 10% (2.1M) to deployer for liquidity + development
        _mint(msg.sender, 2_100_000 * 10**18);
    }

    /**
     * @notice Mint mining rewards — only backend wallet (owner) can call this.
     * @param miner Address receiving the reward
     * @param amount Reward amount (in wei)
     */
    function mintMiningReward(address miner, uint256 amount)
        external
        onlyOwner
    {
        require(miner != address(0), "BLSR: invalid miner address");
        require(amount > 0, "BLSR: amount must be > 0");
        require(
            totalSupply() + amount <= cap(),
            "BLSR: Max supply reached"
        );

        _mint(miner, amount);
        emit MiningRewardMinted(miner, amount);
    }

    /**
     * @dev Required override for ERC20Capped in OZ 5.x
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Capped) {
        super._update(from, to, value);
    }
}
