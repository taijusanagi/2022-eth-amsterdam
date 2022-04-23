// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

// @hackathon This is coppied from
// https://github.com/connext/xapp-starter/blob/main/src/contract-to-contract-interactions/permissioned/PermissionedTarget.sol

import {IExecutor} from "./interfaces/IExecutor.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PermissionedTarget
 * @notice A contrived example target contract.
 */
contract PermissionedTarget is Ownable {
    event Updated(uint256 newValue);

    uint256 public value;

    // The address of xDomainPermissioned.sol
    address public originContract;

    // The origin Domain ID
    uint32 public originDomain;

    // constructor(address _originContract, uint32 _originDomain) {
    //     originContract = _originContract;
    //     originDomain = _originDomain;
    // }
    constructor(uint32 _originDomain) {
        originDomain = _originDomain;
    }

    // Permissioned function
    // owner = connext contract
    // function updateValue(uint256 newValue) external onlyOwner {
    function updateValue(uint256 newValue) external {
        // Note: This is an important security consideration. If your target
        //       contract function is meant to be permissioned, it must check
        //       that the originating call is from the correct domain and sender.
        // require(
        //     // origin domain of the source contract
        //     IExecutor(msg.sender).origin() == originDomain,
        //     "Expected origin domain"
        // );
        // require(
        //     // msg.sender of xcall from the origin domain
        //     IExecutor(msg.sender).originSender() == originContract,
        //     "Expected origin domain contract"
        // // );

        value = newValue;
        emit Updated(value);
    }
}
