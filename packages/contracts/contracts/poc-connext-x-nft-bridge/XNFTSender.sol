// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC721} from "@openzeppelin/contracts/interfaces/IERC721.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {Create2} from "@openzeppelin/contracts/utils/Create2.sol";

import {IExecutor} from "../poc-connext/interfaces/IExecutor.sol";
import {IConnext} from "../poc-connext/interfaces/IConnext.sol";

import {IXNFT} from "./interfaces/IXNFT.sol";
import {XNFT} from "./XNFT.sol";

contract XNFTSender {
    event Sent(address indexed nftContractAddress, uint256 indexed tokenId);

    // The destination domain ID
    uint32 public ownDomain;

    // The destination domain ID
    uint32 public destinationDomain;

    // The destination receiver address
    address public destinationReceiverAddress;

    // This is required due to current connext implementation
    address public transactingAssetId;

    // Connext address
    address public connext;

    constructor(
        uint32 _ownDomain,
        uint32 _destinationDomain,
        address _destinationReceiverAddress,
        address _transactingAssetId,
        address _connext
    ) {
        ownDomain = _ownDomain;
        destinationDomain = _destinationDomain;
        destinationReceiverAddress = _destinationReceiverAddress;
        transactingAssetId = _transactingAssetId;
        connext = _connext;
    }

    function execute(address nftContractAddress, uint256 tokenId) public {
        IERC721(nftContractAddress).transferFrom(
            msg.sender,
            address(this),
            tokenId
        );
        bytes4 selector = bytes4(keccak256("receive(address,uint256)"));
        bytes memory callData = abi.encodeWithSelector(
            selector,
            nftContractAddress,
            tokenId
        );
        IConnext.CallParams memory callParams = IConnext.CallParams({
            to: destinationReceiverAddress,
            callData: callData,
            originDomain: ownDomain,
            destinationDomain: destinationDomain
        });
        IConnext.XCallArgs memory xcallArgs = IConnext.XCallArgs({
            params: callParams,
            transactingAssetId: transactingAssetId,
            amount: 0
        });
        IConnext(connext).xcall(xcallArgs);
        emit Sent(nftContractAddress, tokenId);
    }
}
