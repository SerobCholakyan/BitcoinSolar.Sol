// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Library to handle memory-intensive math separately
library SolarMath {
    function computeSolarYield(uint256 balance, uint256 duration) internal pure returns (uint256) {
        return (balance * duration) / 1 days / 100; // 1% daily yield example
    }
}

contract BitcoinSolar is ERC20, Ownable {
    mapping(address => uint256) public lastHarvest;

    constructor() ERC20("BitcoinSolar", "BTCS") Ownable(msg.sender) {}

    function harvest() external {
        uint256 timePassed = block.timestamp - lastHarvest[msg.sender];
        require(timePassed > 0, "Wait for next sun cycle");
        
        uint256 reward = SolarMath.computeSolarYield(balanceOf(msg.sender), timePassed);
        lastHarvest[msg.sender] = block.timestamp;
        _mint(msg.sender, reward);
    }
}
