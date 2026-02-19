// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BitcoinSolar is ERC20, ERC20Capped, Ownable {
    // 21 Million Max Supply (18 decimals)
    uint256 public constant MAX_SUPPLY = 21_000_000 * 10**18;

    constructor() 
        ERC20("BitcoinSolar", "BLSR") 
        ERC20Capped(MAX_SUPPLY) 
        Ownable(msg.sender) 
    {
        // Mint 10% to the Treasury for liquidity and dev
        _mint(msg.sender, 2_100_000 * 10**18);
    }

    // Function to mint mining rewards - only callable by your Website Backend
    function mintMiningReward(address miner, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= cap(), "BLSR: Max supply reached");
        _mint(miner, amount);
    }

    // Required override for ERC20Capped
    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Capped) {
        super._update(from, to, value);
    }
}
