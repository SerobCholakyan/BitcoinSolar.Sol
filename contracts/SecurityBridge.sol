// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SecurityBridge
 * @dev Authorization layer for backend mining nodes.
 * Only the owner can add or remove authorized nodes.
 * BitcoinSolar uses this to restrict mining execution.
 */
abstract contract SecurityBridge is Ownable {
    mapping(address => bool) internal authorizedNodes;

    event NodeAuthorized(address indexed node);
    event NodeRevoked(address indexed node);

    // No constructor here – inheriting contract initializes authorized nodes.

    modifier onlyAuthorized() {
        require(authorizedNodes[msg.sender], "SECURITY_ERR: UNAUTHORIZED_NODE");
        _;
    }

    function addAuthorizedNode(address node) external onlyOwner {
        require(node != address(0), "SECURITY_ERR: ZERO_ADDRESS");
        authorizedNodes[node] = true;
        emit NodeAuthorized(node);
    }

    function removeAuthorizedNode(address node) external onlyOwner {
        authorizedNodes[node] = false;
        emit NodeRevoked(node);
    }

    function isAuthorizedNode(address node) external view returns (bool) {
        return authorizedNodes[node];
    }
}
