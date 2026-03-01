// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Example {
    event ValueSet(address indexed from, uint256 value);

    uint256 public value;

    function setValue(uint256 newValue) external {
        value = newValue;
        emit ValueSet(msg.sender, newValue);
    }
}
