// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract SecurityBridge is Ownable {
    mapping(address => bool) private authorizedNodes;

    constructor() Ownable(msg.sender) {
        authorizedNodes[msg.sender] = true;
    }

    modifier onlyAuthorized() {
        require(authorizedNodes[msg.sender], "SECURITY_ERR: UNAUTHORIZED_NODE");
        _;
    }

    function addAuthorizedNode(address node) external onlyOwner {
        authorizedNodes[node] = true;
    }

    function removeAuthorizedNode(address node) external onlyOwner {
        authorizedNodes[node] = false;
    }
}
