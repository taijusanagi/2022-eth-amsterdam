// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

// @hackathon This is created by guessing from
// https://github.com/connext/xapp-starter/blob/main/src/contract-to-contract-interactions/permissioned/XDomainPermissioned.sol

interface IConnext {
    struct CallParams {
        address to;
        bytes callData;
        uint32 originDomain;
        uint32 destinationDomain;
    }

    struct XCallArgs {
        CallParams params;
        address transactingAssetId;
        uint256 amount;
    }

    function xcall(XCallArgs memory xCallArgs) external;
}
