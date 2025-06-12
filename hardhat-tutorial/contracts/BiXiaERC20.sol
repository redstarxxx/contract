// SPDX-License-Identifier: UNLICENSED
//It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BiXiaERC20 is ERC20, Ownable {

    uint256 public constant MAX_TO_MINT = 1000 ether;
    uint256 public constant NATIVE_TO_TOKEN = 1;

    event PurchaseOccurred(address minter, uint256 amount);
    error MustMintOverZero();
    error MintRequestOverMax();
    error FailedToSendEtherToOwner();

    constructor(address initialOwner) ERC20("Mintable ERC 20", "MERC") Ownable(initialOwner) {}

    /**Purchases some of the token with native currency. */
    function purchaseMint() payable external {
        // Calculate amount to mint
        uint256 amountToMint = msg.value;

        // Check for no errors
        if(amountToMint == 0) revert MustMintOverZero();
        if(amountToMint + totalSupply() > MAX_TO_MINT) revert MintRequestOverMax();

        // Send to owner
        (bool success, ) = owner().call{value: msg.value}("");
        if(!success) revert FailedToSendEtherToOwner();

        // Mint to user
        _mint(msg.sender, amountToMint);
        emit PurchaseOccurred(msg.sender, amountToMint);
    }
}