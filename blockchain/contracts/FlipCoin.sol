// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FlipCoin {
    address public owner;
    uint256 public constant MIN_BET = 0.01 ether;

    event BetPlaced(address indexed player, uint256 amount, bool choice, bool won);

    constructor() {
        owner = msg.sender;
    }

    function flip(bool choice) external payable {
        require(msg.value >= MIN_BET, "Minimum bet not met");
        
        // Simple pseudo-randomness for demonstration
        bool result = (block.timestamp % 2) == 0;
        bool won = (result == choice);

        if (won) {
            uint256 payout = msg.value * 2;
            require(address(this).balance >= payout, "Contract insufficient balance");
            payable(msg.sender).transfer(payout);
        }

        emit BetPlaced(msg.sender, msg.value, choice, won);
    }

    function deposit() external payable {}

    function withdraw() external {
        require(msg.sender == owner, "Only owner");
        payable(owner).transfer(address(this).balance);
    }

    receive() external payable {}
}
