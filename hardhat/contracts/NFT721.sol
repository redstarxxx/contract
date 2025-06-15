// SPDX-License-Identifier: MIT
// Contract address: 0x3044D7DB99Adc1Ed71cCFfC0D5de973C085FAF55
// Constructor args: HSNewNFT HNN
// Deployer address: 0xB8a71bdE974d16c9D2189919C64C6c8FEB402298

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT721 is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    event NFTMinted(address indexed to, uint256 indexed tokenId, string uri);
    event NFTBurned(uint256 indexed tokenId);
    event TokenURIUpdated(uint256 indexed tokenId, string newUri);

    constructor(
        string memory name,
        string memory symbol,
        address initialOwner
    ) ERC721(name, symbol) Ownable(initialOwner) {}

    function mint(
        address to,
        string memory uri
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit NFTMinted(to, tokenId, uri);
        nextTokenId++;
        return tokenId;
    }

    function burn(uint256 tokenId) public {
        require(
            isApprovedOrOwner(msg.sender, tokenId),
            "Not owner nor approved"
        );
        _burn(tokenId);
        emit NFTBurned(tokenId);
    }

    /// @notice 修改某个 NFT 的 tokenURI，仅限拥有者或授权者
    function updateTokenURI(uint256 tokenId, string memory newUri) public {
        require(
            isApprovedOrOwner(msg.sender, tokenId),
            "Not owner nor approved"
        );
        _setTokenURI(tokenId, newUri);
        emit TokenURIUpdated(tokenId, newUri);
    }

    function totalSupply() public view returns (uint256) {
        return nextTokenId;
    }

    /// @notice 检查某人是否有权限操作 tokenId（owner 或被授权者）
    function isApprovedOrOwner(
        address spender,
        uint256 tokenId
    ) public view returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner ||
            getApproved(tokenId) == spender ||
            isApprovedForAll(owner, spender));
    }
}
