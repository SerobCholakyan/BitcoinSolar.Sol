// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title BitcoinSolar (BLSR)
 * @dev On-chain contract for the BLSR ecosystem.
 */
contract BitcoinSolar is ERC20, Ownable, ERC20Burnable {
    
    // Initial supply: 21,000,000 BLSR (18 decimals)
    uint256 private constant INITIAL_SUPPLY = 21_000_000 * 10**18;

    constructor() ERC20("BitcoinSolar", "BLSR") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /**
     * @dev Function to mint new tokens (e.g., for mining rewards).
     * Only the contract owner (your web backend) can call this.
     */
    function mintReward(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
