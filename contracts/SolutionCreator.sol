// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract SolutionCreator {
    address owner;

    constructor() {
        owner = msg.sender;
    }

    function generateSeed() private view returns (bytes32 seed) {
        seed = keccak256(abi.encode(block.number+2, uint256(0), msg.sender));
    }

    function solve(uint256 seed) private pure returns (bytes32) {
        uint128 evenSum = 0;
        uint128 oddSum = 0;

        for (uint256 i = 0; i < 32; i++) {
            uint256 num = uint8(seed >> (i * 8));
            if (num % 2 == 0) {
                evenSum += uint128(num);
            } else {
                oddSum += uint128(num);
            }
        }

        return bytes32(abi.encodePacked(evenSum, oddSum));
    }

    function getSolution() private view returns (bytes32) {
        return solve(uint256(generateSeed()));
    }

    function createSolutionContract() public returns (address instance) {
        require(msg.sender == owner, "You aren't the owner");

        bytes32 solution = getSolution();
        
        /// @solidity memory-safe-assembly
        assembly {
            mstore(
                0x00,
                0x3d601d80600a3d3981f371000000000000000000000000000000000000000000
            )
            mstore(0xb, shl(0x70, solution))
            mstore(
                0x1d,
                0x3258351b175952593df300000000000000000000000000000000000000000000
            )
            instance := create(0, 0, 39)
        }

        require(instance != address(0), "create failed");
    }
}
