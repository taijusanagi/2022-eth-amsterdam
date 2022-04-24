// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { network, ethers } from "hardhat";

import {
  ORIGIN_DOMAIN_KOVAN,
  ORIGIN_DOMAIN_RINKEBY,
  ERC20_CONTRACT_RINKEBY,
  ERC20_CONTRACT_KOVAN,
  CONNEXT_CONTRACT_KOVAN,
  CONNEXT_CONTRACT_RINKEBY,
} from "../lib/constants";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const XNFTSender = await ethers.getContractFactory("XNFTSender");

  let ownDomain;
  let destinationDomain;
  let transactionAssetId = "";
  let connext = "";
  if (network.name === "rinkeby") {
    ownDomain = ORIGIN_DOMAIN_RINKEBY;
    destinationDomain = ORIGIN_DOMAIN_KOVAN;
    transactionAssetId = ERC20_CONTRACT_RINKEBY;
    connext = CONNEXT_CONTRACT_RINKEBY;
  } else if (network.name === "kovan") {
    ownDomain = ORIGIN_DOMAIN_KOVAN;
    destinationDomain = ORIGIN_DOMAIN_RINKEBY;
    transactionAssetId = ERC20_CONTRACT_KOVAN;
    connext = CONNEXT_CONTRACT_KOVAN;
  } else {
    return;
  }
  const xNFTSender = await XNFTSender.deploy(
    ownDomain,
    destinationDomain,
    transactionAssetId,
    connext
  );
  await xNFTSender.deployed();
  console.log("XNFTSender deployed to:", xNFTSender.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
