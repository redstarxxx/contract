// SPDX-License-Identifier: UNLICENSED
// 已经部署地址: 0xf0e920A448943EB785057efeB01537977092Bf6F
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HSERC20 is ERC20, Ownable {
    uint256 public constant MAX_TO_MINT = 1000 ether;

    event MintOccurred(address minter, address to, uint256 amount);
    error MustMintOverZero();
    error MintRequestOverMax();
    error NotOwner();
    error InvalidAddress();

    constructor(
        address initialOwner
    ) ERC20("Emperor Token", "EMP") Ownable(initialOwner) {}

    /**
     * 只有合约拥有者可以铸造代币
     * @param to 接收代币的钱包地址
     * @param amount 铸造数量，以 wei 为单位
     */
    function mint(address to, uint256 amount) external {
        // 检查调用者是否为合约拥有者
        if (msg.sender != owner()) revert NotOwner();

        // 验证接收地址
        if (to == address(0)) revert InvalidAddress();

        // 检查铸造数量是否有效
        if (amount == 0) revert MustMintOverZero();

        // 检查是否超过最大铸造限制
        if (amount + totalSupply() > MAX_TO_MINT) revert MintRequestOverMax();

        // 铸造代币
        _mint(to, amount);

        // 触发铸造事件
        emit MintOccurred(msg.sender, to, amount);
    }

    /**
     * 由合约拥有者铸造代币并支付 ETH
     * @param to 接收代币的钱包地址
     */
    function purchaseMint(address to) external payable onlyOwner {
        // 验证接收地址
        if (to == address(0)) revert InvalidAddress();

        // 获取铸造数量（与支付的 ETH 数量相等）
        uint256 amountToMint = msg.value;

        // 基础检查
        if (amountToMint == 0) revert MustMintOverZero();
        if (amountToMint + totalSupply() > MAX_TO_MINT)
            revert MintRequestOverMax();

        // 铸造代币
        _mint(to, amountToMint);

        // 触发事件
        emit MintOccurred(msg.sender, to, amountToMint);
    }

    /**
     * 获取合约当前的 ETH 余额
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * 允许合约拥有者提取合约中的 ETH
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");

        (bool success, ) = owner().call{value: balance}("");
        require(success, "Failed to withdraw Ether");
    }
}
