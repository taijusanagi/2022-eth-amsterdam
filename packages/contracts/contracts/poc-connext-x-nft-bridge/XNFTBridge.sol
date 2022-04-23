// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {IERC721} from "@openzeppelin/contracts/interfaces/IERC721.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {Create2} from "@openzeppelin/contracts/utils/Create2.sol";

import {IExecutor} from "../poc-connext/interfaces/IExecutor.sol";
import {IConnext} from "../poc-connext/interfaces/IConnext.sol";

import {IXNFT} from "./interfaces/IXNFT.sol";
import {XNFT} from "./XNFT.sol";

contract XNFTBridge {
    // The address of xDomainPermissioned.sol
    address public originContract;

    // The origin Domain ID
    uint32 public originDomain;

    constructor(address _originContract, uint32 _originDomain) {
        originContract = _originContract;
        originDomain = _originDomain;
    }

    function bridge(address originNFTContractAddress, uint256 tokenId) public {
        require(
            // origin domain of the source contract
            IExecutor(msg.sender).origin() == originDomain,
            "Expected origin domain"
        );
        require(
            // source contract
            IExecutor(msg.sender).originContract() == originContract,
            "Expected origin domain contract"
        );
        bytes32 salt = keccak256(
            abi.encodePacked(
                originNFTContractAddress,
                originDomain,
                originContract
            )
        );
        bytes memory creationCode = type(XNFT).creationCode;
        address computedAddress = Create2.computeAddress(
            salt,
            keccak256(creationCode)
        );
        address to = IExecutor(msg.sender).originContract();

        if (!Address.isContract(computedAddress)) {
            Create2.deploy(0, salt, creationCode);
        }
        if (IXNFT(computedAddress).exists(tokenId)) {
            IXNFT(computedAddress).transferFrom(address(this), to, tokenId);
        } else {
            IXNFT(computedAddress).mint(to, tokenId);
        }
    }
}
