// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "./interfaces/IXNFT.sol";

contract XNFT is ERC721, IXNFT {
    constructor() ERC721("NFT", "NFT") {}

    address public bridge;

    modifier onlyBridge() {
        require(bridge == msg.sender, "XNFT: caller is not the bridge");
        _;
    }

    function setBridge(address _bridge) external {
        require(bridge == address(0x0), "XNFT: Bridge already set");
        bridge = _bridge;
    }

    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

    function mint(address to, uint256 tokenId) external onlyBridge {
        _mint(to, tokenId);
    }
}
