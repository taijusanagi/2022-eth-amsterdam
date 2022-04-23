// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/interfaces/IERC721.sol";

interface IXNFT is IERC721 {
    function mint(address to, uint256 tokenId) external;

    function exists(uint256 tokenId) external view returns (bool);
}
