// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

// @hackathon This is coppied from
// https://github.com/connext/xapp-starter/blob/main/src/contract-to-contract-interactions/permissioned/XDomainPermissioned.sol

import {IConnext} from "./interfaces/IConnext.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";

import "hardhat/console.sol";

/**
 * @title XDomainPermissioned
 * @notice Example of a cross-domain permissioned call.
 */
contract XDomainPermissioned {
    event UpdateInitiated(address asset, uint256 newValue, address onBehalfOf);

    IConnext public immutable connext;

    constructor(IConnext _connext) {
        connext = _connext;
    }

    /**
   * Updates a cross-chain value.
   @dev Initiates the Connext bridging flow with calldata to be used on the target contract.
   */
    function update(
        address to,
        address asset,
        uint32 originDomain,
        uint32 destinationDomain,
        uint256 newValue
    ) external payable {
        // Encode function of the target contract (from PermissionedTarget.sol)
        // In this case: updateValue(uint256 newValue)
        bytes4 selector = bytes4(keccak256("updateValue(uint256)"));
        bytes memory callData = abi.encodeWithSelector(selector, newValue);

        IConnext.CallParams memory callParams = IConnext.CallParams({
            to: to,
            callData: callData,
            originDomain: originDomain,
            destinationDomain: destinationDomain
        });

        IConnext.XCallArgs memory xcallArgs = IConnext.XCallArgs({
            params: callParams,
            transactingAssetId: asset,
            amount: 0
        });

        connext.xcall(xcallArgs);

        emit UpdateInitiated(asset, newValue, msg.sender);
    }
}
