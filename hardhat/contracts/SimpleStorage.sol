// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private value;

    function set(uint256 x) public {
        value = x;
    }

    function get() public view returns (uint256) {
        return value;
    }
}
