// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Note611 {
    string[] private notes;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only contract owner can perform this action"
        );
        _;
    }

    function addNote(string memory _note) public {
        notes.push(_note);
    }

    function getNotes() public view returns (string[] memory) {
        return notes;
    }

    function clearNotes() public onlyOwner {
        delete notes;
    }
}
