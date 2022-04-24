// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

// @hackathon This is created by guessing from
// https://github.com/connext/xapp-starter/blob/main/src/contract-to-contract-interactions/permissioned/PermissionedTarget.sol

interface IExecutor {
    function origin() external view returns (uint32);

    function originSender() external view returns (address);
}
