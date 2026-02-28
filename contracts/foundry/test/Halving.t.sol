// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/BitcoinSolar.sol";

contract HalvingTest is Test {
    BitcoinSolar token;

    function setUp() public {
        token = new BitcoinSolar();
    }

    function testInitialReward() public {
        assertEq(token.calculateCurrentReward(0), 50 ether);
    }
}
