// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @dev Minimal placeholder so Hardhat can compile and deploy.
 * Replace this file with your full GreetingCardNFT implementation before mainnet.
 * Constructor matches common pattern: name, symbol, owner, USDC token (e.g. Base Sepolia USDC).
 */
contract GreetingCardNFT {
    constructor(string memory, string memory, address, address) {}

    function mintGreetingCard(string calldata, address) external payable returns (uint256) {
        return 0;
    }
}
