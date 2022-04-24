// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC721} from "@openzeppelin/contracts/interfaces/IERC721.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {Create2} from "@openzeppelin/contracts/utils/Create2.sol";

import {IExecutor} from "./_poc/interfaces/IExecutor.sol";
import {IConnext} from "./_poc/interfaces/IConnext.sol";

import {IXNFT} from "./interfaces/IXNFT.sol";
import {XNFT} from "./XNFT.sol";

contract XNFTReceiver is Ownable {
    // The source domain ID
    uint32 public sourceDomain;

    // Connext address
    address public connext;

    constructor(uint32 _sourceDomain, address _connext) {
        sourceDomain = _sourceDomain;
        connext = _connext;
    }

    modifier onlyConnext() {
        require(
            connext == msg.sender,
            "XNFTReceiver: caller is not the connext"
        );
        _;
    }

    function execute(address originNFTContractAddress, uint256 tokenId)
        public
        onlyConnext
    {
        require(
            // source domain check
            IExecutor(msg.sender).origin() == sourceDomain,
            "Expected source domain"
        );
        // Use create2 and use sourceDomain, originNFTContractAddress to make it counterfactual
        bytes32 salt = keccak256(
            abi.encodePacked(sourceDomain, originNFTContractAddress)
        );
        bytes memory creationCode = type(XNFT).creationCode;
        address computedAddress = Create2.computeAddress(
            salt,
            keccak256(creationCode)
        );
        address to = IExecutor(msg.sender).originSender();
        if (!Address.isContract(computedAddress)) {
            Create2.deploy(0, salt, creationCode);
        }
        // It is using lock and mint pattern.
        // if the token id is already minted, it needs to be transferred from this contract
        // if the token id is not yet minted, it needs to be minted
        if (IXNFT(computedAddress).exists(tokenId)) {
            IXNFT(computedAddress).transferFrom(address(this), to, tokenId);
        } else {
            IXNFT(computedAddress).mint(to, tokenId);
        }
    }
}
